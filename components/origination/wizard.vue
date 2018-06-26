<template>
	<div class="container-fluid">
		<div class="row">
			<div class="wrapper single">
				<time-display></time-display>
				<ol class="breadcrumb">
					<li class="breadcrumb-item">
						<a href="#">Origination</a>
					</li>
					<li class="breadcrumb-item active">Wizard</li>
				</ol>
				<h1 class="page-header">Wizard</h1>
				<tabs @activateTab="changeTab" class="user_tabs wizard_steps">
					<tab label="Define Vendor" class="" p="STEP 1" icon="dnl_icon dnl_persona" selected>
						<div class="col-md-3 col-sm-4">
							<div class="form-group fix-select">
								<div class="form-group">
									<label>Vendor:</label>
									<select2 :options="vendor_options" :reloadable="true" v-model="vendor">
									</select2>
								</div>
							</div>
						</div>
						<div class="col-md-1 col-sm-2">
							<div class="inline_actions">
								<a>
									<span class="dnl_icon dnl_add"></span>
								</a>
								<a >
									<span @click="reload('vendor')" class="dnl_icon dnl_reload"></span>
								</a>
							</div>
						</div>
						<div class="clearfix little-space"></div>

						<div class="col-md-6 col-sm-6 col-xs-12 btn-center">
							<a class="btn btn-primary mini" @click="nextTab">Next</a>
						</div>
						<div class="clearfix"></div>
					</tab>
					<tab label="Define Client" class="" p="STEP 2" icon="dnl_icon dnl_person">
						<div class="col-md-3 col-sm-4">
							<div class="form-group fix-select">
								<div class="form-group">
									<label>Client:</label>
									<select2 :options="did_client_options" :reloadable="true" v-model="client">
									</select2>
								</div>
							</div>
						</div>
						<div class="col-md-1 col-sm-2">
							<div class="inline_actions">
								<a>
									<span class="dnl_icon dnl_add"></span>
								</a>
								<a>
									<span @click="reload('client')" class="dnl_icon dnl_reload"></span>
								</a>
							</div>
						</div>
						<div class="clearfix little-space"></div>

						<div class="col-md-6 col-sm-6 col-xs-12 btn-center">
							<a class="btn btn-default mini min prev_button" @click="prevTab">Previous</a>
							<a class="btn btn-primary mini" @click="nextTab">Next</a>
						</div>
						<div class="clearfix"></div>
					</tab>
					<tab label="Define DID" class="" p="STEP 3" icon="dnl_icon dnl_setting">
						<div class="col-md-3 col-sm-4">
							<div class="form-group fix-select">
								<label>DID:</label>
								<select2 :options="did_options" :reloadable="true" v-model="did">
								</select2>
							</div>
						</div>
						<div class="clearfix"></div>
						<div class="col-md-4 col-sm-4" v-if="did == '1'">
							<div class="form-group">
								<label>Specify DID(Max 1000):</label>
								<textarea v-model="specify_did" class="form-control" placeholder="Enter DID"></textarea>
							</div>
						</div>
						<div class="col-md-4 col-sm-4" v-if="did == '2'">
							<div class="form-group">
								<label>Upload DID File:</label>
							</div>
						</div>
						<div class="clearfix little-space"></div>
						<div class="row">
							<div class="col-md-6 col-sm-6 col-xs-12 step_button_holder">
								<a class="btn btn-default mini min prev_button" @click="prevTab">Previous</a>
								<a class="btn btn-primary mini" @click="nextTab">Next</a>
							</div>
						</div>
						<div class="clearfix"></div>
					</tab>
					<tab label="Define Vendor Billing Rule" class="" p="STEP 4" icon="dnl_icon dnl_money">
						<div class="col-md-3 col-sm-4">
							<div class="form-group fix-select">
								<div class="form-group">
									<label>Vendor Billing Rule:</label>
									<select2 :options="did_billing_rule_options" :reloadable="true" v-model="vendor_billing_rule">
									</select2>
								</div>
							</div>
						</div>
						<div class="col-md-1 col-sm-2">
							<div class="inline_actions">
								<a>
									<span class="dnl_icon dnl_add"></span>
								</a>
								<a>
									<span @click="reload('vendor_billing')" class="dnl_icon dnl_reload"></span>
								</a>
							</div>
						</div>
						<div class="clearfix little-space"></div>
						<div class="col-md-6 col-sm-6 col-xs-12 step_button_holder">
							<a class="btn btn-default mini min prev_button" @click="prevTab">Previous</a>
							<a class="btn btn-primary mini" @click="nextTab">Next</a>
						</div>
						<div class="clearfix"></div>
					</tab>
					<tab label="Define Client Billing Rule" class="" p="STEP 5" icon="dnl_icon dnl_money">
						<div class="col-md-3 col-sm-4">
							<div class="form-group fix-select">
								<div class="form-group">
									<label>Client Billing Rule:</label>
									<select2 :options="did_billing_rule_options" :reloadable="true" v-model="client_billing_rule">
									</select2>
								</div>
							</div>
						</div>
						<div class="col-md-1 col-sm-2">
							<div class="inline_actions">
								<a>
									<span class="dnl_icon dnl_add"></span>
								</a>
								<a>
									<span @click="reload('client_billing')" class="dnl_icon dnl_reload"></span>
								</a>
							</div>
						</div>
						<div class="clearfix little-space"></div>
						<div class="col-md-6 col-sm-6 col-xs-12 step_button_holder">
							<a class="btn btn-default mini min prev_button" @click="prevTab">Previous</a>
							<a class="btn btn-primary mini" @click="createNewRepository">Finish</a>
						</div>
						<div class="clearfix"></div>
					</tab>
				</tabs>
			</div>
		</div>
	</div>
