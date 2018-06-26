<template>
	<div class="container-fluid">
		<div class="row">
			<div class="wrapper single big_data">
				<time-display></time-display>
				<ol class="breadcrumb">
					<li class="breadcrumb-item"><a href="#">DID Report</a></li>
					<li class="breadcrumb-item active">DID Report</li>
				</ol>
				<h1 class="page-header">DID Report</h1>
				<spinner v-show="loading" class="spinner"></spinner>
				<tabs @activateTab="changeTab">
					<tab label="Client Report" class="" icon="dnl_icon dnl_to_left" selected>
						<div class="advanced_search_filter_panel">
							<div class="row mar-bot">
							<div class="pad-5 pad-left pad-right col-lg-2 col-md-2 col-sm-4 mar-bot">
									<span>Time:</span>
									<select style="width: 70%!important;" class="selectable no-min-width" v-model="time_org">
									<option v-for="item in period_options" v-bind:value="item.id">
										{{ item.text }}
									</option>
								</select>
							</div>
							<div class="col-lg-3 col-md-4 col-sm-8 pad-left pad-5 pad-right mar-bot">
						<div class="col-md-6 col-sm-6 pad-left pad-right">
								<span>Period:</span>
								<el-date-picker style="width: 50%!important; min-width: 67%!important;" type="datetime" v-model="start_date" :picker-options="{}" placeholder="Enter Date/Time"></el-date-picker>
						</div>
						<div class="col-md-5 col-sm-4 text-center pad-left pad-right pad-5">
								<span class="tilda-center tilda">~</span>
							<div class="col-md-10 col-sm-10 pad-left pad-right">
								<el-date-picker style="width: 100%;" type="datetime" v-model="end_date" :picker-options="{}" placeholder="Enter Date/Time"></el-date-picker>
							</div>	
						</div>
						</div>
							<div class="col-lg-6 col-md-6 col-sm-12 mar-bot none-left-padding none-right-padding">
									<div class="mar-bot col-md-3 col-sm-3">
										<span>In</span>
											<select style="width: 80%!important;" class="selectable no-min-width" v-model="gmt_org">
											<option v-for="item in gmt_options" v-bind:value="item.id">
												{{ item.text }}
											</option>
										</select>
									</div>
									<div class="mar-bot col-md-3 col-sm-3">
										<select class="selectable no-min-width" v-model="by_hours_org">
											<option v-for="item in by_hour_options" v-bind:value="item.id">
												{{ item.text }}
											</option>
										</select>
									</div>
									<div class="mar-bot col-md-3 col-sm-3">
										<select2 :options="web_options" v-model="web_org">
											<option disabled value="0">Select one</option>
										</select2>
									</div>
								
									<div class="col-md-3 col-sm-3 m-top-query">
										<a class="btn btn-primary full-width m-top-20" v-on:click="searchReport('orig')">
											Search
										</a>
									</div>
								</div>
						</div>
						<div class="clearfix"></div>
						<div class="table-responsive">
							<table class="table table-striped table-hover carrier_groups centrum">
								<thead>
								<!--<tr>-->
								<!--<th v-for="column in orig_show_table_columns ">{{ column }}</th>-->
								<!--</tr>-->

								<tr>
									<th v-if="showcolumns[0]" rowspan="1" colspan="1">ASR</th>
									<th v-if="showcolumns[1]" rowspan="1" colspan="1">ACD</th>
									<th v-if="showcolumns[2]" rowspan="1" colspan="1">PDD</th>
									<th v-if="showcolumns[3]" rowspan="1" colspan="1">NPR Count</th>
									<th v-if="showcolumns[4]" rowspan="1" colspan="1">NPR</th>
									<th v-if="showcolumns[5]" rowspan="1" colspan="1">SD Count</th>
									<th v-if="showcolumns[6]" rowspan="1" colspan="1">SDP</th>
									<th v-if="showcolumns[7]" rowspan="1" colspan="2">Profit</th>
									<th v-if="showcolumns[8]" rowspan="1" colspan="1">Margin</th>
									<th v-if="showcolumns[9]" rowspan="1" colspan="1">PP Min</th>
									<th v-if="showcolumns[10]" rowspan="1" colspan="1">PP K Calls</th>
									<th v-if="showcolumns[11]" rowspan="1" colspan="1">PPKA</th>
									<th v-if="showcolumns[12]" rowspan="1" colspan="1">Total Duration</th>
									<th v-if="showcolumns[13]" rowspan="1" colspan="4">Total Billable Time</th>
									<th v-if="showcolumns[14]" rowspan="1" colspan="1">Inter Cost</th>
									<th v-if="showcolumns[15]" rowspan="1" colspan="2">Local Cost</th>
									<th v-if="showcolumns[16]" rowspan="1" colspan="1">IJ Cost</th>
									<th v-if="showcolumns[17]" rowspan="1" colspan="1">Total Calls</th>
									<th v-if="showcolumns[18]" rowspan="1" colspan="1">Not Zero Calls</th>
									<th v-if="showcolumns[19]" rowspan="1" colspan="4">Busy Calls</th>
								</tr>

								</thead>
								<tbody>
								<tr v-if="!originations.length">
									<td style="text-align: center" colspan="25">No Data Found</td>
								</tr>
								<tr v-for="report in originations">
									<td v-for="show_field in orig_selected_show_fields">{{ report[show_field] }}</td>
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
					</tab>
					<tab label="Vendor Report" class="" icon="dnl_icon dnl_to_left">
						<div class="advanced_search_filter_panel">
										<div class="row mar-bot">
							<div class="pad-5 pad-left pad-right col-lg-2 col-md-2 col-sm-4 mar-bot">
									<span>Time:</span>
									<select style="width: 70%!important;" class="selectable no-min-width" v-model="time_org">
									<option v-for="item in period_options" v-bind:value="item.id">
										{{ item.text }}
									</option>
								</select>
							</div>
							<div class="col-lg-3 col-md-4 col-sm-8 pad-left pad-5 pad-right mar-bot">
						<div class="col-md-6 col-sm-6 pad-left pad-right">
								<span>Period:</span>
								<el-date-picker style="width: 50%!important; min-width: 67%!important;" type="datetime" v-model="start_date" :picker-options="{}" placeholder="Enter Date/Time"></el-date-picker>
						</div>
						<div class="col-md-5 col-sm-4 text-center pad-left pad-right pad-5">
								<span class="tilda-center tilda">~</span>
							<div class="col-md-10 col-sm-10 pad-left pad-right">
								<el-date-picker style="width: 100%;" type="datetime" v-model="end_date" :picker-options="{}" placeholder="Enter Date/Time"></el-date-picker>
							</div>	
						</div>
						</div>
							<div class="col-lg-6 col-md-6 col-sm-12 mar-bot none-left-padding none-right-padding">
									<div class="mar-bot col-md-3 col-sm-3">
										<span>In</span>
											<select style="width: 80%!important;" class="selectable no-min-width" v-model="gmt_org">
											<option v-for="item in gmt_options" v-bind:value="item.id">
												{{ item.text }}
											</option>
										</select>
									</div>
									<div class="mar-bot col-md-3 col-sm-3">
										<select class="selectable no-min-width" v-model="by_hours_org">
											<option v-for="item in by_hour_options" v-bind:value="item.id">
												{{ item.text }}
											</option>
										</select>
									</div>
									<div class="mar-bot col-md-3 col-sm-3">
										<select2 :options="web_options" v-model="web_org">
											<option disabled value="0">Select one</option>
										</select2>
									</div>
								
									<div class="col-md-3 col-sm-3 m-top-query">
										<a class="btn btn-primary full-width m-top-20" v-on:click="searchReport('orig')">
											Search
										</a>
									</div>
								</div>
						</div>

						</div>
 						<div class="table-responsive">
							<table class="table table-striped table-hover carrier_groups centrum">
								<thead>
								<tr>
									<th rowspan="2" colspan="1" class="width-65"></th>
									<th rowspan="2" colspan="1">Carrier</th>
									<th rowspan="2" colspan="1">Date</th>
									<th rowspan="2" colspan="1">ABR</th>
									<th rowspan="2" colspan="1">ASR</th>
									<th rowspan="2" colspan="1">ACD</th>
									<th rowspan="2" colspan="1">ALOC</th>
									<th rowspan="2" colspan="1">PDD</th>
									<th rowspan="1" colspan="2">Time</th>
									<th rowspan="2" colspan="1">Total Cost</th>
									<th rowspan="2" colspan="1">Inter Cost</th>
									<th rowspan="2" colspan="1">Local Cost</th>
									<th rowspan="1" colspan="4">Calls</th>
								</tr>
								<tr>
									<th rowspan="1" colspan="1">Actual</th>
									<th rowspan="1" colspan="1">Billable</th>
									<th rowspan="1" colspan="1">Total</th>
									<th rowspan="1" colspan="1">Not Zero</th>
									<th rowspan="1" colspan="1">Success</th>
									<th rowspan="1" colspan="1">Busy</th>
								</tr>
								</thead>
								<tbody>
								<tr v-if="!terminations.length">
									<td style="text-align: center" colspan="25">No Data Found</td>
								</tr>
								<tr  v-for="report in terminations">
									<td><a class="toogler" @click="toggleTable($event)">+</a></td>
									<td>{{report.carrier}}</td>
									<td>{{report.count_number}}</td>
									<td>{{report.abr}}</td>
									<td>{{report.asr}}</td>
									<td>{{report.acd}}</td>
									<td>{{report.aloc}}</td>
									<td>{{report.pdd}}</td>
									<td>{{report.actual_time}}</td>
									<td>{{report.billable_time}}</td>
									<td>{{report.total_cost}}</td>
									<td>{{report.inter_cost}}</td>
									<td>{{report.local_cost}}</td>
									<td>{{report.total_calls}}</td>
									<td>{{report.not_zero_calls}}</td>
									<td>{{report.success_calls}}</td>
									<td>{{report.busy_calls}}</td>
								</tr>
								<!--<tr class="accordian-body collapse no_padding" v-for="count in report.counts">
                                    <td></td>
                                    <td>{{count.carrier}}</td>
                                    <td>{{count.date}}</td>
                                    <td>{{count.abr}}</td>
                                    <td>{{count.asr}}</td>
                                    <td>{{count.acd}}</td>
                                    <td>{{count.aloc}}</td>
                                    <td>{{count.pdd}}</td>
                                    <td>{{count.actual_time}}</td>
                                    <td>{{count.billable_time}}</td>
                                    <td>{{count.total_cost}}</td>
                                    <td>{{count.inter_cost}}</td>
                                    <td>{{count.local_cost}}</td>
                                    <td>{{count.total_calls}}</td>
                                    <td>{{count.not_zero_calls}}</td>
                                    <td>{{count.success_calls}}</td>
                                    <td>{{count.busy_calls}}</td>
                                </tr>-->
								</tbody>
							</table>
						</div>
						<div class="button_set">
							<a class="btn btn-primary mini">
								Submit
							</a>
							<a class="btn btn-default mini">
								Reset
							</a>
						</div>
					</tab>
				</tabs>
			</div>
		</div>
	</div>
