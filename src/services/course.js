import { func } from 'prop-types';
import { stringify } from 'qs';
import request from '../utils/request';

//查询科目信息
export async function getSubjectList(params) {
    return request(`/api/course/subject?${stringify(params)}`);
}
export async function getLotSubjects(params) {
    return request(`/api/course/selection/listSubject?${stringify(params)}`);
}
export async function newListCourse(params) {
    return request(`/api/course/selection/listCourse?${stringify(params)}`);
}

// 新查询科目信息
export async function getNewSubjectList(params) {
    return request(`api/course/findAllSubject?${stringify(params)}`);
}

//查询课程信息
export async function getCourseList(params) {
    return request(`/api/course?${stringify(params)}`);
}

//查询班级信息
export async function getStudentGroup(params) {
    return request(`/api/studentGroup/gradeByType?${stringify(params)}`);
}

export async function getStudentGroup1(params) {
    return request(`/api/studentGroup/gradeByOther?${stringify(params)}`);
}

//是否显示公布
export async function getPublishResult(params) {
    return request(`/api/check/publish/result?${stringify(params)}`);
}

//查询收费单状态
export async function getCheckPayTuitionPlan(params) {
    return request(`/api/pay/checkPayTuitionPlanByCoursePlanId?${stringify(params)}`);
}
//第一次创建收费单
export async function getCreatePayTuitionPlan(params) {
    return request(`/api/pay/createPayTuitionPlanByCourseSelection?${stringify(params)}`);
}
//重新创建收费单
export async function getReCreatePayTuitionPlan(params) {
    return request(`/api/pay/reCreatePayTuitionPlanByCoursePlanId?${stringify(params)}`);
}
//缴费单是否生成中
export async function createPayTuitionPlanResult(params) {
    return request(`/api/pay/get/CreatePayTuitionPlan/result?${stringify(params)}`);
}

