import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { data, icons } from '../../../../../data-config';
import { MatSort } from '@angular/material/sort';
import { DeleteDialogComponent } from 'src/app/components/shared/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  ELEMENT_DATA: any = data.commentsData;
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
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

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}
  deleteComments(id) {
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
          let EDIT_ELEMENT_DATA = this.ELEMENT_DATA.filter((el) => {
            return el.id != id;
          });
          this.ELEMENT_DATA = EDIT_ELEMENT_DATA;
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
          this.commentPreview = '';
        }
      });
  }
  getCommentPreview(comment) {
    this.commentPreview = comment;
  }
  changeCommentStatus(target) {
    alert(target);
  }
  searchComments(e) {
    clearTimeout(this.debounce);
    this.debounce = setTimeout(function () {
      console.log(e.target.value);
    }, 1000);
  }
} 
