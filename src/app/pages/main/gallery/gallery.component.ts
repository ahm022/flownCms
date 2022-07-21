import { QueriesService } from 'src/app/services/queries.service';
import { GraphqlService } from 'src/app/services/graphql.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { data } from 'data-config';
import { GeneralService } from 'src/app/services/general.service';
import { MatDialog } from '@angular/material/dialog';
import { ImagePreviewComponent } from '../image-preview/image-preview.component';
import * as _ from 'lodash';
import { mapMediaToItem, mapPageToItem } from 'src/app/services/mapping-helper';
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  images;
  isloaded;
  loader
  galleryFormGroup: FormGroup
  selectedImage
  constructor(private formBuilder: FormBuilder, private generalService: GeneralService, private dialog:MatDialog, private graphqlService: GraphqlService, private queries: QueriesService ) { }
  ngOnInit(): void {
    this.getimages()
    this.prepareImageForm()
  }
  getimages() {
    this.isloaded = true;
    this.graphqlService
      .getGraphQL(this.queries.media, false)
      .then((results) => {
        console.log('results', results);
        this.images = _.get(
          results,
          'cmsTemplate2.entities.mediaGallery.queries.galleryItem.items',
          []
        ).map((x: any) => mapMediaToItem(x));
      })
      .finally(() => {
        this.isloaded = false;
      });
  }
  prepareImageForm() {
    this.galleryFormGroup = this.formBuilder.group({
      userId: this.formBuilder.control('', [Validators.required]),
      galleryimage: this.formBuilder.control('', [Validators.required]),
      fileSource: [null],
    })
  }

  getImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => (this.selectedImage = reader.result);

      reader.readAsDataURL(file);
      this.galleryFormGroup.patchValue({
        fileSource: file,
      });
    }
  }

  uploadImage(){
    this.loader = true
    this.graphqlService.getGraphQL(this.queries.uploadMedia, {id:'efa346e0-a8f0-4e79-9cd0-6f730b576ac5', photo: this.galleryFormGroup.controls['fileSource'].value, caption: 'Image'}).then(()=>{
      this.selectedImage = null;
      this.loader = false
      this.getimages()
    })
  }

  getImagePreview(id) {
    console.log(id);
    this.dialog.open(ImagePreviewComponent,{
      width: '1000px',
      data: id
    },
    ).afterClosed().subscribe(()=>{
      this.getimages()
    })
  }
}

