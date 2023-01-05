import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {NotifierService} from 'angular-notifier';
import {Formatters, OnEventArgs} from 'angular-slickgrid';
import {MessageService} from '../message.service';
import {RestApiService} from '../rest-api.service';
import {Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {CustomInputEditor} from '../custom-inputEditor';
import {Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';


@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.css']
})
export class MenusComponent implements OnInit, OnDestroy {

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
  pageSize: number;
  clientId: number;
  offset: number;
  // navMenu: boolean;
  dataLoaded: boolean;
  showSearch = false;
  isLoading = false;
  searchData: FormControl = new FormControl();
  menuSelected: any;
  menus: any;
  parentMenu: string;
  showExportBtn = false;
  dataExcel = [];
  isExportDisable = false;
  private notifier: NotifierService;
  private baseFlag: any;
  private adminAuth: Subscription;
  organaisation = [];
  orgSelected: any;
  private orgName: any;
  @ViewChild('content') private content;
  private modalReference: NgbModalRef;
  selectedId: number;
  orgnId: number;
  clientSelected1: number;
  orgSelected1: number;
  clientSelectedName: string;
  orgSelectedName: string;
  moduleSelected1: number;
  parentSelected1: number;
  menuName: string;
  menuSeq: number;
  isUpdate:boolean;
  clientOrgnId:any;

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
              this.rest.deletemenu({id: item.id}).subscribe((res) => {
                this.respObject = res;
                if (this.respObject.success) {
                  this.messageService.sendAfterDelete(item.id);
                  this.totalData = this.totalData - 1;
                  this.messageService.setTotalData(this.totalData);
                  this.notifier.notify('success', this.messageService.DELETE_SUCCESS);
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
    this.messageService.setGridWidth(1000);
    // this.rest.getAllClients().subscribe((res) => {
    //   this.respObject = res;
    //   if (this.respObject.success) {
    //     this.respObject.details.unshift({id: 0, name: 'Select Client'});
    //     this.clients = this.respObject.details;
    //     this.clientSelected = 0;
    //   } else {
    //   }
    // }, (err) => {
    //
    // });
    this.displayData = {
      pageName: 'Maintain Menu',
      openModalButton: 'Create Menu',
      searchModalButton: 'Search',
      breadcrumb: 'menu',
      folderName: 'All Menu',
      tabName: 'Menus',

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
        id: 'edit',
        field: 'id',
        excludeFromHeaderMenu: true,
        formatter: Formatters.editIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          this.reset();
          console.log(JSON.stringify(args.dataContext)+"  <<<<<<<<<<<<<<<<<<<<  ARGS.DATACONTEXT");
          this.isUpdate =true;
          this.module =[];
          this.parents =[];
          this.selectedId = args.dataContext.id;
          this.clientSelectedName = args.dataContext.clientname;
          this.orgSelectedName = args.dataContext.Orgnname;
          this.clientSelected = args.dataContext.clientid;
          this.orgSelected = args.dataContext.mstorgnhirarchyid;
          this.moduleSelected1 = args.dataContext.moduleid;
          this.parentSelected1 = args.dataContext.parentmenuid;
          this.name = args.dataContext.menudesc;
          this.moduleName = args.dataContext.modulename;
          this.parentName = args.dataContext.parentmenu;

          this.sequence = args.dataContext.sequence_no;
          // const data = {
          //   'offset': 0,
          //   'limit': 100,
          //   'clientid': Number(this.clientSelected1),
          //   'mstorgnhirarchyid': Number(this.orgSelected1)
          // };

          // console.log(this.clientSelected1, this.orgSelected1+"!!!!!!!!!!!!!!!!!");
          this.getModuleData(this.clientSelected, this.orgSelected, 'u');
          // const data1 = {
          //   'moduleid': Number(this.moduleSelected1),
          //   'clientid': Number(this.clientSelected1),
          //   'mstorgnhirarchyid': Number(this.orgSelected1)
          // };

          // console.log(this.moduleSelected1,this.clientSelected1, this.orgSelected1+"??????????????");

          this.getParentMenu(this.moduleSelected1, this.clientSelected, this.orgSelected, 'u');
          this.modalReference = this.modalService.open(this.content, {});
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },
      {
        id: 'client_name', name: 'Client ', field: 'clientname', sortable: true, filterable: true
      },
      {
        id: 'org_name', name: 'Organization ', field: 'Orgnname', sortable: true, filterable: true
      },
      {
        id: 'name', name: 'Menu', field: 'menudesc', sortable: true, filterable: true, cssClass: 'highlight'
      },
      {
        id: 'module', name: 'Module', field: 'modulename', sortable: true, filterable: true
      },
      {
        id: 'parent', name: 'Parent Menu', field: 'parentmenu', sortable: true, filterable: true
      },
      {
        id: 'sequence', name: 'Sequence ', field: 'sequence_no', sortable: true, filterable: true
      }
    ];
    this.messageService.setColumnDefinitions(columnDefinitions);
    this.onPageLoad();
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
    this.rest.getallclientnames().subscribe((res) => {
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
  }

  changeRouting(path: string) {
    this.messageService.changeRouting(path);
  }

  onClientChange(selectedIndex) {
    this.clientName = this.clients[selectedIndex].name;
    this.clientOrgnId = this.clients[selectedIndex].orgnid;
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
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.isError = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  upadte() {
    const data = {
      moduleid: Number(this.moduleSelected),
      parentmenuid: Number(this.parentSelected),
      sequence_no: Number(this.sequence),
      menudesc: this.name,
      id: this.selectedId
    };
    if (!this.messageService.isBlankField(data)) {
      this.rest.updatemenu(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          this.messageService.sendAfterDelete(this.selectedId);
          this.dataLoaded = true;
          this.messageService.setRow({
            id: this.selectedId,
            moduleid:this.moduleSelected,
            parentmenuid:this.parentSelected,
            menudesc: this.name,
            sequence_no: this.sequence,
            mstorgnhirarchyid: this.orgSelected,
            Orgnname: this.orgSelectedName,
            modulename: this.moduleName,
            parentmenu: this.parentName,
            clientid: this.clientSelected,
            clientname: this.clientSelectedName,
          });
          this.modalReference.close();
          // this.getTableData();
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

  getModuleData(clientid, mstorgnhirarchyid, type) {
    const data = {
      'offset': 0,
      'limit': 100,
      'clientid': Number(clientid),
      'mstorgnhirarchyid': Number(mstorgnhirarchyid)
    };

    console.log(JSON.stringify(data)+"<<<<<<<<<<<<<<<<< MODULE DATA");

    this.rest.getModuleByOrgId(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, modulename: 'Select Module'});
        this.module = this.respObject.details;
        if(type === 'i'){
          this.moduleSelected = 0;
        } else {
          this.moduleSelected = this.moduleSelected1;
        }
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {

    });
  }

  onOrgChange(index: any) {
    this.orgName = this.organaisation[index].organizationname;
    // const data = {
    //   'offset': 0,
    //   'limit': 100,
    //   'clientid': Number(this.clientSelected),
    //   'mstorgnhirarchyid': Number(this.orgSelected)
    // };
    // this.moduleSelected = 0;

    // console.log(data+"<<<<<<<<<<<<<<<<<<");

    this.getModuleData(this.clientSelected, this.orgSelected, 'i');
  }


  openModal(content) {
    if (!this.add) {
      this.notifier.notify('error', 'You do not have add permission');
    } else {
      // this.isError = false;
      // this.clientSelected = 0;
      // this.parentSelected = 0;
      // this.moduleSelected = 0;
      // this.orgSelected = 0;
      // this.name = '';
      // this.sequence = '';
      this.isUpdate = false;
      this.reset();

      // this.navMenu = true;
      this.modalService.open(content, {size: 'sm'}).result.then((result) => {
      }, (reason) => {
      });
    }
  }


  save() {
    const data = {
      clientid: Number(this.clientSelected),
      moduleid: Number(this.moduleSelected),
      mstorgnhirarchyid: Number(this.orgSelected),
      parentmenuid: Number(this.parentSelected),
      menudesc: this.name,
      sequence_no: Number(this.sequence),
    };
    if (!this.messageService.isBlankField(data)) {
      // console.log('sequence type=====' + !isNaN(data.seq));
      if (!isNaN(data.sequence_no)) {
        this.rest.insertmenu(data).subscribe((res) => {
          this.respObject = res;
          if (this.respObject.success) {
            this.totalData = this.totalData + 1;
            this.messageService.setTotalData(this.totalData);
            const id = this.respObject.details;
            this.messageService.setRow({
              id: id,
              menudesc: this.name,
              moduleid:Number(this.moduleSelected),
              parentmenuid:Number(this.parentSelected),
              sequence_no: this.sequence,
              mstorgnhirarchyid: this.orgSelected,
              Orgnname: this.orgName,
              modulename: this.moduleName,
              parentmenu: this.parentName,
              clientid: this.clientSelected,
              clientname: this.clientName,
            });
            // this.getTableData();
            this.isError = false;
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
        this.notifier.notify('error', this.messageService.SEQUENCE_ERROR);
      }
    } else {
      this.isError = true;
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }
  }

  reset() {
    this.clientSelected = 0;
    this.moduleSelected = 0;
    this.parentSelected = 0;
    this.orgSelected = 0;
    this.moduleSelected1 = 0;
    this.parentSelected1 = 0;
    this.name = '';
    this.sequence = '';
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
    console.log('data for grid====' + JSON.stringify(data));
    this.rest.getmenudetails(data).subscribe((res) => {
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

  getParentMenu(moduleid, clientid, mstorgnhirarchyid, type) {
    const data = {
      moduleid: Number(moduleid),
      clientid: Number(clientid),
      mstorgnhirarchyid: Number(mstorgnhirarchyid),
      leafnode: 1
    };

    console.log(JSON.stringify(data)+"<<<<<<<<<<<<<<<<< PARENT DATA");

    this.rest.getmenubymodule(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.isError = false;
        this.respObject.details.unshift({id: 0, menudesc: 'Select Parent Item'});
        this.parents = this.respObject.details;
        if(type === 'i'){
          this.parentSelected = 0;
        } else {
          this.parentSelected = this.parentSelected1;
        }
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.errorMessage);
      }
    }, (err) => {
      this.isError = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onModuleChange(selectedIndex: any) {
    this.moduleName = this.module[selectedIndex].modulename;
    // let data;
    // if (type === 'a') {
    //   data = {
    //     moduleid: Number(this.moduleSelected),
    //     clientid: Number(this.clientSelected),
    //     mstorgnhirarchyid: Number(this.orgSelected),
    //     leafnode: 1
    //   };
    //   this.parentSelected =0;
    // } else {
    //   data = {
    //     moduleid: Number(this.moduleSelected1),
    //     clientid: Number(this.clientSelected1),
    //     mstorgnhirarchyid: Number(this.orgSelected1),
    //     leafnode: 1
    //   };
    // }

    this.getParentMenu(this.moduleSelected, this.clientSelected, this.orgSelected, 'u');
  }

  onPageSizeChange(value: any) {
    this.pageSize = value;
    this.getData({
      offset: this.messageService.offset, 
      limit: this.messageService.limit
    });
  }

  onParentChange(selectedIndex: any) {
    this.parentName = this.parents[selectedIndex].menudesc;
  }

  ngOnDestroy(): void {
    if (this.adminAuth) {
      this.adminAuth.unsubscribe();
    }
  }
}
