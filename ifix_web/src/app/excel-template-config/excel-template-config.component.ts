import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {RestApiService} from '../rest-api.service';
import {Filters, Formatters, OnEventArgs} from 'angular-slickgrid';
import {MessageService} from '../message.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-excel-template-config',
  templateUrl: './excel-template-config.component.html',
  styleUrls: ['./excel-template-config.component.css']
})
export class ExcelTemplateConfigComponent implements OnInit {
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
  clients=[]
  clientName:string;
  recordTypeStatus=[];
  fromRecordDiffTypeId :any;
  fromRecordDiffTypename:any
  fromlevelid: any;
  fromRecordDiffId:any;
  fromRecordDiffId1:any;
  allPropertyValues = [];
  fromPropLevels=[];
  fromRecordDiffName: string;
  categoryLevelId:any;
  categoryLevelList=[];
  propertyLevel:any;
  exlTemp: any;
  exlTemp1: any;
  exlName:any;
  excel = [];
  seqNo: any;
  headername:any;
  fromRecordDiffTypeId1:any;

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
                this.rest.deletemstexceltemplate({id: item.id}).subscribe((res) => {
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
      pageName: 'Excel Template Configuration',
      openModalButton: 'Add Excel Template',
      breadcrumb: 'Excel Template Configuration',
      folderName: 'Excel Template Configuration',
      tabName: 'Excel Template Configuration',
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
          this.isError = false;
          this.organization=[];
          this.reset();
          console.log("\n ARGS DATA CONTEXT  :: "+JSON.stringify(args.dataContext));
          this.selectedId = args.dataContext.id;
          this.clientId = args.dataContext.clientid
          this.orgSelected = args.dataContext.mstorgnhirarchyid;
          this.fromRecordDiffTypeId1 = args.dataContext.RecordDiffTypeid;
          this.fromRecordDiffId1 = args.dataContext.recorddiffid;
          console.log(this.fromRecordDiffId1);
          this.exlTemp1 = args.dataContext.templatetypeid;
          //console.log(this.exlTemp1);
          this.headername = args.dataContext.headername;
          this.seqNo = args.dataContext.seqno;
          //console.log("ORG",this.orgSelectedto)
          this.getOrganization('u');
          this.getRecordDiffType('u');
          this.excelTemplate('u');
          this.recordbydifftype( this.fromRecordDiffTypeId1-1,'u');
          this.isEdit=true;
          this.modalReference = this.modalService.open(this.content, {});
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },
      {
      id: 'mstorgnhirarchyname', name: 'Organization', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'recorddifftypename', name: 'Property Type', field: 'recorddifftypename', sortable: true, filterable: true
      },
      {
        id: 'recorddiffname', name: 'Property Value', field: 'recorddiffname', sortable: true, filterable: true
      },
      {
        id: 'templatetypename', name: 'Excel Template', field: 'templatetypename', sortable: true, filterable: true,
        enableTooltip : true
      },
      {
        id: 'headername', name: 'Header Name', field: 'headername', sortable: true, filterable: true
      },
      {
        id: 'seqno', name: 'Sequence Number', field: 'seqno', sortable: true, filterable: true
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
    this.getOrganization('i');
    this.reset();
    this.isEdit = false;
    this.modalService.open(content).result.then((result) => {
    }, (reason) => {

    });
  }

  reset() {
    this.orgSelected = 0;
    this.fromRecordDiffTypeId = 0;
    this.fromlevelid = 0;
    this.fromRecordDiffId = 0;
    this.recordTypeStatus=[];
    this.fromPropLevels=[];
    this.exlTemp = 0;
    this.seqNo = '';
    this.headername = '';
  }

    onOrgChange(index) {
      this.orgName = this.organization[index].organizationname;
      this.getRecordDiffType('i');
      this.excelTemplate('i');
    }

    onExlTmpletChange(index){
      this.exlName = this.excel[index-1].typename;
    }

    excelTemplate(type) {
      this.rest.getallmstexceltemplatetype().subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          //this.respObject.details.unshift({id: 0, organizationname: 'Select Organization'});
          this.excel = this.respObject.details;
          if(type==='i'){
            this.exlTemp = 0;
          }
          else{
            this.exlTemp = this.exlTemp1;
          }
        } else {
          this.isError = true;
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    }

    getOrganization(type){
      const data = {
        clientid: Number(this.clientId) , 
        mstorgnhirarchyid: Number(this.orgnId)
      };
      this.rest.getorganizationclientwisenew(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.respObject.details.unshift({id: 0, organizationname: 'Select Organization'});
          this.organization = this.respObject.details;
          if(type==='i'){
            this.orgSelected = 0;
          }
          else{
            //console.log(this.orgSelected1);
            //this.orgSelected = this.orgSelected1;
          }
        } else {
          this.isError = true;
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    }

    getRecordDiffType(type) {
      this.rest.getRecordDiffType().subscribe((res: any) => {
        if (res.success) {
          //res.details.unshift({id: 0, typename: 'Select Differentiation Type'});
          this.recordTypeStatus = res.details;
          if(type==='i'){
            this.fromRecordDiffTypeId = 0;
          }
          else{
            this.fromRecordDiffTypeId = this.fromRecordDiffTypeId1;
          }
        }
      });
    }

    getrecordbydifftype(index) {
      //console.log(index);
      if (index !== 0) {
        const seqNumber = this.recordTypeStatus[index-1].seqno;
        //console.log(seqNumber);
        this.fromRecordDiffTypename = this.recordTypeStatus[index-1].typename
        this.recordbydifftype(seqNumber,'i');
        this.fromlevelid = 0;
        this.fromRecordDiffId = 0;
        this.allPropertyValues = [];
      }
    }

    recordbydifftype(seqNumber,type) {
      const data = {
        clientid: Number(this.clientId),
        mstorgnhirarchyid: Number(this.orgSelected),
        seqno: Number(seqNumber),
      };
      this.rest.getcategorylevel(data).subscribe((res: any) => {
        if (res.success) {
          if (res.details.length > 0) {
            //res.details.unshift({id: 0, typename: 'Select Differentiation Level', seqno: 0});
            this.fromPropLevels = res.details;
            if(type === 'i'){
              this.fromlevelid = 0;
            }
            else{
              //this.fromlevelid = this.fromRecordDiffId1;
            } 
          } else {
            this.fromPropLevels = [];
            this.getPropertyValue(Number(seqNumber),type);
          }
        } else {
          this.notifier.notify('error', res.message);
  
        }
      }, (err) => {
        console.log(err);
      });
    }

    onTicketTypeChange(index) {
      if (index !== 0) {
        this.fromRecordDiffName = this.allPropertyValues[index-1].typename;
        //console.log(this.fromRecordDiffName)
      }
    }

    onLevelChange(index) {
      let seq;
      seq = this.fromPropLevels[index - 1].seqno;
      this.getPropertyValue(seq,'i');
      this.fromRecordDiffId = 0;
    }
    
    getPropertyValue(seq,type) {
      //console.log(type ,"=", seq)
      const data = {
        clientid: Number(this.clientId),
        mstorgnhirarchyid: Number(this.orgSelected),
        seqno: Number(seq)
      };
      this.rest.getrecordbydifftype(data).subscribe((res: any) => {
        if (res.success) {
          this.allPropertyValues = res.details;
          if(type ==='i'){
            this.fromRecordDiffId = 0;
          }
          else{
            this.fromRecordDiffId = this.fromRecordDiffId1; 
          }
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    }


    save() {
      if(this.seqNo < 0){
        this.notifier.notify('error', "Sequence number must be  more than Zero");
      }
      else{
        const data = {
          clientid: Number(this.clientId),
          mstorgnhirarchyid: Number(this.orgSelected),
          recorddifftypeid: Number(this.fromRecordDiffTypeId),
          headername: this.headername,
          seqno: Number(this.seqNo),
          templatetypeid: Number(this.exlTemp),
          recorddiffid: Number(this.fromRecordDiffId),
           
        }
    
        console.log('DATA', JSON.stringify(data));
        if (!this.messageService.isBlankField(data)) {
          this.rest.addmstexceltemplate(data).subscribe((res) => {
            this.respObject = res;
            if (this.respObject.success) {
              this.isError = false;
              const id = this.respObject.details;
              this.messageService.setRow({
                id: id,
                clientid: Number(this.clientId),
                mstorgnhirarchyid: Number(this.orgSelected),
                mstorgnhirarchyname: this.orgName,
                RecordDiffTypeid: Number(this.fromRecordDiffTypeId),
                recorddifftypename: this.fromRecordDiffTypename,
                recorddiffid: Number(this.fromRecordDiffId),
                recorddiffname: this.fromRecordDiffName,
                headername: this.headername,
                seqno: Number(this.seqNo),
                templatetypeid: Number(this.exlTemp),
                templatetypename: this.exlName
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
      
           
    }

    update() {
      if(this.seqNo < 0){
        this.notifier.notify('error', "Sequence number must be  more than Zero");
      }
      else{
        const data = {
          id: this.selectedId,
          clientid: Number(this.clientId),
          mstorgnhirarchyid: Number(this.orgSelected),
          recorddifftypeid: Number(this.fromRecordDiffTypeId),
          headername: this.headername,
          seqno: Number(this.seqNo),
          templatetypeid: Number(this.exlTemp),
          recorddiffid: Number(this.fromRecordDiffId),
        };
        console.log(JSON.stringify(data))
        if (!this.messageService.isBlankField(data)) { 
          this.rest.updatemstexceltemplate(data).subscribe((res) => {
            this.respObject = res;
            if (this.respObject.success) {
              this.isError = false;
              this.modalReference.close();
              this.messageService.sendAfterDelete(this.selectedId);
              this.dataLoaded = true;
              // this.messageService.setRow({
              //   id: this.selectedId,
              //   clientid: Number(this.clientId),
              //   mstorgnhirarchyid: Number(this.orgSelected),
              //   mstorgnhirarchyname: this.orgName,
              //   RecordDiffTypeid: Number(this.fromRecordDiffTypeId),
              //   recorddifftypename: this.fromRecordDiffTypename,
              //   recorddiffid: Number(this.fromRecordDiffId),
              //   recorddiffname: this.fromRecordDiffName,
              //   headername: this.headername,
              //   seqno: Number(this.seqNo),
              //   templatetypeid: Number(this.exlTemp),
              //   templatetypename: this.exlName
              // });
              this.getTableData();
              this.notifier.notify('success', this.messageService.EDIT_SUCCESS);
            } else {
              this.isError = true;
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
        clientid: Number(this.clientId),
        mstorgnhirarchyid: Number(this.orgnId),
        offset: offset,
        limit: limit
      };
      this.rest.getallmstexceltemplate(data).subscribe((res) => {
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

