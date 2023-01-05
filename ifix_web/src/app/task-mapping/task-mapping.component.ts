import {Component, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {RestApiService} from '../rest-api.service';
import {MessageService} from '../message.service';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {Filters, Formatters, OnEventArgs} from 'angular-slickgrid';

@Component({
  selector: 'app-task-mapping',
  templateUrl: './task-mapping.component.html',
  styleUrls: ['./task-mapping.component.css']
})
export class TaskMappingComponent implements OnInit {
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
  fromtickettypedifftypeid = '';
  fromRecordDiffTypeSeqno = '';
  fromRecordDiffId = '';

  toRecordDiffTypeSeqno = '';
  toRecordDiffId = '';
  fromValue: string;
  toValue: string;
  fromPropLevels = [];
  fromlevelid: number;
  toPropLevels = [];
  tolevelid: number;

  orgName: string;
  fromRecDiffId: string;
  fromCatgRecDiffId: string;
  toCatgRecDiffId: string;
  toRecDiffId: string;
  updateFlag: boolean;

  fromRecordDiffTypeCatg: any;
  fromlevelcatgid: any;
  fromRecordDiffCatg = [];
  fromPropLevelsCat = [];
  formTicketTypeListCatg = [];
  fromtickettypediffname: string;
  fromtickettypedifftypename: string;
  fromcatlabelname: string;
  fromcatdifftypename: string;
  totickettypedifftypename: string;
  tocatdifftypename: string;
  tocatlabelname: string;
  totickettypediffname: string;
  fromcatdiffname: string;
  toRecordDiffTypeCatg: any;
  tolevelcatgid: number;
  toRecordDiffCatg= [];
  toPropLevelsCat = [];
  toTicketTypeListCatg = [];
  totickettypedifftypeid = '';
  tocatdiffname: string;
  fromtickettypedifftypeidcat: any;
  totickettypedifftypeidcat: any;
  mstorgnhirarchyname: string;
  ticketTitle: any;
  describe: any;
  fileUploadUrl: string;
  uploadButtonName = 'Upload File';
  pathName: any;
  hideAttachment: boolean;
  attachMsg: string;
  attachment = [];
  formData: any;
  oriName: any;
  chgName: any;
  private attachFile: number;
  ticketId:any
  recordIdDiff:any

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
              this.rest.deletetaskmap({id: item.id}).subscribe((res) => {
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
    this.fileUploadUrl = this.rest.apiRoot + '/fileupload';
    this.pageSize = this.messageService.pageSize;
    this.displayData = {
      pageName: 'Maintain Task Mapping',
      openModalButton: 'Map Task',
      breadcrumb: 'Task Mapping',
      folderName: 'Task Mapping',
      tabName: 'Task Mapping'
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
        id: 'fromrecorddifftypename',
        name: 'From Property Type ',
        field: 'fromrecorddifftypename',
        sortable: true,
        filterable: true
      },
      {
        id: 'fromrecorddiffname', name: 'From Property ', field: 'fromrecorddiffname', sortable: true, filterable: true
      },
      {
        id: 'torecorddifftypename',
        name: 'To Property Type ',
        field: 'torecorddifftypename',
        sortable: true,
        filterable: true
      },
      {
        id: 'torecorddiffname', name: 'To Property', field: 'torecorddiffname', sortable: true, filterable: true
      },
      {
        id: 'title', name: 'Title ', field: 'title', sortable: true, filterable: true
      },
      {
        id: 'description', name: 'Description', field: 'description', sortable: true, filterable: true
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
    // this.notifier.notify('success', 'Module added successfully');
    this.modalService.open(content,{size:'xl'}).result.then((result) => {
    }, (reason) => {

    });
  }

  onOrgChange(index) {
    this.mstorgnhirarchyname = this.organizationList[index - 1].organizationname;
    this.formData = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.organizationId,
      // 'type': 'type'
      // 'user_id': this.messageService.getUserId()
    };
    this.getRecordDiffType('i');
  }

  getfromticketproperty(index, flag) {
    if (flag === 'from') {
      this.fromtickettypediffname = this.formTicketTypeList[index - 1].typename;
      this.recordIdDiff = this.fromRecordDiffId;
    } else {
      this.totickettypediffname = this.toTicketTypeList[index - 1].typename;
      this.recordIdDiff = this.toRecordDiffId
    }
  }

  getfromcatagoryproperty(index, flag) {
    //console.log(index,flag)
    if (flag === 'from') {
      this.fromcatdiffname = index.typename;
    } else {
      this.tocatdiffname = index.typename;
    }
  }

  onFileComplete(data: any) {
    //console.log('file data==========' + JSON.stringify(data));
    // this.logoName = data.changedName;
    if (data.success) {

      this.hideAttachment = false;
      this.attachment.push({originalName: data.details.originalfile, fileName: data.details.filename});
      // console.log(JSON.stringify(this.attachment));
      if (this.attachment.length > 1) {
        this.attachMsg = this.attachment.length + ' files uploaded successfully';
      } else {
        this.attachMsg = this.attachment.length + ' file uploaded successfully';
      }
      this.pathName = data.details.path;
      this.oriName = data.details.originalfile;
      this.chgName = data.details.filename;
    }
  }

  onFileError(msg: string) {
    this.notifier.notify('error', msg);
  }

  onUpload(data: any) {
    this.dataLoaded = data.loader;
  }

  onRemove() {
    this.attachFile = this.attachFile - 1;
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
    this.rest.gettaskmap(data).subscribe((res) => {
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
            if (Number(this.recordTypeStatus[i].id) === Number(this.totickettypedifftypeid)) {
              this.toRecordDiffTypeSeqno = this.recordTypeStatus[i].seqno;
              this.getPropertyValue(Number(this.toRecordDiffTypeSeqno), 'to', type);
            }
            if (Number(this.recordTypeStatus[i].id) === Number(this.fromtickettypedifftypeidcat)) {
              this.fromRecordDiffTypeCatg = this.recordTypeStatus[i].seqno;
              const data = {
                clientid: this.clientId,
                mstorgnhirarchyid: Number(this.organizationId),
                seqno: Number(this.fromRecordDiffTypeCatg),
              };
              this.getlebelcatg(data, 'from',Number(this.fromRecordDiffTypeCatg),'u');
            }
            if (Number(this.recordTypeStatus[i].id) === Number(this.totickettypedifftypeidcat)) {
              this.toRecordDiffTypeCatg = this.recordTypeStatus[i].seqno;
              const data = {
                clientid: this.clientId,
                mstorgnhirarchyid: Number(this.organizationId),
                seqno: Number(this.toRecordDiffTypeCatg),
              };
              this.getlebelcatg(data, 'to',Number(this.toRecordDiffTypeCatg),'u');
            }
          }
          //console.log(this.fromRecordDiffTypeSeqno + '================' + this.toRecordDiffTypeSeqno);
        }
      }
    });
  }


  resetValues() {
    // this.recordTypeStatus = [];
    this.formTicketTypeList = [];
    this.organizationId = '';
    this.fromRecordDiffId = '';
    this.toRecordDiffId = '';
    this.fromRecordDiffTypeSeqno = '';
    this.toRecordDiffTypeSeqno = '';
    this.fromValue = '';
    this.toValue = '';
    this.fromPropLevels = [];
    this.toPropLevels = [];
    this.tolevelid = 0;
    this.fromlevelid = 0;
    this.fromRecordDiffTypeCatg = '';
    this.fromlevelcatgid = 0;
    this.fromRecordDiffCatg = [];
    this.fromPropLevelsCat = [];
    this.formTicketTypeListCatg = [];
    this.toRecordDiffTypeCatg = '';
    this.tolevelcatgid = 0;
    this.toRecordDiffCatg = [];
    this.toPropLevelsCat = [];
    this.toTicketTypeListCatg = [];
    this.ticketTitle = '';
    this.describe = '';
  }

  save() {
    if (this.fromRecordDiffId === this.toRecordDiffId) {
      this.notifier.notify('error', this.messageService.SAME_TICKET_TYPE_ERROR);
      return false;
    } else {
      this.isError = false;
    }


    if (this.fromRecordDiffTypeSeqno === this.fromRecordDiffTypeCatg) {
      this.notifier.notify('error', this.messageService.SAME_PROPERTY_TYPE_ERROR);
      return false;
    } else {
      this.isError = false;
    }

    if (this.toRecordDiffTypeSeqno === this.toRecordDiffTypeCatg) {
      this.notifier.notify('error', this.messageService.SAME_PROPERTY_TYPE_ERROR);
      return false;
    } else {
      this.isError = false;
    }

    if(this.fromRecordDiffCatg.length===0){
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
      //console.log(this.termNameSelected);
    }

    else{
      const data = {
        clientid: this.clientId,
        mstorgnhirarchyid: Number(this.organizationId),
        fromrecorddiffids: this.fromRecordDiffCatg,
        torecorddiffid: Number(this.toRecordDiffCatg),
      };
      if (this.fromPropLevelsCat.length === 0) {
        data['fromrecorddifftypeid'] = Number(this.fromRecordDiffTypeCatg);
      } else {
        data['fromrecorddifftypeid'] = Number(this.fromlevelcatgid);
      }
      if (this.toPropLevelsCat.length === 0) {
        data['torecorddifftypeid'] = Number(this.toRecordDiffTypeCatg);
      } else {
        data['torecorddifftypeid'] = Number(this.tolevelcatgid);
      }
      //console.log(JSON.stringify(data));
      if (!this.messageService.isBlankField(data)) {
        data['title'] = this.ticketTitle;
        data['description'] = this.describe;
        this.rest.addtaskmap(data).subscribe((res) => {
          this.respObject = res;
          if (this.respObject.success) {
            const id = this.respObject.details;
            // this.messageService.setRow({
            //   id: id,
            //   mstorgnhirarchyname: this.mstorgnhirarchyname,
            //   mstorgnhirarchyid: this.organizationId,
            //   fromrecorddiffid: Number(this.fromRecordDiffCatg),
            //   fromrecorddiffname: this.fromcatdiffname,
            //   torecorddiffid: this.toRecordDiffCatg,
            //   torecorddiffname: this.tocatdiffname,
            //   fromrecorddifftypeid: this.fromlevelcatgid,
            //   fromrecorddifftypename: this.fromcatlabelname,
            //   torecorddifftypeid: this.tolevelcatgid,
            //   torecorddifftypename: this.tocatlabelname,
            //   title: this.ticketTitle,
            //   description: this.describe
            // });
            this.totalData = this.totalData + 1;
            this.messageService.setTotalData(this.totalData);
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
  }

  update() {

  }

  getrecordbydifftype(index, flag) {
    if (index !== 0) {
      let seqNumber = '';
      if (flag === 'from') {
        this.fromtickettypedifftypeid = this.recordTypeStatus[index - 1].id;
        this.ticketId = this.fromtickettypedifftypeid;
        this.fromtickettypedifftypename= this.recordTypeStatus[index - 1].typename;
        seqNumber = this.fromRecordDiffTypeSeqno;
        this.fromPropLevels = [];
        this.fromlevelid = 0;
        this.formTicketTypeList = [];
      } else {
        this.totickettypedifftypeid = this.recordTypeStatus[index - 1].id;
        this.ticketId = this.totickettypedifftypeid;
        this.totickettypedifftypename=this.recordTypeStatus[index - 1].typename;
        seqNumber = this.toRecordDiffTypeSeqno;
        this.toPropLevels = [];
        this.tolevelid = 0;
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


  getrecordbydifftypecatg(index, flag) {
    if (index !== 0) {
      let seqNumber = '';
      if (flag === 'from') {
        this.fromtickettypedifftypeidcat = this.recordTypeStatus[index - 1].id;
        this.fromcatdifftypename=this.recordTypeStatus[index - 1].typename;
        // this.isfromtext = this.recordTypeStatus[index - 1].istextfield;
        seqNumber = this.fromRecordDiffTypeCatg;
        this.fromPropLevelsCat = [];
        this.fromlevelcatgid = 0;
        this.formTicketTypeListCatg = [];
      } else {
        this.totickettypedifftypeidcat = this.recordTypeStatus[index - 1].id;
        this.tocatdifftypename = this.recordTypeStatus[index - 1].typename;
        // this.istotext = this.recordTypeStatus[index - 1].istextfield;
        seqNumber = this.toRecordDiffTypeCatg;
        this.toPropLevelsCat = [];
        this.tolevelcatgid= 0;
        this.toTicketTypeListCatg = [];
      }
      const data = {
        clientid: this.clientId,
        mstorgnhirarchyid: Number(this.organizationId),
        fromrecorddifftypeid: Number(this.ticketId),
        fromrecorddiffid: Number(this.recordIdDiff),
        seqno: Number(seqNumber),
      };


      this.getlebelcatg(data, flag, seqNumber, 'i');
      //this.newgetlebelcatg(data1, flag, seqNumber, 'i');
    }
  }


  getlebelcatg(data, flag, seqNumber, type) {
    let catSeq;
    // console.log(data);
    this.rest.getlabelbydiffseq(data).subscribe((res: any) => {
      if (res.success) {
        if (res.details.length > 0) {
          res.details.unshift({id: 0, typename: 'Select Property Level'});
          if (flag === 'from') {
            this.fromPropLevelsCat = res.details;
            if(type==='u'){
              for(let i=0;i<this.fromPropLevelsCat.length;i++)
              {
                if (Number(this.fromPropLevelsCat[i].id) === Number(this.fromlevelcatgid)) {
                  catSeq = Number(this.fromPropLevelsCat[i].seqno);

                }
              }
            }
            // this.fromlevelcatgid = 0;
          } else {
            this.toPropLevelsCat = res.details;
            if(type==='u'){
              for(let i=0;i<this.toPropLevelsCat.length;i++)
              {
                if (Number(this.toPropLevelsCat[i].id) === Number(this.tolevelcatgid)) {
                  catSeq = Number(this.toPropLevelsCat[i].seqno);

                }
              }
            }
            // this.tolevelcatgid = 0;
          }

          if(type==='u'){
            this.formTicketTypeListCatg=[];
            this.toTicketTypeListCatg=[];
            this.getCatgPropertyValue(catSeq, flag, type);
          }
        } else {
          if (flag === 'from') {
            this.fromPropLevelsCat = [];
          } else {
            this.toPropLevelsCat = [];
          }
          this.formTicketTypeListCatg=[];
          this.toTicketTypeListCatg=[];
          this.getCatgPropertyValue(Number(seqNumber), flag, type);
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
            //this.recordIdDiff = this.fromRecordDiffId
          } else {
            this.fromRecordDiffId = this.fromRecDiffId;
          }
        } else {
          this.toTicketTypeList = res.details;
          if (type === 'i') {
            this.toRecordDiffId = '';
            //this.recordIdDiff = this.toRecordDiffId
          } else {
            this.toRecordDiffId = this.toRecDiffId;
          }
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }


  getCatgPropertyValue(seqNumber, flag, type) {
    //console.log('============',flag,);
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      fromrecorddifftypeid: Number(this.ticketId),
      fromrecorddiffid: Number(this.recordIdDiff),
      seqno: seqNumber
    };
    this.rest.getmappeddiffbyseq(data).subscribe((res: any) => {
      if (res.success) {
        if (flag === 'from') {
          this.formTicketTypeListCatg = res.details;
          this.selectAll(this.formTicketTypeListCatg)
          for(let i=0;i< this.formTicketTypeListCatg.length;i++){
            //console.log( this.formTicketTypeListCatg[i].parentpath)
            if( this.formTicketTypeListCatg[i].parentpath!=''){
              //console.log("IFFFFFFFFFF")
              // this.respObject.details.unshift({id: 0, typename: 'Property Value'})
              this.formTicketTypeListCatg[i].typename = this.formTicketTypeListCatg[i].typename.concat("(" + this.formTicketTypeListCatg[i].parentpath + ")")
              //console.log(this.formTicketTypeListCatg[i].typename)
            }
            else{
              // this.respObject.details.unshift({id: 0, typename: 'Property Value'})
              this.formTicketTypeListCatg[i].typename = this.formTicketTypeListCatg[i].typename
            }
          }
          if (type === 'i') {
            this.fromRecordDiffCatg = [];
          } else {
            //this.fromRecordDiffCatg = this.fromCatgRecDiffId;
          }
        } else {
          this.toTicketTypeListCatg = res.details;
          for(let i=0;i< this.toTicketTypeListCatg.length;i++){
            //console.log( this.toTicketTypeListCatg[i].parentpath)
            if( this.toTicketTypeListCatg[i].parentpath!=''){
              //console.log("IFFFFFFFFFF")
              // this.respObject.details.unshift({id: 0, typename: 'Property Value'})
              this.toTicketTypeListCatg[i].typename = this.toTicketTypeListCatg[i].typename.concat("(" + this.toTicketTypeListCatg[i].parentpath + ")")
              //console.log(this.toTicketTypeListCatg[i].typename)
            }
            else{
              // this.respObject.details.unshift({id: 0, typename: 'Property Value'})
              this.toTicketTypeListCatg[i].typename = this.toTicketTypeListCatg[i].typename
            }
          }
          if (type === 'i') {
            this.toRecordDiffCatg = [];
          } else {
            //this.toRecordDiffCatg = this.toCatgRecDiffId;
          }
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

  onLevelChange(selectedIndex: any, flag: string) {
    let seq;
    if (flag === 'to') {
      seq = this.toPropLevels[selectedIndex].seqno;

    } else {
      seq = this.fromPropLevels[selectedIndex].seqno;
    }
    this.getPropertyValue(seq, flag, 'i');
  }

  onLevelChangeCatg(selectedIndex: any, type: string) {
    let seq;
    if (type === 'to') {
      seq = this.toPropLevelsCat[selectedIndex].seqno;
      this.tocatlabelname=this.toPropLevelsCat[selectedIndex].typename;
    } else {
      seq = this.fromPropLevelsCat[selectedIndex].seqno;
      this.fromcatlabelname=this.fromPropLevelsCat[selectedIndex].typename;
    }
    this.getCatgPropertyValue(seq, type, 'i');
  }
}
