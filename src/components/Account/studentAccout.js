//club列表
import React, { PureComponent } from 'react';
import styles from './index.less';
import { Table, Select, Button, Form, Input, Pagination, message } from 'antd';
import { connect } from 'dva';
import { trans, locale } from '../../utils/i18n';

const dateFormat = 'YYYY/MM/DD';
const { Option } = Select;
const { Search } = Input;

@connect((state) => ({
    balanceList: state.account.balanceList,
}))
@Form.create()
export default class studentAccout extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            stage: '',
            keyWord: '',
            pageNo: 1,
            pageSize: 10,
        };
    }

    componentDidMount() {
        this.getUserWalletList();
    }

    getUserWalletList = () => {
        const { dispatch } = this.props;
        const { stage, keyWord, pageNo, pageSize } = this.state;
        dispatch({
            type: 'account/getUserWalletList',
            payload: {
                stage,
                keyWord,
                pageNo,
                pageSize,
            },
        });
    };

    changeStage = (value) => {
        this.setState(
            {
                stage: value,
            },
            () => {
                this.getUserWalletList();
            }
        );
    };

    changeKeyword = (e) => {
        this.setState({
            keyWord: e.target.value,
        });
    };

    changePageNum = (pageNumber) => {
        this.setState(
            {
                pageNo: pageNumber,
            },
            () => {
                this.getUserWalletList();
            }
        );
    };

    onShowSizeChange = (current, pageSize) => {
        this.setState(
            {
                pageNo: 1,
                pageSize,
            },
            () => {
                this.getUserWalletList();
            }
        );
    };

    exportBalance = () => {
        const { stage, keyWord } = this.state;
        // if (!stage) {
        //     message.warning('请选择学段后导出!');
        //     return false;
        // }
        window.open(`/api/pay/wallet/exportUserWalletList?stage=${stage}&keyWord=${keyWord}`);
    };

    render() {
        let { stage, keyWord, pageNo, pageSize } = this.state;
        const columns = [
            {
                title: '学生姓名',
                dataIndex: 'userName',
                key: 'userName',
                align: 'center',
                render: (text, record, index) => {
                    return (
                        <span>
                            {`${text}/${record.userEnName}`}
                            <br />
                            {record.studentNo}
                        </span>
                    );
                },
            },
            {
                title: '班级',
                dataIndex: 'groupName',
                key: 'groupName',
                align: 'center',
            },
            {
                title: '账户余额',
                dataIndex: 'balance',
                key: 'balance',
                align: 'center',
            },
            /* {
                title: '银行卡号',
                dataIndex: 'bankNum',
                key: 'bankNum',
                align: 'center',
            },
            {
                title: '账户名',
                dataIndex: 'accout',
                key: 'accout',
                align: 'center',
            },
            {
                title: '开户行',
                dataIndex: 'bank',
                key: 'bank',
                align: 'center',
            },
            {
                title: '开户地',
                dataIndex: 'bankOpening',
                key: 'bankOpening',
                align: 'center',
            }, */
            // {
            //     title: '操作',
            //     dataIndex: 'operate',
            //     key: 'operate',
            //     align: 'center',
            //     render: (text, record, index) => {
            //         return <a>详情</a>;
            //     },
            // },
        ];

        let { balanceList } = this.props;
        let tableData = (balanceList.data && balanceList.data.payWalletModelList) || [];
        let totalBalance = balanceList.data && balanceList.data.totalWalletBalance;
        let totalNum = balanceList && balanceList.total;

        const paginationObj = {
            total: 100,
            showSizeChanger: true,
            onShowSizeChange: () => this.onShowSizeChange(),
            showQuickJumper: true,
            onChange: () => this.changePageNum(),
        };
        return (
            <>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>
                            <span>学段</span>
                            <Select
                                style={{ width: 150, margin: '0 10px' }}
                                placeholder="全部学段"
                                onChange={this.changeStage}
                                value={stage}
                            >
                                <Option key={0} value={''}>
                                    全部学段
                                </Option>
                                <Option key={1} value={1}>
                                    幼儿园
                                </Option>
                                <Option key={2} value={2}>
                                    小学
                                </Option>
                                <Option key={3} value={3}>
                                    初中
                                </Option>
                                <Option key={4} value={4}>
                                    高中
                                </Option>
                            </Select>
                            <Search
                                style={{ width: 250 }}
                                placeholder="请输入学生姓名/学号搜索"
                                onChange={this.changeKeyword}
                                onPressEnter={this.getUserWalletList}
                                value={keyWord}
                            />
                        </span>
                        <span>
                            <Button
                                type="primary"
                                // style={{ marginLeft: '70%' }}
                                className={styles.btn}
                                onClick={this.exportBalance}
                            >
                                导出
                            </Button>
                        </span>
                    </div>
                    <div>
                        <span style={{ fontSize: '30px' }}>¥{totalBalance}</span>
                        <span>学生账户余额合计</span>
                    </div>
                </div>
                <Table columns={columns} dataSource={tableData} pagination={false} />
                <Pagination
                    total={totalNum}
                    showSizeChanger
                    onShowSizeChange={this.onShowSizeChange}
                    showQuickJumper
                    onChange={this.changePageNum}
                    pageSizeOptions={['10', '20', '50', '100']}
                    style={{ float: 'right', margin: '20px 0' }}
                    current={pageNo}
                    pageSize={pageSize}
                />
            </>
        );
    }
}
