import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {RestApiService} from '../rest-api.service';
import {Filters, Formatters, OnEventArgs} from 'angular-slickgrid';
import {MessageService} from '../message.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-import-data',
  templateUrl: './import-data.component.html',
  styleUrls: ['./import-data.component.css']
})
export class ImportDataComponent implements OnInit {
  displayed = true;
  totalData = 0;
  show: boolean;
  selected: number;
  respObject: any;
  clientSelected= 0;
  displayData: any;
  add = false;
  del = false;
  edit = false;
  view = false;
  isError = false;
  errorMessage: string;
  private notifier: NotifierService;
  baseFlag: boolean;
  collectionSize: number;
  pageSize: number;
  private userAuth: Subscription;
  dataLoaded: boolean;
  isLoading = false;
  organization = [];
  orgSelected: number;
  orgName: string;
  clientId: number;
  orgId: number;
  clientSelectedName: string;
  orgSelectedName: string;
  @ViewChild('content') private content;
  private modalReference: NgbModalRef;
  selectedId: number;
  userClientName: any;
  action: any;
  isEdit: boolean;
  clients = [];
  organizationto = [];
  clientOrgnId:any;
  notAdmin:boolean;
  isUpdate:boolean;
  fileUploadUrl: string;
  uploadButtonName = 'Upload File';
  attachMsg: string;
  attachment = [];
  formdata: any;
  documentPath: any;
  documentName :any;
  orginalDocumentName:any;
  hideAttachment: boolean;
  fileName:boolean;
  private attachFile: number;
  clientName:any;
  shownMessage:boolean;

