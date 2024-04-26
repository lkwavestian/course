import React, { Fragment, PureComponent } from 'react';
import styles from './index.less';
import { Icon, Select, Radio, Spin, Button, Alert, message } from 'antd';
import { Modal } from 'antd-mobile';
import { connect } from 'dva';
import moment from 'moment';
import { intoChineseNumber, weekDayAbbreviationEn } from '../../../utils/utils';
import { trans } from '../../../utils/i18n';
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

    componentDidMount() {
        this.initialData();
        this.getTitle();
    }

    getTitle = () => {
        const { selectedAddLessonItem } = this.props;
        document.title = `${selectedAddLessonItem.source.studentGroups[0].name}课表`;
    };

    initialData = async () => {
        const { dispatch, selectedAddLessonItem } = this.props;
        console.log('selectedAddLessonItem :>> ', selectedAddLessonItem);
        let { source } = selectedAddLessonItem;

        await dispatch({
            type: 'replace/changeSearchExchangeLoading',
            payload: true,
        });
        await dispatch({
            type: 'replace/findClassSchedule',
            payload: {
                id: source.versionId,
                groupIds: source.studentGroups.map((item) => item.id),
            },
        });
        await dispatch({
            type: 'replace/getNewListExchange',
            payload: {
                studentGroupId: source.studentGroups[0].id,
                versionId: source.versionId,
                resultId: source.id,
                changeCourse: true,
            },
        });
        await dispatch({
            type: 'replace/changeSearchExchangeLoading',
            payload: false,
        });
    };

    getLessonItemTop = (lessonItem) => {
        let { startTime } = lessonItem;
        let startTimeDiffHours = startTime.split(':')[0] - 8;
        let startTimeDiffMinutes = startTime.split(':')[1];
        return `${startTimeDiffHours * 60 + startTimeDiffMinutes * 1}px`;
    };

    judgeLessonItemShow = (lessonItem) => {
        const { selectedAddLessonItem } = this.props;
        if (!lessonItem.detail) {
            return false;
        }
        if (lessonItem.studentGroups.length !== 1) {
            return false;
        }
        if (lessonItem.studentGroups[0].id !== selectedAddLessonItem.source.studentGroups[0].id) {
            return false;
        }
        return true;
    };

    getLessonItemBgcAndFc = (lessonItem) => {
        const { newListExchangeList, selectedAddLessonItem } = this.props;
        if (selectedAddLessonItem.source.id === lessonItem.resultId) {
            return {
                backgroundColor: '#F6BD16',
                color: '#01113D',
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
                backgroundColor: '#30BF78',
                color: '#FFF',
                cursor: 'pointer',
            };
        }
    };

    clickLessonItem = (lessonItem, e) => {
        if (
            e.target.style.backgroundColor === 'rgb(48, 191, 120)' ||
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
        const { dispatch, addLessonList, history } = this.props;
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
        history.push('/replace/mobile/application/index');
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
                    <div className={styles.weekWrapper}>{this.getWeekList()}</div>
                    <div className={styles.lessonListWrapper}>
                        <div className={styles.timeLine}>
                            {timeLine.map((item) => (
                                <div className={styles.timeLineItem}>{item}</div>
                            ))}
                        </div>
                        <div className={styles.lessonList}>
                            {classScheduleList[0]?.resultList.slice(0, 5).map((dayLessonList) => (
                                <div className={styles.dayLessonList}>
                                    {dayLessonList.map((lessonItem) => {
                                        return (
                                            this.judgeLessonItemShow(lessonItem) && (
                                                <div
                                                    style={{
                                                        height: `${lessonItem.timeCost}px`,
                                                        top: this.getLessonItemTop(lessonItem),
                                                        ...this.getLessonItemBgcAndFc(lessonItem),
                                                    }}
                                                    className={
                                                        styles.lessonItem +
                                                        ' ' +
                                                        (currentClickLessonItem.id ===
                                                            lessonItem.id && styles.clickLessonItem)
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
                                visible={confirmExchangeModalVisible}
                                transparent
                            >
                                <Fragment>
                                    <div className={styles.confirmHeader}>
                                        <span>
                                            {currentLang === 'cn'
                                                ? currentClickLessonItem.name
                                                : currentClickLessonItem.eName}
                                        </span>
                                        <Icon
                                            type="close"
                                            onClick={this.cancelConfirmExchangeModal}
                                        />
                                    </div>
                                    <div className={styles.confirmMainContent}>
                                        <div className={styles.msg}>
                                            <div className={styles.msgItem}>
                                                <Icon type="clock-circle" />
                                                <span className={styles.time}>
                                                    <span>
                                                        {currentLang === 'cn'
                                                            ? moment(
                                                                  currentClickLessonItem.startTimeMillion
                                                              ).format('MM月DD日')
                                                            : moment(
                                                                  currentClickLessonItem.startTimeMillion
                                                              )
                                                                  .format('ll')
                                                                  .split(',')[0]}
                                                    </span>
                                                    <span>
                                                        {currentClickLessonItem.startTime} -{' '}
                                                        {currentClickLessonItem.endTime}
                                                    </span>
                                                    <span className={styles.lesson}>
                                                        {currentLang === 'cn'
                                                            ? `周${intoChineseNumber(
                                                                  currentClickLessonItem.weekDay
                                                              )}第${
                                                                  currentClickLessonItem.courseSort
                                                              }节`
                                                            : `${weekDayAbbreviationEn(
                                                                  currentClickLessonItem.weekDay
                                                              )} Period ${
                                                                  currentClickLessonItem.courseSort
                                                              }`}
                                                    </span>
                                                </span>
                                            </div>
                                            <div className={styles.msgItem}>
                                                <Icon type="team" className={styles.userIcon} />
                                                <div className={styles.userList}>
                                                    {currentClickLessonItem.detail.studentGroups.map(
                                                        (userItem) => (
                                                            <div className={styles.userItem}>
                                                                <span>
                                                                    {currentLang === 'cn'
                                                                        ? userItem.name
                                                                        : userItem.englishName}
                                                                </span>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                            <div className={styles.msgItem}>
                                                <Icon type="user" className={styles.userIcon} />
                                                <div className={styles.userList}>
                                                    {currentClickLessonItem.detail.mainTeachers.map(
                                                        (userItem) => (
                                                            <div className={styles.userItem}>
                                                                <span>
                                                                    {currentLang === 'cn'
                                                                        ? userItem.name
                                                                        : userItem.englishName}
                                                                </span>
                                                                <span className={styles.iconList}>
                                                                    <Icon
                                                                        type="calendar"
                                                                        onClick={() =>
                                                                            this.getTeacherCalendarList(
                                                                                userItem
                                                                            )
                                                                        }
                                                                    />
                                                                </span>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className={styles.btn}
                                            onClick={this.okConfirmExchangeModal}
                                        >
                                            {trans('global.replace.chooseToSwitch', '选TA换课')}
                                        </div>
                                    </div>
                                </Fragment>
                            </Modal>
                        )}
                    </div>
                    <Alert
                        message={trans(
                            'global.replace.clickToSwitch',
                            '点击任意课程卡片可进行课节调换'
                        )}
                        type="warning"
                        showIcon
                        closable
                        className={styles.hintMsg}
                    />
                </div>
            </Spin>
        );
    }
}
