import { stringify } from 'qs';
import request from '../utils/request';

// 查询缴费订单列表
export async function getBillList(params) {
    return request(`/api/pay/order/billList?${stringify(params)}`);
}

// 查询缴费订单列表
export async function getCourseBillList(params) {
    return request(`/course/api/pay/order/billList?${stringify(params)}`);
}

// 查询缴费订单详情
export async function getOrderInfoByOrderId(params) {
    return request(`/api/pay/order/getOrderInfoByOrderId?${stringify(params)}`);
}

// 查询缴费订单详情
export async function getCourseOrderInfoByOrderId(params) {
    return request(`/course/api/pay/order/getOrderInfoByOrderId?${stringify(params)}`);
}

// 查询支付方式
export async function getPayWay(params) {
    return request(`/api/pay/order/getPayWay?${stringify(params)}`);
}
// 查询支付方式
export async function getCoursePayWay(params) {
    return request(`/course/api/pay/order/getPayWay?${stringify(params)}`);
}

// 余额扣减
export async function useBalance(params) {
    return request(`/course/api/pay/wallet/useWalletByDeductionAmount?${stringify(params)}`);
}

// 添加支付订单
export async function submitPay(params) {
    return request('/api/pay/order/submitPay', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}
// 添加支付订单
export async function courseSubmitPay(params) {
    return request('/course/api/pay/order/submitPay', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 银行限额
export async function fastPaymentLimit(params) {
    return request(`/api/pay/fastPaymentLimit?${stringify(params)}`);
}

// 获取网商银行信息
export async function getBankInfo(params) {
    return request('/api/pay/order/getBankInfo', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}
