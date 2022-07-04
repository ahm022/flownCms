import { Injectable } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Router } from '@angular/router';

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
  // getSelectedImage(event, formGroupName) {
  //   if (event.target.files.length > 0) {
  //     const file = event.target.files[0];
  //     const reader = new FileReader();
  //     reader.onloadend = (e) => (this.selectedImage = reader.result);
  //     reader.readAsDataURL(file);
  //     formGroupName.patchValue({
  //       fileSource: file,
  //     });
  //   }
  // }

}
