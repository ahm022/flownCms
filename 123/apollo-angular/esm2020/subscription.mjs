import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./apollo";
export class Subscription {
    constructor(apollo) {
        this.apollo = apollo;
        this.client = 'default';
    }
    subscribe(variables, options, extra) {
        return this.apollo.use(this.client).subscribe({
            ...options,
            variables,
            query: this.document,
        }, extra);
    }
}
Subscription.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: Subscription, deps: [{ token: i1.Apollo }], target: i0.ɵɵFactoryTarget.Injectable });
Subscription.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: Subscription });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: Subscription, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.Apollo }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Vic2NyaXB0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N1YnNjcmlwdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDOzs7QUFjekMsTUFBTSxPQUFPLFlBQVk7SUFJdkIsWUFBc0IsTUFBYztRQUFkLFdBQU0sR0FBTixNQUFNLENBQVE7UUFGN0IsV0FBTSxHQUFHLFNBQVMsQ0FBQztJQUVhLENBQUM7SUFFakMsU0FBUyxDQUNkLFNBQWEsRUFDYixPQUF3QyxFQUN4QyxLQUFnQztRQUVoQyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQzNDO1lBQ0UsR0FBRyxPQUFPO1lBQ1YsU0FBUztZQUNULEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUTtTQUNyQixFQUNELEtBQUssQ0FDTixDQUFDO0lBQ0osQ0FBQzs7eUdBbkJVLFlBQVk7NkdBQVosWUFBWTsyRkFBWixZQUFZO2tCQUR4QixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB0eXBlIHtEb2N1bWVudE5vZGV9IGZyb20gJ2dyYXBocWwnO1xuaW1wb3J0IHR5cGUge1R5cGVkRG9jdW1lbnROb2RlfSBmcm9tICdAYXBvbGxvL2NsaWVudC9jb3JlJztcbmltcG9ydCB0eXBlIHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHtBcG9sbG99IGZyb20gJy4vYXBvbGxvJztcbmltcG9ydCB7XG4gIFN1YnNjcmlwdGlvbk9wdGlvbnNBbG9uZSxcbiAgRXh0cmFTdWJzY3JpcHRpb25PcHRpb25zLFxuICBTdWJzY3JpcHRpb25SZXN1bHQsXG4gIEVtcHR5T2JqZWN0LFxufSBmcm9tICcuL3R5cGVzJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFN1YnNjcmlwdGlvbjxUID0gYW55LCBWID0gRW1wdHlPYmplY3Q+IHtcbiAgcHVibGljIHJlYWRvbmx5IGRvY3VtZW50OiBEb2N1bWVudE5vZGUgfCBUeXBlZERvY3VtZW50Tm9kZTxULCBWPjtcbiAgcHVibGljIGNsaWVudCA9ICdkZWZhdWx0JztcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgYXBvbGxvOiBBcG9sbG8pIHt9XG5cbiAgcHVibGljIHN1YnNjcmliZShcbiAgICB2YXJpYWJsZXM/OiBWLFxuICAgIG9wdGlvbnM/OiBTdWJzY3JpcHRpb25PcHRpb25zQWxvbmU8ViwgVD4sXG4gICAgZXh0cmE/OiBFeHRyYVN1YnNjcmlwdGlvbk9wdGlvbnMsXG4gICk6IE9ic2VydmFibGU8U3Vic2NyaXB0aW9uUmVzdWx0PFQ+PiB7XG4gICAgcmV0dXJuIHRoaXMuYXBvbGxvLnVzZSh0aGlzLmNsaWVudCkuc3Vic2NyaWJlPFQsIFY+KFxuICAgICAge1xuICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICB2YXJpYWJsZXMsXG4gICAgICAgIHF1ZXJ5OiB0aGlzLmRvY3VtZW50LFxuICAgICAgfSxcbiAgICAgIGV4dHJhLFxuICAgICk7XG4gIH1cbn1cbiJdfQ==