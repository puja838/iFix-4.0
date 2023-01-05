import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription, SubscriptionLike} from 'rxjs';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {
  AngularGridInstance,
  Column,
  Editors,
  Formatter,
  Formatters,
  getHtmlElementOffset,
  GridOption,
  SlickDataView,
  SlickGrid
} from 'angular-slickgrid';
import {RestApiService} from '../rest-api.service';
import {NotifierService} from 'angular-notifier';
import {MessageService} from '../message.service';
import {Router} from '@angular/router';
import {CustomInputEditor} from '../custom-inputEditor';

const myCustomCopyFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  `<i class="fa fa-clone" aria-hidden="true"></i>`;
const myCustomHistoryFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  `<i class="fa fa-history" aria-hidden="true"></i>`;

@Component({
  selector: 'app-ticket-asset-modify',
  templateUrl: './ticket-asset-modify.component.html',
  styleUrls: ['./ticket-asset-modify.component.css']
})
export class TicketAssetModifyComponent implements OnInit, OnDestroy {

  private clientId: number;
  userGroups: any[];
  private userGroupSelected: any;
  private userAuth: Subscription;
  orgId: number;
  private userId: number;
  orgTypeId: number;
  private userGroupId: number;
  groupName: string;
  grpLevel: number;
  Tickets: any[];
  ticketAssetIds: any[];
  data: any[];
  assetdata: any[];
  columnDefinitions: any[];
  masterNameSelected: number;
  assetValue: string;
  assetCount: number;
  masterNameObj = [];
  totalData: number;
  private modalRef: NgbModalRef;
  private modalRef1: NgbModalRef;
  columnDataObj = [];
  columnNameSelected: number;
  private columnName: string;
  gridOptions: GridOption;
  angularGrid: AngularGridInstance;
  private gridObj: any;
  private columnData: [];
  private columnNameObj = [];
  private columnValueObj = [];
  collectionSize: number;
  selectedTitles = [];
  @Output() onAssetAttach = new EventEmitter<any[]>();
  @Output() onAssetRemove = new EventEmitter<any>();
  @Input() ticketid: number;
  @Input() tickettypeseq: number;
  // private assetids: any[];
  private addedAssetSubscribe: SubscriptionLike;
  selectedColor: any;
  tableCss: any;
  darkCss: any;
  buttonCss: any;
  fontColor: any;
  footerItem: any;
  footerCss: any;
  colorObj: any;
  // private rowSelected = [];
  @ViewChild('assetcontent') private assetcontent;
  private openassetmodalRef: NgbModalRef;
  private assignedSubscribe: Subscription;
  sameUser: boolean;
  allassets = [];
  _object = Object;
  private attachedSubscribe: Subscription;
  isDisabled: boolean;
  private modalSubscribe: Subscription;
  @ViewChild('content') private content;
  @ViewChild('contentModal') private contentModal;
  private ticketClientid: number;
  private ticketorgid: number;
  private stageid: number;
  private _commandQueue: any = [];
  private parentid: number;
  resObject: any;
  assetMessage: any;
  assetId: any;
  private grid: SlickGrid;
  private dataView: SlickDataView;
  statusseq: number;
  RESOLVE_STATUS_SEQUENCE = 3;

  constructor(private rest: RestApiService, private notifier: NotifierService, private messageService: MessageService,
              private route: Router, private modalService: NgbModal) {
    // this.addedAssetSubscribe = this.messageService.getAssetModalData().subscribe((addedAssetDetails) => {
    //   for (let i = 0; i < addedAssetDetails.length; i++) {
    //     this.Tickets.push(addedAssetDetails[i]);
    //     this.ticketAssetIds.push(addedAssetDetails[i].id);
    //   }
    // });
    this.attachedSubscribe = this.messageService.getAttachedAssetData().subscribe((data) => {
      this.getselecteddata();
    });
    // this.assignedSubscribe = this.messageService.getAssignedData().subscribe((value) => {
    //   if (value.agroupid === this.userGroupId && Number(this.messageService.getUserId()) === value.auserid) {
    //     this.sameUser = true;
    //   } else {
    //     this.sameUser = false;
    //   }
    //   console.log('sameuser', this.sameUser);
    // });
  }

