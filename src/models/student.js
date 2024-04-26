import { message } from 'antd';
import { loginRedirect } from '../utils/utils';
import {
    getStudentOrg,
    listSuspendStudyOrgTree,
    listGraduationOrgTree,
    getStudentList,
    getGradeList,
    addStudentList,
    notAdminStudent,
    lookApplyGrade,
    getSetOrgRoleStudent,
    nonAdministrationClass,
    getStudentDetails, //获取学生信息档案详情
    exportButtonList,
    getProvince, //获取省市区
    getNationList, //获取民族
    getCountryList, //获取国家
    getAllGrade, //获取所有年级
    exportStudentSource, //批量导出学生档案
    resetPassword, //重置学生账号密码
    addStudentParent, //添加学生家长
    updateStudentParent, //编辑学生家长
    deleteStudentParent, //删除学生家长
    updateStudentProfile, //编辑学生档案
    batchEditInfo, //批量修改学生档案
    batchSetStudentTutor, //批量设置学生导师
    batchSetStudentSpecialtyTutor,
    batchSetStudentNotice, //批量通知家长
    getEndClassNumber, //获取结班数量
    confirmEndClass, //确认结班
    submitTransferSchool, // 提交转学信息
    onClickUrged, //催一下
    submitSuspensionSchool, // 提交休学信息
    submitGiveUpSchool, //提交放弃信息
    submitResumptionSchool, // 提交复学信息
    recoveryStudentList, // 学生复学记录
    recordList, //更新记录
    subupdateStudentInfo, //被动学生更新
    parentUpdateStudentInfo, //主动学生更新
    leftSchoolReason, // 设置离校去向
    graduationDestination, // 设置毕业去向
    checkUpgrade, // 是否可以升年级
    upgradeInfo, // 升年级详情
    confirmUpgrade, // 确认升年级
    listGraduationStudent,
    updateSuspendStudy, // 更新休学
    suspendStudyInfo, // 获取休学信息
    studentStatusRecord, // 获取学籍记录
    previewFile, // 预览
    downloadExcel, // 下载
    checkStudentInfo, //是否能更新
    parentChildList, //几孩子
    upDateStudentInfo, //学生更新详qing
    confirmStudentInfo, //不更改学生信息
    checkNewYearInit, // 是否展示初始页
    upgradeConfiguration, // 升年级配置回显
    upGradeForSure, // 确定升年级
    getListSchool, // 学校下拉
    getListSchoolYear, // 学年下拉
    importUserList, //批量导入学生
    // provinceList, //地区列表
    streetList,
    streetAddressList,
    streetBornList,
    streetContactList,
    endStudentTutor,
    searchDormitoryByWord,
    getSchoolBusList,
    exportNeedUpdateStudent,
    createStudent,
    listGradeGroup,
    downloadList,
    batchExport,
} from '../services/student';

