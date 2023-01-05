import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {NotifierService} from 'angular-notifier';
import {Formatters, OnEventArgs} from 'angular-slickgrid';
import {MessageService} from '../message.service';
import {RestApiService} from '../rest-api.service';
import {Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
// import * as CryptoJS from 'crypto-js';
import {Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-default-group',
  templateUrl: './default-group.component.html',
  styleUrls: ['./default-group.component.css']
})
export class DefaultGroupComponent implements OnInit {
  totalData = 0;
  show: boolean;
  selected: number;
  respObject: any;
  clientSelected: number;
  displayData: any;
  add = false;
  del = false;
  edit = false;
  view = false;
  isError = false;
  errorMessage: string;
  // private notifier: NotifierService;
  private baseFlag: any;
  collectionSize: number;
  pageSize: number;
  private userAuth: Subscription;
  dataLoaded: boolean;
  isLoading = false;
  organization = [];
  organizationId: number;
  orgName: string;
  clientId: number;
  selectedId: number;
  updateFlag = 0;
  orgnId: number;
  @ViewChild('content') private content;
  private modalReference: NgbModalRef;
  isEdit: boolean;
  clientOrgnId: any;
  loginname: any;
  searchUser: FormControl = new FormControl();
  usrs = [];
  userName: any;
  userSelected: any;
  userId: any;
  defgrpupId: any;
  groupList = [];
  groupName: any;

