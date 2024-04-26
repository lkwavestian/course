//转学
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './commonModal.less';
import { Modal, Form, DatePicker, Input, Upload, Button, message, Icon } from 'antd';
import { trans } from '../../../../utils/i18n';

@Form.create()
@connect((state) => ({}))
class TransferSchool extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isJump: false,
            newFileId: [],
        };
    }

    handleCancel = () => {
        const { hideModal, form } = this.props;
        typeof hideModal == 'function' && hideModal.call(this, 'transferSchool');
        form.resetFields();
        this.setState({
            newFileId: [],
        });
    };

    beforeUpload = (maxSize, file) => {
        if (file.size / 1024 / 1024 <= maxSize) {
            return true;
        } else {
            message.info(
                trans('student.transferSchool.uploadMessge', '上传文件过大, 请压缩后上传！')
            );
            return false;
        }
    };

    handleChange = (info) => {
        let fileList = [...info.fileList];
        let newFileId = [];
        fileList = fileList.forEach((file) => {
            if (file.response) {
                file.response.content.forEach((el) => {
                    newFileId.push(el.fileId);
                });
            }
        });
        this.setState({ newFileId });
    };

    handleSubmit = () => {
        let { dispatch } = this.props;
        this.props.form.validateFields((err, values) => {
            if (!values.leftTime) {
                return;
            }

            if (!values.enterSchool) {
                return;
            }

            dispatch({
                type: 'student/submitTransferSchool',
                payload: {
                    userId: this.props.record.userId,
                    leaveTime:
                        (values.leftTime && values.leftTime.format('YYYY-MM-DD hh:mm:ss')) || '',
                    fileIdList: this.state.newFileId,
                    transfer: values.enterSchool,
                    remark: values.remark,
                },
                onSuccess: () => {
                    this.handleCancel();
                    this.setState({
                        isJump: true,
                    });
                },
            });
        });
    };

    gotoSee = () => {
        let _this = this;
        this.setState(
            {
                isJump: false,
            },
            () => {
                requestAnimationFrame(() => {
                    _this.props.switchNavList('2', 1);
                });
            }
        );
    };

    closeSee = () => {
        this.setState({
            isJump: false,
        });
        const { getStudentList } = this.props;
        typeof getStudentList == 'function' && getStudentList.call(this);
    };

    render() {
        let { transferSchoolVisible } = this.props;
        let { getFieldDecorator } = this.props.form;
        let { isJump } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        const propsUpload = {
            action: '/api/teaching/excel/uploadFile',
            accept: 'image/*, video/webp, text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .word, .pdf, .docx, .pages',
            beforeUpload: this.beforeUpload.bind(this, 100),
            onChange: this.handleChange,
            multiple: true,
        };
        return (
            <div>
                <Modal
                    visible={transferSchoolVisible}
                    title={trans('student.transfer', '转学')}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <div className={styles.TransferSchool}>
                        <Form {...formItemLayout}>
                            <Form.Item label={trans('student.leftSchoolTime', '离校日期')}>
                                {getFieldDecorator('leftTime', {
                                    rules: [
                                        {
                                            required: true,
                                            message: `${trans(
                                                'student.leftSchoolTime',
                                                '离校日期'
                                            )}${trans('student.mustFill', '必填')}`,
                                        },
                                    ],
                                })(
                                    <DatePicker
                                        placeholder={trans(
                                            'student.transferSchool.select',
                                            '请选择'
                                        )}
                                        className={styles.leftTime}
                                    />
                                )}
                            </Form.Item>
                            <Form.Item label={trans('student.enterNewSchool', '转入学校')}>
                                {getFieldDecorator('enterSchool', {
                                    rules: [
                                        {
                                            required: true,
                                            message: `${trans(
                                                'student.enterNewSchool',
                                                '转入学校'
                                            )}${trans('student.mustFill', '必填')}`,
                                        },
                                    ],
                                })(
                                    <Input
                                        placeholder={trans(
                                            'student.transferSchool.input',
                                            '请搜索或者直接输入'
                                        )}
                                        className={styles.enterSchool}
                                    />
                                )}
                            </Form.Item>
                            <Form.Item label={trans('student.transferAnnex', '转学附件')}>
                                <Upload {...propsUpload}>
                                    <Button style={{ paddingLeft: '12px', borderRadius: '20px' }}>
                                        {trans('student.transferSchool.upload', '请上传附件')}
                                    </Button>
                                </Upload>
                            </Form.Item>
                            <Form.Item label={trans('student.remarks', '备注')}>
                                {getFieldDecorator('remark')(
                                    <Input.TextArea rows={4} className={styles.enterSchool} />
                                )}
                            </Form.Item>
                            <Form.Item>
                                <div className={styles.btnBox}>
                                    <Button onClick={this.handleCancel} className={styles.btn}>
                                        {trans('global.cancel', '取消')}
                                    </Button>
                                    <Button
                                        onClick={this.handleSubmit}
                                        type="primary"
                                        className={styles.btn}
                                    >
                                        {trans('global.confirm', '确定')}
                                    </Button>
                                </div>
                            </Form.Item>
                        </Form>
                    </div>
                </Modal>
                <Modal
                    visible={isJump}
                    title={
                        <span>
                            <Icon
                                type="check-circle"
                                style={{ color: '#25b864', marginRight: '12px' }}
                            />
                            {trans('student.successfully.transfer', '设置转学成功')}
                        </span>
                    }
                    footer={null}
                    width={'360px'}
                    closable={false}
                    onCancel={this.handleCancel}
                >
                    <div className={styles.twoJump}>
                        <Button onClick={this.gotoSee} className={styles.t1}>
                            {trans('student.goToSee', '前往查看')}
                        </Button>
                        <Button onClick={this.closeSee} type="primary" className={styles.t2}>
                            {trans('global.confirm', '确定')}
                        </Button>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default TransferSchool;
