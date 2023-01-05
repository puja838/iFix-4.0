import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {MessageService} from '../message.service';
import {NotifierService} from 'angular-notifier';
import {RestApiService} from '../rest-api.service';
import {Router} from '@angular/router';
import {Formatters} from 'angular-slickgrid';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-role-user-action',
  templateUrl: './role-user-action.component.html',
  styleUrls: ['./role-user-action.component.css']
})
export class RoleUserActionComponent implements OnInit, OnDestroy {

  displayed = true;
  totalData = 0;
  show: boolean;
  selected: number;
  respObject: any;

  clientSelected: number;
  clients: any[];
  role: any[];
  users: any[];
  userSelected: string;
  userName: string;
  roleName: string;
  roleSelected: number;
  actions: any[];
  displayData: any;
  notAdmin = true;


  add = false;
  del = false;
  edit = false;
  view = false;

  isError = false;
  errorMessage: string;

  private clientName: any;

  private notifier: NotifierService;
  private clientId: any;
  private baseFlag: any;
  pageSize: number;
  private userAuth: Subscription;
  private adminAuth: Subscription;
  dataLoaded: boolean;
  isLoading = false;
  userId: number;
  searchUser: FormControl = new FormControl();
  showSearch = false;
  userDtl = [];
  organaisation = [];
  orgSelected: any;
  private orgName: any;
  loginname: string;
  rolename: string;
  roledesc: string;
  adminflag: string;
  orgnId: number;
  clientOrgnId:any;

