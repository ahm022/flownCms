import { Injectable } from '@angular/core';
import { gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class QueriesService {
  categoryListQuery = `query {
      cmsTemplate2 {
        lookups {
          categories {
            categoryId
            name
          }
        }
      }
    }`;

    getCategoriesQuery = `
      query{
        cmsTemplate2{
          lookups{
            categories{
              name
            }
          }
        }
      }
    `

  createUserMutation = `
    mutation createUser($userInfo: CmsTemplate2_createUserInput!){
      cmsTemplate2{
        actions{
          createUser(model: $userInfo){
            id
            views{
              cmsTemplate2_All{
                firstName
                lastName
                email
              }
            }
          }
        }
      }
    }
  `;
  createPageMutation = `
          mutation createPost($pageInfo: CmsTemplate2_createPostModelInputType!){
            cmsTemplate2{
              actions{
                createPost(createPostModel: $pageInfo){
                  id
                  views {
                    all{
                      author{
                        views{
                          cmsTemplate2_All{
                            firstName
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }

   `;
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
      cmsTemplate2 {
        actions {
          getMyProfile{
            id
            views{
              cmsTemplate2_All{
                firstName
                lastName
                email
              }
            }
          }
        }
      }
    }
  `;
  users = `
    query{
      cmsTemplate2{
        queries{
          cmsTemplate2_Users(first:10){
            items{
              system_User{
                id
                views{
                  cmsTemplate2_All{
                    firstName
                    lastName
                    email
                  }
                }
              }
            }
            cursor
          }
        }
      }
    }
  `;
  constructor() {}
}
