$ = require('expose?$!expose?jQuery!jquery');
const bootstrap = require('bootstrap');
window.Vue = require('vue');
window.Highcharts = require('highcharts/highstock');
const api = require('./api');
const VueResource = require('vue-resource'),
    VeeValidate = require('vee-validate'),
    Vue2Filters = require('vue2-filters'),
    Overlay = require('vue-overlay'),
    highchartsMore = require('highcharts/highcharts-more')(Highcharts),
    SolidGauge = require('highcharts/modules/solid-gauge')(Highcharts),
    Exporting = require('highcharts/modules/exporting')(Highcharts),
    VueRouter = require('vue-router'),
    navigator = require('vue!./components/main_components/navigation.vue'),
    LoginView = require('vue!./components/auth/login.vue'),
    RegistrationView = require('vue!./components/auth/registration.vue'),
    ResetPasswordView = require('vue!./components/auth/reset_password.vue'),
    SuccessfulSignupView = require('vue!./components/auth/successful_registration.vue'),
    // ActiveRegistrationView = require('vue!./components/statistics/active_registration.vue'),
    SummaryReportView = require('vue!./components/statistics/summary_report.vue'),
    DashboardView = require('vue!./components/statistics/dashboard.vue'),
    AlertView = require('vue!./components/statistics/alert.vue'),
    IngressClientQosView = require('vue!./components/statistics/ingress_client_qos.vue'),
    EgressClientQosView = require('vue!./components/statistics/egress_client_qos.vue'),
    QosReportView = require('vue!./components/statistics/qos_report.vue'),
    AutoDeliveryView = require('vue!./components/statistics/auto_delivery.vue'),
    ChartsView = require('vue!./components/statistics/charts.vue'),
    ReportView = require('vue!./components/statistics/report.vue'),
    HostBasedReportView = require('vue!./components/statistics/host_based_report.vue'),
    CdrsSearchView = require('vue!./components/statistics/cdrs_search.vue'),
    DailyChannelUsageReportView = require('vue!./components/statistics/daily_channel_usage_report.vue'),
    DailyUsageDetailReportView = require('vue!./components/statistics/daily_usage_detail_report.vue'),
    LocationReportView = require('vue!./components/statistics/location_report.vue'),
    LrnDippingRecordView = require('vue!./components/statistics/lrn_dipping_record.vue'),
    InboundOutboundReportView = require('vue!./components/statistics/inbound_outbound_report.vue'),
    DisconnectCausesView = require('vue!./components/statistics/disconnect_causes.vue'),
    UsageReportView = require('vue!./components/statistics/usage_report.vue'),
    SpamReportView = require('vue!./components/statistics/spam_report.vue'),
    QosSummaryView = require('vue!./components/statistics/qos_summary.vue'),
    ProfitabilityAnalysisView = require('vue!./components/statistics/profitability_analysis.vue'),
    ActiveCallReportView = require('vue!./components/statistics/active_call_report.vue'),
    // HolasticReportView = require('vue!./components/statistics/holastic_report.vue'),
    // DistributionReportView = require('vue!./components/statistics/distribution_report.vue'),
    // ComparativeReportView = require('vue!./components/statistics/comparative_report.vue'),
    ActualTransactionView = require('vue!./components/finance/actual_transaction.vue'),
    AutoInvoiceManagementView = require('vue!./components/finance/auto_invoice_management.vue'),
    EditInvoiceView = require('vue!./components/finance/edit_invoice.vue'),
    CarrierInvoiceHistoryView = require('vue!./components/finance/carrier_invoice_history.vue'),
    InvoiceNotificationLogView = require('vue!./components/finance/invoice_notification_log.vue'),
    RegenerateBalanceView = require('vue!./components/finance/regenerate_balance.vue'),
    MutualTransactionView = require('vue!./components/finance/mutual_transaction.vue'),
    PaymentView = require('vue!./components/finance/payment.vue'),
    PaymentNewView = require('vue!./components/finance/payment_new.vue'),
    InvoicesView = require('vue!./components/finance/invoices.vue'),
    UploadVendorInvoiceView = require('vue!./components/finance/upload_vendor_invoice.vue'),
    CreditNoteView = require('vue!./components/finance/credit_note.vue'),
    DebitNoteView = require('vue!./components/finance/debit_note.vue'),
    VendorInvoiceDisputeView = require('vue!./components/finance/vendor_invoice_dispute_note.vue'),
    VendorInvoiceInfoView = require('vue!./components/finance/vendor_invoice_info.vue'),
    VendorInvoicePaymentView = require('vue!./components/finance/invoice_payment.vue'),
    InvoiceNoEditView = require('vue!./components/finance/invoice_no_edit.vue'),
    ReconcileView = require('vue!./components/finance/reconcile.vue'),
    CreateIncomingInvoiceView = require('vue!./components/finance/create_incoming_invoice.vue'),
    PastDueSummaryView = require('vue!./components/finance/past_due_summary.vue'),
    PastDueNotificationLogView = require('vue!./components/finance/past_due_notification_log.vue'),
    OverallMutualBalanceView = require('vue!./components/finance/overall_mutual_balance.vue'),
    CarrierGroupView = require('vue!./components/configuration/carrier_group.vue'),
    InvoiceNewView = require('vue!./components/finance/invoice_new.vue'),

    CarrierGroupNewView = require('vue!./components/configuration/carrier_group_new.vue'),
    CarrierGroupEditView = require('vue!./components/configuration/carrier_group_edit.vue'),
    CarrierCdrFieldsView = require('vue!./components/configuration/carrier_portal_allowed_cdr_fields.vue'),
    AutoCdrGenFormatView = require('vue!./components/configuration/auto_cdr_generation_format.vue'),
    DefaultFailoverRuleView = require('vue!./components/configuration/default_failover_rule.vue'),
    FtpConfigurationView = require('vue!./components/configuration/ftp_configuration.vue'),
    FtpConfigurationNewView = require('vue!./components/configuration/ftp_new.vue'),
    FtpConfigurationEditView = require('vue!./components/configuration/ftp_edit.vue'),
    DefaultErrorResponseView = require('vue!./components/configuration/default_error_response.vue'),
    EmailSenderView = require('vue!./components/configuration/email_sender.vue'),
    EmailSenderNewView = require('vue!./components/configuration/email_sender_new.vue'),
    EmailSenderEditView = require('vue!./components/configuration/email_sender_edit.vue'),
    PaymentSettingView = require('vue!./components/configuration/payment_setting.vue'),
    RolesView = require('vue!./components/configuration/roles.vue'),
    RoleNewView = require('vue!./components/configuration/role_new.vue'),
    RoleEditView = require('vue!./components/configuration/role_edit.vue'),
    // ModulesView = require('vue!./components/configuration/modules.vue'),
    // ModuleNewView = require('vue!./components/configuration/module_new.vue'),
    // ModuleEditView = require('vue!./components/configuration/module_edit.vue'),
    InvoiceSettingView = require('vue!./components/configuration/invoice_setting.vue'),
    LoginContentView = require('vue!./components/configuration/login_page_content.vue'),
    MailTemplateView = require('vue!./components/configuration/mail_template.vue'),
    UserManagementView = require('vue!./components/configuration/user_management.vue'),
    UserNewView = require('vue!./components/configuration/user_new.vue'),
    CarrierUserNewView = require('vue!./components/configuration/carrier_user_new.vue'),
    SystemSettingView = require('vue!./components/configuration/system_setting.vue'),
    TrunkGroupView = require('vue!./components/configuration/trunk_group.vue'),
    TrunkGroupNewView = require('vue!./components/configuration/trunk_group_new.vue'),
    TrunkGroupEditView = require('vue!./components/configuration/trunk_group_edit.vue'),
    // VerifyConfigurationView = require('vue!./components/configuration/verify_configuration.vue'),
    AgentNewView = require('vue!./components/agent/agent_new.vue'),
    AgentEditView = require('vue!./components/agent/agent_edit.vue'),
    AgentManagementView = require('vue!./components/agent/agent_management.vue'),
    AgentManageClientsView = require('vue!./components/agent/agent_manage_clients.vue'),
    CommissionReportView = require('vue!./components/agent/commission_report.vue'),
    CommissionHistoryView = require('vue!./components/agent/commission_history.vue'),
    ManagementCarrierView = require('vue!./components/management/carrier.vue'),

    
    ClientNewView = require('vue!./components/management/client_new.vue'),
    ClientNewTemplateView = require('vue!./components/management/client_new_template.vue'),
    // EditClientView = require('vue!./components/management/client_edit.vue'),
    MassEditView = require('vue!./components/management/mass_edit.vue'),
    ClientRateSummaryView = require('vue!./components/management/client_rate_summary.vue'),
    CreditManagementView = require('vue!./components/management/credit_management.vue'),
    CreditManagementEditView = require('vue!./components/management/credit_management_edit.vue'),
    ProductsView = require('vue!./components/management/products.vue'),
    ProductNewView = require('vue!./components/management/product_new.vue'),
    ProductEditView = require('vue!./components/management/product_edit.vue'),
    SendProductRateView = require('vue!./components/management/product_send_rate.vue'),
    ManageRegistrationView = require('vue!./components/management/registration.vue'),
    UserDescriptionView = require('vue!./components/management/user_description.vue'),
    UnclaimedTrunksView = require('vue!./components/management/unclaimed_trunks.vue'),
    WizardView = require('vue!./components/management/wizard.vue'),
    SendRateView = require('vue!./components/switch/send_rate.vue'),
    CreateRateTableView = require('vue!./components/switch/create_rate_table.vue'),
    CapacityView = require('vue!./components/switch/capacity.vue'),
    CodeDeckView = require('vue!./components/switch/code_deck.vue'),
    CodeDeckNewView = require('vue!./components/switch/code_deck_new.vue'),
    CodeDeckEditView = require('vue!./components/switch/code_deck_edit.vue'),
    CodeDeckListView = require('vue!./components/switch/code_deck_list.vue'),
    CodeDeckListNewView = require('vue!./components/switch/code_deck_list_new.vue'),
    CurrencyView = require('vue!./components/switch/currency.vue'),
    CurrencyNewView = require('vue!./components/switch/currency_new.vue'),
    CurrencyEditView = require('vue!./components/switch/currency_edit.vue'),
    USJurisdictionView = require('vue!./components/switch/us_jurisdiction.vue'),
    USJurisdictionNewView = require('vue!./components/switch/us_jurisdiction_new.vue'),
    USJurisdictionEditView = require('vue!./components/switch/us_jurisdiction_edit.vue'),
    PaymentTermView = require('vue!./components/switch/payment_term.vue'),
    PaymentTermCreateView = require('vue!./components/switch/payment_term_create.vue'),
    PaymentTermEditView = require('vue!./components/switch/payment_term_edit.vue'),
    // RandomAniGroupView = require('vue!./components/switch/random_ani_group.vue'),
    // RandomAniGroupDetailView = require('vue!./components/switch/random_ani_group_detail.vue'),
    AssignRateDeckView = require('vue!./components/switch/assign_rate_deck.vue'),
    RateTableView = require('vue!./components/switch/rate_table.vue'),
    EditingRatesView = require('vue!./components/switch/editing_rates.vue'),
    EditingRateTableView = require('vue!./components/switch/editing_ratetable.vue'),
    SendRateLogView = require('vue!./components/switch/send_rate_log.vue'),
    TimeProfileView = require('vue!./components/switch/time_profile.vue'),
    TimeProfileNewView = require('vue!./components/switch/time_profile_new.vue'),
    TimeProfileEditView = require('vue!./components/switch/time_profile_edit.vue'),
    VoipGatewayView = require('vue!./components/switch/voip_gateway.vue'),
    VoipGatewayNewView = require('vue!./components/switch/voip_gateway_new.vue'),
    VoipGatewayEditView = require('vue!./components/switch/voip_gateway_edit.vue'),
    // AutoRateUploadView = require('vue!./components/tools/auto_rate_upload.vue'),
    AutoRateImportRulesView = require('vue!./components/tools/auto_rate_import_rules.vue'),
    AutoRateImportRulesNewView = require('vue!./components/tools/auto_rate_import_rules_new.vue'),
    CallSimulationView = require('vue!./components/tools/call_simulation.vue'),
    // CdrReconciliationView = require('vue!./components/tools/cdr_reconciliation.vue'),
    RateGenerationView = require('vue!./components/tools/rate_generation.vue'),
    CreateRateGenerationView = require('vue!./components/tools/rate_generation_new.vue'),
    RateGenerationHistoryView = require('vue!./components/tools/rate_generation_history.vue'),
    RateGenerationResultView = require('vue!./components/tools/rate_generation_result.vue'),
    ApplyToRateTableView = require('vue!./components/tools/apply_to_rate_table.vue'),
    RerateView = require('vue!./components/tools/rerate.vue'),
    SipPacketSearchView = require('vue!./components/tools/sip_packet_search.vue'),
    // BlackholeIpView = require('vue!./components/monitoring/blackhole_ip.vue'),
    // BlackholeIpUploadView = require('vue!./components/monitoring/blackhole_ip_upload.vue'),
    // DialerDetectionView = require('vue!./components/monitoring/dialer_detection.vue'),
    // DialerDetectionNewView = require('vue!./components/monitoring/dialer_detection_new.vue'),
    FraudDetectionView = require('vue!./components/monitoring/fraud_detection.vue'),
    FraudDetectionNewView = require('vue!./components/monitoring/fraud_detection_new.vue'),
    FraudDetectionEditView = require('vue!./components/monitoring/fraud_detection_edit.vue'),
    ExecutionLogView = require('vue!./components/monitoring/execution_log.vue'),
    LoopDetectionView = require('vue!./components/monitoring/loop_detection.vue'),
    LoopDetectionNewView = require('vue!./components/monitoring/loop_detection_new.vue'),
    LoopDetectionEditView = require('vue!./components/monitoring/loop_detection_edit.vue'),
    // TrafficAlertRuleView = require('vue!./components/monitoring/traffic_alert_rule.vue'),
    // TrafficAlertRuleNewView = require('vue!./components/monitoring/traffic_alert_rule_new.vue'),
    RuleView = require('vue!./components/monitoring/rule.vue'),
    RuleDetailsView = require('vue!./components/monitoring/alert_rules_log_detail.vue'),
    RuleNewView = require('vue!./components/monitoring/rule_new.vue'),
    RuleEditView = require('vue!./components/monitoring/rule_edit.vue'),
    CarrierTemplateView = require('vue!./components/template/carrier_template.vue'),
    CarrierTemplateNewView = require('vue!./components/template/carrier_template_new.vue'),
    EgressTrunkTemplateView = require('vue!./components/template/egress_trunk_template.vue'),
    IngressTrunkTemplateView = require('vue!./components/template/ingress_trunk_template.vue'),
    RateEmailTemplateView = require('vue!./components/template/rate_email_template.vue'),
    RateUploadTemplateView = require('vue!./components/template/rate_upload_template.vue'),
    // RateEmailTemplateNewView = require('vue!./components/template/rate_email_template_new.vue'),
    RateUploadTemplateNewView = require('vue!./components/template/rate_upload_template_new.vue'),
    IngressTemplateNewView = require('vue!./components/template/ingress_trunk_template_new.vue'),
    EgressTemplateNewView = require('vue!./components/template/egress_trunk_template_new.vue'),
    TicketsNew = require('vue!./components/clients/tickets/create_tickets.vue'),
    // UsersView = require('vue!./components/origination/users.vue'),
    BillingRuleView = require('vue!./components/origination/billing_rule.vue'),
    BillingRuleNewView = require('vue!./components/origination/billing_rule_new.vue'),
    ClientsView = require('vue!./components/origination/clients.vue'),
    OriginationClientNewView = require('vue!./components/origination/client_new.vue'),
    DidRepositoryView = require('vue!./components/origination/did_repository.vue'),
    DidReportView = require('vue!./components/origination/did_report.vue'),
    DidRepositoryNewView = require('vue!./components/origination/did_repository_new.vue'),
    DidRoutingView = require('vue!./components/origination/did_routing.vue'),
    VendorsView = require('vue!./components/origination/vendors.vue'),
    VendorNewView = require('vue!./components/origination/vendor_new.vue'),
    OriginationWizardView = require('vue!./components/origination/wizard.vue'),
    EgressTrunkNewView = require('vue!./components/routing/add_egress_trunk.vue'),
    BlockListView = require('vue!./components/routing/block_list.vue'),
    BlockListNewView = require('vue!./components/routing/block_list_new.vue'),
    BlockListEditiew = require('vue!./components/routing/block_list_edit.vue'),
    DigitalMapsView = require('vue!./components/routing/digital_maps.vue'),
    DigitMappingDetailView = require('vue!./components/routing/digit_mapping_detail.vue'),
    DigitMappingDetailNewView = require('vue!./components/routing/digit_mapping_detail_new.vue'),
    DigitMappingDetailEditView = require('vue!./components/routing/digit_mapping_detail_edit.vue'),
    DynamicRoutingView = require('vue!./components/routing/dynamic_routing.vue'),
    DynamicRoutingNewView = require('vue!./components/routing/dynamic_routing_new.vue'),
    DynamicRoutingEditView = require('vue!./components/routing/dynamic_routing_edit.vue'),
    QosParametersView = require('vue!./components/routing/qos_parameters.vue'),
    TrunkPriorityView = require('vue!./components/routing/trunk_priority.vue'),
    TrunkPriorityNewView = require('vue!./components/routing/trunk_priority_new.vue'),
    OverrideView = require('vue!./components/routing/override.vue'),
    RoutingPlanView = require('vue!./components/routing/routing_plan.vue'),
    RoutingPlanCreateView = require('vue!./components/routing/routing_plan_create.vue'),
    RoutingPlanEditView = require('vue!./components/routing/routing_plan_edit.vue'),
    RoutingPlanDetailsView = require('vue!./components/routing/routing_plan_details.vue'),
    StaticRoutingView = require('vue!./components/routing/static_routing.vue'),
    StaticRoutingNewView = require('vue!./components/routing/static_routing_new.vue'),
    StaticRoutingEditView = require('vue!./components/routing/static_routing_edit.vue'),
    StaticRoutingDetailsView = require('vue!./components/routing/static_routing_details.vue'),
    RoutingWizardView = require('vue!./components/routing/wizard.vue'),
    RoutingTrunksView = require('vue!./components/routing/trunks.vue'),
    RoutingTrunkNewView = require('vue!./components/routing/trunk_new.vue'),
    RoutingTrunkTemplateView = require('vue!./components/routing/trunk_new_template.vue'),
    RoutingTrunkEditView = require('vue!./components/routing/trunk_edit.vue'),
    // AuthorizationLogView = require('vue!./components/log/authorization_log.vue'),
    AutoPaymentLogView = require('vue!./components/log/auto_payment_log.vue'),
    // BalanceLogView = require('vue!./components/log/balance_log.vue'),
    // CreditLogView = require('vue!./components/log/credit_log.vue'),
    EmailLogView = require('vue!./components/log/email_log.vue'),
    ExportLogView = require('vue!./components/log/export_log.vue'),
    FTPLogView = require('vue!./components/log/ftp_log.vue'),
    // FTPServerLogView = require('vue!./components/log/ftp_server_log.vue'),
    ImportLogView = require('vue!./components/log/import_log.vue'),
    // InvoiceCDRLogView = require('vue!./components/log/invoice_cdr_log.vue'),
    InvoiceLogView = require('vue!./components/log/invoice_log.vue'),
    // IPModifyLogView = require('vue!./components/log/ip_modify_log.vue'),
    // LicenseModificationLogView = require('vue!./components/log/license_modification_log.vue'),
    ModificationLogView = require('vue!./components/log/modification_log.vue'),
    // OriginationLogView = require('vue!./components/log/origination_log.vue'),
    RateImportlogView = require('vue!./components/log/rate_import_log.vue'),
    RateMassEditLogView = require('vue!./components/log/rate_mass_edit_log.vue'),
    RetrievePasswordLogView = require('vue!./components/log/retrieve_password_log.vue'),
    ScheduledReportLogView = require('vue!./components/log/scheduled_report_log.vue'),
    SchedulerLogView = require('vue!./components/log/scheduler_log.vue'),
    SipRegisterView = require('vue!./components/log/sip_register.vue'),
    // SqlLogView = require('vue!./components/log/sql_log.vue'),
    UserSignInHistoryView = require('vue!./components/log/user_signin_history.vue'),
    auth = require("./auth"),
    timeDisplay = require('vue!./components/main_components/time_display.vue'),
    showMessage = require('vue!./components/main_components/show_message.vue'),
    showMessageNew = require('vue!./components/main_components/show_message_new.vue'),
    asyncConfirm = require('vue!./components/main_components/async_confirm.vue'),

