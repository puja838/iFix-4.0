import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {RestApiService} from '../rest-api.service';
import {Filters, Formatters, OnEventArgs} from 'angular-slickgrid';
import {MessageService} from '../message.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-differentiation-map',
  templateUrl: './differentiation-map.component.html',
  styleUrls: ['./differentiation-map.component.css']
})
export class DifferentiationMapComponent implements OnInit {

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
  fromRecordDiffId=[];
  allPropertyValues = [];
  fromPropLevels=[];
  fromRecordDiffName: string;
  categoryLevelId:any;
  categoryLevelList=[];
  propertyLevel:any;
  toclientSelected:any;
  toclientSelected1:any;
  toclients=[];
  toclientName:string;
  organizationto=[];
  orgSelectedto=[];
  orgSelectedto1 = '';
  orgNameto:any;
  fromDiffId = [];
  orgToId = [];
  toOrg :any;

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
                this.rest.deletedifferentiationmap({id: item.id,mapid:item.mapid}).subscribe((res) => {
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
      pageName: 'Differentiation Map',
      openModalButton: 'Add Differentiation Map',
      breadcrumb: 'Differentiation Map',
      folderName: 'Differentiation Map',
      tabName: 'Differentiation Map',
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
      // {
      //   id: 'edit',
      //   field: 'id',
      //   excludeFromHeaderMenu: true,
      //   formatter: Formatters.editIcon,
      //   minWidth: 30,
      //   maxWidth: 30,
      //   onCellClick: (e: Event, args: OnEventArgs) => {
      //     this.isError = false;
      //     this.reset();
      //     console.log("\n ARGS DATA CONTEXT  :: "+JSON.stringify(args.dataContext));
      //     this.selectedId = args.dataContext.id;
      //     this.clientSelected = args.dataContext.fromclientid;
      //     this.clientName = args.dataContext.fromclientname;
      //     this.orgName = args.dataContext.fromorgnname;
      //     this.orgSelected1 = args.dataContext.fromorgnid;
      //     this.toclientSelected1 = args.dataContext.toclientid;
      //     this.toclientName = args.dataContext.toclientname;
      //     this.orgSelectedto1 = args.dataContext.toorgnid;
      //     this.orgNameto = args.dataContext.toorgnname;
      //     this.fromRecordDiffTypename = args.dataContext.fromdifftypename;
      //     this.fromRecordDiffName=args.dataContext.fromdiffname;
      //     //console.log("ORG",this.orgSelectedto)
      //     this.clinentToChange('u');
      //     this.getOrganization('u');
      //     this.getToOrganization('u');
      //     this.isEdit=true;
      //     this.modalReference = this.modalService.open(this.content, {});
      //     this.modalReference.result.then((result) => {
      //     }, (reason) => {

      //     });
      //   }
      // },
      {
      id: 'orgname', name: 'From Organization', field: 'orgname', sortable: true, filterable: true
      },
      {
        id: 'Type', name: 'Differentiation Type', field: 'Type', sortable: true, filterable: true
      },
      {
        id: 'name', name: 'Differentiation Value', field: 'name', sortable: true, filterable: true
      },
      // {
      //   id: 'toorgnname', name: 'To Organization', field: 'toorgnname', sortable: true, filterable: true
      // }
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
    this.getToOrganization('i');
    this.reset();
    this.clinentToChange('i');
    this.isEdit = false;
    this.modalService.open(content).result.then((result) => {
    }, (reason) => {

    });
  }

  reset() {
    this.clientSelected = 0;
    this.toclientSelected = 0;
    this.orgSelected = 0;
    this.orgSelectedto= [];
    this.fromRecordDiffTypeId = '';
    this.fromlevelid = '';
    // this.clients = [];
    // this.toclients = [];
    this.fromRecordDiffId = [];
    this.recordTypeStatus=[];
    this.fromPropLevels=[];
    this.allPropertyValues=[];
    //this.toclients=[];
    this.orgToId = [];
    this.fromDiffId =[];
  }

    onOrgChange(index) {
      this.orgName = this.organization[index].organizationname;
      this.getRecordDiffType();
    }

    // onOrgChangeto(index){
    //   this.orgNameto = index.organizationname;
    //   this.orgToId.push(index.id);
    //   console.log(this.orgNameto,this,'||',this.orgToId)
    // }

    onClientChange(index: any) {
      this.clientName = this.clients[index].name;
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
            this.orgSelected = this.orgSelected1;
          }
        } else {
          this.isError = true;
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    }

    onToClientChange(index: any) {
      this.toclientName = this.toclients[index].name;

    }

