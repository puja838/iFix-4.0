import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {RestApiService} from '../rest-api.service';
import {Filters, Formatters, OnEventArgs} from 'angular-slickgrid';
import {MessageService} from '../message.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-sla-criteria',
  templateUrl: './sla-criteria.component.html',
  styleUrls: ['./sla-criteria.component.css']
})
export class SlaCriteriaComponent implements OnInit, OnDestroy {

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
  orgName: string;
  clientId: number;
  orgId: number;
  recordType: string;
  recordTypeIds = [];
  // recordTypeNames = [];
  // recordTypeNameSelected: number;
  clientSelectedName: string;
  orgSelectedName: string;
  organizationName: string;
  selectedId: number;
  // recordTypeNameSelected1: number;
  selectedRecordTypeName: number;
  seq: number;
  updateFlag = false;
  orgnId: number;
  @ViewChild('content') private content;
  private modalReference: NgbModalRef;
  respHour: number;
  respMin: number;
  resoHour: number;
  resoMin: number;
  specificToSuppGrp: boolean;
  ticketTypes = [];
  selectedTicketType: number;
  priorities = [];
  selectedPriority: number;
  workingList = [];
  selectedWorkingCategory: number;
  TICKET_TYPE_SEQ = 1;
  PRIORITY_SEQ = 4;
  recordTypeId: number;
  slaNames = [];
  selectedSlaName: number;
  slaName: string;
  ticketTypeName: string;
  priorityName: string;
  workingCategoryName: string;
  organizationId: number;
  slaNameSelected: number;
  ticketTypeSelected: number;
  prioritySelected: number;
  workingcategorySelected: number;

