//场地管理
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { trans } from '../../utils/i18n';
import BasicHeader from '../../layouts/BasicLayout';

export default class AddressManagement extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            cur: 0,
        };
    }

    switchNavList = (key) => {
        this.setState({
            cur: key,
        });
    };

    render() {
        const { cur } = this.state;
        const navList = [
            { name: '场地管理一', key: '0' },
            { name: '场地管理二', key: '1' },
        ];
        return (
            <div className={styles.addressPage}>
                <BasicHeader navList={navList} cur={cur} switchNavList={this.switchNavList} />
                <div>场地管理</div>
            </div>
        );
    }
}
