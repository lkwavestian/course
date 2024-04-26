import { stringify } from 'qs';
import request from '../utils/request';

//教务当前用户信息
export async function getCurrentUser(params) {
    return request(`/api/current/user?${stringify(params)}`);
}

export async function getNewCurrentUser(params) {
    return request(`/course/api/current/user?${stringify(params)}`);
}

//收费当前用户信息
// export async function getPayCurrentUser(params) {
//     return request(`/api/current/user?${stringify(params)}`);
// }

//上传封面图--oss授权地址
export async function getOssAssume(params) {
    return request(`/api/sts/token?${stringify(params)}`);
}

//切换语言
export async function queryLang(params) {
    return request(`/api/set_language?${stringify(params)}`);
}

export async function queryLangNew(params) {
    return request(`/course/api/set_language?${stringify(params)}`);
}

export async function queryNoticeList(params) {
    return request(`/api/messageCenter/page?${stringify(params)}`);
}

//上传附件到服务器--最新-利用oss
export async function uploadFileNew(params) {
    return request(`/api/upload_file/new?${stringify(params)}`);
}

export async function queryNoticeNumber() {
    return request(`/api/messageCenter/count`);
}

//消息标为已读
export async function queryNoticeRead(params) {
    return request('/api/messageCenter/read', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//当前用户是否可以显示入口
export async function havePower(params) {
    return request(`/api/teaching/listUserAclConfig?${stringify(params)}`);
}

//判断当前用户是否可以显示收费管理入口
export async function havePayPower(params) {
    return request(`/api/pay/listUserAclConfig?${stringify(params)}`);
}

//查找所有人与组织列表
export async function fetchTeacherAndOrg(params) {
    return request(`/api/listAllOrgTeachers?${stringify(params)}`);
}

export async function listRolePermission(params) {
    return request(`/api/role/baseTag/listRolePermission?${stringify(params)}`);
}
