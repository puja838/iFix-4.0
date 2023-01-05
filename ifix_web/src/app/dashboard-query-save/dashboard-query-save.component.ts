import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {RestApiService} from '../rest-api.service';
import {MessageService} from '../message.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {Formatters, OnEventArgs} from 'angular-slickgrid';
import {NotifierService} from 'angular-notifier';
import {Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-dashboard-query-save',
  templateUrl: './dashboard-query-save.component.html',
  styleUrls: ['./dashboard-query-save.component.css']
})
export class DashboardQuerySaveComponent implements OnInit {
  displayed = true;
  clientSelected: number;
  dataset: any[];
  totalData: number;
  respObject: any;
  clients = [];
  clientName: string;
  userName: string;
  roleName: string;
  notAdmin = true;
  displayData: any;
  add: boolean;
  del: boolean;
  edit: boolean;
  view: boolean;
  isError = false;
  errorMessage: string;
  pageSize: number;
  private userAuth: Subscription;
  private adminAuth: Subscription;
  private notifier: NotifierService;
  private clientId: number;
  private baseFlag: any;
  offset: number;
  dataLoaded: boolean;
  userId: number;
  isLoading = false;
  organaisation = [];
  orgSelected: number;
  orgName: string;
  orgnId: number;
  loginname: string;
  types = [];
  typeSelected: number;
  hideName: boolean;
  propertyName: string;
  recordVal = [];
  seqNo: number;
  recordName: string;
  recordValSelected: number;
  action: string;
  private typeseqno: number;
  isSLA: boolean;
  clientOrgnId: any;


  fields = [];
  fieldSelected: any;
  fieldName: string;
  formTicketTypeListStat = [];
  fromRecordDiffStat: any;
  fromCatgRecDiffId: any;
  fromstatdiffname: any;

  queryType: any;
  allPropertyValues = [];


  recordTypeStatus = [];
  fromPropLevels = [];
  fromlevelid: string;
  formTicketTypeList = [];
  toTicketTypeList = [];
  fromRecordDiffTypeSeqno = '';
  fromRecordDiffId = '';
  private fromRecordDiffName: string;
  queryTypes = [
    {'id': 0, 'name': 'Select Query Type'},
    {'id': 1, 'name': 'Count'},
    {'id': 2, 'name': 'Details'},
  ];
  queryTypeName: any;
  query: any;
  params: any;
  jsonQuery: any;
  fieldValues = [];
  tileIdSelected = 0;
  tileName: any;
  isUpdate: boolean;
  @ViewChild('content') private content1;
  selectedId: number;
  radioChecked: any;
  isCatalog: boolean;
  tileType: any;

