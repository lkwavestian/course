import { message } from 'antd';
import { loginRedirect } from '../utils/utils';
import {
    getTreeData,
    getTeacherList,
    getOrgInfoById,
    createOrg,
    deleteOrg,
    getUsers, //添加员工，获取所有的员工列表
    getPathByTreeId,
    addStaff,
    deleteMore,
    fetchOrgDetailByEdit,
    fetchUpdateOrg,
    getCountryList, //获取国家
    setOrgRole, //设置角色
    getConfigureRole, //获取配置角色列表
    deleteOrgRole, //删除组织角色中的一个用户
    deleteOrgNodeRole, //删除组织中的角色
    fetchParentName, //行政班（根据当前的组织节点查询英文名称和中文名称）
    transferStaff, //转移或批量转移
    addExternalStaff, //添加外部员工
    batchSetController, //批量设置直线主管,
    lookStaffDetail, //查看员工的详细信息
    confirmDdNodeInfo, //钉钉同步员工组织确认信息
    getEmployee, //获取直线主管列表、获取在职员工列表
    listSpecialtyTutor,
    checkAddExternalEmployee, //添加外部员工--校验
    updateExternalEmployee, //编辑外部员工
    employeeQuit, //外聘员工离职
    importUserList,
    importExternalUserList,
    getRoleList,
    createRole,
    editRole,
    deleteRole,
    systemBuiltRole,
    getRoleUserInfo,
    editRoleUserInfoList,
    deleteStaff,
    getAllApp,
    getClassOrGradeByParamType,
    selectRuleByPermissionId,
    getPermissionListById,
    deletePermissionPackageRuleRelation,
    updatePermissionPackageRuleRelation,
    updatePermissionPackageRuleRelationNew,
    listGradeGroup,
    getTableData,
    batchQuitExternalEmployee,
    deletedExternalEmployee,
    getExternalDetailInfo,
    reinstatementExternalEmployee, // 外聘复职
    approveExternalInfo, // 外聘审核通过
    updateApproveExternalInfo, // 待入职和已拒绝详情编辑提交
    getApproveExternalDetailInfo, 
    submitExternalInfo,
    insertSysRolePermission,
    batchAccountPackage,
    delRolePermissionRelations,
} from '../services/teacher';

