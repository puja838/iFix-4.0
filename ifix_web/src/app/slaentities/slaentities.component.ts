import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {NotifierService} from 'angular-notifier';
import {RestApiService} from '../rest-api.service';
import {Filters, Formatters, OnEventArgs} from 'angular-slickgrid';
import {MessageService} from '../message.service';
import {Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';
import {CustomInputEditor} from '../custom-inputEditor';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-slaentities',
  templateUrl: './slaentities.component.html',
  styleUrls: ['./slaentities.component.css']
})
export class SlaentitiesComponent implements OnInit {
  // areaSelected: number;
  // parentSelected: number;
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
  dataLoaded: boolean;
  orgnId: number;
  isClient: boolean;
  selectedId: number;
  clientSelectedName: string;
  orgSelectedName: string;
  organaisation = [];
  orgSelected: any;
  orgName: any;
  @ViewChild('content1') private content1;
  private modalReference: NgbModalRef;
  orgId: number;

  selectTable1: number;
  selctColumn: number;
  slaEntitiesName: any;
  slaEntitiesNames = [];
  selectTable: any; 
  selectDatabase: any; 
  colVal: any;
  slaName: any;
  tableName: any;
  colValName: any;
  selectDatabase1: any;
  databaseName: any;
  databases = [];
  tables = [];
  colVals = [];
  tableSelected: number;
  columnSelected: number;
  slaVal: number;

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
              this.rest.deletemstslaentity({
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
                this.notifier.notify('error', this.messageService.SERVER_ERROR);
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
    // if(Number(this.orgnId) === 1){

    //     this.isClient = false;
    // }else{
    //     this.isClient = true;
    // }
    // this.isShow = false;
    this.dataLoaded = false;

    this.pageSize = this.messageService.pageSize;

    // this.getBaseParent();

    this.displayData = {
      pageName: 'Maintain SLA Entities',
      openModalButton: 'Add SLA Entities',
      breadcrumb: 'SLA Entities',
      folderName: 'All SLA Entities',
      tabName: 'SLA Entities',
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
          this.reSet();
          // this.slaEntitiesNames =[];
          // console.log(args.dataContext)
          this.selectedId = args.dataContext.id;
          this.slaVal = args.dataContext.slaid;
          this.selectDatabase = args.dataContext.dbid;
          this.selectTable = args.dataContext.associatedmstclienttableid;
          this.selctColumn = args.dataContext.associatedmstclienttablefieldid;
          this.orgSelected = Number(args.dataContext.mstorgnhirarchyid);
          this.orgName = args.dataContext.mstorgnhirarchyname;
          this.tableName = args.dataContext.tablename;
          this.colValName = args.dataContext.fieldname;


          this.getSlaName('u');
          this.getDatabase('u');
          this.getTable('u');
          this.getColumn('u');

          this.modalReference = this.modalService.open(this.content1, {});
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },
      // {
      //   id: 'clientName', name: 'Client', field: 'clientname', sortable: true, filterable: true
      // },
      {
        id: 'organization', name: 'Organization', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      // {
      //   id: 'slaName', name: 'SLA Entities Name ', field: 'slaid', sortable: true, filterable: true
      // },
      // {
      //   id: 'dataBase', name: 'Database ', field: 'dbid', sortable: true, filterable: true
      // },
      {
        id: 'associatedTable', name: 'Associated Table ', field: 'tablename', sortable: true, filterable: true
      },
      {
        id: 'associatedIdentification', name: 'Associated Identification ', field: 'fieldname', sortable: true, filterable: true
      }
    ];


    this.messageService.setColumnDefinitions(columnDefinitions);
    // this.onPageLoad();
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.baseFlag = this.messageService.baseFlag;
      this.orgId = this.messageService.orgnId;
      this.edit =this.messageService.edit;
      this.del =this.messageService.del;
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
    console.log(this.clientId);
    this.slaEntitiesName = 0;
    this.selectTable = 0;
    this.colVal = 0;
    const data = {
      clientid: Number(this.clientId) , 
      mstorgnhirarchyid: Number(this.orgId)
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


    this.getTableData();
  }

  getSlaName(type) {
    this.rest.getslanames({clientid: Number(this.clientId), mstorgnhirarchyid: Number(this.orgSelected)}).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, slaname: 'Select SLA Name'});
        this.slaEntitiesNames = this.respObject.details;
        if(type === 'i') {
          this.slaEntitiesName = 0;
        }
        else {
          this.slaEntitiesName = this.slaVal; 
        }
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }


