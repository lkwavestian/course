import {
    selectStudentGroup, // 查询学生组件
    selectTeachingOrgStage, // 查询校区学段
    queryPayChargeItem, // 查询收费项目
    addPayTuitionPlan, // 新建缴费通知
    importChargeItem, // 上传
    selectTuitionPlan, // 查询缴费通知列表
    updateTuitionPlan, // 修改截止日期
    template, // 模板下载
    selectTuitionPlanDetails, // 查询单个缴费计划详情
    selectTuitionOrderStatus, // 详情状态
    tuitionOrderDetailsPreview, // 预览
    isPromptSendTuitionPlan, // 一键催缴按钮判断以及统计催缴数据
    promptSendTuitionPlan, // 一键催缴
    delTuitionOrder, // 删除缴费订单
    delTuitionPlan, // 删除通知
    sendTuitionPlanCount, // 一键发送缴费通知相关的统计
    sendTuitionPlan, // 一键发送缴费通知
    addPayCloseOrderInfo, // 关闭订单
    exportTuitionOrderDetail, // 导出
    getUpdatePayTuitionPlanDetail, // 编辑
    updatePayTuitionPlan, // 修改缴费计划
    selectTuitionPlanListStatus, // 统计缴费通知列表发送状态总数
    upload_file, // 关闭表单上传文件
    getAccountOderDetail, // 账单详情
} from '../mock/pay.js';

import {
    payItemDelMsg, // 删除
    queryPayItemList, // 列表
    queryPayItemCategory, // 收费项目类型
    addOrUpdPayChargeItem, // 新建修改项目
    addOrUpdPayItemCategory, // 新建修改项目类型
    delPayItemCategory, // 删除项目类型
} from '../mock/chargePro.js';

import {
    delMsg,
    accountList,
    busiAndChannelList,
    addOrUpdPayAccount,
    addMerChant,
    queryMerchantAccountList,
    delPayBusiness,
    queryPayBusinessById,
} from '../mock/account.js';

import {
    billList,
    getOrderInfoByOrderId,
    getPayWay,
    submitPay,
    fastPaymentLimit,
} from '../mock/mobilePay.js';

import {
    batchOrderQuery,
    getTransactionsDetail,
    personalArrangements,
    disciplineManagement,
    subjectChief,
    gradeDetails,
    sectionList,
    currentSemesterSubject,
    createStageSubject,
    stageSubject,
    updateStageSubject,
    changeViewConfig,
} from '../mock/order.js';

