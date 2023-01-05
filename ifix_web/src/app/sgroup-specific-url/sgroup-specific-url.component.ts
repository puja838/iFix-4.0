import {Component, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {RestApiService} from '../rest-api.service';
import {MessageService} from '../message.service';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {Formatters, OnEventArgs} from 'angular-slickgrid';

@Component({
  selector: 'app-sgroup-specific-url',
  templateUrl: './sgroup-specific-url.component.html',
  styleUrls: ['./sgroup-specific-url.component.css']
})
export class SgroupSpecificUrlComponent implements OnInit {
  displayed = true;
  moduleName: string;
  description: string;
  totalData = 0;
  show: boolean;
  selected: number;
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
  moduleSelected: any;
  modules: any;
  des: string;
  totalPage: number;
  selectedId: number;
  private baseFlag: any;
  private adminAuth: Subscription;
  @ViewChild('content1') private content1;
  private modalReference: NgbModalRef;
  organizationId = '';
  organizationName = '';
  ticketTypeName = '';
  ticketType = '';
  formTicketTypeList = [];
  organizationList = [];
  loginUserOrganizationId: number;
  seqNo = 1;
  recordDifTypeId: number;
  recordTypeStatus = [];
  fromRecordDiffTypeId = '';
  fromRecordDiffTypeSeqno = '';
  fromRecordDiffId = '';
  fromPropLevels = [];
  fromlevelid: number;
  urlKeySelected: number;
  urlName: string;
  urlKey: string;
  urlArr = [];
  urlSelected: any;
  support_group = [];
  sgroupSelected = [];
  seq: any;
  fromRecordDiffName: any;
  grpName: any;
  groupsId = [];

  constructor(private rest: RestApiService, private messageService: MessageService,
              private route: Router, private modalService: NgbModal, private notifier: NotifierService) {
    this.messageService.getCellChangeData().subscribe(item => {
      // console.log(item);
      switch (item.type) {
        case 'delete':
          // console.log('deleted');
          if (!this.del) {
            this.notifier.notify('error', 'You do not have delete permission');
          } else {
            if (confirm('Are you sure?')) {
              //console.log(JSON.stringify(item));
              this.rest.deleteassigncommontiles({id: item.id}).subscribe((res) => {
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
    this.messageService.getSelectedItemData().subscribe(selectedTitles => {
      if (selectedTitles.length > 0) {
        this.show = true;
        this.selected = selectedTitles.length;
      } else {
        this.show = false;
      }
    });
  }

  ngOnInit(): void {
    this.totalPage = 0;
    // this.add = true;
    // this.del = true;
    // this.edit = true;
    // this.view = true;
    this.dataLoaded = true;
    this.pageSize = this.messageService.pageSize;
    this.displayData = {
      pageName: 'Maintain Support Group Specific URL Mapping',
      openModalButton: 'Map Support Group Specific URL',
      breadcrumb: 'Mdules',
      folderName: 'Support Group Specific URL',
      tabName: 'Map Support Group Specific URL'
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
          this.formTicketTypeList = [];
          this.sgroupSelected = [];
          this.support_group = [];
          this.urlArr = [];
          this.selectedId = args.dataContext.id;
          this.organizationId = args.dataContext.mstorgnhirarchyid;
          this.fromRecordDiffTypeId = args.dataContext.recorddifftypeid;
          this.fromRecordDiffId = args.dataContext.recorddiffid;
          this.grpName = args.dataContext.supportgrpname;
          this.sgroupSelected.push(Number(args.dataContext.supportgrpid));
          //console.log(this.sgroupSelected)
          this.urlSelected = Number(args.dataContext.urlkey);
          //this.sgroupSelected.push(Number(args.dataContext.supportgrpid));

          this.getUrlKey(this.clientId, this.organizationId);
          this.getGroupData();

          for (let i = 0; i < this.recordTypeStatus.length; i++) {
            if (Number(this.recordTypeStatus[i].id) === Number(this.fromRecordDiffTypeId)) {
              this.seq = this.recordTypeStatus[i].seqno;
              this.getPropertyValue(this.seq);
            }
          }

          this.modalReference = this.modalService.open(this.content1, {});
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },
      // {
      //   id: 'clientName', name: 'Client', field: 'clientname', sortable: true, filterable: true
      // },
      {
        id: 'orgn', name: 'Organization', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'ticketType', name: 'Property Type ', field: 'recorddifferentiationtypename', sortable: true, filterable: true
      },
      {
        id: 'fromrecorddiffname', name: 'Property ', field: 'recorddifferentiationname', sortable: true, filterable: true
      },
      {
        id: 'urlname', name: 'URL ', field: 'urlname', sortable: true, filterable: true
      },
      {
        id: 'supportgrpname', name: 'Support Group ', field: 'supportgrpname', sortable: true, filterable: true
      },

    ];

    this.clientId = this.messageService.clientId;
    this.messageService.setColumnDefinitions(columnDefinitions);
    // this.onPageLoad();
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.baseFlag = this.messageService.baseFlag;
      this.loginUserOrganizationId = this.messageService.orgnId;
      this.edit = this.messageService.edit;
      this.del = this.messageService.del;
      this.onPageLoad();
    } else {
      this.adminAuth = this.messageService.getClientUserAuth().subscribe(auth => {
        this.view = auth[0].viewFlag;
        this.add = auth[0].addFlag;
        this.edit = auth[0].editFlag;
        this.del = auth[0].deleteFlag;
        this.clientId = auth[0].clientid;
        this.baseFlag = auth[0].baseFlag;
        this.loginUserOrganizationId = auth[0].mstorgnhirarchyid;
        //console.log('auth1===' + JSON.stringify(auth));
        this.onPageLoad();
      });
    }
  }

  onPageLoad() {
    // this.getTableData();
    this.getorganizationclientwise();
    this.getRecordDiffType();

  }

  openModal(content) {


    this.isError = false;
    this.resetValues();

    this.modalService.open(content, {size: 'sm'}).result.then((result) => {
    }, (reason) => {

    });

  }

  getTableData() {
    // if (!this.view) {
    //   this.notifier.notify('error', 'You do not have view permission');
    // } else {
    this.getData({
      offset: this.messageService.offset, 
      limit: this.messageService.limit
    });
    // }
  }

  getData(paginationObj) {
    const offset = paginationObj.offset;
    const limit = paginationObj.limit;
    this.dataLoaded = false;
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: this.loginUserOrganizationId,
      offset: offset,
      limit: limit
    };
    console.log(data);
    this.rest.getassigncommontiles(data).subscribe((res) => {
      this.respObject = res;
      //console.log('>>>>>>>>>>> ', JSON.stringify(res));
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

  getRecordDiffType() {
    this.rest.getRecordDiffType().subscribe((res: any) => {
      if (res.success) {
        this.recordTypeStatus = res.details;
      }
    });
  }

  onUrlKeyChange(selectedIndex: any) {
    this.urlKey = this.urlArr[selectedIndex].Urlkeyname;

  }


  getGroupData() {
    this.rest.getgroupbyorgid({
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.organizationId),
      // offset: 0,
      // limit: 100
    }).subscribe((res1) => {
      this.respObject = res1;
      if (this.respObject.success) {
        this.support_group = this.respObject.details;
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });

  }

  getUrlKey(clientId, orgId) {
    this.rest.geturlkey({clientid: Number(clientId), mstorgnhirarchyid: Number(orgId)}).subscribe((res) => {
      this.respObject = res;
      this.urlArr = this.respObject.details.values;
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }


  resetValues() {
    this.organizationId = '';
    this.fromRecordDiffTypeId = '';
    this.fromRecordDiffId = '';
    this.urlArr = [];
    this.formTicketTypeList = [];
    this.fromRecordDiffTypeId = '';
    this.support_group = [];
    this.fromPropLevels = [];

    this.fromlevelid = 0;
    this.urlSelected = '';
    this.sgroupSelected = [];
    this.groupsId = [];
  }


  save() {
    if (this.sgroupSelected.length === 0) {
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    } else {
      const data = {
        clientid: this.clientId,
        mstorgnhirarchyid: Number(this.organizationId),
        recorddiffid: Number(this.fromRecordDiffId),
        urlkey: Number(this.urlSelected),
        groupid: this.sgroupSelected

      };
      if (this.fromPropLevels.length === 0) {
        data['recorddifftypeid'] = Number(this.fromRecordDiffTypeId);
      } else {
        data['recorddifftypeid'] = Number(this.fromlevelid);
      }

      if (!this.messageService.isBlankField(data)) {
        //console.log(JSON.stringify(data));
        this.rest.addassigncommontiles(data).subscribe((res) => {
          this.respObject = res;
          if (this.respObject.success) {
            this.isError = false;
            this.resetValues();
            this.getTableData();
            this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
          } else {
            this.notifier.notify('error', this.respObject.message);
          }
        }, (err) => {
          this.isError = true;
          this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
      } else {
        this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
      }
    }
  }

  update() {
    if (this.sgroupSelected.length === 0) {
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    } else {
      const data = {
        id: this.selectedId,
        clientid: this.clientId,
        mstorgnhirarchyid: Number(this.organizationId),
        recorddiffid: Number(this.fromRecordDiffId),
        urlkey: Number(this.urlSelected),
        groupid: this.sgroupSelected

      };
      if (this.fromPropLevels.length === 0) {
        data['recorddifftypeid'] = Number(this.fromRecordDiffTypeId);
      } else {
        data['recorddifftypeid'] = Number(this.fromlevelid);
      }
      //console.log('>>>>>>>>>>>>> ', JSON.stringify(data));
      // return false;
      if (!this.messageService.isBlankField(data)) {
        this.rest.updateassigncommontiles(data).subscribe((res) => {
          this.respObject = res;
          if (this.respObject.success) {
            this.isError = false;
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
  }

  getrecordbydifftype(index) {
    if (index !== 0) {
      let seqNumber = '';
      this.fromRecordDiffName = this.recordTypeStatus[index - 1].typename;
      // if (flag === 'from') {
      this.fromRecordDiffTypeId = this.recordTypeStatus[index - 1].id;
      // this.isfromtext = this.recordTypeStatus[index - 1].istextfield;
      seqNumber = this.recordTypeStatus[index - 1].seqno;
      this.fromPropLevels = [];
      // this.fromValue = '';
      this.formTicketTypeList = [];
      // } else {
      //   this.toRecordDiffTypeId = this.recordTypeStatus[index - 1].id;
      //   this.istotext = this.recordTypeStatus[index - 1].istextfield;
      //   seqNumber = this.toRecordDiffTypeSeqno;
      //   this.toPropLevels = [];
      //   this.toValue = '';
      //   this.toTicketTypeList = [];
      // }
      const data = {
        clientid: this.clientId,
        mstorgnhirarchyid: Number(this.organizationId),
        seqno: Number(seqNumber),
      };
      this.rest.getcategorylevel(data).subscribe((res: any) => {
        if (res.success) {
          if (res.details.length > 0) {
            res.details.unshift({id: 0, typename: 'Select Property Level'});
            // if (flag === 'from') {
            this.fromPropLevels = res.details;
            this.fromlevelid = 0;
            // } else {
            //   this.toPropLevels = res.details;
            //   this.tolevelid = 0;
            // }
          } else {
            // if (flag === 'from') {
            this.fromPropLevels = [];
            // } else {
            // this.toPropLevels = [];
            //}
            this.getPropertyValue(Number(seqNumber));
          }
        } else {
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });

    }
  }

  getPropertyValue(seqNumber) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      seqno: seqNumber
    };
    this.rest.getrecordbydifftype(data).subscribe((res: any) => {
      if (res.success) {
        // if (flag === 'from') {
        this.formTicketTypeList = res.details;

        // } else {
        //   this.toTicketTypeList = res.details;
        //   this.toRecordDiffId = '';
        // }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      //console.log(err);
    });
  }

  onOrgChange(index: any) {
    this.organizationName = this.organizationList[index - 1].organizationname;
    this.getUrlKey(this.clientId, this.organizationId);
    this.getGroupData();
  }

  ongrpChange(index: any) {
    this.grpName = index.supportgroupname;
  }

  getorganizationclientwise() {
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.loginUserOrganizationId)
    };
    this.rest.getorganizationclientwisenew(data).subscribe((res: any) => {
      if (res.success) {
        this.organizationList = res.details;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      //console.log(err);
    });
  }

  onLevelChange(selectedIndex: any) {
    let seq;
    seq = this.fromPropLevels[selectedIndex].seqno;
    this.getPropertyValue(seq);
  }
}
