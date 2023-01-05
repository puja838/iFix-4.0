import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {MessageService} from '../message.service';
import {RestApiService} from '../rest-api.service';
import {Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Formatters, OnEventArgs} from 'angular-slickgrid';
import {CustomInputEditor} from '../custom-inputEditor';
import {NotifierService} from 'angular-notifier';
import {Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-module-role',
  templateUrl: './module-role.component.html',
  styleUrls: ['./module-role.component.css']
})
export class ModuleRoleComponent implements OnInit, OnDestroy {

  displayed = true;
  selected: number;
  clientSelected: number;
  roleSelected: number;
  moduleSelected: number;
  show: boolean;
  totalData: number;
  selectedTitles: any[];
  respObject: any;
  clients = [];
  module = [];
  role = [];
  clientName: string;
  moduleName: string;
  roleName: string;
  notAdmin = true;

  displayData: any;

  add: boolean;
  del: boolean;
  edit: boolean;
  view: boolean;

  isError = false;
  errorMessage: string;

  private notifier: NotifierService;
  parents = [];
  parentSelected: number;
  private parentName: any;

  private clientId: number;
  private baseFlag: any;
  private cname: any;
  collectionSize: number;
  pageSize: number;
  private userAuth: Subscription;
  private adminAuth: Subscription;
  offset: number;
  parentArr = [];
  dataLoaded: boolean;
  showSearch = false;
  isLoading = false;
  moduleSelecte: any;
  modules: any;
  name: string;
  organaisation = [];
  orgSelected: any;
  private orgName: any;
  @ViewChild('content1') private content1;
  private modalReference: NgbModalRef;
  selectedId: number;
  orgnId: number;
  clientSelectedName: any;
  orgSelectedName: any;

  roleSelected1: number;
  moduleSelected1: number;
  parentSelected1: number;
  clientOrginId: any;

