<template>
	<div class="container-fluid">
      <div class="row">
		<div class="wrapper single">
			<time-display></time-display>
			<ol class="breadcrumb">
				  <li class="breadcrumb-item"><a href="#">Management</a></li>
				  <li class="breadcrumb-item active">Wizard</li>
			</ol>
			<h1 class="page-header">Wizard</h1>
			<dtabs class="user_tabs wizard_steps">
				<tab label="Define Carrier" class="" p="STEP 1" icon="dnl_icon dnl_persona" selected>
				<spinner v-show="loading" class="spinner"></spinner>
					<div class="row">
						<div class="col-md-3 col-sm-4">
							<div class="form-group">
								<label>Carrier Name:</label>
								<!--<select2 :options="carrier_options" v-model="is_new_carrier" class="inline-block">
								</select2>-->
								<select class="selectable" v-model="is_new_carrier">
									<option v-for="item in carrier_options" v-bind:value="item.id">
										{{ item.text }}
									</option>
								</select>
							</div>
						</div>
						<div class="col-md-3 col-sm-4" v-if="is_new_carrier">
							<div class="form-group">
								<label class="m-top-15"></label>
								<input type="text" name="carrier_name" v-model="carrier_name" class="form-control" :class="{'input': true, 'is-danger': errors.has('carrier_name') }" v-validate="'required'" placeholder="Enter Carrier Name">
								<span v-show="errors.has('carrier_name')" class="help is-danger">{{ errors.first('carrier_name') }}</span>
							</div>
						</div>
						<div class="col-md-3 col-sm-4" v-if="!is_new_carrier">
							<div class="form-group">
								<label class="m-top-15"></label>
								<select class="selectable" v-model="carrier_id">
									<option v-for="item in existing_carrier_options" v-bind:value="item.id">
										{{ item.text }}
									</option>
								</select>
							</div>
						</div>
						<div class="clearfix"></div>
						<div class="col-md-3 col-sm-4" v-if="is_new_carrier">
							<div class="form-group">
								<label>Mode:</label>
								<!--<select2 :options="mode_options" v-model="mode" class="inline-block">
								</select2>-->
								<select class="selectable" v-model="mode">
									<option v-for="item in mode_options" v-bind:value="item.id">
										{{ item.text }}
									</option>
								</select>
							</div>
						</div>
						<div class="col-md-3 col-sm-4" v-if="is_new_carrier">
							<div class="form-group">
								<label for="test_credit">{{ mode === true ? 'Test Credit:' : 'Allowed Credit:' }}</label>
								<input v-if="mode === true" type="text" name="test_credit" v-model="test_credit" class="form-control" :class="{ 'input': true, 'is-danger': errors.has('test_credit') }" v-validate="'numeric'" data-vv-as="Test Credit" placeholder="Enter Test Credit">
								<span v-if="mode === true" v-show="errors.has('test_credit')" class="help is-danger">{{ errors.first('test_credit') }}</span>
								<div v-if="mode === false" class="checkbox checkbox-success" style="display: flex;">
									<input id="is_unlimited" name="is_unlimited" style="margin: 10px 5px;" v-model="is_unlimited" type="checkbox">
									<label for="is_unlimited" style="margin: 10px 5px;">Unlimited</label>
									<input v-if="is_unlimited === false" type="text" style="width: 80%; float: right;" name="allowed_credit" v-model="allowed_credit" class="form-control" :class="{ 'input': true, 'is-danger': errors.has('allowed_credit') }" v-validate="'numeric'" data-vv-as="Allowed Credit" placeholder="Enter Allowed Credit">
									<span v-if="is_unlimited === false" v-show="errors.has('allowed_credit')" class="help is-danger">{{ errors.first('allowed_credit') }}</span>
								</div>
							</div>
						</div>
						<!--<div class="col-md-3 col-sm-4" v-if="is_new_carrier">
							<label for="test_credit">Test Credit:</label>
							<input type="text" name="test_credit" v-model="test_credit" class="form-control medium" placeholder="Test Credit">
						</div>-->
						<div class="clearfix"></div>
						<div class="col-md-3 col-sm-4">
							<div class="form-group">
								<label>Trunk Name:</label>
								<!--<select2 :options="trunk_options" v-model="is_ingress_trunk" class="inline-block">
								</select2>-->
								<select class="selectable" v-model="is_ingress_trunk">
									<option v-for="item in trunk_options" v-bind:value="item.id">
										{{ item.text }}
									</option>
								</select>
							</div>
						</div>
						<div class="col-md-3 col-sm-4">
							<div class="form-group">
								<label class="m-top-15"></label>
								<input type="text" name="trunk_name" v-model="trunk_name" class="form-control" :class="{'input': true, 'is-danger': errors.has('trunk_name') }" v-validate="'required'" placeholder="Enter Trunk Name">
								<span v-show="errors.has('trunk_name')" class="help is-danger">{{ errors.first('trunk_name') }}</span>
							</div>
						</div>
						<div class="clearfix"></div>
						<div class="col-md-3 col-sm-4">
							<label for="cps_limit">CPS Limit:</label>
							<input type="text" name="cps_limit" v-model="cps_limit" class="form-control" :class="{'input': true, 'is-danger': errors.has('cps_limit') }" v-validate="'numeric'" placeholder="Enter CPS Limit">
							<span v-show="errors.has('cps_limit')" class="help is-danger">{{ errors.first('cps_limit') }}</span>
						</div>
						<div class="col-md-3 col-sm-4">
							<label class="pad-top" for="call_limit">Call Limit:</label>
							<input type="text" name="call_limit" v-model="call_limit" class="form-control" :class="{'input': true, 'is-danger': errors.has('call_limit') }" v-validate="'numeric'" placeholder="Enter Call Limit">
							<span v-show="errors.has('call_limit')" class="help is-danger">{{ errors.first('call_limit') }}</span>
						</div>
						<div class="clearfix little-space"></div>
						<div class="col-md-3 col-sm-4 btn-center">
							<a class="btn btn-primary mini m-top-20" @click="toStep2">Next</a>
						</div>
					</div>
				</tab>
				<tab label="Define IP" class="" p="STEP 2" icon="dnl_icon dnl_setting">
					<div class="table-responsive">
						<div class="table_filters">
							<a class="btn btn-primary mini pull-right marg-btn" @click="add_ip" >
								<span class="dnl_icon dnl_add"></span> Add Host
							</a>
						</div>
						<table class="table table-striped table-hover ips">
						  <thead>
							<tr>
							  <th>IP</th>
							  <th>Port</th>
							  <th class="width-65">Action</th>
							</tr>
						  </thead>
						  <tbody>
							<tr v-for="(ip, index) in ips">
							  <td>
								  <input type="text" :name="ip.ip" placeholder="Enter IP" class="form-control" v-model="ip.ip">
							  </td>
							  <td>
								  <input type="text" :name="ip.port" placeholder="Enter Port" class="form-control" v-model="ip.port">
							  </td>
							  <td class="width-65 text-center">
								  <a data-toggle="tooltip" data-placement="top" title="" class="action action_delete" data-original-title="Delete" @click="delete_ip(index)">
									  <span class="dnl_icon dnl_action_delete"></span>
								  </a>
							  </td>
							</tr>
						  </tbody>
						</table>
					</div>
					<div class="clearfix little-space"></div>
					<div class="row">
						<div class="col-md-6 col-sm-6 col-xs-12">
							<a class="btn btn-default mini min previousBtn" @click="prevTab">Previous</a>
							<a class="btn btn-primary mini" @click="toStep3">Next</a>
						</div>
					</div>
					<div class="clearfix"></div>
				</tab>
				<tab label="Define Route" class="" p="STEP 3" icon="dnl_icon dnl_modem">
					<div class="row">
					   <div class="col-md-3 col-sm-4" v-if="routing" >
						<div class="form-group fix-select">
							<div class="form-group">
								<label>Host Routing:</label>
								<select2 :options="host_routing_options" v-model="host_routing">
								</select2>
							</div>
						</div>
					  </div> 
					  <div class="col-md-3 col-sm-4">
						<div class="form-group fix-select">
							<div class="form-group">
								<label>Rate_table:</label>
								<select2 :options="rate_table_options" v-model="rate_table">
								</select2>
							</div>
						</div>
					  </div>
					  <div class="col-md-1 col-sm-2">
						  <div class="inline_actions">
							  <router-link to="/switch/rate_table/new" data-toggle="tooltip" data-placement="top" title="Add New..."><span class="dnl_icon dnl_add"></span></router-link>
							  <a data-toggle="tooltip" data-placement="top" title="Refresh..."><span class="dnl_icon dnl_reload"></span></a>
						  </div>
					  </div>
					  <div class="clearfix"></div>
					  <div class="col-md-3 col-sm-4">
						<div class="form-group fix-select">
							<div class="form-group">
								<label>Routing:</label>
								<select class="selectable" v-model="routing">
									<option v-for="item in routing_type_options" v-bind:value="item.id">
										{{ item.text }}
									</option>
								</select>
							</div>
						</div>
					  </div>
					  <div class="clearfix"></div>
					  <div class="col-md-6 col-sm-12 col-xs-12">
						  <div class="form-group">
							  <label for="groupname">Egress Trunk List:</label>
							  <el-transfer v-model="egress_trunks" :titles="['Egress Trunk List:', 'Selected Egress Trunk List:']" :data="egress_trunk_options">
							  </el-transfer>
						  </div>
					  </div>
					  <div class="col-md-1 col-sm-2">
						  <div class="inline_actions">
							  <router-link to="/routing/egress_trunk/new"><span class="dnl_icon dnl_add"></span></router-link>
							  <a><span class="dnl_icon dnl_reload"></span></a>
						  </div>
					  </div>
					</div>
					<div class="clearfix little-space"></div>
					<div class="row">
						<div class="col-md-6 col-sm-6 col-xs-12 btn-center">
							<a class="btn btn-default mini min previousBtn" @click="prevTab">Previous</a>
							<a class="btn btn-primary mini" @click="toStep4">Next</a>
						</div>
					</div>
					<div class="clearfix"></div>
				</tab>
				<tab label="Define User Portal" class="" p="STEP 4" icon="dnl_icon dnl_person">
					<div class="row">
						<div class="col-md-3 col-sm-4">
							<div class="form-group">
								<label for="username">Username:</label>
								<input type="text" name="username" v-model="username" class="form-control" :class="{'input': true, 'is-danger': errors.has('username') }" v-validate="'required'" placeholder="Enter Username">
								<span v-show="errors.has('username')" class="help is-danger">{{ errors.first('username') }}</span>
							</div>
						</div>
						<div class="col-md-3 col-sm-4">
							<div class="form-group">
								<label for="password">New Password:</label>
								<input type="password" name="password" v-model="password" class="form-control" autocomplete="new-password" placeholder="Enter Password">
							</div>
						</div>
						<div class="clearfix"></div>
						<hr>
						<h2 class="role_section_name">Permissons</h2>
						<div class="col-md-3 col-sm-6">
							<h4 class="role_section_name">Management</h4>
							<div class="form-group">
								<div class="checkbox checkbox-success">
									<input id="is_account_summary" name="is_account_summary" type="checkbox" v-model="is_account_summary" > 
									<label for="is_account_summary">Account Summary</label>
								</div>
							</div>
							<div class="form-group">
								<div class="checkbox checkbox-success">
									<input id="is_rate_table" name="is_rate_table" type="checkbox" v-model="is_rate_table" > 
									<label for="is_rate_table">Rate Table</label>
								</div>
							</div>
							<div class="form-group">
								<div class="checkbox checkbox-success">
									<input id="is_trunks" name="is_trunks" type="checkbox" v-model="is_trunks" > 
									<label for="is_trunks">Trunks</label>
								</div>
							</div>
							<div class="form-group">
								<div class="checkbox checkbox-success">
									<input id="is_products" name="is_products" type="checkbox" v-model="is_products" > 
									<label for="is_products">Products</label>
								</div>
							</div>
						</div>
						<div class="col-md-3 col-sm-6">
							<h4 class="role_section_name">Billing</h4>
							<div class="form-group">
								<div class="checkbox checkbox-success">
									<input id="is_balance" name="is_balance" type="checkbox" v-model="is_balance" > 
									<label for="is_balance">Balance</label>
								</div>
							</div>
							<div class="form-group">
								<div class="checkbox checkbox-success">
									<input id="is_payment_history" name="is_payment_history" type="checkbox" v-model="is_payment_history" > 
									<label for="is_payment_history">Payment History</label>
								</div>
							</div>
							<div class="form-group">
								<div class="checkbox checkbox-success">
									<input id="is_online_payment" name="is_online_payment" type="checkbox" v-model="is_online_payment" > 
									<label for="is_online_payment">Online Payment</label>
								</div>
							</div>
							<div class="form-group">
								<div class="checkbox checkbox-success">
									<input id="is_invoices" name="is_invoices" type="checkbox" v-model="is_invoices" > 
									<label for="is_invoices">Invoices</label>
								</div>
							</div>
						</div>
						<div class="col-md-3 col-sm-6">
							<h4 class="role_section_name">Reports</h4>
							<div class="form-group">
								<div class="checkbox checkbox-success">
									<input id="is_cdr_list" name="is_cdr_list" type="checkbox" v-model="is_cdr_list" > 
									<label for="is_cdr_list">CDRs List</label>
								</div>
							</div>
							<div class="form-group">
								<div class="checkbox checkbox-success">
									<input id="is_summary_report" name="is_summary_report" type="checkbox" v-model="is_summary_report" > 
									<label for="is_summary_report">Summary Report</label>
								</div>
							</div>
						</div>
						<div class="col-md-3 col-sm-6">
							<h4 class="role_section_name">SIP PACKET Search</h4>
							<div class="form-group">
								<div class="checkbox checkbox-success">
									<input id="is_sip_packet_search" name="is_sip_packet_search" type="checkbox" v-model="is_sip_packet_search" > 
									<label for="is_sip_packet_search">SIP PACKET Search</label>
								</div>
							</div>
						</div>
					</div>
					<div class="clearfix little-space"></div>
					<div class="row">
						<div class="col-md-6 col-sm-6 col-xs-12">
							<a class="btn btn-default mini min previousBtn" @click="prevTab">Previous</a>
							<a class="btn btn-primary mini" @click="toStep5">Next</a>
						</div>
					</div>
					<div class="clearfix"></div>
				</tab>
				<tab label="Define Template" class="" p="STEP 5" icon="dnl_icon dnl_badges">
					<div class="row">
						<div class="col-md-3 col-sm-4">
							<div class="form-group">
								<div class="checkbox checkbox-success">
									<input id="deploy_carrier_template" name="deploy_carrier_template" type="checkbox" v-model="deploy_carrier_template" > 
									<label for="deploy_carrier_template">Deploy Carrier Template</label>
								</div>
							</div>
						</div>
						<div class="clearfix"></div>
						<div class="col-md-3 col-sm-4" v-if="deploy_carrier_template">
							<div class="form-group fix-select">
								<div class="form-group">
									<label>Carrier Template:</label>
									<select2 :options="carrier_temp_options" v-model="carrier_template">
									</select2>
								</div>
							</div>
						</div>
						<div class="clearfix"></div>
						<div class="col-md-3 col-sm-4">
							<div class="form-group">
								<div class="checkbox checkbox-success">
									<input id="deploy_ingress_template" name="deploy_ingress_template" type="checkbox" v-model="deploy_ingress_template" > 
									<label for="deploy_ingress_template">Deploy Ingress Template</label>
								</div>
							</div>
						</div>
						<div class="clearfix"></div>
						<div class="col-md-3 col-sm-4" v-if="deploy_ingress_template" >
							<div class="form-group fix-select">
								<div class="form-group">
									<label>Ingress Template:</label>
									<select2 :options="ingress_temp_options" v-model="ingress_template">
									</select2>
								</div>
							</div>
						</div>
					</div>
					<div class="clearfix little-space"></div>
					<div class="row">
						<div class="col-md-6 col-sm-6 col-xs-12">
							<a class="btn btn-default mini min previousBtn" @click="prevTab">Previous</a>
							<a class="btn btn-primary mini" @click="validateForCreate">Submit</a>
						</div>
					</div>
					<div class="clearfix"></div>
				</tab>
			</dtabs>
		</div>
	  </div>
	</div>
