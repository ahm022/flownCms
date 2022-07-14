import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharingDataService {

  private userInformationSubject = new Subject<boolean> ();
  private newLoggedInUserSubject = new Subject<boolean> ();

  constructor() { }

  subscribeToUserInformationSubject() { 
    if(this.userInformationSubject.observers === undefined || this.userInformationSubject.observers === null) {
      this.userInformationSubject = new Subject<boolean> ();
    }
     return this.userInformationSubject.asObservable();
  }

  notifyUserInformationSubscribers(checkUserInfo: boolean) {
    if(this.userInformationSubject && this.userInformationSubject.observers) { 
      this.userInformationSubject.next(checkUserInfo);
    }
  }

  unsubscribeFromUserInformationSubject() {
    this.userInformationSubject.unsubscribe();
  }


  subscribeToNewLoggedInUserSubject() { 
    if(this.newLoggedInUserSubject.observers === undefined || this.newLoggedInUserSubject.observers === null) {
      this.newLoggedInUserSubject = new Subject<boolean> ();
    }
     return this.newLoggedInUserSubject.asObservable();
  }

  notifyNewLoggedInUserSubscribers(userInformation: any) {
    if(this.newLoggedInUserSubject && this.newLoggedInUserSubject.observers) { 
      this.newLoggedInUserSubject.next(userInformation);
    }
  }

  unsubscribeFromLoggedInUserSubject() {
    this.newLoggedInUserSubject.unsubscribe();
  }

}
