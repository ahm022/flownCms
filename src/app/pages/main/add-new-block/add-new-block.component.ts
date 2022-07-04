import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { data } from '../../../../../data-config';
import { GeneralService } from 'src/app/services/general.service';
import { MatDialog } from '@angular/material/dialog';
import { SelectMultipleValueComponent } from 'src/app/components/shared/select-multiple-value/select-multiple-value.component';

@Component({
  selector: 'app-add-new-block',
  templateUrl: './add-new-block.component.html',
  styleUrls: ['./add-new-block.component.scss']
})
export class AddNewBlockComponent implements OnInit {

  blockFormGroup: FormGroup
  sortingByOptions = data.sortingByOptions
  sortingOptions = data.sortingOptions
  contentSelectionOptions = data.contentSelectionOptions
  categories = [];
  constructor(private formBuilder: FormBuilder, private generalservice: GeneralService, private dialog: MatDialog) {}
  
  ngOnInit(): void {
    this.prepareForm()
  }
  prepareForm() {
    this.blockFormGroup = this.formBuilder.group({
      pageCount: this.formBuilder.control('', [Validators.required]),
      sortingby: this.formBuilder.control('', [Validators.required]),
      sorting: this.formBuilder.control('', [Validators.required]),
      contentselection: this.formBuilder.control('', [Validators.required]),
    });
  }

  checkByCategory() {
    if(this.blockFormGroup.get('contentselection').value === 'byCategory') {
      return true
    }else{
      this.categories = []
      return false
    }
  }
  openAddCategoryDialog() {
    this.dialog.open(SelectMultipleValueComponent,{
      width: '100%',
      maxWidth: "400px",
      minHeight: "477px",
      data: {
        data: data.Category,
        checkedData: this.categories
      },
    }).afterClosed().subscribe((res)=>{
      this.categories = res
    })
  }

  GetPages() {

  }

  submitBlock() {

  }


}
