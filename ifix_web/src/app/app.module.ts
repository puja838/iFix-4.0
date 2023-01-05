import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {AngularSlickgridModule} from 'angular-slickgrid';
import {OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTabsModule} from '@angular/material/tabs';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatListModule} from '@angular/material/list';
import {BannerComponent} from './banner/banner.component';
// import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {NotifierModule, NotifierOptions} from 'angular-notifier';
import {NgMaterialMultilevelMenuModule} from 'ng-material-multilevel-menu';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NavbarComponent} from './navbar/navbar.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {LoginComponent} from './login/login.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {BaseTemplateComponent} from './base-template/base-template.component';
import {MenusComponent} from './menus/menus.component';
import {CommonSlickgridComponent} from './common-slickgrid/common-slickgrid.component';
import {RoleUserComponent} from './role-user/role-user.component';
import {UsercreationComponent} from './usercreation/usercreation.component';
import {RoleUserActionComponent} from './role-user-action/role-user-action.component';
import {RoleActionComponent} from './role-action/role-action.component';
import {UrlCreationComponent} from './url-creation/url-creation.component';
import {RolesComponent} from './roles/roles.component';
import {ClientComponent} from './client/client.component';
import {ModuleClientComponent} from './module-client/module-client.component';
import {UrlMappingComponent} from './url-mapping/url-mapping.component';
import {ModuleComponent} from './module/module.component';
import {MaterialFileuploadComponent} from './material-fileupload/material-fileupload.component';
import {TicketMenuConfigComponent} from './ticket-menu-config/ticket-menu-config.component';
import {ClientSpecificUrlComponent} from './client-specific-url/client-specific-url.component';
import {TopNavbarComponent} from './top-navbar/top-navbar.component';
import {MenuUrlComponent} from './menu-url/menu-url.component';
import {ModuleUserRoleComponent} from './module-user-role/module-user-role.component';
import {ModuleRoleComponent} from './module-role/module-role.component';
import {UserroleComponent} from './userrole/userrole.component';
import {OrganizationComponent} from './organization/organization.component';
import {ClientWorkTimeComponent} from './client-work-time/client-work-time.component';
import {InterceptorService} from './interceptor.service';
import {CategorylavelComponent} from './categorylavel/categorylavel.component';
import {WorkingcategoryComponent} from './workingcategory/workingcategory.component';
import {TicketConfigComponent} from './ticket-config/ticket-config.component';
import {TicketPropertyComponent} from './ticket-property/ticket-property.component';
import {CategoryMasterComponent} from './category-master/category-master.component';
import {ColorPickerModule} from 'ngx-color-picker';
import {TypeStatusComponent} from './type-status/type-status.component';
import {CatalogMasterComponent} from './catalog-master/catalog-master.component';
import {CatalogCategoryMasterComponent} from './catalog-category-master/catalog-category-master.component';
import {AssetAttributeComponent} from './asset-attribute/asset-attribute.component';
import {AssetIdComponent} from './asset-id/asset-id.component';
import {MenuQueryComponent} from './menu-query/menu-query.component';
import {SupportGroupComponent} from './support-group/support-group.component';
import {AssetValidationComponent} from './asset-validation/asset-validation.component';
import {AssetReportComponent} from './asset-report/asset-report.component';
import {ClientHolidayComponent} from './client-holiday/client-holiday.component';
import {GroupHolidayComponent} from './group-holiday/group-holiday.component';
import {SupportGroupUserComponent} from './support-group-user/support-group-user.component';
import {CategoryGroupComponent} from './category-group/category-group.component';
import {TicketMenuComponent} from './ticket-menu/ticket-menu.component';
import {RecordTermsComponent} from './record-terms/record-terms.component';
import {TramsDiffComponent} from './trams-diff/trams-diff.component';
import {AdditonalFieldComponent} from './additonal-field/additonal-field.component';
import {FaqComponent} from './faq/faq.component';
import {StateTypeComponent} from './state-type/state-type.component';
import {MapStateComponent} from './map-state/map-state.component';
import {ProcessStateComponent} from './process-state/process-state.component';
import {ProcessUserComponent} from './process-user/process-user.component';
import {ProcessComponent} from './process/process.component';
import {PropertyStateComponent} from './property-state/property-state.component';
import {SgroupSpecificUrlComponent} from './sgroup-specific-url/sgroup-specific-url.component';
import {SlaCriteriaComponent} from './sla-criteria/sla-criteria.component';
import {TemplateVariableComponent} from './template-variable/template-variable.component';
import {ClientSlaComponent} from './client-sla/client-sla.component';
import {SlastatusComponent} from './slastatus/slastatus.component';
import {SlaTimeComponent} from './sla-time/sla-time.component';
import {SmsTempleteComponent} from './sms-templete/sms-templete.component';
import {CKEditorModule} from 'ngx-ckeditor';
import {SlaentitiesComponent} from './slaentities/slaentities.component';
import {WorkflowBuilderComponent} from './workflow-builder/workflow-builder.component';
import {PriorityConfigComponent} from './priority-config/priority-config.component';
import {SlaSupportGroupComponent} from './sla-support-group/sla-support-group.component';
import {MatrixComponent} from './matrix/matrix.component';
import {CreateTicketComponent} from './create-ticket/create-ticket.component';
import {MapcatagorywithtaskComponent} from './mapcatagorywithtask/mapcatagorywithtask.component';

