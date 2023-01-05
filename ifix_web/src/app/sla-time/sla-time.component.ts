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
  selector: 'app-sla-time',
  templateUrl: './sla-time.component.html',
  styleUrls: ['./sla-time.component.css']
})
export class SlaTimeComponent implements OnInit {
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

  slaSelected:any;
  slas =[];
  slaName:string;
  zoneSelected: string;
  zones: any;
  zonesId:number;
  searchTerm: FormControl = new FormControl();
  isLoading = false;
  isUpdate:boolean;

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
              this.rest.deleteslatimezone({
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


    this.searchTerm.valueChanges.subscribe(
      zone => {
        this.isLoading = true;
        if (zone !== undefined && zone !== '') {
          zone = zone.toUpperCase();
          this.rest.searchzone({Zonename: zone}).subscribe((res1) => {
            this.respObject = res1;
            this.isLoading = false;
            if (this.respObject.success) {

              this.isError = false;
              this.zones = this.respObject.details;
              //console.log('zones====' + JSON.stringify(this.zones));
            } else {
              this.isError = true;
              this.notifier.notify('error', this.respObject.errorMessage);
            }
          }, (err) => {
            this.isLoading = false;
            this.isError = true;
            this.notifier.notify('error', this.messageService.SERVER_ERROR);
          });
        } else {
          this.isLoading = false;
          this.zones = [];
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
      pageName: 'Maintain SLA Time Zone',
      openModalButton: 'Add SLA Time Zone',
      breadcrumb: 'SLA Time Zone',
      folderName: 'All SLA Time Zone',
      tabName: 'SLA Time Zone',
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
          this.slas = [];
          this.isUpdate =true;
          this.selectedId = args.dataContext.id;
          this.catalogName = args.dataContext.catalogname;
          this.orgSelected = Number(args.dataContext.mstorgnhirarchyid);
          this.orgName = args.dataContext.mstorgnhirarchyname;
          this.zoneSelected = args.dataContext.zonename;
          this.slaSelected = Number(args.dataContext.mstslaid);
          this.getSla();
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
        id: 'sla', name: 'SLA Name ', field: 'slaname', sortable: true, filterable: true
      },

      {
        id: 'timezonename', name: 'Time Zone', field: 'zonename', sortable: true, filterable: true
      }
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


  onSlaChange(index){
    this.slaName = this.slas[index-1].slaname;
  }

  getSla(){
    this.rest.getslanames({clientid: Number(this.clientId) ,mstorgnhirarchyid:Number(this.orgSelected)}).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.slas = this.respObject.details;
       
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
    // this.slas = [{id: 1, name: 'SLA1' },{id: 2, name: 'SLA2' },{id: 3, name: 'SLA3' }]
  }

  reset(){
    this.slaSelected = '';
    this.orgSelected = 0;
    this.zoneSelected = '';
 

  }

  openModal(content) {
      this.isError = false;

      this.isUpdate =false;

      this.reset();
      this.modalService.open(content).result.then((result) => {
      }, (reason) => {
      });
  }

  onOrgChange(index: any) {
    this.orgName = this.organaisation[index].organizationname;
    this.getSla();
  }


  update() {
    let zoneId = 0;
    for (let i = 0; i < this.zones.length; i++) {
      if (this.zones[i].zonename === this.zoneSelected) {
        zoneId = this.zones[i].id;
      }
    }
    const data = {
      id:this.selectedId,
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgSelected),
      msttimezoneid: Number(zoneId),
      mstslaid:Number(this.slaSelected)
    };
    //console.log("........"+JSON.stringify(data));

    // if(this.isClient){
    //   data["clientid"] = this.clie
    // }

    if (!this.messageService.isBlankField(data)) {

      this.rest.updateslatimezone(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          this.modalReference.close();

          //console.log("id "+ )
          this.messageService.sendAfterDelete(this.selectedId);
          this.dataLoaded = true;
          this.messageService.setRow({
            id: this.selectedId,
            clientid:this.clientId,
            mstorgnhirarchyname: this.orgName,
            zonename:this.zoneSelected,
            mstorgnhirarchyid:this.orgSelected,
            slaname:this.slaName,
            mstslaid:this.slaSelected,
            msttimezoneid:this.zonesId
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
    let zoneId = 0;
    for (let i = 0; i < this.zones.length; i++) {
      if (this.zones[i].zonename === this.zoneSelected) {
     
        zoneId = this.zones[i].id;
      }
    }
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgSelected),
      msttimezoneid: Number(zoneId),
      mstslaid:Number(this.slaSelected)
    };

    //console.log("........"+JSON.stringify(data));

    // if(this.isClient){
    //   data["clientid"] = this.clie
    // }

    if (!this.messageService.isBlankField(data)) {

      this.rest.addslatimezone(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          const id = this.respObject.details;
          this.messageService.setRow({
            id: id,
            // catalogname: this.catalogName,
            clientid:this.clientId,
            mstorgnhirarchyname: this.orgName,
            zonename:this.zoneSelected,
            mstorgnhirarchyid:this.orgSelected,
            slaname:this.slaName,
            mstslaid:this.slaSelected,
            msttimezoneid:this.zonesId

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
    this.rest.getslatimezone(data).subscribe((res) => {
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
