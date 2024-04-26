//club列表
import React, { PureComponent } from 'react';
import styles from './closeOrder.less';
import { Modal, Form, Input, Select, Button, message, Upload, Spin, Icon } from 'antd';
import { connect } from 'dva';
import { loginRedirect } from '../../utils/utils';
import { trans } from '../../utils/i18n';

const { Option } = Select;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

@connect((state) => ({
    closeMsg: state.pay.closeMsg,
    fileResponse: state.pay.fileResponse, // 关闭表单上传附件
}))
@Form.create()
export default class CloseOrder extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            reasonValue: 1, // 关闭原因value
            fileid: '', // 上传附件返回的id存储，提交时需传
            fileLists: [],
            previewImg: '', // 预览的url
            loading: false, //上传loading
        };
    }

    componentDidMount() {
        const { isOpen } = this.props;
        if (isOpen) {
            this.setState({
                visible: true,
            });
        }
    }

    cancel = () => {
        // 通知父组件关闭
        this.props.handleOpen(1);
        this.setState({
            visible: false,
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log(values, 'values');
            if (!err) {
                // console.log('Received values of form: ', values);
                this.props
                    .dispatch({
                        type: 'pay/addPayCloseOrderInfo',
                        payload: {
                            type: values.reason,
                            orderNo: this.props.orderNo,
                            reqPrice:
                                this.props.record.payStatus == 2 ? values.reqPrice : values.price,
                            bankName: values.bankName,
                            bankCardNo: values.bankCardNo,
                            remark: values.remark,
                            fileid: this.state.fileid,
                        },
                    })
                    .then(() => {
                        const { closeMsg } = this.props;
                        if (closeMsg.status) {
                            message.success(closeMsg.message);
                            //通知父组件关闭
                            this.props.handleOpen(2);
                            this.setState({
                                visible: false,
                            });
                        }
                    });
            }
        });
    };

    handleCancel = () => {
        this.props.handleOpen(1);
        this.setState({
            visible: false,
        });
    };

    selectChange = (value) => {
        this.setState({
            reasonValue: value,
        });
    };

    beforeUpload = (file) => {
        const isLt2M = file.size / 1024 / 1024 < 30;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isLt2M;
    };

    uploadFile = ({ file, fileList }) => {
        console.log(file, 'file', fileList, 'fileList');
        if (file.response && !file.response.ifLogin) {
            loginRedirect();
            return;
        }
        if (file.status) {
            fileList = fileList.slice(-1);
            this.setState(
                {
                    fileLists: fileList,
                },
                () => {
                    if (file.status === 'uploading') {
                        this.setState({
                            loading: true,
                        });
                    }
                    if (file.status === 'done') {
                        const uploadResponse = file && file.response && file.response.content;
                        this.setState({
                            fileid:
                                uploadResponse && uploadResponse.length && uploadResponse[0].fileId,
                            previewImg:
                                uploadResponse && uploadResponse.length && uploadResponse[0].url,
                            loading: false,
                        });
                    }
                }
            );
        }
    };

    // 预览删除
    handleCancelUpload = () => {
        this.setState({
            fileid: '',
            previewImg: '',
            fileLists: [],
        });
    };

    render() {
        const { orderPrice, record } = this.props;
        const { visible, reasonValue, fileLists, previewImg, loading } = this.state;
        const { getFieldDecorator } = this.props.form;
        console.log(record, 'record');
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 24,
                    // offset: 8,
                },
            },
        };

        const uploadProps = {
            name: 'file',
            action: '/api/upload_file',
            // method:'get',
        };
        return (
            <div>
                <Modal footer={null} visible={visible} onCancel={this.cancel} destroyOnClose>
                    <div className={styles.close}>
                        <p className={styles.title}>{trans('charge.closeOrder', '关闭订单')}</p>
                        <Form
                            className={styles.form}
                            {...formItemLayout}
                            onSubmit={this.handleSubmit}
                        >
                            <Form.Item label={trans('charge.closeReason', '关闭原因')}>
                                {getFieldDecorator('reason', {
                                    rules: [
                                        {
                                            required: false,
                                            message: trans('charge.pCloseReason', '请选择关闭原因'),
                                        },
                                    ],
                                    initialValue: 1,
                                })(
                                    <Select onChange={this.selectChange}>
                                        <Option value={1}>
                                            {trans('charge.closeChannel', '已在其他渠道缴费')}
                                        </Option>
                                        <Option value={2}>
                                            {trans(
                                                'charge.closeStatus',
                                                '无需继续缴费（如转学、退学等）'
                                            )}
                                        </Option>
                                    </Select>
                                )}
                            </Form.Item>
                            {reasonValue == 1 ? (
                                record && record.payStatus == 1 ? (
                                    <div>
                                        <Form.Item label="实收金额">
                                            {getFieldDecorator('price', {
                                                initialValue: orderPrice,
                                            })(<span>￥{orderPrice}</span>)}
                                        </Form.Item>
                                        <Form.Item label="缴费银行">
                                            {getFieldDecorator('bankName', {
                                                rules: [{ required: false, message: '请输入' }],
                                            })(<Input placeholder="请输入家长缴费的银行名称" />)}
                                        </Form.Item>
                                        <Form.Item label="缴费卡号">
                                            {getFieldDecorator('bankCardNo', {
                                                rules: [{ required: false, message: '请输入' }],
                                            })(
                                                <Input placeholder="请输入实际收到家长缴费的银行卡号" />
                                            )}
                                        </Form.Item>
                                    </div>
                                ) : (
                                    <div>
                                        <Form.Item
                                            label={trans('charge.payableAmount', '应缴金额')}
                                        >
                                            {<span>￥{orderPrice}</span>}
                                        </Form.Item>
                                        <Form.Item label={trans('charge.paidAmount', '已缴金额')}>
                                            {<span>￥{record.actualPrice}</span>}
                                        </Form.Item>
                                        <Form.Item
                                            label={trans('charge.transferAmount', '线下转账金额')}
                                        >
                                            {getFieldDecorator('reqPrice', {
                                                initialValue: record.priceChange,
                                            })(<Input />)}
                                        </Form.Item>
                                        <Form.Item label="缴费银行">
                                            {getFieldDecorator('bankName', {
                                                rules: [{ required: false, message: '请输入' }],
                                            })(<Input placeholder="请输入家长缴费的银行名称" />)}
                                        </Form.Item>
                                        <Form.Item label="缴费卡号">
                                            {getFieldDecorator('bankCardNo', {
                                                rules: [{ required: false, message: '请输入' }],
                                            })(
                                                <Input placeholder="请输入实际收到家长缴费的银行卡号" />
                                            )}
                                        </Form.Item>
                                    </div>
                                )
                            ) : null}
                            <Form.Item label={trans('charge.remark', '备注')}>
                                {getFieldDecorator(
                                    'remark',
                                    {}
                                )(<Input placeholder={trans('charge.pRemark', '请输入备注')} />)}
                            </Form.Item>
                            <Form.Item label={trans('charge.file', '上传附件')}>
                                {getFieldDecorator(
                                    'file',
                                    {}
                                )(
                                    <div>
                                        <Upload
                                            {...uploadProps}
                                            onChange={this.uploadFile}
                                            beforeUpload={this.beforeUpload}
                                            fileList={fileLists}
                                            showUploadList={false}
                                            accept="image/png,image/jpeg,image/jpg,image/jpe,.pdf"
                                            loading={true}
                                        >
                                            <Button type="default" className={styles.default}>
                                                {trans('charge.addFile', '添加附件')}
                                            </Button>
                                        </Upload>
                                        {previewImg ? (
                                            <div className={styles.previewImg}>
                                                <span
                                                    className={styles.previewClose}
                                                    onClick={this.handleCancelUpload}
                                                >
                                                    X
                                                </span>
                                                <img src={window.location.origin + previewImg} />
                                            </div>
                                        ) : null}
                                        {loading ? <Spin indicator={antIcon} /> : null}
                                    </div>
                                )}
                            </Form.Item>
                            <Form.Item {...tailFormItemLayout} className={styles.btn}>
                                <Button
                                    type="default"
                                    className={styles.default}
                                    onClick={this.handleCancel}
                                >
                                    {trans('charge.cancel', '取消')}
                                </Button>
                                <Button
                                    htmlType="submit"
                                    loading={loading}
                                    type="primary"
                                    className={styles.primary}
                                >
                                    {trans('charge.isClose', '确认关闭')}
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Modal>
            </div>
        );
    }
}
