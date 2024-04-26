//学生管理--学生列表
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Modal, Dropdown, Menu, message, Divider, Popover, Select, Checkbox } from 'antd';
import styles from './table.less';
import icon from '../../../icon.less';
import TransferStudent from './OperModal/transferStudent';
import TransferSchool from './OperModal/transferSchool';
import SuspensionSchool from './OperModal/suspensionSchool';
import ResumptionSchool from './OperModal/resumptionSchool';
import LeftSchool from './OperModal/leftSchool';
import LookStudentDetail from './OperModal/lookStudentDetail';
import { trans, locale } from '../../../utils/i18n';

const { confirm } = Modal;
const { Option } = Select;

@connect((state) => ({}))
export default class StudentTable extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            transferStudentVisible: false,
            record: {},
            lookStudentVisible: false,
            transferSchoolVisible: false, // 转学弹窗默认是隐藏的
            suspensionSchoolVisible: false, // 休学弹窗默认是隐藏的
            resumptionSchoolVisible: false, // 复学弹窗默认是隐藏的
            leftSchoolVisible: false, // 离校去向弹窗默认是隐藏的
            havePowerManager: false,
            giveUpSchoolVisible: false,
            strikeStudentVisible: false,

            giveType: '',
            deleteType: '',
            visible: false,
            recordId: '',
            deleteVisible: false,
            recordDeleteId: '',
            checkedFlag: false,
            userIds: [],
        };
    }

    componentDidMount() {
        this.props.onRef && this.props.onRef(this)
    }

    componentWillMount() {
        let { powerStatus } = this.props;
        // 判断是否有转学，休学，复学设置等权限
        let havePowerManager =
            powerStatus.content &&
                (powerStatus.content.indexOf('smart:teaching:student:stutas:manage') != -1 ||
                    powerStatus.content.indexOf('smart:teaching:studentInfo:all:operation:manager') !=
                    -1 ||
                    powerStatus.content.indexOf('smart:teaching:studentInfo:all:operation:tutor') != -1)
                ? true
                : false;
        if (havePowerManager) {
            this.setState({
                havePowerManager: true,
            });
        }
    }

    // 表格数据改变时，如果表头全选为true，及时更新usersId
    // componentWillReceiveProps(nextProps) {
    //     if (JSON.stringify(nextProps.tableSource) != JSON.stringify(this.props.tableSource)) {
    //         if (this.state.checkedFlag && nextProps.treeId == this.props.treeId) {
    //             let tempIdList = [];
    //             nextProps.tableSource.map((item) => {
    //                 tempIdList.push(item.userId);
    //             });
    //             this.setState({
    //                 userIds: tempIdList,
    //             });
    //         }else{
    //             this.setState({
    //                 userIds: nextProps.rowIds,
    //             });
    //         }
    //     }
    // }

    //选中表格项
    onSelectChange = (selectRowKeys, selectRows) => {
        let ids = this.getSelectRowId(selectRows);
        const { fetchRowKeys } = this.props;
        typeof fetchRowKeys == 'function' && fetchRowKeys.call(this, ids);
    };

    clearCheckedAndUserIds = () => {
        this.setState({
            userIds: [],
            checkedFlag: false
        }, () => {
            const { fetchRowKeys } = this.props;
            typeof fetchRowKeys == 'function' && fetchRowKeys.call(this, []);
        })
    }

    //获取选中行的id
    getSelectRowId = (arr) => {
        if (!arr || arr.length == 0) return [];
        let ids = [];
        arr.map((item) => {
            ids.push(item.userId);
        });
        return ids;
    };

    //删除单个学生
    deleteStudent = (record) => {
        if (this.props.checkValue && this.props.isLeaf == false) {
            message.info(
                trans('student.noAllowSingleRemove', '显示子部门学生的条件下，不允许移除学生哦~')
            );
            return false;
        }
        let self = this;
        confirm({
            title: trans('student.confirmRemoveStudent', '确定要移除这个学生吗？'),
            okText: trans('global.confirm', '确定'),
            cancelText: trans('global.cancel', '取消'),
            onOk() {
                const { dispatch } = self.props;
                dispatch({
                    type: 'teacher/deleteMore',
                    payload: {
                        nodeId: self.props.treeId,
                        userIdList: [record.userId],
                    },
                    onSuccess: () => {
                        const { getStudentList, getTreeOrg } = self.props;
                        typeof getStudentList == 'function' && getStudentList.call(self);
                        typeof getTreeOrg == 'function' && getTreeOrg.call(self);
                    },
                });
            },
        });
    };

    //转移学生
    transferStudent(record) {
        // if (this.props.checkValue && this.props.isLeaf == false) {
        //     message.info(
        //         trans('student.noAllowSingleTransfer', '显示子部门学生的条件下，不允许转移学生哦~')
        //     );
        //     return false;
        // }
        this.setState(
            {
                record: record,
            },
            () => {
                this.setState({
                    transferStudentVisible: true,
                });
            }
        );
    }

    hideModal = (type) => {
        if (type == 'transferStudent') {
            this.setState({
                transferStudentVisible: false,
                record: {},
            });
        }
        if (type == 'lookStudentDetail') {
            this.setState({
                lookStudentVisible: false,
                record: {},
            });
        }
        if (type == 'transferSchool') {
            this.setState({
                transferSchoolVisible: false,
                record: {},
            });
        }
        if (type == 'suspensionSchool') {
            this.setState({
                suspensionSchoolVisible: false,
                record: {},
            });
        }

        if (type == 'resumptionSchool') {
            this.setState({
                resumptionSchoolVisible: false,
                record: {},
            });
        }
        if (type == 'leftSchool') {
            this.setState({
                leftSchoolVisible: false,
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

    // 转学
    transferSchool = (record) => {
        this.setState(
            {
                record: record,
            },
            () => {
                this.setState({
                    transferSchoolVisible: true,
                });
            }
        );
    };

    // 休学
    suspensionSchool = (record) => {
        this.setState(
            {
                record: record,
            },
            () => {
                this.setState({
                    suspensionSchoolVisible: true,
                });
            }
        );
    };

    //放弃
    giveUpSchool = (key, record) => {
        this.setState({
            visible: true,
            recordId: record.userId,
            giveType: key,
        });
    };

    handleOk = (e) => {
        const { dispatch } = this.props;
        const { recordId, giveType } = this.state;
        this.setState({
            visible: false,
        });
        dispatch({
            type: 'student/submitGiveUpSchool',
            payload: {
                userId: recordId,
                giveType,
            },
        }).then(() => {
            message.success('放弃成功');
            const { getStudentList } = this.props;
            typeof getStudentList == 'function' && getStudentList.call(this);
        });
    };
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    //删除
    strikeStudent = (key, record) => {
        console.log('key', key);
        console.log('record', record);
        const { dispatch } = this.props;
        this.setState({
            deleteVisible: true,
            recordDeleteId: record.userId,
            deleteType: key,
        });
    };

    handleDeleteOk = (e) => {
        const { dispatch } = this.props;
        const { recordDeleteId, deleteType } = this.state;
        this.setState({
            deleteVisible: false,
        });
        dispatch({
            type: 'student/submitGiveUpSchool',
            payload: {
                userId: recordDeleteId,
                giveType: deleteType,
            },
        }).then(() => {
            message.success('删除成功');
            const { getStudentList } = this.props;
            typeof getStudentList == 'function' && getStudentList.call(this);
        });
    };
    handleDeleteCancel = (e) => {
        console.log(e);
        this.setState({
            deleteVisible: false,
        });
    };

    // 复学
    resumptionSchool = (record) => {
        this.setState(
            {
                record: record,
            },
            () => {
                this.setState({
                    resumptionSchoolVisible: true,
                });
            }
        );
    };

    // 设置离校去向
    setUpLeftSchool = (record) => {
        this.setState(
            {
                record: record,
            },
            () => {
                this.setState({
                    leftSchoolVisible: true,
                });
            }
        );
    };

    // 如果本页/所有页tab选中时，下一页时仍然保持选中
    selectThisPageStudent = () => {
        const { tableSource } = this.props;
        if (this.state.checkedFlag) {
            let tempIdList = [];
            tableSource.map((item) => {
                tempIdList.push(item.userId);
            });
            this.setState({
                userIds: tempIdList
            }, () => {
                const { fetchRowKeys } = this.props;
                typeof fetchRowKeys == 'function' && fetchRowKeys.call(this, tempIdList);
            })
        } else {
            this.setState({
                userIds: []
            }, () => {
                const { fetchRowKeys } = this.props;
                typeof fetchRowKeys == 'function' && fetchRowKeys.call(this, []);
            })
        }
    }

    // 更改导入方式，本页or所有页
    changeExportType = (value) => {
        this.props.changeExportType && this.props.changeExportType(value);
        if (this.state.checkedFlag || value == 2) {
            let tempIdList = [];
            this.props.tableSource.map((item) => {
                tempIdList.push(item.userId);
            });
            if (value == 2) {
                this.setState({
                    checkedFlag: true
                })
            }
            this.setState({
                userIds: tempIdList
            }, () => {
                const { fetchRowKeys } = this.props;
                typeof fetchRowKeys == 'function' && fetchRowKeys.call(this, tempIdList);
            }
            )
        } else {
            this.setState({
                userIds: [],
                checkedFlag: false,
            }, () => {
                const { fetchRowKeys } = this.props;
                typeof fetchRowKeys == 'function' && fetchRowKeys.call(this, []);
            }
            );
        }

    };
    // 更改选中状态
    changeCheckedFlag = (e) => {
        const { tableSource } = this.props;
        let ids = [];
        if (e.target.checked) {
            tableSource.map((item) => {
                ids.push(item.userId);
            });
            this.setState({
                userIds: ids,
            });
        } else {
            this.setState({
                userIds: [],
            });
        }
        this.setState(
            {
                checkedFlag: e.target.checked,
            },
            () => {
                const { fetchRowKeys } = this.props;
                typeof fetchRowKeys == 'function' && fetchRowKeys.call(this, this.state.userIds);
            }
        );
    };

    changeSingleStatus = (e, id) => {
        let tempUserIds = JSON.parse(JSON.stringify(this.state.userIds));
        const { tableSource } = this.props;
        let tempIndex = tempUserIds.findIndex((obj) => obj == id);
        if (e.target.checked) {
            tempUserIds.push(id);
            if (tempUserIds.length == tableSource.length) {
                this.setState({
                    checkedFlag: true,
                });
            }
        } else {
            console.log(tempUserIds, tempIndex, id, 'tempIndex')
            tempUserIds.splice(tempIndex, 1);
            this.setState({
                checkedFlag: false,
            });
            console.log(tempUserIds, 'tempIndex')
        }
        this.setState(
            {
                userIds: tempUserIds,
            },
            () => {
                const { fetchRowKeys } = this.props;
                typeof fetchRowKeys == 'function' && fetchRowKeys.call(this, this.state.userIds);
            }
        );
    };

    render() {
        const {
            tableSource,
            rowKeys,
            havePowerTransfer,
            havePowerLookDetail,
            havePowerOperStudent,
            statusType,
            selectSchooYearlId,
            curSchooYearlId,
            exportType,
        } = this.props;
        let self = this;
        let { havePowerManager, checkedFlag, userIds } = this.state;

        let columnsStart = [
            {
                title: (
                    <div className={styles.filterArea}>
                        <Checkbox checked={checkedFlag} onChange={this.changeCheckedFlag} />
                        <Select
                            dropdownMatchSelectWidth={false}
                            dropdownStyle={{ width: 'auto' }}
                            value={exportType}
                            onChange={this.changeExportType}
                            style={{ position: 'absolute', top: 5, left: 29 }}
                        >
                            <Option key={1} value={1}>
                                本页
                            </Option>
                            <Option key={2} value={2}>
                                所有页
                            </Option>
                        </Select>
                    </div>
                ),
                width: 65,
                dataIndex: 'userId',
                key: 'userId',
                render: (text, record) => {
                    return (
                        <div style={{ textAlign: 'center' }}>
                            <Checkbox
                                checked={userIds.indexOf(record.userId) > -1}
                                onChange={(e) => this.changeSingleStatus(e, record.userId)}
                            />
                        </div>
                    );
                },
            },
            {
                title: trans('student.name', '姓名'),
                dataIndex: 'name',
                key: 'name',
                align: 'center',
                width: 80,
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
                            {statusType == 1 ? (
                                <>
                                    {text}
                                    <span
                                        className={styles.labelStyle}
                                        style={
                                            record.ifTeacherChild == true
                                                ? {
                                                    color: '#46D883',
                                                    backgroundColor: 'rgba(70,216,131,0.1)',
                                                }
                                                : record.ifTeacherChild == false
                                                    ? {
                                                        color: '#3798FF',
                                                        backgroundColor: 'rgba(55,152,255,0.1)',
                                                    }
                                                    : {}
                                        }
                                    >
                                        {record.ifTeacherChild == true
                                            ? '教'
                                            : record.ifTeacherChild == false
                                                ? '顾'
                                                : ''}
                                    </span>
                                </>
                            ) : (
                                text
                            )}
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
            // {
            //     title: trans('student.mobile', '手机号码'),
            //     dataIndex: 'mobile',
            //     key: 'mobile',
            //     align: 'center',
            // },
            {
                title: trans('student.sex', '性别'),
                dataIndex: locale() != 'en' ? 'sex' : 'englishSex',
                key: 'sex',
                align: 'center',
                width: 46,
            },
        ];
        let columnsMiddle = [];
        if (statusType == 1) {
            columnsMiddle = [
                {
                    title: trans('student.teacherNameShow', '导师'),
                    dataIndex: locale() != 'en' ? 'teacherNameShow' : 'teacherEnglishNameShow',
                    key: 'teacherNameShow',
                    align: 'center',
                    width: 100,
                },
                {
                    title: trans('student.administrativeClassShow', '行政班'),
                    dataIndex:
                        locale() != 'en'
                            ? 'administrativeClassShow'
                            : 'administrativeClassShowEnglish',
                    key: 'administrativeClassShow',
                    align: 'center',
                    // width: 150,
                },
                {
                    title: '校车',
                    dataIndex: 'schoolBus',
                    key: 'schoolBus',
                    align: 'center',
                },
                {
                    title: '特长教练',
                    dataIndex: locale() != 'en' ? 'specialtyTutorName' : 'specialtyTutorEnName',
                    key: 'specialtyTutorName',
                    align: 'center',
                },
                {
                    title: '宿舍',
                    dataIndex: 'dormName',
                    key: 'dormName',
                    align: 'center',
                },
                // {
                //     title: trans('student.studentStatus', '学籍状态'),
                //     dataIndex: 'studentStatus',
                //     key: 'studentStatus',
                //     align: 'center',
                //     width: 74,
                //     render: function (text, record) {
                //         let content = '';
                //         if (text == 1) {
                //             content = trans('student.beStudying', '在读');
                //         } else if (text == 2) {
                //             content = trans('student.waitForAdmission', '待入学');
                //         } else if (text == 3) {
                //             content = trans('student.suspension', '休学');
                //         }
                //         return <span>{content}</span>;
                //     },
                // },
            ];
        } else if (statusType == 2) {
            columnsMiddle = [
                {
                    title: trans('student.administrativeClassShow', '行政班'),
                    dataIndex:
                        locale() != 'en'
                            ? 'administrativeClassShow'
                            : 'administrativeClassShowEnglish',
                    key: 'administrativeClassShow',
                    align: 'center',
                    width: 150,
                },
                // {
                //     title: trans('student.studentStatus', '学籍状态'),
                //     dataIndex: 'studentStatus',
                //     key: 'studentStatus',
                //     align: 'center',
                //     render: function (text, record) {
                //         let content = '';
                //         if (text == 1) {
                //             content = trans('student.beStudying', '在读');
                //         } else if (text == 2) {
                //             content = trans('student.waitForAdmission', '待入学');
                //         } else if (text == 3) {
                //             content = trans('student.suspension', '休学');
                //         }
                //         return <span>{content}</span>;
                //     },
                // },
                {
                    title: trans('student.start-end-time', '起止时间'),
                    dataIndex: 'suspensionTime',
                    key: 'suspensionTime',
                    align: 'center',
                    width: 150,
                },
            ];
        } else if (statusType == 3) {
            columnsMiddle = [
                {
                    title: trans('student.leftSchool-leavers', '离校学段'),
                    dataIndex: locale() != 'en' ? 'graduationStageName' : 'graduationStageEnName',
                    key: 'graduationStageName',
                    align: 'center',
                },
                {
                    title: trans('student.leftSchool-status', '离校状态'),
                    dataIndex: 'leaveStatus',
                    key: 'leaveStatus',
                    align: 'center',
                    render: function (text, record) {
                        let content = '';
                        if (text == 2) {
                            content = trans('student.transfer', '转学');
                        } else if (text == 5) {
                            content = trans('student.graduation', '毕业');
                        } else if (text == 6) {
                            content = trans('student.goHighSchool', '升学');
                        }
                        return <span>{content}</span>;
                    },
                },
                {
                    title: trans('student.leftSchoolTime', '离校日期'),
                    dataIndex: 'startTime',
                    key: 'startTime',
                    align: 'center',
                },
                {
                    title: trans('student.departure-from-school', '离校去向'),
                    dataIndex: 'transfer',
                    key: 'transfer',
                    align: 'center',
                    render: (val, elt) => (
                        <Popover
                            content={
                                <div style={{ maxWidth: '240px', textAlign: 'justify' }}>
                                    {val || ''}
                                </div>
                            }
                            placement="bottom"
                        >
                            <div className={styles.whiteSpace}>{val || ''}</div>
                        </Popover>
                    ),
                },
            ];
        }

        let columnsEnd = [
            {
                title: trans('student.opeation', '操作'),
                key: 'operation',
                align: 'center',
                render: function (text, record) {
                    if (statusType == 1) {
                        return (
                            <div>
                                <span
                                    className={styles.detailBtn}
                                    onClick={() => self.lookStudentDetail(record)}
                                >
                                    {trans('student.detail', '详情')}
                                </span>
                                {selectSchooYearlId == curSchooYearlId && (
                                    <Divider type="vertical" />
                                )}
                                {havePowerTransfer && selectSchooYearlId == curSchooYearlId && (
                                    <Fragment>
                                        <span
                                            className={styles.detailBtn}
                                            onClick={self.transferStudent.bind(self, record)}
                                        >
                                            {trans('student.transferClass', '转班')}
                                        </span>
                                        <Divider type="vertical" />
                                    </Fragment>
                                )}
                                {selectSchooYearlId == curSchooYearlId && (
                                    <Dropdown
                                        overlay={
                                            <Menu>
                                                {/* {havePowerTransfer && (
                                                    <Menu.Item key="0">
                                                        <span
                                                            className={styles.deleteStudentStyle}
                                                            onClick={self.deleteStudent.bind(
                                                                self,
                                                                record
                                                            )}
                                                        >
                                                            {trans('student.remove', '移除')}
                                                        </span>
                                                    </Menu.Item>
                                                )} */}
                                                {havePowerManager && [
                                                    <Menu.Item key="1">
                                                        <span
                                                            className={styles.deleteStudentStyle}
                                                            onClick={() =>
                                                                self.transferSchool(record)
                                                            }
                                                        >
                                                            {trans('student.transfer', '转学')}
                                                        </span>
                                                    </Menu.Item>,
                                                    <Menu.Item key="2">
                                                        <span
                                                            className={styles.deleteStudentStyle}
                                                            onClick={() =>
                                                                self.suspensionSchool(record)
                                                            }
                                                        >
                                                            {trans('student.suspension', '休学')}
                                                        </span>
                                                    </Menu.Item>,
                                                    <Menu.Item key="3">
                                                        <span
                                                            className={styles.deleteStudentStyle}
                                                            onClick={() =>
                                                                self.giveUpSchool(0, record)
                                                            }
                                                        >
                                                            {trans('global.giveUp', '放弃')}
                                                        </span>
                                                    </Menu.Item>,
                                                    <Menu.Item key="4">
                                                        <span
                                                            className={styles.deleteStudentStyle}
                                                            onClick={() =>
                                                                self.strikeStudent(1, record)
                                                            }
                                                        >
                                                            {trans('global.delete', '删除')}
                                                        </span>
                                                    </Menu.Item>,
                                                ]}
                                            </Menu>
                                        }
                                        trigger={['click']}
                                        placement="bottomCenter"
                                    >
                                        <span className={styles.moreBtn}>
                                            {trans('student.more', '更多')}
                                        </span>
                                    </Dropdown>
                                )}
                            </div>
                        );
                    } else if (statusType == 2) {
                        return (
                            <div>
                                <span
                                    className={styles.detailBtn}
                                    onClick={() => self.lookStudentDetail(record)}
                                >
                                    {trans('student.detail', '详情')}
                                </span>
                                {havePowerManager && (
                                    <Fragment>
                                        <Divider type="vertical" />
                                        <span
                                            className={styles.detailBtn}
                                            onClick={() => self.transferSchool(record)}
                                        >
                                            {trans('student.transfer', '转学')}
                                        </span>
                                        <Divider type="vertical" />
                                        <span
                                            className={styles.detailBtn}
                                            onClick={() => self.resumptionSchool(record)}
                                        >
                                            {trans('student.resumption', '复学')}
                                        </span>
                                        <Divider type="vertical" />
                                        <span
                                            className={styles.detailBtn}
                                            onClick={() => self.suspensionSchool(record)}
                                        >
                                            {trans('student.suspension-setup', '休学设置')}
                                        </span>
                                        <Divider type="vertical" />
                                        {/* <span
                                            className={styles.detailBtn}
                                            onClick={() => self.giveUpSchool(record)}
                                        >
                                            {trans('student.suspension-setup', '休学设置')}
                                        </span> */}
                                    </Fragment>
                                )}
                            </div>
                        );
                    } else if (statusType == 3) {
                        return (
                            <div>
                                <span
                                    className={styles.detailBtn}
                                    onClick={() => self.lookStudentDetail(record)}
                                >
                                    {trans('student.detail', '详情')}
                                </span>
                                {havePowerManager && (
                                    <Fragment>
                                        <Divider type="vertical" />
                                        <span
                                            className={styles.detailBtn}
                                            onClick={() => self.setUpLeftSchool(record)}
                                        >
                                            {trans('student.leftSchool', '设置离校去向')}
                                        </span>
                                    </Fragment>
                                )}
                            </div>
                        );
                    }
                },
            },
        ];

        let columns = columnsStart.concat(columnsMiddle).concat(columnsEnd);
        const rowSelection = {
            selectedRowKeys: rowKeys,
            onChange: this.onSelectChange,
            hideDefaultSelections: true,
            getCheckboxProps: (record) => ({
                // disabled: this.props.ifAll == 1
            }),
            selections: [],
        };
        return (
            <div className={styles.studentTableBox}>
                <div ref="_table_checkbox">
                    <Table
                        rowKey={(record) => record.userId}
                        // rowSelection={rowSelection}
                        columns={columns}
                        dataSource={tableSource}
                        pagination={false}
                        className={styles.tableStyle}
                    />
                </div>
                <TransferStudent
                    {...this.props}
                    {...this.state}
                    hideModal={this.hideModal}
                    transferType="single"
                />
                <LookStudentDetail
                    schoolId={this.props.schoolId}
                    havePowerLookDetail={havePowerLookDetail}
                    havePowerOperStudent={havePowerOperStudent}
                    {...this.state}
                    hideModal={this.hideModal}
                />
                <TransferSchool {...this.props} {...this.state} hideModal={this.hideModal} />
                <SuspensionSchool {...this.props} {...this.state} hideModal={this.hideModal} />
                <ResumptionSchool {...this.props} {...this.state} hideModal={this.hideModal} />
                {/* <GiveUpSchool {...this.props} {...this.state} hideModal={this.hideModal} /> */}
                {this.state.leftSchoolVisible && (
                    <LeftSchool {...this.props} {...this.state} hideModal={this.hideModal} />
                )}
                <Modal
                    title="放弃"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    width="300px"
                >
                    <p>{trans('global.sureGiveUp', '确定要放弃吗？')}</p>
                </Modal>
                <Modal
                    title="删除"
                    visible={this.state.deleteVisible}
                    onOk={this.handleDeleteOk}
                    onCancel={this.handleDeleteCancel}
                    width="300px"
                >
                    <p>{trans('global.sureDelete', '确定要删除吗？')}</p>
                </Modal>
            </div>
        );
    }
}
