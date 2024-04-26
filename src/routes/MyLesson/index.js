//课程管理
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { trans } from '../../utils/i18n';
import Mylesson from '../../components/MyLesson/index';

export default class CourseSelectDetail extends PureComponent {
    constructor(props) {
        super(props);
    }

    componentWillMount() {}

    render() {
        return (
            <div className={styles.courseSelectDetail}>
                <Mylesson />
            </div>
        );
    }
}
