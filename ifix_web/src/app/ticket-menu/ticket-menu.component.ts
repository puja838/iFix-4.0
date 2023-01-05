import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {RestApiService} from '../rest-api.service';
import {Filters, Formatters, OnEventArgs} from 'angular-slickgrid';
import {MessageService} from '../message.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-ticket-menu',
  templateUrl: './ticket-menu.component.html',
  styleUrls: ['./ticket-menu.component.css']
})
export class TicketMenuComponent implements OnInit, OnDestroy {
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
  private notifier: NotifierService;
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
  propertyTypes = [];
  propertyTypeSelected: number;
  propertyValues = [];
  propertyValueSelected: number;
  PropertyValueName: string;
  propertyTypeName: string;
  fields = [];
  fieldSelected: any;
  // fieldName: string;
  fieldValues = [];
  groups = [];
  groupSelected = [];
  supportGroupName: string;
  hideRadio: boolean;
  radioChecked: number;
  users = [];
  userName: string;
  searchUser: FormControl = new FormControl();
  userId: number;
  userSelected: string;
  userLists = [];
  selectable = true;
  removable = true;
  addOnBlur = true;
  hideUser: boolean;
  selectedSuppGroupOrg: number;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  fromPropLevels = [];
  fromlevelid: string;
  seqNumber: number;
  fromRecordDiffTypeStatus: any;
  recordTypeStatus = [];
  fromtickettypedifftypeidstat: any;
  fromstatdifftypename: any;
  fromPropLevelsStat = [];
  fromlevelstatid: any;
  formTicketTypeListStat = [];
  fromtickettypedifftypeid: any;
  fromRecordDiffId: any;
  fromRecordDiffStat: any;
  tostatlabelname: any;
  fromstatdiffname: any;
  updateFlag: boolean;
  selectedId: any;
  @ViewChild('content') private content;
  private modalReference: NgbModalRef;
  fromRecDiffId: any;
  fromCatgRecDiffId: any;
  propertyTypeSelected1: any;
  orgSelected1: any;
  propertyValueSelected1: any;
  propertyTypeSelectedseq: any;
  isCatalog: boolean;

