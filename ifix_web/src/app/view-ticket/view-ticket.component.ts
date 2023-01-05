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
import {getHtmlElementOffset} from 'angular-slickgrid';

// import {ExcelService} from '../excel.service';
// import {SocketService} from '../socket.service';

@Component({
  selector: 'app-view-ticket',
  templateUrl: './view-ticket.component.html',
  styleUrls: ['./view-ticket.component.css']
})
export class ViewTicketComponent implements OnInit, OnDestroy {
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


  // ticketTypeLoaded = false;
  // displayed = true;
  // folderDisplayed = true;
  archiveDisplayed = true;
  starDisplayed = false;
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
    {'id': 58, 'value': 'Resolved Date', 'field': 'latestresodatetime'},
    {'id': 59, 'value': 'Duration in Pending Vendor State', 'field': 'followuptimetaken'},
    {'id': 60, 'value': 'Pending Vendor Count', 'field': 'pendingvendorcount'},
    // {'id': 217, 'value': 'Status Reason', 'field': 'statusreason'},
    // {'id': 218, 'value': 'Visible Comment', 'field': 'visiblecomments'},
    {'id': 49, 'value': 'Priority Change Count', 'field': 'prioritycount'},
    {'id': 50, 'value': 'Response Time', 'field': 'responsetime'},
    {'id': 51, 'value': 'Resolution Time', 'field': 'resolutiontime'},
    {'id': 52, 'value': 'Pending User Count', 'field': 'pendingusercount'},
    {'id': 14, 'value': 'VIP Ticket (Yes/No)', 'field': 'vipticket'},
    {'id': 15, 'value': 'Assigned Group (Last assigned Resolver Group)', 'field': 'assignedgroup'},
    {'id': 16, 'value': 'Assigned User (Last assigned  user from the Resolver Group)', 'field': 'assigneduser'},
    {'id': 17, 'value': 'Resolved By Group (Last assigned Resolver Group who has resolved the ticket)', 'field': 'resogroup'},
    {
      'id': 18,
      'value': 'Resolved By User (Last assigned  user from the Resolver Group who has resolved the ticket)',
      'field': 'resolveduser'
    },
    {'id': 20, 'value': 'Last Modified Date/Time', 'field': 'lastupdateddatetime'},
    // {'id': 21, 'value': 'Last Modified By User', 'field': 'lastuser'},
    // {'id': 22, 'value': 'CTIS L1', 'field': '' },
    // {'id': 23, 'value': 'CTIS L2', 'field': '' },
    // {'id': 24, 'value': 'CTIS L3', 'field': '' },
    // {'id': 25, 'value': 'CTIS L4', 'field': '' },
    // {'id': 26, 'value': 'CTIS L5', 'field': '' },
    {'id': 27, 'value': 'Urgency', 'field': 'urgency'},
    {'id': 28, 'value': 'Impact', 'field': 'impact'},
    {'id': 29, 'value': 'Due Date', 'field': 'resosladuedatetime'},
    // {'id': 30, 'value': 'Response SLA Breached Status', 'field': 'respslabreachstatus'},
    // {'id': 31, 'value': 'Resolution SLA Breached Status', 'field': 'resolslabreachstatus'},
    // {'id': 32, 'value': 'Response SLA Overdue', 'field': 'respoverduetime'},
    // {'id': 33, 'value': 'Resolution SLA Overdue', 'field': 'resooverduetime'},
    // {'id': 34, 'value': 'Aging in Days (Calendar days from created date)', 'field': 'calendaraging'},
    {'id': 35, 'value': 'Not Updated Since', 'field': 'worknotenotupdated'},
    {'id': 36, 'value': 'Reopen Count', 'field': 'reopencount'},
    {'id': 37, 'value': 'Reassignment Hop Count', 'field': 'reassigncount'},
    {'id': 38, 'value': 'Category Change Count', 'field': 'categorychangecount'},
    {'id': 39, 'value': 'User Follow Up', 'field': 'followupcount'},
    {'id': 40, 'value': 'Outbound Count', 'field': 'outboundcount'},
    // {'id': 41, 'value': 'IsParent (Yes/No)', 'field': 'isparent'},
    {'id': 42, 'value': 'Child Count (if parent)', 'field': 'childcount'},
    {'id': 43, 'value': 'Response Clock Status (Running/Stopped)', 'field': 'respclockstatus'},
    {'id': 44, 'value': 'Resolution Clock Status (Running/Stopped/Paused)', 'field': 'resoclockstatus'},
    // {'id': 45, 'value': 'SLA Meter Search by number %', 'field': 'responseslameterpercentage'}
  ];


