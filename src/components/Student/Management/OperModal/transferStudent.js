//转移学生
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './commonModal.less';
import { Modal, Form, TreeSelect } from 'antd';
import { trans } from '../../../../utils/i18n';

const { confirm } = Modal;

@Form.create()
@connect((state) => ({
    updateNonAdministrationClass: state.student.updateNonAdministrationClass, //非行政班年级
    addStudentGradeList: state.student.addStudentGradeList, //行政班年级
}))
export default class TransferStudent extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.transferStudentVisible != this.props.transferStudentVisible) {
            if (nextProps.transferStudentVisible) {
                //获取行政班
                this.getAdminClass();
                //获取非行政班
                this.getNotAdminClass();
            }
        }
    }

    //行政班级
    getAdminClass() {
        const { dispatch } = this.props;
        dispatch({
            type: 'student/getGradeList',
            payload: {},
            onSuccess: () => {},
        });
    }

    //非行政班级
    getNotAdminClass() {
        const { dispatch } = this.props;
        dispatch({
            type: 'student/nonAdministrationClass',
            payload: {},
        });
    }

    handleCancel = () => {
        const { hideModal, form } = this.props;
        typeof hideModal == 'function' && hideModal.call(this, 'transferStudent');
        form.resetFields();
    };

    confirmTransfer = () => {
        let self = this;
        confirm({
            title: trans('student.confirmTransferAll', '您确定要转移所选学生吗？'),
            onOk() {
                self.handleOk();
            },
        });
    };

    handleOk() {
        const { form, dispatch, treeId, rowIds, transferType, record } = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                dispatch({
                    type: 'teacher/transferStaff',
                    payload: {
                        fromNodeId: treeId, //源头节点id
                        userIdList: transferType == 'single' ? [record.userId] : rowIds, //转移成员
                        toNodeId: values.orgId, //目标节点id
                    },
                    onSuccess: () => {
                        this.handleCancel();
                        //刷新列表和树结构
                        const { getTreeOrg, getStudentList } = this.props;
                        typeof getStudentList == 'function' && getStudentList.call(this);
                        typeof getTreeOrg == 'function' && getTreeOrg.call(this);
                    },
                });
            }
        });
    }

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

    render() {
        const {
            transferStudentVisible,
            form: { getFieldDecorator },
            transferType,
            tagCode,
            updateNonAdministrationClass, //非行政班年级
            addStudentGradeList, //行政班年级
        } = this.props;
        const formItemLayout = {
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 24 },
            },
        };
        const treeProps = {
            showSearch: true,
            treeData:
                tagCode != 'ADMINISTRATIVE_CLASS'
                    ? this.formatTreeData(updateNonAdministrationClass)
                    : this.formatTreeData(addStudentGradeList),
            dropdownStyle: { maxHeight: 400, overflow: 'auto' },
            placeholder: trans('student.searchOrg', '请搜索或选择组织'),
            treeNodeFilterProp: 'title',
            treeDefaultExpandAll: true,
            className: styles.selectPersonStyle,
        };
        return (
            <Modal
                visible={transferStudentVisible}
                title={
                    transferType == 'batch'
                        ? trans('student.transferMore', '批量转移到') + '...'
                        : trans('student.transferTo', '转移到') + '...'
                }
                footer={null}
                width="500px"
                onCancel={this.handleCancel}
            >
                <Form {...formItemLayout}>
                    <Form.Item>
                        {getFieldDecorator('orgId', {
                            rules: [
                                {
                                    required: true,
                                    message: trans(
                                        'student.pleaseSearchTransferOrg',
                                        '请选择要转移的组织'
                                    ),
                                },
                            ],
                        })(<TreeSelect {...treeProps} />)}
                    </Form.Item>
                    <div className={styles.operationList}>
                        <a>
                            <span
                                className={styles.modalBtn + ' ' + styles.cancelBtn}
                                onClick={this.handleCancel}
                            >
                                {trans('global.cancel', '取消')}
                            </span>
                            <span
                                className={styles.modalBtn + ' ' + styles.submitBtn}
                                onClick={this.confirmTransfer}
                            >
                                {trans('global.confirmTransfer', '确认转移')}
                            </span>
                        </a>
                    </div>
                </Form>
            </Modal>
        );
    }
}
