import { clubDataSource, clubCourseList, createClubList } from '../mock/club.js';

export default {
    //club
    'POST /api/free/pageResult': (req, res) => {
        res.send(clubDataSource);
    },

    //新建club--获取课程列表
    'GET /api/defaultCoursePlan/club/course': clubCourseList,
    //批量创建club
    'POST /api/free/club/schedule': createClubList,
};