export default {
    namespace: 'student',
    state: {
        treeDataSource: [],
        orgInfoById: {}, //组织信息详情
        studentTableList: {}, //学生table列表
        addStudentGradeList: [], //行政班添加学生的年级列表
        addStudentStudentList: [], //行政班添加学生的学生列表
        notAdminStudentList: [], //非行政班添加学生的学生列表
        fetchApplyGradeData: [], //查询适用年级
        setOrgRoleStudentList: [], //设置组织角色的学生列表
        updateNonAdministrationClass: [], //非行政班年级
        studentDetailInfo: {}, //学生档案信息详情
        provinceInfoData: [], //获取省市区数据
        nationInfoData: [], //获取民族数据
        countryInfoData: [], //获取国家数据
        allGradeInfoData: [], //获取所有年级的数据
        endClassCount: 0, //获取分类节点下的结班数量
        recoveryStudentList: {}, // 学生复学记录
        recordList: [], //更新记录
        subupdateStudentInfo: {}, //通知更新提交
        parentUpdateStudentInfo: {}, //主动提交
        checkUpgrade: false, // 默认不可以升年级
        upgradeInfo: [], // 升年级详情
        suspendStudyInfo: {}, // 休学详情
        studentStatusRecord: [], // 学籍记录
        previewFile: '', // 预览
        downloadExcel: '', //下载
        checkStudentInfo: {}, //是否能更新
        parentChildList: [], //几孩子
        upDateStudentInfo: {}, //更新详情
        confirmStudentInfo: {},
        isNewYearInit: '', // 是否初始页
        upgradeConfigurationList: [], // 升年级设置列表
        listSchooliSelectInfo: [], // 学生管理 学校下拉列表
        listSchoolYearSelectInfo: [], // 学生管理 学年下拉列表
        // provinceList: [], //地区列表
        streetList: [], //街道列表
        streetAddressList: [],
        streetBornList: [],
        streetContactList: [],
        // submitGiveUpSchool: [],
        studentImportMessage: undefined,
        endStudentTutor: undefined,
        dormitoryList: [],
        schoolBusList: [],
        tutorList: [],
        gradeGroupList: [],
        downloadStuList: [],
        importMessageList: [],
    },
    effects: {
        *getListSchoolYear({ payload, onSuccess }, { call, put }) {
            const response = yield call(getListSchoolYear, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'listSchoolYeariInfo',
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
        *getListSchool({ payload, onSuccess }, { call, put }) {
            const response = yield call(getListSchool, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'listSchooliInfo',
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
        *upGradeForSure({ payload, onSuccess }, { call, put }) {
            const response = yield call(upGradeForSure, payload);
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
        *upgradeConfiguration({ payload, onSuccess }, { call, put }) {
            const response = yield call(upgradeConfiguration, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'getUpgradeConfiguration',
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
        *checkNewYearInit({ payload, onSuccess }, { call, put }) {
            const response = yield call(checkNewYearInit, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'getIsNewYearInit',
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
        *getTreeData({ payload, onSuccess }, { call, put }) {
            let { statusType } = payload;
            let response = null;
            // 组织树来自三种不同的结构
            if (statusType == 1) {
                response = yield call(getStudentOrg, payload);
            } else if (statusType == 2) {
                response = yield call(listSuspendStudyOrgTree, payload);
            } else if (statusType == 3) {
                response = yield call(listGraduationOrgTree, payload);
            }
            if (response.ifLogin) {
                if (response.status) {
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
        *getStudentList({ payload }, { call, put }) {
            //获取学生人员列表
            let { statusType } = payload;
            let response = null;
            if (statusType == 3) {
                // 离校
                response = yield call(listGraduationStudent, payload);
                response.content.orgUserList =
                    (response.content.data && response.content.data) || [];
            } else {
                response = yield call(getStudentList, payload);
            }
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateStudentList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getGradeList({ payload, onSuccess }, { call, put }) {
            //添加学生--获取年级--行政班
            const response = yield call(getGradeList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'fetchGradeList',
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
        *addStudentList({ payload, onSuccess }, { call, put }) {
            //添加学生--非行政班根据班级获得学生列表
            const response = yield call(addStudentList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'fetchStudentList',
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
        *notAdminStudent({ payload, onSuccess }, { call, put }) {
            //添加学生--获取行政班学生列表
            const response = yield call(notAdminStudent, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'fetchNotAdminStudent',
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
        *lookApplyGrade({ payload }, { call, put }) {
            //查看适用年级
            const response = yield call(lookApplyGrade, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateApplyGrade',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getSetOrgRoleStudent({ payload }, { call, put }) {
            //设置组织角色--获取可选择的学生列表
            const response = yield call(getSetOrgRoleStudent, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateOrgRoleStudent',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *nonAdministrationClass({ payload }, { call, put }) {
            //非行政班年级获取
            const response = yield call(nonAdministrationClass, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateNonAdministrationClass',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getStudentDetails({ payload, onSuccess }, { call, put }) {
            //获取学生档案信息详情
            const response = yield call(getStudentDetails, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateStudentDetails',
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

        *exportButtonList({ payload, onSuccess }, { call, put }) {
            //获取学生档案信息详情
            const response = yield call(exportButtonList, payload);
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

        *parentChildList({ payload, onSuccess }, { call, put }) {
            const response = yield call(parentChildList, payload);
            console.log(response);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'parentChildListReducer',
                        payload: response.content,
                    });
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
            onSuccess && onSuccess(response);
        },
        *getProvince({ payload }, { call, put }) {
            //获取省市区数据
            const response = yield call(getProvince, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateProvince',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *exportStudentSource({ payload, onSuccess }, { call, put }) {
            //批量导出学生档案
            const response = yield call(exportStudentSource, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('批量导出成功~');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *resetPassword({ payload, onSuccess }, { call, put }) {
            //重置学生账号密码
            const response = yield call(resetPassword, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('重置成功~');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *addStudentParent({ payload, onSuccess }, { call, put }) {
            //添加学生家长
            const response = yield call(addStudentParent, payload);
            if (response.ifLogin) {
                if (response.status) {
                    onSuccess && onSuccess(response);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *updateStudentParent({ payload, onSuccess }, { call, put }) {
            //编辑学生家长
            const response = yield call(updateStudentParent, payload);
            if (response.ifLogin) {
                if (response.status) {
                    onSuccess && onSuccess(response);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *deleteStudentParent({ payload, onSuccess }, { call, put }) {
            //删除学生家长
            const response = yield call(deleteStudentParent, payload);
            if (response.ifLogin) {
                if (response.status) {
                    onSuccess && onSuccess(response);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getNationList({ payload }, { call, put }) {
            //获取民族
            const response = yield call(getNationList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateNationList',
                        payload: response.content,
                    });
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
            // if (response.ifLogin) {
            if (response.status) {
                yield put({
                    type: 'updateCountryList',
                    payload: response.content,
                });
            } else {
                message.error(response.message);
            }
            // } else {
            //     loginRedirect();
            // }
        },
        *getAllGrade({ payload }, { call, put }) {
            //获取学生档案中的所有年级
            const response = yield call(getAllGrade, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateAllGradeList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *updateStudentProfile({ payload, onSuccess }, { call, put }) {
            //编辑学生档案
            const response = yield call(updateStudentProfile, payload);
            if (response.ifLogin) {
                if (response.status) {
                    onSuccess && onSuccess(response);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *batchEditInfo({ payload, onSuccess, onError }, { call, put }) {
            //批量修改学生档案
            const response = yield call(batchEditInfo, payload);
            console.log(response.content, 'response')
            if (response.ifLogin) {
                yield put({
                    type: 'importMessageReducer',
                    payload: response.content,
                });
                if (response.status) {
                    onSuccess && onSuccess();
                } else {
                    onError();
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *batchSetStudentTutor({ payload, onSuccess }, { call }) {
            //批量设置学生导师
            const response = yield call(batchSetStudentTutor, payload);
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
        *batchSetStudentSpecialtyTutor({ payload, onSuccess }, { call }) {
            //批量设置学生导师
            const response = yield call(batchSetStudentSpecialtyTutor, payload);
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
        *batchSetStudentNotice({ payload, onSuccess }, { call }) {
            //批量通知
            // debugger;
            const response = yield call(batchSetStudentNotice, payload);
            if (response.ifLogin) {
                if (response.status) {
                    onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getEndClassNumber({ payload }, { call, put }) {
            //获取结班数量
            const response = yield call(getEndClassNumber, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateEndClassNumber',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *confirmEndClass({ payload, onSuccess }, { call }) {
            //确认结班
            const response = yield call(confirmEndClass, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('结班操作成功~');
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *submitTransferSchool({ payload, onSuccess }, { call }) {
            const response = yield call(submitTransferSchool, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success(response.message);
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *onClickUrged({ payload, onSuccess }, { call }) {
            const response = yield call(onClickUrged, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success(response.message);
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *submitSuspensionSchool({ payload, onSuccess }, { call }) {
            let { statusType } = payload;
            let response = null;
            if (statusType == 1) {
                response = yield call(submitSuspensionSchool, payload);
            } else if (statusType == 2) {
                response = yield call(updateSuspendStudy, payload);
            }
            if (response.ifLogin) {
                if (response.status) {
                    message.success(response.message);
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *submitResumptionSchool({ payload, onSuccess }, { call }) {
            const response = yield call(submitResumptionSchool, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success(response.message);
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *submitGiveUpSchool({ payload, onSuccess }, { call }) {
            const response = yield call(submitGiveUpSchool, payload);
            if (response.ifLogin) {
                if (response.status) {
                    // message.success(response.message);
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *recoveryStudentList({ payload, onSuccess }, { call, put }) {
            //获取学生人员列表
            const response = yield call(recoveryStudentList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'recoveryStudentListReducer',
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
        *recordList({ payload, onSuccess }, { call, put }) {
            //获取学生人员列表
            const response = yield call(recordList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'recordListReducer',
                        payload: response.content,
                    });
                    onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *subupdateStudentInfo({ payload, onSuccess }, { call, put }) {
            const response = yield call(subupdateStudentInfo, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'subupdateStudentInfoReducer',
                        payload: response.content,
                    });
                    onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *parentUpdateStudentInfo({ payload, onSuccess }, { call, put }) {
            const response = yield call(parentUpdateStudentInfo, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'parentUpdateStudentInfoReducer',
                        payload: response.content,
                    });
                    onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *leftSchoolReason({ payload, onSuccess }, { call }) {
            const response = yield call(leftSchoolReason, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success(response.message);
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *graduationDestination({ payload, onSuccess }, { call }) {
            const response = yield call(graduationDestination, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success(response.message);
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *checkUpgrade({ payload, onSuccess }, { call, put }) {
            //获取学生人员列表
            const response = yield call(checkUpgrade, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'checkUpgradeReducer',
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
        *upgradeInfo({ payload, onSuccess }, { call, put }) {
            //获取学生人员列表
            const response = yield call(upgradeInfo, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'upgradeInfoReducer',
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
        *confirmUpgrade({ payload, onSuccess }, { call }) {
            const response = yield call(confirmUpgrade, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success(response.message);
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *suspendStudyInfo({ payload, onSuccess }, { call, put }) {
            const response = yield call(suspendStudyInfo, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'suspendStudyInfoReducer',
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
        *studentStatusRecord({ payload, onSuccess }, { call, put }) {
            const response = yield call(studentStatusRecord, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'studentStatusRecordReducer',
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
        *previewFile({ payload, onSuccess }, { call, put }) {
            const response = yield call(previewFile, payload);
            onSuccess && onSuccess(response);
            // if (response.ifLogin) {
            //     if (response.status) {
            //         yield put({
            //             type: 'previewFileReducer',
            //             payload: response.content
            //         });
            //         onSuccess && onSuccess(response.content);
            //     } else {
            //         message.error(response.message);
            //     }
            // } else {
            //     loginRedirect();
            // }
        },
        *downloadExcel({ payload, onSuccess }, { call, put }) {
            const response = yield call(downloadExcel, payload);
            onSuccess && onSuccess(response);
        },
        *checkStudentInfo({ payload, onSuccess }, { call, put }) {
            const response = yield call(checkStudentInfo, payload);
            console.log(response);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'checkStudentInfoReducer',
                        payload: response.content,
                    });
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
            onSuccess && onSuccess(response);
        },

        *upDateStudentInfo({ payload, onSuccess }, { call, put }) {
            const response = yield call(upDateStudentInfo, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'upDateStudentInfoReducer',
                        payload: response.content,
                    });
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
            onSuccess && onSuccess(response);
        },
        *confirmStudentInfo({ payload, onSuccess }, { call, put }) {
            const response = yield call(confirmStudentInfo, payload);
            console.log(response);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'confirmStudentInfoReducer',
                        payload: response.content,
                    });
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
            onSuccess && onSuccess(response);
        },
        *importUserList({ payload, onSuccess }, { call, put }) {
            //批量修改学生档案
            const response = yield call(importUserList, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
            } else {
                message.success(response.message);
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'studentImportReducer',
                payload: response.content,
            });
        },
        *streetList({ payload, onSuccess }, { call, put }) {
            const response = yield call(streetList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'checkStreetList',
                        payload: response.content,
                    });
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
            onSuccess && onSuccess(response);
        },
        *streetBornList({ payload, onSuccess }, { call, put }) {
            const response = yield call(streetList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'checkStreetBornList',
                        payload: response.content,
                    });
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
            onSuccess && onSuccess(response);
        },
        *streetAddressList({ payload, onSuccess }, { call, put }) {
            const response = yield call(streetList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'checkStreetAddressList',
                        payload: response.content,
                    });
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
            onSuccess && onSuccess(response);
        },
        *streetContactList({ payload, onSuccess }, { call, put }) {
            const response = yield call(streetList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'checkStreetContactList',
                        payload: response.content,
                    });
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
            onSuccess && onSuccess(response);
        },
        *endStudentTutor({ payload, onSuccess }, { call, put }) {
            const response = yield call(endStudentTutor, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'endStudentTutorReducer',
                        payload: response.content,
                    });
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
            onSuccess && onSuccess(response);
        },
        *searchDormitoryByWord({ payload, onSuccess }, { call, put }) {
            const response = yield call(searchDormitoryByWord, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'dormitoryListReducer',
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
        *getSchoolBusList({ payload, onSuccess }, { call, put }) {
            const response = yield call(getSchoolBusList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'schoolBusListReducer',
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
        *getTutorList({ payload, onSuccess }, { call, put }) {
            const response = yield call(getTutorList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'tutorListReducer',
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
        *exportNeedUpdateStudent({ payload, onSuccess }, { call, put }) {
            const response = yield call(exportNeedUpdateStudent, payload);
            if (response.ifLogin) {
                if (response.status) {
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *createStudent({ payload, onSuccess }, { call, put }) {
            const response = yield call(createStudent, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('创建成功');
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *listGradeGroup({ payload, onSuccess }, { call, put }) {
            const response = yield call(listGradeGroup, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'gradeGroupListReducer',
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
        *downloadList({ payload, onSuccess }, { call, put }) {
            const response = yield call(downloadList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'downloadListReducer',
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
        *batchExport({ payload, onSuccess }, { call, put }) {
            yield call(batchExport, payload);
        },
    },
    reducers: {
        ediGrouptName(state, action) {
            let newUpgradeConfigurationList = JSON.parse(
                JSON.stringify(state.upgradeConfigurationList)
            );
            let gradeId = action.payload && action.payload.gradeId;
            let newTargetGroupName = action.payload && action.payload.newTargetGroupName;
            let groupId = action.payload && action.payload.groupId;
            let newTargetGroupEnName = action.payload && action.payload.newTargetGroupEnName;
            let isEditCName = action.payload && action.payload.isEditCName;
            let isEditEName = action.payload && action.payload.isEditEName;

            newUpgradeConfigurationList.map((item, index) => {
                if (item.gradeId == gradeId) {
                    item.groupChangeModelList.map((el, order) => {
                        if (el.groupId == groupId) {
                            console.log(isEditCName, isEditEName, '>>>>>>>>>>>>>>');
                            // el.targetGroupName = newTargetGroupName ?  isEditCName ? newTargetGroupName : '': el.targetGroupName ;
                            el.targetGroupName = isEditCName
                                ? newTargetGroupName == ''
                                    ? ''
                                    : newTargetGroupName
                                : el.targetGroupName;
                            el.targetGroupEnName = isEditEName
                                ? newTargetGroupEnName == ''
                                    ? ''
                                    : newTargetGroupEnName
                                : el.targetGroupEnName;
                            // el.targetGroupEnName = newTargetGroupEnName ? isEditEName ? newTargetGroupEnName  : '' : el.targetGroupEnName;
                        }
                    });
                }
            });
            return {
                ...state,
                upgradeConfigurationList: newUpgradeConfigurationList,
            };
        },
        listSchoolYeariInfo(state, action) {
            return {
                ...state,
                listSchoolYearSelectInfo: action.payload,
            };
        },
        listSchooliInfo(state, action) {
            return {
                ...state,
                listSchooliSelectInfo: action.payload,
            };
        },
        getUpgradeConfiguration(state, action) {
            return {
                ...state,
                upgradeConfigurationList: action.payload,
            };
        },
        getIsNewYearInit(state, action) {
            return {
                ...state,
                isNewYearInit: action.payload,
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
                orgInfoById: action.payload,
            };
        },
        updateStudentList(state, action) {
            if (!action.payload.orgUserList) {
                action.payload.orgUserList = [];
            }
            // 处理key值
            action.payload.orgUserList.map((el) => {
                el.key = el.userId;
            });
            return {
                ...state,
                studentTableList: action.payload,
            };
        },
        fetchGradeList(state, action) {
            return {
                ...state,
                addStudentGradeList: action.payload,
            };
        },
        fetchStudentList(state, action) {
            return {
                ...state,
                addStudentStudentList: action.payload,
            };
        },
        fetchNotAdminStudent(state, action) {
            return {
                ...state,
                notAdminStudentList: action.payload,
            };
        },
        updateApplyGrade(state, action) {
            return {
                ...state,
                fetchApplyGradeData: action.payload,
            };
        },
        updateOrgRoleStudent(state, action) {
            return {
                ...state,
                setOrgRoleStudentList: action.payload,
            };
        },
        updateNonAdministrationClass(state, action) {
            return {
                ...state,
                updateNonAdministrationClass: action.payload,
            };
        },
        updateStudentDetails(state, action) {
            return {
                ...state,
                studentDetailInfo: action.payload,
            };
        },
        updateProvince(state, action) {
            return {
                ...state,
                provinceInfoData: action.payload,
            };
        },
        updateNationList(state, action) {
            return {
                ...state,
                nationInfoData: action.payload,
            };
        },
        updateCountryList(state, action) {
            return {
                ...state,
                countryInfoData: action.payload,
            };
        },
        updateAllGradeList(state, action) {
            return {
                ...state,
                allGradeInfoData: action.payload,
            };
        },
        updateEndClassNumber(state, action) {
            return {
                ...state,
                endClassCount: action.payload,
            };
        },
        clearData(state, action) {
            return {
                ...state,
                orgInfoById: {}, //组织信息详情
                studentTableList: {}, //学生table列表
            };
        },
        recoveryStudentListReducer(state, action) {
            return {
                ...state,
                recoveryStudentList: action.payload,
            };
        },
        // getSubmitGiveUpSchool(state, action) {
        //     return {
        //         ...state,
        //         submitGiveUpSchool: action.payload,
        //     };
        // },
        recordListReducer(state, action) {
            return {
                ...state,
                recordList: action.payload,
            };
        },
        subupdateStudentInfoReducer(state, action) {
            return {
                ...state,
                subupdateStudentInfo: action.payload,
            };
        },
        parentUpdateStudentInfoReducer(state, action) {
            return {
                ...state,
                parentUpdateStudentInfo: action.payload,
            };
        },
        checkUpgradeReducer(state, action) {
            return {
                ...state,
                checkUpgrade: action.payload,
            };
        },
        upgradeInfoReducer(state, action) {
            return {
                ...state,
                upgradeInfo: action.payload,
            };
        },
        suspendStudyInfoReducer(state, action) {
            return {
                ...state,
                suspendStudyInfo: action.payload,
            };
        },
        studentStatusRecordReducer(state, action) {
            return {
                ...state,
                studentStatusRecord: action.payload,
            };
        },
        previewFileReducer(state, action) {
            return {
                ...state,
                previewFile: action.payload,
            };
        },
        downloadExcelReducer(state, action) {
            return {
                ...state,
                downloadExcel: action.payload,
            };
        },
        checkStudentInfoReducer(state, action) {
            return {
                ...state,
                checkStudentInfo: action.payload,
            };
        },
        parentChildListReducer(state, action) {
            return {
                ...state,
                parentChildList: action.payload,
            };
        },
        upDateStudentInfoReducer(state, action) {
            console.log(state, action);
            return {
                ...state,
                upDateStudentInfo: action.payload,
            };
        },
        confirmStudentInfoReducer(state, action) {
            console.log(state, action);
            return {
                ...state,
                confirmStudentInfo: action.payload,
            };
        },
        // checkProvinceList(state, action) {
        //     return {
        //         ...state,
        //         provinceList: action.payload,
        //     };
        // },
        checkStreetList(state, action) {
            return {
                ...state,
                streetList: action.payload,
            };
        },
        checkStreetBornList(state, action) {
            return {
                ...state,
                streetBornList: action.payload,
            };
        },
        checkStreetAddressList(state, action) {
            return {
                ...state,
                streetAddressList: action.payload,
            };
        },
        checkStreetContactList(state, action) {
            return {
                ...state,
                streetContactList: action.payload,
            };
        },
        studentImportReducer(state, action) {
            return {
                ...state,
                studentImportMessage: action.payload,
            };
        },
        endStudentTutorReducer(state, action) {
            return {
                ...state,
                endStudentTutor: action.payload,
            };
        },
        dormitoryListReducer(state, action) {
            return {
                ...state,
                dormitoryList: action.payload,
            };
        },
        schoolBusListReducer(state, action) {
            return {
                ...state,
                schoolBusList: action.payload,
            };
        },
        tutorListReducer(state, action) {
            return {
                ...state,
                tutorList: action.payload,
            };
        },
        gradeGroupListReducer(state, action) {
            return {
                ...state,
                gradeGroupList: action.payload,
            };
        },
        downloadListReducer(state, action) {
            return {
                ...state,
                downloadStuList: action.payload,
            };
        },
        importMessageReducer(state, action) {
            return {
                ...state,
                importMessageList: action.payload,
            };
        },
    },
};
