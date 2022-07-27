import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import 'froala-editor/js/plugins.pkgd.min.js'
@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss']
})
export class CustomInputComponent implements OnInit {
  @Input() labelText: string;
  @Input() isRequired: boolean;
  @Input() placeholder: string
  @Input() inputType: string;
  @Input() type:string
  @Input() validationErrors: any[];
  @Input() formGroup: FormGroup;
  @Input() controlName: string;
  @Output() changeEvent = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }
  changeNewEvent(e) {
    this.changeEvent.emit(e);
  }
  options = {
    toolbarButtons: ['undo', 'redo' , '|', 'bold', 'italic', 'insertImage'],
  }
}
