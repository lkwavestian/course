// 班级详情
import React, { PureComponent } from 'react';
import styles from './index.less';
import BaseDetail from '../../components/CourseBaseDetail';
class CourseBaseDetail extends PureComponent {
    render() {
        document.title = '选课管理';
        return (
            <div className={styles.CourseBaseDetail}>
                <BaseDetail />
            </div>
        );
    }
}

export default CourseBaseDetail;
