// 复学记录
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './commonModal.less';
import LookStudentDetail from './lookStudentDetail';
import { Drawer, Table, Icon, Pagination } from 'antd';
import { trans, locale } from '../../../../utils/i18n';

@connect((state) => ({
    recoveryStudentList: state.student.recoveryStudentList,
}))
class ResumptionRecord extends PureComponent {
    state = {
        record: {},
        current: 1, //当前页数
        pageSize: 20,
        lookStudentVisible: false,
        loadPaginationBoolean: false, // 页面数据正在加载中
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.resumptionRecordVisible != this.props.resumptionRecordVisible) {
            if (nextProps.resumptionRecordVisible) {
                this.initRecord();
            }
        }
    }

    initRecord() {
        const { dispatch } = this.props;
        let { pageSize, current } = this.state;
        this.setState({
            loadPaginationBoolean: true,
        });
        dispatch({
            type: 'student/recoveryStudentList',
            payload: {
                pageSize,
                pageNum: current,
            },
            onSuccess: () => {
                this.setState({
                    loadPaginationBoolean: false,
                });
            },
        });
    }

    handleCancel = () => {
        const { hideModal } = this.props;
        typeof hideModal == 'function' && hideModal.call(this, 'resumptionRecord');
    };

    hideModal = (type) => {
        if (type == 'lookStudentDetail') {
            this.setState({
                lookStudentVisible: false,
                record: {},
            });
        }
    };

    //查看学生详情
    lookStudentDetail = (record) => {
        this.setState(
            {
                record: record,
            },
            () => {
                this.setState({
                    lookStudentVisible: true,
                });
            }
        );
    };
    //切换分页
    switchPage = (page, size) => {
        this.setState(
            {
                current: page,
                pageSize: size,
            },
            () => {
                this.initRecord();
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
                this.initRecord();
            }
        );
    };

    render() {
        let { resumptionRecordVisible, havePowerLookDetail, havePowerOperStudent } = this.props;
        let self = this;
        let { data, total } = this.props.recoveryStudentList;
        let { loadPaginationBoolean, current } = this.state;
        let columns = [
            {
                title: trans('student.name', '姓名'),
                dataIndex: 'name',
                key: 'name',
                align: 'center',
                render: function (text, record) {
                    let currentUrl = window.location.href;
                    currentUrl = currentUrl.replace(/(\?|&)ticket\=([0-9A-z]+?&|[0-9A-z]+)/gi, '');
                    let userId = record.userId;
                    let homePageUrl =
                        currentUrl.indexOf('yungu.org') > -1
                            ? 'https://profile.yungu.org/#/dynamic/' + userId
                            : 'https://student-profile.daily.yungu-inc.org/#/dynamic/' + userId;

                    return (
                        <a href={homePageUrl} target="_blank" className={styles.studentName}>
                            {text}
                        </a>
                    );
                },
            },
            {
                title: trans('student.englishName', '英文名'),
                dataIndex: 'ename',
                key: 'ename',
                align: 'center',
            },
            {
                title: trans('student.studentNo', '学号'),
                dataIndex: 'studentNo',
                key: 'studentNo',
                align: 'center',
            },
            {
                title: trans('student.sex', '性别'),
                dataIndex: locale() != 'en' ? 'sex' : 'englishSex',
                key: 'sex',
                align: 'center',
            },
            {
                title: trans('student.administrativeClassShow', '行政班'),
                dataIndex:
                    locale() != 'en' ? 'administrativeClassShow' : 'administrativeClassShowEnglish',
                key: 'administrativeClassShow',
                align: 'center',
            },
            {
                title: trans('student.studentStatus', '学籍状态'),
                dataIndex: 'studentStatus',
                key: 'studentStatus',
                align: 'center',
                render: function (text, record) {
                    let content = '';
                    if (text == 1) {
                        content = trans('student.beStudying', '在读');
                    } else if (text == 2) {
                        content = trans('student.waitForAdmission', '待入学');
                    } else if (text == 3) {
                        content = trans('student.suspension', '休学');
                    } else if (text == 4) {
                        content = trans('student.studentManagement.transferredSchool', '已转学');
                    }
                    return <span>{content}</span>;
                },
            },
            {
                title: trans('student.start-end-time', '起止时间'),
                dataIndex: 'startTime',
                key: 'startTime',
                align: 'center',
                render: function (text, record) {
                    return <span>{`${record.startTime || ''}/${record.endTime || ''}`}</span>;
                },
            },
            {
                title: trans('student.opeation', '操作'),
                key: 'operation',
                align: 'center',
                render: function (text, record) {
                    return (
                        <span
                            className={styles.detailBtn}
                            onClick={() => self.lookStudentDetail(record)}
                        >
                            {trans('student.detail', '详情')}
                        </span>
                    );
                },
            },
        ];

        data = data || [];
        data.map((el, i) => (el.key = i));
        return (
            <div>
                <Drawer
                    title={
                        <div style={{ textAlign: 'center' }}>
                            {trans('student.goBack.record.title', '学生复学记录')}
                        </div>
                    }
                    width="100vw"
                    placement="right"
                    onClose={this.handleCancel}
                    visible={resumptionRecordVisible}
                    className={styles.drawerStyle}
                >
                    <Table
                        loading={{
                            indicator: <Icon type="loading" />,
                            spinning: loadPaginationBoolean,
                            tip: 'loading...',
                        }}
                        rowKey={(record) => record.key}
                        columns={columns}
                        dataSource={data || []}
                        pagination={false}
                    />
                    <div className={styles.paginationStyle}>
                        <div className={styles.pageContainer}>
                            <Pagination
                                showSizeChanger
                                showQuickJumper
                                current={current}
                                total={total}
                                locale="zh-CN"
                                defaultPageSize={20}
                                pageSizeOptions={['20', '40', '100']}
                                onChange={this.switchPage}
                                onShowSizeChange={this.switchPageSize}
                            />
                        </div>
                    </div>
                </Drawer>
                <LookStudentDetail
                    havePowerLookDetail={havePowerLookDetail}
                    havePowerOperStudent={havePowerOperStudent}
                    {...this.state}
                    hideModal={this.hideModal}
                />
            </div>
        );
    }
}

export default ResumptionRecord;
