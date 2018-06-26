<template>
	<div class="container-fluid">
		<div class="row">
			<div class="wrapper single">
				<time-display></time-display>
				<ol class="breadcrumb">
					<li class="breadcrumb-item">
						<a href="#">Management</a>
					</li>
					<li class="breadcrumb-item active">Carrier</li>
				</ol>
				<h1 class="page-header">Client List</h1>
				<div class="btn-group" role="group">
					<router-link to="/management/clients/mass_edit" class="btn btn-default create_new_iconed">
						<span class="dnl_icon dnl_action_edit"></span> Mass Edit</router-link>
					<router-link to="/management/clients/new" class="btn btn-default create_new_iconed">
						<span class="dnl_icon dnl_add"></span> Create New</router-link>
					<button type="button" class="btn btn-default" v-on:click="exportCSV()">
						<span class="dnl_icon dnl_export"></span> Export
					</button>
					<button type="button" class="btn btn-default" @click="showDownloadBalanceModal">
						<span class="dnl_icon dnl_download"></span> Download Balance
					</button>
					<button type="button" class="btn btn-default" @click="activeAll">
						<span class="dnl_icon dnl_tick"></span> Activate All
					</button>
					<button type="button" class="btn btn-default" @click="deActiveAll">
						<span class="dnl_icon dnl_check"></span> Deactivate All
					</button>
					<button type="button" class="btn btn-default" @click="deActiveSel">
						<span class="dnl_icon dnl_tick"></span> Deactivate Selected
					</button>
				</div>
				<spinner v-show="loading" class="spinner"></spinner>
				<tabs class="client_tabs" @activateTab="changeTab">
					<tab label="Client List" class="" icon="dnl_icon dnl_list" selected>
						<div class="advanced_search_filter_panel">
							<div class="inline-block search_wrapper">
								<label>Name:</label>
								<br>
								<input type="text" name="client_list_search" v-model="client_list_search" class="form-control inline-block search_field" placeholder="Enter Client Name" v-on:keyup.enter="searchByName">
								<span class="dnl_icon dnl_musica-searcher" @click="searchByName"></span>
							</div>
							<div class="inline-block">
								<label>Type:</label>
								<br>
								<select2 :options="type_options" v-model="type">
									<option disabled value="0">Show/Hide Columns</option>
								</select2>
							</div>
							<div class="inline-block">
								<label>Terms:</label>
								<br>
								<select2 :options="term_options" v-model="term">
								</select2>
							</div>
							<div class="inline-block">
								<a class="btn btn-primary" @click="searchCarrier">
									Query
								</a>
							</div>
							<div class="clearfix little-space"></div>
							<!-- <div class="inline-block search_wrapper">
									<label>Registered On:</label>
									<el-date-picker v-model="registered_on" type="date" placeholder="Registered On"></el-date-picker>
								</div>
								<div class="inline-block">
									<label>Payment Terms:</label>
									<br>
									<select2 :options="payment_terms_options" v-model="payment_term">
									</select2>
								</div>
								<div class="inline-block">
									<label>Last Login On:</label>
									<el-date-picker v-model="last_login_on" type="date" placeholder="Last Login On"></el-date-picker>
								</div> -->
							
						</div>
						<div class="table_filters">
							<div class="inline-block select_min_wrapper">
								<span class="inline-block">Page row:</span>
								<select2 :options="per_page_number_list" v-model="per_page_selected_0" class="inline-block" @pagecount="changePageRow">
								</select2>
							</div>
							<div class="inline-block">
								<!-- <select2 :options="options2" v-model="selected2">
										<option disabled value="0">Show/Hide Columns</option>
									</select2> -->
								<el-select v-model="carrier_table_columns" multiple placeholder="Show/Hide Columns" @change="handleChange">
									<el-option v-for="item in carrier_table_column_options" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</div>
						</div>
						<div class="table-responsive">
							<table class="table table-striped table-hover agents ">
								<thead>
									<tr>
										<th class="width-65">
											<div class="checkbox checkbox-success">
												<input type="checkbox" id="checker" v-model="checker" @click="toggleChecker()">
												<label for="checker"></label>
											</div>
										</th>
										<th v-if="showcolumns[0]" @click="sortColumn('name')">Name
											<span class="dnl_icon dnl_sort pull-right"></span>
										</th>
										<th v-if="showcolumns[1]" @click="sortColumn('mutual_balance')">Mutual Balance
											<span class="dnl_icon dnl_sort pull-right"></span>
										</th>
										<th v-if="showcolumns[2]" @click="sortColumn('available_balance')">Available Balance
											<span class="dnl_icon dnl_sort pull-right"></span>
										</th>
										<th v-if="showcolumns[3]" @click="sortColumn('credit_limit')">Credit Limit
											<span class="dnl_icon dnl_sort pull-right"></span>
										</th>
										<th v-if="showcolumns[4]" @click="sortColumn('egress_count')">Egress
											<span class="dnl_icon dnl_sort pull-right"></span>
										</th>
										<th v-if="showcolumns[5]" @click="sortColumn('ingress_count')">Ingress
											<span class="dnl_icon dnl_sort pull-right"></span>
										</th>
										<th v-if="showcolumns[6]">Action
 										</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="(client, index) in client_list">
										<td class="centred_checkbox">
											<div class="checkbox checkbox-success">
												<input :id="client.client_id" :name="client.client_id" type="checkbox" v-model="client.status">
												<label :for="client.client_id"></label>
											</div>
										</td>
										<td v-if="showcolumns[0]">{{client.name}}</td>
										<td v-if="showcolumns[1]">{{client.mutual_balance}}</td>
										<td v-if="showcolumns[2]">{{client.actual_balance}}</td>
										<td v-if="showcolumns[3]">{{client.is_prepay == true? '-': (client.is_unlimited ==true? 'unlimited': '')}}</td>
 										<td v-if="showcolumns[4]">
											<router-link :to="'/management/clients/edit/'+client.client_id+'/egress'">{{client.egress_count}}</router-link>
										</td>
										<td v-if="showcolumns[5]">
											<router-link :to="'/management/clients/edit/'+client.client_id+'/ingress'">{{client.ingress_count}}</router-link>
										</td>
										<td v-if="showcolumns[6]" class="width-340">
											<a class="action action_send" data-toggle="tooltip" data-placement="top" title="Send Low Balance Alert" @click="sendBalance(client.client_id)">
												<span class="dnl_icon dnl_support"></span>
											</a>
											<a class="action action_send" data-toggle="tooltip" data-placement="top" title="Send Welcome Letter" @click="askSendWelcomeLetterConfirm(client.client_id)">
												<span class="dnl_icon dnl_user"></span>
											</a>
											<a class="action action_reset" data-toggle="tooltip" data-placement="top" title="Reset The Balance" @click="resetBalance(client)">
												<span class="dnl_icon dnl_refresh"></span>
											</a>
											<a class="action action_login_as" data-toggle="tooltip" data-placement="top" title="Login By Via This Client" @click="loginByClient(client.client_id)">
												<span class="dnl_icon dnl_exit"></span>
											</a>
											<a class="action action_key" data-toggle="tooltip" data-placement="top" title="Change The Password Of The Client" @click="showChangePasswdModal(client.client_id)">
												<span class="dnl_icon dnl_key"></span>
											</a>
											<a class="action action_activate" data-toggle="tooltip" data-placement="top" :title="client.is_active==true?'Deactivate This Client':'Activate this client'" @click="ActiveDeactive(client)">
												<span class="dnl_icon dnl_check"></span>
											</a>
											<a class="action action_save_template" data-toggle="tooltip" data-placement="top" title="Save As Template" @click="showSaveAsTemplateDlg(index)">
												<span class="dnl_icon dnl_label"></span>
											</a>
											<router-link :to="'/management/clients/edit/'+client.client_id" class="action action_edit" data-toggle="tooltip" data-placement="top" title="Edit">
												<span class="dnl_icon dnl_action_edit"></span>
											</router-link>
											<a class="action action_delete" data-toggle="tooltip" data-placement="top" title="Delete" @click="askDeleteConfirm(client.client_id)">
												<span class="dnl_icon dnl_action_delete"></span>
											</a>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div class="pull-right pagination">
							<pagination :current-page="pageOne.currentPage" :total-pages="pageOne.totalPages" @page-changed="changeCurrentPage">
							</pagination>
						</div>
						<div class="clearfix"></div>
					</tab>
					<tab label="Client Limit" class="" icon="dnl_icon dnl_qos_report">
						<div class="advanced_search_filter_panel">
							<div class="inline-block search_wrapper">
								<label>Name:</label>
								<br>
								<input type="text" name="client_list_search" v-model="client_search" class="form-control inline-block search_field" placeholder="Enter Client Name">
								<span class="dnl_icon dnl_musica-searcher"></span>
							</div>
							<div class="inline-block">
								<label>Type:</label>
								<br>
								<select2 :options="type_options" v-model="type">
								</select2>
							</div>
						</div>
						<div class="table_filters searcheable">
							<div class="inline-block select_min_wrapper">
								<span class="inline-block">Page row:</span>
								<select2 :options="per_page_number_list" v-model="per_page_selected_1" class="inline-block">
								</select2>
							</div>
							<div class="inline-block fix_medium_select">
								<select2 :options="options2" v-model="selected2">
									<option disabled value="0">Show/Hide Columns</option>
								</select2>
							</div>
						</div>
						<div class="table-responsive">
							<table class="table table-striped table-hover clients client_limit">
								<thead>
									<tr>
										<th>Name</th>
										<th>Credit Limit</th>
										<th>Port Limit</th>
										<th>CPS Limit</th>
										<th>Trunks</th>
									</tr>
								</thead>
								<tbody v-for="client in filterBy(clients, client_search)">
									<tr>
										<td>{{client.name}}</td>
										<td>
											<input type="text" :name="client.credit_limit" v-model="client.credit_limit" class="form-control" placeholder="Client Credit Limit">
										</td>
										<td>
											<input type="text" :name="client.port_limit" v-model="client.port_limit" class="form-control" placeholder="Client Port Limit">
										</td>
										<td>
											<input type="text" :name="client.cps_limit" v-model="client.cps_limit" class="form-control" placeholder="Client CPS Limit">
										</td>
										<td class="width-65">
											<a class="action action_send" data-toggle="tooltip" data-placement="top" title="View Trunks" @click="client.trunk_visibility = !client.trunk_visibility">
												<span class="dnl_icon dnl_list"></span>
											</a>
										</td>
									</tr>
									<tr :class="{'hide' : client.trunk_visibility }">
										<td colspan="5">
											<table class="table table-striped table-hover clients trunks">
												<thead>
													<tr>
														<th>Trunk Type</th>
														<th>Trunk Name</th>
														<th>Port Limit</th>
														<th>CPS Limit</th>
													</tr>
												</thead>
												<tbody>
													<tr v-for="trunk in client.trunks">
														<td>{{trunk.trunk_type}}</td>
														<td>{{trunk.trunk_name}}</td>
														<td>{{trunk.port_limit}}</td>
														<td>{{trunk.cps_limit}}</td>
													</tr>
												</tbody>
											</table>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div class="pull-right pagination">
							<pagination :current-page="pageOne.currentPage" :total-pages="pageOne.totalPages" @page-changed="changeCurrentPage">
							</pagination>
						</div>
						<div class="clearfix"></div>
					</tab>
					<tab label="Ingress Host" class="" icon="dnl_icon dnl_ingress_host">
						<div class="advanced_search_filter_panel">
							<div class="inline-block search_wrapper">
								<label>Carrier Name:</label>
								<br>
								<input type="text" name="carrier_name_search" v-model="carrier_name_search" class="form-control inline-block search_field" placeholder="Enter Carrier Name">
								<span class="dnl_icon dnl_musica-searcher"></span>
							</div>
							<div class="inline-block">
								<label>Resource Name:</label>
								<br>
								<input type="text" name="resource_search" v-model="resource_search" class="form-control inline-block search_field" placeholder="Enter Resource Name">
							</div>
							<div class="inline-block">
								<label>Status:</label>
								<br>
								<select2 :options="status_options" v-model="carrier_name_search">
									<option disabled value="0">Active</option>
								</select2>
							</div>
						</div>
						<div class="table_filters">
							<div class="inline-block select_min_wrapper">
								<span class="inline-block">Page row:</span>
								<select2 :options="per_page_number_list" v-model="per_page_selected_2" class="inline-block">
								</select2>
							</div>
							<div class="inline-block fix_medium_select">
								<el-select v-model="ingress_host_table_columns" multiple placeholder="Show/Hide Columns" @change="handleChange2">
									<el-option v-for="item in ingress_host_table_column_options" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>

 							</div>
						</div>
						<div class="table-responsive">
							<table class="table table-striped table-hover clients">
								<thead>
									<tr>
										<th v-if="showcolumns_host[0]" rowspan="2">Resource IP</th>
										<th v-if="showcolumns_host[1]" rowspan="2">Carrier Name</th>
										<th v-if="showcolumns_host[2]" rowspan="2">Resource Name</th>
										<th v-if="showcolumns_host[3]" rowspan="2">Status</th>

										<th  v-if="(showcolumns_host[4] && showcolumns_host[5])" colspan="2">Carrier Limit</th>
										<th  v-else-if="(((showcolumns_host[4] == false) || (showcolumns_host[5] == false)) && !((showcolumns_host[4] == false) && (showcolumns_host[5] == false)))" colspan="1">Carrier Limit</th>

										<th  v-if="(showcolumns_host[6] && showcolumns_host[7])" colspan="2">Resource Limit</th>
										<th  v-else-if="(((showcolumns_host[6] == false) || (showcolumns_host[7] == false)) && !((showcolumns_host[6] == false) && (showcolumns_host[7] == false)))" colspan="1">Resource Limit</th>


										<th  v-if="(showcolumns_host[8] && showcolumns_host[9])" colspan="2">Host Limit</th>
										<th  v-else-if="(((showcolumns_host[8] == false) || (showcolumns_host[9] == false)) && !((showcolumns_host[8] == false) && (showcolumns_host[9] == false)))" colspan="1">Host Limit</th>

 									</tr>
									<tr>
										<th v-if="showcolumns_host[4]">Call Limit</th>
										<th v-if="showcolumns_host[5]">CPS Limit</th>
										<th v-if="showcolumns_host[6]">Call Limit</th>
										<th v-if="showcolumns_host[7]">CPS Limit</th>
										<th v-if="showcolumns_host[8]">Call Limit</th>
										<th v-if="showcolumns_host[9]">CPS Limit</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="item in filterBy(ingress_host, carrier_name_search)">
										<td v-if="showcolumns_host[0]">{{item.resource_ip}}</td>
										<td v-if="showcolumns_host[1]">{{item.carrier_name}}</td>
										<td v-if="showcolumns_host[2]">{{item.resource_name}}</td>
										<td v-if="showcolumns_host[3]">{{item.status}}</td>
										<td v-if="showcolumns_host[4]">{{item.carrier_limit_call}}</td>
										<td v-if="showcolumns_host[5]">{{item.carrier_limit_cps}}</td>
										<td v-if="showcolumns_host[6]">{{item.resource_limit_call}}</td>
										<td v-if="showcolumns_host[7]">{{item.resource_limit_cps}}</td>
										<td v-if="showcolumns_host[8]">{{item.host_limit_call}}</td>
										<td v-if="showcolumns_host[9]">{{item.host_limit_cps}}</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div class="pull-right pagination">
							<pagination :current-page="pageOne.currentPage" :total-pages="pageOne.totalPages" @page-changed="changeCurrentPage">
							</pagination>
						</div>
						<div class="clearfix"></div>
					</tab>
				</tabs>
			</div>
		</div>
		<modal v-if="showTempModal=='save_as_template'" @close="showTempModal = ''">
			<h3 slot="header">Save as Template</h3>
			<div slot="body">
				<div class="">
					<form class="form">
						<div class="form-group">
							<label for="old_password">Template Name:</label>
							<input v-validate="'required'" type="text" name="template_name" v-model="template_name" class="form-control" placeholder="Enter template name">
							<span v-show="errors.has('template_name')" class="help is-danger">{{ errors.first('template_name') }}</span>
						</div>
					</form>
				</div>
			</div>
			<div slot="footer">
				<button class="btn btn-primary submit" @click="saveAsTemplate">Submit</button>
				<button @click="showTempModal = ''" class="btn btn-default cancel">Cancel</button>
			</div>
		</modal>
		<modal class="change_pass_modal" v-if="isShowChangePasswdModal" @close="isShowChangePasswdModal = false; password = ''">
			<h3 slot="header">Change Password</h3>
			<div slot="body">
				<div class="">
					<form class="form">
						<div class="form-group">
							<label for="password">Password:</label>
							<input v-validate="'required'" type="password" name="password" v-model="password" class="form-control" placeholder="Enter password">
							<span v-show="errors.has('password')" class="help is-danger">{{ errors.first('password') }}</span>
						</div>
					</form>
				</div>
			</div>
			<div slot="footer">
				<a class="btn btn-primary mini" @click="changePasswd">Submit</a>
				<a @click="isShowChangePasswdModal = false; password = ''" class="btn btn-default mini">Cancel</a>
			</div>
		</modal>
		<modal v-if="isShowDownloadBalance" @close="isShowDownloadBalance=false">
			<h3 slot="header">Download Balance</h3>
			<div slot="body">
				<div class="">
					<form class="form">
						<div class="form-group">
							<label for="password">Date:</label>
							<el-date-picker style="width: 100%;" type="date" v-model="balance_history_date" :picker-options="{}" placeholder="Enter Date and TIme"></el-date-picker>
						</div>
					</form>
				</div>
			</div>
			<div slot="footer">
				<a class="btn btn-primary mini" @click="downloadBalance">Submit</a>
				<a @click="isShowDownloadBalance = false; balance_history_date = new Date()" class="btn btn-default mini">Cancel</a>
			</div>
		</modal>
	</div>
