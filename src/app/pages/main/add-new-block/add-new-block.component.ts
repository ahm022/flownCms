import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { data } from 'data-config';
import { GeneralService } from 'src/app/services/general.service';
import { MatDialog } from '@angular/material/dialog';
import { SelectMultipleValueComponent } from 'src/app/components/shared/select-multiple-value/select-multiple-value.component';

import { GraphqlService } from 'src/app/services/graphql.service';
import { QueriesService } from 'src/app/services/queries.service';
import { mapSearchLayoutToItem } from "src/app/services/mapping-helper";
import * as _ from "lodash";
import internal from 'stream';

@Component({
  selector: 'app-add-new-block',
  templateUrl: './add-new-block.component.html',
  styleUrls: ['./add-new-block.component.scss']
})
export class AddNewBlockComponent implements OnInit {
  pages: any;
  cursor: any;
  pageSize;
  blockFormGroup: FormGroup
  sortingByOptions = data.sortingByOptions
  sortingOptions = data.sortingOptions
  contentSelectionOptions = data.contentSelectionOptions
  categories =  JSON.parse(localStorage.getItem('categories'));
  selectedCategories
  constructor(private formBuilder: FormBuilder, private generalservice: GeneralService, private dialog: MatDialog,private queries: QueriesService,
    private graphqlService: GraphqlService) {}

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
      this.selectedCategories = []
      return false
    }
  }
  openAddCategoryDialog() {
    this.selectedCategories = []
    this.dialog.open(SelectMultipleValueComponent,{
      width: '100%',
      maxWidth: "400px",
      minHeight: '477px',
      data: {
        data: this.categories,
        checkedData: this.selectedCategories || [],
        dialogTitle: "Select Block Page Categories"
      }
    }).afterClosed().subscribe((res)=>{
      this.selectedCategories = res.checkedData
    })
  }

  getPages() {
    this.pageSize = parseInt(this.blockFormGroup.get('pageCount').value);
    if(this.blockFormGroup.get('sortingby').value === 'byDate') {
      if(this.blockFormGroup.get('sorting').value === 'ascending'){
        this.graphqlService.getGraphQL(this.queries.SearchAscendingPostsByDate,{first:this.pageSize || 10 , categoryId:this.selectedCategories[0] ? this.selectedCategories[0].value : null})
        .then((results) => {
          console.log("results",results)
          this.pages = results;
          
          // this.cursor = results.cmsTemplate2.queries.cmsTemplate2_Users.cursor;
        })
      }else{

      }

    } else if(this.blockFormGroup.get('sortingby').value === 'mostCommented'){
        if(this.blockFormGroup.get('sorting').value === 'ascending'){

      }else{
        
      }
    }

    else{

    }
    

  }

  submitBlock() {

  }


}
