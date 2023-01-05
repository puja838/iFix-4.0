import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {MessageService} from '../message.service';
import {ValidateService} from '../validate.service';
import {NgbDateStruct, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {CommonSlickgridComponent} from '../common-slickgrid/common-slickgrid.component';
import {CustomInputEditor} from '../custom-inputEditor';
import {RestApiService} from '../rest-api.service';
import {Editors, FieldType, Filters, Formatters, OnEventArgs} from 'angular-slickgrid';
import {NotifierService} from 'angular-notifier';
import {FormControl} from '@angular/forms';
import {Subscription} from 'rxjs';
import {THIS_EXPR} from '@angular/compiler/src/output/output_ast';
import {ConfigService} from '../config.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit, OnDestroy {
  searchTerm: FormControl = new FormControl();
  displayed = true;
  name: string;
  keyPerson: string;
  keyEmail: string;
  keyMobile: string;
  cliAddr: string;
  dateStart = '';
  hourStart: any;
  hourEnd: any;
  dateEnd = '';
  spocPerson: string;
  spocEmail: string;
  spocMobile: string;
  totalData = 0;
  show: boolean;
  selected: number;
  zoneSelected: string;
  gridData = [];
  zones: any;
  slideChecked = false;
  days = [];
  prefix: string;
  hourChecked = false;
  private respObject: any;
  displayData: any;
  add: boolean;
  del: boolean;
  edit: boolean;
  view: boolean;
  isError = false;
  errorMessage: string;
  private notifier: NotifierService;
  isLoading = false;
  personChecked = false;
  @ViewChild('content1') private content1;
  private modalReference: NgbModalRef;
  private selectedId: number;
  collectionSize: number;
  pageSize: number;
  clientId: number;
  clientCode: string;
  private baseFlag: any;
  private adminAuth: Subscription;
  dataLoaded: boolean;
  orgnId: number;
  clientSelected: any;
  clients: any;
  code: string;
  organaisation = [];
  orgSelected: any;
  description: string;


  constructor(private _rest: RestApiService, private messageService: MessageService, private route: Router,
              private modalService: NgbModal, notifier: NotifierService,
              private validateService: ValidateService,
              private config: ConfigService) {
    this.notifier = notifier;

    //   this.messageService.getUserAuth().subscribe(details => {
    //       // console.log(JSON.stringify(details));
    //       if (details.length > 0) {
    //           this.add = details[0].addFlag;
    //           this.del = details[0].deleteFlag;
    //           this.view = details[0].viewFlag;
    //           this.edit = details[0].editFlag;
    //       } else {
    //           this.add = false;
    //           this.del = false;
    //           this.view = false;
    //           this.edit = false;
    //       }
    //   });
    //   this.messageService.getSelectedItemData().subscribe(selectedTitles => {
    //       if (selectedTitles.length > 0) {
    //           this.show = true;
    //           this.selected = selectedTitles.length;
    //       } else {
    //           this.show = false;
    //       }
    //   });
    this.searchTerm.valueChanges.subscribe(
      zone => {
        this.isLoading = true;
        if (zone !== undefined) {
          zone = zone.toUpperCase();
          this._rest.searchzone({Zonename: zone}).subscribe((res1) => {
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
  }

  ngOnInit() {
    this.add = true;
    this.del = true;
    this.edit = true;
    this.view = true;
    this.dataLoaded = true;
    this.pageSize = this.messageService.pageSize;
    this.displayData = {
      pageName: 'Maintain Client',
      openModalButton: 'Create Client',
      breadcrumb: 'ClientCreation',
      folderName: 'All Clients',
      tabName: 'Clients'
    };
    const columnDefinitions = [
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
          this.selectedId = args.dataContext.id;
          this.name = args.dataContext.name;
          this.clientCode = args.dataContext.code;
          // this.cliAddr = args.dataContext.cliAddr;
          this.keyPerson = args.dataContext.keyperson;
          // this.cliAddr = args.dataContext.cliAddr;
          this.keyEmail = args.dataContext.keyemail;
          this.keyMobile = args.dataContext.keymobile;
          this.spocPerson = args.dataContext.spocname;
          this.spocEmail = args.dataContext.spocemail;
          this.spocMobile = args.dataContext.spocnumber;
          this.description = args.dataContext.description;
          this.modalReference = this.modalService.open(this.content1, {});
          this.modalReference.result.then((result) => {
          }, (reason) => {

          });
        }
      },
      {
        id: 'name', name: 'Client Name', field: 'name', minWidth: 100, sortable: true, filterable: true
      }, {
        id: 'clientcode', name: 'Client Code', field: 'code', minWidth: 100, sortable: true, filterable: true
      },
      // {
      //   id: 'cliAddr', name: 'Client Address', field: 'cliAddr', minWidth: 50, sortable: true, filterable: true
      // },
      {
        id: 'description', name: 'Description', field: 'description', minWidth: 40, sortable: true, filterable: true
      },
      {
        id: 'keyPerson', name: 'Key Person', field: 'keyperson', minWidth: 40, sortable: true, filterable: true
      },
      {
        id: 'keyEmail', name: 'Key Person Email', field: 'keyemail', minWidth: 50, sortable: true, filterable: true
      },
      {
        id: 'keyMobile', name: 'Key Person Mobile', field: 'keymobile', minWidth: 50, sortable: true, filterable: true
      },
      {
        id: 'spocName', name: 'Spoc Name', field: 'spocname', minWidth: 50, sortable: true, filterable: true
      },
      {
        id: 'spocMobile', name: 'Spoc Mobile', field: 'spocnumber', minWidth: 50, sortable: true, filterable: true
      },
      {
        id: 'spocEmail', name: 'Spoc Email', field: 'spocemail', minWidth: 50, sortable: true, filterable: true
      },
    ];
    this.messageService.setColumnDefinitions(columnDefinitions);
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.baseFlag = this.messageService.baseFlag;
      this.orgnId = this.messageService.orgnId;
      this.onPageLoad();
    } else {
      this.adminAuth = this.messageService.getUserAuth().subscribe(details => {
        if (details.length > 0) {
          // this.add = details[0].addFlag;
          // this.del = details[0].deleteFlag;
          // this.view = details[0].viewFlag;
          // this.edit = details[0].editFlag;
          this.clientId = details[0].clientid;
          this.orgnId = details[0].mstorgnhirarchyid;
          this.baseFlag = details[0].baseFlag;
          this.onPageLoad();
        }
      });
    }
  }

  onPageLoad() {
    // this.getTableData();
  }

  get selectedOptions() {
    return this.days
      .filter(opt => opt.checked)
      .map(opt => opt.id);
  }

  openModal(content) {
    if (!this.add) {
      this.notifier.notify('error', 'You do not have add permission');
    } else {
      this.isError = false;
      this.reassignData();
      this.modalService.open(content, {}).result.then((result) => {
      }, (reason) => {

      });
    }
  }


  getDetails() {
    for (let i = 0; i < this.clients.length; i++) {
      if (this.clients[i].NAME === this.clientSelected) {
        this.code = this.clients[i].clientCode;
      }
    }
  }


  onOrgChange(selectedIndex: any) {

  }


  changeRouting(path: string) {
    this.messageService.changeRouting(path);
  }

  reassignData() {
    this.name = '';
    this.keyPerson = '';
    this.clientCode = '';
    this.keyEmail = '';
    this.keyMobile = '';
    this.cliAddr = '';
    this.spocPerson = '';
    this.spocEmail = '';
    this.spocMobile = '';
    this.slideChecked = false;
    this.description = '';
    this.hourChecked = false;
    this.personChecked = false;
    this.zoneSelected = '';
  }


  onFileError(msg: string) {
    this.notifier.notify('error', msg);
  }

  save() {
    // let zoneId = 0;
    // for (let i = 0; i < this.zones.length; i++) {
    //     if (this.zones[i].name === this.zoneSelected) {
    //         zoneId = this.zones[i].id;
    //     }
    // }
    const data = {
      'code': this.clientCode,
      'name': this.name,
      'description': this.description,
      'keyperson': this.keyPerson,
      'keyemail': this.keyEmail,
      'keymobile': this.keyMobile,
      'baseflag': '0',
      'spocname': this.spocPerson,
      'spocemail': this.spocEmail,
      'spocnumber': this.spocMobile,
    };
    // console.log('save data=', JSON.stringify(data));
    // console.log('blank field check', !this.messageService.isBlankField(data));
    // console.log('select options=', this.selectedOptions.length);
    // console.log('hourchecked', this.hourChecked);

    if (!this.messageService.isBlankField(data)) {
      if (this.validateService.ValidateEmail(data.keyemail) && this.validateService.ValidateEmail(data.spocemail)
        && this.validateService.ValidatePhoneno(data.keymobile) && this.validateService.ValidatePhoneno(data.spocnumber)) {

        this._rest.createclient(data).subscribe((res) => {
          // console.log("update done")
          this.respObject = res;
          if (this.respObject.success) {
            this.isError = false;
            const id = this.respObject.details;
            this.messageService.setRow({id: id, name: this.name, code: this.clientCode,
              description: this.description, keyperson: this.keyPerson, keyemail: this.keyEmail, keymobile: this.keyMobile,
              spocname: this.spocPerson, spocnumber: this.spocMobile, spocemail: this.spocEmail});
            this.reassignData();
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
        this.notifier.notify('error', this.validateService.EmailOrPhoneFormatError);
      }
    } else {
      this.isError = true;
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }
  }


  update() {
    const data = {
      id: this.selectedId,
      'code': this.clientCode,
      'name': this.name,
      'description': this.description,
      'keyperson': this.keyPerson,
      'keyemail': this.keyEmail,
      'keymobile': this.keyMobile,
      'baseflag': '0',
      'spocname': this.spocPerson,
      'spocemail': this.spocEmail,
      'spocnumber': this.spocMobile,
    };
    console.log('save data==================>>>>>', JSON.stringify(data));

    if (!this.messageService.isBlankField(data)) {
      if (this.validateService.ValidateEmail(data.keyemail) && this.validateService.ValidateEmail(data.spocemail)
        && this.validateService.ValidatePhoneno(data.keymobile) && this.validateService.ValidatePhoneno(data.spocnumber)) {
        this._rest.updateclient(data).subscribe((res) => {
          // console.log('save data==================>>>>>', JSON.stringify(data));
          this.respObject = res;
          if (this.respObject.success) {
            this.isError = false;
            this.messageService.sendAfterDelete(this.selectedId);
            this.dataLoaded = true;
            this.messageService.setRow({id: this.selectedId, name: this.name, code: this.clientCode,
              description: this.description, keyperson: this.keyPerson, keyemail: this.keyEmail, keymobile: this.keyMobile,
              spocname: this.spocPerson, spocnumber: this.spocMobile, spocemail: this.spocEmail});
            // this.reassignData();
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
        this.notifier.notify('error', this.validateService.EmailOrPhoneFormatError);
      }
    } else {
      this.isError = true;
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);

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
      'offset': offset,
      'limit': limit
    };
    this._rest.getclient(data).subscribe((res) => {
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
      this.notifier.notify('error', respObject.errorMessage);
    }
  }

  onPageSizeChange(value: any) {
    this.pageSize = value;
    this.getData({
      offset: this.messageService.offset, 
      limit: this.messageService.limit
    });
  }

  slideChange() {
    this.slideChecked = !this.slideChecked;
  }

  hourChange() {
    this.hourChecked = !this.hourChecked;
  }


  keyPersonChecked() {
    this.personChecked = !this.personChecked;
    if (this.personChecked) {
      this.spocPerson = this.keyPerson;
      this.spocEmail = this.keyEmail;
      this.spocMobile = this.keyMobile;
    } else {
      this.spocPerson = '';
      this.spocEmail = '';
      this.spocMobile = '';
    }
  }

  ngOnDestroy(): void {
    if (this.adminAuth) {
      this.adminAuth.unsubscribe();
    }
  }
}



