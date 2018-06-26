<template>
	<div class="container-fluid">
      <div class="row">
		<div class="wrapper single">
            <time-display></time-display>
			<ol class="breadcrumb">
				  <li class="breadcrumb-item"><a href="#">Finance</a></li>
                  <li class="breadcrumb-item">
                       <router-link to="/finance/invoice">Invoice</router-link>
                  </li>
				  <li class="breadcrumb-item active">Credit Note</li>
			</ol>
			<h1 class="page-header">Credit Note</h1>
			<div class="white_pad table_wrap">
                <spinner v-show="loading" class="spinner"></spinner>
                <div class="table_filters">
                     <router-link to="/finance/invoice" class="btn btn_white back bottom_null">
                        <span class="dnl_icon dnl_import"></span> Back 
                    </router-link>
					<a class="btn btn-primary mini pull-right">
						<span class="dnl_icon dnl_add"></span> Add New 
					</a>
				</div>
				<div class="table-responsive">
					<table class="table table-striped table-hover carrier_fields">
					  <thead>
						<tr>
						  <th>Entered On<span class="dnl_icon dnl_sort pull-right"></span></th>
						  <th>Entered By</th>
						  <th>Amount</th>
                          <th>Description</th>
						  <th>Action</th>
						</tr>
					  </thead>
					  <tbody>
                          <tr v-for="invoice in invoices">
                              <td>{{invoice.payment_time}}</td>
                              <td>{{invoice.client_name}}</td>
                              <td>{{invoice.amount}}</td>
                              <td>{{invoice.note}}</td>
                              <td>
                                  <a data-toggle="tooltip" data-placement="top" title="Edit" class="action action_edit">
                                      <span class="dnl_icon dnl_action_edit"></span>
                                  </a> 
                                  <a data-toggle="tooltip" data-placement="top" title="Delete" class="action action_delete">
                                      <span class="dnl_icon dnl_action_delete"></span>
                                  </a>
                              </td>
                          </tr>
                          <tr>
                              <td><b>Total</b></td>
                              <td></td>
                              <td><b>{{sum}}</b></td>
                              <td></td>
                              <td></td>
                          </tr>
					  </tbody>
					</table>
				</div>
				<div class="clearfix little-space"></div>
		</div>
	  </div>
	</div>
	</div>
</template>

<script>
const api = require("../../api");
const vSpinner = require('vue!../main_components/fadeloader.vue');
    module.exports = {
        components: {
            'spinner': vSpinner
        },
        props: ['client_id'],
        data: function () {
            return {
                sum: 0,
                invoices: [],
                loading: false,
            }
        },
        methods: {
            fetchCreditNote() {
                this.loading = true;
                var url = api.getEndpointUrl() + '/v1/finance/sent_payment/list?payment_type=credit note received'
                if(this.client_id !== 'null')
                    url += '&client_id=' + this.client_id
                this.$http.get(url)
				.then(response => {
					const body = response.body
					if (body.success) {
						this.invoices = body.payload.items
					}
                    this.loading = false;
				})
				.catch(error => {
					console.log(error)
					this.loading = false;
				})

                this.loading = true;
                url = api.getEndpointUrl() + '/v1/finance/sent_payment/list?payment_type=credit note sent'
                if(this.client_id !== 'null')
                    url += '&client_id=' + this.client_id
                this.$http.get(url)
				.then(response => {
					const body = response.body
					if (body.success) {
                        this.invoices.push(...body.payload.items);
					}
                    this.loading = false;
                    var thisvm = this;
                    this.invoices.forEach(function (invoice, i) {
                        thisvm.sum += invoice.amount;
                    });
				})
				.catch(error => {
					console.log(error)
					this.loading = false;
				})
                
            }
        },
        created() {
            this.fetchCreditNote();
        }
    }
</script>

<style>
    a.btn.btn_white.back.bottom_null {
        margin-bottom: 0;
    }
</style>
