<template>
	<div class="container-fluid">
		<div class="row">
			<div class="wrapper single">
				<time-display></time-display>
				<ol class="breadcrumb">
					<li class="breadcrumb-item">
						<a href="#">Configuration</a>
					</li>
					<li class="breadcrumb-item active">Trunk Group</li>
				</ol>
				<h1 class="page-header">Trunk Group</h1>
				<confirm v-show="showModal" @close="showModal = false" @submit="submit"></confirm>
				<tabs @activateTab="activateTab">
					<tab label="Egress Trunk Group" class="" icon="dnl_icon dnl_to_left" selected>
						<div class="white_pad table_wrap">
							<div class="table_filters">
								<div class="inline-block select_min_wrapper">
									<span class="inline-block">Page row:</span>
									<select2 :options="options1" v-model="selected1" class="inline-block" @pagecount="changePageCount">
									</select2>
								</div>
								<div class="inline-block">
									<!--<select2 :options="options2" v-model="selected2">
												<option disabled value="0">Show/Hide Columns</option>
											</select2>-->
									<el-select v-model="group_table_columns" multiple placeholder="Show/Hide Columns" @change="handleChange">
										<el-option v-for="item in group_table_column_options" :key="item.value" :label="item.label" :value="item.value">
										</el-option>
									</el-select>
								</div>
								<a class="btn btn-primary mini pull-right" v-on:click="onCreate('egress')">
									 Create new
								</a>
								<!--<router-link to="/configuration/trunk_group/new" class="btn btn-primary mini pull-right">
									<span class="dnl_icon dnl_add"></span> Create new
								</router-link>-->
							</div>
							<div class="table-responsive">
								<table class="table table-striped table-hover carrier_groups">
									<thead>
										<tr>
											<th v-if="showcolumns[0]" @click="sortColumn('group_name')">Group Name<span class="dnl_icon dnl_sort pull-right"></span></th>
											<th v-if="showcolumns[1]" class="width_138" >Trunk Count</th>
											<th v-if="showcolumns[2]" class="width_138">Action</th>
										</tr>
									</thead>
									<tbody>
										<tr v-if="!groups.length">
											<td style="text-align: center" colspan="3">No Data Found</td>
										</tr>
										<!--<tr v-for="group in orderBy(groups, 'carrier_name')">-->
										<tr v-for="(group, index) in groups">
											<td v-if="showcolumns[0]">{{group.group_name}}</td>
											<td v-if="showcolumns[1]">{{group.trunks_count}}</td>
											<td v-if="showcolumns[2]">
												<router-link :to="'/configuration/trunk_group/edit/egress/' + group.group_id" class="action action_edit" data-toggle="tooltip" data-placement="top" title="Edit">
													<span class="dnl_icon dnl_action_edit"></span>
												</router-link>
												<a class="action action_menu" data-toggle="tooltip" data-placement="top" title="Trunk List" v-on:click="trunk_list('egress', group)">
													<span class="dnl_icon dnl_action_menu"></span>
												</a>
												<a class="action action_delete" data-toggle="tooltip" data-placement="top" title="Delete" v-on:click="delete_group(group.group_id)">
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
					</tab>
					<tab label="Ingress Trunk Group" class="" icon="dnl_icon dnl_to_right">
						<div class="white_pad table_wrap">
							<div class="table_filters">
								<div class="inline-block select_min_wrapper">
									<span class="inline-block">Page row:</span>
									<select2 :options="options1" v-model="selected1" class="inline-block">
									</select2>
								</div>
								<div class="inline-block fix_medium_select">
									<!--<select2 :options="options2" v-model="selected2">
												<option disabled value="0">Show/Hide Columns</option>
											</select2>-->
									<el-select v-model="group_table_columns" multiple placeholder="Show/Hide Columns" @change="handleChange">
										<el-option v-for="item in group_table_column_options" :key="item.value" :label="item.label" :value="item.value">
										</el-option>
									</el-select>
								</div>
								<!--<router-link to="/configuration/trunk_group/new" class="btn btn-primary mini pull-right">
									<span class="dnl_icon dnl_add"></span> Create new
								</router-link>-->
								<a class="btn btn-primary mini pull-right" v-on:click="onCreate('ingress')">
									 Create new
								</a>
							</div>
							<div class="table-responsive">
								<table class="table table-striped table-hover carrier_groups">
									<thead>
										<tr>
											<th v-if="showcolumns[0]" @click="sortColumn('group_name')">Group Name<span class="dnl_icon dnl_sort pull-right"></span></th>

											<th v-if="showcolumns[1]" @click="sortColumn('trunk')">Trunk Count<span class="dnl_icon dnl_sort pull-right"></span></th>
											<th v-if="showcolumns[2]" class="width_138">Action</th>
										</tr>
									</thead>
									<tbody>
										<tr v-if="!groups.length">
											<td colspan="3">No Data Found</td>
										</tr>
										<tr v-for="(group, index) in groups">
											<td v-if="showcolumns[0]">{{group.group_name}}</td>
											<td v-if="showcolumns[1]">{{group.trunks_count}}</td>
											<td v-if="showcolumns[2]">
												<router-link :to="'/configuration/trunk_group/edit/ingress/' + group.group_id" class="action action_edit" data-toggle="tooltip" data-placement="top" title="Edit">
													<span class="dnl_icon dnl_action_edit"></span>
												</router-link>
												<a class="action action_menu" data-toggle="tooltip" data-placement="top" title="Trunk List" v-on:click="trunk_list('ingress', group)">
													<span class="dnl_icon dnl_action_menu"></span>
												</a>
												<a class="action action_delete" data-toggle="tooltip" data-placement="top" title="Delete" v-on:click="delete_group(group.group_id)">
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
					</tab>
				</tabs>
			</div>
		</div>
	</div>