</template>

<script>   
	const vDTab = require('vue!../main_components/disable_tabs.vue'),
		  vTab = require('vue!../main_components/tab.vue'),
		  vSelect = require('vue!../main_components/select.vue'),
		  Pagination = require('vue!../main_components/pagination.vue'),
		  modal = require('vue!../main_components/modal.vue'),
		  vSpinner = require('vue!../main_components/fadeloader.vue'),
		  multiselect = require('multiselect');
	const api = require("../../api");
	import { mapActions } from 'vuex';
	module.exports = {
		components: {
			'dtabs': vDTab,
			'tab': vTab,
			'select2': vSelect,
			'pagination': Pagination,
			'modal': modal,
			'multiselect': multiselect,
			'spinner': vSpinner
		},
		data: function(){
            return {
				loading: false,
				carrier: {},
				client: {},
				ingress_template: '1',
				ingress_temp_options: [
					{ id: '1', text: 'atulingress1' },
				],
				carrier_template: '1',
				carrier_temp_options: [
					{ id: '1', text: 'taron_temp' },
					{ id: '2', text: 'taron_temp111' },
				],
				deploy_ingress_template: true,
				deploy_carrier_template: true,
				username: '',
			  	password: '',
				is_account_summary: true,
				is_rate_table: true,
				is_trunks: true,
				is_products: true,
				is_balance: true,
				is_payment_history: true,
				is_online_payment: true,
				is_invoices: true,
				is_cdr_list: true,
				is_summary_report: true,
				is_sip_packet_search: true,

				egress_trunks: [],
				egress_trunk_options: [],
				rate_table: '',
				rate_table_options: [],
				host_routing: 'round-robin',
				host_routing_options: [
					{ id: 'round-robin', text: 'Round Robin' },
					{ id: 'top-down', text: 'Top Down' },
				],
				routing: true,
				routing_type_options: [
					{ id: true, text: 'Static Routing' },
					{ id: false, text: 'Dynamic Routing' },
				],

				ips: [],

				actived_tab_index: 0,
				is_new_carrier: true,
				carrier_options: [
					{ id: true, text: 'New Carrier' },
					{ id: false, text: 'Existing Carrier' },
				],
				is_ingress_trunk: true,
				trunk_options: [
					{ id: true, text: 'Ingress' },
					{ id: false, text: 'Egress' },
				],
				mode: true,
				mode_options: [
					{ id: true, text: 'Prepaid' },
					{ id: false, text: 'Postpaid' },
				],

				carrier_id: '',
				existing_carrier_options: [],

				carrier_name: '',
				trunk_name: '',
				cps_limit: '',
				call_limit: '',
				test_credit: '',
				allowed_credit: '',
				is_unlimited: false,
            }
        },
		methods: {
			...mapActions({
				setMessage: 'app_message/setAppMessage'
			}),
			initData() {
				this.fetchCarriers();
			},
			toStep5() {
				var vm = this;
				var isOk = true;
				this.$validator.validateAll().then(() => {
					const err = this.$validator.getErrors();
					console.log(err);
					err.errors.forEach(function (item, i) {
						if(item.field == 'username'){
							var msg;
							msg = 'username can not be empty';
							vm.setMessage({
								message: msg,
								type: 'error'
							})
							isOk = false
						}
					});
					if(isOk == true) {
						// eslint-disable-next-line
						this.nextTab();
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
			toStep4() {
				this.nextTab();
			},
			toStep3() {
				this.nextTab();
			},
			toStep2() {
				var vm = this;
				var isOk = true;
				this.$validator.validateAll().then(() => {
					const err = this.$validator.getErrors();
					console.log(err);
					err.errors.forEach(function (item, i) {
						if(item.field == 'carrier_name' || item.field == 'trunk_name'){
							var msg;
							if(item.field == 'trunk_name')
								msg = 'trunk_name can not be empty';
							else if(item.field == 'carrier_name')
								msg = 'carrier_name can not be empty';
							vm.setMessage({
								message: msg,
								type: 'error'
							})
							isOk = false
						}
					});
					if(isOk == true) {
						// eslint-disable-next-line
						this.nextTab();
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
			create () {
				if(this.is_new_carrier) {
					this.createNewCarrier()
				}	
				else {
					this.createNewClient();
				}
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
									var self = this;
									var carriers = body.payload.items

									carriers.forEach(function(temp, i) {
										var carrier = {};
										carrier.id = temp.client_id;
										carrier.text = temp.name;
										self.existing_carrier_options.push(carrier);
										if(i == 0)
											self.carrier_id = carrier.id;
									});
									console.log(this.existing_carrier_options);
									this.fetchEgressTrunks();
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
			getCarrierForRequest () {
				const carrier = JSON.parse( JSON.stringify( this.carrier ) )

				carrier.account_detail = '';
				carrier.is_active = true;
				carrier.short_call_charge = 0;
				if(this.test_credit != '')
					carrier.test_credit = this.test_credit;
				carrier.daily_cdr_delivery = true;
				carrier.report_frequency = 0;
				carrier.currency_name = 'USA';
				carrier.daily_usage_summary = true;
				carrier.rate_email = 'user@example.com';
				carrier.auto_invoice_type = "buy";
				carrier.credit_limit = 0;
				carrier.daily_usage_group_by = "By Country";
				carrier.main_email = 'user@example.com';
				carrier.short_call_percent = 0;
				carrier.low_balance_alert = true;
				carrier.address = '';
				carrier.daily_balance_summary = true;
				carrier.daily_usage_on_non_zero = true;
				carrier.is_prepay = true;
				carrier.name = this.carrier_name;
				carrier.short_call_charge_exceed_only = 0;
				if(this.call_limit != '')
					carrier.call_limit = this.call_limit;
				carrier.trunk_update_alert = true;
				carrier.billing_email = 'user@example.com';
				carrier.profit_type = "percentage";
				carrier.company = '';
				carrier.short_call_duration = 0;
				carrier.noc_email = 'user@example.com';
				carrier.one_time_report_time = 0;
				if(this.cps_limit != '')
					carrier.cps_limit = this.cps_limit;

				return carrier
			},
			createNewCarrier() {
				const reqBody = this.getCarrierForRequest();
				const url = api.getEndpointUrl() + '/v1/carrier/basic/create';
				this.$http.post(url, reqBody)
					.then(response => {
						if (response.body.success) {
							// this.setMessage('Carrier was created successfully');
							console.log(response.body);
							this.carrier_id = response.body.object_id;
							this.createNewClient();
						}
					})
					.catch(error => {
						console.log(error)
						this.loading = false;
						var msg = '';
						if (error.data.errors !== undefined)
							msg = error.data.errors;
						else if (error.data.error !== undefined)
							msg = error.data.error.message;
						this.setMessage({
							message: msg,
							type: 'error'
						})
					})
			},
			getClientForRequest() {
				// This method "extracts" the text of the selected option.
				// "sent_at" and "recipient" need to be added here (at the moment they
				// don't exist on API)
				const client = JSON.parse( JSON.stringify( this.client ) )
				// client.is_new_carrier = this.is_new_carrier;
				// client.carrier_name = this.carrier_name;
				
				// client.mode = this.mode == true? '1': '2';
				// client.test_credit = this.test_credit;
				// client.ips = this.ips;
				// client.routing = this.routing == true? '1': '2';
				// client.username = this.username;
				// client.password = this.password;
				// client.is_account_summary = this.is_account_summary;
				// client.is_rate_table = this.is_rate_table;
				// client.is_trunks = this.is_trunks;
				// client.is_products = this.is_products;
				// client.is_balance = this.is_balance;
				// client.is_payment_history = this.is_payment_history;
				// client.is_online_payment = this.is_rate_tis_online_paymentable;
				// client.is_invoices = this.is_invoices;
				// client.is_cdr_list = this.is_cdr_list;
				// client.is_summary_report = this.is_summary_report;
				// client.is_sip_packet_search = this.is_sip_packet_search;
				// client.deploy_carrier_template = this.deploy_carrier_template;
				// client.carrier_template = this.carrier_template;
				// client.ingress_template = this.ingress_template;

				// for creating trunk
				// client.host_routing_strategy = this.host_routing;
				client.min_profit_type =  "percentage";
				client.rate_table_id = this.rate_table;
				client.min_profit_value = 0;
				client.pass_lrn = 0;
				client.name = this.trunk_name;
				client.codes = ["string"];
				client.min_duration = 0;
				client.bypass_media = "Bypass Media";
				if(this.cps_limit != '')
					client.cps_limit = this.cps_limit;
				// var codecs = this.egress_trunks.map(function(item) {
                //     return item.toString();
				// });
				// console.log(codecs);
				// client.codecs = codecs;
				client.is_active = true;
				if(this.call_limit != '')
					client.call_limit = this.call_limit;
				client.authorization_type = "All";

				console.log(client);

				return client
			},
			createNewClient() {
				const reqBody = this.getClientForRequest()
				var url = api.getEndpointUrl() + '/v1/carrier/' + this.carrier_id;
				if(this.is_ingress_trunk)
					url += '/ingress_trunk';
				else
					url += '/egress_trunk';
				this.$http.post(url, reqBody)
					.then(response => {
						if (response.body.success) {
							this.setMessage('Trunk was created successfully');
							var vm = this;
							setTimeout(function(){
								vm.$router.go(vm.$router.currentRoute);
							}, 3000);
						}
					})
					.catch(error => {
						console.log(error)
						this.setMessage({
							message: 'Failed to create Trunk',
							type: 'error'
						})
					})
			},
			validateForCreate () {
				this.$validator.validateAll()
				.then(this.create)
				.catch(error => {
					console.log(error)
					this.setMessage({
						message: 'Validation failed',
						type: 'error'
					})
				})
			},
			fetchEgressTrunks() {
				var per_page=1;
				var url = api.getEndpointUrl() + "/v1/trunk/egress/list?per_page="+per_page+"&is_active=true"
				console.log(url);
				this.loading = true;

				this.$http.get(url)
				.then(response => {
					const body = response.body
					console.log(body);
					if (body.success) {
						this.loading = false;
						per_page = body.payload.total;
						console.log(per_page);

						url = api.getEndpointUrl() + "/v1/trunk/egress/list?per_page="+per_page+"&is_active=true"
						console.log(url);
						this.loading = true;
						this.$http.get(url)
						.then(response => {
							const body = response.body
							if (body.success) {
								var self = this;
								var trunks = body.payload.items

								trunks.forEach(function (temp, i) {
									var option = {};
									option.key = temp.trunk_id;
									option.label = temp.trunk_name;
									self.egress_trunk_options.push(option);
								});
								console.log(this.egress_trunk_options);
								this.fetchRateTables();
								
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
					console.log(error);
					this.loading = false;
				})
			},
			fetchRateTables() {
				var per_page=1;
				var url = api.getEndpointUrl() + "/v1/switch/rate_table/list?per_page="+per_page
				this.loading = true;
				this.$http.get(url)
				.then(response => {
					const body = response.body
					if (body.success) {
						this.loading = false;
						per_page = body.payload.total;

						url = api.getEndpointUrl() + "/v1/switch/rate_table/list?per_page="+per_page
						this.loading = true;
						this.$http.get(url)
						.then(response => {
							const body = response.body
							if (body.success) {
								var self = this;
								var rate_tables = body.payload.items
								rate_tables.forEach(function (temp, i) {
									var rate_table = {};
									rate_table.id = temp.rate_table_id;
									rate_table.text = temp.name;
									self.rate_table_options.push(rate_table);
									if(i == 0)
										self.rate_table = rate_table.id;
								});

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
					console.log(error);
					this.loading = false;
				})
			},
			add_ip () {
				this.ips.push({
					ip: '',
					port: ''
				})
			},
			delete_ip (id) {
				this.ips.splice(id, 1);
			},
			prevTab() {
				this.actived_tab_index -= 1;
				this.selectTab(this.actived_tab_index);
			},
			nextTab() {
				this.actived_tab_index += 1; 
				this.selectTab(this.actived_tab_index);
			},
			selectTab(index) {
				var tabList = document.querySelectorAll('.tab');
				for (var i = 0; i < tabList.length; i++) {
					if ((index) == i) { tabList[i].setAttribute("class", "tab active"); }
					else { tabList[i].setAttribute("class", "tab"); }
				}
				var tabContentList = document.querySelectorAll('.tab_wrapper');
				for (var i = 0; i < tabContentList.length; i++) {
					if ((index) == i) { tabContentList[i].style = null; }
					else { tabContentList[i].style.display = 'none'; }
				}
			},
		},
		mounted: function () {
			$('#egress_trunk_list').multiSelect({
				 selectableHeader: "<div class='custom-header'>Optional Selection</div>",
  				 selectionHeader: "<div class='custom-header'>Selected Selection</div>"
			});
			$('[data-toggle="tooltip"]').tooltip();
		},
		
		created () {
			this.initData();
		},
	}
</script>

<style>
	a.btn.btn-default.mini.min {
		width: 175px;
	}
	
	table.table.table-striped.table-hover.ips th,
	table.table.table-striped.table-hover.ips td {
		vertical-align: middle;
	}
	
	table.table.table-striped.table-hover.ips td:last-child {
		text-align: center;
		padding-right: 8px;
	}
	
	table.table.table-striped.table-hover.ips td:last-child a.action.action_delete {
		padding-left: 5px;
	}
	
	.tab span.dnl_icon.dnl_persona,
	.tab span.dnl_icon.dnl_person {
		font-size: 16px;
		margin-right: 4px;
	}
	
	.tab span.dnl_icon.dnl_modem {
		font-size: 18px;
		line-height: 0;
		margin-right: 3px;
	}
	
	.tab span.dnl_icon.dnl_badges {
		font-size: 16px;
		margin-right: 4px;
		vertical-align: top;
	}
	
	a.tab span.step {
		font-size: 10px;
		display: block;
		position: absolute;
		padding-left: 24px;
		color: #a4a6ae;
	}
	
	.tabs.user_tabs.wizard_steps .tabs_header a.tab {
		padding-top: 8px;
	}
	
	.tabs.user_tabs.wizard_steps .tabs_header a.tab .dnl_icon {
		vertical-align: middle;
		line-height: 0;
	}
	
	input.form-control.m-top-25 {
		margin-top: 25px;
	}
	
	.tabs.user_tabs.wizard_steps .tab {
		height: 46px;
	}
	
	.wizard_steps .checkbox-success input[type="checkbox"]:checked + label::before {
		background-color: #03c0fc;
    	border-color: #03c0fc;
	}

	.marg-btn {
		margin: 10px;
	}
	
	@media (max-width: 922px) and (min-width: 768px) {

		.el-transfer-panel {
			width: 41.8%!important;
		}

	}
	@media (max-width: 767px) {
		.wizard input.form-control.m-top-25 {
			margin-top: 0;
			margin-bottom: 25px;
		}
	}
	@media (max-width: 503px) and (min-width: 425px) {
		#app > div.container-fluid > div > div > div > div.tabs_container > div:nth-child(3) > div:nth-child(1) > div.col-md-6.col-sm-12.col-xs-12 > div > div > div:nth-child(3) > p.el-transfer-panel__header{
			line-height: 16px;
	}
}
	@media (max-width: 425px){
		.previousBtn {
			margin-bottom:10px;
		}
		.pad-top{
			padding-top: 15px;
		}

		.el-transfer-panel {
			width: 100%!important;
		}
	}
	    @media (max-width: 394px){
   		.prev_button {
    		margin-bottom: 10px
    	}

    	 .btn-center{
    		text-align: center;
    	}
    }
</style>
