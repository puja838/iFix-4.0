import {Component, OnInit, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {RestApiService} from "../rest-api.service";
import {MessageService} from "../message.service";
import {Router} from "@angular/router";
import {NotifierService} from "angular-notifier";
import {Formatters} from "angular-slickgrid";

@Component({
  selector: 'app-map-process-template',
  templateUrl: './map-process-template.component.html',
  styleUrls: ['./map-process-template.component.css']
})
export class MapProcessTemplateComponent implements OnInit {

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
  @ViewChild('content1') private content1;
  private modalReference: NgbModalRef;
  organizationId = '';
  organizationName = '';
  ticketType = '';
  formTicketTypeList = [];
  organizationList = [];
  loginUserOrganizationId: number;
  seqNo = 1;
  recordTypeStatus = [];
  fromRecordDiffTypeId = '';
  fromRecordDiffType = '';
  fromRecordDiffId = '';
  seq: any;
  recorddifftypename: string;
  recorddiffname: string;
  process: string;
  colVal: any;
  colVals = [];
  colValName: string;
  databases = [];
  selectDatabase: number;
  selectTable: number;
  tables = [];
  selectedRecordTypeId = '';
  fromRecordDiffType1 = '';
  updateFlag = 0;
  selectDatabase1: number;
  databaseSelected: number;
  selectTable1: number;
  tableSelected: number;
  selctColumn: number;
  columnSelected: number;
  mstprocesstoentityid: number;
  mstprocessrecordmapid: number;
  workingList = [];
  workingdiffid: any;
  private workingtypeid: number;
  private workingdiff1: number;
  templates = [];
  templateSelected: [];
  // worksId = [];
  wrkName :any;

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
              // console.log(JSON.stringify(item));
              this.rest.deleteprocess({
                id: item.id,
                mstprocesstoentityid: item.mstprocesstoentityid,
                mstprocessrecordmapid: item.mstprocessrecordmapid
              }).subscribe((res) => {
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
    // this.totalPage = 0;
    this.dataLoaded = true;
    // this.pageSize = this.messageService.pageSize;
    this.displayData = {
      pageName: 'Map Template With Process',
      openModalButton: 'Map Template With Process',
      tabName: 'Map Template With Process'
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
        id: 'orgn', name: 'Organization', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'processname', name: 'Process Name ', field: 'processname', sortable: true, filterable: true
      },
      {
        id: 'recorddifftypname', name: 'Working Label', field: 'recorddifftypname', sortable: true, filterable: true
      },
      {
        id: 'recorddiffname', name: 'Working Value', field: 'recorddiffname', sortable: true, filterable: true
      },
      {
        id: 'processname',
        name: 'Template',
        field: 'processname',
        sortable: true,
        filterable: true
      }
    ];

    this.clientId = this.messageService.clientId;
    // this.messageService.setColumnDefinitions(columnDefinitions);
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
        this.onPageLoad();
      });
    }
  }

  onPageLoad() {
    this.resetValues();
    this.getorganizationclientwise();
  }

  onOrgChange(index: any) {
    this.organizationName = this.organizationList[index - 1].organizationname;
    this.getRecordDiffType();
    this.getProcessTemplate();
  }

  onwrkChange(index: any) {
    this.wrkName = index.supportgroupname;
  }

  getProcessTemplate() {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.loginUserOrganizationId),
    };
    this.rest.getprocesstemplate(data).subscribe((res: any) => {
      if (res.success) {
        //res.details.unshift({id: 0, processname: 'Select Template'});
        this.templates = res.details;
        this.templateSelected = [];
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  openModal(content) {
    this.isError = false;
    this.resetValues();
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
      mstorgnhirarchyid: Number(this.loginUserOrganizationId),
      offset: offset,
      limit: limit
    };
    this.rest.getprocess(data).subscribe((res) => {
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

  getRecordDiffType() {
    this.rest.getRecordDiffType().subscribe((res: any) => {
      if (res.success) {
        this.recordTypeStatus = res.details;
        this.selectedRecordTypeId = this.fromRecordDiffType1;
        if (this.updateFlag === 1) {
          for (let i = 0; i < this.recordTypeStatus.length; i++) {
            if (this.recordTypeStatus[i].id === this.fromRecordDiffType1) {
              this.seq = this.recordTypeStatus[i].seqno;
            }
          }
          const data = {
            clientid: this.clientId,
            mstorgnhirarchyid: Number(this.organizationId),
            seqno: Number(this.seq)
          };
          this.getrecord(data);
        }
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  resetValues() {
    this.organizationId = '';
    this.fromRecordDiffTypeId = '';
    this.fromRecordDiffId = '';
    this.fromRecordDiffType = '';
    this.process = '';
    this.colVal = '';
    this.selectDatabase = 0;
    this.selectTable = 0;
    this.recordTypeStatus = [];
    this.formTicketTypeList = [];
    this.databases = [];
    this.tables = [];
    this.colVals = [];
    this.workingList = [];
    this.workingdiffid = 0;
    this.workingtypeid = 0;
    this.workingdiff1 = 0;
    this.templates = [];
    this.templateSelected = [];
  }

  save() {
    const category = []
    for (let i = 0; i < this.workingdiffid.length; i++) {
      for (let j = 0; j < this.workingList.length; j++) {
        if (this.workingList[j].id === this.workingdiffid[i]) {
          category.push({type: this.workingList[i].recorddifftypid, id: this.workingList[j].id})
          break;
        }
      }
    }
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.organizationId),
      recorddiffids: category,
      processid: Number(this.templateSelected),
      loggedinmstorgnhirarchyid: Number(this.loginUserOrganizationId),
    };
    // console.log( JSON.stringify(data));
    if (!this.messageService.isBlankField(data)) {
      this.rest.mapprocesstemplate(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          const id = this.respObject.details;
          this.getTableData();
          this.resetValues();
          this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
        } else {
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {

      });
    } else {
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }
  }

  OnChangeRecordByDiffType(index) {
    // this.recorddifftypename = this.recordTypeStatus[index - 1].typename;
    if (index !== 0) {
      const seqNumber = this.recordTypeStatus[index - 1].seqno;
      const data = {
        clientid: this.clientId,
        mstorgnhirarchyid: Number(this.organizationId),
        seqno: Number(seqNumber)
      };
      this.getrecord(data);
    }
  }


  getrecord(data) {
    this.rest.getrecordbydifftype(data).subscribe((res: any) => {
      if (res.success) {
        this.formTicketTypeList = res.details;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      //console.log(err);
    });
  }


  onPropertyChange(type) {
    // this.recorddiffname = this.formTicketTypeList[index - 1].typename;
    const data = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': Number(this.organizationId),
      // 'forrecorddifftypeid': Number(this.fromRecordDiffType),
      'forrecorddiffid': Number(this.fromRecordDiffId)
    };
    if (type === 'm') {
      data['forrecorddifftypeid'] = Number(this.fromRecordDiffType);
    } else {
      data['forrecorddifftypeid'] = Number(this.fromRecordDiffType1);
    }
    this.rest.getworkinglabelname(data).subscribe((res: any) => {
      if (res.success) {
        // res.details.values.unshift({id: 0, name: 'Select Working Label'});
        this.workingList = res.details.values;
        this.selectAll(this.workingList);
        if (type === 'm') {
          //this.workingdiffid = 0;
        } else {
          //this.workingdiffid = this.workingdiff1;
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
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

  getorganizationclientwise() {
    this.rest.getorganizationclientwisenew({clientid: Number(this.clientId),mstorgnhirarchyid: Number(this.loginUserOrganizationId)}).subscribe((res: any) => {
      if (res.success) {
        this.organizationList = res.details;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  // onWorkingChange(selectedIndex: any) {
  //   this.recorddiffname = this.workingList[selectedIndex].name;
  //   this.recorddifftypename = this.workingList[selectedIndex].recorddifftypname;
  //   this.workingtypeid = this.workingList[selectedIndex].recorddifftypid;
  //   // console.log(this.workingtypeid,this.recorddiffname,this.recorddifftypename);
  // }

  onTemplateChange(selectedIndex: any) {

  }
}