  constructor(private rest: RestApiService, private messageService: MessageService,
    private route: Router, private modalService: NgbModal, notifier: NotifierService) { 
      this.notifier = notifier;
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
                console.log(JSON.stringify(item));
                // this.rest.deleteorgtoolscode({id: item.id}).subscribe((res) => {
                //   this.respObject = res;
                //   // console.log(JSON.stringify(this.respObject));
                //   if (this.respObject.success) {
                //     this.messageService.sendAfterDelete(item.id);
                //     this.totalData = this.totalData - 1;
                //     this.messageService.setTotalData(this.totalData);
                //     this.notifier.notify('success', this.messageService.DELETE_SUCCESS);
  
                //   } else {
                //     this.notifier.notify('error', this.respObject.message);
                //   }
                // }, (err) => {
                //   this.notifier.notify('error', this.messageService.SERVER_ERROR);
                // });
              }
            }
            break;
        }
      });
    }

    ngOnInit(): void {
      this.dataLoaded = true;
      this.pageSize = this.messageService.pageSize;
      this.userClientName = this.messageService.clientname;
      this.fileName = false;
      this.fileUploadUrl = this.rest.apiRoot + '/fileupload';
      this.hideAttachment = true;
      this.displayData = {
        pageName: 'Import Master Data',
        openModalButton: 'Import Master Data',
        breadcrumb: 'Import Master Data',
        folderName: 'Import Master Data',
        tabName: 'Import Master Data',
      };
      const columnDefinitions = [
        // {
        //   id: 'delete',
        //   field: 'id',
        //   excludeFromHeaderMenu: true,
        //   formatter: Formatters.deleteIcon,
        //   minWidth: 30,
        //   maxWidth: 30,
        // },
        // {
        //   id: 'edit',
        //   field: 'id',
        //   excludeFromHeaderMenu: true,
        //   formatter: Formatters.editIcon,
        //   minWidth: 30,
        //   maxWidth: 30,
        //   onCellClick: (e: Event, args: OnEventArgs) => {
        //     console.log(JSON.stringify(args.dataContext));
        //     this.isError = false;
        //     this.resetValues();
        //     this.selectedId = args.dataContext.id;
        //     //this.clientId = args.dataContext.clientid;
        //     this.clientSelectedName = args.dataContext.clientname;
        //     this.orgName = args.dataContext.mstorgnhirarchyname;
        //     this.orgSelected1 = args.dataContext.mstorghierarchyid;
        //     this.isEdit=true;   
        //     if (this.baseFlag) {
        //       this.clientSelected = args.dataContext.clientid;
  
        //       for(let i = 0;i<this.clients.length;i++){
        //         if(this.clients[i].id === this.clientSelected){
        //           this.orgId = this.clients[i].orgnid
        //         }
        //       }
        //     }
        //     else{
        //       this.clientSelected = this.clientId;
        //     }
        //     this.getOrganization(this.clientSelected,this.orgId,'u');
        //     this.modalReference = this.modalService.open(this.content);
        //     this.modalReference.result.then((result) => {
        //     }, (reason) => {
  
        //     });
        //   }
        // },
        {
          id: 'msttablename', name: 'Table Name', field: 'msttablename', sortable: true, filterable: true
        },
        {
          id: 'tabletypedescription', name: 'Table Describtion', field: 'tabletypedescription', sortable: true, filterable: true
        }
      ];
      this.messageService.setColumnDefinitions(columnDefinitions);
      if (this.messageService.clientId) {
        this.clientId = this.messageService.clientId;
        this.orgId = this.messageService.orgnId;
        this.baseFlag = this.messageService.baseFlag;
        // this.edit = this.messageService.edit;
        // this.del = this.messageService.del;
        if (this.baseFlag) {
          this.edit = true;
          this.del = true;
        } else {
          this.edit = this.messageService.edit;
          this.del = this.messageService.del;
        }
        this.onPageLoad();
      } else {
        this.userAuth = this.messageService.getClientUserAuth().subscribe(auth => {
          // this.view = auth[0].viewFlag;
          // this.add = auth[0].addFlag;
          // this.edit = auth[0].editFlag;
          // this.del = auth[0].deleteFlag;
          if (this.baseFlag) {
            this.edit = true;
            this.del = true;
          } else {
            this.del = auth[0].deleteFlag;
            this.edit = auth[0].editFlag;
          }
          this.clientId = auth[0].clientid;
          this.orgId = auth[0].mstorgnhirarchyid;
          this.baseFlag = auth[0].baseFlag;
          // console.log('auth1===' + JSON.stringify(auth));
          this.onPageLoad();
        });
      }
    }
  
    onPageLoad() {
      this.formdata = {
        'clientid': this.clientId,
        'mstorgnhirarchyid': Number(this.orgId)
      };
    }
  
    openModal(content) {
      //this.clientSelected = 0;
      this.resetValues();
      this.isEdit = false;
      // if (this.baseFlag) {
      //   this.getClients();
      // } else {
      //   this.clientSelected = this.clientId;
      //   this.clientOrgnId = this.orgId;
      //   this.getOrganization(this.clientId, this.orgId);
      // }
      this.modalService.open(content).result.then((result) => {
      }, (reason) => {
  
      });
    }
  
    resetValues() {
      this.isUpdate = false
      this.hideAttachment = true;
      this.attachment = [];
      this.documentName='';
      this.orginalDocumentName = '';
      this.fileName = false;
      this.shownMessage = false;
      this.clientName = 'Stupa';
      this.orgName = 'Stupa'
    }
  
  
    save() {
      const data = {
        "clientid":Number(this.clientId),
        "mstorgnhirarchyid":Number(this.orgId),
        "uploadedfilename": this.documentName,
        "originalfilename": this.orginalDocumentName
      };
      console.log(JSON.stringify(data))
      if (!this.messageService.isBlankField(data)) {
        data["isupdate"] = this.isUpdate === true ? 1:0
        this.rest.uploadmasterdata(data).subscribe((res) => {
          this.respObject = res;
          if (this.respObject.success) {
            this.isError = false;
            const id = this.respObject.details;
              // this.messageService.setRow({
              //   id: id,
              //   clientid: Number(this.clientSelected),
              //   mstorghierarchyid: Number(this.orgSelected),
              //   mstorgnhirarchyname: this.orgName,
               
              // });
            this.totalData = this.totalData + 1;
            this.messageService.setTotalData(this.totalData);
            this.isError = false;
            this.resetValues();
            this.getTableData();
            this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
          } else {
            // this.isError = true;
            this.notifier.notify('error', this.respObject.message);
          }
        }, (err) => {
          // this.isError = true;
          this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
      } else {
        // this.isError = true;
        this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
      }
    }

    onFileComplete(data: any) {
      //console.log('file data==========' + JSON.stringify(data));
      // this.logoName = data.changedName;
      if (data.success) {
        this.fileName = true;
        this.hideAttachment = false;
        this.shownMessage = true;
        this.attachment.push({originalName: data.details.originalfile, fileName: data.details.filename});
        // console.log(JSON.stringify(this.attachment));
        if (this.attachment.length > 1) {
          this.attachMsg = this.attachment.length + ' files uploaded successfully';
        } else {
          this.attachMsg = this.attachment.length + ' file uploaded successfully';
        }
  
        this.documentName = data.details.filename;
        this.documentPath = data.details.path;
        this.orginalDocumentName = data.details.originalfile;
        var clientorgName = this.orginalDocumentName.split("_", 3);
        console.log(clientorgName);
        this.clientName = clientorgName[0];
        this.orgName = clientorgName[1];
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
        offset: offset,
        limit: limit
      };
      // console.log(data);
      this.rest.getalltransporttable(data).subscribe((res) => {
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
  
    ngOnDestroy(): void {
      if (this.userAuth) {
        this.userAuth.unsubscribe();
      }
    }
  
  }
  
