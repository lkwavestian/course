import React, { PureComponent } from 'react';
import styles from './index.less';
import { Icon, DatePicker, Checkbox, Spin, Button, Radio, Tooltip } from 'antd';
import { intoChineseLang, weekDayAbbreviationEn } from '../../../../utils/utils';
import { connect } from 'dva';
import moment from 'moment';
import { isEmpty, uniqBy, uniq } from 'lodash';
import { trans, locale } from '../../../../utils/i18n';

const { RangePicker } = DatePicker;

@connect((state) => ({
    addLessonList: state.replace.addLessonList,
    totalLessonList: state.replace.totalLessonList,
    rangePickerTimeList: state.replace.rangePickerTimeList,
}))
export default class AddLesson extends PureComponent {
    state = {
        loadingStatus: false,
        weekRadio: 1,
    };

    componentDidMount() {
        this.datePickerChange();
    }

    getTotalLessonList = (startTime, endTime) => {
        const { dispatch } = this.props;
        this.setState(
            {
                loadingStatus: true,
            },
            () => {
                dispatch({
                    type: 'replace/getTotalLessonList',
                    payload: {
                        startTime,
                        endTime,
                    },
                }).then(() => {
                    this.setState({
                        loadingStatus: false,
                    });
                });
            }
        );
    };

