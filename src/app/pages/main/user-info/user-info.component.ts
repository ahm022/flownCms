import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent implements OnInit {
  userFormGroup: FormGroup;
  validationErrorMessages = {
    firstName: [{ type: 'required', message: 'First Name  is required' }],
    lastName: [{ type: 'required', message: 'Last name is required' }],
    contactEmail: [{ type: 'required', message: 'contact email is required' }],
    paragraph: [{ type: 'required', message: 'paragraph is required' }],
  };
  constructor(private formBuilder: FormBuilder, private generalService : GeneralService) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.userFormGroup = this.formBuilder.group({
      firstName: this.formBuilder.control('', [Validators.required]),
      lastName: this.formBuilder.control('', [Validators.required]),
      contactEmail: this.formBuilder.control('', [Validators.required]),
    });
  }
  submitUser() {
    console.log(this.userFormGroup.value);
    this.generalService.navigateTo('dashboard/pages')
  }
}
