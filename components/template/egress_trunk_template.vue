<template>
	<div class="container-fluid">
      <div class="row">
		<div class="wrapper single">
			<time-display></time-display>
			<ol class="breadcrumb">
				<li class="breadcrumb-item"><a href="#">Template</a></li>
				<li class="breadcrumb-item active">Egress Trunk Template</li>
			</ol>
			<h1 class="page-header">Egress Trunk Template</h1>
            <div class="white_pad table_wrap">
                <spinner v-show="loading" class="spinner"></spinner>
                <div class="advanced_search_filter_panel bottom_0">
                    <div class="inline-block search_wrapper">
                        <label>Template Name:</label>
                        <br>
                        <input type="text" name="template_name" v-model="template_name" class="form-control inline-block search_field" placeholder="Enter Template Name" v-on:keyup.enter="searchByTemplateName">
                        <span class="dnl_icon dnl_musica-searcher"></span>
                    </div>
                    <div class="inline-block search_wrapper">
						<label class="m-top-15"></label>
						<a class="btn btn-primary mini" @click="searchByTemplateName">
							Query
						</a>
					</div>
                </div>
                <div class="clearfix little-space"></div>
                <router-link to="/template/egress_trunk_template/new" class="btn btn-primary mini pull-right">
                    <span class="dnl_icon dnl_add"></span> Create new 
                </router-link>
                <div class="table_filters bottom_0">
                    <div class="inline-block select_min_wrapper">
                        <span class="inline-block">Page row:</span>
                        <select2 :options="page_count_options" v-model="selected1" class="inline-block" @pagecount="changePageCount">
                        </select2>
                    </div>
                    <div class="inline-block">
                        <el-select v-model="egress_temp_table_columns" multiple placeholder="Show/Hide Columns" @change="handleChange">
                            <el-option v-for="item in egress_temp_table_column_options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="clearfix"></div>
                <div class="table-responsive">
                    <table class="table table-striped table-hover aliases">
                      <thead>
                        <tr>
                          <th v-if="showcolumns[0]" @click="sortColumn('name')">Template Name<span class="dnl_icon dnl_sort pull-right"></span></th>
                          <th v-if="showcolumns[1]" @click="sortColumn('create_on')">Created on<span class="dnl_icon dnl_sort pull-right"></span></th>
                          <th v-if="showcolumns[2]" @click="sortColumn('create_by')">Created by<span class="dnl_icon dnl_sort pull-right"></span></th>
                          <th v-if="showcolumns[3]" @click="sortColumn('update_on')">Last Updated<span class="dnl_icon dnl_sort pull-right"></span></th>
                          <th v-if="showcolumns[4]" @click="sortColumn('used_by')">Used by<span class="dnl_icon dnl_sort pull-right"></span></th>
                          <th v-if="showcolumns[5]" class="width-78">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                          <tr v-for="template in templates">
                              <td v-if="showcolumns[0]">
                                  {{template.name}}
                              </td>
                              <td v-if="showcolumns[1]">
                                  {{template.create_on.substr(0, 10) + ' ' + template.create_on.substr(11, 8) + template.create_on.substr(26, 3)}}
                              </td>
                              <td v-if="showcolumns[2]">
                                  {{template.create_by}}
                              </td>
                              <td v-if="showcolumns[3]">
                                  {{template.update_on.substr(0, 10) + ' ' + template.update_on.substr(11, 8) + template.update_on.substr(26, 3)}}
                              </td>
                              <td v-if="showcolumns[4]">
                                  {{template.used_by == 0? template.used_by: ''}}
                                  <a v-if="template.used_by > 0" class="blue_link" @click="items=[];showModal='used_list'; getUsedList(template.resource_template_id)">{{template.used_by}}</a>
                              </td>
                              <td v-if="showcolumns[5]">
                                <a class="action action_reply" data-toggle="tooltip" data-placement="top" title="Re-apply" v-if="template.used_by > 0">
                                    <span class="dnl_icon dnl_reply"></span>
                                </a>
                                <a class="action action_edit" data-toggle="tooltip" data-placement="top" title="Edit" @click="editTemplate(template.resource_template_id)">
                                    <span class="dnl_icon dnl_action_edit"></span>
                                </a>
                                <a class="action action_delete" data-toggle="tooltip" data-placement="top" title="Delete" @click="askDeleteConfirm(template.resource_template_id)">
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
      <modal v-if="showModal=='used_list'" @close="showModal = ''" class="big_modal">
			<h3 slot="header">Used List</h3>
			<div slot="body">
			  <div class="">
				  <div class="table-responsive">
                    <spinner v-show="loading_used" class="spinner"></spinner>
					<table class="table table-striped table-hover carrier_groups aligned-center">
					  <thead>
						 <tr>
							<th>Carrier Name</th>
							<th>Created on</th> 
                            <th>Created by</th> 
                            <th>Last Update On</th> 
						 </tr>
					  </thead>
					  <tbody>
						<tr v-for="item in items">
                            <td>{{item.carrier}}</td>
                            <td>
                                {{item.create_time.substr(0, 10) + ' ' + item.create_time.substr(11, 8) + item.create_time.substr(26, 3)}}
                            </td>
                            <td>{{item.update_by}}</td>
                            <td>
                                {{item.update_at.substr(0, 10) + ' ' + item.update_at.substr(11, 8) + item.update_at.substr(26, 3)}}
                            </td>
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
          vTabs = require('vue!../main_components/tabs.vue'),
		  vTab = require('vue!../main_components/tab.vue'),
          modal = require('vue!../main_components/modal.vue');
    const api = require("../../api");
    const vSpinner = require('vue!../main_components/fadeloader.vue');
    import { mapActions } from 'vuex'
    import _ from 'lodash'
    
	module.exports = {
		components: {
			'select2': vSelect,
			'pagination': Pagination,
            'tabs': vTabs,
			'tab': vTab,
            'modal': modal,
            'spinner': vSpinner
		},
		data: function(){
            return {
                loading_used: false,
                order: 'update_on',
                sort: 'desc',
                name_sort: 'asc',
                showcolumns: [true, true, true, true, true, true],
                back_egress_temp_table_columns: ['Template Name', 'Created on', 'Created by', 'Last Updated', 'Used by', 'Action'],
                egress_temp_table_columns: ['Template Name', 'Created on', 'Created by', 'Last Updated', 'Used by', 'Action'],
                egress_temp_table_column_options: [{
						value: 'Template Name',
						label: 'Template Name'
					},
					{
						value: 'Created on',
						label: 'Created on'
					},
					{
						value: 'Created by',
						label: 'Created by'
					},
					{
						value: 'Last Updated',
						label: 'Last Updated'
					},
					{
						value: 'Used by',
						label: 'Used by'
					},
					{
						value: 'Action',
						label: 'Action'
					}
				],
                loading: false,
              template_name: '',
			  pageOne: {
                currentPage: 1,
                totalPages: 10,
                per_page: 10,
              },
              showModal: '',
			  selected1: 1,
			  page_count_options: [
				  { id: 1, text: '10' },
				  { id: 2, text: '20' },
				  { id: 3, text: '30' },
				  { id: 4, text: '50' },
				  { id: 5, text: '100' }
			  ],
              selected2: '',
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
			  time_zone: 12,
			  time_zone_options: [
				  { id: 1, text: 'GMT -12:00' },
				  { id: 2, text: 'GMT -11:00' },
				  { id: 3, text: 'GMT -10:00' },
				  { id: 4, text: 'GMT -9:00' },
				  { id: 5, text: 'GMT -8:00' },
				  { id: 6, text: 'GMT -7:00' },
				  { id: 7, text: 'GMT -6:00' },
				  { id: 8, text: 'GMT -5:00' },
				  { id: 9, text: 'GMT -4:00' },
				  { id: 10, text: 'GMT -3:00' },
				  { id: 11, text: 'GMT -2:00' },
				  { id: 12, text: 'GMT -1:00' },
				  { id: 13, text: 'GMT +0:00' },
				  { id: 14, text: 'GMT +1:00' },
				  { id: 15, text: 'GMT +2:00' },
				  { id: 16, text: 'GMT +3:00' },
				  { id: 17, text: 'GMT +4:00' },
				  { id: 18, text: 'GMT +5:00' },
				  { id: 19, text: 'GMT +6:00' },
				  { id: 20, text: 'GMT +7:00' },
				  { id: 21, text: 'GMT +8:00' },
				  { id: 22, text: 'GMT +9:00' },
				  { id: 23, text: 'GMT +10:00' },
				  { id: 24, text: 'GMT +11:00' },
				  { id: 25, text: 'GMT +12:00' },
			  ],
              items: [],
			  templates: []
            }
        },
		methods: {
            ...mapActions({
				setAsyncConfirm: 'async_confirm/setAsyncConfirm',
				setMessage: 'app_message/setAppMessage'
			}),
            getUsedList(id) {
                this.loading_used = true;
                const url = api.getEndpointUrl() + "/v1/trunk/egress/list?resource_template_id=" + id;
                this.$http.get(url)
                    .then(response => {
                        const body = response.body
                        if (body.success) {
                            this.loading_used = false;
                            this.items = body.payload.items;
                            console.log(this.items);
                        }
                        else
                            this.loading_used = false;
                    })
                    .catch(error => {
                        console.log(error);
                        this.loading_used = false;
                    })
            },
            changePageCount(countPerPage) {
                if (countPerPage !== this.pageOne.per_page) {
                    this.pageOne.per_page = countPerPage
                    this.$nextTick(this.fetchEgressTrunkTemplate)
                }
            },
            searchByTemplateName() {
                this.pageOne.currentPage = 1;
                var page = this.pageOne.currentPage - 1;
                var per_page = this.pageOne.per_page;
                this.loading = true;

                this.$http.get(api.getEndpointUrl() + "/v1/config/egress_trunk_template/list?name=" + this.template_name + "&page=" + page + "&per_page=" + per_page + "&order_by=resource_template_id&order_dir=desc")
                .then(function(response) {
                        this.loading = false;
                        //todo: check success flag? validation errors?
                        this.templates = response.body.payload.items;
                        var total_page = response.body.payload.total;
                        this.pageOne.currentPage = response.body.payload.page + 1;
                        this.pageOne.totalPages = Math.ceil(response.body.payload.total / per_page);
                    }, function(error) {
                        this.loading = false;
                        console.log(error);
                    });
            },
            handleChange() {
				for(let i = 0; i < this.back_egress_temp_table_columns.length; i++) {
					if (_.indexOf(this.egress_temp_table_columns, this.back_egress_temp_table_columns[i]) != -1) {
						Vue.set(this.showcolumns, i, true);
					}
					else {
						Vue.set(this.showcolumns, i, false);
					}
				}
			},
            getTemplateIndex (id) {
				return _.findIndex(this.templates, elem => elem.resource_template_id === id)
			},
            sortColumn(column) {
                if(this.name_sort == 'asc') {
                    this.name_sort = 'desc'
                    this.sort = this.name_sort
                    this.order = column
                    this.fetchEgressTrunkTemplate()
                }

                else if(this.name_sort == 'desc') {
                    this.name_sort = 'asc'
                    this.sort = this.name_sort
                    this.order = column
                    this.fetchEgressTrunkTemplate()
                }
            },
            deleteTemplate(id) {
                this.loading = true;
                const url = api.getEndpointUrl() + '/v1/config/egress_trunk_template/' + id
				this.$http.delete(url)
				.then(response => {
					if (response.body.success) {
						let index = this.getTemplateIndex(id)
						if (~index) {
							this.templates.splice(index, 1)
						}
						this.setMessage('Template was removed successfully')
					}
                    this.loading = false;
				})
                .catch(error => {
					console.log(error);
                    this.setMessage({
						message: 'Failed to delete template',
						type: 'error'
					})
                    this.loading = false;
				})
            },
            askDeleteConfirm(id) {
                this.setAsyncConfirm('Are you sure you want to delete this template')
				.then(result => {
					if (result.accepted) {
						this.deleteTemplate(id)
					}
				})
				.catch(error => {
					console.log(error)
				})
            },
            editTemplate(id) {
                console.log(id);
                this.$router.push('/template/egress_trunk_template/edit/' + id)
            },
            sortColumn(column) {
                if(this.name_sort == 'asc') {
                    this.name_sort = 'desc'
                    this.sort = this.name_sort
                    this.order = column
                    this.fetchEgressTrunkTemplate()
                }

                else if(this.name_sort == 'desc') {
                    this.name_sort = 'asc'
                    this.sort = this.name_sort
                    this.order = column
                    this.fetchEgressTrunkTemplate()
                }
            },
            getQueries() {
                const page = '?page=' + (this.pageOne.currentPage - 1)
				const per_page = '&per_page=' + this.pageOne.per_page
                const order = '&order_by=' + this.order + '&order_dir=' + this.sort
                return page + per_page + order
            },
            fetchEgressTrunkTemplate () {
                this.loading = true;
                const url = api.getEndpointUrl() + '/v1/config/egress_trunk_template/list' + this.getQueries()
				this.$http.get(url)
				.then(response => {
					const body = response.body
					if (body.success) {
                        this.templates = body.payload.items
                        console.log(this.templates);
						var total_page = response.body.payload.total;
						this.pageOne.currentPage = response.body.payload.page + 1;
						this.pageOne.totalPages = Math.ceil(response.body.payload.total / this.pageOne.per_page);
					}
                    this.loading = false;
				})
				.catch(error => {
					console.log(error)
                    this.loading = false;
				})
            },
			pageOneChanged (pageNum) {
                if (pageNum !== this.pageOne.currentPage) {
					this.pageOne.currentPage = pageNum
					this.$nextTick(this.fetchEgressTrunkTemplate)
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
            this.fetchEgressTrunkTemplate();
        },
		updated: function () {
			document.querySelector('.el-input > input').placeholder = 'Show/Hide Columns';
		},
	}
</script>

<style>
</style>
