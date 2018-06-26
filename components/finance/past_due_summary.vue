<template>
	<div class="container-fluid">
      <div class="row">
		<div class="wrapper single">
			<time-display></time-display>
			<ol class="breadcrumb">
				  <li class="breadcrumb-item"><a href="#">Finance</a></li>
				  <li class="breadcrumb-item active">Past Due Summary</li>
			</ol>
			<h1 class="page-header">Past Due Summary</h1>
			<div class="white_pad configuration_pad">
                <spinner v-show="loading" class="spinner"></spinner>
				<div class="col-md-12 col-sm-12">
					<form class="form">
						<section class="config_section payment_setting">
							<div class="row">
                                <div class="col-md-3 col-sm-4 m-top-25">
                                     <div class="inline-block select_min_wrapper">
                                    <span class="inline-block">Page row:</span>
                                    <select2 :options="page_row_options" v-model="selected1" class="inline-block" @pagecount="changePageRow">
                                    </select2>
                                </div>
                                </div>
								   <div class="col-md-2 col-sm-3">
										 <label class="m-top-15"></label> 
										<select2 :options="filter_options" v-model="filter">
										</select2>
									</div>
								    <div class="col-md-4 col-sm-3">
										<label>Client Name:</label>
                                        <select style="width: 60%!important; min-width: 70%;" class="client-name-select" v-model="client">
                                            <option v-for="item in client_list" v-bind:value="item.id">
                                                {{ item.text }}
                                            </option>
                                        </select>
									</div>
                                    <div class="col-md-2 col-sm-2 m-top-25">
                                        <a class="btn btn-primary " v-on:click="submit()">
                                            Submit
                                        </a>
                                    </div>
							  </div>
						  </section>
					</form>
				</div>
				<div class="clearfix little-space"></div>
                <div class="col-md-12">
                    <div class="table-responsive">
                        <table class="table table-striped table-hover carrier_groups aligned-center">
                          <thead>
                            <tr>
                                <th rowspan="2" colspan="1">Client Name</th>
                                <th rowspan="2" colspan="1">Balance</th>
                                <th colspan="5" rowspan="1">Carrier Past Due</th>
                                <th rowspan="2" colspan="1" class="width-65">Action</th>
                            </tr>
                            <tr>
                                <th rowspan="1" colspan="1">Total</th>
                                <th rowspan="1" colspan="1">7 days</th>
                                <th rowspan="1" colspan="1">15 days</th>
                                <th rowspan="1" colspan="1">30 days</th>
                                <th rowspan="1" colspan="1">Over 30 days</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="client in clients">
                              <td>{{client.name}}</td>
                              <td>{{('past_due' in client)?client.past_due.balance: ''}}</td>
                              <td>{{('past_due' in client)?client.past_due.total: ''}}</td>
                              <td>{{('past_due' in client)?client.past_due.past_7: ''}}</td>
                              <td>{{('past_due' in client)?client.past_due.past_15: ''}}</td>
                              <td>{{('past_due' in client)?client.past_due.past_30: ''}}</td>
                              <td>{{('past_due' in client)?client.past_due.past_gt_30: ''}}</td>
                              <td>
                                  <router-link to="/finance/overall_mutual_balance" data-toggle="tooltip" data-placement="top" title="Detail" class="action action_read">
                                      <span class="dnl_icon dnl_eye"></span>
                                  </router-link>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                   </div>
                   <div class="pull-right pagination m-r-30">
                        <pagination :current-page="pageOne.currentPage"
                                    :total-pages="pageOne.totalPages"
                                    @page-changed="pageOneChanged">
                        </pagination>
                    </div>
               </div>
               <div class="clearfix"></div>
			</div>
		</div>
	  </div>
	</div>
</template>

<script> 
	const vSelect = require('vue!../main_components/select.vue');
    const api = require("../../api");
    const Pagination = require('vue!../main_components/pagination.vue');
    const vSpinner = require('vue!../main_components/fadeloader.vue');
	module.exports = {
		components: {
			'select2': vSelect,
            'pagination': Pagination,
            'spinner': vSpinner
		},
		data: function(){
            return {
                loading: false,
				page_row_options: [
					{ id: 1, text: '10' },
					{ id: 2, text: '20' },
					{ id: 3, text: '30' },
					{ id: 4, text: '50' },
					{ id: 5, text: '100' }
				],
                pageOne: {
                    currentPage: 1,
                    totalPages: 10,
                    per_page: 10,
                },
                client_list: [],
			  filter: '',
              client: '',
			  filter_options: [
				  { id: 1, text: 'Overdue > 0' },
				  { id: 2, text: 'No Overdue' },
				  { id: 3, text: 'All' }
			  ],
              clients: []
            }
        },
        mounted: function () {
			$('[data-toggle="tooltip"]').tooltip();
		},
        methods: {
            pageOneChanged (pageNum) {
				if (pageNum !== this.pageOne.currentPage) {
					this.pageOne.currentPage = pageNum
					this.$nextTick(this.fetchPastDueSummaries)
				}
			},
            changePageRow (value) {
				console.log(value);
				if (value !== this.pageOne.per_page) {
					this.pageOne.per_page = value
					this.$nextTick(this.fetchPastDueSummaries)
				}
			},
            getQueries() {
				const page = '?page=' + (this.pageOne.currentPage - 1)
				const per_page = '&per_page=' + this.pageOne.per_page
				return page + per_page
			},
            fetchPastDueSummaries() {
                const url = api.getEndpointUrl() + '/v1/client/past_due/list' + this.getQueries()
				this.$http.get(url)
				.then(response => {
					const body = response.body
					if (body.success) {
						this.clients = body.payload.items
						this.pageOne.currentPage = body.payload.page + 1
						this.pageOne.totalPages = Math.ceil(body.payload.total / body.payload.per_page)
					}
				})
				.catch(error => {
					console.log(error)
				})
            },
            submit() {

            },
            fetchCarriers() {
                var per_page=1;
                var url = api.getEndpointUrl() + "/v1/carrier/list?per_page="+per_page
                this.loading = true;

                this.$http.get(url)
                .then(response => {
                    const body = response.body
                    if (body.success) {
                        this.loading = false;
                        per_page = body.payload.total;

                        url = api.getEndpointUrl() + "/v1/carrier/list?per_page="+per_page
                        this.loading = true;
                        this.$http.get(url)
                        .then(response => {
                            const body = response.body
                            if (body.success) {
                                var self = this;
                                var carriers = body.payload.items

                                carriers.forEach(function (temp, i) {
                                    var carrier = {};
                                    carrier.id = temp.client_id;
                                    carrier.text = temp.name;
                                    self.client_list.push(carrier);
                                    if(i==0)
                                        self.client = carrier.id;
                                });
                                this.fetchPastDueSummaries();
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
                    console.log(error);
                    this.loading = false;
                })
            },
        },
        created() {
            this.fetchCarriers()
        }
	}
</script>
<style>
.client-name-select{
    background-color: #fff;
    border: 1px solid #dee0e3;
    border-radius: 4px;
    padding: 4px;
    height: 38px;
    box-shadow: 0 2px 7px 0 hsla(225,9%,75%,.2);
    color: #555;
}

@media (min-width: 1042px){
    #app > div.container-fluid > div > div > div > div.col-md-12.col-sm-12 > form > section > div > div.col-md-4.col-sm-3{
    margin-top: 25px;
}
}
</style>
