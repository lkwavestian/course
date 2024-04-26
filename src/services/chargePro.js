import { stringify } from 'qs';
import request from '../utils/request';

//删除
export async function delPayChargeItem(params) {
    return request(`/api/delPayChargeItem?${stringify(params)}`);
}

// 列表
export async function queryPayChargeItem(params) {
    return request(`/api/queryPayChargeItem?${stringify(params)}`);
}

// 收费项目类型
export async function queryPayItemCategory(params) {
    return request(`/api/queryPayItemCategory?${stringify(params)}`);
}

// 新建或修改类型
export async function addOrUpdPayItemCategory(params) {
    return request('/api/addOrUpdPayItemCategory', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 新建修改项目
export async function addOrUpdPayChargeItem(params) {
    return request('/api/addOrUpdPayChargeItem', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 删除项目类型
export async function delPayItemCategory(params) {
    return request(`/api/delPayItemCategory?${stringify(params)}`);
}
