import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {RestApiService} from '../rest-api.service';
import {Filters, Formatters, OnEventArgs} from 'angular-slickgrid';
import {MessageService} from '../message.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-sla-support-group',
  templateUrl: './sla-support-group.component.html',
  styleUrls: ['./sla-support-group.component.css']
})
export class SlaSupportGroupComponent implements OnInit, OnDestroy {
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
  private baseFlag: any;
  collectionSize: number;
  pageSize: number;
  private userAuth: Subscription;
  dataLoaded: boolean;
  isLoading = false;
  organization = [];
  orgSelected: number;
  orgName: string;
  clientId: number;
  orgId: number;
  slaNames = [];
  selectedId: number;
  slaNameSelected: number;
  selectedSlaName: number;
  updateFlag = false;
  organizationId: number;
  slaName: string;
  slaCriteria = [];
  groups = [];
  groupid: number;
  gid: number;
  grpName: string;
  selectedSlaCriteria: number;

  slaVal: number;
  groupVal: number;

  @ViewChild('content') private content;
  private modalReference: NgbModalRef;

  constructor(private rest: RestApiService, private messageService: MessageService,
              private route: Router, private modalService: NgbModal, private notifier: NotifierService) {
    this.messageService.getCellChangeData().subscribe(item => {
      switch (item.type) {
        case 'delete':
          if (!this.del) {
            this.notifier.notify('error', this.messageService.DELETE_PERMISSION);
          } else {
            if (confirm('Are you sure?')) {
              // console.log(JSON.stringify(item));
              this.rest.deleteslaresponsesupportgrp({id: item.id}).subscribe((res) => {
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
                this.notifier.notify('error', this.messageService.SERVER_ERROR);
              });
            }
          }
          break;
      }
    });
  }

