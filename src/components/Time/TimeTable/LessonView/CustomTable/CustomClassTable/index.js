import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { flattenDeep, isEmpty, isEqual, uniqWith, remove } from 'lodash';
import { Spin, Row, Col, Popover, message, Icon, Modal } from 'antd';
import icon from '../../../../../../icon.less';
import { trans } from '../../../../../../utils/i18n';

const { confirm } = Modal;

let lookDetailTimeOut = null; //防止双击出发单击两次

@connect((state) => ({
    lessonViewTableLoading: state.lessonView.lessonViewTableLoading,
    newCanChangeCourse:
        (state.exchangeCourse.exchangeResult && state.exchangeCourse.exchangeResult.content) || [],
    move: (state.exchangeCourse.move && state.exchangeCourse.move.content) || [],
    lessonViewCustomValue: state.lessonView.lessonViewCustomValue,
    lessonViewCustomLabel: state.lessonView.lessonViewCustomLabel,
    lessonViewExchangeCustomCourseStatus: state.lessonView.lessonViewExchangeCustomCourseStatus,
    conflictInformation: state.lessonView.conflictInformation,
    newCanCheckScheduleList: state.timeTable.newCanCheckScheduleList, // 待排课节可选课节列表
    referenceTableLoadingStatus: state.lessonView.referenceTableLoadingStatus,
    currentStudentGroup: state.lessonView.currentStudentGroup,

    //语言
    currentLang: state.global.currentLang,
    displayType: state.timeTable.displayType,

    displayType: state.timeTable.displayType,
    lessonViewTableHeightRatio: state.timeTable.lessonViewTableHeightRatio,
    displayDirection: state.timeTable.displayDirection,
}))
export default class CustomClassTable extends PureComponent {
    state = {
        doubleClickUtil: {},
        clickUtil: {},
        exchangeStudentGroupId: '',
        conflictHtmlVisible: false,
        currentClickLessonItem: {},
        clickLocation: '',
        willArrangeClickIndex: '',
        willArrangeDoubleClickIndex: '',
        notArrangeClickStatus: false,
        customPopoverVisible: false,
    };
    getLessonList = (timeAttribution, weekDayArrLength) => {
        const { classSchedule } = this.props;
        let weekLessonList = classSchedule.resultList;
        return weekLessonList
            .map((dayLessonList) => {
                let res = [];
                dayLessonList.map((lessonItem) => {
                    if (lessonItem.lesson > 0 && lessonItem.timeAttribution === timeAttribution) {
                        if (isEmpty(res[lessonItem.lesson - 1])) {
                            res[lessonItem.lesson - 1] = [lessonItem];
                        } else {
                            res[lessonItem.lesson - 1].push(lessonItem);
                        }
                    }
                });
                return res
                    .filter((item) => !isEmpty(item))
                    .map((item) => {
                        return uniqWith(item, (obj, other) => {
                            if (obj.detail || other.detail) {
                                return false;
                            } else {
                                return obj.weekDay === other.weekDay && obj.lesson === other.lesson;
                            }
                        });
                    });
            })
            .slice(0, weekDayArrLength);
    };

    getBgcColor = (util, lessonType, index) => {
        //lessonType: 1表示ac课节，0表示作息,-1表示空格子
        const { lessonViewExchangeCustomCourseStatus, classSchedule, currentStudentGroup } =
            this.props;
        const { doubleClickUtil, clickLocation, willArrangeDoubleClickIndex } = this.state;
        const { courseColor } = util;

        //空格子或者作息格子，不给背景颜色
        if (lessonType === -1 || lessonType === 0) {
            return '';
        }

        //在调换课状态下，并且操作的班级是当前班级
        if (
            lessonViewExchangeCustomCourseStatus &&
            classSchedule.studentGroup.id === currentStudentGroup
        ) {
            //如果是当前课在调换，给背景蓝色，否则给课程颜色

            //如果有util字段，当前是课程表单元格，否则当前是待排区域单元格
            let lessonItemType = util.detail ? 'timeTableItem' : 'willArrangeItem';
            if (lessonItemType === 'timeTableItem') {
                if (
                    clickLocation === 'timeTable' &&
                    doubleClickUtil.resultId &&
                    doubleClickUtil.resultId === util.resultId
                ) {
                    return '#3798ff';
                }
            }
            if (lessonItemType === 'willArrangeItem') {
                if (clickLocation === 'willArrange' && index === willArrangeDoubleClickIndex) {
                    return '#3798ff';
                }
            }

            //淡化背景颜色，透明度为原来的10%，
            if (courseColor) {
                return `${courseColor}1a`;
            } else {
                return '#3798ff1a';
            }
        }

        //如果有课程颜色，就给课程颜色，否则给蓝色
        if (courseColor) {
            return courseColor;
        } else {
            return '#3798ff';
        }
    };

    getFontColor = (util, lessonType, index) => {
        //lessonType: 1表示ac课节，0表示作息,-1表示空格子
        const { lessonViewExchangeCustomCourseStatus, classSchedule, currentStudentGroup } =
            this.props;
        const { doubleClickUtil, clickLocation, willArrangeDoubleClickIndex } = this.state;
        const { courseColor } = util;

        //空格子或者作息格子 给字体透明
        if (lessonType === -1 || lessonType === 0) {
            return 'rgb(102, 102, 102)';
        }

        //在调换课状态下，并且操作的班级是当前班级
        //如果是当前课在调换，给字体白色，否则给课程颜色
        if (
            lessonViewExchangeCustomCourseStatus &&
            classSchedule.studentGroup.id === currentStudentGroup
        ) {
            //如果有util字段，当前是课程表单元格，否则当前是待排区域单元格
            let lessonItemType = util.detail ? 'timeTableItem' : 'willArrangeItem';
            if (lessonItemType === 'timeTableItem') {
                if (
                    clickLocation === 'timeTable' &&
                    doubleClickUtil.resultId &&
                    doubleClickUtil.resultId === util.resultId
                ) {
                    return '#fff';
                }
            }
            if (lessonItemType === 'willArrangeItem') {
                if (clickLocation === 'willArrange' && index === willArrangeDoubleClickIndex) {
                    return '#fff';
                }
            }

            if (courseColor) {
                return courseColor;
            } else {
                return '#3798ff';
            }
        }

        //正常展示状态，给字体白色
        return '#fff';
    };

