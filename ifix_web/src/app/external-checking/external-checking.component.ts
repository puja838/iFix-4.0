import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RestApiService} from '../rest-api.service';
import {NotifierService} from 'angular-notifier';
import {MessageService} from '../message.service';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {ConfigService} from '../config.service';

@Component({
  selector: 'app-external-checking',
  templateUrl: './external-checking.component.html',
  styleUrls: ['./external-checking.component.css']
})
export class ExternalCheckingComponent implements OnInit, OnDestroy {
  private userAuth: Subscription;

  constructor(private actRoute: ActivatedRoute, private config: ConfigService, private rest: RestApiService, private notifier: NotifierService, private messageService: MessageService) {
  }

  ngOnInit(): void {
    // this.userAuth = this.messageService.getClientUserAuth().subscribe(auth => {
    //   this.onPageLoad();
    // });
    this.onPageLoad();
  }

  onPageLoad() {
    this.actRoute.queryParams.subscribe(params => {
      const userid = params['au'];
      const token = params['bt'];
      const id = params['dt'];
      const tp = params['tp'];
      const i = params['i'];
      const m = params['m'];
      const orgcode = params['r'];
      const loginname = params['s'];
      // console.log(userid)
      // console.log(token)
      // console.log(code)
      this.messageService.clearSession();
      this.rest.validateusertoken({
        'userid': Number(userid),
        'token': token
      }).subscribe((res1: any) => {
        if (res1.success) {
          this.messageService.addSessionData(userid, token);
          // this.messageService.setNavigation(this.messageService.logOutUrl);
          let url;
          const routeparams = {};
          if (tp === 'cl' || tp === 'cv') {
            url = 'CloneTicket';
            routeparams['id'] = id;
            routeparams['tp'] = tp;
          } else if (tp === 'cz') {
            url = 'dashboard';
          } else if (tp === 'mz') {
            url = 'mfavalidation';
          } else {
            routeparams['id'] = id;
            url = 'DisplayTicketDetails';
          }
          this.rest.geturlbykey({
            clientid: Number(i),
            mstorgnhirarchyid: Number(m),
            Urlname: url
          }).subscribe((res: any) => {
            if (res.success) {
              if (res.details.length > 0) {
                if (this.config.type === 'LOCAL') {
                  if (res.details[0].url.indexOf(this.config.API_ROOT) > -1) {
                    res.details[0].url = res.details[0].url.replace(this.config.API_ROOT, 'http://localhost:4200');
                  }
                }
                const data = {
                  loginname: loginname,
                  code: orgcode,
                };
                this.messageService.loginData = data;
                this.messageService.setLoginData(data);
                this.messageService.changeRouting(res.details[0].url, routeparams);
              }
            } else {
              this.notifier.notify('error', res.message);
            }
          }, (err) => {
            // console.log(err);
          });
        } else {
          this.notifier.notify('error', res1.message);
        }
      }, (err) => {
        // this.notifier.notify('error', this.messageService.SERVER_ERROR);
      });
    });
  }

  ngOnDestroy(): void {
    if (this.userAuth) {
      this.userAuth.unsubscribe();
    }
  }
}
