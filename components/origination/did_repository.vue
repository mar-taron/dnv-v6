<template>
	<div class="container-fluid">
      <div class="row">
		<div class="wrapper single">
			<time-display></time-display>
			<ol class="breadcrumb">
				  <li class="breadcrumb-item"><a href="#">Origination</a></li>
				  <li class="breadcrumb-item active">DID Repository</li>
			</ol>
			<h1 class="page-header">DID Repository</h1>
            <div class="btn-group" role="group">
              <button type="button" class="btn btn-default" @click="onClickMassEdit"><span class="dnl_icon dnl_action_edit"></span> Mass Assign</button>
              <button type="button" class="btn btn-default" @click="createRepository"><span class="dnl_icon dnl_add"></span> Create New</button>
              <button type="button" class="btn btn-default" v-on:click="exportCSV()">
                  <span class="dnl_icon dnl_export"></span> Export
              </button>
              <button type="button" class="btn btn-default">
                  <span class="dnl_icon dnl_import"></span> Upload
              </button>
              <button type="button" class="btn btn-default" @click="deleteAll">
                  <span class="dnl_icon dnl_action_delete"></span> Delete All
              </button>
              <button type="button" class="btn btn-default" @click="deleteSelected">
                  <span class="dnl_icon dnl_action_delete"></span> Delete Selected
              </button>
            </div>
            <div class="white_pad table_wrap">
                <div class="advanced_search_filter_panel">
                    <div class="inline-block search_wrapper">
						<label>Vendor:</label>
                        <br>
                        <select2 :options="vendor_options" v-model="search_vendor">
                        </select2>
                    </div>
                    <div class="inline-block">
                        <label>Client:</label>
                        <br>
                        <select2 :options="client_options" v-model="search_client">
							<option value="0">All</option>
                        </select2>
                    </div>
                    <div class="inline-block">
                        <div class="form-group">
                            <label for="code">Code:</label>
                            <input type="text" name="code" v-model="code" class="form-control" placeholder="Enter Code">
                        </div>
                    </div>
                    <div class="inline-block">
                        <label>Show:</label>
                        <br>
                        <select2 :options="show_options" v-model="search_show">
                        </select2>
                    </div>
                    <div class="inline-block">
                        <a class="btn btn-primary" @click="queryRepository">
                            Query
                        </a>
                    </div>
                </div>
                <div class="table_filters">
                    <div class="inline-block select_min_wrapper">
                        <span class="inline-block">Page row:</span>
                        <select2 :options="options1" v-model="selected1" class="inline-block" @pagecount="changePageRow">
                        </select2>
                    </div>
                    <div class="inline-block">
                        <!--<select2 :options="options2" v-model="selected2">
             
                            <option disabled value="0">Show/Hide Columns</option>
                        </select2>-->
						<el-select v-model="repository_table_columns" multiple placeholder="Show/Hide Columns" @change="handleChange">
							<el-option v-for="item in repository_table_column_options" :key="item.value" :label="item.label" :value="item.value">
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
                          <th v-if="showcolumns[0]" @click="sortColumn('did')">DID
                              <span class="dnl_icon dnl_sort pull-right"></span>
                          </th>
						  <th v-if="showcolumns[1]" @click="sortColumn('vendor_res_id')">DID Vendor
                              <span class="dnl_icon dnl_sort pull-right"></span>
                          </th>
						  <th v-if="showcolumns[2]" @click="sortColumn('vendor_billing_rule_id')">Vendor Billing Rule
                              <span class="dnl_icon dnl_sort pull-right"></span>
                          </th>
                          <th v-if="showcolumns[3]" @click="sortColumn('did_client')">DID Client
                              <span class="dnl_icon dnl_sort pull-right"></span>
                          </th>
						  <th v-if="showcolumns[4]" @click="sortColumn('client_billing_rule_id')">Client Billing Rule
                              <span class="dnl_icon dnl_sort pull-right"></span>
                          </th>
                          <th v-if="showcolumns[5]">Assigned Date</th>
						  <th v-if="showcolumns[6]">End Date</th>
                          <th v-if="showcolumns[7]" class="width_138">Action</th>
                        </tr>
                      </thead>
                      <tbody>
						<tr v-if="!filterBy(repositories, client_list_search).length">
							<td style="text-align: center" colspan="9">No Data Found</td>
						</tr>										
						  
                        <tr v-for="repository in filterBy(repositories, client_list_search)">
                          <td class="centred_checkbox">
                              <div class="checkbox checkbox-success">
                                <input :id="repository.id" :name="repository.id" type="checkbox" v-model="repository.selected">
                                <label :for="repository.id"></label>
                              </div>
                          </td>
                          <td v-if="showcolumns[0]">
                          {{repository.did}}</td>
						  <td v-if="showcolumns[1]">{{repository.vendor_res_id}}</td>
						  <td v-if="showcolumns[2]">{{repository.vendor_billing_rule_id}}</td>
                          <td v-if="showcolumns[3]">{{repository.did_client}}</td>
						  <td v-if="showcolumns[4]">{{repository.client_billing_rule_id}}</td>
                          <td v-if="showcolumns[5]">{{repository.assigned_time}}</td>
						  <td v-if="showcolumns[6]">{{repository.end_time}}</td>
                          <td v-if="showcolumns[7]">
							  <a class="action action_menu" data-toggle="tooltip" data-placement="top" title="View Actions">
									<span class="dnl_icon dnl_action_menu"></span>
								</a>
                              <a class="action action_edit" data-toggle="tooltip" data-placement="top" title="Edit" @click="editRepository(repository.id)">
                                  <span class="dnl_icon dnl_action_edit"></span>
                              </a>
                              <a class="action action_delete" data-toggle="tooltip" data-placement="top" title="Delete" @click="askDeleteConfirm(repository.id)">
                                  <span class="dnl_icon dnl_action_delete"></span>
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
      <modal v-if="showModal=='new'" @close="showModal = ''">
			<h3 slot="header">Client DID Assignment</h3>
			<div slot="body">
			  <div class="">
				<form class="form">
					<div class="form-group">
						<label for="assign_to">Assign to:</label>
						<select2 :options="client_options" v-model="assign_to">
						</select2>
					</div>
					<div class="form-group">
						<label for="client_billing_rule">Client Billing Rule:</label>
						<select2 :options="client_billing_rule_options" v-model="client_billing_rule">
						</select2>
					</div>
				</form>
			  </div>
			</div>
			<div slot="footer">
				<button class="btn btn-primary submit">Submit</button>
				<button @click="closeModal" class="btn btn-default cancel">Cancel</button>
			</div>
      </modal>
	</div>
