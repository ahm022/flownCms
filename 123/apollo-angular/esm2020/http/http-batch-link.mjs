import { Injectable } from '@angular/core';
import { ApolloLink, Observable as LinkObservable, } from '@apollo/client/core';
import { BatchLink } from '@apollo/client/link/batch';
import { print } from 'graphql';
import { createHeadersWithClientAwereness, fetch, mergeHeaders, prioritize, } from './utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
const defaults = {
    batchInterval: 10,
    batchMax: 10,
    uri: 'graphql',
    method: 'POST',
};
export class HttpBatchLinkHandler extends ApolloLink {
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
            return new LinkObservable((observer) => {
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
export class HttpBatchLink {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC1iYXRjaC1saW5rLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vaHR0cC9zcmMvaHR0cC1iYXRjaC1saW5rLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUNMLFVBQVUsRUFDVixVQUFVLElBQUksY0FBYyxHQUc3QixNQUFNLHFCQUFxQixDQUFDO0FBQzdCLE9BQU8sRUFBQyxTQUFTLEVBQWUsTUFBTSwyQkFBMkIsQ0FBQztBQUNsRSxPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBRTlCLE9BQU8sRUFDTCxnQ0FBZ0MsRUFDaEMsS0FBSyxFQUNMLFlBQVksRUFDWixVQUFVLEdBQ1gsTUFBTSxTQUFTLENBQUM7OztBQUlqQixNQUFNLFFBQVEsR0FBRztJQUNmLGFBQWEsRUFBRSxFQUFFO0lBQ2pCLFFBQVEsRUFBRSxFQUFFO0lBQ1osR0FBRyxFQUFFLFNBQVM7SUFDZCxNQUFNLEVBQUUsTUFBTTtDQUNmLENBQUM7QUFFRixNQUFNLE9BQU8sb0JBQXFCLFNBQVEsVUFBVTtJQU1sRCxZQUFvQixVQUFzQixFQUFVLE9BQXFCO1FBQ3ZFLEtBQUssRUFBRSxDQUFDO1FBRFUsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQWM7UUFGakUsVUFBSyxHQUFxQixLQUFLLENBQUM7UUFLdEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUMsYUFBYSxJQUFJLFFBQVEsQ0FBQyxhQUFhLENBQUM7UUFDckUsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUM7UUFFdEQsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFO1lBQ2pDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQztT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dCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0h0dHBDbGllbnQsIEh0dHBIZWFkZXJzfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQge1xuICBBcG9sbG9MaW5rLFxuICBPYnNlcnZhYmxlIGFzIExpbmtPYnNlcnZhYmxlLFxuICBPcGVyYXRpb24sXG4gIEZldGNoUmVzdWx0LFxufSBmcm9tICdAYXBvbGxvL2NsaWVudC9jb3JlJztcbmltcG9ydCB7QmF0Y2hMaW5rLCBCYXRjaEhhbmRsZXJ9IGZyb20gJ0BhcG9sbG8vY2xpZW50L2xpbmsvYmF0Y2gnO1xuaW1wb3J0IHtwcmludH0gZnJvbSAnZ3JhcGhxbCc7XG5pbXBvcnQge0JvZHksIENvbnRleHQsIFJlcXVlc3QsIE9wdGlvbnMsIE9wZXJhdGlvblByaW50ZXJ9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHtcbiAgY3JlYXRlSGVhZGVyc1dpdGhDbGllbnRBd2VyZW5lc3MsXG4gIGZldGNoLFxuICBtZXJnZUhlYWRlcnMsXG4gIHByaW9yaXRpemUsXG59IGZyb20gJy4vdXRpbHMnO1xuXG5pbXBvcnQge0JhdGNoT3B0aW9uc30gZnJvbSAnLi90eXBlcyc7XG5cbmNvbnN0IGRlZmF1bHRzID0ge1xuICBiYXRjaEludGVydmFsOiAxMCxcbiAgYmF0Y2hNYXg6IDEwLFxuICB1cmk6ICdncmFwaHFsJyxcbiAgbWV0aG9kOiAnUE9TVCcsXG59O1xuXG5leHBvcnQgY2xhc3MgSHR0cEJhdGNoTGlua0hhbmRsZXIgZXh0ZW5kcyBBcG9sbG9MaW5rIHtcbiAgcHVibGljIGJhdGNoZXI6IEFwb2xsb0xpbms7XG4gIHByaXZhdGUgYmF0Y2hJbnRlcnZhbDogbnVtYmVyO1xuICBwcml2YXRlIGJhdGNoTWF4OiBudW1iZXI7XG4gIHByaXZhdGUgcHJpbnQ6IE9wZXJhdGlvblByaW50ZXIgPSBwcmludDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHBDbGllbnQ6IEh0dHBDbGllbnQsIHByaXZhdGUgb3B0aW9uczogQmF0Y2hPcHRpb25zKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuYmF0Y2hJbnRlcnZhbCA9IG9wdGlvbnMuYmF0Y2hJbnRlcnZhbCB8fCBkZWZhdWx0cy5iYXRjaEludGVydmFsO1xuICAgIHRoaXMuYmF0Y2hNYXggPSBvcHRpb25zLmJhdGNoTWF4IHx8IGRlZmF1bHRzLmJhdGNoTWF4O1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5vcGVyYXRpb25QcmludGVyKSB7XG4gICAgICB0aGlzLnByaW50ID0gdGhpcy5vcHRpb25zLm9wZXJhdGlvblByaW50ZXI7XG4gICAgfVxuXG4gICAgY29uc3QgYmF0Y2hIYW5kbGVyOiBCYXRjaEhhbmRsZXIgPSAob3BlcmF0aW9uczogT3BlcmF0aW9uW10pID0+IHtcbiAgICAgIHJldHVybiBuZXcgTGlua09ic2VydmFibGUoKG9ic2VydmVyOiBhbnkpID0+IHtcbiAgICAgICAgY29uc3QgYm9keSA9IHRoaXMuY3JlYXRlQm9keShvcGVyYXRpb25zKTtcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IHRoaXMuY3JlYXRlSGVhZGVycyhvcGVyYXRpb25zKTtcbiAgICAgICAgY29uc3Qge21ldGhvZCwgdXJpLCB3aXRoQ3JlZGVudGlhbHN9ID0gdGhpcy5jcmVhdGVPcHRpb25zKG9wZXJhdGlvbnMpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdXJpID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBPcHRpb24gJ3VyaScgaXMgYSBmdW5jdGlvbiwgc2hvdWxkIGJlIGEgc3RyaW5nYCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZXE6IFJlcXVlc3QgPSB7XG4gICAgICAgICAgbWV0aG9kLFxuICAgICAgICAgIHVybDogdXJpLFxuICAgICAgICAgIGJvZHk6IGJvZHksXG4gICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgd2l0aENyZWRlbnRpYWxzLFxuICAgICAgICAgICAgaGVhZGVycyxcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IHN1YiA9IGZldGNoKHJlcSwgdGhpcy5odHRwQ2xpZW50LCAoKSA9PiB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgJ0ZpbGUgdXBsb2FkIGlzIG5vdCBhdmFpbGFibGUgd2hlbiBjb21iaW5lZCB3aXRoIEJhdGNoaW5nJyxcbiAgICAgICAgICApO1xuICAgICAgICB9KS5zdWJzY3JpYmUoe1xuICAgICAgICAgIG5leHQ6IChyZXN1bHQpID0+IG9ic2VydmVyLm5leHQocmVzdWx0LmJvZHkpLFxuICAgICAgICAgIGVycm9yOiAoZXJyKSA9PiBvYnNlcnZlci5lcnJvcihlcnIpLFxuICAgICAgICAgIGNvbXBsZXRlOiAoKSA9PiBvYnNlcnZlci5jb21wbGV0ZSgpLFxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgIGlmICghc3ViLmNsb3NlZCkge1xuICAgICAgICAgICAgc3ViLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGNvbnN0IGJhdGNoS2V5ID1cbiAgICAgIG9wdGlvbnMuYmF0Y2hLZXkgfHxcbiAgICAgICgob3BlcmF0aW9uOiBPcGVyYXRpb24pID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlQmF0Y2hLZXkob3BlcmF0aW9uKTtcbiAgICAgIH0pO1xuXG4gICAgdGhpcy5iYXRjaGVyID0gbmV3IEJhdGNoTGluayh7XG4gICAgICBiYXRjaEludGVydmFsOiB0aGlzLmJhdGNoSW50ZXJ2YWwsXG4gICAgICBiYXRjaE1heDogdGhpcy5iYXRjaE1heCxcbiAgICAgIGJhdGNoS2V5LFxuICAgICAgYmF0Y2hIYW5kbGVyLFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVPcHRpb25zKG9wZXJhdGlvbnM6IE9wZXJhdGlvbltdKTogT3B0aW9ucyB7XG4gICAgY29uc3QgY29udGV4dDogQ29udGV4dCA9IG9wZXJhdGlvbnNbMF0uZ2V0Q29udGV4dCgpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIG1ldGhvZDogcHJpb3JpdGl6ZShjb250ZXh0Lm1ldGhvZCwgdGhpcy5vcHRpb25zLm1ldGhvZCwgZGVmYXVsdHMubWV0aG9kKSxcbiAgICAgIHVyaTogcHJpb3JpdGl6ZShjb250ZXh0LnVyaSwgdGhpcy5vcHRpb25zLnVyaSwgZGVmYXVsdHMudXJpKSxcbiAgICAgIHdpdGhDcmVkZW50aWFsczogcHJpb3JpdGl6ZShcbiAgICAgICAgY29udGV4dC53aXRoQ3JlZGVudGlhbHMsXG4gICAgICAgIHRoaXMub3B0aW9ucy53aXRoQ3JlZGVudGlhbHMsXG4gICAgICApLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUJvZHkob3BlcmF0aW9uczogT3BlcmF0aW9uW10pOiBCb2R5W10ge1xuICAgIHJldHVybiBvcGVyYXRpb25zLm1hcCgob3BlcmF0aW9uKSA9PiB7XG4gICAgICBjb25zdCBpbmNsdWRlRXh0ZW5zaW9ucyA9IHByaW9yaXRpemUoXG4gICAgICAgIG9wZXJhdGlvbi5nZXRDb250ZXh0KCkuaW5jbHVkZUV4dGVuc2lvbnMsXG4gICAgICAgIHRoaXMub3B0aW9ucy5pbmNsdWRlRXh0ZW5zaW9ucyxcbiAgICAgICAgZmFsc2UsXG4gICAgICApO1xuICAgICAgY29uc3QgaW5jbHVkZVF1ZXJ5ID0gcHJpb3JpdGl6ZShcbiAgICAgICAgb3BlcmF0aW9uLmdldENvbnRleHQoKS5pbmNsdWRlUXVlcnksXG4gICAgICAgIHRoaXMub3B0aW9ucy5pbmNsdWRlUXVlcnksXG4gICAgICAgIHRydWUsXG4gICAgICApO1xuXG4gICAgICBjb25zdCBib2R5OiBCb2R5ID0ge1xuICAgICAgICBvcGVyYXRpb25OYW1lOiBvcGVyYXRpb24ub3BlcmF0aW9uTmFtZSxcbiAgICAgICAgdmFyaWFibGVzOiBvcGVyYXRpb24udmFyaWFibGVzLFxuICAgICAgfTtcblxuICAgICAgaWYgKGluY2x1ZGVFeHRlbnNpb25zKSB7XG4gICAgICAgIGJvZHkuZXh0ZW5zaW9ucyA9IG9wZXJhdGlvbi5leHRlbnNpb25zO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW5jbHVkZVF1ZXJ5KSB7XG4gICAgICAgIGJvZHkucXVlcnkgPSB0aGlzLnByaW50KG9wZXJhdGlvbi5xdWVyeSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBib2R5O1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVIZWFkZXJzKG9wZXJhdGlvbnM6IE9wZXJhdGlvbltdKTogSHR0cEhlYWRlcnMge1xuICAgIHJldHVybiBvcGVyYXRpb25zLnJlZHVjZShcbiAgICAgIChoZWFkZXJzOiBIdHRwSGVhZGVycywgb3BlcmF0aW9uOiBPcGVyYXRpb24pID0+IHtcbiAgICAgICAgcmV0dXJuIG1lcmdlSGVhZGVycyhoZWFkZXJzLCBvcGVyYXRpb24uZ2V0Q29udGV4dCgpLmhlYWRlcnMpO1xuICAgICAgfSxcbiAgICAgIGNyZWF0ZUhlYWRlcnNXaXRoQ2xpZW50QXdlcmVuZXNzKHtcbiAgICAgICAgaGVhZGVyczogdGhpcy5vcHRpb25zLmhlYWRlcnMsXG4gICAgICAgIGNsaWVudEF3YXJlbmVzczogb3BlcmF0aW9uc1swXT8uZ2V0Q29udGV4dCgpPy5jbGllbnRBd2FyZW5lc3MsXG4gICAgICB9KSxcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVCYXRjaEtleShvcGVyYXRpb246IE9wZXJhdGlvbik6IHN0cmluZyB7XG4gICAgY29uc3QgY29udGV4dDogQ29udGV4dCAmIHtza2lwQmF0Y2hpbmc/OiBib29sZWFufSA9IG9wZXJhdGlvbi5nZXRDb250ZXh0KCk7XG5cbiAgICBpZiAoY29udGV4dC5za2lwQmF0Y2hpbmcpIHtcbiAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHIoMiwgOSk7XG4gICAgfVxuXG4gICAgY29uc3QgaGVhZGVycyA9XG4gICAgICBjb250ZXh0LmhlYWRlcnMgJiZcbiAgICAgIGNvbnRleHQuaGVhZGVycy5rZXlzKCkubWFwKChrOiBzdHJpbmcpID0+IGNvbnRleHQuaGVhZGVycy5nZXQoaykpO1xuXG4gICAgY29uc3Qgb3B0cyA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIGluY2x1ZGVRdWVyeTogY29udGV4dC5pbmNsdWRlUXVlcnksXG4gICAgICBpbmNsdWRlRXh0ZW5zaW9uczogY29udGV4dC5pbmNsdWRlRXh0ZW5zaW9ucyxcbiAgICAgIGhlYWRlcnMsXG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJpb3JpdGl6ZShjb250ZXh0LnVyaSwgdGhpcy5vcHRpb25zLnVyaSkgKyBvcHRzO1xuICB9XG5cbiAgcHVibGljIHJlcXVlc3Qob3A6IE9wZXJhdGlvbik6IExpbmtPYnNlcnZhYmxlPEZldGNoUmVzdWx0PiB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLmJhdGNoZXIucmVxdWVzdChvcCk7XG4gIH1cbn1cblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCcsXG59KVxuZXhwb3J0IGNsYXNzIEh0dHBCYXRjaExpbmsge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHBDbGllbnQ6IEh0dHBDbGllbnQpIHt9XG5cbiAgcHVibGljIGNyZWF0ZShvcHRpb25zOiBCYXRjaE9wdGlvbnMpOiBIdHRwQmF0Y2hMaW5rSGFuZGxlciB7XG4gICAgcmV0dXJuIG5ldyBIdHRwQmF0Y2hMaW5rSGFuZGxlcih0aGlzLmh0dHBDbGllbnQsIG9wdGlvbnMpO1xuICB9XG59XG4iXX0=