export default {
    namespace: 'teacher',
    state: {
        countryInfoData: [], //获取国家数据
        treeDataSource: [],
        teacherTableList: {}, //教师table列表
        teacherOrgInfoById: {}, //组织信息详情
        addTeacherList: [], //添加员工--所有员工列表
        orgCompletePath: '', //获取节点完整路径
        fetchOrgByEditDetail: {}, //编辑组织获取详情
        fetchOrgParentName: {}, //新建组织或编辑组织获取年级的名称
        configureRoleList: [], //获取设置组织角色的列表
        staffDetail: {}, //员工详细信息
        ddNodeInfo: {}, //钉钉同步员工信息
        employeeList: [], //直线主管列表
        speEmployeeList: [], //特长教练列表
        checkEmployeeResponse: {}, //添加外部员工校验结果
        importExternalUserList: [],
        roleList: { formalRoleTagList: [], systemRoleTagList: [] }, //角色列表
        roleUserInfo: [], //角色人员详细信息
        roleSemester: '', //所选角色学期
        roleSchoolId: '',
        eduId: '',
        roleTagInfo: {}, //所选角色具体信息
        roleTableLoading: false, //角色人员表loading..
        systemBuiltRole: [],
        teacherImportMessage: undefined,
        tableList: [],
        rangeList: [],
        ruleList: [],
        pointDelMsg: '',
        listGradeGroup: {},
        tag: '',
        permissDetail: [],
        selectedIdx: undefined,
        employeeLists: [],//外聘列表
        employeeInfo: {}, //外聘详情 抽屉用
        approveExternalDetail: {}, //待入职和已离职详情
        insertMsg: {},
    },
    effects: {
        //改变角色loading状态
        *toggleRoleTableLoading({ payload, onSuccess }, { call, put }) {
            yield put({
                type: 'setRoleTableLoading',
                payload,
            });
        },

        //获得角色学校ID
        *getRoleSchoolId({ payload, onSuccess }, { call, put }) {
            yield put({
                type: 'setRoleSchoolId',
                payload,
            });
        },

        *setTag({ payload, onSuccess }, { call, put }){
            yield put({
                type: 'setTagInfo',
                payload,
            })
        },

        *clearData({ payload, onSuccess }, { call, put }){
            yield put({
                type: 'clearDetail',
                payload,
            })
        },

        //获得角色身份
        *getRoleEduId({ payload, onSuccess }, { call, put }) {
            yield put({
                type: 'setRoleEduId',
                payload,
            });
        },

        //所选角色管辖范围
        *getRoleTagInfo({ payload, onSuccess }, { call, put }) {
            yield put({
                type: 'setRoleTagInfo',
                payload,
            });
        },

        //存储所选学期
        *getRoleSemester({ payload, onSuccess }, { call, put }) {
            yield put({
                type: 'setRoleSemester',
                payload,
            });
        },

        *setPermissiomList({ payload, onSuccess }, { call, put }) {
            yield put({
                type: 'permissionList',
                payload,
            });
        },

        *setPermissiomIndex({ payload, onSuccess }, { call, put }) {
            yield put({
                type: 'selectedReducer',
                payload,
            });
        },

        //角色列表（左侧）
        *getRoleList({ payload, onSuccess }, { call, put }) {
            const response = yield call(getRoleList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setRoleList',
                        payload:
                            Object.keys(response.content).length !== 0
                                ? response.content
                                : { formalRoleTagList: [], systemRoleTagList: [] }, //角色列表
                    });
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        //新建角色
        *createRole({ payload, onSuccess }, { call, put }) {
            const response = yield call(createRole, payload);
            if (response.ifLogin) {
                if (response.status) {
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        //编辑角色
        *editRole({ payload, onSuccess }, { call, put }) {
            const response = yield call(editRole, payload);
            if (response.ifLogin) {
                if (response.status) {
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        //创建内置角色
        *systemBuiltRole({ payload, onSuccess }, { call, put }) {
            const response = yield call(systemBuiltRole, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setSystemBuiltRole',
                        payload: response.content,
                    });
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        //角色人员详情信息
        *getRoleUserInfo({ payload, onSuccess }, { call, put }) {
            const response = yield call(getRoleUserInfo, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setRoleUserInfo',
                        payload: response.content,
                    });
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        //编辑修改角色人员详情信息
        *editRoleUserInfoList({ payload, onSuccess }, { call, put }) {
            const response = yield call(editRoleUserInfoList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *getTreeData({ payload, onSuccess }, { call, put }) {
            //组织结构
            const response = yield call(getTreeData, payload);
            if (response.ifLogin === true) {
                if (response.status === true) {
                    yield put({
                        type: 'fetchTreeData',
                        payload: response.content,
                    });
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getOrgInfoById({ payload, onSuccess }, { call, put }) {
            //根据树节点id获取组织的详细信息
            const response = yield call(getOrgInfoById, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'fetchOrgInfoById',
                        payload: response.content,
                    });
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getTeacherList({ payload }, { call, put }) {
            //获取员工人员列表
            const response = yield call(getTeacherList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateTeacherList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *createOrg({ payload, onSuccess }, { call, put }) {
            //新建组织
            const response = yield call(createOrg, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('创建组织成功~');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *deleteOrg({ payload, onSuccess }, { call, put }) {
            //删除组织
            const response = yield call(deleteOrg, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('删除组织成功~');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getPathByTreeId({ payload, onSuccess }, { call, put }) {
            //根据节点id获取完整的路径
            const response = yield call(getPathByTreeId, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'fetcPathByTreeId',
                        payload: response.content && response.content.path,
                    });
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getAllTeacherList({ payload }, { call, put }) {
            //添加员工--获取所有员工的列表
            const response = yield call(getUsers, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'fetchTeacherList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *addStaff({ payload, onSuccess }, { call }) {
            //添加员工
            const response = yield call(addStaff, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('添加成功~');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *deleteMore({ payload, onSuccess }, { call }) {
            //批量删除
            const response = yield call(deleteMore, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('移除成功~');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *fetchOrgDetailByEdit({ payload, onSuccess }, { call, put }) {
            //编辑组织--根据当前查询要编辑的信息
            const response = yield call(fetchOrgDetailByEdit, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateOrgDetailByEdit',
                        payload: response.content,
                    });
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *fetchParentName({ payload, onSuccess }, { call, put }) {
            //新建或编辑组织--根据当前节点查询中文名称和英文名称
            const response = yield call(fetchParentName, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateParentName',
                        payload: response.content,
                    });
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                    yield put({
                        type: 'updateParentName',
                        payload: [],
                    });
                }
            } else {
                loginRedirect();
            }
        },
        *updateOrg({ payload, onSuccess }, { call }) {
            //确定编辑组织
            const response = yield call(fetchUpdateOrg, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('编辑成功~');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *setOrgRole({ payload, onSuccess }, { call }) {
            //保存设置角色
            const response = yield call(setOrgRole, payload);
            if (response.ifLogin) {
                if (response.status) {
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getCountryList({ payload }, { call, put }) {
            //获取国家数据
            const response = yield call(getCountryList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateCountryList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getConfigureRole({ payload }, { call, put }) {
            //获取配置角色列表
            const response = yield call(getConfigureRole, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateConfigureRole',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *deleteOrgRole({ payload, onSuccess }, { call }) {
            //删除组织角色中的一个用户
            const response = yield call(deleteOrgRole, payload);
            if (response.ifLogin) {
                if (response.status) {
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *deleteOrgNodeRole({ payload, onSuccess }, { call }) {
            //删除组织中的角色
            const response = yield call(deleteOrgNodeRole, payload);
            if (response.ifLogin) {
                if (response.status) {
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *transferStaff({ payload, onSuccess }, { call }) {
            //转移或者批量转移
            const response = yield call(transferStaff, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('转移成功~');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *addExternalStaff({ payload, onSuccess }, { call }) {
            //添加外部员工
            const response = yield call(addExternalStaff, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('添加成功~');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *batchSetController({ payload, onSuccess }, { call }) {
            //批量设置直线主管
            const response = yield call(batchSetController, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('设置成功~');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *lookStaffDetail({ payload }, { call, put }) {
            //查看员工详细信息
            const response = yield call(lookStaffDetail, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'fetchStaffDetail',
                        payload: response,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *confirmDdNodeInfo({ payload }, { call, put }) {
            //钉钉同步确认信息
            const response = yield call(confirmDdNodeInfo, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateDdNodeInfo',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getEmployee({ payload, onSuccess }, { call, put }) {
            //获取直线主管列表
            const response = yield call(getEmployee, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateEmployeeList',
                        payload: response.content,
                    });
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *listSpecialtyTutor({ payload, onSuccess }, { call, put }) {
            //获取直线主管列表
            const response = yield call(listSpecialtyTutor, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateSpeEmployeeList',
                        payload: response.content,
                    });
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *checkAddExternalEmployee({ payload, onSuccess }, { call, put }) {
            //添加外部员工--检查
            const response = yield call(checkAddExternalEmployee, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'checkResponse',
                        payload: response.content,
                    });
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *updateExternalEmployee({ payload, onSuccess }, { call, put }) {
            //编辑外部员工
            const response = yield call(updateExternalEmployee, payload);
            if (response.ifLogin) {
                if (response.status) {
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *employeeQuit({ payload, onSuccess }, { call, put }) {
            //外聘员工的离职
            const response = yield call(employeeQuit, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('操作成功~');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *importUserList({ payload, onSuccess }, { call, put }) {
            //批量修改学生档案
            const response = yield call(importUserList, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                // return;
            } else {
                message.success(response.message);
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'teacherImportReducer',
                payload: response.content,
            });
        },
        *importExternalUserList({ payload, onSuccess }, { call, put }) {
            console.log('payload :>> ', payload);
            //批量修改学生档案
            const response = yield call(importExternalUserList, payload);
            console.log('response :>> ', response);
            if (response.ifLogin) {
                if (!response.status) {
                    console.log('response.status :>> ', response.status);
                    yield put({
                        type: 'setImportExternalUserList',
                        payload: response.content,
                    });
                } else {
                    yield put({
                        type: 'setImportExternalUserList',
                        payload: [],
                    });
                }
            } else {
                loginRedirect();
            }
        },
        *delete({ payload, onSuccess }, { call }) {
            //批量删除
            const response = yield call(deleteStaff, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('删除成功~');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getAllApp({ payload, onSuccess }, { call, put }) {
            //添加外部员工--检查
            const response = yield call(getAllApp, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'app',
                        payload: response.content
                    });
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        // 列表
        *getPermissionListById({ payload }, { call, put }) {  // eslint-disable-line
            const response = yield call(getPermissionListById, payload);
            if (response.code == '1000') {
                loginRedirect();
            } else {
                if (response.status) {
                    yield put({
                        type: 'list',
                        payload: response.content
                    });
                } else {
                    message.error(response.message)
                }
            }
        },
        // 选择规则具体范围
        *getClassOrGradeByParamType({ payload }, { call, put }) {  // eslint-disable-line
            const response = yield call(getClassOrGradeByParamType, payload);
            if (response.code == '1000') {
                loginRedirect();
            } else {
                if (response.status) {
                    yield put({
                        type: "range",
                        payload: response.content,
                        paramType: payload.paramType
                    });
                } else {
                    message.error(response.message)
                }
            }
        },
        // 数据权限选择规则
        *selectRuleByPermissionId({ payload }, { call, put }) {  // eslint-disable-line
            const response = yield call(selectRuleByPermissionId, payload);
            if (response.code == '1000') {
                loginRedirect();
            } else {
                if (response.status) {
                    yield put({
                        type: "selectRules",
                        payload: response.content
                    });
                } else {
                    message.error(response.message)
                }
            }
        },
        *deletePermissionPackageRuleRelation({ payload }, { call, put }) {  // eslint-disable-line

            const response = yield call(deletePermissionPackageRuleRelation, payload);
            if (response.code == '1000') {
                loginRedirect();
            } else {
                if (response.status) {
                    yield put({
                        type: 'lin',
                        payload: response
                    });
                    message.success(response.message)
                } else {
                    message.error(response.message)
                }
            }
        },
        // 配置权限点编辑完成
        *updatePermissionPackageRuleRelation({ payload }, { call, put }) {  // eslint-disable-line
            const response = yield call(updatePermissionPackageRuleRelation, payload);
            if (response.code == '1000') {
                loginRedirect();
            } else {
                if (response.status) {
                    yield put({
                        type: 'edit',
                        payload: response
                    });
                    message.success('设置成功');
                } else {
                    message.error(response.message)
                }
            }
        },
        *insertSysRolePermission({ payload }, { call, put }) {  // eslint-disable-line
            const response = yield call(insertSysRolePermission, payload);
            if (response.code == '1000') {
                loginRedirect();
            } else {
                if (response.status) {
                    yield put({
                        type: 'insert',
                        payload: response.content
                    });
                    message.success(response.message);
                } else {
                    message.error(response.message)
                }
            }
        },
        *batchAccountPackage({ payload }, { call, put }) {  // eslint-disable-line
            const response = yield call(batchAccountPackage, payload);
            if (response.code == '1000') {
                loginRedirect();
            } else {
                if (response.status) {
                    // yield put({
                    //     type: 'edit',
                    //     payload: response
                    // });
                    // message.success('创建成功');
                } else {
                    message.error(response.message)
                }
            }
        },
        *delRolePermissionRelations({ payload }, { call, put }) {  // eslint-disable-line
            const response = yield call(delRolePermissionRelations, payload);
            if (response.code == '1000') {
                loginRedirect();
            } else {
                if (response.status) {
                    // yield put({
                    //     type: 'edit',
                    //     payload: response
                    // });
                    message.success(response.message);
                } else {
                    message.error(response.message)
                }
            }
        },
        // 配置权限点编辑完成(新)
        *updatePermissionPackageRuleRelationNew({ payload }, { call, put }) {  // eslint-disable-line
            const response = yield call(updatePermissionPackageRuleRelationNew, payload);
            if (response.code == '1000') {
                loginRedirect();
            } else {
                if (response.status) {
                    yield put({
                        type: 'edit',
                        payload: response
                    });
                    message.success('设置成功');
                } else {
                    message.error(response.message)
                }
            }
        },

        *listGradeGroup({ payload }, { call, put }) {  // eslint-disable-line
            const response = yield call(listGradeGroup, payload);
            if (response.code == '1000') {
                loginRedirect();
            } else {
                if (response.status) {
                    yield put({
                        type: 'listReducer',
                        payload: response.content
                    });
                } else {
                    message.error(response.message)
                }
            }
        },
        *getTableData({ payload }, { call, put }) {  // eslint-disable-line
            const response = yield call(getTableData, payload);
            if (response.code == '1000') {
                loginRedirect();
            } else {
                if (response.status) {
                    yield put({
                        type: 'tableDataReducer',
                        payload: response.content
                    });
                } else {
                    message.error(response.message)
                }
            }
        },
        *getExternalDetailInfo({ payload }, { call, put }) {  // eslint-disable-line
            const response = yield call(getExternalDetailInfo, payload);
            if (response.code == '1000') {
                loginRedirect();
            } else {
                if (response.status) {
                    yield put({
                        type: 'employeeInfoReducer',
                        payload: response
                    });
                } else {
                    message.error(response.message)
                }
            }
        },
        *getApproveExternalDetailInfo({ payload }, { call, put }) {  // eslint-disable-line
            const response = yield call(getApproveExternalDetailInfo, payload);
            if (response.code == '1000') {
                loginRedirect();
            } else {
                if (response.status) {
                    yield put({
                        type: 'externalDetailReducer',
                        payload: response.content
                    });
                } else {
                    message.error(response.message)
                }
            }
        },
        *batchQuitExternalEmployee({ payload, onSuccess }, { call, put }) {  // eslint-disable-line
            const response = yield call(batchQuitExternalEmployee, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('操作成功~');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *reinstatementExternalEmployee({ payload, onSuccess }, { call, put }) {  // eslint-disable-line
            const response = yield call(reinstatementExternalEmployee, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('操作成功~');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *approveExternalInfo({ payload, onSuccess }, { call, put }) {  // eslint-disable-line
            const response = yield call(approveExternalInfo, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('操作成功~');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *updateApproveExternalInfo({ payload, onSuccess }, { call, put }) {  // eslint-disable-line
            const response = yield call(updateApproveExternalInfo, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('操作成功~');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *deletedExternalEmployee({ payload, onSuccess }, { call, put }) {  // eslint-disable-line
            const response = yield call(deletedExternalEmployee, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('操作成功~');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *submitExternalInfo({ payload, onSuccess }, { call, put }) {  // eslint-disable-line
            const response = yield call(submitExternalInfo, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('操作成功~');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
    },

    reducers: {
        edit(state, action) {
            return {
                ...state,
                editMsg: action.payload
            }
        },
        insert(state, action) {
            return {
                ...state,
                insertMsg: action.payload
            }
        },
        listReducer(state, action) {
            return {
                ...state,
                listGradeGroup: action.payload
            }
        },
        tableDataReducer(state, action) {
            return {
                ...state,
                employeeLists: action.payload
            }
        },
        employeeInfoReducer(state, action) {
            return {
                ...state,
                employeeInfo: action.payload
            }
        },
        externalDetailReducer(state, action) {
            return {
                ...state,
                approveExternalDetail: action.payload
            }
        },
        lin(state, action) {
            return {
                ...state,
                pointDelMsg: action.payload
            }
        },
        selectRules(state, action) {
            return {
                ...state,
                ruleList: action.payload
            }
        },
        range(state, action) {
            if (Object.prototype.toString.call(state.rangeList).indexOf('Object') < 0) {
                state.rangeList = {};
            }
            state.rangeList[action.paramType] = action.payload;
            return {
                ...state,
                rangeList: { ...state.rangeList }
            }
        },
        list(state, action) {
            console.log('action: ', action.payload);
            return {
                ...state,
                tableList: action.payload
            }
        },
        app(state, action) {
            return {
                ...state,
                allAppList: action.payload
            }
        },
        setRoleSchoolId(state, action) {
            return {
                ...state,
                roleSchoolId: action.payload,
            };
        },
        setTagInfo(state, action) {
            return {
                ...state,
                tag: action.payload,
            };
        },

        clearDetail(state, action){
            return {
                ...state,
                roleUserInfo:[],
            };
        },

        setRoleEduId(state, action) {
            return {
                ...state,
                eduId: action.payload,
            };
        },

        setSystemBuiltRole(state, action) {
            return {
                ...state,
                systemBuiltRole: action.payload,
            };
        },

        setRoleTableLoading(state, action) {
            return {
                ...state,
                roleTableLoading: action.payload,
            };
        },

        setRoleTagInfo(state, action) {
            console.log('action: ', action);
            return {
                ...state,
                roleTagInfo: action.payload,
            };
        },

        setRoleSemester(state, action) {
            return {
                ...state,
                roleSemester: action.payload,
            };
        },

        permissionList(state, action) {
            return {
                ...state,
                permissDetail: action.payload,
            };
        },

        selectedReducer(state, action) {
            return {
                ...state,
                selectedIdx: action.payload,
            };
        },

        setRoleUserInfo(state, action) {
            return {
                ...state,
                roleUserInfo: action.payload,
            };
        },

        setRoleList(state, action) {
            return {
                ...state,
                roleList: action.payload,
            };
        },

        fetchTreeData(state, action) {
            return {
                ...state,
                treeDataSource: action.payload,
            };
        },
        fetchOrgInfoById(state, action) {
            return {
                ...state,
                teacherOrgInfoById: action.payload,
            };
        },
        updateTeacherList(state, action) {
            return {
                ...state,
                teacherTableList: action.payload,
            };
        },
        fetchTeacherList(state, action) {
            return {
                ...state,
                addTeacherList: action.payload,
            };
        },
        fetcPathByTreeId(state, action) {
            return {
                ...state,
                orgCompletePath: action.payload,
            };
        },
        updateOrgDetailByEdit(state, action) {
            return {
                ...state,
                fetchOrgByEditDetail: action.payload,
            };
        },
        updateParentName(state, action) {
            return {
                ...state,
                fetchOrgParentName: action.payload,
            };
        },
        updateConfigureRole(state, action) {
            return {
                ...state,
                configureRoleList: action.payload,
            };
        },
        updateCountryList(state, action) {
            return {
                ...state,
                countryInfoData: action.payload,
            };
        },
        fetchStaffDetail(state, action) {
            return {
                ...state,
                staffDetail: action.payload,
            };
        },
        updateDdNodeInfo(state, action) {
            return {
                ...state,
                ddNodeInfo: action.payload,
            };
        },
        updateEmployeeList(state, action) {
            return {
                ...state,
                employeeList: action.payload,
            };
        },
        updateSpeEmployeeList(state, action) {
            return {
                ...state,
                speEmployeeList: action.payload,
            };
        },
        checkResponse(state, action) {
            return {
                ...state,
                checkEmployeeResponse: action.payload,
            };
        },
        setImportExternalUserList(state, action) {
            return {
                ...state,
                importExternalUserList: action.payload,
            };
        },

        clearData(state, action) {
            return {
                ...state,
                teacherOrgInfoById: {},
                teacherTableList: {},
            };
        },
        teacherImportReducer(state, action) {
            return {
                ...state,
                teacherImportMessage: action.payload,
            };
        },
    },
};
