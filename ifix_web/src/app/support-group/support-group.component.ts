import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {NotifierService} from 'angular-notifier';
import {RestApiService} from '../rest-api.service';
import {Filters, Formatters, OnEventArgs} from 'angular-slickgrid';
import {MessageService} from '../message.service';
import {Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';
import {CustomInputEditor} from '../custom-inputEditor';
import {FormControl} from '@angular/forms';

// import {numberFilterCondition} from 'angular-slickgrid/app/modules/angular-slickgrid/filter-conditions/numberFilterCondition';

@Component({
  selector: 'app-support-group',
  templateUrl: './support-group.component.html',
  styleUrls: ['./support-group.component.css']
})
export class SupportGroupComponent implements OnInit, OnDestroy {

  show: boolean;
  dataset: any[];
  totalData: number;
  respObject: any;
  displayData: any;
  add = false;
  del = false;
  edit = false;
  view = false;
  isError = false;
  errorMessage: string;
  private notifier: NotifierService;
  private clientId: number;
  private seq: number;
  pageSize: number;
  private baseFlag: any;
  private userAuth: Subscription;
  offset: number;
  // catalogName: string;
  dataLoaded: boolean;
  orgnId: number;
  isClient: boolean;
  selectedId: number;
  clientSelectedName: string;
  orgSelectedName: string;
  organaisation = [];
  orgSelected: any;
  orgName: any;
  @ViewChild('content1') private content1;
  private modalReference: NgbModalRef;
  orgId: number;
  zoneSelected: string;
  zones: any;
  isLoading = false;
  searchTerm: FormControl = new FormControl();
  searchTerm1: FormControl = new FormControl();
  reportZoneSelected: any;
  levels = [];
  levelSelected: number;
  grpMail: string;
  sprtgrpName: string;
  grpName: any;
  grpName1: any;
  reportZones = [];
  levelName: string;
  zonesId: number;
  reportZonesId: number;
  isworkflow: boolean;
  iscatalog: boolean;
  manageGrp:boolean;
  supportgroups = [];
  clientSelected: any;
  clients = [];
  clientName: any;
  orgSelected1: any;

  constructor(private rest: RestApiService, private messageService: MessageService, private route: Router,
              private modalService: NgbModal, notifier: NotifierService) {
    this.notifier = notifier;
    this.messageService.getCellChangeData().subscribe(item => {
      switch (item.type) {

        case 'delete':
          if (!this.del) {
            this.notifier.notify('error', this.messageService.DELETE_PERMISSION);
          } else {
              let workflow = '';
              if (item.isworkflow === true) {
                workflow = 'Y';
              } else {
                workflow = 'N';
              }
            if (confirm('Are you sure?')) {
              this.rest.deleteclientsupportgroupnew({id: item.id, isworkflow: workflow}).subscribe((res) => {
                this.respObject = res;
                console.log(JSON.stringify(this.respObject));
                if (this.respObject.success) {
                  this.totalData = this.totalData - 1;
                  this.messageService.setTotalData(this.totalData);
                  this.messageService.sendAfterDelete(item.id);
                  this.notifier.notify('success', this.messageService.DELETE_SUCCESS);

                } else {
                  this.notifier.notify('error', this.respObject.message);
                }
              }, (err) => {
                this.notifier.notify('error', this.respObject.errorMessage);
              });
            }
          }
          break;
      }
    });


    this.searchTerm.valueChanges.subscribe(
      zone => {
        this.isLoading = true;
        if (zone !== undefined && zone !== '') {
          zone = zone.toUpperCase();
          this.rest.searchzone({Zonename: zone}).subscribe((res1) => {
            this.respObject = res1;
            this.isLoading = false;
            if (this.respObject.success) {
              this.isError = false;
              this.zones = this.respObject.details;
              // console.log('zones====' + JSON.stringify(this.zones));
            } else {
              this.isError = true;
              this.notifier.notify('error', this.respObject.errorMessage);
            }
          }, (err) => {
            this.isLoading = false;
            this.isError = true;
            this.notifier.notify('error', this.messageService.SERVER_ERROR);
          });
        } else {
          this.isLoading = false;
          this.zones = [];
        }
      });


    this.searchTerm1.valueChanges.subscribe(
      zone1 => {
        this.isLoading = true;
        if (zone1 !== undefined && zone1 !== '') {
          this.reportZones = [];
          zone1 = zone1.toUpperCase();
          this.rest.searchzone({Zonename: zone1}).subscribe((res1) => {
            this.respObject = res1;
            this.isLoading = false;
            if (this.respObject.success) {
              this.isError = false;
              this.reportZones = this.respObject.details;
              // console.log('reportZones===============' + JSON.stringify(this.reportZones));
            } else {
              this.isError = true;
              this.notifier.notify('error', this.respObject.errorMessage);
            }
          }, (err) => {
            this.isLoading = false;
            this.isError = true;
            this.notifier.notify('error', this.messageService.SERVER_ERROR);
          });
        } else {
          this.isLoading = false;
          this.reportZones = [];
        }
      });


  }

  ngOnInit() {
    this.clientId = this.messageService.clientId;
    this.orgnId = this.messageService.orgnId;
    this.iscatalog == false;
    // this.levels = [{id: 0, name: 'Select Level'}, {id: 1, name: 'L1'}, {id: 2, name: 'L2'}];
    // if(Number(this.orgnId) === 1){
    //     this.isClient = false;
    // }else{
    //     this.isClient = true;
    // }
    // this.isShow = false;
    this.dataLoaded = false;
    this.pageSize = this.messageService.pageSize;
    // this.getBaseParent();
    this.displayData = {
      pageName: 'Maintain Support Group',
      openModalButton: 'Add Support Group',
      breadcrumb: 'Asset Support Group ',
      folderName: 'AllSupport Group ',
      tabName: 'Support Group',
    };
    this.rest.getclient({offset: 0, limit: 1000}).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.values.unshift({id: 0, name: 'Select Client'});
        this.clients = this.respObject.details.values;
        this.clientSelected = 0;
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
    let columnDefinitions = [];
    columnDefinitions = [
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
          //this.clients = [];
          this.organaisation = [];
          this.supportgroups = [];
          this.reset();
          console.log(JSON.stringify(args.dataContext));
          this.selectedId = args.dataContext.id;
          this.clientSelected = args.dataContext.clientid,
            this.orgSelected1 = Number(args.dataContext.mstorgnhirarchyid);
          this.orgName = args.dataContext.mstorgnhirarchyname;
          this.grpName1 = Number(args.dataContext.supportgroupid);
          this.levelSelected = Number(args.dataContext.supportgrouplevelid);
          this.grpMail = args.dataContext.email;
          this.zoneSelected = args.dataContext.timezonename;
          this.reportZoneSelected = args.dataContext.reporttimezonename;
          this.zonesId = args.dataContext.mstclienttimezoneid;
          this.reportZonesId = args.dataContext.reporttimezoneid;
          this.isworkflow = args.dataContext.isworkflow;
          this.iscatalog = args.dataContext.hascatalog;
          this.manageGrp = args.dataContext.ismanagement;
          this.getOrganization('u');
          this.getSupportgrpName('u', this.orgSelected1);
          this.modalReference = this.modalService.open(this.content1, {});
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },
      {
        id: 'organization', name: 'Organization', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'supportgroupname', name: 'Support Group Name', field: 'supportgroupname', sortable: true, filterable: true
      },
      {
        id: 'supportgrplevelname', name: 'Support Group Level', field: 'supportgrplevelname', sortable: true, filterable: true
      },
      {
        id: 'email', name: 'Group Email Id', field: 'email', sortable: true, filterable: true
      },
      {
        id: 'timezonename', name: 'Time Zone', field: 'timezonename', sortable: true, filterable: true
      },
      {
        id: 'reporttimezonename', name: 'Report Time Zone', field: 'reporttimezonename', sortable: true, filterable: true
      }, {
        id: 'hascatalog', name: 'Has Catalog', field: 'hascatalog', sortable: true, filterable: true, formatter: Formatters.checkmark,
        filter: {
          collection: [{value: '', label: 'All'}, {value: true, label: 'True'}, {value: false, label: 'False'}],
          model: Filters.singleSelect,

          filterOptions: {
            autoDropWidth: true
          },
        }, minWidth: 40
      }, {
        id: 'isworkflow', name: 'In Workflow', field: 'isworkflow', sortable: true, filterable: true, formatter: Formatters.checkmark,
        filter: {
          collection: [{value: '', label: 'All'}, {value: true, label: 'True'}, {value: false, label: 'False'}],
          model: Filters.singleSelect,

          filterOptions: {
            autoDropWidth: true
          },
        }, minWidth: 40
      },
      {
        id: 'ismanagement', name: 'Management Group', field: 'ismanagement', sortable: true, filterable: true, formatter: Formatters.checkmark,
        filter: {
          collection: [{value: '', label: 'All'}, {value: true, label: 'True'}, {value: false, label: 'False'}],
          model: Filters.singleSelect,

          filterOptions: {
            autoDropWidth: true
          },
        }, minWidth: 40
      }

    ];


    this.messageService.setColumnDefinitions(columnDefinitions);
    // this.onPageLoad();
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.baseFlag = this.messageService.baseFlag;
      this.orgId = this.messageService.orgnId;
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
        this.baseFlag = auth[0].baseFlag;
        this.orgId = auth[0].mstorgnhirarchyid;
        this.onPageLoad();
      });
    }
  }

  onPageLoad() {
    // console.log(this.clientId);
    // this.rest.getorganizationclientwise({clientid: Number(this.clientId)}).subscribe((res) => {
    //   this.respObject = res;
    //   if (this.respObject.success) {
    //     this.respObject.details.unshift({id: 0, organizationname: 'Select Organization'});
    //     this.organaisation = this.respObject.details;
    //     this.orgSelected = 0;
    //   } else {
    //     this.isError = true;
    //     this.notifier.notify('error', this.respObject.message);
    //   }
    // }, (err) => {
    //   this.isError = true;
    //   this.notifier.notify('error', this.messageService.SERVER_ERROR);
    // });


    this.rest.getsupportgrplevel().subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.values.unshift({id: 0, name: 'Select Group Level'});
        this.levels = this.respObject.details.values;
        this.levelSelected = 0;
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.isError = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });


    // this.getTableData();
  }

  changeRouting(path: string) {
    this.messageService.changeRouting(path);
  }


  reset() {
    // this.clientSelected = 0;
    this.orgSelected = 0;
    this.levelSelected = 0;
    this.grpMail = '';
    this.grpName = 0;
    this.zoneSelected = '';
    this.reportZoneSelected = '';
    this.isworkflow = false;
    this.iscatalog = false;
    this.manageGrp = false;
    this.supportgroups = [];
  }


  levelData() {
  }

  onLevelChange(index: any) {
    this.levelName = this.levels[index].name;
  }

  onSupportgrpChange(index) {
    this.sprtgrpName = this.supportgroups[index].supportgrpname;
  }

  onClientChange(index: any) {
    this.clientName = this.clients[index].name;
  }

  getOrganization(type) {
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgId)
    };
    this.rest.getorganizationclientwisenew(data).subscribe((res) => {
      this.respObject = res;
      this.organaisation = this.respObject.details;
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
      this.isError = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  openModal(content) {
    this.isError = false;
    this.getOrganization('i');
    this.reset();
    this.modalService.open(content).result.then((result) => {
    }, (reason) => {
    });
  }

  onOrgChange(index: any) {
    this.orgName = this.organaisation[index].organizationname;
    this.getSupportgrpName('i', this.orgSelected);
    this.levelData();
  }

  getSupportgrpName(type, orgSet) {
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(orgSet)

    };
    this.rest.getallcreatedsupportgrp(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.supportgroups = this.respObject.details;
        this.respObject.details.unshift({id: 0, supportgrpname: 'Select Support Group Name'});
        if (type === 'i') {
          this.grpName = 0;
        } else {
          // console.log('Edit', this.grpName1);
          this.grpName = this.grpName1;
        }
      } else {
        this.isError = true;
        //this.notifier.notify('error', this.respObject.message);

        this.notifier.notify('error', this.respObject.message);
      }
    }, function(err) {

    });
  }


  update() {
    let zoneId = 0;
    let reportZoneId = 0;
    // console.log('------' + JSON.stringify(this.zones));
    // console.log('nnnnnnnnnn' + JSON.stringify(this.reportZones));
    for (let i = 0; i < this.zones.length; i++) {
      if (this.zones[i].zonename === this.zoneSelected) {
        zoneId = this.zones[i].id;
      }
    }

    for (let j = 0; j < this.reportZones.length; j++) {
      if (this.reportZones[j].zonename === this.reportZoneSelected) {
        reportZoneId = this.reportZones[j].id;
      }
    }
    let workflow = '';
    if (this.isworkflow) {
      workflow = 'Y';
    } else {
      workflow = 'N';
    }
    let catalog = '';
    if (this.iscatalog) {
      // console.log(this.iscatalog);
      catalog = 'Y';
    } else {
      catalog = 'N';
    }

    let managenent = '';
    if (this.manageGrp) {
      managenent = 'Y';
    } else {
      managenent = 'N';
    }

    // const data = {
    //   'clientid': Number(this.clientId),
    //   'mstorgnhirarchyid': Number(this.orgSelected),
    //   'supportgroupname': Number(this.grpName),
    //   'supportgrouplevelid': Number(this.levelSelected),
    //   'mstclienttimezoneid': Number(zoneId),
    //   'reporttimezoneid': Number(reportZoneId),
    //   'email': this.grpMail,
    //   'id': this.selectedId,
    //   'isworkflow': workflow,
    //   'hascatalog': catalog
    // };

    const data = {
      id: this.selectedId,
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgSelected),
      supportgroupid: Number(this.grpName),
      supportgrouplevelid: Number(this.levelSelected),
      mstclienttimezoneid: Number(zoneId),
      reporttimezoneid: Number(reportZoneId),
      email: this.grpMail,
      isworkflow: workflow,
      hascatalog: catalog,
      ismanagement : managenent
    };
    console.log('data' + JSON.stringify(data));
    if (!this.messageService.isBlankField(data)) {
      this.rest.updateclientsupportgroupnew(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          this.modalReference.close();
          // this.messageService.sendAfterDelete(this.selectedId);
          this.dataLoaded = true;
          // this.messageService.setRow({
          //   id: this.selectedId,
          //   clientid: Number(this.clientSelected),
          //   mstorgnhirarchyname: this.orgName,
          //   supportgroupname: this.sprtgrpName,
          //   supportgrplevelname: this.levelName,
          //   email: this.grpMail,
          //   timezonename: this.zoneSelected,
          //   reporttimezonename: this.reportZoneSelected,
          //   mstorgnhirarchyid: Number(this.orgSelected),
          //   supportgroupid: Number(this.grpName),
          //   supportgrouplevelid: Number(this.levelSelected),
          //   hascatalog: catalog,
          //   isworkflow: workflow
          // });
          this.getTableData();

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
    let zoneId = 0;
    let reportZoneId = 0;

    let workflow = '';
    if (this.isworkflow) {
      workflow = 'Y';
    } else {
      workflow = 'N';

    }
    let catalog = '';
    if (this.iscatalog) {
      catalog = 'Y';
    } else {
      catalog = 'N';
    }

    let managenent = '';
    if (this.manageGrp) {
      managenent = 'Y';
    } else {
      managenent = 'N';
    }
    // console.log(this.reportZoneSelected + '   ' + this.zoneSelected);
    // console.log("------"+JSON.stringify(this.zones));
    // console.log("nnnnnnnnnn"+JSON.stringify(this.reportZones));
    for (let i = 0; i < this.zones.length; i++) {
      if (this.zones[i].zonename === this.zoneSelected) {
        zoneId = this.zones[i].id;
      }
    }

    for (let j = 0; j < this.reportZones.length; j++) {
      if (this.reportZones[j].zonename === this.reportZoneSelected) {
        reportZoneId = this.reportZones[j].id;
      }
    }
    // const data = {
    //   clientid: Number(this.clientId),
    //   mstorgnhirarchyid: Number(this.orgSelected),
    //   supportgroupname: Number(this.grpName),
    //   supportgrouplevelid: Number(this.levelSelected),
    //   mstclienttimezoneid: Number(zoneId),
    //   reporttimezoneid: Number(reportZoneId),
    //   email: this.grpMail,
    //   isworkflow: workflow,
    //   hascatalog: catalog
    // };
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgSelected),
      supportgroupid: Number(this.grpName),
      supportgrouplevelid: Number(this.levelSelected),
      mstclienttimezoneid: Number(zoneId),
      reporttimezoneid: Number(reportZoneId),
      email: this.grpMail,
      isworkflow: workflow,
      hascatalog: catalog,
      ismanagement : managenent
    };

    // // if(this.isClient){
    // //   data["clientid"] = this.clie
    // // }
    console.log('data' + JSON.stringify(data));
    if (!this.messageService.isBlankField(data)) {
      this.rest.addclientsupportgroupnew(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          const id = this.respObject.details;
          // this.messageService.setRow({
          //   id: id,
          //   mstorgnhirarchyname: this.orgName,
          //   supportgroupname: this.sprtgrpName,
          //   supportgrplevelname: this.levelName,
          //   email: this.grpMail,
          //   timezonename: this.zoneSelected,
          //   reporttimezonename: this.reportZoneSelected,
          //   mstorgnhirarchyid: Number(this.orgSelected),
          //   supportgroupid: Number(this.grpName),
          //   supportgrouplevelid: Number(this.levelSelected),
          //   hascatalog: catalog,
          //   isworkflow: workflow
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
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }
  }

  getTableData() {
    this.getData({
      offset: this.messageService.offset, 
      limit: this.messageService.limit
    });
  }

  isEmpty(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  getData(paginationObj) {
    const offset = paginationObj.offset;
    const limit = paginationObj.limit;
    this.dataLoaded = true;
    const data = {
      'clientid': Number(this.clientId),
      'mstorgnhirarchyid': Number(this.orgId),
      'offset': offset,
      'limit': limit,
    };

    // console.log('...........' + JSON.stringify(data) + '...' + this.clientId);
    this.rest.getallclientsupportgroupnew(data).subscribe((res) => {
      this.respObject = res;
      for (let i = 0; i < this.respObject.details.values.length; i++) {
        this.respObject.details.values[i].hascatalog = this.respObject.details.values[i].hascatalog === 'Y';
        this.respObject.details.values[i].isworkflow = this.respObject.details.values[i].isworkflow === 'Y';
        this.respObject.details.values[i].ismanagement = this.respObject.details.values[i].ismanagement === 'Y';
      }
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
