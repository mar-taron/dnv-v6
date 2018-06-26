<template>
	<div class="container-fluid">
      <div class="row">
		<div class="wrapper single">
			<time-display></time-display>
			<ol class="breadcrumb">
				  <li class="breadcrumb-item"><a>Origination</a></li>
				  <li class="breadcrumb-item active">Clients</li>
			</ol>
			<h1 class="page-header">Clients</h1>
			<div class="white_pad table_wrap">
				<div class="advanced_search_filter_panel bottom_0">
					<div class="inline-block search_wrapper">
						<label>Name:</label>
						<br>
						<input type="text" name="credit_search" v-model="credit_search" class="form-control inline-block search_field" placeholder="Enter Client Name">
						<span class="dnl_icon dnl_musica-searcher"></span>
					</div>
				</div>
				<div class="clearfix"></div>
                <router-link to="/origination/clients/new" class="btn btn-primary mini pull-right m-top-20">
                    <span class="dnl_icon dnl_add"></span> Create new
                </router-link>
				<button type="button" class="btn btn-default mini pull-right m-top-20 del_btn" @click="deleteSelected">
					<span class="dnl_icon dnl_action_delete"></span> Delete Selected
				</button>
				<div class="table_filters m-top-15">
					<div class="inline-block select_min_wrapper">
						<span class="inline-block">Page row:</span>
						<select2 :options="per_page_number_list" v-model="selected1" class="inline-block" @pagecount="changePageRow">
						</select2>
					</div>
					<div class="inline-block">
						<el-select v-model="client_table_columns" multiple placeholder="Show/Hide Columns" @change="handleChange">
							<el-option v-for="item in client_table_column_options" :key="item.value" :label="item.label" :value="item.value">
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
							<input type="checkbox" id="checker" v-model="checker" @click="toggleChecker()">
							<label for="checker"></label>
							</div>
						</th>
                          <th v-if="showcolumns[0]">IP</th>
						  <th v-if="showcolumns[1]" @click="sortColumn('name')">Name<span class="dnl_icon dnl_sort pull-right"></span></th>
						  <th v-if="showcolumns[2]">Balance</th>
						  <th v-if="showcolumns[3]">Allowed credit</th>
						  <th v-if="showcolumns[4]">Price Per Max Channel</th>
						  <th v-if="showcolumns[5]" @click="sortColumn('update_at')">Updated at<span class="dnl_icon dnl_sort pull-right"></span></th>
						  <th v-if="showcolumns[6]">Updated by</th>
						  <th v-if="showcolumns[7]" class="width_138">Actions</th>
						</tr>
					  </thead>
					  <tbody>
						<tr v-for="client in clients">
							<td class="centred_checkbox">
								<div class="checkbox checkbox-success">
								<input :id="client.client_id" :name="client.client_id" type="checkbox" v-model="client.status">
								<label :for="client.client_id"></label>
								</div>
							</td>
							<td v-if="showcolumns[0]">
								<a class="action action_read" data-toggle="tooltip" data-placement="top" title="View" @click="viewIPList(client.client_id)">
									<span class="dnl_icon dnl_eye"></span>
								</a>
							</td>
						  <td v-if="showcolumns[1]">{{client.name}}</td>
						  <td v-if="showcolumns[2]">{{client.balance}}</td>
						  <td v-if="showcolumns[3]">{{client.allowed_credit}}</td>
						  <td v-if="showcolumns[4]">{{client.price_per_max_channel}}</td>
						  <td v-if="showcolumns[5]">{{client.update_at}}</td>
						  <td v-if="showcolumns[6]">{{client.update_by}}</td>
						  <td v-if="showcolumns[7]">

							  <a class="action action_edit" data-toggle="tooltip" data-placement="top" title="Edit" @click="editClients(client.client_id)">
								  <span class="dnl_icon dnl_action_edit"></span>
							  </a>
                              <a class="action action_test" data-toggle="tooltip" data-placement="top" :title="client.active == true?'Deactivate':'Activate'" @click="changeStatusClient(client)">
								  <span class="dnl_icon dnl_check"></span>
							  </a>
							  <a class="action action_delete" data-toggle="tooltip" data-placement="top" title="Delete" @click="askDeleteConfirm(client.client_id)">
								  <span class="dnl_icon dnl_action_delete"></span>
							  </a>
                              <a class="action action_read" data-toggle="tooltip" data-placement="top" title="View DID">
								  <span class="dnl_icon dnl_eye"></span>
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
	  <modal v-if="showModal=='ip_list'" @close="showModal = ''" class="big_modal">

            <h3 slot="header">IP List</h3>
            <div slot="body">
                <div class="">
                    <div class="table-responsive">
						<spinner v-show="loading_ip" class="spinner"></spinner>
                        <table class="table table-striped table-hover carrier_groups aligned-center">
                            <thead>
                                <tr>
                                    <th>IP</th>
                                    <th>Port</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="host in data.hosts">
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
		  modal = require('vue!../main_components/modal.vue');
	const api = require("../../api");
	const vSpinner = require('vue!../main_components/fadeloader.vue');
	import { mapActions } from 'vuex'
	const auth = require("../../auth");
	module.exports = {
		components: {
			'select2': vSelect,
			'pagination': Pagination,
			'modal': modal,
			'spinner': vSpinner
		},
		data: function(){
			return {
				client_template: {},
				resource: {},
				temp_client: {},

				order: '',
				sort: '',
				name_sort: 'asc',

				showcolumns: [true, true, true, true, false, true, true, true],
				client_table_columns: ['IP', 'Name', 'Balance', 'Allowed credit', 'Updated at', 'Updated by', 'Actions'],
				temp_client_table_columns: ['IP', 'Name', 'Balance', 'Allowed credit', 'Updated at', 'Updated by', 'Actions'],
				client_table_column_options: [{
					value: 'IP',
					label: 'IP'
				}, {
					value: 'Name',
					label: 'Name'
				}, {
					value: 'Balance',
					label: 'Balance'
				}, {
					value: 'Allowed credit',
					label: 'Allowed credit'
				// }, {
				// 	value: 'Price Per Max Channel',
				// 	label: 'Price Per Max Channel'
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
				selected1: 1,
				per_page_number_list: [
					{ id: 1, text: '10' },
					{ id: 2, text: '20' },
					{ id: 3, text: '30' },
					{ id: 4, text: '50' },
					{ id: 5, text: '100' }
				],
				loading_ip: false,
				data: {},
			  credit_search:'',
			  checker: '',
			  showModal: '',
			  start_date:'',
			  end_date:'',
			  ftp_config_name: '',
			  pageOne: {
                currentPage: 1,
				totalPages: 10,
				per_page: 10,
              },
			  selected2: 0,
			  options2: [
				  { id: 1, text: 'Alias' },
				  { id: 2, text: 'Active' },
				  { id: 3, text: 'Actions' }
			  ],
			  clients: []
            }
        },
		methods: {
			...mapActions({
				setAsyncConfirm: 'async_confirm/setAsyncConfirm',
				setMessage: 'app_message/setAppMessage'
			}),
			deleteSelected() {
				var selected_count = 0;
				var clients = this.clients
				var checker = this.checker;
				clients.forEach(function (client, i) {
					if (client.status == true) {
						selected_count += 1;
					}
				});
				if(selected_count == 0) {
					this.setMessage({
						message: 'The clients has been not selected!',
						type: 'error'
					})
					return;
				}
				// delete selected items
				this.setAsyncConfirm('Are you sure you want to delete this selected clients')
				.then(result => {
					if (result.accepted) {
						var vm = this;
						clients.forEach(function (client, i) {
							if (client.status == true) {
								var no_message = true;
								vm.deleteClient(client.client_id, no_message)
							}
						});
						checker = false;
						this.setMessage('Selected Clients were removed successfully')
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
					clients[i].status = state
				}
			},
			changeStatusClient(item) {
				var resource = {
					bill_by_port: "by minutes",
					ip: [
						{
							resource_ip_id: 1,
							ip: '',
							port: 0
						}
					],
					resource_id: 1,
					media_type: 'Proxy Media + Transcoding',
					t38: false,
				}
				const url = api.getEndpointUrl() + '/v1/did/client/' + item.client_id;
				this.$http.patch(url, {
					active: !item.active,
					resource: item.resource != null? item.resource: resource,
				})
				.then(response => {
					item.active = !item.active;
					if(!item.active)
						this.setMessage('The trunk has been deactivated!');
					if(item.active)
						this.setMessage('The trunk has been activated!');
				})
				.catch(error => {
					console.log(error)
					if(item.active)
						this.setMessage({
							message: 'Failed to deactivate',
							type: 'error'
						})
					if(!item.active)
						this.setMessage({
							message: 'Failed to activate',
							type: 'error'
						})

				})
			},
			handleChange() {
				for(let i = 0; i < this.temp_client_table_columns.length; i++) {
					if (_.indexOf(this.client_table_columns, this.temp_client_table_columns[i]) != -1) {
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
					this.$nextTick(this.fetchClients)
				}
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
			getClientIndex (id) {
				return _.findIndex(this.clients, elem => elem.client_id === id)
			},
			deleteClient(id, no_message) {
				const url = api.getEndpointUrl() + '/v1/did/client/' + id
				this.$http.delete(url)
				.then(response => {
					if (response.body.success) {
						let index = this.getClientIndex(id)
						if (~index) {
							this.clients.splice(index, 1)
						}
						if(no_message == false)
							this.setMessage('Client was removed successfully')
					}
				})
            },
			askDeleteConfirm(id) {
				this.setAsyncConfirm('Are you sure you want to delete this client')
				.then(result => {
					if (result.accepted) {
						this.deleteClient(id, false)
					}
				})
				.catch(error => {
					console.log(error)
				})
			},
			editClients(id) {
				this.$router.push('/origination/clients/edit/' + id)
			},
            sortColumn(column) {
                if(this.name_sort == 'asc') {
                    this.name_sort = 'desc'
                    this.sort = this.name_sort
                    this.order = column
                    this.fetchClients()
                }
                else if(this.name_sort == 'desc') {
                    this.name_sort = 'asc'
                    this.sort = this.name_sort
                    this.order = column
                    this.fetchClients()
                }
            },
            getQueries(join = '?') {
                const page = 'page=' + (this.pageOne.currentPage - 1)
                const per_page = '&per_page=' + this.pageOne.per_page
                const order = '&order_by=' + this.order + '&order_dir=' + this.sort
                return join + page + per_page + order
            },
			fetchClients() {
				const url = api.getEndpointUrl() + '/v1/did/client/list' + this.getQueries()
				this.$http.get(url,
				{
					headers: {
						"X-Auth-Token": auth.getToken()
					}
				})
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
					this.$nextTick(this.fetchClients)
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
			this.fetchClients();
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

	@media (min-width: 768px) and (max-width: 924px) {
		.table {
			table-layout: fixed;
			word-wrap: break-word;
			font-size: 9px;
		}

		#app > div.container-fluid > div > div > div > div.table-responsive > table > thead > tr > th:nth-child(2),
		#app > div.container-fluid > div > div > div > div.table-responsive > table > tbody > tr:nth-child(1) > td.centred_checkbox {
			font-size: 9px;
		}
	}
</style>
