import { ICrypto, PkceCodes, SignedHttpRequest } from "@azure/msal-common";
export declare type CachedKeyPair = {
    publicKey: CryptoKey;
    privateKey: CryptoKey;
    requestMethod: string;
    requestUri: string;
};
/**
 * This class implements MSAL's crypto interface, which allows it to perform base64 encoding and decoding, generating cryptographically random GUIDs and
 * implementing Proof Key for Code Exchange specs for the OAuth Authorization Code Flow using PKCE (rfc here: https://tools.ietf.org/html/rfc7636).
 */
export declare class CryptoOps implements ICrypto {
    private browserCrypto;
    private guidGenerator;
    private b64Encode;
    private b64Decode;
    private pkceGenerator;
    private static POP_KEY_USAGES;
    private static EXTRACTABLE;
    private static DB_VERSION;
    private static DB_NAME;
    private static TABLE_NAME;
    private cache;
    constructor();
    /**
     * Creates a new random GUID - used to populate state and nonce.
     * @returns string (GUID)
     */
    createNewGuid(): string;
    /**
     * Encodes input string to base64.
     * @param input
     */
    base64Encode(input: string): string;
    /**
     * Decodes input string from base64.
     * @param input
     */
    base64Decode(input: string): string;
    /**
     * Generates PKCE codes used in Authorization Code Flow.
     */
    generatePkceCodes(): Promise<PkceCodes>;
    /**
     * Generates a keypair, stores it and returns a thumbprint
     * @param resourceRequestMethod
     * @param resourceRequestUri
     */
    getPublicKeyThumbprint(resourceRequestMethod: string, resourceRequestUri: string): Promise<string>;
    /**
     * Signs the given object as a jwt payload with private key retrieved by given kid.
     * @param payload
     * @param kid
     */
    signJwt(payload: SignedHttpRequest, kid: string): Promise<string>;
}
