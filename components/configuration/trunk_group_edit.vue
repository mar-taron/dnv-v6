<template>
	<div class="container-fluid">
		<div class="row">
			<div class="wrapper single">
				<time-display></time-display>
				<ol class="breadcrumb">
					<li class="breadcrumb-item">
						<a href="#">Configuration</a>
					</li>
					<li class="breadcrumb-item">
						<router-link to="/configuration/trunk_group">Trunk Group</router-link>
					</li>
					<li class="breadcrumb-item active">Edit</li>
				</ol>
				<h1 class="page-header">Edit Trunk Group</h1>
				<router-link to="/configuration/trunk_group" class="btn btn_white back">
					<span class="dnl_icon dnl_import"></span> Back </router-link>
				<div class="white_pad">
					<spinner v-show="loading" class="spinner"></spinner>
					<div class="select_group row">
						<div class="col-md-6 col-sm-8">
							<form class="form" @submit.prevent="validateBeforeSubmit">
								<div class="row">
									<div class="form-group">
										<div class="col-sm-6">
											<label for="group_name">Group Name:</label>
											<input type="text" name="group_name" v-model="data.group_name" class="form-control" v-validate="'required'" placeholder="Enter the group name">
											<span v-show="errors.has('group_name')" class="help is-danger">{{ errors.first('group_name') }}</span>
										</div>
									</div>
									<div class="clearfix little-space"></div>
									<div class="form-group">
										<div class="col-sm-12">
											<label for="group_name">Trunk:</label>
											<!--<select multiple="multiple" id="carrier" name="carrier">
													<option v-for="option in options" :value='option.value'>{{option.text}}</option>
												</select>-->
											<el-transfer v-model="data.trunks" :titles="['Unappropriated', 'Appropriated']" :data="trunk_options">
											</el-transfer>
										</div>
									</div>
								</div>
								<div class="button_set little-space">
									<button class="btn btn-primary" type="submit">
										Submit
									</button>
									<a class="btn btn-default" v-on:click="reset">
										Reset
									</a>
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
// const multiselect = require('multiselect');
const api = require("../../api");
const auth = require("../../auth");
const vSpinner = require('vue!../main_components/fadeloader.vue');
_ = require('lodash');
import { mapGetters, mapActions } from 'vuex'

module.exports = {
	created: function() {
		this.initData();
	},
	components: {
		// 'multiselect': multiselect
		'spinner': vSpinner
	},
	props: ['type', 'id'],
	data: function() {
		return {
			trunks: [],
			trunk_options: [],
			data: {},
			origindata: {},
			loading: false,
		}
	},
	mounted: function() {
	},
	methods: {
		...mapActions({
			setAsyncConfirm: 'async_confirm/setAsyncConfirm',
			setMessage: 'app_message/setAppMessage'
		}),
		initData() {
			this.fetchTrunks();
		},
		fetchTrunks() {
			var per_page = 1;
			var url = api.getEndpointUrl() + "/v1/trunk/" + this.type + "/list?per_page=" + per_page
			this.loading = true;
			this.$http.get(url)
			.then(response => {
				const body = response.body
				if (body.success) {
					this.loading = false;
					per_page = body.payload.total;

					url = api.getEndpointUrl() + "/v1/trunk/" + this.type + "/list?per_page=" + per_page
					this.loading = true;
					this.$http.get(url)
						.then(response => {
							const body = response.body
							if (body.success) {
								var self = this;
								var trunks = body.payload.items

								trunks.forEach(function(temp, i) {
									var trunk = {};
									trunk.key = temp.resource_id;
									trunk.label = temp.name;
									self.trunk_options.push(trunk);
								});
								this.fetchGroup();
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
		},
		fetchGroup() {
			this.loading = true;
			this.$http.get(api.getEndpointUrl() + "/v1/trunk/group/" + this.id,
				{
					headers: {
						"X-Auth-Token": auth.getToken()
					}
				}).then(function(response) {
					var self = this;
					this.loading = false;
					var item = response.body.payload;

					Vue.set(this.data, 'group_name', item.group_name);

					var trunks = item.trunks;

					trunks.forEach(function(trunk, i) {
						self.trunks.push(trunk.trunk_id);
					});

					Vue.set(this.data, 'trunks', this.trunks);

					// this.origindata = this.data;
					this.origindata = JSON.parse(JSON.stringify(this.data));

					console.log(this.trunks);
				}, function(error) {
					this.loading = false;
					console.log(error);
				});
		},
		reset: function() {
			console.log("reset");
			console.log(this.origindata);
			// this.data = this.origindata;
			this.data = JSON.parse(JSON.stringify(this.origindata));
		},
		validateBeforeSubmit() {
			console.log("validateBeforeSubmit");
			var isValidOk = true;
			this.$validator.validateAll().then(() => {

					const err = this.$validator.getErrors();
					if (err.errors.length > 0) {
						const msg = err.errors[0].field + ' field can not leave as null';
						this.setMessage({
							message: msg,
							type: 'error'
						})
						isValidOk = false;
					}
					if (isValidOk && this.data.trunks.length == 0) {
						const msg = 'Select at least one trunk';
						this.setMessage({
							message: msg,
							type: 'error'
						})
						isValidOk = false;
					}
					if (isValidOk) {
						console.log("trunk_list");
						console.log(this.trunk_list);
						this.loading = true;

						this.$http.patch(api.getEndpointUrl() + '/v1/trunk/group/' + this.id,
							{
								"group_name": this.data.group_name,
								"trunk_type": this.type,
								"all_trunks": this.data.trunks
							},
							{
								headers: {
									"X-Auth-Token": auth.getToken()
								}
							}
						).then(
							function(response) {
								console.log("success");
								this.loading = false;
								this.$router.push('/configuration/trunk_group');
								this.setMessage('The trunk group has been modified!');
							},
							function(error) {
								this.loading = false;
								console.log(error);

								this.setMessage({
									message: "Editing trunk group is failed!",
									type: 'error'
								});
							}
							)
					}
				}).catch(() => {
					// eslint-disable-next-line

				});
		},
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

.ms-container .ms-selectable,
.ms-container .ms-selection {
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

@media (max-width: 425px) {
	.el-transfer__buttons {
		display: block;
		padding: 15px 10px;
	}
	.el-transfer-panel {
		width: 100%;
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
