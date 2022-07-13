import { GraphqlService } from './services/graphql.service';
import { QueriesService } from './services/queries.service';
import { Component } from '@angular/core';
import { Apollo, gql, Query } from 'apollo-angular';
import { InMemoryCache } from '@apollo/client/core';
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
    apollo.create({
      cache: new InMemoryCache(),
      link: httpLink.create({
        uri: 'https://dev-leb-graph.diasporaid.com/graphql?sdl',
      }),
    });

    this.authenticationService.checkIfLogin().then(() => {
      // Logged In
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
  }

  getCategories() {
    this.graphqlService
    .getGraphQL(this.queries.categoryListQuery, false)
    .then((data) => {
      localStorage.setItem('categories', JSON.stringify(data.cmsTemplate.lookups.categories))
    });
  }
  name = "hhhhh"
  testMutation() {
    this.graphqlService
    .mutateGraphQL(this.queries.addCategoriesMutation, {name: this.name})
    .then((data) => {
      console.log(data);
    });
  }

  prepareUserInfo() {
    this.graphqlService.getGraphQL(this.queries.whoAmI, true)
    .then((userInfo) => {
      const userDetails: any = _.get(userInfo, "people.actions.getMyProfile.views", null);
      this.sharingDataService.notifyNewLoggedInUserSubscribers(userDetails); 
    })
    .catch((exGql) => {
      this.generalService.showErrorMessage("Error Getting Current User Info");
    }).finally(() => {
    });
  }
}
