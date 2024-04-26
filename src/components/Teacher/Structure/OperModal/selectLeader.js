//选择直线主管
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './commonModal.less';
import { Modal, Form, Select } from 'antd';
import { trans } from '../../../../utils/i18n';

const { Option } = Select;

@Form.create()
@connect((state) => ({
    employeeList: state.teacher.employeeList,
}))
export default class SelectLeader extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selectLeaderVisible != this.props.selectLeaderVisible) {
            if (nextProps.selectLeaderVisible) {
                this.getStaffList();
            }
        }
    }

    handleCancel = () => {
        const { hideModal, form } = this.props;
        typeof hideModal == 'function' && hideModal.call(this, 'selectLeader');
        form.resetFields();
    };

    handleOk = (e) => {
        e.preventDefault();
        const { dispatch, form, getTeacherList, getTreeOrg, rowIds } = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                dispatch({
                    type: 'teacher/batchSetController',
                    payload: {
                        leaderId: values.leaderId,
                        userIdList: rowIds,
                    },
                    onSuccess: () => {
                        form.resetFields();
                        this.handleCancel();
                        typeof getTeacherList == 'function' && getTeacherList.call(this);
                        typeof getTreeOrg == 'function' && getTreeOrg.call(this);
                    },
                });
            }
        });
    };

    //获取直线主管列表
    getStaffList() {
        const { dispatch } = this.props;
        dispatch({
            type: 'teacher/getEmployee',
            payload: {},
        });
    }

    //格式化员工列表
    handleStaffList = (arr) => {
        if (!arr || arr.length <= 0) return [];
        let resultArr = [];
        arr.map((item) => {
            let obj = {
                title: `${item.name}  ${item.ename}`,
                key: item.id,
                value: item.id,
            };
            resultArr.push(obj);
        });
        return resultArr;
    };

    render() {
        const {
            selectLeaderVisible,
            form: { getFieldDecorator },
            employeeList,
        } = this.props;
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
        return (
            <Modal
                visible={selectLeaderVisible}
                title={trans('teacher.setLeaderForStaff', '为批量选择的员工设置直线主管')}
                footer={null}
                width="500px"
                onCancel={this.handleCancel}
            >
                <Form {...formItemLayout}>
                    <Form.Item label={trans('teacher.selectBoss', '选择主管')}>
                        {getFieldDecorator('leaderId', {
                            rules: [
                                {
                                    required: true,
                                    message: trans('student.pleaseSelect', '请选择'),
                                },
                            ],
                        })(
                            <Select
                                placeholder={trans('student.pleaseSelect', '请选择')}
                                className={styles.selectPersonStyle}
                                style={{ width: 320 }}
                                showSearch
                                optionFilterProp="children"
                            >
                                {employeeList &&
                                    employeeList.length > 0 &&
                                    employeeList.map((item) => {
                                        return (
                                            <Option value={item.id} key={item.id}>
                                                {item.name} {item.ename}
                                            </Option>
                                        );
                                    })}
                            </Select>
                        )}
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
                                {trans('global.add', '添加')}
                            </span>
                        </a>
                    </div>
                </Form>
            </Modal>
        );
    }
}