// client portal
    CarrierDashboardView = require('vue!./components/clients/management/carrier_dashboard.vue'),
    CarrierAccountView = require('vue!./components/clients/management/account.vue'),
    CarrierMessagesView = require('vue!./components/clients/management/messages.vue'),
    CarrierProductsView = require('vue!./components/clients/management/products.vue'),
    CarrierProductsIpsView = require('vue!./components/clients/management/productsIps.vue'),
    CarrierRateTableView = require('vue!./components/clients/management/rate_table.vue'),
    CarrierTrunksView = require('vue!./components/clients/management/trunks.vue'),
    CarrierTrunksProductsNewView = require('vue!./components/clients/management/trunks_products_new.vue'),
    CarrierTrunksProductsView = require('vue!./components/clients/management/trunks_products.vue'),
    CarrierTrunkRateView = require('vue!./components/clients/management/trunks_rates.vue'),
    CarrierTrunksIpsView = require('vue!./components/clients/management/trunks_ips.vue'),
    CarrierBillingAccountView = require('vue!./components/clients/billing/account_summary.vue'),
    CarrierPayNowView = require('vue!./components/clients/billing/pay_now.vue'),
    CarrierPaymentMethodView = require('vue!./components/clients/billing/payment_method.vue'),
    CarrierInvoicesView = require('vue!./components/clients/billing/invoices.vue'),
    CarrierPaymentView = require('vue!./components/clients/billing/payment.vue'),
    CarrierTransactionView = require('vue!./components/clients/billing/transaction.vue'),
    CarrierOnlinePaymentView = require('vue!./components/clients/billing/online_payment.vue'),
    CarrierCdrsSearchView = require('vue!./components/clients/reports/cdrs_search.vue'),
    CarrierSummaryReportView = require('vue!./components/clients/reports/summary_report.vue'),
    CarrierSipPacketSearchView = require('vue!./components/clients/sip/sip_packet_search.vue'),
    CarrierBuyDidView = require('vue!./components/clients/origination/buy_did.vue'),
    CarrierPortDidView = require('vue!./components/clients/origination/port_did.vue'),
    CarrierMyDidView = require('vue!./components/clients/origination/my_did.vue'),
    CarrierCdrView = require('vue!./components/clients/origination/cdr.vue'),
    CarrierReportView = require('vue!./components/clients/origination/report.vue'),
    CarrierTerminationTrunksSettingsView = require('vue!./components/clients/termination/trunk_settings.vue'),
    CarrierTerminationTrunkView = require('vue!./components/clients/termination/trunk.vue'),
    CarrierTerminationCdrView = require('vue!./components/clients/termination/cdr.vue'),
    CarrierTerminationProductsView = require('vue!./components/clients/termination/products.vue'),
    CarrierTerminationReportView = require('vue!./components/clients/termination/report.vue'),
    TicketsView = require('vue!./components/clients/tickets/ticket.vue'),

