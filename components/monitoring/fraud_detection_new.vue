<template>
    <div class="container-fluid">
        <div class="row">
            <div class="wrapper single">
                <time-display></time-display>
                <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                        <a>Monitoring</a>
                    </li>
                    <li class="breadcrumb-item">
                        <router-link to="/monitoring/fraud_detection/default">Fraud Detection</router-link>
                    </li>
                    <li class="breadcrumb-item active">Add Fraud Detection</li>
                </ol>
                <h1 class="page-header">Add Fraud Detection</h1>
                <router-link to="/monitoring/fraud_detection/default" class="btn btn_white back">
                    <span class="dnl_icon dnl_import"></span> Back </router-link>
                <div class="white_pad configuration_pad">
                    <div class="col-md-12 col-sm-12">
                        <form class="form" @submit.prevent="validateBeforeSubmit">
                            <div class="row">
                                <div class="col-md-3 col-sm-6">
                                    <div class="form-group">
                                        <label for="alias">Rule Name:</label>
                                        <input type="text" name="alias" v-model="alias" class="form-control" placeholder="Enter Alias">
                                    </div>
                                </div>
                                <div class="clearfix"></div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label>Ingress Trunk List:</label>
                                        <!--<select multiple="multiple" id="or_trunk" name="or_trunk">
                                                <option v-for="trunk in trunk_options" :value='trunk.value'>{{trunk.text}}</option>
                                            </select>-->
                                        <el-transfer v-model="ingress_trunks" :titles="['Selectable Fields', 'Selected Fields']" :data="trunk_options">
                                        </el-transfer>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="row">
                                        <div class="col-sm-12">
                                            <label>Fraud Checking Criteria:</label>
                                        </div>
                                        <div class="clearfix little-space"></div>
                                        <div class="col-sm-6">
                                            <div class="form-group">
                                                <label for="one_hour_duration">1 Hour Minute >=</label>
                                                <input type="text" name="one_hour_duration" v-model="one_hour_duration" class="form-control" :class="{'input': true, 'is-danger': errors.has('one_hour_duration') }" v-validate="'numeric'" placeholder="Enter Minutes">
                                                <span v-show="errors.has('one_hour_duration')" class="help is-danger">{{ errors.first('one_hour_duration') }}</span>
                                            </div>
                                        </div>
                                        <div class="col-sm-6">
                                            <div class="form-group">
                                                <label for="one_hour_revenue">1 Hour Revenue >=</label>
                                                <input type="text" name="one_hour_revenue" v-model="one_hour_revenue" class="form-control" :class="{'input': true, 'is-danger': errors.has('one_hour_revenue') }" v-validate="'numeric'" placeholder="Enter Minutes">
                                                <span v-show="errors.has('one_hour_revenue')" class="help is-danger">{{ errors.first('one_hour_revenue') }}</span>
                                            </div>
                                        </div>
                                        <div class="clearfix"></div>
                                        <div class="col-sm-6">
                                            <div class="form-group">
                                                <label for="hour_24_duration">24 Hours Minute >=</label>
                                                <input type="text" name="hour_24_duration" v-model="hour_24_duration" class="form-control" :class="{'input': true, 'is-danger': errors.has('hour_24_duration') }" v-validate="'numeric'" placeholder="Enter Minutes">
                                                <span v-show="errors.has('hour_24_duration')" class="help is-danger">{{ errors.first('hour_24_duration') }}</span>
                                            </div>
                                        </div>
                                        <div class="col-sm-6">
                                            <div class="form-group">
                                                <label for="hour_24_revenue">24 Hours Revenue >=</label>
                                                <input type="text" name="hour_24_revenue" v-model="hour_24_revenue" class="form-control" :class="{'input': true, 'is-danger': errors.has('hour_24_revenue') }" v-validate="'numeric'" placeholder="Enter Minutes">
                                                <span v-show="errors.has('hour_24_revenue')" class="help is-danger">{{ errors.first('hour_24_revenue') }}</span>
                                            </div>
                                        </div>
                                        <div class="clearfix little-space"></div>
                                        <div class="col-sm-6">
                                            <div class="form-group">
                                                <div class="checkbox checkbox-success">
                                                    <input id="block_ani" name="block_ani" type="checkbox" v-model="enable_block">
                                                    <label for="block_ani">Block ANI</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="clearfix little-space"></div>
                                <div class="col-md-4 col-sm-4">
                                    <div class="form-group">
                                        <div class="checkbox checkbox-success">
                                            <input id="active" name="active" type="checkbox" v-model="enable_email">
                                            <label for="active">Send E-mail</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="clearfix"></div>
                                <div class="col-sm-12" v-if="enable_email">
                                    <label>Email to:</label>
                                    <div class="form-group">
                                        <div class="radio radio-success m-right-10">
                                            <input id="radio-1" class="radio-custom" name="duplicates" type="radio" checked>
                                            <label for="radio-1" class="radio-custom-label">Your Own NOC</label>
                                        </div>
                                        <div class="radio radio-success m-right-10">
                                            <input id="radio-2" class="radio-custom" name="duplicates" type="radio">
                                            <label for="radio-2" class="radio-custom-label">Partner’s NOC</label>
                                        </div>
                                        <div class="radio radio-success m-right-10">
                                            <input id="radio-2" class="radio-custom" name="duplicates" type="radio">
                                            <label for="radio-2" class="radio-custom-label">Both</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="clearfix"></div>
                                <div class="col-md-4 col-sm-6" v-if="enable_email">
                                    <div class="form-group">
                                        <label for="groupname">From E-mail:</label>
                                        <select2 :options="email_options" v-model="email"></select2>
                                    </div>
                                </div>
                                <div class="clearfix"></div>
                                <div class="col-md-3 col-sm-6" v-if="enable_email">
                                    <div class="form-group">
                                        <label for="max_lines">Notification Subject:</label>
                                        <input type="text" name="max_lines" v-model="max_lines" class="form-control" placeholder="Enter Notification Subject">
                                    </div>
                                </div>
                                <div class="clearfix"></div>
                                <div class="col-md-8 col-sm-8" v-if="enable_email">
                                    <label>Content:</label>
                                    <ckeditor v-model="contentA" :id="editorA" :height="'280px'"></ckeditor>
                                    <!-- <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="Please input" v-model="contentA">
                                    </el-input> -->
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
                    <div class="clearfix little-space"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>   
