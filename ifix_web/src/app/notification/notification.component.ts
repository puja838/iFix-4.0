import {Component, EventEmitter, OnInit, Input, OnDestroy, Output, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {RestApiService} from '../rest-api.service';
import {MessageService} from '../message.service';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {Formatters, OnEventArgs} from 'angular-slickgrid';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {AngularGridInstance, Column, GridOption, Grouping, SortDirectionNumber, Sorters} from 'angular-slickgrid';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  displayed = true;
  moduleName: string;
  description: string;
  totalData = 0;
  show: boolean;
  selected: number;
  respObject: any;
  add: boolean;
  del: boolean;
  edit: boolean;
  view: boolean;
  displayData: any;
  isError = false;
  errorMessage: string;
  pageSize: number;
  clientId: number;
  offset: number;
  dataLoaded: boolean;
  isLoading = false;
  moduleSelected: any;
  modules: any;
  des: string;
  totalPage: number;
  selectedId: number;
  private baseFlag: any;
  private adminAuth: Subscription;
  @ViewChild('content') private content;
  private modalReference: NgbModalRef;
  organizationId = '';
  organizationName = '';
  ticketType = '';
  formTicketTypeList = [];
  organizationList = [];
  loginUserOrganizationId: number;
  seqNo = 1;
  recordTypeStatus = [];
  fromRecordDiffTypeId = '';
  fromRecordDiffType = 2;
  fromRecordDiffId = '';
  seq: any;
  recorddifftypename: string;
  recorddiffname: string;
  process: string;
  colVal: any;
  colVals = [];
  colValName: string;
  databases = [];
  selectDatabase: number;
  selectTable: number;
  tables = [];
  selectedRecordTypeId: any;
  fromRecordDiffType1 = 2;
  updateFlag = 0;
  selectDatabase1: number;
  databaseSelected: number;
  selectTable1: number;
  tableSelected: number;
  selctColumn: number;
  columnSelected: number;
  mstprocesstoentityid: number;
  mstprocessrecordmapid: number;
  workingList = [];
  workingdiffid: any;
  private workingtypeid: number;
  private workingdiff1: any;

  channeldiffid: any;
  channelList = [
    {'id': 0, 'name': 'Select Channel'},
    {'id': 1, 'name': 'Email'},
    {'id': 2, 'name': 'SMS'}
  ];
  inputSubject: any;
  textField: boolean = false;
  isTitle: boolean;
  istextarea: boolean;
  isemailarea: boolean;
  contentValue: any;
  grpSelectedTO = [];
  grpSelectedCC = [];
  groups = [];
  searchUserTO: FormControl = new FormControl();
  searchUserCC: FormControl = new FormControl();
  selectedUserTO: any;
  selectedUserCC: any;
  Users = [];
  enteredAdditionalRecipient: any;
  eventtypeid: any;
  EventTypes = [];
  reserveArr1 = [];
  reserveArr2 = [];
  isselectedUserTO: boolean = false;
  isselectedUserCC: boolean = false;
  margeArr = [];
  margeArr2 = [];
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset = [];
  angularGrid: AngularGridInstance;
  gridObj: any;
  selectedTitles = [];
  itemsPerPage: number;
  pageSizeObj: any[];
  pageSizes: number;
  paginationObj: any;
  folderClicked: any;
  pageSizeSelected: number;
  page_no: number;
  maxLength = 3;
  page = 1;
  hideBtn: boolean;
  isDisplay: boolean;
  totalItem: number;
  @Output() offset1 = new EventEmitter();
  private dataviewObj: any;
  workingdiffname: any;
  channeldiffname: any;
  eventtypename: any;
  @ViewChild('openpopup') private openpopup;
  tableArrayTO = [];
  tableArrayCC = [];
  workingcategoryid: any;
  workingcategorytype: any;
  fromPropLevels = [];
  fromlevelid: string;
  toTicketTypeList = [];
  isUpdate: boolean = false;

  checkRequestor: boolean;
  checkOpenedBy: boolean;
  sendtocreator: number;
  sendtoorgcreator: number;
  isEventTypeStatus: boolean = false;
  isEventTypeNumberCount: boolean = false;
  isEventTypePriority: boolean = false;
  isEventTypeSLA: boolean = false;
  isEventTypeAging: boolean = false;
  isEventTypeNoofDays: boolean = false;
  PRIORITY_SEQ = 4;
  STATUS_SEQ = 2;
  priorityArr = [];
  statusArr = [];
  statusid: any;
  noofcount: any;
  priorityid: any;
  processid: any;
  processcomplete: any;
  processcompleteCustom: any;
  noofdays: any;
  rateControl = new FormControl('', [Validators.max(100), Validators.min(0)]);
  myFG = new FormGroup({
    rateFC: new FormControl(0, [Validators.min(0), Validators.max(100)])
  });

  @ViewChild('varHelp') private varHelp;
  checkAssignee: boolean = false;
  checkAssigneeGroup: boolean = false;
  checkAssigneeGroupMember: boolean = false;
  sendtoassignee: number;
  sendtoassigneegroup: number;
  sendtoassigneegroupmember: number;
  eventtypeid1: any;
  variablesList = [];
  groupsId = [];
  grpName = [];
  worksId = [];
  indiaDltContentTemplateId: any;
  selectedSmsType: any;
  SMSTypes = [
    {'id': 0, 'typename': 'Select SMS Type'},
    {'id': 1, 'typename': 'longSMS'},
  ];

  resolutionType: any;

  constructor(private rest: RestApiService, private messageService: MessageService,
              private route: Router, private modalService: NgbModal, private notifier: NotifierService) {

    this.messageService.getTotalData().subscribe(totalData => {
      this.totalData = totalData;
    });

    this.messageService.getCellChangeData().subscribe(item => {
      // console.log("\n ITEM >>>>>>>>>>>>>>>> ", item);
      this.tableArrayTO = [];
      this.tableArrayCC = [];
      if (item.type !== 'change1' || item.type !== 'delete' || item.type !== '_checkbox_selector') {
        for (let i = 0; i < item.recipients.length; i++) {
          if (item.recipients[i].recipienttype === 'TO') {
            this.tableArrayTO.push(item.recipients[i]);
          } else {
            this.tableArrayCC.push(item.recipients[i]);
          }
        }
      }

      switch (item.type) {
        case 'change':
          // console.log('changed');
          if (!this.edit) {
            this.notifier.notify('error', 'You do not have edit permission');
          } else {
            if (confirm('Are you sure?')) {

            }
          }
          break;
        case 'delete':
          // console.log('deleted');
          if (!this.del) {
            this.notifier.notify('error', 'You do not have delete permission');
          } else {
            if (confirm('Are you sure?')) {
              this.rest.deletenotificationtemplate({
                id: item.id
              }).subscribe((res) => {
                this.respObject = res;
                if (this.respObject.success) {
                  this.angularGrid.gridService.deleteItemById(item.id);
                  this.totalData = this.totalData - 1;
                  this.notifier.notify('success', this.messageService.DELETE_SUCCESS);

                } else {
                  this.notifier.notify('error', this.respObject.message);
                }
              }, (err) => {
                this.notifier.notify('error', this.messageService.SERVER_ERROR);
              });
            }
          }
          break;
      }
    });

    this.messageService.getColumnDefinitions().subscribe(rawData => {
      this.columnDefinitions = rawData;
    });

    this.messageService.getSelectedItemData().subscribe(selectedTitles => {
      if (selectedTitles.length > 0) {
        this.show = true;
        this.selected = selectedTitles.length;
      } else {
        this.show = false;
      }
    });
  }

  ngOnInit(): void {
    this.isUpdate = false;
    this.channeldiffid = 0;
    this.resolutionType = 2;
    this.pageSizeObj = this.messageService.pagination;
    this.itemsPerPage = this.messageService.pageSize;

    this.isselectedUserTO = false;
    this.isselectedUserCC = false;
    this.isTitle = true;
    this.channeldiffid = '';
    this.eventtypeid = 0;
    this.totalPage = 0;
    this.dataLoaded = true;
    this.displayData = {
      pageName: 'Maintain Notification',
      openModalButton: 'Add Notification',
      breadcrumb: '',
      folderName: '',
      tabName: 'Map Notification'
    };


    this.columnDefinitions = [
      {
        id: 'delete',
        field: 'id',
        excludeFromHeaderMenu: true,
        formatter: Formatters.deleteIcon,
        minWidth: 30,
        maxWidth: 30,
      },
      {
        id: 'edit',
        field: 'id',
        excludeFromHeaderMenu: true,
        formatter: Formatters.editIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          console.log('\n \n DATA CONTEXT   >>>>>>>>>>>>>>>>>> ', JSON.stringify(args.dataContext));
          this.isError = false;
          this.formTicketTypeList = [];
          this.recordTypeStatus = [];
          this.resetValues();
          this.selectedId = args.dataContext.id;
          this.clientId = args.dataContext.clientid;
          this.organizationId = args.dataContext.mstorgnhirarchyid;
          this.organizationName = args.dataContext.mstorgnhirarchyname;
          this.fromRecordDiffType1 = this.fromRecordDiffType = args.dataContext.recordtypetypeid;
          this.recorddifftypename = args.dataContext.recordtypetype;
          this.fromRecordDiffId = args.dataContext.recordtypeid;
          this.recorddiffname = args.dataContext.recordtype;
          this.workingdiff1 = args.dataContext.workingcategoryid;
          this.workingdiffname = args.dataContext.workingcategory;
          this.workingcategoryid = args.dataContext.workingcategorytypeid;
          this.workingcategorytype = args.dataContext.workingcategorytype;
          this.channeldiffid = args.dataContext.channeltypeid;
          this.channeldiffname = args.dataContext.channeltype;
          this.inputSubject = args.dataContext.subjectortitle;
          this.contentValue = args.dataContext.body;
          this.enteredAdditionalRecipient = args.dataContext.additionalrecipient;
          this.eventtypeid1 = args.dataContext.eventtypeid;
          this.eventtypename = args.dataContext.eventtype;
          this.sendtocreator = args.dataContext.sendtocreator;
          this.sendtoorgcreator = args.dataContext.sendtoorgcreator;
          this.sendtoassignee = args.dataContext.sendtoassignee;
          this.sendtoassigneegroup = args.dataContext.sendtoassigneegroup;
          this.sendtoassigneegroupmember = args.dataContext.sendtoassigneegroupmember;

          this.noofcount = args.dataContext.eventparams.noofcount;
          this.noofdays = args.dataContext.eventparams.noofdays;
          this.priorityid = args.dataContext.eventparams.priorityid;
          this.processcomplete = args.dataContext.eventparams.processcomplete;
          this.processid = args.dataContext.eventparams.processid;
          this.statusid = args.dataContext.eventparams.statusid;
          this.resolutionType = args.dataContext.isconverted;

          this.indiaDltContentTemplateId = args.dataContext.smstemplateid;
          this.selectedSmsType = args.dataContext.smstypeid;

          this.updateFlag = 1;

          if (Number(this.statusid) !== 0) {
            this.isEventTypeStatus = true;
            this.isEventTypeNumberCount = false;
            this.isEventTypePriority = false;
            this.isEventTypeSLA = false;
            this.isEventTypeAging = false;
            this.isEventTypeNoofDays = false;

            this.getEventTypePropertyValue(this.STATUS_SEQ).then((details: any[]) => {
              details.unshift({id: 0, typename: 'Select Status'});
              this.statusArr = details;
            });

          } else if (Number(this.priorityid) !== 0 && Number(this.noofdays) === 0) {
            this.isEventTypeStatus = false;
            this.isEventTypeNumberCount = false;
            this.isEventTypePriority = true;
            this.isEventTypeSLA = false;
            this.isEventTypeAging = false;
            this.isEventTypeNoofDays = false;

            this.getEventTypePropertyValue(this.PRIORITY_SEQ).then((details: any[]) => {
              details.unshift({id: 0, typename: 'Select Priority'});
              this.priorityArr = details;
            });

          } else if (Number(this.noofcount) !== 0) {
            this.isEventTypeStatus = false;
            this.isEventTypeNumberCount = true;
            this.isEventTypePriority = false;
            this.isEventTypeSLA = false;
            this.isEventTypeAging = false;
            this.isEventTypeNoofDays = false;

          } else if (Number(this.processid) !== 0 && Number(this.processcomplete) !== 0) {
            this.isEventTypeStatus = false;
            this.isEventTypeNumberCount = false;
            this.isEventTypePriority = false;
            this.isEventTypeSLA = true;
            this.isEventTypeAging = false;
            this.isEventTypeNoofDays = false;

            this.getEventTypePropertyValue(this.PRIORITY_SEQ).then((details: any[]) => {
              details.unshift({id: 0, typename: 'Select Priority'});
              this.priorityArr = details;
            });

          } else if (Number(this.priorityid) !== 0 && Number(this.noofdays) !== 0) {
            this.isEventTypeStatus = false;
            this.isEventTypeNumberCount = false;
            this.isEventTypePriority = false;
            this.isEventTypeSLA = false;
            this.isEventTypeAging = true;
            this.isEventTypeNoofDays = false;

            this.getEventTypePropertyValue(this.PRIORITY_SEQ).then((details: any[]) => {
              details.unshift({id: 0, typename: 'Select Priority'});
              this.priorityArr = details;
            });

          } else if (Number(this.noofdays) !== 0) {
            this.isEventTypeStatus = false;
            this.isEventTypeNumberCount = false;
            this.isEventTypePriority = false;
            this.isEventTypeSLA = false;
            this.isEventTypeAging = false;
            this.isEventTypeNoofDays = true;

          } else {
            this.isEventTypeStatus = false;
            this.isEventTypeNumberCount = false;
            this.isEventTypePriority = false;
            this.isEventTypeSLA = false;
            this.isEventTypeAging = false;
            this.isEventTypeNoofDays = false;

          }


          if (Number(this.sendtocreator) === 1) {
            this.checkRequestor = true;
          } else {
            this.checkRequestor = false;
          }
          if (Number(this.sendtoorgcreator) === 1) {
            this.checkOpenedBy = true;
          } else {
            this.checkOpenedBy = false;
          }
          if (Number(this.sendtoassignee) === 1) {
            this.checkAssignee = true;
          } else {
            this.checkAssignee = false;
          }
          if (Number(this.sendtoassigneegroup) === 1) {
            this.checkAssigneeGroup = true;
          } else {
            this.checkAssigneeGroup = false;
          }
          if (Number(this.sendtoassigneegroupmember) === 1) {
            this.checkAssigneeGroupMember = true;
          } else {
            this.checkAssigneeGroupMember = false;
          }

          for (let i = 0; i < args.dataContext.recipients.length; i++) {
            if (args.dataContext.recipients[i].recipienttype === 'TO') {
              this.grpSelectedTO.push(args.dataContext.recipients[i].groupid);
              if (args.dataContext.recipients[i].userid !== 0) {
                this.reserveArr1.push({
                  'id': args.dataContext.recipients[i].userid,
                  'name': args.dataContext.recipients[i].username,
                  'groupid': args.dataContext.recipients[i].groupid
                });
              }
            } else {
              this.grpSelectedCC.push(args.dataContext.recipients[i].groupid);
              if (args.dataContext.recipients[i].userid !== 0) {
                this.reserveArr2.push({
                  'id': args.dataContext.recipients[i].userid,
                  'name': args.dataContext.recipients[i].username,
                  'groupid': args.dataContext.recipients[i].groupid
                });
              }
            }
          }

          if (this.channeldiffid === 1) {
            this.textField = true;
            this.isTitle = false;
            this.istextarea = false;
            this.isemailarea = true;
          } else if (this.channeldiffid === 2) {
            this.textField = true;
            this.isTitle = true;
            this.istextarea = true;
            this.isemailarea = false;
          }

          if (this.reserveArr1.length > 0) {
            this.isselectedUserTO = true;
          }
          if (this.reserveArr2.length > 0) {
            this.isselectedUserCC = true;
          }

          this.getRecordDiffType();
          this.getDatabase('u');
          this.onPropertyChange(this.workingdiff1, 'u');
          this.getTable();
          this.getColumn();
          this.getnotificationevents('u');
          this.getGroupData(this.grpSelectedTO);
          this.getGroupData(this.grpSelectedCC);
          this.getallnotificationvariables();

          for (let i = 0; i < this.recordTypeStatus.length; i++) {
            if (Number(this.recordTypeStatus[i].id) === Number(this.fromRecordDiffType)) {
              this.seq = this.recordTypeStatus[i].seqno;
              this.getrecord(this.seq);
            }
          }
          this.modalReference = this.modalService.open(this.content, {size: 'lg'});
          this.isUpdate = true;
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },
      {
        id: 'mstorgnhirarchyname',
        name: 'Organization',
        field: 'mstorgnhirarchyname',
        minWidth: 200,
        sortable: true,
        filterable: true
      },
      {
        id: 'recordtypetype',
        name: 'Record Type',
        field: 'recordtypetype',
        minWidth: 200,
        sortable: true,
        filterable: true
      },
      {
        id: 'recordtype',
        name: 'Property',
        field: 'recordtype',
        minWidth: 200,
        sortable: true,
        filterable: true
      },
      {
        id: 'workingcategory',
        name: 'Working Category',
        field: 'workingcategory',
        minWidth: 200,
        sortable: true,
        filterable: true
      },
      {
        id: 'channeltype',
        name: 'Channel Type',
        field: 'channeltype',
        minWidth: 200,
        sortable: true,
        filterable: true
      },
      {
        id: 'subjectortitle',
        name: 'Subject or Title',
        field: 'subjectortitle',
        sortable: true,
        minWidth: 200,
        filterable: true
      },
      {
        id: 'body',
        name: 'Body',
        field: 'body',
        minWidth: 200,
        sortable: true,
        filterable: true
      },
      {
        id: 'additionalrecipient',
        name: 'Additional Recipient',
        field: 'additionalrecipient',
        minWidth: 200,
        sortable: true,
        filterable: true
      },
      {
        id: 'eventtype',
        name: 'Event Type',
        field: 'eventtype',
        minWidth: 200,
        sortable: true,
        filterable: true
      },
      {
        id: 'statusname',
        name: 'Status',
        field: 'statusname',
        minWidth: 200,
        sortable: true,
        filterable: true
      },
      {
        id: 'smstemplateid',
        name: 'indiaDltContentTemplateId',
        field: 'smstemplateid',
        minWidth: 200,
        sortable: true,
        filterable: true
      },
      {
        id: 'smstype',
        name: 'SMS Type',
        field: 'smstype',
        minWidth: 200,
        sortable: true,
        filterable: true
      }, {
        id: 'convertedtype',
        name: 'Resolution Type',
        field: 'convertedtype',
        minWidth: 200,
        sortable: true,
        filterable: true
      },
    ];

    this.clientId = this.messageService.clientId;
    this.messageService.setColumnDefinitions(this.columnDefinitions);
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.baseFlag = this.messageService.baseFlag;
      this.loginUserOrganizationId = this.messageService.orgnId;
      this.edit = this.messageService.edit;
      this.del = this.messageService.del;
      this.onPageLoad();
    } else {
      this.adminAuth = this.messageService.getClientUserAuth().subscribe(auth => {
        // this.view = auth[0].viewFlag;
        // this.add = auth[0].addFlag;
        this.edit = auth[0].editFlag;
        this.del = auth[0].deleteFlag;
        this.clientId = auth[0].clientid;
        this.baseFlag = auth[0].baseFlag;
        this.loginUserOrganizationId = auth[0].mstorgnhirarchyid;
        this.onPageLoad();
      });
    }


    this.isDisplay = false;
    setTimeout(() => {
      this.isDisplay = true;

    }, 0);
    this.gridOptions = {
      enableAutoResize: true,
      enableCellNavigation: true,
      enableFiltering: true,
      editable: true,
      rowSelectionOptions: {
        selectActiveRow: false
      },
      enableCheckboxSelector: true,
      enableRowSelection: true,
    };
    this.dataset = [];

  }

  angularGridReady(angularGrid: AngularGridInstance) {
    // console.log('grid initiate');
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid && angularGrid.slickGrid || {};
    this.dataviewObj = angularGrid.dataView;
  }


  onCellChanged(e, args) {
    // console.log(args.item);
  }


  onGridChanged(values: any, type) {
    event.preventDefault();
    // console.log(JSON.stringify(values))
    if (type === 'filter') {

    } else if (type === 'sorter') {

    }
  }

  onGroupChange2(index) {
    this.grpName = index.supportgroupname;
    //this.groupsId.push(index.id);
    this.onGrpChange2(this.grpSelectedCC);
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
      // console.log(JSON.stringify(this.selectedTitles));
    }
  }

  onCellClicked(e, args) {
    const metadata = this.angularGrid.gridService.getColumnFromEventArguments(args);
    // console.log("\n META DATA >>>>>>>>  ", JSON.stringify(metadata));
    if (metadata.columnDef.id === 'delete') {
      metadata.dataContext.type = 'delete';
      this.messageService.setCellChangeData(metadata.dataContext);
    } else if (metadata.columnDef.id === 'edit') {
      metadata.dataContext.type = 'change1';
      this.messageService.setCellChangeData(metadata.dataContext);
    } else {
      if (metadata.columnDef.id !== '_checkbox_selector') {
        this.resetValues();
        this.selectedId = metadata.dataContext.id;
        this.clientId = metadata.dataContext.clientid;
        this.organizationId = metadata.dataContext.mstorgnhirarchyid;
        this.organizationName = metadata.dataContext.mstorgnhirarchyname;
        this.eventtypeid1 = metadata.dataContext.eventtypeid;
        this.eventtypename = metadata.dataContext.eventtype;

        this.sendtocreator = metadata.dataContext.sendtocreator;
        this.sendtoorgcreator = metadata.dataContext.sendtoorgcreator;
        this.sendtoassignee = metadata.dataContext.sendtoassignee;
        this.sendtoassigneegroup = metadata.dataContext.sendtoassigneegroup;
        this.sendtoassigneegroupmember = metadata.dataContext.sendtoassigneegroupmember;

        this.noofcount = metadata.dataContext.eventparams.noofcount;
        this.noofdays = metadata.dataContext.eventparams.noofdays;
        this.priorityid = metadata.dataContext.eventparams.priorityid;
        this.processcomplete = metadata.dataContext.eventparams.processcomplete;
        this.processid = metadata.dataContext.eventparams.processid;
        this.statusid = metadata.dataContext.eventparams.statusid;

        this.updateFlag = 1;

        if (Number(this.statusid) !== 0) {
          this.isEventTypeStatus = true;
          this.isEventTypeNumberCount = false;
          this.isEventTypePriority = false;
          this.isEventTypeSLA = false;
          this.isEventTypeAging = false;
          this.isEventTypeNoofDays = false;

          this.getEventTypePropertyValue(this.STATUS_SEQ).then((details: any[]) => {
            details.unshift({id: 0, typename: 'Select Status'});
            this.statusArr = details;
          });

        } else if (Number(this.priorityid) !== 0 && Number(this.noofdays) === 0) {
          this.isEventTypeStatus = false;
          this.isEventTypeNumberCount = false;
          this.isEventTypePriority = true;
          this.isEventTypeSLA = false;
          this.isEventTypeAging = false;
          this.isEventTypeNoofDays = false;

          this.getEventTypePropertyValue(this.PRIORITY_SEQ).then((details: any[]) => {
            details.unshift({id: 0, typename: 'Select Priority'});
            this.priorityArr = details;
          });

        } else if (Number(this.noofcount) !== 0) {
          this.isEventTypeStatus = false;
          this.isEventTypeNumberCount = true;
          this.isEventTypePriority = false;
          this.isEventTypeSLA = false;
          this.isEventTypeAging = false;
          this.isEventTypeNoofDays = false;

        } else if (Number(this.processid) !== 0 && Number(this.processcomplete) !== 0) {
          this.isEventTypeStatus = false;
          this.isEventTypeNumberCount = false;
          this.isEventTypePriority = false;
          this.isEventTypeSLA = true;
          this.isEventTypeAging = false;
          this.isEventTypeNoofDays = false;

          this.getEventTypePropertyValue(this.PRIORITY_SEQ).then((details: any[]) => {
            details.unshift({id: 0, typename: 'Select Priority'});
            this.priorityArr = details;
          });

        } else if (Number(this.priorityid) !== 0 && Number(this.noofdays) !== 0) {
          this.isEventTypeStatus = false;
          this.isEventTypeNumberCount = false;
          this.isEventTypePriority = false;
          this.isEventTypeSLA = false;
          this.isEventTypeAging = true;
          this.isEventTypeNoofDays = false;

          this.getEventTypePropertyValue(this.PRIORITY_SEQ).then((details: any[]) => {
            details.unshift({id: 0, typename: 'Select Priority'});
            this.priorityArr = details;
          });

        } else if (Number(this.noofdays) !== 0) {
          this.isEventTypeStatus = false;
          this.isEventTypeNumberCount = false;
          this.isEventTypePriority = false;
          this.isEventTypeSLA = false;
          this.isEventTypeAging = false;
          this.isEventTypeNoofDays = true;

        } else {
          this.isEventTypeStatus = false;
          this.isEventTypeNumberCount = false;
          this.isEventTypePriority = false;
          this.isEventTypeSLA = false;
          this.isEventTypeAging = false;
          this.isEventTypeNoofDays = false;

        }

        if (Number(this.sendtocreator) === 1) {
          this.checkRequestor = true;
        } else {
          this.checkRequestor = false;
        }
        if (Number(this.sendtoorgcreator) === 1) {
          this.checkOpenedBy = true;
        } else {
          this.checkOpenedBy = false;
        }
        if (Number(this.sendtoassignee) === 1) {
          this.checkAssignee = true;
        } else {
          this.checkAssignee = false;
        }
        if (Number(this.sendtoassigneegroup) === 1) {
          this.checkAssigneeGroup = true;
        } else {
          this.checkAssigneeGroup = false;
        }
        if (Number(this.sendtoassigneegroupmember) === 1) {
          this.checkAssigneeGroupMember = true;
        } else {
          this.checkAssigneeGroupMember = false;
        }

        this.getnotificationevents('u');
        this.isUpdate = true;
        this.modalReference = this.modalService.open(this.openpopup, {size: 'lg'});
      }
      this.messageService.setCellChangeData(metadata.dataContext);
    }
  }


  onPageLoad() {
    this.itemsPerPage = this.pageSizeObj[0].value;
    this.pageSizeSelected = Number(this.messageService.pageSelected);
    this.getorganizationclientwise();
    this.getTableData();
  }

  onOrgChange(index: any) {
    this.organizationName = this.organizationList[index - 1].organizationname;
    this.getRecordDiffType();
    this.getDatabase('i');
    this.grpSelectedTO = [];
    this.grpSelectedCC = [];
    this.getGroupData(this.grpSelectedTO);
    this.getGroupData(this.grpSelectedCC);
    this.getnotificationevents('i');
    this.getallnotificationvariables();
  }

  getGroupData(grpSelect) {
    this.rest.getgroupbyorgid({
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.organizationId),
      // offset: 0,
      // limit: 100
    }).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.groups = this.respObject.details;
        this.selectAll(this.groups);
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, function(err) {

    });
  }

  onGrpChange1() {
    this.isLoading = false;
    this.searchUserTO.valueChanges.subscribe(
      psOrName => {
        const data = {
          'mstorgnhirarchyid': Number(this.organizationId),
          'clientid': Number(this.clientId),
          'loginname': psOrName,
          'groupids': this.grpSelectedTO
        };
        // console.log(data);
        this.isLoading = true;
        if (psOrName !== '') {
          this.rest.searchloginnamebygroupids(data).subscribe((res1) => {
            this.respObject = res1;
            this.isLoading = false;
            if (this.respObject.success) {
              this.Users = this.respObject.details;
            } else {
              this.notifier.notify('error', this.respObject.message);
            }
          }, (err) => {
            this.isLoading = false;
            this.notifier.notify('error', this.messageService.SERVER_ERROR);
          });
        } else {
          this.Users = [];
          this.isLoading = false;
        }
      });
  }

  onGrpChange2(grpId) {
    this.isLoading = false;
    this.searchUserCC.valueChanges.subscribe(
      psOrName => {
        const data = {
          'mstorgnhirarchyid': Number(this.organizationId),
          'clientid': Number(this.clientId),
          'loginname': psOrName,
          'groupids': grpId
        };
        this.isLoading = true;
        if (psOrName !== '') {
          this.rest.searchloginnamebygroupids(data).subscribe((res1) => {
            this.respObject = res1;
            this.isLoading = false;
            if (this.respObject.success) {
              this.Users = this.respObject.details;
            } else {
              this.notifier.notify('error', this.respObject.message);
            }
          }, (err) => {
            this.isLoading = false;
            this.notifier.notify('error', this.messageService.SERVER_ERROR);
          });
        } else {
          this.Users = [];
          this.isLoading = false;
        }
      });

  }


  getDatabase(type) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      type: 4
    };
    this.rest.getworklowutilitylist(data).subscribe((res: any) => {
      if (res.success) {
        res.details.unshift({id: 0, name: 'Select Database'});
        this.databases = res.details;
        if (type === 'i') {
          this.selectDatabase = 0;
        } else {
          this.selectDatabase = this.selectDatabase1;
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getTable() {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      type: 1,
      fieldid: Number(this.selectDatabase)
    };
    this.rest.getutilitydatabyfield(data).subscribe((res: any) => {
      if (res.success) {
        res.details.unshift({id: 0, name: 'Select Table'});
        this.tables = res.details;
        this.selectTable = 0;
        this.tableSelected = this.selectTable1;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onColValChange(index) {
    this.colValName = this.colVals[index].name;
  }

  openModal(content) {
    this.isError = false;
    this.resetValues();
    this.isUpdate = false;
    this.modalService.open(content, {size: 'lg'}).result.then((result) => {
    }, (reason) => {

    });
  }


  getTableData() {
    let customOffset;
    if (this.pageSizes === undefined) {
      customOffset = 0;
    } else {
      customOffset = this.pageSizes;
    }
    this.getData({offset: Number(customOffset), limit: this.itemsPerPage});
  }

  getData(paginationObj) {
    const offset = paginationObj.offset;
    const limit = paginationObj.limit;
    this.dataLoaded = false;
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: this.loginUserOrganizationId,
      offset: offset,
      limit: limit
    };
    this.rest.getallnotificationtemplates(data).subscribe((res) => {
      this.respObject = res;
      this.executeResponse(this.respObject, offset);
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  executeResponse(respObject, offset) {
    if (respObject.success) {
      this.dataLoaded = true;
      this.dataset = [];
      if (offset === 0) {
        this.totalData = respObject.details.total;
      }
      const data = respObject.details.values;
      this.dataset = data;
      this.messageService.setTotalData(this.totalData);
      // this.messageService.setGridData(data);
    } else {
      this.notifier.notify('error', respObject.message);
    }
  }


  onPageSizeChange(value: any) {
    this.page = 1;
    this.itemsPerPage = this.pageSizeObj[value].value;
    this.pageChanged(1);
    // this.pageSize.emit(page_size);
  }


  pageChanged(page) {
    this.pageSizes = this.itemsPerPage * (page - 1);
    this.totalItem = this.pageSizes + this.itemsPerPage;
    if (!Number.isNaN(this.pageSizes)) {
      this.getData({'offset': this.pageSizes, 'limit': this.itemsPerPage});
    }

  }


  getRecordDiffType() {
    this.rest.getRecordDiffType().subscribe((res: any) => {
      if (res.success) {
        this.recordTypeStatus = res.details;
        this.selectedRecordTypeId = this.fromRecordDiffType1;
        if (this.updateFlag === 1) {
          for (let i = 0; i < this.recordTypeStatus.length; i++) {
            if (this.recordTypeStatus[i].id === this.fromRecordDiffType1) {
              this.seq = this.recordTypeStatus[i].seqno;
            }
          }
          const data = {
            clientid: this.clientId,
            mstorgnhirarchyid: Number(this.organizationId),
            seqno: Number(this.seq)
          };
          this.getrecord(data);
        } else {
          this.getCategoryLevel(1, 'from');
        }
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }


  getrecordbydifftype(index, flag) {
    this.recorddifftypename = this.recordTypeStatus[index - 1].typename;
    if (index !== 0) {
      const seqNumber = 1;
      // console.log('seqNumber==========' + seqNumber);

      //this.getCategoryLevel(seqNumber, flag);
    }
  }


  getCategoryLevel(seqNumber, flag) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      seqno: Number(seqNumber),
    };
    this.rest.getcategorylevel(data).subscribe((res: any) => {
      if (res.success) {
        if (res.details.length > 0) {
          this.fromPropLevels = res.details;
          this.fromlevelid = '';
        } else {
          this.fromPropLevels = [];
          this.getPropertyValue(Number(seqNumber), flag);
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }


  onLevelChange(index, flag) {
    let seq;
    seq = this.fromPropLevels[index - 1].seqno;
    this.getPropertyValue(seq, flag);
  }

  getPropertyValue(seqNumber, flag) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      seqno: seqNumber
    };
    this.rest.getrecordbydifftype(data).subscribe((res: any) => {
      if (res.success) {
        if (flag === 'from') {
          this.formTicketTypeList = res.details;
        } else {
          this.toTicketTypeList = res.details;
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      //console.log(err);
    });
  }


  resetValues() {
    this.organizationId = '';
    this.fromRecordDiffTypeId = '';
    this.fromRecordDiffId = '';
    this.fromRecordDiffType = 2;
    this.process = '';
    this.colVal = '';
    this.selectDatabase = 0;
    this.selectTable = 0;
    this.recordTypeStatus = [];
    this.formTicketTypeList = [];
    this.databases = [];
    this.tables = [];
    this.colVals = [];
    this.workingList = [];
    this.workingdiffid = [];
    this.workingtypeid = 0;
    this.workingdiff1 = 0;
    this.isTitle = true;
    this.channeldiffid = '';
    this.eventtypeid = 0;
    this.textField = false;
    this.groups = [];
    this.Users = [];
    this.grpSelectedTO = [];
    this.selectedUserTO = '';
    this.grpSelectedCC = [];
    this.selectedUserCC = '';
    this.reserveArr1 = [];
    this.reserveArr2 = [];
    this.isselectedUserTO = false;
    this.isselectedUserCC = false;
    this.margeArr = [];
    this.margeArr2 = [];
    this.enteredAdditionalRecipient = '';
    this.fromlevelid = '';
    this.fromPropLevels = [];
    this.isUpdate = false;
    this.checkRequestor = false;
    this.checkOpenedBy = false;
    this.statusid = 0;
    this.noofcount = '';
    this.priorityid = 0;
    this.processid = 0;
    this.processcomplete = '';
    this.noofdays = '';
    this.isEventTypeStatus = false;
    this.isEventTypeNumberCount = false;
    this.isEventTypePriority = false;
    this.isEventTypeSLA = false;
    this.isEventTypeAging = false;
    this.isEventTypeNoofDays = false;
    this.processcompleteCustom = '';
    this.channeldiffid = 0;
    this.checkAssignee = false;
    this.checkAssigneeGroup = false;
    this.checkAssigneeGroupMember = false;
    this.priorityArr = [];
    this.statusArr = [];
    this.variablesList = [];
    this.tableArrayTO = [];
    this.tableArrayCC = [];
    this.indiaDltContentTemplateId = '';
    this.selectedSmsType = 0;
    this.istextarea = false;
    this.isemailarea = false;
    this.groupsId = [];
    this.worksId = [];
    this.resolutionType = 2;
  }

  save() {

    if (this.checkRequestor === false) {
      this.sendtocreator = 2;
    } else {
      this.sendtocreator = 1;
    }
    if (this.checkOpenedBy === false) {
      this.sendtoorgcreator = 2;
    } else {
      this.sendtoorgcreator = 1;
    }
    if (this.checkAssignee === false) {
      this.sendtoassignee = 2;
    } else {
      this.sendtoassignee = 1;
    }
    if (this.checkAssigneeGroup === false) {
      this.sendtoassigneegroup = 2;
    } else {
      this.sendtoassigneegroup = 1;
    }
    if (this.checkAssigneeGroupMember === false) {
      this.sendtoassigneegroupmember = 2;
    } else {
      this.sendtoassigneegroupmember = 1;
    }


    this.margeArr = [];
    this.margeArr2 = [];
    if (this.reserveArr1.length > 0) {
      for (let i = 0; i < this.reserveArr1.length; i++) {
        this.margeArr.push({'recipienttype': 'TO', 'groupid': this.reserveArr1[i].groupid, 'userid': this.reserveArr1[i].id});
        this.margeArr2.push({
          'recipienttype': 'TO',
          'groupid': this.reserveArr1[i].groupid,
          'groupname': this.reserveArr1[i].groupname,
          'userid': this.reserveArr1[i].id,
          'username': this.reserveArr1[i].name
        });
      }
    } else {
      for (let i = 0; i < this.grpSelectedTO.length; i++) {
        this.margeArr.push({'recipienttype': 'TO', 'groupid': this.grpSelectedTO[i], 'userid': 0});
        this.margeArr2.push({
          'recipienttype': 'TO',
          'groupid': this.groups[this.grpSelectedTO[i]].id,
          'groupname': this.groups[this.grpSelectedTO[i]].supportgroupname,
          'userid': 0,
          'username': ''
        });
      }
    }
    if (this.reserveArr2.length > 0) {
      for (let i = 0; i < this.reserveArr2.length; i++) {
        this.margeArr.push({'recipienttype': 'CC', 'groupid': this.reserveArr2[i].groupid, 'userid': this.reserveArr2[i].id});
        this.margeArr2.push({
          'recipienttype': 'CC',
          'groupid': this.reserveArr2[i].groupid,
          'groupname': this.reserveArr2[i].groupname,
          'userid': this.reserveArr2[i].id,
          'username': this.reserveArr2[i].name
        });
      }
    } else {
      this.grpSelectedCC = [...new Set(this.grpSelectedCC)];
      for (let i = 0; i < this.grpSelectedCC.length; i++) {
        this.margeArr.push({'recipienttype': 'CC', 'groupid': this.grpSelectedCC[i], 'userid': 0});
        this.margeArr2.push({
          'recipienttype': 'CC',
          'groupid': this.grpSelectedCC[i].id,
          'groupname': this.grpSelectedCC[i].supportgroupname,
          'userid': 0,
          'username': ''
        });
      }
    }

    if (this.isEventTypeSLA === true) {
      if ((Number(this.processcomplete) >= 0) && (Number(this.processcomplete) <= 100)) {
        this.processcompleteCustom = this.processcomplete;

        const data = {
          'clientid': Number(this.clientId),
          'mstorgnhirarchyid': Number(this.organizationId),
          'recordtypeid': Number(this.fromRecordDiffId),
          'workingcategories': this.workingdiffid,
          'channeltypeid': Number(this.channeldiffid),
          'body': this.contentValue,
          'eventtypeid': Number(this.eventtypeid),
          'sendtocreator': Number(this.sendtocreator),
          'sendtoorgcreator': Number(this.sendtoorgcreator),
          'sendtoassignee': Number(this.sendtoassignee),
          'sendtoassigneegroup': Number(this.sendtoassigneegroup),
          'sendtoassigneegroupmember': Number(this.sendtoassigneegroupmember),
          'isconverted': this.resolutionType,
          'eventparams': {
            'statusid': Number(this.statusid),
            'priorityid': Number(this.priorityid),
            'noofcount': Number(this.noofcount),
            'processid': Number(this.processid),
            'processcomplete': Number(this.processcompleteCustom),
            'noofdays': Number(this.noofdays)
          }
        };

        if (Number(this.channeldiffid) === 1) {
          data['subjectortitle'] = this.inputSubject;
          data['recipients'] = this.margeArr;

        } else if (Number(this.channeldiffid) === 2) {
          data['recipients'] = [];
          data['smstemplateid'] = this.indiaDltContentTemplateId;
          data['smstypeid'] = Number(this.selectedSmsType);
        }

        if (!this.messageService.isBlankField(data)) {
          data['additionalrecipient'] = String(this.enteredAdditionalRecipient);
          if (Number(this.channeldiffid) === 2) {
            data['subjectortitle'] = '';
          }
          console.log(JSON.stringify(data));
          this.rest.insertnotificationtemplate(data).subscribe((res) => {
            this.respObject = res;
            if (this.respObject.success) {
              const id = this.respObject.details;
              this.isError = false;
              this.getTableData();
              // this.angularGrid.gridService.addItem({
              //   id: id,
              //   clientid: this.clientId,
              //   mstorgnhirarchyid: this.organizationId,
              //   mstorgnhirarchyname: this.organizationName,
              //   recordtypetypeid: this.fromRecordDiffType,
              //   recordtypetype: this.recorddifftypename,
              //   recordtypeid: this.fromRecordDiffId,
              //   recordtype: this.recorddiffname,
              //   workingcategories: this.workingdiffid,
              //   workingcategory: this.workingdiffname,
              //   channeltypeid: this.channeldiffid,
              //   channeltype: this.channeldiffname,
              //   subjectortitle: this.inputSubject,
              //   body: this.contentValue,
              //   additionalrecipient: this.enteredAdditionalRecipient,
              //   eventtypeid: this.eventtypeid,
              //   eventtype: this.eventtypename,
              //   recipients: this.margeArr2,
              //   sendtocreator: this.sendtocreator,
              //   sendtoorgcreator: this.sendtoorgcreator,
              //   sendtoassignee : this.sendtoassignee,
              //   sendtoassigneegroup: this.sendtoassigneegroup,
              //   sendtoassigneegroupmember: this.sendtoassigneegroupmember,
              // });
              // this.totalData = this.totalData + 1;
              // this.messageService.setTotalData(this.totalData);
              this.resetValues();
              this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
            } else {
              this.notifier.notify('error', this.respObject.message);
            }
          }, (err) => {
            // this.isError = true;
            // this.notifier.notify('error', this.messageService.SERVER_ERROR);
          });
        } else {
          this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
        }

      } else {
        this.notifier.notify('error', this.messageService.WRONG_PERCENTAGE);
      }
    } else {

      const data = {
        'clientid': Number(this.clientId),
        'mstorgnhirarchyid': Number(this.organizationId),
        'recordtypeid': Number(this.fromRecordDiffId),
        'workingcategories': this.workingdiffid,
        'channeltypeid': Number(this.channeldiffid),
        'body': this.contentValue,
        'eventtypeid': Number(this.eventtypeid),
        'sendtocreator': Number(this.sendtocreator),
        'sendtoorgcreator': Number(this.sendtoorgcreator),
        'sendtoassignee': Number(this.sendtoassignee),
        'sendtoassigneegroup': Number(this.sendtoassigneegroup),
        'sendtoassigneegroupmember': Number(this.sendtoassigneegroupmember),
        'isconverted': this.resolutionType,
        'eventparams': {
          'statusid': Number(this.statusid),
          'priorityid': Number(this.priorityid),
          'noofcount': Number(this.noofcount),
          'processid': Number(this.processid),
          'processcomplete': Number(this.processcomplete),
          'noofdays': Number(this.noofdays)
        }
      };

      if (Number(this.channeldiffid) === 1) {
        data['subjectortitle'] = this.inputSubject;
        data['recipients'] = this.margeArr;

      } else if (Number(this.channeldiffid) === 2) {
        data['recipients'] = [];
        data['smstemplateid'] = this.indiaDltContentTemplateId;
        data['smstypeid'] = Number(this.selectedSmsType);
      }


      if (!this.messageService.isBlankField(data)) {
        data['additionalrecipient'] = String(this.enteredAdditionalRecipient);
        if (Number(this.channeldiffid) === 2) {
          data['subjectortitle'] = '';
        }
        console.log(JSON.stringify(data));
        this.rest.insertnotificationtemplate(data).subscribe((res) => {
          this.respObject = res;
          if (this.respObject.success) {
            const id = this.respObject.details;
            this.isError = false;
            this.getTableData();

            // this.angularGrid.gridService.addItem({
            //   id: id,
            //   clientid: this.clientId,
            //   mstorgnhirarchyid: this.organizationId,
            //   mstorgnhirarchyname: this.organizationName,
            //   recordtypetypeid: this.fromRecordDiffType,
            //   recordtypetype: this.recorddifftypename,
            //   recordtypeid: this.fromRecordDiffId,
            //   recordtype: this.recorddiffname,
            //   workingcategories: this.workingdiffid,
            //   workingcategory: this.workingdiffname,
            //   channeltypeid: this.channeldiffid,
            //   channeltype: this.channeldiffname,
            //   subjectortitle: this.inputSubject,
            //   body: this.contentValue,
            //   additionalrecipient: this.enteredAdditionalRecipient,
            //   eventtypeid: this.eventtypeid,
            //   eventtype: this.eventtypename,
            //   recipients: this.margeArr2,
            //   sendtocreator: this.sendtocreator,
            //   sendtoorgcreator: this.sendtoorgcreator,
            //   sendtoassignee : this.sendtoassignee,
            //   sendtoassigneegroup: this.sendtoassigneegroup,
            //   sendtoassigneegroupmember: this.sendtoassigneegroupmember,
            // });
            // this.totalData = this.totalData + 1;
            // this.messageService.setTotalData(this.totalData);
            this.resetValues();
            this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
          } else {
            this.notifier.notify('error', this.respObject.message);
          }
        }, (err) => {
          // this.isError = true;
          // this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });

      } else {
        this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
      }
    }


  }


  update() {

    if (this.checkRequestor === false) {
      this.sendtocreator = 2;
    } else {
      this.sendtocreator = 1;
    }
    if (this.checkOpenedBy === false) {
      this.sendtoorgcreator = 2;
    } else {
      this.sendtoorgcreator = 1;
    }
    if (this.checkAssignee === false) {
      this.sendtoassignee = 2;
    } else {
      this.sendtoassignee = 1;
    }
    if (this.checkAssigneeGroup === false) {
      this.sendtoassigneegroup = 2;
    } else {
      this.sendtoassigneegroup = 1;
    }
    if (this.checkAssigneeGroupMember === false) {
      this.sendtoassigneegroupmember = 2;
    } else {
      this.sendtoassigneegroupmember = 1;
    }


    this.margeArr = [];
    this.margeArr2 = [];
    if (this.reserveArr1.length > 0) {
      for (let i = 0; i < this.reserveArr1.length; i++) {
        this.margeArr.push({'recipienttype': 'TO', 'groupid': this.reserveArr1[i].groupid, 'userid': this.reserveArr1[i].id});
        this.margeArr2.push({
          'recipienttype': 'TO',
          'groupid': this.reserveArr1[i].groupid,
          'groupname': this.reserveArr1[i].groupname,
          'userid': this.reserveArr1[i].id,
          'username': this.reserveArr1[i].name
        });
      }
    } else {
      for (let i = 0; i < this.grpSelectedTO.length; i++) {
        this.margeArr.push({'recipienttype': 'TO', 'groupid': this.grpSelectedTO[i], 'userid': 0});
        this.margeArr2.push({
          'recipienttype': 'TO',
          'groupid': this.groups[this.grpSelectedTO[i]].id,
          'groupname': this.groups[this.grpSelectedTO[i]].supportgroupname,
          'userid': 0,
          'username': ''
        });
      }
    }
    if (this.reserveArr2.length > 0) {
      for (let i = 0; i < this.reserveArr2.length; i++) {
        this.margeArr.push({'recipienttype': 'CC', 'groupid': this.reserveArr2[i].groupid, 'userid': this.reserveArr2[i].id});
        this.margeArr2.push({
          'recipienttype': 'CC',
          'groupid': this.reserveArr2[i].groupid,
          'groupname': this.reserveArr2[i].groupname,
          'userid': this.reserveArr2[i].id,
          'username': this.reserveArr2[i].name
        });
      }
    } else {
      this.grpSelectedCC = [...new Set(this.grpSelectedCC)];
      for (let i = 0; i < this.grpSelectedCC.length; i++) {
        this.margeArr.push({'recipienttype': 'CC', 'groupid': this.grpSelectedCC[i], 'userid': 0});
        this.margeArr2.push({
          'recipienttype': 'CC',
          'groupid': this.grpSelectedCC[i].id,
          'groupname': this.grpSelectedCC[i].supportgroupname,
          'userid': 0,
          'username': ''
        });
      }
    }


    if (this.isEventTypeSLA === true) {
      if ((Number(this.processcomplete) >= 0) && (Number(this.processcomplete) <= 100)) {
        this.processcompleteCustom = this.processcomplete;

        const data = {
          'id': Number(this.selectedId),
          'clientid': Number(this.clientId),
          'mstorgnhirarchyid': Number(this.organizationId),
          'recordtypeid': Number(this.fromRecordDiffId),
          'workingcategories': this.workingdiffid,
          'channeltypeid': Number(this.channeldiffid),
          'body': this.contentValue,
          'eventtypeid': Number(this.eventtypeid),
          'sendtocreator': Number(this.sendtocreator),
          'sendtoorgcreator': Number(this.sendtoorgcreator),
          'sendtoassignee': Number(this.sendtoassignee),
          'sendtoassigneegroup': Number(this.sendtoassigneegroup),
          'sendtoassigneegroupmember': Number(this.sendtoassigneegroupmember),
          'isconverted': this.resolutionType,
          'eventparams': {
            'statusid': Number(this.statusid),
            'priorityid': Number(this.priorityid),
            'noofcount': Number(this.noofcount),
            'processid': Number(this.processid),
            'processcomplete': Number(this.processcompleteCustom),
            'noofdays': Number(this.noofdays)
          }
        };

        if (Number(this.channeldiffid) === 1) {
          data['subjectortitle'] = this.inputSubject;
          data['recipients'] = this.margeArr;

        } else if (Number(this.channeldiffid) === 2) {
          data['recipients'] = [];
          data['smstemplateid'] = this.indiaDltContentTemplateId;
          data['smstypeid'] = Number(this.selectedSmsType);
        }


        if (!this.messageService.isBlankField(data)) {
          data['additionalrecipient'] = String(this.enteredAdditionalRecipient);
          if (Number(this.channeldiffid) === 2) {
            data['subjectortitle'] = '';
          }
          this.rest.updatenotificationtemplate(data).subscribe((res) => {
            this.respObject = res;
            if (this.respObject.success) {
              this.isError = false;
              this.angularGrid.gridService.deleteItemById(this.selectedId);
              this.dataLoaded = true;
              this.getTableData();

              // this.angularGrid.gridService.addItem({
              //   id: this.selectedId,
              //   clientid: this.clientId,
              //   mstorgnhirarchyid: this.organizationId,
              //   mstorgnhirarchyname: this.organizationName,
              //   recordtypetypeid: this.fromRecordDiffType,
              //   recordtypetype: this.recorddifftypename,
              //   recordtypeid: this.fromRecordDiffId,
              //   recordtype: this.recorddiffname,
              //   workingcategories: this.workingdiffid,
              //   workingcategory: this.workingdiffname,
              //   channeltypeid: this.channeldiffid,
              //   channeltype: this.channeldiffname,
              //   subjectortitle: this.inputSubject,
              //   body: this.contentValue,
              //   additionalrecipient: this.enteredAdditionalRecipient,
              //   eventtypeid: this.eventtypeid,
              //   eventtype: this.eventtypename,
              //   recipients: this.margeArr2,
              //   sendtocreator: this.sendtocreator,
              //   sendtoorgcreator: this.sendtoorgcreator,
              //   sendtoassignee : this.sendtoassignee,
              //   sendtoassigneegroup: this.sendtoassigneegroup,
              //   sendtoassigneegroupmember: this.sendtoassigneegroupmember,
              // });
              // this.totalData = this.totalData + 1;
              this.modalReference.close();
              this.notifier.notify('success', this.messageService.EDIT_SUCCESS);
            } else {
              this.isError = true;
              this.notifier.notify('error', this.respObject.message);
            }
          }, (err) => {
            this.isError = true;
            this.notifier.notify('error', this.messageService.SERVER_ERROR);
          });
        } else {
          this.isError = true;
          this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
        }

      } else {
        this.notifier.notify('error', this.messageService.WRONG_PERCENTAGE);
      }

    } else {

      const data = {
        'id': Number(this.selectedId),
        'clientid': Number(this.clientId),
        'mstorgnhirarchyid': Number(this.organizationId),
        'recordtypeid': Number(this.fromRecordDiffId),
        'workingcategories': this.workingdiffid,
        'channeltypeid': Number(this.channeldiffid),
        'body': this.contentValue,
        'eventtypeid': Number(this.eventtypeid),
        'sendtocreator': Number(this.sendtocreator),
        'sendtoorgcreator': Number(this.sendtoorgcreator),
        'sendtoassignee': Number(this.sendtoassignee),
        'sendtoassigneegroup': Number(this.sendtoassigneegroup),
        'sendtoassigneegroupmember': Number(this.sendtoassigneegroupmember),
        'isconverted': this.resolutionType,
        'eventparams': {
          'statusid': Number(this.statusid),
          'priorityid': Number(this.priorityid),
          'noofcount': Number(this.noofcount),
          'processid': Number(this.processid),
          'processcomplete': Number(this.processcomplete),
          'noofdays': Number(this.noofdays)
        }
      };

      if (Number(this.channeldiffid) === 1) {
        data['subjectortitle'] = this.inputSubject;
        data['recipients'] = this.margeArr;

      } else if (Number(this.channeldiffid) === 2) {
        data['recipients'] = [];
        data['smstemplateid'] = this.indiaDltContentTemplateId;
        data['smstypeid'] = Number(this.selectedSmsType);
      }


      if (!this.messageService.isBlankField(data)) {
        data['additionalrecipient'] = String(this.enteredAdditionalRecipient);
        if (Number(this.channeldiffid) === 2) {
          data['subjectortitle'] = '';
        }
        this.rest.updatenotificationtemplate(data).subscribe((res) => {
          this.respObject = res;
          if (this.respObject.success) {
            this.isError = false;
            this.angularGrid.gridService.deleteItemById(this.selectedId);
            this.dataLoaded = true;
            this.getTableData();

            // this.angularGrid.gridService.addItem({
            //   id: this.selectedId,
            //   clientid: this.clientId,
            //   mstorgnhirarchyid: this.organizationId,
            //   mstorgnhirarchyname: this.organizationName,
            //   recordtypetypeid: this.fromRecordDiffType,
            //   recordtypetype: this.recorddifftypename,
            //   recordtypeid: this.fromRecordDiffId,
            //   recordtype: this.recorddiffname,
            //   workingcategories: this.workingdiffid,
            //   workingcategory: this.workingdiffname,
            //   channeltypeid: this.channeldiffid,
            //   channeltype: this.channeldiffname,
            //   subjectortitle: this.inputSubject,
            //   body: this.contentValue,
            //   additionalrecipient: this.enteredAdditionalRecipient,
            //   eventtypeid: this.eventtypeid,
            //   eventtype: this.eventtypename,
            //   recipients: this.margeArr2,
            //   sendtocreator: this.sendtocreator,
            //   sendtoorgcreator: this.sendtoorgcreator,
            //   sendtoassignee : this.sendtoassignee,
            //   sendtoassigneegroup: this.sendtoassigneegroup,
            //   sendtoassigneegroupmember: this.sendtoassigneegroupmember,
            // });
            // this.totalData = this.totalData + 1;

            this.modalReference.close();
            this.notifier.notify('success', this.messageService.EDIT_SUCCESS);
          } else {
            this.isError = true;
            this.notifier.notify('error', this.respObject.message);
          }
        }, (err) => {
          this.isError = true;
          this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
      } else {
        this.isError = true;
        this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
      }
    }

  }


  // OnChangeRecordByDiffType(index) {
  //   this.recorddifftypename = this.recordTypeStatus[index - 1].typename;
  //   if (index !== 0) {
  //     const seqNumber = this.recordTypeStatus[index - 1].seqno;
  //     const data = {
  //       clientid: this.clientId,
  //       mstorgnhirarchyid: Number(this.organizationId),
  //       seqno: Number(seqNumber)
  //     };
  //     this.getrecord(data);
  //   }
  // }


  getrecord(data) {
    console.log('>>>>>');
    this.rest.getrecordbydifftype(data).subscribe((res: any) => {
      if (res.success) {
        this.formTicketTypeList = res.details;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      // console.log(err);
    });
  }


  onPropertyChange(index, type) {
    if (type !== 'u') {
      this.recorddiffname = this.formTicketTypeList[index - 1].typename;
    }
    const data = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': Number(this.organizationId),
      'forrecorddiffid': Number(this.fromRecordDiffId)
    };
    if (type === 'm') {
      data['forrecorddifftypeid'] = Number(this.fromRecordDiffType);
    } else {
      data['forrecorddifftypeid'] = Number(this.fromRecordDiffType1);
    }
    this.rest.getworkinglabelname(data).subscribe((res: any) => {
      if (res.success) {
        this.workingList = res.details.values;
        this.selectAll(this.workingList);
        if (type === 'm') {
          this.workingdiffid = [];
        } else {
          this.workingdiffid = [this.workingdiff1];
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onDatabaseChange(index: any) {
    this.getTable();
  }

  onTableChange(index: any) {
    this.getColumn();
  }

  getColumn() {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      type: 2,
      fieldid: Number(this.selectTable)
    };
    this.rest.getutilitydatabyfield(data).subscribe((res: any) => {
      if (res.success) {
        res.details.unshift({id: 0, name: 'Select Column'});
        this.colVals = res.details;
        this.colVal = 0;
        this.columnSelected = this.selctColumn;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getorganizationclientwise() {
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.loginUserOrganizationId)
    };
    this.rest.getorganizationclientwisenew(data).subscribe((res: any) => {
      if (res.success) {
        this.organizationList = res.details;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onWorkingChange(selectedIndex) {

    // for(let j=0;j<this.workingList.length;j++){
    //   for(let i=0;i<this.workingdiffid.length;i++){
    //     if(Number(this.workingList[j].id) === Number(this.workingdiffid[i])){
    //       // console.log(this.workingList[j]);
    //       this.workingdiffname.push(this.workingList[j].name);
    //       this.workingcategoryid.push(this.workingList[j].workingcategorytypeid);
    //       this.workingcategorytype.push(this.workingList[j].workingcategorytype);
    //     }
    //   }
    // }

    // "id": 498,
    // "name": "AV Patch Management",
    // "recorddifftypid": 34,
    // "forrecorddifftypeid": 2,
    // "forrecorddiffid": 4,
    // "recorddifftypname": "Service Category"
    this.workingdiffname = selectedIndex.name;
    //this.worksId.push(selectedIndex.id);
  }

  onChannelChange(Index: any) {
    this.channeldiffname = this.channelList[Index].name;
    this.inputSubject = '';
    this.contentValue = '';
    this.indiaDltContentTemplateId = '';
    this.selectedSmsType = 0;
    this.enteredAdditionalRecipient = '';
    if (Index === 0) {
      this.textField = false;
      this.isTitle = true;
      this.istextarea = false;
      this.isemailarea = false;
      this.reserveArr2 = [];
      this.grpSelectedCC = [];
      this.groupsId = [];
    } else {
      this.textField = true;
      if (Index === 1) {
        this.isTitle = false;
        this.istextarea = false;
        this.isemailarea = true;
      } else if (Index === 2) {
        this.isTitle = true;
        this.istextarea = true;
        this.isemailarea = false;
        this.reserveArr2 = [];
        this.grpSelectedCC = [];
        this.groupsId = [];
      }
    }
  }

  getnotificationevents(type) {
    const Data = {};
    this.rest.getnotificationevents(Data).subscribe((res: any) => {
      if (res.success) {
        res.details.unshift({id: 0, eventname: 'Select Event Type'});
        this.EventTypes = res.details;
        if (type === 'i') {
          this.eventtypeid = 0;
        } else {
          this.eventtypeid = this.eventtypeid1;
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onEventChange(index: any) {
    this.eventtypename = this.EventTypes[index].eventname;
    if (this.eventtypeid !== 1) {
      this.resolutionType = 2;
    } else {
      this.resolutionType = 1;
    }
    if (Number(this.eventtypeid) === 0) {
      this.isEventTypeStatus = false;
      this.isEventTypeNumberCount = false;
      this.isEventTypePriority = false;
      this.isEventTypeSLA = false;
      this.isEventTypeAging = false;
      this.isEventTypeNoofDays = false;

      this.statusid = 0;
      this.noofcount = 0;
      this.priorityid = 0;
      this.processid = 0;
      this.processcomplete = 0;
      this.noofdays = 0;

    } else if (Number(this.eventtypeid) === 1) {
      this.isEventTypeStatus = true;
      this.isEventTypeNumberCount = false;
      this.isEventTypePriority = false;
      this.isEventTypeSLA = false;
      this.isEventTypeAging = false;
      this.isEventTypeNoofDays = false;

      this.statusid = 0;
      this.noofcount = 0;
      this.priorityid = 0;
      this.processid = 0;
      this.processcomplete = 0;
      this.noofdays = 0;

      this.getEventTypePropertyValue(this.STATUS_SEQ).then((details: any[]) => {
        details.unshift({id: 0, typename: 'Select Status'});
        this.statusArr = details;
      });

    } else if (Number(this.eventtypeid) === 5 || Number(this.eventtypeid) === 6) {
      this.isEventTypeStatus = false;
      this.isEventTypeNumberCount = true;
      this.isEventTypePriority = false;
      this.isEventTypeSLA = false;
      this.isEventTypeAging = false;
      this.isEventTypeNoofDays = false;

      this.statusid = 0;
      this.noofcount = '';
      this.priorityid = 0;
      this.processid = 0;
      this.processcomplete = 0;
      this.noofdays = 0;

    } else if (Number(this.eventtypeid) === 7) {
      this.isEventTypeStatus = false;
      this.isEventTypeNumberCount = false;
      this.isEventTypePriority = true;
      this.isEventTypeSLA = false;
      this.isEventTypeAging = false;
      this.isEventTypeNoofDays = false;

      this.statusid = 0;
      this.noofcount = 0;
      this.priorityid = 0;
      this.processid = 0;
      this.processcomplete = 0;
      this.noofdays = 0;

      this.getEventTypePropertyValue(this.PRIORITY_SEQ).then((details: any[]) => {
        details.unshift({id: 0, typename: 'Select Priority'});
        this.priorityArr = details;
      });

    } else if (Number(this.eventtypeid) === 8 || Number(this.eventtypeid) === 9) {
      this.isEventTypeStatus = false;
      this.isEventTypeNumberCount = false;
      this.isEventTypePriority = false;
      this.isEventTypeSLA = true;
      this.isEventTypeAging = false;
      this.isEventTypeNoofDays = false;

      this.statusid = 0;
      this.noofcount = 0;
      this.priorityid = 0;
      this.processid = 0;
      this.processcomplete = '';
      this.noofdays = 0;

      this.getEventTypePropertyValue(this.PRIORITY_SEQ).then((details: any[]) => {
        details.unshift({id: 0, typename: 'Select Priority'});
        this.priorityArr = details;
      });

    } else if (Number(this.eventtypeid) === 12) {
      this.isEventTypeStatus = false;
      this.isEventTypeNumberCount = false;
      this.isEventTypePriority = false;
      this.isEventTypeSLA = false;
      this.isEventTypeAging = true;
      this.isEventTypeNoofDays = false;

      this.statusid = 0;
      this.noofcount = 0;
      this.priorityid = 0;
      this.processid = 0;
      this.processcomplete = 0;
      this.noofdays = '';

      this.getEventTypePropertyValue(this.PRIORITY_SEQ).then((details: any[]) => {
        details.unshift({id: 0, typename: 'Select Priority'});
        this.priorityArr = details;
      });

    } else if (Number(this.eventtypeid) === 13) {
      this.isEventTypeStatus = false;
      this.isEventTypeNumberCount = false;
      this.isEventTypePriority = false;
      this.isEventTypeSLA = false;
      this.isEventTypeAging = false;
      this.isEventTypeNoofDays = true;

      this.statusid = 0;
      this.noofcount = 0;
      this.priorityid = 0;
      this.processid = 0;
      this.processcomplete = 0;
      this.noofdays = '';

    } else {
      this.isEventTypeStatus = false;
      this.isEventTypeNumberCount = false;
      this.isEventTypePriority = false;
      this.isEventTypeSLA = false;
      this.isEventTypeAging = false;
      this.isEventTypeNoofDays = false;

      this.statusid = 0;
      this.noofcount = 0;
      this.priorityid = 0;
      this.processid = 0;
      this.processcomplete = 0;
      this.noofdays = 0;

    }
  }


  getEventTypePropertyValue(seq) {
    let promise = new Promise((resolve, reject) => {
      const data = {
        clientid: this.clientId,
        mstorgnhirarchyid: Number(this.organizationId),
        seqno: seq
      };
      this.rest.getrecordbydifftype(data).subscribe((res: any) => {
        if (res.success) {
          resolve(res.details);
        } else {
          this.notifier.notify('error', res.message);
          reject();
        }
      });
    });
    return promise;
  }


  onStatusChange(index: any) {
    //console.log(index);
  }

  onPriorityChange(index: any) {
    //console.log(index);
  }

  onProcessChange(index: any) {
    //console.log(index);
  }

  onlyIntegerAllowed(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onlyPercentage(event): boolean {
    return true;
  }


  getUserDetails1() {
    let match = false;

    for (let i = 0; i < this.Users.length; i++) {
      if (this.Users[i].name === this.selectedUserTO) {
        // console.log(this.Users[i].id, this.selectedUserTO);
        if (this.reserveArr1.length != 0) {
          for (let j = 0; j < this.reserveArr1.length; j++) {
            if ((this.Users[i].groupid === this.reserveArr1[j].groupid) && (this.Users[i].id === this.reserveArr1[j].id)) {
              this.notifier.notify('success', this.messageService.DATA_ALREADY_EXIST);
              match = true;
              break;
            }
          }
          if (!match) {
            this.reserveArr1.push(this.Users[i]);
            this.isselectedUserTO = true;
            // console.log(this.reserveArr1);
          }
        } else {
          this.reserveArr1.push(this.Users[i]);
          this.isselectedUserTO = true;
          // console.log(this.reserveArr1);
        }
      }
    }
    this.selectedUserTO = '';
  }

  getUserDetails2() {
    let match = false;

    for (let i = 0; i < this.Users.length; i++) {
      if (this.Users[i].name === this.selectedUserCC) {
        if (this.reserveArr2.length != 0) {
          for (let j = 0; j < this.reserveArr2.length; j++) {
            if ((this.Users[i].groupid === this.reserveArr2[j].groupid) && (this.Users[i].id === this.reserveArr2[j].id)) {
              this.notifier.notify('success', this.messageService.DATA_ALREADY_EXIST);
              match = true;
              break;
            }
          }
          if (!match) {
            this.reserveArr2.push(this.Users[i]);
            this.isselectedUserCC = true;
            // console.log("\n USER ARRAY ::  ",JSON.stringify(this.Users[i]),
            // "\n RESERVE ARRAY :: ", JSON.stringify(this.reserveArr2));
          }
        } else {
          this.reserveArr2.push(this.Users[i]);
          this.isselectedUserCC = true;
          // console.log("\n FOR '0' USER ARRAY ::  ",JSON.stringify(this.Users[i]),
          // "\n RESERVE ARRAY :: ", JSON.stringify(this.reserveArr2));
        }
      }
    }
    this.selectedUserCC = '';
  }

  closeModal() {
    this.modalReference.close();
    this.resetValues();
  }

  closeModal2() {
    this.modalReference.close();
  }

  removeUser1(Index: any) {
    this.reserveArr1.splice(Index, 1);
  }

  removeUser2(Index: any) {
    this.reserveArr2.splice(Index, 1);
  }

  openVariablesHelpPopUp() {
    this.modalReference = this.modalService.open(this.varHelp, {size: 'md'});
  }

  getallnotificationvariables() {
    const Data = {
      'clientid': Number(this.clientId),
      'mstorgnhirarchyid': Number(this.organizationId)
    };
    this.rest.getallnotificationvariables(Data).subscribe((res: any) => {
      if (res.success) {
        this.variablesList = res.details;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  selectAll(items: any[]) {
    let allSelect = items => {
      items.forEach(element => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }

  onSMSTypeChange(selectedIndex) {

  }

}

