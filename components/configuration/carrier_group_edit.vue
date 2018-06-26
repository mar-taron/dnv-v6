<template>
	<div class="container-fluid">
      <div class="row">
		<div class="wrapper single">
			<time-display></time-display>
			<ol class="breadcrumb">
				  <li class="breadcrumb-item"><a href="#">Configuration</a></li>
				  <li class="breadcrumb-item">
					  <router-link to="/configuration/carrier_group">Carrier Group </router-link>
				  </li>
				  <li class="breadcrumb-item active">Edit</li>
			</ol>
			<h1 class="page-header">Carrier Group Editor</h1>
			<router-link to="/configuration/carrier_group" class="btn btn_white back"><span class="dnl_icon dnl_import"></span> Back </router-link>
			<div class="white_pad">
				<div class="select_group row">
					<div class="col-md-6 col-sm-8">
						<form class="form">
							<div class="row">
								  <div class="form-group">
									<div class="col-sm-6">
										<label for="groupname">Group Name:</label>
										<input type="hidden" name="groupid" v-model="groupid"/>
										<input type="text" name="groupname" v-model="groupname" class="form-control" placeholder="Enter the group name">
									</div>
								  </div>
								  <div class="clearfix little-space"></div>
								  <div class="form-group">
									  <div class="col-sm-12">
										  <!-- <label for="groupname">Carrier:</label>
										  <select multiple="multiple" id="carrier" name="carrier">
											<option v-for="option in options" :value='option.value'>{{option.text}}</option>
										  </select> -->
										  <el-transfer v-model="carriers" :titles="['Carriers', 'Selected Carriers']" :data="carrier_options">
											</el-transfer>
									  </div>
								  </div>
							  </div>
							  <div class="button_set little-space">
								<a class="btn btn-primary" @click="submit_edit()">
									Submit
								</a>
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
	import { mapActions } from 'vuex'
	module.exports = {
		created: function(){
			this.fetchCarriers();
		},
		components: {
			'multiselect': multiselect
		},
		data: function(){
            return {
				carriers: [],
				carrier_options: [],
			  apiUrl:'/v1/carrier/group/',
			  groupname: '',
			  options: [],
			  resource: null,
			  loading:false
            }
        },
		mounted: function() {
			console.log("mounted function called");
			$('#carrier').multiSelect({
				selectableHeader: "<div class='custom-header'>Unappropriated</div>",
				selectionHeader: "<div class='custom-header'>Appropriated</div>"
			});
		},
		methods : {
			...mapActions({
				setMessage: 'app_message/setAppMessage'
			}),
			fetchCarrierGroup() {
				var the = this;
				var group_id = this.$route.params.id;
				//get carrier group by id
				this.$http.get(api.getEndpointUrl() + this.apiUrl + group_id,
				{
					headers: {
						"X-Auth-Token": auth.getToken()
					}
				}).then(function(response) {
					//todo: check success flag? validation errors?
					console.log(response);
					var group = response.body.payload;
					the.groupname = group.group_name;
					the.groupid = group.group_id;
					the.carriers = group.clients;
				}, function(error) {
					console.log(error);
				});
			},
			fetchCarriers() {
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
										carrier.key = temp.client_id;
										carrier.label = temp.name;
										self.carrier_options.push(carrier);
									});
									this.fetchCarrierGroup();
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
			reset : function(){
				console.log("reset clicked!");
				$('#carrier').multiSelect('deselect_all');
			},
			submit_edit : function(){
				//patch the group name by changed
				console.log("submit edit clicked!");
				var group_id = this.groupid;

				if(this.groupname == ''){

				}
				else{
					this.loading = true;
					this.$http.patch(api.getEndpointUrl() + this.apiUrl + group_id,
					{
						"group_name": this.groupname, //todo: actual role id
						"clients": this.carriers
					},
					{
						headers: {
							"X-Auth-Token": auth.getToken()
						}
					}).then(function(response) {
						//todo: check success flag? validation errors?
						this.loading = false;
						console.log(response);
						this.setMessage('The carrier group has been edited!')
						var thisvm = this;
						setTimeout(function(){
							thisvm.$router.push('/configuration/carrier_group');
						}, 3000);
					}, function(error) {
						this.loading = false;
						console.log(error);
					});
				}
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
