<template>
    <div class="container-fluid">
        <div class="row">
            <div class="wrapper single">
                <time-display></time-display>
                <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                        <a href="#">Routing</a>
                    </li>
                    <li class="breadcrumb-item">
                        <router-link to="/routing/trunks">Trunks</router-link>
                    </li>
                    <li class="breadcrumb-item active">Trunk Template Editor</li>
                </ol>
                <h1 class="page-header">Trunk Template Editor</h1>
                <router-link to="/routing/trunks" class="btn btn_white back">
                    <span class="dnl_icon dnl_import"></span> Back </router-link>
                <div class="white_pad">
                    <spinner v-show="loading" class="spinner"></spinner>
                    <div class="row">
                        <div class="col-md-3 col-sm-4" v-if="type=='egress'">
                            <label for="egress_name">Egress Template Name:</label>
                            <select class="selectable" v-model="egress_template">
                                <option v-for="item in egress_template_options" v-bind:value="item.id">
                                    {{ item.text }}
                                </option>
                            </select>
                        </div>
                        <div class="col-md-3 col-sm-4" v-if="type=='ingress'">
                            <label for="egress_name">Ingress Template Name:</label>
                            <select class="selectable" v-model="ingress_template">
                                <option v-for="item in ingress_template_options" v-bind:value="item.id">
                                    {{ item.text }}
                                </option>
                            </select>
                        </div>
                        <div class="col-md-3 col-sm-4" v-if="type == 'egress'">
                            <label for="egress_name">Egress Name:</label>
                            <input v-validate="'required'" type="text" name="egress_name" v-model="egress_name" class="form-control" placeholder="Enter Egress Name">
                            <span v-show="errors.has('egress_name')" class="help is-danger">{{ errors.first('egress_name') }}</span>
                        </div>
                        <div class="col-md-3 col-sm-4" v-if="type == 'ingress'">
                            <label for="egress_name">Ingress Name:</label>
                            <input v-validate="'required'" type="text" name="ingress_name" v-model="ingress_name" class="form-control" placeholder="Enter Ingress Name">
                            <span v-show="errors.has('ingress_name')" class="help is-danger">{{ errors.first('ingress_name') }}</span>
                        </div>
                        <div class="col-md-3 col-sm-4">
                            <label>Carriers:</label>
                            <select class="selectable" v-model="carriers">
                                <option v-for="item in carrier_options" v-bind:value="item.id">
                                    {{ item.text }}
                                </option>
                            </select>
                        </div>
                        <div class="col-md-3 col-sm-4">
                            <label for="call_limit">Call Limit:</label>
                            <input type="text" name="call_limit" v-model="call_limit" class="form-control" placeholder="Enter Call Limit">
                        </div>
                        <div class="clearfix little-space"></div>
                        <div class="col-md-3 col-sm-4">
                            <label>CPS Limit:</label>
                            <input type="text" name="cps_limit" v-model="cps_limit" class="form-control" placeholder="Enter CPS Limit">
                        </div>
                        <div class="col-md-3 col-sm-3">
                            <label>Active:</label>
                            <select class="selectable" v-model="active">
                                <option v-for="item in active_options" v-bind:value="item.id">
                                    {{ item.text }}
                                </option>
                            </select>
                        </div>
                        <div class="col-md-3 col-sm-4">
                            <label>Authorized:</label>
                            <select class="selectable" v-model="authorized">
                                <option v-for="item in authorized_options" v-bind:value="item.id">
                                    {{ item.text }}
                                </option>
                            </select>
                        </div>

                        <div class="clearfix little-space"></div>
                        <div class="clearfix little-space"></div>
                        <div class="col-md-12">
                            <a class="btn btn-primary mini" @click="addHost">
                                <span class="dnl_icon dnl_add"></span> Add Host
                            </a>
                            <div class="table-responsive m-top-10">
                                <table class="table table-striped table-hover carrier_groups">
                                    <thead>
                                        <tr>
                                            <th>Type</th>
                                            <th>Host</th>
                                            <th>Port</th>
                                            <th class="width-65">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(host, index) in hosts">
                                            <td>
                                                <select2 :options="host_type_options" v-model="host.type"></select2>
                                            </td>
                                            <td>
                                                <input type="text" :value="host.host" class="form-control">
                                            </td>
                                            <td>
                                                <input type="text" :value="host.port" class="form-control">
                                            </td>
                                            <td class="text-center">
                                                <a class="action action_delete center-block" data-toggle="tooltip" data-placement="top" title="Delete" @click="delete_host(index)">
                                                    <span class="dnl_icon dnl_action_delete"></span>
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="clearfix little-space"></div>
                        <div class="col-md-12" v-if="type == 'ingress'">
                            <a style="width: 300px" class="btn btn-primary mini" @click="addRouting">
                                <span class="dnl_icon dnl_add"></span> Add Routing and Tech-Prefix
                            </a>
                            <div class="table-responsive m-top-10">
                                <table class="table table-striped table-hover carrier_groups">
                                    <thead>
                                        <tr>
                                            <th>Product Name</th>
                                            <th>Tech Prefix</th>
                                            <th>Code</th>
                                            <th>CPS</th>
                                            <th>CAP</th>
                                            <th>Rate Table</th>
                                            <th>Route Plan</th>
                                            <th class="width-65">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(route, index) in routings">
                                            <td>
                                                <select class="selectable" v-model="route.product_id">
                                                    <option v-for="item in product_options" v-bind:value="item.id">
                                                        {{ item.text }}
                                                    </option>
                                                </select>
                                            </td>
                                            <td>
                                                <input type="text" :value="route.tech_prefix" class="form-control" :disabled="route.product_id != 0" v-model="route.tech_prefix">
                                            </td>
                                            <td>
                                                <input type="text" :value="route.code" class="form-control" v-model="route.code">
                                            </td>
                                            <td>
                                                <input type="text" :value="route.code_cps" class="form-control" v-model="route.code_cps">
                                            </td>
                                            <td>
                                                <input type="text" :value="route.code_cap" class="form-control" v-model="route.code_cap">
                                            </td>
                                            <td>
                                                <select class="selectable" v-model="route.rate_table_id" :disabled="route.product_id != 0">
                                                    <option v-for="item in rate_tables" v-bind:value="item.id">
                                                        {{ item.text }}
                                                    </option>
                                                </select>
                                            </td>
                                            <td>
                                                <select class="selectable" v-model="route.routing_plan_id" :disabled="route.product_id != 0">
                                                    <option v-for="item in route_plan_options" v-bind:value="item.id">
                                                        {{ item.text }}
                                                    </option>
                                                </select>
                                            </td>
                                            <td class="text-center">
                                                <a class="action action_delete center-block" data-toggle="tooltip" data-placement="top" title="Delete" @click="delete_route(index)">
                                                    <span class="dnl_icon dnl_action_delete"></span>
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                </div>
                <div class="button_set little-space">
                    <a class="btn btn-primary mini" @click="createNewByTemplate">
                        Submit
                    </a>
                    <a class="btn btn-default mini">
                        Reset
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>   
const multiselect = require('multiselect'),
    vSelect = require('vue!../main_components/select.vue');
