<template>
	<div class="container-fluid">
      <div class="row">
		<div class="wrapper single">
			<time-display></time-display>
			<ol class="breadcrumb">
				  <li class="breadcrumb-item"><a href="#">Finance</a></li>
				  <li class="breadcrumb-item active">Auto Invoice Management</li>
			</ol>
			<h1 class="page-header">Auto Invoice Management</h1>
			<div class="white_pad table_wrap">
				<div class="advanced_search_filter_panel bottom_0">
					<div class="row">
					<div class="col-lg-2 col-md-4 col-sm-4">
						<div class="search_wrapper">
						<label>Carrier Name:</label>
						<br>
						<select2 :options="carrier_options" v-model="carrier_name">
						</select2>
					</div>
					</div>
					<div class="col-lg-2 col-md-4 col-sm-4">
						<label>Payment Terms:</label>
						<br>
						<select2 :options="payment_terms_options" v-model="payment_terms_id">
						</select2>
					</div>
					<div class="col-lg-1 col-md-2 col-sm-2 col-xs-6 m-top-25">
						<a class="btn btn-primary" @click="query">
							Query
						</a>
					</div>
					</div>
				</div>
				
				<div class="pull-right pagination top_pagination">
					<pagination :current-page="pageOne.currentPage"
								:total-pages="pageOne.totalPages"
								@page-changed="pageOneChanged">
					</pagination>
				</div>
				<div class="table_filters searcheable m-top-15">
					<div class="inline-block select_min_wrapper">
						<span class="inline-block">Page row:</span>
						<select2 :options="options1" v-model="selected1" class="inline-block" @pagecount="changePageRow">
						</select2>
					</div>
					<div class="inline-block fix_medium_select">
						<el-select v-model="auto_invoice_table_columns" multiple placeholder="Show/Hide Columns" @change="handleChange">
							<el-option v-for="item in auto_invoice_table_column_options" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</div>
				</div>
				<div class="clearfix"></div>
				<div class="table-responsive">
					<table class="table table-striped table-hover aliases">
					  <thead>
						<tr>
						  <th v-if="showcolumns[0]">Carrier Name <span class="dnl_icon dnl_sort pull-right"></span></th>
						  <th v-if="showcolumns[1]">Invoicing Cycle</th>
						  <th v-if="showcolumns[2]">Last Invoice Date</th>
						  <th v-if="showcolumns[3]">Next Invoice Date</th>
						  <th v-if="showcolumns[4]">Last Invoice Amount</th>
						  <th v-if="showcolumns[5]">Last Invoice Period</th>
						  <th v-if="showcolumns[6]" class="width_138">Action</th>
						</tr>
					  </thead>
					  <tbody>
						<tr v-if="!carriers.length">
							<td style="text-align: center" colspan="7">No Data Found</td>
						</tr>										
						<tr v-for="carrier in carriers">
						  <td v-if="showcolumns[0]">{{(carrier.last_invoice != null) ? carrier.last_invoice.client_name : ''}}</td>
						  <td v-if="showcolumns[1]"></td>
						  <td v-if="showcolumns[2]">{{(carrier.last_invoice != null) ? carrier.last_invoice.invoice_date : ''}}</td>
						  <td v-if="showcolumns[3]"></td>
						  <td v-if="showcolumns[4]">{{(carrier.last_invoice != null) ? carrier.last_invoice.amount : ''}}</td>
						  <td v-if="showcolumns[5]">{{(carrier.last_invoice != null) ? carrier.last_invoice.invoice_period_from - carrier.last_invoice.invoice_period_to : '' }}</td>
						  <td v-if="showcolumns[6]">
							  <a data-toggle="tooltip" data-placement="top" title="Start Auto Invoice" class="action action_activate">
								  <span class="dnl_icon dnl_check"></span>
							  </a>
							  <a data-toggle="tooltip" data-placement="top" title="View History" class="action action_menu">		
								  <span class="dnl_icon dnl_action_menu"></span>
							  </a>
							  <router-link to="/finance/auto_invoice_management/edit_invoice" class="action action_edit" data-toggle="tooltip" data-placement="top" title="Edit">
								  <span class="dnl_icon dnl_action_edit"></span>
							  </router-link>
						  </td>
						</tr>
					  </tbody>
					</table>
				</div>
				<div class="pull-right pagination">
					<pagination :current-page="pageOne.currentPage"
								:total-pages="pageOne.totalPages"
								@page-changed="pageOneChanged">
					</pagination>
				</div>
				<div class="clearfix"></div>
			</div>
		</div>
	  </div>
	</div>
</template>

