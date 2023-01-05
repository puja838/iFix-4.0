import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {NotifierService} from 'angular-notifier';
import {RestApiService} from '../rest-api.service';
import {Filters, Formatters} from 'angular-slickgrid';
import {MessageService} from '../message.service';
import {Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';
import {CustomInputEditor} from '../custom-inputEditor';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-catalog-category-master',
  templateUrl: './catalog-category-master.component.html',
  styleUrls: ['./catalog-category-master.component.css']
})
export class CatalogCategoryMasterComponent implements OnInit, OnDestroy {
  areaSelected: number;
  catagorySelected: number;
  show: boolean;
  dataset: any[];
  totalData: number;
  respObject: any;
  areas = [];
  parents = [];
  parentName: string;
  areaName: string;
  attrVal: string;
  attrDesc: string;
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
  tickets = [];
  ticketSelected: number;
  type: string;
  pageSize: number;
  private baseFlag: any;
  private userAuth: Subscription;
  offset: number;
  fileUploadUrl: string;
  uploadButtonName = 'Upload File';
  attachment: any;
  uploadSuccessMessage: string;
  formData: any;
  dataLoaded: boolean;
  showSearch = true;
  catalogSelected: any;
  catalogs = [];
  catalogName: any;
  orgnId: number;
  isClient: boolean;
  selectedId: number;
  clientSelectedName: string;
  orgSelectedName: string;
  organaisation = [];
  orgSelected: any;
  orgName: any;

  proVals = [];
  proValSelected: number;
  seqno: number;
  propertySelected: number;
  propertyValSelected: number;
  proValName: string;
  propertyValueName: string;
  propertys = [];
  proVals1 = [];
  proValues = [];
  proValSelected1: number;
  proValName1: string;
  private second_seqno: number;


