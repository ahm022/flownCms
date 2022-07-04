import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-selected-label',
  templateUrl: './selected-label.component.html',
  styleUrls: ['./selected-label.component.scss'],
})
export class SelectedLabelComponent implements OnInit {
  @Input('list') list;
  constructor() {}

  ngOnInit(): void {}
}
