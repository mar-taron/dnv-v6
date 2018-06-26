<template>
	<div class="container-fluid">
      <div class="row">
		<div class="wrapper single">
			<time-display></time-display>
			<ol class="breadcrumb">
				  <li class="breadcrumb-item"><a>Routing</a></li>
                  <li class="breadcrumb-item"> 
                      <router-link to="/routing/dynamic_routing">Dynamic Routing</router-link>
                  </li>
				  <li class="breadcrumb-item active">Trunk Priority</li>
			</ol>
			<h1 class="page-header">Trunk Priority</h1>
            <div class="btn-group pull-right" role="group">
              <a @click="createPriority" type="button" class="btn btn-default create_new_iconed">
				  <span class="dnl_icon dnl_add"></span> Create New
			  </a>
              <button type="button" class="btn btn-default" @click="deleteAll">
                  <span class="dnl_icon dnl_action_delete"></span> Delete All
              </button>
              <button type="button" class="btn btn-default" @click="deleteSelected">
                  <span class="dnl_icon dnl_action_delete"></span> Delete Selected
              </button>
            </div>
            <router-link to="/routing/dynamic_routing" class="btn btn_white back"><span class="dnl_icon dnl_import"></span> Back </router-link>
			<div class="white_pad table_wrap">
				<spinner v-show="loading" class="spinner"></spinner>
				<div class="advanced_search_filter_panel bottom_0">
					<div class="inline-block search_wrapper pull-left">
						<label>Search:</label>
						<br>
						<input type="text" name="credit_search" v-model="credit_search" class="form-control inline-block search_field" placeholder="Enter Search">
						<span class="dnl_icon dnl_musica-searcher"></span>
					</div>
                    <div class="inline-block pull-left">
                        <label>Egress Trunk:</label>
                        <br>
                        <select2 :options="egress_options" v-model="egress_trunk">
                        </select2>
                    </div>
					<div class="col-md-2 col-sm-3" style="padding-right: 0px">
						<label for="priority_range_1">Priority Range:</label>
						<input type="text" name="priority_range_1" v-model="priority_range_1" class="form-control" placeholder="Enter Priority Range">
					</div>
					<div class="col-md-1 col-sm-1 dash">
						<label class="m-top-30">~</label>
					</div>
					<div class="col-md-2 col-sm-3">
						<label for="priority_range_2" class="m-top-15"></label>
						<input type="text" name="priority_range_2" v-model="priority_range_2" class="form-control" placeholder="Enter Priority Range">
					</div>
                    <!-- <div class="col-md-4 col-sm-8">
                        <div class="inlined">
                            <label for="priority_range_1">Priority Range:</label>
                            <input type="text" name="priority_range_1" v-model="priority_range_1" class="form-control" placeholder="Enter Priority Range">
                        </div>
                        <div class="inlined">
                            <label for="priority_range_2" class="m-top-15"></label>
                            <input type="text" name="priority_range_2" v-model="priority_range_2" class="form-control" placeholder="Enter Priority Range">
                        </div>
                    </div> -->
                    <div class="inline-block">
                        <a class="btn btn-primary m-top-25">
                            Query
                        </a>
                    </div>
                    <div class="clearfix"></div>
				</div>
				<div class="table_filters m-top-15">
					<div class="inline-block select_min_wrapper">
						<span class="inline-block">Page row:</span>
						<select2 :options="options1" v-model="selected1" class="inline-block">
						</select2>
					</div>
					<div class="inline-block">
						<select2 :options="options2" v-model="selected2">
							<option disabled value="0">Show/Hide Columns</option>
						</select2>
					</div>
				</div>
				<div class="clearfix"></div>
				<div class="table-responsive">
					<table class="table table-striped table-hover aliases credits">
					  <thead>
						<tr>
                          <th class="width-65">
							<div class="checkbox checkbox-success">
								<input id="select_all" name="select_all" type="checkbox" v-model="checker" v-on:click="clickSelectedAll">
								<label for="select_all"></label>
							</div>
						</th>
                          <th>Prefix</th>
						  <th>Egress Trunk<span class="dnl_icon dnl_sort pull-right"></span></th>
						  <th>Priority</th>
						  <th class="width_98">Actions</th>
						</tr>
					  </thead>
					  <tbody>
						<tr v-if="!trunks.length">
							<td colspan="5" class="text-center">No Data Found</td>
						</tr>
						<tr v-for="trunk in filterBy(trunks, credit_search)">
                          <td class="centred_checkbox">
                              <div class="checkbox checkbox-success">
                                <input :id="trunk.id" :name="trunk.id" type="checkbox" v-model="trunk.status">
                                <label :for="trunk.id"></label>
                              </div>
                          </td>
                          	<td>
								<input v-if="trunk.is_creating || trunk.is_editing" type="text" name="prefix" v-model="trunk.digits" class="form-control" :class="{'input': true, 'is-danger': errors.has('prefix') }" v-validate="'required|numeric'" placeholder="Enter Prefix">
								<span v-if="trunk.is_creating || trunk.is_editing" v-show="errors.has('prefix')" class="help is-danger">{{ errors.first('prefix') }}</span>
							  	{{!trunk.is_creating && !trunk.is_editing?trunk.digits: ''}}
							</td>
						  	<td>
								<select class="selectable" v-model="trunk.resource_id" v-if="trunk.is_creating || trunk.is_editing">
									<option v-for="item in egress_options" v-bind:value="item.id">
										{{ item.text }}
									</option>
								</select>
							  	{{!trunk.is_creating && !trunk.is_editing?trunk.trunk_name: ''}}
							</td>
						  	<td>
								<select class="selectable" v-model="trunk.resource_pri" v-if="trunk.is_creating || trunk.is_editing">
									<option v-for="item in priority_options" v-bind:value="item.id">
										{{ item.text }}
									</option>
								</select>
								{{!trunk.is_creating && !trunk.is_editing?trunk.resource_pri: ''}}
							</td>
						  <td>
							<a class="action action_save" data-toggle="tooltip" data-placement="top" title="Save" v-if="trunk.is_creating || trunk.is_editing" @click="savePriority(trunk)">
								<span class="dnl_icon dnl_save"></span>
							</a>
							<a class="action action_edit" data-toggle="tooltip" data-placement="top" title="Edit" v-if="!trunk.is_creating && !trunk.is_editing" @click="editPriority(trunk)">
								<span class="dnl_icon dnl_action_edit"></span>
							</a>
							  <a class="action action_delete" data-toggle="tooltip" data-placement="top" title="Delete" @click="delete_trunk(trunk)">
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
	</div>
