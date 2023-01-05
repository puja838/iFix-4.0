import {Component, OnInit} from '@angular/core';
import {NotifierService} from 'angular-notifier';
import {ActivatedRoute, Router} from '@angular/router';
import {RestApiService} from '../rest-api.service';
import {MessageService} from '../message.service';

@Component({
  selector: 'app-external-login',
  templateUrl: './external-login.component.html',
  styleUrls: ['./external-login.component.css']
})
export class ExternalLoginComponent implements OnInit {

  userName: string;
  clientCode: string;
  password: string;
  private notifier: NotifierService;
  currentYear: number;
  private tId: number;

  constructor(private actRoute: ActivatedRoute, private rest: RestApiService, notifier: NotifierService, private messageService: MessageService) {
    this.notifier = notifier;
  }

  ngOnInit() {
    this.currentYear = new Date().getFullYear();
    this.actRoute.queryParams.subscribe(params => {
      this.clientCode = params['cc'];
      this.tId = params['tt'];
    });
  }

  login() {
    const data = {
      loginname: this.userName,
      code: this.clientCode,
      password: this.password
    };
    if (!this.messageService.isBlankField(data)) {
      this.rest.login(data).subscribe((res: any) => {
        if (res.success) {
          const userId = res.details[0].userid;
          const token = res.details[0].token;
          const clientid = res.details[0].clientid;
          const mstorgnhirarchyid = res.details[0].mstorgnhirarchyid;
          const data1 = {clientid: clientid, mstorgnhirarchyid: mstorgnhirarchyid, recordno: this.tId};
          this.messageService.addSessionData(userId, token);
          this.rest.getrecordid(data1).subscribe((res1: any) => {
            if (res1.success) {
              const url = res.details[0].externalurl + '?dt=' + res1.details + '&au=' + userId + '&bt='
                + token + '&tp=dp&i=' + clientid + '&m=' + mstorgnhirarchyid;
              // const url = 'http://localhost:4200/ticket/external?dt=' + res1.details + '&au=' + userId + '&bt=' + token + '&tp=dp';
              // window.open(url, '_blank');
              window.location.href = url;
            } else {
              this.notifier.notify('error', res1.message);
            }
          }, (err) => {
            this.notifier.notify('error', this.messageService.SERVER_ERROR);
          });
        } else {
          this.notifier.notify('error', res.message);
        }
      }, (err) => {
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    } else {
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }
  }

}
