import {Component, ElementRef, OnInit, ViewChild,} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {RestApiService} from '../rest-api.service';
import {NotifierService} from 'angular-notifier';
import {MessageService} from '../message.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userName: string;
  clientCode: string;
  password: string;
  private respObject: any;
  private notifier: NotifierService;
  currentYear: number;
  isLoggedin: boolean;
  image: any;
  orgnid: any;
  clientId: any;
  uploadedName: any;
  private modalRef: NgbModalRef;
  // @ViewChild('content') private content;
  @ViewChild("content",{static:true}) content:ElementRef;
  confrimMssg = 'Your organisation has Enabled Multi Factor Authentication.\nPlease register your user ID to enable Multi Factor Authentication for successful login.\nPress \'Ok\' to continue for Multi Factor Authentication Registration.';
  confrimMssg1 = '(Prerequisite: You need to have Google Authenticator or Microsoft Authenticator or Authy Authenticator installed in your mobile)';

  constructor(private actRoute: ActivatedRoute, private route: Router, private _rest: RestApiService, private modalService: NgbModal, notifier: NotifierService, private messageService: MessageService, private sanitizer: DomSanitizer) {
    this.notifier = notifier;
  }

  ngOnInit() {
    this.currentYear = new Date().getFullYear();
    this.isLoggedin = false;
    this.actRoute.queryParams.subscribe(params => {
      let userid = params['au'];
      const token = params['bt'];
      if (userid !== undefined && token !== undefined) {
        userid = Number(userid);

        this.clientId = Number(params['i']);
        this.orgnid = Number(params['m']);
        const orgcode = params['r'];
        const loginname = params['s'];
        this.uploadedName = params['ig'];
        this.messageService.addSessionData(userid, token);
        const data = {
          loginname: loginname,
          code: orgcode
        };
        this.displayQRCode(data);
      }
    });
  }


  redirect() {
    this.modalRef.close();
    this.route.navigate(['mfaRegistration']);
  }

  login() {
    const data = {
      loginname: this.userName,
      code: this.clientCode,
      password: this.password,
    };
    // console.log('data===' + JSON.stringify(data));
    if (!this.messageService.isBlankField(data)) {
      this.isLoggedin = true;
      this._rest.login(data).subscribe((res) => {
        this.respObject = res;
        // console.log();
        this.isLoggedin = false;
        if (this.respObject.success) {
          const orgnType = this.respObject.details[0].orgnTypeId;
          const userId = this.respObject.details[0].userid;
          const token = this.respObject.details[0].token;
          this.orgnid = this.respObject.details[0].mstorgnhirarchyid;
          this.clientId = this.respObject.details[0].clientid;
          const orgmfa = this.respObject.details[0].orgmfa;
          const usermfa = this.respObject.details[0].usermfa;
          this.messageService.addSessionData(userId, token);
          //this.downloadFile(uploadedName);
          if ((orgmfa === 1) && (usermfa === 2)) {
            this.uploadedName = this.respObject.details[0].uploadedfilename;
            this.displayQRCode(data);
          } else if ((orgmfa === 1) && (usermfa === 1)) {

            this.messageService.loginData = data;
            this.messageService.setLoginData(data);
            this.route.navigate(['mfaValidation']);
          } else {
            if (orgnType === 1) {
              this.route.navigate(['admin/module']);
            } else {
              this.route.navigate(['ticket/dashboard']);
            }
          }
        } else {
          this.notifier.notify('error', this.respObject.message);
        }
      }, (err) => {
        this.isLoggedin = false;
        this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    } else {
      this.notifier.notify('error', this.messageService.BLANK_ERROR_MESSAGE);
    }
  }

  displayQRCode(data) {
    this.modalRef = this.modalService.open(this.content, {size: 'xl'});
    this.messageService.uploadFileName = this.uploadedName;
    this.messageService.loginData = data;
    this.messageService.loginClient = this.clientId;
    this.messageService.loginOrgnId = this.orgnid;
    this.messageService.setLoginData(data);
    const downloadData = {
      'clientid': this.clientId,
      'mstorgnhirarchyid': this.orgnid,
      'filename': this.uploadedName,
    };
    this.messageService.setDownloadData(downloadData);
  }
}
