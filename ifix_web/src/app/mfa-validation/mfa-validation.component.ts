import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RestApiService} from '../rest-api.service';
import {NotifierService} from 'angular-notifier';
import {MessageService} from '../message.service';

@Component({
  selector: 'app-mfa-validation',
  templateUrl: './mfa-validation.component.html',
  styleUrls: ['./mfa-validation.component.css']
})
export class MfaValidationComponent implements OnInit {
  dataValid: any;
  private notifier: NotifierService;
  vOtp = '';
  loginName = '';
  loginCode = '';
  respObject: any;
  validFlag: boolean;
  validFlag1: boolean;

  constructor(private route: Router, private _rest: RestApiService, notifier: NotifierService, private messageService: MessageService) {
    this.notifier = notifier;
  }

  ngOnInit(): void {

    this.validFlag = true;
    this.validFlag1 = false;
  }

  validation() {
    this.validFlag = false;
    this.validFlag1 = true;
    if (this.messageService.getLoginData() === null) {
      this.loginName = this.messageService.loginData.loginname;
      this.loginCode = this.messageService.loginData.code;
    } else {
      const loginData = this.messageService.getLoginData();
      this.loginName = loginData.loginname;
      this.loginCode = loginData.code;
    }
    const dataVal = {
      loginname: this.loginName,
      code: this.loginCode,
      totp: this.vOtp,
      usermfa: 1,
      orgmfa: 1
    };

    if (!this.messageService.isBlankField(dataVal)) {
      this._rest.login(dataVal).subscribe((res) => {
        this.respObject = res;
        // console.log();

        if (this.respObject.success) {
          const orgnType = this.respObject.details[0].orgnTypeId;
          const userId = this.respObject.details[0].userid;
          const token = this.respObject.details[0].token;
          ;
          this.messageService.addSessionData(userId, token);
          //this.downloadFile(uploadedName);
          if (orgnType === 1) {
            this.route.navigate(['admin/module']);
          } else {
            this.route.navigate(['ticket/dashboard']);
          }
          sessionStorage.removeItem('loginData');
        } else {
          this.validFlag = true;
          this.validFlag1 = false;
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.validFlag = true;
        this.validFlag1 = false;
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    } else {
      this.validFlag = true;
      this.validFlag1 = false;
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }

  }
}
