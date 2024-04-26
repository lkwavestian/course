import React, { Fragment, PureComponent } from 'react';
import styles from './index.less';
import { Icon, Select, Radio, Spin, Button, Alert, Modal, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { intoChineseNumber, weekDayAbbreviationEn } from '../../../../utils/utils';
import { trans } from '../../../../utils/i18n';
@connect((state) => ({
    classScheduleList: state.replace.classScheduleList,
    searchExchangeLoading: state.replace.searchExchangeLoading,
    newListExchangeList: state.replace.newListExchangeList,
    addLessonList: state.replace.addLessonList,
    selectedAddLessonItem: state.replace.selectedAddLessonItem,
}))
export default class SearchExchange extends PureComponent {
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

    getLessonItemTop = (lessonItem) => {
        let { startTime } = lessonItem;
        let startTimeDiffHours = startTime.split(':')[0] - 8;
        let startTimeDiffMinutes = startTime.split(':')[1];
        return `${startTimeDiffHours * 60 + startTimeDiffMinutes * 1}px`;
    };

    judgeLessonItemShow = (lessonItem) => {
        if (!lessonItem.detail) {
            return false;
        }
        if (lessonItem.studentGroups.length !== 1) {
            return false;
        }
        const { clickStudentGroupId } = this.props;
        if (lessonItem.studentGroups[0].id !== clickStudentGroupId) {
            return false;
        }
        return true;
    };

    getLessonItemBgcAndFc = (lessonItem) => {
        const { newListExchangeList, selectedAddLessonItem } = this.props;
        if (selectedAddLessonItem.source.id === lessonItem.resultId) {
            return {
                backgroundColor: '#FD9004',
                color: '#FFF',
            };
        }
        let findExchangeItem = newListExchangeList.find(
            (item) =>
                item.canSelect &&
                item.weekDay == lessonItem.weekDay &&
                item.lesson == lessonItem.realLesson &&
                item.resultId == lessonItem.resultId
        );

        if (findExchangeItem && findExchangeItem.canSelect === 1) {
            return {
                backgroundColor: '#0BC548',
                color: '#FFF',
                cursor: 'pointer',
            };
        }
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

    okConfirmExchangeModal = () => {
        const { dispatch, addLessonList } = this.props;
        const { currentClickLessonItem } = this.state;

        dispatch({
            type: 'replace/setAddLessonList',
            payload: addLessonList.map((item) => {
                if (item.isSelected) {
                    return {
                        ...item,
                        target: {
                            ...currentClickLessonItem.detail,
                            endTimeMillion: currentClickLessonItem.endTimeMillion,
                            startTimeMillion: currentClickLessonItem.startTimeMillion,
                        },
                    };
                } else {
                    return item;
                }
            }),
        });
        this.cancelConfirmExchangeModal();
    };

    cancelRightContent = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'replace/setRightContentType',
            payload: '',
        });
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

    getTeacherCalendarList = (teacherItem) => {
        const { dispatch, changeCalendarModalVisible, selectedAddLessonItem } = this.props;
        dispatch({
            type: 'replace/getTeacherCalendarList',
            payload: {
                queryStartTime: moment(selectedAddLessonItem.source.startTimeMillion)
                    .startOf('isoWeek')
                    .valueOf(),
                queryEndTime: moment(selectedAddLessonItem.source.startTimeMillion)
                    .endOf('isoWeek')
                    .valueOf(),
                teacherIds: [teacherItem.id],
            },
        });
        dispatch({
            type: 'replace/setSelectedTeacherItem',
            payload: teacherItem,
        });
        changeCalendarModalVisible && changeCalendarModalVisible();
    };

    render() {
        const { classScheduleList, searchExchangeLoading, selectedAddLessonItem, currentLang } =
            this.props;
        const { timeLine, currentClickLessonItem, confirmExchangeModalVisible } = this.state;
        return (
            <Spin spinning={searchExchangeLoading} wrapperClassName={styles.rightContentWrapper}>
                <div className={styles.searchExchange}>
                    <div className={styles.header}>
                        <Icon
                            className={styles.icon}
                            type="close"
                            onClick={this.cancelRightContent}
                        />
                        <span className={styles.text}>
                            {currentLang === 'cn'
                                ? `${selectedAddLessonItem.source?.studentGroups[0]?.name}的课表`
                                : `${selectedAddLessonItem.source?.studentGroups[0]?.englishName}'s Schedule`}
                        </span>

                        <Alert
                            message={trans(
                                'global.replace.clickToSwitch',
                                '点击任意课程卡片可进行课节调换'
                            )}
                            type="info"
                            showIcon
                            closable
                            className={styles.hintMsg}
                        />
                    </div>
                    <div className={styles.mainContent}>
                        <div className={styles.weekWrapper}>{this.getWeekList()}</div>
                        <div className={styles.lessonListWrapper}>
                            <div className={styles.timeLine}>
                                {timeLine.map((item) => (
                                    <div className={styles.timeLineItem}>{item}</div>
                                ))}
                            </div>
                            <div className={styles.lessonList}>
                                {classScheduleList[0]?.resultList
                                    .slice(0, 5)
                                    .map((dayLessonList) => (
                                        <div className={styles.dayLessonList}>
                                            {dayLessonList.map((lessonItem) => {
                                                return (
                                                    this.judgeLessonItemShow(lessonItem) && (
                                                        <div
                                                            style={{
                                                                height: `${lessonItem.timeCost}px`,
                                                                top: this.getLessonItemTop(
                                                                    lessonItem
                                                                ),
                                                                ...this.getLessonItemBgcAndFc(
                                                                    lessonItem
                                                                ),
                                                            }}
                                                            className={
                                                                styles.lessonItem +
                                                                ' ' +
                                                                (currentClickLessonItem.id ===
                                                                    lessonItem.id &&
                                                                    styles.clickLessonItem)
                                                            }
                                                            onClick={(e) =>
                                                                this.clickLessonItem(lessonItem, e)
                                                            }
                                                        >
                                                            {currentLang === 'cn'
                                                                ? lessonItem.name
                                                                : lessonItem.eName}
                                                        </div>
                                                    )
                                                );
                                            })}
                                        </div>
                                    ))}
                            </div>
                            {confirmExchangeModalVisible && (
                                <Modal
                                    wrapClassName={styles.confirmExchange}
                                    title="Basic Modal"
                                    visible={confirmExchangeModalVisible}
                                    width={325}
                                    closable={false}
                                    getContainer={false}
                                    centered={true}
                                    onCancel={this.cancelConfirmExchangeModal}
                                    footer={
                                        <div className={styles.confirmFooter}>
                                            <Alert
                                                message={trans(
                                                    'global.replace.pc.exchangeCourse.ensureCommunicate',
                                                    '请确保提前和老师沟通过'
                                                )}
                                                type="info"
                                                showIcon
                                                className={styles.confirmHintMsg}
                                            />
                                            <Button
                                                type="primary"
                                                onClick={this.okConfirmExchangeModal}
                                            >
                                                {trans('global.replace.chooseToSwitch', '选TA换课')}
                                            </Button>
                                        </div>
                                    }
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
                                                    {currentLang === 'cn'
                                                        ? `周${intoChineseNumber(
                                                              moment(
                                                                  currentClickLessonItem.startTimeMillion
                                                              ).format('E')
                                                          )}第${
                                                              currentClickLessonItem.courseSort
                                                          }节`
                                                        : `${weekDayAbbreviationEn(
                                                              moment(
                                                                  currentClickLessonItem.startTimeMillion
                                                              ).format('E')
                                                          )} Period ${
                                                              currentClickLessonItem.courseSort
                                                          }`}
                                                </div>
                                                <div className={styles.time}>
                                                    {`(${moment(
                                                        currentClickLessonItem.startTimeMillion
                                                    ).format('MM.DD HH:mm')} - ${moment(
                                                        currentClickLessonItem.endTimeMillion
                                                    ).format('MM.DD HH:mm')})`}
                                                </div>
                                            </div>
                                            <div className={styles.studentGroups}>
                                                {trans(
                                                    'global.replace.pc.exchangeCourse.class',
                                                    '班级'
                                                )}
                                                {`${currentClickLessonItem.detail?.studentGroups
                                                    ?.map((item) =>
                                                        currentLang === 'cn'
                                                            ? item.name
                                                            : item.englishName
                                                    )
                                                    .join('、')}`}
                                            </div>
                                            <div className={styles.mainTeachers}>
                                                {trans(
                                                    'global.replace.pc.exchangeCourse.teacher',
                                                    '教师'
                                                )}
                                                <div className={styles.teacherWrapper}>
                                                    {currentClickLessonItem.detail.mainTeachers.map(
                                                        (teacherItem) => (
                                                            <div className={styles.teacherItem}>
                                                                <div>
                                                                    {currentLang === 'cn'
                                                                        ? teacherItem.name
                                                                        : teacherItem.englishName}
                                                                </div>
                                                                <span
                                                                    className={styles.calendar}
                                                                    onClick={() =>
                                                                        this.getTeacherCalendarList(
                                                                            teacherItem
                                                                        )
                                                                    }
                                                                >
                                                                    <Icon type="calendar" />
                                                                    <span>
                                                                        {trans(
                                                                            'global.replace.pc.exchangeCourse.viewSchedule',
                                                                            'TA的日程'
                                                                        )}
                                                                    </span>
                                                                </span>
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
                </div>
            </Spin>
        );
    }
}
