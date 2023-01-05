import {Component, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {RestApiService} from '../rest-api.service';
import {MessageService} from '../message.service';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {Filters, Formatters, OnEventArgs} from 'angular-slickgrid';

@Component({
  selector: 'app-group-holiday',
  templateUrl: './group-holiday.component.html',
  styleUrls: ['./group-holiday.component.css']
})
export class GroupHolidayComponent implements OnInit {

  displayed = true;
  totalData = 0;
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
  totalPage: number;
  selectedId: number;
  private baseFlag: any;
  private adminAuth: Subscription;
  @ViewChild('content') private content;
  private modalReference: NgbModalRef;
  organizationId = '';
  holiday: any;
  organizationList = [];
  isPlanned: boolean;
  private orgId: number;
  startTime: any;
  endTime: any;
  private orgName: string;
  isEdit: boolean;
  groups = [];
  groupid: number;
  private grpName: string;
  private gid: number;
  min: any;
  isUpdate: boolean;

  constructor(private rest: RestApiService, private messageService: MessageService,
              private route: Router, private modalService: NgbModal, private notifier: NotifierService) {
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
              this.rest.deleteclientsupportgrpholiday({id: item.id}).subscribe((res) => {
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
    // this.messageService.getSelectedItemData().subscribe(selectedTitles => {
    //   if (selectedTitles.length > 0) {
    //     this.show = true;
    //     this.selected = selectedTitles.length;
    //   } else {
    //     this.show = false;
    //   }
    // });
  }

  ngOnInit(): void {
    this.totalPage = 0;
    this.add = true;
    this.del = true;
    this.edit = true;
    this.view = true;
    this.dataLoaded = true;

    this.pageSize = this.messageService.pageSize;
    this.displayData = {
      pageName: 'Add Group Holiday',
      openModalButton: 'Add Group Holiday',
      searchModalButton: 'Search',
      breadcrumb: 'Query',
      folderName: 'Add Query',
      tabName: 'Group Holiday'
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
          this.isUpdate = true;
          this.isError = false;
          this.selectedId = args.dataContext.id;
          this.organizationId = args.dataContext.mstorgnhirarchyid;
          this.getGroupid('u');
          this.gid = args.dataContext.mstclientsupportgroupid;
          this.holiday = new Date(args.dataContext.dateofholiday);
          const plannedornot = args.dataContext.plannedornot;
          this.isPlanned = Number(plannedornot) === 1 ? true : false;
          const today = this.messageService.dateConverter(new Date(), 1);
          this.startTime = new Date(today + ' ' + args.dataContext.starttime);
          this.endTime = new Date(today + ' ' + args.dataContext.endtime);
          this.isEdit = true;
          this.modalReference = this.modalService.open(this.content, {});
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },
      {
        id: 'orgn', name: 'Organization', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'date', name: 'Date', field: 'holiday', sortable: true, filterable: true
      },
      {
        id: 'plannedornot', name: 'Is Planned', field: 'plannedornot', sortable: true, filterable: true, formatter: Formatters.checkmark,
        filter: {
          collection: [{value: '', label: 'All'}, {value: true, label: 'True'}, {value: false, label: 'False'}],
          model: Filters.singleSelect,

          filterOptions: {
            autoDropWidth: true
          },
        }, minWidth: 40
      },
      {
        id: 'starttime', name: 'Start Time', field: 'starttime', sortable: true, filterable: true
      },
      {
        id: 'endtime', name: 'End Time', field: 'endtime', sortable: true, filterable: true
      },
      {
        id: 'supportgroupname', name: 'Group Name', field: 'supportgroupname', sortable: true, filterable: true
      }
    ];
    this.messageService.setColumnDefinitions(columnDefinitions);
    // this.onPageLoad();
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.baseFlag = this.messageService.baseFlag;
      this.orgId = this.messageService.orgnId;
      this.onPageLoad();
    } else {
      this.adminAuth = this.messageService.getClientUserAuth().subscribe(auth => {
        // this.view = auth[0].viewFlag;
        // this.add = auth[0].addFlag;
        // this.edit = auth[0].editFlag;
        // this.del = auth[0].deleteFlag;
        this.clientId = auth[0].clientid;
        this.baseFlag = auth[0].baseFlag;
        this.orgId = auth[0].mstorgnhirarchyid;
        this.onPageLoad();
      });
    }
    const todayDate = new Date();
    const todayMonth = todayDate.getMonth();
    const todayDay = todayDate.getDate();
    const todayYear = todayDate.getFullYear();
    this.min = new Date(todayYear, todayMonth, todayDay);
  }

  onPageLoad() {
    this.getorganizationclientwise();
  }

  openModal(content) {
    if (!this.add) {
      this.notifier.notify('error', 'You do not have add permission');
    } else {
      this.isError = false;
      this.isEdit = false;
      this.resetValues();
      this.isUpdate = false;
      this.modalService.open(content, {size: 'sm'}).result.then((result) => {
      }, (reason) => {

      });
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
      clientid: this.clientId,
      mstorgnhirarchyid: this.orgId,
      offset: offset,
      limit: limit
    };
    console.log(data);
    this.rest.getclientsupportgrpholiday(data).subscribe((res) => {
      this.respObject = res;
      // console.log('>>>>>>>>>>> ', JSON.stringify(res));
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
      for (let i = 0; i < respObject.details.values.length; i++) {
        // respObject.details.values[i].dateofholiday = this.messageService.dateConverter(new Date(respObject.details.values[i].dateofholiday), 3);
        respObject.details.values[i].holiday =
          this.messageService.dateConverter(new Date(respObject.details.values[i].dateofholiday), 3);
        respObject.details.values[i].plannedornot = (respObject.details.values[i].plannedornot === 1) ? true : false;
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

  resetValues() {
    this.organizationId = '';
    this.isPlanned = true;
    this.holiday = '';
    this.endTime = '';
    this.startTime = '';
    this.groupid = 0;
  }

  save() {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      dateofholiday: this.messageService.dateConverter(this.holiday, 4),
      // starttime: this.messageService.dateConverter(this.startTime, 5),
      //endtime: this.messageService.dateConverter(this.endTime, 5),
      mstclientsupportgroupid: Number(this.groupid)
    };
    console.log('data=============' + JSON.stringify(data));
    if (!this.messageService.isBlankField(data)) {
      data['endtime']= this.messageService.dateConverter(this.endTime, 6),
      data['starttime']= this.messageService.dateConverter(this.startTime, 6),
      data['starttimeinteger']= this.messageService.dateToSec(this.startTime),
      data['endtimeinteger']= this.messageService.dateToSec(this.endTime),
      data['plannedornot'] = this.isPlanned === true ? 1 : 0;
      data['dayofweekid'] = new Date(this.holiday).getDay();
      if (this.endTime > this.startTime) {
        this.rest.addclientsupportgrpholiday(data).subscribe((res) => {
          this.respObject = res;
          if (this.respObject.success) {
            const id = this.respObject.details;
        //     this.messageService.setRow({
        //       id: id,
        //       mstorgnhirarchyname: this.orgName,
        //       holiday: this.messageService.dateConverter(new Date(this.holiday), 3),
        //       plannedornot: this.isPlanned,
        //       starttime: this.messageService.dateConverter(this.startTime, 5),
        //       endtime: this.messageService.dateConverter(this.endTime, 5),
        //       supportgroupname: this.grpName,
        //       mstorgnhirarchyid: this.organizationId,
        //       mstclientsupportgroupid: this.groupid
        //     });
            this.totalData = this.totalData + 1;
            this.messageService.setTotalData(this.totalData);
            this.isError = false;
            this.resetValues();
            this.getTableData();
            this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
          } else {
            this.notifier.notify('error', this.respObject.message);
          }
        }, (err) => {
          this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
      } else {
        this.notifier.notify('error', this.messageService.END_TIME_GREATERTHAN_START_TIME);
      }
    } else {
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }
  }

  update() {
    const data = {
      id: this.selectedId,
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      dateofholiday: this.messageService.dateConverter(this.holiday, 4),
      // starttime: this.messageService.dateConverter(this.startTime, 5),
      // endtime: this.messageService.dateConverter(this.endTime, 5),
      // starttimeinteger: this.messageService.dateToSec(this.startTime),
      // endtimeinteger: this.messageService.dateToSec(this.endTime),
      mstclientsupportgroupid: Number(this.groupid)
    };

    if (!this.messageService.isBlankField(data)) {
      data['endtime']= this.messageService.dateConverter(this.endTime, 6),
      data['starttime']= this.messageService.dateConverter(this.startTime, 6),
      data['starttimeinteger']= this.messageService.dateToSec(this.startTime),
      data['endtimeinteger']= this.messageService.dateToSec(this.endTime),
      data['plannedornot'] = this.isPlanned === true ? 1 : 0;
      data['dayofweekid'] = new Date(this.holiday).getDay();
      if (this.endTime > this.startTime) {
        this.rest.updateclientsupportgrpholiday(data).subscribe((res) => {
          this.respObject = res;
          if (this.respObject.success) {
            this.isError = false;
            // this.messageService.setRow({
            //   id: this.id,
            //   mstorgnhirarchyname: this.orgName,
            //   dateofholiday: this.messageService.dateConverter(this.holiday, 4),
            //   plannedornot: this.isPlanned === true ? 1 : 0,
            //   starttime: this.messageService.dateConverter(this.startTime, 5),
            //   endtime: this.messageService.dateConverter(this.endTime, 5)
            // });
            this.notifier.notify('success', this.messageService.EDIT_SUCCESS);
            this.modalReference.close();
            this.getTableData();
          } else {
            this.notifier.notify('error', this.respObject.message);
          }
        }, (err) => {
          this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
      } else {
        this.notifier.notify('error', this.messageService.END_TIME_GREATERTHAN_START_TIME);
      }
    } else {
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }
  }

  getorganizationclientwise() {
    const data = {
      clientid: Number(this.clientId) , 
      mstorgnhirarchyid: Number(this.orgId)
    };
    this.rest.getorganizationclientwisenew(data).subscribe((res: any) => {
      if (res.success) {
        this.organizationList = res.details;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      console.log(err);
    });
  }

  onOrganizationChange(index) {
    this.orgName = this.organizationList[index - 1].organizationname;
    this.getGroupid('i');
  }

  getGroupid(type) {
    this.rest.getgroupbyorgid({clientid: this.clientId, mstorgnhirarchyid: Number(this.organizationId)}).subscribe((res: any) => {
      if (res.success) {
        res.details.unshift({id: 0, supportgroupname: 'Enter Support Group Name'});
        this.groups = res.details;
        if (type === 'i') {
          this.groupid = 0;
        } else {
          this.groupid = this.gid;
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      console.log(err);
    });
  }

  onGroupChange(selectedIndex: any) {
    this.grpName = this.groups[selectedIndex].supportgroupname;
  }
}
