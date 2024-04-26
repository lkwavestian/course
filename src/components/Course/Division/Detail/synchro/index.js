import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './index.less';
import { Form, Button, DatePicker, Select, Input, Modal, message, Spin } from 'antd';
import lodash from 'lodash';
import { trans } from '../../../../../utils/i18n';
import moment from 'moment';
// import { debounce } from '../../../../../utils/utils';

const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

@Form.create()
@connect((state) => ({
    confirmSync: state.devision.confirmSync,
    confirmSyncText: state.devision.confirmSyncText,
    dividePlanDetail: state.devision.dividePlanDetail,
    weekVersionList: state.devision.weekVersionList,
    saveDividePlanSyncSchduleResult: state.devision.saveDividePlanSyncSchduleResult,
}))
export default class Synchro extends PureComponent {
    constructor(props) {
        super(props);
        const { versionInfo } = this.props;
        this.state = {
            sureSyncModalVisible: false,
            choiceStartTime: '',
            choiceEndTime: '',
            versionSelect: null,
            flowGroupNumbers: undefined,
            arr: [],
            courseName: [],
            courseNameClassList: [],
            // changeBeforeStartTime:
            //     versionInfo &&
            //     versionInfo.lastPublishedVersion &&
            //     versionInfo.lastPublishedVersion.startTime, // 变动前的时间
            // changeAfterStartTime: versionInfo && versionInfo.startTime, // 变动后的默认展示时间
            // beforeStartTime: '',
            // afterStartTime: '',
            // startTime:
            //     (versionInfo &&
            //         versionInfo.lastPublishedVersion &&
            //         versionInfo.lastPublishedVersion.startTime) ||
            //     '',
            // endTime:
            //     (versionInfo &&
            //         versionInfo.lastPublishedVersion &&
            //         versionInfo.lastPublishedVersion.endTime) ||
            //     '',
            startTime: '',
            endTime: '',
            isUploading: false,
            isSyncUploading: false,
        };
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'devision/dividePlanDetail',
            payload: {
                dividePlanId: this.props.id,
            },
        }).then(() => {
            const { dividePlanDetail } = this.props;
            console.log('dividePlanDetail', dividePlanDetail);
            let arr = [];
            let courseNameList = [];

            for (let i = 0; i < dividePlanDetail.chooseCourseNameList.length; i++) {
                courseNameList.push({
                    chooseCourseName: dividePlanDetail.chooseCourseNameList[i],
                    targetCourseNames: '',
                });
            }
            console.log('courseNameList', courseNameList);

            for (let i = 1; i <= dividePlanDetail.flowGroupNumber; i++) {
                arr.push({
                    flowGroupNumber: i,
                    weekAndLesson: '',
                });
            }
            console.log('arr', arr);

            let weekSelectList = dividePlanDetail.saveDividePlanSetup.weekDayLessonList;
            console.log('weekSelectList', weekSelectList);
            for (let k = 0; k < arr.length; k++) {
                for (let j = 0; j < weekSelectList.length; j++) {
                    if (arr[k].flowGroupNumber == weekSelectList[j].flowGroupNumber) {
                        arr[k].weekAndLesson = weekSelectList[j].weekAndLesson;
                    }
                }
            }
            console.log('arr', arr);

            let courseList = dividePlanDetail.saveDividePlanSetup.courseList;
            console.log('courseList', courseList);
            for (let i = 0; i < courseNameList.length; i++) {
                for (let j = 0; j < courseList.length; j++) {
                    if (courseNameList[i].chooseCourseName == courseList[j].chooseCourseName) {
                        courseNameList[i].targetCourseNames = courseList[j].targetCourseNames;
                    }
                }
            }
            console.log('courseNameList', courseNameList);

            this.setState(
                {
                    arr,
                    courseName: courseNameList,
                    // courseNameClassList,
                    startTime:
                        dividePlanDetail &&
                        dividePlanDetail.saveDividePlanSetup &&
                        dividePlanDetail.saveDividePlanSetup.versionStartTime,
                    endTime:
                        dividePlanDetail &&
                        dividePlanDetail.saveDividePlanSetup &&
                        dividePlanDetail.saveDividePlanSetup.versionEndTime,
                },
                () => {}
            );
        });
    }

    // onChange = (date, dateString) => {
    //     this.setState(
    //         {
    //             choiceStartTime: dateString[0],
    //             choiceEndTime: dateString[1],
    //         },
    //         () => {
    //             this.getWeekVersionList();
    //         }
    //     );
    // };

    getCompareList = () => {
        const { dispatch, versionId, dividePlanDetail } = this.props;
        const { startTime, endTime } = this.state;
        dispatch({
            type: 'devision/weekVersionList',
            payload: {
                startTime: new Date(startTime).getTime(),
                endTime: new Date(endTime).getTime(),
                semesterId: dividePlanDetail.semesterId,
            },
        });
    };

    // getWeekVersionList = () => {
    //     const { dispatch, dividePlanDetail } = this.props;
    //     const { choiceStartTime, choiceEndTime } = this.state;
    //     dispatch({
    //         type: 'devision/weekVersionList',
    //         payload: {
    //             starTime: choiceStartTime,
    //             endTime: choiceEndTime,
    //             semesterId: dividePlanDetail.semesterId,
    //         },
    //     });
    // };

    handleChange = (value) => {
        console.log(`selected ${value}`);
        this.setState({
            versionSelect: value,
        });
    };

    saveSet = () => {
        const { dispatch, dividePlanDetail } = this.props;
        const { versionSelect, arr, courseName } = this.state;
        this.setState({
            isUploading: true,
        });
        dispatch({
            type: 'devision/saveDividePlanSyncSchduleResult',
            payload: {
                dividePlanId: this.props.id,
                weekVersionId: versionSelect
                    ? versionSelect
                    : dividePlanDetail.saveDividePlanSetup.weekVersionId,
                weekDayLessonList: arr,
                courseList: courseName,
            },
        }).then(() => {
            const { saveDividePlanSyncSchduleResult } = this.props;
            console.log('saveDividePlanSyncSchduleResult', saveDividePlanSyncSchduleResult);
            // console.log('first', !lodash.isEmpty(saveDividePlanSyncSchduleResult).syncState);
            this.setState({
                isUploading: false,
            });
            if (
                saveDividePlanSyncSchduleResult &&
                saveDividePlanSyncSchduleResult.syncState == true
            ) {
                message.success(trans('global.saveSuccess', '保存成功'));
            } else {
                Modal.error({
                    title: '失败信息',
                    content:
                        saveDividePlanSyncSchduleResult &&
                        saveDividePlanSyncSchduleResult.failMessage,
                });
                // message.info(trans('global.saveFail', '保存失败'));
            }
        });
    };

    sureSync = () => {
        const { dispatch } = this.props;
        this.setState({
            isSyncUploading: true,
        });
        dispatch({
            type: 'devision/confirmSync',
            payload: {
                dividePlanId: this.props.id,
            },
        }).then(() => {
            const { confirmSync } = this.props;
            this.setState({
                isSyncUploading: false,
            });
            if (!lodash.isEmpty(confirmSync.content.failMessage)) {
                Modal.error({
                    content:
                        // (!lodash.isEmpty(importStudentExcel) &&
                        //     importStudentExcel.toString()) ||
                        !lodash.isEmpty(confirmSync.content.failMessage) &&
                        confirmSync.content.failMessage.toString(),
                    //     ||
                    // (!lodash.isEmpty(importStudentClassExcel) &&
                    //     importStudentClassExcel.toString()),
                });
                this.setState({
                    sureSyncModalVisible: false,
                });
            } else {
                if (confirmSync.status) {
                    message.success(trans('global.scheduleImportSuccess', '同步成功'));
                }
                // this.getImportStudentResult();
                this.setState(
                    {
                        sureSyncModalVisible: false,
                        sureSyncModal: true,
                    },
                    () => {
                        console.log('sureSyncModal', this.state.sureSyncModal);
                    }
                );
            }
        });
    };

    sureSyncSecInfo = () => {
        const { dispatch, dividePlanDetail } = this.props;
        const { versionSelect, arr, courseName } = this.state;
        this.setState({
            isUploading: true,
        });
        dispatch({
            type: 'devision/confirmSyncText',
            payload: {
                dividePlanId: this.props.id,
                weekVersionId: versionSelect
                    ? versionSelect
                    : dividePlanDetail.saveDividePlanSetup.weekVersionId,
                weekDayLessonList: arr,
                courseList: courseName,
            },
        }).then(() => {
            const { confirmSyncText } = this.props;
            this.setState({
                isUploading: false,
            });
            // console.log('confirmSyncText.content.failMessage', confirmSyncText.content);
            if (!lodash.isEmpty(confirmSyncText.content.failMessage)) {
                Modal.error({
                    content:
                        // (!lodash.isEmpty(importStudentExcel) &&
                        //     importStudentExcel.toString()) ||
                        !lodash.isEmpty(confirmSyncText.content.failMessage) &&
                        confirmSyncText.content.failMessage.toString(),
                    //     ||
                    // (!lodash.isEmpty(importStudentClassExcel) &&
                    //     importStudentClassExcel.toString()),
                });
                this.setState({
                    sureSyncModalVisible: false,
                });
            } else {
                if (confirmSyncText.status) {
                    message.success(trans('global.scheduleImportSuccess', '同步成功'));
                }
                // this.getImportStudentResult();
                this.setState(
                    {
                        sureSyncModalVisible: false,
                        sureSyncSecInfo: true,
                    },
                    () => {
                        console.log('sureSyncSecInfo', this.state.sureSyncSecInfo);
                    }
                );
            }
        });
    };

    handleCancelSync = () => {
        this.setState({
            sureSyncModalVisible: false,
        });
    };

    changeCourseName = (index, e) => {
        let { arr } = this.state;
        console.log('first', index, e.target.value);
        arr[index].weekAndLesson = e.target.value;
        this.setState({
            arr,
        });
    };

    changeSubjectName = (index, e) => {
        let { courseName } = this.state;
        courseName[index].targetCourseNames = e.target.value;
        this.setState({
            courseName,
        });
    };

    //时间格式化
    getLocalTime(time, type) {
        console.log('time', time);
        if (!time) return false;
        /* var time = new Date(time),
            y = time.getFullYear(),
            m = time.getMonth() + 1,
            day = time.getDate(); */
        var time = moment(time),
            y = time.year(),
            m = time.month() + 1,
            day = time.date();
        return y + '/' + m + '/' + day;
    }

    //获得当前的00:00:00和23:59:59时间
    getAlldayTime(start, end) {
        console.log('first', start, end);
        let currentDayStart = this.getLocalTime(new Date(start), 2);
        let currentDayEnd = this.getLocalTime(new Date(end), 2);
        /*  let startTime = new Date(currentDayStart + ' ' + '00:00:00').getTime();
        let endTime = new Date(currentDayEnd + ' ' + '23:59:59').getTime(); */
        let startTime = moment(currentDayStart).valueOf();
        let endTime = moment(currentDayEnd).valueOf() + 86399000;
        this.setState(
            {
                startTime: startTime,
                endTime: endTime,
            },
            () => {
                this.getCompareList();
            }
        );
    }

    //根据日历定位到当前周
    getCurrentWeek(nowTime) {
        let now = new Date(nowTime),
            nowStr = now.getTime(),
            day = now.getDay() != 0 ? now.getDay() : 7,
            oneDayLong = 24 * 60 * 60 * 1000;
        let MondayTime = nowStr - (day - 1) * oneDayLong,
            SundayTime = nowStr + (7 - day) * oneDayLong;
        let monday = new Date(MondayTime).getTime(),
            sunday = new Date(SundayTime).getTime();
        this.getAlldayTime(monday, sunday);
    }

    onDateChange = (date, dateString) => {
        const { selectType } = this.state;
        console.log('dateString', dateString);
        // if (selectType == 'versionTarget') {
        //     this.setState({
        //         changeAfterStartTime: dateString,
        //     });
        // }
        // if (selectType == 'versionSource') {
        //     this.setState({
        //         changeBeforeStartTime: dateString,
        //     });
        // }
        let str = dateString.replace(/-/g, '/');
        let dateChange = new Date(str).getTime();
        this.getCurrentWeek(dateChange);
    };

    render() {
        const {
            sureSyncModalVisible,
            versionSelect,
            arr,
            courseName,
            courseNameClassList,
            changeAfterStartTime,
            changeBeforeStartTime,
            startTime,
            endTime,
            isUploading,
            isSyncUploading,
        } = this.state;
        const { weekVersionList, dividePlanDetail } = this.props;
        console.log('arr', arr);
        console.log('courseName', courseName);
        console.log('courseNameClassList', courseNameClassList);
        console.log('dividePlanDetail', dividePlanDetail);
        return (
            <div className={styles.content}>
                <span className={styles.syncText}>同步教学班分班结果</span>
                <Spin spinning={isSyncUploading} tip="loading...">
                    <p className={styles.syncInfo}>
                        <div className={styles.syncInfoDiv}>
                            <span className={styles.syncSpan}>同步说明</span>
                            <div className={styles.syncInfoText}>
                                <span>
                                    需要先在基础数据中完成教学班和学生基本信息导入，同步时系统会根据分班结果将学生同步至相应的教学班
                                </span>
                                <span>数据匹配规则:教学班根据班级名称匹配，学生根据学号匹配</span>
                                <span>仅支持同步教学班学生，行政班学生暂不支持</span>
                            </div>
                            <Button
                                className={styles.syncInfoButton}
                                type="primary"
                                onClick={this.sureSync}
                            >
                                确定同步
                            </Button>
                        </div>
                    </p>
                </Spin>
                <span className={styles.syncText}>同步课表</span>
                <Spin spinning={isUploading} tip="loading...">
                    <p className={styles.syncSchedule}>
                        <div className={styles.syncSecInfo}>
                            <span className={styles.syncSpan}>同步说明</span>
                            <div className={styles.syncSecInfoText}>
                                <span>同步前先完成以下准备工作：</span>
                                <span style={{ marginLeft: '8px' }}>
                                    (1)在分班管理中完成每个教学班的课位和教师设置
                                </span>
                                <span style={{ marginLeft: '8px' }}>
                                    (2)在基础数据中完成教学班、课程、教师等基本信息导入
                                </span>
                                <span style={{ marginLeft: '8px' }}>(3)准备好将要同步的课表</span>
                                <span>
                                    同步完成后请到相应的课表进一步检查课表是否冲突,并完善课表
                                </span>
                            </div>
                            <span className={styles.syncSecInfoButton}>
                                <Button
                                    style={{ background: '#EAEBEF', marginRight: '15px' }}
                                    onClick={this.saveSet}
                                >
                                    保存设置
                                </Button>
                                <Button type="primary" onClick={this.sureSyncSecInfo}>
                                    确定同步
                                </Button>
                            </span>
                        </div>
                        <div className={styles.selectCourse}>
                            <span className={styles.syncSpan}>选择课表</span>
                            <div className={styles.syncChoiceSchedule}>
                                {/* <RangePicker
                                placeholder="选择课表时间"
                                className={styles.dataPicker}
                                onChange={this.onChange}
                            /> */}

                                <div className={styles.timePicker}>
                                    {this.getLocalTime(startTime) ? (
                                        <span className={styles.timeText}>
                                            {this.getLocalTime(startTime)} -{' '}
                                            {this.getLocalTime(endTime)}
                                        </span>
                                    ) : (
                                        <span className={styles.timeText}>请选择课表时间</span>
                                    )}
                                    <DatePicker
                                        onChange={this.onDateChange}
                                        placeholder={
                                            this.getLocalTime(startTime)
                                                ? moment(this.getLocalTime(startTime), dateFormat)
                                                : '请选择课表时间'
                                        }
                                        style={{ width: '240px' }}
                                        className={styles.dateStyle}
                                        allowClear={true}
                                        defaultValue={moment(
                                            this.getLocalTime(startTime),
                                            dateFormat
                                        )}
                                    />
                                </div>

                                <Select
                                    placeholder={
                                        dividePlanDetail.saveDividePlanSetup
                                            ? dividePlanDetail.saveDividePlanSetup.weekVersionName
                                            : '请先选择日期，再选择版本'
                                    }
                                    style={{ width: 272, marginLeft: '8px' }}
                                    onChange={this.handleChange}
                                    // defaultValue={
                                    //     dividePlanDetail.saveDividePlanSetup &&
                                    //     dividePlanDetail.saveDividePlanSetup.weekVersionId
                                    // }
                                    // value={versionSelect}
                                >
                                    {weekVersionList &&
                                        weekVersionList.length > 0 &&
                                        weekVersionList.map((item, index) => {
                                            return (
                                                <Option value={item.id} key={item.id}>
                                                    {item.name}
                                                </Option>
                                            );
                                        })}
                                </Select>
                            </div>
                        </div>
                        <div className={styles.setCourseSite}>
                            <span className={styles.syncSpan}>课位设置</span>
                            <div className={styles.setCourseSiteRight}>
                                <p>填写示例：周一第1节、周二第3节。</p>
                                {arr.map((item, index) => {
                                    return (
                                        <p>
                                            <span
                                                style={{ marginRight: '15px' }}
                                            >{`课位${item.flowGroupNumber}`}</span>
                                            <Input
                                                // value={item.weekAndLesson}
                                                defaultValue={item.weekAndLesson}
                                                placeholder={
                                                    item.weekAndLesson
                                                        ? item.weekAndLesson
                                                        : '填写示例：周一第1节、周二第3节'
                                                }
                                                style={{ width: '470px' }}
                                                onChange={(e) => this.changeCourseName(index, e)}
                                            />
                                        </p>
                                    );
                                })}
                            </div>
                        </div>
                        <div className={styles.setCOurse}>
                            <span className={styles.syncSpan}>课程设置</span>
                            <div className={styles.setCOurseRight}>
                                <p>
                                    填写每个课程在课程基础库中对应的课程名称。若填写了多个课程，系统将平分到对应课位的课节，总课节为单数时按单双周处理。（输入多个班级时请使用英文逗号隔开）
                                </p>
                                {courseName.map((item, index) => {
                                    return (
                                        <p>
                                            <span style={{ marginRight: '24px' }}>
                                                {item.chooseCourseName}
                                            </span>
                                            <Input
                                                defaultValue={item.targetCourseNames}
                                                placeholder={
                                                    item.targetCourseNames
                                                        ? item.targetCourseNames
                                                        : '输入多个班级时请使用英文逗号隔开'
                                                }
                                                style={{ width: '470px' }}
                                                onChange={(e) => this.changeSubjectName(index, e)}
                                            />
                                        </p>
                                    );
                                })}
                            </div>
                        </div>
                    </p>
                </Spin>
                <Modal
                    title="同步失败"
                    visible={sureSyncModalVisible}
                    onCancel={this.handleCancelSync}
                    onOk={this.sureSyncModal}
                ></Modal>
            </div>
        );
    }
}
