import { QueriesService } from 'src/app/services/queries.service';
import { GraphqlService } from 'src/app/services/graphql.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { icons } from '../../../../../data-config';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss'],
})
export class ImagePreviewComponent implements OnInit {

  constructor(
    private graphQl: GraphqlService,
    private queries: QueriesService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  // Icons
  closeIcon = icons.closeIcon;
  deleteIcon = icons.deleteIcon
  loaderIcon = icons.loaderIcon;
  image
  loader
  ngOnInit(): void {
    this.loader=true
    this.graphQl.getGraphQL(this.queries.singleMedia, {id:this.data}).then((res)=>{
      this.image = res.cmsTemplate2.entities.mediaItem.views.all
    }).finally(()=>{
      this.loader=false
    })
  }
  deleteImage(id) {
    this.loader=true
    this.graphQl.getGraphQL(this.queries.deleteMedia, {id : id}).then((res)=>{
      this.loader=false
      this.closeDialog()
    })
  }
  closeDialog() {
    this.dialog.closeAll();
  }
}
