import { GraphqlService } from './services/graphql.service';
import { QueriesService } from './services/queries.service';
import { Component } from '@angular/core';
import { Apollo, gql, Query } from 'apollo-angular';
import { InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { Observable, map } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  categories :  Observable<any>;
  constructor(
    private apollo: Apollo,
    private httpLink: HttpLink,
    private queries: QueriesService,
    private graphqlService: GraphqlService
  ) {
    apollo.create({
      cache: new InMemoryCache(),
      link: httpLink.create({
        uri: 'https://dev-leb-graph.diasporaid.com/graphql?sdl',
      }),
    });
  }
  ngOnInit(): void {
    this.getCategories()
  }

  getCategories() {
  //  this.apollo
  //   .watchQuery<any>({query: this.queries.categoryListQuery})
  //   .valueChanges.pipe(map((result)=>result.data.cmsTemplate.lookups.categories)).subscribe((data)=>{
  //     localStorage.setItem('categories', JSON.stringify(data))
  //   })

    this.graphqlService
    .getGraphQL(this.queries.categoryListQuery, false)
    .then((data) => {
      localStorage.setItem('categories', JSON.stringify(data.cmsTemplate.lookups.categories))
    });
  }
  name = "hhhhh"
  testMutation() {
    this.graphqlService
    .mutateGraphQL(this.queries.addCategoriesMutation, {name: this.name})
    .then((data) => {
      console.log(data);
    });
  }
}
