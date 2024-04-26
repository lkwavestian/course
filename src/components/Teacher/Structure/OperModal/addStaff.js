//添加员工
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './commonModal.less';
import { Modal, Form, TreeSelect } from 'antd';
import { trans } from '../../../../utils/i18n';
import { locale } from 'moment';
import SelectTeacherAndOrg from '../../../Time/TimeTable/FreedomCourse/common/selectTeacherAndOrg';

@Form.create()
@connect((state) => ({
    addTeacherList: state.teacher.addTeacherList,
}))
export default class AddStaff extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.addStaffVisible != this.props.addStaffVisible) {
            if (nextProps.addStaffVisible) {
                this.getStaffList();
            }
        }
    }

    handleCancel = () => {
        const { hideModal, form } = this.props;
        typeof hideModal == 'function' && hideModal.call(this, 'addStaff');
        form.resetFields();
    };

    handleOk = (e) => {
        e.preventDefault();
        const { dispatch, form, treeId, getTeacherList, getTreeOrg } = this.props;
        form.validateFields((err, values) => {
            console.log('err: ', err);
            if (!err) {
                dispatch({
                    type: 'teacher/addStaff',
                    payload: {
                        nodeId: treeId,
                        userIdList: this.necessary.state.userIds,
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

    //获取员工列表
    getStaffList() {
        const { dispatch } = this.props;
        dispatch({
            type: 'teacher/getAllTeacherList',
            payload: {
                type: 1, //员工：1，学生2
            },
        });
    }

    //格式化员工列表
    handleStaffList = (arr) => {
        if (!arr || arr.length <= 0) return [];
        let resultArr = [];
        arr.map((item) => {
            let obj = {
                name:
                    item.ename && item.ename != item.name
                        ? `${item.name}  ${item.ename}`
                        : `${item.name}`,
                enName: item.ename,
                orgFlag: false,
                id: item.id,
            };
            resultArr.push(obj);
        });
        return resultArr;
    };

    render() {
        const {
            addStaffVisible,
            form: { getFieldDecorator },
            addTeacherList,
        } = this.props;
        const staffProps = {
            treeData: this.handleStaffList(addTeacherList),
            placeholder: trans('teacher.pleaseSelectAddStaff', '请选择要添加的员工'),
            dropdownStyle: {
                maxHeight: 400,
                overflow: 'auto',
            },
            treeCheckable: true,
            treeNodeFilterProp: 'title',
            className: styles.selectPersonStyle,
        };
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: locale() == 'en' ? 8 : 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: locale() == 'en' ? 16 : 20 },
            },
        };
        return (
            <Modal
                visible={addStaffVisible}
                title={trans('teacher.addStaff', '添加员工')}
                footer={null}
                width="500px"
                onCancel={this.handleCancel}
            >
                <Form {...formItemLayout} style={{}}>
                    {/* <Form.Item label={trans('teacher.selectStaff', '选择员工')}>
                        {getFieldDecorator('staffIds', {
                            rules: [
                                {
                                    required: true,
                                    message: trans('student.pleaseSelect', '请选择'),
                                },
                            ],
                        })(<TreeSelect {...staffProps} className={styles.selectAddStaff} />)}
                    </Form.Item> */}
                    <Form.Item label={trans('teacher.selectStaff', '选择员工')}>
                        {getFieldDecorator('staffIds', {
                            rules: [
                                // {
                                //     required: true,
                                //     message: trans('student.pleaseSelect', '请选择'),
                                // },
                            ],
                        })(
                            <SelectTeacherAndOrg
                                placeholder="搜素或选择人员"
                                treeData={this.handleStaffList(addTeacherList)}
                                onRef={(ref) => {
                                    this.necessary = ref;
                                }}
                                // userIds={this.getGroupId(courseDetail.mainTeachers)}
                                selectType="1"
                            />
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
