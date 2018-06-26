<template>
	<div class="container-fluid">
		<div class="row">
			<div class="wrapper single">
				<time-display></time-display>
				<ol class="breadcrumb">
					<li class="breadcrumb-item">
						<a href="#">Management</a>
					</li>
					<li class="breadcrumb-item active">Product</li>
				</ol>
				<h1 class="page-header">Product</h1>
				<confirm v-show="showModal" @close="showModal = false" @submit="submit"></confirm>
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
							<el-select v-model="product_table_columns" multiple placeholder="Show/Hide Columns" @change="handleChange">
								<el-option v-for="item in product_table_column_options" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</div>
						<router-link to="/management/products/new" class="btn btn-primary mini pull-right">
							<span class="dnl_icon dnl_add"></span> Create new
						</router-link>
					</div>
					<div class="table-responsive">
						<table class="table table-striped table-hover carrier_groups">
							<thead>
								<tr>
									<th v-if="showcolumns[0]" @click="sortColumn('name')">Product Name
										<span class="dnl_icon dnl_sort pull-right"></span>
									</th>
									<th v-if="showcolumns[1]">Routing Plan</th>
									<th v-if="showcolumns[2]">Rate Table</th>
									<th v-if="showcolumns[3]">Tech Prefix</th>
									<th v-if="showcolumns[4]" @click="sortColumn('update_at')">Update on
										<span class="dnl_icon dnl_sort pull-right"></span>
									</th>
									<th v-if="showcolumns[5]">Updated by</th>
									<th v-if="showcolumns[6]">Limits</th>
									<th v-if="showcolumns[7]">Action</th>
								</tr>
							</thead>
							<tbody>
								<tr v-if="!products.length">
									<td style="text-align: center" colspan="8">No Data Found</td>
								</tr>										
								
								<tr v-for="product in products">
									<td v-if="showcolumns[0]">{{product.name}}</td>
									<td v-if="showcolumns[1]">{{product.route_plan_name}}</td>
									<td v-if="showcolumns[2]">{{product.rate_table_name}}</td>
									<td v-if="showcolumns[3]">{{product.tech_prefix}}</td>
									<td v-if="showcolumns[4]">{{product.update_at}}</td>
									<td v-if="showcolumns[5]">{{product.update_by}}</td>
									<td v-if="showcolumns[6]">{{product.type}}</td>
									<td v-if="showcolumns[7]">
										<router-link to="/management/products/send_product_rate" class="action action_send" data-toggle="tooltip" data-placement="top" title="Send Rate">
											<span class="dnl_icon dnl_support"></span>
										</router-link>
										<router-link :to="'/switch/rate_table/editing_rates/'+product.rate_table_id" class="action action_edit" data-toggle="tooltip" data-placement="top" title="Edit Rate">
											<span class="dnl_icon dnl_action_edit"></span>
										</router-link>
										<router-link :to="'/switch/rate_table/editing_rates/'+product.rate_table_id+'/import'" class="action action_download" data-toggle="tooltip" data-placement="top" title="Upload">
											<span class="dnl_icon dnl_import"></span>
										</router-link>
										<router-link :to="'/routing/routing_plan/details/'+product.route_plan_id" class="action action_settings" data-toggle="tooltip" data-placement="top" title="Modify Routing Plan">
											<span class="dnl_icon dnl_setting"></span>
										</router-link>
										<a class="action action_edit" data-toggle="tooltip" data-placement="top" title="Edit" v-on:click="edit_product(product.id)">
											<span class="dnl_icon dnl_action_edit"></span>
										</a>
										<a class="action action_add" data-toggle="tooltip" data-placement="top" title="Assign Product" @click="showAssignModal='assign_product'">
											<span class="dnl_icon dnl_add"></span>
										</a>
										<a class="action action_delete" data-toggle="tooltip" data-placement="top" title="Delete" v-on:click="askDeleteConfirm(product.id)">
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
		<modal v-if="showAssignModal=='assign_product'" @close="showAssignModal = ''">
			<h3 slot="header">Assign Product</h3>
			<div slot="body">
			  <div class="">
				  <form class="form">
					  <div class="form-group">
						<label for="carrier">Carrier:</label>
						<select2 :options="carrier_options" v-model="carrier"></select2>
					  </div>
					  <div class="form-group">
						<label for="trunk_name">Trunk Name:</label>
						<input type="text" name="trunk_name" v-model="trunk_name" class="form-control" placeholder="Enter Trunk Name">	
					  </div>
					  <div class="form-group">
						<label for="copy_ip">Copy IP From:</label>
						<select2 :options="copy_ip_options" v-model="copy_ip"></select2>
					  </div>
					  <template v-for="(host, index) in hosts">
                         <div class="col-md-6 col-sm-8">
                            <div class="form-group">
                                <label>IP Addresses:</label>
                                <input type="text" name="password" v-model="host.ip" class="form-control" placeholder="Enter IP">
                            </div>
                        </div>
                        <div class="col-md-4 col-sm-4">
                            <div class="form-group">
                                <label>Port:</label>
                                <input type="text" name="password" v-model="host.port" class="form-control" placeholder="Enter Port">
                            </div>
                        </div>
                        <div class="col-md-1 col-sm-2" v-if="index==0">
                              <div class="inline_actions">
                                  <a><span class="dnl_icon dnl_add" @click="addIP"></span></a>
                              </div>
                        </div>
                        <div class="col-md-1 col-sm-2" v-if="index>0">
                              <div class="inline_actions">
                                  <a><span class="dnl_icon dnl_action_delete" @click="deleteIP(index)"></span></a>
                              </div>
                        </div>
                        <div class="clearfix"></div>
                        </template>
				  </form>
			  </div>
			</div>
			<div slot="footer">
				<button class="btn btn-primary submit" @click="assignProduct">Submit</button>
				<button @click="showAssignModal = ''" class="btn btn-default cancel">Cancel</button>
			</div>
		</modal>
	</div>
