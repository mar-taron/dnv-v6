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
                    <li class="breadcrumb-item active">Trunk Editor</li>
                </ol>
                <h1 class="page-header">Trunk Editor</h1>
                <router-link to="/routing/trunks" class="btn btn_white back">
                    <span class="dnl_icon dnl_import"></span> Back </router-link>
                <router-link to="/routing/trunks/new_template" class="btn btn-primary biggest pull-right">
                    <span class="dnl_icon dnl_add"></span> Create New by Template
                </router-link>
                <form class="form">
                <div class="white_pad">
                    <spinner v-show="loading" class="spinner"></spinner>
                    <div class="row">
                        <div class="col-md-3 col-sm-4">
                            <label for="name">{{this.type == 'egress'? 'Egress Name:': 'Ingress Name:'}}</label>
                            <input type="text" name="name" v-model="trunk.name" class="form-control" :class="{'input': true, 'is-danger': errors.has('name') }" v-validate="'required'" placeholder="Enter Name">
                            <span v-show="errors.has('name')" class="help is-danger">{{ errors.first('name') }}</span>
                        </div>
                        <div class="col-md-3 col-sm-4">
                            <label>Carriers:</label>
                            <!--<select2 :options="carriers" v-model="carrier"></select2>-->
                            <select class="selectable" v-model="trunk.carrier_id">
                                <option v-for="carrier in carriers" v-bind:value="carrier.id">
                                    {{ carrier.text }}
                                </option>
                            </select>
                        </div>
                        <div class="col-md-3 col-sm-4">
                            <label>Media Type:</label>
                            <!--<select2 :options="media_types" v-model="trunk.bypass_media"></select2>-->
                            <select class="selectable" v-model="trunk.bypass_media">
                                <option v-for="media_type in media_types" v-bind:value="media_type.id">
                                    {{ media_type.text }}
                                </option>
                            </select>
                        </div>
                        <div class="col-md-3 col-sm-4">
                            <div class="form-group">
                                <label for="min_profitability">Min. Profitability:</label>
                                <div class="input-group">
                                    <span class="input-group-addon">$</span>
                                    <input type="text" class="form-control" aria-label="" placeholder="Enter Min. Profitability" name="min_profitability" v-model="trunk.min_profit_value">
                                    <div class="input-group-btn">
                                        <button type="button" class="btn btn-rimary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            {{label_format}}
                                        </button>
                                        <div class="dropdown-menu dropdown-menu-right" v-model="trunk.min_profit_type">
                                            <a v-for="min_prof in min_profs" :value='min_prof.value' class="dropdown-item" v-on:click="min_prof_type=min_prof.id;label_format=min_prof.text" >{{min_prof.text}}</a>
                                            <!--<a class="dropdown-item">Value</a>-->
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 col-sm-4">
                            <label for="call_limit">Call Limit:</label>
                            <input type="text" name="call_limit" v-model="trunk.call_limit" class="form-control" :class="{'input': true, 'is-danger': errors.has('call_limit') }" v-validate="'numeric'" placeholder="Enter Call Limit">
                            <span v-show="errors.has('call_limit')" class="help is-danger">{{ errors.first('call_limit') }}</span>
                        </div>
                        <div class="col-md-3 col-sm-4">
                            <label>CPS Limit:</label>
                            <input type="text" name="cps_limit" v-model="trunk.cps_limit" class="form-control" :class="{'input': true, 'is-danger': errors.has('cps_limit') }" v-validate="'numeric'" placeholder="Enter CPS Limit">
                            <span v-show="errors.has('cps_limit')" class="help is-danger">{{ errors.first('cps_limit') }}</span>
                        </div>
                        <div class="col-md-3 col-sm-3">
                            <label>Active:</label>
                            <!--<select2 :options="status" v-model="trunk.is_active"></select2>-->
                            <select class="selectable" v-model="trunk.is_active">
                                <option v-for="item in status" v-bind:value="item.id">
                                    {{ item.text }}
                                </option>
                            </select>
                        </div>
                        <div class="col-md-3 col-sm-4">
                            <div class="checkbox checkbox-success m-top-33">
                                <input type="checkbox" v-model="trunk.t38" name="t38" id="t38">
                                <label for="t38">t38</label>
                            </div>
                        </div>
                        <div class="clearfix little-space"></div>
                        <div class="col-md-3 col-sm-4">
                            <label for="media_timeout">PDD Timeout:</label>
                            <input type="text" name="media_timeout" v-model="trunk.media_timeout" class="form-control" placeholder="Enter PDD Timeout">
                        </div>
                        <div class="col-md-3 col-sm-4">
                            <label>Multi-Host Routing Strategy:</label>
                            <!--<select2 :options="routing_strategies" v-model="trunk.host_routing_strategy"></select2>-->
                            <select class="selectable" v-model="trunk.host_routing_strategy">
                                <option v-for="routing_strategy in routing_strategies" v-bind:value="routing_strategy.id">
                                    {{ routing_strategy.text }}
                                </option>
                            </select>
                        </div>
                        <div class="col-md-3 col-sm-4">
                            <label for="min_duration">Min Duration:</label>
                            <input type="text" name="min_duration" v-model="trunk.min_duration" class="form-control" :class="{'input': true, 'is-danger': errors.has('min_duration') }" v-validate="'numeric'" placeholder="Enter Min Duration">
                            <span v-show="errors.has('min_duration')" class="help is-danger">{{ errors.first('min_duration') }}</span>
                        </div>
                        <div class="col-md-3 col-sm-4">
                            <label for="max_duration">Max Duration:</label>
                            <input type="text" name="max_duration" v-model="trunk.max_duration" class="form-control" :class="{'input': true, 'is-danger': errors.has('max_duration') }" v-validate="'required|numeric'" placeholder="Enter Max Duration">
                            <span v-show="errors.has('max_duration')" class="help is-danger">{{ errors.first('max_duration') }}</span>
                        </div>
                        <div class="clearfix little-space"></div>
                        <div class="col-md-3 col-sm-4">
                            <label>Rate Table:</label>
                            <!--<select2 :options="rate_tables" v-model="trunk.rate_table_id"></select2>-->
                            <select class="selectable" v-model="trunk.rate_table_id">
                                <option v-for="rate_table in rate_tables" v-bind:value="rate_table.id">
                                    {{ rate_table.text }}
                                </option>
                            </select>
                        </div>
                        <div class="col-md-3 col-sm-4">
                            <label for="ring_timeout">Ring Timer:</label>
                            <input type="text" name="ring_timeout" v-model="trunk.ring_timeout" class="form-control" :class="{'input': true, 'is-danger': errors.has('ring_timer') }" v-validate="'required|numeric'" placeholder="Enter Ring Timer">
                            <span v-show="errors.has('ring_timeout')" class="help is-danger">{{ errors.first('ring_timeout') }}</span>
                        </div>
                        <div class="col-md-3 col-sm-4">
                            <label>Authorized:</label>
                            <select class="selectable" v-model="trunk.auth_type">
                                <option v-for="authorization in authorizations" v-bind:value="authorization.id">
                                    {{ authorization.text }}
                                </option>
                            </select>
                        </div>
                        <div class="col-md-3 col-sm-4">
                            <div class="checkbox checkbox-success m-top-33">
                                <input type="checkbox" v-model="trunk.pass_lrn" name="checker1" id="checker1">
                                <label for="checker1">Pass LRN to Header</label>
                            </div>
                        </div>
                        <div class="clearfix little-space"></div>
                        <div class="col-md-3 col-sm-4">
                            <div class="checkbox checkbox-success m-top-33">
                                <input type="checkbox" v-model="trunk.rpid_caller_id" name="checker2" id="checker2">
                                <label for="checker2">Use RPID as Caller ID</label>
                            </div>
                        </div>
                        <div class="col-md-3 col-sm-4">
                            <div class="checkbox checkbox-success m-top-33">
                                <input type="checkbox" v-model="trunk.enfource_cid" name="enfource_cid" id="enfource_cid">
                                <label for="enfource_cid">Enforce CID Block</label>
                            </div>
                        </div>
                        <div class="col-md-3 col-sm-4" v-if="type == 'ingress'">
                            <label>Ignore Early Media:</label>
                            <select2 :options="ignore_early_media_options" v-model="trunk.ignore_early_media"></select2>
                        </div>
                         <div class="col-md-3 col-sm-4" v-if="type == 'ingress'">
                            <div class="checkbox checkbox-success m-top-33">
                                <input type="checkbox" v-model="trunk.ignore_early_no_sdp" name="ignore_early_nosdp" id="ignore_early_nosdp">
                                <label for="ignore_early_nosdp">Ignore Early NOSDP</label>
                            </div>
                        </div>

                        <div class="clearfix little-space" v-if="type == 'ingress'"></div>
                        <div class="col-md-3 col-sm-4" v-if="type == 'ingress'">
                            <div class="checkbox checkbox-success m-top-33">
                                <input type="checkbox" v-model="trunk.enable_global_404_blocking" name="enable_global_404_blocking" id="enable_global_404_blocking">
                                <label for="enable_global_404_blocking">Enable Global 404 Blocking</label>
                            </div>
                        </div>
                        <div class="clearfix little-space"></div>
                        <div class="col-sm-8">
                            <div class="form-group">
                                <!--<select multiple="multiple" id="carrier" name="carrier" v-model="codec">
                                      <option v-for="codec in codecs" :value='codec.value'>{{codec.text}}</option>
                                    </select>-->
                                <el-transfer v-model="codec" :titles="['Codecs', 'Selected Codecs']" :data="codecs">
                                </el-transfer>
                            </div>
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
                                                <select class="selectable" v-model="host.type">
													<option v-for="item in host_types" v-bind:value="item.id">
														{{ item.text }}
													</option>
												</select>
                                            </td>
                                            <td>
                                                <input type="text" :value="host.host" class="form-control" v-model="host.host">
                                            </td>
                                            <td>
                                                <input type="text" :value="host.port" class="form-control" v-model="host.port">
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
                                                <a class="action action_delete center-block" data-toggle="tooltip" data-placement="top" title="Delete" @click="delete_route(index)" >
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
                    <a class="btn btn-primary mini" @click="validateBeforeSubmit">
                        Submit
                    </a>
                    <a class="btn btn-default mini" @click="resetTrunk">
                        Reset
                    </a>
                </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>   
