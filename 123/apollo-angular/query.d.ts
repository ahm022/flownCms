import type { DocumentNode } from 'graphql';
import type { ApolloQueryResult, TypedDocumentNode } from '@apollo/client/core';
import type { Observable } from 'rxjs';
import { Apollo } from './apollo';
import { QueryRef } from './query-ref';
import { WatchQueryOptionsAlone, QueryOptionsAlone, EmptyObject } from './types';
import * as i0 from "@angular/core";
export declare class Query<T = {}, V = EmptyObject> {
    protected apollo: Apollo;
    readonly document: DocumentNode | TypedDocumentNode<T, V>;
    client: string;
    constructor(apollo: Apollo);
    watch(variables?: V, options?: WatchQueryOptionsAlone<V, T>): QueryRef<T, V>;
    fetch(variables?: V, options?: QueryOptionsAlone<V, T>): Observable<ApolloQueryResult<T>>;
    static ɵfac: i0.ɵɵFactoryDeclaration<Query<any, any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<Query<any, any>>;
}
