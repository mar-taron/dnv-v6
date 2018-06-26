
<template>
    <div class="container-fluid">
        <div class="row">
            <div class="wrapper single">
                <time-display></time-display>
                <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                        <a href="#">Configuration</a>
                    </li>
                    <li class="breadcrumb-item active">Termination Reports</li>
                </ol>
                <h1 class="page-header">Call Records</h1>
                <div class="row">
                    <div class="col-sm-4 col-md-2 col-xs-6 pad-right">
                        <button class="btn btn-primary">
                            Download CDRs
                        </button>
                    </div>
                    <div class="col-sm-4 col-md-2 col-xs-6 pad-left">
                        <button class="btn btn-primary">View Failed Calls</button>
                    </div>

                </div>
                <spinner v-show="loading" class="spinner"></spinner>
                <tabs>
                    <tab label="Grid" class="" icon="dnl_icon dnl_qos_report" selected>
                        <div v-if="cdrs_search_form_group" class="advanced_search_filter_panel bottom_0">
                            <div class="col-md-2 col-sm-4">
                                <label>Period:</label>
                                <select2 :options="period_options" v-model="period">
                                    <option disabled value="0">Select one</option>
                                </select2>
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
                            <div class="col-md-2 col-sm-6">
                                <label>GMT:</label>
                                <select2 :options="gmt_options" v-model="gmt">
                                    <option disabled value="0">Select one</option>
                                </select2>
                            </div>
                            <div class="col-md-2 col-sm-6">
                                <label>Web:</label>
                                <select2 :options="web_options" v-model="web">
                                    <option disabled value="0">Select one</option>
                                </select2>
                            </div>
                            <div class="col-md-2 col-sm-6">
                                <a class="btn btn-primary full-width m-top-20" v-on:click="searchReport()">
                                    Query
                                </a>
                            </div>
                            <div class="clearfix little-space"></div>
                            <div class="col-md-12">
                                <div class="white_pad m-bottom-10">
                                    <div class="row">
                                        <div class="col-md-4 col-sm-6">
                                            <label>Trunk Name:</label>
                                            <select2 :options="trunk_list" v-model="trunk">
                                                <option disabled value="0">Select one</option>
                                            </select2>
                                        </div>
                                        <div class="col-md-4 col-sm-6">
                                            <label>ANI:</label>
                                            <input type="text" name="ani" v-model="ani" class="form-control" placeholder="Enter ANI">
                                        </div>
                                        <div class="col-md-4 col-sm-6">
                                            <label>DNIS:</label>
                                            <input type="text" name="dnis" v-model="dnis" class="form-control" placeholder="Enter DNIS">
                                        </div>
                                        <div class="col-md-4 col-sm-6">
                                            <label>Duration:</label>
                                            <select2 :options="duration_list" v-model="duration">
                                                <option disabled value="0">Select one</option>
                                            </select2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="clearfix"></div>
                        </div>
                        <div class="clearfix little-space"></div>
                        <div class="duration-field">
                            <div class="inline-block fix_medium_select">
                                <span class="inline-block">Duration</span>
                                <select2 class="trunks" :options="trunk_list" v-model="trunk">
                                    <option disabled value="0">All Trunks Group</option>
                                </select2>
                            </div>
                        </div>

                        <div class="table-responsive">
                            <table class="table table-striped table-hover aliases">
                                <thead>
                                <tr>
                                    <th rowspan="2" v-if="showcolumns[0]">ASR</th>
                                    <th rowspan="2" v-if="showcolumns[1]">ACD(min)</th>
                                    <th rowspan="2" v-if="showcolumns[2]">PDD(ms)</th>
                                    <th class="text-center" colspan="2" v-if="showcolumns[3]">Time(min)</th>
                                    <th rowspan="2" v-if="showcolumns[6]">Usage Charge(USA)</th>
                                    <th rowspan="2" v-if="showcolumns[6]">Avg Rate</th>
                                    <th class="text-center" colspan="3" v-if="showcolumns[6]">Calls</th>
                                </tr>
                                <tr>
                                    <th v-if="showcolumns[4]">Total Duration</th>
                                    <th v-if="showcolumns[5]">Total Billable Time</th>
                                    <th v-if="showcolumns[6]">Total Calls</th>
                                    <th v-if="showcolumns[6]">Not Zero</th>
                                    <th v-if="showcolumns[6]">Busy Calls</th>
                                </tr>
                                </thead>
                                <tbody>


                                <tr v-for="cdr in cdrs">
                                    <td v-if="showcolumns[0]"></td>
                                    <td v-if="showcolumns[1]"></td>
                                    <td v-if="showcolumns[2]"></td>
                                    <td v-if="showcolumns[3]"></td>
                                    <td v-if="showcolumns[4]"></td>
                                    <td v-if="showcolumns[5]"></td>
                                    <td v-if="showcolumns[6]"></td>
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
                    <tab v-if="cdrs_search_form_group" label="Graphs" class="" icon="dnl_icon dnl_export">
                    </tab>
                    <tab v-if="cdrs_search_form_group" label="Trunk Group/IP" class="" icon="dnl_icon dnl_export">
                    </tab>
                    <tab label="CDR's" class="" icon="dnl_icon dnl_export">
                        <div class="row">
                            <div class="col-md-8 col-sm-8 col-xs-12">
                                <div class="bottom pull-left col-md-4 col-sm-6 col-xs-6">
                                    <label>Search:</label>
                                    <input type="text" name="link" v-model="link" class="form-control">
                                </div>
                                <div class="col-md-4 col-sm-4 col-xs-6 bottom p0l mar-top">
                                    <a class="btn btn-primary">
                                        <span class="dnl_icon dnl_qos_report"></span>Save CVS
                                    </a>
                                </div>
                            </div>
                            <div class="col-md-4 col-sm-4 col-xs-12 bottom mar-top">
                                <div class="col-md-12 col-sm-12 col-xs-12">
                                    <div class="inline-block pull-right">
                                        <span class="inline-block">Page row:</span>
                                        <select2 :options="page_rows" v-model="page_row_count" class="inline-block" @pagecount="changePageCount">
                                        </select2>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!--   <div class="col-sm-12">
                              <div class="row">
                                  <div class="col-sm-4">
                                      <div class="row">
                                          <div style="text-align: right;" class="col-sm-1">
                                              <span class="">Page row:</span>
                                          </div>
                                          <div class="col-sm-2">
                                              <select2 :options="options1" v-model="selected1" class="">
                                              </select2>
                                          </div>
                                      </div>
                                  </div>

                                  <div class="col-sm-3 pull-right">
                                      <el-select v-model="cdr_table_columns" multiple placeholder="Show/Hide Columns" @change="handleChange">
                                          <el-option v-for="item in cdr_log_table_column_options" :key="item.value" :label="item.label" :value="item.value">
                                          </el-option>
                                      </el-select>
                                  </div>
                              </div>

                          </div> -->
                        <div class="clearfix"></div>
                        <div class="table-responsive">
                            <table class="table table-striped table-hover carrier_groups centrum">
                                <thead>
                                <tr>
                                    <th v-if="log_showcolumns[0]">Date</th>
                                    <th v-if="log_showcolumns[1]">Success CDRs</th>
                                    <th v-if="log_showcolumns[2]">Failed CDRs</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td v-if="log_showcolumns[0]"></td>
                                    <td v-if="log_showcolumns[1]"></td>
                                    <td v-if="log_showcolumns[2]"></td>

                                </tr>
                                </tbody>
                            </table>
                        </div>

                    </tab>

                </tabs>
            </div>
        </div>
    </div>
