<template>
    <div class="container-fluid">
        <div class="row">
            <div class="wrapper single">
                <time-display></time-display>
                <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                        <a href="#">Monitoring</a>
                    </li>
                    <li class="breadcrumb-item">
                        <router-link to="/monitoring/rule">Rule</router-link>
                    </li>
                    <li class="breadcrumb-item active">Rule Editor</li>
                </ol>
                <h1 class="page-header">New Rule</h1>
                <router-link to="/monitoring/rule" class="btn btn_white back">
                    <span class="dnl_icon dnl_import"></span> Back </router-link>
                <dtabs class="user_tabs wizard_steps">
                    <tab label="Define Monitoring Scope" class="" p="STEP 1" icon="dnl_icon dnl_modem" selected>
                        <div class="row">
                            <form class="form" @submit.prevent="toStep2">
                                <div class="col-md-3 col-sm-4">
                                    <div class="form-group">
                                        <label>Monitoring Rule Name:</label>
                                        <input type="text" name="monitoring_rule_name" v-model="monitoring_rule_name" class="form-control" v-validate="'required'" placeholder="Enter Monitoring Rule Name">
                                        <span v-show="errors.has('monitoring_rule_name')" class="help is-danger">{{ errors.first('monitoring_rule_name') }}</span>
                                        <!-- <input type="text" name="monitoring_rule_name" v-model="monitoring_rule_name" class="form-control" :class="{ 'input': true, 'is-danger': errors.has('monitoring_rule_name') }" v-validate:monitoring_rule_name="'required'" data-vv-as="Monitoring Rule Name" placeholder="Enter Monitoring Rule Name">
                                        <span v-show="errors.has('monitoring_rule_name')" class="help is-danger">{{ errors.first('monitoring_rule_name') }}</span> -->
                                    </div>
                                </div>
                                <div class="col-md-3 col-sm-4">
                                    <div class="form-group">
                                         <label>Monitoring on:</label>
                                        <select class="selectable" v-model="monitoring_on">
                                            <option v-for="item in monitoring_options" v-bind:value="item.id">
                                                {{ item.text }}
                                            </option>
                                        </select>
                                     </div>
                                </div>
                                <div class="clearfix"></div>
                                <div class="col-md-6 col-sm-8">
                                    <div class="form-group">
                                        <label for="groupname">Trunk List:</label>
                                        <el-transfer v-model="trunks" :titles="['Optional Selection', 'Selected Selection']" :data="trunk_options">
                                        </el-transfer>
                                    </div>
                                </div>
                                <div class="clearfix"></div>
                                <div class="col-md-3 col-sm-4">
                                    <div class="form-group">
                                         <label>Include:</label>
                                        <select class="selectable" v-model="include">
                                            <option v-for="item in include_options" v-bind:value="item.id">
                                                {{ item.text }}
                                            </option>
                                        </select>
                                     </div>
                                </div>
                                <div class="col-md-3 col-sm-4" v-if="include=='specific codes'">
                                    <div class="form-group">
                                        <label class="m-top-15"></label>
                                        <input type="text" name="include_code" v-model="include_code" class="form-control" v-validate="'required'" placeholder="Separated by ','">
                                        <span v-show="errors.has('include_code')" class="help is-danger">{{ errors.first('include_code') }}</span>
                                    </div>
                                </div>
                                <div class="clearfix"></div>
                                <div class="col-md-3 col-sm-4">
                                    <div class="form-group">
                                        <label>Exclude:</label>
                                        <select class="selectable" v-model="exclude">
                                            <option v-for="item in exclude_options" v-bind:value="item.id">
                                                {{ item.text }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-3 col-sm-4" v-if="exclude=='specific codes'">
                                    <div class="form-group">
                                        <label class="m-top-15"></label>
                                        <input type="text" name="exclude_code" v-model="exclude_code" class="form-control" v-validate="'required'" placeholder="Separated by ','">
                                        <span v-show="errors.has('exclude_code')" class="help is-danger">{{ errors.first('exclude_code') }}</span>
                                    </div>
                                </div>
                                <div class="clearfix"></div>
                                <div class="col-md-3 col-sm-4">
                                    <div class="form-group">
                                        <label>Scope:</label>
                                        <select class="selectable" v-model="scope">
                                            <option v-for="item in scope_options" v-bind:value="item.id">
                                                {{ item.text }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div class="clearfix little-space"></div>
                                <div class="col-md-3 col-sm-4">
                                    <button class="btn btn-primary" type="submit">
                                        Next
                                    </button>
                                    <!--<a class="btn btn-primary mini">Next</a>-->
                                </div>
                            </form>
                        </div>
                    </tab>
                    <tab label="Define Condition" class="" p="STEP 2" icon="dnl_icon dnl_setting" @click="toStep2">
                        <div class="col-md-3 col-sm-4">
                            <div class="form-group fix-select">
                                <label>Monitor Data by:</label>
                                <select2 :options="monitor_data_by_options" v-model="monitor_data_by" class="inline-block">
                                </select2>
                            </div>
                        </div>
                        <div class="col-md-3 col-sm-4">
                            <div class="form-group fix-select">
                                <label>ACD:</label>
                                <select2 :options="condition_options" v-model="acd" class="inline-block">
                                </select2>
                            </div>
                        </div>
                        <div class="col-md-3 col-sm-4">
                            <div class="form-group fix-select">
                                <label>ASR:</label>
                                <select2 :options="condition_options" v-model="asr" class="inline-block">
                                </select2>
                            </div>
                        </div>
                        <!-- <div class="col-md-3 col-sm-4">
                            <div class="form-group fix-select">
                                <label>ABR:</label>
                                <select2 :options="condition_options" v-model="abr" class="inline-block">
                                </select2>
                            </div>
                        </div> -->
                        <div class="col-md-3 col-sm-4">
                            <div class="form-group fix-select">
                                <label>PDD:</label>
                                <select2 :options="condition_options" v-model="pdd" class="inline-block">
                                </select2>
                            </div>
                        </div>
                        <div class="col-md-3 col-sm-4">
                            <div class="form-group fix-select">
                                <label>Profitability:</label>
                                <select2 :options="condition_options" v-model="profitability" class="inline-block">
                                </select2>
                            </div>
                        </div>
                        <div class="col-md-3 col-sm-4">
                            <div class="form-group fix-select">
                                <label>Revenue:</label>
                                <select2 :options="condition_options" v-model="revenue" class="inline-block">
                                </select2>
                            </div>
                        </div>
                        <div class="col-md-3 col-sm-4">
                            <div class="form-group">
                                <label>Min Call Attempt:</label>
                                <input type="text" name="min_call_attempt" v-model="min_call_attempt" class="form-control" v-validate="'required'" placeholder="Enter Min Call Attempt">
                                <span v-show="errors.has('min_call_attempt')" class="help is-danger">{{ errors.first('min_call_attempt') }}</span>
                                <!-- <input type="text" name="min_call_attempt" v-model="min_call_attempt" class="form-control" :class="{ 'input': true, 'is-danger': errors.has('min_call_attempt') }" v-validate="'required|numeric'" data-vv-as="Min Call Attempt" placeholder="Enter Min Call Attempt">
                                <span v-show="errors.has('min_call_attempt')" class="help is-danger">{{ errors.first('min_call_attempt') }}</span> -->
                            </div>
                        </div>
                        <div class="clearfix little-space"></div>
                        <div class="col-md-6 col-sm-6 col-xs-12">
                            <a class="btn btn-default mini min" @click="toStep1">Previous</a>
                            <a class="btn btn-primary mini" @click="toStep3">Next</a>
                        </div>
                        <div class="clearfix"></div>
                    </tab>
                    <tab label="Define Frequency And Sample Size" class="" p="STEP 3" icon="dnl_icon dnl_tick">
                        <div class="col-md-3 col-sm-4">
                            <div class="form-group fix-select">
                                <label>Execution Schedule:</label>
                                <select2 :options="schedule_options" v-model="execution_schedule" class="inline-block">
                                </select2>
                            </div>
                        </div>
                        <div class="col-md-3 col-sm-4">
                            <div class="form-group">
                                <label>Sample Size:</label>
                                <input type="text" name="sample_size" v-model="sample_size" class="form-control" v-validate="'required'" placeholder="Enter Sample Size">
                                <span v-show="errors.has('sample_size')" class="help is-danger">{{ errors.first('sample_size') }}</span>
                                <!-- <input type="text" name="sample_size" v-model="sample_size" class="form-control" :class="{ 'input': true, 'is-danger': errors.has('sample_size') }" v-validate:sample_size="'required'" data-vv-as="Sample Size" placeholder="Enter Sample Size">
                                <span v-show="errors.has('sample_size')" class="help is-danger">{{ errors.first('sample_size') }}</span> -->
                            </div>
                        </div>
                        <div class="clearfix little-space"></div>
                        <div class="col-md-6 col-sm-6 col-xs-12">
                            <a class="btn btn-default mini min" @click="toStep2">Previous</a>
                            <a class="btn btn-primary mini" @click="toStep4">Next</a>
                        </div>
                        <div class="clearfix"></div>
                    </tab>
                    <tab label="Define Action" class="" p="STEP 4" icon="dnl_icon dnl_badges">
                        <div class="col-md-4 col-sm-4">
                            <div class="form-group">
                                <div class="checkbox checkbox-success">
                                    <input id="active" name="active" type="checkbox" v-model="active">
                                    <label for="active">Active</label>
                                </div>
                            </div>
                        </div>
                        <div class="clearfix little-space"></div>
                        <div class="col-md-4 col-sm-4">
                            <div class="form-group">
                                <div class="checkbox checkbox-success">
                                    <input id="block" name="block" type="checkbox" v-model="block">
                                    <label for="block">Block</label>
                                </div>
                            </div>
                        </div>
                        <div class="clearfix"></div>
                        <div class="col-md-3 col-sm-4" v-if="block">
                            <div class="form-group fix-select">
                                <label>Enable Auto-Unblock:</label>
                                <select2 :options="auto_options" v-model="auto_unblock" class="inline-block">
                                </select2>
                            </div>
                        </div>
                        <div class="col-md-3 col-sm-4" v-if="block">
                            <div class="form-group">
                                <label>Unblock After (mins):</label>
                                <input type="text" name="unblock_after" v-model="unblock_after" class="form-control" v-validate="'required'" placeholder="Enter Minutes">
                                <span v-show="errors.has('unblock_after')" class="help is-danger">{{ errors.first('unblock_after') }}</span>
                                <!-- <input type="text" name="unblock_after" v-model="unblock_after" class="form-control" :class="{ 'input': true, 'is-danger': errors.has('unblock_after') }" v-validate="'required|numeric'" data-vv-as="Unblock After Minutes" placeholder="Enter Minutes">
                                <span v-show="errors.has('unblock_after')" class="help is-danger">{{ errors.first('unblock_after') }}</span> -->
                            </div>
                        </div>
                        <div class="clearfix little-space"></div>
                        <div class="col-md-4 col-sm-4">
                            <div class="form-group">
                                <div class="checkbox checkbox-success">
                                    <input id="send_email" name="send_email" type="checkbox" v-model="send_email">
                                    <label for="send_email">Send E-mail</label>
                                </div>
                            </div>
                        </div>
                        <div class="clearfix"></div>
                        <div class="col-md-3 col-sm-6" v-if="send_email">
                            <div class="form-group fix-select">
                                <label for="max_lines">From E-mail:</label>
                                <select2 :options="from_email_options" v-model="from_email"></select2>
                            </div>
                        </div>
                        <div class="col-md-3 col-sm-6" v-if="send_email">
                            <div class="form-group fix-select">
                                <label for="max_lines">Send to:</label>
                                <select2 :options="sendto_options" v-model="send_to"></select2>
                            </div>
                        </div>
                        <div class="clearfix" v-if="send_email"></div>
                        <div class="col-md-8 col-sm-8" v-if="send_email">
                            <div class="form-group">
                                <label for="max_lines">Subject:</label>
                                <input type="text" name="max_lines" v-model="subject" class="form-control" placeholder="Enter Subject">
                            </div>
                        </div>
                        <div class="clearfix" v-if="send_email"></div>
                        <div class="col-md-8 col-sm-8" v-if="send_email">
                            <label>Content:</label>
                            <ckeditor v-model="contentA" :id="editorA" :height="'280px'"></ckeditor>
                            <!-- <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="Please input" v-model="contentA">
                            </el-input> -->
                        </div>
                        <div class="col-md-12 m-top-20" v-if="send_email">
                            <div class="form-group tags">
                                <label for="groupname">Tags:</label>
                                <span class="label label-default" @click="clickedMonitorResTag">#monitoring_result</span>
                                <span class="label label-default" @click="clickedCodeTag">#code</span>
                                <span class="label label-default" @click="clickedRuleNameTag">#rule_name</span>
                                <span class="label label-default" @click="clickedLimitTableTag">#limit_table</span>
                                <span class="label label-default" @click="clickedRuleSetupTag">#rule_setup</span>
                                <span class="label label-default" @click="clickedBlockListTag">#block_list</span>
                                <span class="label label-default" @click="clickedTotalCallsTag">#total_calls</span>
                                <span class="label label-default" @click="clickedStartTimeTag">#sample_start_time</span>
                                <span class="label label-default" @click="clickedEndTimeTag">#sample_end_time</span>
                            </div>
                        </div>
                        <div class="clearfix little-space"></div>
                        <div class="col-md-6 col-sm-6 col-xs-12 m-top-25">
                            <a class="btn btn-default mini min" @click="toStep3">Previous</a>
                            <a class="btn btn-primary mini" @click="validateForRule">Finish</a>
                        </div>
                        <div class="clearfix"></div>
                    </tab>
                </dtabs>
            </div>
        </div>
    </div>
</template>

<script>   
const vTab = require('vue!../main_components/tab.vue'),
    vDTab = require('vue!../main_components/disable_tabs.vue'),
    vSelect = require('vue!../main_components/select.vue'),
    Pagination = require('vue!../main_components/pagination.vue'),
    multiselect = require('multiselect'),
    Ckeditor = require('vue!../main_components/ckeditor.vue');
const api = require("../../api");
const auth = require("../../auth");
_ = require('lodash');
import {mapGetters,	mapActions} from 'vuex'

module.exports = {
    components: {
        'tab': vTab,
        'dtabs': vDTab,
        'select2': vSelect,
        'pagination': Pagination,
        'multiselect': multiselect,
        Ckeditor
    },
    data: function () {
        return {
            include_code: '',
            exclude_code: '',
            scope: 'Disable Entire Trunk',
            scope_options: [
                {id: 'Disable Entire Trunk', text: 'Disable Entire Trunk'},
                {id: 'Disable Specific Code', text: 'Disable Specific Code'},
                {id: 'Disable Specific Code Name', text: 'Disable Specific Code Name'},

            ],
            send_email: false,
            block: false,
            active: '1',
            editorA: 'editor-a',
            contentA: '',
            monitoring_rule_name: '',
            monitoring_on: 'egress trunks',
            include: 'all codes',
            exclude: 'null',
            monitor_data_by: 'Trunk',
            acd: '1',
            asr: '1',
            // abr: '1',
            pdd: '1',
            profitability: '1',
            revenue: '1',
            min_call_attempt: '',
            execution_schedule: 'never',
            sample_size: '',
            from_email: 0,
            subject: '',
            send_to: 'Own NOC Email',
            auto_unblock: false,
            unblock_after: '',
            from_email_options: [
                {id: 0, value: 'Default', text: 'Default'},
            ],
            sendto_options: [
                {id: 'Own NOC Email', value: 'Your Own NOC Email', text: 'Your Own NOC Email'},
                {id: 'Partner NOC Email', value: 'Partner’s NOC Email', text: 'Partner’s NOC Email'},
                {id: 'Both', value: 'Both', text: 'Both'},
            ],
            auto_options: [
                {id: false, value: 'No', text: 'No'},
                {id: true, value: 'Yes', text: 'Yes'},
            ],
            schedule_options: [
                {id: 'never', value: 'Never', text: 'Never'},
                {id: 'Every Specific Minutes', value: 'Every Specific Minutes', text: 'Every Specific Minutes'},
                {id: 'Daily', value: 'Daily', text: 'Daily'},
                {id: 'Weekly', value: 'Weekly', text: 'Weekly'},
            ],
            condition_options: [
                { id: '1', value: 'Ignore', text: 'Ignore' },
                { id: '>', value: '>', text: '>' },
                { id: '<', value: '<', text: '<' },
                { id: '=', value: '=', text: '=' },
            ],
            monitor_data_by_options: [
                { id: 'Trunk', value: 'Trunk', text: 'Trunk' },
                { id: 'Trunk And DNIS', value: 'Trunk And DNIS', text: 'Trunk And DNIS' },
                { id: 'Trunk And ANI', value: 'Trunk And ANI', text: 'Trunk And ANI' },
                { id: 'DNIS', value: 'DNIS', text: 'DNIS' },
                { id: 'ANI', value: 'ANI', text: 'ANI' },
                { id: 'Trunk And Destination', value: 'Trunk And Destination', text: 'Trunk And Destination' },
                { id: 'Trunk And Country', value: 'Trunk And Country', text: 'Trunk And Country' },
                { id: 'Trunk And Code', value: 'Trunk And Code', text: 'Trunk And Code' },
            ],
            include_options: [
                { id: 'all codes', value: 'all codes', text: 'all codes' },
                { id: 'specific codes', value: 'specific codes', text: 'specific codes' },
            ],
            exclude_options: [
                { id: 'null', value: 'null', text: 'null' },
                { id: 'specific codes', value: 'specific codes', text: 'specific codes' },
            ],
            monitoring_options: [
                { id: 'egress trunks', value: 'egress trunks', text: 'egress trunks' },
                { id: 'ingress trunks', value: 'ingress trunks', text: 'ingress trunks' },
            ],
            trunk_list: [],
            trunk_options: [],
            egress_trunk_options: [],
            ingress_trunk_options: [],
            trunks: [],
            step: 1,
            requestForm: {},
        }
    },
    watch: {
        'monitoring_on': function () {
            if(this.monitoring_on == 'egress trunks')
                this.trunk_options = this.egress_trunk_options;
            else
                this.trunk_options = this.ingress_trunk_options;
            console.log(this.trunk_options);
        }
    },
    methods: {
        ...mapActions({
            setAsyncConfirm: 'async_confirm/setAsyncConfirm',
            setMessage: 'app_message/setAppMessage'
        }),
        clickedEndTimeTag() {
            console.log("clickedEndTimeTag");
            this.contentA += '{sample_end_time}';
        },
        clickedStartTimeTag() {
            console.log("clickedStartTimeTag");
            this.contentA += '{sample_start_time}';
        },
        clickedTotalCallsTag() {
            console.log("clickedTotalCallsTag");
            this.contentA += '{total_calls}';
        },
        clickedBlockListTag() {
            console.log("clickedBlockListTag");
            this.contentA += '{block_list}';
        },
        clickedRuleSetupTag() {
            console.log("clickedRuleSetupTag");
            this.contentA += '{rule_setup}';
        },
        clickedLimitTableTag() {
            console.log("clickedLimitTableTag");
            this.contentA += '{limit_table}';
        },
        clickedRuleNameTag() {
            console.log("clickedRuleNameTag");
            this.contentA += '{rule_name}';
        },
        clickedCodeTag() {
            console.log("clickedCodeTag");
            this.contentA += '{code}';
        },
        clickedMonitorResTag() {
            console.log("clickedMonitorResTag");
            this.contentA += '{monitoring_result}';
        },
        activateTab(tab) {
            if (tab.name == "Define Monitoring Scope") {
                console.log("Define Monitoring Scope");
            } else if (tab.name == "Define Condition") {
                console.log("Define Condition");
            } else if (tab.name == "Define Frequency And Sample Size") {
                console.log("Define Frequency And Sample Size");

            } else if (tab.name == "Define Action") {
                console.log("Define Action");

            }
        },
        selectTab(index) {
            console.log("selectTab");
            var tabList = document.querySelectorAll('.tab');
            console.log(tabList);
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
        createRule() {
            this.loading = true;

            this.requestForm.activate = this.active;
            if(this.block) {
                this.requestForm.auto_unblock = this.auto_unblock;
                this.requestForm.auto_unblock_after = this.unblock_after;
            }
            this.requestForm.send_email = this.send_email;
            this.requestForm.from_mail_id = this.from_email;
            this.requestForm.send_to = this.send_to;
            this.requestForm.subject = this.subject;
            this.requestForm.html_content = this.contentA;
            this.requestForm.scope = this.scope;
            this.requestForm.run_on = 0;
            this.requestForm.run_every = this.run_every;
            this.requestForm.min_attempt = this.min_call_attempt;
            this.requestForm.name = this.monitoring_rule_name;
            this.requestForm.profitability_operator = this.profitability;
            this.requestForm.schedule = this.execution_schedule;
            if(this.exclude != 'null') {
                this.requestForm.exclude_codes = this.exclude_code.split(",").map(function(item) {
                    return Number(item.trim());
                });
            }
            this.requestForm.acd_operator = this.acd;
            this.requestForm.sample_period = this.sample_size;
            this.requestForm.block = this.block;
            this.requestForm.run_day_of_week = 0;
            this.requestForm.acd_value = 0;
            this.requestForm.asr_value = 0;
            this.requestForm.trunks = this.trunks;
            this.requestForm.asr_operator = this.asr;
            this.requestForm.monitor_ingress = true;
            this.requestForm.profitability_value = 0;
            this.requestForm.revenue_operator = this.revenue;
            this.requestForm.pdd_operator = this.pdd;
            this.requestForm.revenue_value = 0;
            this.requestForm.all_trunks = true;
            this.requestForm.pdd_value = 0;

            console.log(this.requestForm);


            this.$http.post(api.getEndpointUrl() + '/v1/monitoring/rule', this.requestForm)
            .then(response => {
                if (response.body.success) {
                    this.loading = false;
                    this.$router.push('/monitoring/rule');
                    this.setMessage('The rule has been created!');
                }
            })
            .catch(error => {
                console.log(error)
                this.loading = false;
                this.setMessage({
                    message: 'Creating rule is failed!',
                    type: 'error'
                })
            })	
        },
        validateForRule() {
            var vm = this;
            var isOk = true;
            this.$validator.validateAll().then(() => {
				const err = this.$validator.getErrors();
                err.errors.forEach(function (item, i) {
                    if(item.field == 'unblock_after'){
                        vm.setMessage({
                            message: 'unblock_after can not be empty',
                            type: 'error'
                        })
                        isOk = false
                    }
                });
                if(isOk == true) {
                    vm.createRule();
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
        toStep4() {
            var vm = this;
            var isOk = true;
            this.$validator.validateAll().then(() => {
                console.log("validate");
                // eslint-disable-next-line
                const err = this.$validator.getErrors();
                err.errors.forEach(function (item, i) {
                    if(item.field == 'sample_size'){
                        vm.setMessage({
                            message: 'sample_size can not be empty',
                            type: 'error'
                        })
                        isOk = false
                    }
                });
                if(isOk == true) {
                    this.step = 4;
                    this.selectTab(3);
                }
            }).catch(() => {
                // eslint-disable-next-line
            });
        },
        toStep3() {
            var vm = this;
            var isOk = true;
            this.$validator.validateAll().then(() => {
                console.log("validate");
                // eslint-disable-next-line
                const err = this.$validator.getErrors();
                err.errors.forEach(function (item, i) {
                    if(item.field == 'min_call_attempt'){
                        vm.setMessage({
                            message: 'min_call_attempt can not be empty',
                            type: 'error'
                        })
                        isOk = false
                    }
                });
                if(isOk == true) {
                    this.requestForm.monitor_data_by = this.monitor_data_by;
                    // this.requestForm.abr = this.abr;

                    this.step = 3;
                    this.selectTab(2);
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
        toStep2() {
            console.log("toStep2");
            var vm = this;
            var isOk = true;
            this.$validator.validateAll().then(() => {
                const err = this.$validator.getErrors();
                err.errors.forEach(function (item, i) {
                    if(item.field == 'monitoring_rule_name' || vm.trunks.length == 0){
                        var msg;
                        if(item.field == 'monitoring_rule_name')
                            msg = 'monitoring_rule_name can not be empty';
                        else if(vm.trunks.length == 0)
                            msg = 'Trunk list can not be empty';
                        vm.setMessage({
                            message: msg,
                            type: 'error'
                        })
                        isOk = false
                    }
                });
                if(isOk == true) {
                    // eslint-disable-next-line
                    this.requestForm.monitoring_on = this.monitoring_on;
                    this.requestForm.include = this.include;
                    console.log(this.requestForm);

                    this.step = 2;
                    // this.selectTab(0);
                    this.$nextTick(this.selectTab(1));
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
        toStep1() {
            this.step = 1;
            // this.selectTab(0);
            this.$nextTick(this.selectTab(0));
        },
        fetchEgressTrunks() {
			var per_page=1;
			var url = api.getEndpointUrl() + "/v1/trunk/egress/list?per_page="+per_page+"&is_active=true"
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

					url = api.getEndpointUrl() + "/v1/trunk/egress/list?per_page="+per_page+"&is_active=true"
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
                                option.key = temp.trunk_id;
                                option.label = temp.trunk_name;
								self.egress_trunk_options.push(option);
							});
							console.log(this.egress_trunk_options);
                            this.trunk_options = this.egress_trunk_options;
                            this.fetchIngressTrunks();
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
                                option.key = temp.trunk_id;
                                option.label = temp.trunk_name;
								self.ingress_trunk_options.push(option);
							});
							console.log(this.ingress_trunk_options);
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
		}
    },
    created: function () {
        console.log("created");
        this.loading = true;
        this.step = 1;
        this.fetchEgressTrunks();
        
    },
    mounted: function () {
        // $('#egress_trunk_list').multiSelect({
        // 	 selectableHeader: "<div class='custom-header'>Optional Selection</div>",
        // 	 selectionHeader: "<div class='custom-header'>Selected Selection</div>"
        // });
    }
}
</script>

<style>
.tab span.dnl_icon.dnl_tick {
    font-size: 17px;
    margin-right: 2px;
}
.mar-top-5{
margin-bottom: 5px;
}
.col-md-6.col-sm-6.col-xs-12.m-top-25 {
    margin-top: 25px;
}
</style>