    getToOrganization(type){
      const data = {
        clientid: Number(this.clientId) ,
        mstorgnhirarchyid: Number(this.orgnId)
      };
      this.rest.getorganizationclientwisenew(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.organizationto = this.respObject.details;
          this.selectAll(this.organizationto);
          if(type==='i'){
            this.orgSelectedto = [];
          }
          else{
            this.orgSelectedto.push(Number(this.orgSelectedto1));
            //console.log("ORGTO",this.orgSelectedto)
          }
        } else {
          this.isError = true;
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    }

    clinentToChange(type){
      this.rest.getclient({offset: 0, limit: 1000}).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.respObject.details.values.unshift({id: 0, name: 'Select Client'});
          this.toclients = this.respObject.details.values;
          if(type==='i'){
            this.toclientSelected = 0;
          }
          else{
            this.toclientSelected = this.toclientSelected1;
          }
        } else {
          this.isError = true;
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    }

    getRecordDiffType() {
      this.rest.getRecordDiffType().subscribe((res: any) => {
        if (res.success) {
          res.details.unshift({id: 0, typename: 'Select Differentiation Type'});
          this.recordTypeStatus = res.details;
          this.fromRecordDiffTypeId = 0;
        }
      });
    }

    getrecordbydifftype(index) {
      //console.log(index);
      if (index !== 0) {
        const seqNumber = this.recordTypeStatus[index].seqno;
        this.fromRecordDiffTypename = this.recordTypeStatus[index].typename
        this.recordbydifftype(seqNumber);
        this.fromlevelid = 0;
        this.fromRecordDiffId = [];
        this.allPropertyValues = [];
      }
    }

    recordbydifftype(seqNumber) {
      const data = {
        clientid: Number(this.clientId),
        mstorgnhirarchyid: Number(this.orgSelected),
        seqno: Number(seqNumber),
      };
      this.rest.getcategorylevel(data).subscribe((res: any) => {
        if (res.success) {
          if (res.details.length > 0) {
            res.details.unshift({id: 0, typename: 'Select Differentiation Level', seqno: 0});
            this.fromPropLevels = res.details;
          } else {
            this.fromPropLevels = [];
            this.getPropertyValue(Number(seqNumber));
          }
        } else {
          this.notifier.notify('error', res.message);

        }
      }, (err) => {
        //console.log(err);
      });
    }

    onTicketTypeChange(index) {
      // if (index !== 0) {
      //   this.fromRecordDiffName = index.typename;
      //   this.fromDiffId.push(index.id)
      //   console.log(this.fromRecordDiffName,'||',this.fromDiffId);
      // }
      this.getcategorylevel('i');
    }

    onLevelChange(index) {
      let seq;
      seq = this.fromPropLevels[index - 1].seqno;
      this.getPropertyValue(seq);
      this.fromRecordDiffId = [];
    }

    getPropertyValue(seq) {
      const data = {
        clientid: Number(this.clientId),
        mstorgnhirarchyid: Number(this.orgSelected),
        seqno: Number(seq)
      };
      this.rest.getrecordbydifftype(data).subscribe((res: any) => {
        if (res.success) {
          this.allPropertyValues = res.details;
          this.selectAll(this.allPropertyValues);
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    }

    getcategorylevel(type) {
      const data = {
        clientid: Number(this.clientId),
        mstorgnhirarchyid: Number(this.orgSelected),
        // fromrecorddifftypeid:Number(this.fromRecordDiffTypeId),
        fromrecorddiffid:Number(this.fromRecordDiffId)
      };
      if (this.fromPropLevels.length > 0) {
        data['fromrecorddifftypeid'] = Number(this.fromlevelid);
      }else{
        data['fromrecorddifftypeid'] = Number(this.fromRecordDiffTypeId);
      }
      this.rest.getlabelbydiffid(data).subscribe((res: any) => {
        if (res.success) {
          res.details.unshift({id: 0, typename: 'Select Property Level'});
          this.categoryLevelList = res.details;
          if (type === 'i') {
            this.categoryLevelId = 0;
          } else {
            this.categoryLevelId = this.propertyLevel;
          }
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
      });
    }

    selectAll(items: any[]) {
      let allSelect = items => {
        items.forEach(element => {
          element['selectedAllGroup'] = 'selectedAllGroup';
        });
      };
      allSelect(items);
    }

    // getOrganization(type,clientId) {
    //   this.rest.getorganizationclientwise({clientid: Number(clientId)}).subscribe((res) => {
    //     this.respObject = res;
    //     this.organization = this.respObject.details;
    //     if (this.respObject.success) {
    //       if(type==='i'){
    //         this.respObject.details.unshift({id: 0, organizationname: 'Select Organization'});
    //         this.orgSelected = 0;
    //       }
    //       else{
    //         this.orgSelected = this.orgSelected1;
    //       }
    //     } else {
    //       this.notifier.notify('error', this.respObject.message);
    //     }
    //   }, (err) => {
    //     // this.isError = true;
    //     // this.notifier.notify('error', this.messageService.SERVER_ERROR);
    //   });
    // }


    save() {
      for(let i=0;i<this.orgSelectedto.length;i++)
      {
        this.toOrg= this.orgSelectedto[i];
      }
        if(this.fromRecordDiffId.length===0 || this.orgSelectedto.length===0){
          this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
          //console.log(this.fromRecordDiffId,this.orgSelectedto);
        }

          else{
            //console.log(">>>>>>>>>>>>>>>>>>")
            const data = {
              fromclientid : Number(this.clientId),
              fromorgnid : Number(this.orgSelected),
              toclientid : Number(this.clientId),
              toorgnid : this.orgSelectedto,
              differentiationtypeid : Number(this.fromRecordDiffTypeId),
              differerntiationid : this.fromRecordDiffId
            };

            //console.log("DATA", JSON.stringify(data));
            if (!this.messageService.isBlankField(data)) {
              if (this.orgSelected != Number(this.toOrg)) {
              //console.log("OrgFromTo",this.orgSelected,this.toOrg)
              this.rest.createdifferentiationmap(data).subscribe((res) => {
                this.respObject = res;
                if (this.respObject.success) {
                  this.isError = false;
                  const id = this.respObject.details;
                  // this.messageService.setRow({
                  //   id: id,
                  //   fromclientid : Number(this.clientSelected),
                  //   fromclientname :this.clientName,
                  //   fromorgnid: Number(this.orgSelected),
                  //   fromorgnname: this.orgName,
                  //   toclientid : Number(this.toclientSelected),
                  //   toclientname :this.toclientName,
                  //   toorgnid : this.orgSelectedto,
                  //   toorgnname:this.orgNameto,
                  //   differentiationtypeid : Number(this.fromRecordDiffTypeId),
                  //   fromdifftypename : this.fromRecordDiffTypename,
                  //   differerntiationid : this.fromRecordDiffId,
                  //   fromdiffname: this.fromRecordDiffName
                  // });
                  
                  this.totalData = this.totalData + 1;
                  this.messageService.setTotalData(this.totalData);
                  if(this.respObject.message === 'Data Replicated Successfully Done..')
                  {
                    this.getTableData();
                    this.reset();
                    this.notifier.notify('success', 'Data Replicated Successfully Done..');
                  }
                  else{
                    this.getTableData();
                    this.notifier.notify('error',this.respObject.message)
                  }
                } else {
                  this.notifier.notify('error', this.respObject.message);
                }
              }, (err) => {
                this.notifier.notify('error', this.messageService.SERVER_ERROR);
              });
            }
            else{
              this.notifier.notify('error', this.messageService.SAME_ORGANIZATION);
            }
            } else {
              this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
            }
          }
    }

    update() {
      // const data = {
      //   id: this.selectedId,
      //   clientid: Number(this.clientId),
      //   mstorgnhirarchyid: Number(this.orgSelected),
      //   roleid: Number(this.roleSelected),
      //   groupid: Number(this.grpSelected)

      // };
      // console.log(JSON.stringify(data))
      // if (!this.messageService.isBlankField(data)) {

      //   this.rest.updatemapldapgrouprole(data).subscribe((res) => {
      //     this.respObject = res;
      //     if (this.respObject.success) {
      //       this.isError = false;
      //       this.modalReference.close();
      //       this.messageService.sendAfterDelete(this.selectedId);
      //       this.dataLoaded = true;
      //       this.messageService.setRow({
      //           id: this.selectedId,
      //           clientid: Number(this.clientId),
      //           mstorgnhirarchyid: Number(this.orgSelected),
      //           mstorgnhirarchyname: this.orgName,
      //           groupid :Number(this.grpSelected),
      //           groupname: this.grpName,
      //           roleid: Number(this.roleSelected),
      //           rolename: this.roleName
      //       });
      //       //this.getTableData();
      //       this.notifier.notify('success', this.messageService.EDIT_SUCCESS);
      //     } else {
      //       this.isError = true;
      //       this.notifier.notify('error', this.respObject.message);
      //     }
      //   }, (err) => {
      //     this.isError = true;
      //     this.notifier.notify('error', this.messageService.SERVER_ERROR);
      //   });
      // }else {
      //   this.isError = true;
      //   this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
      // }
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
        clientid: Number(this.clientId),
        mstorgnhirarchyid: Number(this.orgnId),
        offset: offset,
        limit: limit
      };
      this.rest.getrecorddiffbyorg(data).subscribe((res) => {
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
