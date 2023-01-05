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
  selector: 'app-workingcategory',
  templateUrl: './workingcategory.component.html',
  styleUrls: ['./workingcategory.component.css']
})
export class WorkingcategoryComponent implements OnInit, OnDestroy {

  displayed = true;
  totalData = 0;
  show: boolean;
  selected: number;
  respObject: any;
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
  notAdmin: boolean;
  clientId: number;
  orgId: any;
  @ViewChild('content1') private editModal;

  // Sagar Jyoti

  organization = [];
  category: string;
  sequence: any;
  modalReference: any;
  level = 0;
  allLevel = [];
  ticketType = [];
  forrecorddifftypeid: any;
  categoryType = 0;
  allCategory = [];
  mappingId = 0;
  mstOrgId = 0;
  editorgSelected: any;
  editlevel: any;
  editcategoryType: any;
  editforrecorddifftypeid = 0;
  elevel = 0;
  ecategoryType = 0;
  recordTypeStatus = [];
  fromRecordDiffTypeSeqno: number;
  fromPropLevels = [];
  fromlevelid: any;
  CATEGORY_SEQ = 0;

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
    this.rest.deleteworkingdiff({id: item.id}).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.messageService.sendAfterDelete(item.id);
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
      pageName: 'Working Label',
      openModalButton: 'Working Label',
      folderName: 'Working Label',
      tabName: 'Working Label',


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
      //     this.getLevel(args.dataContext.mstorgnhirarchyid);
      //     this.mappingId = args.dataContext.id;
      //     this.editorgSelected = args.dataContext.mstorgnhirarchyid;
      //     this.elevel = args.dataContext.forrecorddifftypeid;
      //     this.editforrecorddifftypeid = args.dataContext.forrecorddiffid;
      //     this.ecategoryType = args.dataContext.mainrecorddifftypeid;

      //     this.modalReference = this.modalService.open(this.editModal, {});
      //     this.modalReference.result.then((result) => {
      //     }, (reason) => {

