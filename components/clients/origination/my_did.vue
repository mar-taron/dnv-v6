<template>
    <div class="container-fluid">
        <div class="row">
            <div class="single container-top-135">
                <!-- <time-display></time-display> -->
                <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                        <a href="#">Origination</a>
                    </li>
                    <li class="breadcrumb-item active">My DID's </li>
                </ol>
                <h1 class="page-header">My DID Numbers</h1>
                <spinner v-show="loading" class="spinner"></spinner>
				<div class="timeline">
					<div v-if="client_transaction_form_group" class="chart_select_header grided">
					<!-- <div class="advanced_search_filter_panel bottom_0"> -->
						<div class="col-md-2 col-sm-4">
							<label>Period:</label>
							<select2 :options="options" v-model="period">
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
							<select2 :options="options" v-model="gmt">
								<option disabled value="0">Select one</option>
							</select2>
						</div>
						<div class="col-md-2 col-sm-4">
							<label>By:</label>
							<select2 :options="options" v-model="by">
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
							<select2 :options="options" v-model="output">
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
						<!--<div class="col-md-12 col-sm-12">-->
							<!--<div class="button_set">-->
								<!--<a class="btn btn-primary">-->
									<!--Query-->
								<!--</a>-->
							<!--</div>-->
						<!--</div>-->
						<div class="clearfix"></div>							
					<!-- </div> -->
					</div>
					<div class="clearfix"></div>
					<div class="chart_content">
							<div class="row">
						<div class="col-md-6 col-sm-6 col-xs-12">
							<div class="bottom col-md-6 col-sm-6 col-xs-6">
							<label>Search:</label>
							<input type="text" name="link" v-model="link" class="form-control">
						</div>
						<div class="col-lg-3 col-md-6 col-sm-6 col-xs-6 bottom p0l mar-top">
							<a class="btn btn-primary">
								<span class="dnl_icon dnl_qos_report"></span>Save CVS
							</a>
						</div>
					</div>
							  <div class="col-md-6 col-sm-6 col-xs-12 bottom mar-top">
               			<div class="col-lg-8 col-md-7 col-sm-6 col-xs-6">
						<div class="inline-block">
							<span class="inline-block">Page row:</span>
							<select2 :options="page_rows" v-model="page_row_count" class="inline-block" @pagecount="changePageCount">
							</select2>
						</div>
						</div>
						<div class="col-lg-4 col-md-5 col-sm-6 col-xs-6">
							<div class="inline-block">
							<span class="inline-block">Entries:</span>
							<select2 :options="page_entries" v-model="page_entries_count" class="inline-block" @pagecount="changePageCount">
							</select2>
						</div>
						</div>
					</div>
				</div>
					<div class="table-responsive marged-30">
						<table class="table table-striped table-hover aliases">
							<thead>
								<tr>
									<th rowspan="2">
										Did Number
										<a @click="sortColumn('date')"><span class="dnl_icon dnl_sort pull-right"></span></a>

									</th>
									<th rowspan="2">
										Group
										<a @click="sortColumn('activity')"><span class="dnl_icon dnl_sort pull-right"></span></a>
									</th>
									<th rowspan="2">Amount($)</th>
									<th colspan="2">
										Call Forward
										<a @click="sortColumn('credit')"><span class="dnl_icon dnl_sort pull-right"></span></a>

									</th>
									<th rowspan="2">
										Order
										<a @click="sortColumn('order')"><span class="dnl_icon dnl_sort pull-right"></span></a>
									</th>
									<th rowspan="2">
										DID MRC
										<a @click="sortColumn('mrc')"><span class="dnl_icon dnl_sort pull-right"></span></a>

									</th>
									<th rowspan="2">
										Stats
										<a @click="sortColumn('stats')"><span class="dnl_icon dnl_sort pull-right"></span></a>
									</th>
									<th rowspan="2">Trunk Group/Sessions
										<a @click="sortColumn('sessions')"><span class="dnl_icon dnl_sort pull-right"></span></a>

									</th>
									<th rowspan="2">
										E911
										<a @click="sortColumn('credit')"><span class="dnl_icon dnl_sort pull-right"></span></a>
									</th>
									<th rowspan="2">
										Activation Date
										<a @click="sortColumn('credit')"><span class="dnl_icon dnl_sort pull-right"></span></a>
									</th>
									<th rowspan="2">
										Status
										<a @click="sortColumn('credit')"><span class="dnl_icon dnl_sort pull-right"></span></a>

									</th>

								</tr>

							</thead>
							<tbody>
								<tr v-if="!reports.length">
									<td style="text-align: center" colspan="10">No Data Found</td>
								</tr>										
								
								<tr v-for="report in reports">
									<td>{{report.asr}}</td>
									<td>{{report.acd}}</td>
									<td>{{report.pdd}}</td>
									<td>{{report.total_duration}}</td>
									<td>{{report.total_billable}}</td>
									<td>{{report.usage_charge}}</td>
									<td>{{report.asr}}</td>
									<td>{{report.acd}}</td>
									<td>{{report.pdd}}</td>
									<td>{{report.total_duration}}</td>
									<td>{{report.total_billable}}</td>
									<td>{{report.usage_charge}}</td>
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
            client_transaction_form_group: false,
            loading: false,
            apiUrl: '',
            search: '',
            period: '',
            start_date: '',
            end_date: '',
            page_row_count: 1,
            page_entries_count: 1,
            page_rows: [
                { id: 1, text: '10' },
                { id: 2, text: '20' },
                { id: 3, text: '30' },
                { id: 4, text: '50' },
                { id: 5, text: '100' }
            ],
            page_entries: [
                { id: 1, text: 'DID' },
                { id: 2, text: 'Activated On' },
                { id: 3, text: 'Setup Fee' },
                { id: 4, text: 'Fixed Fee' },
                { id: 5, text: 'Per Minute Fee' },
                { id: 5, text: 'Trunk Name' },
                { id: 5, text: 'Trunk IP' },
                { id: 5, text: 'Max Session' }
            ],
            reports: [
                {
                    asr: '0%',
                    adc: '0',
                    pdd: '0',
                    total_duration: '0.00',
                    total_billable: '0.00',
                    usage_charge: '0.00000',
                    avg_rate: '0.00000',
                    total_calls: '0',
                    not_zero: '0',
                    busy_calls: '0'
                },
                {
                    asr: '0%',
                    adc: '0',
                    pdd: '0',
                    total_duration: '0.00',
                    total_billable: '0.00',
                    usage_charge: '0.00000',
                    avg_rate: '0.00000',
                    total_calls: '0',
                    not_zero: '0',
                    busy_calls: '0'
                },
                {
                    asr: '0%',
                    adc: '0',
                    pdd: '0',
                    total_duration: '0.00',
                    total_billable: '0.00',
                    usage_charge: '0.00000',
                    avg_rate: '0.00000',
                    total_calls: '0',
                    not_zero: '0',
                    busy_calls: '0'
                },
            ],
        }
    },
    methods: {
        ...mapActions({
            setAsyncConfirm: 'async_confirm/setAsyncConfirm',
            setMessage: 'app_message/setAppMessage'
        }),
        fetchreports() {

        },
        pageOneChanged(pageNum) {

        },
        changePageCount(countPerPage) {

        },
        mounted: function () {
        },
        updated: function () {
        },
        created: function () {
        }
    }
}
</script>

