import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {RestApiService} from '../rest-api.service';
import {Filters, Formatters, OnEventArgs} from 'angular-slickgrid';
import {MessageService} from '../message.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {

  displayed = true;
  totalData = 0;
  show: boolean;
  selected: number;
  respObject: any;
  clientSelected: number;
  displayData: any;
  add = false;
  del = false;
  edit = false;
  view = false;
  isError = false;
  errorMessage: string;
  // private notifier: NotifierService;
  private baseFlag: any;
  collectionSize: number;
  pageSize: number;
  private userAuth: Subscription;
  dataLoaded: boolean;
  isLoading = false;
  organization = [];
  orgSelected: number;
  orgSelected1: number;
  orgName: string;
  clientId: number;
  orgId: number;
  recordType: string;
  recordTypeIds = [];
  recordTypeNames = [];
  recordTypeName: string;
  recordTypeIdSelected: number;
  recordTypeNameSelected: number;
  clientSelectedName: string;
  orgSelectedName: string;
  recordtermvalue: string;
  organizationName: string;
  selectedId: number;
  recordTypeIdSelected1: number;
  selectedRecordTypeId: number;
  recordTypeNameSelected1: number;
  selectedRecordTypeName: number;
  updateFlag = 0;
  orgnId: number;
  isMandatory: boolean;
  isMandatory1: boolean;
  //@ViewChild('content') private content;
  @ViewChild('content1') private content1;
  private modalReference: NgbModalRef;
  propLevels = [];
  levelid: number;
  grpSelected = [];
  grpSelected1 = '';
  groups = [];
  seqNo: any;
  grpName: string;
  isEdit: boolean;
  startTime: any;
  endTime: any;
  desc: string;
  colordata: any;
  setcolor: any;
  fontsize: any;
  displayfont: any;

  constructor(private rest: RestApiService, private messageService: MessageService,
              private route: Router, private modalService: NgbModal, private notifier: NotifierService) {
    this.messageService.getCellChangeData().subscribe(item => {
      // console.log(item);
      // this.notifier = notifier;
      switch (item.type) {
        case 'delete':
          // console.log('deleted');
          if (!this.del) {
            this.notifier.notify('error', this.messageService.DELETE_PERMISSION);
          } else {
            if (confirm('Are you sure?')) {
              this.rest.deletebanner({id: item.id}).subscribe((res) => {
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
  }


  ngOnInit(): void {
    // this.seqNo>0
    this.colordata = this.messageService.colors;
    //console.log("COLOR",this.colordata);
    this.dataLoaded = true;
    this.pageSize = this.messageService.pageSize;
    this.displayData = {
      pageName: 'Banner',
      openModalButton: 'Add Banner',
      breadcrumb: 'Banner',
      folderName: 'Banner',
      tabName: 'Banner',
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
          this.reset();
          //console.log("\n ARGS DATA CONTEXT  :: "+JSON.stringify(args.dataContext));
          this.selectedId = args.dataContext.id;
          this.clientSelected = args.dataContext.clientid;
          this.orgName = args.dataContext.Mstorgnhirarchyname;
          this.orgSelected1 = args.dataContext.mstorgnhirarchyid;
          this.grpSelected = args.dataContext.groupid;
          this.grpName = args.dataContext.Groupname;
          this.startTime = new Date(args.dataContext.ActualStarttime);
          this.endTime = new Date(args.dataContext.ActualEndtime);
          this.seqNo = args.dataContext.Sequence;
          this.desc = args.dataContext.message;
          this.setcolor = args.dataContext.color;
          this.fontsize = args.dataContext.size;
          this.getOrganization('u', this.clientId, this.orgnId);
          this.getGroupData('u', this.orgSelected1);
          this.isEdit = true;
          this.modalReference = this.modalService.open(this.content1, {});
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },
      {
        id: 'organization', name: 'Organization ', field: 'Mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'Groupname', name: 'Support Group Name', field: 'Groupname', sortable: true, filterable: true
      },
      {
        id: 'starttime', name: 'Start Time', field: 'ActualStarttime', sortable: true, filterable: true
      },
      {
        id: 'endtime', name: 'End Time', field: 'ActualEndtime', sortable: true, filterable: true
      },
      {
        id: 'sequence', name: 'Sequence', field: 'Sequence', sortable: true, filterable: true
      },
      {
        id: 'message', name: 'Message', field: 'message', sortable: true, filterable: true
      },
      {
        id: 'color', name: 'Color', field: 'color', sortable: true, filterable: true
      },
      {
        id: 'size', name: 'Font Size', field: 'size', sortable: true, filterable: true
      }
    ];
    this.messageService.setColumnDefinitions(columnDefinitions);
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.orgnId = this.messageService.orgnId;
      this.baseFlag = this.messageService.baseFlag;
      this.edit = this.messageService.edit;
      this.del = this.messageService.del;
      this.onPageLoad();
    } else {
      this.userAuth = this.messageService.getClientUserAuth().subscribe(auth => {
        // this.view = auth[0].viewFlag;
        // this.add = auth[0].addFlag;
        this.edit = auth[0].editFlag;
        this.del = auth[0].deleteFlag;
        this.clientId = auth[0].clientid;
        this.orgnId = auth[0].mstorgnhirarchyid;
        this.baseFlag = auth[0].baseFlag;
        this.onPageLoad();
      });
    }
  }

  onPageLoad() {
  }

  openModal(content) {
    this.reset();
    this.getOrganization('i', this.clientId, this.orgnId);
    //this.getRecordTypes();
    this.modalService.open(content).result.then((result) => {
    }, (reason) => {

    });
  }

  reset() {
    this.orgSelected = 0;
    this.grpSelected = [];
    this.groups = [];
    this.seqNo = '';
    this.endTime = '';
    this.startTime = '';
    this.desc = '';
    this.fontsize = '';
    this.displayfont = '';
    this.setcolor = '';
  }

  onOrgChange(index) {
    this.orgName = this.organization[index].organizationname;
    this.getGroupData('i', this.orgSelected);
  }

  // ongrpChange(index: any) {
  //   this.grpName = index.supportgroupname;
  //   this.groupsId.push(index.id);
  //   console.log(this.grpSelected);
  // }

  // onDeSelect(index) {
  //   this.groupsId.pop();
  //   console.log(this.groupsId);
  // }

  getGroupData(type, orgnId) {
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(orgnId),
    };
    this.rest.getgroupbyorgid(data).subscribe((res) => {
      this.respObject = res;
      this.groups = this.respObject.details;
      this.selectAll(this.groups);
      if (this.respObject.success) {
        if (type === 'i') {
          // this.respObject.details.unshift({id: 0, supportgroupname: 'Select Support Group'});
          this.grpSelected = [];
        } else {
          //this.grpSelected = this.grpSelected1;
        }
      } else {
        //this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, function(err) {

    });
  }

  selectAll(items: any[]) {
    let allSelect = items => {
      items.forEach(element => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }

  getOrganization(type, clientId, orgId) {
    const data = {
      clientid: Number(clientId),
      mstorgnhirarchyid: Number(orgId)
    };
    this.rest.getorganizationclientwisenew(data).subscribe((res) => {
      this.respObject = res;
      this.organization = this.respObject.details;
      if (this.respObject.success) {
        if (type === 'i') {
          this.respObject.details.unshift({id: 0, organizationname: 'Select Organization'});
          this.orgSelected = 0;
        } else {
          this.orgSelected = this.orgSelected1;
        }
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      // this.isError = true;
      // this.errorMessage = this.messageService.SERVER_ERROR;
    });
  }

  save() {
    //this.fontsize = this.fontsize.match(/\d+/)[0];
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgSelected),
      groupid: this.grpSelected,
      sequence: Number(this.seqNo),
      message: this.desc,
      size: Number(this.fontsize)
    };

    // console.log("DATA", JSON.stringify(data));
    if (!this.messageService.isBlankField(data)) {
      data['starttime'] = Math.floor(this.startTime.getTime() / 1000);
      data['endtime'] = Math.floor(this.endTime.getTime() / 1000);
      data['color'] = this.setcolor === '' ? '#000000' : this.setcolor;
      //console.log("DATA", JSON.stringify(data));
      if (this.endTime > this.startTime) {
        this.rest.addbanner(data).subscribe((res) => {
          this.respObject = res;
          if (this.respObject.success) {
            this.isError = false;
            const id = this.respObject.details;
            // this.messageService.setRow({
            //   id: id,
            //   clientid: Number(this.clientId),
            //   mstorgnhirarchyid: Number(this.orgSelected),
            //   Mstorgnhirarchyname: this.orgName,
            //   groupid :Number(this.grpSelected),
            //   Groupname: this.grpName,
            //   ActualStarttime: this.messageService.dateConverter(this.startTime,5),
            //   ActualEndtime: this.messageService.dateConverter(this.endTime,5),
            //   message: this.desc
            // });
            this.getTableData();
            this.reset();
            this.totalData = this.totalData + 1;
            this.messageService.setTotalData(this.totalData);
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
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgSelected),
      groupid: this.grpSelected,
      // Endtime: Math.floor(this.endTime.getTime()/1000),
      // Starttime: Math.floor(this.startTime.getTime()/1000),
      message: this.desc
    };
    //console.log(data)
    if (!this.messageService.isBlankField(data)) {
      data['starttime'] = Math.floor(this.startTime.getTime() / 1000),
        data['endtime'] = Math.floor(this.endTime.getTime() / 1000);
      if (this.endTime > this.startTime) {
        this.rest.updatebanner(data).subscribe((res) => {
          this.respObject = res;
          if (this.respObject.success) {
            this.isError = false;
            this.modalReference.close();
            this.messageService.sendAfterDelete(this.selectedId);
            this.dataLoaded = true;
            // this.messageService.setRow({
            //     id: this.selectedId,
            //     clientid: Number(this.clientId),
            //     mstorgnhirarchyid: Number(this.orgSelected),
            //     Mstorgnhirarchyname: this.orgName,
            //     groupid :Number(this.grpSelected),
            //     Groupname: this.grpName,
            //     ActualStarttime: Math.floor(this.startTime.getTime()/1000),
            //     ActualEndtime:  Math.floor(this.endTime.getTime()/1000),
            //     message: this.desc
            //   });
            this.getTableData();
            this.notifier.notify('success', this.messageService.EDIT_SUCCESS);
          } else {
            //this.isError = true;
            this.notifier.notify('error', this.respObject.message);
          }
        }, (err) => {
          //this.isError = true;
          this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
      } else {
        this.notifier.notify('error', this.messageService.END_TIME_GREATERTHAN_START_TIME);
      }
    } else {
      //this.isError = true;
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }
  }


  chngeFont() {
    this.displayfont = this.fontsize.concat('px');
    //console.log(this.fontsize,"disp",this.displayfont);
  }

  updateSeq() {

    const data = {
      id: this.selectedId,
      sequence: Number(this.seqNo),
      size: Number(this.fontsize)
      // color: this.setcolor
    };
    // console.log(data);
    if (!this.messageService.isBlankField(data)) {
      data['color'] = this.setcolor === '' ? '#000000' : this.setcolor;
      this.rest.updatebannersequence(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          this.modalReference.close();
          this.messageService.sendAfterDelete(this.selectedId);
          this.dataLoaded = true;
          this.getTableData();
          this.notifier.notify('success', this.messageService.EDIT_SUCCESS);
        } else {
          //this.isError = true;
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        //this.isError = true;
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    } else {
      //this.isError = true;
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
    this.dataLoaded = true;
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgnId),
      offset: offset,
      limit: limit
    };
    this.rest.getbanner(data).subscribe((res) => {
      this.respObject = res;
      //console.log(JSON.stringify(res));
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
    if (this.userAuth) {
      this.userAuth.unsubscribe();
    }
  }
}


