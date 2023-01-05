import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {RestApiService} from '../rest-api.service';
import {Filters, Formatters, OnEventArgs} from 'angular-slickgrid';
import {MessageService} from '../message.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';
import {NgSelectModule, NgOption} from '@ng-select/ng-select';


@Component({
  selector: 'app-group-term-map',
  templateUrl: './group-term-map.component.html',
  styleUrls: ['./group-term-map.component.css']
})
export class GroupTermMapComponent implements OnInit {

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
  termNames = [];
  termNameSelected= [];
  termName: string;
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
  termNameSelected1:any;
  selectedTermName: number;
  recordTypeIdSelected1: number;
  selectedRecordTypeId: number;
  recordTypeNameSelected1: number;
  selectedRecordTypeName: number;
  seq: number;
  updateFlag = 0;
  orgnId: number;
  isMandatory: boolean;
  isMandatory1: boolean;
  @ViewChild('content') private content;
  private modalReference: NgbModalRef;
  propLevels=[];
  levelid: number;
  grpSelected:any;
  grpSelected1:number;
  groups = [];
  grpName:string;
  isEdit: boolean;
  termsName:string;
  termsId = [];
  isWrite:boolean;
  isRead:boolean;

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
                //console.log(JSON.stringify(item));
                this.rest.deletemstsupportgrp({id: item.id}).subscribe((res) => {
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
    this.isWrite = true;
    this.isRead = true;
    this.pageSize = this.messageService.pageSize;

    this.displayData = {
      pageName: 'Group Term Map',
      openModalButton: 'Add Group Term Map',
      breadcrumb: 'Group Term Map',
      folderName: 'Group Term Map',
      tabName: 'Group Term Map',
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
          //this.grpSelected = 0;
          this.reset();
          console.log("\n ARGS DATA CONTEXT  :: "+JSON.stringify(args.dataContext));
          this.selectedId = args.dataContext.id;
          this.clientSelected = args.dataContext.clientid;
          this.orgName = args.dataContext.mstorgnhirarchyname;
          this.orgSelected1 = args.dataContext.mstorgnhirarchyid;
          this.termsName = args.dataContext.Termname;
          this.termNameSelected = args.dataContext.Termid;


          // this.termNameSelected.push({'id':this.termNameSelected1,'termname':this.termsName});
          //console.log(this.termNameSelected);

          const isWritePer = args.dataContext.writepermission;
          const isReadPer = args.dataContext.readpermission;
          this.isWrite = Number(isWritePer) === 1 ? true : false;
          this.isRead =  Number(isReadPer) === 1 ? true : false;
          this.grpSelected = args.dataContext.Grpid;
          this.grpName = args.dataContext.Grpname;
          this.getOrganization('u',this.clientSelected);
          this.getTermName('u',this.orgSelected1);
          this.getGroupData('u',this.orgSelected1);
          this.isEdit=true;
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
      id: 'groupname', name: 'Support Group Name', field: 'Grpname', sortable: true, filterable: true
      },
      {
        id: 'termName', name: 'Term Name ', field: 'Termname', sortable: true, filterable: true
      },
      {
        id: 'readpermission' , name:'Read' ,field : 'readpermission', sortable: true, filterable: true, formatter: Formatters.checkmark,
        filter: {
          collection: [{value: '', label: 'All'}, {value: true, label: 'True'}, {value: false, label: 'False'}],
          model: Filters.singleSelect,

          filterOptions: {
            autoDropWidth: true
          },
        }, minWidth: 40
      },
      {
        id: 'writepermission' , name:'Write' ,field : 'writepermission', sortable: true, filterable: true, formatter: Formatters.checkmark,
        filter: {
          collection: [{value: '', label: 'All'}, {value: true, label: 'True'}, {value: false, label: 'False'}],
          model: Filters.singleSelect,

          filterOptions: {
            autoDropWidth: true
          },
        }, minWidth: 40
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
    this.getOrganization('i',this.clientId);
    this.isEdit = false;
    //this.getRecordTypes();
    this.modalService.open(content).result.then((result) => {
    }, (reason) => {

    });
  }


  save() {
    if(this.termNameSelected.length===0){
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
      //console.log(this.termNameSelected);
    }
    else{
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgSelected),
      Termid:this.termNameSelected,
      Grpid :Number(this.grpSelected)
    };
    if (!this.messageService.isBlankField(data)) {
      data['readpermission']= this.isRead === true ? "1" : "0";
      data['writepermission']= this.isWrite === true ? "1" : "0";
      //console.log('data==============' + JSON.stringify(data));
      this.rest.addmstsupportgrp(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          const id = this.respObject.details;
          // this.messageService.setRow({
          //   id: id,
          //   clientid: Number(this.clientId),
          //   mstorgnhirarchyid: Number(this.orgSelected),
          //   mstorgnhirarchyname: this.orgName,
          //   Termid:this.termNameSelected,
          //   Termname:this.termsName,
          //   Grpid :Number(this.grpSelected),
          //   Grpname: this.grpName
          // });
          this.getTableData();
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
    if(this.termNameSelected.length===0){
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
      //console.log(this.termNameSelected);
    }
    else{
    const data = {
      id: this.selectedId,
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgSelected),
      Termid:this.termNameSelected,
      Grpid :Number(this.grpSelected)
    };
    if (!this.messageService.isBlankField(data)) {
      data['readpermission']= this.isRead === true ? "1" : "0";
      data['writepermission']= this.isWrite === true ? "1" : "0";
      //console.log('data==============' + JSON.stringify(data));
      this.rest.updatemstsupportgrp(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          this.modalReference.close();
          this.messageService.sendAfterDelete(this.selectedId);
          this.dataLoaded = true;
          // this.messageService.setRow({
          //     id: this.selectedId,
          //     clientid: Number(this.clientId),
          //     mstorgnhirarchyid: Number(this.orgSelected),
          //     mstorgnhirarchyname: this.orgName,
          //     Termid:Number(this.termNameSelected),
          //     Termname:this.termsName,
          //     Grpid :Number(this.grpSelected),
          //     Grpname: this.grpName
          //   });
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
      this.isError = true;
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }
  }
  }

  reset() {
    this.orgSelected = 0;
    this.grpSelected = 0;
    this.termNameSelected = [];
    this.termNames = [];
    this.groups=[];
    this.termsId = [];
    this.isWrite = true;
    this.isRead = true;
  }

  onOrgChange(index) {
    this.orgName = this.organization[index].organizationname;
    this.getTermName('i',this.orgSelected);
    this.getGroupData('i',this.orgSelected);
  }

  // onTermNameChange(index) {
  //   console.log("terms",index )
  //   this.termsName = index.termname;
  //   this.termsId.push(index.id);
  //   console.log("select",this.termsId)
  // }

  ongrpChange(selectedIndex: any) {
    this.grpName = this.groups[selectedIndex].supportgroupname;
  }

  getGroupData(type,orgnId){
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(orgnId),
    }
    this.rest.getgroupbyorgid(data).subscribe((res) => {
      this.respObject = res;
      this.groups = this.respObject.details;
      if (this.respObject.success) {
        if(type==='i'){
          //this.respObject.details.unshift({id: 0, supportgroupname: 'Select Support Group'});
          this.grpSelected = 0;
        }
        else{
          //this.grpSelected = this.grpSelected1;
        }
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, function (err) {

    });
  }

  getTermName(type,orgnId) {
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(orgnId)
    }
    this.rest.listmstrecordterms(data).subscribe((res) => {
      this.respObject = res;
      this.termNames = this.respObject.details;
      this.selectAll(this.termNames)
      if (this.respObject.success) {
        if(type==='i'){
          //this.respObject.details.unshift({id: 0, termname: 'Select Term Name'});
        }
        else{
          //this.termNameSelected = this.termNameSelected1;
        }
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.isError = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
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

  getOrganization(type,clientId) {
    this.rest.getorganizationclientwisenew({clientid: Number(this.clientId),mstorgnhirarchyid: Number(this.orgnId)}).subscribe((res) => {
      this.respObject = res;
      this.organization = this.respObject.details;
      if (this.respObject.success) {
        if(type==='i'){
          this.respObject.details.unshift({id: 0, organizationname: 'Select Organization'});
          this.orgSelected = 0;
          //console.log("Type======",type)
        }
        else{
          this.orgSelected = this.orgSelected1;
          //console.log("Type======",type)
        }
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      // this.isError = true;
      // this.notifier.notify('error', this.messageService.SERVER_ERROR);
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
      "clientid": Number(this.clientId),
      "mstorgnhirarchyid": Number(this.orgnId),
      "offset": offset,
      "limit": limit,
    };
    //console.log("********",data)
    this.rest.getmstsupportgrp(data).subscribe((res) => {
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
      for (let i = 0; i < respObject.details.values.length; i++) {
        respObject.details.values[i].readpermission = (respObject.details.values[i].readpermission === "1") ? true : false;
        respObject.details.values[i].writepermission = (respObject.details.values[i].writepermission === "1") ? true : false;
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
