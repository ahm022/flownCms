import { PageDetailsComponent } from './pages/main/page-details/page-details.component';
import { UserInfoComponent } from './pages/main/user-info/user-info.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes,PreloadAllModules } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PagesComponent } from './pages/main/pages/pages.component';
import { AddNewPageComponent } from './pages/main/add-new-page/add-new-page.component';
import { UsersComponent } from './pages/main/users/users.component';
import { SendMessageComponent } from './pages/main/send-message/send-message.component';
import { MessagesComponent } from './pages/main/messages/messages.component';
import { CommentsComponent } from './pages/main/comments/comments.component';
import { GalleryComponent } from './pages/main/gallery/gallery.component';
import { LayoutComponent } from './pages/main/layout/layout.component';
import { AddNewBlockComponent } from './pages/main/add-new-block/add-new-block.component';
import { GuardGuard } from '../app/guard/guard.guard';
import { EditPageComponent } from './pages/main/edit-page/edit-page.component';


const routes: Routes = [

  {path: "", component: UserInfoComponent},
  {path: "user-info", component: UserInfoComponent},
  {path:"dashboard", component:DashboardComponent,
   children: [
    {path:'pages', component: PagesComponent},
    {path:'edit-page/:id', component: EditPageComponent},
    {path: 'add-new-page', component: AddNewPageComponent},
    {path: 'add-new-block', component: AddNewBlockComponent},
    {path: 'users', component: UsersComponent, children: [
      {path: 'send-message/:id', component: SendMessageComponent}
    ]},
    {path:"layout", component: LayoutComponent},
    {path:"messages", component: MessagesComponent},
    {path:"comments", component: CommentsComponent},
    {path:"gallery", component: GalleryComponent},
    {path:"page-details/:id", component: PageDetailsComponent}

  ]},
  {
    path: "**",
    component:DashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {


 }
