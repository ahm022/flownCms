import { Component, OnInit, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-select-multiple-value',
  templateUrl: './select-multiple-value.component.html',
  styleUrls: ['./select-multiple-value.component.scss'],
})
export class SelectMultipleValueComponent implements OnInit {
  items = [];
  searchItems = [];
  selectedItems = [];
  daialogTitle:string
  debounce: any
  emptyItems = false
  constructor(
    private dialog: MatDialogRef<SelectMultipleValueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialog.disableClose = true;
  }

  ngOnInit(): void {
    this.prepareDialogValues()
  }


  prepareDialogValues() {
    this.items = JSON.parse(JSON.stringify(this.data.data))
    this.daialogTitle = this.data.dialogTitle
    this.selectedItems = this.data.checkedData
  }

  addValue(e, name) {
    if (e.target.checked) {
      this.selectedItems.push({name:name, ischecked:true});
    } else {
      this.selectedItems = this.selectedItems.filter((res) => res.name != name);
    }
  }


  closeDialog() {
    this.data = {
      checkedData : this.selectedItems,
    };
    this.dialog.close(this.data);
  }
}
