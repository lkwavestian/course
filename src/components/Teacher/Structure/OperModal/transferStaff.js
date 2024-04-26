//转移员工
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './commonModal.less';
import { Modal, Form, TreeSelect } from 'antd';
import { trans } from '../../../../utils/i18n';

const { TreeNode } = TreeSelect;

@Form.create()
@connect((state) => ({}))
export default class TransferStaff extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleCancel = () => {
        const { hideModal, form } = this.props;
        typeof hideModal == 'function' && hideModal.call(this, 'transferStaff');
        form.resetFields();
    };

    handleOk = (e) => {
        e.preventDefault();
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
                        const { getTreeOrg, getTeacherList } = this.props;
                        typeof getTeacherList == 'function' && getTeacherList.call(this);
                        typeof getTreeOrg == 'function' && getTreeOrg.call(this);
                    },
                });
            }
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
            });
        return resultArr;
    }

    render() {
        const {
            transferStaffVisible,
            form: { getFieldDecorator },
            dataSource,
            transferType,
        } = this.props;
        const formItemLayout = {
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 24 },
            },
        };
        const treeProps = {
            showSearch: true,
            treeData: this.formatTreeData(dataSource),
            dropdownStyle: { maxHeight: 400, overflow: 'auto' },
            placeholder: trans('student.searchOrg', '请搜索或选择组织'),
            treeNodeFilterProp: 'title',
            treeDefaultExpandAll: true,
            className: styles.selectPersonStyle,
        };
        return (
            <Modal
                visible={transferStaffVisible}
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
                                onClick={this.handleOk}
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
