//club列表
import React, { PureComponent } from 'react';
import styles from './index.less';
import { Card, Tabs } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import icon from '../../icon.less';
import moment from 'moment';
import { formatTime } from '../../utils/utils';
import SchoolAcount from './schoolAccount';
import AccoutChanges from './accoutChanges';
import StudentAccout from './studentAccout';
import { trans } from '../../utils/i18n';

const dateFormat = 'YYYY/MM/DD';
const { TabPane } = Tabs;

@connect((state) => ({
    currentUser: state.global.currentUser,
}))
export default class Account extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            activeKey: 1,
        };
    }

    tabChange = (activeKey) => {
        this.setState({
            activeKey,
        });
    };

    render() {
        const { activeKey } = this.state;
        const { currentUser } = this.props;
        console.log(this.props.currentUser, 'currentUser');
        return (
            <div className={styles.account}>
                <Tabs value={activeKey} onChange={this.tabChange}>
                    <TabPane tab={trans('charge.schoolAccount', '学校账户')} key="1">
                        {activeKey == 1 ? <SchoolAcount /> : null}
                    </TabPane>
                    {currentUser?.schoolId != 1 && (
                        <TabPane tab={trans('charge.studentAccount', '学生账户')} key="2">
                            {activeKey == 2 ? <StudentAccout /> : null}
                        </TabPane>
                    )}
                    {currentUser?.schoolId != 1 && (
                        <TabPane tab={trans('charge.changeDetails', '学生账户明细变动')} key="3">
                            {activeKey == 3 ? <AccoutChanges /> : null}
                        </TabPane>
                    )}
                </Tabs>
            </div>
        );
    }
}
