import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {RestApiService} from '../rest-api.service';
import {Filters, Formatters, OnEventArgs} from 'angular-slickgrid';
import {MessageService} from '../message.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-ldap-group-user',
  templateUrl: './ldap-group-user.component.html',
  styleUrls: ['./ldap-group-user.component.css']
})
export class LDAPGroupUserComponent implements OnInit, OnDestroy {
  displayed = true;
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
  orgSelected: number;
  orgSelected1: number;
  orgName: string;
  clientId: number;
  orgId: number;
  recordType: string;
  recordTypeIds = [];
  recordTypeNames = [];
  recordTypeName: string;
  recordTypeIdSelected: number;
  recordTypeNameSelected: number;
  clientSelectedName: string;
  orgSelectedName: string;
  recordtermvalue: string;
  organizationName: string;
  selectedId: number;
  recordTypeIdSelected1: number;
  selectedRecordTypeId: number;
  recordTypeNameSelected1: number;
  selectedRecordTypeName: number;
  updateFlag = 0;
  orgnId: number;
  isMandatory: boolean;
  isMandatory1: boolean;
  @ViewChild('content') private content;
  private modalReference: NgbModalRef;
  isEdit: boolean;
  colordata: any;
  grpSelected: number;
  grpSelected1: number;
  groups = [];
  grpName: string;
  roleSelected: number;
  roleSelected1: number;
  role = [];
  roleName: string;
  selectLoginType: any;
  logins = [];
  private loginName: string;
  private logintypeid: any;

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
              this.rest.deletemapldapgrouprole({id: item.id}).subscribe((res) => {
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
    this.colordata = this.messageService.colors;
    //console.log("COLOR",this.colordata);
    this.dataLoaded = true;
    this.pageSize = this.messageService.pageSize;
    this.displayData = {
      pageName: 'LDAP Group User',
      openModalButton: 'Add LDAP Group User',
      breadcrumb: 'LDAP Group User',
      folderName: 'LDAP Group User',
      tabName: 'LDAP Group User',
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
          this.reset();
          console.log('\n ARGS DATA CONTEXT  :: ' + JSON.stringify(args.dataContext));
          this.selectedId = args.dataContext.id;
          this.clientSelected = args.dataContext.clientid;
          this.orgName = args.dataContext.mstorgnhirarchyname;
          this.orgSelected1 = args.dataContext.mstorgnhirarchyid;
          this.grpSelected1 = args.dataContext.groupid;
          this.grpName = args.dataContext.groupname;
          this.roleSelected1 = args.dataContext.roleid;
          this.roleName = args.dataContext.rolename;
          this.logintypeid = args.dataContext.logintypeid;
          this.getOrganization('u', this.clientId, this.orgnId);
          this.getLoginType('u');
          this.getGroupData('u', this.orgSelected1);
          this.getRoleData('u', this.orgSelected1);
          this.isEdit = true;
          this.modalReference = this.modalService.open(this.content, {});
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },
      {
        id: 'organization', name: 'Organization ', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'groupname', name: 'Support Group Name', field: 'groupname', sortable: true, filterable: true
      },
      {
        id: 'rolename', name: 'Role Name', field: 'rolename', sortable: true, filterable: true
      },
      {
        id: 'logintype', name: 'Login Type', field: 'logintype', sortable: true, filterable: true
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
  }

  openModal(content) {
    this.reset();
    this.getOrganization('i', this.clientId, this.orgnId);
    this.getLoginType('i');
    this.isEdit = false;
    this.modalService.open(content).result.then((result) => {
    }, (reason) => {

    });
  }

  reset() {
    this.orgSelected = 0;
    this.grpSelected = 0;
    this.roleSelected = 0;
    this.groups = [];
    this.role = [];
    this.selectLoginType = 0;
  }

  onOrgChange(index) {
    this.orgName = this.organization[index].organizationname;
    this.getGroupData('i', this.orgSelected);
    this.getRoleData('i', this.orgSelected);
  }

  ongrpChange(selectedIndex: any) {
    this.grpName = this.groups[selectedIndex].supportgroupname;
  }

  onRoleChange(selectedIndex: any) {
    this.roleName = this.role[selectedIndex].rolename;
  }


  getOrganization(type, clientId, orgId) {
    const data = {
      clientid: Number(clientId),
      mstorgnhirarchyid: Number(orgId)
    };
    this.rest.getorganizationclientwisenew(data).subscribe((res) => {
      this.respObject = res;
      this.organization = this.respObject.details;
      if (this.respObject.success) {
        if (type === 'i') {
          this.respObject.details.unshift({id: 0, organizationname: 'Select Organization'});
          this.orgSelected = 0;
        } else {
          this.orgSelected = this.orgSelected1;
        }
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      // this.isError = true;
      // this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getGroupData(type, orgnId) {
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(orgnId),
    };
    console.log(data);
    this.rest.getgroupbyorgid(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, supportgroupname: 'Select Support Group'});
        this.groups = this.respObject.details;
        if (type === 'i') {
          this.grpSelected = 0;
        } else {
          console.log(this.groups, this.grpSelected);
          this.grpSelected = this.grpSelected1;
        }
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, function(err) {

    });
  }

  getRoleData(type, orgnId) {
    const data = {
      'clientid': Number(this.clientId),
      'mstorgnhirarchyid': Number(orgnId)
    };
    this.rest.getrolebyorgid(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, rolename: 'Select Role'});
        this.role = this.respObject.details;
        if (type === 'i') {
          this.roleSelected = 0;
          console.log(this.role);
        } else {
          console.log(this.role);
          this.roleSelected = this.roleSelected1;
        }
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {

    });
  }

