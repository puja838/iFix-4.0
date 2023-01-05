import {Component, EventEmitter, OnInit, Input, OnDestroy, Output, ViewChild, ChangeDetectorRef} from '@angular/core';
import {Subscription} from 'rxjs';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {RestApiService} from '../rest-api.service';
import {MessageService} from '../message.service';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {Formatters, OnEventArgs} from 'angular-slickgrid';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {AngularGridInstance, Column, GridOption, Grouping, SortDirectionNumber, Sorters, GridStateChange} from 'angular-slickgrid';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-pending-approval',
  templateUrl: './pending-approval.component.html',
  styleUrls: ['./pending-approval.component.css']
})
export class PendingApprovalComponent implements OnInit {

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

  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset = [];
  angularGrid: AngularGridInstance;
  gridObj: any;
  // selectedTitles = [];
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
  tableArrayTO = [];
  tableArrayCC = [];


  name: string;
  userGroupId: number;
  folderLoaded = false;
  userGroups = [];
  userGroupSelected = 0;
  groupName: string;
  public grpLevel: number;
  isLowestLevel: boolean;
  orgTypeId: number;
  hascatalog: string;
  orgId: number;
  ismanagement: boolean;
  private userAuth: Subscription;
  selectedOrgVals: any;
  savedWorkFlowSGroup: string;
  ticketsTyp = [];
  TICKET_TYPE_ID: number;
  TICKET_TYPE_SEQ = 1;
  recordType = [];
  ticketSeq: number;
  typSelected: number;
  typeSeq: number;
  margeHeaderArr = [];
  categoriesLength: number;

  isGrid2WithPagination = true;
  selectedTitles!: any[];
  selectedTitle!: any;
  selectedGrid2IDs!: number[];
  selectedRecordIds = [];

  STATUS_SEQ = 2;
  private nexttransitionid: number;
  nextstatusseq: number;
  private nextWokflowstateid: number;
  private statustypeid: number;
  private statusid: number;
  private workingtypeid: number;
  private workingid: number;
  private currentstateid: number;
  stateterms = [];
  diffTypeId = 2;
  typeChecked: number;
  private multitermopentype: string = '';
  termattachment = [];
  hideAttachment: boolean;
  REJECTED_STATUS_SEQ = 14;
  APPROVED_STATUS_SEQ = 15;
  PENDING_APPROVAL_STATUS_SEQ = 12;


  constructor(private rest: RestApiService, private messageService: MessageService,
              private route: Router, private modalService: NgbModal, private notifier: NotifierService, private cd: ChangeDetectorRef) {

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
  }

