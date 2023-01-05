import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {RestApiService} from '../rest-api.service';
import {NotifierService} from 'angular-notifier';
import {MessageService} from '../message.service';
import {Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {MatDialog} from '@angular/material/dialog';
import {ConfigService} from '../config.service';
import {Subscription, SubscriptionLike} from 'rxjs';
import {AngularGridInstance, GridOption, GridOdataService,} from 'angular-slickgrid';
import {C} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-ticket-asset',
  templateUrl: './ticket-asset.component.html',
  styleUrls: ['./ticket-asset.component.css']
})
export class TicketAssetComponent implements OnInit, OnDestroy {
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
  private rowSelected = [];
  @Input() ticketorgid: number;
  @ViewChild('assetcontent') private assetcontent;
  private openassetmodalRef: NgbModalRef;
  private assignedSubscribe: Subscription;
  sameUser: boolean;
  allassets = [];
  _object = Object;
  private attachedSubscribe: Subscription;
  isDisabled: boolean;
  CTASK_SEQ = 5;
  CR_SEQ = 4;

  dataLoaded: boolean;
  dataLoadedForSubmit: boolean;
  private modifiedAssetSubscribe: Subscription;
  GridOdataService: any = new GridOdataService();
  filteredGridAttributes = [];
  filteredGridValues = [];

  constructor(private rest: RestApiService, private notifier: NotifierService, private messageService: MessageService,
              private route: Router, private modalService: NgbModal) {
    this.addedAssetSubscribe = this.messageService.getAssetModalData().subscribe((addedAssetDetails) => {
      this.Tickets = [];
      this.ticketAssetIds = [];
      for (let i = 0; i < addedAssetDetails.length; i++) {
        this.Tickets.push(addedAssetDetails[i]);
        this.ticketAssetIds.push(addedAssetDetails[i].id);
      }
    });

    this.attachedSubscribe = this.messageService.getAttachedAssetData().subscribe((data) => {
      this.getselecteddata();
    });
    this.assignedSubscribe = this.messageService.getAssignedData().subscribe((value) => {
      if (value.agroupid === this.userGroupId && Number(this.messageService.getUserId()) === value.auserid) {
        this.sameUser = true;
      } else {
        this.sameUser = false;
      }
      // console.log('sameuser', this.sameUser);
    });
  }

