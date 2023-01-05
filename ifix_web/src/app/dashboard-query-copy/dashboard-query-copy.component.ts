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
  selector: 'app-dashboard-query-copy',
  templateUrl: './dashboard-query-copy.component.html',
  styleUrls: ['./dashboard-query-copy.component.css']
})
export class DashboardQueryCopyComponent implements OnInit {
  displayed = true;
  fromClientSelected: number;
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
  fromOrgSelected: number;
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
  fromRecordDiffTypeSeqno = '';
  fromRecordDiffId = '';
  private fromRecordDiffName: string;
  queryTypes = [
    {'id': 0, 'name': 'Select Query Type'},
    {'id': 1, 'name': 'Count Query'},
    {'id': 2, 'name': 'Details Query'},
  ];
  queryTypeName: any;
  // query: any;
  // params: any;
  // jsonQuery: any;
  fieldValues = [];
  tileIdSelected = [];
  tileName: any;
  isUpdate: boolean;
  @ViewChild('content') private content1;
  selectedId: number;

  toClientSelected: any;
  toOrgSelected: any;
  toRecordDiffTypeSeqno: any;
  tolevelid: any;
  toRecordDiffId: any;
  isEdit: any;
  toOrganaisation = [];
  toPropLevels = [];
  toTicketTypeList = [];
  toRecordDiffName: any;
  tostatdiffname: any;
  toOrgName: any;
  toClientName: any;
  managementValue: any;
  radioChecked: any;
  tileType: any;

