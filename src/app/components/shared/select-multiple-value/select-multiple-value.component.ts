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
    console.log(this.items);
  }


  prepareDialogValues() {
    this.items = JSON.parse(JSON.stringify(this.data.data))
    this.searchItems = JSON.parse(JSON.stringify(this.items))
    this.daialogTitle = this.data.dialogTitle
    this.sortedCheckedBox()
    this.selectedItems = this.data.checkedData
  }

  addValue(e, name) {
    if (e.target.checked) {
      this.selectedItems.push({name:name, ischecked:true});
      this.items.find((e)=> e.name === name ? e.ischecked = true : '')
      this.searchItems.find((e)=> e.name === name ? e.ischecked = true : '')
    } else {
      this.selectedItems = this.selectedItems.filter((res) => res.name != name);
      this.items.find((e)=> e.name === name ? e.ischecked = false : '')
      this.searchItems.find((e)=> e.name === name ? e.ischecked = false : '')
    }
  }

  // check the checked value after reopen dialog
  sortedCheckedBox() {
    this.items = this.items.sort((x, y) => Number(y.ischecked) - Number(x.ischecked))
  }

  closeDialog() {
    this.data = {
      checkedData : this.selectedItems,
      items: this.items
    };
    this.dialog.close(this.data);
  }
  searchItem(e) {
    this.emptyItems=false
    this.items = this.searchItems 
    this.sortedCheckedBox()
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
