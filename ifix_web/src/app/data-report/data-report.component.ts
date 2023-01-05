import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { RestApiService } from '../rest-api.service';
import { MessageService } from '../message.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Formatters, OnEventArgs } from 'angular-slickgrid';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { flatten } from '@angular/compiler'

@Component({
  selector: 'app-data-report',
  templateUrl: './data-report.component.html',
  styleUrls: ['./data-report.component.css']
})
export class DataReportComponent implements OnInit {
  displayed = true;
  totalData = 0;
  show: boolean;
  selected: number;
  respObject: any;
  clientSelected: number;
  displayData: any;
  add = false;
  del = false;
  edit = false;
  view = false;
  isError = false;
  errorMessage: string;
  // private notifier: NotifierService;
  private baseFlag: any;
  collectionSize: number;
  pageSize: number;
  private userAuth: Subscription;
  dataLoaded: boolean;
  isLoading = false;
  organization = [];
  orgSelected = [];
  orgSelected1: number;
  orgName: string;
  clientId: number;
  orgId: number;
  recordType: string;
  recordTypeIds = [];
  recordTypeNames = [];
  recordTypeName: string;
  recordTypeIdSelected: number;
  recordTypeNameSelected: number;
  clientSelectedName: string;
  orgSelectedName: string;
  recordtermvalue: string;
  organizationName: string;
  selectedId: number;
  recordTypeIdSelected1: number;
  selectedRecordTypeId: number;
  recordTypeNameSelected1: number;
  selectedRecordTypeName: number;
  updateFlag = 0;
  orgnId: number;
  isMandatory: boolean;
  isMandatory1: boolean;
  @ViewChild('content') private content;
  @ViewChild('endDate') endDate: ElementRef;
  @ViewChild('startDate') startDate: ElementRef
  private modalReference: NgbModalRef;
  isEdit: boolean;
  colordata: any;
  clients = []
  clientName: string;
  clientOrgnId: any;
  startTime: any;
  endTime: any;
  isAllDate = false;
  groups = [];
  isManagement: string;

