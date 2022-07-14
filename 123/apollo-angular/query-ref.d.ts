import { NgZone } from '@angular/core';
import type { ApolloQueryResult, ObservableQuery, ApolloError, FetchMoreQueryOptions, FetchMoreOptions, SubscribeToMoreOptions, UpdateQueryOptions, TypedDocumentNode } from '@apollo/client/core';
import { Observable } from 'rxjs';
import { WatchQueryOptions, EmptyObject } from './types';
export declare type QueryRefFromDocument<T extends TypedDocumentNode> = T extends TypedDocumentNode<infer R, infer V> ? QueryRef<R, V> : never;
export declare class QueryRef<T, V = EmptyObject> {
    private obsQuery;
    valueChanges: Observable<ApolloQueryResult<T>>;
    queryId: ObservableQuery<T, V>['queryId'];
    constructor(obsQuery: ObservableQuery<T, V>, ngZone: NgZone, options: WatchQueryOptions<V, T>);
    get options(): import("@apollo/client/core").WatchQueryOptions<V, T>;
    get variables(): V;
    result(): Promise<ApolloQueryResult<T>>;
    getCurrentResult(): ApolloQueryResult<T>;
    getLastResult(): ApolloQueryResult<T>;
    getLastError(): ApolloError;
    resetLastResults(): void;
    refetch(variables?: V): Promise<ApolloQueryResult<T>>;
    fetchMore<K extends keyof V>(fetchMoreOptions: FetchMoreQueryOptions<V, K> & FetchMoreOptions<T, V>): Promise<ApolloQueryResult<T>>;
    subscribeToMore<MT = any, MV = EmptyObject>(options: SubscribeToMoreOptions<T, MV, MT>): () => void;
    updateQuery(mapFn: (previousQueryResult: T, options: UpdateQueryOptions<V>) => T): void;
    stopPolling(): void;
    startPolling(pollInterval: number): void;
    setOptions(opts: any): Promise<ApolloQueryResult<T>>;
    setVariables(variables: V): Promise<void | ApolloQueryResult<T>>;
}
