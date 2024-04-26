//学生管理--新建组织
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './commonModal.less';
import {
    Modal,
    Form,
    message,
    Input,
    Row,
    Col,
    TreeSelect,
    Radio,
    Checkbox,
    Select,
    InputNumber,
} from 'antd';
import icon from '../../../../icon.less';
import { trans, locale } from '../../../../utils/i18n';

const { TreeNode } = TreeSelect;
const { confirm } = Modal;
let yearEnumerationList = [];
let currentYear = new Date().getFullYear();
yearEnumerationList = [
    currentYear - 12,
    currentYear - 11,
    currentYear - 10,
    currentYear - 9,
    currentYear - 8,
    currentYear - 7,
    currentYear - 6,
    currentYear - 5,
    currentYear - 4,
    currentYear - 3,
    currentYear - 2,
    currentYear - 1,
    currentYear,
    currentYear + 1,
    currentYear + 2,
    currentYear + 3,
    currentYear + 4,
    currentYear + 5,
    currentYear + 6,
    currentYear + 7,
    currentYear + 8,
    currentYear + 9,
    currentYear + 10,
    currentYear + 11,
    currentYear + 12,
];

let graduationYearList = [];
graduationYearList = [
    currentYear - 12,
    currentYear - 11,
    currentYear - 10,
    currentYear - 9,
    currentYear - 8,
    currentYear - 7,
    currentYear - 6,
    currentYear - 5,
    currentYear - 4,
    currentYear - 3,
    currentYear - 2,
    currentYear - 1,
    currentYear,
    currentYear + 1,
    currentYear + 2,
    currentYear + 3,
    currentYear + 4,
    currentYear + 5,
    currentYear + 6,
    currentYear + 7,
    currentYear + 8,
    currentYear + 9,
    currentYear + 10,
    currentYear + 11,
    currentYear + 12,
];