  ngOnInit(): void {
    this.sameUser = true;
    this.dataLoadedForSubmit = false;
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
      backendServiceApi: {
        service: this.GridOdataService,
        process: (query) => this.getCustomApiCall(query),
        postProcess: (response) => {

        }

      },
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
      // this.userGroupSelected = this.userGroups[0].id;
      this.orgId = this.messageService.orgnId;
      this.userId = Number(this.messageService.getUserId());
      this.orgTypeId = this.messageService.orgnTypeId;
      if (this.userGroups !== undefined && this.userGroups.length > 0) {
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
        if (this.userGroups !== undefined && this.userGroups.length > 0) {
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
    this.ticketAssetIds = [];
    this.Tickets = [];
  }


  getCustomApiCall(odataQuery) {
    // console.log("\n QUERY  ===========>>>>>>>>   ", odataQuery);
    // console.log("\n this.filteredGridAttributes  ====   >>>>>>>>>    ", this.filteredGridAttributes);
    // console.log("\n this.filteredGridValues  ====   >>>>>>>>>    ", this.filteredGridValues);
    this.data = [];
    if (odataQuery.includes('$top=25&$orderby=')) {
      if (this.filteredGridValues.length !== 0) {
        this.searchAssetmanagement();
      }
      // let newStr = odataQuery.split('$top=25&$orderby=').pop();
      // if (newStr.includes('&$filter=')) {
      //   let index1 = newStr.indexOf('&$filter=');
      //   let sorted = newStr.slice(0, index1);
      //   let index2 = newStr.indexOf('(substringof(\'');
      //   let searched = newStr.slice(index2, newStr.length);
      //   let newSearched = searched.replace('(substringof', '');
      //   let newSearched2 = newSearched.replace(/and substringof/g, '');
      //   this.sortedCallFunction(sorted, newSearched2);

      // } else {
      //   let sortArr1 = [];
      //   let Array1 = [];
      //   let jsonSortedArray = [];
      //   sortArr1 = newStr.split(',');
      //   for (let i = 0; i < sortArr1.length; i++) {
      //     Array1[i] = sortArr1[i].split(' ');
      //     jsonSortedArray.push({
      //       'field': String(Array1[i][0]).toLowerCase(),
      //       'dir': String(Array1[i][1]).toUpperCase()
      //     });
      //   }
      // }
    } else if (odataQuery === '$top=25') {
      if (this.filteredGridValues.length !== 0) {
        this.searchAssetmanagement();
      }
    } else {
      this.isDisabled = true;
      this.dataLoaded = false;
      this.dataLoadedForSubmit = true;
      let newStr = odataQuery.split('$top=25&$filter=(substringof').pop();
      let newString = newStr.slice(0, -1);
      let newSubString = newString.replace(/and substringof/g, '');
      this.callFunction(newSubString);
    }
    return null;
  }

  callFunction(string) {
    let str1 = string.slice(0, -1);
    let str2 = str1.slice(1);

    let Arr = [];
    let Array2 = [];
    let dataArray = [];
    Arr = str2.split(') (');
    for (let i = 0; i < Arr.length; i++) {
      Array2[i] = Arr[i].split(', ');
      dataArray.push({
        'field': String(Array2[i][1]).toLowerCase(),
        'op': 'like',
        'val': Array2[i][0].replace(/'/g, '')
      });
    }
    if (dataArray[0].field !== undefined) {
      let searchdData = [];
      let multiSearchedData = [];
      let storedArray = [];
      // console.log("\n dataArray ===   ", dataArray);
      if (dataArray.length === 1) {
        if (dataArray[0].field === 'asset id') {
          for (let j = 0; j < this.filteredGridValues.length; j++) {
            const dataValue = String(dataArray[0].val).replace('%20', ' ');
            if (String(this.filteredGridValues[j].assetid).toLowerCase().includes(String(dataValue).toLowerCase())) {
              searchdData.push(this.filteredGridValues[j]);
            }
          }
        } else {
          for (let k = 0; k < this.filteredGridValues.length; k++) {
            for (let j = 0; j < this.filteredGridValues[k].attributes.length; j++) {
              if (String(this.filteredGridValues[k].attributes[j].attrid) === String(dataArray[0].field)) {
                const dataValue = String(dataArray[0].val).replace('%20', ' ');
                if (String(this.filteredGridValues[k].attributes[j].value).toLowerCase().includes(String(dataValue).toLowerCase())) {
                  searchdData.push(this.filteredGridValues[k]);
                }
              }
            }
          }
        }

      } else {
        for (let i = 0; i < dataArray.length; i++) {
          if (dataArray[i].field === 'asset id') {
            if (multiSearchedData.length > 0) {
              storedArray = [];
              for (let j = 0; j < multiSearchedData.length; j++) {
                const dataValue = String(dataArray[i].val).replace('%20', ' ');
                if (String(multiSearchedData[j].assetid).toLowerCase().includes(String(dataValue).toLowerCase())) {
                  storedArray.push(multiSearchedData[j]);
                }
              }
              multiSearchedData = storedArray;
            } else {
              for (let j = 0; j < this.filteredGridValues.length; j++) {
                const dataValue = String(dataArray[i].val).replace('%20', ' ');
                if (String(this.filteredGridValues[j].assetid).toLowerCase().includes(String(dataValue).toLowerCase())) {
                  multiSearchedData.push(this.filteredGridValues[j]);
                }
              }
            }
            // searchdData = storedArray;
          } else {
            if (multiSearchedData.length > 0) {
              storedArray = [];
              for (let p = 0; p < multiSearchedData.length; p++) {
                for (let q = 0; q < multiSearchedData[p].attributes.length; q++) {
                  if (String(multiSearchedData[p].attributes[q].attrid) === String(dataArray[i].field)) {
                    const dataValue = String(dataArray[i].val).replace('%20', ' ');
                    if (String(multiSearchedData[p].attributes[q].value).toLowerCase().includes(String(dataValue).toLowerCase())) {
                      storedArray.push(multiSearchedData[p]);
                    }
                  }
                }
              }
              multiSearchedData = storedArray;
            } else {
              for (let k = 0; k < this.filteredGridValues.length; k++) {
                for (let j = 0; j < this.filteredGridValues[k].attributes.length; j++) {
                  if (String(this.filteredGridValues[k].attributes[j].attrid) === String(dataArray[i].field)) {
                    const dataValue = String(dataArray[i].val).replace('%20', ' ');
                    if (String(this.filteredGridValues[k].attributes[j].value).toLowerCase().includes(String(dataValue).toLowerCase())) {
                      multiSearchedData.push(this.filteredGridValues[k]);
                      break;
                    }
                  }
                }
              }
            }
            // searchdData = storedArray;
          }
          searchdData = storedArray;
        }
      }

      // console.log("\n searchdData ~~~~~~~~>>>>>>    ", searchdData);

      this.gridObj.getSelectionModel().setSelectedRanges([]);
      this.rowSelected = [];

      this.gridObj.setSelectedRows(this.rowSelected);

      const data1 = [];
      for (let i = 0; i < this.columnData.length; i++) {
        data1.push(this.columnData[i]);
      }
      this.columnNameObj = this.filteredGridAttributes;
      this.columnValueObj = searchdData;
      //data1.push({id: 'id', name: 'Id', field: 'id', sortable: true, filterable: true});
      for (let i = 0; i < this.columnNameObj.length; i++) {
        data1.push({
          id: this.columnNameObj[i].name,
          name: this.columnNameObj[i].name,
          field: this.columnNameObj[i].id,
          sortable: true,
          filterable: true,
          minWidth: 200,
        });
      }
      this.gridObj.setColumns(data1);
      const colval = [];
      if (this.columnValueObj !== null) {
        for (let j = 0; j < this.columnValueObj.length; j++) {
          const columnVal = this.columnValueObj[j].attributes;
          const jsonval = {};
          jsonval['id'] = this.columnValueObj[j].id;
          jsonval['0'] = this.columnValueObj[j].assetid;
          for (let k = 0; k < columnVal.length; k++) {
            jsonval[columnVal[k].attrid] = columnVal[k].value;
          }
          colval.push(jsonval);
          this.collectionSize = this.columnValueObj.length;
        }
      }
      this.data = colval;
      this.isDisabled = false;
      this.dataLoaded = true;
      this.dataLoadedForSubmit = false;
      this.rowSelected = this.messageService.getArrayIndex(this.data, this.ticketAssetIds);
      setTimeout(() => {
        this.gridObj.setSelectedRows(this.rowSelected);
      }, 100);
    }

  }

  // sortedCallFunction(sortedData, searchedData) {
  //   let sortArr1 = [];
  //   let Array1 = [];
  //   let jsonSortedArray = [];
  //   sortArr1 = sortedData.split(',');
  //   for (let i = 0; i < sortArr1.length; i++) {
  //     Array1[i] = sortArr1[i].split(' ');
  //     jsonSortedArray.push({
  //       'field': String(Array1[i][0]).toLowerCase(),
  //       'dir': String(Array1[i][1]).toUpperCase()
  //     });
  //   }

  //   let str1 = searchedData.slice(0, -2);
  //   let str2 = str1.slice(1);

  //   let searchArr = [];
  //   let Array2 = [];
  //   let jsonSearchedArray = [];
  //   searchArr = str2.split(') (');
  //   for (let i = 0; i < searchArr.length; i++) {
  //     Array2[i] = searchArr[i].split(', ');
  //     jsonSearchedArray.push({
  //       'field': String(Array2[i][1]).toLowerCase(),
  //       'op': 'like',
  //       'val': Array2[i][0].replace(/'/g, '')
  //     });
  //   }
  //   // if (this.onFromRunFlag === false) {
  //   //   if ((this.step !== undefined) && (this.starStep === undefined)) {
  //   //     this.recordgridresult(jsonSearchedArray, jsonSortedArray);
  //   //   } else if ((this.step === undefined) && (this.starStep !== undefined)) {
  //   //     for (let i = 0; i < this.submittedFormArr.length; i++) {
  //   //       jsonSearchedArray.push(this.submittedFormArr[i]);
  //   //     }
  //   //     this.filterAddedPaginationData = jsonSearchedArray;
  //   //     this.recordfullresult(jsonSearchedArray, jsonSortedArray);
  //   //   }
  //   // } else {
  //   //   this.concatFilterAndSearchArray = this.submittedFormArr.concat(jsonSearchedArray);
  //   //   this.recordfullresult(this.concatFilterAndSearchArray, jsonSortedArray);
  //   // }

  // }


  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid && angularGrid.slickGrid || {};
    this.columnData = this.gridObj.getColumns();
  }

  removeAsset(index, j) {
    if (confirm(this.messageService.ASSET_DELETE)) {
      const id = this.allassets[j][index]['id'];
      const typeid = this.allassets[j][index]['typeid'];
      this.allassets[j].splice(index, 1);
      for (let i = 0; i < this.Tickets.length; i++) {
        if (this.Tickets[i].id === id) {
          this.Tickets.splice(i, 1);
          this.ticketAssetIds.splice(i, 1);
        }
      }
      if (Number(this.masterNameSelected) === typeid) {
        let dataPos;
        for (let i = 0; i < this.data.length; i++) {
          if (this.data[i].id === id) {
            dataPos = i;
          }
        }
        const pos = this.rowSelected.indexOf(dataPos);
        this.rowSelected.splice(pos, 1);
        this.gridObj.setSelectedRows(this.rowSelected);
      }
      this.onAssetRemove.emit({index: index, id: id});
    }
  }

  removeAsset1(index, type, pos) {
    if (confirm(this.messageService.ASSET_DELETE)) {
      const id = this.ticketAssetIds[index];
      this.Tickets.splice(index, 1);
      this.ticketAssetIds.splice(index, 1);
      this.onAssetRemove.emit({index: index, id: id});
      if (type === 1) {
        this.rowSelected.splice(pos, 1);
      }

    }
  }

  openModal(content) {
    if (!this.messageService.add) {
      this.notifier.notify('error', 'You do not have add permission');
    } else {
      this.allassets = [];
      // this.assetids = [];
      this.isDisabled = false;
      this.dataLoaded = true;
      this.dataLoadedForSubmit = false;
      this.data = [];
      this.columnDefinitions = [];
      this.masterNameSelected = 0;
      this.assetValue = '';
      this.assetCount = 0;
      this.filteredGridAttributes = [];
      this.filteredGridValues = [];
      this.getselecteddata();
      this.rest.getassettypes({'clientid': this.clientId, 'mstorgnhirarchyid': this.ticketorgid}).subscribe((res: any) => {
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
      this.modalRef = this.modalService.open(content, {size: 'xl'});
      this.modalRef.result.then((result) => {
      }, (reason) => {

      });
    }
  }

  getselecteddata() {
    // console.log(this.ticketid)
    if (this.ticketid) {
      this.rest.getallassettypendetailsbyrecordid({
        'clientid': this.clientId,
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
      'clientid': this.clientId,
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

  submitAssetData() {
    this.searchAssetmanagement();
  }

  searchAssetmanagement() {
    const assetdata = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.ticketorgid,
      'mstdifferentiationtypeid': Number(this.masterNameSelected)
    };
    if (Number(this.columnNameSelected) > -1) {
      assetdata['mstdifferentiationid'] = Number(this.columnNameSelected);
      assetdata['value'] = this.assetValue;
    }
    this.data = [];
    this.isDisabled = true;
    this.dataLoaded = false;
    this.dataLoadedForSubmit = true;
    this.rest.getassetbytypenvalue(assetdata).subscribe((res: any) => {
      this.isDisabled = false;
      this.dataLoaded = true;
      this.dataLoadedForSubmit = false;
      if (res.success) {
        this.gridObj.getSelectionModel().setSelectedRanges([]);
        this.rowSelected = [];

        this.gridObj.setSelectedRows(this.rowSelected);

        const data1 = [];
        for (let i = 0; i < this.columnData.length; i++) {
          data1.push(this.columnData[i]);
        }
        this.columnNameObj = res.details.assetattributes;
        this.columnValueObj = res.details.assetvales;
        //data1.push({id: 'id', name: 'Id', field: 'id', sortable: true, filterable: true});
        for (let i = 0; i < this.columnNameObj.length; i++) {
          data1.push({
            id: this.columnNameObj[i].name,
            name: this.columnNameObj[i].name,
            field: this.columnNameObj[i].id,
            sortable: true,
            filterable: true,
            minWidth: 200,
          });
        }
        this.gridObj.setColumns(data1);
        const colval = [];
        if (this.columnValueObj !== null) {
          for (let j = 0; j < this.columnValueObj.length; j++) {
            const columnVal = this.columnValueObj[j].attributes;
            const jsonval = {};
            jsonval['id'] = this.columnValueObj[j].id;
            jsonval['0'] = this.columnValueObj[j].assetid;
            for (let k = 0; k < columnVal.length; k++) {
              jsonval[columnVal[k].attrid] = columnVal[k].value;
            }
            colval.push(jsonval);
            this.collectionSize = this.columnValueObj.length;
          }
        }
        this.data = colval;
        this.filteredGridAttributes = this.columnNameObj;
        this.filteredGridValues = this.columnValueObj;
        this.rowSelected = this.messageService.getArrayIndex(this.data, this.ticketAssetIds);
        // console.log("\n this.filteredGridData   111111111  ====   >>>>>>>>>    ", this.filteredGridData);
        setTimeout(() => {
          this.gridObj.setSelectedRows(this.rowSelected);
        }, 100);
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.isDisabled = false;
      this.dataLoaded = true;
      this.dataLoadedForSubmit = false;
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }


  saveData() {
    // this.assetids = [];
    this.isDisabled = true;
    let count = this.assetCount;
    if (this.selectedTitles.length > 0) {
      for (let i = 0; i < this.selectedTitles.length; i++) {
        const jsonval = {};
        for (let j = 0; j < this.columnNameObj.length; j++) {
          jsonval[this.columnNameObj[j].name] = this.selectedTitles[i][this.columnNameObj[j].id];
        }
        if (this.ticketAssetIds.indexOf(this.selectedTitles[i].id) === -1) {
          jsonval['id'] = this.selectedTitles[i].id;
          // console.log(JSON.stringify(jsonval));
          this.Tickets.push(jsonval);
          count++;
          // console.log(JSON.stringify(this.Tickets));
          // this.assetids.push(this.selectedTitles[i].id);
          this.ticketAssetIds.push(this.selectedTitles[i].id);
        }
      }
      this.assetCount = count;
      if (this.ticketAssetIds.length > 0) {
        this.onAssetAttach.emit(this.ticketAssetIds);
      }
      this.isDisabled = false;
      this.notifier.notify('success', this.messageService.ASSET_SUCCESS);
    } else {
      this.notifier.notify('error', this.messageService.BLANK_ASSET);
    }
  }

  changeColor(newColor) {

  }

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
    // console.log(metadata.dataContext)
    const selected = this.data[args.row];
    // console.log(JSON.stringify(args));
    const pos = this.rowSelected.indexOf(args.row);
    if (pos < 0) {
      this.rowSelected.push(args.row);
    } else {
      let index = this.ticketAssetIds.indexOf(selected.id);
      // console.log(index);
      if (index > -1) {
        this.removeAsset1(index, 1, pos);
      } else {
        this.rowSelected.splice(pos, 1);
      }
    }
    if (args.cell !== -1) {
      this.gridObj.setSelectedRows(this.rowSelected);
    }
    //console.log(JSON.stringify(this.rowSelected))
  }

  ngOnDestroy(): void {
    if (this.addedAssetSubscribe) {
      this.addedAssetSubscribe.unsubscribe();
    }
    if (this.attachedSubscribe) {
      this.attachedSubscribe.unsubscribe();
    }
  }

  onAssetClick(id) {
    //console.log(id);
    this.assetdata = [];
    this.columnDefinitions = [];
    this.getassetdetailsbyid(id);
    this.openassetmodalRef = this.modalService.open(this.assetcontent, {size: 'xl'});
    this.openassetmodalRef.result.then((result) => {
    }, (reason) => {

    });
  }

  closeAsset() {
    this.openassetmodalRef.close();
  }

  getassetdetailsbyid(id) {
    // console.log('\n INSIDE GET ASSET DETAILS BY ID...........');
    const data = {'clientid': this.clientId, 'mstorgnhirarchyid': this.ticketorgid, 'assetid': id};
    this.rest.getassetdetailsbyid(data).subscribe((res: any) => {
      if (res.success) {
        this.gridObj.getSelectionModel().setSelectedRanges([]);
        this.assetdata = [];
        const data1 = [];
        for (let i = 0; i < this.columnData.length; i++) {
          data1.push(this.columnData[i]);
        }
        this.columnNameObj = res.details.assetattributes;
        this.columnValueObj = res.details.assetvales;
        //data1.push({id: 'id', name: 'Id', field: 'id', sortable: true, filterable: true});
        for (let i = 0; i < this.columnNameObj.length; i++) {
          data1.push({
            id: this.columnNameObj[i].name,
            name: this.columnNameObj[i].name,
            field: this.columnNameObj[i].id,
            sortable: true,
            minWidth: 200,
            filterable: true
          });
        }
        this.gridObj.setColumns(data1);
        const colval = [];
        if (this.columnValueObj !== null) {
          for (let j = 0; j < this.columnValueObj.length; j++) {
            const columnVal = this.columnValueObj[j].attributes;
            const jsonval = {};
            jsonval['id'] = this.columnValueObj[j].id;
            jsonval['0'] = this.columnValueObj[j].assetid;
            for (let k = 0; k < columnVal.length; k++) {
              jsonval[columnVal[k].attrid] = columnVal[k].value;
            }
            colval.push(jsonval);
            this.collectionSize = this.columnValueObj.length;
          }
        }
        this.assetdata = colval;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

}
