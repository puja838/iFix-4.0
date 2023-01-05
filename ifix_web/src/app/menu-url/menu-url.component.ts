import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {NotifierService} from 'angular-notifier';
import {Formatters} from 'angular-slickgrid';
import {MessageService} from '../message.service';
import {CustomInputEditor} from '../custom-inputEditor';
import {RestApiService} from '../rest-api.service';
import {Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-menu-url',
  templateUrl: './menu-url.component.html',
  styleUrls: ['./menu-url.component.css']
})
export class MenuUrlComponent implements OnInit, OnDestroy {

  displayed = true;
  selected: number;
  clientSelected: number;
  parentSelected: number;
  moduleSelected: number;
  show: boolean;
  totalData: number;
  selectedTitles: any[];
  respObject: any;
  clients = [];
  module = [];
  parents = [];
  clientName: string;
  moduleName: string;
  parentName: string;
  name: string;
  sequence: string;
  displayData: any;

  add: boolean;
  del: boolean;
  edit: boolean;
  view: boolean;

  isError = false;
  errorMessage: string;

  private notifier: NotifierService;
  public urls: any;
  urlSelected: number;
  private url: any;
  pageSize: number;
  clientId: number;
  private baseFlag: any;
  private adminAuth: Subscription;
  offset: number;
  private radioChecked: any;
  dataLoaded: boolean;
  showSearch = false;
  isLoading = false;
  menuSelected: any;
  menus: any;
  menuUrl: string;
  organaisation = [];
  orgSelected: number;
  orgName: string;
  urlDesc: string;
  orgnId: number;
  clientOrgnId: any;