</template>

<script>   
	const vTabs = require('vue!../main_components/tabs.vue'),
		  vTab = require('vue!../main_components/tab.vue'),
		  vSelect = require('vue!../main_components/select.vue'),
		  Pagination = require('vue!../main_components/pagination.vue'),
		  modal = require('vue!../main_components/modal.vue');
    const api = require("../../api");
    import { mapActions } from 'vuex'
	module.exports = {
		components: {
			'tabs': vTabs,
			'tab': vTab,
			'select2': vSelect,
			'pagination': Pagination,
			'modal': modal
		},
		data: function(){
            return {
				client_billing_rule: '1',
				client_billing_rule_options: [
					{id: '1', text: 'atul'},
					{id: '2', text: 'Billing_test'},
					{id: '3', text: 'C-FR'},
					{id: '4', text: 'C-FRSF'},
					{id: '5', text: 'Test2'},
					{id: '6', text: 'V-FR'},
				],
				search_show: 'all',
				show_options: [
					{id: 'all', text: 'All'},
					{id: 'assigned', text: 'Assigned'},
					{id: 'unassigned', text: 'Unassigned'},
				],
				search_vendor: 'all',
				vendor_options: [],
				search_client: 'all',
				client_options: [],
				showcolumns: [true, true, true, true, true, true, true, true, true],
				repository_table_columns: ['DID', 'DID Vendor', 'Vendor Billing Rule', 'DID Client', 'Client Billing Rule', 'Assigned Date', 'End Date', 'Action'],
				temp_repository_table_columns: ['DID', 'DID Vendor', 'Vendor Billing Rule', 'DID Client', 'Client Billing Rule', 'Assigned Date', 'End Date', 'Action'],
				repository_table_column_options: [{
					value: 'DID',
					label: 'DID'
				}, {
					value: 'DID Vendor',
					label: 'DID Vendor'
				}, {
					value: 'Vendor Billing Rule',
					label: 'Vendor Billing Rule'
				}, {
					value: 'DID Client',
					label: 'DID Client'
				}, {
					value: 'Client Billing Rule',
					label: 'Client Billing Rule'
				}, {
					value: 'Assigned Date',
					label: 'Assigned Date'
				}, {
					value: 'End Date',
					label: 'End Date'
				}, {
					value: 'Action',
					label: 'Action'
				}],
				route_types: [
				  { id: 1, text: 'Fail to Next Host' },
				  { id: 2, text: 'Fail to Next Trunk' },
				  { id: 3, text: 'Stop' },
			  	],
                code: '',
                showModal: '',
				pageOne: {
					currentPage: 1,
					totalPages: 10
				},
                order: '',
                sort: '',
                name_sort: 'asc',
				checker: '',
				carrier_name_search: '',
				resource_search: '',
				client_list_search: '',
				client_search: '',
				search:'',
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
				options1: [
					{ id: 1, text: '10' },
					{ id: 2, text: '20' },
					{ id: 3, text: '30' },
					{ id: 4, text: '50' },
					{ id: 5, text: '100' }
				],
				assign_to: '',
				options2: [
					{ id: 1, text: 'Group Name' },
					{ id: 2, text: 'Carrier Count' },
					{ id: 3, text: 'Actions' }
				],
			    repositories: [],
              per_page: 10,
			}
        },
		methods: {
            ...mapActions({
				setAsyncConfirm: 'async_confirm/setAsyncConfirm',
				setMessage: 'app_message/setAppMessage'
			}),
			onClickMassEdit() {
				var selected_cnt = 0;
				this.repositories.forEach(function (item, i) {
					if(item.selected == true)
						selected_cnt++;
				});
				if(selected_cnt == 0) {
					this.setMessage({
						message:'Nothing is selected',
						type:'error'
					});
					return;
				}
				this.showModal='new'
			},
			queryRepository() {
			},
			fetchVendors() {
				const url = api.getEndpointUrl() + '/v1/did/vendor/list'
				this.$http.get(url)
				.then(response => {
					const body = response.body
					if (body.success) {
						var vendors = body.payload.items
						var self = this;
						this.vendor_options = [
							{id: 'all', text: 'All'},
						];
						vendors.forEach(function (temp, i) {
							var vendor = {};
							vendor.id = temp.client_id;
							vendor.text = temp.name;
							self.vendor_options.push(vendor);
						});
						console.log(this.vendor_options);
					}
				})
				.catch(error => {
					console.log(error)
				})
			},
			fetchClients() {
				const url = api.getEndpointUrl() + '/v1/did/client/list'
				this.$http.get(url)
				.then(response => {
					const body = response.body
					if (body.success) {
						var clients = body.payload.items
						var self = this;
						this.client_options = [
							{id: 'all', text: 'All'},
						];
						clients.forEach(function (temp, i) {
							var client = {};
							client.id = temp.client_id;
							client.text = temp.name;
							self.client_options.push(client);
						});
						console.log(this.client_options);
					}
				})
				.catch(error => {
					console.log(error)
				})
			},
			handleChange() {
				for(let i = 0; i < this.temp_repository_table_columns.length; i++) {
					if (_.indexOf(this.repository_table_columns, this.temp_repository_table_columns[i]) != -1) {
						Vue.set(this.showcolumns, i, true);
					}
					else {
						Vue.set(this.showcolumns, i, false);
					}
				}
			},
			editRepository(id) {
				this.$router.push('/origination/did_repository/edit/' + id);
			},
			createRepository() {
				this.$router.push('/origination/did_repository/new/');
			},
			viewIPList (id) {
				this.loading_ip = true;
				this.data = {};
				this.showModal='ip_list';
				const url = api.getEndpointUrl() + '/v1/did/client/' + id
				this.$http.get(url)
				.then(response => {
					const body = response.body
					if (body.success) {
						Vue.set(this.data, 'hosts', body.payload.resource.ip);
					}
					this.loading_ip = false;
				})
				.catch(error => {
					console.log(error)
					this.loading_ip = false;
				})
			},
			getRepositoryIndex (id) {
				return _.findIndex(this.repositories, elem => elem.id === id)
			},
			toggleChecker () {
				const state = this.checker
				const repositories = this.repositories
				const reposLength = repositories.length
				for (let i = 0; i < reposLength; i++) {
					repositories[i].selected = state
				}
			},
			deleteSelected () {
				this.setAsyncConfirm('Are you sure you want to delete this selected repositories')
				.then(result => {
					if (result.accepted) {
						var vm = this;
						this.repositories.forEach(function (repository, i) {
							if (repository.selected == true) {
								let index = vm.getRepositoryIndex(repository.id)
								if (~index) {
									vm.repositories.splice(index, 1)
								}
								vm.deleteRepository(repository.id)
							}
						});
						if (this.checker)
							this.checker = false;
						this.setMessage('Selected repositories were removed successfully')
					}
				})
				.catch(error => {
					console.log(error)
				})
			},
			deleteAll () {
				if (this.repositories.length == 0) {
					this.setMessage({
						message:'There are no items at all',
						type:'error'
					});
					this.checker = false;
					return;                            
				}
				
				this.setAsyncConfirm('Are you sure you want to delete all this repositories')
				.then(result => {
					if (result.accepted) {
						var vm = this;
						this.repositories.forEach(function (repository, i) {
							vm.deleteRepositories(repository.id)
						});
						if (this.checker)
							this.checker = false;
						this.repositories = [];
						this.setMessage('All repositories were removed successfully')
					}
				})
				.catch(error => {
					console.log(error)
				})
			},
			changePageRow (value) {
				console.log(value);
				if (value !== this.per_page) {
					this.per_page = value
					this.$nextTick(this.fetchRepositories)
				}
			},
			deleteRepository(id) {
				const url = api.getEndpointUrl() + '/v1/did/repository/' + id
				this.$http.delete(url)
				.then(response => {
					if (response.body.success) {
						let index = this.getRepositoryIndex(id)
						if (~index) {
							this.repositories.splice(index, 1)
						}
						this.setMessage('Repository was removed successfully')
					}
				})
			},
			askDeleteConfirm(id) {
				this.setAsyncConfirm('Are you sure you want to delete this repository')
				.then(result => {
					if (result.accepted) {
						this.deleteRepository(id)
					}
				})
				.catch(error => {
					console.log(error)
				})
			},
            sortColumn(column) {
                if(this.name_sort == 'asc') {
                    this.name_sort = 'desc'
                    this.sort = this.name_sort
                    this.order = column
                    this.fetchRepositories()
                }

                else if(this.name_sort == 'desc') {
                    this.name_sort = 'asc'
                    this.sort = this.name_sort
                    this.order = column
                    this.fetchRepositories()
                }
            },
            getQueries() {
				const page = '?page=' + (this.pageOne.currentPage - 1)
				const per_page = '&per_page=' + this.per_page
                const order = '&order_by=' + this.order + '&order_dir=' + this.sort
				return page + per_page + order
			},
            fetchRepositories () {
                const url = api.getEndpointUrl() + '/v1/did/repository/list' + this.getQueries()
				this.$http.get(url)
				.then(response => {
					const body = response.body
					if (body.success) {
						this.repositories = body.payload.items
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
					this.$nextTick(this.fetchRepositories)
				}
			},
			closeModal: function() {
				this.showModal = '';
			},
			exportCSV: function()
			{
				var csvArray = new Array();
				var fields = ["did", "vendor_res_id", "vendor_billing_rule_id", "did_client", "client_billing_rule_id", "created_time", "assigned_time", "end_time"];
				csvArray.push(fields);
				this.repositories.forEach(function (repository, i) {
					var values = new Array();
					values.push(repository.did);
					values.push(repository.vendor_res_id);
					values.push(repository.vendor_billing_rule_id);
					values.push(repository.did_client);
					values.push(repository.client_billing_rule_id);
					values.push(repository.created_time);
					values.push(repository.assigned_time);
					values.push(repository.end_time);
					csvArray.push(values);                
				});
				exportToCsv('origination_did_repository_export.csv', csvArray);
			}
		},
		mounted: function () {
			$('[data-toggle="tooltip"]').tooltip();
		},
        created () {
			this.fetchVendors()
			this.fetchClients()
            this.fetchRepositories()
        },
		updated: function () {
			document.querySelector('.el-input > input').placeholder = 'Show/Hide Columns';
		},
	}
</script>

<style>
	th.width-65 .checkbox-success{
	    margin: 5px 10px -2px;
	}
</style>
