import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {NotifierService} from 'angular-notifier';
import {Formatters, OnEventArgs} from 'angular-slickgrid';
import {MessageService} from '../message.service';
import {RestApiService} from '../rest-api.service';
import {Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
// import * as CryptoJS from 'crypto-js';
import {Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';


@Component({
  selector: 'app-usercreation',
  templateUrl: './usercreation.component.html',
  styleUrls: ['./usercreation.component.css']
})
export class UsercreationComponent implements OnInit, OnDestroy {

  displayed = true;
  mobile: string;
  email: string;
  address: string;
  fullname: string;
  password: string;
  clients: any[];
  clientSelected: number;
  show: boolean;
  selected: number;
  dataset: any[];
  totalData: number;
  selectedTitles: any[];
  displayData: any;
  data: any;
  add: boolean;
  del: boolean;
  edit: boolean;
  view: boolean;
  isError = false;
  errorMessage: string;
  collectionSize: number;
  pageSize: number;
  totalPage: number;
  clientId: number;
  loginName: any;
  offset: number;
  dataLoaded: boolean;
  fileLoader: boolean;
  showSearch = false;
  isLoading = false;
  searchUser: FormControl = new FormControl();
  userSelected: any;
  usrs: any;
  userId: number;
  userName: string;
  selectedId: any;
  organaisation = [];
  orgSelected: any;
  organaisationSelected: any;
  private respObject: any;
  private clientName: any;
  // private notifier: NotifierService;
  private baseFlag: any;
  private adminAuth: Subscription;
  @ViewChild('content') private content;
  private modalReference: NgbModalRef;
  private orgName: any;
  clientSelectedName: string;
  orgSelectedName: string;
  orgnId: number;
  private userAuth: Subscription;
  notAdmin: boolean;
  hides: boolean;
  confirmPassword: string;

  secondaryContact: any;
  division: any;
  brand: any;
  designation: any;
  city: any;
  branchLoc: any;
  isVIPUser: boolean;
  userType: any;
  VIPChecked: any;
  firstName: string;
  lastName: string;
  isEdit: boolean;
  fileUploadUrl: string;
  uploadButtonName = 'Upload File';
  documentPath: any;
  documentName :any;
  orginalDocumentName:any;
  attachMsg: string;
  attachment = [];
  formdata: any;
  hideAttachment: boolean;
  orgSelectedBulk: any;
  roleSelected: number;
  roleName: string;
  role = [];
  groups = [];
  groupid: number;
  grpName: string;
  groupVal: number;
  private attachFile: number;
  clientOrgnId:any
  userTypeID: any;
  userTypes = [
    {'id': 1, 'value': 'Normal'},
    {'id': 2, 'value': 'Service'}
  ];
  loginname: string;
  fileName: boolean;
  isUserMfa: boolean;
  groupSelected = [];

  constructor(private rest: RestApiService, private notifier: NotifierService,
              private messageService: MessageService, private route: Router, private modalService: NgbModal) {

    // this.notifier = notifier;
    this.messageService.getCellChangeData().subscribe(item => {
      switch (item.type) {
        case 'delete':
          // console.log('deleted');
          if (!this.del) {
            this.notifier.notify('error', 'You do not have delete permission');
          } else {
            if (confirm('Are you sure?')) {
              this.rest.deleteclientuser({id: item.id}).subscribe((res) => {
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
          break;
      }
    });
    // this.messageService.getUserAuth().subscribe(details => {
    //     console.log(JSON.stringify(details));
    //     if (details.length > 0) {
    //         this.add = details[0].addFlag;
    //         this.del = details[0].deleteFlag;
    //         this.view = details[0].viewFlag;
    //         this.edit = details[0].editFlag;
    //     } else {
    //         this.add = false;
    //         this.del = false;
    //         this.view = false;
    //         this.edit = false;
    //     }
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

  ngOnInit() {
    // this.add = true;
    // this.del = true;
    // this.edit = true;
    // this.view = true;
    this.fileName = false;
    this.hides = true;
    this.dataLoaded = false;
    this.fileLoader = true;
    this.fileUploadUrl = this.rest.apiRoot + '/fileupload';
    this.hideAttachment = true;
    this.pageSize = this.messageService.pageSize;
    this.displayData = {
      pageName: 'Maintain User ',
      openModalButton: 'Add User',
      searchModalButton: 'Search',
      breadcrumb: 'UserCreation',
      folderName: 'All Users',
      tabName: 'User Creation'
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
          //console.log(args.dataContext);
          this.organaisation = []
          this.selectedId = args.dataContext.id;
          // this.clientSelected = args.dataContext.clientid;
          // console.log(this.organaisation.length);
          // for(let i=0;i<this.organaisation.length;i++) {
          //   if(args.dataContext.orgname == "TCS ICC") {
          //     this.orgSelected = this.orgnId;
          //   }
          //   else {
          //     this.orgSelected = this.orgnId;
          //   }
          // }
          this.isEdit = true;
          this.orgSelected = args.dataContext.mstorgnhirarchyid;
          this.clientName = args.dataContext.clientname;
          this.orgSelectedName = args.dataContext.orgname;
          this.password = args.dataContext.password;
          this.email = args.dataContext.useremail;
          this.firstName = args.dataContext.firstname;
          this.lastName = args.dataContext.lastname;
          this.loginName = args.dataContext.loginname;
          this.mobile = args.dataContext.usermobileno;
          this.secondaryContact = args.dataContext.secondaryno;
          this.division = args.dataContext.division;
          this.brand = args.dataContext.brand;
          this.city = args.dataContext.city;
          this.designation = args.dataContext.designation;
          this.branchLoc = args.dataContext.branch;
          this.userId = args.dataContext.relmanagerid;
          this.userSelected = args.dataContext.relmanager;
          this.isUserMfa = args.dataContext.mfa === 1 ? true : false;

          // this.VIPChecked = args.dataContext.vipuser;
          if (args.dataContext.vipuser === 'Y') {
            this.isVIPUser = true;
          } else {
            this.isVIPUser = false;
          }
          for (let i = 0; i < this.userTypes.length; i++) {
            if (String(args.dataContext.usertype) === String(this.userTypes[i].value)) {
              this.userTypeID = this.userTypes[i].id;
            }
          }
          if (this.baseFlag) {
            this.clientSelected = args.dataContext.clientid;
            for(let i = 0;i<this.clients.length;i++){
              if(this.clients[i].id === this.clientSelected){
                this.clientOrgnId = this.clients[i].orgnid
              }
            }
          }

          this.getOrganization(this.clientSelected,this.clientOrgnId,'u');
          this.modalReference = this.modalService.open(this.content, {});
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },
      {
        id: 'clientname', name: 'Client', field: 'clientname', sortable: true, filterable: true
      },
      {
        id: 'organization', name: 'Organization', field: 'orgname', sortable: true, filterable: true
      },
      {
        id: 'firstname', name: 'First Name', field: 'firstname', sortable: true, filterable: true
      }, {
        id: 'lastname', name: 'Last Name', field: 'lastname', sortable: true, filterable: true
      },
      {
        id: 'login_name', name: 'Login Name', field: 'loginname', sortable: true, filterable: true
      },
      {
        id: 'mobile', name: 'Mobile Number', field: 'usermobileno', sortable: true, filterable: true
      },
      {
        id: 'email', name: 'E-Mail', field: 'useremail', sortable: true, filterable: true
      },
      {
        id: 'secondaryno', name: 'Secondary Contact', field: 'secondaryno', sortable: true, filterable: true
      },
      {
        id: 'division', name: 'Division', field: 'division', sortable: true, filterable: true
      },
      {
        id: 'brand', name: 'Brand', field: 'brand', sortable: true, filterable: true
      },
      {
        id: 'designation', name: 'Designation', field: 'designation', sortable: true, filterable: true
      },
      {
        id: 'city', name: 'City', field: 'city', sortable: true, filterable: true
      },
      {
        id: 'branch', name: 'Branch / Location', field: 'branch', sortable: true, filterable: true
      },
      {
        id: 'vipuser', name: 'IS VIP User', field: 'vipuser', sortable: true, filterable: true
      },
      {
        id: 'usertype', name: 'User Type', field: 'usertype', sortable: true, filterable: true
      },
      {
        id: 'relmanager', name: 'Rel Manager', field: 'relmanager', sortable: true, filterable: true
      },
      {
        id: 'mfaname', name: 'User MFA', field: 'mfaname', sortable: true, filterable: true,
      },
    ];
    if (this.notAdmin) {
      columnDefinitions.splice(2, 1);
    }
    this.messageService.setColumnDefinitions(columnDefinitions);
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.baseFlag = this.messageService.baseFlag;
      this.orgnId = this.messageService.orgnId;
      if (this.baseFlag) {
        this.edit = true;
        this.del = true;
      } else {
        this.clientName = this.messageService.clientname;
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
        this.clientId = auth[0].clientid;
        this.baseFlag = auth[0].baseFlag;
        this.orgnId = auth[0].mstorgnhirarchyid;
        if (this.baseFlag) {
          this.edit = true;
          this.del = true;
        } else {
          this.clientName = auth[0].clientname;
          this.del = auth[0].deleteFlag;
          this.edit = auth[0].editFlag;
        }
        this.onPageLoad();
      });
    }
  }

  onPageLoad() {
    // const ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123').toString();
    // console.log(ciphertext)
    if (this.baseFlag) {
      this.notAdmin = false;
      this.rest.getallclientnames().subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.respObject.details.unshift({id: 0, name: 'Select Client'});
          this.clients = this.respObject.details;
          this.clientSelected = 0;
        } else {
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    } else {
      this.notAdmin = true;
      this.clientSelected = this.clientId;
      this.clientName = this.messageService.clientname;
      this.clientOrgnId = this.orgnId;
      //console.log(">>>>>>>>>>>>>>>>>",this.clientSelected,this.clientOrgnId);
      this.getOrganization(this.clientSelected,this.clientOrgnId,'i');
    }
    this.searchUser.valueChanges.subscribe(
      psOrName => {
        const data = {
          loginname: psOrName, clientid: Number(this.clientSelected), mstorgnhirarchyid: Number(this.orgSelected)
        };
        this.isLoading = true;
        if (psOrName !== '') {
          this.rest.searchUserByOrgnId(data).subscribe((res1) => {
            // console.log('data======' + JSON.stringify(data));
            this.respObject = res1;
            this.isLoading = false;
            if (this.respObject.success) {
              this.usrs = this.respObject.details;
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
          this.usrs = [];
        }
      });
  }

  tabClick(event) {
    if (event.tab.textLabel === 'Add User') {
      this.orgSelected = 0;
    } else if (event.tab.textLabel === 'Bulk User Upload') {
      this.orgSelectedBulk = 0;
      this.reset();
    }
    else if (event.tab.textLabel === 'Bulk User Download') {
      this.orgSelectedBulk = 0;
      this.reset();
    }
  }

  changeRouting(path: string) {
    this.messageService.changeRouting(path);
  }

  update() {
    if (Number(this.userTypeID) === 1) {
      this.userType = this.userTypes[this.userTypeID - 1].value;
    } else if (Number(this.userTypeID) === 2) {
      this.userType = this.userTypes[this.userTypeID - 1].value;
    } else {
      this.userType = '';
    }
    if (this.isVIPUser === true) {
      this.VIPChecked = 'Y';
    } else {
      this.VIPChecked = 'N';
    }
    this.data = {
      id: this.selectedId,
      clientid: Number(this.clientSelected),
      mstorgnhirarchyid: Number(this.orgSelected),
      loginname: this.loginName.trim(),
      usermobileno: this.mobile.trim(),
      useremail: this.email.trim(),
      firstname: this.firstName,
      lastname: this.lastName,
      secondaryno: this.secondaryContact,
      division: this.division,
      brand: this.brand,
      city: this.city,
      designation: this.designation,
      branch: this.branchLoc,
      vipuser: this.VIPChecked,
      usertype: this.userType,
      mfa: this.isUserMfa === true ? 1 : 2,
      createtype: 2
    };
    if (!this.messageService.isBlankField(this.data)) {
      this.data['relmanagerid'] = this.userId;
      this.rest.updateclientuser(this.data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          this.messageService.sendAfterDelete(this.selectedId);
          this.dataLoaded = true;
          this.messageService.setRow({
            id: this.selectedId,
            clientid: this.clientSelected,
            clientname: this.clientName,
            mstorgnhirarchyid: this.orgSelected,
            orgname: this.orgSelectedName,
            firstname: this.firstName,
            lastname: this.lastName,
            loginname: this.loginName,
            usermobileno: this.mobile,
            useremail: this.email,
            secondaryno: this.secondaryContact,
            division: this.division,
            brand: this.brand,
            city: this.city,
            designation: this.designation,
            branch: this.branchLoc,
            vipuser: this.VIPChecked,
            usertype: this.userType,
            relmanagerid: this.userId,
            relmanager: this.userSelected,
            mfa: this.isUserMfa === true ? 1 : 2,
            mfaname : this.isUserMfa === true ? 'ENABLE' : 'DISABLE'
          });
          // this.getTableData();
          this.modalReference.close();
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

  openModal(content) {
    this.isError = false;
    this.reset();
    this.isEdit = false;
    this.modalService.open(content).result.then((result) => {
    }, (reason) => {
    });
  }

  save() {
    if (Number(this.userTypeID) === 1) {
      this.userType = this.userTypes[this.userTypeID - 1].value;
    } else if (Number(this.userTypeID) === 2) {
      this.userType = this.userTypes[this.userTypeID - 1].value;
    } else {
      this.userType = '';
    }
    if (this.isVIPUser === true) {
      this.VIPChecked = 'Y';
    } else {
      this.VIPChecked = 'N';
    }
    this.data = {
      clientid: Number(this.clientSelected),
      mstorgnhirarchyid: Number(this.orgSelected),
      loginname: this.loginName.trim(),
      usermobileno: this.mobile.trim(),
      useremail: this.email.trim(),
      password: this.password,
      firstname: this.firstName.trim(),
      lastname: this.lastName.trim(),
      secondaryno: this.secondaryContact,
      division: this.division,
      brand: this.brand,
      city: this.city,
      designation: this.designation,
      branch: this.branchLoc,
      vipuser: this.VIPChecked,
      usertype: this.userType,
      mfa: this.isUserMfa === true ? 1 : 2,
      createtype: 2
    };
    // console.log('-------------------' + JSON.stringify(this.data));
    // console.log('clientSelected====' + typeof this.clientSelected);
    if (!this.messageService.isBlankField(this.data)) {
      if (this.password === this.confirmPassword) {
        this.data['relmanagerid'] = this.userId;
        this.rest.createclientuser(this.data).subscribe((res) => {
          this.respObject = res;
          if (this.respObject.success) {
            const id = this.respObject.details;
            // console.log(this.clientId + '==============' + this.clientSelected + '====' + this.orgnId + '========' + this.orgSelected);
              this.messageService.setRow({
                id: id,
                clientid: this.clientSelected,
                clientname: this.clientName,
                mstorgnhirarchyid: this.orgSelected,
                orgname: this.orgName,
                firstname: this.firstName.trim(),
                lastname: this.lastName.trim(),
                loginname: this.loginName,
                usermobileno: this.mobile,
                useremail: this.email,
                secondaryno: this.secondaryContact,
                division: this.division,
                brand: this.brand,
                city: this.city,
                designation: this.designation,
                branch: this.branchLoc,
                vipuser: this.VIPChecked,
                usertype: this.userType,
                relmanagerid: this.userId,
                relmanager: this.userSelected,
                mfa: this.isUserMfa === true ? 1 : 2,
                mfaname : this.isUserMfa === true ? 'ENABLE' : 'DISABLE'
              });
              this.totalData = this.totalData + 1;
              this.messageService.setTotalData(this.totalData);
            this.isError = false;
            this.reset();
            this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
          } else {
            this.notifier.notify('error', this.respObject.message);
          }
        }, (err) => {
          this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
      } else {
        this.notifier.notify('error', this.messageService.PASSWORD_MISMATCH);

      }
    } else {
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }
  }

  reset() {
    if (this.baseFlag) {
      this.clientSelected = 0;
      this.organaisation = []
    }
    this.userId = 0;
    this.userSelected = '';
    this.userName = '';
    this.userType = '';
    this.userTypeID = 0;
    this.firstName = '';
    this.lastName = '';
    this.fullname = '';
    this.mobile = '';
    this.email = '';
    this.address = '';
    this.password = '';
    this.loginName = '';
    this.confirmPassword = '';
    this.orgSelected = 0;
    this.orgSelectedBulk = 0;
    this.organaisationSelected = 0;
    this.secondaryContact = '';
    this.division = '';
    this.brand = '';
    this.city = '';
    this.designation = '';
    this.branchLoc = '';
    this.isVIPUser = false;
    this.groupid = 0;
    this.groups = [];
    this.roleSelected = 0;
    this.role = [];
    this.hideAttachment = true;
    this.attachment = [];
    this.documentName = '';
    this.orginalDocumentName = '';
    this.fileName = false;
    this.isUserMfa =  false;
    this.groupSelected = []
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
      'clientid': Number(this.clientId),
      'mstorgnhirarchyid': Number(this.orgnId)
    };
    this.rest.getclientuser(data).subscribe((res) => {
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

  onClientChange(index: any) {
    this.clientName = this.clients[index].name;
    this.clientOrgnId = this.clients[index].orgnid;
    this.getOrganization(this.clientSelected,this.clientOrgnId,'i');
  }

  ngOnDestroy(): void {
    if (this.adminAuth) {
      this.adminAuth.unsubscribe();
    }
  }

  onOrgChange(index: any) {
    this.orgName = this.organaisation[index].organizationname;
    this.roledata('i');
    this.getGroupid('i');
    this.formdata = {
      'clientid': this.clientSelected,
      'mstorgnhirarchyid': Number(this.orgSelectedBulk)
    };
  }

  onOrgChangeforDownload(index){
    this.orgName = this.organaisation[index].organizationname;
    this.getGroupid('i');
  }

  getOrganization(clientId,orgnId,type) {
    //console.log("===============",clientId,orgnId)
    this.rest.getorganizationclientwisenew({clientid: Number(clientId),mstorgnhirarchyid: Number(orgnId)}).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, organizationname: 'Select Organization'});
        this.organaisation = this.respObject.details;
        if(type==='i'){
          this.orgSelected = 0;
          this.orgSelectedBulk = 0;
        }else{

        }
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onFileComplete(data: any) {
    //console.log('file data==========' + JSON.stringify(data));
    // this.logoName = data.changedName;
    if (data.success) {
      this.fileName = true;
      this.hideAttachment = false;
      this.attachment.push({originalName: data.details.originalfile, fileName: data.details.filename});
      // console.log(JSON.stringify(this.attachment));
      if (this.attachment.length > 1) {
        this.attachMsg = this.attachment.length + ' files uploaded successfully';
      } else {
        this.attachMsg = this.attachment.length + ' file uploaded successfully';
      }
      this.documentName = data.details.filename;
      this.documentPath = data.details.path;
      this.orginalDocumentName = data.details.originalfile;

    }
  }

  onFileError(msg: string) {
    this.notifier.notify('error', msg);
  }

  onUpload(data: any) {
    this.fileLoader = data.loader;
  }

  onRemove() {
    this.attachFile = this.attachFile - 1;
  }

  onRoleChange(selectedIndex: any) {
    this.roleName = this.role[selectedIndex].rolename;
  }

  roledata(type) {
    const data = {
      'clientid': Number(this.clientSelected),
      'mstorgnhirarchyid': Number(this.orgSelectedBulk)
    };

    this.rest.getrolebyorgid(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        //this.respObject.details.unshift({id: 0, rolename: 'Select Role'});
        this.role = this.respObject.details;
        if (type === 'i') {
          this.roleSelected = 0;
        } else {
          //this.roleSelected = this.roleSelected1;
        }
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {

    });
  }

  getGroupid(type) {
    this.rest.getgroupbyorgid({
      clientid: Number(this.clientSelected),
      mstorgnhirarchyid: Number(this.orgSelectedBulk)
    }).subscribe((res: any) => {
      if (res.success) {
        //res.details.unshift({id: 0, supportgroupname: 'Select Group Name'});
        this.groups = res.details;
        this.selectAll(this.groups)
        if (type === 'i') {
          this.groupid = 0;
          this.groupSelected = []
        } else {
          //this.groupid = this.gid;
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      //console.log(err);
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

  onGroupChange(index) {
    this.grpName = this.groups[index - 1].supportgroupname;
  }


  onUserTypeChange(Index) {
    //console.log('\n Index :  ', Index);
  }

  bulkSave() {
    const data = {
      clientid: Number(this.clientSelected),
      mstorgnhirarchyid: Number(this.orgSelectedBulk),
      roleid: Number(this.roleSelected),
      groupid: Number(this.groupid),
      uploadedfilename : this.documentName,
      originalfilename: this.orginalDocumentName
    };
    // console.log('>>>>>>>>>>> ', JSON.stringify(data));
    if (!this.messageService.isBlankField(data)) {
      this.fileLoader = false;
      this.rest.bulkuserupload(data).subscribe((res: any) => {
        this.respObject = res;
        if (this.respObject.success) {
          const id = this.respObject.details;
          this.isError = false;
          this.reset();
          this.fileLoader = true;
          this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
        } else {
          this.isError = true;
          this.fileLoader = true;
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.isError = true;
        this.fileLoader = true;
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    } else {
      this.isError = true;
      this.fileLoader = true;
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }
  }

  getUserDetails() {
    for (let i = 0; i < this.usrs.length; i++) {
      if (this.usrs[i].name === this.userSelected) {
        this.userId = this.usrs[i].id;
        this.userName = this.usrs[i].name;
        this.loginname = this.usrs[i].loginname;
      }
    }
  }

  download() {
    const data = {
      'clientid': Number(this.clientSelected),
      'mstorgnhirarchyid': Number(this.orgSelectedBulk),
      "groupid": this.groupSelected
    };
    // console.log(JSON.stringify(data))
    this.fileLoader = false;
    if (!this.messageService.isBlankField(data)) {
      this.rest.bulkuserdownload(data).subscribe((res: any) => {
        this.respObject = res;
        if (this.respObject.success) {
          const uploadname = this.respObject.uploadedfilename;
          const originalname = this.respObject.originalfilename;
          this.downloadFile(uploadname,originalname)
          this.isError = false;
          this.reset();
          this.fileLoader = true;
          this.notifier.notify('success', this.messageService.DOWNLOAD_SUCCESS);
        } else {
          this.fileLoader = true;
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.fileLoader = true;
        this.notifier.notify('error',this.messageService.SERVER_ERROR);
      });
    } else {
      this.fileLoader = true;
      this.notifier.notify('error',this.messageService.BLANK_ERROR_MESSAGE);
    }
  }

  downloadFile(uploadname, originalname) {
    const data = {
      'clientid': Number(this.clientSelected),
      'mstorgnhirarchyid': Number(this.orgSelectedBulk),
      'filename': uploadname
    };
    // console.log(JSON.stringify(data))
    // console.log("Upload",uploadname,"!!Download",originalname)
    this.fileLoader = false
    this.rest.filedownload(data).subscribe((blob: any) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = originalname;
      a.click();
      URL.revokeObjectURL(objectUrl);
      this.fileLoader = true
    });
  }
}
