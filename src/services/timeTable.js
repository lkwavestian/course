//时间管理--课表
import { stringify } from 'qs';
import request from '../utils/request';
import { func } from 'prop-types';

//新建课表
export async function createSchedule(params) {
    return request('/api/weekVersion/createVersion', {
        method: 'POST',
        body: params,
    });
}

//保存版本
export async function saveVersion(params) {
    return request('/api/weekVersion/saveVersion', {
        method: 'POST',
        body: params,
    });
}

//查询导入的课程
export async function searchImportCourse(params) {
    return request('/api/weekCoursePlanning/listCourse', {
        method: 'POST',
        body: params,
    });
}

//确认导入基础课时计划
export async function confirmImport(params) {
    return request('/api/weekCoursePlanning/import', {
        method: 'POST',
        body: params,
    });
}

//查询AC课程列表
export async function fetchCourseList(params) {
    return request('/api/detail/select/course', {
        method: 'POST',
        body: params,
    });
}

//查询AC待排课程详情
export async function fetchArrangeDetail(params) {
    return request('/api/detail/list', {
        method: 'POST',
        body: params,
    });
}

//复制AC
export async function copyCard(params) {
    return request(`/api/detail/copy?${stringify(params)}`);
}

//删除AC
export async function deleteCard(params) {
    return request(`/api/detail/delete?${stringify(params)}`);
}

//查询周课时计划
export async function findWeekCoursePlanning(params) {
    return request('/api/weekCoursePlanning/findWeekCoursePlanningByCourse', {
        method: 'POST',
        body: params,
    });
}

