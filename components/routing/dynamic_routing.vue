<template>
	<div class="container-fluid">
		<div class="row">
			<div class="wrapper single">
				<time-display></time-display>
				<ol class="breadcrumb">
					<li class="breadcrumb-item">
						<a href="#">Routing</a>
					</li>
					<li class="breadcrumb-item active">Dynamic Routing</li>
				</ol>
				<h1 class="page-header">Dynamic Routing</h1>
				<confirm v-show="showModal" @close="showModal = false" @submit="submit"></confirm>
				<div class="btn-group" role="group">
					<button type="button" class="btn btn-default" @click="showMassEditModal">
						<span class="dnl_icon dnl_add"></span> Mass Edit
					</button>
					<button type="button" class="btn btn-default" @click="createNew">
						<span class="dnl_icon dnl_add"></span> Create New
					</button>
					<!-- <button type="button" class="btn btn-default" @click.native="deleteAll">
								  <span class="dnl_icon dnl_action_delete"></span> Delete All
							  </button> -->
					<button type="button" class="btn btn-default" @click="deleteSelected">
						<span class="dnl_icon dnl_action_delete"></span> Delete Selected
					</button>
				</div>
				<div class="white_pad table_wrap">
					<spinner v-show="loading" class="spinner"></spinner>
					<div class="advanced_search_filter_panel">
						<div class="inline-block search_wrapper">
							<label>Search:</label>
							<br>
							<input type="text" name="search" v-model="search" class="form-control inline-block search_field" placeholder="Enter Search">
							<span class="dnl_icon dnl_musica-searcher"></span>
						</div>
						<div class="inline-block">
							<label>Routing Rule:</label>
							<br>
							<select2 :options="routing_rule_list" v-model="search_rule">
								<option disabled value="0">Select Routing Rule</option>
							</select2>
						</div>
						<!--<div class="inline-block">
				                        <a class="btn btn-primary">
				                            Query
				                        </a>
				                    </div>-->
					</div>
					<div class="table_filters">
						<div class="inline-block select_min_wrapper">
							<span class="inline-block">Page row:</span>
							<select2 :options="options1" v-model="selected1" class="inline-block" @pagecount="changePageCount">
							</select2>
						</div>
						<div class="inline-block">
							<!--<select2 :options="options2" v-model="selected2">
				                            <option disabled value="0">Show/Hide Columns</option>
				                        </select2>-->
							<el-select v-model="routing_table_columns" multiple placeholder="Show/Hide Columns" @change="handleChange">
								<el-option v-for="item in routing_table_column_options" :key="item.value" :label="item.label" :value="item.value">
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
											<input id="select_all" name="select_all" type="checkbox" v-model="checker" v-on:click="clickSelectedAll">
											<label for="select_all"></label>
										</div>
									</th>
									<th v-if="showcolumns[0]" @click="sortColumn('name')">Name
										<span class="dnl_icon dnl_sort pull-right"></span>
									</th>
									<th v-if="showcolumns[1]" @click="sortColumn('rule')">Routing Rule
										<span class="dnl_icon dnl_sort pull-right"></span>
									</th>
									<th v-if="showcolumns[2]" @click="sortColumn('time_profile')">Time Profile
										<span class="dnl_icon dnl_sort pull-right"></span>
									</th>
									<th v-if="showcolumns[3]" @click="sortColumn('usage_count')">Usage Count
										<span class="dnl_icon dnl_sort pull-right"></span>
									</th>
									<th v-if="showcolumns[4]" @click="sortColumn('qos_cycle')">QoS Cycle
										<span class="dnl_icon dnl_sort pull-right"></span>
									</th>
									<th v-if="showcolumns[5]">Updated at</th>
									<th v-if="showcolumns[6]">Updated by</th>
									<th v-if="showcolumns[7]" class="width-274">Action</th>
								</tr>
							</thead>
							<tbody>
								<tr v-if="!filterBy(routings, search).length">
									<td style="text-align: center" colspan="9">No Data Found</td>
								</tr>

								<tr v-for="(routing, index) in filterBy(routings, search)">
									<td class="centred_checkbox">
										<div class="checkbox checkbox-success">
											<input v-bind:id="'selected-' + index" v-bind:name="'selected-' + index" type="checkbox" v-model="routing.selected">
											<label v-bind:for="'selected-' + index"></label>
										</div>
									</td>
									<!-- 
				                          <td class="centred_checkbox">
				                              <div class="checkbox checkbox-success">
				                                <input :id="routing.dynamic_route_id" :name="routing.dynamic_route_id" type="checkbox" v-model="routing.status">
				                                <label :for="routing.dynamic_route_id"></label>
				                              </div>
				                          </td>
										  -->
									<td v-if="showcolumns[0]">{{routing.name}}</td>
									<td v-if="showcolumns[1]">{{routing.rule}}</td>
									<td v-if="showcolumns[2]">{{routing.time_profile}}</td>
									<td v-if="showcolumns[3]">{{routing.usage_count}}</td>
									<td v-if="showcolumns[4]">{{routing.qos_cycle}}</td>
									<td v-if="showcolumns[5]">{{routing.last_modified}}</td>
									<td v-if="showcolumns[6]">{{routing.modified_by}}</td>
									<td v-if="showcolumns[7]">
										<!--<a class="action action_menu" data-toggle="tooltip" data-placement="top" title="List" @click="showModal='list'">-->
										<!-- <a class="action action_menu" data-toggle="tooltip" data-placement="top" title="List" @click="showList(routing)">
				                                  <span class="dnl_icon dnl_action_menu"></span>
				                              </a> -->
										<router-link :to="'/routing/dynamic_routing/'+routing.dynamic_route_id+'/qos_parameters'" class="action action_settings" data-toggle="tooltip" data-placement="top" title="QoS Parameters">
											<span class="dnl_icon dnl_setting"></span>
										</router-link>
										<router-link :to="'/routing/dynamic_routing/'+routing.dynamic_route_id+'/trunk_priority'" class="action action_priority" data-toggle="tooltip" data-placement="top" title="Trunk Priority">
											<span class="dnl_icon dnl_ingress_host"></span>
										</router-link>
										<router-link :to="'/routing/dynamic_routing/override/' + routing.dynamic_route_id" class="action action_reply" data-toggle="tooltip" data-placement="top" title="Override">
											<span class="dnl_icon dnl_reply"></span>
										</router-link>
										<!-- <a class="action action_download" data-toggle="tooltip" data-placement="top" title="Download">
				                                  <span class="dnl_icon dnl_download"></span>
				                              </a> -->
										<a class="action action_edit" data-toggle="tooltip" data-placement="top" title="Edit" v-on:click="edit_routing(routing.dynamic_route_id)">
											<span class="dnl_icon dnl_action_edit"></span>
										</a>
										<a class="action action_delete" data-toggle="tooltip" data-placement="top" title="Delete" v-on:click="delete_routing(routing.dynamic_route_id)">
											<span class="dnl_icon dnl_action_delete"></span>
										</a>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="pull-right pagination">
						<pagination :current-page="pageOne.currentPage" :total-pages="pageOne.totalPages" @page-changed="pageOneChanged">
						</pagination>
					</div>
					<div class="clearfix"></div>
				</div>
			</div>
		</div>
		<modal v-if="showModal=='list'" @close="showModal = ''" class="biggest_modal">
			<h3 slot="header">Client DID Assignment</h3>
			<div slot="body">
				<div class="table-responsive">
					<table class="table table-striped table-hover agents ">
						<thead>
							<tr>
								<th>Id</th>
								<th>Carriers</th>
								<th>Egress Trunk Name</th>
								<th>CPS Limit</th>
								<th>Call Limit</th>
								<th>Active</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(egress_trunk, index) in current_routing.egress_trunks">
								<td>{{egress_trunk.trunk.resource_id}}</td>
								<td>{{egress_trunk.trunk.carrier}}</td>
								<td>{{egress_trunk.trunk.name}}</td>
								<td>{{egress_trunk.trunk.cps_limit}}</td>
								<td>{{egress_trunk.trunk.call_limit}}</td>
								<td>{{egress_trunk.trunk.is_active}}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div slot="footer">
				<!--<button class="btn btn-primary submit mini">Submit</button>
								<button @click="closeModal" class="btn btn-default cancel mini">Cancel</button>-->
			</div>
		</modal>
		<modal v-if="isShowMassEditModal==true" @close="isShowMassEditModal = false" class="big_modal">
			<h3 slot="header">Mass Edit</h3>
			<div slot="body">
				<div class="">
					<form class="form">
						<div class="col-sm-4">
							<div class="form-group">
								<label>Routing Rule:</label>
								<select class="selectable" v-model="route_rule_name">
									<option disabled value="" selected></option>
									<option v-for="routing_rule in routing_rule_list" v-bind:value="routing_rule.id">
										{{ routing_rule.text }}
									</option>
								</select>
							</div>
						</div>
						<div class="col-sm-4">
							<div class="form-group">
								<label>Time Profile:</label>
								<select class="selectable" v-model="time_profile_id">
									<option disabled value="0" selected></option>
									<option disabled value="all" selected>All</option>
									<option v-for="time_profile in time_profile_list" v-bind:value="time_profile.id">
										{{ time_profile.text }}
									</option>
								</select>
							</div>
						</div>
						<div class="col-sm-4">
							<div class="form-group">
								<label>Modify Type:</label>
								<select class="selectable" v-model="modify_type">
									<option disabled value="0" selected></option>
									<option v-for="item in modify_type_list" v-bind:value="item.id">
										{{ item.text }}
									</option>
								</select>
							</div>
						</div>
					</form>
				</div>
				<div class="m-bottom-10 text-left">
					<a class="btn btn-primary mini" @click="add_egress">
						<span class="dnl_icon dnl_add"></span> Add
					</a>
				</div>
				<div class="table-responsive">
					<table class="table table-striped table-hover agents ">
						<thead>
							<tr>
								<th>Carriers</th>
								<th>Trunk Name</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(egress, index) in egresses">
								<td>
									<select class="selectable" v-model="egress.carrier_id" @change="onchange(index)">
										<option disabled value="0" selected></option>
										<option v-for="item in carrier_list" v-bind:value="item.id">
											{{ item.text }}
										</option>
									</select>
								</td>
								<td>
									<select class="selectable" v-model="egress.trunk_id">
										<option disabled value="0" selected></option>
										<option v-for="trunk_item in egress.trunk_list" v-bind:value="trunk_item.id">
											{{ trunk_item.text }}
										</option>
									</select>
								</td>
								<td>
									<a class="action action_delete center-block" data-toggle="tooltip" data-placement="top" title="Delete" v-on:click="delete_egress(index)">
										<span class="dnl_icon dnl_action_delete"></span>
									</a>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div slot="footer">
				<button class="btn btn-primary mini submit" @click="massEdit">Submit</button>
				<button @click="isShowMassEditModal=false" class="btn btn-default mini cancel">Cancel</button>
			</div>
		</modal>
	</div>
