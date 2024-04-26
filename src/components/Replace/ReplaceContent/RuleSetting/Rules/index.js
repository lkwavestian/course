import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Icon, Modal, Select, Table, Spin } from 'antd';
import styles from './index.less';
import { isEmpty } from 'lodash';
import { trans } from '../../../../../utils/i18n';
const { Option } = Select;
@connect((state) => ({
    gradeList: state.replace.gradeList,
    listAllOrgTeachers: state.replace.listAllOrgTeachers,
    roleList: state.replace.roleList,
    workFlowRuleList: state.replace.workFlowRuleList,
    currentUser: state.replace.currentUser,
    schoolYearList: state.replace.schoolYearList,
}))
export default class Rules extends PureComponent {
    state = {
        dataSource: [],
        settingModalVisible: false,
        selectTeacherModalVisible: false,
        selectRoleModalVisible: false,
        addTeacherValue: '',
        addRoleValue: '',
        operatingRowIndex: '',
        loadingStatus: false,
    };

    componentDidMount() {
        this.initialData();
        this.getWorkFlowRuleList();
    }

    initialData = async () => {
        const { dispatch } = this.props;
        await dispatch({
            type: 'replace/getCurrentUser',
            payload: {},
        });
        const { currentUser } = this.props;
        await dispatch({
            type: 'replace/getListSchoolYear',
            payload: {
                schoolId: currentUser.schoolId,
            },
        });
        const { schoolYearList } = this.props;
        dispatch({
            type: 'replace/findRoleList',
            payload: {
                schoolId: currentUser.schoolId,
                schoolYearId: schoolYearList.find((item) => item.current)?.id,
            },
        });
    };

    getWorkFlowRuleList = () => {
        const { dispatch } = this.props;
        this.setState(
            {
                loadingStatus: true,
            },
            () => {
                dispatch({
                    type: 'replace/getWorkFlowRule',
                    payload: {
                        bizType: 'CHANGE_COURSE',
                    },
                }).then(() => [
                    this.setState({
                        loadingStatus: false,
                    }),
                ]);
            }
        );
    };

    editClick = (item, index) => {
        this.setState({
            currentItem: item,
            dataSource: !isEmpty(item.workFlowRuleDTOList)
                ? item.workFlowRuleDTOList.map((msgItem) => {
                      return {
                          ...msgItem,
                          applyGradeList: msgItem.applyGradeList.map((listItem) => listItem.id),
                      };
                  })
                : [],
            settingModalVisible: true,
        });
    };

    getTableFooterHtml = () => {
        return (
            <div onClick={this.addTableRow} className={styles.addTableRow}>
                <span style={{ fontSize: 20, marginRight: 5 }}>+</span>
                <span>{trans('global.replace.pc.addItem', '添加一组')}</span>
            </div>
        );
    };

    cancelSettingModal = () => {
        this.setState({
            settingModalVisible: false,
        });
    };

    confirmSettingModal = () => {
        const { dispatch } = this.props;
        const { currentItem, dataSource } = this.state;
        this.setState(
            {
                loadingStatus: true,
                settingModalVisible: false,
            },
            () => {
                dispatch({
                    type: 'replace/saveWorkFlowRule',
                    payload: {
                        ...currentItem,
                        workFlowRuleDTOList: dataSource.map((item) => {
                            let baseMsg = {
                                bizType: 'CHANGE_COURSE',
                                applyGradeIdList: item.applyGradeList,
                                approveRoleTagList: item.approveRoleList.map(
                                    (item) => item.roleTagCode
                                ),
                                approveUserIdList: item.approveUserList.map((item) => item.id),
                            };
                            if (item.id) {
                                return {
                                    id: item.id,
                                    ...baseMsg,
                                };
                            } else return baseMsg;
                        }),
                    },
                }).then(() => {
                    dispatch({
                        type: 'replace/getWorkFlowRule',
                        payload: {
                            bizType: 'CHANGE_COURSE',
                        },
                    }).then(() => {
                        this.setState({
                            loadingStatus: false,
                        });
                    });
                });
            }
        );
    };

    gradeListChange = (value, index) => {
        const { dataSource } = this.state;
        this.setState({
            dataSource: dataSource.map((item, idx) => {
                if (index === idx) {
                    return {
                        ...item,
                        applyGradeList: value,
                    };
                } else {
                    return item;
                }
            }),
        });
    };

    addTableRow = () => {
        const { dataSource } = this.state;
        this.setState({
            dataSource: [
                ...dataSource,
                {
                    applyGradeList: [],
                    approveUserList: [],
                    approveRoleList: [],
                },
            ],
        });
    };

    reduceTableRow = (record, index) => {
        //如果有id，代表接口返回的数据，如果没有id，代表前端自己拼接
        this.setState(
            {
                loadingStatus: true,
            },
            () => {
                const { dispatch } = this.props;
                if (record.id) {
                    dispatch({
                        type: 'replace/deleteWorkFlowRule',
                        payload: { id: record.id },
                    }).then(() => {
                        this.getWorkFlowRuleList();
                        const { dataSource } = this.state;
                        let dataSourceCopy = [...dataSource];
                        dataSourceCopy.splice(index, 1);
                        this.setState({
                            dataSource: dataSourceCopy,
                            loadingStatus: false,
                        });
                    });
                } else {
                    const { dataSource } = this.state;
                    let dataSourceCopy = [...dataSource];
                    dataSourceCopy.splice(index, 1);
                    this.setState({
                        dataSource: dataSourceCopy,
                        loadingStatus: false,
                    });
                }
            }
        );
    };

