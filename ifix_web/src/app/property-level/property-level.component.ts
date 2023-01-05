import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {RestApiService} from '../rest-api.service';
import {Filters, Formatters, OnEventArgs} from 'angular-slickgrid';
import {MessageService} from '../message.service';
import {CustomInputEditor} from '../custom-inputEditor';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-property-level',
  templateUrl: './property-level.component.html',
  styleUrls: ['./property-level.component.css']
})
export class PropertyLevelComponent implements OnInit {
  displayed = true;
  totalData = 0;
  show: boolean;
  selected: number;
  respObject: any;
  clientSelected: number;
  clients: any[];
  role: any[];
  roleName: string;
  roleSelected: number;
  actions: any[];
  displayData: any;
  add = false;
  del = false;
  edit = false;
  view = false;
  isError = false;
  errorMessage: string;

  //notAdmin = true;
  private clientName: any;
  private notifier: NotifierService;
  private baseFlag: any;
  collectionSize: number;
  pageSize: number;
  private userAuth: Subscription;
  private adminAuth: Subscription;
  dataLoaded: boolean;
  isLoading = false;
  roleSelect: any;
  rolesAction: any;
  name: string;
  organaisation = [];
  orgSelected: any;
  private orgName: any;
  // notAdmin: boolean;
  clientId: number;
  orgId: any;
  @ViewChild('content') private content;

  organization = [];
  category: string;
  ticket : string;
  sequence: any;
  modalReference: any;
  editorgSelected: any;
  editcategory = '';
  editsequence = 0;
  editCategoryId: any;
  recordTypeStatus = [];
  fromRecordDiffTypeSeqno: number;
  fromRecordDiffTicketTypeSeqno : any;
  private parentname: string;
  parentTicketname: any;
  ticketTypeList = [];
  ticketType :any;
  seqNumber: any;
  recordDifTypeName:any;
  fromPropLevels = [];
  fromlevelid: any;
  ticketTypeName: any;
  updateFlag:boolean

  constructor(private rest: RestApiService, private messageService: MessageService,
    private route: Router, private modalService: NgbModal, notifier: NotifierService) {
    this.notifier = notifier;
    this.messageService.getCellChangeData().subscribe(item => {
    switch (item.type) {
    case 'change':
    // console.log('changed');
    if (!this.edit) {
      this.notifier.notify('error', 'You do not have edit permission');
    } else {

    }
    break;
    case 'delete':
    // console.log('deleted');
    // if (this.baseFlag) {
    if (!this.del) {
      this.notifier.notify('error', 'You do not have delete permission');
    } else {
      if (confirm('Are you sure?')) {
        this.deleteItem(item);
      }
    }
    // } else {
    //     if (!this.messageService.del) {
    //         this.notifier.notify('error', 'You do not have delete permission');
    //     } else {
    //         if (confirm('Are you sure?')) {
    //             this.deleteItem(item);
    //         }
    //     }
    // }
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


   deleteItem(item) {
    this.rest.deleterecorddifftypeandrecordtype({id: item.id}).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.messageService.sendAfterDelete(item.id);
        this.totalData = this.totalData - 1;
        this.messageService.setTotalData(this.totalData);
        this.notifier.notify('success', this.messageService.DELETE_SUCCESS);
      } else {
        this.notifier.notify('error', this.respObject.errorMessage);
      }
    }, (err) => {
      this.notifier.notify('error', this.respObject.errorMessage);
    });
  }

  ngOnInit(): void {
    this.dataLoaded = true;
    // console.log(this.messageService.pageSize);
    this.pageSize = this.messageService.pageSize;

    this.displayData = {
      pageName: 'Level of Property',
      openModalButton: 'Add Property Level',
      breadcrumb: 'PropertyLevel',
      searchModalButton: 'Search',

      folderName: 'Property Level',
      tabName: 'Property List',
      exportBtn: 'Export to excel'
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
      // {
      //   id: 'edit',
      //   field: 'id',
      //   excludeFromHeaderMenu: true,
      //   formatter: Formatters.editIcon,
      //   minWidth: 30,
      //   maxWidth: 30,
      //   onCellClick: (e: Event, args: OnEventArgs) => {
      //     console.log(args.dataContext);
      //     this.editCategoryId = args.dataContext.id;
      //     this.clientId = args.dataContext.clientid
      //     this.orgSelected = args.dataContext.mstorgnhirarchyid;
      //     this.category = args.dataContext.typename;
      //     this.sequence = args.dataContext.seqno;
      //     const parentid= args.dataContext.parentid;
      //     this.fromRecordDiffTypeSeqno = Number(parentid+1);
      //     this.fromRecordDiffTicketTypeSeqno = args.dataContext.fromrecorddifftypeid;
      //     this.ticketType = args.dataContext.fromrecorddiffid;
      //     this.orgName = args.dataContext.mstorgnhirarchyname
      //     this.updateFlag = true;
      //     this.modalReference = this.modalService.open(this.content, {});
      //   }
      // },
      {
        id: 'client', name: 'Client ', field: 'clientname', sortable: true, filterable: true
      },
      {
        id: 'orgn', name: 'Organization', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'fromrecorddifftypename', name: 'From Property Type ', field: 'fromrecorddifftypename', sortable: true, filterable: true
      },
      {
        id: 'fromrecorddiffname', name: 'From Property ', field: 'fromrecorddiffname', sortable: true, filterable: true
      },
      {
        id: 'torecorddifftypename', name: 'To Property Type ', field: 'torecorddifftypename', sortable: true, filterable: true
      },
      {
        id: 'torecorddiffname', name: 'To Property', field: 'torecorddiffname', sortable: true, filterable: true
      }
    ];
    this.messageService.setColumnDefinitions(columnDefinitions);
    // this.onPageLoad();
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.orgId = this.messageService.orgnId;
      this.baseFlag = this.messageService.baseFlag;
      this.edit = this.messageService.edit;
      this.del = this.messageService.del;
      this.onPageLoad();
    } else {
      this.userAuth = this.messageService.getClientUserAuth().subscribe(auth => {
        // this.view = auth[0].viewFlag;
        // this.add = auth[0].addFlag;
        this.edit = auth[0].editFlag;
        this.del = auth[0].deleteFlag;
        this.clientId = auth[0].clientid;
        this.orgId = auth[0].mstorgnhirarchyid;
        this.baseFlag = auth[0].baseFlag;
        //console.log('auth1===' + JSON.stringify(auth));
        this.onPageLoad();
      });
    }

  }

