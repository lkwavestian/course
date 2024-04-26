//club列表
import React, { PureComponent } from 'react';
import styles from './index.less';
import { Tabs } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import icon from '../../icon.less';
import moment from 'moment';
import { formatTime } from '../../utils/utils';
import PaymentDetail from './PaymentDetail/index.js';
import DealFlow from './DealFlow/index.js';
import { trans } from '../../utils/i18n';

const dateFormat = 'YYYY/MM/DD';
const { TabPane } = Tabs;

@connect((state) => ({}))
export default class BatchOrder extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    tabChange = () => {};

    render() {
        return (
            <div className={styles.batchOrder}>
                <Tabs defaultActiveKey="1" onChange={this.tabChange}>
                    <TabPane tab={trans('charge.accountBalance', '学校账户收支明细')} key="1">
                        <PaymentDetail />
                    </TabPane>
                    <TabPane tab={trans('charge.tradeDetail', '交易流水')} key="2">
                        <DealFlow />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
