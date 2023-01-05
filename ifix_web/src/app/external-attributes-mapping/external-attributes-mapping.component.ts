import {Component, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {RestApiService} from '../rest-api.service';
import {MessageService} from '../message.service';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {Formatters, OnEventArgs} from 'angular-slickgrid';

import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-external-attributes-mapping',
  templateUrl: './external-attributes-mapping.component.html',
  styleUrls: ['./external-attributes-mapping.component.css']
})
export class ExternalAttributesMappingComponent implements OnInit {

  dataLoaded: boolean;
  hideBtn: boolean;
  displayData: any;
  pageSizeSelected: number;
  itemsPerPage: number;
  pageSizeObj: any[];
  isUpdate: boolean = false;
  @ViewChild('content') private content;
  private modalReference: NgbModalRef;
  clientId: number;
  organizationId: number;
  organizationName = '';
  selectLoginType: any;
  enteredUserName: any;
  enteredPassword: any;
  organizationList = [];
  loginName: any;
  logins = [];
  respObject: any;
  isError = false;
  message: string;
  errorMessage: string;
  private baseFlag: any;
  loginUserOrganizationId: number;
  add: boolean;
  del: boolean;
  edit: boolean;
  view: boolean;
  private adminAuth: Subscription;
  ldpaAttributes = [];
  isTableShow: boolean = false;
  tableDetails = [];


  arrayListDrop1 = [];
  arrayListDrop2 = [];
  arrayList1 = [];
  arrayList2 = [];
  margeArr = [];

  isDisabled: boolean = false;
  pageSize: number;
  totalPage: number;
  dataset: any[];
  totalData: number;
  insertedAttributes = [];
  externalAttributes = [];
  systemAttributes = [];


  constructor(private messageService: MessageService, private modalService: NgbModal,
              private rest: RestApiService, private notifier: NotifierService) {
    this.messageService.getCellChangeData().subscribe(item => {
      switch (item.type) {
        case 'delete':
          // console.log('deleted');
          if (!this.del) {
            this.notifier.notify('error', 'You do not have delete permission');
          } else {
            if (confirm('Are you sure?')) {
              this.rest.deletemapexternalattributes({id: item.id}).subscribe((res) => {
                this.respObject = res;
                if (this.respObject.success) {
                  this.messageService.sendAfterDelete(item.id);
                  this.totalData = this.totalData - 1;
                  this.messageService.setTotalData(this.totalData);
                  this.notifier.notify('success', this.messageService.DELETE_SUCCESS);
                } else {
                  this.notifier.notify('error', this.respObject.message);
                }
              }, (err) => {
                this.notifier.notify('error', this.respObject.message);
              });
            }
          }
          break;
      }
    });
  }

