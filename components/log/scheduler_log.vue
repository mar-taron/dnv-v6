<template>
	<div class="container-fluid">
		<div class="row">
			<div class="wrapper single">
				<time-display></time-display>
				<ol class="breadcrumb">
					<li class="breadcrumb-item">
						<a>Log</a>
					</li>
					<li class="breadcrumb-item active">Scheduler Log</li>
				</ol>
				<h1 class="page-header">Scheduler Log</h1>
				<div class="timeline">
					<div class="chart_select_header grided">
						<div class="col-md-6 col-sm-6">
							<div class="inlined">
								<label for="time1">Start Time:</label>
								<el-date-picker style="width: 100%;" type="datetime" v-model="time1" :picker-options="{}" placeholder="Enter Date and TIme"></el-date-picker>
							</div>
							<div class="inlined">
								<label for="time2" class="m-top-15"></label>
								<el-date-picker style="width: 100%;" type="datetime" v-model="time2" :picker-options="{}" placeholder="Enter Date and TIme"></el-date-picker>
							</div>
						</div>
						<div class="col-md-6 col-sm-6">
							<div class="inlined">
								<label for="e_time1">End Time:</label>
								<el-date-picker style="width: 100%;" type="datetime" v-model="e_time1" :picker-options="{}" placeholder="Enter Date and TIme"></el-date-picker>
							</div>
							<div class="inlined">
								<label for="e_time2" class="m-top-15"></label>
								<el-date-picker style="width: 100%;" type="datetime" v-model="e_time2" :picker-options="{}" placeholder="Enter Date and TIme"></el-date-picker>
							</div>
						</div>
						<div class="col-md-3 col-sm-3">
							<a class="btn btn-primary m-top-25">
								Query
							</a>
						</div>
						<div class="clearfix"></div>
					</div>
					<div class="chart_content">
						<div class="table_filters marged-40">
							<div class="inline-block select_min_wrapper">
								<span class="inline-block">Page row:</span>
								<select2 :options="per_page_number_list" v-model="selected1" class="inline-block" @pagecount="changePageRow">
								</select2>
							</div>
							<div class="inline-block">
								<el-select v-model="scheduler_table_columns" multiple placeholder="Show/Hide Columns" @change="handleChange">
									<el-option v-for="item in scheduler_table_column_options" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</div>
						</div>
						<div class="col-md-12">
							<div class="table-responsive marged-30">
								<table class="table table-striped table-hover carrier_groups aligned-center">
									<thead>
										<tr>
											<th v-if="showcolumns[0]">Name
												<span class="dnl_icon dnl_sort pull-right"></span>
											</th>
											<th v-if="showcolumns[1]">Start Time</th>
											<th v-if="showcolumns[2]">End Time</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="scheduler in schedulers">
											<td v-if="showcolumns[0]">{{scheduler.script_name}}</td>
											<td v-if="showcolumns[1]">{{scheduler.start_time}}</td>
											<td v-if="showcolumns[2]">{{scheduler.end_time}}</td>
										</tr>
									</tbody>
								</table>
							</div>
							<div class="pull-right pagination m-r-30">
								<pagination :current-page="pageOne.currentPage" :total-pages="pageOne.totalPages" @page-changed="pageOneChanged">
								</pagination>
							</div>
						</div>
					</div>
					<div class="clearfix"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>   
const vSelect = require('vue!../main_components/select.vue'),
	Pagination = require('vue!../main_components/pagination.vue');
	const api = require("../../api");
module.exports = {
	components: {
		'select2': vSelect,
		'pagination': Pagination
	},
	data: function () {
		return {
			temp_scheduler_table_columns: ['Name', 'Start Time', 'End Time'],
			scheduler_table_columns: ['Name', 'Start Time', 'End Time'],
			showcolumns: [true, true, true],
			scheduler_table_column_options: [{
				value: 'Name',
				label: 'Name'
			}, {
				value: 'Start Time',
				label: 'Start Time'
			}, {
				value: 'End Time',
				label: 'End Time'
			}],
			per_page_number_list: [
				{ id: 1, text: '10' },
				{ id: 2, text: '20' },
				{ id: 3, text: '30' },
				{ id: 4, text: '50' },
				{ id: 5, text: '100' }
			],
			order: 'id',
			sort: 'desc',
			pageOne: {
				currentPage: 1,
				totalPages: 10,
				per_page: 10,
			},
			time1: '',
			time2: '',
			e_time1: '',
			e_time2: '',
			options: [
				{ id: 1, value: 'carrier1', text: 'Carrier 1' },
				{ id: 2, value: 'carrier2', text: 'Carrier 2' },
				{ id: 3, value: 'carrier3', text: 'Carrier 3' },
				{ id: 4, value: 'carrier4', text: 'Carrier 4' },
				{ id: 5, value: 'carrier5', text: 'Carrier 5' }
			],
			selected1: 1,
			selected2: 1,
			schedulers: []
		}
	},
	methods: {
		handleChange() {
			for(let i = 0; i < this.temp_scheduler_table_columns.length; i++) {
				if (_.indexOf(this.scheduler_table_columns, this.temp_scheduler_table_columns[i]) != -1) {
					Vue.set(this.showcolumns, i, true);
				}
				else {
					Vue.set(this.showcolumns, i, false);
				}
			}
		},
		changePageRow(value) {
			console.log(value);
			if (value !== this.pageOne.per_page) {
				this.pageOne.per_page = value
				this.$nextTick(this.fetchSchedulerLog)
			}
		},
		pageOneChanged(pageNum) {
			if (pageNum !== this.pageOne.currentPage) {
				this.pageOne.currentPage = pageNum
				this.$nextTick(this.fetchSchedulerLog)
			}
		},
		getQueries() {
			const page = '?page=' + (this.pageOne.currentPage - 1)
			const per_page = '&per_page=' + this.pageOne.per_page
			const order = '&order_by=' + this.order + '&order_dir=' + this.sort
			return page + per_page + order
		},
		fetchSchedulerLog() {
			const url = api.getEndpointUrl() + "/v1/log/scheduler" + this.getQueries();
			this.$http.get(url)
			.then(response => {
				const body = response.body
				if (body.success) {
					this.schedulers = body.payload.items
					this.pageOne.currentPage = body.payload.page + 1
					this.pageOne.totalPages = Math.ceil(body.payload.total / body.payload.per_page)
				}
			})
			.catch(error => {
				console.log(error)
			})
		}
	},
	mounted: function () {
		$('[data-toggle="tooltip"]').tooltip();
	},
	created() {
		this.fetchSchedulerLog();
	}
}
</script>

<style>

</style>
