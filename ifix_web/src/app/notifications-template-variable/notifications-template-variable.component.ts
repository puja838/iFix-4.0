import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { RestApiService } from '../rest-api.service';
import { Filters, Formatters, OnEventArgs } from 'angular-slickgrid';
import { MessageService } from '../message.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications-template-variable',
  templateUrl: './notifications-template-variable.component.html',
  styleUrls: ['./notifications-template-variable.component.css']
})
export class NotificationsTemplateVariableComponent implements OnInit {
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
  baseFlag: boolean;
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
  orgSelectedName: string;
  recordtermvalue: string;
  organizationName: string;
  selectedId: number;
  updateFlag = 0;
  orgnId: number;
  isMandatory: boolean;
  isMandatory1: boolean;
  @ViewChild('content1') private content1;
  private adminAuth: Subscription;
  private modalReference: NgbModalRef;
  propLevels = [];
  levelid: number;
  varbName: any;
  varbQuery: any;
  varbParam: any;
  isEdit: boolean;
  queryType: any;
  VariableName = '{{VariableName}}';
  tempVarSelected = [];
  variableList = [];
  varName = '';
  organizationTo = [];
  toOrgSelected = 0;
  clients = [];
  clientOrgnId : number;
  private client: string;
  clientName = '';
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
              //console.log(JSON.stringify(item));
              this.rest.deletemsttemplatevariable({ id: item.id }).subscribe((res) => {
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
      pageName: 'Notification Template Variable',
      openModalButton: 'Add Template Variable',
      breadcrumb: 'Notification Template Variable',
      folderName: 'Notification Template Variable',
      tabName: 'Notification Template Variable',
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
          // console.log("\n ARGS DATA CONTEXT  :: " + JSON.stringify(args.dataContext));
          this.selectedId = args.dataContext.id;
          this.clientSelected = args.dataContext.clientid;
          this.orgName = args.dataContext.mstorgnhirarchyname;
          this.orgSelected = args.dataContext.mstorgnhirarchyid;
          const queryType = args.dataContext.queryflag;
          this.queryType = queryType === "With Query" ? 1 : 0;
          this.varbName = args.dataContext.templatename;
          this.varbQuery = args.dataContext.query;
          this.varbParam = args.dataContext.params;
          this.isEdit = true;
          console.log(">>>", this.baseFlag)
          if (this.baseFlag) {
            this.clientSelected = args.dataContext.clientid;

            for (let i = 0; i < this.clients.length; i++) {
              if (this.clients[i].id === this.clientSelected) {
                this.clientOrgnId = this.clients[i].orgnid
              }
            }
          }
          else {
            this.clientSelected = this.clientId;
          }

          this.getOrganization(this.clientSelected, this.clientOrgnId,'u');
          this.modalReference = this.modalService.open(this.content1, {});
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },
      {
        id: 'mstorgnhirarchyname', name: 'Organization ', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'templatename', name: 'Template Variable', field: 'templatename', sortable: true, filterable: true
      },
      {
        id: 'query', name: 'Query', field: 'query', sortable: true, filterable: true
      },
      {
        id: 'params', name: 'Query Parameters', field: 'params', sortable: true, filterable: true
      },
      {
        id: 'queryflag', name: 'Template Type', field: 'queryflag', sortable: true, filterable: true
      }
    ];
    this.messageService.setColumnDefinitions(columnDefinitions);
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
      this.getOrganization(this.clientSelected,this.clientOrgnId,'i');
    }
  }

  openModal(content) {
    this.reset();
    // this.getOrganization('i');
    this.queryType = 0;
    this.isEdit = false;
    //this.getRecordTypes();
    // console.log(">>>", this.baseFlag)
    this.modalService.open(content).result.then((result) => {
    }, (reason) => {

    });
  }

  onClientChange(index: any) {
    this.clientName = this.clients[index].name;
    this.clientOrgnId = this.clients[index].orgnid;
    this.getOrganization(this.clientSelected,this.clientOrgnId,'i');
  }


  save() {
    const data = {};
    if (this.queryType === 0) {
      data['clientid'] = Number(this.clientSelected),
        data['mstorgnhirarchyid'] = Number(this.orgSelected),
        data['templatename'] = this.varbName
    }
    else {
      data['clientid'] = Number(this.clientSelected),
        data['mstorgnhirarchyid'] = Number(this.orgSelected),
        data['templatename'] = this.varbName,
        data['query'] = this.varbQuery,
        data['params'] = this.varbParam
    }
    //console.log('data==============' + JSON.stringify(data));
    if (!this.messageService.isBlankField(data)) {
      data['queryflag'] = this.queryType
      // console.log('data==============' + JSON.stringify(data));
      this.rest.addmsttemplatevariable(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          const id = this.respObject.details;
          this.messageService.setRow({
            id: id,
            clientid: Number(this.clientSelected),
            mstorgnhirarchyid: Number(this.orgSelected),
            mstorgnhirarchyname: this.orgName,
            templatename: this.varbName,
            query: this.varbQuery,
            params: this.varbParam,
            queryflag: this.queryType === 1 ? 'With Query' : 'Without Query'
          });
          //this.getTableData();
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
    const data = {};
    if (this.queryType === 0) {
      data['id'] = this.selectedId,
        data['clientid'] = Number(this.clientSelected),
        data['mstorgnhirarchyid'] = Number(this.orgSelected),
        data['templatename'] = this.varbName
    }
    else {
      data['id'] = this.selectedId
      data['clientid'] = Number(this.clientSelected),
        data['mstorgnhirarchyid'] = Number(this.orgSelected),
        data['templatename'] = this.varbName,
        data['query'] = this.varbQuery,
        data['params'] = this.varbParam
    }
    if (!this.messageService.isBlankField(data)) {
      data['queryflag'] = this.queryType;
      // console.log('data==============' + JSON.stringify(data));
      this.rest.updatemsttemplatevariable(data).subscribe((res) => {
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
          //   templatename : this.varbName,
          //   query : this.varbQuery,
          //   params : this.varbParam,
          //   queryflag: this.queryType
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
    } else {
      this.isError = true;
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }
  }

  copy() {
    if (this.tempVarSelected.length === 0) {
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }

    else {
      const data = {
        clientid: Number(this.clientSelected),
        mstorgnhirarchyid: Number(this.orgSelected),
        toclientid: Number(this.clientSelected),
        tomstorgnhirarchyid: Number(this.toOrgSelected),
        templatenames: this.tempVarSelected
      };

      // console.log("DATA", JSON.stringify(data));
      if (!this.messageService.isBlankField(data)) {
          if (this.orgSelected != Number(this.toOrgSelected)) {
            this.rest.addmsttemplatevariablecopy(data).subscribe((res) => {
              this.respObject = res;
              if (this.respObject.success) {
                this.isError = false;
                const id = this.respObject.details;
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

          }
          else {
            this.notifier.notify('error', this.messageService.SAME_ORGANIZATION);
          }
      } else {
        this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
      }
    }

  }

  reset() {
    if (this.baseFlag) {
      this.clientSelected = 0;
      this.organization = [];
    }
    this.orgSelected = 0;
    this.queryType = 0;
    this.varbName = '';
    this.varbParam = '';
    this.varbQuery = '';
    this.tempVarSelected = [];
    this.toOrgSelected = 0;
  }

  tabClick(event) {
    if (event.tab.textLabel === 'Add Tempalate') {
      this.reset();
    }
    else if (event.tab.textLabel === 'Template Copy') {
      this.reset();
    }
  }

  onOrgChange(index) {
    this.orgName = this.organization[index - 1].organizationname;
    this.getTempVariable();
  }

  onOrgChangeTo(index){
    this.orgName = this.organizationTo[index - 1].organizationname;
  }


  onTempVarChange(index) {
    this.varName = this.variableList[index - 1].organizationname
  }

  getOrganization(clintId, orgnid,type) {
    this.rest.getorganizationclientwisenew({ clientid: Number(clintId), mstorgnhirarchyid: Number(orgnid) }).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.organization = this.respObject.details;
        this.organizationTo = this.respObject.details;
        this.selectAll(this.organizationTo)
        if (type === 'i') {
          this.orgSelected = 0;
          this.toOrgSelected = 0;
          // console.log("Type======",type)
        }
        else {
          // this.orgSelected = this.orgSelected1;
          // console.log("Type======",type)
        }
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      // this.isError = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getTempVariable() {
    this.rest.gettemplatevariablelist({ clientid: Number(this.clientSelected), mstorgnhirarchyid: Number(this.orgSelected) }).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.variableList = this.respObject.details;
        this.selectAll(this.variableList)
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      // this.isError = true;
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
      "clientid": Number(this.clientId),
      "mstorgnhirarchyid": Number(this.orgnId),
      "offset": offset,
      "limit": limit,
    };
    //console.log("********",data)
    this.rest.getallmsttemplatevariable(data).subscribe((res) => {
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
        //console.log("###",this.totalData);
      }
      for (let i = 0; i < respObject.details.values.length; i++) {
        respObject.details.values[i].queryflag = (respObject.details.values[i].queryflag === 1) ? "With Query" : "Without Query";
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
