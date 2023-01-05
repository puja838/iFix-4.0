import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MessageService} from '../message.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {RestApiService} from '../rest-api.service';
import {Filters, Formatters, OnEventArgs} from 'angular-slickgrid';
import {NotifierService} from 'angular-notifier';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-client-specific-url',
  templateUrl: './client-specific-url.component.html',
  styleUrls: ['./client-specific-url.component.css']
})
export class ClientSpecificUrlComponent implements OnInit, OnDestroy {

  clientName: string;
  description: string;
  totalData = 0;
  show: boolean;
  selected: number;
  respObject: any;
  urlSelected: number;
  urlArr = [];
  url: string;
  add: boolean;
  del: boolean;
  edit: boolean;
  view: boolean;
  displayData: any;
  isError = false;
  errorMessage: string;
  pageSize: number;
  clientId: number;
  private baseFlag: any;
  private adminAuth: Subscription;
  private notifier: NotifierService;
  offset: number;
  urlKey: string;
  clients = [];
  clientSelected: number;
  isAdmin: boolean;
  isDashboard: boolean;
  dataLoaded: boolean;
  isLoading = false;
  organaisation = [];
  orgSelected: number;
  orgName: string;
  clientSelectedName: string;
  orgSelectedName: string;
  urlKeySelected: number;
  selectedId: number;
  urlName: string;
  orgnId: number;
  urlKeySelected1: number;
  @ViewChild('content1') private content1;
  private modalReference: NgbModalRef;
  clientOrgnId: any;
  private userAuth: Subscription;

