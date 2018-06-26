<template>
    <div class="container-fluid">
        <div class="row">
            <div class="wrapper single">
                <time-display></time-display>
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="#">Switch</a></li>
                    <li class="breadcrumb-item active">US Jurisdiction</li>
                </ol>
                <h1 class="page-header">US Jurisdiction</h1>
                <confirm v-show="showModal" @close="showModal = false" @submit="submit"></confirm>
                <tabs>
                    <tab label="List" class="" icon="dnl_icon dnl_list" selected>
                        <div class="btn-group" role="group">
                            <button type="button" class="btn btn-default inline_fixer" @click="createNew">
                                <span class="dnl_icon dnl_add"></span> Create New
                            </button>
                            <button type="button" class="btn btn-default" @click="deleteAll">
                                  <span class="dnl_icon dnl_action_delete"></span> Delete All
                              </button>
                            <button type="button" class="btn btn-default" @click="deleteSelected">
                                  <span class="dnl_icon dnl_action_delete"></span> Delete Selected
                            </button>
                        </div>
                        <div class="advanced_search_filter_panel bottom_0">
                            <div class="inline-block search_wrapper">
                                <label>Search:</label>
                                <br>
                                <input type="text" name="code" v-model="code" class="form-control inline-block search_field" placeholder="Enter Search">
                                <span class="dnl_icon dnl_musica-searcher"></span>
                            </div>
                        </div>
                        <div class="clearfix little-space"></div>
                        <div class="pull-right pagination top_pagination">
                            <pagination :current-page="pageOne.currentPage" :total-pages="pageOne.totalPages" @page-changed="pageOneChanged">
                            </pagination>
                        </div>
                        <div class="table_filters bottom_0">
                            <div class="inline-block select_min_wrapper">
                                <span class="inline-block">Page row:</span>
                                <select2 :options="options1" v-model="selected1" class="inline-block" @pagecount="changePageRow">
                                </select2>
                            </div>
                            <div class="inline-block">
                                <el-select v-model="us_table_columns" multiple placeholder="Show/Hide Columns" @change="handleChange">
                                    <el-option v-for="item in us_table_column_options" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="clearfix"></div>
                        <div class="table-responsive">
                            <table class="table table-striped table-hover agents">
                                <thead>
                                    <tr>
                                        <th class="width-65">
                                            <div class="checkbox checkbox-success">
                                                <input id="select_all" name="select_all" type="checkbox" v-model="checker" v-on:click="clickSelectedAll">
                                                <label for="select_all"></label>
                                            </div>
                                        </th>
                                        <th v-if="showcolumns[0]">Country<a @click="sortCountry"><span class="dnl_icon dnl_sort pull-right"></span></a></th>
                                        <th v-if="showcolumns[1]">State<a @click="sortState"><span class="dnl_icon dnl_sort pull-right"></span></a></th>
                                        <th v-if="showcolumns[2]">Prefix<a @click="sortPrefix"><span class="dnl_icon dnl_sort pull-right"></span></a></th>
                                        <th v-if="showcolumns[3]">OCN<a @click="sortOCN"><span class="dnl_icon dnl_sort pull-right"></span></a></th>
                                        <th v-if="showcolumns[4]">LATA<a @click="sortLATA"><span class="dnl_icon dnl_sort pull-right"></span></a></th>
                                        <!-- <th>Block Id</th>
                                        <th>Effective Date</th> -->
                                        <th v-if="showcolumns[5]" class="width_138">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-if="!filterBy(items, code).length">
                                        <td style="text-align: center" colspan="7">No Data Found</td>
                                    </tr>										
                                    
                                    <tr v-for="(item, index) in filterBy(items, code)">
                                        <td class="centred_checkbox">
                                            <div class="checkbox checkbox-success">
                                                <input v-bind:id="'selected-' + index" v-bind:name="'selected-' + index" type="checkbox" v-model="item.status">
                                                <label v-bind:for="'selected-' + index"></label>
                                            </div>
                                        </td>
                                        <td v-if="showcolumns[0]">
                                            <input type="text" v-model="item.country" class="form-control" v-if="item.is_creating || item.is_editing">
                                            {{!item.is_creating && !item.is_editing?item.country: ''}}
                                        </td>
                                        <td v-if="showcolumns[1]">
                                            <input type="text" v-model="item.state" class="form-control" v-if="item.is_creating || item.is_editing">
                                            {{!item.is_creating && !item.is_editing?item.state: ''}}
                                        </td>
                                        <td v-if="showcolumns[2]">
                                            <input v-if="item.is_creating || item.is_editing" type="text" name="prefix" v-model="item.prefix" class="form-control" :class="{'input': true, 'is-danger': errors.has('prefix') }" v-validate="'required|numeric'" placeholder="Enter Prefix">
                                            <span v-if="item.is_creating || item.is_editing" v-show="errors.has('prefix')" class="help is-danger">{{ errors.first('prefix') }}</span>
                                            {{!item.is_creating && !item.is_editing?item.prefix: ''}}
                                        </td>
                                        <td v-if="showcolumns[3]">
                                            <input type="text" v-model="item.ocn" class="form-control" v-if="item.is_creating || item.is_editing">
                                            {{!item.is_creating && !item.is_editing?item.ocn: ''}}
                                        </td>
                                        <td v-if="showcolumns[4]">
                                            <input type="text" v-model="item.lata" class="form-control" v-if="item.is_creating || item.is_editing">
                                            {{!item.is_creating && !item.is_editing?item.lata: ''}}
                                        </td>
                                        <!-- <td>
                                            <input type="text" v-model="item.block_id" class="form-control" placeholder="Enter Block Id">
                                        </td>
                                        <td>
                                            <input type="text" v-model="item.effective_date" class="form-control" placeholder="Enter Effective Date">
                                        </td> -->
                                        <td v-if="showcolumns[5]">
                                            <a class="action action_save" data-toggle="tooltip" data-placement="top" title="Save" v-if="item.is_creating || item.is_editing" @click="validateUSJuris(item)">
                                                <span class="dnl_icon dnl_save"></span>
                                            </a>
                                            <!-- <router-link to="" class="action action_edit" data-toggle="tooltip" data-placement="top" title="Edit" @click.native="edit_item(item.id);">
                                                <span class="dnl_icon dnl_action_edit"></span>
                                            </router-link> -->
                                            <a class="action action_edit" data-toggle="tooltip" data-placement="top" title="Edit" v-if="!item.is_creating && !item.is_editing" @click="editUSJuris(item)">
                                                <span class="dnl_icon dnl_action_edit"></span>
                                            </a>
                                            <a class="action action_delete" data-toggle="tooltip" data-placement="top" title="Delete" v-on:click="delete_item(item)">
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
                        <!--<div class="button_set"><a class="btn btn-primary mini">
        							Submit
        						</a> <a class="btn btn-default mini">
        							Reset
        						</a>
                            </div>-->
                        <div class="clearfix"></div>
                    </tab>
                    <tab label="Import" class="" icon="dnl_icon dnl_import">
                        <div class="row">
                            <div class="col-md-3 col-sm-4">
                                <label>Import File:</label>
                                <dropzone id="myVueDropzone" url="https://httpbin.org/post" v-on:vdropzone-success="success"></dropzone>
                            </div>
                            <div class="col-md-3 col-sm-4">
                                <label>Method:</label>
                                <div class="form-group">
                                    <div class="radio radio-success">
                                        <input id="radio-1" class="radio-custom" name="duplicates" type="radio" checked>
                                        <label for="radio-1" class="radio-custom-label">Ignore</label>
                                    </div>
                                </div>
                                <div class="form-group m-top-minus-25">
                                    <div class="radio radio-success">
                                        <input id="radio-2" class="radio-custom" name="duplicates" type="radio">
                                        <label for="radio-2" class="radio-custom-label">Delete</label>
                                    </div>
                                </div>
                                <div class="button_set little-space">
                                    <a class="btn btn-primary mini" @click="exportExampleCSV">
                                        Show Example
                                    </a>
                                </div>
                            </div>
                            <div class="clearfix"></div>
                        </div>
                        <div class="button_set">
                            <a class="btn btn-primary mini">
        							Upload
        						</a>
                        </div>
                    </tab>
                    <tab label="Export" class="" icon="dnl_icon dnl_export">
                        <div class="row">
                            <div class="col-md-3 col-sm-3">
                                <div class="form-group full-width-select">
                                    <label for="username">Data Format:</label>
                                    <select2 :options="data_format_options" v-model="data_format"></select2>
                                </div>
                                <div class="form-group m-top-33">
                                    <div class="checkbox checkbox-success">
                                        <input id="with_headers_row" name="with_headers_row" type="checkbox">
                                        <label for="with_headers_row">With headers row</label>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 col-sm-3">
                                <div class="form-group">
                                    <label>Header Text:</label>
                                    <textarea v-model="header_text" class="form-control" placeholder="Enter Header Text" />
                                </div>
                                <div class="form-group">
                                    <label>Footer Text:</label>
                                    <textarea v-model="footer_text" class="form-control" placeholder="Enter Footer Text" />
                                </div>
                            </div>
                            <div class="col-md-3 col-sm-3">
                                <div class="form-group full-width-select">
                                    <label for="username">Column #1:</label>
                                    <select class="selectable" v-model="column_1">
                                        <option v-for="item in column_options" v-bind:value="item.id">
                                            {{ item.text }}
                                        </option>
                                    </select>
                                </div>
                                <div class="form-group full-width-select">
                                    <label for="username">Column #2:</label>
                                    <select class="selectable" v-model="column_2">
                                        <option v-for="item in column_options" v-bind:value="item.id">
                                            {{ item.text }}
                                        </option>
                                    </select>
                                </div>
                                <div class="form-group full-width-select">
                                    <label for="username">Column #3:</label>
                                    <select class="selectable" v-model="column_3">
                                        <option v-for="item in column_options" v-bind:value="item.id">
                                            {{ item.text }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-3 col-sm-3">
                                <div class="form-group full-width-select">
                                    <label for="username">Column #4:</label>
                                    <select class="selectable" v-model="column_4">
                                        <option v-for="item in column_options" v-bind:value="item.id">
                                            {{ item.text }}
                                        </option>
                                    </select>
                                </div>
                                <div class="form-group full-width-select">
                                    <label for="username">Column #5:</label>
                                    <select class="selectable" v-model="column_5">
                                        <option v-for="item in column_options" v-bind:value="item.id">
                                            {{ item.text }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="button_set center-block text-center">
                            <a class="btn btn-primary mini" v-on:click="exportCSV()">
        							Download
        					</a>
                        </div>
                    </tab>
                </tabs>
            </div>
        </div>
    </div>
</template>

<script>
    const vSelect = require('vue!../main_components/select.vue'),
        Pagination = require('vue!../main_components/pagination.vue'),
        vTabs = require('vue!../main_components/tabs.vue'),
        vTab = require('vue!../main_components/tab.vue'),
        confirmmodal = require('vue!../main_components/confirm_delete.vue'),
        Dropzone = require('vue!../main_components/dropzone.vue');
    const api = require("../../api");
    const auth = require("../../auth");
    import {
        mapActions
    } from 'vuex'
    import _ from 'lodash'
    
    module.exports = {
        components: {
            'select2': vSelect,
            'pagination': Pagination,
            'tabs': vTabs,
            'tab': vTab,
            'confirm': confirmmodal,
            Dropzone
        },
        data: function() {
            return {
                country_sort: 'asc',
                state_sort: 'asc',
                prefix_sort: 'asc',
                ocn_sort: 'asc',
                lata_sort: 'asc',
                order: 'id',
                sort: 'desc',
                
				us_table_column_options: [{
					value: 'Country',
					label: 'Country'
				}, {
					value: 'State',
					label: 'State'
				}, {
					value: 'Prefix',
					label: 'Prefix'
				}, {
					value: 'OCN',
					label: 'OCN'
				}, {
					value: 'LATA',
					label: 'LATA'
				}, {
					value: 'Action',
					label: 'Action'
				}],
				us_table_columns: ['Country', 'State', 'Prefix',
					'OCN', 'LATA', 'Action'
				],
				showcolumns: [true, true, true, true, true, true],
                
                column_options: [
                    {id: 'country', text: 'country'},
                    {id: 'state', text: 'state'},
                    {id: 'prefix', text: 'prefix'},
                    {id: 'ocn', text: 'ocn'},
                    {id: 'lata', text: 'lata'},
                ],
                data_format_options: [
                    {id: 'csv', text: 'CSV'},
                    {id: 'xls', text: 'XLS'},
                ],
                code: '',
                checker: '',
                showModal: '',
                start_date: '',
                end_date: '',
                ftp_config_name: '',
                data_format: 'csv',
                header_text: '',
                footer_text: '',
                column_1: '',
                column_2: '',
                column_3: '',
                column_4: '',
                column_5: '',
                pageOne: {
                    currentPage: 1,
                    totalPages: 10,
                    cntpage: 10,
                    total_cnt: 0,
                },
                selected1: 1,
                options1: [{
                        id: 1,
                        text: '10'
                    },
                    {
                        id: 2,
                        text: '20'
                    },
                    {
                        id: 3,
                        text: '30'
                    },
                    {
                        id: 4,
                        text: '50'
                    },
                    {
                        id: 5,
                        text: '100'
                    }
                ],
                selected2: '',
                options2: [{
                        id: 1,
                        text: 'Alias'
                    },
                    {
                        id: 2,
                        text: 'Active'
                    },
                    {
                        id: 3,
                        text: 'Actions'
                    }
                ],
                file_breakdown: 2,
                file_options: [{
                        id: 1,
                        text: 'As one big file'
                    },
                    {
                        id: 2,
                        text: 'As hourly file'
                    },
                    {
                        id: 3,
                        text: 'As daily file'
                    },
                ],
                time_zone: 12,
                time_zone_options: [{
                        id: 1,
                        text: 'GMT -12:00'
                    },
                    {
                        id: 2,
                        text: 'GMT -11:00'
                    },
                    {
                        id: 3,
                        text: 'GMT -10:00'
                    },
                    {
                        id: 4,
                        text: 'GMT -9:00'
                    },
                    {
                        id: 5,
                        text: 'GMT -8:00'
                    },
                    {
                        id: 6,
                        text: 'GMT -7:00'
                    },
                    {
                        id: 7,
                        text: 'GMT -6:00'
                    },
                    {
                        id: 8,
                        text: 'GMT -5:00'
                    },
                    {
                        id: 9,
                        text: 'GMT -4:00'
                    },
                    {
                        id: 10,
                        text: 'GMT -3:00'
                    },
                    {
                        id: 11,
                        text: 'GMT -2:00'
                    },
                    {
                        id: 12,
                        text: 'GMT -1:00'
                    },
                    {
                        id: 13,
                        text: 'GMT +0:00'
                    },
                    {
                        id: 14,
                        text: 'GMT +1:00'
                    },
                    {
                        id: 15,
                        text: 'GMT +2:00'
                    },
                    {
                        id: 16,
                        text: 'GMT +3:00'
                    },
                    {
                        id: 17,
                        text: 'GMT +4:00'
                    },
                    {
                        id: 18,
                        text: 'GMT +5:00'
                    },
                    {
                        id: 19,
                        text: 'GMT +6:00'
                    },
                    {
                        id: 20,
                        text: 'GMT +7:00'
                    },
                    {
                        id: 21,
                        text: 'GMT +8:00'
                    },
                    {
                        id: 22,
                        text: 'GMT +9:00'
                    },
                    {
                        id: 23,
                        text: 'GMT +10:00'
                    },
                    {
                        id: 24,
                        text: 'GMT +11:00'
                    },
                    {
                        id: 25,
                        text: 'GMT +12:00'
                    },
                ],
                items: [],
                selected_ids: [],
            }
        },
        methods: {
            ...mapActions({
                setMessage: 'app_message/setAppMessage'
            }),
            sortCountry() {
                if(this.country_sort == 'asc') {
					this.country_sort = 'desc'
					this.sort = this.country_sort
					this.order = 'country'
					this.fetchPrefixes()
				}
					
				else if(this.country_sort == 'desc') {
					this.country_sort = 'asc'
					this.sort = this.country_sort
					this.order = 'country'
					this.fetchPrefixes()
				}
            },
            sortState() {
                if(this.state_sort == 'asc') {
					this.state_sort = 'desc'
					this.sort = this.state_sort
					this.order = 'state'
					this.fetchPrefixes()
				}
					
				else if(this.state_sort == 'desc') {
					this.state_sort = 'asc'
					this.sort = this.state_sort
					this.order = 'state'
					this.fetchPrefixes()
				}
            },
            sortPrefix() {
                if(this.prefix_sort == 'asc') {
					this.prefix_sort = 'desc'
					this.sort = this.prefix_sort
					this.order = 'prefix'
					this.fetchPrefixes()
				}
					
				else if(this.prefix_sort == 'desc') {
					this.prefix_sort = 'asc'
					this.sort = this.prefix_sort
					this.order = 'prefix'
					this.fetchPrefixes()
				}
            },
            sortOCN() {
                if(this.ocn_sort == 'asc') {
					this.ocn_sort = 'desc'
					this.sort = this.ocn_sort
					this.order = 'ocn'
					this.fetchPrefixes()
				}
					
				else if(this.ocn_sort == 'desc') {
					this.ocn_sort = 'asc'
					this.sort = this.ocn_sort
					this.order = 'ocn'
					this.fetchPrefixes()
				}
            },
            sortLATA(){
                if(this.lata_sort == 'asc') {
					this.lata_sort = 'desc'
					this.sort = this.lata_sort
					this.order = 'lata'
					this.fetchPrefixes()
				}
					
				else if(this.lata_sort == 'desc') {
					this.lata_sort = 'asc'
					this.sort = this.lata_sort
					this.order = 'lata'
					this.fetchPrefixes()
				}
            },
            changePageRow (value) {
				console.log(value);
				if (value !== this.pageOne.cntpage) {
					this.pageOne.cntpage = value
					this.$nextTick(this.fetchPrefixes)
				}
			},
            editUSJuris(item) {
                Vue.set(item, 'is_editing', true);
            },
            saveUSJuris(item) {
				// eslint-disable-next-line
                    this.loading = true;
                    const reqBody = {
                        prefix: item.prefix,
                        state: item.state,
                        lata: item.lata,
                        ocn: item.ocn,
                        country: item.country,

                    }
                    if(item.is_editing) {
                        this.$http.patch(api.getEndpointUrl() + '/v1/config/us_jurisdictionprefix/' + item.id, reqBody)
                        .then(response => {
                            if (response.body.success) {
                                this.setMessage('The US Jurisdiction has been changed!');
                                item.is_editing = false;
                            }
                            this.loading = false;
                        })
                        .catch(error => {
                            this.loading = false;
                            console.log(error)
                            this.setMessage({
                                message: 'Failed to change US Jurisdiction',
                                type: 'error'
                            })
                        })	
                    }
                    else if(item.is_creating) {
                        this.$http.post(api.getEndpointUrl() + '/v1/config/us_jurisdictionprefix/create', reqBody)
                        .then(response => {
                            if (response.body.success) {
                                this.setMessage('The US Jurisdiction has been created!');
                                this.items[0].id = response.body.object_id;
                                if(this.items.length > this.pageOne.cntpage)
                                    this.items.splice(this.pageOne.cntpage, 1);
                                this.pageOne.total_cnt ++;
                                this.pageOne.totalPages = Math.ceil(this.pageOne.total_cnt / this.pageOne.cntpage);
                                item.is_creating = false;
                            }
                            this.loading = false;
                        })
                        .catch(error => {
                            this.loading = false;
                            console.log(error)
                            this.setMessage({
                                message: 'Failed to create US Jurisdiction',
                                type: 'error'
                            })
                        })	
                    }
					
			},
            validateUSJuris(item) {
                var vm = this;
				this.$validator.validateAll().then(() => {
					const err = this.$validator.getErrors();
					if (err.errors.length > 0) {
						const msg = err.errors[0].field + ' field can not leave as null';
						vm.setMessage({
							message: msg,
							type: 'error'
						})
					}
					else {
						vm.saveUSJuris(item);
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
            edit_item: function(id) {
                this.$router.push({
                    path: "/switch/us_jurisdiction/edit/" + id
                });
            },
            deleteSelected: function() {
                this.selected_ids = [];
                var vm = this;
                console.log(this.items);
                this.items.forEach(function(item, i) {
                    if (item.status == true) {
                        vm.selected_ids.push(item.id);
                    }
                });
                if (this.selected_ids.length == 0) {
                    this.setMessage({
                        message: 'The Jurisdiction list has been not selected!',
                        type: 'error'
                    });
                    this.checker = false;
                    return;
                }
                this.showModal = true;
                if (this.checker)
                    this.checker = false;
            },
            delete_item(item) {
                if(item.is_creating)
                    this.items.splice(0, 1);
                else {
                    this.showModal = true;
                    this.selected_ids = [];
                    this.selected_ids.push(item.id);
                }
            },
            submit: function() {
                var vm = this;
                this.showModal = false;
                this.selected_ids.forEach(function(item, i) {
                    var id = item;
                    if (id == 0) {
                        vm.setMessage({
                            message: 'The Jurisdiction list has been not selected!',
                            type: 'error'
                        });
                    } else {
                        vm.loading = true;
                        vm.resource = vm.$resource(api.getEndpointUrl() + '/v1/config/us_jurisdictionprefix/' + id);
                        vm.resource.delete({
                            id: id
                        }).then(function(response) {
                            vm.loading = false;
                            let index = _.findIndex(vm.items, elem => elem.id === id)
                            vm.items.splice(index, 1)
                            vm.pageOne.total_cnt --;
                            vm.pageOne.totalPages = Math.ceil(vm.pageOne.total_cnt / vm.pageOne.cntpage);
                            if(vm.pageOne.total_cnt > 0 && vm.pageOne.total_cnt % vm.pageOne.cntpage == 0) {
                                vm.pageOne.currentPage --;
                                vm.$nextTick(this.fetchPrefixes)
                            }
                            vm.setMessage('The Jurisdiction list has been deleted!');
                        });
                    }
                });
            },
            createNew() {
				if(this.items.length > 0 && this.items[0].is_creating)
                    return;
				this.items.splice(0, 0, {
					country: '',
					state: '',
					prefix: '',
					ocn: '',
					lata: '',
					is_creating: true,
					is_editing: false,
				})
			},
            deleteAll: function() {
                console.log("delete all US Jurisdiction list");
                this.selected_ids = [];
                var vm = this;
                this.items.forEach(function(item, i) {
                    vm.selected_ids.push(item.id)
                });
                console.log(vm.selected_ids);
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
            clickSelectedAll: function() {
                console.log("select_all-->"+this.checker);
                var vm = this;
                if(this.checker) {
                    this.items.forEach(function(item, i){
                        item.status = true;
                    });
                }
                else {
                    this.items.forEach(function(item, i){
                        item.status = false;
                    });
                }
            },
			handleChange() {
				if (_.indexOf(this.us_table_columns, 'Country') != -1) {
					Vue.set(this.showcolumns, 0, true);
				} else {
					Vue.set(this.showcolumns, 0, false);
				}
				if (_.indexOf(this.us_table_columns, 'State') != -1) {
					Vue.set(this.showcolumns, 1, true);
				} else {
					Vue.set(this.showcolumns, 1, false);
				}
				if (_.indexOf(this.us_table_columns, 'Prefix') != -1) {
					Vue.set(this.showcolumns, 2, true);
				} else {
					Vue.set(this.showcolumns, 2, false);
				}
				if (_.indexOf(this.us_table_columns, 'OCN') != -1) {
					Vue.set(this.showcolumns, 3, true);
				} else {
					Vue.set(this.showcolumns, 3, false);
				}
				if (_.indexOf(this.us_table_columns, 'LATA') != -1) {
					Vue.set(this.showcolumns, 4, true);
				} else {
					Vue.set(this.showcolumns, 4, false);
				}
				if (_.indexOf(this.us_table_columns, 'Action') != -1) {
					Vue.set(this.showcolumns, 5, true);
				} else {
					Vue.set(this.showcolumns, 5, false);
				}
			},
            
            pageOneChanged(pageNum) {
                if (pageNum !== this.pageOne.currentPage) {
                    this.pageOne.currentPage = pageNum
                    this.$nextTick(this.fetchPrefixes)
                }
            },
            'success': function(file) {
                console.log('A file was successfully uploaded')
            },
            'process': function() {
                var newArr = this.$children.filter(function(item) {
                    return item.id === "myVueDropzone";
                });
                var component = newArr[0];
                component.processQueue()
            },
            fetchPrefixes() {
                var page = this.pageOne.currentPage - 1;
                var per_page = this.pageOne.cntpage;
                this.$http.get(api.getEndpointUrl() + "/v1/config/us_jurisdictionprefix/list?page=" + page + "&per_page=" + per_page + "&order_by="+this.order+"&order_dir="+this.sort, {
                    headers: {
                        "X-Auth-Token": auth.getToken()
                    }
                }).then(function(response) {
                    this.loading = false;
                    //todo: check success flag? validation errors?
                    var items = response.body.payload.items;
                    console.log("items");
                    console.log(items);
                    this.items = items;
                    this.pageOne.total_cnt = response.body.payload.total;
                    this.pageOne.currentPage = response.body.payload.page + 1;
                    this.pageOne.totalPages = Math.ceil(response.body.payload.total / per_page);
                }, function(error) {
                    this.loading = false;
                    console.log(error);
                });
            },
            exportExampleCSV () {
                var vm = this;		
                var csvContent = "data:text/csv;charset=utf-8,"; 
                var csvArray = new Array();
                // var fields = ["id", "country", "state", "prefix", "ocn", "lata", "block_id", "effective_date"];
                var fields = ["country", "state", "prefix", "ocn", "lata"];
                csvArray.push(fields);
                var values = new Array();

                values.push("us ");
                values.push("cn ");
                values.push("1209768 ");
                values.push("333 ");
                values.push("666 ");    
                csvArray.push(values);                                                         
                exportToCsv('jurisdiction.csv', csvArray);     
            },
            exportCSV: function () {                
                var vm = this;		
                var csvContent = "data:text/csv;charset=utf-8,"; 
                var csvArray = new Array();
                  if (this.header_text !== '') {
                    var headerWords = this.header_text.split(' ');
                    csvArray.push(headerWords);

                }
                var temp_fields = [this.column_1, this.column_2, this.column_3, this.column_4, this.column_5];
                var final_fields = [];
                var options = this.column_options;
                var final_options = [];

                options.forEach(function (item, index) {
                    final_options.push(item.text)
                })

                temp_fields.forEach(function(item, index) {
                    if (item !== '') {
                        final_fields.push(final_options[item]);
                    }
                });
                 csvArray.push(final_fields);
                var values = new Array();
                this.items.forEach(function (item, i) {
                    var values = new Array();

                    if (_.indexOf(final_fields, 'country') != -1) {
                        values.push(item.country + "");
                    }
                    if (_.indexOf(final_fields, 'state') != -1) {
                        values.push(item.state + "");
                    }
                    if (_.indexOf(final_fields, 'prefix') != -1) {
                        values.push(item.prefix + "");
                    }
                    if (_.indexOf(final_fields, 'ocn') != -1) {
                        values.push(item.ocn + "");
                    }
                    if (_.indexOf(final_fields, 'lata') != -1) {
                        values.push(item.lata + "");
                    }

                    csvArray.push(values);                                                         
                });
                if (this.footer_text !== '') {
                    var footerText = this.footer_text.split(' ');
                    csvArray.push(footerText)
                }
                exportToCsv('switch_us_jurisdiction_export.csv', csvArray);                                                        
            }, 
        },
        mounted: function() {
            $('[data-toggle="tooltip"]').tooltip();
        },
        created: function() {
            this.fetchPrefixes();
        },
		updated: function() {
			document.querySelector('.el-input > input').placeholder = 'Show/Hide Columns';
		},
    }
</script>

<style>
    .tab span.dnl_icon.dnl_import {
        font-size: 20px;
        float: left;
        margin-right: 6px;
    }
	.el-select__tags {
		display: none;
	}
    .tab span.dnl_icon.dnl_export {
        font-size: 24px;
        float: left;
        margin-right: 6px;
    }
</style>
