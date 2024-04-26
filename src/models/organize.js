import { message } from 'antd';
import { loginRedirect } from '../utils/utils';
import {
    employeeJoinIn, //同步钉钉人员到教务中心
    teacheSyncOrg, //同步组织和人的关系
    asyncEmployeeQuit, //同步钉钉离职员工
    fetchRecord, //查看钉钉同步日志
    getOrganizeList, //获取组织结构的树
    cogradientParent, //同步学生家长
    getSchoolYearList, // 学年学期列表
    getlistSchool, //学校下拉
    createSemester, // 新建学期
    editSchoolYear, //编辑学年
    startSemester, // 开启学期
    startSchoolYear, // 开启学年
    createSchoolYear, // 新建学年
    importAddress, //导入场地
    importStudentScore, //导入学生成绩
    getAddressList, //获得场地信息
    addAddress, //新增场地
    updateAddress, //编辑场地
    setCurrentYearOrSemester, //设为当前学期/学年
    deleteYearOrSemester, ////删除学期/学年
    batchUpdateField,
    syncDingRoomSync,
    saveSemesterWeekDetailSync,
    semesterWeekDetailListSync,
} from '../services/organize';
import { importTeacher } from '../services/course';

export default {
    namespace: 'organize',
    state: {
        recordTable: {}, //查看钉钉同步日志
        treeDataList: {}, //组织树包含返回的状态
        schoolYearListInfo: [],
        listSchoolInfo: [],
        errotType: [],
        importAddress: [],
        importTeacher: [],
        importStudentScore: [],
        addressListModal: {},
        batchUpdateMessage: undefined,
        semesterWeekDetailList: [],
    },
    effects: {
        //获得场地列表
        *getSemesterWeekDetailList({ payload, onSuccess }, { call, put }) {
            const response = yield call(semesterWeekDetailListSync, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'saveSemesterWeekDetailList',
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
        *saveSemesterWeekDetail({ payload, onSuccess }, { call, put }) {
            const response = yield call(saveSemesterWeekDetailSync, payload);
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
        *syncDingRoom({ payload, onSuccess }, { call, put }) {
            const response = yield call(syncDingRoomSync, payload);
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
        *addAddress({ payload, onSuccess }, { call, put }) {
            const response = yield call(addAddress, payload);
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

        *updateAddress({ payload, onSuccess }, { call, put }) {
            const response = yield call(updateAddress, payload);
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

        //获得场地列表
        *getAddressList({ payload, onSuccess }, { call, put }) {
            const response = yield call(getAddressList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setAddressList',
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

        //导入学生成绩
        *importStudentScore({ payload, onSuccess }, { call, put }) {
            const response = yield call(importStudentScore, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setImportStudentScore',
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

        //导入学生
        *importTeacher({ payload }, { call, put }) {
            const response = yield call(importTeacher, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'setImportTeacher',
                payload: response.content,
            });
        },

        *importAddress({ payload, onSuccess }, { call, put }) {
            const response = yield call(importAddress, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setImportAddress',
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

        *createSchoolYear({ payload, onSuccess }, { call, put }) {
            const response = yield call(createSchoolYear, payload);
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

        *startSchoolYear({ payload, onSuccess }, { call, put }) {
            const response = yield call(startSchoolYear, payload);
            if (response.ifLogin) {
                if (response.status) {
                    onSuccess && onSuccess();
                } else {
                    yield put({
                        type: 'defaultStart',
                        payload: response.content,
                    });
                    // message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *startSemester({ payload, onSuccess }, { call, put }) {
            const response = yield call(startSemester, payload);
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
        *editSchoolYear({ payload, onSuccess }, { call, put }) {
            const response = yield call(editSchoolYear, payload);
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
        *createSemester({ payload, onSuccess }, { call, put }) {
            const response = yield call(createSemester, payload);
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
        *getlistSchool({ payload, onSuccess }, { call, put }) {
            const response = yield call(getlistSchool, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'pullListSchool',
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
        *getSchoolYearList({ payload, onSuccess }, { call, put }) {
            const response = yield call(getSchoolYearList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'schoolYearInfo',
                        payload: response.content,
                    });
                    onSuccess && onSuccess();
                    // message.success('获取学年列表成功！');
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *employeeJoinIn({ payload, onSuccess }, { call, put }) {
            //同步钉钉人员到教务中心
            const response = yield call(employeeJoinIn, payload);
            if (response.ifLogin) {
                if (response.status) {
                    onSuccess();
                    message.success('同步成功~');
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *teacheSyncOrg({ payload, onSuccess }, { call, put }) {
            //同步组织和人的关系
            const response = yield call(teacheSyncOrg, payload);
            if (response.ifLogin) {
                if (response.status) {
                    onSuccess();
                    message.success('同步成功~');
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *fetchRecord({ payload }, { call, put }) {
            const response = yield call(fetchRecord, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateRecord',
                        payload: response,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getOrganizeList({ payload, onSuccess }, { call, put }) {
            //获取机构管理的组织树
            const response = yield call(getOrganizeList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'fetchTreeData',
                        payload: response,
                    });
                    onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *cogradientParent({ payload }, { call }) {
            //同步学生家长
            const response = yield call(cogradientParent, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('同步成功~');
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *asyncEmployeeQuit({ payload }, { call }) {
            //同步钉钉离职员工
            const response = yield call(asyncEmployeeQuit, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('同步成功~');
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *setCurrentYearOrSemester({ payload, onSuccess }, { call }) {
            const response = yield call(setCurrentYearOrSemester, payload);
            console.log(response, 'response');
            if (response.ifLogin) {
                if (response.status) {
                    message.success('成功~');
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *deleteYearOrSemester({ payload, onSuccess }, { call }) {
            const response = yield call(deleteYearOrSemester, payload);
            console.log(response, 'response');
            if (response.ifLogin) {
                if (response.status) {
                    message.success('删除成功~');
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *batchUpdateField({ payload }, { call, put }) {
            const response = yield call(batchUpdateField, payload);
            // console.log('come');
            if (!response) return;
            /* if (!response.status) {
                message.error(response.message);
                return;
            } */
            if (!response.status) {
                message.error(response.message);
                // return;
            } else {
                message.success(response.message);
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'batchUpdateReducer',
                payload: response.content,
            });
        },
    },
    reducers: {
        saveSemesterWeekDetailList(state, action) {
            return {
                ...state,
                semesterWeekDetailList: action.payload,
            };
        },
        updateSchoolYear(state, action) {
            // debugger;
            let newSchoolYear = JSON.parse(JSON.stringify(state.schoolYearListInfo));
            let schoolYearId = action.payload && action.payload.schoolYearId;
            let semesterId = action.payload && action.payload.semesterId;
            let semesterCname = action.payload && action.payload.semesterCname;
            let semesterEname = action.payload && action.payload.semesterEname;
            let semesterStartTime = action.payload && action.payload.semesterStartTime;
            let semesterEndTime = action.payload && action.payload.semesterEndTime;
            newSchoolYear.map((item, index) => {
                if (item.id == schoolYearId) {
                    item.semesterOutputModels.map((el, order) => {
                        if (el.id == semesterId) {
                            el.name = semesterCname || el.name;
                            el.ename = semesterEname || el.ename;
                            el.startTime = Date.parse(semesterStartTime) || el.startTime;
                            el.endTime = Date.parse(semesterEndTime) || el.endTime;
                        }
                    });
                }
            });
            return {
                ...state,
                schoolYearListInfo: newSchoolYear,
            };
        },
        defaultStart(state, action) {
            return {
                ...state,
                errotType: action.payload,
            };
        },
        pullListSchool(state, action) {
            return {
                ...state,
                listSchoolInfo: action.payload,
            };
        },
        schoolYearInfo(state, action) {
            return {
                ...state,
                schoolYearListInfo: action.payload,
            };
        },
        setImportTeacher(state, { payload }) {
            return {
                ...state,
                importTeacher: payload,
            };
        },
        updateRecord(state, action) {
            return {
                ...state,
                recordTable: action.payload,
            };
        },
        fetchTreeData(state, action) {
            return {
                ...state,
                treeDataList: action.payload,
            };
        },
        setImportAddress(state, action) {
            return {
                ...state,
                importAddress: action.payload,
            };
        },
        setImportStudentScore(state, action) {
            return {
                ...state,
                importStudentScore: action.payload,
            };
        },
        setAddressList(state, action) {
            return {
                ...state,
                addressListModal: action.payload,
            };
        },
        batchUpdateReducer(state, action) {
            return {
                ...state,
                batchUpdateMessage: action.payload,
            };
        },
    },
};
