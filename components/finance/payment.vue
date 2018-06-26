<template>
	<div class="container-fluid">
      <div class="row">
		<div class="wrapper single">
			<time-display></time-display>
			<ol class="breadcrumb">
				  <li class="breadcrumb-item"><a href="#">Finance</a></li>
				  <li class="breadcrumb-item active">Payment</li>
			</ol>
			<h1 class="page-header">Payment</h1>
			<div class="btn-group" role="group">
			  <router-link :to="'/finance/payment/'+ payment_type +'/new'" class="btn btn-default create_new_iconed"><span class="dnl_icon dnl_add"></span> Create New</router-link>
			  <button type="button" class="btn btn-default" v-on:click="exportCSV()">
				  <span class="dnl_icon dnl_export" ></span> Export
			  </button>
			</div>
			<tabs class="agent_tabs" @activateTab="activateTab">
				<tab label="Received" class="" icon="dnl_icon dnl_to_left" selected>
					<div class="chart_select_header grided rounded">
						<div class="col-md-2 col-lg-1 pad-left pad-right pad-5 col-sm-4">
							<label>Carrier:</label>
							<select2 :options="carrier_options" v-model="carrier">
								<option value="0">All</option>
							</select2>
						</div>
						<div class="col-md-2 col-lg-2 col-sm-4">
							<label for="time1">From:</label>
							<el-date-picker style="width: 100%;" type="date" v-model="time1" :picker-options="{}" placeholder="Enter Date and Time"></el-date-picker>
						</div>
						<div class="col-md-2 col-lg-2 col-sm-4">
							<label for="time2">To:</label>
							<el-date-picker style="width: 100%;" type="date" v-model="time2" :picker-options="{}" placeholder="Enter Date and Time"></el-date-picker>
						</div>
						<div class="col-md-2 col-lg-2 col-sm-3">
							<label>GMT:</label>
							<select class="selectable no-min-width" v-model="gmt">
								<option v-for="item in gmt_options" v-bind:value="item.id">
									{{ item.text }}
								</option>
							</select>
						</div>
 						<div class="col-md-2 col-lg-2 col-sm-3">
							<label for="amount">Amount:</label>
							<input type="text" name="amount" v-model="amount" class="form-control" placeholder="Enter Amount">
						</div>
						<div class="col-md-2 col-lg-1 col-sm-3 pad-left pad-right pad-5">
							<label for="amount_to">To:</label>
							<input type="text" name="amount_to" v-model="amount_to" class="form-control" placeholder="Enter Amount To">
						</div>
						<div class="col-md-2 col-lg-1 col-sm-3">
							<a class="btn btn-primary m-top-25" @click="searchReceivedPayment">
								Query
							</a>
						</div>
						<div class="clearfix"></div>
					</div>
					<div class="pull-right pagination top_pagination">
						<pagination :current-page="pageOneReceived.currentPage"
									:total-pages="pageOneReceived.totalPages"
									@page-changed="pageOneChangedReceived">
						</pagination>
					</div>
					<div class="table_filters searcheable m-top-20">
						<div class="inline-block select_min_wrapper">
							<span class="inline-block">Page row:</span>
							<select2 :options="options1" v-model="selected1" class="inline-block" @pagecount="changePageRowReceived">
							</select2>
						</div>
						<div class="inline-block">
							<el-select v-model="payment_table_columns" multiple placeholder="Show/Hide Columns" @change="handleChange">
								<el-option v-for="item in payment_table_column_options" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</div>
					</div>
					<div class="clearfix"></div>
					<div class="table-responsive">
						<table class="table table-striped table-hover agents">
						  <thead>
							<tr>
							  <th></th>
 							  <th v-if="showcolumns[0]" @click="sortColumn('client_payment_id')" >Payment Id<span class="dnl_icon dnl_sort pull-right"></span></th>
							  <th v-if="showcolumns[1]" >Entered Time</th>
							  <th v-if="showcolumns[2]" @click="sortColumn('received_on')" >Received On<span class="dnl_icon dnl_sort pull-right"></span></th>
							  <th v-if="showcolumns[3]" @click="sortColumn('client_id')" >Carrier<span class="dnl_icon dnl_sort pull-right"></span></th>
							  <th v-if="showcolumns[4]"> Amount</th>
							  <th v-if="showcolumns[5]" @click="sortColumn('payment_type')">Type</th>
							  <th v-if="showcolumns[6]" >Updated by</th>
							  <th v-if="showcolumns[7]" class="width_138">Action</th>
 							</tr>
						  </thead>
						  <tbody v-for="payment in received_payments">
							<tr v-if="!received_payments.length">
								<td style="text-align: center" colspan="9">No Data Found</td>
							</tr>
							<tr>
							  <td><a class="toogler" @click="toggleTable($event)">+</a></td>
							  <td v-if="showcolumns[0]">{{payment.client_payment_id}}</td>
							  <td v-if="showcolumns[1]">{{payment.payment_time}}</td>
							  <td v-if="showcolumns[2]">{{payment.receiving_time}}</td>
							  <td v-if="showcolumns[3]">{{payment.client_name}}</td>
							  <td v-if="showcolumns[4]">{{payment.amount}}</td>
							  <td v-if="showcolumns[5]">{{payment.payment_type}}</td>
							  <td v-if="showcolumns[6]">{{payment.update_by}}</td>
							  <td v-if="showcolumns[7]">
								  <a class="action action_send" data-toggle="tooltip" data-placement="top" title="Send E-mail to Carrier" @click="sendEmailtoCarrier(payment)">
									  <span class="dnl_icon dnl_support"></span>
								  </a>
								  <a class="action action_read" data-toggle="tooltip" data-placement="top" title="Show Note" @click="showDetailNote(payment)">
									  <span class="dnl_icon dnl_eye"></span>
								  </a>
								  <a class="action action_delete" data-toggle="tooltip" data-placement="top" title="Delete" @click="askDeleteConfirm(payment.client_payment_id, 'received')">
									  <span class="dnl_icon dnl_action_delete"></span>
								  </a>
							 </td>
							</tr>
							<tr class="accordian-body collapse no_padding">
								<td colspan="8">
									<div class="table-responsive">
										<table class="table table-striped table-hover agents">
											<thead>
												<tr>
													<th>Invoice Number</th>
													<th>Amount</th>
													<th>Invoice Period</th>
													<th>Due Date</th>
													<th>Total Paid Amount</th>
													<th>Due Amount</th>
													<th>Current Payment Paid Amount</th>
												</tr>
											</thead>
											<tbody>
												<tr v-for="detail in payment.details">
													<td>{{detail.invoice_number}}</td>
													<td>{{detail.amount}}</td>
													<td>{{detail.invoice_period}}</td>
													<td>{{detail.due_date}}</td>
													<td>{{detail.total_paid_amount}}</td>
													<td>{{detail.due_amount}}</td>
													<td>{{detail.current_payment_paid_amount}}</td>
												</tr>
											</tbody>
										</table>
									</div>
								</td>
							</tr>
						  </tbody>
						</table>
					</div>
					<div class="pull-right pagination">
						<pagination :current-page="pageOneReceived.currentPage"
									:total-pages="pageOneReceived.totalPages"
									@page-changed="pageOneChangedReceived">
						</pagination>
					</div>
					<div class="clearfix"></div>
				</tab>
				<tab label="Sent" class="" icon="dnl_icon dnl_to_right">
					<div class="chart_select_header grided rounded">
						<div class="col-md-2  col-lg-1 pad-left pad-right pad-5 col-sm-4">
							<label>Carrier:</label>
							<select2 :options="carrier_options" v-model="carrier2">
								<option disabled value="0">All</option>
							</select2>
						</div>
						<div class="col-md-2 col-lg-2 col-sm-4">
							<label for="time1">From:</label>
							<el-date-picker style="width: 100%;" type="date" v-model="time12" :picker-options="{}" placeholder="Enter Date/Time"></el-date-picker>
						</div>
						<div class="col-md-2 col-lg-2 col-sm-4">
							<label for="time2">To:</label>
							<el-date-picker style="width: 100%;" type="date" v-model="time22" :picker-options="{}" placeholder="Enter Date/Time"></el-date-picker>
						</div>
						<div class="col-md-2  col-lg-2 col-sm-3">
							<label>GMT:</label>
							<select class="selectable no-min-width" v-model="gmt2">
								<option v-for="item in gmt_options" v-bind:value="item.id">
									{{ item.text }}
								</option>
							</select>
						</div>
 						<div class="col-md-2 col-lg-2 col-sm-3">
							<label for="amount">Amount:</label>
							<input type="text" name="amount" v-model="amount2" class="form-control" placeholder="Enter Amount">
						</div>
						<div class="col-md-2  col-lg-1 col-sm-3 pad-left pad-right pad-5">
							<label for="amount_to">To:</label>
							<input type="text" name="amount_to" v-model="amount_to2" class="form-control" placeholder="Enter Amount To">
						</div>
						<div class="col-md-2 col-lg-1 col-sm-3">
							<a class="btn btn-primary m-top-25" @click="searchSentPayment">
								Query
							</a>
						</div>
						<div class="clearfix"></div>
					</div>
					<div class="pull-right pagination top_pagination">
						<pagination :current-page="pageOneSent.currentPage"
									:total-pages="pageOneSent.totalPages"
									@page-changed="pageOneChangedSent">
						</pagination>
					</div>
					<div class="table_filters searcheable m-top-20">
						<div class="inline-block select_min_wrapper">
							<span class="inline-block">Page row:</span>
							<select2 :options="options1" v-model="selected1" class="inline-block" @pagecount="changePageRowSent">
							</select2>
						</div>
						<div class="inline-block">
							<el-select v-model="sent_table_columns" multiple placeholder="Show/Hide Columns" @change="handleChange2">
								<el-option v-for="item in sent_table_column_options" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</div>
					</div>
					<div class="clearfix"></div>
					<div class="table-responsive">
						<table class="table table-striped table-hover agents">
						  <thead>
							<tr>
							  <th></th>
							  <th v-if="showcolumns2[0]">Payment Id</th>
							  <th v-if="showcolumns2[1]">Entered Time</th>
							  <th v-if="showcolumns2[2]">Received On</th>
							  <th v-if="showcolumns2[3]">Carrier</th>
							  <th v-if="showcolumns2[4]">Amount</th>
							  <th v-if="showcolumns2[5]">Updated by</th>
							  <th v-if="showcolumns2[6]" class="width_138">Action</th>
							</tr>
						  </thead>
						  <tbody v-for="payment in sent_payments">
							<tr v-if="!sent_payments.length">
								<td style="text-align: center" colspan="8">No Data Found</td>
							</tr>
							<tr>
							  <td><a class="toogler" @click="toggleTable($event)">+</a></td>
							  <td v-if="showcolumns2[0]">{{payment.client_payment_id}}</td>
							  <td v-if="showcolumns2[1]">{{payment.payment_time}}</td>
							  <td v-if="showcolumns2[2]">{{payment.receiving_time}}</td>
							  <td v-if="showcolumns2[3]">{{payment.client_name}}</td>
							  <td v-if="showcolumns2[4]">{{payment.amount}}</td>
							  <td v-if="showcolumns2[5]">{{payment.update_by}}</td>
							  <td v-if="showcolumns2[6]">
								  <a class="action action_send" data-toggle="tooltip" data-placement="top" title="Send E-mail to Carrier" @click="sendEmailtoCarrier(payment)">
									  <span class="dnl_icon dnl_support"></span>
								  </a>
								  <a class="action action_read" data-toggle="tooltip" data-placement="top" title="Show Note" @click="showModal='show_note'">
									  <span class="dnl_icon dnl_eye"></span>
								  </a>
								  <a class="action action_delete" data-toggle="tooltip" data-placement="top" title="Delete" @click="askDeleteConfirm(payment.client_payment_id, 'sent')">
									  <span class="dnl_icon dnl_action_delete"></span>
								  </a>
							 </td>
							</tr>
							<tr class="accordian-body collapse no_padding">
								<td colspan="8">
									<div class="table-responsive">
										<table class="table table-striped table-hover agents">
											<thead>
												<tr>
													<th>Invoice Number</th>
													<th>Amount</th>
													<th>Invoice Period</th>
													<th>Due Date</th>
													<th>Total Paid Amount</th>
													<th>Due Amount</th>
													<th>Current Payment Paid Amount</th>
												</tr>
											</thead>
											<tbody>
												<tr v-for="detail in payment.details">
													<td>{{detail.invoice_number}}</td>
													<td>{{detail.amount}}</td>
													<td>{{detail.invoice_period}}</td>
													<td>{{detail.due_date}}</td>
													<td>{{detail.total_paid_amount}}</td>
													<td>{{detail.due_amount}}</td>
													<td>{{detail.current_payment_paid_amount}}</td>
												</tr>
											</tbody>
										</table>
									</div>
								</td>
							</tr>
						  </tbody>
						</table>
					</div>
					<div class="pull-right pagination">
						<pagination :current-page="pageOneSent.currentPage"
									:total-pages="pageOneSent.totalPages"
									@page-changed="pageOneChangedSent">
						</pagination>
					</div>
					<div class="clearfix"></div>
				</tab>
				<!-- <tab label="Upload" class="" icon="dnl_icon dnl_download">
                    <div class="col-md-3 col-sm-4">
                        <label>Import File:</label>
                        <dropzone id="myVueDropzone" url="https://httpbin.org/post" v-on:vdropzone-success="success"></dropzone>
                    </div>
                    <div class="col-md-3 col-sm-4">
                        <label>Records with duplicated ID:</label>
                        <div class="form-group">
                            <div class="radio radio-success">
                                <input id="radio-1" class="radio-custom" name="duplicates" type="radio" checked>
                                <label for="radio-1" class="radio-custom-label">Ignore</label>
                            </div>
                        </div>
                        <div class="form-group m-top-minus-25">
                            <div class="radio radio-success">
                                <input id="radio-2" class="radio-custom" name="duplicates" type="radio">
                                <label for="radio-2" class="radio-custom-label">Overwrite</label>
                            </div>
                        </div>
                        <div class="form-group full-width-select">
                            <label>Date Format:</label>
                            <br>
                            <select2 :options="options" v-model="date_format">
                                <option disabled value="0">Select one</option>
                            </select2>
                        </div>
                    </div>
                    <div class="col-md-3 col-sm-4">
                        <label>Data Type:</label>
                        <div class="form-group">
                            <div class="radio radio-success">
                                <input id="radio-3" class="radio-custom" name="payment" type="radio" checked>
                                <label for="radio-3" class="radio-custom-label">Payment Sent</label>
                            </div>
                        </div>
                        <div class="form-group m-top-minus-25">
                            <div class="radio radio-success">
                                <input id="radio-4" class="radio-custom" name="payment" type="radio">
                                <label for="radio-4" class="radio-custom-label">Payment Received</label>
                            </div>
                        </div>
                        <div class="form-group m-top-50">
                            <div class="checkbox checkbox-success"><input id="include_header" name="include_header" type="checkbox"> <label for="include_header">Include Header</label></div>
                        </div>
                    </div>
                    <div class="clearfix"></div>
                    <div class="col-md-12">
                        <div class="button_set little-space">
                            <a class="btn btn-primary mini">
                                Upload
                            </a>
                            <a class="btn btn-default mini">
                                Show Example
                            </a>
                        </div>
                    </div>
                    <div class="clearfix"></div>
				</tab> -->
				<tab label="Auto Payment Log" class="" icon="dnl_icon dnl_qos_report">
                     <div class="tab_wrapper">
                            <div class="chart_select_header grided rounded">
                                <div class="col-md-2  pad-left pad-right col-lg-1 col-sm-3">
                                    <label>Client:</label>
                                    <select2 :options="carrier_options" v-model="client">
                                        <option value="0">All</option>
                                    </select2>
                                </div>
                                <div class="col-md-2 col-lg-2 col-sm-4">
                                    <label>Status:</label>
                                    <select2 :options="status_options" v-model="status">
                                        <option value="0"></option>
                                    </select2>
                                </div>
                                <div class="col-md-2 col-lg-2 col-sm-4">
                                    <div class="form-group">
                                        <label for="submitted_date2">Submitted Time:</label>
                                        <!-- <input type="text" name="submitted_time1" v-model="submitted_time1" class="form-control" placeholder="Enter Time"> -->
										<el-date-picker style="width: 100%;" type="datetime" v-model="submitted_time1" :picker-options="{}" placeholder="Enter Date and TIme"></el-date-picker>
                                    </div>
                                </div>
                                <div class="col-md-2  col-lg-2 col-sm-4">
                                    <div class="form-group">
                                        <label for="submitted_time2" class="m-top-15"></label>
                                        <!-- <input type="text" name="submitted_time2" v-model="submitted_time2" class="form-control" placeholder="Enter Time"> -->
										<el-date-picker style="width: 100%;" type="datetime" v-model="submitted_time2" :picker-options="{}" placeholder="Enter Date and TIme"></el-date-picker>
                                    </div>
                                </div>
                                 <div class="col-md-2 col-lg-2 col-sm-4">
                                    <a class="btn btn-primary m-top-25" @click="searchLogPayment">
                                        Query
                                    </a>
                                </div>
                                <div class="clearfix"></div>
                            </div>
                            <div class="pull-right pagination top-pagination">
                                <pagination :current-page="pageOneLog.currentPage"
                                            :total-pages="pageOneLog.totalPages"
                                            @page-changed="pageOneChangedLog">
                                </pagination>
                            </div>
                            <div class="table_filters searcheable m-top-20">
                                <div class="inline-block select_min_wrapper">
                                    <span class="inline-block">Page row:</span>
                                    <select2 :options="options1" v-model="selected1" class="inline-block" @pagecount="changePageRowLog">
                                    </select2>
                                </div>
                                <div class="inline-block">
									<el-select v-model="log_table_columns" multiple placeholder="Show/Hide Columns" @change="handleChange3">
										<el-option v-for="item in log_table_column_options" :key="item.value" :label="item.label" :value="item.value">
										</el-option>
									</el-select>
                                </div>
                            </div>
                            <div class="clearfix"></div>
                            <div class="table-responsive">
                                <table class="table table-striped table-hover carrier_groups originators">
                                  <thead>
                                    <tr>
                                      <th v-if="showcolumns3[0]">Client <span class="dnl_icon dnl_sort pull-right"></span></th>
                                      <th v-if="showcolumns3[1]">Submitted Time</th>
                                      <th v-if="showcolumns3[2]">Response Time</th>
                                      <th v-if="showcolumns3[3]">Method</th>
                                      <th v-if="showcolumns3[4]">Charge Total</th>
                                      <th v-if="showcolumns3[5]">Fee</th>
                                      <th v-if="showcolumns3[6]">Status</th>
                                      <th v-if="showcolumns3[7]">Paypal ID</th>
                                      <th v-if="showcolumns3[8]">Transaction ID</th>
                                      <th v-if="showcolumns3[9]">Card Number</th>
                                      <th v-if="showcolumns3[10]">Card Expire Month</th>
                                      <th v-if="showcolumns3[11]">Card Expire Year</th>
                                      <th v-if="showcolumns3[12]">Return Code</th>
                                      <th v-if="showcolumns3[13]">Error Information</th>
                                    </tr>
                                  </thead>
                                  <tbody>
									<tr v-if="!logs.length">
										<td style="text-align: center" colspan="14">No Data Found</td>
									</tr>
                                    <tr v-for="client in logs">
                                      <td v-if="showcolumns3[0]">{{client.name}}</td>
                                      <td v-if="showcolumns3[1]">{{client.submitted_time}}</td>
                                      <td v-if="showcolumns3[2]">{{client.response_time}}</td>
                                      <td v-if="showcolumns3[3]">{{client.method}}</td>
                                      <td v-if="showcolumns3[4]">{{client.charge_total}}</td>
                                      <td v-if="showcolumns3[5]">{{client.fee}}</td>
                                      <td v-if="showcolumns3[6]">{{client.status}}</td>
                                      <td v-if="showcolumns3[7]">{{client.paypal_id}}</td>
                                      <td v-if="showcolumns3[8]">{{client.transaction_id}}</td>
                                      <td v-if="showcolumns3[9]">{{client.card_number}}</td>
                                      <td v-if="showcolumns3[10]">{{client.card_expire_month}}</td>
                                      <td v-if="showcolumns3[11]">{{client.card_expire_year}}</td>
                                      <td v-if="showcolumns3[12]">{{client.return_code}}</td>
                                      <td v-if="showcolumns3[13]">{{client.error_information}}</td>
                                    </tr>
                                  </tbody>
                                </table>
                            </div>
                            <div class="pull-right pagination">
                                <pagination :current-page="pageOneLog.currentPage"
                                            :total-pages="pageOneLog.totalPages"
                                            @page-changed="pageOneChangedLog">
                                </pagination>
                            </div>
                        <div class="clearfix"></div>
                  </div>
				</tab>
			</tabs>
		</div>
	  </div>
	  <modal v-if="showModal=='show_note'" @close="showModal = ''">
			<h3 slot="header">Details</h3>
			<div slot="body">
			  {{note}}
			</div>
			<div slot="footer">
				<button @click="closeModal" class="btn btn-default cancel centered">OK</button>
			</div>
		</modal>
	</div>
