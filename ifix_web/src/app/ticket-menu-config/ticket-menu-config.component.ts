import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MessageService} from '../message.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {CustomInputEditor} from '../custom-inputEditor';
import {RestApiService} from '../rest-api.service';
import {Filters, Formatters, OnEventArgs} from 'angular-slickgrid';
import {NotifierService} from 'angular-notifier';
import {Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';
import {ConfigService} from '../config.service';


@Component({
  selector: 'app-ticket-menu-config',
  templateUrl: './ticket-menu-config.component.html',
  styleUrls: ['./ticket-menu-config.component.css']
})
export class TicketMenuConfigComponent implements OnInit, OnDestroy {
  newDescription: any;
  displayed = true;
  moduleName: string;
  description: string;
  totalData = 0;
  show: boolean;
  selected: number;
  respObject: any;
  addUpdate: string[] = ['Add', 'Update'];
  editValue: any;
  color: any;
  sequenceNumber: number;
  managementValue: any;
  fileUploadUrl: string;
  uploadButtonName = 'Upload File';
  formdata: any;
  MAX_FILE_UPLOAD = 10;
  hideAttachment: boolean;
  attachment = [];
  attachMsg: string;
  changedName: any;
  submit1: boolean;
  submit2: boolean;
  private fieldName: any;
  fieldValues: any;
  fieldValueSelected: any;
  private fieldValueName: any;
  fieldloader: boolean;
  add: boolean;
  del: boolean;
  edit: boolean;
  view: boolean;
  displayData: any;
  isError = false;
  errorMessage: string;
  pageSize: number;
  clientId: number;
  clients: any;
  fields = [];
  fieldSelected: number;
  clientSelected: number;
  private baseFlag: any;
  private adminAuth: Subscription;
  selectField: any;
  private notifier: NotifierService;
  offset: number;
  hiddenRadio: boolean;
  hiddenRadio1: boolean;
  hideDescName: boolean;
  dataLoaded: boolean;
  colorpicker: boolean;
  sequence: boolean;
  management: boolean;
  file: boolean;
  showSearch = false;
  isLoading = false;
  searchData: FormControl = new FormControl();
  funSelected: any;
  func: any;
  funName: string;
  hiddencolor = false;
  @ViewChild('content1') private content1;
  private modalReference: NgbModalRef;
  imgUrl: any;
  selectedId: any;
  organaisation = [];
  orgSelected: any;
  private orgName: string;
  message: string;
  totalPage: number;
  orgnId: number;
  clientName: string;
  clientOrgnId: any;
  documentName: any;
  documentPath: any;
  orginalDocumentName: any;
  isNew: any;
  isColor: any;
  iscatalog: any;
  hiddenmenu: boolean;


  constructor(private rest: RestApiService, private messageService: MessageService,
              private route: Router, private modalService: NgbModal, notifier: NotifierService, private config: ConfigService) {
    this.notifier = notifier;
    this.messageService.getCellChangeData().subscribe(item => {
      // // console.log(item);
      switch (item.type) {
        case 'delete':
          // // console.log('deleted');
          if (!this.del) {
            this.notifier.notify('error', 'You do not have delete permission');
          } else {
            if (confirm('Are you sure?')) {
              this.rest.deletefunctionmapping({id: item.id}).subscribe((res) => {
                this.respObject = res;
                // // console.log(JSON.stringify(this.respObject));
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
    this.add = true;
    this.del = true;
    this.edit = true;
    this.view = true;
    this.totalPage = 0;
    this.fileUploadUrl = this.rest.apiRoot + '/fileupload';
    this.dataLoaded = true;
    this.pageSize = this.messageService.pageSize;
    this.fieldloader = true;
    this.hiddenRadio = false;
    this.colorpicker = false;
    this.newDescription = '';
    this.editValue = '';
    this.displayData = {
      pageName: 'Maintain Menu Configuration',
      openModalButton: 'Add Menu Configuration',
      breadcrumb: 'Menu Configuration',
      folderName: 'All Menu Configuration',
      tabName: 'Menu Configuration'
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
        id: 'clientName', name: 'Client', field: 'Clientname', sortable: true, filterable: true, minWidth: 200
      },
      {
        id: 'organization', name: 'Organization', field: 'orgname', sortable: true, filterable: true, minWidth: 200
      },
      {
        id: 'funcDescription', name: 'Function Description', field: 'description', sortable: true, filterable: true, minWidth: 200
      },
      {
        id: 'funcionalityName', name: 'Functionality Name', field: 'Funcname', sortable: true, filterable: true, minWidth: 200
      },
      {
        id: 'colorcode', name: 'Color', field: 'colorcode', sortable: true, filterable: true, minWidth: 200
      },
      {
        id: 'image', name: 'Image', field: 'image', sortable: true, filterable: true, minWidth: 200
      },
      {
        id: 'seqno', name: 'Sequence', field: 'seqno', sortable: true, filterable: true, minWidth: 70
      },
      {
        id: 'ismanegerialview', name: 'Workspace', field: 'ismanegerialview', sortable: true, filterable: true, minWidth: 200
      },

      {
        id: 'iscatalog',
        name: 'Catalog Menu',
        field: 'iscatalog',
        sortable: true,
        filterable: true,
        formatter: Formatters.checkmark,
        filter: {
          collection: [{value: '', label: 'All'}, {value: true, label: 'True'}, {value: false, label: 'False'}],
          model: Filters.singleSelect,

          filterOptions: {
            autoDropWidth: true
          },
        },
        minWidth: 40
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

    // // this.messageService.setColumnDefinitions(columnDefinitions);
    this.rest.getallclientnames().subscribe((res: any) => {
      if (res.success) {
        res.details.unshift({id: 0, name: 'Select Client'});
        this.clients = res.details;
        this.clientSelected = 0;
      } else {
        this.isError = true;
        this.notifier.notify('error', res.message);
      }
    }, (err) => {

    });
    this.rest.getfunctionality().subscribe((res: any) => {
      if (res.success) {
        this.isError = false;
        res.details.unshift({id: 0, name: 'Select Additional Field'});
        this.fields = res.details;
        this.fieldSelected = 0;
      } else {
        this.isError = true;
        this.notifier.notify('error', res.errorMessage);
      }
    }, (err) => {

    });
  }

  onPageLoad() {
    // this.formdata = {
    //     'clientId': this.clientId,
    //    'createdBy': this.messageService.getUserId(),
    //     'type': 'type'
    // };
    // this.getTableData();
    //console.log(this.clientId,this.orgnId)
  }

  onFieldChange(selectedIndex: any) {
    this.fieldName = this.fields[selectedIndex].name;
    // console.log(this.fieldSelected);
    if (Number(this.fieldSelected) > 0) {
      this.hiddenRadio = true;
    } else {
      this.hiddenRadio = false;
    }
    if (Number(this.fieldSelected) === 1) {
      // this.colorpicker = true;
      this.management = true;
      this.sequence = true;
      this.hiddenRadio1 = true;
      this.hiddenmenu = true;
      this.hiddencolor = true;
      this.isNew = '1';
      this.managementValue = '1';
      this.iscatalog = '1';
      // this.file = true;
      // this.hideDescName = true;
    } else {
      this.colorpicker = false;
      this.management = false;
      this.sequence = false;
      this.hiddenRadio1 = false;
      this.hiddenmenu = false;
      this.file = false;
      this.hiddencolor = false;

      // this.hideDescName = false;
    }

  }

  addColorPicker() {
    this.colorpicker = true;
    this.file = false;
  }

  addImage() {
    this.colorpicker = false;
    this.file = true;
  }

  openModal(content) {
    if (!this.add) {
      this.notifier.notify('error', 'You do not have add permission');
    } else {
      this.reset();
      this.modalService.open(content, {size: ''}).result.then((result) => {
      }, (reason) => {

      });
    }
  }

  getDetails() {
    for (let i = 0; i < this.func.length; i++) {
      if (this.func[i].funcDescription === this.funSelected) {
        this.funName = this.func[i].funcionalityName;
      }
    }
  }

  changeRouting(path: string) {
    this.messageService.changeRouting(path);
  }

  save() {
    const data = {
      clientid: Number(this.clientSelected),
      mstorgnhirarchyid: Number(this.orgSelected),
      funcid: Number(this.fieldSelected),
      description: this.newDescription,
    };
    if (!this.fieldloader) {
      data['funcdescid'] = Number(this.selectField);
    }
    if (Number(this.fieldSelected) === 1) {
      if (this.iscatalog === '1') {
        data['ismanegerialview'] = Number(this.managementValue);
      }

    }
    if (!this.messageService.isBlankField(data)) {
      if (Number(this.fieldSelected) === 1) {
        data['iscatalog'] = this.iscatalog === '1' ? 0 : 1;
      }
      data['colorcode'] = this.color;
      data['image'] = this.changedName;
      // data['seqno'] = Number(this.sequenceNumber);

      // console.log('data=======' + JSON.stringify(data));

      this.rest.insertfuncmapping(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          const id = this.respObject.details;
          this.totalData = this.totalData + 1;
          this.messageService.setTotalData(this.totalData);
          // this.messageService.setRow({
          //   id: id, Clientname: this.clientName, orgname: this.orgName,
          //   description: this.newDescription, Funcname: this.fieldName, seqno: this.sequenceNumber,
          //   ismanegerialview: this.managementValue === '1' ? true: false
          // });
          this.reset();
          this.getTableData();
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

  reset() {
    this.isError = false;
    this.moduleName = '';
    this.description = '';
    this.hiddenRadio = false;
    this.color = '';
    this.sequenceNumber = 0;
    this.attachMsg = '';
    this.attachment = [];
    this.newDescription = '';
    this.managementValue = 0;
    this.changedName = '';
    this.fieldSelected = 0;
    this.clientSelected = 0;
    this.orgSelected = 0;
    this.organaisation = [];
    this.selectField = 0;
    this.hiddencolor = false;
    this.colorpicker = false;
    this.hiddenRadio1 = false;
    this.hiddenmenu = false;
    this.fieldloader = true;
    this.file = false;
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

  adddescription() {
    this.fieldloader = true;
    this.hideDescName = true;
    this.attachMsg = '';
    this.attachment = [];
    this.sequenceNumber = 0;
    this.newDescription = '';
  }

  changedescription() {
    this.fieldloader = false;
    this.newDescription = '';
    this.attachMsg = '';
    this.attachment = [];
    this.changedName = '';
    this.sequenceNumber = 0;
    // console.log(this.clientId, this.orgnId);
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgnId),
      funcid: Number(this.fieldSelected),
    };
    if (!this.messageService.isBlankField(data)) {
      this.rest.getfuncmappingbytype(data).subscribe((res: any) => {
        if (res.success) {
          this.hiddenRadio = true;
          this.isError = false;
          res.details.unshift({funcdescid: 0, description: 'Select Field Value'});
          this.fieldValues = res.details;
          this.selectField = 0;
        } else {
          // this.isError = true;
          // this.notifier.notify('error', res.errorMessage);
        }
      }, (err) => {
        // this.isError = true;
        // this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    } else {
      this.isError = true;
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }
  }

  valueFunc(temp) {
    // console.log(this.fieldValues[temp].name);
    this.newDescription = this.fieldValues[temp].description;
    if (this.fieldValues[temp].colorcode !== '') {
      this.color = this.fieldValues[temp].colorcode;
      this.colorpicker = true;
    }
    if (this.fieldValues[temp].image !== '') {
      this.file = true;
      this.changedName = this.fieldValues[temp].image;
      //this.attachMsg =  this.fieldValues[temp].image;
    }
    this.iscatalog = Number(this.fieldValues[temp].iscatalog) === 0 ? '1' : '2';
    if (this.iscatalog === '1') {
      this.hiddenRadio1 = true;
    } else {
      this.hiddenRadio1 = false;
    }
    this.sequenceNumber = this.fieldValues[temp].seqno;
    this.managementValue = Number(this.fieldValues[temp].ismanegerialview) === 1 ? '1' : '2';
    console.log(this.isNew);
  }

  onButtonChange(value) {
    // console.log(value);
  }

  getData(paginationObj) {
    const offset = paginationObj.offset;
    const limit = paginationObj.limit;
    this.dataLoaded = false;

    const data = {
      'offset': offset,
      'limit': limit,
    };
    // console.log('data for grid====' + JSON.stringify(data));
    this.rest.getfuncmappingdetails(data).subscribe((res) => {
      this.respObject = res;
      for (let i = 0; i < this.respObject.details.values.length; i++) {
        if (this.respObject.details.values[i].ismanegerialview === 1) {
          this.respObject.details.values[i].ismanegerialview = 'My Workspace';
        } else if (this.respObject.details.values[i].ismanegerialview === 2) {
          this.respObject.details.values[i].ismanegerialview = 'Team Workspace';
        } else {
          this.respObject.details.values[i].ismanegerialview = 'Opened By / Requested By';
        }
      }
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

  onFileError(msg: string) {
    console.log('>>>>>>', msg);
    this.notifier.notify('error', msg);
  }

  onFileComplete(data: any) {
    console.log('file data==========' + JSON.stringify(data));
    //this.changedName = data.changedName;
    if (data.success) {
      this.attachment.push({originalName: data.fileName, fileName: data.changedName});
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

  clientIdSpecific(selectedIndex: any) {
    this.clientName = this.clients[selectedIndex].name;
    this.clientOrgnId = this.clients[selectedIndex].orgnid;
    const data = {
      clientid: Number(this.clientSelected),
      // mstorgnhirarchyid: Number(this.clientOrgnId)
    };
    this.rest.getorganizationclientwise(data).subscribe((res) => {
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

    });
  }

  ngOnDestroy(): void {
    if (this.adminAuth) {
      this.adminAuth.unsubscribe();
    }
  }

  onOrgChange(index: any) {
    this.orgName = this.organaisation[index].organizationname;
    this.formdata = {
      'clientid': this.clientSelected,
      'mstorgnhirarchyid': this.orgSelected,
      // 'type': 'type'
      // 'user_id': this.messageService.getUserId()
    };
  }

  onCatalogChange() {
    if (this.iscatalog === '1') {
      this.hiddenRadio1 = true;
    } else {
      this.hiddenRadio1 = false;
    }
  }
}
