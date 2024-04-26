//学生列表
import { message } from 'antd';
import { loginRedirect } from '../utils/utils';
import {
    fetchStudentTableData,
    fetchGroupList,
    updateStudentTutorOrNumber,
    getTeacherList,
    importNum,
    showConfig,
} from '../services/studentTabulation';
import {locale} from '../utils/i18n'

export default {
    namespace: 'studentTabulation',
    state: {
        studentTableData: {}, //学生信息
        allStudentTableData: {}, //全部学生信息
        groupList: [], //班级列表
        teacherList: [], //教师列表
        importMsg: '',
        msgCode: 1,
        showConfigContent: {}, // 双语化配置、“我的导生”tab展示权限
    },
    effects: {
        //获取全部学生
        *fetchAllStudent({ payload, onSuccess }, { call, put }) {
            const response = yield call(fetchStudentTableData, payload);
            if (response.ifLogin) {
                if (response.status) {
                    onSuccess && onSuccess(response.content || {});
                } else {
                    yield put({
                        type: 'save',
                        payload: {
                            allStudentTableData: {},
                        },
                    });
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        //获取当前页的学生
        *fetchStudentTableData({ payload }, { call, put }) {
            const response = yield call(fetchStudentTableData, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'save',
                        payload: {
                            studentTableData: response.content || {},
                        },
                    });
                } else {
                    yield put({
                        type: 'save',
                        payload: {
                            studentTableData: {},
                        },
                    });
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        //更新学生信息
        *updateStudentTutorOrNumber({ payload }, { call, put }) {
            const response = yield call(updateStudentTutorOrNumber, payload);
            if (response.ifLogin) {
                if (response.status) {
                    message.success(trans('global.update.success', '修改成功'));
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *fetchGroupList({ payload }, { call, put }) {
            const response = yield call(fetchGroupList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'save',
                        payload: {
                            groupList: response.content || [],
                        },
                    });
                } else {
                    yield put({
                        type: 'save',
                        payload: {
                            groupList: [],
                        },
                    });
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *importNum({ payload }, { call, put }) {
            const response = yield call(importNum, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'msgReducer',
                        payload: response.content,
                    });
                    yield put({
                        type: 'msgCodeReducer',
                        payload: response.code,
                    });
                    message.success(trans('global.update.success', '修改成功'));
                } else {
                    console.log(234);
                    yield put({
                        type: 'msgReducer',
                        payload: response.content,
                    });
                    yield put({
                        type: 'msgCodeReducer',
                        payload: response.code,
                    });
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *getTeacherList({ payload }, { call, put }) {
            const response = yield call(getTeacherList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'teacherReducer',
                        payload: {
                            teacherList: response.content || [],
                        },
                    });
                } else {
                    yield put({
                        type: 'teacherReducer',
                        payload: {
                            teacherList: [],
                        },
                    });
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *showConfig({ payload }, { call, put }) {
            const response = yield call(showConfig, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'save',
                        payload: {
                          showConfigContent: response.content || [],
                        },
                    });
                }
            } else {
                loginRedirect();
            }
        },
    },
    reducers: {
        save(state, { payload: newState }) {
            return { ...state, ...newState };
        },
        teacherReducer(state, action) {
            return {
                ...state,
                teacherList: action.payload.teacherList,
            };
        },
        msgReducer(state, action) {
            return {
                ...state,
                importMsg: action.payload,
            };
        },
        msgCodeReducer(state, action) {
            return {
                ...state,
                msgCode: action.payload,
            };
        },
    },
};
