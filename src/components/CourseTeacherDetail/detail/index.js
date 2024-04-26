import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
    Select,
    Button,
    Icon,
    Modal,
    Table,
    Popover,
    message,
    Divider,
    DatePicker,
    Radio,
    Spin,
} from 'antd';
import styles from './index.less';
import moment from 'moment';
import { getUrlSearch } from '../../../utils/utils';
import { Link } from 'dva/router';
import { trans, locale } from '../../../utils/i18n';
import AddCourse from '../../Course/CourseSelect/addCourse';
import NavTitle from '../component/navTitle';
import StudentTableHeader from '../component/studentTableHeader';
import lodash from 'lodash';

const { Option } = Select;
const { confirm } = Modal;
const dateFormat = 'YYYY/MM/DD';
@connect((state) => ({
    planningSchoolListInfo: state.course.planningSchoolListInfo,
    getCourseDetail: state.course.getCourseDetail,
    chooseCoursePlanBatchList: state.choose.chooseCoursePlanBatchList,
    chooseCourseDetails: state.choose.chooseCourseDetails,
    allStage: state.time.allStage,
    choosePlanList: state.course.choosePlanList,
    teacherList: state.course.teacherList,
    listSyncRecord: state.course.listSyncRecord,
    selectionsyncToSchedule: state.course.selectionsyncToSchedule,
    versionList: state.timeTable.versionList,
    currentUser: state.global.currentUser,
    getLotSubjects: state.course.getLotSubjects,
    syncToScheduleTemplate: state.courseTeacherDetail.syncToScheduleTemplate,
    getPayChargeItemList: state.course.getPayChargeItemList,
}))
class Detail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            toggleVisible: false,
            courseTime: undefined,
            courseVersion: undefined,
            loading: false,
            visible: false,
            visibleOpenCourse: false,
            planId: getUrlSearch('planId'),
            columns: this.headerColumns().concat(this.footerColumns()), // 表格头部表头
            isOpenCourse: false,
            checkErrorMessageList: [],
            errorVisible: false,
            popVisible: false,
            seleceEdition: false,
            // startTime: new Date(),
            startTime: '',
            endTime: '',
            effectiveVisible: false,
            effectiveValue: undefined,
            uploading: false,
            effectResVisible: false,
            cacheRefreshLoading: false,
            isGenetare: false,
            generateCalenVisible: false,

            multiLanguage: 'en',
            defaultRecord: '', //默认展示的关联课表
        };
    }

    componentDidMount() {
        this.props.onRef(this);
        this.initData();
        this.getTeacher();

        this.setState({
            multiLanguage: locale(),
        });
    }

    headerColumns = () => {
        return [
            {
                title: trans('course.basedetail.student.list', '学生列表'),
                dataIndex: 'studentList',
                key: 'studentList',
                width: 165,
                align: 'center',
                className: styles.tr,
                render: (tag, item) => <StudentTableHeader host={this.state.host} {...item} />,
            },
        ];
    };

    handleCacheRefresh = () => {
        const { dispatch, chooseCoursePlanId } = this.props;
        this.setState(
            {
                cacheRefreshLoading: true,
            },
            () => {
                dispatch({
                    type: 'courseTeacherDetail/getCacheRefresh',
                    payload: {
                        chooseCoursePlanId,
                    },
                }).then(() => {
                    this.setState({
                        cacheRefreshLoading: false,
                    });
                });
            }
        );
    };

    // 批次
    initData() {
        const { dispatch } = this.props;
        let { visibleSetupCourseList } = this.state;
        dispatch({
            type: 'choose/chooseCoursePlanBatchList',
            payload: {
                id: this.state.planId,
            },
            onSuccess: (data) => {
                visibleSetupCourseList = [];
                data.forEach((el) => {
                    visibleSetupCourseList.push(false);
                });
                data = data.map((el, index) => ({ ...el, key: el.id, index }));
                this.setState({
                    chooseCoursePlanBatchList: data,
                    visibleSetupCourseList,
                });
            },
        });
    }

    footerColumns = () => {
        let status = null;
        if (this.state) {
            let { batchIndex, chooseCoursePlanBatchList } = this.state;
            if (batchIndex === -1) {
                status = 2;
            } else {
                status = chooseCoursePlanBatchList[batchIndex].status;
            }
        }
        let { isAdmin } = this.props;
        return [
            {
                title: trans('student.opeation', '操作'),
                dataIndex: 'operation',
                key: 'operation',
                width: 135,
                align: 'center',
                render: (tag, item) => {
                    const { effecticveDisabled } = this.props;
                    return (
                        <div className={styles.operation}>
                            <Fragment>
                                <div className={styles.item}>
                                    {
                                        <a
                                            onClick={this.onShowModel.bind(
                                                this,
                                                'visibleTimetable',
                                                () => {
                                                    this.setState({
                                                        studentInfor: item,
                                                    });
                                                }
                                            )}
                                        >
                                            {trans('tc.base.schedule.detail', '课表详情')}
                                        </a>
                                    }
                                    {isAdmin && (
                                        <span>
                                            <Divider type="vertical" />
                                            {
                                                <a
                                                    onClick={this.onShowModel.bind(
                                                        this,
                                                        'visibleAddCourse'
                                                    )}
                                                >
                                                    加课
                                                </a>
                                            }
                                        </span>
                                    )}
                                </div>
                                {isAdmin && (
                                    <div className={styles.item}>
                                        {
                                            /* effecticveDisabled ?
                                        <a className={styles.remove}>{trans("tc.base.adjustment.time", "调整时间")}</a>
                                        :
                                        <a onClick={() => {
                                            this.onShowModel("visibleAdjustTime");
                                            this.setState({
                                                studentIndex: item.index
                                            })
                                        }}>
                                            {trans("tc.base.adjustment.time", "调整时间")}
                                        </a> */
                                            <a
                                                onClick={() => {
                                                    this.onShowModel('visibleAdjustTime');
                                                    this.setState({
                                                        studentIndex: item.index,
                                                    });
                                                }}
                                            >
                                                {trans('tc.base.adjustment.time', '调整时间')}
                                            </a>
                                        }
                                        <Divider type="vertical" />
                                        {
                                            <a onClick={this.removeStudent.bind(this, 1, item)}>
                                                {trans('course.basedetail.remove', '移除')}
                                            </a>
                                        }
                                    </div>
                                )}
                            </Fragment>
                        </div>
                    );
                },
            },
        ];
    };

    toggleSchedule = () => {
        const { dispatch } = this.props;
        let { startTime, endTime } = this.props.chooseCourseDetails;
        startTime = new Date(startTime).getTime();
        endTime = new Date(endTime).getTime();
        dispatch({
            type: 'course/listSyncRecord',
            payload: { chooseCoursePlanId: this.props.chooseCoursePlanId },
        }).then(() => {
            this.setState({
                loading: false,
            });
            let { listSyncRecord } = this.props;
            listSyncRecord.map((item, index) => {
                if (item.current == true) {
                    this.setState({
                        defaultRecord: item.versionName,
                    });
                }
            });
        });
        this.setState({
            toggleVisible: true,
            // startTime: new Date(),
            startTime: '',
            endTime: '',
            loading: true,
        });
    };

    changeTime = (value) => {
        this.setState({
            courseTime: value,
        });
    };
    changeVersion = (value) => {
        this.setState({
            defaultRecord: '',
            courseVersion: value,
        });
    };

    toggleOk = () => {
        this.setState({
            toggleVisible: false,
        });
    };

    toggleCannel = () => {
        this.setState({
            toggleVisible: false,
            courseVersion: undefined,
        });
    };

    getSchedules = () => {
        const { courseVersion } = this.state;
        if (!courseVersion) {
            message.warn('请选择一个课表版本以操作!');
            return;
        }
        this.setState({
            popVisible: true,
        });
    };

    popoverHTML() {
        return (
            <div className={styles.popover}>
                <div
                    onClick={this.deleteCourse.bind(this, this.state.planId)}
                    className={styles.item}
                >
                    {trans('tc.base.delete.course.plan', '删除选课计划')}
                </div>
            </div>
        );
    }

    //删除选课计划
    deleteCourse = (id) => {
        const { dispatch } = this.props;
        let self = this;
        Modal.confirm({
            title: trans('course.index.delete.course', '是否删除该选课计划'),
            content: null,
            onOk() {
                dispatch({
                    type: 'course/chooseCourseDelete',
                    payload: { id },
                    onSuccess: (data) => {
                        window.location.href = '#/course/index/2';
                    },
                });
            },
            onCancel() {},
        });
    };

    hideModal = (type) => {
        switch (type) {
            case 'visible':
                this.setState({
                    visible: false,
                });
                break;
            default:
                break;
        }
    };

    choosePlanList = (callback) => {
        const { dispatch } = this.props;
        let { pageNum, pageSize } = this.state;
        dispatch({
            type: 'course/choosePlanList',
            payload: {
                pageNum,
                pageSize,
            },
            onSuccess: () => {
                callback && callback();
            },
        });
    };

    editSelectCourse = () => {
        // this.choosePlanList();
        const { dispatch } = this.props;
        dispatch({
            type: 'course/getCouserPlanningSchoolList',
        });
        this.setState({
            visible: true,
        });
    };

    effectiveResult = () => {
        const { chooseCourseDetails } = this.props;
        let syncSchedule = chooseCourseDetails.syncSchedule;
        let effectiveType = chooseCourseDetails.effectiveType;
        if (effectiveType == 1) {
            this.setState({
                effectResVisible: true,
            });
        } else if (effectiveType == 0) {
            this.setState({
                effectiveVisible: true,
            });
        }
    };

    effectSelResult = () => {};

    // 选课计划生效二次确认
    effectiveConfirm = () => {
        let _this = this;
        confirm({
            title: (
                <span className={styles.effective}>
                    <span className={styles.title}>
                        {' '}
                        {trans('tc.base.effective', '您确定将本次选课结果全部生效吗？')}{' '}
                    </span>
                    <span className={styles.text}>
                        {' '}
                        {trans(
                            'tc.base.effective.text',
                            '若确认生效，所有数据将无法再被编辑。学生可以查看自己的日程及课程。'
                        )}{' '}
                    </span>
                </span>
            ),
            icon: '',
            className: styles.effectiveConfirm,
            onOk() {
                _this.handleEffective();
            },
            onCancel() {},
        });
    };

    handleEffective = () => {
        const { dispatch } = this.props;
        const { effectiveValue } = this.state;
        if (effectiveValue == undefined) {
            message.warn('请选择日程考勤类型！');
            return;
        }
        this.setState({
            uploading: true,
        });
        if (effectiveValue == 1) {
            dispatch({
                type: 'courseTeacherDetail/getEffective',
                payload: {
                    id: this.state.planId,
                },
            }).then(() => {
                dispatch({
                    type: 'choose/chooseCourseDetails',
                    payload: {
                        id: this.state.planId,
                    },
                }).then(() => {
                    this.setState({
                        effectiveVisible: false,
                        uploading: false,
                        effectResVisible: true,
                    });
                });
            });
        } else if (effectiveValue == 0) {
            /* dispatch({
                type: 'courseTeacherDetail/syncToScheduleTemplate',
                payload: {
                    chooseCoursePlanId: this.props.chooseCoursePlanId,
                },
            }).then(() => {
                const { syncToScheduleTemplate } = this.props;
                if (syncToScheduleTemplate?.status) {
                    message.success('同步成功！');
                }
            }); */
            dispatch({
                type: 'courseTeacherDetail/getEffective',
                payload: {
                    id: this.state.planId,
                },
            }).then(() => {
                dispatch({
                    type: 'courseTeacherDetail/syncToScheduleTemplate',
                    payload: {
                        chooseCoursePlanId: this.props.chooseCoursePlanId,
                    },
                })
                    .then(() => {
                        const { syncToScheduleTemplate } = this.props;
                        if (syncToScheduleTemplate?.status) {
                            message.success('同步成功！');
                        }
                    })
                    .then(() => {
                        dispatch({
                            type: 'choose/chooseCourseDetails',
                            payload: {
                                id: this.state.planId,
                            },
                        }).then(() => {
                            this.setState({
                                effectiveVisible: false,
                                uploading: false,
                                effectResVisible: true,
                            });
                        });
                    });
            });
        }
    };

    generateSchedule = () => {
        this.setState({
            generateCalenVisible: true,
        });
    };

    beSureGenerate = () => {
        const { dispatch } = this.props;
        this.setState({
            isGenetare: true,
            generateCalenVisible: false,
        });
        dispatch({
            type: 'courseTeacherDetail/syncToScheduleTemplate',
            payload: {
                chooseCoursePlanId: this.props.chooseCoursePlanId,
            },
        }).then(() => {
            dispatch({
                type: 'choose/chooseCourseDetails',
                payload: {
                    id: this.state.planId,
                },
            });
            this.setState({
                isGenetare: false,
            });
        });
    };

    toCalender = () => {
        let currentUrl = window.location.href;
        currentUrl = currentUrl.replace(/(\?|&)ticket\=([0-9A-z]+?&|[0-9A-z]+)/gi, '');
        let host =
            currentUrl.indexOf('yungu.org') > -1
                ? 'https://calendar.yungu.org/'
                : 'https://calendar.daily.yungu-inc.org/';
        window.open(host + '#/searchAgenda');
    };

    // 展示弹窗公共函数
    onShowModel = (type, callback) => {
        if (type === 'visibleAddStudent') {
            let { gradeList, classList } = this.props;
            if (!(gradeList && gradeList.length > 0 && classList && classList.length > 0)) {
                message.warn(
                    trans('tc.base.no.find.student.check', '未找到该学段下的学生，请检查学生信息')
                );
                return;
            }
        }
        this.setState({
            [type]: true,
        });
        typeof callback === 'function' && callback();
    };

    openToStu = () => {
        this.setState({
            visibleOpenCourse: true,
        });
    };

    // 开放选课权限
    handleOkOpenCourse = (item) => {
        /* if (new Date().getTime() >= new Date(item.endTime).getTime()) {
            message.warn(trans('tc.base.time.passed.no.open', '时间已过，不允许开放选课'));
            return;
        } */

        let { dispatch, currentUser } = this.props;
        let { chooseCoursePlanBatchList } = this.state;
        let self = this;
        Modal.confirm({
            title: trans('tc.base.sure.open.course', '您确定要开放选课嘛？'),
            icon: null,
            className: styles.removeContainer,
            content: (
                <span>
                    {trans(
                        'tc.base.rule.no.student.3',
                        '开放后，当前选课计划对学生可见，选课时间到达后，系统将自动开启选课'
                    )}
                </span>
            ),
            onOk: () => {
                self.setState(
                    {
                        isOpenCourse: true,
                        coursePlanId: item.id,
                    },
                    () => {
                        dispatch({
                            type: 'courseTeacherDetail/openChooseCourse',
                            payload: {
                                batchId: item.id,
                                schoolId: currentUser.schoolId
                            },
                            onSuccess: (bol) => {
                                if (bol) {
                                    chooseCoursePlanBatchList[item.index].status = 3;
                                    self.setState({
                                        chooseCoursePlanBatchList,
                                        visibleOpenCourse: false,
                                        isOpenCourse: false,
                                        coursePlanId: '',
                                    });
                                }
                            },
                        }).then(() => {
                            self.setState({
                                isOpenCourse: false,
                            });
                        });
                    }
                );
            },
            okText: trans('tc.base.confirm.open', '确认开放'),
            cancelText: trans('global.cancel', '取消'),
        });
    };

    noToChinese = (num) => {
        if (!/^\d*(\.\d*)?$/.test(num)) {
            alert('Number is wrong!');
            return 'Number is wrong!';
        }
        // eslint-disable-next-line no-array-constructor
        var AA = new Array('零', '一', '二', '三', '四', '五', '六', '七', '八', '九');
        // eslint-disable-next-line no-array-constructor
        var BB = new Array('', '十', '百', '千', '万', '亿', '点', '');
        var a = ('' + num).replace(/(^0*)/g, '').split('.'),
            k = 0,
            re = '';
        for (var i = a[0].length - 1; i >= 0; i--) {
            // eslint-disable-next-line default-case
            switch (k) {
                case 0:
                    re = BB[7] + re;
                    break;
                case 4:
                    if (!new RegExp('0{4}\\d{' + (a[0].length - i - 1) + '}$').test(a[0]))
                        re = BB[4] + re;
                    break;
                case 8:
                    re = BB[5] + re;
                    BB[7] = BB[5];
                    k = 0;
                    break;
            }
            if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0) re = AA[0] + re;
            if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re;
            k++;
        }
        if (a.length > 1) {
            //加上小数部分(如果有小数部分)
            re += BB[6];
            for (var i = 0; i < a[1].length; i++) re += AA[a[1].charAt(i)];
        }
        return re;
    };

    // 开放选课
    openCourseHTML() {
        let { visibleOpenCourse, chooseCoursePlanBatchList, isOpenCourse, coursePlanId } =
            this.state;
        let columns = [
            {
                title: trans('tc.base.select.time', '选课时间'),
                dataIndex: 'time',
                key: 'time',
                align: 'center',
                render: (tag, item) => (
                    <div>
                        <div className={styles.item}>
                            {trans('global.start', '起')}:{item.startTime}
                        </div>
                        <div className={styles.item}>
                            {trans('global.end', '止')}:{item.endTime}
                        </div>
                    </div>
                ),
            },
            {
                title: trans('course.setup.course.status', '状态'),
                dataIndex: 'status',
                key: 'status',
                align: 'center',
                render: (tag) => (
                    <div className={styles.item}>
                        {tag === 1
                            ? trans('select.student.notOpen', '未开放')
                            : tag === 2
                            ? trans('global.Published', '已发布')
                            : trans('global.In force', '已生效')}
                    </div>
                ),
            },
            {
                title: trans('tc.base.join.student.number', '参与学生'),
                dataIndex: 'num',
                key: 'num',
                align: 'center',
            },
            {
                title: trans('student.opeation', '操作'),
                dataIndex: 'operation',
                key: 'operation',
                align: 'center',
                render: (tag, item) => (
                    <div>
                        {item.status === 1 ? (
                            <div
                                onClick={this.handleOkOpenCourse.bind(this, item)}
                                className={
                                    isOpenCourse && coursePlanId == item.id
                                        ? styles.item
                                        : styles.active
                                }
                            >
                                {isOpenCourse && coursePlanId == item.id
                                    ? trans('global.open selection', '开放选课处理中')
                                    : trans('tc.base.open.course.selection', '开放选课')}
                            </div>
                        ) : (
                            <div className={styles.item}>
                                {trans('tc.base.open.course.selection', '开放选课')}
                            </div>
                        )}
                    </div>
                ),
            },
        ];
        return (
            <Modal
                title={
                    <NavTitle
                        title={trans('tc.base.open.course.selection', '开放选课')}
                        onCancel={() => this.setState({ visibleOpenCourse: false })}
                    />
                }
                maskClosable={false}
                closable={false}
                footer={null}
                visible={visibleOpenCourse}
                width="50%"
            >
                <div className={styles.openCourse}>
                    <Table
                        columns={columns}
                        dataSource={chooseCoursePlanBatchList}
                        pagination={false}
                    />
                    <div className={styles.btn}>
                        <Button
                            onClick={() => this.setState({ visibleOpenCourse: false })}
                            type="primary"
                        >
                            {trans('global.finish', '完成')}
                        </Button>
                    </div>
                </div>
            </Modal>
        );
    }

    //获取教师列表
    getTeacher() {
        const { dispatch } = this.props;
        dispatch({
            type: 'course/getTeacherList',
            payload: {},
        });
    }

    linkSchedule = () => {
        const { courseVersion } = this.state;
        if (!courseVersion) {
            message.warn('请选择一个课表版本以操作!');
            return;
        }
        const { dispatch } = this.props;
        dispatch({
            type: 'course/setCurrent',
            payload: {
                chooseCoursePlanId: this.props.chooseCoursePlanId,
                versionId: courseVersion,
            },
        }).then(() => {
            this.setState({
                loading: true,
            });
            dispatch({
                type: 'course/listSyncRecord',
                payload: { chooseCoursePlanId: this.props.chooseCoursePlanId },
            }).then(() => {
                this.setState({
                    loading: false,
                });
            });
        });
    };

    setLinkSchedule = (record) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'course/setCurrent',
            payload: {
                chooseCoursePlanId: this.props.chooseCoursePlanId,
                versionId: record.versionId,
            },
        }).then(() => {
            this.setState({
                loading: true,
            });
            dispatch({
                type: 'course/listSyncRecord',
                payload: { chooseCoursePlanId: this.props.chooseCoursePlanId },
            }).then(() => {
                this.setState({
                    loading: false,
                });
            });
        });
    };

    sureToAsync = () => {
        const { courseVersion } = this.state;
        if (!courseVersion) {
            message.warn('请选择一个课表版本以操作!');
            return;
        }
        const { dispatch } = this.props;
        dispatch({
            type: 'course/selectionsyncToSchedule',
            payload: {
                chooseCoursePlanId: this.props.chooseCoursePlanId,
                versionId: courseVersion,
            },
        }).then(() => {
            let selectionsyncToSchedule = this.props.selectionsyncToSchedule;
            if (selectionsyncToSchedule && selectionsyncToSchedule.length > 0) {
                this.setState({
                    checkErrorMessageList: selectionsyncToSchedule,
                    errorVisible: true,
                    popVisible: false,
                });
            } else {
                this.setState({
                    loading: true,
                });
                dispatch({
                    type: 'course/listSyncRecord',
                    payload: { chooseCoursePlanId: this.props.chooseCoursePlanId },
                }).then(() => {
                    this.setState({
                        popVisible: false,
                        loading: false,
                    });
                });
            }
        });
    };

    //时间格式化
    getLocalTime(time, type) {
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

    onDateChange = (date, dateString) => {
        /* const { selectType } = this.state;
        if (selectType == 'versionTarget') {
            this.setState({
                changeAfterStartTime: dateString,
            });
        }
        if (selectType == 'versionSource') {
            this.setState({
                changeBeforeStartTime: dateString,
            });
        } */
        let str = dateString.replace(/-/g, '/');
        let dateChange = new Date(str).getTime();
        this.getCurrentWeek(dateChange);
    };

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

    //获得当前的00:00:00和23:59:59时间
    getAlldayTime(start, end) {
        let currentDayStart = this.getLocalTime(new Date(start), 2);
        let currentDayEnd = this.getLocalTime(new Date(end), 2);
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

    getCompareList = () => {
        const { dispatch } = this.props;
        const { startTime, endTime } = this.state;
        dispatch({
            type: 'timeTable/getVersionList',
            payload: {
                startTime: new Date(startTime).getTime(),
                endTime: new Date(endTime).getTime(),
            },
        });
    };

    generateString = (newGetLotSubjects, serialNumber) => {
        let { chooseCourseDetails } = this.props;
        let courseString = '';

        newGetLotSubjects.map((item, index) => {
            chooseCourseDetails?.stintSubjectNumModelList &&
                chooseCourseDetails.stintSubjectNumModelList.length > 0 &&
                chooseCourseDetails.stintSubjectNumModelList[serialNumber].subjectIdList.map(
                    (item2, index2) => {
                        if (item.id == item2) {
                            courseString += `${item.name}${
                                chooseCourseDetails.stintSubjectNumModelList[serialNumber]
                                    .subjectIdList.length -
                                    1 ==
                                index2
                                    ? ''
                                    : '、'
                            }`;
                        }
                    }
                );
        });

        courseString += '课程，';

        return courseString;
    };

    onChangeAttendance = (e) => {
        this.setState({
            effectiveValue: e.target.value,
        });
    };

    closeEffect = () => {
        this.setState({ effectiveVisible: false });
    };

    findSubjectName = (arr) => {
        let { getLotSubjects } = this.props;
        let tempStr = '';
        getLotSubjects = lodash.sortBy(getLotSubjects, 'id');
        arr = arr.sort();
        getLotSubjects &&
            getLotSubjects.length &&
            getLotSubjects.map((item, index) => {
                arr &&
                    arr.length &&
                    arr.map((el, ind) => {
                        if (item.id == el) {
                            return (tempStr += `${item.name}${ind == arr.length - 1 ? '' : ','}`);
                        }
                    });
            });

        return tempStr;
    };

    render() {
        let {
            toggleVisible,
            effectiveValue,
            courseVersion,
            loading,
            visible,
            planId,
            startTime,
            endTime,
            popVisible,
            checkErrorMessageList,
            errorVisible,
            seleceEdition,
            generateCalenVisible,
            effectiveVisible,
            uploading,
            effectResVisible,
            cacheRefreshLoading,
            isGenetare,
            multiLanguage,
        } = this.state;

        const {
            scheduleData,
            planningSchoolListInfo,
            allStage,
            choosePlanList,
            getLotSubjects,
            versionList,
            listSyncRecord,
            currentUser,
            chooseCourseDetails,
        } = this.props;

        let specialArr =
            (chooseCourseDetails?.choosePayProjectSettingModelList &&
                chooseCourseDetails.choosePayProjectSettingModelList.length >= 2 &&
                chooseCourseDetails.choosePayProjectSettingModelList.slice(2)) ||
            [];

        let syncSchedule = chooseCourseDetails.syncSchedule;
        let effectiveType = chooseCourseDetails.effectiveType;

        let newGetLotSubjects = lodash.sortBy(getLotSubjects, function (item) {
            return item.id;
        });

        let isStudy = currentUser.schoolId == '1000001001';
        let classDay = '';
        if (chooseCourseDetails.classDate) {
            chooseCourseDetails?.classDate &&
                chooseCourseDetails.classDate.map((item, index) => {
                    let value = this.noToChinese(item);
                    classDay += '周' + value + ' ';
                });
        }
        
        let groupDTOList = [];
        chooseCourseDetails && chooseCourseDetails.groupGroupingNumJsonDTOList &&
        chooseCourseDetails.groupGroupingNumJsonDTOList.length > 0 &&
        chooseCourseDetails.groupGroupingNumJsonDTOList.map(el=>{
            groupDTOList.push(el.groupingName)
        })

        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
            color: 'black',
        };

        const syncColumns = [
            {
                title: trans('global.synchronised time', '同步时间'),
                dataIndex: 'syncTime',
                align: 'center',
            },
            {
                title: trans('global.curriculum', '课表'),
                dataIndex: 'versionName',
                align: 'center',
            },
            {
                title: trans('global.syncStatus', '同步状态'),
                dataIndex: 'success',
                align: 'center',
                width: 100,
                render: (text, record) => {
                    return (
                        <span>
                            {record.success
                                ? trans('global.success', '成功')
                                : !record.success
                                ? trans('global.fail', '失败')
                                : ''}
                        </span>
                    );
                },
            },
            {
                title: '',
                dataIndex: 'current',
                align: 'center',
                width: 150,
                render: (text, record, index) => {
                    /* return text ? (
                        <span style={{ color: '#05E657', cursor: 'pointer' }}>
                            当前选课关联课表
                        </span>
                    ) : (
                        <span
                            style={{ color: '#0445FC', cursor: 'pointer' }}
                            onClick={() => this.setLinkSchedule(record)}
                        >
                            设为当前关联课表
                        </span>
                    ); */
                    if (
                        index > 0 &&
                        listSyncRecord[index].versionName ==
                            listSyncRecord[index - 1].versionName &&
                        listSyncRecord[index].current == listSyncRecord[index - 1].current
                    ) {
                        return null;
                    } else {
                        return text ? (
                            <span style={{ color: '#05E657', cursor: 'pointer' }}>
                                {trans('global.Current timetable', '当前选课关联课表')}
                            </span>
                        ) : (
                            <span
                                style={{ color: '#0445FC', cursor: 'pointer' }}
                                onClick={() => this.setLinkSchedule(record)}
                            >
                                {trans('global.Set timetable', '设为当前关联课表')}
                            </span>
                        );
                    }
                    // console.log('1111', text, record, index);
                },
            },
            {
                title: trans('global.Operator', '操作人'),
                dataIndex: locale() !== 'en' ? 'userName' : 'userEnName',
                align: 'center',
                width: 85,
            },
        ];

        const content = (
            <div className={styles.popAsync}>
                <p>
                    {trans(
                        'global.popAsync',
                        '确认将当前选课计划中各个班级的开课信息（教师、时间、地点）同步更新到所选课表吗？'
                    )}
                </p>
                <span>
                    <Button
                        type="primary"
                        onClick={() => this.sureToAsync()}
                        style={{ margin: '0 10px 0 100px' }}
                    >
                        {trans('global.confirm', '确认')}
                    </Button>
                    <Button
                        onClick={() =>
                            this.setState({
                                popVisible: false,
                            })
                        }
                    >
                        {trans('global.cancel', '取消')}
                    </Button>
                </span>
            </div>
        );
        return (
            <div className={styles.main}>
                <div className={styles.top}>
                    <p style={{ marginRight: '15px' }}>
                        <Button
                            style={{ width: 'auto', marginRight: '10px' }}
                            type="primary"
                            onClick={() => this.handleCacheRefresh()}
                            loading={cacheRefreshLoading}
                        >
                            {trans('global.cacheRefresh', '缓存刷新')}
                        </Button>
                        <Button
                            style={{ width: 'auto', marginRight: '10px' }}
                            type="primary"
                            onClick={() => this.toggleSchedule()}
                        >
                            {trans('global.Synchronized timetable', '同步课表')}
                        </Button>

                        {!isStudy && (
                            <Button
                                type="primary"
                                style={{ margin: '10px', width: 'auto' }}
                                onClick={() => this.openToStu()}
                            >
                                {trans('global.Open course selection', '开放选课给学生')}
                            </Button>
                        )}

                        <Button
                            type={syncSchedule && effectiveType ? '' : 'primary'}
                            style={{ width: 'auto' }}
                            // onClick={this.effectiveConfirm}
                            onClick={this.effectiveResult}
                        >
                            {syncSchedule && effectiveType
                                ? trans('global.Course selection results', '选课结果已生效')
                                : trans(
                                      'global.Effective course selection results',
                                      '生效选课结果'
                                  )}
                            {/* 生效选课结果 */}
                        </Button>
                        <Button
                            type="primary"
                            style={{ margin: '10px', width: 'auto' }}
                            onClick={() => this.editSelectCourse()}
                        >
                            {trans('charge.edit', '编辑')}
                        </Button>
                        {/* <Popover title={null} placement="bottomRight" content={this.popoverHTML()}>
                            <Icon type="small-dash" />
                        </Popover> */}
                        <Button
                            type="primary"
                            style={{ margin: '10px', width: 'auto' }}
                            onClick={this.deleteCourse.bind(this, this.state.planId)}
                        >
                            {trans('tc.base.delete.course.plan', '删除选课计划')}
                        </Button>
                    </p>
                </div>
                <div className={styles.content}>
                    <p className={styles.contentP}>
                        <span className={styles.title}>
                            {trans('course.step1.stepchinese.title', '中文标题')}:
                        </span>
                        <span>{chooseCourseDetails.name}</span>
                    </p>
                    <p className={styles.contentP}>
                        <span className={styles.title}>
                            {trans('course.step1.english.title', '英文标题')}:
                        </span>
                        <span>{chooseCourseDetails.ename}</span>
                    </p>
                    <p className={styles.contentP}>
                        <span className={styles.title}>
                            {trans('course.step1.semester', '所属学期')}:
                        </span>
                        <span>
                            {chooseCourseDetails &&
                            chooseCourseDetails.semesterModel &&
                            chooseCourseDetails.semesterModel.officialSemesterName
                                ? multiLanguage !== 'en'
                                    ? chooseCourseDetails.semesterModel.officialSemesterName
                                    : chooseCourseDetails.semesterModel.officialEnName
                                : ''}
                        </span>
                    </p>
                    <p className={styles.contentP}>
                        <span className={styles.title}>
                            {trans('course.step1.school.area', '所属校区')}:
                        </span>
                        <span>
                            {chooseCourseDetails.schoolList &&
                                chooseCourseDetails.schoolList.map((item, index) => {
                                    return multiLanguage !== 'en' ? item.name : item.enName;
                                })}
                        </span>
                    </p>
                    <p className={styles.contentP}>
                        <span className={styles.title}>
                            {trans('course.step1.applicable.section', '适用学段')}:
                        </span>
                        <span>
                            {chooseCourseDetails.schoolSectionList &&
                                chooseCourseDetails.schoolSectionList.map((item, index) => {
                                    return (
                                        <>
                                            {multiLanguage !== 'en' ? item.name : item.enName}
                                            {chooseCourseDetails.schoolSectionList.length - 1 ===
                                            index
                                                ? null
                                                : '、'}
                                        </>
                                    );
                                })}
                        </span>
                    </p>
                    <p className={styles.contentP}>
                        <span className={styles.title}>
                            {trans('course.step1.selection.period', '开课周期')}:
                        </span>

                        {chooseCourseDetails.startTime && chooseCourseDetails.endTime ? (
                            <span>
                                {chooseCourseDetails.startTime.substring(0, 10) +
                                    trans('list.to', '至') +
                                    chooseCourseDetails.endTime.substring(0, 10)}
                            </span>
                        ) : (
                            <span>{trans('global.No course opening period', '暂无开课周期')}</span>
                        )}
                    </p>
                    <p className={styles.contentP}>
                        <span className={styles.title}>
                            {trans('course.step1.selection.declare', '课程申报')}:
                        </span>
                        {chooseCourseDetails.declareStartTime &&
                        chooseCourseDetails.declareEndTime ? (
                            <span>
                                {chooseCourseDetails.declareStartTime.substring(0, 10) +
                                    trans('list.to', '至') +
                                    chooseCourseDetails.declareEndTime.substring(0, 10)}
                            </span>
                        ) : (
                            <span>
                                {trans('global.Teacher filling not enabled', '暂无课程申报')}
                            </span>
                        )}
                    </p>
                    <p className={styles.contentP}>
                        <span className={styles.title}>
                            {trans('course.step1.selection.continuation', '续课设置')}:
                        </span>
                        <span>
                            <p>
                                {chooseCourseDetails.prefaceChooseCoursePlanModels ||
                                chooseCourseDetails.repeatableCourseFirst == true ? (
                                    <span>{trans('global.Enabled', '已开启')} </span>
                                ) : (
                                    ''
                                )}
                                {chooseCourseDetails?.prefaceChooseCoursePlanModels ? (
                                    <span>
                                        {trans('global.previousPlan', '前序选课计划')}:
                                        {chooseCourseDetails.prefaceChooseCoursePlanModels[0].name}
                                    </span>
                                ) : (
                                    <span>
                                        {trans('global.noPreviousPlan', '暂无前序选课计划')}
                                    </span>
                                )}
                            </p>

                            {chooseCourseDetails.repeatableCourseFirst == true ? (
                                <p>
                                    {trans(
                                        'global.allowedPreviousPlan',
                                        '允许已上过前序课程的学生优先进阶'
                                    )}
                                </p>
                            ) : (
                                ''
                            )}
                        </span>
                    </p>
                    <p className={styles.contentP}>
                        <span
                            className={styles.title}
                            style={
                                {
                                    /*marginLeft: '-28px'*/
                                }
                            }
                        >
                            {trans('global.Course Introduction Template', '课程介绍模板')}:
                        </span>
                        <span>
                            {chooseCourseDetails.courseIntroductionType == 0
                                ? trans('global.Fixed Layout', '固定版式')
                                : chooseCourseDetails.courseIntroductionType == 1
                                ? trans('global.Free Layout', '自由版式')
                                : ''}
                        </span>
                    </p>
                    <p className={styles.contentP}>
                        <span
                            className={styles.title}
                            style={
                                {
                                    /*marginLeft: '-42px'*/
                                }
                            }
                        >
                            {trans('global.Fees Display Rules', '选课端费用展示')}:
                        </span>
                        <span>
                            {chooseCourseDetails.classFeeShow
                                ? trans('global.Display course fee', '展示课时费')
                                : trans('global.Class fee not shown', '不展示课时费')}
                            &nbsp;&nbsp;
                            {chooseCourseDetails.materialFeeShow
                                ? trans('global.Display material fee', '展示材料费')
                                : trans('global.Material fee not shown', '不展示材料费')}
                        </span>
                    </p>
                    <p className={styles.contentP}>
                        <span className={styles.title}>
                            {trans('global.Class Time', '上课时间')}:
                        </span>
                        <span>{classDay || trans('selCourse.noNeedToSetUp', '无需设置')}</span>
                    </p>
                    <p className={styles.contentP}>
                        <span className={styles.title}>
                            {trans('selCourse.classGroups', '班级分组')}:
                        </span>
                        <span>{groupDTOList.join('、')}</span>
                    </p>
                    <p className={styles.contentP}>
                        <span className={styles.title}>
                            {trans('global.Class Of Time', '上课时段')}:
                        </span>
                        {chooseCourseDetails.classTime && 
                            chooseCourseDetails.classTime.length > 0 ? 
                            chooseCourseDetails.classTime.map((item, index) => {
                                return (
                                    <span>
                                        {item.startTime}-{item.endTime}&nbsp;&nbsp;
                                    </span>
                                );
                            }) : <span>无</span>}
                    </p>
                    <p className={styles.contentP} style={{ lineHeight: '15px' }}>
                        <span className={styles.title}>
                            {trans('global.Student selection rules', '选课规则')}:
                        </span>
                        <div style={{ marginLeft: '20px',height: 65 }}>
                            <span>
                                <p>
                                    {chooseCourseDetails.type == 1
                                        ? trans('global.Multiple Intentions Apply', '志愿申报')
                                        : chooseCourseDetails.type == 2
                                        ? trans('global.First Select First Got', '先到先得')
                                        : ''}
                                </p>
                            </span>
                            <span>
                                <p>
                                    {chooseCourseDetails.checkTimeConflict == 0
                                        ? trans('selCourse.notVerify', '不校验')
                                        : chooseCourseDetails.checkTimeConflict == 1
                                        ? trans('selCourse.verify', '校验')
                                        : ''}
                                </p>
                            </span>
                            <p>
                                {
                                    chooseCourseDetails.cancelSignUpTime ? <>
                                        <span>学生家长取消限制：</span>
                                        <span>自定义截止时间 {chooseCourseDetails.cancelSignUpTime}</span>
                                    </> : null
                                }
                            </p>

                            <br />
                            {chooseCourseDetails?.stintSubjectNumModelList &&
                                chooseCourseDetails.stintSubjectNumModelList.length > 0 &&
                                chooseCourseDetails.stintSubjectNumModelList.map((item, index) => {
                                    return item?.subjectIdList && item.subjectIdList.length != 0 ? (
                                        <p>
                                            {this.generateString(newGetLotSubjects, index) +
                                                trans('global.limited quantity', '限报数量为') +
                                                (chooseCourseDetails?.stintSubjectNumModelList[
                                                    index
                                                ].number >= 0
                                                    ? chooseCourseDetails.stintSubjectNumModelList[
                                                          index
                                                      ].number
                                                    : trans('global.no', '暂无'))}
                                        </p>
                                    ) : (
                                        ''
                                    );
                                })}
                        </div>
                    </p>

                    <p className={styles.contentP}>
                        <span
                            className={styles.title}
                        >
                            {trans('global.Administrator', '选课计划管理员')}:
                        </span>
                        <span className={styles.adminStyle}>
                            {chooseCourseDetails.administratorList &&
                                chooseCourseDetails.administratorList.map((item, index) => {
                                    return (
                                        <>
                                            {multiLanguage !== 'en' ? item.name : item.enName}
                                            {chooseCourseDetails.administratorList.length - 1 ===
                                            index
                                                ? null
                                                : '、'}
                                        </>
                                    );
                                })}
                        </span>
                    </p>
                    <p className={styles.contentP}>
                        <span
                            className={styles.title}
                        >
                            {trans('global.Fees Administrator', '费用管理员')}:
                        </span>
                        <span>
                            {chooseCourseDetails.feeAdministratorList &&
                                chooseCourseDetails.feeAdministratorList.map((item, index) => {
                                    return (
                                        <>
                                            {multiLanguage !== 'en' ? item.name : item.enName}
                                            {chooseCourseDetails.feeAdministratorList.length - 1 ===
                                            index
                                                ? null
                                                : '、'}
                                        </>
                                    );
                                })}
                        </span>
                    </p>
                    <p className={styles.contentP}>
                        <span className={styles.title}>
                            {trans('global.Charge Settings', '收费设置')}:
                        </span>
                        <span className={styles.titleTxt}>
                            <div>
                                <span style={{ display: 'inline' }}>
                                    {chooseCourseDetails.choosePayType == 0
                                        ? '不收费'
                                        : chooseCourseDetails.choosePayType == 1
                                        ? '统一收费'
                                        : chooseCourseDetails.choosePayType == 2
                                        ? '即时缴费'
                                        : ''}
                                </span>
                                <span style={{ display: 'inline' }}>
                                    {chooseCourseDetails.choosePayType == 1
                                        ? chooseCourseDetails.mergeOrder == 1
                                            ? '（合并订单）'
                                            : chooseCourseDetails.mergeOrder == 2
                                            ? '（分拆订单）'
                                            : ''
                                        : chooseCourseDetails.choosePayType == 2
                                        ? chooseCourseDetails.useWallet == 1
                                            ? '（支付设置：允许使用学生账户余额抵扣）'
                                            : chooseCourseDetails.useWallet == 2
                                            ? '（支付设置：不允许使用学生账户余额抵扣）'
                                            : ''
                                        : ''}
                                </span>
                            </div>

                            <span
                                style={{
                                    display:
                                        chooseCourseDetails.choosePayType == 1
                                            ? 'inline-block'
                                            : 'none',
                                }}
                            >
                                <div>
                                    <span>默认收费项目</span>
                                    <div style={{ display: 'inline-block' }}>
                                        <span className={styles.chargeStyle}>
                                            {`课时费：${
                                                chooseCourseDetails?.choosePayProjectSettingModelList &&
                                                chooseCourseDetails
                                                    .choosePayProjectSettingModelList[0]
                                                    .chargeItemName
                                            }/
                                            ${
                                                chooseCourseDetails?.choosePayProjectSettingModelList &&
                                                chooseCourseDetails
                                                    .choosePayProjectSettingModelList[0]
                                                    .itemCategoryName
                                            }`}
                                        </span>
                                        <span className={styles.chargeStyle}>
                                            {`材料费：${
                                                chooseCourseDetails?.choosePayProjectSettingModelList &&
                                                chooseCourseDetails
                                                    .choosePayProjectSettingModelList[1]
                                                    .chargeItemName
                                            }/
                                            ${
                                                chooseCourseDetails?.choosePayProjectSettingModelList &&
                                                chooseCourseDetails
                                                    .choosePayProjectSettingModelList[1]
                                                    .itemCategoryName
                                            }`}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex' }}>
                                    <span>例外收费项目</span>
                                    <span className={styles.chargeStyle}>
                                        {specialArr.map((item, index) => {
                                            if (index % 2 != 1) {
                                                return (
                                                    <div>
                                                        <span>
                                                            {this.findSubjectName(
                                                                item.subjectIdList
                                                            )}
                                                        </span>
                                                        <span
                                                            style={{ marginLeft: '20px' }}
                                                        >{`课时费:${specialArr[index].chargeItemName}/${specialArr[index].itemCategoryName}`}</span>
                                                        <span
                                                            style={{ marginLeft: '20px' }}
                                                        >{`材料费:${
                                                            specialArr[index + 1].chargeItemName
                                                        }/${
                                                            specialArr[index + 1].itemCategoryName
                                                        }`}</span>
                                                    </div>
                                                );
                                            }
                                        })}
                                    </span>
                                </div>
                            </span>
                        </span>
                    </p>
                    <p className={styles.contentP}>
                        <span className={styles.title} style={{ height: '30px' }}>
                            报名及退费须知:
                        </span>
                        <span
                            className={styles.pStyle}
                            dangerouslySetInnerHTML={{ __html: chooseCourseDetails.announcement }}
                        ></span>
                    </p>
                    {typeof isYungu != 'undefined' && isYungu == 'false' ? null : (
                        <p className={styles.contentP}>
                            <span
                                className={styles.title}
                            >
                                {trans('global.Student Selection Address', '学生选课地址')}:
                            </span>
                            <span className={styles.titleTxt}>
                                <span>
                                    家长身份:钉钉工作台-&gt;课程选报（仅面向幼儿园、中小学开放）
                                </span>
                                <span>学生身份:云谷课堂-&gt;百宝箱-&gt;课程选报</span>
                                <span>
                                    选课PC端直达链接:
                                    <a
                                        href={
                                            'https://smart-scheduling.yungu.org/?hash=course/student/list#/course/student/list'
                                        }
                                        target="_blank"
                                    >
                                        https://smart-scheduling.yungu.org/?hash=course/student/list#/course/student/list
                                    </a>
                                </span>
                            </span>
                        </p>
                    )}
                </div>
                <Modal
                    visible={toggleVisible}
                    title={trans('global.Synchronized timetable', '同步课表')}
                    className={styles.toggleModal}
                    onOk={() => this.toggleOk()}
                    onCancel={() => this.toggleCannel()}
                    footer={null}
                    zIndex={1030}
                >
                    <div className={styles.toggle}>
                        <span
                            style={{
                                width: '360px',
                                border: '1px solid #ccc',
                                lineHeight: '35px',
                                textIndent: '1em',
                                borderRadius: '5px',
                            }}
                            onClick={() => this.setState({ seleceEdition: true })}
                        >
                            {
                                (versionList &&
                                    versionList.length > 0 &&
                                    versionList.map((item, index) => {
                                        if (item.id == courseVersion) {
                                            // return `${item.versionSourceTime}   ${item.name}`;
                                            return `${item.name}`;
                                        }
                                    })) ||
                                    trans('global.Please select schedule', '请选择课表')
                            }
                        </span>
                        <Button onClick={this.linkSchedule}>
                            {trans('global.Associated timetable', '关联课表')}
                        </Button>
                        <Popover style={{zIndex:1099}} className={styles.popStyle} content={content} trigger="click" visible={popVisible}>
                            <Button type="primary" onClick={() => this.getSchedules()}>
                                {trans('global.Synchronized timetable', '同步课表')}
                            </Button>
                        </Popover>
                    </div>
                    <Table
                        columns={syncColumns}
                        dataSource={listSyncRecord}
                        pagination={false}
                        loading={loading}
                    ></Table>
                </Modal>
                <Modal
                    visible={effectiveVisible}
                    title={trans('global.Effective course selection results', '生效选课结果')}
                    footer={
                        <p style={{ display: 'flex', justifyContent: 'end' }}>
                            <Button onClick={this.closeEffect}>
                                {trans('global.cancel', '取消')}
                            </Button>
                            <Button type="primary" onClick={this.handleEffective}>
                                {trans('global.confirmEffective', '确认生效选课结果')}
                            </Button>
                        </p>
                    }
                    onCancel={this.closeEffect}
                    width={570}
                    className={styles.effect}
                >
                    <Spin
                        spinning={uploading}
                        tip={trans('global.effectiveLoading', '生效中，请稍后...')}
                    >
                        <p className={styles.effectiveContent}>
                            <span className={styles.title}>
                                {trans('global.Course selection list', '选课名单')}
                                <i style={{ color: 'red' }}>*</i>
                            </span>
                            <div>
                                <Radio style={radioStyle} defaultChecked={true} disabled={true}>
                                    {trans('global.GenerateList', '生成学生选课名单')}
                                </Radio>
                                <span>
                                    {trans(
                                        'global.GenerateListAfter',
                                        '生成选课名单后，教师可为学生布置任务、填写课堂反馈等。若之后学生选课结果有变化，可在选课中进行调整，调整结果实时生效。'
                                    )}
                                </span>
                            </div>
                        </p>
                        <p className={styles.effectiveContent}>
                            <span className={styles.title}>
                                选课日程
                                <i style={{ color: 'red' }}>*</i>
                            </span>
                            <Radio.Group
                                onChange={this.onChangeAttendance}
                                value={effectiveValue}
                                style={{ marginLeft: '12px' }}
                            >
                                <Radio style={radioStyle} value={0}>
                                    直接生成选课日程
                                </Radio>
                                <span>
                                    生成日程后，教师可查询个人上课日程，可使用课堂考勤功能；学生家长可查询学生上课日程。日程生成后，若教师及地点有变化，可直接在选课中调整。
                                </span>
                                <Radio style={radioStyle} value={1}>
                                    通过课表管理选课日程
                                </Radio>
                                <span>
                                    您可以使用「同步课表」功能，将选修课同步至指定的课表，或直接在课表中导入选课课表，通过公布课表生成选课日程
                                </span>
                            </Radio.Group>
                        </p>
                    </Spin>
                </Modal>
                <Modal
                    visible={effectResVisible}
                    title="选课结果已生效"
                    width={570}
                    footer={[
                        <Button
                            onClick={() =>
                                this.setState({
                                    effectResVisible: false,
                                })
                            }
                            style={{ marginLeft: '400px' }}
                        >
                            关闭
                        </Button>,
                    ]}
                    onCancel={() =>
                        this.setState({
                            effectResVisible: false,
                        })
                    }
                    className={styles.effect}
                >
                    <Spin spinning={isGenetare}>
                        <div>
                            <p>
                                <Icon type="check-circle" style={{ color: '#79DE5D' }} />
                                <span className={styles.title}>选课名单已生成</span>
                            </p>
                            <p>
                                教师可为学生布置任务、填写课堂反馈等。若之后学生选课结果有变化，可在选课中进行调整，调整结果实时生效。
                            </p>
                        </div>
                        <div>
                            <p>
                                {syncSchedule ? (
                                    <Icon type="check-circle" style={{ color: '#79DE5D' }} />
                                ) : (
                                    <span
                                        style={{
                                            display: 'inline-block',
                                            border: '1px solid #ccc',
                                            width: '14px',
                                            height: '14px',
                                            borderRadius: '7px',
                                            verticalAlign: 'middle',
                                        }}
                                    ></span>
                                )}

                                <span className={styles.title}>
                                    {syncSchedule ? '教师及学生日程已生成' : '通过课表管理选课日程'}
                                </span>
                                <span
                                    style={{
                                        color: '#4870FD',
                                        margin: '0 20px',
                                        cursor: 'pointer',
                                    }}
                                    onClick={this.toCalender}
                                >
                                    查看日程
                                </span>
                            </p>
                            <p>
                                {syncSchedule
                                    ? '教师可查询个人上课日程，可使用课堂考勤功能；学生家长可查询学生上课日程。若之后上课时间和地点有变化，可直接调整日程。'
                                    : '您可以使用「同步课表」功能，将选修课同步至指定的课表，或直接在课表中导入选课课表，通过公布课表生成选课日程'}
                            </p>
                        </div>
                    </Spin>
                </Modal>
                <Modal
                    title="生成日程"
                    visible={generateCalenVisible}
                    footer={
                        <p style={{ display: 'flex', justifyContent: 'end' }}>
                            <Button
                                onClick={() => {
                                    this.setState({
                                        generateCalenVisible: false,
                                    });
                                }}
                            >
                                取消
                            </Button>
                            <Button type="primary" onClick={this.beSureGenerate}>
                                确认生成日程
                            </Button>
                        </p>
                    }
                    className={styles.effect}
                >
                    <p>
                        若您已公布包含了本次选课的课表，再次生成日程，日程会重复。确认是否继续操作？
                    </p>
                </Modal>
                <Modal
                    className={styles.selectSchedule}
                    visible={seleceEdition}
                    title="选择课表版本"
                    width={300}
                    onCancel={() => this.setState({ seleceEdition: false })}
                    onOk={() => this.setState({ seleceEdition: false })}
                >
                    <div className={styles.timePicker}>
                        <span className={styles.timeText}>
                            {startTime && endTime ? (
                                <>
                                    {this.getLocalTime(startTime)} - {this.getLocalTime(endTime)}
                                </>
                            ) : (
                                '请选择一周日期'
                            )}

                            {/* {this.getLocalTime(startTime)} - {this.getLocalTime(endTime)} */}
                        </span>
                        <DatePicker
                            onChange={this.onDateChange}
                            allowClear={false}
                            style={{ width: '240px' }}
                            // defaultValue={moment(this.getLocalTime(startTime), dateFormat)}
                        ></DatePicker>
                    </div>
                    <Select
                        showSearch
                        style={{ width: '240px' }}
                        optionFilterProp="label"
                        value={courseVersion}
                        placeholder="选择课表版本"
                        onChange={this.changeVersion}
                    >
                        {versionList &&
                            versionList.length > 0 &&
                            versionList.map((item, index) => {
                                return (
                                    <Option key={item.id} value={item.id}>
                                        {item.name}
                                    </Option>
                                );
                            })}
                    </Select>
                </Modal>
                <Modal
                    visible={errorVisible}
                    footer={null}
                    onCancel={() =>
                        this.setState({
                            errorVisible: false,
                        })
                    }
                    title="同步失败信息"
                >
                    <div style={{ margin: 'auto' }}>
                        {checkErrorMessageList &&
                            checkErrorMessageList.length > 0 &&
                            checkErrorMessageList.map((item, index) => {
                                return <p>{item}</p>;
                            })}
                    </div>
                </Modal>
                {/* <Modal
                    title={
                        <NavTitle
                            title={trans('tc.base.open.course.selection', '开放选课')}
                            onCancel={() => this.setState({ visibleOpenCourse: false })}
                        />
                    }
                    maskClosable={false}
                    closable={false}
                    footer={null}
                    visible={visibleOpenCourse}
                    width="50%"
                >
                    <div className={styles.openCourse}>
                        <Table
                            columns={columns}
                            dataSource={chooseCoursePlanBatchList}
                            pagination={false}
                        />
                        <div className={styles.btn}>
                            <Button
                                onClick={() => this.setState({ visibleOpenCourse: false })}
                                type="primary"
                            >
                                {trans('global.finish', '完成')}
                            </Button>
                        </div>
                    </div>
                </Modal> */}
                <AddCourse
                    visible={visible}
                    isEdit={true}
                    planId={planId}
                    hideModal={this.hideModal}
                    choosePlan={this.choosePlanList}
                    // callback={() => {
                    //     // 添加成功时，如果在课程页面，则重新请求数据
                    //     return <span>111</span>;
                    //     /* if (tabIndex === 1) {
                    //         this.courseChild.resetData.call(this.courseChild);
                    //     } else {
                    //         this.studentChild.initStudentDetail.call(this.studentChild);
                    //     } */
                    // }}
                    {...this.props}
                />

                {/* 开放选课 */}
                {this.openCourseHTML()}
            </div>
        );
    }
}

module.exports = Detail;
