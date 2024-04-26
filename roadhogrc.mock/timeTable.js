import {
    createSchedule,
    saveVersion,
    searchImportCourse,
    confirmImportSuccess,
    fetchCourseList,
    fetchArrangeDetail,
    copyCard,
    deleteCard,
    findWeekCoursePlanning,
    haveScheduleNum,
    getVersionList,
    currentVersion,
    scheduleData,
    deleteCourseSuccess,
    changeArrangeSuccess,
    lookCourseDetail,
    copyResult,
    saveCardTeacher,
    getScheduelList,
    saveChangeTime,
    continueArrangeSuccess,
    deleteWeekCoursePlanning,
    deleteWeekCoursePlanningByCourse,
    updateWeekCoursePlanning,
    gradeListByVersion,
    getClickKeySchedule,
    fetScheduleSuccess,
    saveFreeScheduleTime,
    departmentList,
    studentList,
    createFreeCourseSuccess,
    lookFreeCourseDetail,
    deleteFreeCourseSuccess,
    getAreaList,
    publishScheduleSuccess,
    showAcCourseList,
    lockUtilLesson,
    unLockUtilLesson,
    confirmLock,
    confirmUpdate,
    canChangeCourse,
    checkExchange,
    exchangeDetail,
    lastPublicContent,
    confirmExchange,
    editSystemCourse,
    editFreeCourse,
    relatedAmount,
    courseBySubject,
    fetProgress,
    fetStop,
    statisticCourse,
    getGradeByType,
    searchNoAddressResult,
    manualScheduleCheck,
    acArrangeSuccess,
    scheduleResultNumber,
    confirmDeleteResult,
    fetchAddressResult,
    fetchTeacherResult,
    compareVersion,
    versionGrade,
} from '../mock/timeTable.js';

export default {
    //时间管理--课程表
    'POST /api/weekVersion/createVersion': createSchedule,
    'POST /api/weekVersion/saveVersion': (req, res) => {
        res.send(saveVersion);
    },
    'POST /api/weekCoursePlanning/listCourse': (req, res) => {
        res.send(searchImportCourse);
    },
    'POST /api/weekCoursePlanning/import': (req, res) => {
        res.send(confirmImportSuccess);
    },

    'GET /api/detail/select/course': fetchCourseList,
    'GET /api/detail/list': fetchArrangeDetail,
    'GET /api/detail/copy': copyCard,
    'GET /api/detail/delete': deleteCard,
    'POST /api/weekCoursePlanning/findWeekCoursePlanningByCourse': (req, res) => {
        res.send(findWeekCoursePlanning);
    },
    'POST /api/weekVersion/countBaseScheduleByGradeList': (req, res) => {
        res.send(haveScheduleNum);
    },
    'POST /api/weekVersion/findVersion': (req, res) => {
        res.send(getVersionList);
    },
    'GET /api/weekVersion/currentVersion': currentVersion,
    'POST /api/weekVersion/schedule': scheduleData,
    'GET /api/scheduleResult/delete': deleteCourseSuccess,
    'GET /api/scheduleResult/update/arrange': changeArrangeSuccess,
    'GET /api/scheduleResult/select/result': lookCourseDetail,
    'POST /api/weekVersion/copyVersion': (req, res) => {
        res.send(copyResult);
    },
    'POST /api/detail/change': (req, res) => {
        res.send(saveCardTeacher);
    },
    'GET /api/detail/scheduleDetailList': getScheduelList,
    'POST /api/detail/checkScheduleDetail': (req, res) => {
        res.send(saveChangeTime);
    },
    'POST /api/detail/manualSchedule': (req, res) => {
        res.send(continueArrangeSuccess);
    },
    'POST /api/weekCoursePlanning/deleteWeekCoursePlanning': (req, res) => {
        res.send(deleteWeekCoursePlanning);
    },
    'POST /api/weekCoursePlanning/deleteWeekCoursePlanningByCourse': (req, res) => {
        res.send(deleteWeekCoursePlanningByCourse);
    },
    'POST /api/weekCoursePlanning/updateWeekCoursePlanning': (req, res) => {
        res.send(updateWeekCoursePlanning);
    },
    'GET /api/weekVersion/gradeList': gradeListByVersion,
    'GET /api/version/schedules': getClickKeySchedule,
    'POST /api/fet/schedule': (req, res) => {
        res.send(fetScheduleSuccess);
    },
    'POST /api/detail/free/schedule/activity': (req, res) => {
        res.send(saveFreeScheduleTime);
    },
    'GET /api/departments': departmentList,
    'GET /api/searchStudent': studentList,
    'POST /api/free/schedule': (req, res) => {
        res.send(createFreeCourseSuccess);
    },
    'GET /api/free/schedule/detail': lookFreeCourseDetail,
    'POST /api/delete/free/schedule': (req, res) => {
        res.send(deleteFreeCourseSuccess);
    },
    'GET /api/address/listAllAddress': getAreaList,
    'POST /api/scheduleResult/published/new': publishScheduleSuccess,
    'GET /api/course/list/version': showAcCourseList,

    //调课换课
    'GET /api/scheduleResult/listExchange': canChangeCourse,
    'POST /api/scheduleResult/checkExchange': checkExchange,
    'POST /api/scheduleResult/exchangeDetail': exchangeDetail,
    'POST /api/scheduleResult/exchange': confirmExchange,

    //判断是否是最新发布版本
    'GET /api/weekVersion/lastPublic': lastPublicContent,

    //编辑
    'POST /api/scheduleResult/editResult': editSystemCourse,
    'POST /api/free/schedule/update': editFreeCourse,
    'GET /api/free/schedule/relatedAmount': relatedAmount,

    //锁定课程
    'GET /api/weekRule/lock': lockUtilLesson,
    'GET /api/weekRule/unlock': unLockUtilLesson,
    'POST /api/weekRule/batchLock': confirmLock,

    //调整节次
    'POST /api/weekRule/bathUpdate': confirmUpdate,

    //科目-课程级联
    'GET /api/course/subject/course': courseBySubject,

    //fet进程查询
    'GET /api/weekVersion/fetProgress': fetProgress,
    'GET /api/weekVersion/fetStop': fetStop,
    'GET /api/detail/list/outline': statisticCourse,

    //自由排课--班级下拉展示（行政班、一年级、班级）
    'GET /api/studentGroup/free/gradeByType': getGradeByType,
    //公布课表--查询没有场地的课节
    'POST /api/scheduleResult/publish/check': searchNoAddressResult,
    //人工预排-按节-规则校验
    'POST /api/detail/manualScheduleCheck': manualScheduleCheck,
    //AC自由排课-转为待排
    'GET /api/change/free/ac/arrange': acArrangeSuccess,
    //清空某天的结果统计
    'POST /api/scheduleResult/empty/day/check': scheduleResultNumber,
    //确认清空某天的结果
    'POST /api/scheduleResult/empty/day': confirmDeleteResult,
    //根据场地进行查询
    'POST /api/weekVersion/schedule/playground': fetchAddressResult,
    //根据教师进行查询
    'POST /api/weekVersion/free/teachers': fetchTeacherResult,
    //版本差异对比
    'POST /api/weekVersion/compare/version': compareVersion,
    //适用年级
    'GET /api/weekVersion/version/grade': versionGrade,
};
