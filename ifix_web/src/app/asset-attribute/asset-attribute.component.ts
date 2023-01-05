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

@Component({
  selector: 'app-asset-attribute',
  templateUrl: './asset-attribute.component.html',
  styleUrls: ['./asset-attribute.component.css']
})
export class AssetAttributeComponent implements OnInit, OnDestroy {

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
  @ViewChild('content') private content;
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
  propertyValueName: string;
  isEdit: boolean;
  labelId1:any;
  diffTypeId1:any;
  orgSelected1:any;
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
              this.rest.deleteRecordDiff({
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
      pageName: 'Maintain Asset Attribute',
      openModalButton: 'Add Asset Attribute',
      breadcrumb: 'Asset Attribute',
      folderName: 'All Asset Attribute',
      tabName: 'Asset Attribute',
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
      {
        id: 'edit',
        field: 'id',
        excludeFromHeaderMenu: true,
        formatter: Formatters.editIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          this.isError = false;
          console.log(JSON.stringify(args.dataContext));
          this.reset()
          this.isEdit = true;
          this.selectedId = args.dataContext.id;
          this.orgSelected = Number(args.dataContext.mstorgnhirarchyid);
          this.diffTypeId1 = 6;
          this.labelId1 = Number(args.dataContext.recorddifftypeid)
          this.assetAttribute = args.dataContext.name;
          this.orgName = args.dataContext.orgname;
          this.propertyValueName = args.dataContext.Type;
          this.getRecordDiffType('u');
          this.getCatLevel('u',5);
          this.modalReference = this.modalService.open(this.content, {});
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },
     /* {
        id: 'client_name', name: 'Client ', field: 'clientname', sortable: true, filterable: true
      },*/ {
        id: 'orgname', name: 'Organization ', field: 'orgname', sortable: true, filterable: true
      }, {
        id: 'Type', name: 'Property Type ', field: 'Type', sortable: true, filterable: true
      }, {
        id: 'name', name: 'Name ', field: 'name', sortable: true, filterable: true
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

  getOrganization(type){
    // const data = {
    //   clientid: Number(this.clientId) , 
    //   mstorgnhirarchyid: Number(this.orgId)
    // };
    // this.rest.getorganizationclientwisenew(data).subscribe((res) => {
    //   this.respObject = res;
    //   if (this.respObject.success) {
    //     this.respObject.details.unshift({id: 0, organizationname: 'Select Organization'});
    //     this.organaisation = this.respObject.details;
    //     if(type === 'i'){
    //       this.orgSelected = 0;
    //     }
    //     else{
    //       //this.orgSelected = this.orgSelected1;
    //     }
    //   } else {
    //     this.isError = true;
    //     this.notifier.notify('error', this.respObject.message);
    //   }
    // }, (err) => {
    //   this.isError = true;
    //   this.notifier.notify('error', this.messageService.SERVER_ERROR);
    // });
  }

  getRecordDiffType(type){
    //console.log(">>>>",type)
    this.rest.getRecordDiffType().subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, typename: 'Record Property Type'});
        this.diffTypes = this.respObject.details;
        if(type === 'i'){
          this.diffTypeId = 0;
        }
        else{
          this.diffTypeId = this.diffTypeId1;
          //console.log(this.diffTypeId);
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

  onDiffTypeChange(selectedIndex: any) {
    this.typeName = this.diffTypes[selectedIndex].typename;
    const seqNo = this.diffTypes[selectedIndex].seqno;
    this.getCatLevel('i',seqNo)
  }

  getCatLevel(type,seqNo){
    //console.log(">>>", type)
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
          if(type === 'i'){
            this.labelId = 0;
          }
          else{
            this.labelId = this.labelId1;
            //console.log(this.labelId);
          }
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
    this.isEdit = false;
    this.orgSelected = 0;
    this.assetAttribute = '';
    this.diffTypeId = 0;
    this.labelId = 0;
  }


  openModal(content) {
    this.isError = false;
    this.reset();
    this.getRecordDiffType('i')
    this.isEdit = false;
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
    const data = {
      id: this.selectedId,
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.orgSelected),
      name: this.assetAttribute,
      recorddifftypeid: Number(this.labelId)
    };
    if (!this.messageService.isBlankField(data)) {
      data['parentid'] = 0;
      this.rest.updateassetrecorddiff(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          this.messageService.sendAfterDelete(this.selectedId);
          this.dataLoaded = true;
          this.messageService.setRow({
            id: this.selectedId,
            orgname: this.orgName,
            Type: this.propertyValueName,
            name: this.assetAttribute,
          });
          this.reset();
          // this.getTableData();
          this.notifier.notify('success', 'Update Successfully');
          this.modalReference.close();
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

  save() {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.orgSelected),
      name: this.assetAttribute,
      recorddifftypeid: Number(this.labelId)
    };
    if (!this.messageService.isBlankField(data)) {
      data['parentid'] = 0;
      // console.log(JSON.stringify(data));
      this.rest.insertRecordDiff(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          const id = this.respObject.details;
          this.messageService.setRow({
            id: id,
            // clientname: this.clientName,
            orgname: this.orgName,
            Type: this.propertyValueName,
            name: this.assetAttribute,
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

    //console.log('...........' + JSON.stringify(data) + '...' + this.clientId);
    this.rest.getassetrecorddiffbyorg(data).subscribe((res) => {
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
  }
}


