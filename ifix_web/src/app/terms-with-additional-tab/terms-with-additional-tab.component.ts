import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {RestApiService} from '../rest-api.service';
import {Filters, Formatters, OnEventArgs} from 'angular-slickgrid';
import {MessageService} from '../message.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-terms-with-additional-tab',
  templateUrl: './terms-with-additional-tab.component.html',
  styleUrls: ['./terms-with-additional-tab.component.css']
})
export class TermsWithAdditionalTabComponent implements OnInit {
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
  @ViewChild('content') private content;
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
  clientOrgnId:any;
  notAdmin:boolean;
  termsName:any;
  termNames= [];
  tabselected:any;
  tabNames = [];
  tabsName:any

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
              this.rest.deleterecordtermadditionalmap({id: item.id}).subscribe((res) => {
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
      pageName: 'Map Record Terms With Additional Tab',
      openModalButton: 'Map Record Terms',
      breadcrumb: 'Map Record Terms',
      folderName: 'Map Record Terms',
      tabName: 'Map Record Terms',
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
        id: 'organization', name: 'Organization ', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'recordtermname', name: 'Record Term Name ', field: 'recordtermname', sortable: true, filterable: true
      },
      {
        id: 'recordfieldtypename', name: 'Tab Name ', field: 'recordfieldtypename', sortable: true, filterable: true
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
    this.getOrganization(this.clientId, this.orgId);
    this.modalService.open(content).result.then((result) => {
    }, (reason) => {

    });
  }

  resetValues() {
    //this.organization = [];
    this.orgSelected = 0;
    this.termselected = 0;
    this.termNames = [];
    this.tabselected = 0;
    this.tabNames = [];
    this.tabsName = '';
  }

  onTermNameChange(index) {
    //console.log("terms",index)
    this.termsName = this.termNames[index-1].termname;
    //console.log(this.termsName)
  }

  getTermName() {
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgSelected)
    }
    this.rest.listmstrecordterms(data).subscribe((res) => {
      this.respObject = res;
      this.termNames = this.respObject.details;
      if (this.respObject.success) {
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.isError = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onTabNameChange(index){
    //console.log(index)
    if(index!==0){
      this.tabsName = this.tabNames[index].tabname;
      //console.log(this.tabsName); 
    }
    else{
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
      this.tabsName = '';
    }  
  }

  getTabName(){
    this.rest.getadditionaltab().subscribe((res) => {
      this.respObject = res;
      this.tabNames = this.respObject.details;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, tabname: 'Select Tab Name'});
        this.tabselected = 0;
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.isError = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  save() {
      const data = {
        clientid : Number(this.clientId),
        mstorgnhirarchyid : Number(this.orgSelected),
        recordtermid: Number(this.termselected),
        recordfieldtypename: this.tabsName
      };
      console.log(JSON.stringify(data))
      if (!this.messageService.isBlankField(data)) {
        this.rest.addrecordtermadditionalmap(data).subscribe((res) => {
          this.respObject = res;
          if (this.respObject.success) {
            this.isError = false;
            const id = this.respObject.details;
            this.messageService.setRow({
                id: id,
                clientid: Number(this.clientId),
                mstorgnhirarchyname: this.orgName,
                mstorgnhirarchyid : Number(this.orgSelected),
                recordtermid: Number(this.termselected),
                recordtermname: this.termsName,
                recordfieldtypename: this.tabsName
            });
            this.totalData = this.totalData + 1;
            this.messageService.setTotalData(this.totalData);
            this.isError = false;
            this.resetValues();
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
    this.getTermName()
    this.getTabName();
  }



  getOrganization(clientId, orgId) {
    const data = {
      clientid: Number(clientId) , 
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
    this.rest.getrecordtermadditionalmap(data).subscribe((res) => {
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
