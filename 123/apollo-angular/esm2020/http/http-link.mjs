import { Injectable } from '@angular/core';
import { ApolloLink, Observable as LinkObservable, } from '@apollo/client/core';
import { print } from 'graphql';
import { createHeadersWithClientAwereness, fetch, mergeHeaders, prioritize, } from './utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
// XXX find a better name for it
export class HttpLinkHandler extends ApolloLink {
    constructor(httpClient, options) {
        super();
        this.httpClient = httpClient;
        this.options = options;
        this.print = print;
        if (this.options.operationPrinter) {
            this.print = this.options.operationPrinter;
        }
        this.requester = (operation) => new LinkObservable((observer) => {
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
export class HttpLink {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC1saW5rLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vaHR0cC9zcmMvaHR0cC1saW5rLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUNMLFVBQVUsRUFDVixVQUFVLElBQUksY0FBYyxHQUc3QixNQUFNLHFCQUFxQixDQUFDO0FBQzdCLE9BQU8sRUFBQyxLQUFLLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFFOUIsT0FBTyxFQUNMLGdDQUFnQyxFQUNoQyxLQUFLLEVBQ0wsWUFBWSxFQUNaLFVBQVUsR0FDWCxNQUFNLFNBQVMsQ0FBQzs7O0FBRWpCLGdDQUFnQztBQUNoQyxNQUFNLE9BQU8sZUFBZ0IsU0FBUSxVQUFVO0lBTTdDLFlBQW9CLFVBQXNCLEVBQVUsT0FBZ0I7UUFDbEUsS0FBSyxFQUFFLENBQUM7UUFEVSxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUY1RCxVQUFLLEdBQXFCLEtBQUssQ0FBQztRQUt0QyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUU7WUFDakMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDO1NBQzVDO1FBRUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLFNBQW9CLEVBQUUsRUFBRSxDQUN4QyxJQUFJLGNBQWMsQ0FBQyxDQUFDLFFBQWEsRUFBRSxFQUFFO1lBQ25DLE1BQU0sT0FBTyxHQUFZLFNBQVMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUVoRCwyRUFBMkU7WUFDM0UsTUFBTSxJQUFJLEdBQUcsQ0FDWCxHQUFNLEVBQ04sSUFBOEIsRUFDTCxFQUFFO2dCQUMzQixPQUFPLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxJ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QUNQLENBQUM7SUFFTSxPQUFPLENBQUMsRUFBYTtRQUMxQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDNUIsQ0FBQztDQUNGO0FBS0QsTUFBTSxPQUFPLFFBQVE7SUFDbkIsWUFBb0IsVUFBc0I7UUFBdEIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtJQUFHLENBQUM7SUFFdkMsTUFBTSxDQUFDLE9BQWdCO1FBQzVCLE9BQU8sSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN2RCxDQUFDOztxR0FMVSxRQUFRO3lHQUFSLFFBQVEsY0FGUCxNQUFNOzJGQUVQLFFBQVE7a0JBSHBCLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7SHR0cENsaWVudH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHtcbiAgQXBvbGxvTGluayxcbiAgT2JzZXJ2YWJsZSBhcyBMaW5rT2JzZXJ2YWJsZSxcbiAgT3BlcmF0aW9uLFxuICBGZXRjaFJlc3VsdCxcbn0gZnJvbSAnQGFwb2xsby9jbGllbnQvY29yZSc7XG5pbXBvcnQge3ByaW50fSBmcm9tICdncmFwaHFsJztcbmltcG9ydCB7T3B0aW9ucywgQm9keSwgUmVxdWVzdCwgQ29udGV4dCwgT3BlcmF0aW9uUHJpbnRlcn0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQge1xuICBjcmVhdGVIZWFkZXJzV2l0aENsaWVudEF3ZXJlbmVzcyxcbiAgZmV0Y2gsXG4gIG1lcmdlSGVhZGVycyxcbiAgcHJpb3JpdGl6ZSxcbn0gZnJvbSAnLi91dGlscyc7XG5cbi8vIFhYWCBmaW5kIGEgYmV0dGVyIG5hbWUgZm9yIGl0XG5leHBvcnQgY2xhc3MgSHR0cExpbmtIYW5kbGVyIGV4dGVuZHMgQXBvbGxvTGluayB7XG4gIHB1YmxpYyByZXF1ZXN0ZXI6IChcbiAgICBvcGVyYXRpb246IE9wZXJhdGlvbixcbiAgKSA9PiBMaW5rT2JzZXJ2YWJsZTxGZXRjaFJlc3VsdD4gfCBudWxsO1xuICBwcml2YXRlIHByaW50OiBPcGVyYXRpb25QcmludGVyID0gcHJpbnQ7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwQ2xpZW50OiBIdHRwQ2xpZW50LCBwcml2YXRlIG9wdGlvbnM6IE9wdGlvbnMpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5vcGVyYXRpb25QcmludGVyKSB7XG4gICAgICB0aGlzLnByaW50ID0gdGhpcy5vcHRpb25zLm9wZXJhdGlvblByaW50ZXI7XG4gICAgfVxuXG4gICAgdGhpcy5yZXF1ZXN0ZXIgPSAob3BlcmF0aW9uOiBPcGVyYXRpb24pID0+XG4gICAgICBuZXcgTGlua09ic2VydmFibGUoKG9ic2VydmVyOiBhbnkpID0+IHtcbiAgICAgICAgY29uc3QgY29udGV4dDogQ29udGV4dCA9IG9wZXJhdGlvbi5nZXRDb250ZXh0KCk7XG5cbiAgICAgICAgLy8gZGVjaWRlcyB3aGljaCB2YWx1ZSB0byBwaWNrLCBDb250ZXh0LCBPcHRpb25zIG9yIHRvIGp1c3QgdXNlIHRoZSBkZWZhdWx0XG4gICAgICAgIGNvbnN0IHBpY2sgPSA8SyBleHRlbmRzIGtleW9mIENvbnRleHQ+KFxuICAgICAgICAgIGtleTogSyxcbiAgICAgICAgICBpbml0PzogQ29udGV4dFtLXSB8IE9wdGlvbnNbS10sXG4gICAgICAgICk6IENvbnRleHRbS10gfCBPcHRpb25zW0tdID0+IHtcbiAgICAgICAgICByZXR1cm4gcHJpb3JpdGl6ZShjb250ZXh0W2tleV0sIHRoaXMub3B0aW9uc1trZXldLCBpbml0KTtcbiAgICAgICAgfTtcblxuICAgICAgICBsZXQgbWV0aG9kID0gcGljaygnbWV0aG9kJywgJ1BPU1QnKTtcbiAgICAgICAgY29uc3QgaW5jbHVkZVF1ZXJ5ID0gcGljaygnaW5jbHVkZVF1ZXJ5JywgdHJ1ZSk7XG4gICAgICAgIGNvbnN0IGluY2x1ZGVFeHRlbnNpb25zID0gcGljaygnaW5jbHVkZUV4dGVuc2lvbnMnLCBmYWxzZSk7XG4gICAgICAgIGNvbnN0IHVybCA9IHBpY2soJ3VyaScsICdncmFwaHFsJyk7XG4gICAgICAgIGNvbnN0IHdpdGhDcmVkZW50aWFscyA9IHBpY2soJ3dpdGhDcmVkZW50aWFscycpO1xuICAgICAgICBjb25zdCB1c2VNdWx0aXBhcnQgPSBwaWNrKCd1c2VNdWx0aXBhcnQnKTtcbiAgICAgICAgY29uc3QgdXNlR0VURm9yUXVlcmllcyA9IHRoaXMub3B0aW9ucy51c2VHRVRGb3JRdWVyaWVzID09PSB0cnVlO1xuXG4gICAgICAgIGNvbnN0IGlzUXVlcnkgPSBvcGVyYXRpb24ucXVlcnkuZGVmaW5pdGlvbnMuc29tZShcbiAgICAgICAgICAoZGVmKSA9PlxuICAgICAgICAgICAgZGVmLmtpbmQgPT09ICdPcGVyYXRpb25EZWZpbml0aW9uJyAmJiBkZWYub3BlcmF0aW9uID09PSAncXVlcnknLFxuICAgICAgICApO1xuXG4gICAgICAgIGlmICh1c2VHRVRGb3JRdWVyaWVzICYmIGlzUXVlcnkpIHtcbiAgICAgICAgICBtZXRob2QgPSAnR0VUJztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlcTogUmVxdWVzdCA9IHtcbiAgICAgICAgICBtZXRob2QsXG4gICAgICAgICAgdXJsOiB0eXBlb2YgdXJsID09PSAnZnVuY3Rpb24nID8gdXJsKG9wZXJhdGlvbikgOiB1cmwsXG4gICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgb3BlcmF0aW9uTmFtZTogb3BlcmF0aW9uLm9wZXJhdGlvbk5hbWUsXG4gICAgICAgICAgICB2YXJpYWJsZXM6IG9wZXJhdGlvbi52YXJpYWJsZXMsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICB3aXRoQ3JlZGVudGlhbHMsXG4gICAgICAgICAgICB1c2VNdWx0aXBhcnQsXG4gICAgICAgICAgICBoZWFkZXJzOiB0aGlzLm9wdGlvbnMuaGVhZGVycyxcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChpbmNsdWRlRXh0ZW5zaW9ucykge1xuICAgICAgICAgIChyZXEuYm9keSBhcyBCb2R5KS5leHRlbnNpb25zID0gb3BlcmF0aW9uLmV4dGVuc2lvbnM7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaW5jbHVkZVF1ZXJ5KSB7XG4gICAgICAgICAgKHJlcS5ib2R5IGFzIEJvZHkpLnF1ZXJ5ID0gdGhpcy5wcmludChvcGVyYXRpb24ucXVlcnkpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaGVhZGVycyA9IGNyZWF0ZUhlYWRlcnNXaXRoQ2xpZW50QXdlcmVuZXNzKGNvbnRleHQpO1xuXG4gICAgICAgIHJlcS5vcHRpb25zLmhlYWRlcnMgPSBtZXJnZUhlYWRlcnMocmVxLm9wdGlvbnMuaGVhZGVycywgaGVhZGVycyk7XG5cbiAgICAgICAgY29uc3Qgc3ViID0gZmV0Y2goXG4gICAgICAgICAgcmVxLFxuICAgICAgICAgIHRoaXMuaHR0cENsaWVudCxcbiAgICAgICAgICB0aGlzLm9wdGlvbnMuZXh0cmFjdEZpbGVzLFxuICAgICAgICApLnN1YnNjcmliZSh7XG4gICAgICAgICAgbmV4dDogKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICBvcGVyYXRpb24uc2V0Q29udGV4dCh7cmVzcG9uc2V9KTtcbiAgICAgICAgICAgIG9ic2VydmVyLm5leHQocmVzcG9uc2UuYm9keSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBlcnJvcjogKGVycikgPT4gb2JzZXJ2ZXIuZXJyb3IoZXJyKSxcbiAgICAgICAgICBjb21wbGV0ZTogKCkgPT4gb2JzZXJ2ZXIuY29tcGxldGUoKSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICBpZiAoIXN1Yi5jbG9zZWQpIHtcbiAgICAgICAgICAgIHN1Yi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHJlcXVlc3Qob3A6IE9wZXJhdGlvbik6IExpbmtPYnNlcnZhYmxlPEZldGNoUmVzdWx0PiB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3RlcihvcCk7XG4gIH1cbn1cblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCcsXG59KVxuZXhwb3J0IGNsYXNzIEh0dHBMaW5rIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwQ2xpZW50OiBIdHRwQ2xpZW50KSB7fVxuXG4gIHB1YmxpYyBjcmVhdGUob3B0aW9uczogT3B0aW9ucyk6IEh0dHBMaW5rSGFuZGxlciB7XG4gICAgcmV0dXJuIG5ldyBIdHRwTGlua0hhbmRsZXIodGhpcy5odHRwQ2xpZW50LCBvcHRpb25zKTtcbiAgfVxufVxuIl19