  constructor(private _rest: RestApiService, private messageService: MessageService,
              private route: Router, private modalService: NgbModal, notifier: NotifierService) {
    this.notifier = notifier;
    this.messageService.getCellChangeData().subscribe(item => {
      // console.log(item);
      switch (item.type) {
        case 'delete':
          // console.log('deleted');
          if (!this.del) {
            this.notifier.notify('error', 'You do not have delete permission');
          } else {
            if (confirm('Are you sure?')) {
              // console.log(JSON.stringify(item));
              this._rest.deletenonurl({id: item.id}).subscribe((res) => {
                this.respObject = res;
                // console.log(JSON.stringify(this.respObject));
                if (this.respObject.success) {
                  this.messageService.sendAfterDelete(item.id);
                  this.totalData = this.totalData - 1;
                  this.messageService.setTotalData(this.totalData);
                  this.notifier.notify('success', this.messageService.DELETE_SUCCESS);
                } else {
                  this.notifier.notify('error', this.respObject.errorMessage);
                }
              }, (err) => {
                this.notifier.notify('error', this.messageService.SERVER_ERROR);
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
  }

  ngOnInit() {
    this.add = true;
    this.del = true;
    this.edit = true;
    this.view = true;
    this.dataLoaded = true;
    this.pageSize = this.messageService.pageSize;
    this.displayData = {
      pageName: 'Maintain Client Specific URL',
      openModalButton: 'Add URL',
      searchModalButton: 'Search',
      breadcrumb: 'Client Specific URL',
      folderName: 'All Client Specific URL',
      tabName: 'Client Specific URL',
      exportBtn: 'Export to excel'

    };
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
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });

    const columnDefinitions = [
      {
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
          this.reset();
          this.isError = false;
          this.selectedId = args.dataContext.id;
          this.clientSelectedName = args.dataContext.clientname;
          this.orgSelectedName = args.dataContext.mstorgnhirarchyname;
          this.clientSelected = args.dataContext.clientid;
          this.orgSelected = args.dataContext.mstorgnhirarchyid;
          this.urlKeySelected1 = args.dataContext.urlid;
          this.urlName = args.dataContext.url;
          this.urlKey = args.dataContext.Urlname;
          this.getUrlKey(this.clientSelectedName, this.orgSelectedName);
          this.modalReference = this.modalService.open(this.content1, {});
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },
      {
        id: 'client_name', name: 'Client', field: 'clientname', sortable: true, filterable: true
      }, {
        id: 'organization_name', name: 'Organization', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      }, {
        id: 'urlkey', name: 'URL Key', field: 'Urlname', sortable: true, filterable: true
      }, {
        id: 'url', name: 'URL', field: 'url', sortable: true, filterable: true
      }
    ];
    this.messageService.setColumnDefinitions(columnDefinitions);
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.baseFlag = this.messageService.baseFlag;
      this.orgnId = this.messageService.orgnId;
      this.onPageLoad();
    } else {
      this.userAuth = this.messageService.getClientUserAuth().subscribe(auth => {
        if (auth.length > 0) {
          // this.add = details[0].addFlag;
          // this.del = details[0].deleteFlag;
          // this.view = details[0].viewFlag;
          // this.edit = details[0].editFlag;
          this.clientId = auth[0].clientid;
          this.orgnId = auth[0].mstorgnhirarchyid;
          this.baseFlag = auth[0].baseFlag;
          this.onPageLoad();
        }
      });
    }
  }

  onPageLoad() {
    // this.getTableData();
  }

  getUrlKey(clientId, orgId) {
    this._rest.geturlkey({clientid: Number(clientId), mstorgnhirarchyid: Number(orgId)}).subscribe((res) => {
      this.respObject = res;
      this.respObject.details.values.unshift({id: 0, Urlkeyname: 'Select URL key'});
      this.urlArr = this.respObject.details.values;
      this.urlSelected = 0;
      this.urlKeySelected = this.urlKeySelected1;
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }


  openModal(content) {
    if (!this.add) {
      this.notifier.notify('error', 'You do not have add permission');
    } else {
      this.isError = false;
      this.reset();
      this.modalService.open(content, {size: 'sm'}).result.then((result) => {
      }, (reason) => {

      });
    }

  }

  changeRouting(path: string) {
    this.messageService.changeRouting(path);
  }

  save() {
    const data = {
      clientid: Number(this.clientSelected), mstorgnhirarchyid: Number(this.orgSelected), urlid: Number(this.urlSelected),
      url: this.url
    };
    if (!this.messageService.isBlankField(data)) {
      this._rest.addnonurl(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.totalData = this.totalData + 1;
          this.messageService.setTotalData(this.totalData);
          this.isError = false;
          const id = this.respObject.details;
          this.messageService.setRow({
            id: id,
            clientname: this.clientName,
            mstorgnhirarchyname: this.orgName,
            Urlname: this.urlKey,
            url: this.url,
            isAdmin: this.isAdmin
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
    this.clientSelected = 0;
    this.orgSelected = 0;
    this.organaisation = [];
    this.urlArr = [];
    this.urlSelected = 0;
    this.isAdmin = false;
    this.isDashboard = false;
    this.url = '';
    this.urlKeySelected = 0;
  }

  update() {
    const data = {
      clientid: Number(this.clientSelected), mstorgnhirarchyid: Number(this.orgSelected), urlid: Number(this.urlKeySelected),
      url: this.urlName, id: this.selectedId
    };
    if (!this.messageService.isBlankField(data)) {
      this._rest.updatenonurl(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          this.messageService.sendAfterDelete(this.selectedId);
          this.dataLoaded = true;
          this.messageService.setRow({
            id: this.selectedId,
            clientname: this.clientSelectedName,
            mstorgnhirarchyname: this.orgSelectedName,
            Urlname: this.urlKey,
            url: this.urlName,
          });
          this.notifier.notify('success', this.messageService.EDIT_SUCCESS);
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

  isEmpty(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  onUrlKeyChange(selectedIndex: any) {
    this.urlKey = this.urlArr[selectedIndex].Urlkeyname;
    if (this.urlKey === 'dashboard') {
      this.isDashboard = true;
      this.isAdmin = false;
    } else {
      this.isDashboard = false;
    }
  }

  getData(paginationObj) {
    const offset = paginationObj.offset;
    const limit = paginationObj.limit;
    this.dataLoaded = true;
    const data = {
      'offset': offset,
      'limit': limit
    };
    this._rest.getnonurl(data).subscribe((res) => {
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
    if (this.adminAuth) {
      this.adminAuth.unsubscribe();
    }
  }

  onOrgChange(index: any) {
    this.orgName = this.organaisation[index].organizationname;
    this.getUrlKey(this.clientSelected, this.orgSelected);
  }

  onClientChange(index: any) {
    this.clientName = this.clients[index].name;
    this.clientOrgnId = this.clients[index].orgnid
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
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }
}