</template>

<script>   
const vSelect = require('vue!../main_components/select.vue'),
	Pagination = require('vue!../main_components/pagination.vue'),
	modal = require('vue!../main_components/modal.vue'),
	confirmmodal = require('vue!../main_components/confirm_delete.vue');
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
	},
	data: function () {
		return {
			order: 'name',
			sort: 'asc',
			name_sort: 'asc',
			copy_ip_options: [],
			copy_ip: '',
			trunk_name: '',
			carrier: '',
			carrier_options: [],
			showAssignModal: '',
			hosts: [{
				ip: '',
				port: 0
			}],
			apiUrl: '/v1/product/list',
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
			// selected2: 0,
			// options2: [
			// 	{ id: 1, text: 'Group Name' },
			// 	{ id: 2, text: 'Carrier Count' },
			// 	{ id: 3, text: 'Actions' }
			// ],
			products: [],
			showModal: '',
			selected_ids: [],

			product_table_column_options: [
				{
					value: 'Product Name',
					label: 'Product Name'
				},
				{
					value: 'Routing Plan',
					label: 'Routing Plan'
				},
				{
					value: 'Rate Table',
					label: 'Rate Table'
				},
				{
					value: 'Tech Prefix',
					label: 'Tech Prefix'
				},
				{
					value: 'Update on',
					label: 'Update on'
				},
				{
					value: 'Updated by',
					label: 'Updated by'
				},
				{
					value: 'Limits',
					label: 'Limits'
				},
				{
					value: 'Action',
					label: 'Action'
				}
			],
			product_table_columns: ['Product Name', 'Routing Plan', 'Rate Table', 'Tech Prefix',
			'Update on', 'Updated by', 'Limits', 'Action'],
			showcolumns: [true, true,true, true,true, true,true, true],			
		}
	},
	methods: {
		...mapActions({
			setAsyncConfirm: 'async_confirm/setAsyncConfirm',
			setMessage: 'app_message/setAppMessage'
		}),
		sortColumn(column) {
			if(this.name_sort == 'asc') {
				this.name_sort = 'desc'
				this.sort = this.name_sort
				this.order = column
				this.fetchProducts()
			}

			else if(this.name_sort == 'desc') {
				this.name_sort = 'asc'
				this.sort = this.name_sort
				this.order = column
				this.fetchProducts()
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
		assignProduct() {

		},
		deleteIP(id) {
			let index = id
			if (~id) {
				this.hosts.splice(index, 1)
			}
		},
		addIP() {
			this.hosts.push({
				ip: '',
				port: 0,
			})
		},
		handleChange() {
			if (_.indexOf(this.product_table_columns, 'Product Name') != -1) {
				Vue.set(this.showcolumns, 0, true);
			} else {
				Vue.set(this.showcolumns, 0, false);
			}
			if (_.indexOf(this.product_table_columns, 'Routing Plan') != -1) {
				Vue.set(this.showcolumns, 1, true);
			} else {
				Vue.set(this.showcolumns, 1, false);
			}
			if (_.indexOf(this.product_table_columns, 'Rate Table') != -1) {
				Vue.set(this.showcolumns, 2, true);
			} else {
				Vue.set(this.showcolumns, 2, false);
			}
			if (_.indexOf(this.product_table_columns, 'Tech Prefix') != -1) {
				Vue.set(this.showcolumns, 3, true);
			} else {
				Vue.set(this.showcolumns, 3, false);
			}
			if (_.indexOf(this.product_table_columns, 'Update on') != -1) {
				Vue.set(this.showcolumns, 4, true);
			} else {
				Vue.set(this.showcolumns, 4, false);
			}
			if (_.indexOf(this.product_table_columns, 'Updated by') != -1) {
				Vue.set(this.showcolumns, 5, true);
			} else {
				Vue.set(this.showcolumns, 5, false);
			}
			if (_.indexOf(this.product_table_columns, 'Limits') != -1) {
				Vue.set(this.showcolumns, 6, true);
			} else {
				Vue.set(this.showcolumns, 6, false);
			}
			if (_.indexOf(this.product_table_columns, 'Action') != -1) {
				Vue.set(this.showcolumns, 7, true);
			} else {
				Vue.set(this.showcolumns, 7, false);
			}
		},
	
		edit_product: function(id) {
			this.$router.push({ path: "/management/products/edit/" + id });
		},
		submit: function () {
			var vm = this;
			this.showModal = false;

			this.selected_ids.forEach(function (item, i) {
				var prodid = item;
				if (prodid == 0) {
					vm.setMessage({
						message: 'The product has been not selected!',
						type: 'error'
					});
				}
				else {
					vm.loading = true;
					vm.resource = vm.$resource(api.getEndpointUrl() + '/v1/product/' + prodid);
					vm.resource.delete({ id: prodid }).then(function (response) {
						vm.loading = false;
						let index = _.findIndex(vm.products, elem => elem.id  === prodid)
						vm.products.splice(index, 1)
						vm.setMessage('The product have been deleted!')
					});
				}
			});
		},
		getProductIndex (id) {
			return _.findIndex(this.products, elem => elem.id === id)
		},
		deleteProduct(id, no_message) {
			const url = api.getEndpointUrl() + '/v1/product/' + id
			this.$http.delete(url)
			.then(response => {
				if (response.body.success) {
					let index = this.getProductIndex(id)
					if (~index) {
						this.products.splice(index, 1)
					}
					if(no_message == false)
						this.setMessage('Product was removed successfully')
				}
			})
		},
		askDeleteConfirm(id) {
			this.setAsyncConfirm('Are you sure you want to delete this product')
			.then(result => {
				if (result.accepted) {
					this.deleteProduct(id, false)
				}
			})
			.catch(error => {
				console.log(error)
			})
		},
		// delete_product: function (id) {
		// 	this.showModal = true;
		// 	this.selected_ids = [];
		// 	this.selected_ids.push(id);
		// },
        getQueries() {
            const page = '?page=' + (this.pageOne.currentPage - 1)
            const per_page = '&per_page=' + this.pageOne.cntpage
            const order = '&order_by=' + this.order + '&order_dir=' + this.sort
            return page + per_page + order
        },
		fetchProducts() {
			var page = this.pageOne.currentPage - 1;
			var per_page = this.pageOne.cntpage;
			this.loading = true;

			this.$http.get(api.getEndpointUrl() + this.apiUrl + this.getQueries(),
				{
					headers: {
						"X-Auth-Token": auth.getToken()
					}
				}).then(function (response) {
					this.loading = false;
					//todo: check success flag? validation errors?
					var products = response.body.payload.items;
					console.log(products);
					this.products = products;
					var total_page = response.body.payload.total;
					this.pageOne.currentPage = response.body.payload.page + 1;
					this.pageOne.totalPages = Math.ceil(response.body.payload.total / per_page);
				}, function (error) {
					this.loading = false;
					console.log(error);
				});
		},
		pageOneChanged(pageNum) {
			if (pageNum !== this.pageOne.currentPage) {
				this.pageOne.currentPage = pageNum
				this.$nextTick(this.fetchProducts)
			}
		},
		changePageCount (countPerPage) {
			if (countPerPage !== this.pageOne.cntpage) {
				this.pageOne.cntpage = countPerPage
				this.$nextTick(this.fetchProducts)
			}
		},
	},
	mounted: function () {
		$('[data-toggle="tooltip"]').tooltip();
	},
	created: function () {
		this.fetchProducts();
		this.fetchCarriers();
	},
	updated: function() {
		document.querySelector('.el-input > input').placeholder = 'Show/Hide Columns';
	}
}
</script>

<style>
a.action.action_settings {
	padding-top: 3px;
	vertical-align: top;
	font-size: 18px;
}

.el-select__tags {
	display: none;
}

</style>
