import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {NotifierService} from 'angular-notifier';
import {RestApiService} from '../rest-api.service';
import {Filters, Formatters, OnEventArgs} from 'angular-slickgrid';
import {MessageService} from '../message.service';
import {Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';
import {CustomInputEditor} from '../custom-inputEditor';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-client-sla',
  templateUrl: './client-sla.component.html',
  styleUrls: ['./client-sla.component.css']
})
export class ClientSlaComponent implements OnInit {

 // areaSelected: number;
  // parentSelected: number;
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
  clientslaName: string;
  dataLoaded: boolean;
  orgnId: number;
  isClient: boolean;
  selectedId: number;
  clientSelectedName: string;
  orgSelectedName: string;
  organaisation = [];
  orgSelected: any;
  orgName: any;
  @ViewChild('content1') private content1;
  private modalReference: NgbModalRef;
  orgId: number;
  timeSLA: boolean;
  upgradeSLA: boolean;
  downgradeSLA: boolean;
  

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
              this.rest.deletemstclientsla({
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
      pageName: 'Maintain Client SLA',
      openModalButton: 'Add Client SLA',
      breadcrumb: 'Client SLA',
      folderName: 'All Client SLA',
      tabName: 'Client SLA',
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
          console.log(args.dataContext);
          this.selectedId = args.dataContext.id;
          this.clientslaName = args.dataContext.slaname;
          this.orgSelected = Number(args.dataContext.mstorgnhirarchyid);
          this.timeSLA = args.dataContext.slatimereset;
          this.upgradeSLA = args.dataContext.slaupgradereset;
          this.downgradeSLA=args.dataContext.sladowngradereset;
          this.orgName = args.dataContext.mstorgnhirarchyname;
          this.modalReference = this.modalService.open(this.content1, {});
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
        id: 'slaname', name: 'Client SLA Name ', field: 'slaname', sortable: true, filterable: true
      },
      
{
  id: 'slatimereset', name: 'SLA Time Reset', field: 'slatimereset', sortable: true, filterable: true, formatter: Formatters.checkmark,
  filter: {
  collection: [{value: '', label: 'All'},{value: true, label: 'True'}, {value: false, label: 'False'}],
  model: Filters.singleSelect,
  
  filterOptions: {
  autoDropWidth: true
  },
  }, minWidth: 40,},
  {
    id: 'slaupgradereset', name: 'SLA Upgrade', field: 'slaupgradereset', sortable: true, filterable: true, formatter: Formatters.checkmark,
    filter: {
    collection: [{value: '', label: 'All'},{value: true, label: 'True'}, {value: false, label: 'False'}],
    model: Filters.singleSelect,
    
    filterOptions: {
    autoDropWidth: true
    },
    }, minWidth: 40,},
    {
      id: 'sladowngradereset', name: 'SLA Downgrade', field: 'sladowngradereset', sortable: true, filterable: true, formatter: Formatters.checkmark,
      filter: {
      collection: [{value: '', label: 'All'},{value: true, label: 'True'}, {value: false, label: 'False'}],
      model: Filters.singleSelect,
      
      filterOptions: {
      autoDropWidth: true
      },
      }, minWidth: 40,}
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


    // this.getTableData();
  }

  changeRouting(path: string) {
    this.messageService.changeRouting(path);
  }


  openModal(content) {
      this.isError = false;
      this.reset();
      this.modalService.open(content).result.then((result) => {
      }, (reason) => {
      });
  }

  onOrgChange(index: any) {
    this.orgName = this.organaisation[index].organizationname;
  }


  update() {
    const data = {
      id: this.selectedId,
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgSelected),
      slaname: this.clientslaName,
    };
   

    // if(this.isClient){
    //   data["clientid"] = this.clie
    // }

    if (!this.messageService.isBlankField(data)) {

      data['slatimereset']=this.timeSLA==true?1:0;
        data['slaupgradereset']=this.upgradeSLA==true?1:0;
        data['sladowngradereset']=this.downgradeSLA==true?1:0;
        console.log(JSON.stringify(data));

      this.rest.updatemstclientsla(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          this.modalReference.close();

          //console.log("id "+ )
          this.messageService.sendAfterDelete(this.selectedId);
          this.dataLoaded = true;
          this.messageService.setRow({
            id: this.selectedId,
            slaname: this.clientslaName,
            mstorgnhirarchyid:this.orgSelected,
            mstorgnhirarchyname: this.orgName,
            slatimereset:this.timeSLA,
            slaupgradereset:this.upgradeSLA,
            sladowngradereset:this.downgradeSLA
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

  save() {
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgSelected),
      slaname: this.clientslaName
    };
  
    // if(this.isClient){
    //   data["clientid"] = this.clie
    // }
    
     if (!this.messageService.isBlankField(data)) {
        
      data['slatimereset']=this.timeSLA==true?1:0;
      data['slaupgradereset']=this.upgradeSLA==true?1:0;
      data['sladowngradereset']=this.downgradeSLA==true?1:0;
        console.log(JSON.stringify(data));

      this.rest.addmstclientsla(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          const id = this.respObject.details;
          this.messageService.setRow({
            id: id,
            mstorgnhirarchyid: this.orgSelected,
            mstorgnhirarchyname: this.orgName,
            slaname: this.clientslaName,
            slatimereset:this.timeSLA,
            slaupgradereset:this.upgradeSLA,
            sladowngradereset:this.downgradeSLA
          });
          //console.log("id "+ )
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
    this.rest.getmstclientsla(data).subscribe((res) => {
      this.respObject = res;
      for (let i = 0; i < this.respObject.details.values.length; i++) {
        this.respObject.details.values[i].slatimereset = this.respObject.details.values[i].slatimereset === 1;
        this.respObject.details.values[i].slaupgradereset = this.respObject.details.values[i].slaupgradereset === 1;
        this.respObject.details.values[i].sladowngradereset = this.respObject.details.values[i].sladowngradereset === 1;
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

  ngOnDestroy(): void {
    if (this.userAuth) {
      this.userAuth.unsubscribe();
    }
  }
  reset(): void{
    this.orgSelected = 0;
    this.clientslaName = '';
    this.timeSLA=true;
    this.upgradeSLA=true;
    this.downgradeSLA=true;
  }

}