// agent portal
    AgentDashboardView = require('vue!./components/agents/management/agent_dashboard.vue'),
    AgentClientListView = require('vue!./components/agents/client/client_list.vue'),
    AgentClientPaymentView = require('vue!./components/agents/client/client_payment.vue'),
    AgentClientTransactionView = require('vue!./components/agents/client/client_transaction.vue'),
    AgentTrafficReportView = require('vue!./components/agents/statistics/traffic_report.vue'),
    AgentCdrsSearchView = require('vue!./components/agents/statistics/cdrs_search.vue'),
    AgentpcapSearchView = require('vue!./components/agents/statistics/pcap_search.vue'),
    AgentCommisionHistoryView = require('vue!./components/agents/statistics/commission_history.vue'),
    CarrierOriginationTrunksView = require('vue!./components/clients/origination/trunks.vue');


import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import MultiLanguage from './es6'
import language from './lang/language'

Vue.use(MultiLanguage, language);
Vue.use(ElementUI, { locale });
Vue.use(VueResource);
Vue.use(VueRouter);
Vue.use(VeeValidate);

Vue.component('time-display', timeDisplay);
//Vue.component('show-message', showMessage);
// Vue.component("ckeditor", {
//   template: `<div class="ckeditor"><textarea :id="id" :value="value"></textarea></div>`,
//   props: {
//     value: {
//       type: String
//     },
//     id: {
//       type: String,
//       default: "editor"
//     },
//     height: {
//       type: String,
//       default: "90px"
//     },
//     toolbar: {
//       type: Array,
//       default: () => [
//         ["Undo", "Redo"],
//         ["Bold", "Italic", "Strike"],
//         ["NumberedList", "BulletedList"],
//         ["Cut", "Copy", "Paste"]
//       ]
//     },
//     language: {
//       type: String,
//       default: "en"
//     },
//     extraplugins: {
//       type: String,
//       default: ""
//     }
//   },
//   beforeUpdate() {
//     const ckeditorId = this.id;
//     if (this.value !== CKEDITOR.instances[ckeditorId].getData()) {
//       CKEDITOR.instances[ckeditorId].setData(this.value);
//     }
//   },
//   mounted() {
//     const ckeditorId = this.id;
//     console.log(this.value);
//     const ckeditorConfig = {
//       toolbar: this.toolbar,
//       language: this.language,
//       height: this.height,
//       extraPlugins: this.extraplugins
//     };
//     CKEDITOR.replace(ckeditorId, ckeditorConfig);
//     CKEDITOR.instances[ckeditorId].setData(this.value);
//     CKEDITOR.instances[ckeditorId].on("change", () => {
//       let ckeditorData = CKEDITOR.instances[ckeditorId].getData();
//       if (ckeditorData !== this.value) {
//         this.$emit("input", ckeditorData);
//       }
//     });
//   },
//   destroyed() {
//     const ckeditorId = this.id;
//     if (CKEDITOR.instances[ckeditorId]) {
//       CKEDITOR.instances[ckeditorId].destroy();
//     }
//   }
// });