  ngOnInit(): void {
    this.dataLoaded = true;
    this.pageSize = this.messageService.pageSize;
    this.displayData = {
      pageName: 'All SLA Support Group',
      openModalButton: 'Add SLA Support Group',
      breadcrumb: 'SLA Support Group',
      folderName: 'All SLA Support Group',
      tabName: 'All SLA Support Group',
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
          this.reset();
          this.updateFlag = true;
          this.getOrganization(this.clientId, 'u');
          this.selectedId = args.dataContext.id;
          this.organizationId = this.orgSelected = args.dataContext.mstorgnhirarchyid;
          this.selectedSlaCriteria = args.dataContext.mstslafullfillmentcriteriaid;
          this.groupVal = args.dataContext.mstclientsupportgroupid;
          this.slaVal = args.dataContext.mstslaid;
          this.orgName = args.dataContext.mstorgnhirarchyname;
          this.slaName = args.dataContext.slaname;
          this.grpName = args.dataContext.grpname;

          this.getSlaName('u');
          this.getGroupid('u');

          this.modalReference = this.modalService.open(this.content, {});
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },
      {
        id: 'organization', name: 'Organization ', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'slaname', name: 'SLA Name ', field: 'slaname', sortable: true, filterable: true
      },
      {
        id: 'grpname',
        name: 'Group Name',
        field: 'grpname',
        sortable: true,
        filterable: true
      }
    ];
    this.messageService.setColumnDefinitions(columnDefinitions);
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.orgId = this.messageService.orgnId;
      this.baseFlag = this.messageService.baseFlag;
      this.edit = this.messageService.edit;
      this.del = this.messageService.del;
      this.onPageLoad();
    } else {
      this.userAuth = this.messageService.getClientUserAuth().subscribe(auth => {
        this.edit = auth[0].editFlag;
        this.del = auth[0].deleteFlag;
        this.clientId = auth[0].clientid;
        this.orgId = auth[0].mstorgnhirarchyid;
        this.baseFlag = auth[0].baseFlag;
        this.onPageLoad();
      });
    }
  }

  onPageLoad() {
    // this.getRecordTypes();
  }

  openModal(content) {
    this.reset();
    this.getOrganization(this.clientId, 'i');
    this.modalService.open(content, {size: 'sm'}).result.then((result) => {
    }, (reason) => {

    });
  }

  getOrganization(clientId, type) {
    this.rest.getorganizationclientwisenew({clientid: Number(this.clientId),mstorgnhirarchyid: Number(this.orgId)}).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, organizationname: 'Select Organization'});
        this.organization = this.respObject.details;
        if (type === 'i') {
          this.orgSelected = 0;
        } else {
          this.orgSelected = this.organizationId;
        }
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  reset() {
    this.slaNames = [];
    this.organization = [];
    this.orgSelected = 0;
    this.selectedSlaName = 0;
    this.selectedSlaCriteria = 0;
    this.groupid = 0;
    this.updateFlag = false;
  }

  onSlaNameChange(index) {
    this.slaName = this.slaNames[index - 1].slaname;
    this.getfullfillmentcriteriaid()
    // console.log('this.slaName===========' + this.slaName);
  }

  save() {
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgSelected),
      mstslaid: Number(this.selectedSlaName),
      mstslafullfillmentcriteriaid:this.selectedSlaCriteria,
      mstclientsupportgroupid:Number(this.groupid)
    };
    // console.log('data==============' + JSON.stringify(data));
    if (!this.messageService.isBlankField(data)) {
      this.rest.addslaresponsesupportgrp(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          const id = this.respObject.details;
          this.messageService.setRow({
            id: id,
            mstorgnhirarchyname: this.orgName,
            slaname: this.slaName,
            grpname:this.grpName,
            mstorgnhirarchyid: Number(this.orgSelected),
            mstslaid: Number(this.selectedSlaName),
            mstslafullfillmentcriteriaid:this.selectedSlaCriteria,
            mstclientsupportgroupid:Number(this.groupid)
          });
          this.totalData = this.totalData + 1;
          this.messageService.setTotalData(this.totalData);
          this.reset();
          this.isError = false;
          this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
        } else {
          this.notifier.notify('success', this.respObject.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    } else {
      this.notifier.notify('success', this.messageService.BLANK_ERROR_MESSAGE);
    }
  }

  update() {
    const data = {
      id: this.selectedId,
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgSelected),
      mstslaid: Number(this.selectedSlaName),
      mstslafullfillmentcriteriaid:this.selectedSlaCriteria,
      mstclientsupportgroupid:Number(this.groupid)
    };
    if (!this.messageService.isBlankField(data)) {
      this.rest.updateslaresponsesupportgrp(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          this.messageService.sendAfterDelete(this.selectedId);
          this.dataLoaded = true;
          this.messageService.setRow({
            id: this.selectedId,
            mstorgnhirarchyname: this.orgName,
            slaname: this.slaName,
            grpname: this.grpName,
            mstorgnhirarchyid: Number(this.orgSelected),
            mstslaid: Number(this.selectedSlaName),
            mstslafullfillmentcriteriaid:this.selectedSlaCriteria,
            mstclientsupportgroupid:Number(this.groupid)
          });
          this.modalReference.close();
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

  getSlaName(type) {
    const slaData = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.orgSelected)
    };
    this.rest.getsupportgrpenableslanames(slaData).subscribe((res: any) => {
      if (res.success) {
        this.slaNames = res.details;
        if (type === 'i') {
          this.selectedSlaName = 0;
        } else {
          this.selectedSlaName = this.slaVal;
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onGroupChange(index) {
    this.grpName = this.groups[index - 1].supportgroupname;
  }

  getfullfillmentcriteriaid() {
    if(Number(this.orgSelected)>0 && Number(this.selectedSlaName)>0) {
      this.rest.getfullfillmentcriteriaid({
        clientid: this.clientId,
        mstorgnhirarchyid: Number(this.orgSelected),
        mstslaid: Number(this.selectedSlaName)
      }).subscribe((res: any) => {
        if (res.success) {
          this.selectedSlaCriteria = res.details;
          console.log(this.selectedSlaCriteria)
          // if (type === 'i') {
          //   this.groupid = 0;
          // } else {
          //   this.groupid = this.gid;
          // }
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        console.log(err);
      });
    }
  }
  getGroupid(type) {
    this.rest.getgroupbyorgid({clientid: this.clientId, mstorgnhirarchyid: Number(this.orgSelected)}).subscribe((res: any) => {
      if (res.success) {
        this.groups = res.details;
        if (type === 'i') {
          this.groupid = 0;
        } else {
          this.groupid = this.groupVal;
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      console.log(err);
    });
  }

  onOrgChange(index) {
    this.orgName = this.organization[index].organizationname;
    this.getSlaName('i');
    this.getGroupid('i');
    this.getfullfillmentcriteriaid()
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
      clientid: this.clientId,
      mstorgnhirarchyid: this.orgId,
      Offset: offset,
      Limit: limit
    };
    console.log(data);
    this.rest.getslaresponsesupportgrp(data).subscribe((res) => {
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
