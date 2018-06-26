
<template>
    <div class="container-fluid">
        <div class="white_pad">
            <time-display></time-display>
            <ol class="breadcrumb">
                <li class="breadcrumb-item">
                    <a href="#">Termination</a>
                </li>
                <li class="breadcrumb-item active">Settings</li>
            </ol>
            <h1 class="page-header">Settings</h1>
            <form class="form" @submit.prevent="validateForRepository">
                <section class="config_section">
                    <div class="row">
                        <div class="col-lg-12 col-sm-12 col-md-12 col-xs-12">
                            <div class="row">
                                <div class="col-md-12 col-sm-12 col-xs-12">
                                    <p class="color-txt">We will only accept calls from the IP addresses that you have added from the form below</p>
                                    <p class="color-txt">Add a New Address</p>
                                    <div class="mar-bot col-md-12 col-sm-12 col-xs-12 pad-left">
                                        <div class="width-input col-md-1 col-sm-1 col-xs-3 pad-left pad-righ-5">
                                            <input class="inp-field" type="text">
                                        </div>
                                        <div class="width-input col-md-1 col-sm-1 col-xs-3 pad-left pad-righ-5">
                                            <input class="inp-field" type="text">
                                        </div>
                                        <div class="width-input col-md-1 col-sm-1 col-xs-3 pad-left pad-righ-5">
                                            <input class="inp-field" type="text">
                                        </div>
                                        <div class="width-input col-md-1 col-sm-1 col-xs-3 pad-left pad-righ-5">
                                            <input class="inp-field" type="text">
                                        </div>
                                        <div class="margin-btn-top width-input col-md-1 col-sm-2 col-xs-12 pad-left pad-right">
                                            <button class="float-l btn-add btn btn-primary">Add</button>
                                        </div>   
                                    </div>
                                    <div class="row">
                                        <div class="mar-bot col-lg-2 col-sm-4 col-md-2 col-xs-12">
                                        <p class="color-txt">Sessions:</p>
                                        <input class="inp-field" type="text" name="">
                                    </div>
                                    </div>
                                    <div class="row">
                                           <div class="mar-bot col-sm-10 col-xs-12">
                                        <span><input type="radio">
                                        <span class="color-txt">SIP<span class="color-txt" style="display: block; margin-left: 16px;">Please enter the number of SIP seassions desired, 10 is the default with a CPS limit of 1. All requests willrequire account approval before activation and each IP can only be entered onde. To encrease ports after you have been approved, please open a ticket with support.</span></span></span>
                                    </div>
                                    </div>
                                    <div class="row">
                                        <div class="mar-bot col-lg-2 col-sm-4 col-md-2 col-xs-12">
                                       <p class="color-txt">CPS(Calls per second)</p>
                                       <input class="inp-field" type="text" name="">
                                   </div>
                                    </div>
                               </div>
                            </div>
                            <div class="pad-left pad-right col-xs-12 col-sm-12 col-md-12">
                                <div class="table-responsive">
                            <table class="table table-striped table-hover aliases">
                                <thead>
                                <tr>
                                    <th v-if="showcolumns[0]">Auth IP</th>
                                    <th v-if="showcolumns[1]">Ports Allocated/Requested</th>
                                    <th v-if="showcolumns[2]">Protocol</th>
                                    <th v-if="showcolumns[3]">Setup</th>
                                    <th v-if="showcolumns[4]">Status</th>
                                    <th v-if="showcolumns[5]">Action</th>
                                    <th v-if="showcolumns[6]">Request Session/CPS</th>
                                </tr>
                                </thead>
                                <tbody>

                                <!-- <tr v-if="!cdrs.length">
                                    <td style="text-align: center" colspan="4">No Data Found</td>
                                </tr> -->

                                <tr v-for="cdr in cdrs">
                                    <td v-if="showcolumns[0]">{{cdr.answer_time_of_date}}</td>
                                    <td v-if="showcolumns[1]">{{cdr.call_duration}}</td>
                                    <td v-if="showcolumns[2]">{{cdr.release_tod}}</td>
                                    <td v-if="showcolumns[3]">{{cdr.trunk_type}}</td>
                                    <td v-if="showcolumns[1]">{{cdr.call_duration}}</td>
                                    <td v-if="showcolumns[2]">{{cdr.release_tod}}</td>
                                    <td v-if="showcolumns[3]">{{cdr.trunk_type}}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                            </div> 
                        </div>
                    </div>
                </section>
            </form>
        </div>

    </div>