function requireAuth(to, from, next) {
    var back_path;
    if(to.path != '/auth/login' && to.path != '/statistics/dashboard')
        back_path = to.path;
    

    if (auth.loggedIn()) {
        if (to.path == '/auth/login') {
            if (auth.getType() == 'admin') {
                next('/statistics/dashboard');
            } else if (auth.getType() == 'client') {
                next('/clients/management/carrier_dashboard');
            } else if (auth.getType() == 'agent') {
                next('/agents/management/agent_dashboard');
            }
        } else if (to.path == '/') {
            if (auth.getType() == 'admin') {
                next('/statistics/dashboard');
            } else if (auth.getType() == 'client') {
                next('/clients/management/carrier_dashboard');
            } else if (auth.getType() == 'agent') {
                next('/agents/management/agent_dashboard');
            }
        } else {
            next();
        }
    } else {
        if (to.path == '/auth/reset_password' ||
            to.path == '/auth/login' ||
            to.path == '/auth/registration') { //TODO: forgot password, register, logout
            console.log('auth-free page: ' + to.path);
            next();
        } else {
            next({
                path: '/auth/login',
                query: { redirect: to.fullPath }
            })
        }
    }
    
    if (!sessionStorage.length) {
        // Ask other tabs for session storage
        localStorage.setItem('getSessionStorage', Date.now());
    };

    window.addEventListener('storage', function(event) {
        if (event.key == 'getSessionStorage') {
            // Some tab asked for the sessionStorage -> send it

            localStorage.setItem('sessionStorage', JSON.stringify(sessionStorage));
            localStorage.removeItem('sessionStorage');

        } else if (event.key == 'sessionStorage' && !sessionStorage.length) {
            // sessionStorage is empty -> fill it

            var data = JSON.parse(event.newValue),
                        value;

            for (let key in data) {
                sessionStorage.setItem(key, data[key]);
            }

            // if (auth.loggedIn()) {
            console.log("back_path: ", back_path);
            next(back_path);
            // }

        }
    });

    
}

