import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {RestApiService} from "../rest-api.service";
import {MessageService} from "../message.service";
import {Router} from "@angular/router";
import {NotifierService} from "angular-notifier";
import {Formatters} from "angular-slickgrid";

@Component({
  selector: 'app-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.css']
})
export class ComingSoonComponent implements OnInit {
  displayed = true;
  totalData = 0;
 
  respObject: any;
  displayData: any;
  add = false;
  del = false;
  edit = false;
  view = false;
  isError = false;
  errorMessage: string;
  private baseFlag: any;
 
  private userAuth: Subscription;
  dataLoaded: boolean;
  isLoading = false;
  clientId: number
  
  orgnId: number;
  colordata: any;
  groups = [];
  

  

  constructor(private rest: RestApiService, private messageService: MessageService,
    private route: Router, private modalService: NgbModal, private notifier: NotifierService) { 
      this.messageService.getCellChangeData().subscribe(item => {
        switch (item.type) {
          case 'delete':
            // console.log('deleted');
            if (!this.del) {
              this.notifier.notify('error', this.messageService.DELETE_PERMISSION);
            } else {
              if (confirm('Are you sure?')) {
                // this.rest.deleteslatermentry({ id: item.id, mapid: item.mapid }).subscribe((res) => {
                //   this.respObject = res;
                //   // console.log(JSON.stringify(this.respObject));
                //   if (this.respObject.success) {
                //     this.messageService.sendAfterDelete(item.id);
                //     this.totalData = this.totalData - 1;
                //     this.messageService.setTotalData(this.totalData);
                //     this.notifier.notify('success', this.messageService.DELETE_SUCCESS);
                //   } else {
                //     this.notifier.notify('error', this.respObject.message);
                //   }
                // }, (err) => {
                //   this.notifier.notify('error', this.messageService.SERVER_ERROR);
                // });
              }
            }
  
            break;
        }
      });;
    }

  ngOnInit(): void {
    this.colordata = this.messageService.colors;
    //console.log("COLOR",this.colordata);
    this.dataLoaded = true;
    this.displayData = {
      pageName: '',
      openModalButton: '',
      breadcrumb: '',
      folderName: '',
      tabName: '',
    };
    

    const columnDefinitions = [

    ];
    this.messageService.setColumnDefinitions(columnDefinitions);
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.orgnId = this.messageService.orgnId;
      this.baseFlag = this.messageService.baseFlag;
      this.edit = this.messageService.edit;
      this.del = this.messageService.del;
      this.onPageLoad();
    } else {
      this.userAuth = this.messageService.getClientUserAuth().subscribe(auth => {
        // this.view = auth[0].viewFlag;
        // this.add = auth[0].addFlag;
        this.edit = auth[0].editFlag;
        this.del = auth[0].deleteFlag;
        this.clientId = auth[0].clientid;
        this.orgnId = auth[0].mstorgnhirarchyid;
        this.baseFlag = auth[0].baseFlag;
        this.groups = auth[0].group;
        this.onPageLoad();
      });
    }
  }


  onPageLoad() {
    // this.notifier.notify('error',"This page is coming soon")
  }


  reset() {
    
  }


  ngOnDestroy(): void {
    if (this.userAuth) {
      this.userAuth.unsubscribe();
    }
  }

}
