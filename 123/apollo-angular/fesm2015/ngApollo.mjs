import * as i0 from '@angular/core';
import { InjectionToken, Injectable, Optional, Inject, NgModule } from '@angular/core';
import { NetworkStatus, ApolloClient, gql as gql$1 } from '@apollo/client/core';
import { Observable, queueScheduler, observable, from } from 'rxjs';
import { map, startWith, observeOn } from 'rxjs/operators';

function fromPromise(promiseFn) {
    return new Observable((subscriber) => {
        promiseFn().then((result) => {
            if (!subscriber.closed) {
                subscriber.next(result);
                subscriber.complete();
            }
        }, (error) => {
            if (!subscriber.closed) {
                subscriber.error(error);
            }
        });
        return () => subscriber.unsubscribe();
    });
}
function useMutationLoading(source, enabled) {
    if (!enabled) {
        return source.pipe(map((result) => (Object.assign(Object.assign({}, result), { loading: false }))));
    }
    return source.pipe(startWith({
        loading: true,
    }), map((result) => (Object.assign(Object.assign({}, result), { loading: !!result.loading }))));
}
class ZoneScheduler {
    constructor(zone) {
        this.zone = zone;
        this.now = Date.now ? Date.now : () => +new Date();
    }
    schedule(work, delay = 0, state) {
        return this.zone.run(() => queueScheduler.schedule(work, delay, state));
    }
}
function fixObservable(obs) {
    obs[observable] = () => obs;
    return obs;
}
function wrapWithZone(obs, ngZone) {
    return obs.pipe(observeOn(new ZoneScheduler(ngZone)));
}
function pickFlag(flags, flag, defaultValue) {
    return flags && typeof flags[flag] !== 'undefined'
        ? flags[flag]
        : defaultValue;
}

function useInitialLoading(obsQuery) {
    return function useInitialLoadingOperator(source) {
        return new Observable(function useInitialLoadingSubscription(subscriber) {
            const currentResult = obsQuery.getCurrentResult();
            const { loading, errors, error, partial, data } = currentResult;
            const { partialRefetch, fetchPolicy } = obsQuery.options;
            const hasError = errors || error;
            if (partialRefetch &&
                partial &&
                (!data || Object.keys(data).length === 0) &&
                fetchPolicy !== 'cache-only' &&
                !loading &&
                !hasError) {
                subscriber.next(Object.assign(Object.assign({}, currentResult), { loading: true, networkStatus: NetworkStatus.loading }));
            }
            return source.subscribe(subscriber);
        });
    };
}
class QueryRef {
    constructor(obsQuery, ngZone, options) {
        this.obsQuery = obsQuery;
        const wrapped = wrapWithZone(from(fixObservable(this.obsQuery)), ngZone);
        this.valueChanges = options.useInitialLoading
            ? wrapped.pipe(useInitialLoading(this.obsQuery))
            : wrapped;
        this.queryId = this.obsQuery.queryId;
    }
    // ObservableQuery's methods
    get options() {
        return this.obsQuery.options;
    }
    get variables() {
        return this.obsQuery.variables;
    }
    result() {
        return this.obsQuery.result();
    }
    getCurrentResult() {
        return this.obsQuery.getCurrentResult();
    }
    getLastResult() {
        return this.obsQuery.getLastResult();
    }
    getLastError() {
        return this.obsQuery.getLastError();
    }
    resetLastResults() {
        return this.obsQuery.resetLastResults();
    }
    refetch(variables) {
        return this.obsQuery.refetch(variables);
    }
    fetchMore(fetchMoreOptions) {
        return this.obsQuery.fetchMore(fetchMoreOptions);
    }
    subscribeToMore(options) {
        // XXX: there's a bug in apollo-client typings
        // it should not inherit types from ObservableQuery
        return this.obsQuery.subscribeToMore(options);
    }
    updateQuery(mapFn) {
        return this.obsQuery.updateQuery(mapFn);
    }
    stopPolling() {
        return this.obsQuery.stopPolling();
    }
    startPolling(pollInterval) {
        return this.obsQuery.startPolling(pollInterval);
    }
    setOptions(opts) {
        return this.obsQuery.setOptions(opts);
    }
    setVariables(variables) {
        return this.obsQuery.setVariables(variables);
    }
}

