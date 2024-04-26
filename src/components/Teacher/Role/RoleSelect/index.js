import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Select } from 'antd';
import { trans, locale } from '../../../../utils/i18n';
import SemesterSelect from './SemesterSelect';
import RoleList from './RoleList';

@connect((state) => ({}))
export default class RoleSelect extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className={styles.roleSelect}>
                <SemesterSelect />
                <RoleList />
            </div>
        );
    }
}
