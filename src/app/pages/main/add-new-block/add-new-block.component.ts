import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { data } from 'data-config';
import { GeneralService } from 'src/app/services/general.service';
import { MatDialog } from '@angular/material/dialog';
import { SelectMultipleValueComponent } from 'src/app/components/shared/select-multiple-value/select-multiple-value.component';

import { GraphqlService } from 'src/app/services/graphql.service';
import { QueriesService } from 'src/app/services/queries.service';
import { mapPagesToItem } from "src/app/services/mapping-helper";
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
  loader= false;
  sortingByOptions = data.sortingByOptions
  layoutId = localStorage.getItem('cms_user_Layout_id')
  sortingOptions = data.sortingOptions
  contentSelectionOptions = data.contentSelectionOptions
  categories =  JSON.parse(localStorage.getItem('categories'));
  selectedItems = [];
  pagesData=[];
  selectedCategories
  constructor(private formBuilder: FormBuilder, private generalservice: GeneralService, private dialog: MatDialog,private queries: QueriesService,
    private graphqlService: GraphqlService) {}

  ngOnInit(): void {
    this.prepareForm()
  }
  prepareForm() {
    this.blockFormGroup = this.formBuilder.group({
      pageCount: this.formBuilder.control( null, [Validators.required]),
      sortingBy: this.formBuilder.control('', [Validators.required]),
      sorting: this.formBuilder.control('', [Validators.required]),
      contentSelection: this.formBuilder.control('', [Validators.required]),
    });
  }
  

  checkByCategory() {
    if(this.blockFormGroup.get('contentSelection').value === 'BY_CATEGORY') {
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
    this.loader = true;
    this.pageSize = parseInt(this.blockFormGroup.get('pageCount').value);
    if(this.blockFormGroup.get('sorting').value === 'BY_DATE') {
      if(this.blockFormGroup.get('sortingBy').value === 'ASCENDING'){
        this.graphqlService.getGraphQL(this.queries.SearchAscendingPostsByDate,{first:this.pageSize || 10 , categoryId:this.selectedCategories[0] ? this.selectedCategories[0].value : null})
        .then((results) => {
          this.pages =  _.get(results, "cmsTemplate2.queries.cmsTemplate2_SearchAscendingPostsByDate.items", []).map((x: any) => mapPagesToItem(x));
          this.loader = false;
        })
      }else{
        this.graphqlService.getGraphQL(this.queries.SearchDescendingPostsByDate,{first:this.pageSize || 10 , categoryId:this.selectedCategories[0] ? this.selectedCategories[0].value : null})
        .then((results) => {
          this.pages =  _.get(results, "cmsTemplate2.queries.cmsTemplate2_SearchDescendingPostsByDate.items", []).map((x: any) => mapPagesToItem(x));
          this.loader = false;
        })
      }
      
    } else if(this.blockFormGroup.get('sorting').value === 'MOST_COMMENTED'){
        if(this.blockFormGroup.get('sortingBy').value === 'ASCENDING'){
          this.graphqlService.getGraphQL(this.queries.SearchAscendingPostsByMostCommented,{first:this.pageSize || 10 , categoryId:this.selectedCategories[0] ? this.selectedCategories[0].value : null})
          .then((results) => {
            this.pages =  _.get(results, "cmsTemplate2.queries.cmsTemplate2_SearchAscendingPostsByMostCommented.items", []).map((x: any) => mapPagesToItem(x));
            this.loader = false;
          })
      }else{
        this.graphqlService.getGraphQL(this.queries.SearchDescendingPostsByMostCommented,{first:this.pageSize || 10 , categoryId:this.selectedCategories[0] ? this.selectedCategories[0].value : null})
        .then((results) => {
          this.pages =  _.get(results, "cmsTemplate2.queries.cmsTemplate2_SearchDescendingPostsByMostCommented.items", []).map((x: any) => mapPagesToItem(x));
          this.loader = false;
        })
      }
    }

    else{
      if(this.blockFormGroup.get('sortingBy').value === 'ASCENDING'){
        this.graphqlService.getGraphQL(this.queries.SearchAscendingPostsByMostRead,{first:this.pageSize || 10 , categoryId:this.selectedCategories[0] ? this.selectedCategories[0].value : null})
        .then((results) => {
          this.pages =  _.get(results, "cmsTemplate2.queries.cmsTemplate2_SearchAscendingPostsByMostRead.items", []).map((x: any) => mapPagesToItem(x));
          this.loader = false;
        })
    }else{
      this.graphqlService.getGraphQL(this.queries.SearchDescendingPostsByMostRead,{first:this.pageSize || 10 , categoryId:this.selectedCategories[0] ? this.selectedCategories[0].value : null})
      .then((results) => {
        this.pages =  _.get(results, "cmsTemplate2.queries.cmsTemplate2_SearchDescendingPostsByMostRead.items", []).map((x: any) => mapPagesToItem(x));
        this.loader = false;
      })
    }
    }
    

  }

  submitBlock() {

  }
  addValue(e, name, value) {
    if (e.target.checked) {
      this.selectedItems.push({name:name, ischecked:true, value:value});
    } else {
      this.selectedItems = this.selectedItems.filter((res) => res.name != name);
    }
  }
  createBlock(){
    this.loader = true;
    const newLayoutId = this.layoutId.replace(/"/g, '');
    this.pagesData = this.selectedItems.map((x) => x.value);
    this.graphqlService.getGraphQL(this.queries.createBlock, {id : newLayoutId ,blockModel: this.blockFormGroup.value,pages: this.pagesData}).then((res)=>{
      this.loader = false
      this.generalservice.navigateTo('/dashboard/layout')
    })
  }

}
