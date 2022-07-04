import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-btn',
  templateUrl: './btn.component.html',
  styleUrls: ['./btn.component.scss']
})
export class BtnComponent implements OnInit {
  @Input('btnText') btnText : string 
  @Input('type') type: string = "button"
  @Input('disabled') disabled = false
  @Input('btnClass') btnClass
  @Output() clickEvent = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
  }
  clickNewEvent() {
    this.clickEvent.emit();
  }
}
