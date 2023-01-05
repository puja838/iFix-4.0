import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MessageService} from '../message.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {RestApiService} from '../rest-api.service';
import {Editors, FieldType, Filters, Formatters, OnEventArgs} from 'angular-slickgrid';
import {NotifierService} from 'angular-notifier';
import {Subscription} from 'rxjs';
import {ConfigService} from '../config.service';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-client-work-time',
  templateUrl: './client-work-time.component.html',
  styleUrls: ['./client-work-time.component.css']
})
export class ClientWorkTimeComponent implements OnInit, OnDestroy {
  searchTerm: FormControl = new FormControl();
  displayed = true;
  totalData = 0;
  show: boolean;
  selected: number;
  clientSelected: number;
  clients: any;
  isChecked = false;
  private respObject: any;
  private clientName: any;
  min: any;
  max: any;
  displayData: any;
  add: boolean;
  del: boolean;
  edit: boolean;
  view: boolean;
  isError = false;
  message: string;
  private notifier: NotifierService;
  pageSize: number;
  private adminAuth: Subscription;
  clientId: number;
  offset: number;
  dataLoaded: boolean;
  organaisation = [];
  orgSelected: any;
  private orgName: any;

  days = [];
  prefix: string;
  sunChck: boolean;
  sunHourStart: any;
  sunHourEnd: any;
  monChck: boolean;
  tueChck: boolean;
  monHourStart: any;
  monHourEnd: any;
  tueHourStart: Object;
  tueHourEnd: Object;
  wedChck: boolean;
  wedHourStart: any;
  wedHourEnd: any;
  thurChck: boolean;
  thurHourEnd: any;
  thurHourStart: any;
  friChck: boolean;
  friHourStart: any;
  friHourEnd: any;
  satChck: boolean;
  satHourStart: any;
  satHourEnd: any;
  hourChecked = false;
  logoName: string;
  attachMsg: string;
  attachment = [];
  fileUploadUrl: string;
  uploadButtonName = 'Upload File';
  logoUrl: string;

