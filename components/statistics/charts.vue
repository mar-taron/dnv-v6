<template>
	<div class="container-fluid">
      <div class="row">
		<div class="wrapper">
			<div class="sidebar">
			  <ul class="nav nav-sidebar">
				<li>
					<router-link to="/statistics/dashboard">
						<span class="dnl_icon dnl_dashboard"></span>
						Dashboard 
					</router-link>
				</li>
				<li>
					<router-link to="/statistics/dashboard/report">
						<span class="dnl_icon dnl_report"></span>
						Report
					</router-link>
				</li>
				<li class="active">
					<router-link to="/statistics/dashboard/charts">
						<span class="dnl_icon dnl_chart"></span>
						Charts
						<span class="sr-only">(current)</span>
					</router-link>
				</li>
				<li>
					<router-link to="/statistics/dashboard/auto_delivery">
						<span class="dnl_icon dnl_auto_delivery"></span>
						Auto Delivery
					</router-link>
				</li>
				<li>
					<router-link to="/statistics/dashboard/qos_report">
						<span class="dnl_icon dnl_qos_report"></span>
						Qos Report
					</router-link>
				</li>
				<li>
					<router-link to="/statistics/dashboard/ingress_client_qos">
						<span class="dnl_icon dnl_ingress"></span>
						Ingress Clients Qos
					</router-link>
				</li>
				<li>
					<router-link to="/statistics/dashboard/egress_client_qos">
						<span class="dnl_icon dnl_egress"></span>
						Egress Clients Qos
					</router-link>
				</li>
				<li>
					<router-link to="/statistics/dashboard/alert">
						<span class="dnl_icon dnl_ring"></span> Alert
						<span class="sr-only">(current)</span>
					</router-link>
				</li>
			  </ul>
			  <div class="sidebar_footer">
				  <span class="dnl_icon dnl_menu"></span>
				  <br>
				  DeNovoLab@2010-2016 <br> All Rights Reserved. 
			  </div>
			</div>
			<div class="col-sm-12 col-md-offset-2 col-md-10">
				<time-display></time-display>
				<ol class="breadcrumb">
					  <li class="breadcrumb-item"><a>Statistics</a></li>
					  <li class="breadcrumb-item">
						  <router-link to="/statistics/dashboard">Dashboard</router-link>
					  </li>
					  <li class="breadcrumb-item active">Charts</li>
				</ol>
				<h1 class="page-header">Charts</h1>
					<div class="timeline">
						<div class="chart_select_header grided">
							<div class="col-md-3 col-sm-3">
								<label>Statistical Information:</label>
								<select2 :options="options_statical_information" v-model="statistical_information">
									<option disabled value="0">Select one</option>
								</select2>
							</div>
							<div class="col-md-3 col-sm-3">
								<label>Report Type:</label>
								<select2 :options="options_report_type" v-model="report_type">
									<option disabled value="0">Select one</option>
								</select2>
							</div>
							<div class="clearfix little-space"></div>
							<div class="col-md-3 col-sm-3">
								<label>Group Time:</label>
								<select2 :options="options_group_time" v-model="group_time">
									<option disabled value="0">Select one</option>
								</select2>
							</div>
							<div class="col-md-3 col-sm-3">
								<label>Start Date/Time:</label>
								<el-date-picker style="width: 100%;" type="date" v-model="time12" :picker-options="{}" placeholder="Enter Date/Time"></el-date-picker>
							</div>
							<div class="col-md-3 col-sm-3">
								<label>End Date/Time:</label>
								<el-date-picker style="width: 100%;" type="date" v-model="time2" :picker-options="{}" placeholder="Enter Date and Time"></el-date-picker>
							</div>
							<div class="col-md-3 col-sm-3">
								<label>Timezone:</label>
								<select class="selectable no-min-width" v-model="time_zone">
								<option v-for="item in time_zone_options" v-bind:value="item.id">
									{{ item.text }}
								</option>
							</select>
							</div>
							<div class="clearfix little-space"></div>
							<div class="col-md-3 col-sm-3">
								<label for="country">Country:</label>
								<input type="text" name="country" v-model="country" class="form-control" placeholder="Enter Country">
							</div>
							<div class="col-md-3 col-sm-3">
								<label for="destination">Destination:</label>
								<input type="text" name="destination" v-model="destination" class="form-control" placeholder="Enter Destination">
							</div>
							<div class="col-md-3 col-sm-3">
								<label>Orig Filter:</label>
								<select2 :options="options_orig_filter" v-model="orig_filter">
									<option disabled value="0">Select one</option>
								</select2>
							</div>
							<div class="col-md-3 col-sm-3">
								<label>Term Filter:</label>
								<select2 :options="options_termination" v-model="term_filter">
									<option disabled value="0">Select one</option>
								</select2>
							</div>
							<div class="clearfix little-space"></div>
							<div class="col-lg2 col-md-2 col-sm-3">
								<a class="btn btn-primary m-top-10">
									Submit
								</a>
							</div>
							<div class="clearfix"></div>
						</div>
						<div class="chart_content">
						    <span class="table_time chart_time">
								09/23/2016 17:34:52 +0000
							</span>
							<div id="linear"></div>
						</div>
				    <div class="clearfix"></div>
			  </div>
			</div>
		</div>
		</div>
	</div>