</template>

<script>
    const vTabs = require('vue!../main_components/tabs.vue'),
        vTab = require('vue!../main_components/tab.vue'),
        vSpinner = require('vue!../main_components/fadeloader.vue'),
        vSelect = require('vue!../main_components/select.vue'),
        Pagination = require('vue!../main_components/pagination.vue');
    const api = require("../../api");
    const	auth = require("../../auth");
    module.exports = {
        created: function(){
            // this.getToken();
            this.orig_selected_show_fields = this.backup_orig_selected_show_fields.slice(0);
            this.term_selected_show_fields = this.backup_term_selected_show_fields.slice(0);
            this.fetchRelatedTrunks('egress');
            this.fetchRelatedTrunks('ingress');
            this.searchReport('orig');
            // this.fetchCarriers().then(() => {
            // }).catch(error => {
            //     console.log(error);
            // });

//			 this.fetchRateTable();
//			 this.fetchRoutePlans();

        },
        components: {
            'tabs': vTabs,
            'tab': vTab,
            'select2': vSelect,
            'spinner': vSpinner,
            'pagination': Pagination
        },
        data: function(){
            return {
                codes_org: [],
                codes_term: [],
                time_term_cascade: 'Today',
                time_term: 'Today',
                time_org_cascade: 'Today',
                pageOne: {
                    currentPage: 1,
                    totalPages: 10,
                    cntpage: 10
                },
                pageOne_term: {
                    currentPage: 1,
                    totalPages: 10,
                    cntpage: 10
                },
                route_types: [
                    { id: 1, text: 'Fail to Next Host' },
                    { id: 2, text: 'Fail to Next Trunk' },
                    { id: 3, text: 'Stop' },
                ],
                more_advanced_option: true,
                more_advanced_option_button: "Less Options",
                loading: false,
                period: '',
                carriers: '',
                start_date_org: '',
                end_date_org: '',
                start_date_org_cascade: '',
                end_date_org_cascade: '',
                start_date_term: '',
                end_date_term: '',
                start_date_term_cascade: '',
                end_date_term_cascade: '',
                ingress_trunk_org: '',
                egress_trunk_org: '',
                ingress_trunk_term: '',
                egress_trunk_term: '',
                carrier_options: [],
                ingress_trunk_options_org: [],
                egress_trunk_options_org: [],
                ingress_trunk_options_term: [],
                egress_trunk_options_term: [],
                egress_carrier_org: '',
                ingress_carrier_org: '',
                egress_carrier_term: '',
                ingress_carrier_term: '',
                web_org: 'web',
                web_term: 'web',
                web_options: [
                    { id: 'web', text: 'Web' },
                    { id: 'excel_csv', text: 'Excel CSV' },
                    { id: 'email_when_done', text: 'Email when done' },
                    { id: 'export_from_storage', text: 'Export from Storage' },
                ],
                time_org: 'Today',
                period_options: [
                    {id: 'Custom', text: 'Custom'},
                    {id: 'Today', text: 'Today'},
                    {id: 'Yesterday', text: 'Yesterday'},
                    {id: 'Current week', text: 'Current week'},
                    {id: 'Previous week', text: 'Previous week'},
                    {id: 'Current month', text: 'Current month'},
                    {id: 'Previous month', text: 'Previous month'},
                ],
                gmt_org: 13,
                gmt_term: 13,
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
                by_hours_org: 1,
                by_hours_term: 1,
                by_hour_options: [
                    { id: 1, text: 'All Time', value: 0 },
                    { id: 2, text: 'By hours', value: 60 },
                    { id: 3, text: 'By day', value: 1440 },
                    { id: 4, text: 'By month', value: 43200 },
                    { id: 5, text: 'By year', value: 525600 },
                ],
                plan_table_columns: ['ASR', 'ACD', 'PDD', 'NPR Count', 'NPR', 'NRF Count', 'NRF', 'SD Count', 'SDP', 'Revenue', 'Profit',
                    'Margin', 'PP Min', 'PP K Calls', 'PPKA', 'Limited', 'Total Duration', 'Total Billable Time', 'Total Cost',
                    'Inter Cost', 'Intra Cost', 'Local Cost', 'IJ Cost', 'Average Rate', 'Total Calls', 'Not Zero Calls', 'Busy Calls'],
                orig_show_table_fields : '',
                orig_show_table_columns: [],
                backup_orig_selected_show_fields: ['asr', 'acd', 'pdd', 'npr_calls', 'npr', 'non_zero_calls_6', 'sdp', 'profit', 'margin', 'pp_min', 'pp_k_calls', 'ppka', 'ingress_time', 'ingress_billed_time', 'ingress_cost', 'ingress_call_cost_inter', 'ingress_call_cost_intra'
                    , 'ingress_call_cost_local', 'ingress_call_cost_ij', 'average_rate', 'ingress_calls', 'non_zero_calls', 'ingress_busy_calls'],
                orig_selected_show_fields:[],
                orgination_search_field: ['pdd', 'npr_calls', 'non_zero_calls_6', 'ingress_time', 'ingress_billed_time', 'ingress_cost', 'ingress_call_cost_inter', 'ingress_call_cost_intra'
                    , 'ingress_call_cost_local', 'ingress_call_cost_ij', 'ingress_calls', 'non_zero_calls', 'ingress_busy_calls', 'egress_cost'],
                orig_show_field_options: [
                    { id: 1, value: 'asr', text: 'ASR' },  //calc
                    { id: 2, value: 'acd', text: 'ACD' },  //calc
                    { id: 3, value: 'pdd', text: 'PDD' },
                    { id: 4, value: 'npr_calls', text: 'NPR Count' },
                    { id: 5, value: 'npr', text: 'NPR' },			//calc
                    { id: 8, value: 'non_zero_calls_6', text: 'SD Count' },
                    { id: 9, value: 'sdp', text: 'SDP' },			//calc
                    { id: 11, value: 'profit', text: 'Profit' },  	//calc
                    { id: 12, value: 'margin', text: 'Margin' },		//calc
                    { id: 13, value: 'pp_min', text: 'PP Min' },		//calc
                    { id: 14, value: 'pp_k_calls', text: 'PP K Calls' },	//calc
                    { id: 15, value: 'ppka', text: 'PPKA' },				//calc
                    { id: 17, value: 'ingress_time', text: 'Total Duration' },
                    { id: 18, value: 'ingress_billed_time', text: 'Total Billable Time' },
                    { id: 19, value: 'ingress_cost', text: 'Total Cost' },
                    { id: 20, value: 'ingress_call_cost_inter', text: 'Inter Cost' },
                    { id: 21, value: 'ingress_call_cost_intra', text: 'Intra Cost' },
                    { id: 22, value: 'ingress_call_cost_local', text: 'Local Cost' },
                    { id: 23, value: 'ingress_call_cost_ij', text: 'IJ Cost' },
                    { id: 24, value: 'average_rate', text: 'Average Rate' },		//calc
                    { id: 25, value: 'ingress_calls', text: 'Total Calls' },
                    { id: 26, value: 'non_zero_calls', text: 'Not Zero Calls' },
                    { id: 27, value: 'ingress_busy_calls', text: 'Busy Calls' },
                ],
                showcolumns:[true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],
                calc_fields: ['asr', 'acd', 'npr', 'sdp', 'profit', 'margin', 'pp_min', 'pp_k_calls', 'ppka', 'average_rate'],
                term_show_table_columns: [],
                term_show_table_fields : '',
                backup_term_selected_show_fields: ['asr', 'acd', 'pdd', 'npr_calls', 'npr', 'non_zero_calls_6', 'sdp', 'profit', 'margin', 'pp_min', 'pp_k_calls', 'ppka', 'egress_time', 'egress_billed_time', 'egress_cost', 'egress_call_cost_inter', 'egress_call_cost_intra'
                    , 'egress_call_cost_local', 'egress_call_cost_ij', 'average_rate', 'egress_calls', 'non_zero_calls', 'egress_busy_calls'],
                termination_search_field: ['pdd', 'npr_calls', 'non_zero_calls_6', 'egress_time', 'egress_billed_time', 'egress_cost', 'egress_call_cost_inter', 'egress_call_cost_intra'
                    , 'egress_call_cost_local', 'egress_call_cost_ij', 'egress_calls', 'non_zero_calls', 'egress_busy_calls', 'ingress_cost'],
                term_selected_show_fields: [],
                term_show_field_options: [
                    { id: 1, value: 'asr', text: 'ASR' },
                    { id: 2, value: 'acd', text: 'ACD' },
                    { id: 3, value: 'pdd', text: 'PDD' },
                    { id: 4, value: 'non_zero_calls_6', text: 'SD Count' },
                    { id: 5, value: 'sdp', text: 'SDP' },
                    { id: 7, value: 'profit', text: 'Profit' },
                    { id: 8, value: 'margin', text: 'Margin' },
                    { id: 9, value: 'pp_min', text: 'PP Min' },
                    { id: 10, value: 'pp_k_calls', text: 'PP K Calls' },
                    { id: 11, value: 'ppka', text: 'PPKA' },
                    { id: 13, value: 'egress_time', text: 'Total Duration' },
                    { id: 14, value: 'egress_billed_time', text: 'Total Billable Time' },
                    { id: 15, value: 'egress_cost', text: 'Total Cost' },
                    { id: 16, value: 'egress_call_cost_inter', text: 'Inter Cost' },
                    { id: 17, value: 'egress_call_cost_intra', text: 'Intra Cost' },
                    { id: 18, value: 'egress_call_cost_local', text: 'Local Cost' },
                    { id: 19, value: 'egress_call_cost_ij', text: 'IJ Cost' },
                    { id: 20, value: 'average_rate', text: 'Average Rate' },
                    { id: 21, value: 'egress_calls', text: 'Total Calls' },
                    { id: 22, value: 'non_zero_calls', text: 'Not Zero Calls' },
                    { id: 23, value: 'egress_busy_calls', text: 'Busy Calls' },
                ],
                group_by1: '',
                group_by2: '',
                group_by3: '',
                group_by4: '',
                group_by5: '',
                group_options: [
                    { id: 1, value: 'orig_code', text: 'Orig Code' },
                    { id: 2, value: 'ingress_id', text: 'Ingress ID' },
                    { id: 3, value: 'egress_id', text: 'Egress ID' },
                    { id: 4, value: 'source_number', text: 'ANI' },
                    { id: 5, value: 'dest_number', text: 'DNIS' },
                ],
                page_row_count: 1,
                page_row_count_term: 1,
                page_rows: [
                    { id: 1, text: '10' },
                    { id: 2, text: '20' },
                    { id: 3, text: '30' },
                    { id: 4, text: '50' },
                    { id: 5, text: '100' }
                ],
                route_plan_options: [],
                rate_table_options: [],
                rate_display_options: [
                    { id: 1, text: 'Average' },
                    { id: 2, text: 'Actual' },
                ],
                tech_prefix: 'All',
                tech_prefix_options: [
                    { id: 'All', text: 'All' },
                ],
                country_org: '',
                country_term: '',
                ani_org: '',
                dnis_org: '',
                ani_term: '',
                dnis_term: '',

                switch_server: '',
                selected1: '',
                selected2: '',

                reports: [],
                origination_codes: [],
                termination_codes: [],
                backupDatas: [],
                originations: [],
                terminations: [],
                active_tab_index: 0,
                active_tab_name: "Origination",

                // token: 'Token Yuza2L2rlGkdemBeYzL0SVncFafTjYNFSMpShsJT614inGMLDf',
            }
        },
        updated: function () {
            var elementList = document.querySelectorAll('.el-select > .el-input > input');
            for (var index = 0; index < elementList.length; index++) {
                elementList[index].placeholder = 'Show/Hide Columns';
            }
        },
        watch: {
            'time_term_cascade': function() {
                if(this.time_term_cascade == 'Custom')
                {
                    this.start_date_term_cascade == ""
                    this.end_date_term_cascade == ""
                } else if(this.time_term_cascade == 'Today')
                {
                    this.start_date_term_cascade = getStartTimeOfToday();
                    this.end_date_term_cascade = getEndTimeOfToday();
                } else if(this.time_term_cascade == 'Yesterday')
                {
                    this.start_date_term_cascade = getStartTimeOfYesterday();
                    this.end_date_term_cascade = getEndTimeOfYesterday();
                } else if(this.time_term_cascade == 'Current week')
                {
                    this.start_date_term_cascade = getStartTimeOfCurrentWeek();
                    this.end_date_term_cascade = getEndTimeOfCurrentWeek();
                } else if(this.time_term_cascade == 'Previous week')
                {
                    this.start_date_term_cascade = getStartTimeOfPreviousWeek();
                    this.end_date_term_cascade = getEndTimeOfPreviousWeek();
                } else if(this.time_term_cascade == 'Current month')
                {
                    this.start_date_term_cascade = getStartTimeOfCurrentMonth();
                    this.end_date_term_cascade = getEndTimeOfCurrentMonth();
                } else if(this.time_term_cascade == 'Previous month')
                {
                    this.start_date_term_cascade = getStartTimeOfPreviousMonth();
                    this.end_date_term_cascade = getEndTimeOfPreviousMonth();
                }
            },
            'time_term': function() {
                if(this.time_term == 'Custom')
                {
                    this.start_date_term == ""
                    this.end_date_term == ""
                } else if(this.time_term == 'Today')
                {
                    this.start_date_term = getStartTimeOfToday();
                    this.end_date_term = getEndTimeOfToday();
                } else if(this.time_term == 'Yesterday')
                {
                    this.start_date_term = getStartTimeOfYesterday();
                    this.end_date_term = getEndTimeOfYesterday();
                } else if(this.time_term == 'Current week')
                {
                    this.start_date_term = getStartTimeOfCurrentWeek();
                    this.end_date_term = getEndTimeOfCurrentWeek();
                } else if(this.time_term == 'Previous week')
                {
                    this.start_date_term = getStartTimeOfPreviousWeek();
                    this.end_date_term = getEndTimeOfPreviousWeek();
                } else if(this.time_term == 'Current month')
                {
                    this.start_date_term = getStartTimeOfCurrentMonth();
                    this.end_date_term = getEndTimeOfCurrentMonth();
                } else if(this.time_term == 'Previous month')
                {
                    this.start_date_term = getStartTimeOfPreviousMonth();
                    this.end_date_term = getEndTimeOfPreviousMonth();
                }
            },
            'time_org_cascade': function() {
                if(this.time_org_cascade == 'Custom')
                {
                    this.start_date_org_cascade == ""
                    this.end_date_org_cascade == ""
                } else if(this.time_org_cascade == 'Today')
                {
                    this.start_date_org_cascade = getStartTimeOfToday();
                    this.end_date_org_cascade = getEndTimeOfToday();
                } else if(this.time_org_cascade == 'Yesterday')
                {
                    this.start_date_org_cascade = getStartTimeOfYesterday();
                    this.end_date_org_cascade = getEndTimeOfYesterday();
                } else if(this.time_org_cascade == 'Current week')
                {
                    this.start_date_org_cascade = getStartTimeOfCurrentWeek();
                    this.end_date_org_cascade = getEndTimeOfCurrentWeek();
                } else if(this.time_org_cascade == 'Previous week')
                {
                    this.start_date_org_cascade = getStartTimeOfPreviousWeek();
                    this.end_date_org_cascade = getEndTimeOfPreviousWeek();
                } else if(this.time_org_cascade == 'Current month')
                {
                    this.start_date_org_cascade = getStartTimeOfCurrentMonth();
                    this.end_date_org_cascade = getEndTimeOfCurrentMonth();
                } else if(this.time_org_cascade == 'Previous month')
                {
                    this.start_date_org_cascade = getStartTimeOfPreviousMonth();
                    this.end_date_org_cascade = getEndTimeOfPreviousMonth();
                }
            },
            'time_org': function() {
                if(this.time_org == 'Custom')
                {
                    this.start_date_org == ""
                    this.end_date_org == ""
                } else if(this.time_org == 'Today')
                {
                    this.start_date_org = getStartTimeOfToday();
                    this.end_date_org = getEndTimeOfToday();
                } else if(this.time_org == 'Yesterday')
                {
                    this.start_date_org = getStartTimeOfYesterday();
                    this.end_date_org = getEndTimeOfYesterday();
                } else if(this.time_org == 'Current week')
                {
                    this.start_date_org = getStartTimeOfCurrentWeek();
                    this.end_date_org = getEndTimeOfCurrentWeek();
                } else if(this.time_org == 'Previous week')
                {
                    this.start_date_org = getStartTimeOfPreviousWeek();
                    this.end_date_org = getEndTimeOfPreviousWeek();
                } else if(this.time_org == 'Current month')
                {
                    this.start_date_org = getStartTimeOfCurrentMonth();
                    this.end_date_org = getEndTimeOfCurrentMonth();
                } else if(this.time_org == 'Previous month')
                {
                    this.start_date_org = getStartTimeOfPreviousMonth();
                    this.end_date_org = getEndTimeOfPreviousMonth();
                }
            }
        },
        methods: {
            fetchCodes(country) {
                var per_page=1;
                var url = api.getEndpointUrl() + "/v1/switch/code/list?per_page="+per_page+"&country=" + country
                this.loading = true;

                return new Promise((resolve, reject) => {
                    this.$http.get(url)
                        .then(response => {
                            const body = response.body
                            if (body.success) {
                                var codes = body.payload.items
                                this.loading = false;
                                per_page = body.payload.total;

                                url = api.getEndpointUrl() + "/v1/switch/code/list?per_page="+per_page+"&country=" + country
                                this.loading = true;
                                this.$http.get(url)
                                    .then(response => {
                                        const body = response.body
                                        if (body.success) {
                                            if(this.active_tab_index == 0)
                                                this.codes_org = body.payload.items
                                            else if(this.active_tab_index == 2)
                                                this.codes_term = body.payload.items
                                        }
                                        this.loading = false;
                                        resolve();
                                    })
                                    .catch(error => {
                                        console.log(error);
                                        this.loading = false;
                                        reject(error);
                                    })
                            }
                        })
                        .catch(error => {
                            console.log(error);
                            this.loading = false;
                            reject(error);
                        })
                });
            },
            searchCascadeReport(type) {
                var start_time, end_time;
                if(type == 'orig') {
                    if(this.start_date_org_cascade == ""){
                        start_time = new Date();
                    }
                    else{
                        start_time = new Date(this.start_date_org_cascade);
                    }

                    if(this.end_date_org_cascade == ""){
                        end_time = new Date();
                    }
                    else{
                        end_time = new Date(this.end_date_org_cascade);
                    }
                }
                else if(type == 'term') {
                    if(this.start_date_term_cascade == ""){
                        start_time = new Date();
                    }
                    else{
                        start_time = new Date(this.start_date_term_cascade);
                    }

                    if(this.end_date_term_cascade == ""){
                        end_time = new Date();
                    }
                    else{
                        end_time = new Date(this.end_date_term_cascade);
                    }
                }

                start_time = new Date(start_time + " GMT").getTime() / 1000;
                end_time = new Date(end_time + " GMT").getTime() / 1000;

                this.fetchReport(start_time, end_time);
            },
            toggleTable(event) {
                var element = event.currentTarget;
                $(element).parents('tr').siblings('.collapse').toggleClass('in');
                $(element).html( $(element).html() == "-" ? "+" : "-");
            },
            handleChange() {
                if (_.indexOf(this.plan_table_columns, 'ASR') != -1) {
                    Vue.set(this.showcolumns, 0, true);
                } else {
                    Vue.set(this.showcolumns, 0, false);
                }
                if (_.indexOf(this.plan_table_columns, 'ACD') != -1) {
                    Vue.set(this.showcolumns, 1, true);
                } else {
                    Vue.set(this.showcolumns, 1, false);
                }
                if (_.indexOf(this.plan_table_columns, 'PDD') != -1) {
                    Vue.set(this.showcolumns, 2, true);
                } else {
                    Vue.set(this.showcolumns, 2, false);
                }
                if (_.indexOf(this.plan_table_columns, 'NPR Count') != -1) {
                    Vue.set(this.showcolumns, 3, true);
                } else {
                    Vue.set(this.showcolumns, 3, false);
                }
                if (_.indexOf(this.plan_table_columns, 'NPR') != -1) {
                    Vue.set(this.showcolumns, 4, true);
                } else {
                    Vue.set(this.showcolumns, 4, false);
                }
                if (_.indexOf(this.plan_table_columns, 'NRF Count') != -1) {
                    Vue.set(this.showcolumns, 5, true);
                } else {
                    Vue.set(this.showcolumns, 5, false);
                }
                if (_.indexOf(this.plan_table_columns, 'NRF') != -1) {
                    Vue.set(this.showcolumns, 6, true);
                } else {
                    Vue.set(this.showcolumns, 6, false);
                }
                if (_.indexOf(this.plan_table_columns, 'SD Count') != -1) {
                    Vue.set(this.showcolumns, 7, true);
                } else {
                    Vue.set(this.showcolumns, 7, false);
                }
                if (_.indexOf(this.plan_table_columns, 'SDP') != -1) {
                    Vue.set(this.showcolumns, 7, true);
                } else {
                    Vue.set(this.showcolumns, 7, false);
                }
                if (_.indexOf(this.plan_table_columns, 'Revenue') != -1) {
                    Vue.set(this.showcolumns, 7, true);
                } else {
                    Vue.set(this.showcolumns, 7, false);
                }
                if (_.indexOf(this.plan_table_columns, 'Profit') != -1) {
                    Vue.set(this.showcolumns, 7, true);
                } else {
                    Vue.set(this.showcolumns, 7, false);
                }
                if (_.indexOf(this.plan_table_columns, 'Margin') != -1) {
                    Vue.set(this.showcolumns, 7, true);
                } else {
                    Vue.set(this.showcolumns, 7, false);
                }
                if (_.indexOf(this.plan_table_columns, 'PP Min') != -1) {
                    Vue.set(this.showcolumns, 7, true);
                } else {
                    Vue.set(this.showcolumns, 7, false);
                }
                if (_.indexOf(this.plan_table_columns, 'PP K Calls') != -1) {
                    Vue.set(this.showcolumns, 7, true);
                } else {
                    Vue.set(this.showcolumns, 7, false);
                }
                if (_.indexOf(this.plan_table_columns, 'PPKA') != -1) {
                    Vue.set(this.showcolumns, 7, true);
                } else {
                    Vue.set(this.showcolumns, 7, false);
                }
                if (_.indexOf(this.plan_table_columns, 'PPKA') != -1) {
                    Vue.set(this.showcolumns, 7, true);
                } else {
                    Vue.set(this.showcolumns, 7, false);
                }
                if (_.indexOf(this.plan_table_columns, 'Limited') != -1) {
                    Vue.set(this.showcolumns, 7, true);
                } else {
                    Vue.set(this.showcolumns, 7, false);
                }
                if (_.indexOf(this.plan_table_columns, 'Total Duration') != -1) {
                    Vue.set(this.showcolumns, 7, true);
                } else {
                    Vue.set(this.showcolumns, 7, false);
                }
                if (_.indexOf(this.plan_table_columns, 'Total Billable Time') != -1) {
                    Vue.set(this.showcolumns, 7, true);
                } else {
                    Vue.set(this.showcolumns, 7, false);
                }
                if (_.indexOf(this.plan_table_columns, 'Total Cost') != -1) {
                    Vue.set(this.showcolumns, 7, true);
                } else {
                    Vue.set(this.showcolumns, 7, false);
                }
                if (_.indexOf(this.plan_table_columns, 'Inter Cost') != -1) {
                    Vue.set(this.showcolumns, 7, true);
                } else {
                    Vue.set(this.showcolumns, 7, false);
                }
                if (_.indexOf(this.plan_table_columns, 'Intra Cost') != -1) {
                    Vue.set(this.showcolumns, 7, true);
                } else {
                    Vue.set(this.showcolumns, 7, false);
                }
                if (_.indexOf(this.plan_table_columns, 'IJ Cost') != -1) {
                    Vue.set(this.showcolumns, 7, true);
                } else {
                    Vue.set(this.showcolumns, 7, false);
                }
                if (_.indexOf(this.plan_table_columns, 'Average Rate') != -1) {
                    Vue.set(this.showcolumns, 7, true);
                } else {
                    Vue.set(this.showcolumns, 7, false);
                }
                if (_.indexOf(this.plan_table_columns, 'Total Calls') != -1) {
                    Vue.set(this.showcolumns, 7, true);
                } else {
                    Vue.set(this.showcolumns, 7, false);
                }
                if (_.indexOf(this.plan_table_columns, 'Not Zero Calls') != -1) {
                    Vue.set(this.showcolumns, 7, true);
                } else {
                    Vue.set(this.showcolumns, 7, false);
                }
                if (_.indexOf(this.plan_table_columns, 'Busy Calls') != -1) {
                    Vue.set(this.showcolumns, 7, true);
                } else {
                    Vue.set(this.showcolumns, 7, false);
                }
            },

            changePageCount (countPerPage) {
                if (countPerPage !== this.pageOne.cntpage) {
                    this.pageOne.cntpage = countPerPage
                    this.$nextTick(this.searchReport, 'orig')
                }
            },
            pageOneChanged (pageNum) {
                this.pageOne.currentPage = pageNum
            },
            changePageCount_term (countPerPage) {
                if (countPerPage !== this.pageOne_term.cntpage) {
                    this.pageOne_term.cntpage = countPerPage
                    this.$nextTick(this.searchReport, 'term')
                }
            },
            pageOneChanged_term (pageNum) {
                this.pageOne_term.currentPage = pageNum
            },
            changeTab (tab, index) {
                if (this.active_tab_index === index) { return }
                this.active_tab_index = index
                this.active_tab_name = tab.name;
                this.more_advanced_option = true,
                    this.more_advanced_option_button = "Less Options";
                // this.gmt = 13;
                // this.time = "Custom";
                // this.by_hours = 1;
                // this.ani = "";
                // this.dnis = "";
                // this.country = "";
                this.group_by1 = '';
                this.group_by2 = '';
                this.group_by3 = '';
                this.group_by4 = '';
                this.group_by5 = '';
                // if(this.active_tab_index == 0 || this.active_tab_index == 2){
                // 	if(this.active_tab_index == 0)
                // 		this.searchReport('orig');
                // 	else
                // 		this.searchReport('term');
                // }
                // else if(this.active_tab_index == 1 || this.active_tab_index == 3){
                // 	if(this.active_tab_index == 1)
                // 		this.searchCascadeReport('orig');
                // 	else
                // 		this.searchCascadeReport('term');
                // }
            },
            showAdvanced(){
                if(this.more_advanced_option)
                {
                    this.more_advanced_option = false;
                    this.more_advanced_option_button = "More Options";
                }
                else
                {
                    this.more_advanced_option = true;
                    this.more_advanced_option_button = "Less Options";
                }
            },
            calcValue: function(first, second, percent = 100) {
                var value = 0;
                if(second == 0 || second == "") value = 0;
                else value = first * percent / second;
                if(isNaN(value)) value = 0;
                else value = parseFloat(Math.round(value * 100) / 100).toFixed(2);
                return value;
            },
            makeDatas: function() {
                if(this.backupDatas.length == 0) return;
                var displayArray = new Array();

                for(var i = 0; i < this.backupDatas.length - 1; i++)
                {
                    var value = new Array();
                    value["group_time"] = formatDateFromStamp(this.backupDatas[i]['time']);
                    for(var j = 0; j < this.orgination_search_field.length; j++)
                    {
                        if(this.active_tab_index == 0 || this.active_tab_index == 1)
                            value[this.orgination_search_field[j]] = this.backupDatas[i][this.orgination_search_field[j]];
                        else
                            value[this.termination_search_field[j]] = this.backupDatas[i][this.termination_search_field[j]];

                    }
                    if(this.active_tab_index == 0 || this.active_tab_index == 1)
                    {
                        value["asr"] = this.calcValue(value["non_zero_calls"], value["ingress_calls"]) + "%";
                        value["acd"] = this.calcValue(value["ingress_time"], value["non_zero_calls"], 1);
                        value["npr"] = this.calcValue(value["npr_calls"], value["ingress_calls"]) + "%";
                        value["nrf"] = this.calcValue(value["nrf_calls"], value["ingress_calls"]) + "%";
                        value["sdp"] = this.calcValue(value["non_zero_calls_6"], value["non_zero_calls"]) + "%";
                        value["profit"] = value["ingress_cost"] - value["egress_cost"];
                        value["margin"] = this.calcValue(value["profit"], value["egress_cost"]);
                        value["pp_min"] = this.calcValue(value["profit"], value["ingress_time"], 1);
                        value["pp_k_calls"] = this.calcValue(value["profit"], value["ingress_calls"], 1000);
                        value["ppka"] = this.calcValue(value["profit"], value["non_zero_calls"], 1000);
                        value["average_rate"] = this.calcValue(value["ingress_cost"], value["ingress_billed_time"], 1000);
                    }
                    else
                    {
                        value["asr"] = this.calcValue(value["non_zero_calls"], value["egress_calls"]) + "%";
                        value["acd"] = this.calcValue(value["egress_time"], value["non_zero_calls"], 1);
                        value["npr"] = this.calcValue(value["npr_calls"], value["egress_calls"]) + "%";
                        value["nrf"] = this.calcValue(value["nrf_calls"], value["egress_calls"]) + "%";
                        value["sdp"] = this.calcValue(value["non_zero_calls_6"], value["non_zero_calls"]) + "%";
                        value["profit"] = value["ingress_cost"] - value["egress_cost"];
                        value["margin"] = this.calcValue(value["profit"], value["egress_cost"]);
                        value["pp_min"] = this.calcValue(value["profit"], value["egress_time"], 1);
                        value["pp_k_calls"] = this.calcValue(value["profit"], value["egress_calls"], 1000);
                        value["ppka"] = this.calcValue(value["profit"], value["non_zero_calls"], 1000);
                        value["average_rate"] = this.calcValue(value["egress_cost"], value["egress_billed_time"], 1000);
                    }
                    displayArray[i] = value;
                }
                if(this.active_tab_index == 0)
                    this.originations = displayArray;
                else
                    this.terminations = displayArray;
                this.loading = false;
            },
            fetchReport: function(start_time, end_time, step = 0, filterURL='', method = 'total') {
                this.loading = true;

                var page = this.pageOne.currentPage - 1;
                var per_page = this.pageOne.cntpage;
                var strURL;

                var fields = '';
                var selected_show_fields;
                if(this.active_tab_index == 0) {
                    selected_show_fields = this.orig_selected_show_fields;
                    fields = "egress_cost,"
                }
                else if(this.active_tab_index == 1) {
                    selected_show_fields = this.orgination_search_field;
                }
                else if(this.active_tab_index == 2) {
                    selected_show_fields = this.term_selected_show_fields;
                    fields = "ingress_cost,"
                }
                else if(this.active_tab_index == 3) {
                    selected_show_fields = this.termination_search_field;
                }

                var skip = false;
                var thisvm = this;
                selected_show_fields.forEach(function (field, i) {
                    skip = false;

                    for(var j = 0; j < thisvm.calc_fields.length; j++) {
                        if (thisvm.calc_fields[j] == field) {
                            skip = true;
                            break;
                        }
                    }

                    if (!skip)
                        fields += field + ",";
                });
                if (fields.length > 0)
                    fields = fields.substr(0, fields.length - 1);

                if(this.active_tab_index == 0 || this.active_tab_index == 2)
                //strURL = api.getReport_URL() + "?start_time=" + start_time + "&end_time=" + end_time + "&step=" + step + "&method=" + method + "&field=" + fields + '&human_readable';
                    strURL = api.getReport_URL() + "?start_time=" + start_time + "&end_time=" + end_time + "&step=" + step + "&method=" + method + "&field=" + fields;
                else
                //strURL = api.getReport_URL() + "?start_time=" + start_time + "&end_time=" + end_time + "&step=1440&method=" + method + "&field=" + fields + '&human_readable';
                    strURL = api.getReport_URL() + "?start_time=" + start_time + "&end_time=" + end_time + "&step=1440&method=" + method + "&field=" + fields;
                strURL += filterURL;

                this.$http.get(strURL)
                    .then(function(response) {
                        this.backupDatas = response.body.data;
                        this.makeDatas();
                    }, function(error) {
                        this.loading = false;
                        console.log(error);
                    });
            },
            searchReport: function(type){
                var start_time, end_time, step, by_hours;
                if(type == 'orig') {
                    if(this.start_date_org == ""){
                        start_time = new Date();
                    }
                    else{
                        start_time = new Date(this.start_date_org);
                    }

                    if(this.end_date_org == ""){
                        end_time = new Date();
                    }
                    else{
                        end_time = new Date(this.end_date_org);
                    }
                    by_hours = this.by_hours_org;
                }
                else if(type == 'term') {
                    if(this.start_date_term == ""){
                        start_time = new Date();
                    }
                    else{
                        start_time = new Date(this.start_date_term);
                    }

                    if(this.end_date_term == ""){
                        end_time = new Date();
                    }
                    else{
                        end_time = new Date(this.end_date_term);
                    }
                    by_hours = this.by_hours_term;
                }

                start_time = new Date(start_time + " GMT").getTime() / 1000;
                end_time = new Date(end_time + " GMT").getTime() / 1000;

                if(by_hours == 1)
                {
                    var diffMs = (end_time - start_time) * 1000;
                    var diffDays = Math.floor(diffMs / 86400000); // days
                    var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
                    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
                    step = diffDays * 1440 + diffHrs * 60;
                    if(diffMins % 60 == 0)
                        step += diffMins;
                    else{
                        diffMins = diffMins - (diffMins % 60);
                    }
                }
                else
                    step = this.by_hour_options[by_hours - 1].value;


                this.makeColumns(this.active_tab_index);
                this.makeURL().then(filterURL => {
                    this.originations = [];
                    this.terminations = [];
                    if(step != 0)
                        this.fetchReport(start_time, end_time, step, filterURL);
                }).catch(error => {
                    console.log(error);
                });
            },
            makeURL: function(){
                var filterURL = '';
                var ingress_carrier, ingress_trunk, ani, dnis, egress_carrier, egress_trunk, country;
                var ingress_trunk_options, egress_trunk_options;
                if(this.active_tab_index == 0) {
                    ingress_carrier = this.ingress_carrier_org;
                    ingress_trunk = this.ingress_trunk_org;
                    ingress_trunk_options = this.ingress_trunk_options_org;
                    ani = this.ani_org;
                    dnis = this.dnis_org;
                    egress_carrier = this.egress_carrier_org;
                    egress_trunk = this.egress_trunk_org;
                    egress_trunk_options = this.egress_trunk_options_org;
                    country = this.country_org;
                }
                else if(this.active_tab_index == 2) {
                    ingress_carrier = this.ingress_carrier_term;
                    ingress_trunk = this.ingress_trunk_term;
                    ingress_trunk_options = this.ingress_trunk_options_term
                    ani = this.ani_term;
                    dnis = this.dnis_term;
                    egress_carrier = this.egress_carrier_term;
                    egress_trunk = this.egress_trunk_term;
                    egress_trunk_options = this.egress_trunk_options_term;
                    country = this.country_term;
                }
                if(ingress_carrier != undefined && ingress_carrier != '')
                {
                    if(ingress_trunk != undefined && ingress_trunk != '')
                    {
                        filterURL += "&ingress_id=" + ingress_trunk;
                    }
                    else if(ingress_trunk_options.length != 0)
                    {
                        var ingress_ids = '';
                        ingress_trunk_options.forEach(function (ingress, i) {
                            ingress_ids += ingress.id + ",";
                        });
                        if (ingress_ids.length > 0)
                            ingress_ids = ingress_ids.substr(0, ingress_ids.length - 1);
                        filterURL += "&ingress_id=" + ingress_ids;
                    }
                }
                if(ani != '')
                    filterURL += "&source_number=" + ani;
                if(dnis != '')
                    filterURL += "&dest_number=" + dnis;
                if(egress_carrier != undefined && egress_carrier != '')
                {
                    if(egress_trunk != undefined && egress_trunk != '')
                    {
                        filterURL += "&egress_id=" + egress_trunk;
                    }
                    else if(egress_trunk_options.length != 0)
                    {
                        var egress_ids = '';
                        egress_trunk_options.forEach(function (egress, i) {
                            egress_ids += egress.id + ",";
                        });
                        if (egress_ids.length > 0) {
                            egress_ids = egress_ids.substr(0, egress_ids.length - 1);
                            filterURL += "&egress_id=" + egress_ids;
                        }
                    }
                }

                var group_bys = '';
                if (this.group_by1 != '')
                    group_bys += this.group_by1 + ',';
                if (this.group_by2 != '')
                    group_bys += this.group_by2 + ',';
                if (this.group_by3 != '')
                    group_bys += this.group_by3 + ',';
                if (this.group_by4 != '')
                    group_bys += this.group_by4 + ',';
                if (this.group_by5 != '')
                    group_bys += this.group_by5 + ',';

                if (group_bys.length > 0) {
                    group_bys = group_bys.substr(0, group_bys.length - 1);
                    filterURL += "&group=" + group_bys;
                }

                return new Promise((resolve, reject) => {
                    let promise;
                    var codes_options;
                    if(this.active_tab_index == 0) {
                        this.codes_org = [];
                    }
                    else if(this.active_tab_index == 2) {
                        this.codes_term = [];
                    }
                    if(this.active_tab_index == 0 || this.active_tab_index == 2) {
                        if(country != '')
                        {
                            promise = this.fetchCodes(country);
                        } else {
                            promise = Promise.resolve();
                        }
                        promise.then(() => {
                            if(this.active_tab_index == 0) {
                                codes_options = this.codes_org;
                            }
                            else if(this.active_tab_index == 2) {
                                codes_options = this.codes_term;
                            }
                            var codes = '';
                            codes_options.forEach(function (code, i) {
                                codes += code.code + ",";
                            });
                            if (codes.length > 0) {
                                codes = codes.substr(0, codes.length - 1);
                                filterURL += "&orig_code=" + codes;
                            }

                            resolve(filterURL);
                        }).catch(error => {
                            console.log(error);
                            reject(error);
                        });
                    }
                });
            },
            makeColumns: function(index){
                if(index == 0)
                {
                    this.orig_show_table_columns = [];
                    // this.orig_show_table_fields = '';
                    for(var i = 0; i < this.orig_selected_show_fields.length; i++)
                    {
                        var show_field = this.orig_selected_show_fields[i];

                        for(var j = 0; j < this.orig_show_field_options.length; j++)
                        {
                            var show_field_option = this.orig_show_field_options[j];

                            if(show_field_option.value == show_field)
                            {
                                this.orig_show_table_columns.push(show_field_option.text);
                                // this.orig_show_table_fields = this.orig_show_table_fields + show_field_option.id + ",";
                                break;
                            }
                        }

                        // if (this.orig_show_table_fields.length > 0)
                        // 	this.orig_show_table_fields = this.orig_show_table_fields.substr(0, this.orig_show_table_fields.length - 1);

                    }
                }
                else if (index == 2)
                {
                    this.term_show_table_columns = [];
                    // this.term_show_table_fields = '';
                    for(var i = 0; i < this.term_selected_show_fields.length; i++)
                    {
                        var show_field = this.term_selected_show_fields[i];

                        for(var j = 0; j < this.term_show_field_options.length; j++)
                        {
                            var show_field_option = this.term_show_field_options[j];

                            if(show_field_option.value == show_field)
                            {
                                this.term_show_table_columns.push(show_field_option.text);
                                // this.term_show_table_fields = this.term_show_table_fields + show_field_option.id + ",";
                                break;
                            }
                        }

                        // if (this.term_show_table_fields.length > 0)
                        // 	this.term_show_table_fields = this.term_show_table_fields.substr(0, this.term_show_table_fields.length - 1);

                    }
                }
            },
            changeEgress() {
                this.fetchRelatedTrunks('egress');
            },
            changeIngress() {
                this.fetchRelatedTrunks('ingress');
            },
            // fetchRoutePlans() {
            // 	const url = api.getEndpointUrl() + '/v1/route/plan/list';
            // 	this.$http.get(url, {
            // 		headers: {
            // 			"X-Auth-Token": auth.getToken()
            // 		}
            // 	})
            // 	.then(response => {
            // 		const body = response.body
            // 		if (body.success) {
            // 			const route_plans = body.payload.items
            // 			var self = this;
            // 			this.route_plan_options = [];
            // 			this.route_plan_options.push('All');
            // 			route_plans.forEach(function (temp, i) {
            // 				var route_plan = {};
            // 				route_plan.id = temp.route_plan_id;
            // 				route_plan.text = temp.name;
            // 				self.route_plan_options.push(route_plan);
            // 			});
            // 			console.log("Routing Success");
            // 			console.log(this.route_plan_options);
            // 		}
            // 	})
            // 	.catch(error => {
            // 		console.log("Routing Failure");
            // 		console.log(error)
            // 	})
            // },
            // fetchRateTable () {
            // 	const url = api.getEndpointUrl() + '/v1/switch/rate_table/list';
            // 	this.$http.get(url, {
            // 		headers: {
            // 			"X-Auth-Token": auth.getToken()
            // 		}
            // 	})
            // 	.then(response => {
            // 		const body = response.body
            // 		if (body.success) {
            // 			const rate_tables = body.payload.items
            // 			var self = this;
            // 			this.rate_table_options = [];
            // 			this.rate_table_options.push('All');
            // 			rate_tables.forEach(function (temp, i) {
            // 				var rate_table = {};
            // 				rate_table.id = temp.rate_table_id;
            // 				rate_table.text = temp.name;
            // 				self.rate_table_options.push(rate_table);
            // 			});
            // 			console.log("Rate table success");
            // 			console.log(this.rate_table_options);
            // 		}
            // 	})
            // 	.catch(error => {
            // 		console.log("Rate table failure");
            // 		console.log(error)
            // 	})
            // },
            // fetchAllTrunks (type) {
            // 	var url;
            // 	if(type == 'egress')
            // 		url = api.getEndpointUrl() + '/v1/trunk/egress/list';
            // 	else if(type == 'ingress')
            // 		url = api.getEndpointUrl() + '/v1/trunk/ingress/list';
            // 	this.$http.get(url)
            // 	.then(response => {
            // 		const body = response.body
            // 		if (body.success) {
            // 			const trunks = body.payload.items
            // 			var self = this;
            // 			if(type == 'egress') {
            // 				this.egress_trunk_options = [];
            // 				this.egress_trunk_options.push('');
            // 				trunks.forEach(function (temp, i) {
            // 					var trunk = {};
            // 					trunk.id = temp.resource_id;
            // 					trunk.text = temp.name;
            // 					self.egress_trunk_options.push(trunk);
            // 				});
            // 			}
            // 			else if(type == 'ingress') {
            // 				this.ingress_trunk_options = [];
            // 				this.ingress_trunk_options.push('');
            // 				trunks.forEach(function (temp, i) {
            // 					var trunk = {};
            // 					trunk.id = temp.resource_id;
            // 					trunk.text = temp.name;
            // 					self.ingress_trunk_options.push(trunk);
            // 				});
            // 			}
            // 		}
            // 	})
            // 	.catch(error => {
            // 		console.log(error)
            // 	})
            // },
            fetchRelatedTrunks (type) {
                var url;
                if(type == 'egress')
                {
                    console.log('egressss');

                    var egress_carrier;
                    if(this.active_tab_index == 0) {
                        if(this.egress_carrier_org == undefined || this.egress_carrier_org == '') return;
                        else {
                            egress_carrier = this.egress_carrier_org;
                            this.egress_trunk_org = '';
                        }
                    }
                    else if(this.active_tab_index == 2) {
                        if(this.egress_carrier_term == undefined || this.egress_carrier_term == '') return;
                        else {
                            egress_carrier = this.egress_carrier_term;
                            this.egress_trunk_term = '';
                        }
                    }
                    this.egress_trunk = '';
                    url = api.getEndpointUrl() + '/v1/carrier/' + egress_carrier + '/egress_trunk/list';
                }
                else if(type == 'ingress')
                {
                    console.log('ingresssss');

                    var ingress_carrier;
                    if(this.active_tab_index == 0) {
                        if(this.ingress_carrier_org == undefined || this.ingress_carrier_org == '') return;
                        else {
                            ingress_carrier = this.ingress_carrier_org;
                            this.ingress_trunk_org = '';
                        }
                    }
                    else if(this.active_tab_index == 2) {
                        if(this.ingress_carrier_term == undefined || this.ingress_carrier_term == '') return;
                        else {
                            ingress_carrier = this.ingress_carrier_term;
                            this.ingress_trunk_term = '';
                        }
                    }

                    url = api.getEndpointUrl() + '/v1/carrier/' + ingress_carrier + '/ingress_trunk/list';
                }
                this.loading = true;
                this.$http.get(url,
                    {
                        headers: {
                            "X-Auth-Token": auth.getToken()
                        }
                    }).then(response => {
                    const body = response.body
                    if (body.success) {
                        const trunks = body.payload.items

                        var self = this;
                        if(type == 'egress') {
                            if(this.active_tab_index == 0) {
                                this.egress_trunk_options_org = [];
                                trunks.forEach(function (temp, i) {
                                    var trunk = {};
                                    trunk.id = temp.resource_id;
                                    trunk.text = temp.name;
                                    self.egress_trunk_options_org.push(trunk);
                                });
                                //console.log("Egress: " + this.egress_trunk_options_org.length);
                            }
                            else if(this.active_tab_index == 2) {
                                this.egress_trunk_options_term = [];
                                trunks.forEach(function (temp, i) {
                                    var trunk = {};
                                    trunk.id = temp.resource_id;
                                    trunk.text = temp.name;
                                    self.egress_trunk_options_term.push(trunk);
                                });
                                //console.log("Egress: " + this.egress_trunk_options_term.length);
                            }

                        }
                        else if(type == 'ingress') {
                            if(this.active_tab_index == 0) {
                                this.ingress_trunk_options_org = [];
                                trunks.forEach(function (temp, i) {
                                    var trunk = {};
                                    trunk.id = temp.resource_id;
                                    trunk.text = temp.name;
                                    self.ingress_trunk_options_org.push(trunk);
                                });
                                console.log("Inress: " + this.ingress_trunk_options_org.length);
                            }
                            else if(this.active_tab_index == 2) {
                                this.ingress_trunk_options_term = [];
                                trunks.forEach(function (temp, i) {
                                    var trunk = {};
                                    trunk.id = temp.resource_id;
                                    trunk.text = temp.name;
                                    self.ingress_trunk_options_term.push(trunk);
                                });
                                console.log("Inress: " + this.ingress_trunk_options_term.length);
                            }

                        }
                        this.loading = false;
                        console.log("Fetch releated trunks success");
                    }
                })
                    .catch(error => {
                        console.log("Fetch releated trunks failure");
                        //console.log(error);
                        this.loading = false;
                    })
            },
            // fetchCarriers() {
            //     var per_page=1;
            //     var url = api.getEndpointUrl() + "/v1/carrier/list?per_page="+per_page
            //     this.loading = true;

            //     return new Promise((resolve, reject) => {
            //         this.$http.get(url)
            //             .then(response => {
            //                 const body = response.body
            //                 if (body.success) {
            //                     var codes = body.payload.items
            //                     this.loading = false;
            //                     per_page = body.payload.total;

            //                     url = api.getEndpointUrl() + "/v1/carrier/list?per_page="+per_page
            //                     this.loading = true;
            //                     this.$http.get(url)
            //                         .then(response => {
            //                             const body = response.body
            //                             if (body.success) {
            //                                 var self = this;
            //                                 var carriers = body.payload.items

            //                                 this.carrier_options.push({id: '', text: ''});
            //                                 carriers.forEach(function (temp, i) {
            //                                     var carrier = {};
            //                                     carrier.id = temp.client_id;
            //                                     carrier.text = temp.name;
            //                                     self.carrier_options.push(carrier);
            //                                 });
            //                             }
            //                             this.loading = false;
            //                             resolve();
            //                         })
            //                         .catch(error => {
            //                             console.log(error);
            //                             this.loading = false;
            //                             reject(error);
            //                         })
            //                 }
            //             })
            //             .catch(error => {
            //                 console.log(error);
            //                 this.loading = false;
            //                 reject(error);
            //             })
            //     });
            // },
        }
    }
