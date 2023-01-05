import {ChangeDetectorRef, Component, OnInit, ViewChild, OnDestroy, AfterViewInit} from '@angular/core';
import {MatDrawer} from '@angular/material/sidenav';
import {NgMaterialMultilevelMenuModule} from 'ng-material-multilevel-menu';
import {MediaMatcher} from '@angular/cdk/layout';
import {MessageService} from '../message.service';
import {RestApiService} from '../rest-api.service';
import {NotifierService} from 'angular-notifier';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ConfigService} from '../config.service';
import {Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import {SocketService} from '../socket.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy, AfterViewInit {
  public opened = true;
  showFiller = false;
  truebar = false;
  isOpenSideBar = true;
  @ViewChild('drawer') public drawer: MatDrawer;
  showNotification: boolean;
  mailNotification: boolean;
  isProfile: boolean;
  respObject: any;
  navbar = [];

  mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;
  navLoaded: boolean;
  username: string;
  isEndUser: boolean;

  userinfo: any[];
  clientId: number;
  orgId: number;
  userId: number;
  private infoRef: MatDialogRef<unknown, any>;
  @ViewChild('userInfo') private userInfo;
  @ViewChild('logininfo') private logininfo;
  selectedBranch: any;
  selectedMobileNo: any;
  selectedEmail: any;
  dialogRef: any;
  @ViewChild('content') myModal: any;
  Newpassword: string;
  confirmpassword: string;
  password: string;
  currentYear: number;
  profileValue: any;
  sideNavCss: any;
  fontColor: any;
  footerCss: any;
  footerItem: any;
  colorObj: any;
  selectedColor: string;
  worker: Worker;
  private TOKEN_INTERVAL_TIME = 50 * 60 * 1000;
  banners = [];
  private groupChangeSubscribe: Subscription;
  tNumber: string;
  searchUser: FormControl = new FormControl();
  fontSize: any;
  colorCss: any;
  isSearching: boolean;
  isLoading = false;
  userDtl = [];
  private loginRef: MatDialogRef<unknown, any>;
  private userselectedid: number;
  searchTerm: FormControl = new FormControl();
  isLoaderLoading: boolean;
  menus = [];
  menuSelected: any;
  logintypeid: number;
  defGrpSelected: any;
  // defGrpId: any;
  // defUserId: any;
  // defGroups: any;

  // resObject1: any;


  @ViewChild('changeDefaultGroup') private changeDefaultGroup;
  changeDefaultGroupModal: any;
  selectedOrganization: number;
  changedSupportGroupSelected: number;
  organizations = [];
  orgName: string;
  groupLists = [];
  groupName: string;
  config: any;
  dataLoadedForChangeSupportGroup: boolean;
  createtype: number;
  uploadedfilename = '';
  aaiLogo: boolean;
  dispalyImage: any;
  href = '';
  dashboardUrlforBg = '';
  imageBG = '';
  private socketinterval: any;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private messageService: MessageService, private config1: ConfigService,
              private rest: RestApiService, private actRoute: ActivatedRoute, private sanitizer: DomSanitizer, private notifier: NotifierService,
              private route: Router, private dialog: MatDialog, private socketService: SocketService) {
    this.messageService.getCreateTicketData().subscribe((data) => {
      // this.messageService.changeRouting(this.messageService.dashboardUrl);
      // console.log('inside navbar ticket');
    });
    this.config = config1;
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
    this.groupChangeSubscribe = this.messageService.getGroupChangeData().subscribe((data) => {
      this.getbanner(Number(data));
    });
    this.searchUser.valueChanges.subscribe(
      name => {
        const data = {
          loginname: name, clientid: Number(this.clientId), mstorgnhirarchyid: Number(this.orgId), type: 'email'
        };
        this.isLoading = true;
        this.userDtl = [];
        if (name !== '') {
          this.rest.searchUserByOrgnId(data).subscribe((res: any) => {
            // console.log('data======' + JSON.stringify(data));
            this.isLoading = false;
            if (res.success) {
              this.userDtl = res.details;
            } else {
              this.notifier.notify('error', res.message);
            }
          }, (err) => {
            this.isLoading = false;
            this.notifier.notify('error', this.messageService.SERVER_ERROR);
          });
        } else {
          this.isLoading = false;
        }
      });

    this.searchTerm.valueChanges.subscribe(
      val => {
        if (val !== '') {
          this.isLoaderLoading = true;
          const data = {
            clientid: this.clientId,
            mstorgnhirarchyid: this.orgId,
            menu: val
          };
          this.rest.searchmenubyuser(data).subscribe((res: any) => {
            this.isLoaderLoading = false;
            if (res.success) {
              this.menus = res.details;
            } else {
            }
          }, (err) => {
            this.isLoaderLoading = false;
          });
        }
      });

    /*this.socketService.listen().subscribe((data: any) => {
      console.log('\n RESPONSE CONNECTION BUILD.........', JSON.stringify(data));
      this.notifier.notify('success', 'Socket Connection Build...');
    });*/
  }

  ngAfterViewInit() {
    // nabar enable / disable function
    this.route.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes('dashboard')) {
          this.messageService.uploadFileName = sessionStorage.getItem('uploadedbgimage');
          // this.displayImgData = this.messageService.getDownloadBgImage()
          // console.log(this.displayImgData)
          this.downloadFileBg();
        } else {
          this.messageService.uploadFileName = '';
          this.dispalyImage = 'none';
        }
      }
    });
  }

  ngOnInit() {
    this.defGrpSelected = 0;
    this.dataLoadedForChangeSupportGroup = false;
    this.onNavPageLoad();
    // this.actRoute.queryParams.subscribe((params: any) => {
    //   console.log(params);
    //   if (!this.messageService.isEmpty(params)) {
    //     const userId = this.messageService.getUserId();
    //     const token = this.messageService.getToken();
    //     if (userId !== null && userId !== undefined && token !== null && token !== undefined) {
    //       this.onNavPageLoad();
    //     } else {
    //       const uid = params['uid'];
    //       const tkn = params['token'];
    //       const userid = this.messageService.xorEncode(atob(params['uid']), this.messageService.SECRET_TOKEN);
    //       console.log(userid);
    //
    //     }
    //
    //   } else {
    //     console.log('outside');
    //     this.onNavPageLoad();
    //   }
    // });

  }

  onNavPageLoad() {
    this.isSearching = false;
    this.isEndUser = true;
    this.colorObj = this.messageService.colors;
    if (this.route.url.indexOf('/ticket') > -1 || this.route.url.indexOf('/user/dataReport') > -1) {
      this.isOpenSideBar = false;
    } else {
      this.isOpenSideBar = true;
    }
    this.currentYear = new Date().getFullYear();
    this.showNotification = false;
    this.mailNotification = false;
    this.isProfile = false;
    const userId = this.messageService.getUserId();
    this.userId = Number(userId);
    this.rest.getUserDetailsById({userid: Number(userId)}).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.logintypeid = this.respObject.details[0].logintypeid;
        this.createtype = this.respObject.details[0].createtype;
        this.messageService.orgnTypeId = this.respObject.details[0].orgntypeid;
        this.messageService.roleId = this.respObject.details[0].Roleid;
        this.clientId = this.respObject.details[0].clientid;
        this.messageService.orgnId = this.orgId = this.respObject.details[0].mstorgnhirarchyid;
        this.messageService.username = this.respObject.details[0].username;
        this.messageService.loginname = this.respObject.details[0].loginname;
        this.messageService.email = this.respObject.details[0].email;
        this.messageService.mobile = this.respObject.details[0].mobile;
        this.messageService.branch = this.respObject.details[0].branch;
        this.messageService.firstname = this.respObject.details[0].firstname;
        this.messageService.lastname = this.respObject.details[0].lastname;
        this.messageService.clientname = this.respObject.details[0].clientname;
        this.messageService.mstorgnname = this.respObject.details[0].mstorgnname;
        // this.socketService.userRoomJoin(this.messageService.getUserId());
        this.messageService.uploadedLogoFileName = this.respObject.details[0].uploadedlogoimage;
        let savecolor = this.respObject.details[0].color;
        if (savecolor === '') {
          savecolor = this.messageService.colors[0].selectedValue;
          this.setColor(savecolor);
        } else {
          this.setColor(savecolor);
        }
        this.messageService.setColorEvent(savecolor);

        this.messageService.vipuser = this.respObject.details[0].vipuser;
        this.messageService.group = this.respObject.details[0].group;
        this.defGrpSelected = this.respObject.details[0].deafultgroup;
        this.messageService.defaultGroupId = this.defGrpSelected;
        // this.defGroups = this.respObject.details[0].group;

        if (this.respObject.details[0].group.length > 0) {
          if (this.respObject.details[0].group.length > 1) {
            this.isEndUser = false;
          } else {
            if (this.respObject.details[0].group[0].levelid > 1) {
              this.isEndUser = false;
            }
          }
        } else {
          this.isEndUser = false;
        }

        const urls = this.respObject.details[0].urls;
        for (let i = 0; i < urls.length; i++) {
          if (this.config.type === 'LOCAL') {
            if (urls[i].url.indexOf(this.config.API_ROOT) > -1) {
              urls[i].url = urls[i].url.replace(this.config.API_ROOT, 'http://localhost:4200');
              // console.log(urls[i].url)
            }
          }
          if (urls[i].urlkey === 'logout') {
            this.messageService.logOutUrl = urls[i].url;
          }
          if (urls[i].urlkey === 'DisplayTicketDetails') {
            this.messageService.displayTicketUrl = urls[i].url;
          }
          if (urls[i].urlkey === 'ExternalTicket') {
            this.messageService.externalUrl = urls[i].url;
          }
          if (urls[i].urlkey === 'dashboard') {
            this.dashboardUrlforBg = this.messageService.dashboardUrl = urls[i].url;
          }
          if (urls[i].urlkey === 'createTicket') {
            this.messageService.createUrl = urls[i].url;
          }
          if (urls[i].urlkey === 'viewTicket') {
            this.messageService.viewUrl = urls[i].url;
          }
          if (urls[i].urlkey === 'CloneTicket') {
            this.messageService.cloneUrl = urls[i].url;
          }
          if (urls[i].urlkey === 'Generic_Create_Ticket') {
            this.messageService.genericCreateTicket = urls[i].url;
          }
        }
        this.username = this.respObject.details[0].username;
        if (this.respObject.details[0].orgntypeid === 1) {
          this.respObject.details[0].baseFlag = true;
        } else {
          this.respObject.details[0].baseFlag = false;
        }

        this.href = this.route.url;

        const url = this.dashboardUrlforBg.replace(this.config.API_ROOT, 'http://localhost:4200');
        ;
        const pageURL = url.split('//localhost:4200');

        // console.log(pageURL)
        if (this.href === pageURL[1]) {
          this.messageService.uploadFileName = this.respObject.details[0].uploadedbgimage;
          sessionStorage.setItem('uploadedbgimage', this.messageService.uploadFileName);
        } else {
          this.messageService.uploadFileName = '';
        }
        this.messageService.view = this.respObject.details[0].viewFlag;
        this.messageService.add = this.respObject.details[0].addFlag;
        this.messageService.del = this.respObject.details[0].deleteFlag;
        this.messageService.edit = this.respObject.details[0].editFlag;


        if (this.messageService.group.length > 0) {
          this.getbanner(this.messageService.group[0].id);
        }
        const data = {
          clientid: this.clientId,
          mstorgnhirarchyid: this.messageService.orgnId,
          userid: this.userId

        };
        this.navLoaded = false;
        this.rest.getmenubyuser(data).subscribe((res: any) => {
          if (res.success) {
            if (res.details !== null) {
              this.navbar = this.messageService.generateMenu(res.details);
              console.log(this.navbar)
            }
            this.navLoaded = true;
          } else {
          }
        }, (err) => {

        });
        if (Worker) {
          this.worker = new Worker('../assets/worker/tokenWorker.js');
          this.onmessage();
          this.worker.postMessage({
            url: this.rest.apiRoot + '/generatetoken',
            postdata: {
              clientid: this.clientId,
              mstorgnhirarchyid: this.orgId,
              loginname: this.messageService.loginname,
              type: 'internal'
            },
            event: 'generateToken',
            time: this.TOKEN_INTERVAL_TIME
          });
        }
        if (this.messageService.uploadedLogoFileName !== '') {
          this.downloadFile();
          this.aaiLogo = true;
        } else {
          this.aaiLogo = false;
        }
        if (this.messageService.uploadFileName !== '') {
          this.downloadFileBg();
        } else {
          // console.log(">>>>>>")
        }
        // console.log('sending....')
        if (!this.messageService.clientId) {
          this.messageService.setClientUserAuth(this.respObject.details);
        }
        this.messageService.clientId = this.clientId;
        this.socketinterval = setInterval(() => {
          this.socketConnection();
        }, 50);


      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      // this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  socketConnection() {
    if (this.messageService.isSocketConnected) {
      if (this.messageService.group.length > 0) {
        for (let i = 0; i < this.messageService.group.length; i++) {
          this.socketService.emit('groupRoomJoin', this.messageService.group[i].id);
        }
      }
      this.socketService.emit('userRoomJoin', this.userId);
      clearInterval(this.socketinterval)
    }
  }

  onmessage(): void {
    this.worker.onmessage = (data: any) => {
      const res = JSON.parse(data.data.result);
      if (res.success) {
        this.messageService.setToken(res.details[0].token);
      } else {
        this.notifier.notify('error', res.message);
      }
    };
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
    this.worker.terminate();
  }

  // updateDefGroup() {
  //   const data = {
  //     groupid: Number(this.defGrpSelected)
  //   };
  //   // console.log(data);
  //   if (Number(this.defGrpSelected) !== 0) {
  //
  //     this.rest.updateuserdefaultgrp(data).subscribe((res) => {
  //       this.respObject = res;
  //       if (this.respObject.success) {
  //         this.messageService.defaultGroupId = Number(this.defGrpSelected);
  //         this.notifier.notify('success', this.messageService.EDIT_SUCCESS);
  //       } else {
  //         this.notifier.notify('error', this.respObject.message);
  //       }
  //     }, (err) => {
  //       this.notifier.notify('error', this.messageService.SERVER_ERROR);
  //     });
  //   } else {
  //     this.notifier.notify('error', 'Please select a Default group');
  //   }
  // }

  getbanner(groupid) {
    const data = {
      clientid: this.messageService.clientId,
      mstorgnhirarchyid: this.messageService.orgnId,
      groupid: [groupid]
    };
    this.rest.getbannermessage(data).subscribe((res: any) => {
      if (res.success) {
        this.banners = res.details;
        if (this.banners.length > 0) {
          this.fontSize = String(this.banners[0].size).concat('px');
          this.colorCss = this.banners[0].color;
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {

    });
  }

  searchTicket(event) {
    if (event.keyCode === 13) {
      this.isSearching = true;
      const data = {
        'clientid': this.clientId,
        'mstorgnhirarchyid': this.orgId,
        //'recorddiffid': Number(storage.type),
        'RecordNo': this.tNumber.trim()
      };
      this.rest.getrecorddetailsbyno(data).subscribe((res: any) => {
        this.isSearching = false;
        if (res.success) {
          if (res.details.length > 0) {
            const group = this.messageService.getSupportGroup();
            let grpLevel = 0;
            // console.log(group)
            if (group !== null) {
              // userGroupId = group.groupId;
              grpLevel = group.levelid;
            } else {
              if (Number(this.messageService.defaultGroupId) !== 0) {
                const defuserGroupId = Number(this.messageService.defaultGroupId);
                for (let i = 0; i < this.messageService.group.length; i++) {
                  if (this.messageService.group[i].id === defuserGroupId) {
                    // console.log(JSON.stringify(this.messageService.group[i]));
                    grpLevel = this.messageService.group[i].levelid;
                  }
                }
              } else {
                if (this.messageService.group.length > 0) {
                  grpLevel = this.messageService.group[0].levelid;
                }
              }
            }
            // console.log(location.href);
            if (grpLevel === 1) {
              if (res.details[0].creatorid === this.userId || res.details[0].originaluserid === this.userId) {
                this.tNumber = '';
                this.rest.geturlbykey({
                  clientid: res.details[0].clientid,
                  mstorgnhirarchyid: res.details[0].mstorgnhirarchyid,
                  Urlname: 'DisplayTicketDetails'
                }).subscribe((res1: any) => {
                  if (res1.success) {
                    if (res1.details.length > 0) {
                      if (this.config.type === 'LOCAL') {
                        if (res1.details[0].url.indexOf(this.config.API_ROOT) > -1) {
                          res1.details[0].url = res1.details[0].url.replace(this.config.API_ROOT, 'http://localhost:4200');
                        }
                      }
                      let url = this.messageService.getNavigation();
                      if (url !== null) {
                        url = url + ',' + location.href;
                      } else {
                        url = location.href;
                      }
                      console.log(url);
                      this.messageService.setNavigation(url);
                      this.messageService.changeRouting(res1.details[0].url, {
                        id: res.details[0].id,
                      });
                    }
                  } else {
                    this.notifier.notify('error', res.message);
                  }
                }, (err) => {
                  // console.log(err);
                });
              } else {
                this.notifier.notify('error', this.messageService.NO_TICKET_FOUND);
              }
            } else {
              this.tNumber = '';
              this.rest.geturlbykey({
                clientid: res.details[0].clientid,
                mstorgnhirarchyid: res.details[0].mstorgnhirarchyid,
                Urlname: 'DisplayTicketDetails'
              }).subscribe((res1: any) => {
                if (res1.success) {
                  if (res1.details.length > 0) {
                    if (this.config.type === 'LOCAL') {
                      if (res1.details[0].url.indexOf(this.config.API_ROOT) > -1) {
                        res1.details[0].url = res1.details[0].url.replace(this.config.API_ROOT, 'http://localhost:4200');
                      }
                    }
                    let url = this.messageService.getNavigation();
                    if (url !== null) {
                      url = url + ',' + location.href;
                    } else {
                      url = location.href;
                    }
                    // console.log(url)
                    this.messageService.setNavigation(url);
                    this.messageService.changeRouting(res1.details[0].url, {
                      id: res.details[0].id,
                    });
                  }
                } else {
                  this.notifier.notify('error', res.message);
                }
              }, (err) => {
                // console.log(err);
              });

            }

          } else {
            this.notifier.notify('error', this.messageService.NO_TICKET_FOUND);
          }
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });

    }
  }

  notification() {
    this.showNotification = !this.showNotification;
    this.mailNotification = false;
    this.isProfile = false;
  }

  drawers() {
    this.isOpenSideBar = !this.isOpenSideBar;
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
    console.log(path);
    if (path !== '') {
      this.messageService.changeRouting(path);
    }
  }

  dashboard() {
    this.messageService.changeRouting(this.messageService.dashboardUrl);
  }


  openUserInfo() {
    this.userinfo = [];
    const data = {'clientid': this.clientId, 'mstorgnhirarchyid': this.orgId, 'id': this.userId};
    this.rest.useridwiseuserinfo(data).subscribe((res: any) => {
      if (res.success) {
        this.userinfo = res.details;
        this.selectedEmail = this.userinfo[0].useremail;
        this.selectedMobileNo = this.userinfo[0].usermobileno;
        this.selectedBranch = this.userinfo[0].branch;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
    this.infoRef = this.dialog.open(this.userInfo, {
      width: '600px', height: '500px'
    });
  }

  closeinfo() {
    this.infoRef.close();
  }


  update() {

    const data = {
      id: this.userinfo[0].id,
      clientid: this.userinfo[0].clientid,
      mstorgnhirarchyid: this.userinfo[0].mstorgnhirarchyid,
      loginname: this.userinfo[0].loginname,
      firstname: this.userinfo[0].firstname,
      lastname: this.userinfo[0].lastname,
      secondaryno: this.userinfo[0].secondaryno,
      division: this.userinfo[0].division,
      brand: this.userinfo[0].brand,
      city: this.userinfo[0].city,
      designation: this.userinfo[0].designation,
      vipuser: this.userinfo[0].vipuser,
      usertype: this.userinfo[0].usertype,
      usermobileno: this.selectedMobileNo.trim(),
      useremail: this.selectedEmail.trim(),
      branch: this.selectedBranch,
    };

    // console.log('-------------------' + JSON.stringify(data));
    if (!this.messageService.isBlankField(data)) {
      this.rest.updateclientuser(data).subscribe((res) => {
        this.respObject = res;
        // console.log('\n\n RESPONSE OBJECT ::  ' + JSON.stringify(this.respObject));
        if (this.respObject.success) {
          this.closeinfo();
          this.notifier.notify('success', this.messageService.EDIT_SUCCESS);
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


  change_password() {
    this.dialogRef = this.dialog.open(this.myModal, {width: '560px', height: '460px'});
  }

  onNoClick() {
    this.dialogRef.close();
  }

  submit() {
    const pattern = /^[a-zA-Z0-9!@#$%^&*]{8,20}$/;
    if (!this.Newpassword.match(pattern)) {
      this.notifier.notify('error', this.messageService.PASSWORD_PATTERN);
    } else if (this.Newpassword === this.password) {
      this.notifier.notify('error', this.messageService.SAME_PASSWORD);
    } else {
      if (this.Newpassword === this.confirmpassword) {
        if ((/[a-z]/).test(this.Newpassword) && (/[A-Z]/).test(this.Newpassword)) {
          if ((/[0-9]/).test(this.Newpassword) || (/[!@#$%^&*]/).test(this.Newpassword)) {
            const data = {
              oldpassword: this.password,
              password: this.confirmpassword,
              id: this.userId
            };
            this.rest.changepassword(data).subscribe((res: any) => {
              if (res.success) {

                this.notifier.notify('success', this.messageService.PASSWORD_CHANGED);
                this.messageService.logOut();
              } else {
                this.notifier.notify('error', res.message);
              }
            }, (err) => {
              this.notifier.notify('error', this.messageService.SERVER_ERROR);
            });

          } else {
            this.notifier.notify('error', this.messageService.NUMBER_SYMBOL_CHECK);
          }
        } else {
          this.notifier.notify('error', this.messageService.UPPER_LOWER_CHECK);
        }
      } else {
        this.notifier.notify('error', this.messageService.NEW_CONFIRM_PASS_ERROR);
      }
    }

  }

  updateColor(color) {
    const data = {
      color: color
    };
    this.rest.updateusercolor(data).subscribe((res: any) => {
      if (res.success) {
        this.messageService.setColorEvent(color);
        this.setColor(color);
        this.notifier.notify('success', this.messageService.THEME_CHANGE);
      } else {
        this.notifier.notify('error', res.message);
      }
    });
  }

  setColor(newColor) {
    this.selectedColor = newColor;
    this.messageService.color = newColor;
    for (let i = 0; i < this.colorObj.length; i++) {
      if (newColor === this.colorObj[i].selectedValue) {
        this.sideNavCss = this.colorObj[i].sideNavValue;
        this.fontColor = this.colorObj[i].fontColorValue;
        this.footerCss = this.colorObj[i].footerCssValue;
        this.footerItem = this.colorObj[i].footerItemValue;
        this.profileValue = this.colorObj[i].profile;
      }
    }
  }

  login() {
    const data = {'clientid': this.clientId, 'mstorgnhirarchyid': this.orgId, 'id': this.userselectedid};
    this.rest.inpersonatelogin(data).subscribe((res: any) => {
      if (res.success) {
        const userId = res.details[0].userid;
        const token = res.details[0].token;
        window.location.reload();
        sessionStorage.clear();
        this.messageService.addSessionData(userId, token);
        /*delete this.messageService.clientId;
        this.closelogin();
        this.worker.terminate()
        if (this.route.url.indexOf('/ticket') > -1) {
          this.ngOnInit();
        } else {
          this.messageService.changeRouting(this.messageService.dashboardUrl);
        }*/

      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  closelogin() {
    this.loginRef.close();
  }

  openLoginInfo() {
    this.userDtl = [];
    this.loginRef = this.dialog.open(this.logininfo, {
      width: '600px', height: '140px'
    });
  }

  onUserSelected(user) {
    this.userselectedid = user.id;
    // console.log(this.userselectedid);
  }

  onMenuSelected(menu) {
    if (menu.path !== '') {
      this.changeRouting(menu.path);
    }
  }

  openDefaultSupportGroupModal() {
    this.organizations = [];
    this.groupLists = [];
    this.selectedOrganization = 0;
    this.changedSupportGroupSelected = 0;
    this.orgName = '';
    this.groupName = '';
    this.getOrganization();
    this.dataLoadedForChangeSupportGroup = false;
    this.changeDefaultGroupModal = this.dialog.open(this.changeDefaultGroup, {
      width: '600px', height: '200px'
    });
  }

  closeDefaultSupportGroupModal() {
    this.changeDefaultGroupModal.close();
  }

  getOrganization() {
    this.rest.getorgassignedcustomer({clientid: Number(this.clientId), refuserid: Number(this.userId)}).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.organizations = this.respObject.details.values;
        // this.onOrganizationChange(this.selectedOrganization);
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onOrganizationChange(index) {
    this.orgName = this.organizations[index - 1].mstorgnhirarchyname;
    // console.log("\n >>>>>>>>>>    ",this.orgName, index, this.selectedOrganization)
    this.getSupportGroup();
  }

  getSupportGroup() {
    const data = {clientid: Number(this.clientId), mstorgnhirarchyid: Number(this.selectedOrganization), refuserid: Number(this.userId)};
    this.rest.groupbyuserwise(data).subscribe((res: any) => {
      if (res.success) {
        this.groupLists = res.details;
        this.changedSupportGroupSelected = 0;
        for (let i = 0; i < this.groupLists.length; i++) {
          if (Number(this.groupLists[i].defaultgroup) === 1) {
            this.changedSupportGroupSelected = this.groupLists[i].id;
            break;
          }
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onGroupChange(index) {
    this.groupName = this.groupLists[index - 1].groupname;
    //console.log(this.groupName, index)
  }

  onDefaultSupportGroupChange() {
    const data = {
      'clientid': Number(this.clientId),
      'mstorgnhirarchyid': Number(this.selectedOrganization),
      'refuserid': Number(this.userId),
      'groupid': Number(this.changedSupportGroupSelected)
    };
    // console.log("\n DATA is ::==>>>>   ", JSON.stringify(data));
    if (!this.messageService.isBlankField(data)) {
      this.dataLoadedForChangeSupportGroup = true;
      this.rest.mstusersupportgroupchange(data).subscribe((res) => {
        this.dataLoadedForChangeSupportGroup = false;
        this.respObject = res;
        if (this.respObject.success) {
          // console.log("\n this.respObject ====   ", this.respObject);
          // this.reset();
          this.notifier.notify('success', this.messageService.SUPPORT_GROUP_UPDATE_SUCCESS);
          this.changeDefaultGroupModal.close();
        } else {
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        // this.isError = true;
        this.dataLoadedForChangeSupportGroup = false;
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    } else {
      // this.isError = true;
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }
  }


  downloadFile() {
    const data = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.orgId,
      'filename': this.messageService.uploadedLogoFileName
    };

    this.rest.filedownload(data).subscribe((blob: any) => {
      const objectUrl = URL.createObjectURL(blob);
      let navImage = document.getElementById('navImage') as HTMLImageElement;
      navImage.src = objectUrl;
      //this.messageService.setURL(objectUrl)
    });
  }

  downloadFileBg() {
    const data = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.orgId,
      'filename': this.messageService.uploadFileName
    };
    this.rest.filedownload(data).subscribe((blob: any) => {
      const objectUrl = URL.createObjectURL(blob);

      this.dispalyImage = this.sanitizer.bypassSecurityTrustStyle(`url(${objectUrl})`);
      this.imageBG = this.dispalyImage;
    });
  }
}

