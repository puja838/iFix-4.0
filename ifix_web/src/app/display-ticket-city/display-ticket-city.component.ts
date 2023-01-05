import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {AngularGridInstance, CompoundSliderFilter, FieldType, Filters, Formatters, GridOption} from 'angular-slickgrid';
import {NgbActiveModal, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Observable, Subscription} from 'rxjs';
import {MessageService} from '../message.service';
import {RestApiService} from '../rest-api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';
import {ConfigService} from '../config.service';
import {FormControl} from '@angular/forms';
import {HttpHeaders} from '@angular/common/http';
import {I, SEMICOLON, SPACE} from '@angular/cdk/keycodes';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {map, startWith} from 'rxjs/operators';


const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json;charset=utf-8'})
};

@Component({
  selector: 'app-display-ticket-city',
  templateUrl: './display-ticket-city.component.html',
  styleUrls: ['./display-ticket-city.component.css']
})
export class DisplayTicketCityComponent implements OnInit, OnDestroy {

  height: number;
  solHeight: number;
  dataLoaded: boolean;
  ticketTypeLoaded = false;
  displayed = true;
  @ViewChild('attachparent') private attachparent;
  step: string;
  assignGroupLength: number;
  columnDefinitions = [];
  gridOptions1: GridOption;
  gridOptions3: GridOption;
  gridOptions4: GridOption;
  gridOptions2: GridOption;
  gridOptions6: GridOption;
  gridOptions7: GridOption;
  gridOptions8: GridOption;
  gridOptions9: GridOption;
  gridOptions10: GridOption;
  gridOptions11: GridOption;
  dataset: any[];
  angularGrid1: AngularGridInstance;
  angularGridParent: AngularGridInstance;
  angularGridChild: AngularGridInstance;
  angularGridChild1: AngularGridInstance;
  angularGrid4: AngularGridInstance;
  angularGrid6: AngularGridInstance;
  angularGrid7: AngularGridInstance;
  angularGrid8: AngularGridInstance;
  angularGrid9: AngularGridInstance;
  angularGrid10: AngularGridInstance;
  angularGrid11: AngularGridInstance;
  totalData: number;
  selectedTitles = [];
  selectedTitles2 = [];
  gridObj1: any;
  gridObjParent: any;
  gridObjChild: any;
  gridObjChild1: any;
  gridObj4: any;
  gridObj6: any;
  gridObj7: any;
  gridObj8: any;
  gridObj9: any;
  gridObj10: any;
  gridObj11: any;
  show: boolean;
  selected: number;
  ticketId: string;
  name: string;
  desc: string;
  brief: string;
  rDate: string;
  dDate: string;
  comment: string;
  priority: string;
  percent: number;
  urgencies = [];
  impacts = [];
  impact: number;
  urgency: number;
  ticketTypes: any;
  ticketTypesSearch: any;
  solution: string;
  types = [];
  rca: string;
  respObject: any;
  assignedUser: any;
  assignedGroup: any;
  currentUser: string;
  currentGroup: string;
  groups = [];
  supportGroupSelected: number;
  statusSelected: number;
  users = [];
  masterClientId: number;
  status = [];
  userSelected: number;
  assignee_copy: string;
  public tId: any;
  lastCatId: number;
  lastParentId: number;
  totalItems: number;
  statusName: string;
  public wfcresultId: any;
  respTime: string;
  comments = [];
  assignedToMe = false;
  closedticket = false;
  endIndicator = true;
  slaViolated = false;
  logs = [];
  count: number;
  solutions = [];
  createdByMe = false;
  attachments = [];
  attachment = [];
  nameMsg: any;
  nameMsg1: any;
  termattachment = [];
  replyAttachment = [];
  uploadButtonName = '';
  fileUploadUrl: string;
  formData: any;
  menus = [];
  ticketTab: boolean;
  commentsTab = true;
  internalCommnetTab: boolean;
  solTab = true;
  attachTab = true;
  logTab = true;
  tabs: any;
  hasFollowupUser: boolean;
  followupUser: string;
  slaString: any;
  outerColor: any;
  innerColor: any;
  outerColorResp: any;
  innerColorResp: any;
  masterNameObj = [];
  page = 1;
  MAX_SIZE = 4;
  collectionSize: number;
  LIMIT = 7;
  start = 0;
  isDisabled: boolean;
  dynamicFields: any;
  masterNameSelected: number;
  data = [];
  viewIncidentData = [];
  columnData = [];
  columnDefinitions1 = [];
  columnDefinitions2 = [];
  columnDefinitions3 = [];
  columnDefinitions4 = [];
  columnDefinitions5 = [];
  columnDefinitions6 = [];
  columnDefinitions7 = [];
  columnDefinitions8 = [];
  columnDefinitions9 = [];
  columnDefinitions10 = [];
  columnDefinitions11 = [];
  showGrid = false;
  columnData1 = [];
  columnData3 = [];
  columnData4 = [];
  columnData6 = [];
  columnData7 = [];
  columnData8 = [];
  columnData10 = [];
  columnData11 = [];
  showGrid1 = false;
  showGridForViewIncident = false;
  showGridForAddIncident = false;
  showGridForAttachTicket = false;
  data2 = [];
  masterDataNameSelected: number;
  actions = [];
  escalatedTicket = false;
  isAsset: boolean;
  addIncidentData = [];
  selectedTitles4 = [];
  isApprovedTicket: boolean;
  isApproved: string;
  worker: any;
  searchTid: string;
  ticketCount: number;
  isAddIncident: boolean;
  isViewIncident: boolean;
  canAddSolution: boolean;
  canAddComment: boolean;
  canAddIntComment: boolean;
  typeSeq: any;
  subRadioDisplay: boolean;
  subtypes = [];
  subTypeId: any;
  PROBLEM_SOLUTION_PROVIDED = 103;
  PROBLEM_TYPE_SEQ = 2;
  CHILD_TICKET_SEQ = 24;
  folderLoaded = false;
  solLoaded: boolean;
  comLoaded: boolean;
  privateComLoaded: boolean;
  resoTime: string;
  hideAttachment: boolean;
  replyHideAttachment: boolean;
  attachMsg: string;
  userGroups = [];
  userGroupSelected = 0;
  assetDisplayed: boolean;
  isRInfo: boolean;
  email: string;
  mobile: string;
  username: string;
  respPercent: number;
  slaStringResp: string;
  slaViolatedResp: boolean;
  // groupName: string;
  wGroups = [];
  public activateUserReplay: boolean;
  usersReply: string;
  searchType: string;
  searchTypeStatus: string;
  searchText: string;
  psInfo = [];
  // public grpLevel: number;
  statusDisabled: boolean;
  isLowestLevel: boolean;
  lastComment: string;
  solProvided = false;
  diplaySLAMeter: boolean;
  lastSol: string;
  public isSelfAssigned: boolean;
  displayClaimNo: boolean;
  claimNo: string;
  lastCommentUser: string;
  public followUps = [];
  public followUpSelected: number;
  isFollowUp: boolean;
  escLevel: string;
  catFilterVal = 0;
  userFilterVal = 0;
  statusComment: string;
  displayNewComment: boolean;
  displayNewAttachment: boolean;
  displayNewSolutions: boolean;
  ticketIdSearchLoaded: boolean;
  allStatus = [];
  filterSearchLoaded: boolean;
  categoryLoaded = false;
  inciCategories = [];
  searchCat = [];
  startDate: any;
  endDate: any;
  priorityType: number;
  isChangeStatus: boolean;
  isUserReplied: boolean;
  typeChecked: number;
  diffTypeId: number;
  clientId: number;
  userGroupId: number;
  grpLevel: number;
  groupName: string;
  @Input() isSearch: boolean;
  @Input() isViewTicket: boolean;
  @Input() isCreateTicket: boolean;
  @Output() tabledata = new EventEmitter();
  @Output() search = new EventEmitter();
  searchStatusSelected: number;
  isBlankRequester = false;
  isBlankDesc = false;
  isBlankLong = false;
  isBlankClaim = false;
  fromDate: string;
  toDate: string;
  minDate: any;
  maxDate: any;
  formdata: any;
  nextOffset = 0;
  searchPageSize: number;
  top: number;
  skip: number;
  query: any;
  service: any;
  totalSearchItems: number;
  selectForChildTicket = '';
  isDisplayCreateTicket = true;
  isDisplayExistingTicket = true;
  existingTicketId = '';
  angularGrid5: AngularGridInstance;
  gridObj5: any;
  gridOptions5: GridOption;
  columnData5 = [];
  selectedTitles5: any;
  public childTickets = [];
  crTickets = [];
  prTickets = [];
  taskTickets = [];
  checkLists = [];
  pTask: any;
  selectedIndextab: number;
  isAttachTicket = false;
  selectable = true;
  removable = true;
  resolution_status: string;
  reponse_status: string;
  respClockStatus: string;
  resoClockStatus: string;
  reponseStatus: boolean;
  resolutionStatus: boolean;
  parentDetails = [];
  parentId: string;
  isDemoTabOpen = false;
  pageSize = 100;
  columnNameSelected = 0;
  columnDataObj = [];
  columnName: string;
  assetValue: string;
  checklistData = [];
  isChecklist: boolean;
  assetLists = [];
  assetIds: string;
  ticketAsset: string;
  showAssetdatagrid = false;
  public assetDetails = [];
  userAssign: boolean;
  canForward: boolean;
  MAX_FILE_UPLOAD = 10;
  isContractUser: boolean;
  isContractDisabled: boolean;
  hideNotifier: boolean;
  addSelfPermission: boolean;
  SECURITY_SUPPORT_GROUP: number;
  SECURITY_CATEGORIES = [];
  disableForSecurityGroup: boolean;
  incidentId: number;
  internalComments = [];
  privateComment: string;
  noOfHops: number;
  priorityChangeCount: number;
  hideAdditionalField: boolean;
  isAddAssetDisable: boolean;
  receiver: string;
  subject: string;
  mail: string;
  cc: string;
  internalMessageTab: boolean;
  closureArr = [];
  closureSelected: number;
  remainingSlaResponse: string;
  remainingSla: string;
  followUpCnt: number;
  is_approved_problem_ticket = 90;
  rootCause: string;
  isProblemTicket: boolean;
  slaRespResn: string;
  slaResoResn: string;
  slaViolationType: number;
  resoViolationType = 1;
  respViolationType = 2;
  slaViolationReasonType: number;
  slaViolationReasonArr = [];
  ticketDetails = [];
  isReadonly = true;
  vendors = [];
  vendorSelected: number;
  vendorUser: string;
  isViewChildTicket: boolean;
  showGridForViewChildTicket: boolean;
  showGridForViewTicket: boolean;
  showGridForViewCR: boolean;
  showGridForViewPR: boolean;
  searchTicketWorkingCat: number;
  searchTicketStatusSeq: number;
  canAttach: boolean;
  followupUsersName: string;
  followupRemarks: string;
  isAttachParent = false;
  hideAddExistingRadio = false;
  hideAttachToParentRadio = true;
  // ==============sutirha=============
  isRCA: boolean;
  // public displayCreateTicket1: number;
  title: string;
  userName: string;
  corDesc: string;
  preDesc: string;
  preTitle: string;
  corTitle: string;
  isIncidentTicket: boolean;
  isSrTicket: boolean;
  type: string;
  supportGrpTime: any;
  branchId: number;
  responseDueDateTime: string;
  resolutionDueDateTime: string;
  branchWorkingHour: any;
  holidayList = [];
  customerName: string;
  branchName: string;
  slaCalculationBasedOn: string;
  // clientTicketTypes: any;
  INCIDENT_SEQ = 1;
  SR_SEQ = 2;
  PTASK_SEQ = 8;
  STASK_SEQ = 3;
  CTASK_SEQ = 5;
  CR_SEQ = 4;
  PR_SEQ = 6;
  hasAsset: boolean;
  sTask: any;
  showStask: boolean;
  isAddStask: boolean;
  isAttachCR: boolean;
  isAttachPR: boolean;
  hideChild: boolean;
  oldPriorityId: number;
  hideChangePriorityBtn = true;
  hasAssetCR: boolean;
  hasAssetPR: boolean;
  cr_id: any;
  pr_id: any;
  showCR: boolean;
  showPR: boolean;
  isViewCR: boolean;
  isViewPR: boolean;
  isViewRefTicket: boolean;
  allChildTickets = [];
  extTicketDetails = [];
  creatorInfo: boolean;
  external_id: string;
  tool_id: any;
  ticketGroupId: number;
  isStopSlaMeter: boolean;
  isSubClient: boolean;
  external_ticket: string;
  cmdbObj = [];
  cmdbSelected: number;
  selectedTitles10: any;
  isAddCmdb: boolean;
  addCmdbAssetData = [];
  showGridForCmdbAsset: boolean;
  // correctives = [];
  // preventives = [];
  // public displayCreateTicket: number;
  cmdbAssetName: string;
  showGridForViewCmdbAsset: boolean;
  isViewCmdbAsset: boolean;
  allCmdbAssetData = [];
  cmdbTypeSelected: number;
  ticketRelation: string;
  isTaskOrChild: boolean;
  assetData = [];
  @ViewChild('assetContent') assetModal: any;
  dialogRef3: any;
  parentSeq: any;
  commentMaxLength: number;

  time: any;
  effort_estimation: any;
  totalAssect: any;
  noAsset: boolean;
  usrInfo = [];
  usrEmail: string;
  usrMobileNo: string;
  usrVIP: string;
  isVip: boolean;
  isTick: boolean;
  timeSpent: any;
  remark: string;
  AnalystWiseEffort = [];
  sgWiseEffort = [];
  totalEffort: string;
  effHours: any;
  effMin: any;
  // @ViewChild('effortContent') effortModal: any;
  @ViewChild('listusers') private listusers: any;
  showEfforts: boolean;
  @ViewChild('content') private content;
  private groupDetails: any;
  private statusIndex: any;
  createbyid: any;
  private gid: number;
  private gid_copy: number;
  private aid: any;
  private modalReference: NgbModalRef;
  private slaTime: any;
  private SLA_INTERVAL_TIME = 30 * 1000;
  private masterName: string;
  private addedTicket = [];
  @ViewChild('checkterm') private checkterm;
  @ViewChild('selectState') private selectState;
  @ViewChild('userInfo') private userInfo;
  @ViewChild('termfilter') private termfilter;
  @ViewChild('addcommentterm') private addcommentterm;
  @ViewChild('addvendorticket') private addvendorticket;
  @ViewChild('addCommentForCancel') private addCommentForCancel;

  @ViewChild('groupSelect') private groupSelect;

  priorityId: number;

  private modalSubscribe: Subscription;

  @ViewChild('checklist') private checklist;
  private dialogRef2: MatDialogRef<any, any>;
  private ticketSubscribe: Subscription;
  private commentDialogRef: MatDialogRef<any, any>;
  private userAuth: Subscription;
  orgId: number;
  orgTypeId: number;
  recordDetails = [];
  statename: string;
  stageId: number;
  transitionid: any;
  private currentstateid: number;
  private auserid: number;
  private agroupid: number;
  private workflowid: number;
  private impactid: number;
  private urgencyid: number;
  public sourcetype: string;
  stategroups = [];
  nextstates = [];
  grpSelected: number;
  searchUser: FormControl = new FormControl();
  isLoading: boolean;
  userList = [];
  userNameSelected: string;
  private workingtypeid: number;
  private workingid: number;
  termNames = [];
  termNameSelected: any;
  showComment: boolean;
  termstypeidd: number;
  termNameValue: any;
  dropDownValue = [];
  isShowButton: boolean;
  previousTerms = [];
  categoryArr = [];
  categoryArrSearch = [];
  lastLebelId: number;
  priorities = [];
  priorityName: string;
  priorityArry = {};
  private statustypeid: number;
  private statusid: number;
  private nextWokflowstateid: number;
  stateterms = [];
  private checktermdialog: MatDialogRef<unknown, any>;
  lastgroup: string;
  lastuser: string;
  attachFile: any;
  commonTab: boolean;
  transitions = [];
  stateSelected: number;
  manualstateselection: number;
  private loginClientId: number;
  private loginOrgId: number;
  private loginOrgTypeId: number;
  manualgroups = [];
  manualgroupid: number;
  manualUserNameSelected: any;
  manualSearchUser: FormControl = new FormControl();
  manualUserList = [];
  private manualUserSelected: number;
  userinfo = [];
  private infoRef: MatDialogRef<unknown, any>;
  columnDefinitionsView = [];
  assetTab: boolean;
  viewAssetTab: boolean;
  gridObj: any;
  angularGrid: AngularGridInstance;
  gridOptionsA: GridOption;
  gridOptionsView: GridOption;
  showGridA1 = false;
  showGridView = false;
  columnValueObj: any[];
  columnNameObj: any[];
  columnNameObj1: any[];
  columnValueObj1: any[];
  ticketAssetIds = [];
  Tickets = [];
  dataA: any[];
  columnDefinitionsA: any[];
  dataView: any[];
  numbers: number;
  interval;
  creatortimedetails = [];
  weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  loginOrgName: string;
  manualStateLoading: boolean;
  ticketdata: any;
  changeGroupName: string;
  statusseq: number;

  CLOSE_STATUS_SEQ = 8;
  CANCEL_STATUS_SEQ = 11;
  REPOEN_STATUS_SEQ = 10;
  RESOLVE_STATUS_SEQUENCE = 3;
  CREATED_STATUS_SEQ = 1;
  PENDING_USER_STATUS_SEQ = 5;
  USER_REPLIED_STATUS_SEQ = 9;
  ACTIVE_STATUS_SEQ = 2;
  OPEN_STATUS_SEQ = 29;
  WIP_SEQ = 16;
  PENDING_APPROVAL = 12;
  REJECTED_STATUS_SEQ = 14;
  PENDING_REQUESTER_INPUT = 13;

  PRIORITY_SEQ = 4;
  TICKET_TYPE_SEQ = 1;

  COMMENT_TERM_SEQ = 11;
  ATTACHEMNT_TERM_SEQ = 1;
  VENDOR_ID_TERM = 5;
  VENDOR_NAME_TERM = 4;
  PRIORITY_CHANGE_TERM = 27;
  REASSIGNMENT_TERM = 28;
  RESP_CODE_TERM = 23;
  RESP_COMMENT_TERM = 24;
  RESO_CODE_TERM = 26;
  RESO_COMMENT_TERM = 25;
  FOLLOWUP_COUNT_COMMENT_TERM = 29;
  OUTBOUND_COUNT_TERM = 30;
  EFFORT_SEQ = 31;

  INTERNAL_COMMENT_TERM_SEQ = 22;
  EFFORT_COMMENT_TERM_SEQ = 32;
  CATEGORY_COMMENT_TERM_SEQ = 80;

  hiddenManualState: boolean;
  tNumber: string;
  searchTicketdetails = [];
  attachedTicket = [];
  showChildTicket: boolean;
  showTaskTicket: boolean;
  showParentTicket: boolean;
  columnDefinitionschild = [];
  columnDefinitionschild1 = [];
  columnDefinitionsTask = [];
  gridOptionsChild: GridOption;
  gridOptionsParent: GridOption;
  rLoc: string;
  rMobile: string;
  rEmail: string;
  rName: string;
  prioritydisable: boolean;
  private prevpriorityId: number;
  priority_type_id: number;

  STATUS_SEQ = 2;
  isCreatedState: boolean;
  isCreator: boolean;

  @ViewChild('myTemplateRef') showTemplate;
  isModal = true;
  private isChangeCategory: boolean;

  isTermNameDetails: boolean = false;
  termNameDetails = [];
  termNameDetailsSelected: number;
  termsDetailsvalue: any;
  showPriority: boolean;
  private filterDialogRef: MatDialogRef<unknown, any>;
  changeStateButton: string;
  vendorDetails = [];
  vendorid: string;
  vendorname: string;
  attachedFiles = [];
  private prevaddfields = [];
  nextstatusseq: number;
  respOverdue: string;
  resoOverdue: string;
  private statusArry: any;
  orgrequestername: string;
  orgrequesteremail: string;
  orgrequestermobile: string;
  orgrequesterlocation: string;
  responseslaviolated: string;
  resolutionslaviolated: string;
  resolutionduetime: string;
  maxfilesize: number;
  commentTerm: string;
  private commenttermdialog: MatDialogRef<unknown, any>;
  private termopentype: string;
  private multitermopentype: string;
  private slabreachcount: number;
  private respbreachcomment: boolean;
  private resobreachcomment: boolean;
  agrouplvl: number;
  reopencount: number;
  outboundcount: number;
  pendingvendoractioncount: number;
  customercommentcount: number;
  selectedColor: any;
  footerCss: any;
  dashbordTittleCss: any;
  buttonCss: any;
  pageNameCss: any;
  tableCss: any;
  darkCss: any;
  colorObj: any;

  termValueBySeq = [];
  isChecked: boolean;
  parentChildCollabArr = [];
  parentChildCollabLoaded: boolean = false;
  private originaluserid: number;


  private timePickerRef: MatDialogRef<any, any>;
  @ViewChild('timepicker') timepicker;
  selectedTime: any;
  requestorName: any;
  requestorLogin: any;
  requestorLocation: any;
  shortDescription: any;
  fromCreatedDate: any;
  toCreatedDate: any;
  todayDate = new Date();
  todayMonth = this.todayDate.getMonth();
  todayDay = this.todayDate.getDate();
  todayYear = this.todayDate.getFullYear();
  min = new Date(this.todayYear, this.todayMonth, this.todayDay);
  assignmentGroupArr = [];
  selectedSupportGroup: any;
  Hours = [];
  Minutes = [];
  selectedHour: any;
  selectedMinute: any;

  recordType = [];
  ticket_type_seq = 1;
  configtype: number;
  typSelected: any;
  ticketsTyp: any;
  previouscat = [];
  ticketTypeArr = {};
  isWrongCategory: boolean;
  hascatalog: string;
  private attachparentmodalRef: NgbModalRef;
  isSearchTicket: boolean;
  isAttachedTicket: boolean;
  documentName: any;
  orginalDocumentName = [];
  documentPath: any;

  searchArr = [
    {'id': 1, 'value': 'Requestor Name'},
    {'id': 2, 'value': 'Requestor Login ID'},
    {'id': 3, 'value': 'Requestor Location'},
    {'id': 4, 'value': 'Short Description'},
    {'id': 5, 'value': 'Date'},
    {'id': 6, 'value': 'Assignment Group'},
    {'id': 7, 'value': 'Priority'},
    {'id': 8, 'value': 'Category'},
    {'id': 9, 'value': 'Ticket ID'}
  ];
  selectedID: any;
  hiddenChildAttach: boolean = true;
  hiddenRequestorName: boolean = false;
  hiddenRequestorLoginId: boolean = false;
  hiddenRequestorLocation: boolean = false;
  hiddenShortDescription: boolean = false;
  hiddenDate: boolean = false;
  hiddenAssignmentGroup: boolean = false;
  hiddenPriority: boolean = false;
  hiddenCategory: boolean = false;
  aging: number;
  searchPriorityId: number;
  private rowChildSelected = [];
  private selectedChildTitles: any[];
  hiddenTicketId: boolean;
  searchTicketId: string;


