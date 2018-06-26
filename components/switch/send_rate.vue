<template>
	<div class="container-fluid">
      <div class="row">
		<div class="wrapper single">
			<time-display></time-display>
			<ol class="breadcrumb">
				  <li class="breadcrumb-item"><a href="#">Switch</a></li>
				  <li class="breadcrumb-item">
					  <router-link to="/switch/rate_table">Rate Table</router-link>
				  </li>
				  <li class="breadcrumb-item active">Send Rate</li>
			</ol>
			<h1 class="page-header">Send Rate</h1>
			<router-link to="/switch/rate_table" class="btn btn_white back"><span class="dnl_icon dnl_import"></span> Back </router-link>
			<div class="white_pad send_rate">
			<div class="row">
				  <div class="col-md-3 col-sm-4">
					<div class="form-group">
						<label>Rate Deck Format:</label>
						<select class="selectable" v-model="rate_deck_format">
							<option v-for="item in format_options" v-bind:value="item.id">
								{{ item.text }}
							</option>
						</select>
					</div>
				  </div>
				  <div class="col-md-3 col-sm-4">
					<div class="form-group">
						<label for="effective_date">Effective Date:</label>
						<el-date-picker style="width: 100%;" type="date" v-model="effective_date" :picker-options="{}" placeholder="Enter Effective Date"></el-date-picker>
					</div>
				  </div>
				  <div class="col-md-3 col-sm-4">
					<div class="form-group">
						<label>Rate E-mail Template:</label>
						<select class="selectable" v-model="rate_email_template">
							<option v-for="item in rate_email_template_options" v-bind:value="item.id">
								{{ item.text }}
							</option>
						</select>
					</div>
				  </div>
				  <div class="col-md-3 col-sm-4">
					<div class="form-group">
						<label>Download Method:</label>
						<select class="selectable" v-model="download_method">
							<option v-for="item in download_method_options" v-bind:value="item.id">
								{{ item.text }}
							</option>
						</select>
					</div>
				  </div>
				  <div class="col-md-3 col-sm-4">
					<div class="form-group">
						<label>Send Type:</label>
						<select class="selectable" v-model="send_type">
							<option v-for="item in send_type_options" v-bind:value="item.id">
								{{ item.text }}
							</option>
						</select>
					</div>
				  </div>
				  <div class="col-md-3 col-sm-4">
					<div class="form-group m-top-33">
						<div class="checkbox checkbox-success">
							<input id="zipped" name="zipped" type="checkbox" v-model="zip"> 
							<label for="zipped">Zipped</label>
						</div>
					</div>
				  </div>
				  <div class="clearfix"></div>
				  <div class="col-md-6 col-sm-8">
					  <div class="form-group">
						  <label for="groupname">Headers:</label>
						  <!-- <select multiple="multiple" id="headers" name="headers">
							<option v-for="option in options" :value='option.value'>{{option.text}}</option>
						  </select> -->
							<el-transfer v-model="headers" :titles="['Selectable items', 'Selection items']" :data="headers_options">
							</el-transfer>
					  </div>
				  </div>
					<div class="col-md-1 col-sm-2 btn-group-vertical tool-btn" role="group">
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
				  <div class="clearfix"></div>
				  <div class="col-md-3 col-sm-4">
						<div class="form-group">
							<label for="groupname">From E-mail:</label>
							<select class="selectable" v-model="email">
								<option v-for="item in email_options" v-bind:value="item.id">
									{{ item.text }}
								</option>
							</select>
						</div>
				   </div>
				   <div class="col-md-3 col-sm-4">
						<div class="form-group">
							<label for="groupname">Subject:</label> 
							<input type="text" name="groupname" v-model="subject" placeholder="Enter Subject" class="form-control">
						</div>
				   </div>
				   <div class="col-md-3 col-sm-4">
						<div class="form-group">
							<div class="form-group">
							<label for="groupname">Copy:</label> <input type="text" name="groupname" placeholder="Enter Copy" v-model="copy" class="form-control">
						</div>
						</div>
				   </div>
				   <div class="clearfix little-space"></div>
				   <div class="col-md-12 ">
				   	  <label>Content:</label>
				  	  <ckeditor v-model="contentA" :id="editorA" :height="'280px'"></ckeditor>
				   </div>
				   <div class="col-md-12 m-top-20">
						<div class="form-group tags">
							<label for="groupname">Tags:</label> 
							<span class="label label-default">#Username</span>
							<span class="label label-default">#Url</span>
							<span class="label label-default">#Welcoms</span>
						</div>
					</div>
			  </div>
			  <div class="button_set little-space">
				<a class="btn btn-primary mini" @click="validateSendRate">
					Submit
				</a>
				<a class="btn btn-default mini" @click="reset">
					Reset
				</a>
				<a class="btn btn-default mini">
					Save as New Template
				</a>
			  </div>
			</div>
		</div>
	  </div>
	</div>
