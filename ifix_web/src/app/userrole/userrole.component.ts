import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {MessageService} from '../message.service';
import {Router} from '@angular/router';
import {NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Column, GridOption, AngularGridInstance, Formatters, OnEventArgs, Filters} from 'angular-slickgrid';
import {RestApiService} from '../rest-api.service';
import {NotifierService} from 'angular-notifier';
import {Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';
import {noUndefined} from '@angular/compiler/src/util';
import { E } from '@angular/cdk/keycodes';


@Component({
  selector: 'app-userrole',
  templateUrl: './userrole.component.html',
  styleUrls: ['./userrole.component.css']
})
export class UserroleComponent implements OnInit, OnDestroy {
  displayed = true;
  selected: number;
  columnDefinitions: Column[];
  clients: any[];
  roles: any[];
  clientSelected: number;
  roleSelected: number;
  show: boolean;
  dataset: any[];
  totalData: number;
  selectedTitles: any[];
  private respObject: any;
  roleName: any;
  private clientName: any;
  displayData: any;
  add: boolean;
  del: boolean;
  edit: boolean;
  view: boolean;
  isError = false;
  message: string;
  private notifier: NotifierService;
  collectionSize: number;
  pageSize: number;
  private adminAuth: Subscription;
  baseFlag: any;
  offset: number;
  dataLoaded: boolean;
  isLoading = false;
  roleSelecte: any;
  role: any;
  name: string;
  organaisation = [];
  orgSelected: any;
  private orgName: any;
  @ViewChild('content1') private content1;
  private modalReference: NgbModalRef;
  selectedId: number;
  clientSelectedName: string;
  orgSelectedName: string;

  rolename1: string;
  roledesc: string;
  adminflag: number;
  userId: number;
  orgnId: number;
  clientId: number;
  radioChecked: any;
  addRole: boolean;
  roleDesc: string;
  adminRole: string;
  adminRlCheck: boolean;
  adminRlCheck1: boolean;
  radioButton: any;
  private client: string;
  clientOrgnId:any;

  roleSelected1: number;

  constructor(private rest: RestApiService, private messageService: MessageService,
              private route: Router, private modalService: NgbModal, notifier: NotifierService) {
    this.notifier = notifier;
    this.messageService.getCellChangeData().subscribe(item => {
      switch (item.type) {
        case 'delete':
          if (!this.del) {
            this.notifier.notify('error', 'You do not have delete permission');
          } else {
            if (confirm('Are you sure?')) {
              this.rest.deleterole({id: item.id}).subscribe((res) => {
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
    // this.messageService.getUserAuth().subscribe(details => {
    //     // console.log(JSON.stringify(details));
    //     if (details.length > 0) {
    //         this.add = details[0].addFlag;
    //         this.del = details[0].deleteFlag;
    //         this.view = details[0].viewFlag;
    //         this.edit = details[0].editFlag;
    //     } else {
    //         this.add = false;
    //         this.del = false;
    //         this.view = false;
    //         this.edit = false;
    //     }
    // });
    // this.messageService.getSelectedItemData().subscribe(selectedTitles => {
    //     if (selectedTitles.length > 0) {
    //         this.show = true;
    //         this.selected = selectedTitles.length;
    //     } else {
    //         this.show = false;
    //     }
    // });
  }


  ngOnInit() {
    // this.add = true;
    // this.del = true;
    // this.edit = true;
    // this.view = true;
    this.adminRlCheck = false;
    this.pageSize = this.messageService.pageSize;
    this.totalData = 0;
    this.messageService.setTotalData(this.totalData);
    this.displayData = {
      pageName: 'Maintain Client  Mapping with Role',
      openModalButton: 'Add Client Role Map',
      searchModalButton: 'Search',
      breadcrumb: 'ClientRoleMap',
      folderName: 'All Client Role Map',
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
        id: 'edit',
        field: 'id',
        excludeFromHeaderMenu: true,
        formatter: Formatters.editIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          // console.log(args.dataContext);
          this.organaisation = [];
          this.reset();
          this.selectedId = args.dataContext.id;
          this.clientSelected = args.dataContext.clientid;
          this.orgSelected = args.dataContext.mstorgnhirarchyid;
          this.clientSelectedName = args.dataContext.clientname;
          this.orgSelectedName = args.dataContext.orgname;
          this.roleSelected1 = args.dataContext.id;
          // console.log("\n this.roleSelected ====>>>>>>>   ", this.roleSelected1);
          this.roleName = args.dataContext.rolename;
          this.roledesc = args.dataContext.roledesc;
          if ((Number(args.dataContext.adminflag) === 0)) {
            this.adminRlCheck1 = false;
          } else {
            this.adminRlCheck1 = true;
          }
          this.orgSelectedName = args.dataContext.mstorgnhirarchyname;
          const data = {
            clientid: Number(this.clientSelected),
            mstorgnhirarchyid: Number(this.orgSelected)
          };
          if (this.baseFlag) {
            this.clientSelected = args.dataContext.clientid;
            for(let i = 0;i<this.clients.length;i++){
              if(this.clients[i].id === this.clientSelected){
                this.clientOrgnId = this.clients[i].orgnid
              }
            }
          }
          else {
            this.clientSelected = this.clientId;
          }
          
          this.getorganization('u')
          this.getRoleData(data, 'u');
          this.modalReference = this.modalService.open(this.content1, {});
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },
      {
        id: 'clientname', name: 'Client Name', field: 'clientname', sortable: true, filterable: true
      },
      {
        id: 'organization', name: 'Organization', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'rolename', name: 'Role', field: 'rolename', sortable: true, filterable: true
      }, {
        id: 'roledesc', name: 'Description', field: 'roledesc', sortable: true, filterable: true
      }, {
        id: 'adminflag',
        name: 'Is Admin',
        field: 'adminflag',
        sortable: true,
        filterable: true,
        formatter: Formatters.checkmark,
        filter: {
          collection: [{value: '', label: 'All'}, {value: true, label: 'True'}, {value: false, label: 'False'}],
          model: Filters.singleSelect,

          filterOptions: {
            autoDropWidth: true
          },
        },
        minWidth: 40
      }
    ];
    this.messageService.setColumnDefinitions(columnDefinitions);
    // this.onPageLoad();

    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.baseFlag = this.messageService.baseFlag;
      this.orgnId = this.messageService.orgnId;
      this.client = this.messageService.clientname;
      if (this.baseFlag) {
        this.edit = true;
        this.del = true;
      } else {
        this.edit = this.messageService.edit;
        this.del = this.messageService.del;
      }
      this.onPageLoad();
    } else {
      this.adminAuth = this.messageService.getClientUserAuth().subscribe(details => {
        if (details.length > 0) {
          this.clientId = details[0].clientid;
          this.baseFlag = details[0].baseFlag;
          this.client = details[0].clientname;
          this.orgnId = details[0].mstorgnhirarchyid;
          if (this.baseFlag) {
            this.edit = true;
            this.del = true;
          } else {
            this.del = details[0].deleteFlag;
            this.edit = details[0].editFlag;
          }
          this.onPageLoad();
        }
      });
    }
  }

  onPageLoad() {
    // console.log("BASE", this.baseFlag)
    if (this.baseFlag) {
      // console.log("+++++")
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
        this.notifier.notify('error', err);
      });
    } else {
      this.clientSelected = this.clientId;
      // console.log(this.clientSelected, '<<<<<<<<<<<<<<');
      this.clientName = this.client;
      // console.log(this.clientName);
      this.clientOrgnId = this.orgnId;
      this.getorganization('i');
    }
  }

  changeRouting(path: string) {
    this.messageService.changeRouting(path);
  }


  openModal(content) {

    this.isError = false;
    this.reset();
    this.modalService.open(content, {size: 'sm'}).result.then((result) => {
    }, (reason) => {

    });

  }


  onRadioButtonChange(selectedValue) {
    this.radioChecked = selectedValue.value;
    // console.log('ff' + this.radioChecked);
    if (Number(this.radioChecked === 1)) {
      this.addRole = true;
      this.rolename1 = '';
      this.roledesc = '';
      this.adminRlCheck = false;
    } else {
      this.addRole = false;
      this.roleSelected = 0;
      this.rolename1 = '';
      this.roledesc = '';
      const data = {
        clientid: Number(this.clientSelected),
        mstorgnhirarchyid: Number(this.orgSelected)
      };
      this.getRoleData(data, 'i');
    }

  }

  getDetails() {
    for (let i = 0; i < this.role.length; i++) {
      if (this.role[i].role === this.roleSelecte) {
        this.name = this.role[i].client;
      }
    }
  }


  save() {
    let adminflag = 0;
    if (this.adminRlCheck) {
      adminflag = 1;
    }
    // console.log(this.clientSelected);
    // if(!this.baseFlag) {
    //   this.clientSelected =
    // }
    this.adminRole = String(this.adminRlCheck);
    // if (Number(this.radioChecked === 1)) {
    const data = {
      clientid: Number(this.clientSelected),
      mstorgnhirarchyid: Number(this.orgSelected),
      rolename: this.rolename1,
      roledesc: this.roledesc
    };
    // console.log('data====' + JSON.stringify(data));
    if (!this.messageService.isBlankField(data)) {
      data['adminflag'] = adminflag;
      // console.log('data====' + JSON.stringify(data));
      this.rest.createrole(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          const id = this.respObject.details;
          // if ((this.clientId === this.clientSelected) && (this.orgnId === this.orgSelected)) {
              this.messageService.setRow({
                id: id,
                clientid: this.clientSelected,
                clientname: this.clientName,
                mstorgnhirarchyid: this.orgSelected,
                mstorgnhirarchyname: this.orgName,
                rolename: this.rolename1,
                roledesc: this.roledesc,
                adminflag: this.adminRlCheck
              });
          this.totalData = this.totalData + 1;
          this.messageService.setTotalData(this.totalData);
          this.isError = false;
          this.reset();
          this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
        } else {
          this.isError = true;
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.isError = true;
        this.notifier.notify('error', err);
      });
    } else {
      this.isError = true;
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }
  }

  update() {
    let adminflag = 0;
    if (this.adminRlCheck1) {
      adminflag = 1;
    }
    const data = {
      id: this.selectedId,
      clientid: Number(this.clientSelected),
      mstorgnhirarchyid: Number(this.orgSelected),
      rolename: this.roledesc.trim(),
      roledesc: this.roledesc.trim(),
    };
    // console.log('-------------------' + JSON.stringify(data));
    // console.log('clientSelected====' + typeof this.clientSelected);
    if (!this.messageService.isBlankField(data)) {
      data['adminflag'] = adminflag;
      this.rest.updaterole(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          // this.messageService.setRow({
          //   id: this.selectedId,
          //   clientid: this.clientSelected,
          //   clientname: this.clientName,
          //   mstorgnhirarchyid: this.orgSelected,
          //   mstorgnhirarchyname: this.orgName,
          //   rolename: this.rolename1,
          //   roledesc: this.roledesc,
          //   adminflag: this.adminRlCheck
          // });
          this.getTableData();
          this.modalReference.close();
          this.notifier.notify('success', this.messageService.EDIT_SUCCESS);
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
    this.radioButton = 1;
    this.roleSelected = 0;
    this.orgSelected = 0;
    if (this.baseFlag) {
      this.clientSelected = 0;
      this.organaisation = [];
    }
    this.addRole = true;
    this.rolename1 = '';
    this.roledesc = '';
    this.adminRlCheck = false;
  }

  getTableData() {
    this.getData({
      offset: this.messageService.offset, 
      limit: this.messageService.limit
    });
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
    this.dataLoaded = true;
    const data = {
      'offset': offset,
      'limit': limit,
      'clientid': Number(this.clientId),
      'mstorgnhirarchyid': Number(this.orgnId)
    };
    this.rest.getrole(data).subscribe((res) => {
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
      for (let i = 0; i < respObject.details.values.length; i++) {
        respObject.details.values[i].adminflag = (respObject.details.values[i].adminflag === 1) ? true : false;
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

  getorganization(type) {
    const data = {
      clientid: Number(this.clientSelected),
      mstorgnhirarchyid: Number(this.clientOrgnId)
    };
    this.rest.getorganizationclientwisenew(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, organizationname: 'Select Organization'});
        this.organaisation = this.respObject.details;
        if(type === 'i'){
          this.orgSelected = 0;
        }
        else{

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

  onClientChange(index: any) {
    this.clientName = this.clients[index].name;
    this.clientOrgnId = this.clients[index].orgnid;
    this.getorganization('i');
  }

  onRoleChange(index: any) {
    this.roleName = this.roles[index].rolename;
    for (let i = 0; i < this.roles.length; i++) {
      if (this.roles[i].id === Number(this.roleSelected)) {
        this.rolename1 = this.roles[i].rolename;
        // this.userId = this.roles[i].userid;
        this.roledesc = this.roles[i].roledesc;
        if (this.roles[i].issuperadmin === 1) {
          this.adminRlCheck = true;
        } else {
          this.adminRlCheck = false;
        }
        // this.adminflag = this.roles[i].adminflag;
      }
    }
  }

  ngOnDestroy(): void {
    if (this.adminAuth) {
      this.adminAuth.unsubscribe();
    }
  }

  getRoleData(data, type) {
    this.rest.getrolebyorgid(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, rolename: 'Select Role'});
        this.roles = this.respObject.details;
        if(type === 'i'){
          this.roleSelected = 0;
        } else {
          this.roleSelected = this.roleSelected1;
        }
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onOrgChange(index: any) {
    this.orgName = this.organaisation[index].organizationname;

  }


}
