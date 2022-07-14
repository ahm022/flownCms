import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./apollo";
export class Mutation {
    constructor(apollo) {
        this.apollo = apollo;
        this.client = 'default';
    }
    mutate(variables, options) {
        return this.apollo.use(this.client).mutate({
            ...options,
            variables,
            mutation: this.document,
        });
    }
}
Mutation.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: Mutation, deps: [{ token: i1.Apollo }], target: i0.ɵɵFactoryTarget.Injectable });
Mutation.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: Mutation });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: Mutation, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.Apollo }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXV0YXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbXV0YXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7O0FBUXpDLE1BQU0sT0FBTyxRQUFRO0lBSW5CLFlBQXNCLE1BQWM7UUFBZCxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBRjdCLFdBQU0sR0FBRyxTQUFTLENBQUM7SUFFYSxDQUFDO0lBRWpDLE1BQU0sQ0FBQyxTQUFhLEVBQUUsT0FBb0M7UUFDL0QsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFPO1lBQy9DLEdBQUcsT0FBTztZQUNWLFNBQVM7WUFDVCxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7U0FDeEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7cUdBWlUsUUFBUTt5R0FBUixRQUFROzJGQUFSLFFBQVE7a0JBRHBCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHR5cGUge0RvY3VtZW50Tm9kZX0gZnJvbSAnZ3JhcGhxbCc7XG5pbXBvcnQgdHlwZSB7VHlwZWREb2N1bWVudE5vZGV9IGZyb20gJ0BhcG9sbG8vY2xpZW50L2NvcmUnO1xuXG5pbXBvcnQge0Fwb2xsb30gZnJvbSAnLi9hcG9sbG8nO1xuaW1wb3J0IHtNdXRhdGlvbk9wdGlvbnNBbG9uZSwgRW1wdHlPYmplY3R9IGZyb20gJy4vdHlwZXMnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTXV0YXRpb248VCA9IHt9LCBWID0gRW1wdHlPYmplY3Q+IHtcbiAgcHVibGljIHJlYWRvbmx5IGRvY3VtZW50OiBEb2N1bWVudE5vZGUgfCBUeXBlZERvY3VtZW50Tm9kZTxULCBWPjtcbiAgcHVibGljIGNsaWVudCA9ICdkZWZhdWx0JztcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgYXBvbGxvOiBBcG9sbG8pIHt9XG5cbiAgcHVibGljIG11dGF0ZSh2YXJpYWJsZXM/OiBWLCBvcHRpb25zPzogTXV0YXRpb25PcHRpb25zQWxvbmU8VCwgVj4pIHtcbiAgICByZXR1cm4gdGhpcy5hcG9sbG8udXNlKHRoaXMuY2xpZW50KS5tdXRhdGU8VCwgVj4oe1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIHZhcmlhYmxlcyxcbiAgICAgIG11dGF0aW9uOiB0aGlzLmRvY3VtZW50LFxuICAgIH0pO1xuICB9XG59XG4iXX0=