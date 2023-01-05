import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {RestApiService} from '../rest-api.service';
import {MessageService} from '../message.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {Filters,Formatters,OnEventArgs} from 'angular-slickgrid';
import {NotifierService} from 'angular-notifier';
import {never, Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-map-record-relation-with-terms',
  templateUrl: './map-record-relation-with-terms.component.html',
  styleUrls: ['./map-record-relation-with-terms.component.css']
})
export class MapRecordRelationWithTermsComponent implements OnInit {

  displayed = true;
  clientSelected: number;
  dataset: any[];
  totalData: number;
  respObject: any;
  clients = [];
  clientName: string;
  userName: string;
  roleName: string;
  notAdmin = true;
  displayData: any;
  add: boolean;
  del: boolean;
  edit: boolean;
  view: boolean;
  isError = false;
  errorMessage: string;
  pageSize: number;
  private userAuth: Subscription;
  private adminAuth: Subscription;
  private notifier: NotifierService;
  private modalReference: NgbModalRef;
  @ViewChild('content') private content;
  private clientId: number;
  private baseFlag: any;
  offset: number;
  dataLoaded: boolean;
  userId: number;
  isLoading = false;
  organaisation = [];
  orgSelected: number;
  orgName: string;
  orgnId: number;
  loginname: string;
  types = [];
  typeSelected: number;
  typeSelected1: number
  relationSelected: number;
  relationSelected1:number;
  relation = [];
  term = [];
  termSelected:number;
  termSelected1:number
  hideName: boolean;
  hideProperty: boolean;
  propertyName: string;
  recordVal = [];
  seqNo: number;
  recordName: string;
  relationName: string;
  termsName:string;
  recordValSelected: number;
  recordValSelected1: number;
  action: string;
  selectedId: number;
  isEdit: boolean;

  constructor(private rest: RestApiService, private messageService: MessageService, private route: Router,
    private modalService: NgbModal, notifier: NotifierService) { 
      this.notifier = notifier;
    this.messageService.getCellChangeData().subscribe(item => {
      switch (item.type) {
        case 'change':
          //console.log('changed');
          if (!this.edit) {
            this.notifier.notify('error', 'You do not have edit permission');
          } else {

          }
          break;
        case 'delete':
          if (confirm('Are you sure?')) {
            this.rest.deleterecordreleationwithterm({id: item.id}).subscribe((res) => {
              this.respObject = res;
              if (this.respObject.success) {
                this.messageService.sendAfterDelete(item.id);
                this.totalData = this.totalData - 1;
                this.messageService.setTotalData(this.totalData);
                this.notifier.notify('success', this.messageService.DELETE_SUCCESS);
              } else {
                this.notifier.notify('error', this.respObject.errorMessage);
              }
            }, (err) => {
              this.notifier.notify('error', this.respObject.errorMessage);
            });
          }
      }
    });
    }