</template>

<script>   
	const vSelect = require('vue!../main_components/select.vue'),
		  api = require("../../api"),
		  auth = require("../../auth"),
		  fetchApi = require("../../apiLib");

    module.exports = {
		components: {
			'select2': vSelect
		},
		data: function(){
            return {
			  statistical_information: '',
			  group_time: '',
			  report_type: '',
			  start_date: '',
			  end_date: '',
			  time_zone: '',
			  country: '',
			  destination: '',
			  orig_filter: '',
			  term_filter: '',
			  options_statical_information: [
				  { id: '1', text: 'ASR' },
				  { id: '2', text: 'ACD' },
				  { id: '3', text: 'Total Billable Time' },
				  { id: '4', text: 'Total Cost' },
				  { id: '5', text: 'Margin' },
				  { id: '6', text: 'Call Attempt' }
			  ],
			  options_report_type: [
				  { id: '1', text: 'Origination' },
				  { id: '2', text: 'Termination' }
			  ],
			   options_group_time: [
				  { id: '1', text: 'Daily' },
				  { id: '2', text: 'Hourly' }
			  ],
			   options_orig_filter: [],
			   options_termination: [],
			  time_zone: 12,
            time_zone_options: [
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

            }
        },
		methods: {

		},

		mounted: function () {
			Highcharts.chart('linear', {
				chart: {
					type: 'spline'
				},
				credits: {
				  enabled: false
				},
				exporting: { enabled: false },
				title: {
					text: ''
				},
				xAxis: {
					categories: ['1:00', '2:00', '3:00', '4:00','5:00', '6:00', '7:00', '8:00','9:00', '10:00', '11:00', '12:00','13:00', '14:00', '15:00', '16:00','17:00', '18:00', '19:00', '20:00','21:00', '22:00', '23:00']
				},
				yAxis: {
					title: {
						text: 'ASR'
					},
					min: 0
				},
				tooltip: {
					headerFormat: '<b>{series.name}</b><br>'
				},

				plotOptions: {
					spline: {
						marker: {
							enabled: false
						}
					}
				},

				series: [{
					name: 'ASR',
					data: [
						['1:00', 2],
						['2:00', 2],
						['3:00', 2],
						['4:00', 2],
						['5:00', 20],
						['6:00', 45],
						['7:00', 20],
						['8:00', 2],
						['9:00', 20],
						['10:00', 32],
						['11:00', 40],
						['12:00', 2],
						['13:00', 2],
						['14:00', 2],
						['15:00', 10],
						['16:00', 30],
						['17:00', 50],
						['18:00', 80],
						['19:00', 40],
						['20:00', 20],
						['21:00', 10],
						['22:00', 2],
						['23:00', 2],
					]
				}]
			});
		},
		created: function() {
  		   this.options_orig_filter = fetchApi.fetchIngress();
		   this.options_termination = fetchApi.fetchEgress();
 		}
	}
</script>

<style>
	span.table_time.chart_time {
		color: #c0c6d1;
		font-size: 14px;
		margin-top: 2px;
		margin-left: 40px;
	}
	
	#linear {
		height: 350px;
		margin-top: 20px;
	}
	
	.chart_select_header.grided .select2 {
		width: 100% !important;
	}
	
	@media (max-width: 767px) {
		.chart_select_header.grided {
			height: auto;
		}
		
		.chart_select_header.grided .select2 {
			margin-bottom: 4px;
		}
		
		.chart_select_header.grided .btn.btn-primary {
			margin-top: 0;
			margin-bottom: 10px;
		}
		
		.chart_select_header.grided .clearfix.little-space {
			margin-top: 0;
		}
	}
</style>
