import React, { Fragment, PureComponent } from 'react';
import styles from './index.less';
import { Icon, Select, Radio, Spin, Button, Alert, message } from 'antd';
import { Modal } from 'antd-mobile';

import { connect } from 'dva';
import moment from 'moment';
import { intoChineseNumber, weekDayAbbreviationEn } from '../../../utils/utils';
import { trans } from '../../../utils/i18n';
@connect((state) => ({
    searchExchangeLoading: state.replace.searchExchangeLoading,
    newListExchangeList: state.replace.newListExchangeList,
    addLessonList: state.replace.addLessonList,
    selectedAddLessonItem: state.replace.selectedAddLessonItem,
    teacherCalendarList: state.replace.teacherCalendarList,
    selectedTeacherItem: state.replace.selectedTeacherItem,
}))
export default class Calendar extends PureComponent {
    state = {
        timeLine: [
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
        ],
        currentClickLessonItem: {},
        confirmExchangeModalVisible: false,
    };

    componentDidMount() {
        this.getTitle();
    }

    getTitle = () => {
        const { selectedTeacherItem, currentLang } = this.props;
        document.title =
            currentLang === 'cn'
                ? `${selectedTeacherItem.name}的日程`
                : `${selectedTeacherItem.englishName}'s Schedule`;
    };

    getLessonItemTop = (lessonItem) => {
        let startTime = moment(lessonItem.startTime).format('HH:mm');
        let startTimeDiffHours = startTime.split(':')[0] - 8;
        let startTimeDiffMinutes = startTime.split(':')[1];
        return `${startTimeDiffHours * 60 + startTimeDiffMinutes * 1}px`;
    };

    clickLessonItem = (lessonItem, e) => {
        if (
            e.target.style.backgroundColor === 'rgb(11, 197, 72)' ||
            !e.target.style.backgroundColor
        ) {
            this.setState(
                {
                    currentClickLessonItem: lessonItem,
                },
                () => {
                    this.setState({
                        confirmExchangeModalVisible: true,
                    });
                }
            );
        }
    };

    cancelConfirmExchangeModal = () => {
        this.setState({
            confirmExchangeModalVisible: false,
        });
    };

    cancelRightContent = () => {
        const { changeCalendarModalVisible } = this.props;
        changeCalendarModalVisible && changeCalendarModalVisible();
    };

    getWeekList = () => {
        const { selectedAddLessonItem, currentLang } = this.props;
        let weekList =
            currentLang === 'cn'
                ? [
                      {
                          weekDay: '一',
                      },
                      {
                          weekDay: '二',
                      },
                      {
                          weekDay: '三',
                      },
                      {
                          weekDay: '四',
                      },
                      {
                          weekDay: '五',
                      },
                  ]
                : [
                      {
                          weekDay: 'Mon',
                      },
                      {
                          weekDay: 'Tue',
                      },
                      {
                          weekDay: 'Wed',
                      },
                      {
                          weekDay: 'Thu',
                      },
                      {
                          weekDay: 'Fri',
                      },
                  ];

        //所选课节处于当周周几
        let targetMomentWeekDay = moment(selectedAddLessonItem.source.startTimeMillion).format('E');

        weekList = weekList.map((item, index) => {
            //当周 周一/周二/... 与所选课节weekDay相差几天
            let target = targetMomentWeekDay - (index + 1);
            return {
                ...item,
                date: moment(selectedAddLessonItem.source.startTimeMillion)
                    .subtract(target, 'days')
                    .format('MM.DD'),
            };
        });
        return weekList.map((item) => (
            <div className={styles.week}>
                <div className={styles.date}>{item.date}</div>
                <div className={styles.weekDay}>{item.weekDay}</div>
            </div>
        ));
    };

