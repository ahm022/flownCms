import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
  @ViewChild('sidebarContainer') sidebarContainer: ElementRef;
  constructor(public authService: AuthenticationService) { }

  sidebarLinks = [
    {
      txt:"Pages",
      icon:"../../../assets/icons/pages.svg",
      router:"/dashboard/pages"
    },
    {
      txt:"Layout",
      icon:"../../../assets/icons/layout.svg",
      router:"/dashboard/layout"
    },
    {
      txt:"Users",
      icon:"../../../assets/icons/users.svg",
      router:"/dashboard/users"
    },
    {
      txt:"Messages",
      icon: "../../../assets/icons/messages.svg",
      router: "/dashboard/messages"
    },
    {
      txt:"Comments",
      icon: "../../../assets/icons/comments.svg",
      router: "/dashboard/comments"
    },
    {
      txt:"Gallery",
      icon: "../../../assets/icons/gallery.svg",
      router: "/dashboard/gallery"
    }
  ]

  hideShowSideBar() {
    this.sidebarContainer.nativeElement.classList.toggle('hide-show')
  }

  ngOnInit(): void {
  }
  logout() {
    this.authService.logout();
  }
}
