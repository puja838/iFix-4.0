import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {MessageService} from '../message.service';
import {Router} from '@angular/router';
import {NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Column, GridOption, AngularGridInstance, Formatters, Filters, Editors, OnEventArgs} from 'angular-slickgrid';
import {CustomInputEditor} from '../custom-inputEditor';
import {RestApiService} from '../rest-api.service';
import {NotifierService} from 'angular-notifier';
import {Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit, OnDestroy {

  displayed = true;
  selected: number;
  gridOptions: GridOption;
  roles: any[];

  show: boolean;
  rolename: string;
  roledesc: string;
  dataset: any[];
  totalData = 0;
  selectedTitles: any[];
  slideChecked = false;

  private respObject: any;
  displayData: any;

  add = false;
  del = false;
  edit = false;
  view = false;

  isError = false;
  errorMessage: string;
  nextOffset: number;
  previousOffset: number;
  pageSize: number;
  paginationType: string;
  page_no: number;
  totalPage: number;
  private userAuth: Subscription;
  private adminAuth: Subscription;
  private notifier: NotifierService;
  private clientId: number;
  private baseFlag: any;
  offset: number;
  adminRlCheck: boolean;
  adminRole: string;
  dataLoaded: boolean;

  isLoading = false;

  roleSelected: any;
  role: any;

  userName: string;


  orgnId: any;
  userid: any;


  @ViewChild('content1') private content1;
  private modalReference: NgbModalRef;
  selectedId: number;

  constructor(private _rest: RestApiService, private messageService: MessageService,
              private route: Router, private modalService: NgbModal, notifier: NotifierService) {
    this.notifier = notifier;
    this.messageService.getCellChangeData().subscribe(item => {
      switch (item.type) {
        case 'delete':
          if (this.baseFlag) {
            if (!this.del) {
              this.notifier.notify('error', 'You do not have delete permission');
            } else {
              if (confirm('Are you sure?')) {
                this.deleteItem(item);
              }
            }
          } else {
            if (!this.messageService.del) {
              this.notifier.notify('error', 'You do not have delete permission');
            } else {
              if (confirm('Are you sure?')) {
                this.deleteItem(item);
              }
            }
          }
          break;
      }
    });
    this.messageService.getUserAuth().subscribe(details => {
      // console.log(JSON.stringify(details));
      if (details.length > 0) {
        this.add = details[0].addFlag;
        this.del = details[0].deleteFlag;
        this.view = details[0].viewFlag;
        this.edit = details[0].editFlag;
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


  deleteItem(item) {
    console.log(this.clientId);
    this._rest.deleterole({clientid: this.clientId, mstorgnhirarchyid: this.orgnId, id: item.id}).subscribe((res) => {
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

  ngOnInit() {
    // this.add = true;
    // this.del = true;
    // this.edit = true;
    // this.view = true;
    this.adminRlCheck = false;
    this.dataLoaded = true;
    this.nextOffset = 0;
    this.previousOffset = 0;
    this.pageSize = this.messageService.pageSize;
    this.paginationType = 'next';
    this.page_no = 0;
    this.totalPage = 0;
    this.displayData = {
      pageName: 'Maintain Role ',
      openModalButton: 'Add Role',
      searchModalButton: 'Search',

      breadcrumb: 'Roles',
      folderName: 'All Role',
      tabName: 'Roles',
      exportBtn: 'Export to excel'

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
          this.isError = false;
          this.selectedId = args.dataContext.id;
          this.rolename = args.dataContext.rolename;
          this.roledesc = args.dataContext.rolename;
          if ((Number(args.dataContext.adminflag) === 0)) {
            this.adminRlCheck = false;
          } else {
            this.adminRlCheck = true;

          }
          this.modalReference = this.modalService.open(this.content1, {});
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },
      {
        id: 'rolename', name: 'Role Name', field: 'rolename', sortable: true, filterable: true
      },
      {
        id: 'roledesc', name: 'Role Description', field: 'rolename', sortable: true, filterable: true
      },
      {
        id: 'adminRole', name: 'Admin Role', field: 'adminflag', sortable: true, formatter: Formatters.checkmark, filter: {
          collection: [{value: '', label: 'All'}, {value: true, label: 'True'}, {value: false, label: 'False'}],
          model: Filters.singleSelect,

          filterOptions: {
            autoDropWidth: true
          },
        }, minWidth: 40, filterable: true
      }

    ];
    this.messageService.setColumnDefinitions(columnDefinitions);
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.baseFlag = this.messageService.baseFlag;
      this.orgnId = this.messageService.orgnId;
    } else {
      this.userAuth = this.messageService.getClientUserAuth().subscribe(auth => {
        this.view = auth[0].viewFlag;
        this.add = auth[0].addFlag;
        this.edit = auth[0].editFlag;
        this.del = auth[0].deleteFlag;
        this.clientId = auth[0].clientid;
        this.baseFlag = auth[0].baseFlag;
        this.orgnId = auth[0].mstorgnhirarchyid;
      });
    }
  }

  changeRouting(path: string) {
    this.messageService.changeRouting(path);
  }


  openModal(content) {
    //if (this.baseFlag) {
    if (!this.add) {
      this.notifier.notify('error', 'You do not have add permission');
    } else {
      this.isError = false;
      this.rolename = '';
      this.roledesc = '';
      this.adminRlCheck = false;
      this.modalService.open(content, {size: 'sm'}).result.then((result) => {
      }, (reason) => {

      });
    }
    // } else {
    //     if (!this.messageService.add) {
    //         this.notifier.notify('error', 'You do not have add permission');
    //     } else {
    //         this.rolename = '';
    //         this.roledesc = '';
    //         this.modalService.open(content, {size: 'sm'}).result.then((result) => {
    //         }, (reason) => {

    //         });
    //     }
    // }
  }

  update() {
    let adminflag = 0;
    if (this.adminRlCheck) {
      adminflag = 1;
    }


    const data = {
      id: this.selectedId,
      clientid: this.clientId,
      mstorgnhirarchyid: this.orgnId,
      rolename: this.rolename.trim(),
      roledesc: this.roledesc.trim(),
      userid: this.userid
    };
    // console.log('AAAAAAAAAA===' + JSON.stringify(data) + "===" + this.adminRlCheck);
    if (!this.messageService.isBlankField(data)) {

      data['adminflag'] = adminflag;
      this._rest.updaterole(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          this.messageService.sendAfterDelete(this.selectedId);
          this.messageService.setRow({
            id: this.selectedId,
            rolename: this.rolename.trim(),
            roledesc: this.roledesc.trim(),
            adminflag: adminflag
          });
          this.dataLoaded = true;

        } else {
          this.isError = true;
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.isError = true;
        this.notifier.notify('error', err);
      });
    } else {
      this.isError = true;
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }
  }


  save() {
    let adminflag = 0;
    if (this.adminRlCheck) {
      adminflag = 1;
    }


    this.adminRole = String(this.adminRlCheck);
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: this.orgnId,
      rolename: this.rolename.trim(),
      roledesc: this.roledesc.trim(),
      userid: this.userid
    };
    // console.log('AAAAAAAAAA===' + JSON.stringify(data) + "===" + this.adminRlCheck);
    if (!this.messageService.isBlankField(data)) {

      data['adminflag'] = adminflag;
      this._rest.createrole(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          const id = this.respObject.details;
          this.messageService.setRow({id: id, rolename: this.rolename.trim(), roledesc: this.roledesc.trim(), adminflag: adminflag});
          this.totalData = this.totalData + 1;
          this.messageService.setTotalData(this.totalData);
          this.isError = false;
          this.rolename = '';
          this.roledesc = '';
          this.slideChecked = false;
          this.adminRlCheck = false;
        } else {
          this.isError = true;
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.isError = true;
        this.notifier.notify('error', err);
      });
    } else {
      this.isError = true;
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }
  }


  getTableData() {
    this.getData({
      offset: this.messageService.offset, 
      limit: this.messageService.limit
    });
  }

  getData(paginationObj) {
    const offset = paginationObj.offset;
    const limit = paginationObj.limit;
    this.dataLoaded = false;
    const data = {
      'offset': offset,
      'limit': limit,
      'clientid': Number(this.clientId),
      'mstorgnhirarchyid': Number(this.orgnId)
    };
    this._rest.getrole(data).subscribe((res) => {
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


  ngOnDestroy(): void {
    if (this.userAuth) {
      this.userAuth.unsubscribe();
    }
    if (this.adminAuth) {
      this.adminAuth.unsubscribe();
    }
  }

  onOrgChange(selectedIndex: any) {

  }

}