  searchRequestorName: FormControl = new FormControl();
  requestorNameList = [];
  requestorNameSelected: any;
  searchRequestorLogIn: FormControl = new FormControl();
  requestorLogInList = [];
  requestorLogInSelected: any;
  searchRequestorLocation: FormControl = new FormControl();
  requestorLocationList = [];
  requestorLocationSelected: any;
  ticketIdMail: any;
  sendSubject: any;
  isSameGroup: boolean;
  canChangeUser: boolean;
  hasSLA: boolean;
  showCreateTicket: boolean;
  sr_id: number;
  private parentIdno: number;
  private nexttransitionid: number;
  currentRate = 0;
  creatorgrpid: number;
  attachChildTab: boolean;
  parentChildCollabTab: boolean;
  instantMessagingTab: boolean;
  createTaskTab: boolean;
  cloneBtn: boolean;
  cancelBtn: boolean;
  reopenBtn: boolean;
  closeBtn: boolean;
  userRepliedBtn: boolean;
  updateStatusBtn: boolean;
  custVisibleCount: boolean;
  prioChangeCount: boolean;
  agingCount: boolean;
  hopCount: boolean;
  reopenCount: boolean;
  userFollowCount: boolean;
  outBoundCount: boolean;
  viewTaskTab: boolean;
  addEffortBtn: boolean;
  attachParentBtn: boolean;
  isassetattached: boolean;
  scheduletab = [];
  selectedTab: number;
  plantab = [];
  ticNumber: string;
  searchdetails = [];
  isLinkedSearchTicket: boolean;
  isLinkAttachedTicket: boolean;
  linkAttachedTicket = [];
  canDetach: boolean;
  currentstatustypeid: number;
  currentstatusid: number;
  parentSource: string;
  childSource: string;
  pId: any;
  pDesc: any;
  pStatus: any;
  pstime: any;
  petime: any;
  displayPriority: boolean;
  extras = [];
  displayMandatory: boolean;
  private termstartdate: string;
  private termenddate: string;
  attachCmdb: boolean;
  private schedulevalue = [];
  private planvalue = [];
  private isschedulechange: boolean;
  private isplanchange: boolean;
  ticketidlabel: string;
  groupUsers = [];
  private listusersdialog: MatDialogRef<unknown, any>;
  attachUserAssigned: boolean;
  categoryUpdateBtn: boolean;
  additionalFieldBtn: boolean;
  convertBtn: boolean;
  private actparamssub: Subscription;
  noConversion: boolean;
  locations = [];
  locationName = '';
  locationSelected = '';
  searchLocation: FormControl = new FormControl();
  locationId = '';
  priorityLocationList = [];
  ticketCatId: boolean;
  createUrl: any;
  private lastgroupid: number;
  linkedticket: string;
  haspermission: boolean;
  estimatedEffortName: string;
  crtype: string;
  url: string;
  showLastDetails: boolean;
  isdataLoaded: boolean;
  isStatusChange: boolean;
  usersList = [];
  searchCCUser: FormControl = new FormControl();
  userEmail = [];
  separatorKeysCodes: number[] = [ENTER,COMMA,SEMICOLON,SPACE];
  @ViewChild('UserInput') UserInput: ElementRef<HTMLInputElement>;
  @ViewChild('userAuto') matAutocomplete: MatAutocomplete;
  userdFruits: Observable<string[]>;
  dataLoadedForSendMail: boolean;
  private oldtId = 0;
  private oldvendorid: string;
  private addvendortickettermdialog: MatDialogRef<unknown, any>;
  private VENDOR_TICKET_SEQ = 5;
  dataLoadedForAddButton: boolean;

  constructor(private messageService: MessageService, private rest: RestApiService, private route: Router, private notifier: NotifierService,
              private modalService: NgbModal, private dialog: MatDialog, private actRoute: ActivatedRoute, private config: ConfigService,
              private rating: NgbRatingConfig) {
    this.searchCCUser.valueChanges.subscribe(
      psOrName => {
        const data = {
          email: psOrName,
          clientid: this.loginClientId,
          mstorgnhirarchyid: this.loginOrgId,
        };
        this.isLoading = true;
        if (psOrName !== '') {
          this.rest.searchanalystorgwise(data).subscribe((res1) => {
            this.respObject = res1;
            this.isLoading = false;
            if (this.respObject.success) {
              this.usersList = this.respObject.details;
            } else {
              this.notifier.notify('error', this.respObject.message);
            }
          }, (err) => {
            this.isLoading = false;
            this.notifier.notify('error', this.messageService.SERVER_ERROR);
          });
        } else {
          this.isLoading = false;
          // this.userSelected = 0;
          this.usersList = [];
        }
      });
  }

  ngOnInit() {
    this.ticketCatId = false;
    this.rating.max = 5;
    for (let i = 0; i < 24; i++) {
      if (i < 10) {
        this.Hours.push('0' + i);
      } else {
        this.Hours.push(i);
      }
    }
    for (let i = 0; i < 12; i++) {
      if ((5 * i) < 10) {
        this.Minutes.push('0' + (5 * i));
      } else {
        this.Minutes.push((5 * i));
      }
    }

    this.isStatusChange = false;
    this.isdataLoaded = false;
    this.dataLoadedForSendMail = false;
    this.ticketTypeArr = {};
    this.toCreatedDate = this.min;
    this.parentChildCollabLoaded = false;
    this.isChecked = false;
    this.maxfilesize = this.config.MAX_FILE_SIZE;
    this.colorObj = this.messageService.colors;
    this.isModal = true;
    this.dataLoadedForAddButton = false;
    this.isTermNameDetails = false;
    this.termNameDetails = [];
    this.gridOptionsA = {
      enableAutoResize: true,       // true by default
      enableCellNavigation: true,
      enableFiltering: true,
      editable: true,
      rowSelectionOptions: {
        selectActiveRow: false
      },
      enableCheckboxSelector: true,
      enableRowSelection: true,
    };
    this.gridOptionsView = {
      enableAutoResize: true,       // true by default
      enableCellNavigation: true,
      enableFiltering: true,
      editable: true,
      rowSelectionOptions: {
        selectActiveRow: false
      },
      enableCheckboxSelector: true,
      enableRowSelection: true,
    };
    this.gridOptionsChild = {
      enableAutoResize: true,       // true by default
      enableCellNavigation: true,
      enableFiltering: true,
      editable: true,
      rowSelectionOptions: {
        selectActiveRow: false
      },
      enableCheckboxSelector: false,
      enableRowSelection: true,
    };
    this.gridOptionsParent = {
      enableAutoResize: true,       // true by default
      enableCellNavigation: true,
      enableFiltering: true,
      editable: true,
      rowSelectionOptions: {
        selectActiveRow: false
      },
      enableCheckboxSelector: false,
      enableRowSelection: true,
    };
    if (this.messageService.color) {
      this.selectedColor = this.messageService.color;
      for (let i = 0; i < this.colorObj.length; i++) {
        if (this.selectedColor === this.colorObj[i].selectedValue) {
          this.tableCss = this.colorObj[i].tableCss;
          this.darkCss = this.colorObj[i].darkCss;
          this.pageNameCss = this.colorObj[i].pageNameCss;
          this.buttonCss = this.colorObj[i].buttonCss;
        }
      }
    }
    this.messageService.getColor().subscribe((data: any) => {
      this.selectedColor = data;
      for (let i = 0; i < this.colorObj.length; i++) {
        if (this.selectedColor === this.colorObj[i].selectedValue) {
          this.tableCss = this.colorObj[i].tableCss;
          this.darkCss = this.colorObj[i].darkCss;
          this.pageNameCss = this.colorObj[i].pageNameCss;
          this.buttonCss = this.colorObj[i].buttonCss;
        }
      }
    });
    this.fileUploadUrl = this.rest.apiRoot + '/fileupload';

    // this.dataLoaded = true;
    this.ticketTab = false;
    this.commonTab = true;
    this.viewAssetTab = true;
    this.assetTab = true;
    this.commentMaxLength = this.messageService.commentMaxLength;
    this.privateComLoaded = true;
    this.isSelfAssigned = true;
    this.ticketTypeLoaded = true;
    if (this.messageService.clientId) {
      // console.log(".............okkkkkkkkkk")
      this.loginClientId = this.messageService.clientId;
      this.userGroups = this.messageService.group;
      this.userGroupSelected = this.userGroups[0].id;
      this.loginOrgId = this.messageService.orgnId;
      this.loginOrgTypeId = this.messageService.orgnTypeId;
      this.loginOrgName = this.messageService.mstorgnname;
      if (this.userGroups !== undefined) {
        if (this.messageService.getSupportGroup() === null) {
          this.userGroupId = this.userGroups[0].id;
          this.groupName = this.userGroups[0].groupname;
          this.grpLevel = this.userGroups[0].levelid;
          this.hascatalog = this.userGroups[0].hascatalog;
        } else {
          const group = this.messageService.getSupportGroup();
          this.userGroupId = Number(group.groupId);
          // this.groupName = group.grpName;
          // this.grpLevel = group.levelid;
          // this.hascatalog = group.hascatalog;
          for (let i = 0; i < this.userGroups.length; i++) {
            if (this.userGroups[i].id === this.userGroupId) {
              this.groupName = this.userGroups[i].groupname;
              this.grpLevel = this.userGroups[i].levelid;
            }
          }
          // this.grpLevel = group.level;
        }
        this.userGroupSelected = this.userGroupId;
      }
      this.onPageLoad();

    }
    this.userAuth = this.messageService.getClientUserAuth().subscribe(auth => {
      this.userGroups = auth[0].group;
      this.loginClientId = auth[0].clientid;
      this.loginOrgId = auth[0].mstorgnhirarchyid;
      this.loginOrgTypeId = auth[0].orgntypeid;
      this.loginOrgName = auth[0].mstorgnname;
      if (this.userGroups !== undefined) {
        if (this.messageService.getSupportGroup() === null) {
          this.userGroupId = this.userGroups[0].id;
          this.groupName = this.userGroups[0].groupname;
          this.grpLevel = this.userGroups[0].levelid;
        } else {
          const group = this.messageService.getSupportGroup();
          this.userGroupId = group.groupId;
          // this.groupName = group.grpName;
          // this.grpLevel = group.levelid;
          for (let i = 0; i < this.userGroups.length; i++) {
            if (this.userGroups[i].id === this.userGroupId) {
              this.groupName = this.userGroups[i].groupname;
              this.grpLevel = this.userGroups[i].levelid;
            }
          }
        }
        this.userGroupSelected = this.userGroupId;
      }
      this.onPageLoad();
    });
  }

  initialData() {
    console.log('initial data');
    this.dataLoadedForAddButton = false;
    this.showLastDetails = false;
    this.estimatedEffortName = '';
    this.crtype = '';
    this.haspermission = false;
    this.linkedticket = '';
    this.lastgroupid = 0;
    this.createUrl = '';
    this.noConversion = false;
    this.convertBtn = false;
    this.additionalFieldBtn = false;
    this.categoryUpdateBtn = false;
    this.isplanchange = false;
    this.isschedulechange = false;
    this.schedulevalue = [];
    this.planvalue = [];
    this.attachUserAssigned = false;
    this.attachCmdb = false;
    this.termenddate = '';
    this.termstartdate = '';
    this.displayMandatory = true;
    this.displayPriority = true;
    this.canDetach = false;
    this.linkAttachedTicket = [];
    this.isLinkAttachedTicket = true;
    this.isLinkedSearchTicket = false;
    this.scheduletab = [];
    this.plantab = [];
    this.searchdetails = [];
    this.isassetattached = false;
    this.viewTaskTab = false;
    this.attachParentBtn = false;
    this.addEffortBtn = false;
    this.showTaskTicket = false;
    this.viewAssetTab = false;
    this.custVisibleCount = false;
    this.prioChangeCount = false;
    this.agingCount = false;
    this.hopCount = false;
    this.reopenCount = false;
    this.userFollowCount = false;
    this.outBoundCount = false;
    this.cloneBtn = false;
    this.cancelBtn = false;
    this.reopenBtn = false;
    this.closeBtn = false;
    this.userRepliedBtn = false;
    this.updateStatusBtn = false;
    this.createTaskTab = false;
    this.instantMessagingTab = false;
    this.parentChildCollabTab = false;
    this.attachChildTab = false;
    this.ticketTab = false;
    this.nexttransitionid = 0;
    this.parentIdno = 0;
    this.sr_id = 0;
    this.showCreateTicket = false;
    this.isSameGroup = false;
    this.canChangeUser = false;
    this.isCreator = false;
    this.searchPriorityId = 0;
    this.aging = 0;
    this.isAttachedTicket = true;
    this.isSearchTicket = false;
    this.originaluserid = 0;
    this.attachedTicket = [];
    this.customercommentcount = 0;
    this.reopencount = 0;
    this.outboundcount = 0;
    this.pendingvendoractioncount = 0;
    this.multitermopentype = '';
    this.termattachment = [];
    this.termopentype = '';
    this.terminateWorker();
    this.canForward = false;
    this.resolutionduetime = '';
    this.resolutionslaviolated = 'NO';
    this.responseslaviolated = 'NO';
    this.orgrequestername = '';
    this.orgrequesteremail = '';
    this.orgrequesterlocation = '';
    this.orgrequestermobile = '';
    this.statusArry = {};
    this.respOverdue = '';
    this.resoOverdue = '';
    this.nextstatusseq = 0;
    this.prevaddfields = [];
    this.vendorid = '';
    this.vendorname = '';
    this.vendorDetails = [];
    this.dataLoaded = false;
    this.changeStateButton = 'Update Status';
    this.termNames = [];
    this.isCreatedState = false;
    this.showPriority = false;
    this.priorities = [];
    this.priorityId = 0;
    this.prevpriorityId = 0;
    this.previousTerms = [];
    this.isChangeCategory = false;
    this.isViewChildTicket = true;
    this.hiddenManualState = false;
    this.changeGroupName = '';
    this.manualStateLoading = true;
    this.isVip = false;
    this.manualgroupid = 0;
    this.creatortimedetails = [];
    this.manualUserList = [];
    this.dynamicFields = [];
    this.ticketTypes = [];
    this.transitions = [];
    this.manualgroups = [];
    this.lastgroup = '';
    this.lastuser = '';
    this.rName = '';
    this.rEmail = '';
    this.rMobile = '';
    this.rLoc = '';
    this.desc = '';
    this.brief = '';
    this.rDate = '';
    this.transitionid = 0;
    this.currentstateid = 0;
    this.auserid = 0;
    this.agroupid = 0;
    this.agrouplvl = 0;
    this.workflowid = 0;
    this.impactid = 0;
    this.urgencyid = 0;
    this.sourcetype = '';
    this.stategroups = [];
    this.nextstates = [];
    this.stateterms = [];
    this.grpSelected = 0;
    this.userNameSelected = '';
    this.workingtypeid = 0;
    this.workingid = 0;
    this.isDisabled = false;
    this.isShowButton = false;
    this.statename = '';
    this.statusName = '';
    this.priority = '';
    this.priorityArry = {};
    this.statustypeid = 0;
    this.statusid = 0;
    this.stateSelected = 0;
    this.nextWokflowstateid = 0;
    this.manualstateselection = 0;
    this.createbyid = 0;
    this.showGridView = false;
    this.showChildTicket = false;
    this.showParentTicket = false;
    this.categoryLoaded = false;
    this.selectedIndextab = -1;
    this.statusseq = 0;
    this.typeChecked = 0;
    this.hasSLA = true;
    this.isdataLoaded = false;

    this.isStatusChange = false;
    this.dataLoadedForSendMail = false;
    this.usersList = [];
    this.userEmail = [];

    this.getTicketDetails();
  }

  onPageLoad() {
    // console.log("this.grpLevel",this.grpLevel)
    this.columnDefinitionschild = [
      {
        id: 'code',
        name: 'Ticket Id',
        field: 'code',
        minWidth: 200,
        sortable: true,
        filterable: true
      },
      {
        id: 'title',
        name: 'Ticket Title',
        field: 'title',
        minWidth: 200,
        sortable: true,
        filterable: true
      },
      {
        id: 'createdby',
        name: 'Created By',
        field: 'createdby',
        minWidth: 150,
        sortable: true,
        filterable: true
      },
      {
        id: 'createddatetime',
        name: 'Created Since',
        field: 'createddatetime',
        minWidth: 150,
        sortable: true,
        filterable: true
      },
      {
        id: 'status', name: 'Status', field: 'status', sortable: true, minWidth: 150, filterable: true
      },
      {
        id: 'duedate',
        name: 'Due Date',
        field: 'duedate',
        minWidth: 150,
        sortable: true,
        filterable: true
      }, {
        id: 'priority',
        name: 'Priority',
        field: 'priority',
        minWidth: 100,
        sortable: true,
        filterable: true
      }];
    this.slabreachcount = 1;
    this.modalSubscribe = this.messageService.getModalData().subscribe((olddata) => {
      console.log('modal opening');
      this.ticketdata = olddata;
      // this.ticketId = olddata.code;
      this.tId = olddata.id;
      this.url = this.messageService.getNavigation();
      this.initialData();
      this.isModal = true;
      this.modalReference = this.modalService.open(this.content, {size: 'lg', windowClass: 'modalheight'});
      this.modalReference.result.then((result) => {
        this.terminateWorker();
      }, (reason) => {
        this.terminateWorker();
        // this.messageService.setCloseModalData('');
      });
    });
    this.actparamssub = this.actRoute.queryParams.subscribe((params: any) => {
      if (!this.messageService.isEmpty(params)) {
        console.log('page opening');
        this.ticketdata = params;
        // this.ticketId = params.code;
        // if (this.oldtId !== 0) {
        //   this.clearUserTicket(this.oldtId);
        // }
        this.url = this.messageService.getNavigation();
        this.tId = Number(params.id);
        // this.oldtId = Number(params.id);
        // this.diffTypeId = Number(params.dt);
        this.isModal = false;
        // this.showTemplate;
        this.initialData();
      }
    });

    this.isLoading = false;
    this.searchLocation.valueChanges.subscribe(
      psOrName => {
        const data = {
          'clientid': Number(this.clientId),
          'mstorgnhirarchyid': Number(this.orgId),
          'recorddifftypeid': Number(this.diffTypeId),
          'recorddiffid': Number(this.typeChecked),
          'location': psOrName
        };
        this.isLoading = true;
        if (psOrName !== '') {
          this.rest.searchlocation(data).subscribe((res1) => {
            this.respObject = res1;
            this.isLoading = false;
            if (this.respObject.success) {
              this.locations = this.respObject.details;
            } else {
              this.notifier.notify('error', this.respObject.message);
            }
          }, (err) => {
            this.isLoading = false;
            this.notifier.notify('error', this.messageService.SERVER_ERROR);
          });
        } else {
          this.isLoading = false;
          this.locations = [];
          this.locationSelected = '';
          this.locationName = '';
        }
      });
    this.searchUser.valueChanges.subscribe(
      psOrName => {
        const data = {
          loginname: psOrName,
          clientid: Number(this.clientId),
          mstorgnhirarchyid: this.orgId,
          groupid: Number(this.grpSelected)
        };
        this.isLoading = true;
        if (psOrName !== '') {
          this.rest.searchuserbygroupid(data).subscribe((res1) => {
            this.respObject = res1;
            this.isLoading = false;
            if (this.respObject.success) {
              this.userList = this.respObject.details;
            } else {
              this.notifier.notify('error', this.respObject.message);
            }
          }, (err) => {
            this.isLoading = false;
            this.notifier.notify('error', this.messageService.SERVER_ERROR);
          });
        } else {
          this.isLoading = false;
          this.userSelected = 0;
          this.userList = [];
        }
      });
    this.manualSearchUser.valueChanges.subscribe(
      psOrName => {
        const data = {
          loginname: psOrName,
          clientid: this.loginClientId,
          mstorgnhirarchyid: this.loginOrgId,
          groupid: Number(this.manualgroupid)
        };
        this.isLoading = true;
        if (psOrName !== '') {
          this.rest.searchuserbygroupid(data).subscribe((res1) => {
            this.respObject = res1;
            this.isLoading = false;
            if (this.respObject.success) {
              this.manualUserList = this.respObject.details;
            } else {
              this.notifier.notify('error', this.respObject.message);
            }
          }, (err) => {
            this.isLoading = false;
            this.notifier.notify('error', this.messageService.SERVER_ERROR);
          });
        } else {
          this.isLoading = false;
          this.userSelected = 0;
          this.userList = [];
        }
      });
  }


  onFileError(msg: string) {
    this.notifier.notify('error', msg);
  }


  onFileAttach() {
    this.attachFile = this.attachFile + 1;
  }

  onRemove() {
    this.attachFile = this.attachFile - 1;
  }

  onUpload(data: any) {
    this.dataLoaded = data.loader;
  }


  onFileComplete(data: any) {
    if (this.attachment.length < 1) {
      if (data.success) {
        // this.hideAttachment = false;
        this.attachment.push({originalName: data.details.originalfile, fileName: data.details.filename});
        if (this.attachment.length > 1) {
          this.attachMsg = this.attachment.length + ' files uploaded successfully';
        } else {
          this.attachMsg = this.attachment.length + ' file uploaded successfully';
        }
        this.addTermValue(this.ATTACHEMNT_TERM_SEQ);
        // this.getattachedfiles();
      }
    } else {
      this.notifier.notify('error', this.messageService.ATTACH_ERROR);
    }
  }


  onFileComplete2(data: any) {
    //console.log(this.orginalDocumentName);
    if (data.success) {
      this.attachment.push({originalfilenames: data.details.originalfile, uploadedfilename: data.details.filename});
      if (this.attachment.length > 1) {
        this.attachMsg = this.attachment.length + ' files uploaded successfully';
      } else {
        this.attachMsg = this.attachment.length + ' file uploaded successfully';
      }

      this.documentName = data.details.filename;
      this.documentPath = data.details.path;
      // console.log('ORIN', data.details.originalfile);
      this.orginalDocumentName.push(data.details.originalfile);
      // console.log(this.orginalDocumentName);
      if (this.orginalDocumentName.length > 0) {
        this.nameMsg = this.nameMsg.concat(data.details.originalfile + ', ');
        //this.nameMsg1 = this.nameMsg.
      }
      //  this.nameMsg1.trim(",");
    }
  }


  onTermFileComplete(data: any) {
    // if (this.attachment.length < 1) {
    if (data.success) {
      this.hideAttachment = false;
      this.termattachment.push({originalName: data.details.originalfile, fileName: data.details.filename});
      if (this.attachment.length > 1) {
        this.attachMsg = this.termattachment.length + ' files uploaded successfully';
      } else {
        this.attachMsg = this.termattachment.length + ' file uploaded successfully';
      }
      /*this.addTermValue(this.ATTACHEMNT_TERM_SEQ);
      this.getattachedfiles();*/
    }
    /*} else {
      this.notifier.notify('error', this.messageService.ATTACH_ERROR);
    }*/
  }

  getTab() {
    const promise = new Promise((resolve, reject) => {
      const data = {
        'clientid': this.loginClientId,
        'mstorgnhirarchyid': this.loginOrgId,
        'recorddifftypeid': this.diffTypeId,
        'recorddifftypeseq': this.typeSeq,
        'groupid': this.userGroupId,
        recorddifftypestatusseq: this.statusseq
      };
      this.rest.gettabbuttonnames(data).subscribe((res: any) => {
        if (res.success) {
          resolve(res.details);
        } else {
          reject();
          this.notifier.notify('error', res.message);
        }
      }, () => {
        reject();
      });
    });
    return promise;
  }

