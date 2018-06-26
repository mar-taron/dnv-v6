<template>
    <div class="container-fluid">
        <div class="row">
            <div class="wrapper single">
                <time-display></time-display>
                <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                        <a href="#">Routing</a>
                    </li>
                    <li class="breadcrumb-item active">Trunks</li>
                </ol>
                <tabs @activateTab="activateTab">
                    <spinner v-show="loading" class="spinner"></spinner>
                    <tab label="Egress Trunk" class="" icon="dnl_icon dnl_to_left" :selected="type=='egress' || type == undefined">
                        <h1 class="page-header">Egress Trunk</h1>
                        <confirm v-show="showEgressModal" @close="showEgressModal = false" @submit="submitDeleteEgress"></confirm>
                        <div class="btn-group m-top-10" role="group">
                            <router-link :to="'/routing/trunks/'+trunk_type+'/new'" class="btn btn-default create_new_iconed">
                                <span class="dnl_icon dnl_add"></span> Create New</router-link>
                            <button type="button" class="btn btn-default" @click="deleteAll('egress')">
                                <span class="dnl_icon dnl_action_delete"></span> Delete All
                            </button>
                            <button type="button" class="btn btn-default" @click="deleteSelected('egress')">
                                <span class="dnl_icon dnl_action_delete"></span> Delete Selected
                            </button>
                        </div>
                        <tabs class="vertical mail_template" @activateTab="activateSubTab">
                            <tab label="Egress List" class="" icon="dnl_icon dnl_arrow-point-to-right" selected>
                                <section class="role_section system_logo">
                                    <h2 class="role_section_name">Egress List</h2>
                                    <div class="advanced_search_filter_panel">
                                        <div class="inline-block search_wrapper">
                                            <label>Search:</label>
                                            <br>
                                            <input type="text" name="search" v-model="egress_search" class="form-control inline-block search_field" placeholder="Enter Search"  v-on:keyup.enter="searchByEgressTrunkName">
                                            <span class="dnl_icon dnl_musica-searcher"></span>
                                        </div>
                                        <div class="inline-block" style="width: 100px; margin-right: 20px;">
                                            <label>Status:</label>
                                            <br>
                                            <select2 :options="status_options" v-model="status">
                                            </select2>
                                        </div>
                                        <div class="inline-block" style="width: 100px; margin-right: 20px;">
                                            <label>Page row:</label>
                                            <br>
                                            <select2 :options="page_count_options" v-model="egress_page_count" class="inline-block" @pagecount="egressChangePageCount">
                                            </select2>
                                        </div>
                                        <div class="inline-block">
                                            <el-select v-model="egress_trunk_table_columns" multiple placeholder="Show/Hide Columns" @change="handleChangeEgress">
                                                <el-option v-for="item in egress_trunk_table_column_options" :key="item.value" :label="item.label" :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </div>
                                    </div>
                                    <div class="table-responsive big_data">
                                        <table style="min-width: 1207px;" class="table table-striped table-hover carrier_groups">
                                            <thead>
                                                <tr>
                                                    <th class="width-65">
                                                        <div class="checkbox checkbox-success">
                                                            <input type="checkbox" v-model="checker">
                                                            <label></label>
                                                        </div>
                                                    </th>
                                                    <th v-if="egress_trunk_showcolumns[0]">Host Port</th>
                                                    <th v-if="egress_trunk_showcolumns[1]" @click="sortColumnEgress('resource_id')">Egress ID
                                                        <span class="dnl_icon dnl_sort pull-right"></span>
                                                    </th>
                                                    <th v-if="egress_trunk_showcolumns[2]" @click="sortColumnEgress('name')">Egress Name
                                                        <span class="dnl_icon dnl_sort pull-right"></span>
                                                    </th>
                                                    <th v-if="egress_trunk_showcolumns[3]" @click="sortColumnEgress('carrier_id')">Carriers
                                                        <span class="dnl_icon dnl_sort pull-right"></span>
                                                    </th>
                                                    <th v-if="egress_trunk_showcolumns[4]" @click="sortColumnEgress('call_limit')">Call Limit
                                                        <span class="dnl_icon dnl_sort pull-right"></span>
                                                    </th>
                                                    <th v-if="egress_trunk_showcolumns[5]" @click="sortColumnEgress('cps_limit')">CPS Limit
                                                        <span class="dnl_icon dnl_sort pull-right"></span>
                                                    </th>
                                                    <th v-if="egress_trunk_showcolumns[6]">Usage Count</th>
                                                    <th v-if="egress_trunk_showcolumns[7]">Rate Table</th>
                                                    <th v-if="egress_trunk_showcolumns[8]">PDD Timeout</th>
                                                    <th v-if="egress_trunk_showcolumns[9]">Updated at</th>
                                                    <th v-if="egress_trunk_showcolumns[10]">Updated by</th>
                                                    <th v-if="egress_trunk_showcolumns[11]" class="width_190">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="egress in egress_lists">
                                                    <td class="centred_checkbox">
                                                        <div class="checkbox checkbox-success">
                                                            <input :id="'egress-' + egress.resource_id" :name="'egress-' + egress.resource_id" type="checkbox" v-model="egress.status">
                                                            <label :for="'egress-' + egress.resource_id"></label>
                                                        </div>
                                                    </td>
                                                    <td v-if="egress_trunk_showcolumns[0]">
                                                        <a class="action action_read" data-toggle="tooltip" data-placement="top" title="View" @click="viewHost(egress.resource_id)">
                                                            <span class="dnl_icon dnl_eye"></span>
                                                        </a>
                                                    </td>
                                                    <td v-if="egress_trunk_showcolumns[1]">{{egress.resource_id}}</td>
                                                    <td v-if="egress_trunk_showcolumns[2]">{{egress.name}}</td>
                                                    <td v-if="egress_trunk_showcolumns[3]">{{egress.carrier}}</td>
                                                    <td v-if="egress_trunk_showcolumns[4]">{{egress.call_limit}}</td>
                                                    <td v-if="egress_trunk_showcolumns[5]">{{egress.cps_limit}}</td>
                                                    <td v-if="egress_trunk_showcolumns[6]">{{egress.route_strategy!=null?egress.route_strategy.usage_count:null}}</td>
                                                    <td v-if="egress_trunk_showcolumns[7]">{{egress.rate_table}}</td>
                                                    <td v-if="egress_trunk_showcolumns[8]">{{egress.media_timeout}}</td>
                                                    <td v-if="egress_trunk_showcolumns[9]">{{egress.update_at}}</td>
                                                    <td v-if="egress_trunk_showcolumns[10]">{{egress.update_by}}</td>
                                                    <td v-if="egress_trunk_showcolumns[11]">
                                                        <a class="action action_send" data-toggle="tooltip" data-placement="top" title="Send Interop" @click="sendInterop(egress.resource_id)">
                                                            <span class="dnl_icon dnl_support"></span>
                                                        </a>
                                                        <a class="action action_save_template" data-toggle="tooltip" data-placement="top" title="Save as Template" @click="trunk_id=egress.resource_id;showModal='template';">
                                                            <span class="dnl_icon dnl_label"></span>
                                                        </a>
                                                        <a class="action action_activate" data-toggle="tooltip" data-placement="top" :title="egress.is_active==true?'Deactivate':'Activate'" @click="changeStatus('egress', egress)">
                                                            <span class="dnl_icon dnl_check"></span>
                                                        </a>
                                                        <router-link to="" class="action action_edit" data-toggle="tooltip" data-placement="top" title="Edit" @click.native="edit_trunk(egress.resource_id, 'egress');">
                                                            <span class="dnl_icon dnl_action_edit"></span>
                                                        </router-link>
                                                        <a class="action action_delete" data-toggle="tooltip" data-placement="top" title="Delete" v-on:click="delete_egress_trunk(egress.resource_id)">
                                                            <span class="dnl_icon dnl_action_delete"></span>
                                                        </a>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="pull-right pagination">
                                        <pagination :current-page="egressPageOne.currentPage" :total-pages="egressPageOne.totalPages" @page-changed="egressPageOneChanged">
                                        </pagination>
                                    </div>
                                    <div class="clearfix"></div>
                                    <div class="clearfix little-space"></div>
                                </section>
                            </tab>
                            <tab label="Egress Import" class="" icon="dnl_icon dnl_arrow-point-to-right">
                                <section class="role_section">
                                    <h2 class="role_section_name">Egress Import</h2>
                                    <div class="col-md-5 col-sm-6">
                                        <label>Import File:</label>
                                        <dropzone id="myVueDropzone" url="https://httpbin.org/post" v-on:vdropzone-success="success"></dropzone>
                                    </div>
                                    <div class="col-md-7 col-sm-6">
                                        <label>Dublicate:</label>
                                        <div class="form-group">
                                            <div class="radio radio-success">
                                                <input id="radio-1" class="radio-custom" name="duplicates" type="radio" checked>
                                                <label for="radio-1" class="radio-custom-label">Ignore</label>
                                            </div>
                                        </div>
                                        <div class="form-group m-top-minus-25">
                                            <div class="radio radio-success">
                                                <input id="radio-2" class="radio-custom" name="duplicates" type="radio">
                                                <label for="radio-2" class="radio-custom-label">Delete</label>
                                            </div>
                                        </div>
                                        <div class="button_set little-space">
                                            <a class="btn btn-primary mini" @click="exportExampleEgressCSV">
                                                Show Example
                                            </a>
                                        </div>
                                    </div>
                                    <div class="clearfix"></div>
                                    <div class="button_set col-md-12 col-sm-12">
                                        <a class="btn btn-primary mini">
                                            Upload
                                        </a>
                                    </div>
                                    <div class="clearfix"></div>
                                </section>
                            </tab>
                            <tab label="Egress Export" class="" icon="dnl_icon dnl_arrow-point-to-right">
                                <section class="role_section">
                                    <h2 class="role_section_name">Egress Export</h2>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Data Format:</label>
                                            <select2 :options="data_format_options" v-model="egress_data_format"></select2>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group m-top-33">
                                            <div class="checkbox checkbox-success">
                                                <input id="egress_with_headers_row" name="egress_with_headers_row" type="checkbox" v-model="egress_with_headers_row">
                                                <label for="egress_with_headers_row">With headers row</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="clearfix"></div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            <label>Header Text:</label>
                                            <textarea v-model="header_text" class="form-control" placeholder="Enter Header Text" />
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            <label>Footer Text:</label>
                                            <textarea v-model="footer_text" class="form-control" placeholder="Enter Footer Text" />
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #1:</label>
                                            <select class="selectable" v-model="egress_column_1">
                                                <option v-for="item in egress_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #2:</label>
                                            <select class="selectable" v-model="egress_column_2">
                                                <option v-for="item in egress_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #3:</label>
                                            <select class="selectable" v-model="egress_column_3">
                                                <option v-for="item in egress_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #4:</label>
                                            <select class="selectable" v-model="egress_column_4">
                                                <option v-for="item in egress_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #5:</label>
                                            <select class="selectable" v-model="egress_column_5">
                                                <option v-for="item in egress_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #6:</label>
                                            <select class="selectable" v-model="egress_column_6">
                                                <option v-for="item in egress_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #7:</label>
                                            <select class="selectable" v-model="egress_column_7">
                                                <option v-for="item in egress_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #8:</label>
                                            <select class="selectable" v-model="egress_column_8">
                                                <option v-for="item in egress_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #9:</label>
                                            <select class="selectable" v-model="egress_column_9">
                                                <option v-for="item in egress_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #10:</label>
                                            <select class="selectable" v-model="egress_column_10">
                                                <option v-for="item in egress_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #11:</label>
                                            <select class="selectable" v-model="egress_column_11">
                                                <option v-for="item in egress_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #12:</label>
                                            <select class="selectable" v-model="egress_column_12">
                                                <option v-for="item in egress_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #13:</label>
                                            <select class="selectable" v-model="egress_column_13">
                                                <option v-for="item in egress_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #14:</label>
                                            <select class="selectable" v-model="egress_column_14">
                                                <option v-for="item in egress_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="clearfix"></div>
                                    <div class="button_set center-block text-center">
                                        <a class="btn btn-primary mini" @click="exportEgress()">
                                            Download
                                        </a>
                                    </div>
                                </section>
                            </tab>
                            <tab label="Import Host" class="" icon="dnl_icon dnl_arrow-point-to-right">
                                <section class="role_section">
                                    <h2 class="role_section_name">Import Host</h2>
                                    <div class="col-md-5 col-sm-6">
                                        <label>Import Host:</label>
                                        <dropzone id="myVueDropzone2" url="https://httpbin.org/post" v-on:vdropzone-success="success"></dropzone>
                                    </div>
                                    <div class="col-md-7 col-sm-6">
                                        <label>Dublicate:</label>
                                        <div class="form-group">
                                            <div class="radio radio-success">
                                                <input id="egress_import_host_method_1" class="radio-custom" name="egress_import_host_method_1" type="radio" value="ignore" v-model="egress_import_host_method">
                                                <label for="egress_import_host_method_1" class="radio-custom-label">Ignore</label>
                                            </div>
                                        </div>
                                        <div class="form-group m-top-minus-25">
                                            <div class="radio radio-success">
                                                <input id="egress_import_host_method_2" class="radio-custom" name="egress_import_host_method_2" type="radio" value="delete" v-model="egress_import_host_method">
                                                <label for="egress_import_host_method_2" class="radio-custom-label">Delete</label>
                                            </div>
                                        </div>
                                        <div class="button_set little-space">
                                            <a class="btn btn-primary mini" @click="exportExampleHostCSV">
                                                Show Example
                                            </a>
                                        </div>
                                    </div>
                                    <div class="clearfix"></div>
                                    <div class="button_set col-md-12 col-sm-12">
                                        <a class="btn btn-primary mini" @click="uploadEgressHostCSV">
                                            Upload
                                        </a>
                                    </div>
                                    <div class="clearfix"></div>
                                </section>
                            </tab>
                            <tab label="Export Host" class="" icon="dnl_icon dnl_arrow-point-to-right">
                                <section class="role_section">
                                    <h2 class="role_section_name">Export Host</h2>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Data Format:</label>
                                            <select2 :options="data_format_options" v-model="host_data_format"></select2>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group m-top-33">
                                            <div class="checkbox checkbox-success">
                                                <input id="egress_host_with_headers_row" name="egress_host_with_headers_row" type="checkbox" v-model="egress_host_with_headers_row">
                                                <label for="egress_host_with_headers_row">With headers row</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="clearfix"></div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            <label>Header Text:</label>
                                            <textarea v-model="header_text" class="form-control" placeholder="Enter Header Text" />
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            <label>Footer Text:</label>
                                            <textarea v-model="footer_text" class="form-control" placeholder="Enter Footer Text" />
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #1:</label>
                                            <select class="selectable" v-model="host_column_1">
                                                <option v-for="item in host_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #2:</label>
                                            <select class="selectable" v-model="host_column_2">
                                                <option v-for="item in host_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #3:</label>
                                            <select class="selectable" v-model="host_column_3">
                                                <option v-for="item in host_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="clearfix"></div>
                                    <div class="button_set center-block text-center">
                                        <a class="btn btn-primary mini" @click="exportHost">
                                            Download
                                        </a>
                                    </div>
                                </section>
                            </tab>
                            <tab label="Import Action" class="" icon="dnl_icon dnl_arrow-point-to-right">
                                <section class="role_section">
                                    <h2 class="role_section_name">Import Action</h2>
                                    <div class="col-md-5 col-sm-6">
                                        <label>Import Action:</label>
                                        <dropzone id="myVueDropzone3" url="https://httpbin.org/post" v-on:vdropzone-success="success"></dropzone>
                                    </div>
                                    <div class="col-md-7 col-sm-6">
                                        <label>Dublicate:</label>
                                        <div class="form-group">
                                            <div class="radio radio-success">
                                                <input id="egress_import_action_method_1" class="radio-custom" name="egress_import_action_method_1" type="radio" value="ignore" v-model="egress_import_action_method">
                                                <label for="egress_import_action_method_1" class="radio-custom-label">Ignore</label>
                                            </div>
                                        </div>
                                        <div class="form-group m-top-minus-25">
                                            <div class="radio radio-success">
                                                <input id="egress_import_action_method_2" class="radio-custom" name="egress_import_action_method_2" type="radio" value="delete" v-model="egress_import_action_method">
                                                <label for="egress_import_action_method_2" class="radio-custom-label">Delete</label>
                                            </div>
                                        </div>
                                        <div class="button_set little-space">
                                            <a class="btn btn-primary mini" @click="exportExampleActionCSV">
                                                Show Example
                                            </a>
                                        </div>
                                    </div>
                                    <div class="clearfix"></div>
                                    <div class="button_set col-md-12 col-sm-12">
                                        <a class="btn btn-primary mini">
                                            Upload
                                        </a>
                                    </div>
                                    <div class="clearfix"></div>
                                </section>
                            </tab>
                            <tab label="Export Action" class="" icon="dnl_icon dnl_arrow-point-to-right">
                                <section class="role_section">
                                    <h2 class="role_section_name">Export Action</h2>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Data Format:</label>
                                            <select2 :options="data_format_options" v-model="egress_action_data_format"></select2>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group m-top-33">
                                            <div class="checkbox checkbox-success">
                                                <input id="egress_action_with_headers_row" name="egress_action_with_headers_row" type="checkbox" v-model="egress_action_with_headers_row">
                                                <label for="egress_action_with_headers_row">With headers row</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="clearfix"></div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            <label>Header Text:</label>
                                            <textarea v-model="header_text" class="form-control" placeholder="Enter Header Text" />
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            <label>Footer Text:</label>
                                            <textarea v-model="footer_text" class="form-control" placeholder="Enter Footer Text" />
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #1:</label>
                                            <select class="selectable" v-model="egress_action_column_1">
                                                <option v-for="item in action_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #2:</label>
                                            <select class="selectable" v-model="egress_action_column_2">
                                                <option v-for="item in action_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #3:</label>
                                            <select class="selectable" v-model="egress_action_column_3">
                                                <option v-for="item in action_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #4:</label>
                                            <select class="selectable" v-model="egress_action_column_4">
                                                <option v-for="item in action_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #5:</label>
                                            <select class="selectable" v-model="egress_action_column_5">
                                                <option v-for="item in action_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #6:</label>
                                            <select class="selectable" v-model="egress_action_column_6">
                                                <option v-for="item in action_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #7:</label>
                                            <select class="selectable" v-model="egress_action_column_7">
                                                <option v-for="item in action_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #8:</label>
                                            <select class="selectable" v-model="egress_action_column_8">
                                                <option v-for="item in action_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="clearfix"></div>
                                    <div class="button_set center-block text-center">
                                        <a class="btn btn-primary mini" @click="exportAction">
                                            Download
                                        </a>
                                    </div>
                                </section>
                            </tab>
                        </tabs>
                        <div class="clearfix"></div>
                    </tab>
                    <tab label="Ingress Trunk" class="" icon="dnl_icon dnl_to_right" :selected="type=='ingress'">
                        <h1 class="page-header">Ingress Trunk</h1>
                        <confirm v-show="showIngressModal" @close="showIngressModal = false" @submit="submitDeleteIngress"></confirm>
                        <div class="btn-group m-top-10" role="group">
                            <button type="button" class="btn btn-default create_new_iconed" @click="createNew">
                                <span class="dnl_icon dnl_add"></span> Create New
                            </button>
                            <button type="button" class="btn btn-default" @click="deleteAll('ingress')">
                                <span class="dnl_icon dnl_action_delete"></span> Delete All
                            </button>
                            <button type="button" class="btn btn-default" @click="deleteSelected('ingress')">
                                <span class="dnl_icon dnl_action_delete"></span> Delete Selected
                            </button>
                        </div>
                        <tabs class="vertical mail_template">
                            <tab label="Ingress List" class="" icon="dnl_icon dnl_arrow-point-to-right" selected>
                                <section class="role_section system_logo">
                                    <h2 class="role_section_name">Ingress Trunk</h2>
                                    <div class="advanced_search_filter_panel">
                                        <div class="inline-block search_wrapper">
                                            <label>Search:</label>
                                            <br>
                                            <input type="text" name="search" v-model="ingress_search" class="form-control inline-block search_field" placeholder="Enter Search" v-on:keyup.enter="searchByIngressTrunkName">
                                            <span class="dnl_icon dnl_musica-searcher" @click="searchByIngressTrunkName"></span>
                                        </div>
                                        <div class="inline-block" style="width: 100px; margin-right: 20px;">
                                            <label>Status:</label>
                                            <br>
                                            <select2 :options="status_options" v-model="status">
                                            </select2>
                                        </div>
                                        <div class="inline-block" style="width: 100px; margin-right: 20px;">
                                            <label>Page row:</label>
                                            <br>
                                            <select2 :options="page_count_options" v-model="ingress_page_count" class="inline-block" @pagecount="ingressChangePageCount">
                                            </select2>
                                        </div>
                                        <div class="inline-block">
                                            <el-select v-model="ingress_trunk_table_columns" multiple placeholder="Show/Hide Columns" @change="handleChangeIngress">
                                                <el-option v-for="item in ingress_trunk_table_column_options" :key="item.value" :label="item.label" :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </div>
                                    </div>
                                    <div class="table-responsive big_data">
                                        <table class="table table-striped table-hover carrier_groups">
                                            <thead>
                                                <tr>
                                                    <th class="width-65">
                                                        <div class="checkbox checkbox-success">
                                                            <input type="checkbox" v-model="checker">
                                                            <label></label>
                                                        </div>
                                                    </th>
                                                    <th v-if="ingress_trunk_showcolumns[0]">Host Port</th>
                                                    <th v-if="ingress_trunk_showcolumns[1]" @click="sortColumnIngress('resource_id')">Ingress ID
                                                        <span class="dnl_icon dnl_sort pull-right"></span>
                                                    </th>
                                                    <th v-if="ingress_trunk_showcolumns[2]" @click="sortColumnIngress('name')">Ingress Name
                                                        <span class="dnl_icon dnl_sort pull-right"></span>
                                                    </th>
                                                    <th v-if="ingress_trunk_showcolumns[3]" @click="sortColumnIngress('carrier')">Carriers
                                                        <span class="dnl_icon dnl_sort pull-right"></span>
                                                    </th>
                                                    <th v-if="ingress_trunk_showcolumns[4]" @click="sortColumnIngress('call_limit')">Call Limit
                                                        <span class="dnl_icon dnl_sort pull-right"></span>
                                                    </th>
                                                    <th v-if="ingress_trunk_showcolumns[5]" @click="sortColumnIngress('cps_limit')">CPS Limit
                                                        <span class="dnl_icon dnl_sort pull-right"></span>
                                                    </th>
                                                    <th v-if="ingress_trunk_showcolumns[6]">Trunk Count</th>
                                                    <th v-if="ingress_trunk_showcolumns[7]">Margin</th>
                                                    <th v-if="ingress_trunk_showcolumns[8]">PDD Timeout</th>
                                                    <th v-if="ingress_trunk_showcolumns[9]">Updated at</th>
                                                    <th v-if="ingress_trunk_showcolumns[10]">Updated by</th>
                                                    <th v-if="ingress_trunk_showcolumns[11]" class="width_190">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="ingress in ingress_lists">
                                                    <td class="centred_checkbox">
                                                        <div class="checkbox checkbox-success">
                                                            <input :id="'ingress-' + ingress.resource_id" :name="'ingress-' + ingress.resource_id" type="checkbox" v-model="ingress.status">
                                                            <label :for="'ingress-' + ingress.resource_id"></label>
                                                        </div>
                                                    </td>
                                                    <td v-if="ingress_trunk_showcolumns[0]">
                                                        <a class="action action_read" data-toggle="tooltip" data-placement="top" title="View" @click="viewHost(ingress.resource_id)">
                                                            <span class="dnl_icon dnl_eye"></span>
                                                        </a>
                                                    </td>
                                                    <td v-if="ingress_trunk_showcolumns[1]">{{ingress.resource_id}}</td>
                                                    <td v-if="ingress_trunk_showcolumns[2]">{{ingress.name}}</td>
                                                    <td v-if="ingress_trunk_showcolumns[3]">{{ingress.carrier}}</td>
                                                    <td v-if="ingress_trunk_showcolumns[4]">{{ingress.call_limit}}</td>
                                                    <td v-if="ingress_trunk_showcolumns[5]">{{ingress.cps_limit}}</td>
                                                    <td v-if="ingress_trunk_showcolumns[6]">{{ingress.trunk_count}}</td>
                                                    <td v-if="ingress_trunk_showcolumns[7]">{{ingress.min_profit_type=='percentage' && ingress.min_profit_value != 0?ingress.min_profit_value+'%': ingress.min_profit_value != 0?ingress.min_profit_value:''}}</td>
                                                    <td v-if="ingress_trunk_showcolumns[8]">{{ingress.media_timeout}}</td>
                                                    <td v-if="ingress_trunk_showcolumns[9]">{{ingress.update_at}}</td>
                                                    <td v-if="ingress_trunk_showcolumns[10]">{{ingress.update_by}}</td>
                                                    <td v-if="ingress_trunk_showcolumns[11]">
                                                        <a class="action action_send" data-toggle="tooltip" data-placement="top" title="Send Interop">
                                                            <span class="dnl_icon dnl_support"></span>
                                                        </a>
                                                        <a class="action action_save_template" data-toggle="tooltip" data-placement="top" title="Save as Template" @click="trunk_id=ingress.resource_id;showModal='template';">
                                                            <span class="dnl_icon dnl_label"></span>
                                                        </a>
                                                        <a class="action action_activate" data-toggle="tooltip" data-placement="top" :title="ingress.is_active==true?'Deactivate':'Activate'" @click="changeStatus('ingress', ingress)">
                                                            <span class="dnl_icon dnl_check"></span>
                                                        </a>
                                                        <router-link to="/routing/trunks/new" class="action action_edit" data-toggle="tooltip" data-placement="top" title="Edit" @click.native="edit_trunk(ingress.resource_id, 'ingress');">
                                                            <span class="dnl_icon dnl_action_edit"></span>
                                                        </router-link>
                                                        <a class="action action_delete" data-toggle="tooltip" data-placement="top" title="Delete" v-on:click="delete_ingress_trunk(ingress.resource_id)">
                                                            <span class="dnl_icon dnl_action_delete"></span>
                                                        </a>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="pull-right pagination">
                                        <pagination :current-page="ingressPageOne.currentPage" :total-pages="ingressPageOne.totalPages" @page-changed="ingressPageOneChanged">
                                        </pagination>
                                    </div>
                                    <div class="clearfix"></div>
                                    <div class="clearfix little-space"></div>
                                </section>
                            </tab>
                            <tab label="Ingress Import" class="" icon="dnl_icon dnl_arrow-point-to-right">
                                <section class="role_section">
                                    <h2 class="role_section_name">Ingress Import</h2>
                                    <div class="col-md-5 col-sm-6">
                                        <label>Import File:</label>
                                        <dropzone id="myVueDropzone4" url="https://httpbin.org/post" v-on:vdropzone-success="success"></dropzone>
                                    </div>
                                    <div class="col-md-7 col-sm-6">
                                        <label>Duplicate:</label>
                                        <div class="form-group">
                                            <div class="radio radio-success">
                                                <input id="ingress_import_method_1" class="radio-custom" name="ingress_import_method_1" type="radio" value="ignore" v-model="ingress_import_method">
                                                <label for="ingress_import_method_1" class="radio-custom-label">Ignore</label>
                                            </div>
                                        </div>
                                        <div class="form-group m-top-minus-25">
                                            <div class="radio radio-success">
                                                <input id="ingress_import_method_2" class="radio-custom" name="ingress_import_method_2" type="radio" value="delete" v-model="ingress_import_method">
                                                <label for="ingress_import_method_2" class="radio-custom-label">Delete</label>
                                            </div>
                                        </div>
                                        <div class="button_set little-space">
                                            <a class="btn btn-primary mini" @click="exportExampleIngressCSV">
                                                Show Example
                                            </a>
                                        </div>
                                    </div>
                                    <div class="clearfix"></div>
                                    <div class="button_set col-md-12 col-sm-12">
                                        <a class="btn btn-primary mini">
                                            Upload
                                        </a>
                                    </div>
                                    <div class="clearfix"></div>
                                </section>
                            </tab>
                            <tab label="Ingress Export" class="" icon="dnl_icon dnl_arrow-point-to-right">
                                <section class="role_section">
                                    <h2 class="role_section_name">Ingress Export</h2>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Data Format:</label>
                                            <select2 :options="data_format_options" v-model="ingress_export_data_format"></select2>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group m-top-33">
                                            <div class="checkbox checkbox-success">
                                                <input id="ingress_with_headers_row" name="ingress_with_headers_row" type="checkbox" v-model="ingress_with_headers_row">
                                                <label for="ingress_with_headers_row">With headers row</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="clearfix"></div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            <label>Header Text:</label>
                                            <textarea v-model="header_text" class="form-control" placeholder="Enter Header Text" />
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            <label>Footer Text:</label>
                                            <textarea v-model="footer_text" class="form-control" placeholder="Enter Footer Text" />
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #1:</label>
                                            <select class="selectable" v-model="ingress_export_column_1">
                                                <option v-for="item in ingress_export_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #2:</label>
                                            <select class="selectable" v-model="ingress_export_column_2">
                                                <option v-for="item in ingress_export_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #3:</label>
                                            <select class="selectable" v-model="ingress_export_column_3">
                                                <option v-for="item in ingress_export_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #4:</label>
                                            <select class="selectable" v-model="ingress_export_column_4">
                                                <option v-for="item in ingress_export_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #5:</label>
                                            <select class="selectable" v-model="ingress_export_column_5">
                                                <option v-for="item in ingress_export_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #6:</label>
                                            <select class="selectable" v-model="ingress_export_column_6">
                                                <option v-for="item in ingress_export_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #7:</label>
                                            <select class="selectable" v-model="ingress_export_column_7">
                                                <option v-for="item in ingress_export_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #8:</label>
                                            <select class="selectable" v-model="ingress_export_column_8">
                                                <option v-for="item in ingress_export_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #9:</label>
                                            <select class="selectable" v-model="ingress_export_column_9">
                                                <option v-for="item in ingress_export_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #10:</label>
                                            <select class="selectable" v-model="ingress_export_column_10">
                                                <option v-for="item in ingress_export_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #11:</label>
                                            <select class="selectable" v-model="ingress_export_column_11">
                                                <option v-for="item in ingress_export_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #12:</label>
                                            <select class="selectable" v-model="ingress_export_column_12">
                                                <option v-for="item in ingress_export_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #13:</label>
                                            <select class="selectable" v-model="ingress_export_column_13">
                                                <option v-for="item in ingress_export_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #14:</label>
                                            <select class="selectable" v-model="ingress_export_column_14">
                                                <option v-for="item in ingress_export_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #15:</label>
                                            <select class="selectable" v-model="ingress_export_column_15">
                                                <option v-for="item in ingress_export_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #16:</label>
                                            <select class="selectable" v-model="ingress_export_column_16">
                                                <option v-for="item in ingress_export_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #17:</label>
                                            <select class="selectable" v-model="ingress_export_column_17">
                                                <option v-for="item in ingress_export_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="clearfix"></div>
                                    <div class="button_set center-block text-center">
                                        <a class="btn btn-primary mini" @click="exportIngress">
                                            Download
                                        </a>
                                    </div>
                                </section>
                            </tab>
                            <tab label="Import Host" class="" icon="dnl_icon dnl_arrow-point-to-right">
                                <section class="role_section">
                                    <h2 class="role_section_name">Import Host</h2>
                                    <div class="col-md-5 col-sm-6">
                                        <label>Import File:</label>
                                        <dropzone id="myVueDropzone7" url="https://httpbin.org/post" v-on:vdropzone-success="success"></dropzone>
                                    </div>
                                    <div class="col-md-7 col-sm-6">
                                        <label>Dublicate:</label>
                                        <div class="form-group">
                                            <div class="radio radio-success">
                                                <input id="ingress_import_host_method_1" class="radio-custom" name="ingress_import_host_method_1" type="radio" value="ignore" v-model="ingress_import_host_method">
                                                <label for="ingress_import_host_method_1" class="radio-custom-label">Ignore</label>
                                            </div>
                                        </div>
                                        <div class="form-group m-top-minus-25">
                                            <div class="radio radio-success">
                                                <input id="ingress_import_host_method_2" class="radio-custom" name="ingress_import_host_method_2" type="radio" value="delete" v-model="ingress_import_host_method">
                                                <label for="ingress_import_host_method_2" class="radio-custom-label">Delete</label>
                                            </div>
                                        </div>
                                        <div class="button_set little-space">
                                            <a class="btn btn-primary mini">
                                                Show Example
                                            </a>
                                        </div>
                                    </div>
                                    <div class="clearfix"></div>
                                    <div class="button_set col-md-12 col-sm-12">
                                        <a class="btn btn-primary mini">
                                            Upload
                                        </a>
                                    </div>
                                    <div class="clearfix"></div>
                                </section>
                            </tab>
                            <tab label="Export Host" class="" icon="dnl_icon dnl_arrow-point-to-right">
                                <section class="role_section">
                                    <h2 class="role_section_name">Export Host</h2>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Data Format:</label>
                                            <select2 :options="data_format_options" v-model="ingress_host_data_format"></select2>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group m-top-33">
                                            <div class="checkbox checkbox-success">
                                                <input id="ingress_host_with_headers_row" name="ingress_host_with_headers_row" type="checkbox" v-model="ingress_host_with_headers_row">
                                                <label for="ingress_host_with_headers_row">With headers row</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="clearfix"></div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            <label>Header Text:</label>
                                            <textarea v-model="header_text" class="form-control" placeholder="Enter Header Text" />
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            <label>Footer Text:</label>
                                            <textarea v-model="footer_text" class="form-control" placeholder="Enter Footer Text" />
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #1:</label>
                                            <select class="selectable" v-model="ingress_host_column_1">
                                                <option v-for="item in host_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #2:</label>
                                            <select class="selectable" v-model="ingress_host_column_2">
                                                <option v-for="item in host_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #3:</label>
                                            <select class="selectable" v-model="ingress_host_column_3">
                                                <option v-for="item in host_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="clearfix"></div>
                                    <div class="button_set center-block text-center">
                                        <a class="btn btn-primary mini">
                                            Download
                                        </a>
                                    </div>
                                </section>
                            </tab>
                            <tab label="Import Action" class="" icon="dnl_icon dnl_arrow-point-to-right">
                                <section class="role_section">
                                    <h2 class="role_section_name">Import Action</h2>
                                    <div class="col-md-5 col-sm-6">
                                        <label>Import File:</label>
                                        <dropzone id="myVueDropzone5" url="https://httpbin.org/post" v-on:vdropzone-success="success"></dropzone>
                                    </div>
                                    <div class="col-md-7 col-sm-6">
                                        <label>Dublicate:</label>
                                        <div class="form-group">
                                            <div class="radio radio-success">
                                                <input id="radio-1" class="radio-custom" name="duplicates" type="radio" checked>
                                                <label for="radio-1" class="radio-custom-label">Ignore</label>
                                            </div>
                                        </div>
                                        <div class="form-group m-top-minus-25">
                                            <div class="radio radio-success">
                                                <input id="radio-2" class="radio-custom" name="duplicates" type="radio">
                                                <label for="radio-2" class="radio-custom-label">Delete</label>
                                            </div>
                                        </div>
                                        <div class="button_set little-space">
                                            <a class="btn btn-primary mini">
                                                Show Example
                                            </a>
                                        </div>
                                    </div>
                                    <div class="clearfix"></div>
                                    <div class="button_set col-md-12 col-sm-12">
                                        <a class="btn btn-primary mini">
                                            Upload
                                        </a>
                                    </div>
                                    <div class="clearfix"></div>
                                </section>
                            </tab>
                            <tab label="Export Action" class="" icon="dnl_icon dnl_arrow-point-to-right">
                                <section class="role_section">
                                    <h2 class="role_section_name">Export Action</h2>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Data Format:</label>
                                            <select2 :options="data_format_options" v-model="ingress_action_data_format"></select2>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group m-top-33">
                                            <div class="checkbox checkbox-success">
                                                <input id="ingress_export_with_headers_row" name="ingress_export_with_headers_row" type="checkbox" v-model="ingress_export_with_headers_row">
                                                <label for="ingress_export_with_headers_row">With headers row</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="clearfix"></div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            <label>Header Text:</label>
                                            <textarea v-model="header_text" class="form-control" placeholder="Enter Header Text" />
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            <label>Footer Text:</label>
                                            <textarea v-model="footer_text" class="form-control" placeholder="Enter Footer Text" />
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #1:</label>
                                            <select class="selectable" v-model="ingress_action_column_1">
                                                <option v-for="item in action_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #2:</label>
                                            <select class="selectable" v-model="ingress_action_column_2">
                                                <option v-for="item in action_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #3:</label>
                                            <select class="selectable" v-model="ingress_action_column_3">
                                                <option v-for="item in action_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #4:</label>
                                            <select class="selectable" v-model="ingress_action_column_4">
                                                <option v-for="item in action_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #5:</label>
                                            <select class="selectable" v-model="ingress_action_column_5">
                                                <option v-for="item in action_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #6:</label>
                                            <select class="selectable" v-model="ingress_action_column_6">
                                                <option v-for="item in action_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #7:</label>
                                            <select class="selectable" v-model="ingress_action_column_7">
                                                <option v-for="item in action_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #8:</label>
                                            <select class="selectable" v-model="ingress_action_column_8">
                                                <option v-for="item in action_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="clearfix"></div>
                                    <div class="button_set center-block text-center">
                                        <a class="btn btn-primary mini">
                                            Download
                                        </a>
                                    </div>
                                </section>
                            </tab>
                            <tab label="Import Digit Mapping" class="" icon="dnl_icon dnl_arrow-point-to-right">
                                <section class="role_section">
                                    <h2 class="role_section_name">Import Digit Mapping</h2>
                                    <div class="col-md-5 col-sm-6">
                                        <label>Import File:</label>
                                        <dropzone id="myVueDropzone6" url="https://httpbin.org/post" v-on:vdropzone-success="success"></dropzone>
                                    </div>
                                    <div class="col-md-7 col-sm-6">
                                        <label>Dublicate:</label>
                                        <div class="form-group">
                                            <div class="radio radio-success">
                                                <input id="radio-1" class="radio-custom" name="duplicates" type="radio" checked>
                                                <label for="radio-1" class="radio-custom-label">Ignore</label>
                                            </div>
                                        </div>
                                        <div class="form-group m-top-minus-25">
                                            <div class="radio radio-success">
                                                <input id="radio-2" class="radio-custom" name="duplicates" type="radio">
                                                <label for="radio-2" class="radio-custom-label">Delete</label>
                                            </div>
                                        </div>
                                        <div class="button_set little-space">
                                            <a class="btn btn-primary mini">
                                                Show Example
                                            </a>
                                        </div>
                                    </div>
                                    <div class="clearfix"></div>
                                    <div class="button_set col-md-12 col-sm-12">
                                        <a class="btn btn-primary mini">
                                            Upload
                                        </a>
                                    </div>
                                    <div class="clearfix"></div>
                                </section>
                            </tab>
                            <tab label="Export Digit Mapping" class="" icon="dnl_icon dnl_arrow-point-to-right">
                                <section class="role_section">
                                    <h2 class="role_section_name">Export Digit Mapping</h2>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Data Format:</label>
                                            <select2 :options="data_format_options" v-model="digit_mapping_data_format"></select2>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group m-top-33">
                                            <div class="checkbox checkbox-success">
                                                <input id="ingress_digit_with_headers_row" name="ingress_digit_with_headers_row" type="checkbox" v-model="ingress_digit_with_headers_row">
                                                <label for="ingress_digit_with_headers_row">With headers row</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="clearfix"></div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            <label>Header Text:</label>
                                            <textarea v-model="header_text" class="form-control" placeholder="Enter Header Text" />
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            <label>Footer Text:</label>
                                            <textarea v-model="footer_text" class="form-control" placeholder="Enter Footer Text" />
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #1:</label>
                                            <select class="selectable" v-model="digit_mapping_column_1">
                                                <option v-for="item in digit_mapping_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #2:</label>
                                            <select class="selectable" v-model="digit_mapping_column_2">
                                                <option v-for="item in digit_mapping_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group full-width-select">
                                            <label for="username">Column #3:</label>
                                            <select class="selectable" v-model="digit_mapping_column_3">
                                                <option v-for="item in digit_mapping_column_options" v-bind:value="item.id">
                                                    {{ item.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="clearfix"></div>
                                    <div class="button_set center-block text-center">
                                        <a class="btn btn-primary mini">
                                            Download
                                        </a>
                                    </div>
                                </section>
                            </tab>
                        </tabs>
                        <div class="clearfix"></div>
                    </tab>
                </tabs>
                <div class="clearfix"></div>
            </div>
        </div>
        <modal v-if="showModal=='host_port'" @close="showModal = ''" class="big_modal">

            <h3 slot="header">Host Port</h3>
            <div slot="body">
                <div class="">
                    <div class="table-responsive">
                        <spinner v-show="loading_host" class="spinner"></spinner>
                        <div v-show="loading_host" class="mask"></div>
                        <table class="table table-striped table-hover carrier_groups aligned-center">
                            <thead>
                                <tr>
                                    <th>Host</th>
                                    <th>IP</th>
                                    <th>Port</th>
                                    <th>CPS</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="host in hosts">
                                    <td>{{host.host}}</td>
                                    <td>{{host.ip}}</td>
                                    <td>{{host.port}}</td>
                                    <td>{{host.cps}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <button @click="closeModal" class="btn btn-default mini cancel centered">Cancel</button>
            </div>
        </modal>
        <modal v-if="showModal=='template'" @close="showModal=''">
            <h3 slot="header">Save as Template</h3>
            <div slot="body">
                <div class="row">
                    <div class="col-sm-12">
                        <div class="form-group" style="text-align: left">
                            <label>Template Name:</label>
                            <input type="text" name="template_name" v-model="template_name" class="form-control" placeholder="Enter Template Name">
                        </div>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <button class="btn btn-primary submit mini" @click="saveAsTemp">Submit</button>
                <button @click="closeModal" class="btn btn-default cancel mini">Cancel</button>
            </div>
        </modal>
    </div>
</template>

<script>   
const vTabs = require('vue!../main_components/tabs.vue'),
    vTab = require('vue!../main_components/tab.vue'),
    vSelect = require('vue!../main_components/select.vue'),
    Dropzone = require('vue!../main_components/dropzone.vue'),
    Pagination = require('vue!../main_components/pagination.vue'),
    confirmmodal = require('vue!../main_components/confirm_delete.vue'),
    vSpinner = require('vue!../main_components/fadeloader.vue'),
    modal = require('vue!../main_components/modal.vue');
const api = require("../../api");
const auth = require("../../auth");
import { mapActions } from 'vuex'
import _ from 'lodash'


module.exports = {
    components: {
        'spinner': vSpinner,
        Dropzone,
        'tabs': vTabs,
        'tab': vTab,
        'select2': vSelect,
        'pagination': Pagination,
        'modal': modal,
        'confirm': confirmmodal,
    },
    props: ['type', 'group_id'],
    data: function() {
        return {
            ingress_import_method: 'delete',
            is_success_to_upload_host: false,
            actived_sub_tab: 'Egress List',
            egress_import_host_method: 'delete',
            ingress_import_host_method: 'delete',
            egress_import_action_method: 'delete',
            order: '',
            sort: '',
            name_sort: 'asc',
            loading: false,
            rate_tables: [],
            egress_search: '',
            ingress_search: '',
            trunk_id: '',
            template_name: '',
            loading_host: false,
            temp_ingress_trunk_table_columns: ['Host Post', 'Ingress ID', 'Ingress Name', 'Carriers', 'Call Limit', 'CPS Limit', 'Trunk Count', 'Margin', 'PDD Timeout', 'Updated at', 'Updated by', 'Action'],
            ingress_trunk_table_columns: ['Host Post', 'Ingress ID', 'Ingress Name', 'Carriers', 'Call Limit', 'CPS Limit', 'Trunk Count', 'Margin', 'PDD Timeout', 'Updated at', 'Updated by', 'Action'],
            ingress_trunk_showcolumns: [true, true, true, true, true, true, true, true, true, true, true, true],
            ingress_trunk_table_column_options: [{
                value: 'Host Post',
                label: 'Host Post'
            },
            {
                value: 'Ingress ID',
                label: 'Ingress ID'
            },
            {
                value: 'Ingress Name',
                label: 'Ingress Name'
            },
            {
                value: 'Carriers',
                label: 'Carriers'
            },
            {
                value: 'Call Limit',
                label: 'Call Limit'
            },
            {
                value: 'CPS Limit',
                label: 'CPS Limit'
            },
            {
                value: 'Trunk Count',
                label: 'Trunk Count'
            },
            {
                value: 'Margin',
                label: 'Margin'
            },
            {
                value: 'PDD Timeout',
                label: 'PDD Timeout'
            },
            {
                value: 'Updated at',
                label: 'Updated at'
            },
            {
                value: 'Updated by',
                label: 'Updated by'
            },
            {
                value: 'Action',
                label: 'Action'
            }
            ],
            egress_trunk_table_column_options: [{
                value: 'Host Post',
                label: 'Host Post'
            },
            {
                value: 'Egress ID',
                label: 'Egress ID'
            },
            {
                value: 'Egress Name',
                label: 'Egress Name'
            },
            {
                value: 'Carriers',
                label: 'Carriers'
            },
            {
                value: 'Call Limit',
                label: 'Call Limit'
            },
            {
                value: 'CPS Limit',
                label: 'CPS Limit'
            },
            {
                value: 'Usage Count',
                label: 'Usage Count'
            },
            {
                value: 'Rate Table',
                label: 'Rate Table'
            },
            {
                value: 'PDD Timeout',
                label: 'PDD Timeout'
            },
            {
                value: 'Updated at',
                label: 'Updated at'
            },
            {
                value: 'Updated by',
                label: 'Updated by'
            },
            {
                value: 'Action',
                label: 'Action'
            }
            ],
            temp_egress_trunk_table_columns: ['Host Post', 'Egress ID', 'Egress Name', 'Carriers', 'Call Limit', 'CPS Limit', 'Usage Count', 'Rate Table', 'PDD Timeout', 'Updated at', 'Updated by', 'Action'],
            egress_trunk_table_columns: ['Host Post', 'Egress ID', 'Egress Name', 'Carriers', 'Call Limit', 'CPS Limit', 'Usage Count', 'Rate Table', 'PDD Timeout', 'Updated at', 'Updated by', 'Action'],
            egress_trunk_showcolumns: [true, true, true, true, true, true, true, true, true, true, true, true],
            ingress_page_count: 1,
            egress_page_count: 1,
            page_count_options: [
                { id: 1, text: '10' },
                { id: 2, text: '20' },
                { id: 3, text: '30' },
                { id: 4, text: '50' },
                { id: 5, text: '100' }
            ],
            status_options: [
                { id: 'all', text: 'All' },
                { id: 'active', text: 'Active' },
                { id: 'deactive', text: 'Deactive' },
            ],
            egress_with_headers_row: false,
            ingress_with_headers_row: false,
            egress_host_with_headers_row: false,
            ingress_host_with_headers_row: false,
            egress_action_with_headers_row: false,
            ingress_action_with_headers_row: false,
            ingress_digit_with_headers_row: false,
            digit_mapping_data_format: 'csv',
            digit_mapping_column_1: 'trunk_name',
            digit_mapping_column_2: 'translation_name',
            digit_mapping_column_3: 'time_profile_name',
            digit_mapping_column_options: [
                { id: 'trunk_name', text: 'trunk_name' },
                { id: 'translation_name', text: 'translation_name' },
                { id: 'time_profile_name', text: 'time_profile_name' },
            ],

            ingress_action_data_format: 'csv',
            ingress_action_column_1: 'trunk_name',
            ingress_action_column_2: 'time_profile_name',
            ingress_action_column_3: 'target',
            ingress_action_column_4: 'code',
            ingress_action_column_5: 'action',
            ingress_action_column_6: 'chars',
            ingress_action_column_7: 'number_type',
            ingress_action_column_8: 'number_length',

            ingress_host_data_format: 'csv',
            ingress_host_column_1: 'trunk_name',
            ingress_host_column_2: 'ip',
            ingress_host_column_3: 'port',

            ingress_export_data_format: 'csv',
            ingress_export_column_1: 'trunk_id',
            ingress_export_column_2: 'trunk_name',
            ingress_export_column_3: 'carrier_name',
            ingress_export_column_4: 'media_type',
            ingress_export_column_5: 'cps_limit',
            ingress_export_column_6: 'call_limit',
            ingress_export_column_7: 'pdd_timeout',
            ingress_export_column_8: 'ignore_early_media',
            ingress_export_column_9: 'active',
            ingress_export_column_10: 'rfc2833',
            ingress_export_column_11: 'dip_from',
            ingress_export_column_12: 'min_duration',
            ingress_export_column_13: 'max_duration',
            ingress_export_column_14: 'rate_table_name',
            ingress_export_column_15: 'route_strategy_name',
            ingress_export_column_16: 'tech_prefix',
            ingress_export_column_17: 'profit_margin',
            ingress_export_column_options: [
                { id: '', text: '' },
                { id: 'trunk_id', text: 'trunk_id' },
                { id: 'trunk_name', text: 'trunk_name' },
                { id: 'carrier_name', text: 'carrier_name' },
                { id: 'media_type', text: 'media_type' },
                { id: 'cps_limit', text: 'cps_limit' },
                { id: 'call_limit', text: 'call_limit' },
                { id: 'pdd_timeout', text: 'pdd_timeout' },
                { id: 'ignore_early_media', text: 'ignore_early_media' },
                { id: 'active', text: 'active' },
                { id: 'rfc2833', text: 'rfc2833' },
                { id: 'dip_from', text: 'dip_from' },
                { id: 'min_duration', text: 'min_duration' },
                { id: 'max_duration', text: 'max_duration' },
                { id: 'rate_table_name', text: 'rate_table_name' },
                { id: 'route_strategy_name', text: 'route_strategy_name' },
                { id: 'tech_prefix', text: 'tech_prefix' },
                { id: 'profit_margin', text: 'profit_margin' },
            ],
            egress_action_data_format: 'csv',
            egress_action_column_1: 'trunk_name',
            egress_action_column_2: 'time_profile_name',
            egress_action_column_3: 'target',
            egress_action_column_4: 'code',
            egress_action_column_5: 'action',
            egress_action_column_6: 'chars',
            egress_action_column_7: 'number_type',
            egress_action_column_8: 'number_length',
            action_column_options: [
                { id: '', text: '' },
                { id: 'trunk_name', text: 'trunk_name' },
                { id: 'time_profile_name', text: 'time_profile_name' },
                { id: 'target', text: 'target' },
                { id: 'code', text: 'code' },
                { id: 'action', text: 'action' },
                { id: 'chars', text: 'chars' },
                { id: 'number_type', text: 'number_type' },
                { id: 'number_length', text: 'number_length' },
            ],
            host_data_format: 'csv',
            host_column_1: 'trunk_name',
            host_column_2: 'ip',
            host_column_3: 'port',
            host_column_options: [
                { id: '', text: '' },
                { id: 'trunk_name', text: 'trunk_name' },
                { id: 'ip', text: 'ip' },
                { id: 'port', text: 'port' },
            ],
            egress_data_format: 'csv',
            egress_column_1: 'trunk_id',
            egress_column_2: 'trunk_name',
            egress_column_3: 'carrier_name',
            egress_column_4: 'media_type',
            egress_column_5: 'call_limit',
            egress_column_6: 'cps_limit',
            egress_column_7: 'pdd_timeout',
            egress_column_8: 'active',
            egress_column_9: 'rate_table_name',
            egress_column_10: 'host_route_strategy',
            egress_column_11: 'rfc2833',
            egress_column_12: 'pass_dip_head',
            egress_column_13: 'min_duration',
            egress_column_14: 'profit_margin',
            egress_column_options: [
                { id: '', text: '' },
                { id: 'trunk_id', text: 'trunk_id' },
                { id: 'trunk_name', text: 'trunk_name' },
                { id: 'carrier_name', text: 'carrier_name' },
                { id: 'media_type', text: 'media_type' },
                { id: 'call_limit', text: 'call_limit' },
                { id: 'cps_limit', text: 'cps_limit' },
                { id: 'pdd_timeout', text: 'pdd_timeout' },
                { id: 'active', text: 'active' },
                { id: 'rate_table_name', text: 'rate_table_name' },
                { id: 'host_route_strategy', text: 'host_route_strategy' },
                { id: 'rfc2833', text: 'rfc2833' },
                { id: 'pass_dip_head', text: 'pass_dip_head' },
                { id: 'min_duration', text: 'min_duration' },
                { id: 'max_duration', text: 'max_duration' },
                { id: 'profit_margin', text: 'profit_margin' },
            ],
            data_format_options: [
                { id: 'csv', text: 'CSV' },
                { id: 'xls', text: 'XLS' },
            ],
            trunk_type: 'egress',
            apiUrl: '/v1/trunk/',
            egressPageOne: {
                currentPage: 1,
                totalPages: 10,
                cntpage: 10
            },
            orderEgress: 'resource_id',
            sortEgress: 'desc',
            nameSortEgress: 'asc',
            ingressPageOne: {
                currentPage: 1,
                totalPages: 10,
                cntpage: 10
            },
            orderIngress: 'resource_id',
            sortIngress: 'desc',
            nameSortIngress: 'asc',
            header_text: '',
            footer_text: '',
            data_format: '',
            showModal: '',

            status: 'all',
            checker: false,

            search: '',
            selected2: 0,
            options2: [
                { id: 1, text: 'Group Name' },
                { id: 2, text: 'Carrier Count' },
                { id: 3, text: 'Actions' }
            ],
            select: '1',
            options: [
                { id: 1, text: 'option1' },
                { id: 2, text: 'option2' },
                { id: 3, text: 'option3' },
                { id: 4, text: 'option4' },
                { id: 5, text: 'option5' }
            ],
            hosts: [
                {
                    host: '1',
                    ip: 'null',
                    port: '5060',
                    cps: '-',
                },
                {
                    host: '1',
                    ip: 'null',
                    port: '5060',
                    cps: '-',
                }
            ],
            egress_lists: [],
            ingress_lists: [],
            selected_egress_ids: [],
            selected_ingress_ids: [],
            showEgressModal: '',
            showIngressModal: '',
        }
    },
    methods: {
        ...mapActions({
            setMessage: 'app_message/setAppMessage'
        }),
        exportExampleIngressCSV() {
            var vm = this;
            var csvContent = "data:text/csv;charset=utf-8,";
            var csvArray = new Array();
            // var fields = ["id", "country", "state", "prefix", "ocn", "lata", "block_id", "effective_date"];
            var fields = ["trunk_name", "carrier_name", "media_type", "cps_limit", "call_limit", "pdd_timeout", "ignore_early_media", "active", "rfc2833", "dip_from", "min_duration", "max_duration"];
            csvArray.push(fields);
            var values = new Array();

            values.push("ingress_001 ");
            values.push("client_001 ");
            values.push("bypass/proxy ");
            values.push("1 ");
            values.push("1 ");
            values.push("1000 ");
            values.push("none/180/183/180 and 183 ");
            values.push("true/false ");
            values.push("true/false ");
            values.push("client/server ");
            values.push("1 ");
            values.push("1 ");

            csvArray.push(values);
            exportToCsv('ingress.csv', csvArray);
        },
        exportExampleEgressCSV() {
            var vm = this;
            var csvContent = "data:text/csv;charset=utf-8,";
            var csvArray = new Array();
            // var fields = ["id", "country", "state", "prefix", "ocn", "lata", "block_id", "effective_date"];
            var fields = ["trunk_name", "carrier_name", "media_type", "call_limit", "cps_limit", "pdd_timeout", "active", "rate_table_name", "host_route_strategy", "rfc2833", "pass_dip_head", "min_duration", "max_duration"];
            csvArray.push(fields);
            var values = new Array();

            values.push("egress_001 ");
            values.push("client_002 ");
            values.push("bypass/proxy ");
            values.push("1 ");
            values.push("1 ");
            values.push("1000 ");
            values.push("true/false ");
            values.push("rate_table_001 ");
            values.push("round-robin/top-down ");
            values.push("true/false ");
            values.push("true/false ");
            values.push("1 ");
            values.push("1 ");

            csvArray.push(values);
            exportToCsv('egress.csv', csvArray);
        },
        uploadEgressHostCSV() {
            if (this.is_success_to_upload_host == false)
                this.setMessage({
                    message: 'You should select a file',
                    type: 'error'
                })
        },
        exportExampleHostCSV() {
            var vm = this;
            var csvContent = "data:text/csv;charset=utf-8,";
            var csvArray = new Array();
            // var fields = ["id", "country", "state", "prefix", "ocn", "lata", "block_id", "effective_date"];
            var fields = ["trunk_name", "ip", "port"];
            csvArray.push(fields);
            var values = new Array();

            values.push("ingress_001 ");
            values.push("192.168.1.10 ");
            values.push("5060 ");
            csvArray.push(values);
            exportToCsv('host.csv', csvArray);
        },
        exportExampleActionCSV() {
            var vm = this;
            var csvContent = "data:text/csv;charset=utf-8,";
            var csvArray = new Array();
            // var fields = ["id", "country", "state", "prefix", "ocn", "lata", "block_id", "effective_date"];
            var fields = ["trunk_name", "time_profile_name", "target", "code", "action", "chars", "number_type", "number_length"];
            csvArray.push(fields);
            var values = new Array();

            values.push("ingress_001 ");
            values.push("time_profile_001 ");
            values.push("ani/dnis ");
            values.push("1 ");
            values.push("add_prefix/del_prefix/add_suffix/del_suffix ");
            values.push("1 ");
            values.push("all/>/=/< ");
            values.push("10 ");
            csvArray.push(values);
            exportToCsv('resource_action.csv', csvArray);
        },
        exportAction() {
            var vm = this;
            var csvContent = "data:text/csv;charset=utf-8,";
            var csvArray = new Array();
            var fields = ["trunk_name", "time_profile_name", "target", "code", "action", "chars", "number_type", "number_length"];
            csvArray.push(fields);
            this.egress_lists.forEach(function(egress, i) {
                var values = new Array();

                values.push(egress.trunk_name + "");
                values.push(egress.carrier + "");
                values.push(egress.bypass_media + "");
                values.push(egress.call_limit + "");
                values.push(egress.cps_limit + "");
                values.push(egress.media_timeout + "");
                values.push(egress.is_active + "");
                values.push(egress.rate_table_id + "");
                csvArray.push(values);
            });
            exportToCsv('egress_trunks_export.csv', csvArray);
        },
        sortIngressColumn(column) {
            if (this.name_sort == 'asc') {
                this.name_sort = 'desc'
                this.sort = this.name_sort
                this.order = column
                this.fetchIngress()
            }

            else if (this.name_sort == 'desc') {
                this.name_sort = 'asc'
                this.sort = this.name_sort
                this.order = column
                this.fetchIngress()
            }
        },
        sortEgressColumn(column) {
            if (this.name_sort == 'asc') {
                this.name_sort = 'desc'
                this.sort = this.name_sort
                this.order = column
                this.fetchEgress()
            }

            else if (this.name_sort == 'desc') {
                this.name_sort = 'asc'
                this.sort = this.name_sort
                this.order = column
                this.fetchEgress()
            }
        },
        fetchGroup() {
            console.log("fetchGroup");
			this.loading = true;
            this.$http.get(api.getEndpointUrl() + "/v1/trunk/group/" + this.group_id)
            .then(function(response) {
					var self = this;
					this.loading = false;
					var item = response.body.payload;

					var trunks = [];

					item.trunks.forEach(function(trunk, i) {
						trunks.push(trunk.trunk_id);
                    });
                    
                    if(this.type == 'egress') {
                        this.fetchEgressByIds(trunks)
                        this.fetchIngress();
                    }
                    else if(this.type == 'ingress') {
                        this.fetchEgress();
                        this.fetchIngressByIds(trunks)
                    }

					console.log(trunks);
				}, function(error) {
					this.loading = false;
					console.log(error);
				});
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

                            rate_tables.forEach(function (temp, i) {
                                var rate_table = {};
                                rate_table.id = temp.rate_table_id;
                                rate_table.text = temp.name;
                                self.rate_tables.push(rate_table);
                            });
                            
                            if(this.type == undefined) {
                                this.fetchEgress();
                                this.fetchIngress();
                            }                            
                            else {
                                this.fetchGroup();
                            }
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
        searchByEgressTrunkName() {
            this.ingressPageOne.currentPage = 1;
            var page = this.ingressPageOne.currentPage - 1;
            var per_page = this.ingressPageOne.cntpage;
            this.loading = true;

            this.$http.get(api.getEndpointUrl() + "/v1/trunk/egress/list?name=" + this.egress_search + "&page=" + page + "&per_page=" + per_page + "&order_by=resource_id&order_dir=desc",
                {
                    headers: {
                        "X-Auth-Token": auth.getToken()
                    }
                }).then(function(response) {
                    this.loading = false;
                    //todo: check success flag? validation errors?
                    var egress_lists = response.body.payload.items;
                    console.log(egress_lists);
                    this.egress_lists = egress_lists;
                    var total_page = response.body.payload.total;
                    this.egressPageOne.currentPage = response.body.payload.page + 1;
                    this.egressPageOne.totalPages = Math.ceil(response.body.payload.total / per_page);
                }, function(error) {
                    this.loading = false;
                    console.log(error);
                });
        },
        searchByIngressTrunkName() {
            this.ingressPageOne.currentPage = 1;
            var page = this.ingressPageOne.currentPage - 1;
            var per_page = this.ingressPageOne.cntpage;
            this.loading = true;

            this.$http.get(api.getEndpointUrl() + "/v1/trunk/ingress/list?name=" + this.ingress_search + "&page=" + page + "&per_page=" + per_page + "&order_by=resource_id&order_dir=desc",
                {
                    headers: {
                        "X-Auth-Token": auth.getToken()
                    }
                }).then(function(response) {
                    this.loading = false;
                    //todo: check success flag? validation errors?
                    var ingress_lists = response.body.payload.items;
                    console.log(ingress_lists);
                    this.ingress_lists = ingress_lists;
                    var total_page = response.body.payload.total;
                    this.ingressPageOne.currentPage = response.body.payload.page + 1;
                    this.ingressPageOne.totalPages = Math.ceil(response.body.payload.total / per_page);
                }, function(error) {
                    this.loading = false;
                    console.log(error);
                });
        },
        exportIngress() {
            var vm = this;
            var csvContent = "data:text/csv;charset=utf-8,";
            var csvArray = new Array();
            // var fields = ["id", "country", "state", "prefix", "ocn", "lata", "block_id", "effective_date"];
            var fields = [];
            if (this.ingress_export_column_1 != '')
                fields.push(this.ingress_export_column_1);
            if (this.ingress_export_column_2 != '')
                fields.push(this.ingress_export_column_2);
            if (this.ingress_export_column_3 != '')
                fields.push(this.ingress_export_column_3);
            if (this.ingress_export_column_4 != '')
                fields.push(this.ingress_export_column_4);
            if (this.ingress_export_column_5 != '')
                fields.push(this.ingress_export_column_5);
            if (this.ingress_export_column_6 != '')
                fields.push(this.ingress_export_column_6);
            if (this.ingress_export_column_7 != '')
                fields.push(this.ingress_export_column_7);
            if (this.ingress_export_column_8 != '')
                fields.push(this.ingress_export_column_8);
            if (this.ingress_export_column_9 != '')
                fields.push(this.ingress_export_column_9);
            if (this.ingress_export_column_10 != '')
                fields.push(this.ingress_export_column_10);
            if (this.ingress_export_column_11 != '')
                fields.push(this.ingress_export_column_11);
            if (this.ingress_export_column_12 != '')
                fields.push(this.ingress_export_column_12);
            if (this.ingress_export_column_13 != '')
                fields.push(this.ingress_export_column_13);
            if (this.ingress_export_column_14 != '')
                fields.push(this.ingress_export_column_14);
            if (this.ingress_export_column_15 != '')
                fields.push(this.ingress_export_column_15);
            if (this.ingress_export_column_16 != '')
                fields.push(this.ingress_export_column_16);
            if (this.ingress_export_column_17 != '')
                fields.push(this.ingress_export_column_17);

            // var fields = ["trunk_id", "trunk_name", "carrier_name", "media_type", "call_limit", "cps_limit", "pdd_timeout", "ignore_early_media", "active", "rfc2833", "dip_from", "min_duration", "max_duration", "rate_table_name", "host_route_strategy", "tech_prefix", "profit_margin"];
            csvArray.push(fields);
            this.ingress_lists.forEach(function(ingress, i) {
                var values = new Array();
                if (vm.ingress_export_column_1 != '')
                    values.push(ingress.trunk_id + "");
                if (vm.ingress_export_column_2 != '')
                    values.push(ingress.trunk_name + "");
                if (vm.ingress_export_column_3 != '')
                    values.push(ingress.carrier + "");
                if (vm.ingress_export_column_4 != '')
                    values.push(ingress.bypass_media + "");
                if (vm.ingress_export_column_5 != '')
                    values.push(ingress.call_limit + "");
                if (vm.ingress_export_column_6 != '')
                    values.push(ingress.cps_limit + "");
                if (vm.ingress_export_column_7 != '')
                    values.push(ingress.media_timeout + "");
                if (vm.ingress_export_column_8 != '')
                    values.push(ingress.ignore_early_media + "");
                if (vm.ingress_export_column_9 != '')
                    values.push(ingress.is_active + "");
                if (vm.ingress_export_column_10 != '')
                    values.push(ingress.t38 + "");
                if (vm.ingress_export_column_11 != '')
                    values.push(ingress.dip_from + "");
                if (vm.ingress_export_column_12 != '')
                    values.push(ingress.min_duration + "");
                if (vm.ingress_export_column_13 != '')
                    values.push(ingress.max_duration + "");
                if (vm.ingress_export_column_14 != '')
                    values.push(ingress.rate_table_id + "");
                if (vm.ingress_export_column_15 != '')
                    values.push(ingress.host_routing_strategy + "");
                if (vm.ingress_export_column_16 != '')
                    values.push(ingress.prefix + "");
                if (vm.ingress_export_column_17 != '')
                    values.push(ingress.min_profit_value + "");

                csvArray.push(values);
            });
            exportToCsv('ingress_trunks_export.csv', csvArray);
        },
        exportEgress() {
            var vm = this;
            var csvContent = "data:text/csv;charset=utf-8,";
            var csvArray = new Array();
            // var fields = ["id", "country", "state", "prefix", "ocn", "lata", "block_id", "effective_date"];
            var fields = [];
            if (this.egress_action_column_1 != '')
                fields.push(this.egress_action_column_1);
            if (this.egress_action_column_2 != '')
                fields.push(this.egress_action_column_2);
            if (this.egress_action_column_3 != '')
                fields.push(this.egress_action_column_3);
            if (this.egress_action_column_4 != '')
                fields.push(this.egress_action_column_4);
            if (this.egress_action_column_5 != '')
                fields.push(this.egress_action_column_5);
            if (this.egress_action_column_6 != '')
                fields.push(this.egress_action_column_6);
            if (this.egress_action_column_7 != '')
                fields.push(this.egress_action_column_7);
            if (this.egress_action_column_8 != '')
                fields.push(this.egress_action_column_8);
            if (this.egress_action_column_9 != '')
                fields.push(this.egress_action_column_9);
            if (this.egress_action_column_10 != '')
                fields.push(this.egress_action_column_10);
            if (this.egress_action_column_11 != '')
                fields.push(this.egress_action_column_11);
            if (this.egress_action_column_12 != '')
                fields.push(this.egress_action_column_12);
            if (this.egress_action_column_13 != '')
                fields.push(this.egress_action_column_13);
            if (this.egress_action_column_14 != '')
                fields.push(this.egress_action_column_14);

            // var fields = ["trunk_id", "trunk_name", "carrier_name", "media_type", "call_limit", "cps_limit", "pdd_timeout", "active", "rate_table_name", "host_route_strategy", "rfc2833", "pass_dip_head", "min_duration", "profit_margin"];
            csvArray.push(fields);
            this.egress_lists.forEach(function(egress, i) {
                var values = new Array();
                if (vm.egress_action_column_1 != '')
                    values.push(egress.trunk_id + "");
                if (vm.egress_action_column_2 != '')
                    values.push(egress.trunk_name + "");
                if (vm.egress_action_column_3 != '')
                    values.push(egress.carrier + "");
                if (vm.egress_action_column_4 != '')
                    values.push(egress.bypass_media + "");
                if (vm.egress_action_column_5 != '')
                    values.push(egress.call_limit + "");
                if (vm.egress_action_column_6 != '')
                    values.push(egress.cps_limit + "");
                if (vm.egress_action_column_7 != '')
                    values.push(egress.media_timeout + "");
                if (vm.egress_action_column_8 != '')
                    values.push(egress.is_active + "");
                if (vm.egress_action_column_9 != '')
                    values.push(egress.rate_table_id + "");
                if (vm.egress_action_column_10 != '')
                    values.push(egress.host_routing_strategy + "");
                if (vm.egress_action_column_11 != '')
                    values.push(egress.t38 + "");
                if (vm.egress_action_column_12 != '')
                    values.push(egress.pass_lrn + "");
                if (vm.egress_action_column_13 != '')
                    values.push(egress.min_duration + "");
                if (vm.egress_action_column_14 != '')
                    values.push(egress.min_profit_value + "");
                csvArray.push(values);
            });
            exportToCsv('egress_trunks_export.csv', csvArray);
        },
        exportHost() {
            // var vm = this;		
            // console.log(this.egress_lists);
            // var csvArray = new Array();
            // var fields = [];
            // fields.push(this.host_column_1);
            // if(this.host_column_2 != this.host_column_1)
            //     fields.push(this.host_column_2);
            // if(this.host_column_3 != this.host_column_1 && this.host_column_3 != this.host_column_2)
            //     fields.push(this.host_column_3);
            // // var fields = [this.host_column_1, this.host_column_2, this.host_column_3];
            // csvArray.push(fields);
            // console.log(fields);
            // console.log(csvArray);
            // var csvContent = "data:text/csv;charset=utf-8,";                        
            // this.egress_lists.forEach(function (egress, i) {
            //     var values = new Array();
            //     if(i != 0)
            //     {
            //         csvContent += ",\n";
            //     } 
            //     csvContent += "{\n";
            //     fields.forEach(function (field, j) {
            //         console.log(field);
            //         if(field == 'trunk_name') {
            //             csvContent += "trunk_name:" + egress.trunk_name + ",\n";
            //             values.push(egress.trunk_name);
            //         }
            //         else if(field == 'ip' || field == 'port') {
            //             egress.ip.forEach(function (host, k) {
            //                 if(field == 'ip') {
            //                     csvContent += "ip:" + host.ip + ",\n";
            //                     values.push(host.ip);
            //                 }
            //                 if(field == 'port') {
            //                     csvContent += "port:" + host.port + ",\n";
            //                     values.push(host.port);
            //                 }
            //             })
            //         }
            //         else {
            //         }
            //         csvContent += "}"; 
            //         console.log(csvContent);
            //     })
            //     csvArray.push(values);                
            // });	                                
            // window.open(encodeURI(csvContent) );   
            var vm = this;
            var csvContent = "data:text/csv;charset=utf-8,";
            var csvArray = new Array();
            var fields = ["trunk_name", "ip", "port"];
            csvArray.push(fields);
            this.egress_lists.forEach(function(egress, i) {
                console.log(egress);
                var values = new Array();
                egress.ip.forEach(function(host, j) {
                    console.log(host);
                    values.push(egress.trunk_name + "");
                    values.push(host.ip + "");
                    values.push(host.port + "");
                    csvArray.push(values);
                })

            });
            exportToCsv('egress_host_export.csv', csvArray);
        },
        changeStatus(type, item) {
            var url;
            if (type == 'egress')
                url = api.getEndpointUrl() + '/v1/egress_trunk/' + item.resource_id;
            else if (type == 'ingress')
                url = api.getEndpointUrl() + '/v1/ingress_trunk/' + item.resource_id;
            this.$http.patch(url, {
                is_active: !item.is_active,
                rate_table_id: item.rate_table_id
            })
                .then(response => {
                    console.log(response.data);
                    item.is_active = !item.is_active;
                    if (!item.is_active)
                        this.setMessage('The trunk has been deactivated!');
                    if (item.is_active)
                        this.setMessage('The trunk has been activated!');
                })
                .catch(error => {
                    console.log(error)
                    if (item.is_active)
                        this.setMessage({
                            message: 'Failed to deactivate',
                            type: 'error'
                        })
                    if (!item.is_active)
                        this.setMessage({
                            message: 'Failed to activate',
                            type: 'error'
                        })

                })
        },
        sendInterop(id) {
            const url = api.getEndpointUrl() + '/v1/trunk/' + id + '/send_interop'
            this.$http.patch(url)
                .then(response => {
                    console.log(response.data);
                    this.setMessage('Success to send interop of the trunk');
                    // if (response.body.success) {
                    //     this.setMessage('Success to send interop of the trunk');
                    // }
                })
                .catch(error => {
                    console.log(error)
                    this.setMessage({
                        message: 'Failed to send interop',
                        type: 'error'
                    })
                })
        },
        fetchHost(id) {
            this.loading_host = true
            const url = api.getEndpointUrl() + '/v1/trunk/ip/list?resource_id=' + id
            this.$http.get(url)
                .then(response => {
                    const body = response.body

                    if (body.success) {
                        this.hosts = body.payload.items
                    }
                    this.loading_host = false
                })
                .catch(error => {
                    console.log(error)
                })
        },
        viewHost(id) {
            this.hosts = [];
            this.showModal = 'host_port';
            this.fetchHost(id);
        },
        handleChangeIngress() {
            for (let i = 0; i < this.temp_ingress_trunk_table_columns.length; i++) {
                if (_.indexOf(this.ingress_trunk_table_columns, this.temp_ingress_trunk_table_columns[i]) != -1) {
                    Vue.set(this.ingress_trunk_showcolumns, i, true);
                }
                else {
                    Vue.set(this.ingress_trunk_showcolumns, i, false);
                }
            }
        },
        handleChangeEgress() {
            for (let i = 0; i < this.temp_egress_trunk_table_columns.length; i++) {
                if (_.indexOf(this.egress_trunk_table_columns, this.temp_egress_trunk_table_columns[i]) != -1) {
                    Vue.set(this.egress_trunk_showcolumns, i, true);
                }
                else {
                    Vue.set(this.egress_trunk_showcolumns, i, false);
                }
            }
        },
        activateSubTab(tab) {
            this.actived_sub_tab = tab.name;
        },
        activateTab(tab) {
            if (tab.name == "Egress Trunk") {
                this.trunk_type = "egress";
            }
            else if (tab.name == "Ingress Trunk") {
                this.trunk_type = "ingress";
            }
        },
        submitDeleteEgress: function() {
            var vm = this;
            this.showEgressModal = false;

            this.selected_egress_ids.forEach(function(item, i) {
                var trunkid = item;
                if (trunkid == 0) {
                    vm.setMessage({
                        message: 'The trunk has been not selected!',
                        type: 'error'
                    });
                }
                else {
                    vm.loading = true;
                    vm.resource = vm.$resource(api.getEndpointUrl() + '/v1/egress_trunk/' + trunkid);
                    vm.resource.delete({ resource_id: trunkid }).then(function(response) {
                        vm.loading = false;
                        let index = _.findIndex(vm.egress_lists, elem => elem.resource_id === trunkid)
                        vm.egress_lists.splice(index, 1)
                        vm.setMessage('The trunk have been deleted!')
                    });
                }
            });
        },
        submitDeleteIngress: function() {
            var vm = this;
            this.showIngressModal = false;

            this.selected_ingress_ids.forEach(function(item, i) {
                var trunkid = item;
                if (trunkid == 0) {
                    vm.setMessage({
                        message: 'The trunk has been not selected!',
                        type: 'error'
                    });
                }
                else {
                    vm.loading = true;
                    vm.resource = vm.$resource(api.getEndpointUrl() + '/v1/ingress_trunk/' + trunkid);
                    vm.resource.delete({ resource_id: trunkid }).then(function(response) {
                        vm.loading = false;
                        let index = _.findIndex(vm.ingress_lists, elem => elem.resource_id === trunkid)
                        vm.ingress_lists.splice(index, 1)
                        vm.setMessage('The trunk have been deleted!')
                    });
                }
            });
        },
        delete_egress_trunk: function(id) {
            this.showEgressModal = true;
            this.selected_egress_ids = [];
            this.selected_egress_ids.push(id);
        },
        delete_ingress_trunk: function(id) {
            this.showIngressModal = true;
            this.selected_ingress_ids = [];
            this.selected_ingress_ids.push(id);
        },
        saveAsTemp() {
            var url;
            if (this.trunk_type == "egress")
                url = api.getEndpointUrl() + "/v1/trunk/egress/" + this.trunk_id + "/save_as_template"
            else if (this.trunk_type == "ingress")
                url = api.getEndpointUrl() + "/v1/trunk/ingress/" + this.trunk_id + "/save_as_template"

            const reqBody = {
                name: this.template_name
            };

            this.$http.post(url, reqBody)
                .then(response => {
                    if (response.body.success) {
                        this.setMessage('Trunk was changed successfully');
                        this.showModal = '';
                        this.template_name = '';
                    }
                })
                .catch(error => {
                    console.log(error)
                    this.setMessage({
                        message: 'Failed to change trunk',
                        type: 'error'
                    })
                })
        },
        edit_trunk: function(id, type) {
            // this.$router.push({ path:'/routing/trunks/edit/', query: {id: id, type: type}});
            this.$router.push({ path: "/routing/trunks/edit/" + id + "/" + type });
        },
        createNew: function() {
            this.$router.push({ path: '/routing/trunks/' + this.trunk_type + '/new' });
        },
        deleteAll: function(type) {
            if (type == 'egress') {
                this.selected_egress_ids = [];
                var vm = this;

                this.egress_lists.forEach(function(egress, i) {
                    vm.selected_egress_ids.push(egress.resource_id)
                });

                if (this.selected_egress_ids.length == 0) {
                    this.setMessage({
                        message: 'The egress list has been not selected!',
                        type: 'error'
                    });
                    this.checker = false;

                    return;
                }

                this.showEgressModal = true;
                if (this.checker)
                    this.checker = false;
            }
            else if (type == 'ingress') {
                this.selected_egress_ids = [];
                var vm = this;

                this.ingress_lists.forEach(function(ingress, i) {
                    vm.selected_ingress_ids.push(ingress.resource_id)
                });

                if (this.selected_ingress_ids.length == 0) {
                    this.setMessage({
                        message: 'The ingress list has been not selected!',
                        type: 'error'
                    });
                    this.checker = false;

                    return;
                }

                this.showIngressModal = true;
                if (this.checker)
                    this.checker = false;
            }
        },
        deleteSelected: function(type) {
            if (type == 'egress') {
                console.log(this.egress_lists);
                this.selected_egress_ids = [];
                var vm = this;
                this.egress_lists.forEach(function(egress, i) {
                    if (egress.status == true) {
                        vm.selected_egress_ids.push(egress.resource_id);
                    }
                });

                if (this.selected_egress_ids.length == 0) {
                    this.setMessage({
                        message: 'The egress trunk list has been not selected!',
                        type: 'error'
                    });

                    this.checker = false;
                    return;
                }

                this.showEgressModal = true;
                if (this.checker)
                    this.checker = false;
            }
            else if (type == 'ingress') {
                console.log(this.ingress_lists);
                this.selected_ingress_ids = [];
                var vm = this;
                this.ingress_lists.forEach(function(ingress, i) {
                    if (ingress.status == true) {
                        vm.selected_ingress_ids.push(ingress.resource_id);
                    }
                });

                if (this.selected_ingress_ids.length == 0) {
                    this.setMessage({
                        message: 'The ingress trunk list has been not selected!',
                        type: 'error'
                    });
                    this.checker = false;
                    return;
                }

                this.showIngressModal = true;
                if (this.checker)
                    this.checker = false;
            }
        },
        'success': function(file) {
            console.log('A file was successfully uploaded')

            if (this.actived_sub_tab == 'Import Host')
                this.is_success_to_upload_host = true;
        },
        closeModal: function() {
            this.showModal = '';
        },
        sortColumnEgress(column) {
            if (this.nameSortEgress == 'asc') {
                this.nameSortEgress = 'desc'
                this.sortEgress = this.nameSortEgress
                this.orderEgress = column
                this.fetchEgress()
            }

            else if (this.nameSortEgress == 'desc') {
                this.nameSortEgress = 'asc'
                this.sortEgress = this.nameSortEgress
                this.orderEgress = column
                this.fetchEgress()
            }
        },
        sortColumnIngress(column) {
            if (this.nameSortIngress == 'asc') {
                this.nameSortIngress = 'desc'
                this.sortIngress = this.nameSortIngress
                this.orderIngress = column
                this.fetchIngress()
            }

            else if (this.nameSortIngress == 'desc') {
                this.nameSortIngress = 'asc'
                this.sortIngress = this.nameSortIngress
                this.orderIngress = column
                this.fetchIngress()
            }
        },
        getQueries(type) {
            var page = '';
            var per_page = '';
            var order = '';
            if (type == 'egress') {
                page = '?page=' + (this.egressPageOne.currentPage - 1)
                per_page = '&per_page=' + this.egressPageOne.cntpage
                order = '&order_by=' + this.orderEgress + '&order_dir=' + this.sortEgress
            } else if (type == 'ingress') {
                page = '?page=' + (this.ingressPageOne.currentPage - 1)
                per_page = '&per_page=' + this.ingressPageOne.cntpage
                order = '&order_by=' + this.orderIngress + '&order_dir=' + this.sortIngress
            }
            return page + per_page + order
        },
        fetchEgressByIds(ids) {
            console.log("test");
            var page = this.egressPageOne.currentPage - 1;
            var per_page = this.egressPageOne.cntpage;

            var self = this;
            ids.forEach(function(item, index) {
                self.$http.get(api.getEndpointUrl() + "/v1/trunk/egress/list" + self.getQueries('egress') + "&resource_id=" + item)
                .then(function(response) {
                    self.loading = false;
                    //todo: check success flag? validation errors?
                    var egress_lists = response.body.payload.items;
                    console.log(egress_lists);
                    self.egress_lists.push(egress_lists[0]);
                    
                }, function(error) {
                    self.loading = false;
                    console.log(error);
                });
            })

            
            this.egress_lists.forEach(function(egress, i) {
                let index = _.findIndex(self.rate_tables, elem => elem.id === egress.rate_table_id)
                console.log(index);
                if (~index) {
                    egress.rate_table = self.rate_tables[index].text;
                }
            });
            // this.egressPageOne.currentPage = response.body.payload.page + 1;
            this.egressPageOne.totalPages = Math.ceil(ids.length / per_page);
        },
        fetchIngressByIds(ids) {
            console.log("test");
            var page = this.ingressPageOne.currentPage - 1;
            var per_page = this.ingressPageOne.cntpage;

            var self = this;
            ids.forEach(function(item, index) {
                self.$http.get(api.getEndpointUrl() + "/v1/trunk/ingress/list" + self.getQueries('ingress') + "&resource_id=" + item)
                .then(function(response) {
                    self.loading = false;
                    //todo: check success flag? validation errors?
                    var ingress_lists = response.body.payload.items;
                    console.log(ingress_lists);
                    self.ingress_lists.push(ingress_lists[0]);
                    
                }, function(error) {
                    self.loading = false;
                    console.log(error);
                });
            })

            
            this.ingress_lists.forEach(function(ingress, i) {
                let index = _.findIndex(self.rate_tables, elem => elem.id === ingress.rate_table_id)
                console.log(index);
                if (~index) {
                    ingress.rate_table = self.rate_tables[index].text;
                }
            });
            // this.ingressPageOne.currentPage = response.body.payload.page + 1;
            this.ingressPageOne.totalPages = Math.ceil(ids.length / per_page);

        },
        fetchEgress() {
            var page = this.egressPageOne.currentPage - 1;
            var per_page = this.egressPageOne.cntpage;

            this.$http.get(api.getEndpointUrl() + "/v1/trunk/egress/list" + this.getQueries('egress'),
                {
                    headers: {
                        "X-Auth-Token": auth.getToken()
                    }
                }).then(function(response) {
                    this.loading = false;
                    //todo: check success flag? validation errors?
                    var egress_lists = response.body.payload.items;
                    console.log(egress_lists);
                    this.egress_lists = egress_lists;
                    var vm = this;
                    this.egress_lists.forEach(function(egress, i) {
                        let index = _.findIndex(vm.rate_tables, elem => elem.id === egress.rate_table_id)
                        console.log(index);
                        if (~index) {
                            egress.rate_table = vm.rate_tables[index].text;
                        }
                    });
                    var total_page = response.body.payload.total;
                    this.egressPageOne.currentPage = response.body.payload.page + 1;
                    this.egressPageOne.totalPages = Math.ceil(response.body.payload.total / per_page);
                }, function(error) {
                    this.loading = false;
                    console.log(error);
                });
        },
        fetchIngress() {
            var page = this.ingressPageOne.currentPage - 1;
            var per_page = this.ingressPageOne.cntpage;
            this.loading = true;

            this.$http.get(api.getEndpointUrl() + "/v1/trunk/ingress/list" + this.getQueries('ingress'),
                {
                    headers: {
                        "X-Auth-Token": auth.getToken()
                    }
                }).then(function(response) {
                    this.loading = false;
                    //todo: check success flag? validation errors?
                    var ingress_lists = response.body.payload.items;
                    console.log("ingress_lists");
                    console.log(ingress_lists);
                    this.ingress_lists = ingress_lists;
                    var total_page = response.body.payload.total;
                    this.ingressPageOne.currentPage = response.body.payload.page + 1;
                    this.ingressPageOne.totalPages = Math.ceil(response.body.payload.total / per_page);
                }, function(error) {
                    this.loading = false;
                    console.log(error);
                });
        },
        egressPageOneChanged(pageNum) {
            if (pageNum !== this.egressPageOne.currentPage) {
                this.egressPageOne.currentPage = pageNum
                this.$nextTick(this.fetchEgress)
            }
        },
        egressChangePageCount(countPerPage) {
            if (countPerPage !== this.egressPageOne.cntpage) {
                this.egressPageOne.cntpage = countPerPage
                this.$nextTick(this.fetchEgress)
            }
        },
        ingressPageOneChanged(pageNum) {
            if (pageNum !== this.ingressPageOne.currentPage) {
                this.ingressPageOne.currentPage = pageNum
                this.$nextTick(this.fetchIngress)
            }
        },
        ingressChangePageCount(countPerPage) {
            if (countPerPage !== this.ingressPageOne.cntpage) {
                this.ingressPageOne.cntpage = countPerPage
                this.$nextTick(this.fetchIngress)
            }
        },
        'process': function() {
            var newArr = this.$children.filter(function(item) {
                return item.id === "myVueDropzone";
            });
            var newArr = this.$children.filter(function(item) {
                return item.id === "myVueDropzone2";
            });
            var newArr = this.$children.filter(function(item) {
                return item.id === "myVueDropzone3";
            });
            var newArr = this.$children.filter(function(item) {
                return item.id === "myVueDropzone4";
            });
            var newArr = this.$children.filter(function(item) {
                return item.id === "myVueDropzone5";
            });
            var newArr = this.$children.filter(function(item) {
                return item.id === "myVueDropzone6";
            });
            var newArr = this.$children.filter(function(item) {
                return item.id === "myVueDropzone7";
            });
            var component = newArr[0, 1, 2, 3, 4, 5, 6];
            component.processQueue()
        }
    },
    mounted: function() {
        $('[data-toggle="tooltip"]').tooltip();
    },
    created: function() {
        console.log(this.type);
        console.log(this.group_id);
        this.fetchRateTable();

    },
    updated: function() {
        var elementList = document.querySelectorAll('.el-input > input');
        for (var index = 0; index < elementList.length; index++) {
            elementList[index].placeholder = 'Show/Hide Columns';
        }
    },
}
</script>

<style>
.table-responsive.big_data table {
    min-width: 1200px;
}

.btn-group.m-top-10 {
    margin-top: 10px;
}

.button_set.relative {
    display: block;
    text-align: center;
}
@media (max-width: 320px){
    #app > div.container-fluid > div > div > div.tabs > div.tabs_container > div:nth-child(2) > div.tabs.vertical.mail_template > div.tabs_container > div:nth-child(1) > section > div.table-responsive.big_data > table > tbody > tr:nth-child(1) > td:nth-child(13) > a.action.action_send{
        padding-top: 1px;
    }
    #app > div.container-fluid > div > div > div.tabs > div.tabs_container > div:nth-child(2) > div.tabs.vertical.mail_template > div.tabs_container > div:nth-child(1) > section > div.table-responsive.big_data > table > tbody > tr:nth-child(1) > td:nth-child(13) > a.action.action_send > span{
        font-size: 11px!important;
    }
}
</style>
