
<template>
    <div class="container-fluid">
        <div class="white_pad">
        <time-display></time-display>
            <ol class="breadcrumb">
                <li class="breadcrumb-item">
                    <a href="#">Agent</a>
                </li>
                <li class="breadcrumb-item">
                    <router-link to="/agent/agent_management">Agent Management</router-link>
                </li>
                <li class="breadcrumb-item active">Agent Management</li>
            </ol>
            <h2 class="config_section_name">Select New Telephone Numbers</h2>
            <form class="form" @submit.prevent="validateForRepository">
                <section class="config_section">
                    <div class="row">
                        <div class="col-lg-4 col-sm-9 col-md-6 col-xs-12">
                            <div class="row">
                                <div class="col-md-12 col-sm-11">
                                    <div class="form-group">
                                        <label>Search:</label>
                                        <select class="selectable" v-model="selected1">
                                            <option v-for="item in options1" v-bind:value="item.id">
                                                {{ item.text }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-12 col-sm-11">
                                    <div class="form-group">
                                        <div class="checkbox checkbox-success">
                                            <input id="enable_rep_grouping" v-model="enable_rep_grouping" name="enable_rep_grouping" type="checkbox">
                                            <label for="enable_rep_grouping">DID's for Unlimited Plan Only</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-12 col-sm-11">
                                    <div class="form-group">
                                        <label>State:</label>
                                        <select class="selectable" v-model="selected1">
                                            <option v-for="item in options2" v-bind:value="item.id">
                                                {{ item.text }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-12 col-sm-11">
                                    <p style="color: black; font-weight: bold;">Default is All or narrow your search by selecting Rate Center</p>
                                </div>
                                <div class="col-md-12 col-sm-11">
                                    <div class="form-group">
                                        <label>Rate Center:</label>
                                        <!--<select2 :options="statusoptions" v-model="statusselect"></select2>-->
                                        <select class="selectable" v-model="selected1">
                                            <option v-for="item in options3" v-bind:value="item.id">
                                                {{ item.text }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div class="clearfix"></div>
                                <div class="col-md-12 col-sm-11">
                                    <div class="form-group">
                                        <label>NPANXX:</label>
                                        <!--<select2 :options="statusoptions" v-model="statusselect"></select2>-->
                                        <select class="selectable" v-model="selected1">
                                            <option v-for="item in options4" v-bind:value="item.id">
                                                {{ item.text }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-sm-11 col-md-12">
                                        <button class="btn btn-primary" type="submit">
                                            Search
                                        </button>
                                        <button class="btn btn-default">
                                            Refresh
                                        </button>
                                    </div>
                            </div>
                        </div>
                    </div>
                </section>
            </form>
            <div class="clearfix little-space"></div>
        </div>

    </div>
</template>

<script>
    const vSelect = require('vue!../../main_components/select.vue');
    import {mapGetters, mapActions} from 'vuex'

    module.exports = {
        components: {
            'select2': vSelect,
        },
        data: function () {
            return {
                apiUrl: '',
                selected1: 1,
                options1: [
                    {id: 1, text: 'State'},
                    {id: 2, text: 'Select state'},
                    {id: 3, text: '30'},
                    {id: 4, text: '50'},
                    {id: 5, text: '100'}
                ],
                  options2: [
                    {id: 1, text: 'Select State'},
                    {id: 2, text: '10'},
                    {id: 3, text: '30'},
                    {id: 4, text: '50'},
                    {id: 5, text: '100'}
                ],  
                   options3: [
                    {id: 1, text: 'Rate Center'},
                    {id: 2, text: '10'},
                    {id: 3, text: '30'},
                    {id: 4, text: '50'},
                    {id: 5, text: '100'}
                ],
                    options4: [
                    {id: 1, text: 'NPANXX'},
                    {id: 2, text: '10'},
                    {id: 3, text: '30'},
                    {id: 4, text: '50'},
                    {id: 5, text: '100'}
                ],

            }
        },
        methods: {
            ...mapActions({
                setAsyncConfirm: 'async_confirm/setAsyncConfirm',
                setMessage: 'app_message/setAppMessage'
            }),
            handleChange() {

            },


            mounted: function () {
            },

            created: function () {

            },

            updated: function () {
            }
        }
    }
</script>



<style>
    #app > div.container-fluid > div > form > section > div > div > div > div:nth-child(1) > div > select, 
    #app > div.container-fluid > div > form > section > div > div > div > div:nth-child(3) > div > select, 
    #app > div.container-fluid > div > form > section > div > div > div > div:nth-child(5) > div > select, 
    #app > div.container-fluid > div > form > section > div > div > div > div:nth-child(7) > div > select{
        display: block;
        width: 100%
    }
    #app > div.container-fluid > div > form > section > div > div > div > div:nth-child(8) > button.btn.btn-primary, 
    #app > div.container-fluid > div > form > section > div > div > div > div:nth-child(8) > button.btn.btn-default{
        width: 49.5%;
    }
    a.action.action_settings {
        padding-top: 3px;
        vertical-align: top;
        font-size: 18px;
    }
    .el-select__tags {
        display: none;
    }

    .white_pad {
        background-color:#f7f8f9!important ;
    }

    .config_section {
        background-color: white;
    }

@media (max-width: 768px) {
        #app > div.container-fluid > div > div > div.white_pad.table_wrap > div.table_filters > div.inline-block.select_min_wrapper.pull-right {
            margin-top: 26px;
        }
}
@media (max-width: 767px){
    h2.config_section_name{
        margin: 15px 0;
    }
}
        
@media (max-width: 453px){
        #app > div.container-fluid > div > form > section > div > div > div > div:nth-child(8) > button.btn.btn-primary, 
        #app > div.container-fluid > div > form > section > div > div > div > div:nth-child(8) > button.btn.btn-default{
        width: 49%;
    } 
}
@media (max-width: 375px){
    #app > div.container-fluid > div > h2{
        font-size: 20px;
    }
}
</style>