      //     });
      //   }
      // },
      {
        id: 'organization', name: 'Organization ', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'ticketType', name: 'Property Value', field: 'recorddiffname', sortable: true, filterable: true
      },
      {
        id: 'categorylevel', name: 'Working Level', field: 'recorddifftyplabel', sortable: true, filterable: true
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
        console.log('auth1===' + JSON.stringify(auth));
        this.onPageLoad();
      });
      // this.adminAuth = this.messageService.getUserAuth().subscribe(details => {
      //     if (details.length > 0) {
      //         // this.add = details[0].addFlag;
      //         // this.del = details[0].deleteFlag;
      //         // this.view = details[0].viewFlag;
      //         // this.edit = details[0].editFlag;
      //         // this.clientId = details[0].clientId;
      //         // this.baseFlag = details[0].baseFlag;
      //       console.log('auth2===' + JSON.stringify(details));
      //         this.onPageLoad();
      //     }
      // });
    }

  }

  onPageLoad() {
    console.log(this.clientId + '=====' + this.baseFlag);
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
      // this.isError = true;
      // this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  reset() {
    this.categoryType = 0;
    this.level = 0;
    this.fromRecordDiffTypeSeqno = 0;
    this.fromPropLevels = [];
    this.fromlevelid = 0;
    this.orgSelected = 0;

  }

  openModal(content) {
    // for (let j = 0; j < this.actions.length; j++) {
    //     this.actions[j].checked = false;
    // }
    // if (this.baseFlag) {
    this.orgSelected = 0;
    this.reset();
    this.modalService.open(content, {size: 'sm'}).result.then((result) => {
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
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.orgSelected),
      forrecorddifftypeid: Number(this.fromRecordDiffTypeSeqno),
      forrecorddiffid: Number(this.categoryType),
      mainrecorddifftypeid: Number(this.level)
    };
    // console.log('data===========' + JSON.stringify(data));
    if (!this.messageService.isBlankField(data)) {
      this.rest.addworingkdiff(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
          this.modalService.dismissAll();
          this.isError = false;
          this.getTableData();
          this.reset();
        } else {
          this.notifier.notify('error', this.respObject.message);

        }
      }, (err) => {
        // this.isError = true;
        // this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    } else {
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
      // this.isError = true;
    }
  }

  // isEmpty(obj) {
  //   for (const key in obj) {
  //     if (obj.hasOwnProperty(key)) {
  //       return false;
  //     }
  //   }
  //   return true;
  // }

  getData(paginationObj) {
    const offset = paginationObj.offset;
    const limit = paginationObj.limit;
    this.dataLoaded = false;
    const data = {
      clientid: this.clientId,
      // parentid : 1,
      mstorgnhirarchyid: this.messageService.orgnId,
      offset: offset,
      limit: limit
    };
    this.rest.getworkingdiff(data).subscribe((res) => {
      this.respObject = res;
      this.executeResponse(this.respObject, offset);
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getOrganization(clientId, orgId) {
    const data = {
      clientid: Number(clientId),
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

  onorgChange(value: any) {
    // const organization = this.organization[value];
    // this.getLevel(organization.id);
  }

  getLevel(): any {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.orgSelected),
      fromrecorddifftypeid: Number(this.fromRecordDiffTypeSeqno),
      fromrecorddiffid: Number(this.categoryType),
      seqno: this.CATEGORY_SEQ,
    };
    this.rest.getlabelbydiffseq(data).subscribe((res: any) => {
      if (res.success) {
        this.editlevel = this.elevel;
        // this.getdiffTypeId();
        res.details.unshift({id: 0, typename: 'Select working level ', seqno: 0});
        this.allLevel = res.details;
      }
    });
  }

  getdiffTypeId() {
    this.rest.getRecordDiffTypePost().subscribe((res: any) => {
      if (res.success) {
        for (let i = 0; i < res.details.length; i++) {
          if (res.details[i].seqno === 1) {
            this.forrecorddifftypeid = res.details[i].id;
            const data = {
              clientid: this.clientId,
              mstorgnhirarchyid: this.messageService.orgnId,
              seqno: res.details[i].seqno
            };
            this.rest.getrecordbydifftype(data).subscribe((res: any) => {
              if (res.success) {
                this.editcategoryType = this.ecategoryType;
                res.details.unshift({id: 0, typename: 'Select category type', seqno: 0});
                this.allCategory = res.details;
              }
            });
          }
        }
      }
    });
  }


  onLevelChange(selectedIndex: any) {
    let seq;
    // if (type === 'to') {
    //   seq = this.toPropLevels[selectedIndex].seqno;
    // } else {
    seq = this.fromPropLevels[selectedIndex].seqno;
    // }
    this.getPropertyValue(seq);
  }

  // onOrgChange(index: any) {
  //   this.orgName = this.organaisation[index].organizationname;
  //   const data = {
  //     'offset': 0,
  //     'limit': 100,
  //     'clientid': 1,
  //     'mstorgnhirarchyid': 1
  //   };
  //   this.rest.getrole(data).subscribe((res) => {
  //     this.respObject = res;
  //     this.respObject.details.values.unshift({id: 0, rolename: 'Select Role'});
  //     this.role = this.respObject.details.values;
  //   }, (err) => {
  //     this.notifier.notify('error', this.messageService.SERVER_ERROR);
  //   });
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
    // console.log('>>>>>>>>>>>>>>>>>>>>>> SAGAR', JSON.stringify(respObject));
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
      'mstorgnhirarchyid': this.messageService.orgnId,
      'forrecorddifftypeid': Number(this.fromRecordDiffTypeSeqno),
      'forrecorddiffid': Number(this.editcategoryType),
      'mainrecorddifftypeid': Number(this.editlevel),
      'id': this.mappingId
    };

    console.log('-------------------' + JSON.stringify(data));
    if (!this.messageService.isBlankField(data)) {

      // this.data.password = CryptoJS.AES.encrypt(this.password, this.messageService.SECRET_TOKEN).toString();
      this.rest.updateworingkdiff(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.notifier.notify('success', this.messageService.EDIT_SUCCESS);
          this.modalService.dismissAll();
          this.isError = false;
          this.getTableData();
        } else {
          this.notifier.notify('error', this.respObject.message);
          // this.isError = true;
        }
      }, (err) => {
        // this.isError = true;
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    } else {
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
      // this.isError = true;
    }
  }

  getPropertyValue(seqNumber) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.orgSelected),
      seqno: seqNumber
    };
    this.rest.getrecordbydifftype(data).subscribe((res: any) => {
      if (res.success) {
        // if (flag === 'from') {
        res.details.unshift({id: 0, typename: 'Select property value', seqno: 0});
        this.allCategory = res.details;
        // this.categoryType = 0;
        // } else {
        //   this.toTicketTypeList = res.details;
        //   this.toRecordDiffId = '';
        // }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      console.log(err);
    });
  }

  getrecordbydifftype(index) {
    console.log(index);

    if (index !== 0) {
      this.fromPropLevels = [];
      this.allCategory = [];
      this.categoryType = 0;
      // this.formTicketTypeList = [];
      const seqNumber = this.recordTypeStatus[index].seqno;

      const data = {
        clientid: this.clientId,
        mstorgnhirarchyid: Number(this.orgSelected),
        seqno: Number(seqNumber),
      };
      this.rest.getcategorylevel(data).subscribe((res: any) => {
        if (res.success) {
          if (res.details.length > 0) {
            res.details.unshift({id: 0, typename: 'Select Property Level'});
            this.fromPropLevels = res.details;
            this.fromlevelid = 0;

          } else {
            this.fromPropLevels = [];
            this.getPropertyValue(Number(seqNumber));
          }
        } else {
          this.isError = true;
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        this.isError = true;
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });

    }
  }

  onDiffChange() {
    this.getLevel();
  }
}
