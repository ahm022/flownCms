import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import jwt_decode from "jwt-decode";
import * as MsalForBrowser from "@azure/msal-browser";
import { StorageService } from "./storage.service";
// import { SharingDataService } from "./sharing-data.service";
// import { ParametersStorageService } from "src/app/dynamic-ui-service/parametersStorage.service";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  isLoggedIn: boolean = false;
  accessToken: string;
  refereshTokenInterval: any;
  accounts: any[] = [];
  msalForBrowser: MsalForBrowser.PublicClientApplication;
  handleRedirectPromise = null;
  refreshTokenPromise: Promise<boolean> | null = null;
  canManageDiaspora: false;

  constructor(
    private storageService: StorageService,
    // private sharingDataService: SharingDataService
  ) {
    // If we're on the browser

    this.msalForBrowser = new MsalForBrowser.PublicClientApplication(environment.MsalOptionsForBrowser);
    this.handleRedirectPromise = this.msalForBrowser
      .handleRedirectPromise()
      .then((tokenResponse) => {
        this.startRefreshTokenTimer();
        // redirected back
        console.log('tokenResponse', tokenResponse);
        if (tokenResponse) {
          this.accounts = [tokenResponse.account.localAccountId];
          this.changeLoginState(tokenResponse.accessToken || tokenResponse.idToken);
          // this.sharingDataService.notifyUserInformationSubscribers(true);
        }
      })
      .catch((error) => {
        // handle error, either in the library or coming back from the server
        console.error("Error in MSAL Broswer handling redirect", error);
      });
  }

  getAccessToken() {
    return this.accessToken;
  }

  checkIfLogin(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.handleRedirectPromise.finally(() => {
        return (this.refreshTokenPromise = this.getAccessTokenForBrowser().finally(() => {
          this.refreshTokenPromise = null;
          resolve(this.accessToken ? true : false);
        })).catch(reject);
      });
    });
  }

  // Try to get the token silently
  getAccessTokenForBrowser(forceRefresh: boolean = false) {
    this.accounts = this.msalForBrowser.getAllAccounts().map((x) => x.localAccountId);
    let silentRequest: MsalForBrowser.SilentRequest = {
      account: this.accounts && this.accounts.length > 0 ? this.accounts[0] : undefined,
      scopes: environment.MsalOptionsForBrowser.scopes,
      forceRefresh: forceRefresh,
    };
    return this.msalForBrowser
      .acquireTokenSilent(silentRequest)
      .then((silentResult) => {
        if (silentResult) {
          this.changeLoginState(silentResult.accessToken || silentResult.idToken);
          return true;
        } else {
          return false;
        }
      })
      .catch((error) => {
        if (!environment.production) {
          // console.error("Error in ssoSilent", error);
        }
        return false;
      });
  }

  login() {
    this.msalForBrowser.loginRedirect({ scopes: environment.MsalOptionsForBrowser.scopes });
  }

  logout() {
    this.changeLogoutState();
    this.msalForBrowser.logout();
  }

  changeLoginState(accessToken: string) {
    this.isLoggedIn = true;
    this.accessToken = accessToken;
  }

  changeLogoutState() {
    this.isLoggedIn = false;
    this.accessToken = null;
    this.storageService.clearUserInformation();
  }

  refreshToken(): Promise<boolean> {
    // If we're already refreshing, hold your horses
    if (this.refreshTokenPromise != null) return this.refreshTokenPromise;

    if (this.isLoggedIn) {
      return (this.refreshTokenPromise = this.getAccessTokenForBrowser().finally(() => {
        this.refreshTokenPromise = null;
        return this.accessToken ? true : false;
      }));
    } else return Promise.resolve(false);
  }

  isTokenExpired(): boolean {
    if (!this.accessToken) return true;
    const decodedToken: any = jwt_decode(this.accessToken);
    var expiry = decodedToken.exp * 1000;
    var now = new Date().getTime();
    return now > expiry;
  }

  startRefreshTokenTimer() {
    this.refereshTokenInterval = setInterval(() => {
      this.refreshToken();
    }, 1000 * 60 * 15);
  }
  // 1000 * 60 *60 * 24

  stopRefreshTokenTimer() {
    clearInterval(this.refereshTokenInterval);
  }
}
