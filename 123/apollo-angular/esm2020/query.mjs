import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./apollo";
export class Query {
    constructor(apollo) {
        this.apollo = apollo;
        this.client = 'default';
    }
    watch(variables, options) {
        return this.apollo.use(this.client).watchQuery({
            ...options,
            variables,
            query: this.document,
        });
    }
    fetch(variables, options) {
        return this.apollo.use(this.client).query({
            ...options,
            variables,
            query: this.document,
        });
    }
}
Query.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: Query, deps: [{ token: i1.Apollo }], target: i0.ɵɵFactoryTarget.Injectable });
Query.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: Query });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.2", ngImport: i0, type: Query, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.Apollo }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcXVlcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7O0FBVXpDLE1BQU0sT0FBTyxLQUFLO0lBSWhCLFlBQXNCLE1BQWM7UUFBZCxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBRjdCLFdBQU0sR0FBRyxTQUFTLENBQUM7SUFFYSxDQUFDO0lBRWpDLEtBQUssQ0FDVixTQUFhLEVBQ2IsT0FBc0M7UUFFdEMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBVSxDQUFPO1lBQ25ELEdBQUcsT0FBTztZQUNWLFNBQVM7WUFDVCxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVE7U0FDckIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVNLEtBQUssQ0FDVixTQUFhLEVBQ2IsT0FBaUM7UUFFakMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFPO1lBQzlDLEdBQUcsT0FBTztZQUNWLFNBQVM7WUFDVCxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVE7U0FDckIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7a0dBMUJVLEtBQUs7c0dBQUwsS0FBSzsyRkFBTCxLQUFLO2tCQURqQixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB0eXBlIHtEb2N1bWVudE5vZGV9IGZyb20gJ2dyYXBocWwnO1xuaW1wb3J0IHR5cGUge0Fwb2xsb1F1ZXJ5UmVzdWx0LCBUeXBlZERvY3VtZW50Tm9kZX0gZnJvbSAnQGFwb2xsby9jbGllbnQvY29yZSc7XG5pbXBvcnQgdHlwZSB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7QXBvbGxvfSBmcm9tICcuL2Fwb2xsbyc7XG5pbXBvcnQge1F1ZXJ5UmVmfSBmcm9tICcuL3F1ZXJ5LXJlZic7XG5pbXBvcnQge1dhdGNoUXVlcnlPcHRpb25zQWxvbmUsIFF1ZXJ5T3B0aW9uc0Fsb25lLCBFbXB0eU9iamVjdH0gZnJvbSAnLi90eXBlcyc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBRdWVyeTxUID0ge30sIFYgPSBFbXB0eU9iamVjdD4ge1xuICBwdWJsaWMgcmVhZG9ubHkgZG9jdW1lbnQ6IERvY3VtZW50Tm9kZSB8IFR5cGVkRG9jdW1lbnROb2RlPFQsIFY+O1xuICBwdWJsaWMgY2xpZW50ID0gJ2RlZmF1bHQnO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBhcG9sbG86IEFwb2xsbykge31cblxuICBwdWJsaWMgd2F0Y2goXG4gICAgdmFyaWFibGVzPzogVixcbiAgICBvcHRpb25zPzogV2F0Y2hRdWVyeU9wdGlvbnNBbG9uZTxWLCBUPixcbiAgKTogUXVlcnlSZWY8VCwgVj4ge1xuICAgIHJldHVybiB0aGlzLmFwb2xsby51c2UodGhpcy5jbGllbnQpLndhdGNoUXVlcnk8VCwgVj4oe1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIHZhcmlhYmxlcyxcbiAgICAgIHF1ZXJ5OiB0aGlzLmRvY3VtZW50LFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGZldGNoKFxuICAgIHZhcmlhYmxlcz86IFYsXG4gICAgb3B0aW9ucz86IFF1ZXJ5T3B0aW9uc0Fsb25lPFYsIFQ+LFxuICApOiBPYnNlcnZhYmxlPEFwb2xsb1F1ZXJ5UmVzdWx0PFQ+PiB7XG4gICAgcmV0dXJuIHRoaXMuYXBvbGxvLnVzZSh0aGlzLmNsaWVudCkucXVlcnk8VCwgVj4oe1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIHZhcmlhYmxlcyxcbiAgICAgIHF1ZXJ5OiB0aGlzLmRvY3VtZW50LFxuICAgIH0pO1xuICB9XG59XG4iXX0=