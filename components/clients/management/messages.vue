<template>
	<div id="container-margin-122" class="container-fluid">
		<div class="row">
			<div class="wrapper single">
				<ol class="breadcrumb">
					<li class="breadcrumb-item">
						<a href="#">Management</a>
					</li>
					<li class="breadcrumb-item active">Accounts</li>
				</ol>
				<div class="white_pad table_wrap">

									<div class="messages">
						<div class="col-md-6 col-sm-3">
							<h3 class="MsgTitle">Messages</h3>
						</div>
						<div class="col-md-6 col-sm-9">
							<div class="pull-right margin">
								<a href="#"><img src="assets/images/client/Analytics.png" alt=""> ANALYTICS</a>
								<router-link to="/clients/management/account_summary"><img src="assets/images/client/useractivelink.png" alt=""> ACCOUNT</router-link>
								<router-link class="distnictbtn" to="/clients/management/messages"> MESSAGES</router-link>
							</div>
						</div>
						<div class="clearfix"></div>

						<div class="col-md-4">
							<div class="box boxOne" @click="type='alert'">
							<img src="assets/images/client/boxOneicon.png" alt="">
							<h3>2 Alerts</h3>
							</div>
						</div>

						<div class="col-md-4">
							<div class="box boxTwo" @click="type='invoice'">
							<img src="assets/images/client/boxTwoicon.png" alt="">
							<h3>3 Unpaid Invoices</h3>
							</div>
						</div>

						<div class="col-md-4">
							<div class="box boxThree" @click="type='message'">
							<img src="assets/images/client/boxThreeicon.png" alt="">
							<h3>4 Messages</h3>
							</div>
						</div>
					</div>
					<div class="clearfix"></div>
					<div class="table-responsive" v-if="type=='alert'">
						<table class="table table-striped table-hover clients">
							<thead>
								<tr>
									<th>Alert Type</th>
									<th>Subject</th>
									<th>Sent To</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								<tr v-if="!alert_list.length">
									<td style="text-align: center" colspan="6">No Data Found</td>
								</tr>										
								
								<tr v-for="item in alert_list">
									<td>{{item.type}}</td>
									<td>{{item.subject}}</td>
									<td>{{item.send}}</td>
									<td>
										<a class="action action_menu" data-toggle="tooltip" data-placement="top" title="View" v-on:click="alert_view(item)">
											<span class="dnl_icon dnl_action_menu"></span>
										</a>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				<div class="table-responsive" v-if="type=='invoice'">
						<table class="table table-striped table-hover clients">
							<thead>
								<tr>
									<th>Invoice Number</th>
									<th>Amount</th>
									<th>Period</th>
									<th>Due Date</th>
									<th>Paid</th>
									<th>Unpaid</th>
								</tr>
							</thead>
							<tbody>
								<tr v-if="!invoice_list.length">
									<td style="text-align: center" colspan="6">No Data Found</td>
								</tr>										
								
								<tr v-for="item in invoice_list">
									<td>{{item.number}}</td>
									<td>{{item.amount}}</td>
									<td>{{item.period}}</td>
									<td>{{item.due}}</td>
									<td>{{item.paid}}</td>
									<td>{{item.unpaid}}</td>
								</tr>
							</tbody>
						</table>
					</div>
				<div class="table-responsive" v-if="type=='message'">
						<table class="table table-striped table-hover clients">
							<thead>
								<tr>
									<th>Messages Type</th>
									<th>Subject</th>
									<th>Sent To</th>
									<th>Sent On</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								<tr v-if="!message_list.length">
									<td style="text-align: center" colspan="6">No Data Found</td>
								</tr>										
								
								<tr v-for="item in message_list">
									<td>{{item.type}}</td>
									<td>{{item.subject}}</td>
									<td>{{item.to}}</td>
									<td>{{item.on}}</td>
									<td>
										<a class="action action_menu" data-toggle="tooltip" data-placement="top" title="View" v-on:click="message_view(item)">
											<span class="dnl_icon dnl_action_menu"></span>
										</a>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="clearfix"></div>
					<div>
						<div class="col-md-6 col-sm-12">
							<h3>Demographic</h3>
							<p>2016- 10-22:00:00 +0000 ~ 2016-10-23 16:59:59 +0000</p>
						</div>
						<div class="col-md-6 col-sm-12">
							<div class="lastButtons pull-right">
								<div class="buttons">
									<button class="graybackground" type="button" name="button"><img src="assets/images/client/grayLast.png" alt=""> Last Hour</button>
									<button type="button" name="button"><img src="assets/images/client/coleredLast.png" alt=""> Last 24-Hour</button>
								</div>
								<img src="assets/images/client/loading.png" alt="">
							</div>
						</div>
						<div class="table-responsive">
							<table class="table table-striped table-hover clients trunks">
								<thead>
									<tr>
										<th>Code Name</th>
										<th>Attempt</th>
										<th>Non Zero</th>
										<th>Min</th>
										<th>Cost</th>
										<th>ASR</th>
										<th>ACD</th>
									</tr>
								</thead>
								<tbody>
									<tr v-if="!demograph_list.length">
										<td style="text-align: center" colspan="7">No Data Found</td>
									</tr>

									<tr v-for="demograph in demograph_list">
										<td>{{demograph.name}}</td>
										<td>{{demograph.attempt}}</td>
										<td>{{demograph.non_zero}}</td>
										<td>{{demograph.min}}</td>
										<td>{{demograph.cost}}</td>
										<td>{{demograph.asr}}</td>
										<td>{{demograph.acd}}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
					<!-- ////////////////////////////////////////////////////////// -->
					<div>
						<div class="col-md-6 cpl-sm-12">
							<h3>Traffic Breakdown</h3>
							<p>2016- 10-22 17:00:00 +0000 ~ 2016-10-23 16:59:59 +0000</p>
						</div>
						<div class="col-md-6 col-sm-12">
							<div class="lastButtons pull-right">
								<div class="buttons" style="border:0">
									<button style="position:relative;text-align:left;background-color:#f7f8f9;border-radius: 5px;border: 1px solid #ddd" type="button" name="button">All Trunks <img style="position:absolute;right: 12px;top: 12px" src="assets/images/client/buttonarrowbottom.png" alt="">
									</button>
								</div>
								<img src="assets/images/client/loading.png" alt="">
							</div>
						</div>
						<div class="table-responsive">
							<table class="table table-striped table-hover clients trunks">
								<thead>
									<tr>
										<th>Time Period</th>
										<th>Attempt</th>
										<th>Non Zero</th>
										<th>Min</th>
										<th>Cost</th>
										<th>ASR</th>
										<th>ACD</th>
									</tr>
								</thead>
								<tbody>
									<tr v-if="!traffic_list.length">
										<td style="text-align: center" colspan="7">No Data Found</td>
									</tr>

									<tr v-for="traffic in traffic_list">
										<td>{{traffic.period}}</td>
										<td>{{traffic.attempt}}</td>
										<td>{{traffic.non_zero}}</td>
										<td>{{traffic.min}}</td>
										<td>{{traffic.cost}}</td>
										<td>{{traffic.asr}}</td>
										<td>{{traffic.acd}}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
					<div class="AsrAcd">
						<div class="col-md-6">
							<div class="Asr">
								<div class="row">
									<div class="col-xs-6">
										<h3>ASR <span>Last 24h</span></h3>
									</div>
									<div class="col-xs-6">
										<h3 class="pull-right">0 <img src="assets/images/client/frayLoading.png" alt=""></h3>
									</div>
								</div>
							</div>
							<div class="graph">
								Graph
							</div>
						</div>
						<div class="col-md-6">
							<div class="Acd">
								<div class="row">
									<div class="col-xs-6">
										<h3>ACD <span>Last 24h</span></h3>
									</div>
									<div class="col-xs-6">
										<h3 class="pull-right">0 <img src="assets/images/client/frayLoading.png" alt=""></h3>
									</div>
								</div>
							</div>
							<div class="graph">
								Graph
							</div>
						</div>
					</div>
					<div class="clearfix"></div>
					<footer>
					<p>DeNovoLab@2010-2016 All Rights Reserved</p>
					</footer>

					<div class="clearfix"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	   const vSelect = require('vue!../../main_components/select.vue');
	   module.exports = {
	   	components: {
	   		'select2': vSelect
	   	},
	   	data: function() {
	   		return {
	   			type: '',
	   			alert_list: [
					{id: 1, type: 'Low Balance Alerts', subject: 'Insufficient Balance DNL , Tue, 10 Jan 2017 UTC', send: "sourav@denovolab.com;sourav@denovolab.com"},
					{id: 1, type: 'Low Balance Alerts', subject: 'Insufficient Balance DNL , Tue, 10 Jan 2017 UTC', send: "sourav@denovolab.com;sourav@denovolab.com"},
				],
				invoice_list: [
					{id: 1, number: '3303', amount: '22.91667', period: "2017-02-27 00:00:00+00:00~2017-02-27 00:00:00+00:00", due: '2017-03-03', paid: '', unpaid: '22.91667'},
					{id: 1, number: '3303', amount: '22.91667', period: "2017-02-27 00:00:00+00:00~2017-02-27 00:00:00+00:00", due: '2017-03-03', paid: '', unpaid: '22.91667'},
					{id: 1, number: '3303', amount: '22.91667', period: "2017-02-27 00:00:00+00:00~2017-02-27 00:00:00+00:00", due: '2017-03-03', paid: '', unpaid: '22.91667'},
				],
				message_list: [
					{id: 1, type: 'Daily Usage', subject: 'Daily Summary Email Templat', to: "sourav@denovolab.com", on: '2016-12-22 00:08:04+00'},
					{id: 1, type: 'Daily Usage', subject: 'Daily Summary Email Templat', to: "sourav@denovolab.com", on: '2016-12-22 00:08:04+00'},
					{id: 1, type: 'Daily Usage', subject: 'Daily Summary Email Templat', to: "sourav@denovolab.com", on: '2016-12-22 00:08:04+00'},
					{id: 1, type: 'Daily Usage', subject: 'Daily Summary Email Templat', to: "sourav@denovolab.com", on: '2016-12-22 00:08:04+00'},
				],
				demograph_list: [
					{id: 1, name: 'Example name', attempt: 123, non_zero: 0, min: 0, cost: '0.00000', asr: 0, acd: 0},
					{id: 1, name: 'Example name', attempt: 123, non_zero: 0, min: 0, cost: '0.00000', asr: 0, acd: 0},
					{id: 1, name: 'Example name', attempt: 123, non_zero: 0, min: 0, cost: '0.00000', asr: 0, acd: 0}
				],
				traffic_list: [
					{id: 1, period: '2016-10-22', attempt: 123, non_zero: 0, min: 0, cost: '0.00000', asr: 0, acd: 0},
					{id: 1, period: '2016-10-22', attempt: 123, non_zero: 0, min: 0, cost: '0.00000', asr: 0, acd: 0},
					{id: 1, period: '2016-10-22', attempt: 123, non_zero: 0, min: 0, cost: '0.00000', asr: 0, acd: 0}
				],
				transaction_list: [
					{id: 1, date: '2016-10-22', activity: 'Invoice-(Invoice#:765750)', debit: '$152.76', credit: '$0.00', balance: '$553.52'},
					{id: 1, date: '2016-10-22', activity: 'Invoice-(Invoice#:765750)', debit: '$152.76', credit: '$0.00', balance: '$553.52'},
					{id: 1, date: '2016-10-22', activity: 'Invoice-(Invoice#:765750)', debit: '$152.76', credit: '$0.00', balance: '$553.52'},
				],
	   			selected1: 2,
	   			options1: [{
	   					id: 1,
	   					text: 'Connected Calls'
	   				},
	   				{
	   					id: 2,
	   					text: 'QoS'
	   				},
	   				{
	   					id: 3,
	   					text: 'Revenue and Profitability'
	   				}
	   			],
	   			selected2: 0,
	   			options2: [{
	   					id: 1,
	   					text: 'All'
	   				},
	   				{
	   					id: 2,
	   					text: 'Option 2'
	   				}
	   			],
	   			selected3: 0,
	   			options3: [{
	   					id: 1,
	   					text: 'Network'
	   				},
	   				{
	   					id: 2,
	   					text: 'Orig Trunks'
	   				},
	   				{
	   					id: 3,
	   					text: 'Term Trunks'
	   				}
	   			],
	   			selected4: 0,
	   			options4: [{
	   					id: 1,
	   					text: 'Last Hour'
	   				},
	   				{
	   					id: 2,
	   					text: 'Last 7-Days'
	   				},
	   				{
	   					id: 3,
	   					text: 'Last 15-Days'
	   				},
	   				{
	   					id: 4,
	   					text: 'Last 30-Days'
	   				},
	   				{
	   					id: 5,
	   					text: 'Last 60-Days'
	   				},
	   				{
	   					id: 6,
	   					text: 'Last 30-Mins'
	   				},
	   				{
	   					id: 7,
	   					text: 'Last 15-Mins'
	   				}
	   			],
	   			top_clients: [{
	   					name: "SIPP-UAC",
	   					revenue: "$100.87",
	   					trend: "+3",
	   					trend_type: "plus"
	   				},
	   				{
	   					name: "Bruno Lambert",
	   					revenue: "$65.00",
	   					trend: "-1",
	   					trend_type: "minus"
	   				},
	   				{
	   					name: "Hugh Copeland",
	   					revenue: "$27.34",
	   					trend: "-5",
	   					trend_type: "minus"
	   				},
	   				{
	   					name: "Trevor Walton",
	   					revenue: "$89.08",
	   					trend: "+6",
	   					trend_type: "plus"
	   				},
	   				{
	   					name: "Robert Collins",
	   					revenue: "$78.75",
	   					trend: "0",
	   					trend_type: "none"
	   				},
	   				{
	   					name: "William Bryan",
	   					revenue: "$24.07",
	   					trend: "-1",
	   					trend_type: "minus"
	   				},
	   				{
	   					name: "Hugh Copeland",
	   					revenue: "$112.46",
	   					trend: "-4",
	   					trend_type: "minus"
	   				},
	   				{
	   					name: "Tom Delonge",
	   					revenue: "$41.00",
	   					trend: "+7",
	   					trend_type: "plus"
	   				},
	   				{
	   					name: "Mark Hoppus",
	   					revenue: "$56.89",
	   					trend: "0",
	   					trend_type: "none"
	   				},
	   				{
	   					name: "Travis Barker",
	   					revenue: "$35.88",
	   					trend: "-1",
	   					trend_type: "minus"
	   				}
	   			]
	   		}
	   	},
	   	methods: {
	   	},
	   	mounted: function() {
	   		Highcharts.setOptions({
	   			lang: {
	   				rangeSelectorZoom: ''
	   			}
	   		});
	   		Highcharts.chart('statistics', {
	   			chart: {
	   				zoomType: 'x',
	   				spacingTop: 20,
	   				type: 'spline'
	   			},
	   			legend: {
	   				enabled: false
	   			},
	   			credits: {
	   				enabled: false
	   			},
	   			rangeSelector: {
	   				buttonTheme: { // styles for the buttons
	   					fill: '#f7f8f9',
	   					stroke: '#e2e6ed',
	   					'stroke-width': 1,
	   					r: 15,
	   					width: 70,
	   					height: 30,
	   					style: {
	   						color: '#4f5357',
	   						fontWeight: 'normal'
	   					},
	   					states: {
	   						hover: {},
	   						select: {
	   							fill: '#52565b',
	   							style: {
	   								color: 'white',
	   								fontWeight: 'normal'
	   							}
	   						}
	   					}
	   				},
	   				inputEnabled: false,
	   				buttons: [{
	   					type: 'hour',
	   					count: 1,
	   					text: '1 hour'
	   				}, {
	   					type: 'hour',
	   					count: 24,
	   					text: '24 hours'
	   				}, {
	   					type: 'day',
	   					count: 1,
	   					text: '1 day'
	   				}],
	   				selected: 1
	   			},
	   			exporting: {
	   				enabled: false
	   			},
	   			xAxis: {
	   				type: 'datetime',
	   				dateTimeLabelFormats: {
	   					hour: '%I %p',
	   					minute: '%I:%M %p'
	   				},
	   				title: {
	   					text: ''
	   				}
	   			},
	   			yAxis: {
	   				min: 0,
	   				max: 3.5,
	   				tickInterval: 5,
	   				labels: {
	   					formatter: function() {
	   						if (this.value > 10) {
	   							return this.value;
	   						}
	   					}
	   				},
	   				showEmpty: false,
	   				gridLineWidth: 0,
	   				title: {
	   					text: ''
	   				},
	   				min: 0
	   			},
	   			title: {
	   				text: ''
	   			},
	   			plotOptions: {
	   				spline: {
	   					marker: {
	   						enabled: true
	   					}
	   				}
	   			},
	   			series: [{
	   					name: 'ASR in',
	   					data: [
	   						[Date.UTC(2016, 9, 21, 8, 15), 4],
	   						[Date.UTC(2016, 9, 21, 8, 20), 4],
	   						[Date.UTC(2016, 9, 21, 9, 40), 4],
	   					],
	   					color: '#84e1f2',
	   					marker: {
	   						symbol: 'circle'
	   					}
	   				}, {
	   					name: 'Revenue in',
	   					data: [
	   						[Date.UTC(2016, 9, 21, 9, 15), 3],
	   						[Date.UTC(2016, 9, 21, 10, 20), 3],
	   						[Date.UTC(2016, 9, 21, 11, 40), 3],
	   					],
	   					color: '#7acf7c',
	   					marker: {
	   						symbol: 'circle'
	   					}
	   				}, {
	   					name: 'ACD in',
	   					data: [
	   						[Date.UTC(2016, 9, 21, 9, 15), 2],
	   						[Date.UTC(2016, 9, 21, 9, 20), 2],
	   						[Date.UTC(2016, 9, 21, 10, 40), 2],
	   					],
	   					color: '#f58889',
	   					marker: {
	   						symbol: 'circle'
	   					}
	   				},
	   				{
	   					name: 'Profitability in',
	   					data: [
	   						[Date.UTC(2016, 9, 21, 8, 30), 1],
	   						[Date.UTC(2016, 9, 21, 9, 20), 1],
	   						[Date.UTC(2016, 9, 21, 9, 45), 1],
	   					],
	   					color: '#b4b0f6',
	   					marker: {
	   						symbol: 'circle'
	   					}
	   				}
	   			]
	   		});
	   		Highcharts.stockChart('time_line', {
	   			chart: {
	   				zoomType: 'x',
	   				spacingTop: 10,
	   			},
	   			legend: {
	   				enabled: true,
	   				layout: 'vertical',
	   				align: 'right',
	   				verticalAlign: 'top',
	   				floating: true,
	   				y: 80
	   			},
	   			credits: {
	   				enabled: false
	   			},
	   			rangeSelector: {
	   				buttonTheme: { // styles for the buttons
	   					fill: '#f7f8f9',
	   					stroke: '#e2e6ed',
	   					'stroke-width': 1,
	   					r: 2,
	   					width: 40,
	   					height: 30,
	   					style: {
	   						color: '#4f5357',
	   						fontWeight: 'normal'
	   					},
	   					states: {
	   						hover: {},
	   						select: {
	   							fill: '#52565b',
	   							style: {
	   								color: 'white',
	   								fontWeight: 'normal'
	   							}
	   						}
	   					}
	   				},
	   				inputBoxBorderColor: 'gray',
	   				inputBoxWidth: 100,
	   				inputBoxHeight: 18,
	   				inputStyle: {
	   					color: '#4f5357',
	   					fontWeight: 'normal'
	   				},
	   				labelStyle: {
	   					color: '#222222',
	   					fontWeight: 'normal'
	   				},
	   				buttons: [{
	   						type: 'minute',
	   						count: 5,
	   						text: '5min'
	   					}, {
	   						type: 'minute',
	   						count: 30,
	   						text: '30min'
	   					}, {
	   						type: 'hour',
	   						count: 1,
	   						text: '1h'
	   					}, {
	   						type: 'hour',
	   						count: 3,
	   						text: '3h'
	   					}, {
	   						type: 'hour',
	   						count: 4,
	   						text: '4h'
	   					}, {
	   						type: 'hour',
	   						count: 6,
	   						text: '6h'
	   					},
	   					{
	   						type: 'hour',
	   						count: 8,
	   						text: '8h'
	   					},
	   					{
	   						type: 'hour',
	   						count: 12,
	   						text: '12h'
	   					},
	   					{
	   						type: 'hour',
	   						count: 24,
	   						text: '24h'
	   					},
	   					{
	   						type: 'day',
	   						count: 2,
	   						text: '2d'
	   					},
	   					{
	   						type: 'day',
	   						count: 7,
	   						text: '7d'
	   					},
	   					{
	   						type: 'mont',
	   						count: 1,
	   						text: '1m'
	   					},
	   					{
	   						type: 'all',
	   						text: 'All'
	   					}
	   				],
	   				selected: 3
	   			},
	   			exporting: {
	   				enabled: true
	   			},
	   			yAxis: {
	   				title: {
	   					text: ''
	   				},
	   				opposite: false
	   			},
	   			title: {
	   				text: 'Connected Calls',
	   				margin: 20
	   			},
	   			series: [{
	   				type: 'spline',
	   				name: 'Connected Calls',
	   				data: [2, 12, 3, 6, 11, 0, 9, 4, 8, 7, 10, 2, 1, 13, 5],
	   				pointStart: 1230764400000,
	   				pointInterval: 3600000,
	   				color: '#03c0fc',
	   				showInLegend: true
	   			}]
	   		});
	   		Highcharts.stockChart('ingress_cpg', {
	   			chart: {
	   				zoomType: 'x',
	   				spacingTop: 10,
	   			},
	   			legend: {
	   				enabled: true,
	   				layout: 'vertical',
	   				align: 'right',
	   				verticalAlign: 'top',
	   				floating: true,
	   				y: 80
	   			},
	   			credits: {
	   				enabled: false
	   			},
	   			rangeSelector: {
	   				buttonTheme: { // styles for the buttons
	   					fill: '#f7f8f9',
	   					stroke: '#e2e6ed',
	   					'stroke-width': 1,
	   					r: 2,
	   					width: 40,
	   					height: 30,
	   					style: {
	   						color: '#4f5357',
	   						fontWeight: 'normal'
	   					},
	   					states: {
	   						hover: {},
	   						select: {
	   							fill: '#52565b',
	   							style: {
	   								color: 'white',
	   								fontWeight: 'normal'
	   							}
	   						}
	   					}
	   				},
	   				inputBoxBorderColor: 'gray',
	   				inputBoxWidth: 100,
	   				inputBoxHeight: 18,
	   				inputStyle: {
	   					color: '#4f5357',
	   					fontWeight: 'normal'
	   				},
	   				labelStyle: {
	   					color: '#222222',
	   					fontWeight: 'normal'
	   				},
	   				buttons: [{
	   						type: 'minute',
	   						count: 5,
	   						text: '5min'
	   					}, {
	   						type: 'minute',
	   						count: 30,
	   						text: '30min'
	   					}, {
	   						type: 'hour',
	   						count: 1,
	   						text: '1h'
	   					}, {
	   						type: 'hour',
	   						count: 3,
	   						text: '3h'
	   					}, {
	   						type: 'hour',
	   						count: 4,
	   						text: '4h'
	   					}, {
	   						type: 'hour',
	   						count: 6,
	   						text: '6h'
	   					},
	   					{
	   						type: 'hour',
	   						count: 8,
	   						text: '8h'
	   					},
	   					{
	   						type: 'hour',
	   						count: 12,
	   						text: '12h'
	   					},
	   					{
	   						type: 'hour',
	   						count: 24,
	   						text: '24h'
	   					},
	   					{
	   						type: 'day',
	   						count: 2,
	   						text: '2d'
	   					},
	   					{
	   						type: 'day',
	   						count: 7,
	   						text: '7d'
	   					},
	   					{
	   						type: 'mont',
	   						count: 1,
	   						text: '1m'
	   					},
	   					{
	   						type: 'all',
	   						text: 'All'
	   					}
	   				],
	   				selected: 3
	   			},
	   			exporting: {
	   				enabled: true
	   			},
	   			yAxis: {
	   				title: {
	   					text: ''
	   				},
	   				opposite: false
	   			},
	   			title: {
	   				text: 'Ingress CPG',
	   				margin: 20
	   			},
	   			series: [{
	   				type: 'spline',
	   				name: 'Ingress CPG',
	   				data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	   				pointStart: 1230764400000,
	   				pointInterval: 3600000,
	   				color: '#03c0fc',
	   				showInLegend: true
	   			}]
	   		});
	   		Highcharts.stockChart('chanell', {
	   			chart: {
	   				zoomType: 'x',
	   				spacingTop: 10,
	   			},
	   			legend: {
	   				enabled: true,
	   				layout: 'vertical',
	   				align: 'right',
	   				verticalAlign: 'top',
	   				floating: true,
	   				y: 80
	   			},
	   			credits: {
	   				enabled: false
	   			},
	   			rangeSelector: {
	   				buttonTheme: { // styles for the buttons
	   					fill: '#f7f8f9',
	   					stroke: '#e2e6ed',
	   					'stroke-width': 1,
	   					r: 2,
	   					width: 40,
	   					height: 30,
	   					style: {
	   						color: '#4f5357',
	   						fontWeight: 'normal'
	   					},
	   					states: {
	   						hover: {},
	   						select: {
	   							fill: '#52565b',
	   							style: {
	   								color: 'white',
	   								fontWeight: 'normal'
	   							}
	   						}
	   					}
	   				},
	   				inputBoxBorderColor: 'gray',
	   				inputBoxWidth: 100,
	   				inputBoxHeight: 18,
	   				inputStyle: {
	   					color: '#4f5357',
	   					fontWeight: 'normal'
	   				},
	   				labelStyle: {
	   					color: '#222222',
	   					fontWeight: 'normal'
	   				},
	   				buttons: [{
	   						type: 'minute',
	   						count: 5,
	   						text: '5min'
	   					}, {
	   						type: 'minute',
	   						count: 30,
	   						text: '30min'
	   					}, {
	   						type: 'hour',
	   						count: 1,
	   						text: '1h'
	   					}, {
	   						type: 'hour',
	   						count: 3,
	   						text: '3h'
	   					}, {
	   						type: 'hour',
	   						count: 4,
	   						text: '4h'
	   					}, {
	   						type: 'hour',
	   						count: 6,
	   						text: '6h'
	   					},
	   					{
	   						type: 'hour',
	   						count: 8,
	   						text: '8h'
	   					},
	   					{
	   						type: 'hour',
	   						count: 12,
	   						text: '12h'
	   					},
	   					{
	   						type: 'hour',
	   						count: 24,
	   						text: '24h'
	   					},
	   					{
	   						type: 'day',
	   						count: 2,
	   						text: '2d'
	   					},
	   					{
	   						type: 'day',
	   						count: 7,
	   						text: '7d'
	   					},
	   					{
	   						type: 'mont',
	   						count: 1,
	   						text: '1m'
	   					},
	   					{
	   						type: 'all',
	   						text: 'All'
	   					}
	   				],
	   				selected: 3
	   			},
	   			exporting: {
	   				enabled: true
	   			},
	   			yAxis: {
	   				title: {
	   					text: ''
	   				},
	   				opposite: false
	   			},
	   			title: {
	   				text: 'Chanell',
	   				margin: 20
	   			},
	   			series: [{
	   				type: 'spline',
	   				name: 'Chanell',
	   				data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	   				pointStart: 1230764400000,
	   				pointInterval: 3600000,
	   				color: '#03c0fc',
	   				showInLegend: true
	   			}]
	   		});
	   		Highcharts.chart('ingress_chanel', {
	   			chart: {
	   				type: 'solidgauge',
	   				margin: [0, 0, 0, 0],
	   				spacingTop: 0,
	   				spacingBottom: 0,
	   				spacingLeft: 0,
	   				spacingRight: 0,
	   				height: 120
	   			},
	   			exporting: {
	   				enabled: false
	   			},
	   			title: {
	   				verticalAlign: 'middle',
	   				floating: true,
	   				text: '327',
	   				y: 12
	   			},
	   			tooltip: {
	   				enabled: false
	   			},
	   			pane: {
	   				startAngle: 0,
	   				endAngle: 360,
	   				background: [{ // Track for Move
	   					outerRadius: '105%',
	   					innerRadius: '95%',
	   					backgroundColor: '#edeff5',
	   					borderWidth: 0
	   				}]
	   			},
	   			yAxis: {
	   				min: 0,
	   				max: 100,
	   				lineWidth: 0,
	   				tickPositions: []
	   			},
	   			plotOptions: {
	   				solidgauge: {
	   					borderWidth: '5px',
	   					dataLabels: {
	   						enabled: false
	   					},
	   					linecap: 'round',
	   					stickyTracking: false
	   				}
	   			},
	   			credits: {
	   				enabled: false
	   			},
	   			series: [{
	   				name: 'Move',
	   				borderColor: '#03c0fc',
	   				data: [{
	   					color: Highcharts.getOptions().colors[0],
	   					radius: '100%',
	   					innerRadius: '100%',
	   					y: 60
	   				}]
	   			}]
	   		});
	   		Highcharts.chart('ingress_cps', {
	   			chart: {
	   				type: 'solidgauge',
	   				margin: [0, 0, 0, 0],
	   				spacingTop: 0,
	   				spacingBottom: 0,
	   				spacingLeft: 0,
	   				spacingRight: 0,
	   				height: 120
	   			},
	   			exporting: {
	   				enabled: false
	   			},
	   			title: {
	   				verticalAlign: 'middle',
	   				floating: true,
	   				text: '90',
	   				y: 12
	   			},
	   			tooltip: {
	   				enabled: false
	   			},
	   			pane: {
	   				startAngle: 0,
	   				endAngle: 360,
	   				background: [{ // Track for Move
	   					outerRadius: '105%',
	   					innerRadius: '95%',
	   					backgroundColor: '#edeff5',
	   					borderWidth: 0
	   				}]
	   			},
	   			yAxis: {
	   				min: 0,
	   				max: 100,
	   				lineWidth: 0,
	   				tickPositions: []
	   			},
	   			plotOptions: {
	   				solidgauge: {
	   					borderWidth: '5px',
	   					dataLabels: {
	   						enabled: false
	   					},
	   					linecap: 'round',
	   					stickyTracking: false
	   				}
	   			},
	   			credits: {
	   				enabled: false
	   			},
	   			series: [{
	   				name: 'Move',
	   				borderColor: '#03c0fc',
	   				data: [{
	   					color: Highcharts.getOptions().colors[0],
	   					radius: '100%',
	   					innerRadius: '100%',
	   					y: 40
	   				}]
	   			}]
	   		});
	   		Highcharts.chart('egress_cps', {
	   			chart: {
	   				type: 'solidgauge',
	   				margin: [0, 0, 0, 0],
	   				spacingTop: 0,
	   				spacingBottom: 0,
	   				spacingLeft: 0,
	   				spacingRight: 0,
	   				height: 120
	   			},
	   			exporting: {
	   				enabled: false
	   			},
	   			title: {
	   				verticalAlign: 'middle',
	   				floating: true,
	   				text: '15',
	   				y: 12
	   			},
	   			tooltip: {
	   				enabled: false
	   			},
	   			pane: {
	   				startAngle: 0,
	   				endAngle: 360,
	   				background: [{ // Track for Move
	   					outerRadius: '105%',
	   					innerRadius: '95%',
	   					backgroundColor: '#edeff5',
	   					borderWidth: 0
	   				}]
	   			},
	   			yAxis: {
	   				min: 0,
	   				max: 100,
	   				lineWidth: 0,
	   				tickPositions: []
	   			},
	   			plotOptions: {
	   				solidgauge: {
	   					borderWidth: '5px',
	   					dataLabels: {
	   						enabled: false
	   					},
	   					linecap: 'round',
	   					stickyTracking: false
	   				}
	   			},
	   			credits: {
	   				enabled: false
	   			},
	   			series: [{
	   				name: 'Move',
	   				borderColor: '#03c0fc',
	   				data: [{
	   					color: Highcharts.getOptions().colors[0],
	   					radius: '100%',
	   					innerRadius: '100%',
	   					y: 80
	   				}]
	   			}]
	   		});
	   		Highcharts.chart('call', {
	   			chart: {
	   				type: 'solidgauge',
	   				margin: [0, 0, 0, 0],
	   				spacingTop: 0,
	   				spacingBottom: 0,
	   				spacingLeft: 0,
	   				spacingRight: 0,
	   				height: 120
	   			},
	   			exporting: {
	   				enabled: false
	   			},
	   			title: {
	   				verticalAlign: 'middle',
	   				floating: true,
	   				text: '0',
	   				y: 12
	   			},
	   			tooltip: {
	   				enabled: false
	   			},
	   			pane: {
	   				startAngle: 0,
	   				endAngle: 360,
	   				background: [{ // Track for Move
	   					outerRadius: '105%',
	   					innerRadius: '95%',
	   					backgroundColor: '#edeff5',
	   					borderWidth: 0
	   				}]
	   			},
	   			yAxis: {
	   				min: 0,
	   				max: 100,
	   				lineWidth: 0,
	   				tickPositions: []
	   			},
	   			plotOptions: {
	   				solidgauge: {
	   					borderWidth: '5px',
	   					dataLabels: {
	   						enabled: false
	   					},
	   					linecap: 'round',
	   					stickyTracking: false
	   				}
	   			},
	   			credits: {
	   				enabled: false
	   			},
	   			series: [{
	   				name: 'Move',
	   				borderColor: '#03c0fc',
	   				data: [{
	   					color: Highcharts.getOptions().colors[0],
	   					radius: '100%',
	   					innerRadius: '100%',
	   					y: 2
	   				}]
	   			}]
	   		});
	   	}
	   }
</script>
<style>
#container-margin-122 > div > div > div{
	background-color: white!important;
}

.dashboards .box img {
		float:none!important;
	}
</style>