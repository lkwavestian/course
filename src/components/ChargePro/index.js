//club列表
import React, { PureComponent } from 'react';
import styles from './index.less';
import { Button, Form, Select, Input, Pagination, Table, Popconfirm, message, Modal } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import icon from '../../icon.less';
import { locale } from 'moment';
import NewChargePro from './newChargePro.js';
import Category from './category.js';
import { trans } from '../../utils/i18n';

const { Option } = Select;

@connect((state) => ({
    chargeList: state.chargePro.chargeList,
    chargeDelMsg: state.chargePro.chargeDelMsg,
    payItemCategory: state.chargePro.payItemCategory,
    accountList: state.account.accountList,
}))
export default class ChargePro extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            page: 1, // 页码
            total: null, // 总数
            pageSize: 10, // 每页展示条数
            tableList: [], // 列表
            categoryValue: '', // 项目类型value
            accountValue: '', // 收款账户value
            inputValue: '', // 关键字搜索value
            visible: false, // 弹窗显隐
            id: null, // 存储当前列表操作项的id
            isEdit: false, // 是否编辑
            formList: [], // 存储当前列表操作项的数据
            categoryVisible: false, // 管理分类显隐
        };
    }

    componentDidMount() {
        this.getList();
        this.getPayItemCategory();
        this.getAccount();
    }

    // 获取列表
    getList = () => {
        const { dispatch } = this.props;
        const { inputValue, page, pageSize, categoryValue, accountValue } = this.state;
        dispatch({
            type: 'chargePro/queryPayChargeItem',
            payload: {
                pageSize: pageSize,
                pageNum: page,
                accountId: accountValue,
                categoryNo: categoryValue,
                keywords: inputValue,
            },
        }).then(() => {
            this.setState({
                tableList: this.props.chargeList && this.props.chargeList.data,
                total: this.props.chargeList.total,
            });
        });
    };

    // 获取项目类型
    getPayItemCategory = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'chargePro/queryPayItemCategory',
        });
    };

    // 获取账户
    getAccount = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'account/queryPayAccount',
            payload: {
                queryAll: 1,
            },
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

    // 编辑
    handleEdit = (record) => {
        console.log(record, 'vc1');
        this.setState({
            isEdit: true,
            id: record.id,
            visible: true,
            formList: record,
        });
    };

    // 删除
    popoverOk = (record) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'chargePro/delPayChargeItem',
            payload: {
                id: record.id,
            },
        }).then(() => {
            if (this.props.chargeDelMsg.status) {
                message.success(this.props.chargeDelMsg.message);
                this.getList();
            }
        });
    };

    // 项目类型value获取
    getCategoryValue = (e) => {
        this.setState(
            {
                categoryValue: e,
                page: 1,
            },
            () => {
                this.getList();
            }
        );
    };

    // 账户value获取
    getAccountValue = (e) => {
        this.setState(
            {
                accountValue: e,
                page: 1,
            },
            () => {
                this.getList();
            }
        );
    };

    // 关键字查询
    getInputValue = (e) => {
        this.setState(
            {
                inputValue: e.target.value,
                page: 1,
            },
            () => {
                if (this.searchFlag) {
                    clearTimeout(this.searchFlag);
                    this.searchFlag = false;
                }
                this.searchFlag = setTimeout(() => {
                    this.getList();
                }, 800);
            }
        );
    };

    // 新建弹窗显示
    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleCancel = (e) => {
        // 子组件请求完成，传入false，为false时，isedit改为初始值false，弹窗关闭
        if (e === false) {
            this.setState({
                isEdit: false,
            });
        }
        this.setState(
            {
                visible: false,
            },
            () => {
                this.getList();
            }
        );
    };

    // 管理分类弹窗显示
    showCatecoryModal = () => {
        this.setState({
            categoryVisible: true,
        });
    };

    // 管理分类弹窗关闭
    handleCategoryCancel = () => {
        this.setState({
            categoryVisible: false,
        });
    };

    categoryModalClose = () => {
        this.getPayItemCategory();
    };

    render() {
        const { page, total, pageSize, tableList, visible, id, isEdit, formList, categoryVisible } =
            this.state;
        const { accountList, payItemCategory } = this.props;
        const content = (
            <div className={styles.popover}>
                <div className={styles.confirmText}>
                    <span className={styles.textTitle}>您确定要删除收费项目吗？</span>
                    <span className={styles.textDescribe}>
                        删除后，该项目将同时从列表和通知中移除。请谨慎操作
                    </span>
                </div>
            </div>
        );
        const columns = [
            {
                title: trans('charge.serialNumber', '序号'),
                dataIndex: 'key',
                key: 'key',
                width: 80,
                render: (text, record) => <span>{record.key}</span>,
            },
            {
                title: trans('charge.projectName', '项目名称'),
                dataIndex: 'name',
                key: 'name',
                width: 300,
                render: (text) => <span>{text}</span>,
            },
            {
                title: trans('charge.enName', '英文名'),
                dataIndex: 'ename',
                key: 'ename',
                render: (text) => <span>{text}</span>,
            },
            {
                title: trans('charge.applicableSemester', '适用学段'),
                dataIndex: 'stageName',
                key: 'stageName',
                render: (record) => {
                    console.log(typeof record, 'cv');
                    return (
                        record &&
                        typeof record != 'string' &&
                        record.length &&
                        record.map((item) => {
                            return <span>{locale() == 'en' ? item.ename : item.name}&nbsp;</span>;
                        })
                    );
                },
            },
            {
                title: trans('charge.Numbering', '编号'),
                dataIndex: 'chargeItemNo',
                key: 'chargeItemNo',
            },
            {
                title: trans('charge.defaultAmount', '预设金额'),
                dataIndex: 'price',
                key: 'price',
            },
            {
                title: trans('charge.type', '类型'),
                dataIndex: 'categoryName',
                key: 'categoryName',
            },
            {
                title: trans('charge.escrowFee', '代管费'),
                dataIndex: 'tags',
                key: 'tags',
                render: (text, record) => {
                    if (record.tags == 0) {
                        return <span>否</span>;
                    } else if (record.tags == 1) {
                        return <span>是</span>;
                    }
                },
            },
            {
                title: trans('charge.accountsReceivable', '收款账户'),
                dataIndex: 'accountName',
                key: 'accountName',
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
                            overlayClassName={styles.popStyle}
                        >
                            <a>{trans('charge.delete', '删除')}</a>
                        </Popconfirm>
                    </span>
                ),
            },
        ];

        const data = [];
        if (tableList.length) {
            for (let i = 0; i < tableList.length; i++) {
                data.push({
                    key: i + 1,
                    id: tableList[i].id,
                    name: tableList[i].name,
                    ename: tableList[i].ename,
                    chargeItemNo: tableList[i].chargeItemNo,
                    price: tableList[i].price,
                    categoryName: tableList[i].categoryName,
                    tags: tableList[i].tags,
                    accountName: tableList[i].accountName,
                    categoryNo: tableList[i].categoryNo,
                    accountId: tableList[i].accountId,
                    remark: tableList[i].remark,
                    stageName: tableList[i].suitStage,
                    itemDiscountRatio: tableList[i].itemDiscountRatio,
                    itemDiscountType: tableList[i].itemDiscountType,
                });
            }
        }

        return (
            <div className={styles.chargePro}>
                <div className={styles.head}>
                    <span className={styles.title}>
                        {trans('charge.projectList', '收费项目列表')}
                    </span>
                    <span className={styles.data}>
                        {trans(
                            'charge.payItemCategorylength',
                            '共{$length}个项目类型，{$total}个收费项目',
                            {
                                length: payItemCategory.length,
                                total: total,
                            }
                        )}
                    </span>
                    <Button className={styles.btn} type="primary" onClick={this.showModal}>
                        {/* <i className={icon.iconfont}>&#xe75a;</i>&nbsp; */}
                        {trans('charge.addChargeProject', '新建收费项目')}
                    </Button>
                    <Button className={styles.type} type="default" onClick={this.showCatecoryModal}>
                        <i className={icon.iconfont}>&#xe6b3;</i>&nbsp;
                        {trans('charge.changeType', '收费类型')}
                    </Button>
                </div>
                <Form className={styles.form} layout="inline">
                    <Form.Item label={trans('charge.projectType', '收费类型')}>
                        <Select
                            placeholder={trans('charge.allType', '全部类型')}
                            size="large"
                            style={{ width: '168px' }}
                            onChange={this.getCategoryValue}
                        >
                            <Option value={null} key={null}>
                                {trans('charge.allType', '全部类型')}
                            </Option>
                            {payItemCategory &&
                                payItemCategory.length &&
                                payItemCategory.map((item, index) => {
                                    return (
                                        <Option
                                            value={item.categoryNo}
                                            key={item.categoryNo}
                                            title={item.name}
                                        >
                                            {locale() == 'en' ? item.ename : item.name}
                                        </Option>
                                    );
                                })}
                        </Select>
                    </Form.Item>
                    <Form.Item label={trans('charge.AccountsReceivable', '收款账户')}>
                        <Select
                            placeholder={trans('charge.allReceivable', '全部账户')}
                            size="large"
                            style={{ width: '168px' }}
                            onChange={this.getAccountValue}
                        >
                            <Option value={null} key={null}>
                                {trans('charge.allReceivable', '全部账户')}
                            </Option>
                            {accountList.data &&
                                accountList.data.length &&
                                accountList.data.map((item, index) => {
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
                    <Form.Item>
                        <Input
                            placeholder={trans('charge.keywordSearch', '请输入关键字搜索')}
                            size="large"
                            style={{ width: '280px', borderRadius: '8px', height: '36px' }}
                            onChange={this.getInputValue}
                        />
                    </Form.Item>
                </Form>

                <div className={styles.table}>
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

                <Modal
                    visible={visible}
                    footer={null}
                    onCancel={this.handleCancel.bind(this, false)}
                    destroyOnClose
                    width="1000px"
                    style={{ top: window.self != window.top ? 10 : 67 }}
                    className={
                        window.self != window.top ? styles.newChargeModal : styles.newChargeModal
                    }
                >
                    <NewChargePro
                        cancel={this.handleCancel}
                        isEdit={isEdit ? true : false}
                        id={isEdit ? id : null}
                        formList={formList}
                        visible={visible}
                    />
                </Modal>

                <Modal
                    visible={categoryVisible}
                    footer={null}
                    onCancel={this.handleCategoryCancel}
                    destroyOnClose
                    width="604px"
                    afterClose={this.categoryModalClose}
                    maskClosable={false}
                >
                    <Category confirm={this.handleCategoryCancel} />
                </Modal>
            </div>
        );
    }
}
