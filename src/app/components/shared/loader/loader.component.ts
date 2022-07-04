import { Component, OnInit } from '@angular/core';
import { icons } from 'data-config';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  loaderIcon = icons.loaderIcon
  constructor() { }

  ngOnInit(): void {
  }

}
