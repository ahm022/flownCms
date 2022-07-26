import { GeneralService } from 'src/app/services/general.service';
import { QueriesService } from 'src/app/services/queries.service';
import { GraphqlService } from 'src/app/services/graphql.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { StorageService } from '../../services/storage.service';
import { icons } from 'data-config';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { mapNotifications, mapPageToItem } from 'src/app/services/mapping-helper';
import * as _ from 'lodash';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  @ViewChild('avatarDetails') avatarDetails: ElementRef;
  @ViewChild('notifications') notificationsView: ElementRef;
  avatar = icons.avatar.toString();
  notificationIcon = icons.notification.toString();
  loaderIcons = icons.loaderIcon.toString()
  fullName: string;
  email: string;
  notifications = []
  emptyState
  notificationLoader
  showNotifications
  constructor(
    private authService: AuthenticationService,
    private storageService: StorageService,
    private graphqlService: GraphqlService,
    private queries: QueriesService,
    private generalService: GeneralService
  ) {
    this.prepareUserInformation();
  }
  ngOnInit(): void {}
  logout() {
    this.authService.logout();
  }
  displaDetails() {
    this.avatarDetails.nativeElement.classList.toggle('show');
  }
  prepareUserInformation() {
    if (this.storageService.checkIfUserIsLoggedIn()) {
      const userInformation: any = this.storageService.getUserInformation();
      console.log('userInformation', userInformation);
      if (userInformation) {
        this.fullName =
          userInformation.cmsTemplate2_All.firstName +
          ' ' +
          userInformation.cmsTemplate2_All.lastName;
        this.email = userInformation.cmsTemplate2_All.email;
      }
    }
  }
  getNotifications() {
    this.notifications = []
      this.showNotifications =  this.showNotifications ?  false : true
      if(this.showNotifications) {
        this.notificationLoader = true
        this.graphqlService.getGraphQL(this.queries.notifications).then((results)=>{
          this.notifications = _.get(
            results,
            'system.notifications.messages.items',
            []
          ).map((x: any) => mapNotifications(x));
        }).finally(()=>{
          this.emptyState = this.notifications.length > 0 ? false : true
          this.notificationLoader = false
        })
      }
  }
  goToItem(id) {
    this.showNotifications = false
    this.generalService.navigateTo('/dashboard/page-details/'+id)
  }
 }
