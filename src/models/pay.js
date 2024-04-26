import { loginRedirect } from '../utils/utils';
import { message } from 'antd';
import {
    selectStudentGroup, // 查询学生组件
    getChargeItem, // 查询收费项目
    selectTeachingOrgStage, // 查询校区学段
    addPayTuitionPlan, // 新建缴费通知
    importChargeItem, // 上传
    selectTuitionPlan, // 查询缴费通知列表
    updateTuitionPlan, // 修改通知截至日期
    template, // 模板下载
    selectTuitionOrderStatus, // 查询缴费单详情状态总数
    selectTuitionPlanDetails, // 查询单个缴费计划详情
    geteditDetail, // 详情编辑按钮
    tuitionOrderDetailsPreview, // 预览
    isPromptSendTuitionPlan, // 一键催缴按钮判断以及统计催缴数据
    promptSendTuitionPlan, // 一键催缴
    delTuitionOrder, // 删除缴费订单
    delTuitionPlan, // 删除缴费通知
    sendTuitionPlanCount, // 一键发送缴费通知相关的统计
    sendTuitionPlan, // 一键发送缴费通知
    addPayCloseOrderInfo, // 关闭订单
    exportTuitionOrderDetail, // 导出
    getUpdatePayTuitionPlanDetail, // 编辑回显
    updatePayTuitionPlan, // 修改缴费计划
    selectTuitionPlanListStatus, // 统计缴费通知列表发送状态总数
    upload_file, // 关闭表单上传附件
    getAccountOderDetail, // 订单详情
    sendPayTuitionToPersonal, //一键催交
    getStudentTuitionPlan, //点击确认编辑回显
    refundTuitionOrderDone,
} from '../services/pay';

