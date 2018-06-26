<template>
	<div class="container-fluid">
      <div class="row">
		<div class="wrapper single">
			<time-display></time-display>
			<ol class="breadcrumb">
				  <li class="breadcrumb-item"><a href="#">Management</a></li>
				  <li class="breadcrumb-item">
					  <router-link to="/management/products">Products</router-link>
				  </li>
				  <li class="breadcrumb-item active">Product Send Rate</li>
			</ol>
			<h1 class="page-header">Product Send Rate</h1>
			<router-link to="/management/products" class="btn btn_white back"><span class="dnl_icon dnl_import"></span> Back </router-link>
			<div class="white_pad product_add">
			<div class="row">
					<div class="col-md-3 col-sm-4">
						<div class="form-group">
							<label>Rate deck format:</label>
							<select2 :options="rate_format_options" v-model="product"></select2>
						</div>
				  </div>
					<div class="col-md-1 col-sm-2">
						<div class="form-group">
							<div class="checkbox checkbox-success m-top-30">
								<input id="is_zipped" name="is_zipped" v-model="is_zipped" type="checkbox">
								<label for="is_zipped">Zipped</label>
							</div>
						</div>
				  </div>
					<div class="col-md-3 col-sm-4">
						<div class="form-group">
							<label>Effective Date:</label>
							<el-date-picker v-model="effective_date" type="date" placeholder="Effective Date"></el-date-picker>
						</div>
				  </div>
					<div class="clearfix little-space"></div>
				  <div class="col-md-3 col-sm-4">
						<div class="form-group">
							<div class="form-group">
								<label>E-mail Template:</label>
								<select2 :options="template_options" v-model="email_template">
								</select2>
							</div>
						</div>
				  </div>
				  <div class="col-md-1 col-sm-2">
					  <div class="inline_actions">
						  <a><span class="dnl_icon dnl_action_edit"></span></a>
						  <a><span class="dnl_icon dnl_add"></span></a>
						  <a @click="refreshEmailTemplate"><span class="dnl_icon dnl_reload"></span></a>
					  </div>
				  </div>
				  <div class="col-md-3 col-sm-3">
						<div class="form-group">
							<div class="form-group">
								<label>Get Type:</label>
								<select2 :options="type_options" v-model="get_type">
								</select2>
							</div>
						</div>
				  </div>
				  <div class="col-md-3 col-sm-3">
						<div class="form-group">
							<div class="form-group">
								<label class="empty_label"></label>
								<select2 :options="type2_options" v-model="get_type2">
								</select2>
							</div>
						</div>
				  </div>
					<div class="clearfix little-space"></div>
					<div class="col-md-3 col-sm-4">
						<div class="form-group">
							<label>Download method:</label>
							<select2 :options="download_options" v-model="download_method"></select2>
						</div>
				  </div>
					<div class="clearfix little-space"></div>
					<div class="col-md-6 col-sm-8">
						<div class="form-group">
							<el-transfer v-model="headers" :titles="['Selectable items', 'Selected items']" :data="headers_options">
							</el-transfer>
						</div>
					</div>
					<div class="col-md-1 col-sm-2 btn-group-vertical" role="group">
						  <button type="button" class="btn btn-default">
							  Sort
						  </button>
						  <button type="button" class="btn btn-default">
							  Top
						  </button>
						  <button type="button" class="btn btn-default">
							 Up
						  </button>
						  <button type="button" class="btn btn-default">
							  Down
						  </button>
							<button type="button" class="btn btn-default">
							  Bottom
						  </button>
						</div>
					<div class="clearfix little-space"></div>
					<div class="col-md-3 col-sm-4">
						<div class="form-group">
							<label>From email:</label>
							<select2 :options="email_options" v-model="email"></select2>
						</div>
					</div>
					<div class="col-md-3 col-sm-4">
						<div class="form-group">
							<label for="email_cc">Email CC:</label>
							<input type="text" name="email_cc" v-model="email_cc" class="form-control" placeholder="Enter Email CC">
						</div>
					</div>
					<div class="col-md-3 col-sm-4">
						<div class="form-group">
							<label for="subject">Subject:</label>
							<input type="text" name="subject" v-model="subject" class="form-control" placeholder="Enter Subject">
						</div>
					</div>
			  </div>
			  <!-- <div class="table-responsive">
					<table class="table table-striped table-hover carrier_fields product_send_rate">
					  <thead>
						<tr>
						  <th class="width-65">
							  <div class="checkbox checkbox-success">
							  	<input id="checker" name="checker" type="checkbox" v-model="checker">
							  	<label for="checker"></label>
							  </div>
						  </th>
						  <th>Client ID</th>
						  <th>Client Name <span class="dnl_icon dnl_sort pull-right"></span></th>
						  <th>Trunk Name</th>
						  <th>E-mail</th>
						</tr>
					  </thead>
					  <tbody>
						<tr v-for="client in orderBy(clients, 'client_name')">
						  <td class="centred_checkbox">
							  <div class="checkbox checkbox-success">
									<input :id="client.status_id" :name="client.status_id" type="checkbox" v-model="client.status">
									<label :for="client.status_id"></label>
							  </div>
						  </td>
						  <td>{{client.id}}</td>
						  <td>{{client.name}}</td>
						  <td>{{client.trunk_name}}</td>
						  <td>{{client.email}}</td>
						</tr>
					  </tbody>
					</table>
				</div> -->
				<div class="clearfix little-space"></div>
				<div class="col-md-8 col-sm-8">
					<label>Content:</label>
					<ckeditor v-model="contentA" id="'editor'" :height="'280px'"></ckeditor>
				</div>
				<!-- <div class="row">
					<div class="col-md-12 m-top-20">
						<div class="form-group tags">
							<label for="groupname">Tags:</label>
							<span class="label label-default">#Username</span>
							<span class="label label-default">#Url</span>
							<span class="label label-default">#Welcoms</span>
						</div>
					</div>
				</div> -->
				<div class="clearfix little-space"></div>
			    <div class="button_set text-center">
					<a class="btn btn-primary mini" @click="validateForSubmit">
						Submit
					</a> 
					<a class="btn btn-default mini">
						Reset
					</a>
				</div>
			</div>
		</div>
	  </div>
	</div>