  onorgchange(index: any) {
    this.orgName = this.organization[index].organizationname;
    if (this.fromRecordDiffTicketTypeSeqno > 0 || Number(this.fromlevelid) > 0) {
      this.getPropertyValue(Number(this.seqNumber));
    }
  }

  onPageLoad() {
    // console.log(this.clientId + '=====' + this.baseFlag);
    this.getOrganization(this.clientId, this.orgId);
    this.rest.getRecordDiffType().subscribe((res: any) => {
      if (res.success) {
        // res.details.unshift({id: 0, typename: 'Select Property Type'});
        this.recordTypeStatus = res.details;
        this.fromRecordDiffTypeSeqno = 0;
        this.fromRecordDiffTicketTypeSeqno = 0;
      } else {
        this.isError = true;
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      // this.isError = true;
      // this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }


  openModal(content) {
    // for (let j = 0; j < this.actions.length; j++) {
    //     this.actions[j].checked = false;
    // }
    // if (this.baseFlag) {
    this.reset();
    this.updateFlag = false;
    this.modalService.open(content).result.then((result) => {
    }, (reason) => {
    });
    // } else {
    // if (!this.messageService.add) {
    //     this.notifier.notify('error', 'You do not have add permission');
    // } else {
    //     this.roleSelected = 0;

    //     this.modalService.open(content, {size: 'sm'}).result.then((result) => {
    //     }, (reason) => {

    //     });
    // }
    //}
  }


  get selectedOptions() {
    return this.actions
      .filter(opt => opt.checked)
      .map(opt => opt.id);

  }


  changeRouting(path: string) {
    this.messageService.changeRouting(path);
  }

  save() {
    // if (this.notAdmin) {
    //   this.clientSelected = this.clientId;
    // }
    const data = {
      "clientid":this.clientId,
      "mstorgnhirarchyid":Number(this.orgSelected),
      "typename": this.category,
      "seqno": Number(this.sequence),
      "parentid": Number(this.fromRecordDiffTypeSeqno),
      "fromrecorddifftypeid":Number(this.fromRecordDiffTicketTypeSeqno),
      "fromrecorddiffid":Number(this.ticketType),
    };
    console.log(JSON.stringify(data))
    if (Number(this.sequence) > 99) {
      this.rest.addrecorddifftypeandrecordtype(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.modalService.dismissAll();
          const id = this.respObject.details;
            // this.messageService.setRow({
            //   id: id,
              
            //   mstorgnhirarchyname: this.orgName,
            //   parentname: this.parentname,
            //   typename: this.category,
            //   seqno: this.sequence
            // });
            this.getTableData();
            this.totalData = this.totalData + 1;
            this.messageService.setTotalData(this.totalData);
          this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
          this.reset();
        } else {
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    } else {
      this.notifier.notify('error', this.messageService.CATEGORY_LEVEL_SEQ);
      // this.isError = true;
    }
  }

  reset() {
    this.orgSelected = 0;
    this.fromRecordDiffTypeSeqno = 0;
    this.fromRecordDiffTicketTypeSeqno = 0;
    this.ticketType= '';
    this.category = '';
    this.sequence = '';
  }

  getData(paginationObj) {
    const offset = paginationObj.offset;
    const limit = paginationObj.limit;
    this.dataLoaded = false;
    const data = {
      clientid: this.clientId,
      parentid: 1,
      mstorgnhirarchyid: this.messageService.orgnId,
      'offset': offset,
      'limit': limit
    };
    this.rest.getrecordtypemap(data).subscribe((res) => {
      this.respObject = res;
      this.executeResponse(this.respObject, offset);
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getOrganization(clientId, orgId) {
    const data = {
      clientid: Number(clientId) , 
      mstorgnhirarchyid: Number(orgId)
    };
    this.rest.getorganizationclientwisenew(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, organizationname: 'Select Organization'});
        this.organization = this.respObject.details;
        this.orgSelected = 0;
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.isError = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  // onClientChange(value: any) {
  //   this.clientName = this.clients[value].name;
  //   this.getOrganization(this.clientSelected);
  // }

  getTableData() {
    this.getData({
      offset: this.messageService.offset, 
      limit: this.messageService.limit
    });
  }

  // isEmpty(obj) {
  //   for (const key in obj) {
  //     if (obj.hasOwnProperty(key)) {
  //       return false;
  //     }
  //   }
  //   return true;
  // }


  executeResponse(respObject, offset) {
    //console.log('>>>>>>>>>>>>>>>>>>>>>> SAGAR', JSON.stringify(respObject));
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

  ngOnDestroy(): void {
    if (this.userAuth) {
      this.userAuth.unsubscribe();
    }
  }

  update() {
    const data = {
      id: this.editCategoryId,
      clientid: this.clientId,
      mstorgnhirarchyid: this.orgSelected,
      parentid: Number(this.fromRecordDiffTypeSeqno),
      typename: this.category,
      seqno: Number(this.sequence),
      fromrecorddifftypeid: Number(this.fromRecordDiffTicketTypeSeqno),
      fromrecorddiffid: Number(this.ticketType)
    };
    if (!this.messageService.isBlankField(data)) {

      // this.data.password = CryptoJS.AES.encrypt(this.password, this.messageService.SECRET_TOKEN).toString();
      this.rest.updaterecorddifftypeandrecordtype(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.modalService.dismissAll();
          this.isError = false;
          this.messageService.sendAfterDelete(this.editCategoryId);
          this.dataLoaded = true;
          // this.messageService.setRow({
          //   id: this.editCategoryId,
          //   mstorgnhirarchyname: this.orgName,
          //   typename: this.editcategory,
          //   seqno: this.editsequence
          // });
          this.getTableData()
          this.notifier.notify('success', 'Update successfully');
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

  ontypechangeTicket(index) {
    if (index !== 0) {
      this.seqNumber = this.recordTypeStatus[index - 1].seqno;
      this.recordDifTypeName = this.recordTypeStatus[index - 1].typename;
      this.getCategoryLevel(this.seqNumber);
    }
  }

  getCategoryLevel(seqNumber) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.orgSelected),
      seqno: Number(seqNumber),
    };
    this.rest.getcategorylevel(data).subscribe((res: any) => {
      if (res.success) {
        if (res.details.length > 0) {
          this.fromPropLevels = res.details;
          this.fromlevelid = '';
        } else {
          this.fromPropLevels = [];
          this.getPropertyValue(Number(seqNumber));
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getPropertyValue(seq) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.orgSelected),
      seqno: Number(seq)
    };
    this.rest.getrecordbydifftype(data).subscribe((res: any) => {
      if (res.success) {
        this.ticketTypeList = res.details;
        this.ticketType = '';
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
  }

  onTicketTypeChange(index) {
    if (index !== 0) {
      this.ticketTypeName = this.ticketTypeList[index - 1].typename;
    }
  }

  ontypechange(selectedIndex: any) {
    this.parentname = this.recordTypeStatus[selectedIndex].typename;
  }

  
}

