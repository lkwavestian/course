import { stringify } from 'qs';
import request from '../utils/request';

// 选课详情
export async function chooseCourseDetails(params) {
    return request(`/api/choose/choosePlan/chooseCourseDetails?${stringify(params)}`);
}

// 选课计划--批次--列表
export async function chooseCoursePlanBatchList(params) {
    return request(
        `/api/choose/batchChooseCoursePlan/chooseCoursePlanBatchList?${stringify(params)}`
    );
}
export async function newOpenChooseCourse(params) {
    return request(`/api/goods/newGoodOpenChooseCourse?${stringify(params)}`);
}
export async function goodCloseChooseCourse(params) {
    return request(`/api/goods/goodCloseChooseCourse?${stringify(params)}`);
}
export async function getCourseSchedule(params) {
    return request(`/api/choose/batchChooseCoursePlan/getCourseSchedule?${stringify(params)}`);
}
export async function getSchedule(params) {
    return request(`/api/choose/batchChooseCoursePlan/getSchedule?${stringify(params)}`);
}
export async function addCoursePlan(params) {
    return request(`/api/course/selection/addCoursePlan?${stringify(params)}`);
}

/* export async function addCoursePlan(params) {
    return request('/api/course/selection/addCoursePlan', {
        method: 'POST',
        body: {
            ...params,
        },
    });
} */

// 选课计划--批次--编辑
export async function addedOrEditChooseCoursePlanBatch(params) {
    return request('/api/choose/batchChooseCoursePlan/addedOrEditChooseCoursePlanBatch', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 选课计划--批次--删除
export async function batchChooseCourseDelete(params) {
    return request('/api/choose/batchChooseCoursePlan/batchChooseCourseDelete', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 管理选课课程班级-导入班课计划
export async function coursePlanning(params) {
    return request('/api/choose/choosePlan/import/coursePlanning', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 选课-从Excel导入
export async function excelImport(params) {
    return request('/api/choose/choosePlan/importDefaultCoursePlanning', {
        method: 'POST',
        body: params,
    });
}

// 选课-从Excel导入
export async function excelLotImport(params) {
    return request('/api/choose/choosePlan/updateDefaultCoursePlanning', {
        method: 'POST',
        body: params,
    });
}
