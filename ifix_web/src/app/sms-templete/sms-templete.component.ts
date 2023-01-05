import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {NotifierService} from 'angular-notifier';
import {RestApiService} from '../rest-api.service';
import {Filters, Formatters, OnEventArgs} from 'angular-slickgrid';
import {MessageService} from '../message.service';
import {Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';
import {CustomInputEditor} from '../custom-inputEditor';
import {FormControl, MinLengthValidator} from '@angular/forms';

@Component({
  selector: 'app-sms-templete',
  templateUrl: './sms-templete.component.html',
  styleUrls: ['./sms-templete.component.css']
})
export class SmsTempleteComponent implements OnInit {
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
  catalogName: string;
  dataLoaded: boolean;
  orgnId: number;
  isClient: boolean;
  selectedId: number;
  clientSelectedName: string;
  orgSelectedName: string;
  organaisation = [];
  orgSelected: any;
  orgName: any;
  @ViewChild('content') private content;
  private modalReference: NgbModalRef;
  orgId: number;
  tempSelected:any;
  tempName:string;
  placeholder:string;
  TICKET_TYPE_SEQ = 1;
  STATUS_SEQ = 2;

  ticketTypes = [];
  selectedTicketType: number;
  status = [];
  selectedStatus: number;
  workingList = []
  selectedWorkingCategory: any;
  recordTypeId: number;

  recordType: string;
  recordTypeIds = [];
  recordTypeNames = [];
  recordTypeName: string;
  recordTypeIdSelected: number;
  recordTypeNameSelected: number;
  recordTypeIdSelected1: number;
  selectedRecordTypeId: number;
  recordTypeNameSelected1: number;
  selectedRecordTypeName: number;

  editorValue: string;
  istextarea:boolean;
  contentValue:string;
  tempVal:string;
  closureTime:any;
  isClosureTime:boolean;
  parenCatId:any;
  statusTypeId:any;
  ticketTypeId:any;
  isUpdate:boolean;


  temps =[{id:1,name:'Agent Reply Template'},
  {id:2,name:'Status Notification Email Template'},{id:3,name:'Auto Closure Notification Template'},{id:4,name:'SMS Template'}]

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
              this.rest.deletetemplate({
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
                this.notifier.notify('error', this.messageService.SERVER_ERROR);
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
      pageName: 'Maintain Template',
      openModalButton: 'Add Template',
      breadcrumb: 'Template',
      folderName: 'All Template',
      tabName: 'Template',
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
          console.log(JSON.stringify(args.dataContext));
          this.isUpdate =true;
          this.selectedId = args.dataContext.id;
          this.ticketTypes =[];
          this.status =[];
          this.workingList =[]; 
          this.orgSelected = Number(args.dataContext.mstorgnhirarchyid);
          // this.getRecordTypes();

          this.orgName = args.dataContext.mstorgnhirarchyname;
          this.tempSelected = args.dataContext.templatetype;
          if(Number(this.tempSelected) === 2){
            this.placeholder = 'Enter Subject';
            this.istextarea = false;
            this.isClosureTime =false;
            this.editorValue = args.dataContext.templatecontent
            // this.contentValue ='';
          }else if(Number(this.tempSelected) === 3){
             this.isClosureTime =true;
             this.placeholder = 'Enter Template Name';
             this.istextarea = true;
             this.contentValue = args.dataContext.templatecontent;
          }else{
            this.placeholder = 'Enter Template Name';
            this.istextarea = true;
            this.isClosureTime =false;
            this.contentValue = args.dataContext.templatecontent;
          }


          this.closureTime =args.dataContext.autoclosuretime;
          this.tempVal = args.dataContext.templatename;
          this.selectedTicketType = args.dataContext.maptemplatediff[0].recorddiffid;
          this.selectedStatus =args.dataContext.maptemplatediff[2].recorddiffid;
          this.selectedWorkingCategory =args.dataContext.maptemplatediff[1].recorddiffid;
          const ticketTypeData = {
            clientid: this.clientId,
            mstorgnhirarchyid: Number(this.orgSelected),
            seqno: this.TICKET_TYPE_SEQ
          };
          this.getrecordbydifftype(ticketTypeData);
          const statusData = {
            clientid: this.clientId,
            mstorgnhirarchyid: Number(this.orgSelected),
            seqno: this.STATUS_SEQ
          };
          this.getrecordbydifftype(statusData);
          this.getworkingLevel();
       
          this.modalReference = this.modalService.open(this.content, {});
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },
      // {
      //   id: 'clientName', name: 'Client', field: 'clientname', sortable: true, filterable: true
      // },
      {
        id: 'organization', name: 'Organization', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'templatename', name: 'Template Name ', field: 'templatename', sortable: true, filterable: true
      },
      {
        id: 'ticketTypeValue', name: 'Ticket Type Name ', field: 'ticketTypeValue', sortable: true, filterable: true
      },
      {
        id: 'workingCatValue', name: 'Working Category Name ', field: 'workingCatValue', sortable: true, filterable: true
      },
      {
        id: 'statusValue', name: 'Status Name ', field: 'statusValue', sortable: true, filterable: true
      },
      {
        id: 'autoclosuretime', name: 'Auto Closure Time', field: 'autoclosuretime', sortable: true, filterable: true
      },
      {
        id: 'templatecontent', name: 'template Content', field: 'templatecontent', sortable: true, filterable: true
      },

    ];


    this.messageService.setColumnDefinitions(columnDefinitions);
    // this.onPageLoad();
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.baseFlag = this.messageService.baseFlag;
      this.orgId = this.messageService.orgnId;
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
    this.getRecordTypes();



    // this.getTableData();
  }

  changeRouting(path: string) {
    this.messageService.changeRouting(path);
  }

  getRecordTypes() {
    this.rest.getRecordDiffType().subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, typename: 'Select record type'});
        this.recordTypeIds = this.respObject.details;
        // this.recordTypeIdSelected = 0;
        // this.selectedRecordTypeId = this.recordTypeIdSelected1;
        for (let i = 0; i < this.recordTypeIds.length; i++) {
          if (Number(this.recordTypeIds[i].seqno) == Number(this.TICKET_TYPE_SEQ)) {
            this.ticketTypeId = this.recordTypeIds[i].id;
            //console.log('recordTypeId=============' + this.ticketTypeId);
          }else if (this.recordTypeIds[i].seqno == this.STATUS_SEQ) {
            this.statusTypeId = this.recordTypeIds[i].id;
            // console.log('recordTypeId=============>>' + this.statusTypeId);


          }
        }
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onTicketTypeChange(index) {
    // this.ticket = this.recordTypeIds[index].typename;
   this.selectedWorkingCategory =[];
  this.getworkingLevel()
  }

  getworkingLevel(){
    //console.log(".............."+this.ticketTypeId)
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.orgSelected),
      forrecorddifftypeid: Number(this.ticketTypeId),
      forrecorddiffid: Number(this.selectedTicketType)
    };
    this.rest.getworkinglabelname(data).subscribe((res: any) => {
      if (res.success) {
        this.workingList = res.details.values;
        
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  oncategoryTypeChange(index:any){
    this.parenCatId = this.workingList[index-1].recorddifftypid;
  }
  openModal(content) {
      this.isError = false;

      this.reset();
      this.isUpdate = false;

      this.modalService.open(content).result.then((result) => {
      }, (reason) => {
      });
  }


  reset(){
    this.orgSelected =0;
    this.tempSelected = '';
    this.editorValue = '';
    this.contentValue ='';
    this.istextarea =true;
    this.tempVal = '';
    this.closureTime = '';
    this.isClosureTime =false;
    this.selectedWorkingCategory = [];
    this.selectedTicketType = 0;
    this.selectedStatus = 0 ;
    this.ticketTypes = [];
    this.workingList = [];
    this.status = [];
   
  }
  onOrgChange(index: any) {
    this.orgName = this.organaisation[index].organizationname;
    this.selectedTicketType =0;
    this.selectedStatus =0;
    this.selectedWorkingCategory = [];
    
    const ticketTypeData = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.orgSelected),
      seqno: this.TICKET_TYPE_SEQ
    };
    this.getrecordbydifftype(ticketTypeData);
    // const prioritySeqNumber = 4;
    const statusData = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.orgSelected),
      seqno: this.STATUS_SEQ
    };
    this.getrecordbydifftype(statusData);
  }

  getrecordbydifftype(data) {
    this.rest.getrecordbydifftype(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        if (data.seqno === this.TICKET_TYPE_SEQ) {
          this.ticketTypes = this.respObject.details;
          // this.selectedTicketType = 0;
        } else if (data.seqno === this.STATUS_SEQ) {
          this.status = this.respObject.details;
          // this.selectedStatus = 0;
        }
        this.recordTypeNames = this.respObject.details;
        this.recordTypeNameSelected = 0;
        this.selectedRecordTypeName = this.recordTypeNameSelected1;
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  ontempChange(index:any){
    this.tempVal ='';
    this.contentValue ='';
    this.editorValue ='';
    this.tempName = this.temps[index-1].name; 
    if(Number(this.tempSelected) === 2){
      this.placeholder = 'Enter Subject';
      this.istextarea = false;
      this.isClosureTime =false;
    }else if(Number(this.tempSelected) === 3){
       this.isClosureTime =true;
       this.placeholder = 'Enter Template Name';
       this.istextarea = true;

    }else{
      this.placeholder = 'Enter Template Name';
      this.istextarea = true;
      this.isClosureTime =false;
    }
  }


  update() {

    for(let i = 0; i<this.workingList.length;i++){
      if(this.workingList[i].id === Number(this.selectedWorkingCategory))
      {
        this.parenCatId = this.workingList[i].recorddifftypid;
        //console.log(this.parenCatId,'||', this.selectedWorkingCategory)
        break
      }
    }

    if((Number(this.tempSelected) === 4 ) &&(Number(this.contentValue.length) >160)){
       
      this.notifier.notify('error', "SMS Length Must Be Less Than 160 Character");
  
  }else{
    const data = {
      id:this.selectedId,
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgSelected),
      templatetype:Number(this.tempSelected),
      templatename:this.tempVal,
      // autoclosuretime:this.tosec(this.closureTime),
      maptemplatediff:[
      {"recorddifftypeid":Number(this.ticketTypeId),"recorddiffid":Number(this.selectedTicketType)},
      {"recorddifftypeid":Number(this.parenCatId),"recorddiffid":Number(this.selectedWorkingCategory)},
      {"recorddifftypeid":Number(this.statusTypeId),"recorddiffid":Number(this.selectedStatus)}],


      // catalogname: this.catalogName,
    };

    if(this.istextarea){
      data['templatecontent'] = this.contentValue;
    }else{
      data['templatecontent'] = this.editorValue;
    }

    // if(this.isClient){
    //   data["clientid"] = this.clie
    // }

    if (!this.messageService.isBlankField(data) && !this.blankarr(data.maptemplatediff)) {
      data['autoclosuretime'] = this.tosec(this.closureTime);

      console.log("............."+JSON.stringify(data));
      this.rest.updatetemplate(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          const id = this.respObject.details;
          // this.messageService.setRow({
          //   id: id,
          //   catalogname: this.catalogName,
          //   mstorgnhirarchyname: this.orgName

          // });
          //console.log("id "+ )
          this.modalReference.close();
          this.getTableData();
      
          // this.totalData = this.totalData + 1;
          // this.messageService.setTotalData(this.totalData);
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

  tomin(sec){
   const min = sec/60;
   return min;
  }

  tosec(min){
    let sec = 0;
    if(min !== ''){
      const mins = Number(min);
       sec = mins * 60;
    }
    else{
      sec = 0;
    }
   
    return Number(sec);
  }

  save() {
    for(let i = 0; i<this.workingList.length;i++){
      if(this.workingList[i].id === Number(this.selectedWorkingCategory))
      {
        this.parenCatId = this.workingList[i].recorddifftypid;
        // console.log(this.processName)
        break
      }
    }

      if((Number(this.tempSelected) === 4 ) &&(Number(this.contentValue.length) >160)){
       
          this.notifier.notify('error', "SMS Length Must Be Less Than 160 Character");
      
      }else{
        const data = {
          clientid: Number(this.clientId),
          mstorgnhirarchyid: Number(this.orgSelected),
          templatetype:Number(this.tempSelected),
          templatename:this.tempVal,
          // autoclosuretime:this.tosec(this.closureTime),
          maptemplatediff:[
          {"recorddifftypeid":Number(this.ticketTypeId),"recorddiffid":Number(this.selectedTicketType)},
          {"recorddifftypeid":Number(this.parenCatId),"recorddiffid":Number(this.selectedWorkingCategory)},
          {"recorddifftypeid":Number(this.statusTypeId),"recorddiffid":Number(this.selectedStatus)}],
    
    
          // catalogname: this.catalogName,
        };
    
        if(this.istextarea){
          data['templatecontent'] = this.contentValue;
        }else{
          data['templatecontent'] = this.editorValue;
        }
    
        // if(this.isClient){
        //   data["clientid"] = this.clie
        // }
    
        if (!this.messageService.isBlankField(data) && !this.blankarr(data.maptemplatediff)) {
          data['autoclosuretime'] = this.tosec(this.closureTime);
    
          console.log("............."+JSON.stringify(data));
          this.rest.addmsttemplate(data).subscribe((res) => {
            this.respObject = res;
            if (this.respObject.success) {
              this.isError = false;
              const id = this.respObject.details;
              // this.messageService.setRow({
              //   id: id,
              //   catalogname: this.catalogName,
              //   mstorgnhirarchyname: this.orgName
    
              // });
              //console.log("id "+ )
              this.reset();
              this.getTableData();
          
              // this.totalData = this.totalData + 1;
              // this.messageService.setTotalData(this.totalData);
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



  blankarr(data){
  let flag = 0;
    for(let i=0 ;i<data.length ; i++){
      if(Number(data[i].recorddifftypeid) === 0 || (Number(data[i].recorddiffid === 0))) {
       flag ++;
      }
    }
    if(flag > 0){
      return true;
    }else{
      return false;
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
    this.dataLoaded = false;

    const data = {
      'clientid': Number(this.clientId),
      'mstorgnhirarchyid': Number(this.orgId),
      'offset': offset,
      'limit': limit,
    };

    //console.log('...........' + JSON.stringify(data) + '...' + this.clientId);
    this.rest.gettemplate(data).subscribe((res) => {
      this.respObject = res;
      if(this.respObject.success===true){
        this.dataLoaded = true;
      for(let i=0;i <this.respObject.details.values.length ; i++){
        if(this.respObject.details.values[i].maptemplatediff.length > 0){
          this.respObject.details.values[i].ticketTypeValue =  this.respObject.details.values[i].maptemplatediff[0].mstrecorddifferentiationname;
          this.respObject.details.values[i].workingCatValue =  this.respObject.details.values[i].maptemplatediff[1].mstrecorddifferentiationname;
          this.respObject.details.values[i].statusValue =  this.respObject.details.values[i].maptemplatediff[2].mstrecorddifferentiationname;
          this.respObject.details.values[i].autoclosuretime = this.tomin( Number( this.respObject.details.values[i].autoclosuretime));
        }
      }

    }
    else {
      this.notifier.notify('error', this.respObject.message);
    }

      //console.log("+++++"+JSON.stringify(this.respObject));


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
