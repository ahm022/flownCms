import { AuthenticationService } from 'src/app/services/authentication.service';
import { StorageService } from '../../services/storage.service';
import { icons } from 'data-config';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  @ViewChild('avatarDetails') avatarDetails: ElementRef
  avatar = icons.avatar.toString()
  fullName: string;
  email: string;
  constructor(private authService: AuthenticationService,private storageService: StorageService,) { 

    this.prepareUserInformation();
  }
  ngOnInit(): void {

  }
  logout() {
    this.authService.logout();
  }
  displaDetails() {
    this.avatarDetails.nativeElement.classList.toggle('show')
  }
  prepareUserInformation() {
    if(this.storageService.checkIfUserIsLoggedIn()) {
       const userInformation: any = this.storageService.getUserInformation();
       console.log("userInformation",userInformation)
      this.fullName = userInformation.cmsTemplate2_All.firstName + ' ' + userInformation.cmsTemplate2_All.lastName;
      this.email = userInformation.cmsTemplate2_All.email;
    }
}
}
