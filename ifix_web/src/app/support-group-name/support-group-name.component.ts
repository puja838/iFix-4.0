import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {RestApiService} from '../rest-api.service';
import {Filters, Formatters, OnEventArgs} from 'angular-slickgrid';
import {MessageService} from '../message.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-support-group-name',
  templateUrl: './support-group-name.component.html',
  styleUrls: ['./support-group-name.component.css']
})
export class SupportGroupNameComponent implements OnInit {
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
  @ViewChild('content') private content;
  private modalReference: NgbModalRef;
  isEdit: boolean;
  colordata: any;
  supportgrpName:string;
  isCopyCheck:boolean;
  clients=[];
  clientName:any;
  

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
                this.rest.deletemstsupportgroup({id: item.id}).subscribe((res) => {
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
    this.isCopyCheck=false;
    this.dataLoaded = true;
    this.pageSize = this.messageService.pageSize;
    this.displayData = {
      pageName: 'Support Group Name',
      openModalButton: 'Add Support Group Name',
      breadcrumb: 'Support Group Name',
      folderName: 'Support Group Name',
      tabName: 'Support Group Name',
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
          console.log('\n ARGS DATA CONTEXT  :: ' + JSON.stringify(args.dataContext));
          this.selectedId = args.dataContext.id;
          this.clientSelected = args.dataContext.clientid;
          this.orgName = args.dataContext.mstorgnhirarchyname;
          this.orgSelected1 = args.dataContext.mstorgnhirarchyid;
          this.supportgrpName =  args.dataContext.supportgrpname;
          const copyval = args.dataContext.copyable;
          this.isCopyCheck=Number(copyval)===1?true:false;
          this.getOrganization('u');
          this.isEdit = true;
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
        id: 'supportgrpname', name: 'Support Group Name ', field: 'supportgrpname', sortable: true, filterable: true
      },
      {
        id: 'copyable', name: 'Is Copy', field: 'copyable', sortable: true, filterable: true, formatter: Formatters.checkmark,
        filter: {
          collection: [{value: '', label: 'All'}, {value: true, label: 'True'}, {value: false, label: 'False'}],
          model: Filters.singleSelect,

          filterOptions: {
            autoDropWidth: true
          },
        }, minWidth: 40
      },
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
    this.getOrganization('i');
    this.reset();
    this.isEdit = false;
    this.modalService.open(content).result.then((result) => {
    }, (reason) => {

    });
  }

  reset() {
    this.orgSelected = 0;
    this.supportgrpName = '';
    this.isCopyCheck = false;
  }

  onClientChange(index: any) {
    this.clientName = this.clients[index].name;
  }

  onOrgChange(index) {
    this.orgName = this.organization[index].organizationname;
  }


  getOrganization(type) {
    const data = {
      clientid: Number(this.clientId) , 
      mstorgnhirarchyid: Number(this.orgnId)
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
      this.isError = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  save() {
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgSelected),
      supportgrpname:this.supportgrpName
    };

    if (!this.messageService.isBlankField(data)) {
      data['copyable']=this.isCopyCheck===true?1:0;
      console.log('DATA', JSON.stringify(data));
      this.rest.insertmstsupportgrp(data).subscribe((res) => {
        this.respObject = res;
        console.log('DATA', JSON.stringify(res));
        if (this.respObject.success) {
          this.isError = false;
          const id = this.respObject.details;
          this.messageService.setRow({
            id: id,
            clientid: Number(this.clientId),
            mstorgnhirarchyid: Number(this.orgSelected),
            mstorgnhirarchyname: this.orgName,
            supportgrpname:this.supportgrpName,
            copyable:this.isCopyCheck
          });
          //this.getTableData();
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

  update() {
    const data = {
      id: this.selectedId,
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgSelected),
      supportgrpname:this.supportgrpName
    };
    if (!this.messageService.isBlankField(data)) {
      data['copyable']=this.isCopyCheck===true?1:0;
      console.log('update', JSON.stringify(data));
      this.rest.updatemstsupportgroup(data).subscribe((res) => {
        
        this.respObject = res;
        console.log('DATA', JSON.stringify(res));
        if (this.respObject.success) {
          this.isError = false;
          this.modalReference.close();
          this.messageService.sendAfterDelete(this.selectedId);
          this.dataLoaded = true;
          this.messageService.setRow({
            id: this.selectedId,
            clientid: Number(this.clientId),
            mstorgnhirarchyid: Number(this.orgSelected),
            mstorgnhirarchyname: this.orgName,
            supportgrpname: this.supportgrpName,
            copyable:this.isCopyCheck
          });
          //this.getTableData();
          this.reset();
          this.notifier.notify('success', this.messageService.EDIT_SUCCESS);
        } else {
          this.isError = true;
          this.notifier.notify('error',this.respObject.message);
        }
      }, (err) => {
        this.isError = true;
        this.notifier.notify('error',this.messageService.SERVER_ERROR);
      });
    } else {
      this.isError = true;
      this.notifier.notify('error',this.messageService.BLANK_ERROR_MESSAGE);
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
      clientid : Number(this.clientId),
      mstorgnhirarchyid : Number(this.orgnId),
      offset : offset,
      limit : limit
    };
    this.rest.getmstsupportgroup(data).subscribe((res) => {
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
