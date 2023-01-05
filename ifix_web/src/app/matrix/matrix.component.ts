import {Component, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {RestApiService} from '../rest-api.service';
import {MessageService} from '../message.service';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {Formatters, OnEventArgs} from 'angular-slickgrid';


@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.css']
})
export class MatrixComponent implements OnInit {

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
  organizationId = 0;
  organizationName = 0;
  ticketTypeName = 0;
  ticketType = 0;
  formTicketTypeList = [];
  toTicketTypeList = [];
  organizationList = [];
  loginUserOrganizationId: number;
  seqNo = 1;
  recordDifTypeId: number;
  recordTypeStatus = [];
  fromRecordDiffTypeId = 0;
  fromRecordDiffType = 0;
  fromRecordDiffId = 0;
  toRecordDiffTypeId = 0;
  toRecordDiffTypeSeqno = 0;
  toRecordDiffId = 0;
  levels = [];
  levelSelected = 0;
  levelSelected1 = 0;
  workinglevel = [];
  workId: number;
  workName: string;
  seq: any;
  recorddifftypename: string;
  recorddiffname: string;
  levelName: string;
  followUp: any;
  // workGrpSelected:any;
  fromRecordDiffTypeSeqno: number;
  fromPropLevels = [];
  fromlevelid: any;

  // redioButton:any;
  // radioName:any;

  recordDiffTypeUrgency: any;
  recordTypeUrgency = [];
  levelidUrgency: any;
  recordDiffIdUrgency: any;
  propLevelsUrgency = [];
  ticketTypeUrgencyList = [];


  recordDiffTypeImpact: any;
  recordTypeImpact = [];
  levelidImpact: any;
  propLevelsImpact = [];
  recordDiffIdImpact: any;
  ticketTypeImpactList = [];


  recordDiffTypePriority: any;
  recordTypePriority = [];
  propLevelsPriority = [];
  levelidPriority: any;
  recordDiffIdPriority: any;
  ticketTypePriorityList = [];
  chkMatrix: number;
  workingLevel = [];
  workingLevelSelect: any;

  isUpdate: boolean = false;
  estimatedeffort: any;
  slacompliance: any;
  fromRecordDiffType1: number;
  changetype:any;

