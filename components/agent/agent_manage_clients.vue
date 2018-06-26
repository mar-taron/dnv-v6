<template>
	<div class="container-fluid">
      <div class="row">
		<div class="wrapper single">
			<time-display></time-display>
			<ol class="breadcrumb">
				  <li class="breadcrumb-item"><a href="#">Agent</a></li>
				  <li class="breadcrumb-item active">Client Assignment</li>
			</ol>
			<h1 class="page-header">Client Assignment >> {{name}}</h1>
			<spinner v-show="loading" class="spinner"></spinner>
			<div class="white_pad table_wrap">
				<div class="table_filters searcheable">
					<div class="inline-block select_min_wrapper">
							<!-- <input type="text" name="client_search" v-model="client_search" class="form-control inline-block search_field" placeholder="Enter Client Name">
							<span class="dnl_icon dnl_musica-searcher"></span> -->
						<label>Client Name:</label>
						<select class="selectable" v-model="search_carrier">
							<option value="0"></option>
							<option v-for="item in carrier_options" v-bind:value="item.id">
								{{ item.text }}
							</option>
						</select>
					</div>
					<div class="inline-block search_wrapper">
						<label class="m-top-15"></label>
						<a class="btn btn-primary" @click="searchClient">
							Query
						</a>
					</div>
					<div class="inline-block select_min_wrapper">
						<span class="inline-block">Page row:</span>
						<select2 :options="options1" v-model="selected2" class="inline-block" @pagecount="changePageCount">
						</select2>
					</div>
					<div class="inline-block">
						<!-- <select2 :options="options2" v-model="selected2">
							<option disabled value="0">Show/Hide Columns</option>
						</select2> -->
						<el-select class="columns_show" v-model="client_table_columns" multiple placeholder="Show/Hide Columns" @change="handleChange">
							<el-option v-for="item in client_table_column_options" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</div>
					<router-link to="/agent/agent_management" class="btn btn-default mini pull-right">
						<span class="dnl_icon dnl_import"></span> Back 
					</router-link>
					<a class="btn btn-primary mini pull-right" @click="showModal = 'add_new_client'">
						<span class="dnl_icon dnl_add"></span> Create new 
					</a>
				</div>
				<div class="table-responsive">
					<table class="table table-striped table-hover clients">
						<thead>
						<tr>
							<th v-if="showcolumns[0]">Client Name<span class="dnl_icon dnl_sort pull-right"></span></th>
							<th v-if="showcolumns[1]">Comission</th>
							<th v-if="showcolumns[2]">Based On</th>
							<th v-if="showcolumns[3]">Assigned On</th>
							<th v-if="showcolumns[4]">Registered On</th>
							<th v-if="showcolumns[5]">Status</th>
							<th v-if="showcolumns[6]">Assigned By</th>
							<th v-if="showcolumns[7]" class="width-65">Action</th>
						</tr>
						</thead>
						<tbody>
						<tr v-for="client in filterBy(clients, client_search)">
							<td v-if="showcolumns[0]">{{client.name}}</td>
							<td v-if="showcolumns[1]">{{client.comission}}</td>
							<td v-if="showcolumns[2]">{{client.based_on}}</td>
							<td v-if="showcolumns[3]">{{client.assigned_on}}</td>
							<td v-if="showcolumns[4]">{{client.registered_on}}</td>
							<td v-if="showcolumns[5]">{{client.status}}</td>
							<td v-if="showcolumns[6]">{{client.assigned_by}}</td>
							<td v-if="showcolumns[7]">
								<a class="action action_delete" data-toggle="tooltip" data-placement="top" title="Delete">
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
	  <modal v-if="showModal=='add_new_client'" @close="showModal = ''">
			<h3 slot="header">Assign Agent Client</h3>
			<div slot="body">
			  <div class="">
				  <form class="form">
					  <div class="form-group">
						<label for="old_password">Agent Name:</label>
						<select2 :options="agent_options" v-model="agent"></select2>
						<!-- <el-select v-model="agent" filterable placeholder="Select">
							<el-option v-for="item in agent_options" :key="item.id" :label="item.text" :value="item.id">
							</el-option>
						</el-select> -->
					  </div>
					  <div class="form-group">
						<label for="new_password">Client Name:</label>
						<!-- <select2 :options="carrier_options" v-model="carrier"></select2> -->
						<el-select v-model="carrier" filterable placeholder="Select">
							<el-option v-for="item in carrier_options" :key="item.id" :label="item.text" :value="item.id">
							</el-option>
						</el-select>
					  </div>
					  <!-- <div class="form-group">
						<label for="confirm_password">Method Type:</label>
						<select2 :options="method_type_options" v-model="method_type"></select2>
					  </div> -->
				  </form>
			  </div>
			</div>
			<div slot="footer">
				<button class="btn btn-primary submit" @click="assignAgentClient">Submit</button>
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
		  const auth = require("../../auth");
		  const vSpinner = require('vue!../main_components/fadeloader.vue');
	_ = require('lodash');
	import {mapGetters,	mapActions} from 'vuex'
		  
	module.exports = {
		components: {
			'tabs': vTabs,
			'tab': vTab,
			'select2': vSelect,
			'pagination': Pagination,
			'modal': modal,
			'spinner': vSpinner
		},
		props: ['name','id'],
		data: function(){
            return {
				search_carrier: '0',
				loading: false,
				method_type: '',
				method_type_options: [
					{id: 'by margin', text: 'By Margin'},
					{id: 'by revenue', text: 'By Revenue'},
				],
				carrier: '',
				carrier_options: [],
				client_options: [],
				agent: '',
				agent_options: [],
				resource : null,
				apiUrl : '/v1/agent/list',
				pageOne: {
						currentPage: 1,
						totalPages: 10,
						cntpage : 10
				},
				showModal: '',
				search: '',
				client_search: '',
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
				selected2: 1,
				options1: [
					{ id: 1, text: '10' },
					{ id: 2, text: '20' },
					{ id: 3, text: '30' },
					{ id: 4, text: '50' },
					{ id: 5, text: '100' }
				],
				clients: [],
				client_table_column_options: [{
						value: 'Client Name',
						label: 'Client Name'
					},
					{
						value: 'Comission',
						label: 'Comission'
					},
					{
						value: 'Based On',
						label: 'Based On'
					},
					{
						value: 'Assigned On',
						label: 'Assigned On'
					},
					{
						value: 'Assigned By',
						label: 'Assigned By'
					},
					{
						value: 'Registered On',
						label: 'Registered On'
					},
					{
						value: 'Status',
						label: 'Status'
					},
					{
						value: 'Action',
						label: 'Action'
					}
				],
				temp_client_table_columns: ['Client Name', 'Comission', 'Based On', 'Assigned On', 'Assigned By', 'Registered On', 'Status', 'Action'],
				client_table_columns: ['Client Name', 'Comission', 'Based On', 'Assigned On', 'Assigned By', 'Registered On', 'Status', 'Action'],
				showcolumns: [true, true, true, true, true, true, true, true],				
			}
        },
		methods: {
			...mapActions({
				setAsyncConfirm: 'async_confirm/setAsyncConfirm',
				setMessage: 'app_message/setAppMessage'
			}),
			searchClient() {
			},
			getRequestForClient() {
				var client;
				client = {
					carriers:[{
						client_id: this.carrier
					}]
				}
				return client;
			},
			assignAgentClient() {
				const reqBody = this.getRequestForClient();
				const url = api.getEndpointUrl() + '/v1/agent/' + this.agent + '/carrier'
				this.$http.patch(url,reqBody)
				.then(response => {
					console.log(response);
					this.loading = false;
					var vmthis = this;
					if (response.body.success) {
						vmthis.setMessage('The agent has been modified!');
						setTimeout(function(){
							vmthis.$router.push('/agent/agent_management');
						}, 3000);
					}
					this.showModal = '';
				})
				.catch(error => {
					this.loading = false;
					var msg = '';
					console.log(error);
                    if(error.data.errors !== undefined)
                        msg = error.data.errors;
                    else if(error.data.error !== undefined)
                        msg = error.data.error.message;
					this.setMessage({
						message: msg,
						type: 'error'
					})				
				})
			},
			handleChange() {
				if (_.indexOf(this.agent_table_columns, 'Agent Name') != -1) {
					Vue.set(this.showcolumns, 0, true);
				} else {
					Vue.set(this.showcolumns, 0, false);
				}
				if (_.indexOf(this.agent_table_columns, 'Agent E-mail') != -1) {
					Vue.set(this.showcolumns, 1, true);
				} else {
					Vue.set(this.showcolumns, 1, false);
				}
				if (_.indexOf(this.agent_table_columns, 'Comission') != -1) {
					Vue.set(this.showcolumns, 2, true);
				} else {
					Vue.set(this.showcolumns, 2, false);
				}
				if (_.indexOf(this.agent_table_columns, 'Method') != -1) {
					Vue.set(this.showcolumns, 3, true);
				} else {
					Vue.set(this.showcolumns, 3, false);
				}
				if (_.indexOf(this.agent_table_columns, 'Frequency') != -1) {
					Vue.set(this.showcolumns, 4, true);
				} else {
					Vue.set(this.showcolumns, 4, false);
				}
				if (_.indexOf(this.agent_table_columns, 'Action') != -1) {
					Vue.set(this.showcolumns, 5, true);
				} else {
					Vue.set(this.showcolumns, 5, false);
				}
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
			pageOneChanged(pageNum) {
				if (pageNum !== this.pageOne.currentPage) {
					this.pageOne.currentPage = pageNum
					this.$nextTick(this.fetchClients)
				}
			},
			changePageCount (countPerPage) {
				if (countPerPage !== this.pageOne.cntpage) {
					this.pageOne.cntpage = countPerPage
					this.$nextTick(this.fetchClients)
				}
			},
			closeModal: function() {
				this.showModal = '';
			},
			askDeleteConfirm (id) {
				this.setAsyncConfirm('Are you sure you want to delete?')
				.then(result => {
					if (result.accepted) {
						this.delete_module(id)
					}
				})
				.catch(error => {
					console.log(error)
				})
			},
			delete_module (id) {
				this.resource = this.$resource(api.getEndpointUrl() + '/v1/agent/'+id);
				this.resource.delete({agent_id:id})
				.then(response => {
					if (response.body.success) {
						let index = _.findIndex(this.agents, elem => elem.agent_id   === id)
						this.agents.splice(index, 1)
						this.setMessage('Agent was removed successfully')
					}
				})
			},
			inactive_agent: function(item) {
				console.log(item);
				var vm = {};
				vm.name = item.user.name;
				vm.fullname = item.user.fullname;
				vm.passwd = item.user.passwd;
				this.$http.patch(api.getEndpointUrl() + '/v1/agent/' + item.agent_id,
				{
					"method_type": item.method_type,
					"email": item.email,
					"commission": item.commission,
					"agent_name": item.agent_name,
					"status": !item.status,
					"user": vm,
					"frequency_type": item.frequency_type,
					"edit_permission": true
				})
				.then(response => {
					console.log("success:");
					console.log(response);
					this.loading = false;
					if (response.body.success) {
						var thisvm = this;
						if(item.status)
							this.setMessage('The agent has been deactivated!');
						if(!item.status)
							this.setMessage('The agent has been activated!');
						setTimeout(function(){
							thisvm.$router.go(thisvm.$router.currentRoute);
						}, 3000);
						
					}
				})
				.catch(error => {
					console.log("error:");
					this.loading = false;
					var msg = '';
                    if(error.data.errors !== undefined)
                        msg = error.data.errors;
                    else if(error.data.error !== undefined)
                        msg = error.data.error.message;
					this.setMessage({
						message: msg,
						type: 'error'
					})				
				})
			},
			manage_clients: function(id) {

			},
			edit_agent: function(id){
				this.$router.push({path:"/agent/agent_management/edit/"+id});
			},
			fetchTotalAgentList() {
				const url = api.getEndpointUrl() + '/v1/agent/list'
				this.$http.get(url)
				.then(response => {
					const body = response.body
					if (body.success) {
						const agents = body.payload.items
						var self = this;
						agents.forEach(function (temp, i) {
							var agent = {};
							agent.id = temp.agent_id;
							agent.text = temp.agent_name;
							self.agent_options.push(agent);
							if (i == 0)
								self.agent = agent.id;
						});
						console.log(this.agent_options);
						
					}
				})
				.catch(error => {
					console.log(error)
				})
			},
			getQueries() {
				const page = '?page=' + (this.pageOne.currentPage - 1)
				const per_page = '&per_page=' + this.pageOne.cntpage
				return page + per_page
			},
			fetchClients() {
				const url = api.getEndpointUrl() + '/v1/agent/'+this.id+'/carrier' + this.getQueries()
				this.$http.get(url)
				.then(response => {
					const body = response.body
					if (body.success) {
						this.clients = body.payload.items
						console.log(this.clients);
						var total_page = response.body.payload.total;
						this.pageOne.currentPage = response.body.payload.page + 1;
						this.pageOne.totalPages = Math.ceil(response.body.payload.total / this.pageOne.cntpage );
					}
				})
				.catch(error => {
					console.log(error)
				})
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
										if(i == 0)
											self.carrier = carrier.id;
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
					console.log(error)
					this.loading = false;
				})
			},
		},
		created: function(){
			// this.fetchAgents();
			this.fetchClients();
			// this.fetchTotalAgentList();
			this.fetchCarriers();
		},
		mounted: function () {
			$('[data-toggle="tooltip"]').tooltip();
		},
		updated: function () {
			var elementList = document.querySelectorAll('.columns_show > .el-input > input');
			for (var index = 0; index < elementList.length; index++) {
				elementList[index].placeholder = 'Show/Hide Columns';
			}
		},
	}
