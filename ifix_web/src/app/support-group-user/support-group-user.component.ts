import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {MessageService} from '../message.service';
import {NotifierService} from 'angular-notifier';
import {RestApiService} from '../rest-api.service';
import {Router} from '@angular/router';
import {Formatters , OnEventArgs, thousandSeparatorFormatted} from 'angular-slickgrid';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';
@Component({
  selector: 'app-support-group-user',
  templateUrl: './support-group-user.component.html',
  styleUrls: ['./support-group-user.component.css']
})
export class SupportGroupUserComponent implements OnInit {

  displayed = true;
  totalData = 0;
  show: boolean;
  selected: number;
  respObject: any;

  clientSelected: number;
  clients: any[];
  role: any[];
  users: any[];
  userSelected: string;
  userName: string;
  roleName: string;
  roleSelected: number;
  actions: any[];
  displayData: any;
  notAdmin = true;


  add = false;
  del = false;
  edit = false;
  view = false;

  isError = false;
  errorMessage: string;

  private clientName: any;

  private notifier: NotifierService;
  private clientId: any;
  private baseFlag: any;
  pageSize: number;
  private userAuth: Subscription;
  private adminAuth: Subscription;
  dataLoaded: boolean;
  isLoading = false;
  userId: number;
  searchUser: FormControl = new FormControl();
  userDtl = [];
  organaisation = [];
  orgSelected: any;
  private orgName: any;
  loginname: string;
  rolename: string;
  roledesc: string;
  adminflag: string;
  orgnId: number;
  groups = [];
  grpSelected:any;
  grpName:string;
  @ViewChild('content1') private content1;
  private modalReference: NgbModalRef;
  selectedId:any;
  orgSelected1:any;

  constructor(private _rest: RestApiService, private messageService: MessageService,
              private route: Router, private modalService: NgbModal, notifier: NotifierService) {
    this.notifier = notifier;
    this.messageService.getCellChangeData().subscribe(item => {
      switch (item.type) {
        case 'change':
          // console.log('changed');
          if (!this.edit) {
            this.notifier.notify('error', 'You do not have edit permission');
          } else {

          }
          break;
        case 'delete':
          // if (this.baseFlag) {
          if (!this.del) {
            this.notifier.notify('error', 'You do not have delete permission');
          } else {
            this.deleteItem(item);
          }
          // } else {
          //   if (!this.messageService.del) {
          //     this.notifier.notify('error', 'You do not have delete permission');
          //   } else {
          //     this.deleteItem(item);
          //   }
          // }
          break;
      }
    });
    // this.messageService.getUserAuth().subscribe(details => {
    //   // console.log(JSON.stringify(details));
    //   if (details.length > 0) {
    //     this.add = details[0].addFlag;
    //     this.del = details[0].deleteFlag;
    //     this.view = details[0].viewFlag;
    //     this.edit = details[0].editFlag;
    //   }
    // });
    this.messageService.getSelectedItemData().subscribe(selectedTitles => {
      if (selectedTitles.length > 0) {
        this.show = true;
        this.selected = selectedTitles.length;
      } else {
        this.show = false;
      }
    });
  }

