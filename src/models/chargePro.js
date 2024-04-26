import { loginRedirect } from '../utils/utils';
import { message } from 'antd';
import {
    delPayChargeItem, // 删除
    queryPayChargeItem, // 列表
    queryPayItemCategory, // 项目类型
    addOrUpdPayChargeItem, // 新建修改项目
    addOrUpdPayItemCategory, // 新建或修改类型
    delPayItemCategory,
    删除项目类型,
} from '../services/chargePro';

export default {
    namespace: 'chargePro',
    state: {
        chargeList: {},
        chargeDelMsg: '',
        payItemCategory: [],
        newProMsg: '',
        categoryDelMsg: '',
        newCategoryMsg: '',
    },
    effects: {
        // 删除
        *delPayChargeItem({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(delPayChargeItem, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'del',
                        payload: response,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        // 删除项目类型
        *delPayItemCategory({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(delPayItemCategory, payload);
            console.log(response, 'responseresponseresponseresponse');
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'delCategory',
                        payload: response,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        // 列表
        *queryPayChargeItem({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(queryPayChargeItem, payload);
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

        // 项目类型
        *queryPayItemCategory({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(queryPayItemCategory, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'category',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        // 创建修改项目
        *addOrUpdPayChargeItem({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(addOrUpdPayChargeItem, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'newPro',
                        payload: response,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        // 创建修改项目类型
        *addOrUpdPayItemCategory({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(addOrUpdPayItemCategory, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'newCategory',
                        payload: response,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
    },
    reducers: {
        del(state, action) {
            return {
                ...state,
                chargeDelMsg: action.payload,
            };
        },
        delCategory(state, action) {
            return {
                ...state,
                categoryDelMsg: action.payload,
            };
        },
        list(state, action) {
            return {
                ...state,
                chargeList: action.payload,
            };
        },
        category(state, action) {
            return {
                ...state,
                payItemCategory: action.payload,
            };
        },
        newPro(state, action) {
            return {
                ...state,
                newProMsg: action.payload,
            };
        },
        newCategory(state, action) {
            return {
                ...state,
                newCategoryMsg: action.payload,
            };
        },
    },
};