  constructor(private _rest: RestApiService, private messageService: MessageService, private route: Router,
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
              this._rest.deleteurlfrommenu({id: item.id, user_id: this.messageService.getUserId()}).subscribe((res) => {
                  this.respObject = res;
                  if (this.respObject.success) {
                      this.messageService.sendAfterDelete(item.id);
                  } else {
                      this.notifier.notify('error', this.respObject.errorMessage);
                  }
              }, (err) => {
                  this.notifier.notify('error', this.respObject.errorMessage);
              });
            }
          }
          break;
      }
    });
    // this.messageService.getUserAuth().subscribe(details => {
    //     console.log(JSON.stringify(details));
    //     if (details.length > 0) {
    //         this.add = details[0].addFlag;
    //         this.del = details[0].deleteFlag;
    //         this.view = details[0].viewFlag;
    //         this.edit = details[0].editFlag;
    //     } else {
    //         this.add = false;
    //         this.del = false;
    //         this.view = false;
    //         this.edit = false;
    //     }
    // });
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
    this.pageSize = this.messageService.pageSize;
    this.displayData = {
      pageName: 'View Menu URL Mapping',
      openModalButton: 'Map Menu and URL',
      breadcrumb: 'menuURL',
      folderName: 'All Menu with URL',
      tabName: 'Menu URL',
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
        id: 'client_name', name: 'Client ', field: 'clientname', sortable: true, filterable: true
      },
      {
        id: 'org_name', name: 'Organization ', field: 'Orgnname', sortable: true, filterable: true
      },
      {
        id: 'name', name: 'Menu', field: 'menudesc', sortable: true, filterable: true
      },
      {
        id: 'module', name: 'Module', field: 'modulename', sortable: true, filterable: true
      },
      {
        id: 'url', name: 'URL ', field: 'url', sortable: true, filterable: true
      }
    ];
    this.messageService.setColumnDefinitions(columnDefinitions);
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
    this._rest.getallclientnames().subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, name: 'Select Client'});
        this.clients = this.respObject.details;
        this.clientSelected = 0;
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.isError = true;
      this.notifier.notify('error', err);
    });
    // this.getTableData();
  }

  changeRouting(path: string) {
    this.messageService.changeRouting(path);
  }

  onClientChange(selectedIndex) {
    this.clientName = this.clients[selectedIndex].name;
    this.clientOrgnId = this.clients[selectedIndex].orgnid
    const data = {
      clientid: Number(this.clientSelected) , 
      mstorgnhirarchyid: Number(this.clientOrgnId)
    };
    this._rest.getorganizationclientwisenew(data).subscribe((res) => {
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
  }

  openModal(content) {
    // if (!this.add) {
    //     this.notifier.notify('error', 'You do not have add permission');
    // } else {
    this.isError = false;
    this.reset();
    this.modalService.open(content, {size: 'sm'}).result.then((result) => {
    }, (reason) => {
    });
    //}
  }

  getDetails() {
    for (let i = 0; i < this.menus.length; i++) {
      if (this.menus[i].name === this.menuSelected) {

        this.menuUrl = this.menus[i].url;
      }
    }
  }

  save() {
    const data = {
      id: Number(this.parentSelected),
      urlid: Number(this.urlSelected),
    };
    if (!this.messageService.isBlankField(data)) {
      this._rest.updatemenu(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          this.totalData = this.totalData + 1;
          this.messageService.setTotalData(this.totalData);
          const id = this.respObject.details;
          this.messageService.setRow({
            id: id,
            clientname: this.clientName,
            Orgnname: this.orgName,
            modulename: this.moduleName,
            menudesc: this.parentName,
            url: this.url
          });
          this.reset();
          this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
        } else {
          this.isError = true;
          this.notifier.notify('error', this.respObject.errorMessage);
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

  reset() {
    this.parents = [];
    this.urls = [];
    this.clientSelected = 0;
    this.organaisation = [];
    this.module = [];
    this.orgSelected = 0;
    this.moduleSelected = 0;
    this.parentSelected = 0;
    this.urlSelected = 0;
  }

  getTableData() {
    if (!this.view) {
      this.notifier.notify('error', 'You do not have view permission');
    } else {
      this.getData({
        offset: this.messageService.offset, 
        limit: this.messageService.limit
      });
    }
  }

  getData(paginationObj) {
    const offset = paginationObj.offset;
    const limit = paginationObj.limit;
    this.dataLoaded = false;

    const data = {
      'offset': offset,
      'limit': limit,
    };
    this._rest.geturlmenudetails(data).subscribe((res) => {
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

  onRadioButtonChange(selectedValue) {
    this.radioChecked = selectedValue.value;
    this.parents = [];
    this.getMenu();
    this.getUrls();
  }

  getUrls() {
    this.urlDesc = '';
    this.url = '';
    if (Number(this.moduleSelected) > 0 && Number(this.clientSelected) > 0) {
      if (this.radioChecked === 0) {
        const data = {
          moduleid: Number(this.moduleSelected), mstorgnhirarchyid: Number(this.orgSelected), clientid: Number(this.clientSelected)
        };
        this._rest.getDistinctUrl(data).subscribe((res) => {
          // this._rest.getModuleUrl(this.moduleSelected, this.clientSelected).subscribe((res) => {
          this.respObject = res;
          this.urls = [];
          if (this.respObject.success) {
            this.isError = false;
            this.respObject.details.unshift({id: 0, url: 'Select URL'});
            this.urls = this.respObject.details;
            this.urlSelected = 0;
          } else {
            this.isError = true;
            this.notifier.notify('error', this.respObject.message);
          }
        }, (err) => {
          this.isError = true;
          this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
      }
      if (this.radioChecked === 1) {
        const data = {
          moduleid: Number(this.moduleSelected), mstorgnhirarchyid: Number(this.orgSelected), clientid: Number(this.clientSelected)
        };
        this._rest.getRemainingUrl(data).subscribe((res) => {
          this.respObject = res;
          this.urls = [];
          if (this.respObject.success) {
            this.isError = false;
            this.respObject.details.unshift({id: 0, url: 'Select URL'});
            this.urls = this.respObject.details;
            this.urlSelected = 0;
          } else {
            this.isError = true;
            this.notifier.notify('error', this.respObject.message);
          }
        }, (err) => {
          this.isError = true;
          this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
      }
    } else {
      this.isError = true;
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }
  }

  getMenu() {
    if (this.moduleSelected > 0 && this.clientSelected > 0 && this.orgSelected > 0) {
      this._rest.getparentmenu({
        moduleid: Number(this.moduleSelected),
        clientid: Number(this.clientSelected),
        mstorgnhirarchyid: Number(this.orgSelected),
        leafnode: this.radioChecked
      }).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          this.respObject.details.unshift({id: 0, menudesc: 'Select Menu'});
          this.parents = this.respObject.details;
          this.parentSelected = 0;
        } else {
          this.isError = true;
          this.notifier.notify('error', this.respObject.errorMessage);
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

  onModuleChange(selectedIndex: any) {
    this.moduleName = this.module[selectedIndex].modulename;
    this.parents = [];
    this.getMenu();
  }

  onParentChange(selectedIndex: any) {
    this.parentName = this.parents[selectedIndex].menudesc;
  }

  onUrlChange(value: any) {
    this.url = this.urls[value].url;
  }

  ngOnDestroy(): void {
    if (this.adminAuth) {
      this.adminAuth.unsubscribe();
    }
  }

  onOrgChange(index: any) {
    this.orgName = this.organaisation[index].organizationname;
    const data = {
      'offset': 0,
      'limit': 100,
      'clientid': Number(this.clientSelected),
      'mstorgnhirarchyid': Number(this.orgSelected)
    };
    this.getModuleData(data);
  }

  getModuleData(data) {
    this._rest.getModuleByOrgId(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, modulename: 'Select Module'});
        this.module = this.respObject.details;
        this.moduleSelected = 0;
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.isError = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

}
