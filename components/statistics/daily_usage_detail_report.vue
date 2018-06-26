<template>
	<div class="container-fluid">
		<div class="row">
			<div class="wrapper single big_data">
				<time-display></time-display>
				<ol class="breadcrumb">
					<li class="breadcrumb-item">
						<a href="#">Statistics</a>
					</li>
					<li class="breadcrumb-item active">Daily Usage Detail Report</li>
				</ol>
				<h1 class="page-header">{{title}}</h1>
				<spinner v-show="loading" class="spinner"></spinner>
				<tabs @activateTab="changeTab">
					<tab label="Origination" class="" icon="dnl_icon dnl_to_left" selected>
						<div class="advanced_search_filter_panel">
							<div class="col-md-2 col-sm-4">
								<label>Period:</label>
								<select2 :options="period_options" v-model="time_org">
									<option disabled value="0">Select one</option>
								</select2>
							</div>
							<div class="col-md-4 col-sm-8">
								<div class="inlined">
									<label for="start_date_org">Start Time:</label>
									<el-date-picker style="width: 100%;" type="datetime" v-model="start_date_org" :picker-options="{}" placeholder="Enter Date and TIme"></el-date-picker>
								</div>
								<div class="inlined">
									<label for="end_date_org">End Time:</label>
									<el-date-picker style="width: 100%;" type="datetime" v-model="end_date_org" :picker-options="{}" placeholder="Enter Date and TIme"></el-date-picker>
								</div>
							</div>
							<div class="col-md-6 col-sm-12 none-left-padding none-right-padding">
								<div class="">
									<div class="col-md-2 col-sm-4">
										<label>GMT:</label>
										<select class="selectable no-min-width" v-model="gmt_org">
											<option v-for="item in gmt_options" v-bind:value="item.id">
												{{ item.text }}
											</option>
										</select>
									</div>
									<div class="col-md-2 col-sm-4">
										<label>By Hours:</label>
										<select class="selectable no-min-width" v-model="by_hours_org">
											<option v-for="item in by_hour_options" v-bind:value="item.id">
												{{ item.text }}
											</option>
										</select>
									</div>
									<div class="col-md-2 col-sm-4">
										<label>Web:</label>
										<select2 :options="web_options" v-model="web_org">
											<option disabled value="0">Select one</option>
										</select2>
									</div>
								</div>
								<div class="">
									<div class="col-md-2 col-sm-4">
										<a class="btn btn-primary full-width m-top-20" v-on:click="searchReport('orig')">
											Query
										</a>
									</div>
									<div class="col-md-4 col-sm-4">
										<a class="btn btn-primary full-width m-top-20" v-on:click="showAdvanced()">
											{{more_advanced_option_button}}
										</a>
									</div>
									<div class="clearfix"></div>
								</div>
							</div>
							<div class="clearfix little-space"></div>
							<div class="" v-show="more_advanced_option">
								<div class="col-md-4 col-sm-6">
									<div class="white_pad less_pad">
										<h1 class="page-header">Inbound</h1>
										<div class="row">
											<div class="col-md-6 first">
												<label>Carriers:</label>
												<select class="selectable no-min-width" v-model="ingress_carrier_org" @change="changeIngress">
													<option v-for="item in carrier_options" v-bind:value="item.id">
														{{ item.text }}
													</option>
												</select>
											</div>
											<div class="col-md-6 second">
												<label>Ingress Trunk:</label>
												<select class="selectable no-min-width" v-model="ingress_trunk_org">
													<option v-for="item in ingress_trunk_options_org" v-bind:value="item.id">
														{{ item.text }}
													</option>
												</select>
											</div>
											<div class="clearfix little-space"></div>
											<div class="col-md-6 first">
												<label for="country_org">Country:</label>
												<input type="text" name="country_org" v-model="country_org" class="form-control" placeholder="Enter Country">
											</div>
											<div class="col-md-6 second">
												<label for="code_name">Origination ANI:</label>
												<input type="text" name="origination_ani" v-model="ani_org" class="form-control" placeholder="Enter Origination ANI">
											</div>
											<div class="clearfix little-space"></div>
											<div class="col-md-6 first">
												<label for="code_name">Origination DNIS:</label>
												<input type="text" name="origination_dnis" v-model="dnis_org" class="form-control" placeholder="Enter Origination DNIS">
											</div>
											<div class="clearfix"></div>
										</div>
									</div>
								</div>
								<div class="col-md-4 col-sm-6">
									<div class="white_pad less_pad">
										<h1 class="page-header">Outbound</h1>
										<div class="row">
											<div class="col-md-6 first">
												<label>Carriers:</label>
												<select class="selectable no-min-width" v-model="egress_carrier_org" @change="changeEgress">
													<option v-for="item in carrier_options" v-bind:value="item.id">
														{{ item.text }}
													</option>
												</select>
							
											</div>
											<div class="col-md-6 second">
												<label>Egress Trunk:</label>
												<select class="selectable no-min-width" v-model="egress_trunk_org">
													<option v-for="item in egress_trunk_options_org" v-bind:value="item.id">
														{{ item.text }}
													</option>
												</select>
											</div>
											<div class="clearfix"></div>
										</div>
									</div>
								</div>
								<!-- <div class="col-md-4 col-sm-12">
										<div class="white_pad less_pad">
											<h1 class="page-header">Fields</h1>
											<label for="groupname">Show Fields:</label>
											<select multiple class="multi" v-model="orig_selected_show_fields">
												<option v-for="option in orig_show_field_options" :value='option.value'>{{option.text}}</option>
											</select>
										</div>
									</div> -->
								<div class="clearfix"></div>
								<div class="col-md-12 col-sm-12">
									<div class="white_pad less_pad">
										<div class="col-md-4 col-sm-6">
											<div class="col-md-4 col-sm-5 m-top-10 group-label">
												<label class="m-top-10">Group by #1:</label>
											</div>
											<div class="col-md-8 col-sm-7 m-top-10 none-left-padding">
												<select class="selectable no-min-width" v-model="group_by1">
													<option v-for="item in group_by_options" v-bind:value="item.value">
														{{ item.text }}
													</option>
												</select>
											</div>
										</div>
										<div class="col-md-4 col-sm-6">
											<div class="col-md-4 col-sm-5 m-top-10 group-label">
												<label class="m-top-10">Group by #2:</label>
											</div>
											<div class="col-md-8 col-sm-7 m-top-10 none-left-padding">
												<select class="selectable no-min-width" v-model="group_by2">
													<option v-for="item in group_by_options" v-bind:value="item.value">
														{{ item.text }}
													</option>
												</select>
											</div>
										</div>
										<div class="col-md-4 col-sm-6">
											<div class="col-md-4 col-sm-5 m-top-10 group-label">
												<label class="m-top-10">Group by #3:</label>
											</div>
											<div class="col-md-8 col-sm-7 m-top-10 none-left-padding">
												<select class="selectable no-min-width" v-model="group_by3">
													<option v-for="item in group_by_options" v-bind:value="item.value">
														{{ item.text }}
													</option>
												</select>
											</div>
										</div>
										<div class="col-md-4 col-sm-6">
											<div class="col-md-4 col-sm-5 m-top-10 group-label">
												<label class="m-top-10">Group by #4:</label>
											</div>
											<div class="col-md-8 col-sm-7 m-top-10 none-left-padding">
												<select class="selectable no-min-width" v-model="group_by4">
													<option v-for="item in group_by_options" v-bind:value="item.value">
														{{ item.text }}
													</option>
												</select>
											</div>
										</div>
										<div class="col-md-4 col-sm-6">
											<div class="col-md-4 col-sm-5 m-top-10 group-label">
												<label class="m-top-10">Group by #5:</label>
											</div>
											<div class="col-md-8 col-sm-7 m-top-10 none-left-padding">
												<select class="selectable no-min-width" v-model="group_by5">
													<option v-for="item in group_by_options" v-bind:value="item.value">
														{{ item.text }}
													</option>
												</select>
											</div>
										</div>
										<div class="col-md-4 col-sm-6">
											<div class="col-md-4 col-sm-5 m-top-10 group-label">
												<label class="m-top-10">Group by #6:</label>
											</div>
											<div class="col-md-8 col-sm-7 m-top-10 none-left-padding">
												<select class="selectable no-min-width" v-model="group_by6">
													<option v-for="item in group_by_options" v-bind:value="item.value">
														{{ item.text }}
													</option>
												</select>
											</div>
										</div>
										<div class="clearfix"></div>
									</div>
									<div class="clearfix"></div>
								</div>

								<div class="clearfix"></div>
							</div>
						</div>
						<div class="table_filters pull-right">
							<div class="inline-block select_min_wrapper">
								<span class="inline-block">Page row:</span>
								<select2 :options="page_rows" v-model="selected1" class="inline-block">
								</select2>
							</div>
							<div class="inline-block">
								<el-select v-model="origin_table_column" multiple placeholder="Show/Hide Columns" @change="handleChangeOrigin">
								<el-option v-for="item in origin_table_column_options" :key="item.value" :label="item.label" :value="item.value">
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
									<th v-if="showcolumns_origin[0]" rowspan="2" colspan="1">Ingress Carrier</th>
									<th v-if="showcolumns_origin[1]" rowspan="2" colspan="1">Ingress Trunk</th>
									<th v-if="showcolumns_origin[2]" rowspan="2" colspan="1">Not Zero Calls</th>
									<th v-if="showcolumns_origin[3]" rowspan="2" colspan="1">Total(Min)</th>
									<th v-if="(showcolumns_origin[4] && showcolumns_origin[5])" colspan="2" rowspan="1">Calls &lt; 30s</th>
									<th  v-else-if="(((showcolumns_origin[4] == false) || (showcolumns_origin[5] == false)) && !((showcolumns_origin[4] == false) && (showcolumns_origin[5] == false)))" colspan="1">Calls &lt; 30s</th>
									<th v-if="(showcolumns_origin[6] && showcolumns_origin[7])" colspan="2" rowspan="1">Calls &lt;= 6s</th>
									<th  v-else-if="(((showcolumns_origin[6] == false) || (showcolumns_origin[7] == false)) && !((showcolumns_origin[6] == false) && (showcolumns_origin[7] == false)))" colspan="1">Calls &lt;= 6s</th>
									<th v-if="(showcolumns_origin[8] && showcolumns_origin[9] && showcolumns_origin[10])" colspan="3" rowspan="1">2016-01-01</th>
									<th  v-else-if="(((showcolumns_origin[8] == false) || (showcolumns_origin[9] == false) || (showcolumns_origin[10] == false)) && !((showcolumns_origin[8] == false) && (showcolumns_origin[9] == false) && (showcolumns_origin[10] == false)))" colspan="3">2016-01-01</th>
								</tr>
								<tr>
									<th v-if="showcolumns_origin[4]" rowspan="1" colspan="1">Count</th>
									<th v-if="showcolumns_origin[5]" rowspan="1" colspan="1">%</th>
									<th v-if="showcolumns_origin[6]" rowspan="1" colspan="1">Count</th>
									<th v-if="showcolumns_origin[7]" rowspan="1" colspan="1">%</th>
									<th v-if="showcolumns_origin[8]" rowspan="1" colspan="1">Billed Time (min)</th>
									<th v-if="showcolumns_origin[9]" rowspan="1" colspan="1">ASR (%)</th>
									<th v-if="showcolumns_origin[10]" rowspan="1" colspan="1">ACD (min)</th>
								</tr>
								</thead>
								<tbody>
								<tr v-for="report in originations">
									<td v-if="showcolumns_origin[0]">{{report.ingress_carrier}}</td>
									<td v-if="showcolumns_origin[1]">{{report.ingress_trunk}}</td>
									<td v-if="showcolumns_origin[2]">{{report.not_zero_calls}}</td>
									<td v-if="showcolumns_origin[3]">{{report.total}}</td>
									<td v-if="showcolumns_origin[4]">{{report.calls_30_count}}</td>
									<td v-if="showcolumns_origin[5]">{{report.calls_30_percent}}</td>
									<td v-if="showcolumns_origin[6]">{{report.calls_6_count}}</td>
									<td v-if="showcolumns_origin[7]">{{report.calls_6_percent}}</td>
									<td v-if="showcolumns_origin[8]">{{report.billed_time}}</td>
									<td v-if="showcolumns_origin[9]">{{report.asr}}</td>
									<td v-if="showcolumns_origin[10]">{{report.acd}}</td>
								</tr>
								</tbody>
							</table>
						</div>
						<div class="pull-right pagination">
							<pagination :current-page="pageOne.currentPage" :total-pages="pageOne.totalPages" @page-changed="pageOneChanged">
							</pagination>
						</div>
					</tab>
					<tab label="Termination" class="" icon="dnl_icon dnl_to_right">
						<div class="advanced_search_filter_panel">
							<div class="col-md-2 col-sm-4">
								<label>Period:</label>
								<select2 :options="period_options" v-model="time_term">
									<option disabled value="0">Select one</option>
								</select2>
							</div>
							<div class="col-md-4 col-sm-8">
								<div class="inlined">
									<label for="start_date_term">Start Time:</label>
									<el-date-picker style="width: 100%;" type="datetime" v-model="start_date_term" :picker-options="{}" placeholder="Enter Date and TIme"></el-date-picker>
								</div>
								<div class="inlined">
									<label for="end_date_term">End Time:</label>
									<el-date-picker style="width: 100%;" type="datetime" v-model="end_date_term" :picker-options="{}" placeholder="Enter Date and TIme"></el-date-picker>
								</div>
							</div>
							<div class="col-md-6 col-sm-12 none-left-padding none-right-padding">
								<div class="inlined">
									<div class="col-md-4 col-sm-4">
										<label>GMT:</label>
										<select2 :options="gmt_options" v-model="gmt_term">
											<option disabled value="0">Select one</option>
										</select2>
									</div>
									<div class="col-md-4 col-sm-4">
										<label>By Hours:</label>
										<select class="selectable no-min-width" v-model="by_hours_term">
											<option v-for="item in by_hour_options" v-bind:value="item.id">
												{{ item.text }}
											</option>
										</select>
									</div>
									<div class="col-md-4 col-sm-4">
										<label>Web:</label>
										<select2 :options="web_options" v-model="web_term">
											<option disabled value="0">Select one</option>
										</select2>
									</div>
								</div>
								<div class="inlined">
									<div class="col-md-5 col-sm-4 pad-left">
										<a class="btn btn-primary full-width m-top-20" v-on:click="searchReport('term')">
											Query
										</a>
									</div>
									<div class="col-md-6 col-sm-5 pad-right">
										<a class="btn btn-primary full-width m-top-20" v-on:click="showAdvanced()">
											{{more_advanced_option_button}}
										</a>
									</div>
									<div class="clearfix"></div>
								</div>
							</div>
							<div class="clearfix little-space"></div>
							<div v-show="more_advanced_option">
								<div class="col-md-4 col-sm-6">
									<div class="white_pad less_pad">
										<h1 class="page-header">Inbound</h1>
										<div class="row">
											<div class="col-md-6 first">
												<label>Carriers:</label>
												<select class="selectable no-min-width" v-model="ingress_carrier_term" @change="changeIngress">
													<option v-for="item in carrier_options" v-bind:value="item.id">
														{{ item.text }}
													</option>
												</select>
											</div>
											<div class="col-md-6 second">
												<label>Ingress Trunk:</label>
												<select class="selectable no-min-width" v-model="ingress_trunk_term">
													<option v-for="item in ingress_trunk_options_term" v-bind:value="item.id">
														{{ item.text }}
													</option>
												</select>
											</div>
											<div class="clearfix little-space"></div>
											<div class="col-md-6 first">
												<label for="country_org">Country:</label>
												<input type="text" name="country_org" v-model="country_term" class="form-control" placeholder="Enter Country">
											</div>
											<div class="col-md-6 second">
												<label for="code_name">Origination ANI:</label>
												<input type="text" name="origination_ani" v-model="ani_term" class="form-control" placeholder="Enter Origination ANI">
											</div>
											<div class="clearfix little-space"></div>
											<div class="col-md-6 first">
												<label for="code_name">Origination DNIS:</label>
												<input type="text" name="origination_dnis" v-model="dnis_term" class="form-control" placeholder="Enter Origination DNIS">
											</div>
											<div class="clearfix"></div>
										</div>
									</div>
								</div>
								<div class="col-md-4 col-sm-6">
									<div class="white_pad less_pad">
										<h1 class="page-header">Outbound</h1>
										<div class="row">
											<div class="col-md-6 first">
												<label>Carriers:</label>
												<select class="selectable no-min-width" v-model="egress_carrier_term" @change="changeEgress">
													<option v-for="item in carrier_options" v-bind:value="item.id">
														{{ item.text }}
													</option>
												</select>
											</div>
											<div class="col-md-6 second">
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
								<!-- <div class="col-md-4 col-sm-12">
											<div class="white_pad less_pad">
												<h1 class="page-header">Fields</h1>
												<label for="groupname">Show Fields:</label>
												<select multiple class="multi" v-model="orig_selected_show_fields">
													<option v-for="option in orig_show_field_options" :value='option.value'>{{option.text}}</option>
												</select>
											</div>
										</div> -->
								<div class="clearfix"></div>
								<div class="col-md-12 col-sm-12">
									<div class="white_pad less_pad">
										<div class="col-md-2 col-sm-4">
											<label class="m-top-10">Group by #1:</label>
											<select2 :options="options" v-model="group_by1">
													<option v-for="item in group_by_options" v-bind:value="item.value">
														{{ item.text }}
													</option>
											</select2>
										</div>
										<div class="col-md-2 col-sm-4">
											<label class="m-top-10">Group by #2:</label>
											<select2 :options="options" v-model="group_by2">
												<option v-for="item in group_by_options" v-bind:value="item.value">
														{{ item.text }}
													</option>
											</select2>
										</div>
										<div class="col-md-2 col-sm-4">
											<label class="m-top-10">Group by #3:</label>
											<select2 :options="options" v-model="group_by3">
												<option v-for="item in group_by_options_trunk" v-bind:value="item.value">
														{{ item.text }}
													</option>
											</select2>
										</div>
										<div class="col-md-2 col-sm-4">
											<label class="m-top-10">Group by #4:</label>
											<select2 :options="options" v-model="group_by4">
												<option v-for="item in group_by_options_trunk" v-bind:value="item.value">
														{{ item.text }}
													</option>
											</select2>
										</div>
										<div class="col-md-2 col-sm-4">
											<label class="m-top-10">Group by #5:</label>
											<select2 :options="options" v-model="group_by5">
												<option v-for="item in group_by_options_trunk" v-bind:value="item.value">
														{{ item.text }}
													</option>
											</select2>
										</div>
										<div class="col-md-2 col-sm-4">
											<label class="m-top-10">Group by #6:</label>
											<select2 :options="options" v-model="group_by6">
												<option v-for="item in group_by_options_trunk" v-bind:value="item.value">
														{{ item.text }}
													</option>
											</select2>
										</div>
										<div class="clearfix"></div>
									</div>
								</div>
							</div>
						</div>
						<div class="table_filters pull-right">
							<div class="inline-block select_min_wrapper">
								<span class="inline-block">Page row:</span>
								<select2 :options="page_rows" v-model="selected1" class="inline-block">
								</select2>
							</div>
							<div class="inline-block fix_medium_select">
								<el-select v-model="termination_table_column" multiple placeholder="Show/Hide Columns" @change="handleChangeTerm">
								<el-option v-for="item in termination_table_column_options" :key="item.value" :label="item.label" :value="item.value">
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
									<th v-if="showcolumns_term[0]" rowspan="2" colspan="1">Egress Carrier</th>
									<th v-if="showcolumns_term[1]" rowspan="2" colspan="1">Egress Trunk</th>
									<th v-if="showcolumns_term[2]" rowspan="2" colspan="1">Not Zero Calls</th>
									<th v-if="showcolumns_term[3]" rowspan="2" colspan="1">Total(Min)</th>
									<th v-if="(showcolumns_term[4] && showcolumns_term[5])" colspan="2" rowspan="1">Calls &lt; 30s</th>
									<th  v-else-if="(((showcolumns_term[4] == false) || (showcolumns_term[5] == false)) && !((showcolumns_term[4] == false) && (showcolumns_term[5] == false)))" colspan="1">Calls &lt; 30s</th>
									<th v-if="(showcolumns_term[6] && showcolumns_term[7])" colspan="2" rowspan="1">Calls &lt;= 6s</th>
									<th  v-else-if="(((showcolumns_term[6] == false) || (showcolumns_term[7] == false)) && !((showcolumns_term[6] == false) && (showcolumns_term[7] == false)))" colspan="1">Calls &lt;= 6s</th>
									<th v-if="(showcolumns_term[8] && showcolumns_term[9] && showcolumns_term[10] && showcolumns_term[11] && showcolumns_term[12])" colspan="5" rowspan="1">2016-01-01</th>
									<th  v-else-if="(((showcolumns_term[8] == false) || (showcolumns_term[9] == false) || (showcolumns_term[10] == false) || (showcolumns_term[11] == false) || (showcolumns_term[12] == false)) && !((showcolumns_term[8] == false) && (showcolumns_term[9] == false) && (showcolumns_term[10] == false) && (showcolumns_term[11] == false) && (showcolumns_term[12] == false)))" colspan="5">2016-01-01</th>

								</tr>
								<tr>
									<th v-if="showcolumns_term[4]" rowspan="1" colspan="1">Count</th>
									<th v-if="showcolumns_term[5]" rowspan="1" colspan="1">%</th>
									<th v-if="showcolumns_term[6]" rowspan="1" colspan="1">Count1</th>
									<th v-if="showcolumns_term[7]" rowspan="1" colspan="1">%1</th>
									<th v-if="showcolumns_term[8]" rowspan="1" colspan="1">Billed Time (min)</th>
									<th v-if="showcolumns_term[9]" rowspan="1" colspan="1">ASR (%)</th>
									<th v-if="showcolumns_term[10]" rowspan="1" colspan="1">ACD (min)</th>
									<th v-if="showcolumns_term[11]" rowspan="1" colspan="1">NPR Count</th>
									<th v-if="showcolumns_term[12]" rowspan="1" colspan="1">NPR</th>
								</tr>
								</thead>
								<tbody>
								<tr v-for="report in terminations">
									<td v-if="showcolumns_term[0]">{{report.egress_carrier}}</td>
									<td v-if="showcolumns_term[1]">{{report.egress_trunk}}</td>
									<td v-if="showcolumns_term[2]">{{report.not_zero_calls}}</td>
									<td v-if="showcolumns_term[3]">{{report.total}}</td>
									<td v-if="showcolumns_term[4]">{{report.calls_30_count}}</td>
									<td v-if="showcolumns_term[5]">{{report.calls_30_percent}}</td>
									<td v-if="showcolumns_term[6]">{{report.calls_6_count}}</td>
									<td v-if="showcolumns_term[7]">{{report.calls_6_percent}}</td>
									<td v-if="showcolumns_term[8]">{{report.billed_time}}</td>
									<td v-if="showcolumns_term[9]">{{report.asr}}</td>
									<td v-if="showcolumns_term[10]">{{report.acd}}</td>
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
					<tab label="Daily Origination" class="" icon="dnl_icon dnl_to_left">
						<div class="advanced_search_filter_panel">
							<div class="col-md-2 col-sm-4">
								<label>Period:</label>
								<select2 :options="period_options" v-model="time_daily_org">
									<option disabled value="0">Select one</option>
								</select2>
							</div>
							<div v-if="showOriginationDates" class="col-md-4 col-sm-8">
								<div class="inlined">
									<label for="start_date_term">Start Time:</label>
									<el-date-picker style="width: 100%;" type="datetime" v-model="start_date_org" :picker-options="{}" placeholder="Enter Date and TIme"></el-date-picker>
								</div>
								<div class="inlined">
									<label for="end_date_term">End Time:</label>
									<el-date-picker style="width: 100%;" type="datetime" v-model="end_date_org" :picker-options="{}" placeholder="Enter Date and TIme"></el-date-picker>
								</div>
							</div>
							<div class="col-md-2 col-sm-4">
								<label>GMT:</label>
								<select2 :options="gmt_options" v-model="gmt_daily_org">
									<option disabled value="0">Select one</option>
								</select2>
							</div>
							<div class="col-md-2 col-sm-4">
								<label>Web:</label>
								<select2 :options="web_options" v-model="web_daily_org">
									<option disabled value="0">Select one</option>
								</select2>
							</div>
							<div class="col-md-2 col-sm-4">
								<a class="btn btn-primary m-top-25 full-width">
									Query
								</a>
							</div>
							<div class="clearfix"></div>
						</div>
						<div class="clearfix"></div>
						<div class="table_filters pull-right">
							<div class="inline-block select_min_wrapper">
								<span class="inline-block">Page row:</span>
								<select2 :options="page_rows" v-model="selected1" class="inline-block">
								</select2>
							</div>
							<el-select style="width: 50%!important;" v-model="daily_table_column" multiple placeholder="Show/Hide Columns" @change="handleChange1">
								<el-option v-for="item in daily_table_column_options" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</div>
 						<span class="table_time chart_time margin_0">
							09/23/2016 17:34:52 +0000
						</span>
						<div class="clearfix"></div>
						<div class="table-responsive">
							<table class="table table-striped table-hover carrier_groups centrum">
								<thead>
								<tr>
									<th v-if="showcolumns_host[0]" rowspan="2" colspan="1">Client Name</th>

									<th v-if="(showcolumns_host[1] && showcolumns_host[2])" rowspan="1" colspan="2">2017-02-02</th>
									<th  v-else-if="(((showcolumns_host[1] == false) || (showcolumns_host[2] == false)) && !((showcolumns_host[1] == false) && (showcolumns_host[2] == false)))" colspan="1">2017-02-02</th>


									<th v-if="showcolumns_host[3]" rowspan="2" colspan="1">Total Duration(Min)</th>
									<th v-if="showcolumns_host[4]" rowspan="2" colspan="1">Total Billable Time(Min)</th>
								</tr>
								<tr>
									<th v-if="showcolumns_host[1]" rowspan="1" colspan="1">Duration</th>
									<th v-if="showcolumns_host[2]" rowspan="1" colspan="1">Billable Time</th>
								</tr>

								</thead>
								<tbody>
								<tr v-for="origination in daily_originations">
									<td v-if="showcolumns_host[0]">{{origination.client_name}}</td>
									<td v-if="showcolumns_host[1]">{{origination.duration}}</td>
									<td v-if="showcolumns_host[2]">{{origination.billable_time}}</td>
									<td v-if="showcolumns_host[3]">{{origination.total_duration_time}}</td>
									<td v-if="showcolumns_host[4]">{{origination.total_billable_time}}</td>
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
					<tab label="Daily Termination" class="" icon="dnl_icon dnl_to_right">
						<div class="advanced_search_filter_panel">
							<div class="col-md-2 col-sm-4">
								<label>Period:</label>
								<select2 :options="period_options" v-model="period_time_4">
									<option disabled value="0">Select one</option>
								</select2>
							</div>
							<div v-if="showOriginationDates" class="col-md-4 col-sm-8">
								<div class="inlined">
									<label for="start_date_term">Start Time:</label>
									<el-date-picker style="width: 100%;" type="datetime" v-model="start_date_term" :picker-options="{}" placeholder="Enter Date and TIme"></el-date-picker>
								</div>
								<div class="inlined">
									<label for="end_date_term">End Time:</label>
									<el-date-picker style="width: 100%;" type="datetime" v-model="end_date_term" :picker-options="{}" placeholder="Enter Date and TIme"></el-date-picker>
								</div>
							</div>
							<div class="col-md-2 col-sm-4">
								<label>GMT:</label>
								<select2 :options="gmt_options" v-model="gmt_daily_term">
									<option disabled value="0">Select one</option>
								</select2>
							</div>
							<div class="col-md-2 col-sm-4">
								<label>Web:</label>
								<select2 :options="web_options" v-model="web_daily_term">
									<option disabled value="0">Select one</option>
								</select2>
							</div>
							<div class="col-md-2 col-sm-4">
								<a class="btn btn-primary m-top-25 full-width">
									Query
								</a>
							</div>
							<div class="clearfix"></div>
						</div>
						<div class="clearfix"></div>
						<div class="table_filters pull-right">
							<div class="inline-block select_min_wrapper">
								<span class="inline-block">Page row:</span>
								<select2 :options="page_rows" v-model="selected1" class="inline-block">
								</select2>
							</div>
							<div class="inline-block fix_medium_select">
								<el-select v-model="daily_term_table_column" multiple placeholder="Show/Hide Columns" @change="handleChange_daily_term">
								<el-option v-for="item in daily_term_table_column_options" :key="item.value" :label="item.label" :value="item.value">
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
									<th v-if="showcolumns_daily_term[0]" rowspan="2" colspan="1">Client Name</th>
									<th v-if="(showcolumns_daily_term[1] && showcolumns_daily_term[2])" rowspan="1" colspan="2">2017-02-02</th>
									<th  v-else-if="(((showcolumns_daily_term[1] == false) || (showcolumns_daily_term[2] == false)) && !((showcolumns_daily_term[1] == false) && (showcolumns_daily_term[2] == false)))" colspan="1">2017-02-02</th>
								</tr>
								<tr>
									<th v-if="showcolumns_daily_term[1]" rowspan="1" colspan="1">Duration</th>
									<th v-if="showcolumns_daily_term[2]" rowspan="1" colspan="1">Billable Time</th>
								</tr>
								</thead>
								<tbody>
								<tr v-for="termination in daily_terminations">
									<td v-if="showcolumns_daily_term[0]">{{termination.client_name}}</td>
									<td v-if="showcolumns_daily_term[1]">{{termination.duration}}</td>
									<td v-if="showcolumns_daily_term[2]">{{termination.billable_time}}</td>
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
				</tabs>
			</div>
		</div>
	</div>
