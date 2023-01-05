import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MessageService} from '../message.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {CustomInputEditor} from '../custom-inputEditor';
import {CommonSlickgridComponent} from '../common-slickgrid/common-slickgrid.component';
import {RestApiService} from '../rest-api.service';
import {Formatters, OnEventArgs} from 'angular-slickgrid';
import {NotifierService} from 'angular-notifier';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-module-client',
  templateUrl: './module-client.component.html',
  styleUrls: ['./module-client.component.css']
})
export class ModuleClientComponent implements OnInit, OnDestroy {


  displayed = true;
  totalData = 0;
  show: boolean;
  selected: number;
  clientSelected: number;
  clients: any;
  moduleSelected: number;
  modules: any;
  sequence: string;
  private respObject: any;
  private moduleName: string | string;
  private clientName: any;
  min: any;
  max: any;
  displayData: any;

  add: boolean;
  del: boolean;
  edit: boolean;
  view: boolean;

  isError = false;
  message: string;

  private notifier: NotifierService;
  slideChecked = false;
  pageSize: number;
  private adminAuth: Subscription;
  private baseFlag: any;
  clientId: number;
  offset: number;
  dataLoaded: boolean;

  organaisation = [];
  orgSelected: any;
  private orgName: any;
  @ViewChild('content1') private content1;
  private modalReference: NgbModalRef;
  clientSelectedName: string;
  orgSelectedName: string;
  moduleSelectedName: string;
  selectedId: number;
  orgnId: number;
  clientOrgnId: any;
  private userAuth: Subscription;