</template>

<script>   
const vTabs = require('vue!../main_components/tabs.vue'),
	vTab = require('vue!../main_components/tab.vue'),
	vSelect = require('vue!../main_components/select.vue'),
	Pagination = require('vue!../main_components/pagination.vue'),
	modal = require('vue!../main_components/modal.vue'),
	vSpinner = require('vue!../main_components/fadeloader.vue'),
	confirmmodal = require('vue!../main_components/confirm_delete.vue');
_ = require('lodash');
const api = require("../../api");
const auth = require("../../auth");
import { mapActions } from 'vuex'

module.exports = {
	created: function() {
		this.fetchRoutings();
		this.fetchTimeProfile();
		this.fetchCarriers();
	},
	components: {
		'tabs': vTabs,
		'tab': vTab,
		'select2': vSelect,
		'pagination': Pagination,
		'confirm': confirmmodal,
		'modal': modal,
		'spinner': vSpinner
	},
	watch: {
		'search_rule': function() {
			var page = this.pageOne.currentPage - 1;
			var per_page = this.pageOne.cntpage;
			this.loading = true;

			var url_temp;
			if (this.search_rule == '0')
				url_temp = api.getEndpointUrl() + this.apiUrl + "?page=" + page + "&per_page=" + per_page + "&order_by=dynamic_route_id&order_dir=desc";
			else
				url_temp = api.getEndpointUrl() + this.apiUrl + "?page=" + page + "&per_page=" + per_page + "&order_by=dynamic_route_id&order_dir=desc&rule=" + this.search_rule;
			this.$http.get(url_temp,
				{
					headers: {
						"X-Auth-Token": auth.getToken()
					}
				}).then(function(response) {
					this.loading = false;
					//todo: check success flag? validation errors?
					var rates = response.body.payload.items;
					console.log(rates);
					this.rates = rates;
					var total_page = response.body.payload.total;
					this.pageOne.currentPage = response.body.payload.page + 1;
					this.pageOne.totalPages = Math.ceil(response.body.payload.total / per_page);
				}, function(error) {
					this.loading = false;
					console.log(error);
				});
		},
	},
	data: function() {
		return {
			carrier_list: [],
			egresses: [
				{
					selected: false,
					carrier_id: 0,
					trunk_id: 0,
					trunk_list: [],
				}
			],
			modify_type: '0',
			modify_type_list: [
				{ id: '1', text: 'Add' },
				{ id: '2', text: 'Delete' },
				{ id: '3', text: 'Replace the current trunk' },
			],
			time_profile_id: '0',
			route_rule_name: '',
			isShowMassEditModal: false,
			apiUrl: '/v1/route/dynamic/list',
			routing_rule_list: [
				{ id: 'by maximum ACD', text: 'Largest ACD' },
				{ id: 'by maximum ASR', text: 'Largest ASR' },
				{ id: 'LCR', text: 'LCR' },
				// { id: 'By ASR', text: 'By ASR' },
				// { id: 'By ACD', text: 'By ACD' },
				// { id: 'at the lowest cost', text: 'Lowest Cost' },
			],
			search_rule: '0',
			current_routing: null,

			selected_ids: [],

			showModal: '',
			order: 'dynamic_route_id',
			sort: 'desc',
			type_sort: 'asc',
			pageOne: {
				currentPage: 1,
				totalPages: 10,
				cntpage: 10
			},
			checker: '',
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
			options1: [
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
			routings: [],
			time_profile_list: [],
			routing_table_column_options: [{
				value: 'Name',
				label: 'Name'
			}, {
				value: 'Routing Rule',
				label: 'Routing Rule'
			}, {
				value: 'Time Profile',
				label: 'Time Profile'
			}, {
				value: 'Usage Count',
				label: 'Usage Count'
			}, {
				value: 'QoS Cycle',
				label: 'QoS Cycle'
			}, {
				value: 'Updated at',
				label: 'Updated at'
			}, {
				value: 'Updated by',
				label: 'Updated by'
			}, {
				value: 'Action',
				label: 'Action'
			}],
			routing_table_columns: ['Name', 'Routing Rule', 'Time Profile',
				'Usage Count', 'QoS Cycle', 'Updated at', 'Updated by', 'Action'],
			showcolumns: [true, true, true, true, true, true, true, true],
		}
	},
	methods: {
		...mapActions({
			setMessage: 'app_message/setAppMessage'
		}),
		add_egress() {
			this.egresses.push({
				selected: false,
				carrier_id: 0,
				trunk_id: 0,
				trunk_list: [],
			});
		},
		onchange: function(index) {
			this.loading = true;
			this.$http.get(api.getEndpointUrl() + '/v1/carrier/'+this.egresses[index].carrier_id+'/egress_trunk/list')
			.then(function(response) {
				var self = this;
				this.loading = false;
				var items = response.body.payload.items;

				self.egresses[index].trunk_list = [];
				self.egresses[index].trunk_id = 0;
				items.forEach(function(item, i){
					if (item.is_active) {
						var trunk = {};
						trunk.id = item.resource_id;
						trunk.value = item.name;
						trunk.text = item.name;
						self.egresses[index].trunk_list.push(trunk);
						self.egresses[index].trunk_id = 0;
					}
				});
			}, function(error) {
				this.loading = false;
				console.log(error);
			});
		},
		fetchCarriers() {
			var per_page=1;
			var url = api.getEndpointUrl() + "/v1/carrier/list?per_page="+per_page
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

					url = api.getEndpointUrl() + "/v1/carrier/list?per_page="+per_page
					console.log(url);
					this.loading = true;
					this.$http.get(url)
					.then(response => {
						const body = response.body
						if (body.success) {
							var self = this;
							var carriers = body.payload.items

							carriers.forEach(function (temp, i) {
								var carrier = {};
								carrier.id = temp.client_id;
								carrier.text = temp.name;
								self.carrier_list.push(carrier);
							});
							console.log(this.carrier_list);
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
		delete_egress(id) {
			this.egresses.splice(id, 1);
		},
		fetchTimeProfile() {
			var per_page = 1;
			this.loading = true;
			this.$http.get(api.getEndpointUrl() + "/v1/config/time_profile/list?per_page=" + per_page)
				.then(function(response) {
					this.loading = false;
					per_page = response.body.payload.total;
					this.loading = true;
					this.$http.get(api.getEndpointUrl() + "/v1/config/time_profile/list?per_page=" + per_page)
						.then(response => {
							this.loading = false;
							var self = this;
							var items = response.body.payload.items;
							items.forEach(function(item, i) {
								var time_profile = {};
								time_profile.id = item.time_profile_id;
								time_profile.text = item.name;
								self.time_profile_list.push(time_profile);
							});
							console.log(this.time_profile_list);
						})
						.catch(error => {
							console.log(error);
							this.loading = false;
						})

				}, function(error) {
					this.loading = false;
					console.log(error);
				});
		},
		massEdit() {
			var self = this;
			this.selected_ids.forEach(function(item, i){
				var reqBody;
				self.$http.get(api.getEndpointUrl() + '/v1/route/dynamic/' + item)
				.then(response => {
					const body = response.body
					if (body.success) {
						reqBody = body.payload;

						var newReqBody = {};
						newReqBody.name = reqBody.name;
						newReqBody.route_rule_name = reqBody.rule;
						if(reqBody.time_profile_id != null && reqBody.time_profile_id > 0)
							newReqBody.time_profile_id = reqBody.time_profile_id;
						newReqBody.qos_cycle = reqBody.qos_cycle;

						console.log(reqBody.egress_trunks);

						var vm = [];
						if (reqBody.egress_trunks.length > 0) {
							reqBody.egress_trunks.forEach(function(item, i) {
								var temp = {};
								temp.resource_id = item.trunk.resource_id;
								vm.push(temp);
							})
						}
						if(vm.length > 0)
							newReqBody.egress_trunks = vm;
						console.log(vm);
						var vm1 = [];
						if (self.egresses.length > 0) {
							self.egresses.forEach(function(egress, i){
								var temp = {};
								temp.resource_id = egress.trunk_id;
								vm1.push(temp);
							});
						}
						if(self.modify_type == '1') {
							if(vm1.length > 0) {
								newReqBody.egress_trunks.push(...vm1);
							}
						}
						else if(self.modify_type == '2') {
							if(vm1.length > 0) {
								vm1.forEach(function(item, i) {
									let index = _.findIndex(newReqBody.egress_trunks, elem => elem.resource_id === item.resource_id)
									if(~index)
										newReqBody.egress_trunks.splice(index, 1)
								})
							}
						}
						else if(self.modify_type == '3') {
							if(vm1.length > 0) {
								newReqBody.egress_trunks = vm1;
							}
						}

						console.log(newReqBody);
						
						self.$http.patch(api.getEndpointUrl() + '/v1/route/dynamic/' + item, newReqBody)
						.then(
							function(response) {
								self.loading = false;
								console.log(response);
								self.isShowMassEditModal = false;
								self.$router.push('/routing/dynamic_routing');
								self.setMessage('The dynamic routing has been changed!');
							},
							function(response) {
								self.loading = false;
								self.isShowMassEditModal = false;
								console.log(response);
								self.setMessage({
									message:"Changing dynamic routing is failed!",
									type:"error"
								});
							}
						)
					}
				})
				.catch(error => {
					console.log(error);
					self.loading = false;
					self.isShowMassEditModal = false;
				})
				
			})
		},
		showMassEditModal() {
			this.selected_ids = [];
			var vm = this;

			this.routings.forEach(function(routing, i) {
				if (routing.selected == true) {
					vm.selected_ids.push(routing.dynamic_route_id);
				}
			});

			if (this.selected_ids.length == 0) {
				this.setMessage({
					message: 'You must select at least one record that you want to modify!',
					type: 'error'
				});
				this.checker = false;

				return;
			}
			this.isShowMassEditModal = true;
		},
		handleChange() {
			if (_.indexOf(this.routing_table_columns, 'Name') != -1) {
				// this.showcolumns[0] = true;
				Vue.set(this.showcolumns, 0, true);
			}
			else {
				// this.showcolumns[0] = false;
				Vue.set(this.showcolumns, 0, false);
			}

			if (_.indexOf(this.routing_table_columns, 'Routing Rule') != -1) {
				// this.showcolumns[1] = true;
				Vue.set(this.showcolumns, 1, true);
			}
			else {
				// this.showcolumns[1] = false;
				Vue.set(this.showcolumns, 1, false);
			}

			if (_.indexOf(this.routing_table_columns, 'Time Profile') != -1) {
				// this.showcolumns[2] = true;
				Vue.set(this.showcolumns, 2, true);
			}
			else {
				// this.showcolumns[2] = false;
				Vue.set(this.showcolumns, 2, false);
			}

			if (_.indexOf(this.routing_table_columns, 'Usage Count') != -1) {
				// this.showcolumns[3] = true;
				Vue.set(this.showcolumns, 3, true);
			}
			else {
				// this.showcolumns[3] = false;
				Vue.set(this.showcolumns, 3, false);
			}

			if (_.indexOf(this.routing_table_columns, 'QoS Cycle') != -1) {
				// this.showcolumns[4] = true;
				Vue.set(this.showcolumns, 4, true);
			}
			else {
				// this.showcolumns[4] = false;
				Vue.set(this.showcolumns, 4, false);
			}

			if (_.indexOf(this.routing_table_columns, 'Updated at') != -1) {
				// this.showcolumns[5] = true;
				Vue.set(this.showcolumns, 5, true);
			}
			else {
				// this.showcolumns[5] = false;
				Vue.set(this.showcolumns, 5, false);
			}

			if (_.indexOf(this.routing_table_columns, 'Updated by') != -1) {
				// this.showcolumns[6] = true;
				Vue.set(this.showcolumns, 6, true);
			}
			else {
				// this.showcolumns[6] = false;
				Vue.set(this.showcolumns, 6, false);
			}

			if (_.indexOf(this.routing_table_columns, 'Action') != -1) {
				// this.showcolumns[7] = true;
				Vue.set(this.showcolumns, 7, true);
			}
			else {
				// this.showcolumns[7] = false;
				Vue.set(this.showcolumns, 7, false);
			}
		},
		deleteAll: function() {
			this.selected_ids = [];
			var vm = this;

			this.routings.forEach(function(routing, i) {
				vm.selected_ids.push(routing.dynamic_route_id)
			});

			if (this.selected_ids.length == 0) {
				this.setMessage({
					message: 'There are no items at all',
					type: 'error'
				});
				this.checker = false;

				return;
			}

			this.showModal = true;
			if (this.checker)
				this.checker = false;
		},
		createNew: function() {
			this.$router.push({ path: "/routing/dynamic_routing/new" });
		},
		deleteSelected: function() {
			console.log(this.routings);
			this.selected_ids = [];
			var vm = this;
			this.routings.forEach(function(rouing, i) {
				if (rouing.selected == true) {
					vm.selected_ids.push(rouing.dynamic_route_id);
				}
			});

			if (this.selected_ids.length == 0) {
				this.setMessage({
					message: 'The dynamic routings has been not selected!',
					type: 'error'
				});
				this.checker = false;

				return;
			}

			this.showModal = true;
			if (this.checker)
				this.checker = false;
		},
		clickSelectedAll: function() {
			if (this.checker) {
				this.routings.forEach(function(routing, i) {
					routing.selected = true;
				});
			}
			else {
				this.routings.forEach(function(routing, i) {
					routing.selected = false;
				});
			}
		},
		showList: function(routing) {
			this.current_routing = routing;
			this.showModal = 'list';
		},
		edit_routing: function(id) {
			this.$router.push({ path: "/routing/dynamic_routing/edit/" + id });
		},
		delete_routing: function(id) {
			this.showModal = true;
			this.selected_ids = [];
			this.selected_ids.push(id);
		},
		closeModal: function() {
			this.showModal = '';
		},
		submit: function() {
			var vm = this;
			this.showModal = false;

			this.selected_ids.forEach(function(item, i) {
				var routingid = item;
				if (routingid == 0) {
					vm.setMessage({
						message: 'The dynamic routings has been not selected!',
						type: 'error'
					});
				}
				else {
					vm.loading = true;
					vm.resource = vm.$resource(api.getEndpointUrl() + '/v1/route/dynamic/' + routingid);
					vm.resource.delete({ dynamic_route_id: routingid }).then(function(response) {
						vm.loading = false;
						let index = _.findIndex(vm.routings, elem => elem.dynamic_route_id === routingid)
						vm.routings.splice(index, 1)
						vm.setMessage('The dynamic routings have been deleted!')
					});
				}
			});
		},
		sortColumn(column) {
			if (this.type_sort == 'asc') {
				this.type_sort = 'desc'
				this.sort = this.type_sort
				this.order = column
				this.fetchRoutings()
			}
			else if (this.type_sort == 'desc') {
				this.type_sort = 'asc'
				this.sort = this.type_sort
				this.order = column
				this.fetchRoutings()
			}
		},
		getQueries(join = '?') {
			const page = 'page=' + (this.pageOne.currentPage - 1)
			const per_page = '&per_page=' + this.pageOne.cntpage
			const order = '&order_by=' + this.order + '&order_dir=' + this.sort
			return join + page + per_page + order
		},
		fetchRoutings() {
			this.loading = true;
			var page = this.pageOne.currentPage - 1;
			var per_page = this.pageOne.cntpage;
			this.loading = true;

			this.$http.get(api.getEndpointUrl() + this.apiUrl + this.getQueries(),
				{
					headers: {
						"X-Auth-Token": auth.getToken()
					}
				}).then(function(response) {
					this.loading = false;
					//todo: check success flag? validation errors?
					var routings = response.body.payload.items;
					console.log(routings);
					this.routings = routings;
					var total_page = response.body.payload.total;
					this.pageOne.currentPage = response.body.payload.page + 1;
					this.pageOne.totalPages = Math.ceil(response.body.payload.total / per_page);
				}, function(error) {
					this.loading = false;
					console.log(error);
				});
		},
		pageOneChanged(pageNum) {
			if (pageNum !== this.pageOne.currentPage) {
				this.pageOne.currentPage = pageNum
				this.$nextTick(this.fetchRoutings)
			}
		},
		changePageCount(countPerPage) {
			if (countPerPage !== this.pageOne.cntpage) {
				this.pageOne.cntpage = countPerPage
				this.$nextTick(this.fetchRoutings)
			}
		},
	},
	mounted: function() {
		$('[data-toggle="tooltip"]').tooltip();
	},
	updated: function() {
		document.querySelector('.el-input > input').placeholder = 'Show/Hide Columns';
	}

}
</script>

<style>
a.action.action_priority {
	padding-top: 4px;
	line-height: 0;
	font-size: 19px;
	vertical-align: top;
}

a.action.action_priority .dnl_icon.dnl_ingress_host {
	float: none;
	margin: 0;
}

.el-select__tags {
	display: none;
}

.m-bottom-10 {
	margin-bottom: 10px;
}



/* .custom_new {
		padding-top: 8px!important;
	} */
</style>
