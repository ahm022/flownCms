import { GraphqlService } from './services/graphql.service';
import { QueriesService } from './services/queries.service';
import { Component,OnDestroy, OnInit } from '@angular/core';
import { Apollo, gql, Query } from 'apollo-angular';

import { AuthenticationService } from "./services/authentication.service";
import { HttpLink } from 'apollo-angular/http';
import { StorageService } from "./services/storage.service";
import { Observable, map } from 'rxjs';
import { mapCategories } from './services/mapping-helper';
import * as _ from "lodash";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy{
  categories : any;
  sharingDataService: any;
  _fuseNavigationService: any;
  generalService: any;

  constructor(
    private apollo: Apollo,
    private httpLink: HttpLink,
    private queries: QueriesService,
    private graphqlService: GraphqlService,
    private authenticationService: AuthenticationService,
    private storageService: StorageService,
  ) {

    this.authenticationService.checkIfLogin().then(() => {
      // Logged In
      console.log("this.authenticationService.isLoggedIn",this.authenticationService.isLoggedIn)
      if (this.authenticationService.isLoggedIn) {
        this.prepareUserInfo();
        // Not logged In!
      } else {
        this.authenticationService.login();
      }
    });
  }
  ngOnInit(): void {
    this.getCategories()
    if(this.storageService.checkIfUserIsLoggedIn()){
      console.log("trueeeeeeeee")
      const layoutId: any = this.storageService.getLayoutId();
      console.log("layoutId",layoutId)
    }else{
      console.log("falseeee")
      this.createLayout();
    }
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
  }

  getCategories() {
    this.graphqlService.getGraphQL(this.queries.getCategoriesQuery).then((results)=>{
      console.log(results);
      this.categories =  _.get(results, "cmsTemplate2.lookups.categories", []).map((x: any) => mapCategories(x));
      localStorage.setItem('categories', JSON.stringify(this.categories))
    })
  }

  prepareUserInfo() {
    this.graphqlService.getGraphQL(this.queries.whoAmI, true)
    .then((userInfo) => {
      const userDetails: any = _.get(userInfo, "cmsTemplate2.actions.getMyProfile.views", null);
      const userId:any = _.get(userInfo, "cmsTemplate2.actions.getMyProfile.id", null);
      
      this.storageService.saveUserInformation(userDetails,userId,null);
      this.sharingDataService.notifyNewLoggedInUserSubscribers(userDetails);
    })
    .catch((exGql) => {
      this.generalService.showErrorMessage("Error Getting Current User Info");
    }).finally(() => {
    });
  }

  createLayout() {
    this.graphqlService.getGraphQL(this.queries.createlayout, true)
    .then((layoutId) => {
      console.log("layoutId",layoutId)
      const layoutDetails: any = _.get(layoutId, "cmsTemplate2.actions.addLayout.id", null);
      this.storageService.saveLayoutInformation(layoutDetails);
    })
    .catch((exGql) => {
      this.generalService.showErrorMessage("Error Getting Current User Info");
    }).finally(() => {
    });
  }
  
}
