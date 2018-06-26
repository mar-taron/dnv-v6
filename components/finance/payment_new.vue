<template>
	<div class="container-fluid">
      <div class="row">
		<div class="wrapper single">
			<time-display></time-display>
			<ol class="breadcrumb">
				  <li class="breadcrumb-item"><a href="#">Finance</a></li>
				  <li class="breadcrumb-item">
					  <router-link to="/finance/payment">Payment</router-link>
				  </li>
				  <li class="breadcrumb-item active">New</li>
			</ol>
			<h1 class="page-header">Add Payment</h1>
			<router-link to="/finance/payment" class="btn btn_white back"><span class="dnl_icon dnl_import"></span> Back </router-link>
			<form class="form">
				<div class="white_pad">
					<div class="row">
						<div class="col-md-3 col-sm-4">
							<label>Carrier:</label>
							<select class="selectable" v-model="carrier">
								<option v-for="item in carrier_options" v-bind:value="item.id">
									{{ item.text }}
								</option>
							</select>
						</div>
						<div class="col-md-3 col-sm-4">
							<label for="received_on">Received On:</label>
							<el-date-picker style="width: 100%;" type="datetime" v-model="received_on" :picker-options="{}" placeholder="Enter Date Time"></el-date-picker>
							<!-- <el-date-picker style="width: 100%;" type="datetime" v-model="received_on" :picker-options="{}" :class="{'input': true, 'is-danger': errors.has('received_on') }" v-validate="{ rules: {required: true, regex: /^(19|20)[0-9]{2}[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01]) (2[0-3]|[0-1][0-9]):[0-5][0-9]:[0-5][0-9]$/} }" placeholder="Enter Date Time"></el-date-picker>
							<span v-show="errors.has('received_on')" class="help is-danger">{{ errors.first('received_on') }}</span> -->
						</div>
						<div class="col-md-3 col-sm-4">
							<label for="amount">Amount:</label>
							<input type="text" name="amount" v-model="amount" class="form-control" :class="{'input': true, 'is-danger': errors.has('amount') }" v-validate="{ rules: {required: true, regex: /^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/} }" placeholder="Enter Amount">
							<span v-show="errors.has('amount')" class="help is-danger">{{ errors.first('amount') }}</span>
						</div>
						<div class="clearfix little-space"></div>
						<div class="col-md-3 col-sm-4">
								<label for="note">Note:</label>
								<input type="text" name="note" v-model="note" class="form-control" placeholder="Enter Note">
						</div>
						<div class="col-md-3 col-sm-4">
							<label>Type:</label>
							<select class="selectable" v-model="type">
								<option v-for="item in type_options" v-bind:value="item.id">
									{{ item.text }}
								</option>
							</select>
						</div>
						<div class="clearfix little-space"></div>
						<div v-if="type=='invoice payment received'" class="table-responsive">
							<table class="table table-striped table-hover carrier_groups centrum">
								<thead>
									<tr>
										<th>Invoice Number</th>
										<th>Invoice Period</th>
										<th>Due Date</th>
										<th>Invoice Amount</th>
										<th>Unpaid Amount</th>
										<th>Pay Amount</th>
										<th>
											<a class="btn btn-primary mini" @click="addInvoice">
												Add Invoice
											</a>
										</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="(invoice, index) in invoices">
										<td></td>
										<td></td>
										<td></td>
										<td></td>
										<td></td>
										<td></td>
										<td>
											<a class="action action_delete" data-toggle="tooltip" data-placement="top" title="Delete" @click="invoices.splice(index, 1)">
												<span class="dnl_icon dnl_action_delete"></span>
											</a>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div class="clearfix little-space"></div>
						<div class="col-md-12">
								<div class="button_set little-space">
									<a class="btn btn-primary mini" @click="validateForNewPayment">
										Submit
									</a>
									<a class="btn btn-default mini" @click="reset">
										Reset
									</a>
								</div>
						</div>
					</div>
				</div>
			</form>
		</div>
	  </div>
	</div>
</template>

