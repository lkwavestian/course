import { stringify } from 'qs';
import request from '../utils/request';

//查询学期信息
export async function getSemester(params) {
    return request('/api/selectAllSemester', {
        method: 'POST',
        body: params,
    });
}

//获取学年
export async function selectAllSchoolYear(params) {
    return request(`/api/selectAllSchoolYear?${stringify(params)}`);
}

export async function getCourseLists(params) {
    return request('/api/defaultCoursePlan/import/course', {
        method: 'POST',
        body: params,
    });
}

//查询课
export async function listChooseCourse(params) {
    return request('/api/choose/choosePlan/listChooseCourse', {
        method: 'POST',
        body: params,
    });
}

//查询年级信息
export async function getGrade(params) {
    return request(`/api/allGrade?${stringify(params)}`);
}

export async function allGrade(params) {
    return request(`/api/teaching/allGrade?${stringify(params)}`);
}

//查询时间信息
export async function getDateList(params) {
    return request(`/api/scheduleList?${stringify(params)}`);
}

//获取作息表
export async function getCalendarList(params) {
    return request(`/api/selectBaseScheduleAndDetail?${stringify(params)}`);
}
// 删除作息表（及表下的内容）
export async function deleteBaseListText(params) {
    return request(`/api/deleteBaseScheduleById?${stringify(params)}`);
}
//删除作息表的内容
export async function deleteCalendar(params) {
    return request(`/api/deleteBaseScheduleDetailById?${stringify(params)}`);
}

//添加作息表
export async function addScheduleList(params) {
    return request('/api/insertBaseSchedule', {
        method: 'POST',
        body: params,
    });
}

//编辑作息表
export async function editScheduleList(params) {
    return request('/api/updateBaseSchedule', {
        method: 'POST',
        body: params,
    });
}

//复制作息表
export async function copyScheduleList(params) {
    return request('/api/copyBaseScheduleById', {
        method: 'POST',
        body: params,
    });
}

// 添加作息内容
export async function addScheduleText(params) {
    return request('/api/insertBaseScheduleDetail', {
        method: 'POST',
        body: params,
    });
}

//查询作息表内容
export async function fetchCalendarDetail(params) {
    return request(`/api/selectBaseScheduleDetail?${stringify(params)}`);
}

// 修改作息内容
export async function modifScheduleWork(params) {
    return request('/api/updateBaseScheduleDetail', {
        method: 'POST',
        body: params,
    });
}

// 查询作息详情
export async function fetchWorkEnquiry(params) {
    return request(`/api/selectBaseSchedule?${stringify(params)}`);
}

// 查询新旧作息表
export async function changeSchedulelist(params) {
    return request(`/api/mapping/schedule?${stringify(params)}`);
}

// 查询新旧作息表列表
export async function changeDifference(params) {
    return request(`/api//show/schedule/difference?${stringify(params)}`);
}

//更换作息表
export async function changeSchedule(params) {
    // return request(`/api/change/schedule?${stringify(params)}`);
    // return request(`/api/checkChangeSchedule?${stringify(params)}`);
    return request('/api/checkChangeSchedule', {
        method: 'POST',
        body: params,
    });
}

export async function versionScheduleChange(params) {
    return request('/api/versionScheduleChange', {
        method: 'POST',
        body: params,
    });
}

//更换作息表
export async function changeDay(params) {
    return request('/api/change/day', {
        method: 'POST',
        body: params,
    });
}

// 所有班级
export async function getClassList(params) {
    return request('/api/choose/batchStudent/playGradeIdQueryClass', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 所有学生
export async function allStudent(params) {
    return request('/api/choose/batchStudent/allStudent', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 获取学段列表
export async function allStage(params) {
    return request(`/api/teaching/allStage?${stringify(params)}`);
}

export async function getScheduleList(params) {
    return request(`/api/gradeAndVersionMappingSchedule?${stringify(params)}`);
}

// 学段年级
export async function getAllStageGrade(params) {
    return request(`/api/teaching/allStageGrade?${stringify(params)}`);
}

// 调换课自动创建版本
export async function copyLatestVersion(params) {
    return request('/api/weekVersion/copyLatestVersion', {
        method: 'POST',
        body: params,
    });
}

// 作废作息表
export async function scheduleInvalidInfo(params) {
    return request(`/api/schedule/invalid?${stringify(params)}`);
}

// 确认作废
export async function confirmInvalid(params) {
    return request(`/api/schedule/invalid/confirm?${stringify(params)}`);
}

// 复制排课结果周期列表
export async function getByRangeTimeWeeklyCurrentVersion(params) {
    return request(`/api/weekVersion/getByRangeTimeWeeklyCurrentVersion?${stringify(params)}`);
}

// 根据时间查询学期
export async function getSemesterListByTime(params) {
    return request(`/api/semester/time?${stringify(params)}`);
}

// 按天复制
export async function scheduleDetailWeedDayCopySync(params) {
    return request(`/api/scheduleDetailWeedDayCopy?${stringify(params)}`);
}

// 按天删除
export async function scheduleDetailWeedDayDeleteSync(params) {
    return request(`/api/scheduleDetailWeedDayDelete?${stringify(params)}`);
}
