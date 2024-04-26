import { stringify } from 'qs';
import request from '../utils/request';

// 导入班级信息
export async function fetchImportClass(params) {
    return request('/api/course/selection/import/chooseCourseGroupToStudent', {
        method: 'POST',
        body: params,
    });
}

// 学生信息列表
export async function listBatchStudentInfo(params) {
    return request('/api/choose/batchStudent/listBatchStudentInfo', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 添加学生--搜索的学生列表
export async function selectChooseStudentList(params) {
    return request('/api/choose/batchStudent/selectChooseStudentList', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 添加学生到批次
export async function addStudent(params) {
    return request('/api/choose/batchStudent/addStudent', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 批次学生批量移除
export async function studentBatchRemoval(params) {
    return request('/api/choose/batchStudent/studentBatchRemoval', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 开放选课
export async function openChooseCourse(params) {
    let schoolId = params.schoolId;
    console.log(schoolId,'ssss')
    let url = ['1000001000', '1000001001'].includes(schoolId.toString())
        ? '/api/goods/openChooseCourse'
        : '/api/choose/batchStudent/openChooseCourse';
    delete params.schoolId;
    return request(`${url}?${stringify(params)}`);
}

// 调整时间
export async function batchTransferStudent(params) {
    return request('/api/choose/batchStudent/batchTransferStudent', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 发送邮件通知
export async function sendNoticeForParents(params) {
    return request('/api/choose/student/sendMessage', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 邮件预览内容
// export async function previewEmail(params) {
//     return request('/api/choose/batchStudent/previewEmail', {
//         method: 'POST',
//         body: {
//             ...params,
//         },
//     });
// }
export async function previewEmail(params) {
    return request(`/api/choose/getTemplateContent?${stringify(params)}`);
}
export async function getStudentsByClass(params) {
    return request(`/api/choose/batchStudent/listAllChooseCourseGroup?${stringify(params)}`);
}

// 学生列表接口--年级接口
export async function allGradeOfAS(params) {
    return request('/api/choose/batchStudent/allGrade', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 学生列表接口--年级接口
export async function allGradeAndGroup(params) {
    return request(`/api/choose/batchStudent/getGradeAndGroupModelList?${stringify(params)}`);
}

// 选课结果生效
export async function getEffective(params) {
    return request(`/api/choose/chooseResultManage/chooseResultEffective?${stringify(params)}`);
}

// 取消开课
export async function cancelPlan(params) {
    return request('/api/course/selection/cancelCoursePlan', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//缓存刷新
export async function fetchCacheRefresh(params) {
    return request(`/api/choose/flushChooseCache?${stringify(params)}`);
}

//缓存刷新
export async function syncToScheduleTemplate(params) {
    return request(`/api/course/selection/syncToScheduleTemplate?${stringify(params)}`);
}
