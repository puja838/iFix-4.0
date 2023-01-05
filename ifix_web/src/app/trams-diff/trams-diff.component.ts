import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {RestApiService} from '../rest-api.service';
import {Filters, Formatters, OnEventArgs} from 'angular-slickgrid';
import {MessageService} from '../message.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-trams-diff',
  templateUrl: './trams-diff.component.html',
  styleUrls: ['./trams-diff.component.css']
})
export class TramsDiffComponent implements OnInit, OnDestroy {
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
  orgName: string;
  clientId: number;
  orgId: number;
  termNames = [];
  termNameSelected: number;
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
  termNameSelected1: number;
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
  @ViewChild('content1') private content1;
  private modalReference: NgbModalRef;
  propLevels=[];
  levelid: number;
  typename : any

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
              console.log(JSON.stringify(item));
              this.rest.deletemststateterms({id: item.id}).subscribe((res) => {
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
    this.displayData = {
      pageName: 'Map Record With Property',
      openModalButton: 'Add Record With Property',
      breadcrumb: 'Term & Differentiation',
      folderName: 'All Term & Differentiation',
      tabName: 'Map Record With Property',
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
      /*{
        id: 'edit',
        field: 'id',
        excludeFromHeaderMenu: true,
        formatter: Formatters.editIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          this.isError = false;
          this.selectedId = args.dataContext.id;
          this.organizationName = args.dataContext.mstorgnhirarchyname;
          this.termNameSelected1 = args.dataContext.recordtermid;
          this.recordTypeIdSelected1 = args.dataContext.recorddifftypeid;
          this.recordTypeNameSelected1 = args.dataContext.recorddiffid;
          const isCompulsory = args.dataContext.iscompulsory;
          if (isCompulsory === 1) {
            this.isMandatory1 = true;
          } else {
            this.isMandatory1 = false;
          }
          this.termNames = [];
          this.recordTypeIds = [];
          this.recordTypeNames = [];
          this.orgnId = args.dataContext.mstorgnhirarchyid;
          this.getTermName(this.orgnId);
          this.updateFlag = 1;
          this.getRecordTypes();
          this.modalReference = this.modalService.open(this.content1, {});
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },*/
      {
        id: 'organization', name: 'Organization ', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'termname', name: 'Term Name ', field: 'termname', sortable: true, filterable: true
      },
      {
        id: 'mstrecorddifferentiationtypename',
        name: 'Record Type ',
        field: 'mstrecorddifferentiationtypename',
        sortable: true,
        filterable: true
      },
      {
        id: 'mstrecorddifferentiationname',
        name: 'Record Value ',
        field: 'mstrecorddifferentiationname',
        sortable: true,
        filterable: true
      },{
        id: 'iscompulsory', name: 'Is Compulsory', field: 'iscompulsory', sortable: true, filterable: true, formatter: Formatters.checkmark,
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
      this.orgId = this.messageService.orgnId;
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
        this.orgId = auth[0].mstorgnhirarchyid;
        this.baseFlag = auth[0].baseFlag;
        this.onPageLoad();
      });
    }
  }

  onPageLoad() {
  }

  openModal(content) {
    this.reset();
    this.getOrganization(this.clientId, this.orgId);
    this.getRecordTypes();
    this.modalService.open(content, {size: 'sm'}).result.then((result) => {
    }, (reason) => {

    });
  }