</template>

<script>
const vSelect = require('vue!../main_components/select.vue'),
	Pagination = require('vue!../main_components/pagination.vue'),
	confirmmodal = require('vue!../main_components/confirm_delete.vue'),
	vTabs = require('vue!../main_components/tabs.vue'),
	vTab = require('vue!../main_components/tab.vue'),
	modal = require('vue!../main_components/modal.vue');
	const api = require("../../api");
	const auth = require("../../auth");
	_ = require('lodash');
	import {mapGetters,	mapActions} from 'vuex'

module.exports = {
	components: {
		'select2': vSelect,
		'pagination': Pagination,
		'modal': modal,
		'confirm': confirmmodal,
		'tabs': vTabs,
		'tab': vTab
	},
	data: function () {
		return {
            order: '',
            sort: '',
            name_sort: 'asc',
			apiUrl: '/v1/trunk/group/list',
			url: '',

			showModal: false,

			groups: [],
			selected_id: 0,

			pageOne: {
				currentPage: 1,
				totalPages: 10,
				cntpage: 10
			},
			selected1: 1,
			options1: [
				{ id: 1, text: '10' },
				{ id: 2, text: '20' },
				{ id: 3, text: '30' },
				{ id: 4, text: '50' },
				{ id: 5, text: '100' }
			],

			group_table_column_options: [{
				value: 'Group Name',
				label: 'Group Name'
			}, {
				value: 'Trunk Count',
				label: 'Trunk Count'
			}, {
				value: 'Action',
				label: 'Action'
			}],
			group_table_columns: ['Group Name', 'Trunk Count', 'Action'],
			showcolumns: [true, true, true],
		}
	},
	created: function () {
		this.fetchGroups();
	},
	methods: {
		...mapActions({
			setMessage: 'app_message/setAppMessage'
		}),
    sortColumn(column) {
        if(this.name_sort == 'asc') {
            this.name_sort = 'desc'
            this.sort = this.name_sort
            this.order = column
            this.fetchGroups()
        }

        else if(this.name_sort == 'desc') {
            this.name_sort = 'asc'
            this.sort = this.name_sort
            this.order = column
            this.fetchGroups()
        }
    },
		fetchGroups() {
			var page = this.pageOne.currentPage - 1;
			var per_page = this.pageOne.cntpage;
			this.loading = true;

			var url = api.getEndpointUrl() + this.apiUrl + "?trunk_type=egress&order_by=" + this.order + "&order_dir=" + this.name_sort;
			//this.url = url;

			url = url + "&page=" + page + "&per_page=" + per_page;

			this.$http.get(url,
				{
					headers: {
						"X-Auth-Token": auth.getToken()
					}
				}).then(function (response) {
					this.loading = false;
					//todo: check success flag? validation errors?
					var groups = response.body.payload.items;
					console.log(groups);
					this.groups = groups;
					var total_page = response.body.payload.total;
					this.pageOne.currentPage = response.body.payload.page + 1;
					this.pageOne.totalPages = Math.ceil(response.body.payload.total / per_page);
				}, function (error) {
					this.loading = false;
					console.log(error);
				});
		},
		onCreate(trunk_type) {
			this.$router.push({ path: "/configuration/trunk_group/new/" + trunk_type });
		},
		activateTab(tab) {
			var trunk_type = "egress";
			if (tab.name == "Ingress Trunk Group") {
				trunk_type = "ingress";
			}

			var page = this.pageOne.currentPage - 1;
			var per_page = this.pageOne.cntpage;
			this.loading = true;

			var url = api.getEndpointUrl() + this.apiUrl + "?order_by=group_id&order_dir=desc";
			url = url + "&trunk_type=" + trunk_type;

			this.url = url;
			url = url + "&page=" + page + "&per_page=" + per_page;

			this.$http.get(url,
				{
					headers: {
						"X-Auth-Token": auth.getToken()
					}
				}).then(function (response) {
					this.loading = false;
					//todo: check success flag? validation errors?
					var groups = response.body.payload.items;
					console.log(groups);
					this.groups = groups;
					var total_page = response.body.payload.total;
					this.pageOne.currentPage = response.body.payload.page + 1;
					this.pageOne.totalPages = Math.ceil(response.body.payload.total / per_page);
				}, function (error) {
					this.loading = false;
					console.log(error);
				});

		},
		handleChange() {
			if (_.indexOf(this.group_table_columns, 'Group Name') != -1) {
				// this.showcolumns[0] = true;
				Vue.set(this.showcolumns, 0, true);
			}
			else {
				// this.showcolumns[0] = false;
				Vue.set(this.showcolumns, 0, false);
			}

			if (_.indexOf(this.group_table_columns, 'Trunk Count') != -1) {
				// this.showcolumns[1] = true;
				Vue.set(this.showcolumns, 1, true);
			}
			else {
				// this.showcolumns[1] = false;
				Vue.set(this.showcolumns, 1, false);
			}

			if (_.indexOf(this.group_table_columns, 'Action') != -1) {
				// this.showcolumns[2] = true;
				Vue.set(this.showcolumns, 2, true);
			}
			else {
				// this.showcolumns[2] = false;
				Vue.set(this.showcolumns, 2, false);
			}
		},
		closeModal: function () {
			this.showModal = '';
		},
		trunk_list: function (type, group) {
			// trunk list dialog or page
			var trunks = [];
			group.trunks.forEach(function (temp, i) {
				trunks.push(temp.trunk_id);
			});
			console.log(trunks);
			// this.$router.push({ path: "/routing/trunks/" + type + "/" + trunks });
			this.$router.push({ path: "/routing/trunks/" + type + "/" + group.group_id});
		},
		delete_group: function (id) {
			this.showModal = true;
			this.selected_id = id;
		},
		pageOneChanged(pageNum) {
			if (pageNum !== this.pageOne.currentPage) {
				this.pageOne.currentPage = pageNum
				this.$nextTick(this.fetchGroups)
			}
		},
		changePageCount (countPerPage) {
			if (countPerPage !== this.pageOne.cntpage) {
				this.pageOne.cntpage = countPerPage
				this.$nextTick(this.fetchGroups)
			}
		},
		submit: function()
		{
			var vm = this;
			this.showModal = false;

			if(this.selected_id == 0){
				this.setMessage({
					message:'The trunk group has been not selected!',
					type:'error'
				});
			}
			else{
				this.loading = true;
				this.resource = vm.$resource(api.getEndpointUrl() + '/v1/trunk/group/'+this.selected_id);
				this.resource.delete({group_id:this.selected_id}).then(function(response){
					this.loading = false;
					let index = _.findIndex(this.groups, elem => elem.group_id  === this.selected_id)
					this.groups.splice(index, 1)
					this.setMessage('The trunk group have been deleted!')
				});
			}
		},
	},
	mounted: function () {
		$('[data-toggle="tooltip"]').tooltip();
	},
	updated: function () {
		var elementList = document.querySelectorAll('.el-input > input');
		for( var index=0; index < elementList.length; index++ ) {
			elementList[index].placeholder = 'Show/Hide Columns';
		}
	}
}
</script>