  constructor(private rest: RestApiService, private messageService: MessageService, private route: Router,
              private modalService: NgbModal, notifier: NotifierService) {
    this.notifier = notifier;
    this.messageService.getCellChangeData().subscribe(item => {
      switch (item.type) {

        case 'delete':
          // //console.log('deleted');
          if (!this.del) {
            this.notifier.notify('error', 'You do not have delete permission');
          } else {
            if (confirm('Are you sure?')) {
              // //console.log(JSON.stringify(item));
              this.rest.deletecatelogmap({id: item.id, forrecorddiffid: item.torecorddiffid}).subscribe((res) => {
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
                this.notifier.notify('error', this.respObject.message);
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


    this.displayData = {
      pageName: 'Maintain Catalog Category',
      openModalButton: 'Add Catalog Category ',
      breadcrumb: 'Catalog Categories',
      folderName: 'All Catalog Categories',
      tabName: 'Catalog Categories',
    };
    let columnDefinitions = [];
    columnDefinitions = [
      {
        id: 'delete',
        field: 'id',
        excludeFromHeaderMenu: true,
        formatter: Formatters.deleteIcon,
        minWidth: 30,
        maxWidth: 30,
      },
      {
        id: 'clientName', name: 'Client', field: 'clientname', sortable: true, filterable: true
      },
      {
        id: 'organization', name: 'Organization', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'ttype', name: 'To Property Type', field: 'fromrecorddifftypename', sortable: true, filterable: true
      },
      {
        id: 'ttypevalue', name: 'Property Value', field: 'fromrecorddiffname', sortable: true, filterable: true
      },
      {
        id: 'ftype', name: 'From Property Type', field: 'torecorddifftypename', sortable: true, filterable: true
      },
      {
        id: 'fvalue', name: 'Property Value', field: 'torecorddiffname', sortable: true, filterable: true
      },
      {
        id: 'user', name: 'Catalog', field: 'catalogname', sortable: true, filterable: true
      }
    ];
    this.messageService.setColumnDefinitions(columnDefinitions);
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.baseFlag = this.messageService.baseFlag;
      this.orgnId = this.messageService.orgnId;
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
        this.baseFlag = auth[0].baseFlag;
        this.orgnId = auth[0].mstorgnhirarchyid;
        this.onPageLoad();
      });
    }

  }

  onPageLoad() {
    // this.getTableData();
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgnId)
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
        this.respObject.details.unshift({id: 0, typename: 'Record Property Type', seqno: -1});
        this.tickets = this.respObject.details;
        this.propertys = this.respObject.details;
        this.ticketSelected = 0;
        this.propertySelected = 0;
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.isError = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }


  onOrgChange(index: any) {
    this.orgName = this.organaisation[index].organizationname;
    const data1 = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.orgSelected),
      offset: 0,
      limit: 100
    };
    this.rest.getcatelog(data1).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.values.unshift({id: 0, catalogname: 'Select Catalog'});
        this.parents = this.respObject.details.values;
        this.catagorySelected = 0;
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.isError = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });

  }

  changeRouting(path: string) {
    this.messageService.changeRouting(path);
  }


  openModal(content) {
    this.resetValues();
    this.isError = false;
    this.modalService.open(content).result.then((result) => {
    }, (reason) => {
    });
  }


  save() {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.orgSelected),
      fromrecorddifftypeid: Number(this.ticketSelected),
      fromrecorddiffid: Number(this.proValSelected),
      torecorddifftypeid: Number(this.propertyValSelected),
      torecorddiffid: Number(this.proValSelected1),
      catalogid: Number(this.catagorySelected)
    };
    //console.log('data=====' + JSON.stringify(data));
    if (!this.messageService.isBlankField(data)) {

      this.rest.addcatelogmap(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          const id = this.respObject.details;
          this.getTableData();
          this.resetValues();
          this.totalData = this.totalData + 1;
          this.messageService.setTotalData(this.totalData);
          this.areaSelected = 0;
          this.catagorySelected = 0;
          this.catalogSelected = 0;
          this.notifier.notify('success', this.messageService.INSERT_SUCCESS);

        } else {
          this.notifier.notify('error', this.respObject.message);
          // this.isError = true;
        }
      }, (err) => {
        // this.isError = true;
        // this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    } else {
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
      // this.isError = true;
    }
  }


  oncatalogChange(selectedIndex: any) {
    this.catalogName = this.catalogs[selectedIndex].name;
  }

  onProValueChange1(selectedIndex: any) {
    // //console.log(this.proValSelected1);
    this.proValName1 = this.proVals1[selectedIndex].typename;

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

  resetValues() {
    this.orgSelected = 0;
    this.ticketSelected = 0;
    this.proValSelected = 0;
    this.propertySelected = 0;
    this.propertyValSelected = 0;
    this.proValSelected1 = 0;
    this.catagorySelected = 0;
    this.proVals = [];
    this.proValues = [];
    this.proVals1 = [];
    this.parents = [];
    this.second_seqno = -1;
  }

  getData(paginationObj) {
    const offset = paginationObj.offset;
    const limit = paginationObj.limit;
    this.dataLoaded = true;
    const data = {
      'offset': offset,
      'limit': limit,
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.orgnId
    };
    this.rest.getcatelogmap(data).subscribe((res) => {
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

  onParentChange(selectedIndex: any) {
    this.proValName = this.parents[selectedIndex].name;
  }

  onProValueChange(selectedIndex: any) {
    //console.log("%%%%%%%%%%%%%%%%55",this.proValSelected);
    this.proValName = this.proVals[selectedIndex].typename;
    this.getLabelValue();
  }

  getLabelValue() {
    const data = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': Number(this.orgSelected),
      'fromrecorddifftypeid': Number(this.ticketSelected),
      'fromrecorddiffid': Number(this.proValSelected),
      //'seqno': this.second_seqno
    };
    //console.log(JSON.stringify(data));
    if (!this.messageService.isBlankField(data) && this.second_seqno !== -1) {
      data['seqno'] = this.second_seqno;
      this.rest.getlabelbydiffseq(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.respObject.details.unshift({id: 0, typename: 'Property Value'});
          this.proValues = this.respObject.details;
          this.propertyValSelected = 0;
        } else {
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {

      });
    }
  }

  onPropertyChange(selectedIndex: any) {
    if (Number(this.ticketSelected) !== Number(this.propertySelected)) {
      this.proValName = this.propertys[selectedIndex].typename;
      this.second_seqno = this.propertys[selectedIndex].seqno;
      this.getLabelValue();
    } else {
      this.notifier.notify('error', 'Two Property Type Can not be same');
    }
  }

  onPropertyValueChange(selectedIndex: any) {
    this.propertyValueName = this.proValues[selectedIndex].typename;
    this.getProperty(this.proValues, Number(this.propertyValSelected));
    //console.log(this.seqno)
    this.getCatDifftypevalue('t');

  }


  getProperty(arr, valueSelected) {
    // //console.log('this.tickets=====' + JSON.stringify(this.tickets));
    this.seqno = 0;
    for (let i = 0; i < arr.length; i++) {
      // //console.log('this.tickets[i].id=====' + JSON.stringify(this.tickets[i].id));
      // //console.log('this.ticketSelected=====' + JSON.stringify(this.ticketSelected));
      if (arr[i].id === valueSelected) {
        this.seqno = arr[i].seqno;
        // //console.log('this.seqno==' + this.seqno);

      }
    }
  }


  onTicketChange(selectedIndex: any) {
    this.type = this.tickets[selectedIndex].name;
    this.getProperty(this.tickets, Number(this.ticketSelected));
    this.getDifftypevalue('f');
    this.getCatDifftypevalue('t');
  }

  getDifftypevalue(type) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.orgSelected),
      seqno: this.seqno
    };
    // //console.log('data======================' + JSON.stringify(data));
    this.rest.getrecordbydifftype(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, parentcategorynames: 'Property Value', typename: 'Property Value'});
        if (type === 'f') {
          this.proVals = this.respObject.details;
          this.proValSelected = 0;
        }
        // else {
        //   this.proVals1 = this.respObject.details;
        //   this.proValSelected1 = 0;
        // }
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.isError = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });

  }

  getCatDifftypevalue(type) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.orgSelected),
      fromrecorddifftypeid: Number(this.ticketSelected),
      fromrecorddiffid: Number(this.proValSelected),
      seqno: this.seqno
    };
    //console.log('data======================' + JSON.stringify(data));
    this.rest.getmappeddiffbyseq(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, parentcategorynames: 'Property Value', typename: 'Property Value'});
        if (type === 't') {
          this.proVals1 = this.respObject.details;
          this.proValSelected1 = 0;
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

  ngOnDestroy(): void {
    if (this.userAuth) {
      this.userAuth.unsubscribe();
    }
  }


}
