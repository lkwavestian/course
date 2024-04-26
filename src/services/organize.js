import { stringify } from 'qs';
import request from '../utils/request';
import request2 from '../utils/request';

//同步钉钉人员到教务中心
export async function employeeJoinIn(params) {
    return request('/api/teaching/syncEmployee/joinIn', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//同步组织以及人的关系
export async function teacheSyncOrg(params) {
    return request('/api/teaching/syncOrg', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//同步钉钉离职员工
export async function asyncEmployeeQuit(params) {
    return request('/api/teaching/syncEmployee/quit', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//同步学生家长
export async function cogradientParent(params) {
    return request('/api/sync/family/dingtalk', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//查看钉钉同步日志
export async function fetchRecord(params) {
    return request(`/api/teaching/record?${stringify(params)}`);
}

//组织机构获取组织结构
export async function getOrganizeList(params) {
    return request(`/api/teaching/listAgencyTree?${stringify(params)}`);
}

//学年列表
export async function getSchoolYearList(params) {
    return request(`/api/schoolYear/listSchoolYearAndSemester?${stringify(params)}`);
}

// 下拉学校
export async function getlistSchool(params) {
    return request(`/api/schoolYear/listSchool?${stringify(params)}`);
}

// 新建学期
export async function createSemester(params) {
    return request('/api/schoolYear/createSemester', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 编辑学年
export async function editSchoolYear(params) {
    return request('/api/schoolYear/editSchoolYear', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 开启学期
export async function startSemester(params) {
    return request(`/api/schoolYear/startSemester?${stringify(params)}`);
}

// 开启学年
export async function startSchoolYear(params) {
    return request(`/api/schoolYear/startSchoolYear?${stringify(params)}`);
}

// 新建学年
export async function createSchoolYear(params) {
    return request('/api/schoolYear/createSchoolYear', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 导入场地
/* export async function importAddress(params) {
  return request(`/api/address/import?${stringify(params)}`)
} */

// 导入场地
export async function importAddress(params) {
    return request('/api/address/import', {
        method: 'POST',
        body: params,
    });
}

// 导入学生成绩
export async function importStudentScore(params) {
    return request('/api/init/divideGroup', {
        method: 'POST',
        body: params,
    });
}

// 获得场地列表
export async function getAddressList(params) {
    return request(`/api/address/management/addressList?${stringify(params)}`);
}

//新增场地
export async function addAddress(params) {
    return request('/api/address/insert', {
        method: 'POST',
        body: params,
    });
}

//编辑场地
export async function updateAddress(params) {
    return request('/api/address/update', {
        method: 'POST',
        body: params,
    });
}

//设为当前学期/学年
export async function setCurrentYearOrSemester(params) {
    return request(`/api/schoolYear/setCurrentYearOrSemester?${stringify(params)}`);
}

//删除学期/学年
export async function deleteYearOrSemester(params) {
    return request(`/api/schoolYear/deleteYearOrSemester?${stringify(params)}`);
}

export async function batchUpdateField(params) {
    return request(`/api/address/batchUpdateField`, {
        method: 'POST',
        body: params,
    });
}

//场地钉钉同步
export async function syncDingRoomSync(params) {
    return request(`/api/address/syncDingRoom?${stringify(params)}`);
}

//保存学期周明细
export async function saveSemesterWeekDetailSync(params) {
    return request(`/api/saveSemesterWeekDetail`, {
        method: 'POST',
        body: params,
    });
}

//学期列表
export async function semesterWeekDetailListSync(params) {
    return request(`/api/semesterWeekDetailList?${stringify(params)}`);
}
