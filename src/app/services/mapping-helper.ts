import * as _ from 'lodash';



export function mapSearchUserToItem(user: any) {
    console.log("user",user)
    return {
        id: _.get(user.system_User, 'id', null),
        name: _.get(user.system_User.views.cmsTemplate2_All, 'firstName', '') + ' ' + _.get(user.system_User.views.cmsTemplate2_All, 'lastName', ''),
        email: _.get(user.system_User.views.cmsTemplate2_All, 'email', '')
    }
}
