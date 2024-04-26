import React, { Fragment, PureComponent } from 'react';
import { Resizable } from 're-resizable';
import { connect } from 'dva';
import { Spin, Row, Col, Popover, message, Icon } from 'antd';
import { isEmpty, remove } from 'lodash';
import styles from './index.less';
import { intoChineseNumber } from '../../../../../utils/utils';

import PopoverContentLessonView from '../../CustomCourse/popoverContentLessonView';
import CustomClassTable from './CustomClassTable';

let lookDetailTimeOut = null; //防止双击出发单击两次

@connect((state) => ({
    lessonViewScheduleData: state.lessonView.lessonViewScheduleData,
    arrangeDetailList: state.timeTable.arrangeDetailList,

    lessonViewTableLoading: state.lessonView.lessonViewTableLoading,
    newCanChangeCourse:
        (state.exchangeCourse.exchangeResult && state.exchangeCourse.exchangeResult.content) || [],
    move: (state.exchangeCourse.move && state.exchangeCourse.move.content) || [],
    lessonViewCustomValue: state.lessonView.lessonViewCustomValue,
    lessonViewCustomLabel: state.lessonView.lessonViewCustomLabel,
    conflictInformation: state.lessonView.conflictInformation,
    referenceTableLoadingStatus: state.lessonView.referenceTableLoadingStatus,
    currentStudentGroup: state.lessonView.currentStudentGroup,
    displayRules: state.lessonView.displayRules,
    showWeekend: state.lessonView.showWeekend,
    currentSideBar: state.lessonView.currentSideBar,
    mainScheduleData: state.lessonView.mainScheduleData,

    //加号
    teacherList: state.course.teacherList,
    areaList: state.timeTable.areaList,
    gradeList: state.timeTable.customGradeList,
    groupList: state.timeTable.customGroupList,
    customStudentList: state.timeTable.customStudentList,
    gradeByTypeArr: state.timeTable.gradeByTypeArr, //学生组件优化

    displayType: state.timeTable.displayType,
}))
export default class CustomTable extends PureComponent {
    state = {
        customPopoverVisible: false,
        customViewTableCount: 1,
        clickUtil: {},
    };
    handleReduceSideBarClick = () => {
        let setCustomTableRowCountBySelectValue = (value) => {
            const { dispatch } = this.props;
            let calculateRowCount = (value) => {
                if (isEmpty(value)) return 1;
                if (value.length === 1) return 1;
                if (value.length === 2) return 2;
                if (value.length >= 3) return 3;
            };
            dispatch({
                type: 'lessonView/setCustomTableRowCount',
                payload: calculateRowCount(value),
            });
        };
        const { dispatch, mainScheduleData } = this.props;
        let lessonViewTimeTableWrapperEle = document.getElementById('lessonViewTimeTableWrapper');
        if (lessonViewTimeTableWrapperEle) {
            lessonViewTimeTableWrapperEle.style.width = '96vw';
        }
        dispatch({
            type: 'lessonView/setSideBarVisible',
            payload: 'addSideBar',
        });
        setCustomTableRowCountBySelectValue(mainScheduleData.scheduleData);
    };

    clickPlus = () => {
        this.setState({
            customPopoverVisible: true,
        });
    };

    closePlus = () => {
        this.setState({
            customPopoverVisible: false,
        });
    };

