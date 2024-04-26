//时间管理
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { trans } from '../../utils/i18n';
import BasicHeader from '../../layouts/BasicLayout';
import TimeSchedule from '../../components/Time/Schedule/index';
import TimeTable from '../../components/Time/TimeTable/index';
import { saveCurrent } from '../../utils/utils';

export default class TimeManagement extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            cur: sessionStorage.getItem('timeMenu') || '0',
        };
    }
    switchNavList = (key) => {
        this.setState({
            cur: key,
        });
        saveCurrent('timeMenu', key);
    };
    render() {
        const { cur } = this.state;
        const navList = [
            { name: '课表', key: '0' },
            { name: '作息表', key: '1' },
        ];
        return (
            <div className={styles.timePage}>
                <BasicHeader navList={navList} cur={cur} switchNavList={this.switchNavList} />
                <div className={styles.mainContent}>
                    {cur == '0' && <TimeTable />}
                    {cur == '1' && <TimeSchedule />}
                </div>
            </div>
        );
    }
}
