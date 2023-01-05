import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {MessageService} from '../message.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {CommonSlickgridComponent} from '../common-slickgrid/common-slickgrid.component';
import {CustomInputEditor} from '../custom-inputEditor';
import {RestApiService} from '../rest-api.service';
import {Formatters, OnEventArgs} from 'angular-slickgrid';
import {NotifierService} from 'angular-notifier';
import {Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';


@Component({
  selector: 'app-url-creation',
  templateUrl: './url-creation.component.html',
  styleUrls: ['./url-creation.component.css']
})
export class UrlCreationComponent implements OnInit, OnDestroy {
  displayed = true;
  url: string;
  urlKey: string;
  urlDesc: string;
  totalData = 0;
  show: boolean;
  selected: number;
  modules = [];
  moduleSelected: number;
  clients = [];
  clientSelected = 0;
  respObject: any;
  private moduleName: string;
  displayData: any;
  add: boolean;
  del: boolean;
  edit: boolean;
  view: boolean;
  isError = false;
  errorMessage: string;
  private notifier: NotifierService;
  pageSize: number;
  clientId: number;
  private baseFlag: any;
  private adminAuth: Subscription;
  slideChecked = 'N';
  isHidden: boolean;
  urlKeys = [];
  keySelected: string;
  dataLoaded: boolean;
  isLoading = false;
  urlSelected: any;
  urls: any;
  urlName: string;


  @ViewChild('content1') private content1;

  private modalReference: NgbModalRef;
  orgnId: any;
  userid: any;
  selectedId: number;

  constructor(private rest: RestApiService, private messageService: MessageService, private route: Router,
              private modalService: NgbModal, notifier: NotifierService) {
    this.notifier = notifier;
    this.messageService.getCellChangeData().subscribe(item => {
      switch (item.type) {
        case 'delete':
          console.log('deleted');
          if (!this.del) {
            this.notifier.notify('error', 'You do not have delete permission');
          } else {
            if (confirm('Are you sure?')) {
              this.rest.deleteUrl({id: item.id}).subscribe((res) => {
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
                this.notifier.notify('error', this.respObject.message);
              });
            }
          }
          break;
      }
    });
    // this.messageService.getUserAuth().subscribe(details => {
    //     // console.log(JSON.stringify(details));
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
    this.dataLoaded = true;
    this.pageSize = this.messageService.pageSize;
    this.displayData = {
      pageName: 'Map Module URL',
      openModalButton: 'Map Module URL',
      breadcrumb: 'Map Module URL',
      folderName: 'All Map Module URL',
      tabName: 'Map Module URL',
    };

    const columnDefinitions = [{
      id: 'delete',
      field: 'id',
      excludeFromHeaderMenu: true,
      formatter: Formatters.deleteIcon,
      minWidth: 30,
      maxWidth: 30,
    }, {
      id: 'edit',
      field: 'id',
      excludeFromHeaderMenu: true,
      formatter: Formatters.editIcon,
      minWidth: 30,
      maxWidth: 30,
      onCellClick: (e: Event, args: OnEventArgs) => {
        this.isError = false;
        this.selectedId = args.dataContext.id;
        this.urlKey = args.dataContext.urlkey;
        this.url = args.dataContext.url;
        this.urlDesc = args.dataContext.urldescription;
        this.modalReference = this.modalService.open(this.content1, {});
        this.modalReference.result.then((result) => {
        }, (reason) => {

        });
      }
    },
      {
        id: 'url', name: 'URL', field: 'url', sortable: true, filterable: true,
      },
      {
        id: 'urlKey', name: 'URL Key', field: 'urlkey', sortable: true, filterable: true,
      },
      {
        id: 'urlDesc', name: 'URL Description', field: 'urldescription', sortable: true, filterable: true
      }
    ];
    this.messageService.setColumnDefinitions(columnDefinitions);
    const data = {
      'offset': 0,
      'limit': 100
    };
    this.rest.getAllModules(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.values.unshift({id: 0, modulename: 'Select Module'});
        this.modules = this.respObject.details.values;
        this.moduleSelected = 0;
      } else {

      }
    }, (err) => {

    });
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.baseFlag = this.messageService.baseFlag;
      this.orgnId = this.messageService.orgnId;
      this.onPageLoad();
    } else {
      this.adminAuth = this.messageService.getUserAuth().subscribe(details => {
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
    // this.getTableData();
  }


  openModal(content) {
    //   if (!this.add) {
    //       this.notifier.notify('error', 'You do not have add permission');
    //   } else {
    this.isError = false;
    this.url = '';
    this.urlDesc = '';
    this.moduleSelected = 0;
    this.urlKey = '';
    this.slideChecked = 'N';
    this.keySelected = 'Select an Existing Key';
    this.modalService.open(content, {size: 'sm'}).result.then((result) => {
    }, (reason) => {

    });
    //}
  }


  getDetails() {
    for (let i = 0; i < this.urls.length; i++) {
      if (this.urls[i].urlKey === this.urlSelected) {
        this.urlName = this.urls[i].url;
      }
    }
  }


  changeRouting(path: string) {
    this.messageService.changeRouting(path);
  }

  onButtonChange(selectedButton) {
    this.slideChecked = selectedButton.value;
    if (this.slideChecked === 'N') {
      this.isHidden = false;
    } else {
      this.isHidden = true;
      if (this.urlKeys.length === 0) {
        // this.rest.getDistinctUrlKey(this.moduleSelected, this.messageService.getUserId(), this.clientId).subscribe((res) => {
        //     this.respObject = res;
        //     if (this.respObject.success) {
        //         this.respObject.details.unshift({URLKEY: 'Select an Existing Key'});
        //         this.urlKeys = this.respObject.details;
        //         this.keySelected = this.urlKeys[0].URLKEY;
        //     } else {

        //     }
        // }, (err) => {
        //     // console.log(err);
        // });
      } else {
        this.keySelected = 'Select an Existing Key';
      }
    }
  }

  update() {
    const data = {
      url: this.url.trim(),
      urldescription: this.urlDesc.trim(),
      createdBy: this.messageService.getUserId(),
      urlkey: this.urlKey.trim(),
      id: this.selectedId
    };
    if (!this.messageService.isBlankField(data)) {
      this.modalReference.close();
      this.dataLoaded = false;
      this.rest.updateUrl(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          this.messageService.sendAfterDelete(this.selectedId);
          this.dataLoaded = true;

          this.messageService.setRow({id: this.selectedId, url: this.url, urlkey: this.urlKey, urldescription: this.urlDesc});
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

  save() {
    const data = {
      clientid: this.clientId,
      url: this.url.trim(),
      urldescription: this.urlDesc.trim(),
      moduleid: Number(this.moduleSelected),
      urlkey: this.urlKey.trim(),
      mstorgnhirarchyid: this.orgnId
    };
    // console.log(JSON.stringify(data));
    if (!this.messageService.isBlankField(data)) {
      this.rest.insertUrl(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          const id = this.respObject.details;
          this.messageService.setRow({id: id, url: this.url, urlkey: this.urlKey, urldescription: this.urlDesc});
          this.totalData = this.totalData + 1;
          this.messageService.setTotalData(this.totalData);
          this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
          this.urlDesc = '';
          this.urlKey = '';
          this.url = '';
          this.moduleSelected = 0;
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
      'limit': limit
    };
    this.rest.getAllUrls(data).subscribe((res) => {
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


  onModuleChange(value: any) {
    this.moduleName = this.modules[value].MODULENAME;
  }

  ngOnDestroy(): void {
    if (this.adminAuth) {
      this.adminAuth.unsubscribe();
    }
  }

  onOrgChange(selectedIndex: any) {

  }

}
