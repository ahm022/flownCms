import { QueriesService } from 'src/app/services/queries.service';
import { GraphqlService } from 'src/app/services/graphql.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/services/general.service';
import { data } from 'data-config';
@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss'],
})
export class EditPageComponent implements OnInit {
  pageFormGroup: FormGroup;
  pageId;
  selectedImage;
  loader = false;
  postImage;
  page: any;
  constructor(
    private activateRoute: ActivatedRoute,
    private graphqlService: GraphqlService,
    private queries: QueriesService,
    private formBuilder: FormBuilder,
    private generalservice: GeneralService
  ) {}

  ngOnInit(): void {
    this.prepareForm()
    this.activateRoute.params.subscribe((res) => {
      this.pageId = res.id
      this.graphqlService
        .getGraphQL(this.queries.singlePageQuery, { pageId: this.pageId })
        .then((results) => {
          this.page = results.cmsTemplate2.entities.post;
        })
        .finally(() => {
          this.setProperties()
        });
    });
  }
  // selectedCategories;
  categories = JSON.parse(localStorage.getItem('categories'));

  // Status page options
  statusPageOptions = data.statusPageOptions;

  // Gated page options
  gatedPageOptions = data.gatedPageOptions;

  validationErrorMessages = {
    postTitle: [{ type: 'required', message: 'Page title is required' }],
    permalink: [
      { type: 'required', message: 'Permalink is required' },
      { type: 'pattern', message: 'Please provide valid url' },
    ],
    slug: [{ type: 'required', message: 'Slug is required' }],
    paragraph: [{ type: 'required', message: 'paragraph is required' }],
  };

  submitPage() {
    this.loader = true;
    this.graphqlService
      .getGraphQL(this.queries.updatePage, {
        pageId: this.pageId,
        pageInfo: this.pageFormGroup.value,
      })
      .then((res) => {
        this.loader = false;
        this.generalservice.navigateTo('/dashboard/pages');
      });
  }

  prepareForm() {
    this.pageFormGroup = this.formBuilder.group({
      postTitle: this.formBuilder.control('', [
        Validators.required,
      ]),
      permaLink: this.formBuilder.control('', [
        Validators.required,
        Validators.pattern('(www)\\.([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'),
      ]),
      slug: this.formBuilder.control('', [Validators.required]),
      // pagestatus: this.formBuilder.control('', [Validators.required]),
      category: this.formBuilder.control('', Validators.required),
      gated: this.formBuilder.control('', [Validators.required]),
      postDesrcription: this.formBuilder.control('', [Validators.required]),
      // fileSource: [null],
    });
  }

  setProperties() {
    this.selectedImage = this.page.views.all.postImage.imageUrl
    this.pageFormGroup.controls['postTitle'].setValue(this.page.views.all.postTitle)
    this.pageFormGroup.controls['permaLink'].setValue(this.page.views.all.permaLink)
    this.pageFormGroup.controls['slug'].setValue(this.page.views.all.slug)
    this.pageFormGroup.controls['gated'].setValue(this.page.views.all.gated)
    this.pageFormGroup.controls['postDesrcription'].setValue(this.page.views.all.postDescription)
    this.pageFormGroup.controls['category'].setValue(this.page.views.all.category.categoryId)
  }

  getImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => (this.selectedImage = reader.result);

      reader.readAsDataURL(file);
      this.postImage = file;
    }
    this.graphqlService.getGraphQL(this.queries.updatePostImage,{id:this.pageId, postImage: this.postImage}).then((results)=>{
      console.log(results);
    })
  }
}

