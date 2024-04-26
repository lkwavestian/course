import { loginRedirect } from '../utils/utils';
import { message } from 'antd';

import {
    saveApplication,
    moduleList,
    editDataList,
    dataList,
    updateApplication,
    generateAccount,
    getGenerateAccountList,
    configCenterList,
    deleteSchoolById,
    getTemplateMenuList, //获取动态菜单
    getAttendanceList,
} from '../services/application';

export default {
    namespace: 'application',
    state: {
        saveApplication: [],
        moduleList: [],
        editDataList: [],
        dataList: [],
        updateApplication: [],
        generateAccount: [],
        getGenerateAccountList: [],
        configCenterList: [],
        deleteSchoolById: [],
        templateMenuList: [], //动态菜单
        attendanceList: [],
    },
    effects: {
        *getTemplateMenuList({ payload }, { call, put }) {
            //获取动态菜单数据
            const response = yield call(getTemplateMenuList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'saveTemplateMenuList',
                        payload: response.content || [],
                    });
                } else {
                    yield put({
                        type: 'saveTemplateMenuList',
                        payload: [],
                    });
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *saveApplication({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(saveApplication, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'getSaveApplication',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *moduleList({ payload }, { call, put }) {
            const response = yield call(moduleList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'getModuleList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getAttendanceList({ payload }, { call, put }) {
            const response = yield call(getAttendanceList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'attendanceListReducer',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *editDataList({ payload, onSuccess }, { call, put }) {
            //获取club列表数据
            const response = yield call(editDataList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'getEditDataList',
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
        *dataList({ payload, onSuccess }, { call, put }) {
            //获取club列表数据
            const response = yield call(dataList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'getDataList',
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
        *getGenerateAccountList({ payload, onSuccess }, { call, put }) {
            //获取club列表数据
            const response = yield call(getGenerateAccountList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'getAccountList',
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
        *updateApplication({ payload, onSuccess }, { call, put }) {
            //获取club列表数据
            const response = yield call(updateApplication, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'getUpdateApplication',
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
        *generateAccount({ payload, onSuccess }, { call, put }) {
            //获取club列表数据
            const response = yield call(generateAccount, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'getGenerateAccount',
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
        *configCenterList({ payload }, { call, put }) {
            const response = yield call(configCenterList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'getConfigCenterList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *deleteSchoolById({ payload, onSuccess }, { call, put }) {
            //获取club列表数据
            const response = yield call(deleteSchoolById, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'getDeleteSchoolById',
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
        getSaveApplication(state, action) {
            return {
                ...state,
                saveApplication: action.payload,
            };
        },
        getModuleList(state, action) {
            return {
                ...state,
                moduleList: action.payload,
            };
        },
        attendanceListReducer(state, action) {
            return {
                ...state,
                attendanceList: action.payload,
            };
        },
        getEditDataList(state, action) {
            return {
                ...state,
                editDataList: action.payload,
            };
        },
        getDataList(state, action) {
            return {
                ...state,
                dataList: action.payload,
            };
        },
        getAccountList(state, action) {
            return {
                ...state,
                getGenerateAccountList: action.payload,
            };
        },
        getUpdateApplication(state, action) {
            return {
                ...state,
                updateApplication: action.payload,
            };
        },
        getGenerateAccount(state, action) {
            return {
                ...state,
                generateAccount: action.payload,
            };
        },
        getConfigCenterList(state, action) {
            return {
                ...state,
                configCenterList: action.payload,
            };
        },
        getDeleteSchoolById(state, action) {
            return {
                ...state,
                deleteSchoolById: action.payload,
            };
        },
        saveTemplateMenuList(state, action) {
            return {
                ...state,
                templateMenuList: action.payload,
            };
        },
    },
};
