import { QueriesService } from 'src/app/services/queries.service';
import { GraphqlService } from 'src/app/services/graphql.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { data, icons } from '../../../../../data-config';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { GeneralService } from 'src/app/services/general.service';
import * as _ from 'lodash';
import { DeleteDialogComponent } from 'src/app/components/shared/delete-dialog/delete-dialog.component';
import { mapCommentToItem, mapMessageToItem } from 'src/app/services/mapping-helper';
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  // Data Table
  messages = []
  displayedColumns: string[] = ['message', 'from', 'date', 'status', 'actions'];
  loggedInUser = localStorage.getItem('cms_user_id')
  messagePreview
  isloaded:boolean

  // Icon
  deleteIcon = icons.deleteIcon.toString();

  constructor(
    public dialog: MatDialog,
    private generalService: GeneralService,
    private graphqlService : GraphqlService,
    private queries: QueriesService
  ) {}

  ngOnInit(): void {
    this.getMessages()
  }

  getMessages() {
    const newLogInuser = this.loggedInUser.replace(/"/g, '');
    this.isloaded = true;
    this.graphqlService
      .getGraphQL(this.queries.messages, {id : newLogInuser})
      .then((results) => {
        console.log(results);
        this.messages = _.get(
          results,
          'system.entities.user.queries.cmsTemplate2_Messages.items',
          []
        ).map((x: any) => mapMessageToItem(x));
        console.log(this.messages);
      })
      .finally(() => {
        this.isloaded = false;
      });
  }
  deleteMessage(id) {
    this.dialog
      .open(DeleteDialogComponent, {
        width: '600px',
        data: {
          title: 'Delete message',
          description: ' Would you like to delete this message',
        },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res === 'true') {
          this.graphqlService
            .getGraphQL(this.queries.deleteMessage, { id: id })
            .then(() => {
              this.getMessages();
            });
        }
      });
  }
  markMessageAsRead(id) {

    this.isloaded = true;
    this.messagePreview = undefined
    this.graphqlService
      .getGraphQL(this.queries.setAsRead, {id : id})
      .then((results) => {
      })
      .finally(() => {
        this.isloaded = false;
        this.getMessages()
      });
  }
  getMessagePreview(message) {
    this.messagePreview = message
  }
  searchMessages(e) {
    console.log(e.target.value)
  }
}
