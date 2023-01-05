import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {RestApiService} from '../rest-api.service';
import {NotifierService} from 'angular-notifier';
import {MessageService} from '../message.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-external-csat',
  templateUrl: './external-csat.component.html',
  styleUrls: ['./external-csat.component.css']
})
export class ExternalCsatComponent implements OnInit {
  CLOSE_STATUS_SEQ = 8;
  RESOLVE_STATUS_SEQUENCE = 3;

  STATUS_SEQ = 2;
  @ViewChild('checkterm') private checkterm;
  public nextstatusseq: any;
  stateterms: any[];
  private multitermopentype: string;
  private termattachment: any[];
  private hideAttachment: boolean;
  private checktermdialog: MatDialogRef<unknown, any>;
  clientId: any;
  private orgId: any;
  private diffTypeId: number;
  private typeChecked: any;
  private stageId: number;
  private ticketno: number;
  private userGroupId: any;
  private nextWokflowstateid: number | any;
  private transitionid: any | number;
  private statustypeid: any;
  private statusid: any;
  private workingtypeid: any;
  private workingid: any;
  private currentstateid: number;
  // private nexttransitionid: any | number;

  constructor(private actRoute: ActivatedRoute, private dialog: MatDialog, private rest: RestApiService, private notifier: NotifierService, private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.actRoute.queryParams.subscribe(params => {
      const loginName = params['ur'];
      const userclientId = Number(params['cl']);
      const organizationId = Number(params['mst']);
      const ticketid = params['tp'];
      this.userGroupId = Number(params['gp']);
      this.hideAttachment = false;
      // console.log('inside')
      this.rest.generatetoken({
        clientid: userclientId,
        mstorgnhirarchyid: organizationId,
        loginname: loginName
      }).subscribe((res: any) => {
        if (res.success) {
          if (res.details.length > 0) {
            const userid = res.details[0].userid;
            const token = res.details[0].token;
            this.messageService.addSessionData(userid, token);
            const data1 = {clientid: userclientId, mstorgnhirarchyid: organizationId, recordno: ticketid};
            this.rest.getrecordid(data1).subscribe((res1: any) => {
              if (res1.success) {
                this.ticketno = res1.details;
                this.rest.getrecorddetails({
                  'clientid': userclientId,
                  'mstorgnhirarchyid': organizationId,
                  'recordid': this.ticketno
                }).subscribe((res2: any) => {
                  if (res2.success) {
                    const ticketDetails = res2.details;
                    this.clientId = ticketDetails[0].clientid;
                    this.orgId = ticketDetails[0].mstorgnhirarchyid;
                    this.stageId = ticketDetails[0].recordstageid;
                    const workflowid = ticketDetails[0].workflowdetails.workflowid;
                    this.typeChecked = ticketDetails[0].recordtypeid;
                    this.diffTypeId = ticketDetails[0].typedifftypeid;
                    this.workingtypeid = ticketDetails[0].workflowdetails.cattypeid;
                    this.workingid = ticketDetails[0].workflowdetails.catid;
                    this.rest.getstatedetails({
                      clientid: this.clientId,
                      mstorgnhirarchyid: this.orgId,
                      recordid: this.ticketno,
                      recordstageid: this.stageId
                    }).subscribe((res3: any) => {
                      if (res3.success) {
                        if (res3.details.length > 0) {
                          const statusseq = res3.details[0].seqno;
                          this.transitionid = res3.details[0].transitionid;
                          this.currentstateid = res3.details[0].currentstateid;
                          if (statusseq === this.RESOLVE_STATUS_SEQUENCE) {
                            const data = {
                              clientid: this.clientId,
                              mstorgnhirarchyid: this.orgId,
                              typeseqno: this.STATUS_SEQ,
                              seqno: this.CLOSE_STATUS_SEQ,
                              transitionid: this.transitionid,
                              processid: workflowid
                            };
                            this.rest.getstatebyseqno(data).subscribe((res4: any) => {
                              if (res4.success) {
                                if (res4.details.length > 0) {
                                  this.nextstatusseq = this.CLOSE_STATUS_SEQ;
                                  this.nextWokflowstateid = res4.details[0].mststateid;
                                  this.statustypeid = res4.details[0].recorddifftypeid;
                                  this.statusid = res4.details[0].recorddiffid;
                                  this.stateterms = [];
                                  const data2 = {
                                    'clientid': this.clientId,
                                    'mstorgnhirarchyid': this.orgId,
                                    'recordtickettypedifftypeid': this.diffTypeId,
                                    'recordtickettypediffid': this.typeChecked,
                                    'recordstatusdifftypeid': this.statustypeid,
                                    'recordstatusdiffid': this.statusid
                                  };
                                  this.rest.getcommontermnamesbystate(data2).subscribe((res5: any) => {
                                    if (res5.success) {
                                      this.stateterms = res5.details;
                                      this.multitermopentype = 'workflow';
                                      this.termattachment = [];
                                      this.hideAttachment = true;
                                      this.checktermdialog = this.dialog.open(this.checkterm, {
                                        width: '700px'
                                      });
                                    } else {
                                      this.notifier.notify('error', res5.message);
                                    }
                                  }, (err) => {
                                    this.notifier.notify('error', this.messageService.SERVER_ERROR);
                                  });
                                } else {
                                }

                              } else {

                                this.notifier.notify('error', res4.message);
                              }
                            }, (err) => {
                              this.notifier.notify('error', this.messageService.SERVER_ERROR);
                            });

                          } else if (statusseq === this.CLOSE_STATUS_SEQ) {
                            this.notifier.notify('error', 'Ticket is already closed');
                          } else {
                            this.notifier.notify('error', 'Please resolve the ticket first');
                          }
                        } else {
                          this.notifier.notify('error', this.messageService.WORKFLOW_ERROR);
                        }
                      } else {
                        this.notifier.notify('error', res3.message);
                      }
                    }, (err) => {
                      // this.notifier.notify('error', this.messageService.SERVER_ERROR);
                    });
                  } else {
                    this.notifier.notify('error', res2.message);
                  }
                });
              } else {
                this.notifier.notify('error', res1.message);
              }
            }, (err) => {
              this.notifier.notify('error', this.messageService.SERVER_ERROR);
            });
          } else {
            this.notifier.notify('error', 'User Details not mapped');
          }

        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        // this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    });
  }

  addStatusTerm() {
    let isBlank = false;
    // console.log(JSON.stringify(this.stateterms));
    const terms = [];
    let ismandatory = false;
    for (let i = 0; i < this.stateterms.length; i++) {
      if (this.stateterms[i].termtypeid === 3) {
        if (this.termattachment.length > 0) {
          this.stateterms[i].insertedvalue = this.termattachment[0].originalName;
          this.stateterms[i].termdescription = this.termattachment[0].fileName;
        }
      }
      if (this.stateterms[i].termtypeid === 6) {
        this.stateterms[i].insertedvalue = this.stateterms[i].insertedvalue + '';
        if (Number(this.stateterms[i].insertedvalue) < 5) {
          ismandatory = true;
        }
      }
      if (this.stateterms[i].insertedvalue.trim() !== '') {
        terms.push(this.stateterms[i]);
      }
      if (this.stateterms[i].insertedvalue.trim() === '' && this.stateterms[i].iscompulsory === 1) {
        isBlank = true;
        break;
      }
    }
    if (ismandatory) {
      // console.log(isBlank)
      for (let i = 0; i < this.stateterms.length; i++) {
        if (this.stateterms[i].termtypeid === 1 && this.stateterms[i].insertedvalue.trim() === '') {
          isBlank = true;
        }
      }
    }
    // console.log(JSON.stringify(this.stateterms));
    if (isBlank) {
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    } else {
      const data = {
        'clientid': this.clientId,
        'mstorgnhirarchyid': Number(this.orgId),
        'recordid': this.ticketno,
        'recordstageid': this.stageId,
        'details': terms,
        'recorddifftypeid': this.diffTypeId,
        'recorddiffid': this.typeChecked,
        usergroupid: this.userGroupId
      };
      // console.log(JSON.stringify(data));
      this.rest.insertmultipletermvalue(data).subscribe((res: any) => {
        if (res.success) {
          this.notifier.notify('success', this.messageService.TERM_SUCCESS);
          this.checktermdialog.close();
          // this.termValueBySeq = [];
          this.moveWorkflow();
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    }
  }

  blockSpecialChar(e) {
    const k = e.keyCode;
    return (k !== 35 && k !== 64);
  }

  moveWorkflow() {
    const data = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.orgId,
      'recorddifftypeid': this.workingtypeid,
      'recorddiffid': this.workingid,
      transitionid: 0,
      'previousstateid': this.currentstateid,
      'currentstateid': this.nextWokflowstateid,
      'manualstateselection': 0,
      'transactionid': this.ticketno,
      'createdgroupid': this.userGroupId,
      mstgroupid: this.userGroupId,
      mstuserid: Number(this.messageService.getUserId())
    };
    this.rest.moveWorkflow(data).subscribe((res: any) => {
      if (res.success) {
        this.notifier.notify('success', 'Process moved to next state');

      } else {
        this.notifier.notify('error', res.message);
      }
    }, (err) => {
      this.notifier.notify('error', this.messageService.SERVER_ERROR);
    });
  }
}
