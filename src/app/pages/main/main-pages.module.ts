import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages/pages.component';
import { SharedModule } from 'src/app/components/shared/shared.module';
import { AddNewPageComponent } from './add-new-page/add-new-page.component';
import { UsersComponent } from './users/users.component';
import { SendMessageComponent } from './send-message/send-message.component';
import { MessagesComponent } from './messages/messages.component';
import { CommentsComponent } from './comments/comments.component';
import { GalleryComponent } from './gallery/gallery.component';
import { ImagePreviewComponent } from './image-preview/image-preview.component';
import { LayoutComponent } from './layout/layout.component';
import { AddNewBlockComponent } from './add-new-block/add-new-block.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { EditPageComponent } from './edit-page/edit-page.component';

@NgModule({
  declarations: [
    PagesComponent,
    AddNewPageComponent,
    UsersComponent,
    SendMessageComponent,
    MessagesComponent,
    CommentsComponent,
    GalleryComponent,
    ImagePreviewComponent,
    LayoutComponent,
    AddNewBlockComponent,
    UserInfoComponent,
    EditPageComponent,
  ],
  imports: [CommonModule, SharedModule],
  exports: [
    PagesComponent,
    UsersComponent,
    SendMessageComponent,
    CommentsComponent,
    GalleryComponent,
    ImagePreviewComponent,
    LayoutComponent,
    AddNewBlockComponent,
    UserInfoComponent
  ],
})
export class MainPagesModule {}
