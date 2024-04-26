//club列表
import React, { PureComponent } from 'react';
import styles from './index.less';
import {
    Button,
    Form,
    Input,
    Select,
    DatePicker,
    Popconfirm,
    Table,
    Pagination,
    Modal,
    message,
} from 'antd';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import icon from '../../icon.less';
import moment from 'moment';
import { formatTime, getUrlSearch } from '../../utils/utils';
import DownloadList from './downloadList.js';
import NewNoticePro from './newNoticePro.js';
import PayDetail from './detail.js';
import { locale } from 'moment';
import { trans } from '../../utils/i18n';
const dateFormat = 'YYYY-MM-DD';

const { Option } = Select;

@connect((state) => ({
    selectTuitionPlanList: state.pay.selectTuitionPlanList,
    campusAndStage: state.pay.campusAndStage, // 查询年级和学段
    editTimeMsg: state.pay.timeMsg, // 修改截至日期
    delNoticeMsg: state.pay.delNoticeMsg, // 删除缴费通知
    updatePlanList: state.pay.updatePlanList, // 编辑通知回显
    selectPlanStatusData: state.pay.selectPlanStatusData, // 统计缴费通知列表发送状态总数
}))
export default class PayNotice extends PureComponent {
    constructor(props) {
        super(props);
        // this.DownloadList = React.createRef();
        this.state = {
            page: 1, // 页码
            total: null, // 总数
            pageSize: 10, // 每页展示条数
            visible: false, // 新建通知显隐
            tableList: [], // 首页列表
            stage: null, // 学段存储
            campus: null, // 校区存储
            deadlineBegin: '', // 截止日期开始
            deadlineEnd: '',
            lastSenderDateBegin: '', // 最后发送时间开始
            lastSenderDateEnd: '',
            keyValue: '', // 关键字搜索value
            submitStatus: null, // 通知状态存储
            timeVisible: false, // 修改日期显隐
            timeValue: null, // 日期value
            planName: '', // 修改日期显示的标题
            planId: '', // 修改日期需要的id
            isShowDetail: 1, // 详情页面控制，1为首页，2详情页
            detailList: '', // 点击详情出入该条数据
            isEdit: false, // 是否为编辑状态
            tuitionPlanId: '',
            tabsStyle: true,
            editStatus: false,
            downloadListVisible: false,
            isTrue: true,
            oneKeyHandtuiTionType: false, //是否一键收学费进入编辑modal
            editModalValue: [], //一键收学费编辑回显内容
            addEdit: false,
            loading: false,
            downloadStudentDetailPermission: false, //下载学生名单权限
            createTuitionFeePermission: false, //创建学费计划权限
        };
    }

    componentDidMount() {
        if (getUrlSearch('planId')) {
            this.setState(
                {
                    isShowDetail: 2,
                    tuitionPlanId: getUrlSearch('planId'),
                    editStatus: true,
                },
                () => {
                    // this.handleEditPlan(getUrlSearch('planId'));
                    document.getElementById('header').style.display = 'none';
                }
            );
        }
        this.getTableList();
        this.getCampusAndStage();
        this.getSelectData();
        this.getUserDetail();
    }