<script>   
	const vSelect = require('vue!../main_components/select.vue');
	const api = require("../../api");
	import { mapActions } from 'vuex';
	module.exports = {
		components: {
			'select2': vSelect
		},
		props:['payment_type'],
		data: function(){
            return {
				invoices: [],
				pageOne: {
					currentPage: 0,
					totalPages: 10,
					cntPerPage: 30,
				},
				payment: {},
				type: '',
				type_options: [
					// { id: 'payment', text: 'payment' },
					// { id: 'invoice payment', text: 'invoice payment' },

					// { id: 'n/a', text: 'n/a' },
					// { id: 'undefined', text: 'undefined' },
					// { id: 'invoice payment sent', text: 'invoice payment sent' },
					// { id: 'invoice payment received', text: 'invoice payment received' },
					// { id: 'prepay payment received', text: 'prepay payment received' },
					// { id: 'payment sent', text: 'payment sent' },
					// { id: 'credit note received', text: 'credit note received' },
					// { id: 'credit note sent', text: 'credit note sent' },
					// { id: 'reset', text: 'reset' },
					// { id: 'offset', text: 'offset' },
					// { id: 'debit received', text: 'debit received' },
					// { id: 'debit sent', text: 'debit sent' },
					// { id: 'mutual reset', text: 'mutual reset' },
					// { id: 'actual reset', text: 'actual reset' },
					// { id: 'scc cost', text: 'scc cost' },
				],
				carrier: '',
				carrier_options: [],
			  groupname: '',
			  received_on: '',
			  amount: '',
			  note: '',
			  options: [
				  { id: 1, value: 'carrier1', text: 'Carrier 1' },
				  { id: 2, value: 'carrier2', text: 'Carrier 2' },
				  { id: 3, value: 'carrier3', text: 'Carrier 3' },
				  { id: 4, value: 'carrier4', text: 'Carrier 4' },
				  { id: 5, value: 'carrier5', text: 'Carrier 5' }
			  ]
            }
        },
		created () {
			this.fetchCarriers();
			this.fetchType();
		},
		methods: {
			...mapActions({
				setMessage: 'app_message/setAppMessage'
			}),
			addInvoice() {
				this.invoices.push({});
			},
			reset() {
				this.received_on = '';
				this.amount = '';
				this.note = '';
				this.carrier = this.carrier_options.length>0? this.carrier_options[0].id: 0;
				this.type = this.type_options[0].id;
			},
			fetchType() {
				if(this.payment_type == 'received') {
					this.type_options = [
						{ id: 'prepay payment received', text: 'prepay payment received' },
						{ id: 'invoice payment received', text: 'invoice payment received' },
					];
					this.type = 'prepay payment received';
				}
				else if (this.payment_type == 'sent') {
					this.type_options = [
						{ id: 'payment sent', text: 'payment sent' },
						{ id: 'invoice payment sent', text: 'invoice payment sent' },
					];
					this.type = 'payment sent';
				}
			},
			getRegenerateForRequest() {
				const regenerate_balance = {};
				regenerate_balance.reset_mutual_balance = true;
				regenerate_balance.reset_actual_balance = true;
				regenerate_balance.new_balance = 0;
				regenerate_balance.start_time = this.received_on;
				
				return regenerate_balance;
			},
			regenerateBalance() {
				const reqBody = this.getRegenerateForRequest();
				const url = api.getEndpointUrl() + '/v1/carrier/'+this.carrier+'/regenerate_balance';
				this.$http.post(url, reqBody)
					.then(response => {
						if (response.body.success) {
							this.$router.push('/finance/payment');
							this.setMessage('Payment was created successfully');
						}
					})
					.catch(error => {
						console.log(error)
						this.setMessage({
							message: 'Failed to create regenerateBalance',
							type: 'error'
						})
					})
			},
			getPaymentForRequest () {
				const payment = JSON.parse( JSON.stringify( this.payment ) )
				var current = new Date();
				// payment.payment_time = current;
				// payment.receiving_time = this.received_on;
				payment.amount = this.amount;
				payment.paid_on = this.received_on;
				// payment.client_id = this.carrier;
				payment.note = this.note;
				payment.payment_type = this.type;
				
				return payment;
			},
			createNewPayment () {
				const reqBody = this.getPaymentForRequest();
				const url = api.getEndpointUrl() + '/v1/carrier/'+this.carrier+'/payment';
				this.$http.post(url, reqBody)
					.then(response => {
						if (response.body.success) {
							this.regenerateBalance();
							// this.$router.push('/finance/payment');
							// this.setMessage('Payment was created successfully');
						}
					})
					.catch(error => {
						console.log(error)
						this.setMessage({
							message: 'Failed to create payment',
							type: 'error'
						})
					})
			},
			validateForNewPayment () {
				var vm = this;
				this.$validator.validateAll().then(() => {
					const err = this.$validator.getErrors();
					if (err.errors.length > 0 || vm.received_on == '') {
						var msg;
						if(err.errors.length > 0)
							msg = 'Validation failed';
						else if(vm.received_on == '')
							msg = 'Received On not valid date';
						vm.setMessage({
							message: msg,
							type: 'error'
						})
					}
					else {
						vm.createNewPayment();
					}
						
				}).catch((error) => {
					// eslint-disable-next-line
					console.log(error)
					vm.setMessage({
						message: 'Validation failed',
						type: 'error'
					})
				});
			},
			fetchCarriers() {
				var per_page = 1;
                var url = api.getEndpointUrl() + "/v1/carrier/list?per_page=" + per_page
                this.loading = true;
				this.$http.get(url)
				.then(response => {
					const body = response.body
					if (body.success) {
						this.loading = false;
						per_page = body.payload.total;

						url = api.getEndpointUrl() + "/v1/carrier/list?per_page=" + per_page
						this.loading = true;
						this.$http.get(url)
							.then(response => {
								const body = response.body
								if (body.success) {
									this.loading = false;
									var self = this;
									var carriers = body.payload.items

									carriers.forEach(function(temp, i) {
										var carrier = {};
										carrier.id = temp.client_id;
										carrier.text = temp.name;
										self.carrier_options.push(carrier);
										if(i == 0)
											self.carrier = carrier.id;
									});
								}
								else
									this.loading = false;
							})
							.catch(error => {
								console.log(error);
								this.loading = false;
							})
					}
				})
				.catch(error => {
					console.log(error)
					this.loading = false;
				})
			},
		}
	}
</script>

<style>
	.button_set {
		text-align: center;
	}
</style>
