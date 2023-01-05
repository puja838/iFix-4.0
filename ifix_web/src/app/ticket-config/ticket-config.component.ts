import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {NotifierService} from 'angular-notifier';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {RestApiService} from '../rest-api.service';
import {MessageService} from '../message.service';
import {Router} from '@angular/router';
import {Formatters, OnEventArgs, Filters} from 'angular-slickgrid';
import { CommonSlickgridComponent } from '../common-slickgrid/common-slickgrid.component';


@Component({
  selector: 'app-ticket-config',
  templateUrl: './ticket-config.component.html',
  styleUrls: ['./ticket-config.component.css']
})
export class TicketConfigComponent implements OnInit, OnDestroy {

  displayed = true;
  moduleName: string;
  description: string;
  totalData = 0;
  show: boolean;
  selected: number;
  respObject: any;
  add: boolean;
  del: boolean;
  edit: boolean;
  view: boolean;
  displayData: any;
  isError = false;
  errorMessage: string;
  pageSize: number;
  clientId: number;
  offset: number;
  dataLoaded: boolean;
  isLoading = false;
  moduleSelected: any;
  modules: any;
  des: string;
  totalPage: number;
  selectedId: number;
  private baseFlag: any;
  private adminAuth: Subscription;
  @ViewChild('content') private content1;
  private modalReference: NgbModalRef;
  organizationId = '';
  organizationName = '';
  ticketTypeName = '';
  ticketType : any;
  ticketType1 : any
  ticketTypeList = [];
  organizationList = [];
  prefixType = [{
    key: 'Prefix',
    type: 'prefix'
  }, {
    key: 'Category Prefix',
    type: 'catprefix'
  }, {
    key: 'Date Format',
    type: 'date'
  }];
  prefixResult = [{
    prefixType: '',
    value: ''
  }, {
    prefixType: '',
    value: ''
  }, {
    prefixType: '',
    value: ''
  }];
  loginUserOrganizationId: number;
  recordTypeStatus = [];
  recordDifTypeId: any;
  fromPropLevels = [];
  fromlevelid: string;
  seqNumber: number;

  prefixName: any;
  increamentNo: any;
  zeroConfig = '';
  yearSelected: any;
  monthSelected: any;
  dateSelected: any;
  years = [
            { 'id': 0, 'value': 'NA'},
            { 'id': 1, 'value': 'YYYY'},
            { 'id': 2, 'value': 'YY'}
          ];
  months = [
            { 'id': 0, 'value': 'NA'},
            { 'id': 1, 'value': 'MM'}
           ];
  dates = [
           { 'id': 0, 'value': 'NA'},
           { 'id': 1, 'value': 'DD'}
          ];
  showadd: boolean;
  recordDifTypeName: any;
  clientSpecific: boolean;
  initiNumber = '';
  dataValue:any;