  constructor(private rest: RestApiService, private messageService: MessageService,
              private route: Router, private modalService: NgbModal, private notifier: NotifierService) {
    this.messageService.getCellChangeData().subscribe(item => {
      // console.log(item);
      // this.notifier = notifier;
      switch (item.type) {
        case 'delete':
          // console.log('deleted');
          if (!this.del) {
            this.notifier.notify('error', this.messageService.DELETE_PERMISSION);
          } else {
            if (confirm('Are you sure?')) {
              console.log(JSON.stringify(item));
              this.rest.deletemstuserdefaultsupportgroup({id: item.id}).subscribe((res) => {
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
  }

  ngOnInit(): void {
    this.dataLoaded = true;
    this.pageSize = this.messageService.pageSize;
    this.displayData = {
      pageName: 'Default Support Group',
      openModalButton: 'Add Default Support Group',
      breadcrumb: 'Default Support Group',
      folderName: 'Default Support Group',
      tabName: 'Default Support Group',
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
          this.isError = false;
          this.organization = [];
          this.reset();
          console.log('\n ARGS DATA CONTEXT  :: ' + JSON.stringify(args.dataContext));
          this.selectedId = args.dataContext.id;
          this.clientSelected = args.dataContext.clientid;
          this.orgName = args.dataContext.mstorgnhirarchyname;
          this.organizationId = args.dataContext.mstorgnhirarchyid;
          this.userId = args.dataContext.refuserid;
          this.userSelected = args.dataContext.refusername;
          this.defgrpupId = args.dataContext.groupid;
          this.groupName = args.dataContext.groupname;
          this.getOrganization();
          this.getSupportGroup();
          this.isEdit = true;
          this.modalReference = this.modalService.open(this.content, {});
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },
      {
        id: 'mstorgnhirarchyname', name: 'Organization ', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'refusername', name: 'User Name', field: 'refusername', sortable: true, filterable: true
      },
      {
        id: 'groupname', name: 'Group Name', field: 'groupname', sortable: true, filterable: true
      }
    ];
    this.messageService.setColumnDefinitions(columnDefinitions);
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.orgnId = this.messageService.orgnId;
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
        this.orgnId = auth[0].mstorgnhirarchyid;
        this.baseFlag = auth[0].baseFlag;
        this.onPageLoad();
      });
    }
  }

  onPageLoad() {
    // const ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123').toString();
    // console.log(ciphertext)

    this.searchUser.valueChanges.subscribe(
      psOrName => {
        const data = {
          loginname: psOrName, clientid: Number(this.clientId), mstorgnhirarchyid: Number(this.orgnId)
        };
        this.isLoading = true;
        if (psOrName !== '') {
          this.rest.searchUserByOrgnId(data).subscribe((res1) => {
            // console.log('data======' + JSON.stringify(data));
            this.respObject = res1;
            this.isLoading = false;
            if (this.respObject.success) {
              this.usrs = this.respObject.details;
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
          this.usrs = [];
        }
      });
  }


  changeRouting(path: string) {
    this.messageService.changeRouting(path);
  }

  openModal(content) {
    this.isError = false;
    this.reset();
    this.isEdit = false;
    this.modalService.open(content).result.then((result) => {
    }, (reason) => {
    });
  }

  save() {
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.organizationId),
      refuserid: Number(this.userId),
      groupid: Number(this.defgrpupId),
    };

    //console.log(JSON.stringify(data))
    if (!this.messageService.isBlankField(data)) {
      this.rest.insertmstuserdefaultsupportgroup(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          const id = this.respObject.details;
          this.messageService.setRow({
            id: id,
            clientid: Number(this.clientSelected),
            mstorgnhirarchyid: Number(this.organizationId),
            mstorgnhirarchyname: this.orgName,
            refuserid: Number(this.userId),
            refusername: this.userSelected,
            groupid: Number(this.defgrpupId),
            groupname: this.groupName
          });
          this.totalData = this.totalData + 1;
          this.messageService.setTotalData(this.totalData);
          this.defgrpupId = 0;
          this.organizationId = 0;
          this.groupList = [];
          // this.reset();
          this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
        } else {
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        // this.isError = true;
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    } else {
      // this.isError = true;
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }
  }

  update() {
    const data = {
      id: this.selectedId,
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.organizationId),
      refuserid: Number(this.userId),
      groupid: Number(this.defgrpupId),
    };
    //console.log(JSON.stringify(data))
    if (!this.messageService.isBlankField(data)) {
      this.rest.updatemstuserdefaultsupportgroup(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          this.modalReference.close();
          this.messageService.sendAfterDelete(this.selectedId);
          this.dataLoaded = true;
          this.messageService.setRow({
            id: this.selectedId,
            clientid: Number(this.clientSelected),
            mstorgnhirarchyid: Number(this.organizationId),
            mstorgnhirarchyname: this.orgName,
            refuserid: Number(this.userId),
            refusername: this.userSelected,
            groupid: Number(this.defgrpupId),
            groupname: this.groupName
          });
          this.modalReference.close();
          this.reset();
          //this.getTableData();
          this.notifier.notify('success', this.messageService.EDIT_SUCCESS);
        } else {
          // this.isError = true;
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        // this.isError = true;
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    } else {
      // this.isError = true;
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }
  }

  reset() {
    this.userSelected = '';
    this.usrs = [];
    this.userId = '';
    this.loginname = '';
    this.organizationId = 0;
    this.organization = [];
    this.defgrpupId = 0;
    this.groupList = [];
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
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgnId),
      offset: offset,
      limit: limit
    };
    this.rest.getallmstuserdefaultsupportgroup(data).subscribe((res) => {
      this.respObject = res;
      //console.log(JSON.stringify(res));
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

  ngOnDestroy(): void {
  }

  onOrganizationChange(index) {
    this.orgName = this.organization[index - 1].mstorgnhirarchyname;
    //console.log(this.orgName, index)
    this.getSupportGroup();
  }

  getOrganization() {
    this.rest.getorgassignedcustomer({clientid: Number(this.clientId), refuserid: Number(this.userId)}).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.organization = this.respObject.details.values;
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }


  getUserDetails(usrs) {
    this.userId = usrs.id;
    this.userName = usrs.name;
    this.loginname = usrs.loginname;
    this.getOrganization();
  }

  getSupportGroup() {
    const data = {clientid: Number(this.clientId), mstorgnhirarchyid: Number(this.organizationId), refuserid: Number(this.userId)};
    this.rest.groupbyuserwise(data).subscribe((res: any) => {
      if (res.success) {
        this.groupList = res.details;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onGroupChange(index) {
    this.groupName = this.groupList[index - 1].groupname;
    //console.log(this.groupName, index)
  }

}
