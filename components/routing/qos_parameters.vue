<template>
	<div class="container-fluid">
      <div class="row">
		<div class="wrapper single">
			<time-display></time-display>
			<ol class="breadcrumb">
				  <li class="breadcrumb-item"><a>Origination</a></li>
                  <li class="breadcrumb-item"> 
                      <router-link to="/routing/dynamic_routing">Dynamic Routing</router-link>
                  </li>
				  <li class="breadcrumb-item active">QoS Parameters</li>
			</ol>
			<h1 class="page-header">QoS Parameters</h1>
            <router-link to="/routing/dynamic_routing" class="btn btn_white back"><span class="dnl_icon dnl_import"></span> Back </router-link>
			<div class="white_pad table_wrap">
				<div class="advanced_search_filter_panel bottom_0">
					<div class="inline-block search_wrapper pull-left">
						<label>Name:</label>
						<br>
						<input type="text" name="credit_search" v-model="credit_search" class="form-control inline-block search_field" placeholder="Enter Client Name">
						<span class="dnl_icon dnl_musica-searcher"></span>
					</div>
					<div class="inline-block search_wrapper">
						<label class="m-top-43"></label>
                        <a class="btn btn-primary">
                            Query
                        </a>
                    </div>
					<div class="clearfix little-space"></div>
                    <!-- <div class="col-md-8 col-sm-10"> -->
                        <div class="col-md-3 col-sm-4" style="padding-right: 0px">
                            <label for="asr_range_1">ASR Range:</label>
                            <input type="text" name="asr_range_1" v-model="asr_range_1" class="form-control" placeholder="Enter ASR Range">
                        </div>
						<div class="col-md-1 col-sm-2 dash">
							<label class="m-top-30">~</label>
						</div>
                        <div class="col-md-3 col-sm-4">
                            <label for="asr_range_2" class="m-top-15"></label>
                            <input type="text" name="asr_range_2" v-model="asr_range_2" class="form-control" placeholder="Enter ASR Range">
                        </div>
                    <!-- </div> -->
					 <div class="clearfix little-space"></div> 
					<!-- <div class="col-md-8 col-sm-10"> -->
						<div class="col-md-3 col-sm-4" style="padding-right: 0px">
							<label for="acd_range_1">ACD Range:</label>
							<input type="text" name="acd_range_1" v-model="acd_range_1" class="form-control" placeholder="Enter ACD Range">
						</div>
						<div class="col-md-1 col-sm-2 dash">
							<label class="m-top-30">~</label>
						</div>
						<div class="col-md-3 col-sm-4">
							<label for="acd_range_2" class="m-top-15"></label>
							<input type="text" name="acd_range_2" v-model="acd_range_2" class="form-control" placeholder="Enter ACD Range">
						</div>
					<!-- </div>  -->
					<div class="clearfix little-space"></div>
				</div>
                <a class="btn btn-primary mini pull-right m-top-20" @click="createNew">
                    <span class="dnl_icon dnl_add"></span> Create new 
                </a>
				<div class="table_filters m-top-15">
					<div class="inline-block select_min_wrapper">
						<span class="inline-block">Page row:</span>
						<select2 :options="options1" v-model="selected1" class="inline-block">
						</select2>
					</div>
					<div class="inline-block">
						<el-select v-model="qos_table_columns" multiple placeholder="Show/Hide Columns" @change="handleChange">
							<el-option v-for="item in qos_table_column_options" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</div>
				</div>
				<div class="clearfix"></div>
				<div class="table-responsive">
					<table class="table table-striped table-hover aliases credits">
					  <thead>
						<tr>
                          <th v-if="showcolumns[0]">Prefix</th>
						  <th v-if="showcolumns[1]">Min ASR<span class="dnl_icon dnl_sort pull-right"></span></th>
						  <th v-if="showcolumns[2]">Max ASR</th>
						  <th v-if="showcolumns[3]">Min ACD</th>
						  <th v-if="showcolumns[4]">Max ACD</th>
						  <th v-if="showcolumns[5]">Max Price</th>
						  <th class="width_98" v-if="showcolumns[6]">Actions</th>
						</tr>
					  </thead>
					  <tbody>
						<tr v-for="(parameter, index) in filterBy(parameters, credit_search)">
                          <td v-if="showcolumns[0]">
							<input v-if="parameter.is_creating || parameter.is_editing" type="text" name="prefix" v-model="parameter.digits" class="form-control" :class="{'input': true, 'is-danger': errors.has('prefix') }" v-validate="'required|numeric'" placeholder="Enter Prefix">
							<span v-if="parameter.is_creating || parameter.is_editing" v-show="errors.has('prefix')" class="help is-danger">{{ errors.first('prefix') }}</span>
							{{!parameter.is_creating && !parameter.is_editing?parameter.digits: ''}}
						</td>
						  <td v-if="showcolumns[1]"><input type="text" v-model="parameter.min_asr" class="form-control" v-if="parameter.is_creating || parameter.is_editing">{{!parameter.is_creating && !parameter.is_editing?parameter.min_asr: ''}}</td>
						  <td v-if="showcolumns[2]"><input type="text" v-model="parameter.max_asr" class="form-control" v-if="parameter.is_creating || parameter.is_editing">{{!parameter.is_creating && !parameter.is_editing?parameter.max_asr: ''}}</td>
						  <td v-if="showcolumns[3]"><input type="text" v-model="parameter.min_acd" class="form-control" v-if="parameter.is_creating || parameter.is_editing">{{!parameter.is_creating && !parameter.is_editing?parameter.min_acd: ''}}</td>
						  <td v-if="showcolumns[4]"><input type="text" v-model="parameter.max_acd" class="form-control" v-if="parameter.is_creating || parameter.is_editing">{{!parameter.is_creating && !parameter.is_editing?parameter.max_acd: ''}}</td>
						  <td v-if="showcolumns[5]"><input type="text" v-model="parameter.limit_price" class="form-control" v-if="parameter.is_creating || parameter.is_editing">{{!parameter.is_creating && !parameter.is_editing?parameter.limit_price: ''}}</td>
						  <td v-if="showcolumns[6]">
							  <a class="action action_save" data-toggle="tooltip" data-placement="top" title="Save" v-if="parameter.is_creating || parameter.is_editing" @click="validateParam(parameter)">
								  <span class="dnl_icon dnl_save"></span>
							  </a>
							  <a class="action action_edit" data-toggle="tooltip" data-placement="top" title="Edit" v-if="!parameter.is_creating && !parameter.is_editing" @click="editParam(parameter)">
								  <span class="dnl_icon dnl_action_edit"></span>
							  </a>
							  <a class="action action_delete" data-toggle="tooltip" data-placement="top" :title="parameter.is_creating? 'Cancel': 'Delete'" @click="delete_param(parameter, index)">
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
		  modal = require('vue!../main_components/modal.vue');
	const api = require("../../api");
	import { mapActions } from 'vuex';
	module.exports = {
		components: {
			'select2': vSelect,
			'pagination': Pagination,
			'modal': modal
		},
		props: ['id'],
		data: function(){
            return {
				showcolumns: [true, true, true, true, true, true, true],
				temp_qos_table_columns: ['Prefix', 'Min ASR', 'Max ASR', 'Min ACD', 'Max ACD', 'Max Price', 'Actions'],
				qos_table_columns: ['Prefix', 'Min ASR', 'Max ASR', 'Min ACD', 'Max ACD', 'Max Price', 'Actions'],
				qos_table_column_options: [{
					value: 'Prefix',
					label: 'Prefix'
				},
				{
					value: 'Min ASR',
					label: 'Min ASR'
				},
				{
					value: 'Max ASR',
					label: 'Max ASR'
				},
				{
					value: 'Min ACD',
					label: 'Min ACD'
				},
				{
					value: 'Max ACD',
					label: 'Max ACD'
				},
				{
					value: 'Max Price',
					label: 'Max Price'
				},
				{
					value: 'Actions',
					label: 'Actions'
				}
			],
              asr_range_1: '',
              asr_range_2: '',
              acd_range_1: '',
              acd_range_2: '',
			  credit_search:'',
			  checker: '',
			  showModal: '',
			  start_date:'',
			  end_date:'',
			  ftp_config_name: '',
			  pageOne: {
                currentPage: 1,
				totalPages: 10,
				cntpage: 10,
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
			  parameters: []
            }
        },
		methods: {
			...mapActions({
				setAsyncConfirm: 'async_confirm/setAsyncConfirm',
				setMessage: 'app_message/setAppMessage'
			}),
			editParam(item) {
				console.log("edit");
				// item.is_editing = true;
				Vue.set(item, 'is_editing', true);
			},
			saveNewParam(item) {
				console.log("111");
				var url;
				const reqBody = {
					min_asr: item.min_asr,
					max_asr: item.max_asr,
					min_acd: item.min_acd,
					max_acd: item.max_acd,
					limit_price: item.limit_price,
					digits: item.digits
				}
				if(item.is_editing) {
					url = api.getEndpointUrl() + '/v1/route/dynamic/qos/' + item.id;
					this.$http.patch(url, reqBody)
						.then(response => {
							if (response.body.success) {
								this.setMessage('Qos Parameter was changed successfully');
								var thisvm = this;
								item.is_editing = false;
							}
						})
						.catch(error => {
							console.log(error)
							this.setMessage({
								message: 'Failed to change parameter',
								type: 'error'
							})
						})
				}
				else if(item.is_creating) {
					url = api.getEndpointUrl() + '/v1/route/dynamic/' + this.id + '/qos/create';
					this.$http.post(url, reqBody)
					.then(response => {
						if (response.body.success) {
							this.setMessage('Qos Parameter was created successfully');
							this.parameters[0].id = response.body.object_id;
							if(this.parameters.length > this.pageOne.cntpage)
								this.parameters.splice(this.pageOne.cntpage, 1);
							this.pageOne.total_cnt ++;
							this.pageOne.totalPages = Math.ceil(this.pageOne.total_cnt / this.pageOne.cntpage);
							item.is_creating = false;
						}
					})
					.catch(error => {
						console.log(error)
						this.setMessage({
							message: 'Failed to create parameter',
							type: 'error'
						})
					})	
				}
			},
			validateParam(item) {
				var vm = this;
				this.$validator.validateAll().then(() => {
					const err = vm.$validator.getErrors();
					if (err.errors.length > 0) {
						const msg = err.errors[0].field + ' field must be an integer';
						vm.setMessage({
							message: msg,
							type: 'error'
						})
					}
					else {
						vm.saveNewParam(item);
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
			getParamIndex (id) {
				return _.findIndex(this.parameters, elem => elem.id === id)
			},
			deleteParam(id) {
				const url = api.getEndpointUrl() + '/v1/route/dynamic/qos/' + id
				this.$http.delete(url)
				.then(response => {
					if (response.body.success) {
						let index = this.getParamIndex(id)
						if (~index) {
							this.parameters.splice(index, 1)
						}
						this.pageOne.total_cnt --;
						this.pageOne.totalPages = Math.ceil(this.pageOne.total_cnt / this.pageOne.cntpage);
						if(this.pageOne.total_cnt > 0 && this.pageOne.total_cnt % this.pageOne.cntpage == 0) {
							this.pageOne.currentPage --;
							this.$nextTick(this.fetchQosParameters)
						}
						this.setMessage('Parameter was removed successfully')
					}
				})
			},
			askDeleteConfirm(id) {
				this.setAsyncConfirm('Are you sure you want to delete this parameter')
				.then(result => {
					if (result.accepted) {
						this.deleteParam(id)
					}
				})
				.catch(error => {
					console.log(error)
				})
			},
			delete_param(item, index) {
				if(item.is_creating)
					this.parameters.splice(index, 1);
				else
					this.askDeleteConfirm(item.id);
				
			},
			getQueries() {
				const page = '?page=' + (this.pageOne.currentPage - 1)
				const per_page = '&per_page=' + this.pageOne.cntpage
				const order = '&order_by=id&order_dir=desc'
				return page + per_page + order
			},
			createNew() {
				if(this.parameters.length > 0 && this.parameters[0].is_creating)
					return;
				this.parameters.splice(0, 0, {
					min_asr: '',
					max_asr: '',
					min_acd: '',
					max_acd: '',
					limit_price: '',
					digits: '',
					is_creating: true,
					is_editing: false,
				})
			},
			fetchQosParameters() {
				const url = api.getEndpointUrl() + '/v1/route/dynamic/' + this.id + '/qos/list' + this.getQueries()
				this.$http.get(url)
				.then(response => {
					const body = response.body
					if (body.success) {
						const parameters = body.payload.items
						this.parameters = parameters;
						this.pageOne.total_cnt = response.body.payload.total;
						this.pageOne.currentPage = response.body.payload.page + 1;
						this.pageOne.totalPages = Math.ceil(response.body.payload.total / this.pageOne.cntpage);
						console.log(this.parameters);
						
					}
				})
				.catch(error => {
					console.log(error)
				})
			},
			changePageCount (countPerPage) {
				if (countPerPage !== this.pageOne.cntpage) {
					this.pageOne.cntpage = countPerPage
					this.$nextTick(this.fetchQosParameters)
				}
			},
			handleChange() {
				for(let i = 0; i < this.temp_qos_table_columns.length; i++) {
					if (_.indexOf(this.qos_table_columns, this.temp_qos_table_columns[i]) != -1) {
						Vue.set(this.showcolumns, i, true);
					}
					else {
						Vue.set(this.showcolumns, i, false);
					}
				}
			},
			pageOneChanged (pageNum) {
				if (pageNum !== this.pageOne.currentPage) {
                    this.pageOne.currentPage = pageNum
                    this.$nextTick(this.fetchQosParameters)
                }
			},
			closeModal: function() {
				this.showModal = '';
			}
		},
		mounted: function () {
			$('[data-toggle="tooltip"]').tooltip();
		},
		created() {
			this.fetchQosParameters()
		},
		updated: function () {
			document.querySelector('.el-input > input').placeholder = 'Show/Hide Columns';
		},
	}
</script>

<style>
.m-top-43 {
	margin-top: 43px;
}
.dash {
	text-align:center;
	width: 20px;
	font-size: 20px;
}
</style>
