//员工管理--教师列表
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Modal, Dropdown, Menu, message } from 'antd';
import styles from './table.less';
import icon from '../../../icon.less';
import { trans, locale } from '../../../utils/i18n';
import TransferStaff from './OperModal/transferStaff';
import LookStaffDetailDrawer from './OperModal/lookStaffDetail';

const { confirm } = Modal;

@connect((state) => ({
    currentUser: state.global.currentUser, //当前用户信息
}))
export default class TeacherTable extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            record: {},
            transferStaffVisible: false,
            staffDrawerVisible: false, //查看员工详情drawer
        };
    }

    //选中表格项
    onSelectChange = (selectedRowKeys, selectRows) => {
        let ids = this.getSelectRowId(selectRows);
        const { fetchRowKeys } = this.props;
        typeof fetchRowKeys == 'function' && fetchRowKeys.call(this, selectedRowKeys, ids);
    };

    //获取选中行的id
    getSelectRowId = (arr) => {
        if (!arr || arr.length == 0) return [];
        let ids = [];
        arr.map((item) => {
            ids.push(item.userId);
        });
        return ids;
    };

    //移除员工
    deleteStaff(record) {
        if (this.props.checkValue && this.props.isLeaf == false) {
            message.info(
                trans('teacher.noAllowSingleRemove', '显示子部门员工的条件下，不允许移除员工哦~')
            );
            return false;
        }
        let self = this;
        confirm({
            title: trans('teacher.confirmRemoveTeacher', '确定要将此员工从该组织移除吗？'),
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
                        const { getTeacherList, getTreeOrg } = self.props;
                        typeof getTeacherList == 'function' && getTeacherList.call(self);
                        typeof getTreeOrg == 'function' && getTreeOrg.call(self);
                    },
                });
            },
        });
    }

    //删除员工
    delete(record) {
        let self = this;
        confirm({
            title: trans('teacher.confirmDeleteTeacher', '确定要将此员工从该组织删除吗？'),
            okText: trans('global.confirm', '确定'),
            cancelText: trans('global.cancel', '取消'),
            onOk() {
                const { dispatch } = self.props;
                dispatch({
                    type: 'teacher/delete',
                    payload: {
                        userId: record.userId,
                    },
                    onSuccess: () => {
                        const { getTeacherList, getTreeOrg } = self.props;
                        typeof getTeacherList == 'function' && getTeacherList.call(self);
                        typeof getTreeOrg == 'function' && getTreeOrg.call(self);
                    },
                });
            },
        });
    }

    //转移员工
    transferStaff(record) {
        if (this.props.checkValue && this.props.isLeaf == false) {
            message.info(
                trans('teacher.noAllowSingleTransfer', '显示子部门员工的条件下，不允许转移员工哦~')
            );
            return false;
        }
        this.setState({
            transferStaffVisible: true,
            record: record,
        });
    }

    getCountryList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'teacher/getCountryList',
            payload: {},
        });
    };

    //查看员工详情
    lookStaffDetail = (record) => {
        this.getCountryList();
        this.setState(
            {
                record: record,
            },
            () => {
                this.setState({
                    staffDrawerVisible: true,
                });
            }
        );
    };

    hideModal = (type) => {
        if (type == 'transferStaff') {
            this.setState({
                transferStaffVisible: false,
                record: {},
            });
        }
    };

    //关闭员工详情
    closeDrawer = () => {
        this.setState({
            staffDrawerVisible: false,
        });
    };

    //判断是否有权限访问
    ifHavePower(url) {
        const { dispatch, currentUser } = this.props;
        let userId = currentUser && currentUser.userId;
        return dispatch({
            type: 'global/havePower',
            payload: {
                entryName: url,
                currentUserId: userId,
            },
        });
    }

    render() {
        const { tableSource, rowKeys, havePowerTransfer } = this.props;
        let self = this;
        const columns = [
            {
                title: trans('student.name', '姓名'),
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: trans('student.englishName', '英文名'),
                dataIndex: 'ename',
                key: 'ename',
            },
            {
                title: trans('teacher.workNo', '工号'),
                dataIndex: 'workNo',
                key: 'workNo',
            },
            {
                title: trans('student.mobile', '手机号码'),
                dataIndex: 'mobile',
                key: 'mobile',
            },
            {
                title: trans('teacher.identityName', '人员类型'),
                dataIndex: locale() != 'en' ? 'identityName' : 'identity',
                key: 'identityName',
            },
            {
                title: trans('teacher.leaderName', '直线主管'),
                dataIndex: locale() != 'en' ? 'leaderName' : 'leaderEnglishName',
                key: 'leaderName',
            },
            {
                title: trans('teacher.orgRoleShow', '组织角色'),
                dataIndex: locale() != 'en' ? 'orgRoleShow' : 'orgRoleShowEnglish',
                key: 'orgRoleShow',
            },
            {
                title: trans('student.opeation', '操作'),
                key: 'operation',
                render: function (text, record) {
                    const menu = (
                        <Menu>
                            <Menu.Item key="0">
                                <span
                                    className={styles.deleteStaffStyle}
                                    onClick={self.deleteStaff.bind(self, record)}
                                >
                                    {trans('student.remove', '移除')}
                                </span>
                            </Menu.Item>
                            <Menu.Item key="1">
                                <span
                                    className={styles.deleteStaffStyle}
                                    onClick={self.transferStaff.bind(self, record)}
                                >
                                    {trans('student.transferTo', '转移到')}
                                </span>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <span
                                    className={styles.deleteStaffStyle}
                                    onClick={self.delete.bind(self, record)}
                                >
                                    {trans('global.delete', '删除')}
                                </span>
                            </Menu.Item>
                        </Menu>
                    );
                    return (
                        <div>
                            <span
                                className={styles.detailBtn}
                                onClick={self.lookStaffDetail.bind(self, record)}
                            >
                                {trans('student.detail', '详情')}
                            </span>
                            {havePowerTransfer && (
                                <Dropdown
                                    overlay={menu}
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
                },
            },
        ];
        const rowSelection = {
            selectedRowKeys: rowKeys,
            onChange: this.onSelectChange,
        };
        tableSource.map((el, i) => (el.key = i));
        return (
            <div className={styles.teacherTableBox}>
                <Table
                    rowKey={(record) => record.key}
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={tableSource}
                    pagination={false}
                ></Table>
                <TransferStaff
                    {...this.props}
                    {...this.state}
                    hideModal={this.hideModal}
                    transferType="single"
                />
                <LookStaffDetailDrawer
                    {...this.props}
                    {...this.state}
                    closeDrawer={this.closeDrawer}
                    identity={'staff'}
                />
            </div>
        );
    }
}
