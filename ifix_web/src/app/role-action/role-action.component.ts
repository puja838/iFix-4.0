import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {RestApiService} from '../rest-api.service';
import {Filters, Formatters} from 'angular-slickgrid';
import {MessageService} from '../message.service';
import {CustomInputEditor} from '../custom-inputEditor';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-role-action',
  templateUrl: './role-action.component.html',
  styleUrls: ['./role-action.component.css']
})
export class RoleActionComponent implements OnInit, OnDestroy {
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
  notAdmin: boolean;
  clientId: number;
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
    this._rest.deleteroleaction({id: item.id}).subscribe((res) => {
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

  ngOnInit() {
    // this.add = true;
    // this.del = true;
    // this.edit = true;
    // this.view = true;
    // this.dataLoaded = true;
    // console.log(this.messageService.pageSize);
    this.pageSize = this.messageService.pageSize;

    this.displayData = {
      pageName: 'Maintain Role  Mapping with Action',
      openModalButton: 'Map Role With Action',
      breadcrumb: 'RoleAction',
      searchModalButton: 'Search',

      folderName: 'All Mapped Action with role',
      tabName: 'Role Action Mapping',
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
      {
        id: 'client', name: 'Client ', field: 'clientname', sortable: true, filterable: true
      },
      {
        id: 'organization', name: 'Organization ', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'role', name: 'Role', field: 'rolename', sortable: true, filterable: true
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
        this.edit = this.messageService.edit;
        this.del = this.messageService.del;
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
        //console.log('auth1===' + JSON.stringify(auth));
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
        this.notifier.notify('error', this.respObject.errorMessage);
      }
    }, (err) => {
      this.isError = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });

  }

  onPageLoad() {
    //console.log(this.clientId + '=====' + this.baseFlag);
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
      this.clientOrgnId = this.orgnId;
      this.getOrganization(this.clientId, this.orgnId);
    }
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
      clientid: Number(this.clientSelected),
      mstorgnhirarchyid: Number(this.orgSelected),
      roleid: Number(this.roleSelected),
      actionids: this.selectedOptions
    };
    //console.log('data===========' + JSON.stringify(data));
    if (this.clientSelected !== 0 && this.roleSelected !== 0 && this.selectedOptions.length > 0) {
      this._rest.addroleaction(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          this.getTableData();
          this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
          this.reset();
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
      this.organaisation = []
    }
    this.roleSelected = 0;
    this.orgSelected = 0;
    this.role = []
    for (let j = 0; j < this.actions.length; j++) {
      this.actions[j].checked = false;
    }
  }

  isEmpty(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
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
    this._rest.getroleactionforclient(data).subscribe((res) => {
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

  onClientChange(value: any) {
    this.clientName = this.clients[value].name;
    this.clientOrgnId = this.clients[value].orgnid
    this.getOrganization(this.clientSelected, this.clientOrgnId);
  }

  onRoleChange(selectedIndex: any) {
    this.roleName = this.role[selectedIndex].rolename;
    if (this.notAdmin) {
      this.clientSelected = this.clientId;
    }
    const data = {
      'clientid': Number(this.clientSelected),
      'mstorgnhirarchyid': Number(this.orgSelected),
      'roleid': Number(this.roleSelected)
    };
    this._rest.getRoleWiseAction(data).subscribe((res) => {
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
        this.notifier.notify('error', this.respObject.errorMessage);
      }
    }, (err) => {
      this.isError = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onOrgChange(index: any) {
    this.orgName = this.organaisation[index].organizationname;
    const data = {
      'clientid': Number(this.clientSelected),
      'mstorgnhirarchyid': Number(this.orgSelected)
    };
    this._rest.getrolebyorgid(data).subscribe((res) => {
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
}