</template>

<script>
    const vSelect = require('vue!../../main_components/select.vue');
    import {mapGetters,	mapActions} from 'vuex'

    module.exports = {
        components: {
            'select2': vSelect,
        },
        data: function () {
            return {
                apiUrl: '',
                selected1: 1,
                showcolumns:[true,true,true,true,true,true,true],
                options1: [
                    {id: 1, text: '10'},
                    {id: 2, text: '20'},
                    {id: 3, text: '30'},
                    {id: 4, text: '50'},
                    {id: 5, text: '100'}
                ],
                cdrs: [
                    { id: 1, answer_time_of_date: '2017-08-01 09:22:24', call_duration : 60, release_tod: '2017-08-01 09:23:10', trunk_type: 13 },
                    { id: 2, answer_time_of_date: '2017-08-01 09:22:24', call_duration : 120, release_tod: '2017-08-01 09:23:10', trunk_type: 14 },
                    { id: 3, answer_time_of_date: '2017-08-01 09:22:24', call_duration : 30, release_tod: '2017-08-01 09:23:10', trunk_type: 15 },
                    { id: 4, answer_time_of_date: '2017-08-01 09:22:24', call_duration : 50, release_tod: '2017-08-01 09:23:10', trunk_type: 16 },
                    { id: 5, answer_time_of_date: '2017-08-01 09:22:24', call_duration : 80, release_tod: '2017-08-01 09:23:10', trunk_type: 17 },
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

.color-txt{
    color: black;
    font-weight: bold;
}
.pad-righ-5{
    padding: 0 5px 0 0;
}
.inp-field{
    border-radius: 5px;
    border: 1px solid #949494;
    padding: 8px 0px;
}
    #app > div.container-fluid > div > form > section > div > div > div > div:nth-child(1){
    margin-left: 2px;
    }
    #app > div.container-fluid > div > span{
        margin-top: 0px;
    }
    .config_section{
        border: 1px solid #dee0e3;
    }
    .border-elem{
        border: 1px solid #dee0e3;
        background: #f7f8f9;
        padding-bottom: 15px;
        margin-bottom: 15px;
        margin-left: 15px;
        padding-top: 15px;
    }
    a.action.action_settings {
        padding-top: 3px;
        vertical-align: top;
        font-size: 18px;
    }
    @media (min-width: 1440px){
        .width-input{
    width: 6%;
}
    }
    @media (min-width: 864px){
        #app > div.container-fluid > div > form > section > div > div > div > div:nth-child(3) > div > div.col-md-4.col-sm-4.col-xs-12.mar-top{
            margin-top: 24px;
        }
    }
    @media (min-width: 768px) {
        #app > div.container-fluid > div > div > div.white_pad.table_wrap > div.table_filters > div.inline-block.select_min_wrapper.pull-right {
            margin-top: 26px;
        }
        #app > div.container-fluid > div > form > section > div > div > div > div:nth-child(3) > div > div.col-md-4.col-sm-4.col-xs-12.p0l.mar-top{
            padding-left: 0px;
        }

    }
    @media(max-width: 767px){
        .border-elem{
            margin-left: 0px;
        }
        #app > div.container-fluid > div > form > section > div > div > div > div.col-md-12.col-sm-12.col-xs-12.border-elem > div > div.col-md-4.col-sm-4.col-xs-12.p0l.mar-top > button{
            width: 65%;
            margin:15px 0;
        }
        #app > div.container-fluid > div > form > section > div > div > div > div.col-sm-6.col-md-6.col-xs-12 > button{
            width: 82%;
        }
        #app > div.container-fluid > div > form > section > div > div > div > div.col-md-12.col-sm-12.col-xs-12.border-elem > div > div.col-md-4.col-sm-4.col-xs-12.p0l.mar-top,
        #app > div.container-fluid > div > form > section > div > div > div > div.col-sm-6.col-md-6.col-xs-12{
            text-align: center;
        }
        .margin-btn-top{
           margin-top: 10px; 
        }
    }
    @media (max-width: 360px){
        .pad-5{
            padding-left: 5px;
            padding-right: 5px;
        }
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
    .btn.btn-primary{
        width: 100%;
    }

</style>
