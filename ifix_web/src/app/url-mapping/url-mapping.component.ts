import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {CommonSlickgridComponent} from '../common-slickgrid/common-slickgrid.component';
import {CustomInputEditor} from '../custom-inputEditor';
import {MessageService} from '../message.service';
import {Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {RestApiService} from '../rest-api.service';
import {Formatters, OnEventArgs} from 'angular-slickgrid';
import {NotifierService} from 'angular-notifier';
import {Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-url-mapping',
  templateUrl: './url-mapping.component.html',
  styleUrls: ['./url-mapping.component.css']
})
export class UrlMappingComponent implements OnInit, OnDestroy {

  displayed = true;
  sDate: string;
  eDate: string;
  totalData = 0;
  show: boolean;
  selected: number;
  clientSelected: number;
  clients: any;
  moduleSelected: number;
  modules: any;
  urls: any;
  urlSelected: number;
  url: string;
  urlKey: string;
  urlDesc: string;

  private respObject: any;
  displayData: any;

  add: boolean;
  del: boolean;
  edit: boolean;
  view: boolean;

  isError = false;
  message: string;

  private notifier: NotifierService;
  private radioChecked: any;
  collectionSize: number;
  pageSize: number;
  private adminAuth: Subscription;
  private baseFlag: any;
  clientId: number;
  dataLoaded: boolean;
  showSearch = false;
  isLoading = false;
  isExportDisable = false;
  organaisation = [];
  orgSelected: any;
  private orgName: string;
  urldescription: any;
  orgnId: number;
  clientName: string;
  moduleName: string;
  private modalReference: NgbModalRef;
  @ViewChild('content1') private content1;
  clientOrgnId:any;

