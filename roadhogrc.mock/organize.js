import {
    employeeJoinIn,
    teacheSyncOrg,
    asyncEmployeeQuit,
    teachingRecord,
    organizeTreeList,
    cogradientParentSuccess,
} from '../mock/organize.js';

export default {
    //同步钉人员到教务中心
    'POST /api/teaching/syncEmployee/joinIn': employeeJoinIn,
    //同步组织以及人的关系
    'POST /api/teaching/syncOrg': teacheSyncOrg,
    //同步钉钉离职员工
    'POST /api/teaching/syncEmployee/quit': asyncEmployeeQuit,
    //查看钉钉同步日志
    'GET /api/teaching/record': teachingRecord,

    //机构管理--获取组织树结构
    'GET /api/teaching/listAgencyTree': organizeTreeList,
    //同步学生家长
    'POST /api/sync/family/dingtalk': cogradientParentSuccess,
};
