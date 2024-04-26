//课程管理
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { trans } from '../../utils/i18n';
import Ebank from '../../components/MobilePay/Ebank/index.js';
import Lang from '../../components/Lang/index.js';

export default class NetBank extends PureComponent {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className={styles.newBank}>
                <Lang />
                <Ebank />
            </div>
        );
    }
}
