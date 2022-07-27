import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss'],
})
export class CustomSelectComponent implements OnInit {
  @Input() labelText: string;
  @Input() isRequired: boolean;
  @Input() labelIcon: string;
  @Input() defaultValueLabel: string;
  @Input() options: { value: string; label: string }[] = [];

  @Input() formGroup: FormGroup;
  @Input() controlName: string;
  @Output() clickEvent = new EventEmitter<string>();
  @Output() changeEvent = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {}

  checkIfOptionIsSelected() {
    return this.formGroup.controls[this.controlName].value !== undefined &&
      this.formGroup.controls[this.controlName].value !== null &&
      this.formGroup.controls[this.controlName].value.length > 0
      ? true
      : false;
  }
    changeNewEvent(e) {
    this.changeEvent.emit(e);
  }
  clickLabelEvent() {
    this.clickEvent.emit()
  }
}