const router = new VueRouter({
    routes: [
        // { path: '/', redirect: '/statistics/dashboard' },
        // { path: '/clients', redirect: '/clients/management/carrier_dashboard' },
        // { path: '/agents', redirect: '/agents/management/agent_dashboard' },
        {
            path: '/logout',
            beforeEnter(to, from, next) {
                auth.logout();
                next('/auth/login')
            }
        },
        { path: '/routing/egress_trunk/new', component: EgressTrunkNewView },
        { path: '/routing/block_list', component: BlockListView },
        { path: '/routing/block_list/new', component: BlockListNewView },
        { path: '/routing/block_list/edit/:id', component: BlockListEditiew, props: true },
        { path: '/routing/digital_maps', component: DigitalMapsView },
        { path: '/routing/digital_maps/digit_mapping_detail/:id', component: DigitMappingDetailView, props: true },
        { path: '/routing/digital_maps/digit_mapping_detail/:id/new', component: DigitMappingDetailNewView, props: true },
        { path: '/routing/digital_maps/digit_mapping_detail/:id/edit/:it', component: DigitMappingDetailEditView, props: true },
        { path: '/routing/dynamic_routing', component: DynamicRoutingView },
        { path: '/routing/dynamic_routing/new', component: DynamicRoutingNewView },
        { path: '/routing/dynamic_routing/edit/:id', component: DynamicRoutingEditView, props: true },
        { path: '/routing/dynamic_routing/:id/qos_parameters', component: QosParametersView, props: route => ({ id: route.params.id }) },
        { path: '/routing/dynamic_routing/:id/trunk_priority', component: TrunkPriorityView, props: route => ({ id: route.params.id }) },
        { path: '/routing/dynamic_routing/:id/trunk_priority/new', component: TrunkPriorityNewView, props: route => ({ id: route.params.id }) },
        { path: '/routing/dynamic_routing/:id/trunk_priority/:trunk_id/edit', component: TrunkPriorityNewView, props: route => ({ editingpriority: true, id: route.params.id, trunk_id: route.params.trunk_id }) },
        { path: '/routing/dynamic_routing/override/:id', component: OverrideView, props: route => ({ id: route.params.id }) },
        { path: '/routing/routing_plan', component: RoutingPlanView },
        { path: '/routing/routing_plan/new', component: RoutingPlanCreateView },
        { path: '/routing/routing_plan/edit/:id', component: RoutingPlanEditView, props: true  },
        { path: '/routing/routing_plan/details/:id', component: RoutingPlanDetailsView, props: true  },
        { path: '/routing/static_routing', component: StaticRoutingView },
        { path: '/routing/static_routing/new', component: StaticRoutingNewView },
        { path: '/routing/static_routing/edit/:id', component: StaticRoutingEditView, props: true },
        { path: '/routing/static_routing/details/:id', component: StaticRoutingDetailsView, props: true  },
        { path: '/routing/wizard', component: RoutingWizardView },
        { path: '/routing/trunks', component: RoutingTrunksView },
        { path: '/routing/trunks/:type/new', component: RoutingTrunkNewView, props: route => ({ type: route.params.type }) },
        { path: '/routing/trunks/:type/new/:id', component: RoutingTrunkNewView, props: route => ({ type: route.params.type, id: route.params.id }) },
        { path: '/routing/trunks/:type/new_template', component: RoutingTrunkTemplateView, props: route => ({ type: route.params.type }) },
        { path: '/routing/trunks/edit/:id/:type', component: RoutingTrunkEditView, props: route => ({ type: route.params.type, id: route.params.id }) },
        { path: '/routing/trunks/:type/:group_id', component: RoutingTrunksView, props: route => ({ type: route.params.type, group_id: route.params.group_id }) },

        { path: '/origination/billing_rule', component: BillingRuleView },
        { path: '/origination/billing_rule/new', component: BillingRuleNewView },
        { path: '/origination/billing_rule/edit/:id', component: BillingRuleNewView, props: route => ({ editingrule: true, id: route.params.id }) },
        { path: '/origination/clients', component: ClientsView },
        { path: '/origination/clients/new', component: OriginationClientNewView },
        { path: '/origination/clients/edit/:id', component: OriginationClientNewView, props: route => ({ editingclient: true, id: route.params.id }) },
        { path: '/origination/did_repository', component: DidRepositoryView },
        { path: '/origination/did_report', component: DidReportView },
        { path: '/origination/did_repository/new', component: DidRepositoryNewView },
        { path: '/origination/did_repository/edit/:id', component: DidRepositoryNewView, props: route => ({ editingrepository: true, id: route.params.id }) },
        { path: '/origination/did_routing', component: DidRoutingView },
        { path: '/origination/vendors', component: VendorsView },
        { path: '/origination/vendors/new', component: VendorNewView },
        { path: '/origination/vendors/edit/:id', component: VendorNewView, props: route => ({ editingvendor: true, id: route.params.id }) },
        { path: '/origination/wizard', component: OriginationWizardView },

        //Grigor development
        // { path: '/origination/tickets', component: TicketsView },
        // { path: '/origination/users', component: UsersView },
        
        { path: '/template/carrier_template', component: CarrierTemplateView },
        { path: '/template/carrier_template/new', component: CarrierTemplateNewView },
        { path: '/template/carrier_template/edit/:id', component: CarrierTemplateNewView, props: route => ({ editingtemplate: true, id: route.params.id }) },
        { path: '/template/egress_trunk_template', component: EgressTrunkTemplateView },
        { path: '/template/ingress_trunk_template', component: IngressTrunkTemplateView },
        { path: '/template/rate_email_template', component: RateEmailTemplateView },
        { path: '/template/rate_upload_template', component: RateUploadTemplateView },
        // { path: '/template/rate_email_template/new', component: RateEmailTemplateNewView },
        { path: '/template/rate_upload_template/new', component: RateUploadTemplateNewView },
        { path: '/template/ingress_trunk_template/new', component: IngressTemplateNewView },
        { path: '/template/ingress_trunk_template/edit/:id', component: IngressTemplateNewView, props: route => ({ editingtemplate: true, id: route.params.id }) },
        { path: '/template/egress_trunk_template/new', component: EgressTemplateNewView },
        { path: '/template/egress_trunk_template/edit/:id', component: EgressTemplateNewView, props: route => ({ editingtemplate: true, id: route.params.id }) },

        { path: '/switch/rate_table/send_rate', component: SendRateView },
        { path: '/switch/rate_table/new', component: CreateRateTableView },
        { path: '/switch/capacity', component: CapacityView },
        { path: '/switch/code_deck', component: CodeDeckView },
        { path: '/switch/code_deck/new', component: CodeDeckNewView },
        { path: '/switch/code_deck/edit/:id', component: CodeDeckEditView },
        { path: '/switch/code_deck/code_deck_list/:id', component: CodeDeckListView, props: route => ({ id: route.params.id }) },
        { path: '/switch/code_deck/code_deck_list/:id/new', component: CodeDeckListNewView, props: route => ({ id: route.params.id }) },
        { path: '/switch/code_deck/code_deck_list/:id/edit/:index', component: CodeDeckListNewView, props: route => ({ editingcode: true, id: route.params.id, index: route.params.index }) },
        { path: '/switch/currency', component: CurrencyView },
        { path: '/switch/currency/new', component: CurrencyNewView },
        { path: '/switch/currency/edit/:id', component: CurrencyEditView },
        { path: '/switch/us_jurisdiction', component: USJurisdictionView },
        { path: '/switch/us_jurisdiction/new', component: USJurisdictionNewView },
        { path: '/switch/us_jurisdiction/edit/:id', component: USJurisdictionEditView },
        { path: '/switch/payment_term', component: PaymentTermView },
        { path: '/switch/payment_term/new', component: PaymentTermCreateView},
        { path: '/switch/payment_term/edit/:id', component: PaymentTermEditView},
        // { path: '/switch/random_ani_group', component: RandomAniGroupView },
        // { path: '/switch/random_ani_group/detail', component: RandomAniGroupDetailView },
        { path: '/switch/rate_table/assign_rate_deck', component: AssignRateDeckView },
        { path: '/switch/rate_table', component: RateTableView },
        { path: '/switch/rate_table/editing_rates/:id', component: EditingRatesView, props: true },
        { path: '/switch/rate_table/editing_rates/:id/:tab_type', component: EditingRatesView, props: route => ({ id: route.params.id, tab_type: route.params.tab_type }) },
        { path: '/switch/rate_table/editing_ratetable/:id', component: EditingRateTableView, props: true },
        { path: '/switch/rate_table/send_rate_log', component: SendRateLogView },
        { path: '/switch/time_profile', component: TimeProfileView },
        { path: '/switch/time_profile/new', component: TimeProfileNewView },
        { path: '/switch/time_profile/edit/:id', component: TimeProfileEditView, props: true },
        { path: '/switch/voip_gateway', component: VoipGatewayView },
        { path: '/switch/voip_gateway/new', component: VoipGatewayNewView },
        { path: '/switch/voip_gateway/edit/:id', component: VoipGatewayEditView },

        // { path: '/tools/auto_rate_upload', component: AutoRateUploadView },
        { path: '/tools/auto_rate_import_rules', component: AutoRateImportRulesView },
        { path: '/tools/auto_rate_import_rules/new', component: AutoRateImportRulesNewView },
        { path: '/tools/call_simulation', component: CallSimulationView },
        // { path: '/tools/cdr_reconciliation', component: CdrReconciliationView },
        { path: '/tools/rate_generation', component: RateGenerationView },
        { path: '/tools/rate_generation/new', component: CreateRateGenerationView },
        { path: '/tools/rate_generation/edit/:id', component: CreateRateGenerationView, props: route => ({ editingrate: true, id: route.params.id }) },
        { path: '/tools/rate_generation/rate_generation_history', component: RateGenerationHistoryView },
        { path: '/tools/rate_generation/rate_generation_result', component: RateGenerationResultView },
        { path: '/tools/rate_generation/apply_to_rate_table', component: ApplyToRateTableView },
        { path: '/tools/rerate', component: RerateView },
        { path: '/tools/sip_packet_search', component: SipPacketSearchView },

        // { path: '/monitoring/blackhole_ip', component: BlackholeIpView },
        // { path: '/monitoring/blackhole_ip/upload', component: BlackholeIpUploadView },
        // { path: '/monitoring/dialer_detection', component: DialerDetectionView },
        // { path: '/monitoring/dialer_detection/new', component: DialerDetectionNewView },
        { path: '/monitoring/fraud_detection/default', component: FraudDetectionView, props: route => ({ is_first: true }) },
        { path: '/monitoring/fraud_detection/exec_log', component: FraudDetectionView, props: route => ({ is_first: false }) },
        { path: '/monitoring/fraud_detection/new', component: FraudDetectionNewView },
        { path: '/monitoring/fraud_detection/edit/:id', component: FraudDetectionEditView, props: true },
        { path: '/monitoring/fraud_detection/execution_log', component: ExecutionLogView },
        { path: '/monitoring/loop_detection', component: LoopDetectionView },
        { path: '/monitoring/loop_detection/new', component: LoopDetectionNewView },
        { path: '/monitoring/loop_detection/edit/:id', component: LoopDetectionEditView },
        // { path: '/monitoring/traffic_alert_rule', component: TrafficAlertRuleView },
        // { path: '/monitoring/traffic_alert_rule/new', component: TrafficAlertRuleNewView },
        { path: '/monitoring/rule', component: RuleView },
        { path: '/monitoring/rule/log', component: RuleView, props: route=>({activeIndex: 1}) },
        { path: '/monitoring/rule/details', component: RuleDetailsView },
        { path: '/monitoring/rule/new', component: RuleNewView },
        { path: '/monitoring/rule/edit/:id', component: RuleEditView },
        { path: '/management/wizard', component: WizardView },
        { path: '/management/unclaimed_trunks', component: UnclaimedTrunksView },
        { path: '/management/registration/user_description/:id', component: UserDescriptionView },
        { path: '/management/registration', component: ManageRegistrationView },
        { path: '/management/products/send_product_rate', component: SendProductRateView },
        { path: '/management/products/new', component: ProductNewView },
        { path: '/management/products/edit/:id', component: ProductEditView },
        { path: '/management/products', component: ProductsView },
        { path: '/management/credit_management', component: CreditManagementView },
        { path: '/management/credit_management/edit/:id/:credit_limit/:cps_limit/:call_limit', component: CreditManagementEditView, props: true },
        { path: '/management/client_rate_summary', component: ClientRateSummaryView },
        { path: '/management/clients/mass_edit', component: MassEditView },
        // { path: '/management/clients/edit_client/:id', component: EditClientView, props: true },
        { path: '/management/clients/edit/:id', component: ClientNewView, props: route => ({ editingclient: true, id: route.params.id }) },
        { path: '/management/clients/edit/:id/:info_type', component: ClientNewView, props: route => ({ editingclient: true, id: route.params.id, info_type: route.params.info_type }) },
        { path: '/management/clients/new_template', component: ClientNewTemplateView },
        { path: '/management/clients/new', component: ClientNewView },
        { path: '/management/carrier', component: ManagementCarrierView },

        { path: '/agent/commission_history', component: CommissionHistoryView },
        { path: '/agent/commission_report', component: CommissionReportView },
        { path: '/agent/agent_management', component: AgentManagementView },
        { path: '/agent/agent_manage_clients/:name/:id', component: AgentManageClientsView, props: route => ({ name: route.params.name, id: route.params.id }) },
        { path: '/agent/agent_management/new', component: AgentNewView },
        { path: '/agent/agent_management/edit/:id', component: AgentEditView, props: true },
        // { path: '/configuration/verify_configuration', component: VerifyConfigurationView },
        { path: '/configuration/trunk_group/new/:type', component: TrunkGroupNewView, props: true },
        { path: '/configuration/trunk_group', component: TrunkGroupView },
        { path: '/configuration/trunk_group/edit/:type/:id', component: TrunkGroupEditView, props: route => ({ type: route.params.type, id: route.params.id }) },
        { path: '/configuration/system_setting', component: SystemSettingView },
        { path: '/configuration/user_management', component: UserManagementView },
        { path: '/configuration/user_management/new', component: UserNewView },
        { path: '/configuration/user_management/edit/:id', component: UserNewView, props: route => ({ editinguser: true, id: route.params.id }) },
        { path: '/configuration/user_management/carrier_user/new', component: CarrierUserNewView },
        { path: '/configuration/user_management/carrier_user/edit/:id', component: CarrierUserNewView, props: route => ({ editinguser: true, id: route.params.id }) },
        { path: '/configuration/mail_template', component: MailTemplateView },
        { path: '/configuration/login_content', component: LoginContentView },
        { path: '/configuration/invoice_setting', component: InvoiceSettingView },
        // { path: '/configuration/modules/new', component: ModuleNewView },
        // { path: '/configuration/modules/edit/:id', component: ModuleEditView },
        // { path: '/configuration/modules', component: ModulesView },
        { path: '/configuration/roles', component: RolesView },
        { path: '/configuration/roles/new', component: RoleNewView },
        { path: '/configuration/roles/edit/:id', component: RoleEditView },
        { path: '/configuration/payment_setting', component: PaymentSettingView },
        { path: '/configuration/email_sender', component: EmailSenderView },
        { path: '/configuration/email_sender/new', component: EmailSenderNewView },
        { path: '/configuration/email_sender/edit/:id', component: EmailSenderEditView },
        { path: '/configuration/default_error_response', component: DefaultErrorResponseView },
        { path: '/configuration/ftp_configuration/new', component: FtpConfigurationNewView },
        { path: '/configuration/ftp_configuration/edit/:id', component: FtpConfigurationEditView, props: true },
        { path: '/configuration/ftp_configuration', component: FtpConfigurationView },
        { path: '/configuration/default_failover_rule', component: DefaultFailoverRuleView },
        { path: '/configuration/auto_cdr_generation_format', component: AutoCdrGenFormatView },
        { path: '/configuration/carrier_portal_allowed_cdr_fields', component: CarrierCdrFieldsView },
        { path: '/configuration/carrier_group/new', component: CarrierGroupNewView },
        { path: '/configuration/carrier_group/edit/:id', component: CarrierGroupEditView, props: true },
        { path: '/configuration/carrier_group', component: CarrierGroupView },

        { path: '/finance/invoice/new', component: InvoiceNewView },


        { path: '/statistics/dashboard', component: DashboardView },
        { path: '/statistics/dashboard/alert', component: AlertView },
        { path: '/statistics/dashboard/ingress_client_qos', component: IngressClientQosView },
        { path: '/statistics/dashboard/egress_client_qos', component: EgressClientQosView },
        { path: '/statistics/dashboard/qos_report', component: QosReportView },
        { path: '/statistics/dashboard/auto_delivery', component: AutoDeliveryView },
        { path: '/statistics/dashboard/charts', component: ChartsView },
        { path: '/statistics/dashboard/report', component: ReportView },
        { path: '/statistics/summary_report', component: SummaryReportView },
        // { path: '/statistics/active_registration', component: ActiveRegistrationView },
        { path: '/statistics/host_based_report', component: HostBasedReportView },
        { path: '/statistics/cdrs_list', component: CdrsSearchView },
        { path: '/statistics/daily_channel_usage_report', component: DailyChannelUsageReportView }, { path: '/statistics/daily_usage_detail_report', component: DailyUsageDetailReportView },
        // { path: '/statistics/location_report', component: LocationReportView },
        // { path: '/statistics/lrn_dipping_record', component: LrnDippingRecordView },
        { path: '/statistics/inbound_outbound_report', component: InboundOutboundReportView },
        { path: '/statistics/disconnect_causes', component: DisconnectCausesView },
        { path: '/statistics/usage_report', component: UsageReportView },
        { path: '/statistics/spam_report', component: SpamReportView },
        { path: '/statistics/qos_summary', component: QosSummaryView },
        { path: '/statistics/profitability_analysis', component: ProfitabilityAnalysisView },
        { path: '/statistics/active_call_report', component: ActiveCallReportView },
        // { path: '/statistics/holastic_report', component: HolasticReportView },
        // { path: '/statistics/distribution_report', component: DistributionReportView },
        // { path: '/statistics/comparative_report', component: ComparativeReportView },
        

        { path: '/finance/actual_transaction', component: ActualTransactionView },
        { path: '/finance/auto_invoice_management', component: AutoInvoiceManagementView },
        { path: '/finance/auto_invoice_management/edit_invoice', component: EditInvoiceView },
        { path: '/finance/carrier_invoice_history', component: CarrierInvoiceHistoryView },
        { path: '/finance/invoice_notification_log', component: InvoiceNotificationLogView },
        { path: '/finance/regenerate_balance', component: RegenerateBalanceView },
        { path: '/finance/mutual_transaction', component: MutualTransactionView },
        { path: '/finance/payment', component: PaymentView },
        { path: '/finance/payment/:payment_type/new', component: PaymentNewView, props: route => ({ payment_type: route.params.payment_type }) },
        { path: '/finance/invoice', component: InvoicesView },
        { path: '/finance/invoice/upload_vendor_invoice', component: UploadVendorInvoiceView },
        { path: '/finance/invoice/credit_note/:client_id', component: CreditNoteView, props: route => ({client_id: route.params.client_id}) },
        { path: '/finance/invoice/debit_note', component: DebitNoteView },
        { path: '/finance/invoice/vendor_invoice_dispute_note', component: VendorInvoiceDisputeView },
        { path: '/finance/invoice/vendor_invoice_info', component: VendorInvoiceInfoView },
        { path: '/finance/invoice/old_vendor_invoice_payment', component: VendorInvoicePaymentView },
        { path: '/finance/invoice/invoice_edit', component: InvoiceNoEditView },
        { path: '/finance/invoice/reconcile', component: ReconcileView },
        { path: '/finance/invoice/create_incoming_invoice', component: CreateIncomingInvoiceView },
        { path: '/finance/past_due_summary', component: PastDueSummaryView },
        { path: '/finance/past_due_notification_log', component: PastDueNotificationLogView },
        { path: '/finance/overall_mutual_balance', component: OverallMutualBalanceView },
         { path: '/log/auto_payment_log', component: AutoPaymentLogView },
         { path: '/log/email_log', component: EmailLogView },
        { path: '/log/export_log', component: ExportLogView },
        { path: '/log/ftp_log', component: FTPLogView },
         { path: '/log/import_log', component: ImportLogView },
         { path: '/log/invoice_log', component: InvoiceLogView },
        { path: '/log/modification_log', component: ModificationLogView },
         { path: '/log/rate_import_log', component: RateImportlogView },
        { path: '/log/rate_mass_edit_log', component: RateMassEditLogView },
        { path: '/log/retrieve_password_log', component: RetrievePasswordLogView },
        { path: '/log/scheduled_report_log', component: ScheduledReportLogView },
        { path: '/log/scheduler_log', component: SchedulerLogView },
        { path: '/log/sip_register', component: SipRegisterView },
        // { path: '/log/sql_log', component: SqlLogView },
        { path: '/log/user_signin_history', component: UserSignInHistoryView },

        { path: '/auth/successful_registration', component: SuccessfulSignupView },
        { path: '/auth/reset_password', component: ResetPasswordView },
        { path: '/auth/login', component: LoginView },
        { path: '/auth/registration', component: RegistrationView },

        // client portal
        
        { path: '/clients/management/carrier_dashboard', component: CarrierDashboardView },
        { path: '/clients/management/account_summary', component: CarrierAccountView },
        { path: '/clients/management/messages', component: CarrierMessagesView },
        { path: '/clients/management/products', component: CarrierProductsView },
        { path: '/clients/management/products/ips/:id', component: CarrierProductsIpsView },
        { path: '/clients/management/rate_table', component: CarrierRateTableView },
        { path: '/clients/management/trunks', component: CarrierTrunksView },
        { path: '/clients/management/trunks/products/new', component: CarrierTrunksProductsNewView },
        { path: '/clients/management/trunks/products/:id', component: CarrierTrunksProductsView },
        { path: '/clients/management/trunks/products/:id/rate/:productid', component: CarrierTrunkRateView, props: true },
        { path: '/clients/management/trunks/ips/:id', component: CarrierTrunksIpsView },
        { path: '/clients/billing/account_summary', component: CarrierBillingAccountView},
        { path: '/clients/billing/invoices', component: CarrierInvoicesView},
        { path: '/clients/billing/payment', component: CarrierPaymentView},
        { path: '/clients/billing/pay_now', component: CarrierPayNowView},
        { path: '/clients/billing/payment_method', component: CarrierPaymentMethodView},
        { path: '/clients/billing/online_payment', component: CarrierOnlinePaymentView},
        { path: '/clients/billing/transaction', component: CarrierTransactionView},
        { path: '/clients/reports/cdrs_search', component: CarrierCdrsSearchView},
        { path: '/clients/reports/summary_report', component: CarrierSummaryReportView},
        { path: '/clients/sip/sip_packet_search', component: CarrierSipPacketSearchView},
        { path: '/clients/origination/buy_did', component: CarrierBuyDidView},
        { path: '/clients/origination/port_did', component: CarrierPortDidView},
        { path: '/clients/origination/my_did', component: CarrierMyDidView},
        { path: '/clients/origination/cdr', component: CarrierCdrView},
        { path: '/clients/origination/report', component: CarrierReportView},
        { path: '/clients/tickets/ticket', component: TicketsView},
        { path: '/clients/tickets/new', component: TicketsNew},
        { path: '/clients/termination/trunks_settings', component: CarrierTerminationTrunksSettingsView},
        { path: '/clients/termination/trunk', component: CarrierTerminationTrunkView},
        { path: '/clients/termination/cdr_termination', component: CarrierTerminationCdrView},
        { path: '/clients/termination/products', component: CarrierTerminationProductsView},
        { path: '/clients/termination/report', component: CarrierTerminationReportView},
        { path: '/clients/origination/trunks', component: CarrierOriginationTrunksView},


        // agent portal
        { path: '/agents/management/agent_dashboard', component: AgentDashboardView },
        { path: '/agents/client/client_list', component: AgentClientListView },
        { path: '/agents/client/client_payment', component: AgentClientPaymentView },
        { path: '/agents/client/client_transaction', component: AgentClientTransactionView },
        { path: '/agents/statistics/traffic_report', component: AgentTrafficReportView },
        { path: '/agents/statistics/cdrs_search', component: AgentCdrsSearchView},
        { path: '/agents/statistics/pcap_search', component: AgentpcapSearchView},
        { path: '/agents/statistics/commission_history', component: AgentCommisionHistoryView},
    ]
});

router.beforeEach(requireAuth);

Vue.http.interceptors.push((request, next) => {
    if (auth.loggedIn()) {
        if (request.url.includes(api.getEndpointUrl()))
            request.headers.set('X-Auth-Token', auth.getToken());
        else
            request.headers.set('Authorization', "Token " + auth.getCdrToken());
    }
    next();
});

import store from './store/index.js'

new Vue({
    el: '#app',
    router,
    store,
    components: {
        navigator: navigator,
        overlay: Overlay,
        'app-message': showMessageNew,
        'async-confirm': asyncConfirm
    }
});
