<template>
	<div class="container-fluid">
      <div class="row">
		<div class="wrapper single">
			<time-display></time-display>
			<ol class="breadcrumb">
				  <li class="breadcrumb-item"><a href="#">Tools</a></li>
				  <li class="breadcrumb-item active">Rerate</li>
                  <li class="breadcrumb-item active">{{ title }}</li>
			</ol>
			<h1 class="page-header">Rerate</h1>
			<tabs>
                <form id="todo-field">
				<tab label="Create Re-Rate Task" class="" icon="dnl_icon dnl_setting" selected>
                    <spinner v-show="loading" class="spinner"></spinner>
                    <section class="role_section basic_section m-left-0">
                      <h2 class="role_section_name">Re-rate Scope</h2>
                      <div class="col-sm-3">
                            <label for="from">From:</label>
                            <el-date-picker style="width: 100%;" type="datetime" v-model="from" :picker-options="{}" placeholder="Enter Date and TIme"></el-date-picker>
				      </div>
                      <div class="col-sm-3">
                          <label for="to">To:</label>
                          <el-date-picker style="width: 100%;" type="datetime" v-model="to" :picker-options="{}" placeholder="Enter Date and TIme"></el-date-picker>
                      </div>
				      <div class="col-sm-3">
							<label>GMT:</label>
                            <select class="selectable" v-model="gmt">
                                <option v-for="item in gmt_options" v-bind:value="item.id">
                                    {{ item.text }}
                                </option>
                            </select>
				      </div>
                      <div class="clearfix little-space"></div>
                      <div class="col-md-3 col-sm-4">
							<label>Update US Jurisdiction:</label>
                            <select class="selectable" v-model="up_us_jur">
                                <option v-for="item in up_us_jur_options" v-bind:value="item.id">
                                    {{ item.text }}
                                </option>
                            </select>
				      </div>
                      <div class="col-md-3 col-sm-4">
							<label>Re-rate Trunk Type:</label>
                            <select class="selectable" v-model="type">
                                <option v-for="item in type_options" v-bind:value="item.id">
                                    {{ item.text }}
                                </option>
                            </select>
				      </div>
                      <div class="col-md-3 col-sm-4">
							<label>Status:</label>
                            <select class="selectable" v-model="status">
                                <option v-for="item in status_options" v-bind:value="item.id">
                                    {{ item.text }}
                                </option>
                            </select>
				      </div>
                      <div class="clearfix little-space"></div>
                      <div class="col-sm-6" v-if="type=='ingress'">
                            <div class="form-group">
                                <label>Ingress:</label>
                                <el-transfer v-model="ingress_trunks" :titles="['Selectable Fields', 'Selected Fields']" :data="ingress_trunk_options">
                                </el-transfer>
                            </div>
                        </div>
                        <div class="col-sm-6" v-if="type=='egress'">
                            <div class="form-group">
                                <label>Egress:</label>
                                <el-transfer v-model="egress_trunks" :titles="['Selectable Fields', 'Selected Fields']" :data="egress_trunk_options">
                                </el-transfer>
                            </div>
                        </div>
                      <div class="clearfix little-space"></div>
                    </section>
                    <section class="role_section basic_section m-left-0">
                      <h2 class="role_section_name">Re-rate Method</h2> 
                      <div class="col-md-12">
                          <div class="table-responsive">
                            <table class="table table-striped table-hover carrier_groups centrum">
                              <thead>
                                <tr>
                                    <th>Trunk</th>
                                    <th>Rate Table</th>
                                    <th>Set Effective Date to</th>
                                    <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                  <tr v-for="(rerate_method, index) in rerate_method_list">
                                      <td>{{rerate_method.trunk_name}}</td>
                                      <td>
                                        <select class="selectable" v-model="rerate_method.rate_table_id">
                                            <option v-for="item in rate_table_options" v-bind:value="item.id">
                                                {{ item.text }}
                                            </option>
                                        </select>
                                      </td>
                                      <td>
                                        <select class="selectable eff_date_options" v-model="rerate_method.is_same_as_cdr_time">
                                            <option v-for="item in eff_date_options" v-bind:value="item.id">
                                                {{ item.text }}
                                            </option>
                                        </select>
                                        <el-date-picker v-if="!rerate_method.is_same_as_cdr_time" style="width: 45%;" type="date" v-model="rerate_method.eff_date" :picker-options="{}" placeholder="Enter Date and TIme"></el-date-picker>
                                      </td>
                                      <td>
                                        <a class="action action_delete" data-toggle="tooltip" data-placement="top" title="Delete" @click="delete_rerate_method(index)">
                                            <span class="dnl_icon dnl_action_delete"></span>
                                        </a>
                                      </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                      </div>
                      <div class="clearfix little-space"></div>
                    </section>
                    <div class="button_set m-top-10">
                        <a class="btn btn-primary mini" @click="validateForCreate">
                            Submit
                        </a>
                        <a class="btn btn-default mini" @click="resetForm">
                            Reset


                        </a>
                    </div>
                    </tab></form>
				</tab>
				<tab label="Re-Rate History" class="" icon="dnl_icon dnl_qos_report">
                    <div class="table_filters">
                        <div class="inline-block select_min_wrapper">
                            <span class="inline-block">Page row:</span>
                            <select2 :options="options1" v-model="selected1" class="inline-block">
                            </select2>
                        </div>
                        <div class="inline-block fix_medium_select">
                            <select2 :options="options2" v-model="selected2">
                                <option disabled value="0">Show/Hide Columns</option>
                            </select2>
                        </div>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-striped table-hover carrier_groups">
                          <thead>
                            <tr>
                                <th rowspan="2" colspan="1">Job ID</th>
                                <th rowspan="2" colspan="1">Created Time</th>
                                <th rowspan="2" colspan="1">Selected Time</th>
                                <th rowspan="2" colspan="1">Process Time</th>
                                <th rowspan="2" colspan="1">Status</th>
                                <th rowspan="2" colspan="1">Process</th>
                                <th colspan="2" rowspan="1">Trunk</th>
                                <th rowspan="2" colspan="1">Replace US JD</th>
                                <th colspan="2" rowspan="1">Replace Rate</th>
                                <th colspan="2" rowspan="1">Effective Date</th>
                                <th rowspan="2" colspan="1" class="width_98">Action</th>
                            </tr>
                            <tr>
                                <th rowspan="1" colspan="1">Ingress</th>
                                <th rowspan="1" colspan="1">Egress</th>
                                <th rowspan="1" colspan="1">Ingress</th>
                                <th rowspan="1" colspan="1">Egress</th>
                                <th rowspan="1" colspan="1">Ingress</th>
                                <th rowspan="1" colspan="1">Egress</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="history in histories">
                              <td>{{history.id}}</td>
                              <td>{{history.from_date}}</td>
                              <td>{{history.from_date}}</td>
                              <td>{{history.to_date}}</td>
                              <td>{{history.status}}</td>
                              <td>{{history.progress}}</td>
                              <td>{{history.trunk_ingress}}</td>
                              <td>{{history.trunk_egress}}</td>
                              <td>{{history.update_us_jurisdiction}}</td>
                              <td>{{history.replace_rate_ingress}}</td>
                              <td>{{history.replace_rate_egress}}</td>
                              <td>{{history.effective_date_ingress}}</td>
                              <td>{{history.effective_date_egress}}</td>
                              <td>
                                  <a class="action action_reply" data-toggle="tooltip" data-placement="top" title="Regenerate Report">
                                      <span class="dnl_icon dnl_reply"></span>
                                  </a>
                                  <a class="action action_download" data-toggle="tooltip" data-placement="top" title="Download">
                                      <span class="dnl_icon dnl_download"></span>
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
				</tab>
				<tab label="Re-Rate CDR Download Log" class="" icon="dnl_icon dnl_qos_report">
					<div class="table_filters">
                        <div class="inline-block select_min_wrapper">
                            <span class="inline-block">Page row:</span>
                            <select2 :options="options1" v-model="selected1" class="inline-block">
                            </select2>
                        </div>
                        <div class="inline-block fix_medium_select">
                            <select2 :options="options2" v-model="selected2">
                                <option disabled value="0">Show/Hide Columns</option>
                            </select2>
                        </div>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-striped table-hover carrier_groups">
                          <thead>
                            <tr>
                                <th>Job ID</th>
                                <th @click="sortColumnCDRDownload('create_on')">Created on
                                    <span class="dnl_icon dnl_sort pull-right"></span>
                                </th>
                                <th @click="sortColumnCDRDownload('create_by')">Created by

                                    <span class="dnl_icon dnl_sort pull-right"></span>
                                </th>
                                <th @click="sortColumnCDRDownload('finish_time')">Finish Time
                                    <span class="dnl_icon dnl_sort pull-right"></span>
                                </th>
                                <th>Status</th>
                                <th class="width-65">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="job in jobs">
                              <td>{{job.job_id}}</td>
                              <td>{{job.created_on}}</td>
                              <td>{{job.created_by}}</td>
                              <td>{{job.finish_time}}</td>
                              <td>{{job.status}}</td>
                              <td>
                                  
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
				</tab>
                <tab label="Re-Rate Execute Log" class="" icon="dnl_icon dnl_qos_report">
					<div class="table_filters">
                        <div class="inline-block select_min_wrapper">
                            <span class="inline-block">Page row:</span>
                            <select2 :options="options1" v-model="selected1" class="inline-block">
                            </select2>
                        </div>
                        <div class="inline-block fix_medium_select">
                            <select2 :options="options2" v-model="selected2">
                                <option disabled value="0">Show/Hide Columns</option>
                            </select2>
                        </div>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-striped table-hover carrier_groups">
                          <thead>
                            <tr>
                                <th>Job ID</th>
                                <th>Execute Type</th>
                                <th @click="sortColumnExecLog('create_on')">Created on
                                    <span class="dnl_icon dnl_sort pull-right"></span>
                                </th>

                                <th @click="sortColumnExecLog('create_by')">Created by
                                    <span class="dnl_icon dnl_sort pull-right"></span>
                                </th>
                                <th>Period</th>
                                <th>Process</th>
                                <th>Status</th>
                                <th class="width-65">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="log in logs">
                              <td>{{log.job_id}}</td>
                              <td>{{log.execute_type}}</td>
                              <td>{{log.created_on}}</td>
                              <td>{{log.created_by}}</td>
                              <td>{{log.period}}</td>
                              <td>{{log.process}}</td>
                              <td>{{log.status}}</td>
                              <td>
                                  
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
          Pagination = require('vue!../main_components/pagination.vue');
    const api = require("../../api");
    const vSpinner = require('vue!../main_components/fadeloader.vue');
    import { mapActions } from 'vuex';
	module.exports = {
		components: {
			'tabs': vTabs,
			'tab': vTab,
			'select2': vSelect,
            'pagination': Pagination,
            'spinner': vSpinner
		},
		data: function(){
            return {
                eff_date_options: [
                    {id: false, text: 'A specified Date'},
                    {id: true, text: 'Same as CDR Time'},
                ],
                title: 'Create Re-Rate Task',
                back_trunks: [],
                rerate_method_list: [],
                rate_table_options: [],
                loading: false,
                all_ingress_trunks: [],
                all_egress_trunks: [],
                status: 'active only',
                status_options: [
                    { id: 'active only', text: 'Active only' },
                    { id: 'all', text: 'All' },
                ],
                type_options: [
                    { id: 'ingress', text: 'Ingress' },
                    { id: 'egress', text: 'Egress' },
                ],
                up_us_jur_options: [
                    { id: 'no', text: 'No' },
                    { id: 'yes', text: 'Yes' },
                ],
                gmt_options: [
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
                ingress_trunk_options: [],
                ingress_trunks: [],
                egress_trunk_options: [],
                egress_trunks: [],
                pageOne: {
                    currentPage: 1,
                    totalPages: 10
                },

                // Re-Rate CDR Download Log ...
                pageOneCdr: {
                    currentPage: 1,
                    totalPages: 10
                },

                pagination: {
                    fetchExecLog: {
                        currentPage: 1,
                        totalPages: 10,
                        per_page: 10,
                    },
                    fetchCDRDownload: {
                        currentPage: 1,
                        totalPages: 10,
                        per_page: 10,
                    },
                    fetchHistories: {
                        currentPage: 1,
                        totalPages: 10,
                        per_page: 10,
                    },
                    fetchRateTable: {
                        currentPage: 1,
                        totalPages: 10,
                        per_page: 10,
                    },
                },
                sorting: {
                    fetchExecLog: {
                        order: 'create_by',
                        sort: 'asc',
                        type_sort: 'asc',
                    },
                    fetchCDRDownload: {
                        order: '',
                        sort: '',
                        type_sort: 'asc',
                    },
                    fetchHistories: {
                        order: '',
                        sort: '',
                        type_sort: 'asc',
                    },
                    fetchRateTable: {
                        order: '',
                        sort: '',
                        type_sort: 'asc',
                    },
                },

                from: '',
                to: '',
                gmt: '13',
                up_us_jur: 'no',
                type: 'ingress',
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
				route_types: [
				  { id: 1, text: 'Fail to Next Host' },
				  { id: 2, text: 'Fail to Next Trunk' },
				  { id: 3, text: 'Stop' },
			  	],
                options: [
				  { id: 1, value: 'carrier1', text: 'Carrier 1' },
				  { id: 2, value: 'carrier2', text: 'Carrier 2' },
				  { id: 3, value: 'carrier3', text: 'Carrier 3' },
				  { id: 4, value: 'carrier4', text: 'Carrier 4' },
				  { id: 5, value: 'carrier5', text: 'Carrier 5' }
			    ],
                logs: [],
                jobs: [],
                histories: []
			}
        },
        watch: {
            'ingress_trunks': function() {
                if(this.ingress_trunks.length == 0) {
                    this.rerate_method_list = [];
                    return;
                }

                var last_index = this.ingress_trunks.length - 1;
                if(last_index >= this.back_trunks.length) {
                    for(let i = this.back_trunks.length; i <= last_index; i ++) {
                        let index = _.findIndex(this.ingress_trunk_options, elem => elem.key   === this.ingress_trunks[i])
                        this.rerate_method_list.push({
                            trunk_name: this.ingress_trunk_options[index].label,
                            trunk_id: this.ingress_trunks[i],
                            is_same_as_cdr_time: false,
                            eff_date: '',
                            rate_table_id: this.rate_table_options[0].id,
                        })
                    }
                }
                else {
                    var removed_index_list = [];
                    for(let i = 0; i < this.back_trunks.length; i ++) {
                        removed_index_list.push(i);
                    }
                    for(let i = 0; i <= last_index; i ++) {
                        let index = _.findIndex(this.back_trunks, elem => elem   === this.ingress_trunks[i])
                        removed_index_list.splice(index, 1);
                        
                    }
                    for(let i = 0; i < removed_index_list.length; i ++) {
                        this.rerate_method_list.splice(removed_index_list[i], 1)
                    }
                    
                }
                this.back_trunks = JSON.parse(JSON.stringify(this.ingress_trunks));
            },
            'type': function() {
                console.log(this.type);
                if(this.type == 'ingress')
                    this.egress_trunks = [];
                if(this.type == 'egress')
                    this.ingress_trunks = [];
            },
            'status': function() {
                if(this.status == 'active only'){
                    if(this.type == 'ingress')
                        this.getIngressTrunkOptions(true)
                    if(this.type == 'egress')
                        this.getEgressTrunkOptions(true)
                }
                else{
                    if(this.type == 'ingress')
                        this.getIngressTrunkOptions(false)
                    if(this.type == 'egress')
                        this.getEgressTrunkOptions(false)
                }
            }
        },
        methods: {
            ...mapActions({
                setMessage: 'app_message/setAppMessage'
            }),
            resetForm(e) {
                this.from = "";
                this.to = "";
                this.up_us_jur = "";
                this.gmt = "";
                this.type = "";
                this.status = "";
                this.ingress_trunks = [];
                e.preventDefault();
            },

            sortColumnExecLog(column) {
                if(this.sorting.fetchExecLog.type_sort == 'asc') {
                    this.sorting.fetchExecLog.type_sort = 'desc'
                    this.sorting.fetchExecLog.sort = this.sorting.fetchExecLog.type_sort
                    this.sorting.fetchExecLog.order = column
                    this.fetchExecLog()
                }
                else if(this.sorting.fetchExecLog.type_sort == 'desc') {
                    this.sorting.fetchExecLog.type_sort = 'asc'
                    this.sorting.fetchExecLog.sort = this.sorting.fetchExecLog.type_sort
                    this.sorting.fetchExecLog.order = column
                    this.fetchExecLog()
                }
            },

            sortColumnCDRDownload(column) {
                if(this.sorting.fetchCDRDownload.type_sort == 'asc') {
                    this.sorting.fetchCDRDownload.type_sort = 'desc'
                    this.sorting.fetchCDRDownload.sort = this.sorting.fetchCDRDownload.type_sort
                    this.sorting.fetchCDRDownload.order = column
                    this.fetchCDRDownload()
                }
                else if(this.sorting.fetchCDRDownload.type_sort == 'desc') {
                    this.sorting.fetchCDRDownload.type_sort = 'asc'
                    this.sorting.fetchCDRDownload.sort = this.sorting.fetchCDRDownload.type_sort
                    this.sorting.fetchCDRDownload.order = column
                    this.fetchCDRDownload()
                }
            },

            getQueries(type) {
                var page = '';
                var per_page = '';
                var order = '';
                switch (type) {
                    case 'execLog':
                        page = '?page=' + (this.pagination.fetchExecLog.currentPage - 1)
                        per_page = '&per_page=' + this.pagination.fetchExecLog.per_page
                        order = '&order_by=' + this.sorting.fetchExecLog.order + '&order_dir=' + this.sorting.fetchExecLog.sort
                        break;
                    case 'cdrDownload':
                        page = '?page=' + (this.pagination.fetchCDRDownload.currentPage - 1)
                        per_page = '&per_page=' + this.pagination.fetchCDRDownload.per_page
                        order = '&order_by=' + this.sorting.fetchCDRDownload.order + '&order_dir=' + this.sorting.fetchCDRDownload.sort
                        break;
                    case 'histories':
                        page = '?page=' + (this.pagination.fetchHistories.currentPage - 1)
                        per_page = '&per_page=' + this.pagination.fetchHistories.per_page
                        order = '&order_by=' + this.sorting.fetchHistories.order + '&order_dir=' + this.sorting.fetchHistories.sort
                        break;
                    case 'rateTable':
                        page = '?page=' + (this.pagination.fetchRateTable.currentPage - 1)
                        per_page = '&per_page=' + this.pagination.fetchRateTable.per_page
                        order = '&order_by=' + this.sorting.fetchRateTable.order + '&order_dir=' + this.sorting.fetchRateTable.sort
                        break;
                }
                return page + per_page + order
            },
            fetchExecLog() {
                this.loading = true;
                const url = api.getEndpointUrl() + "/v1/log/rerate/exec" + this.getQueries('execLog')
                this.$http.get(url)
				.then(response => {
					const body = response.body
					if (body.success) {
                        this.logs = body.payload.items;
                        console.log("logs");
                        console.log(this.logs);
                    }
                    this.loading = false;
                })
                .catch(error => {
					console.log(error)
					this.loading = false;
				})
            },
            fetchCDRDownload() {
                this.loading = true;
                const url = api.getEndpointUrl() + "/v1/log/rerate/cdr_download" + this.getQueries('cdrDownload')
                this.$http.get(url)
				.then(response => {
					const body = response.body
					if (body.success) {
                        this.jobs = body.payload.items;
                        console.log(this.jobs);
                    }
                    this.loading = false;
                })
                .catch(error => {
					console.log(error)
					this.loading = false;
				})
            },
            fetchHistories() {
                this.loading = true;
                const url = api.getEndpointUrl() + "/v1/tool/rerate/list" + this.getQueries('histories')
                this.$http.get(url)
				.then(response => {
					const body = response.body
					if (body.success) {
                        this.histories = body.payload.items;
                        console.log(this.histories);
                    }
                    this.loading = false;
                })
                .catch(error => {
					console.log(error)
					this.loading = false;
				})
            },
            delete_rerate_method(id) {
                this.rerate_method_list.splice(id, 1);
            },
            fetchRateTable(cur_page) {
				this.loading = true;
				var url;
				if(cur_page === 0)
					url = api.getEndpointUrl() + "/v1/switch/rate_table/list" + this.getQueries('rateTable')
				else
					url = api.getEndpointUrl() + "/v1/switch/rate_table/list?page=" + cur_page
				this.$http.get(url)
				.then(response => {
					const body = response.body
					if (body.success) {
						var self = this;
						this.loading = false;
						const payload = body.payload
						var rate_tables = payload.items;
						rate_tables.forEach(function (rate_table, i) {
							var temp = {};
							temp.id = rate_table.rate_table_id;
							temp.text = rate_table.name;
							self.rate_table_options.push(temp);
						});
						cur_page = payload.page + 1
						const totalPages = Math.ceil(payload.total / cur_page)

						if(totalPages > cur_page)
							this.fetchRateTable(cur_page);
						else {
							
						}
					}
				})
				.catch(error => {
					console.log(error)
					this.loading = false;
				})
			},
            getRequestForRerate() {
                var rerate = {};
                if(this.from != '')
                    rerate.from_date = this.from.toISOString();
                if(this.to != '')
                    rerate.to_date = this.to.toISOString();
                rerate.gmt = this.gmt;
                rerate.update_us_jurisdiction = this.up_us_jur;
                var temps = [];
                this.rerate_method_list.forEach(function (temp, i) {
                    var item = {};
                    if(!item.is_same_as_cdr_time)
                        item.effective_date = temp.eff_date.toISOString();
                    // item.update_rate = true;
                    item.trunk_id = temp.trunk_id;
                    item.rate_table_id = temp.rate_table_id;
                    temps.push(item);
                });
                if(this.type == 'ingress') {
                    rerate.ingress_trunks = temps;
                }
                if(this.type == 'egress') {
                    rerate.egress_trunks = temps;
                }
                return rerate;
            },
            createRerate() {
                this.loading = true;
                const url = api.getEndpointUrl() + '/v1/tool/rerate'
                const reqBody = this.getRequestForRerate();
                this.$http.post(url, reqBody)
                .then(response => {
                    if (response.body.success) {
                        this.setMessage('Rerate was created successfully');
                        
                    }
                    this.loading = false;
                })
                .catch(error => {
                    console.log(error)
                    this.loading = false;
                    this.setMessage({
                        message: 'Failed to create rerate',
                        type: 'error'
                    })
                })	

            },
            validateForCreate() {
                var vm = this;
                this.$validator.validateAll().then(() => {
                    const err = vm.$validator.getErrors();
                    var trunks_length;
                    if(vm.type=='ingress')
                        trunks_length = vm.ingress_trunks
                    if(vm.type=='egress')
                        trunks_length = vm.egress_trunks
                    var isOk = true;
                    if(this.from == ''){
                        vm.setMessage({
                            message: 'Please select From Date',
                            type: 'error'
                        })
                        return;
                    }
                    if(this.to == ''){
                        vm.setMessage({
                            message: 'Please select To Date',
                            type: 'error'
                        })
                        return;
                    }
                    if(trunks_length == 0) {
                        vm.setMessage({
                            message: 'Please select at least one trunk',
                            type: 'error'
                        })
                        return;
                    }
                    this.rerate_method_list.forEach(function(temp, i){
                        if(temp.eff_date == '') {
                            vm.setMessage({
                                message: 'A specified date field can not leave as null',
                                type: 'error'
                            })
                            isOk = false;
                            return;
                        }
                    })
                    if(err.errors.length > 0) {
                        const msg = err.errors[0].field + ' field can not leave as null';
                        vm.setMessage({
                            message: msg,
                            type: 'error'
                        })
                        return;
                    }
                    if(isOk)
                        vm.createRerate();
                        
                }).catch((error) => {
                    // eslint-disable-next-line
                    console.log(error)
                    vm.setMessage({
                        message: 'Validation failed',
                        type: 'error'
                    })
                });
            },
            getIngressTrunkOptions(only_active) {
                var self = this;
                this.ingress_trunk_options = [];
                if(only_active) {
                    this.all_ingress_trunks.forEach(function (temp, i) {
                        var trunk = {};
                        trunk.key = temp.resource_id;
                        trunk.label = temp.name;
                        if(temp.is_active)
                            self.ingress_trunk_options.push(trunk);
                    });
                }
                else {
                    this.all_ingress_trunks.forEach(function (temp, i) {
                        var trunk = {};
                        trunk.key = temp.resource_id;
                        trunk.label = temp.name;
                        self.ingress_trunk_options.push(trunk);
                    });
                }
            },
            getEgressTrunkOptions(only_active) {
                var self = this;
                this.egress_trunk_options = [];
                if(only_active) {
                    this.all_egress_trunks.forEach(function (temp, i) {
                        var trunk = {};
                        trunk.key = temp.resource_id;
                        trunk.label = temp.name;
                        if(temp.is_active)
                            self.egress_trunk_options.push(trunk);
                    });
                }
                else {
                    this.all_egress_trunks.forEach(function (temp, i) {
                        var trunk = {};
                        trunk.key = temp.resource_id;
                        trunk.label = temp.name;
                        self.egress_trunk_options.push(trunk);
                    });
                }
            },
            fetchEgressTrunks(cur_page) {
                this.loading = true;
                var url;
                if(cur_page === 0)
                    url = api.getEndpointUrl() + "/v1/trunk/egress/list"
                else
                    url = api.getEndpointUrl() + "/v1/trunk/egress/list?page=" + cur_page
                this.$http.get(url)
                    .then(response => {
                        const body = response.body
                        if (body.success) {

                            this.all_egress_trunks.push(...body.payload.items);
                            cur_page = body.payload.page + 1
                            const totalPages = Math.ceil(body.payload.total / body.payload.per_page)
                            if(totalPages > cur_page)
                                this.fetchEgressTrunks(cur_page);
                            else {
                                this.getEgressTrunkOptions(true);
                                
                                this.loading = false;
                            }
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    })
            },
            fetchIngressTrunks(cur_page) {
                this.loading = true;
                var url;
                if(cur_page === 0)
                    url = api.getEndpointUrl() + "/v1/trunk/ingress/list"
                else
                    url = api.getEndpointUrl() + "/v1/trunk/ingress/list?page=" + cur_page
                this.$http.get(url)
                    .then(response => {
                        const body = response.body
                        if (body.success) {
                            this.all_ingress_trunks.push(...body.payload.items);
                            cur_page = body.payload.page + 1
                            const totalPages = Math.ceil(body.payload.total / body.payload.per_page)
                            if(totalPages > cur_page)
                                this.fetchIngressTrunks(cur_page);
                            else {
                                this.getIngressTrunkOptions(true);
                                
                                this.loading = false;
                            }
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    })
            },
			pageOneChanged (pageNum) {
				this.pageOne.currentPage = pageNum
			}
		},
		mounted: function () {
			$('[data-toggle="tooltip"]').tooltip();
		},
        created () {
            this.fetchIngressTrunks(0)
            this.fetchEgressTrunks(0)
            this.fetchRateTable(0)
            this.fetchHistories();
            this.fetchCDRDownload();
            this.fetchExecLog();
        }
	}
</script>

<style>
    .eff_date_options {
        float: left;
        width: 45%;
    }
</style>