    getApproverList = (record, rowIndex) => {
        const { approveUserList, approveRoleList } = record;
        return (
            <Fragment>
                {approveRoleList.map((item, index) => (
                    <div className={styles.approverItem} key={item.roleTagCode}>
                        <span>{item.roleTagName}</span>
                        <Icon
                            type="close-circle"
                            theme="filled"
                            className={styles.closeCircle}
                            onClick={() => this.removeRoleOrTeacher(rowIndex, 'role', index)}
                        />
                    </div>
                ))}
                {approveUserList.map((item, index) => (
                    <div className={styles.approverItem} key={item.id}>
                        <span>{item.name}</span>
                        <Icon
                            type="close-circle"
                            theme="filled"
                            className={styles.closeCircle}
                            onClick={() => this.removeRoleOrTeacher(rowIndex, 'teacher', index)}
                        />
                    </div>
                ))}
                <span
                    className={styles.approverItem + ' ' + styles.addApprover}
                    onClick={() => this.addRole(rowIndex)}
                >
                    <span className={styles.addApproverIcon}>+</span>
                    <span>{trans('global.replace.pc.addRole', '添加角色')}</span>
                </span>
                <span
                    className={styles.approverItem + ' ' + styles.addApprover}
                    onClick={() => this.addTeacher(rowIndex)}
                >
                    <span className={styles.addApproverIcon}>+</span>
                    <span>{trans('global.replace.pc.addTeacher', '添加教师')}</span>
                </span>
            </Fragment>
        );
    };

    addRole = (rowIndex) => {
        this.setState({
            selectRoleModalVisible: true,
            operatingRowIndex: rowIndex,
        });
    };

    addTeacher = (rowIndex) => {
        this.setState({
            selectTeacherModalVisible: true,
            operatingRowIndex: rowIndex,
        });
    };

    cancelRoleModal = () => {
        this.setState({
            selectRoleModalVisible: false,
            addRoleValue: '',
        });
    };

    cancelTeacherModal = () => {
        this.setState({
            selectTeacherModalVisible: false,
            addTeacherValue: '',
        });
    };

    removeRoleOrTeacher = (rowIndex, type, deleteItemIndex) => {
        const { dataSource } = this.state;
        this.setState({
            dataSource: dataSource.map((item, index) => {
                if (index === rowIndex) {
                    if (type === 'role') {
                        let approveRoleList = item.approveRoleList.toSpliced(deleteItemIndex, 1);
                        return {
                            ...item,
                            approveRoleList,
                        };
                    }
                    if (type === 'teacher') {
                        let approveUserList = item.approveUserList.toSpliced(deleteItemIndex, 1);
                        return {
                            ...item,
                            approveUserList,
                        };
                    }
                } else {
                    return item;
                }
            }),
        });
    };

    addRoleItemChange = (value, option) => {
        let { roleName, roleEnName } = option.props;
        this.setState({
            addRoleValue: {
                roleTagCode: value,
                roleTagName: roleName,
                roleTagEnName: roleEnName,
            },
        });
    };

    addTeacherItemChange = (value, option) => {
        console.log(' teacher option :>> ', option);
        let { name } = option.props;
        this.setState({
            addTeacherValue: {
                id: value,
                name,
            },
        });
    };

    confirmAddRole = () => {
        const { dataSource, operatingRowIndex, addRoleValue } = this.state;
        this.setState(
            {
                dataSource: dataSource.map((item, index) => {
                    if (operatingRowIndex === index) {
                        return {
                            ...item,
                            approveRoleList: [...item.approveRoleList, addRoleValue],
                        };
                    } else {
                        return item;
                    }
                }),
            },
            () => {
                this.cancelRoleModal();
            }
        );
    };

    confirmAddTeacher = () => {
        const { dataSource, operatingRowIndex, addTeacherValue } = this.state;
        this.setState(
            {
                dataSource: dataSource.map((item, index) => {
                    if (operatingRowIndex === index) {
                        return {
                            ...item,
                            approveUserList: [...item.approveUserList, addTeacherValue],
                        };
                    } else {
                        return item;
                    }
                }),
            },
            () => {
                this.cancelTeacherModal();
            }
        );
    };

    getGradeMsg = (msgItem) => {
        let applyGradeList = msgItem.applyGradeList;
        if (applyGradeList.length === 1) {
            return applyGradeList[0]?.enName;
        } else {
            return `${applyGradeList[0]?.enName}~${
                applyGradeList[applyGradeList.length - 1]?.enName
            }`;
        }
    };