</template>

<script>
    const vTabs = require('vue!../../main_components/tabs.vue'),
        vTab = require('vue!../../main_components/tab.vue'),
        vSelect = require('vue!../../main_components/select.vue'),
        Pagination = require('vue!../../main_components/pagination.vue'),
        api = require("../../../api"),
        _ = require('lodash');
    import {mapGetters,	mapActions} from 'vuex'

    module.exports = {
        components: {
            'tabs': vTabs,
            'tab': vTab,
            'select2': vSelect,
            'pagination': Pagination,
        },
        data: function () {
            return {
                cdrs_search_form_group: false,
                loading: false,
                apiUrl: '',
                web: 'web',
                gmt: 13,
                period: 'Custom',
                duration_list: [
                    { id: "all", text: 'All'},
                    { id: "non_zero", text: 'Non Zero'},
                    { id: "zero", text: 'Zero'},
                ],
                search: '',
                pageOne: {
                    currentPage: 1,
                    totalPages: 10,
                    cntpage: 10,
                },
                start_date1: '',
                end_date1: '',
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
                cdr_table_column_options: [{
                    value: 'Answer Time',
                    label: 'Answer Time'
                }, {
                    value: 'Call Duaration',
                    label: 'Call Duaration'
                }, {
                    value: 'End Time',
                    label: 'End Time'
                }, {
                    value: 'Trunk ID Origination',
                    label: 'Trunk ID Origination'
                }],
                cdr_table_columns: ['Answer Time', 'Call Duaration', 'End Time', 'Trunk ID Origination'],
                showcolumns: [true, true, true, true, true, true, true, true],

                log_showcolumns: [true, true, true, true, true],
            }
        },
        methods: {
            ...mapActions({
                setAsyncConfirm: 'async_confirm/setAsyncConfirm',
                setMessage: 'app_message/setAppMessage'
            }),

        },

    }
</script>

