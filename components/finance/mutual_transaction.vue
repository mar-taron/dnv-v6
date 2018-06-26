<template>
	<div class="container-fluid">
      <div class="row">
		<div class="wrapper single big_data">
			<time-display></time-display>
			<ol class="breadcrumb">
				  <li class="breadcrumb-item"><a href="#">Finance</a></li>
				  <li class="breadcrumb-item active">Mutual Transaction</li>
			</ol>
			<h1 class="page-header">Mutual Transaction</h1>
				<div class="white_pad table_wrap">
					<spinner v-show="loading" class="spinner"></spinner>
					<div class="advanced_search_filter_panel">
						<div class="row">
						<div class="col-lg-2 col-md-2 col-sm-2">
							<label>Carrier:</label>
							<select2 :options="carrier_options" v-model="carrier">
							</select2>
						</div>
							<div class="col-lg-2 col-md-2 col-sm-2">
							<label>Type:</label>
							<select2 :options="type_options" v-model="type">
								<option value="0">All</option>
							</select2>
						</div>
						<div class="col-lg-5 col-md-6 col-sm-6 pad-left pad-5 pad-right">
						<div class="col-md-6 col-sm-6 pad-left pad-right">
							<div class="col-md-3 col-sm-4 pad-left pad-right">
								<label for="start_date">Period:</label>
							</div>
							<div class="col-md-9 col-sm-8 pad-left pad-right">
								<el-date-picker style="width: 100%;" type="datetime" v-model="start_date" :picker-options="{}" placeholder="Enter Date/Time"></el-date-picker>
							</div>
						</div>
						<div class="col-md-4 col-sm-4 pad-left pad-right">
							<div class="col-md-2 col-sm-2 text-center pad-left pad-right">
								<label for="start_date">~</label>
							</div>
							<div class="col-md-10 col-sm-10 pad-left pad-right">
								<el-date-picker style="width: 100%;" type="datetime" v-model="end_date" :picker-options="{}" placeholder="Enter Date/Time"></el-date-picker>
							</div>	
						</div>
						</div>
						<div class="col-lg-2 col-md-2 col-sm-2 pad-5 pad-right pad-left">
							<select2 :options="gmt_options" v-model="gmt">
								<option disabled value="0">Select one</option>
							</select2>
						</div>
						<div class="little-space"></div>
						<div class="col-lg-1 col-md-2 col-sm-2">
							<div class="button_set m-top-10">
								<a class="btn btn-primary">
									Submit
								</a>
								<!-- <a class="btn btn-default"  v-on:click="exportCSV()">
									Download
								</a> -->
							</div>
						</div>
						</div>
						<div class="clearfix"></div>
					</div>
					<div class="table-responsive">
						<table class="table table-striped table-hover carrier_groups centrum">
						  <thead>
                            <tr>
								<th>Begin Date</th>
								<th>2014-02-03 00:00:00+0000</th>
								<th>Begin Balance</th>
								<th>0</th>
							</tr>
						  </thead>
						  <tbody>
							
						  </tbody>
						</table>
					</div>
					<div class="clearfix little-space"></div>
					<div class="table-responsive">
						<table class="table table-striped table-hover carrier_groups centrum">
						  <thead>
                            <tr>
								<th>Date</th>
								<th>Type</th>
								<th>Carrier</th>
								<th>Amount</th>
								<th>Balance</th>
							</tr>
						  </thead>
						  <tbody>
							<tr v-for="transaction in transactions">
							  <td>{{transaction.date}}</td>
							  <td>{{transaction.type}}</td>
							  <td>{{transaction.carrier}}</td>
							  <td>{{transaction.amount}}</td>
							  <td>{{transaction.balance}}</td>
							</tr>
						  </tbody>
						</table>
					</div>
				</div>
		    </div>
		</div>
	  </div>
	</div>
</template>

