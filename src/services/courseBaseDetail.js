import { stringify } from 'qs';
import request from '../utils/request';

// 班级列表
export async function getCourseResultDetails(params) {
    return request('/api/choose/choosePlan/courseResultList', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 课程选课结果详情--班级学生详情列表
export async function getClassStudentList(params) {
    return request('/api/choose/choosePlan/classStudentList', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//批量更新课程是否开放报名
export async function batchUpdateCourseSignUp(params) {
    return request('/api/course/selection/batchUpdateCourseSignUp', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 课程选课结果详情--班级详情
export async function getCourseClassDetails(params) {
    return request('/api/choose/choosePlan/courseClassDetails', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 课程选课结果详情--基本信息
export async function getChooseCourseInfo(params) {
    return request('/api/choose/choosePlan/chooseCourseInfo', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 课程列表------
// 课程列表-选课计划信息
export async function getSelectionMessage(params) {
    return request(`/api/course/selection/message?${stringify(params)}`);
}

export async function checkCoursePlanAddPermission(params) {
    return request(`/api/course/selection/checkCoursePlanAddPermission?${stringify(params)}`);
}
export async function checkClassPermission(params) {
    return request(`/api/course/selection/checkClassPermission?${stringify(params)}`);
}

export async function selectGroupingByChoosePlan(params) {
    return request(`/api/choose/choosePlan/selectGroupingByChoosePlan?${stringify(params)}`);
}

// 选课计划-课程列表
export async function getSelectionList(params) {
    return request('/api/course/selection/selectionCourseList', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function listCourse(params) {
    return request('/api/course/manager/listCourse', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

/* // 选课计划-课程列表
export async function getSelectionList(params) {
    return request('/api/course/selection/list', {
        method: 'POST',
        body: {
            ...params
        }
    })
} */

// 选课计划-课程列表-移除
export async function deleteCourseChoose(params) {
    return request('/api/course/selection/deleteCourseChoose', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 选课计划-课程列表-班级更新
export async function groupUpdate(params) {
    return request('/api/course/selection/coursePlanning/editClass', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 选课计划-课程列表-班级详情回显
export async function getGroupSelectDetail(params) {
    return request('/api/course/selection/group/select', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 添加学生到班级--学生展示列表
export async function studentListOfClass(params) {
    return request('/api/choose/batchStudent/studentList', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}
// export async function studentListNew(params) {
//     return request('/api/stratify/getStudentList', {
//         method: 'POST',
//         body: {
//             ...params
//         }
//     })
// }
export async function studentListNew(params) {
    return request(`/api/stratify/getStudentList?${stringify(params)}`);
}
// 添加学生到班级
export async function addStudentClass(params) {
    return request('/api/choose/batchStudent/addStudentClass', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}
export async function addStudentClassNew(params) {
    return request('/api/stratify/addStudentClass', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 班级下学生管理-学生批量移除
export async function classStudentsBatchRemoval(params) {
    return request('/api/choose/batchStudent/classStudentsBatchRemoval', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 班级下学生管理-学生转移班级
export async function studentsClassTransfer(params) {
    return request('/api/choose/batchStudent/studentsClassTransfer', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 学生选课结果管理
export async function studentCourseResultsManagement(params) {
    return request('/api/choose/batchStudent/studentCourseResultsManagement', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 班级列表选中与取消选中
export async function uncheckAndCheck(params) {
    return request('/api/choose/batchStudent/uncheckAndCheck', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 批量更新同课程是否可重复报名
export async function courseRepeat(params) {
    return request('/api/course/selection/batchUpdateCourseRepeatApply', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 增开新班级
export async function addNewClass(params) {
    return request('/api/course/selection/coursePlanning/addClass', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function paymentNotice(params) {
    return request('/api/choose/batchStudent/generateBillOfPayment', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function chooseExportCourse(params) {
    return request(`/api/course/selection/chooseExportCourse?${stringify(params)}`);
}
export async function sendPayTuitionToPersonal(params) {
    return request(`/api/pay/sendPayTuitionToPersonal?${stringify(params)}`);
}

export async function toggleSelCourse(params) {
    return request(`/api/course/selection/toggleSelCourse?${stringify(params)}`);
}

export async function feeData(params) {
    return request(`/api/course/selection/getFeeData?${stringify(params)}`);
}

export async function getCatagory(params) {
    return request(`/api/course/selection/getCatagory?${stringify(params)}`);
}

export async function getAllCourse(params) {
    // return request(`/api/course/selection/getAllCourse?${stringify(params)}`);
    return request(`/api/course/manager/listCourse?${stringify(params)}`);
}

export async function getLotsDetail(params) {
    return request(`/api/course/selection/listCoursePlanningDetail?${stringify(params)}`);
}

// 取消报名
export async function cancelSignUp(params) {
    return request('/api/choose/batchStudent/cancelChooseSignUp', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 取消报名费用
export async function getCancelFee(params) {
    return request(`/api/choose/batchStudent/showFeePaid?${stringify(params)}`);
}

// 批量设置新老生
export async function batchNewOrOldStudent(params) {
    return request('/api/choose/batchStudent/batchNewOrOldStudent', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}