  constructor(private rest: RestApiService, private messageService: MessageService, private route: Router,
              private modalService: NgbModal, notifier: NotifierService) {
    this.notifier = notifier;
    this.messageService.getCellChangeData().subscribe(item => {
      switch (item.type) {
        case 'change':
          console.log('changed');
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
    this.tileIdSelected = [];
    this.managementValue = '1';
    this.queryType = 0;
    this.hideName = true;
    this.userName = '';
    this.dataLoaded = true;
    this.pageSize = this.messageService.pageSize;
    this.displayData = {
      pageName: 'Dashboard Copy Query',
      openModalButton: 'Add Dashboard Copy Query',
      breadcrumb: 'Copy Query',
      folderName: 'All Copy Query',
      tabName: 'Copy Query'
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
      //     this.fromClientSelected = args.dataContext.clientid;
      //     this.clientName = args.dataContext.clienname;
      //     this.fromOrgSelected = args.dataContext.mstorgnhirarchyid;
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
      //     this.getOrganization(this.fromClientSelected, this.clientOrgnId);
      //     this.isError = false;
      //     this.isUpdate = true;
      //     this.isEdit = true;
      //     this.modalService.open(this.content1).result.then((result) => {
      //     }, (reason) => {
      //     });
      //   }
      // },
      {
        id: 'clienname', name: 'Client ', field: 'clienname', sortable: true, filterable: true
      },
      {
        id: 'mstorgnhirarchyname', name: 'Organization ', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'recorddiffname', name: 'Property ', field: 'recorddiffname', sortable: true, filterable: true
      },
      {
        id: 'tilesname', name: 'Tiles Name ', field: 'tilesname', sortable: true, filterable: true
      },
      {
        id: 'querytypename', name: 'Query Type ', field: 'querytypename', sortable: true, filterable: true
      }, {
        id: 'ismanagerialviewname', name: 'Manegement View ', field: 'ismanagerialviewname', sortable: true, filterable: true
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
        this.fromClientSelected = 0;
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.isError = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
    // this.rest.getRecordDiffType().subscribe((res) => {
    //     this.respObject = res;
    //     this.respObject.details.unshift({id: 0, typename: 'Select Record Type'});
    //     this.types = this.respObject.details;
    //     this.typeSelected = 0;
    // }, (err) => {
    //     this.notifier.notify('error', this.messageService.SERVER_ERROR);
    // });

    this.getRecordDiffType();
  }

  changeRouting(path: string) {
    this.messageService.changeRouting(path);
  }

  onClientChangeFrom(selectedIndex) {
    this.clientName = this.clients[selectedIndex].name;
    this.clientOrgnId = this.clients[selectedIndex].orgnid;
    this.getOrganization(this.fromClientSelected, this.clientOrgnId);
  }

  onClientChangeTo(selectedIndex) {
    this.toClientName = this.clients[selectedIndex].name;
    this.clientOrgnId = this.clients[selectedIndex].orgnid;
    this.getOrganization2(this.toClientSelected, this.clientOrgnId);
  }


  getPropertyValue(seqNumber, flag) {
    const data = {
      'clientid': Number(this.fromClientSelected),
      'mstorgnhirarchyid': Number(this.fromOrgSelected),
      'seqno': seqNumber
    };
    this.rest.getrecordbydifftype(data).subscribe((res: any) => {
      if (res.success) {
        if (flag === 'from') {
          this.formTicketTypeList = res.details;
          this.fromRecordDiffId = '';
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      console.log(err);
    });
  }


  getPropertyValue2(seqNumber, flag) {
    const data = {
      clientid: Number(this.toClientSelected),
      mstorgnhirarchyid: Number(this.toOrgSelected),
      seqno: seqNumber
    };
    this.rest.getrecordbydifftype(data).subscribe((res: any) => {
      if (res.success) {
        if (flag === 'to') {
          this.toTicketTypeList = res.details;
          this.toRecordDiffId = '';
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      console.log(err);
    });
  }


  openModal(content) {
    this.isError = false;
    this.isEdit = false;
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
      clientid: Number(this.fromClientSelected),
      mstorgnhirarchyid: Number(this.fromOrgSelected),
      tilesids: this.tileIdSelected,
      querytype: Number(this.queryType),
      toclientid: Number(this.toClientSelected),
      tomstorgnhirarchyid: Number(this.toOrgSelected),
      ismanagerialview: Number(this.radioChecked),
    };
    if (this.radioChecked !== '4') {
      data['recorddiffid'] = Number(this.fromRecordDiffId);
      data['torecorddiffid']= Number(this.toRecordDiffId);
    }
    if (!this.messageService.isBlankField(data)) {
      this.rest.adddashboardquerycopy(data).subscribe((res: any) => {
        if (res.success) {
          const id = res.details;
          // if(Number(this.toClientSelected) === 1 && Number(this.toOrgSelected) === 1){
          // this.messageService.setRow({
          //     id: id,
          //     clientid: Number(this.toClientSelected),
          //     clienname: this.toClientName,
          //     mstorgnhirarchyid: Number(this.toOrgSelected),
          //     mstorgnhirarchyname: this.toOrgName,
          //     recorddiffid: Number(this.toRecordDiffId),
          //     recorddiffname: this.toRecordDiffName,
          //     tilesid: Number(this.tileIdSelected),
          //     tilesname: this.tileName,
          //     querytype: Number(this.queryType),
          //     querytypename: this.queryTypeName
          // });
          // }
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
      'clientid': Number(this.fromClientSelected),
      'mstorgnhirarchyid': Number(this.fromOrgSelected),
      'recorddiffid': Number(this.fromRecordDiffId),
      'tilesids': this.tileIdSelected,
      'querytype': Number(this.queryType),
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
          //     clientid: Number(this.toClientSelected),
          //     clienname: this.toClientName,
          //     mstorgnhirarchyid: Number(this.toOrgSelected),
          //     mstorgnhirarchyname: this.toOrgName,
          //     recorddiffid: Number(this.toRecordDiffId),
          //     recorddiffname: this.toRecordDiffName,
          //     tilesid: Number(this.tileIdSelected),
          //     tilesname: this.tileName,
          //     querytype: Number(this.queryType),
          //     querytypename: this.queryTypeName
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
    this.fromClientSelected = 0;
    this.fromOrgSelected = 0;
    this.fromlevelid = '';
    this.fromRecordDiffId = '';
    this.queryType = 0;
    this.fieldValues = [];
    this.tileIdSelected = [];
    this.isUpdate = false;
    this.organaisation = [];
    this.fromPropLevels = [];
    this.formTicketTypeList = [];
    this.fieldSelected = 0;

    this.toClientSelected = 0;
    this.toOrgSelected = 0;
    this.tolevelid = '';
    this.toRecordDiffId = '';
    this.toOrganaisation = [];
    this.toPropLevels = [];
    this.toTicketTypeList = [];
    this.managementValue = '1';
    this.toRecordDiffTypeSeqno = '';
    this.fromRecordDiffTypeSeqno = '';
  }

  onOrgChangeFrom(index) {
    this.orgName = this.organaisation[index].organizationname;
  }

  onOrgChangeTo(index) {
    this.toOrgName = this.toOrganaisation[index].organizationname;
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
    this.rest.getalldashboardquerycopy(data).subscribe((res) => {
      this.respObject = res;
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
      'clientid': Number(clientId),
      'mstorgnhirarchyid': Number(orgId),
    };
    this.rest.getorganizationclientwisenew(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, organizationname: 'Select Organization'});
        this.organaisation = this.respObject.details;
        this.fromOrgSelected = 0;
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.isError = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getOrganization2(clientId, orgId) {
    // console.log("\n orgId ::  ", orgId);
    const data = {
      clientid: Number(clientId),
      mstorgnhirarchyid: Number(orgId)
    };
    this.rest.getorganizationclientwisenew(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, organizationname: 'Select Organization'});
        this.toOrganaisation = this.respObject.details;
        this.toOrgSelected = 0;
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
  }

  getTiles() {
    if (this.radioChecked === '4') {
      const data = {
        clientid: Number(this.fromClientSelected),
        mstorgnhirarchyid: Number(this.fromOrgSelected),
        funcid: Number(this.fieldSelected),
        iscatalog: 1
      };
      if (!this.messageService.isBlankField(data)) {
        this.rest.getfuncmappingbycatalogtype(data).subscribe((res: any) => {
          if (res.success) {
            this.fieldValues = res.details;
            this.selectAll(this.fieldValues);
          } else {
            this.notifier.notify('error', res.message);
          }
        }, (err) => {
          this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
      }
    } else {
      const data = {
        clientid: Number(this.fromClientSelected),
        mstorgnhirarchyid: Number(this.fromOrgSelected),
        funcid: Number(this.fieldSelected),
        ismanegerialview: Number(this.radioChecked)
      };
      if (!this.messageService.isBlankField(data)) {
        this.rest.getfuncmappingbytypeforquery(data).subscribe((res: any) => {
          if (res.success) {
            this.fieldValues = res.details;
            this.selectAll(this.fieldValues);
          } else {
            this.notifier.notify('error', res.message);
          }
        }, (err) => {
          this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
      }
    }
  }

  onRadioButtonChange(selectedValue) {
    this.radioChecked = selectedValue.value;
    this.getTiles();
    /*const data = {
      'clientid': Number(this.fromClientSelected),
      'mstorgnhirarchyid': Number(this.fromOrgSelected),
      'funcid': Number(this.fieldSelected),
      'ismanegerialview': Number(this.radioChecked)
    };
    this.rest.getfuncmappingbytypeforquery(data).subscribe((res: any) => {
      if (res.success) {
        this.isError = false;
        //res.details.unshift({funcdescid: 0, description: 'Select Tiles Name'});
        this.fieldValues = res.details;
        this.selectAll(this.fieldValues);
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });*/
  }


  getfromstatusproperty(index) {
    this.tostatdiffname = index.typename;
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

  getrecordbydifftypeFrom(index, flag) {
    if (index !== 0) {
      const seqNumber = this.recordTypeStatus[index - 1].seqno;
      this.getCategoryLevel(seqNumber, flag);
    }
  }

  getrecordbydifftypeTo(index, flag) {
    if (index !== 0) {
      const seqNumber = this.recordTypeStatus[index - 1].seqno;
      this.getCategoryLevel2(seqNumber, flag);
    }
  }


  getCategoryLevel(seqNumber, flag) {
    const data = {
      'clientid': Number(this.clientId),
      'mstorgnhirarchyid': Number(this.orgnId),
      'seqno': Number(seqNumber),
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


  getCategoryLevel2(seqNumber, flag) {
    const data = {
      clientid: Number(this.toClientSelected),
      mstorgnhirarchyid: Number(this.toOrgSelected),
      seqno: Number(seqNumber),
    };
    this.rest.getcategorylevel(data).subscribe((res: any) => {
      if (res.success) {
        if (res.details.length > 0) {
          this.toPropLevels = res.details;
          this.tolevelid = '';
        } else {
          this.toPropLevels = [];
          this.getPropertyValue2(Number(seqNumber), flag);
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }


  onLevelChangeFrom(index, flag) {
    let seq;
    seq = this.fromPropLevels[index - 1].seqno;
    this.getPropertyValue(seq, flag);
  }

  onLevelChangeTo(index, flag) {
    let seq;
    seq = this.toPropLevels[index - 1].seqno;
    this.getPropertyValue2(seq, flag);
  }


  getrecordvalueFrom(selectedIndex: any) {
    this.fromRecordDiffName = this.formTicketTypeList[selectedIndex - 1].typename;
  }

  getrecordvalueTo(selectedIndex: any) {
    this.toRecordDiffName = this.toTicketTypeList[selectedIndex - 1].typename;
  }


  onQueryTypeChange(selectedIndex: any) {
    this.queryTypeName = this.queryTypes[selectedIndex].name;
  }

  onTileNameChange(selectedIndex) {
    this.tileName = this.fieldValues[selectedIndex].description;
  }

  selectAll(items: any[]) {
    let allSelect = items => {
      items.forEach(element => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };
    allSelect(items);
  }

}
