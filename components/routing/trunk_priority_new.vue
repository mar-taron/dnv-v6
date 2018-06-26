<template>
	<div class="container-fluid">
      <div class="row">
		<div class="wrapper single">
			<time-display></time-display>
			<ol class="breadcrumb">
				  <li class="breadcrumb-item"><a href="#">Routing</a></li>
				  <li class="breadcrumb-item">
					  <router-link to="/routing/dynamic_routing">Dynamic Routing </router-link>
				  </li>
				  <li class="breadcrumb-item">
					  <router-link to="/routing/dynamic_routing/trunk_priority">Trunk Priority </router-link>
				  </li>
				  <li class="breadcrumb-item active">New</li>
			</ol>
			<h1 class="page-header">New Trunk Priority</h1>
			<router-link :to="'/routing/dynamic_routing/'+id+'/trunk_priority'" class="btn btn_white back"><span class="dnl_icon dnl_import"></span> Back </router-link>
			<div class="white_pad">
				<spinner v-show="loading" class="spinner"></spinner>
				<div class="select_group row">
					<div class="col-md-6 col-sm-8">
						<form class="form" @submit.prevent="validateBeforeSubmit">
							<div class="row">
								  <div class="form-group">
									<div class="col-md-4 col-sm-6">
										<label for="prefix">Prefix:</label>
										<input type="text" name="prefix" v-model="prefix" class="form-control"  :class="{'input': true, 'is-danger': errors.has('prefix') }"  v-validate="'required'"  placeholder="Enter Prefix">
										<span v-show="errors.has('prefix')" class="help is-danger">{{ errors.first('prefix') }}</span>
									</div>
									<div class="col-md-4 col-sm-6">
										<label for="egress_trunk">Egress Trunk:</label>
										<select class="selectable" v-model="egress_trunk">
											<option v-for="item in egress_trunk_options" v-bind:value="item.id">
												{{ item.text }}
											</option>
										</select>
									</div>
									<div class="col-md-4 col-sm-6">
										<label for="egress_trunk">Priority:</label>
										<select class="selectable" v-model="priority">
											<option v-for="item in priority_options" v-bind:value="item.id">
												{{ item.text }}
											</option>
										</select>
									</div>
								  </div>
								  <div class="clearfix little-space"></div>
								  <!--<div class="form-group">
									  <div class="col-sm-12">
										  <label for="groupname">Carrier:</label>
										  <select multiple="multiple" id="carrier" name="carrier">
											<option v-for="option in options" :value='option.value'>{{option.text}}</option>
										  </select>
									  </div>
								  </div>-->
							  </div>
							  <div class="button_set little-space">
								<button class="btn btn-primary" type="submit">
									Submit
								</button>
								<i v-show="loading" class="fa fa-spinner fa-spin" style="font-size:20px;line-height:40px;"></i>
								<!--<a class="btn btn-default" @click="reset()">
									Reset
								</a>-->
							  </div>
						</form>
					</div>
				</div>
			</div>
		</div>
	  </div>
	</div>
</template>