<script>   
	const vSelect = require('vue!../main_components/select.vue');
	const api = require("../../api");
	const vSpinner = require('vue!../main_components/fadeloader.vue');
	module.exports = {
		components: {
			'select2': vSelect,
			'spinner': vSpinner
		},
		data: function(){
			return {
				loading: false,
				carrier_options: [],
				type_options: [
					{ id: 'payment received', text: 'Payment Received' },
					{ id: 'payment sent', text: 'Payment Sent' },
					{ id: 'invoice received', text: 'Invoice Received' },
					{ id: 'invoice sent', text: 'Invoice Sent' },
					{ id: 'credit note received', text: 'Credit Note Received' },
					{ id: 'debit note received', text: 'Debit Note Received' },
					{ id: 'debit note sent', text: 'Debit Note Sent' },
					{ id: 'reset', text: 'Reset' },


				],
				gmt: '+0:00',
				gmt_options: [
						{ id: '-12:00', text: 'GMT -12:00' },
						{ id: '-11:00', text: 'GMT -11:00' },
						{ id: '-10:00', text: 'GMT -10:00' },
						{ id: '-9:00', text: 'GMT -9:00' },
						{ id: '-8:00', text: 'GMT -8:00' },
						{ id: '-7:00', text: 'GMT -7:00' },
						{ id: '-6:00', text: 'GMT -6:00' },
						{ id: '-5:00', text: 'GMT -5:00' },
						{ id: '-4:00', text: 'GMT -4:00' },
						{ id: '-3:00', text: 'GMT -3:00' },
						{ id: '-2:00', text: 'GMT -2:00' },
						{ id: '-1:00', text: 'GMT -1:00' },
						{ id: '+0:00', text: 'GMT +0:00' },
						{ id: '+1:00', text: 'GMT +1:00' },
						{ id: '+2:00', text: 'GMT +2:00' },
						{ id: '+3:00', text: 'GMT +3:00' },
						{ id: '+4:00', text: 'GMT +4:00' },
						{ id: '+5:00', text: 'GMT +5:00' },
						{ id: '+6:00', text: 'GMT +6:00' },
						{ id: '+7:00', text: 'GMT +7:00' },
						{ id: '+8:00', text: 'GMT +8:00' },
						{ id: '+9:00', text: 'GMT +9:00' },
						{ id: '+10:00', text: 'GMT +10:00' },
						{ id: '+11:00', text: 'GMT +11:00' },
						{ id: '+12:00', text: 'GMT +12:00' },
				],
				carrier: '',
				start_date: '',
				end_date: '',
				type: '0',
				options: [
				  { id: 1, value: 'carrier1', text: 'Carrier 1' },
				  { id: 2, value: 'carrier2', text: 'Carrier 2' },
				  { id: 3, value: 'carrier3', text: 'Carrier 3' },
				  { id: 4, value: 'carrier4', text: 'Carrier 4' },
				  { id: 5, value: 'carrier5', text: 'Carrier 5' }
			    ],
				transactions: [
					{
					  date: '2016-11-16 08:47:30+0000',
					  type: 'Payment Received',
					  carrier: '',
					  amount: '22',
					  balance: '22'
					},
					{
					  date: '2016-11-16 08:47:30+0000',
					  type: 'Payment Received',
					  carrier: '',
					  amount: '22',
					  balance: '22'
					},
					{
					  date: '2016-11-16 08:47:30+0000',
					  type: 'Payment Received',
					  carrier: '',
					  amount: '22',
					  balance: '22'
					},
					{
					  date: '2016-11-16 08:47:30+0000',
					  type: 'Payment Received',
					  carrier: '',
					  amount: '22',
					  balance: '22'
					},
					{
					  date: '2016-11-16 08:47:30+0000',
					  type: 'Payment Received',
					  carrier: '',
					  amount: '22',
					  balance: '22'
					}
			    ]
			}
        },
		methods: {
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
									var self = this;
									var carriers = body.payload.items

									carriers.forEach(function(temp, i) {
										var carrier = {};
										carrier.id = temp.client_id;
										carrier.text = temp.name;
										self.carrier_options.push(carrier);
									});
									console.log(this.carrier_options);
								}
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
				})
			},
			exportCSV: function () {
				var vm = this;		
				var csvArray = new Array();
				var fields = ["date", "type", "carrier", "amount", "balance"];
				csvArray.push(fields);
				var csvContent = "data:text/csv;charset=utf-8,";                        
				this.transactions.forEach(function (transaction, i) {
					var values = new Array();
					if(i != 0)
					{
						csvContent += ",\n";
					} 
					csvContent += "{\n";
					csvContent += "date:" + transaction.date + ",\n";
					csvContent += "type:" + transaction.type + ",\n";
					csvContent += "carrier:" + transaction.carrier + ",\n";
					csvContent += "amount:" + transaction.amount + ",\n";                
					csvContent += "balance:" + transaction.balance + "\n";
					csvContent += "}"; 

					values.push(transaction.date + "");
					values.push(transaction.type);
					values.push(transaction.carrier);
					values.push(transaction.amount);
					values.push(transaction.balance);
					
					csvArray.push(values);                
				});	                                
				window.open(encodeURI(csvContent) );   
				exportToCsv('finance_mutual_transaction_export.csv', csvArray);         
			},
		},
		created(){
			this.fetchCarriers();
		}
	}
</script>

<style>
#app > div.container-fluid > div > div > div > div.advanced_search_filter_panel > div.row > div.col-lg-5.col-md-6.col-sm-6.pad-left.pad-right, 
#app > div.container-fluid > div > div > div > div.advanced_search_filter_panel > div.row > div.col-lg-2.col-md-2.col-sm-2.pad-right.pad-left{
		margin-top: 25px;
}
@media (max-width: 767px){
	.pad-5{
	padding-left: 15px!important;
	padding-right: 15px!important;
}
}

</style>
