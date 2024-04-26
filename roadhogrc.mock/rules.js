import {
    newRuleManagement,
    weeklyRuleChanges,
    hasRulesList,
    ruleCount,
    ruleListOfTypes,
    rulesEnable,
    rulesDisables,
    teacherRulesList,
    scheduleDetail,
    allTeacherList,
    classGroupList,
    courseAllList,
    courseAcList,
    accordingVersion,
    courseAcquisition,
    ruleToDelete,
    classTypeList,
    oneRuleInformation,
} from '../mock/rules.js';

export default {
    // 规则管理
    'POST /api/weekRule/save': (req, res) => {
        res.send(newRuleManagement);
    },
    'POST /api/weekRule/update': (req, res) => {
        res.send(weeklyRuleChanges);
    },
    'GET /api/weekRule/addedList': hasRulesList,
    'GET /api/weekRule/ruleAmountStatistics': ruleCount,
    'GET /api/weekRule/ruleList': ruleListOfTypes,
    'GET /api/weekRule/enable': rulesEnable,
    'GET /api/weekRule/disable': rulesDisables,
    'POST /api/weekRule/scheduleForTeacherList': teacherRulesList,
    // 'GET /api/weekRule/scheduleDetail': scheduleDetail,
    'GET /api/weekRule/listScheduleDetail': scheduleDetail,
    'GET /api/weekVersion/teacherList': allTeacherList,
    'GET /api/weekVersion/studentGroupList': classGroupList,
    'GET /api/weekVersion/courseList': courseAllList,
    'GET /api/weekRule/activityList': courseAcList,
    'POST /api/weekRule/scheduleForClassList': accordingVersion,
    'POST /api/weekRule/scheduleForCourseList': courseAcquisition,
    'GET /api/weekRule/delete': ruleToDelete,
    'GET /api/addressRule/classTypeList': classTypeList,
    'GET /api/weekRule/getOne': oneRuleInformation,
};
