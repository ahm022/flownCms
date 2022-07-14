import * as i0 from '@angular/core';
import { Injectable } from '@angular/core';
import { ApolloLink, Observable as Observable$1 } from '@apollo/client/core';
import { print } from 'graphql';
import * as i1 from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BatchLink } from '@apollo/client/link/batch';

const fetch = (req, httpClient, extractFiles) => {
    const shouldUseBody = ['POST', 'PUT', 'PATCH'].indexOf(req.method.toUpperCase()) !== -1;
    const shouldStringify = (param) => ['variables', 'extensions'].indexOf(param.toLowerCase()) !== -1;
    const isBatching = req.body.length;
    let shouldUseMultipart = req.options && req.options.useMultipart;
    let multipartInfo;
    if (shouldUseMultipart) {
        if (isBatching) {
            return new Observable((observer) => observer.error(new Error('File upload is not available when combined with Batching')));
        }
        if (!shouldUseBody) {
            return new Observable((observer) => observer.error(new Error('File upload is not available when GET is used')));
        }
        if (!extractFiles) {
            return new Observable((observer) => observer.error(new Error(`To use File upload you need to pass "extractFiles" function from "extract-files" library to HttpLink's options`)));
        }
        multipartInfo = extractFiles(req.body);
        shouldUseMultipart = !!multipartInfo.files.size;
    }
    // `body` for some, `params` for others
    let bodyOrParams = {};
    if (isBatching) {
        if (!shouldUseBody) {
            return new Observable((observer) => observer.error(new Error('Batching is not available for GET requests')));
        }
        bodyOrParams = {
            body: req.body,
        };
    }
    else {
        const body = shouldUseMultipart ? multipartInfo.clone : req.body;
        if (shouldUseBody) {
            bodyOrParams = {
                body,
            };
        }
        else {
            const params = Object.keys(req.body).reduce((obj, param) => {
                const value = req.body[param];
                obj[param] = shouldStringify(param) ? JSON.stringify(value) : value;
                return obj;
            }, {});
            bodyOrParams = { params: params };
        }
    }
    if (shouldUseMultipart && shouldUseBody) {
        const form = new FormData();
        form.append('operations', JSON.stringify(bodyOrParams.body));
        const map = {};
        const files = multipartInfo.files;
        let i = 0;
        files.forEach((paths) => {
            map[++i] = paths;
        });
        form.append('map', JSON.stringify(map));
        i = 0;
        files.forEach((_, file) => {
            form.append(++i + '', file, file.name);
        });
        bodyOrParams.body = form;
    }
    // create a request
    return httpClient.request(req.method, req.url, {
        observe: 'response',
        responseType: 'json',
        reportProgress: false,
        ...bodyOrParams,
        ...req.options,
    });
};
const mergeHeaders = (source, destination) => {
    if (source && destination) {
        const merged = destination
            .keys()
            .reduce((headers, name) => headers.set(name, destination.getAll(name)), source);
        return merged;
    }
    return destination || source;
};
function prioritize(...values) {
    const picked = values.find((val) => typeof val !== 'undefined');
    if (typeof picked === 'undefined') {
        return values[values.length - 1];
    }
    return picked;
}
function createHeadersWithClientAwereness(context) {
    // `apollographql-client-*` headers are automatically set if a
    // `clientAwareness` object is found in the context. These headers are
    // set first, followed by the rest of the headers pulled from
    // `context.headers`.
    let headers = context.headers && context.headers instanceof HttpHeaders
        ? context.headers
        : new HttpHeaders(context.headers);
    if (context.clientAwareness) {
        const { name, version } = context.clientAwareness;
        // If desired, `apollographql-client-*` headers set by
        // the `clientAwareness` object can be overridden by
        // `apollographql-client-*` headers set in `context.headers`.
        if (name && !headers.has('apollographql-client-name')) {
            headers = headers.set('apollographql-client-name', name);
        }
        if (version && !headers.has('apollographql-client-version')) {
            headers = headers.set('apollographql-client-version', version);
        }
    }
    return headers;
}

