//club列表
import React, { PureComponent } from 'react';
import styles from './index.less';
import {
    Table,
    Select,
    Input,
    Form,
    DatePicker,
    Button,
    Pagination,
    Modal,
    Spin,
    Upload,
} from 'antd';
import { connect } from 'dva';
import lodash from 'lodash';
import { trans } from '../../utils/i18n';
import { debounce } from '../../utils/utils';
import OrderDetail from '../PayNotice/orderDetail.js';

const dateFormat = 'YYYY/MM/DD';
const { Option } = Select;
const { Search } = Input;

@connect((state) => ({
    changeList: state.account.changeList,
    balanceDetailsList: state.account.balanceDetailsList,
    filterLists: state.account.filterLists,
    orderDetailContent: state.pay.orderDetailContent, // 订单详情
}))
@Form.create()
export default class accoutChanges extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            stage: '',
            keyWord: '',
            changeType: '',
            changeManner: '',
            startTime: '',
            endTime: '',
            pageNo: 1,
            pageSize: 10,
            fileList: [],
            uploadNewCourse: false,
            errorVisible: false,
            isViewDetail: false, // 查看订单详情抽屉显隐
            orderDetailContent: '', // 订单详情数据
            canUseWallet: undefined,
        };
    }

    componentDidMount() {
        this.getUserWalletDetailList();
        this.getScreeningItems();
    }

    //余额变动明细表
    getUserWalletDetailList = () => {
        const { stage, keyWord, changeType, changeManner, startTime, endTime, pageNo, pageSize } =
            this.state;
        const { dispatch } = this.props;
        dispatch({
            type: 'account/getUserWalletDetailList',
            payload: {
                stage,
                keyWord,
                changeType,
                changeManner,
                startTime,
                endTime,
                pageNo,
                pageSize,
            },
        });
    };

    //余额变动筛选项
    getScreeningItems = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'account/getScreeningItems',
            payload: {},
        });
    };

    changeStage = (value) => {
        this.setState(
            {
                stage: value,
            },
            () => {
                this.getUserWalletDetailList();
            }
        );
    };

    changeMethod = (value) => {
        this.setState(
            {
                changeManner: value,
            },
            () => {
                this.getUserWalletDetailList();
            }
        );
    };

    changeManage = (value) => {
        this.setState(
            {
                changeType: value,
            },
            () => {
                this.getUserWalletDetailList();
            }
        );
    };

    changeKeyword = (e) => {
        this.setState({
            keyWord: e.target.value,
        });
    };

    // 更改开始时间
    changeStart = (date, dateString) => {
        console.log('date', date);
        console.log('dateString', dateString);
        if (!dateString) {
            this.setState(
                {
                    startTime: '',
                },
                () => {
                    this.getUserWalletDetailList();
                }
            );
            return;
        }
        this.setState(
            {
                startTime: `${dateString} 00:00:00`,
            },
            () => {
                this.getUserWalletDetailList();
            }
        );
    };

    // 更改结束时间
    changeEnd = (date, dateString) => {
        if (!dateString) {
            this.setState(
                {
                    endTime: '',
                },
                () => {
                    this.getUserWalletDetailList();
                }
            );
            return;
        }
        this.setState(
            {
                endTime: `${dateString} 23:59:59`,
            },
            () => {
                this.getUserWalletDetailList();
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
                this.getUserWalletDetailList();
            }
        );
    };

    changePageNum = (pageNumber) => {
        this.setState(
            {
                pageNo: pageNumber,
            },
            () => {
                this.getUserWalletDetailList();
            }
        );
    };

    //导出
    exportChangeList = () => {
        const { stage, keyWord, changeType, changeManner, startTime, endTime } = this.state;
        window.open(
            `/api/pay/wallet/exportUserWalletDetailList?stage=${stage}&keyWord=${keyWord}&changeType=${changeType}&changeManner=${changeManner}&startTime=${startTime}&endTime=${endTime}`
        );
    };

    //导入
    sureImport = (e) => {
        let { fileList } = this.state;
        let formData = new FormData();
        for (let item of fileList) {
            formData.append('courseFile', item);
        }
        if (!lodash.isEmpty(fileList)) {
            this.setState({
                uploadNewCourse: true,
            });
            this.props
                .dispatch({
                    type: 'account/importWalletDetailsList',
                    payload: formData,
                })
                .then(() => {
                    let { balanceDetailsList } = this.props;
                    this.setState({
                        uploadNewCourse: false,
                    });
                    if (
                        balanceDetailsList &&
                        balanceDetailsList.checkErrorMessageList &&
                        !lodash.isEmpty(balanceDetailsList.checkErrorMessageList)
                    ) {
                        this.setState({
                            fileList: [],
                            importErrorList: balanceDetailsList.checkErrorMessageList,
                            errorVisible: true,
                        });
                    } else {
                        this.setState({
                            fileList: [],
                            visibleFromExcel: false,
                            pageNo: 1,
                            pageSize: 10,
                        });
                        this.getUserWalletDetailList();
                    }
                });
        }
    };

    // 关闭Excel导入弹层
    excelModalClose = () => {
        this.setState({
            visibleFromExcel: false,
            fileList: [],
        });
    };

    // 查看详情
    viewDetail = (record) => {
        const { dispatch } = this.props;
        console.log('canUseWallet', record.canUseWallet);
        this.setState({
            canUseWallet: record.canUseWallet,
        });
        dispatch({
            type: 'pay/getAccountOderDetail',
            payload: {
                orderNo: record.orderNo,
                // tuitionPlanId: this.state.tuitionPlanId,
            },
        }).then(() => {
            this.setState({
                isViewDetail: true,

                orderDetailContent: this.props.orderDetailContent,
            });
        });
    };

    closeDrawer = () => {
        this.setState({
            isViewDetail: false,
        });
    };

    render() {
        const {
            stage,
            keyWord,
            changeType,
            changeManner,
            startTime,
            endTime,
            pageNo,
            pageSize,
            fileList,
            visibleFromExcel,
            uploadNewCourse,
            errorVisible,
            importErrorList,
            isViewDetail,
            canUseWallet,
            orderDetailContent,
        } = this.state;
        const { changeList, filterLists } = this.props;
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
                title: '变动金额',
                dataIndex: 'changeAmount',
                key: 'changeAmount',
                align: 'center',
                render: (text, record, index) => {
                    return (
                        <>
                            {record.changeType == 1 ? <span>+ {text}</span> : ''}
                            {record.changeType == 2 ? (
                                <span style={{ color: 'red' }}>- {text}</span>
                            ) : (
                                ''
                            )}
                        </>
                    );
                },
            },
            {
                title: '变动方式',
                dataIndex: 'changeMannerName',
                key: 'changeMannerName',
                align: 'center',
            },
            {
                title: '变动说明',
                dataIndex: 'remark',
                key: 'remark',
                align: 'center',
                render: (text, record, index) => {
                    return (
                        <>
                            <span>{text}</span>
                            <span>
                                {record && record.orderNo ? (
                                    <a
                                        onClick={this.viewDetail.bind(this, record)}
                                        style={{ marginLeft: '16px' }}
                                    >
                                        {trans('student.detail', '详情')}
                                    </a>
                                ) : null}
                            </span>
                        </>
                    );
                },
            },
            {
                title: '变动时间',
                dataIndex: 'changeTime',
                key: 'changeTime',
                align: 'center',
            },
            {
                title: '操作人',
                dataIndex: 'createUserName',
                key: 'createUserName',
                align: 'center',
            },
        ];
        let tableData = (changeList.data && changeList.data.payWalletDetailModelList) || [];
        let totalNum = changeList && changeList.total;
        let allChangeAmount = (changeList.data && changeList.data.allChangeAmount) || [];
        let increaseChangeAmount = (changeList.data && changeList.data.increaseChangeAmount) || [];
        let reduceChangeAmount = (changeList.data && changeList.data.reduceChangeAmount) || [];

        let payChangeMannerVOList = (filterLists && filterLists.payChangeMannerVOList) || [];
        let payChangeTypeVOList = (filterLists && filterLists.payChangeTypeVOList) || [];

        let errorColumns = [
            {
                title: '原文件行号',
                dataIndex: 'lineNumber',
                width: 110,
                key: 'lineNumber',
                align: 'center',
            },
            {
                title: '错误信息',
                dataIndex: 'errorMessage',
                key: 'errorMessage',
                align: 'center',
            },
        ];

        const uploadProps = {
            onRemove: (file) => {
                this.setState((state) => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {
                this.setState((state) => ({
                    fileList: [...state.fileList, file],
                }));
                return false;
            },
            fileList,
        };
        return (
            <>
                <div>
                    <p style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>
                            学段
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
                            变动方式
                            <Select
                                style={{ width: 150, margin: '0 10px' }}
                                placeholder="全部"
                                onChange={this.changeMethod}
                                value={changeManner}
                            >
                                <Option key={0} value={''}>
                                    全部
                                </Option>
                                {/* <Option key={1} value={1}>
                                    账户收入
                                </Option>
                                <Option key={2} value={2}>
                                    账户支出
                                </Option> */}
                                {payChangeMannerVOList &&
                                    payChangeMannerVOList.map((item, index) => {
                                        return (
                                            <Option key={item.type} value={item.type}>
                                                {item.typeName}
                                            </Option>
                                        );
                                    })}
                            </Select>
                            变动类型
                            <Select
                                style={{ width: 150, margin: '0 10px' }}
                                placeholder="全部"
                                onChange={this.changeManage}
                                value={changeType}
                            >
                                <Option key={0} value={''}>
                                    全部
                                </Option>
                                {/* <Option key={1} value={1}>
                                    财务结算
                                </Option>
                                <Option key={2} value={2}>
                                    财务退款
                                </Option>
                                <Option key={3} value={3}>
                                    余额抵扣
                                </Option> */}
                                {payChangeTypeVOList &&
                                    payChangeTypeVOList.map((item, index) => {
                                        return (
                                            <Option key={item.type} value={item.type}>
                                                {item.typeName}
                                            </Option>
                                        );
                                    })}
                            </Select>
                            <Search
                                style={{ width: 250 }}
                                placeholder="请输入学生姓名/学号搜索"
                                onChange={this.changeKeyword}
                                // onPressEnter={this.getUserWalletDetailList}
                                onSearch={this.getUserWalletDetailList}
                                value={keyWord}
                            />
                        </span>
                        <span>
                            <Button
                                type="primary"
                                className={styles.btn}
                                onClick={this.exportChangeList}
                            >
                                导出
                            </Button>
                            <Button
                                style={{ marginLeft: '10px' }}
                                className={styles.btn}
                                onClick={() => {
                                    this.setState({
                                        visibleFromExcel: true,
                                    });
                                }}
                                type="primary"
                                shape="round"
                            >
                                导入
                            </Button>
                        </span>
                    </p>
                    <p>
                        <span>
                            时间段
                            <DatePicker
                                // showTime
                                onChange={this.changeStart}
                                onOk={this.getUserWalletDetailList}
                                style={{ margin: '0 10px' }}
                            />
                            -
                            <DatePicker
                                // showTime
                                onChange={this.changeEnd}
                                onOk={this.getUserWalletDetailList}
                                style={{ margin: '0 10px' }}
                            />
                        </span>
                    </p>
                    <p>
                        <span>
                            <span style={{ fontSize: '30px' }}>¥ {allChangeAmount}</span>变动合计
                        </span>
                        <span style={{ margin: '0 60px' }}>
                            <span style={{ fontSize: '30px' }}>¥ {increaseChangeAmount}</span>
                            增加项合计
                        </span>
                        <span>
                            <span style={{ fontSize: '30px' }}>¥ {reduceChangeAmount}</span>
                            减少项合计
                        </span>
                    </p>
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
                <Modal
                    title="导入学生账户变动明细"
                    visible={visibleFromExcel}
                    onCancel={this.excelModalClose}
                    onOk={debounce(this.sureImport)}
                    className={styles.exportModal}
                    okText={trans('global.importScheduleConfirm', '确认导入')}
                >
                    <Spin
                        spinning={uploadNewCourse}
                        tip={trans('global.file uploading', '文件正在上传中')}
                    >
                        <div>
                            <p>
                                <span style={{ marginRight: '8px' }}>①</span>
                                下载导入模板，批量填写余额变动明细
                                <a
                                    href="/api/pay/wallet/exportUserWalletDetailTemplateExcel"
                                    target="_blank"
                                    style={{ marginLeft: '20px' }}
                                >
                                    {trans('global.downloadImportTemplate', '下载导入模板')}
                                </a>
                            </p>
                            <p>
                                <span style={{ marginRight: '8px' }}>②</span>
                                {trans('global.uploadForm', '上传填写好的信息表')}
                            </p>
                        </div>
                        <div className={styles.upLoad}>
                            <span className={styles.desc}>
                                <span className={styles.fileBtn}>
                                    <Form
                                        id="uploadForm"
                                        layout="inline"
                                        method="post"
                                        className={styles.form}
                                        encType="multipart/form-data"
                                    >
                                        <Upload size="small" {...uploadProps} maxCount={1}>
                                            <Button>
                                                {trans('global.scheduleSelectFile', '选择文件')}
                                            </Button>
                                        </Upload>
                                    </Form>
                                </span>
                            </span>
                        </div>
                    </Spin>
                </Modal>

                <Modal
                    className={styles.errorStyle}
                    visible={errorVisible}
                    footer={[
                        <Button
                            type="primary"
                            className={styles.reUpload}
                            onClick={() => {
                                this.setState({
                                    fileList: [],
                                    errorVisible: false,
                                });
                            }}
                        >
                            {trans('global.uploadAgain', '重新上传')}
                        </Button>,
                    ]}
                    onCancel={() =>
                        this.setState({
                            errorVisible: false,
                            fileList: [],
                        })
                    }
                    title="导入学生账户变动明细"
                    width={720}
                >
                    <p style={{ textAlign: 'center' }}>
                        {trans('global.thereAre', '当前上传的文件中共有')} &nbsp;
                        <span style={{ color: 'red' }}>
                            {importErrorList && importErrorList.length > 0
                                ? importErrorList.length
                                : null}{' '}
                        </span>
                        &nbsp;
                        {trans('global.pleaseUploadAgain', '条错误，请调整后重新上传')}
                    </p>
                    <Table
                        columns={errorColumns}
                        dataSource={importErrorList}
                        rowKey="lineNumber"
                        pagination={false}
                    ></Table>
                </Modal>

                {isViewDetail ? (
                    <OrderDetail
                        isViewDetail={isViewDetail}
                        useWallet={canUseWallet}
                        orderDetailContent={orderDetailContent}
                        closeDrawer={this.closeDrawer}
                    />
                ) : null}
            </>
        );
    }
}
