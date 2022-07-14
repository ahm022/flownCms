import { GeneralService } from 'src/app/services/general.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Route, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { StorageService } from '../services/storage.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GuardGuard implements CanActivate {
  constructor(private $authenticationService: AuthenticationService, private generalService: GeneralService) {}

  canActivate(): boolean {
    if(!this.$authenticationService.isLoggedIn) {
        this.generalService.navigateTo('/')
      return false
    }
    return true
  }

}
