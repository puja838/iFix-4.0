import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
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
  selector: 'app-email-ticket-config',
  templateUrl: './email-ticket-config.component.html',
  styleUrls: ['./email-ticket-config.component.css']
})
export class EmailTicketConfigComponent implements OnInit {
  displayed = true;
  clientSelected: number;
  dataset: any[];
  totalData: number;
  respObject: any;
  clients = [];
  clientName: string;
  userName: string;
  roleName: string;
  notAdmin = true;
  displayData: any;
  add: boolean;
  del: boolean;
  edit: boolean;
  view: boolean;
  isError = false;
  errorMessage: string;
  pageSize: number;
  private userAuth: Subscription;
  private adminAuth: Subscription;
  private notifier: NotifierService;
  private clientId: number;
  private baseFlag: any;
  offset: number;
  dataLoaded: boolean;
  userId: number;
  isLoading = false;
  organaisation = [];
  orgSelected: number;
  orgName: string;
  orgnId: number;
  loginname: string;
  types = [];
  typeSelected: number;
  hideName: boolean;
  propertyName: string;
  recordVal = [];
  seqNo: number;
  recordName: string;
  recordValSelected: number;
  private typeseqno: number;
  isSLA: boolean;
  clientOrgnId: any;

  emailText: any;
  isUpdate: boolean;
  clientCodes = [];

  configTypeSelected: any;
  delimeterName: any;
  clientCodeSelected: any;
  numberToStartWith: any;
  isCategoryType: boolean;
  isEmail: boolean;
  diffTypeName: any;
  selectedId: number;
  @ViewChild('content') content;
  orgSelected1: number;
  orgnType: number;
  isSpecificDomain = true;
  domainName = '';
  emailName = ''
  isSpecificEmail = true;
  configTypeList = [];
  delimeterHeader = '';
  senderType = '';

  constructor(private rest: RestApiService, private messageService: MessageService, private route: Router,
    private modalService: NgbModal, notifier: NotifierService) {
    this.notifier = notifier;
    this.messageService.getCellChangeData().subscribe(item => {
      switch (item.type) {
        case 'change':
          //console.log('changed');
          if (!this.edit) {
            this.notifier.notify('error', 'You do not have edit permission');
          } else {

          }
          break;
        case 'delete':
          if (item.difftypeid !== 11) {
            if (confirm('Are you sure?')) {
              this.rest.deleteemailbaseconfig({ id: item.id }).subscribe((res) => {
                this.respObject = res;
                if (this.respObject.success) {
                  this.messageService.sendAfterDelete(item.id);
                  this.totalData = this.totalData - 1;
                  this.messageService.setTotalData(this.totalData);
                  this.notifier.notify('success', this.messageService.DELETE_SUCCESS);
                } else {
                  this.notifier.notify('error', this.respObject.errorMessage);
                }
              }, (err) => {
                this.notifier.notify('error', this.respObject.errorMessage);
              });
            }
          } else {
            this.notifier.notify('error', 'You don\'t have delete permission');
          }
      }
    });
    // this.messageService.getUserAuth().subscribe(details => {
    //     // console.log(JSON.stringify(details));
    //     if (details.length > 0) {
    //         this.add = details[0].addFlag;
    //         this.del = details[0].deleteFlag;
    //         this.view = details[0].viewFlag;
    //         this.edit = details[0].editFlag;
    //     }
    // });
  }

