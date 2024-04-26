import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import RoleHeader from './RoleHeader';
import RoleTable from './RoleTable';
import SetRights from './SetRights';
import { Tabs } from 'antd';

const { TabPane } = Tabs;
export default class RoleInformation extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            activeKey: '1',
        };
    }

    callback = (key) => {
        this.setState({
            activeKey: key,
        });
    };

    render() {
        const { activeKey } = this.state;
        return (
            <div className={styles.roleInformation}>
                <Tabs activeKey={this.state.activeKey} onChange={this.callback}>
                    <TabPane tab="角色人员" key="1">
                        <RoleHeader />
                        <RoleTable />
                    </TabPane>
                    <TabPane tab="权限配置" key="2">
                        <SetRights activeKey={activeKey} />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
