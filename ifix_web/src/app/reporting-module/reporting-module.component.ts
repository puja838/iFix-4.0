import {Component, ComponentFactoryResolver, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  AngularGridInstance,
  GridOption,
  GridOdataService,
  Editors,
  Formatters,
  ExcelExportService,
  FileType
} from 'angular-slickgrid';
import {NotifierService} from 'angular-notifier';
import {NgbModal, NgbModalRef, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {RestApiService} from '../rest-api.service';
import {MessageService} from '../message.service';
import {ActivatedRoute, Router} from '@angular/router';
import {form} from '../form.model';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {TranslateService} from '@ngx-translate/core';
import {FormControl} from '@angular/forms';
import {ConfigService} from '../config.service';
import {CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY_PROVIDER_FACTORY} from '@angular/cdk/overlay/overlay-directives';
import { getHtmlElementOffset } from 'angular-slickgrid';

@Component({
  selector: 'app-reporting-module',
  templateUrl: './reporting-module.component.html',
  styleUrls: ['./reporting-module.component.css']
})
export class ReportingModuleComponent implements OnInit {
  ticketTypeLoaded = false;
  displayed = true;
  folderDisplayed = true;
  step: string;
  columnDefinitions = [];
  gridOptions: GridOption;
  dataset: any[];
  angularGrid: AngularGridInstance;
  totalData: number;
  selectedTitles = [];
  gridObj: any;
  show: boolean;
  selected: number;
  name: string;
  desc: string;
  dDate: string;
  comment: string;
  priority: string;
  ticketCreated = false;
  percent: number;

  @ViewChild('content') private content;
  ticketTypes: any;
  notifier: NotifierService;
  respObject: any;
  clientId: number;
  userSelected: number;
  count: number;
  solutions = [];
  folderClicked: any;
  formData: any;
  menus = [];
  isDisabled = true;

  data = [];
  seq: number;

  userGroupId: number;
  folderLoaded = false;
  userGroups = [];
  userGroupSelected = 0;
  groupName: string;
  public grpLevel: number;
  isLowestLevel: boolean;

  private userAuth: Subscription;
  dataLoaded: boolean;
  filterLoader: boolean;
  pageSizeObj: any[];
  totalPage: number;
  pageSizeSelected: number;
  paginationObj: any;
  offset: number;
  page_no: number;

  load: boolean;

  hascatalog: string;

  orgId: number;
  ticketsTyp = [];
  TICKET_TYPE_ID: number;
  TICKET_TYPE_SEQ = 1;
  recordType = [];
  ticketSeq: number;
  typSelected: number;
  ticketTypeArr: any;

  display: boolean;
  itemsPerPage: number;
  pageSizes: number;
  maxLength = 10;
  typeSeq: number;
  private CATEGORY_SEQ = 0;
  private closeModalSubscribe: Subscription;
  page: number = 1;
  selectedColor: any;
  tableCss: any;
  darkCss: any;
  buttonCss: any;
  fontColor: any;
  footerItem: any;
  footerCss: any;
  colorObj: any;
  private columnData: [];
  archiveDisplayed = false;
  starDisplayed = true;
  clockDisplayed = false;

  dropDownArr1 = [
    // {'id': 0, 'value': 'Customer', 'field': 'levelonecatename'},
    {'id': 1, 'value': 'Ticket ID', 'field': 'ticketid'},
    {'id': 13, 'value': 'Status', 'field': 'status'},
    {'id': 11, 'value': 'Short Description', 'field': 'shortdescription'},
    {'id': 3, 'value': 'Requester Name', 'field': 'requestorname'},
    {'id': 2, 'value': 'Source', 'field': 'source'},
    {'id': 19, 'value': 'Created Since', 'field': 'createddatetime'},
    {'id': 7, 'value': 'Original Created By Name', 'field': 'orgcreatorname'},
    {'id': 4, 'value': 'Requester Location/Branch', 'field': 'requestorlocation'},
    {'id': 5, 'value': 'Requester Primary Contact (Phone/Mobile) Number', 'field': 'requestorphone'},
    {'id': 6, 'value': 'Requester Email ID', 'field': 'requestoremail'},
    {'id': 8, 'value': 'Original Created By Location', 'field': 'orgcreatorlocation'},
    {'id': 9, 'value': 'Original Created By Primary Contact (Phone/Mobile) Number', 'field': 'orgcreatorphone'},
    {'id': 10, 'value': 'Original Created By Email ID', 'field': 'orgcreatoremail'},
    {'id': 12, 'value': 'Priority', 'field': 'priority'},
    // {'id': 46, 'value': 'Ticket Type', 'field': 'tickettype'},
    {'id': 53, 'value': 'Vendor Name', 'field': 'vendorname'},
    {'id': 54, 'value': 'Vendor Ticket Id', 'field': 'vendorticketid'},
    {'id': 55, 'value': 'Resolution Code', 'field': 'resolutioncode'},
    {'id': 56, 'value': 'Resolution Comment', 'field': 'resolutioncomment'},
    {'id': 57, 'value': 'Last Update By', 'field': 'lastuser'},
    {'id': 58, 'value': 'Resolved Date Time', 'field': 'latestresodatetime'},
    // {'id': 59, 'value': 'Duration in Pending Vendor State (Minutes)', 'field': 'followuptimetaken'},
    // {'id': 159, 'value': 'Duration In Pending User State (Minutes)', 'field': 'userreplytimetaken'},
    {'id': 60, 'value': 'Pending Vendor Count', 'field': 'pendingvendorcount'},
    {'id': 49, 'value': 'Priority Change Count', 'field': 'prioritycount'},
    // {'id': 50, 'value': 'Total Response SLA Time (Minutes)', 'field': 'responsetime'},
    // {'id': 51, 'value': 'Total Resolution SLA Time (Minutes)', 'field': 'resotimeexcludeidletime'},
    {'id': 52, 'value': 'Pending User Count', 'field': 'pendingusercount'},
    {'id': 14, 'value': 'VIP Ticket (Yes/No)', 'field': 'vipticket'},
    {'id': 15, 'value': 'Assigned Group (Last assigned Resolver Group)', 'field': 'assignedgroup'},
    {'id': 16, 'value': 'Assigned User (Last assigned  user from the Resolver Group)', 'field': 'assigneduser'},
    {'id': 17, 'value': 'Resolved By Group (Last assigned Resolver Group who has resolved the ticket)', 'field': 'resogroup'},
    {'id': 18, 'value': 'Resolved By User (Last assigned  user from the Resolver Group who has resolved the ticket)', 'field': 'resolveduser'},
    {'id': 20, 'value': 'Last Modified Date Time', 'field': 'lastupdateddatetime'},
    {'id': 27, 'value': 'Urgency', 'field': 'urgency'},
    {'id': 28, 'value': 'Impact', 'field': 'impact'},
    {'id': 29, 'value': 'Due Date Time', 'field': 'resosladuedatetime'},
    {'id': 30, 'value': 'Response SLA Breached Status', 'field': 'respslabreachstatus'},
    {'id': 31, 'value': 'Resolution SLA Breached Status', 'field': 'resolslabreachstatus'},
    {'id': 75, 'value': 'Response SLA Breach Code', 'field': 'responsebreachcode'},
    {'id': 76, 'value': 'Resolution SLA Breach Code', 'field': 'resolutionbreachcode'},
    {'id': 77, 'value': 'Response SLA Breach Comment', 'field': 'responsebreachcomment'},
    {'id': 78, 'value': 'Resolution SLA Breach Comment', 'field': 'resolutionbreachcomment'},
    // {'id': 79, 'value': 'Response SLA Breach Date Time', 'field': 'respsladuedatetime'},
    // {'id': 80, 'value': 'Resolution SLA Breach Date Time', 'field': 'resosladuedatetime'},
    // {'id': 32, 'value': 'Response SLA Overdue (Minutes)', 'field': 'respoverduetime'},
    // {'id': 33, 'value': 'Resolution SLA Overdue (Minutes)', 'field': 'resooverduetime'},
    // {'id': 34, 'value': 'Aging in Days (Calendar days from created date)', 'field': 'calendaraging'},
    {'id': 35, 'value': 'Not Updated Since (Days)', 'field': 'worknotenotupdated'},
    {'id': 36, 'value': 'Reopen Count', 'field': 'reopencount'},
    {'id': 37, 'value': 'Reassignment Hop Count', 'field': 'reassigncount'},
    {'id': 38, 'value': 'Category Change Count', 'field': 'categorychangecount'},
    {'id': 39, 'value': 'User Follow Up', 'field': 'followupcount'},
    {'id': 40, 'value': 'Outbound Count', 'field': 'outboundcount'},
    // {'id': 41, 'value': 'IsParent (Yes/No)', 'field': 'isparent'},
    {'id': 42, 'value': 'Child Count (if parent)', 'field': 'childcount'},
    {'id': 43, 'value': 'Response Clock Status (Running/Stopped)', 'field': 'respclockstatus'},
    {'id': 44, 'value': 'Resolution Clock Status (Running/Stopped/Paused)', 'field': 'resoclockstatus'},
    {'id': 45, 'value': 'Response SLA Meter %', 'field': 'responseslameterpercentage'},
    {'id': 46, 'value': 'Resolution SLA Meter %', 'field': 'resolutionslameterpercentage'},
    // {'id': 47, 'value': 'Business Aging (HH:MM)', 'field': 'businessaging'},
    // {'id': 48, 'value': 'Actual Effort Spent (HH:MM)', 'field': 'actualeffort'},
    // {'id': 70, 'value': 'Total SLA Idle Time (Minutes)', 'field': 'slaidletime'},
    // {'id': 71, 'value': 'Response SLA Overdue %', 'field': 'respoverdueperc'},
    // {'id': 72, 'value': 'Resolution SLA Overdue %', 'field': 'resooverdueperc'},
    // {'id': 81, 'value': 'Response SLA End Date Time', 'field': 'firstresponsedatetime'},
    // {'id': 82, 'value': 'Resolution SLA End Date Time', 'field': 'latestresodatetime'},
    // {'id': 83, 'value': 'Response SLA Start Date Time', 'field': 'startdatetimeresponse'},
    // {'id': 84, 'value': 'Resolution SLA Start Date Time', 'field': 'startdatetimeresolution'},
    // {'id': 217, 'value': 'Status Reason', 'field': 'statusreason'},
    // {'id': 218, 'value': 'Customer Visible Comments', 'field': 'visiblecomments'},
    // {'id': 219, 'value': 'Parent Ticket', 'field': 'parentticket'}
    
  ];

  dropDownArr2 = [
    {'id': 1, 'value': 'is/equal', 'field': '='},
    {'id': 8, 'value': 'like', 'field': 'like'},
    {'id': 7, 'value': 'in', 'field': 'in'},
    {'id': 9, 'value': 'not equal', 'field': '!='},
    {'id': 6, 'value': 'not in', 'field': 'notin'},
    // {'id': 11, 'value': 'Is one of', 'field': ''},
    // {'id': 12, 'value': 'Is empty', 'field': ''},
    // {'id': 13, 'value': 'Is not empty', 'field': ''},
    // {'id': 14, 'value': 'Before', 'field': ''},
    // {'id': 15, 'value': 'Contains', 'field': ''},
    {'id': 2, 'value': 'greater', 'field': '>'},
    {'id': 3, 'value': 'less', 'field': '<'},
    {'id': 4, 'value': 'greater or equal', 'field': '>='},
    {'id': 5, 'value': 'less or equal', 'field': '<='},
    {'id': 10, 'value': 'between', 'field': 'between'}
  ];
  dropDownArr3 = [
    {'id': 1, 'value': 'true'},
    {'id': 2, 'value': 'false'},
    {'id': 3, 'value': 'add'}
  ];
  dropDownArr4 = [
    {'id': 1, 'value': 'Input Box'},
    {'id': 2, 'value': 'Dropdown'},
  ];
  dropDownSelected1: any;
  dropDownSelected2: any;
  dropDownSelected3: any;
  dropDownSelected4: any;
  toDateSelected1: any;
  fromDateSelected2: any;
  frmGroupArr = [];
  form = new form();
  submittedFormArr = [];
  GridOdataService: any = new GridOdataService();
  countSelected: number;
  gridHeaderNames = [
    {'id': 0, 'value': 'Customer1', 'field': 'levelonecatename', 'disabled': false},
    {'id': 1, 'value': 'Ticket ID', 'field': 'ticketid', 'disabled': false},
    {'id': 2, 'value': 'Source', 'field': 'source', 'disabled': false},
    {'id': 3, 'value': 'Requester Name', 'field': 'requestorname', 'disabled': false},
    {'id': 4, 'value': 'Requester Location/Branch', 'field': 'requestorlocation', 'disabled': false},
    {'id': 5, 'value': 'Requester Primary Contact (Phone/Mobile) Number', 'field': 'requestorphone', 'disabled': false},
    {'id': 6, 'value': 'Requester Email ID', 'field': 'requestoremail', 'disabled': false},
    {'id': 7, 'value': 'Original Created By Name', 'field': 'orgcreatorname', 'disabled': false},
    {'id': 8, 'value': 'Original Created By Location', 'field': 'orgcreatorlocation', 'disabled': false},
    {'id': 9, 'value': 'Original Created By Primary Contact (Phone/Mobile) Number', 'field': 'orgcreatorphone', 'disabled': false},
    {'id': 10, 'value': 'Original Created By Email ID', 'field': 'orgcreatoremail', 'disabled': false},
    {'id': 11, 'value': 'Short Description', 'field': 'shortdescription', 'disabled': false},
    {'id': 12, 'value': 'Priority', 'field': 'priority', 'disabled': false},
    {'id': 13, 'value': 'Status', 'field': 'status', 'disabled': false},
    {'id': 46, 'value': 'Ticket Type', 'field': 'tickettype', 'disabled': false},
    {'id': 53, 'value': 'Vendor Name', 'field': 'vendorname', 'disabled': false},
    {'id': 54, 'value': 'Vendor Ticket Id', 'field': 'vendorticketid', 'disabled': false},
    {'id': 55, 'value': 'Resolution Code', 'field': 'resolutioncode', 'disabled': false},
    {'id': 56, 'value': 'Resolution Comment', 'field': 'resolutioncomment', 'disabled': false},
    {'id': 57, 'value': 'Last Update By', 'field': 'lastuser', 'disabled': false},
    {'id': 58, 'value': 'Resolved Date Time', 'field': 'latestresodatetime', 'disabled': false},
    {'id': 59, 'value': 'Duration in Pending Vendor State (Minutes)', 'field': 'followuptimetaken', 'disabled': false},
    {'id': 159, 'value': 'Duration In Pending User State (Minutes)', 'field': 'userreplytimetaken', 'disabled': false},
    {'id': 60, 'value': 'Pending Vendor Count', 'field': 'pendingvendorcount', 'disabled': false},
    {'id': 50, 'value': 'Total Response SLA Time (Minutes)', 'field': 'responsetime', 'disabled': false},
    {'id': 51, 'value': 'Total Resolution SLA Time (Minutes)', 'field': 'resotimeexcludeidletime', 'disabled': false},
    {'id': 52, 'value': 'Pending User Count', 'field': 'pendingusercount', 'disabled': false},
    {'id': 14, 'value': 'VIP Ticket (Yes/No)', 'field': 'vipticket', 'disabled': false},
    {'id': 15, 'value': 'Assigned Group (Last assigned Resolver Group)', 'field': 'assignedgroup', 'disabled': false},
    {'id': 16, 'value': 'Assigned User (Last assigned  user from the Resolver Group)', 'field': 'assigneduser', 'disabled': false},
    {'id': 17, 'value': 'Resolved By Group (Last assigned Resolver Group who has resolved the ticket)', 'field': 'resogroup', 'disabled': false},
    {'id': 18, 'value': 'Resolved By User (Last assigned  user from the Resolver Group who has resolved the ticket)', 'field': 'resolveduser', 'disabled': false},
    {'id': 19, 'value': 'Created Since', 'field': 'createddatetime', 'disabled': false},
    {'id': 20, 'value': 'Last Modified Date Time', 'field': 'lastupdateddatetime', 'disabled': false},
    {'id': 27, 'value': 'Urgency', 'field': 'urgency', 'disabled': false},
    {'id': 28, 'value': 'Impact', 'field': 'impact', 'disabled': false},
    {'id': 29, 'value': 'Due Date Time', 'field': 'resosladuedatetime', 'disabled': false},
    {'id': 30, 'value': 'Response SLA Breached Status', 'field': 'respslabreachstatus', 'disabled': false},
    {'id': 31, 'value': 'Resolution SLA Breached Status', 'field': 'resolslabreachstatus', 'disabled': false},
    {'id': 75, 'value': 'Response SLA Breach Code', 'field': 'responsebreachcode', 'disabled': false},
    {'id': 76, 'value': 'Resolution SLA Breach Code', 'field': 'resolutionbreachcode', 'disabled': false},
    {'id': 77, 'value': 'Response SLA Breach Comment', 'field': 'responsebreachcomment', 'disabled': false},
    {'id': 78, 'value': 'Resolution SLA Breach Comment', 'field': 'resolutionbreachcomment', 'disabled': false},
    {'id': 79, 'value': 'Response SLA Breach Date Time', 'field': 'respsladuedatetime', 'disabled': false},
    {'id': 80, 'value': 'Resolution SLA Breach Date Time', 'field': 'resosladuedatetime', 'disabled': false},
    {'id': 32, 'value': 'Response SLA Overdue (Minutes)', 'field': 'respoverduetime', 'disabled': false},
    {'id': 33, 'value': 'Resolution SLA Overdue (Minutes)', 'field': 'resooverduetime', 'disabled': false},
    {'id': 34, 'value': 'Aging in Days (Calendar days from created date)', 'field': 'calendaraging', 'disabled': false},
    {'id': 35, 'value': 'Not Updated Since (Days)', 'field': 'worknotenotupdated', 'disabled': false},
    {'id': 36, 'value': 'Reopen Count', 'field': 'reopencount', 'disabled': false},
    {'id': 37, 'value': 'Reassignment Hop Count', 'field': 'reassigncount', 'disabled': false},
    {'id': 38, 'value': 'Category Change Count', 'field': 'categorychangecount', 'disabled': false},
    {'id': 39, 'value': 'User Follow Up', 'field': 'followupcount', 'disabled': false},
    {'id': 40, 'value': 'Outbound Count', 'field': 'outboundcount', 'disabled': false},
    // {'id': 41, 'value': 'IsParent (Yes/No)', 'field': 'isparent'},
    {'id': 42, 'value': 'Child Count (if parent)', 'field': 'childcount', 'disabled': false},
    {'id': 43, 'value': 'Response Clock Status (Running/Stopped)', 'field': 'respclockstatus', 'disabled': false},
    {'id': 44, 'value': 'Resolution Clock Status (Running/Stopped/Paused)', 'field': 'resoclockstatus', 'disabled': false},
    {'id': 45, 'value': 'Response SLA Meter %', 'field': 'responseslameterpercentage', 'disabled': false},
    {'id': 46, 'value': 'Resolution SLA Meter %', 'field': 'resolutionslameterpercentage', 'disabled': false},
    {'id': 47, 'value': 'Business Aging (HH:MM)', 'field': 'businessaging', 'disabled': false},
    {'id': 48, 'value': 'Actual Effort Spent (HH:MM)', 'field': 'actualeffort', 'disabled': false},
    {'id': 70, 'value': 'Total SLA Idle Time (Minutes)', 'field': 'slaidletime', 'disabled': false},
    // {'id': 71, 'value': 'Response SLA Overdue %', 'field': 'respoverdueperc', 'disabled': false},
    // {'id': 72, 'value': 'Resolution SLA Overdue %', 'field': 'resooverdueperc', 'disabled': false},
    {'id': 81, 'value': 'Response SLA End Date Time', 'field': 'firstresponsedatetime', 'disabled': false},
    {'id': 82, 'value': 'Resolution SLA End Date Time', 'field': 'latestresodatetime', 'disabled': false},
    {'id': 219, 'value': 'Parent Ticket', 'field': 'parentticket', 'disabled': true },
    {'id': 83, 'value': 'Response SLA Start Date Time', 'field': 'startdatetimeresponse', 'disabled': true},
    {'id': 84, 'value': 'Resolution SLA Start Date Time', 'field': 'startdatetimeresolution', 'disabled': true},
    {'id': 217, 'value': 'Status Reason', 'field': 'statusreason', 'disabled': true},
    {'id': 218, 'value': 'Customer Visible Comments', 'field': 'visiblecomments', 'disabled': true},
  ];
  selectedGridColumns = [];
  eventData = [];
  orgSelected: any;
  selectedMultipleOrgs = [];
  isEditHeader: boolean = true;
  private infoRef: MatDialogRef<unknown, any>;
  private delRef: MatDialogRef<unknown, any>;
  @ViewChild('savedFilterName') private savedFilterName;
  @ViewChild('updateFilter') private updateFilter;
  @ViewChild('editFilterName') private editFilterName;
  @ViewChild('generateReportFilter') private generateReportFilter;
  private modalReference: NgbModalRef;
  filteredNameUpdate: any;
  @ViewChild('deleteFilter') private deleteFilter;
  filteredName: any;
  listOfFilters = [];
  starStep: string;
  totalFilterData: any;
  selectedDelID: any;
  expotedData: any;
  defaultGridHeader1 = [
    {id: 0, name: 'Customer', field: 'levelonecatename'},
    {id: 1, name: 'Ticket Id', field: 'ticketid'},
    {id: 5, name: 'Status', field: 'status'},
    {id: 2, name: 'Short Description', field: 'shortdescription'},
    {id: 4, name: 'Requested For', field: 'requestorname'},
    {id: 2, name: 'Source', field: 'source'},
    {id: 14, name: 'Created Since', field: 'createddatetime'},
    {id: 3, name: 'Created By', field: 'orgcreatorname'},
    {id: 9, name: 'Vendor Name', field: 'vendorname'},
    {id: 10, name: 'Vendor Ticket Id', field: 'vendorticketid'},
    // {id: 11, name: 'Resolution Code', field: 'resolutioncode'},
    // {id: 12, name: 'Resolution Comment', field: 'resolutioncomment'},
    {id: 8, name: 'Priority', field: 'priority'},
    {id: 13, name: 'Last Update By', field: 'lastuser'},
    // {id: 14, name: 'Resolved Date Time', field: 'latestresodatetime'},
    {id: 15, name: 'Duration in Pending Vendor State (Minutes)', field: 'followuptimetaken'},
    // {id: 16, name: 'Pending Vendor Count', field: 'pendingvendorcount'},
    {id: 6, name: 'Assignee', field: 'assigneduser'},
    {id: 7, name: 'Group', field: 'assignedgroup'},
    {id: 219, name: 'Parent Ticket', field: 'parentticket' },
    {id: 83, name: 'Response SLA Start Date Time', field: 'startdatetimeresponse'},
    {id: 84, name: 'Resolution SLA Start Date Time', field: 'startdatetimeresolution'},
    {id: 217, name: 'Status Reason', field: 'statusreason'},
    {id: 218, name: 'Customer Visible Comments', field: 'visiblecomments'},
    
  ];
  defaultGridHeader2 = [
    // {id: 1, name: 'Due Date Time', field: 'resosladuedatetime'},
    // {id: 2, name: 'SLA Breached Status', field: 'resolutionslameterpercentage'},
    // {id: 3, name: 'Aging in Days', field: 'calendaraging'},
    // {id: 4, name: 'Reopen Count', field: 'reopencount'},
    // {id: 5, name: 'Priority Change Count', field: 'prioritycount'},
    // {id: 6, name: 'User Follow Up', field: 'followupcount'},
    // {id: 7, name: 'Outbound Count', field: 'outboundcount'}
  ];
  margeHeaderArr = ['clientid', 'mstorgnhirarchyid'];
  operatorDropdown = [
    {id: 0, value: 'Select Operator'},
    {id: 1, value: 'AND'},
    {id: 2, value: 'OR'}
  ];
  operatorSelected: any;
  selectedORarr = [];
  filterAddedPaginationData = [];
  headerDisplayArray = [];
  editedGridHeaderNames = [];

  disabled = true;
  onFromRunFlag = false;


  selectedFinalORQueryArray = [];
  selectedFinalANDQueryArray = [];
  concatFilterAndSearchArray = [];


  @ViewChild('supportGroupEditPopUp') private supportGroupEditPopUp;
  private infoRef1: MatDialogRef<unknown, any>;
  searchUser: FormControl = new FormControl();
  userNameSelected: any;
  userList = [];
  isLoading: boolean;
  isSameGroup: boolean;
  isFavouriteListSelected = false;


  CREATED_STATUS_SEQ = 1;
  REPOEN_STATUS_SEQ = 10;
  ACTIVE_STATUS_SEQ = 2;
  CTASK_SEQ = 5;
  OPEN_STATUS_SEQ = 29;
  STATUS_SEQ = 2;
  USER_REPLIED_STATUS_SEQ = 9;
  SR_SEQ = 2;
  CLOSE_STATUS_SEQ = 8;
  CANCEL_STATUS_SEQ = 11;
  RESOLVE_STATUS_SEQUENCE = 3;


  statusseq: number;
  agroupid: number;
  auserid: number;
  public tId: any;
  noOfHops: number;
  canForward: boolean;
  previousTerms = [];
  termNames = [];
  diffTypeId: number;
  transitionid: any;
  private workflowid: number;
  private nexttransitionid: number;
  nextstatusseq: number;
  private nextWokflowstateid: number;
  private statustypeid: number;
  private statusid: number;
  private workingtypeid: number;
  private workingid: number;
  private currentstateid: number;
  manualstateselection: number;
  manualgroupid: number;
  private manualUserSelected: number;
  private commentDialogRef: MatDialogRef<any, any>;
  ticketDetails = [];
  ticketidlabel: string;
  ticketId: string;
  stageId: number;
  agrouplvl: number;
  stateterms = [];
  typeChecked: number;
  private multitermopentype: string;
  termattachment = [];
  hideAttachment: boolean;
  formdata: any;
  hiddenManualState: boolean;
  grpSelected: number;
  ticketTab: boolean;
  private modalSubscribe: Subscription;
  lastgroup: string;
  lastuser: string;
  currentUser: string;
  currentGroup: string;
  selectedSupportGroupData = [];
  sessionStoredData: any;
  changeGroupName: string;
  categoryLoaded: boolean;
  orgTypeId: number;
  orgID: any;
  clientID: any;

  selectedOrgVals: any;
  isDisplayFlag: boolean;
  workspaceSelected: number;
  ismanagement: boolean;

  selectedFieldValue: string;
  selectedConditionValue: string;
  isNumericConditionValue: boolean;
  isValidateFilterCondition: boolean;
  isTypeChange: boolean;
  savedWorkFlowSGroup: string;

  isConditionValueDropdown: boolean;
  isConditionValueDropdownMultiSelect: boolean;

  sources = ['Select Source', 'Call', 'Email', 'Walk-in', 'Self Service'];
  STASK_SEQ = 3;
  dropDownArr5 = [];
  urgency: number;
  impact: number;
  priorities = [];

  categoriesLength: number;
  @ViewChild('endDate') endDate: ElementRef;
  @ViewChild('startDate') startDate: ElementRef
  Difference_In_Days: any;

  shortDescToolTip: any;
  ticketTypeSelected: any;
  ticketTypesForFilter = [];
  filterTypSeq: any;
  isAllOrg: boolean;
  isAllConditionValue: boolean;
  reportGeneratedList = [];
  categoryArray = [];
  sortedCategoryArray = [];
  downloadDisplayed: boolean;
  validationForCategoryDuplication: boolean;
  duplicateCategoryName = '';
  duplicateFieldChecker = [];
  isEditFilterName = false;
  isValidateFilterCategoryAndOperator = false;
  sreachedCategoryArray = [];

  gridSortedArray = [];

  constructor(private rest: RestApiService, notifier: NotifierService, public messageService: MessageService,
              private route: Router, private modalService: NgbModal, private dialog: MatDialog, private translate: TranslateService,
              private actRoute: ActivatedRoute, private config: ConfigService) {
    this.notifier = notifier;
  }

  ngOnInit() {
    this.totalData = 0;
    this.dataLoaded = true;
    this.filterLoader = true;
    this.categoryLoaded = false;
    this.isValidateFilterCondition = false;
    this.validationForCategoryDuplication = false;
    this.isAllOrg = false;
    this.downloadDisplayed = true;
    this.impact = 0;
    this.urgency = 0;
    this.ticketTab = false;
    this.onFromRunFlag = false;
    this.countSelected = 1;
    this.isEditHeader = false;
    this.form = new form();
    this.frmGroupArr.push(this.form);
    this.frmGroupArr[0].operatorSelected = 0;
    this.frmGroupArr[0].isNumericConditionValue = false;
    this.frmGroupArr[0].isConditionValueDropdown = false;
    this.frmGroupArr[0].isConditionValueDropdownMultiSelect = false;
    this.duplicateFieldChecker = [];
    this.gridSortedArray = [];
    this.pageSizeObj = this.messageService.pagination;
    this.colorObj = this.messageService.colors;
    this.ticketTypeArr = {};
    this.folderLoaded = true;
    this.display = false;
    if (this.messageService.color) {
      this.selectedColor = this.messageService.color;
      for (let i = 0; i < this.colorObj.length; i++) {
        if (this.selectedColor === this.colorObj[i].selectedValue) {
          this.fontColor = this.colorObj[i].fontColorValue;
          this.footerCss = this.colorObj[i].footerCssValue;
          this.tableCss = this.colorObj[i].tableCss;
          this.footerItem = this.colorObj[i].footerItemValue;
          this.buttonCss = this.colorObj[i].buttonCss;
        }
      }
    }
    this.messageService.getColor().subscribe((data: any) => {
      this.selectedColor = data;
      for (let i = 0; i < this.colorObj.length; i++) {
        if (this.selectedColor === this.colorObj[i].selectedValue) {
          this.fontColor = this.colorObj[i].fontColorValue;
          this.footerCss = this.colorObj[i].footerCssValue;
          this.tableCss = this.colorObj[i].tableCss;
          this.footerItem = this.colorObj[i].footerItemValue;
          this.buttonCss = this.colorObj[i].buttonCss;
        }
      }
    });
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.name = this.messageService.loginname + '-' + this.messageService.mobile + '-' + this.messageService.email;
      this.userGroups = this.messageService.group;
      this.userGroupSelected = this.userGroups[0].id;
      this.orgTypeId = this.messageService.orgnTypeId;
      if (this.userGroups !== undefined && this.userGroups.length > 0) {
        if (this.messageService.getSupportGroup() === null) {
          if (Number(this.messageService.defaultGroupId) !== 0) {
            this.userGroupId = Number(this.messageService.defaultGroupId);
          } else {
            this.userGroupId = this.userGroups[0].id;
          }
        } else {
          const group = this.messageService.getSupportGroup();
          this.userGroupId = group.groupId;
        }
        for (let i = 0; i < this.userGroups.length; i++) {
          if (this.userGroups[i].id === this.userGroupId) {
            this.groupName = this.userGroups[i].groupname;
            this.grpLevel = this.userGroups[i].levelid;
            this.hascatalog = this.userGroups[i].hascatalog;
            this.ismanagement = this.userGroups[i].ismanagement;
          }
        }
        this.userGroupSelected = this.userGroupId;
      }

      this.orgId = this.messageService.orgnId;
      this.onPageLoad();
    }
    this.userAuth = this.messageService.getClientUserAuth().subscribe(auth => {
      this.name = auth[0].loginname + '-' + auth[0].email + '-' + auth[0].mobile;
      this.userGroups = auth[0].group;
      this.clientId = auth[0].clientid;
      this.orgId = auth[0].mstorgnhirarchyid;
      this.orgTypeId = auth[0].orgntypeid;
      if (this.userGroups !== undefined && this.userGroups.length > 0) {
        if (this.messageService.getSupportGroup() === null) {
          if (Number(this.messageService.defaultGroupId) !== 0) {
            this.userGroupId = Number(this.messageService.defaultGroupId);
          } else {
            this.userGroupId = this.userGroups[0].id;
          }
        } else {
          const group = this.messageService.getSupportGroup();
          this.userGroupId = group.groupId;
        }
        for (let i = 0; i < this.userGroups.length; i++) {
          if (this.userGroups[i].id === this.userGroupId) {
            this.groupName = this.userGroups[i].groupname;
            this.grpLevel = this.userGroups[i].levelid;
            this.hascatalog = this.userGroups[i].hascatalog;
            this.ismanagement = this.userGroups[i].ismanagement;
          }
        }
        this.userGroupSelected = this.userGroupId;
      }
      this.onPageLoad();
    });

    this.gridOptions = {
      enableAutoResize: true,
      enableCellNavigation: true,
      enableFiltering: true,
      editable: true,
      rowSelectionOptions: {
        selectActiveRow: false
      },
      enableRowSelection: true,
      backendServiceApi: {
        service: this.GridOdataService,
        process: (query) => this.getCustomApiCall(query),
        postProcess: (response) => {

        }

      },
      gridMenu: {
        hideExportTextDelimitedCommand: false,
        hideExportExcelCommand: true,
      },

    };
    this.dataset = [];
  }

  excelDownLoadData(searchedData: any, searchCategoryData: any) {
    const data = {
      'where': searchedData,
      'cat': searchCategoryData,
      'headers': this.margeHeaderArr,
      'headersdisplay': this.headerDisplayArray,
      // "order": sortedData,
    };
    this.rest.generatereport(data).subscribe((res: any) => {
      
    }, (err) => {

    });
  }


  downloadFile(uploadname, originalname) {
    const data = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': Number(this.orgId),
      'filename': uploadname
    };
    this.rest.filedownload(data).subscribe((blob: any) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = originalname;
      a.click();
      URL.revokeObjectURL(objectUrl);
      this.notifier.notify('success', 'Downloaded Successfully');
    });
  }


  defaultGridHeaders(){
    this.editedGridHeaderNames = [];
    this.eventData = [];
    this.selectedGridColumns = [];
    for(let i=0;i<this.defaultGridHeader1.length;i++){
      for(let j=0;j<this.gridHeaderNames.length;j++){
        if(String(this.defaultGridHeader1[i].field) === String(this.gridHeaderNames[j].field)){
          this.selectedGridColumns.push({
            'id': this.gridHeaderNames[j].id,
            'field': this.gridHeaderNames[j].field,
            'value': this.gridHeaderNames[j].value,
            'disabled': this.gridHeaderNames[j].disabled
          });
        }
      }
    }
    if (this.grpLevel > 1) {
      for(let i=0;i<this.defaultGridHeader2.length;i++){
        for(let j=0;j<this.gridHeaderNames.length;j++){
          if(String(this.defaultGridHeader2[i].field) === String(this.gridHeaderNames[j].field)){
            this.selectedGridColumns.push({
              'id': this.gridHeaderNames[j].id,
              'field': this.gridHeaderNames[j].field,
              'value': this.gridHeaderNames[j].value,
              'disabled': this.gridHeaderNames[j].disabled
            });
          }
        }
      }
    }
    this.eventData = this.selectedGridColumns;
    this.editedGridHeaderNames = this.gridHeaderNames.filter(entryValues1 => !this.selectedGridColumns.some(entryValues2 => entryValues1.field === entryValues2.field));
    this.getColumnDefintion();
  }

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid && angularGrid.slickGrid || {};
    this.columnData = this.gridObj.getColumns();
  }

  onCellChanged(e, args) {

  }

  onCellClicked(e, args) {

  }

  closeModal2() {
    this.selectedSupportGroupData = [];
    this.infoRef1.close();
  }

  onSelectGroup() {
    if (this.userGroupSelected !== 0) {
      this.userGroupId = this.userGroupSelected;
      for (let i = 0; i < this.userGroups.length; i++) {
        if (Number(this.userGroups[i].id) === Number(this.userGroupId)) {
          this.groupName = this.userGroups[i].groupname;
          this.grpLevel = this.userGroups[i].levelid;
          this.hascatalog = this.userGroups[i].hascatalog;
        }
      }
      if (this.grpLevel === 0) {
        this.isLowestLevel = true;
      }
      this.messageService.saveSupportGroup({
        groupId: this.userGroupId,
        grpName: this.groupName,
        levelid: this.grpLevel,
        hascatalog: this.hascatalog
      });
      this.messageService.setGroupChangeData(this.userGroupId);
      this.onPageLoad();
    }
  }

  onPageLoad() {
    this.itemsPerPage = this.pageSizeObj[0].value;
    this.pageSizeSelected = Number(this.messageService.pageSelected);
    this.columnDefinitions = [];
    // console.log("\n , this.orgId", this.orgId);
    this.getRecordDiffType();
    // console.log("\n this.orgTypeId   =========>>>>>>>>>>>.    ", this.orgTypeId);
    if (Number(this.orgTypeId) === 2) {
      this.getorgassignedcustomer();
      this.isAllOrg = false;
    } else {
      // console.log("\n ELSE PART.................................................");
      this.orgSelected = [];
      this.orgSelected.push(this.orgId);
      this.onOrgChange(this.orgSelected, '');
    }
    this.isAllConditionValue = false;
    this.refreshReport();
  }

  getorgassignedcustomer() {
    const data = {
      clientid: this.clientId,
      refuserid: Number(this.messageService.getUserId())
    };
    this.rest.getorgassignedcustomer(data).subscribe((res: any) => {
      if (res.success) {
        this.selectedMultipleOrgs = res.details.values;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onOrgChange(selectedIDs, type) {
    // console.log("\n this.orgSelected ============   ", this.orgSelected);
      this.selectedOrgVals = selectedIDs.toString();
    if (selectedIDs.length === this.selectedMultipleOrgs.length) {
      this.isAllOrg = true;
    } else {
      this.isAllOrg = false;
    }
    if(this.orgSelected.length > 0){
      const data = {
        'clientid': this.clientId,
        'mstorgnhirarchyid': Number(this.orgSelected[0]),
        'recorddifftypeid': 2,
        'offset': 0,
        'limit': 100
      };
      this.rest.getAllRecordDiff(data).subscribe((res: any) => {
        this.respObject = res.details.values;
        this.respObject.reverse();
        if(res.success){
          this.ticketTypesForFilter = this.respObject;
          if(type === 'cellClicked'){
            for(let i=0;i<this.ticketTypesForFilter.length;i++){
              if(this.ticketTypesForFilter[i].name === this.ticketTypeSelected){
                this.typSelected = Number(this.ticketTypesForFilter[i].id);
                this.onTicketTypeChange(this.ticketTypeSelected, 'cellClicked');
              }
            }
          } else {
            this.ticketTypeSelected = "";
          }
        } else {
          this.notifier.notify('error', this.respObject.errorMessage);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    }
  }


  selectAllOrg() {
    this.orgSelected = [];
    if (this.isAllOrg) {
      for (let i = 0; i < this.selectedMultipleOrgs.length; i++) {
        this.orgSelected.push(Number(this.selectedMultipleOrgs[i].mstorgnhirarchyid));
      }
      this.onOrgChange(this.orgSelected, 'all');
    }
  }


  onTicketTypeChange(value, type){
    if(type !== 'cellClicked'){
      this.gridHeaderNames = [];
      this.gridHeaderNames = [
        {'id': 0, 'value': 'Customer', 'field': 'levelonecatename', 'disabled': false},
        {'id': 1, 'value': 'Ticket ID', 'field': 'ticketid', 'disabled': false},
        {'id': 2, 'value': 'Source', 'field': 'source', 'disabled': false},
        {'id': 3, 'value': 'Requester Name', 'field': 'requestorname', 'disabled': false},
        {'id': 4, 'value': 'Requester Location/Branch', 'field': 'requestorlocation', 'disabled': false},
        {'id': 5, 'value': 'Requester Primary Contact (Phone/Mobile) Number', 'field': 'requestorphone', 'disabled': false},
        {'id': 6, 'value': 'Requester Email ID', 'field': 'requestoremail', 'disabled': false},
        {'id': 7, 'value': 'Original Created By Name', 'field': 'orgcreatorname', 'disabled': false},
        {'id': 8, 'value': 'Original Created By Location', 'field': 'orgcreatorlocation', 'disabled': false},
        {'id': 9, 'value': 'Original Created By Primary Contact (Phone/Mobile) Number', 'field': 'orgcreatorphone', 'disabled': false},
        {'id': 10, 'value': 'Original Created By Email ID', 'field': 'orgcreatoremail', 'disabled': false},
        {'id': 11, 'value': 'Short Description', 'field': 'shortdescription', 'disabled': false},
        {'id': 12, 'value': 'Priority', 'field': 'priority', 'disabled': false},
        {'id': 13, 'value': 'Status', 'field': 'status', 'disabled': false},
        {'id': 46, 'value': 'Ticket Type', 'field': 'tickettype', 'disabled': false},
        {'id': 53, 'value': 'Vendor Name', 'field': 'vendorname', 'disabled': false},
        {'id': 54, 'value': 'Vendor Ticket Id', 'field': 'vendorticketid', 'disabled': false},
        {'id': 55, 'value': 'Resolution Code', 'field': 'resolutioncode', 'disabled': false},
        {'id': 56, 'value': 'Resolution Comment', 'field': 'resolutioncomment', 'disabled': false},
        {'id': 57, 'value': 'Last Update By', 'field': 'lastuser', 'disabled': false},
        {'id': 58, 'value': 'Resolved Date Time', 'field': 'latestresodatetime', 'disabled': false},
        {'id': 59, 'value': 'Duration in Pending Vendor State (Minutes)', 'field': 'followuptimetaken', 'disabled': false},
        {'id': 159, 'value': 'Duration In Pending User State (Minutes)', 'field': 'userreplytimetaken', 'disabled': false},
        {'id': 60, 'value': 'Pending Vendor Count', 'field': 'pendingvendorcount', 'disabled': false},
        {'id': 49, 'value': 'Priority Change Count', 'field': 'prioritycount', 'disabled': false},
        {'id': 50, 'value': 'Total Response SLA Time (Minutes)', 'field': 'responsetime', 'disabled': false},
        {'id': 51, 'value': 'Total Resolution SLA Time (Minutes)', 'field': 'resotimeexcludeidletime', 'disabled': false},
        {'id': 52, 'value': 'Pending User Count', 'field': 'pendingusercount', 'disabled': false},
        {'id': 14, 'value': 'VIP Ticket (Yes/No)', 'field': 'vipticket', 'disabled': false},
        {'id': 15, 'value': 'Assigned Group (Last assigned Resolver Group)', 'field': 'assignedgroup', 'disabled': false},
        {'id': 16, 'value': 'Assigned User (Last assigned  user from the Resolver Group)', 'field': 'assigneduser', 'disabled': false},
        {'id': 17, 'value': 'Resolved By Group (Last assigned Resolver Group who has resolved the ticket)', 'field': 'resogroup', 'disabled': false},
        {'id': 18, 'value': 'Resolved By User (Last assigned  user from the Resolver Group who has resolved the ticket)', 'field': 'resolveduser', 'disabled': false},
        {'id': 19, 'value': 'Created Since', 'field': 'createddatetime', 'disabled': false},
        {'id': 20, 'value': 'Last Modified Date Time', 'field': 'lastupdateddatetime', 'disabled': false},
        {'id': 27, 'value': 'Urgency', 'field': 'urgency', 'disabled': false},
        {'id': 28, 'value': 'Impact', 'field': 'impact', 'disabled': false},
        {'id': 29, 'value': 'Due Date Time', 'field': 'resosladuedatetime', 'disabled': false},
        {'id': 30, 'value': 'Response SLA Breached Status', 'field': 'respslabreachstatus', 'disabled': false},
        {'id': 31, 'value': 'Resolution SLA Breached Status', 'field': 'resolslabreachstatus', 'disabled': false},
        {'id': 75, 'value': 'Response SLA Breach Code', 'field': 'responsebreachcode', 'disabled': false},
        {'id': 76, 'value': 'Resolution SLA Breach Code', 'field': 'resolutionbreachcode', 'disabled': false},
        {'id': 77, 'value': 'Response SLA Breach Comment', 'field': 'responsebreachcomment', 'disabled': false},
        {'id': 78, 'value': 'Resolution SLA Breach Comment', 'field': 'resolutionbreachcomment', 'disabled': false},
        {'id': 79, 'value': 'Response SLA Breach Date Time', 'field': 'respsladuedatetime', 'disabled': false},
        {'id': 80, 'value': 'Resolution SLA Breach Date Time', 'field': 'resosladuedatetime', 'disabled': false},
        {'id': 32, 'value': 'Response SLA Overdue (Minutes)', 'field': 'respoverduetime', 'disabled': false},
        {'id': 33, 'value': 'Resolution SLA Overdue (Minutes)', 'field': 'resooverduetime', 'disabled': false},
        {'id': 34, 'value': 'Aging in Days (Calendar days from created date)', 'field': 'calendaraging', 'disabled': false},
        {'id': 35, 'value': 'Not Updated Since (Days)', 'field': 'worknotenotupdated', 'disabled': false},
        {'id': 36, 'value': 'Reopen Count', 'field': 'reopencount', 'disabled': false},
        {'id': 37, 'value': 'Reassignment Hop Count', 'field': 'reassigncount', 'disabled': false},
        {'id': 38, 'value': 'Category Change Count', 'field': 'categorychangecount', 'disabled': false},
        {'id': 39, 'value': 'User Follow Up', 'field': 'followupcount', 'disabled': false},
        {'id': 40, 'value': 'Outbound Count', 'field': 'outboundcount', 'disabled': false},
        // {'id': 41, 'value': 'IsParent (Yes/No)', 'field': 'isparent'},
        {'id': 42, 'value': 'Child Count (if parent)', 'field': 'childcount', 'disabled': false},
        {'id': 43, 'value': 'Response Clock Status (Running/Stopped)', 'field': 'respclockstatus', 'disabled': false},
        {'id': 44, 'value': 'Resolution Clock Status (Running/Stopped/Paused)', 'field': 'resoclockstatus', 'disabled': false},
        {'id': 45, 'value': 'Response SLA Meter %', 'field': 'responseslameterpercentage', 'disabled': false},
        {'id': 46, 'value': 'Resolution SLA Meter %', 'field': 'resolutionslameterpercentage', 'disabled': false},
        {'id': 47, 'value': 'Business Aging (HH:MM)', 'field': 'businessaging', 'disabled': false},
        {'id': 48, 'value': 'Actual Effort Spent (HH:MM)', 'field': 'actualeffort', 'disabled': false},
        {'id': 70, 'value': 'Total SLA Idle Time (Minutes)', 'field': 'slaidletime', 'disabled': false},
        // {'id': 71, 'value': 'Response SLA Overdue %', 'field': 'respoverdueperc', 'disabled': false},
        // {'id': 72, 'value': 'Resolution SLA Overdue %', 'field': 'resooverdueperc', 'disabled': false},
        {'id': 81, 'value': 'Response SLA End Date Time', 'field': 'firstresponsedatetime', 'disabled': false},
        {'id': 82, 'value': 'Resolution SLA End Date Time', 'field': 'latestresodatetime', 'disabled': false},
        {'id': 219, 'value': 'Parent Ticket', 'field': 'parentticket', 'disabled': true },
        {'id': 83, 'value': 'Response SLA Start Date Time', 'field': 'startdatetimeresponse', 'disabled': true},
        {'id': 84, 'value': 'Resolution SLA Start Date Time', 'field': 'startdatetimeresolution', 'disabled': true},
        {'id': 217, 'value': 'Status Reason', 'field': 'statusreason', 'disabled': true},
        {'id': 218, 'value': 'Customer Visible Comments', 'field': 'visiblecomments', 'disabled': true},
      ];

      this.frmGroupArr = [];
      this.form = new form();
      this.frmGroupArr.push(this.form);
      this.frmGroupArr[0].operatorSelected = 0;
      this.frmGroupArr[0].isNumericConditionValue = false;
      this.frmGroupArr[0].isConditionValueDropdown = false;
      this.frmGroupArr[0].isConditionValueDropdownMultiSelect = false;
      this.duplicateFieldChecker = [];
  
      this.editedGridHeaderNames = [];
      this.eventData = [];
      this.selectedGridColumns = [];
      for(let i=0;i<this.defaultGridHeader1.length;i++){
        for(let j=0;j<this.gridHeaderNames.length;j++){
          if(String(this.defaultGridHeader1[i].field) === String(this.gridHeaderNames[j].field)){
            this.selectedGridColumns.push({
              'id': this.gridHeaderNames[j].id,
              'field': this.gridHeaderNames[j].field,
              'value': this.gridHeaderNames[j].value,
              'disabled': this.gridHeaderNames[j].disabled
            });
          }
        }
      }
      if (this.grpLevel > 1) {
        for(let i=0;i<this.defaultGridHeader2.length;i++){
          for(let j=0;j<this.gridHeaderNames.length;j++){
            if(String(this.defaultGridHeader2[i].field) === String(this.gridHeaderNames[j].field)){
              this.selectedGridColumns.push({
                'id': this.gridHeaderNames[j].id,
                'field': this.gridHeaderNames[j].field,
                'value': this.gridHeaderNames[j].value,
                'disabled': this.gridHeaderNames[j].disabled
              });
            }
          }
        }
      }
    }
    // console.log("\n this.selectedGridColumns    2222222222222222   ========================>>>>>>>>>>>>>>>>>>>>>>>          ", this.selectedGridColumns);
    let seq;
    for (let i = 0; i < this.ticketTypesForFilter.length; i++) {
      if (this.ticketTypeSelected === this.ticketTypesForFilter[i].name) {
        seq = this.ticketTypesForFilter[i].seqno;
        this.filterTypSeq = seq;
        this.typSelected = this.ticketTypesForFilter[i].id;
      }
    }
    if (this.filterTypSeq !== this.SR_SEQ && this.filterTypSeq !== this.STASK_SEQ) {
      if (this.sources.indexOf('Alert') === -1) {
        this.sources.splice(1, 0, 'Alert');
      }
    } else {
      if (this.sources.indexOf('Alert') > -1) {
        this.sources.splice(1, 1);
      }
    }
    this.getlabelbydiffseq(type);
  }

  changeRouting() {

  }

  toggleViews() {
    this.displayed = !this.displayed;
  }

  getTicketType() {
    const ticketTypeData = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': Number(this.orgId),
      'recorddifftypeid': this.TICKET_TYPE_ID
    };
    this.rest.getrecordtypedata(ticketTypeData).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.ticketTypeLoaded = true;
        this.ticketsTyp = this.respObject.response;
        const storage = JSON.parse(sessionStorage.getItem('dd'));
        if (storage === null) {
          if (this.ticketsTyp.length > 0) {
            this.typSelected = this.ticketsTyp[0].id;
            this.typeSeq = this.ticketsTyp[0].seqno;
          }
          this.messageService.saveMenuData({
            type: this.typSelected,
            seq: this.typeSeq,
          });
        } else {
          const type = storage.type;
          this.typeSeq = storage.seq;
          this.load = false;
          for (let i = 0; i < this.ticketsTyp.length; i++) {
            if (this.ticketsTyp[i].id === type) {
              this.typSelected = this.ticketsTyp[i].id;
              this.load = true;
              break;
            }
          }
        }

        for (let i = 0; i < this.ticketsTyp.length; i++) {
          if (Number(this.typSelected) === this.ticketsTyp[i].id) {
            this.ticketTypeArr = {id: this.ticketsTyp[i].typeid, val: this.typSelected};
          }
        }
        this.defaultGridHeaders();
        this.toggleStarViews('default');
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getRecordDiffType() {
    this.rest.getRecordDiffType().subscribe((res: any) => {
      if (res.success) {
        this.recordType = res.details;
        for (let i = 0; i < this.recordType.length; i++) {
          if (Number(this.recordType[i].seqno) === Number(this.TICKET_TYPE_SEQ)) {
            this.TICKET_TYPE_ID = this.recordType[i].id;
            this.getTicketType();
          }

        }
      }
    });
  }

  onSelectTypeChange(selectedIndex) {

  }

  toggleStarViews(type) {
    this.countSelected = 2;
    this.archiveDisplayed = false;
    this.starDisplayed = true;
    this.clockDisplayed = false;
    this.step = undefined;
    this.messageService.removeTile();
    this.recordfilterlist(this.starStep, type);
  }

  recordfilterlist(starStep, type) {
    this.dataLoaded = false;
    this.listOfFilters = [];
    this.rest.recordfilterlist().subscribe((res: any) => {
      if (res.success) {
        this.respObject = res.details;
        this.listOfFilters = res.details.result;
        this.totalFilterData = res.details.total;
        if(type !== 'default'){
          if(this.listOfFilters.length > 0){
            if(this.starStep === undefined){
              this.starStep = this.listOfFilters[0].id;
              this.clickedStarFilter(this.starStep, type);
            } else {
              this.clickedStarFilter(starStep, type);
            }
          } else {
            this.dataLoaded = true;
          }
        } else {
          this.dataLoaded = true;
        }
      } else {
        this.dataLoaded = true;
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.dataLoaded = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });

  }


  clickedStarFilter(selectedID, type) {
    this.filterLoader = false;
    this.starStep = selectedID;
    this.onFromRunFlag = false;
    this.selectedGridColumns = [];
    this.submittedFormArr = [];
    this.orgSelected = [];
    if(Number(this.orgTypeId) === 2){
      this.getorgassignedcustomer();
    }
    this.margeHeaderArr = ['clientid', 'mstorgnhirarchyid'];
    this.filterAddedPaginationData = [];
    this.editedGridHeaderNames = [];
    this.gridHeaderNames = [
      {'id': 0, 'value': 'Customer', 'field': 'levelonecatename', 'disabled': false},
      {'id': 1, 'value': 'Ticket ID', 'field': 'ticketid', 'disabled': false},
      {'id': 2, 'value': 'Source', 'field': 'source', 'disabled': false},
      {'id': 3, 'value': 'Requester Name', 'field': 'requestorname', 'disabled': false},
      {'id': 4, 'value': 'Requester Location/Branch', 'field': 'requestorlocation', 'disabled': false},
      {'id': 5, 'value': 'Requester Primary Contact (Phone/Mobile) Number', 'field': 'requestorphone', 'disabled': false},
      {'id': 6, 'value': 'Requester Email ID', 'field': 'requestoremail', 'disabled': false},
      {'id': 7, 'value': 'Original Created By Name', 'field': 'orgcreatorname', 'disabled': false},
      {'id': 8, 'value': 'Original Created By Location', 'field': 'orgcreatorlocation', 'disabled': false},
      {'id': 9, 'value': 'Original Created By Primary Contact (Phone/Mobile) Number', 'field': 'orgcreatorphone', 'disabled': false},
      {'id': 10, 'value': 'Original Created By Email ID', 'field': 'orgcreatoremail', 'disabled': false},
      {'id': 11, 'value': 'Short Description', 'field': 'shortdescription', 'disabled': false},
      {'id': 12, 'value': 'Priority', 'field': 'priority', 'disabled': false},
      {'id': 13, 'value': 'Status', 'field': 'status', 'disabled': false},
      {'id': 46, 'value': 'Ticket Type', 'field': 'tickettype', 'disabled': false},
      {'id': 53, 'value': 'Vendor Name', 'field': 'vendorname', 'disabled': false},
      {'id': 54, 'value': 'Vendor Ticket Id', 'field': 'vendorticketid', 'disabled': false},
      {'id': 55, 'value': 'Resolution Code', 'field': 'resolutioncode', 'disabled': false},
      {'id': 56, 'value': 'Resolution Comment', 'field': 'resolutioncomment', 'disabled': false},
      {'id': 57, 'value': 'Last Update By', 'field': 'lastuser', 'disabled': false},
      {'id': 58, 'value': 'Resolved Date Time', 'field': 'latestresodatetime', 'disabled': false},
      {'id': 59, 'value': 'Duration in Pending Vendor State (Minutes)', 'field': 'followuptimetaken', 'disabled': false},
      {'id': 159, 'value': 'Duration In Pending User State (Minutes)', 'field': 'userreplytimetaken', 'disabled': false},
      {'id': 60, 'value': 'Pending Vendor Count', 'field': 'pendingvendorcount', 'disabled': false},
      {'id': 49, 'value': 'Priority Change Count', 'field': 'prioritycount', 'disabled': false},
      {'id': 50, 'value': 'Total Response SLA Time (Minutes)', 'field': 'responsetime', 'disabled': false},
      {'id': 51, 'value': 'Total Resolution SLA Time (Minutes)', 'field': 'resotimeexcludeidletime', 'disabled': false},
      {'id': 52, 'value': 'Pending User Count', 'field': 'pendingusercount', 'disabled': false},
      {'id': 14, 'value': 'VIP Ticket (Yes/No)', 'field': 'vipticket', 'disabled': false},
      {'id': 15, 'value': 'Assigned Group (Last assigned Resolver Group)', 'field': 'assignedgroup', 'disabled': false},
      {'id': 16, 'value': 'Assigned User (Last assigned  user from the Resolver Group)', 'field': 'assigneduser', 'disabled': false},
      {'id': 17, 'value': 'Resolved By Group (Last assigned Resolver Group who has resolved the ticket)', 'field': 'resogroup', 'disabled': false},
      {'id': 18, 'value': 'Resolved By User (Last assigned  user from the Resolver Group who has resolved the ticket)', 'field': 'resolveduser', 'disabled': false},
      {'id': 19, 'value': 'Created Since', 'field': 'createddatetime', 'disabled': false},
      {'id': 20, 'value': 'Last Modified Date Time', 'field': 'lastupdateddatetime', 'disabled': false},
      {'id': 27, 'value': 'Urgency', 'field': 'urgency', 'disabled': false},
      {'id': 28, 'value': 'Impact', 'field': 'impact', 'disabled': false},
      {'id': 29, 'value': 'Due Date Time', 'field': 'resosladuedatetime', 'disabled': false},
      {'id': 30, 'value': 'Response SLA Breached Status', 'field': 'respslabreachstatus', 'disabled': false},
      {'id': 31, 'value': 'Resolution SLA Breached Status', 'field': 'resolslabreachstatus', 'disabled': false},
      {'id': 75, 'value': 'Response SLA Breach Code', 'field': 'responsebreachcode', 'disabled': false},
      {'id': 76, 'value': 'Resolution SLA Breach Code', 'field': 'resolutionbreachcode', 'disabled': false},
      {'id': 77, 'value': 'Response SLA Breach Comment', 'field': 'responsebreachcomment', 'disabled': false},
      {'id': 78, 'value': 'Resolution SLA Breach Comment', 'field': 'resolutionbreachcomment', 'disabled': false},
      {'id': 79, 'value': 'Response SLA Breach Date Time', 'field': 'respsladuedatetime', 'disabled': false},
      {'id': 80, 'value': 'Resolution SLA Breach Date Time', 'field': 'resosladuedatetime', 'disabled': false},
      {'id': 32, 'value': 'Response SLA Overdue (Minutes)', 'field': 'respoverduetime', 'disabled': false},
      {'id': 33, 'value': 'Resolution SLA Overdue (Minutes)', 'field': 'resooverduetime', 'disabled': false},
      {'id': 34, 'value': 'Aging in Days (Calendar days from created date)', 'field': 'calendaraging', 'disabled': false},
      {'id': 35, 'value': 'Not Updated Since (Days)', 'field': 'worknotenotupdated', 'disabled': false},
      {'id': 36, 'value': 'Reopen Count', 'field': 'reopencount', 'disabled': false},
      {'id': 37, 'value': 'Reassignment Hop Count', 'field': 'reassigncount', 'disabled': false},
      {'id': 38, 'value': 'Category Change Count', 'field': 'categorychangecount', 'disabled': false},
      {'id': 39, 'value': 'User Follow Up', 'field': 'followupcount', 'disabled': false},
      {'id': 40, 'value': 'Outbound Count', 'field': 'outboundcount', 'disabled': false},
      // {'id': 41, 'value': 'IsParent (Yes/No)', 'field': 'isparent'},
      {'id': 42, 'value': 'Child Count (if parent)', 'field': 'childcount', 'disabled': false},
      {'id': 43, 'value': 'Response Clock Status (Running/Stopped)', 'field': 'respclockstatus', 'disabled': false},
      {'id': 44, 'value': 'Resolution Clock Status (Running/Stopped/Paused)', 'field': 'resoclockstatus', 'disabled': false},
      {'id': 45, 'value': 'Response SLA Meter %', 'field': 'responseslameterpercentage', 'disabled': false},
      {'id': 46, 'value': 'Resolution SLA Meter %', 'field': 'resolutionslameterpercentage', 'disabled': false},
      {'id': 47, 'value': 'Business Aging (HH:MM)', 'field': 'businessaging', 'disabled': false},
      {'id': 48, 'value': 'Actual Effort Spent (HH:MM)', 'field': 'actualeffort', 'disabled': false},
      {'id': 70, 'value': 'Total SLA Idle Time (Minutes)', 'field': 'slaidletime', 'disabled': false},
      // {'id': 71, 'value': 'Response SLA Overdue %', 'field': 'respoverdueperc', 'disabled': false},
      // {'id': 72, 'value': 'Resolution SLA Overdue %', 'field': 'resooverdueperc', 'disabled': false},
      {'id': 81, 'value': 'Response SLA End Date Time', 'field': 'firstresponsedatetime', 'disabled': false},
      {'id': 82, 'value': 'Resolution SLA End Date Time', 'field': 'latestresodatetime', 'disabled': false},
      {'id': 219, 'value': 'Parent Ticket', 'field': 'parentticket', 'disabled': true },
      {'id': 83, 'value': 'Response SLA Start Date Time', 'field': 'startdatetimeresponse', 'disabled': true},
      {'id': 84, 'value': 'Resolution SLA Start Date Time', 'field': 'startdatetimeresolution', 'disabled': true},
      {'id': 217, 'value': 'Status Reason', 'field': 'statusreason', 'disabled': true},
      {'id': 218, 'value': 'Customer Visible Comments', 'field': 'visiblecomments', 'disabled': true},
    ];
    // console.log("\n On Cell Clicked................................................");
    if (this.listOfFilters.length > 0) {
      // console.log("\n this.listOfFilters.length    ................................................");
      // console.log("\n inside else...............", this.selectedMultipleOrgs);
      for (let i = 0; i < this.listOfFilters.length; i++) {
        if (Number(this.listOfFilters[i].id) === Number(this.starStep)) {
          this.filteredNameUpdate = '';
          this.filteredNameUpdate = this.listOfFilters[i].name;
          const data = JSON.parse(this.listOfFilters[i].filter);
          const data1 = data.headers;
          let duplicateHeaderCheck = data.duplicateChecker;
          // console.log("\n duplicateHeaderCheck     =============================== >>>>>>>>>>>>>>>>>>>>>>>     ", duplicateHeaderCheck);
          data1.push('parentticket','startdatetimeresponse','startdatetimeresolution','statusreason', 'visiblecomments');
          this.margeHeaderArr.push('recordid', 'tickettypeid');
          for (let j = 0; j < data1.length; j++) {
            for (let p = 0; p < this.gridHeaderNames.length; p++) {
              // console.log("\n data1[j]  ----->>>>>.    ", data1[j] , "     this.gridHeaderNames[p].field    ----------->>>>.   ", this.gridHeaderNames[p].field, this.gridHeaderNames[p].id);
              if (String(data1[j]) === String(this.gridHeaderNames[p].field)) {
                // console.log("\n data1[j] ============   ", data1[j], j);
                if((String(data1[j]) === 'resosladuedatetime') || (String(data1[j]) === 'latestresodatetime')){
                  // console.log("\n INSIDE IFFFFFFFFFFFFFFFFF..............................................", duplicateHeaderCheck);
                  if(duplicateHeaderCheck){
                    // console.log("\n 1111111111111111111111111111111111111111111111.....................................");
                    for(let t = 0; t < duplicateHeaderCheck.length; t++){
                      // console.log("\n this.gridHeaderNames[p].id    ==============>>>>>>>>>>>>>>>>   ", this.gridHeaderNames[p].id);
                      // console.log("\n duplicateHeaderCheck[t]   ==============>>>>>>>>>>>>>>>>   ", duplicateHeaderCheck[t]);
                      if(this.gridHeaderNames[p].id === Number(duplicateHeaderCheck[t])){
                        this.selectedGridColumns.push({
                          'id': this.gridHeaderNames[p].id,
                          'field': this.gridHeaderNames[p].field,
                          'value': this.gridHeaderNames[p].value,
                          'disabled': this.gridHeaderNames[p].disabled
                        });
                        delete duplicateHeaderCheck[t];
                      }
                    }
                  } else {
                    this.selectedGridColumns.push({
                      'id': this.gridHeaderNames[p].id,
                      'field': this.gridHeaderNames[p].field,
                      'value': this.gridHeaderNames[p].value,
                      'disabled': this.gridHeaderNames[p].disabled
                    });
                  }
                } else {
                  this.selectedGridColumns.push({
                    'id': this.gridHeaderNames[p].id,
                    'field': this.gridHeaderNames[p].field,
                    'value': this.gridHeaderNames[p].value,
                    'disabled': this.gridHeaderNames[p].disabled
                  });
                }
              }
            }
            this.margeHeaderArr.push(data1[j]);
          }
          // console.log("\n this.selectedGridColumns   ===================>>>>>>>>>>>>>>>>>>>>>    111111111111111111111111    ", this.selectedGridColumns);
          // console.log("\n this.gridHeaderNames   ===================>>>>>>>>>>>>>>>>>>>>>     ", this.gridHeaderNames);
          let removeDuplicateNames = [];
          $.each(this.margeHeaderArr, function(i, el) {
            if ($.inArray(el, removeDuplicateNames) === -1) {
              removeDuplicateNames.push(el);
            }
          });
          this.margeHeaderArr = removeDuplicateNames;
          // console.log("\n this.margeHeaderArr    ============>>>>>>>>>>>>>>>     ", this.margeHeaderArr);
          this.submittedFormArr = data.where;
          for (let k = 0; k < this.submittedFormArr.length; k++) {
            if (this.submittedFormArr[k].field === 'mstorgnhirarchyid') {
              let str = this.submittedFormArr[k].val;
              let orgArr = str.split(',');
              this.orgSelected = orgArr;
            }
          }
          this.filterAddedPaginationData = this.submittedFormArr;
          for (let i = 0; i < this.gridHeaderNames.length; i++) {
            this.editedGridHeaderNames.push(this.gridHeaderNames[i]);
          }
          let deSelectedGridHeaders = [];
          // console.log("\n this.selectedGridColumns  ==================>>>>>>>>>>>>>>>>>>>   1111111111111111111111111111   ", this.selectedGridColumns);
          // console.log("\n this.editedGridHeaderNames  ==================>>>>>>>>>>>>>>>>>>>   22222222222222222222222222222   ", this.editedGridHeaderNames);
          for (let i = this.editedGridHeaderNames.length - 1; i >= 0; i--) {
            for (let j = 0; j < this.selectedGridColumns.length; j++) {
              // if (this.editedGridHeaderNames[i].field === this.selectedGridColumns[j].field) {
              //   if((this.editedGridHeaderNames[i].field === 'resosladuedatetime') || (this.editedGridHeaderNames[i].field === 'latestresodatetime')){
              //     if(duplicateHeaderCheck){
              //       for(let t = 0; t < duplicateHeaderCheck.length; t++){
              //         if(this.editedGridHeaderNames[i].id === Number(duplicateHeaderCheck[t])){
              //           this.editedGridHeaderNames.splice(i, 1);
              //           break;
              //         }
              //       }
              //     }
              //   } else {
              //     this.editedGridHeaderNames.splice(i, 1);
              //     break;
              //   }
              // }
              if (this.editedGridHeaderNames[i].id === this.selectedGridColumns[j].id) {
                this.editedGridHeaderNames.splice(i, 1);
                break;
              }
            }
          }
          // console.log("\n this.editedGridHeaderNames  ==================>>>>>>>>>>>>>>>>>>>   3333333333333333333333333333   ", this.editedGridHeaderNames);
          if(type === 'reset'){
            this.filterLoader = true;
            this.ticketTypeSelected = '';
            if(this.orgTypeId !== 2){
              this.orgSelected = [];
              this.orgSelected.push(this.orgId);
              this.onOrgChange(this.orgSelected, '');
            } else {
              this.orgSelected = [];
            }
          } else {
            let savedFilterConditions;
            for(let i=0;i<this.listOfFilters.length;i++){
              if(this.listOfFilters[i].id === Number(selectedID)){
                savedFilterConditions = this.listOfFilters[i].savedfilters;
              }
            }
            savedFilterConditions = JSON.parse(savedFilterConditions.substring(1, savedFilterConditions.length-1));
            // console.log("\n savedFilterConditions  ===========>>>>>>>>>>    ", savedFilterConditions);
  
            this.clientID = Number(savedFilterConditions.selectedclientandorg[0].val);
            this.orgSelected = JSON.parse("[" + savedFilterConditions.selectedclientandorg[1].val + "]");
            this.onOrgChange(this.orgSelected, 'cellClicked');
            if(savedFilterConditions.selectedclientandorg.length > 2){
              this.ticketTypeSelected = String(savedFilterConditions.selectedclientandorg[2].val);
              let savedFilters = savedFilterConditions.selectedfilters;
              // this.onTicketTypeChange(this.ticketTypeSelected, 'cellClicked');
            }
            this.frmGroupArr = savedFilterConditions.selectedfilters;
          }
        } else {
          this.filterLoader = true;
        }
      }
    } else {
      this.filterLoader = true;
    }
  }

  getlabelbydiffseq(type){
    this.dropDownArr1 = [
      // {'id': 0, 'value': 'Customer', 'field': 'levelonecatename'},
      {'id': 1, 'value': 'Ticket ID', 'field': 'ticketid'},
      {'id': 13, 'value': 'Status', 'field': 'status'},
      {'id': 11, 'value': 'Short Description', 'field': 'shortdescription'},
      {'id': 3, 'value': 'Requester Name', 'field': 'requestorname'},
      {'id': 2, 'value': 'Source', 'field': 'source'},
      {'id': 19, 'value': 'Created Since', 'field': 'createddatetime'},
      {'id': 7, 'value': 'Original Created By Name', 'field': 'orgcreatorname'},
      {'id': 4, 'value': 'Requester Location/Branch', 'field': 'requestorlocation'},
      {'id': 5, 'value': 'Requester Primary Contact (Phone/Mobile) Number', 'field': 'requestorphone'},
      {'id': 6, 'value': 'Requester Email ID', 'field': 'requestoremail'},
      {'id': 8, 'value': 'Original Created By Location', 'field': 'orgcreatorlocation'},
      {'id': 9, 'value': 'Original Created By Primary Contact (Phone/Mobile) Number', 'field': 'orgcreatorphone'},
      {'id': 10, 'value': 'Original Created By Email ID', 'field': 'orgcreatoremail'},
      {'id': 12, 'value': 'Priority', 'field': 'priority'},
      // {'id': 46, 'value': 'Ticket Type', 'field': 'tickettype'},
      {'id': 53, 'value': 'Vendor Name', 'field': 'vendorname'},
      {'id': 54, 'value': 'Vendor Ticket Id', 'field': 'vendorticketid'},
      {'id': 55, 'value': 'Resolution Code', 'field': 'resolutioncode'},
      {'id': 56, 'value': 'Resolution Comment', 'field': 'resolutioncomment'},
      {'id': 57, 'value': 'Last Update By', 'field': 'lastuser'},
      {'id': 58, 'value': 'Resolved Date Time', 'field': 'latestresodatetime'},
      // {'id': 59, 'value': 'Duration in Pending Vendor State (Minutes)', 'field': 'followuptimetaken'},
      // {'id': 159, 'value': 'Duration In Pending User State (Minutes)', 'field': 'userreplytimetaken'},
      {'id': 60, 'value': 'Pending Vendor Count', 'field': 'pendingvendorcount'},
      {'id': 49, 'value': 'Priority Change Count', 'field': 'prioritycount'},
      // {'id': 50, 'value': 'Total Response SLA Time (Minutes)', 'field': 'responsetime'},
      // {'id': 51, 'value': 'Total Resolution SLA Time (Minutes)', 'field': 'resotimeexcludeidletime'},
      {'id': 52, 'value': 'Pending User Count', 'field': 'pendingusercount'},
      {'id': 14, 'value': 'VIP Ticket (Yes/No)', 'field': 'vipticket'},
      {'id': 15, 'value': 'Assigned Group (Last assigned Resolver Group)', 'field': 'assignedgroup'},
      {'id': 16, 'value': 'Assigned User (Last assigned  user from the Resolver Group)', 'field': 'assigneduser'},
      {'id': 17, 'value': 'Resolved By Group (Last assigned Resolver Group who has resolved the ticket)', 'field': 'resogroup'},
      {'id': 18, 'value': 'Resolved By User (Last assigned  user from the Resolver Group who has resolved the ticket)', 'field': 'resolveduser'},
      {'id': 20, 'value': 'Last Modified Date Time', 'field': 'lastupdateddatetime'},
      {'id': 27, 'value': 'Urgency', 'field': 'urgency'},
      {'id': 28, 'value': 'Impact', 'field': 'impact'},
      {'id': 29, 'value': 'Due Date Time', 'field': 'resosladuedatetime'},
      {'id': 30, 'value': 'Response SLA Breached Status', 'field': 'respslabreachstatus'},
      {'id': 31, 'value': 'Resolution SLA Breached Status', 'field': 'resolslabreachstatus'},
      {'id': 75, 'value': 'Response SLA Breach Code', 'field': 'responsebreachcode'},
      {'id': 76, 'value': 'Resolution SLA Breach Code', 'field': 'resolutionbreachcode'},
      {'id': 77, 'value': 'Response SLA Breach Comment', 'field': 'responsebreachcomment'},
      {'id': 78, 'value': 'Resolution SLA Breach Comment', 'field': 'resolutionbreachcomment'},
      // {'id': 79, 'value': 'Response SLA Breach Date Time', 'field': 'respsladuedatetime'},
      // {'id': 80, 'value': 'Resolution SLA Breach Date Time', 'field': 'resosladuedatetime'},
      // {'id': 32, 'value': 'Response SLA Overdue (Minutes)', 'field': 'respoverduetime'},
      // {'id': 33, 'value': 'Resolution SLA Overdue (Minutes)', 'field': 'resooverduetime'},
      // {'id': 34, 'value': 'Aging in Days (Calendar days from created date)', 'field': 'calendaraging'},
      {'id': 35, 'value': 'Not Updated Since (Days)', 'field': 'worknotenotupdated'},
      {'id': 36, 'value': 'Reopen Count', 'field': 'reopencount'},
      {'id': 37, 'value': 'Reassignment Hop Count', 'field': 'reassigncount'},
      {'id': 38, 'value': 'Category Change Count', 'field': 'categorychangecount'},
      {'id': 39, 'value': 'User Follow Up', 'field': 'followupcount'},
      {'id': 40, 'value': 'Outbound Count', 'field': 'outboundcount'},
      // {'id': 41, 'value': 'IsParent (Yes/No)', 'field': 'isparent'},
      {'id': 42, 'value': 'Child Count (if parent)', 'field': 'childcount'},
      {'id': 43, 'value': 'Response Clock Status (Running/Stopped)', 'field': 'respclockstatus'},
      {'id': 44, 'value': 'Resolution Clock Status (Running/Stopped/Paused)', 'field': 'resoclockstatus'},
      {'id': 45, 'value': 'Response SLA Meter %', 'field': 'responseslameterpercentage'},
      {'id': 46, 'value': 'Resolution SLA Meter %', 'field': 'resolutionslameterpercentage'},
      // {'id': 47, 'value': 'Business Aging (HH:MM)', 'field': 'businessaging'},
      // {'id': 48, 'value': 'Actual Effort Spent (HH:MM)', 'field': 'actualeffort'},
      // {'id': 70, 'value': 'Total SLA Idle Time (Minutes)', 'field': 'slaidletime'},
      // {'id': 71, 'value': 'Response SLA Overdue %', 'field': 'respoverdueperc'},
      // {'id': 72, 'value': 'Resolution SLA Overdue %', 'field': 'resooverdueperc'},
      // {'id': 81, 'value': 'Response SLA End Date Time', 'field': 'firstresponsedatetime'},
      // {'id': 82, 'value': 'Resolution SLA End Date Time', 'field': 'latestresodatetime'},
      // {'id': 83, 'value': 'Response SLA Start Date Time', 'field': 'startdatetimeresponse'},
      // {'id': 84, 'value': 'Resolution SLA Start Date Time', 'field': 'startdatetimeresolution'},
      // {'id': 217, 'value': 'Status Reason', 'field': 'statusreason'},
      // {'id': 218, 'value': 'Customer Visible Comments', 'field': 'visiblecomments'},
      // {'id': 219, 'value': 'Parent Ticket', 'field': 'parentticket' }
    ];
  
    const data = {
      "clientid": this.clientId,
      "mstorgnhirarchyid": Number(this.orgSelected[0]),
      'fromrecorddifftypeid': this.TICKET_TYPE_ID,
      'fromrecorddiffid': this.typSelected,
      "seqno":0
    }
    this.filterLoader = false;
    this.rest.getlabelbydiffseq(data).subscribe((res: any) => {
      this.respObject = res.details;
      if (res.success) {
        this.respObject.sort((a, b) => {
          return a.seqno - b.seqno;
        });
        this.respObject.forEach((e) => {
          this.selectedGridColumns.push({
            'id': 100 + Number(e.id),
            'field': e.typename,
            'value': e.typename,
            'disabled': true
          });
          this.dropDownArr1.push({
            'id': 100 + Number(e.id),
            'field': e.typename,
            'value': e.typename
          });
        });
        // console.log("\n this.selectedGridColumns    333333333333333333333333333333        ==========================>>>>>>>>>>>>>>>>>>>      ", this.selectedGridColumns);
        if(type === 'cellClicked'){
          this.eventData = this.selectedGridColumns;
          // console.log("\n this.editedGridHeaderNames   ===============>>>>>>>>>>>>>>>>>>>>>>>>>     ", this.editedGridHeaderNames);
          // this.editedGridHeaderNames = this.gridHeaderNames.filter(entryValues1 => !this.selectedGridColumns.some(entryValues2 => entryValues1.field === entryValues2.field));
          this.categoryArray = [];
          for (let i = 0; i< this.frmGroupArr.length; i++) {
            if((this.frmGroupArr[i].dropDownSelected1 === 'Company') || (this.frmGroupArr[i].dropDownSelected1 === 'Service') || (this.frmGroupArr[i].dropDownSelected1 === 'Service Category') || (this.frmGroupArr[i].dropDownSelected1 === 'Service Sub Category') || (this.frmGroupArr[i].dropDownSelected1 === 'Service Description')){
              if(this.frmGroupArr[i].dropDownSelected1 === 'Company'){
                this.categoryArray.push({
                  'val': this.frmGroupArr[i].dropDownSelected3,
                  'type': 1
                });
              } else if(this.frmGroupArr[i].dropDownSelected1 === 'Service'){
                this.categoryArray.push({
                  'val': this.frmGroupArr[i].dropDownSelected3,
                  'type': 2
                });
              } else if(this.frmGroupArr[i].dropDownSelected1 === 'Service Category'){
                this.categoryArray.push({
                  'val': this.frmGroupArr[i].dropDownSelected3,
                  'type': 3
                });
              } else if(this.frmGroupArr[i].dropDownSelected1 === 'Service Sub Category'){
                this.categoryArray.push({
                  'val': this.frmGroupArr[i].dropDownSelected3,
                  'type': 4
                });
              } else if(this.frmGroupArr[i].dropDownSelected1 === 'Service Description'){
                this.categoryArray.push({
                  'val': this.frmGroupArr[i].dropDownSelected3,
                  'type': 5
                });
              }
            }
          }

          this.sortedCategoryArray = [];
          if(this.categoryArray.length > 1){
            this.categoryArray.sort((a, b) => {
              return a.type - b.type;
            });
            this.categoryArray.forEach((e) => {
              this.sortedCategoryArray.push({
                'val': e.val,
                'seq': e.type
              });
            });

          } else if(this.categoryArray.length === 1){
            this.sortedCategoryArray.push({
              'val': this.categoryArray[0].val,
              'seq': this.categoryArray[0].type
            });
          } 
          if(this.isEditFilterName){
            this.filteredName = "";
            this.filteredName = this.filteredNameUpdate;
            this.onFromRunFlag = true;
            this.modalReference = this.modalService.open(this.editFilterName, {});
            this.modalReference.result.then((result) => {
            }, (reason) => {
    
            });
          }
          let sortedArray = [];
          this.getqueryresult(this.submittedFormArr, sortedArray, this.sortedCategoryArray); 
        } else {
          this.eventData = this.selectedGridColumns;
          this.editedGridHeaderNames = this.gridHeaderNames.filter(entryValues1 => !this.selectedGridColumns.some(entryValues2 => entryValues1.field === entryValues2.field));
          this.getColumnDefintion();
        }
      } else {
        this.filterLoader = true;
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.filterLoader = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  deletedStarFilter(selectedID) {
    this.modalReference = this.modalService.open(this.deleteFilter, {});
    this.modalReference.result.then((result) => {
    }, (reason) => {

    });
    this.selectedDelID = selectedID;
  }

  deleteInfo() {
    this.dataLoaded = false;
    const data = {
      'id': this.selectedDelID
    };
    this.rest.recordfilterdelete(data).subscribe((res: any) => {
      if (res.success) {
        this.dataLoaded = true;
        this.countSelected = 2;
        this.starDisplayed = true;
        this.modalReference.close();
        this.notifier.notify('success', this.messageService.FILTER_DELETE);
        this.submittedFormArr = [];
        this.onFromRunFlag = false;
        if(this.listOfFilters.length > 1){
          if (this.listOfFilters[0].id === this.selectedDelID) {
            this.starStep = this.listOfFilters[1].id;
          } else {
            this.starStep = this.listOfFilters[0].id;
          }
          this.recordfilterlist(this.starStep, 'cellClicked');
        } else {
          this.starStep = undefined;
          this.filteredName = '';
          this.listOfFilters = [];
          this.dataset = [];
          this.totalData = 0;
          if(this.orgTypeId !== 2){
            this.orgSelected = [];
            this.orgSelected.push(this.orgId);
            this.onOrgChange(this.orgSelected, '');
          }
          this.onFormReset('reset');
          this.onHeaderReset('emptyFilter');
          this.getColumnDefintion();
          this.notifier.notify('error', 'Your favourite filter list is empty');
        }
      } else {
        this.dataLoaded = true;
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.dataLoaded = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });

  }

  onClickADD() {
    this.form = new form();
    this.frmGroupArr.push(this.form);
    this.frmGroupArr[this.frmGroupArr.length - 1].operatorSelected = 0;
    this.frmGroupArr[this.frmGroupArr.length - 1].isNumericConditionValue = false;
    this.frmGroupArr[this.frmGroupArr.length - 1].isConditionValueDropdown = false;
    this.frmGroupArr[this.frmGroupArr.length - 1].isConditionValueDropdownMultiSelect = false;
  }

  reemoveFormRow(index) {
    this.frmGroupArr.splice(index, 1);
  }

  onFormRun(type: any) {
    // console.log("\n 2222222222222222 ==========   ",this.isValidateFilterCondition);
    if(this.isValidateFilterCondition === true || this.isValidateFilterCategoryAndOperator === true) {
      this.notifier.notify('error', 'Field and condition not met');
    } else if(this.validationForCategoryDuplication === true){
      this.notifier.notify('error',  this.duplicateCategoryName + ' can be selected only once for query.');
    } else {
      // console.log("\n this.frmGroupArr ===================>>>>>>>>>>>>>>    ", this.frmGroupArr);
      this.submittedFormArr = [];
      this.categoryArray = [];
      this.selectedORarr = [];
      let selectedOrganizations;
      let match = false;
      let selectedORG;
      if (Number(this.orgTypeId) === 2) {
        selectedORG = this.orgSelected;
      } else {
        selectedORG = this.orgSelected;
      }
      if ((selectedORG === undefined) || (this.ticketTypeSelected === undefined) || (this.ticketTypeSelected === '')) {
        this.notifier.notify('error', this.messageService.SELECT_ORG);
      } else {
        selectedOrganizations = selectedORG.toString();
        if (selectedOrganizations === '') {
          this.notifier.notify('error', this.messageService.SELECT_ORG);
        } else {
          this.submittedFormArr.push(
            {
              'field': 'clientid',
              'op': '=',
              'val': String(this.clientId)
            },
            {
              'field': 'mstorgnhirarchyid',
              'op': 'in',
              'val': String(selectedOrganizations)
            },
            {
              'field': 'tickettype',
              'op': '=',
              'val': String(this.ticketTypeSelected)
            }
          );

          if ((this.frmGroupArr.length) === 1) {
            if (this.frmGroupArr[0].operatorSelected === 0) {
              if (this.frmGroupArr[0].dropDownSelected2 === 'between') {
                if((this.frmGroupArr[0].fromDateSelected2 === undefined) || (this.frmGroupArr[0].fromDateSelected2 === "") || (this.frmGroupArr[0].toDateSelected1 === undefined) || (this.frmGroupArr[0].toDateSelected1 === "")){
                  match = true;
                  this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
                  // break;
                } else {
                  this.submittedFormArr.push({
                    'field': this.frmGroupArr[0].dropDownSelected1,
                    'op': this.frmGroupArr[0].dropDownSelected2,
                    'val': String(this.messageService.dateConverter(this.frmGroupArr[0].fromDateSelected2,4)) + ',' + String(this.messageService.dateConverter(this.frmGroupArr[0].toDateSelected1,4))
                  });
                }
              } else {
                if((this.frmGroupArr[0].dropDownSelected1 === 'Company') || (this.frmGroupArr[0].dropDownSelected1 === 'Service') || (this.frmGroupArr[0].dropDownSelected1 === 'Service Category') || (this.frmGroupArr[0].dropDownSelected1 === 'Service Sub Category') || (this.frmGroupArr[0].dropDownSelected1 === 'Service Description')){
                  if(this.frmGroupArr[0].dropDownSelected1 === 'Company'){
                    this.categoryArray.push({
                      'val': this.frmGroupArr[0].dropDownSelected3,
                      'type': 1
                    });
                  } else if(this.frmGroupArr[0].dropDownSelected1 === 'Service'){
                    this.categoryArray.push({
                      'val': this.frmGroupArr[0].dropDownSelected3,
                      'type': 2
                    });
                  } else if(this.frmGroupArr[0].dropDownSelected1 === 'Service Category'){
                    this.categoryArray.push({
                      'val': this.frmGroupArr[0].dropDownSelected3,
                      'type': 3
                    });
                  } else if(this.frmGroupArr[0].dropDownSelected1 === 'Service Sub Category'){
                    this.categoryArray.push({
                      'val': this.frmGroupArr[0].dropDownSelected3,
                      'type': 4
                    });
                  } else if(this.frmGroupArr[0].dropDownSelected1 === 'Service Description'){
                    this.categoryArray.push({
                      'val': this.frmGroupArr[0].dropDownSelected3,
                      'type': 5
                    });
                  }
                } else {
                  if((this.frmGroupArr[0].isNumericConditionValue === false) && (this.frmGroupArr[0].isConditionValueDropdown === false) && (this.frmGroupArr[0].isConditionValueDropdownMultiSelect === false)){
                    this.submittedFormArr.push({
                      'field': this.frmGroupArr[0].dropDownSelected1,
                      'op': this.frmGroupArr[0].dropDownSelected2,
                      'val': this.frmGroupArr[0].dropDownSelected3
                    });
                  } else if((this.frmGroupArr[0].isNumericConditionValue === false) && (this.frmGroupArr[0].isConditionValueDropdown === true) && (this.frmGroupArr[0].isConditionValueDropdownMultiSelect === false)){
                    this.submittedFormArr.push({
                      'field': this.frmGroupArr[0].dropDownSelected1,
                      'op': this.frmGroupArr[0].dropDownSelected2,
                      'val': this.frmGroupArr[0].dropDownSelected5
                    });
                  } else if((this.frmGroupArr[0].isNumericConditionValue === false) && (this.frmGroupArr[0].isConditionValueDropdown === true) && (this.frmGroupArr[0].isConditionValueDropdownMultiSelect === true)){
                    this.submittedFormArr.push({
                      'field': this.frmGroupArr[0].dropDownSelected1,
                      'op': this.frmGroupArr[0].dropDownSelected2,
                      'val': this.frmGroupArr[0].dropDownSelected6.toString()
                    });
                  } else if((this.frmGroupArr[0].isNumericConditionValue === true) && (this.frmGroupArr[0].isConditionValueDropdown === false) && (this.frmGroupArr[0].isConditionValueDropdownMultiSelect === false)){
                    this.submittedFormArr.push({
                      'field': this.frmGroupArr[0].dropDownSelected1,
                      'op': this.frmGroupArr[0].dropDownSelected2,
                      'val': String(this.frmGroupArr[0].dropDownSelected4)
                    });
                  } else if((this.frmGroupArr[0].isNumericConditionValue === false) && (this.frmGroupArr[0].isConditionValueDropdown === false) && (this.frmGroupArr[0].isConditionValueDropdownMultiSelect === true)){
                    this.submittedFormArr.push({
                      'field': this.frmGroupArr[0].dropDownSelected1,
                      'op': this.frmGroupArr[0].dropDownSelected2,
                      'val': this.messageService.dateConverter(this.frmGroupArr[0].dateTimePicker,4)
                    });
                  }
                }
              }
            } else {
              match = true;
              this.notifier.notify('error', this.messageService.ADD_QUERY);
            }
          } else {
            for (let i = 0; i < this.frmGroupArr.length; i++) {
              if((this.frmGroupArr[i].dropDownSelected1 === 'Company') || (this.frmGroupArr[i].dropDownSelected1 === 'Service') || (this.frmGroupArr[i].dropDownSelected1 === 'Service Category') || (this.frmGroupArr[i].dropDownSelected1 === 'Service Sub Category') || (this.frmGroupArr[i].dropDownSelected1 === 'Service Description')){
                if(i === this.frmGroupArr.length - 1){
                  if(this.frmGroupArr[i].operatorSelected !== 0) {
                    match = true;
                    this.notifier.notify('error', this.messageService.ADD_QUERY);
                    break;
                  } else {
                    if(this.frmGroupArr[i].dropDownSelected1 === 'Company'){
                      this.categoryArray.push({
                        'val': this.frmGroupArr[i].dropDownSelected3,
                        'type': 1
                      });
                    } else if(this.frmGroupArr[i].dropDownSelected1 === 'Service'){
                      this.categoryArray.push({
                        'val': this.frmGroupArr[i].dropDownSelected3,
                        'type': 2
                      });
                    } else if(this.frmGroupArr[i].dropDownSelected1 === 'Service Category'){
                      this.categoryArray.push({
                        'val': this.frmGroupArr[i].dropDownSelected3,
                        'type': 3
                      });
                    } else if(this.frmGroupArr[i].dropDownSelected1 === 'Service Sub Category'){
                      this.categoryArray.push({
                        'val': this.frmGroupArr[i].dropDownSelected3,
                        'type': 4
                      });
                    } else if(this.frmGroupArr[i].dropDownSelected1 === 'Service Description'){
                      this.categoryArray.push({
                        'val': this.frmGroupArr[i].dropDownSelected3,
                        'type': 5
                      });
                    }
                  }
                } else {
                  if (Number(this.frmGroupArr[i].operatorSelected) === 2){
                    match = true;
                    this.notifier.notify('error', 'Categories are only valid for AND operator.');
                    break;
                  } else if (Number(this.frmGroupArr[i].operatorSelected) === 1){
                    if(this.frmGroupArr[i].dropDownSelected1 === 'Company'){
                      this.categoryArray.push({
                        'val': this.frmGroupArr[i].dropDownSelected3,
                        'type': 1
                      });
                    } else if(this.frmGroupArr[i].dropDownSelected1 === 'Service'){
                      this.categoryArray.push({
                        'val': this.frmGroupArr[i].dropDownSelected3,
                        'type': 2
                      });
                    } else if(this.frmGroupArr[i].dropDownSelected1 === 'Service Category'){
                      this.categoryArray.push({
                        'val': this.frmGroupArr[i].dropDownSelected3,
                        'type': 3
                      });
                    } else if(this.frmGroupArr[i].dropDownSelected1 === 'Service Sub Category'){
                      this.categoryArray.push({
                        'val': this.frmGroupArr[i].dropDownSelected3,
                        'type': 4
                      });
                    } else if(this.frmGroupArr[i].dropDownSelected1 === 'Service Description'){
                      this.categoryArray.push({
                        'val': this.frmGroupArr[i].dropDownSelected3,
                        'type': 5
                      });
                    }
                  }
                }
              } else {
                if(i === this.frmGroupArr.length - 1){
                  if(this.frmGroupArr[i].operatorSelected !== 0){
                    match = true;
                    this.notifier.notify('error', this.messageService.ADD_QUERY);
                    break;
                  } else {
                    // console.log("\n this.frmGroupArr[i - 1]  ------------>>>>>>>>>>>>>..      ", this.frmGroupArr[i - 1]);
                    if(this.frmGroupArr[i - 1].operatorSelected === 1){
                      if (this.frmGroupArr[i].dropDownSelected2 === 'between') {
                        if((this.frmGroupArr[i].fromDateSelected2 === undefined) || (this.frmGroupArr[i].fromDateSelected2 === "") || (this.frmGroupArr[i].toDateSelected1 === undefined) || (this.frmGroupArr[i].toDateSelected1 === "")){
                          match = true;
                          this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
                          break;
                        } else {
                          this.submittedFormArr.push({
                            'field': this.frmGroupArr[i].dropDownSelected1,
                            'op': this.frmGroupArr[i].dropDownSelected2,
                            'val': String(this.messageService.dateConverter(this.frmGroupArr[i].fromDateSelected2,4)) + ',' + String(this.messageService.dateConverter(this.frmGroupArr[i].toDateSelected1,4))
                          });
                        }
                      } else {
                        if((this.frmGroupArr[i].isNumericConditionValue === false) && (this.frmGroupArr[i].isConditionValueDropdown === false) && (this.frmGroupArr[i].isConditionValueDropdownMultiSelect === false)){
                          this.submittedFormArr.push({
                            'field': this.frmGroupArr[i].dropDownSelected1,
                            'op': this.frmGroupArr[i].dropDownSelected2,
                            'val': this.frmGroupArr[i].dropDownSelected3
                          });
                        } else if((this.frmGroupArr[i].isNumericConditionValue === false) && (this.frmGroupArr[i].isConditionValueDropdown === true) && (this.frmGroupArr[i].isConditionValueDropdownMultiSelect === false)){
                          this.submittedFormArr.push({
                            'field': this.frmGroupArr[i].dropDownSelected1,
                            'op': this.frmGroupArr[i].dropDownSelected2,
                            'val': this.frmGroupArr[i].dropDownSelected5
                          });
                        } else if((this.frmGroupArr[i].isNumericConditionValue === false) && (this.frmGroupArr[i].isConditionValueDropdown === true) && (this.frmGroupArr[i].isConditionValueDropdownMultiSelect === true)){
                          this.submittedFormArr.push({
                            'field': this.frmGroupArr[i].dropDownSelected1,
                            'op': this.frmGroupArr[i].dropDownSelected2,
                            'val': this.frmGroupArr[i].dropDownSelected6.toString()
                          });
                        } else if((this.frmGroupArr[i].isNumericConditionValue === true) && (this.frmGroupArr[i].isConditionValueDropdown === false) && (this.frmGroupArr[i].isConditionValueDropdownMultiSelect === false)){
                          this.submittedFormArr.push({
                            'field': this.frmGroupArr[i].dropDownSelected1,
                            'op': this.frmGroupArr[i].dropDownSelected2,
                            'val': String(this.frmGroupArr[i].dropDownSelected4)
                          });
                        } else if((this.frmGroupArr[i].isNumericConditionValue === false) && (this.frmGroupArr[i].isConditionValueDropdown === false) && (this.frmGroupArr[i].isConditionValueDropdownMultiSelect === true)){
                          this.submittedFormArr.push({
                            'field': this.frmGroupArr[i].dropDownSelected1,
                            'op': this.frmGroupArr[i].dropDownSelected2,
                            'val': this.messageService.dateConverter(this.frmGroupArr[i].dateTimePicker,4)
                          });
                        }
                      }
                    }
                  }
                } else {
                  // console.log("\n this.frmGroupArr[i]   -------------------    ", this.frmGroupArr[i], i);
                  if (Number(this.frmGroupArr[i].operatorSelected) === 2) {
                    if (this.frmGroupArr[i].dropDownSelected2 === 'between') {
                      if((this.frmGroupArr[i].fromDateSelected2 === undefined) || (this.frmGroupArr[i].fromDateSelected2 === "") || (this.frmGroupArr[i].toDateSelected1 === undefined) || (this.frmGroupArr[i].toDateSelected1 === "")){
                        match = true;
                        this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
                        break;
                      } else {
                        this.selectedORarr.push({
                          'field': this.frmGroupArr[i].dropDownSelected1,
                          'op': this.frmGroupArr[i].dropDownSelected2,
                          'val': String(this.messageService.dateConverter(this.frmGroupArr[i].fromDateSelected2,4)) + ',' + String(this.messageService.dateConverter(this.frmGroupArr[i].toDateSelected1,4))
                        });
                      }
                      if (this.frmGroupArr[i + 1]) {
                        let index = [];
                        for (var x in this.frmGroupArr[i + 1]) {
                           index.push(x);                                           // build the index
                        }
                        index.sort(function (a, b) {    
                           return a == b ? 0 : (a > b ? 1 : -1);                    // sort the index
                        });
                        if((this.frmGroupArr[i + 1].dropDownSelected1 === undefined) || (this.frmGroupArr[i + 1].dropDownSelected2 === undefined) || (this.frmGroupArr[i + 1][index[4]] === undefined)){
                          match = true;
                          this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
                          break;
                        } else {
                          if((this.frmGroupArr[i + 1].dropDownSelected1 === 'Company') || (this.frmGroupArr[i + 1].dropDownSelected1 === 'Service') || (this.frmGroupArr[i + 1].dropDownSelected1 === 'Service Category') || (this.frmGroupArr[i + 1].dropDownSelected1 === 'Service Sub Category') || (this.frmGroupArr[i + 1].dropDownSelected1 === 'Service Description')){
                            let newSelectedORQueryArray = new Map();
                            this.selectedORarr.forEach(function(item) {
                              newSelectedORQueryArray.set(JSON.stringify(item), item);
                            });
                            this.selectedFinalORQueryArray = [];
                            this.selectedFinalORQueryArray = [...newSelectedORQueryArray.values()];
    
                            if (this.selectedFinalORQueryArray.length > 0) {
                              this.submittedFormArr.push({
                                'op': 'or',
                                'field': '',
                                'val': this.selectedFinalORQueryArray
                              });
                            }
                            this.selectedORarr = [];
                          } else {
                            if (this.frmGroupArr[i + 1].dropDownSelected2 === 'between') {
                              if((this.frmGroupArr[i + 1].fromDateSelected2 === undefined) || (this.frmGroupArr[i + 1].fromDateSelected2 === "") || (this.frmGroupArr[i + 1].toDateSelected1 === undefined) || (this.frmGroupArr[i + 1].toDateSelected1 === "")){
                                match = true;
                                this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
                                break;
                              } else {
                                this.selectedORarr.push({
                                  'field': this.frmGroupArr[i + 1].dropDownSelected1,
                                  'op': this.frmGroupArr[i + 1].dropDownSelected2,
                                  'val': String(this.messageService.dateConverter(this.frmGroupArr[i + 1].fromDateSelected2,4)) + ',' + String(this.messageService.dateConverter(this.frmGroupArr[i + 1].toDateSelected1,4))
                                });
                              }
                            } else {
                              if((this.frmGroupArr[i + 1].isNumericConditionValue === false) && (this.frmGroupArr[i + 1].isConditionValueDropdown === false) && (this.frmGroupArr[i + 1].isConditionValueDropdownMultiSelect === false)){
                                this.selectedORarr.push({
                                  'field': this.frmGroupArr[i + 1].dropDownSelected1,
                                  'op': this.frmGroupArr[i + 1].dropDownSelected2,
                                  'val': this.frmGroupArr[i + 1].dropDownSelected3
                                });
                              } else if((this.frmGroupArr[i + 1].isNumericConditionValue === false) && (this.frmGroupArr[i + 1].isConditionValueDropdown === true) && (this.frmGroupArr[i + 1].isConditionValueDropdownMultiSelect === false)){
                                this.selectedORarr.push({
                                  'field': this.frmGroupArr[i + 1].dropDownSelected1,
                                  'op': this.frmGroupArr[i + 1].dropDownSelected2,
                                  'val': this.frmGroupArr[i + 1].dropDownSelected5
                                });
                              } else if((this.frmGroupArr[i + 1].isNumericConditionValue === false) && (this.frmGroupArr[i + 1].isConditionValueDropdown === true) && (this.frmGroupArr[i + 1].isConditionValueDropdownMultiSelect === true)){
                                this.selectedORarr.push({
                                  'field': this.frmGroupArr[i + 1].dropDownSelected1,
                                  'op': this.frmGroupArr[i + 1].dropDownSelected2,
                                  'val': this.frmGroupArr[i + 1].dropDownSelected6.toString()
                                });
                              } else if((this.frmGroupArr[i + 1].isNumericConditionValue === true) && (this.frmGroupArr[i + 1].isConditionValueDropdown === false) && (this.frmGroupArr[i + 1].isConditionValueDropdownMultiSelect === false)){
                                this.selectedORarr.push({
                                  'field': this.frmGroupArr[i + 1].dropDownSelected1,
                                  'op': this.frmGroupArr[i + 1].dropDownSelected2,
                                  'val': String(this.frmGroupArr[i + 1].dropDownSelected4)
                                });
                              } else if((this.frmGroupArr[i + 1].isNumericConditionValue === false) && (this.frmGroupArr[i + 1].isConditionValueDropdown === false) && (this.frmGroupArr[i + 1].isConditionValueDropdownMultiSelect === true)){
                                this.selectedORarr.push({
                                  'field': this.frmGroupArr[i + 1].dropDownSelected1,
                                  'op': this.frmGroupArr[i + 1].dropDownSelected2,
                                  'val': this.messageService.dateConverter(this.frmGroupArr[i + 1].dateTimePicker,4)
                                });
                              }
                            }
                          }
                          if(Number(this.frmGroupArr[i + 1].operatorSelected) === 1){
                            let newSelectedORQueryArray = new Map();
                            this.selectedORarr.forEach(function(item) {
                              newSelectedORQueryArray.set(JSON.stringify(item), item);
                            });
                            this.selectedFinalORQueryArray = [];
                            this.selectedFinalORQueryArray = [...newSelectedORQueryArray.values()];
    
                            if (this.selectedFinalORQueryArray.length > 0) {
                              this.submittedFormArr.push({
                                'op': 'or',
                                'field': '',
                                'val': this.selectedFinalORQueryArray
                              });
                            }
                            this.selectedORarr = [];
                            i = i + 1;
                          } else if(Number(this.frmGroupArr[i + 1].operatorSelected) === 0) {
                            if((i + 1) !== Number(this.frmGroupArr.length - 1)){
                              match = true;
                              this.notifier.notify('error', this.messageService.MISSING_OPERATOR);
                              break;
                            } else {
                              let newSelectedORQueryArray = new Map();
                              this.selectedORarr.forEach(function(item) {
                                newSelectedORQueryArray.set(JSON.stringify(item), item);
                              });
                              this.selectedFinalORQueryArray = [];
                              this.selectedFinalORQueryArray = [...newSelectedORQueryArray.values()];
      
                              if (this.selectedFinalORQueryArray.length > 0) {
                                this.submittedFormArr.push({
                                  'op': 'or',
                                  'field': '',
                                  'val': this.selectedFinalORQueryArray
                                });
                              }
                              this.selectedORarr = [];
                              i = i + 1;
                            }
                          }
                        }
                      }
                    } else {
                      if((this.frmGroupArr[i].isNumericConditionValue === false) && (this.frmGroupArr[i].isConditionValueDropdown === false) && (this.frmGroupArr[i].isConditionValueDropdownMultiSelect === false)){
                        this.selectedORarr.push({
                          'field': this.frmGroupArr[i].dropDownSelected1,
                          'op': this.frmGroupArr[i].dropDownSelected2,
                          'val': this.frmGroupArr[i].dropDownSelected3
                        });
                      } else if((this.frmGroupArr[i].isNumericConditionValue === false) && (this.frmGroupArr[i].isConditionValueDropdown === true) && (this.frmGroupArr[i].isConditionValueDropdownMultiSelect === false)){
                        this.selectedORarr.push({
                          'field': this.frmGroupArr[i].dropDownSelected1,
                          'op': this.frmGroupArr[i].dropDownSelected2,
                          'val': this.frmGroupArr[i].dropDownSelected5
                        });
                      } else if((this.frmGroupArr[i].isNumericConditionValue === false) && (this.frmGroupArr[i].isConditionValueDropdown === true) && (this.frmGroupArr[i].isConditionValueDropdownMultiSelect === true)){
                        this.selectedORarr.push({
                          'field': this.frmGroupArr[i].dropDownSelected1,
                          'op': this.frmGroupArr[i].dropDownSelected2,
                          'val': this.frmGroupArr[i].dropDownSelected6.toString()
                        });
                      } else if((this.frmGroupArr[i].isNumericConditionValue === true) && (this.frmGroupArr[i].isConditionValueDropdown === false) && (this.frmGroupArr[i].isConditionValueDropdownMultiSelect === false)){
                        this.selectedORarr.push({
                          'field': this.frmGroupArr[i].dropDownSelected1,
                          'op': this.frmGroupArr[i].dropDownSelected2,
                          'val': String(this.frmGroupArr[i].dropDownSelected4)
                        });
                      } else if((this.frmGroupArr[i].isNumericConditionValue === false) && (this.frmGroupArr[i].isConditionValueDropdown === false) && (this.frmGroupArr[i].isConditionValueDropdownMultiSelect === true)){
                        this.selectedORarr.push({
                          'field': this.frmGroupArr[i].dropDownSelected1,
                          'op': this.frmGroupArr[i].dropDownSelected2,
                          'val': this.messageService.dateConverter(this.frmGroupArr[i].dateTimePicker,4)
                        });
                      }
                      if (this.frmGroupArr[i + 1]) {
                        let index = [];
                        for (var x in this.frmGroupArr[i + 1]) {
                           index.push(x);                                           // build the index
                        }
                        index.sort(function (a, b) {    
                           return a == b ? 0 : (a > b ? 1 : -1);                    // sort the index
                        });
                        if((this.frmGroupArr[i + 1].dropDownSelected1 === undefined) || (this.frmGroupArr[i + 1].dropDownSelected2 === undefined) || (this.frmGroupArr[i + 1][index[4]] === undefined)){
                          match = true;
                          this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
                          break;
                        } else {
                          if((this.frmGroupArr[i + 1].dropDownSelected1 === 'Company') || (this.frmGroupArr[i + 1].dropDownSelected1 === 'Service') || (this.frmGroupArr[i + 1].dropDownSelected1 === 'Service Category') || (this.frmGroupArr[i + 1].dropDownSelected1 === 'Service Sub Category') || (this.frmGroupArr[i + 1].dropDownSelected1 === 'Service Description')){
                            let newSelectedORQueryArray = new Map();
                            this.selectedORarr.forEach(function(item) {
                              newSelectedORQueryArray.set(JSON.stringify(item), item);
                            });
                            this.selectedFinalORQueryArray = [];
                            this.selectedFinalORQueryArray = [...newSelectedORQueryArray.values()];
    
                            if (this.selectedFinalORQueryArray.length > 0) {
                              this.submittedFormArr.push({
                                'op': 'or',
                                'field': '',
                                'val': this.selectedFinalORQueryArray
                              });
                            }
                            this.selectedORarr = [];
                          } else {
                            if (this.frmGroupArr[i + 1].dropDownSelected2 === 'between') {
                              if((this.frmGroupArr[i + 1].fromDateSelected2 === undefined) || (this.frmGroupArr[i + 1].fromDateSelected2 === "") || (this.frmGroupArr[i + 1].toDateSelected1 === undefined) || (this.frmGroupArr[i + 1].toDateSelected1 === "")){
                                match = true;
                                this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
                                break;
                              } else {
                                this.selectedORarr.push({
                                  'field': this.frmGroupArr[i + 1].dropDownSelected1,
                                  'op': this.frmGroupArr[i + 1].dropDownSelected2,
                                  'val': String(this.messageService.dateConverter(this.frmGroupArr[i + 1].fromDateSelected2,4)) + ',' + String(this.messageService.dateConverter(this.frmGroupArr[i + 1].toDateSelected1,4))
                                });
                              }
                            } else {
                              if((this.frmGroupArr[i + 1].isNumericConditionValue === false) && (this.frmGroupArr[i + 1].isConditionValueDropdown === false) && (this.frmGroupArr[i + 1].isConditionValueDropdownMultiSelect === false)){
                                this.selectedORarr.push({
                                  'field': this.frmGroupArr[i + 1].dropDownSelected1,
                                  'op': this.frmGroupArr[i + 1].dropDownSelected2,
                                  'val': this.frmGroupArr[i + 1].dropDownSelected3
                                });
                              } else if((this.frmGroupArr[i + 1].isNumericConditionValue === false) && (this.frmGroupArr[i + 1].isConditionValueDropdown === true) && (this.frmGroupArr[i + 1].isConditionValueDropdownMultiSelect === false)){
                                this.selectedORarr.push({
                                  'field': this.frmGroupArr[i + 1].dropDownSelected1,
                                  'op': this.frmGroupArr[i + 1].dropDownSelected2,
                                  'val': this.frmGroupArr[i + 1].dropDownSelected5
                                });
                              } else if((this.frmGroupArr[i + 1].isNumericConditionValue === false) && (this.frmGroupArr[i + 1].isConditionValueDropdown === true) && (this.frmGroupArr[i + 1].isConditionValueDropdownMultiSelect === true)){
                                this.selectedORarr.push({
                                  'field': this.frmGroupArr[i + 1].dropDownSelected1,
                                  'op': this.frmGroupArr[i + 1].dropDownSelected2,
                                  'val': this.frmGroupArr[i + 1].dropDownSelected6.toString()
                                });
                              } else if((this.frmGroupArr[i + 1].isNumericConditionValue === true) && (this.frmGroupArr[i + 1].isConditionValueDropdown === false) && (this.frmGroupArr[i + 1].isConditionValueDropdownMultiSelect === false)){
                                this.selectedORarr.push({
                                  'field': this.frmGroupArr[i + 1].dropDownSelected1,
                                  'op': this.frmGroupArr[i + 1].dropDownSelected2,
                                  'val': String(this.frmGroupArr[i + 1].dropDownSelected4)
                                });
                              } else if((this.frmGroupArr[i + 1].isNumericConditionValue === false) && (this.frmGroupArr[i + 1].isConditionValueDropdown === false) && (this.frmGroupArr[i + 1].isConditionValueDropdownMultiSelect === true)){
                                this.selectedORarr.push({
                                  'field': this.frmGroupArr[i + 1].dropDownSelected1,
                                  'op': this.frmGroupArr[i + 1].dropDownSelected2,
                                  'val': this.messageService.dateConverter(this.frmGroupArr[i + 1].dateTimePicker,4)
                                });
                              }
                            }
                            if(Number(this.frmGroupArr[i + 1].operatorSelected) === 1){
                              let newSelectedORQueryArray = new Map();
                              this.selectedORarr.forEach(function(item) {
                                newSelectedORQueryArray.set(JSON.stringify(item), item);
                              });
                              this.selectedFinalORQueryArray = [];
                              this.selectedFinalORQueryArray = [...newSelectedORQueryArray.values()];
        
                              if (this.selectedFinalORQueryArray.length > 0) {
                                this.submittedFormArr.push({
                                  'op': 'or',
                                  'field': '',
                                  'val': this.selectedFinalORQueryArray
                                });
                              }
                              this.selectedORarr = [];
                              i = i + 1;
                            } else if(Number(this.frmGroupArr[i + 1].operatorSelected) === 0) {
                              if((i + 1) !== Number(this.frmGroupArr.length - 1)){
                                match = true;
                                this.notifier.notify('error', this.messageService.MISSING_OPERATOR);
                                break;
                              } else {
                                let newSelectedORQueryArray = new Map();
                                this.selectedORarr.forEach(function(item) {
                                  newSelectedORQueryArray.set(JSON.stringify(item), item);
                                });
                                this.selectedFinalORQueryArray = [];
                                this.selectedFinalORQueryArray = [...newSelectedORQueryArray.values()];
        
                                if (this.selectedFinalORQueryArray.length > 0) {
                                  this.submittedFormArr.push({
                                    'op': 'or',
                                    'field': '',
                                    'val': this.selectedFinalORQueryArray
                                  });
                                }
                                this.selectedORarr = [];
                                i = i + 1;
                              }
                            }
                          }
                        }
                      }
                    }
                  } else if (Number(this.frmGroupArr[i].operatorSelected) === 1) {
                    if (this.frmGroupArr[i].dropDownSelected2 === 'between') {
                      if((this.frmGroupArr[i].fromDateSelected2 === undefined) || (this.frmGroupArr[i].fromDateSelected2 === "") || (this.frmGroupArr[i].toDateSelected1 === undefined) || (this.frmGroupArr[i].toDateSelected1 === "")){
                        match = true;
                        this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
                        break;
                      } else {
                        this.submittedFormArr.push({
                          'field': this.frmGroupArr[i].dropDownSelected1,
                          'op': this.frmGroupArr[i].dropDownSelected2,
                          'val': String(this.messageService.dateConverter(this.frmGroupArr[i].fromDateSelected2,4)) + ',' + String(this.messageService.dateConverter(this.frmGroupArr[i].toDateSelected1,4))
                        });
                      }
                    } else {
                      if((this.frmGroupArr[i].isNumericConditionValue === false) && (this.frmGroupArr[i].isConditionValueDropdown === false) && (this.frmGroupArr[i].isConditionValueDropdownMultiSelect === false)){
                        this.submittedFormArr.push({
                          'field': this.frmGroupArr[i].dropDownSelected1,
                          'op': this.frmGroupArr[i].dropDownSelected2,
                          'val': this.frmGroupArr[i].dropDownSelected3
                        });
                      } else if((this.frmGroupArr[i].isNumericConditionValue === false) && (this.frmGroupArr[i].isConditionValueDropdown === true) && (this.frmGroupArr[i].isConditionValueDropdownMultiSelect === false)){
                        this.submittedFormArr.push({
                          'field': this.frmGroupArr[i].dropDownSelected1,
                          'op': this.frmGroupArr[i].dropDownSelected2,
                          'val': this.frmGroupArr[i].dropDownSelected5
                        });
                      } else if((this.frmGroupArr[i].isNumericConditionValue === false) && (this.frmGroupArr[i].isConditionValueDropdown === true) && (this.frmGroupArr[i].isConditionValueDropdownMultiSelect === true)){
                        this.submittedFormArr.push({
                          'field': this.frmGroupArr[i].dropDownSelected1,
                          'op': this.frmGroupArr[i].dropDownSelected2,
                          'val': this.frmGroupArr[i].dropDownSelected6.toString()
                        });
                      } else if((this.frmGroupArr[i].isNumericConditionValue === true) && (this.frmGroupArr[i].isConditionValueDropdown === false) && (this.frmGroupArr[i].isConditionValueDropdownMultiSelect === false)){
                        this.submittedFormArr.push({
                          'field': this.frmGroupArr[i].dropDownSelected1,
                          'op': this.frmGroupArr[i].dropDownSelected2,
                          'val': String(this.frmGroupArr[i].dropDownSelected4)
                        });
                      } else if((this.frmGroupArr[i].isNumericConditionValue === false) && (this.frmGroupArr[i].isConditionValueDropdown === false) && (this.frmGroupArr[i].isConditionValueDropdownMultiSelect === true)){
                        this.submittedFormArr.push({
                          'field': this.frmGroupArr[i].dropDownSelected1,
                          'op': this.frmGroupArr[i].dropDownSelected2,
                          'val': this.messageService.dateConverter(this.frmGroupArr[i].dateTimePicker,4)
                        });
                      }
                    }
                  } else if(Number(this.frmGroupArr[i].operatorSelected === 0)) {
                    if(i === this.frmGroupArr.length - 1){
                      match = false;
                    } else {
                      match = true;
                      this.notifier.notify('error', this.messageService.MISSING_OPERATOR);
                      break;
                    }
                  }
                }
              }
            }
          }
          for (let i = 2; i < this.submittedFormArr.length; i++) {
            if ((this.submittedFormArr[i].field === undefined) || (this.submittedFormArr[i].op === undefined) || (this.submittedFormArr[i].val === undefined) || (this.submittedFormArr[i].val === "")) {
              match = true;
              this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
              break;
            }
          }
          this.sortedCategoryArray = [];
          if(this.categoryArray.length > 1){
            this.categoryArray.sort((a, b) => {
              return a.type - b.type;
            });
            this.categoryArray.forEach((e) => {
              this.sortedCategoryArray.push({
                'val': e.val,
                'seq': e.type
              });
            });

          } else if(this.categoryArray.length === 1){
            this.sortedCategoryArray.push({
              'val': this.categoryArray[0].val,
              'seq': this.categoryArray[0].type
            });
          }
          if(this.sortedCategoryArray.length > 0){
            for (let p = 0; p < this.sortedCategoryArray.length; p++) {
              if ((this.sortedCategoryArray[p].val === undefined) || (this.sortedCategoryArray[p].val === "")) {
                match = true;
                this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
                break;
              }
            }
          }
          if(match === false) {
            // console.log("\n SUBMITTED ARRAY   ---------------------------->>>>>>>>>>>>>>>>>>>>>>>>     \n ", this.submittedFormArr);
            // console.log("\n CATEGORY ARRAY    --------------------->>>>>>>>>>>>>>>>>>>>>>>>>      ", this.sortedCategoryArray);
            if(type === 'run') {
              let sortedArray = [];
              this.onFromRunFlag = true;
              this.getqueryresult(this.submittedFormArr, sortedArray, this.sortedCategoryArray);
            } else if(type === 'saveas') {
              this.onFromRunFlag = true;
              this.modalReference = this.modalService.open(this.savedFilterName, {});
              this.modalReference.result.then((result) => {
              }, (reason) => {

              });
            } else if(type === 'update') {
              if(this.starStep === undefined){
                this.onFromRunFlag = true;
                this.modalReference = this.modalService.open(this.savedFilterName, {});
                this.modalReference.result.then((result) => {
                }, (reason) => {
  
                });
              } else {
                this.onFromRunFlag = true;
                this.modalReference = this.modalService.open(this.updateFilter, {});
                this.modalReference.result.then((result) => {
                }, (reason) => {
  
                });
              }
            } else if(type === 'generateReport') {
              this.onFromRunFlag = true;
              this.modalReference = this.modalService.open(this.generateReportFilter, {});
              this.modalReference.result.then((result) => {
              }, (reason) => {

              });
            }
          }
        }
      }
    }
  }


  getqueryresult(searchedData, sortedData, searchedCategoryArray) {
    // console.log("\n searchedData   ---------------------     ", searchedData);
    // console.log("\n searchedCategoryArray   ------------------      ", searchedCategoryArray);
    let offset;
    if (this.pageSizes === undefined) {
      offset = 0;
    } else {
      offset = this.pageSizes;
    }
    const paginationType = undefined;

    const index = this.margeHeaderArr.indexOf('Company', 0);
    if (index > -1) {
      this.margeHeaderArr.splice(index, 1);
    }
    const index3 = this.margeHeaderArr.indexOf('Service', 0);
    if (index3 > -1) {
      this.margeHeaderArr.splice(index3, 1);
    }
    const index1 = this.margeHeaderArr.indexOf('Service Category', 0);
    if (index1 > -1) {
      this.margeHeaderArr.splice(index1, 1);
    }
    const index2 = this.margeHeaderArr.indexOf('Service Sub Category', 0);
    if (index2 > -1) {
      this.margeHeaderArr.splice(index2, 1);
    }
    const index4 = this.margeHeaderArr.indexOf('Service Description', 0);
    if (index4 > -1) {
      this.margeHeaderArr.splice(index4, 1);
    }
    const index5 = this.margeHeaderArr.indexOf('statusreason', 0);
    if (index5 > -1) {
      this.margeHeaderArr.splice(index5, 1);
    }
    const index6 = this.margeHeaderArr.indexOf('visiblecomments', 0);
    if (index6 > -1) {
      this.margeHeaderArr.splice(index6, 1);
    }
    const index7 = this.margeHeaderArr.indexOf('parentticket', 0);
    if (index7 > -1) {
      this.margeHeaderArr.splice(index7, 1);
    }

    const index8 = this.margeHeaderArr.indexOf('startdatetimeresponse', 0);
    if (index8 > -1) {
      this.margeHeaderArr.splice(index8, 1);
    }
    const index9 = this.margeHeaderArr.indexOf('startdatetimeresolution', 0);
    if (index9 > -1) {
      this.margeHeaderArr.splice(index9, 1);
    }


    let statusReasonArray = [];
    let visiblecommentsArray = [];

    const data = {
      'where': searchedData,
      'order': this.gridSortedArray,
      'headers': this.margeHeaderArr,
      'cat': searchedCategoryArray,
      'limit': this.itemsPerPage,
      'offset': offset
    };
    // if (this.isDisplayFlag === false) {
    //   data['order'] = this.gridSortedArray;
    // }
    this.dataLoaded = false;
    this.rest.getqueryresult(data).subscribe((res: any) => {
      if (res.success) {
        // console.log("\n this.selectedGridColumns  22222222222222222222222222222 ===========>>>>>>>>>>>>>>>>>>>>>>>     ", this.selectedGridColumns);
        // this.dataLoaded = true
        if (this.isDisplayFlag === true) {
          this.displayTicket(res, offset, paginationType);
        } else {
          this.respObject = res.details;
          const data1 = res.details.result;
          if(data1.length > 0){
            this.categoriesLength = data1[0].categories.length;
            for(let i=0;i<data1.length;i++){
              for(let j=0;j<data1[i].categories.length;j++){ 
                data1[i][data1[i].categories[j].lable] = data1[i].categories[j].name;
              }
              delete data1[i].categories;
            }
          
            for(let i=0;i<data1.length;i++){
              if(data1[i].statusreson.length > 0){
                for(let j=0;j<data1[i].statusreson.length;j++){
                  statusReasonArray.push(data1[i].statusreson[j].termname + ' : ' + data1[i].statusreson[j].recordtrackvalue);
                }

                data1[i]['statusreason'] = statusReasonArray.toString();
              }
              delete data1[i].statusreson;
            }
          
            for(let i=0;i<data1.length;i++){
              if(data1[i].visiblecomment.length > 0){
                for(let j=0;j<data1[i].visiblecomment.length;j++){
                  visiblecommentsArray.push(data1[i].visiblecomment[j].Comment + ' : ' + data1[i].visiblecomment[j].Createdate);
                }

                data1[i]['visiblecomments'] = visiblecommentsArray.toString();
              }
              delete data1[i].visiblecomment;
            }

          }
          this.totalData = res.details.total;
          this.dataset = data1;
        }
        this.getColumnDefintion();
      } else {
        this.dataLoaded = true;
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.dataLoaded = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });

  }

  saveInfo() {
    this.dataLoaded = false;
    let offset;
    if (this.pageSizes === undefined) {
      offset = 0;
    } else {
      offset = this.pageSizes;
    }
    let selectedClirntandOrg = [];
    for(let i=0;i<3;i++){
      selectedClirntandOrg.push(this.submittedFormArr[i]);
    }
    let storeFiltersAndClientOrg = {'selectedclientandorg': selectedClirntandOrg, 'selectedfilters': this.frmGroupArr};
    let savedFilters= "'"+JSON.stringify(storeFiltersAndClientOrg)+"'";
    // console.log("\n savedFilters in String   ============>>>>>>>>>   ", savedFilters);

    const index = this.margeHeaderArr.indexOf('Company', 0);
    if (index > -1) {
      this.margeHeaderArr.splice(index, 1);
    }
    const index3 = this.margeHeaderArr.indexOf('Service', 0);
    if (index3 > -1) {
      this.margeHeaderArr.splice(index3, 1);
    }
    const index1 = this.margeHeaderArr.indexOf('Service Category', 0);
    if (index1 > -1) {
      this.margeHeaderArr.splice(index1, 1);
    }
    const index2 = this.margeHeaderArr.indexOf('Service Sub Category', 0);
    if (index2 > -1) {
      this.margeHeaderArr.splice(index2, 1);
    }
    const index4 = this.margeHeaderArr.indexOf('Service Description', 0);
    if (index4 > -1) {
      this.margeHeaderArr.splice(index4, 1);
    }
    const index5 = this.margeHeaderArr.indexOf('statusreason', 0);
    if (index5 > -1) {
      this.margeHeaderArr.splice(index5, 1);
    }
    const index6 = this.margeHeaderArr.indexOf('visiblecomments', 0);
    if (index6 > -1) {
      this.margeHeaderArr.splice(index6, 1);
    }
    const index7 = this.margeHeaderArr.indexOf('parentticket', 0);
    if (index7 > -1) {
      this.margeHeaderArr.splice(index7, 1);
    }

    const index8 = this.margeHeaderArr.indexOf('startdatetimeresponse', 0);
    if (index8 > -1) {
      this.margeHeaderArr.splice(index8, 1);
    }
    const index9 = this.margeHeaderArr.indexOf('startdatetimeresolution', 0);
    if (index9 > -1) {
      this.margeHeaderArr.splice(index9, 1);
    }

    let sortedArray = [];
    const data = {
      'name': this.filteredName,
      'filter': {
        'clientid': this.clientId,
        'mstorgnhirarchyid': this.orgId,
        'tickettype': this.ticketTypeSelected,
        'recorddiffid': this.typSelected,
        'menuid': this.folderClicked,
        'querytype': 2,
        'supportgrpid': this.userGroupId,
        'where': this.submittedFormArr,
        'cat': this.sortedCategoryArray,
        'headers': this.margeHeaderArr,
        'duplicateChecker': this.duplicateFieldChecker,
        'offset': offset,
        'limit': this.itemsPerPage
      },
      'savedfilters': savedFilters,
    };
    this.rest.recordfilteradd(data).subscribe((res: any) => {
      if (res.success) {
        this.dataLoaded = true;
        this.filteredName = '';
        this.countSelected = 2;
        this.starDisplayed = true;
        this.recordfilterlist(this.starStep, 'cellClicked');
        this.modalReference.close();
        this.notifier.notify('success', this.messageService.FILTER_SAVED);
      } else {
        this.dataLoaded = true;
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.dataLoaded = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  updateInfo() {
    this.dataLoaded = false;
    let offset;
    if (this.pageSizes === undefined) {
      offset = 0;
    } else {
      offset = this.pageSizes;
    }
    let selectedClirntandOrg = [];
    for(let i=0;i<3;i++){
      selectedClirntandOrg.push(this.submittedFormArr[i]);
    }
    let storeFiltersAndClientOrg = {'selectedclientandorg': selectedClirntandOrg, 'selectedfilters': this.frmGroupArr};
    let savedFilters= "'"+JSON.stringify(storeFiltersAndClientOrg)+"'";
    // console.log("\n savedFilters in String   ============>>>>>>>>>   ", savedFilters);

    const index = this.margeHeaderArr.indexOf('Company', 0);
    if (index > -1) {
      this.margeHeaderArr.splice(index, 1);
    }
    const index3 = this.margeHeaderArr.indexOf('Service', 0);
    if (index3 > -1) {
      this.margeHeaderArr.splice(index3, 1);
    }
    const index1 = this.margeHeaderArr.indexOf('Service Category', 0);
    if (index1 > -1) {
      this.margeHeaderArr.splice(index1, 1);
    }
    const index2 = this.margeHeaderArr.indexOf('Service Sub Category', 0);
    if (index2 > -1) {
      this.margeHeaderArr.splice(index2, 1);
    }
    const index4 = this.margeHeaderArr.indexOf('Service Description', 0);
    if (index4 > -1) {
      this.margeHeaderArr.splice(index4, 1);
    }
    const index5 = this.margeHeaderArr.indexOf('statusreason', 0);
    if (index5 > -1) {
      this.margeHeaderArr.splice(index5, 1);
    }
    const index6 = this.margeHeaderArr.indexOf('visiblecomments', 0);
    if (index6 > -1) {
      this.margeHeaderArr.splice(index6, 1);
    }
    const index7 = this.margeHeaderArr.indexOf('parentticket', 0);
    if (index7 > -1) {
      this.margeHeaderArr.splice(index7, 1);
    }

    const index8 = this.margeHeaderArr.indexOf('startdatetimeresponse', 0);
    if (index8 > -1) {
      this.margeHeaderArr.splice(index8, 1);
    }
    const index9 = this.margeHeaderArr.indexOf('startdatetimeresolution', 0);
    if (index9 > -1) {
      this.margeHeaderArr.splice(index9, 1);
    }

    let sortedArray = [];
    const data = {
      'id': Number(this.starStep),
      'name': this.filteredNameUpdate,
      'filter': {
        'clientid': this.clientId,
        'mstorgnhirarchyid': this.orgId,
        'tickettype': this.ticketTypeSelected,
        'recorddiffid': this.typSelected,
        'menuid': this.folderClicked,
        'querytype': 2,
        'supportgrpid': this.userGroupId,
        'where': this.submittedFormArr,
        'cat': this.sortedCategoryArray,
        'headers': this.margeHeaderArr,
        'duplicateChecker': this.duplicateFieldChecker,
        'offset': offset,
        'limit': this.itemsPerPage
      },
      'savedfilters': savedFilters,
    };
    this.rest.recordfilterupdate(data).subscribe((res: any) => {
      if (res.success) {
        this.countSelected = 2;
        this.starDisplayed = true;
        this.recordfilterlist(this.starStep, 'cellClicked');
        this.modalReference.close();
        this.notifier.notify('success', this.messageService.FILTER_SAVED);
      } else {
        this.dataLoaded = true;
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.dataLoaded = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });


  }


  closeinfo() {
    this.filteredName = '';
    this.infoRef.close();
  }

  closeinfo2() {
    this.delRef.close();
  }

  getCustomApiCall(odataQuery) {
    // console.log("\n odataQuery   ----------------------------->>>>>>>>>>>>>>>>>>>    ", odataQuery);
    this.filterAddedPaginationData = [];
    this.concatFilterAndSearchArray = [];
    this.sreachedCategoryArray = [];
    this.gridSortedArray = [];
    if(this.totalData > 0){
      if (odataQuery.includes('$top=25&$orderby=')) {
        let newStr = odataQuery.split('$top=25&$orderby=').pop();
        if (newStr.includes('&$filter=')) {
          let index1 = newStr.indexOf('&$filter=');
          let sorted = newStr.slice(0, index1);
          let index2 = newStr.indexOf('(substringof(\'');
          let searched = newStr.slice(index2, newStr.length);
          let newSearched = searched.replace('(substringof', '');
          let newSearched2 = newSearched.replace(/and substringof/g, '');
          this.sortedCallFunction(sorted, newSearched2);
        } else {
          let sortArr1 = [];
          let Array1 = [];
          let jsonSortedArray = [];
          let searchedData = [];
          if((this.onFromRunFlag === false) && (this.submittedFormArr.length > 0)){
            for (let i = 0; i < this.submittedFormArr.length; i++) {
              searchedData.push(this.submittedFormArr[i]);
            }
          }
          sortArr1 = newStr.split(',');
          for (let i = 0; i < sortArr1.length; i++) {
            Array1[i] = sortArr1[i].split(' ');
            jsonSortedArray.push({
              'field': String(Array1[i][0]).replace('%20', ' ').toLowerCase(),
              'dir': String(Array1[i][1]).toUpperCase()
            });
          }
          this.gridSortedArray = jsonSortedArray;
          // console.log("\n this.gridSortedArray   ========     ", this.gridSortedArray);
          if (this.onFromRunFlag === false) {
            if ((this.step !== undefined) && (this.starStep === undefined)) {
              // this.recordgridresult(searchedData, jsonSortedArray);
            } else if ((this.step === undefined) && (this.starStep !== undefined)) {
              this.filterAddedPaginationData = searchedData;
              this.getqueryresult(searchedData, jsonSortedArray, this.sortedCategoryArray);
            }
          } else {
            this.concatFilterAndSearchArray = this.submittedFormArr.concat(searchedData);
            this.getqueryresult(this.concatFilterAndSearchArray, jsonSortedArray, this.sortedCategoryArray);
          }
  
        }
      } else if (odataQuery === '$top=25') {
        if (this.clientId !== undefined && this.orgId !== undefined && this.typSelected !== undefined) {
          let searchedData = [];
          let sortedData = [];
          if((this.onFromRunFlag === false) && (this.submittedFormArr.length > 0)){
            for (let i = 0; i < this.submittedFormArr.length; i++) {
              searchedData.push(this.submittedFormArr[i]);
            }
          }
          if (this.onFromRunFlag === false) {
            if ((this.step !== undefined) && (this.starStep === undefined)) {
              // this.recordgridresult(searchedData, sortedData);
            } else if ((this.step === undefined) && (this.starStep !== undefined)) {
              this.filterAddedPaginationData = searchedData;
              this.getqueryresult(searchedData, sortedData, this.sortedCategoryArray);
            }
          } else {
            this.concatFilterAndSearchArray = this.submittedFormArr.concat(searchedData);
            this.getqueryresult(this.concatFilterAndSearchArray, sortedData, this.sortedCategoryArray);
          }
        }
      } else {
        let newStr = odataQuery.split('$top=25&$filter=(substringof').pop();
        let newString = newStr.slice(0, -1);
        let newSubString = newString.replace(/and substringof/g, '');
        this.callFunction(newSubString);
      }
    }
    return null;
  }

  callFunction(string) {
    let str1 = string.slice(0, -1);
    let str2 = str1.slice(1);

    let Arr = [];
    let Array2 = [];
    let Array3 = [];
    let dataArray = [];
    let catArray = [];
    let finalCategoryArray = [];
    let sortedCategoryArrayForSearch = [];
    if((this.onFromRunFlag === false) && (this.submittedFormArr.length > 0)){
      for (let i = 0; i < this.submittedFormArr.length; i++) {
        dataArray.push(this.submittedFormArr[i]);
      }
    }
    if(this.sortedCategoryArray.length > 0){
      for (let j = 0; j < this.sortedCategoryArray.length; j++) {
        finalCategoryArray.push(this.sortedCategoryArray[j]);
      }
    }
    Arr = str2.split(') (');
    for (let i = 0; i < Arr.length; i++) {
      Array2[i] = Arr[i].split(', ');
      Array2[i][0] = Array2[i][0].replace(/%20/g, ' ').replace(/%3A/g, ':');
      // console.log("\n Array2 ====  ", Array2[i]);
      if((String(Array2[i][1]).replace('%20', ' ') === 'Company') || (String(Array2[i][1]).replace('%20', ' ') === 'Service') || (String(Array2[i][1]).replace('%20', ' ') === 'Service Category') || (String(Array2[i][1]).replace('%20', ' ') === 'Service Sub Category') || (String(Array2[i][1]).replace('%20', ' ') === 'Service Description')){
        if(String(Array2[i][1]).replace('%20', ' ') === 'Company'){
          catArray.push({
            'val': Array2[i][0].replace(/'/g, ''),
            'type': 1
          });
        } else if(String(Array2[i][1]).replace('%20', ' ') === 'Service'){
          catArray.push({
            'val': Array2[i][0].replace(/'/g, ''),
            'type': 2
          });
        } else if(String(Array2[i][1]).replace('%20', ' ') === 'Service Category'){
          catArray.push({
            'val': Array2[i][0].replace(/'/g, ''),
            'type': 3
          });
        } else if(String(Array2[i][1]).replace('%20', ' ') === 'Service Sub Category'){
          catArray.push({
            'val': Array2[i][0].replace(/'/g, ''),
            'type': 4
          });
        } else if(String(Array2[i][1]).replace('%20', ' ') === 'Service Description'){
          catArray.push({
            'val': Array2[i][0].replace(/'/g, ''),
            'type': 5
          });
        }
      } else {
        if((String(Array2[i][1]).replace('%20', ' ') === 'parentticket') || (String(Array2[i][1]).replace('%20', ' ') === 'Startdatetimeresponse') || (String(Array2[i][1]).replace('%20', ' ') === 'Startdatetimeresolution') || (String(Array2[i][1]).replace('%20', ' ') === 'Statusreason') || (String(Array2[i][1]).replace('%20', ' ') === 'Visiblecomments')){
          
        } else {
          dataArray.push({
            'field': String(Array2[i][1]).replace('%20', ' ').toLowerCase(),
            'op': 'like',
            'val': Array2[i][0].replace(/'/g, '')
          });
        }
      }
    }
    if(catArray.length > 0){
      for(let p = catArray.length - 1; p >= 0; p--){
        if(finalCategoryArray.length > 0){
          for(let q=0; q<finalCategoryArray.length; q++){
            if(finalCategoryArray[q].seq === catArray[p].type){
              finalCategoryArray.splice(q, 1);
              finalCategoryArray.push({
                'val': catArray[p].val,
                'seq': catArray[p].type
              });
              break;
            } else {
              finalCategoryArray.push({
                'val': catArray[p].val,
                'seq': catArray[p].type
              });
              break;
            }
          }
        } else {
          finalCategoryArray.push({
            'val': catArray[p].val,
            'seq': catArray[p].type
          });
        }
      }
    }
    if(finalCategoryArray.length > 0){
      if(finalCategoryArray.length > 1){
        finalCategoryArray.sort((a, b) => {
          return a.seq - b.seq;
        });
        finalCategoryArray.forEach((e) => {
          sortedCategoryArrayForSearch.push({
            'val': e.val,
            'seq': e.seq
          });
        });
  
      } else if(finalCategoryArray.length === 1){
        sortedCategoryArrayForSearch.push({
          'val': finalCategoryArray[0].val,
          'seq': finalCategoryArray[0].seq
        });
      }
    }

    let flag = false;
    for (let i = 0; i < Arr.length; i++) {
      if((String(Array2[i][1]).replace('%20', ' ') === 'parentticket') || (String(Array2[i][1]).replace('%20', ' ') === 'Startdatetimeresponse') || (String(Array2[i][1]).replace('%20', ' ') === 'Startdatetimeresolution') || (String(Array2[i][1]).replace('%20', ' ') === 'Statusreason')){
        flag = true;
        break;
      } else {
        flag = false;
      }
    }

    if(flag === false){
      let sortedData = [];
      this.sreachedCategoryArray = sortedCategoryArrayForSearch;
      if (this.onFromRunFlag === false) {
        if ((this.step !== undefined) && (this.starStep === undefined)) {
          // this.recordgridresult(dataArray, sortedData);
        } else if ((this.step === undefined) && (this.starStep !== undefined)) {
          this.filterAddedPaginationData = dataArray;
          this.getqueryresult(dataArray, sortedData, sortedCategoryArrayForSearch);
        }
      } else {
        this.concatFilterAndSearchArray = this.submittedFormArr.concat(dataArray);
        this.getqueryresult(this.concatFilterAndSearchArray, sortedData, sortedCategoryArrayForSearch);
      }
    }
  }

  sortedCallFunction(sortedData, searchedData) {
    let sortArr1 = [];
    let Array1 = [];
    let jsonSortedArray = [];
    sortArr1 = sortedData.split(',');
    for (let i = 0; i < sortArr1.length; i++) {
      Array1[i] = sortArr1[i].split(' ');
      jsonSortedArray.push({
        'field': String(Array1[i][0]).replace('%20', ' ').toLowerCase(),
        'dir': String(Array1[i][1]).toUpperCase()
      });
    }

    let str1 = searchedData.slice(0, -2);
    let str2 = str1.slice(1);

    let searchArr = [];
    let Array2 = [];
    let jsonSearchedArray = [];
    if((this.onFromRunFlag === false) && (this.submittedFormArr.length > 0)){
      for (let i = 0; i < this.submittedFormArr.length; i++) {
        jsonSearchedArray.push(this.submittedFormArr[i]);
      }
    }
    searchArr = str2.split(') (');
    for (let i = 0; i < searchArr.length; i++) {
      Array2[i] = searchArr[i].split(', ');
      Array2[i][0] = Array2[i][0].replace(/%20/g, ' ').replace(/%3A/g, ':');
      jsonSearchedArray.push({
        'field': String(Array2[i][1]).replace('%20', ' ').toLowerCase(),
        'op': 'like',
        'val': Array2[i][0].replace(/'/g, '')
      });
    }
    this.gridSortedArray = jsonSortedArray;
    if (this.onFromRunFlag === false) {
      if ((this.step !== undefined) && (this.starStep === undefined)) {
        // this.recordgridresult(jsonSearchedArray, jsonSortedArray);
      } else if ((this.step === undefined) && (this.starStep !== undefined)) {
        this.filterAddedPaginationData = jsonSearchedArray;
        this.getqueryresult(jsonSearchedArray, jsonSortedArray, this.sortedCategoryArray);
      }
    } else {
      this.concatFilterAndSearchArray = this.submittedFormArr.concat(jsonSearchedArray);
      this.getqueryresult(this.concatFilterAndSearchArray, jsonSortedArray, this.sortedCategoryArray);
    }

  }

  viewTicketList(value, paginationObj) {
    this.isDisplayFlag = false;
    const offset = paginationObj.offset;
    const paginationType = paginationObj.paginationType;
    const limit = paginationObj.limit;
    if (offset === 0) {
      this.page_no = 0;
    }
    if (this.onFromRunFlag === false) {
      if ((this.step !== undefined) && (this.starStep === undefined)) {
        this.margeHeaderArr = ['clientid', 'mstorgnhirarchyid'];
        this.margeHeaderArr.push('id', 'recordid', 'tickettypeid');
        for (let i = 0; i < this.defaultGridHeader1.length; i++) {
          this.margeHeaderArr.push(this.defaultGridHeader1[i].field);
        }
        if (this.grpLevel > 1) {
          for (let i = 0; i < this.defaultGridHeader2.length; i++) {
            this.margeHeaderArr.push(this.defaultGridHeader2[i].field);
          }

        }
        if (this.typSelected !== undefined) {
          let searchedData = [];
          let sortedData = [];
          this.isDisplayFlag = true;
        }

      } else if ((this.step === undefined) && (this.starStep !== undefined)) {
        const sortedData = [];
        this.isDisplayFlag = true;
        this.getqueryresult(this.filterAddedPaginationData, sortedData, this.sortedCategoryArray);
      }

    } else {
      let sortedArray = [];
      if (this.concatFilterAndSearchArray.length > 0) {
        this.getqueryresult(this.concatFilterAndSearchArray, sortedArray, this.sortedCategoryArray);
      } else {
        this.getqueryresult(this.submittedFormArr, sortedArray, this.sortedCategoryArray);
      }
    }

  }

  displayTicket(res, offset, paginationType) {
    this.dataLoaded = true;
    this.isDisplayFlag = false;
    this.categoriesLength = 0;
    this.dataset = [];
    let statusReasonArray = [];
    let visiblecommentsArray = [];
    if (res.success) {
      const data = res.details.result;
      if(data.length > 0){
        this.categoriesLength = data[0].categories.length;
        for(let i=0;i<data.length;i++){
          for(let j=0;j<data[i].categories.length;j++){
            data[i][data[i].categories[j].lable] = data[i].categories[j].name;
          }
          delete data[i].categories;
        }

        for(let i=0;i<data.length;i++){
          if(data[i].statusreson.length > 0){
            for(let j=0;j<data[i].statusreson.length;j++){
              statusReasonArray.push(data[i].statusreson[j].termname + ' : ' + data[i].statusreson[j].recordtrackvalue);
            }

            data[i]['statusreason'] = statusReasonArray.toString();
          }
          delete data[i].statusreson;
        }
      
        for(let i=0;i<data.length;i++){
          if(data[i].visiblecomment.length > 0){
            for(let j=0;j<data[i].visiblecomment.length;j++){
              visiblecommentsArray.push(data[i].visiblecomment[j].Comment + ' : ' + data[i].visiblecomment[j].Createdate);
            }

            data[i]['visiblecomments'] = visiblecommentsArray.toString();
          }
          delete data[i].visiblecomment;
        }

      }
      this.totalData = res.details.total;
      this.dataset = data;

    } else {
      this.dataset = [];
      this.totalData = 0;
      this.notifier.notify('error', res.message);
    }
  }

  onPageSizeChange(value: any) {
    this.itemsPerPage = this.pageSizeObj[value].value;
    this.pageChanged(1);
  }

  pageChanged(page) {
    this.pageSizes = this.itemsPerPage * (page - 1);
    this.paginationObj = {offset: this.pageSizes, limit: this.itemsPerPage};
    if (!Number.isNaN(this.pageSizes)) {
      this.viewTicketList(this.folderClicked, this.paginationObj);
    }
  }


  getColumnDefintion() {
    // this.dataLoaded = false;
    const params = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.orgId,
      'fromrecorddifftypeid': this.TICKET_TYPE_ID,
      'fromrecorddiffid': this.typSelected,
      'seqno': this.CATEGORY_SEQ
    };
    this.dataLoaded = false;
    this.rest.categoryLabel(params).subscribe((res: any) => {
      if (res.success) {
        // this.dataLoaded = true;
        const data = res.details;
        this.duplicateFieldChecker = [];
        let data1 = [];
        this.margeHeaderArr = ['clientid', 'mstorgnhirarchyid'];
        this.headerDisplayArray = [];
        if (Number(this.selectedGridColumns.length) > 0) {
          for (let i = 0; i < this.selectedGridColumns.length; i++) {
            data1.push(
              {
                id: this.selectedGridColumns[i].field,
                name: this.selectedGridColumns[i].value,
                field: this.selectedGridColumns[i].field,
                minWidth: 120,
                sortable: true,
                filterable: true
              }
            );
            if((this.selectedGridColumns[i].field === 'resosladuedatetime') || (this.selectedGridColumns[i].field === 'latestresodatetime')){
              this.duplicateFieldChecker.push(this.selectedGridColumns[i].id);
            }
          }
          this.dataLoaded = true;
          this.filterLoader = true;

        } else {
          for (let i = 0; i < this.defaultGridHeader1.length; i++) {
            data1.push(
              {
                id: this.defaultGridHeader1[i].field,
                name: this.defaultGridHeader1[i].name,
                field: this.defaultGridHeader1[i].field,
                minWidth: 120,
                sortable: true,
                filterable: true
              }
            );
          }
          for (let i = 0; i < this.columnData.length; i++) {
            data1.unshift(this.columnData[i]);
          }
          if (this.grpLevel > 1) {
            for (let i = 0; i < this.defaultGridHeader2.length; i++) {
              data1.push(
                {
                  id: this.defaultGridHeader2[i].field,
                  name: this.defaultGridHeader2[i].name,
                  field: this.defaultGridHeader2[i].field,
                  minWidth: 120,
                  sortable: true,
                  filterable: true
                }
              );
            }
            this.getlabelbydiffseq('');
            this.filterLoader = true;
            this.dataLoaded = true;
          }
        }
        if (data1.length > 0) {
          this.margeHeaderArr.push('id', 'recordid', 'tickettypeid');
          for (let i = 0; i < data1.length; i++) {
            this.margeHeaderArr.push(data1[i].field);
          }
          for (let i = 0; i < data1.length; i++) {
            this.headerDisplayArray.push(data1[i].name);
          }
          const index2 = this.headerDisplayArray.indexOf('', 0);
          if (index2 > -1) {
            this.headerDisplayArray.splice(index2, 1);
          }
        } else {
          this.margeHeaderArr = ['clientid', 'mstorgnhirarchyid'];
          this.headerDisplayArray = [];
        }
        this.gridObj.setColumns(data1);

      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {

    });

  }

  changeColor(newColor) {

  }

  ngOnDestroy(): void {
    if (this.userAuth) {
      this.userAuth.unsubscribe();
    }
    if (this.closeModalSubscribe) {
      this.closeModalSubscribe.unsubscribe();
    }
  }


  onGridChanged(values: any, type) {
    if (type === 'filter') {

    } else if (type === 'sorter') {

    }
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  openDropList(event: CdkDragDrop<string[]>) {
    transferArrayItem(event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex);

    this.eventData = event.container.data;

  }

  onSubmit() {
    this.selectedGridColumns = [];
    this.selectedGridColumns = this.eventData;
    if (this.selectedGridColumns.length > 0) {
      if (Number(this.selectedGridColumns.length) === 1) {
        this.notifier.notify('success', this.selectedGridColumns.length + ' Header is added successfully');
      } else {
        this.notifier.notify('success', this.selectedGridColumns.length + ' Headers are added successfully');
      }
      if(this.totalData > 0){
        const sortedArray = [];
        this.margeHeaderArr = ['clientid', 'mstorgnhirarchyid'];
        this.margeHeaderArr.push('id', 'recordid', 'tickettypeid');
        for (let i = 0; i < this.selectedGridColumns.length - this.categoriesLength; i++) {
          this.margeHeaderArr.push(this.selectedGridColumns[i].field);
        }
        this.onFromRunFlag = true;
        this.isEditHeader = false;
        if(this.orgSelected === undefined || this.orgSelected.length === 0){
          if ((this.step !== undefined) && (this.starStep === undefined)) {
            const searchedArray = [];
          } else if((this.step === undefined) && (this.starStep !== undefined)) {
            this.getqueryresult(this.submittedFormArr, sortedArray, this.sortedCategoryArray);
          }
        } else {
          this.getqueryresult(this.submittedFormArr, sortedArray, this.sortedCategoryArray);
        }
      } else {
        this.getColumnDefintion();
      }
    } else {
      this.notifier.notify('error', this.messageService.SELECT_HEADER);
    }
  }


  onFormReset(type) {
    this.isAllOrg = false;
    this.isAllConditionValue = false;
    this.isValidateFilterCategoryAndOperator = false;
    this.frmGroupArr = [];
    this.orgSelected = [];
    this.form = new form();
    this.frmGroupArr.push(this.form);
    this.frmGroupArr[0].operatorSelected = 0;
    this.frmGroupArr[0].isNumericConditionValue = false;
    this.frmGroupArr[0].isConditionValueDropdown = false;
    this.frmGroupArr[0].isConditionValueDropdownMultiSelect = false;
    this.submittedFormArr = [];
    const sortedArray = [];
    this.onFromRunFlag = false;
    this.ticketTypeSelected = '';
    this.ticketTypesForFilter = [];
    this.isValidateFilterCondition = false;
    this.validationForCategoryDuplication = false;
    this.duplicateCategoryName = '';
    if(type === 'reset'){
      this.dataset = [];
      this.totalData = 0;
      if(this.orgTypeId !== 2){
        this.orgSelected = [];
        this.orgSelected.push(this.orgId);
        this.onOrgChange(this.orgSelected, '');
      }
      this.defaultGridHeaders();
      this.toggleStarViews('default');
    } else {
      if ((this.step !== undefined) && (this.starStep === undefined)) {
      } else if((this.step === undefined) && (this.starStep !== undefined)) {
        this.clickedStarFilter(this.starStep, type);
      }
    }
  }

  onEditHeader() {
    this.isEditHeader = !this.isEditHeader;
  }

  onHeaderReset(type) {
    this.editedGridHeaderNames = [];
    this.eventData = [];
    this.selectedGridColumns = [];
    this.gridHeaderNames = [];
    this.gridHeaderNames = [
      {'id': 0, 'value': 'Customer', 'field': 'levelonecatename', 'disabled': false},
      {'id': 1, 'value': 'Ticket ID', 'field': 'ticketid', 'disabled': false},
      {'id': 2, 'value': 'Source', 'field': 'source', 'disabled': false},
      {'id': 3, 'value': 'Requester Name', 'field': 'requestorname', 'disabled': false},
      {'id': 4, 'value': 'Requester Location/Branch', 'field': 'requestorlocation', 'disabled': false},
      {'id': 5, 'value': 'Requester Primary Contact (Phone/Mobile) Number', 'field': 'requestorphone', 'disabled': false},
      {'id': 6, 'value': 'Requester Email ID', 'field': 'requestoremail', 'disabled': false},
      {'id': 7, 'value': 'Original Created By Name', 'field': 'orgcreatorname', 'disabled': false},
      {'id': 8, 'value': 'Original Created By Location', 'field': 'orgcreatorlocation', 'disabled': false},
      {'id': 9, 'value': 'Original Created By Primary Contact (Phone/Mobile) Number', 'field': 'orgcreatorphone', 'disabled': false},
      {'id': 10, 'value': 'Original Created By Email ID', 'field': 'orgcreatoremail', 'disabled': false},
      {'id': 11, 'value': 'Short Description', 'field': 'shortdescription', 'disabled': false},
      {'id': 12, 'value': 'Priority', 'field': 'priority', 'disabled': false},
      {'id': 13, 'value': 'Status', 'field': 'status', 'disabled': false},
      {'id': 46, 'value': 'Ticket Type', 'field': 'tickettype', 'disabled': false},
      {'id': 53, 'value': 'Vendor Name', 'field': 'vendorname', 'disabled': false},
      {'id': 54, 'value': 'Vendor Ticket Id', 'field': 'vendorticketid', 'disabled': false},
      {'id': 55, 'value': 'Resolution Code', 'field': 'resolutioncode', 'disabled': false},
      {'id': 56, 'value': 'Resolution Comment', 'field': 'resolutioncomment', 'disabled': false},
      {'id': 57, 'value': 'Last Update By', 'field': 'lastuser', 'disabled': false},
      {'id': 58, 'value': 'Resolved Date Time', 'field': 'latestresodatetime', 'disabled': false},
      {'id': 59, 'value': 'Duration in Pending Vendor State (Minutes)', 'field': 'followuptimetaken', 'disabled': false},
      {'id': 159, 'value': 'Duration In Pending User State (Minutes)', 'field': 'userreplytimetaken', 'disabled': false},
      {'id': 60, 'value': 'Pending Vendor Count', 'field': 'pendingvendorcount', 'disabled': false},
      {'id': 49, 'value': 'Priority Change Count', 'field': 'prioritycount', 'disabled': false},
      {'id': 50, 'value': 'Total Response SLA Time (Minutes)', 'field': 'responsetime', 'disabled': false},
      {'id': 51, 'value': 'Total Resolution SLA Time (Minutes)', 'field': 'resotimeexcludeidletime', 'disabled': false},
      {'id': 52, 'value': 'Pending User Count', 'field': 'pendingusercount', 'disabled': false},
      {'id': 14, 'value': 'VIP Ticket (Yes/No)', 'field': 'vipticket', 'disabled': false},
      {'id': 15, 'value': 'Assigned Group (Last assigned Resolver Group)', 'field': 'assignedgroup', 'disabled': false},
      {'id': 16, 'value': 'Assigned User (Last assigned  user from the Resolver Group)', 'field': 'assigneduser', 'disabled': false},
      {'id': 17, 'value': 'Resolved By Group (Last assigned Resolver Group who has resolved the ticket)', 'field': 'resogroup', 'disabled': false},
      {'id': 18, 'value': 'Resolved By User (Last assigned  user from the Resolver Group who has resolved the ticket)', 'field': 'resolveduser', 'disabled': false},
      {'id': 19, 'value': 'Created Since', 'field': 'createddatetime', 'disabled': false},
      {'id': 20, 'value': 'Last Modified Date Time', 'field': 'lastupdateddatetime', 'disabled': false},
      {'id': 27, 'value': 'Urgency', 'field': 'urgency', 'disabled': false},
      {'id': 28, 'value': 'Impact', 'field': 'impact', 'disabled': false},
      {'id': 29, 'value': 'Due Date Time', 'field': 'resosladuedatetime', 'disabled': false},
      {'id': 30, 'value': 'Response SLA Breached Status', 'field': 'respslabreachstatus', 'disabled': false},
      {'id': 31, 'value': 'Resolution SLA Breached Status', 'field': 'resolslabreachstatus', 'disabled': false},
      {'id': 75, 'value': 'Response SLA Breach Code', 'field': 'responsebreachcode', 'disabled': false},
      {'id': 76, 'value': 'Resolution SLA Breach Code', 'field': 'resolutionbreachcode', 'disabled': false},
      {'id': 77, 'value': 'Response SLA Breach Comment', 'field': 'responsebreachcomment', 'disabled': false},
      {'id': 78, 'value': 'Resolution SLA Breach Comment', 'field': 'resolutionbreachcomment', 'disabled': false},
      {'id': 79, 'value': 'Response SLA Breach Date Time', 'field': 'respsladuedatetime', 'disabled': false},
      {'id': 80, 'value': 'Resolution SLA Breach Date Time', 'field': 'resosladuedatetime', 'disabled': false},
      {'id': 32, 'value': 'Response SLA Overdue (Minutes)', 'field': 'respoverduetime', 'disabled': false},
      {'id': 33, 'value': 'Resolution SLA Overdue (Minutes)', 'field': 'resooverduetime', 'disabled': false},
      {'id': 34, 'value': 'Aging in Days (Calendar days from created date)', 'field': 'calendaraging', 'disabled': false},
      {'id': 35, 'value': 'Not Updated Since (Days)', 'field': 'worknotenotupdated', 'disabled': false},
      {'id': 36, 'value': 'Reopen Count', 'field': 'reopencount', 'disabled': false},
      {'id': 37, 'value': 'Reassignment Hop Count', 'field': 'reassigncount', 'disabled': false},
      {'id': 38, 'value': 'Category Change Count', 'field': 'categorychangecount', 'disabled': false},
      {'id': 39, 'value': 'User Follow Up', 'field': 'followupcount', 'disabled': false},
      {'id': 40, 'value': 'Outbound Count', 'field': 'outboundcount', 'disabled': false},
      // {'id': 41, 'value': 'IsParent (Yes/No)', 'field': 'isparent'},
      {'id': 42, 'value': 'Child Count (if parent)', 'field': 'childcount', 'disabled': false},
      {'id': 43, 'value': 'Response Clock Status (Running/Stopped)', 'field': 'respclockstatus', 'disabled': false},
      {'id': 44, 'value': 'Resolution Clock Status (Running/Stopped/Paused)', 'field': 'resoclockstatus', 'disabled': false},
      {'id': 45, 'value': 'Response SLA Meter %', 'field': 'responseslameterpercentage', 'disabled': false},
      {'id': 46, 'value': 'Resolution SLA Meter %', 'field': 'resolutionslameterpercentage', 'disabled': false},
      {'id': 47, 'value': 'Business Aging (HH:MM)', 'field': 'businessaging', 'disabled': false},
      {'id': 48, 'value': 'Actual Effort Spent (HH:MM)', 'field': 'actualeffort', 'disabled': false},
      {'id': 70, 'value': 'Total SLA Idle Time (Minutes)', 'field': 'slaidletime', 'disabled': false},
      // {'id': 71, 'value': 'Response SLA Overdue %', 'field': 'respoverdueperc', 'disabled': false},
      // {'id': 72, 'value': 'Resolution SLA Overdue %', 'field': 'resooverdueperc', 'disabled': false},
      {'id': 81, 'value': 'Response SLA End Date Time', 'field': 'firstresponsedatetime', 'disabled': false},
      {'id': 82, 'value': 'Resolution SLA End Date Time', 'field': 'latestresodatetime', 'disabled': false},
      {'id': 219, 'value': 'Parent Ticket', 'field': 'parentticket', 'disabled': true },
      {'id': 83, 'value': 'Response SLA Start Date Time', 'field': 'startdatetimeresponse', 'disabled': true},
      {'id': 84, 'value': 'Resolution SLA Start Date Time', 'field': 'startdatetimeresolution', 'disabled': true},
      {'id': 217, 'value': 'Status Reason', 'field': 'statusreason', 'disabled': true},
      {'id': 218, 'value': 'Customer Visible Comments', 'field': 'visiblecomments', 'disabled': true},
    ];
    for(let i=0;i<this.defaultGridHeader1.length;i++){
      for(let j=0;j<this.gridHeaderNames.length;j++){
        if(String(this.defaultGridHeader1[i].field) === String(this.gridHeaderNames[j].field)){
          this.selectedGridColumns.push({
            'id': this.gridHeaderNames[j].id,
            'field': this.gridHeaderNames[j].field,
            'value': this.gridHeaderNames[j].value,
            'disabled': this.gridHeaderNames[j].disabled
          });
        }
      }
    }
    if (this.grpLevel > 1) {
      for(let i=0;i<this.defaultGridHeader2.length;i++){
        for(let j=0;j<this.gridHeaderNames.length;j++){
          if(String(this.defaultGridHeader2[i].field) === String(this.gridHeaderNames[j].field)){
            this.selectedGridColumns.push({
              'id': this.gridHeaderNames[j].id,
              'field': this.gridHeaderNames[j].field,
              'value': this.gridHeaderNames[j].value,
              'disabled': this.gridHeaderNames[j].disabled
            });
          }
        }
      }
    }
    this.eventData = this.selectedGridColumns;
    this.editedGridHeaderNames = this.gridHeaderNames.filter(entryValues1 => !this.selectedGridColumns.some(entryValues2 => entryValues1.field === entryValues2.field));
    this.margeHeaderArr = ['clientid', 'mstorgnhirarchyid'];
    this.margeHeaderArr.push('id', 'recordid', 'tickettypeid');
    for (let i = 0; i < this.defaultGridHeader1.length; i++) {
      this.margeHeaderArr.push(this.defaultGridHeader1[i].field);
    }
    if (this.grpLevel > 1) {
      for (let i = 0; i < this.defaultGridHeader2.length; i++) {
        this.margeHeaderArr.push(this.defaultGridHeader2[i].field);
      }
    }
    let searchedData = this.submittedFormArr;
    let sortedData = [];
    if(this.orgSelected === undefined || this.orgSelected.length === 0 || this.ticketTypeSelected === undefined){
      if ((this.step !== undefined) && (this.starStep === undefined)) {
        const searchedArray = [];
      } else if((this.step === undefined) && (this.starStep !== undefined)) {
        if((type !== 'emptyFilter')){
        }
      }
    } else {
      this.getlabelbydiffseq('');
    }
    if((type !== 'emptyFilter')){
      this.notifier.notify('success', 'Reset to default headers.');
    }
  }

  onFieldChange(selectedValue, index){
    this.isAllConditionValue = false;
    this.validationForCategoryDuplication = false;
    this.duplicateCategoryName = '';
    this.frmGroupArr[index].selectedFieldValue = "";
    this.frmGroupArr[index].selectedFieldValue = selectedValue;
    this.frmGroupArr[index].isNumericConditionValue = false;
    this.frmGroupArr[index].isConditionValueDropdown = false;
    this.frmGroupArr[index].isConditionValueDropdownMultiSelect = false;
    this.frmGroupArr[index].dropDownSelected3 = undefined;
    this.frmGroupArr[index].dropDownSelected4 = undefined;
    this.frmGroupArr[index].dropDownSelected5 = undefined;
    this.frmGroupArr[index].dropDownSelected6 = undefined;
    this.frmGroupArr[index].dateTimePicker = undefined;
    this.frmGroupArr[index].fromDateSelected2 = undefined;
    this.frmGroupArr[index].toDateSelected1 = undefined;

    if(this.frmGroupArr.length > 1){
      for(let i=0;i<this.frmGroupArr.length;i++){
        if((this.frmGroupArr[i].dropDownSelected1 === 'Company') || (this.frmGroupArr[i].dropDownSelected1 === 'Service') || (this.frmGroupArr[i].dropDownSelected1 === 'Service Category') || (this.frmGroupArr[i].dropDownSelected1 === 'Service Sub Category') || (this.frmGroupArr[i].dropDownSelected1 === 'Service Description')){
          if(this.frmGroupArr[i].dropDownSelected1 === this.frmGroupArr[index].dropDownSelected1){
            if(Number(i) !== Number(index)){
              this.validationForCategoryDuplication = true;
              this.duplicateCategoryName = this.frmGroupArr[index].dropDownSelected1;
              this.frmGroupArr[index].dropDownSelected1 = undefined;
              this.notifier.notify('error', this.duplicateCategoryName + ' can be selected only once for query.');
              break;
            }
          }
        }
      }
    }

    if(this.frmGroupArr[index - 1]){
      if((this.frmGroupArr[index].dropDownSelected1 === 'Company') || (this.frmGroupArr[index].dropDownSelected1 === 'Service') || (this.frmGroupArr[index].dropDownSelected1 === 'Service Category') || (this.frmGroupArr[index].dropDownSelected1 === 'Service Sub Category') || (this.frmGroupArr[index].dropDownSelected1 === 'Service Description')){
        if(this.frmGroupArr[index - 1].operatorSelected === 2){
          // this.frmGroupArr[index - 1].operatorSelected = 0;
          this.isValidateFilterCategoryAndOperator = true;
          this.notifier.notify('error', 'Previous operator must be AND if you are choosing any CTIS related fields.');
        } else {
          this.isValidateFilterCategoryAndOperator = false;
        }
      } else {
        this.isValidateFilterCategoryAndOperator = false;
      }
    } else {
      this.isValidateFilterCategoryAndOperator = false;
    }

    if(this.frmGroupArr[index].selectedConditionValue !== undefined){
      if((this.frmGroupArr[index].selectedFieldValue === 'Company') || (this.frmGroupArr[index].selectedFieldValue === 'Service') || (this.frmGroupArr[index].selectedFieldValue === 'Service Category') || (this.frmGroupArr[index].selectedFieldValue === 'Service Sub Category') || (this.frmGroupArr[index].selectedFieldValue === 'Service Description')){
        if(this.frmGroupArr[index].selectedConditionValue !== 'like'){
          // this.frmGroupArr[index].selectedConditionValue = undefined;
          this.isValidateFilterCondition = true;
          this.notifier.notify('error', 'Categories are only valid for like condition.');
        } else {
          this.isValidateFilterCondition = false;
        }
      } else {
        if((this.frmGroupArr[index].selectedConditionValue === '>') || (this.frmGroupArr[index].selectedConditionValue === '<') || (this.frmGroupArr[index].selectedConditionValue === '>=') || (this.frmGroupArr[index].selectedConditionValue === '<=') || (this.frmGroupArr[index].selectedConditionValue === 'between')){
          if(this.frmGroupArr[index].selectedConditionValue === 'between'){
            this.frmGroupArr[index].startAt = new Date(new Date().setHours(0,0,0,0));
            this.frmGroupArr[index].endAt = new Date(new Date().setHours(23,59,59,59));
          }
          if((this.frmGroupArr[index].selectedFieldValue === 'latestresodatetime') || (this.frmGroupArr[index].selectedFieldValue === 'followuptimetaken') || (this.frmGroupArr[index].selectedFieldValue === 'pendingvendorcount') || (this.frmGroupArr[index].selectedFieldValue === 'ticketid') || (this.frmGroupArr[index].selectedFieldValue === 'createddatetime') || (this.frmGroupArr[index].selectedFieldValue === 'lastupdateddatetime') || (this.frmGroupArr[index].selectedFieldValue === 'resosladuedatetime') || (this.frmGroupArr[index].selectedFieldValue === 'respoverduetime') || (this.frmGroupArr[index].selectedFieldValue === 'resooverduetime') || (this.frmGroupArr[index].selectedFieldValue === 'calendaraging') || (this.frmGroupArr[index].selectedFieldValue === 'reopencount') || (this.frmGroupArr[index].selectedFieldValue === 'reassigncount') || (this.frmGroupArr[index].selectedFieldValue === 'categorychangecount') || (this.frmGroupArr[index].selectedFieldValue === 'followupcount') || (this.frmGroupArr[index].selectedFieldValue === 'outboundcount') || (this.frmGroupArr[index].selectedFieldValue === 'childcount') || (this.frmGroupArr[index].selectedFieldValue === 'worknotenotupdated') || (this.frmGroupArr[index].selectedFieldValue === 'responseslameterpercentage') || (this.frmGroupArr[index].selectedFieldValue === 'resolutionslameterpercentage') || (this.frmGroupArr[index].selectedFieldValue === 'prioritycount') || (this.frmGroupArr[index].selectedFieldValue === 'responsetime') || (this.frmGroupArr[index].selectedFieldValue === 'resotimeexcludeidletime') || (this.frmGroupArr[index].selectedFieldValue === 'pendingusercount')){
            if(this.frmGroupArr[index].selectedFieldValue === 'ticketid'){
              this.frmGroupArr[index].isNumericConditionValue = false;
              this.isValidateFilterCondition = false;
            } else if((this.frmGroupArr[index].selectedFieldValue === 'createddatetime') || (this.frmGroupArr[index].selectedFieldValue === 'lastupdateddatetime') || (this.frmGroupArr[index].selectedFieldValue === 'resosladuedatetime') || (this.frmGroupArr[index].selectedFieldValue === 'worknotenotupdated') || (this.frmGroupArr[index].selectedFieldValue === 'latestresodatetime')){
              this.frmGroupArr[index].isNumericConditionValue = false;
              this.frmGroupArr[index].isConditionValueDropdown = false;
              this.frmGroupArr[index].isConditionValueDropdownMultiSelect = true;
              this.isValidateFilterCondition = false;
            } else {
              this.frmGroupArr[index].isNumericConditionValue = true;
              this.isValidateFilterCondition = false;
            }
          } else {
            if((this.frmGroupArr[index].selectedFieldValue === 'requestorphone') || (this.frmGroupArr[index].selectedFieldValue === 'orgcreatorphone')){
              this.frmGroupArr[index].isNumericConditionValue = true;
            } else {
              this.frmGroupArr[index].isNumericConditionValue = false;
            }
            this.isValidateFilterCondition = true;
            this.notifier.notify('error', 'Field and condition not met');
          }
        } else{
          if((this.frmGroupArr[index].selectedFieldValue === 'latestresodatetime') || (this.frmGroupArr[index].selectedFieldValue === 'followuptimetaken') || (this.frmGroupArr[index].selectedFieldValue === 'pendingvendorcount') || (this.frmGroupArr[index].selectedFieldValue === 'ticketid') || (this.frmGroupArr[index].selectedFieldValue === 'createddatetime') || (this.frmGroupArr[index].selectedFieldValue === 'lastupdateddatetime') || (this.frmGroupArr[index].selectedFieldValue === 'resosladuedatetime') || (this.frmGroupArr[index].selectedFieldValue === 'respoverduetime') || (this.frmGroupArr[index].selectedFieldValue === 'resooverduetime') || (this.frmGroupArr[index].selectedFieldValue === 'calendaraging') || (this.frmGroupArr[index].selectedFieldValue === 'reopencount') || (this.frmGroupArr[index].selectedFieldValue === 'reassigncount') || (this.frmGroupArr[index].selectedFieldValue === 'categorychangecount') || (this.frmGroupArr[index].selectedFieldValue === 'followupcount') || (this.frmGroupArr[index].selectedFieldValue === 'outboundcount') || (this.frmGroupArr[index].selectedFieldValue === 'childcount') || (this.frmGroupArr[index].selectedFieldValue === 'worknotenotupdated') || (this.frmGroupArr[index].selectedFieldValue === 'responseslameterpercentage') || (this.frmGroupArr[index].selectedFieldValue === 'resolutionslameterpercentage') || (this.frmGroupArr[index].selectedFieldValue === 'prioritycount') || (this.frmGroupArr[index].selectedFieldValue === 'responsetime') || (this.frmGroupArr[index].selectedFieldValue === 'resotimeexcludeidletime') || (this.frmGroupArr[index].selectedFieldValue === 'pendingusercount')){
            if(this.frmGroupArr[index].selectedFieldValue === 'ticketid'){
              this.frmGroupArr[index].isNumericConditionValue = false;
            } else if((this.frmGroupArr[index].selectedFieldValue === 'createddatetime') || (this.frmGroupArr[index].selectedFieldValue === 'lastupdateddatetime') || (this.frmGroupArr[index].selectedFieldValue === 'resosladuedatetime') || (this.frmGroupArr[index].selectedFieldValue === 'worknotenotupdated') || (this.frmGroupArr[index].selectedFieldValue === 'latestresodatetime')){
              this.frmGroupArr[index].isNumericConditionValue = false;
              this.frmGroupArr[index].isConditionValueDropdown = false;
              this.frmGroupArr[index].isConditionValueDropdownMultiSelect = true;
              this.isValidateFilterCondition = false;
            }  else {
              this.frmGroupArr[index].isNumericConditionValue = true;
            }
          } else {
            this.conditionValueCheck(index);
          }
        }
      }
    } else {
      if((this.frmGroupArr[index].selectedFieldValue === 'latestresodatetime') || (this.frmGroupArr[index].selectedFieldValue === 'followuptimetaken') || (this.frmGroupArr[index].selectedFieldValue === 'pendingvendorcount') || (this.frmGroupArr[index].selectedFieldValue === 'ticketid') || (this.frmGroupArr[index].selectedFieldValue === 'createddatetime') || (this.frmGroupArr[index].selectedFieldValue === 'lastupdateddatetime') || (this.frmGroupArr[index].selectedFieldValue === 'resosladuedatetime') || (this.frmGroupArr[index].selectedFieldValue === 'respoverduetime') || (this.frmGroupArr[index].selectedFieldValue === 'resooverduetime') || (this.frmGroupArr[index].selectedFieldValue === 'calendaraging') || (this.frmGroupArr[index].selectedFieldValue === 'reopencount') || (this.frmGroupArr[index].selectedFieldValue === 'reassigncount') || (this.frmGroupArr[index].selectedFieldValue === 'categorychangecount') || (this.frmGroupArr[index].selectedFieldValue === 'followupcount') || (this.frmGroupArr[index].selectedFieldValue === 'outboundcount') || (this.frmGroupArr[index].selectedFieldValue === 'childcount') || (this.frmGroupArr[index].selectedFieldValue === 'worknotenotupdated') || (this.frmGroupArr[index].selectedFieldValue === 'responseslameterpercentage') || (this.frmGroupArr[index].selectedFieldValue === 'resolutionslameterpercentage') || (this.frmGroupArr[index].selectedFieldValue === 'prioritycount') || (this.frmGroupArr[index].selectedFieldValue === 'responsetime') || (this.frmGroupArr[index].selectedFieldValue === 'resotimeexcludeidletime') || (this.frmGroupArr[index].selectedFieldValue === 'pendingusercount')){
        if(this.frmGroupArr[index].selectedFieldValue === 'ticketid'){
          this.frmGroupArr[index].isNumericConditionValue = false;
        } else if((this.frmGroupArr[index].selectedFieldValue === 'createddatetime') || (this.frmGroupArr[index].selectedFieldValue === 'lastupdateddatetime') || (this.frmGroupArr[index].selectedFieldValue === 'resosladuedatetime') || (this.frmGroupArr[index].selectedFieldValue === 'worknotenotupdated') || (this.frmGroupArr[index].selectedFieldValue === 'latestresodatetime')){
          this.frmGroupArr[index].isNumericConditionValue = false;
          this.frmGroupArr[index].isConditionValueDropdown = false;
          this.frmGroupArr[index].isConditionValueDropdownMultiSelect = true;
          this.isValidateFilterCondition = false;
        }  else {
          this.frmGroupArr[index].isNumericConditionValue = true;
        }
      } else {
        this.conditionValueCheck(index);
      }
    }
  }

  conditionValueCheck(index){
    this.frmGroupArr[index].dropDownArr5 = [];
    this.frmGroupArr[index].dropDownArr6 = [];
    this.frmGroupArr[index].dropDownSelected3 = undefined;
    this.frmGroupArr[index].dropDownSelected4 = undefined;
    this.frmGroupArr[index].dropDownSelected5 = undefined;
    this.frmGroupArr[index].dropDownSelected6 = undefined;
    this.frmGroupArr[index].dateTimePicker = undefined;
    this.frmGroupArr[index].fromDateSelected2 = undefined;
    this.frmGroupArr[index].toDateSelected1 = undefined;
    if(this.frmGroupArr[index].selectedFieldValue === 'source') {
      if((this.frmGroupArr[index].selectedConditionValue !== undefined) && ((this.frmGroupArr[index].selectedConditionValue === 'in') || (this.frmGroupArr[index].selectedConditionValue === 'notin'))){
        this.frmGroupArr[index].isConditionValueDropdown = true;
        this.frmGroupArr[index].isConditionValueDropdownMultiSelect = true;
      } else {
        this.frmGroupArr[index].isConditionValueDropdown = true;
        this.frmGroupArr[index].isConditionValueDropdownMultiSelect = false;
      }
      if (this.filterTypSeq !== this.SR_SEQ && this.filterTypSeq !== this.STASK_SEQ) {
        if (this.sources.indexOf('Alert') === -1) {
          this.sources.splice(1, 0, 'Alert');
        }
      } else {
        if (this.sources.indexOf('Alert') > -1) {
          this.sources.splice(1, 1);
        }
      }
      let count = 0;
      for(let i=1;i<this.sources.length;i++){
        this.frmGroupArr[index].dropDownArr5.push({
          id: count,
          value: this.sources[i],
          field: this.sources[i]
        });
        this.frmGroupArr[index].dropDownArr6.push({
          id: count,
          value: this.sources[i],
          field: this.sources[i]
        });
        count = count + 1;
      }
    } else if(this.frmGroupArr[index].selectedFieldValue === 'priority'){
      this.getmappeddiffbyseq(4, index);
    } else if(this.frmGroupArr[index].selectedFieldValue === 'status'){
      this.getmappeddiffbyseq(2, index);
    } else if(this.frmGroupArr[index].selectedFieldValue === 'tickettype'){
      this.getmappeddiffbyseq(1, index);
    }  else if(this.frmGroupArr[index].selectedFieldValue === 'urgency'){
      this.getmappeddiffbyseq(7, index);
    } else if(this.frmGroupArr[index].selectedFieldValue === 'impact'){
      this.getmappeddiffbyseq(6, index);
    } else {
      this.frmGroupArr[index].isConditionValueDropdown = false;
      this.frmGroupArr[index].isConditionValueDropdownMultiSelect = false;
    }
  }

  getmappeddiffbyseq(seqNumber: number, index: any) {
    if((this.frmGroupArr[index].selectedConditionValue !== undefined) && ((this.frmGroupArr[index].selectedConditionValue === 'in') || (this.frmGroupArr[index].selectedConditionValue === 'notin'))){
      this.frmGroupArr[index].isConditionValueDropdown = true;
      this.frmGroupArr[index].isConditionValueDropdownMultiSelect = true;
    } else {
      this.frmGroupArr[index].isConditionValueDropdown = true;
      this.frmGroupArr[index].isConditionValueDropdownMultiSelect = false;
    }
    const data = {
      'clientid': this.clientId,
      "fromrecorddifftypeid": 2,
      "fromrecorddiffid": Number(this.typSelected),
      "seqno": Number(seqNumber),
    };
    if(this.orgSelected.length > 1){
      data['mstorgnhirarchyid'] = Number(this.orgSelected[0]);
    } else {
      data['mstorgnhirarchyid'] =  Number(this.orgSelected[0]);
    }
    this.rest.getmappeddiffbyseq(data).subscribe((res: any) => {
      this.respObject = res.details;
      // this.respObject.reverse();
      if(res.success){
        if(this.respObject.length > 0){
          for(let i=0;i<this.respObject.length;i++){
            this.frmGroupArr[index].dropDownArr5.push({
              id: this.respObject[i].id,
              value: this.respObject[i].typename,
              field: this.respObject[i].typename
            });
            this.frmGroupArr[index].dropDownArr6.push({
              id: this.respObject[i].id,
              value: this.respObject[i].typename,
              field: this.respObject[i].typename
            });
          }
        } else {
          this.notifier.notify('error', 'No value is mapped for this field.');
        }
      } else {
        this.notifier.notify('error', this.respObject.errorMessage);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onConditionChange(selectedValue, index){
    this.isAllConditionValue = false;
    this.isValidateFilterCondition = false;
    this.frmGroupArr[index].selectedConditionValue = "";
    this.frmGroupArr[index].selectedConditionValue = selectedValue;
    if((this.frmGroupArr[index].selectedFieldValue === 'Company') || (this.frmGroupArr[index].selectedFieldValue === 'Service') || (this.frmGroupArr[index].selectedFieldValue === 'Service Category') || (this.frmGroupArr[index].selectedFieldValue === 'Service Sub Category') || (this.frmGroupArr[index].selectedFieldValue === 'Service Description')){
      if(this.frmGroupArr[index].selectedConditionValue !== 'like'){
        // this.frmGroupArr[index].selectedConditionValue = undefined;
        this.isValidateFilterCondition = true;
        this.notifier.notify('error', 'Categories are only valid for like condition.');
      } else {
        this.isValidateFilterCondition = false;
      }
    } else {
      if((this.frmGroupArr[index].selectedConditionValue === '>') || (this.frmGroupArr[index].selectedConditionValue === '<') || (this.frmGroupArr[index].selectedConditionValue === '>=') || (this.frmGroupArr[index].selectedConditionValue === '<=') || (this.frmGroupArr[index].selectedConditionValue === 'between')){
        if(this.frmGroupArr[index].selectedConditionValue === 'between'){
          this.frmGroupArr[index].startAt = new Date(new Date().setHours(0,0,0,0));
          this.frmGroupArr[index].endAt = new Date(new Date().setHours(23,59,59,59));
        }
        if((this.frmGroupArr[index].selectedFieldValue === 'latestresodatetime') || (this.frmGroupArr[index].selectedFieldValue === 'followuptimetaken') || (this.frmGroupArr[index].selectedFieldValue === 'pendingvendorcount') || (this.frmGroupArr[index].selectedFieldValue === 'ticketid') || (this.frmGroupArr[index].selectedFieldValue === 'createddatetime') || (this.frmGroupArr[index].selectedFieldValue === 'lastupdateddatetime') || (this.frmGroupArr[index].selectedFieldValue === 'resosladuedatetime') || (this.frmGroupArr[index].selectedFieldValue === 'respoverduetime') || (this.frmGroupArr[index].selectedFieldValue === 'resooverduetime') || (this.frmGroupArr[index].selectedFieldValue === 'calendaraging') || (this.frmGroupArr[index].selectedFieldValue === 'reopencount') || (this.frmGroupArr[index].selectedFieldValue === 'reassigncount') || (this.frmGroupArr[index].selectedFieldValue === 'categorychangecount') || (this.frmGroupArr[index].selectedFieldValue === 'followupcount') || (this.frmGroupArr[index].selectedFieldValue === 'outboundcount') || (this.frmGroupArr[index].selectedFieldValue === 'childcount') || (this.frmGroupArr[index].selectedFieldValue === 'worknotenotupdated') || (this.frmGroupArr[index].selectedFieldValue === 'responseslameterpercentage') || (this.frmGroupArr[index].selectedFieldValue === 'resolutionslameterpercentage') || (this.frmGroupArr[index].selectedFieldValue === 'prioritycount') || (this.frmGroupArr[index].selectedFieldValue === 'responsetime') || (this.frmGroupArr[index].selectedFieldValue === 'resotimeexcludeidletime') || (this.frmGroupArr[index].selectedFieldValue === 'pendingusercount')){
          if(this.frmGroupArr[index].selectedFieldValue === 'ticketid'){
            this.frmGroupArr[index].isNumericConditionValue = false;
            this.isValidateFilterCondition = false;
          } else if((this.frmGroupArr[index].selectedFieldValue === 'createddatetime') || (this.frmGroupArr[index].selectedFieldValue === 'lastupdateddatetime') || (this.frmGroupArr[index].selectedFieldValue === 'resosladuedatetime') || (this.frmGroupArr[index].selectedFieldValue === 'worknotenotupdated') || (this.frmGroupArr[index].selectedFieldValue === 'latestresodatetime')){
            this.frmGroupArr[index].isNumericConditionValue = false;
            this.frmGroupArr[index].isConditionValueDropdown = false;
            this.frmGroupArr[index].isConditionValueDropdownMultiSelect = true;
            this.isValidateFilterCondition = false;
          }  else {
            this.frmGroupArr[index].isNumericConditionValue = true;
            this.isValidateFilterCondition = false;
          }
        } else {
          if((this.frmGroupArr[index].selectedFieldValue === 'requestorphone') || (this.frmGroupArr[index].selectedFieldValue === 'orgcreatorphone')){
            this.frmGroupArr[index].isNumericConditionValue = true;
          } else {
            this.frmGroupArr[index].isNumericConditionValue = false;
          }
          this.isValidateFilterCondition = true;
          this.notifier.notify('error', 'Field and condition not met');
        }
      } else {
        if((this.frmGroupArr[index].selectedConditionValue === 'in') || (this.frmGroupArr[index].selectedConditionValue === 'notin')){
          if((this.frmGroupArr[index].selectedFieldValue === 'source') || (this.frmGroupArr[index].selectedFieldValue === 'priority') || (this.frmGroupArr[index].selectedFieldValue === 'status') || (this.frmGroupArr[index].selectedFieldValue === 'tickettype') || (this.frmGroupArr[index].selectedFieldValue === 'urgency') || (this.frmGroupArr[index].selectedFieldValue === 'impact')) {
            this.frmGroupArr[index].isConditionValueDropdown = true;
            this.frmGroupArr[index].isConditionValueDropdownMultiSelect = true;
            this.conditionValueCheck(index);
          } else if((this.frmGroupArr[index].selectedFieldValue === 'createddatetime') || (this.frmGroupArr[index].selectedFieldValue === 'lastupdateddatetime') || (this.frmGroupArr[index].selectedFieldValue === 'resosladuedatetime') || (this.frmGroupArr[index].selectedFieldValue === 'worknotenotupdated') || (this.frmGroupArr[index].selectedFieldValue === 'latestresodatetime')){
            this.frmGroupArr[index].isNumericConditionValue = false;
            this.frmGroupArr[index].isConditionValueDropdown = false;
            this.frmGroupArr[index].isConditionValueDropdownMultiSelect = true;
            this.isValidateFilterCondition = false;
          } else {
            this.frmGroupArr[index].isConditionValueDropdown = false;
            this.frmGroupArr[index].isConditionValueDropdownMultiSelect = false;
          }
        } else {
          if((this.frmGroupArr[index].selectedFieldValue === 'source') || (this.frmGroupArr[index].selectedFieldValue === 'priority') || (this.frmGroupArr[index].selectedFieldValue === 'status') || (this.frmGroupArr[index].selectedFieldValue === 'tickettype') || (this.frmGroupArr[index].selectedFieldValue === 'urgency') || (this.frmGroupArr[index].selectedFieldValue === 'impact')) {
            this.frmGroupArr[index].isConditionValueDropdown = true;
            this.frmGroupArr[index].isConditionValueDropdownMultiSelect = false;
            this.conditionValueCheck(index);
          } else if((this.frmGroupArr[index].selectedFieldValue === 'createddatetime') || (this.frmGroupArr[index].selectedFieldValue === 'lastupdateddatetime') || (this.frmGroupArr[index].selectedFieldValue === 'resosladuedatetime') || (this.frmGroupArr[index].selectedFieldValue === 'worknotenotupdated') || (this.frmGroupArr[index].selectedFieldValue === 'latestresodatetime')){
            this.frmGroupArr[index].isNumericConditionValue = false;
            this.frmGroupArr[index].isConditionValueDropdown = false;
            this.frmGroupArr[index].isConditionValueDropdownMultiSelect = true;
            this.isValidateFilterCondition = false;
          } else {
            this.frmGroupArr[index].isConditionValueDropdown = false;
            this.frmGroupArr[index].isConditionValueDropdownMultiSelect = false;
          }
        }
      }
    }
  }


  onConditionValueChange(selectedConditionValue, index, type){
    if (selectedConditionValue.length === this.frmGroupArr[index].dropDownArr6.length) {
      this.isAllConditionValue = true;
    } else {
      this.isAllConditionValue = false;
    }
  }

  selectAllConditionValue(index){
    this.frmGroupArr[index].dropDownSelected6 = [];
    if (this.isAllConditionValue) {
      for (let i = 0; i < this.frmGroupArr[index].dropDownArr6.length; i++) {
        this.frmGroupArr[index].dropDownSelected6.push(String(this.frmGroupArr[index].dropDownArr6[i].field));
      }
      this.onConditionValueChange(this.frmGroupArr[index].dropDownSelected6, index,'all');
    }
  }

  onOperatorChange(selectedValue, index){
    if((this.frmGroupArr[index].selectedFieldValue === 'Company') || (this.frmGroupArr[index].selectedFieldValue === 'Service') || (this.frmGroupArr[index].selectedFieldValue === 'Service Category') || (this.frmGroupArr[index].selectedFieldValue === 'Service Sub Category') || (this.frmGroupArr[index].selectedFieldValue === 'Service Description')){
      if((this.frmGroupArr[index].operatorSelected === 2)){
        // this.frmGroupArr[index].operatorSelected = 0;
        this.notifier.notify('error', 'Categories only valid for AND operator.');
      }
    } 

    if(this.frmGroupArr[index + 1]){
      if(this.frmGroupArr[index].operatorSelected === 2){
        if((this.frmGroupArr[index + 1].dropDownSelected1 === 'Company') || (this.frmGroupArr[index + 1].dropDownSelected1 === 'Service') || (this.frmGroupArr[index + 1].dropDownSelected1 === 'Service Category') || (this.frmGroupArr[index + 1].dropDownSelected1 === 'Service Sub Category') || (this.frmGroupArr[index + 1].dropDownSelected1 === 'Service Description')){
          this.frmGroupArr[index].operatorSelected = 0;
          this.isValidateFilterCategoryAndOperator = true;
          this.notifier.notify('error', 'Previous operator must be AND if you are choosing any CTIS related fields.');
        } else {
          this.isValidateFilterCategoryAndOperator = false;
        }
      } else {
        this.isValidateFilterCategoryAndOperator = false;
      }
    } else {
      this.isValidateFilterCategoryAndOperator = false;
    }
  }


  onDateChange(date, index) {
    let today = new Date();
    if (date > today) {
      this.notifier.notify('error', "Selected date cannot be future date");
      this.frmGroupArr[index].dateTimePicker = "";
    }
  }

  fromDateChange(date, index) {
    let today = new Date();
    this.frmGroupArr[index].startAt = date;
    if (date > today) {
      this.notifier.notify('error', "From date cannot be future date");
      this.frmGroupArr[index].fromDateSelected2 = "";
      this.frmGroupArr[index].startAt = new Date(new Date().setHours(0,0,0,0));
      // this.startDate.nativeElement.value = '';
    }
    else {
      if (this.frmGroupArr[index].toDateSelected1 !== '') {
        let Difference_In_Time = this.frmGroupArr[index].toDateSelected1 - date;
        this.Difference_In_Days = Difference_In_Time / (1000 * 60 * 60 * 24);
        if ((this.Difference_In_Days === 0) || (this.frmGroupArr[index].toDateSelected1 < this.frmGroupArr[index].fromDateSelected2)) {
          this.notifier.notify('error', this.messageService.END_TIME_GREATERTHAN_START_TIME);
          this.frmGroupArr[index].fromDateSelected2 = "";
          this.frmGroupArr[index].startAt = new Date(new Date().setHours(0,0,0,0));
          // this.startDate.nativeElement.value = '';
        }
      }
    }
  }


  toDateChange(date, index) {
    let today = new Date(new Date().setHours(23,59,59,59));
    this.frmGroupArr[index].endAt = date;
    let Difference_In_Time = this.frmGroupArr[index].toDateSelected1 - this.frmGroupArr[index].fromDateSelected2;
    this.Difference_In_Days = Difference_In_Time / (1000 * 60 * 60 * 24);
    if (date > today) {
      this.notifier.notify('error', "To date cannot be future date");
      this.frmGroupArr[index].toDateSelected1 = "";
      this.frmGroupArr[index].endAt = new Date(new Date().setHours(23,59,59,59));
      // this.endDate.nativeElement.value = '';
    }
    else if ((this.Difference_In_Days === 0) || (this.frmGroupArr[index].toDateSelected1 < this.frmGroupArr[index].fromDateSelected2)) {
      this.notifier.notify('error', this.messageService.END_TIME_GREATERTHAN_START_TIME);
      this.frmGroupArr[index].toDateSelected1 = "";
      this.frmGroupArr[index].endAt = new Date(new Date().setHours(23,59,59,59));
      // this.endDate.nativeElement.value = '';
    }
    else {

    }
    // console.log("\n this.frmGroupArr   =======     ", this.frmGroupArr);
  }



  handleOnMouseEnter(e){
    const prevTooltip = document.body.querySelector('.shortDescToolTip');
    prevTooltip?.remove();
    const cell = this.angularGrid.slickGrid.getCellFromEvent(e);
    const item = this.angularGrid.dataView.getItem(cell.row);
    const columnDef = this.angularGrid.slickGrid.getColumns()[cell.cell];
    const cellPosition = getHtmlElementOffset(this.angularGrid.slickGrid.getCellNode(cell.row, cell.cell));
    if(columnDef.field==='shortdescription'){
      const tooltipElm = document.createElement('div');
      tooltipElm.className = 'shortDescToolTip'; // you could also add cell/row into the class name
      tooltipElm.innerHTML = `<div><b> ${ item.shortdescription}</b></div>`;
      document.body.appendChild(tooltipElm);
      tooltipElm.style.top = `${cellPosition.top}px`;
      // tooltipElm.style.left = `${cellPosition.left + 150}px`;
      if((screen.width - cellPosition.left)<470){
        tooltipElm.style.left = `${cellPosition.left - 200}px`;
      }
      else{
        tooltipElm.style.left = `${cellPosition.left + 150}px`;
      }
    }
    else{
      // console.log("No tooltip")
    }
  }

  handleOnMouseLeave(e){
    const prevTooltip = document.body.querySelector('.shortDescToolTip');
    prevTooltip?.remove();
  }

  generateReport(){
    if(this.totalData > 0){
      this.modalReference.close();
      this.notifier.notify('success', 'Report generation in progress. Please refresh the Reports to Download after some time.');
      let searchedData;
      let searchCategoryData;
      if (this.onFromRunFlag === false) {
        if (this.filterAddedPaginationData.length > 0) {
          searchedData = this.filterAddedPaginationData;
        } else {
          searchedData = this.submittedFormArr;
        }
      } else {
        if (this.concatFilterAndSearchArray.length > 0) {
          searchedData = this.concatFilterAndSearchArray;
        } else {
          searchedData = this.submittedFormArr;
        }
      }
      if(this.sreachedCategoryArray.length > 0){
        searchCategoryData = this.sreachedCategoryArray;
      } else {
        searchCategoryData = this.sortedCategoryArray;
      }
      const sortedData = [];
      let offset;
      if (this.pageSizes === undefined) {
        offset = 0;
      } else {
        offset = this.pageSizes;
      }
      const index = this.margeHeaderArr.indexOf('Company', 0);
      if (index > -1) {
        this.margeHeaderArr.splice(index, 1);
      }
      const index3 = this.margeHeaderArr.indexOf('Service', 0);
      if (index3 > -1) {
        this.margeHeaderArr.splice(index3, 1);
      }
      const index1 = this.margeHeaderArr.indexOf('Service Category', 0);
      if (index1 > -1) {
        this.margeHeaderArr.splice(index1, 1);
      }
      const index2 = this.margeHeaderArr.indexOf('Service Sub Category', 0);
      if (index2 > -1) {
        this.margeHeaderArr.splice(index2, 1);
      }
      const index4 = this.margeHeaderArr.indexOf('Service Description', 0);
      if (index4 > -1) {
        this.margeHeaderArr.splice(index4, 1);
      }
      const index5 = this.margeHeaderArr.indexOf('statusreason', 0);
      if (index5 > -1) {
        this.margeHeaderArr.splice(index5, 1);
      }
      const index6 = this.margeHeaderArr.indexOf('visiblecomments', 0);
      if (index6 > -1) {
        this.margeHeaderArr.splice(index6, 1);
      }
      const index7 = this.margeHeaderArr.indexOf('parentticket', 0);
      if (index7 > -1) {
        this.margeHeaderArr.splice(index7, 1);
      }
      const index8 = this.margeHeaderArr.indexOf('startdatetimeresponse', 0);
      if (index8 > -1) {
        this.margeHeaderArr.splice(index8, 1);
      }

      const index9 = this.margeHeaderArr.indexOf('startdatetimeresolution', 0);
      if (index9 > -1) {
        this.margeHeaderArr.splice(index9, 1);
      }
  
      if (this.onFromRunFlag === false) {
        if ((this.step !== undefined) && (this.starStep === undefined)) {
        } else if ((this.step === undefined) && (this.starStep !== undefined)) {
          this.excelDownLoadData(searchedData, searchCategoryData);
        }
      } else {
        if(this.orgSelected === undefined || this.orgSelected.length === 0){
          if ((this.step !== undefined) && (this.starStep === undefined)) {
          } else if((this.step === undefined) && (this.starStep !== undefined)) {
            this.excelDownLoadData(searchedData, searchCategoryData);
          }
        } else {
          this.excelDownLoadData(searchedData, searchCategoryData);
        }
      }
    } else {
      this.notifier.notify('error', 'No data to generate report');
    }
  }

  refreshReport(){
    this.downloadDisplayed = false;
    const data = {
      "refuserid": Number(this.messageService.getUserId()),
      "limit": 10,
      "offset": 0
    }
    this.rest.reportgeneratedlist(data).subscribe((res: any) => {
      this.respObject = res.details.values;
      if(res.success){
        this.downloadDisplayed = true;
        this.reportGeneratedList = this.respObject;
      } else {
        this.downloadDisplayed = true;
        this.notifier.notify('error', this.respObject.errorMessage);
      }
    }, (err) => {
      this.downloadDisplayed = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });

  }

  updateStarFilterName(selectedId){
    this.isEditFilterName = false;
    for (let i = 0; i < this.listOfFilters.length; i++) {
      if (Number(this.listOfFilters[i].id) === Number(selectedId)) {
        this.starStep = this.listOfFilters[i].id;
        this.isEditFilterName = true;
        this.clickedStarFilter(this.starStep, "cellClicked");
      }
    }
  }

  editName(){
    if(this.filteredName === this.filteredNameUpdate){
      this.notifier.notify('error', 'Please cancel if you do not want to change filter name.');
    } else {
      this.filteredNameUpdate = this.filteredName;
      this.isEditFilterName = false;
      this.updateInfo();
      this.modalReference.close();
    }
  }

  close(){
    this.isEditFilterName = false;
    this.modalReference.close();
  }


}


