<template>
	<div class="container-fluid">
      <div class="row">
		<div class="wrapper single big_data">
			<time-display></time-display>
			<ol class="breadcrumb">
				  <li class="breadcrumb-item"><a href="#">Statistics</a></li>
				  <li class="breadcrumb-item active">Profitability Analysis</li>
			</ol>
			<h1 class="page-header">Profitability Analysis</h1>
			<spinner v-show="loading" class="spinner"></spinner>
			<tabs @activateTab="changeTab">
				<tab label="Origination" class="" icon="dnl_icon dnl_to_left" selected>
					<div class="advanced_search_filter_panel">
						<div class="row mar-top">
						<div class="pad-left pad-right pad-5 col-lg-2 col-md-2 col-sm-4">
							<span>Period:</span>
							<select2 :options="period_options" v-model="time_org">
								<option disabled value="0">Select one</option>
							</select2>
						</div>
						<div class="col-lg-4 mar-responsive col-md-4 col-sm-8">
							<div class="inlined">
 								<el-date-picker style="width: 100%; margin-bottom: 25px;" type="datetime" v-model="start_date_org" :picker-options="{}" placeholder="Enter Date and TIme"></el-date-picker>
							</div>
							<div class="inlined">
 								<el-date-picker style="width: 100%; margin-bottom: 25px;" type="datetime" v-model="end_date_org" :picker-options="{}" placeholder="Enter Date and TIme"></el-date-picker>
							</div>
						</div>
						<div class="col-md-6  col-sm-12 none-left-padding none-right-padding second-row">
							<div>
								<div class="col-md-3 mar-responsive pad-left pad-right pad-5 col-sm-3 no-min-width">
									<span>In</span>
									<select style="width: 80%!important; min-width: 80%!important;" class="selectable" v-model="gmt_org">
										<option v-for="item in gmt_options" v-bind:value="item.id">
											{{ item.text }}
										</option>
									</select>
								</div>
								<div class=" col-md-3 pad-5 mar-responsive pad-left col-sm-3">
 									<select2 :options="by_hour_options" v-model="by_hours_org">
										<option disabled value="0">Select one</option>
									</select2>
								</div>
								<div class=" col-md-3 pad-5 mar-responsive pad-left  col-sm-3">
 									<select2 :options="web_options" v-model="web_org">
										<option disabled value="0">Select one</option>
									</select2>
								</div>
							</div>
								<div class="col-md-3 pad-5 mar-responsive pad-left pad-right col-sm-3">
									<a class="btn btn-primary full-width" v-on:click="searchReport()">
										Query
									</a>
								</div>
 								<div class="clearfix"></div>
						</div>
						</div>
						<div class="clearfix little-space"></div>
						<div v-show="more_advanced_option" >
						<div class="col-lg-4 ol-md-6 col-sm-6">
							<div class="white_pad less_pad">
								<h1 class="page-header">Inbound</h1>
								<div class="row">
								<div class="col-lg-5 col-sm-6 col-md-6 first">
									<label>Carriers:</label>
									<select class="selectable no-min-width" v-model="ingress_carrier_term" @change="changeIngress">
										<option v-for="item in carrier_options" v-bind:value="item.id">
											{{ item.text }}
										</option>
									</select>
								</div>
								<div class="col-lg-5 col-sm-6 col-md-6 second">
									<label>Ingress Trunk:</label>
									<select class="selectable no-min-width" v-model="ingress_trunk_term">
										<option v-for="item in ingress_trunk_options_term" v-bind:value="item.id">
											{{ item.text }}
										</option>
									</select>
								</div>
								<div class="clearfix little-space"></div>
								<div class="col-lg-5 col-sm-6 col-md-6 first">
									<label for="country">Country:</label>
									<input type="text" name="country" v-model="country_term" class="form-control" placeholder="Enter Country">
								</div>
								<div class="col-lg-5 col-sm-6 col-md-6 second">
									<label for="code_name">Origination ANI:</label>
									<input type="text" name="origination_ani" v-model="ani_term" class="form-control" placeholder="Enter Origination ANI">
								</div>
								<div class="clearfix little-space"></div>
								<div class="col-lg-5 col-sm-6 col-md-6 first">
									<label for="code_name">Origination DNIS:</label>
									<input type="text" name="origination_dnis" v-model="dnis_term" class="form-control" placeholder="Enter Origination DNIS">
								</div>
								<div class="clearfix"></div>
								</div>
							</div>
						</div>
						<div class="col-lg-4 col-md-6 col-sm-6">
							<div class="white_pad less_pad">
								<h1 class="page-header">Outbound</h1>
								<div class="row">
									<div class="col-lg-5 col-md-6 first">
										<label>Carriers:</label>
										<select class="selectable no-min-width" v-model="egress_carrier_term" @change="changeEgress">
											<option v-for="item in carrier_options" v-bind:value="item.id">
												{{ item.text }}
											</option>
										</select>
									</div>
									<div class="col-lg-5 col-sm-6 col-md-6 second">
										<label>Egress Trunk:</label>
										<select class="selectable no-min-width" v-model="egress_trunk_term">
											<option v-for="item in egress_trunk_options_term" v-bind:value="item.id">
												{{ item.text }}
											</option>
										</select>
									</div>
									<div class="clearfix"></div>
								</div>
							</div>
						</div>
						<div class="clearfix"></div>
						<div class="col-md-12 col-sm-12">
							<div class="white_pad less_pad">
								<div class="col-lg-4 col-md-4 col-sm-6">
									<div class="col-md-4 col-sm-5 m-top-10 group-label"><label class="m-top-10">Group by #1:</label></div>
									<div class="col-lg-6 col-md-8 col-sm-7 m-top-10 none-left-padding">
										<select class="selectable no-min-width" v-model="group_by1">
											<option v-for="item in group_options" v-bind:value="item.value">
												{{ item.text }}
											</option>
										</select>
									</div>
								</div>
								<div class="col-lg-4 col-md-4 col-sm-6">
									<div class="col-md-4 col-sm-5 m-top-10 group-label"><label class="m-top-10">Group by #2:</label></div>
									<div class="col-lg-6 col-md-8 col-sm-7 m-top-10 none-left-padding">
										<select class="selectable no-min-width" v-model="group_by2">
											<option v-for="item in group_options" v-bind:value="item.value">
												{{ item.text }}
											</option>
										</select>
									</div>
								</div>
								<div class="col-lg-4 col-md-4 col-sm-6">
									<div class="col-md-4 col-sm-5 m-top-10 group-label"><label class="m-top-10">Group by #3:</label></div>
									<div class="col-lg-6 col-md-8 col-sm-7 m-top-10 none-left-padding">
										<select class="selectable no-min-width" v-model="group_by3">
											<option v-for="item in group_options" v-bind:value="item.value">
												{{ item.text }}
											</option>
										</select>
									</div>
								</div>
								<div class="col-lg-4 col-md-4 col-sm-6">
									<div class="col-md-4 col-sm-5 m-top-10 group-label"><label class="m-top-10">Group by #4:</label></div>
									<div class="col-lg-6 col-md-8 col-sm-7 m-top-10 none-left-padding">
										<select class="selectable no-min-width" v-model="group_by4">
											<option v-for="item in group_options" v-bind:value="item.value">
												{{ item.text }}
											</option>
										</select>
									</div>
								</div>
								<div class="col-lg-4 col-md-4 col-sm-6">
									<div class="col-md-4 col-sm-5 m-top-10 group-label"><label class="m-top-10">Group by #5:</label></div>
									<div class="col-lg-6 col-md-8 col-sm-7 m-top-10 none-left-padding">
										<select class="selectable no-min-width" v-model="group_by5">
											<option v-for="item in group_options" v-bind:value="item.value">
												{{ item.text }}
											</option>
										</select>
									</div>
								</div>
								<div class="clearfix"></div>
							</div>
						</div>
						<div class="clearfix"></div>
						</div>
					</div>
					<div class="table_filters pull-right">
						<div class="inline-block select_min_wrapper">
							<span class="inline-block">Page row:</span>
							<select2 :options="page_rows" v-model="page_row_count" class="inline-block" @pagecount="changePageCount">
							</select2>
						</div>
						<div class="inline-block">
							<el-select v-model="plan_table_columns" multiple placeholder="Show/Hide Columns" @change="handleChange">
								<el-option v-for="item in show_field_options" :key="item.value" :label="item.text" :value="item.value">
								</el-option>
							</el-select>
						</div>
					</div>
					<span class="table_time chart_time margin_0">
						09/23/2016 17:34:52 +0000
					</span>
					<div class="clearfix"></div>
					<div class="table-responsive">
						<table class="table table-striped table-hover carrier_groups centrum">
						  <thead>
							<tr>
								<th rowspan="2" colspan="1">Ingress Trunk</th>
								<th rowspan="1" colspan="2">Call Duration</th>
								<th rowspan="1" colspan="2">Profit</th>
								<th rowspan="1" colspan="2">Calls</th>
								<th rowspan="2" colspan="1">Ingress Cost</th>
								<th rowspan="2" colspan="1">Egress Cost</th>
								<th rowspan="2" colspan="1">NPR Count</th>
								<th rowspan="2" colspan="1">NPR</th>
							</tr>
							<tr>
								<th rowspan="1" colspan="1">min</th>
								<th rowspan="1" colspan="1">%</th>
								<th rowspan="1" colspan="1">USD</th>
								<th rowspan="1" colspan="1">%</th>
								<th rowspan="1" colspan="1">Total</th>
								<th rowspan="1" colspan="1">Not Zero</th>
							</tr>
						  </thead>
						  <tbody>
							<tr v-if="!originations.length">
								<td style="text-align: center" colspan="15">No Data Found</td>
							</tr>
							<tr v-for="report in originations">
							  <td></td>
							  <td>{{report.ingress_billed_time}}</td>
							  <td>{{report.bill_percent}}</td>
							  <td>{{report.profit}}</td>
							  <td>{{report.profit_percent}}</td>
							  <td>{{report.ingress_calls}}</td>
							  <td>{{report.non_zero_calls}}</td>
							  <td>{{report.ingress_cost}}</td>
							  <td>{{report.egress_cost}}</td>
							  <td>{{report.npr_calls}}</td>
							  <td>{{report.npr}}</td>
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
				<tab label="Termination" class="" icon="dnl_icon dnl_to_right">
					<div class="advanced_search_filter_panel">
						<div class="row mar-top">
						<div class="pad-left pad-right pad-5 col-lg-2 col-md-2 col-sm-4">
							<span>Period:</span>
							<select2 :options="period_options" v-model="time_org">
								<option disabled value="0">Select one</option>
							</select2>
						</div>
						<div class="col-lg-4 mar-responsive col-md-4 col-sm-8">
							<div class="inlined">
 								<el-date-picker style="width: 100%; margin-bottom: 25px;" type="datetime" v-model="start_date_org" :picker-options="{}" placeholder="Enter Date and TIme"></el-date-picker>
							</div>
							<div class="inlined">
 								<el-date-picker style="width: 100%; margin-bottom: 25px;" type="datetime" v-model="end_date_org" :picker-options="{}" placeholder="Enter Date and TIme"></el-date-picker>
							</div>
						</div>
						<div class="col-md-6  col-sm-12 none-left-padding none-right-padding second-row">
							<div>
								<div class="col-md-3 mar-responsive pad-left pad-right pad-5 col-sm-3 no-min-width">
									<span>In</span>
									<select style="width: 80%!important; min-width: 80%!important;" class="selectable" v-model="gmt_org">
										<option v-for="item in gmt_options" v-bind:value="item.id">
											{{ item.text }}
										</option>
									</select>
								</div>
								<div class=" col-md-3 pad-5 mar-responsive pad-left col-sm-3">
 									<select2 :options="by_hour_options" v-model="by_hours_org">
										<option disabled value="0">Select one</option>
									</select2>
								</div>
								<div class=" col-md-3 pad-5 mar-responsive pad-left  col-sm-3">
 									<select2 :options="web_options" v-model="web_org">
										<option disabled value="0">Select one</option>
									</select2>
								</div>
							</div>
								<div class="col-md-3 pad-5 mar-responsive pad-left pad-right col-sm-3">
									<a class="btn btn-primary full-width" v-on:click="searchReport()">
										Query
									</a>
								</div>
 								<div class="clearfix"></div>
						</div>
						</div>
						<div class="clearfix little-space"></div>
						<div v-show="more_advanced_option" >
						<div class="col-lg-4 ol-md-6 col-sm-6">
							<div class="white_pad less_pad">
								<h1 class="page-header">Inbound</h1>
								<div class="row">
								<div class="col-lg-5 col-sm-6 col-md-6 first">
									<label>Carriers:</label>
									<select class="selectable no-min-width" v-model="ingress_carrier_term" @change="changeIngress">
										<option v-for="item in carrier_options" v-bind:value="item.id">
											{{ item.text }}
										</option>
									</select>
								</div>
								<div class="col-lg-5 col-sm-6 col-md-6 second">
									<label>Ingress Trunk:</label>
									<select class="selectable no-min-width" v-model="ingress_trunk_term">
										<option v-for="item in ingress_trunk_options_term" v-bind:value="item.id">
											{{ item.text }}
										</option>
									</select>
								</div>
								<div class="col-lg-5 col-sm-6 col-md-6 first">
									<label>Rate Table:</label>
									<select class="selectable no-min-width" v-model="ingress_trunk_term">
										<option v-for="item in ingress_trunk_options_term" v-bind:value="item.id">
											{{ item.text }}
										</option>
									</select>
								</div>
									<div class="col-lg-5 col-sm-6 col-md-6 second">
									<label>Routing Plane:</label>
									<select class="selectable no-min-width" v-model="ingress_trunk_term">
										<option v-for="item in ingress_trunk_options_term" v-bind:value="item.id">
											{{ item.text }}
										</option>
									</select>
								</div>
										<div class="col-lg-5 col-sm-6 col-md-6 first">
									<label>Tech Prefix:</label>
									<select class="selectable no-min-width" v-model="ingress_trunk_term">
										<option v-for="item in ingress_trunk_options_term" v-bind:value="item.id">
											{{ item.text }}
										</option>
									</select>
								</div>
								<div class="little-space"></div>
								<div class="col-lg-5 col-sm-6 col-md-6 second">
									<label for="country">Country:</label>
									<input type="text" name="country" v-model="country_term" class="form-control" placeholder="Enter Country">
								</div>
										<div class="col-lg-5 col-sm-6 col-md-6 first">
										<label>Code Name:</label>
									<input type="text" name="country" v-model="country_term" class="form-control" placeholder="Enter Code Nasme">
										</div>

								<div class="clearfix little-space"></div>
								<!-- <div class="col-lg-5 col-sm-6 col-md-6 first">
									<label for="code_name">Origination DNIS:</label>
									<input type="text" name="origination_dnis" v-model="dnis_term" class="form-control" placeholder="Enter Origination DNIS">
								</div> -->
								<div class="clearfix"></div>
								</div>
							</div>
						</div>
						<div class="col-lg-4 col-md-6 col-sm-6">
							<div class="white_pad less_pad">
								<h1 class="page-header">Outbound</h1>
								<div class="row">
									<div class="col-lg-5 col-md-6 first">
										<label>Carriers:</label>
										<select class="selectable no-min-width" v-model="egress_carrier_term" @change="changeEgress">
											<option v-for="item in carrier_options" v-bind:value="item.id">
												{{ item.text }}
											</option>
										</select>
									</div>
									<div class="col-lg-5 col-sm-6 col-md-6 second">
										<label>Egress Trunk:</label>
										<select class="selectable no-min-width" v-model="egress_trunk_term">
											<option v-for="item in egress_trunk_options_term" v-bind:value="item.id">
												{{ item.text }}
											</option>
										</select>
									</div>
									<div class="col-lg-5 col-md-6 first">
										<label>Country:</label>
										<input type="text" name="country" v-model="country_term" class="form-control" placeholder="Enter Country">
									</div>
									<div class="col-lg-5 col-sm-6 col-md-6 second">
										<label>Code Name:</label>
										<input type="text" name="country" v-model="country_term" class="form-control" placeholder="Enter Code Name">
									</div>
									<div class="clearfix"></div>
								</div>
							</div>
						</div>
						<div class="clearfix"></div>
						<div class="col-md-12 col-sm-12">
							<div class="white_pad less_pad">
								<div class="col-lg-4 col-md-4 col-sm-6">
									<div class="col-md-4 col-sm-5 m-top-10 group-label"><label class="m-top-10">Group by #1:</label></div>
									<div class="col-lg-6 col-md-8 col-sm-7 m-top-10 none-left-padding">
										<select class="selectable no-min-width" v-model="group_by1">
											<option v-for="item in group_options" v-bind:value="item.value">
												{{ item.text }}
											</option>
										</select>
									</div>
								</div>
								<div class="col-lg-4 col-md-4 col-sm-6">
									<div class="col-md-4 col-sm-5 m-top-10 group-label"><label class="m-top-10">Group by #2:</label></div>
									<div class="col-lg-6 col-md-8 col-sm-7 m-top-10 none-left-padding">
										<select class="selectable no-min-width" v-model="group_by2">
											<option v-for="item in group_options" v-bind:value="item.value">
												{{ item.text }}
											</option>
										</select>
									</div>
								</div>
								<div class="col-lg-4 col-md-4 col-sm-6">
									<div class="col-md-4 col-sm-5 m-top-10 group-label"><label class="m-top-10">Group by #3:</label></div>
									<div class="col-lg-6 col-md-8 col-sm-7 m-top-10 none-left-padding">
										<select class="selectable no-min-width" v-model="group_by3">
											<option v-for="item in group_options" v-bind:value="item.value">
												{{ item.text }}
											</option>
										</select>
									</div>
								</div>
								<div class="col-lg-4 col-md-4 col-sm-6">
									<div class="col-md-4 col-sm-5 m-top-10 group-label"><label class="m-top-10">Group by #4:</label></div>
									<div class="col-lg-6 col-md-8 col-sm-7 m-top-10 none-left-padding">
										<select class="selectable no-min-width" v-model="group_by4">
											<option v-for="item in group_options" v-bind:value="item.value">
												{{ item.text }}
											</option>
										</select>
									</div>
								</div>
								<div class="col-lg-4 col-md-4 col-sm-6">
									<div class="col-md-4 col-sm-5 m-top-10 group-label"><label class="m-top-10">Group by #5:</label></div>
									<div class="col-lg-6 col-md-8 col-sm-7 m-top-10 none-left-padding">
										<select class="selectable no-min-width" v-model="group_by5">
											<option v-for="item in group_options" v-bind:value="item.value">
												{{ item.text }}
											</option>
										</select>
									</div>
								</div>
								<div class="clearfix"></div>
							</div>
						</div>
						<div class="clearfix"></div>
						</div>
					</div>
					<div class="table_filters pull-right">
						<div class="inline-block select_min_wrapper">
							<span class="inline-block">Page row:</span>
							<select2 :options="page_rows" v-model="page_row_count" class="inline-block" @pagecount="changePageCount">
							</select2>
						</div>
						<div class="inline-block">
							<el-select v-model="plan_table_columns" multiple placeholder="Show/Hide Columns" @change="handleChange">
								<el-option v-for="item in show_field_options" :key="item.value" :label="item.text" :value="item.value">
								</el-option>
							</el-select>
						</div>
					</div>
					<span class="table_time chart_time margin_0">
						09/23/2016 17:34:52 +0000
					</span>
					<div class="clearfix"></div>
					<div class="table-responsive">
						<table class="table table-striped table-hover carrier_groups centrum">
						  <thead>
							<tr>
								<th rowspan="2" colspan="1">Ingress Trunk</th>
								<th rowspan="1" colspan="2">Call Duration</th>
								<th rowspan="1" colspan="2">Profit</th>
								<th rowspan="1" colspan="2">Calls</th>
								<th rowspan="2" colspan="1">Ingress Cost</th>
								<th rowspan="2" colspan="1">Egress Cost</th>
								<th rowspan="2" colspan="1">NPR Count</th>
								<th rowspan="2" colspan="1">NPR</th>
							</tr>
							<tr>
								<th rowspan="1" colspan="1">min</th>
								<th rowspan="1" colspan="1">%</th>
								<th rowspan="1" colspan="1">USD</th>
								<th rowspan="1" colspan="1">%</th>
								<th rowspan="1" colspan="1">Total</th>
								<th rowspan="1" colspan="1">Not Zero</th>
							</tr>
						  </thead>
						  <tbody>
							<tr v-if="!originations.length">
								<td style="text-align: center" colspan="15">No Data Found</td>
							</tr>
							<tr v-for="report in originations">
							  <td></td>
							  <td>{{report.ingress_billed_time}}</td>
							  <td>{{report.bill_percent}}</td>
							  <td>{{report.profit}}</td>
							  <td>{{report.profit_percent}}</td>
							  <td>{{report.ingress_calls}}</td>
							  <td>{{report.non_zero_calls}}</td>
							  <td>{{report.ingress_cost}}</td>
							  <td>{{report.egress_cost}}</td>
							  <td>{{report.npr_calls}}</td>
							  <td>{{report.npr}}</td>
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
		  vSpinner = require('vue!../main_components/fadeloader.vue'),
		  vSelect = require('vue!../main_components/select.vue'),
		  Pagination = require('vue!../main_components/pagination.vue');
		  const api = require("../../api");
		   const	auth = require("../../auth");
	module.exports = {
		created: function(){
			this.fetchCarriers().then(() => {
				this.searchReport();
			}).catch(error => {
				console.log(error);
			});
			// this.fetchAllTrunks('egress');
			// this.fetchAllTrunks('ingress');
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
				pageOne: {
					currentPage: 1,
					totalPages: 10
				},
				route_types: [
				  { id: 1, text: 'Fail to Next Host' },
				  { id: 2, text: 'Fail to Next Trunk' },
				  { id: 3, text: 'Stop' },
			  	],
				web_org: 'web',
				web_term: 'web',
				web_options: [
					{ id: 'web', text: 'Web' },
					{ id: 'excel_csv', text: 'Excel CSV' },
					{ id: 'email_when_done', text: 'Email when done' },
					{ id: 'export_from_storage', text: 'Export from Storage' },
				],
				time_org: 'Custom',
				time_term: 'Custom',
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
				page_row_count: 1,
				page_rows: [
					{ id: 1, text: '10' },
					{ id: 2, text: '20' },
					{ id: 3, text: '30' },
					{ id: 4, text: '50' },
					{ id: 5, text: '100' }
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
				page_rows: [
					{ id: 1, text: '10' },
					{ id: 2, text: '20' },
					{ id: 3, text: '30' },
					{ id: 4, text: '50' },
					{ id: 5, text: '100' }
				],
				plan_table_columns: [],
				show_field_options: [
				  { id: 1, value: 'ingress_trunk', text: 'Ingress Trunk' },
				  { id: 2, value: 'call_duration', text: 'Call Duration' },
				  { id: 3, value: 'profit', text: 'Profit' },
				  { id: 4, value: 'total_calls', text: 'Total Calls' },
				  { id: 5, value: 'not_zero_calls', text: 'Not Zero Calls' },
				  { id: 6, value: 'success_calls', text: 'Success Calls' },
				  { id: 7, value: 'ingress_cost', text: 'Ingress Cost' },
				  { id: 8, value: 'egress_cost', text: 'Egress Cost' },
				],
				prefix_options: [
				  { id: 1, value: 'all', text: 'All' },
			    ],
				prefix: '',
				more_advanced_option: true,
				more_advanced_option_button: "Less Options",
				loading: false,
				orgination_search_field: ['ingress_billed_time', 'ingress_calls', 'non_zero_calls', 'ingress_cost', 'egress_cost', 'ingress_success_calls', 'ingress_time', 'npr_calls'],
				termination_search_field: ['egress_billed_time', 'egress_calls', 'non_zero_calls', 'ingress_cost', 'egress_cost', 'ingress_success_calls', 'egress_time', 'npr_calls'],
				// calc_fields: ['bill_percent', 'profit', 'profit_percent', 'npr'],

				start_date_org: '',
				end_date_org: '',
				start_date_term: '',
				end_date_term: '',
				ani_org: '',
				dnis_org: '',
				ani_term: '',
				dnis_term: '',
				backupDatas: [],
				originations: [],
			    terminations: [],
				active_tab_index: 0,
			  	active_tab_name: "Origination",
				ingress_trunk_org: '',
				egress_trunk_org: '',
				ingress_trunk_term: '',
				egress_trunk_term: '',
				carrier_options: [],
				ingress_trunk_options_org: [],
				ingress_trunk_options_term: [],
				egress_trunk_options_org: [],
				egress_trunk_options_term: [],
				egress_carrier_org: '',
				egress_carrier_term: '',
				ingress_carrier_org: '',
				ingress_carrier_term: '',
				country_org: '',
				country_term: '',
			}
		},
		watch: {
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
			toggleTable(event) {
				var element = event.currentTarget;
				$(element).parents('tr').siblings('.collapse').toggleClass('in');
			},
			pageOneChanged (pageNum) {
				this.pageOne.currentPage = pageNum
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
				this.ani = "";
				this.dnis = "";
				this.country = "";
				// this.ingress_carrier = '';
				this.egress_carrier = '';
				this.ingress_trunk = '';
				this.egress_trunk = '';
				this.group_by1 = '';
				this.group_by2 = '';
				this.group_by3 = '';
				this.group_by4 = '';
				this.group_by5 = '';
				// this.searchReport();
			},
			handleChange() {

			},
			changePageCount (countPerPage) {
				if (countPerPage !== this.pageOne.cntpage) {
					this.pageOne.cntpage = countPerPage
					this.$nextTick(this.fetchPlans)
				}
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
			calcValue: function(first, second, percent = 100)
			{
				var value = 0;
				if(second == 0 || second == "") value = 0;
				else value = first * percent / second;
				if(isNaN(value)) value = 0;
				else value = parseFloat(Math.round(value * 100) / 100).toFixed(2);
				return value;
			},

			makeDatas: function()

			{
				console.log("make datas");
				if(this.backupDatas.length == 0) return;
 				var displayArray = new Array();
				for(var i = 0; i < this.backupDatas.length - 1; i++)
				{
					var value = new Array();
					value["group_time"] = formatDateFromStamp(this.backupDatas[i]['time']);
					for(var j = 0; j < this.orgination_search_field.length; j++)
					{
						if(this.active_tab_index == 0)
							value[this.orgination_search_field[j]] = this.backupDatas[i][this.orgination_search_field[j]];
						else
							value[this.termination_search_field[j]] = this.backupDatas[i][this.termination_search_field[j]];
					}
					if(this.active_tab_index == 0)
					{
						value["bill_percent"] = this.calcValue(value["ingress_billed_time"], value["ingress_time"]);
						value["profit"] = value["ingress_cost"] - value["egress_cost"];
						value["profit_percent"] = this.calcValue(value["profit"], value["egress_cost"]);
						value["npr"] = this.calcValue(value["npr_calls"], value["ingress_calls"]);
					}
					else
					{
						value["bill_percent"] = this.calcValue(value["egress_billed_time"], value["ingress_time"]);
						value["profit"] = value["ingress_cost"] - value["egress_cost"];
						value["profit_percent"] = this.calcValue(value["profit"], value["egress_cost"]);
						value["npr"] = this.calcValue(value["npr_calls"], value["egress_calls"]);
					}

					displayArray[i] = value;
				}

				if(this.active_tab_index == 0)
					this.originations = displayArray;
				else
					this.terminations = displayArray;
				this.loading = false;
			},
			fetchReport: function(start_time, end_time, step, filterURL, field_ind = 0, method = 'total')
			{
				this.loading = true;
				var fields = '';
				var selected_show_fields;
				if(this.active_tab_index == 0) {
					selected_show_fields = this.orgination_search_field;
				}
				else if(this.active_tab_index == 1) {
					selected_show_fields = this.termination_search_field;
				}

				selected_show_fields.forEach(function (field, i) {
					fields += field + ",";
				});

				// var skip = false;
				// var thisvm = this;
				// selected_show_fields.forEach(function (field, i) {
				// 	skip = false;

				// 	for(var j = 0; j < thisvm.calc_fields.length; j++) {
				// 		if (thisvm.calc_fields[j] == field) {
				// 			skip = true;
				// 			break;
				// 		}
				// 	}

				// 	if (!skip)
				// 		fields += field + ",";
				// });
				if (fields.length > 0)
					fields = fields.substr(0, fields.length - 1);

				var strURL = api.getReport_URL() + "?start_time=" + start_time + "&end_time=" + end_time + "&step=" + step + "&method=" + method + "&field=" + fields;
				strURL += filterURL;
				console.log(strURL);
				this.$http.get(strURL)
				.then(function(response) {
					this.backupDatas = response.body.data;
					this.makeDatas();
				}, function(error) {
					this.loading = false;
					console.log(error);
				});
			},
			searchReport: function(){
				var start_time, end_time, step, time, by_hours;
				if(this.active_tab_index == 0) {
					time = this.time_org
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
				else {
					time = this.time_term;
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
				else {
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
					else {
						this.codes_term = [];
					}

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
						else {
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
				});
			},

			changeEgress() {
				this.fetchRelatedTrunks('egress');
			},
			changeIngress() {
				this.fetchRelatedTrunks('ingress');
			},

			fetchRelatedTrunks (type) {
				var url;
				if(type == 'egress')
				{
					var egress_carrier;
					if(this.active_tab_index == 0) {
						if(this.egress_carrier_org == undefined || this.egress_carrier_org == '') return;
						else
							egress_carrier = this.egress_carrier_org;
					}
					else {
						if(this.egress_carrier_term == undefined || this.egress_carrier_term == '') return;
						else
							egress_carrier = this.egress_carrier_term;
					}
					this.egress_trunk = '';
					url = api.getEndpointUrl() + '/v1/carrier/' + egress_carrier + '/egress_trunk/list';
				}
				else if(type == 'ingress')
				{
					var ingress_carrier;
					if(this.active_tab_index == 0) {
						if(this.ingress_carrier_org == undefined || this.ingress_carrier_org == '') return;
						else {
							ingress_carrier = this.ingress_carrier_org;
							this.ingress_trunk_org = '';
						}
					}
					else {
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
							else {
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
								//console.log("Inress: " + this.ingress_trunk_options_org.length);
							}
							else {
								this.ingress_trunk_options_term = [];
								trunks.forEach(function (temp, i) {
									var trunk = {};
									trunk.id = temp.resource_id;
									trunk.text = temp.name;
									self.ingress_trunk_options_term.push(trunk);
								});
								//console.log("Inress: " + this.ingress_trunk_options_term.length);
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
			fetchCarriers() {
				var per_page=1;
				var url = api.getEndpointUrl() + "/v1/carrier/list?per_page="+per_page
				this.loading = true;

				return new Promise((resolve, reject) => {
					this.$http.get(url)
					.then(response => {
						const body = response.body
						if (body.success) {
							var codes = body.payload.items
							this.loading = false;
							per_page = body.payload.total;

							url = api.getEndpointUrl() + "/v1/carrier/list?per_page="+per_page
							this.loading = true;
							this.$http.get(url)
							.then(response => {
								const body = response.body
								if (body.success) {
									var self = this;
									var carriers = body.payload.items

									this.carrier_options.push({id: '', text: ''});
									carriers.forEach(function (temp, i) {
										var carrier = {};
										carrier.id = temp.client_id;
										carrier.text = temp.name;
										self.carrier_options.push(carrier);
									});
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

		}
	}
</script>

<style>
#app > div.container-fluid > div > div > div.tabs > div.tabs_container > div:nth-child(2) > div.advanced_search_filter_panel > div.row > div.pad-left.pad-right.pad-5.col-lg-2.col-md-2.col-sm-4 > span.select2.select2-container.select2-container--default, 
#app > div.container-fluid > div > div > div.tabs > div.tabs_container > div:nth-child(1) > div.advanced_search_filter_panel > div.row.mar-top > div.pad-left.pad-right.pad-5.col-lg-2.col-md-2.col-sm-4 > span.select2.select2-container.select2-container--default{
	width: 67%!important;
}
#app > div.container-fluid > div > div > div.tabs > div.tabs_container > div:nth-child(2) > div.advanced_search_filter_panel > div.row.mar-top > div.col-lg-4.col-md-4.col-sm-8 > div:nth-child(1) > div:after{
	top: 10px!important;
}
#app > div.container-fluid > div > div > div.tabs > div.tabs_container > div:nth-child(2) > div.advanced_search_filter_panel > div.row.mar-top > div.col-md-6.col-sm-12.none-left-padding.none-right-padding > div:nth-child(1) > div:nth-child(2) > span,
#app > div.container-fluid > div > div > div.tabs > div.tabs_container > div:nth-child(2) > div.advanced_search_filter_panel > div.row.mar-top > div.col-md-6.col-sm-12.none-left-padding.none-right-padding > div:nth-child(1) > div:nth-child(3) > span, 
#app > div.container-fluid > div > div > div.tabs > div.tabs_container > div:nth-child(1) > div.advanced_search_filter_panel > div.row.mar-top > div.col-md-6.col-sm-12.none-left-padding.none-right-padding.second-row > div:nth-child(1) > div:nth-child(2) > span, 
#app > div.container-fluid > div > div > div.tabs > div.tabs_container > div:nth-child(1) > div.advanced_search_filter_panel > div.row.mar-top > div.col-md-6.col-sm-12.none-left-padding.none-right-padding.second-row > div:nth-child(1) > div:nth-child(3) > span{
	width: 100%!important;
}
@media (max-width: 991px) and (min-width: 768px){
	.second-row{
		margin-top: 25px;
	}
}
@media (max-width: 767px){
	.mar-responsive{
		margin-top: 25px;
	}
}
</style>
