import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { RestApiService } from '../rest-api.service';
import { Filters, Formatters, OnEventArgs } from 'angular-slickgrid';
import { MessageService } from '../message.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-support-group-map',
  templateUrl: './support-group-map.component.html',
  styleUrls: ['./support-group-map.component.css']
})
export class SupportGroupMapComponent implements OnInit {
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
  orgSelected: any;
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
  @ViewChild('content') private content;
  private modalReference: NgbModalRef;
  isEdit: boolean;
  colordata: any;
  clients = []
  clientName: string;
  recordTypeStatus = [];
  fromRecordDiffTypeId: any;
  fromRecordDiffTypename: any
  fromlevelid: any;
  fromRecordDiffId = [];
  allPropertyValues = [];
  fromPropLevels = [];
  fromRecordDiffName: string;
  categoryLevelId: any;
  categoryLevelList = [];
  propertyLevel: any;
  toclientSelected: any;
  toclientSelected1: any;
  toclients = [];
  toclientName: string;
  organizationto = [];
  orgSelectedto = [];
  orgSelectedto1 = '';
  orgNameto: any;
  grpSelected = [];
  sprtgrpName: any;
  supportgroups = [];
  groupsId = [];
  orgIdTo = [];
  toOrg: any;

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
              this.rest.deletedifferentiationmap({ id: item.id, mapid: item.mapid }).subscribe((res) => {
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
    this.colordata = this.messageService.colors;
    //console.log("COLOR",this.colordata);
    this.dataLoaded = true;
    this.pageSize = this.messageService.pageSize;

    this.displayData = {
      pageName: 'Support Group Map',
      openModalButton: 'Add Support Group Map',
      breadcrumb: 'Support Group Map',
      folderName: 'Support Group Map',
      tabName: 'Support Group Map',
    };
    this.rest.getclient({ offset: 0, limit: 1000 }).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.values.unshift({ id: 0, name: 'Select Client' });
        this.clients = this.respObject.details.values;
        this.clientSelected = 0;
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });

