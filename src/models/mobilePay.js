import { loginRedirect } from '../utils/utils';
import { message } from 'antd';
import {
    getBillList,
    getOrderInfoByOrderId,
    getCourseOrderInfoByOrderId,
    getPayWay,
    submitPay,
    fastPaymentLimit,
    getBankInfo,
    useBalance,
    getCourseBillList,
    getCoursePayWay,
    courseSubmitPay,
} from '../services/mobilePay';

export default {
    namespace: 'mobilePay',
    state: {
        billList: '',
        courseBillList: '',
        detailContent: '',
        courseDetailContent: '',
        payList: '',
        coursePayList: '',
        submitPayMsg: '',
        courseSubmitPayMsg: '',
        importDetailContent: '',
        limitContent: '',
        bankInfo: '',
        useBalanceWallet: '',
    },
    effects: {
        // 网商信息
        *getBankInfo({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(getBankInfo, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'bank',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        // 银行限额
        *fastPaymentLimit({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(fastPaymentLimit, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'limit',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        // 查询账单列表
        *getBillList({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(getBillList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'bill',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        // 查询账单列表
        *getCourseBillList({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(getCourseBillList, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'courseBill',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        // 查询账单详情
        *getOrderInfoByOrderId({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(getOrderInfoByOrderId, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'detail',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        // 查询账单详情
        *getCourseOrderInfoByOrderId({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(getCourseOrderInfoByOrderId, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'courseDetail',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        // 查询支付方式
        *getPayWay({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(getPayWay, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'payWay',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        // 查询支付方式
        *getCoursePayWay({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(getCoursePayWay, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'coursePayWay',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        // 扣减余额接口
        *useBalance({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(useBalance, payload);
            if (response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'balanceReducer',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        // 添加支付订单
        *submitPay({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(submitPay, payload);
            console.log(response, 'ssbb3');
            if (response && response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'submit',
                        payload: response,
                    });
                } else {
                    message.error(response.message);
                    if (response) {
                        yield put({
                            type: 'submit',
                            payload: response,
                        });
                    }
                }
            } else {
                if (response) {
                    yield put({
                        type: 'submit',
                        payload: response,
                    });
                } else {
                    // loginRedirect();
                }
                // loginRedirect();
            }
        },
        // 添加支付订单
        *courseSubmitPay({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(courseSubmitPay, payload);
            console.log(response, 'ssbb3111');
            if (response && response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'courseSubmit',
                        payload: response,
                    });
                } else {
                    message.error(response.message);
                    if (response) {
                        yield put({
                            type: 'courseSubmit',
                            payload: response,
                        });
                    }
                }
            } else {
                if (response) {
                    yield put({
                        type: 'courseSubmit',
                        payload: response,
                    });
                } else {
                    // loginRedirect();
                }
                // loginRedirect();
            }
        },

        *detailExport({ payload }, { call, put }) {
            yield put({
                type: 'exportMsg',
                payload: payload,
            });
        },
    },
    reducers: {
        bill(state, action) {
            return {
                ...state,
                billList: action.payload,
            };
        },
        courseBill(state, action) {
            return {
                ...state,
                courseBillList: action.payload,
            };
        },
        detail(state, action) {
            return {
                ...state,
                detailContent: action.payload,
            };
        },
        courseDetail(state, action) {
            return {
                ...state,
                courseDetailContent: action.payload,
            };
        },
        payWay(state, action) {
            return {
                ...state,
                payList: action.payload,
            };
        },
        coursePayWay(state, action) {
            return {
                ...state,
                coursePayList: action.payload,
            };
        },
        balanceReducer(state, action) {
            return {
                ...state,
                useBalanceWallet: action.payload,
            };
        },
        submit(state, action) {
            return {
                ...state,
                submitPayMsg: action.payload,
            };
        },
        courseSubmit(state, action) {
            console.log('payload', action.payload);
            // debugger;
            return {
                ...state,
                courseSubmitPayMsg: action.payload,
            };
        },
        exportMsg(state, action) {
            return {
                ...state,
                importDetailContent: action.payload,
            };
        },
        limit(state, action) {
            return {
                ...state,
                limitContent: action.payload,
            };
        },
        bank(state, action) {
            return {
                ...state,
                bankInfo: action.payload,
            };
        },
    },
};
