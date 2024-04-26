import { func } from 'prop-types';
import { stringify } from 'qs';
import request from '../utils/request';

//查询学期对应卡片
export async function getCardMsg(params) {
    return request(`/api/divide/planList?${stringify(params)}`);
}

//查询学期对应卡片
export async function getAllGrade(params) {
    return request(`/api/allGrade?${stringify(params)}`);
}

//查询分班详情
export async function getDetail(params) {
    return request(`/api/course/getDetailById?${stringify(params)}`);
}

//导入学生选课志愿列表
export async function importStudentColunteer(params) {
    return request(`/api/divide/student/studentCourseCombinationView?${stringify(params)}`);
}

// 学生选课志愿excel导入
export async function importStudentExcel(params) {
    return request('/api/divide/studentChooseImport', {
        method: 'POST',
        body: params,
    });
}

//导入学生成绩列表
export async function importStudentScoreList(params) {
    return request(`/api/divide/student/studentScoreView?${stringify(params)}`);
}

// excel导入学生成绩
export async function importStudentScoreExcel(params) {
    return request('/api/divide/student/importDivideStudentScore', {
        method: 'POST',
        body: params,
    });
}

//导入班级列表
export async function importStudentClassList(params) {
    return request(`/api/divideGroup/studentClassList?${stringify(params)}`);
}

// excel导入班级
export async function importStudentClassExcel(params) {
    return request('/api/divideGroup/importExcelClass', {
        method: 'POST',
        body: params,
    });
}

//excel 导入分班结果
export async function importStudentResultExcel(params) {
    return request('/api/divide/result/importDivideStudentClassResult', {
        method: 'POST',
        body: params,
    });
}

//excel 导入分班结果
export async function studentCombinationImport(params) {
    return request('/api/divide/studentCombinationImport', {
        method: 'POST',
        body: params,
    });
}
//导入分班结果列表
export async function importStudentResultList(params) {
    return request(`/api/divideGroup/studentResultList?${stringify(params)}`);
}

//查询分班详情
export async function getResult(params) {
    return request(`/api/course/getResult?${stringify(params)}`);
}

// 获取学期接口
export async function getAllSemester(params) {
    return request(`/api/selectBySchoolIdAllSemester?${stringify(params)}`);
}

// 创建分班方案
export async function addClass(params) {
    return request('/api/divide/planCreate', {
        method: 'POST',
        body: params,
    });
}

//调整到新班级
export async function adjustToadmin(params) {
    return request('/api/divideGroup/adjustToAdmin', {
        method: 'POST',
        body: params,
    });
}
//调整到新班级
export async function adjustTolayer(params) {
    return request('/api/divideGroup/adjustToLayer', {
        method: 'POST',
        body: params,
    });
}

// 获取调整到班级
export async function allClasses(params) {
    return request(`/api/divideGroup/allClass?${stringify(params)}`);
}

// 获取课位方案
export async function getclaPro(params) {
    return request(`/api/divide/result/divideResultTeachingClassView?${stringify(params)}`);
}

// 获取调整到班级
export async function allCourses(params) {
    return request(`/api/divideGroup/allCourse?${stringify(params)}`);
}

// 获取调整到班级
export async function getPos(params) {
    return request(`/api/divideGroup/getAllAdjustPos?${stringify(params)}`);
}

// 获取调整到班级
export async function handleOkAdjust(params) {
    return request('/api/divide/result/updateGroup', {
        method: 'POST',
        body: params,
    });
}

// 获取全部成绩
export async function getAdminScore(params) {
    return request(`/api/divide/result/divideResultAdminClassScoreView?${stringify(params)}`);
}

// 获取全部成绩
export async function getAdminPos(params) {
    return request(`/api/divide/result/divideResultAdminClassView?${stringify(params)}`);
}

// 导出教学班课位结果
export async function exportDivideResultAdminClassView(params) {
    return request(`/api/divide/result/exportDivideResultAdminClassView?${stringify(params)}`);
}

// 导出教学班成绩结果
export async function exportDivideResultAdminClassScoreView(params) {
    return request(`/api/divide/result/exportDivideResultAdminClassScoreView?${stringify(params)}`);
}
// 导出教学班成绩结果
export async function exportDivideResultTeachingClassView(params) {
    return request(`/api/divide/result/exportDivideResultTeachingClassView?${stringify(params)}`);
}
// 导出教学班成绩结果
export async function exportDivideResultStudentView(params) {
    return request(`/api/divide/result/exportDivideResultStudentView?${stringify(params)}`);
}
// 导出教学班成绩结果
export async function divideResultStudentView(params) {
    return request(`/api/divide/result/divideResultStudentView?${stringify(params)}`);
}
// 导出教学班成绩结果
export async function studentCourseCombinationView(params) {
    return request(`/api/divide/student/studentCourseCombinationView?${stringify(params)}`);
}
// 导出教学班成绩结果
export async function divideResultCombinationView(params) {
    return request(`/api/divide/result/divideResultCombinationView?${stringify(params)}`);
}
// 导出教学班成绩结果
export async function showCombinationDetail(params) {
    return request(`/api/divide/result/showCombinationDetail?${stringify(params)}`);
}
// 更新组合信息
export async function updateCombination(params) {
    return request('/api/divide/result/updateCombination', {
        method: 'POST',
        body: params,
    });
}
//编辑选课组合回显-学生视角页面
export async function choiceSelectList(params) {
    return request(`/api/divide/result/showStuCombinationDetail?${stringify(params)}`);
}
//选课组合-学生视角确认
export async function studentConfirm(params) {
    return request('/api/divide/result/updateStuCombination', {
        method: 'POST',
        body: params,
    });
}
//同步教学班分班结果——确定同步
// export async function confirmSync(params) {
//     return request('/api/divide/sync/schedule/studentToGroup', {
//         method: 'POST',
//         body: params,
//     });
// }
export async function confirmSync(params) {
    return request(`/api/divide/sync/schedule/studentToGroup?${stringify(params)}`);
}
//同步课表——确定同步
export async function confirmSyncText(params) {
    return request('/api/divide/sync/schedule/automaticScheduleResult', {
        method: 'POST',
        body: params,
    });
}

//同步课表——保存设置
export async function saveDividePlanSyncSchduleResult(params) {
    return request('/api/divide/sync/schedule/saveDividePlanSyncScheduleResult', {
        method: 'POST',
        body: params,
    });
}

// 分班方案详情
export async function dividePlanDetail(params) {
    return request(`/api/divide/sync/schedule/dividePlanDetail?${stringify(params)}`);
}
//课表版本接口
export async function weekVersionList(params) {
    return request('/api/divide/sync/schedule/weekVersionList', {
        method: 'POST',
        body: params,
    });
}

// 学生班级excel导入
export async function importStudentClassSettingExcel(params) {
    return request('/api/divide/result/importDivideStudentClass', {
        method: 'POST',
        body: params,
    });
}
// 编辑分班方案
export async function editClassPlan(params) {
    return request('/api/divide/editClassPlan', {
        method: 'POST',
        body: params,
    });
}

//分班结果-教学班视角检查冲突
export async function checkDivideResultClass(params) {
    return request(`/api/divide/result/checkDivideResultClass?${stringify(params)}`);
}
