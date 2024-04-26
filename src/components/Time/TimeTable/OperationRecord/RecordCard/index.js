import React, { Component } from 'react';
import styles from './index.less';
import CourseCard from '../CourseCard';
import AddressConflict from '../AddressConflict';
import lodash from 'lodash';
import { debounce } from 'lodash';
import { Popconfirm, message } from 'antd';
import { trans, locale } from '../../../../../utils/i18n';
export default class RecordCard extends Component {
    constructor(props) {
        super(props);
        const { record } = props;
        this.state = {
            operationCode: record.operationCode,
            ifRevoke: record.ifRevoke && !this.props.published,
            creatorName: record.creatorName,
            creatorTime: record.creatorTime,
            source: record.sourceScheduleOperateModel ? record.sourceScheduleOperateModel : {},
            target: record.targetScheduleOperateModel
                ? record.targetScheduleOperateModel
                : [{}, {}],
            operationType: '',
            isContinuousClass: false,
            versionId: this.props.versionId,
            scheduleOperationId: record.scheduleOperationId,
        };
    }

    componentDidMount() {
        const { operationCode } = this.props.record;
        this.setState({
            operationType: this.getOperationType(operationCode),
        });
    }

    //由operationCoded获取operationType
    getOperationType = (code) => {
        switch (code) {
            case 1:
                return trans('global.change lessons', '换课');
            case 2:
                return trans('global.move lessons', '移动');
            case 3:
                return trans('global.schedule manually', '人工排课');
            case 4:
                return trans('global.set as unarranged', '转待排');
            case 5:
                return trans('global.modified', '修改已排课节');
            case 6:
                return '系统换课';
            case 7:
                return '系统代课';
            case 8:
                return '系统排课';
        }
    };

    //处理撤销
    handleRevoke = () => {
        const { dispatch } = this.props;
        const { scheduleOperationId } = this.state;
        dispatch({
            type: 'timeTable/revokeOperationRecord',
            payload: {
                operationId: scheduleOperationId,
            },
        })
            .then(() => {
                this.props.getOperationRecordList();
            })
            .then(() => {
                this.props.showTable('撤销');
                this.state.operationCode === 3 ? this.props.setDetailId() : '';
                this.props.fetchWillArrangeList();
                this.props.fetchCourseList();
            });
        // console.log("versionId :>> ", this.props.versionId);
    };

    judgeRepeat = (id, name) => {
        const { scheduleData } = this.props;
        let isRepeat = false;
        for (let i = 0; i < (scheduleData && scheduleData.length); i++) {
            if (
                scheduleData[i].studentGroup.id == id &&
                scheduleData[i].studentGroup.name == name
            ) {
                isRepeat = true;
                break;
            }
        }

        return isRepeat;
    };

    getSchedule = (id, type, name, e) => {
        e.stopPropagation();
        const { tableView } = this.props;
        if (tableView === 'weekLessonView') {
            const { getCustomScheduleInLessonView } = this.props;
            getCustomScheduleInLessonView(type, id);
        } else {
            // 判断课表中添加的老师是否与当前点击的相等，若相等，课表已存在不添加
            if (this.judgeRepeat(id, name)) {
                if (type == 'teacher') {
                    message.info('课表已存在该教师');
                } else if (type == 'address') {
                    message.info('课表已存在该场地');
                }
                return;
            }
            const { dispatch, currentVersion, searchIndex, showExchangeClassTable } = this.props;
            let url = '';
            const params = {};
            params.id = currentVersion;
            params.actionType = searchIndex == 5 && !showExchangeClassTable ? 'custom' : 'detail';
            if (type == 'teacher') {
                url = 'timeTable/findTeacherSchedule';
                params.teacherIds = [id];
                delete params.playgroundIds;
            } else if (type == 'address') {
                url = 'timeTable/findFieldSchedule';
                params.playgroundIds = [id];
                delete params.teacherIds;
            } else {
                url = '';
            }
            dispatch({
                type: url,
                payload: params,
            });
        }
    };

    confirmRevoke = () => {
        debounce(this.handleRevoke, 500)();
    };

    getOperationMessage = (
        creatorName,
        creatorTime,
        operationType,
        ifRevoke,
        isReplace,
        record
    ) => {
        return (
            <p className={styles.operationMessage}>
                <span className={styles.creatorName}> {creatorName} </span>
                <span className={styles.creatorTime}> {creatorTime} </span>
                <span className={styles.operation}>
                    {isReplace ? '调代课审批通过自动处理' : operationType}
                </span>
                {operationType === '系统排课' && (
                    <span
                        className={styles.operation}
                        onClick={this.downLoadFetFile}
                        style={{ cursor: 'pointer' }}
                    >
                        下载排课数据{' '}
                    </span>
                )}
                <Popconfirm
                    title="撤销后不可恢复，是否撤销此次调整"
                    onConfirm={this.confirmRevoke}
                    okText="确认"
                    cancelText="取消"
                    // style={{zIndex: 1032, marginRight: "60px"}}
                    placement="bottomRight"
                >
                    <span
                        className={styles.revoke}
                        style={{ display: ifRevoke ? 'block' : 'none' }}
                    >
                        {trans('global.revoke', '撤销')}
                    </span>
                </Popconfirm>
            </p>
        );
    };

    downLoadFetFile = () => {
        const { record } = this.props;
        window.open(record.fetFileDTO.fileDownloadUrl);
    };