  save() {
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgSelected),
      roleid: Number(this.roleSelected),
      groupid: Number(this.grpSelected),
      logintypeid: Number(this.selectLoginType)
    };

    // console.log("DATA",JSON.stringify( data));
    if (!this.messageService.isBlankField(data)) {

      this.rest.addmapldapgrouprole(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          const id = this.respObject.details;
          this.messageService.setRow({
            id: id,
            clientid: Number(this.clientId),
            mstorgnhirarchyid: Number(this.orgSelected),
            mstorgnhirarchyname: this.orgName,
            groupid: Number(this.grpSelected),
            groupname: this.grpName,
            roleid: Number(this.roleSelected),
            rolename: this.roleName,
            logintype: this.loginName
          });
          // this.getTableData();
          this.reset();
          this.totalData = this.totalData + 1;
          this.messageService.setTotalData(this.totalData);
          this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
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

  update() {
    const data = {
      id: this.selectedId,
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgSelected),
      roleid: Number(this.roleSelected),
      groupid: Number(this.grpSelected),
      logintypeid: Number(this.selectLoginType)
    };
    // console.log(JSON.stringify(data));
    if (!this.messageService.isBlankField(data)) {

      this.rest.updatemapldapgrouprole(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          this.modalReference.close();
          this.messageService.sendAfterDelete(this.selectedId);
          this.dataLoaded = true;
          this.messageService.setRow({
            id: this.selectedId,
            clientid: Number(this.clientId),
            mstorgnhirarchyid: Number(this.orgSelected),
            mstorgnhirarchyname: this.orgName,
            groupid: Number(this.grpSelected),
            groupname: this.grpName,
            roleid: Number(this.roleSelected),
            rolename: this.roleName,
            logintype: this.loginName
          });
          //this.getTableData();
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
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgnId),
      offset: offset,
      limit: limit
    };
    this.rest.getallmapldapgrouprole(data).subscribe((res) => {
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
    if (this.userAuth) {
      this.userAuth.unsubscribe();
    }
  }

  onLoginTypeChange(index: any) {
    this.loginName = this.logins[index].name;
  }

  getLoginType(type) {
    this.rest.getlogintype().subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, name: 'Select Login Type'});
        this.logins = this.respObject.details;
        if (type === 'i') {
          this.selectLoginType = 0;
        } else {
          this.selectLoginType = this.logintypeid;
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
}
