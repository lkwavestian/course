import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { trans } from '../../utils/i18n';
import CoursePlan from 'components/Course/Plan/index';
import Club from 'components/Club/index';
import TimeSchedule from '../../components/Time/Schedule/index';
import ScheduleListForTask from '../../components/Time/ScheduleListForTask';
import GlobalUtil from '../../components/GlobalUtil';

@connect((state) => ({
    // currentUser: state.global.currentUser,
}))
export default class TaskCourseManage extends PureComponent {
    state = {
        selectKeys: 2,
    };

    changeSelectKeys = (key) => {
        this.setState({
            selectKeys: key,
        });
    };
    render() {
        const { selectKeys } = this.state;
        let tabList = [
            trans('course.CoursePlan', '课时计划'),
            trans('course.Timetable', '作息设置'),
            trans('course.CourseSchedule', '课表管理'),
            trans('course.activityManagement', '活动管理'),
        ];
        return (
            <div className={styles.taskCourseManage}>
                {
                    window.top != window.self 
                    ? null
                    : <div className={styles.header}>
                        <div className={styles.tabList}>
                            {tabList.map((item, index) => {
                                return selectKeys === index ? (
                                    <div key={index}>
                                        <span className={styles.text}>{item}</span>
                                        <span className={styles.line}></span>
                                    </div>
                                ) : (
                                    <span onClick={() => this.changeSelectKeys(index)} key={index}>
                                        {item}
                                    </span>
                                );
                            })}
                        </div>
                        {/* <GlobalUtil /> */}
                    </div>
                }
                <div className={styles.content}>
                    {selectKeys === 0 ? (
                        <CoursePlan />
                    ) : selectKeys === 1 ? (
                        <TimeSchedule />
                    ) : selectKeys === 2 ? (
                        <ScheduleListForTask />
                    ) : (
                        <Club />
                    )}
                </div>
            </div>
        );
    }
}
