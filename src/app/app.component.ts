import { Component } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent {
  categories;
  constructor(private apollo: Apollo, private httpLink: HttpLink) {
    apollo.create({
      cache: new InMemoryCache(),
      link: httpLink.create({
        uri: 'https://dev-leb-graph.diasporaid.com/graphql?sdl',
      }),
    });
  }
  ngOnInit(): void {
   this.categories = this.apollo
      .query({
        query: gql(`
        query{
          cmsTemplate {
            lookups{
              categories{
                categoryId
                name
              }
            }
          }
        }
      `),
      })
      .subscribe((res) => {
        return res
      })
  }
  title = 'flowOnCms';
}