    getBorder = (util, index) => {
        const {
            newCanChangeCourse,
            lessonViewExchangeCustomCourseStatus,
            currentStudentGroup,
            classSchedule,
        } = this.props;
        const { clickLocation, clickUtil, willArrangeClickIndex } = this.state;
        let { resultId, studentGroups, weekDay, realLesson } = util;

        //点击位置为课表区域时
        if (clickLocation === 'timeTable') {
            //未排课状态下
            if (!lessonViewExchangeCustomCourseStatus) {
                //给点击课节边框蓝色,否则不给边框颜色
                if (
                    util.detail &&
                    util.acId === clickUtil.acId &&
                    classSchedule.studentGroup.id === currentStudentGroup
                ) {
                    return '2px solid rgb(20, 118, 255)';
                } else {
                    return '';
                }
            } else {
                //排课状态下双击后，可排课节边框为蓝色，否则不给颜色
                let newCanChangeCourseFlattenList = flattenDeep(newCanChangeCourse);
                let findItem = newCanChangeCourseFlattenList.find((item) => {
                    if (
                        item.canSelect === 1 &&
                        item.weekDay == weekDay &&
                        item.lesson == realLesson &&
                        item.resultId == resultId
                    ) {
                        return true;
                    }
                });

                if (findItem) {
                    return '2px solid rgb(20, 118, 255)';
                } else {
                    return '';
                }
            }
        }

        //点击位置为待排区域时，给点击课节蓝色边框
        if (clickLocation === 'willArrange') {
            if (willArrangeClickIndex === index) {
                return '2px solid rgb(20, 118, 255)';
            }
        }
    };

