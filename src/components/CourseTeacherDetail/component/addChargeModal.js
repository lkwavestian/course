import React, { Fragment } from 'react';
import { Button, message, Modal } from 'antd';
import { connect } from 'dva';
import styles from './addChargeModal.less';
import icon from '../../../icon.less';
import { Link } from 'dva/router';
import { trans } from '../../../utils/i18n';
@connect((state) => ({
    createPayTuitionPlanResult: state.course.createPayTuitionPlanResult,
}))
class AddChargeModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: this.props.isDisplay, //modal显示或隐藏
            okText: '确认生成收费单', // 确定按钮文案
            processed: true, // 控制收费单框和成功框
            isFirstChange: true, //是否第一次创建
            isSendParents: true, //是否已发送家长
            planId: this.props.planId, //id
            visibleRepeat: false, //二次提交modal框显隐
            repeatDisable: false, //二次提交成功modal显隐
            canCreatePayPlan: false, //是否可以生成
            generateVisible: false, //收费单生成中Modal
            payPlanId: '',
            confirmLoading: false,
        };
    }
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'course/getCheckPayTuitionPlan',
            payload: {
                chooseCoursePlanId: this.state.planId,
            },
            onSuccess: (res) => {
                if (res.first) {
                } else {
                    this.setState({
                        canCreatePayPlan: res.canCreatePayPlan, //是否能创建
                        isFirstChange: res.canCreatePayPlan ? true : false, //是否第一次创建
                        isSendParents: res.alreadySendMsg, //true是已经发送家长
                        payPlanId: res.payPlanId && res.payPlanId,
                    });
                }
            },
        });
        this.judgePayTuitionPlanResult();
    }
    handleOk = () => {
        const { dispatch } = this.props;

        this.judgePayTuitionPlanResult().then(() => {
            const { createPayTuitionPlanResult } = this.props;
            if (
                !createPayTuitionPlanResult &&
                !Number(localStorage.getItem('createPayTuitionPlanResult'))
            ) {
                this.setState({
                    okText: '确认生成收费单',
                    generateVisible: true,
                });
            } else {
                this.setState(
                    {
                        confirmLoading: true,
                        okText: '收费单生成中...',
                    },
                    () => {
                        dispatch({
                            type: 'course/getCreatePayTuitionPlan',
                            payload: {
                                chooseCoursePlanId: this.state.planId,
                            },
                            onSuccess: (res) => {
                                this.setState({
                                    payPlanId: res,
                                    okText: '确认生成收费单',
                                    processed: false,
                                    confirmLoading: false,
                                });
                            },
                            onError: () => {
                                this.setState({
                                    okText: '确认生成收费单',
                                    confirmLoading: false,
                                });
                            },
                        });
                    }
                );
            }
        });
    };
    handleCancel = () => {
        this.props.ifRefresh(false);
        this.setState({
            visibleRepeat: false,
            repeatDisable: false,
        });
    };

    //前往收费系统
    // goCharge = () => {
    //     window.location.href = `${window.location.origin}/exam#/studentTest/${paperId}/true/${publishId}`;
    // }

    //重新生成收费单
    repeatOnchange = () => {
        this.props.ifRefresh(false);
        this.setState({
            visibleRepeat: true,
        });
    };
    repeatOk = () => {
        const { dispatch } = this.props;
        if (this.state.isSendParents) {
            message.error('收费通知已发送给家长，不允许重新生成');
        } else {
            this.judgePayTuitionPlanResult().then(() => {
                const { createPayTuitionPlanResult } = this.props;
                if (
                    !createPayTuitionPlanResult &&
                    !Number(localStorage.getItem('createPayTuitionPlanResult'))
                ) {
                    this.setState({
                        okText: '确认生成收费单',
                        generateVisible: true,
                    });
                } else {
                    this.setState(
                        {
                            confirmLoading: true,
                            okText: '收费单生成中...',
                        },
                        () => {
                            dispatch({
                                type: 'course/getReCreatePayTuitionPlan',
                                payload: {
                                    chooseCoursePlanId: this.state.planId,
                                },
                                onSuccess: (res) => {
                                    this.setState({
                                        confirmLoading: false,
                                        okText: '确认生成收费单',
                                        processed: false,
                                        visibleRepeat: false,
                                        repeatDisable: true,
                                        payPlanId: res,
                                    });
                                },
                                onError: () => {
                                    this.setState({
                                        okText: '确认生成收费单',
                                        confirmLoading: false,
                                    });
                                },
                            });
                        }
                    );
                }
            });
        }
    };
    firstFound = (value) => {
        const { createPayTuitionPlanResult } = this.props;
        const { visible, okText, processed, confirmLoading } = this.state;
        return (
            <>
                {processed ? (
                    <Modal
                        title="生成收费单"
                        visible={this.props.isDisplay}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        destroyOnClose={true}
                        maskClosable={false}
                        okText={okText}
                        className={styles.generate}
                        confirmLoading={confirmLoading}
                    >
                        <p className={styles.modalValue}>
                            系统将根据每个学生的报名情况及课程费用，生成收费单，生成后您可进入收费系统查看并发起收费通知
                        </p>
                    </Modal>
                ) : (
                    <Modal
                        title="生成收费单"
                        visible={this.props.isDisplay}
                        onCancel={this.handleCancel}
                        destroyOnClose={true}
                        maskClosable={false}
                        footer={null}
                    >
                        <div className={styles.modalTitle}>
                            <i className={icon.iconfont}>&#xe73f;</i>
                        </div>
                        <div className={styles.modalValue}>
                            <p>收费单生成成功，前往收费单查看并发起收费通知</p>
                        </div>

                        {/* <div
                            className={styles.toCharge}
                            onClick={() => this.props.switchTab(4, this.state.payPlanId)}
                        >
                            <a>前往收费系统</a>
                        </div> */}
                    </Modal>
                )}
            </>
        );
    };
    repeatFound = () => {
        return (
            <>
                <Modal
                    title="生成收费单"
                    visible={this.props.isDisplay}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                    maskClosable={false}
                    footer={
                        <Button
                            onClick={this.repeatOnchange}
                            type="primary"
                            style={{
                                height: '36px',
                                borderRadius: '8px',
                                color: '#fff',
                                backgroundColor: '#3B6FF5',
                            }}
                        >
                            {trans('global.Regenerate bills', '重新生成收费单')}
                        </Button>
                    }
                >
                    <div className={styles.modalValue}>
                        <p>
                            收费单已生成。收费通知未发送给家长前，若学生选课结果或者课程费用有变动，可重新生成生成收费单
                        </p>
                    </div>
                </Modal>
            </>
        );
    };

    judgePayTuitionPlanResult = () => {
        const { dispatch } = this.props;
        const { planId } = this.state;
        return dispatch({
            type: 'course/createPayTuitionPlanResult',
            payload: {
                chooseCoursePlanId: planId,
            },
        });
    };

    render() {
        const { createPayTuitionPlanResult } = this.props;
        const {
            isFirstChange,
            visibleRepeat,
            okText,
            repeatDisable,
            payPlanId,
            generateVisible,
            confirmLoading,
        } = this.state;
        return (
            <>
                {isFirstChange ? this.firstFound() : this.repeatFound()}
                {visibleRepeat && (
                    <Modal
                        title="生成收费单"
                        visible={visibleRepeat}
                        onOk={this.repeatOk}
                        onCancel={this.handleCancel}
                        destroyOnClose={true}
                        maskClosable={false}
                        okText={okText}
                        className={styles.generate}
                        confirmLoading={confirmLoading}
                    >
                        <p className={styles.modalValue}>
                            系统将根据每个学生的报名情况及课程费用，生成收费单，生成后您可进入收费系统查看并发起收费通知
                        </p>
                    </Modal>
                )}

                {repeatDisable && (
                    <Modal
                        title="生成收费单"
                        visible={repeatDisable}
                        onCancel={this.handleCancel}
                        destroyOnClose={true}
                        maskClosable={false}
                        footer={null}
                    >
                        <div className={styles.modalTitle}>
                            <i className={icon.iconfont}>&#xe73f;</i>
                        </div>
                        <div className={styles.modalValue}>
                            <p>收费单生成成功，前往收费单查看并发起收费通知</p>
                        </div>

                        {/* <div
                            className={styles.toCharge}
                            onClick={() => this.props.switchTab(4, this.state.payPlanId)}
                        >
                            <a>前往收费系统</a>
                        </div> */}
                    </Modal>
                )}

                {generateVisible && (
                    <Modal
                        title="生成收费单"
                        visible={generateVisible}
                        onCancel={() =>
                            this.setState({
                                generateVisible: false,
                            })
                        }
                        destroyOnClose={true}
                        footer={
                            <Button
                                style={{
                                    height: '36px',
                                    borderRadius: '8px',
                                    color: '#01113da6',
                                    backgroundColor: '#01113d12',
                                    border: '0',
                                }}
                            >
                                收费单生成中...
                            </Button>
                        }
                    >
                        <div className={styles.modalValue} style={{ marginBottom: '60px' }}>
                            系统正在生成收费单，请耐心等待
                        </div>
                    </Modal>
                )}
            </>
        );
    }
}
export default AddChargeModal;
