// 规则管理
import { stringify } from 'qs';
import request from '../utils/request';

//  规则新增
export async function newRuleManagement(params) {
    return request('/api/weekRule/save', {
        method: 'POST',
        body: params,
    });
}
// 周内规则修改
export async function addWeeklyRule(params) {
    return request('/api/weekRule/update', {
        method: 'POST',
        body: params,
    });
}

// excel导入学生成绩
export async function ruleImport(params) {
    return request('/api/addressRule/addressRuleExcelImport', {
        method: 'POST',
        body: params,
    });
}

// 已添加规则列表
export async function gethasRulesList(params) {
    return request('/api/weekRule/addedList', {
        method: 'POST',
        body: params,
    });
}

// 规则数量统计
export async function getruleCount(params) {
    return request(`/api/weekRule/ruleAmountStatistics?${stringify(params)}`);
}

// 规则类型下规则对象的规则列表
export async function getRulesListOfTypes(params) {
    return request('/api/weekRule/ruleList', {
        method: 'POST',
        body: params,
    });
}

// 规则禁用
export async function getRulesOpen(params) {
    return request(`/api/weekRule/disable?${stringify(params)}`);
}

// 规则启用
export async function getRulesDisabled(params) {
    return request(`/api/weekRule/enable?${stringify(params)}`);
}

// 根据版本，获取老师的作息列表
export async function getTeacherRestList(params) {
    return request('/api/weekRule/scheduleForTeacherList', {
        method: 'POST',
        body: params,
    });
}

// 根据作息获取不排课明细
export async function getDetailsRuleBasedSchedule(params) {
    return request(`/api/weekRule/notAvailableRuleCommonSchedule?${stringify(params)}`);
}

// 根据作息获取明细
export async function getDetailsBasedSchedule(params) {
    // return request(`/api/weekRule/scheduleDetail?${stringify(params)}`);
    return request(`/api/weekRule/listScheduleDetail?${stringify(params)}`);
}

//  老师列表
export async function getTeacherAllLists(params) {
    return request(`/api/weekVersion/teacherList?${stringify(params)}`);
}

//  班级列表
export async function getClassAllList(params) {
    return request(`/api/weekVersion/studentGroupList?${stringify(params)}`);
}

// 新班级列表
export async function getNewClassAllList(params) {
    return request(`/api/weekVersion/newStudentGroupList?${stringify(params)}`);
}

// 课程列表
export async function getCourseAllList(params) {
    return request(`/api/weekVersion/courseList?${stringify(params)}`);
}

// 根据课程获取AC列表
export async function getCourseAcList(params) {
    return request('/api/weekRule/activityList', {
        method: 'POST',
        body: params,
    });
}

// 根据版本，班级获取作息
export async function getAccordingVersion(params) {
    return request('/api/weekRule/scheduleForClassList', {
        method: 'POST',
        body: params,
    });
}

//根据版本，课程获取作息
export async function getCourseAcquisitionSchedule(params) {
    return request('/api/weekRule/scheduleForCourseList', {
        method: 'POST',
        body: params,
    });
}

//规则删除
export async function getRuleToDelete(params) {
    return request(`/api/weekRule/delete?${stringify(params)}`);
}

// 获取一个周内规则信息
export async function getWeeklyRuleInformation(params) {
    return request(`/api/weekRule/getOne?${stringify(params)}`);
}
// 获取角色标签列表
export async function getRoleTag(params) {
    return request(`/api/weekRule/roleTag?${stringify(params)}`);
}

// 一键冲突
export async function createCompareGroup(params) {
    return request(`/api/stratify/system/createCompareGroup?${stringify(params)}`);
}

// 获取筛选班级
export async function getFilterGrade(params) {
    return request('/api/addressRule/classAddressList', {
        method: 'POST',
        body: params,
    });
}

// 获取筛选班级
export async function filterSubject(params) {
    return request('/api/addressRule/courseAddressList', {
        method: 'POST',
        body: params,
    });
}

// 获取班级类型下拉
export async function classTypeList(params) {
    return request(`/api/addressRule/classTypeList?${stringify(params)}`);
}

// 更新班级信息
export async function saveSites(params) {
    return request('/api/addressRule/saveAddressRule', {
        method: 'POST',
        body: params,
    });
}
// 更新学科信息
export async function saveSubjects(params) {
    return request('/api/weekRule/updatedSubjectInfo', {
        method: 'POST',
        body: params,
    });
}

//批量设置场地信息
export async function getBatchSetSiteRule(params) {
    return request('/api/site/getBatchSetSiteRule', {
        method: 'POST',
        body: params,
    });
}

//获取周版本列表
export async function getVersionList(params) {
    return request('/api/weekVersion/findVersion', {
        method: 'POST',
        body: params,
    });
}

//规则复制
export async function ruleCopy(params) {
    return request('/api/weekRule/ruleCopy', {
        method: 'POST',
        body: params,
    });
}

export async function getCompareGroupListSync(params) {
    return request('/api/stratify/selectCompareGroupGrouping', {
        method: 'POST',
        body: params,
    });
}

export async function compareGroupGroupingExcelImportSync(params) {
    return request('/api/stratify/compareGroupGroupingExcelImport', {
        method: 'POST',
        body: params,
    });
}

export async function deleteCompareGroupGroupingSync(params) {
    return request(`/api/stratify/deleteCompareGroupGrouping?${stringify(params)}`);
}

export async function getCoursePackageMessageSync(params) {
    return request('/api/weekRule/getCoursePackageMessage', {
        method: 'POST',
        body: params,
    });
}

export async function getCoursePackageMergeGroupListSync(params) {
    return request(`/api/weekRule/getCoursePackageMergeGroupList?${stringify(params)}`);
}

//分层选修课班列表
export async function getListCourseGroupSync(params) {
    return request(`/api/weekRule/listCourseGroup?${stringify(params)}`);
}
