import { stringify } from 'qs';
import request from '../utils/request';

//学生管理--获取学生组织架构树
export async function getStudentOrg(params) {
    return request(`/api/teaching/student/listOrgTree?${stringify(params)}`);
}

//学生管理--获取休学组织树
export async function listSuspendStudyOrgTree(params) {
    return request(
        `/api/teaching/studentStatus/manager/listSuspendStudyOrgTree?${stringify(params)}`
    );
}

//学生管理--获取离校组织树
export async function listGraduationOrgTree(params) {
    return request(
        `/api/teaching/studentStatus/manager/listGraduationOrgTree?${stringify(params)}`
    );
}

//学生管理--获取学生人员列表
export async function getStudentList(params) {
    return request('/api/teaching/student/listUser ', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 离校列表
export async function listGraduationStudent(params) {
    return request('/api/teaching/studentStatus/manager/listGraduationStudent', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//添加学生--获取年级列表
export async function getGradeList(params) {
    return request(`/api/teaching/student/grade/class?${stringify(params)}`);
}

//添加学生--非行政班根据班级id查询学生
export async function addStudentList(params) {
    return request(`/api/teaching/student/added/list?${stringify(params)}`);
}

//添加学生--行政班人员添加列表
export async function notAdminStudent(params) {
    return request(`/api/teaching/student/not/admin/list?${stringify(params)}`);
}

//添加学生--查看适用年级
export async function lookApplyGrade(params) {
    return request(`/api/teaching/select/apply/grade?${stringify(params)}`);
}

//学生设置组织角色--获取学生组织下可选学生列表
export async function getSetOrgRoleStudent(params) {
    return request(`/api/teaching/student/orgRoleUserList?${stringify(params)}`);
}

//获取年级非行政班的展示
export async function nonAdministrationClass(params) {
    return request(`/api/teaching/student/grade/nonAdministrationClass?${stringify(params)}`);
}

//获取学生档案信息
export async function getStudentDetails(params) {
    return request(`/api/teaching/student/studentProfile?${stringify(params)}`);
}

//获取民族
export async function getNationList(params) {
    return request(`/api/teaching/common/allNation?${stringify(params)}`);
}

//获取国家
export async function getCountryList(params) {
    return request(`/api/teaching/common/allCountry?${stringify(params)}`);
}

//获取所有年级
export async function getAllGrade(params) {
    return request(`/api/teaching/allGrade?${stringify(params)}`);
}

//批量导出学生档案
export async function exportStudentSource(params) {
    return request('/api/teaching/excel/export', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//重置学生账号密码
export async function resetPassword(params) {
    return request(`/api/teaching/userAccount/resetPassword?${stringify(params)}`);
}

//添加学生家长
export async function addStudentParent(params) {
    return request('/api/teaching/student/addStudentParent', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//编辑学生家长
export async function updateStudentParent(params) {
    return request('/api/teaching/student/updateStudentParent', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//删除学生家长
export async function deleteStudentParent(params) {
    return request('/api/teaching/student/deleteStudentParent', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//编辑学生档案
export async function updateStudentProfile(params) {
    return request('/api/teaching/student/updateStudentProfile', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//导出其他信息
export async function exportButtonList(params) {
    return request('/api/teaching/excel/export', {
        method: 'POST',
        body: params,
        responseType: 'blob',
    });
}

//批量修改学生档案
export async function batchEditInfo(params) {
    return request('/api/teaching/excel/import', {
        method: 'POST',
        body: params,
    });
}

//批量设置学生导师
export async function batchSetStudentTutor(params) {
    return request('/api/teaching/student/batchSetStudentTutor', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}
export async function batchSetStudentSpecialtyTutor(params) {
    return request('/api/teaching/student/batchSetStudentSpecialtyTutor', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function batchSetStudentNotice(params) {
    return request('/api/teaching/parentUpdateStudentInfo/invitation', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//获取结班的数量
export async function getEndClassNumber(params) {
    return request(`/api/teaching/student/checkCompleteClass?${stringify(params)}`);
}

//确认结班
export async function confirmEndClass(params) {
    return request(`/api/teaching/student/completeClass?${stringify(params)}`);
}

//提交转学信息
export async function submitTransferSchool(params) {
    return request(`/api/teaching/studentStatus/manager/transfer`, {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 提交休学信息
export async function submitSuspensionSchool(params) {
    return request('/api/teaching/studentStatus/manager/suspendStudy', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 提交放弃信息
export async function submitGiveUpSchool(params) {
    return request('/api/teaching/giveUpStudent', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 提交调整修改
export async function updateSuspendStudy(params) {
    return request('/api/teaching/studentStatus/manager/updateSuspendStudy', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 催一下
export async function onClickUrged(params) {
    return request('/api/teaching/parentUpdateStudentInfo/urgeParentUpdateStudentInfo', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}
// 获取休学详细信息
export async function suspendStudyInfo(params) {
    return request(`/api/teaching/studentStatus/manager/suspendStudyInfo?${stringify(params)}`);
}

// 提交复学信息
export async function submitResumptionSchool(params) {
    return request('/api/teaching/studentStatus/manager/recoveryStudy', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 学生复学记录
export async function recoveryStudentList(params) {
    return request(`/api/teaching/studentStatus/manager/recoveryStudentList?${stringify(params)}`);
}

// 更新记录
export async function recordList(params) {
    return request('/api/teaching/parentUpdateStudentInfo/recordList', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}
//家长被动更新提交信息
export async function subupdateStudentInfo(params) {
    return request('/api/teaching/parentUpdateStudentInfo/updateStudentInfo', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}
//家长主动更新提交信息
export async function parentUpdateStudentInfo(params) {
    return request('/api/teaching/parentUpdateStudentInfo/parentUpdateStudentInfo', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 设置离校信息
export async function leftSchoolReason(params) {
    return request('/api/teaching/studentStatus/manager/updateStudentTransfer', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 设置毕业去向
export async function graduationDestination(params) {
    let nodeId = params.nodeId;
    let type = params.type;
    let schoolId = params.schoolId;
    delete params.nodeId;
    delete params.type;
    delete params.schoolId;
    return request(
        `/api/teaching/studentStatus/manager/importGraduationStudent?nodeId=${nodeId}&type=${type}&schoolId=${schoolId}`,
        {
            method: 'POST',
            body: params,
        }
    );
}

// 判断是否可以升年级
export async function checkUpgrade(params) {
    return request(`/api/teaching/studentStatus/manager/checkUpgrade?${stringify(params)}`);
}

// 升年级详情
export async function upgradeInfo(params) {
    return request(`/api/teaching/studentStatus/manager/upgradeInfo?${stringify(params)}`);
}

// 确认升年级
export async function confirmUpgrade(params) {
    return request('/api/teaching/studentStatus/manager/upgrade', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 学籍变更记录
export async function studentStatusRecord(params) {
    return request(`/api/teaching/studentStatus/manager/studentStatusRecord?${stringify(params)}`);
}

// 预览文件
export async function previewFile(params) {
    return request(`/api/teaching/excel/preview_file?${stringify(params)}`);
}
// 下载文件
export async function downloadExcel(params) {
    return request(`/api/teaching/studentStatus/manager/download/template?${stringify(params)}`);
}

// 是否能更新
export async function checkStudentInfo(params) {
    return request(`/api/teaching/parentUpdateStudentInfo/checkStudentInfo?${stringify(params)}`);
}
// 几个孩子
export async function parentChildList(params) {
    return request(`/api/teaching/parentUpdateStudentInfo/parentChildList?${stringify(params)}`);
}
// 详情学生
export async function upDateStudentInfo(params) {
    return request(`/api/teaching/parentUpdateStudentInfo/studentInfo?${stringify(params)}`);
}

// 学生不更新
export async function confirmStudentInfo(params) {
    return request('/api/teaching/parentUpdateStudentInfo/confirmStudentInfo', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 是否展示初始页
export async function checkNewYearInit(params) {
    return request(`/api/schoolYear/checkNewYearInit?${stringify(params)}`);
}

// 升年级配置回显
export async function upgradeConfiguration(params) {
    return request(`/api/schoolYear/upgradeConfiguration?${stringify(params)}`);
}

// 确定升年级
export async function upGradeForSure(params) {
    return request('/api/schoolYear/confirmUpgradeConfiguration', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 学生管理-学校下拉
export async function getListSchool(params) {
    return request(`/api/schoolYear/listSchool?${stringify(params)}`);
}

// 学生管理-学年下拉
export async function getListSchoolYear(params) {
    return request(`/api/schoolYear/listSchoolYear?${stringify(params)}`);
}

//批量导入学生
export async function importUserList(params) {
    return request('/api/teaching/student/importUserList', {
        method: 'POST',
        body: params,
    });
}

export async function endStudentTutor(params) {
    return request('/api/teaching/student/endStudentTutor', {
        method: 'POST',
        body: params,
    });
}

export async function exportNeedUpdateStudent(params) {
    return request('/api/teaching/excel/exportNeedUpdateStudent', {
        method: 'POST',
        body: params,
    });
}

export async function createStudent(params) {
    return request('/api/teaching/student/addStudent', {
        method: 'POST',
        body: params,
    });
}

export async function listGradeGroup(params) {
    return request(`/api/teaching/student/listGradeGroup?${stringify(params)}`);
}

//地区选择
// export async function provinceList(params) {
//     return request(`/api/teaching/student/getDefaultDistrict?${stringify(params)}`);
// }

//街道选择
export async function streetList(params) {
    return request(`/api/getStreetListByAreaCode?${stringify(params)}`);
}

export async function searchDormitoryByWord(params) {
    return request(`/api/teaching/student/listDormInfo?${stringify(params)}`);
}

export async function getSchoolBusList(params) {
    return request(`/api/teaching/student/listSchoolBus?${stringify(params)}`);
}

// 特长教练
export async function getTutorList(params) {
    return request(`/api/student/getTutorList?${stringify(params)}`);
}

export async function downloadList(params) {
    return request(`/api/teaching/history/export/historyExportFile?${stringify(params)}`);
}

export async function batchExport(params) {
    return request('/api/teaching/excel/export', {
        method: 'POST',
        body: params,
    });
}
