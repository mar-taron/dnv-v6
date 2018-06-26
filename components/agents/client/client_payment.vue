<template>
    <div class="container-fluid">
        <div class="row">
            <div class="single">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                        <a href="#">Client</a>
                    </li>
                    <li class="breadcrumb-item active">Client Payment</li>
                </ol>
                <h1 class="page-header">Payment History</h1>
                <spinner v-show="loading" class="spinner"></spinner>
				<div class="timeline">
					<div class="advanced_search_filter_panel bottom_0">
				  <div class="row">
					<div class="col-md-6 col-sm-6">
                            <div class="inline-block search_wrapper">
                                <label>Search</label>
                                <br>
                                <input type="text" name="search" v-model="search" class="form-control inline-block search_field" placeholder="">
                                <span class="dnl_icon dnl_musica-searcher"></span>
                            </div>
                       </div>
					  <div class="col-md-6 col-sm-6 col-md-push-1">
					  	        <div class="col-sm-12">
					  	        	<div class="col-lg-6 col-sm-6 col-md-4 m-top-25 pad-left pad-right pad-5">
					  	        		 <div class="inline-block float-r select_min_wrapper">
                                			<span>Page row:</span>
                               				 <select2 :options="options1" v-model="selected1" class="inline-block" @pagecount="changePageCount">
                                			</select2>
                            			</div>
					  	        	</div>
					  	        	<div class="col-lg-4 col-sm-6 col-md-6 m-top-25">
					  	        		 <div>
                                		<el-select v-model="payments_table_columns" multiple placeholder="Show/Hide Columns" @change="handleChange">
                                    		<el-option v-for="item in payments_table_column_options" :key="item.value" :label="item.label" :value="item.value">
                                    		</el-option>
                                		</el-select>
                            			</div>
					  				</div>
                       			 </div>
					  </div>
					   </div>
					</div>
					<div v-if="show_payment_clients" class="chart_select_header grided">
					<div class="advanced_search_filter_panel bottom_0">
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
						<div class="col-md-2 col-sm-4">
							<label>GMT:</label>
							<select2 :options="gmt_options" v-model="gmt">
								<option disabled value="0">Select one</option>
							</select2>
						</div>
						<div class="col-md-2 col-sm-4">
							<label>By:</label>
							<select2 :options="by_hour_options" v-model="by_hour">
								<option disabled value="0">Select one</option>
							</select2>
						</div>
						<div class="col-md-2 col-sm-4">
							<label>Ingress Trunk:</label>
							<select2 :options="options" v-model="trunk">
								<option disabled value="0">Select one</option>
							</select2>
						</div>
						<div class="col-md-2 col-sm-4">
							<label>Output:</label>
							<select2 :options="web_options" v-model="web">
								<option disabled value="0">Select one</option>
							</select2>
						</div>
						<div class="clearfix little-space"></div>
						<div class="col-md-12">
							<div class="white_pad m-bottom-10">
								<div class="row">
									<div class="col-md-4 col-sm-4">
										<label>Group By #1:</label>
										<select2 :options="options" v-model="groupby1">
											<option disabled value="0">Select one</option>
										</select2>
									</div>
									<div class="col-md-4 col-sm-4">
										<label>Group By #2:</label>
										<select2 :options="options" v-model="groupby2">
											<option disabled value="0">Select one</option>
										</select2>
									</div>
								</div>
							</div>
						</div>
						<div class="clearfix"></div>
						<div class="col-md-12 col-sm-12">
							<div class="button_set">
								<a class="btn btn-primary">
									Query
								</a>
							</div>
						</div>
						<div class="clearfix"></div>							
					</div>
					</div>
					<div class="clearfix"></div>
					<div class="chart_content">
					<div class="table-responsive marged-30">
						<table class="table table-striped table-hover aliases">
							<thead>
								<tr>
									<th v-if="showcolumns[0]" >Payment Date<a @click="sortName"><span class="dnl_icon dnl_sort pull-right"></span></a></th>
									<th v-if="showcolumns[1]" >Reference<a @click="sortName"><span class="dnl_icon dnl_sort pull-right"></span></a></th>
									<th v-if="showcolumns[2]" >Charges<a @click="sortName"><span class="dnl_icon dnl_sort pull-right"></span></a></th>
									<th v-if="showcolumns[3]" >Amount<a @click="sortName"><span class="dnl_icon dnl_sort pull-right"></span></a></th>
									<th v-if="showcolumns[4]" >Method<a @click="sortName"><span class="dnl_icon dnl_sort pull-right"></span></a></th>
									<th v-if="showcolumns[5]" >Status<a @click="sortName"><span class="dnl_icon dnl_sort pull-right"></span></a></th>
									<th v-if="showcolumns[6]" >Action<a @click="sortName"><span class="dnl_icon dnl_sort pull-right"></span></a></th>
								</tr>

							</thead>
							<tbody>
								<tr v-for="report in filterBy(reports, search)">
									<td v-if="showcolumns[0]">{{report.asr}}</td>
									<td v-if="showcolumns[1]">{{report.acd}}</td>
									<td v-if="showcolumns[2]">{{report.pdd}}</td>
									<td v-if="showcolumns[3]">{{report.total_duration}}</td>
									<td v-if="showcolumns[4]">{{report.total_billable}}</td>
									<td v-if="showcolumns[5]">{{report.usage_charge}}</td>
									<td v-if="showcolumns[6]"></td>

								</tr>
							</tbody>
						</table>
					</div>
					</div>
					<!-- <div class="pull-right pagination">
						<pagination :current-page="pageOne.currentPage" :total-pages="pageOne.totalPages" @page-changed="pageOneChanged">
						</pagination>
					</div> -->
					<div class="clearfix"></div>
				</div>				
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
	auth = require("../../../auth"),
	vSpinner = require('vue!../../main_components/fadeloader.vue');
