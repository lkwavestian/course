import { stringify } from 'qs';
import request from '../utils/request';

//班级课表-待排课节
export async function findClassScheduleAC(params) {
    return request(`/api/weekVersion/findClassScheduleAC?${stringify(params)}`);
}

// 已排课节冲突信息
export async function timeTableConflictInformation(params) {
    return request('/api/scheduleResult/conflictInformation', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 课节冲突信息
export async function conflictInformationAsync(params) {
    return request('/api/scheduleResult/conflictInformation', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 获取班级list
export async function findStudentViewGroupList(params) {
    return request('/api/weekVersion/findGroup', {
        method: 'POST',
        body: params,
    });
}

// 获取学生list
export async function findStudentViewStudentList(params) {
    return request('/api/weekVersion/findStudent', {
        method: 'POST',
        body: params,
    });
}
