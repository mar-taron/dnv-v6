<template>
	<div class="container-fluid">
		<div class="row">
			<div class="wrapper single">
				<time-display></time-display>
				<ol class="breadcrumb">
					<li class="breadcrumb-item">
						<a>Routing</a>
					</li>
					<li class="breadcrumb-item">
						<router-link to="/routing/dynamic_routing">Dynamic Routing</router-link>
					</li>
					<li class="breadcrumb-item active">Override</li>
				</ol>
				<h1 class="page-header">Override</h1>
				<router-link to="/routing/dynamic_routing" class="btn btn_white back">
					<span class="dnl_icon dnl_import"></span> Back </router-link>
				<div class="white_pad table_wrap">
					<spinner v-show="loading" class="spinner"></spinner>
					<div class="advanced_search_filter_panel bottom_0">
						<div class="inline-block search_wrapper pull-left">
							<label>Search:</label>
							<br>
							<input type="text" name="credit_search" v-model="credit_search" class="form-control inline-block search_field" placeholder="Enter Search">
							<span class="dnl_icon dnl_musica-searcher"></span>
						</div>
						<div class="inline-block pull-left">
							<label>Egress Trunk:</label>
							<br>
							<select2 :options="added_egress_trunk_options" v-model="egress_trunk">
							</select2>
						</div>
						<div class="col-md-4 col-sm-8">
							<div class="inlined">
								<label for="priority_range_1">Percentage Range:</label>
								<input type="text" name="priority_range_1" v-model="priority_range_1" class="form-control" placeholder="Enter Percentage Range">
							</div>
							<div class="inlined">
								<label for="priority_range_2" class="m-top-15"></label>
								<input type="text" name="priority_range_2" v-model="priority_range_2" class="form-control" placeholder="Enter Percentage Range">
							</div>
						</div>
						<div class="inline-block">
							<a class="btn btn-primary m-top-25">
								Query
							</a>
						</div>
						<div class="clearfix"></div>
					</div>
					<div class="table_filters m-top-15">
						<div class="inline-block select_min_wrapper">
							<span class="inline-block">Page row:</span>
							<select2 :options="options1" v-model="selected1" class="inline-block" @pagecount="changePageRow">
							</select2>
						</div>
						<div class="inline-block">
							<el-select v-model="override_table_columns" multiple placeholder="Show/Hide Columns" @change="handleChange">
								<el-option v-for="item in override_rule_table_column_options" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</div>
						<a class="btn btn-primary mini pull-right" @click="createPercentage">
							<span class="dnl_icon dnl_add"></span> Create new
						</a>
					</div>
					<div class="clearfix"></div>
					<div class="table-responsive">
						<table class="table table-striped table-hover aliases credits">
							<thead>
								<tr>
									<th v-if="showcolumns[0]">Prefix</th>
									<th v-if="showcolumns[1]">Egress Trunk
										<span class="dnl_icon dnl_sort pull-right"></span>
									</th>
									<th v-if="showcolumns[2]">Priority</th>
									<th v-if="showcolumns[3]" class="width_98">Actions</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="percentage in filterBy(percentages, credit_search)">
									<td v-if="showcolumns[0]">
										<input type="text" v-model="percentage.digits" class="form-control" v-if="percentage.is_creating || percentage.is_editing"> {{!percentage.is_creating && !percentage.is_editing?percentage.digits: ''}}
									</td>
									<td v-if="showcolumns[1]">
										<select class="selectable" v-model="percentage.resource_id" v-if="percentage.is_creating || percentage.is_editing">
											<option v-for="item in added_egress_trunk_options" v-bind:value="item.id">
												{{ item.text }}
											</option>
										</select>
										{{!percentage.is_creating && !percentage.is_editing?percentage.trunk_name: ''}}
									</td>
									<td v-if="showcolumns[2]">
										<input type="text" v-model="percentage.percentage" class="form-control" v-if="percentage.is_creating || percentage.is_editing"> {{!percentage.is_creating && !percentage.is_editing?percentage.percentage: ''}}
									</td>
									<td v-if="showcolumns[3]">
										<a class="action action_save" data-toggle="tooltip" data-placement="top" title="Save" v-if="percentage.is_creating || percentage.is_editing" @click="validatePercentage(percentage)">
											<span class="dnl_icon dnl_save"></span>
										</a>
										<a class="action action_edit" data-toggle="tooltip" data-placement="top" title="Edit" v-if="!percentage.is_creating && !percentage.is_editing" @click="editPercentage(percentage)">
											<span class="dnl_icon dnl_action_edit"></span>
										</a>
										<a class="action action_delete" data-toggle="tooltip" data-placement="top" title="Delete" @click="delete_item(percentage)">
											<span class="dnl_icon dnl_action_delete"></span>
										</a>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="pull-right pagination">
						<pagination :current-page="pageOne.currentPage" :total-pages="pageOne.totalPages" @page-changed="pageOneChanged">
						</pagination>
					</div>
					<div class="clearfix"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>   
