<template>
    <div class="container-fluid">
        <div class="row">
            <div class="single container-top-135">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                        <a href="#">Client</a>
                    </li>
                    <li class="breadcrumb-item active">Client Transaction</li>
                </ol>
                <h1 class="page-header">Transaction</h1>
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
					<div class="table-responsive marged-30">
						<table class="table table-striped table-hover aliases">
							<thead>
								<tr>
									<th rowspan="2">Date</th>
									<th rowspan="2">Activity</th>
									<th rowspan="2">Amount($)</th>
									<th rowspan="2">Credit($)</th>
									<th rowspan="2">Balance($)</th>
								</tr>

							</thead>
							<tbody>
								<tr v-if="!reports.length">
									<td style="text-align: center" colspan="10">No Data Found</td>
								</tr>
								<tr>
									<td>2017-08-08</td>
									<td></td>
									<td>0.00</td>
									<td>0.00</td>
									<td>0.00</td>
								</tr>
								<!--<tr v-for="report in reports">-->
									<!--<td>{{report.asr}}</td>-->
									<!--<td>{{report.acd}}</td>-->
									<!--<td>{{report.pdd}}</td>-->
									<!--<td>{{report.total_duration}}</td>-->
									<!--<td>{{report.total_billable}}</td>-->
								<!--</tr>-->
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
			trunk: '',
			gmt: '',
			by: '',
			output: '',
			groupby1: '',
			groupby2: '',
            
            start_date: '',
            end_date: '',
            // selected1: 1,
            // options1: [
            //     { id: 1, text: '10' },
            //     { id: 2, text: '20' },
            //     { id: 3, text: '30' },
            //     { id: 4, text: '50' },
            //     { id: 5, text: '100' }
            // ],
            // pageOne: {
            //     currentPage: 1,
            //     totalPages: 10,
            //     cntpage: 10,
            // },
            reports: [
				{asr:'0%', adc:'0', pdd:'0', total_duration:'3.00', total_billable:'1.00', usage_charge:'0.00000', avg_rate:'0.00000', total_calls:'0', not_zero:'0', busy_calls:'0'},
				{asr:'0%', adc:'0', pdd:'0', total_duration:'3.00', total_billable:'1.00', usage_charge:'0.00000', avg_rate:'0.00000', total_calls:'0', not_zero:'0', busy_calls:'0'},
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
.el-select__tags {
	display: none;
}
#app > div.container-fluid > div > div > div.timeline > div.chart_content > div > table > thead > tr > th:nth-child(1){
	text-align: left;
}
</style>
