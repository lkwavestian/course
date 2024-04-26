//课程管理
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Button, Icon, Radio, message, Spin } from 'antd';
import styles from './index.less';
import { routerRedux } from 'dva/router';
import { trans } from '../../../utils/i18n';
import { getUrlSearch } from '../../../utils/utils';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import * as dd from 'dingtalk-jsapi';

@connect((state) => ({
    bankInfo: state.mobilePay.bankInfo,
    submitPayMsg: state.mobilePay.submitPayMsg,
}))
export default class Ebank extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
        };
    }

    componentWillMount() {
        dd.biz.navigation.setTitle({
            title: `${trans('pay.bank.title', '网银支付方式')}`, //控制标题文本，空字符串表示显示默认文本
        });
    }

    componentDidMount() {
        const { dispatch } = this.props;
        let fundChannel = getUrlSearch('fundChannel');
        dispatch({
            type: 'mobilePay/submitPay',
            payload: {
                orderNo: getUrlSearch('orderNo'),
                orderPlanId: getUrlSearch('tuitionPlan'),
                payType: getUrlSearch('payType'),
                fundChannel: fundChannel ? JSON.parse(fundChannel) : 0,
                amountActuallyPaid: getUrlSearch('amount'),
            },
        }).then(() => {
            this.setState({
                loading: false,
            });
        });
    }

    render() {
        const { submitPayMsg } = this.props;
        const { loading } = this.state;
        if (loading) {
            return (
                <div className={styles.loading}>
                    <Spin tip="Loading..." />
                </div>
            );
        }
        const payMsg = (submitPayMsg && submitPayMsg.content) || {};
        return (
            <div className={styles.eBank}>
                <div>
                    <div className={styles.item}>
                        <span className={styles.label}>
                            <span className={styles.labelLeft}>
                                {' '}
                                {trans('pay.bank.payeeCardNo', '收款账号')}{' '}
                            </span>
                            <CopyToClipboard
                                text={payMsg.payeeCardNo} // 需要复制的文本
                                onCopy={() => {
                                    message.success(`${trans('pay.bank.copySuccess', '复制成功')}`);
                                }}
                            >
                                <span className={styles.right}>
                                    {' '}
                                    {trans('pay.bank.copyCardNo', '复制账号')}{' '}
                                </span>
                            </CopyToClipboard>
                        </span>
                        <span className={styles.text}> {payMsg.payeeCardNo} </span>
                        <span className={styles.mention}>
                            <Icon type="info-circle" theme="filled" style={{ color: '#4d7fff' }} />{' '}
                            {trans(
                                'pay.bank.mention',
                                '该收款账号仅限本次转账使用，请勿重复转账或转发他人。'
                            )}
                        </span>
                    </div>
                    <div className={styles.item}>
                        <span className={styles.label}>
                            <span className={styles.labelLeft}>
                                {trans('pay.bank.payeeName', '收款户名')}
                            </span>
                            <CopyToClipboard
                                text={payMsg.payeeName} // 需要复制的文本
                                onCopy={() => {
                                    message.success(`${trans('pay.bank.copySuccess', '复制成功')}`);
                                }}
                            >
                                <span className={styles.right}>
                                    {trans('pay.bank.copyPayeeName', '复制户名')}
                                </span>
                            </CopyToClipboard>
                        </span>
                        <span className={styles.text}> {payMsg.payeeName} </span>
                    </div>
                    <div className={styles.item}>
                        <span className={styles.label}>
                            <span className={styles.labelLeft}>
                                {trans('pay.bank.bankName', '开户行')}
                            </span>
                            <CopyToClipboard
                                text={payMsg.bankName} // 需要复制的文本
                                onCopy={() => {
                                    message.success(`${trans('pay.bank.copySuccess', '复制成功')}`);
                                }}
                            >
                                <span className={styles.right}>
                                    {trans('pay.bank.copyBankName', '复制开户行')}
                                </span>
                            </CopyToClipboard>
                        </span>
                        <span className={styles.text}> {payMsg.bankName} </span>
                    </div>
                    <div className={styles.item}>
                        <span className={styles.label}>
                            <span className={styles.labelLeft}>
                                {trans('pay.bank.amount', '转账金额（元）')}
                            </span>
                            <CopyToClipboard
                                text={payMsg.amount} // 需要复制的文本
                                onCopy={() => {
                                    message.success(`${trans('pay.bank.copySuccess', '复制成功')}`);
                                }}
                            >
                                <span className={styles.right}>
                                    {trans('pay.bank.copyAmount', '复制金额')}
                                </span>
                            </CopyToClipboard>
                        </span>
                        <span className={styles.text}> {payMsg.amount} </span>
                    </div>
                    <p className={styles.mark}>
                        {trans(
                            'pay.bank.ruleOne',
                            '1.可通过网银APP或者前往营业厅柜台转账给以上收款账号。'
                        )}
                    </p>
                    <p className={styles.mark}>
                        {trans(
                            'pay.bank.ruleTwo',
                            '2.完成转账后，请点击下方“我已完成转账”按钮完成缴费。'
                        )}
                    </p>
                </div>

                <span className={styles.btnBox}>
                    <a type="primary" className={styles.btn} href="#/mobilePay/index">
                        {trans('pay.bank.finishPay', '我已完成转账')}
                    </a>
                </span>
            </div>
        );
    }
}
