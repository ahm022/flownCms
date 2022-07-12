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
    private queries: QueriesService
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
   this.apollo
    .watchQuery<any>({query: this.queries.categoryListQuery})
    .valueChanges.pipe(map((result)=>result.data.cmsTemplate.lookups.categories)).subscribe((data)=>{
      localStorage.setItem('categories', JSON.stringify(data))
    })
  }

  testMutation(name) {
    this.apollo.mutate({
      mutation: this.queries.addCategoriesMutation,
      variables: {name: name},
    }).subscribe((data)=>{
      console.log(data);
    })

  }
}
