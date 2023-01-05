import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {RestApiService} from '../rest-api.service';
import {NotifierService} from 'angular-notifier';
import {MessageService} from '../message.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ConfigService} from '../config.service';
import {GridOption} from 'angular-slickgrid';
import {Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-generic-create-ticket',
  templateUrl: './generic-create-ticket.component.html',
  styleUrls: ['./generic-create-ticket.component.css']
})
export class GenericCreateTicketComponent implements OnInit, OnDestroy {


  clientId: any;
  notifier: NotifierService;
  respObject: any;
  add = false;

  private userAuth: Subscription;

  userGroups = [];
  @ViewChild('groupSelect') private groupSelect;
  userGroupSelected: number;
  userGroupId: number;
  userName: string;
  groupName: string;
  grpLevel: number;
  orgId: number;
  orgTypeId: number;
  organizationList = [];
  organizationId: any;
  levelSelected: any;
  levels = [];
  @Input() userId: number;
  @Input() OriginaluserGroupId: number;
  hascatalog: boolean;
  selectedColor: any;
  tableCss: any;
  darkCss: any;
  buttonCss: any;
  fontColor: any;
  footerItem: any;
  colorObj: any;

  searchRequestorLocation: FormControl = new FormControl();
  requestorLocationList = [];


  private modalserviceref: NgbModalRef;
  vipuser: string;
  ismanagement: boolean;
  parentorgid: number;
  groups = [];
  @ViewChild('content') private content;

  constructor(private rest: RestApiService, notifier: NotifierService, private messageService: MessageService,
              private route: Router, private actRoute: ActivatedRoute, private modalService: NgbModal,
              private dialog: MatDialog, private config: ConfigService) {
    this.notifier = notifier;
  }

  ngOnInit(): void {
    this.colorObj = this.messageService.colors;
    if (this.messageService.color) {
      this.selectedColor = this.messageService.color;
      for (let i = 0; i < this.colorObj.length; i++) {
        if (this.selectedColor === this.colorObj[i].selectedValue) {
          this.fontColor = this.colorObj[i].fontColorValue;
          this.footerItem = this.colorObj[i].footerItemValue;
          this.buttonCss = this.colorObj[i].buttonCss;
          this.tableCss = this.colorObj[i].tableCss;
          this.darkCss = this.colorObj[i].darkCss;
        }
      }
    }

    this.messageService.getColor().subscribe((data: any) => {
      this.selectedColor = data;
      for (let i = 0; i < this.colorObj.length; i++) {
        if (this.selectedColor === this.colorObj[i].selectedValue) {
          this.fontColor = this.colorObj[i].fontColorValue;
          this.footerItem = this.colorObj[i].footerItemValue;
          this.buttonCss = this.colorObj[i].buttonCss;
          this.tableCss = this.colorObj[i].tableCss;
          this.darkCss = this.colorObj[i].darkCss;
        }
      }
    });
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.userGroups = this.messageService.group;
      this.vipuser = this.messageService.vipuser;
      this.userGroupSelected = this.userGroups[0].id;
      this.orgId = this.messageService.orgnId;
      this.userId = Number(this.messageService.getUserId());
      this.orgTypeId = this.messageService.orgnTypeId;
      if (this.userGroups !== undefined) {
        if (this.messageService.getSupportGroup() === null) {
          this.userGroupId = this.userGroups[0].id;
          this.groupName = this.userGroups[0].groupname;
          this.grpLevel = this.userGroups[0].levelid;
          this.hascatalog = this.userGroups[0].hascatalog;
          this.ismanagement = this.userGroups[0].ismanagement;
        } else {
          const group = this.messageService.getSupportGroup();
          this.userGroupId = Number(group.groupId);
          for (let i = 0; i < this.userGroups.length; i++) {
            if (this.userGroups[i].id === this.userGroupId) {
              this.groupName = this.userGroups[i].groupname;
              this.grpLevel = this.userGroups[i].levelid;
              this.hascatalog = this.userGroups[i].hascatalog;
              this.ismanagement = this.userGroups[i].ismanagement;
            }
          }
        }
        this.userGroupSelected = this.userGroupId;
      }
      this.onPageLoad();
    }
    this.userAuth = this.messageService.getClientUserAuth().subscribe(auth => {
      this.userGroups = auth[0].group;
      this.clientId = auth[0].clientid;
      this.orgId = auth[0].mstorgnhirarchyid;
      this.orgTypeId = auth[0].orgntypeid;
      this.userId = auth[0].userid;
      this.vipuser = auth[0].vipuser;
      if (this.userGroups !== undefined) {
        if (this.messageService.getSupportGroup() === null) {
          this.userGroupId = this.userGroups[0].id;
          this.groupName = this.userGroups[0].groupname;
          this.grpLevel = this.userGroups[0].levelid;
          this.hascatalog = this.userGroups[0].hascatalog;
          this.ismanagement = this.userGroups[0].ismanagement;
        } else {
          const group = this.messageService.getSupportGroup();
          this.userGroupId = group.groupId;
          for (let i = 0; i < this.userGroups.length; i++) {
            if (this.userGroups[i].id === this.userGroupId) {
              this.groupName = this.userGroups[i].groupname;
              this.grpLevel = this.userGroups[i].levelid;
              this.hascatalog = this.userGroups[i].hascatalog;
              this.ismanagement = this.userGroups[i].ismanagement;
            }
          }
        }
        this.userGroupSelected = this.userGroupId;
      }
      this.onPageLoad();
    });
  }

  onPageLoad() {
    console.log(this.orgTypeId, this.grpLevel, this.parentorgid);
    if (this.orgTypeId === 2 && this.grpLevel > 1) {

      this.groups = [];
      this.getorganizationclientwise();
      setTimeout(() => {
        this.modalserviceref = this.modalService.open(this.content, {});
        this.modalserviceref.result.then((result) => {
        }, (reason) => {
        });
      }, 10);
    } else {
      this.organizationId = this.orgId;
      this.onOrganizationChange();
    }
  }

  getorganizationclientwise() {
    this.organizationId = 0;
    this.rest.getorgassignedcustomer({
      clientid: this.clientId,
      refuserid: Number(this.messageService.getUserId())
    }).subscribe((res: any) => {
      if (res.success) {
        this.organizationList = res.details.values;
        // this.levels = [];
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      // console.log(err);
    });
  }

  onOrganizationChange() {
    if (Number(this.organizationId) !== 0) {
      this.rest.geturlbykey({
        clientid: this.clientId,
        mstorgnhirarchyid: Number(this.organizationId),
        Urlname: 'createTicket'
      }).subscribe((res: any) => {
        if (res.success) {
          if (res.details.length > 0) {
            if (this.modalserviceref) {
              this.modalserviceref.close();
            }
            if (this.config.type === 'LOCAL') {
              if (res.details[0].url.indexOf(this.config.API_ROOT) > -1) {
                // console.log('inside')
                res.details[0].url = res.details[0].url.replace(this.config.API_ROOT, 'http://localhost:4200');
              }
            }
            // console.log(res.details[0].url)
            this.messageService.changeRouting(res.details[0].url, {a: Number(this.organizationId)});
          }
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        // console.log(err);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.userAuth) {
      this.userAuth.unsubscribe();
    }
  }
}
