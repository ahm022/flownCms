import { Injectable, Optional, Inject } from '@angular/core';
import { ApolloClient } from '@apollo/client/core';
import { from } from 'rxjs';
import { QueryRef } from './query-ref';
import { APOLLO_OPTIONS, APOLLO_NAMED_OPTIONS, APOLLO_FLAGS } from './tokens';
import { fromPromise, useMutationLoading, wrapWithZone, fixObservable, pickFlag, } from './utils';
import * as i0 from "@angular/core";
export class ApolloBase {
    constructor(ngZone, flags, _client) {
        this.ngZone = ngZone;
        this.flags = flags;
        this._client = _client;
        this.useInitialLoading = pickFlag(flags, 'useInitialLoading', false);
        this.useMutationLoading = pickFlag(flags, 'useMutationLoading', false);
    }
    watchQuery(options) {
        return new QueryRef(this.ensureClient().watchQuery({
            ...options,
        }), this.ngZone, {
            useInitialLoading: this.useInitialLoading,
            ...options,
        });
    }
    query(options) {
        return fromPromise(() => this.ensureClient().query({ ...options }));
    }
    mutate(options) {
        return useMutationLoading(fromPromise(() => this.ensureClient().mutate({ ...options })), options.useMutationLoading ?? this.useMutationLoading);
    }
    subscribe(options, extra) {
        const obs = from(fixObservable(this.ensureClient().subscribe({ ...options })));
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
export class Apollo extends ApolloBase {
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
        }], ctorParameters: function () { return [{ type: i0.NgZone }, { type: undefined, decorators: [{
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
                }] }]; } });
