import { loginRedirect } from '../utils/utils';
import { message } from 'antd';
import {
    getClubDataSource,
    fetchClubCourse,
    createClubCourse,
    generateSeat,
    activeImportCheck,
    activeImport,
    activeStudentSeatNumberDownloadCheck,
    batchPublishActive,
    batchDeleteFreeScheduleResult,
} from '../services/club';

export default {
    namespace: 'club',
    state: {
        clubDataSource: [],
        clubCourseList: [],
        importFeeMessage: undefined,
        activeImportMessage: undefined,
        checkResult: undefined,
    },
    effects: {
        *getClubDataSource({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(getClubDataSource, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'updateClubDataSource',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *fetchClubCourse({ payload }, { call, put }) {
            //新建club中的获取课程列表
            const response = yield call(fetchClubCourse, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'getClubCourse',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *createClubCourse({ payload, onSuccess }, { call, put }) {
            //批量添加club
            const response = yield call(createClubCourse, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('创建成功~');
                    onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *generateSeat({ payload, onSuccess }, { call, put }) {
            //批量添加club
            const response = yield call(generateSeat, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('座位号已生成，可下载查看');
                    onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *activeStudentSeatNumberDownloadCheck({ payload, onSuccess }, { call, put }) {
            //批量添加club
            const response = yield call(activeStudentSeatNumberDownloadCheck, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'checkReducer',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        //批量删除
        *batchDeleteFreeScheduleResult({ payload, onSuccess }, { call, put }) {
            //批量添加club
            const response = yield call(batchDeleteFreeScheduleResult, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('批量删除活动成功！');
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        //批量公布
        *batchPublishActive({ payload, onSuccess }, { call, put }) {
            //批量添加club
            const response = yield call(batchPublishActive, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success('批量公布活动成功！');
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *activeImportCheck({ payload }, { call, put }) {
            const response = yield call(activeImportCheck, payload);
            if (!response) return;
            if (!response.status) {
                // message.error(response.message);
                // return;
            } else {
                // message.success(response.message);
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'importReducer',
                payload: response.content,
            });
        },
        *activeImport({ payload }, { call, put }) {
            const response = yield call(activeImport, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
                // return;
            } else {
                message.success(response.message);
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'activeImportReducer',
                payload: response.content,
            });
        },
    },
    reducers: {
        updateClubDataSource(state, action) {
            return {
                ...state,
                clubDataSource: action.payload,
            };
        },
        getClubCourse(state, action) {
            return {
                ...state,
                clubCourseList: action.payload,
            };
        },
        checkReducer(state, action) {
            return {
                ...state,
                checkResult: action.payload,
            };
        },

        importReducer(state, action) {
            return {
                ...state,
                importFeeMessage: action.payload,
            };
        },
        activeImportReducer(state, action) {
            return {
                ...state,
                activeImportMessage: action.payload,
            };
        },
    },
};
