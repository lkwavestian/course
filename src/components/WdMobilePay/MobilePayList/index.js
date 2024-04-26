//课程管理
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Spin, Tabs } from 'antd';
import styles from './index.less';
import { routerRedux } from 'dva/router';
import { trans } from '../../../utils/i18n';
import { Icon } from 'antd';
import * as dd from 'dingtalk-jsapi';
import { locale } from '../../../utils/i18n';
import noData from '../../../assets/noDate.png';
import Header from '../../CourseStudentDetailMobile/header';
import VConsole from 'vconsole';
const { TabPane } = Tabs;

@connect((state) => ({
    courseBillList: state.mobilePay.billList,
    currentUser: state.global.currentUser,
}))
export default class MobilePayList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            tloading: true,
            IconFont: null,
            callbackValue: 3,
            defaultActiveKey: '1',
            loading1: false,
            device: '',
        };
    }

    componentWillMount() {
        // let vConsole = new VConsole();

        let judgeDevice = '';
        let ua = navigator.userAgent.toLowerCase(); //判断浏览器的类型
        if (ua.match(/Alipay/i) == 'alipay') {
            //支付宝
            judgeDevice = 'alipay';
        } else if (
            ua.match(/MicroMessenger/i) == 'micromessenger' &&
            ua.match(/wxwork/i) == 'wxwork'
        ) {
            //企业微信
            judgeDevice = 'wxwork';
        } else if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            //微信
            judgeDevice = 'micromessenger';
            console.log('微信');
        } else if (ua.match(/DingTalk/i) == 'dingtalk') {
            judgeDevice = 'dingtalk';
            console.log('钉钉');
            //钉钉
        } else if (ua.match(/TaurusApp/i) == 'taurusapp') {
            judgeDevice = 'taurusapp';
            //专有钉钉
        } else if (window.__wxjs_environment == 'miniprogram') {
            judgeDevice = 'miniprogram';
            //微信小程序
        }

        this.setState({
            device: judgeDevice,
        });

        if (judgeDevice == 'micromessenger') {
            document.getElementsByTagName('title')[0].innerText = '家长缴费';
        } else if (judgeDevice == 'dingtalk') {
            dd.biz.navigation.setTitle({
                title: `${trans('pay.title_pay', '家长缴费')}`, //控制标题文本，空字符串表示显示默认文本
            });
        }
    }

    componentDidMount() {
        let { device } = this.state;
        if (device == 'dingtalk') {
            this.dingControl();
        }
        const { dispatch } = this.props;
        const IconFonts = Icon.createFromIconfontCN({
            scriptUrl: '//at.alicdn.com/t/font_789461_1fg3v64pt92i.js',
        });
        dispatch({
            type: 'mobilePay/getBillList',
            payload: {
                type: this.state.callbackValue,
            },
        }).then(() => {
            this.setState({
                loading: false,
                IconFont: IconFonts,
            });
        });
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

    goDetail = (item) => {
        const { dispatch } = this.props;
        let { device } = this.state;
        dispatch(
            routerRedux.push({
                pathname: '/payDetail/index',
                search: `tuitionOrderNo=${item.orderNo}&tuitionPlan=${item.planId}&device=${device}`,
            })
        );

        // window.location.href = `/payDetail/index?orderNo=${item.orderNo}&orderPlanId=${item.orderPlanId}&gdingDingNoticeId=${item.gdingDingNoticeId}`
    };

    render() {
        const { courseBillList, currentUser } = this.props;
        const { loading, IconFont } = this.state;
        console.log('currentUser', currentUser);

        let hasMsg = currentUser && currentUser.userId ? true : false;
        if (loading) {
            return (
                <div className={styles.mobileLoading}>
                    <Spin tip="Loading..." />
                </div>
            );
        }
        return (
            <div style={{ height: '100vh', overflow: 'scroll' }} className={styles.payList}>
                {/* <div style={{ height: '2.5rem' }}></div> */}
                <div className={styles.headBox}>
                    {hasMsg && (
                        <div className={styles.tabArea}>
                            <Header cur={0} />
                        </div>
                    )}
                </div>
                {this.state.loading1 ? (
                    <Spin spinning={this.state.loading1} className={styles.loading1}></Spin>
                ) : courseBillList && courseBillList.length ? (
                    courseBillList.map((item, index) => {
                        return (
                            <div key={index}>
                                <div
                                    className={styles.educateCard}
                                    style={{ borderRadius: '0' }}
                                    onClick={this.goDetail.bind(this, item)}
                                    key={index}
                                >
                                    <div className={styles.chargeMsg}>
                                        <div className={styles.educateTitle}>
                                            <span className={styles.leftSpan}>
                                                {locale() === 'en' ? item.enTitle : item.cnTitle}
                                            </span>
                                            <span className={styles.rightSpan}>
                                                {item.payStatus == 1 ? (
                                                    <span
                                                        style={{
                                                            color: '#0445FC',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '700',
                                                        }}
                                                    >
                                                        {trans('pay.payNot', '未缴费')}
                                                    </span>
                                                ) : item.payStatus == 2 ? (
                                                    <span
                                                        style={{
                                                            color: '#FFB900',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '700',
                                                        }}
                                                    >
                                                        {trans('pay.partPay', '部分缴费')}
                                                    </span>
                                                ) : item.payStatus == 3 ? (
                                                    <span
                                                        style={{
                                                            color: '#01113D',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '700',
                                                        }}
                                                    >
                                                        {trans('pay.payed', '已缴费')}
                                                    </span>
                                                ) : item.payStatus == 4 ? (
                                                    <span
                                                        style={{
                                                            color: '#01113D',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '700',
                                                        }}
                                                    >
                                                        {trans('pay.close', '已关闭')}
                                                    </span>
                                                ) : null}
                                            </span>
                                        </div>
                                        <div className={styles.center}>
                                            <span className={styles.priceTitle}>本期共缴费</span>
                                            <span className={styles.priceValue}>
                                                <span style={{ fontSize: '1.4rem' }}>¥&nbsp;</span>
                                                {item.amount}
                                            </span>
                                        </div>
                                        <div className={styles.chargeMsgs}>
                                            <span className={styles.userMsg}>
                                                <span className={styles.label}>
                                                    {trans('pay.userName', '学生姓名')}
                                                </span>
                                                <span className={styles.name}>{item.userName}</span>
                                            </span>
                                            <span
                                                className={styles.userMsg}
                                                style={{ marginTop: '0.5rem' }}
                                            >
                                                <span className={styles.label}>
                                                    {trans('pay.sendTime', '发送日期')}
                                                </span>
                                                <span className={styles.name}>{item.sendTime}</span>
                                            </span>
                                        </div>
                                        <div className={styles.btnChange}>
                                            <span className={styles.detail}>
                                                <span>
                                                    {trans('pay.detail', '查看详情')}
                                                    <Icon
                                                        type="right"
                                                        style={{
                                                            float: 'right',
                                                            lineHeight: '1.75rem',
                                                        }}
                                                    />
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className={styles.nullStyle}>
                        <span className={styles.noData}>
                            <span>
                                <img src={noData} />
                            </span>
                            {/* {IconFont && <IconFont type="icon-chengguoweikong" style={{ fontSize: '80px' }} />} */}
                            <p className={styles.text}>{trans('pay.noData', '暂无订单')}</p>
                        </span>
                    </div>
                )}
            </div>
        );
    }
}
