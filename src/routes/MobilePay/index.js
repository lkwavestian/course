//课程管理
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { trans } from '../../utils/i18n';
import MobilePayList from '../../components/MobilePay/MobilePayList/index.js';
import Lang from '../../components/Lang/index.js';

export default class MobilePay extends PureComponent {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className={styles.mobilePay}>
                <Lang />
                <MobilePayList />
            </div>
        );
    }
}
