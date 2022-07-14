import { GraphqlService } from './services/graphql.service';
import { QueriesService } from './services/queries.service';
import { Component } from '@angular/core';
import { Apollo, gql, Query } from 'apollo-angular';

import { AuthenticationService } from "./services/authentication.service";
import { HttpLink } from 'apollo-angular/http';
import { StorageService } from "./services/storage.service";
import { Observable, map } from 'rxjs';
import * as _ from "lodash";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  categories :  Observable<any>;
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
      if (this.authenticationService.isLoggedIn) {
        // this.prepareUserInfo();
        // Not logged In!
      } else {
        this.authenticationService.login();
      }
    });
  }
  ngOnInit(): void {
  }



  // prepareUserInfo() {
  //   this.graphqlService.getGraphQL(this.queries.whoAmI, true)
  //   .then((userInfo) => {
  //     const userDetails: any = _.get(userInfo, "people.actions.getMyProfile.views", null);
  //     this.sharingDataService.notifyNewLoggedInUserSubscribers(userDetails);
  //   })
  //   .catch((exGql) => {
  //     this.generalService.showErrorMessage("Error Getting Current User Info");
  //   }).finally(() => {
  //   });
  // }
}
