import {Component, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {RestApiService} from '../rest-api.service';
import {MessageService} from '../message.service';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {Formatters, OnEventArgs} from 'angular-slickgrid';

@Component({
  selector: 'app-template-variable',
  templateUrl: './template-variable.component.html',
  styleUrls: ['./template-variable.component.css']
})
export class TemplateVariableComponent implements OnInit {

  displayed = true;
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
  des: string;
  totalPage: number;
  selectedId: number;
  private baseFlag: any;
  private adminAuth: Subscription;
  @ViewChild('content1') private content1;
  private modalReference: NgbModalRef;
  organizationId = '';
  organizationName = '';
  ticketType = '';
  formTicketTypeList = [];
  organizationList = [];
  loginUserOrganizationId: number;
  colVal: any;
  colVals = [];
  colValName: string;
  databases = [];
  selectDatabase: number;
  selectTable: number;
  tables = [];
  templateName: string;
  selectDatabase1: number;
  selectTable1: number;
  selctColumn: number;
  updateFlag: number;
  tableName: string;
  columnSelected: number;
  tableSelected: number;

  constructor(private rest: RestApiService, private messageService: MessageService,
              private route: Router, private modalService: NgbModal, private notifier: NotifierService) {
    this.messageService.getCellChangeData().subscribe(item => {
      // console.log(item);
      switch (item.type) {
        case 'delete':
          // console.log('deleted');
          if (!this.del) {
            this.notifier.notify('error', this.messageService.DELETE_PERMISSION);
          } else {
            if (confirm('Are you sure?')) {
              console.log(JSON.stringify(item));
              this.rest.deletetemplatevariable({id: item.id}).subscribe((res) => {
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
    this.pageSize = this.messageService.pageSize;
    this.displayData = {
      pageName: 'Maintain Template Variable',
      openModalButton: 'Create Template Variable',
      breadcrumb: '',
      folderName: '',
      tabName: 'Template Variable'
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
          this.resetValues();
          this.selectedId = args.dataContext.id;
          this.organizationId = args.dataContext.mstorgnhirarchyid;
          this.organizationName = args.dataContext.mstorgnhirarchyname;
          this.selectDatabase1 = this.selectDatabase = args.dataContext.mstdatadictionarydbid;
          this.selectTable1 = this.selectTable = args.dataContext.tableid;
          this.selctColumn = args.dataContext.fieldid;
          this.templateName = args.dataContext.templatename;
          this.updateFlag = 1;
          this.getDatabase('u');
          this.getTable('u');
          this.getColumn('u');
          this.modalReference = this.modalService.open(this.content1, {});
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },
      {
        id: 'orgn', name: 'Organization', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'tablename', name: 'Table Name', field: 'tablename', sortable: true, filterable: true
      },
      {
        id: 'fieldname', name: 'Column Name', field: 'fieldname', sortable: true, filterable: true
      },
      {
        id: 'templatename', name: 'Template Name', field: 'templatename', sortable: true, filterable: true
      }
    ];

    this.clientId = this.messageService.clientId;
    this.messageService.setColumnDefinitions(columnDefinitions);
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.baseFlag = this.messageService.baseFlag;
      this.loginUserOrganizationId = this.messageService.orgnId;
      this.edit = this.messageService.edit;
      this.del = this.messageService.del;
      this.onPageLoad();
    } else {
      this.adminAuth = this.messageService.getClientUserAuth().subscribe(auth => {
        this.edit = auth[0].editFlag;
        this.del = auth[0].deleteFlag;
        this.clientId = auth[0].clientid;
        this.baseFlag = auth[0].baseFlag;
        this.loginUserOrganizationId = auth[0].mstorgnhirarchyid;
        this.onPageLoad();
      });
    }
  }

  onPageLoad() {
    this.getorganizationclientwise();
  }

  onOrgChange(index: any) {
    this.organizationName = this.organizationList[index - 1].organizationname;
    this.getDatabase('i');
  }

  save() {
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.loginUserOrganizationId),
      templatename: this.templateName,
      tableid: Number(this.selectTable),
      fieldid: Number(this.colVal)
    };
    console.log('data====================' + JSON.stringify(data));
    if (!this.messageService.isBlankField(data)) {
      this.rest.addtemplatevariable(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          const id = this.respObject.details;
          this.messageService.setRow({
            id: id,
            mstorgnhirarchyname: this.organizationName,
            templatename: this.templateName,
            tablename: this.tableName,
            fieldname: this.colValName,
            tableid: this.selectTable,
            fieldid: this.colVal,
            mstorgnhirarchyid: this.loginUserOrganizationId
          });
          this.totalData = this.totalData + 1;
          this.messageService.setTotalData(this.totalData);
          this.isError = false;
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
    const data = {
      id: this.selectedId,
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      tableid: Number(this.selectTable),
      fieldid: Number(this.columnSelected),
      templatename: this.templateName,
    };
    console.log('>>>>>>>>>>>>> ', JSON.stringify(data));
    // return false;
    if (!this.messageService.isBlankField(data)) {
      this.rest.updatetemplatevariable(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          this.messageService.sendAfterDelete(this.selectedId);
          this.dataLoaded = true;
          this.messageService.setRow({
            id: this.selectedId,
            mstorgnhirarchyname: this.organizationName,
            templatename: this.templateName,
            tablename: this.tableName,
            fieldname: this.colValName,
            tableid: this.tableSelected,
            fieldid: this.columnSelected,
            organizationId: this.organizationId
          });
          this.modalReference.close();
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

  getDatabase(type) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
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

  resetValues() {
    this.organizationId = '';
    this.selectDatabase = 0;
    this.selectTable = 0;
    this.databases = [];
    this.tables = [];
    this.colVals = [];
  }

  getTable(type) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
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
          this.selectTable = this.selectTable1;
        }
        // this.tableSelected = this.selectTable1;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onColValChange(index) {
    this.colValName = this.colVals[index].name;
    console.log('colValName===' + this.colValName);
  }

  openModal(content) {
    this.isError = false;
    this.resetValues();
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
    this.dataLoaded = true;
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: this.loginUserOrganizationId,
      Offset: offset,
      Limit: limit
    };
    this.rest.gettemplatevariable(data).subscribe((res) => {
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
    this.getTable('i');
  }

  onTableChange(index: any) {
    this.tableName = this.tables[index].name;
    console.log('tableName===' + this.tableName);
    this.getColumn('i');
  }

  getColumn(type) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
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

}
