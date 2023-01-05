import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { RestApiService } from '../rest-api.service';
import { Filters, Formatters, OnEventArgs } from 'angular-slickgrid';
import { MessageService } from '../message.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-org-tools-mapping',
  templateUrl: './org-tools-mapping.component.html',
  styleUrls: ['./org-tools-mapping.component.css']
})
export class OrgToolsMappingComponent implements OnInit {

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
  dataLoaded: boolean;
  isLoading = false;
  isLoading1 = false;
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
  arcosOrgCode: any;
  monITOrgCode: any;
  orgSelected1: any;
  searchParent: FormControl = new FormControl();
  searchParent1: FormControl = new FormControl();
  toolsCodeList = [];
  orgCodeList = [];
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
              this.rest.deleteorgtoolscode({ id: item.id }).subscribe((res) => {
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
      pageName: 'Maintain Organization wise Tools Mapping',
      openModalButton: 'Add Organization wise Tools Mapping',
      breadcrumb: 'Organization wise Tools Mapping',
      folderName: 'All Organization wise Tools',
      tabName: 'Organization wise Tools Mapping',
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
          this.arcosOrgCode = args.dataContext.toolcode
          this.monITOrgCode = args.dataContext.orgcode;
          this.isEdit = true;
          if (this.baseFlag) {
            this.clientSelected = args.dataContext.clientid;

            for (let i = 0; i < this.clients.length; i++) {
              if (this.clients[i].id === this.clientSelected) {
                this.orgId = this.clients[i].orgnid
              }
            }
          }
          else {
            this.clientSelected = this.clientId;
          }
          this.getOrganization(this.clientSelected, this.orgId, 'u');
          this.modalReference = this.modalService.open(this.content);
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },
      {
        id: 'mstorgnhirarchyname', name: 'Organization ', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'toolcode', name: 'Tools Code', field: 'toolcode', sortable: true, filterable: true
      },
      {
        id: 'orgcode', name: 'Organization Code ', field: 'orgcode', sortable: true, filterable: true
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

    this.searchParent.valueChanges.subscribe(
      psOrName => {
        const data = {
          clientid: Number(this.clientSelected),
          toolcode: psOrName
        };
        this.isLoading = true;
        if (psOrName !== '') {
          this.rest.gettoolscode(data).subscribe((res: any) => {
            this.isLoading = false;
            if (res.success) {
              this.toolsCodeList = res.details;
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
          this.toolsCodeList = [];
          //this.parentId = 0;
        }
      });

      this.searchParent1.valueChanges.subscribe(
        psOrName1 => {
          const data = {
            clientid: Number(this.clientSelected),
            orgcode : psOrName1
          };
          this.isLoading1 = true;
          if (psOrName1 !== '') {
            this.rest.getorgcode(data).subscribe((res: any) => {
              this.isLoading1 = false;
              if (res.success) {
                this.orgCodeList = res.details;
              } else {
                this.notifier.notify('error', res.message);
              }
            }, (err) => {
              this.isLoading1 = false;
              this.notifier.notify('error', this.messageService.SERVER_ERROR);
            });
          } else {
            this.isLoading1 = false;
            // this.userName = '';
            this.orgCodeList = [];
            //this.parentId = 0;
        }
    });
  }



  // selectAll(items: any[]) {
  //   let allSelect = items => {
  //     items.forEach(element => {
  //       element['selectedAllGroup'] = 'selectedAllGroup';
  //     });
  //   };

  //   allSelect(items);
  // }

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
    this.arcosOrgCode = '';
    this.monITOrgCode = '';
  }

  update() {
    const data = {
      id: this.selectedId,
      clientid: Number(this.clientSelected),
      mstorgnhirarchyid: Number(this.orgSelected),
      toolcode: this.arcosOrgCode,
      orgcode: this.monITOrgCode
    };
    //console.log(JSON.stringify(data))
    if (!this.messageService.isBlankField(data)) {
      this.rest.updateorgtoolscode(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          this.modalReference.close();
          this.messageService.sendAfterDelete(this.selectedId);
          this.dataLoaded = true;
          this.messageService.setRow({
            id: this.selectedId,
            clientid: Number(this.clientSelected),
            mstorgnhirarchyid: Number(this.orgSelected),
            mstorgnhirarchyname: this.orgName,
            toolcode: this.arcosOrgCode,
            orgcode: this.monITOrgCode
          });
          this.modalReference.close();
          this.resetValues()
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
    const data = {
      clientid: Number(this.clientSelected),
      mstorgnhirarchyid: Number(this.orgSelected),
      toolcode: this.arcosOrgCode,
      orgcode: this.monITOrgCode
    };
    console.log(JSON.stringify(data))
    if (!this.messageService.isBlankField(data)) {
      this.rest.addorgtoolscode(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          const id = this.respObject.details;
          this.messageService.setRow({
            id: id,
            clientid: Number(this.clientSelected),
            mstorgnhirarchyid: Number(this.orgSelected),
            mstorgnhirarchyname: this.orgName,
            toolcode: this.arcosOrgCode,
            orgcode: this.monITOrgCode
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



  onOrgChange(index, iscopy) {
    this.orgName = this.organization[index - 1].organizationname;
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
      clientid: this.clientId,
      mstorgnhirarchyid: this.orgId
    };
    // console.log(data);
    this.rest.getorgtoolscode(data).subscribe((res) => {
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

