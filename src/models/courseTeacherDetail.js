import { loginRedirect } from '../utils/utils';
import { message } from 'antd';
import {
    listBatchStudentInfo, // 完整课表
    selectChooseStudentList, // 添加学生--搜索的学生列表
    addStudent, // 添加学生到批次
    studentBatchRemoval, // 批次学生批量移除
    openChooseCourse, // 开放选课
    batchTransferStudent, // 调整时间
    allGradeOfAS, // 学生列表接口--年级接口
    allGradeAndGroup, // 学生列表接口(年级-班级接口)
    getStudentsByClass,
    getEffective,
    cancelPlan,
    fetchImportClass,
    fetchCacheRefresh,
    syncToScheduleTemplate,
    sendNoticeForParents,
    previewEmail,
} from '../services/courseTeacherDetail';

export default {
    namespace: 'courseTeacherDetail',
    state: {
        listBatchStudentInfo: {},
        syncToScheduleTemplate: undefined,
        selectChooseStudentList: [],
        effectiveMsg: '',
        cancelMsg: '',
        allGradeOfAS: '',
        importClassList: [],
        cacheRefresh: '',
        previewEmail: undefined,
        classLists: [], //学生列表筛选班级下拉
    },
    effects: {
        //导入班级
        *getCacheRefresh({ payload }, { call, put }) {
            const response = yield call(fetchCacheRefresh, payload);
            if (!response) return;
            if (response.content) {
                message.error(response.content);
            } else {
                message.success('缓存刷新成功');
            }
        },

        //导入班级
        *importClass({ payload }, { call, put }) {
            const response = yield call(fetchImportClass, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                return;
            } else {
                message.success(response.message);
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'setImportClass',
                payload: response.content.checkMessage,
            });
        },

        *cancelPlan({ payload, onSuccess }, { call, put }) {
            const response = yield call(cancelPlan, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'cancel',
                        payload: response,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getEffective({ payload, onSuccess }, { call, put }) {
            const response = yield call(getEffective, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'effective',
                        payload: response,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *listBatchStudentInfo({ payload, onSuccess }, { call, put }) {
            const response = yield call(listBatchStudentInfo, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'listBatchStudentInfoReducer',
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
        *syncToScheduleTemplate({ payload, onSuccess }, { call, put }) {
            const response = yield call(syncToScheduleTemplate, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'syncToScheduleTemplateReducer',
                        payload: response,
                    });
                } else {
                    message.error(response.content);
                }
            } else {
                loginRedirect();
            }
        },

        *selectChooseStudentList({ payload, onSuccess }, { call, put }) {
            const response = yield call(selectChooseStudentList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'selectChooseStudentListReducer',
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
        *addStudent({ payload, onSuccess }, { call, put }) {
            const response = yield call(addStudent, payload);
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
        *studentBatchRemoval({ payload, onSuccess }, { call, put }) {
            const response = yield call(studentBatchRemoval, payload);
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
        *openChooseCourse({ payload, onSuccess }, { call, put }) {
            const response = yield call(openChooseCourse, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success(response.message);
                    onSuccess && onSuccess(response.status);
                } else {
                    message.error(response.message);
                    onSuccess && onSuccess(response.status);
                }
            } else {
                loginRedirect();
            }
        },
        *batchTransferStudent({ payload, onSuccess }, { call, put }) {
            const response = yield call(batchTransferStudent, payload);
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
        *sendNoticeForParents({ payload, onSuccess }, { call, put }) {
            const response = yield call(sendNoticeForParents, payload);
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
        *allGradeOfAS({ payload, onSuccess }, { call, put }) {
            const response = yield call(allGradeOfAS, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'allGradeOfASReducer',
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
        *previewEmail({ payload, onSuccess }, { call, put }) {
            const response = yield call(previewEmail, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updatePreviewContent',
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

        *allGradeAndGroup({ payload, onSuccess }, { call, put }) {
            const response = yield call(allGradeAndGroup, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'allGradeAndGroupReducer',
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

        //根据班级筛选学生
        *getStudentsByClass({ payload, onSuccess }, { call, put }) {
            const response = yield call(getStudentsByClass, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'classReducers',
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
        setImportClass(state, action) {
            return {
                ...state,
                importClassList: action.payload,
            };
        },

        listBatchStudentInfoReducer(state, action) {
            return {
                ...state,
                listBatchStudentInfo: action.payload,
            };
        },
        syncToScheduleTemplateReducer(state, action) {
            return {
                ...state,
                syncToScheduleTemplate: action.payload,
            };
        },
        selectChooseStudentListReducer(state, action) {
            return {
                ...state,
                selectChooseStudentList: action.payload,
            };
        },
        allGradeOfASReducer(state, action) {
            return {
                ...state,
                allGradeOfAS: action.payload,
            };
        },
        allGradeAndGroupReducer(state, action) {
            return {
                ...state,
                allGradeAndGroup: action.payload,
            };
        },
        classReducers(state, action) {
            return {
                ...state,
                classLists: action.payload,
            };
        },
        effective(state, action) {
            return {
                ...state,
                effectiveMsg: action.payload,
            };
        },
        cancel(state, action) {
            return {
                ...state,
                cancelMsg: action.payload,
            };
        },
        updatePreviewContent(state, action) {
            return {
                ...state,
                previewEmail: action.payload,
            };
        },
    },
};