</script>

<style>
#app > div.container-fluid > div.modal-mask > div > div > div.modal-body > div > div > form > div:nth-child(2) > span, 
#app > div.container-fluid > div.modal-mask > div > div > div.modal-body > div > div > form > div:nth-child(1) > span{
	z-index: 500!important;
}
	.table.table-striped.table-hover.agents th,
	.table.table-striped.table-hover.agents td,
	.table.table-striped.table-hover.clients th,
	.table.table-striped.table-hover.clients td {
		padding-right: 8px;
		text-align: center;
		vertical-align: middle;
	}
	
	.width-65 {
		width: 65px;
	}
	
	.table-responsive table.table.table-striped.table-hover.agents td:first-child,
	.table-responsive table.table.table-striped.table-hover.clients td:first-child {
		text-align: left;
	}
	
	table.table.table-striped.table-hover.agents td .checkbox,
	table.table.table-striped.table-hover.clients td .checkbox {
		padding-left: 20px;
		margin-top: 6px;
		margin-bottom: 0;
	}
	
	.agents .checkbox-success input[type="checkbox"]:checked + label::before,
	.clients .checkbox-success input[type="checkbox"]:checked + label::before {
		background-color: #03c0fc;
		border-color: #03c0fc;
	}
	
	table.table.table-striped.table-hover.agents tr:hover,
	table.table.table-striped.table-hover.clients tr:hover {
		background: #73767b;
	}
	
	.agent_tabs .select2 {
		width: 180px !important;
	}
	
	@media (max-width: 767px) {
		.inline-block.search_wrapper, .inline-block.search_wrapper input {
			width: 100%;
		}
	}

	.el-select__tags {
		display: none;
	}

</style>
