import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {RestApiService} from '../rest-api.service';
import {Filters, Formatters, OnEventArgs} from 'angular-slickgrid';
import {MessageService} from '../message.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-record-terms',
  templateUrl: './record-terms.component.html',
  styleUrls: ['./record-terms.component.css']
})
export class RecordTermsComponent implements OnInit, OnDestroy {
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
  baseFlag: boolean;
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
  termName: string;
  termTypeSelected: number;
  termTypes = [];
  termValue: string;
  termTypeName: string;
  clientSelectedName: string;
  orgSelectedName: string;
  @ViewChild('content1') private content1;
  private modalReference: NgbModalRef;
  showValue: boolean;
  isdisable: boolean;
  selectedId: number;
  userClientName: any;
  action: any;
  termlist = [];
  termselected: number;
  isUpdate: boolean;
  private termseq: number;
  clients = [];
  clientOrgnId: any;
  notAdmin: boolean;

  constructor(private rest: RestApiService, private messageService: MessageService,
              private route: Router, private modalService: NgbModal, notifier: NotifierService) {
    this.notifier = notifier;

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
              console.log(JSON.stringify(item));
              this.rest.deletemstrecordterms({id: item.id}).subscribe((res) => {
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
    this.dataLoaded = true;
    this.pageSize = this.messageService.pageSize;
    this.userClientName = this.messageService.clientname;

    this.displayData = {
      pageName: 'Maintain Record Term',
      openModalButton: 'Add Record Term',
      breadcrumb: 'Record Term',
      folderName: 'All Record Term',
      tabName: 'Record Term',
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
          this.resetValues();
          this.termTypes = [];
          this.selectedId = args.dataContext.id;
          this.clientId = args.dataContext.clientid;
          this.clientSelectedName = args.dataContext.clientname;
          this.orgSelectedName = args.dataContext.mstorgnhirarchyname;
          this.termName = args.dataContext.termname;
          this.orgSelected = args.dataContext.mstorgnhirarchyid;
          this.termTypeSelected = args.dataContext.termtypeid;
          this.termValue = args.dataContext.termvalue;
          this.termTypeName = args.dataContext.termtypename;
          this.gettermType(this.termTypeSelected);

          if (Number(this.termTypeSelected) === 2) {
            this.showValue = true;
            this.isdisable = false;
            // this.termValue = '';

          } else if (Number(this.termTypeSelected) === 4) {
            this.showValue = true;
            this.isdisable = true;
            // this.termValue = 'DD-MM-YY';
          } else if (Number(this.termTypeSelected) === 5) {
            this.showValue = true;
            this.isdisable = true;
            // this.termValue = 'HH-MM-SS';
          } else {
            this.showValue = false;
            this.isdisable = false;
            this.termValue = '';

          }
          // this.selectedId = args.dataContext.id;
          // this.moduleName = args.dataContext.modulename;
          // this.description = args.dataContext.moduledescription;
          this.modalReference = this.modalService.open(this.content1, {});
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },
      {
        id: 'organization', name: 'Organization ', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'termname', name: 'Term Name ', field: 'termname', sortable: true, filterable: true
      },
      {
        id: 'termtypename', name: 'Term Type Name ', field: 'termtypename', sortable: true, filterable: true
      },
      {
        id: 'termvalue', name: 'Term Value', field: 'termvalue', sortable: true, filterable: true
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
    this.resetValues();
    if (this.baseFlag) {
      this.getClients();
    } else {
      this.clientSelected = this.clientId;
      this.clientOrgnId = this.orgId;
      this.getOrganization(this.clientId, this.orgId);
    }
    this.gettermType(this.termTypeSelected);
    this.modalService.open(content, {size: 'sm'}).result.then((result) => {
    }, (reason) => {

    });
  }

  getClients() {
    this.rest.getallclientnames().subscribe((res: any) => {
      if (res.success) {
        res.details.unshift({id: 0, name: 'Select Client'});
        this.clients = res.details;
        this.clientSelected = 0;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  resetValues() {
    //this.organization = [];
    if (this.baseFlag) {
      this.clientSelected = 0;
      this.organization = [];
    }
    this.orgSelected = 0;
    this.termName = '';
    this.termTypeSelected = 0;
    this.termValue = '';
    this.isUpdate = false;
    this.showValue = false;
    this.termValue = '';
    this.termTypeSelected = 0;
    this.action = '1';
    this.termseq = 0;
    this.termTypeName = '';
  }

  update() {
    const data = {
      id: this.selectedId,
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgSelected),
      termname: this.termName,
      termtypeid: Number(this.termTypeSelected),
    };
    if (!this.messageService.isBlankField(data)) {
      data['termvalue'] = this.termValue;
      this.rest.updatemstrecordterms(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          const id = this.respObject.details;
          this.messageService.sendAfterDelete(this.selectedId);
          this.dataLoaded = true;
          this.messageService.setRow({
            id: this.selectedId,
            clientid: this.clientId,
            clientname: this.clientSelectedName,
            mstorgnhirarchyid:this.orgSelected,
            mstorgnhirarchyname: this.orgSelectedName,
            termname: this.termName,
            termtypename: this.termTypeName,
            termvalue: this.termValue,
            termtypeid: this.termTypeSelected,

          });
          this.isError = false;
          this.modalReference.close();
          // this.getTableData();
          this.notifier.notify('success', this.messageService.EDIT_SUCCESS);
        } else {
          // this.isError = true;
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        // this.isError = true;
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    } else {
      // this.isError = true;
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }
  }

  save() {
    const data = {
      clientid: Number(this.clientSelected),
      mstorgnhirarchyid: Number(this.orgSelected),
      termname: this.termName,
      termtypeid: Number(this.termTypeSelected),
    };
    //
    if (!this.messageService.isBlankField(data)) {
      data['termvalue'] = this.termValue;
      data['termseq'] = this.termseq;
      // console.log('data===========' + JSON.stringify(data));
      this.rest.addmstrecordterms(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          const id = this.respObject.details;
          this.messageService.setRow({
            id: id,
            clientid: Number(this.clientSelected),
            clientname: this.clientSelectedName,
            mstorgnhirarchyid:this.orgSelected,
            mstorgnhirarchyname: this.orgName,
            termname: this.termName,
            termtypename: this.termTypeName,
            termvalue: this.termValue,
            termtypeid: this.termTypeSelected,

          });
          this.totalData = this.totalData + 1;
          this.messageService.setTotalData(this.totalData);
          this.isError = false;
          this.resetValues();
          // this.getTableData();
          this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
        } else {
          // this.isError = true;
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        // this.isError = true;
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    } else {
      // this.isError = true;
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }
  }

  onOrgChange(index) {
    this.orgName = this.organization[index].organizationname;
    // console.log('ORG', this.orgSelected, this.clientId);
  }

  gettermType(termType) {
    this.rest.getmsttermtype({offset: 0, limit: 100}).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.values.unshift({id: 0, termtypename: 'Select Term Type'});
        this.termTypes = this.respObject.details.values;
        this.termTypeSelected = termType;
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.isError = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onTermTypeChange(index) {
    this.termTypeName = this.termTypes[index].termtypename;
    // console.log('>>>>>>>>>', this.termTypeName);
    if (Number(this.termTypeSelected) === 2) {
      this.showValue = true;
      this.isdisable = false;
      this.termValue = '';

    } else if (Number(this.termTypeSelected) === 4) {
      this.showValue = true;
      this.isdisable = true;
      this.termValue = 'DD-MM-YY';
    } else if (Number(this.termTypeSelected) === 5) {
      this.showValue = true;
      this.isdisable = true;
      this.termValue = 'HH-MM-SS';
    } else {
      this.showValue = false;
      this.isdisable = false;
      this.termValue = '';

    }
  }

  getOrganization(clientId, orgId) {
    const data = {
      clientid: Number(clientId),
      mstorgnhirarchyid: Number(orgId)
    };
    this.rest.getorganizationclientwisenew(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, organizationname: 'Select Organization'});
        this.organization = this.respObject.details;
        this.orgSelected = 0;
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.isError = true;
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
      offset: offset,
      limit: limit,
      clientid: this.clientId,
      mstorgnhirarchyid: this.orgId
    };
    // console.log(data);
    this.rest.getmstrecordterms(data).subscribe((res) => {
      this.respObject = res;
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

  addTerm() {
    this.isUpdate = false;
    this.termName = '';
    this.termValue = '';
    this.termTypeSelected = 0;
    this.termseq = 0;
  }

  mapTerm() {
    this.termName = '';
    this.isUpdate = true;
    this.termlist = [];
    this.termValue = '';
    this.termTypeName = '';
    this.termTypeSelected = 0;
    this.gettermlist();
    //console.log("ACtion", this.action)
  }

  gettermlist() {
    this.rest.listmstrecordterms({clientid: this.clientId, mstorgnhirarchyid: this.orgId}).subscribe((res: any) => {
      if (res.success) {
        res.details.unshift({id: 0, termname: 'Select Term'});
        this.termlist = res.details;
        this.termselected = 0;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  ontermchange(selectedIndex: any) {
    this.termName = this.termlist[selectedIndex].termname;
    this.termTypeSelected = this.termlist[selectedIndex].termtypeid;
    this.termseq = this.termlist[selectedIndex].termseq;
    this.termValue = this.termlist[selectedIndex].termvalue;
    this.termTypeName = this.termlist[selectedIndex].termtypename;
    // console.log('<<<<<<<<<<<<<<<<', this.termselected, this.termTypeName);
    if (Number(this.termTypeSelected) === 2) {
      this.showValue = true;
      this.isdisable = false;
    } else if (Number(this.termTypeSelected) === 4) {
      this.showValue = true;
      this.isdisable = true;
    } else if (Number(this.termTypeSelected) === 5) {
      this.showValue = true;
      this.isdisable = true;
    } else {
      this.showValue = false;
      this.isdisable = false;
      this.termValue = '';

    }
  }

  onClientChange(selectedIndex: any) {
    this.clientSelectedName = this.clients[selectedIndex].name;
    this.clientOrgnId = this.clients[selectedIndex].orgnid;
    this.getOrganization(this.clientSelected, this.clientOrgnId);
  }
}