<style>

#app > div.container-fluid > div > div > div.timeline > div.chart_content > div.table-responsive.marged-30{
margin-left: 15px;	
}
#app > div.container-fluid > div > div > div.timeline > div.chart_content > div.row > div.col-md-6.col-sm-8.col-xs-12.mar-top{
	margin-top: 26px;
}
.el-select__tags {
	display: none;
}

.container-fluid {
	padding-right: 36px!important;
	padding-left: 36px!important;
}
.chart_content {
	 padding-top: 36px;
	 border-radius: 5px;
}
.bottom{
	margin-bottom: 15px;
}
#app > div.container-fluid > div > div > div.timeline > div.chart_content > div.row > div:nth-child(1) > div:nth-child(2) > a{
	width: 100%;
}
@media (min-width: 767px){
	#app > div.container-fluid > div > div > div.timeline > div.chart_content > div.row > div.col-md-6.col-sm-6.col-xs-12.bottom.mar-top > div:nth-child(1) > div{
		float: right!important;
	}
}
@media (min-width: 873px){
#app > div.container-fluid > div > div > div.timeline > div.chart_content > div.row > div.col-md-6.col-sm-6.col-xs-12.mar-top, 
#app > div.container-fluid > div > div > div.timeline > div.chart_content > div.row > div:nth-child(1) > div.col-md-6.col-sm-6.col-xs-6.mar-top{
	margin-top: 25px;
}
}
@media (max-width: 873px) and (min-width: 768px){
#app > div.container-fluid > div > div > div.timeline > div.chart_content > div.row > div:nth-child(1) > div.col-md-6.col-sm-6.col-xs-6.mar-top{
	margin-top: 26px;
}
}
@media (max-width: 873px) and (min-width: 768px){
#app > div.container-fluid > div > div > div.timeline > div.chart_content > div.row > div.col-md-6.col-sm-6.col-xs-12.mar-top{
	margin-top: 6px;
}
}
@media (max-width: 767px){
	a.btn.btn-primary.m-top-25{
		margin-top: 35px;
	}
	#app > div.container-fluid > div > div > div.timeline > div.chart_content > div.row > div.col-md-6.col-sm-8.col-xs-12.mar-top{
		margin-top: 15px;
	}
	#app > div.container-fluid > div > div > div.timeline > div.chart_content > div.row > div:nth-child(1) > div.col-md-6.col-sm-6.col-xs-6.bottom.mar-top{
		margin-top: 32px;
	}
}
@media (max-width: 480px){
	a.btn.btn-primary.m-top-25{
		margin-top: 32px;
	}
}
@media (max-width: 340px){
	#app > div.container-fluid > div > div > div.timeline > div.chart_content > div.row > div:nth-child(1) > div.col-md-6.col-sm-6.col-xs-6.bottom.p0l.mar-top{
		padding-left: 0px;
	}
}
</style>
