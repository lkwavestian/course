//为学生设置导师
import React, { PureComponent } from 'react';
import styles from './commonModal.less';
import { Modal, Select, Form, Input, Checkbox, Row, Col, Button, message } from 'antd';
import { connect } from 'dva';
import { trans } from '../../../../utils/i18n';

const { Option } = Select;
const { TextArea } = Input;

@connect((state) => ({
    // provinceList: state.student.provinceList,
}))
@Form.create()
export default class StudentTable extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            handleOkLoading: false,
            renderMsgItemObj: [
                {
                    groupName: '全部学生信息',
                    value: 'userPropertyList',
                    children: [
                        {
                            label: '姓名',
                            value: '1-userName',
                        },
                        {
                            label: '中文名',
                            value: '1-name',
                        },
                        {
                            label: '英文名',
                            value: '1-ename',
                        },
                        {
                            label: '性别',
                            value: '1-sex',
                        },
                        {
                            label: '出生日期',
                            value: '1-birthday',
                        },
                        {
                            label: '国籍',
                            value: '1-nationality',
                        },
                        {
                            label: '民族',
                            value: '1-nation',
                        },
                        {
                            label: '证件号码',
                            value: '1-certNo',
                        },
                        {
                            label: '手机',
                            value: '1-mobile',
                        },
                        {
                            label: '籍贯',
                            value: '1-nativePlaceId',
                        },
                        {
                            label: '户籍类别',
                            value: '1-householdType',
                        },
                        {
                            label: '户籍地址',
                            value: '1-householdInfo',
                        },
                        {
                            label: '出生地址',
                            value: '1-birthdayAddressInfo',
                        },
                        {
                            label: '居住地址',
                            value: '1-residentialInfo',
                        },
                        {
                            label: '联系地址',
                            value: '1-contactAddressInfo',
                        },
                    ],
                },
                {
                    groupName: '全部家长信息',
                    value: 'parentPropertyList',
                    children: [
                        {
                            label: '姓名',
                            value: '2-name',
                        },
                        {
                            label: '国籍',
                            value: '2-nationality',
                        },
                        {
                            label: '证件号码',
                            value: '2-certNo',
                        },
                        {
                            label: '手机',
                            value: '2-mobile',
                        },
                        {
                            label: '工作单位 选填',
                            value: '2-workUnit',
                        },
                        {
                            label: '职位 选填',
                            value: '2-jobPosition',
                        },
                        {
                            label: '学历 选填',
                            value: '2-education',
                        },
                        {
                            label: '邮箱',
                            value: '2-email',
                        },
                        {
                            label: '是否主联系人',
                            value: '2-mainRelation',
                        },
                    ],
                },
                {
                    groupName: '支付信息',
                    value: 'payPropertyList',
                    children: [
                        {
                            label: '银行账户（含卡号、户名、开户行、开户地）',
                            value: '3-bank',
                        },
                    ],
                },
                {
                    groupName: '附件资料',
                    value: 'annexPropertyList',
                    children: [
                        {
                            label: '身份信息',
                            value: '4-identity',
                        },
                        {
                            label: '户籍信息',
                            value: '4-household',
                        },
                    ],
                },
            ],
        };
    }

    //取消
    handleCancel = () => {
        const { hideModal, form } = this.props;
        form.resetFields();
        typeof hideModal == 'function' && hideModal.call(this, 'parents');
    };

    //确认通知
    handleOk = () => {
        const { dispatch, form, getStudentList, rowIds } = this.props;
        form.validateFields((err, values) => {
            let userPropertyList = values.userPropertyList.map((item) => item.split('-')[1]);
            let parentPropertyList = values.parentPropertyList.map((item) => item.split('-')[1]);
            let payPropertyList = values.payPropertyList.map((item) => item.split('-')[1]);
            let annexPropertyList = values.annexPropertyList.map((item) => item.split('-')[1]);
            if (!err) {
                this.setState({
                    handleOkLoading: true,
                });
                dispatch({
                    type: 'student/batchSetStudentNotice',
                    payload: {
                        userIdList: rowIds,
                        propertyInfoInputModel: {
                            userPropertyList,
                            parentPropertyList,
                            payPropertyList,
                            annexPropertyList,
                        },
                        message: values.teacherList,
                    },
                    onSuccess: () => {
                        message.success('通知发送成功');
                        this.setState({
                            handleOkLoading: false,
                        });
                        this.handleCancel();
                        typeof getStudentList == 'function' && getStudentList.call(this);
                    },
                });
            }
        });
    };

    renderMsgItem = (renderMsgItemObj) => {
        const {
            form: { getFieldDecorator },
        } = this.props;
        return renderMsgItemObj.map((item) => (
            <div className={styles.formItemMsg}>
                <Checkbox
                    className={styles.allStuMsg}
                    onClick={(e) => this.handleGroupClick(e, item.groupName)}
                >
                    {item.groupName}
                </Checkbox>
                <Form.Item>
                    {getFieldDecorator(item.value, { initialValue: [] })(
                        <Checkbox.Group>
                            {item.children && item.children.length > 2 && (
                                <Row>
                                    {item.children.map((child) => (
                                        <Col span={6}>
                                            <Checkbox value={child.value}>{child.label}</Checkbox>
                                        </Col>
                                    ))}
                                </Row>
                            )}
                            {item.children && item.children.length == 2 && (
                                <Row>
                                    {item.children.map((child) => (
                                        <Col span={12}>
                                            <Checkbox value={child.value}>{child.label}</Checkbox>
                                        </Col>
                                    ))}
                                </Row>
                            )}
                            {item.children && item.children.length == 1 && (
                                <Row>
                                    {item.children.map((child) => (
                                        <Col span={24}>
                                            <Checkbox value={child.value}>{child.label}</Checkbox>
                                        </Col>
                                    ))}
                                </Row>
                            )}
                            {/* <Row>
                                {item.children.map((child) => (
                                    <Col span={6}>
                                        <Checkbox value={child.value}>{child.label}</Checkbox>
                                    </Col>
                                ))}
                            </Row> */}
                        </Checkbox.Group>
                    )}
                </Form.Item>
            </div>
        ));
    };

    handleGroupClick = (e, groupName) => {
        const {
            form: { setFieldsValue },
        } = this.props;
        const { renderMsgItemObj } = this.state;
        let checked = e.target.checked;
        if (checked) {
            if (groupName === '全部学生信息') {
                setFieldsValue({
                    userPropertyList: renderMsgItemObj[0].children.map((item) => item.value),
                });
            }
            if (groupName === '全部家长信息') {
                setFieldsValue({
                    parentPropertyList: renderMsgItemObj[1].children.map((item) => item.value),
                });
            }
            if (groupName == '支付信息') {
                setFieldsValue({
                    payPropertyList: renderMsgItemObj[2].children.map((item) => item.value),
                });
            }
            if (groupName == '附件资料') {
                setFieldsValue({
                    annexPropertyList: renderMsgItemObj[3].children.map((item) => item.value),
                });
            }
        } else {
            if (groupName === '全部学生信息') {
                setFieldsValue({ userPropertyList: [] });
            }
            if (groupName === '全部家长信息') {
                setFieldsValue({
                    parentPropertyList: [],
                });
            }
            if (groupName == '支付信息') {
                setFieldsValue({ payPropertyList: [] });
            }
            if (groupName == '附件资料') {
                setFieldsValue({ annexPropertyList: [] });
            }
        }
    };

    render() {
        const { handleOkLoading, renderMsgItemObj } = this.state;

        const {
            parentsVisible,
            employeeList,
            form: { getFieldDecorator },
            rowIds,
        } = this.props;

        console.log('parentsVisible :>> ', parentsVisible);
        console.log('this.props :>> ', this.props);

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
            <div className={styles.wrapper}>
                <Modal
                    visible={parentsVisible}
                    title={'邀请家长完善信息'}
                    footer={[
                        <Button
                            key="submit"
                            type="primary"
                            shape="round"
                            onClick={this.handleOk}
                            loading={handleOkLoading}
                            style={{ width: '134px' }}
                        >
                            确定并发送通知
                        </Button>,
                    ]}
                    width="930px"
                    onCancel={this.handleCancel}
                    getContainer={false}
                >
                    <div className={styles.msgWrapper}>
                        <div className={styles.studentMsg}>
                            即将邀请{rowIds.length}名学生的家长参与本次信息更新:
                        </div>

                        <div className={styles.parentWrapper}>
                            <div className={styles.parentMsg}>
                                <span className={styles.updateMsg}>
                                    选择本次开放给家长更新的信息
                                </span>
                                {/* <span className={styles.required}>
                                    （未标注是否的信息勾选后家长端必填填写）
                                </span> */}
                            </div>
                            <Form {...formItemLayout}>{this.renderMsgItem(renderMsgItemObj)}</Form>
                        </div>

                        <div className={styles.parentWrapper}>
                            <div className={styles.parentMsg}>
                                <span className={styles.updateMsg}>设置通知模板</span>
                            </div>
                            <div className={styles.formItemMsg}>
                                <div className={styles.notice}> &lt;学生中文名&gt;家长，您好</div>
                                <Row>
                                    <Col>
                                        <Form.Item>
                                            {getFieldDecorator('teacherList', {
                                                required: true,
                                                initialValue:
                                                    '请尽快完善信息，感谢您对学校工作的支持！',
                                            })(
                                                <TextArea
                                                    className={styles.noticeTextArea}
                                                    autoSize={{ minRows: 3, maxRows: 5 }}
                                                    style={{ borderRadius: '8px' }}
                                                />
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}
