import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NotifierService} from 'angular-notifier';
import {AngularGridInstance, GridOdataService, GridOption, FieldType} from 'angular-slickgrid';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';
import {RestApiService} from '../rest-api.service';
import {MessageService} from '../message.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FormControl} from '@angular/forms';
import {JsonPipe} from '@angular/common';
import {ConfigService} from '../config.service';
import {param} from 'jquery';

// import {ResizeEvent} from 'angular-resizable-element';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.css']
})
export class CreateTicketComponent implements OnInit, OnDestroy {

  height: number;
  ticketsTyp: any;
  displayed = false;
  name: string;
  desc: string;
  brief: string;
  urgency: number;
  impact: number;
  clientId: any;
  priority: string;
  notifier: NotifierService;
  respObject: any;
  urgencies = [];
  impacts = [];
  cat = [];
  priorityId = 0;
  attachment = [];
  uploadButtonName = '';
  fileUploadUrl: string;
  add = false;
  dynamicFields = [];
  priorityType: number;
  columnDefinitions = [];
  gridOptions: GridOption;
  dataset: any[];

  selectedTitles: any[];
  Tickets = [];
  show: boolean;
  selected: number;
  data = [];
  selectable = true;
  totalData: number;
  attrValue = [];
  start = 0;
  types = [];
  menus = [];
  clientName: string;
  columnName: string;
  page: number;
  collectionSize: number;
  pageSize: number;

  typeSeq: number | any | string;
  dataLoaded = true;
  ticketTypeLoaded = false;
  categoryLoaded = false;
  private baseCategories = [];
  private userAuth: Subscription;
  hideAttachment: boolean;
  attachMsg: string;
  rsdbData: any;
  role = [];
  roleSelected: number;
  type: string;
  @ViewChild('ticketcontent') private ticketcontent;
  @ViewChild('userInfo') private userInfo;
  userGroups = [];
  solutions = [];
  @ViewChild('groupSelect') private groupSelect;
  userGroupSelected: number;
  userGroupId: number;
  userName: string;
  groupName: string;
  grpLevel: number;
  isLowestLevel: boolean;
  searchDtls = [];
  panelOpenState = false;
  @ViewChild('tab') private tab;
  selectedTab: number;
  isBlankLong = false;
  isBlankPriority = false;
  formdata: any;
  service: any;
  top: number;
  skip: number;
  query: any;
  @Input() parentorgid = 0;
  @Input() groupid = 0;
  @Input() parentTicketId = 0;
  @Input() parentPriorityId = 0;
  @Input() parentPriorityTypeId = 0;
  @Input() tickettypeid = 0;
  @Input() hideNotifier: boolean;
  private attachFile: number;
  orgId: number;
  TICKET_TYPE_ID: number;
  @ViewChild('loginName') private loginName;
  // @ViewChild('content') private content;
  userSelected: string;
  userDtl = [];
  isLoading = false;
  private dialogRef2: MatDialogRef<any, any>;
  searchUser: FormControl = new FormControl();
  showInfo: boolean;
  isVip: boolean;
  selectedPriority: any;
  typSelected: any;
  ticketTypes = [];
  configtype: number;
  priorityName: string;
  lastLebelId: number;
  recordTermId: any;
  fileRecord = [];
  categoryArr = [];
  ticketTypeArr = {};
  impactArr = {};
  urgencyArr = {};
  priorityArry = {};
  statusArry = {};
  priorities = [];
  ticket_type_seq = 1;
  recordType = [];
  isassetattached: boolean;
  private statusTypeId: number;
  private statusId: number;
  ticketAssetIds = [];
  orgTypeId: number;
  organizationList = [];
  // organizationId: any;
  levelSelected: any;
  levels = [];
  @Input() userId: number;
  @Input() OriginaluserGroupId: number;
  private workingcatlabelid: number;

  previouscat = [];
  recordterms = [];
  load: boolean;
  private infoRef: MatDialogRef<unknown, any>;
  userinfo: any[];
  vipuser: string;
  isWrongCategory: boolean;
  hascatalog: string;
  rName: string;
  rEmail: string;
  rMobile: string;
  rLoc: string;
  parentCategory: string[];
  private closeCreateModalSubscribe: Subscription;
  estimatedEffortName: string;
  crtype: string;

  selectSource: string;
  sources = ['Select Source', 'Call', 'Email', 'Walk-in'];
  maxfilesize: number;
  selectedColor: any;
  tableCss: any;
  darkCss: any;
  buttonCss: any;
  fontColor: any;
  footerItem: any;
  colorObj: any;

  searchRequestorLocation: FormControl = new FormControl();
  requestorLocationList = [];
  isFcategory: boolean;
  STASK_SEQ = 3;
  SR_SEQ = 2;
  CTASK_SEQ = 5;
  CR_SEQ = 4;
  PTASK_SEQ = 7;
  tNumber: string;

  private modalserviceref: NgbModalRef;
  isSearchTicket: boolean;
  searchTicketdetails = [];
  isAttachedTicket: boolean;
  attachedTicket = [];
  scheduletab = [];
  plantab = [];
  extras = [];
  selectedNewTab: any;
  displayMandatory: boolean;
  termstartdate: string;
  termenddate: string;
  private TASK_SEQ: number[];
  groups = [];
  ismanagement: boolean;

  isTicketCreated: boolean;
  private prevSelectSource: string;


  constructor(private rest: RestApiService, notifier: NotifierService, private messageService: MessageService,
              private route: Router, private actRoute: ActivatedRoute, private modalService: NgbModal,
              private dialog: MatDialog, private config: ConfigService) {
    this.notifier = notifier;

  }