<style>
.el-select__tags {
	display: none;
}
@media (max-width: 480px){
	.table_wrap .table_filters .inline-block{
		display: block!important;
	}
}

@media (max-width: 425px){
	#app > div.container-fluid > div > div > div.tabs > div.tabs_container > div:nth-child(1) > div > div.table-responsive > table > thead > tr > th:nth-child(1) > span{
		margin-left: -9px!important;

	}
	#app > div.container-fluid > div > div > div.tabs > div.tabs_container > div:nth-child(1) > div > div.table-responsive > table > thead > tr > th:nth-child(1){
		padding: 0px 2px 9px 10px;
	}
}
@media (max-width: 358px){
	a.action{
		font-size:14px!important;
		width: 20px!important;
		height: 20px!important;
		line-height:20px!important;
	}
	a.action.action_delete{
		font-size: 13px!important;
		line-height:20px!important;
	}
	a.action.action_menu{
		font-size: 11px!important;
		line-height:20px!important;
	}
	table.table.table-striped.table-hover th{
		font-size: 10px!important;
	}
	span.dnl_icon.dnl_sort.pull-right{
		    margin-top: 3px!important;
		    font-size: 8px!important;
	}
	#app > div.container-fluid > div > div > div.tabs > div.tabs_container > div:nth-child(1) > div > div.table-responsive > table > thead > tr > th:nth-child(1){
		padding-right: 2px;
	}
}

</style>
