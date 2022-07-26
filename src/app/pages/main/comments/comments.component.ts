import { QueriesService } from 'src/app/services/queries.service';
import { GraphqlService } from 'src/app/services/graphql.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { data, icons } from '../../../../../data-config';
import { MatSort } from '@angular/material/sort';
import { DeleteDialogComponent } from 'src/app/components/shared/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';
import {
  mapCommentToItem,
  mapSearchUserToItem,
} from 'src/app/services/mapping-helper';
@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  isloaded: boolean;
  comments: any;
  displayedColumns: string[] = [
    'comment',
    'pagename',
    'author',
    'date',
    'status',
    'actions',
  ];
  commentSatus = data.commentStatus;
  commentPreview;
  debounce: any;

  // Icon
  deleteIcon = icons.deleteIcon.toString();

  constructor(
    private dialog: MatDialog,
    private graphqlService: GraphqlService,
    private queries: QueriesService
  ) {}

  ngOnInit(): void {
    this.getComments();
  }

  getComments() {
    this.isloaded = true;
    this.graphqlService
      .getGraphQL(this.queries.comments, false)
      .then((results) => {
        this.comments = _.get(
          results,
          'cmsTemplate2.queries.cmsTemplate2_comments.items',
          []
        ).map((x: any) => mapCommentToItem(x));
        console.log(this.comments);
      })
      .finally(() => {
        console.log(this.comments);
        this.isloaded = false;
      });
  }

  deleteComments(commentId) {
    this.dialog
      .open(DeleteDialogComponent, {
        width: '600px',
        data: {
          title: 'Delete comment',
          description: ' Would you like to delete this comment',
        },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res === 'true') {
          this.isloaded=true
          this.graphqlService
            .getGraphQL(this.queries.deleteComments, { id: commentId })
            .then(() => {
              this.getComments();
            });
        }
      });
  }
  getCommentPreview(comment) {
    this.commentPreview = comment;
  }

  changeCommentStatus(id, e) {
    this.graphqlService
      .getGraphQL(this.queries.changeCommentStatus, {id: id, commentStatus: e.target.value})
      .then(() => {
        this.getComments();
      });
  }

  searchComments(e) {
    // clearTimeout(this.debounce);
    // this.debounce = setTimeout(function () {
    //   console.log(e.target.value);
    // }, 1000);
  }
}
