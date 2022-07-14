import * as i1 from 'apollo-angular';
import { ApolloModule } from 'apollo-angular';
import * as i3 from '@apollo/client/core';
import { ApolloError, Observable, ApolloLink, InMemoryCache } from '@apollo/client/core';
import * as i0 from '@angular/core';
import { Injectable, InjectionToken, NgModule, Optional, Inject } from '@angular/core';
import { print } from 'graphql';

/**
 * Controller to be injected into tests, that allows for mocking and flushing
 * of operations.
 *
 *
 */
class ApolloTestingController {
}

const isApolloError = (err) => err && err.hasOwnProperty('graphQLErrors');
class TestOperation {
    constructor(operation, observer) {
        this.operation = operation;
        this.observer = observer;
    }
    flush(result) {
        if (isApolloError(result)) {
            this.observer.error(result);
        }
        else {
            const fetchResult = result ? Object.assign({}, result) : result;
            this.observer.next(fetchResult);
            this.observer.complete();
        }
    }
    flushData(data) {
        this.flush({
            data,
        });
    }
    networkError(error) {
        const apolloError = new ApolloError({
            networkError: error,
        });
        this.flush(apolloError);
    }
    graphqlErrors(errors) {
        this.flush({
            errors,
        });
    }
}

/**
 * A testing backend for `Apollo`.
 *
 * `ApolloTestingBackend` works by keeping a list of all open operations.
 * As operations come in, they're added to the list. Users can assert that specific
 * operations were made and then flush them. In the end, a verify() method asserts
 * that no unexpected operations were made.
 */
class ApolloTestingBackend {
    constructor() {
        /**
         * List of pending operations which have not yet been expected.
         */
        this.open = [];
    }
    /**
     * Handle an incoming operation by queueing it in the list of open operations.
     */
    handle(op) {
        return new Observable((observer) => {
            const testOp = new TestOperation(op, observer);
            this.open.push(testOp);
        });
    }
    /**
     * Helper function to search for operations in the list of open operations.
     */
    _match(match) {
        if (typeof match === 'string') {
            return this.open.filter((testOp) => testOp.operation.operationName === match);
        }
        else if (typeof match === 'function') {
            return this.open.filter((testOp) => match(testOp.operation));
        }
        else {
            if (this.isDocumentNode(match)) {
                return this.open.filter((testOp) => print(testOp.operation.query) === print(match));
            }
            return this.open.filter((testOp) => this.matchOp(match, testOp));
        }
    }
    matchOp(match, testOp) {
        const variables = JSON.stringify(match.variables);
        const extensions = JSON.stringify(match.extensions);
        const sameName = this.compare(match.operationName, testOp.operation.operationName);
        const sameVariables = this.compare(variables, testOp.operation.variables);
        const sameQuery = print(testOp.operation.query) === print(match.query);
        const sameExtensions = this.compare(extensions, testOp.operation.extensions);
        return sameName && sameVariables && sameQuery && sameExtensions;
    }
    compare(expected, value) {
        const prepare = (val) => typeof val === 'string' ? val : JSON.stringify(val);
        const received = prepare(value);
        return !expected || received === expected;
    }
    /**
     * Search for operations in the list of open operations, and return all that match
     * without asserting anything about the number of matches.
     */
    match(match) {
        const results = this._match(match);
        results.forEach((result) => {
            const index = this.open.indexOf(result);
            if (index !== -1) {
                this.open.splice(index, 1);
            }
        });
        return results;
    }
    /**
     * Expect that a single outstanding request matches the given matcher, and return
     * it.
     *
     * operations returned through this API will no longer be in the list of open operations,
     * and thus will not match twice.
     */
    expectOne(match, description) {
        description = description || this.descriptionFromMatcher(match);
        const matches = this.match(match);
        if (matches.length > 1) {
            throw new Error(`Expected one matching operation for criteria "${description}", found ${matches.length} operations.`);
        }
        if (matches.length === 0) {
            throw new Error(`Expected one matching operation for criteria "${description}", found none.`);
        }
        return matches[0];
    }
    /**
     * Expect that no outstanding operations match the given matcher, and throw an error
     * if any do.
     */
    expectNone(match, description) {
        description = description || this.descriptionFromMatcher(match);
        const matches = this.match(match);
        if (matches.length > 0) {
            throw new Error(`Expected zero matching operations for criteria "${description}", found ${matches.length}.`);
        }
    }
    /**
     * Validate that there are no outstanding operations.
     */
    verify() {
        const open = this.open;
        if (open.length > 0) {
            // Show the methods and URLs of open operations in the error, for convenience.
            const operations = open
                .map((testOp) => testOp.operation.operationName)
                .join(', ');
            throw new Error(`Expected no open operations, found ${open.length}: ${operations}`);
        }
    }
    isDocumentNode(docOrOp) {
        return !docOrOp.operationName;
    }
    descriptionFromMatcher(matcher) {
        if (typeof matcher === 'string') {
            return `Match operationName: ${matcher}`;
        }
        else if (typeof matcher === 'object') {
            if (this.isDocumentNode(matcher)) {
                return `Match DocumentNode`;
            }
            const name = matcher.operationName || '(any)';
            const variables = JSON.stringify(matcher.variables) || '(any)';
            return `Match operation: ${name}, variables: ${variables}`;
        }
        else {
            return `Match by function: ${matcher.name}`;
        }
    }
}
ApolloTestingBackend.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: ApolloTestingBackend, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
ApolloTestingBackend.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: ApolloTestingBackend });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: ApolloTestingBackend, decorators: [{
            type: Injectable
        }] });