  ngOnInit(): void {
    this.hideName = true;
    this.userName = '';
    this.dataLoaded = false;
    this.hideProperty = true;
    this.pageSize = this.messageService.pageSize;
    this.displayData = {
      pageName: 'Map Record Relation with Term',
      openModalButton: 'Map Record Relation with Term',
      breadcrumb: 'Map Record Relation with Term',
      folderName: 'All Map Record Relation with Term',
      tabName: 'Map Record Relation with Term'
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
          this.reset();
          //console.log("\n ARGS DATA CONTEXT  :: "+JSON.stringify(args.dataContext));
          this.selectedId = args.dataContext.id;
          this.orgSelected = args.dataContext.mstorgnhirarchyid;
          this.typeSelected = args.dataContext.recorddifftypeid;
          this.recordValSelected1 = this.recordValSelected = args.dataContext.recorddiffid;
          this.relationSelected1 = args.dataContext.releationid;
          this.termSelected1 = args.dataContext.termsid;
          this.orgName = args.dataContext.mstorgnhirarchyname;
          this.propertyName = args.dataContext.recorddifftypename;
          this.recordName = args.dataContext.recorddiffname;
          this.relationName = args.dataContext.releationname;
          this.termsName = args.dataContext.termname;
          this.getrecorddiffvalue('u',this.typeSelected-1);
          this.getRelationName('u');
          this.getTermName('u');
          this.isEdit=true;
          this.modalReference = this.modalService.open(this.content, {});
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },
       {
        id: 'mstorgnhirarchyname', name: 'Organization ', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      }, {
        id: 'recorddifftypename', name: 'Record Type ', field: 'recorddifftypename', sortable: true, filterable: true
      }, {
        id: 'recorddiffname', name: 'Record Name ', field: 'recorddiffname', sortable: true, filterable: true
      },{
        id: 'releationname', name: 'Relation Name ', field: 'releationname', sortable: true, filterable: true
      },{
        id: 'termname', name: 'Term Name ', field: 'termname', sortable: true, filterable: true
      }
    ];
    this.messageService.setColumnDefinitions(columnDefinitions);
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.baseFlag = this.messageService.baseFlag;
      this.orgnId = this.messageService.orgnId;
      this.edit =this.messageService.edit;
      this.del =this.messageService.del;
      //console.log(this.orgnId);
      this.onPageLoad();
    } else {
      this.userAuth = this.messageService.getClientUserAuth().subscribe(auth => {
        // this.view = auth[0].viewFlag;
        // this.add = auth[0].addFlag;
          this.edit = auth[0].editFlag;
          this.del = auth[0].deleteFlag;
        this.clientId = auth[0].clientid;
        this.baseFlag = auth[0].baseFlag;
        this.orgnId = auth[0].mstorgnhirarchyid;
        // console.log(JSON.stringify(auth));
        // console.log(this.orgnId)
        this.onPageLoad();
      });
    }
  }


  onPageLoad() {
    this.rest.getorganizationclientwisenew({clientid: Number(this.clientId),mstorgnhirarchyid: Number(this.orgnId)}).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, organizationname: 'Select Organization'});
        this.organaisation = this.respObject.details;
        this.orgSelected = 0;
        //this.selectedOrg = this.orgSelected1;
      } 
      else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.isError = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });

    this.rest.getRecordDiffType().subscribe((res) => {
      this.respObject = res;
      this.types = this.respObject.details;
      this.respObject.details.unshift({id: 0, typename: 'Select Record Type'});
      this.typeSelected = 0;
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  // changeRouting(path: string) {
  //   this.messageService.changeRouting(path);
  // }


  getrecorddiffvalue(type,seqNo) {
    //console.log(this.orgnId);
    const data = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': Number(this.orgSelected),
      'seqno': Number(seqNo)
    };
      this.rest.getrecordbydifftype(data).subscribe((res) => {
        this.respObject = res;
        if(this.respObject.success){
        this.recordVal = this.respObject.details;
          if(type === 'i') {
              this.respObject.details.unshift({id: 0, typename: 'Select Record value'});
              this.recordValSelected = 0;
          }
          else{
            this.recordValSelected = this.recordValSelected1;
          }
        }
        else{
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
  }

  ontypeChange(selectedIndex) {
    //console.log("$$$$$$^^^^^^",this.types,selectedIndex);
    this.recordName = '';
    this.seqNo = this.types[selectedIndex].seqno;
    //console.log("$$$$$$^^^^^^",this.seqNo);
    this.propertyName = this.types[selectedIndex].typename;
    this.getrecorddiffvalue('i',this.seqNo);
  }

  onRecordChange(selectedIndex) {
    this.recordName = this.recordVal[selectedIndex].typename;
    this.getRelationName('i');
    this.getTermName('i');
  }

  onRelationNameChange(selectedIndex){
    this.relationName=this.relation[selectedIndex].releationname;
  }

  getRelationName(type){
    const data = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': Number(this.orgSelected),
      'recorddifftypeid': Number(this.typeSelected),
      'recorddiffid': Number(this.recordValSelected)
    };
    this.rest.getrecordreleationnames(data).subscribe((res) => {
      this.respObject = res;
      if(this.respObject.success){
        this.relation = this.respObject.details;
        if(type==='i'){
          this.respObject.details.unshift({id: 0, releationname: 'Select Relation Name'});
          this.relationSelected = 0;  
        }else{
          this.relationSelected = this.relationSelected1;
        }
      }else{
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getTermName(type){
    const data = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': Number(this.orgSelected),
      'recorddifftypeid': Number(this.typeSelected),
      'recorddiffid': Number(this.recordValSelected)
    };
    this.rest.getrecordtermnames(data).subscribe((res) => {
      this.respObject = res;
      if(this.respObject.success){
      this.term = this.respObject.details;
      if(type=== 'i'){
          this.respObject.details.unshift({id: 0, releationname: 'Select Term Name'});
          this.termSelected = 0;
      }else{
          this.termSelected=this.termSelected1;
      }
      }else{
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }
  onTermNameChange(selectedIndex: any){
    this.termsName=this.term[selectedIndex].releationname;
  }
  
  openModal(content) {
      this.isError = false;
      this.isEdit = false;
      this.reset();
      this.modalService.open(content).result.then((result) => {
      }, (reason) => {
      });
  }

  save() {
  
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgSelected),
      recorddifftypeid: Number(this.typeSelected),
      recorddiffid:Number(this.recordValSelected),
      releationid:Number(this.relationSelected),
      termsid:Number(this.termSelected)
    };
    //console.log("@@@@@@@@@",data);
    if (!this.messageService.isBlankField(data)) {
      console.log(JSON.stringify(data));
      this.rest.addrecordreleationwithterm(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          const id = this.respObject.details;
          //console.log("=========",this.respObject.details)
          this.messageService.setRow({
            id: id,
            mstorgnhirarchyname: this.orgName,
            mstorgnhirarchyid:Number(this.orgSelected),
            recorddifftypename: this.propertyName,
            recorddifftypeid: Number(this.typeSelected),
            recorddiffname: this.recordName,
            recorddiffid:Number(this.recordValSelected),
            releationname:this.relationName,
            releationid:Number(this.relationSelected),
            termname:this.termsName,
            termsid:Number(this.termSelected)
          });
          this.reset();
          this.totalData = this.totalData + 1;
          this.messageService.setTotalData(this.totalData);
          this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
        } else {
          this.isError = true;
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.isError = true;
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    } else {
      this.isError = true;
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }
  }

  update() {
    const data = {
      id: this.selectedId,
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgSelected),
      recorddifftypeid: Number(this.typeSelected),
      recorddiffid:Number(this.recordValSelected),
      releationid:Number(this.relationSelected),
      termsid:Number(this.termSelected)
    };

    // if(this.isClient){
    //   data["clientid"] = this.clie
    // }

    if (!this.messageService.isBlankField(data)) {

      this.rest.updaterecordreleationwithterm(data).subscribe((res) => {
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
            mstorgnhirarchyid:Number(this.orgSelected),
            recorddifftypename: this.propertyName,
            recorddifftypeid: Number(this.typeSelected),
            recorddiffname: this.recordName,
            recorddiffid:Number(this.recordValSelected),
            releationname:this.relationName,
            releationid:Number(this.relationSelected),
            termname:this.termsName,
            termsid:Number(this.termSelected)

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

  reset() {
    this.hideProperty = false;
    this.orgSelected = 0;
    this.recordName = '';
    this.typeSelected = 0;
    this.relationSelected=0;
    this.termSelected=0;
    this.recordValSelected = 0;
    this.term=[];
    this.recordVal=[];
    this.relation=[];
  }

  onOrgChange(index: any) {
    this.orgName = this.organaisation[index].organizationname;
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
      "clientid": Number(this.clientId),
      "mstorgnhirarchyid": Number(this.orgnId),
      "Offset": offset,
      "Limit": limit,
    };
    //console.log("********",data)
    this.rest.getrecordreleationwithterm(data).subscribe((res) => {
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
        //console.log("###",this.totalData);
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
    if (this.adminAuth) {
      this.adminAuth.unsubscribe();
    }
  }


}
