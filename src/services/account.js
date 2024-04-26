import { stringify } from 'qs';
import request from '../utils/request';

//账户列表
export async function queryPayAccount(params) {
    return request(`/api/queryPayAccount?${stringify(params)}`);
}

//余额列表
export async function getUserWalletList(params) {
    return request(`/api/pay/wallet/getUserWalletList?${stringify(params)}`);
}
//余额明细变动列表
export async function getUserWalletDetailList(params) {
    return request(`/api/pay/wallet/getUserWalletDetailList?${stringify(params)}`);
}

//明细变动筛选
export async function getScreeningItems(params) {
    return request(`/api/pay/wallet/getScreeningItems?${stringify(params)}`);
}

// 余额明细变动表上传
export async function importWalletDetailsList(params) {
    return request(`/api/pay/wallet/importUserWalletDetailTemplateExcel`, {
        method: 'POST',
        body: params,
    });
}

//商户列表
export async function queryMerchantAccount(params) {
    return request(`/api/business/queryPayBusiness?${stringify(params)}`);
}

// export async function queryPayAccount(params) {
//     const serviceUrl = `https://yungupay.daily.yungu-inc.org/api/queryPayAccount?${stringify(params)}`;
//     return window.fetch(
//       serviceUrl,
//       {
//         method: 'GET',
//         redirect: 'follow',
//         mode: 'cors'
//       }
//     ).then(res => {
//       return res.json();
//     }).catch(e => {
//       console.error('Cannot get newsprint content')
//     })
// }

//删除操作
export async function delPayAccount(params) {
    return request(`/api/delPayAccount?${stringify(params)}`);
}

// 商户和渠道
export async function queryBusiAndChannel(params) {
    return request(`/api/queryBusiAndChannel?${stringify(params)}`);
}

// 编辑商户列表回显
export async function queryPayBusinessById(params) {
    return request(`/api/business/queryPayBusinessById?${stringify(params)}`);
}

// 新建账户&编辑账户
export async function addOrUpdPayAccount(params) {
    return request('/api/addOrUpdPayAccount', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}
//addMerChant
export async function addMerChant(params) {
    return request('/api/business/addOrUpdateBusiness', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}
// export async function addOrUpdPayAccount(params) {
//     var req = new Request('https://yungupay.daily.yungu-inc.org/api/addOrUpdPayAccount', {
//     method: "POST",
//     // credentials: 'include',
//     headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
//     mode: "cors",
//     body: getkey(params)
// })

// fetch(req).then((res) => {
//     return res.json();
//  }).then(
//     (data) => {
//         console.log(data);
//     })
// }

//支付方式类型判断
export async function paymentMethodJudgment(params) {
    return request(`/api/business/querySchoolPayType?${stringify(params)}`);
}

//商户删除操作
export async function delPayBusiness(params) {
    return request(`/api/business/delPayBusiness?${stringify(params)}`);
}