  constructor(private rest: RestApiService, private messageService: MessageService,
              private route: Router, private modalService: NgbModal, private notifier: NotifierService) {
    this.messageService.getCellChangeData().subscribe(item => {
      // console.log(item);
      switch (item.type) {
        case 'change':
          // console.log('changed');
          if (!this.edit) {
            this.notifier.notify('error', 'You do not have edit permission');
          } else {
            if (confirm('Are you sure?')) {

            }
          }
          break;
        case 'delete':
          // console.log('deleted');
          if (!this.del) {
            this.notifier.notify('error', 'You do not have delete permission');
          } else {
            if (confirm('Are you sure?')) {
              console.log(JSON.stringify(item));
              const data ={
                   id: item.id,
                   clientid: item.clientid,
                   mstorgnhirarchyid: item.mstorgnhirarchyid,
                   recorddifftypeid: item.recorddifftypeid,
                   recorddiffid: item.recorddiffid,
                   isclient: item.isclient
              }
              this.rest.deleterecordconfigincrement(data).subscribe((res) => {
                this.respObject = res;
                // console.log(JSON.stringify(this.respObject));
                if (this.respObject.success) {
                  this.messageService.sendAfterDelete(item.id);
                  this.totalData = this.totalData - 1;
                  this.messageService.setTotalData(this.totalData);
                  this.notifier.notify('success', 'Ticket config Deleted successfully');
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
    this.messageService.getSelectedItemData().subscribe(selectedTitles => {
      if (selectedTitles.length > 0) {
        this.show = true;
        this.selected = selectedTitles.length;
      } else {
        this.show = false;
      }
    });
  }

  ngOnInit(): void {
    this.totalPage = 0;
    this.dataLoaded = true;
    this.clientSpecific = true;
    this.pageSize = this.messageService.pageSize;
    this.displayData = {
      pageName: 'Record Config',
      openModalButton: 'Add Record Config',
      searchModalButton: 'Search',
      breadcrumb: 'Record Config',
      folderName: 'All Modules',
      tabName: 'Record Config'
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
          console.log(JSON.stringify(args.dataContext));
          this.showadd = false;
          this.isError = false;
          this.resetValues();
          // this.organizationList = [];
          // this.years = [];
          // this.months = [];
          // this.dates = [];
          this.ticketTypeList = [];
          this.selectedId = args.dataContext.id;
          this.organizationId = args.dataContext.mstorgnhirarchyid;
          this.recordDifTypeId = args.dataContext.recorddifftypeid;
          this.ticketType1 = args.dataContext.recorddiffid;
          //console.log("ICK",this.ticketType1);
          this.organizationName = args.dataContext.Mstorgnhirarchyname;
          this.ticketTypeName = args.dataContext.recorddiffname;
          this.recordDifTypeName = args.dataContext.recorddifftypename;
          this.yearSelected = args.dataContext.year;
          this.monthSelected = args.dataContext.month;
          this.dateSelected = args.dataContext.day;
          if((args.dataContext.configurezero=== 'NA') && (args.dataContext.prefix=== 'NA') && (args.dataContext.number === 0)){
            this.zeroConfig = '';
            this.prefixName = '';
            this.initiNumber = '';
          }
          else{
            this.zeroConfig = args.dataContext.configurezero;
            this.prefixName = args.dataContext.prefix;
            this.initiNumber =args.dataContext.number;
          }
          const clientis = args.dataContext.isclient;
          this.clientSpecific = Number(clientis)=== 1?true:false;
          for(let i = 0;i<this.recordTypeStatus.length ;i++){
            if(Number(this.recordTypeStatus[i].id) === Number(this.recordDifTypeId)){
                 this.seqNumber = this.recordTypeStatus[i].seqno;
                 this.getCategoryLevel(this.seqNumber, 'u');
            }
          }

          this.modalReference = this.modalService.open(this.content1, {});
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },
      {id: 'orgn', name: 'Organization', field: 'Mstorgnhirarchyname', sortable: true, filterable: true},
      {id: 'propertyType', name: 'Property Type', field: 'recorddifftypename', sortable: true, filterable: true},
      {id: 'propertyValue', name: 'Property Value', field: 'recorddiffname', sortable: true, filterable: true},
      {id: 'prefix', name: 'Prefix', field: 'prefix', sortable: true, filterable: true},
      {id: 'year', name: 'Year', field: 'year', sortable: true, filterable: true},
      {id: 'month', name: 'Month', field: 'month', sortable: true, filterable: true},
      {id: 'day', name: 'Day', field: 'day', sortable: true, filterable: true},
      {id: 'Configurezero', name: 'Zero Configure', field: 'configurezero', sortable: true, filterable: true},
      {id: 'number', name: 'Initial Start Number', field: 'number', sortable: true, filterable: true},
      {
        id: 'isclient', name: 'Is Client', field: 'isclient', sortable: true, filterable: true, formatter: Formatters.checkmark,
        filter: {
        collection: [{value: '', label: 'All'},{value: '1', label: 'True'}, {value: '0', label: 'False'}],
        model: Filters.singleSelect,

        filterOptions: {
          autoDropWidth: true
          },
          }, minWidth: 40,}
    ];

    this.clientId = this.messageService.clientId;
    this.messageService.setColumnDefinitions(columnDefinitions);
    // this.onPageLoad();
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.baseFlag = this.messageService.baseFlag;
      this.loginUserOrganizationId = this.messageService.orgnId;
      this.edit = this.messageService.edit;
      this.del = this.messageService.del;
      this.onPageLoad();
    } else {
      this.adminAuth = this.messageService.getClientUserAuth().subscribe(auth => {
        // this.view = auth[0].viewFlag;
        // this.add = auth[0].addFlag;
        this.edit = auth[0].editFlag;
        this.del = auth[0].deleteFlag;
        this.clientId = auth[0].clientid;
        this.baseFlag = auth[0].baseFlag;
        this.loginUserOrganizationId = auth[0].mstorgnhirarchyid;
        //console.log('auth1===' + JSON.stringify(auth));
        this.onPageLoad();
      });
    }
  }

  onPageLoad() {
    // this.getTableData();
    this.getorganizationclientwise();
    this.getRecordDiffType();
  }

  openModal(content) {
    this.showadd = true;
    this.isError = false;
    this.resetValues();
    this.checkValue()
    // this.notifier.notify('success', 'Module added successfully');
    this.modalService.open(content, {size: 'md'}).result.then((result) => {
    }, (reason) => {

    });
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
      clientid: this.clientId,
      mstorgnhirarchyid: this.loginUserOrganizationId,
      offset: offset,
      limit: limit
    };
    //console.log(data);
    this.rest.getallrecordconfigincrement(data).subscribe((res) => {
      this.respObject = res;
      //console.log('>>>>>>>>>>> ', JSON.stringify(res));
      for(let i=0;i <this.respObject.details.values.length ; i++){
        this.respObject.details.values[i].prefix = this.respObject.details.values[i].prefix === ''? 'NA': this.respObject.details.values[i].prefix;
        this.respObject.details.values[i].year = this.respObject.details.values[i].year === ''? 'NA': this.respObject.details.values[i].year;
        this.respObject.details.values[i].month = this.respObject.details.values[i].month === ''? 'NA': this.respObject.details.values[i].month;
        this.respObject.details.values[i].day = this.respObject.details.values[i].day === ''? 'NA': this.respObject.details.values[i].day;
        this.respObject.details.values[i].configurezero = this.respObject.details.values[i].configurezero === ''? 'NA': this.respObject.details.values[i].configurezero;
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

  getRecordDiffType() {
    this.rest.getRecordDiffType().subscribe((res: any) => {
      if (res.success) {
        this.recordTypeStatus = res.details;
      }
    });
  }

  resetValues() {
    // console.log(this.recordDifTypeId);
    this.yearSelected = 'NA';
    this.monthSelected = 'NA';
    this.dateSelected = 'NA';
    this.organizationId = '';
    this.organizationName = '';
    this.ticketTypeName = '';
    this.ticketType = 0;
    this.recordDifTypeId = 0;
    this.prefixName = '';
    this.zeroConfig = '';
    this.fromPropLevels = [];
    this.ticketTypeList = [];
    this.clientSpecific = true;
    this.initiNumber = '';
  }

  checkValue(){
    console.log(this.clientSpecific);
    if(this.clientSpecific === true){
      this.prefixName = ''
      this.yearSelected = 'NA'
      this.monthSelected = 'NA'
      this.dateSelected = 'NA'
      this.zeroConfig = '';
      this.initiNumber = '';
    }
  }

  save() {
    if (this.fromPropLevels.length > 0) {
      this.recordDifTypeId = this.fromlevelid;
    }

    if(this.clientSpecific === true){
      this.dataValue = {
        "clientid": this.clientId,
        "mstorgnhirarchyid": Number(this.organizationId),
        "recorddifftypeid": Number(this.recordDifTypeId),
        "recorddiffid": Number(this.ticketType),
      }
    }

    else{
      this.dataValue = {
        "clientid": this.clientId,
        "mstorgnhirarchyid": Number(this.organizationId),
        "recorddifftypeid": Number(this.recordDifTypeId),
        "recorddiffid": Number(this.ticketType),
        "prefix": this.prefixName,
        "configurezero":this.zeroConfig,
        "number": Number(this.initiNumber),
        'year' : this.yearSelected,
        'month': this.monthSelected,
        'day': this.dateSelected
      }
    }
    if (!this.messageService.isBlankField(this.dataValue)) {
      this.dataValue['isclient'] = this.clientSpecific == true?1:0;
      //console.log(JSON.stringify(this.dataValue)+"!!!!!!!!!!!");
      this.rest.addrecordconfigincrement(this.dataValue).subscribe((res) => {
        this.respObject = res;
        //console.log(JSON.stringify(res)+"<<<<<<<<<<<<<<<<< RES");
        if (this.respObject.success) {
          const id = this.respObject.details;
          // this.messageService.setRow({
          //   id: id,
          //   mstorgnhirarchyid: Number(this.organizationId),
          //   recorddifftypeid: this.recordDifTypeId,
          //   recorddiffid: Number(this.ticketType),
          //   prefix: this.prefixName,
          //   year: this.yearSelected,
          //   month: this.monthSelected,
          //   day: this.dateSelected,
          //   configurezero: this.zeroConfig,
          //   Mstorgnhirarchyname: this.organizationName,
          //   recorddiffname: this.ticketTypeName,
          //   recorddifftypename: this.recordDifTypeName,
          //   isclient : this.clientSpecific,
          //   number: this.initiNumber
          // });
          this.totalData = this.totalData + 1;
          this.messageService.setTotalData(this.totalData);
          this.isError = false;
          this.getTableData();
          this.resetValues();
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
    if (this.fromPropLevels.length > 0) {
      this.recordDifTypeId = this.fromlevelid;
    }

    if(this.clientSpecific === true){
      this.dataValue = {
        id: this.selectedId,
        clientid: this.clientId,
        mstorgnhirarchyid: Number(this.organizationId),
        recorddifftypeid: Number(this.recordDifTypeId),
        recorddiffid: Number(this.ticketType),
      }
    }
    else{
      this.dataValue = {
        id: this.selectedId,
        clientid: this.clientId,
        mstorgnhirarchyid: Number(this.organizationId),
        recorddifftypeid: Number(this.recordDifTypeId),
        recorddiffid: Number(this.ticketType),
        prefix: this.prefixName,
        year: this.yearSelected,
        month: this.monthSelected,
        day: this.dateSelected,
        configurezero: this.zeroConfig,
        number: Number(this.initiNumber)
      };
    }
    // return false;
    if (!this.messageService.isBlankField(this.dataValue)) {
      this.dataValue['isclient'] = this.clientSpecific == true?1:0;
      //console.log('>>>>>>>>>>>>> ', JSON.stringify(this.dataValue));
      this.rest.updaterecordconfigincrement(this.dataValue).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {

          this.isError = false;
          this.getTableData();
          this.resetValues();
          this.notifier.notify('success', this.messageService.EDIT_SUCCESS);
          this.modalReference.close();
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

  prefixChange(obj) {
    if (obj.prefixType === 'date') {
      obj.value = 'YYYYMMDD';
    } else {
      obj.value = '';
    }
  }

  getorganizationclientwise() {
    const data = {
      clientid: Number(this.clientId) ,
      mstorgnhirarchyid: Number(this.loginUserOrganizationId)
    };
    this.rest.getorganizationclientwisenew(data).subscribe((res: any) => {
      if (res.success) {
        this.organizationList = res.details;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  changeorg(index) {
    if (this.organizationId !== '') {
      if (index !== 0) {
        this.organizationName = this.organizationList[index - 1].organizationname;
        if (this.recordDifTypeId > 0 || Number(this.fromlevelid) > 0) {
          this.getPropertyValue(Number(this.seqNumber), 'i');
        }
      }
    }
  }

  getrecordbydifftype(index) {
    if (index !== 0) {
      this.seqNumber = this.recordTypeStatus[index - 1].seqno;
      this.recordDifTypeName = this.recordTypeStatus[index - 1].typename;
      this.getCategoryLevel(this.seqNumber, 'i');
    }
  }

  getCategoryLevel(seqNumber,type) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      seqno: Number(seqNumber),
    };
    this.rest.getcategorylevel(data).subscribe((res: any) => {
      if (res.success) {
        if (res.details.length > 0) {
          this.fromPropLevels = res.details;
          this.fromlevelid = '';
        } else {
          this.fromPropLevels = [];
          this.getPropertyValue(Number(seqNumber), type);
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getPropertyValue(seq,type) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      seqno: Number(seq)
    };
    //console.log("!!!!!!!!!!!" );
    this.rest.getrecordbydifftype(data).subscribe((res: any) => {
      if (res.success) {
        this.ticketTypeList = res.details;
        if(type=='i'){
          this.ticketType = 0;
          //console.log("TYPE", this.ticketType)
        }
        else{
          this.ticketType = this.ticketType1;
          //console.log("TYPE", this.ticketType)
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onLevelChange(index) {
    let seq;
    seq = this.fromPropLevels[index - 1].seqno;
    this.getPropertyValue(seq,'i');
  }

  onTicketTypeChange(index) {
    if (index !== 0) {
      this.ticketTypeName = this.ticketTypeList[index - 1].typename;
    }
  }

  ngOnDestroy(): void {
    if (this.adminAuth) {
      this.adminAuth.unsubscribe();
    }
  }

}