  constructor(private _rest: RestApiService, private messageService: MessageService,
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
              this._rest.deletebusinessmatrix({id: item.id}).subscribe((res) => {
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
      pageName: 'Maintain Business Matrix',
      openModalButton: 'Business Matrix',
      breadcrumb: '',
      folderName: '',
      tabName: 'Map Business Matrix'
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
      //     console.log("\n DATA CONTEXT  ::   ",args.dataContext);
      //     this.resetValues();
      //     this.isError = false;
      //     this.isUpdate = true;
      //     this.selectedId = args.dataContext.id;
      //     this.clientId = args.dataContext.clientid;
      //     this.organizationId = args.dataContext.mstorgnhirarchyid;
      //     this.fromRecordDiffId = args.dataContext.mstrecorddifferentiationtickettypeid;
      //     this.recordDiffIdPriority = args.dataContext.mstrecorddifferentiationpriorityid;
      //     if(this.fromPropLevels.length > 0){
      //       this.fromlevelid = args.dataContext.mstrecorddifferentickettypeid;
      //       console.log("\n LEVEL ID  ::  ", this.fromlevelid);
      //     }else{
      //       this.fromRecordDiffType1 = args.dataContext.mstrecorddifferentickettypeid;
      //       console.log("\n TICKET TYPE ID  ::  ", this.fromRecordDiffType1);
      //     }

      //     if(Number(this.chkMatrix) === 1){
      //       this.recordDiffIdImpact = args.dataContext.mstrecorddifferentiationimpactid;
      //       this.recordDiffIdUrgency = args.dataContext.mstrecorddifferentiationurgencyid;
      //     }else{
      //       this.workingLevelSelect = args.dataContext.mstrecorddifferentiationcatid;
      //     }
      //     this.estimatedeffort = args.dataContext.estimatedeffort;
      //     this.slacompliance = args.dataContext.slacompliance;

      //     this.getRecordDiffType();

      //     this.modalReference = this.modalService.open(this.content, {});
      //     this.modalReference.result.then((result) => {
      //     }, (reason) => {

      //     });
      //   }
      // },

      // {
      //   id: 'clientName', name: 'Client', field: 'clientname', sortable: true, filterable: true
      // },
      {
        id: 'orgn', name: 'Organization', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      // {
      //   id: 'recorddifftypename', name: 'Property Type ', field: 'mstrecorddifferentiationtypename', sortable: true, filterable: true
      // },
      {
        id: 'recorddiffname', name: 'Property Name ', field: 'tickettype', sortable: true, filterable: true
      },
      {
        id: 'categoryname', name: 'Category Name', field: 'categoryname', sortable: true, filterable: true
      },
      {
        id: 'impactname', name: 'Impact Name', field: 'impactname', sortable: true, filterable: true
      },
      {
        id: 'urgencyname', name: 'Urgency Name', field: 'urgencyname', sortable: true, filterable: true
      },
      {
        id: 'Priorityname', name: 'Priority Name', field: 'Priorityname', sortable: true, filterable: true
      },
      {
        id: 'estimatedeffort', name: 'Estimated Effort', field: 'estimatedeffort', sortable: true, filterable: true
      },
      {
        id: 'slacompliance', name: 'SLA Compliance', field: 'slacompliance', sortable: true, filterable: true
      },
      {
        id: 'changetype', name: 'Change Type', field: 'changetype', sortable: true, filterable: true
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
        // console.log('auth1===' + JSON.stringify(auth));
        this.onPageLoad();
      });
    }
  }

  onPageLoad() {
    // this.getTableData();
    this.getorganizationclientwise();
    this.getRecordDiffType();

  }

  onOrgChange(index: any) {
    // console.log("lll"+index + JSON.stringify(this.organizationList));

    this.organizationName = this.organizationList[index - 1].organizationname;
    // this.getLevelData('i');
  }

  onlevelChange(index) {

  }

  // onWrkLevelChange(index:any){
  //   this.workinglevel = this.levels[index-1].recorddiffname;
  // }
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
    // console.log(data);
    this._rest.getbusinessmatrix(data).subscribe((res) => {
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
    this._rest.getRecordDiffType().subscribe((res: any) => {
      if (res.success) {
        this.recordTypeStatus = res.details;
        this.recordTypeUrgency = res.details;
        this.recordTypeImpact = res.details;
        this.recordTypePriority = res.details;
      }
    });
  }

  resetValues() {
    this.organizationId = 0;
    this.fromRecordDiffTypeId = 0;
    this.fromRecordDiffId = 0;
    this.toRecordDiffTypeId = 0;
    this.toRecordDiffId = 0;
    this.fromRecordDiffType = 0;
    this.levels = [];
    this.fromPropLevels = [];
    this.fromlevelid = 0;

    this.recordDiffTypeUrgency = 0;
    this.levelidUrgency = 0;
    this.recordDiffIdUrgency = 0;


    this.recordDiffTypeImpact = 0;
    this.levelidImpact = 0;
    this.recordDiffIdImpact = 0;


    this.recordDiffTypePriority = 0;
    this.levelidPriority = 0;
    this.recordDiffIdPriority = 0;

    this.workingLevelSelect = 0;
    this.chkMatrix = 0;
    this.isUpdate = false;
    this.estimatedeffort = "";
    this.slacompliance = "";
    this.changetype = "";
  }


  onRadioButtonChange(selectedValue) {
    // console.log(selectedValue);

  }


  save() {

    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      mstrecorddifferentiationtickettypeid: Number(this.fromRecordDiffId),
      mstrecorddifferentiationpriorityid: Number(this.recordDiffIdPriority),
      estimatedeffort: this.estimatedeffort,
      slacompliance: this.slacompliance,
      changetype: this.changetype
    };

    if (this.fromPropLevels.length > 0) {
      data['mstrecorddifferentickettypeid'] = Number(this.fromlevelid);
    } else {
      data['mstrecorddifferentickettypeid'] = Number(this.fromRecordDiffType);
    }
    if (Number(this.chkMatrix) === 1) {
      data['mstrecorddifferentiationimpactid'] = Number(this.recordDiffIdImpact);
      data['mstrecorddifferentiationurgencyid'] = Number(this.recordDiffIdUrgency)
    } else {
      data['mstrecorddifferentiationcatid'] = Number(this.workingLevelSelect)
    }

    console.log("kkkkkkkkkkk"+JSON.stringify(data))
    if (!this.messageService.isBlankField(data)) {
      if (Number(this.chkMatrix) === 1) {
        data['mstrecorddifferentiationcatid'] = 0
      } else {
        data['mstrecorddifferentiationimpactid'] = 0;
        data['mstrecorddifferentiationurgencyid'] = 0;
      }

       // console.log("\n SAVE DATA  ::  ", JSON.stringify(data));

      this._rest.addbusinessmatrix(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          // const id = this.respObject.details;
          // this.messageService.setRow({
          //   id: id,
          //   mstorgnhirarchyname: this.organizationName,
          //   mstrecorddifferentiationtypename:this.recorddifftypename,
          //   mstrecorddifferentiationname:this.recorddiffname,
          //   directionName:this.radioName
          // });
          // this.totalData = this.totalData + 1;
          // this.messageService.setTotalData(this.totalData);
          this.getTableData();
          this.isError = false;
          this.resetValues();
          // this.getTableData();
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
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      mstrecorddifferentiationtickettypeid: Number(this.fromRecordDiffId),
      mstrecorddifferentiationpriorityid: Number(this.recordDiffIdPriority),
      estimatedeffort: this.estimatedeffort,
      slacompliance: this.slacompliance,
      changetype: this.changetype
    };

    if (this.fromPropLevels.length > 0) {
      data['mstrecorddifferentickettypeid'] = Number(this.fromlevelid);
    } else {
      data['mstrecorddifferentickettypeid'] = Number(this.fromRecordDiffType);
    }
    if (Number(this.chkMatrix) === 1) {
      data['mstrecorddifferentiationimpactid'] = Number(this.recordDiffIdImpact);
      data['mstrecorddifferentiationurgencyid'] = Number(this.recordDiffIdUrgency)
    } else {
      data['mstrecorddifferentiationcatid'] = Number(this.workingLevelSelect)
    }

    // console.log("kkkkkkkkkkk"+JSON.stringify(data))
    if (!this.messageService.isBlankField(data)) {
      if (Number(this.chkMatrix) === 1) {

        data['mstrecorddifferentiationcatid'] = 0

      } else {
        data['mstrecorddifferentiationimpactid'] = 0;
        data['mstrecorddifferentiationurgencyid'] = 0;
      }

      //  console.log("\n SAVE DATA  ::  ", JSON.stringify(data));

      // this._rest.updatebusinessmatrix(data).subscribe((res) => {
      //   this.respObject = res;
      //   if (this.respObject.success) {
      //     // const id = this.respObject.details;
      //     // this.messageService.setRow({
      //     //   id: id,
      //     //   mstorgnhirarchyname: this.organizationName,
      //     //   mstrecorddifferentiationtypename:this.recorddifftypename,
      //     //   mstrecorddifferentiationname:this.recorddiffname,
      //     //   directionName:this.radioName
      //     // });
      //     // this.totalData = this.totalData + 1;
      //     // this.messageService.setTotalData(this.totalData);
      //     this.getTableData();
      //     this.isError = false;
      //     this.resetValues();
      //     // this.getTableData();
      //     this.notifier.notify('success', this.messageService.EDIT_SUCCESS);
      //   } else {
      //     this.notifier.notify('error', this.respObject.message);
      //   }
      // }, (err) => {
      //    this.notifier.notify('error', this.messageService.SERVER_ERROR);
      // });

    } else {
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);

    }

  }

  getrecordbydifftype(index) {
    this.recorddifftypename = this.recordTypeStatus[index - 1].typename;
    if (index !== 0) {
      this.fromPropLevels = [];
      this.formTicketTypeList = [];
      this.fromRecordDiffId = 0;
      this.fromlevelid = 0;
      const seqNumber = this.recordTypeStatus[index - 1].seqno;

      const data = {
        clientid: this.clientId,
        mstorgnhirarchyid: Number(this.organizationId),
        seqno: Number(seqNumber),
      };
      this._rest.getcategorylevel(data).subscribe((res: any) => {
        if (res.success) {
          if (res.details.length > 0) {


            this.fromPropLevels = res.details;
            // this.fromlevelid = 0;

          } else {

            this.fromPropLevels = [];
            this.fromlevelid = 0;
            this.getrecord(Number(seqNumber));
          }
        } else {

          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });


    }
  }

  onLevelChange(selectedIndex: any) {
    let seq;

    seq = this.fromPropLevels[selectedIndex - 1].seqno;

    this.getrecord(seq);
  }

  onLevelUrgencyChange(selectedIndex) {
    let seq;

    seq = this.propLevelsUrgency[selectedIndex - 1].seqno;

    this.getrecordUrgency(seq);
  }

  onPropertyImpactChange(index) {

  }


  getWorkingLevel() {

    const data = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': Number(this.organizationId),
      // 'forrecorddifftypeid': Number(this.fromRecordDiffType),
      'mstrecorddifferentiationtickettypeid': Number(this.fromRecordDiffId)
    };
    if (this.fromPropLevels.length > 0) {

      data['mstrecorddifferentickettypeid'] = Number(this.fromlevelid);
    } else {
      data['mstrecorddifferentickettypeid'] = Number(this.fromRecordDiffType);
    }

    // console.log(',,,,,,,,,,,,'+JSON.stringify(data));

    this._rest.getlastlevelcatname(data).subscribe((res: any) => {
      if (res.success) {
        this.workingLevel = res.details;
        // this.workingdiffid = 0;

      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });

  }


  getrecord(seqNumber) {

    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      seqno: Number(seqNumber)
    };
    this._rest.getrecordbydifftype(data).subscribe((res: any) => {
      if (res.success) {
        this.formTicketTypeList = res.details;
        // console.log(".............."+JSON.stringify(this.formTicketTypeList));

      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      console.log(err);
    });
  }


  onPropertyChange(index: any) {
    this.recorddiffname = this.formTicketTypeList[index - 1].typename;
    // {"clientid":1,"mstorgnhirarchyid":1,
    // "mstrecorddifferentickettypeid":1,"mstrecorddifferentiationtickettypeid":1}
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      mstrecorddifferentiationtickettypeid: Number(this.fromRecordDiffId),
    };
    if (this.fromPropLevels.length > 0) {
      data['mstrecorddifferentickettypeid'] = Number(this.fromlevelid);
    } else {
      data['mstrecorddifferentickettypeid'] = Number(this.fromRecordDiffType);
    }
    this._rest.checkmatrixconfig(data).subscribe((res: any) => {
      if (res.success) {
        this.chkMatrix = Number(res.details);
        if (this.chkMatrix === 0) {
          this.notifier.notify('error', 'No Priority Configaration of This Property Type');
        }
        // this.fromlevelid = 0;
      } else {

        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });

    this.getWorkingLevel()


  }

  onPropertyUrgencyChange(index: any) {

  }

  onPropertyPriorityChange(index: any) {

  }


  getrecordUrgencybydifftype(index) {
    this.recorddifftypename = this.recordTypeStatus[index - 1].typename;
    if (index !== 0) {
      this.propLevelsUrgency = [];
      this.ticketTypeUrgencyList = [];
      this.recordDiffIdUrgency = 0;
      this.levelidUrgency = 0;
      const seqNumber = this.recordTypeUrgency[index - 1].seqno;

      const data = {
        clientid: this.clientId,
        mstorgnhirarchyid: Number(this.organizationId),
        seqno: Number(seqNumber),
      };
      this._rest.getcategorylevel(data).subscribe((res: any) => {
        if (res.success) {
          if (res.details.length > 0) {


            this.propLevelsUrgency = res.details;
            // this.fromlevelid = 0;

          } else {

            this.propLevelsUrgency = [];
            this.levelidUrgency = 0;
            this.getrecordUrgency(Number(seqNumber));
          }
        } else {

          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });


    }
  }

  getrecordUrgency(seqNumber) {

    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      seqno: Number(seqNumber)
    };
    this._rest.getrecordbydifftype(data).subscribe((res: any) => {
      if (res.success) {
        this.ticketTypeUrgencyList = res.details;
        // console.log(".............."+JSON.stringify(this.formTicketTypeList));

      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      console.log(err);
    });
  }


  getrecordImpactbydifftype(index) {
    // this.recorddifftypename = this.recordDiffTypeImpact[index - 1].typename;
    if (index !== 0) {
      this.propLevelsImpact = [];
      this.ticketTypeImpactList = [];
      this.recordDiffIdImpact = 0;
      this.levelidImpact = 0;
      const seqNumber = this.recordTypeImpact[index - 1].seqno;

      const data = {
        clientid: this.clientId,
        mstorgnhirarchyid: Number(this.organizationId),
        seqno: Number(seqNumber),
      };
      this._rest.getcategorylevel(data).subscribe((res: any) => {
        if (res.success) {
          if (res.details.length > 0) {
            this.propLevelsImpact = res.details;
            // this.fromlevelid = 0;

          } else {

            this.propLevelsImpact = [];
            this.levelidImpact = 0;
            this.getrecordImpact(Number(seqNumber));
          }
        } else {

          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });


    }
  }

  onLevelImpactChange(selectedIndex) {
    let seq;

    seq = this.propLevelsImpact[selectedIndex - 1].seqno;

    this.getrecordImpact(seq);
  }

  getrecordImpact(seqNumber) {

    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      seqno: Number(seqNumber)
    };
    this._rest.getrecordbydifftype(data).subscribe((res: any) => {
      if (res.success) {
        this.ticketTypeImpactList = res.details;
        // console.log(".............."+JSON.stringify(this.formTicketTypeList));

      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      console.log(err);
    });
  }


  getrecordPrioritybydifftype(index) {
    // this.recorddifftypename = this.recordTypePriority[index - 1].typename;
    if (index !== 0) {
      this.propLevelsPriority = [];
      this.ticketTypePriorityList = [];
      this.levelidPriority = 0;
      this.recordDiffIdPriority = 0;
      const seqNumber = this.recordTypePriority[index - 1].seqno;

      const data = {
        clientid: this.clientId,
        mstorgnhirarchyid: Number(this.organizationId),
        seqno: Number(seqNumber),
      };
      this._rest.getcategorylevel(data).subscribe((res: any) => {
        if (res.success) {
          if (res.details.length > 0) {
            this.propLevelsPriority = res.details;
            // this.fromlevelid = 0;

          } else {

            this.propLevelsPriority = [];
            this.levelidPriority = 0;
            this.getrecordPrioity(Number(seqNumber));
          }
        } else {

          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });


    }
  }

  onLevelPriorityChange(selectedIndex) {
    let seq;
    seq = this.propLevelsPriority[selectedIndex - 1].seqno;
    this.getrecordPrioity(seq);
  }

  getrecordPrioity(seqNumber) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      seqno: Number(seqNumber)
    };
    this._rest.getrecordbydifftype(data).subscribe((res: any) => {
      if (res.success) {
        this.ticketTypePriorityList = res.details;
        // console.log(".............."+JSON.stringify(this.formTicketTypeList));

      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      console.log(err);
    });
  }


  getorganizationclientwise() {
    this._rest.getorganizationclientwisenew({clientid: Number(this.clientId),mstorgnhirarchyid: Number(this.loginUserOrganizationId)}).subscribe((res: any) => {
      if (res.success) {
        this.organizationList = res.details;
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      console.log(err);
    });
  }

}
