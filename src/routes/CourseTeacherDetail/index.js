//课程管理
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { trans } from '../../utils/i18n';
import TeacherDetail from '../../components/CourseTeacherDetail/index';

export default class CourseTeacherDetail extends PureComponent {
    constructor(props) {
        super(props);
    }

    componentWillMount() {}

    render() {
        document.title = '选课管理';
        return (
            <div className={styles.CourseTeacherDetail}>
                <TeacherDetail match={this.props.match} />
            </div>
        );
    }
}
