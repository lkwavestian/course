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
const { TabPane } = Tabs;

@connect((state) => ({
    billList: state.mobilePay.billList,
}))
export default class MobilePayList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            tloading: true,
            IconFont: null,
            callbackValue: 1,
            defaultActiveKey: '1',
            loading1: false,
            device: '',
        };
    }

    componentWillMount() {
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
        } else if (ua.match(/DingTalk/i) == 'dingtalk') {
            judgeDevice = 'dingtalk';
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

        dd.biz.navigation.setTitle({
            title: `${trans('pay.title_pay', '家长缴费')}`, //控制标题文本，空字符串表示显示默认文本
        });
    }

    componentDidMount() {
        this.dingControl();
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
    };
    callback = (key) => {
        const IconFonts = Icon.createFromIconfontCN({
            scriptUrl: '//at.alicdn.com/t/font_789461_1fg3v64pt92i.js',
        });
        this.setState({
            loading1: true,
            IconFont: null,
        });
        const { dispatch } = this.props;
        dispatch({
            type: 'mobilePay/getBillList',
            payload: {
                type: key,
            },
        }).then(() => {
            this.setState({
                loading1: false,
            });
        });
    };

    render() {
        const { billList } = this.props;
        const { loading, IconFont } = this.state;
        if (loading) {
            return (
                <div className={styles.mobileLoading}>
                    <Spin tip="Loading..." />
                </div>
            );
        }
        return (
            <div>
                <Tabs
                    defaultActiveKey={this.state.defaultActiveKey}
                    onChange={this.callback}
                    className={styles.payList}
                >
                    <TabPane tab="待缴" key="1" className={styles.willPay}>
                        <div style={{ height: '2.5rem' }}>{/* <img src={logo }/> */}</div>
                        {this.state.loading1 ? (
                            <Spin spinning={this.state.loading1} className={styles.loading1}></Spin>
                        ) : billList && billList.length ? (
                            billList.map((item, index) => {
                                return (
                                    <div>
                                        {item.payType < 5 ? (
                                            <div
                                                className={styles.chargeCard}
                                                onClick={this.goDetail.bind(this, item)}
                                                key={index}
                                            >
                                                <span className={styles.title}>
                                                    <span style={{ lineHeight: '2.4375rem' }}>
                                                        {locale() === 'en'
                                                            ? item.enTitle
                                                            : item.cnTitle}
                                                    </span>
                                                    <Icon
                                                        type="right"
                                                        style={{
                                                            float: 'right',
                                                            lineHeight: '2.4375rem',
                                                        }}
                                                    />
                                                </span>

                                                <div className={styles.paymentStatus}>
                                                    <span className={styles.leftSpan}>
                                                        <span
                                                            style={{
                                                                fontSize: '1.4rem',
                                                                fontWeight: '700',
                                                            }}
                                                        >
                                                            ¥&nbsp;
                                                        </span>
                                                        <span style={{ fontWeight: '500' }}>
                                                            {item.amount}
                                                        </span>
                                                    </span>
                                                    <span className={styles.rightSpan}>
                                                        {item.payStatus == 1 ? (
                                                            <span style={{ fontWeight: '700' }}>
                                                                {trans('pay.payNot', '未缴费')}
                                                            </span>
                                                        ) : item.payStatus == 2 ? (
                                                            <span style={{ fontWeight: '700' }}>
                                                                {trans('pay.partPay', '部分缴费')}
                                                            </span>
                                                        ) : item.payStatus == 3 ? (
                                                            <span style={{ fontWeight: '700' }}>
                                                                {trans('pay.payed', '已缴费')}
                                                            </span>
                                                        ) : null}
                                                    </span>
                                                </div>
                                                <div className={styles.chargeMsg}>
                                                    <span className={styles.userMsg}>
                                                        <span className={styles.label}>
                                                            {trans('pay.userName', '学生姓名')}
                                                        </span>
                                                        <span className={styles.name}>
                                                            {item.userName}
                                                        </span>
                                                    </span>
                                                    <span
                                                        className={styles.userMsg}
                                                        style={{ marginTop: '0.5rem' }}
                                                    >
                                                        <span className={styles.label}>
                                                            {trans('pay.sendTime', '发送日期')}
                                                        </span>
                                                        <span className={styles.name}>
                                                            {item.sendTime}
                                                        </span>
                                                    </span>
                                                    {/* <img src={logo}/> */}
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                className={styles.educateCard}
                                                style={{ borderRadius: '0' }}
                                                onClick={this.goDetail.bind(this, item)}
                                                key={index}
                                            >
                                                <div className={styles.chargeMsg}>
                                                    <div className={styles.educateTitle}>
                                                        <span className={styles.leftSpan}>
                                                            {locale() === 'en'
                                                                ? item.enTitle
                                                                : item.cnTitle}
                                                        </span>
                                                        <span className={styles.rightSpan}>
                                                            {item.payStatus == 1 ? (
                                                                <span style={{ fontWeight: '700' }}>
                                                                    {trans('pay.payNot', '未缴费')}
                                                                </span>
                                                            ) : item.payStatus == 2 ? (
                                                                <span style={{ fontWeight: '700' }}>
                                                                    {trans(
                                                                        'pay.partPay',
                                                                        '部分缴费'
                                                                    )}
                                                                </span>
                                                            ) : item.payStatus == 3 ? (
                                                                <span style={{ fontWeight: '700' }}>
                                                                    {trans('pay.payed', '已缴费')}
                                                                </span>
                                                            ) : null}
                                                        </span>
                                                    </div>
                                                    <div className={styles.center}>
                                                        <span
                                                            className={styles.priceTitle}
                                                            style={{ fontWeight: '500' }}
                                                        >
                                                            本期共缴费
                                                        </span>
                                                        <span className={styles.priceValue}>
                                                            <span style={{ fontSize: '1.4rem' }}>
                                                                ¥&nbsp;
                                                            </span>
                                                            {item.amount}
                                                        </span>
                                                    </div>
                                                    <div className={styles.chargeMsgs}>
                                                        <span className={styles.userMsg}>
                                                            <span className={styles.label}>
                                                                {trans('pay.userName', '学生姓名')}
                                                            </span>
                                                            <span className={styles.name}>
                                                                {item.userName}
                                                            </span>
                                                        </span>
                                                        <span
                                                            className={styles.userMsg}
                                                            style={{ paddingTop: '0.5rem' }}
                                                        >
                                                            <span className={styles.label}>
                                                                {trans('pay.sendTime', '发送日期')}
                                                            </span>
                                                            <span className={styles.name}>
                                                                {item.sendTime}
                                                            </span>
                                                        </span>
                                                    </div>
                                                    <div className={styles.btnChange}>
                                                        <span className={styles.detail}>
                                                            <span>
                                                                {trans(
                                                                    'student.detail',
                                                                    '查看详情'
                                                                )}
                                                            </span>
                                                            <Icon
                                                                type="right"
                                                                style={{
                                                                    float: 'right',
                                                                    lineHeight: '1.75rem',
                                                                }}
                                                            />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
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
                                    <p className={styles.text}>
                                        {trans('pay.noData1', '暂无订单')}
                                    </p>
                                </span>
                            </div>
                        )}
                        {/* </Spin> */}
                    </TabPane>
                    <TabPane tab="学费" key="2">
                        <div className={styles.ygtuitionFee}>
                            <div style={{ height: '2.5rem' }}></div>
                            {this.state.loading1 ? (
                                <Spin
                                    spinning={this.state.loading1}
                                    className={styles.loading1}
                                ></Spin>
                            ) : billList && billList.length ? (
                                billList.map((item, index) => {
                                    return (
                                        <div key={index}>
                                            <div
                                                className={styles.chargeCard}
                                                onClick={this.goDetail.bind(this, item)}
                                                key={index}
                                            >
                                                <span
                                                    className={
                                                        item.payStatus == 1
                                                            ? styles.title
                                                            : item.payStatus == 2
                                                            ? styles.title
                                                            : item.payStatus == 3
                                                            ? styles.title1
                                                            : item.payStatus == 4
                                                            ? styles.title1
                                                            : null
                                                    }
                                                >
                                                    <span style={{ lineHeight: '2.4375rem' }}>
                                                        {locale() === 'en'
                                                            ? item.enTitle
                                                            : item.cnTitle}
                                                    </span>
                                                    <Icon type="right" style={{ float: 'right' }} />
                                                </span>
                                                <div className={styles.paymentStatus}>
                                                    <span
                                                        className={
                                                            item.payStatus == 1
                                                                ? styles.leftSpan
                                                                : item.payStatus == 2
                                                                ? styles.leftSpan
                                                                : item.payStatus == 3
                                                                ? styles.leftSpan1
                                                                : item.payStatus == 4
                                                                ? styles.leftSpan1
                                                                : null
                                                        }
                                                    >
                                                        <span>¥&nbsp;</span>
                                                        {item.amount}
                                                    </span>
                                                    <span className={styles.rightSpan}>
                                                        {item.payStatus == 1 ? (
                                                            <span style={{ fontWeight: '700' }}>
                                                                {trans('pay.payNot', '未缴费')}
                                                            </span>
                                                        ) : item.payStatus == 2 ? (
                                                            <span style={{ fontWeight: '700' }}>
                                                                {trans('pay.partPay', '部分缴费')}
                                                            </span>
                                                        ) : item.payStatus == 3 ? (
                                                            <span
                                                                style={{
                                                                    color: '#C5C5C5',
                                                                    fontWeight: '500',
                                                                }}
                                                            >
                                                                {trans('pay.payed', '已缴费')}
                                                            </span>
                                                        ) : null}
                                                    </span>
                                                </div>
                                                <div className={styles.chargeMsg}>
                                                    <span className={styles.userMsg}>
                                                        <span className={styles.label}>
                                                            {trans('pay.userName', '学生姓名')}
                                                        </span>
                                                        <span className={styles.name}>
                                                            {item.userName}
                                                        </span>
                                                    </span>
                                                    <span
                                                        className={styles.userMsg}
                                                        style={{ marginTop: '0.5rem' }}
                                                    >
                                                        <span className={styles.label}>
                                                            {trans('pay.sendTime', '发送日期')}
                                                        </span>
                                                        <span className={styles.name}>
                                                            {item.sendTime}
                                                        </span>
                                                    </span>
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
                                        <p className={styles.text}>
                                            {trans('pay.noData', '暂无订单')}
                                        </p>
                                    </span>
                                </div>
                            )}
                            {/* </Spin> */}
                        </div>
                    </TabPane>
                    <TabPane tab="其他" key="3">
                        <div style={{ height: '2.5rem' }}></div>
                        {this.state.loading1 ? (
                            <Spin spinning={this.state.loading1} className={styles.loading1}></Spin>
                        ) : billList && billList.length ? (
                            billList.map((item, index) => {
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
                                                        {locale() === 'en'
                                                            ? item.enTitle
                                                            : item.cnTitle}
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
                                                    <span className={styles.priceTitle}>
                                                        本期共缴费
                                                    </span>
                                                    <span className={styles.priceValue}>
                                                        <span style={{ fontSize: '1.4rem' }}>
                                                            ¥&nbsp;
                                                        </span>
                                                        {item.amount}
                                                    </span>
                                                </div>
                                                <div className={styles.chargeMsgs}>
                                                    <span className={styles.userMsg}>
                                                        <span className={styles.label}>
                                                            {trans('pay.userName', '学生姓名')}
                                                        </span>
                                                        <span className={styles.name}>
                                                            {item.userName}
                                                        </span>
                                                    </span>
                                                    <span
                                                        className={styles.userMsg}
                                                        style={{ marginTop: '0.5rem' }}
                                                    >
                                                        <span className={styles.label}>
                                                            {trans('pay.sendTime', '发送日期')}
                                                        </span>
                                                        <span className={styles.name}>
                                                            {item.sendTime}
                                                        </span>
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
                        {/* </Spin> */}
                    </TabPane>
                </Tabs>
            </div>
            // <div className={styles.mobilePayList}>

            //         (billList && billList.length)?billList.map((item,index) => {
            //             return <div className={styles.chargeCard} onClick={this.goDetail.bind(this,item)} key={index}>
            //                 <div className={styles.chargeMsg}>
            //                     <span className={styles.title}>{locale() === 'en'?item.enTitle:item.cnTitle}</span>
            //                     <span className={styles.userMsg}>
            //                         <span className={styles.label}>{trans('pay.userName','学生姓名')}</span>
            //                         <span className={styles.name}>{item.userName}</span>
            //                     </span>
            //                     <span className={styles.userMsg}>
            //                         <span className={styles.label}>{trans('pay.sendTime','发送日期')}</span>
            //                         <span className={styles.name}>{item.sendTime}</span>
            //                     </span>
            //                 </div>
            //                 <div className={styles.payMsg}>
            //                     {/* <span className={styles.deadLine}>
            //                         <span className={styles.time}>{item.deadline}</span>
            //                         <span className={styles.text}>截止缴费</span>
            //                     </span> */}
            //                     <span className={styles.priceAndStatus}>
            //                         <span className={styles.price}>￥{item.amount}</span>
            //                         <span className={styles.status}>
            //                             {
            //                                 item.payStatus ==1?<span className={styles.light}>{trans('pay.payNot','待缴费')}</span>:
            //                                 item.payStatus ==2?<span className={styles.light}>{trans('pay.partPay','部分缴费')}</span>:
            //                                 item.payStatus ==3?<span>{trans('pay.payed','已缴清')}</span>:
            //                                 item.payStatus ==4?<span>{trans('pay.close','已关闭')}</span>:
            //                                 <span></span>

            //                             }
            //                         </span>
            //                     </span>
            //                 </div>
            //             </div>
            //         })
            //         :
            //         <span  className={styles.noData}>
            //             {IconFont && <IconFont type="icon-chengguoweikong" style={{fontSize:'80px'}}/>}
            //             <p className={styles.text}>{trans('pay.noData','暂时没有缴费记录')}</p>
            //         </span>

            // </div>
        );
    }
}
