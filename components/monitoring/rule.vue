<template>
    <div class="container-fluid">
        <div class="row">
            <div class="wrapper single">
                <time-display></time-display>
                <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                        <a href="#">Monitoring</a>
                    </li>
                    <li class="breadcrumb-item active">Rule</li>
                </ol>
                <h1 class="page-header">Rule</h1>
                <confirm v-show="showModal" @close="showModal = false" @submit="submit"></confirm>
                <tabs @activateTab="activateTab">
                    <tab label="Rule" class="" icon="dnl_icon dnl_megaphone" :selected="activeTab == 0">
                        <div class="btn-group" role="group">
                            <button type="button" class="btn btn-default" @click="createNew">
                                <span class="dnl_icon dnl_add"></span> Create New
                            </button>
                            <button type="button" class="btn btn-default" v-on:click="deleteAll">
                                <span class="dnl_icon dnl_action_delete"></span> Delete All
                            </button>
                            <button type="button" class="btn btn-default" v-on:click="deleteSelected">
                                <span class="dnl_icon dnl_action_delete"></span> Delete Selected
                            </button>
                        </div>
                        <div class="table_filters bottom_0">
                            <div class="inline-block select_min_wrapper">
                                <span class="inline-block">Page row:</span>
                                <select2 :options="options1" v-model="selected1" class="inline-block" @pagecount="changePageCount">
                                </select2>
                            </div>
                            <div class="inline-block">
                                <!--<select2 :options="options2" v-model="selected2">
                                    <option disabled value="0">Show/Hide Columns</option>
                                </select2>-->
                                <el-select v-model="rule_table_columns" multiple placeholder="Show/Hide Columns" @change="handleChange">
                                    <el-option v-for="item in rule_table_column_options" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="clearfix"></div>
                        <div class="table-responsive">
                            <table class="table table-striped table-hover aliases" >
                                <thead>
                                    <tr>
                                        <th class="width-65">
                                            <div class="checkbox checkbox-success">
                                                <input id="select_all" name="select_all" type="checkbox" v-model="checker" v-on:click="clickSelectedAll">
                                                <label for="select_all"></label>
                                            </div>
                                        </th>
                                        <th v-if="showcolumns[0]" @click="sortColumn('name')">Rule Name
                                            <!--<span class="dnl_icon dnl_sort pull-right"></span>-->
                                        </th>
                                        <th v-if="showcolumns[1]" @click="sortColumn('run_every')">Frequency
                                            <!--<span class="dnl_icon dnl_sort pull-right"></span>-->
                                        </th>
                                        <th v-if="showcolumns[2]" @click="sortColumn('last_run_time')">Last Run Time
                                            <!--<span class="dnl_icon dnl_sort pull-right"></span>-->
                                        </th>
                                        <th v-if="showcolumns[3]" @click="sortColumn('next_run_time')">Next Run Time
                                            <!--<span class="dnl_icon dnl_sort pull-right"></span>-->
                                        </th>
                                        <th v-if="showcolumns[4]" @click="sortColumn('update_by')">Updated By
                                            <!--<span class="dnl_icon dnl_sort pull-right"></span>-->
                                        </th>
                                        <th v-if="showcolumns[5]" @click="sortColumn('update_at')">Updated At
                                            <!--<span class="dnl_icon dnl_sort pull-right"></span>-->
                                        </th>
                                        <th v-if="showcolumns[6]" class="width_138">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-if="!rules.length">
                                        <td style="text-align: center" colspan="8">No Data Found</td>
                                    </tr>										
                                    
                                    <tr v-for="rule in rules">
                                        <td class="centred_checkbox">
                                            <div class="checkbox checkbox-success">
                                                <input v-bind:id="'selected-' + index" v-bind:name="'selected-' + index" type="checkbox" v-model="rule.selected">
                                                <label v-bind:for="'selected-' + index"></label>
                                            </div>
                                        </td>
                                        <td v-if="showcolumns[0]">
                                            <a v-on:click="editRule(rule.id)" class="blue_link">
                                                {{rule.name}}
                                            </a>
                                        </td>
                                        <td v-if="showcolumns[1]">{{rule.run_every}}</td>
                                        <td v-if="showcolumns[2]">{{rule.last_run_time}}</td>
                                        <td v-if="showcolumns[3]">{{rule.next_run_time}}</td>
                                        <td v-if="showcolumns[4]">{{rule.update_by}}</td>
                                        <td v-if="showcolumns[5]">{{rule.update_at}}</td>
                                        <td v-if="showcolumns[6]">
                                            <a class="action action_edit" data-toggle="tooltip" data-placement="top" title="Edit" v-on:click="editRule(rule.id)">
                                                <span class="dnl_icon dnl_action_edit"></span>
                                            </a>
                                            <a class="action action_activate" data-toggle="tooltip" data-placement="top" title="Deactivate" v-on:click="deactiveRule(rule.id)">
                                                <span class="dnl_icon dnl_check"></span>
                                            </a>
                                            <a class="action action_delete" data-toggle="tooltip" data-placement="top" title="Delete" v-on:click="deleteRule(rule.id)">
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
                    </tab>
                    <tab label="Alert Rules Log" class="" icon="dnl_icon dnl_qos_report" :selected="activeTab == 1">
                        <div class="advanced_search_filter_panel">
                            <div class="col-md-3 col-sm-4">
                                <label>Rule Name:</label>
                                <input type="text" name="search" v-model="search" class="form-control" placeholder="Enter Search">
                            </div>
                            <div class="col-md-4 col-sm-8">
                                <div class="inlined">
                                    <label for="start_date">Start Time:</label>
                                    <el-date-picker style="width: 100%;" type="datetime" v-model="start_date" :picker-options="{}" placeholder="Enter Date and TIme"></el-date-picker>
                                </div>
                                <div class="inlined">
                                    <label for="end-date">End Time:</label>
                                    <el-date-picker style="width: 100%;" type="datetime" v-model="end_date" :picker-options="{}" placeholder="Enter Date and TIme"></el-date-picker>
                                </div>
                            </div>
                            <div class="col-md-3 col-sm-3">
                                <a class="btn btn-primary m-top-25">
                                    Query
                                </a>
                            </div>
                            <div class="clearfix"></div>
                        </div>
                        <div class="table_filters bottom_0">
                            <div class="inline-block select_min_wrapper">
                                <span class="inline-block">Page row:</span>
                                <select2 :options="options1" v-model="selected2" class="inline-block">
                                </select2>
                            </div>
                            <div class="inline-block fix_medium_select">
                                <!--<select2 :options="options2" v-model="selected2">
                                    <option disabled value="0">Show/Hide Columns</option>
                                </select2>-->
                                <el-select v-model="log_table_columns" multiple placeholder="Show/Hide Columns" @change="handleChange2">
                                    <el-option v-for="item in log_table_column_options" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-striped table-hover carrier_groups centrum">
                                <thead>
                                    <tr>
                                        <th v-if="showcolumns2[0]" @click="sortColumnLog('rule_name')">Rule Name
                                            <span class="dnl_icon dnl_sort pull-right"></span>
                                        </th>
                                        <th v-if="showcolumns2[1]" @click="sortColumnLog('start_time')">Start Time
                                            <span class="dnl_icon dnl_sort pull-right"></span>
                                        </th>
                                        <th v-if="showcolumns2[2]" @click="sortColumnLog('finish_time')">Finish Time
                                            <span class="dnl_icon dnl_sort pull-right"></span>
                                        </th>
                                        <th v-if="showcolumns2[3]" @click="sortColumnLog('status')">Status
                                            <span class="dnl_icon dnl_sort pull-right"></span>
                                        </th>
                                        <th v-if="showcolumns2[4]" class="width-65">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="log in filterBy(ex_logs, search)">
                                        <td v-if="showcolumns2[0]">{{log.rule_name}}</td>
                                        <td v-if="showcolumns2[1]">{{log.start_time}}</td>
                                        <td v-if="showcolumns2[2]">{{log.finish_time}}</td>
                                        <td v-if="showcolumns2[3]">{{log.status}}</td>
                                        <td v-if="showcolumns2[4]">
                                            <router-link to="/monitoring/rule/details" class="action action_read" data-toggle="tooltip" data-placement="top" title="View Details">
                                                <span class="dnl_icon dnl_eye"></span>
                                            </router-link>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="pull-right pagination">
                            <pagination :current-page="pageOne2.currentPage" :total-pages="pageOne2.totalPages" @page-changed="pageOneChanged2">
                            </pagination>
                        </div>
                        <div class="clearfix"></div>
                    </tab>
                </tabs>
            </div>
        </div>
    </div>
