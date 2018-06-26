
<template>
    <div class="container-fluid">
        <div class="white_pad">
               <time-display></time-display>
                <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                        <a href="#">Origination</a>
                    </li>
                    <li class="breadcrumb-item active">Check Portability</li>
                </ol>
           <h1 class="page-header">Number Transfer / Port Status</h1>
            <form class="form" @submit.prevent="validateForRepository">
                <section class="config_section">
                    <div class="row">
                        <div class="col-lg-4 col-sm-6 col-md-5 col-xs-12">
                            <div class="row">
                                <div class="col-md-12 col-sm-12 col-xs-12">
                                    <div class="form-group">
                                        <label>Type:</label>
                                        <select class="selectable" v-model="selected1">
                                            <option v-for="item in type_options" v-bind:value="item.id">
                                                {{ item.text }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-12 col-sm-12 col-xs-12">
                                    <div class="form-group">
                                        <div class="checkbox checkbox-success">
                                            <input id="enable_rep_grouping" v-model="enable_rep_grouping" name="enable_rep_grouping" type="checkbox">
                                            <label for="enable_rep_grouping">Bulk DID Ordering: 20+ Numbers. Please use the csv upload method.</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-12 col-sm-12 col-xs-12 border-elem">
                                    <div class="form-group">
                                    <div class="col-md-8 col-sm-8 col-xs-12 pad-5">
                                        <label>Enter Number to be transfered.</label>
                                        <input class="form-control" type="text" name="" value="">
                                    </div>
                                    <div class="col-md-4 col-sm-4 col-xs-12 p0l mar-top">
                                        <button class="btn btn-primary">Add More</button>
                                    </div>   
                                    </div>
                                </div>
                                <div class="col-sm-6 col-md-6 col-xs-12">
                                    <button class="btn btn-primary">Check Portability</button>
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
                    {id: 1, text: '10'},
                    {id: 2, text: '20'},
                    {id: 3, text: '30'},
                    {id: 4, text: '50'},
                    {id: 5, text: '100'}
                ],
                type_options: [
                    {id: 1, text: 'Local Numbers - DIDs'}
                ]


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
 
    @media (min-width: 868px){
        #app > div.container-fluid > div > form > section > div > div > div > div:nth-child(3) > div > div.col-md-4.col-sm-4.col-xs-12.mar-top{
            margin-top: 24px;
        }
    }
       @media (max-width: 868px) and (min-width: 768px){
        #app > div.container-fluid > div > form > section > div > div > div > div.col-md-12.col-sm-12.col-xs-12.border-elem > div > div.col-md-4.col-sm-4.col-xs-12.p0l.mar-top > button{
            margin-top: 44px;
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
