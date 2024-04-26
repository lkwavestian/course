//教学组织
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './index.less';

export default class TeachingOrgPage extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return <div className={styles.mainPage}>教学组织</div>;
    }
}
