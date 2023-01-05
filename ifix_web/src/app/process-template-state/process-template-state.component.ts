import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NotifierService} from "angular-notifier";
import {Subscription} from "rxjs";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {RestApiService} from "../rest-api.service";
import {MessageService} from "../message.service";
import {Router} from "@angular/router";
import {Formatters, OnEventArgs} from "angular-slickgrid";

@Component({
  selector: 'app-process-template-state',
  templateUrl: './process-template-state.component.html',
  styleUrls: ['./process-template-state.component.css']
})
export class ProcessTemplateStateComponent implements OnInit, OnDestroy {

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
  stateTyps = [];
  stateTypSelected: any;
  private statetypeid: number;
  isEdit: boolean;
  private seqno: number;

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
              this.rest.deletemapprocesstemplatestate({
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
      pageName: 'Maintain Template State Mapping',
      openModalButton: 'Add Template State Mapping',
      breadcrumb: ' ',
      folderName: 'All Template State Mapping',
      tabName: 'Template State Mapping',
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
          // this.catalogName = args.dataContext.catalogname;
          this.orgSelected = Number(args.dataContext.mstorgnhirarchyid);
          this.stateSelected = Number(args.dataContext.statetid);
          this.statetypeid = Number(args.dataContext.statetypeid);
          this.processSelected = Number(args.dataContext.processid);
          this.processName = args.dataContext.processname;
          this.stateName = args.dataContext.statename;
          this.orgName = args.dataContext.mstorgnhirarchyname;
          this.getutility(6, 'u');
          this.getutility(2, 'u');
          this.getstate(Number(this.statetypeid));
          this.isEdit = true;
          this.modalReference = this.modalService.open(this.content, {});
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },
      // {id: 'id', name: 'Id', field: 'id', sortable: true, maxWidth: 40, filterable: true},
      // {
      //   id: 'clientname', name: 'Client Name', field: 'clientname', sortable: true, filterable: true
      // },
      {
        id: 'organization', name: 'Organization', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'process', name: 'Template', field: 'processname', sortable: true, filterable: true
      },
      {
        id: 'state', name: 'State', field: 'statename', sortable: true, filterable: true
      },

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


    // this.getTableData();
  }

  changeRouting(path: string) {
    this.messageService.changeRouting(path);
  }


  reset() {
    this.orgSelected = 0;
    this.stateName = '';
    this.stateSelected = '';
    this.statetypeid = 0;
    this.processSelected = [];
    this.process = [];
    this.states = [];
    this.stateTyps = [];
    this.stateTypSelected = '';
    this.seqno = 0;
  }


  onstateChange(index: any) {
    this.stateName = this.states[index - 1].name;
    this.seqno = this.states[index - 1].seqno;
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
    this.getutility(2, 'i');
    this.getutility(6, 'i');
    // this.getprocess();
  }

  getutility(type, val) {
    const data = {
      'clientid': Number(this.clientId),
      'mstorgnhirarchyid': Number(this.orgSelected),
      'type': type
    };
    this.rest.getworklowutilitylist(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        if (type === 2) {
          this.stateTyps = this.respObject.details;
          if (val === 'u') {
            this.stateTypSelected = this.statetypeid;
          }
        } else if (type === 6) {
          this.process = this.respObject.details;
        }
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });

  }

  getstate(fieldid) {
    const data = {
      'clientid': Number(this.clientId),
      'mstorgnhirarchyid': Number(this.orgSelected),
      'fieldid': fieldid,
      'type': 3

    };
    this.rest.getutilitydatabyfield(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {

        this.states = this.respObject.details;
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
      'statetid': Number(this.stateSelected),
      'processid': Number(this.processSelected),
      //'seqno': this.seqno

    };
    console.log('data' + JSON.stringify(data));
    if (!this.messageService.isBlankField(data)) {
      this.rest.updatemapprocesstemplatestate(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          this.modalReference.close();
          this.messageService.sendAfterDelete(this.selectedId);
          this.dataLoaded = true;
          this.messageService.setRow({
            id: this.selectedId,
            mstorgnhirarchyid: this.orgSelected,
            statetid: this.stateSelected,
            processid: this.processSelected,
            statetypeid: this.stateTypSelected,
            mstorgnhirarchyname: this.orgName,
            processname: this.processName,
            statename: this.stateName
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
      statetid: Number(this.stateSelected),
      processid: Number(this.processSelected),
      // seqno: this.seqno
    };

    // console.log('data' + JSON.stringify(data));
    if (!this.messageService.isBlankField(data)) {
      this.rest.insertmapprocesstemplatestate(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          // this.isError = false;
          const id = this.respObject.details;
          this.messageService.setRow({
            id: id,
            mstorgnhirarchyid: this.orgSelected,
            statetid: this.stateSelected,
            processid: this.processSelected,
            statetypeid: this.stateTypSelected,
            mstorgnhirarchyname: this.orgName,
            processname: this.processName,
            statename: this.stateName
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
    this.dataLoaded = false;

    const data = {
      'clientid': Number(this.clientId),
      'mstorgnhirarchyid': Number(this.orgId),
      'offset': offset,
      'limit': limit,
    };

    // console.log('...........' + JSON.stringify(data) + '...' + this.clientId);
    this.rest.getallmapprocesstemplatestate(data).subscribe((res) => {
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

  onstateTypChange(selectedIndex: any) {
    this.getstate(Number(this.stateTypSelected));
  }

}