//查询课时计划
export async function getCoursePlan(params) {
    return request('/api/defaultCoursePlan/pageCourse', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//查询教师列表
export async function getTeacherList(params) {
    return request(`/api/user/searchTeacher?${stringify(params)}`);
}

//查询课程设置
export async function getCoursePlanning(params) {
    return request(`/api/defaultCoursePlan/getCoursePlanning?${stringify(params)}`);
}
/* export async function getPayChargeItemList(params) {
    return request(`/api/choose/choosePlan/getPayChargeItemList?${stringify(params)}`);
} */

export async function getPayChargeItemList(params) {
    return request(`/api/choose/choosePlan/getPayChargeItemList`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function showCoursePlanningDetail(params) {
    return request(`/api/course/selection/showCoursePlanningDetail?${stringify(params)}`);
}
// export async function grabSignUp(params) {
//     return request(`/course/api/goods/grabSignUp?${stringify(params)}`);
// }
export async function grabSignUp(params) {
    return request(`/course/api/goods/grabSignUp`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function showCoursePlanningDetailMobile(params) {
    return request(`/course/api/goods/showCoursePlanningDetail?${stringify(params)}`);
}

export async function uploadMainImgs(params) {
    return request(`/api/upload_file`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//删除课程子计划
export async function fetchDeletePlan(params) {
    return request(`/api/defaultCoursePlan/delete?${stringify(params)}`);
}

//导入课时计划
export async function confirmImport(params) {
    return request(`/api/defaultCoursePlan/copy?${stringify(params)}`);
}

//导入计划
export async function confirmImportSub(params) {
    return request(`/api/defaultCoursePlan/import`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}
//设置课程
export async function updatCoursePlanning(params) {
    return request(`/api/defaultCoursePlan/updateCoursePlanning`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}
export async function updateCoursePlanning(params) {
    return request(`/api/course/selection/editCoursePlanningDetail`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}
//删除课程
export async function deleteCoursePlanning(params) {
    return request(`/api/defaultCoursePlan/deleteCoursePlanning`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//保存默认课时计划
export async function saveDefaultPlan(params) {
    return request('/api/defaultCoursePlan/save', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//查询只有班级，不含有分类
export async function fetchOnlyClass(params) {
    return request(`/api/studentGroup/grade?${stringify(params)}`);
}

//根据某一个课程id查询计划
export async function fetchPlanById(params) {
    return request('/api/defaultCoursePlan/select/course', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//全部校区
export async function schoolList(params) {
    return request(`/api/teaching/common/allSchool?${stringify(params)}`);
}

export async function chooseCourseDelete(params) {
    return request(`/api/choose/choosePlan/chooseCourseDelete?${stringify(params)}`);
}
export async function listSyncRecord(params) {
    return request(`/api/course/selection/listSyncRecord?${stringify(params)}`);
}

//课程管理
export async function choosePlanList(params) {
    return request('/api/choose/choosePlan/choosePlanList', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//课程管理创建
export async function addedOrEditChoosePlan(params) {
    return request('/api/choose/choosePlan/addedOrEditChoosePlan', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 课程管理--课程列表
export async function listCourse(params) {
    return request('/api/course/manager/listCourse', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 课程管理--学科列表
export async function listKeywordSubject(params) {
    return request('/api/course/manager/listKeywordSubject', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 获取场地
export async function allAddress(params) {
    return request(`/api/teaching/common/allAddress?${stringify(params)}`);
}

// 课程管理--新建课程
export async function addedCourse(params) {
    return request('/api/course/manager/addedCourse', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 课程管理--编辑课程
export async function updateCourse(params) {
    return request('/api/course/manager/updateCourse', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 课程管理--学科列表--新增学科
export async function addedSubject(params) {
    return request('/api/course/manager/addedSubject', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}
// 课程管理--学科列表--编辑学科
export async function updateSubject(params) {
    return request('/api/course/manager/updateSubject', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}
// 课程管理--学科列表--删除学科
export async function deleteSubject(params) {
    return request(`/api/course/manager/deleteSubject?${stringify(params)}`);
}

// 课程管理--禁用课程
export async function courseEnableAndDisable(params) {
    return request('/api/course/manager/courseEnableAndDisable', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 课程管理--学科列表--获取课程启用禁用数量
export async function getIsDisableNum(params) {
    return request(`/api/course/manager/getIsDisableNum?${stringify(params)}`);
}

// 开课计划班级筛选
export async function getGradeByCoursePlanning(params) {
    return request('/api/stratify/allGroup', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//转移获取除行政班外所有班级
export async function getAllClasses(params) {
    return request('/api/stratify/transfer/groupList', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function coursePlanningGroupInfo(params) {
    return request('/api/studentGroup/coursePlanningGroup', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 获取学期接口
export async function getAllSemester(params) {
    return request(`/api/selectBySchoolIdAllSemester?${stringify(params)}`);
}

// 根剧机构获取学校信息
export async function getCouserPlanningSchoolList(params) {
    return request(`/api/teaching/common/getSchoolList?${stringify(params)}`);
}

export async function importHistorySemester(params) {
    return request('/api/defaultCoursePlan/historySemester/selectContactCourse', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 根据班级id获取班级详情
export async function getGradeDetail(params) {
    return request(`/api/stratify/groupDetail?${stringify(params)}`);
}
// 获取适用年级
export async function suitGrades(params) {
    return request(`/api/teaching/allGrade?${stringify(params)}`);
}

export async function getByConditionTeacher(params) {
    return request('/api/defaultCoursePlan/getByConditionTeacher', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function saveCoursePlanning(params) {
    return request('/api/defaultCoursePlan/historySemester/saveCoursePlanning', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 搜索老师接口--指定机构,校区 ,非离职老师
export async function newGetTeacherList(params) {
    return request(`/api/user/searchUsersWithEduOrSchool?${stringify(params)}`);
}

// 课程批量上传
export async function courseImport(params) {
    return request(`/api/course/manager/courseImport`, {
        method: 'POST',
        body: params,
    });
}

//学科批量上传
export async function subjectImport(params) {
    return request(`/api/course/manager/subjectImport`, {
        method: 'POST',
        body: params,
    });
}

//导入课时计划验证
export async function checkByTypeCalendar(params) {
    return request('/api/defaultCoursePlan/checkExcelImportCoursePlanning', {
        method: 'POST',
        body: params,
    });
}
//导入课时计划验证
export async function batchUpdateCourse(params) {
    return request('/api/course/manager/batchUpdateCourse', {
        method: 'POST',
        body: params,
    });
}

//导入课时计划
export async function importByTypeCalendar(params) {
    return request('/api/defaultCoursePlan/excelImportCoursePlanning', {
        method: 'POST',
        body: params,
    });
}

//导入分层班检查
export async function checkClass(params) {
    return request('/api/stratify/check/stratifiedClass/excel/import', {
        method: 'POST',
        body: params,
    });
}

//导入分层班
export async function importClass(params) {
    return request('/api/stratify/stratifiedClass/excel/import', {
        method: 'POST',
        body: params,
    });
}

//导入学生检查
export async function checkStudent(params) {
    return request('/api/stratify/checkExcelImportCourseStudentRelation', {
        method: 'POST',
        body: params,
    });
}

//导入学生
export async function importStudent(params) {
    return request('/api/stratify/excel/import', {
        method: 'POST',
        body: params,
    });
}

//获取课程列表
export async function getCoursesList(params) {
    return request('/api/defaultCoursePlan/subject/course', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//获取课程列表
export async function getLinkClass(params) {
    return request('/api/stratify/associate', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//修改班级信息 /api/stratify/updateGroup
export async function updateClassInfo(params) {
    return request('/api/stratify/updateGroup', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//查询学生列表
export async function queryStuLists(params) {
    return request('/api/stratify/student/list', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//导入教师检查
export async function checkTeacher(params) {
    return request('/api/role/baseTag/checkExcelImport', {
        method: 'POST',
        body: params,
    });
}

//导入教师
export async function importTeacher(params) {
    return request('/api/role/baseTag/excelImport', {
        method: 'POST',
        body: params,
    });
}

//新建班级
export async function createClass(params) {
    return request('/api/stratify/insertGroup', {
        method: 'POST',
        body: params,
    });
}

//删除班级
export async function deleteClass(params) {
    return request('/api/stratify/deleteGroup', {
        method: 'POST',
        body: params,
    });
}
//添加学生
export async function addStudent(params) {
    return request('/api/stratify/insert/student', {
        method: 'POST',
        body: params,
    });
}

//转移学生
export async function transferStudent(params) {
    return request('/api/stratify/transfer/student', {
        method: 'POST',
        body: params,
    });
}

//转移学生
export async function removeStudent(params) {
    return request('/api/stratify/remove/student', {
        method: 'POST',
        body: params,
    });
}

//导出课时计划
export async function exportCoursePlanning(params) {
    return request(`/api/defaultCoursePlan/exportCoursePlanning?${stringify(params)}`);
}

// 初始化课程上传
export async function initializeCourseId(params) {
    return request(`/api/init/initializeCourseId`, {
        method: 'POST',
        body: params,
    });
}

//根据学科获取相关课程
export async function getLinkCourse(params) {
    return request(`/api/defaultCoursePlan/getLinkCourse?${stringify(params)}`);
}

//根据学科获取相关课程
export async function getCourseDetail(params) {
    return request(`/api/defaultCoursePlan/getCourseDetail?${stringify(params)}`);
}

//设置关联版本
export async function setCurrent(params) {
    return request(`/api/course/selection/setCurrent?${stringify(params)}`);
}

//同步课表
export async function selectionsyncToSchedule(params) {
    return request(`/api/course/selection/syncToSchedule?${stringify(params)}`);
}

//费用列表
export async function showDetail(params) {
    return request(`/api/courseFee/showDetail`, {
        method: 'POST',
        body: params,
    });
}

//费用设置
export async function editCourseFee(params) {
    return request(`/api/courseFee/edit`, {
        method: 'POST',
        body: params,
    });
}

//费用设置
export async function importFee(params) {
    return request(`/api/courseFee/import`, {
        method: 'POST',
        body: params,
    });
}

//新增学科添加查询适用学段
export async function fetchSuitStage(params) {
    return request(`/api/course/manager/listSuitStage?${stringify(params)}`)
}

//领域设置tree
export async function listDomainSubjectTree(params) {
    return request(`/api/domainSubject/listDomainSubjectTree?${stringify(params)}`)
}

//新增领域
export async function insertDomainSubject(params) {
    return request(`/api/domainSubject/insertDomainSubject`, {
        method: 'POST',
        body: params,
    });
}

//更新领域
export async function updateDomainSubject(params) {
    return request(`/api/domainSubject/updateDomainSubject`, {
        method: 'POST',
        body: params,
    });
}

export async function getSubjectLists(params) {
    return request(`/api/course/manager/listKeywordSubject`, {
        method: 'POST',
        body: params,
    });
}

export async function searchXlsxTeacherPlan(params) {
    return request(`/api/searchXlsxTeacherPlan`, {
        method: 'POST',
        body: params,
    });
}
