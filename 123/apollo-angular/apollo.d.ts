import { NgZone } from '@angular/core';
import type { QueryOptions, ApolloQueryResult, SubscriptionOptions, ApolloClientOptions, FetchResult } from '@apollo/client/core';
import { ApolloClient } from '@apollo/client/core';
import { Observable } from 'rxjs';
import { QueryRef } from './query-ref';
import { WatchQueryOptions, ExtraSubscriptionOptions, EmptyObject, NamedOptions, Flags, MutationResult, MutationOptions } from './types';
import * as i0 from "@angular/core";
export declare class ApolloBase<TCacheShape = any> {
    protected ngZone: NgZone;
    protected flags?: Flags;
    protected _client?: ApolloClient<TCacheShape>;
    private useInitialLoading;
    private useMutationLoading;
    constructor(ngZone: NgZone, flags?: Flags, _client?: ApolloClient<TCacheShape>);
    watchQuery<TData, TVariables = EmptyObject>(options: WatchQueryOptions<TVariables, TData>): QueryRef<TData, TVariables>;
    query<T, V = EmptyObject>(options: QueryOptions<V, T>): Observable<ApolloQueryResult<T>>;
    mutate<T, V = EmptyObject>(options: MutationOptions<T, V>): Observable<MutationResult<T>>;
    subscribe<T, V = EmptyObject>(options: SubscriptionOptions<V, T>, extra?: ExtraSubscriptionOptions): Observable<FetchResult<T>>;
    /**
     * Get an access to an instance of ApolloClient
     * @deprecated use `apollo.client` instead
     */
    getClient(): ApolloClient<TCacheShape>;
    /**
     * Set a new instance of ApolloClient
     * Remember to clean up the store before setting a new client.
     * @deprecated use `apollo.client = client` instead
     *
     * @param client ApolloClient instance
     */
    setClient(client: ApolloClient<TCacheShape>): void;
    /**
     * Get an access to an instance of ApolloClient
     */
    get client(): ApolloClient<TCacheShape>;
    /**
     * Set a new instance of ApolloClient
     * Remember to clean up the store before setting a new client.
     *
     * @param client ApolloClient instance
     */
    set client(client: ApolloClient<TCacheShape>);
    private ensureClient;
    private checkInstance;
}
export declare class Apollo extends ApolloBase<any> {
    private _ngZone;
    private map;
    constructor(_ngZone: NgZone, apolloOptions?: ApolloClientOptions<any>, apolloNamedOptions?: NamedOptions, flags?: Flags);
    /**
     * Create an instance of ApolloClient
     * @param options Options required to create ApolloClient
     * @param name client's name
     */
    create<TCacheShape>(options: ApolloClientOptions<TCacheShape>, name?: string): void;
    /**
     * Use a default ApolloClient
     */
    default(): ApolloBase<any>;
    /**
     * Use a named ApolloClient
     * @param name client's name
     */
    use(name: string): ApolloBase<any>;
    /**
     * Create a default ApolloClient, same as `apollo.create(options)`
     * @param options ApolloClient's options
     */
    createDefault<TCacheShape>(options: ApolloClientOptions<TCacheShape>): void;
    /**
     * Create a named ApolloClient, same as `apollo.create(options, name)`
     * @param name client's name
     * @param options ApolloClient's options
     */
    createNamed<TCacheShape>(name: string, options: ApolloClientOptions<TCacheShape>): void;
    /**
     * Remember to clean up the store before removing a client
     * @param name client's name
     */
    removeClient(name?: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<Apollo, [null, { optional: true; }, { optional: true; }, { optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<Apollo>;
}
