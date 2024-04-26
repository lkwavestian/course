// /api/editDetail
import React, { PureComponent } from 'react';
import styles from './detail.less';
import {
    Divider,
    DatePicker,
    Popconfirm,
    message,
    Menu,
    Dropdown,
    Icon,
    Button,
    Row,
    Col,
    Form,
    Select,
    Input,
    Table,
    Pagination,
    Modal,
    Checkbox,
    Radio,
} from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import icon from '../../icon.less';
import moment from 'moment';
import { formatTime, getUrlSearch } from '../../utils/utils';
import Preview from './preview.js';
import CloseOrder from './closeOrder.js';
import OrderDetail from './orderDetail.js';
import NewNoticePro from './newNoticePro.js';
import { stringify } from 'qs';
import { trans } from '../../utils/i18n';
import { isEmpty } from 'lodash';

const dateFormat = 'YYYY-MM-DD';
const { Option } = Select;
const { Search } = Input;
const CheckboxGroup = Checkbox.Group;

let mergeLength = {
    name: 0,
    group: 0,
    noticeStatus: 0,
    payStatus: 0,
    orderPrice: 0,
    actualPrice: 0,
    priceChange: 0,
    action: 0,
    checkbox: 0,
};
@connect((state) => ({
    detailContent: state.pay.detailContent,
    detailStatusList: state.pay.detailStatusList,
    previewContent: state.pay.previewContent, // 预览
    isPromptSendContent: state.pay.isPromptSendContent, //判断一键催缴方式
    promptSendContent: state.pay.promptSendContent, // 一键催缴
    delNoticeMsg: state.pay.delNoticeMsg, // 删除缴费通知
    delOrderMsg: state.pay.delOrderMsg, // 删除缴费订单
    editTimeMsg: state.pay.timeMsg, // 修改截至日期
    sendTuitionPlanCountMsg: state.pay.sendTuitionPlanCountMsg, //一键发送缴费通知相关的统计
    sendTuitionPlanMsg: state.pay.sendTuitionPlanMsg, // 一键发送缴费通知
    importMsg: state.pay.importMsg, // 导出
    updatePlanList: state.pay.updatePlanList, // 编辑通知回显
    orderDetailContent: state.pay.orderDetailContent, // 订单详情
    busiAndChannelList: state.account.busiAndChannelList, //获取商户
    currentUser: state.global.currentUser,
}))
@Form.create()
export default class PayDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            keyValue: '', // 关键字查询
            messageStatus: '', // 发送状态
            payStatus: '', // 支付状态
            studentGroup: '', // 行政班筛选value
            tuitionPlanId: '', // 计划id
            page: 1,
            pageSize: 40,
            total: null,
            sendStatus: '', // 表头状态筛选，返回的发送状态
            tableList: [],
            dataStatistics: {}, // 详情通知相关信息存储
            previewVisible: false, // 预览状态显隐
            checkAll: false, // 列表前面选中全部数据状态控制、目前该功能去掉
            checkPage: false, // 列表前面选中当前页状态控制、 目前该功能去掉
            data: [], // 处理后table需要的格式
            promptVisible: false, // 一键催缴、发送、删除弹窗显隐状态
            modalText: '', // 一键催缴、发送、删除弹窗副标题
            modalTitle: '', // 一键催缴、发送、删除弹窗标题
            modalConfirmText: '', // 一键催缴、发送、删除弹窗确认按钮文案
            orderNoList: [], // 选择部分数据，需要将订单号以数组格式传给后端、目前该功能去掉
            promptType: '', // 催缴选择数据状态、目前只传全部1
            isPromptSendDisabled: true, // 催缴按钮是否禁填控制
            timeVisible: false, // 修改日期弹窗状态
            timeValue: null, // 日期value
            isOpen: false, // 关闭订单弹窗控制
            orderPrice: '', // 关闭表单：实缴金额
            orderNo: '', // 订单号
            isViewDetail: false, // 查看订单详情抽屉显隐
            orderDetailContent: '', // 订单详情数据
            editVisible: false, // 编辑通知弹窗显隐
            isEdit: false, // 是否为编辑状态
            checkPageList: {}, // 分页控制当前页是否选中
            isSend: false, // 判断发送绑定的学生个数，0个学生禁止发送
            sendLoading: false,
            paidInTotal: '', //实收
            deductionAmount: '', //余额抵扣
            outstandingAmout: '', //欠缴合计
            accountsReceivableAmount: '', //应收
            channelList: [], //支付方式
            channelId: '', // 支付方式id
            priceIptVisible: false,
            priceId: '',
            priceName: '',
            priceValue: '',
            id: '',
            priceRecord: '', //点击编辑存入行数据
            iptFrame: [],
            isTeacherChildren: 2,
            record: {},
            refundTotal: '', //退款合计
            onlyRefunded: 2,
            useBalanceVisible: false, //是否允许使用余额抵扣弹窗
            sendNoticeForYunguVisible: false, //是否允许使用余额抵扣弹窗(云谷无)
            allowValue: undefined, //是否允许学生账户余额抵扣
            useWallet: '',
        };
    }

    componentDidMount() {
        document.getElementsByTagName('title')[0].innerHTML = '收费管理';
        //判断是否是链接点进来的,如果不是，重新获取 payPlanId
        if (this.props.payPlanId || this.props.tuitionPlanId) {
            this.setState(
                {
                    tuitionPlanId: this.props.payPlanId || this.props.tuitionPlanId,
                },
                () => {
                    this.getData();
                    this.getStatus();
                    this.judgePaymentType();
                    this.getBusiAndChannel();
                }
            );
        } else {
            this.setState(
                {
                    tuitionPlanId: getUrlSearch('planId'),
                },
                () => {
                    this.getData();
                    this.getStatus();
                    this.judgePaymentType();
                    this.getBusiAndChannel();
                }
            );
        }
        this.props.dispatch({
            type: 'global/getCurrentUser',
            payload: {},
        });
    }

    componentDidUpdate(prevProps, prevState) {
        let tempPayPlanId = getUrlSearch('payPlanId');
        if (tempPayPlanId != this.state.tuitionPlanId && tempPayPlanId) {
            this.setState(
                {
                    tuitionPlanId: tempPayPlanId,
                },
                () => {
                    this.getData();
                    this.getStatus();
                    this.judgePaymentType();
                    this.getBusiAndChannel();
                }
            );
        }
    }

    getTuitionPlanId = (payPlanId, tuitionPlanId) => {
        if (payPlanId) {
            return payPlanId;
        }
        if (getUrlSearch('payPlanId')) {
            return getUrlSearch('payPlanId');
        }
        if (tuitionPlanId) {
            return tuitionPlanId;
        }
    };

    unique = (arr) => {
        return Array.from(new Set(arr));
    };

    // 状态查询
    getStatus = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'pay/selectTuitionOrderStatus',
            payload: {
                tuitionPlanId: this.state.tuitionPlanId,
            },
        });
    };
    //只看教职工子女
    teacherChildren = (e) => {
        if (e.target.checked) {
            this.setState(
                {
                    isTeacherChildren: 1,
                    discountType: '教职工子女',
                    // payStatus: this.props.detailStatusList.discountType.statusCode,
                },
                () => {
                    this.getData();
                    this.judgePaymentType();
                }
            );
        } else {
            this.setState(
                {
                    isTeacherChildren: 2,
                    discountType: '',
                    // payStatus: '',
                },
                () => {
                    this.getData();
                    this.judgePaymentType();
                }
            );
        }
    };

    //只看有退款
    OnlyRefunded = (e) => {
        if (e.target.checked) {
            this.setState(
                {
                    onlyRefunded: 1,
                    // payStatus: this.props.detailStatusList.discountType.statusCode,
                    payStatus: -2,
                },
                () => {
                    this.getData();
                    this.judgePaymentType();
                }
            );
        } else {
            this.setState(
                {
                    onlyRefunded: 2,
                    // discountType: '',
                    payStatus: '',
                },
                () => {
                    this.getData();
                    this.judgePaymentType();
                }
            );
        }
    };

    // 列表
    getData = () => {
        const { dispatch } = this.props;
        const {
            tuitionPlanId,
            studentGroup,
            payStatus,
            messageStatus,
            keyValue,
            page,
            pageSize,
            channelId,
            discountType,
            onlyRefunded,
        } = this.state;
        dispatch({
            type: 'pay/selectTuitionPlanDetails',
            payload: {
                matchName: keyValue,
                messageStatus: messageStatus,
                pageNum: page,
                pageSize: pageSize,
                payStatus: payStatus,
                studentGroup: studentGroup,
                tuitionPlanId: tuitionPlanId,
                ifOfflineTransfer: channelId,
                discountType,
                // onlyRefunded,
            },
        }).then(() => {
            const { detailContent } = this.props;
            this.setState(
                {
                    total: detailContent && detailContent.pagerResult.total,
                    id:
                        detailContent &&
                        detailContent.pagerResult &&
                        detailContent.pagerResult.data &&
                        detailContent.pagerResult.data.id,
                    tableList:
                        detailContent &&
                        detailContent.pagerResult.data &&
                        detailContent.pagerResult.data.payTuitionOrderDetailResponses,
                    dataStatistics: detailContent && detailContent.pagerResult.data,
                    paidInTotal: detailContent && detailContent.realPayAmount,
                    // detailContent && detailContent.canUseWallet
                    //     ? detailContent.realPayAmount
                    //     : detailContent.paidInTotal,
                    useWallet:
                        detailContent &&
                        detailContent.pagerResult &&
                        detailContent.pagerResult.data &&
                        detailContent.pagerResult.data.canUseWallet,
                    deductionAmount: detailContent && detailContent.deductionAmount,
                    outstandingAmout: detailContent && detailContent.outstandingAmout,
                    accountsReceivableAmount:
                        detailContent && detailContent.accountsReceivableAmount,
                    refundTotal: detailContent && detailContent.refundTotal,
                },
                () => {
                    // this.prop.status = this.state.dataStatistics.submitStatus
                    this.tableListDeal(this.state.tableList);
                }
            );
        });
    };

    // 处理表格需要的数据结构
    tableListDeal = (tableList) => {
        let data = [];
        if (tableList && tableList.length) {
            for (let i = 0; i < tableList.length; i++) {
                for (let j = 0; j < tableList[i].payChargeItemDetailModelList.length; j++) {
                    data.push({
                        key: '' + i + j,
                        length: tableList[i].payChargeItemDetailModelList.length,
                        payChargeItemDetailModelList: tableList[i].payChargeItemDetailModelList,
                        name: tableList[i].userName,
                        group: tableList[i].studentGroupName,
                        chargePro: tableList[i].payChargeItemDetailModelList[j].payChargeItemName,
                        price: `${tableList[i].payChargeItemDetailModelList[j].price} X${
                            tableList[i].payChargeItemDetailModelList[j].quantity
                        } ${
                            tableList[i].payChargeItemDetailModelList[j].discount == '1.0'
                                ? ''
                                : `X${tableList[i].payChargeItemDetailModelList[j].discount}`
                        }`,
                        duePrice: tableList[i].payChargeItemDetailModelList[j].duePrice,
                        quantity: tableList[i].payChargeItemDetailModelList[j].quantity,
                        noticeStatus: tableList[i].messageStatus,
                        payStatus: tableList[i].payStatus,
                        refundAmount: tableList[i].refundAmount,
                        realPayAmount: tableList[i].realPayAmount,
                        deductionAmount: tableList[i].deductionAmount,
                        orderPrice: tableList[i].amount,
                        actualPrice: tableList[i].batchAccumulatedAmount,
                        priceChange: tableList[i].owedAmount,
                        rowKey: tableList[i].userId,
                        checkStatus: false,
                        orderNo: tableList[i].orderNo,
                        id: tableList[i].id,
                        payOrderName: tableList[i].payOrderName,
                        tags: tableList[i].payChargeItemDetailModelList[j].tags,
                        ifClose: tableList[i].ifClose,
                        discountType: tableList[i].discountType[0], //折扣
                        campusId: tableList[i].campusId, //课程id
                    });
                }
            }
            const { checkAll, checkPageList, page } = this.state;
            // 列表全选，切换分页仍然选中、目前该功能去掉
            data = data.map((item) => {
                item.checkStatus = checkAll || checkPageList[page];
                return item;
            });
        }
        this.setState({
            data,
        });
    };

    goBack = () => {
        this.props.changeStatus(1);
    };

    // 班级
    selectGroupStatus = (value) => {
        this.setState(
            {
                studentGroup: value,
                page: 1,
            },
            () => {
                this.getData();
                this.judgePaymentType();
            }
        );
    };

    // 通知状态
    selectSubmitStatus = (value) => {
        this.setState(
            {
                messageStatus: value,
                page: 1,
            },
            () => {
                this.getData();
                this.judgePaymentType();
            }
        );
    };

    // 缴费状态
    selectPayStatus = (value) => {
        this.setState(
            {
                payStatus: value,
                page: 1,
            },
            () => {
                this.getData();
                this.judgePaymentType();
            }
        );
    };

    // 关键字查询
    searchKeyValue = (e) => {
        this.setState(
            {
                keyValue: e.target.value,
                page: 1,
            },
            () => {
                if (this.searchValue) {
                    clearTimeout(this.searchValue);
                    this.searchValue = false;
                }
                this.searchValue = setTimeout(() => {
                    this.getData();
                    this.judgePaymentType();
                }, 800);
            }
        );
    };

    getCannelValue = (value) => {
        this.setState(
            {
                channelId: value ? value : '',
            },
            () => {
                this.getData();
                this.judgePaymentType();
            }
        );
    };

    // 切换页面
    changePage = (page, pageSize) => {
        this.setState(
            {
                page,
            },
            () => {
                this.getData();
            }
        );
    };

    // 切换每页显示条数
    onShowSizeChange = (current, pageSize) => {
        this.setState(
            {
                page: 1,
                pageSize,
            },
            () => {
                this.getData();
            }
        );
    };

    // 表头支付状态筛选
    selectStatus = (e) => {
        const { detailStatusList } = this.props;
        if (e == this.state.payStatus) {
            e = null;
        }
        this.setState(
            {
                // discountType: e,
                payStatus: e,
                messageStatus: '',
            },
            () => {
                this.getData();
            }
        );
        // }
    };

    // 表头通知状态筛选
    sendStatus = (e) => {
        if (e == this.state.messageStatus) {
            e = null;
        }
        this.setState(
            {
                messageStatus: e,
                payStatus: '',
            },
            () => {
                this.getData();
            }
        );
    };

    // 预览
    showPreview = () => {
        const { dispatch } = this.props;
        const { tuitionPlanId, studentGroup, payStatus, messageStatus, keyValue, page, pageSize } =
            this.state;
        dispatch({
            type: 'pay/tuitionOrderDetailsPreview',
            payload: {
                matchName: keyValue,
                messageStatus: messageStatus,
                pageNum: page,
                pageSize: pageSize,
                payStatus: payStatus,
                studentGroup: studentGroup,
                tuitionPlanId: tuitionPlanId,
            },
        });
        this.setState({
            previewVisible: true,
        });
    };

    // 关闭预览
    handlePreviewCancel = () => {
        this.setState({
            previewVisible: false,
        });
    };

    // 合并单元格
    renderContent = (key, text, record) => {
        const { useWallet } = this.state;
        if (key == 'name') {
            var obj = {
                children: (
                    <>
                        <p>{text}</p>
                        {record && record.discountType ? (
                            <p className={styles.discountType}>{record.discountType}</p>
                        ) : (
                            ''
                        )}
                    </>
                ),
                props: {},
            };
        } else if (key == 'actualPrice') {
            var obj = {
                children: useWallet ? (
                    <>
                        <p>实付款{record && record.realPayAmount ? record.realPayAmount : null}</p>
                        <p>
                            余额抵扣
                            {record && record.deductionAmount ? record.deductionAmount : null}
                        </p>
                    </>
                ) : (
                    <p>实付款{record && record.realPayAmount ? record.realPayAmount : null}</p>
                ),
                props: {},
            };
        } else {
            var obj = {
                children: text,
                props: {},
            };
        }
        const len = record && record.length; // 要合并的行数
        if (mergeLength[key] == len - 1 && mergeLength[key] == 0) {
            // 只有一行不需要合并时，rowspan为1
            obj.props.rowSpan = len;
        } else if (mergeLength[key] == len - 1) {
            // 合并到最后一行
            mergeLength[key] = 0;
            obj.props.rowSpan = 0;
        } else if (mergeLength[key] == 0) {
            mergeLength[key]++;
            obj.props.rowSpan = len;
        } else {
            mergeLength[key]++;
            obj.props.rowSpan = 0;
        }

        return obj;
    };

    // 选择全部数据
    // checkAllChange = (e) => {
    //     this.setState({
    //         checkAll:!this.state.checkAll
    //     },()=>{
    //         let data = [];
    //         if (this.state.checkAll ) {
    //             this.judgePaymentType(e)
    //             data = this.state.data.map((item)=>{
    //                 item.checkStatus = true
    //                 return item
    //             })
    //         }else{
    //             data = this.state.data.map((item)=>{
    //                 item.checkStatus = false
    //                 return item
    //             })
    //             this.setState({
    //                 promptType:'',
    //                 isPromptSendDisabled:true
    //             })
    //         }
    //         this.setState({
    //             data,
    //         })
    //     })
    // }

    // 选择某一项
    selectCheckboxChange = (index, orderNo, e) => {
        const data = [...this.state.data];
        const orderNoList = [...this.state.orderNoList];
        data[index].checkStatus = e.target.checked;
        if (data[index].checkStatus) {
            orderNoList.push(orderNo);
        } else {
            var index = orderNoList.indexOf(orderNo);
            if (index > -1) {
                orderNoList.splice(index, 1);
            }
        }
        this.setState(
            {
                data,
                orderNoList,
            },
            () => {
                if (this.state.orderNoList && this.state.orderNoList.length) {
                    this.judgePaymentType(2);
                } else {
                    this.setState({
                        isPromptSendDisabled: true,
                    });
                }
            }
        );
    };

    // 选择本页数据
    // checkPageChange = (e,page) => {
    //     const { checkPageList } = this.state;
    //     checkPageList[page] = !checkPageList[page];
    //     console.log( checkPageList, page, 'list&page' )
    //     this.setState({
    //         checkPage:!this.state.checkPage,
    //         checkPageList,
    //     },()=>{
    //         let data = [];
    //         let orderNoList = [];
    //         console.log(this.state.orderNoList,'......orderNoList........')
    //         if (this.state.checkPageList[page]) {
    //             this.judgePaymentType(e)
    //             data = this.state.data.map((item)=>{
    //                 orderNoList.push(item.orderNo)
    //                 item.checkStatus = true; // 选项选中
    //                 return item
    //             })

    //         }else{
    //             // 取消本页数据选择
    //             data = this.state.data.map((item)=>{
    //                 item.checkStatus = false;
    //                 orderNoList=[];
    //                 return item
    //             })
    //             // 取消本页数据选择，并且没有单独勾选项，一键催缴按钮禁选
    //             if (!(this.state.orderNoList && this.state.orderNoList.length)) {
    //                 this.setState({
    //                     isPromptSendDisabled:true
    //                 })
    //             }
    //             // 取消本页勾选，type值清空
    //             this.setState({
    //                 promptType:''
    //             })
    //         }
    //         console.log(orderNoList,'orderNoListorderNoListorderNoList')
    //         this.setState({
    //             data,
    //             orderNoList:[...this.unique(orderNoList),...this.state.orderNoList]
    //         },()=>{
    //             console.log(orderNoList,'this.state,orderNoList......')
    //         })
    //     })
    // }

    // 根据选择的是本页还是全部，传参不同
    // 判断可催缴个数
    judgePaymentType = (e) => {
        const {
            orderNoList,
            tuitionPlanId,
            studentGroup,
            payStatus,
            messageStatus,
            keyValue,
            discountType,
        } = this.state;
        const { dispatch } = this.props;
        return dispatch({
            type: 'pay/isPromptSendTuitionPlan',
            payload: {
                type: e || 1,
                tuitionPlanId,
                orderNoList,
                studentGroupId: studentGroup,
                messageStatus: messageStatus,
                payStatus: payStatus,
                keywords: keyValue,
                discountType,
            },
        }).then(() => {
            const { isPromptSendContent } = this.props;
            if (isPromptSendContent && isPromptSendContent.status) {
                let isPrompt = !(
                    isPromptSendContent.content && isPromptSendContent.content.isPromptSend
                );
                this.setState({
                    isPromptSendDisabled: isPrompt,
                });
            }
        });
    };

    showPromptModal = async (action) => {
        let { allowValue } = this.state;

        let modalTitle = '';
        let modalText = '';
        let modalConfirmText = '';
        if (action == 'prompt') {
            await this.judgePaymentType();
            let number =
                this.props.isPromptSendContent &&
                this.props.isPromptSendContent.content &&
                this.props.isPromptSendContent.content.total;
            modalTitle = trans('charge.isSendCallNotice', '您确定要发送催缴通知吗');
            modalText = trans(
                'charge.studentNum',
                '您已选择{$number}个需要催缴的学生，确定后系统将发送钉钉通知提醒孩子父母尽快缴费。',
                { number: number || 0 }
            );
            modalConfirmText = trans('charge.isCall', '确认催缴');
        } else if (action == 'delPlan') {
            modalTitle = trans('charge.isDeleteNotice', '您确定要删除通知吗');
            modalText = trans('charge.deletedStatus', '删除后，所有配置信息和关联人员将被清空');
            modalConfirmText = trans('charge.isdelete', '确认删除');
        } else if (action == 'send') {
            await this.getSendData();
            modalTitle = trans('charge.isSendNotice', '您确定要发送通知吗');
            let allowText = allowValue ? '允许使用学生账户余额抵扣' : '不允许使用学生账户余额抵扣';
            let totalNum =
                this.props.sendTuitionPlanCountMsg && this.props.sendTuitionPlanCountMsg.total;
            modalText = `该通知关联了${totalNum}个需要缴费的订单，设置了${allowText}，确认后系统将发送通知给孩子父母。发送后，缴费单及通知内容将不可修改和删除。`;
            modalConfirmText = trans('charge.isSending', '确认发送');
        }
        this.setState(
            {
                promptVisible: true,
                modalText,
                modalTitle,
                modalConfirmText,
            },
            () => {
                if (action == 'prompt' || action == 'delPlan') {
                    this.setState({
                        isSend: false,
                    });
                }
            }
        );
    };

    // 一键发送统计数据
    getSendData = () => {
        const { dispatch } = this.props;
        return dispatch({
            type: 'pay/sendTuitionPlanCount',
            payload: {
                tuitionPlanId: this.state.tuitionPlanId,
            },
        }).then(() => {
            if (
                this.props.sendTuitionPlanCountMsg &&
                this.props.sendTuitionPlanCountMsg.total == 0
            ) {
                this.setState({
                    isSend: true,
                });
            } else {
                this.setState({
                    isSend: false,
                });
            }
        });
    };

    // 一键发送
    sendNotice = () => {
        const { dispatch } = this.props;
        const { allowValue } = this.state;
        this.setState(
            {
                sendLoading: true,
            },
            () => {
                dispatch({
                    type: 'pay/sendTuitionPlan',
                    payload: {
                        tuitionPlanId: this.state.tuitionPlanId,
                        canUseWallet: typeof allowValue == 'undefined' ? false : allowValue,
                    },
                }).then(() => {
                    const { sendTuitionPlanMsg } = this.props;
                    if (sendTuitionPlanMsg && sendTuitionPlanMsg.status) {
                        message.success(sendTuitionPlanMsg.message);
                        this.getData();
                        this.judgePaymentType();
                        this.getStatus();
                        this.setState({
                            promptVisible: false,
                            useBalanceVisible: false,
                            allowValue: undefined,
                            sendLoading: false,
                            sendNoticeForYunguVisible: false,
                        });
                    }
                });
            }
        );
    };

    // 单项催缴传参处理
    dealOncePrompt = (record) => {
        const { tuitionPlanId, studentGroup, messageStatus, payStatus, keyValue } = this.state;
        const orderNoList = [record.orderNo];
        this.setState(
            {
                orderNoList,
            },
            () => {
                this.props
                    .dispatch({
                        type: 'pay/promptSendTuitionPlan',
                        payload: {
                            type: 2,
                            tuitionPlanId,
                            orderNoList: this.state.orderNoList,
                            studentGroupId: studentGroup,
                            messageStatus: messageStatus,
                            payStatus: payStatus,
                            keywords: keyValue,
                        },
                    })
                    .then(() => {
                        if (this.props.promptSendContent && this.props.promptSendContent.status) {
                            message.success(this.props.promptSendContent.message);
                            const data = this.state.data.map((item) => {
                                item.checkStatus = false;
                                return item;
                            });
                            this.setState(
                                {
                                    data,
                                    promptType: '',
                                    checkAll: false,
                                    checkPage: false,
                                },
                                () => {
                                    this.getData();
                                }
                            );
                        }
                    });
            }
        );
    };

    // 一键催缴
    sendPrompt = () => {
        const { dispatch } = this.props;
        const { tuitionPlanId, studentGroup, payStatus, messageStatus, keyValue } = this.state;
        this.setState(
            {
                sendLoading: true,
            },
            () => {
                dispatch({
                    type: 'pay/promptSendTuitionPlan',
                    payload: {
                        type: this.state.promptType || 1,
                        tuitionPlanId,
                        orderNoList: this.state.orderNoList,
                        studentGroupId: studentGroup,
                        messageStatus: messageStatus,
                        payStatus: payStatus,
                        keywords: keyValue,
                    },
                }).then(() => {
                    if (this.props.promptSendContent && this.props.promptSendContent.status) {
                        message.success(this.props.promptSendContent.message);
                        this.getData();
                        const { checkPageList } = this.state;
                        const data = this.state.data.map((item) => {
                            item.checkStatus = false;
                            return item;
                        });
                        for (let key in checkPageList) {
                            checkPageList[key] = false;
                        }
                        this.setState({
                            promptVisible: false,
                            checkAll: false,
                            checkPageList,
                            data,
                            promptType: '',
                            isPromptSendDisabled: false,
                            sendLoading: false,
                        });
                    }
                });
            }
        );
    };

    hideModal = () => {
        this.setState({
            promptVisible: false,
        });
    };

    hideYunguModal = () => {
        this.setState({
            sendNoticeForYunguVisible: false,
        });
    };

    // 二次确认根据不同操作请求不同接口
    modalConfirm = (e) => {
        if (e == trans('charge.isCall', '确认催缴')) {
            this.setState({
                isSend: false,
            });
            this.sendPrompt();
        } else if (e == trans('charge.isdelete', '确认删除')) {
            this.setState({
                isSend: false,
            });
            this.deletePlan();
        } else if (e == trans('charge.isSending', '确认发送')) {
            this.sendNotice();
        } else if (e == '直接发送') {
            this.sendNotice();
        }
    };

    // 删除订单
    deleteOrder = (record) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'pay/delTuitionOrder',
            payload: {
                orderNo: record.orderNo,
            },
        }).then(() => {
            const { delOrderMsg } = this.props;
            if (delOrderMsg && delOrderMsg.status) {
                this.getData();
                message.success(delOrderMsg.message);
            }
        });
    };

    refundOrder = (record) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'pay/refundTuitionOrderDone',
            payload: {
                orderNo: record && record.orderNo,
            },
            onSuccess: () => {
                this.getData();
            },
        });
    };

    // 删除通知
    deletePlan = (record) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'pay/delTuitionPlan',
            payload: {
                tuitionPlanId: this.state.tuitionPlanId,
            },
        }).then(() => {
            const { delNoticeMsg } = this.props;
            if (delNoticeMsg && delNoticeMsg.status) {
                message.success(delNoticeMsg.message);
                // this.props.changeStatus(1);
                window.location.href = '/#/charge/index';
            }
        });
    };

    showTimeModal = (record) => {
        const { dataStatistics } = this.state;
        this.setState({
            timeVisible: true,
            timeValue:
                (dataStatistics &&
                    dataStatistics.deadline &&
                    dataStatistics.deadline.substr(0, 10)) ||
                null,
            // planId:record.id,
        });
    };

    // 取消更改日期
    handleTimeCancel = () => {
        this.setState({
            timeVisible: false,
        });
    };

    // 修改日期提交
    confirmUpdateTime = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'pay/updateTuitionPlan',
            payload: {
                tuitionPlanId: this.state.tuitionPlanId,
                deadline: this.state.timeValue ? this.state.timeValue + ' 23:59:59' : '',
            },
        }).then(() => {
            const { editTimeMsg } = this.props;
            if (editTimeMsg.status) {
                message.success(editTimeMsg.message);
                this.getData();
                this.judgePaymentType();
                const dataStatistics = this.state.dataStatistics;
                dataStatistics.deadline = this.state.timeValue;
                this.setState({
                    timeVisible: false,
                    // dataStatistics
                });
            }
        });
    };

    timeChange = (data, dataString) => {
        this.setState({
            timeValue: dataString,
        });
    };

    priceIptValue = (e, index, length, type) => {
        const { iptFrame } = this.state;
        if (type == 'price') {
            iptFrame[index].price = e.target.value;
        } else if (type == 'quantity') {
            iptFrame[index].quantity = Number(e.target.value);
        } else if (type == 'discount') {
            iptFrame[index].discount = e.target.value;
        } else if (type == 'duePrice') {
            iptFrame[index].duePrice = e.target.value;
        }
    };

    // 关闭订单：打开订单弹窗打开
    handleCloseOrder = (record) => {
        this.setState({
            isOpen: true,
            record: record,
            orderPrice: record.orderPrice,
            orderNo: record.orderNo,
        });
    };

    // 关闭弹窗，2确定关闭后关闭弹窗,列表更新，1弹窗关闭
    handleOpen = (value) => {
        if (value == 1) {
            this.setState({
                isOpen: false,
            });
        } else if (value == 2) {
            this.judgePaymentType();
            this.getData();
            this.getStatus();
            this.setState({
                isOpen: false,
            });
        }
    };

    closeDrawer = () => {
        this.setState({
            isViewDetail: false,
        });
    };

    // 获取商户
    getBusiAndChannel = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'account/queryBusiAndChannel',
            payload: {},
        }).then(() => {
            const { busiAndChannelList } = this.props;
            this.setState({
                channelList: busiAndChannelList.payFundChannelsList,
            });
        });
    };

    // 导出
    importTable = () => {
        const {
            tuitionPlanId,
            studentGroup,
            messageStatus,
            payStatus,
            keyValue,
            page,
            pageSize,
            promptType,
            channelId,
        } = this.state;

        window.open(
            `/api/pay/exportTuitionOrderDetail?tuitionPlanId=${tuitionPlanId}&pageNum=${page}&pageSize=${pageSize}&studentGroup=${
                studentGroup ? studentGroup : ''
            }&messageStatus=${messageStatus ? messageStatus : ''}&payStatus=${
                payStatus ? payStatus : ''
            }&ifOfflineTransfer=${channelId ? channelId : ''}&matchName=${keyValue}&exportStatus=${
                promptType || 1
            }`
        );
    };

    // 查看详情
    viewDetail = (record) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'pay/getAccountOderDetail',
            payload: {
                orderNo: record.orderNo,
                tuitionPlanId: this.state.tuitionPlanId,
            },
        }).then(() => {
            this.setState({
                isViewDetail: true,
                orderDetailContent: this.props.orderDetailContent,
            });
        });
    };

    arrayMap = (arr, key) => {
        let len = (arr && arr.length) || 0;
        for (let i = 0; i < len; i++) {
            if (arr[i].userId == key) {
                return arr[i];
            }
        }
    };

    handleEdit = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'pay/getUpdatePayTuitionPlanDetail',
            payload: {
                tuitionPlanId: this.state.tuitionPlanId,
            },
        }).then(() => {
            this.setState({
                editVisible: true,
                isEdit: true,
            });
        });
    };

    handleCancel = () => {
        this.setState(
            {
                editVisible: false,
            },
            () => {
                this.getData();
                this.getStatus();
            }
        );
    };

    oneClickPayment = (value) => {
        this.setState(
            {
                campusId: value.campusId,
            },
            () => {
                const { dispatch } = this.props;
                dispatch({
                    type: 'pay/sendPayTuitionToPersonal',
                    payload: {
                        tuitionPlanId: this.state.id,
                        tuitionNo: value.orderNo,
                    },
                }).then(() => {
                    this.getData();
                });
            }
        );
    };

    replaceUrlArg = (url, arg, argVal) => {
        const urlObj = new URL(url);
        console.log('urlObj', urlObj);
        urlObj.searchParams.set(arg, argVal);
        return urlObj.href;
    };

    replaceParamVal = (paramName, replaceWith) => {
        var oUrl = window.location.href.toString();
        var re = eval('/(' + paramName + '=)([^&]*)/gi');
        var nUrl = oUrl.replace(re, paramName + '=' + replaceWith);
        // window.location = nUrl;
        window.location.replace(nUrl);
        // window.location.href=nUrl
    };

    closeEdit = (e, planId, bol) => {
        if (e === 1 || e === 2) {
            this.setState(
                {
                    editVisible: false,
                    isEdit: false,
                    tuitionPlanId: planId,
                },
                () => {
                    this.getData();
                    this.getStatus();
                }
            );
        } else if (e === 3) {
            this.setState({
                editVisible: true,
            });
        }
        // let urlObj = new URL(window.location.href);
        let urlValue = getUrlSearch('payPlanId');
        if (urlValue) {
            // this.replaceUrlArg(window.location.href,'payPlanId',planId)
            this.replaceParamVal('payPlanId', planId);
        } /* else{
            // this.replaceUrlArg(window.location.href,'planId',planId)
            if(bol == true){
                window.location.reload()
            }else{
                this.replaceParamVal('planId',planId)
            }
        } */
        // debugger
        if (bol == true) {
            window.location.reload();
        } else {
            this.replaceParamVal('planId', planId);
        }
        // console.log('search', urlObj.search)
        // window.open(`#/address/detail?planId=${planId}`,'_self')
    };

    disabledDate = (current) => {
        return current && current < moment(new Date()).subtract(1, 'days');
    };

    //编辑
    edit(key) {
        let iptFrame = [];
        for (let index = 1; index <= key.length; index++) {
            iptFrame.push({
                payChargeItemId: Number(
                    key.payChargeItemDetailModelList[index - 1].payChargeItemId
                ),
                price: key.payChargeItemDetailModelList[index - 1].price,
                quantity: key.payChargeItemDetailModelList[index - 1].quantity,
                discount: key.payChargeItemDetailModelList[index - 1].discount,
            });
        }
        this.setState({
            priceIptVisible: true,
            priceValue: key,
            iptFrame: iptFrame,
        });
    }
    priceCancel = () => {
        this.setState({
            priceIptVisible: false,
        });
    };
    priceOk = () => {
        // const { priceRecord } = this.state
        const { dispatch } = this.props;
        dispatch({
            type: 'pay/geteditDetail',
            payload: this.state.iptFrame,
            onSuccess: () => {
                this.setState({
                    priceIptVisible: false,
                });
                this.setState({
                    iptFrame: [],
                });
                this.getData();
            },
        }).then(() => {});
    };

    delProject = (index) => {
        if (isEmpty(this.state.iptFrame)) {
            return;
        }
        let tempArr = this.state.iptFrame ? JSON.parse(JSON.stringify(this.state.iptFrame)) : [];
        let tempPriceValue = JSON.parse(JSON.stringify(this.state.priceValue));
        tempArr.splice(index, 1);
        tempPriceValue.payChargeItemDetailModelList.splice(index, 1);
        this.setState({
            iptFrame: tempArr,
            priceValue: tempPriceValue,
        });
    };

    //编辑modal框回显
    revisePrice = (record) => {
        this.setState({
            priceRecord: record,
        });
        return (
            record &&
            record.payChargeItemDetailModelList.map((item, index) => {
                return (
                    <div className={styles.modalList}>
                        <div style={{ marginBottom: '10px' }}>
                            {trans('charge.items', '收费项目')}
                            {item.payChargeItemName}：
                        </div>
                        <div style={{ marginLeft: '25px' }}>
                            {trans('charge.price', '价格：')}
                            <Input
                                placeholder={item.price}
                                className={styles.priceIpt}
                                onChange={(e) =>
                                    this.priceIptValue(e, index, record.length, 'price')
                                }
                            />
                            {trans('charge.number', '数目：')}
                            <Input
                                placeholder={item.quantity}
                                className={styles.priceIpt}
                                onChange={(e) =>
                                    this.priceIptValue(e, index, record.length, 'quantity')
                                }
                            />
                            {trans('charge.discount', '折扣：')}
                            <Input
                                placeholder={item.discount}
                                className={styles.priceIpt}
                                onChange={(e) =>
                                    this.priceIptValue(e, index, record.length, 'discount')
                                }
                            />
                            {record.payChargeItemDetailModelList.length > 1 ? (
                                <span
                                    style={{ marginLeft: 10, color: 'blue', cursor: 'pointer' }}
                                    onClick={() => this.delProject(index)}
                                >
                                    删除
                                </span>
                            ) : null}
                        </div>
                    </div>
                );
            })
        );
    };

    isAllowBalance = () => {
        const { currentUser } = this.props;
        if (currentUser && currentUser.schoolId && currentUser.schoolId == 1) {
            this.getSendData().then(() => {
                this.setState({
                    sendNoticeForYunguVisible: true, // 一键发送通知，云谷不需要余额抵扣，直接modal确认是否发送
                });
            });
        } else {
            this.setState({
                useBalanceVisible: true,
            });
        }
    };

    changeIsAllow = (e) => {
        this.setState({
            allowValue: e.target.value,
        });
    };

    cancelSend = () => {
        this.setState({
            allowValue: undefined,
            useBalanceVisible: false,
        });
    };

    jumpToSec = () => {
        let { allowValue } = this.state;
        if (allowValue === undefined) {
            message.warning('请选择是否允许使用学生账户余额抵扣！');
            return false;
        }
        this.showPromptModal('send');
    };

    render() {
        const { updatePlanList, detailStatusList, previewContent } = this.props;
        const {
            isEdit,
            editVisible,
            orderDetailContent,
            isViewDetail,
            orderNo,
            orderPrice,
            isOpen,
            timeVisible,
            modalConfirmText,
            isPromptSendDisabled,
            modalTitle,
            modalText,
            previewVisible,
            dataStatistics,
            data,
            messageStatus,
            payStatus,
            page,
            pageSize,
            total,
            timeValue,
            isSend,
            sendLoading,
            paidInTotal,
            deductionAmount,
            outstandingAmout,
            accountsReceivableAmount,
            channelList,
            priceIptVisible,
            tuitionPlanId,
            isTeacherChildren,
            record,
            refundTotal,
            onlyRefunded,
            useBalanceVisible,
            allowValue,
            useWallet,
            sendNoticeForYunguVisible,
        } = this.state;

        const columns = [
            {
                title: trans('mobile.name', '姓名'),
                dataIndex: 'name',
                key: 'name',
                render: this.renderContent.bind(this, 'name'),
            },
            {
                title: trans('student.administrativeClassShow', '行政班'),
                dataIndex: 'group',
                key: 'group',
                render: this.renderContent.bind(this, 'group'),
            },
            {
                title: trans('charge.chargeName', '收费名称'),
                dataIndex: 'payOrderName',
                key: 'payOrderName',
            },
            {
                title: trans('charge.items', '收费项目'),
                dataIndex: 'chargePro',
                key: 'chargePro',
                width: 230,
                render: (text, record) => {
                    return (
                        <span>
                            {record.chargePro}
                            {record.tags == 1 ? (
                                <span className={styles.tags}>
                                    {trans('charge.escrowFee', '代管费')}
                                </span>
                            ) : null}
                            {record.payOrderName ? `-${record.payOrderName}` : ''}
                        </span>
                    );
                },
            },

            {
                title:
                    (dataStatistics && dataStatistics.tuitionPlanType) ||
                    (dataStatistics && dataStatistics.tuitionPlanType == 1)
                        ? trans('charge.Payable', '应交金额')
                        : trans('charge.money', '金额'),
                dataIndex: 'price',
                key: 'price',
                editable: true,
            },
            {
                title: trans('charge.noticeStatus', '通知状态'),
                dataIndex: 'noticeStatus',
                key: 'noticeStatus',
                render: (text, record) => {
                    const obj = this.renderContent('noticeStatus', '', record);
                    obj.children =
                        record.noticeStatus == 1 ? (
                            <span>{trans('charge.Unsent', '未发送')}</span>
                        ) : record.noticeStatus == 2 ? (
                            <span>{trans('charge.has_been_sent', '已发送')}</span>
                        ) : record.noticeStatus == 3 ? (
                            <span>{trans('charge.sendStatus1', '发送失败')}</span>
                        ) : record.noticeStatus == 4 ? (
                            <span>{trans('charge.sendStatus2', '已催缴')}</span>
                        ) : record.noticeStatus == 5 ? (
                            <span>{trans('charge.sendStatus3', '催缴失败')}</span>
                        ) : (
                            <span>-</span>
                        );
                    return obj;
                },
            },
            {
                title: trans('charge.payStatus4', '缴费状态'),
                dataIndex: 'payStatus',
                key: 'payStatus',
                render: (text, record) => {
                    const obj = this.renderContent('payStatus', '', record);
                    obj.children =
                        record.payStatus == 1 ? (
                            <span style={{ color: '#E9B635' }}>
                                {trans('pay.payNot', '未缴费')}
                            </span>
                        ) : record.payStatus == 2 ? (
                            <span style={{ color: '#E9B635' }}>
                                {trans('pay.partPay', '部分缴费')}
                            </span>
                        ) : record.payStatus == 3 ? (
                            <span>
                                {trans('pay.payed', '已缴清')}{' '}
                                {record.ifClose && (
                                    <span className={styles.close}>
                                        {trans('charge.shutdown', '手动关闭')}
                                    </span>
                                )}{' '}
                            </span>
                        ) : record.payStatus == 4 ? (
                            <span>{trans('charge.closed', '已关闭')}</span>
                        ) : record.payStatus == 5 ? (
                            <span>
                                {trans('charge.Unrefunded', '待退款')}：{record.refundAmount}
                            </span>
                        ) : record.payStatus == 6 ? (
                            <span>
                                {trans('charge.Refunded', '已退款')}：{record.refundAmount}
                            </span>
                        ) : (
                            <span></span>
                        );
                    return obj;
                },
            },
            {
                title: trans('charge.orderPrice', '订单金额'),
                dataIndex: 'orderPrice',
                key: 'orderPrice',
                render: this.renderContent.bind(this, 'orderPrice'),
            },
            {
                title: trans('charge.actualPrice', '实收金额'),
                dataIndex: 'actualPrice',
                key: 'actualPrice',
                render: this.renderContent.bind(this, 'actualPrice'),
            },
            {
                title: trans('charge.priceChange', '欠缴余额'),
                dataIndex: 'priceChange',
                key: 'priceChange',
                render: this.renderContent.bind(this, 'priceChange'),
            },
            {
                title: trans('charge.operate', '操作'),
                dataIndex: 'action',
                key: 'action',
                render: (text, record, index) => {
                    const obj = this.renderContent('action', '', record);
                    const { tableList } = this.state;
                    obj.children =
                        (dataStatistics && dataStatistics.submitStatus === 2) ||
                        record.noticeStatus == 2 ||
                        record.noticeStatus == 4 ? (
                            <span>
                                {/* <a onClick={this.viewDetail.bind(this,this.arrayMap(tableList,record.rowKey))}>详情</a> */}
                                <a
                                    onClick={this.viewDetail.bind(this, record)}
                                    style={{ marginRight: '16px' }}
                                >
                                    {trans('student.detail', '详情')}
                                </a>
                                {record.payStatus == 5 ? (
                                    <Popconfirm
                                        title={trans(
                                            'charge.isRefundOrder',
                                            '确定已经完成需退款金额的转账打款吗？'
                                        )}
                                        onConfirm={this.refundOrder.bind(this, record)}
                                        okText={trans('charge.confirm', '确认')}
                                        cancelText={trans('charge.cancel', '取消')}
                                    >
                                        <a style={{ marginRight: '16px' }}>
                                            {trans('charge.transferedOrdered', '已打款')}
                                        </a>
                                    </Popconfirm>
                                ) : null}
                                {record.noticeStatus == 1 ? (
                                    <Popconfirm
                                        title={trans('charge.isPayment', '确定发送吗?')}
                                        onConfirm={this.oneClickPayment.bind(this, record)}
                                        okText={trans('charge.confirm', '确认')}
                                        cancelText={trans('charge.cancel', '取消')}
                                    >
                                        <a>{trans('charge.send', '发送')}</a>
                                    </Popconfirm>
                                ) : null}
                                {dataStatistics &&
                                dataStatistics.submitStatus === 2 &&
                                (record.payStatus == 2 || record.payStatus == 1) ? (
                                    <span>
                                        <Divider type="vertical" />
                                        <Popconfirm
                                            title={trans(
                                                'charge.isdealOncePrompt',
                                                '确定催缴该订单吗？'
                                            )}
                                            onConfirm={this.dealOncePrompt.bind(this, record)}
                                            okText={trans('charge.confirm', '确认')}
                                            cancelText={trans('charge.cancel', '取消')}
                                        >
                                            <a>{trans('charge.call', '催缴')}</a>
                                        </Popconfirm>
                                    </span>
                                ) : null}
                                {record.payStatus == 3 || record.payStatus == 4 ? null : (
                                    <span>
                                        <Divider type="vertical" />
                                        <a onClick={this.handleCloseOrder.bind(this, record)}>
                                            {trans('charge.closeOrder', '关闭订单')}
                                        </a>
                                    </span>
                                )}
                            </span>
                        ) : (
                            <span>
                                <a
                                    onClick={this.viewDetail.bind(this, record)}
                                    style={{ marginRight: '16px' }}
                                >
                                    {trans('student.detail', '详情')}
                                </a>
                                {record.payStatus == 5 ? (
                                    <Popconfirm
                                        title={trans(
                                            'charge.isRefundOrder',
                                            '确定已经完成需退款金额的转账打款吗？'
                                        )}
                                        onConfirm={this.refundOrder.bind(this, record)}
                                        okText={trans('charge.confirm', '确认')}
                                        cancelText={trans('charge.cancel', '取消')}
                                    >
                                        <a style={{ marginRight: '16px' }}>
                                            {trans('charge.transferedOrdered', '已打款')}
                                        </a>
                                    </Popconfirm>
                                ) : null}
                                <Popconfirm
                                    title={trans('charge.isDeleteOrder', '确定删除该订单吗？')}
                                    onConfirm={this.deleteOrder.bind(this, record)}
                                    okText={trans('charge.confirm', '确认')}
                                    cancelText={trans('charge.cancel', '取消')}
                                >
                                    <a style={{ marginRight: '16px' }}>
                                        {trans('charge.delete', '删除')}
                                    </a>
                                </Popconfirm>
                                <a
                                    onClick={() => this.edit(record)}
                                    style={{ marginRight: '16px' }}
                                >
                                    {trans('charge.edit', '编辑')}
                                </a>
                                {record.noticeStatus == 1 ? (
                                    <Popconfirm
                                        title={trans('charge.isPayment', '确定发送吗?')}
                                        onConfirm={this.oneClickPayment.bind(this, record)}
                                        okText={trans('charge.confirm', '确认')}
                                        cancelText={trans('charge.cancel', '取消')}
                                    >
                                        <a>{trans('charge.send', '发送')}</a>
                                    </Popconfirm>
                                ) : null}
                                {record.payStatus == 3 || record.payStatus == 4 ? null : (
                                    <span>
                                        <Divider type="vertical" />
                                        <a onClick={this.handleCloseOrder.bind(this, record)}>
                                            {trans('charge.closeOrder', '关闭订单')}
                                        </a>
                                    </span>
                                )}
                            </span>
                        );

                    return obj;
                },
            },
        ];
        const payOrderName = [
            {
                title: trans('mobile.name', '姓名'),
                dataIndex: 'name',
                key: 'name',
                render: this.renderContent.bind(this, 'name'),
            },
            {
                title: trans('student.administrativeClassShow', '行政班'),
                dataIndex: 'group',
                key: 'group',
                render: this.renderContent.bind(this, 'group'),
            },
            {
                title: trans('charge.items', '收费项目'),
                dataIndex: 'chargePro',
                key: 'chargePro',
                width: 230,
                render: (text, record) => {
                    return (
                        <span>
                            {record.chargePro}
                            {record.tags == 1 ? (
                                <span className={styles.tags}>
                                    {trans('charge.escrowFee', '代管费')}
                                </span>
                            ) : null}
                            {record.payOrderName ? `-${record.payOrderName}` : ''}
                        </span>
                    );
                },
            },

            {
                title:
                    (dataStatistics && dataStatistics.tuitionPlanType) ||
                    (dataStatistics && dataStatistics.tuitionPlanType == 1)
                        ? trans('charge.Payable', '应交金额')
                        : trans('charge.money', '金额'),
                dataIndex: 'price',
                key: 'price',
                editable: true,
            },
            {
                title: trans('charge.noticeStatus', '通知状态'),
                dataIndex: 'noticeStatus',
                key: 'noticeStatus',
                render: (text, record) => {
                    const obj = this.renderContent('noticeStatus', '', record);
                    obj.children =
                        record.noticeStatus == 1 ? (
                            <span>{trans('charge.Unsent', '未发送')}</span>
                        ) : record.noticeStatus == 2 ? (
                            <span>{trans('charge.has_been_sent', '已发送')}</span>
                        ) : record.noticeStatus == 3 ? (
                            <span>{trans('charge.sendStatus1', '发送失败')}</span>
                        ) : record.noticeStatus == 4 ? (
                            <span>{trans('charge.sendStatus2', '已催缴')}</span>
                        ) : record.noticeStatus == 5 ? (
                            <span>{trans('charge.sendStatus3', '催缴失败')}</span>
                        ) : (
                            <span>-</span>
                        );
                    return obj;
                },
            },
            {
                title: trans('charge.payStatus4', '缴费状态'),
                dataIndex: 'payStatus',
                key: 'payStatus',
                render: (text, record) => {
                    const obj = this.renderContent('payStatus', '', record);
                    obj.children =
                        record.payStatus == 1 ? (
                            <span style={{ color: '#E9B635' }}>
                                {trans('pay.payNot', '未缴费')}
                            </span>
                        ) : record.payStatus == 2 ? (
                            <span style={{ color: '#E9B635' }}>
                                {trans('pay.partPay', '部分缴费')}
                            </span>
                        ) : record.payStatus == 3 ? (
                            <span>
                                {trans('pay.payed', '已缴清')}{' '}
                                {record.ifClose && (
                                    <span className={styles.close}>
                                        {trans('charge.shutdown', '手动关闭')}
                                    </span>
                                )}{' '}
                            </span>
                        ) : record.payStatus == 4 ? (
                            <span>{trans('charge.closed', '已关闭')}</span>
                        ) : record.payStatus == 5 ? (
                            <span>
                                {trans('charge.Unrefunded', '待退款')}：{record.refundAmount}
                            </span>
                        ) : record.payStatus == 6 ? (
                            <span>
                                {trans('charge.Refunded', '已退款')}：{record.refundAmount}
                            </span>
                        ) : (
                            <span></span>
                        );
                    return obj;
                },
                // this.renderContent.bind( this, 'payStatus' )
            },
            {
                title: trans('charge.orderPrice', '订单金额'),
                dataIndex: 'orderPrice',
                key: 'orderPrice',
                render: this.renderContent.bind(this, 'orderPrice'),
            },
            {
                title: trans('charge.actualPrice', '实收金额'),
                dataIndex: 'actualPrice',
                key: 'actualPrice',
                render: this.renderContent.bind(this, 'actualPrice'),
            },
            {
                title: trans('charge.priceChange', '欠缴余额'),
                dataIndex: 'priceChange',
                key: 'priceChange',
                render: this.renderContent.bind(this, 'priceChange'),
            },
            {
                title: trans('charge.operate', '操作'),
                dataIndex: 'action',
                key: 'action',
                render: (text, record, index) => {
                    const obj = this.renderContent('action', '', record);
                    const { tableList } = this.state;
                    obj.children =
                        (dataStatistics && dataStatistics.submitStatus === 2) ||
                        record.noticeStatus == 2 ||
                        record.noticeStatus == 4 ? (
                            <span>
                                {/* <a onClick={this.viewDetail.bind(this,this.arrayMap(tableList,record.rowKey))}>详情</a> */}
                                <a
                                    onClick={this.viewDetail.bind(this, record)}
                                    style={{ marginRight: '16px' }}
                                >
                                    {trans('student.detail', '详情')}
                                </a>
                                {record.payStatus == 5 ? (
                                    <Popconfirm
                                        title={trans(
                                            'charge.isRefundOrder',
                                            '确定已经完成需退款金额的转账打款吗？'
                                        )}
                                        onConfirm={this.refundOrder.bind(this, record)}
                                        okText={trans('charge.confirm', '确认')}
                                        cancelText={trans('charge.cancel', '取消')}
                                    >
                                        <a style={{ marginRight: '16px' }}>
                                            {trans('charge.transferedOrdered', '已打款')}
                                        </a>
                                    </Popconfirm>
                                ) : null}
                                {record.noticeStatus == 1 ? (
                                    <Popconfirm
                                        title={trans('charge.isPayment', '确定发送吗?')}
                                        onConfirm={this.oneClickPayment.bind(this, record)}
                                        okText={trans('charge.confirm', '确认')}
                                        cancelText={trans('charge.cancel', '取消')}
                                    >
                                        <a>{trans('charge.send', '发送')}</a>
                                    </Popconfirm>
                                ) : null}
                                {dataStatistics &&
                                dataStatistics.submitStatus === 2 &&
                                (record.payStatus == 2 || record.payStatus == 1) ? (
                                    <span>
                                        <Divider type="vertical" />
                                        <Popconfirm
                                            title={trans(
                                                'charge.isdealOncePrompt',
                                                '确定催缴该订单吗？'
                                            )}
                                            onConfirm={this.dealOncePrompt.bind(this, record)}
                                            okText={trans('charge.confirm', '确认')}
                                            cancelText={trans('charge.cancel', '取消')}
                                        >
                                            <a>{trans('charge.call', '催缴')}</a>
                                        </Popconfirm>
                                    </span>
                                ) : null}
                                {record.payStatus == 3 || record.payStatus == 4 ? null : (
                                    <span>
                                        <Divider type="vertical" />
                                        <a onClick={this.handleCloseOrder.bind(this, record)}>
                                            {trans('charge.closeOrder', '关闭订单')}
                                        </a>
                                    </span>
                                )}
                                {/* {record.payStatus == 5 ? (
                                    <Popconfirm
                                        title={trans(
                                            'charge.isRefundOrder',
                                            '确定已经完成需退款金额的转账打款吗？'
                                        )}
                                        onConfirm={this.refundOrder.bind(this, record)}
                                        okText={trans('charge.confirm', '确认')}
                                        cancelText={trans('charge.cancel', '取消')}
                                    >
                                        <a style={{ marginRight: '16px' }}>
                                            {trans('charge.transferedOrdered', '已打款')}
                                        </a>
                                    </Popconfirm>
                                ) : null} */}
                            </span>
                        ) : (
                            <span>
                                <a
                                    onClick={this.viewDetail.bind(this, record)}
                                    style={{ marginRight: '16px' }}
                                >
                                    {trans('student.detail', '详情')}
                                </a>
                                {record.payStatus == 5 ? (
                                    <Popconfirm
                                        title={trans(
                                            'charge.isRefundOrder',
                                            '确定已经完成需退款金额的转账打款吗？'
                                        )}
                                        onConfirm={this.refundOrder.bind(this, record)}
                                        okText={trans('charge.confirm', '确认')}
                                        cancelText={trans('charge.cancel', '取消')}
                                    >
                                        <a style={{ marginRight: '16px' }}>
                                            {trans('charge.transferedOrdered', '已打款')}
                                        </a>
                                    </Popconfirm>
                                ) : null}
                                <Popconfirm
                                    title={trans('charge.isDeleteOrder', '确定删除该订单吗？')}
                                    onConfirm={this.deleteOrder.bind(this, record)}
                                    okText={trans('charge.confirm', '确认')}
                                    cancelText={trans('charge.cancel', '取消')}
                                >
                                    <a style={{ marginRight: '16px' }}>
                                        {trans('charge.delete', '删除')}
                                    </a>
                                </Popconfirm>
                                <a
                                    onClick={() => this.edit(record)}
                                    style={{ marginRight: '16px' }}
                                >
                                    {trans('charge.edit', '编辑')}
                                </a>
                                {record.noticeStatus == 1 ? (
                                    <Popconfirm
                                        title={trans('charge.isPayment', '确定发送吗?')}
                                        onConfirm={this.oneClickPayment.bind(this, record)}
                                        okText={trans('charge.confirm', '确认')}
                                        cancelText={trans('charge.cancel', '取消')}
                                    >
                                        <a>{trans('charge.send', '发送')}</a>
                                    </Popconfirm>
                                ) : null}
                                {record.payStatus == 3 || record.payStatus == 4 ? null : (
                                    <span>
                                        <Divider type="vertical" />
                                        <a onClick={this.handleCloseOrder.bind(this, record)}>
                                            {trans('charge.closeOrder', '关闭订单')}
                                        </a>
                                    </span>
                                )}
                            </span>
                        );

                    return obj;
                },
            },
        ];
        // 未发送状态禁用催缴按钮
        let isDisabled = dataStatistics && dataStatistics.submitStatus === 1;
        // 已发送已截止状态禁用催缴按钮
        // || (dataStatistics.submitStatus ===2 && dataStatistics.endStatus ===2 ))
        return (
            <div className={styles.detail}>
                <div className={styles.head}>
                    <span className={styles.back} onClick={this.goBack}>
                        {/* <Icon type="left" /> */}
                    </span>
                    <span className={styles.title} title={dataStatistics && dataStatistics.zhName}>
                        {dataStatistics &&
                            dataStatistics.zhName &&
                            (dataStatistics.zhName.length > 30
                                ? dataStatistics.zhName.slice(0, 30) + '...'
                                : dataStatistics.zhName)}
                    </span>
                    {dataStatistics &&
                        (dataStatistics.submitStatus === 1 ? (
                            <span className={styles.status}>
                                {trans('charge.Unsent', '未发送')}
                            </span>
                        ) : dataStatistics.submitStatus === 2 ? (
                            <span className={styles.statusIng}>
                                {trans('charge.has_been_sent', '已发送')}
                            </span>
                        ) : (
                            <span className={styles.status}>{trans('charge.unknown', '未知')}</span>
                        ))}
                    {dataStatistics &&
                        (dataStatistics.endStatus === 1 ? (
                            <span className={styles.statusIng}>
                                {trans('charge.processing', '进行中')}
                            </span>
                        ) : dataStatistics.endStatus === 2 ? (
                            <span className={styles.status}>
                                {trans('charge.expired', '已截止')}
                            </span>
                        ) : (
                            <span className={styles.status}>{trans('charge.unknown', '未知')}</span>
                        ))}
                    <span className={styles.btnBox}>
                        <Button
                            type="default"
                            className={styles.default}
                            onClick={this.showTimeModal}
                        >
                            {trans('charge.changeDate', '更改日期')}
                        </Button>
                        <Button
                            type="default"
                            className={styles.default}
                            onClick={this.showPreview}
                        >
                            {trans('charge.previewNotification', '预览通知')}
                        </Button>
                        {dataStatistics && dataStatistics.submitStatus === 1 ? (
                            <span>
                                <Button
                                    type="default"
                                    className={styles.default}
                                    onClick={this.showPromptModal.bind(this, 'delPlan')}
                                >
                                    {trans('charge.delPlan', '删除通知')}
                                </Button>
                                {
                                    <Button
                                        type="default"
                                        className={styles.default}
                                        onClick={this.isAllowBalance}
                                    >
                                        {trans('charge.clickSend', '一键发送')}
                                    </Button>
                                }
                                <Button
                                    type="primary"
                                    className={styles.primary}
                                    onClick={this.handleEdit}
                                >
                                    {trans('charge.edit', '编辑')}
                                </Button>
                            </span>
                        ) : null}
                    </span>
                </div>
                <div className={styles.content}>
                    <Row className={styles.msgShow} gutter={[16, 10]}>
                        <Col span={8}>
                            <span className={styles.item}>{trans('charge.campus', '校区：')}</span>
                            {dataStatistics && dataStatistics.campusName}
                        </Col>
                        <Col span={8}>
                            <span className={styles.item}>{trans('charge.stage', '学段：')}</span>
                            {dataStatistics && dataStatistics.sectionName}
                        </Col>
                        <Col span={8}>
                            <span className={styles.item}>
                                {trans('charge.balanceDeduction', '学生账户余额抵扣：')}
                            </span>
                            {dataStatistics && dataStatistics?.canUseWallet ? '允许' : '不允许'}
                        </Col>
                        <Col span={8}>
                            <span className={styles.item}>
                                {trans('charge.endTime', '截至时间：')}
                            </span>
                            {dataStatistics && dataStatistics.deadline}
                        </Col>
                        <Col span={8}>
                            <span className={styles.item}>
                                {trans('charge.foundTime', '创建时间：')}
                            </span>
                            {dataStatistics && dataStatistics.gmtCreateTime}
                        </Col>
                        <Col span={8}>
                            <span className={styles.item}>
                                {trans('charge.endEditDate', '最后编辑时间：')}
                            </span>
                            {dataStatistics && dataStatistics.gmtModifiedTime}
                        </Col>
                        <Col span={8}>
                            <span className={styles.item}>
                                {trans('charge.endEditPerson', '最后编辑人：')}
                            </span>
                            {dataStatistics && dataStatistics.lastModifieName}
                        </Col>
                        <Col span={8}>
                            <span className={styles.item}>
                                {trans('charge.endSendTime', '最后发送时间：')}
                            </span>
                            {dataStatistics && dataStatistics.lastSenderDate}
                        </Col>
                        <Col span={8}>
                            <span className={styles.item}>
                                {trans('charge.endSendPerson', '发送人：')}
                            </span>
                            {dataStatistics && dataStatistics.lastSenderName}
                        </Col>
                        <Col span={8}>
                            <span className={styles.item}>
                                {trans('charge.receivable', '应收合计：')}
                            </span>
                            {accountsReceivableAmount && accountsReceivableAmount}
                            {trans('global.yuan', '元')}
                        </Col>
                        <Col span={8}>
                            <span className={styles.item}>
                                {trans('charge.netReceipts', '实收合计：')}
                            </span>
                            {paidInTotal && paidInTotal}
                            {trans('global.yuan', '元')}
                        </Col>
                        {dataStatistics?.canUseWallet ? (
                            <>
                                <Col span={8}>
                                    <span className={styles.item}>
                                        {trans('pay.balanceDeduting', '余额抵扣：')}
                                    </span>
                                    {deductionAmount && deductionAmount}
                                    {trans('global.yuan', '元')}
                                </Col>
                                <Col span={8}>
                                    <span className={styles.item}>
                                        {trans('charge.totalArrears', '欠缴合计：')}
                                    </span>
                                    {outstandingAmout && outstandingAmout}
                                    {trans('global.yuan', '元')}
                                </Col>
                            </>
                        ) : null}

                        <Col span={8}>
                            <span className={styles.item}>
                                {trans('charge.Total Refund', '退款合计：')}
                            </span>
                            {refundTotal && refundTotal}
                            {trans('global.yuan', '元')}
                        </Col>
                    </Row>
                    <div className={styles.table}>
                        <div className={styles.tableHead}>
                            <span className={styles.title}>
                                {trans('pay.title_detail', '缴费详情')}
                            </span>
                            {detailStatusList && detailStatusList.send ? (
                                <span
                                    className={styles.data}
                                    onClick={this.sendStatus.bind(
                                        this,
                                        detailStatusList.send.statusCode
                                    )}
                                    style={{
                                        color: `${
                                            messageStatus == detailStatusList.send.statusCode
                                                ? '#4d7fff'
                                                : ''
                                        }`,
                                    }}
                                >
                                    <span
                                        className={styles.number}
                                        style={{
                                            color: `${
                                                messageStatus == detailStatusList.send.statusCode
                                                    ? '#4d7fff'
                                                    : '#333'
                                            }`,
                                        }}
                                    >
                                        {detailStatusList.send.statusNum}
                                    </span>
                                    {detailStatusList.send.statusName}
                                </span>
                            ) : null}
                            {detailStatusList && detailStatusList.paymentCompleted ? (
                                <span
                                    className={styles.data}
                                    onClick={this.selectStatus.bind(
                                        this,
                                        detailStatusList.paymentCompleted.statusCode
                                    )}
                                    style={{
                                        color: `${
                                            payStatus ==
                                            detailStatusList.paymentCompleted.statusCode
                                                ? '#4d7fff'
                                                : ''
                                        }`,
                                    }}
                                >
                                    <span
                                        className={styles.number}
                                        style={{
                                            color: `${
                                                payStatus ==
                                                detailStatusList.paymentCompleted.statusCode
                                                    ? '#4d7fff'
                                                    : '#333'
                                            }`,
                                        }}
                                    >
                                        {detailStatusList.paymentCompleted.statusNum}
                                    </span>{' '}
                                    {detailStatusList.paymentCompleted.statusName}
                                </span>
                            ) : null}
                            {detailStatusList && detailStatusList.paymentNot ? (
                                <span
                                    className={styles.data}
                                    onClick={this.selectStatus.bind(
                                        this,
                                        detailStatusList.paymentNot.statusCode
                                    )}
                                    style={{
                                        color: `${
                                            payStatus == detailStatusList.paymentNot.statusCode
                                                ? '#4d7fff'
                                                : ''
                                        }`,
                                    }}
                                >
                                    <span
                                        className={styles.number}
                                        style={{
                                            color: `${
                                                payStatus == detailStatusList.paymentNot.statusCode
                                                    ? '#4d7fff'
                                                    : '#333'
                                            }`,
                                        }}
                                    >
                                        {detailStatusList.paymentNot.statusNum}
                                    </span>{' '}
                                    {detailStatusList.paymentNot.statusName}
                                </span>
                            ) : null}
                            {detailStatusList && detailStatusList.paymentClose ? (
                                <span
                                    className={styles.data}
                                    onClick={this.selectStatus.bind(
                                        this,
                                        detailStatusList.paymentClose.statusCode
                                    )}
                                    style={{
                                        color: `${
                                            payStatus == detailStatusList.paymentClose.statusCode
                                                ? '#4d7fff'
                                                : ''
                                        }`,
                                    }}
                                >
                                    <span
                                        className={styles.number}
                                        style={{
                                            color: `${
                                                payStatus ==
                                                detailStatusList.paymentClose.statusCode
                                                    ? '#4d7fff'
                                                    : '#333'
                                            }`,
                                        }}
                                    >
                                        {detailStatusList.paymentClose.statusNum}
                                    </span>{' '}
                                    {detailStatusList.paymentClose.statusName}
                                </span>
                            ) : null}
                            {detailStatusList && detailStatusList.discountType ? (
                                <span
                                    className={styles.data}
                                    onClick={this.selectStatus.bind(
                                        this,
                                        detailStatusList.discountType.statusCode
                                    )}
                                    style={{
                                        color: `${
                                            payStatus == detailStatusList.discountType.statusCode
                                                ? '#4d7fff'
                                                : ''
                                        }`,
                                    }}
                                >
                                    <span
                                        className={styles.number}
                                        style={{
                                            color: `${
                                                payStatus ==
                                                detailStatusList.discountType.statusCode
                                                    ? '#4d7fff'
                                                    : '#333'
                                            }`,
                                        }}
                                    >
                                        {detailStatusList.discountType.statusNum}
                                    </span>{' '}
                                    {detailStatusList.discountType.statusName}
                                </span>
                            ) : null}
                        </div>

                        <div className={styles.tableContent}>
                            <Form layout="inline">
                                <Form.Item label={trans('student.className', '班级')}>
                                    <Select
                                        style={{ width: '168px' }}
                                        placeholder={trans('global.allClasses', '全部班级')}
                                        size="large"
                                        onChange={this.selectGroupStatus}
                                    >
                                        <Option value={null} key={null}>
                                            {trans('global.allClasses', '全部班级')}
                                        </Option>
                                        {detailStatusList &&
                                            detailStatusList.studentGroup &&
                                            detailStatusList.studentGroup.map((item) => {
                                                return (
                                                    <Option value={item.groupId} key={item.groupId}>
                                                        {item.name}
                                                    </Option>
                                                );
                                            })}
                                    </Select>
                                </Form.Item>

                                <Form.Item label={trans('charge.noticeStatus', '通知状态')}>
                                    <Select
                                        style={{ width: '168px' }}
                                        placeholder={trans('global.all.status', '全部状态')}
                                        size="large"
                                        onChange={this.selectSubmitStatus}
                                    >
                                        <Option value={null} key={null}>
                                            {trans('global.all.status', '全部状态')}
                                        </Option>
                                        <Option value={1} key={1}>
                                            {trans('charge.Unsent', '未发送')}
                                        </Option>
                                        <Option value={2} key={2}>
                                            {trans('charge.has_been_sent', '已发送')}
                                        </Option>
                                        <Option value={3} key={3}>
                                            {trans('charge.sendStatus1', '发送失败')}
                                        </Option>
                                        <Option value={4} key={4}>
                                            {trans('charge.sendStatus2', '已催缴')}
                                        </Option>
                                        <Option value={5} key={5}>
                                            {trans('charge.sendStatus3', '催缴失败')}
                                        </Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item label={trans('charge.payStatus4', '缴费状态')}>
                                    <Select
                                        style={{ width: '168px' }}
                                        placeholder={trans('global.all.status', '全部状态')}
                                        size="large"
                                        onChange={this.selectPayStatus}
                                    >
                                        <Option value={null} key={null}>
                                            {trans('global.all.status', '全部状态')}
                                        </Option>
                                        <Option value={1} key={1}>
                                            {trans('pay.payNot', '未缴费')}
                                        </Option>
                                        <Option value={2} key={2}>
                                            {trans('pay.partPay', '部分缴费')}
                                        </Option>
                                        <Option value={3} key={3}>
                                            {trans('pay.payed', '已缴清')}
                                        </Option>
                                        <Option value={4} key={4}>
                                            {trans('pay.close', '已关闭')}
                                        </Option>
                                        <Option value={5} key={5}>
                                            {trans('charge.Unrefunded', '待退款')}
                                        </Option>
                                        <Option value={6} key={6}>
                                            {trans('charge.Refunded', '已退款')}
                                        </Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item label={trans('charge.payMode', '支付方式')}>
                                    <Select
                                        placeholder={trans('charge.payMode', '支付方式')}
                                        size="large"
                                        style={{ width: '168px' }}
                                        onChange={this.getCannelValue}
                                    >
                                        <Option value={0} key={0}>
                                            {trans('charge.payMode', '支付方式')}
                                        </Option>
                                        {/* {channelList &&
                                            channelList.length &&
                                            channelList.map((item, index) => {
                                                return (
                                                    <Option value={item.id} key={item.id}>
                                                        {item.channelName}
                                                    </Option>
                                                );
                                            })} */}
                                        <Option value={1} key={1}>
                                            支付宝
                                        </Option>
                                        <Option value={2} key={2}>
                                            网商
                                        </Option>
                                        <Option value={3} key={3}>
                                            线下缴费
                                        </Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item>
                                    <Input
                                        style={{ width: '280px' }}
                                        placeholder={trans(
                                            'charge.searchType',
                                            '请输入姓名/订单号搜索'
                                        )}
                                        size="large"
                                        onChange={this.searchKeyValue}
                                    />
                                </Form.Item>

                                <div className={styles.btn}>
                                    <Button
                                        type="default"
                                        className={styles.default}
                                        disabled={isDisabled || isPromptSendDisabled ? true : false}
                                        onClick={this.showPromptModal.bind(this, 'prompt')}
                                    >
                                        {trans('charge.oneClickCall', '一键催缴')}
                                    </Button>
                                    <Button
                                        type="primary"
                                        className={styles.primary}
                                        onClick={this.importTable}
                                    >
                                        {trans('global.Export', '导出')}
                                    </Button>
                                    <Checkbox
                                        onClick={this.teacherChildren}
                                        style={{ marginLeft: '20px' }}
                                    >
                                        {trans('charge.teacherChildren', '只看教职工子女')}
                                    </Checkbox>
                                    <Checkbox
                                        onClick={this.OnlyRefunded}
                                        style={{ marginLeft: '20px' }}
                                    >
                                        {trans('charge.Just look refund', '只看有退款')}
                                    </Checkbox>
                                    <a
                                        style={{ marginLeft: '10px' }}
                                        href={`/api/payTuition/getPayPlanStudentFeeDetail?planId=${tuitionPlanId}&studentType=${isTeacherChildren}`}
                                        target="_blank"
                                    >
                                        {trans('charge.downLoadBill', '下载对账单')}
                                    </a>
                                </div>
                            </Form>
                            <div className={styles.tableAndPage}>
                                <Table
                                    columns={
                                        data && data.length > 0 && data[0].payOrderName
                                            ? columns
                                            : payOrderName
                                    }
                                    dataSource={data}
                                    bordered
                                    pagination={false}
                                    className={styles.detailTable}
                                />
                                <Pagination
                                    total={total}
                                    showSizeChanger
                                    showQuickJumper
                                    style={{ float: 'right', margin: '20px 0' }}
                                    onChange={this.changePage}
                                    onShowSizeChange={this.onShowSizeChange}
                                    current={page}
                                    pageSize={pageSize}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {previewVisible && previewContent ? (
                    <Preview
                        previewCancel={this.handlePreviewCancel}
                        previewContent={previewContent}
                    />
                ) : null}
                <Modal visible={this.state.promptVisible} onCancel={this.hideModal} footer={null}>
                    <div className={styles.modal}>
                        <span className={styles.confirmTitle}>{modalTitle}</span>
                        <span className={styles.confirmText}>{modalText}</span>
                        <div style={{ marginTop: '10px', textAlign: 'center' }}>
                            <Button
                                type="default"
                                className={styles.default}
                                onClick={this.hideModal}
                            >
                                {trans('charge.cancel', '取消')}
                            </Button>
                            <Button
                                type="primary"
                                loading={sendLoading}
                                disabled={isSend}
                                className={styles.primary}
                                onClick={this.modalConfirm.bind(this, modalConfirmText)}
                            >
                                {modalConfirmText}
                            </Button>
                        </div>
                    </div>
                </Modal>

                <Modal
                    visible={this.state.sendNoticeForYunguVisible}
                    onCancel={this.hideYunguModal}
                    footer={null}
                >
                    <div className={styles.modal}>
                        <span className={styles.confirmTitle}>
                            {trans('charge.isSendNotice', '您确定要发送通知吗')}
                        </span>
                        <span
                            className={styles.confirmText}
                            style={{ textAlign: 'left' }}
                        >{`该通知关联了${
                            this.props.sendTuitionPlanCountMsg &&
                            this.props.sendTuitionPlanCountMsg.total
                                ? this.props.sendTuitionPlanCountMsg.total
                                : 0
                        }个需要缴费的订单，确认后系统将发送通知给孩子父母。发送后，缴费单及通知内容将不可修改和删除。`}</span>
                        <div style={{ marginTop: '10px', textAlign: 'center' }}>
                            <Button
                                type="default"
                                className={styles.default}
                                onClick={this.hideYunguModal}
                            >
                                {trans('charge.cancel', '取消')}
                            </Button>
                            <Button
                                type="primary"
                                loading={sendLoading}
                                disabled={isSend}
                                className={styles.primary}
                                onClick={this.modalConfirm.bind(this, '直接发送')}
                            >
                                {trans('charge.isSending', '确认发送')}
                            </Button>
                        </div>
                    </div>
                </Modal>

                <Modal
                    visible={timeVisible}
                    footer={null}
                    onCancel={this.handleTimeCancel}
                    destroyOnClose
                    className={styles.modalStyle}
                >
                    <div className={styles.editTime}>
                        <p className={styles.editTimeTitle}>
                            {trans('charge.changeDate', '更改日期')}
                        </p>
                        <div className={styles.edit}>
                            <span className={styles.label}>
                                {trans('charge.noticeTitle', '通知标题：')}
                            </span>
                            <span className={styles.title}>
                                {dataStatistics && dataStatistics.zhName}
                            </span>
                        </div>
                        <div className={styles.edit}>
                            <span className={styles.label}>
                                {trans('charge.endDates', '截至日期：')}
                            </span>
                            <span className={styles.timeInput}>
                                <DatePicker
                                    onChange={this.timeChange}
                                    defaultValue={timeValue ? moment(timeValue, dateFormat) : null}
                                    format={dateFormat}
                                    disabledDate={this.disabledDate}
                                />
                            </span>
                        </div>
                        <div className={styles.timeBtn}>
                            <Button className={styles.cancel} onClick={this.handleTimeCancel}>
                                {trans('charge.cancel', '取消')}
                            </Button>
                            <Button className={styles.confirm} onClick={this.confirmUpdateTime}>
                                {trans('global.confirmEdit', '确认修改')}
                            </Button>
                        </div>
                    </div>
                </Modal>
                {isOpen ? (
                    <CloseOrder
                        isOpen={isOpen}
                        handleOpen={this.handleOpen}
                        orderPrice={orderPrice}
                        orderNo={orderNo}
                        record={record}
                    />
                ) : null}

                {isViewDetail ? (
                    <OrderDetail
                        useWallet={useWallet}
                        isViewDetail={isViewDetail}
                        orderDetailContent={orderDetailContent}
                        closeDrawer={this.closeDrawer}
                    />
                ) : null}

                <Modal
                    visible={editVisible}
                    footer={null}
                    onCancel={this.handleCancel}
                    destroyOnClose
                    width="100%"
                    style={{ top: '0', width: '100%', height: '100vh' }}
                    className={styles.editPlan}
                >
                    <NewNoticePro
                        updatePlanList={updatePlanList}
                        isEdit={isEdit}
                        closeEdit={this.closeEdit}
                    />
                </Modal>
                <Modal
                    visible={priceIptVisible}
                    title={trans('charge.changeMoney', '修改金额')}
                    onOk={this.priceOk}
                    onCancel={this.priceCancel}
                    className={styles.priceClass}
                    destroyOnClose={true}
                    maskClosable={false}
                >
                    {this.revisePrice(this.state.priceValue)}
                </Modal>

                <Modal
                    title="发送通知"
                    visible={useBalanceVisible}
                    onCancel={this.cancelSend}
                    onOk={this.jumpToSec}
                    okText="确定发送"
                >
                    <div style={{ textAlign: 'center' }}>
                        <p>
                            <span style={{ color: 'red' }}>*</span>
                            是否允许使用学生账户余额抵扣
                        </p>
                        <Radio.Group onChange={this.changeIsAllow} value={allowValue}>
                            <Radio value={true}>允许</Radio>
                            <Radio value={false}>不允许</Radio>
                        </Radio.Group>
                    </div>
                </Modal>
            </div>
        );
    }
}