  ngOnInit(): void {

    this.assetMessage = '';
    this.sameUser = true;
    this.gridOptions = {
      enableAutoResize: true,       // true by default
      enableCellNavigation: true,
      enableFiltering: true,
      editable: true,
      rowSelectionOptions: {
        selectActiveRow: true
      },
      editCommandHandler: (item, column, editCommand) => {
        this._commandQueue.push(editCommand);
        editCommand.execute();
      },
      enableCheckboxSelector: false,
      enableRowSelection: true,
    };
    this.colorObj = this.messageService.colors;
    if (this.messageService.color) {
      this.selectedColor = this.messageService.color;
      for (let i = 0; i < this.colorObj.length; i++) {
        if (this.selectedColor === this.colorObj[i].selectedValue) {
          this.footerItem = this.colorObj[i].footerItemValue;
          this.buttonCss = this.colorObj[i].buttonCss;
          this.darkCss = this.colorObj[i].darkCss;
        }
      }
    }
    this.messageService.getColor().subscribe((data: any) => {
      this.selectedColor = data;
      for (let i = 0; i < this.colorObj.length; i++) {
        if (this.selectedColor === this.colorObj[i].selectedValue) {
          this.footerItem = this.colorObj[i].footerItemValue;
          this.buttonCss = this.colorObj[i].buttonCss;
          this.darkCss = this.colorObj[i].darkCss;
        }
      }
    });
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.userGroups = this.messageService.group;
      this.userGroupSelected = this.userGroups[0].id;
      this.orgId = this.messageService.orgnId;
      this.userId = Number(this.messageService.getUserId());
      this.orgTypeId = this.messageService.orgnTypeId;
      if (this.userGroups !== undefined) {
        if (this.messageService.getSupportGroup() === null) {
          this.userGroupId = this.userGroups[0].id;
          this.groupName = this.userGroups[0].groupname;
          this.grpLevel = this.userGroups[0].levelid;
        } else {
          const group = this.messageService.getSupportGroup();
          this.userGroupId = Number(group.groupId);
          for (let i = 0; i < this.userGroups.length; i++) {
            if (this.userGroups[i].id === this.userGroupId) {
              this.groupName = this.userGroups[i].groupname;
              this.grpLevel = this.userGroups[i].levelid;
            }
          }
        }
        this.userGroupSelected = this.userGroupId;
      }
      this.onPageLoad();
    } else {
      this.userAuth = this.messageService.getClientUserAuth().subscribe(auth => {
        this.userGroups = auth[0].group;
        this.clientId = auth[0].clientid;
        this.orgId = auth[0].mstorgnhirarchyid;
        this.orgTypeId = auth[0].orgntypeid;
        this.userId = auth[0].userid;
        if (this.userGroups !== undefined) {
          if (this.messageService.getSupportGroup() === null) {
            this.userGroupId = this.userGroups[0].id;
            this.groupName = this.userGroups[0].groupname;
            this.grpLevel = this.userGroups[0].levelid;
          } else {
            const group = this.messageService.getSupportGroup();
            this.userGroupId = group.groupId;
            for (let i = 0; i < this.userGroups.length; i++) {
              if (this.userGroups[i].id === this.userGroupId) {
                this.groupName = this.userGroups[i].groupname;
                this.grpLevel = this.userGroups[i].levelid;
              }
            }
          }
          this.userGroupSelected = this.userGroupId;
        }
        this.onPageLoad();
      });
    }
  }

  onPageLoad() {
    this.modalSubscribe = this.messageService.getCMDBModalData().subscribe((data) => {
      this.ticketAssetIds = [];
      // this.Tickets = [];
      if (!this.messageService.add) {
        this.notifier.notify('error', 'You do not have add permission');
      } else {
        this.statusseq = 0;
        this.ticketid = data.ticketid;
        this.tickettypeseq = data.typeSeq;
        this.ticketClientid = data.clientid;
        this.ticketorgid = data.mstorgnhirarchyid;
        this.stageid = data.recordstageid;
        this.parentid = data.parentid;
        this.statusseq = data.statusseq;
        this.allassets = [];
        // this.assetids = [];
        this.isDisabled = false;
        this.data = [];
        this.columnDefinitions = [];
        this.masterNameSelected = 0;
        this.assetValue = '';
        this.assetCount = 0;
        // console.log(this.tickettypeseq)
        this.getselecteddata();
        this.rest.getassettypes({'clientid': this.ticketClientid, 'mstorgnhirarchyid': this.ticketorgid}).subscribe((res: any) => {
          if (res.success) {
            this.masterNameObj = res.details;
            this.masterNameObj.unshift({id: 0, name: 'Select asset master name'});
            this.totalData = this.masterNameObj.length;
          } else {
            this.notifier.notify('error', res.message);
          }
        }, (err) => {
          this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
        this.modalRef = this.modalService.open(this.content, {
          size: 'xl', windowClass: 'zindex-2000', backdrop: 'static',
          keyboard: false
        });
        this.modalRef.result.then((result) => {
        }, (reason) => {

        });
        // this.angularGrid.on
      }
    });
  }

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid && angularGrid.slickGrid || {};
    this.columnData = this.gridObj.getColumns();
    this.grid = angularGrid.slickGrid as SlickGrid;
    this.dataView = angularGrid.dataView;
  }

  removeAsset(index, j) {
    if (confirm('Are you sure?')) {
      const id = this.allassets[j][index]['id'];
      const typeid = this.allassets[j][index]['typeid'];
      this.allassets[j].splice(index, 1);

      this.onAssetRemove.emit({index: index, id: id});
    }
  }

  showHistory(index, j) {
    this.assetId = this.allassets[j][index]['id'];
    // if (this.allassets[j][index]['-1'] !== '') {
    this.openModal();
    // } else {
    //   this.notifier.notify('error', 'No history found for this asset');
    // }
  }


  getselecteddata() {
    // console.log(this.ticketid)
    if (this.ticketid) {
      this.rest.getallassettypendetailsbyrecordid({
        'clientid': this.ticketClientid,
        'mstorgnhirarchyid': this.ticketorgid,
        'recordid': this.ticketid
      }).subscribe((res: any) => {
        if (res.success) {
          const allassets = res.details;
          if (allassets !== null) {
            this.allassets = [];
            for (let i = 0; i < allassets.length; i++) {
              const attrarr = [];
              for (let j = 0; j < allassets[i].assets.length; j++) {
                let attr = allassets[i].assets[j].attributes;
                let attrjson = {};
                attrjson['type'] = allassets[i].name;
                attrjson['id'] = allassets[i].assets[j].id;
                for (let k = 0; k < attr.length; k++) {
                  attrjson[attr[k].attrname] = attr[k].value;
                }
                attrjson['typeid'] = allassets[i].id;
                attrarr.push(attrjson);
              }
              // console.log("----> "+JSON.stringify(attrarr));
              this.allassets.push(attrarr);
            }
            // console.log('----> ' + JSON.stringify(this.allassets));
          }
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    }
  }

  onMasterChange(value: any) {
    this.rest.getassetattributes({
      'clientid': this.ticketClientid,
      'mstorgnhirarchyid': this.ticketorgid,
      'mstdifferentiationtypeid': Number(this.masterNameSelected)
    }).subscribe((res: any) => {
      // // console.log(this.respObject)
      if (res.success) {
        this.columnDataObj = res.details;
        this.columnDataObj.unshift({id: -1, name: 'Select asset column name'});
        this.totalData = res.details.length;
        this.columnNameSelected = -1;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onClientChange(value: any) {
    this.columnName = this.columnDataObj[value].columnName;
  }

  searchAssetmanagement() {
    const assetdata = {
      'clientid': this.ticketClientid,
      'mstorgnhirarchyid': this.ticketorgid,
      'mstdifferentiationtypeid': Number(this.masterNameSelected)
    };
    if (Number(this.columnNameSelected) > -1) {
      assetdata['mstdifferentiationid'] = Number(this.columnNameSelected);
      assetdata['value'] = this.assetValue;
    }
    this.data = [];
    this.isDisabled = true;
    this.columnDefinitions = [];
    this.rest.getassetbytypenvalue(assetdata).subscribe((res: any) => {
      this.isDisabled = false;
      if (res.success) {
        this.columnNameObj = res.details.assetattributes;
        this.columnValueObj = res.details.assetvales;
        //this.assetId = res.details.assetvales.id;
        this.columnDefinitions.push({
          id: 'copy',
          field: 'copy',
          excludeFromHeaderMenu: true,
          formatter: myCustomCopyFormatter,
          minWidth: 30,
          maxWidth: 30,
        }, {
          id: 'history',
          field: 'history',
          name: 'Asset History',
          excludeFromHeaderMenu: true,
          formatter: myCustomHistoryFormatter,

        }, {id: 'id', name: 'Id', field: 'id', sortable: true, filterable: true}, {
          id: '0',
          name: 'Asset ID',
          field: '0',
          sortable: true,
          filterable: true, minWidth: 200,
        });
        for (let i = 1; i < this.columnNameObj.length; i++) {
          this.columnDefinitions.push({
            id: this.columnNameObj[i].id,
            name: this.columnNameObj[i].name,
            field: this.columnNameObj[i].id,
            sortable: true,
            filterable: true,
            minWidth: 200,
            editor: {
              model: CustomInputEditor,
              placeholder: 'custom',
            }
          });
        }
        this.columnDefinitions = this.columnDefinitions.slice();
        const colval = [];
        if (this.columnValueObj !== null) {
          for (let j = 0; j < this.columnValueObj.length; j++) {
            const columnVal = this.columnValueObj[j].attributes;
            const jsonval = {};
            jsonval['id'] = this.columnValueObj[j].id;
            jsonval['0'] = this.columnValueObj[j].assetid;
            // jsonval['-1'] = this.columnValueObj[j].assethistory;
            for (let k = 0; k < columnVal.length; k++) {
              jsonval[columnVal[k].attrid] = columnVal[k].value;
            }
            colval.push(jsonval);
            this.collectionSize = this.columnValueObj.length;
          }
        }
        this.data = colval;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  // changeColor(newColor) {
  //
  // }

  handleSelectedRowsChanged(e, args) {
    if (Array.isArray(args.rows)) {
      this.selectedTitles = args.rows.map(idx => {
        const item = this.gridObj.getDataItem(idx);
        return item || '';
      });
    }

  }

  close() {
    this.modalRef.close();
    //console.log(JSON.stringify(this.ticketAssetIds));
    // if (this.ticketAssetIds.length > 0) {
    //   this.onAssetAttach.emit(this.ticketAssetIds);
    // }
  }

  onCellClicked(eventData: any, args) {
    const metadata = this.angularGrid.gridService.getColumnFromEventArguments(args);
    console.log(JSON.stringify(metadata));
    if (metadata.columnDef.id === 'copy' && !this.isDisabled) {
      // console.log(JSON.stringify(metadata.dataContext));
      if (confirm(this.messageService.ASSET_COPY)) {
        const newval = JSON.parse(JSON.stringify(metadata.dataContext));
        delete newval.id;
        delete newval['0'];
        const data = {
          clientid: this.ticketClientid,
          mstorgnhirarchyid: this.ticketorgid,
          recordid: this.ticketid,
          recordstageid: this.stageid,
          parentrecordid: this.parentid,
          tickettypeseq: this.tickettypeseq,
          mstdifftypeid: Number(this.masterNameSelected),
          asset: newval,
          groupid: this.userGroupId
        };
        this.rest.insertrecordasset(data).subscribe((res: any) => {
          if (res.success) {
            this.notifier.notify('success', res.message);
            newval[0] = res.details.assetcode;
            newval.id = res.details.assetid;
            this.angularGrid.gridService.addItem(newval, {position: 'top', highlightRow: true});
            // this.angularGrid.gridService.highlightRow(0, 1500, 15000);
            this.dataView.getItemMetadata = this.changeColor(this.dataView.getItemMetadata);
            this.gridObj.invalidate();
            this.gridObj.render();
            console.log(JSON.stringify(newval));
            this.messageService.setModifiedAssetData({});
            this.getselecteddata();
          } else {
            this.notifier.notify('error', res.message);
          }
        }, (err) => {

        });
      }

    } else if (metadata.columnDef.id === 'history') {
      const cell = this.angularGrid.slickGrid.getCellFromEvent(eventData);
      const item = this.angularGrid.dataView.getItem(cell.row);
      this.assetId = item.id;
      if (item[-1] !== '') {
        this.modalRef1 = this.modalService.open(this.contentModal, {
          size: 'lg', windowClass: 'zindex-5000', backdrop: 'static',
          keyboard: false
        });
        this.modalRef1.result.then((result) => {
        }, (reason) => {

        });
        this.getAssetHistory();
      } else {
        this.notifier.notify('error', 'No history found for this asset');
      }
    }
  }

  changeColor(previousItemMetadata: any) {
    const newCssClass = 'duration-bg';
    return (rowNumber: any) => {
      const item = this.dataView.getItem(rowNumber);
      const meta = {
        cssClasses: ''
      };
      if (meta && item) {
        if (rowNumber < 1) {
          meta.cssClasses = (meta.cssClasses || '') + ' ' + newCssClass;
        }
      }
      return meta;
    };
  }


  ngOnDestroy(): void {
    // if (this.addedAssetSubscribe) {
    //   this.addedAssetSubscribe.unsubscribe();
    // }
    if (this.attachedSubscribe) {
      this.attachedSubscribe.unsubscribe();
    }
    if (this.modalSubscribe) {
      this.modalSubscribe.unsubscribe();
    }
  }


  closeAsset() {
    this.openassetmodalRef.close();
  }

  onCellChanged(e, args) {
    // console.log(JSON.stringify(args));
    const key = args.column.field;
    const val = args.item[key];
    const id = args.item.id;
    // console.log(key, val, id);
    const data = {
      clientid: this.ticketClientid,
      mstorgnhirarchyid: this.ticketorgid,
      recordid: this.ticketid,
      recordstageid: this.stageid,
      tickettypeseq: this.tickettypeseq,
      parentrecordid: this.parentid,
      assetid: id,
      assetheaderid: key,
      UpdatedValue: val,
      groupid: this.userGroupId
    };
    this.rest.updaterecordasset(data).subscribe((res: any) => {
      if (res.success) {
        this.notifier.notify('success', res.message);
        this.messageService.setModifiedAssetData({});
        this.getselecteddata();
      } else {
        this.undo();
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.undo();
      // console.log(err);
    });
  }

  undo() {
    const command = this._commandQueue.pop();
    const item = this.angularGrid.dataView.getItem(command.row);
    if (command) {
      command.undo();
      this.gridObj.gotoCell(command.row, command.cell, false);
    }
  }

  getAssetHistory() {
    const data = {
      'clientid': this.ticketClientid,
      'mstorgnhirarchyid': this.ticketorgid,
      'assetid': Number(this.assetId)
    };
    // console.log(JSON.stringify(data));
    this.rest.getassethistorybyassetid(data).subscribe((res) => {
      this.resObject = res;
      if (this.resObject.success) {
        this.assetMessage = this.resObject.details.history;
        // console.log(this.assetMessage);
      }
    });
  }

  openModal() {
    this.modalRef1 = this.modalService.open(this.contentModal, {
      size: 'lg', windowClass: 'zindex-5000', backdrop: 'static',
      keyboard: false
    });
    this.modalRef1.result.then((result) => {
    }, (reason) => {

    });

    this.getAssetHistory();

  }

}