@Form.create()
@connect((state) => ({
    orgCompletePath: state.teacher.orgCompletePath,
    fetchOrgByEditDetail: state.teacher.fetchOrgByEditDetail, //编辑组织获取详情
    fetchApplyGradeData: state.student.fetchApplyGradeData, //查询适用年级列表
    fetchOrgParentName: state.teacher.fetchOrgParentName, //新建组织或编辑组织获取年级名称
    currentUser: state.global.currentUser,
}))
export default class CreateStudentOrg extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            orgType: '',
            isChangeTree: false, //判断是否操作了树结构
            selectParentId: '', //上级组织重新选择的父级节点id
            isGrade: false,
            selectGradeId: '', //选择年级Id
            classNum: 1, // 行政班数量
            suitPlace: '',
            admissonStatus: '',
            graduationYear: '',
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.createOrgVisible != this.props.createOrgVisible) {
            if (nextProps.createOrgVisible) {
                const { fetchOrgByEditDetail, tagCode, treeId } = this.props;
                this.getPathByTreeId(nextProps.treeId);
                this.lookApplyGrade();
                let tempValue = undefined;
                let editDetail = fetchOrgByEditDetail || {};
                console.log(fetchOrgByEditDetail, 'fetchOrgByEditDetail');
                if (nextProps.createOrgType == 'edit') {
                    //查询组织信息的详细信息
                    this.fetchOrgDetail();
                    tempValue = editDetail.tag;
                } else {
                    tempValue = tagCode == 'GRADE' ? 'ADMINISTRATIVE_CLASS' : 'GRADE';
                    if (tagCode == 'GRADE') {
                        this.getParentName(treeId); // 新建时获取节点中英文名
                    }
                }
                this.setState({
                    orgType: tempValue,
                    // admissonStatus: editDetail.enrollmentYear,
                    // graduationYear: editDetail.graduationYear,
                });
            }
        }
    }

    //根据树节点id获取路径
    getPathByTreeId(id) {
        const { dispatch } = this.props;
        dispatch({
            type: 'teacher/getPathByTreeId',
            payload: {
                nodeId: id,
                schoolYearId: this.props.selectSchooYearlId,
            },
            onSuccess: () => {},
        });
    }

    //根据树节点id获取所属年级的名称和英文名称
    getParentName(id) {
        const { dispatch } = this.props;
        dispatch({
            type: 'teacher/fetchParentName',
            payload: {
                treeNodeId: id,
                schoolYearId: this.props.selectSchooYearlId,
            },
        });
    }

    handleCancel = () => {
        const { hideModal, form } = this.props;
        typeof hideModal == 'function' && hideModal.call(this, 'createOrg');
        form.resetFields();
        this.setState({
            orgType: '',
            isChangeTree: false,
            selectParentId: '',
            suitPlace: '',
            admissonStatus: '',
            graduationYear: '',
        });
    };

    handleOk = (e) => {
        e.preventDefault();
        const { selectGradeId, classNum, suitPlace } = this.state;
        const {
            form,
            dispatch,
            createOrgType,
            fetchOrgParentName,
            fetchOrgByEditDetail,
            selectSchooYearlId,
            fetchApplyGradeData,
            selectSchoolId,
        } = this.props;
        let name = '';
        let englishName = '';

        fetchApplyGradeData &&
            fetchApplyGradeData.length > 0 &&
            fetchApplyGradeData.map((item) => {
                if (item.id == selectGradeId) {
                    name = item.name;
                    englishName = item.englishName;
                }
            });
        form.validateFields((err, values) => {
            if (!selectGradeId && createOrgType == 'create' && values.tag == 'GRADE') {
                message.warning('请选择年级');
                return;
            }
            console.log(err, 'err');
            if (!err) {
                if (createOrgType == 'create') {
                    //新增组织
                    let payloadObj;
                    if (values.tag != 'ADMINISTRATIVE_CLASS') {
                        //非行政班
                        payloadObj = {
                            appearAdminTree: 1, //是否显示（学院默认显示，分层、club默认不显示）
                            applyGradeIds: values.grades, //适用年级
                            classStatus: 2, //非行政班只有在读和结班状态，新建只有在读
                            belongGradeId: fetchOrgParentName && fetchOrgParentName.id, //所属年级（选填）
                        };
                    } else {
                        //行政班
                        payloadObj = {
                            appearAdminTree: 1, //是否可见
                            belongGradeId: fetchOrgParentName && fetchOrgParentName.id, //所属年级
                            classStatus: values.classStatus, //班级状态
                        };
                    }

                    dispatch({
                        type: 'teacher/createOrg',
                        payload: {
                            name: values.name ? values.name : name, //中文名称
                            englishName: values.englishName ? values.englishName : englishName, //英文名称
                            orgType: 2, //组织类型
                            parentId: values.parentId, //父级节点id
                            tag: values.tag, //界面中的类型,
                            gradeTagMappingId: selectGradeId,
                            adminClassNum: classNum,
                            enrollmentYear: this.state.admissonStatus,
                            graduationYear: this.state.graduationYear,
                            schoolYearId: selectSchooYearlId,
                            addressId: suitPlace,
                            ...payloadObj,
                        },
                        onSuccess: () => {
                            this.setState({
                                classNum: 1,
                                selectGradeId: '',
                                addressId: '',
                                admissonStatus: '',
                                graduationYear: '',
                            });
                            form.resetFields();
                            this.handleCancel();
                            //更新树结构
                            setTimeout(() => {
                                const { getTreeOrg, clearData } = this.props;
                                typeof getTreeOrg == 'function' && getTreeOrg.call(this);
                            }, 1000);
                        },
                    });
                } else if (createOrgType == 'edit') {
                    //编辑组织
                    let payloadObj;
                    if (values.tag != 'ADMINISTRATIVE_CLASS') {
                        //非行政班
                        payloadObj = {
                            appearAdminTree: 1, //是否显示（学院默认显示，分层、club默认不显示）
                            applyGradeIds: values.grades, //适用年级
                            classStatus: 2, //班级状态
                            belongGradeId: fetchOrgParentName && fetchOrgParentName.id, //所属年级（选填）
                        };
                    } else {
                        //行政班
                        payloadObj = {
                            appearAdminTree: 1, //是否可见
                            belongGradeId: fetchOrgParentName && fetchOrgParentName.id, //所属年级
                            classStatus: values.classStatus, //班级状态
                        };
                    }
                    dispatch({
                        type: 'teacher/updateOrg',
                        payload: {
                            id: this.props.treeId,
                            name: values.name,
                            englishName: values.englishName,
                            orgType: 2,
                            parentId:
                                values.parentId == this.props.treeId
                                    ? fetchOrgByEditDetail && fetchOrgByEditDetail.parentId
                                    : values.parentId, //父级节点id
                            tag: fetchOrgByEditDetail.tag,
                            schoolYearId: selectSchooYearlId,
                            addressId: suitPlace ? suitPlace : fetchOrgByEditDetail.addressId,
                            enrollmentYear: this.state.admissonStatus,
                            graduationYear: this.state.graduationYear,
                            ...payloadObj,
                        },
                        onSuccess: () => {
                            form.resetFields();
                            this.handleCancel();
                            this.setState({
                                admissonStatus: '',
                                graduationYear: '',
                            });
                            //更新树结构
                            const { getTreeOrg, fetchTreeNodeDetail } = this.props;
                            typeof getTreeOrg == 'function' && getTreeOrg.call(this);
                            typeof fetchTreeNodeDetail == 'function' &&
                                fetchTreeNodeDetail.call(this);
                        },
                    });
                }
            }
        });
    };

    //选择组织类型
    changeOrgType = (e) => {
        this.setState(
            {
                orgType: e.target.value,
            },
            () => {
                //新建组织，查询当前组织节点所属年级
                if (this.state.orgType == 'ADMINISTRATIVE_CLASS') {
                    if (!this.state.selectParentId) {
                        //用户未修改上级节点
                        this.getParentName(this.props.treeId);
                    } else {
                        //用户修改了上级组织节点
                        this.getParentName(this.state.selectParentId);
                    }
                }
                if (this.state.orgType == 'GRADE') {
                    this.setState({
                        isGrade: true,
                    });
                }
            }
        );
    };

    //选择树节点获取完整路径
    changeTreeId = (value) => {
        this.getPathByTreeId(value);
        if (this.state.orgType == 'ADMINISTRATIVE_CLASS') {
            this.getParentName(value);
        }
        this.setState({
            isChangeTree: true,
            selectParentId: value,
        });
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
                //item.children = this.formatTreeData(item.treeNodeList)
            });
        return resultArr;
    }

    //编辑--根据树节点id查询编辑的详情
    fetchOrgDetail = () => {
        console.log(this.state.selectSchooYearlId, 'his.state.selectSchooYearlId...');
        const { dispatch } = this.props;
        dispatch({
            type: 'teacher/fetchOrgDetailByEdit',
            payload: {
                treeNodeId: this.props.treeId,
                schoolYearId: this.props.selectSchooYearlId,
            },
            onSuccess: () => {
                const { fetchOrgByEditDetail } = this.props;
                this.setState(
                    {
                        orgType: fetchOrgByEditDetail && fetchOrgByEditDetail.tag,
                        admissonStatus: fetchOrgByEditDetail && fetchOrgByEditDetail.enrollmentYear,
                        graduationYear: fetchOrgByEditDetail && fetchOrgByEditDetail.graduationYear,
                    },
                    () => {
                        if (this.state.orgType == 'ADMINISTRATIVE_CLASS') {
                            this.getParentName(
                                fetchOrgByEditDetail && fetchOrgByEditDetail.parentId
                            );
                        }
                    }
                );
            },
        });
    };

    //确认删除
    confirmDelete = () => {
        let self = this;
        confirm({
            title: trans('student.isDeleteOrg', '是否确定删除组织？'),
            onOk() {
                self.handleDelete();
            },
            onCancel() {},
            okText: trans('global.confirm', '确定'),
            cancelText: trans('global.cancel', '取消'),
        });
    };

    handleDelete = () => {
        const { dispatch, treeId } = this.props;
        dispatch({
            type: 'teacher/deleteOrg',
            payload: {
                treeNodeId: treeId,
            },
            onSuccess: () => {
                this.handleCancel();
                //更新树结构
                const { getTreeOrg, clearData } = this.props;
                typeof getTreeOrg == 'function' && getTreeOrg.call(this);
                typeof clearData == 'function' && clearData.call(this);
            },
        });
    };

    //查询适用年级
    lookApplyGrade() {
        const { dispatch, selectSchoolId } = this.props;
        dispatch({
            type: 'student/lookApplyGrade',
            payload: {
                teachingOrgType: 1,
                schoolId: selectSchoolId,
            },
        });
    }

    //处理上级组织路径
    handleOrgPath(orgPath) {
        if (!orgPath) return '';
        let splitArr = orgPath.split('/');
        splitArr.splice(splitArr.length - 1, 1);
        return splitArr.join('/');
    }

    //格式化路径：PMP4856 截取规则：从末尾节点开始截取，前面被截取掉的显示“...”，举例：“...中小学部/初中段/2019级/”
    formatPath(orgPath) {
        if (!orgPath || orgPath.length < 25) return orgPath;
        let pathArr = orgPath.split('/');
        let len = pathArr.length;
        let pathStr = '.../' + pathArr[len - 2] + '/' + pathArr[len - 1];
        return pathStr;
    }
    // 选择年级
    changeGradeId = (value) => {
        this.setState({
            selectGradeId: value,
        });
    };

    changeAdmission = (value) => {
        this.setState({
            admissonStatus: value,
        });
    };

    changeGraduation = (value) => {
        this.setState({
            graduationYear: value,
        });
    };

    // 改变行政班数量
    changeClassNum = (value) => {
        this.setState({
            classNum: value,
        });
    };

    //
    choosePlace = (value) => {
        this.setState({
            suitPlace: value,
        });
    };

    render() {
        const {
            createOrgVisible,
            createOrgType,
            form: { getFieldDecorator },
            orgCompletePath,
            dataSource,
            treeId,
            fetchApplyGradeData,
            fetchOrgByEditDetail, //编辑获取的详情
            fetchOrgParentName, //编辑获取父节点名称
            tagCode, //组织树节点的类型
            currentUser,
        } = this.props;
        const { orgType, isChangeTree, admissonStatus, graduationYear } = this.state;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 19 },
            },
        };
        const treeProps = {
            showSearch: true,
            treeData: this.formatTreeData(dataSource),
            style: { width: 0 },
            dropdownStyle: { maxHeight: 400, overflow: 'auto' },
            placeholder: '',
            treeNodeFilterProp: 'title',
            treeDefaultExpandAll: true,
            className: styles.selectOrgStyle,
            onChange: this.changeTreeId,
        };
        let editDetail = fetchOrgByEditDetail || {};
        //编辑的路径
        let editOrgPath = isChangeTree ? orgCompletePath : this.handleOrgPath(orgCompletePath);
        //是否显示行政班级
        let isShowClass = createOrgType == 'edit' || tagCode == 'GRADE' ? true : false;
        return (
            <Modal
                visible={createOrgVisible}
                title={
                    createOrgType == 'create'
                        ? currentUser.schoolId == 1
                            ? '新建年级/学院'
                            : orgType == 'GRADE'
                            ? '新建年级'
                            : '新建班级'
                        : currentUser.schoolId == 1
                        ? orgType == 'COLLEGE'
                            ? '编辑学院'
                            : orgType == 'GRADE'
                            ? '编辑年级'
                            : '编辑班级'
                        : orgType == 'GRADE'
                        ? '编辑年级'
                        : '编辑班级'
                }
                footer={null}
                width="650px"
                onCancel={this.handleCancel}
            >
                <Form {...formItemLayout}>
                    <Form.Item label={trans('student.higerNode', '上级节点')}>
                        <Row gutter={4}>
                            <Col span={20}>
                                {getFieldDecorator('orgPath', {
                                    rules: [
                                        {
                                            required: true,
                                            message: trans(
                                                'student.pleaseChooseHigherNode',
                                                '请选择上级节点'
                                            ),
                                        },
                                    ],
                                    initialValue:
                                        createOrgType == 'edit'
                                            ? this.formatPath(editOrgPath)
                                            : this.formatPath(orgCompletePath),
                                })(<Input type="text" readOnly className={styles.inputStyle} />)}
                            </Col>
                            {createOrgType == 'edit' && orgType != 'ADMINISTRATIVE_CLASS' ? (
                                <Col span={4}>
                                    <Form.Item>
                                        {getFieldDecorator('parentId', {
                                            initialValue: treeId,
                                        })(<TreeSelect {...treeProps} />)}
                                    </Form.Item>
                                </Col>
                            ) : (
                                <Col span={4}>
                                    <Form.Item>
                                        {getFieldDecorator('parentId', {
                                            initialValue: treeId,
                                        })(<div></div>)}
                                    </Form.Item>
                                </Col>
                            )}
                        </Row>
                    </Form.Item>
                    {createOrgType != 'edit' ? (
                        <Form.Item label={trans('student.type', '类型')}>
                            {getFieldDecorator('tag', {
                                rules: [
                                    {
                                        required: true,
                                        message: trans('student.pleaseChooseType', '请选择类型'),
                                    },
                                ],
                                initialValue: tagCode == 'GRADE' ? 'ADMINISTRATIVE_CLASS' : 'GRADE',
                            })(
                                <Radio.Group
                                    value={this.state.orgType}
                                    onChange={this.changeOrgType}
                                    disabled={createOrgType == 'edit' ? true : false}
                                >
                                    {tagCode != 'GRADE' && (
                                        <Radio value="GRADE">
                                            {trans('student.grade', '年级')}
                                        </Radio>
                                    )}
                                    {isShowClass && (
                                        <Radio value="ADMINISTRATIVE_CLASS">
                                            {trans('student.adminstrativeClass', '行政班')}
                                        </Radio>
                                    )}
                                    {orgType == 'GRADE'
                                        ? currentUser.schoolId == 1 && (
                                              <Radio value="COLLEGE">
                                                  {trans('student.college', '学院')}
                                              </Radio>
                                          )
                                        : null}
                                </Radio.Group>
                            )}
                        </Form.Item>
                    ) : null}

                    {orgType == 'GRADE' && (
                        <Form.Item
                            label={
                                <span>
                                    {' '}
                                    {createOrgType == 'create' && (
                                        <span style={{ color: 'red' }}>* &nbsp;</span>
                                    )}
                                    {trans('student.grade', '年级')}
                                </span>
                            }
                        >
                            {createOrgType == 'edit' ? (
                                getFieldDecorator('gradeId', {
                                    rules: [
                                        {
                                            required: true,
                                            message: trans('student.pleaseChoose', '请选择'),
                                        },
                                    ],
                                    initialValue:
                                        createOrgType == 'edit' && editDetail.gradeTagMappingId,
                                })(
                                    <Select
                                        className={styles.selectGrade}
                                        disabled={createOrgType == 'edit' ? true : false}
                                        onChange={this.changeGradeId}
                                        placeholder="请选择"
                                    >
                                        {fetchApplyGradeData &&
                                            fetchApplyGradeData.length > 0 &&
                                            fetchApplyGradeData.map((item, index) => {
                                                return (
                                                    <Option value={item.id} key={item.id}>
                                                        {locale() != 'en'
                                                            ? item.name
                                                            : item.englishName}
                                                    </Option>
                                                );
                                            })}
                                    </Select>
                                )
                            ) : (
                                <Select
                                    className={styles.selectGrade}
                                    disabled={createOrgType == 'edit' ? true : false}
                                    onChange={this.changeGradeId}
                                    placeholder="请选择"
                                >
                                    {fetchApplyGradeData &&
                                        fetchApplyGradeData.length > 0 &&
                                        fetchApplyGradeData.map((item, index) => {
                                            return (
                                                <Option value={item.id} key={item.id}>
                                                    {locale() != 'en'
                                                        ? item.name
                                                        : item.englishName}
                                                </Option>
                                            );
                                        })}
                                </Select>
                            )}
                        </Form.Item>
                    )}

                    {orgType == 'GRADE' && createOrgType != 'edit' && (
                        <Form.Item
                            label={
                                <span className={styles.labelSpan}>
                                    {trans('student.classNum', '行政班数量')}
                                </span>
                            }
                        >
                            <InputNumber
                                style={{ borderRadius: '8px', height: '36px', lineHeight: '34px' }}
                                min={1}
                                max={50}
                                defaultValue={1}
                                step={1}
                                onChange={this.changeClassNum}
                            ></InputNumber>
                        </Form.Item>
                    )}

                    {orgType == 'GRADE' && (
                        <Form.Item label={<span className={styles.labelSpan}>入学级</span>}>
                            <Select
                                showSearch
                                optionFilterProp="children"
                                className={styles.selectGrade}
                                onChange={this.changeAdmission}
                                placeholder="请选择"
                                value={admissonStatus}
                            >
                                {yearEnumerationList.map((Item) => {
                                    return (
                                        <Select.Option key={Item} value={Item}>
                                            {Item}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                    )}

                    {orgType == 'GRADE' && (
                        <Form.Item label={<span className={styles.labelSpan}>毕业届</span>}>
                            <Select
                                showSearch
                                optionFilterProp="children"
                                className={styles.selectGrade}
                                onChange={this.changeGraduation}
                                placeholder="请选择"
                                value={graduationYear}
                            >
                                {graduationYearList.map((Item) => {
                                    return (
                                        <Select.Option key={Item} value={Item}>
                                            {Item}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                    )}

                    {orgType && orgType != 'CLASSIFY_NODE' && orgType !== 'GRADE' && (
                        <Form.Item
                            label={
                                <span className={styles.labelSpan}>
                                    {trans('student.calling', '名称')}
                                </span>
                            }
                        >
                            <Row gutter={4}>
                                {orgType == 'ADMINISTRATIVE_CLASS' && (
                                    <Col span={6}>
                                        {getFieldDecorator('belongGradeName', {
                                            initialValue:
                                                fetchOrgParentName && fetchOrgParentName.name,
                                        })(
                                            <Input
                                                readOnly
                                                value={
                                                    fetchOrgParentName && fetchOrgParentName.name
                                                }
                                                className={styles.inputNameStyle}
                                            />
                                        )}
                                    </Col>
                                )}
                                <Col span={16}>
                                    <Form.Item>
                                        {getFieldDecorator('name', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: trans(
                                                        'student.pleaseInputName',
                                                        '请输入中文名称'
                                                    ),
                                                },
                                            ],
                                            initialValue:
                                                createOrgType == 'edit' ? editDetail.name : '',
                                        })(
                                            <Input
                                                placeholder={trans(
                                                    'student.pleaseInputName',
                                                    '请输入中文名称'
                                                )}
                                                className={styles.inputStyle}
                                            />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form.Item>
                    )}
                    {orgType && orgType != 'CLASSIFY_NODE' && orgType !== 'GRADE' && (
                        <Form.Item
                            label={
                                <span className={styles.labelSpan}>
                                    {trans('student.englishCalling', '英文名称')}
                                </span>
                            }
                        >
                            <Row gutter={4}>
                                {orgType == 'ADMINISTRATIVE_CLASS' && (
                                    <Col span={6}>
                                        {getFieldDecorator('belongGradeEname', {
                                            initialValue:
                                                fetchOrgParentName &&
                                                fetchOrgParentName.englishName,
                                        })(
                                            <Input
                                                readOnly
                                                value={
                                                    fetchOrgParentName &&
                                                    fetchOrgParentName.englishName
                                                }
                                                className={styles.inputNameStyle}
                                            />
                                        )}
                                    </Col>
                                )}
                                <Col span={16}>
                                    <Form.Item>
                                        {getFieldDecorator('englishName', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: trans(
                                                        'student.pleaseInputEnglishName',
                                                        '请输入英文名称'
                                                    ),
                                                },
                                            ],
                                            initialValue:
                                                createOrgType == 'edit'
                                                    ? editDetail.englishName
                                                    : '',
                                        })(
                                            <Input
                                                placeholder={trans(
                                                    'student.pleaseInputEnglishName',
                                                    '请输入英文名称'
                                                )}
                                                className={styles.inputStyle}
                                            />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form.Item>
                    )}

                    {orgType &&
                        orgType != 'ADMINISTRATIVE_CLASS' &&
                        orgType != 'CLASSIFY_NODE' &&
                        orgType !== 'GRADE' && (
                            <Form.Item label={trans('student.applyGrade', '适用年级')}>
                                {getFieldDecorator('grades', {
                                    rules: [
                                        {
                                            required: true,
                                            message: trans(
                                                'student.pleaseApplyGrade',
                                                '请选择适用年级'
                                            ),
                                        },
                                    ],
                                    initialValue:
                                        createOrgType == 'edit' ? editDetail.applyGradeIds : [],
                                })(
                                    <Checkbox.Group>
                                        {fetchApplyGradeData &&
                                            fetchApplyGradeData.length > 0 &&
                                            fetchApplyGradeData.map((item) => {
                                                return (
                                                    <div
                                                        className={styles.checkboxStyle}
                                                        key={item.id}
                                                    >
                                                        <Checkbox value={item.id} key={item.id}>
                                                            {item.name}-{item.englishName}
                                                        </Checkbox>
                                                    </div>
                                                );
                                            })}
                                    </Checkbox.Group>
                                )}
                            </Form.Item>
                        )}

                    {orgType && orgType != 'ADMINISTRATIVE_CLASS' && orgType !== 'GRADE' && (
                        <Form.Item label="Tips">
                            <p className={styles.isShowOrgTips}>
                                {trans(
                                    'student.createOrgTips',
                                    '若设置为不显示在行政组织树上，该组织及以下节点都不显示在默认学生组织树上，当切换到查看全部组织时，全部组织树上会显示。'
                                )}
                            </p>
                        </Form.Item>
                    )}

                    <div className={styles.operationList}>
                        {createOrgType == 'edit' && (
                            <a className={styles.deleteBtn} onClick={this.confirmDelete}>
                                <i className={icon.iconfont}>&#xe739;</i>
                                <span>
                                    {orgType == 'COLLEGE'
                                        ? '删除学院'
                                        : orgType == 'GRADE'
                                        ? '删除年级'
                                        : '删除班级'}
                                </span>
                            </a>
                        )}
                        <a>
                            <span
                                className={styles.modalBtn + ' ' + styles.cancelBtn}
                                onClick={this.handleCancel}
                            >
                                {trans('global.cancel', '取消')}
                            </span>
                            <span
                                className={styles.modalBtn + ' ' + styles.submitBtn}
                                onClick={this.handleOk}
                            >
                                {trans('global.finish', '完成')}
                            </span>
                        </a>
                    </div>
                </Form>
            </Modal>
        );
    }
}
