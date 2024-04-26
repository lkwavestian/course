import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Modal, Button, message, Form, Radio, Input, InputNumber, Tooltip } from 'antd';
import { trans, locale } from '../../../utils/i18n';

const lang = locale() != 'en' ? true : false;

@Form.create()
@connect((state) => ({
    cancelFee: state.courseBaseDetail.cancelFee,
    chooseCourseDetails: state.choose.chooseCourseDetails,
}))
export default class CancelSignUp extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            radioVal: undefined, //订单处理结果
            pricePayload: [], //修改金额参数
            tempPriceList: [], //修改金额参数备份
            refundAmount: undefined,
            cancelMessage: undefined,
            isDisabled: false,
            tempList: [],
        };
    }

    componentDidUpdate(prevProps, prevState) {
        const {flag} = this.props;
        if ((flag == 1 && JSON.parse(JSON.stringify(this.props.cancelFee)) != '{}' && prevProps.cancelFee != this.props.cancelFee)) {
            const {
                cancelFee,
                record: { id: studentChooseCourseId },
            } = this.props;
            let tempPriceList = [];
            let total = 0;
            let paid = 0;
            if (
                cancelFee &&
                cancelFee.showFeePaidModelList &&
                cancelFee.showFeePaidModelList.length &&
                cancelFee.showFeePaidModelList.length > 0
            ) {
                cancelFee.showFeePaidModelList.map((el, idx) => {
                    total += Number(el.amount);
                    paid += Number(el.payAmount);
                    if (el.studentChooseRelationId == studentChooseCourseId) {
                        tempPriceList.push({
                            price: el.price,
                            payChargeItemId: el.payChargeItemId,
                        });
                    }
                });
            }
            this.setState({
                pricePayload: tempPriceList,
                tempList: tempPriceList,
                total,
                paid,
            });
        }
    }

    componentDidMount(){
        const {flag,cancelFee} = this.props;
        console.log(flag,'sksks')
        if(flag == 2 && cancelFee){
            const {
                cancelFee,
                record: { id: studentChooseCourseId },
            } = this.props;
            let tempPriceList = [];
            let total = 0;
            let paid = 0;
            if (
                cancelFee &&
                cancelFee.showFeePaidModelList &&
                cancelFee.showFeePaidModelList.length &&
                cancelFee.showFeePaidModelList.length > 0
            ) {
                cancelFee.showFeePaidModelList.map((el, idx) => {
                    total += Number(el.amount);
                    paid += Number(el.payAmount);
                    if (el.studentChooseRelationId == studentChooseCourseId) {
                        tempPriceList.push({
                            price: el.price,
                            payChargeItemId: el.payChargeItemId,
                        });
                    }
                });
            }
            this.setState({
                pricePayload: tempPriceList,
                tempList: tempPriceList,
                total,
                paid,
            });
        }
    }

    onOk = () => {
        const {
            dispatch,
            record: { id: studentChooseCourseId, userId },
            toggleCancelSignUpVisible,
            getStudentTable,
            chooseCoursePlanId,
            form: { validateFieldsAndScroll },
            cancelFee,
            chooseCourseDetails: { mergeOrder },
        } = this.props;
        const { refundAmount, cancelMessage, pricePayload, radioVal } = this.state;
        let isPayload = false;
        if (cancelFee.payStatus == 3 || cancelFee.payStatus == 2) {
            isPayload = true;
        }
        console.log('cancelFee: ', cancelFee.payStatus);
        validateFieldsAndScroll((err, fieldsValue) => {
            if (!err) {
                if(cancelFee.payStatus != 2 && cancelFee.payStatus != 3 && typeof cancelFee.payStatus != 'undefined' ){
                    if(!radioVal){
                        message.warn('请选择订单处理结果');
                        return
                    }
                }
                dispatch({
                    type: 'courseBaseDetail/cancelSignUp',
                    payload: {
                        chooseCoursePlanId,
                        studentChooseCourseId,
                        userId,
                        ...fieldsValue,
                        refundAmount: isPayload && mergeOrder == 2 ? refundAmount : undefined,
                        cancelMessage,
                        updatePayTuitionOrderItemModelList: radioVal == 1 ? [] : pricePayload,
                    },
                    onSuccess: () => {
                        message.success('取消报名成功');
                        this.setState({
                            refundAmount: undefined,
                            radioVal: undefined,
                            updatePayTuitionOrderItemModelList: [],
                        });
                    },
                }).then(() => {
                    typeof toggleCancelSignUpVisible == 'function' && toggleCancelSignUpVisible();
                    typeof getStudentTable == 'function' && getStudentTable();
                });
            }
        });
    };

    onCancel = () => {
        const { toggleCancelSignUpVisible } = this.props;
        typeof toggleCancelSignUpVisible == 'function' && toggleCancelSignUpVisible();
        this.setState({
            radioVal: undefined,
        })
    };

    getCancelFeeAbout = (type) => {
        const { cancelFee } = this.props;
        let number = 0;
        if (type === 'html') {
            return cancelFee.showFeePaidModelList?.map((item, index) => (
                <span className={index !== 0 ? styles.chargeItem : ''}>
                    {item.chargeItemName} {item.payAmount} 元
                </span>
            ));
        }
        if (type === 'number') {
            cancelFee.showFeePaidModelList?.forEach((item) => {
                number = number + Number(item.payAmount);
            });

            return number;
        }
    };

    changeRadio = (e) => {
        if (this.state.radioVal == 2 && e.target.value == 1) {
            this.setState({
                pricePayload: this.state.tempList,
            });
        }
        this.setState({
            radioVal: e.target.value,
        });
    };

    isDelStyle = (el, id) => {
        if (el.studentChooseRelationId == id) {
            return 'line-through';
        } else {
            return 'none';
        }
    };

    changeVal = (index, e) => {
        let tempList = JSON.parse(JSON.stringify(this.state.pricePayload));
        tempList[index].price = e.target.value;
        this.setState({
            pricePayload: tempList,
        });
    };

    changeRefund = (e) => {
        const { paid } = this.state;
        if (e.target.value > paid) {
            this.setState({
                isDisabled: true,
            });
            // message.warn(`退款金额应小于已付金额，已付${paid}`)
        } else {
            this.setState({
                isDisabled: false,
                refundAmount: e.target.value,
            });
        }
        // this.setState({
        //     refundAmount:e.target.value
        // })
    };

    changeArea = (e) => {
        this.setState({
            cancelMessage: e.target.value,
        });
    };

    render() {
        const {
            form: { getFieldDecorator, getFieldValue },
            visible,
            record: { payStatus, id: studentChooseCourseId },
            cancelFee,
            chooseCourseDetails: { mergeOrder, choosePayType },
        } = this.props;

        let { radioVal, pricePayload, isDisabled } = this.state;

        let chTemplate = (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span>{`中文模版/Chinese Template：`}</span>
                <span>{`<学生姓名>家长您好：`}</span>
                <span>{`管理员已取消您报名的<班级名称>。`}</span>
                <span>{`取消原因：<用户填写的取消原因，未填时此行不显示>`}</span>
            </div>
        );

        let enTemplate = (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span>{`英文模版/English Template：`}</span>
                <span>{`Dear <Student’s English Name>’s parents,`}</span>
                <span>{`The administrator has cancelled your registration of <Class Name>`}</span>
                <span>{`Reason：<Reason filled in by user. If it is not filled in, this line will not be displayed>`}</span>
            </div>
        );

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
        return (
            <Modal
                title="取消报名"
                visible={visible}
                layout={'horizontal'}
                onOk={this.onOk}
                onCancel={this.onCancel}
                wrapClassName={styles.cancelModal}
                width={560}
                destroyOnClose={true}
                // forceRender={true}
            >
                <Form {...formItemLayout}>
                    {/* {payStatus === 3 && (
                        <Form.Item label="已支付金额">
                            <span className={styles.hadPaid}>{this.getCancelFeeAbout('html')}</span>{' '}
                        </Form.Item>
                    )} */}
                    {/* {payStatus === 3 && (
                        <Form.Item
                            label="需退款金额"
                            className={styles.refundAmount}
                            extra={
                                <span style={{ color: '#f5222d' }}>
                                    退款金额将同步到收费系统，由财务通过线下渠道退回
                                </span>
                            }
                        >
                            {getFieldDecorator('refundAmount', {
                                rules: [
                                    {
                                        required: true,
                                        message: '退款金额为必填项',
                                    },
                                    {
                                        validator: (rule, value, callback) => {
                                            let cancelFeeNumber = this.getCancelFeeAbout('number');
                                            if (value && value > cancelFeeNumber) {
                                                callback('需退款金额不允许大于已支付总金额');
                                            } else {
                                                callback();
                                            }
                                        },
                                    },
                                ],
                            })(<InputNumber min={0} />)}
                            <span style={{ marginLeft: '10px' }}>元</span>
                        </Form.Item>
                    )} */}

                    <Form.Item label="通知家长">
                        {getFieldDecorator('notice', {
                            rules: [
                                {
                                    required: true,
                                    message: '通知家长为必填项',
                                },
                            ],
                        })(
                            <Radio.Group>
                                <Radio value={true}>通知家长</Radio>
                                <Radio value={false}>不通知家长</Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>
                    {getFieldValue('notice') && (
                        <Form.Item label="通知模板">
                            {getFieldDecorator('noticeTemplate', {
                                rules: [
                                    {
                                        required: true,
                                        message: '通知模板为必填项',
                                    },
                                ],
                            })(
                                <Radio.Group>
                                    <Radio value={0}>中文模板</Radio>
                                    <Radio value={1}>英文模板</Radio>
                                </Radio.Group>
                            )}
                            

                            <Tooltip
                                title={
                                    getFieldValue('noticeTemplate') === 1 ? enTemplate : chTemplate
                                }
                                overlayClassName={styles.noticeTemplateTooltip}
                            >
                                <span className={styles.noticeTemplate}>查看通知模板</span>
                            </Tooltip>
                        </Form.Item>
                    )}
                    {/* {getFieldValue('notice') && ( */}
                    <Form.Item label="取消原因" className={styles.cancelReason}>
                        {getFieldDecorator('cancelMessage')(
                            <Input.TextArea placeholder="选填（选择通知家长时会附带在通知内容中）" />
                        )}
                    </Form.Item>
                    {/* )} */}
                    {cancelFee &&
                    cancelFee.showFeePaidModelList &&
                    cancelFee.showFeePaidModelList.length > 0 ? (
                        <div className={styles.conStyle}>
                            <div className={styles.relationOrder}>
                                <span>关联收费订单:</span>
                                <span>
                                    {cancelFee.showFeePaidModelList.map((el, idx) => {
                                        if (idx % 2 == 0) {
                                            let tempIdx = idx;
                                            return (
                                                <>
                                                    {idx == 0 && (
                                                        <p
                                                            className={styles.detailStyle}
                                                            style={{ fontWeight: 600 }}
                                                        >
                                                            <span>{cancelFee.payPlanName}</span>
                                                            <span
                                                                style={{ color: 'rgb(234,148,65)' }}
                                                            >
                                                                {cancelFee.payStatus == 1
                                                                    ? '待支付'
                                                                    : cancelFee.payStatus == 2
                                                                    ? '部分支付'
                                                                    : cancelFee.payStatus == 3
                                                                    ? '支付完成'
                                                                    : ''}
                                                            </span>
                                                        </p>
                                                    )}

                                                    <p className={styles.detailStyle}>
                                                        <span>
                                                            {
                                                                cancelFee.showFeePaidModelList[
                                                                    tempIdx
                                                                ].payChargeItemName
                                                            }
                                                        </span>
                                                        <span>
                                                            {(
                                                                Number(el.price) *
                                                                Number(el.discount) *
                                                                Number(el.quantity)
                                                            ).toFixed(2)}
                                                        </span>
                                                    </p>
                                                    <p className={styles.detailStyle}>
                                                        <span>
                                                            {
                                                                cancelFee.showFeePaidModelList[
                                                                    tempIdx + 1
                                                                ].payChargeItemName
                                                            }
                                                        </span>
                                                        <span>
                                                            {(
                                                                Number(
                                                                    cancelFee.showFeePaidModelList[
                                                                        tempIdx + 1
                                                                    ].price
                                                                ) *
                                                                Number(
                                                                    cancelFee.showFeePaidModelList[
                                                                        tempIdx + 1
                                                                    ].discount
                                                                ) *
                                                                Number(cancelFee.showFeePaidModelList[
                                                                    tempIdx + 1
                                                                ].quantity)
                                                            ).toFixed(2)}
                                                        </span>
                                                    </p>
                                                </>
                                            );
                                        }
                                    })}
                                    {cancelFee.payStatus == 2 ||
                                    (cancelFee.payStatus == 3 && mergeOrder != 1) ? (
                                        <p style={{ float: 'right' }}>{`已支付${
                                            this.state.paid
                                        } 欠缴${this.state.total - this.state.paid}`}</p>
                                    ) : null}
                                </span>
                            </div>
                            {cancelFee.payStatus == 2 || cancelFee.payStatus == 3 ? null : (
                                <div className={styles.orderStyle}>
                                    <span>
                                        订单处理结果:<span style={{ color: 'red' }}>*</span>
                                    </span>
                                    <span>
                                        <Radio.Group
                                            style={{ display: 'block' }}
                                            onChange={this.changeRadio}
                                            value={radioVal}
                                        >
                                            <Radio value={1}>取消订单</Radio>
                                            <Radio value={2}>修改订单金额</Radio>
                                        </Radio.Group>
                                        {/* 1和合并，2是分拆 */}
                                        {radioVal == 1 && mergeOrder == 1 && choosePayType != 2 ? (
                                            <>
                                                <div className={styles.detailCard}>
                                                    {cancelFee.showFeePaidModelList.map(
                                                        (el, idx) => {
                                                            if (idx % 2 == 0) {
                                                                let tempIdx = idx;
                                                                return (
                                                                    <>
                                                                        {idx == 0 && (
                                                                            <p
                                                                                className={
                                                                                    styles.detailStyle
                                                                                }
                                                                                style={{
                                                                                    fontWeight: 600,
                                                                                }}
                                                                            >
                                                                                <span>
                                                                                    {
                                                                                        cancelFee.payPlanName
                                                                                    }
                                                                                </span>
                                                                                <span
                                                                                    style={{
                                                                                        color: 'rgb(234,148,65)',
                                                                                    }}
                                                                                ></span>
                                                                            </p>
                                                                        )}

                                                                        <p
                                                                            className={
                                                                                styles.detailStyle
                                                                            }
                                                                        >
                                                                            <span
                                                                                style={{
                                                                                    textDecoration:
                                                                                        this.isDelStyle(
                                                                                            el,
                                                                                            studentChooseCourseId
                                                                                        ),
                                                                                    color: 'red',
                                                                                }}
                                                                            >
                                                                                <span
                                                                                    style={{
                                                                                        color: 'rgba(0,0,0,0.65)',
                                                                                    }}
                                                                                >
                                                                                    {
                                                                                        cancelFee
                                                                                            .showFeePaidModelList[
                                                                                            tempIdx
                                                                                        ]
                                                                                            .payChargeItemName
                                                                                    }
                                                                                </span>
                                                                            </span>
                                                                            <span
                                                                                style={{
                                                                                    textDecoration:
                                                                                        this.isDelStyle(
                                                                                            el,
                                                                                            studentChooseCourseId
                                                                                        ),
                                                                                    color: 'red',
                                                                                }}
                                                                            >
                                                                                <span
                                                                                    style={{
                                                                                        color: 'rgba(0,0,0,0.65)',
                                                                                    }}
                                                                                >
                                                                                    {el.price}
                                                                                </span>
                                                                            </span>
                                                                        </p>
                                                                        <p
                                                                            className={
                                                                                styles.detailStyle
                                                                            }
                                                                        >
                                                                            <span
                                                                                style={{
                                                                                    textDecoration:
                                                                                        this.isDelStyle(
                                                                                            cancelFee
                                                                                                .showFeePaidModelList[
                                                                                                tempIdx +
                                                                                                    1
                                                                                            ],
                                                                                            studentChooseCourseId
                                                                                        ),
                                                                                    color: 'red',
                                                                                }}
                                                                            >
                                                                                <span
                                                                                    style={{
                                                                                        color: 'rgba(0,0,0,0.65)',
                                                                                    }}
                                                                                >
                                                                                    {
                                                                                        cancelFee
                                                                                            .showFeePaidModelList[
                                                                                            tempIdx +
                                                                                                1
                                                                                        ]
                                                                                            .payChargeItemName
                                                                                    }
                                                                                </span>
                                                                            </span>
                                                                            <span
                                                                                style={{
                                                                                    textDecoration:
                                                                                        this.isDelStyle(
                                                                                            cancelFee
                                                                                                .showFeePaidModelList[
                                                                                                tempIdx +
                                                                                                    1
                                                                                            ],
                                                                                            studentChooseCourseId
                                                                                        ),
                                                                                    color: 'red',
                                                                                }}
                                                                            >
                                                                                <span
                                                                                    style={{
                                                                                        color: 'rgba(0,0,0,0.65)',
                                                                                    }}
                                                                                >
                                                                                    {
                                                                                        cancelFee
                                                                                            .showFeePaidModelList[
                                                                                            tempIdx +
                                                                                                1
                                                                                        ].price
                                                                                    }
                                                                                </span>
                                                                            </span>
                                                                        </p>
                                                                    </>
                                                                );
                                                            }
                                                        }
                                                    )}
                                                </div>
                                                <p>
                                                    由于订单为合并订单，取消订单时，系统会删除被取消课程相关的收费项，其他课程的收费项保留
                                                </p>
                                            </>
                                        ) : radioVal == 2 ? (
                                            <>
                                                <div className={styles.detailCard}>
                                                    {cancelFee.showFeePaidModelList.map(
                                                        (el, idx) => {
                                                            if (idx % 2 == 0) {
                                                                let tempIdx = idx;

                                                                return (
                                                                    <>
                                                                        {idx == 0 && (
                                                                            <p
                                                                                className={
                                                                                    styles.detailStyle
                                                                                }
                                                                                style={{
                                                                                    fontWeight: 600,
                                                                                }}
                                                                            >
                                                                                <span>
                                                                                    {
                                                                                        cancelFee.payPlanName
                                                                                    }
                                                                                </span>
                                                                                <span
                                                                                    style={{
                                                                                        color: 'rgb(234,148,65)',
                                                                                    }}
                                                                                ></span>
                                                                            </p>
                                                                        )}

                                                                        <p
                                                                            className={
                                                                                styles.detailStyle
                                                                            }
                                                                        >
                                                                            <span>
                                                                                <span
                                                                                    style={{
                                                                                        color: 'rgba(0,0,0,0.65)',
                                                                                    }}
                                                                                >
                                                                                    {
                                                                                        cancelFee
                                                                                            .showFeePaidModelList[
                                                                                            tempIdx
                                                                                        ]
                                                                                            .payChargeItemName
                                                                                    }
                                                                                </span>
                                                                            </span>
                                                                            <span>
                                                                                <span
                                                                                    style={{
                                                                                        color: 'rgba(0,0,0,0.65)',
                                                                                    }}
                                                                                >
                                                                                    {el.studentChooseRelationId ==
                                                                                    studentChooseCourseId ? (
                                                                                        <>
                                                                                            <Input
                                                                                                style={{
                                                                                                    width: 70,
                                                                                                    height: 24,
                                                                                                }}
                                                                                                value={
                                                                                                    pricePayload &&
                                                                                                    pricePayload.length >
                                                                                                        0 &&
                                                                                                    pricePayload[0]
                                                                                                        .price
                                                                                                }
                                                                                                onChange={(
                                                                                                    e
                                                                                                ) =>
                                                                                                    this.changeVal(
                                                                                                        0,
                                                                                                        e
                                                                                                    )
                                                                                                }
                                                                                            />
                                                                                            x
                                                                                            {
                                                                                                el.quantity
                                                                                            }
                                                                                            x
                                                                                            {
                                                                                                el.discount
                                                                                            }
                                                                                            =
                                                                                            <span>
                                                                                                {pricePayload &&
                                                                                                    pricePayload.length >
                                                                                                        0 &&
                                                                                                    (
                                                                                                        pricePayload[0]
                                                                                                            .price *
                                                                                                        Number(
                                                                                                            el.quantity
                                                                                                        ) *
                                                                                                        Number(
                                                                                                            el.discount
                                                                                                        )
                                                                                                    ).toFixed(
                                                                                                        2
                                                                                                    )}
                                                                                            </span>
                                                                                        </>
                                                                                    ) : (
                                                                                        el.price
                                                                                    )}
                                                                                </span>
                                                                            </span>
                                                                        </p>
                                                                        <p
                                                                            className={
                                                                                styles.detailStyle
                                                                            }
                                                                        >
                                                                            <span>
                                                                                <span
                                                                                    style={{
                                                                                        color: 'rgba(0,0,0,0.65)',
                                                                                    }}
                                                                                >
                                                                                    {
                                                                                        cancelFee
                                                                                            .showFeePaidModelList[
                                                                                            tempIdx +
                                                                                                1
                                                                                        ]
                                                                                            .payChargeItemName
                                                                                    }
                                                                                </span>
                                                                            </span>
                                                                            <span>
                                                                                <span
                                                                                    style={{
                                                                                        color: 'rgba(0,0,0,0.65)',
                                                                                    }}
                                                                                >
                                                                                    {cancelFee
                                                                                        .showFeePaidModelList[
                                                                                        tempIdx + 1
                                                                                    ]
                                                                                        .studentChooseRelationId ==
                                                                                    studentChooseCourseId ? (
                                                                                        <>
                                                                                            <Input
                                                                                                style={{
                                                                                                    width: 70,
                                                                                                    height: 24,
                                                                                                }}
                                                                                                value={
                                                                                                    pricePayload &&
                                                                                                    pricePayload.length >
                                                                                                        0 &&
                                                                                                    pricePayload[1]
                                                                                                        .price
                                                                                                }
                                                                                                onChange={(
                                                                                                    e
                                                                                                ) =>
                                                                                                    this.changeVal(
                                                                                                        1,
                                                                                                        e
                                                                                                    )
                                                                                                }
                                                                                            />
                                                                                            x
                                                                                            {
                                                                                                cancelFee
                                                                                                    .showFeePaidModelList[
                                                                                                    tempIdx +
                                                                                                        1
                                                                                                ]
                                                                                                    .quantity
                                                                                            }
                                                                                            x
                                                                                            {
                                                                                                cancelFee
                                                                                                    .showFeePaidModelList[
                                                                                                    tempIdx +
                                                                                                        1
                                                                                                ]
                                                                                                    .discount
                                                                                            }
                                                                                            =
                                                                                            <span>
                                                                                                {pricePayload &&
                                                                                                    pricePayload.length >
                                                                                                        0 &&
                                                                                                    (
                                                                                                        pricePayload[1]
                                                                                                            .price *
                                                                                                        Number(
                                                                                                            cancelFee
                                                                                                                .showFeePaidModelList[
                                                                                                                tempIdx +
                                                                                                                    1
                                                                                                            ]
                                                                                                                .quantity
                                                                                                        ) *
                                                                                                        Number(
                                                                                                            cancelFee
                                                                                                                .showFeePaidModelList[
                                                                                                                tempIdx +
                                                                                                                    1
                                                                                                            ]
                                                                                                                .discount
                                                                                                        )
                                                                                                    ).toFixed(
                                                                                                        2
                                                                                                    )}
                                                                                            </span>
                                                                                        </>
                                                                                    ) : (
                                                                                        cancelFee
                                                                                            .showFeePaidModelList[
                                                                                            tempIdx +
                                                                                                1
                                                                                        ].price
                                                                                    )}
                                                                                </span>
                                                                            </span>
                                                                        </p>
                                                                    </>
                                                                );
                                                            }
                                                        }
                                                    )}
                                                </div>
                                            </>
                                        ) : null}
                                    </span>
                                </div>
                            )}

                            {cancelFee.payStatus == 2 || cancelFee.payStatus == 3 ? (
                                mergeOrder == 2 ? (
                                    <div className={styles.dealOrder}>
                                        <div className={styles.refundStyle}>
                                            <span>
                                                需退款金额:<span style={{ color: 'red' }}>*</span>
                                            </span>
                                            <span>
                                                <Input
                                                    onChange={this.changeRefund}
                                                    value={this.state.refundAmount}
                                                    style={{ width: 70 }}
                                                />
                                                元{' '}
                                                <spann style={{ color: 'red' }}>
                                                    {isDisabled &&
                                                        `退款金额应小于已付金额，已付${this.state.paid}`}
                                                </spann>
                                            </span>
                                        </div>
                                        {/* <div className={styles.cancelStyle}>
                                        <span>取消原因:<span style={{color:'red'}}>*</span></span>
                                        <span><Input.TextArea onChange={this.changeArea} value={this.state.cancelMessage} style={{width:'450px'}} placeholder="选填（选择通知家长时会附带在通知内容中）" /></span>
                                    </div> */}
                                        <div className={styles.dealStyle}>
                                            <span>
                                                退款处理方式:<span style={{ color: 'red' }}>*</span>
                                            </span>
                                            <span>
                                                <Radio checked={true}>
                                                    标记退款金额，由财务人工处理退款
                                                </Radio>
                                            </span>
                                        </div>
                                    </div>
                                ) : mergeOrder == 1 ? (
                                    <div style={{ marginLeft: 175 }}>
                                        由于订单模式为合并订单，并且家长已支付，如需退费请联系财务进行处理
                                    </div>
                                ) : null
                            ) : null}
                        </div>
                    ) : null}
                </Form>
            </Modal>
        );
    }
}