  ngOnInit(): void {
    this.isTableShow = false;
    this.dataLoaded = true;
    this.isUpdate = false;
    this.isDisabled = false;
    this.pageSize = this.messageService.pageSize;
    this.organizationId = 0;
    this.selectLoginType = 0;
    this.displayData = {
      pageName: 'Maintain External Attributes Mapping',
      openModalButton: 'Add External Attributes Mapping',
      breadcrumb: '',
      folderName: '',
      tabName: 'Map External Attributes Mapping'
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
      //     this.selectedId = args.dataContext.id;
      //     this.isEdit=true;
      //     this.orgSelected = args.dataContext.mstorgnhirarchyid;
      //     this.clientSelectedName = args.dataContext.clientname;
      //     this.orgSelectedName = args.dataContext.orgname;
      //     this.password = args.dataContext.password;
      //     this.email = args.dataContext.useremail;
      //     this.firstName = args.dataContext.firstname;
      //     this.lastName = args.dataContext.lastname;
      //     this.loginName = args.dataContext.loginname;
      //     this.mobile = args.dataContext.usermobileno;
      //     this.secondaryContact = args.dataContext.secondaryno;
      //     this.division = args.dataContext.division;
      //     this.brand = args.dataContext.brand;
      //     this.city = args.dataContext.city;
      //     this.designation = args.dataContext.designation;
      //     this.branchLoc = args.dataContext.branch;
      //     // this.VIPChecked = args.dataContext.vipuser;
      //     if(args.dataContext.vipuser === "Y"){
      //       this.isVIPUser = true;
      //     }
      //     else{
      //       this.isVIPUser = false;
      //     }
      //     this.userType = args.dataContext.usertype;

      //     if (this.baseFlag) {
      //       this.clientSelected = args.dataContext.clientid;
      //     }
      //     this.modalReference = this.modalService.open(this.content, {});
      //     this.modalReference.result.then((result) => {
      //     }, (reason) => {

      //     });
      //   }
      // },
      {
        id: 'mstorgnhirarchyname', name: 'Organization', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'systemname', name: 'Login Type', field: 'systemname', sortable: true, filterable: true
      },
      {
        id: 'extattr', name: 'External Attribute', field: 'extattr', sortable: true, filterable: true
      },
      {
        id: 'sysattr', name: 'System Attribute', field: 'sysattr', sortable: true, filterable: true
      },
    ];
    this.messageService.setColumnDefinitions(columnDefinitions);

    this.clientId = this.messageService.clientId;
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.baseFlag = this.messageService.baseFlag;
      this.loginUserOrganizationId = this.messageService.orgnId;
      this.edit = this.messageService.edit;
      this.del = this.messageService.del;
      this.onPageLoad();
    } else {
      this.adminAuth = this.messageService.getClientUserAuth().subscribe(auth => {
        this.edit = auth[0].editFlag;
        this.del = auth[0].deleteFlag;
        this.clientId = auth[0].clientid;
        this.baseFlag = auth[0].baseFlag;
        this.loginUserOrganizationId = auth[0].mstorgnhirarchyid;
        this.onPageLoad();
      });
    }

  }

  onPageLoad() {
    this.getorganizationclientwise();
    this.getLoginType();
    this.gettabledetails();
  }


  openModal(content) {
    this.resetValues();
    this.modalService.open(content, {size: 'lg'}).result.then((result) => {
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
    // this.dataLoaded = false;
    const data = {
      'offset': offset,
      'limit': limit,
      'clientid': Number(this.clientId),
      'mstorgnhirarchyid': Number(this.loginUserOrganizationId)
    };
    this.rest.getAllmapexternalattributes(data).subscribe((res) => {
      this.respObject = res;
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
    this.getData({
      offset: this.messageService.offset, 
      limit: this.messageService.limit
    });
  }


  resetValues() {
    this.isUpdate = false;
    this.isError = false;
    this.isTableShow = false;
    this.isDisabled = false;
    this.organizationId = 0;
    this.selectLoginType = 0;
    this.enteredUserName = '';
    this.enteredPassword = '';
    this.externalAttributes = [];
    this.arrayList1 = [];
    this.arrayList2 = [];
    this.systemAttributes = [];
    this.arrayListDrop1 = [];
    this.arrayListDrop2 = [];
    this.margeArr = [];
  }

  save() {
    for (let i = 0; i < this.arrayList1.length; i++) {
      this.margeArr.push({'extattr': this.arrayList1[i], 'sysattr': this.arrayList2[i]});
    }

    const data = {
      'clientid': Number(this.clientId),
      'mstorgnhirarchyid': Number(this.organizationId),
      'systemid': Number(this.selectLoginType),
      'map': this.margeArr
    };

    if (!this.messageService.isBlankField(data)) {
      this.rest.insertmapexternalattributes(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          const id = this.respObject.details;
          this.getTableData();
          this.resetValues();
          this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
        } else {
          this.isError = true;
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.isError = true;
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    } else {
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }

  }

  update() {

  }


  onUpload(data: any) {
    this.dataLoaded = data.loader;
  }


  onOrgChange(index: any) {
    this.organizationName = this.organizationList[index - 1].organizationname;
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


  getLoginType() {
    this.rest.getlogintype().subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, name: 'Select Login Type'});
        this.logins = this.respObject.details;
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.isError = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }


  onLoginTypeChange(index: any) {
    this.loginName = this.logins[index].name;
  }


  onSearchClicked() {
    if (Number(this.selectLoginType) === 1) {
      const data = {
        clientid: Number(this.clientId),
        mstorgnhirarchyid: Number(this.organizationId),
        loginname: this.enteredUserName
        // "password": this.enteredPassword
      };

      if (!this.messageService.isBlankField(data)) {
        this.rest.getldapattributes(data).subscribe((res) => {
          this.respObject = res;
          if (this.respObject.success) {
            this.ldpaAttributes = this.respObject.details;
            this.isTableShow = true;
            this.isDisabled = true;
            this.getmappedattributes();
          } else {
            this.notifier.notify('error', this.respObject.message);
          }
        }, (err) => {
          this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
      } else {
        this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
      }
    } else if (Number(this.selectLoginType) === 3) {
      const data = {
        clientid: Number(this.clientId),
        mstorgnhirarchyid: Number(this.organizationId),
      };

      if (!this.messageService.isBlankField(data)) {
        this.rest.getclientwiseattribute(data).subscribe((res) => {
          this.respObject = res;
          if (this.respObject.success) {
            this.ldpaAttributes = this.respObject.details;
            this.isTableShow = true;
            this.isDisabled = true;
            this.getmappedattributes();
          } else {
            this.notifier.notify('error', this.respObject.message);
          }
        }, (err) => {
          this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
      } else {
        this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
      }
    }

  }


  getmappedattributes() {
    const data = {
      'systemid': Number(this.selectLoginType),
      'clientid': Number(this.clientId),
      'mstorgnhirarchyid': Number(this.organizationId)
    };

    if (!this.messageService.isBlankField(data)) {
      this.rest.getmappedattributes(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.insertedAttributes = this.respObject.details;
          this.removeDuplicates();
        } else {
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    } else {
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }

  }


  removeDuplicates() {
    this.arrayListDrop1 = [];
    this.arrayListDrop2 = [];
    this.arrayList1 = [];
    this.arrayList2 = [];
    this.externalAttributes = [];
    this.systemAttributes = [];
    for (let i = 0; i < this.ldpaAttributes.length; i++) {
      this.externalAttributes.push(this.ldpaAttributes[i].key);
    }
    if (this.externalAttributes.length > 0) {
      for (let i = this.externalAttributes.length; i >= 0; i--) {
        for (let j = 0; j < this.insertedAttributes.length; j++) {
          if (this.externalAttributes[i] && (this.externalAttributes[i] === this.insertedAttributes[j].extattr)) {
            this.externalAttributes.splice(i, 1);
          }
        }
      }
    }


    for (let i = 0; i < this.tableDetails.length; i++) {
      this.systemAttributes.push(this.tableDetails[i]);
    }
    if (this.systemAttributes.length > 0) {
      for (let i = this.systemAttributes.length; i >= 0; i--) {
        for (let j = 0; j < this.insertedAttributes.length; j++) {
          if (this.systemAttributes[i] && (this.systemAttributes[i] === this.insertedAttributes[j].sysattr)) {
            this.systemAttributes.splice(i, 1);
          }
        }
      }
    }
  }


  gettabledetails() {
    const data = {
      'tablename': 'mstclientuser'
    };
    this.rest.gettabledetails(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.tableDetails = this.respObject.details;
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.isError = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }


  drop1(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }


  openDropList1(event: CdkDragDrop<string[]>) {
    transferArrayItem(event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex);

    const str1 = String(event.container.data);
    this.arrayList1 = str1.split(',');
    this.arrayList1.reverse();
  }


  drop2(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }


  openDropList2(event: CdkDragDrop<string[]>) {
    transferArrayItem(event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex);

    let str2 = String(event.container.data);
    this.arrayList2 = str2.split(',');
    this.arrayList2.reverse();
  }


}
