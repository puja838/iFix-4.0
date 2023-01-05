import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {MessageService} from '../message.service';
import {NotifierService} from 'angular-notifier';
import {RestApiService} from '../rest-api.service';
import {Router} from '@angular/router';
import {Editors, Filters, Formatters, OnEventArgs} from 'angular-slickgrid';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {CustomInputEditor} from '../custom-inputEditor';
import {Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-map-state',
  templateUrl: './map-state.component.html',
  styleUrls: ['./map-state.component.css']
})
export class MapStateComponent implements OnInit, OnDestroy {

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
  isLoading = false;
  stateTyps = [];
  stateTypSelected: any;
  stateName: string;
  stateTypName: any;
  action: any;
  states = [];
  stateSelected: number;
  isUpdate: boolean;
  private seqno: number;

  constructor(private rest: RestApiService, private messageService: MessageService, private route: Router,
              private modalService: NgbModal, notifier: NotifierService) {
    this.notifier = notifier;
    this.messageService.getCellChangeData().subscribe(item => {
      switch (item.type) {

        case 'delete':
          // console.log('deleted');
          if (!this.del) {
            this.notifier.notify('error', 'You do not have delete permission');
          } else {
            if (confirm('Are you sure?')) {
              this.rest.deletestate({
                id: item.id
              }).subscribe((res) => {
                this.respObject = res;
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


  }

  ngOnInit() {
    this.clientId = this.messageService.clientId;
    this.orgnId = this.messageService.orgnId;
    this.dataLoaded = false;

    this.pageSize = this.messageService.pageSize;

    // this.getBaseParent();

    this.displayData = {
      pageName: 'Maintain State Mapping',
      openModalButton: 'Add State Mapping',
      breadcrumb: ' ',
      folderName: 'All State Mapping ',
      tabName: 'State Mapping',
    };
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
          this.reset();
          // console.log(args.dataContext);
          this.selectedId = args.dataContext.id;
          this.orgSelected = Number(args.dataContext.mstorgnhirarchyid);
          this.stateTypSelected = args.dataContext.statetypeid;
          this.stateTypName = args.dataContext.statetypename;
          this.stateName = args.dataContext.statename;
          this.orgName = args.dataContext.mstorgnhirarchyname;
          this.getstateTyp();

          this.modalReference = this.modalService.open(this.content1, {});
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },
      // {id: 'id', name: 'Id', field: 'id', sortable: true, maxWidth: 40, filterable: true},
      // {
      //   id: 'clientname', name: 'Client Name', field: 'clientname', sortable: true, filterable: true
      // },
      {
        id: 'organization', name: 'Organization', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'statetype', name: 'State Type', field: 'statetypename', sortable: true, filterable: true
      },
      {
        id: 'statename', name: 'State Name', field: 'statename', sortable: true, filterable: true
      },

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
    const data = {
      clientid: Number(this.clientId) , 
      mstorgnhirarchyid: Number(this.orgId)
    };
    this.rest.getorganizationclientwisenew(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, organizationname: 'Select Organization'});
        this.organaisation = this.respObject.details;
        this.orgSelected = 0;
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });


    // this.getTableData();
  }

  changeRouting(path: string) {
    this.messageService.changeRouting(path);
  }


  reset() {
    this.orgSelected = 0;
    this.stateName = '';
    this.stateTypSelected = '';
    this.stateTyps = [];
    this.isUpdate = false;
    this.action = '1';
    this.seqno = 0;
  }

  onstateTypChange(index: any) {
    this.stateTypName = this.stateTyps[index - 1].name;

  }


  openModal(content) {
    // this.isError = false;
    // this.isUpdate = false;
    this.reset();
    this.modalService.open(content).result.then((result) => {
    }, (reason) => {
    });
  }

  onOrgChange(index: any) {
    this.orgName = this.organaisation[index].organizationname;
    this.getstateTyp();
  }


  getstateTyp() {
    const data = {
      'clientid': Number(this.clientId),
      'mstorgnhirarchyid': Number(this.orgSelected),
      'type': 2
    }
    this.rest.getworklowutilitylist(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {

        this.stateTyps = this.respObject.details;
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });

  }


  update() {

    const data = {
      'id': this.selectedId,
      'clientid': Number(this.clientId),
      'mstorgnhirarchyid': Number(this.orgSelected),
      'statetypeid': Number(this.stateTypSelected),
      'statename': this.stateName
    };

    // console.log('data' + JSON.stringify(data));

    if (!this.messageService.isBlankField(data)) {

      this.rest.updatestate(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;

          this.modalReference.close();

          //console.log("id "+ )
          this.messageService.sendAfterDelete(this.selectedId);
          this.dataLoaded = true;
          this.messageService.setRow({
            id: this.selectedId,
            mstorgnhirarchyname: this.orgName,
            mstorgnhirarchyid: this.orgSelected,
            statetypeid: this.stateTypSelected,
            statetypename: this.stateTypName,
            statename: this.stateName

          });

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

    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgSelected),
      statetypeid: Number(this.stateTypSelected),
      statename: this.stateName
    };
    // console.log('data' + JSON.stringify(data));
    if (!this.messageService.isBlankField(data)) {
      data['seqno'] = this.seqno;
      // console.log('data' + JSON.stringify(data));
      this.rest.addstate(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          const id = this.respObject.details;
          this.messageService.setRow({
            id: id,
            mstorgnhirarchyname: this.orgName,
            mstorgnhirarchyid: this.orgSelected,
            statetypeid: this.stateTypSelected,
            statetypename: this.stateTypName,
            statename: this.stateName

          });
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
    this.rest.getstate(data).subscribe((res) => {
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

  addStatus() {
    this.isUpdate = false;
    this.stateName = '';
    this.seqno = 0;
  }

  updateStatus() {
    this.isUpdate = true;
    this.stateName = '';
    this.getstate();
  }

  getstate() {
    const data = {
      'clientid': Number(this.clientId),
      'mstorgnhirarchyid': Number(this.orgId),
      'type': 3
    };
    this.rest.getworklowutilitylist(data).subscribe((res: any) => {
      if (res.success) {
        res.details.unshift({id: 0, name: 'Select State'});
        this.states = res.details;
        this.stateSelected = 0;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);

    });
  }

  onstateChange(selectedIndex: any) {
    this.stateName = this.states[selectedIndex].name;
    this.seqno = this.states[selectedIndex].seqno;
  }
}