  hours = [];
  mins = [];
  sunHoursStart: any;
  sunMinsStart: any;
  sunHoursEnd: any;
  sunMinsEnd: any;
  monHoursStart: any;
  monMinsStart: any;
  monHoursEnd: any;
  monMinsEnd: any;
  tueHoursStart: any;
  tueMinsStart: any;
  tueHoursEnd: any;
  tueMinsEnd: any;
  wedHoursStart: any;
  wedMinsStart: any;
  wedHoursEnd: any;
  wedMinsEnd: any;
  thurHoursStart: any;
  thurMinsStart: any;
  thurHoursEnd: any;
  thurMinsEnd: any;
  friHoursStart: any;
  friMinsStart: any;
  friHoursEnd: any;
  friMinsEnd: any;
  satHoursStart: any;
  satMinsStart: any;
  satHoursEnd: any;
  satMinsEnd: any;
  hoursStart: any;
  minsStart: any;
  hoursEnd: any;
  minsEnd: any;
  dateStart = '';
  formData: any;
  @ViewChild('content1') private content1;
  private modalReference: NgbModalRef;
  uploadpath: string;
  zoneSelected: string;
  zones: any;
  isLoading = false;
  uploadUrl: string;
  timeObj = {};
  details = [];
  orgnId: number;
  baseFlag: boolean;
  notAdmin: boolean;
  clientOrgnId:any;
  constructor(private rest: RestApiService,
              private messageService: MessageService, private route: Router, private modalService: NgbModal,
              notifier: NotifierService, private config: ConfigService) {
    this.notifier = notifier;
    this.messageService.getCellChangeData().subscribe(item => {
      console.log('item==============' + JSON.stringify(item));
      switch (item.type) {
        case 'delete':
          // console.log('deleted');
          if (!this.del) {
            this.notifier.notify('error', 'You do not have delete permission');
          } else {
            if (confirm('Are you sure?')) {
              this.rest.deletedayofweek({id: item.id}).subscribe((res) => {
                this.respObject = res;
                // console.log(JSON.stringify(this.respObject));
                if (this.respObject.success) {
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
    // this.messageService.getUserAuth().subscribe(details => {
    //   // console.log(JSON.stringify(details));
    //   if (details.length > 0) {
    //     this.add = details[0].addFlag;
    //     this.del = details[0].deleteFlag;
    //     this.view = details[0].viewFlag;
    //     this.edit = details[0].editFlag;
    //   } else {
    //     this.add = false;
    //     this.del = false;
    //     this.view = false;
    //     this.edit = false;
    //   }
    // });
    // this.messageService.getSelectedItemData().subscribe(selectedTitles => {
    //   if (selectedTitles.length > 0) {
    //     this.show = true;
    //     this.selected = selectedTitles.length;
    //   } else {
    //     this.show = false;
    //   }
    // });
  }

  ngOnInit() {
    this.logoUrl = 'https://ifix-uat.s3.amazonaws.com/tcs_icc_poc/asset/tcs_logo_1597238668391.jpeg';
    this.fileUploadUrl = this.rest.apiRoot + '/updateFile';
    this.dataLoaded = true;
    this.pageSize = this.messageService.pageSize;
    this.displayData = {
      pageName: 'View Organization Business Hour',
      openModalButton: 'Add Organization Business Hour',
      breadcrumb: 'Organization Business Hour',
      folderName: 'All Organization Business Hour',
      tabName: 'Organization Business Hour'
    };
    this.sunChck = false;
    this.monChck = false;
    this.tueChck = false;
    this.wedChck = false;
    this.thurChck = false;
    this.friChck = false;
    this.satChck = false;
    for (let i = 0; i < 25; i++) {
      if (i <= 9) {
        this.hours.push('0' + i);
      } else {
        this.hours.push('' + i);
      }
    }

    for (let i = 0; i < 60; i++) {
      if (i <= 9) {
        this.mins.push('0' + i);
      } else {
        this.mins.push('' + i);
      }
    }
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
      //     console.log(args.dataContext);
      //     // this.zoneSelected = args.dataContext.zone;
      //     this.sunChck = args.dataContext.sunChck;
      //     this.monChck = args.dataContext.monChck;
      //     this.tueChck = args.dataContext.tueChck;
      //     this.wedChck = args.dataContext.wedChck;
      //     this.thurChck = args.dataContext.thurChck;
      //     this.friChck = args.dataContext.friChck;
      //     this.satChck = args.dataContext.satChck;
      //     this.uploadpath = args.dataContext.upload_path;
      //     this.logoName = args.dataContext.logo;
      //     this.logoUrl = this.config.UPLOAD_PATH_BASE + 'tcs_icc_poc/asset/' + this.logoName;
      //     // this.spocPerson = args.dataContext.spocPerson;
      //     if (this.sunChck) {
      //       this.sunHourStart = args.dataContext.sunHourStart.split(':');
      //       this.sunHoursStart = this.sunHourStart[0];
      //       this.sunMinsStart = this.sunHourStart[1];
      //       this.sunHourEnd = args.dataContext.sunHourEnd.split(':');
      //       this.sunHoursEnd = this.sunHourEnd[0];
      //       this.sunMinsEnd = this.sunHourEnd[1];
      //     } else {
      //       this.sunHoursStart = this.hours[0];
      //       this.sunMinsStart = this.mins[0];
      //       this.sunHoursEnd = this.hours[0];
      //       this.sunMinsEnd = this.mins[0];
      //     }
      //     if (this.monChck) {
      //       this.monHourStart = args.dataContext.monHourStart.split(':');
      //       this.monHoursStart = this.monHourStart[0];
      //       this.monMinsStart = this.monHourStart[1];
      //       this.monHourEnd = args.dataContext.monHourEnd.split(':');
      //       this.monHoursEnd = this.monHourEnd[0];
      //       this.monMinsEnd = this.monHourEnd[1];
      //     } else {
      //       this.monHoursStart = this.hours[0];
      //       this.monMinsStart = this.mins[0];
      //       this.monHoursEnd = this.hours[0];
      //       this.monMinsEnd = this.mins[0];
      //
      //     }
      //     if (this.tueChck) {
      //       this.tueHourStart = args.dataContext.tueHourStart.split(':');
      //       this.tueHoursStart = this.tueHourStart[0];
      //       this.tueMinsStart = this.tueHourStart[1];
      //       this.tueHourEnd = args.dataContext.tueHourEnd.split(':');
      //       this.tueHoursEnd = this.tueHourEnd[0];
      //       this.tueMinsEnd = this.tueHourEnd[1];
      //     } else {
      //       this.tueHoursStart = this.hours[0];
      //       this.tueMinsStart = this.mins[0];
      //       this.tueHoursEnd = this.hours[0];
      //       this.tueMinsEnd = this.mins[0];
      //
      //     }
      //     if (this.wedChck) {
      //       this.wedHourStart = args.dataContext.wedHourStart.split(':');
      //       this.wedHoursStart = this.wedHourStart[0];
      //       this.wedMinsStart = this.wedHourStart[1];
      //       this.wedHourEnd = args.dataContext.wedHourEnd.split(':');
      //       this.wedHoursEnd = this.wedHourEnd[0];
      //       this.wedMinsEnd = this.wedHourEnd[1];
      //     } else {
      //       this.wedHoursStart = this.hours[0];
      //       this.wedMinsStart = this.mins[0];
      //       this.wedHoursEnd = this.hours[0];
      //       this.wedMinsEnd = this.mins[0];
      //     }
      //     if (this.thurChck) {
      //       this.thurHourStart = args.dataContext.thurHourStart.split(':');
      //       this.thurHoursStart = this.thurHourStart[0];
      //       this.thurMinsStart = this.thurHourStart[1];
      //       this.thurHourEnd = args.dataContext.thurHourEnd.split(':');
      //       this.thurHoursEnd = this.thurHourEnd[0];
      //       this.thurMinsEnd = this.thurHourEnd[1];
      //     } else {
      //       this.thurHoursStart = this.hours[0];
      //       this.thurMinsStart = this.mins[0];
      //       this.thurHoursEnd = this.hours[0];
      //       this.thurMinsEnd = this.mins[0];
      //     }
      //     if (this.friChck) {
      //       this.friHourStart = args.dataContext.friHourStart.split(':');
      //       this.friHoursStart = this.friHourStart[0];
      //       this.friMinsStart = this.friHourStart[1];
      //       this.friHourEnd = args.dataContext.friHourEnd.split(':');
      //       this.friHoursEnd = this.friHourEnd[0];
      //       this.friMinsEnd = this.friHourEnd[1];
      //     } else {
      //       this.friHoursStart = this.hours[0];
      //       this.friMinsStart = this.mins[0];
      //       this.friHoursEnd = this.hours[0];
      //       this.friMinsEnd = this.mins[0];
      //     }
      //     if (this.satChck) {
      //       this.satHourStart = args.dataContext.satHourStart.split(':');
      //       this.satHoursStart = this.satHourStart[0];
      //       this.satMinsStart = this.satHourStart[1];
      //       this.satHourEnd = args.dataContext.satHourEnd.split(':');
      //       this.satHoursEnd = this.satHourEnd[0];
      //       this.satMinsEnd = this.satHourEnd[1];
      //     } else {
      //       this.satHoursStart = this.hours[0];
      //       this.satMinsStart = this.mins[0];
      //       this.satHoursEnd = this.hours[0];
      //       this.satMinsEnd = this.mins[0];
      //     }
      //     this.dateStart = args.dataContext.startDate;
      //     this.attachMsg = '';
      //     this.attachment = [];
      //     this.modalReference = this.modalService.open(this.content1, {});
      //     this.modalReference.result.then((result) => {
      //     }, (reason) => {
      //
      //     });
      //   }
      // },
      {
        id: 'client', name: 'Client Name', field: 'clientname', sortable: true, minWidth: 100, filterable: true
      },
      {
        id: 'orgName', name: 'Organization Name', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'day', name: 'Day', field: 'day', sortable: true, minWidth: 100, filterable: true
      },
      {
        id: 'startTime', name: ' Start Time', field: 'starttime', sortable: true, minWidth: 100, filterable: true
      },
      {
        id: 'endTime', name: ' End Time', field: 'endtime', sortable: true, minWidth: 100, filterable: true
      },
      {
        id: 'reportZone', name: 'Report Zone', field: 'report_zone', minWidth: 100, sortable: true, filterable: true
      }
    ];
    this.messageService.setColumnDefinitions(columnDefinitions);
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.baseFlag = this.messageService.baseFlag;
      this.orgnId = this.messageService.orgnId;
      this.edit = this.messageService.edit;
      this.del = this.messageService.del;
      this.onPageLoad();
    } else {
      this.adminAuth = this.messageService.getClientUserAuth().subscribe(details => {
        if (details.length > 0) {
          // this.add = details[0].addFlag;
          this.del = details[0].deleteFlag;
          // this.view = details[0].viewFlag;
          this.edit = details[0].editFlag;
          console.log('auth details====' + JSON.stringify(details));
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
    this.formData = {
      'clientId': 1,
      'createdBy': this.messageService.getUserId(),
      'type': 'type'
      // 'user_id': this.messageService.getUserId()
    };
    if (this.baseFlag) {
      this.notAdmin = false;
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
    } else {
      this.isError = true;
      this.notAdmin = true;
      this.clientSelected = this.clientId;
      this.clientOrgnId = this.orgnId;
      this.getOrganization(this.clientSelected, this.clientOrgnId);
    }
  }


  getOrganization(clientId, orgId) {
    const data = {
      clientid: Number(clientId) , 
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
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  get selectedOptions() {
    return this.days
      .filter(opt => opt.checked)
      .map(opt => opt.id);
  }

  openModal(content) {
    if (this.baseFlag) {
      this.clientSelected = 0;
      this.organaisation = [];
    }
    this.isError = false;
    this.reassignData();
    this.modalService.open(content).result.then((result) => {
    }, (reason) => {

    });
  }

  changeRouting(path: string) {
    this.messageService.changeRouting(path);
  }

  minuteConvert(timeInHour) {
    const time = timeInHour.split(':');
    const timeInMin = Number(time[0] * 60 * 60) + Number(time[1] * 60);
    return timeInMin;
  }

  createDateObject(dayType, startHour, EndHour) {
    this.timeObj = {
      dayofweekid: dayType,
      starttime: startHour,
      starttimeinteger: this.minuteConvert(startHour),
      endtimeinteger: this.minuteConvert(EndHour),
      endtime: EndHour,
      nextdayforward: 0
    };
    this.details.push(this.timeObj);
  }

  save() {
    if (this.sunChck) {
      const dayType = 1;
      this.sunHourStart = this.sunHoursStart + ':' + this.sunMinsStart;
      this.sunHourEnd = this.sunHoursEnd + ':' + this.sunMinsEnd;
      this.createDateObject(dayType, this.sunHourStart, this.sunHourEnd);
    } else {
      const dayType = 1;
      this.sunHourStart = '00:00';
      this.sunHourEnd = '00:00';
      this.createDateObject(dayType, this.sunHourStart, this.sunHourEnd);
    }
    if (this.monChck) {
      const dayType = 2;
      this.monHourStart = this.monHoursStart + ':' + this.monMinsStart;
      this.monHourEnd = this.monHoursEnd + ':' + this.monMinsEnd;
      this.createDateObject(dayType, this.monHourStart, this.monHourEnd);
    } else {
      const dayType = 2;
      this.monHourStart = '00:00';
      this.monHourEnd = '00:00';
      this.createDateObject(dayType, this.monHourStart, this.monHourEnd);
    }
    if (this.tueChck) {
      const dayType = 3;
      this.tueHourStart = this.tueHoursStart + ':' + this.tueMinsStart;
      this.tueHourEnd = this.tueHoursEnd + ':' + this.tueMinsEnd;
      this.createDateObject(dayType, this.tueHourStart, this.tueHourEnd);
    } else {
      const dayType = 3;
      this.tueHourStart = '00:00';
      this.tueHourEnd = '00:00';
      this.createDateObject(dayType, this.tueHourStart, this.tueHourEnd);
    }

    if (this.wedChck) {
      const dayType = 4;
      this.wedHourStart = this.wedHoursStart + ':' + this.wedMinsStart;
      this.wedHourEnd = this.wedHoursEnd + ':' + this.wedMinsEnd;
      this.createDateObject(dayType, this.wedHourStart, this.wedHourEnd);
    } else {
      const dayType = 4;
      this.wedHourStart = '00:00';
      this.wedHourEnd = '00:00';
      this.createDateObject(dayType, this.wedHourStart, this.wedHourEnd);
    }
    if (this.thurChck) {
      const dayType = 5;
      this.thurHourStart = this.thurHoursStart + ':' + this.thurMinsStart;
      this.thurHourEnd = this.thurHoursEnd + ':' + this.thurMinsEnd;
      this.createDateObject(dayType, this.thurHourStart, this.thurHourEnd);
    } else {
      const dayType = 5;
      this.thurHourStart = '00:00';
      this.thurHourEnd = '00:00';
      this.createDateObject(dayType, this.thurHourStart, this.thurHourEnd);
    }
    if (this.friChck) {
      const dayType = 6;
      this.friHourStart = this.friHoursStart + ':' + this.friMinsStart;
      this.friHourEnd = this.friHoursEnd + ':' + this.friMinsEnd;
      this.createDateObject(dayType, this.friHourStart, this.friHourEnd);
    } else {
      const dayType = 6;
      this.friHourStart = '00:00';
      this.friHourEnd = '00:00';
      this.createDateObject(dayType, this.friHourStart, this.friHourEnd);
    }
    if (this.satChck) {
      const dayType = 7;
      this.satHourStart = this.satHoursStart + ':' + this.satMinsStart;
      this.satHourEnd = this.satHoursEnd + ':' + this.satMinsEnd;
      this.createDateObject(dayType, this.satHourStart, this.satHourEnd);
    } else {
      const dayType = 7;
      this.satHourStart = '00:00';
      this.satHourEnd = '00:00';
      this.createDateObject(dayType, this.satHourStart, this.satHourEnd);
    }
    // let zoneId = 0;
    // for (let i = 0; i < this.zones.length; i++) {
    //   if (this.zones[i].name === this.zoneSelected) {
    //     zoneId = this.zones[i].id;
    //   }
    // }
    console.log('save data=', JSON.stringify(this.details));
    const data = {
      clientid: Number(this.clientSelected),
      mstorgnhirarchyid: Number(this.orgSelected),
      details: this.details
    };
    if (!this.messageService.isBlankField(data)) {
      this.rest.adddayofweek(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.isError = false;
          // const id = this.respObject.clientId;
          this.getTableData();
          this.reassignData();
          this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
        } else {
          this.isError = true;
          this.notifier.notify('error', this.respObject.errorMessage);
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


  onClientChange(selectedIndex: any) {
    this.clientName = this.clients[selectedIndex].name;
    this.clientOrgnId = this.clients[selectedIndex].orgnid;
    console.log(">>>>>>",this.clientSelected, this.clientOrgnId)
    this.getOrganization(this.clientSelected, this.clientOrgnId);
  }

  ngOnDestroy(): void {
    if (this.adminAuth) {
      this.adminAuth.unsubscribe();
    }
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
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.orgnId
      // 'clientid': 0,
      // 'mstorgnhirarchyid': 0
    };
    console.log('data for grid====' + this.clientId + '=============' + this.orgnId);
    this.rest.getdayofweek(data).subscribe((res) => {
      this.respObject = res;
      this.executeResponse(this.respObject, offset);
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  reassignData() {
    this.dateStart = '';
    this.sunChck = false;
    this.monChck = false;
    this.tueChck = false;
    this.wedChck = false;
    this.thurChck = false;
    this.friChck = false;
    this.satChck = false;
    this.hoursStart = this.hours[0];
    this.hoursEnd = this.hours[0];
    this.minsStart = this.mins[0];
    this.minsEnd = this.mins[0];


    this.sunHourStart = '00:00';
    this.sunHourEnd = '00:00';
    this.monHourStart = '00:00';
    this.monHourEnd = '00:00';
    this.tueHourStart = '00:00';
    this.tueHourEnd = '00:00';
    this.wedHourStart = '00:00';
    this.wedHourEnd = '00:00';
    this.thurHourStart = '00:00';
    this.thurHourEnd = '00:00';
    this.friHourStart = '00:00';
    this.friHourEnd = '00:00';
    this.satHourStart = '00:00';
    this.satHourEnd = '00:00';


    this.sunHoursStart = this.hours[0];
    this.sunMinsStart = this.mins[0];
    this.sunHoursEnd = this.hours[0];
    this.sunMinsEnd = this.mins[0];
    this.monHoursStart = this.hours[0];
    this.monMinsStart = this.mins[0];
    this.monHoursEnd = this.hours[0];
    this.monMinsEnd = this.mins[0];
    this.tueHoursStart = this.hours[0];
    this.tueMinsStart = this.mins[0];
    this.tueHoursEnd = this.hours[0];
    this.tueMinsEnd = this.mins[0];
    this.wedHoursStart = this.hours[0];
    this.wedMinsStart = this.mins[0];
    this.wedHoursEnd = this.hours[0];
    this.wedMinsEnd = this.mins[0];
    this.thurHoursStart = this.hours[0];
    this.thurMinsStart = this.mins[0];
    this.thurHoursEnd = this.hours[0];
    this.thurMinsEnd = this.mins[0];
    this.friHoursStart = this.hours[0];
    this.friMinsStart = this.mins[0];
    this.friHoursEnd = this.hours[0];
    this.friMinsEnd = this.mins[0];
    this.satHoursStart = this.hours[0];
    this.satMinsStart = this.mins[0];
    this.satHoursEnd = this.hours[0];
    this.satMinsEnd = this.mins[0];
    this.hourChecked = false;
    this.attachMsg = '';
    this.days = [{id: 0, day: 'Sun', checked: false}, {id: 1, day: 'Mon', checked: false}, {id: 2, day: 'Tue', checked: false}, {
      id: 3,
      day: 'Wed',
      checked: false
    }, {id: 4, day: 'Thur', checked: false}, {
      id: 5,
      day: 'Fri', checked: false
    }, {id: 6, day: 'Sat', checked: false}];
    this.orgSelected = 0;
    this.uploadUrl = ''
    this.zoneSelected = '';
  }

  greaterfunc(data) {
    if (this.sunChck === true && (data.sunHourStart >= data.sunHourEnd)) {
      return false;
    } else if (this.monChck === true && (data.monHourStart >= data.monHourEnd)) {
      return false;
    } else if (this.tueChck === true && (data.tueHourStart >= data.tueHourEnd)) {
      return false;
    } else if (this.wedChck === true && (data.wedHourStart >= data.wedHourEnd)) {
      return false;
    } else if (this.thurChck === true && (data.thurHourStart >= data.thurHourEnd)) {
      return false;
    } else if (this.satChck === true && (data.satHourStart >= data.satHourEnd)) {
      return false;
    } else if (this.friChck === true && (data.friHourStart >= data.friHourEnd)) {
      return false;
    } else {
      return true;
    }
  }

  onFileComplete(data: any) {
    // console.log('file data==========' + JSON.stringify(data));
    this.logoName = data.changedName;
    if (data.success) {
      this.attachment.push({originalName: data.fileName, fileName: data.changedName});
      if (this.attachment.length > 1) {
        this.attachMsg = this.attachment.length + ' files uploaded successfully';
      } else {
        this.attachMsg = this.attachment.length + ' file uploaded successfully';
      }
    }
  }

  onFileError(msg: string) {
    this.notifier.notify('error', msg);
  }

  executeResponse(respObject, offset) {
    if (respObject.success) {
      this.dataLoaded = true;
      if (offset === 0) {
        this.totalData = respObject.details.total;
      }
      const data = respObject.details.values;
      for (let i = 0; i < data.length; i++) {
        if (data[i].dayofweekid === 1) {
          data[i]['day'] = 'Sunday';
        } else if (data[i].dayofweekid === 2) {
          data[i]['day'] = 'Monday';
        } else if (data[i].dayofweekid === 3) {
          data[i]['day'] = 'Tuesday';
        } else if (data[i].dayofweekid === 4) {
          data[i]['day'] = 'Wednesday';
        } else if (data[i].dayofweekid === 5) {
          data[i]['day'] = 'Thursday';
        } else if (data[i].dayofweekid === 6) {
          data[i]['day'] = 'Friday';
        } else if (data[i].dayofweekid === 7) {
          data[i]['day'] = 'Saturday';
        }
      }
      this.messageService.setTotalData(this.totalData);
      this.messageService.setGridData(data);
    } else {
      this.notifier.notify('error', respObject.message);
    }
  }

  hourChange() {
    this.hourChecked = !this.hourChecked;
  }

  onPageSizeChange(value: any) {
    this.pageSize = value;
    this.getData({
      offset: this.messageService.offset, 
      limit: this.messageService.limit
    });
  }
}
