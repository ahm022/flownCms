import { Injectable } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {

  constructor(private _liveAnnouncer: LiveAnnouncer, private route: Router) {}
  filteringTable(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  navigateTo(target) {
    this.route.navigate([target]);
  }
  printData(data) {
    if(environment.production) {
      console.log(data);
    }
  }
  printError(message, error) {
    if(environment.production) {
      console.error(message, error);
    }
  }

}
