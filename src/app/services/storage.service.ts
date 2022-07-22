import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  // User Information
  public saveUserInformation(userInformation: any, userId:any, userPermissions: any) {
    localStorage.setItem('cms_user_information', JSON.stringify(userInformation));
    localStorage.setItem('cms_user_permissions', JSON.stringify(userPermissions));
    localStorage.setItem('cms_user_id', JSON.stringify(userId));
  }

  public saveLayoutInformation(layoutId: any) {
    localStorage.setItem('cms_user_Layout_id', JSON.stringify(layoutId));
  }

  public getUserInformation() {
    return localStorage.getItem('cms_user_information') ? JSON.parse(localStorage.getItem('cms_user_information')) : null;
  }

  public getUserPermissions() {
    return localStorage.getItem('cms_user_permissions') ? JSON.parse(localStorage.getItem('cms_user_permissions')) : null;
  }

  public checkIfUserIsLoggedIn() {
    return localStorage.getItem('cms_user_information') ? true : false;
  }

  public getLayoutId() {
    return localStorage.getItem('cms_user_Layout_id') ? JSON.parse(localStorage.getItem('cms_user_Layout_id')) : null;
  }

  // User Id
  // public saveUserId(userId: string) {
  //   localStorage.setItem('backOffice_user_id', userId);
  // }

  // public getUserId() {
  //   return localStorage.getItem('backOffice_user_id') ? parseInt(localStorage.getItem('backOffice_user_id')) : null;
  // }


  // Token
  public getAccessToken() {
    return localStorage.getItem('cms_user_token');;
  }

  public saveAccessToken(token: string) {
    localStorage.setItem('cms_user_token', token);
  }

  public checkIfHasAccessToken() {
    return localStorage.getItem('cms_user_token') ? true : false;
  }


  // Remove Data
  public clearUserInformation() {
    localStorage.removeItem('cms_user_id');
    localStorage.removeItem('cms_user_token');
    localStorage.removeItem('cms_user_information');
  }

  // lookups
  public getLookups() {
    return localStorage.getItem('cms_lookups');;
  }

  public saveLookups(token: string) {
    localStorage.setItem('cms_lookups', token);
  }

  public checkIfHasLookups() {
    return localStorage.getItem('cms_lookups') ? true : false;
  }

  public clearLookups() {
    localStorage.removeItem('cms_lookups');
  }
}
