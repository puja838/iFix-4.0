import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {NavbarComponent} from './navbar/navbar.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {LoginComponent} from './login/login.component';
import {MenusComponent} from './menus/menus.component';
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
import {TicketMenuConfigComponent} from './ticket-menu-config/ticket-menu-config.component';
import {ClientSpecificUrlComponent} from './client-specific-url/client-specific-url.component';
import {TopNavbarComponent} from './top-navbar/top-navbar.component';
import {MenuUrlComponent} from './menu-url/menu-url.component';
import {ModuleUserRoleComponent} from './module-user-role/module-user-role.component';
import {ModuleRoleComponent} from './module-role/module-role.component';
import {UserroleComponent} from './userrole/userrole.component';
import {OrganizationComponent} from './organization/organization.component';
import {AuthGuardService} from './auth-guard.service';
import {CategorylavelComponent} from './categorylavel/categorylavel.component';
import {WorkingcategoryComponent} from './workingcategory/workingcategory.component';
import {TicketConfigComponent} from './ticket-config/ticket-config.component';
import {TicketPropertyComponent} from './ticket-property/ticket-property.component';
import {CategoryMasterComponent} from './category-master/category-master.component';
import {CatalogMasterComponent} from './catalog-master/catalog-master.component';
import {TypeStatusComponent} from './type-status/type-status.component';
import {CatalogCategoryMasterComponent} from './catalog-category-master/catalog-category-master.component';
import {ClientWorkTimeComponent} from './client-work-time/client-work-time.component';
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
import {SlaentitiesComponent} from './slaentities/slaentities.component';
import {WorkflowBuilderComponent} from './workflow-builder/workflow-builder.component';
import {PriorityConfigComponent} from './priority-config/priority-config.component';
import {SlaSupportGroupComponent} from './sla-support-group/sla-support-group.component';
import {MatrixComponent} from './matrix/matrix.component';
import {CreateTicketComponent} from './create-ticket/create-ticket.component';
import {MapcatagorywithtaskComponent} from './mapcatagorywithtask/mapcatagorywithtask.component';
import {MapAssetComponent} from './map-asset/map-asset.component';
import {ViewTicketComponent} from './view-ticket/view-ticket.component';
import {ProcessActivityComponent} from './process-activity/process-activity.component';
import {SlaIndicatorComponent} from './sla-indicator/sla-indicator.component';
import {MapRecordRelationWithTermsComponent} from './map-record-relation-with-terms/map-record-relation-with-terms.component';
import {GroupTermMapComponent} from './group-term-map/group-term-map.component';
import {DisplayTicketComponent} from './display-ticket/display-ticket.component';
import {ExternalCheckingComponent} from './external-checking/external-checking.component';
import {BannerComponent} from './banner/banner.component';
import {CloneTicketComponent} from './clone-ticket/clone-ticket.component';
import {NotificationComponent} from './notification/notification.component';
import {LDAPGroupUserComponent} from './ldap-group-user/ldap-group-user.component';
import {LDAPConfigComponent} from './ldap-config/ldap-config.component';
import {EmailTicketComponent} from './email-ticket/email-ticket.component';
import {ExternalAttributesMappingComponent} from './external-attributes-mapping/external-attributes-mapping.component';
import {SupportGroupNameComponent} from './support-group-name/support-group-name.component';
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
import {TermsWithAdditionalTabComponent} from './terms-with-additional-tab/terms-with-additional-tab.component';
import {NewLoginComponent} from './new-login/new-login.component';
import {MfaValidationComponent} from './mfa-validation/mfa-validation.component';
import {SLATermEntryComponent} from './sla-term-entry/sla-term-entry.component';
import {MapCategoryWithKeywordComponent} from './map-category-with-keyword/map-category-with-keyword.component';
import {UIdGenerationComponent} from './u-id-generation/u-id-generation.component';
import {DashboardQueryCopyComponent} from './dashboard-query-copy/dashboard-query-copy.component';
import {DashboardQuerySaveComponent} from './dashboard-query-save/dashboard-query-save.component';
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
import {ExportDataComponent} from './export-data/export-data.component';
import {TransportTableComponent} from './transport-table/transport-table.component';
import {ImportDataComponent} from './import-data/import-data.component';
import {UpdateSystemidComponent} from './update-systemid/update-systemid.component';
import {EmailTicketConfigComponent} from './email-ticket-config/email-ticket-config.component';
import {AdfsAttributesComponent} from './adfs-attributes/adfs-attributes.component';
import {OpenTicketMoniterComponent} from './open-ticket-moniter/open-ticket-moniter.component';
import {ComingSoonComponent} from './coming-soon/coming-soon.component';
import {ReportingModuleComponent} from './reporting-module/reporting-module.component';
import {PendingApprovalComponent} from './pending-approval/pending-approval.component';
import { MapuserpropertyComponent } from './mapuserproperty/mapuserproperty.component';


