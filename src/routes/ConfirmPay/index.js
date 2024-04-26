//课程管理
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { trans } from '../../utils/i18n';
import ConfirmPay from '../../components/MobilePay/ConfirmPay/index.js';
import Lang from '../../components/Lang/index.js';

export default class ConfirmPayBill extends PureComponent {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className={styles.confirmPayBill}>
                <Lang />
                <ConfirmPay />
            </div>
        );
    }
}
