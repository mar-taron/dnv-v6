<template>
	<div class="container-fluid">
      <div class="row">
		<div class="wrapper single">
			<time-display></time-display>
			<ol class="breadcrumb">
				  <li class="breadcrumb-item"><a href="#">Management</a></li>
				  <li class="breadcrumb-item active">Unclaimed Trunks</li>
			</ol>
			<h1 class="page-header">Unclaimed Trunks</h1>
			<div class="white_pad table_wrap">
				<spinner v-show="loading" class="spinner"></spinner>
				<div class="table_filters">
					<div class="inline-block select_min_wrapper">
						<span class="inline-block">Page row:</span>
						<select2 :options="options1" v-model="selected1" class="inline-block" @pagecount="changePageCount">
						</select2>
					</div>
					<div class="inline-block">
						<el-select v-model="unclaimed_trunk_table_columns" multiple placeholder="Show/Hide Columns" @change="handleChange">
							<el-option v-for="item in unclaimed_trunk_table_column_options" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</div>
				</div>
				<div class="table-responsive">
					<table class="table table-striped table-hover carrier_groups trunks">
					  <thead>
						<tr>
						  <th v-if="showcolumns[0]">Trunk<span class="dnl_icon dnl_sort pull-right"></span></th>
						  <th v-if="showcolumns[1]">Last Updated</th>
						  <th v-if="showcolumns[2]">Rate Table</th>
						  <th v-if="showcolumns[3]" class="width-65">Action</th>
						</tr>
					  </thead>
					  <tbody>
						<tr v-for="trunk in trunks">
						  <td v-if="showcolumns[0]">{{trunk.trunk_name}}</td>
						  <td v-if="showcolumns[1]">{{trunk.update_at}}</td>
						  <td v-if="showcolumns[2]">{{trunk.rate_table_name}}</td>
						  <td v-if="showcolumns[3]">
							  <a class="action action_delete" data-toggle="tooltip" data-placement="top" title="Delete" @click="askDeleteConfirm(trunk.trunk_id, trunk.type)">
								  <span class="dnl_icon dnl_action_delete"></span>
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
			</div>
		</div>
	  </div>
	</div>
</template>

<script>   
	const vSelect = require('vue!../main_components/select.vue'),
			Pagination = require('vue!../main_components/pagination.vue')
	const vSpinner = require('vue!../main_components/fadeloader.vue');
	const api = require("../../api");
	import { mapActions } from 'vuex'
	module.exports = {
		components: {
			'select2': vSelect,
			'pagination': Pagination,
			'spinner': vSpinner
		},
		data: function(){
			return {
				loading: false,
				showcolumns: [true, true, true, true],
				unclaimed_trunk_table_columns: ['Trunk', 'Last Updated', 'Rate Table', 'Actions'],
				temp_unclaimed_trunk_table_columns: ['Trunk', 'Last Updated', 'Rate Table', 'Actions'],
				unclaimed_trunk_table_column_options: [{
					value: 'Trunk',
					label: 'Trunk'
				}, {
					value: 'Last Updated',
					label: 'Last Updated'
				}, {
					value: 'Rate Table',
					label: 'Rate Table'
				}, {
					value: 'Actions',
					label: 'Actions'
				}],
			  pageOne: {
					currentPage: 1,
					totalPages: 10,
					cntpage: 10,
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
				  { id: 1, text: 'Group Name' },
				  { id: 2, text: 'Carrier Count' },
				  { id: 3, text: 'Actions' }
			  ],
			  trunks: [],
			}
		},
		methods: {
			...mapActions({
				setAsyncConfirm: 'async_confirm/setAsyncConfirm',
				setMessage: 'app_message/setAppMessage'
			}),
			deleteTrunk(id, type) {
				var url;
				if(type == 'orig')
					url = api.getEndpointUrl() + '/v1/ingress_trunk/' + id
				else if (type == 'term')
					url = api.getEndpointUrl() + '/v1/egress_trunk/' + id
				this.$http.delete(url)
				.then(response => {
					if (response.body.success) {
						let index = _.findIndex(this.trunks, elem => elem.trunk_id === id)
						if (~index) {
							this.trunks.splice(index, 1)
						}
						this.setMessage('The Trunk was removed successfully')
					}
				})
				.catch(error => {
					console.log(error)
				})
			},
			askDeleteConfirm(id, type) {
				this.setAsyncConfirm('Are you sure you want to delete this trunk')
				.then(result => {
					if (result.accepted) {
						this.deleteTrunk(id, type)
					}
				})
				.catch(error => {
					console.log(error)
				})
			},
			getQueries() {
				const page = '?page=' + (this.pageOne.currentPage - 1)
				const per_page = '&per_page=' + this.pageOne.cntpage
				return page + per_page
			},
			fetchUnclaimedList() {
				this.loading = true
				const url = api.getEndpointUrl() + '/v1/trunk/unclaimed/list' + this.getQueries()
				this.$http.get(url)
					.then(response => {
							const body = response.body
							
							if (body.success) {
								this.trunks = body.payload.items
								var total_page = response.body.payload.total;
								this.pageOne.currentPage = response.body.payload.page + 1;
								this.pageOne.totalPages = Math.ceil(response.body.payload.total / this.pageOne.cntpage );
							}
							this.loading = false
					})
					.catch(error => {
							console.log(error)
							this.loading = false
					})
			},
			handleChange() {
				for(let i = 0; i < this.temp_unclaimed_trunk_table_columns.length; i++) {
					if (_.indexOf(this.unclaimed_trunk_table_columns, this.temp_unclaimed_trunk_table_columns[i]) != -1) {
						Vue.set(this.showcolumns, i, true);
					}
					else {
						Vue.set(this.showcolumns, i, false);
					}
				}
			},
			pageOneChanged (pageNum) {
				if (pageNum !== this.pageOne.currentPage) {
					this.pageOne.currentPage = pageNum
					this.$nextTick(this.fetchUnclaimedList)
				}
			},
			changePageCount (countPerPage) {
				if (countPerPage !== this.pageOne.cntpage) {
					this.pageOne.cntpage = countPerPage
					this.$nextTick(this.fetchUnclaimedList)
				}
			},
		},
		mounted: function () {
			$('[data-toggle="tooltip"]').tooltip();
		},
		created() {
			this.fetchUnclaimedList();
		},
		updated: function () {
			document.querySelector('.el-input > input').placeholder = 'Show/Hide Columns';
		},
	}
</script>

<style>
	table.table.table-striped.table-hover.carrier_groups.trunks td {
		padding-right: 18px;
	}
</style>
