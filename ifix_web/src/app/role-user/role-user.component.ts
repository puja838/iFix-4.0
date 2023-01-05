import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {RestApiService} from '../rest-api.service';
import {MessageService} from '../message.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {Formatters} from 'angular-slickgrid';
import {NotifierService} from 'angular-notifier';
import {Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';
import {THIS_EXPR} from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-role-user',
  templateUrl: './role-user.component.html',
  styleUrls: ['./role-user.component.css']
})
export class RoleUserComponent implements OnInit, OnDestroy {

  displayed = true;
  selected: number;
  clientSelected: number;
  roleSelected: number;
  userSelected: any;
  show: boolean;
  role_id: number;
  dataset: any[];
  totalData: number;
  selectedTitles: any[];
  respObject: any;
  clients = [];
  usrs = [];
  role = [];
  clientName: string;
  userName: string;
  roleName: string;
  notAdmin = true;

  displayData: any;

  add: boolean;
  del: boolean;
  edit: boolean;
  view: boolean;

  isError = false;
  errorMessage: string;
  pageSize: number;
  private userAuth: Subscription;
  private adminAuth: Subscription;
  private notifier: NotifierService;
  private clientId: number;
  private baseFlag: any;
  private cname: any;
  offset: number;
  dataLoaded: boolean;
  // userRoleMap: UserRoleMapping [] = [];

  showSearch = false;
  userId: number;
  userDtl = [];
  isLoading = false;
  searchUser: FormControl = new FormControl();
  searchData: FormControl = new FormControl();
  userSelected1: any;
  usrs1 = [];
  userName1: string;
  @ViewChild('scarch_content') private scarch_content;
  private searchModalReference: NgbModalRef;

  organaisation = [];
  orgSelected: any;
  orgName: string;
  orgnId: number;
  loginname: string;
  clientOrgnId:any;

