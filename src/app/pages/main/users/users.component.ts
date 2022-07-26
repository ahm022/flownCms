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

  loggedInUser = JSON.parse(localStorage.getItem('cms_user_id'));
  users: any;
  cursor: any;
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
      this.users = this.users.filter((item)=>{return item.id !== this.loggedInUser})
      console.log(this.users);
      console.log(this.loggedInUser);
    });
  }
  changeUserStatus(targetOption, id) {
    this.graphqlService.getGraphQL(this.queries.changeUserRole, {id:id, status: targetOption}).then(()=>{

    }).finally(()=>{
      this.getUsers
    })
  }
  goToSendMessage(userId) {
    this.generalService.navigateTo('/dashboard/users/send-message/'+userId)
  }

}