import {Injector, APP_INITIALIZER} from '@angular/core';
import {LOCATION_INITIALIZED} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import 'flatpickr/dist/l10n/fr';
import {MapAssetComponent} from './map-asset/map-asset.component';
import {ViewTicketComponent} from './view-ticket/view-ticket.component';
import {ProcessActivityComponent} from './process-activity/process-activity.component';
import {DisplayTicketComponent} from './display-ticket/display-ticket.component';
import {NgCircleProgressModule} from 'ng-circle-progress';
import {SlaIndicatorComponent} from './sla-indicator/sla-indicator.component';
import {MapRecordRelationWithTermsComponent} from './map-record-relation-with-terms/map-record-relation-with-terms.component';
import {GroupTermMapComponent} from './group-term-map/group-term-map.component';
import {MaterialFileuploadSingleclickComponent} from './material-fileupload-singleclick/material-fileupload-singleclick.component';
import {TicketAssetComponent} from './ticket-asset/ticket-asset.component';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {ExternalCheckingComponent} from './external-checking/external-checking.component';
import {CloneTicketComponent} from './clone-ticket/clone-ticket.component';
import {NotificationComponent} from './notification/notification.component';
import {LDAPConfigComponent} from './ldap-config/ldap-config.component';
import {LDAPGroupUserComponent} from './ldap-group-user/ldap-group-user.component';
import {EmailTicketComponent} from './email-ticket/email-ticket.component';
import {ExternalAttributesMappingComponent} from './external-attributes-mapping/external-attributes-mapping.component';
import {SupportGroupNameComponent} from './support-group-name/support-group-name.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {DifferentiationMapComponent} from './differentiation-map/differentiation-map.component';
import {ProcessTemplateComponent} from './process-template/process-template.component';
import {ProcessTemplateStateComponent} from './process-template-state/process-template-state.component';
import {MapProcessTemplateComponent} from './map-process-template/map-process-template.component';
import {SupportGroupMapComponent} from './support-group-map/support-group-map.component';
import {SupportGroupUserCopyComponent} from './support-group-user-copy/support-group-user-copy.component';
import {RecordTermsCopyComponent} from './record-terms-copy/record-terms-copy.component';
import {TaskStatusMappingComponent} from './task-status-mapping/task-status-mapping.component';
import {TaskMappingComponent} from './task-mapping/task-mapping.component';
import {ExternalLoginComponent} from './external-login/external-login.component';
import {PropertyLevelComponent} from './property-level/property-level.component';
import {StatusPriorityMappingComponent} from './status-priority-mapping/status-priority-mapping.component';
import {ExcelTemplateConfigComponent} from './excel-template-config/excel-template-config.component';
import {ExternalCsatComponent} from './external-csat/external-csat.component';
import {ServicesConfigeComponent} from './services-confige/services-confige.component';
import {NotificationsTemplateVariableComponent} from './notifications-template-variable/notifications-template-variable.component';
import {ScheduleNotificationComponent} from './schedule-notification/schedule-notification.component';
import {TicketAssetModifyComponent} from './ticket-asset-modify/ticket-asset-modify.component';
import {TermsWithAdditionalTabComponent} from './terms-with-additional-tab/terms-with-additional-tab.component';
import {MfaValidationComponent} from './mfa-validation/mfa-validation.component';
import {NewLoginComponent} from './new-login/new-login.component';
import {SLATermEntryComponent} from './sla-term-entry/sla-term-entry.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {DashboardQueryCopyComponent} from './dashboard-query-copy/dashboard-query-copy.component';
import {DashboardQuerySaveComponent} from './dashboard-query-save/dashboard-query-save.component';
import {MapCategoryWithKeywordComponent} from './map-category-with-keyword/map-category-with-keyword.component';
import {UIdGenerationComponent} from './u-id-generation/u-id-generation.component';
import {ActivityLogSeqComponent} from './activity-log-seq/activity-log-seq.component';
import {GenericCreateTicketComponent} from './generic-create-ticket/generic-create-ticket.component';
import {CreateTicketCityComponent} from './create-ticket-city/create-ticket-city.component';
import {DisplayTicketCityComponent} from './display-ticket-city/display-ticket-city.component';
import {PriorityLocationMappingComponent} from './priority-location-mapping/priority-location-mapping.component';
import {CloneTicketCityComponent} from './clone-ticket-city/clone-ticket-city.component';
import {DefaultGroupComponent} from './default-group/default-group.component';
import {OrgToolsMappingComponent} from './org-tools-mapping/org-tools-mapping.component';
import {SupportGroupHourComponent} from './support-group-hour/support-group-hour.component';
import {MapUserWithGroupAndCategoryComponent} from './map-user-with-group-and-category/map-user-with-group-and-category.component';
import {TransportTableComponent} from './transport-table/transport-table.component';
import {ExportDataComponent} from './export-data/export-data.component';
import {ImportDataComponent} from './import-data/import-data.component';
import {UpdateSystemidComponent} from './update-systemid/update-systemid.component';
import {MaterialFileuploadSingleclickForImportComponent} from './material-fileupload-singleclick-for-import/material-fileupload-singleclick-for-import.component';
import {EmailTicketConfigComponent} from './email-ticket-config/email-ticket-config.component';
import {DataReportComponent} from './data-report/data-report.component';
import {AdfsAttributesComponent} from './adfs-attributes/adfs-attributes.component';
import {OpenTicketMoniterComponent} from './open-ticket-moniter/open-ticket-moniter.component';
import {ComingSoonComponent} from './coming-soon/coming-soon.component';
import {ReportingModuleComponent} from './reporting-module/reporting-module.component';
import { SocketService } from './socket.service';
import { PendingApprovalComponent } from './pending-approval/pending-approval.component';
import { MapuserpropertyComponent } from './mapuserproperty/mapuserproperty.component';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function appInitializerFactory(translate: TranslateService, injector: Injector) {
  return () => new Promise<any>((resolve: any) => {
    const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
    locationInitialized.then(() => {
      const langToSet = 'en';
      translate.setDefaultLang('en');
      translate.use(langToSet).subscribe(() => {
        // console.info(`Successfully initialized '${langToSet}' language.'`);
      }, err => {
        console.log(err);
        console.error(`Problem with '${langToSet}' language initialization.'`);
      }, () => {
        resolve(null);
      });
    });
  });
}

