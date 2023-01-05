import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {RestApiService} from '../rest-api.service';
import {MessageService} from '../message.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {Formatters, OnEventArgs} from 'angular-slickgrid';
import {NotifierService} from 'angular-notifier';
import {Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-map-category-with-keyword',
  templateUrl: './map-category-with-keyword.component.html',
  styleUrls: ['./map-category-with-keyword.component.css']
})
export class MapCategoryWithKeywordComponent implements OnInit {
  displayed = true;
  clientSelected: number;
  dataset: any[];
  totalData: number;
  respObject: any;
  clients = [];
  clientName: string;
  userName: string;
  roleName: string;
  notAdmin = true;
  displayData: any;
  add: boolean;
  del: boolean;
  edit: boolean;
  view: boolean;
  isError = false;
  errorMessage: string;
  pageSize: number;
  private userAuth: Subscription;
  private adminAuth: Subscription;
  private notifier: NotifierService;
  private clientId: number;
  private baseFlag: any;
  offset: number;
  dataLoaded: boolean;
  userId: number;
  isLoading = false;
  organaisation = [];
  orgSelected: number;
  orgName: string;
  orgnId: number;
  loginname: string;
  isSLA: boolean;
  clientOrgnId: any;
  categoryValueSelected: any;
  keywordSelected: any;
  isUpdate: boolean;
  searchParent: FormControl = new FormControl();
  searchCategory: FormControl = new FormControl();
  keywordNameList = [];
  keywordId:any;
  categoryId:any;

  constructor(private rest: RestApiService, private messageService: MessageService, private route: Router,
              private modalService: NgbModal, notifier: NotifierService) {
      this.notifier = notifier;
      this.messageService.getCellChangeData().subscribe(item => {
          switch (item.type) {
              case 'change':
                  console.log('changed');
                  if (!this.edit) {
                      this.notifier.notify('error', 'You do not have edit permission');
                  } else {

                  }
                  break;
              case 'delete':
                  if (confirm('Are you sure?')) {
                      this.rest.deletemapcategorywithkeyword({id: item.id}).subscribe((res) => {
                          this.respObject = res;
                          if (this.respObject.success) {
                              this.messageService.sendAfterDelete(item.id);
                              this.totalData = this.totalData - 1;
                              this.messageService.setTotalData(this.totalData);
                              this.notifier.notify('success', this.messageService.DELETE_SUCCESS);
                          } else {
                              this.notifier.notify('error', this.respObject.errorMessage);
                          }
                      }, (err) => {
                          this.notifier.notify('error', this.respObject.errorMessage);
                      });
                  }
          }
      });
  }

  ngOnInit() {
    this.isUpdate = false;
      this.userName = '';
      this.dataLoaded = true;
      this.pageSize = this.messageService.pageSize;
      this.displayData = {
          pageName: 'Map Category Value With Keyword',
          openModalButton: 'Add Category Value With Keyword',
          breadcrumb: 'Category Value With Keyword',
          folderName: 'All Category Value With Keyword',
          tabName: 'Category Value With Keyword'
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
          // {
          //   id: 'edit',
          //   field: 'id',
          //   excludeFromHeaderMenu: true,
          //   formatter: Formatters.editIcon,
          //   minWidth: 30,
          //   maxWidth: 30,
          //   onCellClick: (e: Event, args: OnEventArgs) => {
          //     console.log("\n args.dataContext ======  ", args.dataContext);
          //     this.reset();
          //     this.selectedId = args.dataContext.id;
          //     this.clientSelected = args.dataContext.clientid;
          //     this.clientName = args.dataContext.clientname;
          //     this.orgSelected = args.dataContext.mstorgnhirarchyid;
          //     this.orgName = args.dataContext.mstorgnhirarchyname;
          //
          //     this.getOrganization(this.clientSelected, this.clientOrgnId);
          //     this.isError = false;
          //     this.isUpdate = true;
          //     this.modalService.open(this.content1).result.then((result) => {
          //     }, (reason) => {
          //     });
          //   }
          // },
          {
              id: 'clientname', name: 'Client ', field: 'clientname', sortable: true, filterable: true
          },
          {
              id: 'mstorgnhirarchyname', name: 'Organization ', field: 'mstorgnhirarchyname', sortable: true, filterable: true
          },
          {
              id: 'keyword', name: 'Keyword ', field: 'keyword', sortable: true, filterable: true
          },
          {
              id: 'categoryvalue', name: 'Category Value ', field: 'categoryvalue', sortable: true, filterable: true
          }
      ];
      this.messageService.setColumnDefinitions(columnDefinitions);
      if (this.messageService.clientId) {
          this.clientId = this.messageService.clientId;
          this.baseFlag = this.messageService.baseFlag;
          this.orgnId = this.messageService.orgnId;
          this.edit = this.messageService.edit;
          this.del = this.messageService.del;
          // console.log(this.orgnId);
          this.onPageLoad();
      } else {
          this.userAuth = this.messageService.getClientUserAuth().subscribe(auth => {
              // this.view = auth[0].viewFlag;
              // this.add = auth[0].addFlag;
              this.edit = auth[0].editFlag;
              this.del = auth[0].deleteFlag;
              this.clientId = auth[0].clientid;
              this.baseFlag = auth[0].baseFlag;
              this.orgnId = auth[0].mstorgnhirarchyid;
              // console.log(JSON.stringify(auth));
              // console.log(this.orgnId)
              this.onPageLoad();
          });
      }
  }


