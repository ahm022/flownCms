import { Component, OnInit } from '@angular/core';
import { data, icons } from '../../../../../data-config';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteDialogComponent } from 'src/app/components/shared/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { GeneralService } from 'src/app/services/general.service';
import { GraphqlService } from 'src/app/services/graphql.service';
import { QueriesService } from 'src/app/services/queries.service';
import { mapSearchUserToItem } from "src/app/services/mapping-helper";
import * as _ from "lodash";
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  // Data Table
  // ELEMENT_DATA: any = data.userTableData;
  users: any;
  cursor: any;
  // dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = [
    'name',
    'email',
    'role',
    // 'numberOfPages',
    'actions',
  ];
  userStatus = data.userStatus;

  // Icons
  deleteIcon = icons.deleteIcon.toString();
  sendMessageIcon = icons.sendMessageIcon.toString();

  constructor(
    private dialog: MatDialog,
    private generalService: GeneralService,
    private queries: QueriesService,
    private graphqlService: GraphqlService,
  ) {}

  ngOnInit(): void {

    this.getUsers();
  }
  getUsers(){
    this.graphqlService.getGraphQL(this.queries.users, false)
    .then((results) => {
      this.users =  _.get(results, "cmsTemplate2.queries.cmsTemplate2_Users.items", []).map((x: any) => mapSearchUserToItem(x));

      this.cursor = results.cmsTemplate2.queries.cmsTemplate2_Users.cursor;
    })
    .finally(() => {
    });
  }
  changeUserStatus(targetOption) {
    alert('user status was changed to ' + targetOption);
  }
  goToSendMessage(userId) {
    this.generalService.navigateTo('/dashboard/users/send-message/'+userId)
  }

}
