import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input-validation-error',
  templateUrl: './input-validation-error.component.html',
  styleUrls: ['./input-validation-error.component.scss']
})
export class InputValidationErrorComponent implements OnInit {
  @Input() validationErrors: any[];
  @Input() controlName: string;
  @Input() formGroup: FormGroup;
  
  constructor() { }

  ngOnInit(): void {
  }

}
