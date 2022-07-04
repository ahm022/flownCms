import { Component, OnInit } from '@angular/core';
import { data } from 'data-config';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  dataSource = data.layoutBlockData;
  displayedColumns: string[] = ['title', 'author', 'content', 'sorted'];

  constructor(private generalservice: GeneralService) {}

  ngOnInit(): void {}
  goToAddNewBlock() {
    this.generalservice.navigateTo('/dashboard/add-new-block')
  }
}
