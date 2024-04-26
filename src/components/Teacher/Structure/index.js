//员工管理--组织架构
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './index.less';
import SortableTree from 'components/SortableTree/index';
import {
    Checkbox,
    Select,
    Input,
    Pagination,
    message,
    Dropdown,
    Menu,
    Modal,
    Spin,
    Button,
    Form,
    Upload,
    Icon,
    Table,
} from 'antd';
import icon from '../../../icon.less';
import TeacherTable from './table';
import CreateOrg from './OperModal/createOrg';
import SetOrgRole from './OperModal/setOrgRole';
import AddStaff from './OperModal/addStaff';
import AddExternalStaff from './OperModal/addExternalStaff';
import TransferStaff from './OperModal/transferStaff';
import SelectLeader from './OperModal/selectLeader';
import PowerPage from '../../PowerPage/index';
import { trans, locale } from '../../../utils/i18n';
import { debounce } from '../../../utils/utils';
import lodash from 'lodash';

const { Option } = Select;
const { Search } = Input;
const { confirm } = Modal;
@connect((state) => ({
    treeDataSource: state.teacher.treeDataSource,
    teacherTableList: state.teacher.teacherTableList,
    teacherOrgInfoById: state.teacher.teacherOrgInfoById, //部门的详细信息
    powerStatus: state.global.powerStatus, //是否有权限
    importExternalUserList: state.teacher.importExternalUserList,

    currentUser: state.global.currentUser,
    listSchooliSelectInfo: state.student.listSchooliSelectInfo,
    teacherImportMessage: state.teacher.teacherImportMessage,
}))
export default class TeacherStructure extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            checkValue: true, //是否显示子部门员工
            searchValue: undefined, //模糊搜索
            treeId: 1, //树节点id
            tagCode: '', //部门类型
            isLeaf: false, //是否是叶子节点
            userCount: 0, //部门人员总人数
            current: 1, //当前页数
            pageSize: 20,
            createOrgModal: false, //新建组织
            createOrgType: '', //新建组织的类型
            setOrgRoleVisible: false, //设置组织角色
            addStaffVisible: false, //添加员工
            transferStaffVisible: false, //批量转移 && 单个转移
            rowKeys: [], //table选中的id
            rowIds: [], //table选中的id
            addExternalStaffVisible: false, //新建外部员工
            personType: undefined, //选择员工身份
            staffType: undefined, //选择员工类型
            selectLeaderVisible: false, //批量设置直线主管弹窗
            loading: false, //loading加载
            visibleFromExcel: false,
            externalTeacherVisibleFromExcel: false,
            fileList: [],
            checkErrorMessageList: [],
            checkModalVisibility: false,
            successModalVisibility: false,
            successNumber: '',
            failureNumber: '',
            isUploading: false,
            isExternalTeachers: false, //是否是外聘教师
            isDisabled: false,
            selectSchoolId: '', // 学校id
            errorVisible: false,
        };
    }

    componentDidMount() {
        this.getlistSchooliSelectInfo();
    }

    componentWillMount() {
        this.ifHavePower();
        //获取最顶层节点的详情和学生列表
        this.fetchTreeNodeDetail();
    }

    componentWillUnmount() {
        this.clearData();
    }

    // 关闭Excel导入弹层
    excelModalClose = () => {
        this.setState({
            visibleFromExcel: false,
            fileList: [],
        });
    };

    externalTeacherExcelModalClose = () => {
        this.setState({
            externalTeacherVisibleFromExcel: false,
            fileList: [],
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

    //清空数据
    clearData = () => {
        const { dispatch } = this.props;
        this.setState({
            treeId: '',
            createOrgType: '',
        });
        dispatch({
            type: 'teacher/clearData',
            payload: {},
        });
        dispatch({
            type: 'teacher/clearData',
            payload: {},
        });
    };

    //初始化获取组织结构树
    getTreeOrgFirst() {
        const { dispatch } = this.props;
        const { selectSchoolId } = this.state;
        return dispatch({
            type: 'teacher/getTreeData',
            payload: {
                nodeId: 1, //临时写死
                ifContainUser: true, //是否包含用户
                schoolId: selectSchoolId,
            },
            onSuccess: () => {
                const { treeDataSource } = this.props;
                this.setState({
                    dataSource: treeDataSource,
                    treeId:
                        treeDataSource && treeDataSource.length > 0 && String(treeDataSource[0].id),
                });
            },
        });
    }

    //获取组织结构树
    getTreeOrg() {
        const { dispatch } = this.props;
        const { selectSchoolId } = this.state;
        let self = this;
        setTimeout(function () {
            dispatch({
                type: 'teacher/getTreeData',
                payload: {
                    nodeId: 1, //临时写死
                    ifContainUser: true, //是否包含用户
                    schoolId: selectSchoolId,
                },
                onSuccess: () => {
                    const { treeDataSource } = self.props;
                    self.setState({
                        dataSource: treeDataSource,
                    });
                },
            });
        }, 300);
    }

    //获取点击的树节点
    getSearchNodeId = (selectedKeys) => {
        console.log('selectedKeys :>> ', selectedKeys);
        let keys = selectedKeys[0] ? selectedKeys[0].split('-') : '';
        console.log('keys :>> ', keys);
        if (!keys) return false;
        this.setState(
            {
                treeId: keys && keys[0],
                tagCode: keys && keys[1],
                isLeaf: keys && JSON.parse(keys[2]),
                isExternalTeachers: keys && keys[0] && keys[0] === '5',
            },
            () => {
                //根据节点查询信息
                this.setState({
                    checkValue: true,
                    current: 1,
                });
                this.fetchTreeNodeDetail();
            }
        );
    };

    //根据树节点查询详细信息
    fetchTreeNodeDetail = (value) => {
        //如果value是clear，是清空学校，nodeId应该是 1
        const { dispatch } = this.props;
        if (value === 'clear') {
            return this.setState(
                {
                    treeId: 1,
                },
                () => {
                    console.log('this.state.treeId :>> ', this.state.treeId);
                    dispatch({
                        type: 'teacher/getOrgInfoById',
                        payload: {
                            nodeId: this.state.treeId,
                        },
                        onSuccess: () => {
                            this.setState(
                                {
                                    treeId: 1,
                                },
                                () => {
                                    this.getTeacherList();
                                }
                            );
                        },
                    });
                }
            );
        } else {
            return dispatch({
                type: 'teacher/getOrgInfoById',
                payload: {
                    nodeId: this.state.treeId,
                },
                onSuccess: () => {
                    this.getTeacherList();
                },
            });
        }
    };

    //是否勾选子部门员工
    changeCheckbox = (e) => {
        this.setState(
            {
                checkValue: e.target.checked,
                current: 1,
            },
            () => {
                this.getTeacherList();
            }
        );
    };

    //输入搜索条件搜索
    handleSearch = (value) => {
        this.setState(
            {
                searchValue: value,
                current: 1,
            },
            () => {
                this.getTeacherList();
            }
        );
    };

    //搜索条件中输入内容
    changeSearch = (e) => {
        this.setState({
            searchValue: e.target.value,
        });
    };

    //获取员工列表
    getTeacherList = () => {
        const { dispatch } = this.props;
        const { treeId, searchValue, checkValue, pageSize, current, personType, staffType } =
            this.state;
        console.log('treeId :>> ', treeId);
        if (!treeId) {
            message.info(trans('student.selectOrgTips', '请先选择一个组织再操作哦~'));
            return false;
        }
        this.setState({
            loading: true,
        });
        dispatch({
            type: 'teacher/getTeacherList',
            payload: {
                nodeId: treeId, //树节点id
                keyWord: searchValue || '', //关键字
                ifShowSub: checkValue, //是否显示子部门员工
                pageSize: pageSize,
                pageNum: current,
                identity: personType, //员工角色
                employeeType: staffType, //员工类型
            },
        }).then(() => {
            this.setState({
                rowKeys: [],
                rowIds: [],
                loading: false,
            });
        });
    };

    //切换分页
    switchPage = (page, size) => {
        this.setState(
            {
                current: page,
                pageSize: size,
            },
            () => {
                this.getTeacherList();
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
                this.getTeacherList();
            }
        );
    };

    //新建组织 && 编辑组织
    createOrganization(type) {
        if (!this.state.treeId) {
            message.info(trans('student.selectOrgTips', '请先选择一个组织再操作哦~'));
            return false;
        }
        this.setState({
            createOrgModal: true,
            createOrgType: type,
        });
    }

    //设置组织角色
    setOrganizationRole = () => {
        if (!this.state.treeId) {
            message.info(trans('student.selectOrgTips', '请先选择一个组织再操作哦~'));
            return false;
        }
        this.setState({
            setOrgRoleVisible: true,
        });
    };

    //添加员工
    addStaffModal = () => {
        if (!this.state.treeId) {
            message.info(trans('student.selectOrgTips', '请先选择一个组织再操作哦~'));
            return false;
        }
        this.setState({
            addStaffVisible: true,
        });
    };

    //新建外部员工
    addExternalStaffModal = () => {
        if (!this.state.treeId) {
            message.info(trans('student.selectOrgTips', '请先选择一个组织再操作哦~'));
            return false;
        }
        this.setState({
            addExternalStaffVisible: true,
        });
    };

    //转移员工--批量转移
    transferStaffModal = () => {
        const { treeId, checkValue, rowKeys, rowIds, isLeaf } = this.state;
        if (!this.state.treeId) {
            message.info(trans('student.selectOrgTips', '请先选择一个组织再操作哦~'));
            return false;
        }
        if (checkValue && isLeaf == false) {
            message.info(
                trans('teacher.noAllowedTransfer', '显示子部门员工的条件下，不允许批量转移哦~')
            );
            return false;
        }
        if (rowIds.length == 0) {
            message.info(trans('teacher.pleaseChooseRemoved', '请先选择要转移的员工~'));
            return false;
        }
        this.setState({
            transferStaffVisible: true,
        });
    };

    //弹窗消失
    hideModal = (type) => {
        switch (type) {
            case 'createOrg':
                this.setState({
                    createOrgModal: false,
                });
                break;
            case 'setOrgRole':
                this.setState({
                    setOrgRoleVisible: false,
                });
                break;
            case 'addStaff':
                this.setState({
                    addStaffVisible: false,
                });
                break;
            case 'transferStaff':
                this.setState({
                    transferStaffVisible: false,
                });
                break;
            case 'addExternalStaff':
                this.setState({
                    addExternalStaffVisible: false,
                });
                break;
            case 'selectLeader':
                this.setState({
                    selectLeaderVisible: false,
                });
                break;
        }
    };

    //批量移除
    deleteMore = () => {
        const { treeId, checkValue, rowKeys, rowIds, isLeaf } = this.state;
        let self = this;
        if (!treeId) {
            message.info(trans('student.selectOrgTips', '请先选择一个组织再操作哦~'));
            return false;
        }
        if (checkValue && isLeaf == false) {
            message.info(
                trans('teacher.noAllowedRemove', '显示子部门员工的条件下，不允许批量移除哦~')
            );
            return false;
        }
        if (rowIds.length == 0) {
            message.info(trans('teacher.pleaseChooseRemoved', '请先选择要移除的员工~'));
            return false;
        }
        confirm({
            title: trans('teacher.confirmTransferNum', '确定要将所选{$num}个员工从该组织移除吗？', {
                num: rowIds.length,
            }),
            okText: trans('global.confirm', '确定'),
            cancelText: trans('global.cancel', '取消'),
            onOk() {
                const { dispatch } = self.props;
                dispatch({
                    type: 'teacher/deleteMore',
                    payload: {
                        nodeId: self.state.treeId,
                        userIdList: self.state.rowIds,
                    },
                    onSuccess: () => {
                        self.getTreeOrg();
                        self.getTeacherList();
                        self.setState({
                            rowKeys: [],
                            rowIds: [],
                        });
                    },
                });
            },
        });
    };

    //批量设置直线主管
    batchSetController = () => {
        const { treeId, rowIds } = this.state;
        let self = this;
        if (!treeId) {
            message.info(trans('student.selectOrgTips', '请先选择一个组织再操作哦~'));
            return false;
        }
        if (rowIds.length == 0) {
            message.info(
                trans('teacher.batchSetLeaderBeforeSelect', '先选择人员再批量设置直线主管哦~')
            );
            return false;
        }
        this.setState({
            selectLeaderVisible: true,
        });
    };

    //统计table选中的项
    fetchRowKeys = (keys, rowIds) => {
        this.setState({
            rowKeys: keys,
            rowIds: rowIds,
        });
    };

    //格式化部门中的角色
    formatRoleList = (detail) => {
        if (!detail || detail.length == 0) return '---';
        return detail.map((item) => {
            return <em key={item.id}>{locale() == 'en' ? item.ename : item.name}</em>;
        });
    };

    //选择员工身份
    changePersonType = (value) => {
        this.setState(
            {
                personType: value,
                staffType: undefined,
                current: 1,
            },
            () => {
                //筛选员工列表
                this.getTeacherList();
            }
        );
    };

    //选择员工类型
    changeStaffType = (value) => {
        this.setState(
            {
                staffType: value,
                current: 1,
            },
            () => {
                //筛选员工列表
                this.getTeacherList();
            }
        );
    };

    // 确定从Excel导入
    sureImport = (e) => {
        let { fileList } = this.state;
        let formData = new FormData();
        for (let item of fileList) {
            formData.append('file', item);
        }
        this.setState({
            isUploading: true,
        });
        if (!lodash.isEmpty(fileList)) {
            this.props
                .dispatch({
                    type: 'teacher/importUserList',
                    payload: formData,
                    /* onSuccess: (res) => {
                        message.success('导入成功');
                        this.setState({
                            fileList: [],
                            visibleFromExcel: false,
                            isDisabled: false,
                        });
                        this.getTeacherList();
                    }, */
                })
                .then(() => {
                    let { teacherImportMessage } = this.props;
                    this.setState({
                        isUploading: false,
                        isDisabled: false,
                    });
                    if (!lodash.isEmpty(teacherImportMessage)) {
                        this.setState({
                            fileList: [],
                            importErrorList: teacherImportMessage.checkErrorMessageList,
                            errorVisible: true,
                        });
                    } else {
                        this.setState({
                            fileList: [],
                            visibleFromExcel: false,
                        });
                        this.getTeacherList();
                    }
                });
        }
    };

    //外聘教师确定导入
    externalTeacherSureImport = () => {
        let { fileList } = this.state;
        console.log('fileList :>> ', fileList);
        let formData = new FormData();
        for (let item of fileList) {
            formData.append('file', item);
        }
        this.setState({
            isUploading: true,
        });
        if (!lodash.isEmpty(fileList)) {
            this.props
                .dispatch({
                    type: 'teacher/importExternalUserList',
                    payload: formData,
                })
                .then(() => {
                    let { importExternalUserList } = this.props;
                    console.log('importExternalUserList :>> ', importExternalUserList);
                    this.setState({
                        isUploading: true,
                        fileList: [],
                    });
                    if (!lodash.isEmpty(importExternalUserList.checkErrorMessageList)) {
                        this.setState({
                            successModalVisibility: true,
                            successNumber: importExternalUserList.successNumber,
                            failureNumber: importExternalUserList.failureNumber,
                            checkErrorMessageList: importExternalUserList.checkErrorMessageList,
                        });
                    } else {
                        message.success(trans('global.scheduleImportSuccess', '导入成功'));
                        this.setState(
                            {
                                externalTeacherVisibleFromExcel: false,
                            },
                            () => {
                                this.getTeacherList();
                            }
                        );
                    }
                });
        }
    };

    getlistSchooliSelectInfo = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'student/getListSchool',
            payload: {},
            onSuccess: () => {
                this.setState({
                    selectSchoolId: this.props.currentUser.schoolId,
                });
                this.getTreeOrgFirst();
            },
        });
    };

    changeSelectSchool = (value) => {
        this.setState(
            {
                selectSchoolId: value,
                nodeId: 1,
            },
            () => {
                this.getTreeOrgFirst().then(() => {
                    this.fetchTreeNodeDetail(value ? value : 'clear');
                });
            }
        );
    };

    render() {
        const { teacherTableList, teacherOrgInfoById, powerStatus } = this.props;
        const {
            checkValue,
            current,
            tagCode,
            isLeaf,
            personType,
            staffType,
            loading,
            visibleFromExcel,
            externalTeacherVisibleFromExcel,
            fileList,
            isUploading,
            isExternalTeachers,
            successModalVisibility,
            successNumber,
            failureNumber,
            checkErrorMessageList,
            errorVisible,
            importErrorList,
            isDisabled,
        } = this.state;
        const columns = [
            {
                title: trans('global.rowNumber', '行号'),
                dataIndex: 'lineNumber',
                key: 'lineNumber',
                width: 100,
            },
            {
                title: trans('global.scheduleImportError', '错误信息'),
                dataIndex: 'errorMessage',
                key: 'errorMessage',
                ellipsis: true,
                width: 250,
            },
        ];
        let tableSource = (teacherTableList && teacherTableList.orgUserList) || [];
        let orgInfo = teacherOrgInfoById || {};
        let totalPage = teacherTableList && teacherTableList.total;
        //是否显示编辑组织的入口
        let isShowEditOrg =
            tagCode == 'TEACHING_RESEARCH_GROUP' || tagCode == 'DEPARTMENT' ? true : false;
        //判断是否有权限新建、编辑、删除组织、设置组织角色
        let havePowerCreate =
            powerStatus.content &&
            powerStatus.content.indexOf('smart:teaching:employee:structure:edit') != -1
                ? true
                : false;
        //判断是否有权限从组织移除、转移员工、往组织中添加员工
        let havePowerTransfer =
            powerStatus.content &&
            powerStatus.content.indexOf('smart:teaching:employee:relation:site') != -1
                ? true
                : false;
        //判断是否有权限编辑人员信息、批量设置直线主管
        let havePowerEditInfo =
            powerStatus.content &&
            powerStatus.content.indexOf('smart:teaching:employee:info:edit') != -1
                ? true
                : false;
        //判断是否有权限显示新建员工
        let havePowerCreateTeacher =
            powerStatus.content && powerStatus.content.indexOf('smart:teaching:employee:add') != -1
                ? true
                : false;
        //是否显示批量操作
        let isShowBatchOper = havePowerTransfer || havePowerEditInfo ? true : false;
        const menu = (
            <Menu>
                <Menu.Item key="0">
                    {havePowerTransfer && (
                        <span className={styles.batchDeleteBtn} onClick={this.deleteMore}>
                            {trans('student.batchRemove', '批量移除')}
                        </span>
                    )}
                </Menu.Item>
                <Menu.Item key="1">
                    {havePowerTransfer && (
                        <span className={styles.batchDeleteBtn} onClick={this.transferStaffModal}>
                            {trans('student.transferMore', '批量转移到')}
                        </span>
                    )}
                </Menu.Item>
                <Menu.Item key="2">
                    {havePowerEditInfo && (
                        <span className={styles.batchDeleteBtn} onClick={this.batchSetController}>
                            {trans('teacher.batchSetBoss', '批量设置直线主管')}
                        </span>
                    )}
                </Menu.Item>
            </Menu>
        );

        //判断是否有访问组织架构树、人员列表、组织角色列表的权限
        if (
            powerStatus.content &&
            powerStatus.content.indexOf('smart:teaching:employee:structure:look') == -1
        ) {
            return (
                <div className={styles.structurePage}>
                    <PowerPage />
                </div>
            );
        }

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

        let errorColumns = [
            {
                title: '行号',
                dataIndex: 'lineNumber',
                width: 100,
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

        return (
            <div
                className={
                    window.self != window.top
                        ? `${styles.structurePage} ${styles.fullPage}`
                        : styles.structurePage
                }
            >
                <div className={styles.leftBar}>
                    <SortableTree
                        {...this.state}
                        {...this.props}
                        selectSchoolId={this.state.selectSchoolId}
                        getSearchNodeId={this.getSearchNodeId}
                        statusType={1}
                        isSelectSchoolOnly={true}
                        listSchooliSelectInfo={this.props.listSchooliSelectInfo}
                        changeSelectSchool={this.changeSelectSchool}
                    />
                </div>
                <div className={styles.rightContainer}>
                    <div className={styles.infoCard}>
                        <div className={styles.infoDetail}>
                            <div className={styles.infoTitle}>
                                <p>
                                    <span className={styles.orgName}>
                                        {/* {orgInfo.name || '--'} {orgInfo.ename} */}
                                        {locale() !== 'en' ? orgInfo.name || '--' : orgInfo.ename}
                                    </span>
                                    <span>
                                        {locale() == 'en' ? orgInfo.orgTagCode : orgInfo.orgTagName}
                                    </span>
                                    {havePowerCreate && isShowEditOrg && (
                                        <a
                                            className={styles.editOrgBtn}
                                            onClick={this.createOrganization.bind(this, 'edit')}
                                        >
                                            {trans('global.edit', '编辑')}
                                        </a>
                                    )}
                                </p>
                            </div>
                            <div className={styles.infoOther}>
                                <p>
                                    {orgInfo.orgRoleList &&
                                        orgInfo.orgRoleList.length > 0 &&
                                        orgInfo.orgRoleList.map((item, index) => {
                                            return (
                                                <span key={index}>
                                                    {item.leader == true && (
                                                        <i
                                                            className={
                                                                icon.iconfont +
                                                                ' ' +
                                                                styles.isLeader
                                                            }
                                                        >
                                                            &#xe74d;
                                                        </i>
                                                    )}
                                                    {locale() == 'en' ? item.code : item.name}：
                                                    {this.formatRoleList(item.userList)}
                                                </span>
                                            );
                                        })}
                                    {havePowerCreate && (
                                        <a
                                            className={styles.setOrgBtn}
                                            onClick={this.setOrganizationRole}
                                        >
                                            {trans('organization.setRole', '设置角色')}
                                        </a>
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className={styles.infoOperation}>
                            {havePowerCreate && (
                                <span
                                    className={styles.createOrgBtn}
                                    onClick={this.createOrganization.bind(this, 'create')}
                                >
                                    {/* <i className={icon.iconfont}>&#xe75a;</i> */}
                                    {/* {trans('student.createOrg', '新建组织')} */}
                                    {trans('student.add.department', '新建部门')}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className={styles.infoTable}>
                        <div className={styles.searchCondition}>
                            <div className={styles.leftCondition}>
                                <div className={styles.selectList}>
                                    <p className={styles.keywordSearch}>
                                        <span>
                                            {trans('teacher.searchByKeyword', '关键字搜索')}：
                                        </span>
                                        <Search
                                            placeholder={trans(
                                                'teacher.searchByName',
                                                '请输入姓名/英文名/工号/手机号搜索'
                                            )}
                                            onSearch={this.handleSearch}
                                            onChange={this.changeSearch}
                                            style={{ width: 290 }}
                                            className={styles.searchStyle}
                                        />
                                    </p>
                                    <div>
                                        <span>{trans('teacher.teacherType', '员工类型')}：</span>
                                        <Select
                                            placeholder={trans('student.pleaseSelect', '请选择')}
                                            allowClear
                                            style={{ width: 120, marginRight: 5 }}
                                            className={styles.selectStyle}
                                            onChange={this.changePersonType}
                                        >
                                            <Option value={2}>
                                                {trans('teacher.staff', '员工')}
                                            </Option>
                                            <Option value={4}>
                                                {trans('teacher.externalStaff', '外聘')}
                                            </Option>
                                        </Select>
                                        {personType == 2 && (
                                            <Select
                                                placeholder={trans(
                                                    'student.pleaseSelect',
                                                    '请选择'
                                                )}
                                                allowClear
                                                style={{ width: 120 }}
                                                className={styles.selectStyle}
                                                onChange={this.changeStaffType}
                                            >
                                                <Option value="全职">
                                                    {trans('teacher.fullTime', '全职')}
                                                </Option>
                                                <Option value="兼职">
                                                    {trans('teacher.partTime', '兼职')}
                                                </Option>
                                                <Option value="实习">
                                                    {trans('teacher.internship', '实习')}
                                                </Option>
                                                <Option value="劳务派遣">
                                                    {trans('teacher.laborDispatch', '劳务派遣')}
                                                </Option>
                                                <Option value="退休返聘">
                                                    {trans('teacher.recruitment', '退休返聘')}
                                                </Option>
                                                <Option value="劳务外包">
                                                    {trans('teacher.outsourcing', '劳务外包')}
                                                </Option>
                                            </Select>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.conditionArea}>
                                    <p>
                                        <span className={styles.personNum}>
                                            {trans('teacher.departmentPerson', '部门人员')}
                                            <em>
                                                {trans('teacher.totalNumber', '共 {$num} 人', {
                                                    num: totalPage || 0,
                                                })}
                                            </em>
                                        </span>
                                    </p>
                                    <div className={styles.rightCondition}>
                                        {isLeaf == false && (
                                            <p>
                                                <Checkbox
                                                    onChange={this.changeCheckbox}
                                                    checked={checkValue}
                                                >
                                                    <span className={styles.checkboxContent}>
                                                        {trans(
                                                            'teacher.showSubStaff',
                                                            '显示子部门员工'
                                                        )}
                                                    </span>
                                                </Checkbox>
                                            </p>
                                        )}
                                    </div>
                                    <div className={styles.batchCondition}>
                                        {isShowBatchOper && (
                                            <Dropdown overlay={menu} trigger={['click']}>
                                                <a className={styles.batchButton}>
                                                    <i className={icon.iconfont}>&#xe62d;</i>
                                                    {trans('student.batchOperation', '批量操作')}
                                                </a>
                                            </Dropdown>
                                        )}
                                        {havePowerTransfer && (
                                            <span
                                                className={styles.addPerson}
                                                onClick={this.addStaffModal}
                                            >
                                                <i className={icon.iconfont}>&#xe75a;</i>
                                                {trans('teacher.add', '添加')}
                                            </span>
                                        )}
                                        {havePowerCreateTeacher && (
                                            <span
                                                className={styles.addPerson}
                                                onClick={this.addExternalStaffModal}
                                            >
                                                <i className={icon.iconfont}>&#xe74c;</i>
                                                {trans('teacher.new', '新建')}
                                            </span>
                                        )}
                                        <span>
                                            {
                                                /* isExternalTeachers ? (
                                                <span
                                                    className={styles.reloadBtn}
                                                    onClick={() => {
                                                        this.setState({
                                                            externalTeacherVisibleFromExcel: true,
                                                            isUploading: false,
                                                        });
                                                    }}
                                                >
                                                    <Icon type="upload" />
                                                    {trans(
                                                        'student.externalTeacherBatchImport',
                                                        '外聘教师批量导入'
                                                    )}
                                                </span>
                                            ) : */ <span
                                                    className={styles.reloadBtn}
                                                    onClick={() => {
                                                        this.setState({
                                                            visibleFromExcel: true,
                                                            isUploading: false,
                                                        });
                                                    }}
                                                >
                                                    <Icon type="upload" />
                                                    {trans(
                                                        'student.batchImportTeachers',
                                                        '批量导入'
                                                    )}
                                                </span>
                                            }
                                        </span>
                                        <span
                                            className={styles.reloadBtn}
                                            onClick={this.getTeacherList}
                                        >
                                            <i className={icon.iconfont}>&#xe732;</i>
                                            {trans('global.refresh', '刷新')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.personList}>
                            <Spin tip="loading..." spinning={loading}>
                                <TeacherTable
                                    {...this.state}
                                    {...this.props}
                                    tableSource={tableSource}
                                    fetchRowKeys={this.fetchRowKeys}
                                    getTeacherList={this.getTeacherList}
                                    havePowerTransfer={havePowerTransfer}
                                    havePowerEditInfo={havePowerEditInfo}
                                    getTreeOrg={this.getTreeOrg.bind(this)}
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
                                    // locale="zh-CN"
                                    defaultPageSize={20}
                                    pageSizeOptions={['10', '20', '40', '100']}
                                    onChange={this.switchPage}
                                    onShowSizeChange={this.switchPageSize}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <CreateOrg
                    {...this.state}
                    hideModal={this.hideModal}
                    getTreeOrg={this.getTreeOrg.bind(this)}
                    clearData={this.clearData}
                    fetchTreeNodeDetail={this.fetchTreeNodeDetail}
                />
                <SetOrgRole
                    {...this.state}
                    hideModal={this.hideModal}
                    orgInfo={orgInfo}
                    fetchTreeNodeDetail={this.fetchTreeNodeDetail}
                />
                <AddStaff
                    {...this.state}
                    hideModal={this.hideModal}
                    getTeacherList={this.getTeacherList}
                    getTreeOrg={this.getTreeOrg.bind(this)}
                />
                <TransferStaff
                    {...this.state}
                    hideModal={this.hideModal}
                    transferType="batch"
                    getTreeOrg={this.getTreeOrg.bind(this)}
                    getTeacherList={this.getTeacherList}
                />
                <AddExternalStaff
                    {...this.state}
                    hideModal={this.hideModal}
                    getTeacherList={this.getTeacherList}
                    getTreeOrg={this.getTreeOrg.bind(this)}
                    identity={'staff'}
                />
                <SelectLeader
                    {...this.state}
                    hideModal={this.hideModal}
                    getTeacherList={this.getTeacherList}
                    getTreeOrg={this.getTreeOrg.bind(this)}
                />

                <Modal
                    title={trans('global.importTeachers', '批量导入教师')}
                    visible={visibleFromExcel}
                    onCancel={this.excelModalClose}
                    // onOk={debounce(this.sureImport, 800)}
                    className={styles.exportModal}
                    footer={
                        <div>
                            <Button onClick={() => this.excelModalClose()}>
                                {trans('global.cancel', '取消')}
                            </Button>
                            <Button
                                type="primary"
                                disabled={isDisabled}
                                onClick={() =>
                                    this.setState(
                                        {
                                            isDisabled: true,
                                        },
                                        () => {
                                            debounce(this.sureImport());
                                        }
                                    )
                                }
                            >
                                {trans('global.importScheduleConfirm', '确认导入')}
                            </Button>
                        </div>
                    }
                >
                    <div>
                        {/* <span className={styles.explain}>{trans('', '操作说明')}</span> */}
                        <p>
                            <span style={{ marginRight: '8px' }}>①</span>
                            {trans(
                                'global.downloadTemplateTeachers',
                                '下载导入模板，批量填写教师信息'
                            )}
                            <a
                                href="/api/teaching/student/simpleTeacherTemplateDownload"
                                target="_blank"
                                style={{ marginLeft: '20px' }}
                            >
                                {/* 下载导入模板 */}
                                {trans('global.downloadImportTemplate', '下载导入模板')}
                            </a>
                        </p>
                        <p>
                            <span style={{ marginRight: '8px' }}>③</span>
                            {trans('global.uploadForm', '上传填写好的信息表')}
                        </p>
                    </div>
                    <Spin
                        spinning={isUploading}
                        tip={trans('global.file uploading', '文件正在上传中')}
                    >
                        <div className={styles.upLoad}>
                            {/* <span className={styles.text}>{trans('', '上传文件')}</span> */}
                            <span className={styles.desc}>
                                <span className={styles.fileBtn}>
                                    <Form
                                        id="uploadForm"
                                        layout="inline"
                                        method="post"
                                        className={styles.form}
                                        encType="multipart/form-data"
                                    >
                                        <Upload {...uploadProps} maxCount={1}>
                                            <Button>
                                                {/* <Icon type="upload" /> */}
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
                    title="导入课程失败信息"
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

                <Modal
                    title={trans('', '从Excel导入外聘教师')}
                    visible={externalTeacherVisibleFromExcel}
                    onCancel={this.externalTeacherExcelModalClose}
                    onOk={debounce(this.externalTeacherSureImport)}
                >
                    <div>
                        <span className={styles.explain}>{trans('', '操作说明')}</span>
                        {/* <span>
              {trans("", "从Excel导入学生，需确保学生所在的班级存在。")}
            </span> */}
                    </div>
                    <Spin
                        spinning={isUploading}
                        tip={trans('global.file uploading', '文件正在上传中')}
                    >
                        <div className={styles.upLoad}>
                            <span className={styles.text}>
                                {trans('student.uploadFile', '上传文件')}
                            </span>
                            <span className={styles.desc}>
                                <span className={styles.fileBtn}>
                                    <Form
                                        id="uploadForm"
                                        layout="inline"
                                        method="post"
                                        className={styles.form}
                                        encType="multipart/form-data"
                                    >
                                        <Upload {...uploadProps}>
                                            <Button>
                                                <Icon type="upload" />
                                            </Button>
                                        </Upload>
                                    </Form>
                                </span>
                            </span>
                            <span>
                                员工导入模板请
                                <a
                                    href="/api/teaching/download/addExternalEmployeeExcelTemplate"
                                    target="_blank"
                                >
                                    {trans('global.downloadImportTemplate', '下载导入模板')}
                                </a>
                            </span>
                        </div>
                    </Spin>
                </Modal>

                {/* 导入完成失败 */}
                <Modal
                    className={styles.successModal}
                    visible={successModalVisibility}
                    title={trans('global.importComplete', '导入完成')}
                    closable={false}
                    footer={[
                        <Button
                            type="primary"
                            className={styles.reUpload}
                            onClick={() => {
                                this.setState({
                                    successModalVisibility: false,
                                    fileList: [],
                                    externalTeacherVisibleFromExcel: false,
                                });
                            }}
                        >
                            {trans('global.importGotIt', '我知道了')}
                        </Button>,
                    ]}
                >
                    <p>
                        {/* {locale() === "en"
              ? `The processing is completed. ${successNumber} items processed successfully, ${failureNumber} items failed. The reasons for the failure are as follows`
              : `处理完成，共成功处理 ${successNumber} 条，失败 ${failureNumber}
              条，失败原因如下:`} */}
                        失败原因如下
                    </p>
                    <Table
                        dataSource={checkErrorMessageList}
                        columns={columns}
                        rowKey="lineNumber"
                        pagination={false}
                    />
                </Modal>
            </div>
        );
    }
}