  recordTypeStatus = [];
  fromtickettypedifftypeid = '';
  fromRecordDiffTypeSeqno = '1';
  fromRecordDiffId = '';
  fromPropLevels = [];
  fromlevelid: number;
  formTicketTypeList = [];
  fromRecordDiffTypeStat = '2';
  fromRecDiffId: string;
  fromtickettypedifftypename: string;
  fromtickettypedifftypeidstat = 0;
  fromcatdifftypename = '';
  fromlevelcatgid: any;
  formTicketTypeListStat = [];
  fromPropLevelsCat = [];
  fromRecordDiffStat = [];
  fromtickettypediffname = '';
  fromstatlabelname = '';
  fromcatdiffname = '';
  Difference_In_Days: any;
  constructor(private rest: RestApiService, private messageService: MessageService,
    private route: Router, private modalService: NgbModal, private notifier: NotifierService) {

    this.messageService.getCellChangeData().subscribe(item => {
      switch (item.type) {
        case 'delete':
          // console.log('deleted');
          if (!this.del) {
            this.notifier.notify('error', this.messageService.DELETE_PERMISSION);
          } else {
            if (confirm('Are you sure?')) {
              this.rest.deleteslatermentry({ id: item.id, mapid: item.mapid }).subscribe((res) => {
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
    });;

  }

  ngOnInit(): void {
    this.colordata = this.messageService.colors;
    //console.log("COLOR",this.colordata);
    this.dataLoaded = true;
    this.isAllDate = false;
    this.pageSize = this.messageService.pageSize;
    this.endTime = ''
    this.displayData = {
      pageName: 'Data Report',
      openModalButton: 'Add Data Report',
      breadcrumb: 'Data Report',
      folderName: 'Data Report',
      tabName: 'Data Report',
    };
    // this.rest.getallclientnames().subscribe((res) => {
    //   this.respObject = res;
    //   if (this.respObject.success) {
    //     this.respObject.details.unshift({ id: 0, name: 'Select Client' });
    //     this.clients = this.respObject.details;
    //     this.clientSelected = 0;
    //   } else {
    //     this.isError = true;
    //     this.notifier.notify('error', this.respObject.message);
    //   }
    // }, (err) => {
    //   this.notifier.notify('error', this.messageService.SERVER_ERROR);
    // });

    const columnDefinitions = [
      // {
      //   id: 'delete',
      //   field: 'id',
      //   excludeFromHeaderMenu: true,
      //   formatter: Formatters.deleteIcon,
      //   minWidth: 30,
      //   maxWidth: 30,
      // },

    ];
    this.messageService.setColumnDefinitions(columnDefinitions);
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.orgnId = this.messageService.orgnId;
      this.baseFlag = this.messageService.baseFlag;
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
        this.orgnId = auth[0].mstorgnhirarchyid;
        this.baseFlag = auth[0].baseFlag;
        this.groups = auth[0].group;
        this.onPageLoad();
      });
    }
  }

  onPageLoad() {
    let match = false;
    for (let i = 0; i < this.groups.length; i++) {
      if (this.groups[i].ismanagement === "Y") {
        match = true;
        break;
      }
    }
    if (match) {
      this.getorganizationclientwisenew();
    } else {
      this.getorgassignedcustomer();
    }

    this.getRecordDiffType();
  }

  openModal(content) {
    this.reset();
    this.isEdit = false;
    this.modalService.open(content).result.then((result) => {
    }, (reason) => {

    });
  }

  reset() {
    this.orgSelected = [];
    this.fromRecordDiffTypeSeqno = '1';
    this.fromRecordDiffId = '';
    this.formTicketTypeList = []
    this.fromRecordDiffTypeStat = '2';
    this.fromRecordDiffStat = [];
    this.formTicketTypeListStat = [];
    this.startTime = '';
    this.endTime = '';
    this.isAllDate = false;
  }

  fromDateChange(date) {
    let today = new Date();
    if (date.getTime() > today.getTime()) {
      this.notifier.notify('error', "From date cannot be future date");
      this.startTime = "";
      this.startDate.nativeElement.value = '';
    }
    else {
      if (this.endTime !== '') {
        let Difference_In_Time = this.endTime.getTime() - date.getTime();
        this.Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        // console.log(this.Difference_In_Days)
        if (this.Difference_In_Days > 7) {
          this.notifier.notify('error', "The to date must be within the next 7 days");
          this.endTime = ''
        }
      }
    }
  }

  toDateChange(date) {
    let today = new Date();
    let Difference_In_Time = this.endTime.getTime() - this.startTime.getTime();
    this.Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    if (date.getTime() > today.getTime()) {
      this.notifier.notify('error', "To date cannot be future date");
      this.endTime = "";
      this.endDate.nativeElement.value = '';
    }
    else if (this.Difference_In_Days > 7) {
      this.notifier.notify('error', "The to date must be within the next 7 days");
      this.endTime = "";
      this.endDate.nativeElement.value = '';
      // console.log(this.endTime)
    }
    else if (this.Difference_In_Days === 0) {
      let year = this.startTime.getFullYear();
      let month = this.startTime.getMonth() + 1;
      let day = this.startTime.getDate();
      const toDate = year + '-' + month + '-' + day + ' ' + '23:59:59';
      this.endTime = new Date(toDate)
    
    }
    else {
      // this.endTime
    }

  }

  onOrgChange() {
    this.getrecordbydifftype(10)
  }

  getorganizationclientwisenew() {
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgnId)
    };
    this.rest.getorganizationclientwisenew(data).subscribe((res) => {
      this.respObject = res;
      let orgArray = [];
      if (this.respObject.success) {
        if (this.respObject.details.length > 0) {
          for (let i = 0; i < this.respObject.details.length; i++) {
            orgArray.push({ 'mstorgnhirarchyid': this.respObject.details[i].id, 'mstorgnhirarchyname': this.respObject.details[i].organizationname });
          }
          this.organization = orgArray;
        }
        if (this.organization.length > 0) {
          // for (let i = 0; i < this.organization.length; i++) {
          //   this.orgSelected.push(Number(this.organization[i].mstorgnhirarchyid));
          // }
          // console.log(this.orgSelected);
        
          this.orgSelected = []
        }
          this.selectAll(this.organization)
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getorgassignedcustomer() {
    const data = {
      clientid: Number(this.clientId),
      refuserid: Number(this.messageService.getUserId())
    };
    this.rest.getorgassignedcustomer(data).subscribe((res: any) => {
      if (res.success) {
        this.organization = res.details.values;
        this.selectAll(this.organization)
        this.orgSelected = []
      } else {
        this.isError = true;
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.isError = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getrecordbydifftype(index) {
    if (index !== 0) {
      let seqNumber = '';
      this.fromtickettypedifftypeid = this.recordTypeStatus[index].id;
      this.fromtickettypedifftypename = this.recordTypeStatus[index].typename;
      seqNumber = this.fromRecordDiffTypeSeqno;
      this.fromPropLevels = [];
      this.fromlevelid = 0;
      this.formTicketTypeList = [];
      this.getPropertyValue(Number(seqNumber));
    }
  }

  getPropertyValue(seqNumber) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyids: this.orgSelected,
      seqno: seqNumber,
      tickettypeseq: 0
    };
    this.rest.getrecordbydifftypeofmultiorg(data).subscribe((res: any) => {
      if (res.success) {
        this.formTicketTypeList = res.details;
        this.fromRecordDiffId = '';
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getrecordbydifftypeStat(index) {
    if (index !== 0) {
      let seqNumber = '';
      this.fromtickettypedifftypeidstat = this.recordTypeStatus[index].id;
      this.fromcatdifftypename = this.recordTypeStatus[index].typename;
      // this.isfromtext = this.recordTypeStatus[index - 1].istextfield;
      seqNumber = this.fromRecordDiffTypeStat;
      this.fromPropLevelsCat = [];
      this.fromlevelcatgid = 0;
      this.formTicketTypeListStat = [];
      this.getCatgPropertyValue(Number(seqNumber))
    }
  }

  getfromticketproperty(index) {
    this.fromtickettypediffname = this.formTicketTypeList[index - 1].name;
    this.getrecordbydifftypeStat(9)
  }

  getfromcatagoryproperty(index) {
    this.fromcatdiffname = this.formTicketTypeListStat[index - 1].name;
  }

  getCatgPropertyValue(seqNumber) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyids: this.orgSelected,
      seqno: seqNumber,
      tickettypeseq: Number(this.fromRecordDiffId)
    };

    this.rest.getrecordbydifftypeofmultiorg(data).subscribe((res: any) => {
      if (res.success) {
        this.formTicketTypeListStat = res.details;
        this.selectAll(this.formTicketTypeListStat)

        this.fromRecordDiffStat = [];
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getRecordDiffType() {
    this.rest.getRecordDiffType().subscribe((res: any) => {
      if (res.success) {
        this.recordTypeStatus = res.details;
      }
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

  onFieldCheck() {
    if (this.isAllDate === true) {
      this.startTime = ''
      this.endTime = ''
    }
  }

  save() {
    if (this.orgSelected.length === 0 || this.fromRecordDiffStat.length === 0 || this.startTime === '' || this.endTime === '') {
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);

      this.dataLoaded = true;
    }
    else if (((this.startTime !== '') || (this.endTime!=='')) && (this.Difference_In_Days > 7)) {
      this.notifier.notify('error', "The to date must be within the next 7 days");
      this.dataLoaded = true;
    }
    else {
      const data = {
        clientid: Number(this.clientId),
        mstorgnhirarchyids: this.orgSelected,
        tickettypeseq: Number(this.fromRecordDiffId),
        diffstatusseqnos: this.fromRecordDiffStat,
        fromdate: this.messageService.dateConverter(this.startTime, 4),
        todate: this.messageService.dateConverter(this.endTime, 4)
      };
      this.dataLoaded = false;
      if (!this.messageService.isBlankField(data)) {
        if (this.endTime < this.startTime) {
          this.dataLoaded = true;
          this.notifier.notify('error', this.messageService.END_TIME_GREATERTHAN_START_TIME);

        } else {
          this.rest.recordfulldetailsdownload(data).subscribe((res) => {
            this.respObject = res;
            if (this.respObject.success) {
              this.dataLoaded = true;
              const uploadname = this.respObject.uploadedfilename;
              const originalname = this.respObject.originalfilename;
              this.downloadFile(uploadname, originalname)
              this.isError = false;
              this.reset();
              // this.getTableData();
              this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
            } else {
              this.dataLoaded = true;
              this.notifier.notify('error', this.respObject.message);
            }
          }, (err) => {
            this.dataLoaded = true;
            this.notifier.notify('error', this.messageService.SERVER_ERROR);
          });
        }
      } else {
        this.dataLoaded = true;
        this.notifier.notify('success', this.messageService.BLANK_ERROR_MESSAGE);
      }
    }

  }

  downloadFile(uploadname, originalname) {
    const data = {
      'clientid': Number(this.clientId),
      'mstorgnhirarchyid': Number(this.orgnId),
      'filename': uploadname
    };
    // console.log(JSON.stringify(data))
    // console.log("Upload",uploadname,"!!Download",originalname)
    this.dataLoaded = false;
    this.rest.filedownload(data).subscribe((blob: any) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = originalname;
      a.click();
      URL.revokeObjectURL(objectUrl);
      this.dataLoaded = true;
    });
  }

  getTableData() {
    this.getData({ offset: 0, limit: this.pageSize });
  }

  getData(paginationObj) {
    const offset = paginationObj.offset;
    const limit = paginationObj.limit;
    this.dataLoaded = true;
    const data = {
      offset: offset,
      limit: limit
    };
    // this.rest.getallslatermentry(data).subscribe((res) => {
    //   this.respObject = res;
    //   //console.log(JSON.stringify(res));
    //   this.executeResponse(this.respObject, offset);
    // }, (err) => {
    //   this.notifier.notify('error', this.messageService.SERVER_ERROR);
    // });
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
    this.getData({ offset: 0, limit: this.pageSize });
  }

  ngOnDestroy(): void {
    if (this.userAuth) {
      this.userAuth.unsubscribe();
    }
  }

}