const APOLLO_FLAGS = new InjectionToken('APOLLO_FLAGS');
const APOLLO_OPTIONS = new InjectionToken('APOLLO_OPTIONS');
const APOLLO_NAMED_OPTIONS = new InjectionToken('APOLLO_NAMED_OPTIONS');

class ApolloBase {
    constructor(ngZone, flags, _client) {
        this.ngZone = ngZone;
        this.flags = flags;
        this._client = _client;
        this.useInitialLoading = pickFlag(flags, 'useInitialLoading', false);
        this.useMutationLoading = pickFlag(flags, 'useMutationLoading', false);
    }
    watchQuery(options) {
        return new QueryRef(this.ensureClient().watchQuery(Object.assign({}, options)), this.ngZone, Object.assign({ useInitialLoading: this.useInitialLoading }, options));
    }
    query(options) {
        return fromPromise(() => this.ensureClient().query(Object.assign({}, options)));
    }
    mutate(options) {
        var _a;
        return useMutationLoading(fromPromise(() => this.ensureClient().mutate(Object.assign({}, options))), (_a = options.useMutationLoading) !== null && _a !== void 0 ? _a : this.useMutationLoading);
    }
    subscribe(options, extra) {
        const obs = from(fixObservable(this.ensureClient().subscribe(Object.assign({}, options))));
        return extra && extra.useZone !== true
            ? obs
            : wrapWithZone(obs, this.ngZone);
    }
    /**
     * Get an access to an instance of ApolloClient
     * @deprecated use `apollo.client` instead
     */
    getClient() {
        return this.client;
    }
    /**
     * Set a new instance of ApolloClient
     * Remember to clean up the store before setting a new client.
     * @deprecated use `apollo.client = client` instead
     *
     * @param client ApolloClient instance
     */
    setClient(client) {
        this.client = client;
    }
    /**
     * Get an access to an instance of ApolloClient
     */
    get client() {
        return this._client;
    }
    /**
     * Set a new instance of ApolloClient
     * Remember to clean up the store before setting a new client.
     *
     * @param client ApolloClient instance
     */
    set client(client) {
        if (this._client) {
            throw new Error('Client has been already defined');
        }
        this._client = client;
    }
    ensureClient() {
        this.checkInstance();
        return this._client;
    }
    checkInstance() {
        if (!this._client) {
            throw new Error('Client has not been defined yet');
        }
    }
}
class Apollo extends ApolloBase {
    constructor(_ngZone, apolloOptions, apolloNamedOptions, flags) {
        super(_ngZone, flags);
        this._ngZone = _ngZone;
        this.map = new Map();
        if (apolloOptions) {
            this.createDefault(apolloOptions);
        }
        if (apolloNamedOptions && typeof apolloNamedOptions === 'object') {
            for (let name in apolloNamedOptions) {
                if (apolloNamedOptions.hasOwnProperty(name)) {
                    const options = apolloNamedOptions[name];
                    this.createNamed(name, options);
                }
            }
        }
    }
    /**
     * Create an instance of ApolloClient
     * @param options Options required to create ApolloClient
     * @param name client's name
     */
    create(options, name) {
        if (isDefault(name)) {
            this.createDefault(options);
        }
        else {
            this.createNamed(name, options);
        }
    }
    /**
     * Use a default ApolloClient
     */
    default() {
        return this;
    }
    /**
     * Use a named ApolloClient
     * @param name client's name
     */
    use(name) {
        if (isDefault(name)) {
            return this.default();
        }
        return this.map.get(name);
    }
    /**
     * Create a default ApolloClient, same as `apollo.create(options)`
     * @param options ApolloClient's options
     */
    createDefault(options) {
        if (this.getClient()) {
            throw new Error('Apollo has been already created.');
        }
        return this.setClient(new ApolloClient(options));
    }
    /**
     * Create a named ApolloClient, same as `apollo.create(options, name)`
     * @param name client's name
     * @param options ApolloClient's options
     */
    createNamed(name, options) {
        if (this.map.has(name)) {
            throw new Error(`Client ${name} has been already created`);
        }
        this.map.set(name, new ApolloBase(this._ngZone, this.flags, new ApolloClient(options)));
    }
    /**
     * Remember to clean up the store before removing a client
     * @param name client's name
     */
    removeClient(name) {
        if (isDefault(name)) {
            this._client = undefined;
        }
        else {
            this.map.delete(name);
        }
    }
}
Apollo.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: Apollo, deps: [{ token: i0.NgZone }, { token: APOLLO_OPTIONS, optional: true }, { token: APOLLO_NAMED_OPTIONS, optional: true }, { token: APOLLO_FLAGS, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
Apollo.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: Apollo });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: Apollo, decorators: [{
            type: Injectable
        }], ctorParameters: function () {
        return [{ type: i0.NgZone }, { type: undefined, decorators: [{
                        type: Optional
                    }, {
                        type: Inject,
                        args: [APOLLO_OPTIONS]
                    }] }, { type: undefined, decorators: [{
                        type: Optional
                    }, {
                        type: Inject,
                        args: [APOLLO_NAMED_OPTIONS]
                    }] }, { type: undefined, decorators: [{
                        type: Optional
                    }, {
                        type: Inject,
                        args: [APOLLO_FLAGS]
                    }] }];
    } });
