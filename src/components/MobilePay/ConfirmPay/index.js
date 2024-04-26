//课程管理
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Button, Icon, Radio, message } from 'antd';
import styles from './index.less';
import { routerRedux } from 'dva/router';
import { trans } from '../../../utils/i18n';
import { getUrlSearch } from '../../../utils/utils';
import { numMulti } from '../../../utils/utils';
import { locale } from '../../../utils/i18n';
import * as dd from 'dingtalk-jsapi';
import VConsole from 'vconsole';

@connect((state) => ({
    importDetailContent: state.mobilePay.importDetailContent,
    submitPayMsg: state.mobilePay.submitPayMsg,
    // limitContent: state.mobilePay.limitContent,
}))
export default class ConfirmPay extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            priceValue: '',
            detailContent: undefined,
            isError: false,
            isShowLimits: false,
            isCancel: false,
            isSubmit: false,
            isUseBalance: getUrlSearch('isUseBalance'),
            deductionAmount: '',
            device: '',
        };
    }

    componentWillMount() {
        let device = getUrlSearch('device');

        if (device == 'dingtalk') {
            dd.biz.navigation.setTitle({
                title: `${trans('pay.title_confirm', '确认订单')}`, //控制标题文本，空字符串表示显示默认文本
            });
        } else if (device == 'micromessenger') {
            document.getElementsByTagName('title')[0].innerText = '确认订单';
        }
        this.setState({
            device,
        });

        let tempNumber = getUrlSearch('deductionAmount');
        tempNumber = parseFloat(tempNumber);
        this.setState({
            deductionAmount: tempNumber.toFixed(2),
        });
    }

    componentDidMount() {
        // let vConsole = new VConsole();
        const { detailContent } = this.props.importDetailContent;
        let value = '';
        if (detailContent) {
            value = JSON.stringify(detailContent) || '';
            sessionStorage.setItem('detailContent', value);
        }
        value = sessionStorage.getItem('detailContent') || '{}';
        value = JSON.parse(value);
        let tempUseBalance = getUrlSearch('isUseBalance');
        let tempDedition = getUrlSearch('deductionAmount');
        console.log('totalAmount', value.totalAmount);

        let payNumber = value && value.totalAmount - tempDedition;
        console.log('payNumber', payNumber);
        if (value && value.realPayAmount) {
            payNumber = payNumber - value.realPayAmount;
        }
        payNumber = !isNaN(payNumber) && payNumber.toFixed(2);

        this.setState({
            detailContent: value,
            priceValue:
                tempUseBalance == 'true'
                    ? value && parseFloat(value.totalAmount) >= parseFloat(tempDedition)
                        ? payNumber
                        : '0.00'
                    : value && value.arrearsOfMoney,

            // value && value.arrearsOfMoney
            //     ? value && value.arrearsOfMoney
            //     : value && value.totalAmount,
        });
        let device = getUrlSearch('device');
        if (device == 'dingtalk') {
            this.dingControl(); // 钉钉控制
        }
    }

    dingControl = () => {
        dd.biz.navigation.setRight({
            show: true, //控制按钮显示， true 显示， false 隐藏， 默认true
            control: true, //是否控制点击事件，true 控制，false 不控制， 默认false
            text: `${trans('pay.confirmCancel', '取消支付')}`, //控制显示文本，空字符串表示显示默认文本
            onSuccess: () => {
                //如果control为true，则onSuccess将在发生按钮点击事件被回调
                this.setState({
                    isCancel: true,
                });
            },
            onFail: function (err) {},
        });
    };

    // 获取银行限额内容
    // getLimitContent = () => {
    //     const { dispatch } = this.props;
    //     dispatch({
    //         type: 'mobilePay/fastPaymentLimit'
    //     })
    // }

    handlePriceChange = (arrears, allPrice, e) => {
        let value = e.target.value;
        let { isUseBalance, deductionAmount } = this.state;
        let tempNumber = 0;
        if (isUseBalance && allPrice) {
            tempNumber = allPrice - deductionAmount;
        }
        if (isNaN(parseFloat(value || 0))) {
            return false;
        }
        if (isUseBalance) {
            if (arrears && parseFloat(value) > parseFloat(tempNumber)) {
                this.setState({
                    isError: true,
                });
            } else {
                this.setState({
                    isError: false,
                });
            }
            this.setState({
                priceValue: value,
            });
        } else {
            if (
                (arrears && parseFloat(value) > parseFloat(arrears)) ||
                (!arrears && parseFloat(value) > parseFloat(allPrice))
            ) {
                this.setState({
                    isError: true,
                });
            } else {
                this.setState({
                    isError: false,
                });
            }
            this.setState({
                priceValue: value,
            });
        }
    };

    inputTotalPrice = (arrears, allPrice) => {
        this.setState({
            priceValue: arrears ? arrears : allPrice,
            isError: false,
        });
    };

    submitPay = () => {
        if (this.state.isSubmit) {
            return;
        }
        const { dispatch } = this.props;
        const { priceValue, detailContent } = this.state;
        let fundChannel = getUrlSearch('fundChannel');
        let tuitionPlan = getUrlSearch('tuitionPlan');
        let exp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
        if (!priceValue) {
            message.error(`${trans('pay.enterAmount', '请输入付款金额')}`);
            return;
        }
        if (!exp.test(priceValue)) {
            message.info(`${trans('pay.decimal', '付款金额请保留两位小数')}`);
            return;
        }

        this.setState(
            {
                isSubmit: true,
            },
            () => {
                dispatch({
                    type: 'mobilePay/submitPay',
                    payload: {
                        orderPlanId: tuitionPlan ? JSON.parse(tuitionPlan) : 0,
                        orderNo: detailContent.orderNo,
                        amountActuallyPaid: priceValue,
                        fundChannel: fundChannel ? JSON.parse(fundChannel) : 0,
                        payType: JSON.parse(getUrlSearch('payType')),
                    },
                }).then(() => {
                    const { submitPayMsg } = this.props;
                    console.log('submitPayMsg', submitPayMsg, JSON.parse(getUrlSearch('payType')));
                    if (JSON.parse(getUrlSearch('payType')) == 4) {
                        window.location.href = submitPayMsg.content
                    }else{
                        if (submitPayMsg.status) {
                            if (
                                submitPayMsg &&
                                submitPayMsg.content &&
                                submitPayMsg.content.indexOf('form') > -1
                            ) {
                                let divForm = document.getElementsByTagName('divform');
                                if (divForm.length) {
                                    document.body.removeChild(divForm[0]);
                                }
                                const div = document.createElement('divform');
                                div.innerHTML = submitPayMsg.content;
                                document.body.appendChild(div);
                                console.log('content', submitPayMsg.content);
                                console.log('orderId', detailContent.orderId);
                                if (schoolId && schoolId.toString() === '1') {
                                    document.forms[0] && document.forms[0].submit();
                                } else {
                                    // document.querySelector('[name=punchout_form]').getAttribute('action')
                                    // document.querySelector('[name=biz_content]').value
                                    // var queryParam = '';
                                    // queryParam += 'bizcontent=' + encodeURIComponent(document.querySelector('[name=biz_content]').value);
                                    // var gotoUrl = document.querySelector('[name=punchout_form]').getAttribute('action') + '&' + queryParam;
                                    //  _AP.pay(gotoUrl);
                                    _AP.pay(submitPayMsg.content, detailContent.orderId);
                                }
    
                                this.setState({
                                    isSubmit: false,
                                });
                            } else {
                                message.success(submitPayMsg.message);
                                this.setState({
                                    isSubmit: false,
                                });
    
                                window.location.href = `https://d.alipay.com/i/index2.htm?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FappId%3D20000067%26url%3Dhttps%253A%252F%252Fopenauth.alipay.com%252Foauth2%252FpublicAppAuthorize.htm%253Fapp_id%253D2016112803504802%2526scope%253Dauth_base%2526redirect_uri%253Dhttps%253A%252F%252Fk12jiaofei.alipay-eco.com%252Fcallback%252Fhome%253Ftype%253D7%2526isvNo%253D5d6e2391dc5e354578231107%2526orderno%253D${submitPayMsg.content}`;
                                dd.biz.navigation.setRight({
                                    show: true, //控制按钮显示， true 显示， false 隐藏， 默认true
                                    control: false, //是否控制点击事件，true 控制，false 不控制， 默认false
                                    text: '', //控制显示文本，空字符串表示显示默认文本
                                    onSuccess: () => {},
                                    onFail: function (err) {},
                                });
                            }
                        } else {
                        }
                    }
                    // // debugger;
                    
                });
            }
        );
    };

    viewLimit = (status) => {
        this.setState({
            isShowLimits: status,
        });
    };

    backPay = () => {
        this.setState({
            isCancel: false,
        });
    };

    goDetail = (item) => {
        const { dispatch } = this.props;
        const { detailContent } = this.state;
        dispatch(
            routerRedux.push({
                pathname: '/payDetail/index',
                search: `tuitionPlan=${getUrlSearch('tuitionPlan')}&tuitionOrderNo=${
                    detailContent && detailContent.orderNo
                }`,
            })
        );

        // window.location.href = `/payDetail/index?orderNo=${item.orderNo}&orderPlanId=${item.orderPlanId}&gdingDingNoticeId=${item.gdingDingNoticeId}`
    };

    render() {
        const {
            isSubmit,
            detailContent,
            isError,
            isShowLimits,
            priceValue,
            isCancel,
            isUseBalance,
            deductionAmount,
            device,
        } = this.state;

        let payNumber = detailContent && (detailContent.totalAmount - deductionAmount);
        console.log(detailContent, /* detailContent.totalAmount,  deductionAmount, detailContent.totalAmountPaid, payNumber, */'payNumber')
        if (detailContent && detailContent.realPayAmount) {
            payNumber = payNumber - detailContent.realPayAmount;
        }
        console.log(payNumber, 'payNumber')
        payNumber = !isNaN(payNumber) && payNumber.toFixed(2);
        console.log(payNumber, 'payNumber')

        const { limitContent } = this.props;
        return (
            <div className={styles.confirmPay}>
                <div className={styles.cardAndTitle} style={{ height: '75vh', overflow: 'scroll' }}>
                    <span className={styles.title}>
                        {detailContent &&
                            (locale() === 'en'
                                ? trans('pay.confirmTitle', '的收费明细') +
                                  detailContent.orderUserName
                                : detailContent.orderUserName +
                                  trans('pay.confirmTitle', '的收费明细'))}
                    </span>
                    <div className={styles.cardList}>
                        {detailContent &&
                            detailContent.payChargeItemList &&
                            detailContent.payChargeItemList.map((item, index) => {
                                return (
                                    <div className={styles.item} key={index}>
                                        <span className={styles.itemPrice}>
                                            <span className={styles.title}>
                                                {detailContent && detailContent.payOrderName}&nbsp;
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
                                        <span className={styles.add}>
                                            ￥{numMulti(item.price, item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                );
                            })}
                    </div>
                    <span className={styles.aboutPrice}>
                        <span className={styles.total}>
                            <span className={styles.label}>{trans('pay.amount', '合计')}</span>
                            {detailContent && (
                                <span
                                    style={{
                                        color:
                                            isError && !detailContent.arrearsOfMoney
                                                ? '#e5492e'
                                                : '#333',
                                    }}
                                >
                                    ￥{detailContent.totalAmount || '0.00'}
                                </span>
                            )}
                        </span>
                        {deductionAmount != '0.00' ? (
                            <span className={styles.total}>
                                <span className={styles.label}>
                                    {trans('pay.balanceDeduting', '余额抵扣')}
                                </span>
                                {detailContent && (
                                    <span
                                        style={{
                                            color:
                                                isError && !detailContent.arrearsOfMoney
                                                    ? '#e5492e'
                                                    : '#333',
                                        }}
                                    >
                                        ￥{deductionAmount || '0.00'}
                                    </span>
                                )}
                            </span>
                        ) : null}

                        <span className={styles.total}>
                            <span className={styles.label}>
                                {trans('pay.realPaid', '实付款')}：
                            </span>
                            ￥{(detailContent && detailContent.realPayAmount) || '0.00'}
                        </span>
                        <span className={styles.total}>
                            <span className={styles.label}>
                                {trans('pay.outstanding', '欠缴')}：
                            </span>
                            {detailContent && (
                                <span
                                    style={{
                                        color:
                                            isError && detailContent.arrearsOfMoney
                                                ? '#e5492e'
                                                : '#333',
                                    }}
                                >
                                    ￥
                                    {
                                        // detailContent.arrearsOfMoney || '0.00'
                                        isUseBalance == 'true'
                                            ? detailContent &&
                                              parseFloat(detailContent.totalAmount) >=
                                                  parseFloat(deductionAmount)
                                                ? payNumber
                                                : '0.00'
                                            : detailContent && detailContent.arrearsOfMoney
                                    }
                                </span>
                            )}
                        </span>
                    </span>
                </div>
                <span className={styles.placeholder}></span>
                <div className={styles.action}>
                    <span className={styles.headTitle}>
                        <span className={styles.label}>
                            {trans('pay.pre_amount', '本次付款金额')}
                        </span>
                        {/* <span className={styles.all} onClick={this.inputTotalPrice.bind(this, detailContent && detailContent.arrearsOfMoney, detailContent && detailContent.totalAmount)}>{trans('pay.overall', '全部金额')}</span> */}
                    </span>
                    <span className={styles.inputPrice}>
                        {isError ? (
                            <span className={styles.error}>
                                {trans('pay.larger', '输入金额不得大于待支付总金额，请重新输入')}
                            </span>
                        ) : null}
                        <Input
                            placeholder="0.00"
                            className={styles.input}
                            value={priceValue}
                            disabled={
                                device == 'micromessenger'
                                    ? true
                                    : detailContent && detailContent.tuitionType == 1
                                    ? true
                                    : false
                            }
                            onChange={this.handlePriceChange.bind(
                                this,
                                detailContent && detailContent.arrearsOfMoney,
                                detailContent && detailContent.totalAmount
                            )}
                        />
                    </span>
                    <span className={styles.textAndView}>
                        <span className={styles.text}>
                            {trans('pay.remain', '待支付总金额')}￥
                            {
                                // detailContent &&
                                //     (detailContent.arrearsOfMoney || detailContent.totalAmount)

                                isUseBalance == 'true'
                                    ? detailContent &&
                                      parseFloat(detailContent.totalAmount) >=
                                          parseFloat(deductionAmount)
                                        ? payNumber
                                        : '0.00'
                                    : detailContent && detailContent.arrearsOfMoney
                            }
                        </span>
                        <a
                            className={styles.view}
                            href="https://cshall.alipay.com/lab/help_detail.htm?help_id=419480"
                        >
                            {trans('pay.limits', '查看银行限额')}
                        </a>

                        {/* <span className={styles.view} onClick={this.viewLimit.bind(this, true)} >{trans('pay.limits', '查看银行限额')}</span> */}
                        {
                            // isShowLimits ?
                            //     <div className={styles.coverAndImg}>
                            //         <span className={styles.cover} onClick={this.viewLimit.bind(this, false)}></span>
                            //         <span className={styles.img}>
                            //             {/* <img src={'https://yungu-xiaozhao.oss-cn-hangzhou.aliyuncs.com/yungu-website/8707360717447786054ade69716aca7ca6cdb6c6197661402.jpg'} /> */}
                            //             <span dangerouslySetInnerHTML={{ __html: limitContent }} />
                            //         </span>
                            //     </div>
                            //     : null
                        }
                    </span>
                    <span className={styles.btnBox}>
                        <Button
                            loading={isSubmit}
                            disabled={isError}
                            type="primary"
                            className={styles.confirmBtn}
                            onClick={this.submitPay}
                        >
                            {trans('pay.confirmPay', '确认支付')}
                        </Button>
                    </span>
                    {isCancel ? (
                        <span className={styles.againConfirm}>
                            <span className={styles.cover}></span>
                            <div className={styles.modal}>
                                <span className={styles.title}>
                                    {trans('pay.confirmCancelTitle', '您确定要取消本次支付吗？')}
                                </span>
                                <span className={styles.text}>
                                    {trans(
                                        'pay.confirmCancelText',
                                        '取消后，缴费通知将重新开放，您可以再次通过通知或应用入口进行支付。'
                                    )}
                                </span>
                                <span className={styles.btnBox}>
                                    <span className={styles.back} onClick={this.backPay}>
                                        {trans('pay.confirmCancelBack', '返回')}
                                    </span>
                                    <span className={styles.cancel} onClick={this.goDetail}>
                                        {trans('pay.confirmCancelOk', '确认取消支付')}
                                    </span>
                                </span>
                            </div>
                        </span>
                    ) : null}
                </div>
            </div>
        );
    }
}