  responseSLACompliance: number;
  resolutionSLACompliance: number;

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
              this.rest.deleteslacriteria({id: item.id}).subscribe((res) => {
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
      pageName: 'All SLA Fullfillment Criteria',
      openModalButton: 'Add SLA Criteria',
      breadcrumb: 'SLA Criteria',
      folderName: 'All SLA Fullfillment Criteria',
      tabName: 'All SLA Fullfillment Criteria',
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
          // console.log(args.dataContext);
          this.isError = false;
          this.organization=[];
          this.reset();
          this.updateFlag = true;
          this.selectedId = args.dataContext.id;
          this.organizationId = this.orgSelected = args.dataContext.mstorgnhirarchyid;
          this.slaNameSelected = args.dataContext.slaid;
          this.ticketTypeSelected = args.dataContext.mstrecorddifferentiationtickettypeid;
          this.prioritySelected = args.dataContext.mstrecorddifferentiationpriorityid;
          this.workingcategorySelected = args.dataContext.mstrecorddifferentiationworkingcatid;
          this.respMin = args.dataContext.responsetimeinmin;
          this.resoMin = args.dataContext.resolutiontimeinmin;
          this.ticketTypeName = args.dataContext.tickettypename;
          this.priorityName = args.dataContext.priorityname;
          this.workingCategoryName = args.dataContext.workingcatname;
          this.orgName = args.dataContext.mstorgnhirarchyname;
          this.slaName = args.dataContext.slaname;
          this.responseSLACompliance = args.dataContext.responsecompliance;
          this.resolutionSLACompliance = args.dataContext.resolutioncompliance;
          const specificToSuppGrp = Number(args.dataContext.supportGroupSpecific);
          if (specificToSuppGrp === 1) {
            this.specificToSuppGrp = true;
          } else {
            this.specificToSuppGrp = false;
          }
          this.getOrganization(this.clientId, this.orgId, 'u');
          this.getSlaName('u');
          this.getTicketType('u');
          this.getPriority('u');
          this.getWorkingCategory(this.ticketTypeSelected, 'u');
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
        id: 'tickettypename',
        name: 'Ticket Type Name',
        field: 'tickettypename',
        sortable: true,
        filterable: true
      },
      {
        id: 'priorityname',
        name: 'Priority Name',
        field: 'priorityname',
        sortable: true,
        filterable: true
      },
      {
        id: 'workingcatname',
        name: 'Working Category Name',
        field: 'workingcatname',
        sortable: true,
        filterable: true
      },
      {
        id: 'responsetimeinmin', name: 'Response Time(in min)', field: 'responsetimeinmin', sortable: true, filterable: true
      },
      {
        id: 'resolutiontimeinmin', name: 'Resolution Time(in min)', field: 'resolutiontimeinmin', sortable: true, filterable: true
      },
      {
        id: 'responsecompliance', name: 'Response SLA Compliance %', field: 'responsecompliance', sortable: true, filterable: true
      },
      {
        id: 'resolutioncompliance', name: 'Resolution SLA Compliance %', field: 'resolutioncompliance', sortable: true, filterable: true
      },
      {
        id: 'supportGroupSpecific',
        name: 'Support Group Specific',
        field: 'supportGroupSpecific',
        sortable: true,
        filterable: true,
        formatter: Formatters.checkmark,
        filter: {
          collection: [{value: '', label: 'All'}, {value: true, label: 'Yes'}, {
            value: false,
            label: 'No'
          }],
          model: Filters.singleSelect,
          filterOptions: {
            autoDropWidth: true
          },
        }
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
    this.getRecordTypes();
  }

  openModal(content) {
    this.reset();
    this.getOrganization(this.clientId, this.orgId, 'i');
    this.modalService.open(content, {size: 'sm'}).result.then((result) => {
    }, (reason) => {

    });
  }

  getRecordTypes() {
    this.rest.getRecordDiffType().subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.recordTypeIds = this.respObject.details;
        for (let i = 0; i < this.recordTypeIds.length; i++) {
          if (this.recordTypeIds[i].seqno === this.TICKET_TYPE_SEQ) {
            this.recordTypeId = this.recordTypeIds[i].id;
          }
        }
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  save() {
    let supGroupSpecific;
    if (this.specificToSuppGrp === true) {
      supGroupSpecific = 1;
    } else {
      supGroupSpecific = 0;
    }
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgSelected),
      slaid: Number(this.selectedSlaName),
      mstrecorddifferentiationtickettypeid: Number(this.selectedTicketType),
      mstrecorddifferentiationpriorityid: Number(this.selectedPriority),
      // mstrecorddifferentiationworkingcatid: Number(this.selectedWorkingCategory),
      responsetimeinmin: this.respMin,
      responsetimeinsec: this.respMin * 60,
      resolutiontimeinmin: this.resoMin,
      resolutiontimeinsec: this.resoMin * 60,
      responsecompliance: String(this.responseSLACompliance),
      resolutioncompliance: String(this.resolutionSLACompliance)
    };
    // console.log('data==============' + JSON.stringify(data));
    if (!this.messageService.isBlankField(data)) {
      data['responsetimeinhr'] = 0;
      data['resolutiontimeinhr'] = 0;
      data['supportgroupspecific'] = supGroupSpecific;
      data['mstrecorddifferentiationworkingcatid'] = Number(this.selectedWorkingCategory);
      if(Number(this.responseSLACompliance) > 100 || Number(this.resolutionSLACompliance) > 100){
        this.notifier.notify('error', this.messageService.WRONG_PERCENTAGE);
      } else {
        this.rest.addmstslacriteria(data).subscribe((res) => {
          this.respObject = res;
          if (this.respObject.success) {
            const id = this.respObject.details;
            this.messageService.setRow({
              id: id,
              mstorgnhirarchyname: this.orgName,
              slaname: this.slaName,
              tickettypename: this.ticketTypeName,
              priorityname: this.priorityName,
              workingcatname: this.workingCategoryName,
              supportGroupSpecific: this.specificToSuppGrp,
              responsetimeinmin: this.respMin,
              resolutiontimeinmin: this.resoMin,
              mstorgnhirarchyid: this.orgSelected,
              slaid: this.selectedSlaName,
              mstrecorddifferentiationtickettypeid: this.selectedTicketType,
              mstrecorddifferentiationpriorityid: this.selectedPriority,
              mstrecorddifferentiationworkingcatid: this.selectedWorkingCategory,
              responsecompliance: String(this.responseSLACompliance),
              resolutioncompliance: String(this.resolutionSLACompliance)
            });
            this.totalData = this.totalData + 1;
            this.messageService.setTotalData(this.totalData);
            this.reset();
            this.isError = false;
            this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
          } else {
            this.notifier.notify('error', this.respObject.message);
          }
        }, (err) => {
          this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
      }
    } else {
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }
  }

  update() {
    let supGroupSpecific;
    if (this.specificToSuppGrp === true) {
      supGroupSpecific = 1;
    } else {
      supGroupSpecific = 0;
    }
    const data = {
      id: this.selectedId,
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgSelected),
      slaid: Number(this.selectedSlaName),
      mstrecorddifferentiationtickettypeid: Number(this.selectedTicketType),
      mstrecorddifferentiationpriorityid: Number(this.selectedPriority),
      // mstrecorddifferentiationworkingcatid: Number(this.selectedWorkingCategory),
      responsetimeinmin: this.respMin,
      responsetimeinsec: this.respMin * 60,
      resolutiontimeinmin: this.resoMin,
      resolutiontimeinsec: this.resoMin * 60,
      responsecompliance: String(this.responseSLACompliance),
      resolutioncompliance: String(this.resolutionSLACompliance)
    };
    if (!this.messageService.isBlankField(data)) {
      data['responsetimeinhr'] = 0;
      data['resolutiontimeinhr'] = 0;
      data['supportgroupspecific'] = supGroupSpecific;
      data['mstrecorddifferentiationworkingcatid'] = Number(this.selectedWorkingCategory);
      if(Number(this.responseSLACompliance) > 100 || Number(this.resolutionSLACompliance) > 100){
        this.notifier.notify('error', this.messageService.WRONG_PERCENTAGE);
      } else {
        this.rest.updateslacriteria(data).subscribe((res) => {
          this.respObject = res;
          if (this.respObject.success) {
            this.isError = false;
            this.messageService.sendAfterDelete(this.selectedId);
            this.dataLoaded = true;
            this.messageService.setRow({
              id: this.selectedId,
              mstorgnhirarchyname: this.orgName,
              slaname: this.slaName,
              tickettypename: this.ticketTypeName,
              priorityname: this.priorityName,
              workingcatname: this.workingCategoryName,
              supportGroupSpecific: this.specificToSuppGrp,
              responsetimeinmin: this.respMin,
              resolutiontimeinmin: this.resoMin,
              mstorgnhirarchyid: this.orgSelected,
              slaid: this.selectedSlaName,
              mstrecorddifferentiationtickettypeid: this.selectedTicketType,
              mstrecorddifferentiationpriorityid: this.selectedPriority,
              mstrecorddifferentiationworkingcatid: this.selectedWorkingCategory,
              responsecompliance: String(this.responseSLACompliance),
              resolutioncompliance: String(this.resolutionSLACompliance)
            });
            this.modalReference.close();
            this.notifier.notify('success', this.messageService.EDIT_SUCCESS);
          } else {
            this.notifier.notify('error', this.respObject.message);
          }
        }, (err) => {
          this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
      }
    } else {
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }
    
  }

  reset() {
    this.orgSelected = 0;
    this.selectedSlaName = 0;
    this.selectedTicketType = 0;
    this.selectedPriority = 0;
    this.selectedWorkingCategory = 0;
    this.respMin = 0;
    this.resoMin = 0;
    this.specificToSuppGrp = false;
    this.updateFlag = false;
    this.slaNames = [];
    this.ticketTypes = [];
    this.priorities = [];
    this.workingList = [];
    this.responseSLACompliance = 0;
    this.resolutionSLACompliance = 0;
  }

  onOrgChange(index) {
    this.orgName = this.organization[index].organizationname;
    this.getTicketType('i');
    this.getPriority('i');
    this.getSlaName('i');
  }

  getPriority(type) {
    const priorityData = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.orgSelected),
      seqno: this.PRIORITY_SEQ
    };
    this.getrecordbydifftype(priorityData, type);
  }

  getTicketType(type) {
    const ticketTypeData = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.orgSelected),
      seqno: this.TICKET_TYPE_SEQ
    };
    this.getrecordbydifftype(ticketTypeData, type);
  }

  getSlaName(type) {
    const slaData = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.orgSelected)
    };
    this.rest.getslanames(slaData).subscribe((res: any) => {
      if (res.success) {
        // res.details.unshift({id: 0, slaname: 'Select SLA Name'});
        this.slaNames = res.details;
        if (type === 'i') {
          this.selectedSlaName = 0;
        } else {
          this.selectedSlaName = this.slaNameSelected;
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onSlaNameChange(index) {
    this.slaName = this.slaNames[index - 1].slaname;
    // console.log('this.slaName===========' + this.slaName);
  }

  onPriorityChange(index) {
    this.priorityName = this.priorities[index - 1].typename;
    // console.log('this.priorityName===========' + this.priorityName);
  }

  onWorkingCategoryChange(index) {
    this.workingCategoryName = this.workingList[index - 1].name;
    // console.log('this.workingCategoryName===========' + this.workingCategoryName);
  }

  onTicketTypeChange(index) {
    this.ticketTypeName = this.ticketTypes[index - 1].typename;
    // console.log('this.ticketTypeName===========' + this.ticketTypeName);
    this.getWorkingCategory(this.selectedTicketType, 'i');
  }

  getWorkingCategory(ticketType, type) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.orgSelected),
      forrecorddifftypeid: Number(this.recordTypeId),
      forrecorddiffid: Number(ticketType)
    };
    this.rest.getworkinglabelname(data).subscribe((res: any) => {
      if (res.success) {
        this.workingList = res.details.values;
        if (type === 'i') {
          this.selectedWorkingCategory = 0;
        } else {
          this.selectedWorkingCategory = this.workingcategorySelected;
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getrecordbydifftype(data, type) {
    this.rest.getrecordbydifftype(data).subscribe((res: any) => {
      // this.respObject = res;
      if (res.success) {
        if (data.seqno === this.TICKET_TYPE_SEQ) {
          this.ticketTypes = res.details;
          if (type === 'i') {
            this.selectedTicketType = 0;
          } else {
            this.selectedTicketType = this.ticketTypeSelected;
          }
        } else if (data.seqno === this.PRIORITY_SEQ) {
          this.priorities = res.details;
          if (type === 'i') {
            this.selectedPriority = 0;
          } else {
            this.selectedPriority = this.prioritySelected;
          }
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getOrganization(clientId, orgId, type) {
    const data = {
      clientid: Number(clientId) , 
      mstorgnhirarchyid: Number(orgId)
    };
    this.rest.getorganizationclientwisenew(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, organizationname: 'Select Organization'});
        this.organization = this.respObject.details;
        if (type === 'i') {
          this.orgSelected = 0;
        } else {
          this.orgSelected = this.organizationId;
          // console.log(this.orgSelected);
        }
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
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
    // console.log(data);
    this.rest.getslacriteria(data).subscribe((res) => {
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
      for (let i = 0; i < data.length; i++) {
        if (data[i].supportgroupspecific === 1) {
          data[i]['supportGroupSpecific'] = true;
        } else {
          data[i]['supportGroupSpecific'] = false;
        }
      }
      // console.log('data===============' + JSON.stringify(data));
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
