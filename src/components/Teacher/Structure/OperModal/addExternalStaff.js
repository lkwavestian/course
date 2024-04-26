//添加外部员工
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './commonModal.less';
import { Modal, Form, Input, TreeSelect, Radio, message } from 'antd';
import { trans, locale } from '../../../../utils/i18n';

@Form.create()
@connect((state) => ({
    checkEmployeeResponse: state.teacher.checkEmployeeResponse, //添加外部员工校验的结果
}))
export default class AddExternalStaff extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleCancel = () => {
        const { hideModal, form } = this.props;
        typeof hideModal == 'function' && hideModal.call(this, 'addExternalStaff');
        form.resetFields();
    };

    handleOk = (e) => {
        e.preventDefault();
        const { dispatch, form, getTeacherList, getTreeOrg, identity } = this.props;
        console.log('identity: ', identity);
        form.validateFields((err, values) => {
            if (!err) {
                if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(values.phoneNumber)) {
                    message.error(trans('student.pleaseCheckPhone', '请填写正确的手机号码'));
                    return false;
                }
                if (values.certificateType == '1') {
                    //身份证号码验证
                    if (!/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(values.certificateNumber)) {
                        message.error(trans('student.pleaseCheckId', '请输入正确的身份证号码'));
                        return false;
                    }
                }
                // if(values.certificateType == "4") {
                //     //护照号码验证
                //     if(!/^((1[45]\d{7})|(G\d{8})|(P\d{7})|(S\d{7,8}))?$/.test(values.certificateNumber)) {
                //         message.error("请输入正确的护照号码");
                //         return false;
                //     }
                // }
                //校验是否可以添加
                dispatch({
                    type: 'teacher/checkAddExternalEmployee',
                    payload: {
                        name: values.userName,
                        mobile: values.phoneNumber,
                        certType: values.certificateType,
                        certNo: values.certificateNumber,
                        orgId: values.organizationId,
                        identity: identity == 'staff' ? values.identity : 'externalUser',
                    },
                    onSuccess: () => {
                        const { checkEmployeeResponse } = this.props;
                        if (checkEmployeeResponse.canContinue) {
                            let self = this;
                            //可以提交
                            Modal.confirm({
                                title: checkEmployeeResponse && checkEmployeeResponse.message,
                                okText: trans('global.continue', '继续'),
                                cancelText: trans('global.cancel', '取消'),
                                // onOk() {
                                //     self.confirmSubmit(values)
                                // },
                                onOk() {
                                    return new Promise((resolve, reject) => {
                                        setTimeout(self.confirmSubmit(values), 1000);
                                    }).catch(() => console.log('Oops errors!'));
                                },
                                onCancel() {},
                            });
                        } else {
                            //不可继续添加
                            Modal.error({
                                title: (
                                    <span style={{ fontWeight: 'normal', textAlign: 'left' }}>
                                        {checkEmployeeResponse && checkEmployeeResponse.message}
                                    </span>
                                ),
                                okText: trans('global.ok', '好的'),
                                onOk() {},
                            });
                        }
                    },
                });
            }
        });
    };

    //继续添加
    confirmSubmit(values) {
        const { dispatch, form, getTeacherList, getTreeOrg, identity } = this.props;
        console.log(identity, values.identity, 'identity');
        dispatch({
            type: 'teacher/addExternalStaff',
            payload: {
                name: values.userName,
                mobile: values.phoneNumber,
                certType: values.certificateType,
                certNo: values.certificateNumber,
                orgId: values.organizationId,
                identity: identity == 'staff' ? values.identity : 'externalUser',
            },
            onSuccess: () => {
                Modal.destroyAll();
                form.resetFields();
                this.handleCancel();
                typeof getTeacherList == 'function' && getTeacherList.call(this);
                typeof getTreeOrg == 'function' && getTreeOrg.call(this);
            },
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
            addExternalStaffVisible,
            form: { getFieldDecorator },
            dataSource,
        } = this.props;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: locale() !== 'en' ? 4 : 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: locale() !== 'en' ? 16 : 14 },
            },
        };
        const treeProps = {
            showSearch: true,
            treeData: this.formatTreeData(dataSource),
            placeholder: trans('teacher.selectBelongOrg', '请选择所属组织'),
            dropdownStyle: {
                maxHeight: 400,
                overflow: 'auto',
            },
            treeNodeFilterProp: 'title',
            treeDefaultExpandAll: false,
            className: styles.selectPersonStyle,
        };
        return (
            <Modal
                visible={addExternalStaffVisible}
                title={trans('teacher.createStaff', '新建员工')}
                footer={null}
                width="800px"
                onCancel={this.handleCancel}
                className={
                    window.self != window.top
                        ? `${styles.addStaffModal} ${styles.iframeModal}`
                        : styles.addStaffModal
                }
            >
                <Form {...formItemLayout}>
                    <Form.Item label={trans('student.name', '姓名')}>
                        {getFieldDecorator('userName', {
                            rules: [
                                {
                                    required: true,
                                    message: trans('teacher.inputYourName', '请输入姓名'),
                                },
                            ],
                        })(
                            <Input
                                placeholder={trans('teacher.inputYourName', '请输入姓名')}
                                className={styles.inputStyle}
                            />
                        )}
                    </Form.Item>
                    <Form.Item label={trans('student.telephone', '手机号')}>
                        {getFieldDecorator('phoneNumber', {
                            rules: [
                                {
                                    required: true,
                                    message: trans('teacher.inputYourPhone', '请输入手机号'),
                                },
                            ],
                        })(
                            <Input
                                placeholder={trans('teacher.inputYourPhone', '请输入手机号')}
                                maxLength={11}
                                className={styles.inputStyle}
                            />
                        )}
                    </Form.Item>
                    <Form.Item label={trans('student.certType', '证件类型')}>
                        {getFieldDecorator('certificateType', {
                            rules: [
                                {
                                    required: true,
                                    message: trans('student.pleaseSelect', '请选择'),
                                },
                            ],
                        })(
                            <Radio.Group>
                                <Radio value="0">{trans('global.unknown', '未知')}</Radio>
                                <Radio value="1">{trans('student.idCard', '身份证')}</Radio>
                                <Radio value="2">{trans('student.studentCard', '学生证')}</Radio>
                                <Radio value="3">{trans('student.certificate', '军官证')}</Radio>
                                <Radio value="4">{trans('student.passport', '护照')}</Radio>
                                <Radio value="5">{trans('student.passCheck', '港澳通行证')}</Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>
                    <Form.Item label={trans('student.certNumber', '证件号')}>
                        {getFieldDecorator('certificateNumber', {
                            rules: [
                                {
                                    required: true,
                                    message: trans(
                                        'teacher.inputYourCertificateNum',
                                        '请输入证件号码'
                                    ),
                                },
                            ],
                        })(
                            <Input
                                placeholder={trans(
                                    'teacher.inputYourCertificateNum',
                                    '请输入证件号码'
                                )}
                                className={styles.inputStyle}
                            />
                        )}
                    </Form.Item>
                    <Form.Item label={trans('teacher.organizationId', '所属组织')}>
                        {getFieldDecorator('organizationId', {
                            rules: [
                                {
                                    required: true,
                                    message: trans(
                                        'teacher.selectOrganizationId',
                                        '请选择所属组织'
                                    ),
                                },
                            ],
                        })(<TreeSelect {...treeProps} className={styles.selectAddStaff} />)}
                    </Form.Item>
                    {this.props.identity == 'staff' && (
                        <Form.Item label={trans('teacher.identityName', '人员类型')}>
                            {getFieldDecorator('identity', {
                                rules: [
                                    {
                                        required: true,
                                        message: trans(
                                            'teacher.pleaseSelectIdentityName',
                                            '请选择人员类型'
                                        ),
                                    },
                                ],
                            })(
                                <Radio.Group>
                                    <Radio value="externalUser">
                                        {trans('teacher.externalUser', '外部人员')}
                                    </Radio>
                                    <Radio value="employee">
                                        {trans('teacher.employee', '正式员工')}
                                    </Radio>
                                </Radio.Group>
                            )}
                        </Form.Item>
                    )}

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
                                {trans('global.finish', '完成')}
                            </span>
                        </a>
                    </div>
                </Form>
            </Modal>
        );
    }
}
