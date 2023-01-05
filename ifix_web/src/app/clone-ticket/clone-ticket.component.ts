import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MessageService} from '../message.service';
import {RestApiService} from '../rest-api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ConfigService} from '../config.service';
import {Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';

@Component({
    selector: 'app-clone-ticket',
    templateUrl: './clone-ticket.component.html',
    styleUrls: ['./clone-ticket.component.css']
})
export class CloneTicketComponent implements OnInit, OnDestroy {
    selectedColor: string;
    pageNameCss: any;
    ticketId: string;
    dataLoaded: boolean;
    categoryLoaded: boolean;
    tableCss: string;
    ticketTypes = [];
    priorityType: number;
    clientId: number;
    orgId: number;
    isChangeCategory: boolean;
    private lastLebelId: number;
    typeChecked: number;
    categoryArr = [];
    dynamicFields = [];
    private diffTypeId: number;
    private priorityId: number;
    priority_type_id: number;
    grpLevel: number;
    isVip: boolean;
    rName: string;
    darkCss: string;
    rMobile: string;
    rEmail: string;
    rLoc: string;
    desc: string;
    brief: string;
    private userinfo = [];
    @ViewChild('userInfo') private userInfo;
    private infoRef: MatDialogRef<unknown, any>;
    tId: number;
    priority: string;
    private colorObj = [];
    buttonCss: string;
    private loginClientId: number;
    private loginOrgId: number;
    private loginOrgTypeId: number;
    private userGroups = [];
    private userGroupSelected: number;
    private loginOrgName: string;
    userGroupId: number;
    private groupName: string;
    private userAuth: Subscription;
    private modalSubscribe: Subscription;
    ticketdata: any;
    private ticketDetails: any;
    private createbyid: number;
    impactid: number;
    urgencyid: number;
    private stageId: number;
    private ticketTypeLoaded: boolean;
    private workingtypeid: number;
    private statusArry: any;
    userSelected: string;
    levelSelected: any;
    isLoading: boolean;
    userDtl = [];
    private dialogRef2: MatDialogRef<unknown, any>;
    searchUser: FormControl = new FormControl();
    @ViewChild('loginName') private loginName;
    private organizationId: string;
    private OriginaluserGroupId: number;
    userId: number;
    selectSource: string;
    sources = ['Select Source', 'Call', 'Email', 'Walk-in'];
    private previouscat = [];
    typeSeq: number;

    SR_SEQ = 2;
    CR_SEQ = 4;
    CTASK_SEQ = 5;
    STASK_SEQ = 3;

    feature: string;
    TICKET_TYPE_SEQ = 1;
    INCIDENT_SEQ = 1;
    impacts = [];
    urgencies = [];
    isassetattached: boolean;
    private recordterms = [];
    private recordTermId: number;
    private attachment = [];
    private ticketAssetIds = [];
    STATUS_SEQ = 2;
    // RESOLVE_STATUS_SEQUENCE = 3;
    CLOSE_STATUS_SEQ = 8;
    private nextWokflowstateid: number;
    statustypeid: number;
    private statusid: number;
    manualstateselection: number;
    manualgroupid: number;
    manualUserSelected: number;
    private currentstateid: number;
    private nexttransitionid: number;
    private workingid: number;
    prevworkingtypeid: number;
    scheduletab = [];
    extras = [];
    plantab = [];
    displayMandatory: boolean;
    tNumber: any;
    isSearchTicket: boolean;
    isAttachedTicket: boolean;
    searchTicketdetails = [];
    attachedTicket = [];
    footerItem: any;
    termstartdate: string;
    termenddate: string;
    CONVERTED_SEQ = 79;
    CONVERTED_FROM_SEQ = 81;
    RESOLUTION_COMMENT_SEQ = 8;

    isTicketCloned: boolean;
    url: any;
    private prevSelectSource: string;

    constructor(private messageService: MessageService, private rest: RestApiService, private route: Router,
                private notifier: NotifierService,
                private dialog: MatDialog, private actRoute: ActivatedRoute, private config: ConfigService) {
    }

    ngOnInit(): void {
        this.isTicketCloned = false;
        this.termstartdate = '';
        this.termenddate = '';
        this.workingid = 0;
        this.isSearchTicket = false;
        this.isAttachedTicket = true;
        this.displayMandatory = true;
        this.prevworkingtypeid = 0;
        this.currentstateid = 0;
        this.nexttransitionid = 0;
        this.statusArry = {};
        this.userGroupId = 0;
        this.OriginaluserGroupId = 0;
        if (this.messageService.color) {
            this.selectedColor = this.messageService.color;
            for (let i = 0; i < this.colorObj.length; i++) {
                if (this.selectedColor === this.colorObj[i].selectedValue) {
                    this.tableCss = this.colorObj[i].tableCss;
                    this.darkCss = this.colorObj[i].darkCss;
                    this.pageNameCss = this.colorObj[i].pageNameCss;
                    this.buttonCss = this.colorObj[i].buttonCss;
                }
            }
        } else {
            this.messageService.getColor().subscribe((data: any) => {
                this.selectedColor = data;
                for (let i = 0; i < this.colorObj.length; i++) {
                    if (this.selectedColor === this.colorObj[i].selectedValue) {
                        this.tableCss = this.colorObj[i].tableCss;
                        this.darkCss = this.colorObj[i].darkCss;
                        this.pageNameCss = this.colorObj[i].pageNameCss;
                        this.buttonCss = this.colorObj[i].buttonCss;
                    }
                }
            });
        }
        if (this.messageService.clientId) {
            // console.log(".............okkkkkkkkkk")
            this.loginClientId = this.messageService.clientId;
            this.userGroups = this.messageService.group;
            this.userGroupSelected = this.userGroups[0].id;
            this.loginOrgId = this.messageService.orgnId;
            this.loginOrgTypeId = this.messageService.orgnTypeId;
            this.loginOrgName = this.messageService.mstorgnname;
            if (this.userGroups !== undefined) {
                if (this.messageService.getSupportGroup() === null) {
                    this.userGroupId = this.userGroups[0].id;
                    this.groupName = this.userGroups[0].groupname;
                    this.grpLevel = this.userGroups[0].levelid;
                } else {
                    const group = this.messageService.getSupportGroup();
                    this.userGroupId = Number(group.groupId);
                    // this.groupName = group.grpName;
                    // this.grpLevel = group.levelid;
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
                this.loginClientId = auth[0].clientid;
                this.loginOrgId = auth[0].mstorgnhirarchyid;
                this.loginOrgTypeId = auth[0].orgntypeid;
                this.loginOrgName = auth[0].mstorgnname;
                if (this.userGroups !== undefined) {
                    if (this.messageService.getSupportGroup() === null) {
                        this.userGroupId = this.userGroups[0].id;
                        this.groupName = this.userGroups[0].groupname;
                        this.grpLevel = this.userGroups[0].levelid;

                    } else {
                        const group = this.messageService.getSupportGroup();
                        this.userGroupId = group.groupId;
                        // this.groupName = group.grpName;
                        // this.grpLevel = group.levelid;
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
        this.dataLoaded = false;
        this.selectSource = 'Select Source';
        this.prevSelectSource = 'Select Source';
        // console.log('-----inside on page load');
        this.userId = Number(this.messageService.getUserId());
        this.modalSubscribe = this.actRoute.queryParams.subscribe((params: any) => {
            if (this.messageService.isEmpty(params) === false) {
                this.ticketdata = params;
                this.feature = params.tp;
                // this.ticketId = params.code;
                this.tId = Number(params.id);
                this.url = this.messageService.getNavigation();
                this.rEmail = '';
                this.rLoc = '';
                this.rName = '';
                this.rMobile = '';
                this.manualstateselection = 0;
                this.getTicketDetails();
            }
        });
    }

    getTicketDetails() {
        this.rest.getrecorddetails({
            'clientid': this.loginClientId,
            'mstorgnhirarchyid': Number(this.loginOrgId),
            'recordid': Number(this.tId)
        }).subscribe((res: any) => {
            this.dataLoaded = true;
            if (res.success) {
                this.ticketDetails = res.details;
                this.ticketId = this.ticketDetails[0].code;
                this.typeSeq = this.ticketDetails[0].typeseqno;
                this.diffTypeId = this.ticketDetails[0].typedifftypeid;
                if (this.feature === 'cl') {
                    this.rName = this.messageService.firstname + ' ' + this.messageService.lastname;
                    this.rMobile = this.messageService.mobile;
                    this.rEmail = this.messageService.email;
                    this.rLoc = this.messageService.branch;
                } else if (this.feature === 'cv') {
                    this.rName = this.ticketDetails[0].requestername;
                    this.rEmail = this.ticketDetails[0].requesteremail;
                    this.rMobile = this.ticketDetails[0].requestermobile;
                    this.rLoc = this.ticketDetails[0].requesterlocation;
                }
                // console.log(this.rName, this.rEmail);
                // console.log(this.grpLevel);
                this.desc = this.ticketDetails[0].title;
                this.brief = this.ticketDetails[0].description;
                this.createbyid = this.ticketDetails[0].creatorid;


                if (this.feature === 'cv') {
                    this.prevworkingtypeid = this.ticketDetails[0].workflowdetails.cattypeid;
                    this.workingid = this.ticketDetails[0].workflowdetails.catid;
                    this.priorityId = 0;
                    this.priority_type_id = 0;
                    this.priority = '';
                } else {
                    this.workingtypeid = this.ticketDetails[0].workflowdetails.cattypeid;
                    this.priorityId = this.ticketDetails[0].priorityid;
                    this.priority_type_id = this.ticketDetails[0].prioritytypeid;
                    this.priority = this.ticketDetails[0].priority;
                }
                // console.log(this.workingtypeid, this.workingid);
                this.impactid = this.ticketDetails[0].impactid;
                this.urgencyid = this.ticketDetails[0].urgencyid;
                this.clientId = this.ticketDetails[0].clientid;
                this.orgId = this.ticketDetails[0].mstorgnhirarchyid;
                this.stageId = this.ticketDetails[0].recordstageid;

                this.getGroupidUserwise().then((res3: any) => {
                    if (res3.success) {
                        const groups = res3.details;
                        if (groups.length > 0) {
                            let match = false;
                            for (let i = 0; i < groups.length; i++) {
                                if (groups[i].defaultgroup === 1) {
                                    this.userGroupId = groups[i].id;
                                    this.grpLevel = groups[i].levelid;
                                    match = true;
                                    break;
                                }
                            }
                            if (!match) {
                                this.userGroupId = groups[0].id;
                                this.grpLevel = groups[0].levelid;
                            }
                            if (this.feature === 'cv') {
                                this.rest.getstatedetails({
                                    'clientid': this.clientId,
                                    'mstorgnhirarchyid': Number(this.orgId),
                                    'recordid': Number(this.tId),
                                    'recordstageid': this.stageId
                                }).subscribe((res: any) => {
                                    if (res.success) {
                                        if (res.details.length > 0) {
                                            this.currentstateid = res.details[0].currentstateid;
                                        }
                                    }
                                });
                                this.getattachedfiles();
                            }
                            let seq1 = this.SR_SEQ;
                            if (this.typeSeq === this.SR_SEQ) {
                                seq1 = this.INCIDENT_SEQ;
                            }
                            if (this.feature === 'cv') {
                                this.typeSeq = seq1;
                            }
                            this.getdiffdetailsbyseqno(seq1).then((res: any) => {
                                if (res.success) {
                                    if (res.details.length > 0) {
                                        if (this.feature === 'cv') {
                                            this.typeChecked = res.details[0].id;
                                            this.getrecordcategorycreate();
                                        } else {
                                            this.typeChecked = this.ticketDetails[0].recordtypeid;
                                            if (this.typeSeq === this.CR_SEQ) {
                                                this.gettabterms();
                                            }
                                            this.getrecordcategorydisplay();
                                        }
                                        if (this.typeSeq !== this.SR_SEQ && this.typeSeq !== this.STASK_SEQ) {
                                            if (this.sources.indexOf('Alert') === -1) {
                                                this.sources.splice(1, 0, 'Alert');
                                            }
                                        } else {
                                            if (this.sources.indexOf('Alert') > -1) {
                                                this.sources.splice(1, 1);
                                            }
                                        }
                                    }
                                } else {
                                    this.notifier.notify('error', res.message);
                                }
                            });
                        } else {
                            this.notifier.notify('error', this.messageService.NO_GROUP);
                        }
                    } else {
                        this.notifier.notify('error', res3.message);
                    }
                });

            } else {
                this.notifier.notify('error', res.message);
            }
        }, (err) => {
            this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });

    }

    getGroupidUserwise() {
        const promise = new Promise((resolve, reject) => {
            this.rest.groupbyuserwise({
                clientid: Number(this.clientId),
                mstorgnhirarchyid: Number(this.orgId),
                refuserid: Number(this.messageService.getUserId())
            }).subscribe((res: any) => {
                resolve(res);

            }, (err) => {
                // console.log(err);
                reject();
            });
        });
        return promise;
    }

    closeTicket() {
        const promise = new Promise((resolve, reject) => {
            const data = {
                'clientid': this.clientId,
                'mstorgnhirarchyid': this.orgId,
                'typeseqno': this.STATUS_SEQ,
                'seqno': this.CLOSE_STATUS_SEQ,
            };
            this.rest.getstatebyseqno(data).subscribe((res: any) => {
                if (res.success) {
                    if (res.details.length > 0) {
                        this.nextWokflowstateid = res.details[0].mststateid;
                        this.statustypeid = res.details[0].recorddifftypeid;
                        this.statusid = res.details[0].recorddiffid;
                        this.manualstateselection = 1;
                        this.manualgroupid = this.userGroupId;
                        this.manualUserSelected = Number(this.messageService.getUserId());
                        this.moveWorkflow().then((success) => {
                            resolve(success);
                        });
                        // this.checkTerm();
                    }
                } else {
                    resolve(false);
                    this.notifier.notify('error', res.message);
                }
            }, (err) => {
                reject();
                this.notifier.notify('error', this.messageService.SERVER_ERROR);
            });
        });
        return promise;
    }

    moveWorkflow() {
        const promise = new Promise((resolve, reject) => {
            const data = {
                'clientid': this.clientId,
                'mstorgnhirarchyid': this.orgId,
                'recorddifftypeid': this.prevworkingtypeid,
                'recorddiffid': this.workingid,
                transitionid: this.nexttransitionid,
                'previousstateid': this.currentstateid,
                'currentstateid': this.nextWokflowstateid,
                'manualstateselection': this.manualstateselection,
                'transactionid': this.tId,
                'createdgroupid': this.userGroupId
            };
            if (this.manualstateselection === 0) {
                data['mstgroupid'] = this.userGroupId;
                data['mstuserid'] = Number(this.messageService.getUserId());
            } else {
                data['mstgroupid'] = Number(this.manualgroupid);
                data['mstuserid'] = Number(this.manualUserSelected);
            }
            // console.log(JSON.stringify(data))
            this.rest.moveWorkflow(data).subscribe((res: any) => {
                if (res.success) {
                    this.notifier.notify('success', 'Process moved to next state');
                    resolve(true);
                } else {
                    this.notifier.notify('error', res.message);
                    resolve(false);
                }
            }, (err) => {
                this.notifier.notify('error', this.messageService.SERVER_ERROR);
                reject();
            });
        });
        return promise;
    }


    getattachedfiles() {
        this.rest.getattachedfiles({
            'clientid': this.clientId,
            'mstorgnhirarchyid': this.orgId,
            'recordid': this.tId,
        }).subscribe((res: any) => {
            if (res.success) {
                for (let i = 0; i < res.details.length; i++) {
                    this.attachment.push({originalName: res.details[i].originalname, fileName: res.details[i].uploadname});
                }
                // this.attachment = res.details;
            } else {
                this.notifier.notify('error', res.message);
            }
        }, (err) => {
            this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
    }

    getrecordcategorycreate() {
        const data = {
            'clientid': this.clientId,
            'mstorgnhirarchyid': this.orgId,
            'recorddifftypeid': this.diffTypeId,
            'recorddiffid': this.typeChecked
        };
        // console.log('inside category fetching');
        this.rest.getrecorddata(data).subscribe((res: any) => {
            if (res.success) {


                this.categoryLoaded = true;
                this.ticketTypes = res.response.recordcategory;
                this.priorityType = Number(res.response.configtype);
                this.recordterms = res.response.recordterms;
                if (this.recordterms.length > 0) {
                    this.recordTermId = this.recordterms[0].id;
                }
                this.workingtypeid = res.response.workingcatlabelid;
                this.isassetattached = (res.response.isassetattached > 0);
                if (this.priorityType === 1) {
                    this.impacts = res.response.recordimpact;
                    this.urgencies = res.response.recordurgency;
                }
                const createstatus = res.response.recordstatus;
                if (createstatus.length > 0) {
                    this.statusArry = {id: createstatus[0].typeid, val: createstatus[0].id};
                }

                for (let i = 0; i < this.ticketTypes.length; i++) {
                    if (this.ticketTypes[i].isDisabled) {
                        this.ticketTypes[i].child.push({id: this.ticketTypes[i].id, title: this.ticketTypes[i].title});
                        this.categoryArr.push({id: this.ticketTypes[i].id, val: this.ticketTypes[i].child[0].id});
                    } else {
                        this.ticketTypes[i].child.unshift({
                            id: this.ticketTypes[i].id,
                            title: this.ticketTypes[i].title,
                            type: 'header'
                        });
                    }
                }
                // console.log(JSON.stringify(this.ticketTypes));
                this.previouscat = this.messageService.copyArray(res.response.recordcategory);

            } else {
                this.notifier.notify('error', res.message);
            }
        }, (err) => {
            this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
    }

    getrecordcategorydisplay() {
        const data = {
            'clientid': Number(this.clientId),
            'mstorgnhirarchyid': Number(this.orgId),
            'recordid': Number(this.tId),
            'recorddifftypeid': Number(this.diffTypeId),
            'recorddiffid': Number(this.typeChecked),
            'recordstageid': Number(this.stageId)
        };
        this.rest.getrecordcat(data).subscribe((res: any) => {
            if (res.success) {
                this.categoryLoaded = true;
                this.ticketTypeLoaded = true;
                const createstatus = res.details.recordstatus;
                if (createstatus.length > 0) {
                    this.statusArry = {id: createstatus[0].typeid, val: createstatus[0].id};
                }
                this.isassetattached = (res.details.isassetattached > 0);
                this.ticketTypes = res.details.recordcategory;
                for (let i = 0; i < this.ticketTypes.length; i++) {
                    if (this.ticketTypes[i].isDisabled) {
                        this.ticketTypes[i].child.push({
                            id: this.ticketTypes[i].id,
                            title: this.ticketTypes[i].title,
                            type: 'header'
                        });
                    } else {
                        this.ticketTypes[i].child.splice(1, 0, {
                            id: this.ticketTypes[i].id,
                            title: this.ticketTypes[i].title,
                            type: 'header'
                        });
                    }
                }

                for (let i = 0; i < this.ticketTypes.length; i++) {
                    this.categoryArr.push({id: this.ticketTypes[i].id, val: this.ticketTypes[i].child[0].id});
                }
                const today = this.messageService.dateConverter(new Date(), 1);
                if (res.details.recordfields.length > 0) {
                    for (let i = 0; i < res.details.recordfields.length; i++) {
                        if (Number(res.details.recordfields[i].termstypeid) === 5) {
                            res.details.recordfields[i].value = new Date(today + ' ' + res.details.recordfields[i].value);
                        }
                    }
                    this.dynamicFields = res.details.recordfields;
                }
                this.previouscat = this.messageService.copyArray(res.details.recordcategory);
                this.priorityType = Number(res.details.configtype);
            } else {
                this.notifier.notify('error', res.message);
            }
        }, (err) => {
            this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
    }

    getdiffdetailsbyseqno(seqno) {
        const promise = new Promise((resolve, reject) => {
            const data = {
                clientid: this.clientId,
                mstorgnhirarchyid: this.orgId,
                seqno: seqno,
                typeseqno: this.TICKET_TYPE_SEQ
            };
            this.rest.getpropdetailsbyseq(data).subscribe((res: any) => {
                resolve(res);
            }, (err) => {
                reject(false);
                this.notifier.notify('error', this.messageService.SERVER_ERROR);
            });
        });
        return promise;
    }

    addSingleTerm(typeseq, termdescription, termvalue, ticketid) {
        const promise = new Promise((resolve, reject) => {
            if (termvalue.trim() !== '') {
                const data = {
                    'clientid': this.clientId,
                    'mstorgnhirarchyid': Number(this.orgId),
                    'recordid': ticketid,
                    'recordstageid': Number(this.stageId),
                    'termseq': typeseq,
                    'recorddifftypeid': Number(this.diffTypeId),
                    'recorddiffid': Number(this.typeChecked),
                    'usergroupid': this.userGroupId,
                    'foruserid': Number(this.messageService.getUserId()),
                    'termvalue': String(termvalue),
                    'termdescription': termdescription
                };
                this.rest.inserttermvalue(data).subscribe((res: any) => {
                    if (res.success) {

                        resolve(true);
                    } else {
                        this.notifier.notify('error', res.message);
                        resolve(false);
                    }
                }, (err) => {
                    this.notifier.notify('error', this.messageService.SERVER_ERROR);
                    reject();
                });
            } else {
                this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
                reject();
            }

        });
        return promise;
    }

    getPriority(data) {
        this.rest.getrecordpriority(data).subscribe((res: any) => {
            if (res.success) {
                if (res.response.priority.length > 0) {
                    this.priorityId = res.response.priority[0].id;
                    this.priority_type_id = res.response.priority[0].typeid;
                    this.priority = res.response.priority[0].title;
                }
            } else {
                this.notifier.notify('error', res.errorMessage);
            }
        }, (err) => {
            this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
    }

    onCategoryChange(categorySeq, option) {
        // console.log('----->'+JSON.stringify(this.ticketTypes))
        const opt = JSON.parse(option);
        if (opt.type !== 'header') {
            // this.isChangeCategory = true;
            const value = opt.id;
            if ((categorySeq === this.ticketTypes.length)) {
                this.lastLebelId = value;
                const data = {
                    'clientid': this.clientId,
                    'mstorgnhirarchyid': this.orgId,
                    'recordtypeid': this.typeChecked,
                    'recordcatid': this.lastLebelId
                };
                if (this.priorityType === 2) {
                    this.getPriority(data);
                }
                // this.getAdditionaldata(data);
            }
            const index = this.ticketTypes.map(function(d) {
                return d['sequanceno'];
            }).indexOf(categorySeq + 1);
            // // console.log('index:' + index);
            const index1 = this.ticketTypes.map(function(d) {
                return d['sequanceno'];
            }).indexOf(categorySeq);
            // console.log('index:' + index, index1);
            if (this.categoryArr.length > index1) {
                this.categoryArr = this.categoryArr.slice(0, index1);
                this.categoryArr.push({id: this.ticketTypes[index1].id, val: value});
            } else {
                this.categoryArr.push({id: this.ticketTypes[index1].id, val: value});
            }
            // console.log("after:"+JSON.stringify(this.categoryArr))
            if (index > -1) {
                for (let i = index + 1; i < this.ticketTypes.length; i++) {
                    const options = this.ticketTypes[i].child;
                    // console.log(JSON.stringify(options));
                    for (let j = 0; j < options.length; j++) {
                        if (options[j].type) {
                            // options=[];
                            this.ticketTypes[i].child = [options[j]];
                            break;
                        }
                    }
                }
            }
            const data1 = {
                'clientid': this.clientId,
                'mstorgnhirarchyid': Number(this.orgId),
                'mstdifferentiationset': [
                    {
                        'mstdifferentiationtypeid': Number(this.diffTypeId),
                        'mstdifferentiationid': Number(this.typeChecked)
                    },
                    {
                        'mstdifferentiationtypeid': Number(this.ticketTypes[index1].id),
                        'mstdifferentiationid': Number(value)
                    }
                ]

            };
            this.rest.getadditionalfields(data1).subscribe((res: any) => {
                if (res.success) {
                    for (let i = 0; i < res.response.length; i++) {
                        res.response[i].catSeq = categorySeq;
                        if (res.response[i].termsvalue !== '') {
                            res.response[i].values = res.response[i].termsvalue.split(',');
                            // this.respObject.response[i].value = this.respObject.response[i].values[0];
                        } else {
                            res.response[i].value = '';
                        }
                    }
                    // console.log(JSON.stringify(this.dynamicFields))
                    if (this.dynamicFields.length > 0) {
                        for (let j = 0; j < this.dynamicFields.length; j++) {
                            console.log(Number(this.dynamicFields[j].catSeq), Number(categorySeq));
                            if (Number(this.dynamicFields[j].catSeq) >= Number(categorySeq)) {
                                this.dynamicFields = this.dynamicFields.slice(0, j);
                                break;
                            }
                        }
                        for (let i = 0; i < res.response.length; i++) {
                            this.dynamicFields.push(res.response[i]);
                        }
                    } else {
                        this.dynamicFields = res.response;
                    }
                } else {
                }
            }, (err) => {
            });
            let data;
            if (index > -1) {
                for (let i = 0; i < this.ticketTypes[index].child.length; i++) {
                    if (this.ticketTypes[index].child[i].type === 'header') {
                        data = this.ticketTypes[index].child[i];
                    }
                }
                // console.log('--> '+JSON.stringify(data))
                this.ticketTypes[index].child = [];
                this.dataLoaded = false;

                const data1 = {
                    'clientid': this.clientId,
                    'mstorgnhirarchyid': Number(this.orgId),
                    'recorddifftypeid': this.diffTypeId,
                    'recorddiffid': Number(this.typeChecked),
                    'recorddiffparentid': Number(value)
                };
                this.rest.getrecordcatchilddata(data1).subscribe((respObject: any) => {
                    this.dataLoaded = true;
                    if (respObject.success) {
                        if (respObject.response) {
                            respObject.response.unshift(data);
                            this.ticketTypes[index].child = respObject.response;
                        }
                    } else {
                        if (index > -1) {
                            this.ticketTypes[index].options = [data];
                        }
                    }
                }, (err) => {
                    // this.notifier.notify('error', this.messageService.SERVER_ERROR);
                });
            }
            console.log(JSON.stringify(this.ticketTypes));
        } else {
            const index = this.ticketTypes.map(function(d) {
                return d['sequanceno'];
            }).indexOf(categorySeq + 1);
            if (index === -1) {
                this.categoryArr = this.categoryArr.slice(0, (this.categoryArr.length - 1));
            }
        }
    }

    blockSpecialChar(e) {
        const k = e.keyCode;
        return (k !== 35 && k !== 64);
    }

    openUserInfo() {
        this.userinfo = [];
        const data = {
            'clientid': this.clientId,
            'mstorgnhirarchyid': this.orgId,
            'recordid': Number(this.tId)
        };
        this.rest.recordwiseuserinfo(data).subscribe((res: any) => {
            if (res.success) {
                this.userinfo = res.details;
            } else {
                this.notifier.notify('error', res.message);
            }
        }, (err) => {
            this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
        this.infoRef = this.dialog.open(this.userInfo, {
            width: '500px', height: '400px'
        });
    }

    cloneTicket() {
        this.isTicketCloned = true;
        if (this.grpLevel === 1) {
            this.selectSource = 'Self Service';
        } else {
            if (this.typeSeq === this.CR_SEQ || this.typeSeq === this.CTASK_SEQ || this.typeSeq === this.STASK_SEQ) {
                this.selectSource = 'Web';
            }
        }
        let isError = false;
        let extraCount = 0;
        const extrafields = [];

        const assetIds = [];
        if (Number(this.userGroupId) === 0) {
            isError = true;
            this.isTicketCloned = false;
            this.notifier.notify('error', 'Enter Support Group');
        }
        // console.log(this.OriginaluserGroupId)
        if (Number(this.OriginaluserGroupId) === 0) {
            this.OriginaluserGroupId = this.userGroupId;
        }
        // console.log(this.categoryArr.length, this.ticketTypes.length);
        if (this.categoryArr.length === this.ticketTypes.length) {
            if ((this.messageService.isBlankcat(this.categoryArr))) {
                isError = true;
                this.isTicketCloned = false;
                this.notifier.notify('error', this.messageService.CATEGORY_ERROR);
            }
        } else {
            isError = true;
            this.isTicketCloned = false;
            this.notifier.notify('error', this.messageService.CATEGORY_ERROR);
        }
        if (this.desc.trim() === '' && this.brief.trim() !== '') {
            this.desc = this.brief.trim().substring(0, 99);
        } else if (this.desc.trim() !== '' && this.brief.trim() === '') {
            this.brief = this.desc.trim();
        }
        for (let j = 0; j < this.ticketAssetIds.length; j++) {
            assetIds.push(this.ticketAssetIds[j]);
        }
        let mandatoryfield = 0;
        for (let i = 0; i < this.dynamicFields.length; i++) {
            if (this.dynamicFields[i].ismandatory === 1) {
                mandatoryfield++;
                if (this.dynamicFields[i].value.trim() !== '' && this.dynamicFields[i].value !== 'NONE') {
                    extraCount++;
                    if (Number(this.dynamicFields[i].termstypeid) === 4) {
                        extrafields.push({
                            id: this.dynamicFields[i].fieldid,
                            val: this.messageService.dateConverter(this.dynamicFields[i].value, 1),
                            'termsid': this.dynamicFields[i].termsid
                        });

                    } else if (Number(this.dynamicFields[i].termstypeid) === 5) {
                        extrafields.push({
                            id: this.dynamicFields[i].fieldid,
                            val: this.messageService.dateConverter(this.dynamicFields[i].value, 5),
                            'termsid': this.dynamicFields[i].termsid
                        });

                    } else {
                        extrafields.push({
                            id: this.dynamicFields[i].fieldid,
                            val: this.dynamicFields[i].value,
                            'termsid': this.dynamicFields[i].termsid
                        });

                    }
                }
            } else {
                extrafields.push({
                    id: this.dynamicFields[i].fieldid,
                    val: this.dynamicFields[i].value,
                    termsid: this.dynamicFields[i].termsid
                });
            }
        }
        let plancount = 0;
        let planextraCount = 0;
        let planerrorname = '';
        const plantabmod = JSON.parse(JSON.stringify(this.plantab));
        for (let i = 0; i < plantabmod.length; i++) {
            if (Number(plantabmod[i].termtypeid) === 4) {
                plantabmod[i].val = this.messageService.dateConverter(plantabmod[i].val, 1);
            } else if (Number(plantabmod[i].termtypeid) === 5) {
                plantabmod[i].val = this.messageService.dateConverter(plantabmod[i].val, 6);
            } else if (Number(plantabmod[i].termtypeid) === 7) {
                plantabmod[i].val = this.messageService.dateConverter(plantabmod[i].val, 5);
            }
            if (plantabmod[i].iscompulsory === 1) {
                plancount++;
                if (plantabmod[i].val.trim() !== '' && plantabmod[i].val !== 'NONE') {
                    planextraCount++;
                    extrafields.push({
                        id: plantabmod[i].fieldid,
                        val: plantabmod[i].val,
                        termsid: plantabmod[i].id
                    });
                } else {
                    planerrorname = planerrorname + ' ' + plantabmod[i].tername + ',';
                }
            } else {
                extrafields.push({
                    id: plantabmod[i].fieldid,
                    val: plantabmod[i].val,
                    termsid: plantabmod[i].id
                });
            }
        }
        let extracount1 = 0;
        let extextraCount = 0;
        const plantabmod1 = JSON.parse(JSON.stringify(this.extras));
        if (!this.displayMandatory) {
            for (let i = 0; i < plantabmod1.length; i++) {
                if (Number(plantabmod1[i].termtypeid) === 4) {
                    plantabmod1[i].val = this.messageService.dateConverter(plantabmod1[i].val, 1);
                } else if (Number(plantabmod1[i].termtypeid) === 5) {
                    plantabmod1[i].val = this.messageService.dateConverter(plantabmod1[i].val, 6);
                } else if (Number(plantabmod1[i].termtypeid) === 7) {
                    plantabmod1[i].val = this.messageService.dateConverter(plantabmod1[i].val, 5);
                }
                if (plantabmod1[i].iscompulsory === 1) {
                    extracount1++;
                    if (plantabmod1[i].val.trim() !== '' && plantabmod1[i].val !== 'NONE') {
                        extextraCount++;
                        extrafields.push({
                            id: plantabmod1[i].fieldid,
                            val: plantabmod1[i].val,
                            termsid: plantabmod1[i].id
                        });
                    } else {
                        planerrorname = planerrorname + ' ' + plantabmod1[i].tername + ',';
                    }
                } else {
                    extrafields.push({
                        id: plantabmod1[i].fieldid,
                        val: plantabmod1[i].val,
                        termsid: plantabmod1[i].id
                    });
                }
            }
        } else {
            for (let i = 0; i < plantabmod1.length; i++) {
                extrafields.push({
                    id: plantabmod1[i].fieldid,
                    val: '',
                    termsid: plantabmod1[i].id
                });
            }
        }
        let schedulecount = 0;
        let scheduleextraCount = 0;
        const scheduletabmod = JSON.parse(JSON.stringify(this.scheduletab));
        let scheduleerrorname = '';
        for (let i = 0; i < scheduletabmod.length; i++) {
            if (Number(scheduletabmod[i].termtypeid) === 4) {
                scheduletabmod[i].val = this.messageService.dateConverter(scheduletabmod[i].val, 1);
            } else if (Number(scheduletabmod[i].termtypeid) === 5) {
                scheduletabmod[i].val = this.messageService.dateConverter(scheduletabmod[i].val, 6);
            } else if (Number(scheduletabmod[i].termtypeid) === 7) {
                scheduletabmod[i].val = this.messageService.dateConverter(scheduletabmod[i].val, 5);
            }
            if (scheduletabmod[i].iscompulsory === 1) {
                schedulecount++;
                if (scheduletabmod[i].val.trim() !== '' && scheduletabmod[i].val !== 'NONE') {
                    scheduleextraCount++;
                    extrafields.push({
                        id: scheduletabmod[i].fieldid,
                        val: scheduletabmod[i].val,
                        termsid: scheduletabmod[i].id
                    });
                } else {
                    scheduleerrorname = scheduleerrorname + ' ' + scheduletabmod[i].tername + ',';
                }
            } else {
                extrafields.push({
                    id: scheduletabmod[i].fieldid,
                    val: scheduletabmod[i].val,
                    termsid: scheduletabmod[i].id
                });
            }
        }
        if (extraCount !== mandatoryfield) {
            isError = true;
            this.isTicketCloned = false;
            this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
        }
        if (schedulecount !== scheduleextraCount) {
            isError = true;
            this.isTicketCloned = false;
            this.notifier.notify('error', scheduleerrorname.substring(0, scheduleerrorname.length - 1)
                + this.messageService.BLANK_SCHEDULE_ERROR_MESSAGE);
        }
        if (plancount !== planextraCount) {
            isError = true;
            this.isTicketCloned = false;
            this.notifier.notify('error', planerrorname.substring(0, planerrorname.length - 1) + this.messageService.BLANK_PLAN_ERROR_MESSAGE);
        }
        if (extracount1 !== extextraCount) {
            isError = true;
            this.isTicketCloned = false;
            this.notifier.notify('error', planerrorname.substring(0, planerrorname.length - 1) + this.messageService.BLANK_PLAN_ERROR_MESSAGE);
        }
        if (this.selectSource === 'Select Source') {
            isError = true;
            this.isTicketCloned = false;
            this.notifier.notify('error', this.messageService.BLANK_SOURCE);
        }
        const data = {
            'clientid': Number(this.clientId),
            'mstorgnhirarchyid': Number(this.orgId),
            'originalusergroupid': this.userGroupId,
            'originaluserid': Number(this.messageService.getUserId()),
            'createdusergroupid': this.OriginaluserGroupId,
            'createduserid': Number(this.userId),
            'recordname': this.desc.trim(),
            'recordesc': this.brief.trim(),
            'requestername': this.rName,
            'requesteremail': this.rEmail,
            'requestermobile': this.rMobile,
            'requesterlocation': this.rLoc,
            'recordsets': [{'id': 1, 'type': this.categoryArr}, {id: this.diffTypeId, val: this.typeChecked}],
            'workingcatlabelid': this.workingtypeid,
            'source': this.selectSource
        };
        if (this.typeSeq === this.CR_SEQ) {
            const recordids = [];
            for (let i = 0; i < this.attachedTicket.length; i++) {
                recordids.push(this.attachedTicket[i].id);
            }
            data['recordids'] = recordids;
        }

        if (this.priorityType === 1) {
            /*if (!isError) {
              if (Object.keys(this.urgencyArr).length !== 0) {

                data.recordsets.push(this.urgencyArr);
              } else {
                isError = true;
                this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
              }
            }
            if (!isError) {
              if (Object.keys(this.impactArr).length !== 0) {

                data.recordsets.push(this.impactArr);
              } else {
                isError = true;

                this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
              }
            }*/
        }
        const priorityArry = {id: this.priority_type_id, val: Number(this.priorityId)};
        if (!isError) {
            if (Object.keys(priorityArry).length !== 0) {
                data.recordsets.push(priorityArry);
            } else {
                isError = true;
                this.isTicketCloned = false;
                this.notifier.notify('error', this.messageService.PRIORITY_ERROR);
            }
        }
        if (!isError) {
            if (Object.keys(this.statusArry).length !== 0) {

                data.recordsets.push(this.statusArry);
            } else {
                isError = true;
                this.isTicketCloned = false;
                this.notifier.notify('error', this.messageService.STATUS_ERROR);
            }
        }
        if (!isError) {
            if (this.attachment.length > 0) {
                if (this.recordterms.length > 0) {
                    data['recordfields'] = [{'termid': this.recordTermId, 'val': this.attachment}];
                } else {
                    isError = true;
                    this.isTicketCloned = false;
                    this.notifier.notify('error', 'No File Term Map');
                }
            }
        }
        if (assetIds.length > 0) {
            data['assetIds'] = assetIds;
        }
        if (extrafields.length > 0) {
            data['additionalfields'] = extrafields;
        }

        if (!isError) {
            if (!this.messageService.blankarr(data.recordsets) && data.recordesc.trim() !== ''
                && data.recordname.trim() !== '' && this.rName.trim() !== '' && this.rEmail.trim() !== ''
                && this.rMobile.trim() !== '' && this.rLoc.trim() !== '') {

            } else {
                isError = true;
                this.isTicketCloned = false;
                this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
            }
        }

        if (!isError) {
            // this.dataLoaded = false;
            // console.log(JSON.stringify(data));
            if (!this.messageService.isBlankField(data)) {
                this.rest.createrecord(data).subscribe((res: any) => {
                    this.dataLoaded = true;
                    if (res.success) {
                        this.notifier.notify('success', 'Your Ticket id is: ' + res.response);
                        if (this.feature === 'cv') {
                            this.addSingleTerm(this.CONVERTED_FROM_SEQ, '', 'Ticket has been converted from : ' + this.ticketId, res.id).then((success3) => {
                                if (success3) {
                                    this.addSingleTerm(this.RESOLUTION_COMMENT_SEQ, '', 'Ticket has been converted to : ' + res.response, this.tId).then((success2) => {
                                        if (success2) {
                                            this.addSingleTerm(this.CONVERTED_SEQ, '', 'YES', this.tId).then((success) => {
                                                if (success) {
                                                    // this.notifier.notify('success', this.messageService.ADD_EFFORT);
                                                    this.closeTicket().then((success1) => {
                                                        if (success1) {
                                                            this.rest.geturlbykey({
                                                                clientid: this.clientId,
                                                                mstorgnhirarchyid: this.orgId,
                                                                Urlname: 'DisplayTicketDetails'
                                                            }).subscribe((res1: any) => {
                                                                if (res1.success) {
                                                                    this.isTicketCloned = false;
                                                                    if (res1.details.length > 0) {
                                                                        if (this.config.type === 'LOCAL') {
                                                                            if (res1.details[0].url.indexOf(this.config.API_ROOT) > -1) {
                                                                                res1.details[0].url = res1.details[0].url.replace(this.config.API_ROOT, 'http://localhost:4200');
                                                                            }
                                                                        }
                                                                        this.messageService.setNavigation(this.messageService.viewUrl);
                                                                        this.messageService.changeRouting(res1.details[0].url, {
                                                                            id: res.id,
                                                                        });
                                                                    }
                                                                } else {
                                                                    this.isTicketCloned = false;
                                                                    this.notifier.notify('error', res1.message);
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        } else {
                            this.rest.geturlbykey({
                                clientid: this.clientId,
                                mstorgnhirarchyid: this.orgId,
                                Urlname: 'DisplayTicketDetails'
                            }).subscribe((res1: any) => {
                                if (res1.success) {
                                    this.isTicketCloned = false;
                                    if (res1.details.length > 0) {
                                        if (this.config.type === 'LOCAL') {
                                            if (res1.details[0].url.indexOf(this.config.API_ROOT) > -1) {
                                                res1.details[0].url = res1.details[0].url.replace(this.config.API_ROOT, 'http://localhost:4200');
                                            }
                                        }
                                        this.messageService.setNavigation(this.messageService.viewUrl);
                                        this.messageService.changeRouting(res1.details[0].url, {
                                            id: res.id,
                                        });
                                    }
                                } else {
                                    this.isTicketCloned = false;
                                    this.notifier.notify('error', res1.message);
                                }
                            });
                        }
                    } else {
                        this.isTicketCloned = false;
                        this.notifier.notify('error', res.message);
                    }
                }, (err) => {
                    this.isTicketCloned = false;
                    this.notifier.notify('error', this.messageService.SERVER_ERROR);
                });
            } else {
                this.isTicketCloned = false;
                this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
            }
        }
    }

    gotoprev() {
        // this.messageService.changeRouting(this.messageService.getNavigation());
        // this.messageService.removeNavigation();

        // this.url = this.messageService.getNavigation();
        // console.log("\n This URL ====>>>>>>   ",  this.url);
        if (this.url !== null && this.url !== '') {
            const urls = this.url.split(',');
            let latesturl = urls.pop();
            const pos = latesturl.indexOf('?');
            // console.log(pos)
            const params = {};
            if (pos > -1) {
                const queryString = latesturl.substring(pos + 1, latesturl.length);
                // console.log(queryString);
                latesturl = latesturl.substring(0, pos);
                const queries = queryString.split('&');
                for (let i = 0; i < queries.length; i++) {
                    const pa = queries[i].split('=');
                    params[pa[0]] = pa[1];
                }
                // console.log(queries);
            }
            if (urls.length > 0) {
                this.messageService.setNavigation(urls);
            } else {
                this.messageService.removeNavigation();
            }
            this.messageService.changeRouting(latesturl, params);
        }
    }

    openTicketDetailsModal() {
        this.userSelected = '';
        this.dialogRef2 = this.dialog.open(this.loginName, {
            width: '550px'
        });
        this.organizationId = '';
        // this.getorganizationclientwise();
        // this.levelSelected = '';
        this.getUserListBySupportGroup();
        // if (this.grpLevel > 1) {
        //   this.getLevelData();
        // }
    }

    getUserListBySupportGroup() {
        this.searchUser.valueChanges.subscribe(
            psOrName => {
                const data = {
                    loginname: psOrName,
                    clientid: Number(this.clientId),
                    mstorgnhirarchyid: Number(this.orgId),
                    // type: 'email'
                };
                // if (this.grpLevel === 1) {
                //   data['groupid'] = this.userGroupId;
                // } else {
                //   data['groupid'] = Number(this.levelSelected);
                // }
                this.isLoading = true;
                if (psOrName !== '') {
                    this.rest.searchUserByOrgnId(data).subscribe((res: any) => {
                        // this.respObject = res1;
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
                    // this.userId = 0;
                    this.userDtl = [];
                }
            });
    }

    getLevelData() {
        this.rest.getgroupbyorgid({clientid: this.clientId, mstorgnhirarchyid: this.orgId}).subscribe((res: any) => {
            if (res.success) {
                const levels = res.details;
                for (let i = 0; i < levels.length; i++) {
                    if (levels[i].levelid === 1) {
                        this.levelSelected = levels[i].id;
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

    ngOnDestroy(): void {
    }

    changeId($event) {
        if (this.userDtl.length > 0 && this.userSelected !== '') {
            // console.log('inside')
            this.userId = this.userDtl[0].id;
            if (this.userDtl[0].vipuser === 'Y') {
                this.isVip = true;
            } else {
                this.isVip = false;
            }
            const data = {clientid: this.clientId, mstorgnhirarchyid: this.orgId, refuserid: this.userId};
            this.rest.groupbyuserwise(data).subscribe((res: any) => {
                if (res.success) {
                    // this.userinfo = res.details;
                    if (res.details.length > 0) {
                        this.OriginaluserGroupId = res.details[0].id;
                        this.rName = this.userDtl[0].firstname + ' ' + this.userDtl[0].lastname;
                        this.rLoc = this.userDtl[0].branch;
                        this.rMobile = this.userDtl[0].usermobileno;
                        this.rEmail = this.userDtl[0].useremail;
                        this.dialog.closeAll();
                    }
                } else {
                    this.notifier.notify('error', res.message);
                }
            }, (err) => {
                this.notifier.notify('error', this.messageService.SERVER_ERROR);
            });
        }
    }

    onSourceChange() {
        if (this.selectSource === 'Alert') {
            const oldcat = this.messageService.copyArray(this.previouscat);
            // console.log(JSON.stringify(oldcat));
            for (let i = 0; i < oldcat[1].child.length; i++) {
                if (oldcat[1].child[i].title === 'Datacenter Services - Alert') {

                    const val = oldcat[1].child[i];
                    oldcat[1].child.splice(i, 1);

                    oldcat[1].child.unshift(val);
                    // console.log(JSON.stringify(val));
                    this.onCategoryChange(2, JSON.stringify(val));
                    break;
                }
            }
            if (this.feature === 'cv') {
                this.ticketTypes = [];
                this.ticketTypes = this.messageService.copyArray(oldcat);
            }
        } else {
            if (this.prevSelectSource === 'Alert') {
                this.ticketTypes = this.messageService.copyArray(this.previouscat);
            }
        }
        this.prevSelectSource = this.selectSource;
    }

    assetAttached(data: any[]) {
        // console.log(JSON.stringify(data));
        for (let i = 0; i < data.length; i++) {
            this.ticketAssetIds.push(data[i]);
        }
    }

    assetRemoved(data) {
        this.ticketAssetIds.splice(data.index, 1);
        // console.log(this.ticketAssetIds[index]);
    }

    gettabterms() {
        const data = {
            clientid: this.clientId,
            mstorgnhirarchyid: this.orgId,
            recorddiffid: this.typeChecked,
            recorddifftypeid: this.diffTypeId,
            grpid: this.userGroupId,
            recordstatustypeid: 3,
            recordstatusid: 0
        };
        this.rest.gettabterms(data).subscribe((res: any) => {
            if (res.success) {
                this.scheduletab = res.details.scheduletab;
                // this.plantab = res.details.plantab;
                this.extras = [];
                for (let i = 0; i < res.details.plantab.length; i++) {
                    if (res.details.plantab[i].seq === 62 || res.details.plantab[i].seq === 67 || res.details.plantab[i].seq === 68) {
                        this.extras.push(res.details.plantab[i]);
                    } else {
                        this.plantab.push(res.details.plantab[i]);
                    }
                    if (res.details.plantab[i].seq === 57) {
                        if (res.details.plantab[i].val === 'Yes') {
                            this.displayMandatory = false;
                        }
                    }
                }
                // console.log('displayMandatory : ', this.displayMandatory);
            } else {
                this.notifier.notify('error', res.message);
            }
        }, (err) => {
            this.notifier.notify('error', this.messageService.SERVER_ERROR);
        });
    }

    searchTicket() {
        this.isSearchTicket = true;
        this.searchTicketdetails = [];
        const data = {
            clientid: this.clientId,
            mstorgnhirarchyid: this.orgId,
            RecordNo: this.tNumber.trim()
        };
        this.rest.getrecorddetailsbynoforlinkrecord(data).subscribe((res: any) => {
            this.isSearchTicket = false;
            if (res.success) {
                if (res.details.length > 0) {
                    this.searchTicketdetails = res.details;
                    this.isAttachedTicket = false;
                    this.notifier.notify('success', this.messageService.TICKET_FOUND);
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

    clicksearch(id: any) {
        const url = this.messageService.externalUrl + '?dt=' + id + '&au=' + this.messageService.getUserId() + '&bt=' + this.messageService.getToken() + '&tp=dp';
        window.open(url, '_blank');
    }

    attachTicket() {
        this.isAttachedTicket = true;
        this.attachedTicket.push({
            id: this.searchTicketdetails[0].id,
            code: this.searchTicketdetails[0].code,
            recordtype: this.searchTicketdetails[0].recordtype,
            title: this.searchTicketdetails[0].title
        });
        this.searchTicketdetails = [];
    }

    removeTicket(i: number) {
        this.attachedTicket.splice(i, 1);
    }

    afterclosed(val, seq) {
        // console.log(val, seq);
        val = this.messageService.dateConverter(val, 5);
        if (seq === 67) {
            this.termstartdate = val.trim();
        } else if (seq === 68) {
            this.termenddate = val.trim();
        }
        if (this.termstartdate !== '' && this.termenddate !== '') {
            const startdate = new Date(this.termstartdate);
            const enddate = new Date(this.termenddate);
            if (enddate.getTime() >= startdate.getTime()) {
                const diffTime = Number(enddate) - Number(startdate);
                // console.log(diffTime)
                const diffmin = Math.ceil(diffTime / (1000 * 60));
                // console.log(diffmin);
                const hmin = Math.floor(diffmin / 60);
                const mmin = Math.round(diffmin % 60);
                // console.log(hmin, mmin);
                // hour = hour + hmin;
                let hhour;
                let hhmin;
                if (hmin < 10) {
                    hhour = '0' + hmin;
                } else {
                    hhour = hmin;
                }
                if (mmin < 10) {
                    hhmin = '0' + mmin;
                } else {
                    hhmin = mmin;
                }
                for (let i = 0; i < this.extras.length; i++) {
                    if (this.extras[i].seq === 62) {
                        this.extras[i].val = hhour + ' : ' + hhmin;
                    }
                }
            } else {
                for (let i = 0; i < this.extras.length; i++) {
                    if (this.extras[i].seq === 62) {
                        this.extras[i].val = '';
                    }
                }
                this.notifier.notify('error', this.messageService.ENDDATE_GREATER);
            }
            // console.log(startdate, enddate);
        } else {
            for (let i = 0; i < this.extras.length; i++) {
                if (this.extras[i].seq === 62) {
                    this.extras[i].val = '';
                }
            }
        }
    }

    onplandropdownchange(val, seq) {
        // console.log(val, seq);
        if (seq === 57) {
            if (val === 'Yes') {
                this.displayMandatory = false;
            } else {
                this.displayMandatory = true;
            }
        }
    }
}
