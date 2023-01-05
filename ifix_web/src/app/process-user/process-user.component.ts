import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {MessageService} from '../message.service';
import {NotifierService} from 'angular-notifier';
import {RestApiService} from '../rest-api.service';
import {Router} from '@angular/router';
import {Editors, Filters, Formatters, OnEventArgs} from 'angular-slickgrid';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {CustomInputEditor} from '../custom-inputEditor';
import {Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-process-user',
  templateUrl: './process-user.component.html',
  styleUrls: ['./process-user.component.css']
})
export class ProcessUserComponent implements OnInit, OnDestroy {

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
  pageSize: number;
  private userAuth: Subscription;
  offset: number;
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
  isLoading = false;
  process = [];
  processName: string;
  processSelected: any;
  userId: number;
  searchUser: FormControl = new FormControl();
  users: any[];
  userSelected: string;
  userName: string;
  loginname: string;
  processSelected1: number;
  selectedProcess: number;
  orgSelected1: number;
  selectedOrg: number;

  constructor(private rest: RestApiService, private messageService: MessageService, private route: Router,
              private modalService: NgbModal, notifier: NotifierService) {
    this.notifier = notifier;
    this.messageService.getCellChangeData().subscribe(item => {
      switch (item.type) {

        case 'delete':
          // console.log('deleted');
          if (!this.del) {
            this.notifier.notify('error', this.messageService.DELETE_PERMISSION);
          } else {
            if (confirm('Are you sure?')) {
              this.rest.deleteprocessadmin({
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
                this.notifier.notify('error', this.respObject.errorMessage);
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
    this.dataLoaded = false;
    this.pageSize = this.messageService.pageSize;
    this.displayData = {
      pageName: 'Maintain Process User Mapping',
      openModalButton: 'Add Process User Mapping',
      breadcrumb: '',
      folderName: 'All Process User Mapping',
      tabName: 'Process User Mapping',
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
          this.reset();
          this.process = [];
          this.selectedId = args.dataContext.id;
          this.processSelected = Number(args.dataContext.processid);
          this.orgSelected = Number(args.dataContext.mstorgnhirarchyid);
          this.orgName = args.dataContext.mstorgnhirarchyname;
          this.userSelected = args.dataContext.username;
          this.userName = args.dataContext.username;
          this.userId = args.dataContext.refuserid;
          console.log(this.processSelected);
          this.getprocess(this.orgSelected , 'u');
          this.modalReference = this.modalService.open(this.content1, {size:'lg'});
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
        
      },
      {
        id: 'organization', name: 'Organization', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'process', name: 'Process', field: 'processname', sortable: true, filterable: true
      },
      {
        id: 'user', name: 'User', field: 'username', sortable: true, filterable: true
      },
    ];


    this.messageService.setColumnDefinitions(columnDefinitions);
    // this.onPageLoad();
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
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
        this.orgId = auth[0].mstorgnhirarchyid;
        this.onPageLoad();
      });
    }


    this.searchUser.valueChanges.subscribe(
      psOrName => {
        const data = {
          loginname: psOrName,
          clientid: Number(this.clientId),
          mstorgnhirarchyid: Number(this.orgSelected),
        };
        this.isLoading = true;
        if (psOrName !== '') {
          this.rest.searchworkflowuser(data).subscribe((res1) => {
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
          this.userSelected = ''
          this.userId = 0;
        }
      });

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
        this.selectedOrg = this.orgSelected1;
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  changeRouting(path: string) {
    this.messageService.changeRouting(path);
  }


  reset() {
    this.orgSelected = 0;
    this.processSelected = [];
    this.process=[];
    this.userName = '';
    this.userSelected = '';
    this.userId = 0;
  }

  onprocessChange(index: any) {
    this.processName = this.process[index].name;
    // this.getUserDetails();
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
    this.getprocess(this.orgSelected ,'i');
    this.getUserDetails();
  }

  getprocess(orgId , type) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(orgId),
      type: 1
    };
    this.rest.getworklowutilitylist(data).subscribe((res: any) => {
      if (res.success) {
        // console.log("............"+this.processSelected)
        // res.details.unshift({id: 0, name: 'Select Process'});
        this.process = res.details;
        // if(type === 'i'){
        //   this.processSelected = 0;
        // }else{
        
          // this.processSelected = this.processSelected1;
       // }
      
       
   
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }


  getUserDetails() {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].loginname === this.userSelected) {
        this.userId = this.users[i].id;
        console.log('this.userId==' + this.userId);
        this.userName = this.users[i].name;
        this.loginname = this.users[i].loginname;

      }
    }
  }


  update() {
    for(let i = 0; i<this.process.length;i++){
      if(this.process[i].id === Number(this.processSelected))
      {
        this.processName = this.process[i].name;
        // console.log(this.processName)
        break
      }
    }

    const data = {
      'id' : this.selectedId,
      'clientid': Number(this.clientId),
      'mstorgnhirarchyid': Number(this.orgSelected),
      'processid': Number(this.processSelected),
      'refuserid': Number(this.userId)
    };
    console.log('data' + JSON.stringify(data));

    if (!this.messageService.isBlankField(data)) {
      this.rest.updateprocessadmin(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          this.modalReference.close();
          this.messageService.sendAfterDelete(this.selectedId);
          this.dataLoaded =true;
          this.messageService.setRow({
            id:this.selectedId,
            mstorgnhirarchyid: this.orgSelected,
            mstorgnhirarchyname:this.orgName,
            processname: this.processName,
            processid:this.processSelected,
            username:this.userSelected,
            userName:this.userName
          });
          // this.getTableData();
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
    for(let i = 0; i<this.process.length;i++){
      if(this.process[i].id === Number(this.processSelected))
      {
        this.processName = this.process[i].name;
        // console.log(this.processName)
        break
      }     
    }

    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgSelected),
      processid: Number(this.processSelected),
      refuserid: Number(this.userId)
    };
    console.log('data' + JSON.stringify(data));
    if (!this.messageService.isBlankField(data)) {
      this.rest.addprocessadmin(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          const id = this.respObject.details;
          this.messageService.setRow({
            id: id,
            mstorgnhirarchyid: this.orgSelected,
            processid:this.processSelected,
            mstorgnhirarchyname: this.orgName,
            processname: this.processName,
            username: this.userName,
            refuserid:this.userId
          });
          console.log('idddddd'+id);
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

  getData(paginationObj) {
    const offset = paginationObj.offset;
    const limit = paginationObj.limit;
    this.dataLoaded = false;
    const data = {
      'clientid': Number(this.clientId),
      'mstorgnhirarchyid': Number(this.orgId),
      'Offset': offset,
      'Limit': limit,
    };
    this.rest.getprocessadmin(data).subscribe((res) => {
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