</script>

<style>
.tilda{
	float: left; 
	margin-top: 5px;
	 padding-right: 5px;
}
.m-top-query{
	margin-top: -20px;
}
	.white_pad.less_pad {
		padding: 5px 15px 22px 15px;
		margin-top: 10px;
	}

	.wrapper.single .white_pad.less_pad .select2,
	.advanced_search_filter_panel .select2 {
		width: 100% !important;
	}

	.white_pad.less_pad .page-header {
		margin: 10px 0 5px 0;
	}

	.white_pad.less_pad .col-md-6.first {
		padding-right: 7px;
		padding-left: 15px;
	}

	.white_pad.less_pad .col-md-6.second {
		padding-right: 15px;
		padding-left: 7px;
	}

	select.multi {
		border: 1px solid rgb(222, 224, 227);
		border-radius: 5px;
		background-color: rgb(255, 255, 255);
		box-shadow: 0px 2px 7px 0px rgba(184, 187, 196, 0.2);
		padding: 0px;
		height: 193px;
	}

	select.multi option {
		padding: 10px;
		border-bottom: 1px solid #dee0e3;
		cursor: pointer;
	}

	select.multi option:hover {
		background: #edeff5;
	}

	select.multi:focus,
	select.multi option:focus {
		outline: none;
	}

	select[multiple]:focus option:checked {
		background: red linear-gradient(0deg, #03c0fc 0%, #03c0fc 100%);
	}

	span.table_time.chart_time.margin_0 {
		margin-left: 2px;
		margin-top: 25px;
	}

	table.table.table-striped.table-hover.centrum td,
	table.table.table-striped.table-hover.centrum th {
		vertical-align: middle;
		text-align: center;
	}

	@media (min-width: 768px) and (max-width: 979px) {
		.white_pad.less_pad .col-md-6.first,
		.white_pad.less_pad .col-md-6.second {
			padding-right: 10px;
			padding-left: 10px;
		}

		.white_pad.less_pad .little-space {
			margin: 5px 0;
		}
	}

	@media (max-width: 767px) {
		.advanced_search_filter_panel {
			padding: 10px 0 !important;
		}
		.tilda-center{
			text-align: center;
			float: none;
		}

		.white_pad.less_pad .col-md-6.first,
		.white_pad.less_pad .col-md-6.second {
			padding-right: 10px;
			padding-left: 10px;
		}

		.tabs_container {
			padding: 10px !important;
		}

		.big_data .advanced_search_filter_panel label {
			margin-top: 10px;
		}

	}

	tr.accordian-body.collapse.no_padding td,
	tr.accordian-body.collapse.no_padding td table {
		padding: 0px;
		margin: -1px;
	}

	tr.accordian-body.collapse.no_padding td table tr td {
		padding: 10px;
	}
	#app > div.container-fluid > div > div > div.tabs > div.tabs_container > div:nth-child(1) > div.advanced_search_filter_panel > div.col-md-6.col-sm-12.none-left-padding.none-right-padding > div.inlined {
		margin-top:4px !important;
	}
	.el-select__tags {
		display: none;
	}

</style>