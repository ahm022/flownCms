import { QueriesService } from 'src/app/services/queries.service';
import { GraphqlService } from 'src/app/services/graphql.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { mapCategories } from 'src/app/services/mapping-helper';
import * as _ from "lodash";
@Component({
  selector: 'app-add-new-category',
  templateUrl: './add-new-category.component.html',
  styleUrls: ['./add-new-category.component.scss']
})
export class AddNewCategoryComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private dialog: MatDialog, private graphQlService: GraphqlService, private queries: QueriesService) {

  }
  categoryFormGroup: FormGroup
  loader
  categories
  ngOnInit(): void {
    this.perpareForm()
  }
  submitCategory() {
    this.loader = true
    this.graphQlService.getGraphQL(this.queries.addCategoriesMutation, {label : this.categoryFormGroup.controls['category'].value}).then((results)=>{
      this.getCategories()
    }).finally(()=>{
      setTimeout(() => {
        this.loader = false
        this.closeDialog()
      }, 2000);
    })
  }
  perpareForm() {
    this.categoryFormGroup = this.formBuilder.group({
      category: this.formBuilder.control('', [Validators.required])
    })
  }
  closeDialog() {
    this.dialog.closeAll()
  }
  getCategories() {
    this.graphQlService.getGraphQL(this.queries.getCategoriesQuery).then((results)=>{
      console.log(results);
      this.categories =  _.get(results, "cmsTemplate2.lookups.categories", []).map((x: any) => mapCategories(x));
      localStorage.setItem('categories', JSON.stringify(this.categories))
    })
  }
}
