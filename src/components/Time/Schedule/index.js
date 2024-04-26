//作息表
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Select, Modal, Button, Tooltip, Icon, message, Popover } from 'antd';
import CalendarTable from './calendar.js';
import CreateSchedule from './createSchedule.js';
import CreateCourse from './createCourse.js';
const { Option } = Select;
import PowerPage from '../../PowerPage/index';
import InvalidSchedule from './invalidSchedule';
import { trans, locale } from '../../../utils/i18n';
import { formatTimeSafari } from '../../../utils/utils';

@connect((state) => ({
    semesterList: state.time.semesterList,
    gradeList: state.time.gradeList,
    dateList: state.time.dateList,
    dataSourceList: state.time.dataSourceList,
    deleteSuccess: state.time.deleteSuccess,
    calendrDetail: state.time.calendrDetail,
    fetchWorkingHours: state.time.fetchWorkingHours,
    powerStatus: state.global.powerStatus, //是否有权限
}))
export default class TimeSchedule extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            semesterValue: '',
            gradeValue: null,
            dateValue: '',

            currentDate: new Date(),
            deleteModalVisible: false,

            modalVisible: false,
            modalTitle: '',
            modalType: '',
            courseVisible: false,

            startDatetime: '', //开始时间毫秒数
            endDatetime: '', // 结束时间毫秒数

            childrenid: '', // 接收日期

            creatcoursething: '',

            createModalType: '', //区分新建编辑活动类型

            nameid: '',
            collection: '',

            dataSource: [],

            termStartTime: '',
            termEndTime: '',
            isCheckShow: '',

            teachingOrgList: [], //作息表适用年级
            invalidVisible: false,
            scheduleInfoItem: '',
            calendrDetail: {},
            haveVersionUse: false,
            effectiveTime: undefined,
            failureTime: undefined,
            isRequest: false,
            scheduleName: '',
            startTimestamp: undefined,
            endTimestamp: undefined,
        };
    }

    componentWillMount() {
        this.ifHavePower();
    }

    componentDidMount() {
        this.getSemester();
        this.setState({
            isRequest: true,
        });
    }

    //判断是否有权限
    ifHavePower() {
        const { dispatch } = this.props;
        dispatch({
            type: 'global/havePower',
            payload: {},
        });
    }

    //获取学期
    getSemester() {
        const { dispatch } = this.props;
        dispatch({
            type: 'time/getSemesterList',
            payload: {},
        }).then(() => {
            const { semesterList } = this.props;
            this.setState(
                {
                    // semesterValue: semesterList && semesterList[0] && semesterList[0].id,
                    semesterValue: this.getNewSemesterId(semesterList) || semesterList[0].id,
                    termStartTime: semesterList && semesterList[0] && semesterList[0].startTime,
                    termEndTime: semesterList && semesterList[0] && semesterList[0].endTime,
                },
                () => {
                    this.getGrade();
                }
            );
        });
    }

    //获取年级
    getGrade() {
        const { dispatch } = this.props;
        dispatch({
            type: 'time/getGradeList',
            payload: {},
        }).then(() => {
            const { gradeList } = this.props;
            this.setState(
                {
                    // gradeValue: gradeList.find((item) => item.grade === 1)
                    //     ? gradeList.find((item) => item.grade === 1).id
                    //     : gradeList[0].id,
                    gradeValue: null,
                },
                () => {
                    this.getSelectDate();
                }
            );
        });
    }

    getLastSchedule = () => {
        const { dateList } = this.props;
        const found = dateList.findIndex((el) => el.scheduleType != 2);
        this.setState({
            isRequest: true,
        });
    };

    //获取时间选择
    getSelectDate() {
        const { dispatch } = this.props;
        const { gradeValue, semesterValue, isRequest } = this.state;
        dispatch({
            type: 'time/getDateList',
            payload: {
                gradeId: gradeValue,
                semesterId: semesterValue,
            },
            onSuccess: () => {
                const { dateList } = this.props;
                if (isRequest) {
                    this.getNewSchedule(dateList);
                }
                this.setState({
                    isRequest: false,
                });

                this.getCalendarSource();
            },
        });
    }

    //默认展示最新非作废作息
    getNewSchedule = (dateList) => {
        // let tempLen = dateList && dateList.length;
        const found = dateList.findIndex((el) => el.scheduleType != 2);
        this.setState({
            effectiveTime: (dateList[found] && dateList[found].effectiveTime) || undefined,
            failureTime: (dateList[found] && dateList[found].failureTime) || undefined,
            dateValue: dateList[found] && dateList[found].id,
            scheduleInfoItem: (dateList && dateList[found]) || {},
            haveVersionUse: (dateList && dateList[found]?.haveVersionUse) || false,
            teachingOrgList: (dateList && dateList[found] && dateList[found].teachingOrgList) || [], //作息表适用年级
            scheduleName: (dateList && dateList[found]?.name) || '',
            childrenid: [
                this.formatTime(dateList && dateList[found] && dateList[found].effectiveTime),
                ' - ',
                this.formatTime(dateList && dateList[found] && dateList[found].failureTime),
            ],
        });
    };

    //默认展示当前学期
    getNewSemesterId = (semesterList) => {
        let tempLen = semesterList && semesterList.length;
        for (let i = 0; i < tempLen; i++) {
            if (semesterList[i].current == true) {
                return semesterList[i].id;
            }
        }
    };

    //选择学期
    changeSemester = (value, e) => {
        this.setState(
            {
                semesterValue: value,
                isRequest: true,
            },
            () => {
                this.getSelectDate();
            }
        );
    };

    //选择校区
    changeArea = (value) => {
        console.log(`selected ${value}`);
    };

    //选择年级
    changeGrade = (value) => {
        this.setState(
            {
                gradeValue: value,
                isRequest: true,
            },
            () => {
                this.getSelectDate();
            }
        );
    };

    //选择日期
    changeDate = (value, item) => {
        this.setState(
            {
                dateValue: value,
                teachingOrgList: this.getTeachingOrgArr(value),
                childrenid: item.props.children,
                scheduleInfoItem: item.props.itemInfo,
                scheduleName: item.props.itemInfo.name,
                haveVersionUse: item.props.itemInfo.haveVersionUse || false,
                effectiveTime: item.props.itemInfo.effectiveTime,
                failureTime: item.props.itemInfo.failureTime,
            },
            () => {
                this.getCalendarSource();
            }
        );
    };

    //获取所选作息id的适用年级
    getTeachingOrgArr = (value) => {
        const { dateList } = this.props;
        let teachingOrg = [];
        if (!dateList || dateList.length <= 0) return;

        dateList.map((item) => {
            if (item.id == value) {
                teachingOrg = item.teachingOrgList;
            }
        });
        return teachingOrg;
    };

    //获取作息表数据
    getCalendarSource = () => {
        const { dispatch } = this.props;
        const { dateValue } = this.state;
        if (!dateValue) {
            message.info('当前年级暂无作息表！');
            this.setState({
                dataSource: [],
            });
            return false;
        }
        dispatch({
            type: 'time/getCalendarSource',
            payload: {
                baseScheduleId: dateValue,
            },
        });
    };

    // 点击开启编辑作息活动
    calendarClick = (detail) => {
        this.setState({
            isCheckShow: detail.ifBreak,
            nameid: detail.id,
            collection: detail.type,
        });
        const { dispatch } = this.props;
        dispatch({
            type: 'time/fetchCalendarDetail',
            payload: {
                id: detail.id,
            },
        }).then(() => {
            this.setState({
                courseVisible: true,
                creatcoursething: detail,
                createModalType: 'edit',
            });
        });
    };

    // 关闭作息时间表
    offhandleClick = () => {
        this.setState({
            courseVisible: false,
            collection: null,
        });
    };

    //删除作息活动
    deleteCalendar = (el) => {
        let self = this;
        Modal.confirm({
            title:
                locale() != 'en'
                    ? '您确定要删除该作息活动吗？'
                    : 'Are you sure to delete this period?',
            content: '',
            okText: trans('global.confirm', '确认删除'),
            cancelText: trans('global.cancel', '取消'),
            onOk() {
                self.confirmDelete(el);
            },
            onCancel() {
                console.log('cancel');
            },
        });
    };
    //确认删除
    confirmDelete = (el) => {
        const { dispatch, dateList } = this.props;
        dispatch({
            type: 'time/deleteCalendar',
            payload: {
                baseScheduleDetailId: el.id,
            },
        }).then(() => {
            const { deleteSuccess } = this.props;
            if (deleteSuccess.status) {
                this.getCalendarSource();
            }
        });
    };

    //新建、编辑、复制作息表
    showScheModal(title, type) {
        this.setState(
            {
                modalVisible: true,
                modalTitle: title,
                modalType: type,
            },
            () => {
                const { dispatch } = this.props;
                if (type == 'edit' || type == 'copy') {
                    dispatch({
                        type: 'time/fetchWorkingHours',
                        payload: { id: this.state.dateValue },
                    }).then(() => {
                        if (type == 'copy') {
                            const { fetchWorkingHours } = this.props;
                            console.log('fetchWorkingHours', fetchWorkingHours);
                            this.setState({
                                startTimestamp: fetchWorkingHours.effectiveTime,
                                failureTime: fetchWorkingHours.failureTime,
                            });
                        }
                    });
                }
            }
        );
    }

    changeStartAndEnd = (startTime, endTime) => {
        this.setState({
            startTimestamp: startTime,
            endTimestamp: endTime,
        });
    };

    // 作废作息表
    showInvalidSchedule = () => {
        this.setState({
            invalidVisible: true,
        });
    };

    handleCancelInvalid = () => {
        this.setState({
            invalidVisible: false,
        });
    };

    //删除作息表--二次确认
    deleteSchedule = () => {
        let self = this;
        Modal.confirm({
            title:
                locale() != 'en'
                    ? '您确定要删除该作息表吗？'
                    : 'Are you sure to delete this period?',
            content: '',
            okText: trans('global.confirm', '确认删除'),
            cancelText: trans('global.cancel', '取消'),
            cancelButtonProps: {
                style: {
                    height: '36px',
                    borderRadius: '8px',
                    color: '#01113da6',
                    backgroundColor: '#01113d12',
                    border: '0',
                },
            },
            okButtonProps: {
                style: {
                    height: '36px',
                    borderRadius: '8px',
                    color: '#fff',
                    backgroundColor: '#3b6ff5',
                },
            },
            onOk() {
                self.confirmDeleteSchedule();
            },
        });
    };

    //确认删除作息表
    confirmDeleteSchedule = () => {
        const { dispatch, dateList } = this.props;
        const found = dateList.findIndex((el) => el.scheduleType != 2);

        dispatch({
            type: 'time/deleteBaseListText',
            payload: {
                baseScheduleId: this.state.dateValue,
            },
        }).then(() => {
            this.setState(
                {
                    // dateValue: '',
                    dateValue: dateList[found].id,
                    isRequest: true,
                },
                () => {
                    this.getSelectDate();
                }
            );
        });
    };

    //关闭作息表
    hideScheModal = () => {
        this.setState({
            modalVisible: false,
        });
    };

    //处理时间
    formatTime = (time) => {
        let date = new Date(formatTimeSafari(time));
        let y, m, day;
        y = date.getFullYear();
        m = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        return y + '/' + m + '/' + day;
    };

    // 新建作息活动show
    createCourse = () => {
        if (this.state.dateValue) {
            this.setState({
                courseVisible: true,
                createModalType: 'create',
            });
        } else {
            message.info('请先新建作息表！');
        }
    };

    // 二级弹窗
    renderMenu() {
        return (
            <div className={styles.popoverBox}>
                <Button
                    title={trans('global.newPeriod', '新建作息活动表')}
                    type="primary"
                    onClick={this.createCourse}
                >
                    <Icon type="form" />
                    <p className={styles.text_title}>
                        {trans('global.newPeriod', '新建作息活动表')}
                    </p>
                </Button>
            </div>
        );
    }
    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.dataSourceList) != JSON.stringify(this.state.dataSource)) {
            this.setState({
                dataSource: nextProps.dataSourceList,
            });
        }
    }

    //格式化作息表适用年级
    formatTeachingOrg = () => {
        const { teachingOrgList, effectiveTime, failureTime } = this.state;
        let teachingOrg = [];
        if (!teachingOrgList || teachingOrgList.length <= 0) return;
        teachingOrgList.map((item) => {
            teachingOrg.push(locale() != 'en' ? item.orgName : item.orgEname);
        });
        return (
            <>
                {teachingOrg.join('，')}
                <p>
                    {locale() != 'en' ? '起止日期' : 'Date'}:
                    {this.formatTime(effectiveTime) + '-' + this.formatTime(failureTime)}
                </p>
            </>
        );
    };

    render() {
        const { semesterList, gradeList, dateList, dataSourceList, powerStatus } = this.props;
        const {
            semesterValue,
            gradeValue,
            dateValue,
            modalVisible,
            modalTitle,
            modalType,
            courseVisible,
            startDatetime,
            endDatetime,
            childrenid,
            creatcoursething,
            createModalType,
            nameid,
            collection,
            semesterId,
            dataSource,
            isCheckShow,
            invalidVisible,
            scheduleInfoItem,
            teachingOrgList,
            haveVersionUse,
            scheduleName,
            effectiveTime,
            failureTime,
            startTimestamp,
            endTimestamp,
        } = this.state;

        let newArray = [];
        if (dateList && dateList.length !== 0) {
            newArray[0] = this.formatTime(effectiveTime);
            newArray[1] = null;
            newArray[2] = this.formatTime(failureTime);
        }
        let tempScheduleName = '';
        if (dateList && dateList.length !== 0) {
            tempScheduleName = scheduleName;
        }
        const dateTxet = childrenid ? childrenid : newArray;
        //判断是否有权限显示作息表页面
        let havePowerViewPage =
            powerStatus.content &&
            powerStatus.content.indexOf('smart:scheduling:schedule:manage') != -1
                ? true
                : false;
        if (havePowerViewPage === false) {
            return (
                <div className={styles.schedulePage}>
                    <PowerPage />
                </div>
            );
        }
        return (
            <div className={styles.schedulePage}>
                <div className={styles.main}>
                    <div className={styles.headerBox}>
                        <div className={styles.searchHeader}>
                            <Select
                                value={semesterValue}
                                style={{ width: 210 }}
                                onChange={this.changeSemester}
                                className={styles.selectStyle}
                            >
                                {semesterList &&
                                    semesterList.length > 0 &&
                                    semesterList.map((item, index) => {
                                        return (
                                            <Option value={item.id} key={item.id}>
                                                {item.officialSemesterName}
                                            </Option>
                                        );
                                    })}
                            </Select>

                            <Select
                                value={gradeValue}
                                style={{ width: 140 }}
                                className={styles.selectStyle}
                                onChange={this.changeGrade}
                            >
                                <Option key={null} value={null}>
                                    {locale() != 'en' ? '全部年级' : 'All Grades'}
                                </Option>
                                {gradeList &&
                                    gradeList.length > 0 &&
                                    gradeList.map((item, index) => {
                                        return (
                                            <Option value={item.id} key={item.id}>
                                                {item.orgName + '-' + item.orgEname}
                                            </Option>
                                        );
                                    })}
                            </Select>
                            <Select
                                value={dateValue}
                                style={{ width:210 }}
                                className={styles.selectStyle}
                                onChange={this.changeDate}
                                optionLabelProp="title"
                                dropdownClassName="scheduleMenu"
                                // defaultValue={"1"}
                            >
                                {dateList &&
                                    dateList.length > 0 &&
                                    dateList.map((item, index) => {
                                        return (
                                            <Option
                                                value={item.id}
                                                key={item.id}
                                                itemInfo={item}
                                                title={
                                                    item.name
                                                        ? item.name
                                                        : // +'(' +
                                                        //   this.formatTime(item.effectiveTime) +
                                                        //   '-' +
                                                        //   this.formatTime(item.failureTime) +
                                                        //   ')'
                                                        this.formatTime(item.effectiveTime) +
                                                        '-' +
                                                        this.formatTime(item.failureTime)
                                                }
                                            >
                                                {item.name
                                                    ? item.name
                                                    : // +
                                                    //   '(' +
                                                    //   this.formatTime(item.effectiveTime) +
                                                    //   '-' +
                                                    //   this.formatTime(item.failureTime) +
                                                    //   ')'
                                                    this.formatTime(item.effectiveTime) +
                                                    '-' +
                                                    this.formatTime(item.failureTime)}
                                                {/* {this.formatTime(item.effectiveTime)} -{' '}
                                                {this.formatTime(item.failureTime)} */}
                                                <span className={styles.status}>
                                                    {item.scheduleType === 0
                                                        ? trans('global.Effective', '未生效')
                                                        : item.scheduleType === 1
                                                        ? trans('global.Not effective', '已生效')
                                                        : item.scheduleType === 2
                                                        ? trans('global.Invalid', '作废')
                                                        : ''}
                                                </span>
                                            </Option>
                                        );
                                    })}
                            </Select>
                            {dateList && dateList.length > 0 && (
                                <Popover
                                    placement="bottom"
                                    content={
                                        <span style={{fontSize:'12px'}}>
                                            {locale() != 'en' ? '该作息表适用' : 'Grades'}:
                                            {this.formatTeachingOrg()}
                                        </span>
                                    }
                                    title={null}
                                >
                                    <a className={styles.clickLookGrade}>
                                        {trans('global.applicableGrades', '查看作息表适用年级')}
                                    </a>
                                </Popover>
                            )}
                        </div>
                        <div className={styles.operButtonList}>
                            {dateList && dateList.length > 0 && (
                                <a className={styles.deleteSchedule} onClick={this.deleteSchedule}>
                                    {trans('global.deleteTimeTable', '删除')}
                                </a>
                            )}
                            {dateList &&
                                dateList.length > 0 &&
                                scheduleInfoItem &&
                                scheduleInfoItem.scheduleType != 2 && (
                                    <a
                                        className={styles.cancellationSchedule}
                                        onClick={this.showInvalidSchedule.bind(
                                            this,
                                            trans('global.timeTableValid', '作废作息表'),
                                            'invalid'
                                        )}
                                    >
                                        {trans('global.setAsInvalid', '作废')}
                                    </a>
                                )}
                            {dateList && dateList.length > 0 && (
                                <a
                                    className={styles.copySchedule}
                                    onClick={this.showScheModal.bind(
                                        this,
                                        trans('global.timeTableCopy', '复制作息表'),
                                        'copy'
                                    )}
                                >
                                    {trans('global.copyTimeTable', '复制')}
                                </a>
                            )}
                            {dateList &&
                                dateList.length > 0 &&
                                scheduleInfoItem &&
                                scheduleInfoItem.scheduleType != 2 && (
                                    <a
                                        className={styles.editSchedule}
                                        onClick={this.showScheModal.bind(
                                            this,
                                            trans('global.timeTableEdit', '编辑作息表'),
                                            'edit'
                                        )}
                                    >
                                        {trans('global.editTimeTable', '编辑')}
                                    </a>
                                )}
                            <a
                                onClick={this.showScheModal.bind(
                                    this,
                                    trans('global.timeTableNew', '新建作息表'),
                                    'create'
                                    // '新建作息表'
                                )}
                                className={styles.createSchedule}
                            >
                                {trans('global.newTimeTable', '新建作息表')}
                            </a>
                        </div>
                    </div>
                    <div className={styles.calendatContain}>
                        <CalendarTable
                            calendarClick={this.calendarClick}
                            offhandleClick={this.offhandleClick}
                            dataSource={dataSource}
                            info={null}
                            currentDate={this.state.currentDate}
                            deleteCalendar={this.deleteCalendar}
                            dateValue={dateValue}
                            dispatch={this.props.dispatch}
                            getCalendarSource={this.getCalendarSource}
                        />
                    </div>
                </div>
                <CreateSchedule
                    childrenid={childrenid}
                    gradeValue={gradeValue}
                    startTimestamp={startTimestamp}
                    endTimestamp={endTimestamp}
                    handleDate={this.handleDate}
                    semesterList={semesterList}
                    modalVisible={modalVisible}
                    modalTitle={modalTitle}
                    hideScheModal={this.hideScheModal}
                    getLastSchedule={this.getLastSchedule}
                    changeStartAndEnd={this.changeStartAndEnd}
                    changeScheduleId={this.changeScheduleId}
                    semesterValue={semesterValue}
                    gradeList={gradeList}
                    dateValue={dateValue}
                    datechildren={dateTxet}
                    modalType={modalType}
                    startDatetime={startDatetime}
                    endDatetime={endDatetime}
                    getCalendarSource={this.getCalendarSource.bind(this)}
                    getSemester={this.getSemester.bind(this)}
                    formatTime={this.formatTime}
                    getGrade={this.getGrade.bind(this)}
                    getSelectDate={this.getSelectDate.bind(this)}
                    teachingOrgList={teachingOrgList}
                    semesterId={semesterId}
                    {...this.props}
                />
                {courseVisible && (
                    <CreateCourse
                        creatcoursething={creatcoursething}
                        courseVisible={courseVisible}
                        calendarClick={this.calendarClick}
                        offhandleClick={this.offhandleClick}
                        confirmDelete={this.confirmDelete}
                        getCalendarSource={this.getCalendarSource.bind(this)}
                        createModalType={createModalType}
                        dateValue={dateValue}
                        dateList={dateList}
                        childrenid={childrenid}
                        nameid={nameid}
                        collection={collection}
                        isCheckShow={isCheckShow}
                        calendrDetail={this.props.calendrDetail}
                        haveVersionUse={haveVersionUse}
                    />
                )}

                {dateList && dateList.length > 0 && semesterValue && semesterValue > 0 && (
                    <div className={styles.bottom}>
                        <Button
                            className={styles.addBtn}
                            type="primary"
                            onClick={this.createCourse}
                        >
                            <Icon type="plus" />
                        </Button>
                    </div>
                )}
                {invalidVisible && (
                    <InvalidSchedule
                        invalidVisible={invalidVisible}
                        handleCancelInvalid={this.handleCancelInvalid}
                        applyGradeList={this.formatTeachingOrg()}
                        scheduleTime={
                            tempScheduleName
                                ? tempScheduleName
                                : childrenid && childrenid[0] + childrenid[1] + childrenid[2]
                        }
                        scheduleInfoItem={scheduleInfoItem}
                        getSelectDate={this.getSelectDate.bind(this)}
                        getLastSchedule={this.getLastSchedule.bind(this)}
                    />
                )}
            </div>
        );
    }
}
