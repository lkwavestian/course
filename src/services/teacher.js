import { stringify } from 'qs';
import request from '../utils/request';

//员工组织管理--组织结构树
export async function getTreeData(params) {
    return request(`/api/teaching/listOrgTree?${stringify(params)}`);
}

//员工组织管理--员工人员列表
export async function getTeacherList(params) {
    return request('/api/teaching/listUser', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//获取国家
export async function getCountryList(params) {
    return request(`/api/teaching/common/allCountry?${stringify(params)}`);
}

//员工组织管理--根据树节点id获取组织详情
export async function getOrgInfoById(params) {
    return request(`/api/teaching/getOrgDetail?${stringify(params)}`);
}

//员工组织管理--根据节点获取节点完整路径
export async function getPathByTreeId(params) {
    return request(`/api/teaching/getOrgCompletePath?${stringify(params)}`);
}

//员工组织管理--新建组织
export async function createOrg(params) {
    return request('/api/teaching/addOrgTreeNode', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//员工组织管理--删除组织
export async function deleteOrg(params) {
    return request(`/api/teaching/deleteOrgTreeNode?${stringify(params)}`);
}

//员工组织管理--获取所有员工人员列表
export async function getUsers(params) {
    return request(`/api/teaching/getUsers?${stringify(params)}`);
}

//员工组织管理--添加员工
export async function addStaff(params) {
    return request('/api/teaching/addUserToNode', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//员工组织管理--批量删除员工
export async function deleteMore(params) {
    return request('/api/teaching/deletedUserFromNode', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//员工组织管理--编辑组织查询详情
export async function fetchOrgDetailByEdit(params) {
    return request(`/api/teaching/select/org?${stringify(params)}`);
}

//员工组织管理--编辑组织确认提交
export async function fetchUpdateOrg(params) {
    return request('/api/teaching/updateOrgTreeNode', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//员工组织管理--获取所有配置角色列表
export async function getConfigureRole(params) {
    return request(`/api/teaching/listTreeNodeUseTag?${stringify(params)}`);
}

//设置组织角色--保存设置组织角色
export async function setOrgRole(params) {
    return request('/api/teaching/setOrgNodeRole', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//设置组织角色--获取组织角色列表
export async function getOrgRoleList(params) {
    return request(`/api/getOrgRoleList?${stringify(params)}`);
}

//设置组织角色--删除组织角色中的一个用户
export async function deleteOrgRole(params) {
    return request(`/api/teaching/deleteUserForRole?${stringify(params)}`);
}

//设置组织角色--删除组织角色
export async function deleteOrgNodeRole(params) {
    return request(`/api/teaching/deleteOrgNodeRole?${stringify(params)}`);
}

//行政班--根据组织节点查询对应年级的英文名称和中文名称
export async function fetchParentName(params) {
    return request(`/api/teaching/select/admin/grade?${stringify(params)}`);
}

//转移或着批量转移员工或者学生
export async function transferStaff(params) {
    return request('/api/teaching/transferUser', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//添加外部员工
export async function addExternalStaff(params) {
    return request('/api/teaching/addExternalEmployee', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//添加外部员工的检查
export async function checkAddExternalEmployee(params) {
    return request('/api/teaching/checkAddExternalEmployee', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//批量设置直线主管
export async function batchSetController(params) {
    return request('/api/teaching/batchUpdateLeader', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//查看员工信息
export async function lookStaffDetail(params) {
    return request(`/api/teaching/userDetail?${stringify(params)}`);
}

//钉钉同步员工组织
export async function confirmDdNodeInfo(params) {
    return request(`/test/test?${stringify(params)}`);
}

//获取主管列表
export async function getEmployee(params) {
    return request(`/api/teaching/getEmployee?${stringify(params)}`);
}

export async function listSpecialtyTutor(params) {
    return request(`/api/teaching/student/listSpecialtyTutor?${stringify(params)}`);
}

//编辑外部员工
export async function updateExternalEmployee(params) {
    return request('/api/teaching/updateExternalEmployee', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

//外聘员工离职
export async function employeeQuit(params) {
    return request(`/api/teaching/quitExternalEmployee?${stringify(params)}`);
}

//批量导入学生
export async function importUserList(params) {
    return request('/api/teaching/student/simpleImportTeacherList', {
        method: 'POST',
        body: params,
    });
}

//批量导入外聘教师
export async function importExternalUserList(params) {
    return request('/api/teaching/addExternalEmployeeExcel', {
        method: 'POST',
        body: params,
    });
}

//角色列表
export async function getRoleList(params) {
    return request(`/api/role/baseTag/roleList?${stringify(params)}`);
}

//新建角色
export async function createRole(params) {
    return request('/api/role/baseTag/insertRole', {
        method: 'POST',
        body: params,
    });
}

//编辑角色
export async function editRole(params) {
    return request('/api/role/baseTag/editRole', {
        method: 'POST',
        body: params,
    });
}

//创建内置角色
export async function systemBuiltRole(params) {
    return request(`/api/role/baseTag/listBuiltInRole?${stringify(params)}`);
}

//角色人员详情信息
export async function getRoleUserInfo(params) {
    return request(`/api/role/baseTag/roleUserInfoList?${stringify(params)}`);
}

//编辑修改角色人员详情信息
export async function editRoleUserInfoList(params) {
    return request('/api/role/baseTag/editUserRole', {
        method: 'POST',
        body: params,
    });
}

//删除员工
export async function deleteStaff(params) {
    return request(`/api/teaching/deletedUser?${stringify(params)}`);
}

// 列表详情
export async function getPermissionListById(params) {
    return request('/acl/api/getPermissionListById', {
        method: 'POST',
        body: params
    })
}

// 选择具体范围
export async function getClassOrGradeByParamType(params) {
    return request(`/acl/api/getClassOrGradeByParamType?${stringify(params)}`)
}

// 选择数据权限规则
export async function selectRuleByPermissionId(params) {
    return request(`/acl/api/selectRuleByPermissionId?${stringify(params)}`)
}

export async function listGradeGroup(params) {
    return request(`/acl/api/listGradeGroup?${stringify(params)}`)
}

export async function getTableData(params) {
    return request('/api/teacher/external/listExternalUser', {
        method: 'POST',
        body: params
    })
}

// 权限点规则删除
export async function deletePermissionPackageRuleRelation(params) {
    return request('/acl/api/deletePermissionPackageRuleRelation', {
        method: 'POST',
        body: params
    })
}

// 配置权限点编辑完成
export async function updatePermissionPackageRuleRelation(params) {
    return request('/acl/api/updatePermissionPackageRuleRelation', {
        method: 'POST',
        body: params
    })
}

// 新增
export async function insertSysRolePermission(params) {
    return request('/api/teaching/insertSysRolePermission', {
        method: 'POST',
        body: params
    })
}

// 批量设置
export async function batchAccountPackage(params) {
    return request('/api/teaching/batchAccountPackage', {
        method: 'POST',
        body: params
    })
}

//删除
export async function delRolePermissionRelations(params) {
    return request('/api/teaching/delRolePermissionRelations', {
        method: 'POST',
        body: params
    })
}

// 配置权限点编辑完成(新)
export async function updatePermissionPackageRuleRelationNew(params) {
    return request('/acl/api/updatePermissionPackageRuleRelationNew', {
        method: 'POST',
        body: params
    })
}

// 离职/批量离职人员
export async function batchQuitExternalEmployee(params) {
    return request('/api/teacher/external/option/batchQuitExternalEmployee', {
        method: 'POST',
        body: params
    })
}

//删除人员
export async function deletedExternalEmployee(params) {
    return request(`/api/teacher/external/option/deletedExternalEmployee?${stringify(params)}`)
}

//外聘人员信息
export async function getExternalDetailInfo(params) {
    return request(`/api/teacher/external/getExternalDetailInfo?${stringify(params)}`)
}

//外聘复职
export async function reinstatementExternalEmployee(params) {
    return request(`/api/teacher/external/option/reinstatementExternalEmployee?${stringify(params)}`)
}

export async function getApproveExternalDetailInfo(params) {
    return request(`/api/teacher/external/getApproveExternalDetailInfo?${stringify(params)}`)
}

// 外聘审核通过
export async function approveExternalInfo(params) {
    return request('/api/teacher/external/approveExternalInfo', {
        method: 'POST',
        body: params
    })
}

// 待入职和已拒绝详情提交
export async function updateApproveExternalInfo(params) {
    return request('/api/teacher/external/updateApproveExternalInfo', {
        method: 'POST',
        body: params
    })
}

//提交申请
export async function submitExternalInfo(params) {
    return request('/api/teacher/external/submitExternalInfo', {
        method: 'POST',
        body: params
    })
}