</template>

<script>   
	const multiselect = require('multiselect'),
		  vSelect = require('vue!../main_components/select.vue'),
		  Ckeditor = require('vue!../main_components/ckeditor.vue');
	import api from '../../api'
	import { mapActions } from 'vuex';
	module.exports = {
		components: {
			'multiselect': multiselect,
			'select2': vSelect,
			Ckeditor
		},
		data: function(){
			return {
				email_options: [],
				zip: false,
				headers: [
					'code','effective_date'
				],
				headers_options: [
					{key: 'min_time', label: 'Min Time'},
					{key: 'interval', label: 'Interval'},
					{key: 'inter_rate', label: 'Inter Rate'},
					{key: 'intra_rate', label: 'Intra Rate'},
					{key: 'local_rate', label: 'Local Rate'},
					{key: 'code', label: 'Code'},
					{key: 'effective_date', label: 'Effective Date'},
				],
				rate_email_template_options: [
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
				send_type_options: [
					{id: '0', text: 'Send to carriers using this rate table'},
					{id: '1', text: 'Specify my own recipients'},
				],
				download_method_options: [
					{id: '1', text: 'Send as attachment'},
					{id: '2', text: 'Send as link'},
				],
				format_options: [
					{id: 'csv', text: 'CSV'},
					{id: 'xls', text: 'XLS'},
				],
			  editorA: 'editor-a',
			  contentA: '',
			  copy:'',
			  email: '',
			  subject: '',
			  rate_deck_format:'csv',
			  groupname: '',
			  effective_date: '',
			  rate_email_template: '',
			  download_method: '1',
			  send_type: '0',
			  options: [
				  { id: 1, value: 'carrier1', text: 'Carrier 1' },
				  { id: 2, value: 'carrier2', text: 'Carrier 2' },
				  { id: 3, value: 'carrier3', text: 'Carrier 3' },
				  { id: 4, value: 'carrier4', text: 'Carrier 4' },
				  { id: 5, value: 'carrier5', text: 'Carrier 5' }
			  ]
            }
        },
		mounted: function() {
			$('#headers').multiSelect({
				 selectableHeader: "<div class='custom-header'>Headers</div>",
  				 selectionHeader: "<div class='custom-header'>Selected</div>"
			});
		},
		methods: {
			...mapActions({
				setMessage: 'app_message/setAppMessage'
			}),
			getSendRateForRequest() {
				var send_rate = {};
				send_rate.content = this.contentA;
				send_rate.name = '';
				send_rate.subject = this.subject;
			},
			saveSendRate() {
				const url = api.getEndpointUrl() + '/v1/config/send_rate_template/create';
				const reqBody = this.getSendRateForRequest();
				this.$http.post(url, reqBody)
				.then(response => {
					if (response.body.success) {
						this.$router.push({path:"/switch/rate_table"});
						this.setMessage('The Send rate has been created!');
					}
					this.loading = false;
				})
				.catch(error => {
					this.loading = false;
					console.log(error)
					this.setMessage({
						message: 'Failed to create send rate',
						type: 'error'
					})
				})	
			},
			validateSendRate() {
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
						vm.saveSendRate();
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
			reset() {
				this.rate_deck_format ='csv';
				this.effective_date = '';
				this.download_method = '1';
				this.send_type = '0';
				this.zip = false;
				this.headers = [
					'code','effective_date'
				];
				this.email = 1;
				this.subject = '';
				this.copy = '';
				this.contentA = '';
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
						if(this.email_options.length>0)
							this.email = 1;
						console.log(this.email_options);
					}
				})
				.catch(error => {
					console.log(error)
				})
			},
		},
		created() {
			this.getEmails();
		}
	}
</script>

<style>
	.send_rate .checkbox-success input[type="checkbox"]:checked + label::before {
		background-color: #03c0fc;
		border-color: #03c0fc;
	}
	.tool-btn {
		margin-top: 90px;
	}
</style>