  ngOnInit(): void {
    this.isCategoryType = false;
    this.isEmail = false;
    this.configTypeSelected = 'Select Config Type';
    this.isUpdate = false;
    this.hideName = true;
    this.userName = '';
    this.dataLoaded = true;
    this.pageSize = this.messageService.pageSize;
    this.displayData = {
      pageName: 'Email Ticket Config',
      openModalButton: 'Add Email Ticket Config',
      breadcrumb: 'Email Ticket Config',
      folderName: 'All Email Ticket Config',
      tabName: 'Email Ticket Config'
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
      //     //console.log("\n args.dataContext ======  ", JSON.stringify(args.dataContext));
      //     this.reset();
      //     this.selectedId = args.dataContext.id;
      //     this.clientSelected = args.dataContext.clientid;
      //     this.clientName = args.dataContext.clienname;
      //     this.orgSelected1 = args.dataContext.mstorgnhirarchyid;
      //     this.orgName = args.dataContext.mstorgnhirarchyname;
      //     const difftype = args.dataContext.difftypeid;
      //     this.delimeterName = args.dataContext.uid;
      //     // if (difftype === 6) {
      //     //   this.configTypeSelected = 5
      //     // }
      //     // else {
      //     //   this.configTypeSelected = 11
      //     // }
      //     this.diffTypeName = args.dataContext.difftypename;
      //     this.clientCodeSelected = args.dataContext.code;
      //     this.numberToStartWith = args.dataContext.uid;
      //     let selectedIndex;
      //     let match = false;
      //     if (this.clients.length > 0) {
      //       for (let i = 0; i < this.clients.length; i++) {
      //         if (Number(this.clientSelected) === Number(this.clients[i].id)) {
      //           selectedIndex = i;
      //           match = true;
      //         }
      //       }
      //       if (match) {
      //         this.onClientChange(selectedIndex, 'u');
      //       }
      //     }
      //     this.isError = false;
      //     this.isUpdate = true;
      //     this.modalService.open(this.content).result.then((result) => {
      //     }, (reason) => {
      //     });
      //   }
      // },
      {
        id: 'clientname', name: 'Client ', field: 'clientname', sortable: true, filterable: true
      },
      {
        id: 'orgname', name: 'Organization ', field: 'orgname', sortable: true, filterable: true
      },
      {
        id: 'typename', name: 'Differentiation Type ', field: 'typename', sortable: true, filterable: true
      },
      {
        id: 'name', name: 'Differentiation ', field: 'name', sortable: true, filterable: true
      },
      // {
      //   id: 'uid', name: 'UID ', field: 'uid', sortable: true, filterable: true
      // }
    ];
    this.messageService.setColumnDefinitions(columnDefinitions);
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.baseFlag = this.messageService.baseFlag;
      this.orgnId = this.messageService.orgnId;
      this.edit = this.messageService.edit;
      this.del = this.messageService.del;
      // console.log(this.orgnId);
      this.onPageLoad();
    } else {
      this.userAuth = this.messageService.getClientUserAuth().subscribe(auth => {
        // this.view = auth[0].viewFlag;
        // this.add = auth[0].addFlag;
        this.edit = auth[0].editFlag;
        this.del = auth[0].deleteFlag;
        this.clientId = auth[0].clientid;
        this.baseFlag = auth[0].baseFlag;
        this.orgnId = auth[0].mstorgnhirarchyid;
        // console.log(JSON.stringify(auth));
        // console.log(this.orgnId)
        this.onPageLoad();
      });
    }
  }

  onPageLoad() {
    this.getallclientnames();
  }

  getallclientnames() {
    this.rest.getallclientnames().subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({ id: 0, name: 'Select Client' });
        this.clients = this.respObject.details;
        this.clientSelected = 0;
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.isError = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }


  onClientChange(selectedIndex, type) {
    this.clientName = this.clients[selectedIndex].name;
    this.clientOrgnId = this.clients[selectedIndex].orgnid;
    this.getOrganization(this.clientSelected, this.clientOrgnId, type);
  }

  openModal(content) {
    this.isError = false;
    this.isUpdate = false;
    this.reset();
    this.modalService.open(content).result.then((result) => {
    }, (reason) => {
    });
  }

  save() {
    if(this.configTypeSelected === 'Select Config Type'){
      this.isError = true,
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }
    // let senderTypearr
    // if ((this.isSpecificDomain === true) && (this.isSpecificEmail === true)) {
    //   this.domainName = 'From Specific Domain'
    //   this.emailName = 'From Specific Email'
    //   senderTypearr = [this.domainName,this.emailName]

    // } else if (this.isSpecificDomain === true) {
    //   this.domainName = 'From Specific Domain'
    //   senderTypearr = [this.domainName]
    // }

    // if (this.isSpecificEmail === true) {
    //   this.emailName = 'From Specific Email'
    // } else {
    //   this.emailName = ''
    // }
    let dataSend = false;
    let data;
    if (this.configTypeSelected === 'Delimeter') {
      data = {
        clientid: Number(this.clientSelected),
        mstorgnhirarchyid: Number(this.orgSelected),
        mstorgnhirarchytypeid: this.orgnType,
        seqno: 11,
        delimiterheader: this.delimeterHeader,
        delimiterval: this.delimeterName
      }
      dataSend = true;
    } 
    // else if (this.configTypeSelected === 'Sender Type') {
    //   data = {
    //     clientid: this.clientSelected,
    //     mstorgnhirarchyid: this.orgSelected,
    //     mstorgnhirarchytypeid: this.orgnType,
    //     seqno: 11,
    //     sendertypeheader: this.senderType,
    //     sendertypeval: [this.emailName,this.domainName]
    //   }
    //   dataSend = true;
    // }

    if (dataSend) {
      // console.log(JSON.stringify(data))
      if (!this.messageService.isBlankField(data)) {
        this.rest.addemailbaseconfig(data).subscribe((res: any) => {
          if (res.success) {
            const id = res.details;
            // this.messageService.setRow({
            //   id: id,
            //   clientid: Number(this.clientSelected),
            //   clientname: this.clientName,
            //   mstorgnhirarchyid: Number(this.orgSelected),
            //   mstorgnhirarchyname: this.orgName,
            //   difftypeid: Number(this.difftypeSeqSelected),
            //   difftypename: this.diffTypeName,
            //   code: this.clientCodeSelected,
            //   uid: this.numberToStartWith
            // });
            this.reset();
            this.getTableData()
            this.totalData = this.totalData + 1;
            this.messageService.setTotalData(this.totalData);
            this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
          } else {
            this.notifier.notify('error', res.message);
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
    // if(this.isSpecificDomain === true){
    //   this.domainName = 'From Specific Domain'
    // } else{
    //   this.domainName = ''
    // }

    // if(this.isSpecificEmail === true){
    //   this.emailName = 'From Specific Email'
    // } else{
    //   this.emailName = ''
    // }

    // let dataSend = false;
    // let data;
    // if(this.configTypeSelected === 'Delimeter'){
    //   data = {
    //     clientid : this.clientSelected,
    //     mstorgnhirarchyid: this.orgSelected,
    //     mstorgnhirarchytypeid: this.orgnType,
    //     seqno: 11,
    //     delimiterheader: this.delimeterHeader,
    //     delimiterval: this.delimeterName
    //   }
    //   dataSend = true;
    // } else if(this.configTypeSelected === 'Sender Type'){
    //     data = {
    //       clientid : this.clientSelected,
    //       mstorgnhirarchyid: this.orgSelected,
    //       mstorgnhirarchytypeid: this.orgnType,
    //       seqno: 11,
    //       sendertypeheader: this.senderType,
    //       sendertypeval: [this.domainName,this.emailName]
    //     }
    //     dataSend = true;
    // }

    // if (dataSend) {
    //   //console.log(JSON.stringify(data))
    //   if (!this.messageService.isBlankField(data)) {
    //     this.rest.adduidgen(data).subscribe((res: any) => {
    //       if (res.success) {
    //         const id = res.details;
    //         // this.messageService.setRow({
    //         //   id: id,
    //         //   clientid: Number(this.clientSelected),
    //         //   clientname: this.clientName,
    //         //   mstorgnhirarchyid: Number(this.orgSelected),
    //         //   mstorgnhirarchyname: this.orgName,
    //         //   difftypeid: Number(this.difftypeSeqSelected),
    //         //   difftypename: this.diffTypeName,
    //         //   code: this.clientCodeSelected,
    //         //   uid: this.numberToStartWith
    //         // });
    //         this.reset();
    //         this.getTableData()
    //         this.totalData = this.totalData + 1;
    //         this.messageService.setTotalData(this.totalData);
    //         this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
    //       } else {
    //         this.notifier.notify('error', res.message);
    //       }
    //     }, (err) => {
    //       this.notifier.notify('error', this.messageService.SERVER_ERROR);
    //     });
    //   } else {
    //     this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    //   }
    // }
  }

  reset() {
    this.isSLA = true;
    this.clientSelected = 0;
    this.orgSelected = 0;
    this.organaisation = [];
    this.configTypeSelected = 'Select Config Type';
    this.configTypeList = ['Select Config Type', 'Delimeter']
    this.isCategoryType = false;
    this.isEmail = false;
    this.delimeterName = '';
    this.clientCodeSelected = '';
    this.numberToStartWith = '';
    this.diffTypeName = '';
    this.delimeterHeader = '';
    this.senderType = '',
      this.domainName = ''
  }

  onOrgChange(index: any) {
    this.orgName = this.organaisation[index].organizationname;
    this.orgnType = this.organaisation[index].mstorgnhierarchytypeid
  }

  onConfigTypeChange() {
    // this.delimeterHeader = this.configTypeList[index];
    if (this.configTypeSelected === 'Select Config Type') {
      this.delimeterHeader = ''
      this.senderType = ''
    }
    else if (this.configTypeSelected === 'Delimeter') {
      this.delimeterHeader = this.configTypeSelected,
        this.senderType = ''
    }
    else {
      this.delimeterHeader = '',
        this.senderType = this.configTypeSelected;
    }
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
      'offset': offset,
      'limit': limit,
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgnId)
    };
    this.rest.getdelimiterforallclient(data).subscribe((res) => {
      this.respObject = res;
      // console.log("\n this.respObject ==== >>>>>>>    ", this.respObject);
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

  ngOnDestroy(): void {
    if (this.adminAuth) {
      this.adminAuth.unsubscribe();
    }
  }

  getOrganization(clientId, orgId, type) {
    const data = {
      clientid: Number(clientId),
      mstorgnhirarchyid: Number(orgId)
    };
    this.rest.getorganizationwithorgtype(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({ id: 0, organizationname: 'Select Organization' });
        this.organaisation = this.respObject.details;
        if (type === 'i') {
          this.orgSelected = 0;
        } else {
          this.orgSelected = this.orgSelected1;
        }
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.isError = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }


  onClientCodeChange(selectedIndex) {
    //console.log(selectedIndex);
  }

}