</template>

<script>   
	const vSelect = require('vue!../main_components/select.vue'),
		  Pagination = require('vue!../main_components/pagination.vue'),
		  vSpinner = require('vue!../main_components/fadeloader.vue'),
		  modal = require('vue!../main_components/modal.vue');
	const api = require("../../api");
	import {mapActions} from 'vuex'
	module.exports = {
		components: {
			'select2': vSelect,
			'pagination': Pagination,
			'modal': modal,
			'spinner': vSpinner
		},
		props: ['id'],
		data: function(){
            return {
				priority_options: [
					{id: 1, text: '1'},
					{id: 2, text: '2'},
					{id: 3, text: '3'},
					{id: 4, text: '4'},
					{id: 5, text: '5'},
					{id: 6, text: '6'},
					{id: 7, text: '7'},
					{id: 8, text: '8'},
					{id: 9, text: '9'},
				],
				loading: false,
				egress_options: [],
              priority_range_1: '',
              priority_range_2: '',
			  credit_search:'',
			  checker: false,
			  showModal: '',
			  start_date:'',
			  end_date:'',
			  ftp_config_name: '',
			  pageOne: {
                currentPage: 1,
                totalPages: 10,
				per_page: 10,
				total_cnt: 0,
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
              egress_trunk: '',
			  trunks: []
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
				this.trunks.forEach(function (trunk, i) {
					if (trunk.status == true) {
						selected_count += 1;
					}
				});
				if(selected_count == 0) {
					this.setMessage({
						message: 'The priority has been not selected!',
						type: 'error'
					})
					return;
				}
				// delete selected items
				this.setAsyncConfirm('Are you sure you want to delete this selected priorities')
				.then(result => {
					if (result.accepted) {
						var vm = this;
						this.trunks.forEach(function (trunk, i) {
							if (trunk.status == true) {
								var no_message = true;
								vm.delete_priority(trunk.id, no_message)
							}
						});
						if (this.checker)
							this.checker = false;
						this.setMessage('Selected priorities were removed successfully')
					}
				})
				.catch(error => {
					console.log(error)
				})
			},
			deleteAll () {
				if (this.trunks.length == 0) {
					this.setMessage({
						message:'There are no priority at all',
						type:'error'
					});
					this.checker = false;
					return;                            
				}
				
				this.setAsyncConfirm('Are you sure you want to delete all priorities')
				.then(result => {
					if (result.accepted) {
						var vm = this;
						var no_message = true;
						this.trunks.forEach(function (trunk, i) {
							vm.delete_priority(trunk.id, no_message)
						});
						if (this.checker)
							this.checker = false;
						this.trunks = [];
						this.setMessage('All Priorities were removed successfully')
					}
				})
				.catch(error => {
					console.log(error)
				})
			},
			clickSelectedAll: function() {
                console.log("select_all-->"+this.checker);
                var vm = this;
                if(this.checker) {
                    this.trunks.forEach(function(trunk, i){
                        trunk.status = true;
                    });
                }
                else {
                    this.trunks.forEach(function(trunk, i){
                        trunk.status = false;
                    });
                }
            },
			delete_trunk(trunk) {
				if(trunk.is_creating)
                    this.trunks.splice(0, 1);
                else {
                    this.askDeleteConfirm(trunk.id);
                }
			},
			editPriority(trunk) {
				Vue.set(trunk, 'is_editing', true);
			},
			savePriority(trunk) {
				this.loading = true;
				const reqBody = {
					digits: trunk.digits,
					resource_pri: trunk.resource_pri,
					resource_id: trunk.resource_id,
				}
				if(trunk.is_editing) {
					this.$http.patch(api.getEndpointUrl() + '/v1/route/dynamic/pri/' + trunk.id, reqBody)
					.then(response => {
						if (response.body.success) {
							this.setMessage('Trunk priority was changed successfully');
							let index = _.findIndex(this.egress_options, elem => elem.id   === trunk.resource_id)
							if (~index) {
								trunk.trunk_name = this.egress_options[index].text;
							}
							trunk.is_editing = false;
						}
						this.loading = false;
					})
					.catch(error => {
						this.loading = false;
						console.log(error)
						this.setMessage({
							message: 'Failed to change priority',
							type: 'error'
						})
					})	
				}
				else if(trunk.is_creating) {
					this.$http.post(api.getEndpointUrl() + '/v1/route/dynamic/'+this.id+'/pri/create', reqBody)
					.then(response => {
						if (response.body.success) {
							this.setMessage('Trunk priority was created successfully');
							trunk.id = response.body.object_id;
							let index = _.findIndex(this.egress_options, elem => elem.id   === trunk.resource_id)
							if (~index) {
								trunk.trunk_name = this.egress_options[index].text;
							}
							if(this.trunks.length > this.pageOne.per_page)
								this.trunks.splice(this.pageOne.per_page, 1);
							this.pageOne.total_cnt ++;
							this.pageOne.totalPages = Math.ceil(this.pageOne.total_cnt / this.pageOne.per_page);
							trunk.is_creating = false;
						}
						this.loading = false;
					})
					.catch(error => {
						console.log(error);
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
				}
			},
			createPriority() {
				if(this.trunks.length > 0 && this.trunks[0].is_creating)
					return;
				var trunk_id = this.egress_options.length>0? this.egress_options[0].id: 0;
				this.trunks.splice(0, 0, {
					digits: '',
					resource_id: trunk_id,
					resource_pri: 1,
					is_creating: true,
					is_editing: false,
				})
			},
			delete_priority(id, no_message=false) {
				this.resource = this.$resource(api.getEndpointUrl() + '/v1/route/dynamic/pri/'+id);
				this.resource.delete({id:id})
				.then(response => {
					if (response.body.success) {
						let index = _.findIndex(this.trunks, elem => elem.id   === id)
						this.trunks.splice(index, 1)
						if(no_message == false)
							this.setMessage('Trunk priority was removed successfully')
					}
				})
				.catch(error => {
					console.log(error)
				})
			},
			askDeleteConfirm(id) {
				this.setAsyncConfirm('Are you sure you want to delete?')
				.then(result => {
					if (result.accepted) {
						this.delete_priority(id)
					}
				})
				.catch(error => {
					console.log(error)
				})
			},
			getQueries() {
				const page = '?page=' + (this.pageOne.currentPage - 1)
				const per_page = '&per_page=' + this.pageOne.per_page
				return page + per_page
			},
			fetchPriorities() {
				this.loading = true;
				const url = api.getEndpointUrl() + '/v1/route/dynamic/'+this.id+'/pri/list' + this.getQueries()
				this.$http.get(url)
				.then(response => {
					const body = response.body
					if (body.success) {
						this.trunks = body.payload.items
						var self = this;
						this.trunks.forEach(function (temp, i) {
							let index = _.findIndex(self.egress_options, elem => elem.id   === temp.resource_id)
							if (~index) {
								temp.trunk_name = self.egress_options[index].text;
							}
						});
						this.pageOne.total_cnt = body.payload.total;
						this.pageOne.currentPage = body.payload.page + 1
						this.pageOne.totalPages = Math.ceil(body.payload.total / body.payload.per_page)
					}
					this.loading = false;
				})
				.catch(error => {
					console.log(error)
					this.loading = false;
				})
			},
			fetchEgressTrunks() {
				this.loading = true;
				const url = api.getEndpointUrl() + "/v1/route/dynamic/" + this.id
				console.log(url);
				this.$http.get(url)
					.then(response => {
						const body = response.body
						if (body.success) {
							var self = this;
							const payload = body.payload
							var trunks = payload.egress_trunks;
							trunks.forEach(function (temp, i) {
								var egress_trunk = {};
								egress_trunk.id = temp.trunk.resource_id;
								egress_trunk.text = temp.trunk.name;
								self.egress_options.push(egress_trunk);
							});
						}
						this.loading = false;
						this.fetchPriorities();
					})
					.catch(error => {
						console.log(error)
						this.loading = false;
					})
			},
			pageOneChanged (pageNum) {
				this.pageOne.currentPage = pageNum
			},
			closeModal: function() {
				this.showModal = '';
			}
		},
		mounted: function () {
			$('[data-toggle="tooltip"]').tooltip();
		},
		created() {
			this.fetchEgressTrunks()
		}
	}
</script>

<style>
.dash {
	text-align:center;
	width: 20px;
	font-size: 20px;
}
</style>
