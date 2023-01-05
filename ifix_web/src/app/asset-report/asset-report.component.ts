import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {NotifierService} from 'angular-notifier';
import {RestApiService} from '../rest-api.service';
import {Filters, Formatters, OnEventArgs} from 'angular-slickgrid';
import {MessageService} from '../message.service';
import {Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';
import {CustomInputEditor} from '../custom-inputEditor';
import {FormControl} from '@angular/forms';
import {ThrowStmt} from '@angular/compiler';
import {JsonPipe} from '@angular/common';

@Component({
  selector: 'app-asset-report',
  templateUrl: './asset-report.component.html',
  styleUrls: ['./asset-report.component.css']
})
export class AssetReportComponent implements OnInit, OnDestroy {
  show: boolean;
  dataset: any[];
  totalData: number;
  respObject: any;

  displayData: any;

  add = false;
  del = false;
  edit = false;
  view = false;

  isError = false;
  errorMessage: string;

  private notifier: NotifierService;
  private clientId: number;
  private seq: number;

  pageSize: number;

  private baseFlag: any;
  private userAuth: Subscription;
  offset: number;
  // catalogName: string;
  dataLoaded: boolean;
  fileLoader: boolean;
  orgnId: number;
  isClient: boolean;
  selectedId: number;
  clientSelectedName: string;
  orgSelectedName: string;
  organaisation = [];
  orgSelected: any;
  orgSelectedBulk : any;
  orgName: any;
  @ViewChild('content1') private content1;
  private modalReference: NgbModalRef;
  orgId: number;
  assetAttribute: string;
  assetType = [];
  assetTypSelected: number;
  assetTypeName: string;
  diffTypes = [];
  diffTypeId: number;
  private typeName: string;
  diffValues = [];
  diffId: number;
  labelValues = [];
  labelId: number;
  private propertyValueName: string;
  private diffValueName: string;
  assetId: number;
  assetIds = [];
  private assetidname: string;
  attributes = [];
  fileUploadUrl: string;
  uploadButtonName = 'Upload File';
  attachMsg: string;
  attachment = [];
  formdata: any;
  hideAttachment: boolean;
  private attachFile: number;
  documentPath: any;
  documentName :any;
  orginalDocumentName:any;
  fileName: boolean;

  constructor(private rest: RestApiService, private messageService: MessageService, private route: Router,
              private modalService: NgbModal, notifier: NotifierService) {
    this.notifier = notifier;
    this.messageService.getCellChangeData().subscribe(item => {
      switch (item.type) {

        case 'delete':
          // console.log('deleted');
          if (!this.del) {
            this.notifier.notify('error', 'You do not have delete permission');
          } else {
            if (confirm('Are you sure?')) {
              this.rest.deleteassetvalidation({
                id: item.id
              }).subscribe((res) => {
                this.respObject = res;
                if (this.respObject.success) {
                  this.totalData = this.totalData - 1;
                  this.messageService.setTotalData(this.totalData);
                  this.messageService.sendAfterDelete(item.id);
                } else {
                  this.notifier.notify('error', this.respObject.message);
                }
              }, (err) => {
                this.notifier.notify('error', this.respObject.errorMessage);
              });
            }
          }
          break;
      }
    });

  }

  ngOnInit() {
    this.dataLoaded = false;
    this.fileLoader = true;
    this.fileUploadUrl = this.rest.apiRoot + '/fileupload';
    this.hideAttachment = true;
    this.fileName = false;

    this.pageSize = this.messageService.pageSize;

    // this.getBaseParent();

    this.displayData = {
      pageName: 'Manage Asset Attributes',
      openModalButton: 'Manage Asset Attributes',
      breadcrumb: 'Asset Validation',
      folderName: 'All Asset Validation',
      tabName: 'Manage Asset Attributes',
    };
    // let columnDefinitions = [];
    const columnDefinitions = [
      // {
      //   id: 'delete',
      //   field: 'id',
      //   excludeFromHeaderMenu: true,
      //   formatter: Formatters.deleteIcon,
      //   minWidth: 30,
      //   maxWidth: 30,
      // },
      {
        id: 'client_name', name: 'Client ', field: 'clientname', sortable: true, filterable: true
      }, {
        id: 'orgname', name: 'Organization ', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      }, {
        id: 'type', name: 'Asset Type ', field: 'recorddifftypename', sortable: true, filterable: true
      }, {
        id: 'name', name: 'Asset ID', field: 'assetid', sortable: true, filterable: true
      }, {
        id: 'recorddiffname', name: 'Attribute', field: 'recorddiffname', sortable: true, filterable: true
      }, {
        id: 'value', name: 'Value', field: 'value', sortable: true, filterable: true
      }
    ];


    this.messageService.setColumnDefinitions(columnDefinitions);
    // this.onPageLoad();
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.baseFlag = this.messageService.baseFlag;
      this.orgId = this.messageService.orgnId;
      this.edit =this.messageService.edit;
      this.del =this.messageService.del;
      this.onPageLoad();
    } else {
      this.userAuth = this.messageService.getClientUserAuth().subscribe(auth => {
        // this.view = auth[0].viewFlag;
        // this.add = auth[0].addFlag;
          this.edit = auth[0].editFlag;
          this.del = auth[0].deleteFlag;
        this.clientId = auth[0].clientid;
        this.baseFlag = auth[0].baseFlag;
        this.orgId = auth[0].mstorgnhirarchyid;
        this.onPageLoad();
      });
    }

  }

  onPageLoad() {
    const data = {
      clientid: Number(this.clientId) , 
      mstorgnhirarchyid: Number(this.orgId)
    };
    this.rest.getorganizationclientwisenew(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, organizationname: 'Select Organization'});
        this.organaisation = this.respObject.details;
        this.orgSelected = 0;
        this.orgSelectedBulk = 0;
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.isError = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
    this.rest.getRecordDiffType().subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, typename: 'Record Property Type'});
        this.diffTypes = this.respObject.details;
        this.diffTypeId = 0;
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.isError = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });

    // this.getTableData();
  }

  onDiffTypeChange(selectedIndex: any) {
    this.typeName = this.diffTypes[selectedIndex].typename;
    const seqNo = this.diffTypes[selectedIndex].seqno;
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.orgSelected)
    };
    if (!this.messageService.isBlankField(data)) {
      data['seqno'] = seqNo;
      this.rest.getcategorylevel(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.respObject.details.unshift({id: 0, typename: 'Property Value'});
          this.labelValues = this.respObject.details;
          this.labelId = 0;
          this.isError = false;
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

  changeRouting(path: string) {
    this.messageService.changeRouting(path);
  }

  reset() {
    this.orgSelected = 0;
    this.orgSelectedBulk = 0;
    this.diffTypeId = 0;
    this.assetId = 0;
    this.labelId = 0;
    this.attributes = [];
    this.hideAttachment = true;
    this.attachment = [];
    this.documentName='';
    this.orginalDocumentName = '';
    this.fileName = false;
    this.labelValues = [];
    this.assetIds = [];
  }


  openModal(content) {
    this.isError = false;
    this.reset();
    this.modalService.open(content).result.then((result) => {
    }, (reason) => {
    });
  }

  onOrgChange(index: any) {
    this.orgName = this.organaisation[index].organizationname;
    this.formdata = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': Number(this.orgSelectedBulk)
    };
  }

  onTypChange(index: any) {
    this.assetTypeName = this.assetType[index].name;
  }


  update() {
    // const data = {
    //   id: this.selectedId,
    //   clientid: Number(this.clientId),
    //   mstorgnhirarchyid: Number(this.orgSelected),
    //   catalogname: this.catalogName,
    // };

    // // if(this.isClient){
    // //   data["clientid"] = this.clie
    // // }

    // if (!this.messageService.isBlankField(data)) {

    //   this.rest.updatecatelog(data).subscribe((res) => {
    //     this.respObject = res;
    //     if (this.respObject.success) {
    //       this.isError = false;
    //       this.modalReference.close();


    //       //console.log("id "+ )
    //       this.getTableData();

    //       this.notifier.notify('success', 'Update Successfully');


    //     } else {
    //       this.isError = true;
    //       this.notifier.notify('error', this.respObject.message);
    //     }
    //   }, (err) => {
    //     this.isError = true;
    //     this.notifier.notify('error', this.messageService.SERVER_ERROR);
    //   });
    // } else {
    //   this.isError = true;
    //   this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    // }
  }

  save() {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.orgSelected),
      attributes: this.attributes,
      mstdifferentiationtypeid: Number(this.labelId),
      trnassetid: Number(this.assetId)
    };
    // console.log(JSON.stringify(this.attributes));
    if (!this.messageService.isBlankField(data)) {
      // console.log(JSON.stringify(data));
      this.rest.updateassetdiffval(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          // this.isError = false;
          const id = this.respObject.details;
          this.getTableData();
          this.reset();
          this.totalData = this.totalData + 1;
          this.messageService.setTotalData(this.totalData);
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
  }

  getTableData() {
    this.getData({
      offset: this.messageService.offset, 
      limit: this.messageService.limit
    });
  }

  isEmpty(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  getData(paginationObj) {
    const offset = paginationObj.offset;
    const limit = paginationObj.limit;
    this.dataLoaded = true;
    const data = {
      'offset': offset,
      'limit': limit,
      clientid: this.clientId,
      mstorgnhirarchyid: this.orgId
    };
    // console.log('...........' + JSON.stringify(data) + '...' + this.clientId);
    this.rest.getassetdifferentiation(data).subscribe((res) => {
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

  onPropertyValueChange(selectedIndex: any) {
    this.propertyValueName = this.labelValues[selectedIndex].typename;
    if (selectedIndex !== 0) {
      // const seqNumber = this.labelValues[selectedIndex].seqno;
      // const data = {
      //   clientid: this.clientId,
      //   mstorgnhirarchyid: Number(this.orgSelected),
      //   seqno: Number(seqNumber)
      // };
      // this.rest.getrecordbydifftype(data).subscribe((res: any) => {
      //   if (res.success) {
      //     res.details.unshift({id: 0, typename: 'Select Property Value', seqno: 0});
      //     this.diffValues = res.details;
      //     this.diffId = 0;
      //   } else {
      //     this.notifier.notify('error', res.message);
      //   }
      // }, (err) => {
      //   console.log(err);
      // });
      const data = {
        clientid: this.clientId,
        mstorgnhirarchyid: Number(this.orgSelected),
        mstdifferentiationtypeid: Number(this.labelId)
      };
      if (!this.messageService.isBlankField(data)) {
        this.rest.getassetbytype(data).subscribe((res: any) => {
          if (res.success) {
            res.details.values.unshift({id: 0, assetid: 'Select Asset Ids'});
            this.isError = false;
            this.assetIds = res.details.values;
            this.assetId = 0;
          } else {
            this.notifier.notify('error', res.message);
          }
        }, (err) => {
          console.log(err);
        });
      } else {
        this.isError = true;
        this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
      }
    }
  }

  onAssetValueChange(selectedIndex: any) {
    this.assetidname = this.assetIds[selectedIndex].typename;
    this.getAttributes();
  }

  getAttributes() {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.orgSelected),
      mstdifferentiationtypeid: Number(this.labelId),
      id: Number(this.assetId)
    };
    if (!this.messageService.isBlankField(data)) {
      this.rest.getassetdiffval(data).subscribe((res: any) => {
        if (res.success) {
          // res.details.unshift({id: 0, assetid: 'Select Asset Ids'});
          this.isError = false;
          this.attributes = res.details.values;

        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        console.log(err);
      });
    } else {
      this.isError = true;
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }
  }

  tabClick(event) {
    if (event.tab.textLabel === 'Manage Asset Attributes') {
      this.orgSelected = 0;
    } else if (event.tab.textLabel === 'Bulk Asset Upload') {
      this.orgSelectedBulk = 0;
    }
    else if (event.tab.textLabel === 'Bulk Asset Download') {
      this.orgSelectedBulk = 0;
    }
  }

  bulkSave(){
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.orgSelectedBulk),
      uploadedfilename : this.documentName,
      originalfilename: this.orginalDocumentName
    };
    console.log('>>>>>>>>>>> ', JSON.stringify(data));
    if (!this.messageService.isBlankField(data)) {
      this.fileLoader = false;
      this.rest.bulkassetupload(data).subscribe((res: any) => {
        this.respObject = res;
        if (this.respObject.success) {
          //const id = this.respObject.details;
          this.isError = false;
          this.reset();
          this.fileLoader = true;
          this.getTableData();
          this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
        } else {
          this.fileLoader = true;
          this.isError = true;
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.fileLoader = true;
        this.isError = true;
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    } else {
      this.fileLoader = true;
      this.isError = true;
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }
  }

  onFileComplete(data: any) {
    console.log('file data==========' + JSON.stringify(data));
    // this.logoName = data.changedName;
    if (data.success) {
      this.fileName = true;
      this.hideAttachment = false;
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

    }
  }

  onFileError(msg: string) {
    this.notifier.notify('error', msg);
  }

  onUpload(data: any) {
    this.fileLoader = data.loader;
  }

  onRemove() {
    this.attachFile = this.attachFile - 1;
  }

  download() {
    const data = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': Number(this.orgSelectedBulk),
    };
    //console.log(JSON.stringify(data))
    this.fileLoader = false;
    if (!this.messageService.isBlankField(data)) {
      this.rest.bulkassetdownload(data).subscribe((res: any) => {
        this.respObject = res;
        if (this.respObject.success) {
          const uploadname = this.respObject.uploadedfilename;
          const originalname = this.respObject.originalfilename;
          this.downloadFile(uploadname,originalname)
          this.isError = false;
          this.reset();
          this.fileLoader = true;
          this.notifier.notify('success', this.messageService.DOWNLOAD_SUCCESS);
        } else {
          this.fileLoader = true;
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.fileLoader = true;
        this.notifier.notify('error',this.messageService.SERVER_ERROR);
      });
    } else {
      this.fileLoader = true;
      this.notifier.notify('error',this.messageService.BLANK_ERROR_MESSAGE);
    }
  }

  downloadFile(uploadname, originalname) {
    const data = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': Number(this.orgSelectedBulk),
      'filename': uploadname
    };
    this.fileLoader = false;
    this.rest.filedownload(data).subscribe((blob: any) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = originalname;
      a.click();
      URL.revokeObjectURL(objectUrl);
      this.fileLoader = true;
    });
  }
}