// FIELD MUST ADD ON FILTER FIELD CONDITION AND EDIT HEADER..............

  // 'reopendatetime'
  // 'followupdatetime'
  // 'followuprespdatetime'
  // 'resolutionslameterpercentage'
  // 'resosladuedatetime'
  // 'firstresponsedatetime'
  // 'latestresponsedatetime'
  // 'firstresodatetime'
  // 'businessaging'
  // 'actualeffort'
  // 'slaidletime'
  // 'respoverdueperc'
  // 'resooverdueperc'
  // 'pendinguserdatetime'
  // 'userreplieddatetime'
  // 'userreplytimetaken'
  // 'closedatetime'
  // 'csatscore'
  // 'csatcomment'


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
    {'id': 0, 'value': 'Customer', 'field': 'levelonecatename'},
    {'id': 1, 'value': 'Ticket ID', 'field': 'ticketid'},
    {'id': 2, 'value': 'Source', 'field': 'source'},
    {'id': 3, 'value': 'Requester Name', 'field': 'requestorname'},
    {'id': 4, 'value': 'Requester Location/Branch', 'field': 'requestorlocation'},
    {'id': 5, 'value': 'Requester Primary Contact (Phone/Mobile) Number', 'field': 'requestorphone'},
    {'id': 6, 'value': 'Requester Email ID', 'field': 'requestoremail'},
    {'id': 7, 'value': 'Original Created By Name', 'field': 'orgcreatorname'},
    {'id': 8, 'value': 'Original Created By Location', 'field': 'orgcreatorlocation'},
    {'id': 9, 'value': 'Original Created By Primary Contact (Phone/Mobile) Number', 'field': 'orgcreatorphone'},
    {'id': 10, 'value': 'Original Created By Email ID', 'field': 'orgcreatoremail'},
    {'id': 11, 'value': 'Short Description', 'field': 'shortdescription'},
    {'id': 12, 'value': 'Priority', 'field': 'priority'},
    {'id': 13, 'value': 'Status', 'field': 'status'},
    {'id': 46, 'value': 'Ticket Type', 'field': 'tickettype'},
    {'id': 53, 'value': 'Vendor Name', 'field': 'vendorname'},
    {'id': 54, 'value': 'Vendor Ticket Id', 'field': 'vendorticketid'},
    {'id': 55, 'value': 'Resolution Code', 'field': 'resolutioncode'},
    {'id': 56, 'value': 'Resolution Comment', 'field': 'resolutioncomment'},
    {'id': 57, 'value': 'Last Update By', 'field': 'lastuser'},
    {'id': 58, 'value': 'Resolved Date', 'field': 'latestresodatetime'},
    {'id': 59, 'value': 'Duration in Pending Vendor State', 'field': 'followuptimetaken'},
    {'id': 60, 'value': 'Pending Vendor Count', 'field': 'pendingvendorcount'},
    {'id': 217, 'value': 'Status Reason', 'field': 'statusreason'},
    {'id': 218, 'value': 'Visible Comment', 'field': 'visiblecomments'},
    {'id': 49, 'value': 'Priority Change Count', 'field': 'prioritycount'},
    {'id': 50, 'value': 'Response Time', 'field': 'responsetime'},
    {'id': 51, 'value': 'Resolution Time', 'field': 'resolutiontime'},
    {'id': 52, 'value': 'Pending User Count', 'field': 'pendingusercount'},
    {'id': 14, 'value': 'VIP Ticket (Yes/No)', 'field': 'vipticket'},
    {'id': 15, 'value': 'Assigned Group (Last assigned Resolver Group)', 'field': 'assignedgroup'},
    {'id': 16, 'value': 'Assigned User (Last assigned  user from the Resolver Group)', 'field': 'assigneduser'},
    {'id': 17, 'value': 'Resolved By Group (Last assigned Resolver Group who has resolved the ticket)', 'field': 'resogroup'},
    {
      'id': 18,
      'value': 'Resolved By User (Last assigned  user from the Resolver Group who has resolved the ticket)',
      'field': 'resolveduser'
    },
    {'id': 19, 'value': 'Created Since', 'field': 'createddatetime'},
    {'id': 20, 'value': 'Last Modified Date/Time', 'field': 'lastupdateddatetime'},
    // {'id': 21, 'value': 'Last Modified By User', 'field': 'lastuser'},
    // {'id': 22, 'value': 'CTIS L1', 'field': '' },
    // {'id': 23, 'value': 'CTIS L2', 'field': '' },
    // {'id': 24, 'value': 'CTIS L3', 'field': '' },
    // {'id': 25, 'value': 'CTIS L4', 'field': '' },
    // {'id': 26, 'value': 'CTIS L5', 'field': '' },
    {'id': 27, 'value': 'Urgency', 'field': 'urgency'},
    {'id': 28, 'value': 'Impact', 'field': 'impact'},
    {'id': 29, 'value': 'Due Date', 'field': 'resosladuedatetime'},
    // {'id': 30, 'value': 'Response SLA Breached Status', 'field': 'respslabreachstatus'},
    // {'id': 31, 'value': 'Resolution SLA Breached Status', 'field': 'resolslabreachstatus'},
    // {'id': 32, 'value': 'Response SLA Overdue', 'field': 'respoverduetime'},
    // {'id': 33, 'value': 'Resolution SLA Overdue', 'field': 'resooverduetime'},
    // {'id': 34, 'value': 'Aging in Days (Calendar days from created date)', 'field': 'calendaraging'},
    {'id': 35, 'value': 'Not Updated Since', 'field': 'worknotenotupdated'},
    {'id': 36, 'value': 'Reopen Count', 'field': 'reopencount'},
    {'id': 37, 'value': 'Reassignment Hop Count', 'field': 'reassigncount'},
    {'id': 38, 'value': 'Category Change Count', 'field': 'categorychangecount'},
    {'id': 39, 'value': 'User Follow Up', 'field': 'followupcount'},
    {'id': 40, 'value': 'Outbound Count', 'field': 'outboundcount'},
    // {'id': 41, 'value': 'IsParent (Yes/No)', 'field': 'isparent'},
    {'id': 42, 'value': 'Child Count (if parent)', 'field': 'childcount'},
    {'id': 43, 'value': 'Response Clock Status (Running/Stopped)', 'field': 'respclockstatus'},
    {'id': 44, 'value': 'Resolution Clock Status (Running/Stopped/Paused)', 'field': 'resoclockstatus'},
    // {'id': 45, 'value': 'SLA Meter Search by number %', 'field': 'responseslameterpercentage'}
  ];
  selectedGridColumns = [];
  eventData = [];
  orgSelected: any;
  selectedMultipleOrgs = [];
  isEditHeader: boolean = true;
  private infoRef: MatDialogRef<unknown, any>;
  private delRef: MatDialogRef<unknown, any>;
  @ViewChild('savedFilterName') private savedFilterName;
  @ViewChild('updateFilterName') private updateFilterName;
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
    // {id: 14, name: 'Resolved Date', field: 'latestresodatetime'},
    {id: 15, name: 'Duration in Pending Vendor State', field: 'followuptimetaken'},
    // {id: 16, name: 'Pending Vendor Count', field: 'pendingvendorcount'},
    {id: 217, name: 'Status Reason', field: 'statusreason'},
    {id: 218, name: 'Visible Comment', field: 'visiblecomments'},
    {id: 6, name: 'Assignee', field: 'assigneduser'},
    {id: 7, name: 'Group', field: 'assignedgroup'}
  ];
  defaultGridHeader2 = [
    // {id: 1, name: 'Due Date', field: 'resosladuedatetime'},
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
  selectedANDarr = [];
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
  @ViewChild('startDate') startDate: ElementRef;
  Difference_In_Days: any;

  shortDescToolTip: any;
  ticketTypeSelected: any;
  ticketTypesForFilter = [];
  filterTypSeq: any;
  isAllOrg: boolean;
  isAllConditionValue: boolean;
  autoSearchCount = 1;
  private searchusersubscribe: Subscription;

  constructor(private rest: RestApiService, notifier: NotifierService, public messageService: MessageService,
              private route: Router, private modalService: NgbModal, private dialog: MatDialog, private translate: TranslateService,
              private actRoute: ActivatedRoute, private config: ConfigService) {
    this.notifier = notifier;
    // this.closeModalSubscribe = this.messageService.getCloseModalData().subscribe((data) => {
    //   console.log('-------Inside Data-------');
    //   if(data.type==='delete'){
    //     this.angularGrid.gridService.deleteItemById(data.data.id);
    //   }else if(data.type==='update'){
    //     this.angularGrid.gridService.deleteItemById(data.data.id);
    //     this.angularGrid.gridService.addItem(data.data);
    //   }
    // });
  }

  ngOnInit() {
    // this.isArchieveFolder = false;
    this.dataLoaded = true;
    this.filterLoader = true;
    this.categoryLoaded = false;
    // this.isNumericConditionValue = false;
    this.isValidateFilterCondition = false;
    this.isAllOrg = false;
    // this.isConditionValueDropdown = false;
    // this.isConditionValueDropdownMultiSelect = false;
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
        customItems: [
          {
            iconCssClass: 'fa fa-download',
            title: 'Download all Records',
            command: 'exportAllData',
            positionOrder: 92,
            cssClass: 'black',
            textCssClass: 'italic',
          },
        ],
        onCommand: (e, args) => {
          if (args.command === 'exportAllData') {
            let searchedData;
            // console.log('\n this.submittedFormArr ====   ', this.submittedFormArr);
            // console.log('\n this.concatFilterAndSearchArray ====   ', this.concatFilterAndSearchArray);
            // console.log("\n this.step === ", this.step , "    this.starStep ===  ", this.starStep);
            if (this.concatFilterAndSearchArray.length > 0) {
              searchedData = this.concatFilterAndSearchArray;
            } else {
              searchedData = this.submittedFormArr;
            }
            const sortedData = [];
            let offset;
            if (this.pageSizes === undefined) {
              offset = 0;
            } else {
              offset = this.pageSizes;
            }
            // const index = this.margeHeaderArr.indexOf('recordid', 0);
            // if (index > -1) {
            //   this.margeHeaderArr.splice(index, 1);
            // }
            // const index3 = this.margeHeaderArr.indexOf('tickettypeid', 0);
            // if (index3 > -1) {
            //   this.margeHeaderArr.splice(index3, 1);
            // }
            // const index1 = this.margeHeaderArr.indexOf('clientid', 0);
            // if (index1 > -1) {
            //   this.margeHeaderArr.splice(index1, 1);
            // }
            // const index2 = this.margeHeaderArr.indexOf('mstorgnhirarchyid', 0);
            // if (index2 > -1) {
            //   this.margeHeaderArr.splice(index2, 1);
            // }
            // let sortedMargeHeaderArray = [];
            // for(let i=0;i<this.margeHeaderArr.length - this.categoriesLength;i++){
            //   sortedMargeHeaderArray.push(this.margeHeaderArr[i]);
            // }
            // this.margeHeaderArr = sortedMargeHeaderArray;


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


            if (this.onFromRunFlag === false) {
              if ((this.step !== undefined) && (this.starStep === undefined)) {
                this.downloadgridresult();
              } else if ((this.step === undefined) && (this.starStep !== undefined)) {
                this.excelDownLoadData(searchedData);
              }

            } else {
              // console.log("\n orgSelected =====>>>>>>   ", this.orgSelected);
              if (this.orgSelected === undefined || this.orgSelected.length === 0) {
                // console.log("\n this.step ====   ", this.step, "  <<<<>>>>    this.starStep ====   ", this.starStep);
                if ((this.step !== undefined) && (this.starStep === undefined)) {
                  this.downloadgridresult();
                } else if ((this.step === undefined) && (this.starStep !== undefined)) {
                  this.excelDownLoadData(searchedData);
                }
              } else {
                this.excelDownLoadData(searchedData);
              }
            }
          }
        },
      },

    };

    this.dataset = [];
  }

  downloadgridresult() {
    const data = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.orgId,
      'searchmstorgnhirarchyid': this.selectedOrgVals,
      'recorddiffid': this.typSelected,
      'recorddiffidseq': this.typeSeq,
      'menuid': this.folderClicked,
      'querytype': 2,
      'supportgrpid': this.savedWorkFlowSGroup,
      'where': [],
      'order': [],
      'headers': this.margeHeaderArr,
      'headersdisplay': this.headerDisplayArray,
    };
    if (this.hascatalog === 'Y') {
      data['iscatalog'] = 1;
    } else {
      data['iscatalog'] = 0;
      data['recorddiffidseq'] = this.typeSeq;
      data['recorddiffid'] = Number(this.typSelected);
    }
    // console.log("\n DATA is ===>>>>   ", JSON.stringify(data));
    this.rest.downloadgridresult(data).subscribe((res: any) => {
      this.respObject = res;
      if (this.respObject.success) {
        const uploadname = this.respObject.uploadedfilename;
        const originalname = this.respObject.originalfilename;
        this.downloadFile(uploadname, originalname);
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }


  excelDownLoadData(searchedData: any) {
    const data = {
      'where': searchedData,
      'headers': this.margeHeaderArr,
      'headersdisplay': this.headerDisplayArray,
      // "order": sortedData,
    };

    // console.log("\n DATA is ===>>>>   ", JSON.stringify(data));

    this.rest.downloadifixdatainexcel(data).subscribe((res: any) => {
      this.respObject = res;
      if (this.respObject.success) {
        const uploadname = this.respObject.uploadedfilename;
        const originalname = this.respObject.originalfilename;
        this.downloadFile(uploadname, originalname);
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
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

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid && angularGrid.slickGrid || {};
    this.columnData = this.gridObj.getColumns();
  }

  onCellChanged(e, args) {

  }

  handleSelectedRowsChanged(e, args) {
    if (Array.isArray(args.rows)) {
      this.selectedTitles = args.rows.map(idx => {
        const item = this.gridObj.getDataItem(idx);
        return item || '';
      });
      if (this.selectedTitles.length > 0) {
        this.show = true;
        this.selected = this.selectedTitles.length;
      } else {
        this.show = false;
      }
    }
  }


  onCellClicked(e, args) {
    const prevTooltip = document.body.querySelector('.shortDescToolTip');
    prevTooltip?.remove();
    this.isFavouriteListSelected = false;
    this.categoryLoaded = false;
    //if (args.cell > 0) {
    const selectedRow = this.angularGrid.gridService.getColumnFromEventArguments(args);
    const data = selectedRow.dataContext;
    // console.log(JSON.stringify(data))

    this.selectedSupportGroupData = [];
    if (selectedRow.columnDef.id === 'action') {
      this.userNameSelected = '';
      this.selectedSupportGroupData = [];
      this.grpSelected = 0;
      this.userSelected = 0;
      this.userList = [];
      this.tId = data.recordid;
      this.ticketId = data.code;
      this.initialData();
      this.isLoading = false;
      this.infoRef1 = this.dialog.open(this.supportGroupEditPopUp, {width: '600px', height: '265px'});
      this.infoRef1.afterClosed().subscribe(result => {
        this.searchusersubscribe.unsubscribe();
      });
      this.searchusersubscribe = this.searchUser.valueChanges.subscribe((psOrName: any) => {
        const data = {
          loginname: psOrName,
          clientid: Number(this.clientId),
          mstorgnhirarchyid: Number(this.orgId),
          groupid: Number(this.grpSelected)
        };
        this.userList = [];
        this.isLoading = true;
        if (psOrName !== '') {
          this.rest.searchuserbygroupid(data).subscribe((res1) => {
            this.respObject = res1;
            this.isLoading = false;
            if (this.respObject.success) {
              psOrName = '';
              this.categoryLoaded = true;
              this.userList = this.respObject.details;
            } else {
              psOrName = '';
              this.notifier.notify('error', this.respObject.message);
            }
            setTimeout(() => {
              // console.log(this.templateForm.control.value)
            });
          }, (err) => {
            psOrName = '';
            this.isLoading = false;
            this.notifier.notify('error', this.messageService.SERVER_ERROR);
          });
        } else {
          this.isLoading = false;
          this.userSelected = 0;
          this.userList = [];
        }
      });

    } else {
      if ((this.step !== undefined) && (this.starStep === undefined)) {
        this.isFavouriteListSelected = false;
      } else if ((this.step === undefined) && (this.starStep !== undefined)) {
        this.isFavouriteListSelected = true;
      }
      // this.messageService.setModalData(data);
      this.rest.geturlbykey({
        clientid: data.clientid,
        mstorgnhirarchyid: data.mstorgnhirarchyid,
        Urlname: 'DisplayTicketDetails'
      }).subscribe((res: any) => {
        if (res.success) {
          if (res.details.length > 0) {
            // this.messageService.setNavigation(location.href);
            if (this.config.type === 'LOCAL') {
              if (res.details[0].url.indexOf(this.config.API_ROOT) > -1) {
                res.details[0].url = res.details[0].url.replace(this.config.API_ROOT, 'http://localhost:4200');
              }
            }
            // this.messageService.changeRouting(res.details[0].url, {
            //   id: data.recordid,
            //   code: data.code
            // });
            const url = this.messageService.externalUrl + '?dt=' + data.recordid + '&au=' + this.messageService.getUserId() +
              '&bt=' + this.messageService.getToken() + '&tp=dp&i=' + data.clientid + '&m=' + data.mstorgnhirarchyid;
            window.open(url, '_blank');
          }
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        // console.log(err);
      });

      // }

      let params = {};
      if ((this.step !== undefined) && (this.starStep === undefined)) {
        this.starStep = undefined;
        this.messageService.saveTile(this.step);
        this.messageService.removeStoredData();
      } else {
        this.step = undefined;
        params = {
          'starStep': this.starStep,
          'onFromRunFlag': this.onFromRunFlag
        };
        this.messageService.setStoredData(params);
        this.messageService.removeTile();
      }

    }

  }

  ongrpChange(selectedIndex: any) {
    this.changeGroupName = this.selectedSupportGroupData[selectedIndex].groupname;
    this.userNameSelected = '';
    this.userSelected = 0;
    this.userList = [];
  }

  onUserSelected(user: any) {
    this.userSelected = user.id;
  }


  changeUserWithState() {
    if (this.statusseq === this.CREATED_STATUS_SEQ || this.statusseq === this.REPOEN_STATUS_SEQ) {
      let seq = this.ACTIVE_STATUS_SEQ;
      if (this.typeSeq === this.CTASK_SEQ) {
        seq = this.OPEN_STATUS_SEQ;
      }
      this.stateChangeButton(seq).then((success) => {
        if (success) {
          this.moveWorkflow().then((success) => {
            if (success) {
              this.changeUser().then((chsuccess) => {
                if (chsuccess) {
                  this.initialData();
                }
              }, () => {

              });
            }
          }, () => {

          });
        }
      }, () => {

      });
    } else {
      this.changeUser().then();
    }
  }

  changeUser() {
    this.isSameGroup = false;
    const promise = new Promise((resolve, reject) => {
      if (Number(this.grpSelected) === this.agroupid && Number(this.userSelected) === this.auserid) {
        this.notifier.notify('error', this.messageService.SAME_USER);
        resolve(false);
      } else {
        let sameGroup = false;
        if (Number(this.grpSelected) === this.agroupid) {
          sameGroup = true;
        }

        const data = {
          transactionid: this.tId,
          mstgroupid: Number(this.grpSelected),
          mstuserid: Number(this.userSelected),
          createdgroupid: Number(this.userGroupId),
          samegroup: sameGroup
        };
        this.rest.changerecordgroup(data).subscribe((res: any) => {
          if (res.success) {
            this.notifier.notify('success', this.messageService.USER_CHANGE_MESSAGE);
            if (Number(this.grpSelected) === this.agroupid && Number(this.userSelected) === Number(this.messageService.getUserId())) {
              /**
               * Self Assign
               */
              this.auserid = Number(this.userSelected);
            } else {
              if (!sameGroup) {
                this.noOfHops++;
              }
              this.auserid = Number(this.userSelected);
              this.agroupid = Number(this.grpSelected);
              if (this.userGroupId === this.agroupid) {
                this.isSameGroup = true;
              } else {
                this.isSameGroup = false;
              }
            }
            if (this.auserid === Number(this.messageService.getUserId()) && this.agroupid === this.userGroupId) {
              // End User ,who created the ticket
              this.canForward = true;
            } else {
              this.canForward = false;
            }
            this.messageService.setAssignedData({auserid: this.auserid, agroupid: this.agroupid});
            this.alltermsValue();
            this.viewTicketList(this.folderClicked, {'offset': 0, 'limit': this.itemsPerPage});
            this.selectedSupportGroupData = [];
            this.infoRef1.close();
            resolve(true);
          } else {
            resolve(false);
            this.notifier.notify('error', res.message);
          }

        });
      }
    });
    return promise;
  }

  alltermsValue() {
    const data = {
      'clientid': Number(this.clientID),
      'mstorgnhirarchyid': Number(this.orgID),
      'recordid': Number(this.tId),
      'usergroupid': Number(this.userGroupId)
    };

    this.rest.newactivitylogs(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.previousTerms = this.respObject.details;
        for (let i = 0; i < this.previousTerms.length; i++) {
          this.previousTerms[i].createddate = this.messageService.dateConverter(Number(this.previousTerms[i].createddate) * 1000, 2);
        }
        if (this.termNames.length > 0) {
          for (let i = 0; i < this.termNames.length; i++) {
            this.termNames[i].checked = false;
          }
        }
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  stateChangeButton(seqno) {
    let promise = new Promise((resolve, reject) => {
      const data = {
        'clientid': Number(this.clientID),
        'mstorgnhirarchyid': Number(this.orgID),
        'typeseqno': this.STATUS_SEQ,
        'seqno': seqno,
        transitionid: this.transitionid,
        processid: this.workflowid
      };
      this.rest.getstatebyseqno(data).subscribe((res: any) => {
        if (res.success) {
          if (res.details.length > 0) {
            this.nexttransitionid = 0;
            this.nextstatusseq = seqno;
            this.nextWokflowstateid = res.details[0].mststateid;
            this.statustypeid = res.details[0].recorddifftypeid;
            this.statusid = res.details[0].recorddiffid;
            this.checkWorkflowState().then((success) => {
              if (success) {
                if (this.statusseq === this.CREATED_STATUS_SEQ || this.statusseq === this.REPOEN_STATUS_SEQ) {

                } else {
                  if (seqno === this.USER_REPLIED_STATUS_SEQ && this.grpLevel === 1) {
                    this.moveWorkflow();
                  } else {
                    this.checkTerm();
                  }
                }
                resolve(true);
              }
            }, () => {
              reject();
            });
          } else {
            resolve(false);
          }

        } else {
          this.notifier.notify('error', res.message);
          resolve(false);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
        reject();
      });
    });
    return promise;
  }

  moveWorkflow() {
    const promise = new Promise((resolve, reject) => {
      const data = {
        'clientid': Number(this.clientID),
        'mstorgnhirarchyid': Number(this.orgID),
        'recorddifftypeid': this.workingtypeid,
        'recorddiffid': this.workingid,
        'transitionid': this.nexttransitionid,
        'previousstateid': this.currentstateid,
        'currentstateid': this.nextWokflowstateid,
        'manualstateselection': this.manualstateselection,
        'transactionid': this.tId,
        'createdgroupid': this.userGroupId
      };
      if (this.manualstateselection === 0) {
        data['mstgroupid'] = this.userGroupId;
        data['mstuserid'] = Number(this.messageService.getUserId());
      } else {
        data['mstgroupid'] = Number(this.manualgroupid);
        data['mstuserid'] = Number(this.manualUserSelected);
      }
      this.rest.moveWorkflow(data).subscribe((res: any) => {
        if (res.success) {
          this.notifier.notify('success', 'Process moved to next state');
          if (this.commentDialogRef) {
            this.commentDialogRef.close();
          }
          if ((this.statusseq === this.CREATED_STATUS_SEQ && this.nextstatusseq === this.ACTIVE_STATUS_SEQ) || (this.statusseq === this.REPOEN_STATUS_SEQ && this.nextstatusseq === this.ACTIVE_STATUS_SEQ) || (this.statusseq === this.REPOEN_STATUS_SEQ && this.nextstatusseq === this.OPEN_STATUS_SEQ)) {

          } else {
            this.initialData();
          }
          resolve(true);
        } else {
          this.notifier.notify('error', res.message);
          resolve(false);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
        reject();
      });
    });
    return promise;
  }

  initialData() {
    this.ticketTab = false;
    this.nexttransitionid = 0;
    this.isSameGroup = false;
    this.multitermopentype = '';
    this.termattachment = [];
    this.canForward = false;
    this.nextstatusseq = 0;
    this.dataLoaded = true;
    this.filterLoader = true;
    this.termNames = [];
    this.previousTerms = [];
    this.hiddenManualState = false;
    this.changeGroupName = '';
    this.manualgroupid = 0;
    this.ticketTypes = [];
    this.lastgroup = '';
    this.lastuser = '';
    this.desc = '';
    this.transitionid = 0;
    this.currentstateid = 0;
    this.auserid = 0;
    this.agroupid = 0;
    this.agrouplvl = 0;
    this.workflowid = 0;
    this.selectedSupportGroupData = [];
    this.stateterms = [];
    this.grpSelected = 0;
    this.userNameSelected = '';
    this.workingtypeid = 0;
    this.workingid = 0;
    this.isDisabled = false;
    this.priority = '';
    this.statustypeid = 0;
    this.statusid = 0;
    this.nextWokflowstateid = 0;
    this.manualstateselection = 0;
    this.categoryLoaded = false;
    this.statusseq = 0;
    this.typeChecked = 0;
    this.isTypeChange = false;
    // this.isConditionValueDropdown = false;
    // this.isConditionValueDropdownMultiSelect = false;
    this.impact = 0;
    this.urgency = 0;
    this.getTicketDetails();
  }

  getTicketDetails() {
    this.rest.getrecorddetails({
      'clientid': this.clientId,
      'mstorgnhirarchyid': Number(this.orgId),
      'recordid': Number(this.tId)
    }).subscribe((res1: any) => {
      this.dataLoaded = true;
      if (res1.success) {
        this.ticketDetails = res1.details;
        this.clientID = this.ticketDetails[0].clientid;
        this.orgID = this.ticketDetails[0].mstorgnhirarchyid;
        this.typeSeq = this.ticketDetails[0].typeseqno;
        this.ticketId = this.ticketDetails[0].code;
        this.typeChecked = this.ticketDetails[0].recordtypeid;
        this.diffTypeId = this.ticketDetails[0].typedifftypeid;
        this.desc = this.ticketDetails[0].title;
        this.dDate = this.ticketDetails[0].duedate;
        this.priority = this.ticketDetails[0].priority;
        this.stageId = this.ticketDetails[0].recordstageid;
        this.workflowid = this.ticketDetails[0].workflowdetails.workflowid;
        this.workingtypeid = this.ticketDetails[0].workflowdetails.cattypeid;
        this.workingid = this.ticketDetails[0].workflowdetails.catid;
        this.noOfHops = 0;
        this.rest.getstatedetails({
          'clientid': Number(this.clientID),
          'mstorgnhirarchyid': Number(this.orgID),
          'recordid': Number(this.tId),
          'recordstageid': this.stageId
        }).subscribe((res: any) => {
          if (res.success) {
            if (res.details.length > 0) {
              this.currentGroup = res.details[0].supportgroupname;
              this.currentUser = res.details[0].username;
              this.lastgroup = res.details[0].lastgroupname;
              this.lastuser = res.details[0].lastusername;
              this.statusseq = res.details[0].seqno;
              this.transitionid = res.details[0].transitionid;
              this.currentstateid = res.details[0].currentstateid;
              this.auserid = res.details[0].userid;
              this.agroupid = res.details[0].groupid;
              this.agrouplvl = res.details[0].grplevel;
              this.messageService.setAssignedData({auserid: this.auserid, agroupid: this.agroupid});
              for (let i = 0; i < this.userGroups.length; i++) {
                if (this.userGroups[i].id === this.agroupid) {
                  this.userGroupId = this.agroupid;
                  // console.log('\n this.userGroupId === [this.agroupid]  ------->>>>   ', this.userGroupId);
                }
              }
              if (this.statusseq === this.CLOSE_STATUS_SEQ || this.statusseq === this.CANCEL_STATUS_SEQ || this.statusseq === this.RESOLVE_STATUS_SEQUENCE) {
                this.isDisabled = true;
                this.hiddenManualState = true;
                this.notifier.notify('error', 'User assigning can not be possible');
                this.closeModal2();
              } else {
                if (this.agroupid === this.userGroupId) {
                  this.isSameGroup = true;
                  if (Number(this.messageService.getUserId()) === this.auserid) {
                    this.canForward = true;
                  }
                }
              }
              this.alltermsValue();
              this.gettransitiongroupdetails();
              this.formdata = {
                'clientid': Number(this.clientID),
                'mstorgnhirarchyid': Number(this.orgID)
              };
            } else {
              this.dataLoaded = true;
              this.notifier.notify('error', this.messageService.WORKFLOW_ERROR);
            }
          } else {
            this.dataLoaded = true;
            this.notifier.notify('error', res.message);
          }
        }, (err) => {
          this.dataLoaded = true;
          // this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });

      } else {
        this.dataLoaded = true;
        this.notifier.notify('error', res1.message);
      }
    }, (err) => {
      this.dataLoaded = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  checkWorkflowState() {
    const promise = new Promise((resolve, reject) => {
      const data1 = {
        clientid: this.clientID,
        mstorgnhirarchyid: this.orgID,
        recorddifftypeid: this.workingtypeid,
        recorddiffid: this.workingid,
        previousstateid: this.currentstateid,
        currentstateid: this.nextWokflowstateid
      };
      this.rest.checkworkflowstate(data1).subscribe((res1: any) => {
        if (res1.success) {
          resolve(true);
        } else {
          this.notifier.notify('error', res1.message);
          resolve(false);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
        reject();
      });
    });
    return promise;
  }

  checkTerm() {
    this.stateterms = [];
    const data = {
      'clientid': this.clientID,
      'mstorgnhirarchyid': this.orgID,
      'recordtickettypedifftypeid': this.diffTypeId,
      'recordtickettypediffid': this.typeChecked,
      'recordstatusdifftypeid': this.statustypeid,
      'recordstatusdiffid': this.statusid
    };
    this.rest.getcommontermnamesbystate(data).subscribe((res: any) => {
      if (res.success) {
        this.stateterms = res.details;
        if (this.stateterms.length === 0) {
          this.moveWorkflow();
        } else {
          this.multitermopentype = 'workflow';
          this.termattachment = [];
          this.hideAttachment = true;
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  gettransitiongroupdetails() {
    this.rest.gettransitiongroupdetails({
      'clientid': Number(this.clientID),
      'mstorgnhirarchyid': Number(this.orgID),
      'transitionid': this.transitionid
    }).subscribe((res: any) => {
      if (res.success) {
        this.categoryLoaded = true;
        if (res.details.length > 0) {
          if (res.details[0].mstgroupid === 0) {
            res.details.shift();
            if (this.agrouplvl === 1) {
              res.details.unshift({
                mstgroupid: this.agroupid,
                mstuserid: this.auserid,
                loginname: this.lastuser,
                groupname: this.lastgroup
              });
            } else {
              let matched = false;
              for (let i = 0; i < res.details.length; i++) {
                if (res.details[i].mstgroupid === this.agroupid) {
                  matched = true;
                  res.details[i].mstuserid = this.auserid;
                  res.details[i].loginname = this.currentUser;
                }
              }
              if (!matched) {
                res.details.unshift({
                  mstgroupid: this.agroupid,
                  mstuserid: this.auserid,
                  loginname: this.currentUser,
                  groupname: this.currentGroup
                });
              }
            }
          }
          this.selectedSupportGroupData = this.messageService.sortByKey(res.details, 'groupname');
          this.grpSelected = this.agroupid;
          if (this.agrouplvl === 1) {
            this.userNameSelected = this.lastuser;
          } else {
            this.userNameSelected = this.currentUser;
          }
          this.userSelected = this.auserid;
        } else {
          this.selectedSupportGroupData = res.details;
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  closeModal2() {
    this.selectedSupportGroupData = [];
    this.infoRef1.close();
  }

  onSelectGroup() {
    if (this.userGroupSelected !== 0) {
      this.userGroupId = this.userGroupSelected;
      // console.log("\n this.userGroupId 22222222222  ------->>>>   ", this.userGroupId);
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
    const workspace = this.messageService.getWorkspace();
    if (workspace !== null) {
      this.workspaceSelected = workspace;
    } else {
      this.workspaceSelected = this.messageService.workspaces[0].id;
    }
    this.getRecordDiffType();
    // if (this.messageService.getOrgs() !== null) {
    //   this.getsupportgroupbyorg();
    // } else {
    //   this.getRecordDiffType();
    // }
    if (Number(this.orgTypeId) === 2) {
      this.getorgassignedcustomer();
      this.isAllOrg = false;
    }
    this.isAllConditionValue = false;
    this.editedGridHeaderNames = this.gridHeaderNames;
  }

  getorgassignedcustomer() {
    const data = {
      clientid: this.clientId,
      refuserid: Number(this.messageService.getUserId())
      // mstorgnhirarchyid: this.orgId
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

  // getsupportgroupbyorg() {
  //   const savedOrgs = this.messageService.getOrgs();
  //   let savedOrgsArr = savedOrgs.split(',');
  //   let selectedOrgArr = [];
  //   for (let i = 0; i < savedOrgsArr.length; i++) {
  //     selectedOrgArr.push(Number(savedOrgsArr[i]));
  //   }
  //   const data = {
  //     'clientid': Number(this.clientId),
  //     'mstorgnhirarchyids': selectedOrgArr
  //   };
  //   this.rest.getsupportgroupbyorg(data).subscribe((res: any) => {
  //     if (res.success) {
  //       this.userGroups = res.details;
  //       this.messageService.group = this.userGroups;
  //       if (this.messageService.getSupportGroup() === null) {
  //         this.userGroupId = this.userGroups[0].id;
  //         this.groupName = this.userGroups[0].groupname;
  //         this.grpLevel = this.userGroups[0].levelid;
  //         this.hascatalog = this.userGroups[0].hascatalog;
  //       } else {
  //         const group = this.messageService.getSupportGroup();
  //         let matched = false;
  //         for (let i = 0; i < this.userGroups.length; i++) {
  //           if (this.userGroups[i].id === group.groupId) {
  //             this.userGroupId = group.groupId;
  //             this.groupName = group.grpName;
  //             this.grpLevel = group.levelid;
  //             this.hascatalog = group.hascatalog;
  //             matched = true;
  //             break;
  //           }
  //         }
  //         if (!matched) {
  //           this.userGroupId = this.userGroups[0].id;
  //           this.groupName = this.userGroups[0].groupname;
  //           this.grpLevel = this.userGroups[0].levelid;
  //           this.hascatalog = this.userGroups[0].hascatalog;
  //         }
  //       }
  //       // console.log("\n this.userGroupId 333333333  ------->>>>   ", this.userGroupId);
  //       this.userGroupSelected = this.userGroupId;
  //       this.getRecordDiffType();
  //     } else {
  //       this.notifier.notify('error', res.message);
  //     }
  //   }, (err) => {
  //     this.notifier.notify('error', this.messageService.SERVER_ERROR);
  //   });
  // }


  onOrgChange(selectedIDs, type) {
    // this.orgSelected = selectedIDs;
    // console.log("\n this.orgSelected ========", this.orgSelected);
    this.selectedOrgVals = selectedIDs.toString();
    // console.log(selectedIDs.length, this.selectedMultipleOrgs.length);
    if (selectedIDs.length === this.selectedMultipleOrgs.length) {
      this.isAllOrg = true;
    } else {
      this.isAllOrg = false;
    }
    if (this.orgSelected.length > 0) {
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
        if (res.success) {
          this.ticketTypesForFilter = this.respObject;
        } else {
          this.notifier.notify('error', this.respObject.errorMessage);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    }
  }


  selectAllOrg() {
    // console.log('------------');
    this.orgSelected = [];
    if (this.isAllOrg) {
      for (let i = 0; i < this.selectedMultipleOrgs.length; i++) {
        this.orgSelected.push(Number(this.selectedMultipleOrgs[i].mstorgnhirarchyid));
      }
      this.onOrgChange(this.orgSelected, 'all');
    }
    // console.log(JSON.stringify(this.orgSelected));
  }


  onTicketTypeChange(value) {
    // console.log("\n value ::  ", value, "\n this.ticketTypeSelected =====   ", this.ticketTypeSelected);
    let seq;
    for (let i = 0; i < this.ticketTypesForFilter.length; i++) {
      if (this.ticketTypeSelected === this.ticketTypesForFilter[i].name) {
        seq = this.ticketTypesForFilter[i].seqno;
        this.filterTypSeq = seq;
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
  }

  changeRouting() {

  }

  gettilesnames() {
    const data = {
      'clientid': Number(this.clientId),
      'mstorgnhirarchyid': Number(this.orgId),
      'groupid': Number(this.userGroupId),
      // 'recorddifftypeid': Number(this.TICKET_TYPE_ID),
      // 'recorddiffid': Number(this.typSelected),
      ismanagerialview: Number(this.workspaceSelected)
    };
    if (this.hascatalog === 'Y') {
      data['iscatalog'] = 1;
    } else {
      data['iscatalog'] = 0;
      data['recorddifftypeid'] = Number(this.TICKET_TYPE_ID);
      data['recorddiffid'] = Number(this.typSelected);
    }
    this.rest.gettilesnames(data).subscribe((res: any) => {
      if (res.success) {
        this.menus = res.details;
        // console.log("\n MENUS ====>>>>>>>>>>   ", this.menus);
        if (this.menus.length > 0) {
          const tlstorage = this.messageService.getTile();
          if (tlstorage !== 0) {
            // console.log("\n tlstorage ===>>>>>>>>>>    ", tlstorage);
            // console.log("\n this.folderClicked 1111111111 =======   ", this.folderClicked);
            if (this.folderClicked !== undefined) {
              let menuID;
              for (let i = 0; i < this.menus.length; i++) {
                menuID = this.menus[0].diffid;
                break;
              }
              this.clickedFilter(menuID);
            } else {
              this.clickedFilter(tlstorage);
            }
          }
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }


  // gettilesnames() {
  //   const data = {
  //     'clientid': Number(this.clientId),
  //     'mstorgnhirarchyid': Number(this.orgId),
  //     'groupid': Number(this.userGroupId),
  //     'recorddifftypeid': Number(this.TICKET_TYPE_ID),
  //     'recorddiffid': Number(this.typSelected),
  //     ismanagerialview: Number(this.workspaceSelected)
  //   };
  //   if (this.hascatalog === 'Y') {
  //     data['iscatalog'] = 1;
  //   } else {
  //     data['iscatalog'] = 0;
  //     data['recorddifftypeid'] = Number(this.TICKET_TYPE_ID);
  //     data['recorddiffid'] = Number(this.typSelected);
  //   }
  //   this.rest.gettilesnames(data).subscribe((res: any) => {
  //     if (res.success) {
  //       this.menus = res.details;
  //       if (this.menus.length > 0) {
  //         const tlstorage = this.messageService.getTile();
  //         if (tlstorage !== 0) {
  //           this.clickedFilter(tlstorage);
  //         }
  //       }
  //     } else {
  //       this.notifier.notify('error', res.message);
  //     }
  //   }, (err) => {
  //     this.notifier.notify('error', this.messageService.SERVER_ERROR);
  //   });
  // }


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
        this.getColumnDefintion();
        this.sessionStoredData = this.messageService.getStoredData();
        let sessionStoredData2 = this.messageService.getTile();
        if ((this.sessionStoredData !== null) && (sessionStoredData2 === 0)) {
          if (this.sessionStoredData.onFromRunFlag === false) {
            if (this.sessionStoredData.starStep !== '') {
              this.step = undefined;
              this.toggleStarViews();
            }
          } else {

          }
        } else {
          this.step = String(sessionStoredData2);
          this.starStep = undefined;
          this.toggleArchiveViews();
        }
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


  toggleFolderViews() {
    this.folderDisplayed = !this.folderDisplayed;
    this.archiveDisplayed = false;
    this.starDisplayed = false;
    this.clockDisplayed = false;
    this.onFormReset('');
    // this.onHeaderReset();
  }

  toggleArchiveViews() {
    this.countSelected = 1;
    this.archiveDisplayed = true;
    this.starDisplayed = false;
    this.clockDisplayed = false;
    this.starStep = undefined;
    this.messageService.removeStoredData();
    this.gettilesnames();
  }

  toggleStarViews() {
    this.countSelected = 2;
    this.archiveDisplayed = false;
    this.starDisplayed = true;
    this.clockDisplayed = false;
    this.step = undefined;
    this.messageService.removeTile();
    this.recordfilterlist(this.starStep);
  }

  recordfilterlist(starStep) {
    this.dataLoaded = false;
    this.listOfFilters = [];
    this.rest.recordfilterlist().subscribe((res: any) => {
      if (res.success) {
        this.dataLoaded = true;
        this.respObject = res.details;
        this.listOfFilters = res.details.result;
        this.totalFilterData = res.details.total;
        if (this.listOfFilters.length > 0) {
          if (this.sessionStoredData) {
            // console.log("\n HERE............................................");
            if (this.sessionStoredData.starStep) {
              this.starStep = this.sessionStoredData.starStep;
              this.clickedStarFilter(this.starStep, '');
            }
          } else {
            // console.log("\n NOOOOOOOOOOOOOOOOOOOOO.........................................", this.starStep);
            if (this.starStep === undefined) {
              this.starStep = this.listOfFilters[0].id;
              this.clickedStarFilter(this.starStep, '');
            } else {
              this.clickedStarFilter(starStep, '');
            }
          }
        } else {

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
    this.getorgassignedcustomer();
    this.margeHeaderArr = ['clientid', 'mstorgnhirarchyid'];
    this.filterAddedPaginationData = [];
    this.editedGridHeaderNames = [];
    this.gridHeaderNames = [
      {'id': 0, 'value': 'Customer', 'field': 'levelonecatename'},
      {'id': 1, 'value': 'Ticket ID', 'field': 'ticketid'},
      {'id': 2, 'value': 'Source', 'field': 'source'},
      {'id': 3, 'value': 'Requester Name', 'field': 'requestorname'},
      {'id': 4, 'value': 'Requester Location/Branch', 'field': 'requestorlocation'},
      {'id': 5, 'value': 'Requester Primary Contact (Phone/Mobile) Number', 'field': 'requestorphone'},
      {'id': 6, 'value': 'Requester Email ID', 'field': 'requestoremail'},
      {'id': 7, 'value': 'Original Created By Name', 'field': 'orgcreatorname'},
      {'id': 8, 'value': 'Original Created By Location', 'field': 'orgcreatorlocation'},
      {'id': 9, 'value': 'Original Created By Primary Contact (Phone/Mobile) Number', 'field': 'orgcreatorphone'},
      {'id': 10, 'value': 'Original Created By Email ID', 'field': 'orgcreatoremail'},
      {'id': 11, 'value': 'Short Description', 'field': 'shortdescription'},
      {'id': 12, 'value': 'Priority', 'field': 'priority'},
      {'id': 13, 'value': 'Status', 'field': 'status'},
      {'id': 46, 'value': 'Ticket Type', 'field': 'tickettype'},
      {'id': 53, 'value': 'Vendor Name', 'field': 'vendorname'},
      {'id': 54, 'value': 'Vendor Ticket Id', 'field': 'vendorticketid'},
      {'id': 55, 'value': 'Resolution Code', 'field': 'resolutioncode'},
      {'id': 56, 'value': 'Resolution Comment', 'field': 'resolutioncomment'},
      {'id': 57, 'value': 'Last Update By', 'field': 'lastuser'},
      {'id': 58, 'value': 'Resolved Date', 'field': 'latestresodatetime'},
      {'id': 59, 'value': 'Duration in Pending Vendor State', 'field': 'followuptimetaken'},
      {'id': 60, 'value': 'Pending Vendor Count', 'field': 'pendingvendorcount'},
      {'id': 217, 'value': 'Status Reason', 'field': 'statusreason'},
      {'id': 218, 'value': 'Visible Comment', 'field': 'visiblecomments'},
      {'id': 49, 'value': 'Priority Change Count', 'field': 'prioritycount'},
      {'id': 50, 'value': 'Response Time', 'field': 'responsetime'},
      {'id': 51, 'value': 'Resolution Time', 'field': 'resolutiontime'},
      {'id': 52, 'value': 'Pending User Count', 'field': 'pendingusercount'},
      {'id': 14, 'value': 'VIP Ticket (Yes/No)', 'field': 'vipticket'},
      {'id': 15, 'value': 'Assigned Group (Last assigned Resolver Group)', 'field': 'assignedgroup'},
      {'id': 16, 'value': 'Assigned User (Last assigned  user from the Resolver Group)', 'field': 'assigneduser'},
      {'id': 17, 'value': 'Resolved By Group (Last assigned Resolver Group who has resolved the ticket)', 'field': 'resogroup'},
      {
        'id': 18,
        'value': 'Resolved By User (Last assigned  user from the Resolver Group who has resolved the ticket)',
        'field': 'resolveduser'
      },
      {'id': 19, 'value': 'Created Since', 'field': 'createddatetime'},
      {'id': 20, 'value': 'Last Modified Date/Time', 'field': 'lastupdateddatetime'},
      // {'id': 21, 'value': 'Last Modified By User', 'field': 'lastuser'},
      // {'id': 22, 'value': 'CTIS L1', 'field': '' },
      // {'id': 23, 'value': 'CTIS L2', 'field': '' },
      // {'id': 24, 'value': 'CTIS L3', 'field': '' },
      // {'id': 25, 'value': 'CTIS L4', 'field': '' },
      // {'id': 26, 'value': 'CTIS L5', 'field': '' },
      {'id': 27, 'value': 'Urgency', 'field': 'urgency'},
      {'id': 28, 'value': 'Impact', 'field': 'impact'},
      {'id': 29, 'value': 'Due Date', 'field': 'resosladuedatetime'},
      // {'id': 30, 'value': 'Response SLA Breached Status', 'field': 'respslabreachstatus'},
      // {'id': 31, 'value': 'Resolution SLA Breached Status', 'field': 'resolslabreachstatus'},
      // {'id': 32, 'value': 'Response SLA Overdue', 'field': 'respoverduetime'},
      // {'id': 33, 'value': 'Resolution SLA Overdue', 'field': 'resooverduetime'},
      // {'id': 34, 'value': 'Aging in Days (Calendar days from created date)', 'field': 'calendaraging'},
      {'id': 35, 'value': 'Not Updated Since', 'field': 'worknotenotupdated'},
      {'id': 36, 'value': 'Reopen Count', 'field': 'reopencount'},
      {'id': 37, 'value': 'Reassignment Hop Count', 'field': 'reassigncount'},
      {'id': 38, 'value': 'Category Change Count', 'field': 'categorychangecount'},
      {'id': 39, 'value': 'User Follow Up', 'field': 'followupcount'},
      {'id': 40, 'value': 'Outbound Count', 'field': 'outboundcount'},
      // {'id': 41, 'value': 'IsParent (Yes/No)', 'field': 'isparent'},
      {'id': 42, 'value': 'Child Count (if parent)', 'field': 'childcount'},
      {'id': 43, 'value': 'Response Clock Status (Running/Stopped)', 'field': 'respclockstatus'},
      {'id': 44, 'value': 'Resolution Clock Status (Running/Stopped/Paused)', 'field': 'resoclockstatus'},
      // {'id': 45, 'value': 'SLA Meter Search by number %', 'field': 'responseslameterpercentage'}
    ];
    if (this.listOfFilters.length > 0) {
      // console.log("\n inside else...............", this.selectedMultipleOrgs);
      for (let i = 0; i < this.listOfFilters.length; i++) {
        if (Number(this.listOfFilters[i].id) === Number(this.starStep)) {
          this.filteredNameUpdate = '';
          this.filteredNameUpdate = this.listOfFilters[i].name;
          const data = JSON.parse(this.listOfFilters[i].filter);
          const data1 = data.headers;
          this.margeHeaderArr.push('recordid', 'tickettypeid');
          for (let j = 0; j < data1.length; j++) {
            for (let p = 0; p < this.gridHeaderNames.length; p++) {
              if (String(data1[j]) === String(this.gridHeaderNames[p].field)) {
                this.selectedGridColumns.push({
                  'id': this.gridHeaderNames[p].id,
                  'field': this.gridHeaderNames[p].field,
                  'value': this.gridHeaderNames[p].value
                });
              }
            }
            this.margeHeaderArr.push(data1[j]);
          }
          let removeDuplicateNames = [];
          $.each(this.margeHeaderArr, function(i, el) {
            if ($.inArray(el, removeDuplicateNames) === -1) {
              removeDuplicateNames.push(el);
            }
          });
          this.margeHeaderArr = removeDuplicateNames;
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
          for (let i = this.editedGridHeaderNames.length - 1; i >= 0; i--) {
            for (let j = 0; j < this.selectedGridColumns.length; j++) {
              if (this.editedGridHeaderNames[i].field === this.selectedGridColumns[j].field) {
                this.editedGridHeaderNames.splice(i, 1);
                break;
              }
            }
          }

          const data3 = {
            'clientid': this.clientId,
            'mstorgnhirarchyid': Number(this.orgId),
            'fromrecorddifftypeid': this.TICKET_TYPE_ID,
            'fromrecorddiffid': this.typSelected,
            'seqno': 0
          };
          this.filterLoader = false;
          this.rest.getlabelbydiffseq(data3).subscribe((res: any) => {
            this.respObject = res.details;
            if (res.success) {
              this.filterLoader = true;
              this.respObject.sort((a, b) => {
                return a.seqno - b.seqno;
              });
              this.respObject.forEach((e) => {
                this.selectedGridColumns.push({
                  'id': 100 + Number(e.id),
                  'field': e.typename,
                  'value': e.typename
                });
              });
              // console.log("\n this.selectedGridColumns ==========   ", this.selectedGridColumns);
            } else {
              this.filterLoader = true;
              this.notifier.notify('error', res.message);
            }
          }, (err) => {
            this.filterLoader = true;
            this.notifier.notify('error', this.messageService.SERVER_ERROR);
          });


          if (type === 'reset') {
            this.filterLoader = true;
            this.ticketTypeSelected = '';
            this.orgSelected = [];
            // console.log("\n INSIDE RESET  ::   ");
            // console.log("\n this.orgSelected  ::   ", this.orgSelected);
            // console.log("\n this.ticketTypeSelected  ::   ", this.ticketTypeSelected);
            // console.log("\n this.frmGroupArr  ::   ", this.frmGroupArr);
          } else {
            this.filterLoader = true;
            let savedFilterConditions;
            for (let i = 0; i < this.listOfFilters.length; i++) {
              if (this.listOfFilters[i].id === Number(selectedID)) {
                savedFilterConditions = this.listOfFilters[i].savedfilters;
              }
            }
            savedFilterConditions = JSON.parse(savedFilterConditions.substring(1, savedFilterConditions.length - 1));
            // console.log("\n savedFilterConditions  ===========>>>>>>>>>>    ", savedFilterConditions);

            this.clientID = Number(savedFilterConditions.selectedclientandorg[0].val);
            this.orgSelected = JSON.parse('[' + savedFilterConditions.selectedclientandorg[1].val + ']');
            this.onOrgChange(this.orgSelected, '');
            if (savedFilterConditions.selectedclientandorg.length > 2) {
              this.ticketTypeSelected = String(savedFilterConditions.selectedclientandorg[2].val);
              this.onTicketTypeChange(this.ticketTypeSelected);
            }
            this.frmGroupArr = savedFilterConditions.selectedfilters;
            // console.log('\n this.clientID &&& this.orgSelected   ==============>>>>>>>>>>>>>>>>     ', this.clientID, this.orgSelected, this.ticketTypeSelected);
            // console.log("\n this.frmGroupArr   ================>>>>>>>>>     ", this.frmGroupArr);

            let sortedArray = [];
            this.recordfullresult(this.submittedFormArr, sortedArray);
            // this.getColumnDefintion();
            // this.onFormResetForFavouriteList();

          }


        } else {
          this.filterLoader = true;
        }
      }
    } else {
      this.filterLoader = true;
    }
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
        // this.delRef.close();
        this.modalReference.close();
        this.notifier.notify('success', this.messageService.FILTER_DELETE);
        // this.onHeaderReset();
        this.submittedFormArr = [];
        this.onFromRunFlag = false;
        if (this.listOfFilters.length > 1) {
          this.onFormReset('');
          if (this.listOfFilters[0].id === this.selectedDelID) {
            this.starStep = this.listOfFilters[1].id;
            this.recordfilterlist(this.starStep);
          } else {
            this.starStep = this.listOfFilters[0].id;
            this.recordfilterlist(this.starStep);
          }
        } else {
          // console.log("\n ELSEEEEEEEEEEEEEEEE..........................................");
          this.listOfFilters = [];
          this.dataset = [];
          this.totalData = 0;
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

  toggleClockViews() {
    this.countSelected = 3;
    this.archiveDisplayed = false;
    this.starDisplayed = false;
    this.clockDisplayed = true;
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
    // console.log("\n FILTER SAVED ARRAY  ==================>>>>>>>>>>>>>        \n", this.frmGroupArr);
    // console.log("\n 2222222222222222 ==========   ",this.isValidateFilterCondition);
    if (this.isValidateFilterCondition === true) {
      this.notifier.notify('error', 'Field and condition not met');
    } else {
      // console.log("\n this.frmGroupArr ===>>>>>>>    ", this.frmGroupArr);
      this.submittedFormArr = [];
      this.selectedORarr = [];
      this.selectedANDarr = [];
      let selectedOrganizations;
      let match = false;
      let selectedORG;
      if (Number(this.orgTypeId) === 2) {
        selectedORG = this.orgSelected;
      } else {
        selectedORG = this.orgId;
      }
      if ((selectedORG !== undefined) || (this.ticketTypeSelected !== undefined) || (this.ticketTypeSelected !== '')) {
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
                this.submittedFormArr.push({
                  'field': this.frmGroupArr[0].dropDownSelected1,
                  'op': this.frmGroupArr[0].dropDownSelected2,
                  'val': String(this.messageService.dateConverter(this.frmGroupArr[0].fromDateSelected2, 4)) + ',' + String(this.messageService.dateConverter(this.frmGroupArr[0].toDateSelected1, 4))
                });
              } else {
                if ((this.frmGroupArr[0].isNumericConditionValue === false) && (this.frmGroupArr[0].isConditionValueDropdown === false) && (this.frmGroupArr[0].isConditionValueDropdownMultiSelect === false)) {
                  this.submittedFormArr.push({
                    'field': this.frmGroupArr[0].dropDownSelected1,
                    'op': this.frmGroupArr[0].dropDownSelected2,
                    'val': this.frmGroupArr[0].dropDownSelected3
                  });
                } else if ((this.frmGroupArr[0].isNumericConditionValue === false) && (this.frmGroupArr[0].isConditionValueDropdown === true) && (this.frmGroupArr[0].isConditionValueDropdownMultiSelect === false)) {
                  this.submittedFormArr.push({
                    'field': this.frmGroupArr[0].dropDownSelected1,
                    'op': this.frmGroupArr[0].dropDownSelected2,
                    'val': this.frmGroupArr[0].dropDownSelected5
                  });
                } else if ((this.frmGroupArr[0].isNumericConditionValue === false) && (this.frmGroupArr[0].isConditionValueDropdown === true) && (this.frmGroupArr[0].isConditionValueDropdownMultiSelect === true)) {
                  this.submittedFormArr.push({
                    'field': this.frmGroupArr[0].dropDownSelected1,
                    'op': this.frmGroupArr[0].dropDownSelected2,
                    'val': this.frmGroupArr[0].dropDownSelected6.toString()
                  });
                } else if ((this.frmGroupArr[0].isNumericConditionValue === true) && (this.frmGroupArr[0].isConditionValueDropdown === false) && (this.frmGroupArr[0].isConditionValueDropdownMultiSelect === false)) {
                  this.submittedFormArr.push({
                    'field': this.frmGroupArr[0].dropDownSelected1,
                    'op': this.frmGroupArr[0].dropDownSelected2,
                    'val': String(this.frmGroupArr[0].dropDownSelected4)
                  });
                } else if ((this.frmGroupArr[0].isNumericConditionValue === false) && (this.frmGroupArr[0].isConditionValueDropdown === false) && (this.frmGroupArr[0].isConditionValueDropdownMultiSelect === true)) {
                  this.submittedFormArr.push({
                    'field': this.frmGroupArr[0].dropDownSelected1,
                    'op': this.frmGroupArr[0].dropDownSelected2,
                    'val': this.messageService.dateConverter(this.frmGroupArr[0].dateTimePicker, 4)
                  });
                }
              }
            } else {
              match = true;
              this.notifier.notify('error', this.messageService.ADD_QUERY);
            }
          } else {
            for (let i = 0; i < this.frmGroupArr.length; i++) {
              // console.log("\n this.frmGroupArr.length ============      ", this.frmGroupArr.length, i);
              if (Number(this.frmGroupArr[i].operatorSelected) === 2) {
                if (this.frmGroupArr[i].dropDownSelected2 === 'between') {
                  this.selectedORarr.push({
                    'field': this.frmGroupArr[i].dropDownSelected1,
                    'op': this.frmGroupArr[i].dropDownSelected2,
                    'val': String(this.messageService.dateConverter(this.frmGroupArr[i].fromDateSelected2, 4)) + ',' + String(this.messageService.dateConverter(this.frmGroupArr[i].toDateSelected1, 4))
                  });
                  if (this.frmGroupArr[i + 1]) {
                    // console.log("\n this.frmGroupArr[i + 1] ====>>>>>>>    ", this.frmGroupArr[i + 1]);
                    let index = [];
                    for (var x in this.frmGroupArr[i + 1]) {
                      index.push(x);                                           // build the index
                    }
                    index.sort(function(a, b) {
                      return a == b ? 0 : (a > b ? 1 : -1);                    // sort the index
                    });
                    // console.log("\n obj[index[4]]   ====>>>>>>>>>>  ", this.frmGroupArr[i + 1][index[4]]);
                    if ((this.frmGroupArr[i + 1].dropDownSelected1 === undefined) || (this.frmGroupArr[i + 1].dropDownSelected2 === undefined) || (this.frmGroupArr[i + 1][index[4]] === undefined)) {
                      match = true;
                      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
                      break;
                    } else {
                      if (this.frmGroupArr[i + 1].dropDownSelected2 === 'between') {
                        this.selectedORarr.push({
                          'field': this.frmGroupArr[i + 1].dropDownSelected1,
                          'op': this.frmGroupArr[i + 1].dropDownSelected2,
                          'val': String(this.messageService.dateConverter(this.frmGroupArr[i + 1].fromDateSelected2, 4)) + ',' + String(this.messageService.dateConverter(this.frmGroupArr[i + 1].toDateSelected1, 4))
                        });
                      } else {
                        if ((this.frmGroupArr[i + 1].isNumericConditionValue === false) && (this.frmGroupArr[i + 1].isConditionValueDropdown === false) && (this.frmGroupArr[i + 1].isConditionValueDropdownMultiSelect === false)) {
                          this.selectedORarr.push({
                            'field': this.frmGroupArr[i + 1].dropDownSelected1,
                            'op': this.frmGroupArr[i + 1].dropDownSelected2,
                            'val': this.frmGroupArr[i + 1].dropDownSelected3
                          });
                        } else if ((this.frmGroupArr[i + 1].isNumericConditionValue === false) && (this.frmGroupArr[i + 1].isConditionValueDropdown === true) && (this.frmGroupArr[i + 1].isConditionValueDropdownMultiSelect === false)) {
                          this.selectedORarr.push({
                            'field': this.frmGroupArr[i + 1].dropDownSelected1,
                            'op': this.frmGroupArr[i + 1].dropDownSelected2,
                            'val': this.frmGroupArr[i + 1].dropDownSelected5
                          });
                        } else if ((this.frmGroupArr[i + 1].isNumericConditionValue === false) && (this.frmGroupArr[i + 1].isConditionValueDropdown === true) && (this.frmGroupArr[i + 1].isConditionValueDropdownMultiSelect === true)) {
                          this.selectedORarr.push({
                            'field': this.frmGroupArr[i + 1].dropDownSelected1,
                            'op': this.frmGroupArr[i + 1].dropDownSelected2,
                            'val': this.frmGroupArr[i + 1].dropDownSelected6.toString()
                          });
                        } else if ((this.frmGroupArr[i + 1].isNumericConditionValue === true) && (this.frmGroupArr[i + 1].isConditionValueDropdown === false) && (this.frmGroupArr[i + 1].isConditionValueDropdownMultiSelect === false)) {
                          this.selectedORarr.push({
                            'field': this.frmGroupArr[i + 1].dropDownSelected1,
                            'op': this.frmGroupArr[i + 1].dropDownSelected2,
                            'val': String(this.frmGroupArr[i + 1].dropDownSelected4)
                          });
                        } else if ((this.frmGroupArr[i + 1].isNumericConditionValue === false) && (this.frmGroupArr[i + 1].isConditionValueDropdown === false) && (this.frmGroupArr[i + 1].isConditionValueDropdownMultiSelect === true)) {
                          this.selectedORarr.push({
                            'field': this.frmGroupArr[i + 1].dropDownSelected1,
                            'op': this.frmGroupArr[i + 1].dropDownSelected2,
                            'val': this.messageService.dateConverter(this.frmGroupArr[i + 1].dateTimePicker, 4)
                          });
                        }
                      }
                    }
                  } else {
                    match = true;
                    this.notifier.notify('error', this.messageService.ADD_QUERY);
                    break;
                  }
                } else {
                  if ((this.frmGroupArr[i].isNumericConditionValue === false) && (this.frmGroupArr[i].isConditionValueDropdown === false) && (this.frmGroupArr[i].isConditionValueDropdownMultiSelect === false)) {
                    this.selectedORarr.push({
                      'field': this.frmGroupArr[i].dropDownSelected1,
                      'op': this.frmGroupArr[i].dropDownSelected2,
                      'val': this.frmGroupArr[i].dropDownSelected3
                    });
                  } else if ((this.frmGroupArr[i].isNumericConditionValue === false) && (this.frmGroupArr[i].isConditionValueDropdown === true) && (this.frmGroupArr[i].isConditionValueDropdownMultiSelect === false)) {
                    this.selectedORarr.push({
                      'field': this.frmGroupArr[i].dropDownSelected1,
                      'op': this.frmGroupArr[i].dropDownSelected2,
                      'val': this.frmGroupArr[i].dropDownSelected5
                    });
                  } else if ((this.frmGroupArr[i].isNumericConditionValue === false) && (this.frmGroupArr[i].isConditionValueDropdown === true) && (this.frmGroupArr[i].isConditionValueDropdownMultiSelect === true)) {
                    this.selectedORarr.push({
                      'field': this.frmGroupArr[i].dropDownSelected1,
                      'op': this.frmGroupArr[i].dropDownSelected2,
                      'val': this.frmGroupArr[i].dropDownSelected6.toString()
                    });
                  } else if ((this.frmGroupArr[i].isNumericConditionValue === true) && (this.frmGroupArr[i].isConditionValueDropdown === false) && (this.frmGroupArr[i].isConditionValueDropdownMultiSelect === false)) {
                    this.selectedORarr.push({
                      'field': this.frmGroupArr[i].dropDownSelected1,
                      'op': this.frmGroupArr[i].dropDownSelected2,
                      'val': String(this.frmGroupArr[i].dropDownSelected4)
                    });
                  } else if ((this.frmGroupArr[i].isNumericConditionValue === false) && (this.frmGroupArr[i].isConditionValueDropdown === false) && (this.frmGroupArr[i].isConditionValueDropdownMultiSelect === true)) {
                    this.selectedORarr.push({
                      'field': this.frmGroupArr[i].dropDownSelected1,
                      'op': this.frmGroupArr[i].dropDownSelected2,
                      'val': this.messageService.dateConverter(this.frmGroupArr[i].dateTimePicker, 4)
                    });
                  }
                  if (this.frmGroupArr[i + 1]) {
                    // console.log("\n this.frmGroupArr[i + 1] ====>>>>>>>    ", this.frmGroupArr[i + 1]);
                    let index = [];
                    for (var x in this.frmGroupArr[i + 1]) {
                      index.push(x);                                           // build the index
                    }
                    index.sort(function(a, b) {
                      return a == b ? 0 : (a > b ? 1 : -1);                    // sort the index
                    });
                    // console.log("\n obj[index[4]]   ====>>>>>>>>>>  ", this.frmGroupArr[i + 1][index[4]]);
                    if ((this.frmGroupArr[i + 1].dropDownSelected1 === undefined) || (this.frmGroupArr[i + 1].dropDownSelected2 === undefined) || (this.frmGroupArr[i + 1][index[4]] === undefined)) {
                      match = true;
                      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
                      break;
                    } else {
                      if (this.frmGroupArr[i + 1].dropDownSelected2 === 'between') {
                        this.selectedORarr.push({
                          'field': this.frmGroupArr[i + 1].dropDownSelected1,
                          'op': this.frmGroupArr[i + 1].dropDownSelected2,
                          'val': String(this.messageService.dateConverter(this.frmGroupArr[i + 1].fromDateSelected2, 4)) + ',' + String(this.messageService.dateConverter(this.frmGroupArr[i + 1].toDateSelected1, 4))
                        });
                      } else {
                        if ((this.frmGroupArr[i + 1].isNumericConditionValue === false) && (this.frmGroupArr[i + 1].isConditionValueDropdown === false) && (this.frmGroupArr[i + 1].isConditionValueDropdownMultiSelect === false)) {
                          this.selectedORarr.push({
                            'field': this.frmGroupArr[i + 1].dropDownSelected1,
                            'op': this.frmGroupArr[i + 1].dropDownSelected2,
                            'val': this.frmGroupArr[i + 1].dropDownSelected3
                          });
                        } else if ((this.frmGroupArr[i + 1].isNumericConditionValue === false) && (this.frmGroupArr[i + 1].isConditionValueDropdown === true) && (this.frmGroupArr[i + 1].isConditionValueDropdownMultiSelect === false)) {
                          this.selectedORarr.push({
                            'field': this.frmGroupArr[i + 1].dropDownSelected1,
                            'op': this.frmGroupArr[i + 1].dropDownSelected2,
                            'val': this.frmGroupArr[i + 1].dropDownSelected5
                          });
                        } else if ((this.frmGroupArr[i + 1].isNumericConditionValue === false) && (this.frmGroupArr[i + 1].isConditionValueDropdown === true) && (this.frmGroupArr[i + 1].isConditionValueDropdownMultiSelect === true)) {
                          this.selectedORarr.push({
                            'field': this.frmGroupArr[i + 1].dropDownSelected1,
                            'op': this.frmGroupArr[i + 1].dropDownSelected2,
                            'val': this.frmGroupArr[i + 1].dropDownSelected6.toString()
                          });
                        } else if ((this.frmGroupArr[i + 1].isNumericConditionValue === true) && (this.frmGroupArr[i + 1].isConditionValueDropdown === false) && (this.frmGroupArr[i + 1].isConditionValueDropdownMultiSelect === false)) {
                          this.selectedORarr.push({
                            'field': this.frmGroupArr[i + 1].dropDownSelected1,
                            'op': this.frmGroupArr[i + 1].dropDownSelected2,
                            'val': String(this.frmGroupArr[i + 1].dropDownSelected4)
                          });
                        } else if ((this.frmGroupArr[i + 1].isNumericConditionValue === false) && (this.frmGroupArr[i + 1].isConditionValueDropdown === false) && (this.frmGroupArr[i + 1].isConditionValueDropdownMultiSelect === true)) {
                          this.selectedORarr.push({
                            'field': this.frmGroupArr[i + 1].dropDownSelected1,
                            'op': this.frmGroupArr[i + 1].dropDownSelected2,
                            'val': this.messageService.dateConverter(this.frmGroupArr[i + 1].dateTimePicker, 4)
                          });
                        }
                      }
                    }
                  } else {
                    match = true;
                    this.notifier.notify('error', this.messageService.ADD_QUERY);
                    break;
                  }
                }

              } else if (Number(this.frmGroupArr[i].operatorSelected) === 1) {
                // console.log("\n AND OPERATOR....................................");
                if (this.frmGroupArr[i].dropDownSelected2 === 'between') {
                  this.selectedANDarr.push({
                    'field': this.frmGroupArr[i].dropDownSelected1,
                    'op': this.frmGroupArr[i].dropDownSelected2,
                    'val': String(this.messageService.dateConverter(this.frmGroupArr[i].fromDateSelected2, 4)) + ',' + String(this.messageService.dateConverter(this.frmGroupArr[i].toDateSelected1, 4))
                  });
                  if (this.frmGroupArr[i + 1]) {
                    // console.log("\n this.frmGroupArr[i + 1] ====>>>>>>>    ", this.frmGroupArr[i + 1]);
                    let index = [];
                    for (var x in this.frmGroupArr[i + 1]) {
                      index.push(x);                                           // build the index
                    }
                    index.sort(function(a, b) {
                      return a == b ? 0 : (a > b ? 1 : -1);                    // sort the index
                    });
                    // console.log("\n obj[index[4]]   ====>>>>>>>>>>  ", this.frmGroupArr[i + 1][index[4]]);
                    if ((this.frmGroupArr[i + 1].dropDownSelected1 === undefined) || (this.frmGroupArr[i + 1].dropDownSelected2 === undefined) || (this.frmGroupArr[i + 1][index[4]] === undefined)) {
                      match = true;
                      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
                      break;
                    } else {
                      if (this.frmGroupArr[i + 1].dropDownSelected2 === 'between') {
                        this.selectedANDarr.push({
                          'field': this.frmGroupArr[i + 1].dropDownSelected1,
                          'op': this.frmGroupArr[i + 1].dropDownSelected2,
                          'val': String(this.messageService.dateConverter(this.frmGroupArr[i + 1].fromDateSelected2, 4)) + ',' + String(this.messageService.dateConverter(this.frmGroupArr[i + 1].toDateSelected1, 4))
                        });
                      } else {
                        if ((this.frmGroupArr[i + 1].isNumericConditionValue === false) && (this.frmGroupArr[i + 1].isConditionValueDropdown === false) && (this.frmGroupArr[i + 1].isConditionValueDropdownMultiSelect === false)) {
                          this.selectedANDarr.push({
                            'field': this.frmGroupArr[i + 1].dropDownSelected1,
                            'op': this.frmGroupArr[i + 1].dropDownSelected2,
                            'val': this.frmGroupArr[i + 1].dropDownSelected3
                          });
                        } else if ((this.frmGroupArr[i + 1].isNumericConditionValue === false) && (this.frmGroupArr[i + 1].isConditionValueDropdown === true) && (this.frmGroupArr[i + 1].isConditionValueDropdownMultiSelect === false)) {
                          this.selectedANDarr.push({
                            'field': this.frmGroupArr[i + 1].dropDownSelected1,
                            'op': this.frmGroupArr[i + 1].dropDownSelected2,
                            'val': this.frmGroupArr[i + 1].dropDownSelected5
                          });
                        } else if ((this.frmGroupArr[i + 1].isNumericConditionValue === false) && (this.frmGroupArr[i + 1].isConditionValueDropdown === true) && (this.frmGroupArr[i + 1].isConditionValueDropdownMultiSelect === true)) {
                          this.selectedANDarr.push({
                            'field': this.frmGroupArr[i + 1].dropDownSelected1,
                            'op': this.frmGroupArr[i + 1].dropDownSelected2,
                            'val': this.frmGroupArr[i + 1].dropDownSelected6.toString()
                          });
                        } else if ((this.frmGroupArr[i + 1].isNumericConditionValue === true) && (this.frmGroupArr[i + 1].isConditionValueDropdown === false) && (this.frmGroupArr[i + 1].isConditionValueDropdownMultiSelect === false)) {
                          this.selectedANDarr.push({
                            'field': this.frmGroupArr[i + 1].dropDownSelected1,
                            'op': this.frmGroupArr[i + 1].dropDownSelected2,
                            'val': String(this.frmGroupArr[i + 1].dropDownSelected4)
                          });
                        } else if ((this.frmGroupArr[i + 1].isNumericConditionValue === false) && (this.frmGroupArr[i + 1].isConditionValueDropdown === false) && (this.frmGroupArr[i + 1].isConditionValueDropdownMultiSelect === true)) {
                          this.selectedANDarr.push({
                            'field': this.frmGroupArr[i + 1].dropDownSelected1,
                            'op': this.frmGroupArr[i + 1].dropDownSelected2,
                            'val': this.messageService.dateConverter(this.frmGroupArr[i + 1].dateTimePicker, 4)
                          });
                        }
                      }
                    }
                  } else {
                    match = true;
                    this.notifier.notify('error', this.messageService.ADD_QUERY);
                    break;
                  }
                } else {
                  // console.log("\n NOT BETWEEN....................................");
                  if ((this.frmGroupArr[i].isNumericConditionValue === false) && (this.frmGroupArr[i].isConditionValueDropdown === false) && (this.frmGroupArr[i].isConditionValueDropdownMultiSelect === false)) {
                    this.selectedANDarr.push({
                      'field': this.frmGroupArr[i].dropDownSelected1,
                      'op': this.frmGroupArr[i].dropDownSelected2,
                      'val': this.frmGroupArr[i].dropDownSelected3
                    });
                  } else if ((this.frmGroupArr[i].isNumericConditionValue === false) && (this.frmGroupArr[i].isConditionValueDropdown === true) && (this.frmGroupArr[i].isConditionValueDropdownMultiSelect === false)) {
                    this.selectedANDarr.push({
                      'field': this.frmGroupArr[i].dropDownSelected1,
                      'op': this.frmGroupArr[i].dropDownSelected2,
                      'val': this.frmGroupArr[i].dropDownSelected5
                    });
                  } else if ((this.frmGroupArr[i].isNumericConditionValue === false) && (this.frmGroupArr[i].isConditionValueDropdown === true) && (this.frmGroupArr[i].isConditionValueDropdownMultiSelect === true)) {
                    this.selectedANDarr.push({
                      'field': this.frmGroupArr[i].dropDownSelected1,
                      'op': this.frmGroupArr[i].dropDownSelected2,
                      'val': this.frmGroupArr[i].dropDownSelected6.toString()
                    });
                  } else if ((this.frmGroupArr[i].isNumericConditionValue === true) && (this.frmGroupArr[i].isConditionValueDropdown === false) && (this.frmGroupArr[i].isConditionValueDropdownMultiSelect === false)) {
                    this.selectedANDarr.push({
                      'field': this.frmGroupArr[i].dropDownSelected1,
                      'op': this.frmGroupArr[i].dropDownSelected2,
                      'val': String(this.frmGroupArr[i].dropDownSelected4)
                    });
                  } else if ((this.frmGroupArr[i].isNumericConditionValue === false) && (this.frmGroupArr[i].isConditionValueDropdown === false) && (this.frmGroupArr[i].isConditionValueDropdownMultiSelect === true)) {
                    this.selectedANDarr.push({
                      'field': this.frmGroupArr[i].dropDownSelected1,
                      'op': this.frmGroupArr[i].dropDownSelected2,
                      'val': this.messageService.dateConverter(this.frmGroupArr[i].dateTimePicker, 4)
                    });
                  }
                  if (this.frmGroupArr[i + 1]) {
                    // console.log("\n this.frmGroupArr[i + 1] ====>>>>>>>    ", this.frmGroupArr[i + 1]);
                    let index = [];
                    for (var x in this.frmGroupArr[i + 1]) {
                      index.push(x);                                           // build the index
                    }
                    index.sort(function(a, b) {
                      return a == b ? 0 : (a > b ? 1 : -1);                    // sort the index
                    });
                    // console.log("\n obj[index[4]]   ====>>>>>>>>>>  ", this.frmGroupArr[i + 1][index[4]]);
                    if ((this.frmGroupArr[i + 1].dropDownSelected1 === undefined) || (this.frmGroupArr[i + 1].dropDownSelected2 === undefined) || (this.frmGroupArr[i + 1][index[4]] === undefined)) {
                      match = true;
                      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
                      break;
                    } else {
                      if (this.frmGroupArr[i + 1].dropDownSelected2 === 'between') {
                        this.selectedANDarr.push({
                          'field': this.frmGroupArr[i + 1].dropDownSelected1,
                          'op': this.frmGroupArr[i + 1].dropDownSelected2,
                          'val': String(this.messageService.dateConverter(this.frmGroupArr[i + 1].fromDateSelected2, 4)) + ',' + String(this.messageService.dateConverter(this.frmGroupArr[i + 1].toDateSelected1, 4))
                        });
                      } else {
                        if ((this.frmGroupArr[i + 1].isNumericConditionValue === false) && (this.frmGroupArr[i + 1].isConditionValueDropdown === false) && (this.frmGroupArr[i + 1].isConditionValueDropdownMultiSelect === false)) {
                          this.selectedANDarr.push({
                            'field': this.frmGroupArr[i + 1].dropDownSelected1,
                            'op': this.frmGroupArr[i + 1].dropDownSelected2,
                            'val': this.frmGroupArr[i + 1].dropDownSelected3
                          });
                        } else if ((this.frmGroupArr[i + 1].isNumericConditionValue === false) && (this.frmGroupArr[i + 1].isConditionValueDropdown === true) && (this.frmGroupArr[i + 1].isConditionValueDropdownMultiSelect === false)) {
                          this.selectedANDarr.push({
                            'field': this.frmGroupArr[i + 1].dropDownSelected1,
                            'op': this.frmGroupArr[i + 1].dropDownSelected2,
                            'val': this.frmGroupArr[i + 1].dropDownSelected5
                          });
                        } else if ((this.frmGroupArr[i + 1].isNumericConditionValue === false) && (this.frmGroupArr[i + 1].isConditionValueDropdown === true) && (this.frmGroupArr[i + 1].isConditionValueDropdownMultiSelect === true)) {
                          this.selectedANDarr.push({
                            'field': this.frmGroupArr[i + 1].dropDownSelected1,
                            'op': this.frmGroupArr[i + 1].dropDownSelected2,
                            'val': this.frmGroupArr[i + 1].dropDownSelected6.toString()
                          });
                        } else if ((this.frmGroupArr[i + 1].isNumericConditionValue === true) && (this.frmGroupArr[i + 1].isConditionValueDropdown === false) && (this.frmGroupArr[i + 1].isConditionValueDropdownMultiSelect === false)) {
                          this.selectedANDarr.push({
                            'field': this.frmGroupArr[i + 1].dropDownSelected1,
                            'op': this.frmGroupArr[i + 1].dropDownSelected2,
                            'val': String(this.frmGroupArr[i + 1].dropDownSelected4)
                          });
                        } else if ((this.frmGroupArr[i + 1].isNumericConditionValue === false) && (this.frmGroupArr[i + 1].isConditionValueDropdown === false) && (this.frmGroupArr[i + 1].isConditionValueDropdownMultiSelect === true)) {
                          this.selectedANDarr.push({
                            'field': this.frmGroupArr[i + 1].dropDownSelected1,
                            'op': this.frmGroupArr[i + 1].dropDownSelected2,
                            'val': this.messageService.dateConverter(this.frmGroupArr[i + 1].dateTimePicker, 4)
                          });
                        }
                      }
                    }
                  } else {
                    match = true;
                    this.notifier.notify('error', this.messageService.ADD_QUERY);
                    break;
                  }
                }
              } else if (Number(this.frmGroupArr[i].operatorSelected) === 0) {
                if (i === (this.frmGroupArr.length - 1)) {
                  match = false;
                } else {
                  match = true;
                  this.notifier.notify('error', this.messageService.MISSING_OPERATOR);
                }
              }

            }

          }
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

          let newSelectedANDQueryArray = new Map();
          this.selectedANDarr.forEach(function(item) {
            newSelectedANDQueryArray.set(JSON.stringify(item), item);
          });
          this.selectedFinalANDQueryArray = [];
          this.selectedFinalANDQueryArray = [...newSelectedANDQueryArray.values()];

          if (this.selectedFinalANDQueryArray.length > 0) {
            for (let i = 0; i < this.selectedFinalANDQueryArray.length; i++) {
              this.submittedFormArr.push({
                'field': this.selectedFinalANDQueryArray[i].field,
                'op': this.selectedFinalANDQueryArray[i].op,
                'val': this.selectedFinalANDQueryArray[i].val
              });
            }
          }
          // console.log("\n this.submittedFormArr   ==============>>>>>>>>>>>>>>>>>>>      ", this.submittedFormArr);
          for (let i = 2; i < this.submittedFormArr.length; i++) {
            if ((this.submittedFormArr[i].field === undefined) || (this.submittedFormArr[i].op === undefined) || (this.submittedFormArr[i].val === undefined) || (this.submittedFormArr[i].val === '')) {
              match = true;
              // console.log("\n BLANK_ERROR_MESSAGE....................................");
              this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
              break;
            }
          }
          if (match === false) {
            // console.log("\n SUBMITTED ARRAY   ====---------------->>>>>>>>>>>>>>>>>     \n ", this.submittedFormArr);
            if (type === 'run') {
              let sortedArray = [];
              this.onFromRunFlag = true;
              this.recordfullresult(this.submittedFormArr, sortedArray);
            } else if (type === 'saveas') {
              this.onFromRunFlag = true;
              this.modalReference = this.modalService.open(this.savedFilterName, {});
              this.modalReference.result.then((result) => {
              }, (reason) => {

              });
            } else if (type === 'update') {
              this.onFromRunFlag = true;
              this.modalReference = this.modalService.open(this.updateFilterName, {});
              this.modalReference.result.then((result) => {
              }, (reason) => {

              });
            }
          }
        }
      } else {
        this.notifier.notify('error', this.messageService.SELECT_ORG);
      }

    }
  }


  recordfullresult(searchedData, sortedData) {
    // console.log('\n searchedData ====   ', searchedData);
    // console.log("\n this.submittedFormArr =====>>>>>>>   ", this.submittedFormArr);
    // this.isArchieveFolder = false;

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

    let statusReasonArray = [];
    let visiblecommentsArray = [];

    const data = {
      'where': searchedData,
      'headers': this.margeHeaderArr,
      'limit': this.itemsPerPage,
      'offset': offset
    };
    if (this.isDisplayFlag === false) {
      data['order'] = sortedData;
    }
    this.dataLoaded = false;
    this.rest.recordfullresult(data).subscribe((res: any) => {
      if (res.success) {
        this.dataLoaded = true;
        if (this.isDisplayFlag === true) {
          this.displayTicket(res, offset, paginationType, 'recordfullresult');
        } else {
          this.respObject = res.details;
          const data1 = res.details.result;
          if (data1.length > 0) {
            this.categoriesLength = data1[0].categories.length;
            for (let i = 0; i < data1.length; i++) {
              for (let j = 0; j < data1[i].categories.length; j++) {
                data1[i][data1[i].categories[j].lable] = data1[i].categories[j].name;
              }
              delete data1[i].categories;
            }

            for (let i = 0; i < data1.length; i++) {
              if (data1[i].statusreson.length > 0) {
                for (let j = 0; j < data1[i].statusreson.length; j++) {
                  statusReasonArray.push(data1[i].statusreson[j].termname + ' : ' + data1[i].statusreson[j].recordtrackvalue);
                }

                data1[i]['statusreason'] = statusReasonArray.toString();
              }
              delete data1[i].statusreson;
            }

            for (let i = 0; i < data1.length; i++) {
              if (data1[i].visiblecomment.length > 0) {
                for (let j = 0; j < data1[i].visiblecomment.length; j++) {
                  visiblecommentsArray.push(data1[i].visiblecomment[j].Comment + ' : ' + data1[i].visiblecomment[j].Createdate);
                }

                data1[i]['visiblecomments'] = visiblecommentsArray.toString();
              }
              delete data1[i].visiblecomment;
            }

          }
          this.totalData = res.details.total;
          this.dataset = data1;
          // console.log("\n  this.dataset   ::::::::::::  =========   >>>>>>>>>>>>>>>       ", this.dataset);
          this.dataLoaded = true;
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
    for (let i = 0; i < 3; i++) {
      selectedClirntandOrg.push(this.submittedFormArr[i]);
    }
    let storeFiltersAndClientOrg = {'selectedclientandorg': selectedClirntandOrg, 'selectedfilters': this.frmGroupArr};
    let savedFilters = '\'' + JSON.stringify(storeFiltersAndClientOrg) + '\'';
    // console.log("\n savedFilters in String   ============>>>>>>>>>   ", savedFilters);
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
        'headers': this.margeHeaderArr,
        'offset': offset,
        'limit': this.itemsPerPage
      },
      'savedfilters': savedFilters,
    };
    this.rest.recordfilteradd(data).subscribe((res: any) => {
      if (res.success) {
        // this.isFilterSaved = true;
        this.dataLoaded = true;
        this.filteredName = '';
        // this.ticketTypeSelected = '';
        this.countSelected = 2;
        this.archiveDisplayed = false;
        this.starDisplayed = true;
        this.clockDisplayed = false;
        this.step = undefined;
        // this.submittedFormArr = [];
        // this.onFormReset();
        // this.onHeaderReset();
        // this.infoRef.close();
        this.recordfilterlist(this.starStep);
        this.modalReference.close();
        // this.clickedStarFilter(this.starStep);
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

  // updateFilter(){
  //   this.onFromRunFlag = true;
  //   this.infoRef = this.dialog.open(this.updateFilterName, {
  //     width: '400px', height: '140px'
  //   });
  // }

  updateInfo() {
    this.dataLoaded = false;
    let offset;
    if (this.pageSizes === undefined) {
      offset = 0;
    } else {
      offset = this.pageSizes;
    }
    let selectedClirntandOrg = [];
    for (let i = 0; i < 3; i++) {
      selectedClirntandOrg.push(this.submittedFormArr[i]);
    }
    let storeFiltersAndClientOrg = {'selectedclientandorg': selectedClirntandOrg, 'selectedfilters': this.frmGroupArr};
    let savedFilters = '\'' + JSON.stringify(storeFiltersAndClientOrg) + '\'';
    // console.log("\n savedFilters in String   ============>>>>>>>>>   ", savedFilters);
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
        'headers': this.margeHeaderArr,
        'offset': offset,
        'limit': this.itemsPerPage
      },
      'savedfilters': savedFilters,
    };
    this.rest.recordfilterupdate(data).subscribe((res: any) => {
      if (res.success) {
        this.dataLoaded = true;
        // this.filteredNameUpdate = '';
        this.countSelected = 2;
        this.archiveDisplayed = false;
        this.starDisplayed = true;
        this.clockDisplayed = false;
        // this.step = undefined;
        // this.submittedFormArr = [];
        // this.ticketTypeSelected = '';
        // this.onFormReset();
        this.recordfilterlist(this.starStep);
        this.modalReference.close();
        // this.onHeaderReset();
        // this.isFilterSaved = true;
        // this.infoRef.close();
        // this.clickedStarFilter(this.starStep);
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

  // fromDateChange(date){
  //   console.log(date)
  // }

  getCustomApiCall(odataQuery) {
    this.filterAddedPaginationData = [];
    this.concatFilterAndSearchArray = [];
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
        sortArr1 = newStr.split(',');
        for (let i = 0; i < sortArr1.length; i++) {
          Array1[i] = sortArr1[i].split(' ');
          jsonSortedArray.push({
            'field': String(Array1[i][0]).replace('%20', ' ').toLowerCase(),
            'dir': String(Array1[i][1]).toUpperCase()
          });
        }
        let searchedData = [];
        if (this.onFromRunFlag === false) {
          if ((this.step !== undefined) && (this.starStep === undefined)) {
            this.recordgridresult(searchedData, jsonSortedArray);
          } else if ((this.step === undefined) && (this.starStep !== undefined)) {
            for (let i = 0; i < this.submittedFormArr.length; i++) {
              searchedData.push(this.submittedFormArr[i]);
            }
            this.filterAddedPaginationData = searchedData;
            this.recordfullresult(searchedData, jsonSortedArray);
          }
        } else {
          this.concatFilterAndSearchArray = this.submittedFormArr.concat(searchedData);
          this.recordfullresult(this.concatFilterAndSearchArray, jsonSortedArray);
        }

      }
    } else if (odataQuery === '$top=25') {
      if (this.clientId !== undefined && this.orgId !== undefined && this.typSelected !== undefined) {
        let searchedData = [];
        let sortedData = [];
        if (this.onFromRunFlag === false) {
          if ((this.step !== undefined) && (this.starStep === undefined)) {
            this.recordgridresult(searchedData, sortedData);
          } else if ((this.step === undefined) && (this.starStep !== undefined)) {
            for (let i = 0; i < this.submittedFormArr.length; i++) {
              searchedData.push(this.submittedFormArr[i]);
            }
            this.filterAddedPaginationData = searchedData;
            this.recordfullresult(searchedData, sortedData);
          }
        } else {
          this.concatFilterAndSearchArray = this.submittedFormArr.concat(searchedData);
          this.recordfullresult(this.concatFilterAndSearchArray, sortedData);
        }
      }
    } else {
      let newStr = odataQuery.split('$top=25&$filter=(substringof').pop();
      let newString = newStr.slice(0, -1);
      let newSubString = newString.replace(/and substringof/g, '');
      this.callFunction(newSubString);
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
    Arr = str2.split(') (');
    for (let i = 0; i < Arr.length; i++) {
      Array2[i] = Arr[i].split(', ');
      Array2[i][0] = Array2[i][0].replace(/%20/g, ' ').replace(/%3A/g, ':');
      // console.log("\n Array2 ====  ", Array2[i]);
      dataArray.push({
        'field': String(Array2[i][1]).replace('%20', ' ').toLowerCase(),
        'op': 'like',
        'val': Array2[i][0].replace(/'/g, '')
      });
    }
    if (dataArray[0].field !== undefined) {
      let sortedData = [];
      if (this.onFromRunFlag === false) {
        if ((this.step !== undefined) && (this.starStep === undefined)) {
          this.recordgridresult(dataArray, sortedData);
        } else if ((this.step === undefined) && (this.starStep !== undefined)) {
          for (let i = 0; i < this.submittedFormArr.length; i++) {
            dataArray.push(this.submittedFormArr[i]);
          }
          this.filterAddedPaginationData = dataArray;
          this.recordfullresult(dataArray, sortedData);
        }
      } else {
        this.concatFilterAndSearchArray = this.submittedFormArr.concat(dataArray);
        this.recordfullresult(this.concatFilterAndSearchArray, sortedData);
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
    if (this.onFromRunFlag === false) {
      if ((this.step !== undefined) && (this.starStep === undefined)) {
        this.recordgridresult(jsonSearchedArray, jsonSortedArray);
      } else if ((this.step === undefined) && (this.starStep !== undefined)) {
        for (let i = 0; i < this.submittedFormArr.length; i++) {
          jsonSearchedArray.push(this.submittedFormArr[i]);
        }
        this.filterAddedPaginationData = jsonSearchedArray;
        this.recordfullresult(jsonSearchedArray, jsonSortedArray);
      }
    } else {
      this.concatFilterAndSearchArray = this.submittedFormArr.concat(jsonSearchedArray);
      this.recordfullresult(this.concatFilterAndSearchArray, jsonSortedArray);
    }

  }

  recordgridresult(searchedData, sortedData) {
    // this.isArchieveFolder = true;
    this.filterLoader = false;
    let offset;
    if (this.pageSizes === undefined) {
      offset = 0;
    } else {
      offset = this.pageSizes;
    }
    let savedWorkflowSupportGroup;
    if (this.hascatalog === 'Y') {
      this.selectedOrgVals = this.orgId + '';
      savedWorkflowSupportGroup = this.userGroupId + '';
    } else {
      this.selectedOrgVals = this.messageService.getOrgs();
      savedWorkflowSupportGroup = this.messageService.getWorkflowSupportGroups();
    }
    this.savedWorkFlowSGroup = '';
    this.savedWorkFlowSGroup = savedWorkflowSupportGroup;
    const paginationType = undefined;
    // console.log("\n this.selectedOrgVals ====  >>>>>>    ", this.selectedOrgVals);


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


    let statusReasonArray = [];
    let visiblecommentsArray = [];

    const data = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': Number(this.orgId),
      'searchmstorgnhirarchyid': this.selectedOrgVals,
      // 'recorddiffid': this.typSelected,
      // 'recorddiffidseq': this.typeSeq,
      'menuid': this.folderClicked,
      'querytype': 2,
      'supportgrpid': savedWorkflowSupportGroup,
      'where': searchedData,
      'order': sortedData,
      'headers': this.margeHeaderArr,
      'limit': this.itemsPerPage,
      'offset': offset
    };
    if (this.hascatalog === 'Y') {
      data['iscatalog'] = 1;
    } else {
      data['iscatalog'] = 0;
      data['recorddiffidseq'] = this.typeSeq;
      data['recorddiffid'] = Number(this.typSelected);
    }
    this.rest.recordgridresult(data).subscribe((res: any) => {
      if (res.success) {
        this.isTypeChange = false;
        if (this.isDisplayFlag === true) {
          // this.selectedGridColumns = [];
          this.displayTicket(res, offset, paginationType, '');
          this.getColumnDefintion();
        } else {
          this.filterLoader = true;
          this.respObject = res.details;
          const data1 = res.details.result;
          if (data1.length > 0) {
            this.categoriesLength = data1[0].categories.length;
            for (let i = 0; i < data1.length; i++) {
              for (let j = 0; j < data1[i].categories.length; j++) {
                data1[i][data1[i].categories[j].lable] = data1[i].categories[j].name;
              }
              delete data1[i].categories;
            }

            // for(let i=0;i<data1.length;i++){
            //   if(data1[i].statusreson.length > 0){
            //     for(let j=0;j<data1[i].statusreson.length;j++){
            //       statusReasonArray.push(data1[i].statusreson[j].termname + ' : ' + data1[i].statusreson[j].recordtrackvalue);
            //     }

            //     data1[i]['statusreason'] = statusReasonArray.toString();
            //   }
            //   delete data1[i].statusreson;
            // }

            // for(let i=0;i<data1.length;i++){
            //   if(data1[i].visiblecomment.length > 0){
            //     for(let j=0;j<data1[i].visiblecomment.length;j++){
            //       visiblecommentsArray.push(data1[i].visiblecomment[j].Comment + ' : ' + data1[i].visiblecomment[j].Createdate);
            //     }

            //     data1[i]['visiblecomments'] = visiblecommentsArray.toString();
            //   }
            //   delete data1[i].visiblecomment;
            // }

          }
          this.totalData = res.details.total;
          this.dataset = data1;
          return this.respObject;
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


  ontypeChange(selectedButton: any) {
    let parentType;
    let seq;
    let ticketid;
    this.isTypeChange = true;
    for (let i = 0; i < this.ticketsTyp.length; i++) {
      if (Number(this.typSelected) === this.ticketsTyp[i].id) {
        parentType = this.ticketsTyp[i].typeid;
        seq = this.ticketsTyp[i].seqno;
        ticketid = this.ticketsTyp[i].id;
        this.typeSeq = seq;
        this.messageService.saveMenuData({
          type: ticketid,
          seq: seq,
        });
        this.ticketTypeArr = {id: parentType, val: this.typSelected};
        this.getColumnDefintion();
        this.gettilesnames();
      }
    }
    // this.onFormReset();
    // this.onHeaderReset();
    // console.log("\n this.sources  ============   ", this.sources);
  }

  clickedFilter(fid: any) {
    this.starStep = undefined;
    this.messageService.saveTile(fid);
    this.step = fid;
    this.onFromRunFlag = false;
    this.selectedGridColumns = [];
    this.editedGridHeaderNames = [];
    this.gridHeaderNames = [
      {'id': 0, 'value': 'Customer', 'field': 'levelonecatename'},
      {'id': 1, 'value': 'Ticket ID', 'field': 'ticketid'},
      {'id': 2, 'value': 'Source', 'field': 'source'},
      {'id': 3, 'value': 'Requester Name', 'field': 'requestorname'},
      {'id': 4, 'value': 'Requester Location/Branch', 'field': 'requestorlocation'},
      {'id': 5, 'value': 'Requester Primary Contact (Phone/Mobile) Number', 'field': 'requestorphone'},
      {'id': 6, 'value': 'Requester Email ID', 'field': 'requestoremail'},
      {'id': 7, 'value': 'Original Created By Name', 'field': 'orgcreatorname'},
      {'id': 8, 'value': 'Original Created By Location', 'field': 'orgcreatorlocation'},
      {'id': 9, 'value': 'Original Created By Primary Contact (Phone/Mobile) Number', 'field': 'orgcreatorphone'},
      {'id': 10, 'value': 'Original Created By Email ID', 'field': 'orgcreatoremail'},
      {'id': 11, 'value': 'Short Description', 'field': 'shortdescription'},
      {'id': 12, 'value': 'Priority', 'field': 'priority'},
      {'id': 13, 'value': 'Status', 'field': 'status'},
      {'id': 46, 'value': 'Ticket Type', 'field': 'tickettype'},
      {'id': 53, 'value': 'Vendor Name', 'field': 'vendorname'},
      {'id': 54, 'value': 'Vendor Ticket Id', 'field': 'vendorticketid'},
      {'id': 55, 'value': 'Resolution Code', 'field': 'resolutioncode'},
      {'id': 56, 'value': 'Resolution Comment', 'field': 'resolutioncomment'},
      {'id': 57, 'value': 'Last Update By', 'field': 'lastuser'},
      {'id': 58, 'value': 'Resolved Date', 'field': 'latestresodatetime'},
      {'id': 59, 'value': 'Duration in Pending Vendor State', 'field': 'followuptimetaken'},
      {'id': 60, 'value': 'Pending Vendor Count', 'field': 'pendingvendorcount'},
      {'id': 217, 'value': 'Status Reason', 'field': 'statusreason'},
      {'id': 218, 'value': 'Visible Comment', 'field': 'visiblecomments'},
      {'id': 49, 'value': 'Priority Change Count', 'field': 'prioritycount'},
      {'id': 50, 'value': 'Response Time', 'field': 'responsetime'},
      {'id': 51, 'value': 'Resolution Time', 'field': 'resolutiontime'},
      {'id': 52, 'value': 'Pending User Count', 'field': 'pendingusercount'},
      {'id': 14, 'value': 'VIP Ticket (Yes/No)', 'field': 'vipticket'},
      {'id': 15, 'value': 'Assigned Group (Last assigned Resolver Group)', 'field': 'assignedgroup'},
      {'id': 16, 'value': 'Assigned User (Last assigned  user from the Resolver Group)', 'field': 'assigneduser'},
      {'id': 17, 'value': 'Resolved By Group (Last assigned Resolver Group who has resolved the ticket)', 'field': 'resogroup'},
      {
        'id': 18,
        'value': 'Resolved By User (Last assigned  user from the Resolver Group who has resolved the ticket)',
        'field': 'resolveduser'
      },
      {'id': 19, 'value': 'Created Since', 'field': 'createddatetime'},
      {'id': 20, 'value': 'Last Modified Date/Time', 'field': 'lastupdateddatetime'},
      // {'id': 21, 'value': 'Last Modified By User', 'field': 'lastuser'},
      // {'id': 22, 'value': 'CTIS L1', 'field': '' },
      // {'id': 23, 'value': 'CTIS L2', 'field': '' },
      // {'id': 24, 'value': 'CTIS L3', 'field': '' },
      // {'id': 25, 'value': 'CTIS L4', 'field': '' },
      // {'id': 26, 'value': 'CTIS L5', 'field': '' },
      {'id': 27, 'value': 'Urgency', 'field': 'urgency'},
      {'id': 28, 'value': 'Impact', 'field': 'impact'},
      {'id': 29, 'value': 'Due Date', 'field': 'resosladuedatetime'},
      // {'id': 30, 'value': 'Response SLA Breached Status', 'field': 'respslabreachstatus'},
      // {'id': 31, 'value': 'Resolution SLA Breached Status', 'field': 'resolslabreachstatus'},
      // {'id': 32, 'value': 'Response SLA Overdue', 'field': 'respoverduetime'},
      // {'id': 33, 'value': 'Resolution SLA Overdue', 'field': 'resooverduetime'},
      // {'id': 34, 'value': 'Aging in Days (Calendar days from created date)', 'field': 'calendaraging'},
      {'id': 35, 'value': 'Not Updated Since', 'field': 'worknotenotupdated'},
      {'id': 36, 'value': 'Reopen Count', 'field': 'reopencount'},
      {'id': 37, 'value': 'Reassignment Hop Count', 'field': 'reassigncount'},
      {'id': 38, 'value': 'Category Change Count', 'field': 'categorychangecount'},
      {'id': 39, 'value': 'User Follow Up', 'field': 'followupcount'},
      {'id': 40, 'value': 'Outbound Count', 'field': 'outboundcount'},
      // {'id': 41, 'value': 'IsParent (Yes/No)', 'field': 'isparent'},
      {'id': 42, 'value': 'Child Count (if parent)', 'field': 'childcount'},
      {'id': 43, 'value': 'Response Clock Status (Running/Stopped)', 'field': 'respclockstatus'},
      {'id': 44, 'value': 'Resolution Clock Status (Running/Stopped/Paused)', 'field': 'resoclockstatus'},
      // {'id': 45, 'value': 'SLA Meter Search by number %', 'field': 'responseslameterpercentage'}
    ];
    for (let i = 0; i < this.defaultGridHeader1.length; i++) {
      for (let j = 0; j < this.gridHeaderNames.length; j++) {
        if (String(this.defaultGridHeader1[i].field) === String(this.gridHeaderNames[j].field)) {
          this.selectedGridColumns.push({
            'id': this.gridHeaderNames[j].id,
            'field': this.gridHeaderNames[j].field,
            'value': this.gridHeaderNames[j].value
          });
        }
      }
    }
    if (this.grpLevel > 1) {
      for (let i = 0; i < this.defaultGridHeader2.length; i++) {
        for (let j = 0; j < this.gridHeaderNames.length; j++) {
          if (String(this.defaultGridHeader2[i].field) === String(this.gridHeaderNames[j].field)) {
            this.selectedGridColumns.push({
              'id': this.gridHeaderNames[j].id,
              'field': this.gridHeaderNames[j].field,
              'value': this.gridHeaderNames[j].value
            });
          }
        }
      }
    }

    // this.getLabelByDiffSeq("archieve");

    const data = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': Number(this.orgId),
      'fromrecorddifftypeid': this.TICKET_TYPE_ID,
      'fromrecorddiffid': this.typSelected,
      'seqno': 0
    };
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
            'value': e.typename
          });
        });
      } else {
        this.dataLoaded = true;
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.dataLoaded = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
    // console.log("\n this.selectedGridColumns   ============>>>>>>>>>>>>       ", this.selectedGridColumns);

    this.eventData = this.selectedGridColumns;
    this.editedGridHeaderNames = this.gridHeaderNames.filter(entryValues1 => !this.selectedGridColumns.some(entryValues2 => entryValues1.field === entryValues2.field));
    // console.log("\n this.editedGridHeaderNames  ======>>>>>>>>>>>>   ", this.editedGridHeaderNames);

    this.onFormReset('');
    this.folderClick(fid);

  }

  folderClick(value) {
    if (this.isTypeChange === true) {
      if (this.menus.length > 0) {
        this.folderClicked = this.menus[0].diffid;
      }
    } else {
      this.folderClicked = value;
    }
    this.viewTicketList(value, {'offset': 0, 'limit': this.itemsPerPage});
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
          // console.log("\n this.folderClicked ====>>>>>>>   ", this.folderClicked);
          this.recordgridresult(searchedData, sortedData);
        }

      } else if ((this.step === undefined) && (this.starStep !== undefined)) {
        const sortedData = [];
        this.isDisplayFlag = true;
        this.recordfullresult(this.filterAddedPaginationData, sortedData);
      }

    } else {
      let sortedArray = [];
      if (this.concatFilterAndSearchArray.length > 0) {
        this.recordfullresult(this.concatFilterAndSearchArray, sortedArray);
      } else {
        this.recordfullresult(this.submittedFormArr, sortedArray);
      }
    }

  }

  displayTicket(res, offset, paginationType, type) {
    this.filterLoader = true;
    this.isDisplayFlag = false;
    this.categoriesLength = 0;
    this.dataset = [];
    let statusReasonArray = [];
    let visiblecommentsArray = [];
    if (res.success) {
      const data = res.details.result;
      if (data.length > 0) {
        this.categoriesLength = data[0].categories.length;
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].categories.length; j++) {
            data[i][data[i].categories[j].lable] = data[i].categories[j].name;
          }
          delete data[i].categories;
        }

        if (type === 'recordfullresult') {
          for (let i = 0; i < data.length; i++) {
            if (data[i].statusreson.length > 0) {
              for (let j = 0; j < data[i].statusreson.length; j++) {
                statusReasonArray.push(data[i].statusreson[j].termname + ' : ' + data[i].statusreson[j].recordtrackvalue);
              }

              data[i]['statusreason'] = statusReasonArray.toString();
            }
            delete data[i].statusreson;
          }

          for (let i = 0; i < data.length; i++) {
            if (data[i].visiblecomment.length > 0) {
              for (let j = 0; j < data[i].visiblecomment.length; j++) {
                visiblecommentsArray.push(data[i].visiblecomment[j].Comment + ' : ' + data[i].visiblecomment[j].Createdate);
              }

              data[i]['visiblecomments'] = visiblecommentsArray.toString();
            }
            delete data[i].visiblecomment;
          }
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
        let data1 = [];
        this.margeHeaderArr = ['clientid', 'mstorgnhirarchyid'];
        this.headerDisplayArray = [];
        // console.log("\n this.step   -------------------->>>>>>>>>>>>>>>>>>>>>>      ", this.step);
        if (this.grpLevel > 1) {
          if((Number(this.step) === 1) || (Number(this.step) === 22)){
            data1 = [
              {
                id: 'action',
                name: '',
                field: 'action',
                excludeFromHeaderMenu: true,
                formatter: () => `<button class="btn" style="padding-top: initial; margin-left: -3px;"><img src="../assets/icons/assign-icon-4.png" width='20px'; height='20px'></button>`,
                minWidth: 50,
                maxWidth: 50
              }
            ];
          }
        }

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
          }
          this.dataLoaded = true;

        } else {
          // let i;
          // if(this.isArchieveFolder === true){
          //   i = 0;
          // } else {
          //   i = 1;
          // }
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

          // data1 = [
          //   {
          //     id: 'ticketid',
          //     name: 'Ticket Id',
          //     field: 'ticketid',
          //     minWidth: 200,
          //     sortable: true,
          //     filterable: true
          //   },
          //   {
          //     id: 'shortdescription',
          //     name: 'Ticket Title',
          //     field: 'shortdescription',
          //     minWidth: 200,
          //     sortable: true,
          //     filterable: true
          //   },
          //   {
          //     id: 'requestorname',
          //     name: 'Created By',
          //     field: 'requestorname',
          //     minWidth: 150,
          //     sortable: true,
          //     filterable: true
          //   },
          //   {
          //     id: 'createddatetime',
          //     name: 'Created Since',
          //     field: 'createddatetime',
          //     minWidth: 150,
          //     sortable: true,
          //     filterable: true
          //   },
          //   {
          //     id: 'status',
          //     name: 'Status',
          //     field: 'status',
          //     sortable: true,
          //     minWidth: 150,
          //     filterable: true
          //   },
          //   {
          //     id: 'assigneduser',
          //     name: 'Assignee',
          //     field: 'assigneduser',
          //     minWidth: 200,
          //     sortable: true,
          //     filterable: true
          //   },
          //   {
          //     id: 'assignedgroup',
          //     name: 'Group',
          //     field: 'assignedgroup',
          //     minWidth: 100,
          //     sortable: true,
          //     filterable: true
          //   },
          //   {
          //     id: 'priority',
          //     name: 'Priority',
          //     field: 'priority',
          //     minWidth: 100,
          //     sortable: true,
          //     filterable: true
          //   }
          // ];

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


            const data3 = {
              'clientid': this.clientId,
              'mstorgnhirarchyid': Number(this.orgId),
              'fromrecorddifftypeid': this.TICKET_TYPE_ID,
              'fromrecorddiffid': this.typSelected,
              'seqno': 0
            };
            this.rest.getlabelbydiffseq(data3).subscribe((res: any) => {
              this.respObject = res.details;
              if (res.success) {
                this.respObject.sort((a, b) => {
                  return a.seqno - b.seqno;
                });
                this.respObject.forEach((e) => {
                  data1.push(
                    {
                      id: 100 + Number(e.id),
                      field: e.typename,
                      name: e.typename,
                      minWidth: 120,
                      sortable: true,
                      filterable: true
                    }
                  );
                });
              } else {
                this.dataLoaded = true;
                this.notifier.notify('error', res.message);
              }
            }, (err) => {
              this.dataLoaded = true;
              this.notifier.notify('error', this.messageService.SERVER_ERROR);
            });
            this.dataLoaded = true;


            // data1.push({
            //   id: 'resosladuedatetime',
            //   name: 'Due Date',
            //   field: 'resosladuedatetime',
            //   minWidth: 150,
            //   sortable: true,
            //   filterable: true
            // }, {
            //   id: 'resolutionslameterpercentage',
            //   name: 'SLA Breached Status',
            //   field: 'resolutionslameterpercentage',
            //   minWidth: 150,
            //   sortable: true,
            //   filterable: true
            // }, {
            //   id: 'calendaraging',
            //   name: 'Aging in Days',
            //   field: 'calendaraging',
            //   minWidth: 150,
            //   sortable: true,
            //   filterable: true
            // }, {
            //   id: 'reopencount',
            //   name: 'Reopen Count',
            //   field: 'reopencount',
            //   minWidth: 150,
            //   sortable: true,
            //   filterable: true
            // }, {
            //   id: 'prioritycount',
            //   name: 'Priority Change Count',
            //   field: 'prioritycount',
            //   minWidth: 150,
            //   sortable: true,
            //   filterable: true
            // }, {
            //   id: 'followupcount',
            //   name: 'User Follow Up',
            //   field: 'followupcount',
            //   minWidth: 150,
            //   sortable: true,
            //   filterable: true
            // }, {
            //   id: 'outboundcount',
            //   name: 'Outbound Count',
            //   field: 'outboundcount',
            //   minWidth: 150,
            //   sortable: true,
            //   filterable: true
            // });


          }


          // for (let i = 0; i < data.length; i++) {
          //   data1.push({
          //     id: data[i].id,
          //     name: data[i].typename,
          //     field: data[i].id,
          //     minWidth: 100,
          //     sortable: true,
          //     filterable: true
          //   });
          // }


        }

        if (data1.length > 0) {
          // console.log("\n DATA 1 ===  ", data1);
          this.margeHeaderArr.push('id', 'recordid', 'tickettypeid');
          for (let i = 0; i < data1.length; i++) {
            this.margeHeaderArr.push(data1[i].field);
          }
          for (let i = 0; i < data1.length; i++) {
            this.headerDisplayArray.push(data1[i].name);
          }
          const index1 = this.margeHeaderArr.indexOf('action', 0);
          if (index1 > -1) {
            this.margeHeaderArr.splice(index1, 1);
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
      const sortedArray = [];
      this.margeHeaderArr = ['clientid', 'mstorgnhirarchyid'];
      this.margeHeaderArr.push('id', 'recordid', 'tickettypeid');
      for (let i = 0; i < this.selectedGridColumns.length - this.categoriesLength; i++) {
        this.margeHeaderArr.push(this.selectedGridColumns[i].field);
      }
      this.onFromRunFlag = true;
      this.isEditHeader = false;
      // console.log("\n orgSelected =====>>>>>>   ", this.orgSelected);
      if (this.orgSelected === undefined || this.orgSelected.length === 0) {
        // console.log("\n Inside IFFFFFFFFFFFFF................");
        // console.log("\n this.onFromRunFlag  =====>>>>   ", this.onFromRunFlag);
        // console.log("\n this.step ====   ", this.step, "  <<<>>>>    this.starStep ====   ", this.starStep);
        if ((this.step !== undefined) && (this.starStep === undefined)) {
          const searchedArray = [];
          this.recordgridresult(searchedArray, sortedArray);
        } else if ((this.step === undefined) && (this.starStep !== undefined)) {
          // console.log("\n this.submittedFormArr ====   ", this.submittedFormArr);
          this.recordfullresult(this.submittedFormArr, sortedArray);
        }
      } else {
        // console.log("\n ELSEEEEEEEEEEE................");
        this.recordfullresult(this.submittedFormArr, sortedArray);
      }
      this.getColumnDefintion();
    } else {
      this.notifier.notify('error', this.messageService.SELECT_HEADER);
    }
  }


  onFormReset(type) {
    this.isAllOrg = false;
    this.isAllConditionValue = false;
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
    // this.isNumericConditionValue = false;
    this.isValidateFilterCondition = false;
    // this.isConditionValueDropdown = false;
    // this.isConditionValueDropdownMultiSelect = false;
    // console.log("\n ========   ", this.step , ">>>>>>>>>>>    ", this.starStep)
    if ((this.step !== undefined) && (this.starStep === undefined)) {
      this.folderClick(this.step);
    } else if ((this.step === undefined) && (this.starStep !== undefined)) {
      this.clickedStarFilter(this.starStep, type);
    }
  }

  // onFormResetForFavouriteList() {
  //   this.frmGroupArr = [];
  //   this.orgSelected = [];
  //   this.form = new form();
  //   this.frmGroupArr.push(this.form);
  //   this.frmGroupArr[0].operatorSelected = 0;
  //   // this.submittedFormArr = [];
  //   const sortedArray = [];
  //   this.onFromRunFlag = false;
  //   this.isNumericConditionValue = false;
  //   this.isValidateFilterCondition = false;
  // }

  onEditHeader() {
    this.isEditHeader = !this.isEditHeader;
  }

  onHeaderReset(type) {
    this.editedGridHeaderNames = [];
    this.eventData = [];
    this.selectedGridColumns = [];
    this.gridHeaderNames = [];
    this.gridHeaderNames = [
      {'id': 0, 'value': 'Customer', 'field': 'levelonecatename'},
      {'id': 1, 'value': 'Ticket ID', 'field': 'ticketid'},
      {'id': 2, 'value': 'Source', 'field': 'source'},
      {'id': 3, 'value': 'Requester Name', 'field': 'requestorname'},
      {'id': 4, 'value': 'Requester Location/Branch', 'field': 'requestorlocation'},
      {'id': 5, 'value': 'Requester Primary Contact (Phone/Mobile) Number', 'field': 'requestorphone'},
      {'id': 6, 'value': 'Requester Email ID', 'field': 'requestoremail'},
      {'id': 7, 'value': 'Original Created By Name', 'field': 'orgcreatorname'},
      {'id': 8, 'value': 'Original Created By Location', 'field': 'orgcreatorlocation'},
      {'id': 9, 'value': 'Original Created By Primary Contact (Phone/Mobile) Number', 'field': 'orgcreatorphone'},
      {'id': 10, 'value': 'Original Created By Email ID', 'field': 'orgcreatoremail'},
      {'id': 11, 'value': 'Short Description', 'field': 'shortdescription'},
      {'id': 12, 'value': 'Priority', 'field': 'priority'},
      {'id': 13, 'value': 'Status', 'field': 'status'},
      {'id': 46, 'value': 'Ticket Type', 'field': 'tickettype'},
      {'id': 53, 'value': 'Vendor Name', 'field': 'vendorname'},
      {'id': 54, 'value': 'Vendor Ticket Id', 'field': 'vendorticketid'},
      {'id': 55, 'value': 'Resolution Code', 'field': 'resolutioncode'},
      {'id': 56, 'value': 'Resolution Comment', 'field': 'resolutioncomment'},
      {'id': 57, 'value': 'Last Update By', 'field': 'lastuser'},
      {'id': 58, 'value': 'Resolved Date', 'field': 'latestresodatetime'},
      {'id': 59, 'value': 'Duration in Pending Vendor State', 'field': 'followuptimetaken'},
      {'id': 60, 'value': 'Pending Vendor Count', 'field': 'pendingvendorcount'},
      {'id': 217, 'value': 'Status Reason', 'field': 'statusreason'},
      {'id': 218, 'value': 'Visible Comment', 'field': 'visiblecomments'},
      {'id': 49, 'value': 'Priority Change Count', 'field': 'prioritycount'},
      {'id': 50, 'value': 'Response Time', 'field': 'responsetime'},
      {'id': 51, 'value': 'Resolution Time', 'field': 'resolutiontime'},
      {'id': 52, 'value': 'Pending User Count', 'field': 'pendingusercount'},
      {'id': 14, 'value': 'VIP Ticket (Yes/No)', 'field': 'vipticket'},
      {'id': 15, 'value': 'Assigned Group (Last assigned Resolver Group)', 'field': 'assignedgroup'},
      {'id': 16, 'value': 'Assigned User (Last assigned  user from the Resolver Group)', 'field': 'assigneduser'},
      {'id': 17, 'value': 'Resolved By Group (Last assigned Resolver Group who has resolved the ticket)', 'field': 'resogroup'},
      {
        'id': 18,
        'value': 'Resolved By User (Last assigned  user from the Resolver Group who has resolved the ticket)',
        'field': 'resolveduser'
      },
      {'id': 19, 'value': 'Created Since', 'field': 'createddatetime'},
      {'id': 20, 'value': 'Last Modified Date/Time', 'field': 'lastupdateddatetime'},
      // {'id': 21, 'value': 'Last Modified By User', 'field': 'lastuser'},
      // {'id': 22, 'value': 'CTIS L1', 'field': '' },
      // {'id': 23, 'value': 'CTIS L2', 'field': '' },
      // {'id': 24, 'value': 'CTIS L3', 'field': '' },
      // {'id': 25, 'value': 'CTIS L4', 'field': '' },
      // {'id': 26, 'value': 'CTIS L5', 'field': '' },
      {'id': 27, 'value': 'Urgency', 'field': 'urgency'},
      {'id': 28, 'value': 'Impact', 'field': 'impact'},
      {'id': 29, 'value': 'Due Date', 'field': 'resosladuedatetime'},
      // {'id': 30, 'value': 'Response SLA Breached Status', 'field': 'respslabreachstatus'},
      // {'id': 31, 'value': 'Resolution SLA Breached Status', 'field': 'resolslabreachstatus'},
      // {'id': 32, 'value': 'Response SLA Overdue', 'field': 'respoverduetime'},
      // {'id': 33, 'value': 'Resolution SLA Overdue', 'field': 'resooverduetime'},
      // {'id': 34, 'value': 'Aging in Days (Calendar days from created date)', 'field': 'calendaraging'},
      {'id': 35, 'value': 'Not Updated Since', 'field': 'worknotenotupdated'},
      {'id': 36, 'value': 'Reopen Count', 'field': 'reopencount'},
      {'id': 37, 'value': 'Reassignment Hop Count', 'field': 'reassigncount'},
      {'id': 38, 'value': 'Category Change Count', 'field': 'categorychangecount'},
      {'id': 39, 'value': 'User Follow Up', 'field': 'followupcount'},
      {'id': 40, 'value': 'Outbound Count', 'field': 'outboundcount'},
      // {'id': 41, 'value': 'IsParent (Yes/No)', 'field': 'isparent'},
      {'id': 42, 'value': 'Child Count (if parent)', 'field': 'childcount'},
      {'id': 43, 'value': 'Response Clock Status (Running/Stopped)', 'field': 'respclockstatus'},
      {'id': 44, 'value': 'Resolution Clock Status (Running/Stopped/Paused)', 'field': 'resoclockstatus'},
      // {'id': 45, 'value': 'SLA Meter Search by number %', 'field': 'responseslameterpercentage'}
    ];
    for (let i = 0; i < this.defaultGridHeader1.length; i++) {
      for (let j = 0; j < this.gridHeaderNames.length; j++) {
        if (String(this.defaultGridHeader1[i].field) === String(this.gridHeaderNames[j].field)) {
          this.selectedGridColumns.push({
            'id': this.gridHeaderNames[j].id,
            'field': this.gridHeaderNames[j].field,
            'value': this.gridHeaderNames[j].value
          });
        }
      }
    }
    if (this.grpLevel > 1) {
      for (let i = 0; i < this.defaultGridHeader2.length; i++) {
        for (let j = 0; j < this.gridHeaderNames.length; j++) {
          if (String(this.defaultGridHeader2[i].field) === String(this.gridHeaderNames[j].field)) {
            this.selectedGridColumns.push({
              'id': this.gridHeaderNames[j].id,
              'field': this.gridHeaderNames[j].field,
              'value': this.gridHeaderNames[j].value
            });
          }
        }
      }
    }
    this.eventData = this.selectedGridColumns;
    this.editedGridHeaderNames = this.gridHeaderNames.filter(entryValues1 => !this.selectedGridColumns.some(entryValues2 => entryValues1.field === entryValues2.field));
    // this.editedGridHeaderNames = this.gridHeaderNames;
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


    const data3 = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': Number(this.orgId),
      'fromrecorddifftypeid': this.TICKET_TYPE_ID,
      'fromrecorddiffid': this.typSelected,
      'seqno': 0
    };
    this.rest.getlabelbydiffseq(data3).subscribe((res: any) => {
      this.respObject = res.details;
      if (res.success) {
        this.respObject.sort((a, b) => {
          return a.seqno - b.seqno;
        });
        this.respObject.forEach((e) => {
          this.selectedGridColumns.push({
            'id': 100 + Number(e.id),
            'field': e.typename,
            'value': e.typename
          });
        });
      } else {
        this.dataLoaded = true;
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.dataLoaded = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });


    // console.log("\n this.defaultGridHeader1  =====    ", this.defaultGridHeader1);
    // console.log("\n this.margeHeaderArr  =====    ", this.margeHeaderArr);
    let searchedData = this.submittedFormArr;
    let sortedData = [];
    // this.recordfullresult(searchedData, sortedData);
    // this.getColumnDefintion();
    // console.log("\n orgSelected =====>>>>>>   ", this.orgSelected);
    if (this.orgSelected === undefined || this.orgSelected.length === 0) {
      // console.log("\n this.step ====   ", this.step, "  <<<>>>>    this.starStep ====   ", this.starStep);
      if ((this.step !== undefined) && (this.starStep === undefined)) {
        const searchedArray = [];
        this.recordgridresult(searchedArray, sortedData);
      } else if ((this.step === undefined) && (this.starStep !== undefined)) {
        // console.log("\n this.submittedFormArr ====   ", this.submittedFormArr);
        if (type !== 'emptyFilter') {
          this.recordfullresult(this.submittedFormArr, sortedData);
        }
      }
      this.getColumnDefintion();
    } else {
      this.recordfullresult(this.submittedFormArr, sortedData);
      this.getColumnDefintion();
    }
    if (type !== 'emptyFilter') {
      this.notifier.notify('success', 'Reset to default headers.');
    }
  }

  onWorkSpaceChange(selectedValue) {
    this.messageService.saveWorkspace(selectedValue);
    this.gettilesnames();
  }


  onFieldChange(selectedValue, index) {
    // console.log("\n index 1  ::   ", index);
    this.isAllConditionValue = false;
    this.frmGroupArr[index].selectedFieldValue = '';
    this.frmGroupArr[index].selectedFieldValue = selectedValue;
    this.frmGroupArr[index].isNumericConditionValue = false;
    this.frmGroupArr[index].isConditionValueDropdown = false;
    this.frmGroupArr[index].isConditionValueDropdownMultiSelect = false;
    // console.log("\n frmGroupArr[index].selectedFieldValue   ", this.frmGroupArr[index].selectedFieldValue);
    // console.log("\n frmGroupArr[index].selectedConditionValue   ", this.frmGroupArr[index].selectedConditionValue);
    // console.log("\n this.frmGroupArr   ================>>>>>>>>>>     ", this.frmGroupArr);
    if (this.frmGroupArr[index].selectedConditionValue !== undefined) {
      if ((this.frmGroupArr[index].selectedConditionValue === '>') || (this.frmGroupArr[index].selectedConditionValue === '<') || (this.frmGroupArr[index].selectedConditionValue === '>=') || (this.frmGroupArr[index].selectedConditionValue === '<=') || (this.frmGroupArr[index].selectedConditionValue === 'between')) {
        if ((this.frmGroupArr[index].selectedFieldValue === 'latestresodatetime') || (this.frmGroupArr[index].selectedFieldValue === 'followuptimetaken') || (this.frmGroupArr[index].selectedFieldValue === 'pendingvendorcount') || (this.frmGroupArr[index].selectedFieldValue === 'ticketid') || (this.frmGroupArr[index].selectedFieldValue === 'createddatetime') || (this.frmGroupArr[index].selectedFieldValue === 'lastupdateddatetime') || (this.frmGroupArr[index].selectedFieldValue === 'resosladuedatetime') || (this.frmGroupArr[index].selectedFieldValue === 'respoverduetime') || (this.frmGroupArr[index].selectedFieldValue === 'resooverduetime') || (this.frmGroupArr[index].selectedFieldValue === 'calendaraging') || (this.frmGroupArr[index].selectedFieldValue === 'reopencount') || (this.frmGroupArr[index].selectedFieldValue === 'reassigncount') || (this.frmGroupArr[index].selectedFieldValue === 'categorychangecount') || (this.frmGroupArr[index].selectedFieldValue === 'followupcount') || (this.frmGroupArr[index].selectedFieldValue === 'outboundcount') || (this.frmGroupArr[index].selectedFieldValue === 'childcount') || (this.frmGroupArr[index].selectedFieldValue === 'worknotenotupdated') || (this.frmGroupArr[index].selectedFieldValue === 'responseslameterpercentage') || (this.frmGroupArr[index].selectedFieldValue === 'prioritycount') || (this.frmGroupArr[index].selectedFieldValue === 'responsetime') || (this.frmGroupArr[index].selectedFieldValue === 'resolutiontime') || (this.frmGroupArr[index].selectedFieldValue === 'pendingusercount')) {
          if (this.frmGroupArr[index].selectedFieldValue === 'ticketid') {
            this.frmGroupArr[index].isNumericConditionValue = false;
            this.isValidateFilterCondition = false;
          } else if ((this.frmGroupArr[index].selectedFieldValue === 'createddatetime') || (this.frmGroupArr[index].selectedFieldValue === 'lastupdateddatetime') || (this.frmGroupArr[index].selectedFieldValue === 'resosladuedatetime') || (this.frmGroupArr[index].selectedFieldValue === 'worknotenotupdated') || (this.frmGroupArr[index].selectedFieldValue === 'latestresodatetime')) {
            this.frmGroupArr[index].isNumericConditionValue = false;
            this.frmGroupArr[index].isConditionValueDropdown = false;
            this.frmGroupArr[index].isConditionValueDropdownMultiSelect = true;
            this.isValidateFilterCondition = false;
          } else {
            this.frmGroupArr[index].isNumericConditionValue = true;
            this.isValidateFilterCondition = false;
          }
        } else {
          if ((this.frmGroupArr[index].selectedFieldValue === 'requestorphone') || (this.frmGroupArr[index].selectedFieldValue === 'orgcreatorphone')) {
            this.frmGroupArr[index].isNumericConditionValue = true;
          } else {
            this.frmGroupArr[index].isNumericConditionValue = false;
          }
          this.isValidateFilterCondition = true;
          this.notifier.notify('error', 'Field and condition not met');
        }
      } else {
        if ((this.frmGroupArr[index].selectedFieldValue === 'latestresodatetime') || (this.frmGroupArr[index].selectedFieldValue === 'followuptimetaken') || (this.frmGroupArr[index].selectedFieldValue === 'pendingvendorcount') || (this.frmGroupArr[index].selectedFieldValue === 'ticketid') || (this.frmGroupArr[index].selectedFieldValue === 'createddatetime') || (this.frmGroupArr[index].selectedFieldValue === 'lastupdateddatetime') || (this.frmGroupArr[index].selectedFieldValue === 'resosladuedatetime') || (this.frmGroupArr[index].selectedFieldValue === 'respoverduetime') || (this.frmGroupArr[index].selectedFieldValue === 'resooverduetime') || (this.frmGroupArr[index].selectedFieldValue === 'calendaraging') || (this.frmGroupArr[index].selectedFieldValue === 'reopencount') || (this.frmGroupArr[index].selectedFieldValue === 'reassigncount') || (this.frmGroupArr[index].selectedFieldValue === 'categorychangecount') || (this.frmGroupArr[index].selectedFieldValue === 'followupcount') || (this.frmGroupArr[index].selectedFieldValue === 'outboundcount') || (this.frmGroupArr[index].selectedFieldValue === 'childcount') || (this.frmGroupArr[index].selectedFieldValue === 'worknotenotupdated') || (this.frmGroupArr[index].selectedFieldValue === 'responseslameterpercentage') || (this.frmGroupArr[index].selectedFieldValue === 'prioritycount') || (this.frmGroupArr[index].selectedFieldValue === 'responsetime') || (this.frmGroupArr[index].selectedFieldValue === 'resolutiontime') || (this.frmGroupArr[index].selectedFieldValue === 'pendingusercount')) {
          if (this.frmGroupArr[index].selectedFieldValue === 'ticketid') {
            this.frmGroupArr[index].isNumericConditionValue = false;
          } else if ((this.frmGroupArr[index].selectedFieldValue === 'createddatetime') || (this.frmGroupArr[index].selectedFieldValue === 'lastupdateddatetime') || (this.frmGroupArr[index].selectedFieldValue === 'resosladuedatetime') || (this.frmGroupArr[index].selectedFieldValue === 'worknotenotupdated') || (this.frmGroupArr[index].selectedFieldValue === 'latestresodatetime')) {
            this.frmGroupArr[index].isNumericConditionValue = false;
            this.frmGroupArr[index].isConditionValueDropdown = false;
            this.frmGroupArr[index].isConditionValueDropdownMultiSelect = true;
            this.isValidateFilterCondition = false;
          } else {
            this.frmGroupArr[index].isNumericConditionValue = true;
          }
        } else {
          this.conditionValueCheck(index);
        }
      }
    } else {
      if ((this.frmGroupArr[index].selectedFieldValue === 'latestresodatetime') || (this.frmGroupArr[index].selectedFieldValue === 'followuptimetaken') || (this.frmGroupArr[index].selectedFieldValue === 'pendingvendorcount') || (this.frmGroupArr[index].selectedFieldValue === 'ticketid') || (this.frmGroupArr[index].selectedFieldValue === 'createddatetime') || (this.frmGroupArr[index].selectedFieldValue === 'lastupdateddatetime') || (this.frmGroupArr[index].selectedFieldValue === 'resosladuedatetime') || (this.frmGroupArr[index].selectedFieldValue === 'respoverduetime') || (this.frmGroupArr[index].selectedFieldValue === 'resooverduetime') || (this.frmGroupArr[index].selectedFieldValue === 'calendaraging') || (this.frmGroupArr[index].selectedFieldValue === 'reopencount') || (this.frmGroupArr[index].selectedFieldValue === 'reassigncount') || (this.frmGroupArr[index].selectedFieldValue === 'categorychangecount') || (this.frmGroupArr[index].selectedFieldValue === 'followupcount') || (this.frmGroupArr[index].selectedFieldValue === 'outboundcount') || (this.frmGroupArr[index].selectedFieldValue === 'childcount') || (this.frmGroupArr[index].selectedFieldValue === 'worknotenotupdated') || (this.frmGroupArr[index].selectedFieldValue === 'responseslameterpercentage') || (this.frmGroupArr[index].selectedFieldValue === 'prioritycount') || (this.frmGroupArr[index].selectedFieldValue === 'responsetime') || (this.frmGroupArr[index].selectedFieldValue === 'resolutiontime') || (this.frmGroupArr[index].selectedFieldValue === 'pendingusercount')) {
        if (this.frmGroupArr[index].selectedFieldValue === 'ticketid') {
          this.frmGroupArr[index].isNumericConditionValue = false;
        } else if ((this.frmGroupArr[index].selectedFieldValue === 'createddatetime') || (this.frmGroupArr[index].selectedFieldValue === 'lastupdateddatetime') || (this.frmGroupArr[index].selectedFieldValue === 'resosladuedatetime') || (this.frmGroupArr[index].selectedFieldValue === 'worknotenotupdated') || (this.frmGroupArr[index].selectedFieldValue === 'latestresodatetime')) {
          this.frmGroupArr[index].isNumericConditionValue = false;
          this.frmGroupArr[index].isConditionValueDropdown = false;
          this.frmGroupArr[index].isConditionValueDropdownMultiSelect = true;
          this.isValidateFilterCondition = false;
        } else {
          this.frmGroupArr[index].isNumericConditionValue = true;
        }
      } else {
        this.conditionValueCheck(index);
      }
    }
  }

  conditionValueCheck(index) {
    this.frmGroupArr[index].dropDownArr5 = [];
    this.frmGroupArr[index].dropDownArr6 = [];
    if (this.frmGroupArr[index].selectedFieldValue === 'source') {
      if ((this.frmGroupArr[index].selectedConditionValue !== undefined) && ((this.frmGroupArr[index].selectedConditionValue === 'in') || (this.frmGroupArr[index].selectedConditionValue === 'notin'))) {
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
      for (let i = 1; i < this.sources.length; i++) {
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
    } else if (this.frmGroupArr[index].selectedFieldValue === 'priority') {
      this.getPropertyValueNoMapping(5, index);
    } else if (this.frmGroupArr[index].selectedFieldValue === 'status') {
      this.getPropertyValueNoMapping(3, index);
    } else if (this.frmGroupArr[index].selectedFieldValue === 'tickettype') {
      this.getPropertyValueNoMapping(2, index);
    } else if (this.frmGroupArr[index].selectedFieldValue === 'urgency') {
      this.getPropertyValueNoMapping(8, index);
    } else if (this.frmGroupArr[index].selectedFieldValue === 'impact') {
      this.getPropertyValueNoMapping(7, index);
    } else {
      this.frmGroupArr[index].isConditionValueDropdown = false;
      this.frmGroupArr[index].isConditionValueDropdownMultiSelect = false;
    }
  }

  getPropertyValueNoMapping(seqNumber: number, index: any) {
    if ((this.frmGroupArr[index].selectedConditionValue !== undefined) && ((this.frmGroupArr[index].selectedConditionValue === 'in') || (this.frmGroupArr[index].selectedConditionValue === 'notin'))) {
      this.frmGroupArr[index].isConditionValueDropdown = true;
      this.frmGroupArr[index].isConditionValueDropdownMultiSelect = true;
    } else {
      this.frmGroupArr[index].isConditionValueDropdown = true;
      this.frmGroupArr[index].isConditionValueDropdownMultiSelect = false;
    }
    const data = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.orgId,
      'recorddifftypeid': Number(seqNumber),
      'offset': 0,
      'limit': 100
    };
    this.rest.getAllRecordDiff(data).subscribe((res: any) => {
      this.respObject = res.details.values;
      this.respObject.reverse();
      if (res.success) {
        for (let i = 0; i < this.respObject.length; i++) {
          this.frmGroupArr[index].dropDownArr5.push({
            id: this.respObject[i].seqno,
            value: this.respObject[i].name,
            field: this.respObject[i].name
          });
          this.frmGroupArr[index].dropDownArr6.push({
            id: this.respObject[i].seqno,
            value: this.respObject[i].name,
            field: this.respObject[i].name
          });
        }
      } else {
        this.notifier.notify('error', this.respObject.errorMessage);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onConditionChange(selectedValue, index) {
    // console.log("\n index 2 ====   ", index);
    this.isAllConditionValue = false;
    this.isValidateFilterCondition = false;
    this.frmGroupArr[index].selectedConditionValue = '';
    this.frmGroupArr[index].selectedConditionValue = selectedValue;
    // console.log("\n selectedFieldValue   ", this.frmGroupArr[index].selectedFieldValue);
    // console.log("\n selectedConditionValue   ", this.frmGroupArr[index].selectedConditionValue);
    // console.log("\n this.frmGroupArr   ================>>>>>>>>>>     ", this.frmGroupArr);
    // console.log("\n selectedConditionValue   ", this.frmGroupArr[index].selectedConditionValue);
    if ((this.frmGroupArr[index].selectedConditionValue === '>') || (this.frmGroupArr[index].selectedConditionValue === '<') || (this.frmGroupArr[index].selectedConditionValue === '>=') || (this.frmGroupArr[index].selectedConditionValue === '<=') || (this.frmGroupArr[index].selectedConditionValue === 'between')) {
      if ((this.frmGroupArr[index].selectedFieldValue === 'latestresodatetime') || (this.frmGroupArr[index].selectedFieldValue === 'followuptimetaken') || (this.frmGroupArr[index].selectedFieldValue === 'pendingvendorcount') || (this.frmGroupArr[index].selectedFieldValue === 'ticketid') || (this.frmGroupArr[index].selectedFieldValue === 'createddatetime') || (this.frmGroupArr[index].selectedFieldValue === 'lastupdateddatetime') || (this.frmGroupArr[index].selectedFieldValue === 'resosladuedatetime') || (this.frmGroupArr[index].selectedFieldValue === 'respoverduetime') || (this.frmGroupArr[index].selectedFieldValue === 'resooverduetime') || (this.frmGroupArr[index].selectedFieldValue === 'calendaraging') || (this.frmGroupArr[index].selectedFieldValue === 'reopencount') || (this.frmGroupArr[index].selectedFieldValue === 'reassigncount') || (this.frmGroupArr[index].selectedFieldValue === 'categorychangecount') || (this.frmGroupArr[index].selectedFieldValue === 'followupcount') || (this.frmGroupArr[index].selectedFieldValue === 'outboundcount') || (this.frmGroupArr[index].selectedFieldValue === 'childcount') || (this.frmGroupArr[index].selectedFieldValue === 'worknotenotupdated') || (this.frmGroupArr[index].selectedFieldValue === 'responseslameterpercentage') || (this.frmGroupArr[index].selectedFieldValue === 'prioritycount') || (this.frmGroupArr[index].selectedFieldValue === 'responsetime') || (this.frmGroupArr[index].selectedFieldValue === 'resolutiontime') || (this.frmGroupArr[index].selectedFieldValue === 'pendingusercount')) {
        if (this.frmGroupArr[index].selectedFieldValue === 'ticketid') {
          this.frmGroupArr[index].isNumericConditionValue = false;
          this.isValidateFilterCondition = false;
        } else if ((this.frmGroupArr[index].selectedFieldValue === 'createddatetime') || (this.frmGroupArr[index].selectedFieldValue === 'lastupdateddatetime') || (this.frmGroupArr[index].selectedFieldValue === 'resosladuedatetime') || (this.frmGroupArr[index].selectedFieldValue === 'worknotenotupdated') || (this.frmGroupArr[index].selectedFieldValue === 'latestresodatetime')) {
          this.frmGroupArr[index].isNumericConditionValue = false;
          this.frmGroupArr[index].isConditionValueDropdown = false;
          this.frmGroupArr[index].isConditionValueDropdownMultiSelect = true;
          this.isValidateFilterCondition = false;
        } else {
          this.frmGroupArr[index].isNumericConditionValue = true;
          this.isValidateFilterCondition = false;
        }
      } else {
        if ((this.frmGroupArr[index].selectedFieldValue === 'requestorphone') || (this.frmGroupArr[index].selectedFieldValue === 'orgcreatorphone')) {
          this.frmGroupArr[index].isNumericConditionValue = true;
        } else {
          this.frmGroupArr[index].isNumericConditionValue = false;
        }
        this.isValidateFilterCondition = true;
        this.notifier.notify('error', 'Field and condition not met');
      }
    } else {
      if ((this.frmGroupArr[index].selectedConditionValue === 'in') || (this.frmGroupArr[index].selectedConditionValue === 'notin')) {
        if ((this.frmGroupArr[index].selectedFieldValue === 'source') || (this.frmGroupArr[index].selectedFieldValue === 'priority') || (this.frmGroupArr[index].selectedFieldValue === 'status') || (this.frmGroupArr[index].selectedFieldValue === 'tickettype') || (this.frmGroupArr[index].selectedFieldValue === 'urgency') || (this.frmGroupArr[index].selectedFieldValue === 'impact')) {
          this.frmGroupArr[index].isConditionValueDropdown = true;
          this.frmGroupArr[index].isConditionValueDropdownMultiSelect = true;
          this.conditionValueCheck(index);
        } else if ((this.frmGroupArr[index].selectedFieldValue === 'createddatetime') || (this.frmGroupArr[index].selectedFieldValue === 'lastupdateddatetime') || (this.frmGroupArr[index].selectedFieldValue === 'resosladuedatetime') || (this.frmGroupArr[index].selectedFieldValue === 'worknotenotupdated') || (this.frmGroupArr[index].selectedFieldValue === 'latestresodatetime')) {
          this.frmGroupArr[index].isNumericConditionValue = false;
          this.frmGroupArr[index].isConditionValueDropdown = false;
          this.frmGroupArr[index].isConditionValueDropdownMultiSelect = true;
          this.isValidateFilterCondition = false;
        } else {
          this.frmGroupArr[index].isConditionValueDropdown = false;
          this.frmGroupArr[index].isConditionValueDropdownMultiSelect = false;
        }
      } else {
        if ((this.frmGroupArr[index].selectedFieldValue === 'source') || (this.frmGroupArr[index].selectedFieldValue === 'priority') || (this.frmGroupArr[index].selectedFieldValue === 'status') || (this.frmGroupArr[index].selectedFieldValue === 'tickettype') || (this.frmGroupArr[index].selectedFieldValue === 'urgency') || (this.frmGroupArr[index].selectedFieldValue === 'impact')) {
          this.frmGroupArr[index].isConditionValueDropdown = true;
          this.frmGroupArr[index].isConditionValueDropdownMultiSelect = false;
          this.conditionValueCheck(index);
        } else if ((this.frmGroupArr[index].selectedFieldValue === 'createddatetime') || (this.frmGroupArr[index].selectedFieldValue === 'lastupdateddatetime') || (this.frmGroupArr[index].selectedFieldValue === 'resosladuedatetime') || (this.frmGroupArr[index].selectedFieldValue === 'worknotenotupdated') || (this.frmGroupArr[index].selectedFieldValue === 'latestresodatetime')) {
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
    // console.log("\n 1111111111 ==========   ",this.isValidateFilterCondition);
  }


  onConditionValueChange(selectedConditionValue, index, type) {
    if (selectedConditionValue.length === this.frmGroupArr[index].dropDownArr6.length) {
      this.isAllConditionValue = true;
    } else {
      this.isAllConditionValue = false;
    }
  }

  selectAllConditionValue(index) {
    this.frmGroupArr[index].dropDownSelected6 = [];
    if (this.isAllConditionValue) {
      for (let i = 0; i < this.frmGroupArr[index].dropDownArr6.length; i++) {
        this.frmGroupArr[index].dropDownSelected6.push(String(this.frmGroupArr[index].dropDownArr6[i].field));
      }
      this.onConditionValueChange(this.frmGroupArr[index].dropDownSelected6, index, 'all');
    }
  }

  fromDateChange(date, index) {
    let today = new Date();
    if (date.getTime() > today.getTime()) {
      this.notifier.notify('error', 'From date cannot be future date');
      this.frmGroupArr[index].fromDateSelected2 = '';
      this.startDate.nativeElement.value = '';
    } else {
      if (this.frmGroupArr[index].toDateSelected1 !== '') {
        let Difference_In_Time = this.frmGroupArr[index].toDateSelected1.getTime() - date.getTime();
        this.Difference_In_Days = Difference_In_Time / (1000 * 60 * 60 * 24);
        // console.log(this.Difference_In_Days)
        if (this.Difference_In_Days > 7) {
          this.notifier.notify('error', 'The to date must be within the next 7 days');
          this.frmGroupArr[index].toDateSelected1 = '';
        } else if ((this.Difference_In_Days === 0) || (this.frmGroupArr[index].toDateSelected1 < this.frmGroupArr[index].fromDateSelected2)) {
          this.notifier.notify('error', this.messageService.END_TIME_GREATERTHAN_START_TIME);
          this.frmGroupArr[index].fromDateSelected2 = '';
          this.startDate.nativeElement.value = '';

        }
      }
    }
  }


  toDateChange(date, index) {
    let today = new Date();
    let Difference_In_Time = this.frmGroupArr[index].toDateSelected1.getTime() - this.frmGroupArr[index].fromDateSelected2.getTime();
    this.Difference_In_Days = Difference_In_Time / (1000 * 60 * 60 * 24);
    if (date.getTime() > today.getTime()) {
      this.notifier.notify('error', 'To date cannot be future date');
      this.frmGroupArr[index].toDateSelected1 = '';
      this.endDate.nativeElement.value = '';
    } else if (this.Difference_In_Days > 7) {
      this.notifier.notify('error', 'The to date must be within the next 7 days');
      this.frmGroupArr[index].toDateSelected1 = '';
      this.endDate.nativeElement.value = '';
      // console.log(this.frmGroupArr[index].toDateSelected1)
    } else if ((this.Difference_In_Days === 0) || (this.frmGroupArr[index].toDateSelected1 < this.frmGroupArr[index].fromDateSelected2)) {
      this.notifier.notify('error', this.messageService.END_TIME_GREATERTHAN_START_TIME);
      this.frmGroupArr[index].toDateSelected1 = '';
      this.endDate.nativeElement.value = '';
      // let year = this.frmGroupArr[index].fromDateSelected2.getFullYear();
      // let month = this.frmGroupArr[index].fromDateSelected2.getMonth() + 1;
      // let day = this.frmGroupArr[index].fromDateSelected2.getDate();
      // const toDate = year + '-' + month + '-' + day + ' ' + '23:59:59';
      // this.frmGroupArr[index].toDateSelected1 = new Date(toDate)

    } else {
      // this.frmGroupArr[index].toDateSelected1
    }

  }


  handleOnMouseEnter(e) {
    const prevTooltip = document.body.querySelector('.shortDescToolTip');
    prevTooltip?.remove();
    const cell = this.angularGrid.slickGrid.getCellFromEvent(e);
    const item = this.angularGrid.dataView.getItem(cell.row);
    const columnDef = this.angularGrid.slickGrid.getColumns()[cell.cell];
    const cellPosition = getHtmlElementOffset(this.angularGrid.slickGrid.getCellNode(cell.row, cell.cell));
    if (columnDef.field === 'shortdescription') {
      const tooltipElm = document.createElement('div');
      tooltipElm.className = 'shortDescToolTip'; // you could also add cell/row into the class name
      tooltipElm.innerHTML = `<div><b> ${item.shortdescription}</b></div>`;
      document.body.appendChild(tooltipElm);
      tooltipElm.style.top = `${cellPosition.top}px`;
      // tooltipElm.style.left = `${cellPosition.left + 150}px`;
      if((screen.width - cellPosition.left)<470){
        tooltipElm.style.left = `${cellPosition.left - 200}px`;
      }
      else{
        tooltipElm.style.left = `${cellPosition.left + 150}px`;
      }
    } else {
      // console.log("No tooltip")
    }
  }

  handleOnMouseLeave(e) {
    const prevTooltip = document.body.querySelector('.shortDescToolTip');
    prevTooltip?.remove();
    // this.modalRef1.close();
  }


}