<script>   
	const vSelect = require('vue!../main_components/select.vue'),
		  Pagination = require('vue!../main_components/pagination.vue');
	const api = require("../../api");
	module.exports = {
		components: {
			'select2': vSelect,
			'pagination': Pagination
		},
		data: function(){
			return {
				carrier_id: 'all',
				carrier_options:[{id: 'all', text: 'All'}],
				payment_terms_id: '',
				payment_terms_options: [],
				showcolumns: [true, true, true, true, true, true, true],
				auto_invoice_table_columns: ['Carrier Name', 'Invoicing Cycle', 'Last Invoice Date', 'Next Invoice Date', 'Last Invoice Amount', 'Last Invoice Period', 'Actions'],
				temp_auto_invoice_table_columns: ['Carrier Name', 'Invoicing Cycle', 'Last Invoice Date', 'Next Invoice Date', 'Last Invoice Amount', 'Last Invoice Period', 'Actions'],
				auto_invoice_table_column_options: [{
					value: 'Carrier Name',
					label: 'Carrier Name'
				}, {
					value: 'Invoicing Cycle',
					label: 'Invoicing Cycle'
				}, {
					value: 'Last Invoice Date',
					label: 'Last Invoice Date'
				}, {
					value: 'Next Invoice Date',
					label: 'Next Invoice Date'
				}, {
					value: 'Last Invoice Amount',
					label: 'Last Invoice Amount'
				}, {
					value: 'Last Invoice Period',
					label: 'Last Invoice Period'
				}, {
					value: 'Actions',
					label: 'Actions'
				}],
			  ftp_list_search: '',
			  checker: '',
			  start_date:'',
			  end_date:'',
			  carrier_name: '',
			  pageOne: {
                currentPage: 1,
                totalPages: 10,
				per_page: 10,
              },
			  selected1: 1,
			  options1: [
				  { id: 1, text: '10' },
				  { id: 2, text: '20' },
				  { id: 3, text: '30' },
				  { id: 4, text: '50' },
				  { id: 5, text: '100' }
			  ],
			  selected2: 0,
			  options2: [
				  { id: 1, text: 'Alias' },
				  { id: 2, text: 'Active' },
				  { id: 3, text: 'Actions' }
			  ],
			  file_breakdown: 2,
			  file_options:[
				  {id: 1, text: 'As one big file'},
				  {id: 2, text: 'As hourly file'},
				  {id: 3, text: 'As daily file'},
			  ],
			  carriers: []
            }
        },
		methods: {
			query() {
				this.fetchAutoInvoice();
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
						payment_terms.forEach(function (temp, i) {
							var payment_term = {};
							payment_term.id = temp.payment_term_id;
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
				for(let i = 0; i < this.temp_auto_invoice_table_columns.length; i++) {
					if (_.indexOf(this.auto_invoice_table_columns, this.temp_auto_invoice_table_columns[i]) != -1) {
						Vue.set(this.showcolumns, i, true);
					}
					else {
						Vue.set(this.showcolumns, i, false);
					}
				}
			},
			changePageRow (value) {
				console.log(value);
				if (value !== this.pageOne.per_page) {
					this.pageOne.per_page = value
					this.$nextTick(this.fetchAutoInvoice)
				}
			},
			getQueries() {
				const page = '?page=' + (this.pageOne.currentPage - 1)
				const per_page = '&per_page=' + this.pageOne.per_page
				var query = '';
				if (this.carrier_name != "all") {
					query = query + '&name=' + this.carrier_name
				}if (this.payment_terms_id != "all") {
					query = query + '&payment_terms_id=' + this.payment_terms_id
				}
				return page + per_page + query
			},
			fetchAutoInvoice () {
				const url = api.getEndpointUrl() + '/v1/finance/auto_invoice/list' + this.getQueries()
				this.$http.get(url)
				.then(response => {
					const body = response.body
					if (body.success) {
						this.carriers = body.payload.items
						this.pageOne.currentPage = body.payload.page + 1
						this.pageOne.totalPages = Math.ceil(body.payload.total / body.payload.per_page)
					}
				})
				.catch(error => {
					console.log(error)
				})
			},
			pageOneChanged (pageNum) {
				if (pageNum !== this.pageOne.currentPage) {
					this.pageOne.currentPage = pageNum
					this.$nextTick(this.fetchAutoInvoice)
				}
			},
		},
		mounted: function () {
			$('[data-toggle="tooltip"]').tooltip();
		},
		created () {
			this.fetchPaymentTerms()
			this.fetchCarriers();
			this.fetchAutoInvoice()
		},
		updated: function () {
			document.querySelector('.el-input > input').placeholder = 'Show/Hide Columns';
		},
	}
</script>

<style>
</style>