export default {
    // 账号管理
    // 删除
    'GET /api/delPayAccount': delMsg,
    // 账户列表
    'GET /api/queryPayAccount': accountList,
    //商户删除
    'GET /api/business/delPayBusiness': delPayBusiness,
    //商户列表
    'GET /api/business/queryPayBusiness': queryMerchantAccountList,
    // 查询商户和收款渠道
    'GET /api/queryBusiAndChannel': busiAndChannelList,
    'GET /api/business/queryPayBusinessById': queryPayBusinessById,
    // 新建修改
    'POST /api/addOrUpdPayAccount': addOrUpdPayAccount,
    'POST /api/business/addCompanyBusinessAccount': addMerChant,

    // 收费管理
    'GET /api/delPayChargeItem': payItemDelMsg, // 删除
    'GET /api/queryPayChargeItem': queryPayItemList, // 列表
    'GET /api/queryPayItemCategory': queryPayItemCategory, // 收费项目类型
    'POST /api/addOrUpdPayItemCategory': addOrUpdPayItemCategory, // 新建修改项目类型
    'POST /api/addOrUpdPayChargeItem': addOrUpdPayChargeItem, // 新建修改项目类型
    'GET /api/delPayItemCategory': delPayItemCategory, // 删除收费项目类型
    'POST /api/pay/selectStudentGroup': selectStudentGroup, // 查询学生组件
    'GET /api/pay/selectTeachingOrgStage': selectTeachingOrgStage, // 查询校区学段
    'GET /api/pay/getChargeItem': queryPayChargeItem, // 查询收费项目

    // 缴费管理
    'POST /api/pay/addPayTuitionPlan': addPayTuitionPlan, // 新建缴费通知
    'POST /api/pay/importChargeItem': importChargeItem, // 上传
    'POST /api/pay/selectTuitionPlan': selectTuitionPlan, // 查询缴费通知列表
    'GET /api/pay/updateTuitionPlan': updateTuitionPlan, // 修改通知截至日期
    'GET /download/chargeItem/template': template, // 收费项目下载模版
    'POST /api/pay/selectTuitionPlanDetails': selectTuitionPlanDetails, // 查询单个缴费计划详情
    'GET /api/pay/selectTuitionOrderStatus': selectTuitionOrderStatus, // 查询缴费单详情状态总数
    'POST /api/pay/tuitionOrderDetailsPreview': tuitionOrderDetailsPreview, // 预览
    'POST /api/pay/promptSendTuitionPlan': promptSendTuitionPlan, // 一键催缴
    'POST /api/pay/isPromptSendTuitionPlan': isPromptSendTuitionPlan, // 一键催缴按钮判断以及统计催缴数据
    'GET /api/pay/delTuitionOrder': delTuitionOrder, // 删除缴费订单
    'GET /api/pay/delTuitionPlan': delTuitionPlan, // 删除缴费通知
    'GET /api/pay/sendTuitionPlanCount': sendTuitionPlanCount, // 一键发送缴费通知相关的统计
    'GET /api/pay/sendTuitionPlan': sendTuitionPlan, // 一键发送缴费通知
    'POST /api/addPayCloseOrderInfo': addPayCloseOrderInfo, // 关闭订单
    'GET /api/pay/exportTuitionOrderDetail': exportTuitionOrderDetail, // 导出
    'GET /api/pay/getUpdatePayTuitionPlanDetail': getUpdatePayTuitionPlanDetail, // 编辑
    'POST /api/pay/updatePayTuitionPlan': updatePayTuitionPlan, // 修改缴费计划
    'GET /api/pay/selectTuitionPlanListStatus': selectTuitionPlanListStatus, // 统计缴费通知列表发送状态总数
    'POST /api/upload_file': upload_file, // 关闭表单上传文件
    'GET /api/pay/getAccountOderDetail': getAccountOderDetail, // 账单详情

    // 家长缴费
    'GET /api/pay/order/billList': billList, // 缴费订单列表
    'GET /api/pay/order/getOrderInfoByOrderId': getOrderInfoByOrderId, // 查询订单缴费详情
    'GET /api/pay/order/getPayWay': getPayWay, // 查询支付方式
    'POST /api/pay/order/submitPay': submitPay, // 添加支付订单，支付
    'GET /api/pay/fastPaymentLimit': fastPaymentLimit, // 银行限额

    // 收支明细&交易流水
    'POST /api/batchOrder/batchOrderQuery': batchOrderQuery, // 账户收入明细查询
    'POST /api/pay/getTransactionsDetail': getTransactionsDetail, // 查询交易流水

    //学科首席列表
    'POST /api/worksheet/subjectChief': subjectChief,
    //学段管理岗位列表
    'GET /api/worksheet/stageRole': disciplineManagement,
    //年级明细
    'POST /api/worksheet/gradeTeacherWorkSheet': gradeDetails,
    //学段列表
    'POST /api/pay/sectionList': sectionList,
    //报表设置
    'GET /api/worksheet/currentSemesterSubject': currentSemesterSubject,
    //保存报表设置
    'POST /api/worksheet/createStageSubject': createStageSubject,
    //回显列表
    'GET /api/worksheet/stageSubject': stageSubject,
    //更新设置
    'POST /api/worksheet/updateStageSubject': updateStageSubject,
    'POST /api/worksheet/changeViewConfig': changeViewConfig,

    //个人工作安排
    'POST /api/worksheet/teacherView': personalArrangements,
};
