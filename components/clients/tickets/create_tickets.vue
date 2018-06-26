<template>
    <div class="container-fluid container-top-135">
        <div class="row">
            <div class="wrapper single">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                        <a href="#">Origination</a>
                    </li>
                    <li class="breadcrumb-item">
                        <router-link to="/clients/tickets/ticket">Tickets</router-link>
                    </li>
                    <li class="breadcrumb-item active">Create Ticket</li>
                </ol>
                <h1 class="page-header">Create Ticket</h1>
                <router-link to="/clients/tickets/ticket" class="btn btn_white back">
                    <span class="dnl_icon dnl_import"></span> Back </router-link>
                <div class="white_pad">
                    <div class="row">
                       <div class="col-sm-12 col-md-4">
                           <div class="form-group">
                               <label for="dnis_prefix">Name:</label>
                               <input type="text" name="dnis_prefix" v-model="dnis_prefix" class="form-control" placeholder="Enter DNIS Prefix">
                           </div>
                           <div class="form-group">
                               <label>E-mail Address:</label>
                               <select2 class="selectable form-control" v-model="period">
                                   <option v-for="item in period_options" v-bind:value="item.id">
                                       {{ item.text }}
                                   </option>
                               </select2>
                           </div>
                           <div class="form-group">
                               <label>Department:</label>
                               <select2 class="selectable form-control" v-model="period">
                                   <option v-for="item in period_options" v-bind:value="item.id">
                                       {{ item.text }}
                                   </option>
                               </select2>
                           </div>
                           <div class="form-group">
                               <label>Associate IP:</label>
                               <select2 class="selectable form-control" v-model="period">
                                   <option v-for="item in period_options" v-bind:value="item.id">
                                       {{ item.text }}
                                   </option>
                               </select2>
                           </div>
                       </div>
                       <div class="col-sm-12 col-md-4">
                           <label>Import File:</label>
                           <dropzone id="myVueDropzone" url="https://httpbin.org/post" v-on:vdropzone-success="success"></dropzone>

                       </div>
                       <div class="col-sm-12 col-md-4">
                        <div class="form-group">
                               <label for="dnis_prefix">Subject:</label>
                               <input type="text" name="dnis_prefix" v-model="dnis_prefix" class="form-control" placeholder="">
                           </div>
                           <label>Content:</label>
                           <ckeditor v-model="contentA" :minified = "true" :id="editorA" :height="'280px'"></ckeditor>
                       </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    const vSelect = require('vue!../../main_components/select.vue'),
    Dropzone = require('vue!../../main_components/dropzone.vue'),
    Ckeditor = require('vue!../../main_components/ckeditor.vue');

    import { mapActions } from 'vuex';
    module.exports = {
        components: {
            'select2': vSelect,
            Dropzone,
            Ckeditor
        },
        data: function () {
            return {
                code_summary: false,
                detail_by_trunk: false,
                total_by_country: false,
                total_by_codename: false,
                time_zone_options: [
                    { id: '+12:00', text: '+12:00' },
                    { id: '+11:00', text: '+11:00' },
                    { id: '+10:00', text: '+10:00' },
                    { id: '+09:00', text: '+09:00' },
                    { id: '+08:00', text: '+08:00' },
                    { id: '+07:00', text: '+07:00' },
                    { id: '+06:00', text: '+06:00' },
                    { id: '+05:00', text: '+05:00' },
                    { id: '+04:00', text: '+04:00' },
                    { id: '+03:00', text: '+03:00' },
                    { id: '+02:00', text: '+02:00' },
                    { id: '+01:00', text: '+01:00' },
                    { id: '00:00', text: '00:00' },
                    { id: '-01:00', text: '-01:00' },
                    { id: '-02:00', text: '-02:00' },
                    { id: '-03:00', text: '-03:00' },
                    { id: '-04:00', text: '-04:00' },
                    { id: '-05:00', text: '-05:00' },
                    { id: '-06:00', text: '-06:00' },
                    { id: '-07:00', text: '-07:00' },
                    { id: '-08:00', text: '-08:00' },
                    { id: '-09:00', text: '-09:00' },
                    { id: '-10:00', text: '-10:00' },
                    { id: '-11:00', text: '-11:00' },
                    { id: '-12:00', text: '-12:00' }
                ],
                decimal: '5',
                decimal_options: [
                    { id: '0', value: '0', text: '0' },
                    { id: '1', value: '1', text: '1' },
                    { id: '2', value: '2', text: '2' },
                    { id: '3', value: '3', text: '3' },
                    { id: '4', value: '4', text: '4' },
                    { id: '5', value: '5', text: '5' },
                    { id: '6', value: '6', text: '6' },
                    { id: '7', value: '7', text: '7' },
                    { id: '8', value: '8', text: '8' },
                    { id: '9', value: '9', text: '9' },
                    { id: '10', value: '10', text: '10' },
                ],
                pay_due_date: '',
                invoice_date: '',
                carrier: '',
                carrier_options: [],
                start_date_time: '',
                end_date_time: '',
                period: 'custom',
                period_options: [
                    { id: 'custom', value: 'custom', text: 'Custom' },
                    { id: 'curDay', value: 'curDay', text: 'Today' },
                    { id: 'prevDay', value: 'prevDay', text: 'Yesterday' },
                    { id: 'curWeek', value: 'curWeek', text: 'Current week' },
                    { id: 'prevWeek', value: 'prevWeek', text: 'Previous week' },
                    { id: 'curMonth', value: 'curMonth', text: 'Current month' },
                    { id: 'prevMonth', value: 'prevMonth', text: 'Previous month' },
                    { id: 'curYear', value: 'curYear', text: 'Current year' },
                    { id: 'prevYear', value: 'prevYear', text: 'Previous year' },
                ],

                groupname: '',
                received_on: '',
                carrier: '',
                amount: '',
                note: '',
                type: '',
                options: [
                    { id: 1, value: 'carrier1', text: 'Carrier 1' },
                    { id: 2, value: 'carrier2', text: 'Carrier 2' },
                    { id: 3, value: 'carrier3', text: 'Carrier 3' },
                    { id: 4, value: 'carrier4', text: 'Carrier 4' },
                    { id: 5, value: 'carrier5', text: 'Carrier 5' }
                ]
            }
        },
        created () {
            this.fetchCarriers();
        },
        methods: {
            ...mapActions({
                setMessage: 'app_message/setAppMessage'
            }),
            getInvoiceForRequest() {
                var invoice = {};
                invoice.include_account_detail = false;
                invoice.rate_decimal = this.decimal;
                invoice.show_trunk_breakdown = false;
                if(this.invoice_date != '')
                    invoice.start_date = this.invoice_date.toISOString();
                invoice.show_rate_table_breakdown = false;
                invoice.show_payment_summary = false;
                invoice.include_cdr_in_email = false;
                invoice.show_detail_by_code_name = this.total_by_codename;
                invoice.show_jurisdiction_detail = false;
                if(this.pay_due_date != '')
                    invoice.end_date = this.pay_due_date.toISOString();
                invoice.show_daily_breakdown = false;
                invoice.send_invoice_as_link = false;
                invoice.show_detail_by_country = this.total_by_country;
                if(this.start_date_time != '')
                    invoice.billing_start_time = this.start_date_time.toISOString();
                invoice.gmt = this.gmt;
                invoice.auto_send_invoice = false;
                invoice.show_cdr = false;
                invoice.show_detail_by_trunk = this.detail_by_trunk;
                if(this.end_date_time != '')
                    invoice.billing_end_time = this.end_date_time.toISOString();
                invoice.show_code_summary = this.code_summary;
                return invoice;
            },
            saveInvoice() {
                const reqBody = this.getInvoiceForRequest();
                var url;
                // if(this.editingrule) {
                // 	url = api.getEndpointUrl() + '/v1/did/billing_rule/' + this.id;
                // 	this.$http.patch(url, reqBody)
                // 		.then(response => {
                // 			if (response.body.success) {
                // 				this.setMessage('Billing Rule was changed successfully');
                // 				var thisvm = this;
                // 				setTimeout(function(){
                // 					thisvm.$router.push('/origination/billing_rule');
                // 				}, 3000);
                // 			}
                // 		})
                // 		.catch(error => {
                // 			console.log(error)
                // 			this.setMessage({
                // 				message: 'Failed to change rule',
                // 				type: 'error'
                // 			})
                // 		})
                // }
                // else {
                url = api.getEndpointUrl() + '/v1/carrier/'+this.carrier+'/invoice';
                this.$http.post(url, reqBody)
                    .then(response => {
                        if (response.body.success) {
                            this.setMessage('Invoice was created successfully');
                            var thisvm = this;
                            setTimeout(function(){
                                thisvm.$router.push('/finance/invoice');
                            }, 3000);
                        }
                    })
                    .catch(error => {
                        console.log(error)
                        this.setMessage({
                            message: 'Failed to create invoice',
                            type: 'error'
                        })
                    })
                // }
            },
            validateForInvoice() {
                var vm = this;
                this.$validator.validateAll().then(() => {
                    const err = this.$validator.getErrors();
                    if (err.errors.length > 0) {
                        vm.setMessage({
                            message: 'Validation failed',
                            type: 'error'
                        })
                    }
                    else {
                        vm.saveInvoice();
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
            fetchCarriers () {
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
                                        if(i == 0)
                                            self.carrier = carrier.id;
                                    });
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
                    this.loading = false;
                })
            }
        }
    }
</script>

<style>
    .selectable {
        width:100%!important;
    }
    #app > div.container-fluid > div > div > div > div > div:nth-child(1) > div > span {
        width: 100%!important;
    }
    #cke_1_top {
        padding: 0;
    }
</style>