//选中年级包含几个作息
export async function haveScheduleNum(params) {
    return request('/api/weekVersion/countBaseScheduleByGradeList', {
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

//设置为最新版本
export async function setNewVersion(params) {
    return request(`/api/weekVersion/currentVersion?${stringify(params)}`);
}

//查询课表内容
export async function fetchScheduleList(params) {
    return request('/api/weekVersion/schedule', {
        method: 'POST',
        body: params,
    });
}

//删除课程卡片
export async function deleteCourse(params) {
    return request(`/api/scheduleResult/delete?${stringify(params)}`);
}

//转为待排
export async function changeArrange(params) {
    return request(`/api/scheduleResult/update/arrange?${stringify(params)}`);
}

//查询课程详情
export async function lookCourseDetail(params) {
    return request(`/api/scheduleResult/select/result?${stringify(params)}`);
}

//复制排课结果 && 复制版本
export async function copyResult(params) {
    return request('/api/weekVersion/copyVersion', {
        method: 'POST',
        body: params,
    });
}

//修改AC中的教师
export async function saveCardTeacher(params) {
    return request('/api/detail/change', {
        method: 'POST',
        body: params,
    });
}

//人工预排-按节-可选课节列表
export async function getScheduleDetailList(params) {
    return request(`/api/detail/scheduleDetailList?${stringify(params)}`);
}

//人工预排-按节-可选课节列表-检查
export async function saveChangeTime(params) {
    return request('/api/detail/checkScheduleDetail', {
        method: 'POST',
        body: params,
    });
}

//人工预排-冲突-点击继续
export async function continueArrange(params) {
    return request('/api/detail/manualSchedule', {
        method: 'POST',
        body: params,
    });
}

//删除单个周计划
export async function deletePlanningRow(params) {
    return request('/api/weekCoursePlanning/deleteWeekCoursePlanning', {
        method: 'POST',
        body: params,
    });
}

//批量删除周计划
export async function deletePlanningAllRow(params) {
    return request('/api/weekCoursePlanning/deleteWeekCoursePlanningByCourse', {
        method: 'POST',
        body: params,
    });
}

//更新周计划
export async function saveWeekCoursePlanning(params) {
    return request('/api/weekCoursePlanning/updateWeekCoursePlanning', {
        method: 'POST',
        body: params,
    });
}

//根据版本查询年级列表
export async function fetchGradeListBySubject(params) {
    return request(`/api/weekVersion/gradeList?${stringify(params)}`);
}

//一键排课列表
export async function getClickKeySchedule(params) {
    return request(`/api/version/schedules?${stringify(params)}`);
}

//一键排课提交
export async function fetSchedule(params) {
    return request('/api/fet/schedule', {
        method: 'POST',
        body: params,
    });
}

//卡片新建人工自由排课
export async function saveFreeScheduleTime(params) {
    return request('/api/detail/free/schedule/activity', {
        method: 'POST',
        body: params,
    });
}

//自由排课获取部门人员树
export async function getDepartmentList(params) {
    return request(`/api/departments?${stringify(params)}`);
}

//自由排课获取学生列表
export async function getStudentList(params) {
    return request(`/api/searchStudent?${stringify(params)}`);
}

//新建自由排课--活动
export async function createFreeCourse(params) {
    return request('/api/free/schedule', {
        method: 'POST',
        body: params,
    });
}

//查看自由排课的详情
export async function lookFreeCourseDetail(params) {
    return request(`/api/free/schedule/detail?${stringify(params)}`);
}

//删除自由排课的课程
export async function deleteFreeCourse(params) {
    return request('/api/delete/free/schedule', {
        method: 'POST',
        body: params,
    });
}

//获取场地列表
export async function getAreaList(params) {
    return request(`/api/address/listAllAddress?${stringify(params)}`);
}
/* //获取场地列表
export async function getAreaList(params) {
    return request(`/api/address/list?${stringify(params)}`)
} */

//公布课表
export async function publishSchedule(params) {
    return request('/api/scheduleResult/published/new', {
        method: 'POST',
        body: params,
    });
}

// AC课程下拉列表展示
export async function getAcCourseList(params) {
    return request('/api/course/list/version', {
        method: 'POST',
        body: params,
    });
}

//锁定单节课
export async function lockUtilLesson(params) {
    return request(`/api/weekRule/lock?${stringify(params)}`);
}

//解锁单节课
export async function unLockUtilLesson(params) {
    return request(`/api/weekRule/unlock?${stringify(params)}`);
}

//确认锁定
export async function confirmLock(params) {
    return request('/api/weekRule/batchLock', {
        method: 'POST',
        body: params,
    });
}

//确认调整
export async function confirmUpdate(params) {
    return request('/api/weekRule/batchUpdate', {
        method: 'POST',
        body: params,
    });
}

//换课--查询可选结果
export async function exchangeClass(params) {
    return request(`/api/scheduleResult/listExchange?${stringify(params)}`);
}

//换课--查询可选结果 修改
export async function newExchangeClass(params) {
    return request(`/api/scheduleResult/newListExchange?${stringify(params)}`);
}

// 待排课节可选课节列表
export async function newCheckScheduleList(params) {
    return request(`/api/scheduleResult/ac/move/list?${stringify(params)}`);
}

//换课--校验
export async function validateCanChange(params) {
    return request('/api/scheduleResult/checkExchange', {
        method: 'POST',
        body: params,
    });
}

//换课--详情
export async function getExchangeResult(params) {
    return request('/api/scheduleResult/exchangeDetail', {
        method: 'POST',
        body: params,
    });
}

//判断是否是最新发布版本
export async function lastPublic(params) {
    return request(`/api/weekVersion/lastPublic?${stringify(params)}`);
}

//确认调课换课
export async function finishExchangeCourse(params) {
    return request('/api/scheduleResult/exchange', {
        method: 'POST',
        body: params,
    });
}

//系统排课结果的编辑
export async function editSystemCourse(params) {
    return request('/api/scheduleResult/editResult', {
        method: 'POST',
        body: params,
    });
}

//自由排课结果的编辑
export async function editFreeCourse(params) {
    return request('/api/free/schedule/update', {
        method: 'POST',
        body: params,
    });
}

//自由排课要操作的数量
export async function confirmCourseNum(params) {
    return request(`/api/free/schedule/relatedAmount?${stringify(params)}`);
}

//科目-课程级联
export async function fetchCourseBySubject(params) {
    return request(`/api/course/subject/course?${stringify(params)}`);
}

//fet进程查询 getFetProgress,//获取fet进程进度条

export async function getFetProgress(params) {
    return request(`/api/weekVersion/fetProgress?${stringify(params)}`);
}

//终止fet进程排课
export async function stopFetCourse(params) {
    return request(`/api/weekVersion/fetStop?${stringify(params)}`);
}

//待排课程数量统计
export async function statisticsCourse(params) {
    return request('/api/detail/list/outline', {
        method: 'POST',
        body: params,
    });
}

//自由排课--班级下拉展示
export async function getGradeByType(params) {
    return request(`/api/studentGroup/free/gradeByType?${stringify(params)}`);
}

//公布排课--查询暂无场地的课程
export async function searchNoAddress(params) {
    return request('/api/scheduleResult/publish/check', {
        method: 'POST',
        body: params,
    });
}

//人工预排--按节次--规则校验
export async function manualScheduleCheck(params) {
    return request('Check', {
        method: 'POST',
        body: params,
    });
}

//AC自由排课--转为待排
export async function changeFreeArrange(params) {
    return request(`/api/change/free/ac/arrange?${stringify(params)}`);
}

//清空某天的排课结果的统计
export async function scheduleResultNumber(params) {
    return request('/api/scheduleResult/empty/day/check', {
        method: 'POST',
        body: params,
    });
}

//确认清空某天的排课结果
export async function confirmDelete(params) {
    return request('/api/scheduleResult/empty/day', {
        method: 'POST',
        body: params,
    });
}

//根据场地进行查询
export async function fetchAddressResult(params) {
    return request('/api/weekVersion/schedule/playground', {
        method: 'POST',
        body: params,
    });
}

//根据教师进行查询
export async function fetchTeacherResult(params) {
    return request('/api/weekVersion/free/teachers', {
        method: 'POST',
        body: params,
    });
}
//版本差异对比
export async function compareVersion(params) {
    return request('/api/weekVersion/compare/version', {
        method: 'POST',
        body: params,
    });
}

//适用年级
export async function versionGrade(params) {
    return request(`/api/weekVersion/version/grade?${stringify(params)}`);
}

// 按年级给课表排序
export async function findGradeSchedule(params) {
    return request('/api/weekVersion/findGradeSchedule', {
        method: 'POST',
        body: params,
    });
}

// 编辑版本名称
export async function updateVersion(params) {
    return request(`/api/weekVersion/updateVersion?${stringify(params)}`);
}

// 获取学生list
export async function findStudentResult(params) {
    return request('/api/weekVersion/findStudent', {
        method: 'POST',
        body: params,
    });
}

// 获取班级list
export async function findGroup(params) {
    return request('/api/weekVersion/findGroup', {
        method: 'POST',
        body: params,
    });
}

// 获取年list
export async function findGrade(params) {
    return request(`/api/weekVersion/findGrade?${stringify(params)}`);
}

// 自定义教师查询结果
export async function findTeacherSchedule(params) {
    return request('/api/weekVersion/findTeacherSchedule', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 自定义场地查询结果
export async function findFieldSchedule(params) {
    return request('/api/weekVersion/findFieldSchedule', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 自定义学生查询结果
export async function findStudentSchedule(params) {
    return request('/api/weekVersion/findStudentSchedule', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 冲突原因卡片
export async function conflictReasonCard(params) {
    return request('/api/scheduleResult/conflictInformation', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 自定义班级查询结果
export async function findClassSchedule(params) {
    return request('/api/weekVersion/findClassSchedule', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 待排确认换课
export async function willSureExchange(params) {
    return request('/api/detail/manualSchedule', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}
// 课程班级联动
export async function getWillGroupList(params) {
    return request(`/api/weekVersion/groupList?${stringify(params)}`);
}

// 确认创建自由活动
export async function sureCreateActive(params) {
    return request('/api/free/confirmCreate', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}
// 导入班级课时计划班级列表
export async function getExportGroupList(params) {
    return request(`/api/weekCoursePlanning/groupList?${stringify(params)}`);
}

// 导入某个课程的课时计划
export async function importByCourse(params) {
    return request('/api/weekCoursePlanning/importByCourse', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 排课文件链接下载功能
export async function downloadFetSchedule(params) {
    return request('/api/download/fet/schedule', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 对比版本list
export async function getCompareVersion(params) {
    return request(`/api/weekVersion/compare/version?${stringify(params)}`);
}

// 版本对比结果
export async function getCompareVersionResult(params) {
    return request(`/api/weekVersion/compare/version/result/v2?${stringify(params)}`);
}

// 版本对比结果(教师视角)
export async function getCompareVersionTeacher(params) {
    return request(`/api/weekVersion/compareVersionTeacherView?${stringify(params)}`);
}

// 版本检查结果
export async function scheduleCheck(params) {
    return request(`/api/scheduleResult/schedule/check?${stringify(params)}`);
}

// 未排学生列表
export async function unListedStudents(params) {
    return request(`/api/weekVersion/getGradeStudent?${stringify(params)}`);
}

// 教师关怀列表
export async function teacherCare(params) {
    return request(`/api/weekVersion/findTeacherScheduleCount?${stringify(params)}`);
}

// 查询版本公布状态
export async function queryScheduleStatus(params) {
    return request(`/api/scheduleResult/publish/version/type?${stringify(params)}`);
}

//按天复制排课结果
export async function getCopyByDayScheduleResult(params) {
    return request('/api/weekVersion/copyByDayScheduleResult', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//系统排课结果的编辑检查老师场地是否冲突
export async function checkEditResultSchedule(params) {
    return request('/api/scheduleResult/checkEditResultSchedule', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}
//开课计划-科目课程联动筛选接口
export async function coursePlanSubjectList(params) {
    return request('/api/defaultCoursePlan/subject/course', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//搜索人
export async function searchPeopleAsync(params) {
    return request(`/api/selectPersonName?${stringify(params)}`);
}

// 课表结果 Excel 导出
export async function exportExcelResult(params) {
    return request(`/api/scheduleResult/exportExcelResult?${stringify(params)}`);
}

// 排课结果-从Excel导入
export async function ImportExcelResult(params) {
    return request('api/scheduleResult/ImportExcelResult', {
        method: 'POST',
        body: params,
    });
}

// 获取操作记录列表
export async function getOperationRecordList(params) {
    return request(`/api/operation/operationRecordList?${stringify(params)}`);
}

//操作记录撤销
export async function revokeOperationRecord(params) {
    return request(`/api/operation/revokeOperationRecord?${stringify(params)}`);
}

// 批量删除开课计划
export async function deleteCoursePlanning(params) {
    return request('/api/weekCoursePlanning/deleteWeekCoursePlanningByCourseId', {
        method: 'POST',
        body: params,
    });
}

// 一键转待排
/* export async function batchArrange(params) {
  return request(`/api/scheduleResult/update/batchArrange?${stringify(params)}`);
} */

// 一键转待排
export async function batchArrange(params) {
    return request('/api/scheduleResult/update/batchArrange', {
        method: 'POST',
        body: params,
    });
}

// 换课
export async function changeWeekTeachingPlanGroup(params) {
    return request('/api/weekCoursePlanning/changeWeekTeachingPlanGroup', {
        method: 'POST',
        body: params,
    });
}
//上传排课结果(Fet格式)
export async function uploadFetResult(params) {
    return request('/api/uploadFetResult', {
        method: 'POST',
        body: params,
    });
}

//上传排课结果（Excel格式）
export async function courseScheduleImport(params) {
    return request('/api/import/courseScheduleImport', {
        method: 'POST',
        body: params,
    });
}

//批量删除待排
export async function batchDeletedAC(params) {
    return request('/api/detail/batchDeletedAC', {
        method: 'POST',
        body: params,
    });
}

// 获取版本内所有课程
export async function fetchWeekVersionCourseList(params) {
    return request(`/api/weekVersion/courseList?${stringify(params)}`);
}

// 一键拆连堂
export async function splitContinuousResultSync(params) {
    return request('/api/scheduleResult/splitContinuousResult', {
        method: 'POST',
        body: params,
    });
}

// 场地冲突
export async function roomConflictCheckSync(params) {
    return request('/api/freeScheduleResultRoomConflictCheck', {
        method: 'POST',
        body: params,
    });
}

// 检查版本中是否存在选修班和分层班
export async function checkVersionGroupSync(params) {
    return request(`/api/weekVersion/checkVersionGroup?${stringify(params)}`);
}

// 场地冲突
export async function acrossSemesterCopyVersionSync(params) {
    return request('/api/weekVersion/acrossSemesterCopyVersion', {
        method: 'POST',
        body: params,
    });
}

// 场地冲突
export async function getTaskWeekVersionListSync(params) {
    return request('/api/weekVersion/weekVersionList', {
        method: 'POST',
        body: params,
    });
}