</template>

<script>   
	const multiselect = require('multiselect'),
		Ckeditor = require('vue!../main_components/ckeditor.vue'),
		vSelect = require('vue!../main_components/select.vue');
	import api from '../../api'
	module.exports = {
		components: {
			'multiselect': multiselect,
			'select2': vSelect,
			Ckeditor
		},
		data: function(){
			return {
				contentA: '',
				content: [],
				email: '',
				subject: 'TEST for trunk {trunk_name}, {effective_date}',
				email_cc: '',
				headers: [
					'code','code_name','country','rate','effective_date'
				],
				headers_options: [
						{key: 'new_rate', label: 'New Rate'},
						{key: 'end_date', label: 'End Date'},
						{key: 'min_time', label: 'Min Time'},
						{key: 'interval', label: 'Interval'},
						{key: 'change_status', label: 'Change Status'},
						{key: 'code', label: 'Code'},
						{key: 'code_name', label: 'Code Name'},
						{key: 'country', label: 'Country'},
						{key: 'rate', label: 'Rate'},
						{key: 'effective_date', label: 'Effective Date'},
				],
				download_method: '',
				download_options: [
					{id: '1', text: 'Send as attachment'},
					{id: '2', text: 'Send as link'},
				],	
				template_options: [
				{
				  template_name: 'Testing',
				  from_email: 'Default',
				  email_cc: 'yaskevichyaroslav@gmail.com'
				},
                {
				  template_name: 'Testing',
				  from_email: 'Default',
				  email_cc: 'yaskevichyaroslav@gmail.com'
				},
                {
				  template_name: 'Testing',
				  from_email: 'Default',
				  email_cc: 'yaskevichyaroslav@gmail.com'
				},
                {
				  template_name: 'Testing',
				  from_email: 'Default',
				  email_cc: 'yaskevichyaroslav@gmail.com'
				},
                {
				  template_name: 'Testing',
				  from_email: 'Default',
				  email_cc: 'yaskevichyaroslav@gmail.com'
				}
			  ],
				is_zipped: false,
				effective_date: '',
				rate_format_options: [
					{id: '1', text: 'CSV'},
					{id: '2', text: 'XLS'},
				],
				type2_options: [
					{id: '0', text: 'Active Trunk Only'},
					{id: '1', text: 'All'},
					{id: '2', text: 'Inactive Trunk Only'},
				],
				type_options: [
					{id: '0', text: 'Send to carriers using this rate table'},
					{id: '1', text: 'Specify my own recipients'},
				],
			  product: '',
			  get_type: '',
			  email_template: '',
			  get_type2: '',
			  checker: false,
			  options: [
				  { id: 1, value: 'carrier1', text: 'Carrier 1' },
				  { id: 2, value: 'carrier2', text: 'Carrier 2' },
				  { id: 3, value: 'carrier3', text: 'Carrier 3' },
				  { id: 4, value: 'carrier4', text: 'Carrier 4' },
				  { id: 5, value: 'carrier5', text: 'Carrier 5' }
			  ],
			  clients: [
				{
				  status_id: "check_1",
				  status: true,
				  id: "i1",
				  name: "Name1",
				  trunk_name: "Trunk Name1",
				  email: "client1@gmail.com"
				},
				{
				  status_id: "check_2",
				  status: true,
				  id: "i2",
				  name: "Name2",
				  trunk_name: "Trunk Name2",
				  email: "client2@gmail.com"
				},
				{
				  status_id: "check_3",
				  status: true,
				  id: "i3",
				  name: "Name3",
				  trunk_name: "Trunk Name3",
				  email: "client3@gmail.com"
				},
				{
				  status_id: "check_4",
				  status: true,
				  id: "i4",
				  name: "Name4",
				  trunk_name: "Trunk Name4",
				  email: "client4@gmail.com"
				},
				{
				  status_id: "check_5",
				  status: true,
				  id: "i5",
				  name: "Name5",
				  trunk_name: "Trunk Name5",
				  email: "client5@gmail.com"
				},
			 ]
            }
        },
		mounted: function() {
			$('#carrier').multiSelect({
				 selectableHeader: "<div class='custom-header'>Optional Selection</div>",
  				 selectionHeader: "<div class='custom-header'>Selected Selection</div>"
			});
		},
		methods: {
			refreshEmailTemplate() {
				
			},
			saveProductSendRate() {
				console.log(this.headers_options);
				console.log(this.headers);
			},
			validateForSubmit() {
				var vm = this;
				this.$validator.validateAll().then(() => {
					const err = vm.$validator.getErrors();
					if (err.errors.length > 0) {
						const msg = err.errors[0].field + ' field can not leave as null';
						vm.setMessage({
							message: msg,
							type: 'error'
						})
					}
					else {
						vm.saveProductSendRate();
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
			getEmails () {
				const url = api.getEndpointUrl() + '/v1/config/mail_sender/list'
				this.$http.get(url)
				.then(response => {
					const body = response.body
					if (body.success) {
						this.email_options = body.payload.items.map((elem, index) => {
							return { id: index + 1, text: elem.email }
						})
						if(this.email_options.length > 0)
							this.email = this.email_options[0].id;
					}
				})
				.catch(error => {
					console.log(error)
				})
			},
		},
		created() {
			this.getEmails()
		}
	}
</script>

<style>
	.m-top-30 {
		margin-top: 30px;
	}
	.inline_actions span.dnl_icon.dnl_action_edit {
		font-size: 21px;
		padding-left: 0;
		vertical-align: sub;
	}
	
	.product_send_rate th.width-65 .checkbox-success {
		margin: 5px 0 -2px 17px;
	}
</style>
