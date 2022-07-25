import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notifications-container',
  templateUrl: './notifications-container.component.html',
  styleUrls: ['./notifications-container.component.scss']
})
export class NotificationsContainerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log('test');
  }

}
