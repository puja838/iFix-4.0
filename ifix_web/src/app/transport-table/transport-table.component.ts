import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {RestApiService} from '../rest-api.service';
import {Filters, Formatters, OnEventArgs} from 'angular-slickgrid';
import {MessageService} from '../message.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-transport-table',
  templateUrl: './transport-table.component.html',
  styleUrls: ['./transport-table.component.css']
})
export class TransportTableComponent implements OnInit {

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
  orgName: string;
  clientId: number;
  orgId: number;
  @ViewChild('content') private content;
  private modalReference: NgbModalRef;
  selectedId: number;
  userClientName: any;
  action: any;
  isEdit: boolean;
  clientOrgnId:any;
  notAdmin:boolean;
  searchParent: FormControl = new FormControl();
  selectedTableDesc:any;
  tableDescList=[];
  tableName:any;
  tableDesc:any;

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
                //console.log(JSON.stringify(item));
                this.rest.deletetransporttable({id: item.id}).subscribe((res) => {
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
        pageName: 'Maintain Transport Table',
        openModalButton: 'Add Transport Table',
        breadcrumb: 'Transport Table',
        folderName: 'All Transport Tables',
        tabName: 'Transport Table',
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
            this.resetValues();
            this.selectedId = args.dataContext.id;
            this.selectedTableDesc = args.dataContext.tabletypedescription
            this.tableName = args.dataContext.msttablename;
            this.tableDesc = args.dataContext.tabletype;
           
            this.isEdit=true;   
           
            this.modalReference = this.modalService.open(this.content);
            this.modalReference.result.then((result) => {
            }, (reason) => {
  
            });
          }
        },
        {
          id: 'msttablename', name: 'Table Name', field: 'msttablename', sortable: true, filterable: true
        },
        {
          id: 'tabletypedescription', name: 'Table Description', field: 'tabletypedescription', sortable: true, filterable: true
        },
        {
          id: 'tabletype', name: 'Table Type', field: 'tabletype', sortable: true, filterable: true
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
      } else {
        this.clientSelected = this.clientId;
        // this.clientSelectedName = this.messageService.clientname;
        this.clientOrgnId = this.orgId;
        //console.log(">>>>>>>>>>>>>>>>>",this.clientSelected,this.clientOrgnId);
        
      }
      this.searchParent.valueChanges.subscribe(
        psOrName => {
          const data = {
            tabletypedescription : psOrName
          };
          this.isLoading = true;
          if (psOrName !== '') {
            this.rest.gettypedescription(data).subscribe((res: any) => {
              this.isLoading = false;
              if (res.success) {
                this.tableDescList = res.details;
              } else {
                this.notifier.notify('error', res.message);
              }
            }, (err) => {
              this.isLoading = false;
              this.notifier.notify('error', this.messageService.SERVER_ERROR);
            });
          } else {
            this.isLoading = false;
            // this.userName = '';
            this.tableDescList = [];
            //this.parentId = 0;
        }
    });
    }
  
    openModal(content) {
      this.resetValues();
      this.isEdit = false;
      this.modalService.open(content).result.then((result) => {
      }, (reason) => {
  
      });
    }
  
    resetValues() {
      this.tableName = ''
      this.tableDesc = 0;
      this.selectedTableDesc = '';
      this.tableDescList = [];
    }

    getTableDesc() {
      // console.log()
      for (let i = 0; i < this.tableDescList.length; i++) {
        if (this.tableDescList[i].tabletypedescription === this.selectedTableDesc) {
          this.tableDesc = this.tableDescList[i].tabletype;
          break;
        }
      }
    }
  
    update() {
      const data = {
        id: this.selectedId,
        msttablename:this.tableName,
        tabletypedescription:this.selectedTableDesc,
      };
      // console.log(JSON.stringify(data))
      this.dataLoaded = true;
      if (!this.messageService.isBlankField(data)) {
        data['tabletype'] = Number(this.tableDesc),
        this.rest.updatetransporttable(data).subscribe((res) => {
          this.respObject = res;
          if (this.respObject.success) {
            this.isError = false;
            this.modalReference.close();
            this.messageService.sendAfterDelete(this.selectedId);
            this.dataLoaded =true;
            // this.messageService.setRow({
            //   id:this.selectedId,
            //   msttablename:this.tableName,
            //   tabletypedescription:this.selectedTableDesc,
            //   tabletype: Number(this.tableDesc),
            // });
            this.modalReference.close();
            this.resetValues()
            this.getTableData();
            this.notifier.notify('success', this.messageService.EDIT_SUCCESS);
          } else {
            // this.isError = true;
            this.dataLoaded = true;
            this.notifier.notify('error', this.respObject.message);
          }
        }, (err) => {
          // this.isError = true;
          this.dataLoaded = true;
          this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
      } else {
        // this.isError = true;
        this.dataLoaded = true;
        this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
      }
    }
  
    save() {
      const data = {
        msttablename:this.tableName,
        tabletypedescription : this.selectedTableDesc,
      };
      // console.log(JSON.stringify(data))
      this.dataLoaded = true;
      if (!this.messageService.isBlankField(data)) {
        data['tabletype'] = Number(this.tableDesc),
        this.rest.inserttransporttable(data).subscribe((res) => {
          this.respObject = res;
          if (this.respObject.success) {
            this.dataLoaded = true;
            this.isError = false;
            const id = this.respObject.details;
              // this.messageService.setRow({
              //   id: id,
              //   msttablename:this.tableName,
              //   tabletypedescription:this.selectedTableDesc,
              //   tabletype: Number(this.tableDesc),
              // });
            this.totalData = this.totalData + 1;
            this.messageService.setTotalData(this.totalData);
            this.isError = false;
            this.resetValues();
            this.getTableData();
            this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
          } else {
            // this.isError = true;
            this.dataLoaded = true;
            this.notifier.notify('error', this.respObject.message);
          }
        }, (err) => {
          // this.isError = true;
          this.dataLoaded = true;
          this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
      } else {
        // this.isError = true;
        this.dataLoaded = true;
        this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
      }
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
        limit: limit
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
  
  
