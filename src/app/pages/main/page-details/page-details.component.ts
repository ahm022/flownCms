import { DeleteDialogComponent } from 'src/app/components/shared/delete-dialog/delete-dialog.component';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QueriesService } from 'src/app/services/queries.service';
import { GraphqlService } from 'src/app/services/graphql.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import _ from 'lodash';
import { mapPageToItem, mapCommentToItem } from 'src/app/services/mapping-helper';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-page-details',
  templateUrl: './page-details.component.html',
  styleUrls: ['./page-details.component.scss']
})
export class PageDetailsComponent implements OnInit {
  loader;
  pageId
  page
  comments: []
  commentLoader
  commentFormGroup:FormGroup
  constructor(private activateRoute: ActivatedRoute, private graphqlService: GraphqlService, private queries:QueriesService, private formBuilder: FormBuilder,   private dialog: MatDialog,) { }

  ngOnInit(): void {
    this.loader = true
    this.activateRoute.params.subscribe((res) => {
      this.pageId = res.id
      this.graphqlService
        .getGraphQL(this.queries.singlePageQuery, { pageId: this.pageId })
        .then((results) => {
          console.log('res', results);
          this.page = results.cmsTemplate2.entities.post.views.all;
        })
        .finally(() => {
          this.loader=false
          this.getPageComment()
        });
    });
    this.prepareForm()
  }
  submitComment() {
    this.commentLoader=true
    this.graphqlService.getGraphQL(this.queries.addComment,{id:this.pageId, commentText: this.commentFormGroup.controls['pagecomment'].value }).then(()=>{
    }).finally(()=>{
      this.commentLoader=false
      this.dialog
      .open(DeleteDialogComponent, {
        width: '600px',
        data: {
          description: ' Your comment is currently pending approval by the site administrator.',
        },
      })
    })
    this.commentFormGroup.reset()
  }
  getPageComment() {
    this.graphqlService.getGraphQL(this.queries.getPageComment, {id:this.pageId}).then((results)=>{
      console.log('comments',results);
      this.comments = _.get(
        results,
        'cmsTemplate2.entities.post.queries.commentsByStatus.items',
        []
      ).map((x: any) => mapCommentToItem(x));
    })
    .finally(() => {
      console.log(this.comments);
    });
  }

  prepareForm() {
    this.commentFormGroup = this.formBuilder.group({
      pagecomment: this.formBuilder.control('', [Validators.required]),
    });
  }

}


