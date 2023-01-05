import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { RestApiService } from '../rest-api.service';
import { MessageService } from '../message.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Formatters, OnEventArgs } from 'angular-slickgrid';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { flatten } from '@angular/compiler'

@Component({
  selector: 'app-open-ticket-moniter',
  templateUrl: './open-ticket-moniter.component.html',
  styleUrls: ['./open-ticket-moniter.component.css']
})
export class OpenTicketMoniterComponent implements OnInit {
  displayed = true;
  totalData = 0;
  show: boolean;
  selected: number;
  respObject: any;
  clientSelected = 0;
  displayData: any;
  add = false;
  del = false;
  edit = false;
  view = false;
  isError = false;
  errorMessage: string;
  // private notifier: NotifierService;
  baseFlag: boolean;

  pageSize: number;
  private userAuth: Subscription;
  dataLoaded: boolean;
  isLoading = false;
  isLoading1 = false;
  organization = [];
  orgSelected: number;
  orgName: string;
  clientId: number;
  orgId: number;
  clientSelectedName: string;
  orgSelectedName: string;
  @ViewChild('content') private content;
  private modalReference: NgbModalRef;
  selectedId: number;

  durationList = [{name:'5 Min', value: '5'},{name:'30 Min',value:'30'}, {name:'1 Hour',value:'60'}, {name:'2 Hour',value:'120'}]
  openTicketDue = 0;
  TimeSend: any;
  pegObj: any;

  constructor(private rest: RestApiService, private messageService: MessageService,
    private route: Router, private modalService: NgbModal, private notifier: NotifierService) {
    this.messageService.getCellChangeData().subscribe(item => {
      switch (item.type) {
        case 'delete':
          // console.log('deleted');
          if (!this.del) {
            this.notifier.notify('error', this.messageService.DELETE_PERMISSION);
          } else {
            if (confirm('Are you sure?')) {
              this.rest.deleteopenticket({ id: item.id, mapid: item.mapid }).subscribe((res) => {
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
    });;

  }
  ngOnInit(): void {
    //console.log("COLOR",this.colordata);
    this.dataLoaded = true;
    this.openTicketDue = 0
    this.pageSize = this.messageService.pageSize;
    this.displayData = {
      pageName: 'Maintain Open Tickets',
      openModalButton: 'Find Open Tickets',
      breadcrumb: 'Find Open Tickets Monitor',
      folderName: 'Find Open Tickets Monitor',
      tabName: 'Find Open Tickets Monitor',
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
      //     console.log(JSON.stringify(args.dataContext));
      //     this.isError = false;
      //     this.reset();
      //     this.selectedId = args.dataContext.id;
      //     //this.clientId = args.dataContext.clientid;

      //     this.modalReference = this.modalService.open(this.content);
      //     this.modalReference.result.then((result) => {
      //     }, (reason) => {

      //     });
      //   }
      // },
      {
        id: 'Reccordcode', name: 'Ticket ID ', field: 'Reccordcode', sortable: true, filterable: true
      },
      {
        id: 'Groupname', name: 'Group Name', field: 'Groupname', sortable: true, filterable: true
      },
      {
        id: 'Username', name: 'User Name', field: 'Username', sortable: true, filterable: true
      }
    ];
    this.messageService.setColumnDefinitions(columnDefinitions);
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.orgId = this.messageService.orgnId;
      this.baseFlag = this.messageService.baseFlag;
      // this.edit = this.messageService.edit;
      // this.del = this.messageService.del;
      if (this.baseFlag) {
        this.edit = true;
        this.del = true;
      } else {
        this.edit = this.messageService.edit;
        this.del = this.messageService.del;
      }
      this.onPageLoad();
    } else {
      this.userAuth = this.messageService.getClientUserAuth().subscribe(auth => {
        // this.view = auth[0].viewFlag;
        // this.add = auth[0].addFlag;
        // this.edit = auth[0].editFlag;
        // this.del = auth[0].deleteFlag;
        if (this.baseFlag) {
          this.edit = true;
          this.del = true;
        } else {
          this.del = auth[0].deleteFlag;
          this.edit = auth[0].editFlag;
        }
        this.clientId = auth[0].clientid;
        this.orgId = auth[0].mstorgnhirarchyid;
        this.baseFlag = auth[0].baseFlag;
        // console.log('auth1===' + JSON.stringify(auth));
        this.onPageLoad();
      });
    }
  }
  onPageLoad() {

  }

  openModal(content) {
    //this.clientSelected = 0;
    this.reset();

    this.modalReference = this.modalService.open(this.content, {});
    this.modalReference.result.then((result) => {
    }, (reason) => {

    });
  }


  onDurationhange() {
    let nowDate = new Date()
    let timeDeu
    timeDeu = nowDate.setMinutes(nowDate.getMinutes() - this.openTicketDue);
    this.TimeSend = new Date(timeDeu)
  }

  reset() {
    this.openTicketDue = 0
    this.TimeSend = ''
  }

  save() {
    const data = {
      "opendate": String(Math.floor(this.TimeSend.getTime() / 1000)),
      "limit": this.messageService.limit,
    }
    this.dataLoaded = false;
    if (!this.messageService.isBlankField(data)) {
      data["offset"] = this.messageService.offset
      this.rest.getallopenticket(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.dataLoaded = true;

          if (this.respObject.details.values.length !== 0) {
            this.executeResponse(this.respObject, this.messageService.offset);
            this.notifier.notify('success', "Data fetched successfully");
            this.isError = false;
            this.modalReference.close();
          }
          else {
            this.notifier.notify('error', "No Data to Display");
          }
        } else {
          this.dataLoaded = true;
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.dataLoaded = true;
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    }
    else {
      this.dataLoaded = true;
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
    this.pegObj = paginationObj
    const offset = paginationObj.offset;
    const limit = paginationObj.limit;
    // this.dataLoaded = false;
    const data = {
      offset: offset,
      limit: limit,
      clientid: this.clientId,
      mstorgnhirarchyid: this.orgId
    };
    // console.log(data);
    // this.rest.getorgtoolscode(data).subscribe((res) => {
    //   this.respObject = res;
    //   // console.log('>>>>>>>>>>> ', JSON.stringify(res));
    //   this.executeResponse(this.respObject, offset);
    // }, (err) => {
    //   this.notifier.notify('error', this.messageService.SERVER_ERROR);
    // });
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
    if (this.userAuth) {
      this.userAuth.unsubscribe();
    }
  }

}