  constructor(private _rest: RestApiService,
              private messageService: MessageService, private route: Router, private modalService: NgbModal, notifier: NotifierService) {
    this.notifier = notifier;
    this.messageService.getCellChangeData().subscribe(item => {
      console.log('item==============' + JSON.stringify(item));
      switch (item.type) {
        case 'change':
          // console.log('changed');
          if (!this.edit) {
            this.notifier.notify('error', 'You do not have edit permission');
          } else {

          }
          break;
        case 'delete':
          // console.log('deleted');
          if (!this.del) {
            this.notifier.notify('error', 'You do not have delete permission');
          } else {
            if (confirm('Are you sure?')) {
              console.log(JSON.stringify(item));
              this._rest.deleteModuleClient({id: item.id}).subscribe((res) => {
                this.respObject = res;
                // console.log(JSON.stringify(this.respObject));
                if (this.respObject.success) {
                  this.messageService.sendAfterDelete(item.id);
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
    // this.messageService.getUserAuth().subscribe(details => {
    //   // console.log(JSON.stringify(details));
    //   if (details.length > 0) {
    //     this.add = details[0].addFlag;
    //     this.del = details[0].deleteFlag;
    //     this.view = details[0].viewFlag;
    //     this.edit = details[0].editFlag;
    //   } else {
    //     this.add = false;
    //     this.del = false;
    //     this.view = false;
    //     this.edit = false;
    //   }
    // });
    // this.messageService.getSelectedItemData().subscribe(selectedTitles => {
    //   if (selectedTitles.length > 0) {
    //     this.show = true;
    //     this.selected = selectedTitles.length;
    //   } else {
    //     this.show = false;
    //   }
    // });
  }

  ngOnInit() {
    // this.clientId = this.messageService.clientId;
    // this.orgnId = this.messageService.orgnId;
    // console.log("\n Client ==  ",this.clientId, '\n Org == ' ,this.orgnId);
    this.add = true;
    this.del = true;
    this.edit = true;
    this.view = true;
    this.dataLoaded = true;
    // this.dataLoaded=false;
    this.pageSize = this.messageService.pageSize;
    this.modules = [{id: 1, modulename: 'Select Module'}, {id: 2, modulename: 'Test Module'}];
    this.moduleSelected = 0;
    this.displayData = {
      pageName: 'View Module Client Mapping',
      openModalButton: 'Map Module with Client',
      breadcrumb: 'ModuleClientMapping',
      folderName: 'All Mappings',
      tabName: 'Module Client Mappings'
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
      // {
      //   id: 'edit',
      //   field: 'id',
      //   excludeFromHeaderMenu: true,
      //   formatter: Formatters.editIcon,
      //   minWidth: 30,
      //   maxWidth: 30,
      //   onCellClick: (e: Event, args: OnEventArgs) => {
      //       console.log(args.dataContext);
      //       this.selectedId = args.dataContext.id;
      //       this.clientSelectedName = args.dataContext.clientname;
      //       this.orgSelectedName = args.dataContext.mstorgnhirarchyname;
      //       this.moduleSelectedName = args.dataContext.modulename;
      //       this.notifier.notify('error', '');

      //       this.modalReference = this.modalService.open(this.content1,{});
      //       this.modalReference.result.then((result) => {
      //       }, (reason) => {

      //       });
      //   }
      // },
      {
        id: 'client', name: 'Client Name', field: 'clientname', sortable: true, filterable: true
      },
      {
        id: 'orgName', name: 'Organization Name', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'name', name: 'Module Name', field: 'modulename', sortable: true, filterable: true
      }
    ];
    this.messageService.setColumnDefinitions(columnDefinitions);

    //  12-Aug-2021 : If and Else condition created by Biswajit because of clientId and orgnId undefined.

    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.baseFlag = this.messageService.baseFlag;
      this.orgnId = this.messageService.orgnId;
      if (this.baseFlag) {
        this.edit = true;
        this.del = true;
      } else {
        this.clientName = this.messageService.clientname;
        this.edit = this.messageService.edit;
        this.del = this.messageService.del;
      }
      this.onPageLoad();
      // console.log("\n Client 111 ==  ",this.clientId, '\n Org 111 == ' ,this.orgnId);
    } else {
      this.userAuth = this.messageService.getClientUserAuth().subscribe(auth => {
        // this.view = auth[0].viewFlag;
        // this.add = auth[0].addFlag;
        // this.edit = auth[0].editFlag;
        // this.del = auth[0].deleteFlag;
        this.clientId = auth[0].clientid;
        this.baseFlag = auth[0].baseFlag;
        this.orgnId = auth[0].mstorgnhirarchyid;
        if (this.baseFlag) {
          this.edit = true;
          this.del = true;
        } else {
          this.clientName = auth[0].clientname;
          this.del = auth[0].deleteFlag;
          this.edit = auth[0].editFlag;
        }
        this.onPageLoad();
        // console.log("\n Client 222 ==  ",this.clientId, '\n Org 222 == ' ,this.orgnId);
      });
    }


    this._rest.getallclientnames().subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, name: 'Select Client'});
        this.clients = this.respObject.details;
        this.clientSelected = 0;
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, function (err) {

    });
    this._rest.getAllModules({offset: 0, limit: 100}).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.values.unshift({id: 0, modulename: 'Select Module'});
        this.modules = this.respObject.details.values;
        this.moduleSelected = 0;
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, function (err) {

    });
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
    const data = {
      moduleid: Number(this.moduleSelected),
      clientid: Number(this.clientSelected),
      mstorgnhirarchyid: Number(this.orgSelected)
    };
    if (!this.messageService.isBlankField(data)) {
      this._rest.addModuleClient(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          const id = this.respObject.details;
          this.messageService.setRow({
            id: id, clientname: this.clientName, mstorgnhirarchyname: this.orgName,
            modulename: this.moduleName
          });
          this.totalData = this.totalData + 1;
          this.messageService.setTotalData(this.totalData);
          this.isError = false;
          this.reset();
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

  reset() {
    this.moduleSelected = 0;
    this.clientSelected = 0;
    this.orgSelected = 0;
    this.organaisation = [];
  }

  slideChange() {
    this.slideChecked = !this.slideChecked;
  }

  onModuleChange(value: any) {
    this.moduleName = this.modules[value].modulename;
    // console.log("this.moduleName======" + JSON.stringify(this.moduleName));
    // console.log("this.moduleSelected======" + JSON.stringify(this.moduleSelected));
  }

  onClientChange(value: any) {
    this.clientName = this.clients[value].name;
    this.clientOrgnId = this.clients[value].orgnid;
    const data = {
      clientid: Number(this.clientSelected) ,
      mstorgnhirarchyid: Number(this.clientOrgnId)
    };
    // console.log("\n Data is ==  ", JSON.stringify(data));
    this._rest.getorganizationclientwisenew(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, organizationname: 'Select Organization'});
        this.organaisation = this.respObject.details;
        this.orgSelected = 0;
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    },  (err) =>{

    });
    this._rest.getAllModules({offset: 0, limit: 100}).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.values.unshift({id: 0, modulename: 'Select Module'});
        this.modules = this.respObject.details.values;
        this.moduleSelected = 0;
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.isError = true;
      this.notifier.notify('error', err);
    });

  }

  update() {
    const data = {
      id: this.selectedId,
      clientid: this.clientId,
      mstorgnhirarchyid: this.orgnId,
      moduleid: Number(this.moduleSelected)
    };
    console.log('data==========' + JSON.stringify(data));
    if (!this.messageService.isBlankField(data)) {
      this.modalReference.close();
      this.dataLoaded = false;
      this._rest.updateModuleClient(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.totalData = this.totalData + 1;
          this.messageService.setTotalData(this.totalData);
          this.isError = false;
          this.getTableData();
          this.reset();
          this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
        } else {
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.notifier.notify('error', err);
      });
    } else {
      this.notifier.notify('error', this.respObject.BLANK_ERROR_MESSAGE);

    }
  }

  ngOnDestroy(): void {
    if (this.adminAuth) {
      this.adminAuth.unsubscribe();
    }
  }

  onOrgChange(index: any) {
    this.orgName = this.organaisation[index].organizationname;
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
      'offset': offset,
      'limit': limit,
      // 'clientid': Number(this.clientSelected),
      // 'mstorgnhirarchyid': Number(this.orgSelected)
    };
    console.log('data for grid====' + JSON.stringify(data));
    this._rest.getAllModuleClients(data).subscribe((res) => {
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
      this.notifier.notify('error', respObject.errorMessage);
    }
  }

  onPageSizeChange(value: any) {
    this.pageSize = value;
    this.getData({
      offset: this.messageService.offset,
      limit: this.messageService.limit
    });
  }

}
