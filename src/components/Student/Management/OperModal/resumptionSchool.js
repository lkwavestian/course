//复学学生
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './commonModal.less';
import { Modal, Form, TreeSelect, Input, Upload, Button, Icon } from 'antd';
import { trans } from '../../../../utils/i18n';

@Form.create()
@connect((state) => ({
    addStudentGradeList: state.student.addStudentGradeList, //行政班年级
}))
class ResumptionSchool extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isJump: false,
            newFileId: [],
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.resumptionSchoolVisible != this.props.resumptionSchoolVisible) {
            if (nextProps.resumptionSchoolVisible) {
                //获取行政班
                this.getAdminClass();
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

    handleCancel = () => {
        const { hideModal, form } = this.props;
        typeof hideModal == 'function' && hideModal.call(this, 'resumptionSchool');
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
            if (!values.orgId) {
                return;
            }
            dispatch({
                type: 'student/submitResumptionSchool',
                payload: {
                    userId: this.props.record.userId,
                    nodeId: values.orgId,
                    fileIdList: this.state.newFileId,
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

    gotoSee = () => {
        let _this = this;
        this.setState(
            {
                isJump: false,
            },
            () => {
                requestAnimationFrame(() => {
                    _this.props.switchNavList('0', 1);
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
        let { resumptionSchoolVisible, addStudentGradeList } = this.props;
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
        const treeProps = {
            showSearch: true,
            treeData: this.formatTreeData(addStudentGradeList),
            dropdownStyle: { maxHeight: 400, overflow: 'auto' },
            placeholder: trans('student.searchOrg', '请搜索或选择组织'),
            treeNodeFilterProp: 'title',
            treeDefaultExpandAll: true,
            className: styles.selectPersonStyle,
        };
        return (
            <div>
                <Modal
                    visible={resumptionSchoolVisible}
                    title={trans('student.resumption', '复学')}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <div className={styles.TransferSchool}>
                        <Form {...formItemLayout}>
                            <Form.Item label={trans('student.administrativeClassShow', '行政班')}>
                                {getFieldDecorator('orgId', {
                                    rules: [
                                        {
                                            required: true,
                                            message: trans('student.searchOrg', '请搜索或选择组织'),
                                        },
                                    ],
                                })(<TreeSelect {...treeProps} />)}
                            </Form.Item>
                            <Form.Item label={trans('student.resumptionAnnex', '复学附件')}>
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
                            {trans('student.successfully.resumption', '设置复学成功')}
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

export default ResumptionSchool;