_ = require('lodash');
import {mapGetters,	mapActions} from 'vuex'

module.exports = {
    components: {
        'tabs': vTabs,
        'tab': vTab,
        'select2': vSelect,
        'pagination': Pagination,
        'spinner': vSpinner
    },
    data: function () {
        return {
            loading: false,

			web: 'web',
			show_payment_clients:false,
			web_options: [
				{ id: 'web', text: 'Web' },
				{ id: 'excel_csv', text: 'Excel CSV' },
				{ id: 'email_when_done', text: 'Email when done' },
				{ id: 'export_from_storage', text: 'Export from Storage' },
			],				
			gmt: 13,
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
			period: 'Custom',
			period_options: [
				{id: 'Custom', text: 'Custom'},
				{id: 'Today', text: 'Today'},
				{id: 'Yesterday', text: 'Yesterday'},
				{id: 'Current week', text: 'Current week'},
				{id: 'Previous week', text: 'Previous week'},
				{id: 'Current month', text: 'Current month'},
				{id: 'Previous month', text: 'Previous month'},
			],
			by_hours: 1,
			by_hour_options: [
				{ id: 1, text: 'All Time', value: 0 },
				{ id: 2, text: 'By hours', value: 60 },
				{ id: 3, text: 'By day', value: 1440 },
				{ id: 4, text: 'By month', value: 43200 },
				{ id: 5, text: 'By year', value: 525600 },
			],
            payments_table_columns: ['Payment', 'Reference', 'Charges', 'Amount', 'Method', 'Status', 'Action'],
            payments_table_column_options: [

                {
                    value: 'Payment',
                    label: 'Payment'
                }, {
                    value: 'Reference',
                    label: 'Reference'
                }, {
                    value: 'Charges',
                    label: 'Charges'
                }, {
                    value: 'Amount',
                    label: 'Amount'
                 }, {
                    value: 'Method',
                    label: 'Method'
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
             selected1: 1,
             options1: [
                 { id: 1, text: '10' },
                 { id: 2, text: '20' },
                 { id: 3, text: '30' },
                 { id: 4, text: '50' },
                 { id: 5, text: '100' }
             ],
             pageOne: {
                 currentPage: 1,
                 totalPages: 10,
                 cntpage: 10,
             },
            showcolumns: [true, true, true, true, true, true, true],
             apiUrl: '',
            search: '',			
			trunk: '',
			
			groupby1: '',
			groupby2: '',
            
            start_date: '',
            end_date: '',

            reports: [
				{asr:'0%', adc:'0', pdd:'0', total_duration:'0.00', total_billable:'0.00', usage_charge:'0.00000', avg_rate:'0.00000', total_calls:'0', not_zero:'0', busy_calls:'0'},
				{asr:'0%', adc:'0', pdd:'0', total_duration:'0.00', total_billable:'0.00', usage_charge:'0.00000', avg_rate:'0.00000', total_calls:'0', not_zero:'0', busy_calls:'0'},
				{asr:'0%', adc:'0', pdd:'0', total_duration:'0.00', total_billable:'0.00', usage_charge:'0.00000', avg_rate:'0.00000', total_calls:'0', not_zero:'0', busy_calls:'0'},
			],
        }
    },
    methods: {
        ...mapActions({
            setAsyncConfirm: 'async_confirm/setAsyncConfirm',
            setMessage: 'app_message/setAppMessage'
        }),
        fetchreports() {
            var page = this.pageOne.currentPage - 1;
            var per_page = this.pageOne.cntpage;
            this.loading = true;

            this.$http.get(api.getEndpointUrl() + this.apiUrl + "?page=" + page + "&per_page=" + per_page + "&order_by=id&order_dir=desc",
                {
                    headers: {
                        "X-Auth-Token": auth.getToken()
                    }
                }).then(function (response) {
                    this.loading = false;
                    //todo: check success flag? validation errors?
                    var reports = response.body.payload.items;
                    console.log(reports);
                    this.reports = reports;
                    var total_page = response.body.payload.total;
                    this.pageOne.currentPage = response.body.payload.page + 1;
                    this.pageOne.totalPages = Math.ceil(response.body.payload.total / per_page);
                }, function (error) {
                    this.loading = false;
                    console.log(error);
                }
            );
        },
        handleChange() {
            if (_.indexOf(this.payments_table_columns, 'Payment') != -1) {
                Vue.set(this.showcolumns, 0, true);
            } else {
                Vue.set(this.showcolumns, 0, false);
            }
            if (_.indexOf(this.payments_table_columns, 'Reference') != -1) {
                Vue.set(this.showcolumns, 1, true);
            } else {
                Vue.set(this.showcolumns, 1, false);
            }
            if (_.indexOf(this.payments_table_columns, 'Charges') != -1) {
                Vue.set(this.showcolumns, 2, true);
            } else {
                Vue.set(this.showcolumns, 2, false);
            }
            if (_.indexOf(this.payments_table_columns, 'Amount') != -1) {
                Vue.set(this.showcolumns, 3, true);
            } else {
                Vue.set(this.showcolumns, 3, false);
            }
            if (_.indexOf(this.payments_table_columns, 'Status') != -1) {
                Vue.set(this.showcolumns, 4, true);
            } else {
                Vue.set(this.showcolumns, 4, false);
            }
            if (_.indexOf(this.payments_table_columns, 'Action') != -1) {
                Vue.set(this.showcolumns, 5, true);
            } else {
                Vue.set(this.showcolumns, 5, false);
            }

        },
        pageOneChanged(pageNum) {
            if (pageNum !== this.pageOne.currentPage) {
                this.pageOne.currentPage = pageNum
                this.$nextTick(this.fetchreports)
            }
        },
        changePageCount (countPerPage) {
            if (countPerPage !== this.pageOne.cntpage) {
                this.pageOne.cntpage = countPerPage
                this.$nextTick(this.fetchreports)
            }
        },
    },
    mounted: function () {
        $('[data-toggle="tooltip"]').tooltip();
    },
	updated: function () {
		document.querySelector('.el-select > .el-input > input').placeholder = 'Show/Hide Columns';
	},
    created: function () {
        this.fetchreports();
    }
}
</script>

<style>
.m-top-5{
	margin-top: 5px;
}
.el-select__tags {
	display: none;
}
.table_filters{
margin-top: 44px;
}
</style>
