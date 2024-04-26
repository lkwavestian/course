import { stringify } from 'qs';
import request from '../utils/request';

// 申请页面
export async function saveApplication(params) {
    return request('/api/school/register', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 学校采购模块的列表接口
export async function moduleList(params) {
    return request('/api/school/getSchool/all/module', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 学校采购模块的列表接口
export async function editDataList(params) {
    return request(`/api/school/getInformationById?${stringify(params)}`);
}

export async function dataList(params) {
    return request(`/api/school/getList?${stringify(params)}`);
}

export async function updateApplication(params) {
    return request('/api/school/update', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// export async function generateAccount(params) {
//     return request('/api/school/generateBasicSchoolData', {
//         method: 'POST',
//         body: {
//             ...params,
//         },
//     });
// }

export async function generateAccount(params) {
    return request(`/api/school/generateBasicSchoolData?${stringify(params)}`);
}

export async function getGenerateAccountList(params) {
    return request(`/api/school/getAdminUserBySchoolId?${stringify(params)}`);
}

// 学校采购模块的列表接口
export async function configCenterList(params) {
    return request('/api/school/getSchool/all/config', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function deleteSchoolById(params) {
    return request(`/api/school/deleteSchool?${stringify(params)}`);
}

//获取动态菜单接口
export async function getTemplateMenuList (params) {
    return request(`/api/school/getTemplateMenuList?${stringify(params)}`)
}

export async function getAttendanceList (params) {
    return request(`/api/school/getAttendanceList?${stringify(params)}`)
}