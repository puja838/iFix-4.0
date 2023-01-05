import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {MessageService} from '../message.service';
import {NotifierService} from 'angular-notifier';
import {RestApiService} from '../rest-api.service';
import {Router} from '@angular/router';
import {Filters, Formatters, OnEventArgs} from 'angular-slickgrid';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {CustomInputEditor} from '../custom-inputEditor';
import {Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';


@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})
export class OrganizationComponent implements OnInit, OnDestroy {

  show: boolean;
  dataset: any[];
  totalData: number;
  respObject: any;
  attrVal: string;
  attrDesc: string;

  displayData: any;

  add: boolean;
  del: boolean;
  edit: boolean;
  view: boolean;

  isError = false;
  message: string;

  collectionSize: number;
  pageSize: number;
  paginationType: string;

  private baseFlag: any;
  private adminAuth: Subscription;

  private notifier: NotifierService;
  private clientId: number;
  offset: number;
  dataLoaded: boolean;


  orgName: string;
  activationDate = '';
  zones = [];
  zoneSelected: any;
  searchTerm: FormControl = new FormControl();
  searchTimeZone: FormControl = new FormControl();
  pincode: string;
  location: string;
  code: string;
  clients = [];
  clientSelected: any;

  isLoading: boolean;
  orgTypeSelected: any;
  orgTypes = [];
  porgSelected: any;
  parentOrg: any;
  logins = [];
  cities = [];
  times = [];
  citySelected: any;
  countrySelected: any;
  countrys = [];

  orgId: any;
  userid: any;

  @ViewChild('content1') private content1;
  private modalReference: NgbModalRef;
  selectedId: number;
  clientSelectedName: string;
  orgTypeName: string;
  porgSelectedName: string;
  zoneTime: any;
  porgSelected1: any;
  countryName: any;
  cityName: any;
  loginName: any;
  timeFromName: any;
  reportTimeName: any;
  orgnId: number;
  min: any;
  clientName: string;
  parentOrgName: string;
  timeZones = [];
  reportTime = [];
  timeZoneSelected: string;
  timeZoneSelected1: string;
  zoneSelected1: string;
  citySelected1: number;
  countrySelected1: number;
  activationDate1: any;
  selectCity: number;
  selectCountry: number;
  selectLoginType: number;
  selectTimeForm: number;
  selectTimeForm1: any;
  selectReportTime: number;
  localLogin: boolean;
  clientOrgnId = 0;
  isBaseOrg: boolean;
  isOrgMfa: boolean;
  isNotification: boolean;

