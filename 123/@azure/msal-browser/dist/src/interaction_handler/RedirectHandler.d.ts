import { AuthorizationCodeClient, AuthorizationCodeRequest, ICrypto, AuthenticationResult, Authority, INetworkModule } from "@azure/msal-common";
import { BrowserCacheManager } from "../cache/BrowserCacheManager";
import { InteractionHandler, InteractionParams } from "./InteractionHandler";
export declare type RedirectParams = InteractionParams & {
    redirectTimeout: number;
    redirectStartPage: string;
    onRedirectNavigate?: (url: string) => void | boolean;
};
export declare class RedirectHandler extends InteractionHandler {
    private browserCrypto;
    constructor(authCodeModule: AuthorizationCodeClient, storageImpl: BrowserCacheManager, authCodeRequest: AuthorizationCodeRequest, browserCrypto: ICrypto);
    /**
     * Redirects window to given URL.
     * @param urlNavigate
     */
    initiateAuthRequest(requestUrl: string, params: RedirectParams): Promise<void>;
    /**
     * Handle authorization code response in the window.
     * @param hash
     */
    handleCodeResponse(locationHash: string, state: string, authority: Authority, networkModule: INetworkModule, clientId?: string): Promise<AuthenticationResult>;
}
