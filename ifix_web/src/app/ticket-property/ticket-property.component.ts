import {Component, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {RestApiService} from '../rest-api.service';
import {MessageService} from '../message.service';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {Formatters, OnEventArgs} from 'angular-slickgrid';

@Component({
  selector: 'app-ticket-property',
  templateUrl: './ticket-property.component.html',
  styleUrls: ['./ticket-property.component.css']
})
export class TicketPropertyComponent implements OnInit {

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
  ticketTypeName = '';
  ticketType = '';
  formTicketTypeList = [];
  toTicketTypeList = [];
  organizationList = [];
  loginUserOrganizationId: number;
  seqNo = 1;
  recordDifTypeId: number;
  recordTypeStatus = [];
  fromRecordDiffTypeId = '';
  fromRecordDiffTypeSeqno = '';
  fromRecordDiffId = '';
  toRecordDiffTypeId = '';
  toRecordDiffTypeSeqno = '';
  toRecordDiffId = '';
  isfromtext: number;
  istotext: number;
  fromValue: string;
  toValue: string;
  fromPropLevels = [];
  fromlevelid: number;
  toPropLevels = [];
  tolevelid: number;

  constructor(private rest: RestApiService, private messageService: MessageService,
              private route: Router, private modalService: NgbModal, private notifier: NotifierService) {
    this.messageService.getCellChangeData().subscribe(item => {
      // console.log(item);
      switch (item.type) {
        case 'delete':
          if (!this.del) {
            this.notifier.notify('error', 'You do not have delete permission');
          } else {
            if (confirm('Are you sure?')) {
              // console.log(JSON.stringify(item));
              this.rest.deleterecordtypemap({id: item.id}).subscribe((res) => {
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
      pageName: 'Record Property Mapping',
      openModalButton: 'Map Record Property',
      searchModalButton: 'Search',
      breadcrumb: 'Modules',
      folderName: 'All Modules',
      tabName: 'Map Record Property'
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
      //     console.log(args.dataContext);
      //     this.isError = false;
      //     this.selectedId = args.dataContext.id;
      //     this.organizationId = args.dataContext.mstorgnhirarchyid;
      //     this.fromRecordDiffTypeId = args.dataContext.fromrecorddifftypeid;
      //     this.fromRecordDiffId = args.dataContext.fromrecorddiffid;
      //     this.toRecordDiffTypeId = args.dataContext.torecorddifftypeid;
      //     this.toRecordDiffId = args.dataContext.torecorddiffid;
      //     this.modalReference = this.modalService.open(this.content1, {});
      //     this.modalReference.result.then((result) => {
      //     }, (reason) => {

      //     });
      //   }
      // },
      {
        id: 'clientName', name: 'Client', field: 'clientname', sortable: true, filterable: true
      },
      {
        id: 'orgn', name: 'Organization', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'fromrecorddifftypename', name: 'From Property Type ', field: 'fromrecorddifftypename', sortable: true, filterable: true
      },
      {
        id: 'fromrecorddiffname', name: 'From Property ', field: 'fromrecorddiffname', sortable: true, filterable: true
      },
      {
        id: 'torecorddifftypename', name: 'To Property Type ', field: 'torecorddifftypename', sortable: true, filterable: true
      },
      {
        id: 'torecorddiffname', name: 'To Property', field: 'torecorddiffname', sortable: true, filterable: true
      }
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
        console.log('auth1===' + JSON.stringify(auth));
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
      mstorgnhirarchyid: this.loginUserOrganizationId,
      offset: offset,
      limit: limit
    };
    console.log(data);
    this.rest.getrecordtypemap(data).subscribe((res) => {
      this.respObject = res;
      console.log('>>>>>>>>>>> ', JSON.stringify(res));
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
    this.organizationId = '';
    this.fromRecordDiffTypeId = '';
    this.fromRecordDiffId = '';
    this.toRecordDiffTypeId = '';
    this.toRecordDiffId = '';
    this.fromRecordDiffTypeSeqno = '';
    this.toRecordDiffTypeSeqno = '';
    this.isfromtext = 0;
    this.istotext = 0;
    this.fromValue = '';
    this.toValue = '';
    this.fromPropLevels = [];
    this.toPropLevels = [];
    this.tolevelid = 0;
    this.fromlevelid = 0;
  }

  save() {
    if (this.isfromtext === 1 && this.istotext === 1) {
      const data = {
        clientid: this.clientId,
        mstorgnhirarchyid: Number(this.organizationId),
        questiondifftypeid: Number(this.fromRecordDiffTypeId),
        answerdifftypeid: Number(this.toRecordDiffTypeId),
        questions:this.fromValue,
        answer:this.toValue
      };
      // console.log(JSON.stringify(data));
      if (!this.messageService.isBlankField(data)) {
        // console.log(JSON.stringify(data));
        this.rest.addquestionanswer(data).subscribe((res) => {
          this.respObject = res;
          if (this.respObject.success) {
            const id = this.respObject.details;
            /*this.messageService.setRow({
              id: id,
              mstorgnhirarchyid: Number(this.organizationId),
              recorddifftypeid: this.recordDifTypeId,
              recorddiffid: Number(this.ticketType),
              mstorgnhirarchyname: this.organizationName,
              recorddifferentiationname: this.ticketTypeName
            });
            this.totalData = this.totalData + 1;
            this.messageService.setTotalData(this.totalData);*/
            // this.isError = false;
            this.resetValues();
            this.getTableData();
            this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
          } else {
            this.notifier.notify('error', this.respObject.message);
          }
        }, (err) => {
          // this.isError = true;
          // this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
      } else {
        this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
      }
    } else {
      const data = {
        clientid: this.clientId,
        mstorgnhirarchyid: Number(this.organizationId),
        fromrecorddiffid: Number(this.fromRecordDiffId)

      };
      if (this.fromPropLevels.length === 0) {
        data['fromrecorddifftypeid'] = Number(this.fromRecordDiffTypeId);
      } else {
        data['fromrecorddifftypeid'] = Number(this.fromlevelid);
      }
      if (this.toPropLevels.length === 0) {
        data['torecorddiffid']= Number(this.toRecordDiffId);
        data['torecorddifftypeid'] = Number(this.toRecordDiffTypeId);
      } else {
        data['torecorddifftypeid'] = Number(this.tolevelid);
      }
      console.log(data);
      if (!this.messageService.isBlankField(data)) {

        if (this.fromRecordDiffTypeId === this.toRecordDiffTypeId) {
          this.notifier.notify('error', this.messageService.SAME_PROPERTY_TYPE_ERROR);
          return false;
        } else {
          if (this.toPropLevels.length > 0) {
            data['torecorddiffid']= Number(this.toRecordDiffId);
          }
          this.rest.addrecordtypemap(data).subscribe((res) => {
            this.respObject = res;
            if (this.respObject.success) {
              const id = this.respObject.details;
              this.isError = false;
              this.resetValues();
              this.getTableData();
              this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
            } else {
              this.notifier.notify('error', this.respObject.message);
            }
          }, (err) => {
          });
        }

      } else {
        this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
      }
    }
  }

  update() {
    const data = {
      id: this.selectedId,
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      fromrecorddifftypeid: Number(this.fromRecordDiffTypeId),
      fromrecorddiffid: Number(this.fromRecordDiffId),
      torecorddifftypeid: Number(this.toRecordDiffTypeId),
      torecorddiffid: Number(this.toRecordDiffId)
    };
    console.log('>>>>>>>>>>>>> ', JSON.stringify(data));
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
      let seqNumber = '';
      if (flag === 'from') {
        this.fromRecordDiffTypeId = this.recordTypeStatus[index - 1].id;
        this.isfromtext = this.recordTypeStatus[index - 1].istextfield;
        seqNumber = this.fromRecordDiffTypeSeqno;
        this.fromPropLevels = [];
        this.fromValue = '';
        this.formTicketTypeList = [];
      } else {
        this.toRecordDiffTypeId = this.recordTypeStatus[index - 1].id;
        this.istotext = this.recordTypeStatus[index - 1].istextfield;
        seqNumber = this.toRecordDiffTypeSeqno;
        this.toPropLevels = [];
        this.toValue = '';
        this.toTicketTypeList = [];
      }
      const data = {
        clientid: this.clientId,
        mstorgnhirarchyid: Number(this.organizationId),
        seqno: Number(seqNumber),
      };
      this.rest.getcategorylevel(data).subscribe((res: any) => {
        if (res.success) {
          if (res.details.length > 0) {
            res.details.unshift({id: 0, typename: 'Select Property Level'});
            if (flag === 'from') {
              this.fromPropLevels = res.details;
              this.fromlevelid = 0;
            } else {
              this.toPropLevels = res.details;
              this.tolevelid = 0;
            }
          } else {
            if (flag === 'from') {
              this.fromPropLevels = [];
            } else {
              this.toPropLevels = [];
            }
            this.getPropertyValue(Number(seqNumber), flag);
          }
        } else {
          this.isError = true;
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        this.isError = true;
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });

    }
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
          this.fromRecordDiffId = '';
        } else {
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
      console.log(err);
    });
  }

  onLevelChange(selectedIndex: any, type: string) {
    let seq;
    if (type === 'to') {
      seq = this.toPropLevels[selectedIndex].seqno;
    } else {
      seq = this.fromPropLevels[selectedIndex].seqno;
    }
    this.getPropertyValue(seq, type);
  }
}
