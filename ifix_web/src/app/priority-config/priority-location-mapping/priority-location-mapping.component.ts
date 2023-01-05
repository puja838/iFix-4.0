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
  selector: 'app-priority-location-mapping',
  templateUrl: './priority-location-mapping.component.html',
  styleUrls: ['./priority-location-mapping.component.css']
})
export class PriorityLocationMappingComponent implements OnInit {

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
  fromRecordDiffTypeId = 0;
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
  searchedLocation = '';
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
              this.rest.deletelocation({id: item.id}).subscribe((res) => {
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
    this.dataLoaded = true;
    this.fileName = false;
    this.fileUploadUrl = this.rest.apiRoot + '/fileupload';
    this.hideAttachment = true;

    this.pageSize = this.messageService.pageSize;
    this.displayData = {
      pageName: 'Priority Location Mapping',
      openModalButton: 'Add Priority With Location',
      searchModalButton: 'Search',
      breadcrumb: 'Priority Location Mapping',
      folderName: 'All Modules',
      tabName: 'Priority Location Mapping'
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
          this.resetValues();
          this.isError = false;
          this.selectedId = args.dataContext.id;
          this.organizationId = args.dataContext.mstorgnhirarchyid;
          this.fromRecordDiffTypeId = args.dataContext.recorddifftypeid;
          this.fromRecordDiffId = args.dataContext.recorddiffid;
          this.selectedPriority = args.dataContext.torecorddifftypeid;
          this.selectedPriorityValue1 = args.dataContext.torecorddiffid;
          this.searchedLocation = args.dataContext.location;
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
          this.getcategorylevel('u');
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
        id: 'torecorddifftypename', name: 'To Property Type', field: 'torecorddifftypename', sortable: true, filterable: true
      }, 
      {
        id: 'torecorddiffname', name: 'To Property Value', field: 'torecorddiffname', sortable: true, filterable: true
      }, 
      {
        id: 'location', name: 'Location ', field: 'location', sortable: true, filterable: true
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

  }

  tabClick(event) {
    if (event.tab.textLabel === 'Add Priority With Location') {
      this.organizationId = '';
      this.fromRecordDiffTypeId = 0;
      this.fromRecordDiffId = 0;
    } else if (event.tab.textLabel === 'Bulk Priority With Location Upload') {
      this.organizationId = '';
      this.fromRecordDiffTypeIdbulk = 2;
      this.fromRecordDiffIdBulk = 0;
    }
    else if (event.tab.textLabel === 'Bulk Priority With Location Download') {
      this.organizationId = '';
      this.fromRecordDiffTypeIdDown = 2;
      this.fromRecordDiffIdDown = 0;
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
    this.getData({offset: 0, limit: this.pageSize});
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
    this.rest.getlocation(data).subscribe((res) => {
      this.respObject = res;
      // console.log('>>>>>>>>>>> ', JSON.stringify(res));
      this.executeResponse(this.respObject, offset);
    }, (err) => {
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
    this.getData({offset: 0, limit: this.pageSize});
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
    this.searchedLocation = '';
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
    this.searchedLocation = '';
    this.fromPropLevels2 = [];
    this.allPropertyValues2 = [];
    this.allPropertyValues = [];
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

  onTicketTypeChange(index) {
    if (index !== 0) {
      this.fromRecordDiffName = this.allPropertyValues[index - 1].typename;
    }
    this.getcategorylevel('i');
  }

  onTicketTypeChangeBulk(index) {
    if (index !== 0) {
      this.fromRecordDiffName = this.allPropertyValuesBulk[index - 1].typename;
    }
  }

  onTicketTypeChangeDown(index) {
    if (index !== 0) {
      this.fromRecordDiffName = this.allPropertyValuesDown[index - 1].typename;
    }
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
      "torecorddifftypeid": Number(this.selectedPriority),
      "torecorddiffid": Number(this.selectedPriorityValue),
      "location": this.searchedLocation
    };
    // console.log('>>>>>>>>>>> ', JSON.stringify(data));
    if (!this.messageService.isBlankField(data)) {
      this.rest.addlocation(data).subscribe((res: any) => {
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
      "torecorddifftypeid": Number(this.selectedPriority),
      "torecorddiffid": Number(this.selectedPriorityValue),
      "location": this.searchedLocation
    };

    if (!this.messageService.isBlankField(data)) {
      this.rest.updatelocation(data).subscribe((res) => {
        if (this.searchedLocation === '') {
          data['parentid'] = Number(this.parentId);
        }
        data['seqno'] = 0;
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


  getParentDetails() {
    let match = false;
    for (let i = 0; i < this.parentNameList.length; i++) {
      if (this.parentNameList[i].recorddiffname === this.searchedLocation) {
        this.parentId = this.parentNameList[i].id;
        match = true;
        break;
      }
    }
    if (!match) {
      this.parentId = 0;
    }
  }

  Bulksave() {
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid : Number(this.organizationId),
      recorddifftypeid: Number(this.fromRecordDiffTypeIdbulk),
      recorddiffid: Number(this.fromRecordDiffIdBulk),
      uploadedfilename : this.documentName,
      originalfilename: this.orginalDocumentName
    };

    // console.log("\n Data is ===>>>>>   ", JSON.stringify(data));
    if (!this.messageService.isBlankField(data)) {
      this.dataLoaded = false;
      this.rest.priorityupload(data).subscribe((res: any) => {
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
      'clientid': this.clientId,
      'mstorgnhirarchyid': Number(this.organizationId),
      'recorddiffid': Number(this.fromRecordDiffIdDown),
    };
    if (!this.messageService.isBlankField(data)) {
      this.rest.prioritydownload(data).subscribe((res: any) => {
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

  

}
