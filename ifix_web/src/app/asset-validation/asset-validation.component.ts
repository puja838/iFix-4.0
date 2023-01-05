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

@Component({
  selector: 'app-asset-validation',
  templateUrl: './asset-validation.component.html',
  styleUrls: ['./asset-validation.component.css']
})
export class AssetValidationComponent implements OnInit, OnDestroy {

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
  orgnId: number;
  isClient: boolean;
  selectedId: number;
  clientSelectedName: string;
  orgSelectedName: string;
  organaisation = [];
  orgSelected: any;
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

  constructor(private rest: RestApiService, private messageService: MessageService, private route: Router,
              private modalService: NgbModal, notifier: NotifierService) {
    this.notifier = notifier;
    this.messageService.getCellChangeData().subscribe(item => {
      switch (item.type) {

        case 'delete':
          // console.log('deleted');
          if (!this.del) {
            this.notifier.notify('error', this.messageService.DELETE_PERMISSION);
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
                  this.notifier.notify('success', this.messageService.DELETE_SUCCESS);
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

    this.pageSize = this.messageService.pageSize;

    // this.getBaseParent();

    this.displayData = {
      pageName: 'Maintain Asset Validation',
      openModalButton: 'Add Asset Validation',
      breadcrumb: 'Asset Validation',
      folderName: 'All Asset Validation',
      tabName: 'Asset Validation',
    };
    // let columnDefinitions = [];
    const columnDefinitions = [
      {
        id: 'delete',
        field: 'id',
        excludeFromHeaderMenu: true,
        formatter: Formatters.deleteIcon,
        minWidth: 30,
        maxWidth: 30,
      },
      /*{
        id: 'client_name', name: 'Client ', field: 'clientname', sortable: true, filterable: true
      },*/ {
        id: 'orgname', name: 'Organization ', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      }, {
        id: 'type', name: 'Asset Type ', field: 'recorddifferentiationtypename', sortable: true, filterable: true
      }, {
        id: 'name', name: 'Asset Attribute', field: 'recorddifferentiationname', sortable: true, filterable: true
      }, {
        id: 'validationrule', name: 'Validation Rule', field: 'validationrule', sortable: true, filterable: true
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
          this.respObject.details.unshift({id: 0, typename: 'Select Property'});
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
    this.assetAttribute = '';
    this.diffTypeId = 0;
    this.labelId = 0;
    this.diffValues = [];
    this.labelValues = [];
    this.diffId = 0;
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
      validationrule: this.assetAttribute,
      mstdifferentiationtypeid: Number(this.labelId),
      mstdifferentiationid: Number(this.diffId)
    };
    if (!this.messageService.isBlankField(data)) {
      // console.log(JSON.stringify(data));
      this.rest.addassetvalidation(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          const id = this.respObject.details;
          this.messageService.setRow({
            id: id,
            mstorgnhirarchyname: this.orgName,
            recorddifferentiationtypename: this.propertyValueName,
            validationrule: this.assetAttribute,
            recorddifferentiationname: this.diffValueName
          });
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

    console.log('...........' + JSON.stringify(data) + '...' + this.clientId);
    this.rest.getassetvalidation(data).subscribe((res) => {
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
      const seqNumber = this.labelValues[selectedIndex].seqno;
      const data = {
        clientid: this.clientId,
        mstorgnhirarchyid: Number(this.orgSelected),
        seqno: Number(seqNumber)
      };
      this.rest.getrecordbydifftype(data).subscribe((res: any) => {
        if (res.success) {
          res.details.unshift({id: 0, typename: 'Select Property Value', seqno: 0});
          this.diffValues = res.details;
          this.diffId = 0;
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        console.log(err);
      });
    }
  }

  onDiffValueChange(selectedIndex: any) {
    this.diffValueName = this.diffValues[selectedIndex].typename;
  }
}
