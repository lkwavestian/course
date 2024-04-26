//课程管理
import React, { PureComponent } from 'react';
import styles from './index.less';
import SelectDetailMobile from '../../components/CourseStudentDetailMobile/index';
import CourseStudentDetailMobileYunGu from '../../components/CourseStudentDetailMobileYunGu';

export default class CourseSelectDetail extends PureComponent {
    constructor(props) {
        super(props);
    }

    componentWillMount() {}

    render() {
        return (
            <div className={styles.courseSelectDetail}>
                <CourseStudentDetailMobileYunGu />
            </div>
        );
    }
}
