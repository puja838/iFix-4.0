import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { RestApiService } from '../rest-api.service';
import { Filters, Formatters, OnEventArgs } from 'angular-slickgrid';
import { MessageService } from '../message.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-services-confige',
  templateUrl: './services-confige.component.html',
  styleUrls: ['./services-confige.component.css']
})
export class ServicesConfigeComponent implements OnInit {
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
  orgSelected: any;
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
  CredType: any;
  password: any;
  cPassword: any;
  accName: any;
  configType: any;
  hostname: any;
  portNo: any;
  CredName: any;
  Credentials = [];
  dataSet: any;
  clientOrgnId: any
  clients = [];
  clientName: any;
  notAdmin: boolean;
  rportNo: boolean;

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
              this.rest.deletemstclientcredential({ id: item.id }).subscribe((res) => {
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
    this.password = '';
    this.accName = '';
    this.rportNo = false;
    this.configType = 0;
    this.dataLoaded = true;
    this.pageSize = this.messageService.pageSize;
    this.displayData = {
      pageName: 'Services Configuration',
      openModalButton: 'Add Services Configuration',
      breadcrumb: 'Services Configuration',
      folderName: 'Services Configuration',
      tabName: 'Services Configuration',
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
          this.Credentials = [];
          this.reset();
          console.log("\n ARGS DATA CONTEXT  :: " + JSON.stringify(args.dataContext));
          this.selectedId = args.dataContext.id;

          this.clientSelected = args.dataContext.clientid;
          this.orgSelected = args.dataContext.mstorgnhirarchyid;
          this.orgName = args.dataContext.mstorgnhirarchyname;
          this.CredType = args.dataContext.credentialtypeid;
          this.accName = args.dataContext.credentialaccount;
          this.password = args.dataContext.credentialpassword;
          this.cPassword = this.password;
          this.hostname = args.dataContext.credentialkey;
          if(args.dataContext.credentialendpoint === ''){
            this.portNo = 'NA'
          }
          else{
            this.portNo = args.dataContext.credentialendpoint
          }
          this.configType = args.dataContext.defaultconfig;
          this.clientOrgnId = this.orgSelected;
          this.getOrganization('u');
          this.getCredential('u');
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
        id: 'credentialtypename', name: 'Credential Type', field: 'credentialtypename', sortable: true, filterable: true
      },
      {
        id: 'credentialaccount', name: 'Account (User Name)', field: 'credentialaccount', sortable: true, filterable: true
      },
      // {
      //   id: 'credentialpassword', name: 'Password', field: 'credentialpassword', sortable: true, filterable: true
      // },
      {
        id: 'credentialkey', name: 'Host (Key or Host Name or URL )', field: 'credentialkey', sortable: true, filterable: true
      },
      {
        id: 'credentialendpoint', name: 'End Point (Port or Entity ID)', field: 'credentialendpoint', sortable: true, filterable: true
      },
      {
        id: 'defaultconfigname', name: 'Configuration Type ', field: 'defaultconfigname', sortable: true, filterable: true
      }
    ];
    this.messageService.setColumnDefinitions(columnDefinitions);
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.orgnId = this.messageService.orgnId;
      this.baseFlag = this.messageService.baseFlag;
      if (this.baseFlag) {
        this.edit = true;
        this.del = true;
      } else {
        this.clientName = this.messageService.clientname;
        this.edit = this.messageService.edit;
        this.del = this.messageService.del;
      }
      this.onPageLoad();
    } else {
      this.userAuth = this.messageService.getClientUserAuth().subscribe(auth => {
        // this.view = auth[0].viewFlag;
        // this.add = auth[0].addFlag;
        this.clientId = auth[0].clientid;
        this.baseFlag = auth[0].baseFlag;
        this.orgnId = auth[0].mstorgnhirarchyid;
        if (this.baseFlag) {
          this.edit = true;
          this.del = true;
        } else {
          this.clientName = auth[0].clientname;
          this.del = auth[0].deleteFlag;
          this.edit = auth[0].editFlag;
        }
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
          this.respObject.details.unshift({ id: 0, name: 'Select Client' });
          this.clients = this.respObject.details;
          this.clientSelected = 0;
        } else {
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    } else {
      //this.notAdmin = true;
      this.clientSelected = this.clientId;
      this.clientName = this.messageService.clientname;
      this.clientOrgnId = this.messageService.orgnId;
      this.getOrganization('i');
    }
  }

  openModal(content) {
    //this.getOrganization('i');
    this.getCredential('i');
    this.reset();
    this.isEdit = false;
    this.modalService.open(content).result.then((result) => {
    }, (reason) => {

    });
  }

  reset() {
    this.clientSelected = 0;
    this.orgSelected = 0;
    this.organization = []
    this.CredType = 0;
    this.password = '';
    this.cPassword = '';
    this.accName = '';
    this.configType = 0;
    this.hostname = '';
    this.portNo = '';
    this.CredName = '';
    this.rportNo = false;
  }

  onClientChange(index: any) {
    this.clientName = this.clients[index].name;
    this.clientOrgnId = this.clients[index].orgnid;
    this.getOrganization('i');
  }
  onOrgChange(index) {
    this.orgName = this.organization[index].organizationname;
  }

  onCredentialChange(index) {
    this.CredName = this.Credentials[index - 1].typename;
    if (Number(this.CredType) === 1) {
      this.rportNo = true;
      this.portNo = 'NA'
    }
  }

  getCredential(type) {
    this.rest.getallmstclientcredentialtype().subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        //this.respObject.details.unshift({id: 0, organizationname: 'Select Organization'});
        this.Credentials = this.respObject.details;
        if (type === 'i') {
          this.CredType = 0;
        }
        else {
          //this.CredType = this.CredType;
        }
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getOrganization(type) {
    const data = {
      clientid: Number(this.clientSelected),
      mstorgnhirarchyid: Number(this.clientOrgnId)
    };
    this.rest.getorganizationclientwisenew(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({ id: 0, organizationname: 'Select Organization' });
        this.organization = this.respObject.details;
        if (type === 'i') {
          this.orgSelected = 0;
        }
        else {

        }
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }


  save() {

    if (this.configType === 1) {
      const data = {
        clientid: Number(this.clientSelected),
        mstorgnhirarchyid: Number(this.orgSelected),
        credentialtypeid: Number(this.CredType)
      }

      if (!this.messageService.isBlankField(data)) {
        data['defaultconfig'] = Number(this.configType)
        this.rest.insertmstclientcredential(data).subscribe((res) => {
          this.respObject = res;
          if (this.respObject.success) {
            this.isError = false;
            const id = this.respObject.details;
            // this.messageService.setRow({
            //   id: id,
            //   clientid: Number(this.clientSelected),
            //   mstorgnhirarchyid: Number(this.orgSelected),
            //   mstorgnhirarchyname: this.orgName,
            //   credentialtypeid: Number(this.CredType),
            //   credentialtypename: this.CredName,
            //   credentialaccount: this.accName,
            //   credentialpassword: this.password,
            //   credentialkey: this.hostname,
            //   credentialendpoint: this.portNo,
            //   defaultconfig: Number(this.configType),
            //   defaultconfigname: Number(this.configType) === 0 ? 'New Configuration' : 'Default Configuration'
            // });
            this.getTableData();
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

    else {
      const data = {
        clientid: Number(this.clientSelected),
        mstorgnhirarchyid: Number(this.orgSelected),
        credentialtypeid: Number(this.CredType),
        credentialpassword: this.password,
        credentialaccount: this.accName,
        credentialkey: this.hostname,
        credentialendpoint: this.portNo,
      }
      if ((this.password === this.cPassword)) {
        if (!this.messageService.isBlankField(data)) {
          data['defaultconfig'] = Number(this.configType)
          this.rest.insertmstclientcredential(data).subscribe((res) => {
            this.respObject = res;
            if (this.respObject.success) {
              this.isError = false;
              const id = this.respObject.details;
              // this.messageService.setRow({
              //   id: id,
              //   clientid: Number(this.clientSelected),
              //   mstorgnhirarchyid: Number(this.orgSelected),
              //   mstorgnhirarchyname: this.orgName,
              //   credentialtypeid: Number(this.CredType),
              //   credentialtypename: this.CredName,
              //   credentialaccount: this.accName,
              //   credentialpassword: this.password,
              //   credentialkey: this.hostname,
              //   credentialendpoint: this.portNo === ''? 'NA': this.portNo,
              //   defaultconfig: Number(this.configType),
              //   defaultconfigname: Number(this.configType) === 0 ? 'New Configuration' : 'Default Configuration'
              // });
              this.getTableData();
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
      else {
        this.notifier.notify('error', this.messageService.PASSWORD_MISMATCH);
      }
    }
  }

  update() {
    if (this.configType === 1) {
      this.dataSet = {
        id: Number(this.selectedId),
        clientid: Number(this.clientSelected),
        mstorgnhirarchyid: Number(this.orgSelected),
        credentialtypeid: Number(this.CredType)
      }
    }

    else {
      this.dataSet = {
        id: Number(this.selectedId),
        clientid: Number(this.clientSelected),
        mstorgnhirarchyid: Number(this.orgSelected),
        credentialtypeid: Number(this.CredType),
        credentialaccount: this.accName,
        credentialkey: this.hostname,
        credentialendpoint: this.portNo,
      }
    }
    //console.log(JSON.stringify(this.dataSet))
    if (!this.messageService.isBlankField(this.dataSet)) {
      this.dataSet['defaultconfig'] = Number(this.configType)
      if (this.password === this.cPassword) {
        this.rest.updatemstclientcredential(this.dataSet).subscribe((res) => {
          this.respObject = res;
          if (this.respObject.success) {
            this.isError = false;
            this.modalReference.close();
            this.messageService.sendAfterDelete(this.selectedId);
            this.dataLoaded = true;
            // this.messageService.setRow({
            //   id: this.selectedId,
            //   clientid: Number(this.clientId),
            //   mstorgnhirarchyid: Number(this.orgSelected),
            //   mstorgnhirarchyname: this.orgName,
            //   headername: this.accName,
            //   seqno: Number(this.password),
            //   templatetypeid: Number(this.CredType),
            //   templatetypename: this.CredName
            // });
            this.getTableData();
            this.notifier.notify('success', this.messageService.EDIT_SUCCESS);
          } else {
            this.isError = true;
            this.notifier.notify('error', this.respObject.message);
          }
        }, (err) => {
          this.isError = true;
          this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
      }
      else {
        this.notifier.notify('error', this.messageService.PASSWORD_MISMATCH);
      }
    } else {
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
    this.rest.getallmstclientcredential(data).subscribe((res) => {
      this.respObject = res;
      for(let i=0;i <this.respObject.details.values.length ; i++){
        this.respObject.details.values[i].credentialendpoint = this.respObject.details.values[i].credentialendpoint === ''? 'NA': this.respObject.details.values[i].credentialendpoint;
      }
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

}
