import {
    getSemesterList,
    getCourseLists,
    getGradeList,
    allGradeList,
    getDateList,
    getCalendarList,
    deleteCalendarDetail,
    addScheduleSuccess,
    editScheduleList,
    copyScheduleList,
    addScheduleText,
    lookCalendarDetail,
    modifScheduleWork,
    deleteBaseListText,
    fetchWorkingHours,
    changeSchedulelist,
    changeDay,
    changeDifference,
    changeSchedule,
    addScheduleList,
} from '../mock/time.js';

export default {
    'POST /api/selectAllSemester': (req, res) => {
        res.send(getSemesterList);
    },
    'GET /api/defaultCoursePlan/import/course': getCourseLists,
    'GET /api/allGrade': getGradeList,
    'GET /api/teaching/allGrade': allGradeList,
    'GET /api/scheduleList': getDateList,
    'GET /api/selectBaseScheduleAndDetail': getCalendarList,
    'GET /api/deleteBaseScheduleDetailById': deleteCalendarDetail,
    'POST /api/updateBaseSchedule': (req, res) => {
        res.send(editScheduleList);
    },
    'POST /api/copyBaseScheduleById': (req, res) => {
        res.send(copyScheduleList);
    },
    'POST /api/insertBaseScheduleDetail': (req, res) => {
        res.send(addScheduleText);
    },

    'POST /api/updateBaseScheduleDetail': (req, res) => {
        res.send(modifScheduleWork);
    },
    'GET /api/selectBaseScheduleDetail': lookCalendarDetail,
    'GET /api/deleteBaseScheduleById': deleteBaseListText,
    'POST /api/insertBaseSchedule': (req, res) => {
        res.send(addScheduleList);
    },
    'GET /api/selectBaseSchedule': fetchWorkingHours,
    'GET /api/mapping/schedule': changeSchedulelist,
    'POST /api/change/day': (req, res) => {
        res.send(changeDay);
    },
    'GET /api/change/schedule': changeSchedule,
    'GET /api//show/schedule/difference': changeDifference,
};
