import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-new-category',
  templateUrl: './add-new-category.component.html',
  styleUrls: ['./add-new-category.component.scss']
})
export class AddNewCategoryComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private dialog: MatDialog) {

  }
  categoryFormGroup: FormGroup

  ngOnInit(): void {
    this.perpareForm()
  }
  submitCategory() {
    console.log(this.categoryFormGroup.value);
  }
  perpareForm() {
    this.categoryFormGroup = this.formBuilder.group({
      category: this.formBuilder.control('', [Validators.required])
    })
  }
  closeDialog() {
    this.dialog.closeAll()
  }
}