    getWeekDayRow = (
        timeAttribution,
        lessonList,
        maxItemNum,
        lessonItemWidth,
        preTimeAttribution
    ) => {
        const {
            lessonViewExchangeCustomCourseStatus,
            currentStudentGroup,
            classSchedule,
            lessonViewTableHeightRatio,
            displayDirection,
        } = this.props;
        const { conflictHtmlVisible, currentClickLessonItem, notArrangeClickStatus } = this.state;
        // let diffLessonNum = timeAttribution = 1 ? 0 : timeAttribution = 2 ?
        return (
            <div className={styles.weekDayRowWrapper}>
                <div className={styles.halfDayItem} style={{ width: '8%' }}>
                    {new Array(maxItemNum).fill(1).map((item, index) => {
                        return (
                            <div
                                className={styles.halfDayItemDiv}
                                style={{
                                    height: `${40 * lessonViewTableHeightRatio}px`,
                                    lineHeight: `${40 * lessonViewTableHeightRatio}px`,
                                }}
                            >
                                {index + preTimeAttribution + 1}
                            </div>
                        );
                    })}
                </div>
                {lessonList.map((dayLessonList) => (
                    <div className={styles.weekDayCol} style={{ width: lessonItemWidth }}>
                        {this.concatDayLessonList(maxItemNum, dayLessonList).map((lessonList) => (
                            <div
                                className={styles.lessonItemWrapper}
                                style={{
                                    height: `${40 * lessonViewTableHeightRatio}px`,
                                    flexDirection: displayDirection == 1 ? 'column' : 'row',
                                }}
                            >
                                {lessonList.map((lessonItem, index) => {
                                    //1表示ac课节，0表示作息,-1表示空格子
                                    let lessonType = isEmpty(lessonItem)
                                        ? -1
                                        : lessonItem.detail
                                        ? 1
                                        : 0;
                                    let borderColor = this.getBorder(lessonItem);

                                    return (
                                        <Popover
                                            content={
                                                !notArrangeClickStatus &&
                                                conflictHtmlVisible &&
                                                isEqual(currentClickLessonItem, lessonItem) &&
                                                this.renderConflictHtml(
                                                    this.getMoveCourseItem(lessonItem, true),
                                                    lessonItem,
                                                    'compelExchange'
                                                )
                                            }
                                            placement="right"
                                            trigger="click"
                                            visible={
                                                !notArrangeClickStatus &&
                                                conflictHtmlVisible &&
                                                isEqual(currentClickLessonItem, lessonItem)
                                            }
                                        >
                                            <div
                                                className={styles.lessonItem}
                                                style={{
                                                    backgroundColor: this.getBgcColor(
                                                        lessonItem,
                                                        lessonType,
                                                        index
                                                    ),
                                                    color: this.getFontColor(
                                                        lessonItem,
                                                        lessonType,
                                                        index
                                                    ),
                                                    // border: this.getBorder(lessonItem),
                                                    borderTop: borderColor,
                                                    borderLeft: borderColor,
                                                    borderBottom: borderColor
                                                        ? borderColor
                                                        : displayDirection === 1
                                                        ? lessonList.length > 1 &&
                                                          index !== lessonList.length - 1 &&
                                                          '1px solid #e4e4e4'
                                                        : '',
                                                    borderRight: borderColor
                                                        ? borderColor
                                                        : displayDirection === 2
                                                        ? lessonList.length > 1 &&
                                                          index !== lessonList.length - 1 &&
                                                          '1px solid #e4e4e4'
                                                        : '',
                                                    width: this.getLessonItemStyle(
                                                        'width',
                                                        lessonList
                                                    ),
                                                    height: this.getLessonItemStyle(
                                                        'height',
                                                        lessonList
                                                    ),
                                                    flexDirection:
                                                        displayDirection == 1 ? 'row' : 'column',
                                                }}
                                                // span={24 / lessonList.length}
                                                onDoubleClick={() =>
                                                    this.handleCourseDoubleClick(lessonItem)
                                                }
                                                onClick={(e) =>
                                                    this.handleCourseClick(lessonItem, e)
                                                }
                                            >
                                                {this.getLessonItemContent(
                                                    lessonType,
                                                    lessonList,
                                                    lessonItem,
                                                    this.getNameHiddenHeight(lessonList)
                                                )}
                                            </div>
                                        </Popover>
                                    );
                                })}
                                {lessonViewExchangeCustomCourseStatus &&
                                    classSchedule.studentGroup.id === currentStudentGroup &&
                                    this.getExchangePlaceHolder(lessonList)}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    };

    getExchangePlaceHolder = (lessonList) => {
        const { currentClickLessonItem, clickLocation } = this.state;

        let lessonItem = lessonList[0];
        let moveCourseItem = this.getMoveCourseItem(lessonItem);
        if (!moveCourseItem) return;

        if (moveCourseItem.canSelect === 1) {
            return (
                <div
                    className={styles.exchangePlaceHolder}
                    style={{ backgroundColor: '#95de64' }}
                    onClick={() => this.exchangeMoveHandle(moveCourseItem, lessonItem, 2)}
                >
                    <span>可排</span>
                </div>
            );
        }
        if (moveCourseItem.canSelect == 2 || moveCourseItem.canSelect === 4) {
            const { conflictHtmlVisible } = this.state;
            return (
                <Popover
                    content={this.renderConflictHtml(moveCourseItem, lessonItem, 1)}
                    placement="right"
                    trigger="click"
                    visible={conflictHtmlVisible && isEqual(currentClickLessonItem, lessonItem)}
                >
                    <div
                        className={styles.exchangePlaceHolder}
                        style={{
                            backgroundColor: moveCourseItem.canSelect == 2 ? '#e9ce91' : '#e6e6e6',
                        }}
                        onClick={() => this.notArrangeClick(lessonItem, true, 'gray')}
                    >
                        <span>不可排</span>
                    </div>
                </Popover>
            );
        }
    };

    concatDayLessonList = (maxItemNum, dayLessonList) => {
        let differ = maxItemNum - dayLessonList.length;
        if (differ > 0) {
            return dayLessonList.concat(Array(differ).fill([{}]));
        } else {
            return dayLessonList;
        }
    };

    getRowPlaceHolder = (weekDayArr, lessonItemWidth) => (
        <div className={styles.rowPlaceHolder}>
            {['additional'].concat(weekDayArr).map((item) => (
                <div
                    style={{
                        width: item === 'additional' ? '3vw' : lessonItemWidth,
                    }}
                    className={styles.rowPlaceHolderItem}
                ></div>
            ))}
        </div>
    );

    handleCourseClick = (lessonItem, e) => {
        const { dispatch, lessonViewExchangeCustomCourseStatus, transmitState, classSchedule } =
            this.props;
        let currentTarget = e.currentTarget;

        //存储操作的班级
        dispatch({
            type: 'lessonView/setCurrentStudentGroupSync',
            payload: classSchedule.studentGroup.id,
        });

        clearTimeout(lookDetailTimeOut);
        lookDetailTimeOut = setTimeout(() => {
            //不是调换课状态时，获取课节信息
            typeof transmitState == 'function' && transmitState(lessonItem);
            this.setCourseDetail(lessonItem, 1, 'timeTable');
            this.setState({
                clickLocation: 'timeTable',
            });
            //双击课表课节后，点击蓝色边框课进行人工换课
            if (
                currentTarget.style.borderColor === 'rgb(20, 118, 255)' &&
                lessonViewExchangeCustomCourseStatus
            ) {
                this.exchangeHandle(lessonItem);
            }

            //双击课节后，点击无边框个字调出冲突Model进行人工换课
            if (!currentTarget.style.borderColor && lessonViewExchangeCustomCourseStatus) {
                this.notArrangeClick(lessonItem, false, 'block');
            }
        }, 200);
    };

    handleCourseDoubleClick = async (lessonItem) => {
        const { currentVersion, dispatch, location, lastPublish } = this.props;
        let { resultId, studentGroups, ifLock } = lessonItem;
        if (lastPublish) {
            message.warning('已发布版本 无法进行调换课');
            return;
        }
        if (ifLock) {
            message.warning('课程锁定 无法进行调换课');
            return;
        }
        let studentGroupId = studentGroups[0].id;
        this.setState({
            doubleClickUtil: lessonItem,
            exchangeStudentGroupId: studentGroupId,
            clickLocation: 'timeTable',
            conflictHtmlVisible: false,
        });

        if (location === 'SeparateClassTable') {
            await dispatch({
                type: 'lessonView/changeLessonViewTableLoading',
                payload: true,
            });
        } else {
            await dispatch({
                type: 'lessonView/setReferenceTableLoadingStatusSync',
                payload: true,
            });
        }

        await Promise.all([
            dispatch({
                type: 'exchangeCourse/fetchRemovableColor',
                payload: {
                    id: resultId,
                },
            }),
            dispatch({
                type: 'exchangeCourse/fetchNewExchangeClass',
                payload: {
                    resultId,
                    studentGroupId, //班级id
                    versionId: currentVersion, //版本id
                    changeCourse: false,
                },
            }),
            dispatch({
                type: 'lessonView/changeLessonViewCustomExchangeCourseStatus',
                payload: true,
            }),
        ]);

        if (location === 'SeparateClassTable') {
            await dispatch({
                type: 'lessonView/changeLessonViewTableLoading',
                payload: false,
            });
        } else {
            await dispatch({
                type: 'lessonView/setReferenceTableLoadingStatusSync',
                payload: false,
            });
        }
    };

    handleWillArrangeCourseClick = (arrangeItem, e, index) => {
        const { dispatch, lessonViewExchangeCustomCourseStatus, transmitState, classSchedule } =
            this.props;
        const { doubleClickUtil } = this.state;

        dispatch({
            type: 'lessonView/setCurrentStudentGroupSync',
            payload: classSchedule.studentGroup.id,
        });
        clearTimeout(lookDetailTimeOut);
        lookDetailTimeOut = setTimeout(() => {
            typeof transmitState == 'function' && transmitState(arrangeItem);
            this.setCourseDetail(arrangeItem, 2, 'willArrange');
            this.setState({
                clickLocation: 'willArrange',
                willArrangeClickIndex: index,
            });
            if (
                doubleClickUtil.courseId &&
                arrangeItem.courseId &&
                doubleClickUtil.courseId === arrangeItem.courseId
            ) {
                dispatch({
                    type: 'lessonView/clearConflictInformation',
                    payload: {},
                });
                dispatch({
                    type: 'lessonView/changeLessonViewExchangeCourseStatus',
                    payload: false,
                });
                dispatch({
                    type: 'lessonView/changeLessonViewCustomExchangeCourseStatus',
                    payload: false,
                });
            }
        }, 200);
    };

    handleWillArrangeCourseDoubleClick = async (arrangeItem, index) => {
        const { dispatch, location, currentVersion } = this.props;
        let studentGroupId = arrangeItem.studentGroupDTOList[0].groupId;
        this.setState({
            exchangeStudentGroupId: studentGroupId,
            clickLocation: 'willArrange',
            doubleClickUtil: arrangeItem,
            conflictHtmlVisible: false,
            willArrangeDoubleClickIndex: index,
        });

        if (location === 'SeparateClassTable') {
            await dispatch({
                type: 'lessonView/changeLessonViewTableLoading',
                payload: true,
            });
        } else {
            await dispatch({
                type: 'lessonView/setReferenceTableLoadingStatusSync',
                payload: true,
            });
        }

        await Promise.all([
            dispatch({
                type: 'timeTable/newCheckScheduleList',
                payload: {
                    id: arrangeItem.weekTeachingPlanningDetailDTOList[0].id,
                },
            }),

            dispatch({
                type: 'lessonView/changeLessonViewCustomExchangeCourseStatus',
                payload: true,
            }),
        ]);

        if (location === 'SeparateClassTable') {
            await dispatch({
                type: 'lessonView/changeLessonViewTableLoading',
                payload: false,
            });
        } else {
            await dispatch({
                type: 'lessonView/setReferenceTableLoadingStatusSync',
                payload: false,
            });
        }
    };

    notArrangeClick = (lessonItem, notArrangeClickStatus, type) => {
        //双击课节显示冲突时，点击自身
        const { dispatch } = this.props;
        const { doubleClickUtil } = this.state;

        //当点击空课节时，直接返回
        if (!lessonItem.acId && type === 'block') {
            return;
        }

        //双击课节进入调换课模式，再次点击该课节，退出调换课模式
        if (lessonItem.acId && doubleClickUtil.acId && lessonItem.acId === doubleClickUtil.acId) {
            this.setState(
                {
                    conflictHtmlVisible: false,
                    currentClickLessonItem: {},
                },
                () => {
                    dispatch({
                        type: 'lessonView/clearConflictInformation',
                        payload: {},
                    });
                    dispatch({
                        type: 'lessonView/changeLessonViewExchangeCourseStatus',
                        payload: false,
                    });
                    dispatch({
                        type: 'lessonView/changeLessonViewCustomExchangeCourseStatus',
                        payload: false,
                    });
                }
            );
            return;
        }

        //type 为gray时，表示点击的是灰色不可排块，type为block时，表示点击的是课表块
        this.conflictReason(lessonItem, type).then(() => {
            this.setState({
                conflictHtmlVisible: true,
                currentClickLessonItem: lessonItem,
                notArrangeClickStatus,
            });
        });
    };

    // 冲突原因
    conflictReason = async (util, type) => {
        const { dispatch, currentVersion } = this.props;
        const { doubleClickUtil, exchangeStudentGroupId, clickLocation } = this.state;
        await dispatch({
            type: 'lessonView/getConflictInformation',
            payload:
                clickLocation === 'timeTable'
                    ? {
                          versionId: currentVersion,
                          studentGroupId: exchangeStudentGroupId,
                          weekday: util.weekDay,
                          lesson: util.realLesson,
                          baseScheduleId: util.baseScheduleId,
                          resultId: doubleClickUtil.resultId ? doubleClickUtil.resultId : null,
                          acId: doubleClickUtil.resultId
                              ? doubleClickUtil.acId || null
                              : doubleClickUtil.id || null,
                          targetResultId: type != 'gray' ? util.resultId || null : null, // 点击冲突的课程的resultId
                      }
                    : {
                          versionId: currentVersion,
                          studentGroupId: exchangeStudentGroupId,
                          weekday: util.weekDay,
                          lesson: util.realLesson,
                          baseScheduleId: util.baseScheduleId,
                          resultId: null,
                          acId: doubleClickUtil.weekTeachingPlanningDetailDTOList[0].id,
                          targetResultId: null, // 点击冲突的课程的resultId
                      },
        });
    };

    cancelConflictHtml = () => {
        const { dispatch } = this.props;

        this.setState(
            {
                conflictHtmlVisible: false,
                currentClickLessonItem: {},
            },
            () => {
                dispatch({
                    type: 'lessonView/clearConflictInformation',
                    payload: {},
                });
            }
        );
    };

    // 渲染冲突原因气泡内容
    renderConflictHtml = (moveCourseItem, util, type) => {
        //type 为compelExchange时，表示双击课节后，点击无边框个字调出冲突Model进行人工换课
        const {
            conflictInformation: {
                moveSameGroupLessonCheck,
                teachers,
                timeEquals,
                isLock,
                ifSameClass,
                ifCourseTaken,
                ifMultipleClass,
                message,
                rooms,
                classConflict,
                nonConflictRooms,
                isChangedNumber,
                isBreak,
            },
            getCustomScheduleInLessonView,
        } = this.props;
        if (!moveCourseItem) {
            this.setState({
                conflictHtmlVisible: false,
            });
            return;
        }
        const { canSelect } = moveCourseItem;
        return (
            <div className={styles.reason}>
                {/* 所有冲突都没有时，显示暂未找到冲突原因 */}
                {moveSameGroupLessonCheck &&
                !teachers &&
                timeEquals &&
                !isLock &&
                ifSameClass &&
                !ifCourseTaken &&
                !ifMultipleClass &&
                !message &&
                !rooms &&
                !classConflict &&
                isChangedNumber &&
                !isBreak ? (
                    <p className={styles.poptitle}>
                        <i className={icon.iconfont}>&#xe788;</i>暂未找到冲突原因
                    </p>
                ) : (
                    <p className={styles.poptitle}>
                        <i className={icon.iconfont}>&#xe788;</i>
                        {type == 'compelExchange'
                            ? '换课存在以下冲突'
                            : type === 1
                            ? '调整到此课节存在以下冲突'
                            : ''}
                    </p>
                )}
                {teachers &&
                    teachers.length > 0 &&
                    teachers.map((tea) => (
                        <p key={tea.id}>
                            <span
                                title={tea.name + tea.englishName}
                                className={styles.reasonTea}
                                onClick={() => getCustomScheduleInLessonView('teacher', tea.id)}
                            >
                                {tea.name + (tea.englishName ? tea.englishName : '')}
                            </span>
                            <span className={styles.timeConflict}>时间冲突</span>
                        </p>
                    ))}
                {timeEquals ? (
                    ''
                ) : (
                    <p>
                        <span className={styles.reasonEquals}>课时长度不匹配</span>
                    </p>
                )}
                {isChangedNumber ? (
                    ''
                ) : (
                    <p>
                        <span className={styles.reasonEquals}>
                            连堂课只允许和1个连堂或2个单堂换课或等数量课节移动
                        </span>
                    </p>
                )}
                {isLock ? (
                    <p>
                        <span className={styles.reasonEquals}>此课程已锁定</span>
                    </p>
                ) : (
                    ''
                )}
                {ifSameClass ? (
                    ''
                ) : (
                    <p>
                        <span className={styles.reasonEquals}>非同一班级不支持调换课操作</span>
                    </p>
                )}
                {moveSameGroupLessonCheck ? (
                    ''
                ) : (
                    <p>
                        <span className={styles.reasonEquals}>学生时间冲突</span>
                    </p>
                )}
                {ifCourseTaken ? (
                    <p>
                        <span className={styles.reasonEquals}>此课程为已上课程</span>
                    </p>
                ) : (
                    ''
                )}
                {ifMultipleClass ? (
                    <p>
                        <span className={styles.reasonEquals}>此课程为多班级一起上课</span>
                    </p>
                ) : (
                    ''
                )}
                {isBreak ? (
                    <p>
                        <span className={styles.reasonEquals}>不符合连堂课的break规则</span>
                    </p>
                ) : (
                    ''
                )}
                {message &&
                    message.length > 0 &&
                    message.map((mes) => (
                        <p key={mes.id}>
                            <span
                                title={mes.name}
                                className={styles.reasonMess}
                                onClick={() => this.noRulesClick(mes.type, mes.id)}
                            >
                                {mes.name}
                            </span>
                            <span
                                className={styles.noRules}
                                onClick={this.showRuleDrawer.bind(this, mes)}
                            >
                                {mes.ruleRemark ? mes.ruleRemark : '不排课规则'}
                            </span>
                        </p>
                    ))}
                {rooms &&
                    rooms.length > 0 &&
                    rooms.map((room) => (
                        <p key={room.id}>
                            <span
                                title={room.name}
                                className={styles.reasonRoom}
                                onClick={() => getCustomScheduleInLessonView('address', room.id)}
                            >
                                {room.name}
                            </span>
                            <span className={styles.roomConflict}>场地冲突</span>
                        </p>
                    ))}
                {classConflict &&
                    classConflict.length > 0 &&
                    classConflict.map((classCon) => (
                        <p key={classCon.id}>
                            <span
                                title={classCon.name}
                                className={styles.reasonRoom}
                                onClick={() => {
                                    getCustomScheduleInLessonView('group', classCon.id);
                                }}
                            >
                                {classCon.name}
                            </span>
                            <span className={styles.roomConflict}>班级冲突</span>
                        </p>
                    ))}

                {nonConflictRooms &&
                    nonConflictRooms.length > 0 &&
                    nonConflictRooms.map((noRoomItem) => (
                        <p key={noRoomItem.id}>
                            <span
                                title={noRoomItem.name}
                                className={styles.reasonRoom}
                                onClick={() =>
                                    getCustomScheduleInLessonView('address', noRoomItem.id)
                                }
                            >
                                {noRoomItem.name}
                            </span>
                            <span className={styles.roomConflict}>场地可用</span>
                        </p>
                    ))}

                <div className={styles.bottom}>
                    <p>
                        {canSelect === 2
                            ? '调整至此位置并将有学生冲突的课节转为待排'
                            : type == 'compelExchange'
                            ? '是否确认换课'
                            : type === 1
                            ? '确定移至此位置'
                            : ''}
                    </p>
                    {/* 课表上的课程 */}
                    <span className={styles.noBtn} onClick={this.cancelConflictHtml}>
                        否
                    </span>
                    {/* compelExchange为强制换课 */}
                    <span
                        className={styles.yesBtn}
                        onClick={() =>
                            type === 'compelExchange'
                                ? this.exchangeHandle(util)
                                : this.exchangeMoveHandle(moveCourseItem, util, 1)
                        }
                    >
                        是
                    </span>
                </div>
            </div>
        );
    };

    // 换课 （课表：课 <=> 课） (ac <=> ac)
    exchangeHandle = async (util) => {
        const { dispatch, currentVersion, judgeCurrent } = this.props;
        const { doubleClickUtil, exchangeStudentGroupId } = this.state;

        this.setState({
            doubleClickUtil: {},
            currentClickLessonItem: {},
            conflictHtmlVisible: false,
        });

        let payload = {
            resultExchangeResultIdList: [doubleClickUtil.resultId, util.resultId],
            versionId: currentVersion,
            publish: judgeCurrent(currentVersion, 'isPublish'),
            exchangeOrMoveType: 1,
            conflictInformationInputModel: {
                versionId: currentVersion,
                studentGroupId: exchangeStudentGroupId,
                weekday: util.weekDay,
                lesson: util.realLesson,
                baseScheduleId: util.baseScheduleId,
                resultId: doubleClickUtil.resultId ? doubleClickUtil.resultId : null,
                acId: doubleClickUtil.resultId
                    ? doubleClickUtil.acId || null
                    : doubleClickUtil.id || null,
                targetResultId: util.resultId, // 点击冲突的课程的resultId
            },
        };

        dispatch({
            type: 'timeTable/finishExchangeCourse',
            payload,
            onSuccess: () => {
                message.success('调换课成功');
            },
        }).then(() => {
            this.exchangeCourseCallBack();
        });
    };

    // 移动 (课表: 课 => 无 -- correct => 无) （待排: 课 <=> 课 -- correct => ac、 课 => 无--correct => 无）
    exchangeMoveHandle = async (item, util, type) => {
        const { dispatch, currentVersion, judgeCurrent, getshowAcCourseList } = this.props;
        const { doubleClickUtil, exchangeStudentGroupId, clickLocation } = this.state;

        this.setState({
            doubleClickUtil: {},
            currentClickLessonItem: {},
            conflictHtmlVisible: false,
        });

        // 待排移动课
        if (clickLocation === 'willArrange') {
            dispatch({
                type: 'timeTable/willSureExchangeCourse',
                payload: {
                    roomId: doubleClickUtil.weekTeachingPlanningDetailDTOList[0].roomId,
                    acId: doubleClickUtil.weekTeachingPlanningDetailDTOList[0].id,
                    weekDay: util.weekDay,
                    lesson: util.realLesson,
                    baseScheduleId: util.baseScheduleId,
                    turnToWaitIdList: this.getOtherSameTimeCourse(item),
                    nonConflictRooms: item.nonConflictRooms,
                    turnToWaitType: item.canSelect === 1 ? 2 : 1, // 1：转待排-点击强制按钮时传 2：不转待排-点击绿色格子时传
                },
                onSuccess: () => {
                    message.success('调换课成功');
                },
            }).then(() => {
                this.exchangeCourseCallBack();
                typeof getshowAcCourseList == 'function' &&
                    getshowAcCourseList(undefined, undefined, undefined, true);
            });
        } else {
            // 已排移动课
            // type=1点击灰色强制换课，2是点击绿色移动
            // 双击 newCardUtil 单击util

            let payload = {
                resultId: doubleClickUtil.resultId, // 要移动的结果 id
                moveWeekDay: util.weekDay, // 移动到的weekDay
                moveLesson: util.realLesson, // 移动到的lesson
                versionId: currentVersion, // 版本 id
                publish: judgeCurrent(currentVersion, 'isPublish'), // 版本是否已发布
                exchangeOrMoveType: 2,
                turnToWatitIdList: this.getOtherSameTimeCourse(item),
                nonConflictRooms: item.nonConflictRooms,
                scheduleDetailId: util.id,
                conflictInformationInputModel: {
                    versionId: currentVersion,
                    studentGroupId: exchangeStudentGroupId,
                    weekday: util.weekDay,
                    lesson: util.realLesson,
                    baseScheduleId: util.baseScheduleId,
                    resultId: doubleClickUtil.resultId ? doubleClickUtil.resultId : null,
                    acId: doubleClickUtil.resultId
                        ? doubleClickUtil.acId || null
                        : doubleClickUtil.id || null,
                    targetResultId: type !== 'gray' ? util.resultId || null : null, // 点击冲突的课程的resultId
                },
                turnToWaitType: item.canSelect === 1 ? 2 : 1, // 1：转待排-点击强制按钮时传 2：不转待排-点击绿色格子时传
            };
            dispatch({
                type: 'timeTable/finishExchangeCourse',
                payload,
                onSuccess: () => {
                    message.success('调换课成功');
                },
            }).then(() => {
                this.exchangeCourseCallBack();
            });
        }
    };

    exchangeCourseCallBack = () => {
        const { dispatch, getLessonViewMsg } = this.props;
        this.setState({
            doubleClickUtil: {},
            clickUtil: {},
            clickLocation: '',
            willArrangeClickIndex: '',
            willArrangeDoubleClickIndex: '',
            currentClickLessonItem: {},
            notArrangeClickStatus: false,
        });
        dispatch({
            type: 'lessonView/changeLessonViewCustomExchangeCourseStatus',
            payload: false,
        });
        dispatch({
            type: 'lessonView/setCurrentStudentGroupSync',
            payload: '',
        });
        dispatch({
            type: 'lessonView/clearConflictInformation',
            payload: {},
        });
        dispatch({
            type: 'exchangeCourse/clearMoveList',
        });

        getLessonViewMsg();
    };

    // 获取相同时间其他课
    getOtherSameTimeCourse = (util) => {
        const { classSchedule } = this.props;
        const preGroupResult = classSchedule.resultList[util.weekDay - 1];
        const idList = [];
        preGroupResult.map((item) => {
            if (item.resultId && item.realLesson == util.lesson && item.weekDay == util.weekDay) {
                idList.push(item.resultId);
            }
        });
        return idList;
    };

    willArrangeClick = async () => {
        const { dispatch, getshowAcCourseList } = this.props;
        const { doubleClickUtil } = this.state;
        dispatch({
            type: 'timeTable/changeArrange',
            payload: {
                id: doubleClickUtil.resultId,
            },
        }).then(() => {
            typeof getshowAcCourseList == 'function' &&
                getshowAcCourseList(undefined, undefined, undefined, true);
            this.exchangeCourseCallBack();
        });
    };

    setCourseDetail = (lessonItem, type, location) => {
        const { dispatch } = this.props;
        if (location === 'timeTable') {
            if (lessonItem.detail) {
                this.setState({
                    clickUtil: lessonItem,
                });
                dispatch({
                    type: 'timeTable/lessonViewLookCourseDetail',
                    payload: {
                        id: lessonItem.detail.id,
                        type,
                    },
                });
            } else {
                return;
            }
        }
        if (location === 'willArrange') {
            dispatch({
                type: 'timeTable/lessonViewLookCourseDetail',
                payload: {
                    id: lessonItem.weekTeachingPlanningDetailDTOList[0].id,
                    type,
                },
            });
        }
    };

    getMoveCourseItem = (lessonItem, flag) => {
        const { move, newCanCheckScheduleList } = this.props;
        const { clickLocation } = this.state;
        let newList = [],
            moveCourseItem = false;
        if (clickLocation === 'timeTable') {
            newList = move;
        }
        if (clickLocation === 'willArrange') {
            newList = newCanCheckScheduleList;
        }
        if (!flag) {
            moveCourseItem = newList.find((item) => {
                if (
                    item.weekDay === lessonItem.weekDay &&
                    item.lesson === lessonItem.realLesson &&
                    item.canSelect !== 3
                ) {
                    return true;
                }
            });
        } else {
            moveCourseItem = newList.find((item) => {
                if (item.weekDay === lessonItem.weekDay && item.lesson === lessonItem.realLesson) {
                    return true;
                }
            });
        }
        return moveCourseItem;
    };

    getExtra = (arrangeItem) => {
        let arrangeCourseItem = arrangeItem.weekTeachingPlanningDetailDTOList[0];
        let duration = arrangeCourseItem.duration;
        let frequency = arrangeCourseItem.frequency;
        return (
            <span className={styles.extraText}>
                {duration === 2 && <span>(连)</span>}
                {frequency === 1 && <span>(单)</span>}
                {frequency === 2 && <span>(双)</span>}
            </span>
        );
    };

    showRuleDrawer = (mes) => {
        const { showRulesModal } = this.props;
        typeof showRulesModal == 'function' && showRulesModal(mes);
    };

    getClassScheduleWeekday = (resultList) => {
        //默认返回5天
        if (isEmpty(resultList)) {
            return 5;
        }
        //周六、周日有一天有课，就返回7天，否则返回5天
        let count = resultList.filter((item) => !isEmpty(item)).length;
        if (count <= 5) {
            return 5;
        } else {
            return 7;
        }
    };

    noRulesClick = (type, id) => {
        //type:  1老师不排课 2班级不排课 3课程不排课
        const { getCustomScheduleInLessonView } = this.props;
        if (type === 1) {
            getCustomScheduleInLessonView('teacher', id);
        }
        if (type === 2) {
            getCustomScheduleInLessonView('group', id);
        }
        if (type === 3) {
            return;
        }
    };

    getLessonItemContent = (lessonType, lessonList, lessonItem, nameHiddenHeight) => {
        const { displayType } = this.props;
        //只有课程才会回显格子
        if (lessonType === 1) {
            let getCourseOrStudentGroupName = () => {
                {
                    /* 一个班显示课程名，多个班显示班级名 */
                }
                if (lessonList.length == 1) {
                    return (
                        <div
                            className={styles.nameHidden}
                            style={{
                                height: nameHiddenHeight,
                                lineHeight: nameHiddenHeight,
                            }}
                        >
                            {displayType.includes(6) && lessonItem.courseShortName
                                ? lessonItem.courseShortName
                                : lessonItem.name}
                        </div>
                    );
                } else {
                    return (
                        <div
                            className={styles.nameHidden}
                            style={{
                                height: nameHiddenHeight,
                                lineHeight: nameHiddenHeight,
                            }}
                        >
                            {lessonItem.studentGroups
                                ?.map((item) =>
                                    item.groupAbbreviation ? item.groupAbbreviation : item.name
                                )
                                .join(' ')}
                        </div>
                    );
                }
            };
            let getTeacherOrAddressName = () => {
                let res = [];
                let isDisplayTeacher = displayType.includes(8); //是否显示教师
                let isDisplayAddress = displayType.includes(9); //是否显示场地
                if (isDisplayTeacher) {
                    lessonItem.detail.mainTeachers &&
                        res.push(
                            ...lessonItem.detail.mainTeachers.map((item) => item.name.split(' ')[0])
                        );
                }
                if (isDisplayAddress) {
                    res.push(lessonItem.detail.roomName);
                }
                return (
                    <div
                        className={styles.nameHidden}
                        style={{
                            height: nameHiddenHeight,
                            lineHeight: nameHiddenHeight,
                        }}
                    >
                        {res.join(' ')}
                    </div>
                );
            };
            return (
                <Fragment>
                    {getCourseOrStudentGroupName()}
                    {(displayType.includes(8) || displayType.includes(9)) &&
                        getTeacherOrAddressName()}
                    {lessonItem.ifLock && <div className={styles.lockIcon}></div>}
                </Fragment>
            );
        }
    };

    getLessonItemStyle = (type, lessonList) => {
        const { lessonViewTableHeightRatio, displayDirection } = this.props;
        if (displayDirection == 2) {
            if (type === 'width') {
                return `${100 / lessonList.length}%`;
            }
            if (type === 'height') {
                return `${40 * lessonViewTableHeightRatio}px`;
            }
        }
    };

    getNameHiddenHeight = (lessonList) => {
        const { displayType, lessonViewTableHeightRatio, displayDirection } = this.props;
        if (displayDirection == 1) {
            return `${(40 * lessonViewTableHeightRatio) / lessonList.length}px`;
        }
        if (displayDirection == 2) {
            if (displayType.includes(8) || displayType.includes(9)) {
                return `${20 * lessonViewTableHeightRatio}px`;
            } else {
                return `${40 * lessonViewTableHeightRatio}px`;
            }
        }
    };

    showLockOrUnLockConfirm = (type) => {
        let self = this;
        confirm({
            title: `确定要${type === 'lock' ? '锁定' : '解锁'}该班全部课程吗`,
            onOk() {
                self.lockOrUnLockStudentGroup(type);
            },
        });
    };

    lockOrUnLockStudentGroup = async (type) => {
        const { dispatch, currentVersion, getLessonViewMsg, classSchedule } = this.props;
        await dispatch({
            type: 'timeTable/confirmLock',
            payload: {
                groupIdList: [classSchedule.studentGroup.id],
                lockType: type === 'lock' ? 1 : 2,
                versionId: currentVersion,
            },
        });
        typeof getLessonViewMsg === 'function' && getLessonViewMsg();
    };

    render() {
        const {
            lessonViewTableLoading,
            lessonViewCustomLabel,
            lessonViewExchangeCustomCourseStatus,
            currentVersion,
            getCustomResult,
            saveCustomValue,
            referenceTableLoadingStatus,
            currentStudentGroup,
            classSchedule,
            location,
            currentLang,
        } = this.props;
        const { clickLocation, clickUtil, customPopoverVisible } = this.state;

        let renderLessonList = {
            ...classSchedule,
            resultList: classSchedule ? classSchedule.resultList : [],
        };

        let weekDayArrLength = this.getClassScheduleWeekday(renderLessonList.resultList);
        // let weekDayArr = ['一', '二', '三', '四', '五', '六', '日'].slice(0, weekDayArrLength);
        let weekDayArr = [
            trans('global.lessonViewMonday', '一'),
            trans('global.lessonViewTuesday', '二'),
            trans('global.lessonViewWednesday', '三'),
            trans('global.lessonViewThursday', '四'),
            trans('global.lessonViewFriday', '五'),
            trans('global.lessonViewSaturday', '六'),
            trans('global.lessonViewSunday', '日'),
        ].slice(0, weekDayArrLength);

        let lessonItemWidth = `${92 / weekDayArr.length}%`;

        //参数 1 2 3 分别表示上午，下午，晚上
        let morningLessonList = this.getLessonList(1, weekDayArrLength);
        let afternoonLessonList = this.getLessonList(2, weekDayArrLength);
        let eveningLessonList = this.getLessonList(3, weekDayArrLength);

        let lessonCount = [
            ...flattenDeep(morningLessonList),
            ...flattenDeep(afternoonLessonList),
            ...flattenDeep(eveningLessonList),
        ].filter((item) => item.detail).length;

        let maxMorningItemNum = Math.max(...morningLessonList.map((item) => item.length));
        let maxAfternoonItemNum = Math.max(...afternoonLessonList.map((item) => item.length));
        let maxEveningItemNum = Math.max(...eveningLessonList.map((item) => item.length));

        return (
            <div className={styles.lessonViewTimeTableWrapper}>
                <Spin
                    spinning={
                        location === 'SeparateClassTable'
                            ? lessonViewTableLoading
                            : referenceTableLoadingStatus
                    }
                >
                    {renderLessonList && (
                        <div className={styles.lessonViewWrapper}>
                            <div
                                className={styles.studentGroupName}
                                style={{
                                    justifyContent:
                                        location === 'CustomClassTable' ? 'spaceBetween' : 'center',
                                }}
                            >
                                <span className={styles.lockIconList}>
                                    <i
                                        className={icon.iconfont + ' ' + styles.lock}
                                        onClick={() => this.showLockOrUnLockConfirm('lock')}
                                    >
                                        &#xe744;
                                    </i>
                                    <i
                                        className={icon.iconfont + ' ' + styles.unLock}
                                        onClick={() => this.showLockOrUnLockConfirm('unLock')}
                                    >
                                        &#xe747;
                                    </i>
                                </span>
                                <span style={{ marginLeft: 10 }}></span>
                                <div>
                                    <span>
                                        {currentLang != 'en'
                                            ? classSchedule.studentGroup.name
                                            : classSchedule.studentGroup.ename}
                                    </span>
                                    <span style={{ marginLeft: 10 }}>
                                        {lessonCount} {trans('global.periods', '节')}
                                    </span>
                                </div>

                                {location === 'CustomClassTable' && (
                                    <Icon
                                        type="close"
                                        onClick={() => {
                                            this.props.closeCustomTable(classSchedule);
                                        }}
                                    />
                                )}
                            </div>
                            <div className={styles.lessonView}>
                                <div className={styles.lessonViewTableWrapper}>
                                    <div className={styles.weekDayPlaceholder}>
                                        {['blank'].concat(weekDayArr).map((item) => (
                                            <div
                                                className={styles.weekDayItem}
                                                style={{
                                                    width:
                                                        item === 'blank' ? '8%' : lessonItemWidth,
                                                }}
                                            >
                                                {item === 'blank' ? '' : item}
                                            </div>
                                        ))}
                                    </div>
                                    {this.getWeekDayRow(
                                        1,
                                        morningLessonList,
                                        maxMorningItemNum,
                                        lessonItemWidth,
                                        0
                                    )}
                                    {maxAfternoonItemNum !== 0 && (
                                        <div>
                                            {this.getWeekDayRow(
                                                2,
                                                afternoonLessonList,
                                                maxAfternoonItemNum,
                                                lessonItemWidth,
                                                maxMorningItemNum
                                            )}
                                        </div>
                                    )}

                                    {maxEveningItemNum !== 0 && (
                                        <div>
                                            {this.getWeekDayRow(
                                                3,
                                                eveningLessonList,
                                                maxEveningItemNum,
                                                lessonItemWidth,
                                                maxMorningItemNum + maxAfternoonItemNum
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className={styles.willArrangeWrapper}>
                                    <div className={styles.willArrangeNum}>
                                        {trans('global.lessonViewWillArrangeNum', '待排{$num}次', {
                                            num: classSchedule.acList
                                                ? flattenDeep(
                                                      classSchedule.acList.map(
                                                          (item) =>
                                                              item.weekTeachingPlanningDetailDTOList
                                                      )
                                                  ).length
                                                : '0',
                                        })}
                                    </div>
                                    <div
                                        className={styles.willArrangeList}
                                        style={{
                                            height:
                                                (maxMorningItemNum +
                                                    maxAfternoonItemNum +
                                                    maxEveningItemNum) *
                                                40,
                                        }}
                                    >
                                        {classSchedule.acList?.map((arrangeItem, index) => (
                                            <div
                                                className={styles.arrangeListItem}
                                                onDoubleClick={() =>
                                                    this.handleWillArrangeCourseDoubleClick(
                                                        arrangeItem,
                                                        index
                                                    )
                                                }
                                                onClick={(e) =>
                                                    this.handleWillArrangeCourseClick(
                                                        arrangeItem,
                                                        e,
                                                        index
                                                    )
                                                }
                                            >
                                                <div
                                                    className={styles.itemMessage}
                                                    style={{
                                                        backgroundColor: this.getBgcColor(
                                                            arrangeItem,
                                                            1,
                                                            index
                                                        ),
                                                        color: this.getFontColor(
                                                            arrangeItem,
                                                            1,
                                                            index
                                                        ),
                                                        border: this.getBorder(arrangeItem, index),
                                                    }}
                                                >
                                                    <div className={styles.courseNameWrapper}>
                                                        {this.getExtra(arrangeItem)}
                                                        <span>{arrangeItem.courseName}</span>
                                                        {arrangeItem
                                                            .weekTeachingPlanningDetailDTOList
                                                            .length > 1 && (
                                                            <div className={styles.itemNum}>
                                                                {
                                                                    arrangeItem
                                                                        .weekTeachingPlanningDetailDTOList
                                                                        .length
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {lessonViewExchangeCustomCourseStatus &&
                                            classSchedule.studentGroup.id === currentStudentGroup &&
                                            clickLocation === 'timeTable' && (
                                                <div
                                                    className={styles.willArrangeItem}
                                                    onClick={this.willArrangeClick}
                                                >
                                                    <span>转为待排</span>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Spin>
            </div>
        );
    }
}