</template>

<script>   
const vTabs = require('vue!../main_components/tabs.vue'),
    vTab = require('vue!../main_components/tab.vue'),
    vSelect = require('vue!../main_components/select.vue'),
    Pagination = require('vue!../main_components/pagination.vue'),
	modal = require('vue!../main_components/modal.vue'),
	confirmmodal = require('vue!../main_components/confirm_delete.vue'),
	api = require("../../api"),
	auth = require("../../auth");
_ = require('lodash');    
import {mapGetters,	mapActions} from 'vuex'

module.exports = {
	created: function () {
        if(this.activeIndex == 1)
            this.activeTab = this.activeIndex;
        this.fetchRules();
        this.fetchLog();
	},
    components: {
        'tabs': vTabs,
        'tab': vTab,
        'select2': vSelect,
        'pagination': Pagination,
		'modal': modal,
		'confirm': confirmmodal,
    },
    props: ['activeIndex'],
    data: function () {
        return {
            activeTab: 0,
            ex_logs: [
                {
                    rule_name: 'Sourav Test',
                    start_time: '2016-11-20 17:31:14+00',
                    finish_time: '2016-11-20 17:31:14+00',
                    status: 'succeed'
                },
                {
                    rule_name: 'Sourav Test',
                    start_time: '2016-11-20 17:31:14+00',
                    finish_time: '2016-11-20 17:31:14+00',
                    status: 'succeed'
                },
                {
                    rule_name: 'Sourav Test',
                    start_time: '2016-11-20 17:31:14+00',
                    finish_time: '2016-11-20 17:31:14+00',
                    status: 'succeed'
                },
                {
                    rule_name: 'Sourav Test',
                    start_time: '2016-11-20 17:31:14+00',
                    finish_time: '2016-11-20 17:31:14+00',
                    status: 'succeed'
                },
                {
                    rule_name: 'Sourav Test',
                    start_time: '2016-11-20 17:31:14+00',
                    finish_time: '2016-11-20 17:31:14+00',
                    status: 'succeed'
                }
            ],

            apiUrl1: '/v1/monitoring/rule/list',
			showModal: false,

			selected_ids: [],

            order: 'id',
            sort: 'desc',
            nameSort: 'asc',
            orderLog: '',
            sortLog: '',
            nameSortLog: 'asc',

            pageOne: {
				currentPage: 1,
				totalPages: 10,
				cntpage: 10
            },
            pageOne2: {
				currentPage: 1,
				totalPages: 10,
				cntpage: 10
            },
            search: '',
            start_date: '',
            end_date: '',
            selected1: 1,
            options1: [
                { id: 1, text: '10' },
                { id: 2, text: '20' },
                { id: 3, text: '30' },
                { id: 4, text: '50' },
                { id: 5, text: '100' }
            ],
            selected2: 1,
            options2: [
                { id: 1, text: 'Alias' },
                { id: 2, text: 'Active' },
                { id: 3, text: 'Actions' }
            ],

            checker: '',

            rules: [],
			rule_table_column_options: [{
				value: 'Rule Name',
				label: 'Rule Name'
			}, {
				value: 'Frequency',
				label: 'Frequency'
			}, {
				value: 'Last Run Time',
				label: 'Last Run Time'
			}, {
				value: 'Next Run Time',
				label: 'Next Run Time'
			}, {
				value: 'Updated By',
				label: 'Updated By'
			}, {
				value: 'Updated At',
				label: 'Updated At'
			}, {
				value: 'Action',
				label: 'Action'
			}],
			rule_table_columns: ['Rule Name', 'Frequency', 'Last Run Time',
				'Next Run Time', 'Updated By', 'Updated At', 'Action'],
            showcolumns: [true, true, true, true, true, true, true],
            log_table_column_options: [{
				value: 'Rule Name',
				label: 'Rule Name'
			}, {
				value: 'Start Time',
				label: 'Start Time'
			}, {
				value: 'Finish Time',
				label: 'Finish Time'
			}, {
				value: 'Status',
				label: 'Status'
			}, {
				value: 'Action',
				label: 'Action'
			}],
			log_table_columns: ['Rule Name', 'Start Time', 'Finish Time',
				'Status', 'Action'],
            showcolumns2: [true, true, true, true, true],
        }
    },
    methods: {
        ...mapActions({
            setAsyncConfirm: 'async_confirm/setAsyncConfirm',
            setMessage: 'app_message/setAppMessage'
        }),
        activateTab (tab, index) {
			if (this.activeTab === index) { return }
            this.activeTab = index
        },
        sortColumn(column) {
            if(this.nameSort == 'asc') {
                this.nameSort = 'desc'
                this.sort = this.nameSort
                this.order = column
                this.fetchRules()
            }

            else if(this.nameSort == 'desc') {
                this.nameSort = 'asc'
                this.sort = this.nameSort
                this.order = column
                this.fetchRules()
            }
        },
        sortColumnLog(column) {
            if(this.nameSortLog == 'asc') {
                this.nameSortLog = 'desc'
                this.sortLog = this.nameSortLog
                this.orderLog = column
                // Call fetch log function when it's finished
                this.fetchLog();
            }

            else if(this.nameSortLog == 'desc') {
                this.nameSortLog = 'asc'
                this.sortLog = this.nameSortLog
                this.orderLog = column
                // Call fetch log function when it's finished
                this.fetchLog();
            }
        },
        getQueries() {
            const page = '?page=' + (this.pageOne.currentPage - 1)
            const per_page = '&per_page=' + this.pageOne.cntpage
            const order = '&order_by=' + this.order + '&order_dir=' + this.sort
            return page + per_page + order
        },
        getQueries2() {
            const page = '?page=' + (this.pageOne2.currentPage - 1)
            const per_page = '&per_page=' + this.pageOne2.cntpage
            const order = '&order_by=' + this.orderLog + '&order_dir=' + this.sortLog
            return page + per_page + order
        },
        fetchLog() {
            // Using getQueries2 ...
        },
        fetchRules() {
            var page = this.pageOne.currentPage - 1;
            var per_page = this.pageOne.cntpage;
            this.loading = true;

            this.$http.get(api.getEndpointUrl() + this.apiUrl1 + this.getQueries(),
                {
                    headers: {
                        "X-Auth-Token": auth.getToken()
                    }
                }).then(function (response) {
                    this.loading = false;
                    //todo: check success flag? validation errors?
                    var rules = response.body.payload.items;
                    console.log(rules);
                    this.rules = rules;
                    var total_page = response.body.payload.total;
                    this.pageOne.currentPage = response.body.payload.page + 1;
                    this.pageOne.totalPages = Math.ceil(response.body.payload.total / per_page);
                }, function (error) {
                    this.loading = false;
                    console.log(error);
                });
        },
		clickSelectedAll: function () {
			if (this.checker) {
				this.rules.forEach(function (rule, i) {
					rule.selected = true;
				});
			}
			else {
				this.rules.forEach(function (rule, i) {
					rule.selected = false;
				});
			}
		},
		closeModal: function () {
			this.showModal = '';
		},
		submit: function () {
			var vm = this;
			this.showModal = false;

			this.selected_ids.forEach(function (item, i) {
				var ruleid = item;
				if (ruleid == 0) {
					vm.message('alert-warning', 'The rule has been not selected!');
				}
				else {
					vm.loading = true;
					vm.resource = vm.$resource(api.getEndpointUrl() + '/v1/monitoring/rule/' + ruleid);
					vm.resource.delete({ id: ruleid }).then(function (response) {
						vm.loading = false;
						let index = _.findIndex(vm.rules, elem => elem.id  === ruleid)
						vm.rules.splice(index, 1)
						vm.setMessage('The rules have been deleted!')
					});
				}
			});
		},
        deactiveRule: function (id) {
			// this.$router.push({ path: "/monitoring/rule/edit/" + id });
        },
		editRule: function (id) {
			this.$router.push({ path: "/monitoring/rule/edit/" + id });
		},
		deleteRule: function (id) {
			this.showModal = true;
			this.selected_ids = [];
			this.selected_ids.push(id);
		},
        createNew: function() {
            this.$router.push({path:"/monitoring/rule/new"});
        },
		deleteAll: function () {
			this.selected_ids = [];
			var vm = this;

			this.rules.forEach(function (rule, i) {
				vm.selected_ids.push(rule.id)
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
		deleteSelected: function () {
			this.selected_ids = [];
			var vm = this;
			this.rules.forEach(function (rule, i) {
				if (rule.selected == true) {
					vm.selected_ids.push(rule.route_plan_id);
				}
			});

			if (this.selected_ids.length == 0) {
				this.setMessage({
                    message: 'The rule has been not selected!',
                    type: 'error'
                });
				this.checker = false;

				return;
			}

			this.showModal = true;
			if (this.checker)
				this.checker = false;
		},
        pageOneChanged(pageNum) {
            if (pageNum !== this.pageOne.currentPage) {
                this.pageOne.currentPage = pageNum
                this.$nextTick(this.fetchRules)
            }
        },
        pageOneChanged2(pageNum) {
            if (pageNum !== this.pageOne2.currentPage) {
                this.pageOne2.currentPage = pageNum
                this.$nextTick(this.fetchLog)
            }
        },
        changePageCount (countPerPage) {
            if (countPerPage !== this.pageOne.cntpage) {
                this.pageOne.cntpage = countPerPage
                this.$nextTick(this.fetchRules)
            }
        },
        handleChange2() {
			if (_.indexOf(this.log_table_columns, 'Rule Name') != -1) {
				Vue.set(this.showcolumns2, 0, true);
			}
			else {
				Vue.set(this.showcolumns2, 0, false);
			}

			if (_.indexOf(this.log_table_columns, 'Start Time') != -1) {
				Vue.set(this.showcolumns2, 1, true);
			}
			else {
				Vue.set(this.showcolumns2, 1, false);
			}

			if (_.indexOf(this.log_table_columns, 'Finish Time') != -1) {
				Vue.set(this.showcolumns2, 2, true);
			}
			else {
				Vue.set(this.showcolumns2, 2, false);
			}

			if (_.indexOf(this.log_table_columns, 'Status') != -1) {
				Vue.set(this.showcolumns2, 3, true);
			}
			else {
				Vue.set(this.showcolumns2, 3, false);
			}

			if (_.indexOf(this.log_table_columns, 'Action') != -1) {
				Vue.set(this.showcolumns2, 4, true);
			}
			else {
				Vue.set(this.showcolumns2, 4, false);
			}
        },
		handleChange() {
			if (_.indexOf(this.rule_table_columns, 'Rule Name') != -1) {
				Vue.set(this.showcolumns, 0, true);
			}
			else {
				Vue.set(this.showcolumns, 0, false);
			}

			if (_.indexOf(this.rule_table_columns, 'Frequency') != -1) {
				Vue.set(this.showcolumns, 1, true);
			}
			else {
				Vue.set(this.showcolumns, 1, false);
			}

			if (_.indexOf(this.rule_table_columns, 'Last Run Time') != -1) {
				Vue.set(this.showcolumns, 2, true);
			}
			else {
				Vue.set(this.showcolumns, 2, false);
			}

			if (_.indexOf(this.rule_table_columns, 'Next Run Time') != -1) {
				Vue.set(this.showcolumns, 3, true);
			}
			else {
				Vue.set(this.showcolumns, 3, false);
			}

			if (_.indexOf(this.rule_table_columns, 'Updated By') != -1) {
				Vue.set(this.showcolumns, 4, true);
			}
			else {
				Vue.set(this.showcolumns, 4, false);
			}

			if (_.indexOf(this.rule_table_columns, 'Updated At') != -1) {
				Vue.set(this.showcolumns, 5, true);
			}
			else {
				Vue.set(this.showcolumns, 5, false);
			}

			if (_.indexOf(this.rule_table_columns, 'Action') != -1) {
				Vue.set(this.showcolumns, 6, true);
			}
			else {
				Vue.set(this.showcolumns, 6, false);
			}
		},
    },
	mounted: function () {
		$('[data-toggle="tooltip"]').tooltip();
	},
	updated: function () {
		var elementList = document.querySelectorAll('.el-select > .el-input > input');
		for (var index = 0; index < elementList.length; index++) {
			elementList[index].placeholder = 'Show/Hide Columns';
		}
	}
}
</script>

<style>
.tab span.dnl_icon.dnl_megaphone {
    font-size: 19px;
    float: left;
    margin-right: 8px;
}

.el-select__tags {
    display: none;
}
</style>