  gettabtermvalues() {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: this.orgId,
      recordid: this.tId,
      grpid: this.userGroupId,
      recorddifftypeid: this.diffTypeId,
      recorddiffid: this.typeChecked,
      recordstatustypeid: this.currentstatustypeid,
      recordstatusid: this.currentstatusid

    };
    this.rest.gettabtermvalues(data).subscribe((res: any) => {
      if (res.success) {
        for (let i = 0; i < res.details.scheduletab.length; i++) {
          if (res.details.scheduletab[i].termtypeid === 7 || res.details.scheduletab[i].termtypeid === 4 || res.details.scheduletab[i].termtypeid === 5) {
            res.details.scheduletab[i].val = new Date(res.details.scheduletab[i].val);
          }
        }
        this.scheduletab = res.details.scheduletab;
        this.extras = [];
        for (let i = 0; i < res.details.plantab.length; i++) {
          if (res.details.plantab[i].termtypeid === 7 || res.details.plantab[i].termtypeid === 4 || res.details.plantab[i].termtypeid === 5) {
            res.details.plantab[i].val = new Date(res.details.plantab[i].val);
          }
          if (res.details.plantab[i].seq === 62 || res.details.plantab[i].seq === 67 || res.details.plantab[i].seq === 68) {
            this.extras.push(res.details.plantab[i]);
          } else {
            this.plantab.push(res.details.plantab[i]);
          }
          if (res.details.plantab[i].seq === 57) {
            if (res.details.plantab[i].val === 'Yes') {
              this.displayMandatory = false;
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

  getlinkrecorddetails() {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: this.orgId,
      recordid: this.tId
    };
    this.rest.getlinkrecorddetails(data).subscribe((res: any) => {
      if (res.success) {
        for (let i = 0; i < res.details.length; i++) {
          this.linkAttachedTicket.push({
            id: res.details[i].linkrecordid,
            code: res.details[i].recordcode,
            recordtype: res.details[i].recordtype,
            title: res.details[i].recordtitle
          });
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getTicketDetails() {
    this.rest.getrecorddetails({
      'clientid': this.loginClientId,
      'mstorgnhirarchyid': Number(this.loginOrgId),
      'recordid': Number(this.tId)
    }).subscribe((res1: any) => {
      this.dataLoaded = true;
      if (res1.success) {
        this.ticketDetails = res1.details;
        this.clientId = this.ticketDetails[0].clientid;
        this.orgId = this.ticketDetails[0].mstorgnhirarchyid;
        this.haspermission = this.ticketDetails[0].haspermission;
        if (!this.haspermission) {
          this.isDisabled = true;
        }
        this.typeSeq = this.ticketDetails[0].typeseqno;
        // console.log(this.typeSeq)
        if (this.typeSeq === this.SR_SEQ) {
          // console.log('inside sr')
          this.ticketidlabel = 'Request ID';
          this.hasSLA = false;
          this.childSource = 'Task';
          this.getdiffdetailsbyseqno(this.STASK_SEQ).then((res: any) => {
            if (res.success) {
              if (res.details.length > 0) {
                this.sr_id = res.details[0].id;
                // console.log('this.sr_id:' + this.sr_id);
              }
            } else {
              this.notifier.notify('error', res.message);
            }
          });
        } else if (this.typeSeq === this.CR_SEQ) {
          this.ticketidlabel = 'Change ID';
          this.hasSLA = false;
          this.displayPriority = false;
          this.childSource = 'Task';
          this.getdiffdetailsbyseqno(this.CTASK_SEQ).then((res: any) => {
            if (res.success) {
              if (res.details.length > 0) {
                this.sr_id = res.details[0].id;
                console.log('this.sr_id:' + this.sr_id);
              }
            } else {
              this.notifier.notify('error', res.message);
            }
          });
        } else if (this.typeSeq === this.CTASK_SEQ) {
          this.ticketidlabel = 'CTask ID';
          this.hasSLA = false;
          this.displayPriority = false;
          this.parentSource = 'Change Request';
        } else if (this.typeSeq === this.INCIDENT_SEQ) {
          this.ticketidlabel = 'Incident ID';
          this.hasSLA = true;
          this.childSource = 'Parent';
          this.parentSource = 'Parent Id';
        } else if (this.typeSeq === this.STASK_SEQ) {
          this.ticketidlabel = 'STask ID';
          this.hasSLA = true;
          this.parentSource = 'Service Request';
        } else {
          this.ticketidlabel = 'Ticket ID';
          this.hasSLA = true;
        }
        // console.log("sla:" + this.hasSLA);
        this.ticketId = this.ticketDetails[0].code;
        this.typeChecked = this.ticketDetails[0].recordtypeid;
        this.diffTypeId = this.ticketDetails[0].typedifftypeid;
        this.rName = this.ticketDetails[0].requestername;
        this.rEmail = this.ticketDetails[0].requesteremail;
        this.rMobile = this.ticketDetails[0].requestermobile;
        this.rLoc = this.ticketDetails[0].requesterlocation;
        this.desc = this.ticketDetails[0].title;
        this.brief = this.ticketDetails[0].description;
        this.rDate = this.ticketDetails[0].createddatetime;
        this.dDate = this.ticketDetails[0].duedate;
        this.createbyid = this.ticketDetails[0].creatorid;
        this.priority_type_id = this.ticketDetails[0].prioritytypeid;
        this.priority = this.ticketDetails[0].priority;
        this.prevpriorityId = this.ticketDetails[0].priorityid;
        this.stageId = this.ticketDetails[0].recordstageid;
        this.workflowid = this.ticketDetails[0].workflowdetails.workflowid;
        this.workingtypeid = this.ticketDetails[0].workflowdetails.cattypeid;
        this.workingid = this.ticketDetails[0].workflowdetails.catid;
        this.impactid = this.ticketDetails[0].impactid;
        this.urgencyid = this.ticketDetails[0].urgencyid;
        this.sourcetype = this.ticketDetails[0].source;
        this.respbreachcomment = this.ticketDetails[0].respbreachcomment;
        this.resobreachcomment = this.ticketDetails[0].resobreachcomment;
        this.creatorgrpid = this.ticketDetails[0].groupid;
        this.typeChecked = this.ticketDetails[0].recordtypeid;
        this.orgrequestername = this.ticketDetails[0].orgrequestername;
        this.orgrequesteremail = this.ticketDetails[0].orgrequesteremail;
        this.orgrequestermobile = this.ticketDetails[0].orgrequestermobile;
        this.orgrequesterlocation = this.ticketDetails[0].orgrequesterlocation;
        this.originaluserid = this.ticketDetails[0].originaluserid;
        this.noOfHops = 0;
        if (this.createbyid === Number(this.messageService.getUserId()) || this.originaluserid === Number(this.messageService.getUserId())) {
          // End User ,who created the ticket
          this.isCreator = true;
        }
        if (this.ticketDetails[0].isvip === 'Y') {
          this.isVip = true;
        }
        this.rest.getstatedetails({
          'clientid': this.clientId,
          'mstorgnhirarchyid': Number(this.orgId),
          'recordid': Number(this.tId),
          'recordstageid': this.stageId
        }).subscribe((res: any) => {
          if (res.success) {
            if (res.details.length > 0) {
              this.currentstatusid = res.details[0].recorddiffid;
              this.currentstatustypeid = res.details[0].recorddifftypeid;
              this.currentGroup = res.details[0].supportgroupname;
              this.currentUser = res.details[0].username;
              this.lastgroup = res.details[0].lastgroupname;
              this.lastuser = res.details[0].lastusername;
              this.lastgroupid = res.details[0].lastgroupid;
              this.statusName = res.details[0].status;
              this.statename = res.details[0].statename;
              this.statusseq = res.details[0].seqno;
              // console.log(this.statusseq);
              this.transitionid = res.details[0].transitionid;
              this.currentstateid = res.details[0].currentstateid;
              this.auserid = res.details[0].userid;
              this.agroupid = res.details[0].groupid;
              this.agrouplvl = res.details[0].grplevel;
              // if (this.agrouplvl > 1) {
              //   this.lastgroupid = this.agroupid;
              // }
              this.messageService.setAssignedData({auserid: this.auserid, agroupid: this.agroupid});
              // console.log(JSON.stringify(this.userGroups.length))
              // console.log(this.agroupid ,this.currentGroup)
              if (this.statusseq === this.RESOLVE_STATUS_SEQUENCE || this.statusseq === this.CLOSE_STATUS_SEQ
                || this.statusseq === this.PENDING_USER_STATUS_SEQ || this.statusseq === this.PENDING_REQUESTER_INPUT) {
                this.showLastDetails = true;
              }
              if (!this.showLastDetails) {
                this.lastgroupid = this.agroupid;
              }
              if (this.statusseq === this.CLOSE_STATUS_SEQ || this.statusseq === this.CANCEL_STATUS_SEQ
                || this.statusseq === this.REJECTED_STATUS_SEQ) {
                this.isDisabled = true;
                this.hiddenManualState = true;
              } else {
                if (this.statusseq === this.CREATED_STATUS_SEQ) {
                  this.isCreatedState = true;
                }
                if (this.isCreatedState || this.statusseq === this.REPOEN_STATUS_SEQ) {
                  this.changeStateButton = 'Assign to Self';
                }
                // console.log('statusseq:'+this.statusseq);
                // console.log(this.agroupid, this.userGroupId);
              }

              this.formdata = {
                'clientid': this.clientId,
                'mstorgnhirarchyid': this.orgId
              };
              let ticketGroupMatched = false;
              if (this.agrouplvl > 1) {
                for (let i = 0; i < this.userGroups.length; i++) {
                  if (this.userGroups[i].id === this.agroupid) {
                    this.userGroupId = this.agroupid;
                    this.grpLevel = this.agrouplvl;
                    ticketGroupMatched = true;
                  }
                }
                if (!ticketGroupMatched) {
                  this.getgroupidbyorg();
                } else {
                  this.startDisplay();
                }
              } else {
                this.getgroupidbyorg();
              }
            } else {
              this.notifier.notify('error', this.messageService.WORKFLOW_ERROR);
            }
          } else {
            this.notifier.notify('error', res.message);
          }
        }, (err) => {
          // this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });

      } else {
        this.notifier.notify('error', res1.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getgroupidbyorg() {
    this.getGroupidUserwise().then((res3: any) => {
      if (res3.success) {
        const groups = res3.details;
        if (groups.length > 0) {
          let match = false;
          for (let i = 0; i < groups.length; i++) {
            if (groups[i].defaultgroup === 1) {
              this.userGroupId = groups[i].id;
              this.grpLevel = groups[i].levelid;
              match = true;
              break;
            }
          }
          if (!match) {
            this.userGroupId = groups[0].id;
            this.grpLevel = groups[0].levelid;
          }
        } else {
          this.isDisabled = true;
          this.notifier.notify('error', this.messageService.NO_GROUP);
        }
        this.startDisplay();
      } else {
        this.notifier.notify('error', res3.message);
      }
    });
  }

  startDisplay() {
    if (this.oldtId !== 0) {
      this.clearUserTicket(this.oldtId);
    }
    this.oldtId = this.tId;
    const data = {recordid: Number(this.tId), groupid: this.userGroupId, userid: Number(this.messageService.getUserId())};
    this.rest.insertuserticket(data).subscribe((res: any) => {
      if (res.success) {
      } else {
        this.notifier.notify('error', res.message + '\n Now it will be opened as a readonly page.');
        this.isDisabled = true;
        this.haspermission = false;
      }
      if (!this.isDisabled) {
        if (this.agroupid === this.userGroupId) {
          if (this.grpLevel === 1) {
            this.hiddenManualState = true;
          } else {
            if (this.isCreatedState) {
              this.hiddenManualState = true;
            }
          }
          this.isSameGroup = true;
          if (Number(this.messageService.getUserId()) === this.auserid) {
            this.canForward = true;
          }
        } else {
          if (!this.isCreator) {
            this.hiddenManualState = true;
          }
        }
        if (this.isCreator) {
          // console.log('is creator', this.closeBtn, this.statusseq);
          if (this.closeBtn && this.statusseq === this.RESOLVE_STATUS_SEQUENCE) {
            this.stateChangeButton(this.CLOSE_STATUS_SEQ);
          }
        }
      }
      this.getTab().then((val: any) => {
        const tabs = val.Tabs;
        const buttons = val.Buttons;
        const counts = val.Count;
        for (let i = 0; i < tabs.length; i++) {
          if (tabs[i].diffid === 1) {
            this.ticketTab = true;
          } else if (tabs[i].diffid === 2) {
            this.instantMessagingTab = true;
          } else if (tabs[i].diffid === 3) {
            this.createTaskTab = true;
          } else if (tabs[i].diffid === 4) {
            this.viewTaskTab = true;
          } else if (tabs[i].diffid === 5) {
            this.attachChildTab = true;
          } else if (tabs[i].diffid === 6) {
            this.parentChildCollabTab = true;
          }
        }
        for (let i = 0; i < buttons.length; i++) {
          if (buttons[i].diffid === 1) {
            this.updateStatusBtn = true;
          } else if (buttons[i].diffid === 2) {
            this.cloneBtn = true;
          } else if (buttons[i].diffid === 3) {
            this.userRepliedBtn = true;
          } else if (buttons[i].diffid === 4) {
            this.reopenBtn = true;
          } else if (buttons[i].diffid === 5) {
            this.cancelBtn = true;
          } else if (buttons[i].diffid === 6) {
            this.closeBtn = true;
          } else if (buttons[i].diffid === 8) {
            this.addEffortBtn = true;
          } else if (buttons[i].diffid === 9) {
            this.attachParentBtn = true;
          } else if (buttons[i].diffid === 10) {
            this.categoryUpdateBtn = true;
          } else if (buttons[i].diffid === 11) {
            this.attachCmdb = true;
          } else if (buttons[i].diffid === 12) {
            this.attachUserAssigned = true;
          } else if (buttons[i].diffid === 13) {
            this.additionalFieldBtn = true;
          } else if (buttons[i].diffid === 14) {
            this.convertBtn = true;
          }

          if (this.attachUserAssigned && this.isSameGroup) {
            this.canChangeUser = true;
          }
        }

        for (let i = 0; i < counts.length; i++) {
          if (counts[i].diffid === 1) {
            this.custVisibleCount = true;
          } else if (counts[i].diffid === 2) {
            this.prioChangeCount = true;
          } else if (counts[i].diffid === 3) {
            this.agingCount = true;
          } else if (counts[i].diffid === 4) {
            this.hopCount = true;
          } else if (counts[i].diffid === 5) {
            this.reopenCount = true;
          } else if (counts[i].diffid === 6) {
            this.userFollowCount = true;
          } else if (counts[i].diffid === 7) {
            this.outBoundCount = true;
          }
        }
        if (this.ticketTab) {
          this.getPropertyValue(this.PRIORITY_SEQ).then((details: any[]) => {
            this.priorities = details;
            this.priorityId = this.ticketDetails[0].priorityid;
            if (this.hasSLA && this.grpLevel > 1) {
              this.getSLADetails('START');
            }
          });
          if (this.typeSeq === this.CTASK_SEQ || this.typeSeq === this.STASK_SEQ) {
            this.getparentrecordinfo();
          }
          this.getrecordnames();
          this.pendingvendortermsvalue();
          this.getattachedfiles();
          this.alltermsValue();
          this.getparentrecordid();
          if (this.grpLevel > 1) {
            this.gethopcount();
            this.getrecordcount();
            this.getEffortValue();
            this.getchildrecordbyparent();
            this.getassetbyrecordidnfieldname();
            this.customervisiblecomment();
          }
          this.getcategorydetails();
          // if (this.updateStatusBtn) {
          this.getnextstatedetails();
          // }
          this.gettransitiongroupdetails();
          this.gettransitionbyprocess();
          if (this.typeSeq === this.CR_SEQ) {
            this.gettabtermvalues();
            this.getlinkrecorddetails();
          }
        }
      }, () => {

      });
    }, () => {
    });
  }

  getGroupidUserwise() {
    const promise = new Promise((resolve, reject) => {
      this.rest.groupbyuserwise({
        clientid: Number(this.clientId),
        mstorgnhirarchyid: Number(this.orgId),
        refuserid: Number(this.messageService.getUserId())
      }).subscribe((res: any) => {
        resolve(res);

      }, (err) => {
        // console.log(err);
        reject();
      });
    });
    return promise;
  }

  getcategorydetails() {
    const data = {
      'clientid': Number(this.clientId),
      'mstorgnhirarchyid': Number(this.orgId),
      'recordid': Number(this.tId),
      'recorddifftypeid': Number(this.diffTypeId),
      'recorddiffid': Number(this.typeChecked),
      'recordstageid': Number(this.stageId)
    };
    this.rest.getrecordcat(data).subscribe((res: any) => {
      // this.respObject = res;
      if (res.success) {
        this.categoryLoaded = true;
        this.ticketTypeLoaded = true;
        const createstatus = res.details.recordstatus;
        if (createstatus.length > 0) {
          this.statusArry = {id: createstatus[0].typeid, val: createstatus[0].id};
        }
        this.isassetattached = (res.details.isassetattached > 0);
        this.ticketTypes = res.details.recordcategory;
        for (let i = 0; i < this.ticketTypes.length; i++) {
          if (this.ticketTypes[i].isDisabled) {
            this.ticketTypes[i].child.push({
              id: this.ticketTypes[i].id,
              title: this.ticketTypes[i].title,
              type: 'header'
            });
          } else {
            this.ticketTypes[i].child.splice(1, 0, {
              id: this.ticketTypes[i].id,
              title: this.ticketTypes[i].title,
              type: 'header'
            });
          }
        }

        for (let i = 0; i < this.ticketTypes.length; i++) {
          this.categoryArr.push({id: this.ticketTypes[i].id, val: this.ticketTypes[i].child[0].id});
        }
        // console.log(JSON.stringify(this.categoryArr))
        const today = this.messageService.dateConverter(new Date(), 1);
        if (res.details.recordfields.length > 0) {
          for (let i = 0; i < res.details.recordfields.length; i++) {
            if (Number(res.details.recordfields[i].termstypeid) === 5) {
              res.details.recordfields[i].value = new Date(today + ' ' + res.details.recordfields[i].value);
            }
          }
          this.dynamicFields = res.details.recordfields;
        }
        this.prevaddfields = this.messageService.copyArray(res.details.recordfields);
        this.priorityType = Number(res.details.configtype);
        this.estimatedEffortName = res.details.estimatedefforts[0];
        this.crtype = res.details.changetypes[0];
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }


  getEffortValue() {
    this.gettermvaluebyseq(this.EFFORT_SEQ).then((res: any) => {
      if (res.success) {
        this.termValueBySeq = res.details;
        let hour = 0;
        let min = 0;
        for (let i = 0; i < this.termValueBySeq.length; i++) {
          const val = this.termValueBySeq[i].recordtermvalue.split(':');
          hour = hour + Number(val[0]);
          min = min + Number(val[1]);
        }
        const hmin = Math.floor(min / 60);
        const mmin = Math.round(min % 60);
        hour = hour + hmin;
        let hhour;
        let hhmin;
        if (hour < 10) {
          hhour = '0' + hour;
        } else {
          hhour = hour;
        }
        if (mmin < 10) {
          hhmin = '0' + mmin;
        } else {
          hhmin = mmin;
        }
        this.totalEffort = hhour + ':' + hhmin;
        // console.log("\n TERM VALUE ARRAY  ::  ", this.termValueBySeq);
      } else {
        this.notifier.notify('error', res.errorMessage);
      }
    });
  }

  gettermvaluebyseq(seq) {
    const promise = new Promise((resolve, reject) => {
      const data = {
        'clientid': this.clientId,
        'mstorgnhirarchyid': this.orgId,
        'recordid': this.tId,
        'termseq': this.EFFORT_SEQ
      };
      this.rest.gettermvaluebyseq(data).subscribe((res: any) => {
        resolve(res);

      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
        reject();
      });
    });
    return promise;
  }


  getSLADetails(type) {
    console.log('sla start from ' + type);
    if (Worker) {
      this.worker = new Worker('../assets/worker/worker.js');
      this.onmessage();
      this.worker.postMessage({
        url: this.rest.recordRoot + '/getSlaresolutionremain',
        postdata: {
          'clientid': this.clientId,
          'mstorgnhirarchyid': this.orgId,
          'recordid': this.tId,
          'recordtypeid': this.typeChecked,
          'workingcatid': this.workingid,
          'priorityid': Number(this.priorityId),
          'supportgroupid': this.agroupid
        },
        token: this.messageService.getToken(),
        event: 'slaPercentage',
        time: this.SLA_INTERVAL_TIME
      });
    }
    this.getSLAPercentage(type).then(() => {
      this.getSLATabvalue();
    });
    // this.getSLATabvalue();
  }

  getUserDetails() {
    for (let i = 0; i < this.userList.length; i++) {
      if (this.userList[i].loginname === this.userNameSelected) {
        this.userSelected = this.userList[i].id;
      }
    }
  }

  getManualUserDetails() {
    for (let i = 0; i < this.manualUserList.length; i++) {
      if (this.manualUserList[i].loginname === this.manualUserNameSelected) {
        this.manualUserSelected = this.manualUserList[i].id;
      }
    }
  }

  getWorlflowGroupid() {
    this.rest.getgroupbyorgid({
      clientid: this.loginClientId,
      mstorgnhirarchyid: this.loginOrgId
    }).subscribe((res: any) => {
      if (res.success) {
        res.details.unshift({id: 0, supportgroupname: 'Select Support Group'});
        this.manualgroups = res.details;
        this.manualgroupid = 0;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      // console.log(err);
    });
  }

  onCategoryChange(ticket, option) {
    // console.log('----->'+JSON.stringify(this.ticketTypes))
    //  console.log("SEQ",ticket.sequanceno,"Data",this.ticketTypes)
    if (ticket.sequanceno === this.ticketTypes.length) {
      this.ticketCatId = true;
      this.locationSelected = '';
    } else {
      this.ticketCatId = false;
    }
    const opt = JSON.parse(option);
    if (opt.type !== 'header') {
      this.isChangeCategory = true;
      const value = opt.id;
      if ((ticket.sequanceno === this.ticketTypes.length)) {
        this.lastLebelId = value;
        const data = {
          'clientid': this.clientId,
          'mstorgnhirarchyid': this.orgId,
          'recordtypeid': this.typeChecked,
          'recordcatid': this.lastLebelId
        };
        if (this.priorityType === 2) {
          this.getPriority(data);
        }
        this.getAdditionaldata(data);
      }
      const index = this.ticketTypes.map(function(d) {
        return d['sequanceno'];
      }).indexOf(ticket.sequanceno + 1);
      // // console.log('index:' + index);
      const index1 = this.ticketTypes.map(function(d) {
        return d['sequanceno'];
      }).indexOf(ticket.sequanceno);
      // console.log('index:' + index, index1);
      if (this.categoryArr.length > index1) {
        this.categoryArr = this.categoryArr.slice(0, index1);
        this.categoryArr.push({id: this.ticketTypes[index1].id, val: value});
      } else {
        this.categoryArr.push({id: this.ticketTypes[index1].id, val: value});
      }
      // console.log("after:"+JSON.stringify(this.categoryArr))

      if (index > -1) {
        for (let i = index + 1; i < this.ticketTypes.length; i++) {
          const options = this.ticketTypes[i].child;
          for (let j = 0; j < options.length; j++) {
            if (options[j].type) {
              // options=[];
              this.ticketTypes[i].child = [options[j]];
              break;
            }
          }
        }
      }
      const data1 = {
        'clientid': this.clientId,
        'mstorgnhirarchyid': Number(this.orgId),
        'mstdifferentiationset': [
          {
            'mstdifferentiationtypeid': Number(this.diffTypeId),
            'mstdifferentiationid': Number(this.typeChecked)
          },
          {
            'mstdifferentiationtypeid': Number(this.ticketTypes[index1].id),
            'mstdifferentiationid': Number(value)
          }
        ]

      };
      this.rest.getadditionalfields(data1).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          for (let i = 0; i < this.respObject.response.length; i++) {
            this.respObject.response[i].catSeq = ticket.sequanceno;

            if (this.respObject.response[i].termsvalue !== '') {
              this.respObject.response[i].values = this.respObject.response[i].termsvalue.split(',');
              // this.respObject.response[i].value = this.respObject.response[i].values[0];
            } else {
              this.respObject.response[i].value = '';
            }
          }
          // console.log(JSON.stringify(this.dynamicFields))
          if (this.dynamicFields.length > 0) {
            for (let j = 0; j < this.dynamicFields.length; j++) {
              console.log(Number(this.dynamicFields[j].catSeq), Number(ticket.sequanceno));
              if (Number(this.dynamicFields[j].catSeq) >= Number(ticket.sequanceno)) {
                this.dynamicFields = this.dynamicFields.slice(0, j);
                break;
              }
            }
            for (let i = 0; i < this.respObject.response.length; i++) {
              this.dynamicFields.push(this.respObject.response[i]);
            }
          } else {
            this.dynamicFields = this.respObject.response;
          }
        } else {
        }
      }, (err) => {
      });
      let data;
      if (index > -1) {
        for (let i = 0; i < this.ticketTypes[index].child.length; i++) {
          if (this.ticketTypes[index].child[i].type === 'header') {
            data = this.ticketTypes[index].child[i];
          }
        }
        // console.log('--> '+JSON.stringify(data))
        this.ticketTypes[index].child = [];
        this.dataLoaded = false;

        const data1 = {
          'clientid': this.clientId,
          'mstorgnhirarchyid': Number(this.orgId),
          'recorddifftypeid': this.diffTypeId,
          'recorddiffid': Number(this.typeChecked),
          'recorddiffparentid': Number(value)
        };
        this.rest.getrecordcatchilddata(data1).subscribe((respObject: any) => {
          this.dataLoaded = true;
          if (respObject.success) {
            if (respObject.response) {
              respObject.response.unshift(data);
              this.ticketTypes[index].child = respObject.response;
            }
          } else {

            if (index > -1) {
              this.ticketTypes[index].options = [data];
            }
          }
        }, (err) => {
          // this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
      }
    } else {
      const index = this.ticketTypes.map(function(d) {
        return d['sequanceno'];
      }).indexOf(ticket.sequanceno + 1);
      if (index === -1) {
        this.categoryArr = this.categoryArr.slice(0, (this.categoryArr.length - 1));
      }
    }
  }

  getAdditionaldata(data) {
    this.rest.getadditionalinfobasedoncategory(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        if (this.respObject.response.estimatedefforts !== null) {
          this.estimatedEffortName = this.respObject.response.estimatedefforts[0];
        } else {
          this.estimatedEffortName = '';
        }
        if (this.respObject.response.changetype !== null) {
          this.crtype = this.respObject.response.changetype[0];
        } else {
          this.crtype = '';
        }
      } else {
        this.notifier.notify('error', this.respObject.errorMessage);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });

  }

  onCategoryChange1(categorySeq, option) {
    const opt = JSON.parse(option);
    if (opt.type !== 'header') {
      const value = opt.id;
      const index = this.ticketTypesSearch.map(function(d) {
        return d['sequanceno'];
      }).indexOf(categorySeq + 1);
      const index1 = this.ticketTypesSearch.map(function(d) {
        return d['sequanceno'];
      }).indexOf(categorySeq);
      if (this.categoryArrSearch.length > index1) {
        this.categoryArrSearch = this.categoryArrSearch.slice(0, index1);
        this.categoryArrSearch.push({id: this.ticketTypesSearch[index1].id, val: value});
      } else {
        this.categoryArrSearch.push({id: this.ticketTypesSearch[index1].id, val: value});
      }
      if (index > -1) {
        for (let i = index + 1; i < this.ticketTypesSearch.length; i++) {
          const options = this.ticketTypesSearch[i].child;
          for (let j = 0; j < options.length; j++) {
            if (options[j].type) {
              this.ticketTypesSearch[i].child = [options[j]];
              break;
            }
          }
        }
      }

      let data;
      if (index > -1) {
        data = this.ticketTypesSearch[index].child[0];
        this.ticketTypesSearch[index].child = [];
        this.dataLoaded = false;
        const data1 = {
          'clientid': this.clientId,
          'mstorgnhirarchyid': Number(this.orgId),
          'recorddifftypeid': this.diffTypeId,
          'recorddiffid': Number(this.typeChecked),
          'recorddiffparentid': Number(value)
        };
        this.rest.getrecordcatchilddata(data1).subscribe((respObject: any) => {
          if (respObject.success) {
            this.dataLoaded = true;
            if (respObject.response) {
              respObject.response.unshift(data);
              this.ticketTypesSearch[index].child = respObject.response;
            }
          } else {
            this.dataLoaded = true;
            if (index > -1) {
              this.ticketTypesSearch[index].options = [data];
            }
          }
        }, (err) => {
          // this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
      }
    } else {
      const index = this.ticketTypesSearch.map(function(d) {
        return d['sequanceno'];
      }).indexOf(categorySeq + 1);
      if (index === -1) {
        this.categoryArrSearch = this.categoryArrSearch.slice(0, (this.categoryArrSearch.length - 1));
      }
    }
  }


  getPriority(data) {
    this.rest.getrecordpriority(data).subscribe((res: any) => {
      if (res.success) {
        if (res.response.priority.length > 0) {
          this.priorityId = res.response.priority[0].id;
          this.priority_type_id = res.response.priority[0].typeid;
        }
      } else {
        this.notifier.notify('error', res.errorMessage);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getPropertyValue(seq) {
    const promise = new Promise((resolve, reject) => {
      const data = {
        clientid: this.clientId,
        mstorgnhirarchyid: this.orgId,
        fromrecorddifftypeid: this.diffTypeId,
        fromrecorddiffid: this.typeChecked,
        seqno: seq
      };
      this.rest.getmappeddiffbyseq(data).subscribe((res: any) => {
        // const promise = this.rest.httpClient.post(this.rest.apiRoot + '/getrecordbydifftype', data, httpOptions).toPromise();
        // promise.then((res) => {
        if (res.success) {
          // this.ticketTypeList = res.details;
          resolve(res.details);
        } else {
          this.notifier.notify('error', res.message);
          reject();
        }
      });
    });
    return promise;
  }

  getparentrecordinfo() {
    this.rest.getparentrecordinfo({
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.orgId,
      'recordid': this.tId,
    }).subscribe((res: any) => {
      if (res.success) {
        this.pId = res.details.recordcode;
        this.pDesc = res.details.recordtitle;
        this.pStatus = res.details.recordstatus;
        this.pstime = res.details.plannedstartdate;
        this.petime = res.details.plannedenddate;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getrecordcount() {
    this.rest.recordcount({
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.orgId,
      'recordid': this.tId,
    }).subscribe((res: any) => {
      if (res.success) {
        this.priorityChangeCount = res.prioritycount;
        this.followUpCnt = res.followupcount;
        this.pendingvendoractioncount = res.pendingvendoractioncount;
        this.reopencount = res.reopencount;
        this.outboundcount = res.outboundcount;
        this.aging = res.aging;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getparentrecordidforIM() {
    this.rest.getparentrecordidforIM({
      clientid: this.clientId,
      mstorgnhirarchyid: this.orgId,
      recordid: this.tId,
    }).subscribe((res: any) => {
      if (res.success) {
        this.parentDetails = res.details;
        if (this.parentDetails.length > 0) {
          this.parentId = this.parentDetails[0].recordnumber;
          this.parentIdno = this.parentDetails[0].id;
          /*if (this.typeSeq === this.CTASK_SEQ || this.typeSeq === this.STASK_SEQ) {
            this.canDetach = false;
          } else {
            this.canDetach = true;
          }*/
          this.canDetach = true;
          // if (this.typeSeq === this.INCIDENT_SEQ) {
          this.noConversion = true;
          this.isDisabled = true;
          this.hiddenManualState = true;
          this.isCreatedState = true;
          // }
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getparentrecordid() {
    this.rest.getparentrecordid({
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.orgId,
      'recordid': this.tId,
    }).subscribe((res: any) => {
      if (res.success) {
        this.parentDetails = res.details;
        if (this.parentDetails.length > 0) {
          this.parentId = this.parentDetails[0].recordnumber;
          this.parentIdno = this.parentDetails[0].id;
          if (this.typeSeq === this.CTASK_SEQ || this.typeSeq === this.STASK_SEQ) {
            this.canDetach = false;
          } else {
            this.canDetach = true;
          }
          if (this.typeSeq === this.INCIDENT_SEQ) {
            this.noConversion = true;
            this.isDisabled = true;
            this.hiddenManualState = true;
            this.isCreatedState = true;
          }
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  pendingvendortermsvalue() {
    this.rest.pendingvendortermsvalue({
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.orgId,
      'recordid': this.tId,
    }).subscribe((res: any) => {
      if (res.success) {
        this.vendorDetails = res.details;
        for (let i = 0; i < this.vendorDetails.length; i++) {
          if (this.vendorDetails[i].seq === this.VENDOR_ID_TERM) {
            this.vendorid = this.vendorDetails[i].termvalue;
          }
          if (this.vendorDetails[i].seq === this.VENDOR_NAME_TERM) {
            this.vendorname = this.vendorDetails[i].termvalue;
          }
        }

      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  customervisiblecomment() {
    this.rest.customervisiblecomment({
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.orgId,
      'recordid': this.tId,
      usergroupid: this.userGroupId
    }).subscribe((res: any) => {
      if (res.success) {
        if (res.details.length > 0) {
          this.customercommentcount = res.details[0].daycount;
        } else {
          this.customercommentcount = 0;
        }

      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getattachedfiles() {
    this.rest.getattachedfiles({
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.orgId,
      'recordid': this.tId,
    }).subscribe((res: any) => {
      if (res.success) {
        this.attachedFiles = res.details;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getdiffdetailsbyseqno(seqno) {
    const promise = new Promise((resolve, reject) => {
      const data = {
        clientid: this.clientId,
        mstorgnhirarchyid: this.orgId,
        seqno: seqno,
        typeseqno: this.TICKET_TYPE_SEQ
      };
      this.rest.getpropdetailsbyseq(data).subscribe((res: any) => {
        resolve(res);
      }, (err) => {
        reject(false);
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    });
    return promise;
  }

  getassetbyrecordidnfieldname() {
    this.rest.getassetbyrecordidnfieldname({
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.orgId,
      'recordid': this.tId,
      'assetfieldsnames': ['hostname', 'ipaddress', 'role']
    }).subscribe((res: any) => {
      if (res.success) {
        this.assetDetails = res.details;
        this.messageService.setAssetModalData(this.assetDetails);
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  gethopcount() {
    this.rest.gethopcount({
      'transactionid': this.tId,
      createdgroupid: this.creatorgrpid,
      clientid: this.clientId
    }).subscribe((res: any) => {
      if (res.success) {
        this.noOfHops = res.details;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  gettransitionbyprocess() {
    this.rest.gettransitionbyprocess({
      'clientid': this.clientId,
      'mstorgnhirarchyid': Number(this.orgId),
      'processid': this.workflowid,
    }).subscribe((res: any) => {
      this.manualStateLoading = false;
      if (res.success) {

        this.transitions = res.details;
        if (this.transitions.length > 0) {
          res.details.unshift({currentstateid: 0, currentstate: 'Select State'});
        } else {
          res.details.unshift({currentstateid: 0, currentstate: 'No more state available'});
        }
        this.stateSelected = 0;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  gettransitiongroupdetails() {
    this.rest.gettransitiongroupdetails({
      'clientid': this.clientId,
      'mstorgnhirarchyid': Number(this.orgId),
      'transitionid': this.transitionid
    }).subscribe((res: any) => {
      if (res.success) {

        if (res.details.length > 0) {
          if (res.details[0].mstgroupid === 0) {
            res.details.shift();
            if (this.showLastDetails) {
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
          this.stategroups = this.messageService.sortByKey(res.details, 'groupname');
          console.log(JSON.stringify(this.stategroups), this.grpLevel, this.showLastDetails);
          this.grpSelected = this.agroupid;
          if (this.showLastDetails) {
            this.userNameSelected = this.lastuser;
          } else {
            this.userNameSelected = this.currentUser;
          }
          this.userSelected = this.auserid;
          // console.log(this.grpSelected);
        } else {
          this.stategroups = res.details;
        }
        // console.log(JSON.stringify(this.stategroups));
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getnextstatedetails() {
    this.rest.getnextstatedetails({
      'processid': this.workflowid,
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.orgId,
      'previousstateid': this.currentstateid,
      'transactionid': this.tId,
      'transitionid': this.transitionid
    }).subscribe((res: any) => {
      if (res.success) {
        this.nextstates = res.details;
        if (this.nextstates.length > 0) {
          this.statustypeid = res.details[0].recorddifftypeid;
          this.statusid = res.details[0].recorddiffid;
          this.nexttransitionid = res.details[0].transitionid;
        }
      } else {
        this.nextstates = [];
        if (res.message !== '') {
          this.notifier.notify('error', res.message);
        }
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getCategory() {
    this.categoryArrSearch = [];
    const data = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.orgId,
      'recorddifftypeid': Number(this.diffTypeId),
      'recorddiffid': Number(this.typeChecked)
    };

    this.rest.getrecorddata(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {

        this.categoryLoaded = true;
        this.ticketTypesSearch = this.respObject.response.recordcategory;
        for (let i = 0; i < this.ticketTypesSearch.length; i++) {
          if (this.ticketTypesSearch[i].isDisabled) {
            this.ticketTypesSearch[i].child.push({
              id: this.ticketTypesSearch[i].id,
              title: this.ticketTypesSearch[i].title
            });
            this.categoryArrSearch.push({
              id: this.ticketTypesSearch[i].id,
              val: this.ticketTypesSearch[i].child[0].id
            });
          } else {
            this.ticketTypesSearch[i].child.unshift({
              id: this.ticketTypesSearch[i].id,
              title: this.ticketTypesSearch[i].title,
              type: 'header'
            });
          }
        }

      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }


  blockSpecialChar(e) {
    const k = e.keyCode;
    return (k !== 35 && k !== 64);
  }


  onMasterChange(value: any) {
    // this.columnName = this.columnDataObj[value].columnName;
    this.rest.getassetattributes({
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.orgId,
      'mstdifferentiationtypeid': Number(this.masterNameSelected)
    }).subscribe((res: any) => {
      // // console.log(this.respObject)
      if (res.success) {
        this.columnDataObj = res.details;
        this.columnDataObj.unshift({id: -1, name: 'Select asset column name'});
        this.totalData = res.details.length;
        this.columnNameSelected = -1;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onClientChange(value: any) {
    this.columnName = this.columnDataObj[value].columnName;
  }

  submitAssetData() {
    this.searchAssetmanagement(this.page);
  }

  getLocationDetails() {
    for (let i = 0; i < this.locations.length; i++) {
      if (this.locations[i].location === this.locationSelected) {
        this.locationId = this.locations[i].id;
        this.locationName = this.locations[i].location;
        //console.log('this.locationsname==',this.locationSelected, this.locationId);
      }
    }
    this.locationSet();
  }

  locationSet() {
    const data = {
      'id': Number(this.locationId),
      'clientid': Number(this.clientId),
      'mstorgnhirarchyid': Number(this.orgId),
      'recorddiffid': Number(this.typeChecked)
    };
    this.rest.selectlocation(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.priorityLocationList = this.respObject.details;
        if (this.priorityLocationList.length > 0) {
          this.priority_type_id = this.priorityLocationList[0].recorddifftypeid;
          //this.priority_type_id = 5
          this.priority = this.priorityLocationList[0].priority;
          this.priorityId = this.priorityLocationList[0].priorityid;
          //this.priorityArry = {id: this.priority_type_id, val: this.priorityId};
          // console.log("PNAME",this.priority,"PID",this.priorityId)
          for (let i = 0; i < this.dynamicFields.length; i++) {
            if (Number(this.dynamicFields[i].seqno) === 38) {
              this.dynamicFields[i].value = this.locationSelected;
            }
          }

          Promise.all([this.updateadditionalfields('a'), this.changePriority()]).then((details: any[]) => {
            console.log(JSON.stringify(details));
            if (this.hasSLA && this.grpLevel > 1) {
              if (details[0] || details[1]) {
                this.terminateWorker();
                if (details[1]) {
                  this.getSLADetails(' UPDATE PRIORITY');
                }
                if (details[0]) {
                  //this.initialData();
                  // this.getSLADetails(' UPDATE CATEGORY');
                }
              }
            }
            // this.alltermsValue();
          });
        }
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  searchAssetmanagement(page) {
    const assetdata = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.orgId,
      'mstdifferentiationtypeid': Number(this.masterNameSelected)
    };
    if (Number(this.columnNameSelected) > -1) {
      assetdata['mstdifferentiationid'] = Number(this.columnNameSelected);
      assetdata['value'] = this.assetValue;
    }
    this.rest.getassetbytypenvalue(assetdata).subscribe((res: any) => {
      if (res.success) {
        this.gridObj.getSelectionModel().setSelectedRanges([]);
        this.dataA = [];
        const data1 = [];
        for (let i = 0; i < this.columnData.length; i++) {
          data1.push(this.columnData[i]);
        }
        // const data = res.details;
        this.columnNameObj = res.details.assetattributes;
        this.columnValueObj = res.details.assetvales;

        // console.log("############",this.columnNameObj);
        // console.log("@@@@@@@@@@@@@",this.columnValueObj);

        data1.push({id: 'id', name: 'Id', field: 'id', sortable: true, filterable: true});
        // data1.push({
        //   id: 'description',
        //   name: 'descriptionId',
        //   field: 'description',
        //   sortable: true,
        //   filterable: true
        // });
        for (let i = 0; i < this.columnNameObj.length; i++) {
          data1.push({
            id: this.columnNameObj[i].name,
            name: this.columnNameObj[i].name,
            field: this.columnNameObj[i].id,
            sortable: true,
            filterable: true
          });

        }
        this.gridObj.setColumns(data1);
        const colval = [];
        if (this.columnValueObj !== null) {
          for (let j = 0; j < this.columnValueObj.length; j++) {

            const columnVal = this.columnValueObj[j].attributes;
            const jsonval = {};
            jsonval['id'] = this.columnValueObj[j].id;
            jsonval['0'] = this.columnValueObj[j].assetid;
            // jsonval['description'] = description;
            for (let k = 0; k < columnVal.length; k++) {
              jsonval[columnVal[k].attrid] = columnVal[k].value;
            }
            colval.push(jsonval);
            // this.collectionSize = this.columnValueObj[j].totalData;
            this.collectionSize = this.columnValueObj.length;
          }
        }
        this.dataA = colval;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  viewAssetmanagement() {
    const assetdata = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.orgId,
      'mstdifferentiationtypeid': Number(this.masterNameSelected),
      'recordid': Number(this.tId),
      'offset': 0,
      'limit': 100
    };
    this.rest.getrecordassetbyid(assetdata).subscribe((res: any) => {
      if (res.success) {
        this.gridObj1.getSelectionModel().setSelectedRanges([]);
        this.dataView = [];
        const data1 = [];
        for (let i = 0; i < this.columnData1.length; i++) {
          data1.push(this.columnData1[i]);
        }
        // const data = res.details;
        this.columnNameObj1 = res.details.assetattributes;
        this.columnValueObj1 = res.details.assetvales;
        this.totalAssect = res.details.total;
        // console.log("############",this.columnNameObj);
        // console.log("@@@@@@@@@@@@@",this.columnValueObj);

        data1.push({id: 'id', name: 'Id', field: 'id', sortable: true, filterable: true});
        // data1.push({
        //   id: 'description',
        //   name: 'descriptionId',
        //   field: 'description',
        //   sortable: true,
        //   filterable: true
        // });
        for (let i = 0; i < this.columnNameObj1.length; i++) {
          data1.push({
            id: this.columnNameObj1[i].name,
            name: this.columnNameObj1[i].name,
            field: this.columnNameObj1[i].id,
            sortable: true,
            filterable: true
          });

        }
        this.gridObj1.setColumns(data1);
        const colval = [];
        if (this.columnValueObj1 !== null) {
          for (let j = 0; j < this.columnValueObj1.length; j++) {

            const columnVal = this.columnValueObj1[j].attributes;
            const jsonval = {};
            jsonval['id'] = this.columnValueObj1[j].id;
            jsonval['0'] = this.columnValueObj1[j].assetid;
            // jsonval['description'] = description;
            for (let k = 0; k < columnVal.length; k++) {
              jsonval[columnVal[k].attrid] = columnVal[k].value;
            }
            colval.push(jsonval);
            // this.collectionSize = this.columnValueObj[j].totalData;
            this.collectionSize = this.columnValueObj1.length;

          }
        }
        this.dataView = colval;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  handleSelectedRowsChanged(e, args) {
    if (Array.isArray(args.rows)) {
      this.selectedTitles = args.rows.map(idx => {
        const item = this.gridObj.getDataItem(idx);
        return item || '';
      });
      // if (this.selectedTitles.length > 0) {
      //   this.show = true;
      //   this.selected = this.selectedTitles.length;
      // } else {
      //   this.show = false;
      // }
      // // console.log(JSON.stringify(this.selectedTitles));
    }
  }

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid && angularGrid.slickGrid || {};
    this.columnData = this.gridObj.getColumns();
  }

  handleSelectedRowsChanged1(e, args) {
    if (Array.isArray(args.rows)) {
      this.selectedTitles = args.rows.map(idx => {
        const item = this.gridObj1.getDataItem(idx);
        return item || '';
      });
    }
  }

  angularGridReady1(angularGrid: AngularGridInstance) {
    this.angularGrid1 = angularGrid;
    this.gridObj1 = angularGrid && angularGrid.slickGrid || {};
    this.columnData1 = this.gridObj1.getColumns();
  }

  angularGridReadyChild(angularGrid: AngularGridInstance) {
    this.angularGridChild = angularGrid;
    this.gridObjChild = angularGrid && angularGrid.slickGrid || {};
  }

  angularGridReadyParent(angularGrid: AngularGridInstance) {
    this.angularGridParent = angularGrid;
    this.gridObjParent = angularGrid && angularGrid.slickGrid || {};
  }

  angularGridReadyChild1(angularGrid: AngularGridInstance) {
    this.angularGridChild1 = angularGrid;
    this.gridObjChild1 = angularGrid && angularGrid.slickGrid || {};
  }

  onCellClicked1(eventData: any, args: any) {
    const metadata = this.angularGrid1.gridService.getColumnFromEventArguments(args);
    if (metadata.columnDef.id === 'delete' && !this.isDisabled) {
      if (confirm('Are you sure?')) {
        this.rest.deleteassetfromrecord({
          'clientid': this.clientId,
          'mstorgnhirarchyid': Number(this.orgId),
          'recordid': Number(this.tId),
          'assetid': metadata.dataContext.id,
          'groupid': this.userGroupId
        }).subscribe((res) => {
          this.respObject = res;
          if (this.respObject.success) {
            this.angularGrid1.gridService.deleteDataGridItemById(metadata.dataContext.id);
            this.notifier.notify('success', this.respObject.message);
            this.alltermsValue();
          } else {
            this.notifier.notify('error', this.messageService.SERVER_ERROR);
          }
        }, (err) => {
          // alert(this.messageService.SERVER_ERROR);
        });
      }
    }
  }

  saveData() {
    //console.log(this.dataA)
    if (this.selectedTitles.length > 0) {
      for (let i = 0; i < this.selectedTitles.length; i++) {
        const jsonval = {};
        for (let j = 0; j < this.columnNameObj.length; j++) {
          jsonval[this.columnNameObj[j].name] = this.selectedTitles[i][this.columnNameObj[j].id];
        }
        if (this.ticketAssetIds.indexOf(this.selectedTitles[i].id) === -1) {
          this.Tickets.push(jsonval);

          // console.log(JSON.stringify(this.Tickets));
          this.ticketAssetIds.push(this.selectedTitles[i].id);
        }
      }
      const data = {
        'clientid': this.clientId,
        'mstorgnhirarchyid': Number(this.orgId),
        'recordid': Number(this.tId),
        'recordstageid': Number(this.stageId),
        'assetid': this.ticketAssetIds,
        'groupid': this.userGroupId
      };
      this.rest.addassetwithrecord(data).subscribe((res: any) => {
        // console.log(res);
        this.respObject = res;
        if (this.respObject.success) {
          this.notifier.notify('success', this.respObject.message);
          this.reset();
          this.alltermsValue();
        } else {
          this.notifier.notify('error', this.messageService.SERVER_ERROR);
        }
      });
    } else {
      this.notifier.notify('error', this.messageService.BLANK_ASSET);
    }
  }

  reset() {
    this.columnNameObj = [];
    this.columnValueObj = [];
    this.masterNameSelected = 0;
    this.isModal = true;
    this.isTermNameDetails = false;
    this.termNameSelected = 0;
    this.termNames = [];
    this.termNameDetailsSelected = 0;
    this.termNameDetails = [];
    this.parentChildCollabArr = [];
    this.parentChildCollabLoaded = false;
    this.nameMsg = '';
    this.attachMsg = '';
    this.attachment = [];
    this.orginalDocumentName = [];
  }

  tabClick(event) {
    if (event.tab.textLabel === 'Ticket Details') {
      this.alltermsValue();
      this.getattachedfiles();
    } else if (event.tab.textLabel === 'Common') {
      this.formdata = {
        'clientid': this.clientId,
        'mstorgnhirarchyid': this.orgId
      };
      this.termName();
      this.alltermsValue();
    } else if (event.tab.textLabel === 'Add Asset') {
      this.dataA = [];
      this.columnDefinitionsA = [];
      this.showGridA1 = true;
      this.masterNameSelected = 0;
      this.assetValue = '';
      this.rest.getassettypes({
        'clientid': this.clientId,
        'mstorgnhirarchyid': this.orgId
      }).subscribe((res: any) => {
        if (res.success) {
          this.masterNameObj = res.details;
          this.masterNameObj.unshift({id: 0, name: 'Select asset master name'});
          this.totalData = this.masterNameObj.length;
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    } else if (event.tab.textLabel === 'View Asset') {
      if (this.isDisabled) {
        this.columnDefinitionsView = [];
      } else {
        this.columnDefinitionsView = [{
          id: 'delete',
          field: 'id',
          excludeFromHeaderMenu: true,
          formatter: Formatters.deleteIcon,
          minWidth: 30,
          maxWidth: 30,
        }];
      }
      this.showGridView = true;
      this.masterNameSelected = 0;
      this.rest.getassettypesbyrecordid({
        'clientid': this.clientId,
        'mstorgnhirarchyid': this.orgId,
        recordid: this.tId
      }).subscribe((res: any) => {
        if (res.success) {
          this.masterNameObj = res.details;
          const total = this.masterNameObj.length;
          if (total > 0) {
            this.noAsset = true;
            this.masterNameSelected = this.masterNameObj[0].id;
            this.viewAssetmanagement();
          } else {
            this.noAsset = false;
            this.masterNameObj.unshift({id: 0, name: 'Select asset master name'});
            this.masterNameSelected = 0;
          }
          // this.totalData = this.masterNameObj.length;
        }
      });
    } else if (event.tab.textLabel === 'SLA Meter') {
      this.holidayList = [];
      if (this.hasSLA && this.grpLevel > 1) {
        this.getSLADetails('SLA METER');
      }
      this.rest.clientwisedayofweek({
        'clientid': this.clientId,
        'mstorgnhirarchyid': this.orgId
      }).subscribe((res: any) => {
        if (res.success) {

          for (let i = 0; i < res.details.length; i++) {
            res.details[i].day = this.weekdays[i];
          }
          this.creatortimedetails = res.details;
        }
      });
    } else if (event.tab.textLabel === 'Activity Logs') {
      this.logs = [];
      this.rest.recordlogs({
        'clientid': this.clientId,
        'mstorgnhirarchyid': this.orgId,
        recordid: this.tId
      }).subscribe((res: any) => {
        if (res.success) {
          for (let i = 0; i < res.details.length; i++) {
            res.details[i].createdate = this.messageService.dateConverter(res.details[i].createdate * 1000, 2);
          }
          this.logs = res.details;
        }
      });
    } else if (event.tab.textLabel === 'Attach Child Ticket') {
      this.showChildTicket = true;
      this.tNumber = '';
      this.searchTicketdetails = [];
      this.attachedTicket = [];
      this.columnDefinitionschild1 = [
        {
          id: 'delete',
          field: 'id',
          excludeFromHeaderMenu: true,
          formatter: Formatters.deleteIcon,
          minWidth: 30,
          maxWidth: 30,
        },
        {
          id: 'code',
          name: 'Ticket Id',
          field: 'code',
          minWidth: 200,
          sortable: true,
          filterable: true
        },
        {
          id: 'title',
          name: 'Ticket Title',
          field: 'title',
          minWidth: 200,
          sortable: true,
          filterable: true
        },
        {
          id: 'createdby',
          name: 'Created By',
          field: 'createdby',
          minWidth: 150,
          sortable: true,
          filterable: true
        },
        {
          id: 'createddatetime',
          name: 'Created Since',
          field: 'createddatetime',
          minWidth: 150,
          sortable: true,
          filterable: true
        },
        {
          id: 'status', name: 'Status', field: 'status', sortable: true, minWidth: 150, filterable: true
        },
        {
          id: 'duedate',
          name: 'Due Date',
          field: 'duedate',
          minWidth: 150,
          sortable: true,
          filterable: true
        }, {
          id: 'priority',
          name: 'Priority',
          field: 'priority',
          minWidth: 100,
          sortable: true,
          filterable: true
        }];
      this.columnDefinitionschild = [
        {
          id: 'code',
          name: 'Ticket Id',
          field: 'code',
          minWidth: 200,
          sortable: true,
          filterable: true
        },
        {
          id: 'isparent', name: 'Parent Ticket', field: 'isparent', sortable: true, filterable: true, formatter: Formatters.checkmark,
          filter: {
            collection: [{value: '', label: 'All'}, {value: true, label: 'True'}, {value: false, label: 'False'}],
            model: Filters.singleSelect,

            filterOptions: {
              autoDropWidth: true
            },
          }, minWidth: 40
        }, {
          id: 'ischild', name: 'Child Ticket', field: 'ischild', sortable: true, filterable: true, formatter: Formatters.checkmark,
          filter: {
            collection: [{value: '', label: 'All'}, {value: true, label: 'True'}, {value: false, label: 'False'}],
            model: Filters.singleSelect,

            filterOptions: {
              autoDropWidth: true
            },
          }, minWidth: 40
        },
        {
          id: 'title',
          name: 'Ticket Title',
          field: 'title',
          minWidth: 200,
          sortable: true,
          filterable: true
        },
        {
          id: 'createdby',
          name: 'Created By',
          field: 'createdby',
          minWidth: 150,
          sortable: true,
          filterable: true
        },
        {
          id: 'createddatetime',
          name: 'Created Since',
          field: 'createddatetime',
          minWidth: 150,
          sortable: true,
          filterable: true
        },
        {
          id: 'status', name: 'Status', field: 'status', sortable: true, minWidth: 150, filterable: true
        },
        {
          id: 'duedate',
          name: 'Due Date',
          field: 'duedate',
          minWidth: 150,
          sortable: true,
          filterable: true
        }, {
          id: 'priority',
          name: 'Priority',
          field: 'priority',
          minWidth: 100,
          sortable: true,
          filterable: true
        }];
      this.getchildrecordbyparent();
      this.getAssignmentGroupData();
      this.ticketTypesSearch = [];
      this.getCategory();
      this.selectedSupportGroup = 0;
      this.searchArr.unshift({'id': 0, 'value': 'Select Search Criteria'});
      this.selectedID = 0;
      this.hiddenChildAttach = true;
      this.hiddenRequestorName = false;
      this.hiddenRequestorLoginId = false;
      this.hiddenRequestorLocation = false;
      this.hiddenShortDescription = false;
      this.hiddenDate = false;
      this.hiddenAssignmentGroup = false;
      this.hiddenPriority = false;
      this.hiddenCategory = false;
      this.hiddenTicketId = false;

    } else if (event.tab.textLabel === 'Parent Child Collaboration') {
      this.parentChildCollabArr = [];
      const data = {
        'clientid': this.clientId,
        'mstorgnhirarchyid': this.orgId,
        'recordid': this.tId,
        'recordcode': this.ticketId,
        'searchbyseq': [this.ATTACHEMNT_TERM_SEQ, this.COMMENT_TERM_SEQ]
      };
      this.rest.getparencollaborationtchildlogs(data).subscribe((res: any) => {
        if (res.success) {
          this.parentChildCollabArr = res.details;
          this.parentChildCollabLoaded = true;
          this.parentChildCollabArr.sort(function(a, b) {
            var keyA = new Date(a.createddate),
              keyB = new Date(b.createddate);
            // Compare the 2 dates
            if (keyA > keyB) {
              return -1;
            }
            if (keyA < keyB) {
              return 1;
            }
            return 0;
          });
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });

    } else if (event.tab.textLabel === 'Instant Messaging') {
      this.formData = {
        'clientid': this.clientId,
        'mstorgnhirarchyid': this.orgId
      };
      this.receiver = this.rEmail;
      if (this.typeSeq === this.STASK_SEQ) {
        this.ticketIdMail = '(' + this.parentId + ') ';
      } else {
        this.ticketIdMail = '(' + this.ticketId + ') ';
      }
      // console.log(this.ticketIdMail);
      this.cc = '';
      this.subject = this.desc;
      this.nameMsg = '';
      this.attachMsg = '';
      this.attachment = [];
      this.orginalDocumentName = [];
      this.usersList = [];
      this.userEmail = [];
      this.UserInput.nativeElement.value = '';
      this.mail = 'Dear ' + this.rName + ',\n\n\n\nThanks and Regards,\nIntegrated Command Center - Mumbai (ICCM)';
    } else if (event.tab.textLabel === 'Create Task') {
      if (this.createUrl === '') {
        this.showCreateTicket = false;
        this.rest.geturlbykey({
          clientid: this.clientId,
          mstorgnhirarchyid: this.orgId,
          Urlname: 'createTicket'
        }).subscribe((res: any) => {
          if (res.success) {
            if (res.details.length > 0) {
              this.showCreateTicket = true;
              if (this.config.type === 'LOCAL') {
                if (res.details[0].url.indexOf(this.config.API_ROOT) > -1) {
                  res.details[0].url = res.details[0].url.replace(this.config.API_ROOT, 'http://localhost:4200');
                }
              }
              this.createUrl = this.messageService.getSafeUrl(res.details[0].url + '?a=' +
                this.orgId + '&parentPriorityId=' + this.priorityId + '&originaluserGroupId=' + this.creatorgrpid +
                '&userId=' + this.createbyid + '&parentPriorityTypeId=' + this.priority_type_id +
                '&parentTicketId=' + this.tId + '&tickettypeid=' + this.sr_id + '&groupid=' + this.userGroupId +
                '&reqName=' + this.rName + '&reqMobile=' + this.rMobile + '&reqEmail=' + this.rEmail + '&reqBranch=' + this.rLoc);
              // this.messageService.setLoginUserGroupIdCity({'loginGroupId': Number(this.userGroupId)});
            }
          } else {
            this.notifier.notify('error', res.message);
          }
        }, (err) => {
          // console.log(err);
        });
      } else {
      }
    } else if (event.tab.textLabel === 'View Task') {
      this.showTaskTicket = true;
      this.columnDefinitionsTask = [
        {
          id: 'code',
          name: 'Ticket Id',
          field: 'code',
          minWidth: 200,
          sortable: true,
          filterable: true
        },
        {
          id: 'title',
          name: 'Ticket Title',
          field: 'title',
          minWidth: 200,
          sortable: true,
          filterable: true
        },
        {
          id: 'requestername',
          name: 'Created By',
          field: 'requestername',
          minWidth: 150,
          sortable: true,
          filterable: true
        },
        {
          id: 'createddatetime',
          name: 'Created Since',
          field: 'createddatetime',
          minWidth: 150,
          sortable: true,
          filterable: true
        },
        {
          id: 'status', name: 'Status', field: 'status', sortable: true, minWidth: 150, filterable: true
        }, {
          id: 'assignedgroup', name: 'Group', field: 'assignedgroup', sortable: true, minWidth: 150, filterable: true
        },
        {
          id: 'duedate',
          name: 'Due Date',
          field: 'duedate',
          minWidth: 150,
          sortable: true,
          filterable: true
        }, {
          id: 'priority',
          name: 'Priority',
          field: 'priority',
          minWidth: 100,
          sortable: true,
          filterable: true
        }];
      this.getchildrecordbyparent();
    }
  }

  getSLATabvalue() {
    this.rest.getSlatabvalues({
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.orgId,
      recordid: this.tId,
      supportgroupid: this.userGroupId
    }).subscribe((res: any) => {
      if (res.success) {
        const responsedetailstime = res.details.responsedetails;
        const resolutiondetailstime = res.details.resolutiondetails;
        this.resolutionslaviolated = resolutiondetailstime.resolutionslaviolated;
        this.resolutionduetime = resolutiondetailstime.resolutionduetime;
        this.holidayList = res.details.holidaydetails;
        this.respTime = this.messageService.secondsToHms(responsedetailstime.responsetime);
        this.responseDueDateTime = responsedetailstime.responseduetime;
        this.responseslaviolated = responsedetailstime.responseslaviolated;
        this.respClockStatus = responsedetailstime.responseclockstatus;
        this.resoTime = this.messageService.secondsToHms(resolutiondetailstime.resolutiontime);
        this.resoClockStatus = resolutiondetailstime.resolutionclockstatus;
      }
    });
  }

  getSLAPercentage(type) {
    const promise = new Promise((resolve, reject) => {
      const data = {
        'clientid': this.clientId,
        'mstorgnhirarchyid': this.orgId,
        'recordid': this.tId,
        'recordtypeid': this.typeChecked,
        'workingcatid': this.workingid,
        'priorityid': Number(this.priorityId),
        'supportgroupid': this.agroupid
      };
      this.rest.getSlaresolutionremain(data).subscribe((res: any) => {
        if (res.success) {
          this.slaCalculation(res, type);
          resolve();
        } else {
          this.notifier.notify('error', res.errorMessage);
          reject();
        }
      }, (err) => {
        reject();
        // alert(this.messageService.SERVER_ERROR);
      });
    });
    return promise;
  }

  onmessage(): void {
    this.worker.onmessage = (data: any) => {
      // console.log(data.data)
      // console.log(JSON.stringify(data.data))
      const res = JSON.parse(data.data.result);
      if (res.success) {
        this.slaCalculation(res, 'worker');
      } else {
        this.notifier.notify('error', res.message);
      }
    };
  }

  slaCalculation(res, type) {
    this.percent = res.details.resolutionpercent;
    this.respPercent = res.details.responsepercent;
    // if(type==)
    const termseq = [];
    const recordid = res.details.recordid;
    if (recordid === this.tId) {
      if (res.details.remainresponsetime > 0) {
        this.respOverdue = '';
        this.remainingSlaResponse = this.messageService.secondsToHms(res.details.remainresponsetime);
      } else {
        this.respOverdue = this.messageService.secondsToHms(Math.abs(res.details.remainresponsetime));
        this.remainingSlaResponse = '';
      }
      if (res.details.remainresolutiontime > 0) {
        this.resoOverdue = '';
        this.remainingSla = this.messageService.secondsToHms(res.details.remainresolutiontime);
      } else {
        this.resoOverdue = this.messageService.secondsToHms(Math.abs(res.details.remainresolutiontime));
        this.remainingSla = '';
      }
      if (Number(this.percent) >= 100) {
        if (!this.resobreachcomment) {
          termseq.push(this.RESO_CODE_TERM);
          termseq.push(this.RESO_COMMENT_TERM);
          this.resobreachcomment = true;
        }
        this.resolutionStatus = false;
        this.slaString = 'YES';
        this.slaViolated = true;
        this.outerColor = '#F70E0B';
        this.innerColor = '#AF1D1B';
        this.terminateWorker();
      } else {
        this.resolutionStatus = true;
        this.slaViolated = false;
        this.outerColor = '#78C000';
        this.slaString = 'NO';
        this.innerColor = '#C7E596';
      }
      if (Number(this.respPercent) >= 100) {
        if (!this.respbreachcomment) {
          termseq.push(this.RESP_CODE_TERM);
          termseq.push(this.RESP_COMMENT_TERM);
          this.respbreachcomment = true;
        }
        this.reponseStatus = false;
        this.slaStringResp = 'YES';
        this.slaViolatedResp = false;
        this.outerColorResp = '#F70E0B';
        this.innerColorResp = '#AF1D1B';
      } else {
        this.reponseStatus = true;
        this.slaViolatedResp = true;
        this.outerColorResp = '#78C000';
        this.slaStringResp = 'NO';
        this.innerColorResp = '#C7E596';
      }
      if (termseq.length > 0 && this.grpLevel > 1 && this.userGroupId === this.agroupid) {
        this.gettermnamebyseq(termseq, 'sla');
      }
    }
  }

  gettermnamebyseq(seq, type) {
    this.stateterms = [];
    const data = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.orgId,
      'recorddifftypeid': this.diffTypeId,
      'recorddiffid': this.typeChecked,
      'usergroupid': this.userGroupId,
      'sequance': seq
    };
    this.rest.gettermnamebyseq(data).subscribe((res: any) => {
      if (res.success) {
        this.stateterms = res.details;
        this.termattachment = [];
        this.hideAttachment = true;
        this.multitermopentype = type;
        if (this.stateterms.length > 0) {
          this.checktermdialog = this.dialog.open(this.checkterm, {
            width: '500px', hasBackdrop: false
          });
          this.dataLoaded = false;
        }
      } else {
        this.notifier.notify('error', res.message);
        this.dataLoaded = true;
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  terminateWorker() {
    if (this.worker) {
      console.log('------------- Worker closed----------------');
      this.worker.terminate();
    }
  }

  alltermsValue() {
    const data = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': Number(this.orgId),
      'recordid': Number(this.tId),
      'usergroupid': Number(this.userGroupId)
    };

    this.rest.newactivitylogs(data).subscribe((res) => {
      this.respObject = res;
      this.isStatusChange = false;
      // console.log('\n\n Response is ::: ' + JSON.stringify(this.respObject));
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
        this.isStatusChange = false;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.isStatusChange = false;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  checkschedulemandatory() {
    let schedulecount = 0;
    let scheduleextraCount = 0;
    const scheduletabmod = JSON.parse(JSON.stringify(this.scheduletab));
    let scheduleerrorname = '';
    for (let i = 0; i < scheduletabmod.length; i++) {
      if (Number(scheduletabmod[i].termtypeid) === 4) {
        scheduletabmod[i].val = this.messageService.dateConverter(scheduletabmod[i].val, 1);
      } else if (Number(scheduletabmod[i].termtypeid) === 5) {
        scheduletabmod[i].val = this.messageService.dateConverter(scheduletabmod[i].val, 6);
      } else if (Number(scheduletabmod[i].termtypeid) === 7) {
        scheduletabmod[i].val = this.messageService.dateConverter(scheduletabmod[i].val, 5);
      }
      if (scheduletabmod[i].iscompulsory === 1) {
        schedulecount++;
        if (scheduletabmod[i].val.trim() !== '' && scheduletabmod[i].val !== 'NONE') {
          scheduleextraCount++;
        } else {
          scheduleerrorname = scheduleerrorname + ' ' + scheduletabmod[i].tername + ',';
        }
      }
    }
    if (schedulecount !== scheduleextraCount) {
      this.notifier.notify('error', scheduleerrorname.substring(0, scheduleerrorname.length - 1) + this.messageService.BLANK_SCHEDULE_ERROR_MESSAGE);
      return true;
    } else {
      return false;
    }
  }

  checkplanmandatory() {
    let planerrorname = '';
    let plancount = 0;
    let planextraCount = 0;
    const plantabmod = JSON.parse(JSON.stringify(this.plantab));
    for (let i = 0; i < plantabmod.length; i++) {
      if (Number(plantabmod[i].termtypeid) === 4) {
        plantabmod[i].val = this.messageService.dateConverter(plantabmod[i].val, 1);
      } else if (Number(plantabmod[i].termtypeid) === 5) {
        plantabmod[i].val = this.messageService.dateConverter(plantabmod[i].val, 6);
      } else if (Number(plantabmod[i].termtypeid) === 7) {
        plantabmod[i].val = this.messageService.dateConverter(plantabmod[i].val, 5);
      }
      if (plantabmod[i].iscompulsory === 1) {
        plancount++;
        if (plantabmod[i].val.trim() !== '' && plantabmod[i].val !== 'NONE') {
          planextraCount++;
        } else {
          planerrorname = planerrorname + ' ' + plantabmod[i].tername + ',';
        }
      }
    }
    const plantabmod1 = JSON.parse(JSON.stringify(this.extras));
    if (!this.displayMandatory) {
      for (let i = 0; i < plantabmod1.length; i++) {
        if (Number(plantabmod1[i].termtypeid) === 4) {
          plantabmod1[i].val = this.messageService.dateConverter(plantabmod1[i].val, 1);
        } else if (Number(plantabmod1[i].termtypeid) === 5) {
          plantabmod1[i].val = this.messageService.dateConverter(plantabmod1[i].val, 6);
        } else if (Number(plantabmod1[i].termtypeid) === 7) {
          plantabmod1[i].val = this.messageService.dateConverter(plantabmod1[i].val, 5);
        }
        if (plantabmod1[i].iscompulsory === 1) {
          plancount++;
          if (plantabmod1[i].val.trim() !== '' && plantabmod1[i].val !== 'NONE') {
            planextraCount++;
          } else {
            planerrorname = planerrorname + ' ' + plantabmod1[i].tername + ',';
          }
        }
      }
    }
    if (plancount !== planextraCount) {
      this.notifier.notify('error', planerrorname.substring(0, planerrorname.length - 1) + this.messageService.BLANK_PLAN_ERROR_MESSAGE);
      return true;
    } else {
      return false;
    }
  }

  forwardTicketWithState() {
    if (this.nextstates.length > 0) {
      if (this.typeSeq === this.CR_SEQ) {
        if (!this.checkschedulemandatory() && !this.checkplanmandatory()) {
          Promise.all([this.updateplantab(), this.updatescheduletab()]).then((details: any[]) => {
            // console.log(JSON.stringify(details));
            if (details[0] && details[1]) {
              this.commentDialogRef = this.dialog.open(this.selectState, {
                width: '500px'
              });
            }
          });
        }
      } else {
        this.commentDialogRef = this.dialog.open(this.selectState, {
          width: '500px'
        });
      }
    } else {
      this.notifier.notify('error', this.messageService.WORKFLOW_END);
    }
  }

  checkTerm() {
    this.stateterms = [];
    this.isStatusChange = true;
    const data = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.orgId,
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
          this.isStatusChange = false;
          // this.termNameSelected = this.stateterms[0].id;
          this.multitermopentype = 'workflow';
          this.termattachment = [];
          this.hideAttachment = true;
          this.checktermdialog = this.dialog.open(this.checkterm, {
            width: '700px',
          });
        }
      } else {
        this.isStatusChange = false;
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.isStatusChange = false;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  changeState(transitionid, index) {
    this.nextWokflowstateid = this.nextstates[index].currentstateid;
    this.statustypeid = this.nextstates[index].recorddifftypeid;
    this.statusid = this.nextstates[index].recorddiffid;
    this.nextstatusseq = this.nextstates[index].seqno;
    this.nexttransitionid = transitionid;
    if (this.nextstatusseq === this.RESOLVE_STATUS_SEQUENCE) {
      this.notifier.notify('error', this.messageService.ADD_EFFORT_NOTIFICATION_MESSAGE);
    }
    this.checkTerm();
  }

  moveWorkflow() {
    const promise = new Promise((resolve, reject) => {
      let srrequestor = 0;
      if (this.typeSeq === this.SR_SEQ && this.isCreator && this.statusseq === this.PENDING_USER_STATUS_SEQ) {
        srrequestor = 1;
      }
      const data = {
        'clientid': this.clientId,
        'mstorgnhirarchyid': this.orgId,
        'recorddifftypeid': this.workingtypeid,
        'recorddiffid': this.workingid,
        transitionid: this.nexttransitionid,
        'previousstateid': this.currentstateid,
        'currentstateid': this.nextWokflowstateid,
        'manualstateselection': this.manualstateselection,
        'transactionid': this.tId,
        'createdgroupid': this.userGroupId,
        issrrequestor: srrequestor
      };
      if (this.manualstateselection === 0) {
        data['mstgroupid'] = this.userGroupId;
        data['mstuserid'] = Number(this.messageService.getUserId());
      } else {
        data['mstgroupid'] = Number(this.manualgroupid);
        data['mstuserid'] = Number(this.manualUserSelected);
      }
      // console.log(JSON.stringify(data))
      this.rest.moveWorkflow(data).subscribe((res: any) => {
        this.isStatusChange = false;
        if (res.success) {
          this.notifier.notify('success', 'Process moved to next state');
          if (this.commentDialogRef) {
            this.commentDialogRef.close();
          }
          /*if (this.manualstateselection === 1 && Number(this.manualgroupid) === this.agroupid && Number(this.manualUserSelected) === Number(this.messageService.getUserId())) {
            this.ticketdata.assignee = this.manualUserNameSelected;
            this.auserid = Number(this.manualUserSelected);
          } else {

          }*/
          if ((this.statusseq === this.CREATED_STATUS_SEQ && this.nextstatusseq === this.ACTIVE_STATUS_SEQ) || (this.statusseq === this.REPOEN_STATUS_SEQ && this.nextstatusseq === this.ACTIVE_STATUS_SEQ) || (this.statusseq === this.REPOEN_STATUS_SEQ && this.nextstatusseq === this.OPEN_STATUS_SEQ)) {

          } else {
            this.initialData();
          }
          /*if (this.nextstatusseq !== this.ACTIVE_STATUS_SEQ) {
            // console.log('inside----' + this.statusseq);
            this.initialData();
          }*/
          // console.log(this.userGroupId);
          resolve(true);
        } else {
          this.isStatusChange = false;
          this.notifier.notify('error', res.message);
          resolve(false);
        }
      }, (err) => {
        this.isStatusChange = false;
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
        reject();
      });
    });
    return promise;
  }

  onImpactChange(index) {

  }

  onUrgencyChange(index) {

  }


  ongrpChange(selectedIndex: any) {
    this.changeGroupName = this.stategroups[selectedIndex].groupname;

    this.notifier.notify('error', this.messageService.ADD_EFFORT_NOTIFICATION_MESSAGE);
    this.userNameSelected = '';
    this.userSelected = 0;
    this.userList = [];
    this.commentTerm = '';
    this.termopentype = 'grpchange';
    this.opencommentterm();
  }


  changeUserWithState() {
    if (this.userSelected > 0) {
      let callworkflow = false;
      if (this.statusseq === this.CREATED_STATUS_SEQ) {
        callworkflow = true;
      } else {
        if (this.typeSeq !== this.SR_SEQ && this.statusseq === this.REPOEN_STATUS_SEQ) {
          callworkflow = true;
        }
      }
      if (callworkflow) {
        let seq = this.ACTIVE_STATUS_SEQ;
        if (this.typeSeq === this.CTASK_SEQ) {
          seq = this.OPEN_STATUS_SEQ;
        } else if (this.typeSeq === this.SR_SEQ) {
          seq = this.WIP_SEQ;
        }
        this.stateChangeButton(seq).then((success) => {
          if (success) {
            this.moveWorkflow().then((success1) => {
              if (success1) {
                // console.log(this.userGroupId);
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
    } else {
      this.notifier.notify('error', this.messageService.BLANK_USER);
    }
  }

  changeUser() {
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
        // console.log(JSON.stringify(data));
        this.rest.changerecordgroup(data).subscribe((res: any) => {
          if (res.success) {
            this.notifier.notify('success', this.messageService.USER_CHANGE_MESSAGE);
            if (Number(this.grpSelected) === this.agroupid && Number(this.userSelected) === Number(this.messageService.getUserId())) {
              /**
               * Self Assign
               */
              this.auserid = Number(this.userSelected);
            } else {
              this.auserid = Number(this.userSelected);
              this.agroupid = Number(this.grpSelected);
              if (!sameGroup) {
                this.lastgroupid = this.agroupid;
                this.noOfHops++;
                if (this.hasSLA && this.grpLevel > 1) {
                  this.terminateWorker();
                  this.getSLADetails(' CHANGE GROUP');
                }
              }

              if (this.userGroupId === this.agroupid) {
                this.isSameGroup = true;
                if (this.attachUserAssigned && this.isSameGroup) {
                  this.canChangeUser = true;
                } else {
                  this.canChangeUser = false;
                }
              } else {
                this.isSameGroup = false;
                this.canChangeUser = false;
              }
            }
            if (this.auserid === Number(this.messageService.getUserId()) && this.agroupid === this.userGroupId) {
              // End User ,who created the ticket
              this.canForward = true;
            } else {
              this.canForward = false;
            }
            // console.log(this.isSameGroup, this.userGroupId, this.agroupid);
            this.messageService.setAssignedData({auserid: this.auserid, agroupid: this.agroupid});
            this.alltermsValue();
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

  termName() {
    if (this.termNames.length === 0) {
      const data = {
        clientid: Number(this.clientId),
        mstorgnhirarchyid: Number(this.orgId),
        recorddifftypeid: Number(this.diffTypeId),
        recorddiffid: Number(this.typeChecked),
      };

      this.rest.getactivitynms(data).subscribe((res: any) => {
        if (res.success) {
          const terms = [];
          for (let i = 0; i < res.details.length; i++) {
            if (res.details[i].details !== null) {
              for (let j = 0; j < res.details[i].details.length; j++) {
                terms.push({
                  id: res.details[i].details[j].id,
                  description: res.details[i].details[j].tername,
                  seq: res.details[i].details[j].seq
                });
              }
            } else {
              // res.details[i].checked = false;
              terms.push(res.details[i]);
            }
          }
          this.messageService.sortByKey(terms, 'description');
          this.termNames = terms;
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    }

  }

  searchActivity(filter) {
    const data = {
      'clientid': Number(this.clientId),
      'mstorgnhirarchyid': Number(this.orgId),
      'recordid': Number(this.tId),
      'searchfilter': filter
    };

    this.rest.searchactivitylogs(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.previousTerms = this.respObject.details;
        this.previousTerms.sort(function(a, b) {
          var keyA = new Date(a.createddate),
            keyB = new Date(b.createddate);
          // Compare the 2 dates
          if (keyA > keyB) {
            return -1;
          }
          if (keyA < keyB) {
            return 1;
          }
          return 0;
        });
        // for (let i = 0; i < this.previousTerms.length; i++) {
        //   this.previousTerms[i].createddate = this.messageService.dateConverter(Number(this.previousTerms[i].createddate) * 1000, 2);
        // }

      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  addSingleTerm(typeseq, termdescription, termvalue) {
    const promise = new Promise((resolve, reject) => {
      if (termvalue.trim() !== '') {
        const data = {
          'clientid': this.clientId,
          'mstorgnhirarchyid': Number(this.orgId),
          'recordid': Number(this.tId),
          'recordstageid': Number(this.stageId),
          'termseq': typeseq,
          'recorddifftypeid': Number(this.diffTypeId),
          'recorddiffid': Number(this.typeChecked),
          'usergroupid': this.userGroupId,
          'foruserid': Number(this.messageService.getUserId()),
          'termvalue': String(termvalue),
          'termdescription': termdescription
        };
        this.rest.inserttermvalue(data).subscribe((res: any) => {
          if (res.success) {

            resolve(true);
          } else {
            this.notifier.notify('error', res.message);
            resolve(false);
          }
        }, (err) => {
          this.notifier.notify('error', this.messageService.SERVER_ERROR);
          reject();
        });
      } else {
        this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
        reject();
      }

    });
    return promise;
  }

  addTime() {
    this.selectedTime = this.selectedHour + ':' + this.selectedMinute;
    this.commentTerm = '';
    this.termopentype = 'effort';
    this.opencommentterm();
    this.timePickerRef.close();
  }


  addTermValue(type) {
    if (type === this.ATTACHEMNT_TERM_SEQ) {
      this.comment = this.attachment[0].originalName;
    }
    if (this.comment !== '') {
      let termvalue = '', termdescription = '';
      if (type === 5) {
        termvalue = this.messageService.dateConverter(this.comment, 5);
      } else if (type === 4) {
        termvalue = this.messageService.dateConverter(this.comment, 3);
      } else if (type === this.ATTACHEMNT_TERM_SEQ) {
        termvalue = this.comment;
        termdescription = this.attachment[0].fileName;
      } else if (type === this.COMMENT_TERM_SEQ) {
        termvalue = this.comment.trim();
      } else if (type === this.INTERNAL_COMMENT_TERM_SEQ) {
        if (this.isChecked === true) {
          type = this.COMMENT_TERM_SEQ;
        }
        termvalue = this.comment.trim();
      }
      this.addSingleTerm(type, termdescription, termvalue).then((success) => {
        if (success) {
          this.comment = '';
          this.attachment = [];
          this.isChecked = false;
          this.alltermsValue();
          let seq2 = this.USER_REPLIED_STATUS_SEQ;
          if (this.typeSeq === this.SR_SEQ) {
            seq2 = this.WIP_SEQ;
          }
          if (type === this.ATTACHEMNT_TERM_SEQ) {
            this.notifier.notify('success', this.messageService.ATTACH_SUCCESSFULL);
            this.getattachedfiles();
            if (this.isCreator && this.statusseq === this.PENDING_USER_STATUS_SEQ) {
              this.stateChangeButton(seq2);
            }
          } else if (type === this.COMMENT_TERM_SEQ) {
            this.notifier.notify('success', this.messageService.COMMENT_SUCCESS);
            if (this.isCreator && this.statusseq === this.PENDING_USER_STATUS_SEQ) {
              this.stateChangeButton(seq2);
            }
          } else if (type === this.INTERNAL_COMMENT_TERM_SEQ) {
            this.notifier.notify('success', this.messageService.COMMENT_SUCCESS);
          }
        }
      }, () => {

      });
    }
  }

  ngOnDestroy(): void {
    if (this.modalSubscribe) {
      this.modalSubscribe.unsubscribe();
    }
    if (this.actparamssub) {
      this.actparamssub.unsubscribe();
    }
    if (this.checktermdialog) {
      this.checktermdialog.close();
    }
    if (this.infoRef) {
      this.infoRef.close();
    }
    if (this.commenttermdialog) {
      this.commenttermdialog.close();
    }
    this.terminateWorker();
    this.clearUserTicket(this.tId);
  }

  clearUserTicket(ticketid) {
    const data = {
      recordid: ticketid
    };
    this.rest.deleteuserticket(data).subscribe((res: any) => {
      // if (res.success) {
      // } else {
      //   this.notifier.notify('error', res.message);
      // }
    }, (err) => {
      // this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  transitionChange() {
    if (Number(this.currentstateid) !== 0 && Number(this.manualgroupid) !== 0) {
      this.nextWokflowstateid = Number(this.stateSelected);
      this.manualstateselection = 1;
      this.checkTerm();
    } else {
      this.notifier.notify('error', this.messageService.CHANGE_STATE);
    }
  }

  addStatusTerm() {
    let isBlank = false;
    this.dataLoaded = true;
    // console.log(JSON.stringify(this.stateterms));
    const terms = [];
    let ismandatory = false;
    for (let i = 0; i < this.stateterms.length; i++) {
      if (this.stateterms[i].termtypeid === 3) {
        if (this.termattachment.length > 0) {
          this.stateterms[i].insertedvalue = this.termattachment[0].originalName;
          this.stateterms[i].termdescription = this.termattachment[0].fileName;
        }
      }
      if (this.stateterms[i].termtypeid === 6) {
        this.stateterms[i].insertedvalue = this.stateterms[i].insertedvalue + '';
        if (Number(this.stateterms[i].insertedvalue) < 5) {
          ismandatory = true;
        }
      }
      if (this.stateterms[i].insertedvalue.trim() !== '') {
        terms.push(this.stateterms[i]);
      }
      if (this.stateterms[i].insertedvalue.trim() === '' && this.stateterms[i].iscompulsory === 1) {
        isBlank = true;
        break;
      }
    }
    if (ismandatory) {
      // console.log(isBlank)
      for (let i = 0; i < this.stateterms.length; i++) {
        if (this.stateterms[i].termtypeid === 1 && this.stateterms[i].insertedvalue.trim() === '') {
          isBlank = true;
        }
      }
    }
    // console.log(JSON.stringify(this.stateterms));
    if (isBlank) {
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    } else {
      this.isStatusChange = true;
      const data = {
        'clientid': this.clientId,
        'mstorgnhirarchyid': Number(this.orgId),
        'recordid': Number(this.tId),
        'recordstageid': this.stageId,
        'details': terms,
        'recorddifftypeid': Number(this.diffTypeId),
        'recorddiffid': Number(this.typeChecked),
        usergroupid: this.userGroupId
      };
      // console.log(JSON.stringify(data));
      this.rest.insertmultipletermvalue(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.notifier.notify('success', this.messageService.TERM_SUCCESS);
          this.checktermdialog.close();
          this.termValueBySeq = [];
          if (this.multitermopentype === 'workflow') {
            this.moveWorkflow();
          } else if (this.multitermopentype === 'sla') {
            this.alltermsValue();
          }
        } else {
          this.isStatusChange = false;
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.isStatusChange = false;
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    }

  }

  onmanualgrpChange(selectedIndex: any) {
    this.manualUserSelected = 0;
    this.manualUserNameSelected = '';
    this.manualUserList = [];
  }

  openUserInfo() {
    this.userinfo = [];
    const data = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.orgId,
      'recordid': Number(this.tId)
    };
    this.rest.recordwiseuserinfo(data).subscribe((res: any) => {
      if (res.success) {
        this.userinfo = res.details;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
    this.infoRef = this.dialog.open(this.userInfo, {
      width: '500px', height: '400px'
    });
  }

  closeinfo() {
    this.infoRef.close();
  }

  onmanualstateChange(selectedIndex: any) {
    if (this.stateSelected > 0) {
      this.statustypeid = this.transitions[selectedIndex].recorddifftypeid;
      this.statusid = this.transitions[selectedIndex].recorddiffid;
    }
  }

  searchTicket() {
    if (this.tNumber.trim() !== this.ticketId) {
      this.isSearchTicket = true;
      this.searchTicketdetails = [];
      const data = {
        'clientid': this.clientId,
        'mstorgnhirarchyid': this.orgId,
        'recorddiffid': this.typeChecked,
        'RecordNo': this.tNumber.trim()
      };
      this.rest.getrecorddetailsbyno(data).subscribe((res: any) => {
        this.isSearchTicket = false;
        if (res.success) {
          let matched = false;
          if (res.details.length > 0) {
            for (let i = 0; i < res.details.length; i++) {
              if (res.details[0].statusseqno === this.CANCEL_STATUS_SEQ || res.details[0].statusseqno === this.CLOSE_STATUS_SEQ || res.details[0].statusseqno === this.RESOLVE_STATUS_SEQUENCE) {
                matched = true;
              }
            }
            if (matched) {
              this.notifier.notify('error', this.messageService.NO_STATUS_TICKET_FOUND);
            } else {
              this.searchTicketdetails = res.details;
              this.isAttachedTicket = false;
              this.notifier.notify('success', this.messageService.TICKET_FOUND);
            }
          } else {
            this.notifier.notify('error', this.messageService.NO_TICKET_FOUND);
          }
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    } else {
      this.notifier.notify('error', this.messageService.SELF_ATTACHED);
    }
  }

  searchParentTicket() {
    if (this.tNumber.trim() !== this.ticketId) {
      this.isSearchTicket = true;
      this.searchTicketdetails = [];
      const data = {
        'clientid': this.clientId,
        'mstorgnhirarchyid': this.orgId,
        'recorddiffid': this.typeChecked,
        'recorddifftypeid': this.diffTypeId,
        'recordno': this.tNumber.trim()
      };
      this.rest.getparentrecorddetails(data).subscribe((res: any) => {
        this.isSearchTicket = false;
        if (res.success) {
          // let matched = false;
          if (res.details.length > 0) {
            this.searchTicketdetails = res.details;
            this.isAttachedTicket = false;
            this.notifier.notify('success', this.messageService.TICKET_FOUND);
            // for (let i = 0; i < res.details.length; i++) {
            //   if (res.details[0].statusseqno === this.CANCEL_STATUS_SEQ || res.details[0].statusseqno === this.CLOSE_STATUS_SEQ || res.details[0].statusseqno === this.RESOLVE_STATUS_SEQUENCE) {
            //     matched = true;
            //   }
            // }
            // if (matched) {
            //   this.notifier.notify('error', this.messageService.NO_STATUS_TICKET_FOUND);
            // } else {
            //   this.searchTicketdetails = res.details;
            //   this.isAttachedTicket = false;
            //   this.notifier.notify('success', this.messageService.TICKET_FOUND);
            // }
          } else {
            this.notifier.notify('error', this.messageService.NO_TICKET_FOUND);
          }
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    } else {
      this.notifier.notify('error', this.messageService.SELF_ATTACHED);
    }
  }

  attachChildTicket(childids) {
    let promise = new Promise((resolve, reject) => {
      this.isAttachedTicket = true;
      this.isdataLoaded = true;
      const data = {
        'clientid': this.clientId,
        'mstorgnhirarchyid': this.orgId,
        'recorddiffid': this.typeChecked,
        'recorddifftypeid': this.diffTypeId,
        'parentid': this.tId,
        'childids': childids,
        // 'childids': [this.searchTicketdetails[0].id],
        'groupid': this.userGroupId
      };
      this.rest.savechildrecord(data).subscribe((res: any) => {
        this.isAttachedTicket = false;
        this.isdataLoaded = false;
        if (res.success) {
          // this.angularGridChild1.gridService.addItem(this.searchTicketdetails[0]);
          this.searchTicketdetails = [];
          this.notifier.notify('success', this.messageService.TICKET_ATTACHED);
          this.alltermsValue();
          resolve(true);
        } else {
          resolve(false);
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        this.isdataLoaded = false;
        reject();
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    });
    return promise;
  }

  getchildrecordbyparent() {
    const data = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.orgId,
      'recorddiffid': this.typeChecked,
      'parentid': this.tId,
    };
    this.rest.getchildrecordbyparent(data).subscribe((res: any) => {
      if (res.success) {
        this.attachedTicket = res.details;
        if (this.typeSeq === this.INCIDENT_SEQ && this.attachedTicket.length > 0) {
          this.noConversion = true;
        }
        // this.notifier.notify('success', this.messageService.TICKET_ATTACHED);
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }


  changePriority() {
    // console.log("this.prevpriorityId: "+this.prevpriorityId);
    // console.log("this.priorityId: "+this.priorityId);
    // console.log("this.isChangeCategory "+this.isChangeCategory)
    return new Promise((resolve, reject) => {
      if (this.prevpriorityId !== Number(this.priorityId) && !this.isChangeCategory) {
        const data = {
          'clientid': this.clientId,
          'mstorgnhirarchyid': this.orgId,
          'recorddifftypeid': this.priority_type_id,
          'recorddiffid': Number(this.priorityId),
          'recordid': this.tId,
          'usergroupid': this.userGroupId,
          'originaluserid': Number(this.messageService.getUserId()),
          'originalusergroupid': this.userGroupId,
          'recordname': this.desc,
          'recordesc': this.brief
        };
        if (!this.messageService.isBlankField(data)) {
          const promise = this.rest.httpClient.post(this.rest.recordRoot + '/updatepriority', data, httpOptions).toPromise();
          promise.then((res) => {
            if (res.success) {
              this.prevpriorityId = Number(this.priorityId);
              this.priorityChangeCount = this.priorityChangeCount + 1;
              this.notifier.notify('success', this.messageService.PRIORITY_UPDATE);
              resolve(true);
            } else {
              resolve(false);
              this.notifier.notify('error', res.message);
            }

          });
        } else {
          // console.log('blank field', data);
          resolve(false);
        }
      } else {
        resolve(false);
      }
    });
  }

  onPriorityChange(selectedIndex: any) {
    this.priority_type_id = this.priorities[selectedIndex].recorddifftypeid;
    this.priority = this.priorities[selectedIndex].typename;
    this.prioritydisable = this.prevpriorityId === Number(this.priorityId);
    this.commentTerm = '';
    this.termopentype = 'priority';
    this.opencommentterm();
  }

  detachChildTicket(ids, type, parentid) {
    const data = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.orgId,
      'childids': ids,
      'recorddiffid': this.typeChecked,
      'recorddifftypeid': this.diffTypeId,
      'parentid': parentid,
      'groupid': this.userGroupId
    };
    this.rest.removechildrecord(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.notifier.notify('success', this.respObject.message);
        if (type === 'p') {
          this.angularGridChild1.gridService.deleteDataGridItemById(ids[0]);
          this.alltermsValue();
        } else {
          this.initialData();
          if (this.typeSeq === this.INCIDENT_SEQ) {
            this.getparentrecordidforIM();
          } else {
            this.getparentrecordid();
          }
        }
      } else {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      }
    }, (err) => {
      // alert(this.messageService.SERVER_ERROR);
    });
  }

  onCellClickedChild(eventData, args) {
    const metadata = this.angularGridChild1.gridService.getColumnFromEventArguments(args);
    if (metadata.columnDef.id === 'delete' && !this.isDisabled) {
      if (confirm('Are you sure you want to detach the Child ticket ?')) {
        this.detachChildTicket([Number(metadata.dataContext.id)], 'p', this.tId);
      }
    }
  }

  updateTicket() {
    Promise.all([this.updateCategory(), this.changePriority()]).then((details: any[]) => {
      // console.log(JSON.stringify(details));
      if (this.hasSLA && this.grpLevel > 1) {
        if (details[0] || details[1]) {
          this.terminateWorker();
          if (details[1]) {
            this.getSLADetails(' UPDATE PRIORITY');
          }

        }
      }
      if (details[0]) {
        this.initialData();
        // this.getSLADetails(' UPDATE CATEGORY');
      }
      this.alltermsValue();
    });
  }

  updateadditionalfields(type) {
    return new Promise((resolve, reject) => {
      let isError = false;
      const extrafields = [];
      let extraCount = 0;
      let mandatoryfield = 0;
      let adderrorname = '';

      const dynamicFieldsmod = JSON.parse(JSON.stringify(this.dynamicFields));
      for (let i = 0; i < dynamicFieldsmod.length; i++) {
        if (Number(dynamicFieldsmod[i].termstypeid) === 4) {
          dynamicFieldsmod[i].value = this.messageService.dateConverter(dynamicFieldsmod[i].value, 1);
        } else if (Number(dynamicFieldsmod[i].termstypeid) === 5) {
          dynamicFieldsmod[i].value = this.messageService.dateConverter(dynamicFieldsmod[i].value, 6);
        } else if (Number(dynamicFieldsmod[i].termstypeid) === 7) {
          dynamicFieldsmod[i].value = this.messageService.dateConverter(dynamicFieldsmod[i].value, 5);
        }
        if (dynamicFieldsmod[i].ismandatory === 1) {
          mandatoryfield++;
          if (dynamicFieldsmod[i].value && dynamicFieldsmod[i].value.trim() !== '' && dynamicFieldsmod[i].value !== 'NONE') {
            extraCount++;
            extrafields.push({
              id: dynamicFieldsmod[i].fieldid,
              val: dynamicFieldsmod[i].value,
              termsid: dynamicFieldsmod[i].termsid
            });
          } else {
            adderrorname = adderrorname + ' ' + dynamicFieldsmod[i].termsname + ',';
          }
        } else {
          extrafields.push({
            id: dynamicFieldsmod[i].fieldid,
            val: dynamicFieldsmod[i].value,
            termsid: dynamicFieldsmod[i].termsid
          });
        }
      }

      if (extraCount !== mandatoryfield) {
        isError = true;
        this.notifier.notify('error', adderrorname.substring(0, adderrorname.length - 1) + this.messageService.BLANK_ADDITIONAL);
      }

      if (!isError && extrafields.length > 0) {
        // console.log(JSON.stringify(extrafields));

        const data = {
          'clientid': this.clientId,
          'mstorgnhirarchyid': this.orgId,
          'usergroupid': this.userGroupId,
          'additionalfields': extrafields,
          'recordid': this.tId,
        };
        const promise = this.rest.httpClient.post(this.rest.recordRoot + '/updateadditionalfields', data, httpOptions).toPromise();
        promise.then((res) => {
          if (res.success) {
            this.prevaddfields = this.messageService.copyArray(this.dynamicFields);
            if (type === 'p') {
              this.notifier.notify('success', this.messageService.PLAN_UPDATE);
            } else if (type === 's') {
              this.notifier.notify('success', this.messageService.SCHEDULE_UPDATE);
            } else {
              this.notifier.notify('success', this.messageService.ADDITIONAL_UPDATE);
            }
            this.alltermsValue();
            resolve(true);
          } else {
            this.dynamicFields = this.messageService.copyArray(this.prevaddfields);
            this.notifier.notify('error', res.message);
            resolve(false);
          }
        });
      } else {
        resolve(false);
      }
    });
  }

  updateCategory() {
    // console.log('change category : ' + this.isChangeCategory);
    return new Promise((resolve, reject) => {
      if (this.isChangeCategory) {
        let isError = false;
        if (this.categoryArr.length === this.ticketTypes.length) {
          if ((this.messageService.isBlankcat(this.categoryArr))) {
            isError = true;
            this.notifier.notify('error', this.messageService.CATEGORY_ERROR);
          }
        } else {
          isError = true;
          this.notifier.notify('error', this.messageService.CATEGORY_ERROR);
        }
        if (!isError) {
          const data = {
            'clientid': this.clientId,
            'mstorgnhirarchyid': this.orgId,
            'usergroupid': this.userGroupId,
            'recorddifftypeid': this.diffTypeId,
            'recorddiffid': this.typeChecked,
            'recordid': this.tId,
            'recordsets': [{
              'id': 1,
              'type': this.categoryArr
            }, {'id': Number(this.priority_type_id), 'val': Number(this.priorityId)}],
            'workingcatlabelid': this.workingtypeid,
          };
          const promise = this.rest.httpClient.post(this.rest.recordRoot + '/updatecategory', data, httpOptions).toPromise();
          promise.then((res) => {
            if (res.success) {
              if (this.prevpriorityId !== Number(this.priorityId)) {
                this.priorityChangeCount = this.priorityChangeCount + 1;
              }
              this.isChangeCategory = false;
              this.notifier.notify('success', this.messageService.CATEGORY_UPDATE);
              resolve(true);
            } else {
              resolve(false);
              this.notifier.notify('error', res.message);
            }
          });
        } else {
          resolve(false);
        }
      } else {
        resolve(false);
      }
    });

  }

  cancelTicket() {
    const data = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.orgId,
      'typeseqno': this.STATUS_SEQ,
      'seqno': this.CANCEL_STATUS_SEQ,
    };
    this.rest.getstatebyseqno(data).subscribe((res: any) => {
      if (res.success) {
        if (res.details.length > 0) {
          this.nextWokflowstateid = res.details[0].mststateid;
          this.statustypeid = res.details[0].recorddifftypeid;
          this.statusid = res.details[0].recorddiffid;
          this.manualstateselection = 1;
          this.manualgroupid = this.userGroupId;
          this.manualUserSelected = Number(this.messageService.getUserId());
          this.checkTerm();
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  termFilter() {
    this.termName();
    this.filterDialogRef = this.dialog.open(this.termfilter, {
      width: '300px', height: '400px'
    });
  }

  get selectedTerms() {
    return this.termNames
      .filter(opt => opt.checked)
      .map(opt => opt);

  }

  closeFilter() {
    this.filterDialogRef.close();
  }

  applyFilter() {
    this.previousTerms = [];
    if (this.selectedTerms.length > 0) {
      const terms = [];
      for (let i = 0; i < this.selectedTerms.length; i++) {
        terms.push({id: this.selectedTerms[i].id, seq: this.selectedTerms[i].seq});
      }
      this.searchActivity(terms);
      // console.log(JSON.stringify(terms));
    } else {
      this.alltermsValue();
    }
    this.closeFilter();
  }

  downloadFile(uploadname, originalname) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: this.orgId,
      filename: uploadname
    };
    this.rest.filedownload(data).subscribe((blob: any) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = originalname;
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }

  detachTicket() {
    if (confirm('Are you sure you want to detach the Child ticket ?')) {
      const id = this.parentDetails[0].id;
      this.detachChildTicket([this.tId], 'c', id);
    }
  }

  gotoprev() {
    if (this.url !== null && this.url !== '') {
      const urls = this.url.split(',');
      let latesturl = urls.pop();
      const pos = latesturl.indexOf('?');
      // console.log(pos)
      const params = {};
      if (pos > -1) {
        const queryString = latesturl.substring(pos + 1, latesturl.length);
        // console.log(queryString);
        latesturl = latesturl.substring(0, pos);
        const queries = queryString.split('&');
        for (let i = 0; i < queries.length; i++) {
          const pa = queries[i].split('=');
          params[pa[0]] = pa[1];
        }
        // console.log(queries);
      }
      if (urls.length > 0) {
        this.messageService.setNavigation(urls);
      } else {
        this.messageService.removeNavigation();
      }
      this.messageService.changeRouting(latesturl, params);
    }
  }

  cloneTicket(type) {
    if (this.grpLevel === 1) {
      this.geturlbykey(type);
    } else {
      if (type === 'cv') {
        this.geturlbykey(type);
      } else {
        const url = this.messageService.externalUrl + '?dt=' + this.tId + '&cd=' + this.ticketId + '&au=' +
          this.messageService.getUserId() + '&bt=' + this.messageService.getToken() + '&tp=' + type + '&i=' +
          this.clientId + '&m=' + this.orgId;
        window.open(url, '_blank');
      }
    }
  }

  geturlbykey(type) {
    this.rest.geturlbykey({
      clientid: this.clientId,
      mstorgnhirarchyid: this.orgId,
      Urlname: 'CloneTicket'
    }).subscribe((res: any) => {
      if (res.success) {
        if (res.details.length > 0) {
          if (this.config.type === 'LOCAL') {
            if (res.details[0].url.indexOf(this.config.API_ROOT) > -1) {
              res.details[0].url = res.details[0].url.replace(this.config.API_ROOT, 'http://localhost:4200');
            }
          }
          if (this.url !== null) {
            this.url = this.url + ',' + location.href;
          } else {
            this.url = location.href;
          }
          this.messageService.setNavigation(location.href);
          this.messageService.changeRouting(res.details[0].url, {
            id: this.tId,
            tp: type
          });
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    });
  }

  closeCommentTermDialog() {
    this.commenttermdialog.afterClosed().subscribe(result => {
      console.log('close modal' + result);
      if (result !== 'dynamic') {
        if (this.termopentype === 'priority') {
          this.priorityId = this.prevpriorityId;
        } else if (this.termopentype === 'grpchange') {
          this.grpSelected = this.agroupid;
        }
      }
    });
  }

  addCommentTerm() {
    let type = 0;
    if (this.termopentype === 'priority') {
      type = this.PRIORITY_CHANGE_TERM;
    } else if (this.termopentype === 'grpchange') {
      type = this.REASSIGNMENT_TERM;
    } else if (this.termopentype === 'outcount') {
      type = this.OUTBOUND_COUNT_TERM;
    } else if (this.termopentype === 'followupcount') {
      type = this.FOLLOWUP_COUNT_COMMENT_TERM;
    } else if (this.termopentype === 'effort') {
      type = this.EFFORT_COMMENT_TERM_SEQ;
    } else if (this.termopentype === 'category') {
      type = this.CATEGORY_COMMENT_TERM_SEQ;
    }
    if (type > 0) {
      this.addSingleTerm(type, '', this.commentTerm).then((success) => {
        if (success) {
          this.commentTerm = '';
          this.commenttermdialog.close('dynamic');
          this.notifier.notify('success', this.messageService.COMMENT_SUCCESS);
          if (this.termopentype === 'priority') {
            this.changePriority().then(() => {
              if (this.hasSLA && this.grpLevel > 1) {
                this.terminateWorker();
                this.getSLADetails(' UPDATE PRIORITY');
              }
              this.alltermsValue();
            }, () => {

            });
          } else if (this.termopentype === 'grpchange') {
            this.changeUser().then((success) => {

            }, () => {

            });
          } else if (this.termopentype === 'outcount') {
            this.alltermsValue();
            if (success) {
              this.outboundcount = this.outboundcount + 1;
            }
          } else if (this.termopentype === 'followupcount') {
            this.alltermsValue();
            if (success) {
              this.followUpCnt = this.followUpCnt + 1;
            }
          } else if (this.termopentype === 'effort') {
            this.addSingleTerm(this.EFFORT_SEQ, '', this.selectedTime).then((success) => {
              if (success) {
                this.notifier.notify('success', this.messageService.ADD_EFFORT);
                this.selectedTime = '';
                this.alltermsValue();
                this.getEffortValue();
              }
              //this.timePickerRef.close();
            });
          } else if (this.termopentype === 'category') {
            this.updateTicket();
          }
        }
      }, () => {

      });
    }
  }

  stateChangeButton(seqno) {
    const promise = new Promise((resolve, reject) => {
      const data = {
        'clientid': this.clientId,
        'mstorgnhirarchyid': this.orgId,
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
                  if (seqno === this.USER_REPLIED_STATUS_SEQ && this.isCreator) {
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

  checkWorkflowState() {
    const promise = new Promise((resolve, reject) => {
      const data1 = {
        clientid: this.clientId,
        mstorgnhirarchyid: this.orgId,
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

  assetAttached(assetids: any[]) {
    if (this.canForward) {
      const data = {
        'clientid': this.clientId,
        'mstorgnhirarchyid': Number(this.orgId),
        'recordid': Number(this.tId),
        'recordstageid': Number(this.stageId),
        'assetid': assetids,
        'groupid': this.userGroupId
      };
      this.rest.addassetwithrecord(data).subscribe((res: any) => {
        if (res.success) {
          this.notifier.notify('success', res.message);
          // this.reset();
          this.messageService.setAttachedAssetData({});
          this.alltermsValue();
        } else {
          this.notifier.notify('error', res.message);
        }
      });
    } else {
      this.notifier.notify('error', this.messageService.SELF_ATTACHMENT);
    }
  }

  assetRemoved(data) {
    if (this.canForward) {
      this.rest.deleteassetfromrecord({
        'clientid': this.clientId,
        'mstorgnhirarchyid': Number(this.orgId),
        'recordid': Number(this.tId),
        'assetid': data.id,
        'groupid': this.userGroupId
      }).subscribe((res: any) => {
        if (res.success) {
          // this.angularGrid1.gridService.deleteDataGridItemById(metadata.dataContext.id);
          this.notifier.notify('success', res.message);
          this.messageService.setAttachedAssetData({});
          this.alltermsValue();
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
      });
    } else {
      this.notifier.notify('error', this.messageService.SELF_ATTACHMENT);
    }
  }

  opencommentterm() {
    this.commenttermdialog = this.dialog.open(this.addcommentterm, {
      width: '900px'
    });
    this.closeCommentTermDialog();
  }

  addOutCountComment() {
    this.commentTerm = '';
    this.termopentype = 'outcount';
    this.opencommentterm();
  }

  addfollowCountComment() {
    this.commentTerm = '';
    this.termopentype = 'followupcount';
    this.opencommentterm();
  }

  stateChangeButtonReopen(seqno) {
    if (confirm(this.messageService.REOPEN_MESSAGE)) {
      this.stateChangeButton(seqno);
    }
  }

  deleteAttachment(i: number) {
    const filegrplvl = this.attachedFiles[i].supportgrouplevelid;
    const filecreateid = this.attachedFiles[i].recorduserid;
    const fileoricreateid = this.attachedFiles[i].recordoriginaluserid;
    const originalname = this.attachedFiles[i].originalname;
    const recordtermid = this.attachedFiles[i].recordtermid;
    const createdgrpid = this.attachedFiles[i].createdgrpid;
    const id = this.attachedFiles[i].id;

    let candeletefile = false;
    console.log(filegrplvl, Number(this.messageService.getUserId()), filecreateid, fileoricreateid);
    if (filegrplvl === 1) {
      if (Number(this.messageService.getUserId()) === filecreateid || Number(this.messageService.getUserId()) === fileoricreateid) {
        candeletefile = true;
        this.deleteAttachmentUserWise(originalname, id, recordtermid, filecreateid, createdgrpid).then((success) => {
          if (success) {
            this.attachedFiles.splice(i, 1);
          }
        });
      }
    } else {
      if (this.grpLevel > 1) {
        candeletefile = true;
        this.deleteAttachmentUserWise(originalname, id, recordtermid, filecreateid, createdgrpid).then((success) => {
          if (success) {
            this.attachedFiles.splice(i, 1);
          }
        });
      }
    }
    if (!candeletefile) {
      this.notifier.notify('error', this.messageService.FILE_DELETE_ERROR);
    }
  }

  deleteAttachmentUserWise(name, id, recordtermid, createdbyid, createdgrpid) {
    const promise = new Promise((resolve, reject) => {
      const data = {
        'clientid': this.clientId,
        'mstorgnhirarchyid': Number(this.orgId),
        'recordid': Number(this.tId),
        'originalname': name,
        'id': id,
        'createdbyid': createdbyid,
        'createdgrpid': createdgrpid,
        'recordtermid': recordtermid,
        'usergroupid': this.userGroupId,
      };
      // this.notifier.notify('success', this.messageService.TERM_DELETE);
      this.rest.deleteattachment(data).subscribe((res: any) => {
        if (res.success) {
          this.notifier.notify('success', this.messageService.TERM_DELETE);
          this.alltermsValue();
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

  changeColor(newColor) {

  }

  addEffort() {
    // this.gettermnamebyseq([this.EFFORT_SEQ], 'effort');
    this.selectedHour = this.Hours[0];
    this.selectedMinute = this.Minutes[0];
    this.timePickerRef = this.dialog.open(this.timepicker, {
      width: '500px'
    });
  }


  getAssignmentGroupData() {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.orgId)
    };
    this.rest.getgroupbyorgid(data).subscribe((res) => {
      this.respObject = res;
      // console.log("\n RESP OBJ ====>>>>>>>   ",JSON.stringify(this.respObject));
      this.assignmentGroupArr.unshift({'id': 0, 'supportgroupname': 'Select Support Group'});
      for (let i = 0; i < this.respObject.details.length; i++) {
        this.assignmentGroupArr.push({
          'id': this.respObject.details[i].id,
          'supportgroupname': this.respObject.details[i].supportgroupname
        });
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }


  childAttach() {
    if (this.selectedChildTitles.length > 0) {
      const ids = [];
      for (let i = 0; i < this.selectedChildTitles.length; i++) {
        ids.push(this.selectedChildTitles[i].id);
      }
      this.attachChildTicket(ids).then((success) => {
        if (success) {
          for (let i = 0; i < this.selectedChildTitles.length; i++) {
            this.angularGridChild1.gridService.addItem(this.selectedChildTitles[0]);
          }
        }
      }, () => {

      });
    } else {
      this.notifier.notify('error', this.messageService.BLANK_TICKET);
    }
  }


  onSearch() {
    // console.log(this.selectedID);
    const data = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.orgId,
      'recorddifftypeid': this.diffTypeId,
      'recorddiffid': this.typeChecked
    };
    let isError = false;
    if (Number(this.selectedID) === 1) {
      data['requestername'] = this.requestorName;
    } else if (Number(this.selectedID) === 2) {
      data['requesterid'] = this.requestorLogin;
    } else if (Number(this.selectedID) === 3) {
      data['requesterlocation'] = this.requestorLocation;
    } else if (Number(this.selectedID) === 4) {
      data['shortdescription'] = this.shortDescription;
    } else if (Number(this.selectedID) === 5) {
      console.log(this.fromCreatedDate, this.toCreatedDate);
      data['fromdate'] = this.messageService.dateConverter(this.fromCreatedDate, 4);
      const toCreatedDate = new Date(this.toCreatedDate).setHours(23, 59, 59);
      data['todate'] = this.messageService.dateConverter(toCreatedDate, 4);
    } else if (Number(this.selectedID) === 6) {
      data['groupid'] = Number(this.selectedSupportGroup);
    } else if (Number(this.selectedID) === 7) {
      data['priority'] = Number(this.searchPriorityId);
    } else if (Number(this.selectedID) === 8) {

      if (this.categoryArrSearch.length === this.ticketTypesSearch.length) {
        if ((this.messageService.isBlankcat(this.categoryArrSearch))) {
          isError = true;
          this.notifier.notify('error', this.messageService.CATEGORY_ERROR);
        }
      } else {
        isError = true;
        this.notifier.notify('error', this.messageService.CATEGORY_ERROR);
      }
      if (!isError) {
        data['categoryid'] = this.categoryArrSearch[this.categoryArrSearch.length - 1].val;
        data['categorylabelid'] = this.categoryArrSearch[this.categoryArrSearch.length - 1].id;
      }
    } else if (Number(this.selectedID) === 9) {
      data['recordno'] = this.searchTicketId;
    }
    if (!isError) {
      if (!this.messageService.isBlankField(data)) {
        this.rowChildSelected = [];
        this.selectedChildTitles = [];
        this.gridObjChild.setSelectedRows(this.rowChildSelected);
        this.searchTicketdetails = [];
        this.isSearchTicket = true;
        this.isdataLoaded = true;
        this.rest.childsearchcriteria(data).subscribe((res: any) => {
          this.isSearchTicket = false;
          this.isdataLoaded = false;
          if (res.success) {
            let matched = false;
            if (res.details.length > 0) {
              for (let i = 0; i < res.details.length; i++) {
                if (res.details[0].statusseqno === this.CANCEL_STATUS_SEQ || res.details[0].statusseqno === this.CLOSE_STATUS_SEQ || res.details[0].statusseqno === this.RESOLVE_STATUS_SEQUENCE) {
                  matched = true;
                }
              }
              if (matched) {
                this.notifier.notify('error', this.messageService.NO_STATUS_TICKET_FOUND);
              } else {
                for (let i = 0; i < res.details.length; i++) {
                  res.details[i].ischild = (res.details[i].ischild === 'Yes');
                  res.details[i].isparent = (res.details[i].isparent === 'Yes');
                }
                this.searchTicketdetails = res.details;
                this.isAttachedTicket = false;
                this.notifier.notify('success', this.messageService.TICKET_FOUND);
              }
            } else {
              this.notifier.notify('error', this.messageService.NO_TICKET_FOUND);
            }
            // this.searchTicketdetails = res.details;
            // this.isAttachedTicket = false;
            // if (this.searchTicketdetails.length > 0) {
            //   this.notifier.notify('success', this.messageService.TICKET_FOUND);
            // } else {
            //   this.notifier.notify('error', this.messageService.NO_TICKET_FOUND);
            // }
          } else {
            this.notifier.notify('error', res.message);
          }
        }, (err) => {
          this.isdataLoaded = false;
          this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
      } else {
        this.isdataLoaded = false;
        this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
      }
    }
  }

  onChildSearchChange(value) {
    value = Number(value);
    if (value === 0) {
      this.hiddenTicketId = false;
      this.hiddenChildAttach = true;
      this.hiddenRequestorName = false;
      this.hiddenRequestorLoginId = false;
      this.hiddenRequestorLocation = false;
      this.hiddenShortDescription = false;
      this.hiddenDate = false;
      this.hiddenAssignmentGroup = false;
      this.hiddenPriority = false;
      this.hiddenCategory = false;


    } else if (value === 1) {
      this.hiddenTicketId = false;
      this.hiddenChildAttach = false;
      this.hiddenRequestorName = true;
      this.hiddenRequestorLoginId = false;
      this.hiddenRequestorLocation = false;
      this.hiddenShortDescription = false;
      this.hiddenDate = false;
      this.hiddenAssignmentGroup = false;
      this.hiddenPriority = false;
      this.hiddenCategory = false;

      this.requestorName = '';
      this.isLoading = false;
      this.searchRequestorName.valueChanges.subscribe(
        psOrName => {
          const data = {
            'mstorgnhirarchyid': this.orgId,
            'clientid': Number(this.clientId),
            'name': psOrName
          };
          this.isLoading = true;
          if (psOrName !== '') {
            this.rest.searchname(data).subscribe((res1) => {
              this.respObject = res1;
              this.isLoading = false;
              if (this.respObject.success) {
                this.requestorNameList = this.respObject.details;
              } else {
                this.notifier.notify('error', this.respObject.message);
              }
            }, (err) => {
              this.isLoading = false;
              this.notifier.notify('error', this.messageService.SERVER_ERROR);
            });
          } else {
            this.isLoading = false;
            this.userSelected = 0;
            this.requestorNameList = [];
          }
        });


    } else if (value === 2) {
      this.hiddenTicketId = false;
      this.hiddenChildAttach = false;
      this.hiddenRequestorLoginId = true;
      this.hiddenRequestorName = false;
      this.hiddenRequestorLocation = false;
      this.hiddenShortDescription = false;
      this.hiddenDate = false;
      this.hiddenAssignmentGroup = false;
      this.hiddenPriority = false;
      this.hiddenCategory = false;


      this.requestorLogin = '';
      this.isLoading = false;
      this.searchRequestorLogIn.valueChanges.subscribe(
        psOrName => {
          const data = {
            'mstorgnhirarchyid': this.orgId,
            'clientid': Number(this.clientId),
            'loginname': psOrName
          };
          this.isLoading = true;
          if (psOrName !== '') {
            this.rest.searchloginname(data).subscribe((res1) => {
              this.respObject = res1;
              this.isLoading = false;
              if (this.respObject.success) {
                this.requestorLogInList = this.respObject.details;
                console.log('\n LogIn >>>>>>>> ', JSON.stringify(this.requestorLogInList));
              } else {
                this.notifier.notify('error', this.respObject.message);
              }
            }, (err) => {
              this.isLoading = false;
              this.notifier.notify('error', this.messageService.SERVER_ERROR);
            });
          } else {
            this.isLoading = false;
            this.userSelected = 0;
            this.requestorLogInList = [];
          }
        });


    } else if (value === 3) {
      this.hiddenTicketId = false;
      this.hiddenChildAttach = false;
      this.hiddenRequestorLocation = true;
      this.hiddenRequestorName = false;
      this.hiddenRequestorLoginId = false;
      this.hiddenShortDescription = false;
      this.hiddenDate = false;
      this.hiddenAssignmentGroup = false;
      this.hiddenPriority = false;
      this.hiddenCategory = false;


      this.requestorLocation = '';
      this.isLoading = false;
      this.searchRequestorLocation.valueChanges.subscribe(
        psOrName => {
          const data = {
            'mstorgnhirarchyid': this.orgId,
            'clientid': Number(this.clientId),
            'branch': psOrName
          };
          this.isLoading = true;
          if (psOrName !== '') {
            this.rest.searchbranch(data).subscribe((res1) => {
              this.respObject = res1;
              this.isLoading = false;
              if (this.respObject.success) {
                this.requestorLocationList = this.respObject.details;
                console.log('\n Location >>>>>>>> ', JSON.stringify(this.requestorLocationList));
              } else {
                this.notifier.notify('error', this.respObject.message);
              }
            }, (err) => {
              this.isLoading = false;
              this.notifier.notify('error', this.messageService.SERVER_ERROR);
            });
          } else {
            this.isLoading = false;
            this.userSelected = 0;
            this.requestorLocationList = [];
          }
        });


    } else if (value === 4) {
      this.hiddenTicketId = false;
      this.hiddenChildAttach = false;
      this.hiddenShortDescription = true;
      this.hiddenRequestorName = false;
      this.hiddenRequestorLoginId = false;
      this.hiddenRequestorLocation = false;
      this.hiddenDate = false;
      this.hiddenAssignmentGroup = false;
      this.hiddenPriority = false;
      this.hiddenCategory = false;

    } else if (value === 5) {
      this.hiddenTicketId = false;
      this.hiddenChildAttach = false;
      this.hiddenDate = true;
      this.hiddenRequestorName = false;
      this.hiddenRequestorLoginId = false;
      this.hiddenRequestorLocation = false;
      this.hiddenShortDescription = false;
      this.hiddenAssignmentGroup = false;
      this.hiddenPriority = false;
      this.hiddenCategory = false;

    } else if (value === 6) {
      this.hiddenTicketId = false;
      this.hiddenChildAttach = false;
      this.hiddenAssignmentGroup = true;
      this.hiddenRequestorName = false;
      this.hiddenRequestorLoginId = false;
      this.hiddenRequestorLocation = false;
      this.hiddenShortDescription = false;
      this.hiddenDate = false;
      this.hiddenPriority = false;
      this.hiddenCategory = false;

    } else if (value === 7) {
      this.hiddenTicketId = false;
      this.hiddenChildAttach = false;
      this.hiddenPriority = true;
      this.hiddenRequestorName = false;
      this.hiddenRequestorLoginId = false;
      this.hiddenRequestorLocation = false;
      this.hiddenShortDescription = false;
      this.hiddenDate = false;
      this.hiddenAssignmentGroup = false;
      this.hiddenCategory = false;

    } else if (value === 8) {
      this.hiddenTicketId = false;
      this.hiddenChildAttach = false;
      this.hiddenCategory = true;
      this.hiddenRequestorName = false;
      this.hiddenRequestorLoginId = false;
      this.hiddenRequestorLocation = false;
      this.hiddenShortDescription = false;
      this.hiddenDate = false;
      this.hiddenAssignmentGroup = false;
      this.hiddenPriority = false;

    } else if (value === 9) {
      this.hiddenTicketId = true;
      this.hiddenChildAttach = false;
      this.hiddenCategory = false;
      this.hiddenRequestorName = false;
      this.hiddenRequestorLoginId = false;
      this.hiddenRequestorLocation = false;
      this.hiddenShortDescription = false;
      this.hiddenDate = false;
      this.hiddenAssignmentGroup = false;
      this.hiddenPriority = false;

    }
  }

  addUser(event: MatChipInputEvent): void {
    var PATTERN = '^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$';
    const value = (event.value || '').trim();
    if (value.match(PATTERN)) {
      this.userEmail.push(value);
    } else {
      this.notifier.notify('error', 'Enter a valid Email ID in Cc');
    }

    this.UserInput.nativeElement.value = '';
    this.searchCCUser.setValue(null);

  }

  remove(user: string): void {
    const index = this.userEmail.indexOf(user);

    if (index >= 0) {
      this.userEmail.splice(index, 1);
    }
  }

  getCCUsers(event: MatAutocompleteSelectedEvent): void {
    this.userEmail.push(event.option.value);
    this.UserInput.nativeElement.value = '';
    this.searchCCUser.setValue(null);
    // this.addUser(this.userEmail)
  }


  sendMail() {
    // if (this.cc != null && this.cc != '' && this.cc != undefined) {
    this.cc = this.userEmail.toString();
    this.sendSubject = this.ticketIdMail + this.subject;
    if (this.mail !== null && this.mail !== '' && this.mail !== undefined) {
      const data = {
        clientid: Number(this.clientId),
        mstorgnhirarchyid: Number(this.orgId),
        recordid: Number(this.tId),
        emailto: this.receiver,
        emailcc: this.cc,
        emailsub: this.sendSubject,
        emailbody: this.mail,
        createdgrpid: this.userGroupId,
        attachments: this.attachment
      };
      console.log(JSON.stringify(data));
      if (this.cc != null && this.cc != '' && this.cc != undefined) {
        this.dataLoadedForSendMail = true;
        this.rest.sendMailTicketWise(data).subscribe((res: any) => {
          this.dataLoadedForSendMail = false;
          if (res.success) {
            // this.receiver = '';
            this.cc = '';
            this.subject = this.desc;
            this.nameMsg = '';
            this.attachMsg = '';
            this.attachment = [];
            this.orginalDocumentName = [];
            this.usersList = [];
            this.userEmail = [];
            this.UserInput.nativeElement.value = '';
            // this.ticketIdMail = '';

            this.mail = 'Dear ' + this.rName + ',\n\n\n\nThanks and Regards,\nIntegrated Command Center - Mumbai (ICCM)';
            this.notifier.notify('success', this.messageService.MAIL_SENT);
          } else {
            this.notifier.notify('error', res.message);
          }
        });
      } else {
        this.notifier.notify('error', 'Selcet a valid Email ID in Cc');
      }
    } else {
      this.dataLoadedForSendMail = false;
      this.notifier.notify('error', this.messageService.BLANK_MAIL_BODY);
    }
    // } else {
    //   this.notifier.notify('error', this.messageService.BLANK_MAIL_IDS);
    // }
  }


  openParentModal() {
    this.tNumber = '';
    this.searchTicketdetails = [];
    this.showParentTicket = true;
    this.attachparentmodalRef = this.modalService.open(this.attachparent, {size: 'xl'});
    this.attachparentmodalRef.result.then((result) => {
    }, (reason) => {

    });
  }

  attachParentTicket() {
    this.isAttachedTicket = true;
    const data = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.orgId,
      'childid': this.tId,
      'parentid': this.searchTicketdetails[0].id,
      'recorddiffid': this.typeChecked,
      'recorddifftypeid': this.diffTypeId,
    };
    this.rest.addparentfromchild(data).subscribe((res: any) => {
      this.isAttachedTicket = false;
      if (res.success) {
        this.searchTicketdetails = [];
        this.attachparentmodalRef.close();
        this.notifier.notify('success', this.messageService.TICKET_ATTACHED);
        if (this.typeSeq === this.INCIDENT_SEQ) {
          this.getparentrecordidforIM();
        } else {
          this.getparentrecordid();
        }
        this.alltermsValue();
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onChildTicketCellClicked(eventData: any, args) {
    const pos = this.rowChildSelected.indexOf(args.row);
    if (pos < 0) {
      this.rowChildSelected.push(args.row);
    } else {
      this.rowChildSelected.splice(pos, 1);
    }
    if (args.cell !== -1) {
      this.gridObjChild.setSelectedRows(this.rowChildSelected);
    }
  }

  handleSelectedChildTicketRowsChanged(eventData: any, args) {
    if (Array.isArray(args.rows)) {
      this.selectedChildTitles = args.rows.map(idx => {
        const item = this.gridObjChild.getDataItem(idx);
        return item || '';
      });
    }
  }

  onParentClick() {
    const url = this.messageService.externalUrl + '?dt=' + this.parentIdno + '&au=' + this.messageService.getUserId() +
      '&bt=' + this.messageService.getToken() + '&tp=dp&i=' + this.clientId + '&m=' + this.orgId;
    window.open(url, '_blank');
  }

  onCellClickedTask(eventData, args) {
    const metadata = this.angularGridChild1.gridService.getColumnFromEventArguments(args);
    const url = this.messageService.externalUrl + '?dt=' + metadata.dataContext.id + '&au=' + this.messageService.getUserId() +
      '&bt=' + this.messageService.getToken() + '&tp=dp&i=' + this.clientId + '&m=' + this.orgId;
    window.open(url, '_blank');
  }

  attachTicket() {
    let linked = false;
    for (let i = 0; i < this.linkAttachedTicket.length; i++) {
      if (this.linkAttachedTicket[i].id === this.searchdetails[0].id) {
        this.notifier.notify('error', this.messageService.DUPLICATE_LINK);
        linked = true;
        break;
      }
    }
    if (!linked) {
      const data = {
        clientid: this.clientId,
        mstorgnhirarchyid: this.orgId,
        recordid: this.tId,
        linkrecordid: this.searchdetails[0].id,
        usergroupid: this.userGroupId,
        linkrecordno: this.ticNumber
      };
      this.rest.saverecordlink(data).subscribe((res: any) => {
        this.isLinkedSearchTicket = false;
        if (res.success) {
          this.linkAttachedTicket.push({
            id: this.searchdetails[0].id,
            code: this.searchdetails[0].code,
            recordtype: this.searchdetails[0].recordtype,
            title: this.searchdetails[0].title
          });
          this.searchdetails = [];
          this.isLinkAttachedTicket = true;
          this.alltermsValue();
          this.notifier.notify('success', this.messageService.TICKET_LINK);
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    }
  }

  searchLinkedTicket() {
    this.isLinkedSearchTicket = true;
    this.searchdetails = [];
    const data = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.orgId,
      'RecordNo': this.ticNumber.trim()
    };
    this.rest.getrecorddetailsbynoforlinkrecord(data).subscribe((res: any) => {
      this.isLinkedSearchTicket = false;
      if (res.success) {
        if (res.details.length > 0) {
          this.searchdetails = res.details;
          this.isLinkAttachedTicket = false;
          this.notifier.notify('success', this.messageService.TICKET_FOUND);
        } else {
          this.notifier.notify('error', this.messageService.NO_TICKET_FOUND);
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  clicksearch(id: any) {
    const url = this.messageService.externalUrl + '?dt=' + id + '&au=' + this.messageService.getUserId() + '&bt='
      + this.messageService.getToken() + '&tp=dp&i=' + this.clientId + '&m=' + this.orgId;
    window.open(url, '_blank');
  }

  removeTicket(i: number) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: this.orgId,
      recordid: this.tId,
      linkrecordid: this.linkAttachedTicket[i].id
    };
    this.rest.removerecordlink(data).subscribe((res: any) => {
      this.isLinkedSearchTicket = false;
      if (res.success) {
        this.linkAttachedTicket.splice(i, 1);
        this.notifier.notify('success', this.messageService.DELETE_SUCCESS);
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }


  afterclosed(field) {
    // console.log(val, seq);
    let field1;
    field1 = JSON.parse(JSON.stringify(field));
    if (field1.val + '' === 'Invalid Date' || field1.val === null) {
      field1.val = '';
    }
    field1.val = this.messageService.dateConverter(field1.val, 5);
    if (field1.seq === 67) {
      this.termstartdate = field1.val.trim();
      if (field1.val !== '') {
        for (let i = 0; i < this.planvalue.length; i++) {
          if (this.planvalue[i].seq === field1.seq) {
            this.planvalue.splice(i, 1);
          }
        }
        this.planvalue.push(field1);
      }
    } else if (field1.seq === 68) {
      this.termenddate = field1.val.trim();
      if (field1.val !== '') {
        for (let i = 0; i < this.planvalue.length; i++) {
          if (this.planvalue[i].seq === field1.seq) {
            this.planvalue.splice(i, 1);
          }
        }
        this.planvalue.push(field1);
      }
    }
    if (this.termstartdate !== '' && this.termenddate !== '') {
      const startdate = new Date(this.termstartdate);
      const enddate = new Date(this.termenddate);
      if (enddate.getTime() >= startdate.getTime()) {
        const diffTime = Number(enddate) - Number(startdate);
        // console.log(diffTime)
        const diffmin = Math.ceil(diffTime / (1000 * 60));
        // console.log(diffmin);
        const hmin = Math.floor(diffmin / 60);
        const mmin = Math.round(diffmin % 60);
        // console.log(hmin, mmin);
        // hour = hour + hmin;
        let hhour;
        let hhmin;
        if (hmin < 10) {
          hhour = '0' + hmin;
        } else {
          hhour = hmin;
        }
        if (mmin < 10) {
          hhmin = '0' + mmin;
        } else {
          hhmin = mmin;
        }
        for (let i = 0; i < this.extras.length; i++) {
          if (this.extras[i].seq === 62) {
            this.extras[i].val = hhour + ' hr : ' + hhmin + ' min';
            // field1.val = hhour + ' hr : ' + hhmin + ' min';
            for (let j = 0; j < this.planvalue.length; j++) {
              if (this.planvalue[j].seq === this.extras[i].seq) {
                this.planvalue.splice(j, 1);
              }
            }
            this.planvalue.push(this.extras[i]);
          }
        }

      } else {
        for (let i = 0; i < this.extras.length; i++) {
          if (this.extras[i].seq === 62) {
            this.extras[i].val = '';
          }
        }
        this.notifier.notify('error', this.messageService.ENDDATE_GREATER);
      }
      // console.log(startdate, enddate);
    } else {
      for (let i = 0; i < this.extras.length; i++) {
        if (this.extras[i].seq === 62) {
          this.extras[i].val = '';
        }
      }
    }
  }

  chnagetermdropdown(insertedvalue: any, seq: any) {
    // console.log(insertedvalue, seq);
    if (insertedvalue === 'Yes' && seq === 69) {
      this.messageService.setCMDBModalData({
        ticketid: this.tId,
        typeSeq: this.typeSeq,
        parentid: this.parentIdno,
        clientid: this.clientId,
        mstorgnhirarchyid: this.orgId,
        recordstageid: this.stageId
      });
    }
  }

  cmdbReview() {
    this.messageService.setCMDBModalData({
      ticketid: this.tId,
      typeSeq: this.typeSeq,
      parentid: this.parentIdno,
      clientid: this.clientId,
      mstorgnhirarchyid: this.orgId,
      recordstageid: this.stageId,
      statusseq: this.RESOLVE_STATUS_SEQUENCE
    });
  }

  onschedulechange(field: any) {
    this.isschedulechange = true;
    // console.log(field.val + '', typeof field.val);
    if (field.val + '' === 'Invalid Date' || field.val === null) {
      field.val = '';
    }
    // console.log(JSON.stringify(field));
    if (field.val !== '') {
      for (let i = 0; i < this.schedulevalue.length; i++) {
        if (this.schedulevalue[i].seq === field.seq) {
          this.schedulevalue.splice(i, 1);
        }
      }
      this.schedulevalue.push(field);
    }

  }

  onplandropdownchange(field) {
    this.isplanchange = true;
    if (field.seq === 57) {
      if (field.val === 'Yes') {
        this.displayMandatory = false;
      } else {
        this.displayMandatory = true;
      }
    }
    if (field.val + '' === 'Invalid Date' || field.val === null) {
      field.val = '';
    }
    if (field.val !== '') {
      for (let i = 0; i < this.planvalue.length; i++) {
        if (this.planvalue[i].seq === field.seq) {
          this.planvalue.splice(i, 1);
        }
      }
      this.planvalue.push(field);
    }
    // console.log(JSON.stringify(this.planvalue));
  }

  updatescheduletab() {
    const promise = new Promise((resolve, reject) => {
      if (this.isschedulechange) {
        const extrafields = [];
        // let schedulecount = 0;
        // let scheduleextraCount = 0;
        const scheduletabmod = JSON.parse(JSON.stringify(this.schedulevalue));
        // console.log("\n 11111111111       this.schedulevalue   =====>>>>>>>>>>  \n", this.schedulevalue);
        // console.log("\n 22222222222       this.scheduletab   =====>>>>>>>>>>  \n", this.scheduletab);

        let planStartDate;
        let planEndDate;
        let actualStartDate;
        let actualEndDate;
        let isStartDateAndTime = true;
        let currentDate = new Date();
        for (let i = 0; i < this.scheduletab.length; i++) {
          if (Number(this.scheduletab[i].seq) === 63) {
            planStartDate = new Date(this.scheduletab[i].val);
          }
          if (Number(this.scheduletab[i].seq) === 64) {
            planEndDate = new Date(this.scheduletab[i].val);
          }
          if (Number(this.scheduletab[i].seq) === 65) {
            if (this.scheduletab[i].val !== '') {
              actualStartDate = new Date(this.scheduletab[i].val);
            } else {
              actualStartDate = '';
            }
          }
          if (Number(this.scheduletab[i].seq) === 66) {
            if (this.scheduletab[i].val !== '') {
              actualEndDate = new Date(this.scheduletab[i].val);
            } else {
              actualEndDate = '';
            }
          }
        }
        if (planStartDate >= planEndDate) {
          isStartDateAndTime = false;
          this.notifier.notify('error', 'Planned End Date/Time must be greater than Planned Start Date/Time');
        }
        if ((actualStartDate !== '') && (actualEndDate !== '')) {
          if (actualStartDate >= actualEndDate) {
            isStartDateAndTime = false;
            this.notifier.notify('error', 'Actual End Date/Time must be greater than Actual Start Date/Time');
          } else {
            if (currentDate < actualStartDate) {
              isStartDateAndTime = false;
              this.notifier.notify('error', 'Actual Start Date/Time must be less than Current Date/Time');
            }
            if (currentDate < actualEndDate) {
              isStartDateAndTime = false;
              this.notifier.notify('error', 'Actual End Date/Time must be less than Current Date/Time');
            }
          }
        }

        // let scheduleerrorname = '';
        for (let i = 0; i < scheduletabmod.length; i++) {
          if (Number(scheduletabmod[i].termtypeid) === 4) {
            scheduletabmod[i].val = this.messageService.dateConverter(scheduletabmod[i].val, 1);
          } else if (Number(scheduletabmod[i].termtypeid) === 5) {
            scheduletabmod[i].val = this.messageService.dateConverter(scheduletabmod[i].val, 6);
          } else if (Number(scheduletabmod[i].termtypeid) === 7) {
            scheduletabmod[i].val = this.messageService.dateConverter(scheduletabmod[i].val, 5);
          }
          // if (scheduletabmod[i].iscompulsory === 1) {
          //   schedulecount++;
          //   if (scheduletabmod[i].val.trim() !== '' && scheduletabmod[i].val !== 'NONE') {
          //     scheduleextraCount++;
          //     extrafields.push({
          //       id: scheduletabmod[i].fieldid,
          //       val: scheduletabmod[i].val,
          //       termsid: scheduletabmod[i].id
          //     });
          //   } else {
          //     scheduleerrorname = scheduleerrorname + ' ' + scheduletabmod[i].tername + ',';
          //   }
          // } else {
          extrafields.push({
            id: scheduletabmod[i].fieldid,
            val: scheduletabmod[i].val,
            termsid: scheduletabmod[i].id
          });
          // }
        }
        // if (schedulecount !== scheduleextraCount) {
        //   this.notifier.notify('error', scheduleerrorname.substring(0, scheduleerrorname.length - 1) + this.messageService.BLANK_SCHEDULE_ERROR_MESSAGE);
        // } else {
        const data = {
          clientid: this.clientId,
          mstorgnhirarchyid: this.orgId,
          usergroupid: this.userGroupId,
          additionalfields: extrafields,
          recordid: this.tId,
        };
        if (isStartDateAndTime) {
          this.rest.updateadditionalfields(data).subscribe((res: any) => {
            if (res.success) {
              this.isschedulechange = false;
              this.notifier.notify('success', this.messageService.SCHEDULE_UPDATE);
              resolve(true);
              this.alltermsValue();
            } else {
              resolve(false);
              this.notifier.notify('error', res.message);
            }
          }, (err) => {
            this.notifier.notify('error', this.messageService.SERVER_ERROR);
          });
        }
        // }
      } else {
        resolve(true);
      }
    });
    return promise;
  }

  updateplantab() {
    const promise = new Promise((resolve, reject) => {
      // console.log(JSON.stringify(this.planvalue));
      if (this.isplanchange) {
        const extrafields = [];
        // let planerrorname = '';
        // let plancount = 0;
        // let planextraCount = 0;
        const plantabmod = JSON.parse(JSON.stringify(this.planvalue));
        for (let i = 0; i < plantabmod.length; i++) {
          if (Number(plantabmod[i].termtypeid) === 4) {
            plantabmod[i].val = this.messageService.dateConverter(plantabmod[i].val, 1);
          } else if (Number(plantabmod[i].termtypeid) === 5) {
            plantabmod[i].val = this.messageService.dateConverter(plantabmod[i].val, 6);
          } else if (Number(plantabmod[i].termtypeid) === 7) {
            plantabmod[i].val = this.messageService.dateConverter(plantabmod[i].val, 5);
          }
          // if (plantabmod[i].iscompulsory === 1) {
          //   plancount++;
          //   if (plantabmod[i].val.trim() !== '' && plantabmod[i].val !== 'NONE') {
          //     planextraCount++;
          //     extrafields.push({
          //       id: plantabmod[i].fieldid,
          //       val: plantabmod[i].val,
          //       termsid: plantabmod[i].id
          //     });
          //   } else {
          //     planerrorname = planerrorname + ' ' + plantabmod[i].tername + ',';
          //   }
          // } else {
          extrafields.push({
            id: plantabmod[i].fieldid,
            val: plantabmod[i].val,
            termsid: plantabmod[i].id
          });
          // }
        }
        // if (plancount !== planextraCount) {
        //   this.notifier.notify('error', planerrorname.substring(0, planerrorname.length - 1) + this.messageService.BLANK_PLAN_ERROR_MESSAGE);
        // } else {
        const data = {
          clientid: this.clientId,
          mstorgnhirarchyid: this.orgId,
          usergroupid: this.userGroupId,
          additionalfields: extrafields,
          recordid: this.tId,
        };
        // console.log(JSON.stringify(data));
        this.rest.updateadditionalfields(data).subscribe((res: any) => {
          if (res.success) {
            this.isplanchange = false;
            this.notifier.notify('success', this.messageService.PLAN_UPDATE);
            this.alltermsValue();
            resolve(true);
          } else {
            resolve(false);
            this.notifier.notify('error', res.message);
          }
        }, (err) => {
          this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
        // }
      } else {
        resolve(true);
      }
    });
    return promise;
  }

  onUserSelected(user: any) {
    // console.log(JSON.stringify(user));
    this.userSelected = user.id;

  }

  fetchGroupUser() {
    this.groupUsers = [];
    this.listusersdialog = this.dialog.open(this.listusers, {
      width: '500px', height: '450px'
    });
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: this.orgId,
      groupid: this.lastgroupid,
    };
    this.rest.searchuserdetailsbygroupid(data).subscribe((res: any) => {
      // this.isLinkedSearchTicket = false;
      if (res.success) {
        this.groupUsers = res.details;
        // this.notifier.notify('success', this.messageService.DELETE_SUCCESS);
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  closelistusers() {
    this.listusersdialog.close();
  }

  changeCategory() {
    if (this.isChangeCategory) {
      this.commentTerm = '';
      this.termopentype = 'category';
      this.opencommentterm();
    } else {
      this.notifier.notify('error', this.messageService.CATEGORY_SAVE);
    }
  }

  getrecordnames() {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: this.orgId,
      linkrecordid: this.tId,
    };
    this.rest.getrecordnames(data).subscribe((res: any) => {
      // this.isLinkedSearchTicket = false;
      if (res.success) {
        this.linkedticket = res.recordnames;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  addVendorTicket() {
    // this.dataLoadedForAddEffort = true;
    // this.commentTerm = '';
    this.oldvendorid = this.vendorid;
    this.termopentype = 'vendorticket';
    this.openvendorticketterm();
    // this.dataLoadedForAddEffort = false;

  }

  addVendorTicketTerm() {
    this.commentTerm = this.vendorid;
    // console.log(this.vendorid);
    this.updatecommentterm();
    this.addvendortickettermdialog.close();
  }

  closeVendor() {
    this.addvendortickettermdialog.close();
    this.vendorid = this.oldvendorid;
  }

  openvendorticketterm() {
    this.addvendortickettermdialog = this.dialog.open(this.addvendorticket, {
      width: '500px', hasBackdrop: false
    });
  }

  updatecommentterm() {
    console.log(this.termopentype);
    this.dataLoadedForAddButton = true;
    let type = 0;
    if (this.termopentype === 'vendorticket') {
      type = this.VENDOR_TICKET_SEQ;
    }
    if (type > 0) {
      this.updatevendorticketid(type, '', this.commentTerm).then((success) => {
        this.dataLoadedForAddButton = false;
        if (success) {
          this.commentTerm = '';
          if (this.commenttermdialog) {
            this.commenttermdialog.close('dynamic');
          }
          this.notifier.notify('success', this.messageService.COMMENT_SUCCESS);
          if (this.termopentype === 'vendorticket') {
            this.alltermsValue();
          }
        }
      }, () => {
        this.dataLoadedForAddButton = false;
      });
    } else {
      this.dataLoadedForAddButton = false;
    }
  }

  updatevendorticketid(typeseq, termdescription, termvalue) {
    const promise = new Promise((resolve, reject) => {
      if (termvalue.trim() !== '') {
        const data = {
          'clientid': this.clientId,
          'mstorgnhirarchyid': Number(this.orgId),
          'recordid': Number(this.tId),
          'recordstageid': Number(this.stageId),
          'termseq': typeseq,
          'recorddifftypeid': Number(this.diffTypeId),
          'recorddiffid': Number(this.typeChecked),
          'usergroupid': this.userGroupId,
          'foruserid': Number(this.messageService.getUserId()),
          'termvalue': String(termvalue),
          'termdescription': termdescription
        };
        this.rest.updatevendorticketid(data).subscribe((res: any) => {
          if (res.success) {

            resolve(true);
          } else {
            this.notifier.notify('error', res.message);
            resolve(false);
          }
        }, (err) => {
          this.notifier.notify('error', this.messageService.SERVER_ERROR);
          reject();
        });
      } else {
        this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
        reject();
      }

    });
    return promise;
  }
}
