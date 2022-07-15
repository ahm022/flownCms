import { GeneralService } from 'src/app/services/general.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-back-drop',
  templateUrl: './back-drop.component.html',
  styleUrls: ['./back-drop.component.scss']
})
export class BackDropComponent implements OnInit {

  constructor(private generalservice: GeneralService) { }

  ngOnInit(): void {
  }

}
