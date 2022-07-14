import { GraphqlService } from './../../../services/graphql.service';
import { QueriesService } from './../../../services/queries.service';
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
  };

  constructor(private formBuilder: FormBuilder, private generalService : GeneralService, private queries: QueriesService, private graphqlService: GraphqlService ) {}

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
    this.graphqlService
    .getGraphQL(this.queries.createUserMutation, {userInfo: this.userFormGroup.value})
    .then((data) => {
      console.log(data);
      this.generalService.navigateTo('dashboard/pages')
    });
  }
}
