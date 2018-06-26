<template>
	<div class="container-fluid">
      <div class="row">
		<div class="wrapper single">
			<time-display></time-display>
			<ol class="breadcrumb">
				  <li class="breadcrumb-item"><a href="#">Statistics</a></li>
				  <li class="breadcrumb-item active">Host Based Report</li>
			</ol>
			<h1 class="page-header">Host Based Report</h1>
			<spinner v-show="loading" class="spinner"></spinner>
			<tabs>
				<tab label="Origination" class="" icon="dnl_icon dnl_to_left" selected>
					<div class="advanced_search_filter_panel">
						<div class="col-md-3 col-sm-4">
							<label>Carrier:</label>
							<select class="selectable no-min-width" v-model="ingress_carrier">
									<option v-for="item in carrier_options" v-bind:value="item.id">
										{{ item.text }}
									</option>
								</select>
						</div>
						<div class="col-md-5 col-sm-5 none-left-padding none-right-padding">
							<div class="inlined col-md-6">
								<label for="time_1">Start Time:</label>
								<el-date-picker style="width: 100%;" type="datetime" v-model="start_date" :picker-options="{}" placeholder="Enter Date and Time"></el-date-picker>
							</div>
							<div class="inlined col-md-6">
								<label for="time_2">End Time:</label>
								<el-date-picker style="width: 100%;" type="datetime" v-model="end_date" :picker-options="{}" placeholder="Enter Date and Time"></el-date-picker>
							</div>
						</div>
						<div class="col-md-2 col-sm-3">
								<a class="btn btn-primary full-width m-top-25" v-on:click="fetchCarriers()">
										Submit
								</a>
						</div>
						<div class="clearfix"></div>
					</div>
					<div class="table_filters searcheable">
						<div class="inline-block select_min_wrapper">
							<span class="inline-block">Page row:</span>
							<select2 :options="options1" v-model="selected1" class="inline-block" @pagecount="changePageCount">
							</select2>
						</div>
						<div class="inline-block">
							<!--<select2 :options="options2" v-model="selected2">
									<option disabled value="0">Show/Hide Columns</option>
								</select2>-->
							<el-select v-model="plan_table_columns" multiple placeholder="Show/Hide Columns" @change="handleChange">
								<el-option v-for="item in plan_table_column_options" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</div>

						<div class="inline-block pull-right timeReport">
							<span>Report period</span> {{ this.startDate }} - {{ this.endDate }}
						</div>
					</div>
					<div class="table-responsive">
						<table class="table table-striped table-hover roles centrum">
						  <thead>
							<tr>
							    <th v-if="showColumns[0]">Carrier<a @click="sortColumn('carrier')"> <span class="dnl_icon dnl_sort pull-right"></span></a></th>
							    <th v-if="showColumns[1]">Host<a @click="sortColumn('host')"> <span class="dnl_icon dnl_sort pull-right"></span></a></th>
							    <th v-if="showColumns[2]">Call Attempt<a @click="sortColumn('call_attempt')"> <span class="dnl_icon dnl_sort pull-right"></span></a></th>
								<th v-if="showColumns[3]">Non Zero <a @click="sortColumn('non_zero')"><span class="dnl_icon dnl_sort pull-right"></span></a></th>
								<th v-if="showColumns[4]">ASR<a @click="sortColumn('asr')"><span class="dnl_icon dnl_sort pull-right"></span></a></th>
								<th v-if="showColumns[5]" >ACD<a @click="sortColumn('acd')"><span class="dnl_icon dnl_sort pull-right"></span></a></th>
								<th v-if="showColumns[6]">PDD<a @click="sortColumn('pdd')"><span class="dnl_icon dnl_sort pull-right"></span></a></th>
								<th v-if="showColumns[7]">Avg Rate  <a @click="sortColumn('avg_rate')"><span class="dnl_icon dnl_sort pull-right"></span></a></th>
								<th v-if="showColumns[8]">Cost<a @click="sortColumn('cost')"><span class="dnl_icon dnl_sort pull-right"></span></a></th>
							</tr>
						  </thead>
						  <tbody>
							<tr v-if="!filterBy(carriers, report).length">
								<td style="text-align: center" colspan="9">No Data Found</td>
							</tr>
							<tr v-for="carrier in carriers">
							  <td v-if="showColumns[0]">{{carrier.carrier}}</td>
							  <td v-if="showColumns[1]">{{carrier.host}}</td>
							  <td v-if="showColumns[2]">{{carrier.call_attempt}}</td>
							  <td v-if="showColumns[3]">{{carrier.non_zero}}</td>
							  <td v-if="showColumns[4]">{{carrier.asr}}</td>
							  <td v-if="showColumns[5]">{{carrier.acd}}</td>
							  <td v-if="showColumns[6]">{{carrier.pdd}}</td>
							  <td v-if="showColumns[7]">{{carrier.avg_rate}}</td>
							  <td v-if="showColumns[8]">{{carrier.cost}}</td>
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
						<div class="col-md-3 col-sm-4">
							<label>Carrier:</label>
							<select class="selectable no-min-width" v-model="ingress_carrier">
									<option v-for="item in carrier_options" v-bind:value="item.id">
										{{ item.text }}
									</option>
								</select>
						</div>
						<div class="col-md-5 col-sm-5 none-left-padding none-right-padding">
							<div class="inlined col-md-6">
								<label for="time_1">Start Time:</label>
								<el-date-picker style="width: 100%;" type="datetime" v-model="start_date" :picker-options="{}" placeholder="Enter Date and TIme"></el-date-picker>
							</div>
							<div class="inlined col-md-6">
								<label for="time_2">End Time:</label>
								<el-date-picker style="width: 100%;" type="datetime" v-model="end_date" :picker-options="{}" placeholder="Enter Date and TIme"></el-date-picker>
							</div>
						</div>
						<div class="col-md-2 col-sm-3">
								<a class="btn btn-primary full-width m-top-25" v-on:click="">
										Submit
								</a>
						</div>
						<div class="clearfix"></div>
					</div>
					<div class="table_filters searcheable">
						<div class="inline-block select_min_wrapper">
							<span class="inline-block">Page row:</span>
							<select2 :options="options1" v-model="selected1" class="inline-block" @pagecount="changePageCount">
							</select2>
						</div>
						<div class="inline-block">
							<!--<select2 :options="options2" v-model="selected2">
									<option disabled value="0">Show/Hide Columns</option>
								</select2>-->
							<el-select v-model="plan_table_columns" multiple placeholder="Show/Hide Columns" @change="handleChange">
								<el-option v-for="item in plan_table_column_options" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</div>
						<div class="inline-block pull-right timeReport">
							<span>Report period</span> {{ this.startDate }} - {{ this.endDate }}
						</div>
					</div>
					<div class="table-responsive">
						<table class="table table-striped table-hover roles centrum">
						  <thead>
							<tr>
								<th v-if="showColumns[0]">Carrier<a @click="sortColumn('carrier')"> <span class="dnl_icon dnl_sort pull-right"></span></a></th>
								<th v-if="showColumns[1]">Host<a @click="sortColumn('host')"> <span class="dnl_icon dnl_sort pull-right"></span></a></th>
								<th v-if="showColumns[2]">Call Attempt<a @click="sortColumn('call_attempt')"> <span class="dnl_icon dnl_sort pull-right"></span></a></th>
								<th v-if="showColumns[3]">Non Zero <a @click="sortColumn('non_zero')"><span class="dnl_icon dnl_sort pull-right"></span></a></th>
								<th v-if="showColumns[4]">ASR<a @click="sortColumn('asr')"><span class="dnl_icon dnl_sort pull-right"></span></a></th>
								<th v-if="showColumns[5]" >ACD<a @click="sortColumn('acd')"><span class="dnl_icon dnl_sort pull-right"></span></a></th>
								<th v-if="showColumns[6]">PDD<a @click="sortColumn('pdd')"><span class="dnl_icon dnl_sort pull-right"></span></a></th>
								<th v-if="showColumns[7]">Avg Rate  <a @click="sortColumn('avg_rate')"><span class="dnl_icon dnl_sort pull-right"></span></a></th>
								<th v-if="showColumns[8]">Cost<a @click="sortColumn('cost')"><span class="dnl_icon dnl_sort pull-right"></span></a></th>
							</tr>
						  </thead>
						  <tbody>
							<tr v-if="!filterBy(carriers, report).length">
								<td style="text-align: center" colspan="9">No Data Found</td>
							</tr>
							<tr v-for="carrier in carriers">
								<td v-if="showColumns[0]">{{carrier.carrier}}</td>
								<td v-if="showColumns[1]">{{carrier.host}}</td>
								<td v-if="showColumns[2]">{{carrier.call_attempt}}</td>
								<td v-if="showColumns[3]">{{carrier.non_zero}}</td>
								<td v-if="showColumns[4]">{{carrier.asr}}</td>
								<td v-if="showColumns[5]">{{carrier.acd}}</td>
								<td v-if="showColumns[6]">{{carrier.pdd}}</td>
								<td v-if="showColumns[7]">{{carrier.avg_rate}}</td>
								<td v-if="showColumns[8]">{{carrier.cost}}</td>
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
		  Pagination = require('vue!../main_components/pagination.vue');
			const api = require("../../api");
			const	auth = require("../../auth");
	module.exports = {
		created: function(){
			this.fetchCarriers();
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
				pageOne: {
					currentPage: 1,
					totalPages: 10
				},
                order: '',
                sort: '',
                name_sort: 'asc',
				carrier_options: [{id: '', text: ''}],
				ingress_carrier: '',
				loading: false,
				carrier: '',
				time_1: '',
				time_2: '',
				selected1: '',
				selected2: '',
				start_date: '',
				end_date: '',
				showColumns: [true, true, true, true, true, true, true, true, true],

				options: [
				  { id: 1, value: 'carrier1', text: 'Carrier 1' },
				  { id: 2, value: 'carrier2', text: 'Carrier 2' },
				  { id: 3, value: 'carrier3', text: 'Carrier 3' },
				  { id: 4, value: 'carrier4', text: 'Carrier 4' },
				  { id: 5, value: 'carrier5', text: 'Carrier 5' }
			    ],
				carriers: [
					{
					  carrier: "Carrier1",
					  host: "37.8.6.210	",
					  call_attempt: '1',
					  non_zero: '0',
					  asr: '738.23',
					  acd: '937.22',
					  pdd: '360.01',
					  avg_rate: '344',
					  cost: '5892.22'
					},
					{
					  carrier: "Carrier1",
					  host: "37.8.6.210	",
					  call_attempt: '1',
					  non_zero: '0',
					  asr: '738.23',
					  acd: '937.22',
					  pdd: '360.01',
					  avg_rate: '344',
					  cost: '5892.22'
					},
					{
					  carrier: "Carrier1",
					  host: "37.8.6.210	",
					  call_attempt: '1',
					  non_zero: '0',
					  asr: '738.23',
					  acd: '937.22',
					  pdd: '360.01',
					  avg_rate: '344',
					  cost: '5892.22'
					},
					{
					  carrier: "Carrier1",
					  host: "37.8.6.210	",
					  call_attempt: '1',
					  non_zero: '0',
					  asr: '738.23',
					  acd: '937.22',
					  pdd: '360.01',
					  avg_rate: '344',
					  cost: '5892.22'
					},
					{
					  carrier: "Carrier1",
					  host: "37.8.6.210	",
					  call_attempt: '1',
					  non_zero: '0',
					  asr: '738.23',
					  acd: '937.22',
					  pdd: '360.01',
					  avg_rate: '344',
					  cost: '5892.22'
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
				plan_table_column_options: [{
						value: 'Carrier',
						label: 'Carrier'
					}, {
						value: 'Host',
						label: 'Host'
					}, {
						value: 'Call Attempt',
						label: 'Call Attempt'
					}, {
						value: 'Non Zero',
						label: 'Non Zero'
					}, {
						value: 'ASR',
						label: 'ASR'
					}, {
						value: 'ACD',
						label: 'ACD'
					}, {
						value: 'PDD',
						label: 'PDD'
					}, {
						value: 'Avg Rate',
						label: 'Avg Rate'
					}, {
						value: 'Cost',
						label: 'Cost'
					}],
					plan_table_columns: [
						"Carrier", "Host",  "Call Attempt", "Non Zero", "ASR", "ACD", "PDD", "Avg Rate", "Cost"
					],
			}
        },
		computed: {

			startDate() {
				if (this.start_date === '') {
					var today = new Date();
					var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
					var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
					var dateTime = date+' '+time;
					return dateTime;
				} else {
					return this.start_date;
				}

			},
			endDate() {

				if(this.end_date === '') {
					var today = new Date();
					var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
					var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
					var dateTime = date+' '+time;
					return dateTime;
				} else {
					return this.end_date;
				}

			}

		},
		updated: function () {
			var elementList = document.querySelectorAll('.el-select > .el-input > input');
			for (var index = 0; index < elementList.length; index++) {
				elementList[index].placeholder = 'Show/Hide Columns';
			}
		},
		methods: {
			pageOneChanged (pageNum) {
				this.pageOne.currentPage = pageNum
			},
            sortColumn(column) {
                if(this.name_sort == 'asc') {
                    this.name_sort = 'desc'
                    this.sort = this.name_sort
                    this.order = column
                    this.fetchCarriers()
                }

                else if(this.name_sort == 'desc') {
                    this.name_sort = 'asc'
                    this.sort = this.name_sort
                    this.order = column
                    this.fetchCarriers()
                }
            },
			handleChange() {
 				if (_.indexOf(this.plan_table_columns, 'Carrier') != -1) {
					Vue.set(this.showColumns, 0, true);
				} else {
					Vue.set(this.showColumns, 0, false);
				}
				if (_.indexOf(this.plan_table_columns, 'Host') != -1) {
					Vue.set(this.showColumns, 1, true);
				} else {
					Vue.set(this.showColumns, 1, false);
				}
				if (_.indexOf(this.plan_table_columns, 'Call Attempt') != -1) {
					Vue.set(this.showColumns, 2, true);
				} else {
					Vue.set(this.showColumns, 2, false);
				}
				if (_.indexOf(this.plan_table_columns, 'Non Zero') != -1) {
					Vue.set(this.showColumns, 3, true);
				} else {
					Vue.set(this.showColumns, 3, false);
				}
				if (_.indexOf(this.plan_table_columns, 'ASR') != -1) {
					Vue.set(this.showColumns, 4, true);
				} else {
					Vue.set(this.showColumns, 4, false);
				}
				if (_.indexOf(this.plan_table_columns, 'ACD') != -1) {
					Vue.set(this.showColumns, 5, true);
				} else {
					Vue.set(this.showColumns, 5, false);
				}
				if (_.indexOf(this.plan_table_columns, 'PDD') != -1) {
					Vue.set(this.showColumns, 6, true);
				} else {
					Vue.set(this.showColumns, 6, false);
				}
				if (_.indexOf(this.plan_table_columns, 'Avg Rate') != -1) {
					Vue.set(this.showColumns, 7, true);
				} else {
					Vue.set(this.showColumns, 7, false);
				}

				if (_.indexOf(this.plan_table_columns, 'Cost') != -1) {
					Vue.set(this.showColumns, 8, true);
				} else {
					Vue.set(this.showColumns, 8, false);
				}



			},
			changePageCount (countPerPage) {
				if (countPerPage !== this.pageOne.cntpage) {
					this.pageOne.cntpage = countPerPage
					this.$nextTick(this.fetchPlans)
				}
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
		},
	}
</script>

<style>
	.timeReport {
		margin-top: 11px;
	}
	.el-select__tags {
		display: none;
	}
</style>
