import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './index.less';
import RoleSelect from './RoleSelect';
import RoleInformation from './RoleInformation';

export default class TeacherRole extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className={styles.rolePageWrapper}>
                <div className={styles.rolePage}>
                    <RoleSelect />
                    <RoleInformation />
                </div>
            </div>
        );
    }
}
