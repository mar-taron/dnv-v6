<template>
	<div class="container-fluid">
		<div class="row">
			<div class="wrapper single">
				<time-display></time-display>
				<ol class="breadcrumb">
					<li class="breadcrumb-item">
						<a href="#">Termination</a>
					</li>
					<li class="breadcrumb-item active">Products</li>
				</ol>
				<h1 class="page-header">My Products</h1>
				<div class="white_pad table_wrap">
					<div class="table-responsive">
						<table class="table table-striped table-hover carrier_groups">
							<thead>
							<tr>
								<th v-if="showcolumns[0]">
								Time 
                                <!-- <a @click="sortColumn('id')"><span class="dnl_icon dnl_sort pull-right"></span></a> -->
								</th>
								<th v-if="showcolumns[1]">
									Call Attempt
								</th>
								<th v-if="showcolumns[2]">
									Non Zero
								</th>
								<th v-if="showcolumns[3]">
									Duration
								</th>
                                <th v-if="showcolumns[4]">
                                    ASR
                                </th>
                                <th v-if="showcolumns[5]">
                                    ACD
                                </th>
                                <th v-if="showcolumns[6]">
                                    SDP
                                </th>
                                <th v-if="showcolumns[7]">
                                    PPK
                                </th>
                                <th v-if="showcolumns[8]">
                                    Cost
                                </th>
							</tr>
							</thead>
							<tbody>
							<tr v-if="!trunks.length">
								<td style="text-align: center" colspan="4">No Data Found</td>
							</tr>

							<tr v-for="trunk in trunks">
								<td v-if="showcolumns[0]">{{trunk.trunk_name}}</td>
								<td v-if="showcolumns[1]"></td>
								<td v-if="showcolumns[2]"></td>
								<td v-if="showcolumns[3]"></td>
                                <td v-if="showcolumns[4]"></td>
                                <td v-if="showcolumns[5]"></td>
                                <td v-if="showcolumns[6]"></td>
                                <td v-if="showcolumns[7]"></td>
                                <td v-if="showcolumns[8]"></td>
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
    const vSelect = require('vue!../../main_components/select.vue'),
        Pagination = require('vue!../../main_components/pagination.vue'),
        confirmmodal = require('vue!../../main_components/confirm_delete.vue');
    const api = require("../../../api");
    const auth = require("../../../auth");
    _ = require('lodash');
    import {mapGetters,	mapActions} from 'vuex'

    module.exports = {
        components: {
            'select2': vSelect,
            'pagination': Pagination,
            'confirm': confirmmodal,
        },
        data: function () {
            return {
                apiUrl: '',
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
                trunks: [
                    {
                        id: '1',
                        trunk_name: 'trunk1',
                        host_port: '127.0.0.1:8080',
                        call_limit: '0',
                        cps_limit: '0'
                    },
                    {
                        id: '1',
                        trunk_name: 'trunk1',
                        host_port: '127.0.0.1:8080',
                        call_limit: '0',
                        cps_limit: '0'
                    },
                    {
                        id: '1',
                        trunk_name: 'trunk1',
                        host_port: '127.0.0.1:8080',
                        call_limit: '0',
                        cps_limit: '0'
                    },
                ],

                showcolumns: [true, true, true, true, true, true, true, true, true],
            }
        },
        methods: {
            ...mapActions({
                setAsyncConfirm: 'async_confirm/setAsyncConfirm',
                setMessage: 'app_message/setAppMessage'
            }),
            handleChange() {
                if (_.indexOf(this.trunk_table_columns, 'Ingress Name') != -1) {
                    Vue.set(this.showcolumns, 0, true);
                } else {
                    Vue.set(this.showcolumns, 0, false);
                }
                if (_.indexOf(this.trunk_table_columns, 'Host:Port') != -1) {
                    Vue.set(this.showcolumns, 1, true);
                } else {
                    Vue.set(this.showcolumns, 1, false);
                }
                if (_.indexOf(this.trunk_table_columns, 'Call Limit') != -1) {
                    Vue.set(this.showcolumns, 2, true);
                } else {
                    Vue.set(this.showcolumns, 2, false);
                }
                if (_.indexOf(this.trunk_table_columns, 'CPS Limit') != -1) {
                    Vue.set(this.showcolumns, 3, true);
                } else {
                    Vue.set(this.showcolumns, 3, false);
                }
                if (_.indexOf(this.trunk_table_columns, 'Action') != -1) {
                    Vue.set(this.showcolumns, 4, true);
                } else {
                    Vue.set(this.showcolumns, 4, false);
                }
            },
            ip_list: function(id) {
                this.$router.push({ path: "/clients/management/trunks/ips/" + id });
            },
            product_list: function(id) {
                this.$router.push({ path: "/clients/management/trunks/products/" + id });
            },
            deactivate: function(id) {

            },
            askDeleteConfirm: function(id) {
                this.setAsyncConfirm('Are you sure you want to delete?')
                    .then(result => {
                        if (result.accepted) {
                            this.delete_trunk(id)
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    })
            },
            delete_trunk (id) {
                this.resource = this.$resource(api.getEndpointUrl() + '' + id);
                this.resource.delete({id:id})
                    .then(response => {
                        if (response.body.success) {
                            let index = _.findIndex(this.trunks, elem => elem.id === id)
                            this.trunks.splice(index, 1)
                            this.setMessage('Trunk was removed successfully')
                        }
                    })
            },
            fetchtrunks() {
                var page = this.pageOne.currentPage - 1;
                var per_page = this.pageOne.cntpage;
                this.loading = true;

                this.$http.get(api.getEndpointUrl() + this.apiUrl + "?page=" + page + "&per_page=" + per_page + "&order_by=id&order_dir=desc",
                    {
                        headers: {
                            "X-Auth-Token": auth.getToken()
                        }
                    }).then(function (response) {
                        this.loading = false;
                        //todo: check success flag? validation errors?
                        var trunks = response.body.payload.items;
                        console.log(trunks);
                        this.trunks = trunks;
                        var total_page = response.body.payload.total;
                        this.pageOne.currentPage = response.body.payload.page + 1;
                        this.pageOne.totalPages = Math.ceil(response.body.payload.total / per_page);
                    }, function (error) {
                        this.loading = false;
                        console.log(error);
                    }
                );
            },
            pageOneChanged(pageNum) {
                if (pageNum !== this.pageOne.currentPage) {
                    this.pageOne.currentPage = pageNum
                    this.$nextTick(this.fetchtrunks)
                }
            },
            changePageCount (countPerPage) {
                if (countPerPage !== this.pageOne.cntpage) {
                    this.pageOne.cntpage = countPerPage
                    this.$nextTick(this.fetchtrunks)
                }
            },
        },

        mounted: function () {
            $('[data-toggle="tooltip"]').tooltip();
        },

        created: function () {
            this.fetchtrunks();
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

	@media (min-width: 768px) {
		#app > div.container-fluid > div > div > div.white_pad.table_wrap > div.table_filters > div.inline-block.select_min_wrapper.pull-right {
			margin-top: 26px;
		}
	}

	.el-select__tags {
		display: none;
	}

</style>
