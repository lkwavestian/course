//休学学生
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './commonModal.less';
import { Modal, Form, DatePicker, Input, Upload, Button, message, Spin, Icon } from 'antd';
import { trans } from '../../../../utils/i18n';
import moment from 'moment';

@Form.create()
@connect((state) => ({
    suspendStudyInfo: state.student.suspendStudyInfo,
}))
class SuspensionSchool extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isJump: false,
            newFileId: [],
            fileList: [],
            loading: false,
        };
    }

    componentDidMount() {
        clearTimeout(this.clearTimeout);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.suspensionSchoolVisible != this.props.suspensionSchoolVisible) {
            if (nextProps.suspensionSchoolVisible && this.props.statusType == 2) {
                this.initDetail();
            }
        }
    }

    initDetail = () => {
        const { dispatch } = this.props;
        this.setState({
            loading: false,
        });
        dispatch({
            type: 'student/suspendStudyInfo',
            payload: {
                userId: this.props.record.userId,
            },
            onSuccess: () => {
                let currentUrl = window.location.href;
                currentUrl = currentUrl.replace(/(\?|&)ticket\=([0-9A-z]+?&|[0-9A-z]+)/gi, '');
                let homePageUrl =
                    currentUrl.indexOf('yungu.org') > -1
                        ? 'https://profile.yungu.org'
                        : 'https://student-profile.daily.yungu-inc.org';

                let { suspendStudyInfo } = this.props;
                let newFileList = [];
                let newIds = [];
                suspendStudyInfo.fileInfoList &&
                    suspendStudyInfo.fileInfoList.forEach((el) => {
                        newFileList.push({
                            ...el,
                            uid: el.fileId,
                            status: 'done',
                            url: `${homePageUrl}${el.url}`,
                            thumbUrl: `${homePageUrl}${el.url}`,
                            name: el.fileName,
                            netWork: true,
                        });
                        newIds.push(el.fileId);
                    });

                this.setState({
                    fileList: newFileList,
                    newFileId: newIds,
                    loading: true,
                });
                this.props.form.setFieldsValue({
                    startDate:
                        (suspendStudyInfo.startDate && moment(suspendStudyInfo.startDate)) || null,
                    endDate: (suspendStudyInfo.endDate && moment(suspendStudyInfo.endDate)) || null,
                    remark: suspendStudyInfo.remark,
                });
            },
        });
    };

    handleCancel = () => {
        const { hideModal, form } = this.props;
        typeof hideModal == 'function' && hideModal.call(this, 'suspensionSchool');
        form.resetFields();
        this.setState({
            newFileId: [],
            fileList: [],
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
        let fileList = info.fileList;
        let newFileId = [];
        fileList = fileList.forEach((file) => {
            if (file.netWork) {
                newFileId.push(file.fileId);
            }
            if (file.response) {
                file.response.content.forEach((el) => {
                    newFileId.push(el.fileId);
                });
            }
        });

        this.setState({ newFileId });
    };

    handleSubmit() {
        let { dispatch, statusType } = this.props;
        let { newFileId } = this.state;
        this.props.form.validateFields((err, values) => {
            if (!values.startDate) {
                return;
            }
            if (!values.endDate) {
                return;
            }
            let _st = new Date(values.startDate.format('YYYY/MM/DD hh:mm:ss')).getTime();
            let _et = new Date(values.endDate.format('YYYY/MM/DD hh:mm:ss')).getTime();
            if (_et <= _st) {
                message.warn(trans('student.startTimeLessThanEndTime', '开始时间要小于结束时间'));
                return;
            }

            dispatch({
                type: 'student/submitSuspensionSchool',
                payload: {
                    userId: this.props.record.userId,
                    startDate: values.startDate.format('YYYY-MM-DD hh:mm:ss'),
                    endDate: values.endDate.format('YYYY-MM-DD hh:mm:ss'),
                    fileIdList: newFileId,
                    remark: values.remark,
                    statusType: statusType,
                },
                onSuccess: () => {
                    this.clearTimeout = setTimeout(() => {
                        this.handleCancel();
                        let { getStudentList } = this.props;
                        typeof getStudentList == 'function' && getStudentList.call(this);
                        if (statusType != 2) {
                            this.setState({
                                isJump: true,
                            });
                        }
                    }, 1200);
                },
            });
        });
    }

    gotoSee = () => {
        let _this = this;
        this.setState(
            {
                isJump: false,
            },
            () => {
                requestAnimationFrame(() => {
                    _this.props.switchNavList('1', 1);
                });
            }
        );
    };

    closeSee = () => {
        this.setState({
            isJump: false,
        });
    };

    render() {
        let { suspensionSchoolVisible, statusType } = this.props;
        let { getFieldDecorator } = this.props.form;
        let { isJump } = this.state;
        let { loading } = this.state;
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
            onChange: this.handleChange.bind(this),
            defaultFileList: [...this.state.fileList],
            multiple: true,
        };
        return (
            <div>
                <Modal
                    visible={suspensionSchoolVisible}
                    title={trans('student.suspension', '转学')}
                    footer={null}
                    onCancel={this.handleCancel.bind(this)}
                >
                    <div className={styles.TransferSchool}>
                        {!loading && statusType == 2 ? (
                            <div
                                style={{
                                    textAlign: 'center',
                                    height: '120px',
                                    lineHeight: '120px',
                                }}
                            >
                                <Spin />
                            </div>
                        ) : (
                            <Form {...formItemLayout}>
                                <Form.Item label={trans('student.startDate', '休学开始时间')}>
                                    {getFieldDecorator('startDate', {
                                        rules: [
                                            {
                                                required: true,
                                                message: `${trans(
                                                    'student.startDate',
                                                    '休学开始时间'
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
                                <Form.Item label={trans('student.endDate', '预计结束时间')}>
                                    {getFieldDecorator('endDate', {
                                        rules: [
                                            {
                                                required: true,
                                                message: `${trans(
                                                    'student.endDate',
                                                    '预计结束时间'
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
                                <Form.Item label={trans('student.suspensionAnnex', '休学附件')}>
                                    <Upload {...propsUpload}>
                                        <Button
                                            style={{ paddingLeft: '12px', borderRadius: '20px' }}
                                        >
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
                                            onClick={this.handleSubmit.bind(this)}
                                            type="primary"
                                            className={styles.btn}
                                        >
                                            {trans('global.confirm', '确定')}
                                        </Button>
                                    </div>
                                </Form.Item>
                            </Form>
                        )}
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
                            {trans('student.successfully.suspension', '设置休学成功')}
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

export default SuspensionSchool;