    render() {
        const { record } = this.props;
        const { operationType, ifRevoke, creatorName, creatorTime, source, target } = this.state;

        const {
            courseModelList: sourceCourseList,
            groupModelList: sourceGroupList,
            userModelList: sourceUserList,
            addressModelList: sourceAddressList,
            weekDay: sourceWeekDay,
            lesson: sourceLesson,
            duration: sourceDuration,
        } = source;
        const {
            courseModelList: targetCourseList,
            groupModelList: targetGroupList,
            userModelList: targetUserList,
            addressModelList: targetAddressList,
            weekDay: targetWeekDay,
            lesson: targetLesson,
            duration: targetDuration,
        } = target[0];

        const durationTargetCourseList = target[1] ? target[1].courseModelList : '';
        const durationTargetGroupList = target[1] ? target[1].groupModelList : '';
        const durationTargetUserList = target[1] ? target[1].userModelList : '';
        const durationTargetAddressList = target[1] ? target[1].addressModelList : '';
        const durationTargetWeekday = target[1] ? target[1].weekDay : '';
        const durationTargetLesson = target[1] ? target[1].lesson : '';

        //根据groupList是否存在，来判断块是实心的还是空心的
        const targetCardBgc = targetCourseList ? 'grey' : 'white';
        const durationTargetCardBgc = durationTargetCourseList ? 'grey' : 'white';

        let doubleArrow = (
            <div className={styles.doubleArrow}>
                <div className={styles.leftTriangle}> </div>
                <div className={styles.connectLines}> </div>
                <div className={styles.rightTriangle}> </div>
            </div>
        );

        let singleArrow = (
            <div className={styles.singleArrow}>
                <div className={styles.connectLines}> </div>
                <div className={styles.rightTriangle}> </div>
            </div>
        );

        let conflictSingleArrow = (
            <span className={styles.conflictSingleArrow}>
                <span className={styles.singleConnectLines}> </span>
                <span className={styles.singleChangeArrow}> </span>
            </span>
        );

        return (
            <div>
                {operationType === trans('global.change lessons', '换课') ? (
                    <div>
                        {/* 换课--连堂课换连堂课*/}
                        {sourceDuration === 2 && targetDuration === 2 ? (
                            <div>
                                <div className={styles.recordCardWrapper}>
                                    <div className={styles.durationCardsWrapper}>
                                        <CourseCard
                                            courseCardCode="1"
                                            weekDay={sourceWeekDay}
                                            lesson={sourceLesson}
                                            course={
                                                locale() !== 'en'
                                                    ? sourceCourseList[0].name
                                                    : sourceCourseList[0].englishName
                                            }
                                            group={
                                                locale() !== 'en'
                                                    ? sourceGroupList[0].name
                                                    : sourceGroupList[0].ename
                                            }
                                            durationGroup={
                                                locale() !== 'en'
                                                    ? sourceGroupList[1] && sourceGroupList[1].name
                                                    : sourceGroupList[1] && sourceGroupList[1].ename
                                            }
                                            source={target[0]}
                                            target={source}
                                            direction={true}
                                            noShowSecond={true}
                                        />
                                        <div className={styles.cardDivider}> </div>
                                        <CourseCard
                                            courseCardCode="1"
                                            weekDay={sourceWeekDay}
                                            lesson={sourceLesson + 1}
                                            course={
                                                locale() !== 'en'
                                                    ? sourceCourseList[0].name
                                                    : sourceCourseList[0].englishName
                                            }
                                            group={
                                                locale() !== 'en'
                                                    ? sourceGroupList[0].name
                                                    : sourceGroupList[0].ename
                                            }
                                            durationGroup={
                                                locale() !== 'en'
                                                    ? sourceGroupList[1] && sourceGroupList[1].name
                                                    : sourceGroupList[1] && sourceGroupList[1].ename
                                            }
                                            durationSource={target[0]}
                                            target={source}
                                            direction={true}
                                            noShowSecond={false}
                                        />
                                    </div>
                                    {doubleArrow}
                                    <div className={styles.durationCardsWrapper}>
                                        {targetCardBgc === 'grey' ? (
                                            <CourseCard
                                                courseCardCode="1"
                                                weekDay={targetWeekDay}
                                                lesson={targetLesson}
                                                course={
                                                    locale() !== 'en'
                                                        ? targetCourseList[0].name
                                                        : targetCourseList[0].englishName
                                                }
                                                group={
                                                    locale() !== 'en'
                                                        ? targetGroupList[0].name
                                                        : targetGroupList[0].ename
                                                }
                                                durationGroup={
                                                    // targetGroupList[1] && targetGroupList[1].name
                                                    locale() !== 'en'
                                                        ? targetGroupList[1] &&
                                                          targetGroupList[1].name
                                                        : targetGroupList[1] &&
                                                          targetGroupList[1].ename
                                                }
                                                source={source}
                                                target={target[0]}
                                                noShowSecond={true}
                                                direction={false}
                                            />
                                        ) : (
                                            <CourseCard
                                                courseCardCode="3"
                                                weekDay={targetWeekDay}
                                                lesson={targetLesson}
                                            />
                                        )}
                                        <div className={styles.cardDivider}> </div>
                                        {durationTargetCardBgc === 'grey' ? (
                                            <CourseCard
                                                courseCardCode="1"
                                                weekDay={durationTargetWeekday}
                                                lesson={durationTargetLesson}
                                                course={
                                                    locale() !== 'en'
                                                        ? durationTargetCourseList[0].name
                                                        : durationTargetCourseList[0].englishName
                                                }
                                                group={
                                                    locale() !== 'en'
                                                        ? durationTargetGroupList[0].name
                                                        : durationTargetGroupList[0].ename
                                                }
                                                durationGroup={
                                                    // durationTargetGroupList[1] &&
                                                    // durationTargetGroupList[1].name
                                                    locale() !== 'en'
                                                        ? durationTargetGroupList[1] &&
                                                          durationTargetGroupList[1].name
                                                        : durationTargetGroupList[1] &&
                                                          durationTargetGroupList[1].ename
                                                }
                                                source={source}
                                                target={target[1]}
                                                noShowSecond={false}
                                                direction={false}
                                            />
                                        ) : (
                                            <CourseCard
                                                courseCardCode="3"
                                                weekDay={durationTargetWeekday}
                                                lesson={durationTargetLesson}
                                                bgc="white"
                                            />
                                        )}
                                    </div>
                                </div>
                                <AddressConflict
                                    sourceAddressList={sourceAddressList}
                                    sourceCourseList={sourceCourseList}
                                    sourceGroupList={sourceGroupList}
                                    targetCourseList={targetCourseList}
                                    targetGroupList={targetGroupList}
                                    targetAddressList={targetAddressList}
                                    durationTargetAddressList={durationTargetAddressList}
                                    durationTargetCourseList={durationTargetCourseList}
                                    durationTargetGroupList={durationTargetGroupList}
                                    currentVersion={this.props.currentVersion}
                                    searchIndex={this.props.searchIndex}
                                    showExchangeClassTable={this.props.showExchangeClassTable}
                                    scheduleData={this.props.scheduleData}
                                    dispatch={this.props.dispatch}
                                    getCustomScheduleInLessonView={
                                        this.props.getCustomScheduleInLessonView
                                    }
                                    tableView={this.props.tableView}
                                />
                                {this.getOperationMessage(
                                    creatorName,
                                    creatorTime,
                                    operationType,
                                    ifRevoke
                                )}
                            </div>
                        ) : /* 换课--连堂课换两节单堂课*/
                        sourceDuration === 2 && targetDuration === 1 ? (
                            <div>
                                <div className={styles.recordCardWrapper}>
                                    <div className={styles.durationCardsWrapper}>
                                        <CourseCard
                                            courseCardCode="1"
                                            weekDay={sourceWeekDay}
                                            lesson={sourceLesson}
                                            course={
                                                locale() !== 'en'
                                                    ? sourceCourseList[0].name
                                                    : sourceCourseList[0].englishName
                                            }
                                            group={
                                                locale() !== 'en'
                                                    ? sourceGroupList[0].name
                                                    : sourceGroupList[0].ename
                                            }
                                            durationGroup={
                                                locale() !== 'en'
                                                    ? sourceGroupList[1] && sourceGroupList[1].name
                                                    : sourceGroupList[1] && sourceGroupList[1].ename
                                            }
                                            source={target[0]}
                                            target={source}
                                            direction={true}
                                            noShowSecond={true}
                                        />
                                        <div className={styles.cardDivider}> </div>
                                        <CourseCard
                                            courseCardCode="1"
                                            weekDay={sourceWeekDay}
                                            lesson={sourceLesson + 1}
                                            course={
                                                locale() !== 'en'
                                                    ? sourceCourseList[0].name
                                                    : sourceCourseList[0].englishName
                                            }
                                            group={
                                                locale() !== 'en'
                                                    ? sourceGroupList[0].name
                                                    : sourceGroupList[0].ename
                                            }
                                            durationGroup={
                                                locale() !== 'en'
                                                    ? sourceGroupList[1] && sourceGroupList[1].name
                                                    : sourceGroupList[1] && sourceGroupList[1].ename
                                            }
                                            source={target[1]}
                                            target={source}
                                            direction={true}
                                            noShowSecond={false}
                                        />
                                    </div>
                                    {doubleArrow}
                                    <div className={styles.durationCardsWrapper}>
                                        {targetCardBgc === 'grey' ? (
                                            <CourseCard
                                                courseCardCode="1"
                                                weekDay={targetWeekDay}
                                                lesson={targetLesson}
                                                course={
                                                    locale() !== 'en'
                                                        ? targetCourseList[0].name
                                                        : targetCourseList[0].englishName
                                                }
                                                group={
                                                    locale() !== 'en'
                                                        ? targetGroupList[0].name
                                                        : targetGroupList[0].ename
                                                }
                                                durationGroup={
                                                    locale() !== 'en'
                                                        ? targetGroupList[1] &&
                                                          targetGroupList[1].name
                                                        : targetGroupList[1] &&
                                                          targetGroupList[1].ename
                                                }
                                                source={source}
                                                target={target[0]}
                                                noShowSecond={true}
                                                direction={false}
                                            />
                                        ) : (
                                            <CourseCard
                                                courseCardCode="3"
                                                weekDay={targetWeekDay}
                                                lesson={targetLesson}
                                                bgc="white"
                                            />
                                        )}
                                        <div className={styles.cardDivider}> </div>
                                        {durationTargetCardBgc === 'grey' ? (
                                            <CourseCard
                                                courseCardCode="1"
                                                weekDay={durationTargetWeekday}
                                                lesson={durationTargetLesson}
                                                course={
                                                    locale() !== 'en'
                                                        ? durationTargetCourseList[0].name
                                                        : durationTargetCourseList[0].englishName
                                                }
                                                group={
                                                    locale() !== 'en'
                                                        ? durationTargetGroupList[0].name
                                                        : durationTargetGroupList[0].ename
                                                }
                                                durationGroup={
                                                    locale() !== 'en'
                                                        ? durationTargetGroupList[1] &&
                                                          durationTargetGroupList[1].name
                                                        : durationTargetGroupList[1] &&
                                                          durationTargetGroupList[1].ename
                                                }
                                                target={target[1]}
                                                noShowSecond={false}
                                                direction={false}
                                                durationSource={source}
                                            />
                                        ) : (
                                            <CourseCard
                                                courseCardCode="3"
                                                weekDay={durationTargetWeekday}
                                                lesson={durationTargetLesson}
                                                bgc="white"
                                            />
                                        )}
                                    </div>
                                </div>
                                <AddressConflict
                                    sourceAddressList={sourceAddressList}
                                    sourceCourseList={sourceCourseList}
                                    sourceGroupList={sourceGroupList}
                                    targetCourseList={targetCourseList}
                                    targetGroupList={targetGroupList}
                                    targetAddressList={targetAddressList}
                                    durationTargetAddressList={durationTargetAddressList}
                                    durationTargetCourseList={durationTargetCourseList}
                                    durationTargetGroupList={durationTargetGroupList}
                                    currentVersion={this.props.currentVersion}
                                    searchIndex={this.props.searchIndex}
                                    showExchangeClassTable={this.props.showExchangeClassTable}
                                    scheduleData={this.props.scheduleData}
                                    dispatch={this.props.dispatch}
                                    getCustomScheduleInLessonView={
                                        this.props.getCustomScheduleInLessonView
                                    }
                                    tableView={this.props.tableView}
                                />
                                {this.getOperationMessage(
                                    creatorName,
                                    creatorTime,
                                    operationType,
                                    ifRevoke
                                )}
                            </div>
                        ) : (
                            /* 换课普通情况 */
                            <div>
                                <div className={styles.recordCardWrapper}>
                                    <CourseCard
                                        courseCardCode="1"
                                        weekDay={sourceWeekDay}
                                        lesson={sourceLesson}
                                        course={
                                            locale() !== 'en'
                                                ? sourceCourseList[0].name
                                                : sourceCourseList[0].englishName
                                        }
                                        group={
                                            locale() !== 'en'
                                                ? sourceGroupList[0].name
                                                : sourceGroupList[0].ename
                                        }
                                        durationGroup={
                                            locale() !== 'en'
                                                ? sourceGroupList[1] && sourceGroupList[1].name
                                                : sourceGroupList[1] && sourceGroupList[1].ename
                                        }
                                        source={target[0]}
                                        target={source}
                                        direction={true}
                                        noShowSecond={true}
                                    />
                                    {doubleArrow}
                                    <CourseCard
                                        courseCardCode="1"
                                        weekDay={targetWeekDay}
                                        lesson={targetLesson}
                                        course={
                                            locale() !== 'en'
                                                ? targetCourseList[0].name
                                                : targetCourseList[0].englishName
                                        }
                                        group={
                                            locale() !== 'en'
                                                ? targetGroupList[0].name
                                                : targetGroupList[0].ename
                                        }
                                        source={source}
                                        target={target[0]}
                                        direction={false}
                                        noShowSecond={true}
                                    />
                                </div>
                                <AddressConflict
                                    sourceAddressList={sourceAddressList}
                                    sourceCourseList={sourceCourseList}
                                    sourceGroupList={sourceGroupList}
                                    targetCourseList={targetCourseList}
                                    targetGroupList={targetGroupList}
                                    targetAddressList={targetAddressList}
                                    currentVersion={this.props.currentVersion}
                                    searchIndex={this.props.searchIndex}
                                    showExchangeClassTable={this.props.showExchangeClassTable}
                                    scheduleData={this.props.scheduleData}
                                    dispatch={this.props.dispatch}
                                    getCustomScheduleInLessonView={
                                        this.props.getCustomScheduleInLessonView
                                    }
                                    tableView={this.props.tableView}
                                />
                                {this.getOperationMessage(
                                    creatorName,
                                    creatorTime,
                                    operationType,
                                    ifRevoke
                                )}
                            </div>
                        )}
                    </div>
                ) : operationType === trans('global.move lessons', '移动') ? (
                    <div>
                        <div className={styles.recordCardWrapper}>
                            {sourceDuration === 2 ? (
                                <div className={styles.durationCardsWrapper}>
                                    <CourseCard
                                        courseCardCode="1"
                                        weekDay={sourceWeekDay}
                                        lesson={sourceLesson}
                                        course={
                                            locale() !== 'en'
                                                ? sourceCourseList[0].name
                                                : sourceCourseList[0].englishName
                                        }
                                        group={
                                            locale() !== 'en'
                                                ? sourceGroupList[0].name
                                                : sourceGroupList[0].ename
                                        }
                                        durationGroup={
                                            locale() !== 'en'
                                                ? sourceGroupList[1] && sourceGroupList[1].name
                                                : sourceGroupList[1] && sourceGroupList[1].ename
                                        }
                                        source={target[0]}
                                        target={source}
                                        direction={true}
                                        noShowSecond={true}
                                    />
                                    <div className={styles.cardDivider}> </div>
                                    <CourseCard
                                        courseCardCode="1"
                                        weekDay={sourceWeekDay}
                                        lesson={sourceLesson + 1}
                                        course={
                                            locale() !== 'en'
                                                ? sourceCourseList[0].name
                                                : sourceCourseList[0].englishName
                                        }
                                        group={
                                            locale() !== 'en'
                                                ? sourceGroupList[0].name
                                                : sourceGroupList[0].ename
                                        }
                                        durationGroup={
                                            locale() !== 'en'
                                                ? sourceGroupList[1] && sourceGroupList[1].name
                                                : sourceGroupList[1] && sourceGroupList[1].ename
                                        }
                                        durationSource={target[0]}
                                        target={source}
                                        direction={true}
                                        noShowSecond={false}
                                    />
                                </div>
                            ) : (
                                <CourseCard
                                    courseCardCode="1"
                                    weekDay={sourceWeekDay}
                                    lesson={sourceLesson}
                                    course={
                                        locale() !== 'en'
                                            ? sourceCourseList[0].name
                                            : sourceCourseList[0].englishName
                                    }
                                    group={
                                        locale() !== 'en'
                                            ? sourceGroupList[0].name
                                            : sourceGroupList[0].ename
                                    }
                                    durationGroup={
                                        locale() !== 'en'
                                            ? sourceGroupList[1] && sourceGroupList[1].name
                                            : sourceGroupList[1] && sourceGroupList[1].ename
                                    }
                                    source={target[0]}
                                    target={source}
                                    direction={true}
                                    noShowSecond={true}
                                />
                            )}
                            {singleArrow}
                            {sourceDuration === 2 ? (
                                <CourseCard
                                    courseCardCode="5"
                                    weekDay={targetWeekDay}
                                    lesson={targetLesson}
                                />
                            ) : (
                                <CourseCard
                                    courseCardCode="3"
                                    weekDay={targetWeekDay}
                                    lesson={targetLesson}
                                />
                            )}
                        </div>
                        <AddressConflict
                            sourceAddressList={sourceAddressList}
                            sourceCourseList={sourceCourseList}
                            sourceGroupList={sourceGroupList}
                            targetCourseList={targetCourseList}
                            targetGroupList={targetGroupList}
                            targetAddressList={targetAddressList}
                            durationTargetAddressList={durationTargetAddressList}
                            durationTargetCourseList={durationTargetCourseList}
                            durationTargetGroupList={durationTargetGroupList}
                            currentVersion={this.props.currentVersion}
                            searchIndex={this.props.searchIndex}
                            showExchangeClassTable={this.props.showExchangeClassTable}
                            scheduleData={this.props.scheduleData}
                            dispatch={this.props.dispatch}
                            getCustomScheduleInLessonView={this.props.getCustomScheduleInLessonView}
                            tableView={this.props.tableView}
                        />
                        {this.getOperationMessage(
                            creatorName,
                            creatorTime,
                            operationType,
                            ifRevoke
                        )}
                    </div>
                ) : operationType === trans('global.schedule manually', '人工排课') ? (
                    <div>
                        <div className={styles.recordCardWrapper}>
                            <CourseCard
                                courseCardCode="2"
                                weekDay={sourceWeekDay}
                                lesson={sourceLesson}
                                course={
                                    locale() !== 'en'
                                        ? sourceCourseList[0].name
                                        : sourceCourseList[0].englishName
                                }
                                group={
                                    locale() !== 'en'
                                        ? sourceGroupList[0].name
                                        : sourceGroupList[0].ename
                                }
                                durationGroup={
                                    locale() !== 'en'
                                        ? sourceGroupList[1] && sourceGroupList[1].name
                                        : sourceGroupList[1] && sourceGroupList[1].ename
                                }
                            />
                            {targetCardBgc === 'grey' ? doubleArrow : singleArrow}
                            {sourceDuration === 2 && durationTargetCardBgc === 'grey' ? (
                                <div className={styles.durationCardsWrapper}>
                                    {targetCardBgc === 'grey' ? (
                                        <CourseCard
                                            courseCardCode="1"
                                            weekDay={targetWeekDay}
                                            lesson={targetLesson}
                                            course={
                                                locale() !== 'en'
                                                    ? targetCourseList[0].name
                                                    : targetCourseList[0].englishName
                                            }
                                            group={
                                                locale() !== 'en'
                                                    ? targetGroupList[0].name
                                                    : targetGroupList[0].ename
                                            }
                                            durationGroup={
                                                locale() !== 'en'
                                                    ? targetGroupList[1] && targetGroupList[1].name
                                                    : targetGroupList[1] && targetGroupList[1].ename
                                            }
                                            source={source}
                                            target={target[0]}
                                            noShowSecond={true}
                                            direction={false}
                                        />
                                    ) : (
                                        <CourseCard
                                            courseCardCode="3"
                                            weekDay={targetWeekDay}
                                            lesson={targetLesson}
                                            bgc="white"
                                        />
                                    )}
                                    <div className={styles.cardDivider}> </div>
                                    {durationTargetCardBgc === 'grey' ? (
                                        <CourseCard
                                            courseCardCode="1"
                                            weekDay={durationTargetWeekday}
                                            lesson={durationTargetLesson}
                                            course={
                                                locale() !== 'en'
                                                    ? durationTargetCourseList[0].name
                                                    : durationTargetCourseList[0].englishName
                                            }
                                            group={
                                                locale() !== 'en'
                                                    ? durationTargetGroupList[0].name
                                                    : durationTargetGroupList[0].ename
                                            }
                                            durationGroup={
                                                locale() !== 'en'
                                                    ? durationTargetGroupList[1] &&
                                                      durationTargetGroupList[1].name
                                                    : durationTargetGroupList[1] &&
                                                      durationTargetGroupList[1].ename
                                            }
                                            source={source}
                                            target={target[1]}
                                            noShowSecond={true}
                                            direction={false}
                                        />
                                    ) : (
                                        <CourseCard
                                            courseCardCode="3"
                                            weekDay={durationTargetWeekday}
                                            lesson={durationTargetLesson}
                                            bgc="white"
                                        />
                                    )}
                                </div>
                            ) : sourceDuration === 2 ? (
                                <CourseCard
                                    courseCardCode="5"
                                    weekDay={targetWeekDay}
                                    lesson={targetLesson}
                                    bgc="white"
                                />
                            ) : (
                                <div>
                                    {targetCardBgc === 'grey' ? (
                                        <CourseCard
                                            courseCardCode="1"
                                            weekDay={targetWeekDay}
                                            lesson={targetLesson}
                                            course={
                                                locale() !== 'en'
                                                    ? targetCourseList[0].name
                                                    : targetCourseList[0].englishName
                                            }
                                            group={
                                                locale() !== 'en'
                                                    ? targetGroupList[0].name
                                                    : targetGroupList[0].ename
                                            }
                                            durationGroup={
                                                locale() !== 'en'
                                                    ? targetGroupList[1] && targetGroupList[1].name
                                                    : targetGroupList[1] && targetGroupList[1].ename
                                            }
                                            source={source}
                                            target={target[0]}
                                            noShowSecond={true}
                                            direction={false}
                                        />
                                    ) : (
                                        <CourseCard
                                            courseCardCode="3"
                                            weekDay={targetWeekDay}
                                            lesson={targetLesson}
                                            bgc="white"
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                        <AddressConflict
                            sourceAddressList={sourceAddressList}
                            sourceCourseList={sourceCourseList}
                            sourceGroupList={sourceGroupList}
                            targetCourseList={targetCourseList}
                            targetGroupList={targetGroupList}
                            targetAddressList={targetAddressList}
                            durationTargetAddressList={durationTargetAddressList}
                            durationTargetCourseList={durationTargetCourseList}
                            durationTargetGroupList={durationTargetGroupList}
                            currentVersion={this.props.currentVersion}
                            searchIndex={this.props.searchIndex}
                            showExchangeClassTable={this.props.showExchangeClassTable}
                            scheduleData={this.props.scheduleData}
                            dispatch={this.props.dispatch}
                            getCustomScheduleInLessonView={this.props.getCustomScheduleInLessonView}
                            tableView={this.props.tableView}
                        />
                        {this.getOperationMessage(
                            creatorName,
                            creatorTime,
                            operationType,
                            ifRevoke
                        )}
                    </div>
                ) : operationType === trans('global.set as unarranged', '转待排') ? (
                    <div>
                        {sourceDuration === 2 ? (
                            <div>
                                <div className={styles.recordCardWrapper}>
                                    <div className={styles.durationCardsWrapper}>
                                        <CourseCard
                                            courseCardCode="1"
                                            weekDay={sourceWeekDay}
                                            lesson={sourceLesson}
                                            course={
                                                locale() !== 'en'
                                                    ? sourceCourseList[0].name
                                                    : sourceCourseList[0].englishName
                                            }
                                            group={
                                                locale() !== 'en'
                                                    ? sourceGroupList[0].name
                                                    : sourceGroupList[0].ename
                                            }
                                            durationGroup={
                                                locale() !== 'en'
                                                    ? sourceGroupList[1] && sourceGroupList[1].name
                                                    : sourceGroupList[1] && sourceGroupList[1].ename
                                            }
                                            source={target[0]}
                                            durationSource={target[1]}
                                            target={source}
                                            direction={true}
                                            noShowSecond={true}
                                        />
                                        <div className={styles.cardDivider}> </div>
                                        <CourseCard
                                            courseCardCode="1"
                                            weekDay={sourceWeekDay}
                                            lesson={sourceLesson + 1}
                                            course={
                                                locale() !== 'en'
                                                    ? sourceCourseList[0].name
                                                    : sourceCourseList[0].englishName
                                            }
                                            group={
                                                locale() !== 'en'
                                                    ? sourceGroupList[0].name
                                                    : sourceGroupList[0].ename
                                            }
                                            durationGroup={
                                                locale() !== 'en'
                                                    ? sourceGroupList[1] && sourceGroupList[1].name
                                                    : sourceGroupList[1] && sourceGroupList[1].ename
                                            }
                                            source={target[0]}
                                            durationSource={target[1]}
                                            target={source}
                                            direction={true}
                                            noShowSecond={false}
                                        />
                                    </div>
                                    {singleArrow}
                                    <div className={styles.durationCardsWrapper}>
                                        <CourseCard courseCardCode="4" />
                                    </div>
                                </div>
                                <AddressConflict
                                    sourceAddressList={sourceAddressList}
                                    sourceCourseList={sourceCourseList}
                                    sourceGroupList={sourceGroupList}
                                    currentVersion={this.props.currentVersion}
                                    searchIndex={this.props.searchIndex}
                                    showExchangeClassTable={this.props.showExchangeClassTable}
                                    scheduleData={this.props.scheduleData}
                                    dispatch={this.props.dispatch}
                                    getCustomScheduleInLessonView={
                                        this.props.getCustomScheduleInLessonView
                                    }
                                    tableView={this.props.tableView}
                                />
                                {this.getOperationMessage(
                                    creatorName,
                                    creatorTime,
                                    operationType,
                                    ifRevoke
                                )}
                            </div>
                        ) : (
                            <div>
                                <div className={styles.recordCardWrapper}>
                                    <CourseCard
                                        courseCardCode="1"
                                        weekDay={sourceWeekDay}
                                        lesson={sourceLesson}
                                        course={
                                            locale() !== 'en'
                                                ? sourceCourseList[0].name
                                                : sourceCourseList[0].englishName
                                        }
                                        group={
                                            locale() !== 'en'
                                                ? sourceGroupList[0].name
                                                : sourceGroupList[0].ename
                                        }
                                        durationGroup={
                                            locale() !== 'en'
                                                ? sourceGroupList[1] && sourceGroupList[1].name
                                                : sourceGroupList[1] && sourceGroupList[1].ename
                                        }
                                        groupId={sourceGroupList[0].id}
                                        source={target[0]}
                                        target={source}
                                        direction={true}
                                        noShowSecond={true}
                                    />
                                    {singleArrow}
                                    <CourseCard courseCardCode="4" />
                                </div>
                                <AddressConflict
                                    sourceAddressList={sourceAddressList}
                                    sourceCourseList={sourceCourseList}
                                    sourceGroupList={sourceGroupList}
                                    targetCourseList={targetCourseList}
                                    targetGroupList={targetGroupList}
                                    targetAddressList={targetAddressList}
                                    durationTargetAddressList={durationTargetAddressList}
                                    durationTargetCourseList={durationTargetCourseList}
                                    durationTargetGroupList={durationTargetGroupList}
                                    currentVersion={this.props.currentVersion}
                                    searchIndex={this.props.searchIndex}
                                    showExchangeClassTable={this.props.showExchangeClassTable}
                                    scheduleData={this.props.scheduleData}
                                    dispatch={this.props.dispatch}
                                    getCustomScheduleInLessonView={
                                        this.props.getCustomScheduleInLessonView
                                    }
                                    tableView={this.props.tableView}
                                />
                                {this.getOperationMessage(
                                    creatorName,
                                    creatorTime,
                                    operationType,
                                    ifRevoke
                                )}
                            </div>
                        )}
                    </div>
                ) : operationType === trans('global.modified', '修改已排课节') ? (
                    <div>
                        {sourceDuration === 2 ? (
                            <div className={styles.recordCardWrapper}>
                                <div className={styles.durationCardsWrapper}>
                                    <CourseCard
                                        courseCardCode="1"
                                        weekDay={sourceWeekDay}
                                        lesson={sourceLesson}
                                        course={
                                            locale() !== 'en'
                                                ? sourceCourseList[0].name
                                                : sourceCourseList[0].englishName
                                        }
                                        group={
                                            locale() !== 'en'
                                                ? sourceGroupList[0].name
                                                : sourceGroupList[0].ename
                                        }
                                        durationGroup={
                                            locale() !== 'en'
                                                ? sourceGroupList[1] && sourceGroupList[1].name
                                                : sourceGroupList[1] && sourceGroupList[1].ename
                                        }
                                        source={target[0]}
                                        durationSource={target[1]}
                                        target={source}
                                        direction={true}
                                        noShowSecond={true}
                                    />
                                    <div className={styles.cardDivider}> </div>
                                    <CourseCard
                                        courseCardCode="1"
                                        weekDay={sourceWeekDay}
                                        lesson={sourceLesson + 1}
                                        course={
                                            locale() !== 'en'
                                                ? sourceCourseList[0].name
                                                : sourceCourseList[0].englishName
                                        }
                                        group={
                                            locale() !== 'en'
                                                ? sourceGroupList[0].name
                                                : sourceGroupList[0].ename
                                        }
                                        durationGroup={
                                            locale() !== 'en'
                                                ? sourceGroupList[1] && sourceGroupList[1].name
                                                : sourceGroupList[1] && sourceGroupList[1].ename
                                        }
                                        source={target[0]}
                                        durationSource={target[1]}
                                        target={source}
                                        direction={true}
                                        noShowSecond={false}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className={styles.recordCardWrapper}>
                                <CourseCard
                                    courseCardCode="1"
                                    weekDay={sourceWeekDay}
                                    lesson={sourceLesson}
                                    course={
                                        locale() !== 'en'
                                            ? sourceCourseList[0].name
                                            : sourceCourseList[0].englishName
                                    }
                                    group={
                                        locale() !== 'en'
                                            ? sourceGroupList[0].name
                                            : sourceGroupList[0].ename
                                    }
                                    durationGroup={
                                        locale() !== 'en'
                                            ? sourceGroupList[1] && sourceGroupList[1].name
                                            : sourceGroupList[1] && sourceGroupList[1].ename
                                    }
                                    source={target[0]}
                                    durationSource={target[1]}
                                    target={source}
                                    direction={true}
                                    noShowSecond={true}
                                />
                            </div>
                        )}
                        <div className={styles.change}>
                            {!lodash.isEqual(sourceUserList, targetUserList) ? (
                                <div className={styles.userChange}>
                                    <div>
                                        {!lodash.isEmpty(sourceUserList) ? (
                                            sourceUserList.map((item, index, arr) => {
                                                return (
                                                    <span>
                                                        <span
                                                            onClick={this.getSchedule.bind(
                                                                this,
                                                                item.userId,
                                                                'teacher',
                                                                item.name
                                                            )}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            {item.name}
                                                        </span>
                                                        {index === arr.length - 1 ? (
                                                            ''
                                                        ) : (
                                                            <span> 、 </span>
                                                        )}
                                                    </span>
                                                );
                                            })
                                        ) : (
                                            <span> 无 </span>
                                        )}
                                    </div>
                                    {conflictSingleArrow}
                                    <div>
                                        {!lodash.isEmpty(targetUserList) ? (
                                            targetUserList.map((item, index, arr) => {
                                                return (
                                                    <span>
                                                        <span
                                                            onClick={this.getSchedule.bind(
                                                                this,
                                                                item.userId,
                                                                'teacher',
                                                                item.name
                                                            )}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            {item.name}
                                                        </span>
                                                        {index === arr.length - 1 ? (
                                                            ''
                                                        ) : (
                                                            <span> 、 </span>
                                                        )}
                                                    </span>
                                                );
                                            })
                                        ) : (
                                            <span> 无 </span>
                                        )}
                                    </div>
                                </div>
                            ) : null}
                            {!lodash.isEqual(sourceAddressList, targetAddressList) ? (
                                <div className={styles.addressChange}>
                                    <div>
                                        {!lodash.isEmpty(sourceAddressList) ? (
                                            sourceAddressList.map((item, index, arr) => {
                                                return (
                                                    <span>
                                                        <span
                                                            onClick={this.getSchedule.bind(
                                                                this,
                                                                item.id,
                                                                'address',
                                                                item.name
                                                            )}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            {item.name}
                                                        </span>
                                                        {index === arr.length - 1 ? (
                                                            ''
                                                        ) : (
                                                            <span> 、 </span>
                                                        )}
                                                    </span>
                                                );
                                            })
                                        ) : (
                                            <span> 无 </span>
                                        )}
                                    </div>
                                    {conflictSingleArrow}
                                    <div>
                                        {!lodash.isEmpty(targetAddressList) ? (
                                            targetAddressList.map((item, index, arr) => {
                                                return (
                                                    <span>
                                                        <span
                                                            onClick={this.getSchedule.bind(
                                                                this,
                                                                item.id,
                                                                'address',
                                                                item.name
                                                            )}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            {item.name}
                                                        </span>
                                                        {index === arr.length - 1 ? (
                                                            ''
                                                        ) : (
                                                            <span> 、 </span>
                                                        )}
                                                    </span>
                                                );
                                            })
                                        ) : (
                                            <span> 无 </span>
                                        )}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                        {this.getOperationMessage(
                            creatorName,
                            creatorTime,
                            operationType,
                            ifRevoke
                        )}
                    </div>
                ) : operationType === '系统换课' ? (
                    <div>
                        <div className={styles.recordCardWrapper}>
                            <CourseCard
                                courseCardCode="1"
                                weekDay={sourceWeekDay}
                                lesson={sourceLesson}
                                course={
                                    locale() !== 'en'
                                        ? sourceCourseList[0].name
                                        : sourceCourseList[0].englishName
                                }
                                group={
                                    locale() !== 'en'
                                        ? sourceGroupList[0].name
                                        : sourceGroupList[0].ename
                                }
                                durationGroup={
                                    locale() !== 'en'
                                        ? sourceGroupList[1] && sourceGroupList[1].name
                                        : sourceGroupList[1] && sourceGroupList[1].ename
                                }
                                source={target[0]}
                                target={source}
                                direction={true}
                                noShowSecond={true}
                            />
                            {doubleArrow}
                            <CourseCard
                                courseCardCode="1"
                                weekDay={targetWeekDay}
                                lesson={targetLesson}
                                course={
                                    locale() !== 'en'
                                        ? targetCourseList[0].name
                                        : targetCourseList[0].englishName
                                }
                                group={
                                    locale() !== 'en'
                                        ? targetGroupList[0].name
                                        : targetGroupList[0].ename
                                }
                                source={source}
                                target={target[0]}
                                direction={false}
                                noShowSecond={true}
                            />
                        </div>
                        {this.getOperationMessage(
                            creatorName,
                            creatorTime,
                            operationType,
                            ifRevoke,
                            true
                        )}
                    </div>
                ) : operationType === '系统代课' ? (
                    <div>
                        <div className={styles.recordCardWrapper}>
                            <CourseCard
                                courseCardCode="1"
                                weekDay={sourceWeekDay}
                                lesson={sourceLesson}
                                course={
                                    locale() !== 'en'
                                        ? sourceCourseList[0].name
                                        : sourceCourseList[0].englishName
                                }
                                group={
                                    locale() !== 'en'
                                        ? sourceGroupList[0].name
                                        : sourceGroupList[0].ename
                                }
                                durationGroup={
                                    locale() !== 'en'
                                        ? sourceGroupList[1] && sourceGroupList[1].name
                                        : sourceGroupList[1] && sourceGroupList[1].ename
                                }
                                source={target[0]}
                                durationSource={target[1]}
                                target={source}
                                direction={true}
                                noShowSecond={true}
                            />
                        </div>
                        <div className={styles.change}>
                            <div className={styles.userChange}>
                                <div>
                                    {!lodash.isEmpty(sourceUserList) ? (
                                        sourceUserList.map((item, index, arr) => {
                                            return (
                                                <span>
                                                    <span
                                                        onClick={this.getSchedule.bind(
                                                            this,
                                                            item.userId,
                                                            'teacher',
                                                            item.name
                                                        )}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        {item.name}
                                                    </span>
                                                    {index === arr.length - 1 ? (
                                                        ''
                                                    ) : (
                                                        <span> 、 </span>
                                                    )}
                                                </span>
                                            );
                                        })
                                    ) : (
                                        <span> 无 </span>
                                    )}
                                </div>
                                {conflictSingleArrow}
                                <div>
                                    {!lodash.isEmpty(targetUserList) ? (
                                        targetUserList.map((item, index, arr) => {
                                            return (
                                                <span>
                                                    <span
                                                        onClick={this.getSchedule.bind(
                                                            this,
                                                            item.userId,
                                                            'teacher',
                                                            item.name
                                                        )}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        {item.name}
                                                    </span>
                                                    {index === arr.length - 1 ? (
                                                        ''
                                                    ) : (
                                                        <span> 、 </span>
                                                    )}
                                                </span>
                                            );
                                        })
                                    ) : (
                                        <span> 无 </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        {this.getOperationMessage(
                            creatorName,
                            creatorTime,
                            operationType,
                            ifRevoke,
                            true
                        )}
                    </div>
                ) : operationType === '系统排课' ? (
                    <div>
                        <div className={styles.fetMsg}>
                            系统排课{record.fetFileDTO.success ? '成功' : '失败'}，排课年级：
                            {record.fetFileDTO.teachingOrgList?.map((item) => item.name).join('、')}
                        </div>
                        {this.getOperationMessage(
                            creatorName,
                            creatorTime,
                            operationType,
                            false,
                            false,
                            record
                        )}
                    </div>
                ) : (
                    <div> {trans('global.Other cases', '其他情况')} </div>
                )}
            </div>
        );
    }
}