    clickDelete = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'lessonView/clearCustomScheduleSync',
        });
    };

    clickUpdate = async () => {
        const { dispatch, lessonViewScheduleData, currentVersion } = this.props;
        let formateArr = lessonViewScheduleData
            .filter((item) => item.view)
            .map((item) => {
                return {
                    id: currentVersion,
                    [item.idType]: [item.studentGroup.id],
                    type: item.view,
                    idType: item.idType,
                };
            });
        await dispatch({
            type: 'lessonView/setReferenceTableLoadingStatusSync',
            payload: true,
        });
        await Promise.all(
            formateArr.map((item) => {
                if (item.type === 'group') {
                    //如果当前课表是班级课表，需要刷新该班级课表的待排列表

                    return dispatch({
                        type: 'lessonView/findCustomSchedule',
                        payload: item,
                    }).then(() => {
                        dispatch({
                            type: 'lessonView/getClassScheduleACList',
                            payload: {
                                versionId: currentVersion,
                                adminGroupIdString: item.groupIds[0],
                            },
                        });
                    });
                } else {
                    //如果不是班级课表，正常请求

                    return dispatch({
                        type: 'lessonView/findCustomSchedule',
                        payload: item,
                    });
                }
            })
        );
        await dispatch({
            type: 'lessonView/setReferenceTableLoadingStatusSync',
            payload: false,
        });
    };

    processStudentScheduleData = (customScheduleDataList) => {
        let lessonCount = 0;
        let weekDayArrLength = this.getClassScheduleWeekday(customScheduleDataList);
        let formatList = customScheduleDataList
            .slice(0, weekDayArrLength)
            .map((dayLessonList) => {
                return dayLessonList.filter((lesson) => lesson.detail);
            }) //过滤掉空课节
            .map((dayLessonList) => {
                lessonCount += dayLessonList.length;
                return dayLessonList;
            })
            .map((dayLessonList) => {
                return this.insertArr(dayLessonList);
            });
        return {
            formatList,
            lessonCount,
        };
    };

    insertArr = (dayLessonList) => {
        const {
            displayRules: { morningLessonNum, afternoonLessonNum, eveningLessonNum },
        } = this.props;

        //用[]填充数组，长度为上午 + 下午 + 晚上
        let res = Array(morningLessonNum + afternoonLessonNum + eveningLessonNum).fill([]);

        for (let i = 0; i < dayLessonList.length; i++) {
            //判断上午、下午
            let timeAttribution = dayLessonList[i].timeAttribution;

            //判断上午第几节、下午第几节
            let timeAttributionSort = dayLessonList[i].timeAttributionSort;

            //如果课是上午，直接取第几节
            //如果课是下午，上午节次数 + 下午第几节
            //如果课是晚上，上午节次数 + 下午节次数 + 晚上第几节
            let targetIndex =
                timeAttribution === 1
                    ? timeAttributionSort - 1
                    : timeAttribution === 2
                    ? timeAttributionSort - 1 + morningLessonNum
                    : timeAttributionSort - 1 + morningLessonNum + afternoonLessonNum;

            //如果是连堂课，放到一个数组里面，否则新开一个数组
            if (!isEmpty(res[targetIndex])) {
                res[targetIndex].push(dayLessonList[i]);
            } else {
                res[targetIndex] = [dayLessonList[i]];
            }
        }

        //限制结果数组长度
        res.length = morningLessonNum + afternoonLessonNum + eveningLessonNum;
        return res;
    };

    getStudentSchedule = (customScheduleData) => {
        const {
            displayRules: { morningLessonNum, afternoonLessonNum, eveningLessonNum },
            currentStudentGroup,
        } = this.props;
        const { customViewTableCount, clickUtil } = this.state;
        let { view, resultList, studentGroup } = customScheduleData;
        let { formatList: formatCustomScheduleData, lessonCount } =
            this.processStudentScheduleData(resultList);
        let calculateWidth = `${100 / formatCustomScheduleData.length}%`;
        return (
            <Col className={styles.referenceTable} span={customViewTableCount === 2 ? 12 : 24}>
                <div className={styles.customHeader}>
                    {customScheduleData.view === 'teacher' ? (
                        <Icon type="user" />
                    ) : (
                        <span style={{ marginLeft: 10 }}></span>
                    )}
                    <div>
                        <span>{studentGroup.name}</span>
                        <span style={{ marginLeft: 10 }}>{lessonCount}节</span>
                    </div>
                    <Icon
                        type="close"
                        onClick={() => {
                            this.closeCustomTable(customScheduleData);
                        }}
                    />
                </div>
                <Row className={styles.customTableWrapper}>
                    <Col className={styles.emptyLessonWrapper} span={2}>
                        {this.getLessonArray(
                            morningLessonNum + afternoonLessonNum + eveningLessonNum
                        ).map((item) => (
                            <div className={styles.emptyLesson}>{item === 0 ? '' : item}</div>
                        ))}
                    </Col>
                    <Col span={22}>
                        <Row className={styles.customTable}>
                            {formatCustomScheduleData.map((dayLessonList, listIndex) => (
                                <Col
                                    className={styles.dayLessonListCol}
                                    // span={24 / formatCustomScheduleData.length}
                                    style={{ width: calculateWidth }}
                                >
                                    <div className={styles.lessonWrapper}>
                                        {intoChineseNumber(listIndex + 1)}
                                    </div>
                                    {dayLessonList.map((lessonList) => {
                                        return (
                                            <Row className={styles.lessonWrapper}>
                                                {lessonList.map((lessonItem, indexIndex) => {
                                                    return (
                                                        <Col
                                                            className={styles.lessonItem}
                                                            style={{
                                                                backgroundColor:
                                                                    lessonItem.courseColor
                                                                        ? lessonItem.courseColor
                                                                        : '#3798ff',
                                                                border:
                                                                    clickUtil.acId ===
                                                                        lessonItem.acId &&
                                                                    customScheduleData.studentGroup
                                                                        .id ===
                                                                        currentStudentGroup &&
                                                                    '2px solid rgb(20, 118, 255) ',
                                                                borderRight:
                                                                    lessonList.length > 1 &&
                                                                    indexIndex !==
                                                                        lessonList.length - 1
                                                                        ? '1px solid white'
                                                                        : '',
                                                            }}
                                                            span={24 / lessonList.length}
                                                            onClick={(e) =>
                                                                this.handleCourseClick(
                                                                    lessonItem,
                                                                    e,
                                                                    customScheduleData
                                                                )
                                                            }
                                                        >
                                                            {this.getLessonItemContent(
                                                                view,
                                                                lessonItem
                                                            )}
                                                        </Col>
                                                    );
                                                })}
                                            </Row>
                                        );
                                    })}
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
            </Col>
        );
    };

    getLessonArray = (maxLessonNum) => {
        let arr = [];
        for (let i = 1; i <= maxLessonNum; i++) {
            arr[i] = i;
        }
        arr.unshift(0);
        return arr;
    };

    changeCustomTableRowCount = () => {
        const { customViewTableCount } = this.state;
        this.setState({
            customViewTableCount: customViewTableCount === 2 ? 1 : 2,
        });
    };

    closeCustomTable = (customScheduleData) => {
        const { dispatch, lessonViewScheduleData } = this.props;
        remove(
            lessonViewScheduleData,
            (item) =>
                item.view === customScheduleData.view &&
                item.studentGroup.id === customScheduleData.studentGroup.id
        );
        dispatch({
            type: 'lessonView/setScheduleDataSync',
            payload: lessonViewScheduleData,
        });
    };
    handleCourseClick = (lessonItem, e, customScheduleData) => {
        const { dispatch, transmitState } = this.props;
        if (lessonItem.detail) {
            this.setState({
                clickUtil: lessonItem,
            });
            typeof transmitState == 'function' && transmitState(lessonItem);
            dispatch({
                type: 'timeTable/lessonViewLookCourseDetail',
                payload: {
                    id: lessonItem.detail.id,
                    type: 1,
                },
            });
            dispatch({
                type: 'lessonView/setCurrentStudentGroupSync',
                payload: customScheduleData?.studentGroup.id,
            });
        }
    };

    getTeacherOrAddressSchedule = (customScheduleData) => {
        const {
            currentStudentGroup,
            displayRules: { morningLessonNum, afternoonLessonNum, eveningLessonNum },
        } = this.props;
        const { customViewTableCount, clickUtil } = this.state;
        let { view, resultList, studentGroup } = customScheduleData;
        let { formatList: formatCustomScheduleData, lessonCount } =
            this.processTeacherOrAddressScheduleData(resultList);

        let calculateWidth = `${100 / formatCustomScheduleData.length}%`;
        return (
            <Col className={styles.referenceTable} span={customViewTableCount === 2 ? 12 : 24}>
                <div className={styles.customHeader}>
                    {customScheduleData.view === 'teacher' ? (
                        <Icon type="user" />
                    ) : (
                        <span style={{ marginLeft: 10 }}></span>
                    )}
                    <div>
                        <span>{studentGroup.name}</span>
                        <span style={{ marginLeft: 10 }}>{lessonCount}节</span>
                    </div>
                    <Icon
                        type="close"
                        onClick={() => {
                            this.closeCustomTable(customScheduleData);
                        }}
                    />
                </div>
                <Row className={styles.customTableWrapper}>
                    <Col className={styles.emptyLessonWrapper} span={2}>
                        <div className={styles.emptyLesson}></div>
                        {morningLessonNum !== 0 && (
                            <div
                                className={styles.emptyLesson}
                                style={{
                                    height: morningLessonNum * 40,
                                }}
                            >
                                <span>上午</span>
                            </div>
                        )}

                        {afternoonLessonNum !== 0 && (
                            <div
                                className={styles.emptyLesson}
                                style={{
                                    height: afternoonLessonNum * 40,
                                }}
                            >
                                <span>下午</span>
                            </div>
                        )}

                        {eveningLessonNum !== 0 && (
                            <div
                                className={styles.emptyLesson}
                                style={{
                                    height: eveningLessonNum * 40,
                                }}
                            >
                                <span>晚上</span>
                            </div>
                        )}
                    </Col>
                    <Col span={22}>
                        <Row className={styles.customTable}>
                            {formatCustomScheduleData.map((dayLessonList, listIndex) => (
                                <Col
                                    className={styles.dayLessonListCol}
                                    // span={24 / formatCustomScheduleData.length}
                                    style={{ width: calculateWidth }}
                                >
                                    <div className={styles.lessonWrapper}>
                                        {intoChineseNumber(listIndex + 1)}
                                    </div>
                                    {dayLessonList.map((lessonList, index) => {
                                        return (
                                            <Row className={styles.lessonWrapper}>
                                                {lessonList.map((lessonItem, indexIndex) => {
                                                    return (
                                                        <Col
                                                            className={styles.lessonItem}
                                                            style={{
                                                                backgroundColor:
                                                                    lessonItem.courseColor
                                                                        ? lessonItem.courseColor
                                                                        : '#3798ff',
                                                                border:
                                                                    clickUtil.acId ===
                                                                        lessonItem.acId &&
                                                                    customScheduleData.studentGroup
                                                                        .id ===
                                                                        currentStudentGroup &&
                                                                    '2px solid rgb(20, 118, 255) ',
                                                                borderRight:
                                                                    lessonList.length > 1 &&
                                                                    indexIndex !==
                                                                        lessonList.length - 1
                                                                        ? '1px solid white'
                                                                        : '',
                                                            }}
                                                            span={24 / lessonList.length}
                                                            onClick={(e) =>
                                                                this.handleCourseClick(
                                                                    lessonItem,
                                                                    e,
                                                                    customScheduleData
                                                                )
                                                            }
                                                        >
                                                            {this.getLessonItemContent(
                                                                view,
                                                                lessonItem
                                                            )}
                                                        </Col>
                                                    );
                                                })}
                                            </Row>
                                        );
                                    })}
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
            </Col>
        );
    };

    processTeacherOrAddressScheduleData = (resultList) => {
        let lessonCount = 0;
        let weekDayArrLength = this.getClassScheduleWeekday(resultList);
        let formatList = resultList
            .slice(0, weekDayArrLength)
            .map((dayLessonList) => {
                return dayLessonList.filter((lessonItem) => {
                    if (lessonItem.detail) {
                        lessonCount++; //课程总数
                        return true;
                    } else {
                        return false;
                    }
                });
            })
            .map((dayLessonList) => {
                return this.insertArr(dayLessonList);
            }); //1. 处理连堂课，压缩数组 2. 插入空数组
        return {
            formatList,
            lessonCount,
        };
    };

    getClassSchedule = (customScheduleData) => {
        const { customViewTableCount } = this.state;
        return (
            <Col span={customViewTableCount === 2 ? 12 : 24} style={{ marginBottom: 20 }}>
                <CustomClassTable
                    classSchedule={customScheduleData} //classSchedule表示当前操作的班级
                    {...this.props}
                    closeCustomTable={this.closeCustomTable}
                    location="CustomClassTable"
                />
            </Col>
        );
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

    getLessonItemContent = (view, lessonItem) => {
        const { displayType } = this.props;
        let getCourseOrStudentGroupName = () => {
            //是否展示缩写
            let isDisplayAbbreviation = displayType.includes(6);
            let res = '';
            if (view === 'teacher') {
                if (isDisplayAbbreviation) {
                    res = lessonItem.studentGroups[0]?.groupAbbreviation
                        ? lessonItem.studentGroups[0]?.groupAbbreviation
                        : lessonItem.studentGroups[0]?.name;
                } else {
                    res = lessonItem.studentGroups[0]?.name;
                }
            } else {
                if (isDisplayAbbreviation) {
                    res = lessonItem.courseShortName ? lessonItem.courseShortName : lessonItem.name;
                } else {
                    res = lessonItem.name;
                }
            }
            return <span>{res}</span>;
        };
        let getAddressName = () => {
            if (view === 'teacher') {
                //是否显示场地
                let isDisplayAddress = displayType.includes(10);
                return <span>{isDisplayAddress ? lessonItem.detail.roomName : ''}</span>;
            }
        };
        return (
            <Fragment>
                {getCourseOrStudentGroupName()}
                {getAddressName()}
            </Fragment>
        );
    };

    render() {
        const {
            lessonViewScheduleData,
            currentVersion,
            gradeByTypeArr,
            teacherList,
            areaList,
            gradeList,
            groupList,
            customStudentList,
            getCustomResult,
            saveCustomValue,
            referenceTableLoadingStatus,
            currentSideBar,
        } = this.props;
        const { customPopoverVisible, customViewTableCount } = this.state;

        return (
            <Resizable
                className={styles.referenceScheduleWrapper}
                enable={{
                    top: false,
                    right: false,
                    bottom: false,
                    left: true,
                    topRight: false,
                    bottomRight: false,
                    bottomLeft: false,
                    topLeft: false,
                }}
                style={{ display: currentSideBar === 'reduceSideBar' ? 'block' : 'none' }}
                defaultSize={{ width: 600 }}
                id="referenceScheduleWrapper"
            >
                <div className={styles.referenceSchedule}>
                    <div
                        className={styles.reduceSideBar}
                        onClick={this.handleReduceSideBarClick}
                        style={{ display: currentSideBar === 'reduceSideBar' ? 'block' : 'none' }}
                    >
                        <div className={styles.reduceTriangle}></div>
                    </div>
                    <div className={styles.operationList}>
                        <div className={styles.leftSide}>
                            <Popover
                                placement="right"
                                title={null}
                                content={
                                    <PopoverContentLessonView
                                        teacherList={teacherList}
                                        areaList={areaList}
                                        gradeList={gradeList}
                                        groupList={groupList}
                                        customStudentList={customStudentList}
                                        getCustomResult={getCustomResult}
                                        closePlus={this.closePlus} // ?
                                        type="fromClass"
                                        rowValue={lessonViewScheduleData[0]}
                                        currentVersion={currentVersion}
                                        scheduleData={lessonViewScheduleData}
                                        saveCustomValue={saveCustomValue}
                                        // showDelete={this.showDelete}
                                        gradeByTypeArr={gradeByTypeArr}
                                    ></PopoverContentLessonView>
                                }
                                trigger="click"
                                visible={customPopoverVisible}
                                // onVisibleChange={this.plusHandle.bind(this,item.studentGroup.id)}
                            >
                                <Icon type="plus" onClick={this.clickPlus} />
                            </Popover>
                            <Icon type="delete" onClick={this.clickDelete} />
                            {referenceTableLoadingStatus ? (
                                <Icon type="loading" />
                            ) : (
                                <Icon type="reload" onClick={this.clickUpdate} />
                            )}
                        </div>
                        <div className={styles.rightSide}>
                            <Icon
                                type="appstore"
                                style={{ color: customViewTableCount === 2 ? '#4d7fff' : '' }}
                                onClick={this.changeCustomTableRowCount}
                            />
                        </div>
                    </div>
                    <Spin spinning={referenceTableLoadingStatus}>
                        <Row className={styles.referenceTableWrapper} gutter={20}>
                            {lessonViewScheduleData
                                .filter((item) => item.view)
                                .map((item, index) => {
                                    return item.view === 'group'
                                        ? this.getClassSchedule(item)
                                        : item.view === 'teacher' || item.view === 'address'
                                        ? this.getTeacherOrAddressSchedule(item)
                                        : this.getStudentSchedule(item);
                                })}
                        </Row>
                    </Spin>
                </div>
            </Resizable>
        );
    }
}
