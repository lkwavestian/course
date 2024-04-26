//club列表
import React, { PureComponent } from 'react';
import styles from './index.less';
import {
    message,
    Card,
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    Checkbox,
    Icon,
    Pagination,
    Popconfirm,
    Radio,
} from 'antd';
import { connect } from 'dva';
import MerChant from './merChant';
import { trans } from '../../utils/i18n';

const dateFormat = 'YYYY/MM/DD';
const { Option } = Select;

@connect((state) => ({
    delMsg: state.account.delMsg,
    accountList: state.account.accountList,
    busiAndChannelList: state.account.busiAndChannelList,
    submitMsg: state.account.submitMsg,
    paymentMethodJudgment: state.account.paymentMethodJudgment,
    addMerChant: state.account.addMerChant,
    queryMerchantAccountList: state.account.queryMerchantAccountList,
    queryPayBusinessById: state.account.queryPayBusinessById,
    delPayBusiness: state.account.delPayBusiness,
}))
@Form.create()
export default class schoolAccount extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: false, // 新建弹窗显隐
            page: 1, // 页码
            total: null, // 总数
            pageSize: 10, // 每页展示条数
            accountList: [], // 列表
            busiList: [], // 商户
            channelList: [], // 渠道
            isEdit: false, // 判断是编辑状态还是新建状态
            accountId: null, // 账户id
            formList: undefined, // 点击编辑存储对应项信息
            merchantVisible: false, //新建商户框

            visibleMerchantVisibleModal: false, //编辑商户列表框
            isMerchantEdit: false,
            queryMerchantAccountList: [],
            merchantTotal: null,
            formMerChantList: undefined, // 点击编辑存储对应项信息
            isChange: true,
        };
    }

    componentDidMount() {
        this.getList();
        // this.getBusiAndChannel();
        this.getMerchantList();
    }

    // 获取账户列表
    getList = () => {
        const { dispatch } = this.props;
        const { page, pageSize } = this.state;
        dispatch({
            type: 'account/queryPayAccount',
            payload: {
                pageSize: pageSize,
                pageNum: page,
                queryAll: 0,
            },
        }).then(() => {
            this.setState({
                accountList: this.props.accountList.data,
                total: this.props.accountList.total,
            });
        });
    };

    // 获取商户列表
    getMerchantList = () => {
        const { dispatch } = this.props;
        const { page, pageSize } = this.state;
        dispatch({
            type: 'account/queryMerchantAccount',
            payload: {
                // pageSize: pageSize,
                // pageNum: page,
                // queryAll: 0,
            },
        }).then(() => {
            this.setState({
                queryMerchantAccountList: this.props.queryMerchantAccountList.data,
                merchantTotal: this.props.queryMerchantAccountList.total,
            });
        });
    };

    // 点击新建账户，弹窗显示
    getNewAccount = () => {
        this.getBusiAndChannel();
        this.setState({
            visible: true,
            isEdit: false,
        });
    };
    // 新建商户
    getNewMerchant = () => {
        this.setState({
            merchantVisible: true,
            isMerchantEdit: false,
        });
        const { dispatch } = this.props;
        dispatch({
            type: 'account/paymentMethodJudgment',
            payload: {},
            onSuccess: () => {},
        });
    };
    closeMerChant = (value) => {
        this.setState({
            merchantVisible: value,
            // isMerchantEdit: false,
        });
    };
    addMerChant = () => {
        this.setState({
            merchantVisible: true,
            visible: false,
        });
    };
    handleChange = () => {
        this.setState({
            isChange: false,
        });
    };
    // 新建账户提交
    handleSubmit = (e) => {
        const { dispatch } = this.props;
        const { isEdit, accountId, isChange, formList } = this.state;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            // console.log(values, 'values');
            if (!err) {
                // debugger;
                if (isChange && isEdit) {
                } else {
                    var busi = JSON.parse(values.merchants);
                }
                const channel = values.channel;
                console.log(values);
                let channelIds = '';
                let channelNames = '';
                channel &&
                    channel.length > 0 &&
                    channel.map((item, index) => {
                        if (index == channel.length - 1) {
                            channelIds += JSON.parse(item).id;
                            channelNames += JSON.parse(item).channelName;
                            return;
                        }
                        channelIds += JSON.parse(item).id + ',';
                        channelNames += JSON.parse(item).channelName + ',';
                    });

                dispatch({
                    type: 'account/addOrUpdPayAccount',
                    payload: {
                        accountName: values.name, // 账户名称
                        businessesId:
                            isChange && isEdit ? formList.businessesId : busi.businessesNo, //商户id
                        businessesName:
                            isChange && isEdit ? formList.merchants : busi.businessesName, // 商户名称
                        channelIds: channelIds, //收款渠道ID，多个逗号分割
                        channelNames: channelNames, //收款渠道名称，多个逗号分割
                        type: isEdit ? 2 : 1, // 1 添加, 2更新
                        id: isEdit ? accountId : null, // 主键,type=2,修改时必传
                        alipayType: values.alipayType,
                    },
                }).then(() => {
                    message.success(this.props.submitMsg);
                    this.setState({
                        isChange: true,
                    });
                    this.getList();
                });
                this.setState({
                    visible: false,
                });
            }
        });
    };

    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    };

    // 切换页面
    changePage = (page, pageSize) => {
        this.setState(
            {
                page,
            },
            () => {
                this.getList();
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
                this.getList();
            }
        );
    };

    // 二次确认。确认删除操作
    popoverOk = (record) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'account/delPayAccount',
            payload: {
                id: record.key,
            },
        }).then(() => {
            if (this.props.delMsg && this.props.delMsg.status) {
                message.success(this.props.delMsg && this.props.delMsg.message);
                this.getList();
            }
        });
    };

    merchantPopoverOk = (record) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'account/delPayBusiness',
            payload: {
                id: record.id,
            },
            onSuccess: () => {},
        }).then(() => {
            if (this.props.delPayBusiness && this.props.delPayBusiness.status) {
                message.success(this.props.delPayBusiness && this.props.delPayBusiness.message);
                this.getMerchantList();
            }
        });
    };

    // 获取商户和渠道
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

    getMerchantBusiAndChannel = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'account/queryPayBusinessById',
            payload: {},
        }).then(() => {
            const { queryPayBusinessById } = this.props;
            this.setState({});
        });
        dispatch({
            type: 'account/paymentMethodJudgment',
            payload: {},
            onSuccess: () => {},
        });
    };

    // 编辑
    handleEdit = (record) => {
        this.getBusiAndChannel();
        this.setState({
            visible: true,
            isEdit: true,
            formList: record,
            accountId: record.accountId,
        });
    };

    merchantHandleEdit = (record) => {
        // this.getMerchantBusiAndChannel();
        this.setState({
            merchantVisible: true,
            isMerchantEdit: true,
            formMerChantList: record,
            accountId: record.accountId,
        });
    };

    getchannelValue = (names, ids) => {
        const idList = ids.split(',');
        const nameList = names.split(',');
        const list = [];
        for (let i = 0; i < idList.length; i++) {
            list.push(
                JSON.stringify({
                    id: parseInt(idList[i]),
                    channelName: nameList[i],
                })
            );
        }
        return list;
    };

    checkChange = (e) => {
        console.log(e, '---------e----------');
    };

    render() {
        const {
            formList,
            isEdit,
            visible,
            page,
            pageSize,
            total,
            accountList,
            busiList,
            channelList,
            isMerchantEdit,
            queryMerchantAccountList,
            formMerChantList,
        } = this.state;
        const { getFieldDecorator } = this.props.form;

        console.log('formList', formList);
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };

        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 24,
                    // offset: 8,
                },
            },
        };

        const content = (
            <div className={styles.popover}>
                <div className={styles.confirmText}>
                    <span className={styles.textTitle}>
                        {trans('charge.isRemind', '您确定要删除学校账户吗？')}
                    </span>
                    <span className={styles.textDescribe}>
                        {trans(
                            'charge.remindDetail',
                            '关闭后，该学校账户将被移除，关联账户的通知与缴费渠道将失效'
                        )}
                    </span>
                </div>
            </div>
        );

        const contentMerchant = (
            <div className={styles.popover}>
                <div className={styles.confirmText}>
                    <span className={styles.textTitle}>
                        {trans('charge.isMerchantRemind', '您确定要删除学校商户吗？')}
                    </span>
                    <span className={styles.textDescribe}>
                        {trans('charge.remindMerchantDetail', '关闭后，该学校商户将被移除')}
                    </span>
                </div>
            </div>
        );

        const columns = [
            {
                title: trans('charge.accountName', '账户名称'),
                dataIndex: 'name',
                key: 'name',
                render: (text) => <span>{text}</span>,
            },
            {
                title: trans('charge.merchants', '对应商户'),
                dataIndex: 'merchants',
                key: 'merchants',
            },
            {
                title: trans('charge.channel', '收款渠道'),
                dataIndex: 'channel',
                key: 'channel',
            },
            {
                title: trans('charge.operate', '操作'),
                key: 'action',
                render: (text, record) => (
                    <span>
                        <a style={{ marginRight: 16 }} onClick={this.handleEdit.bind(this, record)}>
                            {trans('charge.edit', '编辑')}
                        </a>
                        <Popconfirm
                            placement="top"
                            title={content}
                            onConfirm={this.popoverOk.bind(this, record)}
                            okText={trans('charge.isdelete', '确认删除')}
                            cancelText={trans('charge.cancel', '取消')}
                            icon={null}
                            overlayClassName={styles.popContent}
                        >
                            <a>{trans('charge.delete', '删除')}</a>
                        </Popconfirm>
                    </span>
                ),
            },
        ];

        const merchantColumns = [
            {
                title: trans('charge.accountId', '序号'),
                dataIndex: 'id',
                key: 'id',
                // render: (text) => <span>{text}</span>,
            },
            {
                title: trans('charge.accountName', '账户名称'),
                dataIndex: 'name',
                key: 'name',
                // render: (text) => <span>{text}</span>,
            },
            {
                title: trans('charge.channel', '收款渠道'),
                dataIndex: 'payType',
                key: 'payType',
                render: (text) => {
                    return <span>{text == 1 ? '支付宝' : '微信'}</span>;
                },
            },
            {
                title: trans('charge.operate', '操作'),
                key: 'action',
                render: (text, record) => (
                    <span>
                        <a
                            style={{ marginRight: 16 }}
                            onClick={this.merchantHandleEdit.bind(this, record)}
                        >
                            {trans('charge.edit', '编辑')}
                        </a>
                        <Popconfirm
                            placement="top"
                            title={contentMerchant}
                            onConfirm={this.merchantPopoverOk.bind(this, record)}
                            okText={trans('charge.isdelete', '确认删除')}
                            cancelText={trans('charge.cancel', '取消')}
                            icon={null}
                            overlayClassName={styles.popContent}
                        >
                            <a>{trans('charge.delete', '删除')}</a>
                        </Popconfirm>
                    </span>
                ),
            },
        ];

        const data = [];
        if (accountList && accountList.length > 0) {
            for (let i = 0; i < accountList.length; i++) {
                data.push({
                    key: accountList[i].id,
                    accountId: accountList[i].id,
                    name: accountList[i].accountName,
                    merchants: accountList[i].businessesName,
                    businessesId: accountList[i].businessesId,
                    channel: accountList[i].channelNames,
                    channelIds: accountList[i].channelIds,
                });
            }
        }

        // const dataList = [];
        // if (queryMerchantAccountList && queryMerchantAccountList.length > 0) {
        //     for (let i = 0; i < queryMerchantAccountList.length; i++) {
        //         dataList.push({
        //             key: queryMerchantAccountList[i].id,
        //             id: queryMerchantAccountList[i].id,
        //             accountId: queryMerchantAccountList[i].id,
        //             name: queryMerchantAccountList[i].accountName,
        //             merchants: queryMerchantAccountList[i].businessesName,
        //             businessesId: queryMerchantAccountList[i].businessesId,
        //             channel: queryMerchantAccountList[i].channelNames,
        //             channelIds: queryMerchantAccountList[i].channelIds,
        //         });
        //     }
        // }

        return (
            <div className={styles.schoolAccount}>
                <div className={styles.header}>
                    <span className={styles.text}>
                        {trans('charge.totalNum', '共{$total}个使用中的账户', {
                            total: data.length,
                        })}
                    </span>
                    <Button type="primary" className={styles.btn} onClick={this.getNewMerchant}>
                        {trans('charge.addMerchant', '+新建商户')}
                    </Button>
                    <Button type="primary" className={styles.btn} onClick={this.getNewAccount}>
                        {trans('charge.addAccount', '+新建账户')}
                    </Button>
                </div>
                <div className={styles.table} style={{ marginBottom: '130px' }}>
                    <p className={styles.schoolAccountP}>
                        <span></span>
                        <span>账户列表</span>
                    </p>
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
                <div className={styles.table}>
                    <p className={styles.schoolAccountP}>
                        <span></span>
                        <span>商户列表</span>
                    </p>
                    <Table
                        columns={merchantColumns}
                        dataSource={this.props.queryMerchantAccountList}
                        pagination={false}
                    />
                </div>
                <Modal
                    visible={visible}
                    footer={null}
                    onCancel={this.handleCancel}
                    destroyOnClose
                    width={800}
                    className={styles.addaCcount}
                >
                    <p className={styles.newTitle}>
                        {isEdit
                            ? trans('charge.editStudentAccount', '编辑学校账户')
                            : trans('charge.addStudentAccount', '新建学校账户')}
                    </p>
                    <Form onSubmit={this.handleSubmit} {...formItemLayout}>
                        <Form.Item
                            label={trans('charge.accountName', '账户名称')}
                            extra={
                                <span style={{ fontSize: '12px' }}>
                                    <Icon
                                        type="exclamation-circle"
                                        theme="filled"
                                        style={{ color: '#4D7FFF' }}
                                    />
                                    {trans(
                                        'charge.repeatReminder',
                                        '账户名称不得与已有账户重复。一旦创建，不可修改。'
                                    )}
                                </span>
                            }
                        >
                            {getFieldDecorator('name', {
                                rules: [
                                    {
                                        required: true,
                                        message: trans(
                                            'charge.nameReminder',
                                            '请输入20个以内的中文字符'
                                        ),
                                    },
                                ],
                                initialValue: `${isEdit ? formList.name : ''}`,
                            })(
                                <Input
                                    placeholder={trans(
                                        'charge.nameReminder',
                                        '请输入20个以内的中文字符'
                                    )}
                                    disabled={isEdit ? true : false}
                                />
                            )}
                        </Form.Item>
                        <Form.Item
                            label={trans('charge.merchants', '对应商户')}
                            className={styles.busi}
                        >
                            {getFieldDecorator('merchants', {
                                rules: [
                                    {
                                        required: true,
                                        message: trans('charge.selectMerchants', '请选择对应商户'),
                                    },
                                ],
                                // initialValue: `${
                                //     isEdit
                                //         ? //   businessesNo: formList.businessesId,
                                //           formList.merchants
                                //         : ''
                                // }`,
                                initialValue: isEdit
                                    ? JSON.stringify({
                                          businessesNo: formList.businessesId,
                                          businessesName: formList.merchants,
                                      })
                                    : undefined,
                            })(
                                <Select
                                    placeholder={trans('charge.selectMerchants', '请选择对应商户')}
                                    onChange={this.handleChange}
                                >
                                    {busiList &&
                                        busiList.length &&
                                        busiList.map((item, index) => {
                                            return (
                                                <Option
                                                    value={JSON.stringify({
                                                        businessesNo: item.businessesNo,
                                                        businessesName: item.businessesName,
                                                    })}
                                                    key={item.businessesNo}
                                                >
                                                    {item.businessesName}
                                                </Option>
                                            );
                                        })}
                                </Select>
                            )}
                            <a className={styles.addBusi} onClick={this.addMerChant}>
                                {trans('charge.addMerchant', '+新建商户')}
                            </a>
                        </Form.Item>
                        <Form.Item label={trans('charge.channel', '收款渠道')}>
                            {getFieldDecorator('channel', {
                                rules: [
                                    {
                                        required: true,
                                        message: trans('charge.selectChannel', '请选择收款渠道'),
                                    },
                                ],
                                initialValue: isEdit
                                    ? this.getchannelValue(formList.channel, formList.channelIds)
                                    : [],
                            })(
                                <Checkbox.Group onChange={this.checkChange}>
                                    {channelList &&
                                        channelList.length &&
                                        channelList.map((item, index) => {
                                            return (
                                                <Checkbox
                                                    value={JSON.stringify({
                                                        id: item.id,
                                                        channelName: item.channelName,
                                                    })}
                                                    key={item.id}
                                                >
                                                    {item.channelName}
                                                </Checkbox>
                                            );
                                        })}
                                </Checkbox.Group>
                            )}
                        </Form.Item>
                        <Form.Item label={trans('charge.alipayType', '支付宝缴费通道')}>
                            {getFieldDecorator('alipayType', {
                                rules: [
                                    {
                                        required: true,
                                        message: trans('charge.selectAlipayType', '请选择缴费通道'),
                                    },
                                ],
                                initialValue: isEdit ? formList.alipayType : '',
                            })(
                                <Radio.Group onChange={this.onChange} value={this.state.value}>
                                    <Radio value={1}>
                                        {trans('charge.educationPayment', '教育缴费')}
                                    </Radio>
                                    <Radio value={2}>
                                        {trans('charge.basicPayment', '基础支付')}
                                    </Radio>
                                </Radio.Group>
                            )}
                        </Form.Item>
                        <Form.Item className={styles.btnBox} {...tailFormItemLayout}>
                            <Button
                                type="default"
                                onClick={this.handleCancel}
                                style={{ borderRadius: '16px', marginRight: '4px' }}
                            >
                                {trans('charge.cancel', '取消')}
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{ borderRadius: '16px', marginLeft: '4px' }}
                                className={styles.button}
                            >
                                {trans('charge.confirm', '确认')}
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
                {this.state.merchantVisible && (
                    <MerChant
                        visible={this.state.merchantVisible}
                        onClose={this.closeMerChant.bind(this)}
                        dispatch={this.props.dispatch}
                        isMerchantEdit={isMerchantEdit}
                        formMerChantList={formMerChantList}
                        getMerchantBusiAndChannel={this.getMerchantBusiAndChannel.bind(this)}
                        getMerchantList={this.getMerchantList.bind(this)}
                    ></MerChant>
                )}
            </div>
        );
    }
}
