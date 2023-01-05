import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RestApiService } from '../rest-api.service';
import { MessageService } from '../message.service';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Formatters, OnEventArgs } from 'angular-slickgrid';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-email-ticket',
  templateUrl: './email-ticket.component.html',
  styleUrls: ['./email-ticket.component.css']
})
export class EmailTicketComponent implements OnInit {
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
  toCatgRecDiffId: string
  toRecDiffId: string;
  updateFlag: boolean;

  fromRecordDiffTypeCatg: any;
  fromRecordDiffTypeCatg1: any;
  fromlevelcatgid: any;
  fromRecordDiffCatg: any;
  fromPropLevelsCat = [];
  formTicketTypeListCatg = [];
  fromtickettypediffname: string;
  fromtickettypedifftypename: string;
  fromcatlabelname: string;
  fromcatdifftypename: string;
  totickettypedifftypename: string;
  tocatdifftypename: string
  tocatlabelname: string;
  totickettypediffname: string;
  fromcatdiffname: string;
  toRecordDiffTypeCatg: any;
  tolevelcatgid: number;
  toRecordDiffCatg: any;
  toPropLevelsCat = [];
  toTicketTypeListCatg = [];
  totickettypedifftypeid = '';
  tocatdiffnam: string;
  fromtickettypedifftypeidcat: any;
  totickettypedifftypeidcat: any;
  fromRecordDiffTypeSeqno1: any
  mstorgnhirarchyname: string
  emailType: any;
  userSelect: any;
  senderEmail = '';
  senderDomain = '';
  subjectKey = '';
  separaterSelect = '';
  separaterSelect1 = ''
  separaterSelectList = []
  userType: any;
  subjectLiner: boolean;
  userList = [];
  userName: string;
  userGroupid: any;
  separaterList = [];
  delimeter: any;
  catPathName: any;
  catParentName: any;
  PathName: string;
  PathName1: any;
  fromRecordDiffTypeCatgSeq: any;
  isEdit: boolean;
  catSeq: any
  seqNumber: any
  emailErr = ""

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
              this.rest.deleteemailticketconfiguration({ id: item.id }).subscribe((res) => {
                this.respObject = res;
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
    // this.separaterSelect = 0;
    this.emailType = 1;
    this.userType = 3;
    this.totalPage = 0;
    //this.userSelect = 0;
    this.subjectLiner = false;
    this.dataLoaded = true;
    this.errorMessage = '';

    this.pageSize = this.messageService.pageSize;
    this.displayData = {
      pageName: 'Maintain Email Tickets',
      openModalButton: 'Email Tickets',
      breadcrumb: 'Email Tickets',
      folderName: 'Email Tickets',
      tabName: 'Email Tickets'
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
          this.recordTypeStatus = []
          this.resetValues();
          // this.subjectLiner = false;
          // console.log("\n ARGS DATA CONTEXT  :: "+JSON.stringify(args.dataContext));
          //this.mstorgnhirarchyname = args.dataContext.mstorgnhirarchyname;
          this.fromtickettypediffname = args.dataContext.tickettypename;
          this.separaterSelect1 = args.dataContext.delimiter;
          this.senderEmail = args.dataContext.senderemail;
          this.senderDomain = args.dataContext.senderdomain;
          const subLiner = args.dataContext.defaultseq
          this.subjectLiner = Number(subLiner) === 1 ? true : false;
          this.emailType = args.dataContext.sendertypeseq;
          this.subjectKey = args.dataContext.emailsubkeyword;


          this.selectedId = args.dataContext.id;
          this.organizationId = args.dataContext.mstorgnhirarchyid;
          this.fromRecordDiffTypeSeqno = args.dataContext.mstrecorddifftypeid;
          this.fromRecDiffId = args.dataContext.mstrecorddiffid;
          this.fromRecordDiffTypeCatg = args.dataContext.categorydifftypeid;
          this.fromlevelcatgid = args.dataContext.categorylevelid,
            this.fromCatgRecDiffId = args.dataContext.lastcategoryid;
          this.userSelect = args.dataContext.serviceuserid;
          this.userGroupid = args.dataContext.serviceusergroupid
          this.PathName1 = args.dataContext.categoryidlist;
          this.catParentName = args.dataContext.categorynamelist;
          this.fromcatdifftypename = args.dataContext.lastcategoryname;
          this.catParentName = args.dataContext.categorynamelist;
          this.fromcatdiffname = args.dataContext.categorywithpath;

          this.isEdit = true;
          this.getRecordDiffType('u');
          this.getUser('u', this.organizationId);
          this.gtCategoryidlist('u');
          this.getSeparater(this.organizationId, 'u');
          this.onsubjectClick();
          this.modalReference = this.modalService.open(this.content, {});
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },
      {
        id: 'orgname', name: 'Organization', field: 'orgname', sortable: true, filterable: true
      },
      {
        id: 'tickettypename', name: 'Property Type ', field: 'tickettypename', sortable: true, filterable: true
      },
      // {
      //   id: 'fromtickettypediffname', name: 'Property ', field: 'fromtickettypediffname', sortable: true, filterable: true
      // },
      // {
      //   id: 'fromcatdifftypename', name: 'Property Category Type ', field: 'fromcatdifftypename', sortable: true, filterable: true
      // },
      // {
      //   id: 'fromcatlabelname', name: 'Property Category Lavel ', field: 'fromcatlabelname', sortable: true, filterable: true
      // },
      {
        id: 'categorywithpath', name: 'Category With Path', field: 'categorywithpath', sortable: true, filterable: true
      },
      {
        id: 'serviceusername', name: 'Service User Name', field: 'serviceusername', sortable: true, filterable: true
      },
      {
        id: 'senderemail', name: 'Sender Email', field: 'senderemail', sortable: true, filterable: true
      },
      {
        id: 'senderdomain', name: 'Sender Domain', field: 'senderdomain', sortable: true, filterable: true
      },
      {
        id: 'emailsubkeyword', name: 'Email Subject Keyword', field: 'emailsubkeyword', sortable: true, filterable: true
      },
      // {
      //   id: 'delimiter', name: 'Delimiter', field: 'delimiter', sortable: true, filterable: true
      // },
      {
        id: 'createdByname', name: 'Created By Name', field: 'createdByname', sortable: true, filterable: true
      },
      {
        id: 'sendertype', name: 'Sender Type', field: 'sendertype', sortable: true, filterable: true
      },
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
    this.errorMessage = '';
    this.isError = false;
    this.updateFlag = false;
    this.isEdit = false;
    this.onsubjectClick();
    this.getRecordDiffType('i');
    this.resetValues();
    //console.log("MMM",this.subjectLiner);
    // this.notifier.notify('success', 'Module added successfully');
    this.modalService.open(content, { size: 'md' }).result.then((result) => {
    }, (reason) => {

    });
  }

  onOrgChange(index) {
    this.mstorgnhirarchyname = this.organizationList[index - 1].organizationname;
    this.getUser('i', this.organizationId);
    this.getSeparater(this.organizationId, 'i');
  }
  getfromticketproperty(index) {
    this.fromtickettypediffname = this.formTicketTypeList[index - 1].typename;

  }
  getfromcatagoryproperty(index) {
    this.fromcatdiffname = this.formTicketTypeListCatg[index - 1].categorywithpath;
    this.fromcatdifftypename = this.formTicketTypeListCatg[index - 1].name;
    this.catPathName = this.formTicketTypeListCatg[index - 1].parentcategoryids;
    this.catParentName = this.formTicketTypeListCatg[index - 1].parentcategorynames;
    this.gtCategoryidlist('i')
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
    this.rest.getemailticketconfigurations(data).subscribe((res) => {
      this.respObject = res;
      // console.log(JSON.stringify("DATTATA",this.respObject.details));
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

  getRecordDiffType(type) {
    this.rest.getRecordDiffType().subscribe((res: any) => {
      if (res.success) {
        this.recordTypeStatus = res.details;
        if (type === 'u') {
          for (let i = 0; i < this.recordTypeStatus.length; i++) {
            if (Number(this.recordTypeStatus[i].id) === Number(this.fromRecordDiffTypeSeqno)) {
              this.fromRecordDiffTypeSeqno1 = this.recordTypeStatus[i].seqno;
              this.getPropertyValue(Number(this.fromRecordDiffTypeSeqno1), type);
            }

            if (Number(this.recordTypeStatus[i].id) === Number(this.fromRecordDiffTypeCatg)) {
              this.fromRecordDiffTypeCatg1 = this.recordTypeStatus[i].seqno;
              const data = {
                clientid: this.clientId,
                mstorgnhirarchyid: Number(this.organizationId),
                seqno: Number(this.fromRecordDiffTypeCatg1),
              };
              this.getlebelcatg(data, Number(this.fromRecordDiffTypeCatg1), type);
            }
          }
        }
      }
    });
  }

  gtCategoryidlist(type) {
    if (type === 'i') {
      this.PathName = this.catPathName.concat('->', this.fromRecordDiffCatg)
    }
    else {
      this.PathName = this.PathName1;
    }
  }

  onRadioButtonChange(selectedValue) {
    // console.log(selectedValue.value)
    if (selectedValue.value === 2) {
      this.subjectLiner = true
      this.onsubjectClick()
    }
    if (selectedValue.value === 1) {
      this.subjectLiner = false
      // this.onsubjectClick()
    }

  }



  resetValues() {
    this.userList = [];
    this.organizationId = '';
    this.fromRecordDiffId = '';
    this.fromRecordDiffTypeSeqno = '';
    this.fromValue = '';
    this.fromPropLevels = [];
    this.fromlevelid = 0;
    this.fromRecordDiffTypeCatg = '';
    this.fromlevelcatgid = 0;
    this.fromRecordDiffCatg = '';
    this.fromPropLevelsCat = [];
    this.formTicketTypeList = [];
    this.formTicketTypeListCatg = [];
    this.emailType = 1;
    this.subjectLiner = false;
    this.senderEmail = '';
    this.senderDomain = ''
    this.subjectKey = '';
    this.separaterSelect = '';
    this.separaterSelectList = []
    this.userName = '';
    this.userSelect = 0;
    this.userGroupid = 0;
    this.emailErr = ''
  }

  save() {
    if (this.fromRecordDiffTypeSeqno === this.fromRecordDiffTypeCatg) {
      this.notifier.notify('error', this.messageService.SAME_PROPERTY_TYPE_ERROR);
      return false;
    } else {
      this.isError = false;
    }

    if (this.emailErr !== '' && this.emailType == 1) {
      this.notifier.notify('error',"Invalid Email");
      return false;
    }
    else {
      this.isError = false;
    }

    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      mstrecorddifftypeid: Number(this.fromRecordDiffTypeSeqno),
      mstrecorddiffid: Number(this.fromRecordDiffId),
      serviceuserid: Number(this.userSelect),
      serviceusergroupid: Number(this.userGroupid),
      sendertypeseq: Number(this.emailType),
      createdbyid: this.loginUserOrganizationId,
      categorydifftypeid: Number(this.fromRecordDiffTypeCatg),
      categorylevelid: Number(this.fromlevelcatgid),
      lastcategoryid: Number(this.fromRecordDiffCatg),
      lastcategoryname: this.fromcatdifftypename,
      categoryidlist: this.PathName, //this.fontsize.concat('px')
      categorynamelist: this.catParentName,
      categorywithpath: this.fromcatdiffname
    };
    if (!this.messageService.isBlankField(data)) {
      data['senderemail'] = this.senderEmail;
      data['senderdomain'] = this.senderDomain;
      data['defaultseq'] = this.subjectLiner == true ? 1 : 0;
      data['emailsubkeyword'] = this.subjectKey;
      data['delimiter'] = this.separaterSelect;

      this.rest.saveemailticketconfiguration(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          const id = this.respObject.details;
          // this.messageService.setRow({
          //   id: id,
          //   clientid: Number(this.clientId),
          //   mstorgnhirarchyname: this.mstorgnhirarchyname,
          //   mstorgnhirarchyid:Number(this.organizationId),
          //   fromtickettypedifftypeid:this.fromRecordDiffTypeSeqno,
          //   fromtickettypedifftypename: this.fromtickettypedifftypename,
          //   fromtickettypediffname: this.fromtickettypediffname,
          //   fromcatdifftypename: this.fromcatdifftypename,
          //   fromcatlabelname: this.fromcatlabelname,
          //   fromcatdiffname: this.fromcatdiffname,
          //   fromtickettypediffid:this.fromRecordDiffId,
          //   fromcatdifftypeid:this.fromtickettypedifftypeidcat,
          //   fromcatlabelid:this.fromlevelcatgid,
          //   fromcatdiffid:this.fromRecordDiffCatg,
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

  update() {
    if (this.fromRecordDiffTypeSeqno === this.fromRecordDiffTypeCatg) {
      this.notifier.notify('error', this.messageService.SAME_PROPERTY_TYPE_ERROR);
      return false;
    } else {
      this.isError = false;
    }

    if (this.emailErr !== '' && this.emailType == 1) {
      this.notifier.notify('error',"Invalid Email");
      return false;
    }
    else {
      this.isError = false;
    }

    const data = {
      id: this.selectedId,
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      mstrecorddifftypeid: Number(this.fromRecordDiffTypeSeqno),
      mstrecorddiffid: Number(this.fromRecordDiffId),
      serviceuserid: Number(this.userSelect),
      serviceusergroupid: Number(this.userGroupid),
      sendertypeseq: Number(this.emailType),
      createdbyid: this.loginUserOrganizationId,
      categorydifftypeid: Number(this.fromRecordDiffTypeCatg),
      categorylevelid: Number(this.fromlevelcatgid),
      lastcategoryid: Number(this.fromRecordDiffCatg),
      lastcategoryname: this.fromcatdifftypename,
      categoryidlist: this.PathName,
      categorynamelist: this.catParentName,
      categorywithpath: this.fromcatdiffname
    };
    if (!this.messageService.isBlankField(data)) {
      data['senderemail'] = this.senderEmail;
      data['senderdomain'] = this.senderDomain;
      data['defaultseq'] = this.subjectLiner == true ? 1 : 0;
      data['emailsubkeyword'] = this.subjectKey;
      data['delimiter'] = this.separaterSelect;
      this.rest.updateemailticketconfiguration(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.messageService.sendAfterDelete(this.selectedId);
          this.dataLoaded = true;
          // this.messageService.setRow({
          //   id: this.selectedId,
          //   clientid : Number(this.clientId),
          //   mstorgnhirarchyname: this.mstorgnhirarchyname,
          //   mstorgnhirarchyid:Number(this.organizationId),
          //   fromtickettypedifftypeid:this.fromRecordDiffTypeSeqno,
          //   fromtickettypedifftypename: this.fromtickettypedifftypename,
          //   fromtickettypediffname: this.fromtickettypediffname,
          //   fromcatdifftypename: this.fromcatdifftypename,
          //   fromcatlabelname: this.fromcatlabelname,
          //   fromcatdiffname: this.fromcatdiffname,
          //   fromtickettypediffid:this.fromRecordDiffId,
          //   fromcatdifftypeid:this.fromtickettypedifftypeidcat,
          //   fromcatlabelid:this.fromlevelcatgid,
          //   fromcatdiffid:this.fromRecordDiffCatg,
          // });
          this.isError = false;
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

  getrecordbydifftype(index) {
    this.fromtickettypedifftypename = this.recordTypeStatus[index - 1].typename;
    if (index !== 0) {
      this.fromPropLevels = [];
      this.formTicketTypeList = [];
      this.fromRecordDiffId = '';
      const seqNumber = this.recordTypeStatus[index - 1].seqno;

      const data = {
        clientid: this.clientId,
        mstorgnhirarchyid: Number(this.organizationId),
        seqno: Number(seqNumber),
      };

      this.rest.getcategorieslevel(data).subscribe((res: any) => {
        if (res.success) {
          if (res.details.length > 0) {
            res.details.unshift({ id: 0, typename: 'Select Property Level' });
            this.fromPropLevels = res.details;
            // this.fromlevelid = 0;

          } else {

            this.fromPropLevels = [];
            //this.fromlevelid = '';
            this.getPropertyValue(Number(seqNumber), 'i');
          }
        } else {
          // this.isError = true;
          // this.errorMessage = res.message;
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    }
  }


  getrecordbydifftypecatg(index) {
    if (index !== 0) {
      let seqNumber = '';
      this.fromtickettypedifftypeidcat = this.recordTypeStatus[index - 1].id;
      this.fromcatdifftypename = this.recordTypeStatus[index - 1].typename;
      seqNumber = this.fromRecordDiffTypeCatg1;
      this.fromPropLevelsCat = [];
      this.fromlevelcatgid = 0;
      this.formTicketTypeListCatg = [];
      const data = {
        clientid: this.clientId,
        mstorgnhirarchyid: Number(this.organizationId),
        recorddifftypeid: Number(this.fromRecordDiffTypeSeqno),
        recorddiffid: Number(this.fromRecordDiffId)

      };
      this.getlebelcatg(data, seqNumber, 'i');
    }
  }



  getlebelcatg(data, seqNumber, type) {
    //console.log(JSON.stringify(data),seqNumber)
    this.rest.getcategorieslevel(data).subscribe((res: any) => {
      if (res.success) {
        if (res.details.length > 0) {
          res.details.unshift({ id: 0, typename: 'Select Property Level' });
          this.fromPropLevelsCat = res.details;
          if (type === 'u') {
            for (let i = 0; i < this.fromPropLevelsCat.length; i++) {
              if (Number(this.fromPropLevelsCat[i].id) === Number(this.fromlevelcatgid)) {
                this.catSeq = Number(this.fromPropLevelsCat[i].seqno);

              }
            }
          }
          // this.fromlevelcatgid = 0;

          if (type === 'u') {
            this.formTicketTypeListCatg = [];
            this.getCatgPropertyValue(this.catSeq, type);
          }
        } else {
          this.fromPropLevelsCat = [];
          this.formTicketTypeListCatg = [];
          this.getCatgPropertyValue(Number(seqNumber), type);
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });

  }

  getPropertyValue(seqNumber, type) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      seqno: seqNumber
    };
    this.rest.getrecordbydifftype(data).subscribe((res: any) => {
      if (res.success) {
        this.formTicketTypeList = res.details;
        if (type === 'i') {
          this.fromRecordDiffId = '';
        } else {
          this.fromRecordDiffId = this.fromRecDiffId;
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }


  getCatgPropertyValue(seqNumber, type) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      categorylevelid: Number(this.fromlevelcatgid)
    };
    this.rest.getlastcategorylist(data).subscribe((res: any) => {
      if (res.success) {
        this.formTicketTypeListCatg = res.details.values;
        if (type === 'i') {
          this.fromRecordDiffCatg = '';
        } else {
          this.fromRecordDiffCatg = this.fromCatgRecDiffId;
        }

      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }


  getorganizationclientwise() {
    const data = {
      clientid: Number(this.clientId),
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

  onLevelChange(selectedIndex: any) {
    let seq;
    seq = this.fromPropLevels[selectedIndex].seqno;
    this.getPropertyValue(seq, 'i');
  }

  onLevelChangeCatg(selectedIndex: any) {
    let seq;
    seq = this.fromPropLevelsCat[selectedIndex].seqno;
    this.fromcatlabelname = this.fromPropLevelsCat[selectedIndex].typename;
    this.getCatgPropertyValue(seq, 'i');
  }



  onUserChange(index) {
    this.userName = this.userList[index].name;
    this.userGroupid = this.userList[index].serviceusergroupid;
  }

  getUser(type, orgSet) {
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(orgSet),
    }
    this.rest.getserviceuser(data).subscribe((res: any) => {
      this.respObject = res;
      //
      if (this.respObject.success) {
        this.userList = this.respObject.details.values;
        this.respObject.details.values.unshift({ id: 0, name: 'Select User' });
        if (type === 'i') {
          this.userSelect = 0;
        } else {

        }

      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });

  }

  onsubjectClick() {
    // console.log(this.subjectLiner);
    if (this.subjectLiner === true) {
      // for(let i = 0; i < this.separaterSelectList.length;i++)
      this.separaterSelect = this.separaterSelectList[0];
      this.subjectKey = '';
    }
  }

  onKeyUp() {
    var PATTERN = "^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$"
    if (this.senderEmail == '') {
      this.emailErr = "* Enter valid Email"
    }
    else {
      if (this.senderEmail.includes(",")) {
        var serndersEmail = this.senderEmail.split(",")
        for (let i = 0; i < serndersEmail.length; i++) {
          if (!serndersEmail[i].match(PATTERN)) {
            this.emailErr = "* Invalid Email: ".concat(serndersEmail[i])
            return
          }
          else {
            this.emailErr = ""
          }

        }
      }
      else {
        if (!this.senderEmail.match(PATTERN)) {
          this.emailErr = "* Invalid Email: ".concat(this.senderEmail)
        }
        else {
          this.emailErr = ""
        }
      }
    }
  }

  onSeparaterChange(index) {
  }

  getSeparater(orgSet, type) {
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(orgSet),
    }
    this.rest.getdelemiter(data).subscribe((res: any) => {
      this.respObject = res;

      if (this.respObject.success) {
        this.separaterSelectList = this.respObject.delimeter;
        if (type === 'i') {
          this.separaterSelect = this.separaterSelectList[0];
        }
        else if (type === 'u' && this.separaterSelect1 !== '') {
          for (let i = 0; i < this.separaterSelectList.length; i++) {
            if (this.separaterSelectList[i] === this.separaterSelect1) {
              this.separaterSelect = this.separaterSelectList[i];
              break
            }
          }
        }
        else {
          this.separaterSelect = this.separaterSelectList[0];
        }
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }


}
