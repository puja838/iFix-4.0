import {Component, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {RestApiService} from '../rest-api.service';
import {MessageService} from '../message.service';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {Formatters, OnEventArgs} from 'angular-slickgrid';
import {FormControl} from '@angular/forms';


@Component({
  selector: 'app-map-user-with-group-and-category',
  templateUrl: './map-user-with-group-and-category.component.html',
  styleUrls: ['./map-user-with-group-and-category.component.css']
})
export class MapUserWithGroupAndCategoryComponent implements OnInit {

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
  @ViewChild('content1') private content1;
  private modalReference: NgbModalRef;
  organizationId = '';
  orgId = '';
  organizationName = '';
  ticketTypeName = '';
  ticketType = '';
  formTicketTypeList = [];
  toTicketTypeList = [];
  organizationList = [];
  loginUserOrganizationId: number;
  seqNo = 0;
  recordDifTypeId: number;
  recordTypeStatus = [];
  recordTypeStatusBulk = [];
  recordTypeStatus1 = [];
  recordTypeStatusDown = [];
  fromRecordDiffTypeId = 2;
  fromRecordDiffTypeIdbulk = 0;
  fromRecordDiffTypeIdDown = 0;
  RecordDiffTypeId = 0;
  fromRecordDiffTypeSeqno = '';
  fromRecordDiffId = 0;
  fromRecordDiffIdBulk = 0;
  fromRecordDiffIdDown = 0;
  RecordDiffId = 0;
  toRecordDiffTypeId = '';
  toRecordDiffTypeSeqno = '';
  toRecordDiffId = '';
  categoryLevelList = [];
  categoryLevelId = 0;
  parentNameList = [];
  categoryName = '';
  searchParent: FormControl = new FormControl();
  parentId: number;
  allPropertyValues = [];
  allPropertyValuesBulk =[];
  allPropertyValuesDown = [];
  categoryType: number;
  private selectedLevelId: number;
  private attachFile: number;
  propertyLevel: number;
  fromPropLevels = [];
  fromPropLevelsBulk = [];
  fromPropLevelsDown = [];
  fromlevelid: number;
  fromlevelidBulk: number;
  fromlevelidDown: number;
  seqNumber1: number;
  fromRecordDiffName: string;
  fileUploadUrl: string;
  uploadButtonName = 'Upload File';
  attachMsg: string;
  attachment = [];
  formdata: any;
  documentPath: any;
  documentName :any;
  orginalDocumentName:any;
  hideAttachment: boolean;
  fileName:boolean;

  selectedPriority: any;
  selectedPriorityValue: any;
  fromlevelid2: any;
  allPropertyValues2 = [];
  fromPropLevels2 = [];
  priorityValueName: any;
  selectedPriorityValue1: number;
  
  groupSelected: number;
  groupSelected1: number;
  groupName: string;
  groups = [];

  workingList = [];
  workingdiffid = [];
  private workingdiff1: any;
  userName: string;
  searchUser: FormControl = new FormControl();
  users = [];
  userSelected = '';
  userId = 0;
  loginname: string;
  workingLabelName: any;
  workingdiffidBulkUpload: any;
  workingdiffidBulkDownload: any;
  workingdiffidForUpdate: any;


  constructor(private rest: RestApiService, private messageService: MessageService,
              private route: Router, private modalService: NgbModal, private notifier: NotifierService) {


    this.messageService.getCellChangeData().subscribe(item => {
      // console.log(item);
      switch (item.type) {
        case 'delete':
          // console.log('deleted');
          if (!this.del) {
            this.notifier.notify('error', 'You do not have delete permission');
          } else {
            if (confirm('Are you sure?')) {
              // console.log(JSON.stringify(item));
              this.rest.deleteusergroupcategory({id: item.id}).subscribe((res) => {
                this.respObject = res;
                // console.log(JSON.stringify(this.respObject));
                if (this.respObject.success) {
                  this.messageService.sendAfterDelete(item.id);
                  this.totalData = this.totalData - 1;
                  this.messageService.setTotalData(this.totalData);
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
    this.totalPage = 0;
    this.groupSelected = 0;
    this.dataLoaded = true;
    this.fileName = false;
    this.fileUploadUrl = this.rest.apiRoot + '/fileupload';
    this.hideAttachment = true;
    this.workingdiffidBulkUpload = 0;
    this.workingdiffidBulkDownload = 0;
    this.workingdiffidForUpdate = 0;

    this.pageSize = this.messageService.pageSize;
    this.displayData = {
      pageName: 'User With Support Group And Category Mapping',
      openModalButton: 'Add User With Support Group And Category',
      searchModalButton: 'Search',
      breadcrumb: 'User With Support Group And Category Mapping',
      folderName: 'All Modules',
      tabName: 'User With Support Group And Category Mapping'
    };

    const columnDefinitions = [
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
          console.log(args.dataContext);
          this.resetValues();
          this.isError = false;
          this.selectedId = args.dataContext.id;
          this.organizationId = args.dataContext.mstorgnhirarchyid;
          this.fromRecordDiffTypeId = args.dataContext.recorddifftypeid;
          this.fromRecordDiffId = args.dataContext.recorddiffid;
          // this.selectedPriority = args.dataContext.torecorddifftypeid;
          // this.selectedPriorityValue1 = args.dataContext.torecorddiffid;
          this.workingdiffidForUpdate = args.dataContext.categoryid;
          this.groupSelected1 = args.dataContext.groupid;
          this.userId = args.dataContext.userid;
          // console.log("\n this.userId ===   ", this.userId);
          this.userSelected = args.dataContext.userloginname;
          this.userName = args.dataContext.username;
          for (let i = 0; i < this.recordTypeStatus.length; i++) {
            if (this.recordTypeStatus[i].id === Number(this.fromRecordDiffTypeId)) {
              this.recordbydifftype(Number(this.recordTypeStatus[i].seqno));
              break;
            }
          }
          for (let i = 0; i < this.recordTypeStatus.length; i++) {
            if (this.recordTypeStatus[i].id === Number(this.selectedPriority)) {
              this.recordbydifftype2(Number(this.recordTypeStatus[i].seqno), 'u');
              break;
            }
          }
          // console.log("\n this.users ====>>>>>>>    ", this.users);
          // for(let j=0;j<this.users.length;j++){
          //   if(Number(this.users[j].id) === Number(this.userId)){
          //     this.userSelected = this.users[j].loginname;
          //     console.log("\n this.userSelected ====>>>>>>>    ", this.userSelected);
          //     break;
          //   }
          // }
          this.getcategorylevel('u');
          this.getcategorylevel('u');
          this.workingLabelNames(this.fromRecordDiffId, "u");
          this.getGroupData('u');
          this.getUserDetails();
          this.modalReference = this.modalService.open(this.content1, {});
          this.modalReference.result.then((result) => {
          }, (reason) => {
          });
        }
      },
      {
        id: 'clientname', name: 'Client', field: 'clientname', sortable: true, filterable: true
      },
      {
        id: 'mstorgnhirarchyname', name: 'Organization', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'recorddifftypename', name: 'Property Type', field: 'recorddifftypename', sortable: true, filterable: true
      }, 
      {
        id: 'recorddiffname', name: 'Property Value', field: 'recorddiffname', sortable: true, filterable: true
      }, 
      {
        id: 'categoryname', name: 'Working Category', field: 'categoryname', sortable: true, filterable: true
      }, 
      {
        id: 'groupname', name: 'Support Group', field: 'groupname', sortable: true, filterable: true
      }, 
      {
        id: 'username', name: 'User ', field: 'username', sortable: true, filterable: true
      }
    ];

    this.clientId = this.messageService.clientId;
    this.messageService.setColumnDefinitions(columnDefinitions);
    // this.onPageLoad();
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
        // console.log('auth1===' + JSON.stringify(auth));
        this.onPageLoad();
      });
    }

    // console.log("\b BEFORE SEARCH USER......................");
    this.searchUser.valueChanges.subscribe(
      psOrName => {
        const data = {
          loginname: psOrName,
          clientid: Number(this.clientId),
          mstorgnhirarchyid: Number(this.organizationId),
        };
        this.isLoading = true;
        // console.log('psOrName======' + psOrName);
        // console.log('userSelected======' + this.userSelected);
        if (psOrName !== '') {
          this.rest.searchuserbyclientid(data).subscribe((res1) => {
            // console.log('data======' + JSON.stringify(data));
            this.respObject = res1;
            this.isLoading = false;
            if (this.respObject.success) {
              this.users = this.respObject.details;
              // console.log("\n this.users ====  111111111111111 ", this.users);
            } else {
              this.notifier.notify('error', this.respObject.message);
            }
          }, (err) => {
            this.isLoading = false;
            this.notifier.notify('error', this.messageService.SERVER_ERROR);
          });
        } else {
          this.isLoading = false;
          this.userName = '';
          this.users = [];
          this.userSelected = '';
          this.userId = 0;
        }
      });

  }

  tabClick(event) {
    if (event.tab.textLabel === 'Add User With Support Group And Category') {
      this.organizationId = '';
      this.fromRecordDiffTypeId = 0;
      this.fromRecordDiffId = 0;
    } else if (event.tab.textLabel === 'Bulk User With Support Group And Category Upload') {
      this.organizationId = '';
      this.fromRecordDiffTypeIdbulk = 2;
      this.fromRecordDiffIdBulk = 0;
      this.groupSelected = 0;
      this.groupSelected1 = 0;
      this.groups = [];
      this.userSelected = '';
      this.userId = 0;
      this.workingdiffid = [];
      this.workingList = [];
    }
    else if (event.tab.textLabel === 'Bulk User With Support Group And Category Download') {
      this.organizationId = '';
      this.fromRecordDiffTypeIdDown = 2;
      this.fromRecordDiffIdDown = 0;
      this.groupSelected = 0;
      this.groupSelected1 = 0;
      this.groups = [];
      this.userSelected = '';
      this.userId = 0;
      this.workingdiffid = [];
      this.workingList = [];
    }
  }

  onPageLoad() {
    // this.getTableData();
    this.selectedPriority = 0;
    this.selectedPriorityValue = 0;
    this.getorganizationclientwise();
    this.getRecordDiffType();
    this.getRecordDiffTypeBulk();
    this.getRecordDiffTypeDown();
    // this.searchParent.valueChanges.subscribe(
    //   psOrName => {
    //     const data = {
    //       clientid: Number(this.clientId),
    //       mstorgnhirarchyid: Number(this.organizationId),
    //       recorddifftypeid: Number(this.fromRecordDiffTypeId),
    //       recorddiffid: Number(this.fromRecordDiffId),
    //       location: psOrName
    //     };
    //     this.isLoading = true;
    //     if (psOrName !== '') {
    //       this.rest.searchlocation(data).subscribe((res: any) => {
    //         this.isLoading = false;
    //         if (res.success) {
    //           this.parentNameList = res.details.values;
    //         } else {
    //           this.notifier.notify('error', res.message);
    //         }
    //       }, (err) => {
    //         this.isLoading = false;
    //         this.notifier.notify('error', this.messageService.SERVER_ERROR);
    //       });
    //     } else {
    //       this.isLoading = false;
    //       // this.userName = '';
    //       this.parentNameList = [];
    //       this.parentId = 0;
    //     }
    //   });
  }

  openModal(content) {
    this.isError = false;
    // this.notifier.notify('success', 'Module added successfully');
    this.resetValues();
    this.modalService.open(content, {size: 'md'}).result.then((result) => {
    }, (reason) => {

    });
  }

  getTableData() {
    this.getData({
      offset: this.messageService.offset, 
      limit: this.messageService.limit
    });
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
    // console.log(data);
    this.rest.getusergroupcategory(data).subscribe((res) => {
      this.respObject = res;
      // console.log('>>>>>>>>>>> ', JSON.stringify(res));
      this.executeResponse(this.respObject, offset);
    }, (err) => {
      this.dataLoaded = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  executeResponse(respObject, offset) {
    if (respObject.success) {
      this.dataLoaded = true;
      if (offset === 0) {
        this.totalData = respObject.details.total;
      }
      const data = respObject.details.values;
      this.messageService.setTotalData(this.totalData);
      this.messageService.setGridData(data);
    } else {
      this.notifier.notify('error', respObject.message);
    }
  }

  onPageSizeChange(value: any) {
    this.pageSize = value;
    this.getData({
      offset: this.messageService.offset, 
      limit: this.messageService.limit
    });
  }

  getRecordDiffType() {
    this.rest.getRecordDiffType().subscribe((res: any) => {
      if (res.success) {
        res.details.unshift({id: 0, typename: 'Select Property Type'});
        this.recordTypeStatus = res.details;
        this.fromRecordDiffTypeId = 0;
      }
    });
  }

  getRecordDiffTypeBulk() {
    this.rest.getRecordDiffType().subscribe((res: any) => {
      if (res.success) {
        res.details.unshift({id: 0, typename: 'Select Property Type'});
        this.recordTypeStatusBulk = res.details;
        this.fromRecordDiffTypeIdbulk = 2;
      }
    });
  }

  getRecordDiffTypeDown() {
    this.rest.getRecordDiffType().subscribe((res: any) => {
      if (res.success) {
        res.details.unshift({id: 0, typename: 'Select Property Type'});
        this.recordTypeStatusDown = res.details;
        this.fromRecordDiffTypeIdDown = 2;
      }
    });
  }

  resetValues() {
    this.organizationId = '';
    this.orgId = '';
    this.orgId = '';
    this.categoryLevelId = 0;
    this.toRecordDiffTypeId = '';
    this.categoryName = '';
    this.fromlevelid = 0;
    this.fromlevelidBulk = 0;
    this.fromlevelidDown = 0;
    this.parentId = 0;
    this.fromRecordDiffTypeId = 0;
    this.fromRecordDiffTypeIdbulk = 2;
    this.fromRecordDiffTypeIdDown = 2;
    this.RecordDiffTypeId = 0;
    this.RecordDiffId = 0;
    this.fromRecordDiffId = 0;
    this.fromRecordDiffIdBulk = 0;
    this.fromRecordDiffIdDown = 0;
    this.selectedLevelId = 0;
    this.categoryLevelList = [];
    this.fromPropLevels = [];
    this.fromPropLevelsBulk = [];
    this.fromPropLevelsDown = [];
    this.allPropertyValuesBulk = [];
    this.allPropertyValuesDown = [];
    this.hideAttachment = true;
    this.attachment = [];
    this.documentName='';
    this.orginalDocumentName = '';
    this.fileName = false;
    
    this.selectedPriority = 0;
    this.selectedPriorityValue = 0;
    this.fromlevelid2 = 0;
    this.fromPropLevels2 = [];
    this.allPropertyValues2 = [];
    this.allPropertyValues = [];
    this.groupSelected = 0;
    this.groupSelected1 = 0;
    this.groups = [];
    this.userSelected = '';
    this.userId = 0;
    this.workingdiffid = [];
    this.workingList = [];
    this.workingdiffidBulkUpload = 0;
    this.workingdiffidBulkDownload = 0;
    this.workingdiffidForUpdate = 0;

  }

  getrecordbydifftype(index) {
    // console.log(index);
    if (index !== 0) {
      const seqNumber = this.recordTypeStatus[index].seqno;
      this.recordbydifftype(seqNumber);
      this.fromlevelid = 0;
      this.fromRecordDiffId = 0;
      this.allPropertyValues = [];
    }
  }

  getrecordbydifftypeBulk(index) {
    // console.log(index);
    if (index !== 0) {
      const seqNumber = this.recordTypeStatusBulk[index].seqno;
      this.recordbydifftypeBulk(seqNumber);
      this.fromlevelidBulk = 0;
      this.fromRecordDiffIdBulk = 0;
      this.allPropertyValuesBulk = [];
    }
  }
  getrecordbydifftypeDown(index) {
    // console.log(index);
    if (index !== 0) {
      const seqNumber = this.recordTypeStatusDown[index].seqno;
      this.recordbydifftypeDown(seqNumber);
      this.fromlevelidDown = 0;
      this.fromRecordDiffIdDown = 0;
      this.allPropertyValuesDown = [];
    }
  }

  onTicketTypeChange(index, type) {
    if (index !== 0) {
      this.fromRecordDiffName = this.allPropertyValues[index - 1].typename;
    }
    this.getcategorylevel('i');
    this.workingLabelNames(index, type);
  }

  onTicketTypeChangeBulk(index, type) {
    if (index !== 0) {
      this.fromRecordDiffName = this.allPropertyValuesBulk[index - 1].typename;
    }
    this.workingLabelNamesBulk(index, type)
  }

  onTicketTypeChangeDown(index, type) {
    if (index !== 0) {
      this.fromRecordDiffName = this.allPropertyValuesDown[index - 1].typename;
    }
    this.workingLabelNamesDown(index, type)
  }

  recordbydifftype(seqNumber) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      seqno: Number(seqNumber),
    };
    this.rest.getcategorylevel(data).subscribe((res: any) => {
      if (res.success) {
        if (res.details.length > 0) {
          res.details.unshift({id: 0, typename: 'Select Property Level', seqno: 0});
          this.fromPropLevels = res.details;
        } else {
          this.fromPropLevels = [];
          this.getPropertyValue(Number(seqNumber));
        }
      } else {
        this.notifier.notify('error', res.message);

      }
    }, (err) => {
      console.log(err);
    });
  }

  recordbydifftypeBulk(seqNumber) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      seqno: Number(seqNumber),
    };
    this.rest.getcategorylevel(data).subscribe((res: any) => {
      if (res.success) {
        if (res.details.length > 0) {
          res.details.unshift({id: 0, typename: 'Select Property Level', seqno: 0});
          this.fromPropLevelsBulk = res.details;
        } else {
          this.fromPropLevelsBulk = [];
          // this.getPropertyValueBulk(Number(seqNumber));
        }
      } else {
        this.notifier.notify('error', res.message);

      }
    }, (err) => {
      console.log(err);
    });
  }

  recordbydifftypeDown(seqNumber) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      seqno: Number(seqNumber),
    };
    this.rest.getcategorylevel(data).subscribe((res: any) => {
      if (res.success) {
        if (res.details.length > 0) {
          res.details.unshift({id: 0, typename: 'Select Property Level', seqno: 0});
          this.fromPropLevelsDown = res.details;
        } else {
          this.fromPropLevelsDown = [];
          // this.getPropertyValueBulk(Number(seqNumber));
        }
      } else {
        this.notifier.notify('error', res.message);

      }
    }, (err) => {
      console.log(err);
    });
  }

  getPropertyValue(seq) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      seqno: Number(seq)
    };
    this.rest.getrecordbydifftype(data).subscribe((res: any) => {
      if (res.success) {
        this.allPropertyValues = res.details;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getPropertyValueBulk(seq) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      seqno: Number(seq)
    };
    this.rest.getrecordbydifftype(data).subscribe((res: any) => {
      if (res.success) {
        this.allPropertyValuesBulk = res.details;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getPropertyValueDown(seq) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      seqno: Number(seq)
    };
    this.rest.getrecordbydifftype(data).subscribe((res: any) => {
      if (res.success) {
        this.allPropertyValuesDown = res.details;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onLevelChange(index) {
    let seq;
    seq = this.fromPropLevels[index - 1].seqno;
    this.getPropertyValue(seq);
    this.fromRecordDiffId = 0;
  }

  onLevelChangeBulk(index) {
    let seq;
    seq = this.fromPropLevelsBulk[index - 1].seqno;
    this.getPropertyValueBulk(seq);
    this.fromRecordDiffIdBulk = 0;
  }

  onLevelChangeDown(index) {
    let seq;
    seq = this.fromPropLevelsDown[index - 1].seqno;
    this.getPropertyValueDown(seq);
    this.fromRecordDiffIdDown = 0;
  }


  save() {
    if (this.fromPropLevels.length > 0) {
      this.fromRecordDiffTypeId = Number(this.fromlevelid);
    }
    const data = {
      "clientid": Number(this.clientId),
      "mstorgnhirarchyid": Number(this.organizationId),
      "recorddifftypeid": Number(this.fromRecordDiffTypeId),
      "recorddiffid": Number(this.fromRecordDiffId),
      "workingcategories": this.workingdiffid,
      "groupid": Number(this.groupSelected),
      "refuserid": Number(this.userId)
    };
    // console.log('>>>>>>>>>>> ', JSON.stringify(data));
    if (!this.messageService.isBlankField(data)) {
      this.rest.addusergroupcategory(data).subscribe((res: any) => {
        this.respObject = res;
        if (this.respObject.success) {
          const id = this.respObject.details;
          this.isError = false;
          this.resetValues();
          this.getTableData();
          this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
        } else {
          //this.isError = true;
          this.notifier.notify('error',this.respObject.message);
        }
      }, (err) => {
        //this.isError = true;
        this.notifier.notify('error',this.messageService.SERVER_ERROR);
      });
    } else {
      //this.isError = true;
      this.notifier.notify('error',this.messageService.BLANK_ERROR_MESSAGE);
    }
  }

  update() {
    const data = {
      "id": Number(this.selectedId),
      "clientid": Number(this.clientId),
      "mstorgnhirarchyid": Number(this.organizationId),
      "recorddifftypeid": Number(this.fromRecordDiffTypeId),
      "recorddiffid": Number(this.fromRecordDiffId),
      "categoryid": Number(this.workingdiffidForUpdate),
      "groupid": Number(this.groupSelected),
      "refuserid": Number(this.userId)
    };
    // console.log('>>>>>>>>>>> ||||||    ', JSON.stringify(data));

    if (!this.messageService.isBlankField(data)) {
      this.rest.updateusergroupcategory(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          this.getTableData();
          this.notifier.notify('success', this.messageService.EDIT_SUCCESS);
        } else {
          //this.isError = true;
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        //this.isError = true;
        this.notifier.notify('error',this.messageService.SERVER_ERROR);
      });
    } else {
      //this.isError = true;
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }
  }

  getorganizationclientwise() {
    const data = {
      clientid: Number(this.clientId) , 
      mstorgnhirarchyid: Number(this.loginUserOrganizationId)
    };
    this.rest.getorganizationclientwisenew(data).subscribe((res: any) => {
      if (res.success) {
        this.organizationList = res.details;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      console.log(err);
    });
  }

  // getcategorylevel(flag = 0) {
  //   const data = {
  //     clientid: this.clientId,
  //     mstorgnhirarchyid: Number(this.organizationId)
  //   };
  //   this.rest.getcategorylevel(data).subscribe((res: any) => {
  //     if (res.success) {
  //       res.details.unshift({id: 0, typename: 'Select Property Level'});
  //       this.categoryLevelList = res.details;
  //       if (flag === 1) {
  //         // this.getdifferentiationname();
  //         this.categoryLevelId = this.selectedLevelId;
  //         if (this.recordDifTypeId > 0 || Number(this.fromlevelid) > 0) {
  //           this.getPropertyValue(Number(this.seqNumber));
  //         }
  //       } else {
  //         this.categoryLevelId = 0;
  //       }
  //     } else {
  //       this.notifier.notify('error', res.message);
  //     }
  //   }, (err) => {
  //   });
  // }

  onOrganizationChange() {
    // this.getcategorylevel('i');
    this.formdata = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': Number(this.organizationId)
    };
    this.getPropertyValueBulk(1);
    this.getPropertyValueDown(1);
    this.getGroupData('i');
  }

  getcategorylevel(type) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      // fromrecorddifftypeid:Number(this.fromRecordDiffTypeId),
      fromrecorddiffid: Number(this.fromRecordDiffId)
    };
    if (this.fromPropLevels.length > 0) {
      data['fromrecorddifftypeid'] = Number(this.fromlevelid);
    } else {
      data['fromrecorddifftypeid'] = Number(this.fromRecordDiffTypeId);
    }
    this.rest.getlabelbydiffid(data).subscribe((res: any) => {
      if (res.success) {
        res.details.unshift({id: 0, typename: 'Select Property Level'});
        this.categoryLevelList = res.details;
        if (type === 'i') {
          this.categoryLevelId = 0;
        } else {
          this.categoryLevelId = this.propertyLevel;
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
    });
  }

  

  // getdifferentiationname() {
  //   const data = {
  //     clientid: this.clientId,
  //     mstorgnhirarchyid: Number(this.organizationId),
  //     recorddifftypeid: Number(this.categoryLevelId)
  //   };
  //   this.rest.getdifferentiationname(data).subscribe((res: any) => {
  //     if (res.success) {
  //       this.parentNameList = res.details.values;
  //     }
  //   }, (err) => {
  //   });
  // }


  // getParentDetails() {
  //   let match = false;
  //   for (let i = 0; i < this.parentNameList.length; i++) {
  //     if (this.parentNameList[i].recorddiffname === this.searchedLocation) {
  //       this.parentId = this.parentNameList[i].id;
  //       match = true;
  //       break;
  //     }
  //   }
  //   if (!match) {
  //     this.parentId = 0;
  //   }
  // }

  Bulksave() {
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid : Number(this.organizationId),
      recorddifftypeid: Number(this.fromRecordDiffTypeIdbulk),
      recorddiffid: Number(this.fromRecordDiffIdBulk),
      categoryid: Number(this.workingdiffidBulkUpload),
      uploadedfilename : this.documentName,
      originalfilename: this.orginalDocumentName
    };

    // console.log("\n Data is ===>>>>>   ", JSON.stringify(data));
    
    if (!this.messageService.isBlankField(data)) {
      this.dataLoaded = false;
      this.rest.bulkusergroupcategoryupload(data).subscribe((res: any) => {
        this.respObject = res;
        if (this.respObject.success) {
          const id = this.respObject.details;
          this.isError = false;
          this.resetValues();
          this.dataLoaded = true;
          this.getTableData()
          this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
        } else {
          // this.isError = true;
          this.dataLoaded = true;
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        // this.isError = true;
        this.dataLoaded = true;
        this.notifier.notify('error',this.messageService.SERVER_ERROR);
      });
    } else {
      // this.isError = true;
      this.dataLoaded = true;
      this.notifier.notify('error',this.messageService.BLANK_ERROR_MESSAGE);
    }
  }

  download() {
    
    //console.log("Upload= ",uploadname,"Download= ", originalname)
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid : Number(this.organizationId),
      recorddifftypeid: Number(this.fromRecordDiffTypeIdDown),
      recorddiffid: Number(this.fromRecordDiffIdDown),
      categoryid: Number(this.workingdiffidBulkDownload)
    };

    // console.log("\n Data is ===>>>>>   ", JSON.stringify(data));
    
    if (!this.messageService.isBlankField(data)) {
      this.rest.bulkusergroupcategorydownload(data).subscribe((res: any) => {
        this.respObject = res;
        if (this.respObject.success) {
          const uploadname = this.respObject.uploadedfilename;
          const originalname = this.respObject.originalfilename;
          this.downloadFile(uploadname,originalname)
          this.isError = false;
          this.resetValues();
          this.notifier.notify('success', this.messageService.DOWNLOAD_SUCCESS);
        } else {
          // this.isError = true;
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        // this.isError = true;
        this.notifier.notify('error',this.messageService.SERVER_ERROR);
      });
    } else {
      // this.isError = true;
      this.notifier.notify('error',this.messageService.BLANK_ERROR_MESSAGE);
    }
  }

  downloadFile(uploadname, originalname) {
    const data = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': Number(this.organizationId),
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

  onFileComplete(data: any) {
    // this.logoName = data.changedName;
    if (data.success) {
      this.fileName = true;
      this.hideAttachment = false;
      this.attachment.push({originalName: data.details.originalfile, fileName: data.details.filename});
      // console.log(JSON.stringify(this.attachment));
      if (this.attachment.length > 1) {
        this.attachMsg = this.attachment.length + ' files uploaded successfully';
      } else {
        this.attachMsg = this.attachment.length + ' file uploaded successfully';
      }

      this.documentName = data.details.filename;
      this.documentPath = data.details.path;
      this.orginalDocumentName = data.details.originalfile;

    }
  }

  onFileError(msg: string) {
    this.notifier.notify('error', msg);
  }

  onUpload(data: any) {
    this.dataLoaded = data.loader;
  }

  onRemove() {
    this.attachFile = this.attachFile - 1;
  }

  onPriorityChange(selectedIndex){
    if (selectedIndex !== 0) {
      const seqNumber = this.recordTypeStatus[selectedIndex].seqno;
      this.recordbydifftype2(seqNumber, 'i');
      this.fromlevelid2 = 0;
      this.selectedPriorityValue = 0;
      this.allPropertyValues2 = [];
    }
  }

  recordbydifftype2(seqNumber, type) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      seqno: Number(seqNumber),
    };
    this.rest.getcategorylevel(data).subscribe((res: any) => {
      if (res.success) {
        if (res.details.length > 0) {
          res.details.unshift({id: 0, typename: 'Select Property Level', seqno: 0});
          this.fromPropLevels2 = res.details;
        } else {
          this.fromPropLevels2 = [];
          this.getPropertyValue2(Number(seqNumber), type);
        }
      } else {
        this.notifier.notify('error', res.message);

      }
    }, (err) => {
      console.log(err);
    });
  }

  getPropertyValue2(seq, type) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      seqno: Number(seq)
    };
    this.rest.getrecordbydifftype(data).subscribe((res: any) => {
      if (res.success) {
        this.allPropertyValues2 = res.details;
        if(type === 'i'){
          this.selectedPriorityValue = 0;
        } else {
          this.selectedPriorityValue = this.selectedPriorityValue1;
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }


  onPriorityValueChange(selectedIndex){
    if(selectedIndex != 0){
      this.priorityValueName = this.allPropertyValues2[selectedIndex - 1].typename;
    }
    this.getcategorylevel2('i');
  }

  getcategorylevel2(type) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      // fromrecorddifftypeid:Number(this.fromRecordDiffTypeId),
      fromrecorddiffid: Number(this.fromRecordDiffId)
    };
    if (this.fromPropLevels.length > 0) {
      data['fromrecorddifftypeid'] = Number(this.fromlevelid);
    } else {
      data['fromrecorddifftypeid'] = Number(this.fromRecordDiffTypeId);
    }
    this.rest.getlabelbydiffid(data).subscribe((res: any) => {
      if (res.success) {
        res.details.unshift({id: 0, typename: 'Select Property Level'});
        this.categoryLevelList = res.details;
        if (type === 'i') {
          this.categoryLevelId = 0;
        } else {
          this.categoryLevelId = this.propertyLevel;
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
    });
  }



  getGroupData(type) {
    this.rest.getgroupbyorgid({
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.organizationId)
    }).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.groups = this.respObject.details;
        this.selectAll(this.groups);
        if (type === 'i') {
          this.groupSelected = 0;
        } else {
          this.groupSelected = this.groupSelected1;
        }
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }


  onSupportGrpChange(selectedIndex){
    // console.log(selectedIndex);
    this.groupName = this.groups[selectedIndex - 1].supportgroupname;
  }


  workingLabelNames(index, type){
    const data = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': Number(this.organizationId),
      'forrecorddiffid': Number(this.fromRecordDiffId)
    };
    if (type === 'm') {
      data['forrecorddifftypeid'] = Number(this.fromRecordDiffTypeId);
    } else {
      data['forrecorddifftypeid'] = Number(this.fromRecordDiffTypeId);
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

  workingLabelNamesBulk(index, type){
    const data = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': Number(this.organizationId),
      'forrecorddiffid': Number(this.fromRecordDiffIdBulk)
    };
    if (type === 'm') {
      data['forrecorddifftypeid'] = Number(this.fromRecordDiffTypeIdbulk);
    } else {
      data['forrecorddifftypeid'] = Number(this.fromRecordDiffTypeIdbulk);
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


  workingLabelNamesDown(index, type){
    const data = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': Number(this.organizationId),
      'forrecorddiffid': Number(this.fromRecordDiffIdDown)
    };
    if (type === 'm') {
      data['forrecorddifftypeid'] = Number(this.fromRecordDiffTypeIdDown);
    } else {
      data['forrecorddifftypeid'] = Number(this.fromRecordDiffTypeIdDown);
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



  onCategoryChange(selectedIndex){
    this.workingLabelName = this.workingList[selectedIndex - 1].name;
  }



  selectAll(items: any[]) {
    let allSelect = items => {
      items.forEach(element => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }

  getUserDetails() {
    // console.log('this.users=====' + JSON.stringify(this.users));
    for (let i = 0; i < this.users.length; i++) {
      // console.log('this.users[i].loginname=====' + JSON.stringify(this.users[i].loginname));
      console.log('\n this.userSelected=====' + this.userSelected);
      if (this.users[i].loginname === this.userSelected) {
        // console.log('++++');
        this.userId = this.users[i].id;
        console.log('\n this.userId==' + this.userId);
        this.userName = this.users[i].name;
        this.loginname = this.users[i].loginname;
        break
      }
    }
  }




  

}

