import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NotifierService} from 'angular-notifier';

import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';
import {RestApiService} from '../rest-api.service';
import {MessageService} from '../message.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FormControl} from '@angular/forms';
import {ConfigService} from '../config.service';
import {DomSanitizer, SafeHtml, SafeUrl, SafeStyle} from '@angular/platform-browser';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  roleSelected: any;
  condition1: any;
  condition2: any;
  clientId: number;
  notifier: NotifierService;
  orgId: number;
  userGroups = [];
  userGroupSelected: number;
  private userAuth: Subscription;
  userGroupId: number;
  groupName: any;
  grpLevel: number;
  typSelected: number;
  ticketsTyp: any;
  priorityName: any;
  ticketTypeArr = {};
  isassetattached: boolean;
  categoryArr = [];
  respObject: any;
  TICKET_TYPE_ID: number;
  recordType = [];
  ticketTypeLoaded = false;
  TICKET_TYPE_SEQ = 1;
  CAT_SEQ = 0;
  dataLoaded: boolean;
  totalData: any;
  dataset: any;
  typeSeq: number;
  load: boolean;
  tilesDetails: any;
  tilesSelected: number;
  count: number;
  domE: any;
  isDashboard: boolean;
  catalog = [];
  step: string;
  bread = [];
  childCat = [];
  catSelected: string;
  searchTerm: FormControl = new FormControl();
  hascatalog: string;
  isLoaderLoading: boolean;
  categories = [];
  private cat_id: number;
  recentRecordData: any[];
  frequestissues = [];
  username: string;
  selectedColor: any;
  footerCss: any;
  dashbordTittleCss: any;
  pageNameCss: any;
  colorObj: any;
  private TASK_SEQ = [];
  STASK_SEQ = 3;
  SR_SEQ = 2;
  CTASK_SEQ = 5;
  CR_SEQ = 4;
  PTASK_SEQ = 7;


  orgSelected = [];
  selectedMultipleOrgs = [];
  orgTypeId: number;
  loginOrgName: any;
  selectedOrgVals: any;
  userGroupsOrgWise = [];
  userGroupOrgWiseSelected = [];

  workspaceSelected: any;
  ismanagement: string;
  isAllOrg: boolean;
  isAllGrp: boolean;
  selectedSupportGrpIds: string;
  dispalyImage: any;
  lebelCss: any;

  constructor(private rest: RestApiService, notifier: NotifierService, public messageService: MessageService,
              private route: Router, private modalService: NgbModal, private dialog: MatDialog, private sanitizer: DomSanitizer, private config: ConfigService) {
    this.notifier = notifier;

    this.searchTerm.valueChanges.subscribe(
      val => {
        this.isLoaderLoading = true;
        const data = {
          'clientid': this.clientId,
          'mstorgnhirarchyid': this.orgId,
          'recorddifftypeid': this.cat_id,
          'name': val
        };
        this.rest.searchcategory(data).subscribe((res: any) => {
          this.isLoaderLoading = false;
          if (res.success) {
            this.categories = res.details;
          } else {
            // this.isError = true;
            // this.errorMessage = this.respObject.errorMessage;
          }
        }, (err) => {
          this.isLoaderLoading = false;
        });
      });
  }

  ngOnInit(): void {
    // this.workspaceSelected = 1;
    this.TASK_SEQ = [this.CTASK_SEQ, this.STASK_SEQ, this.PTASK_SEQ];
    this.isassetattached = true;
    this.colorObj = this.messageService.colors;
    if (this.messageService.color) {
      this.selectedColor = this.messageService.color;
      for (let i = 0; i < this.colorObj.length; i++) {
        if (this.selectedColor === this.colorObj[i].selectedValue) {
          this.footerCss = this.colorObj[i].footerCssValue;
          this.pageNameCss = this.colorObj[i].pageNameCss;
          this.dashbordTittleCss = this.colorObj[i].dashbordTittleCss;
        }
      }
    }
    this.messageService.getColor().subscribe((data: any) => {
      this.selectedColor = data;
      for (let i = 0; i < this.colorObj.length; i++) {
        if (this.selectedColor === this.colorObj[i].selectedValue) {
          this.footerCss = this.colorObj[i].footerCssValue;
          this.pageNameCss = this.colorObj[i].pageNameCss;
          this.dashbordTittleCss = this.colorObj[i].dashbordTittleCss;
        }
      }
    });
    // console.log(this.messageService.clientId);
    if (this.messageService.clientId) {
      this.clientId = this.messageService.clientId;
      this.userGroups = this.messageService.group;
      this.orgId = this.messageService.orgnId;
      this.orgTypeId = this.messageService.orgnTypeId;
      if (this.userGroups !== undefined && this.userGroups.length > 0) {
        if (this.messageService.getSupportGroup() === null) {
          if (Number(this.messageService.defaultGroupId) !== 0) {
            this.userGroupId = Number(this.messageService.defaultGroupId);
          } else {
            this.userGroupId = this.userGroups[0].id;
          }
        } else {
          const group = this.messageService.getSupportGroup();
          this.userGroupId = group.groupId;
        }
        for (let i = 0; i < this.userGroups.length; i++) {
          if (this.userGroups[i].id === this.userGroupId) {
            this.groupName = this.userGroups[i].groupname;
            this.grpLevel = this.userGroups[i].levelid;
            this.hascatalog = this.userGroups[i].hascatalog;
            this.ismanagement = this.userGroups[i].ismanagement;
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
      if (this.userGroups !== undefined && this.userGroups.length > 0) {
        if (this.messageService.getSupportGroup() === null) {
          if (Number(this.messageService.defaultGroupId) !== 0) {
            this.userGroupId = Number(this.messageService.defaultGroupId);
          } else {
            this.userGroupId = this.userGroups[0].id;
          }
        } else {
          const group = this.messageService.getSupportGroup();
          this.userGroupId = group.groupId;
        }
        for (let i = 0; i < this.userGroups.length; i++) {
          if (this.userGroups[i].id === this.userGroupId) {
            this.groupName = this.userGroups[i].groupname;
            this.grpLevel = this.userGroups[i].levelid;
            this.hascatalog = this.userGroups[i].hascatalog;
            this.ismanagement = this.userGroups[i].ismanagement;
          }
        }
        this.userGroupSelected = this.userGroupId;
      }
      this.onPageLoad();
    });
    // }
  }

  onPageLoad() {
    // console.log(this.userGroupId)
    this.username = this.messageService.username;
    this.isDashboard = true;
    this.categories = [];
    // console.log(this.ismanagement);
    const workspace = this.messageService.getWorkspace();
    if (workspace !== null) {
      this.workspaceSelected = workspace;
    } else {
      this.workspaceSelected = this.messageService.workspaces[0].id;
    }
    // console.log('workspaceSelected:' + this.workspaceSelected);
    if (this.grpLevel === 1) {
      this.selectedOrgVals = this.orgId + '';
      this.selectedSupportGrpIds = this.userGroupId + '';
      this.getRecordDiffType();
      this.getRecentRecords();
    } else {
      if (Number(this.orgTypeId) === 2) {
        this.getorgassignedcustomer();
        this.isAllOrg = true;
      } else {
        this.selectedOrgVals = this.orgId + '';
        this.onOrgChange(this.selectedOrgVals, 'edit');
      }
    }
    if (this.messageService.uploadFileName !== '') {
      this.lebelCss = 'white';
    } else {
      // this.background =
    }
  }

  getorgassignedcustomer() {
    const data = {
      clientid: this.clientId,
      refuserid: Number(this.messageService.getUserId())
    };
    this.rest.getorgassignedcustomer(data).subscribe((res: any) => {
      if (res.success) {
        this.selectedMultipleOrgs = res.details.values;
        if (this.selectedMultipleOrgs.length > 0) {
          this.isAllGrp = true;
          if (this.messageService.getOrgs() !== null) {
            const savedOrgs = this.messageService.getOrgs();
            const savedOrgsArr = savedOrgs.split(',');
            for (let i = 0; i < savedOrgsArr.length; i++) {
              this.orgSelected.push(Number(savedOrgsArr[i]));
            }
          } else {
            for (let i = 0; i < this.selectedMultipleOrgs.length; i++) {
              this.orgSelected.push(Number(this.selectedMultipleOrgs[i].mstorgnhirarchyid));
            }
            this.messageService.saveOrgs(this.orgSelected.toString());
          }
          // console.log(this.orgSelected);
          this.onOrgChange(this.orgSelected, 'all');
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onOrgChange(selectedIDs, type) {
    // console.log(JSON.stringify(selectedIDs));
    if (selectedIDs.length < 1) {
      this.notifier.notify('error', this.messageService.MIN_ORG);
    } else {
      this.selectedOrgVals = selectedIDs.toString();
      // console.log(selectedIDs.length, this.selectedMultipleOrgs.length);
      if (selectedIDs.length === this.selectedMultipleOrgs.length) {
        this.isAllOrg = true;
      } else {
        this.isAllOrg = false;
      }
      const data = {
        'clientid': this.clientId,
        'mstorgnhirarchyids': this.selectedOrgVals
      };
      // console.log(this.ismanagement);
      if (this.ismanagement === 'N') {
        data['refuserid'] = Number(this.messageService.getUserId());
        this.rest.workflowgroupbyuserwise(data).subscribe((res: any) => {
          this.displayGroup(res, type);
        }, (err) => {
          this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
      } else {
        this.rest.getprocessgroupbyorgids(data).subscribe((res: any) => {
          this.displayGroup(res, type);
        }, (err) => {
          this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
      }
    }
  }

  displayGroup(res, type) {
    if (res.success) {
      this.userGroupsOrgWise = res.details;
      if (this.userGroupsOrgWise.length !== 0) {
        this.userGroupOrgWiseSelected = [];
        if (type === 'all') {
          // console.log('all')
          for (let i = 0; i < this.userGroupsOrgWise.length; i++) {
            this.userGroupOrgWiseSelected.push(Number(this.userGroupsOrgWise[i].id));
          }
        } else {
          if (this.messageService.getWorkflowSupportGroups() !== null) {
            const savedWorkflowSupportGroup = this.messageService.getWorkflowSupportGroups();
            const savedWorkflowSupportGroupArr = savedWorkflowSupportGroup.split(',');
            for (let i = 0; i < savedWorkflowSupportGroupArr.length; i++) {
              this.userGroupOrgWiseSelected.push(Number(savedWorkflowSupportGroupArr[i]));
            }
          } else {
            for (let i = 0; i < this.userGroupsOrgWise.length; i++) {
              this.userGroupOrgWiseSelected.push(Number(this.userGroupsOrgWise[i].id));
            }
            // }
          }
        }
        this.messageService.saveOrgs(this.selectedOrgVals);
        this.selectedSupportGrpIds = this.userGroupOrgWiseSelected.toString();
        this.getRecordDiffType();
        this.getRecentRecords();
      } else {
        this.notifier.notify('error', 'No support group is mapped with workflow');
      }
    } else {
      this.notifier.notify('error', res.message);
    }
  }

  onSelectGroup(value) {
    // console.log(JSON.stringify(value));
    if (this.userGroupSelected !== 0) {
      this.userGroupId = this.userGroupSelected;
      let matched = false;
      for (let i = 0; i < this.userGroups.length; i++) {
        if (Number(this.userGroups[i].id) === Number(this.userGroupId)) {
          // console.log(this.userGroups[i].ismanagement, this.ismanagement);
          if (this.userGroups[i].ismanagement === this.ismanagement) {
            matched = true;
          }
          this.ismanagement = this.userGroups[i].ismanagement;
          this.groupName = this.userGroups[i].groupname;
          this.grpLevel = this.userGroups[i].levelid;
          this.hascatalog = this.userGroups[i].hascatalog;
          break;
        }
      }
      // console.log(matched);
      this.messageService.setGroupChangeData(this.userGroupId);
      this.messageService.saveSupportGroup({
        groupId: Number(this.userGroupId),
        // grpName: this.groupName,
        // levelid: this.grpLevel,
        // hascatalog: this.hascatalog
      });
      if (this.hascatalog === 'Y') {
        this.selectedOrgVals = this.orgId + '';
        this.selectedSupportGrpIds = this.userGroupId + '';
      }
      if (!matched) {
        this.onOrgChange(this.selectedOrgVals, 'all');
      } else {
        this.getRecordDiffType();
      }
    }
  }


  onSelectGroupOrgWise() {
    if (this.userGroupOrgWiseSelected.length !== 0) {
      if (this.userGroupOrgWiseSelected.length === this.userGroupsOrgWise.length) {
        this.isAllGrp = true;
      } else {
        this.isAllGrp = false;
      }
      this.selectedSupportGrpIds = this.userGroupOrgWiseSelected.toString();
      // console.log(this.selectedSupportGrpIds)
      this.gettilesnames();
    } else {
      this.notifier.notify('error', this.messageService.MIN_GRP);
    }
  }


  go() {
  }


  addItem() {
  }

  refresh() {
    this.onPageLoad();
  }

  onButtonChange(evnt) {
  }

  getRecordDiffType() {
    this.rest.getRecordDiffType().subscribe((res: any) => {
      if (res.success) {
        this.recordType = res.details;
        for (let i = 0; i < this.recordType.length; i++) {
          if (Number(this.recordType[i].seqno) === this.TICKET_TYPE_SEQ) {
            this.TICKET_TYPE_ID = this.recordType[i].id;
          }
          if (Number(this.recordType[i].seqno) === this.CAT_SEQ) {
            this.cat_id = this.recordType[i].id;
          }
        }
        this.getTicketType();
      }
    });
  }

  ontypeChange(selectedButton: any) {
    let parentType;
    let seq;
    let ticketid;
    for (let i = 0; i < this.ticketsTyp.length; i++) {
      if (Number(this.typSelected) === this.ticketsTyp[i].id) {
        parentType = this.ticketsTyp[i].typeid;
        seq = this.ticketsTyp[i].seqno;
        ticketid = this.ticketsTyp[i].id;
        this.typeSeq = seq;
        // console.log("\n this.typeSeq ====   ", this.typeSeq);
        this.gettilesnames();
        this.messageService.saveMenuData({
          type: ticketid,
          seq: seq,
          id: this.TICKET_TYPE_ID
        });
        this.ticketTypeArr = {id: parentType, val: this.typSelected};

      }
    }
  }


  getTicketType() {
    const ticketTypeData = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': Number(this.orgId),
      'recorddifftypeid': this.TICKET_TYPE_ID
    };
    this.rest.getrecordtypedata(ticketTypeData).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        this.ticketTypeLoaded = true;
        this.ticketsTyp = this.respObject.response;
        // this.ticketsTyp = [];
        // for (let i = 0; i < this.respObject.response.length; i++) {
        // if (this.TASK_SEQ.indexOf(this.respObject.response[i].seqno) === -1) {
        // this.ticketsTyp.push(this.respObject.response[i]);
        //   }
        // }
        if (this.ticketsTyp.length > 0) {
          const storage = this.messageService.getMenuData();
          // this.radioButton[0].checked = false;
          if (storage === null) {
            if (this.ticketsTyp.length > 0) {
              this.typSelected = this.ticketsTyp[0].id;
              this.typeSeq = this.ticketsTyp[0].seqno;
              this.gettilesnames();
            }
            this.messageService.saveMenuData({
              type: this.typSelected,
              seq: this.typeSeq,
              id: this.TICKET_TYPE_ID
            });
          } else {
            const type = storage.type;
            this.typeSeq = storage.seq;
            this.load = false;
            for (let i = 0; i < this.ticketsTyp.length; i++) {
              if (this.ticketsTyp[i].id === type) {
                this.typSelected = this.ticketsTyp[i].id;
                this.gettilesnames();
                this.load = true;
                break;
              }
            }
          }
          this.frequentrecords();
          for (let i = 0; i < this.ticketsTyp.length; i++) {
            if (Number(this.typSelected) === this.ticketsTyp[i].id) {
              // parentType = this.radioButton[i].typeid;
              this.ticketTypeArr = {id: this.ticketsTyp[i].typeid, val: this.typSelected};
            }
          }
        } else {
          this.notifier.notify('error', this.messageService.NO_TICKET_TYPE);
        }
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  gettilesnames() {
    const data = {
      'clientid': Number(this.clientId),
      'mstorgnhirarchyid': Number(this.orgId),
      'groupid': Number(this.userGroupId),

      ismanagerialview: Number(this.workspaceSelected)
    };
    if (this.hascatalog === 'Y') {
      data['iscatalog'] = 1;
    } else {
      data['iscatalog'] = 0;
      data['recorddifftypeid'] = Number(this.TICKET_TYPE_ID);
      data['recorddiffid'] = Number(this.typSelected);
    }
    this.rest.gettilesnames(data).subscribe((res) => {
      this.respObject = res;
      if (this.respObject.success) {
        // console.log("\n GET TILES NAMES :: "+JSON.stringify(this.respObject));
        this.tilesDetails = this.respObject.details;
        for (let i = 0; i < this.tilesDetails.length; i++) {
          const data = {
            'clientid': Number(this.clientId),
            'mstorgnhirarchyid': Number(this.orgId),
            'searchmstorgnhirarchyid': this.selectedOrgVals,
            // 'recorddiffidseq': this.typeSeq,
            // 'recorddiffid': Number(this.typSelected),
            'menuid': this.tilesDetails[i].diffid,
            'supportgrpid': this.selectedSupportGrpIds,
            'querytype': 1
          };
          if (this.hascatalog === 'Y') {
            data['iscatalog'] = 1;
          } else {
            data['iscatalog'] = 0;
            data['recorddiffidseq'] = this.typeSeq;
            data['recorddiffid'] = Number(this.typSelected);
          }
          // console.log("FOR LOOP ::  "+JSON.stringify(data));
          this.rest.recordgridresult(data).subscribe((res: any) => {
            if (res.success) {
              // console.log('count_' + res.details.menuid);
              const list = document.getElementsByClassName('loader_' + res.details.menuid) as HTMLCollectionOf<HTMLElement>;
              if (list !== null) {
                for (i = 0; i < list.length; i++) {
                  list[i].hidden = true;
                  // console.log(list[i]);
                  list[i].innerText = JSON.stringify(res.details.total);
                }
              }
              const list1 = document.getElementsByClassName('count_' + res.details.menuid) as HTMLCollectionOf<HTMLElement>;
              if (list1 !== null) {
                for (i = 0; i < list1.length; i++) {
                  // console.log(list[i]);
                  list1[i].innerText = JSON.stringify(res.details.total);
                }
              }
            }
          });
        }
      } else {
        this.notifier.notify('error', this.respObject.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  onTilesClick(tilesId) {
    // console.log("\n tilesId   ======     ", tilesId);
    this.messageService.saveTile(tilesId);
    const selectedSupportGrpIds = this.userGroupOrgWiseSelected.toString();
    this.messageService.removeWorkflowGroup();
    this.messageService.saveWorkflowSupportGroups(selectedSupportGrpIds);
    // console.log("\n this.messageService.viewUrl    ==========      ", this.messageService.viewUrl);
    // if(Number(tilesId) === 69){
    //   this.messageService.changeRouting("ticket/pendingApproval");
    // } else {
    if (this.messageService.viewUrl !== undefined && this.messageService.viewUrl !== null) {
      this.messageService.changeRouting(this.messageService.viewUrl);
    }
    // }
  }

  ngOnDestroy(): void {
    if (this.userAuth) {
      this.userAuth.unsubscribe();
    }
  }

  onCreateClick() {
    // console.log(this.messageService.genericCreateTicket);
    if (this.messageService.genericCreateTicket !== undefined && this.messageService.genericCreateTicket !== null) {
      this.messageService.changeRouting(this.messageService.genericCreateTicket);
    } else {
      if (this.messageService.createUrl !== undefined && this.messageService.createUrl !== null) {
        this.messageService.changeRouting(this.messageService.createUrl, {a: this.orgId});
      }
    }
  }

  getCatalogdata() {
    const data = {
      'clientid': Number(this.clientId),
      'mstorgnhirarchyid': Number(this.orgId)
    };
    this.rest.getcatalogorgwise(data).subscribe((res: any) => {
      if (res.success) {
        this.catalog = res.details;

        if (this.catalog.length > 0) {
          this.isDashboard = false;
          this.getCategoryByCatalog(this.catalog[0].id, this.catalog[0].catalogname);
        } else {
          this.notifier.notify('error', 'No Catalog Mapped With Client');
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }

  getCategoryByCatalog(id: any, name) {
    this.bread = [];
    this.bread.push({name: 'Home', type: 1, pos: 0});
    this.step = id;
    this.childCat = [];
    const pos = this.bread.length;
    this.bread.push({name: name, type: 2, pos: pos, id: id});
    this.getCategoryByCatalogWithId(id);
  }

  getCategoryByCatalogWithId(id) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: this.orgId,
      catalogid: id
    };
    this.rest.getcategorybycatalog(data).subscribe((res: any) => {
      if (res.success) {
        if (res.details.length > 0) {
          this.childCat = res.details;
        } else {
          this.notifier.notify('error', this.messageService.NO_CATALOG_CATEGORY);
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {

    });
  }

  getChildCategory(cat: any) {
    // console.log(JSON.stringify(cat));
    // if (cat.fromrecorddiffid) {
    //   this.TICKET_TYPE_ID = cat.fromrecorddifftypeid;
    //   this.typSelected = cat.fromrecorddiffid;
    //   this.typeSeq = cat.seqno;
    // }
    const pos = this.bread.length;
    this.bread.push({name: cat.title, type: 3, pos: pos, path: cat.parentpath});
    this.getchildcategory(cat.parentpath);
  }

  getchildcategory(parentname) {
    const data = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.orgId,
      'parentname': parentname
    };
    this.rest.getcategorybyparentname(data).subscribe((res: any) => {
      if (res.success) {
        if (res.details.length > 0) {
          this.childCat = res.details;
        } else {
          this.bread.pop();
          const data = {
            'clientid': this.clientId,
            'mstorgnhirarchyid': this.orgId,
            'parentname': parentname
          };
          this.rest.getfromtypebydiffname(data).subscribe((res1: any) => {
            if (res1.success) {
              if (res1.details.length > 0) {
                this.TICKET_TYPE_ID = res1.details[0].fromrecorddifftypeid;
                this.typSelected = res1.details[0].fromrecorddiffid;
                this.typeSeq = res1.details[0].seqno;
                const parentid = res1.details[0].id;
                if (document.getElementById(parentid)) {
                  (<HTMLInputElement> document.getElementById(parentid)).style['pointer-events'] = 'none';
                }
                this.getChildTicket(parentid, this.orgId);
              } else {
                this.notifier.notify('error', 'Category not mapped with any ticket type');
              }
            } else {
              this.notifier.notify('error', res.message);
            }
          });

        }
      } else {
        this.notifier.notify('error', res.message);
      }
    });
  }

  getChildTicket(parentid, orgid) {
    const data = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': orgid,
      'recordtypedifftypeid': this.TICKET_TYPE_ID,
      'recordtypediffid': Number(this.typSelected),
      'recordcatdiffid': parentid
    };
    this.rest.getmiscdatabyrecordid(data).subscribe((res: any) => {
      if (res.success) {
        const category = res.details.category;
        const status = res.details.status;
        const terms = res.details.terms;
        this.messageService.setAssetCount(res.details.assetcount);
        this.messageService.setWorkinglabel(res.details.workcat);
        const stat = {};
        const term = [];
        if (this.hascatalog === 'Y') {

          const priority = res.details.priority;
          const cat = [];
          const prio = {};
          for (let j = category.length - 1; j >= 0; j--) {
            cat.push({id: category[j].recorddifftypeid, val: category[j].id});
          }
          this.messageService.setCat(cat);
          if (priority.length > 0) {
            prio['id'] = priority[0].typeid;
            prio['val'] = priority[0].id;
          }
          this.messageService.setPrio(prio);
        }
        this.messageService.setLastCat(category[0].id);
        if (status.length > 0) {
          stat['id'] = status[0].typeid;
          stat['val'] = status[0].id;
        }
        if (terms.length > 0) {
          term.push({id: terms[0].termtypeid, val: terms[0].id});
        }

        this.messageService.setStatus(stat);
        this.messageService.saveTicketTypeData({
          type: Number(this.typSelected),
          seq: this.typeSeq,
          id: this.TICKET_TYPE_ID
        });
        // this.messageService.setTickettype({id: this.TICKET_TYPE_ID, val: Number(this.typSelected)});
        this.messageService.setTerm(term);
        this.rest.geturlbykey({
          clientid: this.clientId,
          mstorgnhirarchyid: orgid,
          Urlname: 'createTicket'
        }).subscribe((res: any) => {
          if (res.success) {
            if (res.details.length > 0) {
              if (this.config.type === 'LOCAL') {
                if (res.details[0].url.indexOf(this.config.API_ROOT) > -1) {
                  // console.log('inside')
                  res.details[0].url = res.details[0].url.replace(this.config.API_ROOT, 'http://localhost:4200');
                }
              }
              // console.log(res.details[0].url)
              if (this.grpLevel === 1) {
                this.messageService.changeRouting(res.details[0].url, {a: orgid});
              } else {
                this.messageService.changeRouting(res.details[0].url, {type: 'fq', a: orgid});
              }
            }
          } else {
            this.notifier.notify('error', res.message);
          }
        }, (err) => {
          // console.log(err);
        });
        // if (this.messageService.createUrl !== undefined && this.messageService.createUrl !== null) {
        //   if (this.grpLevel === 1) {
        //     this.messageService.changeRouting(this.messageService.createUrl, {a: orgid});
        //   } else {
        //     this.messageService.changeRouting(this.messageService.createUrl, {type: 'fq', a: orgid});
        //   }
        // } else {
        //   this.notifier.notify('error', this.messageService.NO_CREATE_URL);
        // }
      } else {
        this.notifier.notify('error', res.message);
      }
    });
  }

  changeBread(b: any) {
    if (b.type === 1) {
      this.isDashboard = true;
      this.bread = [];
    } else {
      const pos = (this.bread.length - b.pos) - 1;
      // console.log(pos)
      this.bread.splice(b.pos + 1, pos);
      if (b.type === 2) {
        this.getCategoryByCatalogWithId(b.id);
      } else {
        // this.getChildTicket(b.id);
        this.getchildcategory(b.path);
      }
    }
  }

  onCategorySelected(cat) {
    const data = {
      clientid: this.clientId,
      mstorgnhirarchyid: this.orgId,
      id: cat.id
    };
    this.rest.getcatelogrecord(data).subscribe((res: any) => {
      if (res.success) {
        const parentcats = res.details.catagories;
        const ttypes = res.details.ttype;
        const catalog = res.details.catalog;
        this.TICKET_TYPE_ID = ttypes.typeid;
        this.typSelected = ttypes.id;
        this.bread = [];
        this.bread.push({name: 'Home', type: 1, pos: 0});
        this.bread.push({
          name: catalog.name,
          type: 2,
          pos: 1,
          id: catalog.id
        });
        this.step = catalog.id;
        // let matched = false;
        for (let i = 0; i < parentcats.length - 1; i++) {
          // if (Number(parentcats[i].id) === catalog.torecorddiffid) {
          //   matched = true;
          // }
          // if (matched) {
          this.bread.push({
            name: parentcats[i].name,
            type: 3,
            pos: i + 2,
            id: Number(parentcats[i].id),
          });
          // }
        }
        this.childCat = [{
          id: cat.id,
          title: parentcats[parentcats.length - 1].name,
          parentpath: cat.parentcategorynames
        }];
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {

    });
  }

  getRecentRecords() {

    const data = {
      'clientid': Number(this.clientId),
      'mstorgnhirarchyid': Number(this.orgId),
      'usergroupid': this.userGroupId
    };
    this.rest.recentrecords(data).subscribe((res: any) => {
      if (res.success) {
        this.recentRecordData = res.details;
        for (let i = 0; i < res.details.length; i++) {
          this.recentRecordData[i].createdate = this.messageService.dateConverter(this.recentRecordData[i].createdate * 1000, 2);
        }
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {

    });
  }

  frequentrecords() {
    const data = {
      'clientid': Number(this.clientId),
      'mstorgnhirarchyid': Number(this.orgId),
      'recorddifftypeid': this.TICKET_TYPE_ID,
      'recorddiffid': this.typSelected,
      'usergroupid': this.userGroupId
    };
    this.rest.frequentrecords(data).subscribe((res: any) => {
      if (res.success) {
        this.frequestissues = res.details;
      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {

    });
  }

  changeColor(newColor) {

  }

  getDisplayTicket(data) {
    if (this.grpLevel === 1) {
      this.rest.geturlbykey({
        clientid: this.clientId,
        mstorgnhirarchyid: data.orgnid,
        Urlname: 'DisplayTicketDetails'
      }).subscribe((res: any) => {
        if (res.success) {
          if (res.details.length > 0) {
            if (this.config.type === 'LOCAL') {
              if (res.details[0].url.indexOf(this.config.API_ROOT) > -1) {
                res.details[0].url = res.details[0].url.replace(this.config.API_ROOT, 'http://localhost:4200');
              }
            }
            this.messageService.setNavigation(location.href);
            this.messageService.changeRouting(res.details[0].url, {
              id: data.id,
              // code: data.code
            });
          }
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        // console.log(err);
      });

    } else {
      const url = this.messageService.externalUrl + '?dt=' + data.id + '&au=' + this.messageService.getUserId() +
        '&bt=' + this.messageService.getToken() + '&tp=dp&i=' + this.clientId + '&m=' + data.orgnid;
      window.open(url, '_blank');
    }
  }

  gotoCreateticket(lastlevelid: any, index) {
    this.TICKET_TYPE_ID = this.frequestissues[index].recorddifftypeid;
    this.typSelected = this.frequestissues[index].recorddiffid;
    this.typeSeq = this.frequestissues[index].seq;
    this.getChildTicket(lastlevelid, this.frequestissues[index].mstorgnhirarchyid);
  }

  onWorkSpaceChange(selectedValue) {
    this.messageService.saveWorkspace(selectedValue);
    this.gettilesnames();
  }


  selectAllOrg() {
    // console.log('------------');
    this.orgSelected = [];
    if (this.isAllOrg) {
      for (let i = 0; i < this.selectedMultipleOrgs.length; i++) {
        this.orgSelected.push(Number(this.selectedMultipleOrgs[i].mstorgnhirarchyid));
      }
      this.onOrgChange(this.orgSelected, 'all');
    } else {
      this.notifier.notify('error', this.messageService.MIN_ORG);
    }
    // console.log(JSON.stringify(this.orgSelected));
  }

  selectAllGroup() {
    this.userGroupOrgWiseSelected = [];
    if (this.isAllGrp) {
      for (let i = 0; i < this.userGroupsOrgWise.length; i++) {
        this.userGroupOrgWiseSelected.push(Number(this.userGroupsOrgWise[i].id));
      }
    }
    this.onSelectGroupOrgWise();
  }


  // downloadFile() {
  //   const data = {
  //     'clientid': this.clientId,
  //     'mstorgnhirarchyid': this.orgId,
  //     'filename': this.messageService.uploadFileName
  //   }
  //   this.rest.filedownload(data).subscribe((blob: any) => {
  //     const objectUrl = URL.createObjectURL(blob);

  //     this.dispalyImage = this.sanitizer.bypassSecurityTrustStyle(`url(${objectUrl})`);
  //   });
  // }
  onBulkApproval() {
    const selectedSupportGrpIds = this.userGroupOrgWiseSelected.toString();
    this.messageService.removeWorkflowGroup();
    this.messageService.saveWorkflowSupportGroups(selectedSupportGrpIds);
    // console.log("\n this.messageService.viewUrl    ==========      ", this.messageService.viewUrl);
    // if(Number(tilesId) === 69){
    this.messageService.changeRouting('ticket/pendingApproval');
    // } else {
    // if (this.messageService.viewUrl !== undefined && this.messageService.viewUrl !== null) {
    //   this.messageService.changeRouting(this.messageService.viewUrl);
    // }
  }
}


