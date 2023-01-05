import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {RestApiService} from '../rest-api.service';
import {Filters, Formatters, OnEventArgs} from 'angular-slickgrid';
import {MessageService} from '../message.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-mapuserproperty',
  templateUrl: './mapuserproperty.component.html',
  styleUrls: ['./mapuserproperty.component.css']
})
export class MapuserpropertyComponent implements OnInit {
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
  clientSelectedName: string;
  selectedId: number;
  orgnId: number;
  private modalReference: NgbModalRef;
  isEdit: boolean;
  colordata: any;
  notAdmin:boolean;
  organaisation = [];
  loginname: string;
  clientOrgnId: any;
  propertyList = [];
  propertySelect = 0;
  propertyName = '';
  roleSelected = [];
  roleName = '';
  role = [];
  clients = [];
  clientName = '';
  @ViewChild('content') private content;
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
                this.rest.deleteUserRoleProperty({id: item.id}).subscribe((res) => {
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
    this.dataLoaded = true;
    this.pageSize = this.messageService.pageSize;
    this.displayData = {
      pageName: 'Maintain User Property Map',
      openModalButton: 'Add User Property Map',
      breadcrumb: 'User Property Map',
      folderName: 'All User Property Map',
      tabName: 'User Property Map',
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
          console.log("\n ARGS DATA CONTEXT  :: "+JSON.stringify(args.dataContext));
          this.selectedId = args.dataContext.id;
          this.clientSelected = args.dataContext.clientid;
          this.orgName = args.dataContext.mstorgnhirarchyname;
          this.orgSelected1 = args.dataContext.mstorgnhirarchyid;
          this.roleSelected = args.dataContext.roleid;
          this.roleName = args.dataContext.rolename;
          this.propertySelect = args.dataContext.propertyid
          this.propertyName = args.dataContext.propertyname
          if (this.baseFlag) {
            this.clientSelected = args.dataContext.clientid;

            for(let i = 0;i<this.clients.length;i++){
              if(this.clients[i].id === this.clientSelected){
                this.orgId = this.clients[i].orgnid
              }
            }
          }
          else{
            this.clientSelected = this.clientId;
          }
          this.getOrganization('u',this.clientSelected, this.orgnId);
          this.getPropertyName('u');
          this.getRole(this.orgSelected1)
          this.isEdit = true;
          this.modalReference = this.modalService.open(this.content, {});
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },
      {
        id: 'mstorgnhirarchyname', name: 'Organization', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'rolename', name: 'Role', field: 'rolename', sortable: true, filterable: true
      },
      {
        id: 'propertyname', name: 'Property Name', field: 'propertyname', sortable: true, filterable: true
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
      this.getOrganization('i',this.clientId, this.orgnId);
    }
    console.log(this.baseFlag)
  }

  onClientChange(value: any) {
    this.clientName = this.clients[value].name;
    this.clientOrgnId = this.clients[value].orgnid
    this.getOrganization('i',this.clientSelected, this.clientOrgnId);
  }


  openModal(content) {
    this.isError = false;
    this.isEdit = false;
    this.reset();
    // this.getOrganization('i',this.clientId, this.orgnId);
    this.getPropertyName('i')
    this.modalService.open(content).result.then((result) => {
    }, (reason) => {
    });
  }

  save() {
    const data = {
      clientid: Number(this.clientSelected),
      mstorgnhirarchyid: Number(this.orgSelected),
      roleid: this.roleSelected,
      propertyid: Number(this.propertySelect)
    };
    console.log('data===========' + JSON.stringify(data));
    if (!this.messageService.isBlankField(data)) {
      this.rest.insertUserRoleProperty(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          const id = this.respObject.details;
            // this.messageService.setRow({
            //   id: id,
            //   mstorgnhirarchyname: this.orgName,
            //   rolename: this.roleName,
            //   Username: this.userName
            // });
            this.getTableData()
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
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    } else {
      this.isError = true;
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }
  }

  update() {
    const data = {
      id: this.selectedId,
      clientid: Number(this.clientSelected),
      mstorgnhirarchyid: Number(this.orgSelected),
      roleid: this.roleSelected,
      propertyid: Number(this.propertySelect)
    };
    //console.log(data)
    if (!this.messageService.isBlankField(data)) {
        this.rest.updateUserRoleProperty(data).subscribe((res) => {
          this.respObject = res;
          if (this.respObject.success) {
            this.isError = false;
            this.modalReference.close();
            this.messageService.sendAfterDelete(this.selectedId);
            this.dataLoaded = true;
            this.getTableData();
            this.notifier.notify('success', this.messageService.EDIT_SUCCESS);
          } else {
            //this.isError = true;
            this.notifier.notify('error', this.respObject.message);
          }
        }, (err) => {
          //this.isError = true;
          this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
    } else {
      //this.isError = true;
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }
  }

  reset() {
    if (this.baseFlag) {
      this.clientSelected = 0;
      this.organaisation = []
    }
    this.roleSelected = [];
    this.role = [];
    this.orgSelected = 0;
    this.isEdit = false;
    this.propertySelect = 0;
  }

  onRoleChange(selectedIndex: any) {
    console.log(selectedIndex)
    this.roleName = this.role[selectedIndex].rolename;
  }

  onPropertyName(selectedIndex : any){
    console.log(selectedIndex)
    this.propertyName = this.propertyList[selectedIndex].propertyname;
  }

  onOrgChange(index: any) {
    this.orgName = this.organaisation[index].organizationname;
    this.getRole(this.orgSelected)
  }

  getRole(orgSelected){
    const data = {
      'clientid': Number(this.clientSelected),
      'mstorgnhirarchyid': Number(orgSelected)
    };
    this.rest.getrolebyorgid(data).subscribe((res) => {
      this.respObject = res;
      this.role = this.respObject.details;
      this.selectAll(this.role);
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  selectAll(items: any[]) {
    let allSelect = items => {
      items.forEach(element => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
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
    this.rest.getUserRoleProperty(data).subscribe((res) => {
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


  getOrganization(type,clientId, orgId) {
    const data = {
      clientid: Number(clientId),
      mstorgnhirarchyid: Number(orgId)
    };
    this.rest.getorganizationclientwisenew(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.organaisation = this.respObject.details;
        if (type === 'i') {
          this.respObject.details.unshift({id: 0, organizationname: 'Select Organization'});
          this.orgSelected = 0;
        } else {
          this.orgSelected = this.orgSelected1;
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

  getPropertyName(type){
    const data = {
      clientid: Number(this.clientSelected),
      mstorgnhirarchyid: Number(this.clientOrgnId)
    };
    this.rest.getUserPropertyName(data).subscribe((res) => {
      this.respObject = res;
      // this.propertySelect = 0;
      if (this.respObject.success) { 
        this.propertyList = this.respObject.details;
        if (type === 'i') {
          this.respObject.details.unshift({id: 0, propertyname: 'Select Property Name'});
          this.propertySelect = 0;
        } else {
          // this.orgSelected = this.orgSelected1;
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

  ngOnDestroy(): void {
    if (this.userAuth) {
      this.userAuth.unsubscribe();
    }
  }
}





