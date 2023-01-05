import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanDeactivate, Router, RouterStateSnapshot} from '@angular/router';
import {MessageService} from './message.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanActivateChild {

  constructor(private messageService: MessageService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userId = this.messageService.getUserId();
    const token = this.messageService.getToken();
    if (userId !== null && userId !== undefined && token !== null && token !== undefined) {
      return true;
    } else {
      // console.log('----out----')
      // return false;
      return true;
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // console.log('------Authenticate Child-----------');
    return this.canActivate(route, state);
  }
}
