import { stringify } from 'qs';
import request from '../utils/request';

// 可选课程列表
/* export async function getListCourse(params) {
    return request('/api/choose/course/list', {
        method: 'POST',
        body: {
            ...params
        }
    })
} */
// 可选课程列表
export async function getListCourse(params) {
    return request('/api/choose/courseList', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}
/* // 可选课程列表
export async function getListCourse(params) {
    return request('/api/choose/course/list', {
        method: 'POST',
        body: {
            ...params
        }
    })
} */

// 已选课程列表
export async function submittedCourse(params) {
    return request('/api/choose/selectedCoursesList', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 小课表
export async function getSchedule(params) {
    return request(`/api/choose/course/schedule?${stringify(params)}`);
}

// 开课周期列表
export async function getCourseStartPeriod(params) {
    return request(`/api/choose/courseStartPeriod?${stringify(params)}`);
}

// 学科分类列表
export async function getSubjectList(params) {
    return request(`/api/choose/subjectList?${stringify(params)}`);
}
export async function getSubjectListNew(params) {
    return request(`/course/api/goods/subjectList?${stringify(params)}`);
}

// 查看完整课表
export async function getComplateSchedule(params) {
    return request('/api/selection/result', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 查看学生选课结果-时间分段
export async function getSelectionQuarter(params) {
    return request('/api/selection/quarter', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 学生端--选课计划列表
export async function getStudentListCourse(params) {
    return request('/api/choose/studentListCourse', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}
export async function getStudentListCourseNew(params) {
    return request('/course/api/choose/studentListCourse', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 删除已选课程
export async function deleteSelectedCourses(params) {
    return request('/api/choose/deleteSelectedCourses', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 提交已选课程
export async function submitSelectedCourse(params) {
    return request('/api/choose/submitSelectedCourses', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 已选课程删除，报名，取消报名
export async function getCancelAndSignUp(params) {
    return request('/api/choose/cancelAndSignUp', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}
export async function cancelPay(params) {
    return request('/course/api/choose/cancelSignUp', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 学生端选课计划课程详情
export async function getStudentCourseDetails(params) {
    return request('/api/choose/studentSideCourseDetails', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 课程介绍
export async function getCourseMessage(params) {
    return request(`/api/choose/course/message?${stringify(params)}`);
}
export async function getAllCourse(params) {
    return request(`/course/api/goods/getAllCourse?${stringify(params)}`);
}
// export async function getAllCourse(params) {
//     return request('/course/api/goods/getAllCourse', {
//         method: 'POST',
//         body: {
//             ...params,
//         },
//     });
// }
export async function getListCourseNew(params) {
    return request(`/course/api/goods/studentListCourse?${stringify(params)}`);
}
// export async function getListCourseNew(params) {
//     return request('/course/api/goods/studentListCourse', {
//         method: 'POST',
//         body: {
//             ...params,
//         },
//     });
// }

// 课程报名
export async function grabSignUp(params) {
    return request('/api/choose/grabSignUp', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 先到先得选课余量接口
export async function optionalMargin(params) {
    return request('/api/choose/optionalMargin', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}
export async function optionalMarginNew(params) {
    return request('/course/api/goods/optionalMargin', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 学生端 上课时间
export async function getSchoolTime(params) {
    return request(`/api/choose/weekDayList?${stringify(params)}`);
}

//提交信息
export async function saveInformation(params) {
    return request('/course/api/goods/saveInformation', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//获得信息
export async function getInformation(params) {
    return request(`/course/api/goods/getInformation?${stringify(params)}`);
}

//获取绑定信息
export async function getUserAccountBindInformation(params) {
    return request(`/course/api/goods/getUserAccountBindInformation?${stringify(params)}`);
}

//获取验证码
export async function sendMessageCode(params) {
    return request(`/course/api/goods/sendMessageCode?${stringify(params)}`);
}

//验证验证码
export async function checkMessageCode(params) {
    return request(`/course/api/goods/checkMessageCode?${stringify(params)}`);
}

//解绑
export async function unbindOtherAccount(params) {
    return request(`/course/api/goods/unbindOtherAccount?${stringify(params)}`);
}

//微信解绑
export async function unbindWeChat(params) {
    return request(`/course/api/goods/unbindWeChat?${stringify(params)}`);
}

//修改密码
export async function updatePassword(params) {
    return request(`/course/api/goods/updatePassword?${stringify(params)}`);
}

//获得家长孩子
export async function fetchParentChildList(params) {
    return request(`/api/choose/selectParentChildList?${stringify(params)}`);
}
