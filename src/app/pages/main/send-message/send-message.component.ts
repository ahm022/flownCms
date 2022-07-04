import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss']
})
export class SendMessageComponent implements OnInit {
  messageFormGroup: FormGroup
  reaceiverName
  validationErrorMessages = {
    messagetext: [{ type: 'required', message: 'Message is required' }],
  }
  constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private generalService: GeneralService) { }

  ngOnInit(): void {
    this.prepareForm()
    this.getReceiverId()
  }

  getReceiverId() {
    this.activatedRoute.params.subscribe((res)=>{
      this.reaceiverName = res.id
    })
  }
  prepareForm() {
    this.messageFormGroup = this.formBuilder.group({
      messageText: this.formBuilder.control('', [Validators.required])
    })
  }
  submitMessage() {
    console.log(this.messageFormGroup.value)
    this.generalService.navigateTo('/dashboard/users')
  }
  goBackToUsers() {
    this.generalService.navigateTo('/dashboard/users')
  }

}