</template>

<script>   
	const vTabs = require('vue!../main_components/tabs.vue'),
		  vTab = require('vue!../main_components/tab.vue'),
		  vSelect = require('vue!../main_components/select.vue'),
		  Pagination = require('vue!../main_components/pagination.vue'),
		  modal = require('vue!../main_components/modal.vue'),
          Dropzone = require('vue!../main_components/dropzone.vue');
	const api = require("../../api");
	import { mapActions } from 'vuex'
	module.exports = {
		components: {
			'tabs': vTabs,
			'tab': vTab,
			'select2': vSelect,
			'pagination': Pagination,
			'modal': modal,
            Dropzone
		},
		created: function() {
			this.fetchCarriers();
			this.fetchSentPayments();
			this.fetchReceivedPayments();
			this.fetchLogPayments();
		},
		data: function(){
            return {
                order: '',
                sort: 'desc',
                name_sort: 'asc',
				note: '',
				showcolumns: [true, true, true, true, true, true, true, true],
				temp_payment_table_columns: ['Payment Id', 'Entered Time', 'Received On', 'Carrier', 'Amount', 'Type', 'Updated by', 'Actions'],
				payment_table_columns: ['Payment Id', 'Entered Time', 'Received On', 'Carrier', 'Amount', 'Type', 'Updated by', 'Actions'],
				payment_table_column_options: [{
					value: 'Payment Id',
					label: 'Payment Id'
				}, {
					value: 'Entered Time',
					label: 'Entered Time'
				}, {
					value: 'Received On',
					label: 'Received On'
				}, {
					value: 'Carrier',
					label: 'Carrier'
				}, {
					value: 'Amount',
					label: 'Amount'
				}, {
					value: 'Type',
					label: 'Type'
				}, {
					value: 'Updated by',
					label: 'Updated by'
				}, {
					value: 'Actions',
					label: 'Actions'
				}],
                 sortColumn(column) {
                    if(this.name_sort == 'asc') {
                        this.name_sort = 'desc'
                        this.sort = this.name_sort
                        this.order = column
                        this.fetchReceivedPayments();
                    }

                    else if(this.name_sort == 'desc') {
                        this.name_sort = 'asc'
                        this.sort = this.name_sort
                        this.order = column
                        this.fetchReceivedPayments()
                    }
                },
 				showcolumns2: [true, true, true, true, true, true, true],
				temp_sent_table_columns: ['Payment Id', 'Entered Time', 'Received On', 'Carrier', 'Amount', 'Updated by', 'Actions'],
				sent_table_columns: ['Payment Id', 'Entered Time', 'Received On', 'Carrier', 'Amount', 'Updated by', 'Actions'],
				sent_table_column_options: [{
					value: 'Payment Id',
					label: 'Payment Id'
				}, {
					value: 'Entered Time',
					label: 'Entered Time'
				}, {
					value: 'Received On',
					label: 'Received On'
				}, {
					value: 'Carrier',
					label: 'Carrier'
				}, {
					value: 'Amount',
					label: 'Amount'
				}, {
					value: 'Updated by',
					label: 'Updated by'
				}, {
					value: 'Actions',
					label: 'Actions'
				}],
				showcolumns3: [true, true, true, true, true, true, true, true, true, true, true, true, true, true],
				temp_log_table_columns: ['Client', 'Submitted Time', 'Response Time', 'Method', 'Charge Total', 'Fee', 'Status', 'Paypal ID', 'Transaction ID', 'Card Number', 'Card Expire Month', 'Card Expire Year', 'Return Code', 'Error Information'],
				log_table_columns: ['Client', 'Entered Time', 'Response Time', 'Method', 'Charge Total', 'Fee', 'Status', 'Paypal ID', 'Transaction ID', 'Card Number', 'Card Expire Month', 'Card Expire Year', 'Return Code', 'Error Information'],
				log_table_column_options: [{
					value: 'Client',
					label: 'Client'
				}, {
					value: 'Submitted Time',
					label: 'Submitted Time'
				}, {
					value: 'Response Time',
					label: 'Response Time'
				}, {
					value: 'Method',
					label: 'Method'
				}, {
					value: 'Charge Total',
					label: 'Charge Total'
				}, {
					value: 'Fee',
					label: 'Fee'
				}, {
					value: 'Status',
					label: 'Status'
				}, {
					value: 'Paypal ID',
					label: 'Paypal ID'					
				}, {
					value: 'Transaction ID',
					label: 'Transaction ID'
				}, {
					value: 'Card Number',
					label: 'Card Number'
				}, {
					value: 'Card Expire Month',
					label: 'Card Expire Month'
				}, {
					value: 'Card Expire Year',
					label: 'Card Expire Year'
				}, {
					value: 'Return Code',
					label: 'Return Code'
				}, {
					value: 'Error Information',
					label: 'Error Information'
				}],
 				status_options: [
					{ id: 'requested', text: 'Requested' },
					{ id: 'failed', text: 'Failed' },
					{ id: 'succeed', text: 'Succeed' },
				],
				gmt: '13',
                gmt_options: [
					{ id: 1, text: 'GMT -12:00' },
					{ id: 2, text: 'GMT -11:00' },
					{ id: 3, text: 'GMT -10:00' },
					{ id: 4, text: 'GMT -9:00' },
					{ id: 5, text: 'GMT -8:00' },
					{ id: 6, text: 'GMT -7:00' },
					{ id: 7, text: 'GMT -6:00' },
					{ id: 8, text: 'GMT -5:00' },
					{ id: 9, text: 'GMT -4:00' },
					{ id: 10, text: 'GMT -3:00' },
					{ id: 11, text: 'GMT -2:00' },
					{ id: 12, text: 'GMT -1:00' },
					{ id: 13, text: 'GMT +0:00' },
					{ id: 14, text: 'GMT +1:00' },
					{ id: 15, text: 'GMT +2:00' },
					{ id: 16, text: 'GMT +3:00' },
					{ id: 17, text: 'GMT +4:00' },
					{ id: 18, text: 'GMT +5:00' },
					{ id: 19, text: 'GMT +6:00' },
					{ id: 20, text: 'GMT +7:00' },
					{ id: 21, text: 'GMT +8:00' },
					{ id: 22, text: 'GMT +9:00' },
					{ id: 23, text: 'GMT +10:00' },
					{ id: 24, text: 'GMT +11:00' },
					{ id: 25, text: 'GMT +12:00' },
                ],
				carrier_options: [],
				received_payments: [],
				sent_payments: [],
				log_payments: [],
				payment_type: 'received',
				carrier: '0',
				carrier2: '0',
				time1: '',
				time2: '',
				time12: '',
				time22: '',
				amount: '',
				amount2: '',
				amount_to: '',
				amount_to2: '',
                client: '',
			    status: '',
			    submitted_time1: '',
			    submitted_time2: '',
                date_format: '',
				route_types: [
				  { id: 1, text: 'Fail to Next Host' },
				  { id: 2, text: 'Fail to Next Trunk' },
				  { id: 3, text: 'Stop' },
			  	],
				pageOneReceived: {
					currentPage: 1,
					totalPages: 10,
					per_page: 10
				},
				pageOneSent: {
					currentPage: 1,
					totalPages: 10,
					per_page: 10
				},
				pageOneLog: {
					currentPage: 1,
					totalPages: 10,
					per_page: 10
				},
				showModal: '',
				client_search: '',
				select: [],
				options: [
					{ id: 1, text: 'Success' },
					{ id: 2, text: 'Multiple' },
					{ id: 3, text: 'Moved Permanently' },
					{ id: 4, text: 'Moved Temporarily' },
					{ id: 5, text: 'Use Proxy' },
					{ id: 6, text: 'Alternative Service' },
					{ id: 7, text: 'Bad Request' },
					{ id: 8, text: 'Unauthorized' },
					{ id: 9, text: 'Payment Required' },
				],
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
				payments: [],
                logs: [
				  {
					name: 'Client Name',
					submitted_time: '2016-08-21 00:00:00+00',
					response_time: '2016-08-21 23:59:59+00',
					method: 'Paypal',
					charge_total: '0.92',
					fee: '0',
					status: 'Initial',
					paypal_id: '',
					transaction_id: '',
					card_number: '3245 7422 8927 0091',
					card_expire_month: 'Secember',
					card_expire_year: '2017',
					return_code: '2354',
					error_information: '-'
				  },
				  {
					name: 'Client Name',
					submitted_time: '2016-08-21 00:00:00+00',
					response_time: '2016-08-21 23:59:59+00',
					method: 'Paypal',
					charge_total: '0.92',
					fee: '0',
					status: 'Initial',
					paypal_id: '',
					transaction_id: '',
					card_number: '3245 7422 8927 0091',
					card_expire_month: 'Secember',
					card_expire_year: '2017',
					return_code: '2354',
					error_information: '-'
				  },
				  {
					name: 'Client Name',
					submitted_time: '2016-08-21 00:00:00+00',
					response_time: '2016-08-21 23:59:59+00',
					method: 'Paypal',
					charge_total: '0.92',
					fee: '0',
					status: 'Initial',
					paypal_id: '',
					transaction_id: '',
					card_number: '3245 7422 8927 0091',
					card_expire_month: 'Secember',
					card_expire_year: '2017',
					return_code: '2354',
					error_information: '-'
				  },
				  {
					name: 'Client Name',
					submitted_time: '2016-08-21 00:00:00+00',
					response_time: '2016-08-21 23:59:59+00',
					method: 'Paypal',
					charge_total: '0.92',
					fee: '0',
					status: 'Initial',
					paypal_id: '',
					transaction_id: '',
					card_number: '3245 7422 8927 0091',
					card_expire_month: 'Secember',
					card_expire_year: '2017',
					return_code: '2354',
					error_information: '-'
				  },
				  {
					name: 'Client Name',
					submitted_time: '2016-08-21 00:00:00+00',
					response_time: '2016-08-21 23:59:59+00',
					method: 'Paypal',
					charge_total: '0.92',
					fee: '0',
					status: 'Initial',
					paypal_id: '',
					transaction_id: '',
					card_number: '3245 7422 8927 0091',
					card_expire_month: 'Secember',
					card_expire_year: '2017',
					return_code: '2354',
					error_information: '-'
				  }
			  ]
			}
        },
		methods: {
			...mapActions({
				setAsyncConfirm: 'async_confirm/setAsyncConfirm',
				setMessage: 'app_message/setAppMessage'
			}),
			sendEmailtoCarrier(payment) {
				this.loading = true;
				const reqBody = {
					note: payment.note
				};
				const url = api.getEndpointUrl() + '/v1/finance/payment/' + payment.client_payment_id + '/edit_and_send_note'
				this.$http.post(url, reqBody)
				.then(response => {
					const body = response.body
					if (body.success) {
						this.setMessage('Email was sended to carrier successfully')
					}
					this.loading = false;
				})
				.catch(error => {
					console.log(error)
					this.loading = false;
                    var msg = '';
                    if (error.data.errors !== undefined)
                        msg = error.data.errors;
                    else if (error.data.error !== undefined)
                        msg = error.data.error.message;
                    this.setMessage({
                        message: msg,
                        type: 'error'
                    })
				})
			},
			showDetailNote(payment) {
				this.note = payment.note;
				this.showModal = 'show_note'
				// console.log(payment.note);
				// this.showModal = 'show_note';
				// this.note = '';
				// // if(payment.note != '')
				// // 	this.note = payment.note;
				
				// const url = api.getEndpointUrl() + '/v1/finance/payment/' + payment.client_payment_id + '/note'
				// this.$http.get(url)
				// .then(response => {
				// 	const body = response.body
				// 	if (body.success) {
				// 		this.note = body.payload
				// 		console.log(this.note);
				// 	}
				// })
				// .catch(error => {
				// 	console.log(error)
				// })
			},
			handleChange() {
				for(let i = 0; i < this.temp_payment_table_columns.length; i++) {
					if (_.indexOf(this.payment_table_columns, this.temp_payment_table_columns[i]) != -1) {
						Vue.set(this.showcolumns, i, true);
					}
					else {
						Vue.set(this.showcolumns, i, false);
					}
				}
			},
			handleChange2() {
				for(let i = 0; i < this.temp_sent_table_columns.length; i++) {
					if (_.indexOf(this.sent_table_columns, this.temp_sent_table_columns[i]) != -1) {
						Vue.set(this.showcolumns2, i, true);
					}
					else {
						Vue.set(this.showcolumns2, i, false);
					}
				}
			},
			handleChange3() {
				for(let i = 0; i < this.temp_log_table_columns.length; i++) {
					if (_.indexOf(this.log_table_columns, this.temp_log_table_columns[i]) != -1) {
						Vue.set(this.showcolumns3, i, true);
					}
					else {
						Vue.set(this.showcolumns3, i, false);
					}
				}
			},
			searchReceivedPayment() {
				this.loading = true
				this.pageOneReceived.currentPage = 1;
				const page = this.pageOneReceived.currentPage - 1
				const per_page = this.pageOneReceived.per_page;
				const orderby = 'client_payment_id&order_dir=desc'
				let search;
				if(this.carrier != '0')
					search = 'client_id=' + this.carrier;
				if(this.time1 != '')
					search += '&payment_time_lt=' + this.time1.toISOString();
				if(this.time2 != '')
					search += '&payment_time_gt=' + this.time2.toISOString();
				if(this.amount != '')
					search += '&amount=' + this.amount;
 				console.log('searchreceived payemnts');
				let url = api.getEndpointUrl() + '/v1/finance/received_payment/list?' + search + this.order + "&order_dir=" + this.sort
				url += '&page=' + page
				url += '&per_page=' + per_page
 				this.$http.get(url)
					.then(response => {
						this.loading = false
						const body = response.body
						if (body.success) {
							const payload = body.payload
							this.received_payments = payload.items;
							this.loading = false;
							console.log(this.received_payments);
							this.pageOneReceived.currentPage = payload.page + 1
							this.pageOneReceived.totalPages = Math.ceil(payload.total / payload.per_page)
						}
					})
					.catch(error => {
						this.loading = false
						console.log(error)
					})
			},
			searchSentPayment() {
				this.loading = true
				this.pageOneSent.currentPage = 1;
				const page = this.pageOneSent.currentPage - 1;
				const per_page = this.pageOneSent.per_page;
				const orderby = 'client_payment_id&order_dir=desc'
				let search;
				if(this.carrier != '0')
					search = 'client_id=' + this.carrier2;
				if(this.time1 != '')
					search += '&payment_time_lt=' + this.time12.toISOString();
				if(this.time2 != '')
					search += '&payment_time_gt=' + this.time22.toISOString();
				if(this.amount != '')
					search += '&amount=' + this.amount2;
				if(this.amount_to != '')
					search += '&amount_to=' + this.amount_to2;
				
				let url = api.getEndpointUrl() + '/v1/finance/sent_payment/list?' + search
				url += '&page=' + page
				url += '&per_page=' + per_page
				url += '&order_by=' + orderby
				this.$http.get(url)
					.then(response => {
						this.loading = false
						const body = response.body
						if (body.success) {
							const payload = body.payload
							this.sent_payments = payload.items;
							this.loading = false;
							console.log(this.sent_payments);
							this.pageOneSent.currentPage = payload.page + 1
							this.pageOneSent.totalPages = Math.ceil(payload.total / payload.per_page)
						}
					})
					.catch(error => {
						this.loading = false
						console.log(error)
					})
			},
			searchLogPayment() {
				// to do
			},
			fetchCarriers() {
				var per_page = 1;
				var url = api.getEndpointUrl() + "/v1/carrier/list?per_page=" + per_page + "&order_by=" + this.order + "&order_dir=" + this.sort
				this.loading = true;
				this.$http.get(url)
				.then(response => {
					const body = response.body
					if (body.success) {
						this.loading = false;
						per_page = body.payload.total;

						url = api.getEndpointUrl() + "/v1/carrier/list?per_page=" + per_page + "&order_by=" + this.order + "&order_dir=" + this.sort
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
			activateTab(tab) {
				if (tab.name == "Received") {
					this.payment_type = "received";
				}
				else if (tab.name == "Sent") {
					this.payment_type = "sent";
				}
				else if (tab.name == "Auto Payment Log") {
					this.payment_type = "auto payment log";
				}
			},
			changePageRowReceived (value) {
				console.log(value);
				if (value !== this.pageOneReceived.per_page) {
					this.pageOneReceived.per_page = value
					this.$nextTick(this.searchReceivedPayment)
				}
			},
			changePageRowSent (value) {
				if (value !== this.pageOneSent.per_page) {
					this.pageOneSent.per_page = value
					this.$nextTick(this.searchSentPayment)
				}
			},
			changePageRowLog (value) {
				if (value !== this.pageOneLog.per_page) {
					this.pageOneLog.per_page = value
					this.$nextTick(this.fetchLogPayments)
				}
			},
			getPaymentIndex (id, type) {
				if(type == 'received')
					return _.findIndex(this.received_payments, elem => elem.client_payment_id === id)
				else if(type == 'sent')
					return _.findIndex(this.sent_payments, elem => elem.client_payment_id === id)
			},
			deletePayment(id, type) {
				const url = api.getEndpointUrl() + '/v1/finance/payment/' + id
				this.$http.delete(url)
				.then(response => {
					if (response.body.success) {
						let index = this.getPaymentIndex(id, type)
						if (~index) {
							if(type == 'received')
								this.received_payments.splice(index, 1)
							else if(type == 'sent')
								this.sent_payments.splice(index, 1)
						}
						this.setMessage('Payment was removed successfully')
					}
				})
			},
			askDeleteConfirm (id, type) {
				this.setAsyncConfirm('Are you sure you want to delete this payment')
				.then(result => {
					if (result.accepted) {
						this.deletePayment(id, type)
					}
				})
				.catch(error => {
					console.log(error)
				})
			},
			getQueries() {
				const page = '?page=' + (this.pageOneReceived.currentPage - 1)
				const per_page = '&per_page=' + this.pageOneReceived.per_page
                return page + per_page + "&order_by=" + this.order + "&order_dir=" + this.sort
			},
			getOrderPayment() {
				return '&order_by=client_payment_id&order_dir=desc';
			},
			fetchReceivedPayments () {
				const url = api.getEndpointUrl() + '/v1/finance/received_payment/list' + this.getQueries();
				this.$http.get(url)
				.then(response => {
					const body = response.body
					if (body.success) {
						this.received_payments = body.payload.items
						this.pageOneReceived.currentPage = body.payload.page + 1
						this.pageOneReceived.totalPages = Math.ceil(body.payload.total / body.payload.per_page)
					}
				})
				.catch(error => {
					console.log(error)
				})
			},
			fetchSentPayments () {
				const url = api.getEndpointUrl() + '/v1/finance/sent_payment/list' + this.getQueries() + this.getOrderPayment()
				this.$http.get(url)
				.then(response => {
					const body = response.body
					if (body.success) {
						this.sent_payments = body.payload.items
						this.pageOneSent.currentPage = body.payload.page + 1
						this.pageOneSent.totalPages = Math.ceil(body.payload.total / body.payload.per_page)
					}
				})
				.catch(error => {
					console.log(error)
				})
			},
			fetchLogPayments () {
				// To Do
			},
			pageOneChangedReceived (pageNum) {
				if (pageNum !== this.pageOneReceived.currentPage) {
					this.pageOneReceived.currentPage = pageNum
					this.$nextTick(this.fetchReceivedPayments)
				}
			},
			pageOneChangedSent (pageNum) {
				if (pageNum !== this.pageOneSent.currentPage) {
					this.pageOneSent.currentPage = pageNum
					this.$nextTick(this.fetchSentPayments)
				}
			},
			pageOneChangedLog (pageNum) {
				if (pageNum !== this.pageOneLog.currentPage) {
					this.pageOneLog.currentPage = pageNum
					this.$nextTick(this.fetchLogPayments)
				}
			},
			closeModal: function() {
				this.showModal = '';
			},
			toggleTable(event) {
				var element = event.currentTarget;
				$(element).parents('tr').siblings('.collapse').toggleClass('in');
				$(element).html( $(element).html() == "-" ? "+" : "-");
			},
            'success': function (file) {
                console.log('A file was successfully uploaded')
            },
            'process': function () {
                var newArr = this.$children.filter(function(item){
                  return item.id === "myVueDropzone";
                });
                var component = newArr[0];
                component.processQueue()
            },
			exportCSV: function()
			{
				var vm = this;		
            	var csvArray = new Array();
            	
				if(this.payment_type == "received")
				{
					var fields = ["id", "payment_time", "receiving_time", "client_name", "amount", "type", "updated_by"];
					csvArray.push(fields); 
					this.payments.forEach(function (payment, i) {
						var values = new Array();
						if(payment.id == undefined)
							values.push(payment.id);
						else
							values.push(payment.id + "");
						values.push(payment.payment_time);
						values.push(payment.receiving_time);
						values.push(payment.client_name);
						values.push(payment.amount);
						values.push(payment.type);
						values.push(payment.updated_by);
						csvArray.push(values);                
					});	 
				}
				else if(this.payment_type == "sent")
				{
					var fields = ["id", "payment_time", "receiving_time", "client_name", "amount", "type", "updated_by"];
					csvArray.push(fields); 
					this.payments.forEach(function (payment, i) {
						var values = new Array();
						if(payment.id == undefined)
							values.push(payment.id);
						else
							values.push(payment.id + "");
						values.push(payment.payment_time);
						values.push(payment.receiving_time);
						values.push(payment.client_name);
						values.push(payment.amount);
						values.push(payment.type);
						values.push(payment.updated_by);
						csvArray.push(values);                
					});
				}
				else if(this.payment_type == "auto payment log")
				{					  
					var fields = ["name", "submitted_time", "response_time", "method", "charge_total", "fee", "status", "paypal_id", "transaction_id", "card_number", "card_expire_month", "card_expire_year", "return_code", "error_information"];
					csvArray.push(fields); 
					this.logs.forEach(function (client, i) {
						var values = new Array();
						values.push(client.name);
						values.push(client.submitted_time);
						values.push(client.response_time);
						values.push(client.method);
						values.push(client.charge_total);
						values.push(client.fee);
						values.push(client.status);
						values.push(client.paypal_id);
						values.push(client.transaction_id);
						values.push(client.card_number);
						values.push(client.card_expire_month);
						values.push(client.card_expire_year);
						values.push(client.return_code);
						values.push(client.error_information);						
						csvArray.push(values);                
					});
				}
				exportToCsv('finance_payment_' + this.payment_type +'_export.csv', csvArray);				
			}
		},
		mounted: function () {
			$('[data-toggle="tooltip"]').tooltip();
		},
		updated: function () {
			var elementList = document.querySelectorAll('.el-select > .el-input > input');
			for( var index=0; index < elementList.length; index++ ) {
				elementList[index].placeholder = 'Show/Hide Columns';
			}
			
		},
	}
</script>

<style>
.select2-container--default .select2-selection--multiple, .select2-container--default .select2-selection--single{
	height: 36px!important;
}
	.tab span.dnl_icon.dnl_download {
		font-size: 20px;
		float: left;
		margin: 3px 6px 0 0;
	}
    
	tr.accordian-body.collapse.no_padding.in td {
		padding: 10px;
	}
    
    .chart_select_header.grided.rounded {
        border-radius: 5px;
    }
    
    .form-group.m-top-minus-25 {
        margin-top: -25px;
    }
    
    .m-top-50 {
        margin-top: 50px;
    }
    
    .form-group.full-width-select .select2 {
        width: 100% !important;
    }
    
    .checkbox-success input[type="checkbox"]:checked + label::before {
		background-color: #03c0fc;
		border-color: #03c0fc;
	}

	.el-select__tags {
		display: none;
	}
	
</style>
