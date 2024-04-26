import { stringify } from 'qs';
import request from '../utils/request';

// 可以调换课的有边框
export async function addBorder(params) {
    return request(`/api/scheduleResult/newListExchange?${stringify(params)}`);
}

// 可移动与不可移动课的颜色
export async function removableColor(params) {
    return request(`/api/scheduleResult/mobileListExchange?${stringify(params)}`);
}

// ac缓冲区移动
export async function updateACToBuffer(params) {
    return request('/api/detail/updateACToBuffer', {
        method: 'POST',
        body: params,
    });
}