  deleteItem(item) {
    if (confirm('Are you sure?')) {
      this._rest.deletegrpusermap({id: item.id}).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.messageService.sendAfterDelete(item.id);
          this.totalData = this.totalData - 1;
          this.messageService.setTotalData(this.totalData);
          this.notifier.notify('success', this.messageService.DELETE_SUCCESS);
        } else {
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.respObject.message);
      });
    }
  }

  ngOnInit() {
    this.dataLoaded = true;
    //this.userId = Number(this.messageService.getUserId());
    // this.messageService.setGridWidth(1000);
    this.userId = 0;
    this.pageSize = this.messageService.pageSize;

    this.displayData = {
      pageName: 'Maintain User Support Group Mapping',
      openModalButton: 'Map User With Support Group',

      breadcrumb: '',
      folderName: 'All Mapped User with Support Group',
      tabName: 'User Support Group Mapping'
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
          this.organaisation = [];
          this.reset();
          console.log(JSON.stringify(args.dataContext));
          this.selectedId = args.dataContext.id;
          // this.catalogName = args.dataContext.catalogname;
          this.orgSelected = args.dataContext.mstorgnhirarchyid;
          this.grpSelected = Number(args.dataContext.groupid);
          this.getGroupData(this.grpSelected);
          this.getOrganization('u')
          this.userSelected = args.dataContext.username;
          this.userName = args.dataContext.loginname;
          //this.userId = args.dataContext.refuserid;

          this.modalReference = this.modalService.open(this.content1, {});
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },
      // {
      //   id: 'client', name: 'Client ', field: 'clientname', sortable: true, filterable: true
      // },
      {
        id: 'organization', name: 'Organization', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'supportgroupname', name: 'Support Group Name', field: 'supportgroupname', sortable: true, filterable: true
      },
      {
        id: 'user', name: 'User', field: 'username', sortable: true, filterable: true
      },

    ];
    this.messageService.setColumnDefinitions(columnDefinitions);

    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.baseFlag = this.messageService.baseFlag;
      this.orgnId = this.messageService.orgnId;
      this.edit =this.messageService.edit;
      this.del =this.messageService.del;
      this.onPageLoad();
    } else {
      this.userAuth = this.messageService.getClientUserAuth().subscribe(auth => {
          this.edit = auth[0].editFlag;
          this.del = auth[0].deleteFlag;
        this.clientId = auth[0].clientid;
        this.baseFlag = auth[0].baseFlag;
        this.orgnId = auth[0].mstorgnhirarchyid;
        this.onPageLoad();
      });
    }

    // this._rest.getaction().subscribe((res) => {
    //   this.respObject = res;
    //   if (this.respObject.success) {
    //     this.isError = false;
    //     // for (let i = 0; i < this.respObject.actions.length; i++) {
    //     //     this.respObject.actions.checked = false;
    //     // }
    //     this.actions = this.respObject.details;
    //   } else {
    //     this.isError = true;
    //     this.notifier.notify('error', this.respObject.message);
    //   }
    // }, (err) => {
    //   this.isError = true;
    //   this.notifier.notify('error', this.messageService.SERVER_ERROR);
    // });

    // if (this.clientId !== 1) {
    //   this.clientSelected = this.clientId;
    // }
    this.searchUser.valueChanges.subscribe(
      psOrName => {
        const data = {
          loginname: psOrName,
          clientid: Number(this.clientId),
          mstorgnhirarchyid: Number(this.orgSelected),
        };
        this.isLoading = true;
        // console.log('psOrName======' + psOrName);
        // console.log('userSelected======' + this.userSelected);
        if (psOrName !== '') {
          this._rest.searchuserbyclientid(data).subscribe((res1) => {
            // console.log('data======' + JSON.stringify(data));
            this.respObject = res1;
            this.isLoading = false;
            if (this.respObject.success) {
              this.users = this.respObject.details;

            } else {
              this.notifier.notify('error', this.respObject.message);
            }
          }, (err) => {
            this.isLoading = false;
            this.notifier.notify('error', this.messageService.SERVER_ERROR);
          });
        } else {
          this.isLoading = false;
          this.userName = '';
          this.users = [];
          this.userSelected = '';
          this.userId = 0;
        }
      });
  }

  onPageLoad() {
    console.log(this.clientId + '=====' + this.baseFlag);
    // if (this.baseFlag) {
    //   this.notAdmin = false;
    //   this._rest.getclient({offset: 0, limit: 100}).subscribe((res) => {
    //     this.respObject = res;
    //     if (this.respObject.success) {
    //       this.respObject.details.values.unshift({id: 0, name: 'Select Client'});
    //       this.clients = this.respObject.details.values;
    //       this.clientSelected = 0;
    //     } else {
    //       this.isError = true;
    //       this.notifier.notify('error', this.respObject.message);
    //     }
    //   }, (err) => {
    //     this.isError = true;
    //     this.notifier.notify('error', this.messageService.SERVER_ERROR);
    //   });
    // } else {
    //   this.notAdmin = true;
    //   this.clientSelected = this.clientId;
    //   this.getOrganization(this.clientSelected);
    // }
  }

  openModal(content) {
    // for (let j = 0; j < this.actions.length; j++) {
    //   this.actions[j].checked = false;
    // }
    // if (this.baseFlag) {
      this.isError = false;
      this.reset();
      this.getOrganization('i')
      this.modalService.open(content).result.then((result) => {
      }, (reason) => {

      });
    // } else {
    //   if (!this.messageService.add) {
    //     this.notifier.notify('error', 'You do not have add permission');
    //   } else {
    //     this.roleSelected = 0;
    //     this.isError = false;
    //     this.modalService.open(content).result.then((result) => {
    //     }, (reason) => {

    //     });
    //   }
    // }
  }


  get selectedOptions() {
    return this.actions
      .filter(opt => opt.checked)
      .map(opt => opt.id);

  }

  changeRouting(path: string) {
    this.messageService.changeRouting(path);
  }

  getUserDetails() {
    // console.log('this.users=====' + JSON.stringify(this.users));
    for (let i = 0; i < this.users.length; i++) {
      // console.log('this.users[i].loginname=====' + JSON.stringify(this.users[i].loginname));
      // console.log('this.userSelected=====' + JSON.stringify(this.userSelected));
      if (this.users[i].loginname === this.userSelected) {
        // console.log('++++');
        this.userId = this.users[i].id;
        // console.log('this.userId==' + this.userId);
        this.userName = this.users[i].name;
        this.loginname = this.users[i].loginname;
        break
      }
    }
  }


  update() {

    const data = {
      "clientid":Number(this.clientId),
      "mstorgnhirarchyid":Number(this.orgSelected),
      "groupid":Number(this.grpSelected),
      "refuserid":Number(this.userId),
      "id":this.selectedId
    };
    // const data = {
    //   id: this.selectedId,
    //   clientid: Number(this.clientId),
    //   mstorgnhirarchyid: Number(this.orgSelected),
    //   catalogname: this.catalogName,
    // };
    console.log('data' + JSON.stringify(data));

    if (!this.messageService.isBlankField(data)) {

      this._rest.updategrpusermap(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;

          this.modalReference.close();

          //console.log("id "+ )
          this.getTableData();

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



  save() {

    const data = {
    "clientid":Number(this.clientId),
    "mstorgnhirarchyid":Number(this.orgSelected),
    "groupid":Number(this.grpSelected),
    "refuserid":this.userId
  }
    if (!this.messageService.isBlankField(data)) {
      this._rest.addgrpusermap(data).subscribe((res) => {
        // console.log('data======+++++++++++++++' + JSON.stringify(data));
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          this.getTableData();
          this.reset();
          this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
        } else {
          //this.isError = true;
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        //this.isError = true;
        this.notifier.notify('error',  this.messageService.SERVER_ERROR);
      });
    } else {
      //this.isError = true;
      this.notifier.notify('error',  this.messageService.BLANK_ERROR_MESSAGE);
    }
  }

  reset() {

    this.grpSelected = 0;
    this.orgSelected = 0;
    this.userName = '';
    this.userSelected = '';
    this.userId = 0;
    this.groups=[];

  }



  ongrpChange(selectedIndex: any) {
    this.grpName = this.groups[selectedIndex].supportgroupname;
    this.userSelected = '';

  }

  onOrgChange(index: any) {
    this.orgName = this.organaisation[index].name;
    this.grpSelected = 0;



    this.getGroupData(this.grpSelected)

  }


  getGroupData(grpSelect){
    this._rest.getgroupbyorgid({
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgSelected),
      // offset: 0,
      // limit: 100
    }).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, supportgroupname: 'Select Support Group'});
        this.groups = this.respObject.details;
        this.grpSelected = grpSelect;
        // console.log("group"+this.grpSelected);
      } else {
        //this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, function (err) {

    });
  }
  getTableData() {
    this.getData({
      offset: this.messageService.offset, 
      limit: this.messageService.limit
    });
  }

  // isEmpty(obj) {
  //   for (const key in obj) {
  //     if (obj.hasOwnProperty(key)) {
  //       return false;
  //     }
  //   }
  //   return true;
  // }

  getData(paginationObj) {
    const offset = paginationObj.offset;
    const limit = paginationObj.limit;
    this.dataLoaded = false;
    const data = {
      'offset': offset,
      'limit': limit,
      'clientid': Number(this.clientId),
      'mstorgnhirarchyid': Number(this.orgnId)

    };
    this._rest.getgrpusermap(data).subscribe((res) => {
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

  onUserChange(selectedIndex: any) {
    this.userName = this.users[selectedIndex].name;
  }

  getOrganization(type) {
    this._rest.getorganizationclientwisenew({clientid: Number(this.clientId),mstorgnhirarchyid: Number(this.orgnId)}).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, organizationname: 'Select Organization'});
        this.organaisation = this.respObject.details;
        if(type === 'i'){
          this.orgSelected = 0;
        }
        else{
          // this.orgSelected = this.orgSelected1
        }
      } else {
        //this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      //this.isError = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }
}
