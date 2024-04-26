//外聘管理
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
    Input,
    Dropdown,
    Menu,
    Icon,
    Table,
    Divider,
    Popconfirm,
    Pagination,
    Spin,
    message,
    Form,
    Upload,
    Modal,
    Button,
    TreeSelect,
    Breadcrumb,
    Drawer,
    Radio,
    Select,
} from 'antd';
import styles from './index.less';
import { isEmpty } from 'lodash';
import { trans } from '../../../utils/i18n';
import { debounce } from '../../../utils/utils';
import LookStaffDetailDrawer from '../Structure/OperModal/lookStaffDetail';
import AddExternalStaff from '../Structure/OperModal/addExternalStaff';
import QRCode from 'qrcode.react';

const { Item } = Form;
const { Search } = Input;
const arr = [
    { id: 0, type: trans('global.unknown', '未知') },
    { id: 1, type: trans('student.idCard', '身份证') },
    { id: 2, type: trans('student.studentCard', '学生证') },
    { id: 3, type: trans('student.certificate', '军官证') },
    { id: 4, type: trans('student.passport', '护照') },
    { id: 5, type: trans('student.passCheck', '港澳通行证') },
];
@Form.create()
@connect((state) => ({
    employeeLists: state.teacher.employeeLists,
    powerStatus: state.global.powerStatus, //是否有权限
    treeDataSource: state.teacher.treeDataSource,
    currentUser: state.global.currentUser,
    importExternalUserList: state.teacher.importExternalUserList,
    countryInfoData: state.teacher.countryInfoData, //国家列表
    approveExternalDetail: state.teacher.approveExternalDetail, //外聘详情列表
}))
export default class TeacherAdministration extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            seletedIdx: 0,
            infoKeyWord: '', //根据基础信息搜索
            identityWord: '', //根据证件号码搜索
            companyWord: '', //根据机构搜索
            pageSize: 10,
            pageNumber: 1,
            selectedRows: [], //选中行
            staffDrawerVisible: false, //抽屉
            record: {},
            addExternalStaffVisible: false, // 新建外聘
            dataSource: [],
            externalTeacherVisibleFromExcel: false,
            isUploading: false,
            fileList: [],
            checkErrorMessageList: [],
            successModalVisibility: false,
            organizedValue: undefined,
            showFlag: false,
            identityInfoList: [], //身份信息图片

            invitedVisible: false,
            workCardImageModel: {},
        };
    }

    componentDidMount() {
        this.getTableData();
        this.getTreeOrg();
        this.getCountryList();
    }

    getTableData = () => {
        this.setState({
            loading: true,
        });
        const { infoKeyWord, identityWord, companyWord, seletedIdx, pageSize, pageNumber } =
            this.state;
        this.props
            .dispatch({
                type: 'teacher/getTableData',
                payload: {
                    tagType: seletedIdx + 1,
                    keyWord: infoKeyWord,
                    certNo: identityWord,
                    agencyName: companyWord,
                    pageSize: pageSize,
                    pageNum: pageNumber,
                },
            })
            .then(() => {
                this.setState({
                    loading: false,
                });
            });
    };

    //选择tab
    selTab = (index) => {
        this.setState(
            {
                seletedIdx: index,
                pageNumber:1,
                pageSize: 10
            },
            () => {
                this.getTableData();
            }
        );
    };

    filterByInfo = (type, value) => {
        this.setState(
            {
                [type]: value,
                pageNumber: 1,
            },
            () => {
                this.getTableData();
            }
        );
    };

    changeKeyWord = (type, e) => {
        console.log('e.target.value: ', e.target.value);
        this.setState({
            [type]: e.target.value,
        });
    };

    cancelResign = () => {};

    //删除
    delEmployee = (info) => {
        this.props.dispatch({
            type: 'teacher/deletedExternalEmployee',
            payload: {
                userId: info?.userId,
            },
            onSuccess: () => {
                this.getTableData();
            },
        });
    };

    cancelDel = () => {};

    // 改变一页展示的数量
    onShowSizeChange = (current, pageSize) => {
        this.setState(
            {
                pageNumber: current,
                pageSize,
            },
            () => {
                this.getTableData();
            }
        );
    };

    // 改变页码
    changePageSize = (page) => {
        this.setState(
            {
                pageNumber: page,
            },
            () => {
                this.getTableData();
            }
        );
    };

    batchQuitExternalEmployee = (ids) => {
        if (!ids) {
            message.warn('该角色userId为空，请刷新再操作！');
            return false;
        }
        this.props.dispatch({
            type: 'teacher/batchQuitExternalEmployee',
            payload: {
                userIds: ids,
            },
            onSuccess: () => {
                this.getTableData();
            },
        });
    };

    // 复职
    reinstatement = (record) => {
        this.props.dispatch({
            type: 'teacher/reinstatementExternalEmployee',
            payload: {
                userId: record.userId,
            },
            onSuccess: () => {
                this.getTableData();
            },
        });
    };

    // 离职人员
    resign = (info) => {
        const { selectedRows } = this.state;
        let resignIds = [];
        if (info) {
            resignIds = [info.userId];
        } else {
            if (isEmpty(selectedRows)) {
                message.warn('请先选中须离职人员！');
                return false;
            }
            selectedRows.map((el) => {
                resignIds.push(el.userId);
            });
        }

        this.batchQuitExternalEmployee(resignIds);
    };

    // 查看外聘详情
    lookStaffDetail = (info) => {
        // this.getCountryList();
        this.setState(
            {
                record: info,
            },
            () => {
                this.setState({
                    staffDrawerVisible: true,
                });
            }
        );
    };

    ApprovalDetail = (info) => {
        // this.getCountryList();
        this.props
            .dispatch({
                type: 'teacher/getApproveExternalDetailInfo',
                payload: {
                    userTemplateUnionId: info.userTemplateUnionId,
                },
            })
            .then(() => {
                const { approveExternalDetail } = this.props;
                this.setState(
                    {
                        approvalDrawerVisible: true,
                        record: info,
                    },
                    () => {
                        this.props.form.setFieldsValue({
                            name: approveExternalDetail?.name || '',
                            eName: approveExternalDetail?.eName || '',
                            mobile: approveExternalDetail?.mobile || '',
                            sex: approveExternalDetail?.sex || '',
                            countryName: approveExternalDetail?.countryName || '',
                            certType: approveExternalDetail?.certType || '',
                            certNo: approveExternalDetail?.certNo || '',
                            agencyName: approveExternalDetail?.agencyName || '',
                            agencyContactName: approveExternalDetail?.agencyContactName || '',
                            agencyContactNameMobile:
                                approveExternalDetail?.agencyContactNameMobile || '',
                            teachingPlan: approveExternalDetail?.teachingPlan || '',
                            carNumber: approveExternalDetail?.carNumber || '',
                        });
                        this.setState({
                            workCardImageModel: approveExternalDetail?.workCardImageModel || {},
                        });
                    }
                );
            });
    };

    // 获取国家枚举
    getCountryList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'teacher/getCountryList',
            payload: {},
        });
    };

    //关闭员工详情
    closeDrawer = () => {
        this.setState({
            staffDrawerVisible: false,
        });
    };

    // 待入职和已拒绝抽屉详情
    closeApprovalDrawer = () => {
        this.setState({
            approvalDrawerVisible: false,
        });
    };

    addExternalStaffModal = () => {
        this.setState({
            addExternalStaffVisible: true,
        });
    };

    batchImportExternal = () => {
        this.setState({
            externalTeacherVisibleFromExcel: true,
            isUploading: false,
        });
    };

    hideModal = () => {
        this.setState({
            addExternalStaffVisible: false,
        });
    };

    //获取组织结构树
    getTreeOrg() {
        const { dispatch, currentUser } = this.props;
        let self = this;
        setTimeout(function () {
            dispatch({
                type: 'teacher/getTreeData',
                payload: {
                    nodeId: 1, //临时写死
                    ifContainUser: true, //是否包含用户
                    schoolId: currentUser.schoolId,
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

    externalTeacherExcelModalClose = () => {
        this.setState({
            externalTeacherVisibleFromExcel: false,
            fileList: [],
        });
    };

    //外聘教师确定导入
    externalTeacherSureImport = () => {
        const { organizedValue } = this.state;
        console.log('organizedValue: ', organizedValue);
        let { fileList } = this.state;
        let formData = new FormData();
        if (!organizedValue) {
            message.warn('所属组织必填！');
            return false;
        }
        for (let item of fileList) {
            formData.append('file', item);
        }
        formData.append('orgId', organizedValue);
        this.setState({
            isUploading: true,
        });
        if (!isEmpty(fileList)) {
            this.props
                .dispatch({
                    type: 'teacher/importExternalUserList',
                    payload: formData,
                })
                .then(() => {
                    let { importExternalUserList } = this.props;
                    this.setState({
                        isUploading: true,
                        fileList: [],
                    });
                    if (!isEmpty(importExternalUserList.checkErrorMessageList)) {
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
                                this.getTableData();
                            }
                        );
                    }
                });
        }
    };

    //格式化树节点
    formatTreeData(data) {
        if (!data || data.length == 0) return [];
        let resultArr = [];
        data &&
            data.length > 0 &&
            data.map((item) => {
                let obj = {
                    title: item.name,
                    key: item.id,
                    value: item.id,
                    children: this.formatTreeData(item.treeNodeList),
                };
                resultArr.push(obj);
            });
        return resultArr;
    }

    changeOrganize = (value) => {
        this.setState({
            organizedValue: value,
        });
    };

    // 点击‘查看已拒绝的申请单’展示面包屑
    showBreadCrumb = () => {
        this.setState(
            {
                showFlag: true,
                seletedIdx: 3,
            },
            () => {
                this.getTableData();
            }
        );
    };

    backToHome = () => {
        this.setState(
            {
                showFlag: false,
                seletedIdx: 0,
            },
            () => {
                this.getTableData();
            }
        );
    };

    backToHired = () => {
        this.setState(
            {
                showFlag: false,
                seletedIdx: 2,
            },
            () => {
                this.getTableData();
            }
        );
    };

    handleSubmit = (e) => {
        const { record } = this.state;
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(values.mobile)) {
                    message.error(trans('student.pleaseCheckPhone', '请填写正确的手机号码'));
                    return false;
                }
                if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(values.agencyContactNameMobile)) {
                    message.error('请填写正确的机构联系人号码');
                    return false;
                }
                if (values.certType == '1') {
                    //身份证号码验证
                    if (!/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(values.certNo)) {
                        message.error(trans('student.pleaseCheckId', '请输入正确的身份证号码'));
                        return false;
                    }
                }
                this.props.dispatch({
                    type: 'teacher/updateApproveExternalInfo',
                    payload: {
                        userTemplateUnionId: record.userTemplateUnionId,
                        name: values.name,
                        eName: values.eName,
                        sex: values.sex,
                        mobile: values.mobile,
                        countryName: values.countryName,
                        certType: values.certType,
                        certNo: values.certNo,
                        agencyName: values.agencyName,
                        agencyContactName: values.agencyContactName,
                        agencyContactNameMobile: values.agencyContactNameMobile,
                        carNumber: values.carNumber,
                        teachingPlan: values.teachingPlan,
                    },
                    onSuccess: () => {
                        this.setState(
                            {
                                approvalDrawerVisible: false,
                            },
                            () => {
                                this.getTableData();
                                this.props.form.resetFields();
                            }
                        );
                    },
                });
            }
        });
    };

    uploadIdentity = (info) => {
        let file = info.file;
        if (file && file.status === 'done') {
            const response = file.response?.content ? file.response.content[0] : [];
            let resFile = {
                url: response.url,
                uid: file.uid,
                name: response.fileName,
            };
            let identityInfoList = JSON.parse(JSON.stringify(this.state.identityInfoList));
            identityInfoList.push(resFile);
            this.setState({
                identityInfoList,
                butout: true,
            });
        }
    };

    examination = (flag, record) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'teacher/approveExternalInfo',
            payload: {
                userTemplateUnionId: record.userTemplateUnionId,
                auditStatus: flag ? 2 : 3,
            },
            onSuccess: () => {
                this.getTableData();
            },
        });
    };

    openDrawer = () => {
        this.setState({
            invitedVisible: true,
        });
    };

    copyContent = () => {
        let text = document.getElementById('myText').innerHTML;
        navigator.clipboard.writeText('访问以下链接填写外聘入职申请:' + text);
        message.success('复制成功！');
    };

    render() {
        const {
            seletedIdx,
            isUploading,
            fileList,
            successModalVisibility,
            checkErrorMessageList,
            dataSource,
            showFlag,
            record,
            invitedVisible,
            workCardImageModel,
        } = this.state;
        const { employeeLists, currentUser, countryInfoData } = this.props;
        const { getFieldDecorator } = this.props.form;
        const seletedSrtyle = {
            backgroundColor: '#DDE5F5',
            color: '#3B6FF5',
        };

        const uploadButton = <Icon type="plus" />;

        const operaMenu = (
            <Menu>
                <Menu.Item onClick={this.resign}>离职</Menu.Item>
            </Menu>
        );
        const addMenu = (
            <Menu>
                <Menu.Item onClick={this.addExternalStaffModal}>直接新建</Menu.Item>
                <Menu.Item onClick={this.batchImportExternal}>批量导入</Menu.Item>
            </Menu>
        );

        const treeProps = {
            showSearch: true,
            treeData: this.formatTreeData(dataSource),
            placeholder: '请选择所属组织(必填)',
            dropdownStyle: {
                maxHeight: 400,
                overflow: 'auto',
            },
            onChange: this.changeOrganize,
            treeNodeFilterProp: 'title',
            treeDefaultExpandAll: false,
            className: styles.selectPersonStyle,
        };

        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRows,
                });
            },
            getCheckboxProps: (record) => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name,
            }),
        };

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

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };

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

        // 在职
        const workedColumns = [
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '手机号',
                dataIndex: 'mobile',
                key: 'mobile',
            },
            {
                title: '性别',
                dataIndex: 'sex',
                key: 'sex',
                render: (text, record, index) => {
                    return record.sex == 1 ? '男' : record.sex == 2 ? '女' : '';
                },
            },
            {
                title: '所属机构',
                dataIndex: 'agencyName',
                key: 'agencyName',
            },
            {
                title: '当前学期授课课程',
                dataIndex: 'newCourseClassList',
                key: 'newCourseClassList',
                render: (t, r) => {
                    let data = (t && t.length && t.length > 0 && t) || [];
                    return (
                        data.length > 0 &&
                        data.map((item, index) => {
                            return (
                                <span>
                                    {item.name}
                                    {index + 1 == t.length ? null : '，'}
                                </span>
                            );
                        })
                    );
                },
            },
            {
                title: '入职日期',
                dataIndex: 'entryTimeStr',
                key: 'entryTimeStr',
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <span
                            style={{ color: '#3B6FF5', cursor: 'pointer' }}
                            onClick={() => this.lookStaffDetail(record)}
                        >
                            详情
                        </span>
                        <Divider type="vertical" />
                        <Popconfirm
                            title="确定将此人设为离职状态吗？"
                            onConfirm={() => this.resign(record)}
                            onCancel={this.cancelResign}
                            okText="确定"
                            cancelText="取消"
                        >
                            <span style={{ color: '#3B6FF5', cursor: 'pointer' }}>离职</span>
                        </Popconfirm>
                        <Divider type="vertical" />
                        <Popconfirm
                            title="确定删除此人员吗？"
                            onConfirm={() => this.delEmployee(record)}
                            onCancel={this.cancelDel}
                            okText="删除"
                            cancelText="取消"
                        >
                            <span style={{ color: '#3B6FF5', cursor: 'pointer' }}>删除</span>
                        </Popconfirm>
                    </span>
                ),
            },
        ];

        // 已离职
        const resignedColumns = [
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '手机号',
                dataIndex: 'mobile',
                key: 'mobile',
            },
            {
                title: '性别',
                dataIndex: 'sex',
                key: 'sex',
                render: (text, record, index) => {
                    return record.sex == 1 ? '男' : record.sex == 2 ? '女' : '';
                },
            },
            {
                title: '所属机构',
                dataIndex: 'agencyName',
                key: 'agencyName',
            },
            {
                title: '当前学期授课课程',
                dataIndex: 'course',
                key: 'course',
            },
            {
                title: '离职日期',
                dataIndex: 'dimissionTimeStr',
                key: 'dimissionTimeStr',
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <span
                            style={{ color: '#3B6FF5', cursor: 'pointer' }}
                            onClick={() => this.lookStaffDetail(record)}
                        >
                            详情
                        </span>
                        <Divider type="vertical" />
                        <Popconfirm
                            title="确定将此人复职吗？"
                            onConfirm={() => this.reinstatement(record)}
                            onCancel={this.cancelResign}
                            okText="确定"
                            cancelText="取消"
                        >
                            <span style={{ color: '#3B6FF5', cursor: 'pointer' }}>复职</span>
                        </Popconfirm>
                        <Divider type="vertical" />
                        <Popconfirm
                            title="确定删除此人员吗？"
                            onConfirm={() => this.delEmployee(record)}
                            onCancel={this.cancelDel}
                            okText="删除"
                            cancelText="取消"
                        >
                            <span style={{ color: '#3B6FF5', cursor: 'pointer' }}>删除</span>
                        </Popconfirm>
                    </span>
                ),
            },
        ];

        // 待审核
        const hiredColumns = [
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '手机号',
                dataIndex: 'mobile',
                key: 'mobile',
            },
            {
                title: '性别',
                dataIndex: 'sex',
                key: 'sex',
                render: (text, record, index) => {
                    return record.sex == 1 ? '男' : record.sex == 2 ? '女' : '';
                },
            },
            {
                title: '所属机构',
                dataIndex: 'agencyName',
                key: 'agencyName',
            },
            {
                title: '拟授课课程',
                dataIndex: 'course',
                key: 'course',
            },
            {
                title: '提交日期',
                dataIndex: 'commitTimeStr',
                key: 'commitTimeStr',
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <span
                            style={{ color: '#3B6FF5', cursor: 'pointer' }}
                            onClick={() => this.ApprovalDetail(record)}
                        >
                            详情
                        </span>
                        <Divider type="vertical" />
                        <Popconfirm
                            title="此人员审批是否通过？"
                            onConfirm={() => this.examination(true, record)}
                            onCancel={() => this.examination(false, record)}
                            okText="通过"
                            cancelText="拒绝"
                        >
                            <span style={{ color: '#3B6FF5', cursor: 'pointer' }}>审核</span>
                        </Popconfirm>
                        <Divider type="vertical" />
                        <Popconfirm
                            title="确定删除此人员吗？"
                            onConfirm={() => this.delEmployee(record)}
                            onCancel={this.cancelDel}
                            okText="删除"
                            cancelText="取消"
                        >
                            <span style={{ color: '#3B6FF5', cursor: 'pointer' }}>删除</span>
                        </Popconfirm>
                    </span>
                ),
            },
        ];
        // 已拒绝
        const rejectedColumns = [
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '手机号',
                dataIndex: 'mobile',
                key: 'mobile',
            },
            {
                title: '性别',
                dataIndex: 'sex',
                key: 'sex',
                render: (text, record, index) => {
                    return record.sex == 1 ? '男' : record.sex == 2 ? '女' : '';
                },
            },
            {
                title: '所属机构',
                dataIndex: 'agencyName',
                key: 'agencyName',
            },
            {
                title: '拟授课课程',
                dataIndex: 'course',
                key: 'course',
            },
            {
                title: '提交日期',
                dataIndex: 'commitTimeStr',
                key: 'commitTimeStr',
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <span
                        style={{ color: '#3B6FF5', cursor: 'pointer' }}
                        onClick={() => this.ApprovalDetail(record)}
                    >
                        详情
                    </span>
                ),
            },
        ];
        return (
            <div className={styles.administrationPage}>
                {showFlag ? (
                    <Breadcrumb style={{ height: '32px', lineHeight: '32px' }}>
                        <Breadcrumb.Item onClick={this.backToHome} style={{ cursor: 'pointer' }}>
                            外部人员
                        </Breadcrumb.Item>
                        <Breadcrumb.Item onClick={this.backToHired} style={{ cursor: 'pointer' }}>
                            待审核
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>审核拒绝清单</Breadcrumb.Item>
                    </Breadcrumb>
                ) : (
                    <div className={styles.top}>
                        <span
                            onClick={() => this.selTab(0)}
                            style={seletedIdx == 0 ? seletedSrtyle : {}}
                        >
                            在职
                        </span>
                        <span
                            onClick={() => this.selTab(1)}
                            style={seletedIdx == 1 ? seletedSrtyle : {}}
                        >
                            已离职
                        </span>
                        <span
                            onClick={() => this.selTab(2)}
                            style={seletedIdx == 2 ? seletedSrtyle : {}}
                        >
                            待审核
                        </span>
                        <span style={{ color: '#3B6FF5' }} onClick={this.showBreadCrumb}>
                            查看已拒绝的申请单
                        </span>
                    </div>
                )}

                <div className={styles.content}>
                    <div className={styles.filterStyle}>
                        <div className={styles.leftFilter}>
                            <Search
                                placeholder="姓名/英文名/手机号"
                                onChange={this.changeKeyWord.bind(this, 'infoKeyWord')}
                                onSearch={(value) => this.filterByInfo('infoKeyWord', value)}
                                style={{ width: 200 }}
                            />
                            <Search
                                placeholder="证件号码"
                                onChange={this.changeKeyWord.bind(this, 'identityWord')}
                                onSearch={(value) => this.filterByInfo('identityWord', value)}
                                style={{ width: 200 }}
                            />
                            <Search
                                placeholder="机构名称"
                                onChange={this.changeKeyWord.bind(this, 'companyWord')}
                                onSearch={(value) => this.filterByInfo('companyWord', value)}
                                style={{ width: 200 }}
                            />
                        </div>
                        <div className={styles.operaStyle}>
                            {seletedIdx == 0 && (
                                <Dropdown overlay={operaMenu} className={styles.batchStyle}>
                                    <a
                                        className="ant-dropdown-link"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        批量操作
                                        <Icon type="down" />
                                    </a>
                                </Dropdown>
                            )}

                            {seletedIdx == 0 && (
                                <Dropdown overlay={addMenu} className={styles.addPersonStyle}>
                                    <a
                                        className="ant-dropdown-link"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        添加人员
                                        <Icon type="down" />
                                    </a>
                                </Dropdown>
                            )}
                            {seletedIdx == 0 && (
                                <span className={styles.inviteToJoin} onClick={this.openDrawer}>
                                    邀请加入
                                </span>
                            )}
                        </div>
                    </div>
                    <div className={styles.tableStyle}>
                        <Spin spinning={this.state.loading}>
                            <Table
                                columns={
                                    seletedIdx == 0
                                        ? workedColumns
                                        : seletedIdx == 1
                                        ? resignedColumns
                                        : seletedIdx == 2
                                        ? hiredColumns
                                        : rejectedColumns
                                }
                                rowSelection={rowSelection}
                                dataSource={employeeLists?.data || []}
                                pagination={false}
                            />
                            <Pagination
                                className={styles.paginationStyle}
                                total={employeeLists?.total || 0}
                                current={this.state.pageNumber}
                                onChange={this.changePageSize}
                                showSizeChanger
                                onShowSizeChange={this.onShowSizeChange}
                            />
                        </Spin>
                    </div>
                </div>
                <LookStaffDetailDrawer
                    {...this.props}
                    {...this.state}
                    closeDrawer={this.closeDrawer}
                    getTableData={this.getTableData}
                    identity={'employee'}
                    // havePowerEditInfo={havePowerEditInfo}
                />
                <Drawer
                    width={600}
                    visible={this.state.approvalDrawerVisible}
                    onClose={this.closeApprovalDrawer}
                >
                    <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                        <Item label="姓名">
                            {getFieldDecorator('name', {
                                rules: [
                                    {
                                        required: 'true',
                                        message: '请填写姓名！',
                                    },
                                ],
                            })(<Input placeholder="请输入" />)}
                        </Item>
                        <Item label="英文名">
                            {getFieldDecorator('eName', {})(<Input placeholder="请输入(选填)" />)}
                        </Item>
                        <Item label="手机号码">
                            {getFieldDecorator('mobile', {
                                rules: [
                                    {
                                        required: 'true',
                                        message: '请填写手机号码！',
                                    },
                                ],
                            })(<Input placeholder="请输入" />)}
                        </Item>
                        <Item label="性别">
                            {getFieldDecorator('sex', {
                                rules: [
                                    {
                                        required: 'true',
                                        message: '请选择性别！',
                                    },
                                ],
                            })(
                                <Radio.Group>
                                    <Radio value={'1'}>男</Radio>
                                    <Radio value={'2'}>女</Radio>
                                </Radio.Group>
                            )}
                        </Item>
                        <Item label="国籍">
                            {getFieldDecorator('countryName', {
                                rules: [
                                    {
                                        required: 'true',
                                        message: '请选择国籍！',
                                    },
                                ],
                            })(
                                <Select>
                                    {countryInfoData.map((item) => {
                                        return (
                                            <Select.Option key={item.id} value={item.name}>
                                                {item.name}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            )}
                        </Item>
                        <Item label="证件类型">
                            {getFieldDecorator('certType', {
                                rules: [
                                    {
                                        required: 'true',
                                        message: '请选择身份类型！',
                                    },
                                ],
                            })(
                                <Select>
                                    {arr.map((item) => {
                                        return (
                                            <Select.Option key={item.id} value={item.id}>
                                                {item.type}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            )}
                        </Item>
                        <Item label="证件号码">
                            {getFieldDecorator('certNo', {
                                rules: [
                                    {
                                        required: 'true',
                                        message: '请输入证件号码！',
                                    },
                                ],
                            })(<Input />)}
                        </Item>
                        <Item label="所属机构">
                            {getFieldDecorator('agencyName', {
                                rules: [
                                    {
                                        required: 'true',
                                        message: '请输入！',
                                    },
                                ],
                            })(<Input />)}
                        </Item>
                        <Item label="机构联系人">
                            {getFieldDecorator('agencyContactName', {
                                rules: [
                                    {
                                        required: 'true',
                                        message: '请输入！',
                                    },
                                ],
                            })(<Input />)}
                        </Item>
                        <Item label="机构联系人电话">
                            {getFieldDecorator('agencyContactNameMobile', {
                                rules: [
                                    {
                                        required: 'true',
                                        message: '请输入！',
                                    },
                                ],
                            })(<Input />)}
                        </Item>
                        <Item label="计划授课课程">
                            {getFieldDecorator('teachingPlan', {})(<Input />)}
                        </Item>
                        <Item label="车牌号码">
                            {getFieldDecorator('carNumber', {})(<Input />)}
                        </Item>
                        {/* <Item label="上传工牌照片">
                            {getFieldDecorator(
                                'workCardImageModel',
                                {}
                            )(
                                <Upload
                                    action="/api/upload_file"
                                    listType="picture-card"
                                    onChange={this.uploadIdentity}
                                    // fileList={identityInfoList}
                                >
                                    {uploadButton}
                                </Upload>
                            )}
                        </Item> */}
                        <Item label="工牌照片">
                            {workCardImageModel && workCardImageModel.previewImage ? (
                                <img
                                    style={{ display: 'inline-block', width: 100, height: 100 }}
                                    src={window.location.origin + workCardImageModel.previewImage}
                                />
                            ) : (
                                '暂无'
                            )}
                        </Item>

                        <Item>
                            <Button
                                style={{ marginLeft: '250px' }}
                                type="primary"
                                htmlType="submit"
                            >
                                保存
                            </Button>
                        </Item>
                    </Form>
                </Drawer>
                <AddExternalStaff
                    {...this.state}
                    hideModal={this.hideModal}
                    getTeacherList={this.getTableData}
                    getTreeOrg={this.getTreeOrg.bind(this)}
                    identity={'employee'}
                />
                <Modal
                    title={trans('', '从Excel导入外聘教师')}
                    visible={this.state.externalTeacherVisibleFromExcel}
                    onCancel={this.externalTeacherExcelModalClose}
                    onOk={debounce(this.externalTeacherSureImport)}
                >
                    <div className={styles.labelStyle} style={{ marginBottom: '10px' }}>
                        <span>所属组织：</span>
                        <TreeSelect {...treeProps} className={styles.selectAddStaff} />
                    </div>
                    <Spin
                        spinning={isUploading}
                        tip={trans('global.file uploading', '文件正在上传中')}
                    >
                        <div className={styles.upLoad}>
                            <span className={styles.text} style={{ verticalAlign: 'top' }}>
                                {trans('student.uploadFile', '上传文件')}
                            </span>
                            <span className={styles.desc}>
                                <span className={styles.fileBtn}>
                                    <Form
                                        style={{ display: 'inline-block', marginLeft: '15px' }}
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
                            <span style={{ display: 'block', marginTop: '6px' }}>
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
                                    // externalTeacherVisibleFromExcel: false,
                                });
                            }}
                        >
                            {trans('global.importGotIt', '我知道了')}
                        </Button>,
                    ]}
                >
                    <p>失败原因如下</p>
                    <Table
                        dataSource={checkErrorMessageList}
                        columns={columns}
                        rowKey="lineNumber"
                        pagination={false}
                    />
                </Modal>

                <Drawer
                    visible={invitedVisible}
                    title="邀请外聘教师加入"
                    onClose={() => this.setState({ invitedVisible: false })}
                    className={styles.inviteTeacher}
                    width={675}
                >
                    <div className={styles.contentStyle}>
                        <div className={styles.firstStep}>
                            第一步：邀请外聘教师扫码或者访问链接填写
                        </div>
                        <div className={styles.firstDetail}>
                            <div className={styles.leftCon}>
                                <div className={styles.title}>方式1：分享二维码进行邀请</div>
                                <QRCode
                                    value={
                                        window.location.origin +
                                        '/externalSubmitPage#/employee/application/false/' +
                                        `${currentUser.schoolId}/${currentUser.eduGroupcompanyId}`
                                    } //value参数为生成二维码的链接
                                    size={195} //二维码的宽高尺寸
                                    fgColor="#000000" //二维码的颜色
                                />
                                <div className={styles.detail}>扫码填写外聘入职申请</div>
                            </div>
                            <div className={styles.rightCon}>
                                <div className={styles.title}>方式2：发送链接进行邀请</div>
                                <div className={styles.detail}>
                                    访问以下链接填写外聘入职申请{' '}
                                    <span style={{ color: 'rgba(16, 141, 230, 0.85)' }} id="myText">
                                        {window.location.origin +
                                            '/externalSubmitPage#/employee/application/false/' +
                                            `${currentUser.schoolId}/${currentUser.eduGroupcompanyId}`}
                                    </span>
                                </div>
                                <span className={styles.operate} onClick={this.copyContent}>
                                    复制邀请链接
                                </span>
                            </div>
                        </div>
                        <div className={styles.sedStep}>
                            第二步：进行信息审核，审核通过后自动开通
                        </div>
                    </div>
                </Drawer>
            </div>
        );
    }
}
