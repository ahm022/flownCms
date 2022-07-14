import { Injectable } from '@angular/core';
import { gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class QueriesService {
  categoryListQuery =
  `query {
      cmsTemplate2 {
        lookups {
          categories {
            categoryId
            name
          }
        }
      }
    }`;

  addCategoriesMutation = `
    mutation addCategory($name: String!) {
      cmsTemplate {
        actions {
          addCategory(name: $name) {
            name
            categoryId
          }
        }
      }
    }
  `;
  constructor() {}
}
