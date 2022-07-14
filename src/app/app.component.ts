import { GraphqlService } from './services/graphql.service';
import { QueriesService } from './services/queries.service';
import { Component } from '@angular/core';
import { Apollo, gql, Query } from 'apollo-angular';
import { InMemoryCache } from '@apollo/client/core';
import { AuthenticationService } from "./services/authentication.service";
import { HttpLink } from 'apollo-angular/http';
import { Observable, map } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  categories :  Observable<any>;
  constructor(
    private apollo: Apollo,
    private httpLink: HttpLink,
    private queries: QueriesService,
    private graphqlService: GraphqlService,
    private authenticationService: AuthenticationService,
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

  // prepareUserInfo() {
  //   this.graphqlService.getGraphQL(Queries.checkUserPermission, false).then((permissionsData: any) => {
  //     const userPermissions = _.get(permissionsData, "backOffice.actions", null);
  //     this.authenticationService.canManageDiaspora = userPermissions.canManageDiaspora;
  //     this.graphqlService
  //     .getGraphQL(Queries.whoAmI, true)
  //     .then((userInfo) => {
  //       const userDetails: any = _.get(userInfo, "people.actions.getMyProfile.views", null);
  //       this.storageService.saveUserInformation(userDetails, userPermissions);
  //       this.sharingDataService.notifyNewLoggedInUserSubscribers(userDetails);

  //       if (userPermissions.canManageDiaspora) {
  //         this._fuseNavigationService.setCurrentNavigation("main");
  //       } else {
  //         this._fuseSplashScreenService.hide();
  //         this.generalService.showErrorMessage("User not Authorized to access BackOffice. Are you admin?");
  //       }
  //     })
  //     .catch((exGql) => {
  //       this.generalService.showErrorMessage("Error Getting Current User Info");
  //     }).finally(() => {
  //       this._fuseSplashScreenService.hide();
  //     });
  //   });
  // }
}
