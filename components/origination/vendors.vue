<template>
	<div class="container-fluid">
      <div class="row">
		<div class="wrapper single">
			<time-display></time-display>
			<ol class="breadcrumb">
				  <li class="breadcrumb-item"><a>Origination</a></li>
				  <li class="breadcrumb-item active">Vendors</li>
			</ol>
			<h1 class="page-header">Vendors</h1>
			<div class="white_pad table_wrap">
				<div class="advanced_search_filter_panel bottom_0">
					<div class="inline-block search_wrapper">
						<label>Name:</label>
						<br>
						<input type="text" name="credit_search" v-model="credit_search" class="form-control inline-block search_field" placeholder="Enter Vendor Name">
						<span class="dnl_icon dnl_musica-searcher"></span>
					</div>
				</div>
				<div class="clearfix"></div>
				<!-- <button type="button" class="btn btn-default mini pull-right" @click="deleteSelected">
				  <span class="dnl_icon dnl_action_delete"></span> Delete Selected
			  	</button> -->
				
				<router-link to="/origination/vendors/new" class="btn btn-primary mini pull-right m-top-20">
                    <span class="dnl_icon dnl_add"></span> Create new 
                </router-link>
				<router-link to="" class="btn btn-default mini pull-right m-top-20 del_btn" @click.native="deleteSelected">
                    <span class="dnl_icon dnl_action_delete"></span> Delete Selected 
                </router-link>
				<div class="table_filters m-top-15">
					<div class="inline-block select_min_wrapper">
						<span class="inline-block">Page row:</span>
						<select2 :options="options1" v-model="selected1" class="inline-block" @pagecount="changePageRow">
						</select2>
					</div>
					<div class="inline-block">
						<!--<select2 :options="options2" v-model="selected2">
							<option disabled value="0">Show/Hide Columns</option>
						</select2>-->
						<el-select v-model="vendor_table_columns" multiple placeholder="Show/Hide Columns" @change="handleChange">
							<el-option v-for="item in vendor_table_column_options" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</div>
				</div>
				<div class="clearfix"></div>
				<div class="table-responsive">
					<table class="table table-striped table-hover aliases credits">
					  <thead>
						<tr>
							<th class="width-65">
							  <div class="checkbox checkbox-success">
								<input type="checkbox" id="checker" name="checker" v-model="checker" @click="toggleChecker()">
								<label for="checker"></label>
							  </div>
						  </th>
                          <th v-if="showcolumns[0]">IP</th>
						  <th v-if="showcolumns[1]" @click="sortColumn('name')">Name
							  <span class="dnl_icon dnl_sort pull-right"></span>
						  </th>
						  <th v-if="showcolumns[2]">Balance</th>
						  <!--<th v-if="showcolumns[3]">Billing Rule</th>-->
						  <th v-if="showcolumns[3]" >Updated at
 						  </th>
						  <th v-if="showcolumns[4]">Updated by
 						  </th>
						  <th v-if="showcolumns[5]" class="width_190">Actions</th>
						</tr>
					  </thead>
					  <tbody>
						<tr v-if="!filterBy(clients, credit_search).length">
							<td style="text-align: center" colspan="6">No Data Found</td>
						</tr>										
						  
						<tr v-for="client in filterBy(clients, credit_search)">
							<td class="centred_checkbox">
								<div class="checkbox checkbox-success">
									<input :id="client.client_id" :name="client.client_id" type="checkbox" v-model="client.selected">
									<label :for="client.client_id"></label>
								</div>
							</td>
							<td v-if="showcolumns[0]">
								<a class="action action_read" data-toggle="tooltip" data-placement="top" title="View" @click="viewIPs(client.client_id)">
									<span class="dnl_icon dnl_eye"></span>
								</a>
							</td>
						  <td v-if="showcolumns[1]">{{client.name}}</td>
						  <td v-if="showcolumns[2]">{{client.balance}}</td>
						  <!--<td v-if="showcolumns[3]">{{client.billing_rule}}</td>-->
						  <td v-if="showcolumns[3]">{{client.update_at}}</td>
						  <td v-if="showcolumns[4]">{{client.update_by}}</td>
						  <td v-if="showcolumns[5]">
							  <a class="action action_edit" data-toggle="tooltip" data-placement="top" title="Edit" @click="editVendor(client.client_id)">
								  <span class="dnl_icon dnl_action_edit"></span>
							  </a>
                              <a class="action action_test" data-toggle="tooltip" data-placement="top" title="Diactivate">
								  <span class="dnl_icon dnl_check"></span>
							  </a>
							  <a class="action action_delete" data-toggle="tooltip" data-placement="top" title="Delete" @click="askDeleteConfirm(client.client_id)">
								  <span class="dnl_icon dnl_action_delete"></span>
							  </a>
                              <a class="action action_read" data-toggle="tooltip" data-placement="top" title="View DID">
								  <span class="dnl_icon dnl_eye"></span>
							  </a>
							  <a class="action action_test" data-toggle="tooltip" data-placement="top" title="Digit Manipulation">
								<span class="dnl_icon dnl_test"></span>
							</a>
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
	  <modal v-if="showModal=='ip'" @close="showModal = ''" class="big_modal">
           
            <h3 slot="header">IP List</h3>
            <div slot="body">
                <div class="">
                    <div class="table-responsive">
                        <spinner v-show="loading_host" class="spinner"></spinner>
                        <div v-show="loading_host" class="mask"></div>
                        <table class="table table-striped table-hover carrier_groups aligned-center">
                            <thead>
                                <tr>
                                    <th>IP</th>
									<th>Port</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="host in hosts">
                                    <td>{{host.ip}}</td>
									<td>{{host.port}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <button @click="closeModal" class="btn btn-default mini cancel centered">Cancel</button>
            </div>
        </modal>
	</div>
</template>

<script>   
	const vSelect = require('vue!../main_components/select.vue'),
		  Pagination = require('vue!../main_components/pagination.vue'),
		  vSpinner = require('vue!../main_components/fadeloader.vue'),
		  modal = require('vue!../main_components/modal.vue');
	const api = require("../../api");
	import { mapActions } from 'vuex'
	module.exports = {
		components: {
			'spinner': vSpinner,
			'select2': vSelect,
			'pagination': Pagination,
			'modal': modal
		},
		data: function(){
			return {
				loading_host: false,
				hosts: [],
				showcolumns: [true, true, true, true, true, true],
				vendor_table_columns: ['IP', 'Name', 'Balance', 'Updated at', 'Updated by', 'Actions'],
				temp_vendor_table_columns: ['IP', 'Name', 'Balance', 'Updated at', 'Updated by', 'Actions'],
				vendor_table_column_options: [{
					value: 'IP',
					label: 'IP'
				}, {
					value: 'Name',
					label: 'Name'
				}, {
					value: 'Balance',
					label: 'Balance'
				}, {
					value: 'Updated at',
					label: 'Updated at'
				}, {
					value: 'Updated by',
					label: 'Updated by'
				}, {
					value: 'Actions',
					label: 'Actions'
				}],
			  credit_search:'',
			  checker: '',
			  showModal: '',
			  start_date:'',
			  end_date:'',
			  ftp_config_name: '',
			  pageOne: {
                currentPage: 1,
                totalPages: 10
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
			  clients: [],
			  per_page: 10,
			  order: '',
			  sort: '',
			  name_sort: 'asc',
			}
		},
		methods: {
			...mapActions({
				setAsyncConfirm: 'async_confirm/setAsyncConfirm',
				setMessage: 'app_message/setAppMessage'
			}),
			deleteSelected () {
				// check selected items count for deleting
				var selected_count = 0;
				this.clients.forEach(function (client, i) {
					if (client.selected == true) {
						selected_count += 1;
					}
				});
				if(selected_count == 0) {
					this.setMessage({
						message: 'The vendors has been not selected!',
						type: 'error'
					})
					return;
				}
				// delete selected items
				this.setAsyncConfirm('Are you sure you want to delete this selected vendors')
				.then(result => {
					if (result.accepted) {
						var vm = this;
						this.clients.forEach(function (client, i) {
							if (client.selected == true) {
								var no_message = true;
								vm.deleteVendor(client.client_id, no_message)
							}
						});
						if (this.checker)
							this.checker = false;
						this.setMessage('Selected Vendors were removed successfully')
					}
				})
				.catch(error => {
					console.log(error)
				})
			},
			toggleChecker () {
				const state = this.checker
				const clients = this.clients
				const clientsLength = clients.length
				for (let i = 0; i < clientsLength; i++) {
					clients[i].selected = state
				}
			},
            sortColumn(column) {
                if(this.name_sort == 'asc') {
                    this.name_sort = 'desc'
                    this.sort = this.name_sort
                    this.order = column
                    this.fetchVendors()
                }

                else if(this.name_sort == 'desc') {
                    this.name_sort = 'asc'
                    this.sort = this.name_sort
                    this.order = column
                    this.fetchVendors()
                }
            },
			fetchIPs(id) {
				this.loading_host = true
				const url = api.getEndpointUrl() + '/v1/did/vendor/'+id
				this.$http.get(url)
				.then(response => {
					const body = response.body
					
					if (body.success) {
						var vendor = body.payload
						console.log(vendor);
						this.hosts = [];
						if(vendor.resource != null)
							this.hosts = vendor.resource.ip;

						console.log(this.hosts);
					}
					this.loading_host = false
				})
				.catch(error => {
					console.log(error)
				})	
			},
			viewIPs(id) {
				this.showModal='ip';
				this.fetchIPs(id);
			},
			handleChange() {
				for(let i = 0; i < this.temp_vendor_table_columns.length; i++) {
					if (_.indexOf(this.vendor_table_columns, this.temp_vendor_table_columns[i]) != -1) {
						Vue.set(this.showcolumns, i, true);
					}
					else {
						Vue.set(this.showcolumns, i, false);
					}
				}
			},
			editVendor (id) {
				this.$router.push('/origination/vendors/edit/' + id);
			},
			getVendorIndex (id) {
				return _.findIndex(this.clients, elem => elem.client_id === id)
			},
			changePageRow (value) {
				if (value !== this.per_page) {
					this.per_page = value
					this.$nextTick(this.fetchVendors)
				}
			},
			deleteVendor(id, no_message) {
				const url = api.getEndpointUrl() + '/v1/did/vendor/' + id
				this.$http.delete(url)
				.then(response => {
					if (response.body.success) {
						let index = this.getVendorIndex(id)
						if (~index) {
							this.clients.splice(index, 1)
						}
						if(no_message == false)
							this.setMessage('Vendor was removed successfully')
					}
				})
			},
			askDeleteConfirm (id) {
				this.setAsyncConfirm('Are you sure you want to delete this vendor')
				.then(result => {
					if (result.accepted) {
						this.deleteVendor(id, false)
					}
				})
				.catch(error => {
					console.log(error)
				})
			},
			getQueries() {
				const page = '?page=' + (this.pageOne.currentPage - 1)
				const per_page = '&per_page=' + this.per_page
                const order = '&order_by=' + this.order + '&order_dir=' + this.sort
                return page + per_page + order
			},
			fetchVendors () {
				const url = api.getEndpointUrl() + '/v1/did/vendor/list' + this.getQueries()
				this.$http.get(url)
				.then(response => {
					const body = response.body
					if (body.success) {
						this.clients = body.payload.items
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
					this.$nextTick(this.fetchVendors)
				}
			},
			closeModal: function() {
				this.showModal = '';
			}
		},
		mounted: function () {
			$('[data-toggle="tooltip"]').tooltip();
		},
		created () {
			this.fetchVendors()
		},
		updated: function () {
			document.querySelector('.el-input > input').placeholder = 'Show/Hide Columns';
		},
	}
</script>

<style>
.del_btn {
	margin-right:10px
}
</style>
