import { loginRedirect } from '../utils/utils';
import { message } from 'antd';
import {
    getCourseResultDetails,
    getClassStudentList,
    batchUpdateCourseSignUp,
    getCourseClassDetails,
    getChooseCourseInfo,
    getSelectionMessage,
    getSelectionList,
    deleteCourseChoose,
    groupUpdate,
    getGroupSelectDetail,
    studentListOfClass,
    addStudentClass,
    classStudentsBatchRemoval,
    studentsClassTransfer,
    studentCourseResultsManagement,
    uncheckAndCheck,
    courseRepeat,
    addNewClass,
    toggleSelCourse,
    sendPayTuitionToPersonal,
    studentListNew,
    addStudentClassNew,
    chooseExportCourse,
    feeData,
    getCatagory,
    getAllCourse,
    checkCoursePlanAddPermission,
    checkClassPermission,
    listCourse,
    getLotsDetail,
    paymentNotice,
    getCancelFee,
    cancelSignUp,
    batchNewOrOldStudent,
    selectGroupingByChoosePlan,
} from '../services/courseBaseDetail';

export default {
    namespace: 'courseBaseDetail',
    state: {
        classList: {},
        studentDetailContent: {},
        courseSignUp: '',
        groupDetailContent: '',
        selectionMessage: '',
        selectionList: '',
        basicInfo: '',
        deleteCourseMsg: '',
        groupSelectDetail: {},
        groupUpdateMsg: '',
        studentListOfClass: {},
        feeData: [],
        getCatagory: [],
        getAllCourse: [],
        checkCoursePlanAddPermission: undefined,
        checkClassPermission: undefined,
        listCourse: {},
        getLotsDetail: [],
        paymentNotice: undefined,
        cancelFee: {},
        groupingList: [],
        addStudentGradeList: [],
        addStudentClassList: [],
        addStudentStudentList: [],
        totalAddStudentStudentList: [],
    },
    effects: {
        //批量设置新老生
        *batchNewOrOldStudent({ payload, onSuccess }, { call, put }) {
            //获取club列表数据
            const response = yield call(batchNewOrOldStudent, payload);
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

        //取消报名
        *cancelSignUp({ payload, onSuccess }, { call, put }) {
            //获取club列表数据
            const response = yield call(cancelSignUp, payload);
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

        //取消报名费用
        *getCancelFee({ payload, onSuccess }, { call, put }) {
            //获取club列表数据
            const response = yield call(getCancelFee, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setCancelFee',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *chooseExportCourse({ payload, onSuccess }, { call, put }) {
            //获取club列表数据
            const response = yield call(chooseExportCourse, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success(response.message);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *getGroupSelectDetail({ payload, onSuccess }, { call, put }) {
            //获取club列表数据
            const response = yield call(getGroupSelectDetail, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'groupDetail',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *groupUpdate({ payload, onSuccess }, { call, put }) {
            //获取club列表数据
            const response = yield call(groupUpdate, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateGroup',
                        payload: response,
                    });
                    message.success(response.message);
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *deleteCourseChoose({ payload, onSuccess }, { call, put }) {
            //获取club列表数据
            const response = yield call(deleteCourseChoose, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'deleteCourse',
                        payload: response,
                    });
                    message.success(response.message);
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        // 课程列表-选课计划信息
        *getSelectionMessage({ payload, onSuccess }, { call, put }) {
            const response = yield call(getSelectionMessage, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'selectMsg',
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

        // 选课计划-课程列表
        *getSelectionList({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(getSelectionList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'selectList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        // 选课分组
        *selectGroupingByChoosePlan({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(selectGroupingByChoosePlan, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'groupList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        // 班级列表
        *getCourseResultDetails({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(getCourseResultDetails, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'group',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *batchUpdateCourseSignUp({ payload, onSuccess }, { call, put }) {
            const response = yield call(batchUpdateCourseSignUp, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateCourseSignUp',
                        payload: response.content,
                    });
                    message.success(response.message);
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getClassStudentList({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(getClassStudentList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'list',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getCourseClassDetails({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(getCourseClassDetails, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'groupDetailLeft',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *getChooseCourseInfo({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(getChooseCourseInfo, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'basic',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *checkCoursePlanAddPermission({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(checkCoursePlanAddPermission, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'permission',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *checkClassPermission({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(checkClassPermission, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'classPersion',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *listCourse({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(listCourse, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'getListCourse',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        // 添加学生到班级--学生展示列表
        *studentListOfClass({ payload, onSuccess }, { call, put }) {
            const response = yield call(studentListOfClass, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'studentListOfClassReducer',
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
        *studentListNew({ payload, onSuccess }, { call, put }) {
            const response = yield call(studentListNew, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'studentListOfClassReducer',
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
        *getAddStudentRelatedList({ payload, onSuccess }, { call, put }) {
            let { type, ...payloadSync } = payload;
            let getStudentService = studentListNew;
            if (payloadSync.planId) {
                getStudentService = studentListOfClass;
            }
            const response = yield call(getStudentService, payloadSync);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'setRelatedList',
                        payload: { type, ...response.content },
                    });
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *addStudentClass({ payload, onSuccess }, { call, put }) {
            const response = yield call(addStudentClass, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success(response.message);
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *addStudentClassNew({ payload, onSuccess }, { call, put }) {
            const response = yield call(addStudentClassNew, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success(response.message);
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *classStudentsBatchRemoval({ payload, onSuccess }, { call, put }) {
            const response = yield call(classStudentsBatchRemoval, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success(response.message);
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *studentsClassTransfer({ payload, onSuccess }, { call, put }) {
            const response = yield call(studentsClassTransfer, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success(response.message);
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *studentCourseResultsManagement({ payload, onSuccess }, { call, put }) {
            const response = yield call(studentCourseResultsManagement, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success(response.message);
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *uncheckAndCheck({ payload, onSuccess }, { call, put }) {
            const response = yield call(uncheckAndCheck, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success(response.message);
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *setCourseRepeat({ payload, onSuccess }, { call, put }) {
            const response = yield call(courseRepeat, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success(response.message);
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *addNewClass({ payload, onSuccess }, { call }) {
            const response = yield call(addNewClass, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success(response.message);
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *toggleSelCourse({ payload, onSuccess }, { call }) {
            const response = yield call(toggleSelCourse, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success(response.message);
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *sendPayTuitionToPersonal({ payload, onSuccess }, { call }) {
            const response = yield call(sendPayTuitionToPersonal, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success(response.message);
                    onSuccess && onSuccess(response.content);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *feeData({ payload, onSuccess }, { call, put }) {
            const response = yield call(feeData, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'feeReducer',
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
        *getCatagory({ payload, onSuccess }, { call, put }) {
            const response = yield call(getCatagory, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'allCatagory',
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
        *getAllCourse({ payload, onSuccess }, { call, put }) {
            const response = yield call(getAllCourse, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'allCourse',
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
        *getLotsDetail({ payload, onSuccess }, { call, put }) {
            const response = yield call(getLotsDetail, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'getLotsDetailReducer',
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
        *paymentNotice({ payload, onSuccess }, { call, put }) {
            const response = yield call(paymentNotice, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'paymentNoticeReducer',
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
    },

    reducers: {
        setRelatedList(state, action) {
            let { type, ...payload } = action.payload;
            if (type === 'total') {
                return {
                    ...state,
                    addStudentGradeList: payload.gradeList,
                    addStudentClassList: payload.classList,
                    addStudentStudentList: payload.studentList,
                    totalAddStudentStudentList: payload.studentList,
                };
            }
            if (type === 'grade') {
                return {
                    ...state,
                    addStudentClassList: payload.classList,
                    addStudentStudentList: payload.studentList,
                };
            }
            if (type === 'class') {
                return {
                    ...state,
                    addStudentStudentList: payload.studentList,
                };
            }
            return {
                ...state,
                cancelFee: action.payload,
            };
        },
        setCancelFee(state, action) {
            return {
                ...state,
                cancelFee: action.payload,
            };
        },

        basic(state, action) {
            return {
                ...state,
                basicInfo: action.payload,
            };
        },
        getListCourse(state, action) {
            return {
                ...state,
                listCourse: action.payload,
            };
        },
        permission(state, action) {
            return {
                ...state,
                checkCoursePlanAddPermission: action.payload,
            };
        },
        classPersion(state, action) {
            return {
                ...state,
                checkClassPermission: action.payload,
            };
        },
        group(state, action) {
            return {
                ...state,
                classList: action.payload,
            };
        },
        updateCourseSignUp(state, action) {
            return {
                ...state,
                courseSignUp: action.payload,
            };
        },
        list(state, action) {
            return {
                ...state,
                studentDetailContent: action.payload,
            };
        },
        groupDetailLeft(state, action) {
            return {
                ...state,
                groupDetailContent: action.payload,
            };
        },

        selectMsg(state, action) {
            return {
                ...state,
                selectionMessage: action.payload,
            };
        },
        selectList(state, action) {
            return {
                ...state,
                selectionList: action.payload,
            };
        },
        groupList(state, action) {
            return {
                ...state,
                groupingList: action.payload,
            };
        },
        deleteCourse(state, action) {
            return {
                ...state,
                deleteCourseMsg: action.payload,
            };
        },
        groupDetail(state, action) {
            return {
                ...state,
                groupSelectDetail: action.payload,
            };
        },
        updateGroup(state, action) {
            return {
                ...state,
                groupUpdateMsg: action.payload,
            };
        },
        studentListOfClassReducer(state, action) {
            return {
                ...state,
                studentListOfClass: action.payload,
            };
        },
        feeReducer(state, action) {
            return {
                ...state,
                feeData: action.payload,
            };
        },
        allCatagory(state, action) {
            return {
                ...state,
                getCatagory: action.payload,
            };
        },
        allCourse(state, action) {
            return {
                ...state,
                getAllCourse: action.payload,
            };
        },
        getLotsDetailReducer(state, action) {
            return {
                ...state,
                getLotsDetail: action.payload,
            };
        },
        paymentNoticeReducer(state, action) {
            return {
                ...state,
                paymentNotice: action.payload,
            };
        },
    },
};