<style>
    .duration-field {
        margin-bottom: 5px;
    }
    #app > div.container-fluid > div > div > div.tabs > div.tabs_container > div:nth-child(2) > div.row > div.col-md-4.col-sm-4.col-xs-12.bottom.mar-top > div {
        padding-right: 0px;
    }
    span.table_time.pull-right.main_time{
        margin-top: 0px;
    }
    #app > div.container-fluid > div > div > div.tabs > div.tabs_container > div:nth-child(4) > div.row > div.col-md-4.col-sm-4.col-xs-12.bottom.mar-top{
        margin-top: 28px;
    }
    #app > div.container-fluid > div > div > div.tabs > div.tabs_container > div:nth-child(4) > div.row > div.col-md-8.col-sm-8.col-xs-12 > div.col-md-4.col-sm-4.col-xs-6.bottom.p0l.mar-top{
        margin-top: 25px;
    }
    #app > div.container-fluid > div > div > div.tabs > div.tabs_container > div:nth-child(4) > div.row > div.col-md-4.col-sm-4.col-xs-12.bottom.mar-top > div > div{
        float: right;
    }
    #app > div.container-fluid > div > div > div.tabs > div.tabs_container > div:nth-child(1) > div.row > span {
        margin-top: 44px;
        text-align: right;
    }
    .trunks {
        width: 100%!important;
    }
    #app > div.container-fluid > div > div > div.tabs > div.tabs_container > div:nth-child(1) > div.row > div.col-md-2.col-sm-push-4 {
        margin-left:21px;
    }
    #app > div.container-fluid > div > div > div.tabs > div.tabs_container > div:nth-child(1) > div.row > div > span {
        width: 100%!important;
        margin-bottom: 10px;
        padding:10px;
    }
    .el-select__tags {
        display: none;
    }
    #app > div.container-fluid > div > div > div.tabs > div.tabs_container > div:nth-child(2) > div.row > div.col-md-4.col-sm-4.col-xs-12.bottom.mar-top,
    #app > div.container-fluid > div > div > div.tabs > div.tabs_container > div:nth-child(2) > div.row > div.col-md-8.col-sm-8.col-xs-12 > div.col-md-4.col-sm-4.col-xs-6.bottom.p0l.mar-top {
        margin-top:25px;

    }
    #app > div.container-fluid > div > div > div.tabs > div.tabs_container > div:nth-child(1) > div.row > div.col-md-2.pull-right {
        margin-top: 35px;
    }

    #app > div.container-fluid > div > div > div.tabs > div.tabs_container > div:nth-child(2) > div.row > div.col-md-8.col-sm-8.col-xs-12 > div.bottom.pull-left.col-md-4.col-sm-6.col-xs-6 {
        padding-left: 0px;
    }

    @media (max-width: 687px) {
        #app > div.container-fluid > div > div > div.tabs > div.tabs_container > div:nth-child(1) > div.table_filters > div.inline-block.fix_medium_select,
        #app > div.container-fluid > div > div > div.tabs > div.tabs_container > div:nth-child(1) > div.table_filters > div.inline-block.fix_medium_select > span.inline-block
        {
            width:100%;
            padding-bottom:5px;
        }
        #app > div.container-fluid > div > div > div.tabs > div.tabs_container > div:nth-child(1) > div.table_filters > div.pull-right > div.inline-block.fix_medium_select > div > div.el-input {
            padding-bottom: 10px;
        }

    }

    @media (min-width: 457px) and (max-width: 687px) {
        #app > div.container-fluid > div > div > div.tabs > div.tabs_container > div:nth-child(1) > div.table_filters > div.pull-right {
            float: left!important;
        }
    }
    @media (max-width: 767px){
        #app > div.container-fluid > div > div > div.tabs > div.tabs_container > div:nth-child(4) > div.row > div.col-md-4.col-sm-4.col-xs-12.bottom.mar-top > div > div{
            float: left;
        }

        #app > div.container-fluid > div > div > div.tabs > div.tabs_container > div:nth-child(4) > div.row > div.col-md-8.col-sm-8.col-xs-12 > div.col-md-4.col-sm-4.col-xs-6.p0l.mar-top,
        #app > div.container-fluid > div > div > div.tabs > div.tabs_container > div:nth-child(2) > div.row > div.col-md-8.col-sm-8.col-xs-12 > div.col-md-4.col-sm-4.col-xs-6.bottom.p0l.mar-top{
            margin-top: 35px;
        }
        @media (max-width: 480px){
            #app > div.container-fluid > div > div > div.tabs > div.tabs_container > div:nth-child(2) > div.row > div.col-md-8.col-sm-8.col-xs-12 > div.col-md-4.col-sm-4.col-xs-6.bottom.p0l.mar-top{
                margin-top: 31px!important;
            }
            .p0l{
                padding-left: 0px;
            }
        }
    }
</style>