//课程管理
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Icon, Radio, Spin, Modal, Checkbox } from 'antd';
import styles from './index.less';
import { routerRedux } from 'dva/router';
import { trans } from '../../../utils/i18n';
import { getUrlSearch } from '../../../utils/utils';
import { numMulti } from '../../../utils/utils';
import { locale } from '../../../utils/i18n';
import * as dd from 'dingtalk-jsapi';

@connect((state) => ({
    // previewContent: state.mobilePay.detailContent, // 详情
    previewContent: state.mobilePay.detailContent, // 详情
    payList: state.mobilePay.payList, // 请求支付方式
    submitPayMsg: state.mobilePay.submitPayMsg,
}))
export default class PayDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showPayWay: false,
            fundChannel: '',
            payType: 1,
            loading: true,
            isModal: false,
            useBalance: false,
        };
    }

    componentWillMount() {
        document.getElementsByTagName('title')[0].innerText = '缴费订单';
        // dd.biz.navigation.setTitle({
        //     title: `${trans('pay.title_detail', '缴费详情')}`, //控制标题文本，空字符串表示显示默认文本
        // });
    }

    componentDidMount() {
        // this.dingControl();
        const { dispatch } = this.props;
        let hash = window.location.hash;
        let delay = null;
        if (hash.indexOf('delay') > -1) {
            delay = hash.split('delay=')[1];
            if (delay.indexOf('&') > -1) {
                delay = delay.split('&')[0];
            }
            this.setState({
                isModal: true,
                loading: false,
            });
            setTimeout(() => {
                window.location.hash = `${hash.split('&delay=')[0]}`;
                window.location.reload();
            }, parseInt(delay));
        } else {
            dispatch({
                type: 'mobilePay/getOrderInfoByOrderId',
                payload: {
                    orderNo: getUrlSearch('tuitionOrderNo'),
                    orderPlanId: getUrlSearch('tuitionPlan'),
                },
            }).then(() => {
                this.setState({
                    loading: false,
                });
            });
        }
    }

    dingControl = () => {
        dd.biz.navigation.setRight({
            show: true, //控制按钮显示， true 显示， false 隐藏， 默认true
            control: false, //是否控制点击事件，true 控制，false 不控制， 默认false
            text: '', //控制显示文本，空字符串表示显示默认文本
            onSuccess: () => {},

            onFail: function (err) {},
        });
    };
    //返回列表
    goList = () => {
        const { previewContent } = this.props;
        if (previewContent && previewContent.tuitionType == 1) {
            let iframeUrlMan =
                window.location.origin.indexOf('yungu.org') > -1
                    ? `https://wisdomeg.yungu.org/exteriorCourse?hash=course/student/detailMobile&type=1#/course/student/detailMobile`
                    : `https://wisdomeg.daily.yungu-inc.org/exteriorCourse?hash=course/student/detailMobile&type=1#/course/student/detailMobile`;
            window.location.href = iframeUrlMan;
        } else {
            let iframeUrlMan =
                window.location.origin.indexOf('yungu.org') > -1
                    ? `https://smart-scheduling.yungu.org/?/mobilePay/index/#/mobilePay/index`
                    : `https://smart-scheduling.daily.yungu-inc.org/?/mobilePay/index/#/mobilePay/index`;
            window.location.href = iframeUrlMan;
        }
    };
    // 点击’去支付‘选择支付方式
    goPay = () => {
        const { dispatch, previewContent } = this.props;
        let payNumber = previewContent.arrearsOfMoney - previewContent.userWalletAmount;
        payNumber = payNumber.toFixed(2);
        console.log('payNumber', payNumber);
        const { useBalance } = this.state;
        if (useBalance && payNumber > 0) {
            dispatch({
                type: 'mobilePay/useBalance',
                payload: {
                    deductionAmount:
                        previewContent &&
                        previewContent.arrearsOfMoney &&
                        previewContent.userWalletAmount &&
                        parseFloat(previewContent.arrearsOfMoney) >
                            parseFloat(previewContent.userWalletAmount)
                            ? previewContent.userWalletAmount
                            : previewContent.arrearsOfMoney,
                    orderNo: getUrlSearch('tuitionOrderNo'),
                },
            });
            dispatch({
                type: 'mobilePay/getPayWay',
                payload: {
                    orderNo: getUrlSearch('tuitionOrderNo'),
                },
            }).then(() => {
                const { payList, previewContent } = this.props;
                let fundChannel = '';
                let payType = 1;
                let data =
                    payList &&
                    payList.map((li) => {
                        if (li.channelName == '支付宝' && !li.use) {
                            li.checked = true;
                            fundChannel = li.id;
                        }
                        if (previewContent.submitType === 2 && !li.use) {
                            // 当前支付方式是网银并且可选情况下，默认勾选网银
                            li.checked = true;
                            fundChannel = li.id;
                            payType = li.payType;
                        }
                        return li;
                    });
                this.setState({
                    showPayWay: true,
                    payList: data,
                    fundChannel,
                    payType,
                });
            });
            return;
        } else if (!useBalance) {
            if (previewContent.arrearsOfMoney && parseFloat(previewContent.arrearsOfMoney) > 0) {
                dispatch({
                    type: 'mobilePay/getPayWay',
                    payload: {
                        orderNo: getUrlSearch('tuitionOrderNo'),
                    },
                }).then(() => {
                    const { payList, previewContent } = this.props;
                    let fundChannel = '';
                    let payType = 1;
                    let data =
                        payList &&
                        payList.map((li) => {
                            if (li.channelName == '支付宝' && !li.use) {
                                li.checked = true;
                                fundChannel = li.id;
                            }
                            if (previewContent.submitType === 2 && !li.use) {
                                // 当前支付方式是网银并且可选情况下，默认勾选网银
                                li.checked = true;
                                fundChannel = li.id;
                                payType = li.payType;
                            }
                            return li;
                        });
                    this.setState({
                        showPayWay: true,
                        payList: data,
                        fundChannel,
                        payType,
                    });
                });
            } else {
                location.reload();
            }

            return;
        } else if (useBalance) {
            dispatch({
                type: 'mobilePay/useBalance',
                payload: {
                    deductionAmount:
                        previewContent &&
                        previewContent.arrearsOfMoney &&
                        previewContent.userWalletAmount &&
                        parseFloat(previewContent.arrearsOfMoney) >
                            parseFloat(previewContent.userWalletAmount)
                            ? previewContent.userWalletAmount
                            : previewContent.arrearsOfMoney,
                    orderNo: getUrlSearch('tuitionOrderNo'),
                },
            }).then(() => {
                if (payNumber <= 0) {
                    location.reload();
                }
            });

            return;
        }
    };

    // 返回到详情页面
    goBack = () => {
        this.setState({
            showPayWay: false,
        });
    };

    // 切换支付方式
    changePayWay = (item, e) => {
        let data =
            this.props.payList &&
            this.props.payList.map((li) => {
                if (item.id == li.id) {
                    li.checked = true;
                } else {
                    li.checked = false;
                }
                return item;
            });
        this.setState({
            payList: data,
            fundChannel: item.id,
            payType: item.payType,
        });
    };

    confirmPay = () => {
        const { dispatch, previewContent } = this.props;
        const { fundChannel, payType, useBalance } = this.state;
        if (payType === 2) {
            dispatch(
                routerRedux.push({
                    pathname: '/eBank/index',
                    search: `tuitionPlan=${getUrlSearch('tuitionPlan')}&orderNo=${getUrlSearch(
                        'tuitionOrderNo'
                    )}&payType=${payType}&fundChannel=${fundChannel}&amount=${
                        previewContent && previewContent.totalAmount
                    }`,
                })
            );
            return;
        }

        dispatch({
            type: 'mobilePay/detailExport',
            payload: {
                detailContent: this.props.previewContent,
            },
        });
        //getUrlSearch('tuitionType')
        dispatch(
            routerRedux.push({
                pathname: '/wdConfirmPay/index',
                search: `tuitionPlan=${getUrlSearch(
                    'tuitionPlan'
                )}&fundChannel=${fundChannel}&payType=${payType}&previewContent=${
                    previewContent.payType
                }&isUseBalance=${useBalance}&deductionAmount=${
                    useBalance
                        ? parseFloat(previewContent.arrearsOfMoney) >
                          parseFloat(previewContent.userWalletAmount)
                            ? Number(previewContent.userWalletAmount) +
                              Number(previewContent.deductionAmount)
                            : Number(previewContent.arrearsOfMoney) &&
                              Number(previewContent.userWalletAmount) &&
                              Number(previewContent.userWalletAmount) -
                                  Number(previewContent.arrearsOfMoney) +
                                  Number(previewContent.deductionAmount)
                        : previewContent.deductionAmount || '0.00'
                }`,
            })
        );
    };

    confirmPayHtml = () => {
        const { priceValue, showPayWay, useBalance } = this.state;
        const { payList, previewContent } = this.props;
        let payNumber = previewContent.arrearsOfMoney - previewContent.userWalletAmount;
        payNumber = payNumber.toFixed(2);
        if (payList) {
            for (let index = 0; index < payList.length; index++) {
                if (payList[index].channelName.indexOf('线下转账') > -1) {
                    payList.splice(index, 1);
                }
            }
        }
        return (
            <div className={styles.confirm}>
                <span
                    className={styles.cover}
                    style={{ display: showPayWay ? 'block' : 'none' }}
                ></span>
                <div
                    className={styles.confirmPayWay}
                    style={showPayWay ? { height: '23.825rem' } : { height: '0px' }}
                >
                    <span className={styles.titleAndIcon}>
                        <span className={styles.icon} onClick={this.goBack}>
                            <Icon type="left" />
                        </span>
                        <span className={styles.title}>{trans('pay.payment', '选择支付方式')}</span>
                    </span>
                    <span className={styles.payPrice}>
                        {useBalance
                            ? `¥ ${payNumber}`
                            : previewContent &&
                              previewContent.arrearsOfMoney &&
                              `¥ ${previewContent.arrearsOfMoney}`}
                    </span>
                    <ul className={styles.payWay}>
                        {payList &&
                            payList.length &&
                            payList.map((item, index) => {
                                return (
                                    <li className={styles.item} key={index}>
                                        <span className={styles.avatar}>
                                            <img src={item.avatar} />
                                        </span>
                                        <span className={styles.name}>
                                            {locale() === 'en'
                                                ? item.channelEname
                                                : item.channelName}
                                        </span>
                                        <span className={styles.radio}>
                                            <Radio
                                                checked={item.checked}
                                                disabled={item.use}
                                                onChange={this.changePayWay.bind(this, item)}
                                            ></Radio>
                                        </span>
                                    </li>
                                );
                            })}
                    </ul>
                    <span className={styles.btn} onClick={this.confirmPay}>
                        {trans('pay.confirm', '确认')}
                    </span>
                </div>
            </div>
        );
    };

    changeUseBalance = (e) => {
        this.setState({
            useBalance: e.target.checked,
        });
    };

    render() {
        const { previewContent } = this.props;

        const { showPayWay, loading, isModal, useBalance } = this.state;

        let aa =
            parseFloat(previewContent.arrearsOfMoney) >=
            parseFloat(previewContent.userWalletAmount);
        console.log('arrearsOfMoney', previewContent.arrearsOfMoney);
        console.log('userWalletAmount', previewContent.userWalletAmount);
        console.log('aa', aa);

        let payNumber = previewContent.arrearsOfMoney - previewContent.userWalletAmount;
        payNumber = payNumber.toFixed(2);
        if (loading) {
            return (
                <div className={styles.loading}>
                    <Spin tip="Loading..." />
                </div>
            );
        }
        // 支付方式为支付宝&（存在正在缴费中||支付完成||正在支付中||关闭）
        // const isDisabled =
        // previewContent.payOrderStatus == 3 || previewContent.payOrderStatus == 5 ||
        // (previewContent.submitType === 1 &&
        //     (previewContent.payStatus ||
        //     previewContent.payOrderStatus == 4)
        // )
        const isDisabled =
            previewContent.payStatus ||
            previewContent.payOrderStatus == 3 ||
            previewContent.payOrderStatus == 4 ||
            previewContent.payOrderStatus == 5;

        return this.state.isModal ? (
            <Modal visible={isModal} footer={null} closable={false}>
                <div style={{ textAlign: 'center' }}>支付等待中...</div>
            </Modal>
        ) : (
            <div
                className={styles.payDetail}
                style={{ height: useBalance ? '75vh' : '90vh', overflow: 'scroll' }}
            >
                <div className={styles.previewContent}>
                    <div className={styles.head}>
                        <span className={styles.title}>
                            {previewContent &&
                                (locale() === 'en'
                                    ? previewContent.orderEnBillTitle
                                    : previewContent.orderBillTitle)}
                        </span>
                        {previewContent &&
                            (previewContent.payStatus ? (
                                <div className={styles.head}>
                                    {trans(
                                        'pay.againlater',
                                        '目前有家长正在缴费过程中，请稍后再试。'
                                    )}
                                </div>
                            ) : previewContent.payOrderStatus == 1 ? (
                                <span className={styles.payNot}>
                                    {trans('pay.payNot', '待付款')}
                                </span>
                            ) : previewContent.payOrderStatus == 2 ? (
                                <span className={styles.head}>
                                    {trans('pay.partPay', '部分缴费')}
                                </span>
                            ) : previewContent.payOrderStatus == 3 ? (
                                <span className={styles.payedHead}>
                                    {trans('pay.payed', '支付完成')}
                                </span>
                            ) : previewContent.payOrderStatus == 4 ? (
                                <span className={styles.head}>
                                    {trans('pay.againlater', '正在支付中')}
                                </span>
                            ) : previewContent.payOrderStatus == 5 ? (
                                <span className={styles.head}>{trans('pay.close', '关闭')}</span>
                            ) : (
                                <span className={styles.head}></span>
                            ))}
                    </div>
                    <div className={styles.msg}>
                        <span className={styles.item}>
                            <span className={styles.label}>
                                {trans('pay.userName', '学生姓名')}
                            </span>
                            <span>{previewContent && previewContent.orderUserName}</span>
                        </span>
                        <span className={styles.item}>
                            <span className={styles.label}>
                                {trans('pay.sendTime', '发送日期')}
                            </span>
                            <span>{previewContent && previewContent.dingSendTime}</span>
                        </span>
                        {/* <span className={styles.item}><span className={styles.label}>{trans('pay.deadLine','截至日期')}</span><span>{previewContent && previewContent.deadline}</span></span> */}
                        <span className={styles.item}>
                            <span className={styles.label}>{trans('pay.orderNo', '订单号')}</span>
                            <span>{previewContent && previewContent.orderNo}</span>
                        </span>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.cardList}>
                            {previewContent &&
                                previewContent.payChargeItemList &&
                                previewContent.payChargeItemList.map((item, index) => {
                                    return (
                                        <div className={styles.item} key={index}>
                                            <span className={styles.itemPrice}>
                                                <span className={styles.title}>
                                                    {previewContent && previewContent.payOrderName
                                                        ? `${previewContent.payOrderName}  `
                                                        : null}
                                                    {locale() === 'en'
                                                        ? item.ename
                                                        : item.payChargeItemName}
                                                </span>
                                                <span className={styles.price}>
                                                    <span className={styles.unitPrice}>
                                                        ￥{parseFloat(item.price).toFixed(2)}
                                                    </span>
                                                    <span className={styles.amount}>
                                                        x{item.quantity ? item.quantity : 1}
                                                    </span>
                                                </span>
                                            </span>
                                            {/* <span className={styles.add}>
                                            ￥{numMulti(item.price,item.quantity).toFixed(2)}
                                        </span> */}
                                        </div>
                                    );
                                })}
                        </div>
                        <span className={styles.aboutPrice}>
                            <span className={styles.total}>
                                <span style={{ marginRight: '9.5rem' }}>
                                    {trans('pay.amount', '合计')}
                                </span>
                                ￥{previewContent && previewContent.totalAmount}
                            </span>
                            {previewContent && previewContent.deductionAmount != '0.00' && (
                                <span className={styles.total}>
                                    <span style={{ marginRight: '9.5rem' }}>
                                        {trans('pay.balanceDeduting', '余额抵扣')}
                                    </span>
                                    ￥{(previewContent && previewContent.deductionAmount) || '0.00'}
                                </span>
                            )}
                            {/* {previewContent && previewContent.payOrderStatus !== 1 && ( */}
                            <span className={styles.total}>
                                <span style={{ marginRight: '9.5rem' }}>
                                    {trans('pay.realPaid', '实付款')}：
                                </span>
                                ￥{(previewContent && previewContent.realPayAmount) || '0.00'}
                            </span>
                            {/* )} */}
                            {/* {previewContent && previewContent.payOrderStatus !== 1 && (
                                <span className={styles.total}>
                                    <span style={{ marginRight: '9.5rem' }}>
                                        {trans('pay.paid', '已支付')}：
                                    </span>
                                    ￥{(previewContent && previewContent.totalAmountPaid) || '0.00'}
                                </span>
                            )} */}
                            {/* {previewContent && previewContent.payOrderStatus !== 1 && ( */}
                            <span className={styles.total}>
                                <span style={{ marginRight: '9.5rem' }}>
                                    {trans('pay.outstanding', '欠缴')}：
                                </span>
                                ￥{(previewContent && previewContent.arrearsOfMoney) || '0.00'}
                            </span>
                            {/* )} */}
                        </span>
                    </div>

                    <div className={styles.mention}>
                        <span className={styles.label}>{trans('pay.description', '费用说明')}</span>
                        <span className={styles.text}>
                            {previewContent &&
                                (locale() === 'en'
                                    ? previewContent.enDescription
                                    : previewContent.zhDescription)}
                        </span>
                    </div>
                </div>
                <span className={styles.placeholder}></span>
                <div className={styles.fixedStyle}>
                    {previewContent &&
                    previewContent.canUseWallet &&
                    previewContent.userWalletAmount != '0.00' ? (
                        previewContent.payOrderStatus == 3 ? null : (
                            <div>
                                <p>学生账户余额：¥{previewContent.userWalletAmount}</p>
                                <p>
                                    <Checkbox
                                        checked={useBalance}
                                        onChange={this.changeUseBalance}
                                    />
                                    使用余额抵扣：¥
                                    {previewContent &&
                                    previewContent.arrearsOfMoney &&
                                    previewContent.userWalletAmount &&
                                    parseFloat(previewContent.arrearsOfMoney) >=
                                        parseFloat(previewContent.userWalletAmount)
                                        ? previewContent.userWalletAmount
                                        : previewContent.arrearsOfMoney}
                                </p>
                            </div>
                        )
                    ) : null}
                    <span className={styles.payBtn}>
                        {previewContent && previewContent.payOrderStatus == 3 ? null : (
                            <span className={styles.arrearsOfMoney}>
                                <span className={styles.price}>
                                    ￥
                                    {useBalance
                                        ? previewContent &&
                                          previewContent.arrearsOfMoney &&
                                          previewContent.userWalletAmount &&
                                          parseFloat(previewContent.arrearsOfMoney) >=
                                              parseFloat(previewContent.userWalletAmount)
                                            ? payNumber
                                            : '0.00'
                                        : previewContent && previewContent.arrearsOfMoney}{' '}
                                </span>
                                <span className={styles.text}>
                                    {trans('pay.arrearsOfMoney', '需支付')}
                                </span>
                            </span>
                        )}

                        {previewContent && previewContent.payOrderStatus == 3 ? (
                            <Button
                                className={styles.btn}
                                onClick={this.goList}
                                type="primary"
                                style={
                                    previewContent && previewContent.payOrderStatus == 3
                                        ? { marginLeft: '67%' }
                                        : null
                                }
                            >
                                {trans('pay.goList', '返回列表')}
                            </Button>
                        ) : (
                            <Button
                                className={styles.btn}
                                onClick={this.goPay}
                                type="primary"
                                disabled={isDisabled}
                                style={
                                    previewContent && previewContent.payOrderStatus == 3
                                        ? { marginLeft: '67%' }
                                        : null
                                }
                            >
                                {trans('pay.readyPay', '立即支付')}
                            </Button>
                        )}
                    </span>
                </div>

                {this.confirmPayHtml()}
            </div>
        );
    }
}
