import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/do';
import {MessageService} from './message.service';
import 'rxjs-compat/add/operator/timeout';
import {NotifierService} from 'angular-notifier';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private messageService: MessageService, private notifier: NotifierService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const id = Number(this.messageService.getUserId());
    const token = this.messageService.getToken();
    // console.log('req.url====' + JSON.stringify(token));
    const login = '/login';
    const generatetoken = '/generatetoken';
    const validateusertoken = '/validateusertoken';
    if (request.url.search(login) === -1 && request.url.search(validateusertoken) === -1 && request.url.search(generatetoken) === -1) {
      // let userId;
      let newParams = new HttpParams({fromString: request.params.toString()});
      if (request.method === 'GET') {
        newParams = newParams.append('userid', id + '');
      }
      if (request.method === 'POST') {
        request.body.userid = id;
      }
      request = request.clone({
        setHeaders: {
          Authorization: token
          // Auth: id
        },
        params: newParams
      });
    }
    return next.handle(request).do((event: HttpEvent<any>) => {
      // console.log(event);
      if (event instanceof HttpResponse) {
        // do stuff with response if you want
        // console.log(event.headers);
      }
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          this.notifier.notify('error', this.messageService.TOKEN_LOG_OUT);
          setTimeout(() => {
            this.messageService.logOut();
          }, 10 * 1000);
        }
      }
    });
  }
}