<script>
	const multiselect = require('multiselect');
	const vvalidate = require('vee-validate');
	const vcarrier = require('vue!../management/carrier.vue');
	const api = require("../../api");
	const auth = require("../../auth");
	const vSpinner = require('vue!../main_components/fadeloader.vue');
	import { mapActions } from 'vuex';
	module.exports = {
		created: function(){
			this.initData()
		},
		components: {
			'multiselect': multiselect,
			'spinner': vSpinner
		},
		props: ['id', 'editingpriority', 'trunk_id'],
		data: function(){
            return {
				egress_trunk_options: [],
				priority: 1,
				priority_options: [
					{id: 1, text: '1'},
					{id: 2, text: '2'},
					{id: 3, text: '3'},
					{id: 4, text: '4'},
					{id: 5, text: '5'},
					{id: 6, text: '6'},
					{id: 7, text: '7'},
					{id: 8, text: '8'},
					{id: 9, text: '9'},
				],
			  getcarrierapiUrl:'/v1/carrier/list',
			  prefix: '',
			  options: [],
			  loading:false
            }
        },
		mounted: function() {
			
		},
		methods : {
			...mapActions({
				setMessage: 'app_message/setAppMessage'
			}),
			initData() {
				this.fetchEgressTrunks();
			},
			organizePriorityData(data) {
				this.prefix = data.digits;
				this.priority = data.resource_pri;
				this.egress_trunk = data.resource_id;
			},
			fetchPriority() {
				this.loading = true;
				const url = api.getEndpointUrl() + '/v1/route/dynamic/pri/' + this.trunk_id
				this.$http.get(url)
				.then(response => {
					const body = response.body
					if (body.success) {
						this.organizePriorityData(body.payload)
						this.loading = false;
					}
				})
				.catch(error => {
					console.log(error)
				})
			},
			fetchEgressTrunks() {
				this.loading = true;
				const url = api.getEndpointUrl() + "/v1/route/dynamic/" + this.id
				console.log(url);
				this.$http.get(url)
					.then(response => {
						const body = response.body
						if (body.success) {
							var self = this;
							this.loading = false;
							const payload = body.payload
							var trunks = payload.egress_trunks;
							trunks.forEach(function (temp, i) {
								var egress_trunk = {};
								egress_trunk.id = temp.trunk.resource_id;
								egress_trunk.text = temp.trunk.name;
								self.egress_trunk_options.push(egress_trunk);
							});
							console.log(this.egress_trunk_options);
							if(this.editingpriority)
							this.fetchPriority();
						}
					})
					.catch(error => {
						console.log(error)
						this.loading = false;
					})
			},
			reset : function(){
				$('#carrier').multiSelect('deselect_all');
			},
			saveTrunkPriority() {
				// eslint-disable-next-line
				this.loading = true;
				if(this.editingpriority) {
					this.$http.patch(api.getEndpointUrl() + '/v1/route/dynamic/pri/'+this.trunk_id,
					{
						"digits": this.prefix,
						"resource_pri": this.priority,
						"resource_id": this.egress_trunk
					})
					.then(response => {
						if (response.body.success) {
							this.setMessage('Trunk priority was changed successfully');
							var thisvm = this;
							this.$router.push('/routing/dynamic_routing/'+this.id+'/trunk_priority');
						}
					})
					.catch(error => {
						console.log(error)
						this.setMessage({
							message: 'Failed to change priority',
							type: 'error'
						})
					})
				}
				else {
					this.$http.post(api.getEndpointUrl() + '/v1/route/dynamic/'+this.id+'/pri/create',
					{
						"digits": this.prefix,
						"resource_pri": this.priority,
						"resource_id": this.egress_trunk
					},
					{
						headers: {
							"X-Auth-Token": auth.getToken()
						}
					}
					).then(response => {
						if (response.body.success) {
							this.setMessage('Trunk priority was created successfully');
							this.$router.push('/routing/dynamic_routing/'+this.id+'/trunk_priority');
						}
						this.loading = false;
					})
					.catch(error => {
						console.log(error)
						this.loading = false;
						var msg = '';
						if(error.data.errors !== undefined)
							msg = error.data.errors;
						else if(error.data.error !== undefined)
							msg = error.data.error.message;
						this.setMessage({
							message: msg,
							type: 'error'
						})
					})
				}
				
			},
			validateBeforeSubmit(){
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
						vm.saveTrunkPriority();
					}
						
				}).catch((error) => {
					// eslint-disable-next-line
					console.log(error)
					vm.setMessage({
						message: 'Validation failed',
						type: 'error'
					})
				});
			}
		}
	}
</script>

<style>

	.wrapper.single .white_pad {
    	margin-bottom: 20px;
	}

	.little-space {
		margin: 15px 0;
	}

	.ms-container .ms-selectable, .ms-container .ms-selection {
		width: 47%;
	}

	.button_set.little-space {
		margin-top: 25px;
	}

	.button_set.little-space .btn {
		width: 23%;
	}

	.button_set.little-space .btn-primary {
		margin-right: 2px;
	}

	.btn_white.back {
		color: #222;
		background: #f7f8f9;
		border: 1px solid #e2e6ed;
		box-shadow: 0px 1px 1px 0px rgba(227, 230, 237, 0.74);
		padding: 9px 30px;
		margin-bottom: 20px;
	}

	.btn_white.back:hover {
		background: #fff;
	}

	.btn_white.back .dnl_icon {
		color: #03c0fc;
		font-size: 16px;
		vertical-align: middle;
		margin: -2px 5px 0 -10px;
		display: inline-block;
		transform: rotate(-90deg);
    	font-weight: 900;
	}


	@media (max-width: 480px) {
		.white_pad.select_group {
			width: 100%;
		}

		.clearfix.little-space,
		.button_set.little-space {
			margin: 0;
		}
	}


	@media (min-width: 319px) and (max-width: 479px) {
		.ms-container .ms-selectable,
		.ms-container .ms-selection {
			width: 100%;
			margin-bottom: 20px;
		}

		.ms-container {
			background-position: 50% 48%;
		}

		.ms-selection {
			margin-top: 20px;
		}
	}
</style>
