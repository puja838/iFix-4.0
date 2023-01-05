import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MessageService} from '../message.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {CustomInputEditor} from '../custom-inputEditor';
import {RestApiService} from '../rest-api.service';
import {Formatters, OnEventArgs} from 'angular-slickgrid';
import {NotifierService} from 'angular-notifier';
import {Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.css']
})
export class ModuleComponent implements OnInit, OnDestroy {

  displayed = true;
  moduleName: string;
  description: string;
  totalData = 0;
  show: boolean;
  selected: number;
  respObject: any;
  add: boolean;
  del: boolean;
  edit: boolean;
  view: boolean;
  displayData: any;
  isError = false;
  errorMessage: string;
  pageSize: number;
  clientId: number;
  offset: number;
  dataLoaded: boolean;
  isLoading = false;
  moduleSelected: any;
  modules: any;
  des: string;
  totalPage: number;
  selectedId: number;
  orgnId: number;
  private baseFlag: any;
  private adminAuth: Subscription;
  private notifier: NotifierService;
  @ViewChild('content1') private content1;
  private modalReference: NgbModalRef;

  constructor(private _rest: RestApiService, private messageService: MessageService,
              private route: Router, private modalService: NgbModal, notifier: NotifierService) {
    this.notifier = notifier;
    this.messageService.getCellChangeData().subscribe(item => {
      // console.log(item);
      switch (item.type) {
        case 'change':
          // console.log('changed');
          if (!this.edit) {
            this.notifier.notify('error', 'You do not have edit permission');
          } else {
            if (confirm('Are you sure?')) {

            }
          }
          break;
        case 'delete':
          // console.log('deleted');
          if (!this.del) {
            this.notifier.notify('error', 'You do not have delete permission');
          } else {
            if (confirm('Are you sure?')) {
              console.log(JSON.stringify(item));
              this._rest.deleteModule({id: item.id}).subscribe((res) => {
                this.respObject = res;
                // console.log(JSON.stringify(this.respObject));
                if (this.respObject.success) {
                  this.messageService.sendAfterDelete(item.id);
                  this.totalData = this.totalData - 1;
                  this.messageService.setTotalData(this.totalData);
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
    this.messageService.getSelectedItemData().subscribe(selectedTitles => {
      if (selectedTitles.length > 0) {
        this.show = true;
        this.selected = selectedTitles.length;
      } else {
        this.show = false;
      }
    });
    // this.messageService.getUserAuth().subscribe(details => {
    //   console.log(JSON.stringify(details));
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
  }

  ngOnInit() {
    this.totalPage = 0;
    this.add = true;
    this.del = true;
    this.edit = true;
    this.view = true;
    this.dataLoaded = true;
    this.pageSize = this.messageService.pageSize;
    this.displayData = {
      pageName: 'Maintain Modules',
      openModalButton: 'Add Module',
      searchModalButton: 'Search',
      breadcrumb: 'Modules',
      folderName: 'All Modules',
      tabName: 'Modules'
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
          console.log(args.dataContext);
          this.isError = false;
          this.selectedId = args.dataContext.id;
          this.moduleName = args.dataContext.modulename;
          this.description = args.dataContext.moduledescription;
          this.modalReference = this.modalService.open(this.content1, {});
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },
      {
        id: 'name', name: 'Module Name', field: 'modulename', sortable: true, filterable: true

      },
      {
        id: 'desc', name: 'Description', field: 'moduledescription', sortable: true, filterable: true
      }
    ];
    this.messageService.setColumnDefinitions(columnDefinitions);
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.orgnId = this.messageService.orgnId;
      this.baseFlag = this.messageService.baseFlag;
      this.onPageLoad();
    } else {
      this.adminAuth = this.messageService.getClientUserAuth().subscribe(details => {
        if (details.length > 0) {
          // this.add = details[0].addFlag;
          // this.del = details[0].deleteFlag;
          // this.view = details[0].viewFlag;
          // this.edit = details[0].editFlag;
          this.clientId = details[0].clientid;
          this.orgnId = details[0].mstorgnhirarchyid;
          this.baseFlag = details[0].baseFlag;
          this.onPageLoad();
        }
      });
    }
  }

  onPageLoad() {
    // this.getTableData();
  }

  openModal(content) {
    if (!this.add) {
      this.notifier.notify('error', 'You do not have add permission');
    } else {
      this.isError = false;
      this.moduleName = '';
      this.description = '';
      // this.notifier.notify('success', 'Module added successfully');
      this.modalService.open(content, {size: 'sm'}).result.then((result) => {
      }, (reason) => {

      });
    }
  }


  getDetails() {
    for (let i = 0; i < this.modules.length; i++) {
      if (this.modules[i].MODULENAME === this.moduleSelected) {

        this.des = this.modules[i].MODDESCRIPTION;
      }
    }
  }


  changeRouting(path: string) {
    this.messageService.changeRouting(path);
  }

  update() {
    const data = {
      id: this.selectedId,
      modulename: this.moduleName.trim(),
      moduledescription: this.description.trim()
    };
    if (!this.messageService.isBlankField(data)) {
      this.modalReference.close();
      this.dataLoaded = false;
      this._rest.updateModule(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          this.messageService.sendAfterDelete(this.selectedId);
          this.messageService.setRow({id: this.selectedId, modulename: this.moduleName, moduledescription: this.description});
          this.dataLoaded = true;

          // this.getTableData();
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
      modulename: this.moduleName.trim(),
      moduledescription: this.description.trim()
    };
    if (!this.messageService.isBlankField(data)) {
      this._rest.insertModule(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          const id = this.respObject.details;
          this.messageService.setRow({id: id, modulename: this.moduleName, moduledescription: this.description});
          this.totalData = this.totalData + 1;
          this.messageService.setTotalData(this.totalData);
          this.isError = false;
          this.moduleName = '';
          this.description = '';
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
    this._rest.getAllModules(data).subscribe((res) => {
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

}
