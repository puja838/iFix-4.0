import {ChangeDetectorRef, Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {MatDrawer} from '@angular/material/sidenav';
import {identifierModuleUrl} from '@angular/compiler';
import {NgMaterialMultilevelMenuModule} from 'ng-material-multilevel-menu';
import {MediaMatcher} from '@angular/cdk/layout';
import {MessageService} from '../message.service';
import {NotifierService} from 'angular-notifier';
import {RestApiService} from '../rest-api.service';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.css']
})
export class TopNavbarComponent implements OnInit, OnDestroy {
  public opened = true;
  showFiller = false;
  truebar = false;
  isOpenSideBar = true;
  @ViewChild('drawer') public drawer: MatDrawer;
  showNotification: boolean;
  mailNotification: boolean;
  isProfile: boolean;
  respObject: any;
  userName: string;
  platformAdmin = [
    {
      'id': 1,
      'label': 'Module',
      'path': '/admin/module'
    }/*,
    {
      'id': 2,
      'label': 'Role',
      'path': '/admin/roles'
    }*/,
    {
      'id': 3,
      'label': 'Module Page-Url Mapping',
      'path': '/admin/urlCreation'
    }
  ];
  migrationAdmin=[
    {
      'id': 1,
      'label': 'Transport Table List',
      'path': '/admin/transportTableList'
    },
    {
      'id': 2,
      'label': 'Export Master Data',
      'path': '/admin/exportData'
    },
    {
      'id': 3,
      'label': 'Import Master Data',
      'path': '/admin/importData'
    },
    {
      'id': 4,
      'label': 'Update iFix System ID',
      'path': '/admin/updateSystemid'
    }
  ]
  clientAdmin = [
    {
      'id': 6,
      'label': 'Create Client',
      'path': '/admin/client'
    },
    {
      'id': 33,
      'label': 'Create Organization',
      'path': '/admin/organization'
    }, {
      'id': 34,
      'label': 'Organization Config',
      'path': '/admin/orgConfig'
    },
    {
      'id': 7,
      'label': 'Client Module Mapping',
      'path': '/admin/moduleClient'
    },
    {
      'id': 8,
      'label': 'Module Page-URL Mapping',
      'path': '/admin/urlMapping'
    },
    {
      'id': 9,
      'label': 'Role Mapping',
      'path': '/admin/userRoleMap'
    },
    {
      'id': 11,
      'label': 'Client Admin Creation',
      'path': '/admin/user'
    },
    {
      'id': 12,
      'label': 'Client Admin Role Mapping',
      'path': '/admin/roleUserMap'
    },
    {
      'id': 10,
      'label': 'Role Action Mapping',
      'path': '/admin/roleAction'
    },
    {
      'id': 15,
      'label': 'Role User Action Mapping',
      'path': '/admin/roleUserAction'
    },
    {
      'id': 17,
      'label': 'Create Menu',
      'path': '/admin/menus'
    },
    {
      'id': 18,
      'label': 'Map URL with Menu',
      'path': '/admin/menuUrl'
    },
    {
      'id': 13,
      'label': 'Module Role Mapping',
      'path': '/admin/roleModuleMap'
    },
    {
      'id': 14,
      'label': 'Module Role User Mapping',
      'path': '/admin/moduleUserRole'
    },
    {
      'id': 27,
      'label': 'Manage Property',
      'path': '/admin/propertyMapping'
    },
    {
      'id': 31,
      'label': 'Client Specific Url',
      'path': '/admin/clientSpecificUrl'
    },
    {
      'id': 32,
      'label': 'Menu Configuration',
      'path': '/admin/ticketMenuConfig'
    },
    {
      'id': 33,
      'label': 'Term Creation and Mapping',
      'path': '/admin/recordTerm'
    },{
      'id': 34,
      'label': 'Service Config',
      'path': '/admin/servicesConfig'
    },
    {
      'id': 35,
      'label': 'CR Additional Terms Mapping',
      'path': '/admin/crAdditionalTermsMapping'
    },
    {
      'id': 36,
      'label': 'SLA Term',
      'path': '/admin/slaTerm'
    },
    {
      'id': 37,
      'label': 'Dashboard Save Query',
      'path': '/admin/saveQuery'
    },
    {
      'id': 38,
      'label': 'Dashboard Copy Query',
      'path': '/admin/copyQuery'
    },
    {
      'id': 39,
      'label': 'Map Category With Keyword',
      'path': '/admin/mapCategoryWithKeyword'
    },
    {
      'id': 40,
      'label': 'UId Generation',
      'path': '/admin/uIdGeneration'
    },
    {
      'id': 41,
      'label': 'Record Activity Desc',
      'path': '/admin/activitySeq'
    },
    {
      'id': 42,
      'label': 'Organization wise Tools Mapping',
      'path': '/admin/toolsMapping'
    },
    {
      'id': 43,
      'label': 'Email Ticket Config',
      'path': '/admin/emailTicketConfig'
    },{
      'id': 44,
      'label': 'Data Report',
      'path': '/admin/dataReport',
    },{
      'id': 45,
      'label': 'Notification Template',
      'path': '/admin/notificationTemplate',
    },{
      'id': 46,
      'label': 'Map Property with Role',
      'path': '/admin/mapUserProperty',
    }
  ];
  mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;

  // private notifier: any;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private messageService: MessageService,
              private rest: RestApiService, private notifier: NotifierService) {


    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  ngOnInit() {
    this.isOpenSideBar = true;
    this.showNotification = false;
    this.mailNotification = false;
    this.isProfile = false;
    const userId = this.messageService.getUserId();
    this.rest.getUserDetailsById({userid: Number(userId)}).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.messageService.orgnTypeId = this.respObject.details[0].orgntypeid;
        this.messageService.roleId = this.respObject.details[0].Roleid;
        this.messageService.clientId = this.respObject.details[0].clientid;
        this.messageService.orgnId = this.respObject.details[0].mstorgnhirarchyid;
        this.userName = this.respObject.details[0].username;
        if (this.respObject.details[0].orgntypeid === 1) {
          this.respObject.details[0].baseFlag = true;
        } else {
          this.respObject.details[0].baseFlag = false;
        }
        this.messageService.baseFlag = this.respObject.details[0].baseFlag;
        this.messageService.view = this.respObject.details[0].viewFlag;
        this.messageService.add = this.respObject.details[0].addFlag;
        this.messageService.del = this.respObject.details[0].deleteFlag;
        this.messageService.edit = this.respObject.details[0].editFlag;
        this.messageService.clientname = this.respObject.details[0].clientname;
        this.messageService.setClientUserAuth(this.respObject.details);
        // console.log('this.respObject.details[0].viewFlag====' + this.respObject.details[0].viewFlag);
        // console.log('@@@@this.respObject.details====' + JSON.stringify(this.respObject.details[0]));
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

  notification() {
    this.showNotification = !this.showNotification;
    this.mailNotification = false;
    this.isProfile = false;
  }

  drawers() {
    // console.log("ok")
    // this.drawer.toggle();
    this.isOpenSideBar = !this.isOpenSideBar;
    // const id = document.getElementById('menuToggle');
    // id.classList.toggle('open');
  }

  mailNotifications() {
    this.mailNotification = !this.mailNotification;
    this.showNotification = false;
    this.isProfile = false;
  }

  profileDetail() {
    this.isProfile = !this.isProfile;
    this.showNotification = false;
    this.mailNotification = false;
  }

  logOut() {
    this.messageService.logOut();
  }

  changeRouting(path: string) {
    this.messageService.changeInternalRouting(path);
  }
}