    render() {
        const { searchExchangeLoading, teacherCalendarList, selectedTeacherItem, currentLang } =
            this.props;
        const { timeLine, currentClickLessonItem, confirmExchangeModalVisible } = this.state;
        return (
            <Spin spinning={searchExchangeLoading} wrapperClassName={styles.rightContentWrapper}>
                <div className={styles.searchExchange}>
                    <div className={styles.weekWrapper}>{this.getWeekList()}</div>
                    <div className={styles.lessonListWrapper}>
                        <div className={styles.timeLine}>
                            {timeLine.map((item) => (
                                <div className={styles.timeLineItem}>{item}</div>
                            ))}
                        </div>
                        <div className={styles.lessonList}>
                            {teacherCalendarList.slice(0, 5).map((dayLessonList) => (
                                <div className={styles.dayLessonList}>
                                    {dayLessonList.map((lessonItem) => {
                                        return (
                                            <div
                                                style={{
                                                    height: `${
                                                        (lessonItem.endTime -
                                                            lessonItem.startTime) /
                                                        1000 /
                                                        60
                                                    }px`,
                                                    top: this.getLessonItemTop(lessonItem),
                                                    backgroundColor: '#0BC548',
                                                    color: '#FFF',
                                                    cursor: 'pointer',
                                                }}
                                                className={
                                                    styles.lessonItem +
                                                    ' ' +
                                                    (currentClickLessonItem.templateId ===
                                                        lessonItem.templateId &&
                                                        styles.clickLessonItem)
                                                }
                                                onClick={(e) => this.clickLessonItem(lessonItem, e)}
                                            >
                                                {currentLang === 'cn'
                                                    ? lessonItem.name
                                                    : lessonItem.eName}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                        {confirmExchangeModalVisible && (
                            <Modal
                                wrapClassName={styles.confirmExchange}
                                visible={confirmExchangeModalVisible}
                                closable
                                transparent
                                maskClosable
                                footer={[]}
                                onClose={this.cancelConfirmExchangeModal}
                            >
                                <Fragment>
                                    <div className={styles.confirmHeader}>
                                        <div className={styles.courseName}>
                                            {currentLang === 'cn'
                                                ? currentClickLessonItem.name
                                                : currentClickLessonItem.eName}
                                        </div>
                                    </div>
                                    <div className={styles.confirmMainContent}>
                                        <div className={styles.timeWrapper}>
                                            <div>
                                                {trans(
                                                    'global.replace.pc.exchangeCourse.time',
                                                    '时间'
                                                )}
                                                {moment(currentClickLessonItem.startTime).format(
                                                    'MM.DD'
                                                )}
                                                {currentLang === 'cn'
                                                    ? `周${intoChineseNumber(
                                                          moment(
                                                              currentClickLessonItem.startTime
                                                          ).format('E')
                                                      )}`
                                                    : weekDayAbbreviationEn(
                                                          moment(
                                                              currentClickLessonItem.startTimeMillion
                                                          ).format('E')
                                                      )}
                                            </div>
                                            <div className={styles.time}>
                                                {`(${moment(
                                                    currentClickLessonItem.startTime
                                                ).format('HH:mm')} ~ ${moment(
                                                    currentClickLessonItem.endTime
                                                ).format('HH:mm')})`}
                                            </div>
                                        </div>
                                        <div className={styles.studentGroups}>
                                            {trans(
                                                'global.replace.pc.exchangeCourse.class',
                                                '班级'
                                            )}
                                            {`${currentClickLessonItem.studentGroups
                                                ?.map((item) =>
                                                    currentLang === 'cn' ? item.name : item.eName
                                                )
                                                .join('、')}`}
                                        </div>
                                        <div className={styles.mainTeachers}>
                                            {trans(
                                                'global.replace.pc.exchangeCourse.teacher',
                                                '教师'
                                            )}
                                            <div className={styles.teacherWrapper}>
                                                {currentClickLessonItem.teachers?.map(
                                                    (teacherItem) => (
                                                        <div className={styles.teacherItem}>
                                                            <div>
                                                                {currentLang === 'cn'
                                                                    ? teacherItem.userName
                                                                    : teacherItem.userEname}
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Fragment>
                            </Modal>
                        )}
                    </div>
                </div>
            </Spin>
        );
    }
}