</template>

<script>
    const vTabs = require('vue!../main_components/tabs.vue'),
        vTab = require('vue!../main_components/tab.vue'),
        vSelect = require('vue!../main_components/select.vue'),
        vSpinner = require('vue!../main_components/fadeloader.vue'),
        Pagination = require('vue!../main_components/pagination.vue');
    const api = require("../../api");
    module.exports = {
        components: {
            'tabs': vTabs,
            'tab': vTab,
            'select2': vSelect,
            'spinner': vSpinner,
            'pagination': Pagination
        },
        data: function() {
            return {
                search_field: ['ingress_carrier', 'ingress_trunk', 'non_zero_calls', 'ingress_billed_time', 'non_zero_calls_30', '', 'non_zero_calls_6', '',
                    'ingress_billed_time','', '', 'npr_calls', ''],
                loading: false,
                title: 'Origination',
                active_tab_index: 0,
                active_tab_name: "Origination",
                codes_org: [],
                codes_term: [],
                ani_org: '',
                dnis_org: '',
                ani_term: '',
                dnis_term: '',
                egress_carrier_org: '',
                ingress_carrier_org: '',
                egress_carrier_term: '',
                ingress_carrier_term: '',
                backupDatas: [],
                more_advanced_option: true,
                more_advanced_option_button: "Less Options",
                by_hours_org: 1,
                by_hours_term: 1,
                by_hour_options: [
                    { id: 1, text: 'All Time', value: 0 },
                    { id: 2, text: 'By hours', value: 60 },
                    { id: 3, text: 'By day', value: 1440 },
                    { id: 4, text: 'By month', value: 43200 },
                    { id: 5, text: 'By year', value: 525600 },
                ],
                showOriginationDates: true,
                group_by_options: [
                    { id: '', text: '' },
                    { id: 'ingress Country', text: 'ingress Country' },
                    { id: 'ingress Code Name', text: 'ingress Code Name' },
                    { id: 'egress Carrier', text: 'egress Carrier' },
                    { id: 'Egress Trunk', text: 'Egress Trunk' },
                    { id: 'egress Country', text: 'egress Country' },
                    { id: 'egress Code Name', text: 'egress Code Name' },
                ],
                group_by_options_trunk: [
                    { id: '', text: '' },
                    { id: 'ingress Carrier', text: 'ingress Carrier' },
                    { id: 'ingress Trunk', text: 'ingress Trunk' },
                    { id: 'ingress Country', text: 'ingress Country' },
                    { id: 'ingress Code', text: 'ingress Code' },
                    { id: 'ingress Rate', text: 'ingress Rate' },
                    { id: 'ingress Code Name', text: 'ingress Code Name' },
                    { id: 'Egress Code', text: 'Egress Code' },
                    { id: 'egress Country', text: 'egress Country' },
                    { id: 'egress Code Name', text: 'egress Code Name' },
                ],
                showcolumns_origin: [true,true,true,true,true,true,true,true,true,true,true],

                origin_table_column: ['Ingress Carrier','Ingress Trunk','Not Zero Calls','Total(Min)','Count','%','Count1','%1','Billed Time(min)','ASR(%)','ACD(min)'],

                temp_origin_table_column: ['Ingress Carrier','Ingress Trunk','Not Zero Calls','Total(Min)','Count','%','Count1','%1','Billed Time(min)','ASR(%)','ACD(min)'],

                origin_table_column_options: [{
                value: 'Ingress Carrier',
                label: 'Ingress Carrier'
            }, {
                value: 'Ingress Trunk',
                label: 'Ingress Trunk'
            },{
                value: 'Not Zero Calls',
                label: 'Not Zero Calls'
            }, {
                value: 'Total(Min)',
                label: 'Total(Min)'
            }, {
                value: 'Count',
                label: 'Count'
            }, {
                value: '%',
                label: '%'
            }, {
                value: 'Count1',
                label: 'Count'
            }, {
                value: '%1',
                label: '%'
            }, {
                value: 'Billed Time(min)',
                label: 'Billed Time(min)'
            }, {
                value: 'ASR(%)',
                label: 'ASR(%)'
            }, {
                value: 'ACD(min)',
                label: 'ACD(min)'
            }],

            	showcolumns_daily_term: [true,true,true],
            	daily_term_table_column: ['Client Name','Duration','Billable Time'],
            	temp_daily_term_table_column: ['Client Name','Duration','Billable Time'],
            	 daily_term_table_column_options: [{
                value: 'Client Name',
                label: 'Client Name'
            }, {
                value: 'Duration',
                label: 'Duration'
            },{
                value: 'Billable Time',
                label: 'Billable Time'
            }],

                showcolumns_term: [true,true,true,true,true,true,true,true,true,true,true,true],

                termination_table_column: ['Engress Carrier','Engress Trunk','Not Zero Calls','Total(Min)','Count','%','Count1','%1','Billed Time(min)','ASR(%)','ACD(min)','NPR Count','NPR'],

                temp_termination_table_column: ['Engress Carrier','Engress Trunk','Not Zero Calls','Total(Min)','Count','%','Count1','%1','Billed Time(min)','ASR(%)','ACD(min)','NPR Count','NPR'],

             termination_table_column_options: [{
                value: 'Engress Carrier',
                label: 'Engress Carrier'
            }, {
                value: 'Engress Trunk',
                label: 'Engress Trunk'
            },{
                value: 'Not Zero Calls',
                label: 'Not Zero Calls'
            }, {
                value: 'Total(Min)',
                label: 'Total(Min)'
            }, {
                value: 'Count',
                label: 'Count'
            }, {
                value: '%',
                label: '%'
            }, {
                value: 'Count1',
                label: 'Count'
            }, {
                value: '%1',
                label: '%'
            }, {
                value: 'Billed Time(min)',
                label: 'Billed Time(min)'
            }, {
                value: 'ASR(%)',
                label: 'ASR(%)'
            }, {
                value: 'ACD(min)',
                label: 'ACD(min)'
            }, {
                value: 'NPR Count',
                label: 'NPR Count'
            }, {
                value: 'NPR',
                label: 'NPR'
            }],

                daily_table_column: ['Client Name','Duration','Billable Time','Total Duration(Min)','Total Billable Time(Min)'],
                temp_daily_table_column: ['Client Name','Duration','Billable Time','Total Duration(Min)','Total Billable Time(Min)'],


                daily_table_column_options: [{
                value: 'Client Name',
                label: 'Client Name'
            }, {
                value: 'Duration',
                label: 'Duration'
            },{
                value: 'Billable Time',
                label: 'Billable Time'
            }, {
                value: 'Total Duration(Min)',
                label: 'Total Duration(Min)'
            }, {
                value: 'Total Billable Time(Min)',
                label: 'Total Billable Time(Min)'
            }],
                tech_prefix: 'All',
                tech_prefix_options: [
                    { id: 'All', text: 'All' },
                ],
                page_rows: [
                    { id: 1, text: '10' },
                    { id: 2, text: '20' },
                    { id: 3, text: '30' },
                    { id: 4, text: '50' },
                    { id: 5, text: '100' }
                ],
                showcolumns_host: [true,true,true,true,true],
                ingress_trunk_options_org: [],
                egress_trunk_options_org: [],
                ingress_trunk_options_term: [],
                egress_trunk_options_term: [],
                carrier_options: [],
                web_options: [
                    { id: 'web', text: 'Web' },
                    { id: 'excel_csv', text: 'Excel CSV' },
                    { id: 'email_when_done', text: 'Email when done' },
                    { id: 'export_from_storage', text: 'Export from Storage' },
                ],
                period_options: [
                    { id: 'Custom', text: 'Custom' },
                    { id: 'Today', text: 'Today' },
                    { id: 'Yesterday', text: 'Yesterday' },
                    { id: 'Current week', text: 'Current week' },
                    { id: 'Previous week', text: 'Previous week' },
                    { id: 'Current month', text: 'Current month' },
                    { id: 'Previous month', text: 'Previous month' },
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
                pageOne: {
                    currentPage: 1,
                    totalPages: 10,
                    cntpage: 10
                },
                carriers: '',
                start_date_org: '',
                end_date_org: '',
                start_date_term: '',
                end_date_term: '',
                start_date_daily_org: '',
                end_date_daily_org: '',
                start_date_daily_term: '',
                end_date_daily_term: '',

                web: 'web',
                code: '',
                carrirers: '',
                ingress_trunk_org: '',
                ingress_trunk_term: '',
                tech_prefix: '',
                country_org: '',
                country_term: '',
                code_name: '',
                routing_plan: 'All',
                egress_trunk_org: '',
                egress_trunk_term: '',
                rate_type: '',
                switch_server: '',
                group_by1: 'ingress Country',
                group_by2: 'ingress Code Name',
                group_by3: 'egress Carrier',
                group_by4: 'Egress Trunk',
                group_by5: 'egress Country',
                group_by6: 'egress Code Name',
                selected1: '',
                selected2: '',
                rate_display: '',
                time_org: 'Custom',
                time_term: 'Custom',
                time_daily_org: 'Custom',
                time_daily_term: 'Custom',

                // optionsDaily: [
                //     { id: 1, value: 'client_name', text: 'Client Name' },
                //     { id: 2, value: 'duration', text: 'Duration' },
                //     { id: 3, value: 'billable_time', text: 'Billable Time' },
                //  ],
                ingresses: [],
                egresses: [],
                daily_originations: [
                    {
                        client_name: 'Client Name',
                        duration: '0',
                        billable_time: '0',
                        total_billable_time: '0',
                        total_duration_time: '0',
                    },
                    {
                        client_name: 'Client Name',
                        duration: '0',
                        billable_time: '0'
                    },
                    {
                        client_name: 'Client Name',
                        duration: '0',
                        total_billable: '0',
                        total_billable_time: '0',
                        total_duration_time: '0',
                    },
                    {
                        client_name: 'Client Name',
                        duration: '0',
                        total_billable: '2',
                        total_billable_time: '2',
                        total_duration_time: '2',
                    },
                    {
                        client_name: 'Client Name',
                        duration: '0',
                        billable_time: '0',
                        total_billable: '0.1',
                        total_billable_time: '0',
                        total_duration_time: '0',
                    }
                ],
                daily_terminations: [
                    {
                        client_name: 'Client Name',
                        duration: '0',
                        billable_time: '0'
                    },
                    {
                        client_name: 'Client Name',
                        duration: '0',
                        billable_time: '0'
                    },
                    {
                        client_name: 'Client Name',
                        duration: '0',
                        billable_time: '0'
                    },
                    {
                        client_name: 'Client Name',
                        duration: '0',
                        billable_time: '0'
                    },
                    {
                        client_name: 'Client Name',
                        duration: '0',
                        billable_time: '0'
                    }
                ]
            }
        },
        watch: {
            'time_term': function() {
                if (this.time_term == 'Custom') {
                    this.start_date_term == ""
                    this.end_date_term == ""
                } else if (this.time_term == 'Today') {
                    this.start_date_term = getStartTimeOfToday();
                    this.end_date_term = getEndTimeOfToday();
                } else if (this.time_term == 'Yesterday') {
                    this.start_date_term = getStartTimeOfYesterday();
                    this.end_date_term = getEndTimeOfYesterday();
                } else if (this.time_term == 'Current week') {
                    this.start_date_term = getStartTimeOfCurrentWeek();
                    this.end_date_term = getEndTimeOfCurrentWeek();
                } else if (this.time_term == 'Previous week') {
                    this.start_date_term = getStartTimeOfPreviousWeek();
                    this.end_date_term = getEndTimeOfPreviousWeek();
                } else if (this.time_term == 'Current month') {
                    this.start_date_term = getStartTimeOfCurrentMonth();
                    this.end_date_term = getEndTimeOfCurrentMonth();
                } else if (this.time_term == 'Previous month') {
                    this.start_date_term = getStartTimeOfPreviousMonth();
                    this.end_date_term = getEndTimeOfPreviousMonth();
                }
            },
            'time_org': function() {
                if (this.time_org == 'Custom') {
                    this.start_date_org == ""
                    this.end_date_org == ""
                } else if (this.time_org == 'Today') {
                    this.start_date_org = getStartTimeOfToday();
                    this.end_date_org = getEndTimeOfToday();
                } else if (this.time_org == 'Yesterday') {
                    this.start_date_org = getStartTimeOfYesterday();
                    this.end_date_org = getEndTimeOfYesterday();
                } else if (this.time_org == 'Current week') {
                    this.start_date_org = getStartTimeOfCurrentWeek();
                    this.end_date_org = getEndTimeOfCurrentWeek();
                } else if (this.time_org == 'Previous week') {
                    this.start_date_org = getStartTimeOfPreviousWeek();
                    this.end_date_org = getEndTimeOfPreviousWeek();
                } else if (this.time_org == 'Current month') {
                    this.start_date_org = getStartTimeOfCurrentMonth();
                    this.end_date_org = getEndTimeOfCurrentMonth();
                } else if (this.time_org == 'Previous month') {
                    this.start_date_org = getStartTimeOfPreviousMonth();
                    this.end_date_org = getEndTimeOfPreviousMonth();
                }
            }
        },
        methods: {
        	 handleChange1() {
            for (let i = 0; i < this.temp_daily_table_column.length; i++) {
                if (_.indexOf(this.daily_table_column, this.temp_daily_table_column[i]) != -1) {
                    Vue.set(this.showcolumns_host, i, true);
                }
                else {
                    Vue.set(this.showcolumns_host, i, false);
                }
            }
        },
          	 handleChangeTerm() {
            for (let i = 0; i < this.temp_termination_table_column.length; i++) {
                if (_.indexOf(this.termination_table_column, this.temp_termination_table_column[i]) != -1) {
                    Vue.set(this.showcolumns_term, i, true);
                }
                else {
                    Vue.set(this.showcolumns_term, i, false);
                }
            }
        },
         handleChangeOrigin() {
            for (let i = 0; i < this.temp_origin_table_column.length; i++) {
                if (_.indexOf(this.origin_table_column, this.temp_origin_table_column[i]) != -1) {
                    Vue.set(this.showcolumns_origin, i, true);
                }
                else {
                    Vue.set(this.showcolumns_origin, i, false);
                }
            }
        },
         handleChange_daily_term() {
            for (let i = 0; i < this.temp_daily_term_table_column.length; i++) {
                if (_.indexOf(this.daily_term_table_column, this.temp_daily_term_table_column[i]) != -1) {
                    Vue.set(this.showcolumns_daily_term, i, true);
                }
                else {
                    Vue.set(this.showcolumns_daily_term, i, false);
                }
            }
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
                    else if(this.active_tab_index == 1) {
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
                        if(this.ingress_carrier_org == undefined) return;
                        else {
                            ingress_carrier = this.ingress_carrier_org;
                            this.ingress_trunk_org = '';
                        }
                    }
                    else if(this.active_tab_index == 1) {
                        if(this.ingress_carrier_term == undefined) return;
                        else {
                            ingress_carrier = this.ingress_carrier_term;
                            this.ingress_trunk_term = '';
                        }
                    }

                    url = api.getEndpointUrl() + '/v1/carrier/' + ingress_carrier + '/ingress_trunk/list';
                }
                this.loading = true;
                this.$http.get(url)
                    .then(response => {
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
                                else if(this.active_tab_index == 1) {
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
                                else if(this.active_tab_index == 1) {
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
                        console.log(error);
                        this.loading = false;
                    })
            },
            changeIngress() {
                this.fetchRelatedTrunks('ingress');
            },
            changeEgress() {
                this.fetchRelatedTrunks('egress');
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
                this.group_by6 = '';
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
                                            else if(this.active_tab_index == 1)
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
            makeDatas: function()
            {
                if(this.backupDatas.length == 0) return;
                var displayArray = new Array();
                for(var i = 0; i < this.backupDatas.length - 1; i++)
                {
                    var value = new Array();
                    value["group_time"] = formatDateFromStamp(this.backupDatas[i]['time']);
                    for(var j = 0; j < this.search_field.length; j++)
                    {
                        value[this.search_field[j]] = this.backupDatas[i][this.search_field[j]];
                    }
                    value["inbound_avg_rate"] = this.calcValue(value["ingress_cost"], value["ingress_billed_time"]);
                    value["outbound_avg_rate"] = this.calcValue(value["egress_cost"], value["egress_billed_time"]);
                    value["profit"] = value["ingress_cost"] - value["egress_cost"];
                    value["profit_percent"] = this.calcValue(value["profit"], value["egress_cost"]);
                    value["asr"] = this.calcValue(value["non_zero_calls"], value["ingress_calls"]);
                    value["acd"] = this.calcValue(value["ingress_time"], value["non_zero_calls"], 1);
                    displayArray[i] = value;
                }
                this.searchResults = displayArray;
                this.loading = false;
            },
            fetchReport: function(start_time, end_time, step, filterURL, field_ind = 0, method = 'total') {
                this.loading = true;

                var fields = '';
                 search_field.forEach(function(field, i) {
                    fields += field + ",";
                });
                if (fields.length > 0)
                    fields = fields.substr(0, fields.length - 1);

                var strURL = api.getReport_URL() + "?start_time=" + start_time + "&end_time=" + end_time + "&step=" + step + "&method=" + method + "&field=" + fields;
                strURL += filterURL;
                this.$http.get(strURL)
                    .then(function(response) {
                        this.backupDatas = response.body.data;
                        this.makeDatas();
                    }, function(error) {
                        console.log(error);
                        this.loading = false;
                    });
            },
            searchReport: function(type) {
                var start_time, end_time, step, by_hours;
                if (type == 'orig') {
                    if (this.start_date_org == "") {
                        start_time = new Date();
                    }
                    else {
                        start_time = new Date(this.start_date_org);
                    }

                    if (this.end_date_org == "") {
                        end_time = new Date();
                    }
                    else {
                        end_time = new Date(this.end_date_org);
                    }
                    by_hours = this.by_hours_org;
                }
                else if (type == 'term') {
                    if (this.start_date_term == "") {
                        start_time = new Date();
                    }
                    else {
                        start_time = new Date(this.start_date_term);
                    }

                    if (this.end_date_term == "") {
                        end_time = new Date();
                    }
                    else {
                        end_time = new Date(this.end_date_term);
                    }
                    by_hours = this.by_hours_term;
                }

                start_time = new Date(start_time + " GMT").getTime() / 1000;
                end_time = new Date(end_time + " GMT").getTime() / 1000;

                if (by_hours == 1) {
                    var diffMs = (end_time - start_time) * 1000;
                    var diffDays = Math.floor(diffMs / 86400000); // days
                    var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
                    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
                    step = diffDays * 1440 + diffHrs * 60;
                    if (diffMins % 60 == 0)
                        step += diffMins;
                    else {
                        diffMins = diffMins - (diffMins % 60);
                    }
                }
                else
                    step = this.by_hour_options[by_hours - 1].value;

                this.makeURL().then(filterURL => {
                    this.originations = [];
                    this.terminations = [];
                    if (step != 0)
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
                else if(this.active_tab_index == 1) {
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
                    else if(this.active_tab_index == 1) {
                        this.codes_term = [];
                    }
                    if(this.active_tab_index == 0 || this.active_tab_index == 1) {
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
                            else if(this.active_tab_index == 1) {
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
            showAdvanced() {
                if (this.more_advanced_option) {
                    this.more_advanced_option = false;
                    this.more_advanced_option_button = "More Options";
                }
                else {
                    this.more_advanced_option = true;
                    this.more_advanced_option_button = "Less Options";
                }
            },
            fetchAllTrunks(type) {
                var url;
                if (type == 'egress')
                    url = api.getEndpointUrl() + '/v1/trunk/egress/list';
                else if (type == 'ingress')
                    url = api.getEndpointUrl() + '/v1/trunk/ingress/list';
                this.$http.get(url)
                    .then(response => {
                        const body = response.body
                        if (body.success) {
                            const trunks = body.payload.items
                            console.log(trunks);
                            var self = this;
                            if (type == 'egress') {
                                this.egress_trunk_options = [];
                                this.egress_trunk_options.push('');
                                trunks.forEach(function(temp, i) {
                                    var trunk = {};
                                    trunk.id = temp.resource_id;
                                    trunk.text = temp.name;
                                    self.egress_trunk_options.push(trunk);
                                });
                            }
                            else if (type == 'ingress') {
                                this.ingress_trunk_options = [];
                                this.ingress_trunk_options.push('');
                                trunks.forEach(function(temp, i) {
                                    var trunk = {};
                                    trunk.id = temp.resource_id;
                                    trunk.text = temp.name;
                                    self.ingress_trunk_options.push(trunk);
                                });
                            }
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    })
            },
            fetchCarriers() {
                var per_page = 1;
                var url = api.getEndpointUrl() + "/v1/carrier/list?per_page=" + per_page
                this.loading = true;

                return new Promise((resolve, reject) => {
                    this.$http.get(url)
                        .then(response => {
                            const body = response.body
                            if (body.success) {
                                var codes = body.payload.items
                                this.loading = false;
                                per_page = body.payload.total;

                                url = api.getEndpointUrl() + "/v1/carrier/list?per_page=" + per_page
                                this.loading = true;
                                this.$http.get(url)
                                    .then(response => {
                                        const body = response.body
                                        if (body.success) {
                                            var self = this;
                                            var carriers = body.payload.items

                                            this.carrier_options.push({ id: '', text: '' });
                                            carriers.forEach(function(temp, i) {
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
            toggleTable(event) {
                var element = event.currentTarget;
                $(element).parents('tr').siblings('.collapse').toggleClass('in');
            },
            pageOneChanged(pageNum) {
                this.pageOne.currentPage = pageNum
            },
        },
        created() {
            // this.orig_selected_show_fields = this.backup_orig_selected_show_fields.slice(0);
            // this.term_selected_show_fields = this.backup_term_selected_show_fields.slice(0);
            this.fetchCarriers().then(() => {
                this.searchReport('orig');
            }).catch(error => {
                console.log(error);
            });
            // this.fetchAllTrunks('egress');
            // this.fetchAllTrunks('ingress');
            // this.fetchRateTable();
            // this.fetchRoutePlans();
            // this.fetchDailyReport();
        }
    }
</script>

<style>
.select2-container--default .select2-results>.select2-results__options{
	overflow-y: scroll;
}
	.wrapper.single .white_pad.m-bottom-10 {
		margin-bottom: 10px;
	}

	@media (max-width: 480px) {
		#app>div.container-fluid>div>div>div>div.tabs_container>div:nth-child(1)>div.advanced_search_filter_panel>div:nth-child(4)>span {
			padding-bottom: 30px;
		}
	}
</style>