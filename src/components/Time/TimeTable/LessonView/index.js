import React, { PureComponent } from 'react';
import styles from './index.less';
import MainTable from './MainTable';
import CustomTable from './CustomTable';
import emptySchedule from '../../../../assets/empty.png';

export default class LessonView extends PureComponent {
    state = {};
    componentDidMount() {
        let { onRef, getCustomStudentList } = this.props;
        typeof onRef === 'function' && onRef(this);
        typeof getCustomStudentList == 'function' && getCustomStudentList();
    }

    render() {
        const { currentVersion } = this.props;
        return !currentVersion ? (
            <div className={styles.emptySchedule}>
                <img src={emptySchedule} />
                <span className={styles.emptyScheduleText}>本周暂未创建课表</span>
            </div>
        ) : (
            <div className={styles.wrapper}>
                <MainTable {...this.props} />
                <CustomTable {...this.props} />
            </div>
        );
    }
}
