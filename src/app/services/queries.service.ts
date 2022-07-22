import { Injectable } from '@angular/core';
import { gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class QueriesService {
  getCategoriesQuery = `
      query{
        cmsTemplate2{
          lookups{
            categories{
              categoryId
              name
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

  // Users

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

  createlayout = `
    mutation{
      cmsTemplate2{
        actions{
          addLayout{
            id
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

  user = `
    query getSingleUser($userId: String!) {
      system{
        entities{
          user(id:$userId) {
            views{
              cmsTemplate2_All{
                firstName
              }
            }
          }
        }
      }
    }
  `;
  // Message
  sendMessage = `
        mutation sendMessage($receiverId: String!, $messageText: String!){
          system{
            entities{
              user{
                cmsTemplate2_sendMessage(id:$receiverId,messageText:$messageText){
                  id
                  views{
                    all{
                      receiver{
                        id
                        views{
                          cmsTemplate2_All{
                            firstName
                            lastName
                            email
                          }
                        }
                      }
                      sender{
                        id
                        views{
                          cmsTemplate2_All{
                            firstName
                            lastName
                            email
                          }
                        }
                      }
                      text
                      status
                    }
                  }
                }
              }
            }
          }
        }
    `;
  messages = `
    query getMessage($id: String!){
      system{
        entities{
          user(id: $id) {
            queries{
              cmsTemplate2_Messages(first:10){
                items{
                  cmsTemplate2_Message{
                    id
                    views{
                      all{
                        text
                        createdDate
                        status
                        sender{
                          views{
                            cmsTemplate2_All{
                              firstName
                              lastName
                            }
                          }
                        }
                      }
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
  deleteMessage = `
    mutation deleteMessage($id: String!) {
      cmsTemplate2{
        entities{
          message{
            deleteMessage(id: $id)
          }
        }
      }
    }
  `;

  // Comments
  comments = `
   query{
    cmsTemplate2{
      queries {
        cmsTemplate2_comments(first:100){
          items{
            cmsTemplate2_comment{
              id
              views{
                all{
                  commentText
                  status
                  createdDate
                  author{
                    views{
                      cmsTemplate2_All{
                        firstName
                        lastName
                      }
                    }
                  }
                  post{
                    id
                    views{
                      all{
                        postTitle
                      }
                    }
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
  deleteComments = `
    mutation deleteCmment($postId: String!, $commentId: String!){
      cmsTemplate2{
        entities{
          post{
            deleteComment(id:$postId, CommentId:$commentId)
          }
        }
      }
    }
  `;
  changeCommentStatus = `
    mutation changeCommentStatus($id: String!, $commentStatus: CmsTemplate2_commentStatus!) {
      cmsTemplate2 {
        entities {
          comment {
            updateCommentStatus(
              id: $id
              commentStatus: {commentStatus: $commentStatus}
            ) {
              id
            }
          }
        }
      }
    }
  `;
  // Pages
  pageQuery = `
    query{
      cmsTemplate2{
        queries{
          cmsTemplate2_Posts(first:10){
            items{
              cmsTemplate2_post{
                id
                views{
                  all{
                    createdBy
                    createdDate
                    modifiedBy
                    postTitle
                    author {
                      views{
                        cmsTemplate2_All{
                          firstName
                          lastName
                        }
                      }
                    }
                    slug
                    status
                    category {
                      name
                    }
                    postDescription
                    gated
                    postImage {
                      __typename ... on System_ImageMedia {
                        imageUrl
                      }
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
  searchPageQuery = `
    query searchPages($name: String){
      cmsTemplate2{
        queries{
          cmsTemplate2_Posts(first:10, keyword: $name){
            items{
              cmsTemplate2_post{
                id
                views{
                  all{
                    createdBy
                    createdDate
                    modifiedBy
                    postTitle
                    author {
                      id
                      views{
                        cmsTemplate2_All{
                          firstName
                          lastName
                        }
                      }
                    }
                    slug
                    status
                    category {
                      name
                    }
                    postDescription
                    gated
                    postImage{
                      __typename
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
  deletePages = `
    mutation deletepage($pageId : String!) {
      cmsTemplate2{
        entities{
          post{
            deletePost(id:$pageId)
          }
        }
      }
    }
  `;
  changePageStatusMutation = `
    mutation changePageStatus($pageId: String!, $pageStatus: CmsTemplate2_postStatus!){
      cmsTemplate2{
        entities{
          post{
            changePostStatus(id : $pageId, postStatus:{
              postStatus: $pageStatus
            }){
              id
            }
          }
        }
      }
    }
  `;
  singlePageQuery = `
    query getSinglePage($pageId: String!){
      cmsTemplate2{
        entities{
          post(id: $pageId) {
            id
            views{
              all{
                permaLink
                postTitle
                postDescription
                category {
                  name
                  categoryId
                }
                commentCount
                gated
                slug
                postImage {
                  __typename... on System_ImageMedia {
                    imageUrl
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  createPageMutation = `
  mutation createPost($pageInfo: CmsTemplate2_createPostModelInputType!, $postImageModel:  Upload!) {
    cmsTemplate2 {
      actions {
        createPost(createPostModel: $pageInfo, postImageModel: $postImageModel) {
          id
          views {
            all {
              author {
                views {
                  cmsTemplate2_All {
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
  updatePage = `
    mutation updatePage($pageId: String!, $pageInfo: CmsTemplate2_createPostModelInputType!) {
      cmsTemplate2{
        entities{
          post{
            updatePost(id: $pageId, updatePostModel: $pageInfo) {
              id
            }
          }
        }
      }
    }
  `;

  updatePostImage = `
    mutation updatePostImage($id: String!, $postImage: Upload!){
      cmsTemplate2 {
        entities {
          post {
            updatePostImage(id: $id, postImage: $postImage) {
              id
            }
          }
        }
      }
    }
`;

  blocks = `
  query getBlocks($layoutId: String!){
    cmsTemplate2{
      entities{
        layout(id:$layoutId){
          queries{
            blocks(first:10){
              items{
                cmsTemplate2_Block{
                  id
                  views{
                    all{
                      pageCount
                      contentSelection
                      sortingBy
                      sorting
                      createdBy
                      createdDate
                    }
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

  media = `
  query{
    cmsTemplate2{
      entities{
        mediaGallery(id:"efa346e0-a8f0-4e79-9cd0-6f730b576ac5"){
          queries{
            galleryItem(first:10){
              items{
                cmsTemplate2_mediaItem{
                  id
                  views{
                    all{
                      details{
                        __typename ... on System_ImageMedia{
                          caption
                          imageUrl
                        }
                      }
                    }
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
  singleMedia = `
  query getSingleMedia($id:String!){
    cmsTemplate2{
      entities{
        mediaItem(id:$id) {
          id
          views{
            all{
              createdDate
              createdBy
              details{
                __typename ... on System_ImageMedia {
                  caption
                  imageUrl
                }
              }
            }
          }
        }
      }
    }
  }
`;

  uploadMedia = `
  mutation uploadImage($id: String!, $photo: Upload!, $caption: String!) {
    cmsTemplate2{
      entities{
        mediaGallery{
          uploadImage(id:$id, photo: $photo, caption: $caption) {
            id
            views{
              all{
                details{
                  __typename
                }
              }
            }
          }
        }
      }
    }
  }
`;

  deleteMedia = `
mutation deleteMedai($id: String!) {
  cmsTemplate2{
    entities{
      mediaItem{
        delete(id: $id)
      }
    }
  }
}
`;
SearchAscendingPostsByDate = `
  query getAscendingPostsByDate($first: Int,$categoryId:String){
    cmsTemplate2{
      queries{
        cmsTemplate2_SearchAscendingPostsByDate(first: $first,category:$categoryId){
          items{
            postPage{
              id
              views{
                all{
                  postTitle
                  createdDate
                   category{
                    categoryId
                    name
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
SearchDescendingPostsByDate = `
  query getDescendingPostsByDate($categoryId:String!){
    cmsTemplate2{
      queries{
        cmsTemplate2_SearchDescendingPostsByDate(first:10,category:$categoryId){
          items{
            postPage{
              id
              views{
                all{
                  postTitle
                }
              }
            }
          }
        }
      }
    }
  }
`;
SearchAscendingPostsByMostRead = `
  query getAscendingPostsByMostRead($categoryId:String!){
    cmsTemplate2{
      queries{
        cmsTemplate2_SearchAscendingPostsByMostRead(first:10,category:$categoryId){
          items{
            postPage{
              id
              views{
                all{
                  postTitle
                }
              }
            }
          }
        }
      }
    }
  }
`;
SearchDescendingPostsByMostRead = `
  query getDescendingPostsByMostRead($categoryId:String!){
    cmsTemplate2{
      queries{
        cmsTemplate2_SearchDescendingPostsByMostRead(first:10,category:$categoryId){
          items{
            postPage{
              id
              views{
                all{
                  postTitle
                }
              }
            }
          }
        }
      }
    }
  }
`;
SearchAscendingPostsByMostCommented = `
  query getAscendingPostsByMostCommented($categoryId:String!){
    cmsTemplate2{
      queries{
        cmsTemplate2_SearchAscendingPostsByMostCommented(first:10,category:$categoryId){
          items{
            postPage{
              id
              views{
                all{
                  postTitle
                }
              }
            }
          }
        }
      }
    }
  }
`;
SearchDescendingPostsByMostCommented = `
  query getDescendingPostsByMostCommented($categoryId:String!){
    cmsTemplate2{
      queries{
        cmsTemplate2_SearchDescendingPostsByMostCommented(first:10,category:$categoryId){
          items{
            postPage{
              id
              views{
                all{
                  postTitle
                }
              }
            }
          }
        }
      }
    }
  }
`;

  constructor() {}
}
