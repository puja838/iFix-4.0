import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {MessageService} from '../message.service';
import {NotifierService} from 'angular-notifier';
import {RestApiService} from '../rest-api.service';
import {Router} from '@angular/router';
import {Editors, Filters, Formatters, OnEventArgs} from 'angular-slickgrid';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {CustomInputEditor} from '../custom-inputEditor';
import {Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-process-activity',
  templateUrl: './process-activity.component.html',
  styleUrls: ['./process-activity.component.css']
})
export class ProcessActivityComponent implements OnInit {
  show: boolean;
  dataset: any[];
  totalData: number;
  respObject: any;

  displayData: any;

  add = false;
  del = false;
  edit = false;
  view = false;

  isError = false;
  errorMessage: string;

  private notifier: NotifierService;
  private clientId: number;
  private seq: number;

  pageSize: number;

  private baseFlag: any;
  private userAuth: Subscription;
  offset: number;
  // catalogName: string;
  dataLoaded: boolean;
  orgnId: number;
  isClient: boolean;
  selectedId: number;
  clientSelectedName: string;
  orgSelectedName: string;
  organaisation = [];
  orgSelected: any;
  orgName: any;
  @ViewChild('content') private content;
  private modalReference: NgbModalRef;
  orgId: number;
  isLoading = false;
  states = [];
  stateSelected: any;
  stateName: string;
  process = [];
  processName: string;
  processSelected: any;
  actionTypes = [];
  actionTypeSelected: any;
  private actionTypeid: number;
  isEdit: boolean;
  actionName: any;
  actionDesc: any;
  actionTypeSelected1: any;
  processSelected1: any;
  actionTypeName: any;

  constructor(private rest: RestApiService, private messageService: MessageService, private route: Router,
              private modalService: NgbModal, notifier: NotifierService) {
    this.notifier = notifier;
    this.messageService.getCellChangeData().subscribe(item => {
      switch (item.type) {

        case 'delete':
          // console.log('deleted');
          if (!this.del) {
            this.notifier.notify('error', 'You do not have delete permission');
          } else {
            if (confirm('Are you sure?')) {
              this.rest.deleteactivity({
                id: item.id
              }).subscribe((res) => {
                this.respObject = res;
                if (this.respObject.success) {
                  this.totalData = this.totalData - 1;
                  this.messageService.setTotalData(this.totalData);
                  this.messageService.sendAfterDelete(item.id);
                  this.notifier.notify('success', this.messageService.DELETE_SUCCESS);

                } else {
                  this.notifier.notify('error', this.respObject.message);
                }
              }, (err) => {
                this.notifier.notify('error', this.respObject.errorMessage);
              });
            }
          }
          break;
      }
    });


  }

  ngOnInit() {
    this.clientId = this.messageService.clientId;
    this.orgnId = this.messageService.orgnId;
    this.dataLoaded = false;

    this.pageSize = this.messageService.pageSize;

    // this.getBaseParent();

    this.displayData = {
      pageName: 'Maintain Process Activity',
      openModalButton: 'Add Process Activity',
      breadcrumb: ' ',
      folderName: 'All Process Activity',
      tabName: 'Process Activity',
    };
    let columnDefinitions = [];
    columnDefinitions = [
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
          console.log(args.dataContext);
          this.reset();
          this.selectedId = args.dataContext.id;
          this.orgSelected = Number(args.dataContext.mstorgnhirarchyid);
          this.orgName = args.dataContext.mstorgnhirarchyname;
          this.processSelected1 = Number(args.dataContext.processid);
          this.processName = args.dataContext.processname;
          this.actionTypeSelected = Number(args.dataContext.actiontypeid);
          this.actionTypeName = args.dataContext.actiontypename;
          this.actionName = args.dataContext.actionname;
          this.actionDesc = args.dataContext.description;
          this.getProcess('u');
          this.isEdit = true;
          this.modalReference = this.modalService.open(this.content, {});
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },
      // {
      //   id: 'clientname', name: 'Client Name', field: 'clientname', sortable: true, filterable: true
      // },
      {
        id: 'organization', name: 'Organization', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'process', name: 'Process', field: 'processname', sortable: true, filterable: true
      },
      {
        id: 'actionType', name: 'Action Type', field: 'actiontypename', sortable: true, filterable: true
      },
      {
        id: 'actionName', name: 'Action Name', field: 'actionname', sortable: true, filterable: true
      },
      {
        id: 'actionDesc', name: 'Action Description', field: 'description', sortable: true, filterable: true
      }

    ];


