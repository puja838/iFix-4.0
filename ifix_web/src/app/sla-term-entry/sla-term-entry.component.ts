import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {RestApiService} from '../rest-api.service';
import {Filters, Formatters, OnEventArgs} from 'angular-slickgrid';
import {MessageService} from '../message.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-sla-term-entry',
  templateUrl: './sla-term-entry.component.html',
  styleUrls: ['./sla-term-entry.component.css']
})
export class SLATermEntryComponent implements OnInit {
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
  orgSelected= 0;
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
  clients=[]
  clientName:string;
  recordTypeStatus=[];
  fromRecordDiffTypeId :any;
  fromRecordDiffTypename:any
  fromlevelid: any;
  fromRecordDiffId=[];
  allPropertyValues = [];
  fromPropLevels=[];
  fromRecordDiffName: string;
  categoryLevelId:any;
  categoryLevelList=[];
  propertyLevel:any;
  toClientSelected:any;
  toClientSelected1:any;
  toclients=[];
  toclientName:string;
  organizationto=[];
  orgSelectedto= 0;
  orgSelectedto1 = '';
  orgNameto:any;
  orgIdTo = [];
  meters = [];
  slaMeterName:any;
  selectedMeter :any;
  slaMeterId = [];
  slaTermsNames=[];
  pauseSla =[];
  clientOrgnId:any;
  toclientOrgnId:any;
  constructor(private rest: RestApiService, private messageService: MessageService,
    private route: Router, private modalService: NgbModal,private notifier: NotifierService) {
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
                this.rest.deleteslatermentry({id: item.id,mapid:item.mapid}).subscribe((res) => {
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
      pageName: 'SLA Term Entry',
      openModalButton: 'Add SLA Term Entry',
      breadcrumb: 'SLA Term Entry',
      folderName: 'SLA Term Entry',
      tabName: 'SLA Term Entry',
    };
    this.rest.getallclientnames().subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, name: 'Select Client'});
        this.clients = this.respObject.details;
        this.toclients = this.respObject.details;
        this.clientSelected = 0;
        this.toClientSelected = 0;
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
        id: 'clienname', name: 'Client', field: 'clienname', sortable: true, filterable: true
      },
      {
        id: 'mstorgnhirarchyname', name: 'Organization', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'metertypename', name: 'Meter Name', field: 'metertypename', sortable: true, filterable: true
      },
      {
        id: 'metername', name: 'SLA Term Name', field: 'metername', sortable: true, filterable: true
      }
    ];
    this.messageService.setColumnDefinitions(columnDefinitions);
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.orgnId = this.messageService.orgnId;
      this.baseFlag = this.messageService.baseFlag;
      this.edit =this.messageService.edit;
      this.del =this.messageService.del;
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
    this.getSLAmeternames();
    this.isEdit = false;
    this.modalService.open(content).result.then((result) => {
    }, (reason) => {

    });
  }

  reset() {
    this.orgSelected = 0;
    this.clientSelected = 0;
    this.orgSelectedto= 0;
    this.toClientSelected = 0;
    this.selectedMeter = 0;
    this.slaMeterId = [];
    this.slaTermsNames = [];
  }

  get selectedFieldValue() {
    return this.slaTermsNames
      .filter(opt => opt.checked)
      .map(opt => opt);

  }


  onOrgChangeto(index){
    this.orgNameto = this.organizationto[index - 1].organizationname;
  }


  onToClientChange(index: any) {
    this.toclientName = this.toclients[index].name;
    this.toclientOrgnId = this.clients[index].orgnid;
    this.getToOrganization('i');
  }

  getSLAmeternames(){
  this.rest.getSLAmeternames().subscribe((res: any) => {
      if (res.success) {
        this.meters = res.details;
        this.selectedMeter = 0;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
       this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onMeterChange(index: any){
    this.slaMeterName = this.meters[index-1].name;
    this.getSLAtermsnames(index);
  }

  getSLAtermsnames(index: any){
    const data = {
    "clientid": Number(this.clientId),
    "mstorgnhirarchyid": Number(this.orgnId),
    "slametertypeid": index
    };
  this.rest.getSLAtermsnames(data).subscribe((res: any) => {
      if (res.success) {
          this.slaTermsNames = res.details;
      } else {
          this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

    getToOrganization(type){
      this.rest.getorganizationclientwisenew({clientid: Number(this.toClientSelected),mstorgnhirarchyid:Number(this.toclientOrgnId)}).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.organizationto = this.respObject.details;
          if(type==='i'){
            this.orgSelectedto = 0;
          }
          else{
           // this.orgSelectedto.push(Number(this.orgIdTo));
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
      if (Number(this.orgnId) ===  Number(this.orgSelectedto)) {
        this.notifier.notify('error', this.messageService.SAME_ORGANIZATION);
      }
      else{
        if(this.selectedFieldValue.length === 0){
          this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
        }
        else{
          const fieldVal = [];
          for (let i = 0; i < this.selectedFieldValue.length; i++) {
            fieldVal.push(this.selectedFieldValue[i].name);
          }
          const data = {
            clientid: Number(this.clientId),
            mstorgnhirarchyid: Number(this.orgnId),
            metertypeid: Number(this.selectedMeter),
            toclientid : Number(this.toClientSelected),
            tomstorgnhirarchyid : Number(this.orgSelectedto),
            meternames :  (fieldVal)
          };

          if (!this.messageService.isBlankField(data)) {

            console.log("\n DATA  :: "+JSON.stringify(data));
            this.rest.addslatermentry(data).subscribe((res) => {
              this.respObject = res;
              if (this.respObject.success) {
                //const id = this.respObject.details;
                this.isError = false;
                this.reset();
                this.getTableData();
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
    }

    update() {
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
        offset: offset,
        limit: limit
      };
      this.rest.getallslatermentry(data).subscribe((res) => {
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
