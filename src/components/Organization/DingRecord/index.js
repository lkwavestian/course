//机构管理--同步钉钉
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Table, Pagination, Modal, Form, Icon, Spin } from 'antd';
import styles from './index.less';
import icon from '../../../icon.less';
import { formatAllTime } from '../../../utils/utils';
import PowerPage from '../../PowerPage/index';

@Form.create()
@connect((state) => ({
    recordTable: state.organize.recordTable, //同步钉钉记录
    ddNodeInfo: state.teacher.ddNodeInfo,
    powerStatus: state.global.powerStatus, //是否有权限
}))
export default class DingdingComponent extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            current: 1,
            pageSize: 10,
            dingCogradientVisible: false,
            recordVisible: false, //查看钉钉同步记录
            canClick: true, //按钮是否可以点击
            canClickOrg: true, //同步员工组织按钮是否可以点击
            canClickParent: true, //同步学生家长按钮是否可以点击
            isShowEmployeeBtn: false, //是否显示同步员工按钮
            isShowOrgBtn: false, //是否显示同步员工组织按钮
            loading: false, //loading加载
        };
    }

    componentWillMount() {
        this.getDingRecord();
        //判断是否有权限
        this.ifHavePower().then(() => {
            const { powerStatus } = this.props;
            let responseContent = powerStatus.content || [];
            if (responseContent.indexOf('smart:teaching:sync:employee') != -1) {
                //同步员工
                this.setState({
                    isShowEmployeeBtn: true,
                });
            } else {
                this.setState({
                    isShowEmployeeBtn: false,
                });
            }
            if (responseContent.indexOf('smart:teaching:sync:employeeOrg') != -1) {
                //同步员工组织
                this.setState({
                    isShowOrgBtn: true,
                });
            } else {
                this.setState({
                    isShowOrgBtn: false,
                });
            }
        });
    }

    //获取钉钉同步记录
    getDingRecord() {
        const { dispatch } = this.props;
        const { pageSize, current } = this.state;
        this.setState({
            loading: true,
        });
        dispatch({
            type: 'organize/fetchRecord',
            payload: {
                pageNum: current,
                pageSize: pageSize,
            },
        }).then(() => {
            this.setState({
                loading: false,
            });
        });
    }

    //切换分页
    switchPage = (page, size) => {
        this.setState(
            {
                current: page,
                pageSize: size,
            },
            () => {
                this.getDingRecord();
            }
        );
    };

    //切换每页条数
    switchPageSize = (page, size) => {
        this.setState(
            {
                current: page,
                pageSize: size,
            },
            () => {
                this.getDingRecord();
            }
        );
    };

    //确认钉钉同步信息
    confirmNodeInfo = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'teacher/confirmDdNodeInfo',
            payload: {},
        });
    };

    handleCancel = () => {
        const { form } = this.props;
        this.setState({
            dingCogradientVisible: false,
        });
        form.resetFields();
    };

    openDdCogradient = () => {
        this.setState(
            {
                dingCogradientVisible: true,
            },
            () => {
                //this.confirmNodeInfo()
            }
        );
    };

    handleOk = (e) => {
        const { dispatch, form } = this.props;
        e.preventDefault();
        if (!this.state.canClickOrg) {
            return false;
        }
        this.setState({
            canClickOrg: false,
        });
        dispatch({
            type: 'organize/teacheSyncOrg',
            payload: {},
            onSuccess: () => {
                this.handleCancel();
                form.resetFields();
            },
        }).then(() => {
            this.setState({
                canClickOrg: true,
            });
        });
    };

    //同步钉钉人员到教务中心
    employeeJoinIn = () => {
        const { dispatch } = this.props;
        if (!this.state.canClick) {
            return false;
        }
        this.setState({
            canClick: false,
        });
        dispatch({
            type: 'organize/employeeJoinIn',
            payload: {},
            onSuccess: () => {},
        }).then(() => {
            this.setState({
                canClick: true,
            });
        });
    };

    //同步学生家长
    cogradientParent = () => {
        const { dispatch } = this.props;
        if (!this.state.canClickParent) {
            return false;
        }
        this.setState({
            canClickParent: false,
        });
        dispatch({
            type: 'organize/cogradientParent',
            payload: {},
        }).then(() => {
            this.setState({
                canClickParent: true,
            });
        });
    };

    //判断是否有权限访问
    ifHavePower() {
        const { dispatch } = this.props;
        return dispatch({
            type: 'global/havePower',
            payload: {},
        });
    }

    render() {
        const {
            recordTable,
            ddNodeInfo,
            form: { getFieldDecorator },
            powerStatus,
        } = this.props;
        const {
            current,
            dingCogradientVisible,
            canClick,
            canClickOrg,
            isShowEmployeeBtn,
            isShowOrgBtn,
            canClickParent,
            loading,
        } = this.state;
        let totalPage = recordTable && recordTable.total;
        let dataSource = (recordTable && recordTable.content) || [];
        let formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };

        let columns = [
            {
                title: '标题',
                dataIndex: 'title',
                key: 'title',
                align: 'center',
            },
            {
                title: '操作人',
                dataIndex: 'creator',
                key: 'creator',
                align: 'center',
            },
            {
                title: '总数',
                dataIndex: 'total',
                key: 'total',
                align: 'center',
            },
            {
                title: '同步时间',
                dataIndex: 'createTime',
                key: 'createTime',
                align: 'center',
                render: function (text, record) {
                    return <span>{formatAllTime(text)}</span>;
                },
            },
            {
                title: '查看同步日志',
                key: 'downLoadUrl',
                dataIndex: 'downLoadUrl',
                align: 'center',
                render: function (text, record) {
                    let url = window.location.origin + text;
                    return (
                        <a className={styles.downloadUrl} target="_blank" href={url}>
                            <i className={icon.iconfont}>&#xe69c;</i>
                        </a>
                    );
                },
            },
        ];
        let havePower = recordTable && recordTable.unauthorized; //判断用户是否有权限
        if (havePower === true) {
            return (
                <div className={styles.frameworkPage}>
                    <PowerPage />
                </div>
            );
        }
        //判断是否有操作同步学生家长的权限
        let havePowerOperParent =
            powerStatus.content &&
            powerStatus.content.indexOf('smart:teaching:dingding:sync:parent') != -1
                ? true
                : false;

        dataSource.map((el, i) => (el.key = i));
        return (
            <div className={styles.frameworkPage}>
                <div className={styles.cogradientOrg}>
                    {canClick === true
                        ? isShowEmployeeBtn === true && (
                              <span onClick={this.employeeJoinIn}>
                                  <i className={icon.iconfont}>&#xe66e;</i> 同步员工
                              </span>
                          )
                        : isShowEmployeeBtn === true && (
                              <span>
                                  <Icon type="sync" spin /> 同步进行中...
                              </span>
                          )}
                    {isShowOrgBtn && (
                        <span onClick={this.openDdCogradient}>
                            <i className={icon.iconfont}>&#xe66d;</i> 同步员工组织
                        </span>
                    )}
                    {canClickParent === true
                        ? havePowerOperParent && (
                              <span onClick={this.cogradientParent}>
                                  <i className={icon.iconfont}>&#xe671;</i> 同步学生家长
                              </span>
                          )
                        : havePowerOperParent && (
                              <span>
                                  <Icon type="sync" spin /> 同步进行中...
                              </span>
                          )}
                    <span
                        className={styles.reloadBtn}
                        onClick={() => {
                            this.getDingRecord();
                        }}
                    >
                        <i className={icon.iconfont}>&#xe732;</i> 刷新纪录
                    </span>
                </div>
                <div className={styles.recordTable}>
                    <Spin spinning={loading} tip="loading...">
                        <Table
                            rowKey={(record) => record.key}
                            bordered
                            dataSource={dataSource}
                            columns={columns}
                            pagination={false}
                            style={{ background: '#fff' }}
                        />
                    </Spin>
                </div>
                <div className={styles.paginationStyle}>
                    <div className={styles.pageContainer}>
                        <Pagination
                            showSizeChanger
                            showQuickJumper
                            current={current}
                            total={totalPage}
                            locale="zh-CN"
                            pageSizeOptions={['10', '20', '40', '100']}
                            onChange={this.switchPage}
                            onShowSizeChange={this.switchPageSize}
                        />
                    </div>
                </div>

                <Modal
                    visible={dingCogradientVisible}
                    title="同步员工组织"
                    footer={null}
                    width="500px"
                    onCancel={this.handleCancel}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="同步范围">
                            {getFieldDecorator('range')(
                                <span>{ddNodeInfo && ddNodeInfo.range}</span>
                            )}
                        </Form.Item>
                        <Form.Item label="钉钉企业">
                            {getFieldDecorator('department')(
                                <span>{ddNodeInfo && ddNodeInfo.department}</span>
                            )}
                        </Form.Item>
                        <Form.Item label="钉钉组织根节点">
                            {getFieldDecorator('node')(
                                <span>{ddNodeInfo && ddNodeInfo.rootName}</span>
                            )}
                        </Form.Item>
                        <div className={styles.operationList}>
                            <a>
                                {canClickOrg === true ? (
                                    <span
                                        className={styles.modalBtn + ' ' + styles.submitBtn}
                                        onClick={this.handleOk}
                                    >
                                        确认同步
                                    </span>
                                ) : (
                                    <span className={styles.modalBtn + ' ' + styles.submitBtn}>
                                        <Icon type="sync" spin /> 同步进行中...
                                    </span>
                                )}
                            </a>
                        </div>
                    </Form>
                </Modal>
            </div>
        );
    }
}