  constructor(private rest: RestApiService, private messageService: MessageService,
              private route: Router, private modalService: NgbModal, notifier: NotifierService) {
    this.notifier = notifier;
    this.messageService.getCellChangeData().subscribe(item => {
      // console.log(item);
      switch (item.type) {
        case 'delete':
          // console.log('deleted');
          if (!this.del) {
            this.notifier.notify('error', this.messageService.DELETE_PERMISSION);
          } else {
            if (confirm('Are you sure?')) {
              // console.log(JSON.stringify(item));
              this.rest.deletemapfunctionalitygrp({id: item.id}).subscribe((res) => {
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
    this.searchUser.valueChanges.subscribe(
      name => {
        const data = {
          loginname: name,
          clientid: Number(this.clientId),
          mstorgnhirarchyid: Number(this.orgSelected),
          groupid: this.groupSelected
        };
        this.isLoading = true;
        if (name !== undefined && name.trim() !== '') {
          this.rest.searchuserbygroupid(data).subscribe((res1) => {
            console.log('data======' + JSON.stringify(data));
            this.respObject = res1;
            this.isLoading = false;
            if (this.respObject.success) {
              this.users = this.respObject.details;
            } else {
              this.notifier.notify('error', this.respObject.message);
            }
          }, (err) => {
            this.isLoading = false;
            this.notifier.notify('error', this.messageService.SERVER_ERROR);
          });
        } else {
          this.isLoading = false;
          this.userName = '';
          this.users = [];
        }
      });
  }

  ngOnInit(): void {
    this.hideRadio = true;
    this.dataLoaded = true;
    this.hideUser = true;
    this.pageSize = this.messageService.pageSize;

    this.displayData = {
      pageName: 'Maintain Ticket Menu Config',
      openModalButton: 'View Ticket Menu Config',
      searchModalButton: 'Search',
      breadcrumb: 'TicketMenuConfig',
      folderName: 'All Ticket Menu Config',
      tabName: 'Ticket Menu Config',
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
      // {
      //   id: 'edit',
      //   field: 'id',
      //   excludeFromHeaderMenu: true,
      //   formatter: Formatters.editIcon,
      //   minWidth: 30,
      //   maxWidth: 30,
      //   onCellClick: (e: Event, args: OnEventArgs) => {


      //     this.isError = false;
      //     this.updateFlag = true;
      //     this.reset();
      //     console.log("\n ARGS DATA CONTEXT  :: "+JSON.stringify(args.dataContext));
      //     this.selectedId = args.dataContext.id;
      //     this.orgSelected1 = args.dataContext.mstorgnhirarchyid;
      //     // this.mstorgnhirarchyname = args.dataContext.mstorgnhirarchyname;
      //     this.propertyTypeSelected1 = args.dataContext.recorddifftypeid;

      //     this.fromtickettypedifftypeidstat = args.dataContext.recorddifftypestatusid;
      //     this.propertyValueSelected1 = args.dataContext.recorddiffid;
      //     this.groupSelected = args.dataContext.groupid
      //     this.fromCatgRecDiffId = args.dataContext.diffid;
      //     //this.priority = args.dataContext.priority;

      //     this.getOrganization(this.clientId, this.orgId,'u');
      //     this.getSupportGroup();
      //     this.getPropertyTypes('u');
      //     this.modalReference = this.modalService.open(this.content, {});
      //     this.modalReference.result.then((result) => {
      //     }, (reason) => {

      //     });
      //   }
      // },
      {
        id: 'organization', name: 'Organization ', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'recorddifftypname', name: 'Property Type ', field: 'recorddifftypname', sortable: true, filterable: true
      },
      {
        id: 'recorddiffname', name: 'Property Value ', field: 'recorddiffname', sortable: true, filterable: true
      },
      {
        id: 'recorddifftypestatusname', name: 'Property Type ', field: 'recorddifftypestatusname', sortable: true, filterable: true
      },
      {
        id: 'recorddiffstatusname', name: 'Property Value ', field: 'recorddiffstatusname', sortable: true, filterable: true
      },
      {
        id: 'mstfunctionailyname',
        name: 'Functionality Desc',
        field: 'mstfunctionailyname',
        sortable: true,
        filterable: true
      },
      {
        id: 'diffname', name: 'Functionality Name', field: 'diffname', sortable: true, filterable: true
      },
      // {
      //   id: 'refusername', name: 'Refer User Name', field: 'refusername', sortable: true, filterable: true
      // },
      {
        id: 'grpname', name: 'Group Name', field: 'grpname', sortable: true, filterable: true
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
        // this.view = auth[0].viewFlag;
        // this.add = auth[0].addFlag;
        this.edit = auth[0].editFlag;
        this.del = auth[0].deleteFlag;
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
    this.getOrganization(this.clientId, this.orgId, 'i');
    this.getPropertyTypes('i');
    this.reset();
    this.rest.getfunctionality().subscribe((res: any) => {
      if (res.success) {
        this.isError = false;
        res.details.unshift({id: 0, name: 'Select Menu'});
        this.fields = res.details;
        this.fieldSelected = 0;
      } else {
        this.isError = true;
        this.notifier.notify('error', res.errorMessage);
      }
    }, (err) => {

    });
    this.modalService.open(content, {size: 'md'}).result.then((result) => {
    }, (reason) => {

    });
  }

  onOrgChange(index) {
    // this.orgName = this.organization[index].organizationname;
    if (this.orgSelected !== 0) {
      if (index !== 0) {
        this.orgName = this.organization[index - 1].organizationname;
        if (this.propertyTypeSelected > 0 || Number(this.fromlevelid) > 0) {
          this.getPropertyValue(Number(this.seqNumber), 'i');
        }
      }
    }
  }

  onLevelChange(index) {
    let seq;
    seq = this.fromPropLevels[index - 1].seqno;
    this.getPropertyValue(seq, 'i');
  }

  getCategoryLevel(seqNumber) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.orgSelected),
      seqno: Number(seqNumber),
    };
    this.rest.getcategorylevel(data).subscribe((res: any) => {
      if (res.success) {
        if (res.details.length > 0) {
          this.fromPropLevels = res.details;
          this.fromlevelid = '';
        } else {
          this.fromPropLevels = [];
          this.getPropertyValue(Number(seqNumber), 'i');
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getfromstatusproperty(index) {
    this.fromstatdiffname = index.typename;
    console.log('STAT Name', this.fromstatdiffname);
    // console.log("To",this.toTicketTypeListCatg)
  }

  getrecordbydifftypestat(index, flag) {
    if (index !== 0) {
      let seqNumber = '';
      this.fromtickettypedifftypeidstat = this.recordTypeStatus[index - 1].id;
      this.fromstatdifftypename = this.recordTypeStatus[index - 1].typename;
      console.log('Stat id: ', this.fromtickettypedifftypeidstat, this.fromstatdifftypename);
      // this.isfromtext = this.recordTypeStatus[index - 1].istextfield;
      seqNumber = this.fromRecordDiffTypeStatus;
      this.fromPropLevelsStat = [];
      this.fromlevelstatid = 0;
      this.formTicketTypeListStat = [];
      const data = {
        clientid: this.clientId,
        mstorgnhirarchyid: Number(this.orgSelected),
        fromrecorddifftypeid: Number(this.propertyTypeSelected),
        fromrecorddiffid: Number(this.propertyValueSelected),
        seqno: Number(seqNumber),
      };

      this.getlebelcatg(data, flag, seqNumber, 'i');
    }
  }

  getStatPropertyValue(seqNumber, flag, type) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.orgSelected),
      fromrecorddifftypeid: Number(this.propertyTypeSelected),
      fromrecorddiffid: Number(this.propertyValueSelected),
      seqno: seqNumber
    };
    this.rest.getmappeddiffbyseq(data).subscribe((res: any) => {
      if (res.success) {
        this.formTicketTypeListStat = res.details;
        if (type === 'i') {
          this.fromRecordDiffStat = '';
        } else {
          this.fromRecordDiffStat = this.fromCatgRecDiffId;
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onLevelChangeStat(selectedIndex: any, type: string) {
    let seq;
    seq = this.fromPropLevelsStat[selectedIndex].seqno;
    this.tostatlabelname = this.fromPropLevelsStat[selectedIndex].typename;
    this.getStatPropertyValue(seq, type, 'i');
  }


  getlebelcatg(data, flag, seqNumber, type) {
    let catSeq;
    this.rest.getlabelbydiffseq(data).subscribe((res: any) => {
      if (res.success) {
        if (res.details.length > 0) {
          res.details.unshift({id: 0, typename: 'Select Property Level'});
          this.fromPropLevelsStat = res.details;
          if (type === 'u') {
            for (let i = 0; i < this.fromPropLevelsStat.length; i++) {
              if (Number(this.fromPropLevelsStat[i].id) === Number(this.fromlevelstatid)) {
                catSeq = Number(this.fromPropLevelsStat[i].seqno);

              }
            }
          }
          // this.fromlevelstatid = 0;

          if (type === 'u') {
            this.formTicketTypeListStat = [];
            this.getStatPropertyValue(catSeq, flag, type);
          }
        } else {
          this.fromPropLevelsStat = [];
          this.formTicketTypeListStat = [];
          this.getStatPropertyValue(Number(seqNumber), flag, type);
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });

  }

  onSupportGroupoOrgChange(index) {
    this.getSupportGroup();
  }


  getOrganization(clientId, orgId, type) {
    const data = {
      clientid: Number(clientId),
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
          this.orgSelected = this.orgSelected1;
        }
        this.selectedSuppGroupOrg = 0;
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getPropertyTypes(type) {
    this.rest.getRecordDiffType().subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, typename: 'Select property type'});
        this.propertyTypes = this.respObject.details;
        this.recordTypeStatus = this.respObject.details;
        this.propertyTypeSelected = 0;
        this.fromRecordDiffTypeStatus = '';
        if (type === 'u') {
          for (let i = 0; i < this.propertyTypes.length; i++) {
            if (Number(this.propertyTypes[i].id) === Number(this.fromtickettypedifftypeid)) {
              this.propertyTypeSelectedseq = this.recordTypeStatus[i].seqno;
              this.getPropertyValue(Number(this.propertyTypeSelectedseq), 'u');
            }
          }
          this.propertyTypeSelected = this.propertyTypeSelected1;
          for (let i = 0; i < this.recordTypeStatus.length; i++) {
            if (Number(this.recordTypeStatus[i].id) === Number(this.fromtickettypedifftypeidstat)) {
              this.fromRecordDiffTypeStatus = this.recordTypeStatus[i].seqno;
              const data = {
                clientid: this.clientId,
                mstorgnhirarchyid: Number(this.orgSelected),
                fromrecorddifftypeid: Number(this.propertyTypeSelected),
                fromrecorddiffid: Number(this.propertyValueSelected),
                seqno: Number(this.fromRecordDiffTypeStatus),
              };
              this.getlebelcatg(data, 'from', Number(this.fromRecordDiffTypeStatus), 'u');
            }
          }
        }
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onPropertyTypeChange(index) {
    this.seqNumber = this.propertyTypes[index].seqno;
    // this.getPropertyValue(seqNumber);
    this.getCategoryLevel(this.seqNumber);
    // const seqNumber = this.propertyTypes[index].seqno;
    // this.propertyTypeName = this.propertyTypes[index].seqno;
  }

  getPropertyValue(seqNumber, type) {
    console.log(type, seqNumber);
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.orgSelected),
      seqno: Number(seqNumber)
    };
    this.rest.getrecordbydifftype(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, typename: 'Select property value'});
        this.propertyValues = this.respObject.details;
        if (type === 'i') {
          this.propertyValueSelected = 0;
        } else {
          this.propertyValueSelected = this.propertyValueSelected1;
          console.log(this.propertyValueSelected);
        }
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onPropertyValueChange(index) {
    this.PropertyValueName = this.propertyValues[index].typename;
  }

  onFieldChange() {
    // this.fieldName = this.fields[selectedIndex].name;
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgSelected),
      funcid: Number(this.fieldSelected),
    };
    if (this.isCatalog) {
      data['iscatalog'] = 1;
      this.rest.getfuncmappingbycatalogtype(data).subscribe((res: any) => {
        if (res.success) {
          this.fieldValues = res.details;
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    } else {
      data['iscatalog'] = 0;
      this.rest.getfuncmappingbytype(data).subscribe((res: any) => {
        if (res.success) {
          this.fieldValues = res.details;
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    }

  }

  getSupportGroup() {
    this.rest.getgroupbyorgid({
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.selectedSuppGroupOrg)
    }).subscribe((res: any) => {
      if (res.success) {
        //res.details.unshift({id: 0, supportgroupname: 'Enter Support Group Name'});
        this.groups = res.details;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      console.log(err);
    });
  }

  onGroupChange(index) {
    this.hideRadio = false;
    this.supportGroupName = index.supportgroupname;
  }

  onRadioButtonChange(selectedValue) {
    this.radioChecked = selectedValue.value;
    if (this.radioChecked === 2) {
      this.hideUser = false;
      // this.rest.getUserByGroup(this.clientId, this.groupSelected).subscribe((res1) => {
      //   this.respObject = res1;
      //   if (this.respObject.success) {
      //     this.isError = false;
      //     this.users = this.respObject.details;
      //   } else {
      //     this.isError = true;
      //     this.notifier.notify('error', this.respObject.errorMessage);
      //   }
      // }, (err) => {
      //   this.isError = true;
      //   this.notifier.notify('error', this.messageService.SERVER_ERROR);
      // });
    } else {
      this.hideUser = true;
      this.users = [];
    }
  }

  save() {
    // const userIds = [];
    // for (let i = 0; i < this.userLists.length; i++) {
    //   userIds.push(this.userLists[i].id);
    // }
    // console.log(this.fromRecordDiffStat);
    const fieldVal = [];
    for (let i = 0; i < this.selectedFieldValue.length; i++) {
      fieldVal.push(this.selectedFieldValue[i].funcdescid);
    }


    if (this.fromPropLevels.length > 0) {
      this.propertyTypeSelected = Number(this.fromlevelid);
    }

    if (this.groupSelected.length === 0 || fieldVal.length === 0) {
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
      console.log(this.fromRecordDiffStat, '||', this.groupSelected, '||', fieldVal);
    } else {
      const data = {
        clientid: Number(this.clientId),
        mstorgnhirarchyid: Number(this.orgSelected),

        mstfunctionailyid: Number(this.fieldSelected),

        diffid: fieldVal,
        groupid: this.groupSelected
      };
      if (!this.isCatalog) {
        if (this.fromPropLevels.length === 0) {
          data['recorddifftypeid'] = Number(this.propertyTypeSelected);
        } else {
          data['recorddifftypeid'] = Number(this.fromlevelid);
        }
        data['recorddiffid'] = Number(this.propertyValueSelected);
      }
      if (Number(this.fieldSelected) > 1) {
        data['recorddiffstatusid'] = this.fromRecordDiffStat;
        if (this.fromPropLevelsStat.length === 0) {
          data['recorddifftypestatusid'] = Number(this.fromtickettypedifftypeidstat);
        } else {
          data['recorddifftypestatusid'] = Number(this.fromlevelstatid);
        }
      }
      // console.log('data============' + JSON.stringify(data));
      if (!this.messageService.isBlankField(data)) {
        // console.log('data============' + JSON.stringify(data));
        this.rest.addmapfunctionalitygrp(data).subscribe((res) => {
          this.respObject = res;
          if (this.respObject.success) {
            this.getTableData();
            this.reset();
            this.isError = false;
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
  }

  reset() {
    this.orgSelected = 0;
    this.propertyTypeSelected = 0;
    this.propertyValueSelected = 0;
    this.fieldSelected = 0;
    this.groupSelected = [];
    this.fieldValues = [];
    this.userLists = [];
    this.fromRecordDiffTypeStatus = '';
    this.fromRecordDiffStat = '';
    this.fromtickettypedifftypeidstat = '';
    this.isCatalog = false;
  }

  get selectedFieldValue() {
    return this.fieldValues
      .filter(opt => opt.checked)
      .map(opt => opt);

  }

  getUserDetails() {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].loginname === this.userSelected) {
        this.userId = this.users[i].id;
        this.userName = this.users[i].name;
        const data = {
          id: this.userId,
          name: this.userName
        };
        this.userLists.push(data);
        // console.log('this.userLists=============' + JSON.stringify(this.userLists));
      }
    }
  }

  removeUser(data): void {
    const index = this.userLists.indexOf(data);
    if (index >= 0) {
      this.userLists.splice(index, 1);
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
      clientid: this.clientId,
      mstorgnhirarchyid: this.orgId,
      offset: offset,
      limit: limit,
      mstfunctionailyid: 1
    };
    console.log(data);
    this.rest.getmapfunctionalitygrp(data).subscribe((res) => {
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
