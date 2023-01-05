import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {RestApiService} from '../rest-api.service';
import {Filters, Formatters, OnEventArgs} from 'angular-slickgrid';
import {MessageService} from '../message.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-ldap-config',
  templateUrl: './ldap-config.component.html',
  styleUrls: ['./ldap-config.component.css']
})
export class LDAPConfigComponent implements OnInit {
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
  orgSelected: number;
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
  //@ViewChild('content') private content;
  @ViewChild('content') private content;
  private modalReference: NgbModalRef;
  isEdit: boolean;
  colordata: any;

  servername: any;
  serverurl: any;
  binddn: any;
  basedn: any;
  password: any;
  filterdn: any;
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

  constructor(private rest: RestApiService, private messageService: MessageService,
              private route: Router, private modalService: NgbModal, private notifier: NotifierService) {

    this.messageService.getCellChangeData().subscribe(item => {
      // console.log(item);
      // this.notifier = notifier;
      switch (item.type) {
        case 'delete':
          // console.log('deleted');
          if (!this.del) {
            this.notifier.notify('error', this.messageService.DELETE_PERMISSION);
          } else {
            if (confirm('Are you sure?')) {
              this.rest.deletemstldap({id: item.id}).subscribe((res) => {
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

  }

  ngOnInit(): void {
    this.colordata = this.messageService.colors;
    //console.log("COLOR",this.colordata);
    this.fileUploadUrl = this.rest.apiRoot + '/fileupload';
    this.hideAttachment = true;
    this.dataLoaded = true;
    this.pageSize = this.messageService.pageSize;
    this.displayData = {
      pageName: 'LDAP Config',
      openModalButton: 'Add LDAP Configuration',
      breadcrumb: 'LDAP Configuration',
      folderName: 'LDAP Configuration',
      tabName: 'LDAP Configuration',
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
          this.reset();
          console.log('\n ARGS DATA CONTEXT  :: ' + JSON.stringify(args.dataContext));
          this.selectedId = args.dataContext.id;
          this.clientSelected = args.dataContext.clientid;
          this.orgName = args.dataContext.mstorgnhirarchyname;
          this.orgSelected1 = args.dataContext.mstorgnhirarchyid;
          this.servername = args.dataContext.servername;
          this.serverurl = args.dataContext.serverurl;
          this.binddn = args.dataContext.binddn;
          this.basedn = args.dataContext.basedn;
          this.password = args.dataContext.password;
          this.filterdn = args.dataContext.filterdn;
          this.oriName = args.dataContext.ori_certificate;
          this.chgName = args.dataContext.chn_certificate;
          this.getOrganization('u', this.clientId, this.orgnId);
          this.formData = {
            'clientid': this.clientSelected,
            'mstorgnhirarchyid': this.orgSelected1,
            // 'type': 'type'
            // 'user_id': this.messageService.getUserId()
          };
          this.isEdit = true;
          this.modalReference = this.modalService.open(this.content, {});
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },
      {
        id: 'organization', name: 'Organization ', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'servername', name: 'Server Name', field: 'servername', sortable: true, filterable: true
      },
      {
        id: 'serverurl', name: 'Server URL', field: 'serverurl', sortable: true, filterable: true
      },
      {
        id: 'binddn', name: 'Bind DN', field: 'binddn', sortable: true, filterable: true
      },
      {
        id: 'basedn', name: 'Base DN', field: 'basedn', sortable: true, filterable: true
      },
      {
        id: 'password', name: 'Password', field: 'password', sortable: true, filterable: true
      },
      {
        id: 'filterdn', name: 'Filter DN', field: 'filterdn', sortable: true, filterable: true
      },
      {
        id: 'ori_certificate', name: 'Original File Name', field: 'ori_certificate', sortable: true, filterable: true
      },
      {
        id: 'chn_certificate', name: 'Change File Name', field: 'chn_certificate', sortable: true, filterable: true
      },
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
        this.onPageLoad();
      });
    }
  }

  onPageLoad() {
  }

  openModal(content) {
    this.reset();
    this.getOrganization('i', this.clientId, this.orgnId);
    this.isEdit = false;
    this.modalService.open(content).result.then((result) => {
    }, (reason) => {

    });
  }

  reset() {
    this.orgSelected = 0;
    this.servername = '';
    this.serverurl = '';
    this.basedn = '';
    this.binddn = '';
    this.password = '';
    this.filterdn = '';
    this.hideAttachment = true;
    this.attachment = [];
    this.pathName = '';
  }

  onOrgChange(index) {
    this.orgName = this.organization[index].organizationname;
    this.formData = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.orgSelected,
      // 'type': 'type'
      // 'user_id': this.messageService.getUserId()
    };
  }


  getOrganization(type, clientId, orgId) {
    const data = {
      clientid: Number(clientId) , 
      mstorgnhirarchyid: Number(orgId)
    };
    this.rest.getorganizationclientwisenew(data).subscribe((res) => {
      this.respObject = res;
      this.organization = this.respObject.details;
      if (this.respObject.success) {
        if (type === 'i') {
          this.respObject.details.unshift({id: 0, organizationname: 'Select Organization'});
          this.orgSelected = 0;
        } else {
          this.orgSelected = this.orgSelected1;
        }
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      // this.isError = true;
      // this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  save() {
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgSelected),
      servername: this.servername,
      serverurl: this.serverurl,
      binddn: this.binddn,
      basedn: this.basedn,
      password: this.password,
      filterdn: this.filterdn,
      ori_certificate: this.oriName,
      chn_certificate: this.chgName
    };

    // console.log('DATA', JSON.stringify(data));
    if (!this.messageService.isBlankField(data)) {

      this.rest.addmstldap(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          const id = this.respObject.details;
          this.messageService.setRow({
            id: id,
            clientid: Number(this.clientId),
            mstorgnhirarchyid: Number(this.orgSelected),
            mstorgnhirarchyname: this.orgName,
            servername: this.servername,
            serverurl: this.serverurl,
            binddn: this.binddn,
            basedn: this.basedn,
            password: this.password,
            filterdn: this.filterdn,
            ori_certificate: this.oriName,
            chn_certificate: this.chgName
          });
          //this.getTableData();
          this.reset();
          this.totalData = this.totalData + 1;
          this.messageService.setTotalData(this.totalData);
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
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgSelected),
      servername: this.servername,
      serverurl: this.serverurl,
      binddn: this.binddn,
      basedn: this.basedn,
      password: this.password,
      filterdn: this.filterdn,
      ori_certificate: this.oriName,
      chn_certificate: this.chgName
    };
    //console.log(data)
    if (!this.messageService.isBlankField(data)) {

      this.rest.updatemstldap(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          this.modalReference.close();
          this.messageService.sendAfterDelete(this.selectedId);
          this.dataLoaded = true;
          this.messageService.setRow({
            id: this.selectedId,
            clientid: Number(this.clientId),
            mstorgnhirarchyid: Number(this.orgSelected),
            mstorgnhirarchyname: this.orgName,
            servername: this.servername,
            serverurl: this.serverurl,
            binddn: this.binddn,
            basedn: this.basedn,
            password: this.password,
            filterdn: this.filterdn,
            ori_certificate: this.oriName,
            chn_certificate: this.chgName
          });
          //this.getTableData();
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

  onFileComplete(data: any) {
    console.log('file data==========' + JSON.stringify(data));
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


      // if (this.isEdit) {
      //   const data1 = {
      //     'id': this.selectedId,
      //     'ori_certificate': this.oriName,
      //     'chn_certificate': this.chgName
      //   };
      //   if (!this.messageService.isBlankField(data1)) {
      //     this.rest.updatemstldapcertificate(data1).subscribe((res) => {
      //       this.respObject = res;
      //       if (this.respObject.success) {
      //         this.modalReference.close();
      //         this.messageService.sendAfterDelete(this.selectedId);
      //         this.dataLoaded = true;
      //         this.messageService.setRow({
      //           id: this.selectedId,
      //           clientid: Number(this.clientId),
      //           mstorgnhirarchyid: Number(this.orgSelected),
      //           mstorgnhirarchyname: this.orgName,
      //           servername: this.servername,
      //           serverurl: this.serverurl,
      //           binddn: this.binddn,
      //           basedn: this.basedn,
      //           password: this.password,
      //           filterdn: this.filterdn,
      //           ori_certificate: this.oriName,
      //           chn_certificate: this.chgName
      //         });
      //         this.notifier.notify('success', this.messageService.EDIT_SUCCESS);
      //       } else {
      //         this.notifier.notify('error', this.respObject.message);
      //       }
      //     }, (err) => {
      //       this.notifier.notify('error', this.messageService.SERVER_ERROR);
      //     });
      //   } else {
      //     this.isError = true;
      //     this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
      //   }
      // }
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
    this.dataLoaded = true;
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgnId),
        offset: offset,
      limit: limit
    };
    this.rest.getallmstldap(data).subscribe((res) => {
      this.respObject = res;
      //console.log(JSON.stringify(res));
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
    if (this.userAuth) {
      this.userAuth.unsubscribe();
    }
  }

}