    const columnDefinitions = [
      // {
      //   id: 'delete',
      //   field: 'id',
      //   excludeFromHeaderMenu: true,
      //   formatter: Formatters.deleteIcon,
      //   minWidth: 30,
      //   maxWidth: 30,
      // },
      // {
      //   id: 'edit',
      //   field: 'id',
      //   excludeFromHeaderMenu: true,
      //   formatter: Formatters.editIcon,
      //   minWidth: 30,
      //   maxWidth: 30,
      //   onCellClick: (e: Event, args: OnEventArgs) => {
      //     this.isError = false;
      //     this.reset();
      //     console.log("\n ARGS DATA CONTEXT  :: "+JSON.stringify(args.dataContext));
      //     this.selectedId = args.dataContext.id;
      //     this.clientSelected = args.dataContext.fromclientid;
      //     this.clientName = args.dataContext.fromclientname;
      //     this.orgName = args.dataContext.fromorgnname;
      //     this.orgSelected1 = args.dataContext.fromorgnid;
      //     this.toclientSelected1 = args.dataContext.toclientid;
      //     this.toclientName = args.dataContext.toclientname;
      //     this.orgSelectedto1 = args.dataContext.toorgnid;
      //     this.orgNameto = args.dataContext.toorgnname;
      //     this.fromRecordDiffTypename = args.dataContext.fromdifftypename;
      //     this.fromRecordDiffName=args.dataContext.fromdiffname;
      //     //console.log("ORG",this.orgSelectedto)
      //     this.clinentToChange('u');
      //     this.getOrganization('u');
      //     this.getToOrganization('u');
      //     this.isEdit=true;
      //     this.modalReference = this.modalService.open(this.content, {});
      //     this.modalReference.result.then((result) => {
      //     }, (reason) => {

      //     });
      //   }
      // },
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
          collection: [{ value: '', label: 'All' }, { value: true, label: 'True' }, { value: false, label: 'False' }],
          model: Filters.singleSelect,

          filterOptions: {
            autoDropWidth: true
          },
        }, minWidth: 40
      }, {
        id: 'ismanagement', name: 'Management Group', field: 'ismanagement', sortable: true, filterable: true, formatter: Formatters.checkmark,
        filter: {
          collection: [{ value: '', label: 'All' }, { value: true, label: 'True' }, { value: false, label: 'False' }],
          model: Filters.singleSelect,

          filterOptions: {
            autoDropWidth: true
          },
        }, minWidth: 40
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
    //this.clinentToChange('i');
    this.getOrganization('i');
    this.getToOrganization('i');
    this.isEdit = false;
    this.modalService.open(content, { size: 'md' }).result.then((result) => {
    }, (reason) => {

    });
  }

  reset() {
    this.clientSelected = 0;
    this.toclientSelected = 0;
    this.orgSelected = '';
    this.orgSelectedto = [];
    this.grpSelected = [];
    this.supportgroups = [];
  }

  onOrgChange(index) {
    this.orgName = this.organization[index].organizationname;
    this.getSupportgrpName('i');
  }

  onOrgChangeto(index) {
    this.orgNameto = index.organizationname;
  }

  onSupportgrpChange(index) {
    this.sprtgrpName = index.supportgrpname;
    //console.log(this.grpSelected);
  }

  onClientChange(index: any) {
    this.clientName = this.clients[index].name;
  }

  getOrganization(type) {
    this.rest.getorganizationclientwisenew({ clientid: Number(this.clientId), mstorgnhirarchyid: Number(this.orgnId) }).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({ id: 0, organizationname: 'Select Organization' });
        this.organization = this.respObject.details;
        if (type === 'i') {
          this.orgSelected = 0;
        }
        else {
          this.orgSelected = this.orgSelected1;
        }
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getSupportgrpName(type) {
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgSelected),
    }
    this.rest.getmstsupportgroupbycopyable(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.supportgroups = this.respObject.details;
        this.selectAll(this.supportgroups);
        //this.respObject.details.values.unshift({id: 0, supportgrpname: 'Select Support Group Name'});
        if (type === 'i') {
          this.grpSelected = [];
        }
        else {
          //this.grpSelected = this.grpSelected1;
        }
      } else {
        this.isError = true;
        //this.notifier.notify('error', this.respObject.message);

        this.notifier.notify('error', this.respObject.message)
      }
    }, function (err) {

    });
  }

  // onToClientChange(index: any) {
  //   this.toclientName = this.toclients[index].name;
  //   this.getToOrganization('i');
  // }

  getToOrganization(type) {
    this.rest.getorganizationclientwisenew({ clientid: Number(this.clientId), mstorgnhirarchyid: Number(this.orgnId) }).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.organizationto = this.respObject.details;
        this.selectAll(this.organizationto);
        if (type === 'i') {
          this.orgSelectedto = [];
        }
        else {
          this.orgSelectedto.push(Number(this.orgSelectedto1));
          //console.log("ORGTO",this.orgSelectedto)
        }
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }



  save() {
    for (let i = 0; i < this.orgSelectedto.length; i++) {
      //console.log("OrgTo",this.orgSelectedto[i]);
      this.toOrg = this.orgSelectedto[i];
    }
    if (this.grpSelected.length === 0 || this.orgSelectedto.length === 0) {
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
      //console.log(this.grpSelected,this.orgSelectedto);
    }
    else {
      const data = {
        fromclientid: Number(this.clientId),
        frommstorgnhirarchyid: Number(this.orgSelected),
        toclientid: Number(this.clientId),
        tomstorgnhirarchyids: this.orgSelectedto,
        fromgroupids: this.grpSelected
      };

      //console.log("DATA", JSON.stringify(data));
      if (!this.messageService.isBlankField(data)) {
        if (this.orgSelected != Number(this.toOrg)) {
          //console.log("OrgFromTo",this.orgSelected,toOrg)
          this.rest.insertclientsupportgroupfromto(data).subscribe((res) => {
            this.respObject = res;
            if (this.respObject.success) {
              this.isError = false;
              const id = this.respObject.details;
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
        }
        else {
          this.notifier.notify('error', this.messageService.SAME_ORGANIZATION);
        }
      }
      else {
        this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
      }
    }
  }

  update() {
    // const data = {
    //   id: this.selectedId,
    //   clientid: Number(this.clientId),
    //   mstorgnhirarchyid: Number(this.orgSelected),
    //   roleid: Number(this.roleSelected),
    //   groupid: Number(this.grpSelected)

    // };
    // console.log(JSON.stringify(data))
    // if (!this.messageService.isBlankField(data)) {

    //   this.rest.updatemapldapgrouprole(data).subscribe((res) => {
    //     this.respObject = res;
    //     if (this.respObject.success) {
    //       this.isError = false;
    //       this.modalReference.close();
    //       this.messageService.sendAfterDelete(this.selectedId);
    //       this.dataLoaded = true;
    //       this.messageService.setRow({
    //           id: this.selectedId,
    //           clientid: Number(this.clientId),
    //           mstorgnhirarchyid: Number(this.orgSelected),
    //           mstorgnhirarchyname: this.orgName,
    //           groupid :Number(this.grpSelected),
    //           groupname: this.grpName,
    //           roleid: Number(this.roleSelected),
    //           rolename: this.roleName
    //       });
    //       //this.getTableData();
    //       this.notifier.notify('success', this.messageService.EDIT_SUCCESS);
    //     } else {
    //       this.isError = true;
    //       this.notifier.notify('error', this.respObject.message);
    //     }
    //   }, (err) => {
    //     this.isError = true;
    //     this.notifier.notify('error', this.messageService.SERVER_ERROR);
    //   });
    // }else {
    //   this.isError = true;
    //   this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    // }
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
    this.rest.getallclientsupportgroupnew(data).subscribe((res) => {
      this.respObject = res;
      for (let i = 0; i < this.respObject.details.values.length; i++) {
        this.respObject.details.values[i].hascatalog = this.respObject.details.values[i].hascatalog === 'Y';
        this.respObject.details.values[i].ismanagement = this.respObject.details.values[i].ismanagement === 'Y';
      }
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


  selectAll(items: any[]) {
    let allSelect = items => {
      items.forEach(element => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }



}
