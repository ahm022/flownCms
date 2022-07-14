/**
 * Utility class which exposes functions for managing date and time operations.
 */
export declare class TimeUtils {
    /**
     * return the current time in Unix time (seconds).
     */
    static nowSeconds(): number;
    /**
     * check if a token is expired based on given UTC time in seconds.
     * @param expiresOn
     */
    static isTokenExpired(expiresOn: string, offset: number): boolean;
}
