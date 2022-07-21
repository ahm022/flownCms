import { QueriesService } from 'src/app/services/queries.service';
import { GraphqlService } from 'src/app/services/graphql.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss'],
})
export class SendMessageComponent implements OnInit {
  messageFormGroup: FormGroup;
  loader:boolean
  userId;
  reaceiverName;
  validationErrorMessages = {
    messagetext: [{ type: 'required', message: 'Message is required' }],
  };
  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private generalService: GeneralService,
    private graphqlService: GraphqlService,
    private queries: QueriesService
  ) {}

  ngOnInit(): void {
    this.prepareForm();
    this.getReceiverId();
  }

  getReceiverId() {
    this.activatedRoute.params.subscribe((res) => {
      this.userId = res.id
      this.loader = true
      this.graphqlService
        .getGraphQL(this.queries.user, {userId: this.userId})
        .then((results) => {
          this.reaceiverName = results.system.entities.user.views.cmsTemplate2_All.firstName
        })
        .finally(() => {
          this.loader = false
        });
    });
  }

  prepareForm() {
    this.messageFormGroup = this.formBuilder.group({
      messageText: this.formBuilder.control('', [Validators.required]),
    });
  }

  submitMessage() {
    this.loader = true
      this.graphqlService
      .getGraphQL(this.queries.sendMessage, {receiverId: this.userId, messageText: this.messageFormGroup.value.messageText })
      .then((results) => {
        this.reaceiverName = results.system.entities.user.views.cmsTemplate2_All.firstName
      })
      .finally(() => {
        this.loader = false
        this.generalService.navigateTo('/dashboard/users');
      });
  }

  goBackToUsers() {
    this.generalService.navigateTo('/dashboard/users');
  }
}
