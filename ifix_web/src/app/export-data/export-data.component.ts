import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { RestApiService } from '../rest-api.service';
import { Filters, Formatters, OnEventArgs } from 'angular-slickgrid';
import { MessageService } from '../message.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-export-data',
  templateUrl: './export-data.component.html',
  styleUrls: ['./export-data.component.css']
})
export class ExportDataComponent implements OnInit {
  displayed = true;
  totalData = 0;
  show: boolean;
  selected: number;
  respObject: any;
  clientSelected = 0;
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
  fileLoader: boolean;
  dataLoaded: boolean;
  isLoading = false;
  organization = [];
  orgSelected: number;
  orgName: string;
  clientId: number;
  orgId: number;
  clientSelectedName: string;
  orgSelectedName: string;
  @ViewChild('content') private content;
  private modalReference: NgbModalRef;
  selectedId: number;
  userClientName: any;
  action: any;
  isEdit: boolean;
  clients = [];
  organizationto = [];
  clientOrgnId: any;
  notAdmin: boolean;
  orgSelected1: any;
  tablenamelist = [];
  tablesSelected = [];
  tableTypeSelected = 0;
  tableTypeName = '';
  tableTypeList = [];

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
              this.rest.deletetransporttable({ id: item.id }).subscribe((res) => {
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
    this.fileLoader = true;
    this.pageSize = this.messageService.pageSize;
    this.userClientName = this.messageService.clientname;

    this.displayData = {
      pageName: 'Export Master Data',
      openModalButton: 'Export Master Data',
      breadcrumb: 'Export Master Data',
      folderName: 'Export Master Data',
      tabName: 'Export Master Data',
    };
    const columnDefinitions = [
      // {
      //   id: 'delete',
      //   field: 'id',
      //   excludeFromHeaderMenu: true,
      //   formatter: Formatters.deleteIcon,
      //   minWidth: 30,
      //   maxWidth: 30,
      // },
      // {
      //   id: 'edit',
      //   field: 'id',
      //   excludeFromHeaderMenu: true,
      //   formatter: Formatters.editIcon,
      //   minWidth: 30,
      //   maxWidth: 30,
      //   onCellClick: (e: Event, args: OnEventArgs) => {
      //     console.log(JSON.stringify(args.dataContext));
      //     this.isError = false;
      //     this.resetValues();
      //     this.selectedId = args.dataContext.id;
      //     //this.clientId = args.dataContext.clientid;
      //     this.clientSelectedName = args.dataContext.clientname;
      //     this.orgName = args.dataContext.mstorgnhirarchyname;
      //     this.orgSelected1 = args.dataContext.mstorghierarchyid;
      //     this.isEdit=true;   
      //     if (this.baseFlag) {
      //       this.clientSelected = args.dataContext.clientid;

      //       for(let i = 0;i<this.clients.length;i++){
      //         if(this.clients[i].id === this.clientSelected){
      //           this.orgId = this.clients[i].orgnid
      //         }
      //       }
      //     }
      //     else{
      //       this.clientSelected = this.clientId;
      //     }
      //     this.getOrganization(this.clientSelected,this.orgId,'u');
      //     this.modalReference = this.modalService.open(this.content);
      //     this.modalReference.result.then((result) => {
      //     }, (reason) => {

      //     });
      //   }
      // },
      {
        id: 'msttablename', name: 'Table Name', field: 'msttablename', sortable: true, filterable: true
      },
      {
        id: 'tabletypedescription', name: 'Table Description', field: 'tabletypedescription', sortable: true, filterable: true
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
      this.clientSelectedName = this.messageService.clientname;
      this.clientOrgnId = this.orgId;
      //console.log(">>>>>>>>>>>>>>>>>",this.clientSelected,this.clientOrgnId);
      this.getOrganization(this.clientSelected, this.clientOrgnId, 'i');
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
        this.clientSelected = 0;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getTableType(){
    const data = {
      
    };
    this.rest.gettypefortransport(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.tableTypeList = this.respObject.details;
        this.tableTypeSelected = 0
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.isError = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onTableTypeChange(index){
    //console.log(index)
    this.tableTypeName = this.tableTypeList[index-1].tabletypedescription
    //console.log(">>>>",this.tableTypeName)
    this.getTable()
  }


  getTable() {
    const data = {
      tabletype : Number(this.tableTypeSelected)
    };
    this.rest.gettable(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.tablenamelist = this.respObject.details;
        this.selectAll(this.tablenamelist);
        this.tablesSelected = []
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

  onClientChange(selectedIndex: any) {
    this.clientSelectedName = this.clients[selectedIndex - 1].name;
    this.clientOrgnId = this.clients[selectedIndex - 1].orgnid
    this.getOrganization(this.clientSelected, this.clientOrgnId, 'i');
  }


  resetValues() {
    //this.organization = [];
    if (this.baseFlag) {
      this.clientSelected = 0;
      this.organization = [];
    }
    this.orgSelected = 0;
    this.tablesSelected = [];
    this.tablenamelist = [];
    this.tableTypeList = [];
    this.tableTypeSelected = 0;
  }


  export() {
    for (var i=0; i<this.tablesSelected.length; i++) {
      delete this.tablesSelected[i].selectedAllGroup;
    }

    const data = {
      clientid: Number(this.clientSelected),
      mstorgnhirarchyid: Number(this.orgSelected),
      table: this.tablesSelected

    };
    // console.log(JSON.stringify(data))
    this.fileLoader = false;
    if (!this.messageService.isBlankField(data)) {
      this.rest.downloadmasterdata(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.fileLoader = true;
          this.isError = false;
          const id = this.respObject.details;
          // this.messageService.setRow({
          //   id: id,
          //   clientid: Number(this.clientSelected),
          //   mstorghierarchyid: Number(this.orgSelected),
          //   mstorgnhirarchyname: this.orgName,

          // });
          const uploadname = this.respObject.uploadedfilename;
          const originalname = this.respObject.originalfilename;
          this.downloadFile(uploadname,originalname)
          this.totalData = this.totalData + 1;
          this.messageService.setTotalData(this.totalData);
          this.isError = false;
          this.resetValues();
          this.getTableData();
          this.notifier.notify('success', "Export data successfully");
        } else {
          // this.isError = true;
          this.fileLoader = true;
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        // this.isError = true;
        this.fileLoader = true;
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    } else {
      // this.isError = true;
      this.fileLoader = true;
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }
  }

  downloadFile(uploadname, originalname) {
    const data = {
      'clientid': Number(this.clientSelected),
      'mstorgnhirarchyid': Number(this.orgSelected),
      'filename': uploadname
    };
    // console.log(JSON.stringify(data))
    // console.log("Upload",uploadname,"!!Download",originalname)
    this.rest.filedownload(data).subscribe((blob: any) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = originalname;
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }



  onOrgChange(index) {
    this.orgName = this.organization[index - 1].organizationname;
    this.getTableType()
  }

  getOrganization(clientId, orgId, type) {
    const data = {
      clientid: Number(clientId),
      mstorgnhirarchyid: Number(orgId)
    };
    this.rest.getorganizationclientwisenew(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.organization = this.respObject.details;
        if (type === 'i') {
          this.orgSelected = 0;
        }
        else {
          this.orgSelected = this.orgSelected1;
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
    };
    // console.log(data);
    this.rest.getalltransporttable(data).subscribe((res) => {
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
