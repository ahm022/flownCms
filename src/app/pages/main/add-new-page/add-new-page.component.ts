import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { data } from 'data-config';
import { GeneralService } from 'src/app/services/general.service';
import { MatDialog } from '@angular/material/dialog';
import { SelectMultipleValueComponent } from 'src/app/components/shared/select-multiple-value/select-multiple-value.component';

@Component({
  selector: 'app-add-new-page',
  templateUrl: './add-new-page.component.html',
  styleUrls: ['./add-new-page.component.scss'],
})
export class AddNewPageComponent implements OnInit {
  pageFormGroup: FormGroup;
  selectedImage;
  selectedCategories;
  categories = data.Category;

  // Status page options
  statusPageOptions = data.statusPageOptions;

  // Gated page options
  gatedPageOptions = data.gatedPageOptions;

  validationErrorMessages = {
    pagetitle: [{ type: 'required', message: 'Page title is required' }],
    permalink: [{ type: 'required', message: 'Permalink is required' }],
    slug: [{ type: 'required', message: 'Slug is required' }],
    paragraph: [{ type: 'required', message: 'paragraph is required' }],
  };
  constructor(private formBuilder: FormBuilder, private generalservice: GeneralService, private dialog: MatDialog) {}
  
  ngOnInit(): void {
    this.prepareForm();
  }
  submitPage() {
    console.log(this.pageFormGroup.value);
    this.generalservice.navigateTo('/dashboard/pages')
  }
  prepareForm() {
    this.pageFormGroup = this.formBuilder.group({
      pageTitle: this.formBuilder.control('', [Validators.required]),
      permalink: this.formBuilder.control('', [Validators.required]),
      slug: this.formBuilder.control('', [Validators.required]),
      pagestatus: this.formBuilder.control('', [Validators.required]),
      gated: this.formBuilder.control('', [Validators.required]),
      paragraph: this.formBuilder.control('', [Validators.required]),
      pagethumbnail: this.formBuilder.control(''),
      fileSource: [null],
    });
  }
  getImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => (this.selectedImage = reader.result);

      reader.readAsDataURL(file);
      this.pageFormGroup.patchValue({
        fileSource: file,
      });
    }
  }

  openAddCategoryDialog() {
    this.dialog.open(SelectMultipleValueComponent,{
      width: '100%',
      maxWidth: "400px",
      minHeight: '477px',
      data: {
        data: this.categories,
        checkedData: this.selectedCategories || [],
        dialogTitle: "Select Page Categories"
      }
    }).afterClosed().subscribe((res)=>{
      this.selectedCategories = res.checkedData
      this.categories = res.items
    })
  }
}
