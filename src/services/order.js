import { stringify } from 'qs';
import request from '../utils/request';

// 账户收入明细查询
export async function batchOrderQuery(params) {
    return request('/api/batchOrder/batchOrderQuery', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 查询交易流水
export async function getTransactionsDetail(params) {
    return request('/api/pay/getTransactionsDetail', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 账户收入明细查询
export async function personalArrangements(params) {
    return request('/api/worksheet/teacherView', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}
export async function personalSubjectTemplate(params) {
    return request(`/api/worksheet/personalSubjectTemplate?${stringify(params)}`);
}

//学科首席列表
export async function subjectChief(params) {
    return request('/api/worksheet/subjectChief', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}
// export async function subjectChief(params) {
//     return request(`/api/worksheet/subjectChief?${stringify(params)}`);
// }

//学段管理岗位列表
export async function disciplineManagement(params) {
    return request(`/api/worksheet/stageRole?${stringify(params)}`);
}

//年级明细列表
export async function gradeDetails(params) {
    return request('/api/worksheet/gradeTeacherWorkSheet', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}
//学段列表
export async function sectionList(params) {
    return request('/api/pay/sectionList', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}
//报表设置列表
export async function currentSemesterSubjectAsync(params) {
    console.log('currentSemesterSubjectAsync');
    return request(`/api/worksheet/currentSemesterSubject?${stringify(params)}`);
}
//完成报表设置
export async function createStageSubject(params) {
    return request('/api/worksheet/createStageSubject', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}
//回显列表
export async function stageSubject(params) {
    return request(`/api/worksheet/stageSubject?${stringify(params)}`);
}

//更新学科设置
export async function updateStageSubject(params) {
    return request('/api/worksheet/updateStageSubject', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//
export async function changeViewConfig(params) {
    return request('/api/worksheet/changeViewConfig', {
        method: 'POST',
        body: params,
    });
}