  onPageLoad() {
    this.rest.getallclientnames().subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
            this.respObject.details.unshift({id: 0, name: 'Select Client'});
            this.clients = this.respObject.details;
            this.clientSelected = 0;
        } else {
            this.isError = true;
            this.notifier.notify('error', this.respObject.message);
        }
    }, (err) => {
        this.isError = true;
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });

    this.searchParent.valueChanges.subscribe(
        psOrName => {
          const data = {
            clientid: Number(this.clientId),
            mstorgnhirarchyid: Number(this.orgnId),
            keyword : psOrName
          };
          this.isLoading = true;
          if (psOrName !== '') {
            this.rest.getallcategoryvalue(data).subscribe((res: any) => {
              this.isLoading = false;
              if (res.success) {
                this.keywordNameList = res.details;
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
            this.keywordNameList = [];
            //this.parentId = 0;
        }
    });
  }

  changeRouting(path: string) {
      this.messageService.changeRouting(path);
  }

  onClientChange(selectedIndex) {
      this.clientName = this.clients[selectedIndex].name;
      this.clientOrgnId = this.clients[selectedIndex].orgnid;
      this.getOrganization(this.clientSelected, this.clientOrgnId);
  }

  openModal(content) {
      this.isError = false;
      this.reset();
      this.modalService.open(content).result.then((result) => {
      }, (reason) => {
      });
  }

  save() {
    const data = {
      "clientid": Number(this.clientSelected),
      "mstorgnhirarchyid": Number(this.orgSelected),
      "keyword": this.keywordSelected,
      "categoryvalue": this.categoryValueSelected
    };
    console.log(JSON.stringify(data))
    if (!this.messageService.isBlankField(data)) {
        this.rest.insertmapcategorywithkeyword(data).subscribe((res: any) => {
            if (res.success){
                const id = res.details;
                this.messageService.setRow({
                    id: id,
                    clientid: Number(this.clientSelected),
                    clientname: this.clientName,
                    mstorgnhirarchyid: Number(this.orgSelected),
                    mstorgnhirarchyname: this.orgName,
                    keyword: this.keywordSelected,
                    categoryvalue: this.categoryValueSelected
                });
                this.reset();
                this.totalData = this.totalData + 1;
                this.messageService.setTotalData(this.totalData);
                this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
            } else {
                this.notifier.notify('error', res.message);
            }
        }, (err) => {
            this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
    } else {
        this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }

  }


  update(){
    const data = {
    //   "id": this.selectedId,
      "clientid": Number(this.clientSelected),
      "mstorgnhirarchyid": Number(this.orgSelected),
      "keyword": this.keywordSelected,
      "categoryvalue": this.categoryValueSelected
    };
    if (!this.messageService.isBlankField(data)) {
        this.rest.updatemapcategorywithkeyword(data).subscribe((res: any) => {
            if (res.success){
                const id = res.details;
                // this.messageService.sendAfterDelete(this.selectedId);
                this.messageService.setRow({
                    // id: this.selectedId,
                    clientid: Number(this.clientSelected),
                    clientname: this.clientName,
                    mstorgnhirarchyid: Number(this.orgSelected),
                    mstorgnhirarchyname: this.orgName,
                    keyword: this.keywordSelected,
                    categoryvalue: this.categoryValueSelected
                });
                this.reset();
                this.totalData = this.totalData + 1;
                this.messageService.setTotalData(this.totalData);
                this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
            } else {
                this.notifier.notify('error', res.message);
            }
        }, (err) => {
            this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
    } else {
        this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }

  }

  reset() {
      this.isSLA = true;
      this.isUpdate = false;
      this.clientSelected = 0;
      this.orgSelected = 0;
      this.organaisation = [];
      this.categoryValueSelected = '';
      this.keywordSelected = '';
  }

  onOrgChange(index: any) {
      this.orgName = this.organaisation[index].organizationname;
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
          'offset': offset,
          'limit': limit,
          clientid: Number(this.clientId),
          mstorgnhirarchyid: Number(this.orgnId)
      };
      this.rest.getallmapcategorywithkeyword(data).subscribe((res) => {
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
      if (this.adminAuth) {
          this.adminAuth.unsubscribe();
      }
  }

  getOrganization(clientId, orgId) {
    // console.log("\n orgId ::  ", orgId);
      const data = {
          clientid: Number(clientId),
          mstorgnhirarchyid: Number(orgId)
      };
      this.rest.getorganizationclientwisenew(data).subscribe((res) => {
          this.respObject = res;
          if (this.respObject.success) {
              this.respObject.details.unshift({id: 0, organizationname: 'Select Organization'});
              this.organaisation = this.respObject.details;
              this.orgSelected = 0;
          } else {
              this.isError = true;
              this.notifier.notify('error', this.respObject.message);
          }
      }, (err) => {
          this.isError = true;
          this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
  }

  getKeywordDetails() {
    // console.log()
    for (let i = 0; i < this.keywordNameList.length; i++) {
      if (this.keywordNameList[i].keyword === this.keywordSelected) {
        this.keywordSelected = this.keywordNameList[i].keyword;
        this.categoryValueSelected = this.keywordNameList[i].categoryvalue;
        break;
      }
    }
  }

}
