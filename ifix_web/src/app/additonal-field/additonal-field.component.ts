import {Component, OnInit, OnDestroy, ViewChild, Renderer2} from '@angular/core';
import {NotifierService} from 'angular-notifier';
import {RestApiService} from '../rest-api.service';
import {Filters, Formatters, OnEventArgs} from 'angular-slickgrid';
import {MessageService} from '../message.service';
import {Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';
import {AngularGridInstance, Column, GridOption} from 'angular-slickgrid';
import {CustomInputEditor} from '../custom-inputEditor';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-additonal-field',
  templateUrl: './additonal-field.component.html',
  styleUrls: ['./additonal-field.component.css']
})
export class AdditonalFieldComponent implements OnInit, OnDestroy {
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
  private seq: number;
  pageSize: number;
  private baseFlag: any;
  private userAuth: Subscription;
  offset: number;
  dataLoaded: boolean;
  orgnId: number;
  organaisation = [];
  orgName: string;
  orgSelected: string;
  fromPropertyTypeSeqno: string;
  fromPropertyTypes = [];
  fromPropLevels = [];
  fromlevelid: string;
  fromPropertyDiffTypeId: number;
  formPropertyValues = [];
  selectedFromPropertyValue: string;
  toPropertyValues = [];
  toRecordDiffTypeId: number;
  toPropLevels = [];
  termType = [];
  selectedTermType: string;
  selectedRecordTerm: string;
  recordTerm = [];
  recordtermName: string;
  columnDefinitions = [];
  additionalField = [{toPropertyTypeId: '', tolevelid: '', toPropertyValue: ''}];
  gridOptions: GridOption;
  angularGrid: AngularGridInstance;
  selectedTitles: any[];
  gridObj: any;
  gridWidth: number;
  itemsPerPage: number;
  pageSizeObj = [];
  displayed: boolean;
  pageSizeSelected: number;
  @ViewChild('content') private content;
  @ViewChild('content1') private content1;
  @ViewChild('content2') private content2;
  private modalReference: NgbModalRef;
  page = 1;
  maxLength = 3;
  totalDatas = 1000;
  pageSizes: number;
  totalItem: number;
  fieldData = [];
  selectedId: number;
  clientSelectedName: string;
  orgSelectedName: string;
  termNames = [];
  termNameSelected: string;
  termName: string;

  toLevelIDArr = [];
  tolevelid: number;
  defaultOffset = 0;
  defaultLimit = 100;
    