const APOLLO_TESTING_CACHE = new InjectionToken('apollo-angular/testing cache');
const APOLLO_TESTING_NAMED_CACHE = new InjectionToken('apollo-angular/testing named cache');
const APOLLO_TESTING_CLIENTS = new InjectionToken('apollo-angular/testing named clients');
function addClient(name, op) {
    op.clientName = name;
    return op;
}
class ApolloTestingModuleCore {
    constructor(apollo, backend, namedClients, cache, namedCaches) {
        function createOptions(name, c) {
            return {
                link: new ApolloLink((operation) => backend.handle(addClient(name, operation))),
                cache: c ||
                    new InMemoryCache({
                        addTypename: false,
                    }),
            };
        }
        apollo.create(createOptions('default', cache));
        if (namedClients && namedClients.length) {
            namedClients.forEach((name) => {
                const caches = namedCaches && typeof namedCaches === 'object' ? namedCaches : {};
                apollo.createNamed(name, createOptions(name, caches[name]));
            });
        }
    }
}
ApolloTestingModuleCore.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: ApolloTestingModuleCore, deps: [{ token: i1.Apollo }, { token: ApolloTestingBackend }, { token: APOLLO_TESTING_CLIENTS, optional: true }, { token: APOLLO_TESTING_CACHE, optional: true }, { token: APOLLO_TESTING_NAMED_CACHE, optional: true }], target: i0.ɵɵFactoryTarget.NgModule });
ApolloTestingModuleCore.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: ApolloTestingModuleCore, imports: [ApolloModule] });
ApolloTestingModuleCore.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: ApolloTestingModuleCore, providers: [
        ApolloTestingBackend,
        { provide: ApolloTestingController, useExisting: ApolloTestingBackend },
    ], imports: [[ApolloModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: ApolloTestingModuleCore, decorators: [{
            type: NgModule,
            args: [{
                    imports: [ApolloModule],
                    providers: [
                        ApolloTestingBackend,
                        { provide: ApolloTestingController, useExisting: ApolloTestingBackend },
                    ],
                }]
        }], ctorParameters: function () {
        return [{ type: i1.Apollo }, { type: ApolloTestingBackend }, { type: undefined, decorators: [{
                        type: Optional
                    }, {
                        type: Inject,
                        args: [APOLLO_TESTING_CLIENTS]
                    }] }, { type: i3.ApolloCache, decorators: [{
                        type: Optional
                    }, {
                        type: Inject,
                        args: [APOLLO_TESTING_CACHE]
                    }] }, { type: undefined, decorators: [{
                        type: Optional
                    }, {
                        type: Inject,
                        args: [APOLLO_TESTING_NAMED_CACHE]
                    }] }];
    } });
class ApolloTestingModule {
    static withClients(names) {
        return {
            ngModule: ApolloTestingModuleCore,
            providers: [
                {
                    provide: APOLLO_TESTING_CLIENTS,
                    useValue: names,
                },
            ],
        };
    }
}
ApolloTestingModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: ApolloTestingModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ApolloTestingModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: ApolloTestingModule, imports: [ApolloTestingModuleCore] });
ApolloTestingModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: ApolloTestingModule, imports: [[ApolloTestingModuleCore]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: ApolloTestingModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [ApolloTestingModuleCore],
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { APOLLO_TESTING_CACHE, APOLLO_TESTING_NAMED_CACHE, ApolloTestingController, ApolloTestingModule, TestOperation };
//# sourceMappingURL=ngApolloTesting.mjs.map