    this.messageService.setColumnDefinitions(columnDefinitions);
    // this.onPageLoad();
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.baseFlag = this.messageService.baseFlag;
      this.orgId = this.messageService.orgnId;
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
        this.baseFlag = auth[0].baseFlag;
        this.orgId = auth[0].mstorgnhirarchyid;
        this.onPageLoad();
      });
    }
  }

  onPageLoad() {
    // console.log(this.clientId);
    this.rest.getorganizationclientwisenew({clientid: Number(this.clientId),mstorgnhirarchyid: Number(this.orgId)}).subscribe((res) => {
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
    // this.getActionType();
    // this.getTableData();
  }

  changeRouting(path: string) {
    this.messageService.changeRouting(path);
  }


  reset() {
    this.orgSelected = 0;
    this.processSelected = [];
    this.actionTypeSelected = '';
    this.actionTypeSelected1 = '';
    this.processSelected1 = '';
    this.process = [];
    this.actionName = '';
    this.actionDesc = '';
  }

  onprocessChange(index: any) {
    this.processName = this.process[index - 1].name;
  }


  openModal(content) {
    this.isEdit = false;

    this.reset();
    this.modalService.open(content).result.then((result) => {
    }, (reason) => {
    });
  }

  onOrgChange(index: any) {
    this.orgName = this.organaisation[index].organizationname;
    this.getProcess('i');
    this.getActionType();
  }

  getProcess(type) {
    const data = {
      'clientid': Number(this.clientId),
      'mstorgnhirarchyid': Number(this.orgSelected),
      'type': 1
    };
    this.rest.getworklowutilitylist(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.process = this.respObject.details;
        if (type === 'i') {
          this.processSelected = [];
        } else {
          this.processSelected = this.processSelected1;
        }
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });

  }

  getActionType() {

    this.rest.getactiontypenames({"clientid":this.clientId,"mstorgnhirarchyid":Number(this.orgSelected)}).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.actionTypes = this.respObject.details;
        this.actionTypeSelected = '';
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });

  }

  update() {
    for(let i = 0; i<this.process.length;i++){
      if(this.process[i].id === Number(this.processSelected))
      {
        this.processName = this.process[i].name;
        // console.log(this.processName)
        break
      }
    }

    const data = {
      'id': this.selectedId,
      'clientid': Number(this.clientId),
      'mstorgnhirarchyid': Number(this.orgSelected),
      'actiontypeid': Number(this.actionTypeSelected),
      'processid': Number(this.processSelected),
      'actionname': this.actionName,
      'description': this.actionDesc
    };
    console.log('data' + JSON.stringify(data));
    if (!this.messageService.isBlankField(data)) {
      this.rest.updateactivity(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          this.modalReference.close();
          this.messageService.sendAfterDelete(this.selectedId);
          this.dataLoaded = true;
          this.messageService.setRow({
            id: this.selectedId,
            mstorgnhirarchyid: this.orgSelected,
            processid: this.processSelected,
            actiontypeid: this.actionTypeSelected,
            mstorgnhirarchyname: this.orgName,
            actionname: this.actionName,
            description: this.actionDesc,
            processname: this.processName,
            actiontypename: this.actionTypeName
          });
          this.notifier.notify('success', this.messageService.EDIT_SUCCESS);
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

  save() {
    for(let i = 0; i<this.process.length;i++){
      if(this.process[i].id === Number(this.processSelected))
      {
        this.processName = this.process[i].name;
        // console.log(this.processName)
        break
      }
    }

    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgSelected),
      actiontypeid: Number(this.actionTypeSelected),
      processid: Number(this.processSelected),
      actionname: this.actionName,
      description: this.actionDesc
    };

    console.log('data' + JSON.stringify(data));
    if (!this.messageService.isBlankField(data)) {
      this.rest.addactivity(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          const id = this.respObject.details;
          this.messageService.setRow({
            id: id,
            mstorgnhirarchyid: this.orgSelected,
            processid: this.processSelected,
            actiontypeid: this.actionTypeSelected,
            mstorgnhirarchyname: this.orgName,
            actionname: this.actionName,
            description: this.actionDesc,
            processname: this.processName,
            actiontypename: this.actionTypeName
          });

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
      'clientid': Number(this.clientId),
      'mstorgnhirarchyid': Number(this.orgId),
      'offset': offset,
      'limit': limit,
    };

    this.rest.getactivity(data).subscribe((res) => {
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
    if (this.userAuth) {
      this.userAuth.unsubscribe();
    }
  }

  onactionTypeChange(Index: any) {
    this.actionTypeName = this.actionTypes[Index - 1].actiontypename;
  }
}
