<template>
	<div class="container-fluid">
      <div class="row">
		<div class="wrapper single">
			<time-display></time-display>
			<ol class="breadcrumb">
				  <li class="breadcrumb-item"><a href="#">Tools</a></li>
				  <li class="breadcrumb-item active">Call Simulation</li>
			</ol>
			<h1 class="page-header">Call Simulation</h1>
			<div class="white_pad configuration_pad">
                <spinner v-show="loading" class="spinner"></spinner>
                <form class="form" @submit.prevent="validateBeforeSubmit">
                <div v-if="showResult">
                    <div class="col-md-3 col-sm-4">
                        <label for="server">Ingress Trunk:</label>

                    </div>
                    <div class="col-md-3 col-sm-4">
                        <label for="server">Ingress Host:{{result_host}}</label>
                    </div>
                    <div class="col-md-3 col-sm-4">
                        <label for="server">Ingress ANI:{{result_ani}}</label>
                    </div>
                    <div class="col-md-3 col-sm-4">
                        <label for="server">Ingress DNIS:{{result_dnis}}</label>
                    </div>
                    <div class="col-md-3 col-sm-4">
                        <label for="server">Route Prefix:{{result_prefix}}</label>
                    </div>
                    <div class="col-md-3 col-sm-4">
                        <label for="server">Routing Plan:{{result_routing_plan}}</label>
                    </div>
                    <div class="col-md-3 col-sm-4">
                        <label for="server">Static Route:</label>
                    </div>
                    <div class="col-md-3 col-sm-4">
                        <label for="server">Dynamic Route:</label>
                    </div>
                    <div class="col-md-3 col-sm-4">
                        <label for="server">Ingress Rate:</label>
                    </div>
                    <div class="col-md-3 col-sm-4">
                        <label for="server">LRN Num:</label>
                    </div>
                    <div class="col-md-3 col-sm-4">
                        <label for="server">US Jurisdiction:</label>
                    </div>
                    <div class="col-md-3 col-sm-4">
                        <label for="server">Release Cause:</label>
                    </div>
                    <div class="col-md-12 col-sm-12" style="text-align: right">
                        <a v-on:click="detailResult" style="cursor: pointer;">
                            Show More Detail
                        </a>
                    </div>
                </div>
                <div class="col-md-3 col-sm-4">
                    <div class="form-group">
                        <label for="server">Server:</label>
                        <select class="selectable" v-model="server">
                            <option v-for="item in server_list" v-bind:value="item.id">
                                {{ item.text }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="col-md-3 col-sm-4">
                    <div class="form-group">
                        <label for="username">Ingress Trunk:</label>
                        <select class="selectable" v-model="ingress_trunk">
                            <option v-for="item in trunk_list" v-bind:value="item.id">
                                {{ item.text }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="col-md-3 col-sm-4">
                    <div class="form-group">
                        <label for="host">Host:</label>
                        <select class="selectable" v-model="host">
                            <option v-for="item in host_list" v-bind:value="item.id">
                                {{ item.text }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="col-md-3 col-sm-4">
                    <div class="form-group">
                        <label>ANI:</label>
                        <input type="text" name="ani" v-model="ani" class="form-control" :class="{'input': true, 'is-danger': errors.has('ani') }" v-validate="'required|numeric'" placeholder="Enter ANI">
                        <span v-show="errors.has('ani')" class="help is-danger">{{ errors.first('ani') }}</span>
                    </div>
                </div>
                <div class="col-md-3 col-sm-4">
                    <div class="form-group">
                        <label>DNIS:</label>
                        <input type="text" name="dnis" v-model="dnis" class="form-control" :class="{'input': true, 'is-danger': errors.has('dnis') }" v-validate="'required|numeric'" placeholder="Enter DNIS">
                        <span v-show="errors.has('dnis')" class="help is-danger">{{ errors.first('dnis') }}</span>
                    </div>
                </div>
                <div class="col-md-3 col-sm-4">
                    <div class="form-group">
                        <label>Time:</label>
                        <el-date-picker style="width: 100%;" type="datetime" v-model="time" :picker-options="{}" placeholder="Enter Date and TIme"></el-date-picker>
                    </div>
                </div>
                <div class="clearfix"></div>
                <div class="col-md-12">
                  <div class="button_set little-space">
                    <button class="btn btn-primary" type="submit">
                        Submit
                    </button>
                    <a class="btn btn-default" v-on:click="reset">
                        Reset
                    </a>
                  </div>
                </div>
				<div class="clearfix little-space"></div>
                </form>
			</div>
		</div>
	  </div>
	</div>
</template>

<script>   
	const vSelect = require('vue!../main_components/select.vue');
	const api = require("../../api");
    const auth = require("../../auth");
    _ = require('lodash');
    const vSpinner = require('vue!../main_components/fadeloader.vue');
    
	import {
		mapActions
	} from 'vuex'

	module.exports = {
        created: function(){
           this.fetchIngressTrunks()
           this.fetchServers()
        },
		components: {
			'select2': vSelect,
            'spinner': vSpinner
		},
		data: function(){
            return {
                loading: false,
                result_host: '',
                result_dnis: '',
                result_ani: '',
                showResult: false,
			  server: '127.0.0.1:4320',
              ingress_trunk: '',
              host: '',
              ani: '',
              dnis: '',
              time: '',
			  server_list: [],
              trunk_list: [],
			  host_list: [],
            }
        },
		mounted: function() {
			
        },
        watch: {
            'ingress_trunk': function () {
                var host = {};
                let index = _.findIndex(this.trunk_list, elem => elem.id  == this.ingress_trunk);
                this.host_list = [];
                var self = this;
                if (index >= 0) {
                    this.trunk_list[index].ip.forEach(function (temp, i) {
                        var host = {};
                        host.id = temp.ip;
                        host.text = temp.ip + ":" + temp.port;
                        self.host_list.push(host);
                        if(i==0)
                            self.host = host.id;
                    });
                }
                console.log(this.host_list);
            }
        },
        methods: {
			...mapActions({
				setMessage: 'app_message/setAppMessage'
            }),
            showIngressData() {
                const url = api.getEndpointUrl() + '/v1/ingress_trunk/' + this.ingress_trunk
                this.$http.get(url)
                .then(response => {
                    const body = response.body
                    if (body.success) {
                        const ingress = body.payload
                        this.result_prefix = ingress.prefix;
                        this.result_routing_plan = ingress.route_plan_id;
                        
                                       
                        
                    }
                })
                .catch(error => {
                    console.log(error)
                })
            },
            detailResult() {
            },
            fetchServers() {
                this.server_list.push({
                    id: 'class4', text: 'class4'
                })
                this.server = 'class4';
                // const url = api.getEndpointUrl() + '/v1/switch/list'
                // this.$http.get(url)
                // .then(response => {
                //     const body = response.body
                //     if (body.success) {
                //         const servers = body.payload.items
                //         var self = this;
                //         servers.forEach(function (temp, i) {
                //             var server = {};
                //             server.id = temp.id;
                //             server.text = temp.name;
                //             self.server_list.push(server);
                //             if (i == 0)
                //                 self.server = server.id;
                //         });
                //         console.log(this.server_list);
                        
                //     }
                // })
                // .catch(error => {
                //     console.log(error)
                // })
            },
            fetchIngressTrunks() {
                var per_page=1;
                var url = api.getEndpointUrl() + "/v1/trunk/ingress/list?per_page="+per_page+"&is_active=true"
                console.log(url);
                this.loading = true;

                this.$http.get(url)
                .then(response => {
                    const body = response.body
                    console.log(body);
                    if (body.success) {
                        this.loading = false;
                        per_page = body.payload.total;
                        console.log(per_page);

                        url = api.getEndpointUrl() + "/v1/trunk/ingress/list?per_page="+per_page+"&is_active=true"
                        console.log(url);
                        this.loading = true;
                        this.$http.get(url)
                        .then(response => {
                            const body = response.body
                            if (body.success) {
                                var self = this;
                                var trunks = body.payload.items

                                trunks.forEach(function (temp, i) {
                                    var option = {};
                                    option.id = temp.resource_id;
                                    option.value = temp.name;
                                    option.text = temp.name;
                                    option.ip = temp.ip;
                                    self.trunk_list.push(option);
                                    if(i==0)
                                        self.ingress_trunk = option.id;
                                });
                                this.loading = false;
                            }
                            else
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
            reset: function (){
                this.server = '';
                this.ingress_trunk = '';
                this.host = '';
                this.ani = '';
                this.dnis = '';
                this.time = '';
            },
            getCallForRequest() {
                var call_simulation = {};
                call_simulation.ingress_trunk = this.ingress_trunk;
                call_simulation.dnis = this.dnis;
                call_simulation.server = this.server;
                call_simulation.ani = this.ani;
                if(this.host != '')
                    call_simulation.ingress_host = this.host;
                if(this.time != '')
                    call_simulation.call_time = this.time.toISOString();
                console.log(call_simulation);
                return call_simulation;
            },
            saveCallSimulation() {
                this.loading = true;
                const reqBody = this.getCallForRequest();
                this.$http.post(api.getEndpointUrl() + '/v1/tool/simulate_call', reqBody)
                .then(
                    function (response) {
                        var thisvm = this;
                        this.loading = false;
                        console.log(response);
                        this.setMessage('Calling simulation is successed!');
                        this.showResult = true;
                        this.result_ani = this.ani;
                        this.result_dnis = this.dnis;
                        this.result_host = this.host;
                        this.showIngressData();

                    },
                    function (error) {
                        var thisvm = this;
                        this.loading = false;
                        console.log(error);
                        this.setMessage({
                            message:"calling simulation is failed!",
                            type:"error"
                        });
                    }
                )
            },
            validateBeforeSubmit() {
                var vm = this;
                this.$validator.validateAll().then(() => {
                    const err = vm.$validator.getErrors();
                    if (err.errors.length > 0 || this.host_list.length == 0 || this.time == '') {
                        if(this.host_list.length == 0) {
                            vm.setMessage({
                                message: 'Please select host',
                                type: 'error'
                            })    
                        }
                        else if (this.time == '') {
                            vm.setMessage({
                                message: 'Please select time',
                                type: 'error'
                            })
                        }
                        else {
                            const msg = err.errors[0].field + ' field can not leave as null';
                            vm.setMessage({
                                message: msg,
                                type: 'error'
                            })
                        }
                    }
                    else {
                        vm.saveCallSimulation();
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
            
        }
	}
</script>

<style>
	.m-top-33 {
		margin-top: 33px;
	}
	
	@media (max-width: 767px) {
		.m-top-33 {
			margin-top: 10px;
		}	
	}
</style>