// XXX find a better name for it
class HttpLinkHandler extends ApolloLink {
    constructor(httpClient, options) {
        super();
        this.httpClient = httpClient;
        this.options = options;
        this.print = print;
        if (this.options.operationPrinter) {
            this.print = this.options.operationPrinter;
        }
        this.requester = (operation) => new Observable$1((observer) => {
            const context = operation.getContext();
            // decides which value to pick, Context, Options or to just use the default
            const pick = (key, init) => {
                return prioritize(context[key], this.options[key], init);
            };
            let method = pick('method', 'POST');
            const includeQuery = pick('includeQuery', true);
            const includeExtensions = pick('includeExtensions', false);
            const url = pick('uri', 'graphql');
            const withCredentials = pick('withCredentials');
            const useMultipart = pick('useMultipart');
            const useGETForQueries = this.options.useGETForQueries === true;
            const isQuery = operation.query.definitions.some((def) => def.kind === 'OperationDefinition' && def.operation === 'query');
            if (useGETForQueries && isQuery) {
                method = 'GET';
            }
            const req = {
                method,
                url: typeof url === 'function' ? url(operation) : url,
                body: {
                    operationName: operation.operationName,
                    variables: operation.variables,
                },
                options: {
                    withCredentials,
                    useMultipart,
                    headers: this.options.headers,
                },
            };
            if (includeExtensions) {
                req.body.extensions = operation.extensions;
            }
            if (includeQuery) {
                req.body.query = this.print(operation.query);
            }
            const headers = createHeadersWithClientAwereness(context);
            req.options.headers = mergeHeaders(req.options.headers, headers);
            const sub = fetch(req, this.httpClient, this.options.extractFiles).subscribe({
                next: (response) => {
                    operation.setContext({ response });
                    observer.next(response.body);
                },
                error: (err) => observer.error(err),
                complete: () => observer.complete(),
            });
            return () => {
                if (!sub.closed) {
                    sub.unsubscribe();
                }
            };
        });
    }
    request(op) {
        return this.requester(op);
    }
}
class HttpLink {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    create(options) {
        return new HttpLinkHandler(this.httpClient, options);
    }
}
HttpLink.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: HttpLink, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable });
HttpLink.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: HttpLink, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: HttpLink, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: i1.HttpClient }]; } });

const defaults = {
    batchInterval: 10,
    batchMax: 10,
    uri: 'graphql',
    method: 'POST',
};
class HttpBatchLinkHandler extends ApolloLink {
    constructor(httpClient, options) {
        super();
        this.httpClient = httpClient;
        this.options = options;
        this.print = print;
        this.batchInterval = options.batchInterval || defaults.batchInterval;
        this.batchMax = options.batchMax || defaults.batchMax;
        if (this.options.operationPrinter) {
            this.print = this.options.operationPrinter;
        }
        const batchHandler = (operations) => {
            return new Observable$1((observer) => {
                const body = this.createBody(operations);
                const headers = this.createHeaders(operations);
                const { method, uri, withCredentials } = this.createOptions(operations);
                if (typeof uri === 'function') {
                    throw new Error(`Option 'uri' is a function, should be a string`);
                }
                const req = {
                    method,
                    url: uri,
                    body: body,
                    options: {
                        withCredentials,
                        headers,
                    },
                };
                const sub = fetch(req, this.httpClient, () => {
                    throw new Error('File upload is not available when combined with Batching');
                }).subscribe({
                    next: (result) => observer.next(result.body),
                    error: (err) => observer.error(err),
                    complete: () => observer.complete(),
                });
                return () => {
                    if (!sub.closed) {
                        sub.unsubscribe();
                    }
                };
            });
        };
        const batchKey = options.batchKey ||
            ((operation) => {
                return this.createBatchKey(operation);
            });
        this.batcher = new BatchLink({
            batchInterval: this.batchInterval,
            batchMax: this.batchMax,
            batchKey,
            batchHandler,
        });
    }
    createOptions(operations) {
        const context = operations[0].getContext();
        return {
            method: prioritize(context.method, this.options.method, defaults.method),
            uri: prioritize(context.uri, this.options.uri, defaults.uri),
            withCredentials: prioritize(context.withCredentials, this.options.withCredentials),
        };
    }
    createBody(operations) {
        return operations.map((operation) => {
            const includeExtensions = prioritize(operation.getContext().includeExtensions, this.options.includeExtensions, false);
            const includeQuery = prioritize(operation.getContext().includeQuery, this.options.includeQuery, true);
            const body = {
                operationName: operation.operationName,
                variables: operation.variables,
            };
            if (includeExtensions) {
                body.extensions = operation.extensions;
            }
            if (includeQuery) {
                body.query = this.print(operation.query);
            }
            return body;
        });
    }
    createHeaders(operations) {
        return operations.reduce((headers, operation) => {
            return mergeHeaders(headers, operation.getContext().headers);
        }, createHeadersWithClientAwereness({
            headers: this.options.headers,
            clientAwareness: operations[0]?.getContext()?.clientAwareness,
        }));
    }
    createBatchKey(operation) {
        const context = operation.getContext();
        if (context.skipBatching) {
            return Math.random().toString(36).substr(2, 9);
        }
        const headers = context.headers &&
            context.headers.keys().map((k) => context.headers.get(k));
        const opts = JSON.stringify({
            includeQuery: context.includeQuery,
            includeExtensions: context.includeExtensions,
            headers,
        });
        return prioritize(context.uri, this.options.uri) + opts;
    }
    request(op) {
        return this.batcher.request(op);
    }
}
class HttpBatchLink {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    create(options) {
        return new HttpBatchLinkHandler(this.httpClient, options);
    }
}
HttpBatchLink.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: HttpBatchLink, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable });
HttpBatchLink.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: HttpBatchLink, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: HttpBatchLink, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: i1.HttpClient }]; } });

// http

/**
 * Generated bundle index. Do not edit.
 */

export { HttpBatchLink, HttpBatchLinkHandler, HttpLink, HttpLinkHandler };
//# sourceMappingURL=ngApolloLinkHttp.mjs.map
