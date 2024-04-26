import {
    getSubjectList,
    getCourseList,
    getCoursePlan,
    getTeacherList,
    getCoursePlanning,
    getStudentGroup,
    getStudentGroup1,
    getPublishResult,
    deleteSublist,
    importSuccess,
    confirmImportSub,
    updateCoursePlanning,
    deleteCoursePlanning,
    saveDefaultSuccess,
    onlyHaveClass,
    fetchPlanById,
    allAddress,
    schoolList,
    listCourse,
    listKeywordSubject,
    addedCourse,
    updateCourse,
    addedSubject,
    updateSubject,
    deleteSubject,
    courseEnableAndDisable,
    getIsDisableNum,
} from '../mock/course.js';

export default {
    //课程计划接口
    'GET /api/course/subject': getSubjectList,
    'GET /api/course': getCourseList,
    'POST /api/defaultCoursePlan/pageCourse': (req, res) => {
        res.send(getCoursePlan);
    },
    'GET /api/user/searchTeacher': getTeacherList,
    'GET /api/course/selection/showCoursePlanningDetail': getCoursePlanning,
    'GET /api/studentGroup/gradeByOther': getStudentGroup1,
    'GET /api/studentGroup/gradeByType': getStudentGroup,
    'GET /api/check/publish/result': getPublishResult,
    'GET /api/defaultCoursePlan/delete': deleteSublist,
    'GET /api/defaultCoursePlan/copy': importSuccess,
    'POST /api/defaultCoursePlan/import': (req, res) => {
        res.send(confirmImportSub);
    },
    'POST /api/course/selection/editCoursePlanningDetail': (req, res) => {
        res.send(updateCoursePlanning);
    },
    'POST /api/defaultCoursePlan/deleteCoursePlanning': (req, res) => {
        res.send(deleteCoursePlanning);
    },

    'POST /api/defaultCoursePlan/save': (req, res) => {
        res.send(saveDefaultSuccess);
    },
    'GET /api/studentGroup/grade': onlyHaveClass,
    'GET /api/deletePlanSon': deleteSublist,
    'POST ': (req, res) => {
        res.send(fetchPlanById);
    },

    'GET /api/teaching/common/allAddress': allAddress,
    // 获取所有校区
    'GET /api/teaching/common/allSchool': schoolList,
    // 课程管理--课程列表
    'POST /api/course/manager/listCourse': listCourse,
    // 课程管理--学科列表
    'POST /api/course/manager/listKeywordSubject': listKeywordSubject,
    // 课程管理--新建课程
    'POST /api/course/manager/addedCourse': addedCourse,
    // 课程管理--编辑课程
    'POST /api/course/manager/updateCourse': updateCourse,
    // 课程管理--禁用课程
    'POST /api/course/manager/courseEnableAndDisable': courseEnableAndDisable,
    // 课程管理--学科列表--新增学科
    'POST /api/course/manager/addedSubject': addedSubject,
    // 课程管理--学科列表--编辑学科
    'POST /api/course/manager/updateSubject': updateSubject,
    // 课程管理--学科列表--删除学科
    'GET /api/course/manager/deleteSubject': deleteSubject,
    // 课程管理--学科列表--获取课程启用禁用数量
    'GET /api/course/manager/getIsDisableNum': getIsDisableNum,
};