  ngOnInit() {
    this.isTicketCreated = false;
    this.TASK_SEQ = [this.CTASK_SEQ, this.STASK_SEQ, this.PTASK_SEQ];
    this.termstartdate = '';
    this.termenddate = '';
    this.isSearchTicket = false;
    this.isAttachedTicket = true;
    this.displayMandatory = true;
    this.maxfilesize = this.config.MAX_FILE_SIZE;
    this.colorObj = this.messageService.colors;
    this.statusTypeId = 0;
    this.statusId = 0;
    this.impact = 0;
    this.selectedPriority = 0;
    this.urgency = 0;
    this.priorityType = 1;
    this.categoryLoaded = true;
    this.fileRecord = [];
    this.attachment = [];
    this.categoryArr = [];
    this.ticketTypeArr = {};
    this.impactArr = {};
    this.urgencyArr = {};
    this.priorityArry = {};
    this.estimatedEffortName = '';
    this.crtype = '';
    this.statusArry = {};
    this.brief = '';
    this.desc = '';
    this.userGroupId = 0;
    this.OriginaluserGroupId = 0;
    this.dynamicFields = [];
    // this.dynamicFieldValue = [];
    this.recordterms = [];
    this.gridOptions = {
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
    this.isassetattached = false;
    this.fileUploadUrl = this.rest.apiRoot + '/fileupload';
    this.hideAttachment = true;
    this.isVip = false;
    this.showInfo = false;
    if (this.messageService.color) {
      this.selectedColor = this.messageService.color;
      for (let i = 0; i < this.colorObj.length; i++) {
        if (this.selectedColor === this.colorObj[i].selectedValue) {
          this.fontColor = this.colorObj[i].fontColorValue;
          this.footerItem = this.colorObj[i].footerItemValue;
          this.buttonCss = this.colorObj[i].buttonCss;
          this.tableCss = this.colorObj[i].tableCss;
          this.darkCss = this.colorObj[i].darkCss;
        }
      }
    }

    this.messageService.getColor().subscribe((data: any) => {
      this.selectedColor = data;
      for (let i = 0; i < this.colorObj.length; i++) {
        if (this.selectedColor === this.colorObj[i].selectedValue) {
          this.fontColor = this.colorObj[i].fontColorValue;
          this.footerItem = this.colorObj[i].footerItemValue;
          this.buttonCss = this.colorObj[i].buttonCss;
          this.tableCss = this.colorObj[i].tableCss;
          this.darkCss = this.colorObj[i].darkCss;
        }
      }
    });
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.userGroups = this.messageService.group;
      this.vipuser = this.messageService.vipuser;

      this.orgId = this.messageService.orgnId;
      this.userId = Number(this.messageService.getUserId());
      this.orgTypeId = this.messageService.orgnTypeId;
      if (this.userGroups !== undefined && this.userGroups.length > 0) {
        // this.userGroupSelected = this.userGroups[0].id;
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
    }
    this.userAuth = this.messageService.getClientUserAuth().subscribe(auth => {
      this.userGroups = auth[0].group;
      this.clientId = auth[0].clientid;
      this.orgId = auth[0].mstorgnhirarchyid;
      this.orgTypeId = auth[0].orgntypeid;
      this.userId = auth[0].userid;
      this.vipuser = auth[0].vipuser;
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
  }

  getRecordDiffType() {
    // console.log('fetch record type');
    this.rest.getRecordDiffType().subscribe((res: any) => {
      if (res.success) {
        this.recordType = res.details;
        for (let i = 0; i < this.recordType.length; i++) {
          if (Number(this.recordType[i].seqno) === Number(this.ticket_type_seq)) {
            this.TICKET_TYPE_ID = this.recordType[i].id;
            this.getTicket();
          }

        }
      }
    });
  }

  changeRouting() {
    // if (this.messageService.dashboardUrl !== undefined && this.messageService.dashboardUrl !== null) {
    //     this.messageService.changeRouting(this.messageService.dashboardUrl);
    // }
    // this.route.navigate(['ticket/dashboard']);
  }

  openUserInfo() {
    this.userinfo = [];
    const data = {'clientid': this.clientId, 'mstorgnhirarchyid': this.orgId, 'id': Number(this.userId)};
    this.rest.useridwiseuserinfo(data).subscribe((res: any) => {
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

  changeId(user) {
    if (this.userDtl.length > 0 && this.userSelected !== '') {
      // console.log('inside')
      this.userId = user.id;
      if (user.vipuser === 'Y') {
        this.isVip = true;
      } else {
        this.isVip = false;
      }
      const data = {clientid: this.clientId, mstorgnhirarchyid: this.orgId, refuserid: this.userId};
      this.rest.groupbyuserwise(data).subscribe((res: any) => {
        if (res.success) {
          // this.userinfo = res.details;
          if (res.details.length > 0) {
            this.OriginaluserGroupId = res.details[0].id;
            this.rName = user.firstname + ' ' + user.lastname;
            this.rLoc = user.branch;
            this.rMobile = user.usermobileno;
            this.rEmail = user.useremail;
            this.dialog.closeAll();
          }
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    }
  }

  searchFaq(value) {
    if (value.length > 2) {
      const data = {
        'clientId': this.clientId,
        'searchKeyword': value,
        diffid: this.typSelected,
        supportGrpId: this.userGroupId,
        difftypeid: this.TICKET_TYPE_ID,
        orgnid: this.orgId
      };
      this.rest.faqSearchKeywordCTSforDocs(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.selectedTab = 2;
          this.searchDtls = this.respObject.searchDetails;
          /*for (let i = 0; i < this.respObject.searchDetails.length; i++) {
            this.respObject.searchDetails[i].documents_nm_path = this.messageService.BASE_PATH + TCS_FAQ_PATH + '/' +
              this.respObject.searchDetails[i].documents_nm;
          }*/
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    }
  }

  onImpactChange(index: any) {
    if (this.urgency !== 0) {
      const data = {
        'clientid': this.clientId,
        'mstorgnhirarchyid': this.orgId,
        'recordtypeid': this.typSelected,
        'recordimpactid': Number(this.impact),
        'recordurgencyid': Number(this.urgency)
      };
      this.getPriority(data);
    }
    this.impactArr = {id: this.impacts[index - 1].typeid, val: Number(this.impact)};
  }


  getPriority(data) {

    this.rest.getrecordpriority(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.priorities = this.respObject.response.priority;
        if (this.priorities.length > 0) {
          this.priorityId = this.respObject.response.priority[0].id;
          this.priorityArry = {id: this.priorities[0].typeid, val: this.priorityId};
          this.priorityName = this.respObject.response.priority[0].title;
        } else {
          this.priorityName = '';
          this.priorityId = 0;
          this.priorityArry = {};
        }

      } else {
        this.notifier.notify('error', this.respObject.errorMessage);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });

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

  onUrgencyChange(index) {
    if (this.impact !== 0) {
      const data = {
        'clientid': this.clientId,
        'mstorgnhirarchyid': this.orgId,
        'recordtypeid': this.typSelected,
        'recordimpactid': Number(this.impact),
        'recordurgencyid': Number(this.urgency)
      };
      this.getPriority(data);
    }
    this.urgencyArr = {id: this.urgencies[index - 1].typeid, val: Number(this.urgency)};
  }


  openTicketDetailsModal() {
    this.userSelected = '';
    this.dialogRef2 = this.dialog.open(this.loginName, {
      width: '550px'
    });
    // this.levelSelected = '';
    this.userDtl = [];
    this.getUserListBySupportGroup();
    // if (this.grpLevel > 1) {
    //   this.getLevelData();
    // }
  }

  onOrganizationChange() {
    this.levelSelected = '';
    this.userDtl = [];
    this.rest.groupbyuserwise({
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgId),
      refuserid: Number(this.messageService.getUserId())
    }).subscribe((res: any) => {
      if (res.success) {
        const groups = res.details;
        if (groups.length > 0) {
          let match = false;
          for (let i = 0; i < groups.length; i++) {
            if (groups[i].defaultgroup === 1) {
              this.levelSelected = groups[i].id;
              match = true;
              break;
            }
          }
          if (!match) {
            this.levelSelected = groups[0].id;
          }
          if (this.grpLevel > 1) {
            this.userGroupId = this.levelSelected;
          }
          if (this.modalserviceref) {
            this.modalserviceref.close();
          }
          this.afterPageLoad();
        } else {
          this.notifier.notify('error', this.messageService.NO_GROUP);
          this.levelSelected = 0;
        }

      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      console.log(err);
    });
  }

  // getorganizationclientwise() {
  //   this.organizationId = 0;
  //   this.rest.getorgassignedcustomer({
  //     clientid: this.clientId,
  //     refuserid: Number(this.messageService.getUserId())
  //   }).subscribe((res: any) => {
  //     if (res.success) {
  //       this.organizationList = res.details.values;
  //       // this.levels = [];
  //     } else {
  //       this.notifier.notify('error', res.message);
  //     }
  //   }, (err) => {
  //     // console.log(err);
  //   });
  // }


  getLevelData() {
    this.rest.getgroupbyorgid({clientid: this.clientId, mstorgnhirarchyid: Number(this.orgId)}).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.levels = this.respObject.details;
        for (let i = 0; i < this.levels.length; i++) {
          if (this.levels[i].levelid === 1) {
            this.levelSelected = this.levels[i].id;
            break;
          }
        }
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onLevelChange(selectedIndex) {
    this.getUserListBySupportGroup();
  }

  getUserListBySupportGroup() {
    this.searchUser.valueChanges.subscribe(
      psOrName => {
        const data = {
          loginname: psOrName,
          clientid: Number(this.clientId),
          mstorgnhirarchyid: Number(this.orgId),
          // type: 'email'
        };
        // if (this.grpLevel === 1) {
        //   data['groupid'] = this.userGroupId;
        // } else {
        //   data['groupid'] = Number(this.levelSelected);
        // }
        this.isLoading = true;
        if (psOrName !== '') {
          this.rest.searchUserByOrgnId(data).subscribe((res1) => {
            this.respObject = res1;
            this.isLoading = false;
            if (this.respObject.success) {
              this.userDtl = this.respObject.details;
            } else {
              this.notifier.notify('error', this.respObject.message);
            }
          }, (err) => {
            this.isLoading = false;
            this.notifier.notify('error', this.messageService.SERVER_ERROR);
          });
        } else {
          this.isLoading = false;
          // this.userId = 0;
          this.userDtl = [];
        }
      });
  }


  blockSpecialChar(e) {
    const k = e.keyCode;
    return (k !== 35 && k !== 64);
  }


  onCategoryChange(categorySeq, option) {
    // console.log(categorySeq,option);
    const opt = JSON.parse(option);
    if (opt.type !== 'header') {
      const value = opt.id;
      if ((categorySeq === this.ticketTypes.length)) {
        this.lastLebelId = value;
        const data = {
          'clientid': this.clientId,
          'mstorgnhirarchyid': this.orgId,
          'recordtypeid': this.typSelected,
          'recordcatid': this.lastLebelId
        };
        // this.getAdditionaldata(data);
        if (this.typeSeq !== 3 && this.configtype === 2) {
          this.getPriority(data);
        }
        this.getAdditionaldata(data);
      } else {
        this.priorityName = '';
      }
      // let matched = false;
      const index = this.ticketTypes.map(function(d) {
        return d['sequanceno'];
      }).indexOf(categorySeq + 1);
      // // console.log('index:' + index);
      const index1 = this.ticketTypes.map(function(d) {
        return d['sequanceno'];
      }).indexOf(categorySeq);
      // const pid = this.ticketTypes[index1].child[0].id;

      if (this.categoryArr.length > index1) {
        this.categoryArr = this.categoryArr.slice(0, index1);
        this.categoryArr.push({id: this.ticketTypes[index1].id, val: value});
      } else {
        this.categoryArr.push({id: this.ticketTypes[index1].id, val: value});
      }
      if (index > -1) {
        for (let i = index + 1; i < this.ticketTypes.length; i++) {
          const options = this.ticketTypes[i].child;
          for (let j = 0; j < options.length; j++) {
            if (options[j].type) {
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
            'mstdifferentiationtypeid': Number(this.TICKET_TYPE_ID),
            'mstdifferentiationid': Number(this.typSelected)
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
            this.respObject.response[i].catSeq = categorySeq;
            if (this.respObject.response[i].termsvalue !== '') {
              this.respObject.response[i].values = this.respObject.response[i].termsvalue.split(',');
            } else {
              this.respObject.response[i].value = '';
            }
          }
          // console.log(JSON.stringify(this.dynamicFields));
          if (this.dynamicFields.length > 0) {
            for (let j = 0; j < this.dynamicFields.length; j++) {
              if (Number(this.dynamicFields[j].catSeq) >= Number(categorySeq)) {
                this.dynamicFields = this.dynamicFields.slice(0, j);
                break;
              }
            }
            for (let i = 0; i < this.respObject.response.length; i++) {
              this.dynamicFields.push(this.respObject.response[i]);
            }
          } else {
            this.dynamicFields = this.respObject.response;
            // console.log(JSON.stringify(this.dynamicFields));
          }

        } else {
        }
      }, (err) => {
      });
      let data;
      if (index > -1) {
        data = this.ticketTypes[index].child[0];
        this.ticketTypes[index].child = [];
        this.dataLoaded = false;
        const data1 = {
          'clientid': this.clientId,
          'mstorgnhirarchyid': Number(this.orgId),
          'recorddifftypeid': this.TICKET_TYPE_ID,
          'recorddiffid': Number(this.typSelected),
          'recorddiffparentid': Number(value)
        };
        this.rest.getrecordcatchilddata(data1).subscribe((respObject: any) => {
          if (respObject.success) {
            this.dataLoaded = true;
            if (respObject.response) {
              respObject.response.unshift(data);
              this.ticketTypes[index].child = respObject.response;
            }
          } else {
            this.dataLoaded = true;
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
      }).indexOf(categorySeq + 1);
      if (index === -1) {
        this.categoryArr = this.categoryArr.slice(0, (this.categoryArr.length - 1));
      }
    }
  }

  onFileComplete(data: any) {
    if (data.success) {
      this.hideAttachment = false;
      this.attachment.push({originalName: data.details.originalfile, fileName: data.details.filename});
      if (this.attachment.length > 1) {
        this.attachMsg = this.attachment.length + ' files uploaded successfully';
      } else {
        this.attachMsg = this.attachment.length + ' file uploaded successfully';
      }
    }
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

  onPageLoad() {
    this.actRoute.queryParams.subscribe((params: any) => {
      if (params.type && this.parentTicketId === 0) {
        this.isFcategory = true;
      } else {
        this.isFcategory = false;
      }
      // console.log("\n PARAMS   ===============   ", params);
      if (params.parentTicketId) {
        this.parentTicketId = Number(params.parentTicketId);
        // console.log(this.parentTicketId);
        this.parentPriorityId = Number(params.parentPriorityId);
        this.OriginaluserGroupId = Number(params.originaluserGroupId);
        this.userId = Number(params.userId);
        this.parentPriorityTypeId = Number(params.parentPriorityTypeId);
        this.tickettypeid = Number(params.tickettypeid);
        this.groupid = Number(params.groupid);
      }
      if (params.reqName) {
        this.rName = String(params.reqName);
        this.rMobile = String(params.reqMobile);
        this.rEmail = String(params.reqEmail);
        this.rLoc = String(params.reqBranch);
      } else {
        this.rName = this.messageService.firstname + ' ' + this.messageService.lastname;
        this.rMobile = this.messageService.mobile;
        this.rEmail = this.messageService.email;
        this.rLoc = this.messageService.branch;
      }
      // this.orgId = data.parentorgid;

      this.orgId = Number(params.a);
      if (this.orgId > 0) {
        if (this.orgTypeId === 2 && this.grpLevel > 1) {
          // console.log(this.orgId);
          this.onOrganizationChange();
        } else {
          this.afterPageLoad();
        }
      }

    });
  }


  afterPageLoad() {
    if (this.groupid > 0) {
      this.userGroupSelected = this.userGroupId = this.groupid;
    }
    console.log('----->', this.userGroupId);
    this.selectSource = 'Select Source';
    this.prevSelectSource = 'Select Source';
    this.isWrongCategory = false;
    this.formdata = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.orgId
    };
    this.getRecentRecords();
    this.getRequesterLocation();

    if (this.hascatalog !== 'Y') {
      if (this.parentPriorityId > 0) {
        this.priorityArry = {id: this.parentPriorityTypeId, val: this.parentPriorityId};
        this.priorityId = this.parentPriorityId;
      }
      this.getRecordDiffType();
      if (this.vipuser === 'Y') {
        this.isVip = true;
      }
    } else {
      const ttype = this.messageService.getTicketTypeData();
      this.ticketTypeArr = {id: ttype.id, val: ttype.type};
      this.TICKET_TYPE_ID = ttype.id;
      this.typSelected = ttype.type;
      this.fetchPredefinedValue();
    }
    // });
  }

  fetchPredefinedValue() {
    // console.log('inside')
    this.isassetattached = (this.messageService.getAssetCount() > 0);
    const category = this.messageService.getCat();
    if (category !== null) {
      this.categoryArr = category;
    } else {
      if (this.hascatalog === 'Y') {
        this.isWrongCategory = true;
      }
    }
    if (!this.isWrongCategory) {

      const stat = this.messageService.getStatus();
      const term = this.messageService.getTerm();
      this.workingcatlabelid = this.messageService.getWorkinglabel();

      this.statusArry = stat;

      if (term !== null) {
        this.recordterms = term;
        this.recordTermId = term[0].val;
      }
      const lastcat = this.messageService.getLastCat();
      if (this.hascatalog !== 'Y') {
        const data = {
          'clientid': this.clientId,
          'mstorgnhirarchyid': this.orgId,
          'recordtypeid': this.typSelected,
          'recordcatid': lastcat
        };
        this.getPriority(data);
        const ticketTypeData = {
          clientid: this.clientId,
          mstorgnhirarchyid: this.orgId,
          categoryid: lastcat,
          recorddiffid: this.typSelected,
          recorddifftypeid: this.TICKET_TYPE_ID
        };
        this.rest.getcategorybylastid(ticketTypeData).subscribe((res: any) => {
          if (res.success) {
            this.categoryLoaded = true;
            if (res.details.recordcategory.length > 0) {
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
              // console.log("----> "+JSON.stringify(this.ticketTypes))
              if (category === null) {
                for (let i = 0; i < this.ticketTypes.length; i++) {
                  this.categoryArr.push({id: this.ticketTypes[i].id, val: this.ticketTypes[i].child[0].id});
                }
              }
              this.configtype = res.details.configtype;
              this.previouscat = this.messageService.copyArray(res.details.recordcategory);
              this.getAdditionalfield();
            }
          } else {
            this.notifier.notify('error', res.message);
          }
        }, (err) => {
          this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
      } else {
        const prio = this.messageService.getPrio();
        this.priorityArry = prio;
        this.getAdditionalfield();
        const ticketTypeData = {
          Id: lastcat,
        };
        this.rest.getRecorddifferentiationbyparent(ticketTypeData).subscribe((res: any) => {
          if (res.success) {
            this.categoryLoaded = true;
            if (res.details.length > 0) {
              const parents = res.details[0].parentcategorynames;
              this.parentCategory = parents.split('->');
            }
          } else {
            this.notifier.notify('error', res.message);
          }
        }, (err) => {
          this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
      }

    } else {
      this.notifier.notify('error', this.messageService.CATALOG_ERROR);
    }
  }

  getAdditionalfield() {
    const additionalCat = [];
    for (let i = 0; i < this.categoryArr.length; i++) {
      additionalCat.push({
        mstdifferentiationtypeid: this.categoryArr[i].id,
        mstdifferentiationid: this.categoryArr[i].val
      });
    }
    const adddata = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.orgId,
      'recordtypedifftypeid': this.TICKET_TYPE_ID,
      'recordtypediffid': this.typSelected,
      'recordcatset': additionalCat
    };
    this.rest.getadditionalfieldsbytypecat(adddata).subscribe((res: any) => {
      if (res.success) {
        for (let i = 0; i < res.response.length; i++) {
          // this.respObject.response[i].catSeq = ticket.sequanceno;
          if (res.response[i].termsvalue !== '') {
            res.response[i].values = res.response[i].termsvalue.split(',');
            // res.response[i].value = res.response[i].values[0];
          } else {
            res.response[i].value = '';
          }
        }
        this.dynamicFields = res.response;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onFreqCategoryChange(sequanceno, option) {
    // console.log('----->'+JSON.stringify(this.ticketTypes))
    const opt = JSON.parse(option);
    if (opt.type !== 'header') {
      const value = opt.id;
      // console.log(sequanceno, this.ticketTypes.length, this.priorityType)
      if ((sequanceno === this.ticketTypes.length) && this.configtype === 2) {
        // console.log('inside')
        this.lastLebelId = value;
        const data = {
          'clientid': this.clientId,
          'mstorgnhirarchyid': this.orgId,
          'recordtypeid': this.typSelected,
          'recordcatid': this.lastLebelId
        };
        // this.getPriority(data);
      }
      const index = this.ticketTypes.map(function(d) {
        return d['sequanceno'];
      }).indexOf(sequanceno + 1);
      // // console.log('index:' + index);
      const index1 = this.ticketTypes.map(function(d) {
        return d['sequanceno'];
      }).indexOf(sequanceno);
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
            'mstdifferentiationtypeid': Number(this.TICKET_TYPE_ID),
            'mstdifferentiationid': Number(this.typSelected)
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
            this.respObject.response[i].catSeq = sequanceno;

            if (this.respObject.response[i].termsvalue !== '') {
              this.respObject.response[i].values = this.respObject.response[i].termsvalue.split(',');
              // this.respObject.response[i].value = this.respObject.response[i].values[0];
            } else {
              this.respObject.response[i].value = '';
            }
          }
          if (this.dynamicFields.length > 0) {
            for (let j = 0; j < this.dynamicFields.length; j++) {
              if (Number(this.dynamicFields[j].catSeq) >= Number(sequanceno)) {
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
          'recorddifftypeid': this.TICKET_TYPE_ID,
          'recorddiffid': Number(this.typSelected),
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
      const index = this.ticketTypes.map((d) => {
        return d['sequanceno'];
      }).indexOf(sequanceno + 1);
      if (index === -1) {
        this.categoryArr = this.categoryArr.slice(0, (this.categoryArr.length - 1));
      }
    }
  }

  getRequesterLocation() {
    // this.rLoc = '';
    this.isLoading = false;
    this.searchRequestorLocation.valueChanges.subscribe(
      psOrName => {
        const data = {
          'mstorgnhirarchyid': Number(this.orgId),
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
              // console.log('\n Location >>>>>>>> ', JSON.stringify(this.requestorLocationList));
            } else {
              this.notifier.notify('error', this.respObject.message);
            }
          }, (err) => {
            this.isLoading = false;
            this.notifier.notify('error', this.messageService.SERVER_ERROR);
          });
        } else {
          this.isLoading = false;
          this.requestorLocationList = [];
        }
      });
  }

  getTicket() {
    const ticketTypeData = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': Number(this.orgId),
      'recorddifftypeid': this.TICKET_TYPE_ID
    };
    this.rest.getrecordtypedata(ticketTypeData).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        // console.log('fetch ticket type')
        this.ticketTypeLoaded = true;
        if (this.parentTicketId === 0) {
          this.ticketsTyp = [];
          for (let i = 0; i < this.respObject.response.length; i++) {
            if (this.TASK_SEQ.indexOf(this.respObject.response[i].seqno) === -1) {
              this.ticketsTyp.push(this.respObject.response[i]);
            }
          }
        } else {
          this.ticketsTyp = this.respObject.response;
        }
        //console.log(this.tickettypeid);
        if (this.tickettypeid === 0) {
          // const storage = JSON.parse(sessionStorage.getItem('dd'));
          // if (storage === null) {
          if (this.ticketsTyp.length > 0) {
            this.typSelected = this.ticketsTyp[0].id;
            this.typeSeq = this.ticketsTyp[0].seqno;
          }
        } else {
          this.typSelected = this.tickettypeid;
        }
        for (let i = 0; i < this.ticketsTyp.length; i++) {
          if (Number(this.typSelected) === this.ticketsTyp[i].id) {
            this.ticketTypeArr = {id: this.ticketsTyp[i].typeid, val: this.typSelected};
            if (this.tickettypeid !== 0) {
              this.typeSeq = this.ticketsTyp[i].seqno;
            }
          }
        }
        if (this.typeSeq !== this.SR_SEQ && this.typeSeq !== this.STASK_SEQ) {
          if (this.sources.indexOf('Alert') === -1) {
            this.sources.splice(1, 0, 'Alert');
          }
        } else {
          if (this.sources.indexOf('Alert') > -1) {
            this.sources.splice(1, 1);
          }
        }
        // console.log('this.typSelected:', this.typSelected);
        if (this.isFcategory) {
          // console.log('predefined');
          this.fetchPredefinedValue();
        } else {
          this.getCategory();
        }
        if (this.typeSeq === this.CR_SEQ) {
          this.gettabterms();
        }
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onSelectGroup() {
    if (this.userGroupSelected !== 0) {
      this.userGroupId = this.userGroupSelected;
      for (let i = 0; i < this.userGroups.length; i++) {
        if (Number(this.userGroups[i].id) === Number(this.userGroupId)) {
          this.groupName = this.userGroups[i].groupname;
          this.grpLevel = this.userGroups[i].levelid;
        }
      }
      if (this.grpLevel === 0) {
        this.isLowestLevel = true;
      }
      this.messageService.setGroupChangeData(this.userGroupId);
      this.messageService.saveSupportGroup({
        groupId: this.userGroupId,
        grpName: this.groupName,
        levelid: this.grpLevel
      });
      this.afterPageLoad();
    }
  }


  ontypChange(selectedButton: any) {
    // this.priorityName = '';
    // this.dynamicFields = [];
    if (this.hascatalog === 'Y') {
      this.resetFieldCatalog();
    } else {
      this.resetField();
    }
    for (let i = 0; i < this.ticketsTyp.length; i++) {
      if (Number(this.typSelected) === this.ticketsTyp[i].id) {
        this.typeSeq = this.ticketsTyp[i].seqno;
        // this.messageService.saveMenuData({
        //   type: this.typSelected,
        //   seq: this.typeSeq,
        //   id: this.TICKET_TYPE_ID
        // });
        this.ticketTypeArr = {id: this.TICKET_TYPE_ID, val: this.typSelected};
      }
    }
    if (this.typeSeq !== this.SR_SEQ && this.typeSeq !== this.STASK_SEQ) {
      if (this.sources.indexOf('Alert') === -1) {
        this.sources.splice(1, 0, 'Alert');
      }
    } else {
      if (this.sources.indexOf('Alert') > -1) {
        this.sources.splice(1, 1);
      }
    }
    this.isassetattached = false;
    this.getCategory();
    if (this.typeSeq === this.CR_SEQ) {
      this.gettabterms();
    }
  }


  getCategory() {
    this.categoryArr = [];
    this.previouscat = [];
    const data = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.orgId,
      'recorddifftypeid': this.TICKET_TYPE_ID,
      'recorddiffid': this.typSelected
    };
    // console.log('inside category fetching');
    this.rest.getrecorddata(data).subscribe((res: any) => {
      // res = res;
      if (res.success) {

        this.categoryLoaded = true;
        this.ticketTypes = res.response.recordcategory;
        this.configtype = res.response.configtype;
        this.recordterms = res.response.recordterms;
        for (let i = 0; i < res.response.additionalfields.length; i++) {
          // this.respObject.response[i].catSeq = categorySeq;
          if (res.response.additionalfields[i].termsvalue !== '') {
            res.response.additionalfields[i].values = res.response.additionalfields[i].termsvalue.split(',');
          } else {
            res.response.additionalfields[i].value = '';
          }
        }
        this.dynamicFields = res.response.additionalfields;
        if (this.recordterms.length > 0) {
          this.recordTermId = this.recordterms[0].id;
        }
        this.workingcatlabelid = res.response.workingcatlabelid;
        this.isassetattached = (res.response.isassetattached > 0);
        if (this.configtype === 1) {
          this.impacts = res.response.recordimpact;
          this.urgencies = res.response.recordurgency;
        }
        if (res.response.recordstatus.length > 0) {
          this.statusTypeId = res.response.recordstatus[0].typeid;
          this.statusId = res.response.recordstatus[0].id;
          this.statusArry = {id: this.statusTypeId, val: this.statusId};
        }
        for (let i = 0; i < this.ticketTypes.length; i++) {
          if (this.ticketTypes[i].isDisabled) {
            this.ticketTypes[i].child.push({id: this.ticketTypes[i].id, title: this.ticketTypes[i].title});
            this.categoryArr.push({id: this.ticketTypes[i].id, val: this.ticketTypes[i].child[0].id});
          } else {
            this.ticketTypes[i].child.unshift({
              id: this.ticketTypes[i].id,
              title: this.ticketTypes[i].title,
              type: 'header'
            });
          }
        }
        // console.log(JSON.stringify(this.ticketTypes));
        this.previouscat = this.messageService.copyArray(res.response.recordcategory);

      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  resetFieldCatalog() {
    this.hideAttachment = true;
    this.brief = '';
    this.desc = '';
    this.attachment = [];
  }

  resetField() {
    this.isTicketCreated = false;
    this.termstartdate = '';
    this.termenddate = '';
    this.displayMandatory = true;
    this.isAttachedTicket = true;
    this.isSearchTicket = false;
    this.attachedTicket = [];
    this.hideAttachment = true;
    this.impact = 0;
    this.priorityId = 0;
    this.selectedPriority = 0;
    this.selectSource = 'Select Source';
    this.prevSelectSource = 'Select Source';

    this.estimatedEffortName = '';
    this.urgency = 0;
    this.priorityType = 1;
    this.categoryLoaded = true;
    this.fileRecord = [];
    this.attachment = [];
    this.categoryArr = [];
    this.impactArr = {};
    this.urgencyArr = {};
    if (this.parentPriorityId === 0) {
      this.priorityArry = {};
    }
    this.brief = '';
    this.desc = '';
    this.priorityName = '';
    this.Tickets = [];
    this.ticketAssetIds = [];
    this.OriginaluserGroupId = 0;
    this.dynamicFields = [];
    this.requestorLocationList = [];
    // this.dynamicFieldValue = [];
    this.ticketTypes = this.messageService.copyArray(this.previouscat);
    for (let i = 0; i < this.plantab.length; i++) {
      this.plantab[i].val = '';
    }
    for (let i = 0; i < this.extras.length; i++) {
      this.extras[i].val = '';
    }
    for (let i = 0; i < this.scheduletab.length; i++) {
      this.scheduletab[i].val = '';
    }
    this.tNumber = '';
  }

  createTicket() {
    this.isTicketCreated = true;
    // console.log('>>>>>>>>>>>>>>>>>', this.rMobile);
    if (this.grpLevel === 1) {
      this.selectSource = 'Self Service';
    } else {
      if (this.typeSeq === this.CR_SEQ || this.typeSeq === this.CTASK_SEQ || this.typeSeq === this.STASK_SEQ) {
        this.selectSource = 'Web';
      }
    }
    let isError = false;
    const assetIds = [];
    let extraCount = 0;
    // let isAddFieldMissing = false;
    const extrafields = [];
    //console.log(JSON.stringify(this.categoryArr));

    if (Number(this.OriginaluserGroupId) === 0) {
      this.OriginaluserGroupId = this.userGroupId;
    }

    for (let j = 0; j < this.ticketAssetIds.length; j++) {
      assetIds.push(this.ticketAssetIds[j]);
    }
    if (Number(this.userGroupId) === 0) {
      isError = true;
      this.isTicketCreated = false;
      this.notifier.notify('error', 'Enter Support Group');
    }
    if (this.hascatalog === 'Y') {
      if ((this.messageService.isBlankcat(this.categoryArr))) {
        isError = true;
        this.isTicketCreated = false;
        this.notifier.notify('error', this.messageService.CATEGORY_ERROR);
      }
    } else {
      if (this.categoryArr.length === this.ticketTypes.length) {
        if ((this.messageService.isBlankcat(this.categoryArr))) {
          isError = true;
          this.isTicketCreated = false;
          this.notifier.notify('error', this.messageService.CATEGORY_ERROR);
        }
      } else {
        isError = true;
        this.isTicketCreated = false;
        this.notifier.notify('error', this.messageService.CATEGORY_ERROR);
      }
    }

    /*if (this.desc.trim() === '' && this.brief.trim() !== '') {
      this.desc = this.brief.trim().substring(0, 99);
    } else if (this.desc.trim() !== '' && this.brief.trim() === '') {
      this.brief = this.desc.trim();
    } else
    if (this.desc.trim() !== '' && this.brief.trim() !== '') {
      this.isBlankDesc = false;
      this.isBlankLong = false;
    } else {
      this.isBlankDesc = true;
      this.isBlankLong = true;
    }*/

    if (this.desc.trim() === '') {
      isError = true;
      this.isTicketCreated = false;
      this.notifier.notify('error', this.messageService.BLANK_SHORT);
    }
    if (this.brief.trim() === '') {
      isError = true;
      this.isTicketCreated = false;
      this.notifier.notify('error', this.messageService.BLANK_LONG);
    }
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
    if (this.typeSeq === this.CR_SEQ) {
      let plancount = 0;
      let planextraCount = 0;
      let planerrorname = '';
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
            extrafields.push({
              id: plantabmod[i].fieldid,
              val: plantabmod[i].val,
              termsid: plantabmod[i].id
            });
          } else {
            planerrorname = planerrorname + ' ' + plantabmod[i].tername + ',';
          }
        } else {
          extrafields.push({
            id: plantabmod[i].fieldid,
            val: plantabmod[i].val,
            termsid: plantabmod[i].id
          });
        }
      }
      let extracount1 = 0;
      let extextraCount = 0;
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
            extracount1++;
            if (plantabmod1[i].val.trim() !== '' && plantabmod1[i].val !== 'NONE') {
              extextraCount++;
              extrafields.push({
                id: plantabmod1[i].fieldid,
                val: plantabmod1[i].val,
                termsid: plantabmod1[i].id
              });
            } else {
              planerrorname = planerrorname + ' ' + plantabmod1[i].tername + ',';
            }
          } else {
            extrafields.push({
              id: plantabmod1[i].fieldid,
              val: plantabmod1[i].val,
              termsid: plantabmod1[i].id
            });
          }
        }
      } else {
        for (let i = 0; i < plantabmod1.length; i++) {
          extrafields.push({
            id: plantabmod1[i].fieldid,
            val: '',
            termsid: plantabmod1[i].id
          });
        }
      }
      let schedulecount = 0;
      let scheduleextraCount = 0;
      const scheduletabmod = JSON.parse(JSON.stringify(this.scheduletab));

      let planStartDate;
      let planEndDate;
      let actualStartDate;
      let actualEndDate;
      let currentDate = new Date();
      for (let i = 0; i < scheduletabmod.length; i++) {
        if (Number(scheduletabmod[i].seq) === 63) {
          planStartDate = new Date(scheduletabmod[i].val);
        }
        if (Number(scheduletabmod[i].seq) === 64) {
          planEndDate = new Date(scheduletabmod[i].val);
        }
        if (Number(scheduletabmod[i].seq) === 65) {
          if (scheduletabmod[i].val !== '') {
            actualStartDate = new Date(scheduletabmod[i].val);
          } else {
            actualStartDate = '';
          }
        }
        if (Number(scheduletabmod[i].seq) === 66) {
          if (scheduletabmod[i].val !== '') {
            actualEndDate = new Date(scheduletabmod[i].val);
          } else {
            actualEndDate = '';
          }
        }
      }
      if (planStartDate >= planEndDate) {
        isError = true;
        this.isTicketCreated = false;
        this.notifier.notify('error', 'Planned End Date/Time must be greater than Planned Start Date/Time');
      } else {
        if (currentDate > planStartDate) {
          isError = true;
          this.isTicketCreated = false;
          this.notifier.notify('error', 'Planned Start Date/Time must be greater than Current Date/Time');
        }
        if (currentDate > planEndDate) {
          isError = true;
          this.isTicketCreated = false;
          this.notifier.notify('error', 'Planned End Date/Time must be greater than Current Date/Time');
        }
      }
      if ((actualStartDate !== '') && (actualEndDate !== '')) {
        if (actualStartDate >= actualEndDate) {
          isError = true;
          this.isTicketCreated = false;
          this.notifier.notify('error', 'Actual End Date/Time must be greater than Actual Start Date/Time');
        } else {
          if (currentDate < actualStartDate) {
            isError = true;
            this.isTicketCreated = false;
            this.notifier.notify('error', 'Actual Start Date/Time must be less than Current Date/Time');
          }
          if (currentDate < actualEndDate) {
            isError = true;
            this.isTicketCreated = false;
            this.notifier.notify('error', 'Actual End Date/Time must be less than Current Date/Time');
          }
        }
      }

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
            extrafields.push({
              id: scheduletabmod[i].fieldid,
              val: scheduletabmod[i].val,
              termsid: scheduletabmod[i].id
            });
          } else {
            scheduleerrorname = scheduleerrorname + ' ' + scheduletabmod[i].tername + ',';
          }
        } else {
          extrafields.push({
            id: scheduletabmod[i].fieldid,
            val: scheduletabmod[i].val,
            termsid: scheduletabmod[i].id
          });
        }
      }
      if (schedulecount !== scheduleextraCount) {
        isError = true;
        this.isTicketCreated = false;
        this.notifier.notify('error', scheduleerrorname.substring(0, scheduleerrorname.length - 1) + this.messageService.BLANK_SCHEDULE_ERROR_MESSAGE);
      }
      if (plancount !== planextraCount) {
        isError = true;
        this.isTicketCreated = false;
        this.notifier.notify('error', planerrorname.substring(0, planerrorname.length - 1) + this.messageService.BLANK_PLAN_ERROR_MESSAGE);
      }
      if (extracount1 !== extextraCount) {
        isError = true;
        this.isTicketCreated = false;
        this.notifier.notify('error', planerrorname.substring(0, planerrorname.length - 1) + this.messageService.BLANK_PLAN_ERROR_MESSAGE);
      }
    }
    // console.log('additionFiled' + JSON.stringify(extrafields));

    if (extraCount !== mandatoryfield) {
      isError = true;
      this.isTicketCreated = false;
      this.notifier.notify('error', adderrorname.substring(0, adderrorname.length - 1) + this.messageService.BLANK_ADDITIONAL);
    }
    if (this.selectSource === 'Select Source') {
      isError = true;
      this.isTicketCreated = false;
      this.notifier.notify('error', this.messageService.BLANK_SOURCE);
    }
    // console.log(this.rMobile);
    if (this.rMobile === null || this.rMobile === '') {
      isError = true;
      this.isTicketCreated = false;
      this.notifier.notify('error', this.messageService.BLANK_MOBILE);
    }
    if (this.rLoc === '') {
      isError = true;
      this.isTicketCreated = false;
      this.notifier.notify('error', this.messageService.BLANK_LOCATION);
    }

    // if ((this.rMobile !== null) && (String(this.rMobile).length !== 10)) {
    //   isError = true;
    //   this.isTicketCreated = false;
    //   this.notifier.notify('error', 'Requester mobile number must be at least 10 number');
    // }

    const data = {
      'clientid': Number(this.clientId),
      'mstorgnhirarchyid': Number(this.orgId),
      'originalusergroupid': Number(this.userGroupId),
      'originaluserid': Number(this.messageService.getUserId()),
      'createdusergroupid': Number(this.OriginaluserGroupId),
      'createduserid': Number(this.userId),
      'recordname': this.desc.trim(),
      'recordesc': this.brief.trim(),
      'requestername': this.rName,
      'requesteremail': this.rEmail,
      'requestermobile': this.rMobile,
      'requesterlocation': this.rLoc,
      'recordsets': [{'id': 1, 'type': this.categoryArr}, this.ticketTypeArr],
      'workingcatlabelid': this.workingcatlabelid,
      'source': this.selectSource,
      parentid: this.parentTicketId
    };
    // console.log("\n DATA ISSSSSSSS =========>>>>>>>>    ", JSON.stringify(data));
    if (this.typeSeq === this.CR_SEQ) {
      const recordids = [];
      for (let i = 0; i < this.attachedTicket.length; i++) {
        recordids.push(this.attachedTicket[i].id);
      }
      data['recordids'] = recordids;
    }
    if (this.configtype === 1) {
      if (!isError) {
        if (Object.keys(this.urgencyArr).length !== 0) {

          data.recordsets.push(this.urgencyArr);
        } else {
          isError = true;
          this.isTicketCreated = false;
          this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
        }
      }
      if (!isError) {
        if (Object.keys(this.impactArr).length !== 0) {
          data.recordsets.push(this.impactArr);
        } else {
          isError = true;
          this.isTicketCreated = false;
          this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
        }
      }
    }
    if (!isError) {
      // console.log('priority---->', JSON.stringify(this.priorityArry));
      if (Object.keys(this.priorityArry).length !== 0) {
        data.recordsets.push(this.priorityArry);
      } else {
        isError = true;
        this.isTicketCreated = false;
        this.notifier.notify('error', this.messageService.PRIORITY_ERROR);
      }
    }
    if (!isError) {
      if (Object.keys(this.statusArry).length !== 0) {
        data.recordsets.push(this.statusArry);
      } else {
        isError = true;
        this.isTicketCreated = false;
        this.notifier.notify('error', this.messageService.STATUS_ERROR);
      }
    }
    if (!isError) {
      if (this.attachment.length > 0) {
        if (this.recordterms.length > 0) {
          data['recordfields'] = [{'termid': this.recordTermId, 'val': this.attachment}];
        } else {
          isError = true;
          this.isTicketCreated = false;
          this.notifier.notify('error', 'No File Term Map');
        }
      }
    }

    if (assetIds.length > 0) {
      data['assetIds'] = assetIds;
    }

    if (extrafields.length > 0) {
      data['additionalfields'] = extrafields;
    }

    if (!isError) {
      if (!this.messageService.blankarr(data.recordsets) && data.recordesc.trim() !== '' && data.recordname.trim() !== '' && this.rName.trim() !== '' && this.rEmail.trim() !== '' && this.rMobile !== null && this.rLoc.trim() !== '') {

      } else {
        isError = true;
        this.isTicketCreated = false;
        this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
      }
    }
    if (!isError) {
      // console.log(JSON.stringify(data));
      this.rest.createrecord(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.notifier.notify('success', 'Your Ticket id is: ' + this.respObject.response);
          this.rest.geturlbykey({
            clientid: this.clientId,
            mstorgnhirarchyid: Number(this.orgId),
            Urlname: 'DisplayTicketDetails'
          }).subscribe((res1: any) => {
            this.isTicketCreated = false;
            if (res1.success) {
              this.isTicketCreated = false;
              if (res1.details.length > 0) {
                if (this.config.type === 'LOCAL') {
                  if (res1.details[0].url.indexOf(this.config.API_ROOT) > -1) {
                    res1.details[0].url = res1.details[0].url.replace(this.config.API_ROOT, 'http://localhost:4200');
                  }
                }
                this.messageService.setNavigation(location.href);
                this.messageService.changeRouting(res1.details[0].url, {
                  id: this.respObject.id,
                });
              }
              // this.messageService.removeLoginUserGroupId();
            } else {
              this.isTicketCreated = false;
              this.notifier.notify('error', res1.message);
            }
          }, (err) => {
            this.isTicketCreated = false;
            // console.log(err);
          });
          // this.messageService.setNavigation(location.href);
          // this.messageService.changeRouting(this.messageService.displayTicketUrl, {
          //   id: this.respObject.id
          // });
        } else {
          this.isTicketCreated = false;
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.isTicketCreated = false;
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    }
  }

  getRecentRecords() {
    const data = {
      'clientid': Number(this.clientId),
      'mstorgnhirarchyid': Number(this.orgId),
      'usergroupid': this.userGroupId
    };
    this.rest.recentrecords(data).subscribe((res: any) => {
      if (res.success) {
        this.rsdbData = res.details;
        for (let i = 0; i < res.details.length; i++) {
          this.rsdbData[i].createdate = this.messageService.dateConverter(this.rsdbData[i].createdate * 1000, 2);
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {

    });
  }

  ngOnDestroy(): void {
    if (this.userAuth) {
      this.userAuth.unsubscribe();
    }
    if (this.closeCreateModalSubscribe) {
      this.closeCreateModalSubscribe.unsubscribe();
    }
  }

  closeinfo() {
    this.infoRef.close();
  }

  clickRsdb(data) {
    if (this.grpLevel === 1) {
      this.rest.geturlbykey({
        clientid: this.clientId,
        mstorgnhirarchyid: data.orgnid,
        Urlname: 'DisplayTicketDetails'
      }).subscribe((res: any) => {
        if (res.success) {
          if (res.details.length > 0) {
            if (this.config.type === 'LOCAL') {
              if (res.details[0].url.indexOf(this.config.API_ROOT) > -1) {
                res.details[0].url = res.details[0].url.replace(this.config.API_ROOT, 'http://localhost:4200');
              }
            }
            this.messageService.setNavigation(location.href);
            this.messageService.changeRouting(res.details[0].url, {
              id: data.id,
              // code: data.code
            });
          }
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        // console.log(err);
      });

    } else {
      const url = this.messageService.externalUrl + '?dt=' + data.id + '&au=' + this.messageService.getUserId() + '&bt=' + this.messageService.getToken() + '&tp=dp&i=' + this.clientId + '&m=' + data.orgnid;
      window.open(url, '_blank');
    }
  }

  Count(id: any) {
    const data = {
      'clientid': Number(this.clientId),
      'mstorgnhirarchyid': Number(this.orgId),
      'id': Number(id)
    };
    this.rest.updatedoccount(data).subscribe((res: any) => {
      if (res.success) {

      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {

    });
  }

  downloadFile(uploadname, originalname) {
    const data = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.orgId,
      'filename': uploadname
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

  cancelFile(i: number) {
    this.attachment.splice(i, 1);
  }

  assetAttached(data: any[]) {
    // console.log(JSON.stringify(data));
    for (let i = 0; i < data.length; i++) {
      this.ticketAssetIds.push(data[i]);
    }
  }

  assetRemoved(data) {
    this.ticketAssetIds.splice(data.index, 1);
    // console.log(this.ticketAssetIds[index]);
  }

  onSourceChange() {
    if (this.selectSource === 'Alert') {
      const oldcat = this.messageService.copyArray(this.previouscat);
      for (let i = 0; i < oldcat[1].child.length; i++) {
        if (oldcat[1].child[i].title === 'Datacenter Services - Alert') {

          let val = oldcat[1].child[i];
          oldcat[1].child.splice(i, 1);

          oldcat[1].child.unshift(val);
          console.log(JSON.stringify(val));
          this.onCategoryChange(2, JSON.stringify(val));
          break;
        }
      }
      this.ticketTypes = [];
      this.ticketTypes = this.messageService.copyArray(oldcat);
    } else {
      if (this.prevSelectSource === 'Alert') {
        this.ticketTypes = this.messageService.copyArray(this.previouscat);
      }
    }
    this.prevSelectSource = this.selectSource;
  }

  onUserSelected(user: any) {
    if (this.userDtl.length > 0 && this.userSelected !== '') {
      // console.log('inside')
      this.userId = user.id;
      if (user.vipuser === 'Y') {
        this.isVip = true;
      } else {
        this.isVip = false;
      }
      if (this.grpLevel > 1) {
        this.OriginaluserGroupId = this.levelSelected;
      }
      this.rName = user.firstname + ' ' + user.lastname;
      this.rLoc = user.branch;
      this.rMobile = user.usermobileno;
      this.rEmail = user.useremail;
      this.modalserviceref.close();
      this.afterPageLoad();
    }
  }

  searchTicket() {
    this.isSearchTicket = true;
    this.searchTicketdetails = [];
    const data = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.orgId,
      'RecordNo': this.tNumber.trim()
    };
    this.rest.getrecorddetailsbynoforlinkrecord(data).subscribe((res: any) => {
      this.isSearchTicket = false;
      if (res.success) {
        if (res.details.length > 0) {
          this.searchTicketdetails = res.details;
          this.isAttachedTicket = false;
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
    const url = this.messageService.externalUrl + '?dt=' + id + '&au=' + this.messageService.getUserId() +
      '&bt=' + this.messageService.getToken() + '&tp=dp&i=' + this.clientId + '&m=' + this.orgId;
    window.open(url, '_blank');
  }

  attachTicket() {
    let linked = false;
    for (let i = 0; i < this.attachedTicket.length; i++) {
      if (this.attachedTicket[i].id === this.attachedTicket[0].id) {
        this.notifier.notify('error', this.messageService.DUPLICATE_LINK);
        linked = true;
        break;
      }
    }
    if (!linked) {
      this.isAttachedTicket = true;
      this.attachedTicket.push({
        id: this.searchTicketdetails[0].id,
        code: this.searchTicketdetails[0].code,
        recordtype: this.searchTicketdetails[0].recordtype,
        title: this.searchTicketdetails[0].title
      });
    }
    this.searchTicketdetails = [];
  }

  removeTicket(i: number) {
    this.attachedTicket.splice(i, 1);
  }

  gettabterms() {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: this.orgId,
      recorddiffid: this.typSelected,
      recorddifftypeid: this.TICKET_TYPE_ID,
      grpid: this.userGroupId,
      recordstatustypeid: 3,
      recordstatusid: 0
    };
    this.rest.gettabterms(data).subscribe((res: any) => {
      if (res.success) {
        this.scheduletab = res.details.scheduletab;
        // this.plantab = res.details.plantab;
        this.extras = [];
        for (let i = 0; i < res.details.plantab.length; i++) {
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
        // console.log('displayMandatory : ', this.displayMandatory);
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onplandropdownchange(val, seq) {
    // console.log(val, seq);
    if (seq === 57) {
      if (val === 'Yes') {
        this.displayMandatory = false;
      } else {
        this.displayMandatory = true;
      }
    }
  }

  afterclosed(val, seq) {
    // console.log(val, seq);
    val = this.messageService.dateConverter(val, 5);
    if (seq === 67) {
      this.termstartdate = val.trim();
    } else if (seq === 68) {
      this.termenddate = val.trim();
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
            this.extras[i].val = hhour + ' : ' + hhmin;
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
}
