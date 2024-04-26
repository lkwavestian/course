import { stringify } from 'qs';
import request from '../utils/request';

export async function getGradeList(params) {
    return request(`/api/allGrade?${stringify(params)}`);
}

export async function getTeacherList(params) {
    return request('/api/changeRequestActingTeacherList', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function getCourseListSync(params) {
    return request(`/api/course?${stringify(params)}`);
}

export async function getListAllOrgTeachersSync(params) {
    return request(`/api/user/searchTeacher?${stringify(params)}`);
}
export async function getRoleList(params) {
    return request(`/api/role/baseTag/roleList?${stringify(params)}`);
}
export async function getSubjectList(params) {
    return request(`/api/course/subject/course?${stringify(params)}`);
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

export async function getWorkFlowRuleSync(params) {
    return request(`/api/workFlowRule?${stringify(params)}`);
}

export async function saveWorkFlowRuleSync(params) {
    return request('/api/saveWorkFlowRule', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function getCurrentUserSync(params) {
    return request(`/api/current/user?${stringify(params)}`);
}

export async function getListSchoolYearSync(params) {
    return request(`/api/schoolYear/listSchoolYear?${stringify(params)}`);
}

export async function findClassScheduleSync(params) {
    return request('/api/weekVersion/findClassSchedule', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function newListExchangeSync(params) {
    return request(`/api/scheduleResult/newListExchange?${stringify(params)}`);
}

export async function submitChangeRequestSync(params) {
    return request('/api/submitChangeRequest', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function updateChangeRequestSync(params) {
    return request('/api/updateChangeRequest', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function changeRequestDetailSync(params) {
    return request(`/api/changeRequestDetail?${stringify(params)}`);
}

export async function importSupplementSync(params) {
    return request('/api/teaching/excel/uploadFile', {
        method: 'POST',
        body: params,
    });
}

export async function getTotalLessonListSync(params) {
    return request(`/api/changeRequestResultList?${stringify(params)}`);
}

export async function selectCopySendRuleSync(params) {
    return request(`/api/selectCopySendRule?${stringify(params)}`);
}

export async function getActiveRelatedListSync(params) {
    return request(`/api/getActiveRelatedList?${stringify(params)}`);
}

export async function getChangeCourseRequestListSync(params) {
    return request('/api/listChangeCourseRequest', {
        method: 'POST',
        body: params,
    });
}

export async function getRecordListSync(params) {
    return request('/api/listActingChangeCourseRequest', {
        method: 'POST',
        body: params,
    });
}

export async function selectSupportVersionSync(params) {
    return request(`/api/selectSupportVersion?${stringify(params)}`);
}

export async function checkWorkFlowNodePermissionSync(params) {
    return request(`/api/checkWorkFlowNodePermission?${stringify(params)}`);
}

export async function getApproveCheckSync(params) {
    return request('/api/changeCourseRequestApproveCheck', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function getApproveSync(params) {
    return request(`/api/changeCourseRequestApprove?${stringify(params)}`);
}

export async function revokeRequestSync(params) {
    return request(`/api/revokeRequest?${stringify(params)}`);
}

export async function exportActingRequestListSync(params) {
    return request('/api/exportActingRequestList', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function listVersionChangeCourseRequestSync(params) {
    return request(`/api/listVersionChangeCourseRequest?${stringify(params)}`);
}

export async function publishChangeCourseRequestListSync(params) {
    return request('/api/publishChangeCourseRequestList', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function deleteWorkFlowRuleSync(params) {
    return request(`/api/deleteWorkFlowRule?${stringify(params)}`);
}

export async function selectScheduleCourseMessageSync(params) {
    return request(`/api/selectScheduleCourseMessage?${stringify(params)}`);
}

export async function getTeacherCalendarListSync(params) {
    return request(`/calendar/api/search/teachers/list/pc?${stringify(params)}`);
}

export async function getPersonalChangeCourseCountSync(params) {
    return request(`/api/personalChangeCourseCount?${stringify(params)}`);
}

export async function checkChangeCoursePermissionEduInBisUsingSync(params) {
    return request(`/api/checkChangeCoursePermissionEduInBisUsing?${stringify(params)}`);
}

export async function selfArrangeReadySync(params) {
    return request(`/api/selfArrangeReady?${stringify(params)}`);
}