</template>

<script>   
const vTabs = require('vue!../main_components/tabs.vue'),
	vTab = require('vue!../main_components/tab.vue'),
	vSelect = require('vue!../main_components/select.vue'),
	modal = require('vue!../main_components/modal.vue');
const api = require("../../api");
import { mapActions } from 'vuex';

module.exports = {
	components: {
		'tabs': vTabs,
		'tab': vTab,
		'select2': vSelect,
		'modal': modal
	},
	data: function() {
		return {
			did_billing_rule_options: [],
			did_options: [
				{ id: '1', text: 'Specify DID' },
				{ id: '2', text: 'Upload DID File' },
			],
			did_client_options: [],
			actived_tab_index: 0,
			vendor_options: [],
			vendor: '',
			client: '',
			did: '1',
			specify_did: '',
			vendor_billing_rule: '',
			client_billing_rule: '',
			options: [
				{ id: 1, value: 'carrier1', text: 'Carrier 1' },
				{ id: 2, value: 'carrier2', text: 'Carrier 2' },
				{ id: 3, value: 'carrier3', text: 'Carrier 3' },
				{ id: 4, value: 'carrier4', text: 'Carrier 4' },
				{ id: 5, value: 'carrier5', text: 'Carrier 5' }
			],
		}
	},
	created() {
		this.fetchVendors()
		this.fetchDidClients();
		this.fetchDidBillingRules();
	},
	methods: {
		...mapActions({
			setMessage: 'app_message/setAppMessage'
		}),
		reload(item) {
		    console.log('heheh');
		  switch (item) {
              case 'vendor':
                  this.vendor = this.vendor_options[0].id
                   break;
              case 'client':
                   this.client = this.did_client_options[0].id;
                   break;
              case 'vendor_billing':
					this.vendor_billing_rule = this.did_billing_rule_options[0].id
                  break;
              case 'client_billing':
                    this.client_billing_rule = this.did_billing_rule_options[0].id
                  break;
          }
 		},
		createNewRepository() {
			const url = api.getEndpointUrl() + '/v1/did/repository/create';
			const reqBody = {
				did: this.specify_did,
				vendor_res_id: this.vendor,
				vendor_billing_rule_id: this.vendor_billing_rule,
				client_res_id: this.client,
				client_billing_rule_id: this.client_billing_rule
			};
			this.$http.post(url, reqBody)
				.then(response => {
					const body = response.body
					if (body.success) {
						this.$router.push('/origination/did_repository');
						this.setMessage('Repository was created successfully');
					}
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
		changeTab(tab, index) {
			if (this.actived_tab_index === index) { return }
			this.actived_tab_index = index
			this.selectTab(this.actived_tab_index);
		},
		selectTab(index) {

			var tabList = document.querySelectorAll('.tab');
			for (var i = 0; i < tabList.length; i++) {
				if ((index) == i) { tabList[i].setAttribute("class", "tab active"); }
				else { tabList[i].setAttribute("class", "tab"); }
			}
			var tabContentList = document.querySelectorAll('.tab_wrapper');
			for (var i = 0; i < tabContentList.length; i++) {
				if ((index) == i) { tabContentList[i].style = null; }
				else { tabContentList[i].style.display = 'none'; }
			}
		},
		validateForCarrierTemplate() {

			var vm = this;
			this.$validator.validateAll().then(() => {
				const err = this.$validator.getErrors();
				if (err.errors.length != '') {
					const msg = err.errors[0].field + ' field can not leave as null';
					vm.setMessage({
						message: msg,
						type: 'error'
					});
					return false;
				} else {
					return true;
				}

			}).catch((error) => {
				console.log(vm);
				// eslint-disable-next-line
				console.log(error)
				vm.setMessage({
					message: 'Validation failed',
					type: 'error'
				})
			});

			if(this.did == '1') {
				if (this.specify_did == '') {
					const msg = 'DID field cannot be empty.';
					vm.setMessage({
						message: msg,
						type: 'error'
					});
					return false;
				} else {
					return true;
				}
			}
			else
				return true;
		},
		prevTab() {
			this.actived_tab_index -= 1;
			this.selectTab(this.actived_tab_index);
		},
		nextTab() {

			var validated = true;

			if (this.actived_tab_index == 2) {
				var definedd = this.validateForCarrierTemplate();
				validated = definedd;
			}

			if (validated == true) {

				this.actived_tab_index += 1;
				this.selectTab(this.actived_tab_index);

			}


		},
		fetchDidBillingRules() {
			const url = api.getEndpointUrl() + '/v1/did/billing_rule/list'
			this.$http.get(url)
				.then(response => {
					const body = response.body
					if (body.success) {
						const did_clients = body.payload.items
						console.log(did_clients);
						var self = this;
						did_clients.forEach(function(temp, i) {
							var did_billing_rule = {};
							did_billing_rule.id = temp.id;
							did_billing_rule.text = temp.name;
							self.did_billing_rule_options.push(did_billing_rule);
							if (i == 0) {
								self.vendor_billing_rule = did_billing_rule.id;
								self.client_billing_rule = did_billing_rule.id;
							}
						});
						console.log(this.did_billing_rule_options);
					}
				})
				.catch(error => {
					console.log(error)
				})
		},
		fetchDidClients() {
			const url = api.getEndpointUrl() + '/v1/did/client/list'
			this.$http.get(url)
				.then(response => {
					const body = response.body
					if (body.success) {
						const did_clients = body.payload.items
						var self = this;
						did_clients.forEach(function(temp, i) {
							var did_client = {};
							did_client.id = temp.client_id;
							did_client.text = temp.name;
							self.did_client_options.push(did_client);
							if (i == 0)
								self.client = did_client.id;
						});
						console.log(this.did_client_options);
					}
				})
				.catch(error => {
					console.log(error)
				})
		},
		fetchVendors() {
			const url = api.getEndpointUrl() + '/v1/did/vendor/list'
			this.$http.get(url)
				.then(response => {
					const body = response.body
					if (body.success) {
						const vendors = body.payload.items
						var self = this;
						vendors.forEach(function(temp, i) {
							var vendor = {};
							vendor.id = temp.client_id;
							vendor.text = temp.name;
							self.vendor_options.push(vendor);
							if (i == 0)
								self.vendor = vendor.id;
						});
						console.log(this.vendor_options);
					}
				})
				.catch(error => {
					console.log(error)
				})
		},
	}
}
</script>

<style>
.tab span.dnl_icon.dnl_money {
	font-size: 19px;
}

@media (max-width:425px) {
	.step_button_holder {
		text-align: center
	}
}

@media (max-width: 424px) {
	.prev_button {
		margin-bottom: 10px
	}
	.btn-center {
		text-align: center;
	}
}
</style>