const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'middle',
      distance: 12
    },
    vertical: {
      position: 'top',
      distance: 54,
      gap: 10
    }
  },
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

// @dynamic
@NgModule({
  declarations: [
    PendingApprovalComponent,
    ReportingModuleComponent,
    ComingSoonComponent,
    OpenTicketMoniterComponent,
    AdfsAttributesComponent,
    DataReportComponent,
    EmailTicketConfigComponent,
    MaterialFileuploadSingleclickForImportComponent,
    UpdateSystemidComponent,
    TransportTableComponent,
    ExportDataComponent,
    ImportDataComponent,
    MapUserWithGroupAndCategoryComponent,
    SupportGroupHourComponent,
    OrgToolsMappingComponent,
    DefaultGroupComponent,
    CloneTicketCityComponent,
    PriorityLocationMappingComponent,
    DisplayTicketCityComponent,
    CreateTicketCityComponent,
    ActivityLogSeqComponent,
    DashboardQueryCopyComponent,
    DashboardQuerySaveComponent,
    MapCategoryWithKeywordComponent,
    UIdGenerationComponent,
    SLATermEntryComponent,
    NewLoginComponent,
    MfaValidationComponent,
    TermsWithAdditionalTabComponent,
    ScheduleNotificationComponent,
    NotificationsTemplateVariableComponent,
    ServicesConfigeComponent,
    ExcelTemplateConfigComponent,
    StatusPriorityMappingComponent,
    PropertyLevelComponent,
    TaskMappingComponent,
    TaskStatusMappingComponent,
    RecordTermsCopyComponent,
    SupportGroupUserCopyComponent,
    SupportGroupMapComponent,
    DifferentiationMapComponent,
    ExternalAttributesMappingComponent,
    SupportGroupNameComponent,
    EmailTicketComponent,
    LDAPConfigComponent,
    LDAPGroupUserComponent,
    NotificationComponent,
    BannerComponent,
    MaterialFileuploadSingleclickComponent,
    GroupTermMapComponent,
    MapRecordRelationWithTermsComponent,
    SlaIndicatorComponent,
    DisplayTicketComponent,
    ProcessActivityComponent,
    MapAssetComponent,
    MapcatagorywithtaskComponent,
    CreateTicketComponent,
    MatrixComponent,
    SlaSupportGroupComponent,
    PriorityConfigComponent,
    WorkflowBuilderComponent,
    SlaentitiesComponent,
    SmsTempleteComponent,
    SlaTimeComponent,
    SlastatusComponent,
    ClientSlaComponent,
    SgroupSpecificUrlComponent,
    PropertyStateComponent,
    AdditonalFieldComponent,
    FaqComponent,
    StateTypeComponent,
    MapStateComponent,
    ProcessStateComponent,
    ProcessUserComponent,
    ProcessComponent,
    TicketMenuComponent,
    RecordTermsComponent,
    TramsDiffComponent,
    CategoryGroupComponent,
    SupportGroupUserComponent,
    ClientHolidayComponent,
    AssetReportComponent,
    AssetValidationComponent,
    SupportGroupComponent,
    AssetIdComponent,
    AssetAttributeComponent,
    CatalogCategoryMasterComponent,
    CategorylavelComponent,
    WorkingcategoryComponent,
    CategoryMasterComponent,
    TicketConfigComponent,
    TicketPropertyComponent,
    OrganizationComponent,
    AppComponent,
    NavbarComponent,
    DashboardComponent,
    LoginComponent,
    BaseTemplateComponent,
    MenusComponent,
    CommonSlickgridComponent,
    RoleUserComponent,
    UsercreationComponent,
    RoleUserComponent,
    RoleActionComponent,
    RoleUserActionComponent,
    UrlCreationComponent,
    RolesComponent,
    ClientComponent,
    ModuleClientComponent,
    UrlMappingComponent,
    ModuleComponent,
    TicketMenuConfigComponent,
    MaterialFileuploadComponent,
    ClientSpecificUrlComponent,
    TopNavbarComponent,
    MenuUrlComponent,
    ModuleRoleComponent,
    ModuleUserRoleComponent,
    UserroleComponent,
    ClientWorkTimeComponent,
    TypeStatusComponent,
    CatalogMasterComponent,
    MenuQueryComponent,
    GroupHolidayComponent,
    SlaCriteriaComponent,
    TemplateVariableComponent,
    ViewTicketComponent,
    TicketAssetComponent,
    ExternalCheckingComponent,
    CloneTicketComponent,
    ProcessTemplateComponent,
    ProcessTemplateStateComponent,
    MapProcessTemplateComponent,
    ExternalLoginComponent,
    ExternalCsatComponent,
    TicketAssetModifyComponent,
    GenericCreateTicketComponent,
    MapuserpropertyComponent
  ],
  imports: [
    NgSelectModule,
    NgCircleProgressModule.forRoot({
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: '#78C000',
      innerStrokeColor: '#C7E596',
      animationDuration: 300
    }),
    NgxMaterialTimepickerModule,
    CKEditorModule,
    ColorPickerModule,
    MatListModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    AngularSlickgridModule.forRoot(),
    NotifierModule.withConfig(customNotifierOptions),
    BrowserAnimationsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatTabsModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    NgMaterialMultilevelMenuModule,
    MatRadioModule,
    MatButtonModule, MatChipsModule, MatSelectModule,
    MatIconModule, MatProgressBarModule, MatDialogModule, MatRippleModule,
    HttpClientModule,
    DragDropModule,
    TranslateModule.forRoot({
      loader: {provide: TranslateLoader, useFactory: createTranslateLoader, deps: [HttpClient]}
    })
  ],
  providers: [/*{provide: LocationStrategy, useClass: HashLocationStrategy},*/ {
    provide: HTTP_INTERCEPTORS,
    useClass: InterceptorService,
    multi: true
  }/*,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [TranslateService, Injector],
      multi: true
    }*/,
    SocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
