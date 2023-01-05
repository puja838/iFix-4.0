import {Component, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {RestApiService} from '../rest-api.service';
import {MessageService} from '../message.service';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {Formatters, OnEventArgs} from 'angular-slickgrid';

@Component({
  selector: 'app-category-group',
  templateUrl: './category-group.component.html',
  styleUrls: ['./category-group.component.css']
})
export class CategoryGroupComponent implements OnInit {
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
  workId = [];
  workName = [];
  seq: any;
  recorddifftypename: string;
  recorddiffname: string;
  levelName: string;
  fromPropLevels = [];
  fromlevelid: string;
  seqNumber: number;
  private workingtypeid= [];
  private workId1: number;
  isEdit: boolean;
  workingId :any;

  constructor(private rest: RestApiService, private messageService: MessageService,
              private route: Router, private modalService: NgbModal, private notifier: NotifierService) {
    this.messageService.getCellChangeData().subscribe(item => {
      // console.log(item);
      switch (item.type) {
        case 'delete':
          // console.log('deleted');
          if (!this.del) {
            this.notifier.notify('error', this.messageService.DELETE_PERMISSION);
          } else {
            if (confirm('Are you sure?')) {
              // console.log(JSON.stringify(item));
              this.rest.deletecategorysupporgrpmap({id: item.id}).subscribe((res) => {
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
    this.dataLoaded = true;

    this.pageSize = this.messageService.pageSize;
    this.displayData = {
      pageName: 'Maintain Category Group Mapping',
      openModalButton: 'Map Category Group',
      breadcrumb: '',
      folderName: '',
      tabName: 'Map Category Group'
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
          //console.log(JSON.stringify(args.dataContext));
          this.isError = false;
          this.formTicketTypeList = [];
          this.workinglevel = [];
          this.levels = [];
          this.workId = [];
          this.workingtypeid=[];
          this.selectedId = args.dataContext.id;
          this.organizationId = args.dataContext.mstorgnhirarchyid;
          this.fromRecordDiffType = args.dataContext.recorddifftypeid;
          this.fromRecordDiffId = args.dataContext.recorddiffid;
          this.workId.push(args.dataContext.mstworkdifferentiationid);
          this.workName = args.dataContext.mstworkdifferentiationname;

          this.workingtypeid=args.dataContext.mstworkdifferentiationtypeid;
          this.toRecordDiffTypeId = args.dataContext.torecorddifftypeid;
          this.toRecordDiffId = args.dataContext.torecorddiffid;
          this.organizationName = args.dataContext.mstorgnhirarchyname;
          this.recorddifftypename = args.dataContext.recorddifftypename;
          this.recorddiffname = args.dataContext.recorddiffname;
          this.levelName = args.dataContext.Supportgroupname;
          this.levelSelected1 = args.dataContext.mstgroupid;
          this.isEdit=true;
          this.getLevelData("u");
          // console.log(this.fromRecordDiffType, this.fromRecordDiffId+ " <<<<<<<<<<<< SHOW");
          this.getworkingvalue('u',Number(this.fromRecordDiffType),Number(this.fromRecordDiffId));
          for (let i = 0; i < this.recordTypeStatus.length; i++) {
            if (Number(this.recordTypeStatus[i].id) === Number(this.fromRecordDiffType)) {
              this.seq = this.recordTypeStatus[i].seqno;
              this.getrecord(this.seq);
            }
          }
          this.modalReference = this.modalService.open(this.content, {size:'xl'});
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
        id: 'recorddifftypename', name: 'Property Type ', field: 'recorddifftypename', sortable: true, filterable: true
      },
      {
        id: 'recorddiffname', name: 'Property Name ', field: 'recorddiffname', sortable: true, filterable: true
      },
      {
        id: 'mstworkdifferentiationname', name: 'Working Property Name', field: 'mstworkdifferentiationname', sortable: true, filterable: true
      },
      {
        id: 'Supportgroupname', name: 'Support Group Level', field: 'Supportgroupname', sortable: true, filterable: true
      }
    ];

    this.clientId = this.messageService.clientId;
    this.messageService.setColumnDefinitions(columnDefinitions);
    // this.onPageLoad();
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.baseFlag = this.messageService.baseFlag;
      this.loginUserOrganizationId = this.messageService.orgnId;
      this.edit = this.messageService.edit;
      this.del = this.messageService.del;
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

  onOrgChange(index: any) {
    if (this.organizationId !== '') {
      if (index !== 0) {
        this.organizationName = this.organizationList[index - 1].organizationname;
        this.getLevelData('i');
      }
    }
  }

  getLevelData(type) {
    this.rest.getgroupbyorgid({
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId)
    }).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.levels = this.respObject.details;
        if (type === 'i') {
          this.levelSelected = '';
        } else {
          this.levelSelected = this.levelSelected1;
        }
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onLevelChange(index: any) {
    this.levelName = this.levels[index - 1].supportgroupname;
  }

  selectAll(items: any[]) {
    let allSelect = items => {
      items.forEach(element => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }
  clear(item){
    console.log(item)
    const index = this.workId.indexOf(item);
    console.log(index)
    if (index > -1) {
      this.workId.splice(index, 1);
    }
    console.log(this.workId)
  }

  openModal(content) {
    this.isEdit = false;
    this.resetValues();
    this.modalService.open(content,{size:'xl'}).result.then((result) => {
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
    this.rest.getcategorysupporgrpmap(data).subscribe((res) => {
      this.respObject = res;
      this.dataLoaded = true;
      this.executeResponse(this.respObject, offset);

    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  executeResponse(respObject, offset) {
    if (respObject.success) {

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
    this.rest.getRecordDiffType().subscribe((res: any) => {
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
    this.levelSelected = '';
    this.workName = [];
    this.workId=[];
    this.formTicketTypeList = [];
    this.workinglevel = [];
    this.workingtypeid=[];
    this.fromRecordDiffType = '';
    this.levels = [];
  }

  save() {
    // if (this.fromRecordDiffTypeId === this.toRecordDiffTypeId) {
    //   this.isError = true;
    //   this.notifier.notify('error', 'Form record diff type and to record diff type can\'t be same.');
    //   return false;
    // } else {
    //   this.isError = false;
    // }

    for(let i = 0; i< this.workinglevel.length; i++){
      for(let j = 0; j<this.workId.length; j++){
        if(this.workinglevel[i].id === this.workId[j]){
          //console.log(this.workinglevel[i].id," =", this.workId[j])
          this.workingtypeid.push(this.workinglevel[i].recorddifftypid);
          //console.log( this.workingtypeid)
        }
      }
    }

    if(this.workId.length===0 || this.workingtypeid.length===0){
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
      //console.log(this.termNameSelected);
    }
    else{
      const data = {
        clientid: this.clientId,
        mstorgnhirarchyid: Number(this.organizationId),
        mstworkdifferentiationtypeids: this.workingtypeid,
        mstworkdifferentiationids: this.workId,
        mstgroupid: Number(this.levelSelected)
      };
      console.log(JSON.stringify(data))
      if (!this.messageService.isBlankField(data)) {
        this.rest.addcategorysupporgrpmap(data).subscribe((res) => {
          this.respObject = res;
          if (this.respObject.success) {
            const id = this.respObject.details;
            // this.messageService.setRow({
            //   id: id,
            //   mstorgnhirarchyname: this.organizationName,
            //   recorddifftypename: this.recorddifftypename,
            //   recorddiffname: this.recorddiffname,
            //   mstworkdifferentiationname: this.workName,
            //   mstworkdifferentiationid:this.workId,
            //   mstworkdifferentiationtypeid:this.workingtypeid,
            //   Supportgroupname: this.levelName,
            //   mstorgnhirarchyid: this.organizationId,
            //   recorddifftypeid:this.fromRecordDiffType,
            //   recorddiffid:this.fromRecordDiffId,
            //   mstgroupid:this.levelSelected
            // });
            this.totalData = this.totalData + 1;
            this.messageService.setTotalData(this.totalData);
            this.isError = false;
            this.resetValues();
            this.getTableData();
            this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
          } else {
              this.isError = true;
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
      this.workingtypeid = [];
      for(let i = 0; i< this.workinglevel.length; i++){
        for(let j = 0; j<this.workId.length; j++){
          if(this.workinglevel[i].id === this.workId[j]){
            this.workingtypeid=this.workinglevel[i].recorddifftypid;
          }
        }
      }


    const data = {
      id: this.selectedId,
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      mstworkdifferentiationid: Number(this.workId),
      mstworkdifferentiationtypeid: Number(this.workingtypeid),
      mstgroupid: Number(this.levelSelected),

    };
    //console.log('>>>>>>>>>>>>> ', JSON.stringify(data));
    // return false;
    if (!this.messageService.isBlankField(data)) {
      this.rest.updatecategorysupporgrpmap(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {

          this.isError = false;
          this.messageService.sendAfterDelete(this.selectedId);
          this.dataLoaded = true;
          // this.messageService.setRow({
          //   id: this.selectedId,
          //   mstorgnhirarchyname: this.organizationName,
          //   recorddifftypename: this.recorddifftypename,
          //   recorddiffname: this.recorddiffname,
          //   mstworkdifferentiationname: this.workName,
          //   mstworkdifferentiationid:this.workId,
          //   mstworkdifferentiationtypeid:this.workingtypeid,
          //   Supportgroupname: this.levelName,
          //   mstorgnhirarchyid: this.organizationId,
          //   recorddifftypeid:this.fromRecordDiffType,
          //   recorddiffid:this.fromRecordDiffId,
          //   mstgroupid:this.levelSelected
          // });
          this.resetValues();
          this.getTableData();
          this.modalReference.close();
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
      this.isError = true;
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }
  }

  getrecordbydifftype(index) {
    // console.log('index==========' + index);
    if (index !== 0) {
      this.recorddifftypename = this.recordTypeStatus[index - 1].typename;
      this.seqNumber = this.recordTypeStatus[index - 1].seqno;
      // this.getrecord(seqNumber);
      this.getCategoryLevel(this.seqNumber);
    } else {
      this.fromPropLevels = [];
      this.formTicketTypeList = [];
      this.workinglevel = [];
      this.fromlevelid = '';
      this.fromRecordDiffId = '';
      this.workId = [];
    }
  }

  onCatLevelChange(index) {
    let seq;
    seq = this.fromPropLevels[index - 1].seqno;
    this.getrecord(Number(seq));
  }

  getCategoryLevel(seqNumber) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      seqno: Number(seqNumber),
    };
    this.rest.getcategorylevel(data).subscribe((res: any) => {
      if (res.success) {
        if (res.details.length > 0) {
          this.fromPropLevels = res.details;
          this.fromlevelid = '';
        } else {
          this.fromPropLevels = [];
          this.getrecord(Number(seqNumber));
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }


  getrecord(seqNumber) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.organizationId),
      seqno: seqNumber
    };
    this.rest.getrecordbydifftype(data).subscribe((res: any) => {
      if (res.success) {
        this.formTicketTypeList = res.details;
        // console.log(".............." + JSON.stringify(this.formTicketTypeList));
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }


  onPropertyChange(index: any) {
    this.recorddiffname = this.formTicketTypeList[index - 1].typename;
    if (this.fromPropLevels.length > 0) {
      this.fromRecordDiffType = this.fromlevelid;
    }
    this.getworkingvalue('i',Number(this.fromRecordDiffType),Number(this.fromRecordDiffId))
  }
  getworkingvalue(type,forrecorddifftypeid,forrecorddiffid){
    const data = {
      "clientid": Number(this.clientId),
      "mstorgnhirarchyid": Number(this.organizationId),
      "forrecorddifftypeid": forrecorddifftypeid,
      "forrecorddiffid": forrecorddiffid
    }
    this.rest.getworkinglabelname(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        //this.respObject.details.values.unshift({id:0,name:'Select Working Property'})
        this.workinglevel = this.respObject.details.values;
        this.selectAll(this.workinglevel);
        if(type ==='i') {
          //this.workId = 0;
        }else{
          //this.workId =this.workId;
        }
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }


  // onWorkingChange(selectedIndex: any) {
  //   console.log(">>>>>",this.workId)
  //   this.workName = selectedIndex.name;
  //   this.workingId = selectedIndex.id;

  //   console.log(this.workingtypeid,this.recorddiffname,this.workingId);
  // }

  getorganizationclientwise() {
    const data = {
      clientid: Number(this.clientId) ,
      mstorgnhirarchyid: Number(this.loginUserOrganizationId)
    };
    this.rest.getorganizationclientwisenew(data).subscribe((res: any) => {
      if (res.success) {
        this.organizationList = res.details;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

}