  constructor(private rest: RestApiService, private messageService: MessageService, private route: Router,
              private modalService: NgbModal, notifier: NotifierService) {

    this.notifier = notifier;
    this.messageService.getCellChangeData().subscribe(item => {
      switch (item.type) {
        case 'change':
          console.log('changed');
          if (!this.edit) {
            this.notifier.notify('error', 'You do not have edit permission');
          } else {

          }
          break;
        case 'delete':
          console.log('deleted');
          if (!this.del) {
            this.notifier.notify('error', 'You do not have delete permission');
          } else {
            if (confirm('Are you sure?')) {
              this.rest.deleteModuleUrl({id: item.id}).subscribe((res) => {
                this.respObject = res;
                if (this.respObject.success) {
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

    this.messageService.getSelectedItemData().subscribe(selectedTitles => {
      if (selectedTitles.length > 0) {
        this.show = true;
        this.selected = selectedTitles.length;
      } else {
        this.show = false;
      }
    });
  }

  ngOnInit() {
    this.add = true;
    this.del = true;
    this.edit = true;
    this.view = true;
    this.dataLoaded = false;
    this.pageSize = this.messageService.pageSize;
    this.messageService.setGridWidth(1000);
    this.displayData = {
      pageName: 'Map Module URL',
      openModalButton: 'Map Module URL',
      breadcrumb: 'Map Module URL',
      folderName: 'All Map Module URL',
      tabName: 'Map Module URL',
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
        id: 'client', name: 'Client Name', field: 'clientname', sortable: true, filterable: true
      },
      {
        id: 'orgName', name: 'Organization Name', field: 'orgname', sortable: true, filterable: true
      },
      {
        id: 'name', name: 'Module Name', field: 'modulename', sortable: true, filterable: true
      },
      {
        id: 'url', name: 'URL', field: 'url', sortable: true, filterable: true
      },
      {
        id: 'urlKey', name: 'URL Key', field: 'urlkey', sortable: true, filterable: true
      }
    ];
    this.messageService.setColumnDefinitions(columnDefinitions);

    this.rest.getallclientnames().subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, name: 'Select Client'});
        this.clients = this.respObject.details;
        this.clientSelected = 0;
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });

    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.baseFlag = this.messageService.baseFlag;
      this.orgnId = this.messageService.orgnId;
      this.onPageLoad();
    } else {
      this.adminAuth = this.messageService.getClientUserAuth().subscribe(details => {
        if (details.length > 0) {
          // this.add = details[0].addFlag;
          // this.del = details[0].deleteFlag;
          // this.view = details[0].viewFlag;
          // this.edit = details[0].editFlag;
          this.clientId = details[0].clientid;
          this.baseFlag = details[0].baseFlag;
          this.orgnId = details[0].mstorgnhirarchyid;
          this.onPageLoad();
        }
      });
    }
  }

  onPageLoad() {
    //this.getTableData();
  }


  openModal(content) {
    if (!this.add) {
      this.notifier.notify('error', 'You do not have add permission');
    } else {
      this.reset();
      this.isError = false;
      this.modalService.open(content, {size: 'sm'}).result.then((result) => {
      }, (reason) => {

      });
    }
  }


  changeRouting(path: string) {
    this.messageService.changeRouting(path);
  }

  save() {
    console.log('.......' + this.radioChecked);
    if (this.radioChecked === 1) {
      const data = {
        clientId: Number(this.clientSelected),
        moduleid: Number(this.moduleSelected),
        url: this.url.trim(),
        mstorgnhirarchyid: Number(this.orgSelected),
        urldescription: this.urlDesc.trim(),
        urlkey: this.urlKey,
        type: 'update',
        oldUrl: Number(this.urlSelected)
      };
      if (!this.messageService.isBlankField(data)) {
        this.rest.insertUrl(data).subscribe((res) => {
          this.respObject = res;
          if (this.respObject.success) {
            this.isError = false;
            const id = this.respObject.details;
            // if ((this.clientId === this.clientSelected) && (this.orgnId === this.orgSelected)) {
              this.messageService.setRow({
                id: id, 
                clientname: this.clientName, 
                orgname: this.orgName,
                modulename: this.moduleName, 
                url: this.url, 
                urlkey: this.urlKey
              });
            // }
            this.totalData = this.totalData + 1;
            this.messageService.setTotalData(this.totalData);
            this.reset();
            this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
          } else {
            this.notifier.notify('error', this.respObject.message);
          }
        }, (err) => {
          this.isError = true;
          this.notifier.notify('error', err);
        });
      } else {

        this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
      }
    }


    if (this.radioChecked === 2) {
      const data = {
        clientId: Number(this.clientSelected),
        moduleid: Number(this.moduleSelected),
        url: this.url,
        mstorgnhirarchyid: Number(this.orgSelected),
        urldescription: this.urlDesc,
        urlkey: this.urlKey,
        type: 'type',
        oldUrl: Number(this.urlSelected)
      };

      if (!this.messageService.isBlankField(data)) {
        this.rest.insertUrl(data).subscribe((res) => {
          this.respObject = res;
          if (this.respObject.success) {
            this.isError = false;
            const id = this.respObject.details;
            // if ((this.clientId === this.clientSelected) && (this.orgnId === this.orgSelected)) {
              this.messageService.setRow({
                id: id, 
                clientname: this.clientName, 
                orgname: this.orgName,
                modulename: this.moduleName, 
                url: this.url, 
                urlkey: this.urlKey
              });
            // }
            this.totalData = this.totalData + 1;
            this.messageService.setTotalData(this.totalData);
            this.reset();
            this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
          } else {
            this.notifier.notify('error', this.respObject.message);
          }
        }, (err) => {
          this.isError = true;
          this.notifier.notify('error', err);
        });
      } else {
        this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
      }
    }

  }

  reset() {
    this.urlDesc = '';
    this.urlKey = '';
    this.url = '';
    this.moduleSelected = 0;
    this.clientSelected = 0;
    this.urlSelected = 0;
    this.orgSelected = 0;
    this.radioChecked = 2;
    this.organaisation = [];
    this.modules = [];
    this.urls = [];
    // this.onRadioButtonChange({value: 2});
  }


  getTableData() {
    this.getData({
      offset: this.messageService.offset, 
      limit: this.messageService.limit
    });
  }

  // isEmpty(obj) {
  //   for (const key in obj) {
  //     if (obj.hasOwnProperty(key)) {
  //       return false;
  //     }
  //   }
  //   return true;
  // }

  getData(paginationObj) {
    const offset = paginationObj.offset;
    const limit = paginationObj.limit;
    //this.dataLoaded = false;
    const data = {
      offset: offset,
      limit: limit
    };
    this.rest.getAllModuleUrls(data).subscribe((res) => {
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


  onClientChange(value: any) {
    this.clientName = this.clients[value].name;
    this.clientOrgnId = this.clients[value].orgnid;
    this.urls = [];
    const data = {
      clientid: Number(this.clientSelected) , 
      mstorgnhirarchyid: Number(this.clientOrgnId)
    };
    this.rest.getorganizationclientwisenew(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, organizationname: 'Select Organization'});
        this.organaisation = this.respObject.details;
        this.orgSelected = 0;
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, function (err) {

    });
  }

  onOrgChange(index: any) {
    this.orgName = this.organaisation[index].organizationname;
    const data = {
      'offset': 0,
      'limit': 100,
      'clientid': Number(this.clientSelected),
      'mstorgnhirarchyid': Number(this.orgSelected)
    };
    this.rest.getModuleByOrgId(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, modulename: 'Select Module'});
        this.modules = this.respObject.details;
        this.moduleSelected = 0;
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {

    });
  }

  onModuleChange(value: any) {
    // console.log(value);
    // console.log(JSON.stringify(this.modules));
    // console.log(this.moduleSelected);
    this.moduleName = this.modules[value].modulename;
    this.urls = [];
    this.getUrls();
  }

  onUrlChange(value: any) {
    // console.log(value);
    this.url = this.urls[value].url;
    this.urlKey = this.urls[value].urlkey;
    this.urlDesc = this.urls[value].urldescription;
  }

  onRadioButtonChange(selectedValue) {
    // console.log(selectedValue);
    this.radioChecked = selectedValue.value;
    this.getUrls();
  }

  getUrls() {
    this.urlDesc = '';
    this.url = '';
    // console.log('first:', Number(this.moduleSelected), Number(this.clientSelected));
    if (Number(this.moduleSelected) > 0 && Number(this.clientSelected) > 0) {
      // console.log('second:', this.radioChecked);
      if (this.radioChecked === 1) {
        const data = {
          moduleid: Number(this.moduleSelected), mstorgnhirarchyid: Number(this.orgSelected), clientid: Number(this.clientSelected)
        };
        this.rest.getDistinctUrl(data).subscribe((res) => {
          // this.rest.getModuleUrl(this.moduleSelected, this.clientSelected).subscribe((res) => {
          this.respObject = res;
          this.urls = [];
          if (this.respObject.success) {
            this.isError = false;
            this.respObject.details.unshift({id: 0, urlkey: 'Select URL Key'});
            // console.log(JSON.stringify(this.urls));
            this.urls = this.respObject.details;
            this.urlSelected = 0;
          } else {
            this.notifier.notify('error', this.respObject.message);
          }
        }, (err) => {

        });
      }
      if (this.radioChecked === 2) {
        const data = {
          moduleid: Number(this.moduleSelected), mstorgnhirarchyid: Number(this.orgSelected), clientid: Number(this.clientSelected)
        };
        this.rest.getRemainingUrl(data).subscribe((res) => {
          this.respObject = res;
          // console.log(JSON.stringify(this.respObject));
          this.urls = [];
          if (this.respObject.success) {
            this.isError = false;
            this.respObject.details.unshift({id: 0, urlkey: 'Select Url Key'});
            this.urls = this.respObject.details;
            this.urlSelected = 0;
          } else {
            this.notifier.notify('error', this.respObject.message);
          }
        }, (err) => {

        });
      }
    }/* else {

      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }*/
  }

  ngOnDestroy(): void {
    if (this.adminAuth) {
      this.adminAuth.unsubscribe();
    }
  }


}
