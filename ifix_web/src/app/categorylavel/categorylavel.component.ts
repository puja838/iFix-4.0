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
  selector: 'app-categorylavel',
  templateUrl: './categorylavel.component.html',
  styleUrls: ['./categorylavel.component.css']
})
export class CategorylavelComponent implements OnInit, OnDestroy {
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
  @ViewChild('content1') private editModal;

  organization = [];
  category: string;
  sequence: any;
  modalReference: any;
  editorgSelected: any;
  editcategory = '';
  editsequence = 0;
  editCategoryId: any;
  recordTypeStatus = [];
  fromRecordDiffTypeSeqno: number;
  private parentname: string;

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
    this.rest.deleteCategoryLavel({id: item.id}).subscribe((res) => {
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
      //     this.editorgSelected = args.dataContext.mstorgnhirarchyid;
      //     this.editcategory = args.dataContext.typename;
      //     this.editsequence = args.dataContext.seqno;
      //     this.orgName = args.dataContext.mstorgnhirarchyname
      //
      //     this.modalReference = this.modalService.open(this.editModal, {});
      //   }
      // },
      // {
      //   id: 'client', name: 'Client ', field: 'clientname', sortable: true, filterable: true
      // },
      {
        id: 'organization', name: 'Organization ', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'parent', name: 'Parent', field: 'parentname', sortable: true, filterable: true
      }, {
        id: 'typename', name: 'Label', field: 'typename', sortable: true, filterable: true
      },
      {
        id: 'seqno', name: 'Seqno', field: 'seqno', sortable: true, filterable: true
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
  }

  onPageLoad() {
    this.getOrganization(this.clientId, this.orgId);
    this.rest.getRecordDiffType().subscribe((res: any) => {
      if (res.success) {
        res.details.unshift({id: 0, typename: 'Select Property Type'});
        this.recordTypeStatus = res.details;
        this.fromRecordDiffTypeSeqno = 0;
      } else {
        this.isError = true;
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
     
    });
  }


  openModal(content) {
    this.reset();
    this.modalService.open(content, {size: 'sm'}).result.then((result) => {
    }, (reason) => {
    });
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
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.orgSelected),
      typename: this.category,
      seqno: Number(this.sequence),
      parentid: Number(this.fromRecordDiffTypeSeqno)
    };
    if (Number(this.sequence) > 99) {
      this.rest.addCategory(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.modalService.dismissAll();
          const id = this.respObject.details;
            this.messageService.setRow({
              id: id,
              mstorgnhirarchyname: this.orgName,
              parentname: this.parentname,
              typename: this.category,
              seqno: this.sequence
            });
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
    this.rest.getalllabel(data).subscribe((res) => {
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


  getTableData() {
    this.getData({
      offset: this.messageService.offset, 
      limit: this.messageService.limit
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

  ngOnDestroy(): void {
    if (this.userAuth) {
      this.userAuth.unsubscribe();
    }
  }

  update() {
    const data = {
      id: this.editCategoryId,
      clientid: this.clientId,
      mstorgnhirarchyid: this.messageService.clientId,
      typename: this.editcategory,
      seqno: Number(this.editsequence),
    };

    console.log('-------------------' + JSON.stringify(data));
    console.log('clientSelected====' + typeof this.clientSelected);
    if (!this.messageService.isBlankField(data)) {

      // this.data.password = CryptoJS.AES.encrypt(this.password, this.messageService.SECRET_TOKEN).toString();
      this.rest.updateCategoryLevel(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.modalService.dismissAll();
          this.isError = false;
          this.messageService.sendAfterDelete(this.editCategoryId);
          this.dataLoaded = true;
          this.messageService.setRow({
            id: this.editCategoryId,
            mstorgnhirarchyname: this.orgName,
            typename: this.editcategory,
            seqno: this.editsequence
          });
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

  ontypechange(selectedIndex: any) {
    this.parentname = this.recordTypeStatus[selectedIndex].typename;
  }
}
