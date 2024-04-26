//新建组织 && 编辑组织
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './commonModal.less';
import { Modal, Form, Select, message, Input, Radio, Row, Col, TreeSelect } from 'antd';
import icon from '../../../../icon.less';
import { trans } from '../../../../utils/i18n';

const { Option } = Select;
const { confirm } = Modal;
const { TreeNode } = TreeSelect;

@Form.create()
@connect((state) => ({
    orgCompletePath: state.teacher.orgCompletePath, //完整路径
    fetchOrgByEditDetail: state.teacher.fetchOrgByEditDetail, //编辑组织获取详情
}))
export default class CreateOrg extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isChangeTree: false, //判断是否操作了树结构
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.createOrgModal != this.props.createOrgModal) {
            if (nextProps.createOrgModal) {
                this.getPathByTreeId(nextProps.treeId);
                if (nextProps.createOrgType == 'edit') {
                    //查询组织信息的详细信息
                    this.fetchOrgDetail();
                }
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
            },
        });
    }

    handleCancel = () => {
        const { hideModal, form } = this.props;
        typeof hideModal == 'function' && hideModal.call(this, 'createOrg');
        form.resetFields();
        this.setState({
            isChangeTree: false,
        });
    };

    handleOk = (e) => {
        e.preventDefault();
        const { form, dispatch, createOrgType, fetchOrgByEditDetail } = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                if (createOrgType == 'create') {
                    //新增组织
                    dispatch({
                        type: 'teacher/createOrg',
                        payload: {
                            name: values.name,
                            englishName: values.englishName,
                            orgType: 1, //（1：组织，2：班级）
                            parentId: values.parentId, //父级节点id
                            tag: values.tag, //界面中的教研组或部门
                            apearAdminTree: 1, //默认显示在树结构中
                        },
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
                    //编辑组织
                    dispatch({
                        type: 'teacher/updateOrg',
                        payload: {
                            name: values.name,
                            englishName: values.englishName,
                            orgType: 1, //(1:组织，2：班级)
                            tag: values.tag, //界面中的教研组或部门
                            id: this.props.treeId,
                            parentId:
                                values.parentId == this.props.treeId
                                    ? fetchOrgByEditDetail.parentId
                                    : values.parentId,
                        },
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

    //确认删除
    confirmDelete = () => {
        let self = this;
        confirm({
            title: trans('student.deleteOrg', '确定要删除这个组织吗？'),
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

    //选择树节点获取完整路径
    changeTreeId = (value) => {
        this.getPathByTreeId(value);
        this.setState({
            isChangeTree: true,
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
        const { dispatch } = this.props;
        dispatch({
            type: 'teacher/fetchOrgDetailByEdit',
            payload: {
                treeNodeId: this.props.treeId,
            },
            onSuccess: () => {},
        });
    };

    //处理上级组织路径
    handleOrgPath(orgPath) {
        if (!orgPath) return;
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

    render() {
        const {
            createOrgModal,
            form: { getFieldDecorator },
            createOrgType,
            orgCompletePath,
            dataSource,
            treeId,
            fetchOrgByEditDetail, //编辑获取的详情
            tagCode, //节点类型
        } = this.props;
        const { isChangeTree, treeExpandedKeys } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
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
        let createOrgTitle =
            createOrgType == 'edit'
                ? trans('student.editOrg', '编辑组织')
                : trans('student.createOrg', '新建组织');
        let editDetail = fetchOrgByEditDetail || {};
        let editOrgPath = isChangeTree ? orgCompletePath : this.handleOrgPath(orgCompletePath);
        //分类节点，分层，行政，club班，学院 不能创建部门
        let createDepartment =
            tagCode == 'CLASSIFY_NODE' ||
            tagCode == 'LAYERED_CLASS' ||
            tagCode == 'ADMINISTRATIVE_CLASS' ||
            tagCode == 'CLUB_CLASS' ||
            tagCode == 'COLLEGE'
                ? false
                : true;
        return (
            <Modal
                visible={createOrgModal}
                title={createOrgTitle}
                footer={null}
                width="600px"
                onCancel={this.handleCancel}
            >
                <Form {...formItemLayout}>
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
                                })(<Input type="text" readOnly className={styles.inputStyle} />)}
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
                                    message: trans('student.pleaseChooseType', '请选择类型'),
                                },
                            ],
                            initialValue: createOrgType == 'edit' ? editDetail.tag : '',
                        })(
                            <Radio.Group disabled={createOrgType == 'edit' ? true : false}>
                                <Radio value="TEACHING_RESEARCH_GROUP">
                                    {trans('teacher.teachingResearchGroup', '教研组')}
                                </Radio>
                                {createDepartment && (
                                    <Radio value="DEPARTMENT">
                                        {trans('teacher.department', '部门')}
                                    </Radio>
                                )}
                            </Radio.Group>
                        )}
                    </Form.Item>
                    <Form.Item label={trans('student.calling', '名称')}>
                        {getFieldDecorator('name', {
                            rules: [
                                { required: true, message: trans('teacher.addName', '请添加名称') },
                            ],
                            initialValue: createOrgType == 'edit' ? editDetail.name : '',
                        })(
                            <Input
                                placeholder={trans('teacher.inputNecessary', '请输入（必填）')}
                                className={styles.inputStyle}
                            />
                        )}
                    </Form.Item>
                    <Form.Item label={trans('student.englishCalling', '英文名称')}>
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
                            initialValue: createOrgType == 'edit' ? editDetail.englishName : '',
                        })(
                            <Input
                                placeholder={trans('teacher.inputNecessary', '请输入（必填）')}
                                className={styles.inputStyle}
                            />
                        )}
                    </Form.Item>
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
