import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { data } from 'data-config';
import { GeneralService } from 'src/app/services/general.service';
import { MatDialog } from '@angular/material/dialog';
import { ImagePreviewComponent } from '../image-preview/image-preview.component';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  images = data.galleryImageData
  galleryFormGroup: FormGroup
  selectedImage
  constructor(private formBuilder: FormBuilder, private generalService: GeneralService, private dialog:MatDialog) { }
  ngOnInit(): void {
    this.prepareImageForm()
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
    console.log(this.galleryFormGroup.value)
    this.selectedImage = null;
  }

  getImagePreview(id) {
    let imageDetails = this.images.filter(res => res.id === id)
    this.dialog.open(ImagePreviewComponent,{
      width: '1000px',
      data: imageDetails[0]
    },
    )
  }
}

