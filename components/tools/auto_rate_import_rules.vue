<template>
	<div class="container-fluid">
      <div class="row">
		<div class="wrapper single">
			<time-display></time-display>
			<ol class="breadcrumb">
				<li class="breadcrumb-item"><a href="#">Tools</a></li>
				<li class="breadcrumb-item active">Auto Rate Import Rules</li>
			</ol>
			<h1 class="page-header">Auto Rate Import Rules</h1>
            <div class="white_pad table_wrap">
                <div class="advanced_search_filter_panel bottom_0">
                    <div class="inline-block search_wrapper">
                        <label>Template Name:</label>
                        <br>
						<input type="text" name="template_name" v-model="template_name" class="form-control inline-block search_field" placeholder="Enter Template Name" v-on:keyup.enter="searchByName">
						<span class="dnl_icon dnl_musica-searcher" @click="searchByName"></span>
                    </div>
                </div>
                <div class="clearfix little-space"></div>
                <router-link to="/tools/auto_rate_import_rules/new" class="btn btn-primary mini pull-right">
                    <span class="dnl_icon dnl_add"></span> Create new 
                </router-link>
                <div class="table_filters bottom_0">
                    <div class="inline-block select_min_wrapper">
                        <span class="inline-block">Page row:</span>
                        <select2 :options="options1" v-model="selected1" class="inline-block" @pagecount="changePageRow">
                        </select2>
                    </div>
                    <div class="inline-block">
                        <el-select v-model="carrier_template_table_columns" multiple placeholder="Show/Hide Columns" @change="handleChange">
							<el-option v-for="item in carrier_template_table_column_options" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
                    </div>
                </div>
                <div class="clearfix"></div>
                <div class="table-responsive">
                    <table class="table table-striped table-hover aliases">
                      <thead>
                        <tr>
                          <th v-if="showcolumns[0]" class="table_column" @click="sortName">Template Name<span class="dnl_icon dnl_sort pull-right"></span></th>
                          <th v-if="showcolumns[1]" class="table_column" @click="sortCreatedOn">Created on<span class="dnl_icon dnl_sort pull-right"></span></th>
                          <th v-if="showcolumns[2]" class="table_column" @click="sortCreatedBy">Created by<span class="dnl_icon dnl_sort pull-right"></span></th>
                          <th v-if="showcolumns[3]" class="table_column" @click="sortLastUpdated">Last Updated<span class="dnl_icon dnl_sort pull-right"></span></th>
                          <th v-if="showcolumns[4]" class="table_column" @click="sortUsedBy">Used by<span class="dnl_icon dnl_sort pull-right"></span></th>
                          <th v-if="showcolumns[5]" class="width-78">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                          <tr v-for="template in filterBy(templates, template_name)">
                              <td v-if="showcolumns[0]">
                                  {{template.template_name}}
                              </td>
                              <td v-if="showcolumns[1]">
                                  {{template.create_on}}
                              </td>
                              <td v-if="showcolumns[2]">
                                  {{template.create_by}}
                              </td>
                              <td v-if="showcolumns[3]">
                                  {{template.update_on}}
                              </td>
                              <td v-if="showcolumns[4]">
                                  <a class="blue_link" @click="showModal='used_list'">{{template.used_by}}</a>
                              </td>
                              <td v-if="showcolumns[5]">
                                   <a class="action action_reset" data-toggle="tooltip" data-placement="top" title="Re-apply">
                                      <span class="dnl_icon dnl_refresh"></span>
                                   </a>
                                   <a class="action action_edit" data-toggle="tooltip" data-placement="top" title="Edit" @click="editTemplate(template.id)">
                                      <span class="dnl_icon dnl_action_edit"></span>
                                  </a>
                                  <a class="action action_delete" data-toggle="tooltip" data-placement="top" title="Delete" @click="askDeleteConfirm(template.id)">
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
                            <td>{{item.carrier_name}}</td>
                            <td>{{item.created_on}}</td>
                            <td>{{item.created_by}}</td>
                            <td>{{item.last_update_on}}</td>
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
    import { mapActions } from 'vuex'
	module.exports = {
		components: {
			'select2': vSelect,
			'pagination': Pagination,
            'tabs': vTabs,
			'tab': vTab,
            'modal': modal
		},
		data: function(){
            return {
				showcolumns: [true, true, true, true, true, true],
				carrier_template_table_columns: ['Template Name', 'Created on', 'Created by', 'Last Updated', 'Used by', 'Action'],
				temp_carrier_template_table_columns: ['Template Name', 'Created on', 'Created by', 'Last Updated', 'Used by', 'Action'],
				carrier_template_table_column_options: [{
					value: 'Template Name',
					label: 'Template Name'
				}, {
					value: 'Created on',
					label: 'Created on'
				}, {
					value: 'Created by',
					label: 'Created by'
				}, {
					value: 'Last Updated',
					label: 'Last Updated'
				}, {
					value: 'Used by',
					label: 'Used by'
				}, {
					value: 'Action',
					label: 'Action'
				}],
				order: '',
				sort: '',

				name_sort: 'asc',
				created_sort: 'asc',
				create_by_sort: 'asc',
				updated_sort: 'asc',
				used_by_sort: 'asc',

              template_name: '',
			  pageOne: {
                currentPage: 1,
				totalPages: 10,
				per_page: 10,
              },
              showModal: '',
			  selected1: 1,
			  options1: [
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
              items: [
                  {
                    carrier_name: 'Nisha007',
                    created_on: '2016-10-07 11:19:20+00',
                    created_by: 'Admin',
                    last_update_on: '2016-10-07 11:19:20+00'
                  },
                  {
                    carrier_name: 'Nisha007',
                    created_on: '2016-10-07 11:19:20+00',
                    created_by: 'Admin',
                    last_update_on: '2016-10-07 11:19:20+00'
                  },
                  {
                    carrier_name: 'Nisha007',
                    created_on: '2016-10-07 11:19:20+00',
                    created_by: 'Admin',
                    last_update_on: '2016-10-07 11:19:20+00'
                  }
              ],
			  templates: []
            }
        },
		methods: {
            ...mapActions({
				setAsyncConfirm: 'async_confirm/setAsyncConfirm',
				setMessage: 'app_message/setAppMessage'
			}),
			changePageRow (value) {
				if (value !== this.pageOne.per_page) {
					this.pageOne.per_page = value
					this.$nextTick(this.fetchCarrierTemplate)
				}
			},
			handleChange() {
				for(let i = 0; i < this.temp_carrier_template_table_columns.length; i++) {
					if (_.indexOf(this.carrier_template_table_columns, this.temp_carrier_template_table_columns[i]) != -1) {
						Vue.set(this.showcolumns, i, true);
					}
					else {
						Vue.set(this.showcolumns, i, false);
					}
				}
			},
			searchByName() {
				const name_search = '?template_name=' + this.template_name
				this.pageOne.currentPage = 1;
				const page = '&page=' + (this.pageOne.currentPage - 1)
				const per_page = '&per_page=' + this.pageOne.per_page
				const order = '&order_by=' + this.order + '&order_dir=' + this.sort
				var query = name_search + page + per_page + order
				const url = api.getEndpointUrl() + '/v1/config/carrier_template/list' + query
				this.$http.get(url)
				.then(response => {
					const body = response.body
					if (body.success) {
						this.templates = body.payload.items
						this.pageOne.currentPage = body.payload.page + 1
						this.pageOne.totalPages = Math.ceil(body.payload.total / body.payload.per_page)
					}
				})
				.catch(error => {
					console.log(error)
				})

			},
			sortName() {
				if(this.name_sort == 'asc') {
					this.name_sort = 'desc'
					this.sort = this.name_sort
					this.order = 'template_name'
					this.fetchCarrierTemplate()
				}
					
				else if(this.name_sort == 'desc') {
					this.name_sort = 'asc'
					this.sort = this.name_sort
					this.order = 'template_name'
					this.fetchCarrierTemplate()
				}
			},
			sortCreatedOn() {
				if(this.created_sort == 'asc') {
					this.created_sort = 'desc'
					this.sort = this.created_sort
					this.order = 'create_on'
					this.fetchCarrierTemplate()
				}
					
				else if(this.created_sort == 'desc') {
					this.created_sort = 'asc'
					this.sort = this.created_sort
					this.order = 'create_on'
					this.fetchCarrierTemplate()
				}
			},
			sortCreatedBy() {
				if(this.create_by_sort == 'asc') {
					this.create_by_sort = 'desc'
					this.sort = this.create_by_sort
					this.order = 'create_by'
					this.fetchCarrierTemplate()
				}
					
				else if(this.create_by_sort == 'desc') {
					this.create_by_sort = 'asc'
					this.sort = this.create_by_sort
					this.order = 'create_by'
					this.fetchCarrierTemplate()
				}
			},
			sortLastUpdated() {
				if(this.updated_sort == 'asc') {
					this.updated_sort = 'desc'
					this.sort = this.updated_sort
					this.order = 'update_on'
					this.fetchCarrierTemplate()
				}
					
				else if(this.updated_sort == 'desc') {
					this.updated_sort = 'asc'
					this.sort = this.updated_sort
					this.order = 'update_on'
					this.fetchCarrierTemplate()
				}
			},
			sortUsedBy() {
				if(this.used_by_sort == 'asc') {
					this.used_by_sort = 'desc'
					this.sort = this.used_by_sort
					this.order = 'used_by'
					this.fetchCarrierTemplate()
				}
					
				else if(this.used_by_sort == 'desc') {
					this.used_by_sort = 'asc'
					this.sort = this.used_by_sort
					this.order = 'used_by'
					this.fetchCarrierTemplate()
				}
			},
			
            getTemplateIndex (id) {
				return _.findIndex(this.templates, elem => elem.id === id)
			},
            deleteTemplate(id) {
                const url = api.getEndpointUrl() + '/v1/config/carrier_template/' + id
				this.$http.delete(url)
				.then(response => {
					if (response.body.success) {
						let index = this.getTemplateIndex(id)
						if (~index) {
							this.templates.splice(index, 1)
						}
						this.setMessage('Template was removed successfully')
					}
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
                this.$router.push('/template/carrier_template/edit/' + id)
			},
			getQueries() {
				const page = '?page=' + (this.pageOne.currentPage - 1)
				const per_page = '&per_page=' + this.pageOne.per_page
				const order = '&order_by=' + this.order + '&order_dir=' + this.sort
				return page + per_page + order
			},
            fetchCarrierTemplate () {
                const url = api.getEndpointUrl() + '/v1/config/carrier_template/list' + this.getQueries()
				this.$http.get(url)
				.then(response => {
					const body = response.body
					if (body.success) {
						this.templates = body.payload.items
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
					this.$nextTick(this.fetchCarrierTemplate)
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
            // this.fetchCarrierTemplate();
		},
		updated: function () {
			document.querySelector('.el-input > input').placeholder = 'Show/Hide Columns';
		},
	}
</script>

<style>
.table_column {
	cursor: pointer;
    font-family: "RobotoRegular";
    color: #222222;
    text-decoration: none;
}
</style>
