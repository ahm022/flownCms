import { HttpHeaders, HttpResponse, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Request, ExtractFiles } from './types';
export declare const fetch: (req: Request, httpClient: HttpClient, extractFiles?: ExtractFiles) => Observable<HttpResponse<Object>>;
export declare const mergeHeaders: (source: HttpHeaders, destination: HttpHeaders) => HttpHeaders;
export declare function prioritize<T>(...values: T[]): T;
export declare function createHeadersWithClientAwereness(context: Record<string, any>): HttpHeaders;
