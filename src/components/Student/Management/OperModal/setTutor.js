//为学生设置导师
import React, { useState, useEffect } from 'react';
import styles from './commonModal.less';
import { Modal, Select, Form, Radio } from 'antd';
import { connect } from 'dva';
import { trans } from '../../../../utils/i18n';

const { Option } = Select;

function SetTutor(props) {
    useEffect(() => {
        if (props.setTutorVisible === true) {
            getTeacherList();
        }
    }, [props.setTutorVisible]);

    //取消
    const handleCancel = () => {
        const { hideModal, form } = props;
        form.resetFields();
        typeof hideModal == 'function' && hideModal.call(this, 'setTutor');
    };

    //获取导师的列表
    const getTeacherList = () => {
        const { dispatch } = props;
        dispatch({
            type: 'teacher/getEmployee',
            payload: {},
        });
    };

    //确认设置导师
    const handleOk = () => {
        const { dispatch, form, getStudentList, rowIds } = props;
        form.validateFields((err, values) => {
            console.log('values: ', values);
            if (!err) {
                let apiString = 'student/batchSetStudentTutor';
                if(values.teacherType == 2){
                    apiString = 'student/batchSetStudentSpecialtyTutor'
                }
                dispatch({
                    type: apiString,
                    payload: {
                        userIdList: rowIds,
                        teacherUserId: values.teacherList,
                    },
                    onSuccess: () => {
                        handleCancel();
                        typeof getStudentList == 'function' && getStudentList.call(this);
                    },
                });
            }
        });
    };

    const resetStuTutor = () => {
        const { rowIds, dispatch } = props;
        console.log('rowIds', rowIds);

        dispatch({
            type: 'student/endStudentTutor',
            payload: {
                studentIdList: rowIds,
                endTime: null,
            },
        });
    };

    const {
        setTutorVisible,
        employeeList,
        form: { getFieldDecorator },
    } = props;
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
        <div>
            <Modal
                visible={setTutorVisible}
                title={'设置导师'}
                footer={null}
                width="550px"
                onCancel={handleCancel}
            >
                <Form {...formItemLayout}>
                    <Form.Item label='导师类型'>
                    {getFieldDecorator('teacherType', {
                            rules: [
                                {
                                    required: true,
                                    message: trans('student.pleaseSelect', '请选择'),
                                },
                            ],
                        })(
                            <Radio.Group>
                                <Radio value={1}>导师</Radio>
                                <Radio value={2}>特长教练</Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>
                    <Form.Item label={trans('student.chooseLeader', '选择导师')}>
                        {getFieldDecorator('teacherList', {
                            rules: [
                                {
                                    required: true,
                                    message: trans('student.pleaseSelect', '请选择'),
                                },
                            ],
                        })(
                            <Select
                                placeholder={trans('student.selectLeader', '请选择要设置的导师')}
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
                    {/* <Button type="primary" onClick={resetStuTutor}>
                        清空学生导师
                    </Button> */}
                    <div className={styles.operationList}>
                        <a>
                            <span
                                className={styles.modalBtn + ' ' + styles.cancelBtn}
                                onClick={handleCancel}
                            >
                                {trans('global.cancel', '取消')}
                            </span>
                            <span
                                className={styles.modalBtn + ' ' + styles.submitBtn}
                                onClick={handleOk}
                            >
                                {trans('global.confirm', '确定')}
                            </span>
                        </a>
                    </div>
                </Form>
            </Modal>
        </div>
    );
}

function mapStateProps(state) {
    return {
        employeeList: state.teacher.employeeList,
    };
}

export default connect(mapStateProps)(Form.create()(SetTutor));
