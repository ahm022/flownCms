import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit {
  @Output() changeEvent = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
  }
  changeNewEvent(value) {
    this.changeEvent.emit(value);
  }
}