function isDefault(name) {
    return !name || name === 'default';
}

const PROVIDERS = [Apollo];
class ApolloModule {
}
ApolloModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: ApolloModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ApolloModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: ApolloModule });
ApolloModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: ApolloModule, providers: PROVIDERS });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: ApolloModule, decorators: [{
            type: NgModule,
            args: [{
                    providers: PROVIDERS,
                }]
        }] });

class Query {
    constructor(apollo) {
        this.apollo = apollo;
        this.client = 'default';
    }
    watch(variables, options) {
        return this.apollo.use(this.client).watchQuery(Object.assign(Object.assign({}, options), { variables, query: this.document }));
    }
    fetch(variables, options) {
        return this.apollo.use(this.client).query(Object.assign(Object.assign({}, options), { variables, query: this.document }));
    }
}
Query.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: Query, deps: [{ token: Apollo }], target: i0.ɵɵFactoryTarget.Injectable });
Query.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: Query });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: Query, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: Apollo }]; } });

class Mutation {
    constructor(apollo) {
        this.apollo = apollo;
        this.client = 'default';
    }
    mutate(variables, options) {
        return this.apollo.use(this.client).mutate(Object.assign(Object.assign({}, options), { variables, mutation: this.document }));
    }
}
Mutation.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: Mutation, deps: [{ token: Apollo }], target: i0.ɵɵFactoryTarget.Injectable });
Mutation.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: Mutation });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: Mutation, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: Apollo }]; } });

class Subscription {
    constructor(apollo) {
        this.apollo = apollo;
        this.client = 'default';
    }
    subscribe(variables, options, extra) {
        return this.apollo.use(this.client).subscribe(Object.assign(Object.assign({}, options), { variables, query: this.document }), extra);
    }
}
Subscription.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: Subscription, deps: [{ token: Apollo }], target: i0.ɵɵFactoryTarget.Injectable });
Subscription.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: Subscription });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: Subscription, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: Apollo }]; } });

function typedGQLTag(literals, ...placeholders) {
    return gql$1(literals, ...placeholders);
}
const gql = typedGQLTag;
const graphql = typedGQLTag;

/**
 * Generated bundle index. Do not edit.
 */

export { APOLLO_FLAGS, APOLLO_NAMED_OPTIONS, APOLLO_OPTIONS, Apollo, ApolloBase, ApolloModule, Mutation, Query, QueryRef, Subscription, gql, graphql };
//# sourceMappingURL=ngApollo.mjs.map