const vSelect = require('vue!../main_components/select.vue'),
	Pagination = require('vue!../main_components/pagination.vue'),
	modal = require('vue!../main_components/modal.vue');
const api = require("../../api");
const vSpinner = require('vue!../main_components/fadeloader.vue');
import { mapActions } from 'vuex';
module.exports = {
	components: {
		'select2': vSelect,
		'pagination': Pagination,
		'spinner': vSpinner,
		'modal': modal
	},
	props: ['id'],
	data: function() {
		return {
			loading: false,
			added_egress_trunk_options: [{ id: 0, text: '' }],
			showcolumns: [true, true, true, true],
			override_table_columns: ['Prefix', 'Egress Trunk', 'Priority', 'Actions'],
			temp_override_table_columns: ['Prefix', 'Egress Trunk', 'Priority', 'Actions'],
			override_rule_table_column_options: [{
				value: 'Prefix',
				label: 'Prefix'
			}, {
				value: 'Egress Trunk',
				label: 'Egress Trunk'
			}, {
				value: 'Priority',
				label: 'Priority'
			}, {
				value: 'Actions',
				label: 'Actions'
			}],
			priority_range_1: '',
			priority_range_2: '',
			credit_search: '',
			checker: false,
			showModal: '',
			start_date: '',
			end_date: '',
			ftp_config_name: '',
			pageOne: {
				currentPage: 1,
				totalPages: 10,
				per_page: 10,
				total_cnt: 0,
			},
			selected1: 1,
			options1: [
				{ id: 1, text: '10' },
				{ id: 2, text: '20' },
				{ id: 3, text: '30' },
				{ id: 4, text: '50' },
				{ id: 5, text: '100' }
			],
			selected2: 0,
			options2: [
				{ id: 1, text: 'Alias' },
				{ id: 2, text: 'Active' },
				{ id: 3, text: 'Actions' }
			],
			egress_trunk: 0,
			percentages: []
		}
	},
	methods: {
		...mapActions({
			setAsyncConfirm: 'async_confirm/setAsyncConfirm',
			setMessage: 'app_message/setAppMessage'
		}),
		delete_percentage (id) {
			this.resource = this.$resource(api.getEndpointUrl() + '/v1/route/dynamic/override/'+id);
			this.resource.delete({id:id})
			.then(response => {
				if (response.body.success) {
					let index = _.findIndex(this.percentages, elem => elem.id   === id)
					if(~index)
						this.percentages.splice(index, 1)
					this.setMessage('Percentage was removed successfully')
				}
			})
		},
		askDeletePercentageConfirm (id) {
			this.setAsyncConfirm('Are you sure you want to delete?')
			.then(result => {
				if (result.accepted) {
					this.delete_percentage(id)
				}
			})
			.catch(error => {
				console.log(error)
			})
		},
		editPercentage(percentage) {
			Vue.set(percentage, 'is_editing', true);
		},
		savePercentage(percentage) {
			this.loading = true;
			const reqBody = {
				resource_id: percentage.resource_id,
				digits: percentage.digits,
				percentage: percentage.percentage
			}
			if(percentage.is_editing) {
				this.$http.patch(api.getEndpointUrl() + '/v1/route/dynamic/override/' + percentage.id, reqBody)
				.then(response => {
					if (response.body.success) {
						this.setMessage('The Percentage has been changed!');
						let index = _.findIndex(this.added_egress_trunk_options, elem => elem.id   === percentage.resource_id)
						if(~index)
							percentage.trunk_name = this.added_egress_trunk_options[index].text;
						percentage.is_editing = false;
					}
					this.loading = false;
				})
				.catch(error => {
					this.loading = false;
					console.log(error)
					this.setMessage({
						message: 'Failed to change Percentage',
						type: 'error'
					})
				})	
			}
			else if(percentage.is_creating) {
				this.$http.post(api.getEndpointUrl() + '/v1/route/dynamic/' + this.id + '/override/create', reqBody)
				.then(response => {
					if (response.body.success) {
						this.setMessage('The Percentage has been created!');
						this.percentages[0].id = response.body.object_id;
						if(this.percentages.length > this.pageOne.per_page)
							this.percentages.splice(this.pageOne.per_page, 1);
						this.pageOne.total_cnt ++;
						this.pageOne.totalPages = Math.ceil(this.pageOne.total_cnt / this.pageOne.per_page);
						let index = _.findIndex(this.added_egress_trunk_options, elem => elem.id   === percentage.resource_id)
						if(~index)
							percentage.trunk_name = this.added_egress_trunk_options[index].text;
						percentage.is_creating = false;
					}
					this.loading = false;
				})
				.catch(error => {
					this.loading = false;
					console.log(error)
					this.setMessage({
						message: 'Failed to create Percentage',
						type: 'error'
					})
				})	
			}
		},
		validatePercentage(percentage) {
			var vm = this;
			this.$validator.validateAll().then(() => {
				const err = this.$validator.getErrors();
				if (err.errors.length > 0) {
					const msg = err.errors[0].field + ' field can not leave as null';
					vm.setMessage({
						message: msg,
						type: 'error'
					})
				}
				else {
					vm.savePercentage(percentage);
				}
					
			}).catch((error) => {
				// eslint-disable-next-line
				console.log(error)
				vm.setMessage({
					message: 'Validation failed',
					type: 'error'
				})
			});
		},
		delete_item(percentage) {
			if(percentage.is_creating)
				this.percentages.splice(0, 1);
			else
				this.askDeletePercentageConfirm(percentage.id);
		},
		createPercentage() {
			if (this.percentages.length > 0 && this.percentages[0].is_creating)
				return;
			this.percentages.splice(0, 0, {
				digits: '',
				resource_id: '',
				percentage: '',
				is_creating: true,
				is_editing: false,
			})
		},
		getQueries() {
			const page = '?page=' + (this.pageOne.currentPage - 1)
			const per_page = '&per_page=' + this.pageOne.per_page
			return page + per_page
		},
		fetchPercentages() {
			this.loading = true;
			this.$http.get(api.getEndpointUrl() + '/v1/route/dynamic/' + this.id + '/override/list' + this.getQueries())
				.then(response => {
					//todo: check success flag? validation errors?
					this.loading = false;
					this.percentages = response.body.payload.items;
					var self = this;
					this.percentages.forEach(function(percentage, i) {
						let index = _.findIndex(self.added_egress_trunk_options, elem => elem.id   === percentage.resource_id)
						if(~index)
							percentage.trunk_name = self.added_egress_trunk_options[index].text;
					});
					this.pageOne.total_cnt = response.body.payload.total;
					this.pageOne.currentPage = response.body.payload.page + 1;
					this.pageOne.totalPages = Math.ceil(response.body.payload.total / this.pageOne.per_page);
				})
				.catch(error => {
					console.log(error)
				})
		},
		changePageRow(value) {
			if (value !== this.pageOne.per_page) {
				this.pageOne.per_page = value
				this.$nextTick(this.fetchPercentages)
			}
		},
		fetchAddedEgressList() {
			this.loading = true;
			return new Promise((resolve, reject) => {
				this.$http.get(api.getEndpointUrl() + '/v1/route/dynamic/' + this.id)
					.then(response => {
						//todo: check success flag? validation errors?
						this.loading = false;
						var routing = response.body.payload;
						console.log(routing.egress_trunks);
						var self = this;
						routing.egress_trunks.forEach(function(item, i) {
							var temp = item.trunk
							var trunk = {};
							trunk.id = temp.trunk_id;
							trunk.text = temp.trunk_name;
							self.added_egress_trunk_options.push(trunk);
						});
						resolve();
					})
					.catch(error => {
						console.log(error)
						reject(error);
					})
			});
		},
		handleChange() {
			for (let i = 0; i < this.temp_override_table_columns.length; i++) {
				if (_.indexOf(this.override_table_columns, this.temp_override_table_columns[i]) != -1) {
					Vue.set(this.showcolumns, i, true);
				}
				else {
					Vue.set(this.showcolumns, i, false);
				}
			}
		},
		pageOneChanged(pageNum) {
			if (pageNum !== this.pageOne.currentPage) {
				this.pageOne.currentPage = pageNum
				this.$nextTick(this.fetchPercentages)
			}
		},
		closeModal: function() {
			this.showModal = '';
		}
	},
	mounted: function() {
		$('[data-toggle="tooltip"]').tooltip();
	},
	updated: function() {
		document.querySelector('.el-input > input').placeholder = 'Show/Hide Columns';
	},
	created() {
		this.fetchAddedEgressList().then(() => {
			this.fetchPercentages()
		}).catch(error => {
			console.log(error);
		});
	}
}
</script>

<style>
.inlined {
	width: 47%;
	float: left;
	position: relative
}

.inlined:first-child {
	margin-right: 6%;
}

.inlined:first-child::after {
	content: '\23AF';
	position: absolute;
	top: 33px;
	right: -7.5%;
}
</style>