    getRoleAndTeacherMsg = ({ approveRoleList, approveUserList }) => {
        let roleAndTeacherMsgList = [];
        if (!isEmpty(approveRoleList)) {
            roleAndTeacherMsgList.push(...approveRoleList.map((item) => item.roleTagName));
        }
        if (!isEmpty(approveUserList)) {
            roleAndTeacherMsgList.push(...approveUserList.map((item) => item.name));
        }
        return roleAndTeacherMsgList.join('、');
    };

    render() {
        const {
            gradeList,
            listAllOrgTeachers,
            roleList: { formalRoleTagList, systemRoleTagList },
            workFlowRuleList,
            currentLang,
        } = this.props;
        const {
            dataSource,
            settingModalVisible,
            selectRoleModalVisible,
            selectTeacherModalVisible,
            loadingStatus,
        } = this.state;
        console.log('dataSource :>> ', dataSource);
        const columns = [
            {
                title: trans('global.replace.pc.grade', '年级'),
                dataIndex: 'applyGradeList',
                key: 'applyGradeList',
                render: (applyGradeList, record, index) => (
                    <Select
                        style={{ width: 250 }}
                        mode="multiple"
                        showArrow={true}
                        value={applyGradeList}
                        placeholder="选择年级"
                        onChange={(value) => this.gradeListChange(value, index)}
                    >
                        {gradeList.map((item) => (
                            <Option value={item.id} key={item.id}>
                                {currentLang === 'cn' ? item.orgName : item.orgEname}
                            </Option>
                        ))}
                    </Select>
                ),
                align: 'center',
                ellipsis: true,
            },
            {
                title: trans('global.replace.pc.approver', '审批人'),
                dataIndex: '',
                key: '',
                render: (text, record, index) => {
                    return (
                        <div className={styles.approverList}>
                            {this.getApproverList(record, index)}
                        </div>
                    );
                },
                align: 'center',
                width: 400,
            },
            {
                title: '',
                key: '',
                render: (text, record, index) => (
                    <Icon
                        type="delete"
                        style={{ fontSize: 18 }}
                        onClick={() => this.reduceTableRow(record, index)}
                    />
                ),
                width: 50,
            },
        ];
        return (
            <Spin wrapperClassName={styles.rulesWrapper} spinning={loadingStatus}>
                <div className={styles.rules}>
                    <div className={styles.text}>
                        {trans('global.replace.pc.approvalRules', '审批规则')}
                    </div>
                    <div className={styles.ruleItemList}>
                        {workFlowRuleList.map((item, index) => (
                            <div className={styles.ruleItem} key={item.approveNodeCode}>
                                <div className={styles.header}>
                                    <span>{item.approveNodeName}</span>
                                    <Icon
                                        type="edit"
                                        className={styles.edit}
                                        onClick={() => this.editClick(item, index)}
                                    />
                                </div>
                                {!isEmpty(item.workFlowRuleDTOList) ? (
                                    item.workFlowRuleDTOList.map((msgItem) => (
                                        <div className={styles.msg}>
                                            {this.getGradeMsg(msgItem)}：
                                            {this.getRoleAndTeacherMsg(msgItem)}
                                        </div>
                                    ))
                                ) : (
                                    <div className={styles.noSetting}>未配置</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                {settingModalVisible && (
                    <Modal
                        title={trans('global.replace.pc.setAcademicApprovers', '配置业务审批人')}
                        visible={settingModalVisible}
                        onCancel={this.cancelSettingModal}
                        onOk={this.confirmSettingModal}
                        wrapClassName={styles.settingModal}
                    >
                        <Table
                            columns={columns}
                            dataSource={dataSource}
                            bordered
                            footer={() => this.getTableFooterHtml()}
                            pagination={false}
                            loading={loadingStatus}
                        ></Table>
                    </Modal>
                )}
                {selectRoleModalVisible && (
                    <Modal
                        title={trans('global.replace.pc.selectRole', '请选择角色')}
                        visible={selectRoleModalVisible}
                        onCancel={this.cancelRoleModal}
                        onOk={this.confirmAddRole}
                    >
                        <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder={trans('global.replace.pc.selectRole', '请选择角色')}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
                                0
                            }
                            onChange={this.addRoleItemChange}
                        >
                            {[...formalRoleTagList, ...systemRoleTagList].map((item) => (
                                <Option value={item.tag} key={item.tag} {...item}>
                                    {item.roleName}
                                </Option>
                            ))}
                        </Select>
                    </Modal>
                )}
                {selectTeacherModalVisible && (
                    <Modal
                        title={trans('global.replace.pc.selectTeacher', '请选择教师')}
                        visible={selectTeacherModalVisible}
                        onCancel={this.cancelTeacherModal}
                        onOk={this.confirmAddTeacher}
                    >
                        <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder={trans('global.replace.pc.selectTeacher', '请选择教师')}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
                                0
                            }
                            onChange={this.addTeacherItemChange}
                        >
                            {listAllOrgTeachers.map((item) => (
                                <Option value={item.teacherId} key={item.teacherId} {...item}>
                                    {currentLang === 'cn' ? item.name : item.englishName}
                                </Option>
                            ))}
                        </Select>
                    </Modal>
                )}
            </Spin>
        );
    }
}