const api = require("../../api");
const vSpinner = require('vue!../main_components/fadeloader.vue');
import { mapActions } from 'vuex';
module.exports = {
    components: {
        'multiselect': multiselect,
        'spinner': vSpinner,
        'select2': vSelect
    },
    props: ['type'],
    data: function() {
        return {
            loading: false,
            all_egress_temp: [],
            all_ingress_temp: [],
            carrier_options: [],
            host_type_options: [
                { id: 1, value: 'ip_address', text: 'IP Address' },
                { id: 2, value: 'host_name', text: 'Hostname' },
            ],
            authorized_options: [
                { id: 'All', text: 'All' },
                { id: 'Authorized by Host Only', text: 'Authorized by Host Only' },
                { id: 'Accept Egress Registration', text: 'Accept Egress Registration' },
                { id: 'Register to Egress Trunk', text: 'Register to Egress Trunk' },
            ],
            active_options: [
                { id: true, text: 'True' },
                { id: false, text: 'False' },
            ],
            ingress_template_options: [],
            ingress_template: '',
            egress_template_options: [],
            egress_template: '',
            egress_name: '',
            carriers: '',
            call_limit: '',
            cps_limit: '',
            active: true,
            authorized: 'All',
            options: [
                { id: 1, value: 'carrier1', text: 'Carrier 1' },
                { id: 2, value: 'carrier2', text: 'Carrier 2' },
                { id: 3, value: 'carrier3', text: 'Carrier 3' },
                { id: 4, value: 'carrier4', text: 'Carrier 4' },
                { id: 5, value: 'carrier5', text: 'Carrier 5' }
            ],
            hosts: [],
            routings: [],
        }
    },
    mounted: function() {
        $('#carrier').multiSelect({
            selectableHeader: "<div class='custom-header'>Codecs</div>",
            selectionHeader: "<div class='custom-header'>Selected</div>"
        });
    },
    methods: {
        delete_route: function(id) {
            this.routings.splice(id, 1);
        },
        addRouting() {
            var vm = this;
            this.routings.push({
                product_id: 0,
                tech_prefix: '',
                code: '',
                code_cps: '',
                code_cap: '',
                rate_table_id: 0,
                routing_plan_id: 0,
            });
        },
        ...mapActions({
            setMessage: 'app_message/setAppMessage'
        }),
        getEgressForRequest() {
            let index = _.findIndex(this.all_egress_temp, elem => elem.resource_template_id   === this.egress_template)
            var req_egress = {};
            if(~index) {
                if(this.all_egress_temp[index].res_strategy != null)
                    req_egress.host_routing_strategy = this.all_egress_temp[index].res_strategy;
                if (this.cps_limit != '')
                    req_egress.cps_limit = this.cps_limit;
                if (this.call_limit != '')
                    req_egress.call_limit = this.call_limit;
                req_egress.min_profit_value = this.all_egress_temp[index].profit_margin;
                var ip_list = [];
                this.hosts.forEach(function(item, i) {
                    var host = {};
                    host.ip = item.host;
                    host.port = item.port;
                    if (host.ip !== '' && host.port !== '')
                        ip_list.push(host);
                });
                req_egress.ip = ip_list;
                req_egress.authorization_type = this.authorized;
                req_egress.name = this.egress_name;
                req_egress.min_profit_type = this.all_egress_temp[index].profit_type;
                if(this.all_egress_temp[index].media_type != null)
                    req_egress.bypass_media = this.all_egress_temp[index].media_type;
                req_egress.is_active = this.active;
                if (this.all_egress_temp[index].rate_table_id != 0)
                    req_egress.rate_table_id = this.all_egress_temp[index].rate_table_id;
                // req_egress.codecs = this.all_egress_temp[index].codecs_str;
                if (this.all_egress_temp[index].min_duration == null)
                    req_egress.min_duration = 0;
                else if (this.all_egress_temp[index].min_duration != 0)
                    req_egress.min_duration = this.all_egress_temp[index].min_duration;
                if (this.all_egress_temp[index].max_duration != 0)
                    req_egress.max_duration = this.all_egress_temp[index].max_duration;
                if (this.all_egress_temp[index].ring_timeout != 0)
                    req_egress.ring_timeout = this.all_egress_temp[index].ring_timeout;
            }
            return req_egress;
        },
        getIngressForRequest() {
            let index = _.findIndex(this.all_ingress_temp, elem => elem.resource_template_id   === this.ingress_template)
            var req_ingress = {};
            if(~index) {
                if(this.all_ingress_temp[index].res_strategy != null)
                    req_ingress.host_routing_strategy = this.all_ingress_temp[index].res_strategy;
                if(this.all_ingress_temp[index].media_timeout != 0)
                    req_ingress.media_timeout = this.all_ingress_temp[index].media_timeout;
                if (this.all_ingress_temp[index].ring_timeout != 0)
                    req_ingress.ring_timeout = this.all_ingress_temp[index].ring_timeout;
                if (this.all_ingress_temp[index].max_duration != 0)
                    req_ingress.max_duration = this.all_ingress_temp[index].max_duration;
                if (this.all_ingress_temp[index].min_duration == null)
                    req_ingress.min_duration = 0;
                else if (this.all_ingress_temp[index].min_duration != 0)
                    req_ingress.min_duration = this.all_ingress_temp[index].min_duration;
                req_ingress.name = this.ingress_name;
                req_ingress.is_active = this.active;
                if (this.all_ingress_temp[index].ignore_early_media != null)
                    req_ingress.ignore_early_media = this.all_ingress_temp[index].ignore_early_media;
                if (this.all_ingress_temp[index].ignore_early_nosdp != null)
                    req_ingress.ignore_early_no_sdp = this.all_ingress_temp[index].ignore_early_nosdp;
                if (this.all_ingress_temp[index].rate_table_id != null)
                    req_ingress.rate_table_id = this.all_ingress_temp[index].rate_table_id;
                if (this.cps_limit != '')
                    req_ingress.cps_limit = this.cps_limit;
                req_ingress.auth_type = this.authorized;
                if (this.call_limit != '')
                    req_ingress.call_limit = this.call_limit;
                req_ingress.min_profit_type = this.all_ingress_temp[index].profit_type;
                req_ingress.min_profit_value = this.all_ingress_temp[index].profit_margin;

                var ip_list = [];
                this.hosts.forEach(function(item, i) {
                    var host = {};
                    host.ip = item.host;
                    host.port = item.port;
                    if (host.ip !== '' && host.port !== '')
                        ip_list.push(host);
                });
                var prefixes = [];
                this.routings.forEach(function(item, i) {
                    if (item.rate_table_id !== 0 && item.routing_plan_id !== 0) {
                        var temp = {};
                        temp.code = item.code;
                        if(item.code_cap != '' )
                            temp.code_cap = item.code_cap;
                        if(item.code_cps != '')
                            temp.code_cps = item.code_cps;
                        temp.product_id = item.product_id;
                        temp.rate_table_id = item.rate_table_id;
                        temp.routing_plan_id = item.routing_plan_id;
                        temp.tech_prefix = item.tech_prefix;
                        prefixes.push(temp);
                    }


                });
                req_ingress.prefixes = prefixes;


                req_ingress.ip = ip_list;
                if(this.all_ingress_temp[index].media_type != null)
                    req_ingress.bypass_media = this.all_ingress_temp[index].media_type;
            }

            return req_ingress;
        },
        saveTemplate() {
            var url, reqBody;
            if (this.type == 'egress') {
                url = api.getEndpointUrl() + '/v1/carrier/' + this.carriers + '/egress_trunk'
                reqBody = this.getEgressForRequest();
            }
            else {
                url = api.getEndpointUrl() + '/v1/carrier/' + this.carriers + '/ingress_trunk'
                reqBody = this.getIngressForRequest();
            }

            this.$http.post(url, reqBody)
                .then(response => {
                    if (response.body.success) {
                        this.setMessage('Trunk was created successfully');
                        var thisvm = this;
                        setTimeout(function() {
                            thisvm.$router.push('/routing/trunks');
                        }, 3000);
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
        createNewByTemplate() {
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
                else
                    vm.saveTemplate();
            })
                .catch((error) => {
                    // eslint-disable-next-line
                    console.log(error)
                    vm.setMessage({
                        message: 'Validation failed',
                        type: 'error'
                    })
                });
        },
        delete_host: function(id) {
            this.hosts.splice(id, 1);
        },
        addHost() {
            this.hosts.push({
                type: 1,
                host: '',
                port: '',
            });
        },
        fetchCarriers() {
            var per_page=1;
            var url = api.getEndpointUrl() + "/v1/carrier/list?per_page="+per_page
            this.loading = true;

            this.$http.get(url)
            .then(response => {
                const body = response.body
                if (body.success) {
                    this.loading = false;
                    per_page = body.payload.total;

                    url = api.getEndpointUrl() + "/v1/carrier/list?per_page="+per_page
                    this.loading = true;
                    this.$http.get(url)
                    .then(response => {
                        const body = response.body
                        if (body.success) {
                            var self = this;
                            var carriers = body.payload.items

                            carriers.forEach(function (temp, i) {
                                var carrier = {};
                                carrier.id = temp.client_id;
                                carrier.text = temp.name;
                                self.carrier_options.push(carrier);
                                if(i==0)
                                    self.carriers = carrier.id;
                            });
                            this.loading = false;
                            if (this.type == 'egress')
                                this.fetchEgressTemplate()
                            else if (this.type == 'ingress')
                                this.fetchIngressTemplate()
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
        fetchIngressTemplate() {
            this.loading = true;
            const url = api.getEndpointUrl() + '/v1/config/ingress_trunk_template/list'
            this.$http.get(url)
                .then(response => {
                    const body = response.body
                    if (body.success) {
                        const templates = body.payload.items
                        this.all_ingress_temp = templates;
                        var self = this;
                        templates.forEach(function(temp, i) {
                            var template = {};
                            template.id = temp.resource_template_id;
                            template.text = temp.name;
                            self.ingress_template_options.push(template);
                            if (i == 0)
                                self.ingress_template = template.id;
                        });
                    }
                    this.loading = false;
                })
                .catch(error => {
                    console.log(error)
                    this.loading = false;
                })
        },
        fetchEgressTemplate() {
            this.loading = true;
            const url = api.getEndpointUrl() + '/v1/config/egress_trunk_template/list'
            this.$http.get(url)
                .then(response => {
                    const body = response.body
                    if (body.success) {
                        const templates = body.payload.items
                        this.all_egress_temp = templates;
                        var self = this;
                        templates.forEach(function(temp, i) {
                            var template = {};
                            template.id = temp.resource_template_id;
                            template.text = temp.name;
                            self.egress_template_options.push(template);
                            if (i == 0)
                                self.egress_template = template.id;
                        });
                    }
                    this.loading = false;
                })
                .catch(error => {
                    console.log(error)
                    this.loading = false;
                })
        }
    },
    created() {
        

        this.fetchCarriers();
    }
}
</script>

<style>
a.btn.btn-primary.biggest.pull-right {
    width: 250px;
}
</style>