  ngOnInit(): void {
    this.pageSizeObj = this.messageService.pagination;
    this.itemsPerPage = this.messageService.pageSize;

    this.totalPage = 0;
    this.nexttransitionid = 0;
    this.dataLoaded = true;
    this.displayData = {
      pageName: 'Pending Approval',
      openModalButton: 'Pending Approval',
      breadcrumb: '',
      folderName: '',
      tabName: 'Pending Approval'
    };


    this.columnDefinitions = [
      {
        id: 'levelonecatename',
        name: 'Customer',
        field: 'levelonecatename',
        minWidth: 200,
        sortable: true,
        filterable: true
      },
      {
        id: 'ticketid',
        name: 'Ticket Id',
        field: 'ticketid',
        minWidth: 200,
        sortable: true,
        filterable: true
      },
      {
        id: 'status',
        name: 'Status',
        field: 'status',
        minWidth: 200,
        sortable: true,
        filterable: true
      },
      {
        id: 'shortdescription',
        name: 'Short Description',
        field: 'shortdescription',
        minWidth: 200,
        sortable: true,
        filterable: true
      },
      {
        id: 'requestorname',
        name: 'Requested For',
        field: 'requestorname',
        minWidth: 200,
        sortable: true,
        filterable: true
      },
      {
        id: 'source',
        name: 'Source',
        field: 'source',
        sortable: true,
        minWidth: 200,
        filterable: true
      },
      {
        id: 'createddatetime',
        name: 'Created Since',
        field: 'createddatetime',
        minWidth: 200,
        sortable: true,
        filterable: true
      },
      {
        id: 'orgcreatorname',
        name: 'Created By',
        field: 'orgcreatorname',
        minWidth: 200,
        sortable: true,
        filterable: true
      },
      {
        id: 'vendorname',
        name: 'Vendor Name',
        field: 'vendorname',
        minWidth: 200,
        sortable: true,
        filterable: true
      },
      {
        id: 'vendorticketid',
        name: 'Vendor Ticket Id',
        field: 'vendorticketid',
        minWidth: 200,
        sortable: true,
        filterable: true
      },
      {
        id: 'priority',
        name: 'Priority',
        field: 'priority',
        minWidth: 200,
        sortable: true,
        filterable: true
      },
      {
        id: 'lastuser',
        name: 'Last Update By',
        field: 'lastuser',
        minWidth: 200,
        sortable: true,
        filterable: true
      }, {
        id: 'followuptimetaken',
        name: 'Duration in Pending Vendor State',
        field: 'followuptimetaken',
        minWidth: 200,
        sortable: true,
        filterable: true
      },
      {
        id: 'statusreason',
        name: 'Status Reason',
        field: 'statusreason',
        minWidth: 200,
        sortable: true,
        filterable: true
      },
      {
        id: 'visiblecomments',
        name: 'Visible Comment',
        field: 'visiblecomments',
        minWidth: 200,
        sortable: true,
        filterable: true
      },
      {
        id: 'assigneduser',
        name: 'Assignee',
        field: 'assigneduser',
        minWidth: 200,
        sortable: true,
        filterable: true
      },
      {
        id: 'assignedgroup',
        name: 'Group',
        field: 'assignedgroup',
        minWidth: 200,
        sortable: true,
        filterable: true
      },
      {
        id: 'Company',
        name: 'Company',
        field: 'Company',
        minWidth: 200,
        sortable: true,
        filterable: true
      },
      {
        id: 'Service',
        name: 'Service',
        field: 'Service',
        minWidth: 200,
        sortable: true,
        filterable: true
      },
      {
        id: 'Service Category',
        name: 'Service Category',
        field: 'Service Category',
        minWidth: 200,
        sortable: true,
        filterable: true
      },
      {
        id: 'Service Sub Category',
        name: 'Service Sub Category',
        field: 'Service Sub Category',
        minWidth: 200,
        sortable: true,
        filterable: true
      },
      {
        id: 'Service Description',
        name: 'Service Description',
        field: 'Service Description',
        minWidth: 200,
        sortable: true,
        filterable: true
      },
    ];

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


  onGridChanged(selectedIds) {
    // console.log('Grid State changed:: ', selectedIds);
    this.selectedRecordIds = [];
    if (selectedIds.length > 0 && this.dataset.length > 0) {
      for (let i = 0; i < selectedIds.length; i++) {
        for (let j = this.dataset.length - 1; j >= 0; j--) {
          if (Number(selectedIds[i]) === Number(this.dataset[j].id)) {
            this.selectedRecordIds.push(Number(this.dataset[j].recordid));
          }
        }
      }
    }
    // console.log("\n  this.selectedRecordIds   ===========>>>>>>>>>>>>>>>>     ", this.selectedRecordIds);
  }

  stateChangeButton(seqno) {
    if (this.selectedRecordIds.length > 0) {
      let promise = new Promise((resolve, reject) => {
        const data = {
          'clientid': Number(this.clientId),
          'mstorgnhirarchyid': Number(this.orgId),
          'typeseqno': this.STATUS_SEQ,
          'seqno': Number(seqno)
        };
        this.rest.getstatebyseqno(data).subscribe((res: any) => {
          if (res.success) {
            if (res.details.length > 0) {
              this.nexttransitionid = 0;
              this.nextstatusseq = Number(seqno);
              this.nextWokflowstateid = res.details[0].mststateid;
              this.statustypeid = res.details[0].recorddifftypeid;
              this.statusid = res.details[0].recorddiffid;
              this.checkTerm();
              resolve(true);
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
    } else {
      this.notifier.notify('error', 'Please select any record.');
    }
  }

  checkTerm() {
    this.stateterms = [];
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

  moveWorkflow() {
    // const promise = new Promise((resolve, reject) => {
    const data = {
      'clientid': Number(this.clientId),
      'mstorgnhirarchyid': Number(this.orgId),
      // 'recorddifftypeid': this.workingtypeid,
      // 'recorddiffid': this.workingid,
      'transitionid': this.nexttransitionid,
      'previousstateid': this.currentstateid,
      'currentstateid': this.nextWokflowstateid,
      'manualstateselection': 0,
      'transactionids': this.selectedRecordIds,
      'createdgroupid': this.userGroupId,
      'mstgroupid': this.userGroupId,
      'mstuserid': Number(this.messageService.getUserId())
    };
    console.log(JSON.stringify(data));
    this.rest.bulkapprovalfortickets(data).subscribe((res: any) => {
      if (res.success) {
        this.notifier.notify('success', 'Process moved to next state');

      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
    // });
    // return promise;
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
  }

  onPageLoad() {
    this.itemsPerPage = this.pageSizeObj[0].value;
    this.pageSizeSelected = Number(this.messageService.pageSelected);
    this.getorganizationclientwise();
    this.getRecordDiffType();
    this.currentStateDetails(this.PENDING_APPROVAL_STATUS_SEQ);
  }

  currentStateDetails(seqno) {
    // let promise = new Promise((resolve, reject) => {
    const data = {
      'clientid': Number(this.clientId),
      'mstorgnhirarchyid': Number(this.orgId),
      'typeseqno': this.STATUS_SEQ,
      'seqno': Number(seqno)
    };
    this.rest.getstatebyseqno(data).subscribe((res: any) => {
      if (res.success) {
        if (res.details.length > 0) {
          this.currentstateid = res.details[0].mststateid;
        } else {
          this.notifier.notify('error', 'Current State Details not found');
        }
      } else {
        this.notifier.notify('error', res.message);
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

  getTicketType() {
    const ticketTypeData = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': Number(this.orgId),
      'recorddifftypeid': this.TICKET_TYPE_ID
    };
    this.rest.getrecordtypedata(ticketTypeData).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
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
          for (let i = 0; i < this.ticketsTyp.length; i++) {
            if (this.ticketsTyp[i].id === type) {
              this.typSelected = this.ticketsTyp[i].id;
              break;
            }
          }
        }
        this.getTableData();
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
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
    let menuid = 16;
    const workspace = this.messageService.getWorkspace();
    if (workspace !== null) {
      // this.workspaceSelected = workspace;
      if (workspace === 2) {
        menuid = 69;
      }
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

    this.margeHeaderArr = [];
    this.margeHeaderArr.push('clientid', 'mstorgnhirarchyid', 'id', 'recordid', 'tickettypeid');
    for (let i = 0; i < this.columnDefinitions.length; i++) {
      this.margeHeaderArr.push(this.columnDefinitions[i].field);
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
    // console.log(JSON.stringify(savedWorkflowSupportGroup));
    const data = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': Number(this.orgId),
      'searchmstorgnhirarchyid': this.selectedOrgVals,
      // 'recorddiffid': this.typSelected,
      // 'recorddiffidseq': this.typeSeq,
      'menuid': menuid,
      'querytype': 2,
      'supportgrpid': savedWorkflowSupportGroup,
      'where': [],
      'order': [],
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
    // console.log("\n DATA is ----------->>>>>>>>>>      ", data);
    this.rest.recordgridresult(data).subscribe((res) => {
      this.respObject = res;
      this.executeResponse(this.respObject, offset);
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  executeResponse(respObject, offset) {
    let statusReasonArray = [];
    let visiblecommentsArray = [];
    this.categoriesLength = 0;
    if (respObject.success) {
      this.dataLoaded = true;
      this.dataset = [];
      if (offset === 0) {
        this.totalData = respObject.details.total;
      }
      const data = respObject.details.result;
      if (data.length > 0) {
        this.categoriesLength = data[0].categories.length;
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].categories.length; j++) {
            data[i][data[i].categories[j].lable] = data[i].categories[j].name;
          }
          delete data[i].categories;
        }

        // for (let i = 0; i < data.length; i++) {
        //   if (data[i].statusreson.length > 0) {
        //     for (let j = 0; j < data[i].statusreson.length; j++) {
        //       statusReasonArray.push(data[i].statusreson[j].termname + ' : ' + data[i].statusreson[j].recordtrackvalue);
        //     }

        //     data[i]['statusreason'] = statusReasonArray.toString();
        //   }
        //   delete data[i].statusreson;
        // }

        // for (let i = 0; i < data.length; i++) {
        //   if (data[i].visiblecomment.length > 0) {
        //     for (let j = 0; j < data[i].visiblecomment.length; j++) {
        //       visiblecommentsArray.push(data[i].visiblecomment[j].Comment + ' : ' + data[i].visiblecomment[j].Createdate);
        //     }

        //     data[i]['visiblecomments'] = visiblecommentsArray.toString();
        //   }
        //   delete data[i].visiblecomment;
        // }

      }
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

}

