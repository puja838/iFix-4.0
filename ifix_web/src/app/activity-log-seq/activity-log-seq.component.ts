import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {RestApiService} from '../rest-api.service';
import {Filters, Formatters, OnEventArgs} from 'angular-slickgrid';
import {MessageService} from '../message.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-activity-log-seq',
  templateUrl: './activity-log-seq.component.html',
  styleUrls: ['./activity-log-seq.component.css']
})
export class ActivityLogSeqComponent implements OnInit {
  displayed = true;
  totalData = 0;
  show: boolean;
  selected: number;
  respObject: any;
  clientSelected= 0;
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
  clientSelectedName: string;
  orgSelectedName: string;
  @ViewChild('content1') private content1;
  private modalReference: NgbModalRef;
  selectedId: number;
  userClientName: any;
  action: any;
  isEdit: boolean;
  clients = [];
  organizationto = [];
  orgSelectedto = []
  clientOrgnId:any;
  notAdmin:boolean;
  actDesc:any;
  orgSelected1:any;
  clientSelectedto : any;
  clientto = [];
  activitys = [];
  activitySelected = [];
  orgTo:any;

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
                this.rest.deletemstrecordactivity({id: item.id}).subscribe((res) => {
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
      pageName: 'Maintain Activity Description',
      openModalButton: 'Add Activity Description',
      breadcrumb: 'Activity Description',
      folderName: 'All Activity Description',
      tabName: 'Activity Description',
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
          console.log(JSON.stringify(args.dataContext));
          this.isError = false;
          this.resetValues();
          this.selectedId = args.dataContext.id;
          //this.clientId = args.dataContext.clientid;
          this.clientSelectedName = args.dataContext.clientname;
          this.orgName = args.dataContext.mstorgnhirarchyname;
          this.orgSelected1 = args.dataContext.mstorgnhirarchyid;
          this.actDesc = args.dataContext.activitydesc;
          this.isEdit=true;   
          if (this.baseFlag) {
            this.clientSelected = args.dataContext.clientid;

            for(let i = 0;i<this.clients.length;i++){
              if(this.clients[i].id === this.clientSelected){
                this.orgId = this.clients[i].orgnid
              }
            }
          }
          else{
            this.clientSelected = this.clientId;
          }
          this.getOrganization(this.clientSelected,this.orgId,'u');
          this.modalReference = this.modalService.open(this.content1);
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },
      {
        id: 'mstorgnhirarchyname', name: 'Organization ', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'activitydesc', name: 'Activity Describtion ', field: 'activitydesc', sortable: true, filterable: true
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
    if (this.baseFlag) {
      this.getClients();
    } else {
      this.clientSelected = this.clientId;
      this.clientSelectedto = this.clientId;
      this.clientSelectedName = this.messageService.clientname;
      this.clientOrgnId = this.orgId;
      //console.log(">>>>>>>>>>>>>>>>>",this.clientSelected,this.clientOrgnId);
      this.getOrganization(this.clientSelected,this.clientOrgnId,'i');
      this.getOrganizationto(this.clientSelectedto,this.clientOrgnId)
    }
    
  }

  openModal(content) {
    //this.clientSelected = 0;
    this.resetValues();
    this.isEdit = false;
    // if (this.baseFlag) {
    //   this.getClients();
    // } else {
    //   this.clientSelected = this.clientId;
    //   this.clientOrgnId = this.orgId;
    //   this.getOrganization(this.clientId, this.orgId);
    // }
    this.modalService.open(content).result.then((result) => {
    }, (reason) => {

    });
  }

  getClients() {
    this.rest.getallclientnames().subscribe((res: any) => {
      if (res.success) {
        // res.details.unshift({id: 0, name: 'Select Client'});
        this.clients = res.details;
        this.clientto =  res.details;
        this.clientSelected = 0;
        this.clientSelectedto = 0;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
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

  onClientChange(selectedIndex: any) {
    this.clientSelectedName = this.clients[selectedIndex-1].name;
    this.clientOrgnId = this.clients[selectedIndex-1].orgnid
    this.getOrganization(this.clientSelected, this.clientOrgnId,'i');
  }

  onCopyClientChange(selectedIndex: any) {
    this.clientSelectedName = this.clientto[selectedIndex-1].name;
    this.clientOrgnId = this.clientto[selectedIndex-1].orgnid
    this.getOrganizationto(this.clientSelectedto, this.clientOrgnId);
  }

  resetValues() {
    //this.organization = [];
    if(this.baseFlag){
      this.clientSelected = 0;
      this.organization = [];
      this.organizationto = [];
      // this.clientto = [];
      this.clientSelectedto = 0;
    }
    this.orgSelected = 0;
    this.orgSelectedto = [];
    this.activitys = [];
    this.activitySelected = [];
    this.actDesc = ''
    
  }

  tabClick(event) {
    if (event.tab.textLabel === 'Add Activity') {
      this.resetValues();
    } else if (event.tab.textLabel === 'Activity Copy') {
      this.resetValues();
    }
  }

  update() {
    const data = {
      id: this.selectedId,
      clientid: Number(this.clientSelected),
      mstorgnhirarchyid: Number(this.orgSelected),
      activitydesc:this.actDesc
    };
    //console.log(JSON.stringify(data))
    if (!this.messageService.isBlankField(data)) {
      this.rest.updatemstrecordactivity(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          this.modalReference.close();
          this.messageService.sendAfterDelete(this.selectedId);
          this.dataLoaded =true;
          this.messageService.setRow({
            id:this.selectedId,
            clientid: Number(this.clientSelected),
            clientname: this.clientSelectedName,
            mstorgnhirarchyid: Number(this.orgSelected),
            mstorgnhirarchyname:this.orgName,
            activitydesc:this.actDesc
          });
          // this.modalReference.close();
          // this.resetValues()
          // this.getTableData();
          this.notifier.notify('success', this.messageService.EDIT_SUCCESS);
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

  save() {
    // if (!this.baseFlag) {
    //   this.clientSelectedName = this.userClientName;
    // }
    const data = {
      clientid: Number(this.clientSelected),
      mstorgnhirarchyid: Number(this.orgSelected),
      activitydesc: this.actDesc
    };
    //console.log(JSON.stringify(data))
    if (!this.messageService.isBlankField(data)) {
      //console.log('data===========' + JSON.stringify(data));
      this.rest.addmstrecordactivity(data).subscribe((res) => {
        //console.log("Response",res);
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          const id = this.respObject.details;
          //  if (this.orgId === Number(this.orgSelected)) {
            this.messageService.setRow({
              id: id,
              clientid: Number(this.clientSelected),
              clientname: this.clientSelectedName,
              mstorgnhirarchyid: Number(this.orgSelected),
              mstorgnhirarchyname: this.orgName,
              activitydesc: this.actDesc
            });
          this.totalData = this.totalData + 1;
          this.messageService.setTotalData(this.totalData);
          this.isError = false;
          this.resetValues();
          // this.getTableData();
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

  activityCopy(){
    for(let i=0;i<this.orgSelectedto.length;i++){
       this.orgTo = this.orgSelectedto[i];
    }
      if(this.activitySelected.length === 0||this.orgSelectedto.length === 0){
        this.isError = true;
        this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
      }
      else{
        const data ={
          clientid: Number(this.clientSelected),
          mstorgnhirarchyid: Number(this.orgSelected),
          activitydesces : this.activitySelected,
          toclientid: Number(this.clientSelectedto),
          tomstorgnhirarchyids: this.orgSelectedto
        };
        console.log(JSON.stringify(data))
        if (!this.messageService.isBlankField(data)) {
          if (this.orgSelected != Number(this.orgTo)) {
          this.rest.addmstrecordactivitycopy(data).subscribe((res) => {
            this.respObject = res;
            if (this.respObject.success) {
              this.getTableData();
              this.resetValues();
              this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
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

  onOrgChange(index,iscopy) {
    this.orgName = this.organization[index-1].organizationname;
    if(iscopy === 'true'){
      this.getACtivityDesc()
    }
  }

  getOrganizationto(clientId, orgId) {
    const data = {
      clientid: Number(clientId) , 
      mstorgnhirarchyid: Number(orgId)
    };
    this.rest.getorganizationclientwisenew(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        // this.respObject.details.unshift({id: 0, organizationname: 'Select Organization'});
        this.organizationto = this.respObject.details;
        this.selectAll(this.organizationto)
          this.orgSelectedto = []
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.isError = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }


  getOrganization(clientId, orgId,type) {
    const data = {
      clientid: Number(clientId) , 
      mstorgnhirarchyid: Number(orgId)
    };
    this.rest.getorganizationclientwisenew(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        // this.respObject.details.unshift({id: 0, organizationname: 'Select Organization'});
        this.organization = this.respObject.details;
        if(type==='i'){ 
          this.orgSelected = 0;
        }
        else{
          this.orgSelected=this.orgSelected1
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

  getACtivityDesc(){
    const data = {
      clientid: Number(this.clientSelected) , 
      mstorgnhirarchyid: Number(this.orgSelected)
    };
    this.rest.getorgwiseactivitydesc(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        // this.respObject.details.unshift({id: 0, organizationname: 'Select Organization'});
        this.activitys = this.respObject.details;
        this.selectAll(this.activitys);
        this.activitySelected = []
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
    this.rest.getallmstrecordactivity(data).subscribe((res) => {
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
