import { loginRedirect } from '../utils/utils';
import { message } from 'antd';
import {
    chooseCourseDetails,
    chooseCoursePlanBatchList,
    newOpenChooseCourse,
    goodCloseChooseCourse,
    addedOrEditChooseCoursePlanBatch,
    batchChooseCourseDelete,
    coursePlanning,
    excelImport,
    getCourseSchedule,
    getSchedule,
    addCoursePlan,
    excelLotImport,
} from '../services/choose';

export default {
    namespace: 'choose',
    state: {
        chooseCourseDetails: {}, // 选课详情
        chooseCoursePlanBatchList: [], // 选课批次列表
        newOpenChooseCourse: [],
        goodCloseChooseCourse: [],
        excelImportInfo: {}, // 导入失败的错误信息
        excelLotImportInfo: {}, // 批量导入失败的错误信息
        getCourseSchedule: [],
        getSchedule: [],
        addCoursePlan: [],
    },
    effects: {
        *excelImport({ payload, onSuccess }, { call, put }) {
            const response = yield call(excelImport, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                // return;
            } else {
                message.success(response.message);
            }
            !response.ifLogin && (yield loginRedirect());

            yield put({
                type: 'excelImportContent',
                payload: response.content,
            });

            /* if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'excelImportContent',
                        payload: response.content,
                    });
                    onSuccess && onSuccess(response.content);
                    // message.success(response.message)
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            } */
        },
        *excelLotImport({ payload, onSuccess }, { call, put }) {
            const response = yield call(excelLotImport, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                // return;
            } else {
                message.success(response.message);
            }
            !response.ifLogin && (yield loginRedirect());

            yield put({
                type: 'excelLotImportContent',
                payload: response.content,
            });

            /* if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'excelImportContent',
                        payload: response.content,
                    });
                    onSuccess && onSuccess(response.content);
                    // message.success(response.message)
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            } */
        },
        *chooseCourseDetails({ payload, onSuccess }, { call, put }) {
            const response = yield call(chooseCourseDetails, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'chooseCourseDetailsReducer',
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
        *chooseCoursePlanBatchList({ payload, onSuccess }, { call, put }) {
            const response = yield call(chooseCoursePlanBatchList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'chooseCoursePlanBatchListReducer',
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
        *newOpenChooseCourse({ payload, onSuccess }, { call, put }) {
            const response = yield call(newOpenChooseCourse, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'newOpenChooseCourseReducer',
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
        *goodCloseChooseCourse({ payload, onSuccess }, { call, put }) {
            const response = yield call(goodCloseChooseCourse, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'goodCloseChooseCourseReducer',
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
        *getCourseSchedule({ payload, onSuccess }, { call, put }) {
            const response = yield call(getCourseSchedule, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'CourseSchedule',
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
        *getSchedule({ payload, onSuccess }, { call, put }) {
            const response = yield call(getSchedule, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'schedule',
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
        *addCoursePlan({ payload, onSuccess }, { call, put }) {
            const response = yield call(addCoursePlan, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'newCourse',
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
        *addedOrEditChooseCoursePlanBatch({ payload, onSuccess }, { call, put }) {
            const response = yield call(addedOrEditChooseCoursePlanBatch, payload);
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
        *batchChooseCourseDelete({ payload, onSuccess }, { call, put }) {
            const response = yield call(batchChooseCourseDelete, payload);
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
        *coursePlanning({ payload, onSuccess }, { call, put }) {
            const response = yield call(coursePlanning, payload);
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
    },
    reducers: {
        excelImportContent(state, action) {
            return {
                ...state,
                excelImportInfo: action.payload,
            };
        },
        excelLotImportContent(state, action) {
            return {
                ...state,
                excelLotImportInfo: action.payload,
            };
        },
        chooseCourseDetailsReducer(state, action) {
            return {
                ...state,
                chooseCourseDetails: action.payload,
            };
        },
        chooseCoursePlanBatchListReducer(state, action) {
            return {
                ...state,
                chooseCoursePlanBatchList: action.payload,
            };
        },
        newOpenChooseCourseReducer(state, action) {
            return {
                ...state,
                newOpenChooseCourse: action.payload,
            };
        },
        goodCloseChooseCourseReducer(state, action) {
            return {
                ...state,
                goodCloseChooseCourse: action.payload,
            };
        },
        CourseSchedule(state, action) {
            return {
                ...state,
                getCourseSchedule: action.payload,
            };
        },
        schedule(state, action) {
            return {
                ...state,
                getSchedule: action.payload,
            };
        },
        newCourse(state, action) {
            return {
                ...state,
                addCoursePlan: action.payload,
            };
        },
    },
};
