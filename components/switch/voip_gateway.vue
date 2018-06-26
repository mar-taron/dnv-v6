<template>
	<div class="container-fluid">
		<div class="row">
			<div class="wrapper single">
				<time-display></time-display>
				<ol class="breadcrumb">
					<li class="breadcrumb-item"><a href="#">Switch</a></li>
					<li class="breadcrumb-item active">VoIP Gateway</li>
				</ol>
				<h1 class="page-header">VoIP Gateway</h1>
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
							<el-select v-model="ip_table_columns" multiple placeholder="Show/Hide Columns" @change="handleChange">
								<el-option v-for="item in ip_table_column_options" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</div>
						<router-link to="/switch/voip_gateway/new" class="btn btn-primary mini pull-right">
							<span class="dnl_icon dnl_add"></span> Create new
						</router-link>
						<router-link to="/switch/voip_gateway" class="btn btn-primary mini pull-right m-right-10">
							<!--<a class="btn btn-primary mini pull-right m-right-10">-->
							<span class="dnl_icon dnl_reload"></span> Reload
							<!--</a>-->
						</router-link>
					</div>
					<div class="table-responsive">
						<table class="table table-striped table-hover carrier_groups">
							<thead>
								<tr>
									<th v-if="showcolumns[0]">Name <span class="dnl_icon dnl_sort pull-right"></span></th>
									<th v-if="showcolumns[1]">CLI IP</th>
									<th v-if="showcolumns[2]">CLI Port</th>
									<!-- <th v-if="showcolumns[3]">Paid Replace IP</th> -->
									<th v-if="showcolumns[3]">Status</th>
									<th v-if="showcolumns[4]" class="width_138">Action</th>
								</tr>
							</thead>
							<tbody v-for="ip in ips">
								<tr v-if="!ips.length">
									<td style="text-align: center" colspan="6">No Data Found</td>
								</tr>								
								
								<tr>
									<td v-if="showcolumns[0]">{{ip.name}}</td>
									<td v-if="showcolumns[1]">{{ip.lan_ip}}</td>
									<td v-if="showcolumns[2]">{{ip.lan_port}}</td>
									<!-- <td v-if="showcolumns[3]">{{ip.paid_replace_ip}}</td> -->
									<td v-if="showcolumns[3]">{{ip.connected ? 'connected' : 'error'}}</td>
									<td v-if="showcolumns[4]">
										<a @click="manageSwitchHost($event, ip)" class="action action_megaphone" data-toggle="tooltip" data-placement="top" title="SIP Profile">
											<span class="dnl_icon dnl_megaphone"></span>
										</a>
										<a class="action action_edit" data-toggle="tooltip" data-placement="top" title="Edit" v-on:click="edit_ip(ip.switch_id)">
											<span class="dnl_icon dnl_action_edit"></span>
										</a>
										 <a class="action action_add" data-toggle="tooltip" data-placement="top" title="Add Switch Host" @click="manageSwitchHost($event, ip, true)">
											<span class="dnl_icon dnl_add"></span>
										</a> 
										<!-- <a class="toogler action" @click="toggleTable($event, ip)">+</a> -->
										<a class="action action_delete" data-toggle="tooltip" data-placement="top" title="Delete" @click="askDeleteConfirm(ip.switch_id)">
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
														<th>Profile Name</th>
														<th>SIP IP</th>
														<th>SIP Port</th>
														<th>CPS Limit</th>
														<th>CAP</th>
														<th>Action</th>
													</tr>
												</thead>
												<tbody v-for="host in ip.sip_host">
													<tr>
														<td>
															<input type="text" v-model="host.host_name" class="form-control" v-if="host.is_creating || host.is_editing">
															{{!host.is_creating && !host.is_editing?host.host_name: ''}}
														</td>
														<td>
															<input type="text" v-model="host.sip_ip" class="form-control" v-if="host.is_creating || host.is_editing">
															{{!host.is_creating && !host.is_editing?host.sip_ip: ''}}
														</td>
														<td>
															<input type="text" v-model="host.sip_port" class="form-control" v-if="host.is_creating || host.is_editing">
															{{!host.is_creating && !host.is_editing?host.sip_port: ''}}
														</td>
														<td>
															<input type="text" v-model="host.cps" class="form-control" v-if="host.is_creating || host.is_editing">
															{{!host.is_creating && !host.is_editing?host.cps: ''}}
														</td>
														<td>
															<input type="text" v-model="host.cap" class="form-control" v-if="host.is_creating || host.is_editing">
															{{!host.is_creating && !host.is_editing?host.cap: ''}}
														</td>
														<td>
															<a class="action action_save" data-toggle="tooltip" data-placement="top" title="Save" v-if="host.is_creating || host.is_editing" @click="saveSipHost(ip, host)">
																<span class="dnl_icon dnl_save"></span>
															</a>
															<a class="action action_edit" data-toggle="tooltip" data-placement="top" title="Edit" v-if="!host.is_creating && !host.is_editing" @click="editSipHost(host)">
																<span class="dnl_icon dnl_action_edit"></span>
															</a>
															<a class="action action_login_as" data-toggle="tooltip" data-placement="top" title="Exit" v-if="host.is_creating || host.is_editing" @click="exitSipHost(ip, host)">
																<span class="dnl_icon dnl_exit"></span>
															</a>
															<a class="action action_delete" data-toggle="tooltip" data-placement="top" title="Delete" v-if="!host.is_creating && !host.is_editing" v-on:click="askDeleteHostConfirm(ip, host)">
																<span class="dnl_icon dnl_action_delete"></span>
															</a>
														</td>
													</tr>
													<tr>
														<td colspan="6">
															Require Authenication:<input id="require_auth" name="require_auth" type="checkbox" v-model="host.rpid" v-if="host.is_creating || host.is_editing">{{!host.is_creating && !host.is_editing?(host.rpid == 1?'Yes':'No'): ''}}
															RPID:<input id="rpid" name="rpid" type="checkbox" v-model="host.rpid" v-if="host.is_creating || host.is_editing">{{!host.is_creating && !host.is_editing?(host.rpid == 1?'Yes':'No'): ''}}
															OLI:<input id="oli" name="oli" type="checkbox" v-model="host.oli" v-if="host.is_creating || host.is_editing">{{!host.is_creating && !host.is_editing?(host.oli == 1?'Yes':'No'): ''}}
															PRIV:<input id="priv" name="priv" type="checkbox" v-model="host.priv" v-if="host.is_creating || host.is_editing">{{!host.is_creating && !host.is_editing?(host.priv == 1?'Yes':'No'): ''}}
															DIV:<input id="div" name="div" type="checkbox" v-model="host.div" v-if="host.is_creating || host.is_editing">{{!host.is_creating && !host.is_editing?(host.div == 1?'Yes':'No'): ''}}
															PAID:<input id="paid" name="paid" type="checkbox" v-model="host.paid" v-if="host.is_creating || host.is_editing">{{!host.is_creating && !host.is_editing?(host.paid == 1?'Yes':'No'): ''}}
															PCI:<input id="pci" name="pci" type="checkbox" v-model="host.pci" v-if="host.is_creating || host.is_editing">{{!host.is_creating && !host.is_editing?(host.pci == 1?'Yes':'No'): ''}}
															X LRN:<input id="x_lrn" name="x_lrn" type="checkbox" v-model="host.x_lrn" v-if="host.is_creating || host.is_editing">{{!host.is_creating && !host.is_editing?(host.x_lrn == 1?'Yes':'No'): ''}}
															X Header:<input id="x_header" name="x_header" type="checkbox" v-model="host.x_header" v-if="host.is_creating || host.is_editing">{{!host.is_creating && !host.is_editing?(host.x_header == 1?'Yes':'No'): ''}}
														</td>
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
						<pagination :current-page="pageOne.currentPage" :total-pages="pageOne.totalPages" @page-changed="pageOneChanged">
						</pagination>
					</div>
					<div class="clearfix"></div>
				</div>
			</div>
		</div>
		<modal v-if="showModal=='sip_profile'" @close="showModal = ''" class="biggest_modal">
			<h3 slot="header">Sip Profile</h3>
			<div slot="body">
				<!--<a class="btn btn-primary mini m-right-10">-->
					<!--<span class="dnl_icon dnl_reload"></span> Reload-->
				<!--</a>-->
				<!--<a class="btn btn-primary mini" @click="addSipProfile">-->
					<!--<span class="dnl_icon dnl_add"></span> Create new-->
				<!--</a>-->
				<div class="clearfix m-top-15"></div>
				<div class="table-responsive">
					<table class="table table-striped table-hover carrier_groups">
						<thead>
							<tr>
								<th>Profile Name <span class="dnl_icon dnl_sort pull-right"></span></th>
								<th>SIP IP</th>
								<th>SIP Port</th>
								<!-- <th>Proxy IP</th> -->
								<!-- <th>Proxy Port</th> -->
								<th>CPS Limit</th>
								<th>CAP</th>
								<th class="width_128">Action</th>
							</tr>
						</thead>
						<tbody v-for="(profile,index) in profiles">
							<tr>
								<td><input type="text" v-model="profile.name" class="form-control"></td>
								<td><input type="text" v-model="profile.sip_ip" class="form-control"></td>
								<td><input type="text" v-model="profile.sip_port" class="form-control"></td>
								<!-- <td>{{profile.proxy_ip}}</td> -->
								<!-- <td>{{profile.proxy_port}}</td> -->
								<td><input type="text" v-model="profile.cps_limit" class="form-control"></td>
								<td><input type="text" v-model="profile.cap" class="form-control"></td>
								<td>
									<a class="action action_trigger" data-toggle="tooltip" data-placement="top" title="Trigger">
										<span class="dnl_icon dnl_trigger"></span>
									</a>
									<a class="action action_edit" data-toggle="tooltip" data-placement="top" title="Edit">
										<span class="dnl_icon dnl_action_edit"></span>
									</a>
									<!--<a class="action action_add" data-toggle="tooltip" data-placement="top" title="Add Switch Host">-->
										<!--<span class="dnl_icon dnl_add"></span>-->
									<!--</a>-->
									<a class="action action_delete" data-toggle="tooltip" data-placement="top" title="Delete" @click="profiles.splice(index, 1)">
										<span class="dnl_icon dnl_action_delete"></span>
									</a>
								</td>
							</tr>
							<tr>
								<td colspan="8">
									<table class="full-width">
										<tr>
											<td>
												<div class="checkbox checkbox-success">
													<input :id="'require_auth_'+index" :name="'require_auth_'+index" v-model="profile.details.require_auth" type="checkbox">
													<label :for="'require_auth_'+index">Require Authenication:</label>
												</div>
											</td>
											<td>
												<div class="checkbox checkbox-success">
													<input :id="'rpid_'+index" :name="'rpid_'+index" v-model="profile.details.rip" type="checkbox">
													<label :for="'rpid_'+index">OLI:</label>
												</div>
											</td>
											<td>
												<div class="checkbox checkbox-success">
													<input :id="'oli_'+index" :name="'oli_'+index" v-model="profile.details.oli" type="checkbox">
													<label :for="'oli_'+index">OLI:</label>
												</div>
											</td>
											<td>
												<div class="checkbox checkbox-success">
													<input :id="'priv_'+index" :name="'priv_'+index" v-model="profile.details.priv" type="checkbox">
													<label :for="'priv_'+index">PRIV:</label>
												</div>
											</td>
											<td>
												<div class="checkbox checkbox-success">
													<input :id="'div_'+index" :name="'div_'+index" v-model="profile.details.div" type="checkbox">
													<label :for="'div_'+index">DIV:</label>
												</div>
											</td>
											<td>
												<div class="checkbox checkbox-success">
													<input :id="'paid_'+index" :name="'paid_'+index" v-model="profile.details.paid" type="checkbox">
													<label :for="'paid_'+index">PAID:</label>
												</div>
											</td>
											<td>
												<div class="checkbox checkbox-success">
													<input :id="'pci_'+index" :name="'pci_'+index" v-model="profile.details.pci" type="checkbox">
													<label :for="'pci_'+index">PCI:</label>
												</div>
											</td>
											<td>
												<div class="checkbox checkbox-success">
													<input :id="'xlrn_'+index" :name="'xlrn_'+index" v-model="profile.details.xlrn" type="checkbox">
													<label :for="'xlrn_'+index">X Header:</label>
												</div>
											</td>
											<td>
												<div class="checkbox checkbox-success">
													<input :id="'xheader_'+index" :name="'xheader_'+index" v-model="profile.details.xheader" type="checkbox">
													<label :for="'xheader_'+index">X Header:</label>
												</div>
											</td>
										</tr>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div slot="footer">
				<!--<button class="btn btn-primary submit mini">Update</button>-->
				<!--<button @click="closeModal" class="btn btn-default cancel mini">Cancel</button>-->
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
	   import { mapActions } from 'vuex'
	   module.exports = {
	   	components: {
	   		'select2': vSelect,
	   		'pagination': Pagination,
	   		'confirm': confirmmodal,
	   		'modal': modal
	   	},
	   	data: function() {
	   		return {
				emptyHost: {
					support_register: 0,
					oli: 0,
					paid: 0,
					pci: 0,
					rpid: 0,
					status: 'disabled',
					x_lrn: 0,
					div: 0,
					cps: 0,
					priv: 0,
					sip_port: 0,
					host_name: '',
					x_header: 0,
					sip_ip: '',
					cap: 0,
					is_creating: true,
					is_editing: false,
				},
	   			apiUrl: '/v1/switch/list',
	   			showModal: '',
	   			selected_id: 0,
	   			pageOne: {
	   				currentPage: 1,
	   				totalPages: 10,
	   				cntpage: 10
	   			},
	   			showModal: '',
	   			selected1: 1,
	   			options1: [{
	   					id: 1,
	   					text: '10'
	   				},
	   				{
	   					id: 2,
	   					text: '20'
	   				},
	   				{
	   					id: 3,
	   					text: '30'
	   				},
	   				{
	   					id: 4,
	   					text: '50'
	   				},
	   				{
	   					id: 5,
	   					text: '100'
	   				}
	   			],
	   			//   selected2: 0,
	   			//   options2: [
	   			// 	  { id: 1, text: 'Group Name' },
	   			// 	  { id: 2, text: 'Carrier Count' },
	   			// 	  { id: 3, text: 'Actions' }
	   			//   ],
	   			profiles: [{
	   					name: 'Client1',
	   					sip_ip: '123.123.123.123',
	   					sip_port: '980',
	   					proxy_ip: '233.233.233.233',
	   					proxy_port: '51',
	   					cps_limit: '300',
	   					cap: '213',
	   					details: [{
	   						require_auth: 'Yes',
	   						rip: 'No',
	   						oli: 'Yes',
	   						priv: 'No',
	   						div: 'Yes',
	   						paid: 'Yes',
	   						pci: 'No',
	   						xlrn: 'No',
	   						xheader: 'No'
	   					}]
	   				},
	   				{
	   					name: 'Client2',
	   					sip_ip: '123.123.123.123',
	   					sip_port: '980',
	   					proxy_ip: '233.233.233.233',
	   					proxy_port: '51',
	   					cps_limit: '300',
	   					cap: '213',
	   					details: [{
	   						require_auth: 'Yes',
	   						rip: 'No',
	   						oli: 'Yes',
	   						priv: 'No',
	   						div: 'Yes',
	   						paid: 'Yes',
	   						pci: 'No',
	   						xlrn: 'No',
	   						xheader: 'No'
	   					}]
	   				}
	   			],
	   			ips: [],
	   			ip_table_column_options: [{
	   				value: 'Name',
	   				label: 'Name'
	   			}, {
	   				value: 'CLI IP',
	   				label: 'CLI IP'
	   			}, {
	   				value: 'CLI Port',
	   				label: 'CLI Port'
	   			}, {
	   				value: 'Status',
	   				label: 'Status'
	   			}, {
	   				value: 'Action',
	   				label: 'Action'
	   			}],
	   			ip_table_columns: ['Name', 'CLI IP', 'CLI Port',
	   				'Status', 'Action'
	   			],
				temp_ip_table_columns: ['Name', 'CLI IP', 'CLI Port',
	   				'Status', 'Action'
	   			],
	   			showcolumns: [true, true, true, true, true],
	   		}
	   	},
	   	methods: {
			...mapActions({
				setAsyncConfirm: 'async_confirm/setAsyncConfirm',
				setMessage: 'app_message/setAppMessage'
			}),
			deleteSipHost(ip, host) {
				const url = api.getEndpointUrl() + '/v1/switch/sip_host/' + host.id
				this.$http.delete(url)
				.then(response => {
					if (response.body.success) {
						let index = _.findIndex(ip.sip_host, elem => elem.id   === host.id)
						if (~index) {
							ip.sip_host.splice(index, 1)
						}
						this.setMessage('The host was removed successfully')
					}
				})
			},
			askDeleteHostConfirm(ip, host) {
				this.setAsyncConfirm('Are you sure you want to delete this item')
				.then(result => {
					if (result.accepted) {
						this.deleteSipHost(ip, host)
					}
				})
				.catch(error => {
					console.log(error)
				})	
			},
			exitSipHost(ip, host) {
				if(host.is_creating)
					ip.sip_host.splice(0, 1);
				else if(host.is_editing) {
					host.is_editing = false;
				}
			},
			editSipHost(host) {
				Vue.set(host, 'is_editing', true);
				console.log(host);
			},
			saveSipHost(ip, host) {
				var url;
				if(host.is_creating) {
					url = api.getEndpointUrl() + '/v1/switch/' + ip.switch_id + '/sip_host/create'
				
					this.$http.post(url, host)
					.then(response => {
						if (response.body.success) {
							this.loading = false;
							this.setMessage('Switch Host has been saved successfully!');
							host.is_creating = false;
							var newHost = JSON.parse(JSON.stringify(this.emptyHost));
							ip.sip_host.splice(0, 0, newHost)
						}
					})
					.catch(error => {
						console.log(error)
						this.setMessage({
							message: 'Creating Switch Host has been failed!',
							type: 'error'
						})
					})	
				}
				else if(host.is_editing) {
					url = api.getEndpointUrl() + '/v1/switch/sip_host/' + host.id
				
					this.$http.patch(url, host)
					.then(response => {
						if (response.body.success) {
							this.loading = false;
							this.setMessage('Switch Host has been saved successfully!');
							host.is_editing = false;
						}
					})
					.catch(error => {
						console.log(error)
						this.setMessage({
							message: 'Editing Switch Host has been failed!',
							type: 'error'
						})
					})	
				}

			},
			manageSwitchHost(event, ip, is_add = false) {
				var element = event.currentTarget;
				$(element).parents('tr').siblings('.collapse').toggleClass('in');
				if(is_add) {
					var length = ip.sip_host.length;
					if(length == 0 || !ip.sip_host[0].is_creating){
						var newHost = JSON.parse(JSON.stringify(this.emptyHost));
						ip.sip_host.splice(0, 0, newHost)
					}
				}
				else {
					if(ip.sip_host[0].is_creating)
						ip.sip_host.splice(0, 1);	
				}				
			},
			addSipProfile() {
				this.profiles.push({
					name: '',
					sip_ip: '',
					sip_port: '',
					proxy_ip: '',
					proxy_port: '',
					cps_limit: '',
					cap: '',
					details: [{
						require_auth: '',
						rip: '',
						oli: '',
						priv: '',
						div: '',
						paid: '',
						pci: '',
						xlrn: '',
						xheader: ''
					}]
				})
			},
	   		edit_ip: function(id) {
	   			this.$router.push({
	   				path: "/switch/voip_gateway/edit/" + id
	   			});
	   		},
			getIPIndex (id) {
				return _.findIndex(this.ips, elem => elem.switch_id === id)
			},
			deleteIP(id) {
				const url = api.getEndpointUrl() + '/v1/switch/' + id
				this.$http.delete(url)
				.then(response => {
					if (response.body.success) {
						let index = this.getIPIndex(id)
						if (~index) {
							this.ips.splice(index, 1)
						}
						this.setMessage('The IP was removed successfully')
					}
				})
			},
			askDeleteConfirm(id) {
				this.setAsyncConfirm('Are you sure you want to delete this IP')
				.then(result => {
					if (result.accepted) {
						this.deleteIP(id)
					}
				})
				.catch(error => {
					console.log(error)
				})
			},
	   		handleChange() {
	   			for(let i = 0; i < this.temp_ip_table_columns.length; i++) {
					if (_.indexOf(this.ip_table_columns, this.temp_ip_table_columns[i]) != -1) {
						Vue.set(this.showcolumns, i, true);
					}
					else {
						Vue.set(this.showcolumns, i, false);
					}
				}
	   		},
	   		pageOneChanged(pageNum) {
				if (pageNum !== this.pageOne.currentPage) {
					this.pageOne.currentPage = pageNum
					this.$nextTick(this.fetchGateways)
				}
	   		},
			changePageCount (countPerPage) {
				if (countPerPage !== this.pageOne.cntpage) {
					this.pageOne.cntpage = countPerPage
					this.$nextTick(this.fetchGateways)
				}
			},
	   		closeModal: function() {
	   			this.showModal = '';
	   		},
	   		fetchGateways() {
	   			this.loading = true;
	   			var page = this.pageOne.currentPage - 1;
	   			var per_page = this.pageOne.cntpage;
	   			this.loading = true;
	   			this.$http.get(api.getEndpointUrl() + this.apiUrl + "?page=" + page + "&per_page=" + per_page + "&order_by=id&order_dir=desc", {
	   				headers: {
	   					"X-Auth-Token": auth.getToken()
	   				}
	   			}).then(function(response) {
	   				this.loading = false;
	   				//todo: check success flag? validation errors?
	   				var ips = response.body.payload.items;
	   				console.log(ips);
	   				this.ips = ips;
					var self = this;
					this.ips.forEach(function(item, i) {
						var newHost = JSON.parse(JSON.stringify(self.emptyHost));
						item.sip_host.splice(0, 0, newHost)
					})
	   				var total_page = response.body.payload.total;
	   				this.pageOne.currentPage = response.body.payload.page + 1;
	   				this.pageOne.totalPages = Math.ceil(response.body.payload.total / per_page);
	   			}, function(error) {
	   				this.loading = false;
	   				console.log(error);
	   			});
	   		}
	   	},
	   	mounted: function() {
	   		$('[data-toggle="tooltip"]').tooltip();
	   	},
	   	updated: function() {
	   		document.querySelector('.el-input > input').placeholder = 'Show/Hide Columns';
	   	},
	   	created: function() {
			this.fetchGateways();
	   	}
	   }
</script>

<style>
	a.action.action_megaphone {
		font-size: 16px;
		vertical-align: top;
	}
	a.btn.btn-primary.mini.m-right-10 {
		margin-right: 10px;
	}
	.modal-mask.biggest_modal .modal-container {
		width: 80%;
	}
	table.full-width {
		width: 100%;
	}
	.el-select__tags {
		display: none;
	}
	/* a.toogler.action {
		display: inline-block;
	} */
</style>
