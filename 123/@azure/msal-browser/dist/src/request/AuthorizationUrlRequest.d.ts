import { AuthorizationUrlRequest as CommonAuthorizationUrlRequest } from "@azure/msal-common";
export declare type AuthorizationUrlRequest = Omit<CommonAuthorizationUrlRequest, "state" | "nonce"> & {
    state: string;
    nonce: string;
};