  constructor(private rest: RestApiService, private messageService: MessageService, private route: Router,
              private modalService: NgbModal, notifier: NotifierService) {
    this.notifier = notifier;
    this.messageService.getCellChangeData().subscribe(item => {
      switch (item.type) {
        case 'change':
          console.log('changed');
          if (!this.edit) {
            this.notifier.notify('error', 'You do not have edit permission');
          } else {

          }
          break;
        case 'delete':
          // if (this.baseFlag) {
          if (!this.del) {
            this.notifier.notify('error', 'You do not have delete permission');
          } else {
            this.deleteItem(item);
          }
        // } else {
        //     if (!this.messageService.del) {
        //         this.notifier.notify('error', 'You do not have delete permission');
        //     } else {
        //         this.deleteItem(item);
        //     }
        // }
        // break;
      }
    });
    // this.messageService.getUserAuth().subscribe(details => {
    //     // console.log(JSON.stringify(details));
    //     if (details.length > 0) {
    //         this.add = details[0].addFlag;
    //         this.del = details[0].deleteFlag;
    //         this.view = details[0].viewFlag;
    //         this.edit = details[0].editFlag;
    //     }
    // });
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
    if (confirm('Are you sure?')) {
      this.rest.deleteclientuserrole({id: item.id}).subscribe((res) => {
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
  }

  ngOnInit() {
    // this.add = true;
    // this.del = true;
    // this.edit = true;
    // this.view = true;
    this.userName = '';
    this.dataLoaded = true;
    this.pageSize = this.messageService.pageSize;
    this.displayData = {
      pageName: 'Maintain Role Mapping with User',
      openModalButton: 'Map Role with User',
      searchModalButton: 'Search',

      breadcrumb: 'ClientUserRoleMap',
      folderName: 'All Client User Role Map',
      tabName: 'Client Role Map'
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
        id: 'clientname', name: 'Client', field: 'clientname', sortable: true, filterable: true
      },
      {
        id: 'organization', name: 'Organization', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'user_name', name: 'User ', field: 'Username', sortable: true, filterable: true
      },
      {
        id: 'ROLE_NAME', name: 'Role ', field: 'rolename', sortable: true, filterable: true
      }
    ];

    if (this.notAdmin) {
      columnDefinitions.splice(1, 1);
    }
    this.messageService.setColumnDefinitions(columnDefinitions);
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.baseFlag = this.messageService.baseFlag;
      this.orgnId = this.messageService.orgnId;
      if (this.baseFlag) {
        this.edit = true;
        this.del = true;
      } else {
        this.del = this.messageService.del;
        this.edit = this.messageService.edit;
      }
      this.onPageLoad();
    } else {
      this.userAuth = this.messageService.getClientUserAuth().subscribe(auth => {
        this.clientId = auth[0].clientid;
        this.baseFlag = auth[0].baseFlag;
        this.orgnId = auth[0].mstorgnhirarchyid;
        if (this.baseFlag) {
          this.edit = true;
          this.del = true;
        } else {
          this.del = auth[0].deleteFlag;
          this.edit = auth[0].editFlag;
        }
        this.onPageLoad();
      });
    }
    this.searchUser.valueChanges.subscribe(
      psOrName => {
        const data = {
          loginname: psOrName, clientid: Number(this.clientSelected), mstorgnhirarchyid: Number(this.orgSelected)
        };
        this.isLoading = true;
        if (psOrName !== '') {
          this.rest.searchuserbyclientid(data).subscribe((res1) => {
            // console.log('data======' + JSON.stringify(data));
            this.respObject = res1;
            this.isLoading = false;
            if (this.respObject.success) {
              this.usrs = this.respObject.details;
              //this.userName = this.respObject.details[0].name;

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


  onPageLoad() {
    if (this.baseFlag) {
      this.notAdmin = false;
      this.rest.getallclientnames().subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.respObject.details.unshift({id: 0, name: 'Select Client'});
          this.clients = this.respObject.details;
          this.clientSelected = 0;
        } else {
          this.isError = true;
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.isError = true;
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    } else {
      this.notAdmin = true;
      this.clientSelected = this.clientId;
      this.clientOrgnId = this.orgnId;
      this.getOrganization(this.clientSelected, this.clientOrgnId);
    }

  }

  changeRouting(path: string) {
    this.messageService.changeRouting(path);
  }

  onClientChange(selectedIndex) {
    this.clientName = this.clients[selectedIndex].name;
    this.clientOrgnId = this.clients[selectedIndex].orgnid;
    this.getOrganization(this.clientSelected,this.clientOrgnId);
  }

  openModal(content) {
    this.isError = false;
    this.reset();
    this.modalService.open(content).result.then((result) => {
    }, (reason) => {
    });
  }

  getUserDetails() {
    for (let i = 0; i < this.usrs.length; i++) {
      if (this.usrs[i].loginname === this.userSelected) {
        this.userId = this.usrs[i].id;
        this.userName = this.usrs[i].name;
        this.loginname = this.usrs[i].loginname;
      }
    }
  }


  // getDetails() {
  //   for (let i = 0; i < this.usrs1.length; i++) {
  //     if (this.usrs1[i].user_name === this.userSelected1) {
  //       // this.userId = this.usrs1[i].id;
  //       this.userName1 = this.usrs1[i].user_name;
  //     }
  //   }
  // }


  save() {
    const data = {
      clientid: Number(this.clientSelected),
      mstorgnhirarchyid: Number(this.orgSelected),
      roleid: Number(this.roleSelected),
      refuserid: Number(this.userId)
    };
    // console.log('data===========' + JSON.stringify(data));
    if (this.clientSelected !== 0 && this.roleSelected !== 0 && this.orgSelected !== 0) {
      this.rest.createclientuserrole(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          const id = this.respObject.details;
          // if ((Number(this.clientId) === Number(this.clientSelected)) && (Number(this.orgnId) === Number(this.orgSelected))) {
            this.messageService.setRow({
              id: id,
              clientname: this.clientName,
              mstorgnhirarchyname: this.orgName,
              rolename: this.roleName,
              Username: this.userName
            });
            this.totalData = this.totalData + 1;
            this.messageService.setTotalData(this.totalData);
          // }
          this.isError = false;
          this.reset();
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
      this.isError = true;
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }
  }

  reset() {
    if (this.baseFlag) {
      this.clientSelected = 0;
      this.organaisation = [];
    }
    this.roleSelected = 0;
    this.userSelected = '';
    this.userName = '';
    this.loginname = '';
    this.role = [];
    this.orgSelected = 0;
  }

  onRoleChange(selectedIndex: any) {
    this.roleName = this.role[selectedIndex].rolename;
  }

  onOrgChange(index: any) {
    this.orgName = this.organaisation[index].organizationname;
    const data = {
      'clientid': Number(this.clientSelected),
      'mstorgnhirarchyid': Number(this.orgSelected)
    };
    this.rest.getrolebyorgid(data).subscribe((res) => {
      this.respObject = res;
      this.respObject.details.unshift({id: 0, rolename: 'Select Role'});
      this.role = this.respObject.details;
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
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
      'offset': offset,
      'limit': limit,
      'clientid': Number(this.clientId),
      'mstorgnhirarchyid': Number(this.orgnId)
    };
    this.rest.getclientuserrole(data).subscribe((res) => {
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

  ngOnDestroy(): void {
    if (this.adminAuth) {
      this.adminAuth.unsubscribe();
    }
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
        this.organaisation = this.respObject.details;
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

}
