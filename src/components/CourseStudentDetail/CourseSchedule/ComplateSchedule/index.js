import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon, Modal, Checkbox, Table } from 'antd';
import styles from './index.less';
import icon from '../../../../icon.less';
import { getUrlSearch, getCourseColor, formatTimeSafari } from '../../../../utils/utils';

@connect((state) => ({
    detailScheduleInfo: state.studentDetail.detailScheduleInfo,
}))
export default class ComplateSchedule extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            startTime: '',
            endTime: '',
            firstWeekList: [],
            planMsg:
                (localStorage.getItem('planMsg')
                    ? JSON.parse(localStorage.getItem('planMsg'))
                    : null) || (window.planMsg ? JSON.parse(window.planMsg) : null), // 选课计划信
        };
    }

    componentDidMount() {
        // 获取开课周期时间段
        const { courseStartPeriodList } = this.props;
        this.setState(
            {
                startTime:
                    courseStartPeriodList &&
                    courseStartPeriodList[0] &&
                    courseStartPeriodList[0].startTime,
                endTime:
                    courseStartPeriodList &&
                    courseStartPeriodList[0] &&
                    courseStartPeriodList[0].endTime,
            },
            () => {
                this.getComplateSchedule();
                this.getWeekStartAndEnd(parseInt(this.state.startTime));
            }
        );
    }

    formatDate(date) {
        let myyear = date.getFullYear();
        let mymonth = date.getMonth() + 1;
        let myweekday = date.getDate();
        if (mymonth < 10) {
            mymonth = '0' + mymonth;
        }
        if (myweekday < 10) {
            myweekday = '0' + myweekday;
        }
        return mymonth + '-' + myweekday;
    }

    // 获取指定日期的那一周的开始、结束日期
    getWeekStartAndEnd(val) {
        let now = '';
        if (val) {
            now = new Date(formatTimeSafari(val)); // 日期
        } else {
            now = new Date(); // 日期
        }
        let nowDayOfWeek = now.getDay(); // 本周的第几天
        let nowDay = now.getDate(); // 当前日
        let nowMonth = now.getMonth(); // 当前月
        let nowYear = now.getYear(); // 当前年
        let weekStart = this.getWeekStartDate(nowYear, nowMonth, nowDay, nowDayOfWeek);
        this.setState({
            firstWeekList: weekStart,
        });
    }

    // 获得某一周的开始日期
    getWeekStartDate(nowYear, nowMonth, nowDay, nowDayOfWeek) {
        let arr = [];
        for (let i = 1; i <= 5; i++) {
            let weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + i);
            arr.push(this.formatDate(weekStartDate));
        }
        return arr;
    }

    // 查看完整课表
    getComplateSchedule = () => {
        const { dispatch, courseIdList, studentId } = this.props;
        const { startTime, endTime, planMsg } = this.state;
        let planId = getUrlSearch('planId');
        dispatch({
            type: 'studentDetail/getComplateSchedule',
            payload: {
                startTime,
                endTime,
                chooseCoursePlanId: planId ? planId : planMsg.id,
                courseIds: courseIdList || [],
                studentId: studentId ? studentId : '',
            },
        });
    };

    // 时间段存在课程不存的情况下显示时间段
    renderTimeStage = (courseItem, index) => {
        let tdBkgColor = getCourseColor(null, 2);
        return (
            <span
                key={index}
                className={styles.lessonItem}
                style={{ width: '100%', background: tdBkgColor }}
            >
                <span className={styles.name}> 上课时段 </span>
                <span className={styles.time}>
                    {' '}
                    {courseItem.startTime}-{courseItem.endTime}{' '}
                </span>
            </span>
        );
    };

    // 渲染各个时间段下的课程
    renderLesson = (lessonList, start, end) => {
        return (
            lessonList &&
            lessonList.length > 0 &&
            lessonList.map((item, index) => {
                // let leftX = i/courseItem.length*100 + '%';
                let width = (1 / lessonList.length) * 100 + '%';
                let bkgColor = getCourseColor(item.courseName, 1);
                let tdBkgColor = getCourseColor(item.courseName, 2);
                return (
                    <span
                        key={item.courseId}
                        className={styles.lessonItem}
                        style={{ width, background: tdBkgColor }}
                    >
                        <span className={styles.bkgColor} style={{ background: bkgColor }}></span>
                        <span className={styles.name}> {item.courseName} </span>
                        <span className={styles.time}>
                            {' '}
                            {start}-{end}{' '}
                        </span>
                    </span>
                );
            })
        );
    };

    // 渲染各个时间段
    renderCourse = (item, index) => {
        return (
            item &&
            item.length > 0 &&
            item.map((courseItem, idx) => {
                return (
                    <span
                        className={styles.courseItem}
                        key={courseItem.baseScheduleDetailId}
                        style={{
                            top: `${this.getOrdinate(courseItem.startTime)}px`,
                            height: this.getHeight(courseItem.startTime, courseItem.endTime),
                            // background:getCourseColor(item.name, 2),
                        }}
                    >
                        {courseItem.systemResultModels
                            ? this.renderLesson(
                                  courseItem.systemResultModels,
                                  courseItem.startTime,
                                  courseItem.endTime
                              )
                            : courseItem.showSort !== -1
                            ? this.renderTimeStage(courseItem, idx)
                            : null}
                    </span>
                );
            })
        );
    };

    // 处理各个课程时间，获取从坐标位置
    getOrdinate = (startTime) => {
        let time = startTime.split(':'); // 获取时间的时和分
        let hours = parseInt(time[0]);
        let minute = parseInt(time[1]);
        let ordinate = (hours - 7 + minute / 60) * 100; // 以7点为标准
        return ordinate;
    };

    // 处理各个课程的横坐标位置
    getHeight = (start, end) => {
        let startTime = start.split(':');
        let startMin = parseInt(startTime[0]) * 60 + parseInt(startTime[1]); // 计算start共多少分钟
        let endTime = end.split(':');
        let endMin = parseInt(endTime[0]) * 60 + parseInt(endTime[1]); //计算end共多少分钟
        let minute = Math.abs(endMin - startMin); // 获取时间差
        let height = (minute / 60) * 100 + 'px'; // 60分钟=100px
        return height;
    };

    changeTimeStage = (startTime, endTime) => {
        this.setState(
            {
                startTime,
                endTime,
            },
            () => {
                this.getComplateSchedule();
            }
        );
    };

    render() {
        const { detailScheduleInfo, courseStartPeriodList } = this.props;
        const { startTime, endTime, firstWeekList } = this.state;
        const timeLine = [
            '07:00',
            '08:00',
            '09:00',
            '10:00',
            '11:00',
            '12:00',
            '13:00',
            '14:00',
            '15:00',
            '16:00',
            '17:00',
            '18:00',
            '19:00',
            '20:00',
            '21:00',
            '22:00',
        ];
        const weekDay = ['一', '二', '三', '四', '五'];
        return (
            <div className={styles.complateSchedule}>
                <p className={styles.title}>我的课表</p>
                <p className={styles.describe}>（此版本仅供参考，以最终公布日程为准）</p>
                <span className={styles.scheduleTime}>
                    {courseStartPeriodList &&
                        courseStartPeriodList.length > 0 &&
                        courseStartPeriodList.map((item, index) => {
                            let color =
                                startTime == item.startTime && endTime == item.endTime
                                    ? '#4d7fff'
                                    : '#666';
                            let fontSize =
                                startTime == item.startTime && endTime == item.endTime
                                    ? '24px'
                                    : '20px';
                            return (
                                <span
                                    style={{ color, fontSize }}
                                    key={index}
                                    className={styles.time}
                                    onClick={this.changeTimeStage.bind(
                                        this,
                                        item.startTime,
                                        item.endTime
                                    )}
                                >
                                    {' '}
                                    {item.startTimeString} 至 {item.endTimeString}{' '}
                                </span>
                            );
                        })}
                </span>
                <div className={styles.week}>
                    <div className={styles.placeholder}></div>
                    {weekDay &&
                        weekDay.length > 0 &&
                        weekDay.map((item, index) => {
                            return (
                                <div className={styles.weekDay} key={index}>
                                    {' '}
                                    {item}{' '}
                                </div>
                            );
                        })}
                </div>
                <div className={styles.week + ' ' + styles.day}>
                    <div className={styles.placeholder}></div>
                    {firstWeekList &&
                        firstWeekList.length > 0 &&
                        firstWeekList.map((item, index) => {
                            return (
                                <div className={styles.weekDay} key={index}>
                                    {' '}
                                    {item}{' '}
                                </div>
                            );
                        })}
                </div>
                <div className={styles.scheduleContent}>
                    <div className={styles.scheduleContentCenter}>
                        <div className={styles.timeLine}>
                            {timeLine.map((el, i) => {
                                return (
                                    <span className={styles.timeHead} key={i}>
                                        <span className={styles.text}>{el}</span>
                                    </span>
                                );
                            })}
                        </div>
                        <div className={styles.bkgLine}>
                            {detailScheduleInfo &&
                                detailScheduleInfo.length > 0 &&
                                detailScheduleInfo.map((item, index) => {
                                    return (
                                        <div key={index} className={styles.bkgLineWeek}>
                                            {timeLine.map((el, i) => (
                                                <div key={`${i}-${index}`} className={styles.td}>
                                                    {/* {`${i}-${index}`} */}
                                                </div>
                                            ))}
                                            {this.renderCourse(item.list, index)}
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