  constructor(private _rest: RestApiService, private messageService: MessageService, private route: Router,
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
            if (!this.del) {
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
      this._rest.deletemodulerolemap({id: item.id}).subscribe((res) => {
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
    this.dataLoaded = false;
    // this.add = true;
    // this.del = true;
    // this.edit = true;
    // this.view = true;
    this.pageSize = this.messageService.pageSize;
    this.displayData = {
      pageName: 'Maintain Module Role Mapping',
      openModalButton: 'Module Role Map',
      breadcrumb: 'ModuleRoleMap',
      folderName: 'All Module Role Map',
      tabName: 'Module and Role Mapping',
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
          this.reset();
          this.isError = false;
          this.selectedId = args.dataContext.id;
          this.orgSelectedName =args.dataContext.mstorgnhirarchyname;
          this.clientName =args.dataContext.clientname;
          this.clientSelectedName = args.dataContext.clientname;
          this.orgSelectedName = args.dataContext.mstorgnhirarchyname;
          this.clientSelected = args.dataContext.clientid;
          this.orgSelected = args.dataContext.mstorgnhirarchyid;
          this.moduleSelected1 = args.dataContext.moduleid;
          this.parentSelected1 = args.dataContext.menuid;
          this.roleSelected1 = args.dataContext.roleid;
          this.roledata(this.roleSelected1);
          this.moduledata(this.moduleSelected1);
          this.menudata(this.moduleSelected1 , 'u');
          this.roleName = args.dataContext.rolename;
          this.moduleName = args.dataContext.modulename;
          this.parentName  = args.dataContext.menuname;
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
        id: 'org_name', name: 'Organization ', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'module', name: 'Module', field: 'modulename', sortable: true, filterable: true
      },
      {
        id: 'ROLE_NAME', name: 'Role', field: 'rolename', sortable: true, filterable: true
      },
      {
        id: 'menu_name', name: 'Menu ', field: 'menuname', sortable: true, filterable: true
      }
    ];

    if(this.notAdmin) {
      columnDefinitions.splice(2,1);
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

  }

  onPageLoad() {
    // console.log(this.clientId + '=====' + this.baseFlag);
    if (this.baseFlag) {
      this.notAdmin = false;
      this._rest.getallclientnames().subscribe((res) => {
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
      this.notAdmin = true;
      this.clientSelected = this.clientId;
      this.getOrganization(this.clientId, this.orgnId);
    }
  }

  changeRouting(path: string) {
    this.messageService.changeRouting(path);
  }


  onClientChange(value: any) {
    this.clientName = this.clients[value].name;
    this.clientOrginId = this.clients[value].orgnid
    this.getOrganization(this.clientSelected, this.clientOrginId);
  }


  openModal(content) {
    this.isError = false;
    this.reset();
    this.modalService.open(content, {size: 'sm'}).result.then((result) => {
    }, (reason) => {
    });

  }

  update() {
    const data = {
      id: this.selectedId,
      clientid: Number(this.clientSelected),
      mstorgnhirarchyid: Number(this.orgSelected),
      moduleid: Number(this.moduleSelected),
      roleid: Number(this.roleSelected),
      menuid: Number(this.parentSelected)
    };

    if (!this.messageService.isBlankField(data)) {
      this._rest.updatemodulerolemap(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          this.messageService.sendAfterDelete(this.selectedId);
          this.dataLoaded = true;
          this.messageService.setRow({id: this.selectedId,
              clientname:this.clientSelectedName,
              clientid:this.clientSelected,
               mstorgnhirarchyname: this.orgSelectedName,
               mstorgnhirarchyid:this.orgSelected,
               rolename: this.roleName,
               roleid:this.roleSelected,
               moduleid:this.moduleSelected,
               menuid:this.parentSelected,
               modulename: this.moduleName,
               menuname: this.parentName});
            this.notifier.notify('success', this.messageService.EDIT_SUCCESS);
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


  onParentChange(selectedIndex: any) {
    this.parentName = this.parents[selectedIndex].menudesc;
  }

  save() {
    const data = {
      clientid: Number(this.clientSelected),
      mstorgnhirarchyid: Number(this.orgSelected),
      moduleid: Number(this.moduleSelected),
      roleid: Number(this.roleSelected),
      menuid: Number(this.parentSelected)
    };
    // console.log("\n Client ID :: ",Number(this.clientId) ,"=== Client Selected :: ", Number(this.clientSelected) ,
    //             "\n Org ID :: ", Number(this.orgnId) ,"=== Org Selected :: ", Number(this.orgSelected));
    if (!this.messageService.isBlankField(data)) {
      this._rest.addmodulerolemap(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          const id = this.respObject.details;

        // Biswajit Aug-2-2021 : I am commenting out the If condition because it is always going to return false.
        // if ((Number(this.clientId) === Number(this.clientSelected)) && (Number(this.orgnId) === Number(this.orgSelected))) {

          this.messageService.setRow({id: id,
            clientname:this.clientName,
            clientid:this.clientSelected,
              mstorgnhirarchyname: this.orgName,
              mstorgnhirarchyid:this.orgSelected,
              rolename: this.roleName,
              roleid:this.roleSelected,
              moduleid:this.moduleSelected,
              menuid:this.parentSelected,
              modulename: this.moduleName,
              menuname: this.parentName});

        // }
          this.totalData = this.totalData + 1;
          this.messageService.setTotalData(this.totalData);
          this.isError = false;
          this.reset();
          this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
        } else {
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.isError = true;
        this.notifier.notify('error', err);
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
    this.parentSelected = 0;
    this.modules= [];
    this.parents = [];
    this.role = [];
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

    const data = {
      'offset': offset,
      'limit': limit,
      'clientid': Number(this.clientId),
      'mstorgnhirarchyid': Number(this.orgnId)
    };
    console.log('data for grid====' + JSON.stringify(data));
    this._rest.getmodulerolemap(data).subscribe((res) => {
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


  onModuleChange(selectedIndex: any) {
    this.moduleName = this.modules[selectedIndex].modulename;
    console.log('this.moduleSelected====' + this.moduleSelected);
    this.menudata(this.moduleSelected , 'i');
  }

  onRoleChange(selectedIndex: any) {
    this.roleName = this.role[selectedIndex].rolename;
  }


  ngOnDestroy(): void {
    if (this.userAuth) {
      this.userAuth.unsubscribe();
    }
    if (this.adminAuth) {
      this.adminAuth.unsubscribe();
    }
  }

  onOrgChange(index: any) {
    this.orgName = this.organaisation[index].organizationname;
    if (!this.baseFlag) {
      this.clientSelected = this.clientId;
    }
    this.moduleSelected = 0;
    console.log(this.clientSelected);
    this.moduledata(this.moduleSelected);
    this.roledata(this.roleSelected);
  }

  moduledata(selectModule) {
    const data = {
      'offset': 0,
      'limit': 100,
      'clientid': Number(this.clientSelected),
      'mstorgnhirarchyid': Number(this.orgSelected)
    };
    this._rest.getModuleByOrgId(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, modulename: 'Select Module'});
        this.modules = this.respObject.details;
        this.moduleSelected = selectModule;
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {

    });
  }


  roledata(selectRole: any) {

    const data = {
      'clientid': Number(this.clientSelected),
      'mstorgnhirarchyid': Number(this.orgSelected)
    };

    this._rest.getrolebyorgid(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, rolename: 'Select Role'});
        this.role = this.respObject.details;
        this.roleSelected = Number(selectRole);
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {

    });
  }


  menudata(selectModule ,type) {
    const data = {
      'moduleid': Number(selectModule),
      'clientid': Number(this.clientSelected),
      'mstorgnhirarchyid': Number(this.orgSelected)
    };

    this._rest.getmenubymodule(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, menudesc: 'Select menu'});
        this.parents = this.respObject.details;
        if(type === 'i'){
          this.parentSelected = 0;
        }else{
          this.parentSelected = this.parentSelected1;
        }

      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {

    });
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
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }


}
