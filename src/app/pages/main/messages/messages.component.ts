import { Component, OnInit, ViewChild } from '@angular/core';
import { data, icons } from '../../../../../data-config';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { GeneralService } from 'src/app/services/general.service';
import { DeleteDialogComponent } from 'src/app/components/shared/delete-dialog/delete-dialog.component';
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  // Data Table
  ELEMENT_DATA: any = data.messageData;
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['message', 'from', 'date', 'status', 'actions'];
  messagePreview

  @ViewChild(MatSort) sort: MatSort;

  // Icon
  deleteIcon = icons.deleteIcon.toString();

  constructor(
    public dialog: MatDialog,
    private generalService: GeneralService
  ) {}

  ngOnInit(): void {}
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
          let EDIT_ELEMENT_DATA = this.ELEMENT_DATA.filter((el) => {
            return el.id != id;
          });
          this.ELEMENT_DATA = EDIT_ELEMENT_DATA;
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
          this.messagePreview = ""
        }
      });
  }
  markMessageAsRead(id, status) {
    this.ELEMENT_DATA.map((res) => {
      if (res.id === id) {
        res.status = 'read';
        res.isreaded = true;
      }
    });
  }
  getMessagePreview(message) {
    this.messagePreview = message
  }
  searchMessages(e) {
    console.log(e.target.value)
  }
}
