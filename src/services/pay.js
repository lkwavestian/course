import { stringify } from 'qs';
import request from '../utils/request';

//查询学生组件
export async function selectStudentGroup(params) {
    return request('/api/pay/selectStudentGroup', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 查询收费项目
export async function getChargeItem(params) {
    return request(`/api/pay/getChargeItem?${stringify(params)}`);
}

// 查询校区学段
export async function selectTeachingOrgStage(params) {
    return request(`/api/pay/selectTeachingOrgStage?${stringify(params)}`);
}

// 新建通知
export async function addPayTuitionPlan(params) {
    return request('/api/pay/addPayTuitionPlan', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 上传
export async function importChargeItem(params) {
    return request('/api/pay/importChargeItem', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 查询缴费通知列表
export async function selectTuitionPlan(params) {
    return request('/api/pay/selectTuitionPlan', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 修改通知截至日期
export async function updateTuitionPlan(params) {
    return request(`/api/pay/updateTuitionPlan?${stringify(params)}`);
}

// 模板下载
export async function template(params) {
    return request(`/download/chargeItem/template?${stringify(params)}`);
}

// 查询缴费单详情状态总数
export async function selectTuitionOrderStatus(params) {
    return request(`/api/pay/selectTuitionOrderStatus?${stringify(params)}`);
}

// 查询单个缴费计划详情
export async function selectTuitionPlanDetails(params) {
    return request('/api/pay/selectTuitionPlanDetails', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

export async function geteditDetail(params) {
    return request('/api/pay/updateTuitionFee', {
        method: 'POST',
        body: params,
    });
}

//预览
export async function tuitionOrderDetailsPreview(params) {
    return request('/api/pay/tuitionOrderDetailsPreview', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 一键催缴按钮判断以及统计催缴数据
export async function isPromptSendTuitionPlan(params) {
    return request('/api/pay/isPromptSendTuitionPlan', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 一键催缴
export async function promptSendTuitionPlan(params) {
    return request('/api/pay/promptSendTuitionPlan', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 删除缴费订单
export async function delTuitionOrder(params) {
    return request(`/api/pay/delTuitionOrder?${stringify(params)}`);
}

// 删除缴费通知
export async function delTuitionPlan(params) {
    return request(`/api/pay/delTuitionPlan?${stringify(params)}`);
}

// 一键发送缴费通知相关的统计
export async function sendTuitionPlanCount(params) {
    return request(`/api/pay/sendTuitionPlanCount?${stringify(params)}`);
}

// 一键发送
export async function sendTuitionPlan(params) {
    return request(`/api/pay/sendTuitionPlan?${stringify(params)}`);
}

//一键催缴sendPayTuitionToPersonal
export async function sendPayTuitionToPersonal(params) {
    return request(`/api/pay/sendPayTuitionToPersonal?${stringify(params)}`);
}

// 关闭订单
export async function addPayCloseOrderInfo(params) {
    return request('/api/addPayCloseOrderInfo', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 导出
export async function exportTuitionOrderDetail(params) {
    return request(`/api/pay/exportTuitionOrderDetail?${stringify(params)}`);
}

// 编辑
export async function getUpdatePayTuitionPlanDetail(params) {
    return request(`/api/pay/getUpdatePayTuitionPlanDetail?${stringify(params)}`);
}

// 修改缴费计划
export async function updatePayTuitionPlan(params) {
    return request('/api/pay/updatePayTuitionPlan', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 统计缴费通知列表发送状态总数
export async function selectTuitionPlanListStatus(params) {
    console.log(params);
    return request(`/api/pay/selectTuitionPlanListStatus?${stringify(params)}`);
}

// 关闭表单上传附件
export async function upload_file(params) {
    return request('/api/upload_file', {
        method: 'POST',
        body: {
            ...params,
        },
    });
}

// 关闭表单上传附件
export async function getAccountOderDetail(params) {
    return request(`/api/pay/getAccountOderDetail?${stringify(params)}`);
}

//点击确认编辑回显
export async function getStudentTuitionPlan(params) {
    return request(
        `/api/payTuition/createStudentTuitionPlan?studentStage=${params.studentStage}&studentType=${params.studentType}&studentGrade=${params.gradeList}&semesterId=${params.semesterValue}`
    );
}
//确认已打款
export async function refundTuitionOrderDone(params) {
    return request(`/api/pay/refundTuitionOrderDone?${stringify(params)}`);
}
