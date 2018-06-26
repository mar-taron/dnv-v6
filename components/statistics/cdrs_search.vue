<template>
	<div class="container-fluid">
	   <modal v-if="showModal=='cdr_email'" @close="showModal = ''" class="big_modal">
		<h3 slot="header">CDR E-mail</h3>
		<div slot="body">
		  <div class="row">
			<div class="col-md-6 col-sm-6">
				<div class="form-group">
					<label for="groupname">From:</label>
					<select2 :options="options" v-model="from"></select2>
				</div>
		    </div>
			<div class="col-md-6 col-sm-6">
				<div class="form-group">
					<label for="to">To:</label> 
					<input type="text" name="to" v-model="to" placeholder="Enter Address" class="form-control">
				</div>
		    </div>
			<div class="col-md-6 col-sm-6">
				<div class="form-group">
					<div class="radio radio-success">
						<input id="radio-1" class="radio-custom" name="email_template" type="radio" checked>
						<label for="radio-1" class="radio-custom-label">User Default Template</label>
					</div>
				</div>
			</div>
			<div class="col-md-6 col-sm-6">
				<div class="form-group">
					<div class="radio radio-success">
						<input id="radio-2" class="radio-custom" name="email_template" type="radio">
						<label for="radio-2" class="radio-custom-label">Specify Your Email Content</label>
					</div>
				</div>
			</div>
			<div class="col-md-6 col-sm-6">
				<div class="form-group">
					<label for="copy">Copy:</label> 
					<input type="text" name="copy" v-model="copy" placeholder="Enter Copy" class="form-control">
				</div>
			</div>
			<div class="col-md-6 col-sm-6">
				<div class="form-group">
					<label for="subject">Subject:</label> 
					<input type="text" name="subject" v-model="subject" placeholder="Enter Subject" class="form-control">
				</div>
			</div>
			<div class="col-md-12 ">
			  <label>Content:</label>
			  <ckeditor v-model="contentA" :id="editorA" :height="'280px'" :toolbar="[['Format']]"></ckeditor>
		    </div>
		    <div class="col-md-12 m-top-20">
				<div class="form-group tags">
					<label for="groupname">Tags:</label> 
					<span class="label label-default">#Username</span>
					<span class="label label-default">#Url</span>
					<span class="label label-default">#Welcoms</span>
				</div>
			</div>
		  </div>
		</div>
		<div slot="footer">
			<button @click="" class="btn btn-primary mini submit">Submit</button>
			<button @click="closeModal" class="btn btn-default mini cancel">Cancel</button>
		</div>
	  </modal>
      <div class="row">
		<div class="wrapper single big_data">
			<time-display></time-display>
			<ol class="breadcrumb">
				  <li class="breadcrumb-item"><a href="#">Statistics</a></li>
                  <li class="breadcrumb-item active">CDRs List</li>
				  <li class="breadcrumb-item active"> {{ lastNode }} </li>
			</ol>
			<div class="page" style = "display:inline-block">
			    <h1 class="page-header">CDRs Search</h1>
			</div>
			<a class="btn btn-primary pull-right mini m-top-10" v-show="refresh">
				<span class="dnl_icon dnl_reload"></span> Refresh 
			</a>
			<spinner v-show="loading" class="spinner"></spinner>

			<tabs @activateTab="changeTab">
				<tab label="CDR Search" class="" icon="dnl_icon dnl_list" selected>
					<div class="advanced_search_filter_panel">

						<div class="col-md-2 col-sm-4">
							<label>Time:</label>
							<select2 :options="period_options" v-model="time">
								<option disabled value="0">Select one</option>
							</select2>
						</div>
						<div class="col-md-4 col-sm-8">
							<div class="inlined" >
								<label for="start_date">Start Time:</label>
								<el-date-picker style="width: 100%;" type="datetime" v-model="start_date" :picker-options="{}" placeholder="Enter Date and Time"></el-date-picker>
							</div>
							<div class="inlined">
								<label for="end-date">End Time:</label>
								<el-date-picker style="width: 100%;" type="datetime" v-model="end_date" :picker-options="{}" placeholder="Enter Date and Time"></el-date-picker>
							</div>
						</div>
						<div class="col-md-6 col-sm-12 none-left-padding none-right-padding">
							<!-- <div class="inlined"> -->
								<div class="col-md-3 col-sm-3">
									<label>GMT:</label>
									<select class="selectable width-100" v-model="gmt">
										<option v-for="gmt_item in gmt_options" v-bind:value="gmt_item.id">
											{{ gmt_item.text }}
										</option>
									</select>
								</div>
								<div class="col-md-3 col-sm-3">
									<label>Web:</label>
									<select2 :options="web_options" v-model="web">
										<option disabled value="0">Select one</option>
									</select2>
								</div>
								<!-- <div class="clearfix"></div> -->
							<!-- </div> -->
							<!-- <div class="inlined"> -->
								<div class="col-md-3 col-sm-3">
									<a class="btn btn-primary full-width m-top-25" v-on:click="searchReport()">
										Query
									</a>
								</div>
								<div class="col-md-3 col-sm-3 pad-left pad-right">
									<a class="btn btn-primary full-width m-top-25"  v-on:click="showAdvanced()">
										{{more_advanced_option_button}}
									</a>
								</div>
								<div class="clearfix"></div>
							<!-- </div> -->
						</div>
						<div class="clearfix little-space"></div>
						<div class = "row" v-show="more_advanced_option" >
						<div class="col-md-4 col-sm-6">
							<div class="white_pad less_pad">
								<h1 class="page-header">Inbound</h1>
								<div class="row">
								<div class="col-md-6 first">
									<label>Carriers:</label>
									<select class="selectable no-min-width" v-model="ingress_carrier" @change="changeIngress">
										<option v-for="item in carrier_options" v-bind:value="item.id">
											{{ item.text }}
										</option>
									</select>
								</div>
								<div class="col-md-6 second">
									<label>Ingress:</label>
									<select class="selectable no-min-width" v-model="ingress_trunk">
										<option v-for="item in ingress_trunk_options" v-bind:value="item.id">
											{{ item.text }}
										</option>
									</select>
								</div>
								<div class="clearfix little-space"></div>
								<!-- <div class="col-md-6 first">
									<label>Tech Prefix:</label>
									<select2 :options="options" v-model="carriers">
										<option disabled value="0">Select one</option>
									</select2>
								</div> -->
								<div class="col-md-6 first">
									<label for="country">Country:</label>
									<input type="text" name="country" v-model="country" class="form-control" placeholder="Enter Country">
								</div>
								<div class="col-md-6 second">
									<label for="code_name">Code Name:</label>
									<input type="text" name="code_name" v-model="code_name" class="form-control" placeholder="Enter Code Name">
								</div>
								<div class="clearfix little-space"></div>
								<div class="col-md-6 first">
									<label for="code">Code:</label>
									<input type="text" name="code" v-model="code" class="form-control" placeholder="Enter Code">
								</div>
								<!-- <div class="col-md-6 second">
									<label>Duration:</label>
									<select2 :options="duration_options" v-model="duration">
										<option disabled value="0">Select one</option>
									</select2>
								</div> -->
								<div class="clearfix little-space"></div>
								<div class="col-md-6 first">
									<label for="ani">ANI:</label>
									<input type="text" name="ani" v-model="ani" class="form-control" placeholder="Enter ANI">
								</div>
								<!-- <label for="orig_call_id">Orig Call ID</label>
								<div class="col-md-6 second">
									<input type="text" name="orig_call_id" v-model="orig_call_id" class="form-control" placeholder="Enter Orig Call ID">
								</div> -->
								<div class="clearfix little-space"></div>
								<div class="col-md-6 first">
									<label>DNIS:</label>
									<select2 :options="dnis_options" v-model="dnis">
										<option disabled value="0">Select one</option>
									</select2>
								</div>
								<div class="col-md-6 second">
									<label for="dnis2" class="m-top-15"></label>
									<input type="text" name="dnis2" v-model="dnis2" class="form-control" placeholder="Enter DNIS">
								</div>
								<div class="clearfix little-space"></div>
								<!-- <div class="col-md-6 first">
									<label>Show:</label>
									<select2 :options="show_options" v-model="show">
										<option disabled value="0">Select one</option>
									</select2>
								</div> -->
								<!-- <div class="col-md-6 second">
									<label for="response_code" class="m-top-15"></label>
									<input type="text" name="response_code" v-model="response_code" class="form-control" placeholder="Response Code">
								</div>
								<div class="clearfix little-space"></div>
								<div class="col-md-6 second">
									<label>Release Cause:</label>
									<select2 :options="options" v-model="release_cause">
										<option disabled value="0">Select one</option>
									</select2>
								</div> -->
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
									<select class="selectable no-min-width" v-model="egress_carrier" @change="changeEgress">
										<option v-for="item in carrier_options" v-bind:value="item.id">
											{{ item.text }}
										</option>
									</select>
								</div>
								<div class="col-md-6 second">
									<label>Egress Trunk:</label>
									<select class="selectable no-min-width" v-model="egress_trunk">
										<option v-for="item in egress_trunk_options" v-bind:value="item.id">
											{{ item.text }}
										</option>
									</select>
								</div>
								<!-- <div class="clearfix little-space"></div>	
								<div class="col-md-6 first">
									<label for="country">Country:</label>
									<input type="text" name="country" v-model="country" class="form-control" placeholder="Enter Country">
								</div>
								<div class="col-md-6 second">
									<label for="code_name">Code Name:</label>
									<input type="text" name="code_name" v-model="code_name" class="form-control" placeholder="Enter Code Name">
								</div>
								<div class="clearfix little-space"></div>
								<div class="col-md-6 first">
									<label for="code">Code:</label>
									<input type="text" name="code" v-model="code" class="form-control" placeholder="Enter Code">
								</div> -->
								<!-- <div class="col-md-6 second">
									<label>Class4-server:</label>
									<select2 :options="options" v-model="class4_server">
										<option disabled value="0">Select one</option>
									</select2>
								</div> -->
								<!-- <div class="clearfix little-space"></div>
								<div class="col-md-6 first">
									<label for="interval_second">Interval Second:</label>
									<input type="text" name="interval_second" v-model="interval_second" class="form-control" placeholder="Enter Interval">
								</div>
								<div class="col-md-6 second">
									<label for="interval_second2" class="m-top-15"></label>
									<input type="text" name="interval_second2" v-model="interval_second2" class="form-control" placeholder="Enter Interval">
								</div>
								<div class="clearfix little-space"></div>
								<div class="col-md-6 first">
									<label>Response from Egress:</label>
									<select2 :options="options" v-model="response_from_egress">
										<option disabled value="0">Select one</option>
									</select2>
								</div>
								<div class="col-md-6 second">
									<label for="response_code" class="m-top-15"></label>
									<input type="text" name="response_code" v-model="response_code" class="form-control" placeholder="Response Code">
								</div> -->
								<!-- <div class="clearfix little-space"></div>
								<div class="col-md-6 first">
									<label for="ani">ANI:</label>
									<input type="text" name="ani" v-model="ani" class="form-control" placeholder="Enter ANI">
								</div>
								<div class="col-md-6 second">
									<label for="term_call_id">Term Call ID</label>
									<input type="text" name="term_call_id" v-model="term_call_id" class="form-control" placeholder="Enter Term Call ID">
								</div>
								<div class="clearfix little-space"></div>
								<div class="col-md-6 first">
									<label>DNIS:</label>
									<select2 :options="dnis_options" v-model="dnis">
										<option disabled value="0">Select one</option>
									</select2>
								</div>
								<div class="col-md-6 second">
									<label for="dnis2" class="m-top-15"></label>
									<input type="text" name="dnis2" v-model="dnis2" class="form-control" placeholder="Enter DNIS">
								</div> -->
								<div class="clearfix"></div>
								</div>
							</div>
						</div>
						<div class="col-md-4 col-sm-12">
							<div class="white_pad less_pad">
								<h1 class="page-header">Fields</h1>
								<label for="groupname">Show Fields:</label>
								<select multiple class="multi cdrs-search-field" v-model = "selected_show_fields">
									<option v-for="option in show_field_options" :value='option.value'>{{option.text}}</option>
								</select>								
								<div class="clearfix"></div>
							</div>
							<div class="clearfix"></div>
							<div class="inlined">															
								<a class="btn btn-primary full-width">
									Save fields as default 
								</a>
							</div>							
						</div>
						<div class="clearfix"></div>						
					</div>
					</div>
					<!-- <span class="table_time chart_time margin_0">
						09/23/2016 17:34:52 +0000
					</span> -->
					<div class="clearfix"></div>
					<div class="table-responsive">
						<table class="table table-striped table-hover carrier_groups centrum">
						  <thead>
							<tr>
								<th v-for="column in show_table_columns ">{{ column }}</th>
							</tr>							
						  </thead>
						  <tbody>
							<tr v-if="!filterBy(cdrs, cdr).length">
								<td style="text-align: center" colspan="13">No Data Found</td>
							</tr>
							<tr v-for="cdr in cdrs">
							  <td v-for="show_field in selected_show_fields">{{ cdr[show_field] }}</td>							  
							</tr>
						  </tbody>
						</table>
					</div>
				</tab>
				<tab label="CDR Export Log" class="" icon="dnl_icon dnl_qos_report">
					<div class="advanced_search_filter_panel">
						<div class="col-md-2 col-xs-6 col-sm-2 pad-left pad-right marg-top-6" style="text-align: right;">
							<label for="time_1"> Triggered Time:</label>
						</div>
						<div class="col-md-5 col-sm-5 none-left-padding none-right-padding">
							<div class="inlined triggeredTime col-md-6">
 								<el-date-picker style="width: 100%;" type="datetime" v-model="start_date" :picker-options="{}" placeholder="Enter Date and TIme"></el-date-picker>
							</div>
							<div class="inlined triggeredTime col-md-6">
 								<el-date-picker style="width: 100%;" type="datetime" v-model="end_date" :picker-options="{}" placeholder="Enter Date and TIme"></el-date-picker>

							</div>
						</div>
						<div class="col-sm-3 queryButton">
							<a class="col-md-1 btn btn-primary mini m-top-20" style="margin-top: 0px;">
								Query
							</a>
						</div>
						<!--<div class="col-md-2 col-sm-3">
								<a class="btn btn-primary full-width m-top-25" v-on:click="">
										Submit
								</a>
						</div>-->
					<div class="clearfix little-space"></div>
					</div>
					<div class="table_filters">
						<div class="inline-block select_min_wrapper">
							<span class="inline-block">Page row:</span>
							<select2 :options="page_rows" v-model="page_row_count" class="inline-block" @pagecount="changePageCount">
							</select2>
						</div>
						<div class="inline-block pull-right fix_medium_select">
							<el-select v-model="table_columns" multiple placeholder="Show/Hide Columns" @change="handleChange">
								<el-option v-for="item in column_options" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</div>
					</div>
					<div class="table-responsive">
						<table class="table table-striped table-hover carrier_groups centrum">
						  <thead>
							<tr>
								<th v-if="showcolumns[1]"><span >Job ID</span></th>
								<th v-if="showcolumns[2]"><span >Triggered Start Time</span></th>
								<th v-if="showcolumns[3]"><span >Triggered End Time</span></th>
								<th v-if="showcolumns[4]"><span >Start Time</span></th>
								<th v-if="showcolumns[5]"><span >End Time</span></th>
								<th v-if="showcolumns[6]"><span >Status</span></th>
								<th v-if="showcolumns[7]"><span >Progress(h)</span></th>
								<th v-if="showcolumns[8]"><span >Number of Rows</span></th>
								<th v-if="showcolumns[9]"><span>File Size</span></th>
								<th v-if="showcolumns[10]" class="width-170">Action</th>
							</tr>
						  </thead>
						  <tbody v-for="cdr_log in cdr_logs">
							<tr>
							  <td v-if="showcolumns[1]"> {{cdr_log.job_id}}</td>
							  <td v-if="showcolumns[2]"> {{cdr_log.tiggered_start_time}}</td>
							  <td v-if="showcolumns[3]"> {{cdr_log.tiggered_end_time}}</td>
							  <td v-if="showcolumns[4]"> {{cdr_log.start_time}}</td>
							  <td v-if="showcolumns[5]"> {{cdr_log.end_time}}</td>
							  <td v-if="showcolumns[6]"> {{cdr_log.status}}</td>
							  <td v-if="showcolumns[7]"> {{cdr_log.progress}}</td>
							  <td v-if="showcolumns[8]"> {{cdr_log.row_numbers}}</td>
							  <td v-if="showcolumns[9]"> {{cdr_log.file_size}}</td>
							  <td v-if="showcolumns[10]">
								  <a class="action action_info" data-toggle="tooltip" data-placement="top" title="Progress Info">
									  <span class="dnl_icon dnl_info"></span>
								   </a>
								   <a class="action action_menu" data-toggle="tooltip" data-placement="top" title="Download">
									  <span class="dnl_icon dnl_download"></span>
								   </a>
								   <a class="action action_rollback" data-toggle="tooltip" data-placement="top" title="Reprocess">
									  <span class="dnl_icon dnl_reply"></span>
								   </a>
								   <a @click="showModal = 'cdr_email'" class="action action_send" data-toggle="tooltip" title="Send E-mail">
									  <span class="dnl_icon dnl_support"></span>
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
		  multiselect = require('multiselect'),
		  Pagination = require('vue!../main_components/pagination.vue'),
		  modal = require('vue!../main_components/modal.vue'),
		  Ckeditor = require('vue!../main_components/ckeditor.vue');
		  const api = require("../../api");
		  const auth = require("../../auth");
		  _ = require('lodash');
	module.exports = {
		created: function(){
			// this.getToken();			
			this.fetchCodes();
			this.fetchCarriers();
			this.selected_show_fields = this.backup_selected_show_fields.slice(0);
			this.searchReport();
			//this.fetchAllTrunks('egress');
			//this.fetchAllTrunks('ingress');
		},
		components: {
			'tabs': vTabs,
			'tab': vTab,
			'select2': vSelect,
			'spinner': vSpinner,
			'multiselect': multiselect,
			'pagination': Pagination,
			'modal': modal,
			Ckeditor
		},
		data: function(){
            return {
                showcolumns: [true, true, true, true, true, true, true, true, true, true],
                lastNode: 'CDR Search',
				dnis_options: [
					{id: 'with_prefix', text: 'With Prefix'},
					{id: 'without_prefix', text: 'Without Prefix'},
				],
				dnis: 'with_prefix',
				// show_options: [
				// 	{id: 'show_all', text: 'Show All'},
				// 	{id: 'authorized_ips_only', text: 'Authorized IPs only'},
				// ],
				// duration_options: [
				// 	{id: 'all', text: 'all'},
				// 	{id: 'non-zero', text: 'non-zero'},
				// 	{id: 'zero', text: 'zero'},
				// ],
				page_row_count: 1,
				page_rows: [
					{ id: 1, text: '10' },
					{ id: 2, text: '20' },
					{ id: 3, text: '30' },
					{ id: 4, text: '50' },
					{ id: 5, text: '100' }
				],
				ingress_trunk_options: [],
				egress_trunk_options: [],
				egress_carrier: '',
				ingress_carrier: '',
				ingress_trunk: '',
				egress_trunk: '',
				country: '',
				code_name: '',
				code: '',
				codes: [],
				carrier_options: [{id: '', text: ''}],				
				web: 'web',
				columnVisibility: {
                    job_id: true,
                    triggered_start_time: true,
                    triggered_end_time: true,
                    start_time: true,
                    end_time: true,
                    status: true,
					progress: true,
                    number_of_rows: true,
                    file_size: true
                },

                options2: [
                    { id: 1, text: 'Job ID' },
                    { id: 2, text: 'Triggered Start Time' },
                    { id: 3, text: 'Triggered End Time' },
                    { id: 4, text: 'Start Time' },
                    { id: 5, text: 'End Time' },
                    { id: 6, text: 'Status' },
                    { id: 7, text: 'Progress(h)' },
                    { id: 8, text: 'Number of Rows' },
                    { id: 9, text: 'File Size' },

                ],
                table_columns: ['Job ID', 'Triggered Start Time', 'Start Time',
                    'End Time', 'Progress(h)', 'Number of Rows', 'File Size'],
                column_options: [{
                    value: 'Job ID',
                    label: 'Job ID'
                }, {
                    value: 'Triggered Start Time',
                    label: 'Triggered Start Time'
                },
                    {
                        value: 'Triggered End Time',
                        label: 'Triggered End Time'
                    },
					{
                    value: 'Start Time',
                    label: 'Start Time'
                }, {
                    value: 'End Time',
                    label: 'End Time'
                }, {
                    value: 'Progress(h)',
                    label: 'Progress(h)'
                }, {
                    value: 'Number of Rows',
                    label: 'Number of Rows'
                }, {
                    value: 'File Size',
                    label: 'File Size'
                },
                    {
                        value: 'Action',
                        label: 'Action'
                    }

                ],
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
				time: 'Custom',
				period_options: [
					{id: 'Custom', text: 'Custom'},
					{id: 'Today', text: 'Today'},
					{id: 'Yesterday', text: 'Yesterday'},
					{id: 'Current week', text: 'Current week'},
					{id: 'Previous week', text: 'Previous week'},
					{id: 'Current month', text: 'Current month'},
					{id: 'Previous month', text: 'Previous month'},
				],
				pageOne: {
					currentPage: 1,
					totalPages: 10,
					cntpage: 10
				},
				// route_types: [
				//   { id: 1, text: 'Fail to Next Host' },
				//   { id: 2, text: 'Fail to Next Trunk' },
				//   { id: 3, text: 'Stop' },
			  	// ],
				selected_show_fields: [],
				backup_selected_show_fields: ['call_duration', 'egress_id', 'ingress_id', 'origination_destination_number', 'pdd', 'origination_source_number', 'release_cause', 
				'time', 'release_cause_from_protocol_stack', 'orig_call_duration'],
				show_table_columns: [],
				show_table_fields: '',
				show_field_options: [
				  { id: 1, value: 'release_cause', text: 'Release Cause' }, 
				  { id: 2, value: 'start_time_of_date', text: 'Start Time' }, //
				  { id: 3, value: 'answer_time_of_date', text: 'Answer Time' }, //
				  { id: 4, value: 'release_tod', text: 'End Time' }, 
				  { id: 5, value: 'minutes_west_of_greenwich_mean_time', text: 'Minutes West of Greenwich Mean Time' }, //
				  { id: 6, value: 'release_cause_from_protocol_stack', text: 'Response To Egress' }, 
				  { id: 7, value: 'binary_value_of_release_cause_from_protocol_stack', text: 'Response From Igress' }, 
				  { id: 8, value: 'first_release_dialogue', text: 'ORIG/TERM Release' }, 
				  { id: 9, value: 'origination_source_number', text: 'ORIG SRC Number' }, 
				  { id: 10, value: 'origination_source_host_name', text: 'ORIG IP' }, 
				  { id: 11, value: 'origination_destination_number', text: 'ORIG DST Number' }, 
				  { id: 12, value: 'origination_destination_host_name', text: 'Orig Switch IP' }, 
				  { id: 13, value: 'origination_call_id', text: 'Origination Call ID' }, 
				  { id: 14, value: 'origination_remote_payload_ip_address', text: 'Orig Media IP' }, 
				  { id: 15, value: 'origination_remote_payload_udp_address', text: 'Orig Media Port' }, 
				  { id: 16, value: 'origination_local_payload_ip_address', text: 'Origination Local Payload IP' }, 
				  { id: 17, value: 'origination_local_payload_udp_address', text: 'Origination Local Payload Port' }, 
				  { id: 18, value: 'origination_codec_list', text: 'ORIG Codecs' }, 
				  { id: 19, value: 'termination_source_number', text: 'Term src Number' }, 
				  { id: 20, value: 'termination_source_host_name', text: 'Termination Source Host Name' }, //
				  { id: 21, value: 'termination_destination_number', text: 'Term DST Number' }, 
				  { id: 22, value: 'termination_destination_host_name', text: 'Term IP' }, 
				  { id: 23, value: 'termination_call_id', text: 'Termination Call ID' }, 
				  { id: 24, value: 'termination_remote_payload_ip_address', text: 'Term Media IP' }, 
				  { id: 25, value: 'termination_remote_payload_udp_address', text: 'Termination Remote Payload udp Address' }, //
				  { id: 26, value: 'termination_local_payload_ip_address', text: 'Termination Local Payload IP' }, 
				  { id: 27, value: 'termination_local_payload_udp_address', text: 'Termination Local Payload Port' }, 
				  { id: 28, value: 'termination_codec_list', text: 'Term Codecs' }, 
				  { id: 29, value: 'final_route_indication', text: 'Final Route' }, 
				  { id: 30, value: 'routing_digits', text: 'Translation DNIS' }, 
				  { id: 31, value: 'call_duration', text: 'Call Duration'}, 
				  { id: 32, value: 'pdd', text: 'Pdd'}, 
				  { id: 33, value: 'ring_time', text: 'Ring Time'}, 
				  { id: 34, value: 'callduration_in_ms', text: 'Call duration in ms'}, 
				  { id: 35, value: 'conf_id', text: 'Conf ID'}, // 
				  { id: 36, value: 'call_type', text: 'Call Type'}, // 
				  { id: 37, value: 'ingress_id', text: 'Ingress Alias'}, 
				  { id: 38, value: 'ingress_client_id', text: 'Ingress Client Name'}, 
				  { id: 39, value: 'ingress_client_rate_table_id', text: 'Ingress Client Rate Table Name'}, 
				  { id: 40, value: 'ingress_client_currency_id', text: 'Ingress Client Currency Name'}, // 
				  { id: 41, value: 'ingress_client_rate', text: 'Ingress Client Rate'}, 
				  { id: 42, value: 'ingress_client_currency', text: 'Ingress Client Currency'}, 
				  { id: 43, value: 'ingress_client_bill_time', text: 'Ingress Bill Time'}, 
				  { id: 44, value: 'ingress_client_bill_result', text: 'Ingress Bill Result'}, 
				  { id: 45, value: 'ingress_client_cost', text: 'Ingress Client Cost'}, 
				  { id: 46, value: 'egress_id', text: 'Egress ID' },
				  { id: 47, value: 'egress_rate_table_id', text: 'Egress Rate Table Name' },
				  { id: 48, value: 'egress_rate', text: 'Egress Rate' },
				  { id: 49, value: 'egress_cost', text: 'Egress Cost' },
				  { id: 50, value: 'egress_bill_time', text: 'Egress Bill Time' },
				  { id: 51, value: 'egress_client_id', text: 'Egress Client Name' },
				  { id: 52, value: 'egress_client_currency_id', text: 'Egress Client Currency Name' }, //
				  { id: 53, value: 'egress_client_currency', text: 'Egress Client Currency' },
				  { id: 54, value: 'egress_six_seconds', text: 'Egress Six Seconds' },
				  { id: 55, value: 'egress_bill_minutes', text: 'Egress Bill Minutes' },
				  { id: 56, value: 'egress_bill_result', text: 'Egress Bill Result' },
				  { id: 57, value: 'ingress_bill_minutes', text: 'Ingress Bill Minute' },
				  { id: 58, value: 'ingress_dnis_type', text: 'Ingress DNIS Type' },
				  { id: 59, value: 'ingress_rate_type', text: 'Ingress Rate Type' },
				  { id: 60, value: 'lrn_dnis', text: 'LRN Number' },
				  { id: 61, value: 'egress_dnis_type', text: 'Egress Dnis Type' },
				  { id: 62, value: 'egress_rate_type', text: 'Egress Rate Type' },
				  { id: 63, value: 'item_id', text: 'Item ID' },
				  { id: 64, value: 'translation_ani', text: 'Translation ANI' },
				  { id: 65, value: 'ingress_rate_id', text: 'Ingress Rate ID' },
				  { id: 66, value: 'egress_rate_id', text: 'Egress Rate ID' },
				  { id: 67, value: 'orig_code', text: 'Orig Code' },
				  { id: 68, value: 'orig_code_name', text: 'Orig Code Name' },
				  { id: 69, value: 'orig_country', text: 'Orig Country' },
				  { id: 70, value: 'term_code', text: 'Term Code' },
				  { id: 71, value: 'term_code_name', text: 'Term Code Name' },
				  { id: 72, value: 'term_country', text: 'Term Country' },
				  { id: 73, value: 'ingress_rate_effective_date', text: 'Ingress Rate Effective Date' }, //
				  { id: 74, value: 'egress_rate_effective_date', text: 'Egress Rate Effective Date' }, //
				  { id: 75, value: 'egress_erro_string', text: 'Egress Trunk Trace' },
				  { id: 76, value: 'order_id', text: 'Order ID' }, //
				  { id: 77, value: 'order_type', text: 'Order Type' }, //
				  { id: 78, value: 'is_final_call', text: 'Is Final Call' },
				  { id: 79, value: 'egress_code_asr', text: 'Egress CODE ASR' },
				  { id: 80, value: 'egress_code_acd', text: 'Egress CODE ACD' },
				  { id: 81, value: 'static_route', text: 'Static Route Name' },
				  { id: 82, value: 'dynamic_route', text: 'Dynamic Route Name' },
				  { id: 83, value: 'route_plan', text: 'Routing Plan' },
				  { id: 84, value: 'route_prefix', text: 'Routing Prefix' }, //
				  { id: 85, value: 'orig_delay_second', text: 'Orig Delay Second' },
				  { id: 86, value: 'term_delay_second', text: 'Term Delay Second' },
				  { id: 87, value: 'orig_call_duration', text: 'Orig Call Duration' },
				  { id: 88, value: 'trunk_type', text: 'Trunk Type' },				  
				  { id: 89, value: 'origination_profile_port', text: 'Origination Profile Port' },
				  { id: 90, value: 'termination_profile_port', text: 'Termination Profile Port' },
				  { id: 91, value: 'o_trunk_type2', text: 'Origination Trunk Type2' }, //
				  { id: 92, value: 'o_billing_method', text: 'Origination Billing Method' }, //
				  { id: 93, value: 't_trunk_type2', text: 'Termination Trunk Type2' }, //
				  { id: 94, value: 't_billing_method', text: 'Termination Billing Method' }, //
				  { id: 95, value: 'campaign_id', text: 'Campaign ID' }, //
				  { id: 96, value: 'agent_id', text: 'Agent ID' }, //
				  { id: 97, value: 'agent_rate', text: 'Agent Rate' }, //	
				  { id: 98, value: 'agent_cost', text: 'Agent Cost' }, //
				  { id: 99, value: 'orig_jur_type', text: 'Origination Jur Type' }, //
				  { id: 100, value: 'term_jur_type', text: 'Termination Jur Type' }, //
				  { id: 101, value: 'ring_epoch', text: 'Ring Epoch' }, //
				  { id: 102, value: 'end_epoch', text: 'End Epoch' }, //
				  { id: 103, value: 'paid_user', text: 'Paid User' }, //
				  { id: 104, value: 'rpid_user', text: 'Rpid User' }, //
				  { id: 105, value: 'timeout_type', text: 'Timeout Type' }, //
				  { id: 106, value: 'q850_cause', text: 'Q850 Cause' }, //
				  { id: 107, value: 'q850_cause_string', text: 'Q850 Cause String' }, //
			    ],				
				more_advanced_option: true,
				more_advanced_option_button: "Less Options",
				loading: false,	
				refresh: false,
				ani: '',				
				dnis2: '',
				start_date: '',
				end_date: '',
				start_date_export: '',
				end_date_export: '',
				// start_time: '',
				// end_time: '',

				// fetchType: 'websocket',
				// token: 'Token Yuza2L2rlGkdemBeYzL0SVncFafTjYNFSMpShsJT614inGMLDf',
				// query_json: {
				// 	start_time: 1501027200	,
				// 	end_time: 1501113599,
				// 	egress_rcause: 'NORMAL_CLEARING',
				// 	format: 'json',
				// 	human_readable: 1					
				// },
				editorA: 'editor-a',
			    contentA: '',
				copy: '',
				subject: '',
				to: '',
				
				carriers: '',
				
				from: '',
				
				carrirers: '',
				
				tech_prefix: '',
				
				response_code: '',
				response_to_ingress: '',
				// duration: 'all',
				release_cause: '',
				egress_trunk: '',
				// orig_call_id: '',
				
				interval_second: '',
				interval_second2: '',
				response_from_egress: '',
				cost: '',
				// class4_server: '',
				term_call_id: '',
				rate_type: '',
				currency: '',
				type: '',
				// show: 'show_all',
				showModal: '',
				selected1: '',
				selected2: '',
				rate_display: '',
				tiggered_time_1: '',
				tiggered_time_2: '',
				options: [
				  { id: 1, value: '1.1.1.1', text: '1.1.1.1' },
				  { id: 2, value: '158.69.204.96', text: '158.69.204.96' },
				  { id: 3, value: '192.99.10.113', text: '192.99.10.113' },
				  { id: 4, value: '88.99.184.140', text: '88.99.184.140' }
			    ],
				cdrs: [],
			    cdr_logs: [
					{
					  job_id: "#85",
					  tiggered_start_time: "2017-01-31 07:52:26+00",
					  tiggered_end_time: "2017-01-31 23:59:59+00",
					  status: 'Done',
					  progress: '11/11',
					  row_numbers:'11',
					  file_size: '421 Bytes'
					},
					{
					  job_id: "#85",
					  tiggered_start_time: "2017-01-31 07:52:26+00",
					  tiggered_end_time: "2017-01-31 23:59:59+00",
					  status: 'Done',
					  progress: '11/11',
					  row_numbers:'11',
					  file_size: '421 Bytes'
					},
					{
					  job_id: "#85",
					  tiggered_start_time: "2017-01-31 07:52:26+00",
					  tiggered_end_time: "2017-01-31 23:59:59+00",
					  status: 'Done',
					  progress: '11/11',
					  row_numbers:'11',
					  file_size: '421 Bytes'
					},
					{
					  job_id: "#85",
					  tiggered_start_time: "2017-01-31 07:52:26+00",
					  tiggered_end_time: "2017-01-31 23:59:59+00",
					  status: 'Done',
					  progress: '11/11',
					  row_numbers:'11',
					  file_size: '421 Bytes'
					},
					{
					  job_id: "#85",
					  tiggered_start_time: "2017-01-31 07:52:26+00",
					  tiggered_end_time: "2017-01-31 23:59:59+00",
					  status: 'Done',
					  progress: '11/11',
					  row_numbers:'11',
					  file_size: '421 Bytes'
					}
			    ]
			}
		},
		watch: {
			'time': function() {
				if(this.time == 'Custom')
				{					
					this.start_date == ""
					this.end_date == ""
				} else if(this.time == 'Today')
				{
					this.start_date = getStartTimeOfToday();
					this.end_date = getEndTimeOfToday();
				} else if(this.time == 'Yesterday')
				{
					this.start_date = getStartTimeOfYesterday();
					this.end_date = getEndTimeOfYesterday();
				} else if(this.time == 'Current week')
				{
					this.start_date = getStartTimeOfCurrentWeek();
					this.end_date = getEndTimeOfCurrentWeek();
				} else if(this.time == 'Previous week')
				{
					this.start_date = getStartTimeOfPreviousWeek();
					this.end_date = getEndTimeOfPreviousWeek();
				} else if(this.time == 'Current month')
				{
					this.start_date = getStartTimeOfCurrentMonth();
					this.end_date = getEndTimeOfCurrentMonth();
				} else if(this.time == 'Previous month')
				{
					this.start_date = getStartTimeOfPreviousMonth();
					this.end_date = getEndTimeOfPreviousMonth();
				} 
			}
		},
		methods: {
            handleChange() {
                if (_.indexOf(this.table_columns, 'Job ID') != -1) {
                    Vue.set(this.showcolumns, 1, true);
                }
                else {
                    Vue.set(this.showcolumns, 1, false);
                }

                if (_.indexOf(this.table_columns, 'Triggered Start Time') != -1) {
                    Vue.set(this.showcolumns, 2, true);
                }
                else {
                    Vue.set(this.showcolumns, 2, false);
                }

                if (_.indexOf(this.table_columns, 'Triggered End Time') != -1) {
                    Vue.set(this.showcolumns, 3, true);
                }
                else {
                    Vue.set(this.showcolumns, 3, false);
                }

                if (_.indexOf(this.table_columns, 'Start Time') != -1) {
                    Vue.set(this.showcolumns, 4, true);
                }
                else {
                    Vue.set(this.showcolumns, 4, false);
                }

                if (_.indexOf(this.table_columns, 'End Time') != -1) {
                    Vue.set(this.showcolumns, 5, true);
                }
                else {
                    Vue.set(this.showcolumns, 5, false);
                }

                if (_.indexOf(this.table_columns, 'Status') != -1) {
                    Vue.set(this.showcolumns, 6, true);
                }
                else {
                    Vue.set(this.showcolumns, 6, false);
                }

                if (_.indexOf(this.table_columns, 'Progress(h)') != -1) {
                    Vue.set(this.showcolumns, 7, true);
                }
                else {
                    Vue.set(this.showcolumns, 7, false);
                }

                if (_.indexOf(this.table_columns, 'Number of Rows') != -1) {
                    Vue.set(this.showcolumns, 8, true);
                }
                else {
                    Vue.set(this.showcolumns, 8, false);
                }

                if (_.indexOf(this.table_columns, 'File Size') != -1) {
                    Vue.set(this.showcolumns, 9, true);
                }
                else {
                    Vue.set(this.showcolumns, 9, false);
                }


                if (_.indexOf(this.table_columns, 'Action') != -1) {
                    Vue.set(this.showcolumns, 10, true);
                }
                else {
                    Vue.set(this.showcolumns, 10, false);
                }
            },

            toggleColumn() {

			},
			changeEgress() {
				this.fetchRelatedTrunks('egress');
			},
			changeIngress() {
				this.fetchRelatedTrunks('ingress');
			},
			changeTab (tab, index) {				
				if (this.active_tab_index === index) { return }				
				this.active_tab_index = index
				if(index == 0) this.refresh = false;
				else this.refresh = true;			

				this.$nextTick(() => {
					if (index === 1) {
						this.fetchLogs()
					}
				})

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
			fetchAllTrunks (type) {
				var url;
				if(type == 'egress')
					url = api.getEndpointUrl() + '/v1/trunk/egress/list';
				else if(type == 'ingress')
					url = api.getEndpointUrl() + '/v1/trunk/ingress/list';
				this.$http.get(url,
				{
					headers: {
						"X-Auth-Token": auth.getToken()
					}
				})
				.then(response => {
					const body = response.body
					if (body.success) {
						const trunks = body.payload.items
						//console.log(trunks);
						var self = this;
						if(type == 'egress') {
							this.egress_trunk_options = [];
							this.egress_trunk_options.push('');
							trunks.forEach(function (temp, i) {
								var trunk = {};
								trunk.id = temp.resource_id;
								trunk.text = temp.name;
								self.egress_trunk_options.push(trunk);
							});
						}
						else if(type == 'ingress') {
							this.ingress_trunk_options = [];
							this.ingress_trunk_options.push('');
							trunks.forEach(function (temp, i) {
								var trunk = {};
								trunk.id = temp.resource_id;
								trunk.text = temp.name;
								self.ingress_trunk_options.push(trunk);
							});
						}
						console.log("Fetch all trunks success");
					}
				})
				.catch(error => {
					//console.log(error)
					console.log("Fetch all trunks failure");
				})
			},
			fetchRelatedTrunks (type) {				
				var url;
				if(type == 'egress')
				{
					if(this.egress_carrier == undefined || this.egress_carrier == '') return;
					this.egress_trunk = '';
					url = api.getEndpointUrl() + '/v1/carrier/' + this.egress_carrier + '/egress_trunk/list';
				}
				else if(type == 'ingress')
				{
					if(this.ingress_carrier == undefined || this.ingress_carrier == '') return;
					this.ingress_trunk = '';
					url = api.getEndpointUrl() + '/v1/carrier/' + this.ingress_carrier + '/ingress_trunk/list';
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
							this.egress_trunk_options = [];
							trunks.forEach(function (temp, i) {
								var trunk = {};
								trunk.id = temp.resource_id;
								trunk.text = temp.name;
								self.egress_trunk_options.push(trunk);
							});
							//console.log("Egress: " + this.egress_trunk_options.length);
						}
						else if(type == 'ingress') {
							this.ingress_trunk_options = [];
							trunks.forEach(function (temp, i) {
								var trunk = {};
								trunk.id = temp.resource_id;
								trunk.text = temp.name;
								self.ingress_trunk_options.push(trunk);
							});
							//console.log("Inress: " + this.ingress_trunk_options.length);
						}
						this.loading = false;
						console.log("Fetch releated trunks success");
					}
				})
				.catch(error => {					
					console.log("Fetch releated trunks failure");
					this.loading = false;
				})
			},
			fetchCodes() {
				var url;
				url = api.getEndpointUrl() + '/v1/switch/code/list';
					
				this.loading = true;
				this.$http.get(url,
				{
					headers: {
						"X-Auth-Token": auth.getToken()
					}
				}).then(response => {
					const body = response.body
					if (body.success) {
						this.codes = body.payload.items
						this.loading = false;
						console.log("Success");
					}
				})
				.catch(error => {					
					console.log(error);
					this.loading = false;
				})
			},
			fetchCarriers() {
				var per_page = 1;
				var url = api.getEndpointUrl() + "/v1/carrier/list?per_page=" + per_page
				this.loading = true;
				this.$http.get(url)
				.then(response => {
					const body = response.body
					if (body.success) {
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

									carriers.forEach(function(temp, i) {
										var carrier = {};
										carrier.id = temp.client_id;
										carrier.text = temp.name;
										self.carrier_options.push(carrier);
									});
									console.log(this.carrier_options);
								}
								this.loading = false;
							})
							.catch(error => {
								console.log(error);
								this.loading = false;
							})
					}
				})
				.catch(error => {
					console.log(error)
				})
			},
			fetchLogs() {

			},
			changePageCount(countPerPage) {
				if (countPerPage !== this.pageOne.cntpage) {
					this.pageOne.cntpage = countPerPage
					this.$nextTick(this.fetchLogs)
				}
			},
			pageOneChanged (pageNum) {
				if (pageNum !== this.pageOne.currentPage) {
					this.pageOne.currentPage = pageNum
					this.$nextTick(this.fetchLogs)
				}
			},
			closeModal: function() {
				this.showModal = '';
			},
			makeColumns: function(){
				// var columns = new Array();				
				this.show_table_columns = [];
				this.show_table_fields = '';
				for(var i = 0; i < this.selected_show_fields.length; i++)
				{
					var show_field = this.selected_show_fields[i];
					console.log(show_field);
					for(var j = 0; j < this.show_field_options.length; j++)
					{
						var show_field_option = this.show_field_options[j];
						
						if(show_field_option.value == show_field)
						{
							this.show_table_columns.push(show_field_option.text);
							console.log(this.show_table_fields);
							this.show_table_fields = this.show_table_fields + show_field_option.id + ",";					
							console.log(this.show_table_fields);
							break;
						}						
					}
				}
					
				if (this.show_table_fields.length > 0)
					this.show_table_fields = this.show_table_fields.substr(0, this.show_table_fields.length - 1);
			},			
			makeURL: function(){
				var filterURL = '';
				if(this.ingress_carrier != undefined && this.ingress_carrier != '')
				{
					if(this.ingress_trunk != undefined && this.ingress_trunk != '')
					{
						filterURL += "&ingress_id=" + this.ingress_trunk;						
					}
					else if(this.ingress_trunk_options.length != 0)
					{
						var ingress_ids = '';
						this.ingress_trunk_options.forEach(function (ingress, i) {
							ingress_ids += ingress.id + ",";
						});	
						if (ingress_ids.length > 0)
							ingress_ids = ingress_ids.substr(0, ingress_ids.length - 1);	
						filterURL += "&ingress_id=" + ingress_ids;				
					}					
				}
				if(this.code != '')
					filterURL += "&orig_code=" + this.code;
				else if(this.code_name != '')
				{
					var matchedItems = _.filter(this.codes, { name: this.code_name });
					_(matchedItems).each(item => {
						filterURL += "&orig_code=" + item.code + ",";
					});
				}
				else if(this.country != '')
				{
					var matchedItems = _.filter(this.codes, { name: this.country });
					_(matchedItems).each(item => {
						filterURL += "&orig_code=" + item.code + ",";
					});
				}

				if(this.ani != '')
					filterURL += "&source_number=" + this.ani;
				if(this.dnis == 'with_prefix' && this.dnis2 != '')
					filterURL += "&dest_number=" + this.dnis2;
				else if(this.dnis == 'without_prefix' && this.dnis2 != '')
					filterURL += "&routing_digits=" + this.dnis2;

				if(this.egress_carrier != undefined && this.egress_carrier != '')
				{
					if(this.egress_trunk != undefined && this.egress_trunk != '')
					{
						filterURL += "&egress_id=" + this.egress_trunk;						
					}
					else if(this.egress_trunk_options.length != 0)
					{
						var egress_ids = '';
						this.egress_trunk_options.forEach(function (egress, i) {
							egress_ids += egress.id + ",";
						});
						if (egress_ids.length > 0)
							egress_ids = egress_ids.substr(0, egress_ids.length - 1);
						filterURL += "&egress_id=" + egress_ids;				
					}					
				}				
				return filterURL;
			},
			fetchCDRs: function(start_time, end_time, filterURL, egress_rcause = 'NORMAL_CLEARING'){
				this.loading = true;
				var self = this;																				
				// var strURL = api.getCDR_URL() + "?start_time=" + start_time + "&end_time=" + end_time + "&egress_rcause=" + egress_rcause + "&format=json&human_readable=1" + filterURL;
				var strURL = api.getCDR_URL() + "?start_time=" + start_time + "&end_time=" + end_time + "&field=" + this.show_table_fields + filterURL + "&format=json&human_readable";
				this.cdrs = [];	
				this.$http.get(strURL,
				{
					headers: {
						"Authorization": "Token " + auth.getCdrToken()					
					}
				}).then(function(response) {					
					this.loading = false;																		
					var cdrs = response.body.data;	
					cdrs.forEach(function (cdr, i) {
						if(i == cdrs.length - 1) return;
						self.cdrs.push(cdr);
					});										
					//this.cdrs = cdrs;															
				}, function(error) {					
					this.loading = false;	
					this.cdrs = null;					
					console.log(error);
				});			
			},
			// getToken: function() {
			// 	this.$http.post(api.getStatistics_Token(), {}, {
			// 			headers: {
			// 				"X-Auth-Token": auth.getToken()
			// 			}
			// 		}
			// 	)
			// 	.then(response => {
			// 		console.log("response: ");
			// 		console.log(response);
			// 		const body = response.body
			// 		if (body.success) {
			// 			this.token = body.token
			// 		}
			// 	})
			// 	.catch(error => {
			// 		console.log(error)
			// 	})				
			// },
			searchReport: function(){	
				var start_time, end_time;	
				if(this.start_date == ""){
					start_time = new Date();
				}	
				else{
					start_time = new Date(this.start_date);
				}

				if(this.end_date == ""){
					end_time = new Date();
				}	
				else{
					end_time = new Date(this.end_date);
				}				
				
				start_time = new Date(start_time + " GMT").getTime() / 1000;
				end_time = new Date(end_time + " GMT").getTime() / 1000;				

				this.makeColumns();			
				var filterURL = this.makeURL();							
				this.fetchCDRs(start_time, end_time, filterURL);														
			},
			// makeRequest(type, url, query_json, token) {				
			// 	let hRequest = prepareRequest(type, url, query_json, token); //requirement check spelling
			// 	hRequest.onreadystatechange = e => {
			// 		if (hRequest.readyState == 4) {
			// 			this.response = JSON.parse(hRequest.responseText);
			// 		}					
			// 	}
			// },
		},
		updated: function () {
			document.querySelector('.el-select > .el-input > input').placeholder = 'Show/Hide Columns';
		},		
		mounted: function () {
			$('[data-toggle="tooltip"]').tooltip();
		}
	}
	// var websocket = null;
	// var websocket_host = 'ws://192.99.10.113:';

	// function prepareRequest(type, url, query_json, token) {		
	// 	let hRequest = new XMLHttpRequest();
	// 	let query_string = makeQueryString(query_json);
	// 	if (type == 'GET')
	// 		url += '?' + query_string;
	// 	hRequest.open(type, url, true);
	// 	hRequest.setRequestHeader('Authorization', token);
	// 	hRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	// 	console.log("query: " + query_string);
	// 	if (type == 'POST') {
	// 		hRequest.send(query_string);
	// 	} else {
	// 		hRequest.send();
	// 	}
	// 	return hRequest;
	// }

	//This function transform object to urlencoded string
	// function makeQueryString(query_json) {		
	// 	let keys = Object.keys(query_json);
	// 	let result = '';
	// 	console.log("query: " + query_json);
	// 	console.log(keys);
	// 	keys.forEach((item, id, keys) => {
	// 		let value = ''
	// 		if (Array.isArray(item)) {
	// 			item.forEach((e, i, item) => value += e + ',');
	// 		} else {
	// 			value = query_json[item];
	// 		}
	// 		result += item + '=' + value + '&';
	// 	})

	// 	result = result.substr(0, result.length - 1);
	// 	return result;
	// }
</script>

<style>
.marg-top-6{
	margin-top: 6px;
}
	.el-select__tags {
		display: none;
	}
	.width-100{
		min-width: 100%!important;
	}
	.m-top-25{
		margin-top: 25px;
	}
	.tab span.dnl_icon.dnl_qos_report {
		font-size: 20px;
		float: left;
		margin-right: 6px;
		margin-top: -2px;
	}

	.tab span.dnl_icon.dnl_list {
		margin-right: 5px;

	}
#app > div.container-fluid > div > div > div.tabs > div.tabs_container > div:nth-child(1) > div.advanced_search_filter_panel > div.row > div:nth-child(2) > div > div > div:nth-child(2) > select {
		min-width: 100%!important;
}
	@media only screen and (max-width:425px) {
		.pull-right {
			float:left!important;
		}

		.page {
			display: block!important;
		}
	}

	.triggeredTime:first-child:after {
		content: "~"!important;
		position: absolute!important;
		top: 3px!important;
		right: -11.5%!important;
		font-size: 25px!important;
	}
		@media only screen and (max-width: 992px) {

		}
</style>
