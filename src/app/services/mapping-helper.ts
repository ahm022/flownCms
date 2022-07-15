import * as _ from 'lodash';



export function mapSearchUserToItem(user: any) {

    return {
        id: _.get(user.system_User, 'id', null),
        name: _.get(user.system_User.views.cmsTemplate2_All, 'firstName', '') + ' ' + _.get(user.system_User.views.cmsTemplate2_All, 'lastName', ''),
        email: _.get(user.system_User.views.cmsTemplate2_All, 'email', '')
    }
}

export function mapPostToItem(post: any) {

  return {
      id: _.get(post.cmsTemplate2_post, 'id', null),
      author: _.get(post.cmsTemplate2_post.views.all.author.views.cmsTemplate2_All, 'firstName', '') + ' ' + _.get(post.cmsTemplate2_post.views.all.author.views.cmsTemplate2_All, 'lastName', ''),
      postTitle: _.get(post.cmsTemplate2_post.views.all, 'postTitle', ''),
      postDescription: _.get(post.cmsTemplate2_post.views.all, 'postDescription', ''),
      gated: _.get(post.cmsTemplate2_post.views.all, 'gated', ''),
      slug: _.get(post.cmsTemplate2_post.views.all, 'slug', ''),
      status: _.get(post.cmsTemplate2_post.views.all, 'status', ''),
      postImage: _.get(post.cmsTemplate2_post.views.all, 'postImage', '')
  }
}
