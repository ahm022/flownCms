import { Component, OnInit } from '@angular/core';
import { data } from 'data-config';
import { GeneralService } from 'src/app/services/general.service';
import { GraphqlService } from 'src/app/services/graphql.service';
import { QueriesService } from 'src/app/services/queries.service';
import { mapSearchLayoutToItem } from "src/app/services/mapping-helper";
import * as _ from "lodash";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  Blocks: any;
  cursor: any;
  layoutId = localStorage.getItem('cms_user_Layout_id')
  displayedColumns: string[] = ['title', 'author', 'content', 'sorted'];

  constructor(private generalservice: GeneralService,
    private queries: QueriesService,
    private graphqlService: GraphqlService) {}

  ngOnInit(): void {
    this.getBlocks()
  }

  getBlocks(){
    const newLayoutId = this.layoutId.replace(/"/g, '');
    this.graphqlService.getGraphQL(this.queries.blocks, { layoutId : newLayoutId})
    .then((results) => {
      this.Blocks =  _.get(results, "cmsTemplate2.entities.layout.queries.blocks.items", []).map((x: any) => mapSearchLayoutToItem(x));
      
      this.cursor = results.cmsTemplate2.queries.cmsTemplate2_Users.cursor;
    })
    .finally(() => {
    });
  }
  goToAddNewBlock() {
    this.generalservice.navigateTo('/dashboard/add-new-block')
  }
}
