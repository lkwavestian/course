import { stringify } from 'qs';
import request from '../utils/request';

//课表--列表视图
export async function getClubDataSource(params) {
    return request('/api/free/pageResult', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//新建club--获取课程列表
export async function fetchClubCourse(params) {
    return request(`/api/defaultCoursePlan/club/course?${stringify(params)}`);
}

export async function activeStudentSeatNumberDownloadCheck(params) {
    return request(`/api/activeStudentSeatNumberDownloadCheck?${stringify(params)}`);
}

//批量创建club
export async function createClubCourse(params) {
    return request('/api/free/club/schedule', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//生成座位号
export async function generateSeat(params) {
    return request('/api/createActiveStudentSeatNumber', {
        method: 'POST',
        body: params,
    });
}

//导入活动校验
export async function activeImportCheck(params) {
    return request('/api/activeImportCheck', {
        method: 'POST',
        body: params,
    });
}

//导入活动
export async function activeImport(params) {
    return request('/api/activeImport', {
        method: 'POST',
        body: params,
    });
}

//批量删除活动
export async function batchDeleteFreeScheduleResult(params) {
    return request('/api/batchDeleteFreeScheduleResult', {
        method: 'POST',
        body: params,
    });
}

//批量公布活动
export async function batchPublishActive(params) {
    return request('/api/batchPublishActive', {
        method: 'POST',
        body: params,
    });
}
