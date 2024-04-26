//机构管理--新建组织
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './commonModal.less';
import { Modal, Form, message, Input, Row, Col, TreeSelect, Radio, Checkbox, Select } from 'antd';
import icon from '../../../../icon.less';
import { trans, locale } from '../../../../utils/i18n';

const { Option } = Select;
const { confirm } = Modal;

@Form.create()
@connect((state) => ({
    orgCompletePath: state.teacher.orgCompletePath,
    fetchOrgByEditDetail: state.teacher.fetchOrgByEditDetail, //编辑组织获取详情
    fetchApplyGradeData: state.student.fetchApplyGradeData, //查询适用年级列表
    fetchOrgParentName: state.teacher.fetchOrgParentName, //新建组织或编辑组织获取年级名称
}))
export default class CreateOrganizeOrg extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            orgType: '',
            isChangeTree: false, //判断是否操作了树结构
            selectParentId: '', //选择上级组织节点id
            typeGroup: [
                {
                    value: 'CAMPUS',
                    name: trans('course.plan.school.title', '校区'),
                },
                {
                    value: 'CAMPUS_DEPARTMENT',
                    name: trans('role.campusDepartment', '学部'),
                },
                {
                    value: 'BRANCH_SCHOOL',
                    name: trans('role.Branch/branch', '分校/分园'),
                },
                {
                    value: 'STUDY_STAGE',
                    name: trans('charge.section', '学段'),
                },
                {
                    value: 'DEPARTMENT',
                    name: trans('teacher.department', '部门'),
                },
                {
                    value: 'TEACHING_RESEARCH_GROUP',
                    name: trans('teacher.teachingResearchGroup', '教研组'),
                },
            ], // 类型
        };
    }

    componentWillReceiveProps(nextProps) {
        const { dataSource } = nextProps;
        if (nextProps.createOrgVisible != this.props.createOrgVisible) {
            if (nextProps.createOrgVisible) {
                this.findNode(nextProps.treeId, dataSource);
                this.getPathByTreeId(nextProps.treeId);
                // this.lookApplyGrade();
                if (nextProps.createOrgType == 'edit') {
                    //查询组织信息的详细信息
                    this.fetchOrgDetail();
                    this.lookApplyGrade();
                }
            }
        }
    }

    //查询适用年级
    lookApplyGrade() {
        const { dispatch } = this.props;
        dispatch({
            type: 'student/lookApplyGrade',
            payload: {
                teachingOrgType: 1,
            },
            onSuccess: () => {},
        });
    }

    //年级类型--查询年级列表
    getGradeList() {
        const { dispatch } = this.props;
        dispatch({
            type: 'student/lookApplyGrade',
            payload: {},
            onSuccess: () => {},
        });
    }

    //根据树节点id获取路径
    getPathByTreeId(id) {
        const { dispatch } = this.props;
        dispatch({
            type: 'teacher/getPathByTreeId',
            payload: {
                nodeId: id,
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
            },
            onSuccess: () => {},
        });
    }

    //确认删除
    confirmDelete = () => {
        let self = this;
        confirm({
            title: '确定要删除这个组织吗？',
            onOk() {
                self.handleDelete();
            },
            onCancel() {},
            okText: '确定',
            cancelText: '取消',
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

    handleCancel = () => {
        const { hideModal, form } = this.props;
        typeof hideModal == 'function' && hideModal.call(this, 'createOrg');
        form.resetFields();
        this.setState({
            orgType: '',
            isChangeTree: false,
            selectParentId: '',
        });
    };

    handleOk = (e) => {
        e.preventDefault();
        const { form, dispatch, createOrgType, fetchOrgParentName, fetchOrgByEditDetail } =
            this.props;
        form.validateFields((err, values) => {
            if (!err) {
                if (createOrgType == 'create') {
                    //新增组织
                    let payloadObj;
                    if (values.tag == 'ADMINISTRATIVE_CLASS') {
                        //行政班
                        payloadObj = {
                            name: values.name, //中文名称
                            englishName: values.englishName, //英文名称
                            orgType: 2, //1:组织 2：班级
                            parentId: values.parentId, //父级节点id
                            tag: values.tag, //类型
                            appearAdminTree: 1, //是否可见
                            belongGradeId: fetchOrgParentName && fetchOrgParentName.id, //所属年级
                            classStatus: null, //班级状态，v1.0传null
                        };
                    } else if (
                        values.tag == 'COLLEGE' ||
                        values.tag == 'LAYERED_CLASS' ||
                        values.tag == 'CLUB_CLASS' ||
                        values.tag == 'CLASSIFY_NODE'
                    ) {
                        //学院、分层班、club、分类节点
                        payloadObj = {
                            name: values.name, //中文名称
                            englishName: values.englishName, //英文名称
                            orgType: 2, //1:组织 2：班级
                            parentId: values.parentId, //父级节点id
                            tag: values.tag, //类型
                            appearAdminTree: values.isShowOrg, //是否显示（学院默认显示，分层、club默认不显示）
                            applyGradeIds: values.grades, //适用年级
                            classStatus: null, //班级状态，v1.0传null
                            belongGradeId: fetchOrgParentName && fetchOrgParentName.id, //所属年级（选填）
                        };
                    } else if (values.tag == 'GRADE') {
                        //年级
                        payloadObj = {
                            name: values.name, //中文名称
                            englishName: values.englishName, //英文名称
                            orgType: 1, //1:组织 2：班级
                            parentId: values.parentId,
                            tag: values.tag,
                            gradeTagMappingId: values.selectGrades, //对应年级的查询结果id
                            enrollmentYear: fetchOrgByEditDetail?.enrollmentYear,
                            graduationYear: fetchOrgByEditDetail?.graduationYear,
                        };
                    } else {
                        //组织
                        payloadObj = {
                            name: values.name, //中文名称
                            englishName: values.englishName, //英文名称
                            orgType: 1, //1:组织 2：班级
                            parentId: values.parentId,
                            tag: values.tag,
                            apearAdminTree: 1,
                        };
                    }
                    dispatch({
                        type: 'teacher/createOrg',
                        payload: payloadObj,
                        onSuccess: () => {
                            form.resetFields();
                            this.handleCancel();
                            //更新树结构
                            const { getTreeOrg, clearData } = this.props;
                            typeof getTreeOrg == 'function' && getTreeOrg.call(this);
                            //typeof clearData == "function" && clearData.call(this);
                        },
                    });
                } else if (createOrgType == 'edit') {
                    let payloadObj;
                    if (values.tag == 'ADMINISTRATIVE_CLASS') {
                        //行政班
                        payloadObj = {
                            id: this.props.treeId,
                            name: values.name, //中文名称
                            englishName: values.englishName, //英文名称
                            orgType: 2, //1:组织 2：班级
                            parentId:
                                values.parentId == this.props.treeId
                                    ? fetchOrgByEditDetail.parentId
                                    : values.parentId, //父级节点id
                            tag: values.tag, //类型
                            appearAdminTree: 1, //是否可见
                            belongGradeId: fetchOrgParentName && fetchOrgParentName.id, //所属年级
                            classStatus:
                                (fetchOrgByEditDetail && fetchOrgByEditDetail.classStatus) || null, //班级状态，v1.0传null
                        };
                    } else if (
                        values.tag == 'COLLEGE' ||
                        values.tag == 'LAYERED_CLASS' ||
                        values.tag == 'CLUB_CLASS' ||
                        values.tag == 'CLASSIFY_NODE'
                    ) {
                        //学院、分层班、club、分类节点
                        payloadObj = {
                            id: this.props.treeId,
                            name: values.name, //中文名称
                            englishName: values.englishName, //英文名称
                            orgType: 2, //1:组织 2：班级
                            parentId:
                                values.parentId == this.props.treeId
                                    ? fetchOrgByEditDetail.parentId
                                    : values.parentId, //父级节点id
                            tag: values.tag, //类型
                            appearAdminTree: values.isShowOrg, //是否显示（学院默认显示，分层、club默认不显示）
                            applyGradeIds: values.grades, //适用年级
                            classStatus:
                                (fetchOrgByEditDetail && fetchOrgByEditDetail.classStatus) || null, //班级状态
                            belongGradeId: fetchOrgParentName && fetchOrgParentName.id, //所属年级（选填）
                        };
                    } else if (values.tag == 'GRADE') {
                        //年级
                        payloadObj = {
                            id: this.props.treeId,
                            name: values.name, //中文名称
                            englishName: values.englishName, //英文名称
                            orgType: 1, //1:组织 2：班级
                            parentId:
                                values.parentId == this.props.treeId
                                    ? fetchOrgByEditDetail.parentId
                                    : values.parentId,
                            tag: values.tag,
                            gradeTagMappingId: values.selectGrades, //对应年级的查询结果id
                            enrollmentYear: fetchOrgByEditDetail?.enrollmentYear,
                            graduationYear: fetchOrgByEditDetail?.graduationYear,
                        };
                    } else {
                        //组织
                        payloadObj = {
                            id: this.props.treeId,
                            name: values.name, //中文名称
                            englishName: values.englishName, //英文名称
                            orgType: 1, //1:组织 2：班级
                            parentId:
                                values.parentId == this.props.treeId
                                    ? fetchOrgByEditDetail.parentId
                                    : values.parentId,
                            tag: values.tag || 'AGENCY',
                            apearAdminTree: 1,
                        };
                    }
                    dispatch({
                        type: 'teacher/updateOrg',
                        payload: payloadObj,
                        onSuccess: () => {
                            form.resetFields();
                            this.handleCancel();
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
                //新建组织，年级类型下查询年级列表
                if (this.state.orgType == 'GRADE') {
                    // this.getGradeList();
                }
            }
        );
    };

    //选择树节点获取完整路径
    changeTreeId = (value) => {
        this.findNode(value, this.props.dataSource);
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
                    title: locale() !== 'en' ? item.name : item.englishName,
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
        const { dispatch } = this.props;
        dispatch({
            type: 'teacher/fetchOrgDetailByEdit',
            payload: {
                treeNodeId: this.props.treeId,
            },
            onSuccess: () => {
                const { fetchOrgByEditDetail } = this.props;
                this.setState(
                    {
                        orgType: fetchOrgByEditDetail && fetchOrgByEditDetail.tag,
                    },
                    () => {
                        //新建组织，查询当前组织节点所属年级
                        if (this.state.orgType == 'ADMINISTRATIVE_CLASS') {
                            this.getParentName(
                                fetchOrgByEditDetail && fetchOrgByEditDetail.parentId
                            );
                        }
                        //新建组织，年级类型下查询年级列表
                        if (this.state.orgType == 'GRADE') {
                            // this.getGradeList();
                        }
                    }
                );
            },
        });
    };

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

    findNode = (id, arr) => {
        let data = arr ? arr : [];
        if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].id == id) {
                    this.formatType(data[i].tagCode);
                    break;
                }
                if (data[i].treeNodeList && data[i].treeNodeList.length > 0) {
                    this.findNode(id, data[i].treeNodeList);
                }
            }
        }
    };

    formatType = (type) => {
        console.log(type, 'type');
        let data = [
            {
                value: 'CAMPUS',
                name: trans('course.plan.school.title', '校区'),
            },
            {
                value: 'CAMPUS_DEPARTMENT',
                name: trans('role.campusDepartment', '学部'),
            },
            {
                value: 'BRANCH_SCHOOL',
                name: trans('role.Branch/branch', '分校/分园'),
            },
            {
                value: 'STUDY_STAGE',
                name: trans('charge.section', '学段'),
            },
            {
                value: 'DEPARTMENT',
                name: trans('teacher.department', '部门'),
            },
            {
                value: 'TEACHING_RESEARCH_GROUP',
                name: trans('teacher.teachingResearchGroup', '教研组'),
            },
        ];
        switch (type) {
            case 'CAMPUS':
                this.setState({
                    typeGroup: [
                        {
                            value: 'CAMPUS_DEPARTMENT',
                            name: trans('role.campusDepartment', '学部'),
                        },
                        {
                            value: 'BRANCH_SCHOOL',
                            name: trans('role.Branch/branch', '分校/分园'),
                        },
                        {
                            value: 'STUDY_STAGE',
                            name: trans('charge.section', '学段'),
                        },
                        {
                            value: 'DEPARTMENT',
                            name: trans('teacher.department', '部门'),
                        },
                        {
                            value: 'TEACHING_RESEARCH_GROUP',
                            name: trans('teacher.teachingResearchGroup', '教研组'),
                        },
                    ],
                });
                break;
            case 'CAMPUS_DEPARTMENT':
                this.setState({
                    typeGroup: [
                        {
                            value: 'STUDY_STAGE',
                            name: trans('charge.section', '学段'),
                        },
                        {
                            value: 'DEPARTMENT',
                            name: trans('teacher.department', '部门'),
                        },
                        {
                            value: 'TEACHING_RESEARCH_GROUP',
                            name: trans('teacher.teachingResearchGroup', '教研组'),
                        },
                    ],
                });
                break;
            case 'STUDY_STAGE':
                this.setState({
                    typeGroup: [
                        {
                            value: 'DEPARTMENT',
                            name: trans('teacher.department', '部门'),
                        },
                        {
                            value: 'TEACHING_RESEARCH_GROUP',
                            name: trans('teacher.teachingResearchGroup', '教研组'),
                        },
                    ],
                });
                break;
            case 'DEPARTMENT':
                this.setState({
                    typeGroup: [
                        {
                            value: 'DEPARTMENT',
                            name: trans('teacher.department', '部门'),
                        },
                    ],
                });
                break;
            case 'GRADE':
                this.setState({
                    typeGroup: [
                        {
                            value: 'GRADE',
                            name: trans('global.grade', '年级'),
                        },
                    ],
                });
                break;

            default:
                this.setState({
                    typeGroup: data,
                });
                break;
        }
    };

    render() {
        const {
            createOrgVisible,
            createOrgType,
            form: { getFieldDecorator },
            orgCompletePath,
            dataSource,
            treeId,
            fetchApplyGradeData, //适用年级
            fetchOrgByEditDetail, //编辑获取的详情
            fetchOrgParentName,
            tagCode,
        } = this.props;
        console.log(fetchOrgByEditDetail, '1');
        const { orgType, isChangeTree, typeGroup } = this.state;
        console.log('typeGroup: ', typeGroup);
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
            className: styles.selectOrgStyle,
            onChange: this.changeTreeId,
        };
        //学院、分层走班、club、分类节点 是否显示适用年级
        let isShowAdminClass =
            orgType &&
            (orgType == 'COLLEGE' || orgType == 'LAYERED_CLASS' || orgType == 'CLUB_CLASS')
                ? true
                : false;
        //学院、分层班、club 显示是否显示在组织树上
        let isShowTreeOrg =
            orgType &&
            (orgType == 'COLLEGE' ||
                orgType == 'LAYERED_CLASS' ||
                orgType == 'CLUB_CLASS' ||
                orgType == 'CLASSIFY_NODE')
                ? true
                : false;
        //编辑的路径
        let editOrgPath = isChangeTree ? orgCompletePath : this.handleOrgPath(orgCompletePath);
        let editDetail = fetchOrgByEditDetail || {};
        return (
            <Modal
                visible={createOrgVisible}
                title={
                    createOrgType == 'create'
                        ? trans('student.createOrg', '新建组织')
                        : trans('student.editOrg', '编辑组织')
                }
                footer={null}
                width="650px"
                onCancel={this.handleCancel}
            >
                {createOrgType == 'create' ? null : (
                    <div className={styles.parntId}>ID:{fetchOrgByEditDetail.id}</div>
                )}
                <Form {...formItemLayout}>
                    {createOrgType === 'edit' && tagCode && tagCode === 'AGENCY' ? null : (
                        <div>
                            <Form.Item label={trans('student.higerLevel', '上级组织')}>
                                <Row gutter={4}>
                                    <Col span={20}>
                                        {getFieldDecorator('orgPath', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: trans(
                                                        'student.pleaseChooseHigherLevel',
                                                        '请选择上级组织'
                                                    ),
                                                },
                                            ],
                                            initialValue:
                                                createOrgType == 'edit'
                                                    ? this.formatPath(editOrgPath)
                                                    : this.formatPath(orgCompletePath),
                                        })(
                                            <Input
                                                type="text"
                                                readOnly
                                                className={styles.inputStyle}
                                            />
                                        )}
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item>
                                            {getFieldDecorator('parentId', {
                                                initialValue: treeId,
                                            })(<TreeSelect {...treeProps} />)}
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form.Item>
                            <Form.Item label={trans('student.type', '类型')}>
                                {getFieldDecorator('tag', {
                                    rules: [
                                        {
                                            required: true,
                                            message: trans(
                                                'student.pleaseChooseType',
                                                '请选择类型'
                                            ),
                                        },
                                    ],
                                    initialValue: createOrgType == 'edit' ? editDetail.tag : '',
                                })(
                                    <Radio.Group
                                        className={styles.radioStyle}
                                        onChange={this.changeOrgType}
                                        disabled={createOrgType == 'edit' ? true : false}
                                    >
                                        {typeGroup && typeGroup.length > 0
                                            ? typeGroup.map((item, index) => (
                                                  <Radio value={item.value} key={index}>
                                                      {item.name}
                                                  </Radio>
                                              ))
                                            : null}
                                    </Radio.Group>
                                )}
                            </Form.Item>
                        </div>
                    )}
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
                                        initialValue: fetchOrgParentName && fetchOrgParentName.name,
                                    })(<Input readOnly className={styles.inputNameStyle} />)}
                                </Col>
                            )}
                            <Col span={16}>
                                <Form.Item>
                                    {getFieldDecorator('name', {
                                        rules: [
                                            {
                                                required: true,
                                                message: trans('teacher.addName', '请添加名称'),
                                            },
                                        ],
                                        initialValue:
                                            createOrgType == 'edit' ? editDetail.name : '',
                                    })(
                                        <Input
                                            placeholder={trans(
                                                'teacher.inputNecessary',
                                                '请输入（必填）'
                                            )}
                                            className={styles.inputStyle}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item
                        //label="英文名称"
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
                                            fetchOrgParentName && fetchOrgParentName.englishName,
                                    })(<Input readOnly className={styles.inputNameStyle} />)}
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
                                            createOrgType == 'edit' ? editDetail.englishName : '',
                                    })(
                                        <Input
                                            placeholder={trans(
                                                'teacher.inputNecessary',
                                                '请输入（必填）'
                                            )}
                                            className={styles.inputStyle}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form.Item>
                    {orgType && orgType == 'GRADE' && (
                        <Form.Item label="年级">
                            {getFieldDecorator('selectGrades', {
                                initialValue:
                                    createOrgType == 'edit'
                                        ? editDetail.gradeTagMappingId
                                        : undefined,
                            })(
                                <Select
                                    showSearch
                                    placeholder="请选择年级"
                                    optionFilterProp="children"
                                    style={{ width: 316 }}
                                    className={styles.selectGradeStyle}
                                    disabled={createOrgType == 'edit' ? true : false}
                                >
                                    {fetchApplyGradeData &&
                                        fetchApplyGradeData.length > 0 &&
                                        fetchApplyGradeData.map((item) => {
                                            return (
                                                <Option value={item.id} key={item.id}>
                                                    {item.name}
                                                </Option>
                                            );
                                        })}
                                </Select>
                            )}
                        </Form.Item>
                    )}
                    {isShowAdminClass && (
                        <Form.Item label="适用年级">
                            {getFieldDecorator('grades', {
                                rules: [{ required: true, message: '请选择适用年级' }],
                                initialValue:
                                    createOrgType == 'edit' ? editDetail.applyGradeIds : [],
                            })(
                                <Checkbox.Group>
                                    {fetchApplyGradeData &&
                                        fetchApplyGradeData.length > 0 &&
                                        fetchApplyGradeData.map((item) => {
                                            return (
                                                <div className={styles.checkboxStyle} key={item.id}>
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
                    {isShowTreeOrg && (
                        <Form.Item
                            label={
                                <span className={styles.labelContentStyle}>
                                    是否显示在行政组织树上
                                </span>
                            }
                        >
                            {getFieldDecorator('isShowOrg', {
                                rules: [{ required: true, message: '请选择是否显示' }],
                                initialValue:
                                    createOrgType == 'edit'
                                        ? editDetail.appearAdminTree
                                        : orgType == 'COLLEGE'
                                        ? 1
                                        : 2,
                            })(
                                <Radio.Group>
                                    <Radio value={1}>是</Radio>
                                    <Radio value={2}>否</Radio>
                                </Radio.Group>
                            )}
                        </Form.Item>
                    )}
                    {isShowTreeOrg && (
                        <Form.Item label="Tips">
                            <p className={styles.isShowOrgTips}>
                                若设置为不显示在行政组织树上，该组织及以下节点都不显示在默认学生组织树上，当切换到查看全部组织时，全部组织树上会显示。
                            </p>
                        </Form.Item>
                    )}
                    <div className={styles.operationList}>
                        {createOrgType == 'edit' && (
                            <a className={styles.deleteBtn} onClick={this.confirmDelete}>
                                <i className={icon.iconfont}>&#xe739;</i>
                                <span>{trans('student.deleteOrg', '删除组织')}</span>
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
