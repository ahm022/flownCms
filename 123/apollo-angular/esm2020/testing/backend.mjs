import { Injectable } from '@angular/core';
import { Observable as LinkObservable } from '@apollo/client/core';
import { print } from 'graphql';
import { TestOperation } from './operation';
import * as i0 from "@angular/core";
/**
 * A testing backend for `Apollo`.
 *
 * `ApolloTestingBackend` works by keeping a list of all open operations.
 * As operations come in, they're added to the list. Users can assert that specific
 * operations were made and then flush them. In the end, a verify() method asserts
 * that no unexpected operations were made.
 */
export class ApolloTestingBackend {
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
        return new LinkObservable((observer) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2VuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3Rpbmcvc3JjL2JhY2tlbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUV6QyxPQUFPLEVBQWMsVUFBVSxJQUFJLGNBQWMsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQzlFLE9BQU8sRUFBQyxLQUFLLEVBQWUsTUFBTSxTQUFTLENBQUM7QUFHNUMsT0FBTyxFQUFDLGFBQWEsRUFBWSxNQUFNLGFBQWEsQ0FBQzs7QUFFckQ7Ozs7Ozs7R0FPRztBQUVILE1BQU0sT0FBTyxvQkFBb0I7SUFEakM7UUFFRTs7V0FFRztRQUNLLFNBQUksR0FBb0IsRUFBRSxDQUFDO0tBeUpwQztJQXZKQzs7T0FFRztJQUNJLE1BQU0sQ0FBQyxFQUFhO1FBQ3pCLE9BQU8sSUFBSSxjQUFjLENBQUMsQ0FBQyxRQUF1QixFQUFFLEVBQUU7WUFDcEQsTUFBTSxNQUFNLEdBQUcsSUFBSSxhQUFhLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQy9DLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3pCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOztPQUVHO0lBQ0ssTUFBTSxDQUFDLEtBQXFCO1FBQ2xDLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO1lBQzdCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQ3JCLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsS0FBSyxLQUFLLENBQ3JELENBQUM7U0FDSDthQUFNLElBQUksT0FBTyxLQUFLLEtBQUssVUFBVSxFQUFFO1lBQ3RDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FB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QyxhQUFhLENBQUM7SUFDL0MsQ0FBQztJQUVPLHNCQUFzQixDQUFDLE9BQXVCO1FBQ3BELElBQUksT0FBTyxPQUFPLEtBQUssUUFBUSxFQUFFO1lBQy9CLE9BQU8sd0JBQXdCLE9BQU8sRUFBRSxDQUFDO1NBQzFDO2FBQU0sSUFBSSxPQUFPLE9BQU8sS0FBSyxRQUFRLEVBQUU7WUFDdEMsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNoQyxPQUFPLG9CQUFvQixDQUFDO2FBQzdCO1lBRUQsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLGFBQWEsSUFBSSxPQUFPLENBQUM7WUFDOUMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksT0FBTyxDQUFDO1lBRS9ELE9BQU8sb0JBQW9CLElBQUksZ0JBQWdCLFNBQVMsRUFBRSxDQUFDO1NBQzVEO2FBQU07WUFDTCxPQUFPLHNCQUFzQixPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDN0M7SUFDSCxDQUFDOztpSEE1SlUsb0JBQW9CO3FIQUFwQixvQkFBb0I7MkZBQXBCLG9CQUFvQjtrQkFEaEMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge09ic2VydmVyfSBmcm9tICdyeGpzJztcbmltcG9ydCB7RmV0Y2hSZXN1bHQsIE9ic2VydmFibGUgYXMgTGlua09ic2VydmFibGV9IGZyb20gJ0BhcG9sbG8vY2xpZW50L2NvcmUnO1xuaW1wb3J0IHtwcmludCwgRG9jdW1lbnROb2RlfSBmcm9tICdncmFwaHFsJztcblxuaW1wb3J0IHtBcG9sbG9UZXN0aW5nQ29udHJvbGxlciwgTWF0Y2hPcGVyYXRpb259IGZyb20gJy4vY29udHJvbGxlcic7XG5pbXBvcnQge1Rlc3RPcGVyYXRpb24sIE9wZXJhdGlvbn0gZnJvbSAnLi9vcGVyYXRpb24nO1xuXG4vKipcbiAqIEEgdGVzdGluZyBiYWNrZW5kIGZvciBgQXBvbGxvYC5cbiAqXG4gKiBgQXBvbGxvVGVzdGluZ0JhY2tlbmRgIHdvcmtzIGJ5IGtlZXBpbmcgYSBsaXN0IG9mIGFsbCBvcGVuIG9wZXJhdGlvbnMuXG4gKiBBcyBvcGVyYXRpb25zIGNvbWUgaW4sIHRoZXkncmUgYWRkZWQgdG8gdGhlIGxpc3QuIFVzZXJzIGNhbiBhc3NlcnQgdGhhdCBzcGVjaWZpY1xuICogb3BlcmF0aW9ucyB3ZXJlIG1hZGUgYW5kIHRoZW4gZmx1c2ggdGhlbS4gSW4gdGhlIGVuZCwgYSB2ZXJpZnkoKSBtZXRob2QgYXNzZXJ0c1xuICogdGhhdCBubyB1bmV4cGVjdGVkIG9wZXJhdGlvbnMgd2VyZSBtYWRlLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQXBvbGxvVGVzdGluZ0JhY2tlbmQgaW1wbGVtZW50cyBBcG9sbG9UZXN0aW5nQ29udHJvbGxlciB7XG4gIC8qKlxuICAgKiBMaXN0IG9mIHBlbmRpbmcgb3BlcmF0aW9ucyB3aGljaCBoYXZlIG5vdCB5ZXQgYmVlbiBleHBlY3RlZC5cbiAgICovXG4gIHByaXZhdGUgb3BlbjogVGVzdE9wZXJhdGlvbltdID0gW107XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBhbiBpbmNvbWluZyBvcGVyYXRpb24gYnkgcXVldWVpbmcgaXQgaW4gdGhlIGxpc3Qgb2Ygb3BlbiBvcGVyYXRpb25zLlxuICAgKi9cbiAgcHVibGljIGhhbmRsZShvcDogT3BlcmF0aW9uKTogTGlua09ic2VydmFibGU8RmV0Y2hSZXN1bHQ+IHtcbiAgICByZXR1cm4gbmV3IExpbmtPYnNlcnZhYmxlKChvYnNlcnZlcjogT2JzZXJ2ZXI8YW55PikgPT4ge1xuICAgICAgY29uc3QgdGVzdE9wID0gbmV3IFRlc3RPcGVyYXRpb24ob3AsIG9ic2VydmVyKTtcbiAgICAgIHRoaXMub3Blbi5wdXNoKHRlc3RPcCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogSGVscGVyIGZ1bmN0aW9uIHRvIHNlYXJjaCBmb3Igb3BlcmF0aW9ucyBpbiB0aGUgbGlzdCBvZiBvcGVuIG9wZXJhdGlvbnMuXG4gICAqL1xuICBwcml2YXRlIF9tYXRjaChtYXRjaDogTWF0Y2hPcGVyYXRpb24pOiBUZXN0T3BlcmF0aW9uW10ge1xuICAgIGlmICh0eXBlb2YgbWF0Y2ggPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gdGhpcy5vcGVuLmZpbHRlcihcbiAgICAgICAgKHRlc3RPcCkgPT4gdGVzdE9wLm9wZXJhdGlvbi5vcGVyYXRpb25OYW1lID09PSBtYXRjaCxcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbWF0Y2ggPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiB0aGlzLm9wZW4uZmlsdGVyKCh0ZXN0T3ApID0+IG1hdGNoKHRlc3RPcC5vcGVyYXRpb24pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuaXNEb2N1bWVudE5vZGUobWF0Y2gpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wZW4uZmlsdGVyKFxuICAgICAgICAgICh0ZXN0T3ApID0+IHByaW50KHRlc3RPcC5vcGVyYXRpb24ucXVlcnkpID09PSBwcmludChtYXRjaCksXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLm9wZW4uZmlsdGVyKCh0ZXN0T3ApID0+IHRoaXMubWF0Y2hPcChtYXRjaCwgdGVzdE9wKSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBtYXRjaE9wKG1hdGNoOiBPcGVyYXRpb24sIHRlc3RPcDogVGVzdE9wZXJhdGlvbik6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHZhcmlhYmxlcyA9IEpTT04uc3RyaW5naWZ5KG1hdGNoLnZhcmlhYmxlcyk7XG4gICAgY29uc3QgZXh0ZW5zaW9ucyA9IEpTT04uc3RyaW5naWZ5KG1hdGNoLmV4dGVuc2lvbnMpO1xuXG4gICAgY29uc3Qgc2FtZU5hbWUgPSB0aGlzLmNvbXBhcmUoXG4gICAgICBtYXRjaC5vcGVyYXRpb25OYW1lLFxuICAgICAgdGVzdE9wLm9wZXJhdGlvbi5vcGVyYXRpb25OYW1lLFxuICAgICk7XG4gICAgY29uc3Qgc2FtZVZhcmlhYmxlcyA9IHRoaXMuY29tcGFyZSh2YXJpYWJsZXMsIHRlc3RPcC5vcGVyYXRpb24udmFyaWFibGVzKTtcblxuICAgIGNvbnN0IHNhbWVRdWVyeSA9IHByaW50KHRlc3RPcC5vcGVyYXRpb24ucXVlcnkpID09PSBwcmludChtYXRjaC5xdWVyeSk7XG5cbiAgICBjb25zdCBzYW1lRXh0ZW5zaW9ucyA9IHRoaXMuY29tcGFyZShcbiAgICAgIGV4dGVuc2lvbnMsXG4gICAgICB0ZXN0T3Aub3BlcmF0aW9uLmV4dGVuc2lvbnMsXG4gICAgKTtcblxuICAgIHJldHVybiBzYW1lTmFtZSAmJiBzYW1lVmFyaWFibGVzICYmIHNhbWVRdWVyeSAmJiBzYW1lRXh0ZW5zaW9ucztcbiAgfVxuXG4gIHByaXZhdGUgY29tcGFyZShleHBlY3RlZD86IHN0cmluZywgdmFsdWU/OiBPYmplY3QgfCBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBjb25zdCBwcmVwYXJlID0gKHZhbDogYW55KSA9PlxuICAgICAgdHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgPyB2YWwgOiBKU09OLnN0cmluZ2lmeSh2YWwpO1xuICAgIGNvbnN0IHJlY2VpdmVkID0gcHJlcGFyZSh2YWx1ZSk7XG5cbiAgICByZXR1cm4gIWV4cGVjdGVkIHx8IHJlY2VpdmVkID09PSBleHBlY3RlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWFyY2ggZm9yIG9wZXJhdGlvbnMgaW4gdGhlIGxpc3Qgb2Ygb3BlbiBvcGVyYXRpb25zLCBhbmQgcmV0dXJuIGFsbCB0aGF0IG1hdGNoXG4gICAqIHdpdGhvdXQgYXNzZXJ0aW5nIGFueXRoaW5nIGFib3V0IHRoZSBudW1iZXIgb2YgbWF0Y2hlcy5cbiAgICovXG4gIHB1YmxpYyBtYXRjaChtYXRjaDogTWF0Y2hPcGVyYXRpb24pOiBUZXN0T3BlcmF0aW9uW10ge1xuICAgIGNvbnN0IHJlc3VsdHMgPSB0aGlzLl9tYXRjaChtYXRjaCk7XG5cbiAgICByZXN1bHRzLmZvckVhY2goKHJlc3VsdCkgPT4ge1xuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLm9wZW4uaW5kZXhPZihyZXN1bHQpO1xuICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICB0aGlzLm9wZW4uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHBlY3QgdGhhdCBhIHNpbmdsZSBvdXRzdGFuZGluZyByZXF1ZXN0IG1hdGNoZXMgdGhlIGdpdmVuIG1hdGNoZXIsIGFuZCByZXR1cm5cbiAgICogaXQuXG4gICAqXG4gICAqIG9wZXJhdGlvbnMgcmV0dXJuZWQgdGhyb3VnaCB0aGlzIEFQSSB3aWxsIG5vIGxvbmdlciBiZSBpbiB0aGUgbGlzdCBvZiBvcGVuIG9wZXJhdGlvbnMsXG4gICAqIGFuZCB0aHVzIHdpbGwgbm90IG1hdGNoIHR3aWNlLlxuICAgKi9cbiAgcHVibGljIGV4cGVjdE9uZShtYXRjaDogTWF0Y2hPcGVyYXRpb24sIGRlc2NyaXB0aW9uPzogc3RyaW5nKTogVGVzdE9wZXJhdGlvbiB7XG4gICAgZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbiB8fCB0aGlzLmRlc2NyaXB0aW9uRnJvbU1hdGNoZXIobWF0Y2gpO1xuICAgIGNvbnN0IG1hdGNoZXMgPSB0aGlzLm1hdGNoKG1hdGNoKTtcbiAgICBpZiAobWF0Y2hlcy5sZW5ndGggPiAxKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBFeHBlY3RlZCBvbmUgbWF0Y2hpbmcgb3BlcmF0aW9uIGZvciBjcml0ZXJpYSBcIiR7ZGVzY3JpcHRpb259XCIsIGZvdW5kICR7bWF0Y2hlcy5sZW5ndGh9IG9wZXJhdGlvbnMuYCxcbiAgICAgICk7XG4gICAgfVxuICAgIGlmIChtYXRjaGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgRXhwZWN0ZWQgb25lIG1hdGNoaW5nIG9wZXJhdGlvbiBmb3IgY3JpdGVyaWEgXCIke2Rlc2NyaXB0aW9ufVwiLCBmb3VuZCBub25lLmAsXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gbWF0Y2hlc1swXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHBlY3QgdGhhdCBubyBvdXRzdGFuZGluZyBvcGVyYXRpb25zIG1hdGNoIHRoZSBnaXZlbiBtYXRjaGVyLCBhbmQgdGhyb3cgYW4gZXJyb3JcbiAgICogaWYgYW55IGRvLlxuICAgKi9cbiAgcHVibGljIGV4cGVjdE5vbmUobWF0Y2g6IE1hdGNoT3BlcmF0aW9uLCBkZXNjcmlwdGlvbj86IHN0cmluZyk6IHZvaWQge1xuICAgIGRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb24gfHwgdGhpcy5kZXNjcmlwdGlvbkZyb21NYXRjaGVyKG1hdGNoKTtcbiAgICBjb25zdCBtYXRjaGVzID0gdGhpcy5tYXRjaChtYXRjaCk7XG4gICAgaWYgKG1hdGNoZXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgRXhwZWN0ZWQgemVybyBtYXRjaGluZyBvcGVyYXRpb25zIGZvciBjcml0ZXJpYSBcIiR7ZGVzY3JpcHRpb259XCIsIGZvdW5kICR7bWF0Y2hlcy5sZW5ndGh9LmAsXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZSB0aGF0IHRoZXJlIGFyZSBubyBvdXRzdGFuZGluZyBvcGVyYXRpb25zLlxuICAgKi9cbiAgcHVibGljIHZlcmlmeSgpOiB2b2lkIHtcbiAgICBjb25zdCBvcGVuID0gdGhpcy5vcGVuO1xuXG4gICAgaWYgKG9wZW4ubGVuZ3RoID4gMCkge1xuICAgICAgLy8gU2hvdyB0aGUgbWV0aG9kcyBhbmQgVVJMcyBvZiBvcGVuIG9wZXJhdGlvbnMgaW4gdGhlIGVycm9yLCBmb3IgY29udmVuaWVuY2UuXG4gICAgICBjb25zdCBvcGVyYXRpb25zID0gb3BlblxuICAgICAgICAubWFwKCh0ZXN0T3ApID0+IHRlc3RPcC5vcGVyYXRpb24ub3BlcmF0aW9uTmFtZSlcbiAgICAgICAgLmpvaW4oJywgJyk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBFeHBlY3RlZCBubyBvcGVuIG9wZXJhdGlvbnMsIGZvdW5kICR7b3Blbi5sZW5ndGh9OiAke29wZXJhdGlvbnN9YCxcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBpc0RvY3VtZW50Tm9kZShcbiAgICBkb2NPck9wOiBEb2N1bWVudE5vZGUgfCBPcGVyYXRpb24sXG4gICk6IGRvY09yT3AgaXMgRG9jdW1lbnROb2RlIHtcbiAgICByZXR1cm4gIShkb2NPck9wIGFzIE9wZXJhdGlvbikub3BlcmF0aW9uTmFtZTtcbiAgfVxuXG4gIHByaXZhdGUgZGVzY3JpcHRpb25Gcm9tTWF0Y2hlcihtYXRjaGVyOiBNYXRjaE9wZXJhdGlvbik6IHN0cmluZyB7XG4gICAgaWYgKHR5cGVvZiBtYXRjaGVyID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIGBNYXRjaCBvcGVyYXRpb25OYW1lOiAke21hdGNoZXJ9YDtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtYXRjaGVyID09PSAnb2JqZWN0Jykge1xuICAgICAgaWYgKHRoaXMuaXNEb2N1bWVudE5vZGUobWF0Y2hlcikpIHtcbiAgICAgICAgcmV0dXJuIGBNYXRjaCBEb2N1bWVudE5vZGVgO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBuYW1lID0gbWF0Y2hlci5vcGVyYXRpb25OYW1lIHx8ICcoYW55KSc7XG4gICAgICBjb25zdCB2YXJpYWJsZXMgPSBKU09OLnN0cmluZ2lmeShtYXRjaGVyLnZhcmlhYmxlcykgfHwgJyhhbnkpJztcblxuICAgICAgcmV0dXJuIGBNYXRjaCBvcGVyYXRpb246ICR7bmFtZX0sIHZhcmlhYmxlczogJHt2YXJpYWJsZXN9YDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGBNYXRjaCBieSBmdW5jdGlvbjogJHttYXRjaGVyLm5hbWV9YDtcbiAgICB9XG4gIH1cbn1cbiJdfQ==