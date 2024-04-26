//club列表
import React, { PureComponent } from 'react';
import styles from './index.less';
import { Form, Select, Input, DatePicker, Table, Pagination, Button } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { trans } from '../../../utils/i18n';

const dateFormat = 'YYYY-MM-DD';
const { Option } = Select;

@connect((state) => ({
    campusAndStage: state.pay.campusAndStage, // 查询年级和学段
    transactionsDetailList: state.order.transactionsDetailList,
    busiAndChannelList: state.account.busiAndChannelList,
}))
export default class DealFlow extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            pageSize: 10,
            total: '',
            tableList: [], // 列表
            sumAmount: '', // 总交易金额
            businessesId: '', //  商户id
            deadlineBegin: '', // 起始时间
            deadlineEnd: '', // 截至时间
            keyValue: '', // 关键字
            busiList: '', // 商户下拉菜单数据
            channelId: '', // 支付方式id
        };
    }

    componentDidMount() {
        this.getBusiAndChannel();
        this.getTableList();
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
                busiList: busiAndChannelList.payBusinessesList,
                channelList: busiAndChannelList.payFundChannelsList,
            });
        });
    };

    // 获取列表
    getTableList = () => {
        const { dispatch } = this.props;
        const { keyValue, businessesId, deadlineBegin, deadlineEnd, page, pageSize, channelId } =
            this.state;

        dispatch({
            type: 'order/getTransactionsDetail',
            payload: {
                businessesId: businessesId,
                payTimeBegin: deadlineBegin,
                payTimeEnd: deadlineEnd,
                tuitionOrderNo: keyValue,
                pageNum: page,
                pageSize: pageSize,
                payType: channelId,
            },
        }).then(() => {
            const { transactionsDetailList } = this.props;
            this.setState({
                tableList:
                    transactionsDetailList &&
                    transactionsDetailList.data &&
                    transactionsDetailList.data.transactionsDetailModels,
                sumAmount:
                    transactionsDetailList &&
                    transactionsDetailList.data &&
                    transactionsDetailList.data.totalAmount,
                total: transactionsDetailList && transactionsDetailList.total,
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

    getBusValue = (value) => {
        this.setState(
            {
                businessesId: value ? value : '',
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

    // 导出
    exportBatch = () => {
        const { keyValue, page, businessesId, pageSize, deadlineBegin, deadlineEnd } = this.state;
        window.open(
            `/api/pay/exportTransactionsDetail?businessesId=${businessesId}&payTimeBegin=${deadlineBegin}&payTimeEnd=${deadlineEnd}&tuitionOrderNo=${keyValue}&pageNum=${page}&pageSize=${pageSize}`
        );
    };

    render() {
        const { page, pageSize, total, tableList, sumAmount, busiList, channelList } = this.state;
        const columns = [
            {
                title: trans('charge.orderNo2', '支付单号'),
                dataIndex: 'orderNo',
                key: 'orderNo',
                // width:210,
            },
            {
                title: trans('charge.payMode', '支付方式'),
                dataIndex: 'payway',
                key: 'payway',
                width: 150,
                render: (text, record) => {
                    return (
                        <span className={styles.payWayImg}>
                            {record.payway ? (
                                <img src={record.payway} />
                            ) : record.channelName ? (
                                <span>{record.channelName}</span>
                            ) : null}
                        </span>
                    );
                },
            },
            {
                title: trans('charge.payTime', '付款时间'),
                dataIndex: 'payTime',
                key: 'payTime',
                width: 180,
            },
            {
                title: trans('charge.trade', '交易金额'),
                dataIndex: 'amount',
                key: 'amount',
                width: 120,
            },
            {
                title: trans('charge.tradeStatus', '交易状态'),
                dataIndex: 'status',
                key: 'status',
                width: 120,
                render: (text, record) => {
                    return (
                        <span>
                            {record.status == 1
                                ? trans('charge.status1', '待付款')
                                : record.status == 2
                                ? trans('charge.status2', '付款完成')
                                : record.status == 3
                                ? trans('charge.status3', '交易关闭')
                                : record.status == 4
                                ? trans('charge.status4', '交易失败关闭')
                                : record.status == 5
                                ? trans('charge.status5', '订单失效关闭')
                                : record.status == 6
                                ? trans('charge.status6', '支付中')
                                : ''}
                        </span>
                    );
                },
            },
            {
                title: trans('charge.orderNo1', '订单号'),
                dataIndex: 'tuitionOrderNo',
                key: 'tuitionOrderNo',
                // width:210,
            },
            {
                title: trans('charge.channelTradeNo1', '渠道订单号'),
                dataIndex: 'channelTradeNo',
                key: 'channelTradeNo',
                // width:210,
            },
            {
                title: trans('charge.businessesId', '商户名称'),
                dataIndex: 'businessesId',
                key: 'businessesId',
                width: 120,
            },
        ];

        const data = [];
        if (tableList.length) {
            for (let i = 0; i < tableList.length; i++) {
                data.push({
                    key: i,
                    orderNo: tableList[i].orderNo,
                    payway: tableList[i].accountUrl,
                    payTime: tableList[i].payTime,
                    amount: tableList[i].amount,
                    status: tableList[i].payStatus,
                    tuitionOrderNo: tableList[i].tuitionOrderNo,
                    channelTradeNo: tableList[i].channelTradeNo,
                    businessesId: tableList[i].businessesId,
                    channelName: tableList[i].channelName,
                });
            }
        }

        return (
            <div className={styles.dealFlow}>
                <div className={styles.balanceStatistical}>
                    <span className={styles.cardItem}>
                        <span className={styles.card}>
                            <span className={styles.label}>
                                {trans('charge.totalTransaction', '总交易金额：')}
                            </span>
                            <span className={styles.number}>{sumAmount}</span>
                        </span>
                    </span>
                </div>
                <Form className={styles.form} layout="inline">
                    <Form.Item label={trans('charge.merchant', '商户')}>
                        <Select
                            placeholder={trans('charge.allMerchant', '全部商户')}
                            size="large"
                            style={{ width: '168px' }}
                            onChange={this.getBusValue}
                        >
                            <Option value={0} key={0}>
                                {trans('charge.allMerchant', '全部商户')}
                            </Option>
                            {busiList &&
                                busiList.length &&
                                busiList.map((item, index) => {
                                    return (
                                        <Option value={item.businessesNo} key={item.businessesNo}>
                                            {item.businessesName}
                                        </Option>
                                    );
                                })}
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
                    <Form.Item label={trans('charge.period', '时间段')}>
                        <DatePicker
                            onChange={this.getDeadLineBegin}
                            format={dateFormat}
                            placeholder={trans('course.step1.select.start.date', '请选择开始日期')}
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

                    <Form.Item>
                        <Input
                            // addonBefore={prefixSelector}
                            placeholder={trans('charge.orderSearch', '请输入订单号搜索')}
                            size="large"
                            style={{ width: '300px', borderRadius: '8px', height: '36px' }}
                            onChange={this.getInputValue}
                        />
                    </Form.Item>
                    <Button type="primary" className={styles.export} onClick={this.exportBatch}>
                        {trans('global.Export', '导出')}
                    </Button>
                </Form>
                {/* 
                <div>
                    <Button type="primary" className={styles.export} onClick={this.exportBatch}>
                        导出
                    </Button>
                </div> */}
                <div className={styles.tableAndPage}>
                    <Table columns={columns} dataSource={data} pagination={false} />
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
        );
    }
}
