import { Component, OnInit } from '@angular/core';
import { data, icons } from '../../../../../data-config';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteDialogComponent } from 'src/app/components/shared/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { GeneralService } from 'src/app/services/general.service';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  // Data Table
  ELEMENT_DATA: any = data.userTableData;
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = [
    'name',
    'email',
    'role',
    'numberOfPages',
    'actions',
  ];
  userStatus = data.userStatus;

  // Icons
  deleteIcon = icons.deleteIcon.toString();
  sendMessageIcon = icons.sendMessageIcon.toString();

  constructor(
    private dialog: MatDialog,
    private generalService: GeneralService
  ) {}

  ngOnInit(): void {}

  deleteUser(id) {
    this.dialog
      .open(DeleteDialogComponent, {
        width: '600px',
        data: {
          title: 'Delete user',
          description: ' Would you like to delete this user',
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
          this.generalService.navigateTo('/dashboard/users')
        }
      });
  }

  changeUserStatus(targetOption) {
    alert('user status was changed to ' + targetOption);
  }
  goToSendMessage(userId) {
    this.generalService.navigateTo('/dashboard/users/send-message/'+userId)
  }
}