  constructor(private rest: RestApiService, private messageService: MessageService, private route: Router,
              private modalService: NgbModal, notifier: NotifierService, private renderer: Renderer2) {


    this.messageService.getAfterDelete().subscribe(id => {
      // this.angularGrid.gridService.deleteDataGridItemById(id);
      this.angularGrid.gridService.deleteItemById(id);
    });

    this.notifier = notifier;
    this.messageService.getCellChangeData().subscribe(item => {
      switch (item.type) {

        case 'delete':
          // console.log('deleted');
          if (!this.del) {
            this.notifier.notify('error', this.messageService.DELETE_PERMISSION);
          } else {
            if (confirm('Are you sure?')) {
              // console.log(this.totalData, item.id+ "  <<<<<<<<<<<<<<<< Before API call");
              this.rest.deletemstrecordfield({id: item.id}).subscribe((res) => {
                this.respObject = res;
                if (this.respObject.success) {
                  this.totalData = this.totalData - 1;
                  this.messageService.setTotalData(this.totalData);
                  // console.log(this.totalData, item.id+ "  <<<<<<<<<<<<<<<< After API call");
                  this.messageService.sendAfterDelete(item.id);
                  this.notifier.notify('success', this.messageService.DELETE_SUCCESS);
                  // console.log(this.totalData, item.id+ "  <<<<<<<<<<<<<<<< After API call");
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
  }


  ngOnInit() {
    this.messageService.offset = this.defaultOffset;
    this.messageService.limit = this.defaultLimit;
    this.pageSizeSelected = this.messageService.pageSelected;
    this.pageSizeObj = this.messageService.pagination;
    this.displayed = true;
    // this.totalData = 0;
    this.itemsPerPage = this.pageSizeObj[0].value;
    this.dataLoaded = true;
    this.pageSize = this.messageService.pageSize;
    this.termType = [{id: 1, name: 'CHECK LIST'}, {id: 2, name: 'ADDITIONAL FIELD'}];
    this.selectedTermType = '';
    this.displayData = {
      pageName: 'Maintain Additional Field',
      openModalButton: 'Add Additional Field ',
      breadcrumb: 'Additional Field',
      folderName: 'All Additional Field',
      tabName: 'Additional Field',
    };

    this.gridOptions = {
      enableAutoResize: true,       // true by default
      enableCellNavigation: true,
      enableFiltering: true,
      editable: true,
      rowSelectionOptions: {
        selectActiveRow: false
      },
      enableCheckboxSelector: false,
      enableRowSelection: true,
      enableAddRow: true
    };
    this.columnDefinitions = [
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
      //     console.log('@@@@@@@@@@@@@@@@@@@@============' + JSON.stringify(args.dataContext));
      //     this.isError = false;
      //     this.resetValues()
      //     this.selectedId = args.dataContext.id;
      //     this.clientSelectedName = args.dataContext.clientname;
      //     this.orgSelectedName = args.dataContext.mstorgnhirarchyname;
      //     this.selectedTermType = args.dataContext.mstrecordfieldtype;
      //     this.selectedRecordTerm = args.dataContext.recordtermid;
      //     const mstrecordfielddiff = args.dataContext.mstrecordfielddiff;
      //     this.additionalField = [];
      //     // additionalField = [{toPropertyTypeId: '', tolevelid: '', toPropertyValue: ''}];
      //     for (let i = 0; i < mstrecordfielddiff.length; i++) {
      //       let typeId;
      //       if (mstrecordfielddiff[i].recorddifftypeParentid > 0) {
      //         typeId = mstrecordfielddiff[i].recorddifftypeParentid;
      //       } else {
      //         typeId = mstrecordfielddiff[i].recorddifftypeid;
      //       }
      //       const data = {
      //         toPropertyTypeId: typeId,
      //         tolevelid: '',
      //         toPropertyValue: mstrecordfielddiff[i].recorddiffid
      //       };
      //       this.additionalField.push(data);
      //       for (let j = 0; j < this.fromPropertyTypes.length; j++) {
      //         if (this.fromPropertyTypes[j].id === typeId) {
      //           const seq = this.fromPropertyTypes[j].seqno;
      //           this.getCategoryLevel(seq, 'to', i);
      //         }
      //       }
      //     }
      //     this.modalReference = this.modalService.open(this.content2, {});
      //     this.modalReference.result.then((result) => {
      //     }, (reason) => {
      //
      //     });
      //   }
      // },
      {
        id: 'organization', name: 'Organization', field: 'mstorgnhirarchyname', sortable: true, filterable: true
      },
      {
        id: 'mstrecordfieldtype', name: 'Term Type', field: 'mstrecordfieldtype', sortable: true, filterable: true
      },
      {
        id: 'termtypename', name: 'Record Term Type', field: 'termtypename', sortable: true, filterable: true
      },
      {
        id: 'termname', name: 'Record Term Name', field: 'termname', sortable: true, filterable: true
      },
    ];
    // this.messageService.setColumnDefinitions(columnDefinitions);
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.baseFlag = this.messageService.baseFlag;
      this.orgnId = this.messageService.orgnId;
      this.add = this.messageService.add;
      this.view = this.messageService.view;
      this.edit = this.messageService.edit;
      this.del = this.messageService.del;
      this.onPageLoad();
    } else {
      this.userAuth = this.messageService.getClientUserAuth().subscribe(auth => {
        this.view = auth[0].viewFlag;
        this.add = auth[0].addFlag;
        this.edit = auth[0].editFlag;
        this.del = auth[0].deleteFlag;
        this.clientId = auth[0].clientid;
        this.baseFlag = auth[0].baseFlag;
        this.orgnId = auth[0].mstorgnhirarchyid;
        this.onPageLoad();
      });
    }
  }


  onPageLoad() {
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(this.orgnId)
    };
    this.rest.getorganizationclientwisenew(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.organaisation = this.respObject.details;
        this.orgSelected = '';
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
    this.rest.getRecordDiffType().subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.fromPropertyTypes = this.respObject.details;
        this.fromPropertyTypeSeqno = '';
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
    this.getTableData();
  }

  angularGridReady(angularGrid: AngularGridInstance) {
    // console.log('grid initiate');
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid && angularGrid.slickGrid || {};
  }

  onCellChanged(e, args) {
    // console.log(args.item);
  }

  handleSelectedRowsChanged(e, args) {
    if (Array.isArray(args.rows)) {
      this.selectedTitles = args.rows.map(idx => {
        const item = this.gridObj.getDataItem(idx);
        return item || '';
      });
    }
  }

  onCellClicked(e, args) {
    const metadata = this.angularGrid.gridService.getColumnFromEventArguments(args);
    // console.log('metadata============' + JSON.stringify(metadata.columnDef.id));
    if (metadata.columnDef.id === 'delete') {
      metadata.dataContext.type = 'delete';
      this.messageService.setCellChangeData(metadata.dataContext);
    } else {
      const selectedRow = this.angularGrid.gridService.getColumnFromEventArguments(args);
      const data = selectedRow.dataContext;
      this.fieldData = data.mstrecordfielddiff;
      // this.modalService.open(this.content1).result.then((result) => {
      // }, (reason) => {
      // });
    }
  }

  getRecordTerm(orgId) {
    const data = {
      clientid: Number(this.clientId),
      mstorgnhirarchyid: Number(orgId)
    };
    this.rest.listmstrecordterms(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.termNames = this.respObject.details;
        this.termNameSelected = '';
      } else {
        this.isError = true;
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.isError = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onTermNameChange(index) {
    this.termName = this.termNames[index].termname;
  }

  onPropertyTypeChange(index, levelIndex) {
    // console.log("\n levelIndex ====   ", levelIndex);
    // console.log("\n this.additionalField  =====     ", this.additionalField);
    if (index !== 0) {
      // console.log('index:', levelIndex);
      let seqNumber = '';
      this.toRecordDiffTypeId = this.fromPropertyTypes[index - 1].id;
      seqNumber = this.fromPropertyTypes[index - 1].seqno;
      if (levelIndex > 0) {
        this.getLabelValue(seqNumber, levelIndex);
      } else {
        this.getCategoryLevel(seqNumber, levelIndex);
      }
    }
  }

  getLabelValue(seqNumber, levelIndex) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.orgSelected),
      fromrecorddifftypeid: Number(this.additionalField[0].toPropertyTypeId),
      fromrecorddiffid: this.additionalField[0].toPropertyValue,
      seqno: Number(seqNumber)
    };
    this.rest.getlabelbydiffseq(data).subscribe((res: any) => {
      if (res.success) {
        if (res.details.length > 0) {
          res.details.unshift({id: '', typename: 'Select Property Level', parentname: ''});
          this.toPropLevels = res.details;
          const id = 'level' + levelIndex;
          const selectIndex = 'selectLevel' + levelIndex;
          const element = document.getElementById(selectIndex);
          if (element !== null) {
            element.parentNode.removeChild(element);
          }
          const select = document.createElement('select');
          select.setAttribute('class', 'custom-select mr-sm-2 radius-0 font-13');
          select.setAttribute('id', 'selectLevel' + levelIndex);
          for (const val of this.toPropLevels) {
            const option = document.createElement('option');
            option.value = val.id;
            option.text = val.typename;
            select.appendChild(option);
          }
          const selectElement = document.getElementById(id);
          this.renderer.listen(selectElement, 'change', (event) => {
            this.onLevelChange(event.target.selectedIndex, levelIndex);
          });
          selectElement.appendChild(select);
        } else {
          this.toPropLevels = [];
          this.getPropertyValue(Number(seqNumber), levelIndex);
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {

    });
  }

  getCategoryLevel(seqNumber, levelIndex) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.orgSelected),
      seqno: Number(seqNumber),
    };
    this.rest.getcategorylevel(data).subscribe((res: any) => {
      if (res.success) {
        if (res.details.length > 0) {
          res.details.unshift({id: '', typename: 'Select Property Level', parentname: ''});
          this.toPropLevels = res.details;
          const id = 'level' + levelIndex;
          const selectIndex = 'selectLevel' + levelIndex;
          const element = document.getElementById(selectIndex);
          if (element !== null) {
            element.parentNode.removeChild(element);
          }
          const select = document.createElement('select');
          select.setAttribute('class', 'custom-select mr-sm-2 radius-0 font-13');
          select.setAttribute('id', 'selectLevel' + levelIndex);
          for (const val of this.toPropLevels) {
            const option = document.createElement('option');
            option.value = val.id;
            option.text = val.typename;
            select.appendChild(option);
          }
          const selectElement = document.getElementById(id);
          this.renderer.listen(selectElement, 'change', (event) => {
            this.onLevelChange(event.target.selectedIndex, levelIndex);
          });
          selectElement.appendChild(select);
        } else {
          this.toPropLevels = [];
          this.getPropertyValue(Number(seqNumber), levelIndex);
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getPropertyValue(seqNumber, levelIndex) {
    if (levelIndex === 0) {
      this.getPropertyValueNoMapping(seqNumber, levelIndex);
    } else {
      this.getPropertyValueBySeq(seqNumber, levelIndex);
    }
  }

  getPropertyValueNoMapping(seqNumber, levelIndex) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.orgSelected),
      seqno: seqNumber
    };
    this.rest.getrecordbydifftype(data).subscribe((res: any) => {
      if (res.success) {
        this.toPropertyValues = res.details;
        res.details.unshift({id: '', typename: 'Select Property Value', parentname: ''});
        const id = 'container' + levelIndex;
        const selectIndex = 'select' + levelIndex;
        const element = document.getElementById(selectIndex);
        // console.log('element===' + JSON.stringify(element));
        if (element !== null) {
          element.parentNode.removeChild(element);
        }
        // =========================================
        const select = document.createElement('select');
        select.setAttribute('class', 'custom-select mr-sm-2 radius-0 font-13');
        select.setAttribute('id', 'select' + levelIndex);
        for (const val of this.toPropertyValues) {
          const option = document.createElement('option');
          option.value = val.id;
          option.text = val.typename + ' - ' + val.parentname;
          select.appendChild(option);
        }
        const selectElement = document.getElementById(id);
        this.renderer.listen(selectElement, 'change', (event) => {
          this.onChangePropertyvalue(event.target.selectedIndex, levelIndex);
        });
        selectElement.appendChild(select);
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getPropertyValueBySeq(seqNumber, levelIndex) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.orgSelected),
      fromrecorddifftypeid: Number(this.additionalField[0].toPropertyTypeId),
      fromrecorddiffid: this.additionalField[0].toPropertyValue,
      seqno: Number(seqNumber)
    };
    this.rest.getmappeddiffbyseq(data).subscribe((res: any) => {
      if (res.success) {
        this.toPropertyValues = res.details;
        res.details.unshift({id: '', typename: 'Select Property Value', parentpath: ''});
        const id = 'container' + levelIndex;
        const selectIndex = 'select' + levelIndex;
        const element = document.getElementById(selectIndex);
        // console.log('element===' + JSON.stringify(element));
        if (element !== null) {
          element.parentNode.removeChild(element);
        }
        const select = document.createElement('select');
        select.setAttribute('class', 'custom-select mr-sm-2 radius-0 font-13');
        select.setAttribute('id', 'select' + levelIndex);
        for (const val of this.toPropertyValues) {
          const option = document.createElement('option');
          option.value = val.id;
          option.text = val.typename + ' - ' + val.parentpath;
          select.appendChild(option);
        }
        const selectElement = document.getElementById(id);
        this.renderer.listen(selectElement, 'change', (event) => {
          this.onChangePropertyvalue(event.target.selectedIndex, levelIndex);
        });
        selectElement.appendChild(select);
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.isError = true;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });

  }

  onChangePropertyvalue(index, levelIndex) {
    this.additionalField[levelIndex].toPropertyValue = this.toPropertyValues[index].id;
  }

  onLevelChange(selectedIndex: any, levelIndex) {
    let seq;
    seq = this.toPropLevels[selectedIndex].seqno;
    // this.tolevelid = this.toPropLevels[selectedIndex - 1].id;
    this.additionalField[levelIndex].tolevelid = this.toPropLevels[selectedIndex].id;
    this.getPropertyValue(seq, levelIndex);
  }

  addAdditionalFieldDiv() {
    this.additionalField.push({toPropertyTypeId: '', tolevelid: '', toPropertyValue: ''});
  }

  onOrgChange(index: any) {
    this.orgName = this.organaisation[index - 1].organizationname;
    this.additionalField = [{toPropertyTypeId: '', tolevelid: '', toPropertyValue: ''}];

    this.getRecordTerm(this.orgSelected);
  }

  changeRouting(path: string) {
    this.messageService.changeRouting(path);
  }


  openModal() {
    if (!this.add) {
      this.notifier.notify('error', this.messageService.ADD_PERMISSION);
    } else {
      this.resetValues();
      this.modalService.open(this.content).result.then((result) => {
      }, (reason) => {
      });
    }
  }

  save() {
    // change additional field variable name according to backend requirement
    for (let i = 0; i < this.additionalField.length; i++) {
      if (this.additionalField[i].tolevelid !== '') {
        this.additionalField[i]['recorddifftypeid'] = Number(this.additionalField[i].tolevelid);
      } else {
        this.additionalField[i]['recorddifftypeid'] = Number(this.additionalField[i].toPropertyTypeId);
      }
      this.additionalField[i]['recorddiffid'] = Number(this.additionalField[i].toPropertyValue);
      // delete this.additionalField[i].tolevelid;
      // delete this.additionalField[i].toPropertyTypeId;
      // delete this.additionalField[i].toPropertyValue;
    }

    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: Number(this.orgSelected),
      mstrecordfieldtype: this.selectedTermType,
      recordtermid: Number(this.termNameSelected),
      mstrecordfielddiff: this.additionalField
    };
    // console.log('data=====' + JSON.stringify(data));
    if (!this.messageService.isBlankField(data)) {
      this.rest.addmstrecordfield(data).subscribe((res) => {
        this.respObject = res;
        if (this.respObject.success) {
          this.notifier.notify('success', this.messageService.INSERT_SUCCESS);
          this.resetValues();
          this.getTableData();
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
    if (!this.view) {
      this.notifier.notify('error', this.messageService.VIEW_PERMISSION);
    } else {
      this.getData({
        offset: this.messageService.offset, 
        limit: this.messageService.limit
      });
    }
  }

  resetValues() {
    this.termNameSelected = '';
    this.orgSelected = '';
    this.selectedTermType = '';
    this.selectedRecordTerm = '';
    this.additionalField = [{toPropertyTypeId: '', tolevelid: '', toPropertyValue: ''}];
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
    };
    this.rest.getmstrecordfield(data).subscribe((res) => {
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
      this.dataset = respObject.details.values;
    } else {
      this.notifier.notify('error', respObject.message);
    }
  }

  onPageSizeChange(value: any) {
    // const page_size = this.pageSizeObj[value].value;
    this.itemsPerPage = this.pageSizeObj[value].value;
    this.pageChanged(1);
    // this.pageSize.emit(page_size);
  }


  pageChanged(page) {
    this.pageSizes = this.itemsPerPage * (page - 1);
    this.totalItem = this.pageSizes + this.itemsPerPage;
    this.messageService.offset = this.pageSizes;
    this.messageService.limit = this.itemsPerPage;
    this.getData({offset: this.pageSizes, limit: this.itemsPerPage});
  }

  ngOnDestroy(): void {
    if (this.userAuth) {
      this.userAuth.unsubscribe();
    }
  }

}