  fileUploadUrl: string;
  uploadButtonName = 'Upload File';
  attachMsg: string;
  attachment = [];
  formdata: any;
  hideAttachment: boolean;
  private attachFile: number;
  documentPath: any;
  documentName :any;
  orginalDocumentName:any;
  fileName: boolean;
  fileLoader: boolean;
  backgroundImgName : any;
  orginalBgImageName : any;

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
              // this.rest.deleteTicketAttributesClientWise({id: item.id, user_id: this.messageService.getUserId()}).subscribe((res) => {
              //   this.respObject = res;
              //   if (this.respObject.success) {
              //     // this.totalData = this.totalData - 1;
              //     // this.messageService.setTotalData(this.totalData);
              //     this.messageService.sendAfterDelete(item.id);
              //   } else {
              //     this.notifier.notify('error', this.respObject.message);
              //   }
              // }, (err) => {
              //   this.notifier.notify('error', this.respObject.message);
              // });
            }
          }
          break;
      }
    });

    this.searchTerm.valueChanges.subscribe(
      zone => {
        // console.log('ZONE=====' + zone);
        this.isLoading = true;
        if (zone !== undefined) {
          zone = zone.toUpperCase();
          this.rest.searchzone({Zonename: zone}).subscribe((res1) => {
            this.respObject = res1;
            this.isLoading = false;
            if (this.respObject.success) {

              this.isError = false;
              this.zones = this.respObject.details;
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

    this.searchTimeZone.valueChanges.subscribe(
      timeZone => {
        this.isLoading = true;
        if (timeZone !== undefined) {
          timeZone = timeZone.toUpperCase();
          this.rest.searchzone({Zonename: timeZone}).subscribe((res1) => {
            this.respObject = res1;
            this.isLoading = false;
            if (this.respObject.success) {
              this.isError = false;
              this.timeZones = this.respObject.details;
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
          this.timeZones = [];
        }
      });
  }


  ngOnInit() {
    this.orgTypes = [{id: 0, name: 'Organization Type'}, {id: 1, name: 'Base Client'}, {id: 2, name: 'Client'}, {
      id: 3,
      name: 'Customer'
    }, {id: 4, name: 'Branch'}];
    this.clientId = 1;
    this.orgId = 1;
    this.userid = 1;
    this.add = true;
    this.del = true;
    this.edit = true;
    this.view = true;
    this.localLogin = false;
    this.dataLoaded = false;
    this.fileLoader = true;
    this.fileUploadUrl = this.rest.apiRoot + '/fileupload';
    this.hideAttachment = true;
    this.fileName = false;
    this.pageSize = this.messageService.pageSize;

    this.paginationType = 'next';
    this.displayData = {
      pageName: 'Maintain Organization',
      openModalButton: 'Add Organization',
      breadcrumb: '',
      folderName: 'All organization Types',
      tabName: 'Organization'
    };
    this.porgSelected = 0;
    this.countrySelected = 0;
    this.selectCity = 0;
    this.selectLoginType = 0;
    this.selectTimeForm = 0;
    this.selectReportTime = 0;
    const columnDefinitions = [
      {
        id: 'edit',
        field: 'id',
        excludeFromHeaderMenu: true,
        formatter: Formatters.editIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          console.log(JSON.stringify(args.dataContext));
          this.resetData();
          this.parentOrg = [];
          this.selectedId = args.dataContext.id;

          this.clientSelectedName = args.dataContext.clientname;
          this.clientSelected = args.dataContext.clientid;
          this.orgTypeSelected = Number(args.dataContext.mstorgnhierarchytypeid);
          this.porgSelected = Number(args.dataContext.parentid);
          if (Number(this.porgSelected) === 0) {
            this.isBaseOrg = true;
            this.porgSelected1 = 2
          } else {
            this.isBaseOrg = false;
            this.porgSelected1 = this.porgSelected
          }
          this.orgName = args.dataContext.organizationname;
          this.selectCity = Number(args.dataContext.cityid);
          this.countrySelected = Number(args.dataContext.countryid);
          this.code = args.dataContext.code;
          this.location = args.dataContext.location;
          //this.pincode = args.dataContext.pincode;
          this.zoneTime = args.dataContext.timezoneid;
          this.zoneSelected1 = args.dataContext.reporttimezonename;
          this.timeZoneSelected1 = args.dataContext.timezonename;
          this.selectTimeForm1 = args.dataContext.timeformatid;
          this.selectLoginType = args.dataContext.logintypeid;
          this.selectReportTime = args.dataContext.reporttimeformatid;
          this.localLogin = args.dataContext.islocallogin;
          // console.log(locallogin1)
          // this.localLogin = locallogin1;
          // console.log(this.localLogin)
          this.countryName = args.dataContext.countryname;
          this.cityName = args.dataContext.cityname;
          this.loginName = args.dataContext.logintypename;
          this.timeFromName = args.dataContext.timeformat;
          this.reportTimeName = args.dataContext.reporttimeformat;
          this.parentOrgName = args.dataContext.parentname;
          this.orgTypeName = args.dataContext.mstorgnhierarchytypename;
          this.activationDate1 = new Date(args.dataContext.activationdate);
          this.isOrgMfa = args.dataContext.mfa === 1 ? true : false;
          this.isNotification = args.dataContext.notification === 1 ? true : false;
          this.orginalBgImageName = args.dataContext.originalbgimage;
          this.orginalDocumentName = args.dataContext.originallogoimage;
          this.documentName = args.dataContext.uploadedlogoimage;
          this.backgroundImgName = args.dataContext.uploadedbgimage;
          this.getClient('u');
          //this.organizationData(this.clientSelected,this.clientOrgnId);
          this.getCountryCity();
          this.getLoginType();
          this.getTimeFormat('u');
          this.getReportTime();
          this.formdata = {
            'clientid': this.clientSelected,
            'mstorgnhirarchyid': Number(this.selectedId)
          };
          this.fileName = true;
          this.modalReference = this.modalService.open(this.content1, {});
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },
      {
        id: 'client', name: 'Client Name', field: 'clientname', sortable: true, filterable: true, minWidth: 200,
      },
      {
        id: 'orgType',
        name: 'Organization Type',
        field: 'mstorgnhierarchytypename',
        sortable: true,
        filterable: true,
        minWidth: 200,
      },
      {
        id: 'pOrg', name: 'Parent Organization', field: 'parentname', sortable: true, filterable: true, minWidth: 200,
      },
      {
        id: 'name', name: 'Name', field: 'organizationname', sortable: true, filterable: true, minWidth: 200,
      },
      {
        id: 'city', name: 'City', field: 'cityname', sortable: true, filterable: true, minWidth: 200,
      },
      {
        id: 'country', name: 'Country', field: 'countryname', sortable: true, filterable: true, minWidth: 200,
      },
      {
        id: 'code', name: 'Code', field: 'code', sortable: true, filterable: true, minWidth: 200,
      },
      // {
      //   id: 'pincode', name: 'Pincode', field: 'pincode', sortable: true, filterable: true,
      // },
      {
        id: 'location', name: 'Location', field: 'location', sortable: true, filterable: true, minWidth: 200,
      },
      {
        id: 'logintypename', name: 'Login Type', field: 'logintypename', sortable: true, filterable: true, minWidth: 200,
      },
      {
        id: 'timeformat', name: 'Time Format', field: 'timeformat', sortable: true, filterable: true, minWidth: 200,
      },
      {
        id: 'reporttimeformat', name: 'Report Time Format', field: 'reporttimeformat', sortable: true, filterable: true, minWidth: 200,
      },
      {
        id: 'timezonename', name: 'Time Zone', field: 'timezonename', sortable: true, filterable: true, minWidth: 200,
      },
      {
        id: 'mfaname', name: 'Organization MFA', field: 'mfaname', sortable: true, filterable: true, minWidth: 200,
      },
      {
         id: 'notificationname', name: 'Notification', field: 'notificationname', sortable: true, filterable: true, minWidth: 200,
      },
      {
        id: 'reporttimezonename',
        name: 'Report Time Zone',
        field: 'reporttimezonename',
        sortable: true,
        filterable: true,
        minWidth: 200,
      },
      {
        id: 'activationdate',
        name: 'Activation Date',
        field: 'activationdate',
        sortable: true,
        filterable: true,
        minWidth: 200,

      }, {
        id: 'islocallogin',
        name: 'Local Login',
        field: 'islocallogin',
        sortable: true,
        filterable: true,
        formatter: Formatters.checkmark,
        filter: {
          collection: [{value: '', label: 'All'}, {value: true, label: 'True'}, {value: 1, label: 'False'}],
          model: Filters.singleSelect,

          filterOptions: {
            autoDropWidth: true
          },
        },
        minWidth: 100
      },
    ];
    this.messageService.setColumnDefinitions(columnDefinitions);
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.baseFlag = this.messageService.baseFlag;
      this.orgnId = this.messageService.orgnId;
      this.onPageLoad();
    } else {
      this.adminAuth = this.messageService.getClientUserAuth().subscribe(details => {
        if (details.length > 0) {
          // this.add = details[0].addFlag;
          // this.del = details[0].deleteFlag;
          // this.view = details[0].viewFlag;
          // this.edit = details[0].editFlag;
          this.clientId = details[0].clientid;
          this.baseFlag = details[0].baseFlag;
          this.orgnId = details[0].mstorgnhirarchyid;
          this.onPageLoad();
        }
      });
    }
    const todayDate = new Date();
    const todayMonth = todayDate.getMonth();
    const todayDay = todayDate.getDate();
    const todayYear = todayDate.getFullYear();
    this.min = new Date(todayYear, todayMonth, todayDay);
  }

  onPageLoad() {
    this.getClient('i');
  }

  changeRouting(path: string) {
    this.messageService.changeRouting(path);
  }

  getClient(type) {
    this.rest.getallclientnames().subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, name: 'Select Client'});
        this.clients = this.respObject.details;
        if (type === 'i') {
          this.clientSelected = 0;
        } else {
          for (let i = 0; i < this.clients.length; i++) {
            if (this.clients[i].id === Number(this.clientSelected)) {
              this.clientOrgnId = this.clients[i].orgnid;
            }
          }
          this.organizationData(this.clientSelected, this.clientOrgnId);
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


  organizationData(clientId, orgnId) {
    const data = {
      clientid: Number(clientId),
      mstorgnhirarchyid: Number(orgnId)
    };
    this.rest.getorganizationclientwisenew(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        // this.respObject.details.unshift({id: 0, organizationname: 'Select Parent Organization'});
        this.parentOrg = this.respObject.details;
        // this.porgSelected = 0;
        // console.log(',,,,,,,,,,,' + JSON.stringify(this.porgSelected));
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.isError = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onClientChange(selectedIndex: any) {
    this.clientName = this.clients[selectedIndex].name;
    this.clientOrgnId = this.clients[selectedIndex].orgnid;
    this.porgSelected = 0;
    this.organizationData(this.clientSelected, this.clientOrgnId);
  }

  onOrgTypeChange(selectedIndex: any) {
    this.orgTypeName = this.orgTypes[selectedIndex].name;
  }

  onParentOrgChange(selectedIndex: any) {
    // console.log(this.porgSelected);
    if (selectedIndex === 0) {
      this.notifier.notify('error', 'Please select a valid Parent Organization');
    } else {
      this.parentOrgName = this.parentOrg[selectedIndex - 1].organizationname;
      // console.log(selectedIndex, '==', this.parentOrgName);
    }
    this.formdata = {
      'clientid': this.clientSelected,
      'mstorgnhirarchyid': Number(this.porgSelected)
    };
  }

  oncityChange(value: any) {
    this.cityName = this.cities[value].cityname;
  }

  oncountryChange(value: any) {
    this.countryName = this.countrys[value].countryname;
  }

  onLoginTypeChange(index: any) {
    this.loginName = this.logins[index].name;
    // console.log(this.selectLoginType);
  }

  onTimeFormChange(index: any) {
    this.timeFromName = this.times[index].timeformat;
  }

  onReportTimeChange(index: any) {
    this.reportTimeName = this.reportTime[index].timeformat;
  }

  openModal(content) {
    if (!this.add) {
      this.notifier.notify('error', 'You do not have add permission');
    } else {
      this.isError = false;
      this.resetData();
      this.getCountryCity();
      this.getLoginType();
      this.getTimeFormat('i');
      this.getReportTime();
      this.modalService.open(content, {size: 'md'}).result.then((result) => {
      }, (reason) => {
      });
    }
  }

  getLoginType() {
    //this.logins=[];
    this.rest.getlogintype().subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, name: 'Select Login Type'});
        this.logins = this.respObject.details;
        // this.citySelected = 0;
        // this.selectCity = this.citySelected1;
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.isError = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getReportTime() {
    this.rest.gettimeformat().subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, timeformat: 'Select Report Time Format'});
        this.reportTime = this.respObject.details;
        // this.citySelected = 0;
        // this.selectCity = this.citySelected1;
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.isError = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getTimeFormat(type) {
    //this.logins=[];
    this.rest.gettimeformat().subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.unshift({id: 0, timeformat: 'Select Time Format'});
        this.times = this.respObject.details;
        if (type === 'i') {
          this.selectTimeForm = 0;
        } else {
          this.selectTimeForm = this.selectTimeForm1;
        }
        // this.citySelected = 0;
        // this.selectCity = this.citySelected1;
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.isError = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getCountryCity() {
    this.cities = [];
    this.countrys = [];
    this.rest.getcities().subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.values.unshift({id: 0, cityname: 'Select City'});
        this.cities = this.respObject.details.values;
        // this.citySelected = 0;
        // this.selectCity = this.citySelected1;
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.isError = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });

    this.rest.getcountries().subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.respObject.details.values.unshift({id: 0, countryname: 'Select Country'});
        this.countrys = this.respObject.details.values;
        // this.countrySelected = 0;
        // this.selectCountry = this.countrySelected1;
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.isError = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }


  resetData() {
    this.orgName = '';
    this.activationDate = '';
    this.code = '';
    this.location = '';
    // this.pincode = '';
    this.clientSelected = 0;
    this.orgTypeSelected = 0;
    this.parentOrg = [];
    this.porgSelected = 0;
    this.selectCity = 0;
    this.countrySelected = 0;
    this.timeZoneSelected = '';
    this.zoneSelected = '';
    // this.orgTypes =[];
    this.selectTimeForm = 0;
    this.selectLoginType = 0;
    this.selectReportTime = 0;
    this.localLogin = false;
    // this.cities =[];
    // this.countrys =[];
    this.logins = [];
    this.times = [];
    this.reportTime = [];
    this.isBaseOrg = false;
    this.isOrgMfa = false;
    this.isNotification = false;
    this.hideAttachment = true;
    this.attachment = [];
    this.documentName='';
    this.orginalDocumentName = '';
    this.fileName = false;
    this.backgroundImgName = '';
    this.orginalBgImageName = '';
  }


  update() {
    let zoneId = 0;
    let reportZoneId = 0;
    for (let i = 0; i < this.timeZones.length; i++) {
      if (this.timeZones[i].zonename === this.timeZoneSelected1) {
        zoneId = this.timeZones[i].id;
      }
    }

    for (let j = 0; j < this.zones.length; j++) {
      if (this.zones[j].zonename === this.zoneSelected1) {
        reportZoneId = this.zones[j].id;
      }
    }

    if (this.selectLoginType === 2) {
      this.localLogin = false;

      // 3-Aug-2021 : If condition is changed by Biswajit.
      const data =
        {
          'id': this.selectedId,
          // 'parentid': Number(this.porgSelected),
          'mstorgnhierarchytypeid': Number(this.orgTypeSelected),
          'organizationname': this.orgName.trim(),
          'cityid': Number(this.selectCity),
          'countryid': Number(this.countrySelected),
          'code': this.code.trim(),
          'location': this.location.trim(),
          'timezoneid': zoneId,
          'reporttimezoneid': reportZoneId,
          'clientid': Number(this.clientSelected),
          'activationdate': this.messageService.dateConverter(this.activationDate1, 4),
          'logintypeid': Number(this.selectLoginType),
          'timeformatid': Number(this.selectTimeForm),
          'reporttimeformatid': Number(this.selectReportTime),
          'islocallogin': this.localLogin == false ? 1 : 2,
          'mfa': this.isOrgMfa === true ? 1 : 2,
          'notification' : this.isNotification === true ? 1 : 2,
        };

      // console.log('\n IF PART ::  ' + JSON.stringify(data));
      // console.log("\n selectTimeForm == ", this.selectTimeForm, "\n selectReportTime", this.selectReportTime);
      // console.log("\n timeFromName == ", this.timeFromName, "\n reportTimeName", this.reportTimeName);

      if (!this.messageService.isBlankField(data)) {
        data['parentid'] = Number(this.porgSelected);
        data['originallogoimage'] = this.orginalDocumentName,
        data['uploadedlogoimage'] = this.documentName,
        data['originalbgimage'] = this.orginalBgImageName,
        data['uploadedbgimage'] = this.backgroundImgName
        this.rest.updateorganization(data).subscribe((res) => {
          this.respObject = res;
          if (this.respObject.success) {
            this.messageService.setTotalData(this.totalData);
            this.isError = false;
            this.messageService.sendAfterDelete(this.selectedId);
            this.dataLoaded = true;
            this.messageService.setRow({
              id: this.selectedId,
              clientname: this.clientSelectedName,
              clientid: this.clientSelected,
              organizationname: this.orgName,
              countryname: this.countryName,
              countryid: this.countrySelected,
              cityid: this.selectCity,
              cityname: this.cityName,
              parentid: Number(this.porgSelected),
              mstorgnhierarchytypeid: this.orgTypeSelected,
              parentname: this.parentOrgName,
              code: this.code,
              //pincode: this.pincode,
              location: this.location,
              mstorgnhierarchytypename: this.orgTypeName,
              timezonename: this.timeZoneSelected1,
              reporttimezonename: this.zoneSelected1,
              logintypename: this.loginName,
              timeformat: this.timeFromName,
              logintypeid: this.selectLoginType,
              timeformatid: this.selectTimeForm,
              reporttimeformatid: this.selectReportTime,
              reporttimeformat: this.reportTimeName,
              activationdate: this.messageService.dateConverter(this.activationDate1, 4),
              islocallogin: this.localLogin,
              mfa: this.isOrgMfa === true ? 1 : 2,
              mfaname: this.isOrgMfa === true ? 'ENABLE' : 'DISABLE',
              notification: this.isNotification === true ? 1 : 2,
              notificationname: this.isNotification === true ? 'ENABLE' : 'DISABLE',
              'originallogoimage': this.orginalDocumentName,
              'uploadedlogoimage': this.documentName,
              'originalbgimage': this.orginalBgImageName,
              'uploadedbgimage': this.backgroundImgName
            });
            this.modalReference.close();
            this.notifier.notify('success', this.messageService.EDIT_SUCCESS);
          } else {
            this.isError = true;
            this.notifier.notify('error', this.respObject.message);
          }
        }, (err) => {
          this.isError = true;
          this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
      } else {
        this.isError = true;
        this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
      }
    } else {
      const data =
        {
          'id': this.selectedId,
          // 'parentid': Number(this.porgSelected),
          'mstorgnhierarchytypeid': Number(this.orgTypeSelected),
          'organizationname': this.orgName.trim(),
          'cityid': Number(this.selectCity),
          'countryid': Number(this.countrySelected),
          'code': this.code.trim(),
          'location': this.location.trim(),
          'timezoneid': zoneId,
          'reporttimezoneid': reportZoneId,
          'clientid': Number(this.clientSelected),
          'activationdate': this.messageService.dateConverter(this.activationDate1, 4),
          'logintypeid': Number(this.selectLoginType),
          'timeformatid': Number(this.selectTimeForm),
          'reporttimeformatid': Number(this.selectReportTime),
          'islocallogin': this.localLogin == true ? 2 : 1,
          'mfa': this.isOrgMfa === true ? 1 : 2,
          'notification' : this.isNotification === true ? 1 : 2,
        };

      // console.log('\n >>>>  ELSE PART ::  ' + JSON.stringify(data));

      if (!this.messageService.isBlankField(data)) {
        data['parentid'] = Number(this.porgSelected);
        data['originallogoimage'] = this.orginalDocumentName,
        data['uploadedlogoimage'] = this.documentName,
        data['originalbgimage'] = this.orginalBgImageName,
        data['uploadedbgimage'] = this.backgroundImgName
        this.rest.updateorganization(data).subscribe((res) => {
          this.respObject = res;
          if (this.respObject.success) {
            this.messageService.setTotalData(this.totalData);
            this.isError = false;
            this.messageService.sendAfterDelete(this.selectedId);
            this.dataLoaded = true;
            this.messageService.setRow({
              id: this.selectedId,
              clientname: this.clientSelectedName,
              clientid: this.clientSelected,
              organizationname: this.orgName,
              countryname: this.countryName,
              countryid: this.countrySelected,
              cityid: this.selectCity,
              cityname: this.cityName,
              parentid: Number(this.porgSelected),
              mstorgnhierarchytypeid: this.orgTypeSelected,
              parentname: this.parentOrgName,
              code: this.code,
              //pincode: this.pincode,
              location: this.location,
              mstorgnhierarchytypename: this.orgTypeName,
              timezonename: this.timeZoneSelected1,
              reporttimezonename: this.zoneSelected1,
              logintypename: this.loginName,
              timeformat: this.timeFromName,
              logintypeid: this.selectLoginType,
              timeformatid: this.selectTimeForm,
              reporttimeformatid: this.selectReportTime,
              reporttimeformat: this.reportTimeName,
              activationdate: this.messageService.dateConverter(this.activationDate1, 4),
              islocallogin: this.localLogin,
              mfa: this.isOrgMfa === true ? 1 : 2,
              mfaname: this.isOrgMfa === true ? 'ENABLE' : 'DISABLE',
              notification: this.isNotification === true ? 1 : 2,
              notificationname: this.isNotification === true ? 'ENABLE' : 'DISABLE',
              'originallogoimage': this.orginalDocumentName,
              'uploadedlogoimage': this.documentName,
              'originalbgimage': this.orginalBgImageName,
              'uploadedbgimage': this.backgroundImgName
            });
            this.modalReference.close();
            this.notifier.notify('success', this.messageService.EDIT_SUCCESS);
          } else {
            this.isError = true;
            this.notifier.notify('error', this.respObject.message);
          }
        }, (err) => {
          this.isError = true;
          this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
      } else {
        this.isError = true;
        this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
      }
    }

  }

  save() {
    let zoneId = 0;
    let reportZoneId = 0;
    for (let i = 0; i < this.timeZones.length; i++) {
      if (this.timeZones[i].zonename === this.timeZoneSelected) {
        zoneId = this.timeZones[i].id;
      }
    }

    for (let j = 0; j < this.zones.length; j++) {
      if (this.zones[j].zonename === this.zoneSelected) {
        reportZoneId = this.zones[j].id;
      }
    }
    // else{
    // console.log('zoneId====' + zoneId + '===' + this.timeZoneSelected);
    // console.log('reportZoneId====' + reportZoneId + '===' + this.zoneSelected);
    if (this.selectLoginType === 2) {
      this.localLogin = false;
    } else {
      const data =
        {
          'clientid': Number(this.clientSelected),
          'parentid': Number(this.porgSelected),
          'mstorgnhierarchytypeid': Number(this.orgTypeSelected),
          'organizationname': this.orgName.trim(),
          'cityid': Number(this.selectCity),
          'countryid': Number(this.countrySelected),
          'code': this.code.trim(),
          'location': this.location.trim(),
          'timezoneid': zoneId,
          'reporttimezoneid': reportZoneId,
          'activationdate': this.messageService.dateConverter(this.activationDate, 4),
          'logintypeid': Number(this.selectLoginType),
          'timeformatid': Number(this.selectTimeForm),
          'reporttimeformatid': Number(this.selectReportTime),
          'islocallogin': this.localLogin === true ? 2 : 1,
          'mfa': this.isOrgMfa === true ? 1 : 2,
          'notification' : this.isNotification === true ? 1 : 2,
        };
      // console.log("kkkkkkkkkk"+JSON.stringify(data));
      if (!this.messageService.isBlankField(data)) {
        data['parentid'] = Number(this.porgSelected);
        data['originallogoimage'] = this.orginalDocumentName,
        data['uploadedlogoimage'] = this.documentName,
        data['originalbgimage'] = this.orginalBgImageName,
        data['uploadedbgimage'] = this.backgroundImgName
        this.rest.addorganization(data).subscribe((res) => {
          this.respObject = res;
          if (this.respObject.success) {
            this.totalData = this.totalData + 1;
            this.messageService.setTotalData(this.totalData);
            this.isError = false;
            const id = this.respObject.details;
            this.messageService.setRow({
              id: id,
              clientname: this.clientName,
              clientid: this.clientSelected,
              organizationname: this.orgName,
              countryname: this.countryName,
              cityname: this.cityName,
              countryid: this.countrySelected,
              cityid: this.selectCity,
              parentid: Number(this.porgSelected),
              mstorgnhierarchytypeid: this.orgTypeSelected,
              parentname: this.parentOrgName,
              code: this.code,
              //pincode: this.pincode,
              location: this.location,
              mstorgnhierarchytypename: this.orgTypeName,
              timezonename: this.timeZoneSelected,
              reporttimezonename: this.zoneSelected,
              logintypename: this.loginName,
              logintypeid: this.selectLoginType,
              timeformat: this.timeFromName,
              timeformatid: this.selectTimeForm,
              reporttimeformatid: this.selectReportTime,
              reporttimeformat: this.reportTimeName,
              activationdate: this.messageService.dateConverter(this.activationDate, 4),
              islocallogin: this.localLogin,
              mfaname: this.isOrgMfa === true ? 'ENABLE' : 'DISABLE',
              mfa: this.isOrgMfa === true ? 1 : 2,
              notification: this.isNotification === true ? 1 : 2,
              notificationname: this.isNotification === true ? 'ENABLE' : 'DISABLE',
              'originallogoimage': this.orginalDocumentName,
              'uploadedlogoimage': this.documentName,
              'originalbgimage': this.orginalBgImageName,
              'uploadedbgimage': this.backgroundImgName
            });
            this.resetData();
            this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
          } else {
            this.isError = true;
            this.notifier.notify('error', this.respObject.message);
          }
        }, (err) => {
          this.isError = true;
          this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
      } else {
        this.isError = true;
        this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
      }
    }
  }


  getTableData() {
    if (!this.view) {
      this.notifier.notify('error', 'You do not have view permission');
    } else {
      this.getData({
        offset: this.messageService.offset, 
        limit: this.messageService.limit
      });
    }

  }

  getData(paginationObj) {
    const offset = paginationObj.offset;
    const limit = paginationObj.limit;
    this.dataLoaded = false;
    const data = {
      'clientid': this.clientId,
      'offset': offset,
      'limit': limit
    };
    this.rest.getorganization(data).subscribe((res) => {
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
      // console.log("\n Get Organization Data  ::  ", JSON.stringify(data));
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < data.length; i++) {
        if (data[i].islocallogin === 1) {
          data[i].islocallogin = false;
        } else {
          data[i].islocallogin = true;
        }
      }
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

   onFileComplete(data: any) {
    // console.log('file data==========' + JSON.stringify(data));
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

  onBgFileComplete(data: any) {
    // console.log('file data==========' + JSON.stringify(data));
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
      this.backgroundImgName = data.details.filename;
      this.documentPath = data.details.path;
      this.orginalBgImageName = data.details.originalfile;

    }
  }

  onBgFileError(msg: string) {
    this.notifier.notify('error', msg);
  }

  onUpload(data: any) {
    this.fileLoader = data.loader;
  }

  onRemove() {
    this.attachFile = this.attachFile - 1;
  }

  ngOnDestroy(): void {
    if (this.adminAuth) {
      this.adminAuth.unsubscribe();
    }
  }


}
