import { AuthenticationService } from 'src/app/services/authentication.service';
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
  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
  }
  logout() {
    this.authService.logout();
  }
  displaDetails() {
    this.avatarDetails.nativeElement.classList.toggle('show')
  }
}
