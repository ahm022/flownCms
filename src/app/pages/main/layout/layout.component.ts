import { Component, OnInit } from '@angular/core';
import { data } from 'data-config';
import { GeneralService } from 'src/app/services/general.service';
import { GraphqlService } from 'src/app/services/graphql.service';
import { QueriesService } from 'src/app/services/queries.service';
import { mapSearchLayoutToItem ,mapBlockPostToItem} from "src/app/services/mapping-helper";
import * as _ from "lodash";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  Blocks: any;
  cursor: any;
  layoutId = "b7fa81cc-dce6-456e-bcd4-92423d1fbe83";
  blockId: any;
  postsBlocks:any;
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
      console.log("this.Blocks",this.Blocks)
      this.cursor = results.cmsTemplate2.entities.layout.queries.blocks.cursor;
    })
    .finally(() => {
    });
  }
  getPostOf(x) {
    console.log("x",x)
    this.graphqlService.getGraphQL(this.queries.getPostByBlock, { blockId:x}).then((postData) => {
      console.log("dataaaaa",postData)
      this.postsBlocks =  _.get(postData, "cmsTemplate2.entities.block.queries.posts.items", []).map((x: any) => mapBlockPostToItem(x));
      console.log("this.postsBlocks",this.postsBlocks)
      
    })
  }
  goToAddNewBlock() {
    this.generalservice.navigateTo('/dashboard/add-new-block')
  }
}