export default {
    namespace: 'pay',
    state: {
        student: {},
        campusAndStage: {},
        chargeList: [],
        newNoticeMsg: '',
        uploadList: [],
        selectTuitionPlanList: {},
        timeMsg: '',
        downMsg: '',
        detailContent: '',
        previewContent: '',
        detailStatusList: [],
        isPromptSendContent: '',
        promptSendContent: '',
        delNoticeMsg: '',
        delOrderMsg: '',
        sendTuitionPlanCountMsg: '', // 一键发送缴费通知相关的统计
        sendTuitionPlanMsg: '', // 一键发送缴费通知
        closeMsg: '', // 关闭订单
        importMsg: '',
        updatePlanList: '', // 编辑缴费计划回显
        updatePayTuitionPlanMsg: '',
        selectPlanStatusData: '',
        fileResponse: '',
        orderDetailContent: '',
    },
    effects: {
        *getAccountOderDetail({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(getAccountOderDetail, payload);
            if (response && response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'order',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *getStudentTuitionPlan({ payload, onSuccess }, { call, put }) {
            //获取club列表数据
            const response = yield call(getStudentTuitionPlan, payload);
            if (response && response.ifLogin) {
                if (response.status) {
                    // yield put({
                    //     type: 'order',
                    //     payload: response.content,
                    // });
                    onSuccess && onSuccess(response);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *refundTuitionOrderDone({ payload, onSuccess }, { call, put }) {
            const response = yield call(refundTuitionOrderDone, payload);
            if (response.ifLogin) {
                if (response.status) {
                    onSuccess && onSuccess();
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *upload_file({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(upload_file, payload);
            if (response && response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'closeUpload',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *selectTuitionPlanListStatus({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(selectTuitionPlanListStatus, payload);
            if (response && response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'selectPlanStatus',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *updatePayTuitionPlan({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(updatePayTuitionPlan, payload);
            if (response && response.ifLogin) {
                yield put({
                    type: 'updateSubmit',
                    payload: response,
                });
            } else {
                loginRedirect();
            }
        },
        *getUpdatePayTuitionPlanDetail({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(getUpdatePayTuitionPlanDetail, payload);
            if (response && response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'update',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },
        *selectStudentGroup({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(selectStudentGroup, payload);
            if (response && response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'student',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *getChargeItem({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(getChargeItem, payload);
            if (response && response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'charge',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *selectTeachingOrgStage({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(selectTeachingOrgStage, payload);
            if (response && response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'school',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *addPayTuitionPlan({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(addPayTuitionPlan, payload);
            console.log(response, 'response.......response');
            if (response && response.ifLogin) {
                yield put({
                    type: 'new',
                    payload: response,
                });
                // if(response.status || (!response.status && response.code == 40003)) {
                // }else if(!response.status && response.code != 40003){
                //     message.error(response.message);
                // }
            } else {
                loginRedirect();
            }
        },

        *importChargeItem({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(importChargeItem, payload);
            if (response && response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'upload',
                        payload: response,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *selectTuitionPlan({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(selectTuitionPlan, payload);
            if (response && response.ifLogin) {
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

        *updateTuitionPlan({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(updateTuitionPlan, payload);
            if (response && response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'time',
                        payload: response,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *template({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(template, payload);
            if (response && response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'download',
                        payload: response,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *selectTuitionPlanDetails({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(selectTuitionPlanDetails, payload);
            if (response && response.ifLogin) {
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

        *geteditDetail({ payload, onSuccess }, { call, put }) {
            //详情页面编辑
            const response = yield call(geteditDetail, payload);
            if (response && response.ifLogin) {
                if (response.status) {
                    onSuccess && onSuccess();
                    message.success(response.message);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *tuitionOrderDetailsPreview({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(tuitionOrderDetailsPreview, payload);
            if (response && response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'preview',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *selectTuitionOrderStatus({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(selectTuitionOrderStatus, payload);
            if (response && response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'detailStatus',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *isPromptSendTuitionPlan({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(isPromptSendTuitionPlan, payload);
            if (response && response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'isPrompt',
                        payload: response,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *promptSendTuitionPlan({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(promptSendTuitionPlan, payload);
            if (response && response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'prompt',
                        payload: response,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *delTuitionOrder({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(delTuitionOrder, payload);
            if (response && response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'delOrder',
                        payload: response,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *delTuitionPlan({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(delTuitionPlan, payload);
            if (response && response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'delNotice',
                        payload: response,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *sendTuitionPlanCount({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(sendTuitionPlanCount, payload);
            console.log(response, 'responseresponseresponseresponse');
            if (response && response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'sendCount',
                        payload: response.content,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *sendTuitionPlan({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(sendTuitionPlan, payload);
            console.log(response, 'responseresponseresponseresponse');
            if (response && response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'sendPlan',
                        payload: response,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *sendPayTuitionToPersonal({ payload, onSuccess }, { call, put }) {
            //获取club列表数据
            const response = yield call(sendPayTuitionToPersonal, payload);
            console.log(response, 'responseresponseresponseresponse');
            if (response && response.ifLogin) {
                if (response.status) {
                    onSuccess && onSuccess(response);
                    message.success(response.message);
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *addPayCloseOrderInfo({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(addPayCloseOrderInfo, payload);
            console.log(response, 'responseresponseresponseresponse');
            if (response && response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'close',
                        payload: response,
                    });
                } else {
                    message.error(response.message);
                }
            } else {
                loginRedirect();
            }
        },

        *exportTuitionOrderDetail({ payload }, { call, put }) {
            //获取club列表数据
            const response = yield call(exportTuitionOrderDetail, payload);
            console.log(response, 'responseresponseresponseresponse');
            if (response && response.ifLogin) {
                if (response.status) {
                    yield put({
                        type: 'import',
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
        student(state, action) {
            return {
                ...state,
                student: action.payload,
            };
        },

        charge(state, action) {
            return {
                ...state,
                chargeList: action.payload,
            };
        },

        school(state, action) {
            return {
                ...state,
                campusAndStage: action.payload,
            };
        },

        new(state, action) {
            return {
                ...state,
                newNoticeMsg: action.payload,
            };
        },

        upload(state, action) {
            return {
                ...state,
                uploadList: action.payload,
            };
        },

        list(state, action) {
            return {
                ...state,
                selectTuitionPlanList: action.payload,
            };
        },

        time(state, action) {
            return {
                ...state,
                timeMsg: action.payload,
            };
        },

        download(state, action) {
            return {
                ...state,
                downMsg: action.payload,
            };
        },

        detail(state, action) {
            return {
                ...state,
                detailContent: action.payload,
            };
        },

        preview(state, action) {
            return {
                ...state,
                previewContent: action.payload,
            };
        },

        detailStatus(state, action) {
            return {
                ...state,
                detailStatusList: action.payload,
            };
        },

        isPrompt(state, action) {
            return {
                ...state,
                isPromptSendContent: action.payload,
            };
        },

        prompt(state, action) {
            return {
                ...state,
                promptSendContent: action.payload,
            };
        },

        delNotice(state, action) {
            return {
                ...state,
                delNoticeMsg: action.payload,
            };
        },

        delOrder(state, action) {
            return {
                ...state,
                delOrderMsg: action.payload,
            };
        },

        sendCount(state, action) {
            return {
                ...state,
                sendTuitionPlanCountMsg: action.payload,
            };
        },

        sendPlan(state, action) {
            return {
                ...state,
                sendTuitionPlanMsg: action.payload,
            };
        },

        close(state, action) {
            return {
                ...state,
                closeMsg: action.payload,
            };
        },

        import(state, action) {
            return {
                ...state,
                importMsg: action.payload,
            };
        },

        update(state, action) {
            return {
                ...state,
                updatePlanList: action.payload,
            };
        },

        updateSubmit(state, action) {
            return {
                ...state,
                updatePayTuitionPlanMsg: action.payload,
            };
        },

        selectPlanStatus(state, action) {
            return {
                ...state,
                selectPlanStatusData: action.payload,
            };
        },

        closeUpload(state, action) {
            return {
                ...state,
                uploadList: action.payload,
            };
        },

        order(state, action) {
            return {
                ...state,
                orderDetailContent: action.payload,
            };
        },
    },
};
