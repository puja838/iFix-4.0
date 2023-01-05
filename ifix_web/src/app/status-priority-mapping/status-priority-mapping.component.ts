import {Component, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {RestApiService} from '../rest-api.service';
import {MessageService} from '../message.service';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {Filters, Formatters, OnEventArgs} from 'angular-slickgrid';

@Component({
  selector: 'app-status-priority-mapping',
  templateUrl: './status-priority-mapping.component.html',
  styleUrls: ['./status-priority-mapping.component.css']
})
export class StatusPriorityMappingComponent implements OnInit {
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
  organizationList = [];
  loginUserOrganizationId: number;
  seqNo = 1;
  recordDifTypeId: number;
  recordTypeStatus = [];
  fromtickettypedifftypeid = '';
  fromRecordDiffTypeSeqno = '';
  fromRecordDiffId = '';
  fromValue: string;
  fromPropLevels = [];
  fromlevelid: number;
  orgName: string;
  fromRecDiffId: string;
  fromCatgRecDiffId: string;
  updateFlag: boolean;
  fromRecordDiffTypeStatus: any;
  fromlevelstatid: any;
  fromRecordDiffStat: any;
  fromPropLevelsStat = [];
  formTicketTypeListStat = [];
  fromtickettypediffname: string;
  fromtickettypedifftypename: string;
  fromcatlabelname: string;
  fromstatdifftypename: string;
  fromstatdiffname: string;
  fromtickettypedifftypeidstat: any;
  mstorgnhirarchyname: string;
  priority: any;
  tostatlabelname: any;

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
              //console.log(JSON.stringify(item));
              this.rest.deletemstrecorddiffpriority({id: item.id}).subscribe((res) => {
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
      pageName: 'Maintain Status Priority Mapping',
      openModalButton: 'Add Status Priority Mapping',
      breadcrumb: 'Status Priority Mapping',
      folderName: 'Status Priority Mapping',
      tabName: 'Status Priority Mapping'
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
          console.log('\n ARGS DATA CONTEXT  :: ' + JSON.stringify(args.dataContext));
          this.selectedId = args.dataContext.id;
          this.organizationId = args.dataContext.mstorgnhirarchyid;
          this.mstorgnhirarchyname = args.dataContext.mstorgnhirarchyname;
          this.fromtickettypedifftypeid = args.dataContext.typedifftypeid;

          this.fromtickettypedifftypeidstat = args.dataContext.difftypeid;
          this.fromRecordDiffId = this.fromRecDiffId = args.dataContext.typediffid;

          this.fromCatgRecDiffId = args.dataContext.diffid;
          this.priority = args.dataContext.priority;


          this.getRecordDiffType('u');
          this.modalReference = this.modalService.open(this.content, {});
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },
      {
        id: 'mstorgnhirarchyname', name: 'Organization', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'typedifftypename', name: 'Property Type ', field: 'typedifftypename', sortable: true, filterable: true
      },
      {
        id: 'typediffname', name: 'Property', field: 'typediffname', sortable: true, filterable: true  //typediffname  //stask
      },
      {
        id: 'difftypename', name: 'Property Type', field: 'difftypename', sortable: true, filterable: true  //difftypename  status
      },
      {
        id: 'diffname', name: 'Property', field: 'diffname', sortable: true, filterable: true
      },
      {
        id: 'priority', name: 'Priority', field: 'priority', sortable: true, filterable: true
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
    this.modalService.open(content).result.then((result) => {
    }, (reason) => {

    });
  }

  onOrgChange(index) {
    this.mstorgnhirarchyname = this.organizationList[index - 1].organizationname;
  }

  getfromticketproperty(index, flag) {
    if (flag === 'from') {
      this.fromtickettypediffname = this.formTicketTypeList[index - 1].typename;
      //console.log("Tickt Name",this.fromtickettypediffname);
    }
  }

  getfromstatusproperty(index) {
    this.fromstatdiffname = this.formTicketTypeListStat[index - 1].typename;
    //console.log("STAT Name",this.fromstatdiffname);
    // console.log("To",this.toTicketTypeListCatg)
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
    //console.log(data);
    this.rest.getallmstrecorddiffpriority(data).subscribe((res) => {
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
          data[i]['pauseSla'] = true;
        } else {
          data[i]['pauseSla'] = false;
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
            if (Number(this.recordTypeStatus[i].id) === Number(this.fromtickettypedifftypeid)) {
              this.fromRecordDiffTypeSeqno = this.recordTypeStatus[i].seqno;
              this.getPropertyValue(Number(this.fromRecordDiffTypeSeqno), 'from', type);
            }

            if (Number(this.recordTypeStatus[i].id) === Number(this.fromtickettypedifftypeidstat)) {
              this.fromRecordDiffTypeStatus = this.recordTypeStatus[i].seqno;
              const data = {
                clientid: this.clientId,
                mstorgnhirarchyid: Number(this.organizationId),
                fromrecorddifftypeid: Number(this.fromtickettypedifftypeid),
                fromrecorddiffid: Number(this.fromRecordDiffId),
                seqno: Number(this.fromRecordDiffTypeStatus),
              };
              this.getlebelcatg(data, 'from', Number(this.fromRecordDiffTypeStatus), 'u');
            }
          }
        }
      }
    });
  }


  resetValues() {
    // this.recordTypeStatus = [];
    this.organizationId = '';
    this.fromRecordDiffId = '';
    this.fromRecordDiffTypeSeqno = '';
    this.fromValue = '';
    this.fromPropLevels = [];
    this.fromlevelid = 0;
    this.fromRecordDiffTypeStatus = '';
    this.fromlevelstatid = 0;
    this.fromRecordDiffStat = '';
    this.fromPropLevelsStat = [];
    this.formTicketTypeListStat = [];
    this.priority = '';
  }

  save() {
    if (this.fromRecordDiffTypeSeqno === this.fromRecordDiffTypeStatus) {
      this.notifier.notify('error', this.messageService.SAME_PROPERTY_TYPE_ERROR);
      return false;
    } else {
      this.isError = false;
    }

    if (Number(this.priority) <= 0) {
      this.notifier.notify('error', 'Number must be greater than zero');
      return false;
    } else {
      this.isError = false;
    }

    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      typediffid: Number(this.fromRecordDiffId),  //sTask typediffid
      diffid: Number(this.fromRecordDiffStat),
      priority: Number(this.priority)

    };

    if (this.fromPropLevels.length === 0) {
      data['typedifftypeid'] = Number(this.fromtickettypedifftypeid);
    } else {
      data['typedifftypeid'] = Number(this.fromlevelid);
    }


    if (this.fromPropLevelsStat.length === 0) {
      data['difftypeid'] = Number(this.fromtickettypedifftypeidstat); //status //difftypeid
    } else {
      data['difftypeid'] = Number(this.fromlevelstatid);
    }

    if (!this.messageService.isBlankField(data)) {
      //console.log(JSON.stringify(data));
      this.rest.addmstrecorddiffpriority(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          const id = this.respObject.details;
          this.messageService.setRow({
            id: id,
            mstorgnhirarchyname: this.mstorgnhirarchyname,
            mstorgnhirarchyid: this.organizationId,
            typediffid: Number(this.fromRecordDiffId), //typediffid
            typediffname: this.fromtickettypediffname,  //typediffname sTask
            typedifftypeid: Number(this.fromtickettypedifftypeid),
            typedifftypename: this.fromtickettypedifftypename,
            diffid: Number(this.fromRecordDiffStat),
            diffname: this.fromstatdiffname,
            difftypeid: Number(this.fromtickettypedifftypeidstat), //difftypeid
            difftypename: this.fromstatdifftypename, //difftypename status
            priority: Number(this.priority)
          });
          this.totalData = this.totalData + 1;
          this.messageService.setTotalData(this.totalData);
          this.isError = false;
          this.resetValues();
          //this.getTableData();
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
    if (this.fromRecordDiffTypeSeqno === this.fromRecordDiffTypeStatus) {
      this.notifier.notify('error', this.messageService.SAME_PROPERTY_TYPE_ERROR);
      return false;
    } else {
      this.isError = false;
    }
    const data = {
      id: this.selectedId,
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      typediffid: Number(this.fromRecordDiffId),  //3 typediffid
      diffid: Number(this.fromRecordDiffStat),
      priority: Number(this.priority)
    };

    if (this.fromPropLevels.length === 0) {
      data['typedifftypeid'] = Number(this.fromtickettypedifftypeid);
    } else {
      data['typedifftypeid'] = Number(this.fromlevelid);
    }

    if (this.fromPropLevelsStat.length === 0) {
      data['difftypeid'] = Number(this.fromtickettypedifftypeidstat);  //1865 //difftypeid
    } else {
      data['difftypeid'] = Number(this.fromlevelstatid);
    }

    if (!this.messageService.isBlankField(data)) {
      this.rest.updatemstrecorddiffpriority(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.messageService.sendAfterDelete(this.selectedId);
          this.dataLoaded = true;
          // this.messageService.setRow({
          //   id: this.selectedId,
          //   mstorgnhirarchyname: this.mstorgnhirarchyname,
          //   mstorgnhirarchyid:this.organizationId,
          //   typediffid: Number(this.fromRecordDiffId), //typediffid
          //   typediffname:this.fromtickettypediffname,  //typediffname
          //   typedifftypeid : Number(this.fromtickettypedifftypeid),
          //   typedifftypename:this.fromtickettypedifftypename,
          //   diffid: Number(this.fromRecordDiffStat),
          //   diffname:this.fromstatdiffname,
          //   difftypeid: Number(this.fromtickettypedifftypeidstat), //difftypeid
          //   difftypename:this.fromstatdifftypename, //difftypename
          //   priority: Number(this.priority)
          // });
          this.isError = false;
          this.resetValues();
          this.getTableData();
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

  getrecordbydifftype(index, flag) {
    if (index !== 0) {
      let seqNumber = '';
      if (flag === 'from') {
        this.fromtickettypedifftypeid = this.recordTypeStatus[index - 1].id;
        this.fromtickettypedifftypename = this.recordTypeStatus[index - 1].typename;
        //console.log("Tickt id: ",this.fromtickettypedifftypeid,this.fromtickettypedifftypename);
        seqNumber = this.fromRecordDiffTypeSeqno;
        this.fromPropLevels = [];
        this.fromlevelid = 0;
        this.formTicketTypeList = [];
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
            }
          } else {
            if (flag === 'from') {
              this.fromPropLevels = [];
            }
            this.getPropertyValue(Number(seqNumber), flag, 'i');
          }
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });

    }
  }


  getrecordbydifftypestat(index, flag) {
    if (index !== 0) {
      let seqNumber = '';
      this.fromtickettypedifftypeidstat = this.recordTypeStatus[index - 1].id;
      this.fromstatdifftypename = this.recordTypeStatus[index - 1].typename;
      seqNumber = this.fromRecordDiffTypeStatus;
      this.fromPropLevelsStat = [];
      this.fromlevelstatid = 0;
      this.formTicketTypeListStat = [];
      const data = {
        clientid: this.clientId,
        mstorgnhirarchyid: Number(this.organizationId),
        fromrecorddifftypeid: Number(this.fromtickettypedifftypeid),
        fromrecorddiffid: Number(this.fromRecordDiffId),
        seqno: Number(seqNumber),
      };

      this.getlebelcatg(data, flag, seqNumber, 'i');
    }
  }


  getlebelcatg(data, flag, seqNumber, type) {
    let catSeq;
    this.rest.getlabelbydiffseq(data).subscribe((res: any) => {
      if (res.success) {
        if (res.details.length > 0) {
          res.details.unshift({id: 0, typename: 'Select Property Level'});
          this.fromPropLevelsStat = res.details;
          if (type === 'u') {
            for (let i = 0; i < this.fromPropLevelsStat.length; i++) {
              if (Number(this.fromPropLevelsStat[i].id) === Number(this.fromlevelstatid)) {
                catSeq = Number(this.fromPropLevelsStat[i].seqno);

              }
            }
          }
          // this.fromlevelstatid = 0;

          if (type === 'u') {
            this.formTicketTypeListStat = [];
            this.getStatPropertyValue(catSeq, flag, type);
          }
        } else {
          this.fromPropLevelsStat = [];
          this.formTicketTypeListStat = [];
          this.getStatPropertyValue(Number(seqNumber), flag, type);
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });

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
          }
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }


  getStatPropertyValue(seqNumber, flag, type) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      fromrecorddifftypeid: Number(this.fromtickettypedifftypeid),
      fromrecorddiffid: Number(this.fromRecordDiffId),
      seqno: seqNumber
    };
    this.rest.getmappeddiffbyseq(data).subscribe((res: any) => {
      if (res.success) {
        this.formTicketTypeListStat = res.details;
        if (type === 'i') {
          this.fromRecordDiffStat = '';
        } else {
          this.fromRecordDiffStat = this.fromCatgRecDiffId;
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }


  getorganizationclientwise() {
    this.rest.getorganizationclientwisenew({
      clientid: this.clientId,
      mstorgnhirarchyid: this.loginUserOrganizationId
    }).subscribe((res: any) => {
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
    seq = this.fromPropLevels[selectedIndex].seqno;
    this.getPropertyValue(seq, type, 'i');
  }

  onLevelChangeStat(selectedIndex: any, type: string) {
    let seq;
    seq = this.fromPropLevelsStat[selectedIndex].seqno;
    this.tostatlabelname = this.fromPropLevelsStat[selectedIndex].typename;
    this.getStatPropertyValue(seq, type, 'i');
  }
}
