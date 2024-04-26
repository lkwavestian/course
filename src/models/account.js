import { loginRedirect } from '../utils/utils';
import { message } from 'antd';
import {
    queryPayAccount,
    delPayAccount,
    queryBusiAndChannel,
    addOrUpdPayAccount,
    addMerChant,
    paymentMethodJudgment,
    queryMerchantAccount,
    delPayBusiness,
    queryPayBusinessById,
    getUserWalletList,
    getUserWalletDetailList,
    importWalletDetailsList,
    getScreeningItems,
} from '../services/account';

export default {
    namespace: 'account',
    state: {
        accountList: [],
        delMsg: '',
        busiAndChannelList: [],
        submitMsg: '',
        paymentMethodJudgment: {},
        queryMerchantAccountList: [],
        delPayBusiness: '',
        queryPayBusinessById: [],
        balanceList: [],
        changeList: [],
        balanceChangeList: [],
        balanceDetailsList: undefined,
        filterLists: undefined,
    },
    effects: {
        *delPayAccount({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(delPayAccount, payload);
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
        *delPayBusiness({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(delPayBusiness, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'getDelPayBusiness',
                        payload: response,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *queryPayAccount({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(queryPayAccount, payload);
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

        *getUserWalletList({ payload }, { call, put }) {
            //获取余额列表数据
            const response = yield call(getUserWalletList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'walletList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *getUserWalletDetailList({ payload }, { call, put }) {
            //获取余额列表数据
            const response = yield call(getUserWalletDetailList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'balanceChangeList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        //余额变更筛选
        *getScreeningItems({ payload }, { call, put }) {
            const response = yield call(getScreeningItems, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'filterReducer',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        //导入余额变动明显表
        *importWalletDetailsList({ payload, onSuccess }, { call, put }) {
            const response = yield call(importWalletDetailsList, payload);
            if (!response) return;
            if (!response.status) {
                message.error(response.message);
            } else {
                message.success(response.message);
            }
            !response.ifLogin && (yield loginRedirect());
            yield put({
                type: 'listImportReducer',
                payload: response.content,
            });
        },

        *queryMerchantAccount({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(queryMerchantAccount, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'merchantList',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *queryBusiAndChannel({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(queryBusiAndChannel, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'busiAndChannel',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *queryPayBusinessById({ payload }, { call, put }) {
            const response = yield call(queryPayBusinessById, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'getQueryPayBusinessById',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *addOrUpdPayAccount({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(addOrUpdPayAccount, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'submit',
                        payload: response.message,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *addMerChant({ payload, onSuccess }, { call, put }) {
            //获取club列表数据
            const response = yield call(addMerChant, payload);
            if (response.ifLogin) {
                if (response.status) {
                    onSuccess && onSuccess();
                    message.success(response.message);
                } else {
                    message.error(response.message);
                }
                // if (response.status) {
                //     yield put({
                //         type: 'getPaymentMethodJudgment',
                //         payload: response.content,
                //     });
                // } else {
                //     message.error(response.message);
                // }
            } else {
                loginRedirect();
            }
        },
        *paymentMethodJudgment({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(paymentMethodJudgment, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'getPaymentMethodJudgment',
                        payload: response.content,
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
                delMsg: action.payload,
            };
        },
        getDelPayBusiness(state, action) {
            return {
                ...state,
                delPayBusiness: action.payload,
            };
        },
        list(state, action) {
            return {
                ...state,
                accountList: action.payload,
            };
        },
        walletList(state, action) {
            return {
                ...state,
                balanceList: action.payload,
            };
        },
        balanceChangeList(state, action) {
            return {
                ...state,
                changeList: action.payload,
            };
        },
        filterReducer(state, action) {
            return {
                ...state,
                filterLists: action.payload,
            };
        },
        listImportReducer(state, action) {
            return {
                ...state,
                balanceDetailsList: action.payload,
            };
        },
        merchantList(state, action) {
            return {
                ...state,
                queryMerchantAccountList: action.payload,
            };
        },
        busiAndChannel(state, action) {
            return {
                ...state,
                busiAndChannelList: action.payload,
            };
        },
        getQueryPayBusinessById(state, action) {
            return {
                ...state,
                queryPayBusinessById: action.payload,
            };
        },
        submit(state, action) {
            return {
                ...state,
                submitMsg: action.payload,
            };
        },
        getPaymentMethodJudgment(state, action) {
            return {
                ...state,
                paymentMethodJudgment: action.payload,
            };
        },
    },
};
