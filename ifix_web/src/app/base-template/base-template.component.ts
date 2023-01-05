import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MessageService} from '../message.service';
import {NotifierService} from 'angular-notifier';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-base-template',
  templateUrl: './base-template.component.html',
  styleUrls: ['./base-template.component.css']
})
export class BaseTemplateComponent implements OnInit, OnDestroy {

  public displayed: boolean;
  private userAuth: Subscription;
  private baseFlag: boolean;

  constructor(private messageService: MessageService, private notifier: NotifierService) {
    this.notifier = notifier;
    this.messageService.getTotalData().subscribe(totalData => {
      this.totalData = totalData;
    });
    // this.messageService.getUrlPath().subscribe(path => {
    //   // console.log('---inside base ' + JSON.stringify(path));
    //   this.prevPath = path.prevPath;
    //   this.nextPath = path.nextPath;
    // });
  }

  pageName: string;
  openModalButton: string;
  openModalButton1: string;
  breadcrumb: string;
  totalData: number;
  folderName: string;
  tabName: string;
  show: boolean;
  selected: number;
  prevPath: string;
  nextPath: string;
  pageSizeObj: any[];
  pageSizeSelected: number;


  @Output() modal = new EventEmitter();
  @Output() searchmodal = new EventEmitter();
  @Output() index = new EventEmitter();
  @Output() dataExportToExcel = new EventEmitter();
  @Output() tabledata = new EventEmitter();
  @Output() resetData = new EventEmitter();
  @Input() displayData: any;
  @Input() displayData1: any;
  @Input() previousOffset: any;
  @Input() nextOffset: any;
  @Output() pageSize = new EventEmitter();
  @Input() collectionSize: any;
  @Output() offset = new EventEmitter();
  @Output() offset1 = new EventEmitter();

  @Input() pageNo: any;
  @Input() totalPage: any;
  @Input() hideBtn: boolean;
  @Input() hidePagination: boolean;
  @Input() showSearch: boolean;
  @Input() dataLoaded: boolean;
  @Input() showExportBtn: boolean;
  @Input() isExportDisable: boolean;
  @Input() showIndex: boolean;
  @Input() showResetBtn: boolean;
  private adminAuth: Subscription;

  view = false;
  add = false;
  edit = false;
  del = false;
  clientId: any;

  page = 1;
  itemsPerPage: number;
  maxLength = 3;
  totalDatas = 1000;
  pageSizes: number;
  totalItem: number;
  selectedColor:any;
  pageNameCss : any;
  footerCss:any;
  openModalCss:any;
  fontColor:any;
  colorObj:any;

  defaultOffset = 0;
  defaultLimit = 100;
  lebelCss:any
  ngOnInit() {
    this.messageService.offset = this.defaultOffset;
    this.messageService.limit = this.defaultLimit;
    this.pageSizeSelected = this.messageService.pageSelected;
    this.pageSizeObj = this.messageService.pagination;
    this.colorObj = this.messageService.colors;
    this.displayed = true;
    if(this.messageService.color){
      this.selectedColor = this.messageService.color;
      for(let i=0;i<this.colorObj.length;i++){  
        if(this.selectedColor===this.colorObj[i].selectedValue){
          this.footerCss= this.colorObj[i].footerCssValue;
          this.pageNameCss = this.colorObj[i].pageNameCss;
          this.openModalCss = this.colorObj[i].buttonCss;
          
        }     
      }
    }
    this.messageService.getColor().subscribe((data:any) =>{
      this.selectedColor = data;
      for(let i=0;i<this.colorObj.length;i++){  
        if(this.selectedColor===this.colorObj[i].selectedValue){
          this.footerCss= this.colorObj[i].footerCssValue;
          this.pageNameCss = this.colorObj[i].pageNameCss;
          this.openModalCss = this.colorObj[i].buttonCss
        }     
      }
    })
    // this.totalData = 0;
    this.itemsPerPage = this.pageSizeObj[0].value;
    if (this.messageService.clientId) {
      this.baseFlag = this.messageService.baseFlag;
      if(this.baseFlag){
        this.view = true;
        this.add = true;
      }else {
        this.view = this.messageService.view;
        this.add = this.messageService.add;
      }
      // console.log('@@@@@@@@@@@@@@@@@====' + this.view);
      if (!this.view) {
        this.notifier.notify('error', this.messageService.VIEW_PERMISSION);
      } else {
        this.getTableData();
      }
    } else {
      this.userAuth = this.messageService.getClientUserAuth().subscribe(details => {
        if (details.length > 0) {
          this.baseFlag = details[0].baseFlag;
          // console.log(this.baseFlag);
          if(this.baseFlag){
            this.view = true;
            this.add = true;
          }else{
            this.view = details[0].viewFlag;
            this.add = details[0].addFlag;
          }

          if (!this.view) {
            this.notifier.notify('error', this.messageService.VIEW_PERMISSION);
          } else {

            this.getTableData();
          }
        }
      });
    }
  }

  openModal() {
    if (!this.add) {
      this.notifier.notify('error', this.messageService.ADD_PERMISSION);
    } else {
      this.modal.emit();
    }
  }

  searchModal() {
    this.searchmodal.emit();
  }

  createIndex() {
    this.index.emit();
  }

  exportToExcel() {
    this.dataExportToExcel.emit();
  }

  reset() {
    this.resetData.emit();
  }

  toggleViews() {
    this.displayed = !this.displayed;
  }

  changeRouting(path: string) {
    this.messageService.changeRouting(path);
  }

  getTableData() {
    this.tabledata.emit();
    if (this.messageService.uploadFileName !=='') {
      // this.downloadFileBg();
      this.lebelCss = 'white'
    }
    else {

    }
  }

  onPageSizeChange(value: any) {
    // const page_size = this.pageSizeObj[value].value;
    this.itemsPerPage = this.pageSizeObj[value].value;
    console.log('iiiii>>>>' + this.itemsPerPage);
    this.pageChanged(1);
    // this.pageSize.emit(page_size);
  }


  pageChanged(page) {
    console.log('Page changed: ' + page);
    this.pageSizes = this.itemsPerPage * (page - 1);
    this.totalItem = this.pageSizes + this.itemsPerPage;
    console.log('@@@@@@@@@@offset: ' + this.pageSizes);
    console.log('@@@@@@@@@@@@limit: ' + this.itemsPerPage);
    this.messageService.offset = this.pageSizes;
    this.messageService.limit = this.itemsPerPage;
    this.offset.emit({offset: this.pageSizes, limit: this.itemsPerPage});
  }

  changeColor(newColor){
   
  }


  ngOnDestroy(): void {
    if (this.userAuth) {
      this.userAuth.unsubscribe();
    }
  }

}
