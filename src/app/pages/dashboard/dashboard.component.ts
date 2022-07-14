import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  hintTitle
  constructor(public authService: AuthenticationService, public router : Router) { }

  ngOnInit(): void {
    this.hintTitle =  this.router.url === "/" ? true : false

  }

}