  getDatabase(type) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.orgSelected),
      type: 4
    };
    this.rest.getworklowutilitylist(data).subscribe((res: any) => {
      if (res.success) {
        res.details.unshift({id: 0, name: 'Select Database'});
        this.databases = res.details;
        if (type === 'i') {
          this.selectDatabase = 0;
        } else {
          // this.selectDatabase = this.selectDatabase1;
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getTable(type) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.orgSelected),
      type: 1,
      fieldid: Number(this.selectDatabase)
    };
    this.rest.getutilitydatabyfield(data).subscribe((res: any) => {
      if (res.success) {
        res.details.unshift({id: 0, name: 'Select Table'});
        this.tables = res.details;
        if (type === 'i') {
          this.selectTable = 0;
        } else {
          // this.selectTable = this.selectTable1;
        }
        // this.tableSelected = this.selectTable1;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getColumn(type) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.orgSelected),
      type: 2,
      fieldid: Number(this.selectTable)
    };
    this.rest.getutilitydatabyfield(data).subscribe((res: any) => {
      if (res.success) {
        res.details.unshift({id: 0, name: 'Select Column'});
        this.colVals = res.details;
        if (type === 'i') {
          this.colVal = 0;
        } else {
          this.colVal = this.selctColumn;
        }
        // this.columnSelected = this.selctColumn;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }


  onEntitiesChange(index) {
    this.slaName = this.slaEntitiesNames[index].slaname;
  }

  changeRouting(path: string) {
    this.messageService.changeRouting(path);
  }


  openModal(content) {
      this.isError = false;
      this.reSet();

      this.modalService.open(content).result.then((result) => {
      }, (reason) => {
      });
  }

  reSet() {    
    this.slaEntitiesName = 0;
    this.selectDatabase = 0;
    this.orgSelected = 0;
    this.selectTable = 0;
    this.colVal = 0;

    this.slaEntitiesNames = [];
    this.databases = [];
    this.tables = [];
    this.colVals = [];
  }

  onOrgChange(index: any) {
    this.orgName = this.organaisation[index].organizationname;
    this.getSlaName('i');
    this.getDatabase('i');
  }


  update() {
    const data = {
      id: this.selectedId,
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgSelected),
      slaid: Number(this.slaEntitiesName),
      associatedmstclienttableid: Number(this.selectTable),
      associatedmstclienttablefieldid: Number(this.colVal),
      dbid: Number(this.selectDatabase)
    };

    console.log("Update =======>>>" + JSON.stringify(data));

    // if(this.isClient){
    //   data["clientid"] = this.clie
    // }

    if (!this.messageService.isBlankField(data)) {

      this.rest.updatemstslaentity(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          this.modalReference.close();

          //console.log("id "+ )
          this.messageService.sendAfterDelete(this.selectedId);
          this.dataLoaded = true;
          this.messageService.setRow({
            id: Number(this.selectedId),
            mstorgnhirarchyid: Number(this.orgSelected),
            slaname: this.slaName,
            slaid: Number(this.slaEntitiesName),
            tablename: this.tableName,
            fieldname: this.colValName,
            associatedmstclienttableid: Number(this.selectTable),
            associatedmstclienttablefieldid: Number(this.colVal),
            mstorgnhirarchyname: this.orgName,
            dbid: Number(this.selectDatabase)
          });

          // console.log(">>>>>>>>>", this.messageService.setRow);

          this.notifier.notify('success', this.messageService.EDIT_SUCCESS);

          this.reSet();

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
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgSelected),
      slaid: Number(this.slaEntitiesName),
      associatedmstclienttableid: Number(this.selectTable),
      associatedmstclienttablefieldid: Number(this.colVal)
    }

    console.log("Save =======>>>" + JSON.stringify(data));

    // if(this.isClient){
    //   data["clientid"] = this.clie
    // }

    if (!this.messageService.isBlankField(data)) {

      this.rest.addmstslaentity(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          const id = this.respObject.details;
          this.messageService.setRow({
            id: Number(id),
            mstorgnhirarchyid: Number(this.orgSelected),
            slaname: this.slaName,
            slaid: Number(this.slaEntitiesName),
            tablename: this.tableName,
            fieldname: this.colValName,
            associatedmstclienttableid: Number(this.selectTable),
            associatedmstclienttablefieldid: Number(this.colVal),
            mstorgnhirarchyname: this.orgName,
            dbid: this.selectDatabase,

          });
          //console.log("id "+ )
          this.reSet();
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

    console.log('...........' + JSON.stringify(data) + '...' + this.clientId);
    this.rest.getmstslaentity(data).subscribe((res) => {
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

  onDatabaseChange(index: any) {
    this.databaseName = this.databases[index].name;
    this.getTable('i');
  }

  onTableChange(index: any) {
    this.tableName = this.tables[index].name;
    console.log('tableName===' + this.tableName);
    this.getColumn('i');
  }

  onColValChange(index) {
    this.colValName = this.colVals[index].name;
    console.log('colValName===' + this.colValName);
  }

  ngOnDestroy(): void {
    if (this.userAuth) {
      this.userAuth.unsubscribe();
    }
  }


}

