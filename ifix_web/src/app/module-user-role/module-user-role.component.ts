import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {MessageService} from '../message.service';
import {NotifierService} from 'angular-notifier';
import {Router} from '@angular/router';
import {RestApiService} from '../rest-api.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Formatters, OnEventArgs} from 'angular-slickgrid';
import {Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-module-user-role',
  templateUrl: './module-user-role.component.html',
  styleUrls: ['./module-user-role.component.css']
})
export class ModuleUserRoleComponent implements OnInit, OnDestroy {
  displayed = true;
  selected: number;
  clientSelected: number;
  roleSelected: number;
  moduleSelected: number;
  userSelected: any;
  show: boolean;
  totalData: number;
  selectedTitles: any[];
  respObject: any;
  clients = [];
  module = [];
  role = [];
  users = [];
  clientName: string;
  moduleName: string;
  userName: string;
  roleName: string;
  displayData: any;
  notAdmin = true;
  add: boolean;
  del: boolean;
  edit: boolean;
  view: boolean;

  isError = false;
  errorMessage: string;
  private notifier: NotifierService;
  parents = [];
  parentSelected= [];
  private parentName: any;
  private clientId: number;
  private baseFlag: any;
  private cname: any;
  pageSize: number;
  private userAuth: Subscription;
  private adminAuth: Subscription;
  offset: number;
  dataLoaded: boolean;
  userId: number;
  isLoading = false;
  searchUser: FormControl = new FormControl();
  showSearch = false;
  organaisation = [];
  orgSelected: number;
  orgName: string;
  orgnId: number;
  modules = [];
  loginname: string;
  selectedId: number;
  orgSelectedName: string;
  clientSelectedName: string;
  moduleSelected1: number;
  parentSelected1= 0;
  roleSelected1: number;
  userSelected1: string;
  @ViewChild('content1') private content1;
  private modalReference: NgbModalRef;
  clientOrgnId:any;

