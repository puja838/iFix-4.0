import {Component, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {RestApiService} from '../rest-api.service';
import {MessageService} from '../message.service';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {Column, Filters, Formatters, OnEventArgs} from 'angular-slickgrid';

@Component({
  selector: 'app-menu-query',
  templateUrl: './menu-query.component.html',
  styleUrls: ['./menu-query.component.css']
})
export class MenuQueryComponent implements OnInit {
  displayed = true;
  totalData = 0;
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
  totalPage: number;
  selectedId: number;
  private baseFlag: any;
  private adminAuth: Subscription;
  @ViewChild('content1') private content1;
  private modalReference: NgbModalRef;
  organizationId = '';
  ticketType = '';
  formTicketTypeList = [];
  toTicketTypeList = [];
  organizationList = [];
  orgId: number;
  recordTypeStatus = [];
  fromRecordDiffTypeId = '';
  fromRecordDiffTypeSeqno = '';
  fromRecordDiffId = '';
  queryType: number;
  query: string;
  params: string;
  selectField: number;
  fieldValues = [];
  private orgName: string;
  private valueName: string;
  private menuname: string;
  recorddiffid: number;
  fromPropLevels = [];
  fromlevelid: string;

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
              this.rest.deletedashboardquery({id: item.id}).subscribe((res) => {
                this.respObject = res;
                // console.log(JSON.stringify(this.respObject));
                if (this.respObject.success) {
                  this.messageService.sendAfterDelete(item.id);
                  this.totalData = this.totalData - 1;
                  this.messageService.setTotalData(this.totalData);
                  this.notifier.notify('success', 'Row Deleted successfully');
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
    // this.messageService.getSelectedItemData().subscribe(selectedTitles => {
    //   if (selectedTitles.length > 0) {
    //     this.show = true;
    //     this.selected = selectedTitles.length;
    //   } else {
    //     this.show = false;
    //   }
    // });
  }

  ngOnInit(): void {
    this.totalPage = 0;
    this.dataLoaded = true;

    this.pageSize = this.messageService.pageSize;
    this.displayData = {
      pageName: 'Add Query',
      openModalButton: 'Add Query',
      searchModalButton: 'Search',
      breadcrumb: 'Query',
      folderName: 'Add Query',
      tabName: 'Add Query'
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
      /*{
        id: 'edit',
        field: 'id',
        excludeFromHeaderMenu: true,
        formatter: Formatters.editIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          console.log(args.dataContext);
          this.isError = false;
          this.selectedId = args.dataContext.id;
          this.organizationId = args.dataContext.mstorgnhirarchyid;
          this.recorddiffid = args.dataContext.mstrecorddifferentiationid;
          this.selectField = args.dataContext.mapfunctionalityid;
          this.queryType = args.dataContext.querytype;
          this.query = args.dataContext.query;
          this.params = args.dataContext.queryparam;
          this.modalReference = this.modalService.open(this.content1, {});
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },*/
      {
        id: 'orgn', name: 'Organization', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'ticketType', name: 'Property Value ', field: 'recorddifferentiationname', sortable: true, filterable: true
      },
      {
        id: 'func', name: 'Menu Name', field: 'mapfunctionalityname', sortable: true, filterable: true
      },
      {
        id: 'query', name: 'Query', field: 'query', sortable: true, filterable: true
      },
      {
        id: 'params', name: 'Parameters', field: 'queryparam', sortable: true, filterable: true
      },
      {
        id: 'queryType',
        name: 'Count Query',
        field: 'queryType',
        sortable: true,
        filterable: true,
        formatter: Formatters.checkmark,
        filter: {
          collection: [{value: '', label: 'All'}, {value: true, label: 'Count Query'}, {
            value: false,
            label: 'Detail Query'
          }],
          model: Filters.singleSelect,
          filterOptions: {
            autoDropWidth: true
          }
        }
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
      this.adminAuth = this.messageService.getClientUserAuth().subscribe(auth => {
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
    this.getorganizationclientwise();
    this.getRecordDiffType();
  }

  openModal(content) {
    this.isError = false;
    this.resetValues();
    // this.notifier.notify('success', 'Module added successfully');
    this.modalService.open(content, {size: 'sm'}).result.then((result) => {
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
      mstorgnhirarchyid: this.orgId,
      offset: offset,
      limit: limit
    };
    console.log(data);
    this.rest.getdashboardquery(data).subscribe((res) => {
      this.respObject = res;
      // console.log('>>>>>>>>>>> ', JSON.stringify(res));
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
      for (let i = 0; i < data.length; i++) {
        if (data[i].querytype === 1) {
          data[i]['queryType'] = true;
        } else {
          data[i]['queryType'] = false;
        }
      }
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
    this.organizationId = '';
    this.fromRecordDiffTypeId = '';
    this.fromRecordDiffTypeSeqno = '';
    this.fromlevelid='';
    this.fromRecordDiffId = '';
    this.queryType = 1;
    this.selectField = 0;
    this.query = '';
    this.params = '';
    this.fromPropLevels = [];
    this.formTicketTypeList = [];
    this.fieldValues = [];
  }

  getCategoryLevel(seqNumber, flag) {
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
          this.getPropertyValue(Number(seqNumber), flag);
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  save() {
    let typeOfQuery;
    if (this.queryType === 1) {
      typeOfQuery = true;
    } else {
      typeOfQuery = false;
    }
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      mapfunctionalityid: Number(this.selectField),
      mstrecorddifferentiationid: Number(this.fromRecordDiffId),
      querytype: Number(this.queryType),
      query: this.query,
      queryparam: this.params
    };
    if (!this.messageService.isBlankField(data)) {
      this.rest.adddashboardquery(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          const id = this.respObject.details;
          this.messageService.setRow({
            id: id,
            mstorgnhirarchyname: this.orgName,
            recorddifferentiationname: this.valueName,
            mapfunctionalityname: this.menuname,
            query: this.query,
            queryparam: this.params,
            queryType: typeOfQuery
          });
          this.totalData = this.totalData + 1;
          this.messageService.setTotalData(this.totalData);
          this.isError = false;
          this.resetValues();
          // this.getTableData();
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
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      fromrecorddifftypeid: Number(this.fromRecordDiffTypeId),
      fromRecordDiffId: Number(this.fromRecordDiffId),
      selectField: Number(this.selectField),
      query: this.query,
      params: this.params
    };
    // console.log('>>>>>>>>>>>>> ', JSON.stringify(data));
    // return false;
    if (!this.messageService.isBlankField(data)) {
      this.rest.updaterecordtypemap(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
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

  getrecordbydifftype(index, flag) {
    if (index !== 0) {
      const seqNumber = this.recordTypeStatus[index - 1].seqno;
      console.log('seqNumber==========' + seqNumber);
      this.getCategoryLevel(seqNumber, flag);
    }
  }

  onLevelChange(index, flag) {
    let seq;
    seq = this.fromPropLevels[index - 1].seqno;
    this.getPropertyValue(seq, flag);
  }

  getPropertyValue(seqNumber, flag) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
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
      console.log(err);
    });
  }


  getorganizationclientwise() {
    const data = {
      clientid: Number(this.clientId) , 
      mstorgnhirarchyid: Number(this.orgId)
    };
    this.rest.getorganizationclientwisenew(data).subscribe((res: any) => {
      if (res.success) {
        this.organizationList = res.details;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      console.log(err);
    });
  }

  onOrganizationChange(index) {
    this.orgName = this.organizationList[index - 1].organizationname;
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.organizationId),
      funcid: 1,
    };
    if (!this.messageService.isBlankField(data)) {
      this.rest.getfuncmappingbytype(data).subscribe((res: any) => {
        if (res.success) {
          this.isError = false;
          res.details.unshift({funcdescid: 0, description: 'Select Field Value'});
          this.fieldValues = res.details;
          this.selectField = 0;
        } else {
          this.isError = true;
          this.notifier.notify('error', res.errorMessage);
        }
      }, (err) => {
        // this.isError = true;
        // this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    } else {
      this.isError = true;
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }
  }

  getrecordvalue(selectedIndex: any) {
    this.valueName = this.formTicketTypeList[selectedIndex - 1].typename;
  }

  onmenuchange(selectedIndex: any) {
    this.menuname = this.fieldValues[selectedIndex].description;
  }
}
