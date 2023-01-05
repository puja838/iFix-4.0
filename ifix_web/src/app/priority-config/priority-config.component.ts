import {Component, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {RestApiService} from '../rest-api.service';
import {MessageService} from '../message.service';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {Formatters, OnEventArgs, Filters} from 'angular-slickgrid';


@Component({
  selector: 'app-priority-config',
  templateUrl: './priority-config.component.html',
  styleUrls: ['./priority-config.component.css']
})
export class PriorityConfigComponent implements OnInit {
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
  @ViewChild('content') private content;
  private modalReference: NgbModalRef;
  organizationId = '';
  organizationName = '';
  ticketTypeName = '';
  ticketType = '';
  formTicketTypeList = [];
  toTicketTypeList = [];
  organizationList = [];
  loginUserOrganizationId: number;
  seqNo = 1;
  recordDifTypeId: number;
  recordTypeStatus = [];
  fromRecordDiffTypeId = '';
  fromRecordDiffType = '';
  fromRecordDiffId = '';
  toRecordDiffTypeId = '';
  toRecordDiffTypeSeqno = '';
  toRecordDiffId = '';
  levels = [];
  levelSelected = '';
  levelSelected1 = '';
  workinglevel = [];
  workId:number;
  workName:string;
  seq:any;
  recorddifftypename:string;
  recorddiffname:string;
  levelName:string;
  followUp:any;
  // workGrpSelected:any;
  fromRecordDiffTypeSeqno: number;
  fromPropLevels =[];
  fromlevelid:any;

  redioButton:any;
  radioName:any;

  basePriorityConfig: boolean;
  basePriorityConfigNumber: number;
  updateFlag = false;
  isPriorityEdit: boolean;

 constructor(private _rest: RestApiService, private messageService: MessageService,
              private route: Router, private modalService: NgbModal, private notifier: NotifierService) {
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
              // console.log(JSON.stringify(item));
              this._rest.deletebusinessdirection({id: item.id}).subscribe((res) => {
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
    this.isPriorityEdit = false;
    this.dataLoaded = true;
    this.basePriorityConfig = false;
    this.basePriorityConfigNumber = 0;
    this.pageSize = this.messageService.pageSize;
    this.displayData = {
      pageName: 'Maintain Priority Configuration',
      openModalButton: 'Priority Configuration',
      breadcrumb: '',
      folderName: '',
      tabName: 'Map Priority Configuration'
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
          this.isPriorityEdit = true;
          this.updateFlag = true;
          this.formTicketTypeList = [];
          this.selectedId = args.dataContext.id;
          this.organizationId = args.dataContext.mstorgnhirarchyid;
          this.fromRecordDiffType = args.dataContext.mstrecorddifferentiationtypeid;
          this.fromRecordDiffId = args.dataContext.mstrecorddifferentiationid;
          this.redioButton = String(args.dataContext.direction);
          this.organizationName = args.dataContext.mstorgnhirarchyname;
          this.recorddifftypename = args.dataContext.mstrecorddifferentiationtypename;
          this.recorddiffname = args.dataContext.mstrecorddifferentiationname;
          this.radioName = args.dataContext.directionName;
          this.basePriorityConfigNumber = args.dataContext.baseconfig;
          // this.basePriorityConfig = args.dataContext.baseconfig
          this.organizationName = args.dataContext.mstorgnhirarchyname;
          // this.recorddifftypename = args.dataContext.recorddifftypename;
          // this.recorddiffname = args.dataContext.recorddiffname;
          this.levelName = args.dataContext.Supportgroupname

          if(this.basePriorityConfigNumber === 0) {
            this.basePriorityConfig = false;
          } else {
            this.basePriorityConfig = true;
          }

          for(let i = 0;i<this.recordTypeStatus.length ;i++){
            if(Number(this.recordTypeStatus[i].id) === Number(this.fromRecordDiffType)){
                 this.seq = this.recordTypeStatus[i].seqno;
                 this.getrecord(this.seq);
            }
          }
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
        id: 'orgn', name: 'Organization', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'recorddifftypename', name: 'Property Type ', field: 'mstrecorddifferentiationtypename', sortable: true, filterable: true
      },
      {
        id: 'recorddiffname', name: 'Property Name ', field: 'mstrecorddifferentiationname', sortable: true, filterable: true
      },
      {
        id: 'duration', name: 'Duration', field: 'directionName', sortable: true, filterable: true
      },
      {
        id: 'baseconfig', name: 'Default Priority', field: 'baseconfig', sortable: true, filterable: true, formatter: Formatters.checkmark,
        filter: {
          collection: [{value: '', label: 'All'},{value: 1, label: 'True'}, {value: 0, label: 'False'}],
          model: Filters.singleSelect,
          filterOptions: {
            autoDropWidth: true
          },
        }, minWidth: 40,
      },
      // {
      //   id: 'recordlevelname', name: 'Record Level ', field: 'recordlevelname', sortable: true, filterable: true
      // },
      // {
      //   id: 'Supportgroupname', name: 'Support Group Level', field: 'mstrecorddifferentiationname', sortable: true, filterable: true
      // }
    ];

    this.clientId = this.messageService.clientId;
    this.messageService.setColumnDefinitions(columnDefinitions);
    // this.onPageLoad();
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.baseFlag = this.messageService.baseFlag;
      this.loginUserOrganizationId = this.messageService.orgnId;
      this.edit =this.messageService.edit;
      this.del =this.messageService.del;
      this.onPageLoad();
    } else {
      this.adminAuth = this.messageService.getClientUserAuth().subscribe(auth => {
        // this.view = auth[0].viewFlag;
        // this.add = auth[0].addFlag;
          this.edit = auth[0].editFlag;
          this.del = auth[0].deleteFlag;
        this.clientId = auth[0].clientid;
        this.baseFlag = auth[0].baseFlag;
        this.loginUserOrganizationId = auth[0].mstorgnhirarchyid;
        // console.log('auth1===' + JSON.stringify(auth));
        this.onPageLoad();
      });
    }
  }

  onPageLoad() {
    // this.getTableData();
    this.getorganizationclientwise();
    this.getRecordDiffType();
   
  }

  onOrgChange(index:any){
    // console.log("lll"+index + JSON.stringify(this.organizationList));

    this.organizationName = this.organizationList[index - 1].organizationname;
    // this.getLevelData('i');
  }
  // getLevelData(type){
  //   this._rest.getgroupbyorgid({clientid: this.clientId, mstorgnhirarchyid: Number(this.organizationId)}).subscribe((res) => {
  //     this.respObject = res;
  //     if (this.respObject.success) {
  //       this.levels = this.respObject.details;
  //       if(type === 'i'){
  //         this.levelSelected = '';

  //       }else{
  //         this.levelSelected = this.levelSelected1
  //       }
     
  //     } else {
  //       this.notifier.notify('error', this.respObject.message);
  //     }
  //   }, (err) => {
  //     this.notifier.notify('error', this.messageService.SERVER_ERROR);
  //   });
  // }

  onWrkLevelChange(index:any){
    this.workinglevel = this.levels[index-1].recorddiffname;
  }
  openModal(content) {
      this.isError = false;
      this.resetValues();
      this.isPriorityEdit = false;
      // this.notifier.notify('success', 'Module added successfully');
      this.modalService.open(content, {size: 'sm'}).result.then((result) => {
      }, (reason) => {

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
      clientid: this.clientId,
      mstorgnhirarchyid: this.loginUserOrganizationId,
      offset: offset,
      limit: limit
    };
    // console.log(data);
    this._rest.getbusinessdirection(data).subscribe((res) => {
      this.respObject = res;
      // console.log('>>>>>>>>>>> ', JSON.stringify(res));
      for(let i=0;i<this.respObject.details.values.length ;i++){
        if(Number(this.respObject.details.values[i].direction) === 1){
        this.respObject.details.values[i].directionName = 'Urgency Wise'
      }else{
        this.respObject.details.values[i].directionName = 'Category Wise'
      }
    }
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
    this._rest.getRecordDiffType().subscribe((res: any) => {
      if (res.success) {
        this.recordTypeStatus = res.details;
      }
    });
  }

  resetValues() {
    this.organizationId = '';
    this.fromRecordDiffTypeId = '';
    this.fromRecordDiffId = '';
    this.toRecordDiffTypeId = '';
    this.toRecordDiffId = '';
    // this.levelSelected = '' ; 
    // this.workName = '';
    this.fromRecordDiffType = '';
    this.levels = [];
    // this.workGrpSelected = '';
    this.fromPropLevels = [];
    this.fromlevelid = '';
    this.basePriorityConfig = false;
    this.basePriorityConfigNumber = 0;
    this.redioButton = 0;
    this.updateFlag = false;
    this.isPriorityEdit = false;
  }

  
  onRadioButtonChange(selectedValue) {
    // console.log(selectedValue);
    // this.radioName= selectedValue.name;
    // console.log(this.radioName);
    // this.parents = [];
    // this.getMenu();
    // this.getUrls();
  }


  save() {
    if(Number(this.redioButton) === 1){
      this.radioName = 'Urgency Wise'
    }else{
      this.radioName = 'Category Wise'
    }
    // console.log("\n this.basePriorityConfig  ======   ", this.basePriorityConfig);
    if(this.basePriorityConfig === false) {
      this.basePriorityConfigNumber = 0;
    } else {
      this.basePriorityConfigNumber = 1;
    }

    // {"clientid":1,"mstorgnhirarchyid":1,
    // "mstrecorddifferentiationtypeid":1,"mstrecorddifferentiationid":1,"direction":1}
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      mstrecorddifferentiationid:Number(this.fromRecordDiffId),
      direction:Number(this.redioButton)
    };

    if(this.fromPropLevels.length > 0){
      data['mstrecorddifferentiationtypeid'] = Number(this.fromlevelid);
    }else{
      data['mstrecorddifferentiationtypeid'] = Number(this.fromRecordDiffType);
    }

    if (!this.messageService.isBlankField(data)) {
      data['baseconfig'] = this.basePriorityConfigNumber;
      // console.log("kkkkkkkkkkk"+JSON.stringify(data))
      this._rest.addbusinessdirection(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          const id = this.respObject.details;
          // this.messageService.setRow({
          //   id: id,
          //   mstorgnhirarchyname: this.organizationName,
          //   mstrecorddifferentiationtypename:this.recorddifftypename,
          //   mstrecorddifferentiationname:this.recorddiffname,
          //   directionName:this.radioName,
          //   baseconfig: this.basePriorityConfigNumber
          // });
          // this.totalData = this.totalData + 1;
          // this.messageService.setTotalData(this.totalData);
          this.getTableData();
          this.isError = false;
          this.resetValues();
          // this.getTableData();
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
    if(Number(this.redioButton) === 1){
    this.radioName = 'Urgency Wise'
  }else{
    this.radioName = 'Category Wise'
  }
  if(this.basePriorityConfig === false) {
    this.basePriorityConfigNumber = 0;
  } else {
    this.basePriorityConfigNumber = 1;
  }

  const data = {
    id: this.selectedId,
    clientid: this.clientId,
    mstorgnhirarchyid: Number(this.organizationId),
    mstrecorddifferentiationid:Number(this.fromRecordDiffId),
    direction:Number(this.redioButton)
  };

  if(this.fromPropLevels.length > 0){
    data['mstrecorddifferentiationtypeid'] = Number(this.fromlevelid);
  }else{
    data['mstrecorddifferentiationtypeid'] = Number(this.fromRecordDiffType);
  }

  // console.log('<<<<<<< ', JSON.stringify(data));
  // return false;
  if (!this.messageService.isBlankField(data)) {
    data['baseconfig'] = this.basePriorityConfigNumber;
    // console.log('>>>>>>>>>>>>>   ', this.recorddifftypename , ">>>>>>>>>>>>>>   ", this.recorddiffname);
      this._rest.updatebusinessdirection(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          // this.messageService.sendAfterDelete(this.selectedId);
          this.dataLoaded = true;
          // this.messageService.setRow({
          //   id: this.selectedId,
          //   clientid: this.clientId,
          //   mstorgnhirarchyid: Number(this.organizationId),
          //   mstrecorddifferentiationid:Number(this.fromRecordDiffId),
          //   direction:Number(this.redioButton),

          //   mstorgnhirarchyname: this.organizationName,
          //   mstrecorddifferentiationtypename:this.recorddifftypename,
          //   mstrecorddifferentiationname:this.recorddiffname,
          //   directionName:this.radioName,
          //   baseconfig: this.basePriorityConfigNumber
          // });
          this.getTableData();
          // this.resetValues();
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

  getrecordbydifftype(index) {
    this.recorddifftypename = this.recordTypeStatus[index - 1].typename;
    if (index !== 0) {
      this.fromPropLevels = [];
      this.formTicketTypeList = [];
      this.fromRecordDiffId ='' ;
      this.fromlevelid ='';
      const seqNumber = this.recordTypeStatus[index - 1].seqno;

      const data = {
        clientid: this.clientId,
        mstorgnhirarchyid: Number(this.organizationId),
        seqno: Number(seqNumber),
      };
      this._rest.getcategorylevel(data).subscribe((res: any) => {
        if (res.success) {
          if (res.details.length > 0) {
            
         
              this.fromPropLevels = res.details;
              // this.fromlevelid = 0;
           
          } else {
           
              this.fromPropLevels = [];
              this.fromlevelid = '';
            this.getrecord(Number(seqNumber));
          }
        } else {
          
          this.notifier.notify('error', this.respObject.message );
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });

     
    }
  }
  onLevelChange(selectedIndex: any) {
    let seq;
  
      seq = this.fromPropLevels[selectedIndex -1].seqno;
    
    this.getrecord(seq);
  }


  getrecord(seqNumber){

    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      seqno: Number(seqNumber)
    };
    this._rest.getrecordbydifftype(data).subscribe((res: any) => {
      if (res.success) {
          this.formTicketTypeList = res.details;
          // console.log(".............."+JSON.stringify(this.formTicketTypeList));
        
      } else {
        this.notifier.notify('error', this.respObject.message );
      }
    }, (err) => {
      // console.log(err);
    });
  }
  


  onPropertyChange(index:any){
    this.recorddiffname = this.formTicketTypeList[index -1].typename;
    // this.getWorkingCategory();
  
  }

  // clientid,mstorgnhirarchyid,forrecorddifftypeid,forrecorddiffid
  // getWorkingCategory(){
  //         const data = {"clientid":Number(this.clientId),
  //         "mstorgnhirarchyid":Number(this.organizationId),
  //         // "forrecorddifftypeid":Number(this.fromRecordDiffType),
  //         "forrecorddiffid":Number(this.fromRecordDiffId)
  //       }
 
  //       if(this.fromlevelid !== ''){
  //        data['forrecorddifftypeid'] = Number(this.fromlevelid);
  //       }else{
  //         data['forrecorddifftypeid'] = Number(this.fromRecordDiffType);
  //       }

  //     this._rest.getworkdifferentiationvalue(data).subscribe((res) => {
  //     this.respObject = res;
  //     if (this.respObject.success) {
  //     this.workinglevel = this.respObject.details;
  //     if(this.workinglevel.length > 0){
  //       this.workId = this.workinglevel[0].mstworkdifferentiationid;
  //       this.workName = this.workinglevel[0].levelname ; 
  //     }else{
  //       this.workId = 0;
  //       this.workName = '' ; 
  //     }


  //     } else {
  //       this.notifier.notify('error', this.respObject.message);
  //     }
  //     }, (err) => {
  //       this.notifier.notify('error', this.messageService.SERVER_ERROR);
  //     });
  // }

  getorganizationclientwise() {
    this._rest.getorganizationclientwisenew({clientid: Number(this.clientId),mstorgnhirarchyid: Number(this.loginUserOrganizationId)}).subscribe((res: any) => {
      if (res.success) {
        this.organizationList = res.details;
      } else {
        this.notifier.notify('error', this.respObject.message );
      }
    }, (err) => {
      // console.log(err);
    });
  }


}