  getTermName(orgId) {
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(orgId)
    }
    this.rest.listmstrecordterms(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, termname: 'Select term name'});
        this.termNames = this.respObject.details;
        this.termNameSelected = 0;
        this.selectedTermName = this.termNameSelected1;
      } else {
        this.notifier.notify('error',  this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error',  this.messageService.SERVER_ERROR);
    });
  }

  getRecordTypes() {
    this.rest.getRecordDiffType().subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, typename: 'Select record type'});
        this.recordTypeIds = this.respObject.details;
        this.recordTypeIdSelected = 0;
        this.selectedRecordTypeId = this.recordTypeIdSelected1;
        if (this.updateFlag === 1) {
          for (let i = 0; i < this.recordTypeIds.length; i++) {
            if (this.recordTypeIds[i].id === this.recordTypeIdSelected1) {
              this.seq = this.recordTypeIds[i].seqno;
            }
          }
          const data = {
            clientid: this.clientId,
            mstorgnhirarchyid: Number(this.orgnId),
            seqno: Number(this.seq)
          };
          this.getrecordbydifftype(data);
        }
      } else {
        this.notifier.notify('error',  this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error',  this.messageService.SERVER_ERROR);
    });
  }

  save() {
    let isCompulsory;
    if (this.isMandatory) {
      isCompulsory = 1;
    } else {
      isCompulsory = 0;
    }
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgSelected),
      // recorddifftypeid: Number(this.recordTypeIdSelected),
      recorddiffid: Number(this.recordTypeNameSelected),
      recordtermid: Number(this.termNameSelected),
      // recordtermvalue: this.recordtermvalue,
      // iscompulsory: isCompulsory
    };
    if (this.propLevels.length === 0) {
      data['recorddifftypeid'] = Number(this.recordTypeIdSelected);
    } else {
      data['recorddifftypeid'] = Number(this.levelid);
    }
    // console.log('data==============' + JSON.stringify(data));
    if (!this.messageService.isBlankField(data)) {
      data['iscompulsory']=isCompulsory;
      data['recordtermvalue']=this.recordtermvalue;
      this.rest.addmststateterms(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          const id = this.respObject.details;
          this.messageService.setRow({
            id: id,
            mstorgnhirarchyname: this.orgName,
            termname: this.termName,
            mstrecorddifferentiationtypename: this.recordType,
            // recorddiffid: Number(this.recordTypeNameSelected),
            mstrecorddifferentiationname: this.recordTypeName,
            iscompulsory:this.isMandatory
          });
          this.totalData = this.totalData + 1;
          this.messageService.setTotalData(this.totalData);
          this.reset();
          this.isError = false;
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
    let isCompulsory;
    if (this.isMandatory1) {
      isCompulsory = 1;
    } else {
      isCompulsory = 0;
    }
    const data = {
      id: this.selectedId,
      recorddifftypeid: Number(this.selectedRecordTypeId),
      recorddiffid: Number(this.selectedRecordTypeName),
      recordtermid: Number(this.selectedTermName),
      // recordtermvalue: this.recordtermvalue,
      // iscompulsory: isCompulsory
    };
    if (!this.messageService.isBlankField(data)) {
      data['iscompulsory']=isCompulsory;
      data['recordtermvalue']=this.recordtermvalue;
      this.rest.updatemststateterms(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          this.messageService.sendAfterDelete(this.selectedId);
          this.dataLoaded = true;
          this.getTableData();
          this.modalReference.close();
          this.notifier.notify('success', this.messageService.EDIT_SUCCESS);
        } else {
          this.notifier.notify('error',  this.respObject.message);
        }
      }, (err) => {
        this.notifier.notify('error',  this.messageService.SERVER_ERROR);
      });
    } else {
      this.notifier.notify('error',  this.messageService.BLANK_ERROR_MESSAGE);
    }
  }

  reset() {
    this.orgSelected = 0;
    this.termNames = [];
    this.recordTypeIdSelected = 0;
    this.recordTypeNames = [];
    this.recordTypeNameSelected = 0;
    this.termNameSelected = 0;
  }

  onOrgChange(index) {
    this.orgName = this.organization[index].organizationname;
    this.getTermName(this.orgSelected);
  }

  onTermNameChange(index) {
    this.termName = this.termNames[index].termname;
    this.recordtermvalue = this.termNames[index].termvalue;
    // console.log(this.recordtermvalue)
  }

  onRecordTypeIdChange(index) {
    this.recordType = this.recordTypeIds[index].typename;
    const seqNumber = this.recordTypeIds[index].seqno;
    this.propLevels=[];
    this.recordTypeNames=[];
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.orgSelected),
      seqno: Number(seqNumber),
    };
    this.rest.getcategorylevel(data).subscribe((res: any) => {
      if (res.success) {
        if (res.details.length > 0) {
          res.details.unshift({id: 0, typename: 'Select Property Level'});
          this.propLevels=res.details;
          this.levelid=0;
        } else {
          this.propLevels=[];
          const data = {
            clientid: this.clientId,
            mstorgnhirarchyid: Number(this.orgSelected),
            seqno: Number(seqNumber)
          };
          this.getrecordbydifftype(data);
          
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      // this.isError = true;
      // this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getrecordbydifftype(data) {
    console.log(data)
    this.rest.getrecordbydifftype(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        //this.respObject.details.unshift({id: 0, typename: 'Property Value'})
        this.recordTypeNames = this.respObject.details;
        for(let i=0;i< this.recordTypeNames.length;i++){
          if( this.recordTypeNames[i].parentname!=''){
            // this.respObject.details.unshift({id: 0, typename: 'Property Value'})
            this.recordTypeNames[i].typename = this.recordTypeNames[i].typename.concat("(" + this.respObject.details[i].parentname + ")")
          }
          else{
            // this.respObject.details.unshift({id: 0, typename: 'Property Value'})
            this.recordTypeNames[i].typename = this.recordTypeNames[i].typename
          }
        }
        this.recordTypeNameSelected = 0;
        this.selectedRecordTypeName = this.recordTypeNameSelected1;
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      // this.isError = true;
      // this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onRecordTypeNameChange(index) {
    console.log(index)
    this.recordTypeName = this.recordTypeNames[index-1].typename;
    console.log("Name: ",this.recordTypeName)
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
      clientid: this.clientId,
      mstorgnhirarchyid: this.orgId,
      offset: offset,
      limit: limit
    };
    console.log(data);
    this.rest.getmststateterms(data).subscribe((res) => {
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
      for (let i = 0; i < respObject.details.values.length; i++) {
        respObject.details.values[i].isCompulsory = (respObject.details.values[i].isCompulsory === 1) ? true : false;
      }
      const data = respObject.details.values;
      this.messageService.setTotalData(this.totalData);
      this.messageService.setGridData(data);
      this.messageService.setGrouping({field:'mstrecorddifferentiationtypename',name:'Record Type'})
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

  onLevelChange(selectedIndex: any, from: string) {
    const seq = this.propLevels[selectedIndex].seqno;
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.orgSelected),
      seqno: Number(seq)
    };
    this.getrecordbydifftype(data);
  }
}
