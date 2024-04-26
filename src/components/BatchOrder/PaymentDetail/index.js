//club列表
import React, { PureComponent } from 'react';
import styles from './index.less';
import { Form, Select, Input, DatePicker, Table, Pagination, Button } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import OrderDetail from '../../PayNotice/orderDetail.js';
import { trans } from '../../../utils/i18n';

const dateFormat = 'YYYY-MM-DD';
const { Option } = Select;

@connect((state) => ({
    // accountList: state.account.accountList, //
    campusAndStage: state.pay.campusAndStage, // 查询年级和学段
    batchOrderQueryList: state.order.batchOrderQueryList, // 获取列表及表头相关信息
    orderDetailContent: state.pay.orderDetailContent, // 订单详情
    accountList: state.account.accountList, // 账户信息
    busiAndChannelList: state.account.busiAndChannelList, //
}))
export default class PaymentDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            pageSize: 10,
            total: 0,
            tableList: [], // 列表
            sumAmount: '', // 收入
            campueValue: '', // 切换校区value
            sectionValue: [], // 学段value
            payAccountValue: [], // 账户value
            deadlineBegin: '', // 起始时间value
            deadlineEnd: '', // 截至时间value
            orderNoType: 1, // 关键字查询选择不同订单类型value
            keyValue: '', // 关键字查询value
            isViewDetail: false, // 详情操作显示状态
            orderDetailContent: '', // 请求详情数据
            accountList: '', // 商户下拉菜单数据
            channelId: [], // 支付方式id
            channelList: [], // 支付方式
        };
    }

    componentDidMount() {
        this.getPayAccount();
        this.getCampusAndStage();
        this.getTableList();
        this.getBusiAndChannel();
    }

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

    // 获取校区学段
    getCampusAndStage = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'pay/selectTeachingOrgStage',
        });
    };

    // 获取账户
    getPayAccount = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'account/queryPayAccount',
            payload: {
                pageSize: 1000,
                pageNum: 1,
                queryAll: 1,
            },
        }).then(() => {
            this.setState({
                accountList: this.props.accountList.data,
                total: this.props.accountList.total,
            });
        });
    };

    // 获取列表
    getTableList = () => {
        const { dispatch } = this.props;
        const {
            keyValue,
            orderNoType,
            campueValue,
            sectionValue,
            payAccountValue,
            deadlineBegin,
            deadlineEnd,
            page,
            pageSize,
            channelId,
        } = this.state;
        console.log(channelId, 'channelId >>>');
        dispatch({
            type: 'order/batchOrderQuery',
            payload: {
                campusId: campueValue,
                sectionId: '', //学段
                sectionIdList: sectionValue, //学段
                startDate: deadlineBegin,
                endDate: deadlineEnd,
                stuName: orderNoType == 1 ? keyValue : '',
                tuitionOrderNo: orderNoType == 2 ? keyValue : '',
                channelTradeNo: orderNoType == 3 ? keyValue : '',
                batchOrderNo: orderNoType == 4 ? keyValue : '',
                pageNum: page,
                pageSize: pageSize,
                payType: '', //账户
                payTypeList: payAccountValue, //账户
                payStatus: '', //支付方式
                payStatusList: channelId, //支付方式
            },
        }).then(() => {
            const { batchOrderQueryList } = this.props;
            this.setState({
                tableList:
                    batchOrderQueryList &&
                    batchOrderQueryList.pagerResult &&
                    batchOrderQueryList.pagerResult.data,
                sumAmount: batchOrderQueryList && batchOrderQueryList.sumAmount,
                total:
                    batchOrderQueryList &&
                    batchOrderQueryList.pagerResult &&
                    batchOrderQueryList.pagerResult.total,
            });
        });
    };

    // 切换页面
    changePage = (page, pageSize) => {
        this.setState(
            {
                page,
            },
            () => {
                this.getTableList();
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
                this.getTableList();
            }
        );
    };

    getCampusValue = (value) => {
        this.setState(
            {
                campueValue: value ? value : '',
                page: 1,
            },
            () => {
                this.getTableList();
            }
        );
    };
    getPayAccountValue = (value) => {
        this.setState(
            {
                payAccountValue: value ? value : '',
                page: 1,
            },
            () => {
                this.getTableList();
            }
        );
    };
    getCannelValue = (value) => {
        this.setState(
            {
                channelId: value ? value : '',
            },
            () => {
                this.getTableList();
            }
        );
    };
    getSectionValue = (value) => {
        this.setState(
            {
                sectionValue: value ? value : '',
                page: 1,
            },
            () => {
                this.getTableList();
            }
        );
    };

    getDeadLineBegin = (data, dataString) => {
        this.setState(
            {
                deadlineBegin: dataString ? dataString + ' 00:00:00' : '',
                page: 1,
            },
            () => {
                this.getTableList();
            }
        );
    };

    getDeadLineEnd = (data, dataString) => {
        this.setState(
            {
                deadlineEnd: dataString ? dataString + ' 23:59:59' : '',
                page: 1,
            },
            () => {
                this.getTableList();
            }
        );
    };

    // 切换订单类型
    orderNoTypeChange = (value) => {
        this.setState(
            {
                orderNoType: value,
            },
            () => {
                this.getTableList();
            }
        );
    };

    getInputValue = (e) => {
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
                    this.getTableList();
                }, 800);
            }
        );
    };

    closeDrawer = () => {
        this.setState({
            isViewDetail: false,
        });
    };

    // 查看详情
    viewDetail = (record) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'pay/getAccountOderDetail',
            payload: {
                orderNo: record.tuitionOrderNo,
                tuitionPlanId: '',
            },
        }).then(() => {
            this.setState({
                isViewDetail: true,
                orderDetailContent: this.props.orderDetailContent,
            });
        });
    };

    // 导出
    exportBatch = () => {
        console.log('12');
        const {
            keyValue,
            orderNoType,
            channelId, //支付方式
            payAccountValue, //账户
            campueValue, //校区
            sectionValue, //学段
            deadlineBegin,
            deadlineEnd,

            page,
            pageSize,
        } = this.state;
        window.open(
            `/api/batchOrder/exportBatchOrder?campusId=${campueValue}&sectionId=${sectionValue}&startDate=${deadlineBegin}&endDate=${deadlineEnd}&tuitionOrderNo=${
                orderNoType == 1 ? keyValue : ''
            }&channelTradeNo=${orderNoType == 2 ? keyValue : ''}&batchOrderNo=${
                orderNoType == 3 ? keyValue : ''
            }&payStatusList=${channelId}&payTypeList=${payAccountValue}`
        );
    };

    render() {
        const { campusAndStage } = this.props;
        const {
            page,
            pageSize,
            total,
            tableList,
            sumAmount,
            isViewDetail,
            orderDetailContent,
            accountList,
            orderNoType,
            channelList,
        } = this.state;
        const columns = [
            {
                title: trans('charge.account', '账户'),
                dataIndex: 'account',
                key: 'account',
                width: 100,
                // fixed: 'left',
            },
            {
                title: trans('mobile.name', '姓名'),
                dataIndex: 'name',
                width: 130,
                key: 'name',
            },
            {
                title: trans('charge.payMode', '支付方式'),
                dataIndex: 'payway',
                key: 'payway',
                width: 80,
            },
            {
                title: trans('charge.trade', '交易金额'),
                dataIndex: 'trade',
                key: 'trade',
                width: 120,
            },
            {
                title: trans('charge.orderNo1', '订单号'),
                dataIndex: 'tuitionOrderNo',
                key: 'tuitionOrderNo',
                width: 190,
            },
            {
                title: trans('charge.channelTradeNo', '渠道订单号'),
                dataIndex: 'channelTradeNo',
                key: 'channelTradeNo',
                width: 230,
            },
            {
                title: trans('charge.orderNo2', '支付单号'),
                dataIndex: 'orderNo',
                key: 'orderNo',
                width: 190,
            },
            {
                title: trans('charge.completeTime', '完成时间'),
                dataIndex: 'completeTime',
                key: 'completeTime',
                width: 160,
            },
            {
                title: trans('course.plan.school.title', '校区'),
                dataIndex: 'campus',
                key: 'campus',
                width: 130,
            },
            {
                title: trans('charge.createUserName', '发送人'),
                dataIndex: 'createUserName',
                key: 'createUserName',
                width: 70,
            },
            {
                title: trans('charge.section', '学段'),
                dataIndex: 'stage',
                key: 'stage',
                width: 70,
            },
            {
                title: trans('charge.operate', '操作'),
                key: 'action',
                width: 70,
                // fixed: 'right',
                render: (text, record) => (
                    <a onClick={this.viewDetail.bind(this, record)}>
                        {trans('student.detail', '详情')}
                    </a>
                ),
            },
        ];

        const data = [];
        if (tableList.length) {
            for (let i = 0; i < tableList.length; i++) {
                data.push({
                    key: i,
                    account: tableList[i].fundAccount,
                    name: tableList[i].userName,
                    payway: tableList[i].fundChannel,
                    trade: tableList[i].amount,
                    tuitionOrderNo: tableList[i].tuitionOrderNo,
                    channelTradeNo: tableList[i].channelTradeNo,
                    orderNo: tableList[i].orderNo,
                    completeTime: tableList[i].payTime,
                    campus: tableList[i].campusName,
                    stage: tableList[i].sectionName,
                    createUserName: tableList[i].createUserName,
                });
            }
        }

        const prefixSelector = (
            <Select style={{ width: 100 }} defaultValue={1} onChange={this.orderNoTypeChange}>
                <Option value={1} title={'姓名'}>
                    {trans('mobile.name', '姓名')}
                </Option>
                <Option value={2} title={'订单号'}>
                    {trans('charge.orderNo1', '订单号')}
                </Option>
                <Option value={3} title={'渠道订单号'}>
                    {trans('charge.channelTradeNo', '渠道订单号')}
                </Option>
                <Option value={4} title={'支付单号'}>
                    {trans('charge.payOrderNo', '支付单号')}
                </Option>
            </Select>
        );

        return (
            <div className={styles.paymentDetail}>
                <div className={styles.balanceStatistical}>
                    <span className={styles.cardItem}>
                        <span className={styles.card}>
                            <span className={styles.label}>{trans('charge.income', '收入：')}</span>
                            <span className={styles.number}>{sumAmount}</span>
                        </span>
                    </span>
                    {/* <span className={styles.cardItem + ' ' + styles.border}>
                    <span className={styles.card}>
                        <span className={styles.label}>支出</span>
                        <span className={styles.number}>456789876545678</span>
                    </span>
                </span>
                <span className={styles.cardItem}>
                    <span className={styles.card}>
                        <span className={styles.label}>结算款</span>
                        <span className={styles.number}>456789876545678</span>
                    </span>
                </span> */}
                </div>
                <div className={styles.formParent}>
                    <Form className={styles.form} layout="inline">
                        {window.top === window.self ? (
                            <Form.Item label={trans('charge.account', '账户')}>
                                <Select
                                    placeholder={trans('charge.allReceivable', '全部账户')}
                                    mode="multiple"
                                    size="large"
                                    style={{ width: '168px' }}
                                    onChange={this.getPayAccountValue}
                                >
                                    <Option value={null} key={null}>
                                        {trans('charge.allReceivable', '全部账户')}
                                    </Option>
                                    {accountList &&
                                        accountList.length &&
                                        accountList.map((item, index) => {
                                            return (
                                                <Option
                                                    value={item.id}
                                                    key={item.id}
                                                    title={item.accountName}
                                                >
                                                    {item.accountName}
                                                </Option>
                                            );
                                        })}
                                </Select>
                            </Form.Item>
                        ) : null}

                        <Form.Item label={trans('charge.payMode', '支付方式')}>
                            <Select
                                placeholder={trans('charge.payMode', '支付方式')}
                                mode="multiple"
                                size="large"
                                style={{ width: '168px' }}
                                onChange={this.getCannelValue}
                            >
                                <Option value={0} key={0}>
                                    {trans('charge.payMode', '支付方式')}
                                </Option>
                                {channelList &&
                                    channelList.length &&
                                    channelList.map((item, index) => {
                                        return (
                                            <Option value={item.id} key={item.id}>
                                                {item.channelName}
                                            </Option>
                                        );
                                    })}
                            </Select>
                        </Form.Item>
                        <Form.Item label={trans('charge.section', '学段')}>
                            <Select
                                placeholder={trans('course.plan.stage', '全部学段')}
                                mode="multiple"
                                size="large"
                                style={{ width: '168px' }}
                                onChange={this.getSectionValue}
                            >
                                <Option value={null} key={null}>
                                    {trans('course.plan.stage', '全部学段')}
                                </Option>
                                {campusAndStage.stage &&
                                    campusAndStage.stage.length &&
                                    campusAndStage.stage.map((item, index) => {
                                        return (
                                            <Option value={item.stage} key={item.stage}>
                                                {item.name}
                                            </Option>
                                        );
                                    })}
                            </Select>
                        </Form.Item>

                        <Form.Item>
                            <Input
                                addonBefore={prefixSelector}
                                placeholder={
                                    orderNoType === 1
                                        ? trans('charge.nameSearch', '请输入姓名搜索')
                                        : trans('charge.orderSearch', '请输入订单号搜索')
                                }
                                size="large"
                                style={{ width: '300px', borderRadius: '20px' }}
                                onChange={this.getInputValue}
                            />
                        </Form.Item>

                        {/* <Form.Item>
                        <Input
                            addonBefore={prefixSelector}
                            placeholder={orderNoType === 1 ? '请输入姓名搜索' : '请输入订单号搜索'}
                            size="large"
                            style={{ width: '300px', borderRadius: '20px' }}
                            onChange={this.getInputValue}
                        />
                    </Form.Item> */}

                        <Form.Item label={trans('charge.completionDate', '完成日期')}>
                            <DatePicker
                                onChange={this.getDeadLineBegin}
                                format={dateFormat}
                                placeholder={trans(
                                    'course.step1.select.start.date',
                                    '请选择开始日期'
                                )}
                                size="large"
                            />
                            &nbsp;&nbsp;<span style={{ color: '#666' }}>-</span>&nbsp;&nbsp;
                            <DatePicker
                                onChange={this.getDeadLineEnd}
                                format={dateFormat}
                                placeholder={trans('charge.endTimes', '请选择截止日期')}
                                size="large"
                            />
                        </Form.Item>
                    </Form>
                    {/* <div className={styles.record}>
                <span className={styles.item}>
                    <span className={styles.number}>123</span>
                    <span>总缴费记录</span>
                </span>
                <span className={styles.item}>
                    <span className={styles.number}>123</span>
                    <span>支付宝缴费记录</span>
                </span>
                <span className={styles.item}>
                    <span className={styles.number}>123</span>
                    <span>网银缴费记录</span>
                </span>
            </div> */}
                    <div>
                        <Button type="primary" className={styles.export} onClick={this.exportBatch}>
                            {trans('global.Export', '导出')}
                        </Button>
                    </div>
                </div>

                <div className={styles.tableAndPage}>
                    <Table
                        columns={columns}
                        dataSource={data}
                        pagination={false}
                        // scroll={{ x: 1300 }}
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
                {isViewDetail ? (
                    <OrderDetail
                        isViewDetail={isViewDetail}
                        orderDetailContent={orderDetailContent}
                        closeDrawer={this.closeDrawer}
                    />
                ) : null}
            </div>
        );
    }
}