  constructor(private rest: RestApiService, private messageService: MessageService, private route: Router,
              private modalService: NgbModal, notifier: NotifierService) {
    this.notifier = notifier;
    this.messageService.getCellChangeData().subscribe(item => {
      switch (item.type) {
        case 'change':
          //console.log('changed');
          if (!this.edit) {
            this.notifier.notify('error', 'You do not have edit permission');
          } else {

          }
          break;
        case 'delete':
          if (confirm('Are you sure?')) {
            this.rest.deletedashboardquerycopy({id: item.id}).subscribe((res) => {
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
      }
    });
    // this.messageService.getUserAuth().subscribe(details => {
    //     // console.log(JSON.stringify(details));
    //     if (details.length > 0) {
    //         this.add = details[0].addFlag;
    //         this.del = details[0].deleteFlag;
    //         this.view = details[0].viewFlag;
    //         this.edit = details[0].editFlag;
    //     }
    // });
  }

  ngOnInit() {
    this.isUpdate = false;
    this.tileIdSelected = 0;
    this.queryType = 0;
    this.hideName = true;
    this.userName = '';
    this.dataLoaded = true;
    this.pageSize = this.messageService.pageSize;
    this.displayData = {
      pageName: 'Dashboard Save Query',
      openModalButton: 'Add Dashboard Save Query',
      breadcrumb: 'Save Query',
      folderName: 'All Save Query',
      tabName: 'Save Query'
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
      // {
      //   id: 'edit',
      //   field: 'id',
      //   excludeFromHeaderMenu: true,
      //   formatter: Formatters.editIcon,
      //   minWidth: 30,
      //   maxWidth: 30,
      //   onCellClick: (e: Event, args: OnEventArgs) => {
      //     console.log("\n args.dataContext ======  ", args.dataContext);
      //     this.reset();
      //     this.selectedId = args.dataContext.id;
      //     this.clientSelected = args.dataContext.clientid;
      //     this.clientName = args.dataContext.clienname;
      //     this.orgSelected = args.dataContext.mstorgnhirarchyid;
      //     this.orgName = args.dataContext.mstorgnhirarchyname;
      //     this.fromRecordDiffId = args.dataContext.recorddiffid;
      //     this.fromRecordDiffName = args.dataContext.recorddiffname;
      //     this.tileIdSelected = args.dataContext.tilesid;
      //     this.tileName = args.dataContext.tilesname;
      //     this.queryType = args.dataContext.querytype;
      //     this.queryTypeName = args.dataContext.querytypename;
      //     this.query = args.dataContext.query;
      //     this.params = args.dataContext.queryparam;
      //     this.jsonQuery = args.dataContext.joinquery;
      //     this.getOrganization(this.clientSelected, this.clientOrgnId);
      //     this.isError = false;
      //     this.isUpdate = true;
      //     this.modalService.open(this.content1).result.then((result) => {
      //     }, (reason) => {
      //     });
      //   }
      // },
      {
        id: 'clienname', name: 'Client ', field: 'clienname', sortable: true, filterable: true, minWidth: 200
      },
      {
        id: 'mstorgnhirarchyname', name: 'Organization ', field: 'mstorgnhirarchyname', sortable: true, filterable: true, minWidth: 200
      },
      {
        id: 'recorddiffname', name: 'Property ', field: 'recorddiffname', sortable: true, filterable: true, minWidth: 100
      },
      {
        id: 'tilesname', name: 'Tiles Name ', field: 'tilesname', sortable: true, filterable: true, minWidth: 200
      },
      {
        id: 'querytypename', name: 'Query Type ', field: 'querytypename', sortable: true, filterable: true, minWidth: 100
      },
      {
        id: 'query', name: 'Query ', field: 'query', sortable: true, filterable: true, minWidth: 200
      },
      {
        id: 'queryparam', name: 'Query Parameters ', field: 'queryparam', sortable: true, filterable: true, minWidth: 300
      },
      {
        id: 'joinquery', name: 'Json Query ', field: 'joinquery', sortable: true, filterable: true, minWidth: 300
      }, {
        id: 'ismanagerialviewname', name: 'Manegement View ', field: 'ismanagerialviewname', sortable: true, filterable: true, minWidth: 200
      }
    ];
    this.messageService.setColumnDefinitions(columnDefinitions);
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.baseFlag = this.messageService.baseFlag;
      this.orgnId = this.messageService.orgnId;
      this.edit = this.messageService.edit;
      this.del = this.messageService.del;
      // console.log(this.orgnId);
      this.onPageLoad();
    } else {
      this.userAuth = this.messageService.getClientUserAuth().subscribe(auth => {
        // this.view = auth[0].viewFlag;
        // this.add = auth[0].addFlag;
        this.edit = auth[0].editFlag;
        this.del = auth[0].deleteFlag;
        this.clientId = auth[0].clientid;
        this.baseFlag = auth[0].baseFlag;
        this.orgnId = auth[0].mstorgnhirarchyid;
        // console.log(JSON.stringify(auth));
        // console.log(this.orgnId)
        this.onPageLoad();
      });
    }
  }


  onPageLoad() {
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
    this.rest.getRecordDiffType().subscribe((res) => {
      this.respObject = res;
      this.respObject.details.unshift({id: 0, typename: 'Select Record Type'});
      this.types = this.respObject.details;
      this.typeSelected = 0;
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });

    this.getRecordDiffType();
  }

  changeRouting(path: string) {
    this.messageService.changeRouting(path);
  }

  onClientChange(selectedIndex) {
    this.clientName = this.clients[selectedIndex].name;
    this.clientOrgnId = this.clients[selectedIndex].orgnid;
    this.getOrganization(this.clientSelected, this.clientOrgnId);
  }


  getPropertyValue(seqNumber, flag) {
    const data = {
      clientid: Number(this.clientSelected),
      mstorgnhirarchyid: Number(this.orgSelected),
      seqno: seqNumber
    };
    this.rest.getrecordbydifftype(data).subscribe((res: any) => {
      if (res.success) {
        if (flag === 'from') {
          this.formTicketTypeList = res.details;
        } else {
          this.toTicketTypeList = res.details;
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      //console.log(err);
    });
  }


  openModal(content) {
    this.isError = false;
    this.reset();
    this.rest.getfunctionality().subscribe((res: any) => {
      if (res.success) {
        this.isError = false;
        res.details.unshift({id: 0, name: 'Select Menu'});
        this.fields = res.details;
        this.fieldSelected = 0;
      } else {
        this.isError = true;
        this.notifier.notify('error', res.errorMessage);
      }
    }, (err) => {

    });
    this.modalService.open(content).result.then((result) => {
    }, (reason) => {
    });
  }

  save() {
    const data = {
      'clientid': Number(this.clientSelected),
      'mstorgnhirarchyid': Number(this.orgSelected),
      'tilesid': Number(this.tileIdSelected),
      'querytype': Number(this.queryType),
      'query': this.query,
      'queryparam': this.params,
      'joinquery': this.jsonQuery,
    };
    if (this.radioChecked !== '4') {
      data['recorddiffid'] = Number(this.fromRecordDiffId);
    }
    if (!this.messageService.isBlankField(data)) {
      this.rest.insertdashboardquery(data).subscribe((res: any) => {
        if (res.success) {
          const id = res.details;
          // this.messageService.setRow({
          //     id: id,
          //     clientid: Number(this.clientSelected),
          //     clienname: this.clientName,
          //     mstorgnhirarchyid: Number(this.orgSelected),
          //     mstorgnhirarchyname: this.orgName,
          //     recorddiffid: Number(this.fromRecordDiffId),
          //     recorddiffname: this.fromRecordDiffName,
          //     tilesid: Number(this.tileIdSelected),
          //     tilesname: this.tileName,
          //     querytype: Number(this.queryType),
          //     querytypename: this.queryTypeName,
          //     query: this.query,
          //     queryparam: this.params,
          //     joinquery: this.jsonQuery
          // });
          this.reset();
          this.getTableData();
          this.totalData = this.totalData + 1;
          this.messageService.setTotalData(this.totalData);
          this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
        } else {
          this.notifier.notify('error', res.message);
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
      'id': this.selectedId,
      'clientid': Number(this.clientSelected),
      'mstorgnhirarchyid': Number(this.orgSelected),
      'recorddiffid': Number(this.fromRecordDiffId),
      'tilesid': Number(this.tileIdSelected),
      'querytype': Number(this.queryType),
      'query': this.query,
      'queryparam': this.params,
      'joinquery': this.jsonQuery,
      'ismanagerialview': Number(this.radioChecked),
    };
    // console.log("DATA 2222222222 -------->>>>>>>    ", JSON.stringify(data));

    if (!this.messageService.isBlankField(data)) {
      this.rest.updatedashboardquery(data).subscribe((res: any) => {
        if (res.success) {
          this.isError = false;
          this.messageService.sendAfterDelete(this.selectedId);
          this.dataLoaded = true;
          // this.messageService.setRow({
          //     id: this.selectedId,
          //     clientid: Number(this.clientSelected),
          //     clienname: this.clientName,
          //     mstorgnhirarchyid: Number(this.orgSelected),
          //     mstorgnhirarchyname: this.orgName,
          //     recorddiffid: Number(this.fromRecordDiffId),
          //     recorddiffname: this.fromRecordDiffName,
          //     tilesid: this.tileIdSelected,
          //     tilesname: this.tileName,
          //     querytype: Number(this.queryType),
          //     querytypename: this.queryTypeName,
          //     query: this.query,
          //     queryparam: this.params,
          //     joinquery: this.jsonQuery
          // });
          this.reset();
          this.getTableData();
          this.totalData = this.totalData + 1;
          this.messageService.setTotalData(this.totalData);
          this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    } else {
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }

  }

  reset() {
    this.isSLA = true;
    this.clientSelected = 0;
    this.orgSelected = 0;
    this.recordName = '';
    this.typeSelected = 0;
    this.action = '1';
    this.recordValSelected = 0;
    this.typeseqno = 0;
    this.fromlevelid = '';
    this.fromRecordDiffTypeSeqno = '';
    this.fromRecordDiffId = '';
    this.queryType = 0;
    this.fieldValues = [];
    this.tileIdSelected = 0;
    this.query = '';
    this.params = '';
    this.jsonQuery = '';
    this.isUpdate = false;
    this.organaisation = [];
    this.fromPropLevels = [];
    this.formTicketTypeList = [];
    this.fieldSelected = 0;
    this.radioChecked = 0;
  }

  onOrgChange(index: any) {
    this.orgName = this.organaisation[index].organizationname;
    this.getTiles();
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
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgnId)
    };
    this.rest.getalldashboardquerycopy(data).subscribe((res) => {
      this.respObject = res;
      // console.log("\n this.respObject ==== >>>>>>>    ", this.respObject);
      for (let i = 0; i < this.respObject.details.values.length; i++) {
        if (this.respObject.details.values[i].ismanegerialview === 1) {
          this.respObject.details.values[i].ismanagerialviewname = 'My Workspace';
        } else if (this.respObject.details.values[i].ismanegerialview === 2) {
          this.respObject.details.values[i].ismanagerialviewname = 'Team Workspace';
        } else {
          this.respObject.details.values[i].ismanagerialviewname = 'Opened By / Requested By';
        }
      }
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
    if (this.adminAuth) {
      this.adminAuth.unsubscribe();
    }
  }

  getOrganization(clientId, orgId) {
    const data = {
      clientid: Number(clientId),
      mstorgnhirarchyid: Number(orgId)
    };
    this.rest.getorganizationclientwisenew(data).subscribe((res) => {
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

  onFieldChange(selectedIndex: any) {
    this.fieldName = this.fields[selectedIndex - 1].name;
    // this.getStatPropertyValue(selectedIndex, 'i');
    if (this.fieldSelected !== '1') {
      this.isCatalog = false;
    }
  }

  onRadioButtonChange(selectedValue) {
    this.radioChecked = selectedValue.value;
    // console.log(this.radioChecked);
    this.getTiles();
  }

  getTiles() {
    if (this.radioChecked === '4') {
      const data = {
        clientid: Number(this.clientSelected),
        mstorgnhirarchyid: Number(this.orgSelected),
        funcid: Number(this.fieldSelected),
        iscatalog: 1
      };
      if (!this.messageService.isBlankField(data)) {
        this.rest.getfuncmappingbycatalogtype(data).subscribe((res: any) => {
          if (res.success) {
            this.fieldValues = res.details;
            this.tileIdSelected = 0;
          } else {
            this.notifier.notify('error', res.message);
          }
        }, (err) => {
          this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
      }
    } else {
      const data = {
        'clientid': Number(this.clientSelected),
        'mstorgnhirarchyid': Number(this.orgSelected),
        'funcid': Number(this.fieldSelected),
        'ismanegerialview': Number(this.radioChecked)
      };
      if (!this.messageService.isBlankField(data)) {
        this.rest.getfuncmappingbytypeforquery(data).subscribe((res: any) => {
          if (res.success) {
            this.fieldValues = res.details;
            this.tileIdSelected = 0;
          } else {
            this.notifier.notify('error', res.message);
          }
        }, (err) => {
          this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
      }
    }
  }


  getfromstatusproperty(index) {
    this.fromstatdiffname = index.typename;
    // console.log('STAT Name', this.fromstatdiffname);
  }

  ondiffDeSelect(index) {
    // console.log(index);
  }

  onTicketTypeChange(selectedIndex) {

  }

  getRecordDiffType() {
    this.rest.getRecordDiffType().subscribe((res: any) => {
      if (res.success) {
        this.recordTypeStatus = res.details;
      }
    });
  }

  getrecordbydifftype(index, flag) {
    if (index !== 0) {
      const seqNumber = this.recordTypeStatus[index - 1].seqno;
      this.getCategoryLevel(seqNumber, flag);
    }
  }

  getCategoryLevel(seqNumber, flag) {
    const data = {
      clientid: Number(this.clientSelected),
      mstorgnhirarchyid: Number(this.orgSelected),
      seqno: Number(seqNumber),
    };
    this.rest.getcategorylevel(data).subscribe((res: any) => {
      if (res.success) {
        if (res.details.length > 0) {
          this.fromPropLevels = res.details;
          this.fromlevelid = '';
        } else {
          this.fromPropLevels = [];
          this.getPropertyValue(Number(seqNumber), flag);
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onLevelChange(index, flag) {
    let seq;
    seq = this.fromPropLevels[index - 1].seqno;
    this.getPropertyValue(seq, flag);
  }

  getrecordvalue(selectedIndex: any) {
    this.fromRecordDiffName = this.formTicketTypeList[selectedIndex - 1].typename;
  }

  onQueryTypeChange(selectedIndex: any) {
    this.queryTypeName = this.queryTypes[selectedIndex].name;
  }

  onTileNameChange(selectedIndex) {
    this.tileName = this.fieldValues[selectedIndex - 1].description;
    //console.log(selectedIndex,'=',this.tileName,'||',this.tileIdSelected);
  }


}