    cancelRightContent = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'replace/setRightContentType',
            payload: '',
        });
    };

    changeSelectLesson = (item) => {
        const { dispatch, addLessonList } = this.props;
        // if (this.judgeTimeExceed(item)) {
        //     return;
        // }
        let addLessonListCopy = [...addLessonList];
        let targetLessonIndex = addLessonListCopy.findIndex(
            (lessonItem) => lessonItem.source?.id === item.id
        );
        if (targetLessonIndex === -1) {
            addLessonListCopy.push({
                source: item,
            });
        } else {
            addLessonListCopy.splice(targetLessonIndex, 1);
        }
        dispatch({
            type: 'replace/setAddLessonList',
            payload: addLessonListCopy,
        });
        dispatch({
            type: 'replace/selectCopySendRule',
            payload: {
                resultIdString: addLessonListCopy.map((item) => item.source.id).join(),
            },
        });
    };

    datePickerChange = (timeValue) => {
        const { dispatch } = this.props;
        let startWeekValue = moment(timeValue).startOf('week').valueOf();
        let endWeekValue = moment(timeValue).endOf('week').valueOf() - 999;

        if (startWeekValue === moment().startOf('week').valueOf()) {
            this.setState({
                weekRadio: 1,
            });
        } else if (startWeekValue === moment().add(7, 'days').startOf('week').valueOf()) {
            this.setState({
                weekRadio: 2,
            });
        } else {
            this.setState({
                weekRadio: undefined,
            });
        }
        this.getTotalLessonList(startWeekValue, endWeekValue);
        dispatch({
            type: 'replace/setRangePickerTimeList',
            payload: [startWeekValue, endWeekValue],
        });
    };

    //判断当前时间是否超出课程时间
    judgeTimeExceed = (lesson) => {
        return moment().valueOf() > lesson.startTimeMillion;
    };

    selectAllLesson = (e) => {
        const { dispatch, totalLessonList } = this.props;
        let checked = e.target.checked;
        if (checked) {
            dispatch({
                type: 'replace/setAddLessonList',
                payload: totalLessonList
                    // .filter((item) => !this.judgeTimeExceed(item))
                    .map((item) => {
                        return {
                            source: item,
                        };
                    }),
            });
        } else {
            dispatch({
                type: 'replace/setAddLessonList',
                payload: [],
            });
        }
    };

    weekRadioChange = (e) => {
        let value = e.target.value;
        if (value === 1) {
            this.datePickerChange(moment());
        }
        if (value === 2) {
            this.datePickerChange(moment().add(7, 'days'));
        }
    };

    render() {
        const { totalLessonList, rangePickerTimeList, addLessonList, currentLang } = this.props;
        const { loadingStatus, weekRadio } = this.state;
        let selectLessonIdList = addLessonList.map((item) => item.source.id);
        return (
            <Spin spinning={loadingStatus} wrapperClassName={styles.rightContentWrapper}>
                <div className={styles.addLesson}>
                    <div className={styles.header}>
                        <Icon
                            className={styles.icon}
                            type="close"
                            onClick={this.cancelRightContent}
                        />
                        <span className={styles.text}>
                            {trans('global.replace.addLesson', '添加课节')}
                        </span>
                    </div>
                    <div
                        className={styles.mainContent}
                        style={{ width: currentLang === 'cn' ? 520 : 600 }}
                    >
                        <div className={styles.mainContentWrapper}>
                            <Radio.Group
                                className={styles.radioGroupWrapper}
                                onChange={this.weekRadioChange}
                                value={weekRadio}
                                // disabled={addLessonList.length}
                            >
                                <Radio.Button value={1}>
                                    {trans('global.replace.thisWeek', '本周')}
                                </Radio.Button>
                                <Radio.Button value={2}>
                                    {trans('global.replace.nextWeek', '下周')}
                                </Radio.Button>
                            </Radio.Group>
                            <div className={styles.timePicker}>
                                <span
                                    className={styles.timeText}
                                    style={{
                                        // color:
                                        //     addLessonList.length > 0
                                        //         ? 'rgba(0, 0, 0, 0.25)'
                                        //         : 'rgba(0, 0, 0, 0.65)',
                                        // backgroundColor:
                                        //     addLessonList.length > 0 ? '#f5f5f5' : '#fff',
                                        color: 'rgba(0, 0, 0, 0.65)',
                                        backgroundColor: '#fff',
                                    }}
                                >
                                    {!isEmpty(rangePickerTimeList) ? (
                                        `${moment(rangePickerTimeList[0]).format(
                                            'YYYY-MM-DD'
                                        )} ~ ${moment(rangePickerTimeList[1]).format('YYYY-MM-DD')}`
                                    ) : (
                                        <span className={styles.placeHolder}>请选择日期</span>
                                    )}
                                </span>
                                <DatePicker
                                    onChange={this.datePickerChange}
                                    className={styles.datePicker}
                                    allowClear={false}
                                    getCalendarContainer={(triggerNode) =>
                                        triggerNode.parentElement
                                    }
                                    // disabled={addLessonList.length > 0}
                                />
                            </div>
                            {!isEmpty(totalLessonList) && (
                                <Checkbox
                                    onChange={this.selectAllLesson}
                                    checked={
                                        // totalLessonList.filter(
                                        //     (item) => !this.judgeTimeExceed(item)
                                        // ).length === addLessonList.length
                                        totalLessonList.length === addLessonList.length
                                    }
                                >
                                    {trans('global.replace.pc.all', '全选')}
                                </Checkbox>
                            )}
                        </div>
                        <div className={styles.addLessonList}>
                            {!isEmpty(totalLessonList) ? (
                                totalLessonList.map((item) => (
                                    <div
                                        className={styles.addLessonItem}
                                        style={{
                                            border: selectLessonIdList.includes(item.id)
                                                ? '1px solid rgba(4,69,252,1)'
                                                : '1px solid rgba(1,17,61,0.12)',
                                        }}
                                        onClick={() => this.changeSelectLesson(item)}
                                        key={item.id}
                                    >
                                        <Checkbox
                                            checked={selectLessonIdList.includes(item.id)}
                                            // disabled={this.judgeTimeExceed(item)}
                                        />
                                        <div className={styles.lessonMsg}>
                                            <div className={styles.time}>
                                                <span>
                                                    {currentLang === 'cn'
                                                        ? `周${intoChineseLang(item.weekDay)}第${
                                                              item.courseSort
                                                          }节`
                                                        : `${weekDayAbbreviationEn(
                                                              item.weekDay
                                                          )} Period ${item.courseSort}`}
                                                </span>
                                                <span className={styles.lesson}>
                                                    (
                                                    {moment(item.startTimeMillion).format(
                                                        'YYYY.MM.DD HH:mm'
                                                    )}
                                                    )
                                                </span>
                                            </div>
                                            <div className={styles.class}>
                                                <Tooltip
                                                    title={item.studentGroups
                                                        ?.map((item) =>
                                                            currentLang === 'cn'
                                                                ? item.name
                                                                : item.englishName
                                                        )
                                                        .join('、')}
                                                >
                                                    <div className={styles.studentGroups}>
                                                        {item.studentGroups
                                                            ?.map((item) =>
                                                                currentLang === 'cn'
                                                                    ? item.name
                                                                    : item.englishName
                                                            )
                                                            .join('、')}
                                                    </div>
                                                </Tooltip>
                                                <span>
                                                    {currentLang === 'cn'
                                                        ? item.courseName
                                                        : item.courseEnglishName}
                                                </span>
                                            </div>
                                        </div>
                                        {/* {this.judgeTimeExceed(item) && (
                                            <span className={styles.timeExceed}>已上</span>
                                        )} */}
                                    </div>
                                ))
                            ) : !isEmpty(rangePickerTimeList) && !loadingStatus ? (
                                <span className={styles.emptyContent}>
                                    {trans(
                                        'global.replace.pc.addLesson.noSchedule',
                                        '暂未找到所选日期范围内您的已公布课表'
                                    )}
                                </span>
                            ) : (
                                ''
                            )}
                        </div>
                    </div>
                </div>
            </Spin>
        );
    }
}
