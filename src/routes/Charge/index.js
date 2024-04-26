//收费管理
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { trans } from '../../utils/i18n';
import BasicHeader from '../../layouts/BasicLayout';
import Account from 'components/Account/index';
import ChargePro from 'components/ChargePro/index';
import PayNotice from 'components/PayNotice/index';
import BatchOrder from 'components/BatchOrder/index';
import PowerPage from '../../components/PowerPage/index';
import { routerRedux } from 'dva/router';
import { Skeleton } from 'antd';

@connect((state) => ({
    // powerPayStatus: state.global.powerPayStatus,//是否有收费管理权限
    powerStatus: state.global.powerStatus, //是否有权限
}))
export default class ChargeManagement extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            cur: '1',
            loading: true,
        };
    }
    componentDidMount() {
        const {
            match: { params },
        } = this.props;
        let tabValue = sessionStorage.getItem('key') || '1';
        tabValue = params && params.currentIndex ? params.currentIndex : tabValue;
        // this.props.dispatch({
        //     type: 'global/havePayPower',
        //     payload: {}
        // })

        this.props
            .dispatch({
                type: 'global/havePower',
                payload: {},
            })
            .then(() => {
                this.setState({
                    loading: false,
                });
            });

        this.setState({
            cur: tabValue,
        });
        document.getElementsByTagName('title')[0].innerHTML = '收费管理';
    }
    componentWillReceiveProps(nextProps) {
        if (
            nextProps.location &&
            nextProps.location.pathname != this.props.location &&
            this.props.location.pathname
        ) {
            const {
                match: { params },
            } = nextProps;
            this.setState({
                cur: params && params.currentIndex ? params && params.currentIndex : '1',
            });
        }
    }

    switchNavList = (key) => {
        sessionStorage.setItem('key', key);
        const tabValue = sessionStorage.getItem('key');
        this.setState({
            cur: tabValue,
        });
        this.props.dispatch(routerRedux.push(`/charge/index/${key}`));
    };

    render() {
        const { powerStatus } = this.props;
        // 判断是否有收费管理的权限
        let powerPay =
            powerStatus.content && powerStatus.content.indexOf('pay:user:charge:manage') != -1
                ? true
                : false;
        // let powerPay = powerStatus.content && powerStatus.content.indexOf("pay:user:charge:manage") != -1 ? true : false;
        const { cur } = this.state;
        const navList = [
            { name: trans('charge.items', '收费项目'), key: '0' },
            { name: trans('charge.notice', '缴费通知'), key: '1' },
            { name: trans('charge.audit', '对账验核'), key: '2' },
            { name: trans('charge.accountSettings', '账户设置'), key: '3' },
            // {name: '缴费数据', key: "2" },
        ];
        return (
            <div className={styles.coursePage}>
                <BasicHeader navList={navList} cur={cur} switchNavList={this.switchNavList} />
                <Skeleton loading={this.state.loading} active>
                    {powerPay ? (
                        <div className={styles.mainContent}>
                            {cur == '0' && <ChargePro />}
                            {cur == '1' && <PayNotice />}
                            {
                                // cur == '2' && '缴费数据'
                            }
                            {cur == '2' && <BatchOrder />}
                            {cur == '3' && <Account />}
                        </div>
                    ) : (
                        <PowerPage />
                    )}
                </Skeleton>
            </div>
        );
    }
}