  constructor(private _rest: RestApiService, private messageService: MessageService,
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
          // if (this.baseFlag) {
          if (!this.del) {
            this.notifier.notify('error', 'You do not have delete permission');
          } else {
            this.deleteItem(item);
          }
          // } else {
          //   if (!this.messageService.del) {
          //     this.notifier.notify('error', 'You do not have delete permission');
          //   } else {
          //     this.deleteItem(item);
          //   }
          // }
          break;
      }
    });
    // this.messageService.getUserAuth().subscribe(details => {
    //   // console.log(JSON.stringify(details));
    //   if (details.length > 0) {
    //     this.add = details[0].addFlag;
    //     this.del = details[0].deleteFlag;
    //     this.view = details[0].viewFlag;
    //     this.edit = details[0].editFlag;
    //   }
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
      this._rest.deleteuserroleaction({id: item.id}).subscribe((res) => {
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

  ngOnInit() {
    // this.add = true;
    // this.del = true;
    // this.edit = true;
    // this.view = true;
    this.dataLoaded = true;
    this.userId = Number(this.messageService.getUserId());
    // this.messageService.setGridWidth(1000);
    this.pageSize = this.messageService.pageSize;

    this.displayData = {
      pageName: 'Map Action With User',
      openModalButton: 'Map Action With User',
      // searchModalButton: 'Search',
      // breadcrumb: 'RoleAction',
      // folderName: 'All Mapped User Action with role',
      tabName: 'User  Action Mapping'
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
        id: 'client', name: 'Client ', field: 'clientname', sortable: true, filterable: true
      },
      {
        id: 'organization', name: 'Organization', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'role', name: 'Role', field: 'rolename', sortable: true, filterable: true
      },
      {
        id: 'user', name: 'User', field: 'username', sortable: true, filterable: true
      },
      {
        id: 'action', name: 'Action', field: 'actionname', sortable: true, filterable: true
      }
    ];
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

    this._rest.getaction().subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.isError = false;
        // for (let i = 0; i < this.respObject.actions.length; i++) {
        //     this.respObject.actions.checked = false;
        // }
        this.actions = this.respObject.details;
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.isError = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });

    // if (this.clientId !== 1) {
    //   this.clientSelected = this.clientId;
    // }
    this.searchUser.valueChanges.subscribe(
      psOrName => {
        const data = {
          loginname: psOrName,
          clientid: Number(this.clientSelected),
          mstorgnhirarchyid: Number(this.orgSelected),
          roleid: Number(this.roleSelected)
        };
        this.isLoading = true;
        if (psOrName !== '' && Number(this.roleSelected) > 0) {
          this._rest.searchUser(data).subscribe((res1) => {
            console.log('data======' + JSON.stringify(data));
            this.respObject = res1;
            this.isLoading = false;
            if (this.respObject.success) {
              this.users = this.respObject.details;
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
          this.users = [];
        }
      });
  }
  // formatter = (result: string) => result.toUpperCase();
  //
  // search = (text$: Observable<string>) =>
  //   text$.pipe(
  //     debounceTime(200),
  //     distinctUntilChanged(),
  //     map(psOrName => {
  //       const data = {
  //         loginname: psOrName,
  //         clientid: Number(this.clientSelected),
  //         mstorgnhirarchyid: Number(this.orgSelected),
  //         roleid: Number(this.roleSelected)
  //       };
  //       this.isLoading = true;
  //       if (psOrName !== '' && Number(this.roleSelected) > 0) {
  //         this._rest.searchUser(data).subscribe((res:any) => {
  //           console.log('data======' + JSON.stringify(data));
  //           // this.respObject = res1;
  //           this.isLoading = false;
  //           if (res.success) {
  //             // this.users = this.respObject.details;
  //             res.details.filter(v => {
  //               console.log(JSON.stringify(v))
  //               v.loginname.toLowerCase()
  //             })
  //             //this.userName = this.respObject.details[0].name;
  //
  //           } else {
  //             this.notifier.notify('error', res.message);
  //           }
  //         }, (err) => {
  //           this.isLoading = false;
  //           this.notifier.notify('error', this.messageService.SERVER_ERROR);
  //         });
  //       } else {
  //         this.isLoading = false;
  //         this.userName = '';
  //         this.users = [];
  //       }}
  //     )
  //   )
  onPageLoad() {
    console.log(this.clientId + '=====' + this.baseFlag);
    if (this.baseFlag) {
      this.notAdmin = false;
      this._rest.getallclientnames().subscribe((res) => {
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
      this.clientOrgnId = this.orgnId
      this.getOrganization(this.clientId, this.orgnId);
    }
  }

  openModal(content) {
    this.isError = false;
    this.reset();
    this.modalService.open(content).result.then((result) => {
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

  getUserDetails() {
    //console.log('this.users=====' + JSON.stringify(this.users));
    for (let i = 0; i < this.users.length; i++) {
      console.log('this.users[i].loginname=====' + JSON.stringify(this.users[i].loginname));
      console.log('this.userSelected=====' + JSON.stringify(this.userSelected));
      if (this.users[i].loginname === this.userSelected) {
        console.log('++++');
        this.userId = this.users[i].id;
        console.log('this.userId==' + this.userId);
        this.userName = this.users[i].name;
        this.loginname = this.users[i].loginname;

      }
    }
  }


  save() {
    const data = {
      refuserid: Number(this.userId),
      clientid: Number(this.clientSelected),
      mstorgnhirarchyid: Number(this.orgSelected),
      roleid: Number(this.roleSelected),
      actionids: this.selectedOptions,

    };
    console.log(JSON.stringify(data));
    if (!this.messageService.isBlankField(data) && this.selectedOptions.length > 0) {
      this._rest.adduserroleaction(data).subscribe((res) => {
        console.log('data======+++++++++++++++' + JSON.stringify(data));
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          this.getTableData();
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
    this.orgSelected = 0;
    this.role = []
    this.userName = '';
    this.userSelected = '';
    for (let j = 0; j < this.actions.length; j++) {
      this.actions[j].checked = false;
    }
  }

  onClientChange(value: any) {
    this.clientName = this.clients[value].name;
    this.clientOrgnId = this.clients[value].orgnid
    this.userSelected = '';
    this.userName = '';
    this.getOrganization(this.clientSelected, this.clientOrgnId);

    // this._rest.getroleactionforclient({
    //   clientid: Number(this.clientSelected),
    //   mstorgnhirarchyid: Number(this.orgSelected),
    //   offset: 0,
    //   limit: 100
    // }).subscribe((res) => {
    //   this.respObject = res;
    //   if (this.respObject.success) {
    //     this.respObject.details.values.unshift({id: 0, rolename: 'Select Role'});
    //     this.role = this.respObject.details.values;
    //     this.roleSelected = 0;
    //   } else {
    //     this.isError = true;
    //     this.notifier.notify('error', this.respObject.message);
    //   }
    // }, function (err) {

    // });

  }

  onRoleChange(selectedIndex: any) {
    this.roleName = this.role[selectedIndex].name;
    this.userSelected = '';
    // console.log("this.userId++++++++++" + JSON.stringify(this.userId));
    // if (this.notAdmin) {
    //   this.clientSelected = this.clientId;
    // }
    // console.log("this.userId++++++++++" + JSON.stringify(this.userId));
    const data = {
      'clientid': Number(this.clientSelected),
      'mstorgnhirarchyid': Number(this.orgSelected),
      'roleid': Number(this.roleSelected),
      'refuserid': Number(this.userId)
    };
    this._rest.getRoleUserWiseAction(data).subscribe((res) => {
      console.log('data++++++++++' + JSON.stringify(data));
      this.respObject = res;
      if (this.respObject.success) {
        this.isError = false;
        if (this.respObject.details.length > 0) {
          for (let i = 0; i < this.respObject.details.length; i++) {
            for (let j = 0; j < this.actions.length; j++) {
              if (this.respObject.details[i].id === this.actions[j].id) {
                this.actions[j].checked = true;
                break;
              }
            }
          }
        } else {
          for (let j = 0; j < this.actions.length; j++) {
            this.actions[j].checked = false;
          }
        }
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.isError = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });

  }

  onOrgChange(index: any) {
    this.orgName = this.organaisation[index].name;
    if (this.notAdmin) {
      this.clientSelected = this.clientId;
    }
    this._rest.getrolebyorgid({
      clientid: Number(this.clientSelected),
      mstorgnhirarchyid: Number(this.orgSelected),
    }).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, rolename: 'Select Role'});
        this.role = this.respObject.details;
        this.roleSelected = 0;
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, function (err) {

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
    this._rest.getuserroleactionforclient(data).subscribe((res) => {
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

  onUserChange(selectedIndex: any) {
    this.userName = this.users[selectedIndex].name;
  }

  getOrganization(clientId, orgId) {
    const data = {
      clientid: Number(clientId) , 
      mstorgnhirarchyid: Number(orgId)
    };
    this._rest.getorganizationclientwisenew(data).subscribe((res) => {
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