  constructor(private rest: RestApiService, private messageService: MessageService, private route: Router,
              private modalService: NgbModal, notifier: NotifierService) {
    this.notifier = notifier;
    this.messageService.getCellChangeData().subscribe(item => {
      switch (item.type) {
        case 'delete':
          if (this.baseFlag) {
            if (!this.del) {
              this.notifier.notify('error', 'You do not have delete permission');
            } else {
              this.deleteItem(item);
            }
          } else {
            if (!this.messageService.del) {
              this.notifier.notify('error', 'You do not have delete permission');
            } else {
              this.deleteItem(item);
            }
          }
          break;
      }
    });
    // this.messageService.getUserAuth().subscribe(details => {
    //   console.log(JSON.stringify(details));
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
      this.rest.deletemodulerolemapuser({id: item.id}).subscribe((res) => {
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
    this.pageSize = this.messageService.pageSize;
    this.displayData = {
      pageName: 'View Module Role User Mapping',
      openModalButton: 'Module Role User Map',
      searchModalButton: 'Search',
      breadcrumb: 'ModuleRoleUserMap',
      folderName: 'All Module Role User Map',
      tabName: 'Module , Role and User Mapping'
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
          //console.log(JSON.stringify(args.dataContext));
          this.isError = false;
          this.reset();
          //console.log(JSON.stringify(args.dataContext))
          this.selectedId = args.dataContext.id;
          this.clientSelectedName = args.dataContext.clientname;
          this.orgSelectedName = args.dataContext.mstorgnhirarchyname;
          this.clientSelected = args.dataContext.clientid;
          this.orgSelected = args.dataContext.mstorgnhirarchyid;
          this.moduleSelected1 = args.dataContext.moduleid;
          this.parentSelected1 = args.dataContext.menuid;
          this.roleSelected1 = args.dataContext.roleid;
          this.userId = args.dataContext.refuserid;
          this.userName = args.dataContext.Refusername;
          this.userSelected = args.dataContext.Refusername;
          this.moduleName = args.dataContext.modulename;
          this.roleName = args.dataContext.rolename;
          this.parentName = args.dataContext.menuname;
          this.roledata('u');
          this.moduledata('u');
          this.menudata(this.moduleSelected1, 'u');
          this.modalReference = this.modalService.open(this.content1, {});
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },
      {
        id: 'client_name', name: 'Client ', field: 'clientname', sortable: true, filterable: true
      },
      {
        id: 'organization', name: 'Organization ', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'module', name: 'Module', field: 'modulename', sortable: true, filterable: true
      },
      {
        id: 'ROLE_NAME', name: 'Role', field: 'rolename', sortable: true, filterable: true
      },
      {
        id: 'user', name: 'User Name', field: 'Refusername', sortable: true, filterable: true
      },
      {
        id: 'menu_name', name: 'Menu ', field: 'menuname', sortable: true, filterable: true
      }
    ];

    if(this.notAdmin) {
      columnDefinitions.splice(2,1);
      }

    this.messageService.setColumnDefinitions(columnDefinitions);
    // this.messageService.setGridWidth(1000);
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
        // this.view = auth[0].viewFlag;
        // this.add = auth[0].addFlag;
        // this.edit = auth[0].editFlag;
        // this.del = auth[0].deleteFlag;
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
    this.getUser();
  }

  getUser() {
    this.searchUser.valueChanges.subscribe(
      psOrName => {
        const data = {
          loginname: this.userSelected,
          clientid: Number(this.clientSelected),
          mstorgnhirarchyid: Number(this.orgSelected),
          roleid: Number(this.roleSelected)
        };
        this.isLoading = true;
        if (psOrName !== '') {
          this.rest.searchUser(data).subscribe((res1) => {
            this.respObject = res1;
            this.isLoading = false;
            if (this.respObject.success) {
              this.users = this.respObject.details;
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
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    } else {
      this.clientSelected = this.clientId;
      this.clientOrgnId = this.orgnId;
      this.getOrganization(this.clientId, this.orgnId);
    }
  }

  update() {
    if (this.userSelected === '') {
      this.userId = 0;
    }
    const data = {
      id: Number(this.selectedId),
      clientid: Number(this.clientSelected),
      mstorgnhirarchyid: Number(this.orgSelected),
      moduleid: Number(this.moduleSelected1),
      roleid: Number(this.roleSelected),
      menuid: Number(this.parentSelected1),
      refuserid: Number(this.userId)
    };
    //console.log(JSON.stringify(data));
    if (!this.messageService.isBlankField(data)) {
      this.rest.updatemodulerolemapuser(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          this.messageService.sendAfterDelete(this.selectedId);
          this.dataLoaded = true;
          this.messageService.setRow({
            id: this.selectedId,
            modulename: this.moduleName,
            menuname: this.parentName,
            rolename: this.roleName,
            clientname: this.clientSelectedName,
            mstorgnhirarchyname: this.orgSelectedName,
            Refusername: this.userSelected,
            mstorgnhirarchyid: this.orgSelected,
            moduleid: this.moduleSelected1,
            menuid: this.parentSelected1,
            roleid: this.roleSelected,
            refuserid: this.userId,
            clientid: this.clientSelected
          });
          this.notifier.notify('success', this.messageService.EDIT_SUCCESS);
          this.modalReference.close();
        } else {
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.respObject.message);
      });
    } else {
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }
  }

  changeRouting(path: string) {
    this.messageService.changeRouting(path);
  }

  onClientChange(value: any) {
    this.clientName = this.clients[value].name;
    this.clientOrgnId = this.clients[value].orgnid
    this.getOrganization(this.clientSelected, this.clientOrgnId);
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
        this.organaisation = this.respObject.details;
        this.orgSelected = 0;
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);

    });
  }

  onOrgChange(index: any) {
    this.orgName = this.organaisation[index].organizationname;
    if (!this.baseFlag) {
      this.clientSelected = this.clientId;
    }
    //console.log(this.clientSelected);
    this.moduledata('i');
    this.roledata('i');
  }

  moduledata(type) {
    const data = {
      'offset': 0,
      'limit': 100,
      'clientid': Number(this.clientSelected),
      'mstorgnhirarchyid': Number(this.orgSelected)
    };
    this.rest.getModuleByOrgId(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, modulename: 'Select Module'});
        this.modules = this.respObject.details;
        if (type === 'i') {
          this.moduleSelected = 0;
        } else {
          this.moduleSelected = this.moduleSelected1;
        }
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {

    });
  }


  roledata(type) {
    const data = {
      'clientid': Number(this.clientSelected),
      'mstorgnhirarchyid': Number(this.orgSelected)
    };

    this.rest.getrolebyorgid(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, rolename: 'Select Role'});
        this.role = this.respObject.details;
        if (type === 'i') {
          this.roleSelected = 0;
        } else {
          this.roleSelected = this.roleSelected1;
        }
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {

    });
  }

  openModal(content) {
    // if (this.baseFlag) {
    //   if (!this.add) {
    //     this.notifier.notify('error', 'You do not have add permission');
    //   } else {
    this.isError = false;
    this.reset();
    this.modalService.open(content).result.then((result) => {
    }, (reason) => {
    });
    //   }
    // } else {
    //   if (!this.messageService.add) {
    //     this.notifier.notify('error', 'You do not have add permission');
    //   } else {
    //     this.isError = false;
    //     this.roleSelected = 0;
    //     this.moduleSelected = 0;
    //     this.parentSelected = 0;
    //     this.userSelected = '';
    //     this.modalService.open(content).result.then((result) => {
    //     }, (reason) => {

    //     });
    //   }
    // }
  }

  getUserDetails() {
    for (let i = 0; i < this.users.length; i++) {
      //console.log('this.users[i].loginname=====' + JSON.stringify(this.users[i].loginname));
      //console.log('this.userSelected=====' + JSON.stringify(this.userSelected));
      if (this.users[i].loginname === this.userSelected) {
        this.userId = this.users[i].id;
        //console.log('this.userId==' + JSON.stringify(this.users));
        this.userName = this.users[i].name;
        this.loginname = this.users[i].loginname;
      }
    }
  }

  save() {
    const data = {
      clientid: Number(this.clientSelected),
      mstorgnhirarchyid: Number(this.orgSelected),
      moduleid: Number(this.moduleSelected),
      roleid: Number(this.roleSelected),
      refuserid: Number(this.userId),
      menuids: this.parentSelected
    };
    //console.log(JSON.stringify(data))
    if (!this.messageService.isBlankField(data)) {
      this.rest.addmodulerolemapuser(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.totalData = this.totalData + 1;
          this.messageService.setTotalData(this.totalData);
          const id = this.respObject.details;
          // this.messageService.setRow({
          //   id: id,
          //   modulename: this.moduleName,
          //   menuname: this.parentName,
          //   rolename: this.roleName,
          //   clientname: this.clientName,
          //   mstorgnhirarchyname: this.orgName,
          //   Refusername: this.userSelected,
          //   mstorgnhirarchyid: this.orgSelected,
          //   moduleid: this.moduleSelected,
          //   menuid: this.parentSelected,
          //   roleid: this.roleSelected,
          //   refuserid: this.userId,
          //   clientid: this.clientSelected
          // });
          this.reset();
          this.getTableData();
          this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
        } else {
          this.isError = true;
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    } else {
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }
  }

  reset() {
    if (this.baseFlag) {
      this.clientSelected = 0;
      this.organaisation = [];
    }
    this.orgSelected = 0;
    this.moduleSelected = 0;
    this.roleSelected = 0;
    this.parentSelected = [];
    this.userSelected = '';
    this.role = [];
    this.modules = [];
    this.parents = [];
    this.parentSelected1 = 0;
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
    this.dataLoaded = true;
    // this.dataLoaded = false;
    // if (this.baseFlag) {
    //   if (!this.view) {
    //     this.notifier.notify('error', 'You do not have view permission');
    //   } else {
    const data = {
      'offset': offset,
      'limit': limit,
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.orgnId
    };

    this.rest.getmodulerolemapuser(data).subscribe((res) => {
      this.respObject = res;
      this.executeResponse(this.respObject, offset);
    }, (err) => {
      this.notifier.notify('error', err);
    });
    // }
    // } else {
    //   if (!this.messageService.view) {
    //     this.notifier.notify('error', 'You do not have view permission');
    //   } else {
    //     this.rest.getMappedModuleUserClientCWise(this.clientId, offset, this.pageSize, paginationType).subscribe((res) => {
    //       this.respObject = res;
    //       this.executeResponse(this.respObject, offset, paginationType);
    //     }, (err) => {
    //       this.notifier.notify('error', err);
    //     });
    //   }
    // }
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

  onModuleChange(selectedIndex: any, type) {
    this.moduleName = this.modules[selectedIndex].modulename;
    //console.log('this.moduleSelected====' + this.moduleSelected);
    if (type === 'i') {
      this.menudata(this.moduleSelected, type);
    } else {
      this.menudata(this.moduleSelected1, type);
    }
  }

  selectAll(items: any[]) {
    let allSelect = items => {
      items.forEach(element => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }

  menudata(moduleId, type) {
    const data = {
      'moduleid': Number(moduleId),
      'clientid': Number(this.clientSelected),
      'mstorgnhirarchyid': Number(this.orgSelected)
    };

    this.rest.getmenubymodule(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        //this.respObject.details.unshift({id: 0, menudesc: 'Select menu'});
        this.parents = this.respObject.details;
        this.selectAll(this.parents)
        if (type === 'i') {
          //this.parentSelected = [];
        } else {
          //console.log("this.parentSelected1",this.parentSelected1)
          this.parentSelected.push(this.parentSelected1);
          //console.log("this.parentSelected",this.parentSelected)
        }
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {

    });
  }

  onRoleChange(selectedIndex: any) {
    this.roleName = this.role[selectedIndex].rolename;
  }

  onParentChange(selectedIndex: any) {
    this.parentName = this.parents[selectedIndex].menudesc;
  }

  onUserChange(selectedIndex: any) {
    this.userName = this.users[selectedIndex].name;
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
    if (this.adminAuth) {
      this.adminAuth.unsubscribe();
    }
  }


}
