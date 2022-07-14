import { Injectable } from '@angular/core';
import { gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class QueriesService {

  createUserMutation = `
    mutation createUser($userInfo: CmsTemplate2_createUserInput!){
      cmsTemplate2{
        actions{
          createUser(model: $userInfo)
        }
      }
    }
  `
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
  whoAmI = `
    mutation {
      cmsTemplate {
        actions {
          getMyProfile{
            id
            views{
              people_Public{
                firstName
                lastName
              }
            }
          }
        }
      }
    }
  `;
  constructor() {}
}
