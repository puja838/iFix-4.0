import {Component, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {RestApiService} from '../rest-api.service';
import {MessageService} from '../message.service';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {Filters, Formatters, OnEventArgs} from 'angular-slickgrid';

@Component({
  selector: 'app-sla-indicator',
  templateUrl: './sla-indicator.component.html',
  styleUrls: ['./sla-indicator.component.css']
})
export class SlaIndicatorComponent implements OnInit {

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
  @ViewChild('content') private content;
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
  fromValue: string;
  toValue: string;
  fromPropLevels = [];
  fromlevelid: number;
  toPropLevels = [];
  tolevelid: number;
  pauseSla: number;
  slaName: string;
  slaNames = [];
  selectedSlaName: number;
  orgName: string;
  slaNameSelected: number;
  fromRecDiffId: string;
  toRecDiffId: string;
  updateFlag: boolean;

  selectedMeter: number;
  meters = [];
  slaMeterName: any;
  slaTermsNames = [];

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
              // console.log(JSON.stringify(item));
              this.rest.deleteslapauseindicator({id: item.id}).subscribe((res) => {
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
      pageName: 'SLA Indicator',
      openModalButton: 'Add SLA Indicator',
      searchModalButton: 'SLA Indicator',
      breadcrumb: 'SLA Indicator',
      folderName: 'All SLA Indicator',
      tabName: 'SLA Indicator'
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
          this.updateFlag = true;
          this.resetValues();
          // console.log("\n ARGS DATA CONTEXT ::  "+JSON.stringify(args.dataContext));
          this.selectedId = args.dataContext.id;
          this.organizationId = args.dataContext.mstorgnhirarchyid;
          this.fromRecordDiffTypeId = args.dataContext.recorddifftypeidtype;
          this.fromRecDiffId = args.dataContext.recorddiffidtype;
          this.toRecordDiffTypeId = args.dataContext.recorddifftypeidstatus;
          this.toRecDiffId = args.dataContext.recorddiffidstatus;
          this.slaNameSelected = args.dataContext.mstslaid;
          this.selectedMeter = Number(args.dataContext.slametertypeid);

          this.pauseSla = Number(args.dataContext.startstopindicator);
          this.getRecordDiffType('u');
          this.getSlaName('u');
          this.getSLAmeternames();
          this.getSLAtermsnames(this.selectedMeter);
          this.modalReference = this.modalService.open(this.content, {});
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },
      {
        id: 'orgn', name: 'Organization', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'fromrecorddifftypename', name: 'From Property Type ', field: 'recorddifftypeidtypenm', sortable: true, filterable: true
      },
      {
        id: 'fromrecorddiffname', name: 'From Property ', field: 'recorddiffidtypenm', sortable: true, filterable: true
      },
      {
        id: 'torecorddifftypename', name: 'To Property Type ', field: 'recorddifftypeidstatusnm', sortable: true, filterable: true
      },
      {
        id: 'torecorddiffname', name: 'To Property', field: 'recorddiffidstatusnm', sortable: true, filterable: true
      },
      {
        id: 'slaname', name: 'SLA Name', field: 'slaname', sortable: true, filterable: true
      },
      {
        id: 'slametertypename', name: 'SLA Meter', field: 'slametertypename', sortable: true, filterable: true
      },
      {
        id: 'startstopindicatorname',
        name: 'SLA Start/Stop Indicator',
        field: 'startstopindicatorname',
        sortable: true,
        filterable: true
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
        this.edit = auth[0].editFlag;
        this.del = auth[0].deleteFlag;
        this.clientId = auth[0].clientid;
        this.baseFlag = auth[0].baseFlag;
        this.loginUserOrganizationId = auth[0].mstorgnhirarchyid;
       // console.log('auth1===' + JSON.stringify(auth));
        this.onPageLoad();
      });
    }
  }

  onPageLoad() {
    // this.getTableData();
    this.getorganizationclientwise();
  }

  openModal(content) {
    this.isError = false;
    this.updateFlag = false;
    this.resetValues();
    this.getRecordDiffType('i');
    // this.notifier.notify('success', 'Module added successfully');
    this.modalService.open(content, {size: 'sm'}).result.then((result) => {
    }, (reason) => {

    });
  }

  onOrgChange(index) {
    this.orgName = this.organizationList[index - 1].organizationname;
    this.getSlaName('i');
    this.getSLAmeternames();
  }

  getSlaName(type) {
    const slaData = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId)
    };
    this.rest.getslanames(slaData).subscribe((res: any) => {
      if (res.success) {
        this.slaNames = res.details;
        if (type === 'i') {
          this.selectedSlaName = 0;
        } else {
          this.selectedSlaName = this.slaNameSelected;
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
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
   // console.log(data);
    this.rest.getslapauseindicator(data).subscribe((res) => {
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
      for (let i = 0; i < data.length; i++) {
        if (data[i].startstopindicator === 1) {
          data[i]['pauseSla'] = 1;
        } else {
          data[i]['pauseSla'] = 0;
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

  getRecordDiffType(type) {
    this.rest.getRecordDiffType().subscribe((res: any) => {
      if (res.success) {
        this.recordTypeStatus = res.details;
        if (type === 'u') {
          for (let i = 0; i < this.recordTypeStatus.length; i++) {
            if (Number(this.recordTypeStatus[i].id) === Number(this.fromRecordDiffTypeId)) {
              this.fromRecordDiffTypeSeqno = this.recordTypeStatus[i].seqno;
              this.getPropertyValue(Number(this.fromRecordDiffTypeSeqno), 'from', type);
            }
            if (Number(this.recordTypeStatus[i].id) === Number(this.toRecordDiffTypeId)) {
              this.toRecordDiffTypeSeqno = this.recordTypeStatus[i].seqno;
              this.getPropertyValue(Number(this.toRecordDiffTypeSeqno), 'to', type);
            }
          }
        //  console.log(this.fromRecordDiffTypeSeqno + '================' + this.toRecordDiffTypeSeqno);
        }
      }
    });
  }

  resetValues() {
    // this.recordTypeStatus = [];
    this.selectedSlaName = 0;
    this.organizationId = '';
    this.fromRecordDiffTypeId = '';
    this.fromRecordDiffId = '';
    this.toRecordDiffTypeId = '';
    this.toRecordDiffId = '';
    this.fromRecordDiffTypeSeqno = '';
    this.toRecordDiffTypeSeqno = '';
    this.fromValue = '';
    this.toValue = '';
    this.fromPropLevels = [];
    this.toPropLevels = [];
    this.tolevelid = 0;
    this.fromlevelid = 0;
    this.pauseSla = 0;
    this.selectedMeter = 0;
    this.meters = [];
    this.slaTermsNames = [];
    this.toTicketTypeList = [];
  }

  onSlaNameChange(index) {
    this.slaName = this.slaNames[index - 1].slaname;
  //  console.log('this.slaName===========' + this.slaName);
  }

  save() {
    if (this.fromRecordDiffTypeId === this.toRecordDiffTypeId) {
      this.notifier.notify('error', this.messageService.SAME_PROPERTY_TYPE_ERROR);
      return false;
    } else {
      this.isError = false;
    }
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      recorddiffidtype: Number(this.fromRecordDiffId),
      recorddiffidstatus: Number(this.toRecordDiffId),
      mstslaid: Number(this.selectedSlaName),
      slametertypeid: Number(this.selectedMeter)
    };
    if (this.fromPropLevels.length === 0) {
      data['recorddifftypeidtype'] = Number(this.fromRecordDiffTypeId);
    } else {
      data['recorddifftypeidtype'] = Number(this.fromlevelid);
    }

    if (this.toPropLevels.length === 0) {
      data['recorddifftypeidstatus'] = Number(this.toRecordDiffTypeId);
    } else {
      data['recorddifftypeidstatus'] = Number(this.tolevelid);
    }
    if (!this.messageService.isBlankField(data) && Number(this.pauseSla)!=-1) {
      data['startstopindicator'] =  Number(this.pauseSla);
    //  console.log("\n DATA  :: "+JSON.stringify(data));
      this.rest.addslapauseindicator(data).subscribe((res) => {
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
      recorddiffidtype: Number(this.fromRecordDiffId),
      recorddiffidstatus: Number(this.toRecordDiffId),
      mstslaid: Number(this.selectedSlaName),
      slametertypeid: Number(this.selectedMeter)
    };
    if (this.fromPropLevels.length === 0) {
      data['recorddifftypeidtype'] = Number(this.fromRecordDiffTypeId);
    } else {
      data['recorddifftypeidtype'] = Number(this.fromlevelid);
    }

    if (this.toPropLevels.length === 0) {
      data['recorddifftypeidstatus'] = Number(this.toRecordDiffTypeId);
    } else {
      data['recorddifftypeidstatus'] = Number(this.tolevelid);
    }
    if (!this.messageService.isBlankField(data) && Number(this.pauseSla)!=-1) {
      data['startstopindicator'] =  Number(this.pauseSla);
      this.rest.updateslapauseindicator(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          this.getTableData();
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

  getrecordbydifftype(index, flag) {
    if (index !== 0) {
      let seqNumber = '';
      if (flag === 'from') {
        this.fromRecordDiffTypeId = this.recordTypeStatus[index - 1].id;
        // this.isfromtext = this.recordTypeStatus[index - 1].istextfield;
        seqNumber = this.fromRecordDiffTypeSeqno;
        this.fromPropLevels = [];
        this.fromValue = '';
        this.formTicketTypeList = [];
      } else {
        this.toRecordDiffTypeId = this.recordTypeStatus[index - 1].id;
        // this.istotext = this.recordTypeStatus[index - 1].istextfield;
        seqNumber = this.toRecordDiffTypeSeqno;
        this.toPropLevels = [];
        this.toValue = '';
        this.toTicketTypeList = [];
      }
      const data = {
        clientid: this.clientId,
        mstorgnhirarchyid: Number(this.organizationId),
        fromrecorddifftypeid: Number(this.fromRecordDiffTypeId),
        fromrecorddiffid: Number(this.fromRecordDiffId),
        seqno: Number(seqNumber),
      };
      this.rest.getlabelbydiffseq(data).subscribe((res: any) => {
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
              this.getPropertyValue(Number(seqNumber), flag, 'i');
            } else {
              this.toPropLevels = [];
              this.getCatPropertyValue(Number(seqNumber), flag, 'i');
            }
          }
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });

    }
  }

  getPropertyValue(seqNumber, flag, type) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      seqno: seqNumber
    };
    this.rest.getrecordbydifftype(data).subscribe((res: any) => {
      if (res.success) {
        if (flag === 'from') {
          this.formTicketTypeList = res.details;
          if (type === 'i') {
            this.fromRecordDiffId = '';
          } else {
            this.fromRecordDiffId = this.fromRecDiffId;
            this.getCatPropertyValue(Number(this.toRecordDiffTypeSeqno), 'to', type);
          }
        } 
        // else {
        //   this.toTicketTypeList = res.details;
        //   if (type === 'i') {
        //     this.toRecordDiffId = '';
        //   } else {
        //     this.toRecordDiffId = this.toRecDiffId;
        //   }
        // }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getCatPropertyValue(seqNumber, flag, type) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      fromrecorddifftypeid: Number(this.fromRecordDiffTypeId),
      fromrecorddiffid: Number(this.fromRecordDiffId),
      seqno: seqNumber
    };
    this.rest.getmappeddiffbyseq(data).subscribe((res: any) => {
      if (res.success) {
          this.toTicketTypeList = res.details;
          if (type === 'i') {
            this.toRecordDiffId = '';
          } else {
            this.toRecordDiffId = this.toRecDiffId;
          }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
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

  onLevelChange(selectedIndex: any, type: string) {
    let seq;
    if (type === 'to') {
      seq = this.toPropLevels[selectedIndex].seqno;
      this.getCatPropertyValue(seq,type,'i')
    } else {
      seq = this.fromPropLevels[selectedIndex].seqno;
      this.getPropertyValue(seq, type, 'i');
    }
  }

  getSLAmeternames(){
    this.rest.getSLAmeternames().subscribe((res: any) => {
      if (res.success) {
        this.meters = res.details;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onMeterChange(index: any){
    this.slaMeterName = this.meters[index - 1].name;
    this.getSLAtermsnames(index);
  }

  getSLAtermsnames(index: any){
    const data = {
      "clientid": this.clientId,
      "mstorgnhirarchyid": Number(this.organizationId),
      "slametertypeid": index
    };
    this.rest.getSLAtermsnames(data).subscribe((res: any) => {
      if (res.success) {
        this.slaTermsNames = res.details;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });

  }

}