//  const multiselect = require('multiselect'),
const Ckeditor = require('vue!../main_components/ckeditor.vue');
const vSelect = require('vue!../main_components/select.vue');
const api = require("../../api");
const auth = require("../../auth");
_ = require('lodash');
import {mapGetters,	mapActions} from 'vuex'

module.exports = {
    components: {
        // 'multiselect': multiselect,
        'select2': vSelect,
        Ckeditor
    },
    data: function () {
        return {
            email_options: [],
            editorA: 'editor-a',
            contentA: '',
            ingress_trunks: [],
            trunk_options: [],
            orc: [],

            alias: '',
            enable_email: false,
            one_hour_duration: 0,
            hour_24_duration: 0,
            one_hour_revenue: 0,
            enable_block: true,
            mail_sender_id: 0,
            hour_24_revenue: 0,

            server_dir: '',
            pass: '',
            select: '',
            groupname: '',
            options: [
                { id: 1, value: 'carrier1', text: 'Carrier 1' },
                { id: 2, value: 'carrier2', text: 'Carrier 2' },
                { id: 3, value: 'carrier3', text: 'Carrier 3' },
                { id: 4, value: 'carrier4', text: 'Carrier 4' },
                { id: 5, value: 'carrier5', text: 'Carrier 5' }
            ],
        }
    },
    mounted: function () {
        // $('#or_trunk').multiSelect({
        //     selectableHeader: "<div class='custom-header'>Selectable Fields</div>",
        //     selectionHeader: "<div class='custom-header'>Selected Fields</div>"
        // });
    },
    methods: {
        ...mapActions({
            setAsyncConfirm: 'async_confirm/setAsyncConfirm',
            setMessage: 'app_message/setAppMessage'
        }),
        initMailFormat() {
            this.contentA = 'Fraud detection for {switch_alias} Switch\n';
            this.contentA += 'Dear {username}:\n';
            this.contentA += 'This email is to notify you of a fraud detection[{rule_name}] take effect within the class4 swicth. \n';
            this.contentA += '{client_name} {ingress_name} {type} {limit_value} {actual_value}\n';
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
				}
			})
			.catch(error => {
				console.log(error)
			})
		},
        fetchIngressTrunks(cur_page) {
			this.loading = true;
			var url;
			if(cur_page === 0)
				url = api.getEndpointUrl() + "/v1/trunk/ingress/list"
			else
				url = api.getEndpointUrl() + "/v1/trunk/ingress/list?page=" + cur_page
			console.log(url);
			this.$http.get(url)
				.then(response => {
					const body = response.body
					if (body.success) {
						var self = this;
						this.loading = false;
						const payload = body.payload
						var trunks = payload.items;
						trunks.forEach(function (temp, i) {
							var trunk = {};
							trunk.key = temp.resource_id;
							trunk.label = temp.name;
							self.trunk_options.push(trunk);
						});
						cur_page = payload.page + 1
						const totalPages = Math.ceil(payload.total / payload.per_page)

						if(totalPages > cur_page)
							this.fetchIngressTrunks(cur_page);
						
						console.log(this.trunk_options);
						console.log(this.ingress_trunks);
					}
				})
				.catch(error => {
					console.log(error)
					this.loading = false;
				})
		},
        reset() {
            this.alias = '';
            this.enable_email = false;
            this.one_hour_duration = 0;
            this.hour_24_duration = 0;
            this.one_hour_revenue = 0;
            this.hour_24_revenue = 0;
            this.enable_block = true;
            this.ingress_trunks = [];
            this.mail_sender_id = 0;
        },
		
        validateBeforeSubmit() {
            console.log("validateBeforeSubmit");
            this.$validator.validateAll().then(() => {
                console.log("validator");
                this.loading = true;

                // var ingress_trunks = [];
                // $("#or_trunk").val().forEach(function (item, i) {
                //     ingress_trunks.push(item);
                // });
                console.log("before api call");
                console.log(this.ingress_trunks);
                console.log(this.enable_email);
                console.log(this.enable_block);

                this.$http.post(api.getEndpointUrl() + '/v1/monitoring/fraud_detection',
                    {
                        "name": this.alias,
                        "enable_email": this.enable_email,
                        "one_hour_duration": this.one_hour_duration,
                        "hour_24_duration": this.hour_24_duration,
                        "one_hour_revenue": this.one_hour_revenue,
                        "hour_24_revenue": this.hour_24_revenue,
                        "enable_block": this.enable_block,
                        "ingress_trunks": this.ingress_trunks,
                        "mail_sender_id": this.mail_sender_id,
                    },
                    {
                        headers: {
                            "X-Auth-Token": auth.getToken()
                        }
                    }
                ).then(
                    function (response) {
                        console.log("success");
                        console.log(response);
                        this.loading = false;
                        this.$router.push('/monitoring/fraud_detection/default');
                        this.setMessage('The fraud detection has been created!');
                    },
                    function (error) {
						this.loading = false;
						console.log(error);

						this.setMessage({
                            message: "Creating fraud detection is failed!",
                            type: 'error'
                        });
                    }
                )
            }).catch(() => {
                // eslint-disable-next-line

            });
        },
    }, 
    created() {
        this.fetchIngressTrunks(0)
        this.getEmails()
        this.initMailFormat()
    }
}
</script>

<style>
.radio.radio-success.m-right-10 {
    margin-right: 10px;
}

.radio.radio-success.m-right-10 .radio-custom+.radio-custom-label:before {
    margin-right: 5px;
}
</style>
