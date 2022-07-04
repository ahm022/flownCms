import { Component, OnInit, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-select-multiple-value',
  templateUrl: './select-multiple-value.component.html',
  styleUrls: ['./select-multiple-value.component.scss'],
})
export class SelectMultipleValueComponent implements OnInit {
  items = [];
  selectedItems = [];
  debounce: any
  emptyItems = false
  constructor( 
    private dialog: MatDialogRef<SelectMultipleValueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialog.disableClose = true;
  }
// dialog
  ngOnInit(): void {
    this.items = this.data.data;
    this.checkValue()
    this.selectedItems = this.data.checkedData
  }
  addValue(e, name) {
    if (e.target.checked) {
      this.selectedItems.push({name:name, ischecked:true});

    } else {
      this.selectedItems = this.selectedItems.filter((res) => res.name != name);
    }
  }

  // check the checked value after reopen dialog
  checkValue() {
    this.items = [...this.items, ...this.data.checkedData]
    this.items = [...new Map(this.items.map(item => [item.name, item])).values()]
    this.items = this.items.sort((x, y) => Number(y.ischecked) - Number(x.ischecked))
  }

  closeDialog() {
    this.data = this.selectedItems;
    this.dialog.close(this.data);
  }
  searchItems(e) {
    this.emptyItems = false
    this.items = this.data.data
    this.checkValue()
    clearTimeout(this.debounce);
    this.debounce = setTimeout(() => {
      if(e.target.value.length > 0) {
        this.items= this.items.filter(o => o.name.includes(e.target.value))
        if (this.items.length === 0) {
          this.emptyItems = true
        }
      }
    }, 500);
  }
}
