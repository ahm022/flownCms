import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

// Apollo
import { APOLLO_OPTIONS } from "apollo-angular";
import { HttpLinkModule } from "apollo-angular-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import { AuthenticationService } from "../services/authentication.service";
import { ApolloLink, FetchResult, NextLink, Observable, Operation, RequestHandler } from "apollo-link";

import { environment } from "../../environments/environment";

/***
 * Create an authorization Request handler
 * which should refresh the token
 * before proceeding with a graphQL call
 */
function AuthenticationRequestHandler($authenticationService: AuthenticationService): RequestHandler {
  return (operation: Operation, forward: NextLink) => {
    return new Observable<FetchResult>((subscriber) => {
      // Not logged-in? Nothing to do
      if (!$authenticationService.isLoggedIn) {
        forward(operation).subscribe(subscriber);
      }
      // Logged-in, Token not expired
      else if (!$authenticationService.isTokenExpired()) {
        operation.setContext(({ headers }) => ({
          headers: {
            authorization: `Bearer ${$authenticationService.getAccessToken()}`,
            ...headers,
          },
        }));
        forward(operation).subscribe(subscriber);
      }
      // Logged-in, Token Expired
      else {
        $authenticationService
          .refreshToken()
          .then((refreshedAccessToken) => {
            operation.setContext(({ headers }) => ({
              headers: {
                authorization: `Bearer ${$authenticationService.accessToken}`,
                ...headers,
              },
            }));
          })
          .finally(() => {
            return forward(operation).subscribe(subscriber);
          });
      }
    });
  };
}

export function provideApollo($authenticationService: AuthenticationService) {
  const defaultOptions = {
    watchQuery: {
      fetchPolicy: "no-cache",
      errorPolicy: "ignore",
    },
    query: {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    },
  };

  const authLink = new ApolloLink(AuthenticationRequestHandler($authenticationService));

  let linkOptions = { uri: environment.ApiUrlsForBrowser.graphql_url, withCredentials: false };

  return {
    link: ApolloLink.from([authLink, createUploadLink(linkOptions)]),
    cache: new InMemoryCache(),
    defaultOptions: defaultOptions,
  };
}


@NgModule({
  exports: [HttpClientModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: provideApollo,
      deps: [AuthenticationService],
    },
  ]
})
export class GraphqlModule { }