const multiselect = require('multiselect'),
    vSelect = require('vue!../main_components/select.vue');
const api = require("../../api");
const auth = require("../../auth");
const vSpinner = require('vue!../main_components/fadeloader.vue');
import { mapActions } from 'vuex';
module.exports = {
    components: {
        'multiselect': multiselect,
        'select2': vSelect,
        'spinner': vSpinner
    },
    props: ['type', 'id'],
    data: function () {
        return {
            ignore_early_media_options: [
                {id: 1, text: 'NONE'},
                {id: 2, text: '180 and 183'},
                {id: 3, text: '180 only'},
                {id: 4, text: '183 only'},
            ],
            req_egress: {},
            req_ingress: {},
            loading: false,
            trunk: {},
            route_plan_options: [],
            routings: [{
				product_id: 0,
				tech_prefix: '',
				code: '',
                code_cps: '',
                code_cap: '',
                rate_table_id: 0,
                routing_plan_id: 0,
			}],
            product_options: [],

            label_format: 'Percentage',
            name: '',
            carrier: null,
            carriers: [],
            media_type: 'Proxy Media + Transcoding',
            min_profitability: 0,
            call_limit: 0,
            cps_limit: 0,
            active: true,
            media_timeout: '',
            multi_host_routing_strategy: 'top-down',
            pass_lrn_header: true,
            min_duration: 0,
            max_duration: 0,
            rate_table: 0,
            ring_timer: 0,
            rpid_caller_id: false,
            authorized: 'All',
            options: [
                { id: 1, value: 'carrier1', text: 'Carrier 1' },
                { id: 2, value: 'carrier2', text: 'Carrier 2' },
                { id: 3, value: 'carrier3', text: 'Carrier 3' },
                { id: 4, value: 'carrier4', text: 'Carrier 4' },
                { id: 5, value: 'carrier5', text: 'Carrier 5' }
            ],
            hosts: [
                {
                    type: 1,
                    host: '',
                    port: ''
                }
            ],
            media_types: [
                { id: 'Proxy Media + Transcoding', text: 'Proxy Media + Transcoding' },
                { id: 'Proxy Media', text: 'Proxy Media' },
                { id: 'Bypass Media', text: 'Bypass Media' }
            ],
            status: [
                { id: true, text: 'True' },
                { id: false, text: 'False' },
            ],
            routing_strategies: [
                { id: 'top-down', text: 'top-down' },
                { id: 'round-robin', text: 'round-robin' },
            ],
            rate_tables: [],
            authorizations: [
                { id: 'All', text: 'All' },
                { id: 'Authorized by Host Only', text: 'Authorized by Host Only' },
                { id: 'Accept Egress Registration', text: 'Accept Egress Registration' },
                { id: 'Register to Egress Trunk', text: 'Register to Egress Trunk' },
            ],
            codec: [],
            codecs: [
                {  value: 1, key: 'AMR(8000)/dynamic', label: 'AMR(8000)/dynamic' },
                {  value: 2, key: 'CN(8000)', label: 'CN(8000)' },
                {  value: 3, key: 'DV14(11025)', label: 'DV14(11025)' },
                {  value: 4, key: 'DV14(22050)', label: 'DV14(22050)' },
                {  value: 5, key: 'G7221(16000 or 32000)/dynamic', label: 'G7221(16000 or 32000)/dynamic' },
                {  value: 6, key: 'G7221C(32000)/dynamic', label: 'G7221C(32000)/dynamic' },
                {  value: 7, key: 'G722(8000)', label: 'G722(8000)' },
                {  value: 8, key: 'G723(8000)', label: 'G723(8000)' },
                {  value: 9, key: 'G726-16(8000)/dynamic', label: 'G726-16(8000)/dynamic' },
                {  value: 10, key: 'G726-24(8000)/dynamic', label: 'G726-24(8000)/dynamic' },
                {  value: 11, key: 'G726-32(8000)/dynamic', label: 'G726-32(8000)/dynamic' },
                {  value: 12, key: 'G726-40(8000)/dynamic', label: 'G726-40(8000)/dynamic' },
                {  value: 13, key: 'G728(8000)', label: 'G728(8000)' },
                {  value: 14, key: 'G729(8000)', label: 'G729(8000)' },
                {  value: 15, key: 'G729a', label: 'G729a' },
                {  value: 16, key: 'G729b', label: 'G729b' },
                {  value: 17, key: 'GSM(8000)', label: 'GSM(8000)' },
                {  value: 18, key: 'iLBC/dynamic', label: 'iLBC/dynamic' },
                {  value: 19, key: 'PCMA(G711.u 8000)', label: 'PCMA(G711.u 8000)' },
                {  value: 20, key: 'PCMU(G711.a 8000)', label: 'PCMU(G711.a 8000)' },
                {  value: 21, key: 'Speex(8000, 16000 or 32000)/dynamic', label: 'Speex(8000, 16000 or 32000)/dynamic' },
                {  value: 22, key: 'telephone-event/dynamic', label: 'telephone-event/dynamic' },

            ],
            host_types: [
                { id: 1, value: 'ip_address', text: 'IP Address' },
                { id: 2, value: 'host_name', text: 'Hostname' },
            ],
            min_profs: [
                { id: 'percentage', value: 'percentage', text: '%' },
                { id: 'value', value: 'value', text: 'Value' },
            ],
            min_prof_type: 'percentage',
        }
    },
    mounted: function () {
        $('#carrier').multiSelect({
            selectableHeader: "<div class='custom-header'>Codecs</div>",
            selectionHeader: "<div class='custom-header'>Selected</div>"
        });
    },
    created: function () {
        this.fetchCarriers();
    },
    methods: {
        ...mapActions({
			setMessage: 'app_message/setAppMessage'
        }),
        fetchRoutePlans() {
            const url = api.getEndpointUrl() + '/v1/route/plan/list'
            this.$http.get(url)
            .then(response => {
                const body = response.body
                if (body.success) {
                    const route_plans = body.payload.items
                    var self = this;
                    route_plans.forEach(function (temp, i) {
                        var route_plan = {};
                        route_plan.id = temp.route_plan_id;
                        route_plan.text = temp.name;
                        self.route_plan_options.push(route_plan);
                    });
                    console.log(this.route_plan_options);
                    
                }
            })
            .catch(error => {
                console.log(error)
            })
        },
        resetTrunk() {
            this.trunk = {};
            this.hosts = [];
            this.codec = [];
        },
        fetchTrunk() {
            this.loading = true;
            var url;
            if(this.type=='egress')
                url = api.getEndpointUrl() + '/v1/egress_trunk/' + this.id;
            else
                url = api.getEndpointUrl() + '/v1/ingress_trunk/' + this.id;
            this.$http.get(url,
            {
                headers: {
                    "X-Auth-Token": auth.getToken()
                }
            })
            .then(response => {
                if (response.body.success) {
                    this.loading = false;
                    this.trunk = response.body.payload;
                    console.log("trunk")
                    console.log(this.trunk);

                    var self = this;
                    this.hosts = [];
                    this.trunk.ip.forEach(function(item, i) {
                        var host = {};
                        host.type = 1;
                        host.host = item.ip;
                        host.port = item.port;
                        self.hosts.push(host);
                    });
                    var vm = this;
                    if(typeof this.trunk.prefixes !== 'undefined') {
                        this.trunk.prefixes.forEach(function(item, i) {
                            var route = {};
                            route.product_id = 0;
                            route.tech_prefix = item.tech_prefix;
                            route.code = item.code;
                            route.code_cps = item.code_cps;
                            route.code_cap = item.code_cap;
                            route.rate_table_id = item.rate_table_id;
                            route.routing_plan_id = item.routing_plan_id;
                            if(i == 0)
                                vm.routings = [];
                            vm.routings.push(route);
                        })
                    }
                }
            })
            .catch(error => {
                this.loading = false;
                console.log(error);
            })
        },
        fetchProducts() {
            this.loading = true;
            const url = api.getEndpointUrl() + '/v1/product/list'
            this.$http.get(url)
            .then(response => {
                const body = response.body
                if (body.success) {
                    const products = body.payload.items
                    var self = this;
                    this.product_options = [];
                    this.product_options.push({
                        id: 0,
                        text: 'By Rate and Route Plan',
                    });
                    products.forEach(function (temp, i) {
                        var product = {};
                        product.id = temp.id;
                        product.text = temp.name;
                        self.product_options.push(product);                        
                    });
                    console.log(this.product_options);
                    
                }
                this.loading = false;
            })
            .catch(error => {
                console.log(error)
                this.loading = false;
            })
        },
        fetchRateTable() {
            var per_page=1;
            var url = api.getEndpointUrl() + "/v1/switch/rate_table/list?per_page="+per_page
            this.loading = true;

            this.$http.get(url)
            .then(response => {
                const body = response.body
                if (body.success) {
                    this.loading = false;
                    per_page = body.payload.total;

                    url = api.getEndpointUrl() + "/v1/switch/rate_table/list?per_page="+per_page
                    this.loading = true;
                    this.$http.get(url)
                    .then(response => {
                        const body = response.body
                        if (body.success) {
                            var self = this;
                            var rate_tables = body.payload.items

                            this.rate_tables.push({id: 0, text: ''});
                            rate_tables.forEach(function (temp, i) {
                                var rate_table = {};
                                rate_table.id = temp.rate_table_id;
                                rate_table.text = temp.name;
                                self.rate_tables.push(rate_table);
                            });
                            if(this.type == 'ingress'){
                                this.fetchRoutePlans();
                                this.fetchProducts();
                            }
                            this.fetchTrunk();
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
        delete_route: function(id) {
            this.routings.splice(id, 1);
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

                            this.carriers.push({id: '', text: ''});
                            carriers.forEach(function (temp, i) {
                                var carrier = {};
                                carrier.id = temp.client_id;
                                carrier.text = temp.name;
                                self.carriers.push(carrier);
                            });
                            this.fetchRateTable();
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
        addRouting() {
            var vm = this;
            this.routings.push({
				product_id: 0,
				tech_prefix: '',
				code: '',
                code_cps: '',
                code_cap: '',
                rate_table_id: vm.rate_tables.length>0? vm.rate_tables[0].id: 0,
                routing_plan_id: vm.route_plan_options.length>0? vm.route_plan_options[0].id: 0,
			});
        },
        delete_host: function(id){
			this.hosts.splice(id, 1);
		},
        addHost () {
            this.hosts.push({
				type: 1,
				host: '',
				port: '',
			});
        },
        getEgressForRequest() {
            var ip_list = [];
            this.hosts.forEach(function (item, i) {
                var host = {};
                host.ip = item.host;
                host.port = item.port;
                if(host.ip !== '' && host.port !== '')
                    ip_list.push(host);
            });
            this.req_egress.ip = ip_list;

            this.req_egress.ring_timeout = this.trunk.ring_timeout;
            if(this.trunk.enfource_cid != null)
                this.req_egress.enfource_cid = this.trunk.enfource_cid;
            if (this.trunk.call_limit != '' && this.trunk.call_limit != null)
                this.req_egress.call_limit = this.trunk.call_limit;
            this.req_egress.is_active = this.trunk.is_active;
            if(this.trunk.max_duration != '')
                this.req_egress.max_duration = this.trunk.max_duration;
            if(this.codec.length != 0)
                this.req_egress.codecs = this.codec;
            if(this.trunk.media_timeout != null && this.trunk.media_timeout != '')
                this.req_egress.media_timeout = this.trunk.media_timeout;
            this.req_egress.name = this.trunk.name;
            if(this.trunk.cps_limit != '' && this.trunk.cps_limit != null)
                this.req_egress.cps_limit = this.trunk.cps_limit;
            this.req_egress.bypass_media = this.trunk.bypass_media;
            //   this.req_egress.rpid_id_type = this.trunk.rpid_caller_id;
            this.req_egress.min_profit_type = this.trunk.min_profit_type;
            // this.req_egress.media_type = this.media_type;
            
            if(typeof this.trunk.rate_table_id !== 'undefined')
                this.req_egress.rate_table_id = this.trunk.rate_table_id;
            if(this.trunk.min_duration != '')
                this.req_egress.min_duration = this.trunk.min_duration;
            this.req_egress.pass_lrn = this.trunk.pass_lrn;
            //   this.req_egress.codes = [
            //         "string"
            //     ],
            this.req_egress.host_routing_strategy = this.trunk.host_routing_strategy;
            // this.req_egress.authorization_type = this.trunk.auth_type;
            // this.req_egress.route_plan_id = this.trunk.route_plan_id;
            this.req_egress.t38 = this.trunk.t38;
            this.req_egress.prefix = this.trunk.prefix;
            this.req_egress.min_profit_value = this.trunk.min_profit_value;

            return this.req_egress;
        },
        getIngressForRequest () {
            this.req_ingress.host_routing_strategy = this.trunk.host_routing_strategy;
            if(this.trunk.media_timeout != null)
                this.req_ingress.media_timeout = this.trunk.media_timeout;
            this.req_ingress.ring_timeout = this.trunk.ring_timeout;
            this.req_ingress.max_duration = this.trunk.max_duration;
            if(this.trunk.min_duration != null)
                this.req_ingress.min_duration = this.trunk.min_duration;
            if(this.trunk.call_limit != null)
                this.req_ingress.call_limit = this.trunk.call_limit;
            this.req_ingress.min_profit_type = this.trunk.min_profit_type;
            //   this.req_ingress.prefix = "string",
            var prefixes = [];
            this.routings.forEach(function (item, i) {
                if(item.rate_table_id !== 0 && item.routing_plan_id !== 0)
                    prefixes.push(item);

            });
            this.req_ingress.prefixes = prefixes;
            this.req_ingress.rate_table_id = this.trunk.rate_table_id;
            this.req_ingress.enable_global_404_blocking = this.trunk.enable_global_404_blocking;
            var ip_list = [];
            this.hosts.forEach(function (item, i) {
                var host = {};
                host.ip = item.host;
                host.port = item.port;
                if(host.ip !== '' && host.port !== '')
                    ip_list.push(host);
            });
            this.req_ingress.ip = ip_list;
            this.req_ingress.is_active = this.trunk.is_active;
            this.req_ingress.ignore_early_media = this.trunk.ignore_early_media;
            this.req_ingress.ignore_early_no_sdp = this.trunk.ignore_early_no_sdp;
            this.req_ingress.min_profit_value = this.trunk.min_profit_value;
            this.req_ingress.enfource_cid = this.trunk.enfource_cid;
            this.req_ingress.t38 = this.trunk.t38;
            this.req_ingress.name = this.trunk.name;
            this.req_ingress.auth_type = this.trunk.auth_type;  
            if(this.trunk.cps_limit != null)
                this.req_ingress.cps_limit = this.trunk.cps_limit;
            this.req_ingress.bypass_media = this.trunk.bypass_media;
            return this.req_ingress;
        },
        saveTrunk() {
            this.loading = true;
            var ip_list = [];
            this.hosts.forEach(function (item, i) {
                var host = {};
                host.ip = item.host;
                host.port = item.port;
                if(host.ip !== '' && host.port !== '')
                    ip_list.push(host);
            });
            var url, reqBody;
            if(this.type == 'egress') {
                url = api.getEndpointUrl() + '/v1/egress_trunk/' + this.id
                reqBody = this.getEgressForRequest();
            }
            else if(this.type == 'ingress'){
                url = api.getEndpointUrl() + '/v1/ingress_trunk/' + this.id
                reqBody = this.getIngressForRequest();
            }
            this.$http.patch(url, reqBody)
            .then(response => {
                if (response.body.success) {
                    this.setMessage('Trunk was changed successfully');
                    var thisvm = this;
                    setTimeout(function(){
                        thisvm.$router.push('/routing/trunks');
                    }, 3000);
                }
                this.loading = false;
            })
            .catch(error => {
                console.log(error)
                this.setMessage({
                    message: 'Failed to change trunk',
                    type: 'error'
                })
                this.loading = false;
            })	
        },
        validateBeforeSubmit() {
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
                    vm.saveTrunk();
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
a.btn.btn-primary.biggest.pull-right {
    width: 250px;
}
</style>