    // 获取校区学段
    getCampusAndStage = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'pay/selectTeachingOrgStage',
        });
    };

    //获取用户信息
    getUserDetail = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'global/getCurrentUser',
            onSuccess: (res) => {
                this.setState({
                    createTuitionFeePermission: res.createTuitionFeePermission,
                    downloadStudentDetailPermission: res.downloadStudentDetailPermission,
                });
            },
        });
    };

    getTableList = () => {
        const { dispatch } = this.props;
        const {
            keyValue,
            submitStatus,
            page,
            pageSize,
            stage,
            campus,
            deadlineBegin,
            deadlineEnd,
            lastSenderDateBegin,
            lastSenderDateEnd,
            tabsStyle,
        } = this.state;

        dispatch({
            type: 'pay/selectTuitionPlan',
            payload: {
                campusId: campus,
                deadlineBegin: deadlineBegin,
                deadlineEnd: deadlineEnd,
                lastSenderDateBegin: lastSenderDateBegin,
                lastSenderDateEnd: lastSenderDateEnd,
                matchName: keyValue,
                orgId: null,
                pageNum: page,
                pageSize: pageSize,
                stage: stage,
                submitStatus: submitStatus,
                personalPan: tabsStyle ? true : false,
            },
        }).then(() => {
            const { selectTuitionPlanList } = this.props;
            this.setState({
                total: selectTuitionPlanList.total,
                tableList: selectTuitionPlanList.data,
            });
        });
    };
    //我发出的
    mySend = () => {
        this.setState(
            {
                tabsStyle: true,
            },
            () => {
                this.getTableList();
                this.getSelectData();
            }
        );
    };
    //全部通知
    allSend = () => {
        this.setState(
            {
                tabsStyle: false,
            },
            () => {
                this.getTableList();
                this.getSelectData();
            }
        );
    };

    //下载学生名单
    downloadList = () => {
        this.setState({
            downloadListVisible: true,
            isTrue: true,
        });
    };
    isLoading = (value) => {
        this.setState({
            loading: value,
        });
    };
    changeVisible = (value) => {
        const { dispatch } = this.props;
        console.log('value', value);
        if (value.studentType) {
            const payload = {
                studentType: value.studentType,
                studentStage: value.studentStage,
                gradeList: value.grade,
                semesterValue: value.semesterValue,
            };
            dispatch({
                type: 'pay/getStudentTuitionPlan',
                payload,
                onSuccess: (res) => {
                    this.setState({
                        downloadListVisible: false,
                        visible: true,
                        isEdit: true,
                        oneKeyHandtuiTionType: true,
                        detail: '2',
                        addEdit: true,
                        loading: false,
                        editModalValue: res.content,
                    });
                    this.downLoad.recoverStatus();
                },
            }).then((item) => {
                this.setState({
                    loading: false,
                });
            });
        } else if (value == false) {
            this.setState({
                downloadListVisible: value,
                // visible: true,
                detail: '2',
            });
        }
    };

    getSelectData = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'pay/selectTuitionPlanListStatus',
            payload: {
                personalPan: this.state.tabsStyle ? true : false,
            },
        });
    };

    getCampusValue = (value) => {
        this.setState(
            {
                campus: value,
            },
            () => {
                this.getTableList();
            }
        );
    };

    getPeriodValue = (value) => {
        this.setState(
            {
                stage: value,
            },
            () => {
                this.getTableList();
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

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    oneKeytuiTion = () => {
        this.setState({
            downloadListVisible: true,
            isTrue: false,
        });
    };

    // 缴费通知弹窗关闭
    handleCancel = () => {
        this.setState(
            {
                visible: false,
                isEdit: false,
            },
            () => {
                // this.getTableList()
                // this.getSelectData()
            }
        );
    };

    handleEdit = () => {};

    popoverOk = (record) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'pay/delTuitionPlan',
            payload: {
                tuitionPlanId: record.id,
            },
        }).then(() => {
            const { delNoticeMsg } = this.props;
            if (delNoticeMsg && delNoticeMsg.status) {
                message.success(delNoticeMsg.message);
                this.getTableList();
                this.getSelectData();
            }
        });
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

    getSendLineBegin = (data, dataString) => {
        this.setState(
            {
                lastSenderDateBegin: dataString ? dataString + ' 00:00:00' : '',
                page: 1,
            },
            () => {
                this.getTableList();
            }
        );
    };

    getSendLineEnd = (data, dataString) => {
        this.setState(
            {
                lastSenderDateEnd: dataString ? dataString + ' 23:59:59' : '',
                page: 1,
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
                if (this.searchTime) {
                    clearTimeout(this.searchTime);
                    this.searchTime = false;
                }
                this.searchTime = setTimeout(() => {
                    this.getTableList();
                }, 800);
            }
        );
    };

    selectStatus = (e) => {
        if (e == this.state.submitStatus) {
            e = null;
        }
        this.setState(
            {
                submitStatus: e,
                page: 1,
            },
            () => {
                this.getTableList();
            }
        );
    };

    handleTimeCancel = () => {
        this.setState({
            timeVisible: false,
        });
    };

    showTimeModal = (record) => {
        this.setState({
            timeVisible: true,
            timeValue: record.deadline,
            planName: record.name,
            planId: record.id,
        });
    };

    timeChange = (data, dataString) => {
        this.setState({
            timeValue: dataString,
        });
    };

    confirmUpdateTime = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'pay/updateTuitionPlan',
            payload: {
                tuitionPlanId: this.state.planId,
                deadline: this.state.timeValue ? this.state.timeValue + ' 23:59:59' : '',
            },
        }).then(() => {
            const { editTimeMsg } = this.props;
            if (editTimeMsg.status) {
                this.getTableList();
                message.success(editTimeMsg.message);
                this.setState({
                    timeVisible: false,
                });
            } else {
                message.error(editTimeMsg.message);
            }
        });
    };

    // 详情操作
    // showDetail = (record) => {
    //     this.setState(
    //         {
    //             isShowDetail: 1,
    //             tuitionPlanId: record.id,
    //         },
    //         () => {
    //             // window.open('http://10.0.192.53:8001/#/charge/index', );
    //             <Link to="/address/detail" className={styles.logoTitle}></Link>
    //         }
    //     );
    // };

    // 详情页返回首页，
    changeStatus = (e) => {
        this.setState(
            {
                isShowDetail: e,
            },
            () => {
                document.getElementById('header').style.display = 'block';
                this.getTableList();
                this.getSelectData();
            }
        );
    };

    // 编辑
    handleEditPlan = (record) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'pay/getUpdatePayTuitionPlanDetail',
            payload: {
                tuitionPlanId: record.id,
            },
        }).then(() => {
            this.setState({
                visible: true,
                isEdit: true,
            });
        });
    };

    closeEdit = (e, planId, bol) => {
        // 1保存并发送，2// 保存
        if (e === 1) {
            this.setState(
                {
                    visible: false,
                    isEdit: false,
                },
                () => {
                    this.getTableList();
                    this.getSelectData();
                }
            );
        } else if (e === 2) {
            document.getElementById('header').style.display = 'none';
            this.setState({
                visible: false,
                isShowDetail: 2, // 保存成功显示详情页
                tuitionPlanId: planId,
            });
        } else {
            this.setState({
                visible: true,
            });
        }
        // this.setState({
        //     visible:false
        // })
        // window.open(`#/address/detail?planId=${planId}`,'_self')let urlObj = new URL(window.location.href);
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
        console.log('bol', bol);
        // debugger
        if (bol == true) {
            window.location.reload();
        } else {
            this.replaceParamVal('planId', planId);
        }
    };

    replaceParamVal = (paramName, replaceWith) => {
        var oUrl = window.location.href.toString();
        var re = eval('/(' + paramName + '=)([^&]*)/gi');
        var nUrl = oUrl.replace(re, paramName + '=' + replaceWith);
        // window.location = nUrl;
        window.location.replace(nUrl);
        // window.location.href=nUrl
    };

    replaceUrlArg = (url, arg, argVal) => {
        const urlObj = new URL(url);
        urlObj.searchParams.set(arg, argVal);
        console.log('href', urlObj.href);
        return urlObj.href;
    };

    disabledDate = (current) => {
        return current && current < moment(new Date()).subtract(1, 'days');
    };
    //列表点击行
    simpleClick = (record) => {
        window.open(
            `#/address/detail?planId=${record.id}`,
            window.self != window.top ? '_self' : '_blank'
        );
        // http://localhost:8002/#/address/detail?planId=4
    };

    // 缴费通知首页
    homeIndex = () => {
        const { campusAndStage, updatePlanList, selectPlanStatusData } = this.props;
        const {
            isEdit,
            planName,
            timeValue,
            timeVisible,
            page,
            total,
            pageSize,
            visible,
            tableList,
            submitStatus,
            loading,
        } = this.state;
        const content = (
            <div className={styles.popover}>
                <div className={styles.confirmText}>
                    <span className={styles.textTitle}>
                        {trans('charge.isDeleteNotice', '您确定要删除通知吗')}
                    </span>
                    <span className={styles.textDescribe}>
                        {trans('charge.afterDeletion', '删除后，所有配置信息和关联人员将被清空')}
                    </span>
                </div>
            </div>
        );
        let origin = '';
        if (typeof homeHost != 'undefined' && typeof homeHost == 'string') {
            if (homeHost != '') {
                origin = 'https://' + homeHost;
            } else {
                origin =
                    window.location.origin.indexOf('yungu.org') > -1
                        ? 'https://task.yungu.org'
                        : 'https://task.daily.yungu-inc.org';
            }
        }

        const columns = [
            {
                title: trans('charge.serialNumber', '序号'),
                dataIndex: 'key',
                key: 'key',
                width: 60,
                render: (text, record) => <span>{record.key}</span>,
            },
            {
                title: trans('charge.noticeName', '通知名称'),
                dataIndex: 'name',
                key: 'name',
                width: 200,
                render: (text, record) => {
                    console.log(record, '122222');
                    return <span>{locale() == 'en' ? record.enName : text}</span>;
                },
            },
            {
                title: trans('charge.noticeStatus', '通知状态'),
                dataIndex: 'sendStatus',
                key: 'sendStatus',
                render: (text, record) => {
                    if (record.status == 1) {
                        return (
                            <span
                                style={{ width: '60px', display: 'inline-block', color: '#E9B635' }}
                            >
                                {trans('charge.Unsent', '未发送')}
                            </span>
                        );
                    } else if (record.status == 2) {
                        return (
                            <span
                                style={{ width: '60px', display: 'inline-block', color: '#4d7fff' }}
                            >
                                {trans('charge.has_been_sent', '已发送')}
                            </span>
                        );
                    } else if (record.status == 3) {
                        return (
                            <span style={{ width: '60px', display: 'inline-block', color: '#999' }}>
                                {trans('charge.expired', '已截止')}
                            </span>
                        );
                    }
                },
            },
            {
                title: trans('charge.deadlineStatus', '截止状态'),
                dataIndex: 'endStatus',
                key: 'endStatus',
                render: (text, record) => {
                    if (record.endStatus == 1) {
                        return (
                            <span
                                style={{ width: '60px', display: 'inline-block', color: '#4d7fff' }}
                            >
                                {trans('charge.processing', '进行中')}
                            </span>
                        );
                    } else if (record.endStatus == 2) {
                        return (
                            <span style={{ width: '60px', display: 'inline-block', color: '#999' }}>
                                {trans('charge.expired', '已截止')}
                            </span>
                        );
                    }
                },
            },
            {
                title: trans('charge.persons', '总人数'),
                dataIndex: 'totalPerson',
                key: 'totalPerson',
                width: 80,
                render: (text, record) => {
                    return (
                        <span style={{ width: '45px', display: 'inline-block' }}>
                            {record.totalPerson}
                        </span>
                    );
                },
            },
            {
                title: trans('pay.payed', '已缴清'),
                dataIndex: 'paymentCompletedUsers',
                key: 'paymentCompletedUsers',
                width: 80,
                render: (text, record) => {
                    return (
                        <span style={{ width: '45px', display: 'inline-block' }}>
                            {record.paymentCompletedUsers}
                        </span>
                    );
                },
            },
            {
                title: trans('charge.noPay', '未缴清'),
                dataIndex: 'paymentUncompletedUsers',
                key: 'paymentUncompletedUsers',
                width: 100,
                render: (text, record) => {
                    return (
                        <span style={{ width: '45px', display: 'inline-block' }}>
                            {record.paymentUncompletedUsers}
                        </span>
                    );
                },
            },
            {
                title: trans('charge.closed', '已关闭'),
                dataIndex: 'closed',
                key: 'closed',
                // width: 60,
                render: (text, record) => {
                    return (
                        <span style={{ width: '45px', display: 'inline-block' }}>
                            {record.closed}
                        </span>
                    );
                },
            },
            {
                title: trans('charge.expirationDate', '截至日期'),
                dataIndex: 'deadline',
                key: 'deadline',
                // width: 100,
            },
            {
                title: trans('charge.sendDate', '发送日期'),
                dataIndex: 'lastSenderDate',
                key: 'lastSenderDate',
            },
            {
                title: trans('charge.addPerson', '创建人'),
                dataIndex: 'createUserName',
                key: 'createUserName',
                render: (t, r) => {
                    return <span>{locale() == 'en' ? r.createUserEnName : t}</span>;
                },
            },
            {
                title: trans('charge.section', '学段'),
                dataIndex: 'sectionName',
                key: 'sectionName',
            },
            {
                title: trans('charge.operate', '操作'),
                key: 'action',
                render: (text, record) => {
                    return (
                        <span
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            <a
                                style={{ marginRight: 16 }}
                                onClick={this.showTimeModal.bind(this, record)}
                            >
                                {trans('charge.changeDate', '更改日期')}
                            </a>
                            <Link
                                to={`/address/detail?planId=${record.id}`}
                                target={window.self != window.top ? '_self' : '_blank'}
                                className={styles.logoTitle}
                            >
                                <a style={{ marginRight: 16 }}>{trans('student.detail', '详情')}</a>
                            </Link>

                            {record.status == 1 ? (
                                <span style={{ display: 'inline-block' }}>
                                    <a
                                        style={{ marginRight: 16 }}
                                        onClick={this.handleEditPlan.bind(this, record)}
                                    >
                                        {trans('charge.edit', '编辑')}
                                    </a>
                                    <Popconfirm
                                        placement="top"
                                        title={content}
                                        onConfirm={this.popoverOk.bind(this, record)}
                                        okText={trans('charge.isdelete', '确认删除')}
                                        cancelText={trans('charge.cancel', '取消')}
                                        icon={null}
                                    >
                                        <a>{trans('charge.delete', '删除')}</a>
                                    </Popconfirm>
                                </span>
                            ) : null}
                        </span>
                    );
                },
            },
        ];

        const data = [];
        if (tableList && tableList.length) {
            for (let i = 0; i < tableList.length; i++) {
                let time =
                    (tableList[i] &&
                        tableList[i].deadline &&
                        tableList[i].deadline.substr(0, 10)) ||
                    '';

                data.push({
                    key: i + 1,
                    id: tableList[i].id,
                    name: tableList[i].zhName,
                    enName: tableList[i].enName,
                    status: tableList[i].submitStatus,
                    endStatus: tableList[i].endStatus,
                    totalPerson: tableList[i].totalUsers,
                    paymentCompletedUsers: tableList[i].paymentCompletedUsers,
                    paymentUncompletedUsers: tableList[i].paymentUncompletedUsers,
                    deadline: time,
                    lastSenderDate: tableList[i].lastSenderDate,
                    campusName: tableList[i].campusName,
                    campusId: tableList[i].campusId,
                    sectionName: tableList[i].sectionName,
                    sectionId: tableList[i].sectionId,
                    closed: tableList[i].paymentCloseUsers,
                    createUserName: tableList[i].createUserName,
                    createUserEnName: tableList[i].createUserEnName,
                });
            }
        }
        const {
            tabsStyle,
            isTrue,
            oneKeyHandtuiTionType,
            editModalValue,
            addEdit,
            createTuitionFeePermission,
            downloadStudentDetailPermission,
        } = this.state;

        return (
            <div className={styles.payNotice}>
                <div className={styles.tabs}>
                    <a
                        className={styles.mySend}
                        style={{ color: tabsStyle ? null : 'black' }}
                        onClick={this.mySend}
                    >
                        {trans('charge.isend', '我发出的')}
                    </a>
                    <a
                        className={styles.allSend}
                        style={{ color: tabsStyle ? 'black' : null }}
                        onClick={this.allSend}
                    >
                        {trans('charge.allNotice', '全部通知')}
                    </a>
                </div>
                <div className={styles.head}>
                    <div className={styles.noTice}>
                        <span className={styles.title}>
                            {trans('charge.noticeList', '通知列表')}
                        </span>
                        {selectPlanStatusData &&
                            selectPlanStatusData.length &&
                            selectPlanStatusData.map((item, index) => {
                                return (
                                    <span
                                        className={styles.data}
                                        onClick={this.selectStatus.bind(this, item.statusCode)}
                                        style={{
                                            color: `${
                                                submitStatus == item.statusCode ? '#4d7fff' : ''
                                            }`,
                                        }}
                                        key={index}
                                    >
                                        <span
                                            className={styles.number}
                                            style={{
                                                color: `${
                                                    submitStatus == item.statusCode
                                                        ? '#4d7fff'
                                                        : '#333'
                                                }`,
                                            }}
                                        >
                                            {item.statusNum}
                                        </span>
                                        {item.statusCode == 1
                                            ? trans('charge.Unsent', '未发送')
                                            : trans('charge.has_been_sent', '已发送')}
                                    </span>
                                );
                            })}
                    </div>
                    <div className={styles.headOperate}>
                        {downloadStudentDetailPermission ? (
                            <div>
                                <a className={styles.studentList} onClick={this.downloadList}>
                                    {trans('charge.download_student', '下载学费信息')}
                                </a>
                            </div>
                        ) : null}
                        {createTuitionFeePermission ? (
                            <div>
                                <Button
                                    className={styles.btn}
                                    type="primary"
                                    onClick={this.oneKeytuiTion}
                                    style={{ padding: '0 14px', width: 'auto' }}
                                >
                                    {trans('charge.oneKey', '一键收学费')}
                                </Button>
                            </div>
                        ) : null}

                        <Button
                            className={styles.btn}
                            type="primary"
                            onClick={this.showModal}
                            style={{ padding: '0 14px', width: 'auto' }}
                        >
                            {trans('charge.addNotice', '新建通知')}
                        </Button>
                    </div>
                </div>

                <Form className={styles.form} layout="inline">
                    {/* <Form.Item label="校区">
                <Select placeholder='全部校区' size='large' style={{ width: '168px' }} onChange={this.getCampusValue}>
                    <Option value={null} key={null}>全部校区</Option>
                    {
                        campusAndStage.campus && campusAndStage.campus.length && campusAndStage.campus.map((item, index) =>{
                            return <Option value={item.orgId} key={item.orgId}>{item.orgName}</Option>   
                        })
                    }
                </Select>
            </Form.Item> */}
                    <Form.Item label={trans('charge.expirationDate', '截至日期')}>
                        <DatePicker
                            onChange={this.getDeadLineBegin}
                            format={dateFormat}
                            placeholder={trans('global.start.time', '开始时间')}
                            size="large"
                        />
                        &nbsp;&nbsp;<span style={{ color: '#666' }}>-</span>&nbsp;&nbsp;
                        <DatePicker
                            onChange={this.getDeadLineEnd}
                            format={dateFormat}
                            placeholder={trans('charge.expirationDate', '请选择截止日期')}
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item label={trans('charge.sendDate', '发送日期')}>
                        <DatePicker
                            onChange={this.getSendLineBegin}
                            format={dateFormat}
                            placeholder={trans('global.start.time', '开始时间')}
                            size="large"
                        />
                        &nbsp;&nbsp;<span style={{ color: '#666' }}>-</span>&nbsp;&nbsp;
                        <DatePicker
                            onChange={this.getSendLineEnd}
                            format={dateFormat}
                            placeholder={trans('charge.expirationDate', '请选择截止日期')}
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item label={trans('charge.section', '学段')}>
                        <Select
                            placeholder={trans('course.plan.stage', '全部学段')}
                            size="large"
                            style={{ width: '168px' }}
                            onChange={this.getPeriodValue}
                        >
                            <Option value={null} key={null}>
                                {trans('course.plan.stage', '全部学段')}
                            </Option>
                            {campusAndStage.stage &&
                                campusAndStage.stage.length &&
                                campusAndStage.stage.map((item, index) => {
                                    return (
                                        <Option value={item.stage} key={item.stage}>
                                            {/* {item.name} */}
                                            {locale() == 'en' ? item.ename : item.name}
                                        </Option>
                                    );
                                })}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Input
                            placeholder={trans('charge.keywordSearch', '请输入关键字搜索')}
                            size="large"
                            style={{ width: '250px', borderRadius: '8px', height: '36px' }}
                            onChange={this.getInputValue}
                        />
                    </Form.Item>
                </Form>

                <div className={styles.table}>
                    <Table
                        columns={columns}
                        dataSource={data}
                        pagination={false}
                        onRow={(record) => ({
                            onClick: () => {
                                this.simpleClick(record);
                            },
                        })}
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

                <Modal
                    visible={visible}
                    footer={null}
                    onCancel={this.handleCancel}
                    destroyOnClose
                    width="100%"
                    style={{ top: '0', width: '100%', height: '100vh' }}
                    className={styles.newPlan}
                    zIndex={999}
                >
                    <NewNoticePro
                        updatePlanList={updatePlanList || editModalValue}
                        isEdit={isEdit}
                        addEdit={addEdit}
                        oneKeyHandtuiTionType={oneKeyHandtuiTionType}
                        closeEdit={this.closeEdit}
                    />
                </Modal>

                <Modal
                    visible={timeVisible}
                    footer={null}
                    onCancel={this.handleTimeCancel}
                    destroyOnClose
                >
                    <div className={styles.editTime}>
                        <p className={styles.editTimeTitle}>
                            {trans('charge.changeDate', '更改日期')}
                        </p>
                        <div className={styles.edit}>
                            <span className={styles.label}>
                                {trans('charge.notificationTitle', '通知标题：')}
                            </span>
                            <span className={styles.title}>{planName}</span>
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
                <DownloadList
                    downloadListVisible={this.state.downloadListVisible}
                    changeVisible={this.changeVisible.bind(this)}
                    isloading={this.isLoading.bind(this)}
                    isTrue={isTrue}
                    onRef={(ref) => {
                        this.downLoad = ref;
                    }}
                    loading={loading}
                    dispatch={this.props.dispatch}
                ></DownloadList>
            </div>
        );
    };

    render() {
        const { isShowDetail, tuitionPlanId, editStatus } = this.state;
        console.log(isShowDetail, 'isShowDetail');
        return (
            <div>
                {isShowDetail == 1 ? (
                    this.homeIndex()
                ) : (
                    <PayDetail
                        tuitionPlanId={tuitionPlanId}
                        changeStatus={this.changeStatus}
                        editStatus={editStatus}
                    />
                )}
            </div>
        );
    }
}
