import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './index.less';
import { Form, Table, Button, Input, Modal, message, Spin, Popconfirm } from 'antd';
import md5 from 'js-md5';
import disable$ from 'dingtalk-jsapi/api/ui/webViewBounce/disable';
const { Search } = Input;
@Form.create()
@connect((state) => ({
    ToDetailId: '',
    editDataList: state.application.editDataList,
    dataList: state.application.dataList,
    generateAccount: state.application.generateAccount,
    getGenerateAccountList: state.application.getGenerateAccountList,
    deleteSchoolById: state.application.deleteSchoolById,
}))
export default class SchoolManagement extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            accountVisible: false,
            confirmLoading: false,
            schoolId: '',
            keyWord: '', // 添加关键字 state
        };
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'application/dataList',
            payload: {},
            onSuccess: () => {
                const { dataList } = this.props;
                console.log('dataList', dataList);
            },
        });
    }
    handleSearch = (value) => {
        const { dispatch } = this.props;
        this.setState({ keyWord: value }, () => {
            dispatch({
                type: 'application/dataList',
                payload: {
                    keyWord: this.state.keyWord,
                },
                onSuccess: () => {
                    const { dataList } = this.props;
                    console.log('dataList', dataList);
                },
            });
        });
    };
    changeAccount = (row) => {
        console.log('row', row);
        const { dispatch } = this.props;
        this.setState(
            {
                accountVisible: true,
                schoolId: row.schoolId,
            },
            () => {
                console.log('schoolId', this.state.schoolId);
                const { schoolId } = this.state;
                dispatch({
                    type: 'application/getGenerateAccountList',
                    payload: {
                        schoolId,
                    },
                    onSuccess: () => {
                        const { getGenerateAccountList } = this.props;
                        console.log('schoolId', schoolId);
                    },
                }).then(() => {
                    const {
                        getGenerateAccountList: { account, password, schoolId, phone, schoolCode },
                    } = this.props;
                    const { getGenerateAccountList } = this.props;
                    if (getGenerateAccountList) {
                        this.props.form.setFieldsValue({
                            account,
                            password: '******',
                            phone,
                        });
                    }
                });
            }
        );
    };

    deleteSchoolId = (row) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'application/deleteSchoolById',
            payload: {
                schoolId: row.schoolId,
            },
            onSuccess: () => {
                const { getGenerateAccountList } = this.props;
                console.log('schoolId', schoolId);
                message.success('删除成功');
            },
        });
    };

    handleCancel = () => {
        this.setState({
            accountVisible: false,
            confirmLoading: false,
        });
    };

    handleOk = () => {
        const { dispatch, form } = this.props;
        const { schoolId } = this.state;
        form.validateFields((err, values) => {
            console.log('values', values);
            if (!err) {
                console.log('values', values);
                this.setState({
                    accountVisible: true,
                    confirmLoading: true,
                });
                dispatch({
                    type: 'application/generateAccount',
                    payload: {
                        account: values.account,
                        password: values.password === '******' ? null : md5(values.password),
                        schoolId: schoolId,
                        phone: values.phone,
                        schoolCode: values.schoolCode == 'null' ? null : values.schoolCode,
                    },
                    onSuccess: () => {
                        message.success('提交成功');
                    },
                }).then(() => {
                    this.setState({
                        accountVisible: false,
                        confirmLoading: false,
                    });
                });
            }
        });
    };

    render() {
        const {
            dataList,
            form: { getFieldDecorator },
            getGenerateAccountList,
        } = this.props;
        const { accountVisible, confirmLoading, keyWord } = this.state;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };

        const columns = [
            {
                title: '学校ID',
                dataIndex: 'schoolId',
                key: 'schoolId',
            },
            {
                title: '学校名称',
                dataIndex: 'schoolName',
                key: 'schoolName',
            },
            {
                title: '开通学段',
                dataIndex: 'openStageNameList',
                key: 'openStageNameList',
            },
            {
                title: '联系手机',
                dataIndex: 'registerPhone',
                key: 'registerPhone',
                render: (text, row, index) => (
                    <div>
                        <span>
                            {row.registerUserName}
                            {row.registerUserName && row.registerPhone ? '：' : null}
                            {row.registerPhone}
                        </span>
                        <br />
                        <span>
                            {row.headUserName}
                            {row.headUserName && row.headUserPhone ? '：' : null}
                            {row.headUserPhone}
                        </span>
                    </div>
                ),
            },
            {
                title: '学校域名',
                dataIndex: 'domainName',
                key: 'domainName',
            },
            {
                title: '可用模块',
                dataIndex: 'purchase',
                key: 'purchase',
                render: (text, record, index) => {
                    return (
                        record.purchaseModuleList &&
                        record.purchaseModuleList.map((item, index2) => {
                            return (
                                <>
                                    {item}
                                    {index2 == record.purchaseModuleList.length - 1 ? '' : '、'}
                                </>
                            );
                        })
                    );
                },
            },
            {
                title: '管理',
                dataIndex: 'manage',
                key: 'manage',
                render: (text, row) => (
                    <span>
                        <Link to={`/school/application?schoolId=${row.schoolId}`}>编辑</Link>
                        <Popconfirm
                            title="确定要删除吗？"
                            okText="确定"
                            cancelText="取消"
                            onConfirm={() => this.deleteSchoolId(row)}
                        >
                            <span style={{ color: '#1890ff', marginLeft: '10px' }}>删除</span>
                        </Popconfirm>
                    </span>
                ),
            },
            {
                title: '生成账号',
                dataIndex: 'account',
                key: 'account',
                render: (text, row) => (
                    <span style={{ color: '#1890ff' }} onClick={() => this.changeAccount(row)}>
                        生成账号
                    </span>
                ),
            },
        ];
        return (
            <div className={styles.content}>

                <div className={styles.header}>
                    <div className={styles.searchBox}>
                        <Search
                            placeholder="搜索学校"
                            onSearch={this.handleSearch}
                            style={{ width: '200px', marginRight: '10px' }}
                        />
                    </div>
                    <Link to="/school/application" className={styles.linkStyle}>
                        <Button className={styles.addSchool} type="primary">
                            添加学校
                        </Button>
                    </Link>
                </div>

                <Table dataSource={dataList} columns={columns} />
                {/* <Spin tip="正在生成中..." spinning={confirmLoading}> */}
                <Modal
                    className={styles.accountModal}
                    title="生成账号"
                    visible={accountVisible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    okText="确认"
                    cancelText="取消"
                    destroyOnClose={true}
                >
                    <Form {...formItemLayout} style={{ marginLeft: '-10px' }}>
                        <Form.Item label="账号：">
                            {getFieldDecorator('account', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入账号',
                                    },
                                ],
                            })(<Input placeholder="请输入账号" style={{ width: '400px' }} />)}
                        </Form.Item>
                        <Form.Item label="密码：">
                            {getFieldDecorator('password')(
                                <Input placeholder="请输入密码" style={{ width: '400px' }} />
                            )}
                        </Form.Item>
                        <Form.Item label="手机号：">
                            {getFieldDecorator('phone', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入手机号',
                                    },
                                ],
                            })(<Input placeholder="请输入手机号" style={{ width: '400px' }} />)}
                        </Form.Item>
                        <Form.Item label="学校简称：">
                            {getFieldDecorator('schoolCode', {
                                rules: [
                                    {
                                        required: false,
                                        message: '请输入学校简称',
                                    },
                                ],
                            })(
                                <Input
                                    placeholder="例如：云谷学校简称YGXX"
                                    style={{ width: '400px' }}
                                    disabled={getGenerateAccountList ? false : true}
                                />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
                {/* </Spin> */}
            </div>
        );
    }
}
