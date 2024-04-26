import { stringify } from 'qs';
import request from '../utils/request';

export async function fetchGroupList(params) {
    return request(`/api/student/roster/listGroup?${stringify(params)}`)
}

//表格数据
export async function fetchStudentTableData(params) {
    return request('/api/student/roster/list', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function updateStudentTutorOrNumber(params) {
    return request('/api/student/roster/updateStudentTutorOrNumber', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function importNum(params) {
    return request('/api/student/roster/importStudentTutorAndNumber', {
        method: 'POST',
        body: params,
    });
}

export async function getTeacherList(params) {
    return request(`/api/user/searchTeacher?${stringify(params)}`)
}

export async function showConfig(params) {
    return request(`/api/student/roster/showConfig?${stringify(params)}`)
}