</template>

<script>   
const vTabs = require('vue!../main_components/tabs.vue'),
	vTab = require('vue!../main_components/tab.vue'),
	vSelect = require('vue!../main_components/select.vue'),
	Pagination = require('vue!../main_components/pagination.vue'),
	vSpinner = require('vue!../main_components/fadeloader.vue'),
	modal = require('vue!../main_components/modal.vue');
const api = require("../../api");
const auth = require("../../auth");
import _ from 'lodash'
import { mapActions } from 'vuex'
module.exports = {

	created() {
		this.fetchClients();
		this.fetchPaymentTerms();
		this.balance_history_date = new Date()//.toISOString();
		// console.log("created");
		// console.log(this.balance_history_date.substring(0,10));
	},
	components: {
		'tabs': vTabs,
		'tab': vTab,
		'select2': vSelect,
		'pagination': Pagination,
		'modal': modal,
		'spinner': vSpinner
	},
	data: function() {
		return {
			isShowDownloadBalance: false,
			balance_history_date: '',
			password: '',
			selectedCarrier: 0,
			isShowChangePasswdModal: false,
			order: 'update_at',
			sort: 'desc',
			name_sort: 'asc',
			template_name: '',
			showTempModal: '',
			data_for_carrier_template: {},
			payment_term: '',
			payment_terms_options: [],
			showcolumns: [true, true, true, true, true, true, true],
			showcolumns_host: [true, true, true, true, true, true, true, true, true, true],
			carrier_table_columns: ['Name', 'Mutual Balance', 'Available Balance', 'Credit Limit', 'Egress', 'Ingress', 'Actions'],
			temp_carrier_table_columns: ['Name', 'Mutual Balance', 'Available Balance', 'Credit Limit', 'Egress', 'Ingress', 'Actions'],
			carrier_table_column_options: [{
				value: 'Name',
				label: 'Name'
			}, {
				value: 'Mutual Balance',
				label: 'Mutual Balance'
			}, {
				value: 'Available Balance',
				label: 'Available Balance'
			}, {
				value: 'Credit Limit',
				label: 'Credit Limit'
			}, {
				value: 'Egress',
				label: 'Egress'
			}, {
				value: 'Ingress',
				label: 'Ingress'
			}, {
				value: 'Actions',
				label: 'Actions'
			}],
            temp_ingress_host_table_columns: [
                'Resource IP',
				'Carrier Name',
				'Resource Name',
				'Status',
				'Call Limit 1',
				'CPS Limit 1',
                'Call Limit 2',
                'CPS Limit 2',
                'Call Limit 3',
                'CPS Limit 3',
 			],
            ingress_host_table_columns: [
                'Resource IP',
                'Carrier Name',
                'Resource Name',
                'Status',
                'Call Limit 1',
                'CPS Limit 1',
                'Call Limit 2',
                'CPS Limit 2',
                'Call Limit 3',
                'CPS Limit 3',
            ],
            ingress_host_table_column_options: [{
                value: 'Resource IP',
                label: 'Resource IP'
            }, {
                value: 'Carrier Name',
                label: 'Carrier Name'
            },{
                value: 'Resource Name',
                label: 'Resource Name'
            }, {
                value: 'Status',
                label: 'Status'
            }, {
                value: 'Call Limit 1',
                label: 'Call Limit 1'
            }, {
                value: 'CPS Limit 1',
                label: 'CPS Limit 1'
            }, {
                value: 'Call Limit 2',
                label: 'Call Limit 2'
            }, {
                value: 'CPS Limit 2',
                label: 'CPS Limit 2'
            }, {
                value: 'Call Limit 3',
                label: 'Call Limit 3'
            },{
                value: 'CPS Limit 3',
                label: 'CPS Limit 3',
            }],
			term: 'all',
			term_options: [
				{ id: 'all', text: 'All' },
				{ id: 'prepaid', text: 'Prepaid' },
				{ id: 'postpaid', text: 'Postpaid' },
			],
			type: 'all active clients',
			type_options: [
				{ id: 'all', text: 'All' },
				{ id: 'all active clients', text: 'All Active Clients' },
				{ id: 'all inactive clients', text: 'All Inactive Clients' },
			],
			loading: false,
			apiUrl: "/v1/client/list",
			route_types: [
				{ id: 1, text: 'Fail to Next Host' },
				{ id: 2, text: 'Fail to Next Trunk' },
				{ id: 3, text: 'Stop' },
			],
			pageOne: {
				currentPage: 1,
				totalPages: 10
			},
			checker: false,
			carrier_name_search: '',
			resource_search: '',
			client_list_search: '',
			client_search: '',
			search: '',
			select: [],
			options: [
				{ id: 1, text: 'Success' },
				{ id: 2, text: 'Multiple' },
				{ id: 3, text: 'Moved Permanently' },
				{ id: 4, text: 'Moved Temporarily' },
				{ id: 5, text: 'Use Proxy' },
				{ id: 6, text: 'Alternative Service' },
				{ id: 7, text: 'Bad Request' },
				{ id: 8, text: 'Unauthorized' },
				{ id: 9, text: 'Payment Required' },
			],
			selected1: 1,
			per_page_number_list: [
				{ id: 1, text: '10' },
				{ id: 2, text: '20' },
				{ id: 3, text: '30' },
				{ id: 4, text: '50' },
				{ id: 5, text: '100' }
			],
			selected2: 0,
			options2: [
				{ id: 1, text: 'Group Name' },
				{ id: 2, text: 'Carrier Count' },
				{ id: 3, text: 'Actions' }
			],
			client_list: [],
			ingress_trunk_list: [],

			clients: [
				{
					name: "Agent1",
					credit_limit: "Client1",
					port_limit: "20%",
					cps_limit: "2016-10-02 04:45:52+00",
					trunk_visibility: true,
					trunks: [
						{
							trunk_type: 'Egress',
							trunk_name: 'Ultra_Egress',
							port_limit: '',
							cps_limit: ''
						}
					]
				}
			],
			ingress_host: [
				{
					resource_ip: "Agent1",
					carrier_name: "Client1",
					status: "Active",
					carrier_limit_call: "NO LIMIT",
					carrier_limit_cps: "NO LIMIT",
					resource_limit_call: "NO LIMIT",
					resource_limit_cps: "NO LIMIT",
					host_limit_call: "NO LIMIT",
					host_limit_cps: "NO LIMIT"
				}
			],
			status_options: [
                { id: 1, text: 'All' },
                { id: 2, text: 'Active' },
                { id: 3, text: 'Inactive' },
 			],
			active_tab_index: 0,
			active_tab_name: "Client List",
			per_page_selected_0: 0,
			per_page_0: 10,

			per_page_selected_1: 0,
			per_page_1: 10,

			per_page_selected_2: 0,
			per_page_2: 10,

		}
	},
	methods: {
		...mapActions({
			setAsyncConfirm: 'async_confirm/setAsyncConfirm',
			setMessage: 'app_message/setAppMessage'
		}),
		showDownloadBalanceModal() {
			this.isShowDownloadBalance = true;
		},
		downloadBalance() {
			var date = this.balance_history_date.toISOString().substring(0, 10);
			console.log(this.balance_history_date.toISOString().substring(0, 10));
			const url = api.getEndpointUrl() + '/v1/config/export'
			const reqBody = {
				entity: 'BalanceHistory',
				query: {
					select: ['*'],
					format: 'csv',
					where: [{
						op: "=",
						field: "Date",
						value: date,
					}]
				}
			}
			console.log("reqBody: ", reqBody);
			this.loading = true;
			this.$http.post(url, reqBody)
				.then(response => {
					if (response.body.success) {
						var object_id = response.body.object_id;
						this.$http.get(url + '/' + object_id)
							.then(response => {
								console.log(response);
								if (response.ok) {
									var str_res = JSON.stringify(response.body).split('"').join('');
									var csvArray = new Array();
									str_res.split("\\n").forEach(function(row_array, i) {
										csvArray.push(row_array.split(",").map(function(item) {
											return item.trim();
										}));
									})
									exportToCsv('balance[' + date + '].csv', csvArray);
								}
								this.loading = false;
								this.isShowDownloadBalance = false;
							})
							.catch(error => {
								console.log(error)
								this.loading = false;
								this.isShowDownloadBalance = false;
							})
					}
					this.loading = false;
					this.isShowDownloadBalance = false;
				})
				.catch(error => {
					console.log(error)
					this.loading = false;
					this.isShowDownloadBalance = false;
				})
		},
		resetBalance(client) {
			const url = api.getEndpointUrl() + '/v1/carrier/'+ client.client_id +'/regenerate_balance'
			const current = new Date().toISOString();
			console.log(current);
			console.log(url);
			const reqBody = {
				reset_actual_balance: true,
				reset_mutual_balance: true,
				new_balance: 0,
				start_time: current
			};
			this.$http.post(url, reqBody)
				.then(response => {
					const body = response.body
					if (body.success) {
						this.setMessage('The balance was reseted successfully');
						client.mutual_balance = 0;
						client.actual_balance = 0;
					}
				})
				.catch(error => {
					console.log(error)
				})
		},
		loginByClient(id) {
			const url = api.getEndpointUrl() + '/v1/auth/as_client'
			const reqBody = {
				client_id: id
			};
			this.$http.post(url, reqBody)
				.then(response => {
					const body = response.body
					if (body.success) {
						this.setMessage('Login by via this client was passed successfully');
						const token = body.payload.token;
						console.log("token: ", token);
					}
				})
				.catch(error => {
					console.log(error)
				})
		},
		changePasswd(id) {
			var vm = this;
			this.$validator.validateAll().then(() => {
				const err = this.$validator.getErrors();
				if (err.errors.length > 0) {
					const msg = err.errors[0].field + ' field can not leave as null';
					vm.setMessage({
						message: msg,
						type: 'error'
					})
				}
				else {
					console.log("password");
					const url = api.getEndpointUrl() + '/v1/carrier/' + this.selectedCarrier + '/password'
					this.$http.patch(url, { password: this.password })
						.then(response => {
							this.isShowChangePasswdModal = false;
							if (response.body.success) {
								this.setMessage('Password was changed successfully');
								// var thisvm = this;
								// setTimeout(function(){
								// 	thisvm.$router.push('/template/carrier_template');
								// }, 3000);
							}
						})
						.catch(error => {
							console.log("error:");
							this.loading = false;
							var msg = '';
							console.log(error);
							if (error.data.errors !== undefined)
								msg = error.data.errors;
							else if (error.data.error !== undefined)
								msg = error.data.error.message;
							this.setMessage({
								message: msg,
								type: 'error'
							})
							this.isShowChangePasswdModal = false;
						})
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
		showChangePasswdModal(id) {
			this.isShowChangePasswdModal = true;
			this.selectedCarrier = id;
		},
		sortColumn(column) {
			if (this.name_sort == 'asc') {
				this.name_sort = 'desc'
				this.sort = this.name_sort
				this.order = column
				this.fetchClients()
			}

			else if (this.name_sort == 'desc') {
				this.name_sort = 'asc'
				this.sort = this.name_sort
				this.order = column
				this.fetchClients()
			}
		},
		showSaveAsTemplateDlg(id) {
			this.showTempModal = 'save_as_template';
			console.log("copy data!");
			console.log(this.client_list[id]);
			this.data_for_carrier_template = JSON.parse(JSON.stringify(this.client_list[id]))

		},
		getCarrierTemplateForRequest() {
			var carrier_template = {};

			if (this.data_for_carrier_template.call_limit != null)
				carrier_template.call_limit = this.data_for_carrier_template.call_limit;
			if (this.data_for_carrier_template.cps_limit != null)
				carrier_template.cps_limit = this.data_for_carrier_template.cps_limit;
			if (this.data_for_carrier_template.credit_limit != null)
				carrier_template.credit_limit = this.data_for_carrier_template.credit_limit;
			if(this.data_for_carrier_template.is_prepay != null) {
				if(this.data_for_carrier_template.is_prepay == true)
					carrier_template.mode = 'prepay';
				else
					carrier_template.mode = 'postpay';
			}
			if (this.data_for_carrier_template.is_unlimited != null)
				carrier_template.is_unlimited = this.data_for_carrier_template.is_unlimited;
			carrier_template.template_name = this.template_name;
			carrier_template.profit_type = this.data_for_carrier_template.profit_type;
			if (this.data_for_carrier_template.short_call_charge != null)
				carrier_template.scc_charge = this.data_for_carrier_template.short_call_charge;
			if (this.data_for_carrier_template.short_call_percent != null)
				carrier_template.scc_percent = this.data_for_carrier_template.short_call_percent;
			if (this.data_for_carrier_template.short_call_duration != null)
				carrier_template.scc_below = this.data_for_carrier_template.short_call_duration;
			if (this.data_for_carrier_template.short_call_charge_exceed_only != null)
				carrier_template.scc_type = this.data_for_carrier_template.short_call_charge_exceed_only == 0 ? 'meeting the short duration defined neighboring' : 'that exceed the defined percentage';
			carrier_template.currency = this.data_for_carrier_template.currency_name;
			carrier_template.test_credit = this.data_for_carrier_template.test_credit;
			if (this.data_for_carrier_template.profit_margin != undefined && this.data_for_carrier_template.profit_margin != null)
				carrier_template.profit_margin = this.data_for_carrier_template.profit_margin;
			else
				carrier_template.profit_margin = 0;

			// carrier_template.send_trunk_update = this.data_for_carrier_template.send_trunk_update;
			// carrier_template.show_detail_by_trunk = true;
			// carrier_template.non_zero_invoice_only = true;
			// carrier_template.is_daily_balance_notification = true;
			// carrier_template.time_zone = this.data_for_carrier_template.time_zone;
			// carrier_template.show_country_summary = true;
			// carrier_template.show_account_summary = this.data_for_carrier_template.show_account_summary;
			// carrier_template.mode = this.data_for_carrier_template.mode;
			// carrier_template.show_trunk_summary = true;
			// carrier_template.auto_summary_not_zero = 0;
			// carrier_template.show_jurisdiction_detail = this.data_for_carrier_template.show_jurisdiction_detail;
			// carrier_template.inlcude_cdr_in_email = this.data_for_carrier_template.inlcude_cdr_in_email;
			// carrier_template.daily_cdr_generation = this.data_for_carrier_template.daily_cdr_generation;
			// carrier_template.auto_summary_hour = 0;
			// carrier_template.is_show_daily_usage = true;
			// carrier_template.rate_value = this.data_for_carrier_template.rate_value;
			// carrier_template.decimal = this.data_for_carrier_template.rate_decimal_place;
			// carrier_template.cdr_format = this.data_for_carrier_template.cdr_compression_format;
			// carrier_template.notify_client_balance_type = 0;
			// carrier_template.is_auto_summary = true;
			// carrier_template.send_invoice_as_link = this.data_for_carrier_template.carrier_template;
			// carrier_template.daily_cdr_generation_zone = "string";
			// carrier_template.payment_term = this.data_for_carrier_template.payment_terms;
			// carrier_template.include_short_call_charge = this.data_for_carrier_template.include_short_call_charge;
			// carrier_template.auto_send_invoice = this.data_for_carrier_template.auto_send_invoice;
			// carrier_template.format = this.data_for_carrier_template.invoice_format;
			// carrier_template.show_code_name_summary = this.data_for_carrier_template.show_code_name_summary;
			// carrier_template.attach_cdrs_list = true;
			// carrier_template.show_payment_summary = this.data_for_carrier_template.show_payment_summary;
			// carrier_template.include_tax = this.data_for_carrier_template.include_tax;
			// carrier_template.auto_summary_group_by = "By Country";
			// carrier_template.is_send_trunk_update = this.data_for_carrier_template.is_send_trunk_update;
			// carrier_template.auto_summary_period = 0;
			// carrier_template.show_code_summary = this.data_for_carrier_template.show_code_summary;
			// carrier_template.daily_usage_with_us_jurisdictional_breakdown = this.template.daily_usage_with_us_jurisdictional_breakdown;		// api have not the field
			// carrier_template.no_invoice_for_zero_traffic = this.template.no_invoice_for_zero_traffic;										// api have not the field
			// carrier_template.low_balance_config = {
			// 	send_to: 0,
			// 	duplicate_days: 0,
			// 	is_notify: true,
			// 	duplicate_send_days: 0,
			// 	actual_notify_balance: 0,
			// 	send_time_type: "daily",
			// 	value_type: "Actual Balance",
			// 	percentage_notify_balance: 0,
			// 	disable_trunks_days: 0,
			// 	daily_send_time: 0

			// }

			return carrier_template;
		},
		saveAsTemplate() {
			const reqBody = this.getCarrierTemplateForRequest();
			const url = api.getEndpointUrl() + '/v1/config/carrier_template/create';
			this.$http.post(url, reqBody)
				.then(response => {
					if (response.body.success) {
						this.setMessage('Carrier template was created successfully');
						this.showTempModal = '';
						console.log(response.body.object_id);
						// var thisvm = this;
						// setTimeout(function(){
						// 	thisvm.$router.push('/template/carrier_template');
						// }, 3000);
					}
				})
				.catch(error => {
					this.showTempModal = '';
					console.log("error:");
					this.loading = false;
					var msg = '';
					console.log(error);
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
		sendBalance(id) {
			console.log("send");
			const url = api.getEndpointUrl() + '/v1/carrier/' + id + '/send_low_balance_alert'
			console.log(url)
			this.$http.patch(url)
				.then(response => {
					const body = response.body
					if (body.success) {
						this.setMessage('Low balance was sended successfully');
					}
				})
				.catch(error => {
					console.log(error)
					var msg = '';
					if(error.data.errors !== undefined)
						msg = error.data.errors;
					else if(error.data.error !== undefined)
						msg = error.data.error.reason;
					this.setMessage({
						message: msg,
						type: 'error'
					})
				})
		},
		sendWelcomeLetter(id) {
			console.log("welcome");
			const url = api.getEndpointUrl() + '/v1/carrier/' + id + '/send_welcom'
			console.log(url)
			this.$http.patch(url)
				.then(response => {
					const body = response.body
					if (body.success) {
						this.setMessage('Welcome letter was sended successfully');
					}
				})
				.catch(error => {
					console.log(error)
				})
		},
		askSendWelcomeLetterConfirm(id) {
			this.setAsyncConfirm('Are you sure to send a welcome letter?')
				.then(result => {
					if (result.accepted) {
						// send email to client
						this.sendWelcomeLetter(id)
					}
				})
				.catch(error => {
					console.log(error)
				})
		},
		activeAll() {
			if (this.client_list.length == 0) {
				this.setMessage({
					message: 'There are no items at all',
					type: 'error'
				});
				this.checker = false;
				return;
			}

			this.client_list.forEach(function(client, i) {
				if (!client.is_active) {
					var url = api.getEndpointUrl() + '/v1/carrier/' + client.client_id;
					var reqBody = [];
					var action = 'activate';
					reqBody.is_active = true;
					console.log('Request Body:', reqBody);
					this.$http.patch(url, reqBody)
						.then(response => {
							if (response.body.success) {
								this.setMessage('Carrier was ' + action + 'd successfully');
							}
						})
						.catch(error => {
							console.log(error)
							this.setMessage({
								message: 'Failed to ' + action + ' carrier',
								type: 'error'
							})
						})
				}
			});
		},
		deActiveAll() {
			if (this.client_list.length == 0) {
				this.setMessage({
					message: 'There are no items at all',
					type: 'error'
				});
				this.checker = false;
				return;
			}

			this.client_list.forEach(function(client, i) {
				if (client.is_active) {
					var url = api.getEndpointUrl() + '/v1/carrier/' + client.client_id;
					var reqBody = [];
					var action = 'deactivate';
					reqBody.is_active = false;
					console.log('Request Body:', reqBody);
					this.$http.patch(url, reqBody)
						.then(response => {
							if (response.body.success) {
								this.setMessage('Carrier was ' + action + 'd successfully');
							}
						})
						.catch(error => {
							console.log(error)
							this.setMessage({
								message: 'Failed to ' + action + ' carrier',
								type: 'error'
							})
						})
				}
			});
		},
		deActiveSel() {
			if (this.client_list.length == 0) {
				this.setMessage({
					message: 'There are no items at all',
					type: 'error'
				});
				this.checker = false;
				return;
			}

			this.client_list.forEach(function(client, i) {
				if (client.status & client.is_active) {
					var url = api.getEndpointUrl() + '/v1/carrier/' + client.client_id;
					var reqBody = [];
					var action = 'deactivate';
					reqBody.is_active = false;
					console.log('Request Body:', reqBody);
					this.$http.patch(url, reqBody)
						.then(response => {
							if (response.body.success) {
								this.setMessage('Carrier was ' + action + 'd successfully');
							}
						})
						.catch(error => {
							console.log(error)
							this.setMessage({
								message: 'Failed to ' + action + ' carrier',
								type: 'error'
							})
						})
					client.status = false;
				}
			});
		},
		ActiveDeactive(item) {
			var url = api.getEndpointUrl() + '/v1/carrier/' + item.client_id;
			var reqBody = {};
			var action = 'activate';
			if (item.is_active == true) {
				action = 'deactivate';
			}
			console.log(item.is_active);
			reqBody.is_active = !item.is_active;
			console.log('Request Body:', reqBody);
			this.$http.patch(url, reqBody)
				.then(response => {
					if (response.body.success) {
						this.setMessage('Carrier was ' + action + 'd successfully');
						item.is_active = !item.is_active;
					}
				})
				.catch(error => {
					console.log(error)
					this.setMessage({
						message: 'Failed to ' + action + ' carrier',
						type: 'error'
					})
				})
		},
		searchCarrier() {
			this.loading = true
			this.pageOne.currentPage = 1;
			const page = this.pageOne.currentPage - 1
			const per_page = this['per_page_' + this.active_tab_index]
			const orderby = 'update_at&order_dir=desc'
			let search;
			if (this.client_list_search != '')
				search = 'name=' + this.client_list_search;
			if (this.type != 'all')
				search += '&is_active=' + this.type == 'all active clients' ? true : false;
			if (this.term != 'all')
				search += '&is_prepay=' + this.term == 'prepaid' ? true : false;

			let url = api.getEndpointUrl() + '/v1/carrier/list?' + search
			url += '&page=' + page
			url += '&per_page=' + per_page
			url += '&order_by=' + orderby
			this.$http.get(url)
				.then(response => {
					this.loading = false
					const body = response.body
					if (body.success) {
						const payload = body.payload
						this.client_list = payload.items;
						console.log('Filling client_list variable with payload:');
						console.log(this.client_list);
						// this.client_list = payload.items.map(elem => {
						// 	elem.mutual_balance = null
						// 	elem.actual_balance = null
						// 	this.fetchClientBalance(elem.client_id)
						// 	return elem
						// })
						var vm = this;
						this.loading = false;
						// this.client_list.forEach(function(temp, i) {
						// 	vm.getEgressCount(temp.client_id, i);
						// 	vm.getIngressCount(temp.client_id, i);
						// 	vm.getBalance(temp.client_id, i);
						// });
						this.pageOne.currentPage = payload.page + 1
						this.pageOne.totalPages = Math.ceil(payload.total / payload.per_page)
					}
				})
				.catch(error => {
					this.loading = false
					console.log(error)
				})
		},
		searchByName() {
			this.loading = true
			this.pageOne.currentPage = 1;
			const page = this.pageOne.currentPage - 1
			const per_page = this['per_page_' + this.active_tab_index]
			const orderby = 'update_at&order_dir=desc'
			let url = api.getEndpointUrl() + '/v1/carrier/list?name=' + this.client_list_search
			url += '&page=' + page
			url += '&per_page=' + per_page
			url += '&order_by=' + orderby
			this.$http.get(url)
				.then(response => {
					this.loading = false
					const body = response.body
					if (body.success) {
						const payload = body.payload
						this.client_list = payload.items;
						// this.client_list = payload.items.map(elem => {
						// 	elem.mutual_balance = null
						// 	elem.actual_balance = null
						// 	this.fetchClientBalance(elem.client_id)
						// 	return elem
						// })
						var vm = this;
						this.loading = false;
						// this.client_list.forEach(function(temp, i) {
						// 	vm.getEgressCount(temp.client_id, i);
						// 	vm.getIngressCount(temp.client_id, i);
						// 	vm.getBalance(temp.client_id, i);
						// });
						this.pageOne.currentPage = payload.page + 1
						this.pageOne.totalPages = Math.ceil(payload.total / payload.per_page)
					}
				})
				.catch(error => {
					this.loading = false
					console.log(error)
				})
		},
		fetchPaymentTerms() {
			const url = api.getEndpointUrl() + '/v1/config/payment_term/list'
			this.$http.get(url)
				.then(response => {
					const body = response.body
					if (body.success) {
						const payment_terms = body.payload.items
						var self = this;
						this.payment_terms_options = [{
							id: 'all', text: 'All'
						}];
						this.payment_terms_id = 'all';
						payment_terms.forEach(function(temp, i) {
							var payment_term = {};
							payment_term.id = temp.name;
							payment_term.text = temp.name;
							self.payment_terms_options.push(payment_term);
						});
						console.log(this.payment_terms_options);

					}
				})
				.catch(error => {
					console.log(error)
				})
		},
		handleChange() {
			for (let i = 0; i < this.temp_carrier_table_columns.length; i++) {
				if (_.indexOf(this.carrier_table_columns, this.temp_carrier_table_columns[i]) != -1) {
					Vue.set(this.showcolumns, i, true);
				}
				else {
					Vue.set(this.showcolumns, i, false);
				}
			}
		},
        handleChange2() {
            for (let i = 0; i < this.temp_ingress_host_table_columns.length; i++) {
                if (_.indexOf(this.ingress_host_table_columns, this.temp_ingress_host_table_columns[i]) != -1) {
                    Vue.set(this.showcolumns_host, i, true);
                }
                else {
                    Vue.set(this.showcolumns_host, i, false);
                }
            }
        },
		// getBalance(id, index) {
		// 	this.loading = true;
		// 	const url = api.getEndpointUrl() + '/v1/carrier/' + id + '/balance'
		// 	this.$http.get(url)
		// 		.then(response => {
		// 			const body = response.body
		// 			if (body.success) {
		// 				Vue.set(this.client_list[index], 'actual_balance', body.payload.actual_balance);
		// 				Vue.set(this.client_list[index], 'mutual_balance', body.payload.mutual_balance);
		// 				this.loading = false;
		// 			}
		// 		})
		// 		.catch(error => {
		// 			console.log(error)
		// 		})
		// },
		// getEgressCount(id, index) {
		// 	this.loading = true;
		// 	const url = api.getEndpointUrl() + '/v1/carrier/' + id + '/egress_trunk/list'
		// 	this.$http.get(url)
		// 		.then(response => {
		// 			const body = response.body
		// 			if (body.success) {
		// 				Vue.set(this.client_list[index], 'egress', body.payload.total);
		// 				this.loading = false;
		// 			}
		// 		})
		// 		.catch(error => {
		// 			console.log(error)
		// 		})
		// },
		// getIngressCount(id, index) {
		// 	this.loading = true;
		// 	const url = api.getEndpointUrl() + '/v1/carrier/' + id + '/ingress_trunk/list'
		// 	this.$http.get(url)
		// 		.then(response => {
		// 			const body = response.body
		// 			if (body.success) {
		// 				Vue.set(this.client_list[index], 'ingress', body.payload.total);
		// 				this.loading = false;
		// 			}
		// 		})
		// 		.catch(error => {
		// 			console.log(error)
		// 		})
		// },
		deleteClient(id) {
			const url = api.getEndpointUrl() + '/v1/carrier/' + id
			this.$http.delete(url)
				.then(response => {
					if (response.body.success) {
						let index = this.getClientIndex(id)
						if (~index) {
							this.client_list.splice(index, 1)
						}
						this.setMessage('Carrier was removed successfully')
					}
				})
		},
		askDeleteConfirm(id) {
			this.setAsyncConfirm('Are you sure you want to delete this carrier')
				.then(result => {
					if (result.accepted) {
						this.deleteClient(id)
					}
				})
				.catch(error => {
					console.log(error)
				})
		},
		editClient(id) {
			this.$router.push('/management/clients/edit/' + id)
		},
		toggleChecker() {
			console.log('Toggle activated')
			const state = this.checker
			const clients = this.client_list
			const clientsLength = clients.length
			for (let i = 0; i < clientsLength; i++) {
				clients[i].status = state
			}
		},
		changePageRow(value) {
			if (value !== this['per_page_' + this.active_tab_index]) {
				this['per_page_' + this.active_tab_index] = value
				this.$nextTick(this.fetchClients)
			}
		},
		fetchIngressTrunks() {
			console.log('Function not ready yet')
		},
		changeTab(tab, index) {
			if (this.active_tab_index === index) { return }
			this.active_tab_index = index
			this.active_tab_name = tab.name;
			this.$nextTick(() => {
				if (index === 2 && !this.ingress_trunk_list.length) {
					this.fetchIngressTrunks()
				}
			})
		},
		getClientIndex(id) {
			return _.findIndex(this.client_list, elem => elem.client_id === id)
		},
		fetchClientBalance(id) {
			const url = api.getEndpointUrl() + '/v1/carrier/' + id + '/balance'
			this.$http.get(url)
				.then(response => {
					const body = response.body
					if (body.success) {
						const payload = body.payload
						const index = this.getClientIndex(id)
						if (~index) {
							let client = this.client_list[index]
							client.mutual_balance = payload.mutual_balance
							client.actual_balance = payload.actual_balance
						}
					}
				})
				.catch(error => {
					console.log(error)
				})
		},
		getQueries() {
			// currentPage needs to be in each tab
			// remember to add &order_by
			const page = '?page=' + (this.pageOne.currentPage - 1)
			const per_page = '&per_page=' + this['per_page_' + this.active_tab_index]
			const orderby = '&order_by=' + this.order + '&order_dir=' + this.sort;
			return page + per_page + orderby
		},
		fetchClients() {
			this.loading = true;
 			const url = api.getEndpointUrl() + '/v1/carrier/list' + this.getQueries()
			this.$http.get(url)
				.then(response => {
					const body = response.body
					if (body.success) {
						const payload = body.payload
						this.client_list = payload.items;
						// this.client_list = payload.items.map(elem => {
						// 	elem.mutual_balance = null
						// 	elem.actual_balance = null
						// 	this.fetchClientBalance(elem.client_id)
						// 	return elem
						// })
						var vm = this;
						this.loading = false;
						// this.client_list.forEach(function(temp, i) {
//							vm.getEgressCount(temp.client_id, i);
//							vm.getIngressCount(temp.client_id, i);
//							vm.getBalance(temp.client_id, i);

						// });
						this.pageOne.currentPage = payload.page + 1
						this.pageOne.totalPages = Math.ceil(payload.total / payload.per_page)
					}
				})
				.catch(error => {
					console.log(error)
					this.loading = false;
				})
		},
		changeCurrentPage(pageNum) {
			if (pageNum !== this.pageOne.currentPage) {
				this.pageOne.currentPage = pageNum
				this.$nextTick(this.fetchClients)
			}
		},
		closeModal: function() {
			this.showModal = '';
		},
		exportCSV: function() {
			var vm = this;
			var csvArray = new Array();
			if (this.active_tab_name == "Client List") {
				var fields = ["name", "mutual_balance", "actual_balance", "is_prepay", "egress", "ingress"];
				csvArray.push(fields);
				this.client_list.forEach(function(client, i) {
					var values = new Array();
					values.push(client.name);
					values.push(client.mutual_balance);
					values.push(client.actual_balance);
					values.push(client.is_prepay == true ? client.test_credit : (client.is_unlimited == true ? 'unlimited' : ''));
					values.push(client.egress);
					values.push(client.ingress);
					csvArray.push(values);
				});
			}
			else if (this.active_tab_name == "Client Limit") {
				var fields = ["name", "credit_limit", "port_limit", "cps_limit"];
				csvArray.push(fields);
				this.clients.forEach(function(client, i) {
					var values = new Array();
					values.push(client.name);
					values.push(client.credit_limit);
					values.push(client.port_limit);
					values.push(client.cps_limit);
					csvArray.push(values);
				});
			}
			else if (this.active_tab_name == "Ingress Host") {
				var fields = ["resource_ip", "carrier_name", "resource_name", "status", "carrier_limit_call", "carrier_limit_cps", "resource_limit_call", "resource_limit_cps", "host_limit_call", "host_limit_cps"];
				csvArray.push(fields);
				this.ingress_host.forEach(function(item, i) {
					var values = new Array();
					values.push(item.resource_ip);
					values.push(item.carrier_name);
					values.push(item.resource_name);
					values.push(item.status);
					values.push(item.carrier_limit_call);
					values.push(item.carrier_limit_cps);
					values.push(item.resource_limit_call);
					values.push(item.resource_limit_cps);
					values.push(item.host_limit_call);
					values.push(item.host_limit_cps);
					csvArray.push(values);
				});
			}
			console.log("test");
			console.log(csvArray);
			exportToCsv('management_carrier_' + this.active_tab_name + '_export.csv', csvArray);
		}
	},
	mounted: function() {
		$('[data-toggle="tooltip"]').tooltip();
	},
	updated: function() {
		document.querySelector('.el-select > .el-input > input').placeholder = 'Show/Hide Columns';
	},
}
</script>

<style>
.change_pass_modal a.btn.btn-primary.mini, .change_pass_modal a.btn.btn-default.mini{
	width: 45% !important;
}
.client_tabs a.tab span.dnl_icon.dnl_qos_report,
.client_tabs a.tab span.dnl_icon.dnl_ingress_host {
	font-size: 18px;
}

.client_tabs a.tab span.dnl_icon {
	margin-right: 5px;
	vertical-align: top;
	line-height: 0;
}

span.dnl_icon.dnl_ingress_host {
	float: left;
	margin-top: 9px;
	margin-right: 6px;
}

.btn-group .btn.btn-default {
	width: auto;
	padding: 5px 15px;
	font-size: 13px;
	line-height: 15px;
}

.btn-group .btn.btn-default.create_new_iconed {
	line-height: 13px;
}

.btn-group .btn.btn-default span.dnl_icon {
	margin-right: 5px;
	font-size: 18px;
	vertical-align: middle;
}

.btn-group .btn.btn-default span.dnl_icon.dnl_action_edit {
	margin-right: 1px;
	font-size: 19px;
}

.btn-group .btn.btn-default span.dnl_icon.dnl_add {
	font-size: 15px;
	float: left;
	margin-top: -1px;
	margin-right: 5px;
}

.btn-group .btn.btn-default span.dnl_icon.dnl_export {
	font-size: 19px;
	float: left;
	margin-right: 4px;
}

.btn-group .btn.btn-default span.dnl_icon.dnl_download {
	margin-right: 1px;
}

.btn-group .btn.btn-default span.dnl_icon.dnl_check {
	margin-right: 4px;
	float: left;
	margin-bottom: -2px;
}

.btn-group .btn.btn-default span.dnl_icon.dnl_tick {
	margin-right: 6px;
	font-size: 16px;
	float: left;
	margin-top: -2px;
}

.btn-group {
	margin: 5px 0 10px 0;
}

.advanced_search_filter_panel {
	background: #f7f8f9;
	padding: 20px;
	border-radius: 5px;
	margin-bottom: 15px;
}

.advanced_search_filter_panel .search_wrapper .dnl_icon {
	margin-top: 25px;
}

.advanced_search_filter_panel .inline-block {
	width: 255px;
	margin-right: 0px;
}

.advanced_search_filter_panel .search_wrapper {
	margin-right: 0;
}

.advanced_search_filter_panel .inline-block .select2,
.advanced_search_filter_panel .inline-block input {
	width: 250px !important;
}

a.action.action_send {
	font-size: 14px;
	padding-top: 5px;
	vertical-align: bottom;
}

a.action.action_reset {
	padding-left: 4px;
}

a.action.action_login_as {
	font-size: 19px;
	padding-top: 3px;
	padding-left: 2px;
}

a.action.action_activate {
	padding-left: 5px;
	font-size: 18px;
	vertical-align: text-bottom;
	padding-top: 5px;
}

a.action.action_save_template {
	font-size: 19px;
	vertical-align: bottom;
	padding-top: 4px;
}

.width-274 {
	width: 274px;
}

.fix_medium_select .select2 {
	width: 180px !important;
}

.table>tbody+tbody {
	border-top: 1px solid #ddd;
}

a.btn.btn-default.create_new_iconed {
	padding-top: 11px;
}

td.centred_checkbox .checkbox.checkbox-success {
	text-align: center;
}

td.centred_checkbox .checkbox.checkbox-success label::after {
	margin-left: -21px;
}

th.width-65 .checkbox-success {
	margin: 5px 0 -2px 13px;
}

.tabs_header .tab span.dnl_icon.dnl_qos_report {
	float: left;
	line-height: 23px !important;
	margin-right: 7px !important;
}

@media (max-width: 767px) {
	.advanced_search_filter_panel .inline-block {
		width: 100%;
		margin-bottom: 10px !important;
	}

	.advanced_search_filter_panel .inline-block .select2,
	.advanced_search_filter_panel .inline-block input {
		width: 100%!important;
	}

	.advanced_search_filter_panel .inline-block input {
		margin-bottom: 0 !important;
	}
}

@media (max-width: 979px) {
	.btn-group .btn {
		display: block;
		border-radius: 5px !important;
		margin-bottom: 6px;
		text-align: left;
		margin-right: 10px;
	}
}
</style>
