import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {MessageService} from '../message.service';
import {NotifierService} from 'angular-notifier';
import {RestApiService} from '../rest-api.service';
import {Router} from '@angular/router';
import {Formatters, OnEventArgs} from 'angular-slickgrid';
import {NgbDateStruct, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {CustomInputEditor} from '../custom-inputEditor';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-ticket-type',
  templateUrl: './ticket-type.component.html',
  styleUrls: ['./ticket-type.component.css']
})
export class TicketTypeComponent implements OnInit {
  show: boolean;
  dataset: any[];
  totalData: number;
  respObject: any;
  attrVal: string;
  attrDesc: string;
  displayData: any;
  add: boolean;
  del: boolean;
  edit: boolean;
  view: boolean;
  isError = false;
  errorMessage: string;
  collectionSize: number;
  pageSize: number;
  private baseFlag: any;
  private adminAuth: Subscription;
  private notifier: NotifierService;
  private clientId: number;
  offset: number;
  dataLoaded: boolean;
  reportType = [];
  reportTypeSelected: any;
  orgnId: any;
  userid: any;
  @ViewChild('content1') private content1;
  private modalReference: NgbModalRef;
  selectedId: any;


  constructor(private _rest: RestApiService, private messageService: MessageService, private route: Router,
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
              this._rest.deleteRecordDiff({id: item.id}).subscribe((res) => {
                this.respObject = res;
                if (this.respObject.success) {
                  this.totalData = this.totalData - 1;
                  this.messageService.setTotalData(this.totalData);
                  this.messageService.sendAfterDelete(item.id);
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
// // console.log(JSON.stringify(details));
// if (details.length > 0) {
// this.add = details[0].addFlag;
// this.del = details[0].deleteFlag;
// this.view = details[0].viewFlag;
// this.edit = details[0].editFlag;
// } else {
// this.add = false;
// this.del = false;
// this.view = false;
// this.edit = false;
// }
// });
  }


  ngOnInit() {
    this.add = true;
    this.del = true;
    this.edit = true;
    this.view = true;
    this.dataLoaded = false;
    this.pageSize = this.messageService.pageSize;
    this.displayData = {
      pageName: 'Maintain Ticket Type',
      openModalButton: 'Add Ticket Type',
      breadcrumb: 'TicketType',
      folderName: 'All Ticket Types',
      tabName: 'Ticket Type'
    };
    const columnDefinitions = [
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
          this.attrVal = args.dataContext.name;
          this.modalReference = this.modalService.open(this.content1, {});
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },
      {
        id: 'user', name: 'Name', field: 'name', sortable: true, filterable: true
      },

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

  }

  changeRouting(path: string) {
    this.messageService.changeRouting(path);
  }

  openModal(content) {
    if (!this.add) {
      this.notifier.notify('error', 'You do not have add permission');
    } else {
// this.notifier.notify('error', 'New Ticket Type can not be added');
      this.isError = false;
      this.reportTypeSelected = 2;
      this.attrVal = '';

      this.modalService.open(content, {size: 'sm'}).result.then((result) => {
      }, (reason) => {
      });
    }
  }


  update() {
    const data = {
      id: this.selectedId,
      name: this.attrVal.trim()
    };

    if (!this.messageService.isBlankField(data)) {
      this._rest.updateRecordDiff(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          this.getTableData();
          this.modalReference.close();
        } else {
          this.isError = true;
          this.errorMessage = this.respObject.message;
        }
      }, (err) => {
        this.isError = true;
        this.errorMessage = this.messageService.SERVER_ERROR;
      });
    } else {
      this.isError = true;
      this.errorMessage = this.messageService.BLANK_ERROR_MESSAGE;
    }
  }


  save() {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: this.orgnId,
      recorddifftypeid: this.reportTypeSelected,
      name: this.attrVal.trim()
    };

    if (!this.messageService.isBlankField(data)) {
      data['parentid'] = 0;
      this._rest.insertRecordDiff(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          this.getTableData();
          this.attrVal = '';

        } else {
          this.isError = true;
          this.errorMessage = this.respObject.message;
        }
      }, (err) => {
        this.isError = true;
        this.errorMessage = this.messageService.SERVER_ERROR;
      });
    } else {
      this.isError = true;
      this.errorMessage = this.messageService.BLANK_ERROR_MESSAGE;
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

  // isEmpty(obj) {
  //   for (const key in obj) {
  //     if (obj.hasOwnProperty(key)) {
  //       return false;
  //     }
  //   }
  //   return true;
  // }

  getData(paginationObj) {
    this._rest.getRecordDiffType().subscribe((res1) => {
      //   this.respObject = res1;
      this.respObject = {
        'success': true,
        'message': '',
        'details': [
          {
            'id': 1,
            'typename': 'Category'
          },
          {
            'id': 2,
            'typename': 'TicketType'
          },
          {
            'id': 3,
            'typename': 'Status'
          },
          {
            'id': 4,
            'typename': 'activity'
          },
          {
            'id': 5,
            'typename': 'priority'
          }
        ]
      };
      if (this.respObject.success) {
        this.reportType = this.respObject.details;
        this.reportTypeSelected = 2;
        // this.getTableData();
        const offset = paginationObj.offset;
        const limit = paginationObj.limit;
        this.dataLoaded = false;
        const data = {
          'offset': offset,
          'limit': limit,
          'clientid': this.clientId,
          'mstorgnhirarchyid': this.orgnId,
          'recorddifftypeid': this.reportTypeSelected

        };
        this._rest.getAllRecordDiff(data).subscribe((res) => {
          this.respObject = res;
          this.executeResponse(this.respObject, offset);
        }, (err) => {
          this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
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
