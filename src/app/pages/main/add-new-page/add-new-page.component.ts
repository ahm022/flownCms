import { QueriesService } from './../../../services/queries.service';
import { GraphqlService } from './../../../services/graphql.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { data } from 'data-config';
import { GeneralService } from 'src/app/services/general.service';
import { MatDialog } from '@angular/material/dialog';
import { SelectMultipleValueComponent } from 'src/app/components/shared/select-multiple-value/select-multiple-value.component';
import { validate } from 'graphql';

@Component({
  selector: 'app-add-new-page',
  templateUrl: './add-new-page.component.html',
  styleUrls: ['./add-new-page.component.scss'],
})
export class AddNewPageComponent implements OnInit {
  pageFormGroup: FormGroup;
  selectedImage;
  loader= false;
  postImage;
  // selectedCategories;
  categories = data.Category;

  // Status page options
  statusPageOptions = data.statusPageOptions;

  // Gated page options
  gatedPageOptions = data.gatedPageOptions;

  validationErrorMessages = {
    postTitle: [{ type: 'required', message: 'Page title is required' }],
    permalink: [{ type: 'required', message: 'Permalink is required' },{type: 'pattern', message: 'Please provide valid url'}],
    slug: [{ type: 'required', message: 'Slug is required' }],
    paragraph: [{ type: 'required', message: 'paragraph is required' }],
  };
  constructor(private formBuilder: FormBuilder, private generalservice: GeneralService, private dialog: MatDialog, private graphqlService: GraphqlService, private queries: QueriesService ) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  submitPage() {
    this.loader = true
    this.graphqlService.getGraphQL(this.queries.createPageMutation, {pageInfo: this.pageFormGroup.value}).then((res)=>{
      this.loader = false
      this.generalservice.navigateTo('/dashboard/pages')
    })
  }
  prepareForm() {
    this.pageFormGroup = this.formBuilder.group({
      postTitle: this.formBuilder.control('', [Validators.required]),
      permaLink: this.formBuilder.control('', [Validators.required, Validators.pattern('(www)\\.([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]),
      slug: this.formBuilder.control('', [Validators.required]),
      // pagestatus: this.formBuilder.control('', [Validators.required]),
      category: this.formBuilder.control('', Validators.required),
      gated: this.formBuilder.control('', [Validators.required]),
      postDesrcription: this.formBuilder.control('', [Validators.required]),
      // fileSource: [null],
    });
  }
  getImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => (this.selectedImage = reader.result);

      reader.readAsDataURL(file);
      this.postImage = file
    }
  }

  // openAddCategoryDialog() {
  //   this.selectedCategories = []
  //   this.dialog.open(SelectMultipleValueComponent,{
  //     width: '100%',
  //     maxWidth: "400px",
  //     minHeight: '477px',
  //     data: {
  //       data: this.categories,
  //       checkedData: this.selectedCategories || [],
  //       dialogTitle: "Select Page Categories"
  //     }
  //   }).afterClosed().subscribe((res)=>{
  //     this.selectedCategories = res.checkedData
  //   })
  // }
}