function isDefault(name) {
    return !name || name === 'default';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBvbGxvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Fwb2xsby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQVMsTUFBTSxlQUFlLENBQUM7QUFTbkUsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ2pELE9BQU8sRUFBYSxJQUFJLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFFdEMsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQVVyQyxPQUFPLEVBQUMsY0FBYyxFQUFFLG9CQUFvQixFQUFFLFlBQVksRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUM1RSxPQUFPLEVBQ0wsV0FBVyxFQUNYLGtCQUFrQixFQUNsQixZQUFZLEVBQ1osYUFBYSxFQUNiLFFBQVEsR0FDVCxNQUFNLFNBQVMsQ0FBQzs7QUFFakIsTUFBTSxPQUFPLFVBQVU7SUFJckIsWUFDWSxNQUFjLEVBQ2QsS0FBYSxFQUNiLE9BQW1DO1FBRm5DLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQ2IsWUFBTyxHQUFQLE9BQU8sQ0FBNEI7UUFFN0MsSUFBSSxDQUFDLGlCQUFpQixHQUFHLFFBQVEsQ0FBQyxLQUFLLEVBQUUsbUJBQW1CLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDckUsSUFBSSxDQUFDLGtCQUFrQixHQUFHLFFBQVEsQ0FBQyxLQUFLLEVBQUUsb0JBQW9CLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVNLFVBQVUsQ0FDZixPQUE2QztRQUU3QyxPQUFPLElBQUksUUFBUSxDQUNqQixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsVUFBVSxDQUFvQjtZQUNoRCxHQUFHLE9BQU87U0FDWCxDQUF1QyxFQUN4QyxJQUFJLENBQUMsTUFBTSxFQUNYO1lBQ0UsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLGlC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T0FHRztJQUNJLFlBQVksQ0FBQyxJQUFhO1FBQy9CLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ25CLElBQUksQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDO1NBQzFCO2FBQU07WUFDTCxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN2QjtJQUNILENBQUM7O21HQWhIVSxNQUFNLHdDQVNQLGNBQWMsNkJBR2Qsb0JBQW9CLDZCQUVSLFlBQVk7dUdBZHZCLE1BQU07MkZBQU4sTUFBTTtrQkFEbEIsVUFBVTs7MEJBU04sUUFBUTs7MEJBQ1IsTUFBTTsyQkFBQyxjQUFjOzswQkFFckIsUUFBUTs7MEJBQ1IsTUFBTTsyQkFBQyxvQkFBb0I7OzBCQUUzQixRQUFROzswQkFBSSxNQUFNOzJCQUFDLFlBQVk7O0FBcUdwQyxTQUFTLFNBQVMsQ0FBQyxJQUFhO0lBQzlCLE9BQU8sQ0FBQyxJQUFJLElBQUksSUFBSSxLQUFLLFNBQVMsQ0FBQztBQUNyQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlLCBPcHRpb25hbCwgSW5qZWN0LCBOZ1pvbmV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHR5cGUge1xuICBRdWVyeU9wdGlvbnMsXG4gIEFwb2xsb1F1ZXJ5UmVzdWx0LFxuICBTdWJzY3JpcHRpb25PcHRpb25zLFxuICBBcG9sbG9DbGllbnRPcHRpb25zLFxuICBPYnNlcnZhYmxlUXVlcnksXG4gIEZldGNoUmVzdWx0LFxufSBmcm9tICdAYXBvbGxvL2NsaWVudC9jb3JlJztcbmltcG9ydCB7QXBvbGxvQ2xpZW50fSBmcm9tICdAYXBvbGxvL2NsaWVudC9jb3JlJztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgZnJvbX0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7UXVlcnlSZWZ9IGZyb20gJy4vcXVlcnktcmVmJztcbmltcG9ydCB7XG4gIFdhdGNoUXVlcnlPcHRpb25zLFxuICBFeHRyYVN1YnNjcmlwdGlvbk9wdGlvbnMsXG4gIEVtcHR5T2JqZWN0LFxuICBOYW1lZE9wdGlvbnMsXG4gIEZsYWdzLFxuICBNdXRhdGlvblJlc3VsdCxcbiAgTXV0YXRpb25PcHRpb25zLFxufSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7QVBPTExPX09QVElPTlMsIEFQT0xMT19OQU1FRF9PUFRJT05TLCBBUE9MTE9fRkxBR1N9IGZyb20gJy4vdG9rZW5zJztcbmltcG9ydCB7XG4gIGZyb21Qcm9taXNlLFxuICB1c2VNdXRhdGlvbkxvYWRpbmcsXG4gIHdyYXBXaXRoWm9uZSxcbiAgZml4T2JzZXJ2YWJsZSxcbiAgcGlja0ZsYWcsXG59IGZyb20gJy4vdXRpbHMnO1xuXG5leHBvcnQgY2xhc3MgQXBvbGxvQmFzZTxUQ2FjaGVTaGFwZSA9IGFueT4ge1xuICBwcml2YXRlIHVzZUluaXRpYWxMb2FkaW5nOiBib29sZWFuO1xuICBwcml2YXRlIHVzZU11dGF0aW9uTG9hZGluZzogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgbmdab25lOiBOZ1pvbmUsXG4gICAgcHJvdGVjdGVkIGZsYWdzPzogRmxhZ3MsXG4gICAgcHJvdGVjdGVkIF9jbGllbnQ/OiBBcG9sbG9DbGllbnQ8VENhY2hlU2hhcGU+LFxuICApIHtcbiAgICB0aGlzLnVzZUluaXRpYWxMb2FkaW5nID0gcGlja0ZsYWcoZmxhZ3MsICd1c2VJbml0aWFsTG9hZGluZycsIGZhbHNlKTtcbiAgICB0aGlzLnVzZU11dGF0aW9uTG9hZGluZyA9IHBpY2tGbGFnKGZsYWdzLCAndXNlTXV0YXRpb25Mb2FkaW5nJywgZmFsc2UpO1xuICB9XG5cbiAgcHVibGljIHdhdGNoUXVlcnk8VERhdGEsIFRWYXJpYWJsZXMgPSBFbXB0eU9iamVjdD4oXG4gICAgb3B0aW9uczogV2F0Y2hRdWVyeU9wdGlvbnM8VFZhcmlhYmxlcywgVERhdGE+LFxuICApOiBRdWVyeVJlZjxURGF0YSwgVFZhcmlhYmxlcz4ge1xuICAgIHJldHVybiBuZXcgUXVlcnlSZWY8VERhdGEsIFRWYXJpYWJsZXM+KFxuICAgICAgdGhpcy5lbnN1cmVDbGllbnQoKS53YXRjaFF1ZXJ5PFREYXRhLCBUVmFyaWFibGVzPih7XG4gICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICB9KSBhcyBPYnNlcnZhYmxlUXVlcnk8VERhdGEsIFRWYXJpYWJsZXM+LFxuICAgICAgdGhpcy5uZ1pvbmUsXG4gICAgICB7XG4gICAgICAgIHVzZUluaXRpYWxMb2FkaW5nOiB0aGlzLnVzZUluaXRpYWxMb2FkaW5nLFxuICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgfSxcbiAgICApO1xuICB9XG5cbiAgcHVibGljIHF1ZXJ5PFQsIFYgPSBFbXB0eU9iamVjdD4oXG4gICAgb3B0aW9uczogUXVlcnlPcHRpb25zPFYsIFQ+LFxuICApOiBPYnNlcnZhYmxlPEFwb2xsb1F1ZXJ5UmVzdWx0PFQ+PiB7XG4gICAgcmV0dXJuIGZyb21Qcm9taXNlPEFwb2xsb1F1ZXJ5UmVzdWx0PFQ+PigoKSA9PlxuICAgICAgdGhpcy5lbnN1cmVDbGllbnQoKS5xdWVyeTxULCBWPih7Li4ub3B0aW9uc30pLFxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgbXV0YXRlPFQsIFYgPSBFbXB0eU9iamVjdD4oXG4gICAgb3B0aW9uczogTXV0YXRpb25PcHRpb25zPFQsIFY+LFxuICApOiBPYnNlcnZhYmxlPE11dGF0aW9uUmVzdWx0PFQ+PiB7XG4gICAgcmV0dXJuIHVzZU11dGF0aW9uTG9hZGluZyhcbiAgICAgIGZyb21Qcm9taXNlKCgpID0+IHRoaXMuZW5zdXJlQ2xpZW50KCkubXV0YXRlPFQsIFY+KHsuLi5vcHRpb25zfSkpLFxuICAgICAgb3B0aW9ucy51c2VNdXRhdGlvbkxvYWRpbmcgPz8gdGhpcy51c2VNdXRhdGlvbkxvYWRpbmcsXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBzdWJzY3JpYmU8VCwgViA9IEVtcHR5T2JqZWN0PihcbiAgICBvcHRpb25zOiBTdWJzY3JpcHRpb25PcHRpb25zPFYsIFQ+LFxuICAgIGV4dHJhPzogRXh0cmFTdWJzY3JpcHRpb25PcHRpb25zLFxuICApOiBPYnNlcnZhYmxlPEZldGNoUmVzdWx0PFQ+PiB7XG4gICAgY29uc3Qgb2JzID0gZnJvbShcbiAgICAgIGZpeE9ic2VydmFibGUodGhpcy5lbnN1cmVDbGllbnQoKS5zdWJzY3JpYmU8VCwgVj4oey4uLm9wdGlvbnN9KSksXG4gICAgKTtcblxuICAgIHJldHVybiBleHRyYSAmJiBleHRyYS51c2Vab25lICE9PSB0cnVlXG4gICAgICA/IG9ic1xuICAgICAgOiB3cmFwV2l0aFpvbmUob2JzLCB0aGlzLm5nWm9uZSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGFuIGFjY2VzcyB0byBhbiBpbnN0YW5jZSBvZiBBcG9sbG9DbGllbnRcbiAgICogQGRlcHJlY2F0ZWQgdXNlIGBhcG9sbG8uY2xpZW50YCBpbnN0ZWFkXG4gICAqL1xuICBwdWJsaWMgZ2V0Q2xpZW50KCkge1xuICAgIHJldHVybiB0aGlzLmNsaWVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgYSBuZXcgaW5zdGFuY2Ugb2YgQXBvbGxvQ2xpZW50XG4gICAqIFJlbWVtYmVyIHRvIGNsZWFuIHVwIHRoZSBzdG9yZSBiZWZvcmUgc2V0dGluZyBhIG5ldyBjbGllbnQuXG4gICAqIEBkZXByZWNhdGVkIHVzZSBgYXBvbGxvLmNsaWVudCA9IGNsaWVudGAgaW5zdGVhZFxuICAgKlxuICAgKiBAcGFyYW0gY2xpZW50IEFwb2xsb0NsaWVudCBpbnN0YW5jZVxuICAgKi9cbiAgcHVibGljIHNldENsaWVudChjbGllbnQ6IEFwb2xsb0NsaWVudDxUQ2FjaGVTaGFwZT4pIHtcbiAgICB0aGlzLmNsaWVudCA9IGNsaWVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYW4gYWNjZXNzIHRvIGFuIGluc3RhbmNlIG9mIEFwb2xsb0NsaWVudFxuICAgKi9cbiAgcHVibGljIGdldCBjbGllbnQoKTogQXBvbGxvQ2xpZW50PFRDYWNoZVNoYXBlPiB7XG4gICAgcmV0dXJuIHRoaXMuX2NsaWVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgYSBuZXcgaW5zdGFuY2Ugb2YgQXBvbGxvQ2xpZW50XG4gICAqIFJlbWVtYmVyIHRvIGNsZWFuIHVwIHRoZSBzdG9yZSBiZWZvcmUgc2V0dGluZyBhIG5ldyBjbGllbnQuXG4gICAqXG4gICAqIEBwYXJhbSBjbGllbnQgQXBvbGxvQ2xpZW50IGluc3RhbmNlXG4gICAqL1xuICBwdWJsaWMgc2V0IGNsaWVudChjbGllbnQ6IEFwb2xsb0NsaWVudDxUQ2FjaGVTaGFwZT4pIHtcbiAgICBpZiAodGhpcy5fY2xpZW50KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NsaWVudCBoYXMgYmVlbiBhbHJlYWR5IGRlZmluZWQnKTtcbiAgICB9XG5cbiAgICB0aGlzLl9jbGllbnQgPSBjbGllbnQ7XG4gIH1cblxuICBwcml2YXRlIGVuc3VyZUNsaWVudCgpIHtcbiAgICB0aGlzLmNoZWNrSW5zdGFuY2UoKTtcblxuICAgIHJldHVybiB0aGlzLl9jbGllbnQ7XG4gIH1cblxuICBwcml2YXRlIGNoZWNrSW5zdGFuY2UoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9jbGllbnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2xpZW50IGhhcyBub3QgYmVlbiBkZWZpbmVkIHlldCcpO1xuICAgIH1cbiAgfVxufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQXBvbGxvIGV4dGVuZHMgQXBvbGxvQmFzZTxhbnk+IHtcbiAgcHJpdmF0ZSBtYXA6IE1hcDxzdHJpbmcsIEFwb2xsb0Jhc2U8YW55Pj4gPSBuZXcgTWFwPFxuICAgIHN0cmluZyxcbiAgICBBcG9sbG9CYXNlPGFueT5cbiAgPigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChBUE9MTE9fT1BUSU9OUylcbiAgICBhcG9sbG9PcHRpb25zPzogQXBvbGxvQ2xpZW50T3B0aW9uczxhbnk+LFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChBUE9MTE9fTkFNRURfT1BUSU9OUylcbiAgICBhcG9sbG9OYW1lZE9wdGlvbnM/OiBOYW1lZE9wdGlvbnMsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChBUE9MTE9fRkxBR1MpIGZsYWdzPzogRmxhZ3MsXG4gICkge1xuICAgIHN1cGVyKF9uZ1pvbmUsIGZsYWdzKTtcblxuICAgIGlmIChhcG9sbG9PcHRpb25zKSB7XG4gICAgICB0aGlzLmNyZWF0ZURlZmF1bHQoYXBvbGxvT3B0aW9ucyk7XG4gICAgfVxuXG4gICAgaWYgKGFwb2xsb05hbWVkT3B0aW9ucyAmJiB0eXBlb2YgYXBvbGxvTmFtZWRPcHRpb25zID09PSAnb2JqZWN0Jykge1xuICAgICAgZm9yIChsZXQgbmFtZSBpbiBhcG9sbG9OYW1lZE9wdGlvbnMpIHtcbiAgICAgICAgaWYgKGFwb2xsb05hbWVkT3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSBhcG9sbG9OYW1lZE9wdGlvbnNbbmFtZV07XG4gICAgICAgICAgdGhpcy5jcmVhdGVOYW1lZChuYW1lLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW4gaW5zdGFuY2Ugb2YgQXBvbGxvQ2xpZW50XG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgcmVxdWlyZWQgdG8gY3JlYXRlIEFwb2xsb0NsaWVudFxuICAgKiBAcGFyYW0gbmFtZSBjbGllbnQncyBuYW1lXG4gICAqL1xuICBwdWJsaWMgY3JlYXRlPFRDYWNoZVNoYXBlPihcbiAgICBvcHRpb25zOiBBcG9sbG9DbGllbnRPcHRpb25zPFRDYWNoZVNoYXBlPixcbiAgICBuYW1lPzogc3RyaW5nLFxuICApOiB2b2lkIHtcbiAgICBpZiAoaXNEZWZhdWx0KG5hbWUpKSB7XG4gICAgICB0aGlzLmNyZWF0ZURlZmF1bHQ8VENhY2hlU2hhcGU+KG9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNyZWF0ZU5hbWVkPFRDYWNoZVNoYXBlPihuYW1lLCBvcHRpb25zKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXNlIGEgZGVmYXVsdCBBcG9sbG9DbGllbnRcbiAgICovXG4gIHB1YmxpYyBkZWZhdWx0KCk6IEFwb2xsb0Jhc2U8YW55PiB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogVXNlIGEgbmFtZWQgQXBvbGxvQ2xpZW50XG4gICAqIEBwYXJhbSBuYW1lIGNsaWVudCdzIG5hbWVcbiAgICovXG4gIHB1YmxpYyB1c2UobmFtZTogc3RyaW5nKTogQXBvbGxvQmFzZTxhbnk+IHtcbiAgICBpZiAoaXNEZWZhdWx0KG5hbWUpKSB7XG4gICAgICByZXR1cm4gdGhpcy5kZWZhdWx0KCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLm1hcC5nZXQobmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgZGVmYXVsdCBBcG9sbG9DbGllbnQsIHNhbWUgYXMgYGFwb2xsby5jcmVhdGUob3B0aW9ucylgXG4gICAqIEBwYXJhbSBvcHRpb25zIEFwb2xsb0NsaWVudCdzIG9wdGlvbnNcbiAgICovXG4gIHB1YmxpYyBjcmVhdGVEZWZhdWx0PFRDYWNoZVNoYXBlPihcbiAgICBvcHRpb25zOiBBcG9sbG9DbGllbnRPcHRpb25zPFRDYWNoZVNoYXBlPixcbiAgKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZ2V0Q2xpZW50KCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQXBvbGxvIGhhcyBiZWVuIGFscmVhZHkgY3JlYXRlZC4nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zZXRDbGllbnQobmV3IEFwb2xsb0NsaWVudDxUQ2FjaGVTaGFwZT4ob3B0aW9ucykpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5hbWVkIEFwb2xsb0NsaWVudCwgc2FtZSBhcyBgYXBvbGxvLmNyZWF0ZShvcHRpb25zLCBuYW1lKWBcbiAgICogQHBhcmFtIG5hbWUgY2xpZW50J3MgbmFtZVxuICAgKiBAcGFyYW0gb3B0aW9ucyBBcG9sbG9DbGllbnQncyBvcHRpb25zXG4gICAqL1xuICBwdWJsaWMgY3JlYXRlTmFtZWQ8VENhY2hlU2hhcGU+KFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICBvcHRpb25zOiBBcG9sbG9DbGllbnRPcHRpb25zPFRDYWNoZVNoYXBlPixcbiAgKTogdm9pZCB7XG4gICAgaWYgKHRoaXMubWFwLmhhcyhuYW1lKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDbGllbnQgJHtuYW1lfSBoYXMgYmVlbiBhbHJlYWR5IGNyZWF0ZWRgKTtcbiAgICB9XG4gICAgdGhpcy5tYXAuc2V0KFxuICAgICAgbmFtZSxcbiAgICAgIG5ldyBBcG9sbG9CYXNlKFxuICAgICAgICB0aGlzLl9uZ1pvbmUsXG4gICAgICAgIHRoaXMuZmxhZ3MsXG4gICAgICAgIG5ldyBBcG9sbG9DbGllbnQ8VENhY2hlU2hhcGU+KG9wdGlvbnMpLFxuICAgICAgKSxcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbWVtYmVyIHRvIGNsZWFuIHVwIHRoZSBzdG9yZSBiZWZvcmUgcmVtb3ZpbmcgYSBjbGllbnRcbiAgICogQHBhcmFtIG5hbWUgY2xpZW50J3MgbmFtZVxuICAgKi9cbiAgcHVibGljIHJlbW92ZUNsaWVudChuYW1lPzogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKGlzRGVmYXVsdChuYW1lKSkge1xuICAgICAgdGhpcy5fY2xpZW50ID0gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1hcC5kZWxldGUobmFtZSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGlzRGVmYXVsdChuYW1lPzogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiAhbmFtZSB8fCBuYW1lID09PSAnZGVmYXVsdCc7XG59XG4iXX0=