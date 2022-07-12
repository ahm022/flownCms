import { Injectable } from '@angular/core';
import { gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class QueriesService {

 categoryListQuery = gql`
  query {
    cmsTemplate {
      lookups {
        categories {
          categoryId
          name
        }
      }
    }
  }
`;

addCategoriesMutation = gql `
  mutation addCategory($name: String!){
    cmsTemplate{
      actions{
        addCategory(name: $name){
          name
          categoryId
        }
      }
    }
  }
`
  constructor() { }

}