const routes: Routes = [{
  path: '',
  component: LoginComponent,
}, {
  path: 'external',
  component: ExternalCheckingComponent
}, {
  path: 'externalLogin',
  component: ExternalLoginComponent,
}, {
  path: 'externalCSAT',
  component: ExternalCsatComponent,
}, {
  path: 'mfaRegistration',
  component: NewLoginComponent
}, {
  path: 'mfaValidation',
  component: MfaValidationComponent
}, {
  path: 'admin',
  component: TopNavbarComponent,
  canActivate: [AuthGuardService],
  canActivateChild: [AuthGuardService],
  children: [
    {
      path: 'notificationTemplate',
      component: NotificationsTemplateVariableComponent
    }, {
      path: 'exportData',
      component: ExportDataComponent
    },
    {
      path: 'importData',
      component: ImportDataComponent
    }, {
      path: 'transportTableList',
      component: TransportTableComponent
    },
    {
      path: 'toolsMapping',
      component: OrgToolsMappingComponent
    },
    {
      path: 'servicesConfig',
      component: ServicesConfigeComponent
    },
    {
      path: 'menus',
      component: MenusComponent
    }, {
      path: 'roleUserMap',
      component: RoleUserComponent
    }, {
      path: 'module',
      component: ModuleComponent
    }, {
      path: 'urlCreation',
      component: UrlCreationComponent
    }, {
      path: 'client',
      component: ClientComponent
    }, {
      path: 'user',
      component: UsercreationComponent
    }, {
      path: 'moduleClient',
      component: ModuleClientComponent
    }, {
      path: 'urlMapping',
      component: UrlMappingComponent
    }, {
      path: 'roleUserAction',
      component: RoleUserActionComponent
    }, {
      path: 'roleAction',
      component: RoleActionComponent
    }, {
      path: 'roles',
      component: RolesComponent
    }, {
      path: 'ticketMenuConfig',
      component: TicketMenuConfigComponent
    }, {
      path: 'clientSpecificUrl',
      component: ClientSpecificUrlComponent
    }, {
      path: 'menuUrl',
      component: MenuUrlComponent
    }, {
      path: 'moduleUserRole',
      component: ModuleUserRoleComponent
    }, {
      path: 'roleModuleMap',
      component: ModuleRoleComponent
    }, {
      path: 'userRoleMap',
      component: UserroleComponent
    }, {
      path: 'organization',
      component: OrganizationComponent
    }, {
      path: 'orgConfig',
      component: ClientWorkTimeComponent
    }, {
      path: 'roleUserMap',
      component: RoleUserComponent
    }, {
      path: 'propertyMapping',
      component: TypeStatusComponent
    }, {
      path: 'recordTerm',
      component: RecordTermsComponent
    }, {
      path: 'slaTerm',
      component: SLATermEntryComponent
    }, {
      path: 'crAdditionalTermsMapping',
      component: TermsWithAdditionalTabComponent
    }, {
      path: 'mapCategoryWithKeyword',
      component: MapCategoryWithKeywordComponent
    },
    {
      path: 'uIdGeneration',
      component: UIdGenerationComponent
    },
    {
      path: 'copyQuery',
      component: DashboardQueryCopyComponent
    },
    {
      path: 'saveQuery',
      component: DashboardQuerySaveComponent
    }, {
      path: 'activitySeq',
      component: ActivityLogSeqComponent
    }, {
      path: 'updateSystemid',
      component: UpdateSystemidComponent
    }, {
      path: 'emailTicketConfig',
      component: EmailTicketConfigComponent
    },{
      path: 'mapUserProperty',
      component: MapuserpropertyComponent
    }
  ]
}, {
  path: 'ticket',
  component: NavbarComponent,
  canActivate: [AuthGuardService],
  canActivateChild: [AuthGuardService],
  children: [
    {
      path: 'dashboard',
      component: DashboardComponent
    }, {
      path: 'createTicket',
      component: CreateTicketComponent
    }, {
      path: 'viewTicket',
      component: ViewTicketComponent
    }, {
      path: 'displayTicket',
      component: DisplayTicketComponent
    }, {
      path: 'cloneTicket',
      component: CloneTicketComponent
    }, {
      path: 'genericCreateTicket',
      component: GenericCreateTicketComponent
    }, {
      path: 'createTicketCity',
      component: CreateTicketCityComponent
    }, {
      path: 'displayTicketCity',
      component: DisplayTicketCityComponent
    }, {
      path: 'cloneTicketCity',
      component: CloneTicketCityComponent
    }, {
      path: 'pendingApproval',
      component: PendingApprovalComponent
    },
  ]
}, {
  path: 'user',
  component: NavbarComponent,
  canActivate: [AuthGuardService],
  canActivateChild: [AuthGuardService],
  children: [{
    path: 'adfsAttributes',
    component: AdfsAttributesComponent
  }, {
    path: 'priorityLocationMapping',
    component: PriorityLocationMappingComponent
  }, {
    path: 'crAdditionalTermsMapping',
    component: TermsWithAdditionalTabComponent
  }, {
    path: 'activitySeq',
    component: ActivityLogSeqComponent
  },
    {
      path: 'recordTerm',
      component: RecordTermsComponent
    },
    {
      path: 'diffMap',
      component: DifferentiationMapComponent
    },
    {
      path: 'externalMapping',
      component: ExternalAttributesMappingComponent
    }, {
      path: 'groupName',
      component: SupportGroupNameComponent
    }, {
      path: 'emailTicket',
      component: EmailTicketComponent
    },
    {
      path: 'ldapGroupRole',
      component: LDAPGroupUserComponent
    }, {
      path: 'ldapConfig',
      component: LDAPConfigComponent
    }, {
      path: 'notification',
      component: NotificationComponent
    }, {
      path: 'userRoleMap',
      component: UserroleComponent
    }, {
      path: 'banner',
      component: BannerComponent
    }, {
      path: 'roleAction',
      component: RoleActionComponent
    }, {
      path: 'mapModuleWithRole',
      component: ModuleRoleComponent
    }, {
      path: 'roleUserAction',
      component: RoleUserActionComponent
    }, {
      path: 'user',
      component: UsercreationComponent
    }, {
      path: 'roleUserMap',
      component: RoleUserComponent
    }, {
      path: 'recordConfig',
      component: TicketConfigComponent
    }, {
      path: 'ticketProperty',
      component: TicketPropertyComponent
    }, {
      path: 'propertyMaster',
      component: CategoryMasterComponent
    }, {
      path: 'catalogMaster',
      component: CatalogMasterComponent
    }, {
      path: 'propertyLevel',
      component: CategorylavelComponent
    }, {
      path: 'workingCategory',
      component: WorkingcategoryComponent
    }, {
      path: 'moduleUserRole',
      component: ModuleUserRoleComponent
    }, {
      path: 'catalogMapping',
      component: CatalogCategoryMasterComponent
    }, {
      path: 'assetAttribute',
      component: AssetAttributeComponent
    }, {
      path: 'assetId',
      component: AssetIdComponent
    }, {
      path: 'menuQuery',
      component: MenuQueryComponent
    }, {
      path: 'supportGroup',
      component: SupportGroupComponent
    }, {
      path: 'assetValidation',
      component: AssetValidationComponent
    }, {
      path: 'manageAssetAttributes',
      component: AssetReportComponent
    }, {
      path: 'orgnHoliday',
      component: ClientHolidayComponent
    }, {
      path: 'groupHoliday',
      component: GroupHolidayComponent
    }, {
      path: 'supportGroupUser',
      component: SupportGroupUserComponent
    }, {
      path: 'categoryGroup',
      component: CategoryGroupComponent
    }, {
      path: 'orgConfig',
      component: ClientWorkTimeComponent
    }, {
      path: 'propertyMapping',
      component: TypeStatusComponent
    }, {
      path: 'recordMenu',
      component: TicketMenuComponent
    }, {
      path: 'termsDiff',
      component: TramsDiffComponent
    }, {
      path: 'additionalFields',
      component: AdditonalFieldComponent
    },
    {
      path: 'faq',
      component: FaqComponent
    },
    {
      path: 'stateType',
      component: StateTypeComponent
    },
    {
      path: 'mapState',
      component: MapStateComponent
    },
    {
      path: 'processState',
      component: ProcessStateComponent
    },
    {
      path: 'processUser',
      component: ProcessUserComponent
    }, {
      path: 'process',
      component: ProcessComponent
    }, {
      path: 'propertyState',
      component: PropertyStateComponent
    }, {
      path: 'nonMenuAccess',
      component: SgroupSpecificUrlComponent
    }, {
      path: 'slaCriteria',
      component: SlaCriteriaComponent
    }, {
      path: 'templateVariable',
      component: TemplateVariableComponent
    }, {
      path: 'clientSla',
      component: ClientSlaComponent
    }, {
      path: 'slaStatus',
      component: SlastatusComponent
    }, {
      path: 'slaTime',
      component: SlaTimeComponent
    }, {
      path: 'templateCreation',
      component: SmsTempleteComponent
    }, {
      path: 'slaEntities',
      component: SlaentitiesComponent
    }, {
      path: 'processBuilder',
      component: WorkflowBuilderComponent
    }, {
      path: 'priorityConfig',
      component: PriorityConfigComponent
    }, {
      path: 'slaSupportGroup',
      component: SlaSupportGroupComponent
    }, {
      path: 'matrix',
      component: MatrixComponent
    }, {
      path: 'taskMappingold',
      component: MapcatagorywithtaskComponent
    }, {
      path: 'assetMapping',
      component: MapAssetComponent
    }, {
      path: 'processActivity',
      component: ProcessActivityComponent
    }, {
      path: 'slaIndicator',
      component: SlaIndicatorComponent
    }, {
      path: 'MapRecordWithTerms',
      component: MapRecordRelationWithTermsComponent
    }, {
      path: 'groupTermMap',
      component: GroupTermMapComponent
    }, {
      path: 'processTemplate',
      component: ProcessTemplateComponent
    }, {
      path: 'processTemplateState',
      component: ProcessTemplateStateComponent
    }, {
      path: 'mapProcessTemplate',
      component: MapProcessTemplateComponent
    }, {
      path: 'groupMap',
      component: SupportGroupMapComponent
    }, {
      path: 'groupUserCopy',
      component: SupportGroupUserCopyComponent
    }, {
      path: 'termsCopy',
      component: RecordTermsCopyComponent
    }, {
      path: 'taskStatusMapping',
      component: TaskStatusMappingComponent
    }, {
      path: 'taskMapping',
      component: TaskMappingComponent
    }, {
      path: 'propertyLevelNew',
      component: PropertyLevelComponent
    }, {
      path: 'taskPriorityMap',
      component: StatusPriorityMappingComponent
    }, {
      path: 'excelTemplate',
      component: ExcelTemplateConfigComponent
    }, {
      path: 'notificationTemplate',
      component: NotificationsTemplateVariableComponent
    }, {
      path: 'scheduleNotification',
      component: ScheduleNotificationComponent
    }, {
      path: 'defaultSupportGroup',
      component: DefaultGroupComponent
    }, {
      path: 'toolsMapping',
      component: OrgToolsMappingComponent
    }, {
      path: 'supportGroupWorkingHours',
      component: SupportGroupHourComponent
    }, {
      path: 'mapUserWithGroupAndCategory',
      component: MapUserWithGroupAndCategoryComponent
    }, {
      path: 'openTicketMonitor',
      component: OpenTicketMoniterComponent
    }, {
      path: 'comingSoon',
      component: ComingSoonComponent
    }, {
      path: 'dataReport',
      component: ReportingModuleComponent
    },{
      path: 'mapUserProperty',
      component: MapuserpropertyComponent
    }
  ]
}];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {


}
