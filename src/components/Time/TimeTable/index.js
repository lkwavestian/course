//课表
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './index.less';
import icon from '../../../icon.less';
import {
    Select,
    TreeSelect,
    Popover,
    Modal,
    Icon,
    DatePicker,
    message,
    Input,
    Checkbox,
    Tabs,
    Popconfirm,
    Button,
    Spin,
    Form,
    Upload,
    Table,
    Badge,
    Radio,
} from 'antd';
import ScheduleTable from './table.js';
import ExchangeCourse from './exchangeTable.js';
import CreateSchedule from './OperModal/createSchedule';
import SaveVersionModal from './OperModal/saveVersion';
import CopyResultModal from './OperModal/copyResult';
import ImportPlanModal from './OperModal/importPlan';
import ChangsScheduleModal from './OperModal/changsSchedule';
import TakePartClass from './OperModal/takePartClass';
import VersionComparisonModal from './OperModal/versionComparison';
import PublishSchedule from './OperModal/publishSchedule';
import WillArrangeCourse from './WillArrange/index';
import ClickKeyArrange from './OperModal/clickKeyArrange';
import ExposeScheduleModal from './OperModal/exposeSchedule';
import ImportScheduleModal from './OperModal/importSchedule';
import Rules from './Rules/index';
import FreedomCourse from './FreedomCourse/index';
import PowerPage from '../../PowerPage/index';
import VersionInfo from './VersionInfo/index';
import ChangeVersion from './ChangeVersion/index';
import CourseDetail from './WillArrange/courseDetail';
import VersionContrast from './VersionContrast/index';
import OperationRecord from './OperationRecord/index';
import CheckVersionConflict from './CheckVersionConflict/index';
import LessonView from './LessonView';
import { trans, locale } from '../../../utils/i18n';
import { isEmpty, isEqual, debounce } from 'lodash';
import { formatTimeSafari, intoChineseLang } from '../../../utils/utils';
import LessonViewCustomCourse from './LessonView/LessonViewCustomCourse';
import ReplaceApplication from './ReplaceApplication';
import DisplayRuleList from './DisplayRuleList';
import ImportActivity from './ImportActivity';
import CopySchedule from './OperModal/copySchedule';

const { Option } = Select;
const { confirm } = Modal;
const { Search } = Input;
const { TabPane } = Tabs;
const CheckboxGroup = Checkbox.Group;

@connect((state) => ({
    semesterList: state.time.semesterList,
    gradeList: state.time.gradeList,
    courseList: state.course.courseList,
    teacherList: state.course.teacherList,
    studentList: state.timeTable.studentList,
    versionList: state.timeTable.versionList,
    scheduleData: state.timeTable.scheduleData,
    gradeSchedule: state.timeTable.gradeSchedule,
    scheduleDataResponse: state.timeTable.scheduleDataResponse, //查看课表获取的状态
    acCourseList: state.timeTable.acCourseList,
    lockCourseArr: state.timeTable.lockCourseArr,
    choiceScheduleDetailId: state.timeTable.choiceScheduleDetailId,
    areaList: state.timeTable.areaList,
    unlockResultIdList: state.timeTable.unlockResultIdList,
    canChangeCourse: state.timeTable.canChangeCourse, //换课--可选结果
    checkChangeResult: state.timeTable.checkChangeResult, //换课-校验结果
    changeCourseDetail: state.timeTable.changeCourseDetail, //换课--详情
    lastPublicContent: state.timeTable.lastPublicContent, //检验当期版本是否发布
    courseBySubject: state.timeTable.courseBySubject, //科目-课程联动
    deleteScheduleResult: state.timeTable.deleteScheduleResult, //清空某天结果的统计
    addressResult: state.timeTable.addressResult, //根据场地查询结果
    teacherResult: state.timeTable.teacherResult, //根据教师查询结果
    border: state.exchangeCourse.border,
    move: (state.exchangeCourse.move && state.exchangeCourse.move.content) || [],
    newCanChangeCourse:
        (state.exchangeCourse.exchangeResult && state.exchangeCourse.exchangeResult.content) || [],
    moveResponse: state.exchangeCourse.move,
    changeResponse: state.exchangeCourse.exchangeResult,
    newCanCheckScheduleList: state.timeTable.newCanCheckScheduleList, // 待排课节可选课节列表
    conflictReasonCardInfo: state.timeTable.conflictReasonCardInfo, // 冲突原因卡片信息
    allStageGrade: state.time.allStageGrade, // 学段年级
    courseDetail: state.timeTable.courseDetail,
    arrangeDetailList:
        state.timeTable.arrangeDetailList &&
        state.timeTable.arrangeDetailList.weekCoursePlanningDetailView,
    arrangeDetailListTotal: state.timeTable.arrangeDetailList, //待排区域列表
    scheduleStatusList: state.timeTable.scheduleStatusList,
    semesterListByTime: state.time.semesterListByTime,
    gradeByTypeArr: state.timeTable.gradeByTypeArr, //学生组件优化

    scheduleDetail: state.rules.scheduleDetail, //获取教师的表格
    courseAcquisition: state.rules.courseAcquisition, //根据班级获取作息id

    clickKeuScheduleList: state.timeTable.clickKeuScheduleList,
    confirmStatus: state.timeTable.confirmStatus,
    batchUpdateCourse: state.course.batchUpdateCourse,
    tableView: state.timeTable.tableView,
    newClassGroupList: state.rules.newClassGroupList[0]
        ? state.rules.newClassGroupList[0].gradeStudentGroupModels
        : [], //版本内-学生组

    //课节视图
    lessonViewCustomValue: state.lessonView.lessonViewCustomValue,
    lessonViewCustomLabel: state.lessonView.lessonViewCustomLabel,
    lessonViewExchangeCourseStatus: state.lessonView.lessonViewExchangeCourseStatus,
    lessonViewExchangeCustomCourseStatus: state.lessonView.lessonViewExchangeCustomCourseStatus,
    lessonViewScheduleData: state.lessonView.lessonViewScheduleData,
    customCourseSearchIndex: state.lessonView.customCourseSearchIndex,
    mainScheduleData: state.lessonView.mainScheduleData,
    currentSideBar: state.lessonView.currentSideBar,
    searchParameters: state.lessonView.searchParameters,

    //Menu徽标数（红色小数字）
    listVersionChangeCourseRequestCount: state.replace.listVersionChangeCourseRequestCount,
    scheduleCheckList: state.timeTable.scheduleCheckList,

    //语言
    currentLang: state.global.currentLang,

    //从历史学期复制
    copyModalVisible: state.timeTable.copyModalVisible,
}))
export default class TimeTable extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            semesterValue: '',
            gradeValue: localStorage.getItem('gradeValue')
                ? JSON.parse(localStorage.getItem('gradeValue'))
                : [],
            courseValue: [],
            startTime: 0,
            entTime: 0,
            currentDate: new Date().getTime(),
            currentVersion: '', //当前版本
            currentVersionName: '', // 当前版本名称
            currentVersionRemark: '',

            scheduleModal: false, //新建课表
            versionModal: false, //保存版本
            importPlanModal: false, //导入课时计划
            changsScheduleModal: false, //更换作息表
            versionComparisonModal: false, //版本对比
            publishModal: false, //公布课表
            copyResultModal: false, //复制排课结果
            clickKeyModal: false, //一键排课

            rulesModal: false, // 规则

            arrangeModal: false, //待排课卡片

            isShowSetNewVersion: false, //是否显示最新版本按钮
            showFreedomCourse: false, //显示自由排课

            canClick: true, //是否可以点击

            shwoMoreButton: false, //展示更多按钮
            showBatchOper: false, //批量操作按钮
            showWillLock: false, //显示小锁
            showWillChoice: false, //显示选择图标
            showWillWaitingListChoice: false, //显示待排选择按钮
            showWillCopy: false, //显示复制按钮
            showWillStrike: false, //显示删除按钮
            indeterminate: true,
            checkAll: false,
            checkChoiceAll: false,
            plainOptions: [],
            plainOptionsWeek: [], //课节名称
            plainOptionsWeekValue: [], //课节value值
            weekDayRow: '',
            choiceClassCourse: [], //课节节次

            showWillDelete: false, //显示小垃圾桶
            deleteType: [1], //选择删除的类型

            showExchangeClassTable: false, //展示调课换课表格

            resultId: '', //存取当前换课的id
            studentGroupId: '', //存取当前换课的班级id

            exchangeList: [], //换课选择的课程
            conflict: '', //是否冲突，0: 可以调换，1: 老师冲突, 2: 规则冲突
            conflictResult: '', //冲突结果提示
            fetErrorMessageModel: {}, //规则校验失败的提示详情
            showExchangeResult: false, //显示换课结果
            checkRules: false, //是否校验规则

            showLoading: true, //是否显示loading
            lastPublish: false, //当前版本是否发布
            isHistoryPublish: false, //是否是历史发布版本
            isNewPublish: false, //是否是最新发布版本

            filterOption: 'teacher', //搜索条件筛选
            showMoreCondition: false, //展示更多的筛选条件

            selectTeacher: [], //按照教师进行筛选
            selectStudent: [], //按照学生进行筛选
            activityName: '', //按照活动名称进行筛选
            selectAddress: [], //按照场地进行筛选

            saveActiveClassId: '', //保存调换课的id
            saveDeleteDate: '', //保存将要删除的日期
            confirmDeletePop: false, //确定删除的pop隐藏
            isCanDelete: false, //是否可以确认删除

            saveAddressResult: [], //场地搜索结果
            saveTeacherResult: [], //教师搜索结果
            editVersionVisible: false, // 编辑版本名称弹窗显示状态
            courseDetail: '', // 课表传入的课程详情
            cardUtil: '', // 当前点击课程
            lockGray: true,
            filterDisable: false, // 更多筛选禁用状态
            lastPublishVer: false, // 是否是最新发布
            published: false, // 是否已发布
            versionInfo: null, // 版本信息
            editNameStatus: false, // 编辑版本名称状态
            versionName: '', // 版本名称编辑
            canClick: true,
            changeVersionVisible: false,
            notShowWillCard: false, // 控制待排区双击中间转待排卡片显示状态

            willCourseId: '', // 待排选中课程id
            willGroupId: '', // 待排选中班级id
            childSearchIndex: '', // 不同视角的枚举值
            childSearchLabel: '', // 不同视角名称
            acLoading: false, // 中间课程详情loading状态
            changeVersionLoading: false, // 切换版本待排loading状态
            detailId: '', // 存储单击课程的id
            willCardLight: true, // 待排课程卡片选中状态边框
            courseFirstId: '',
            isNewest: '', // 判断是否为最新版本
            isHigh: false, // 判断当前点击的是否是高中视角
            customGrade: '', // 自定义筛选条件值
            customGroup: '',
            customTeacher: '',
            customAddress: '',
            customStudent: '',
            studentGroup: '',
            isDoubleClick: false, // 是否双击待排课程
            ifExchangeLoading: false, // 调换课请求调换组件loading
            ifMoveLoading: false,
            isFull: false, // 全屏状态
            firstWillCardUtil: '',
            activeTabAndTypeAndId: '', // 冲突原因点击不排课规则信息
            versionContrastVisible: false, // 版本对比显示状态

            studentGroupIdList: [],
            // scheduleDataId:[],

            tableTimeLine: localStorage.getItem('timeLine')
                ? JSON.parse(localStorage.getItem('timeLine'))
                : [
                      { start: '08' },
                      { start: '09' },
                      { start: '10' },
                      { start: '11' },
                      { start: '12' },
                      { start: '13' },
                      { start: '14' },
                      { start: '15' },
                      { start: '16' },
                      { start: '17' },
                      { start: '18' },
                  ],
            startTimeOfDay: Number(localStorage.getItem('startNum'))
                ? Number(localStorage.getItem('startNum'))
                : 8,
            endTimeOfDay: Number(localStorage.getItem('endNum'))
                ? Number(localStorage.getItem('endNum'))
                : 18,

            showCheckPopover: false, // 检查气泡显示状态
            publishSourse: '', // 公布版本涉及课表的版本id
            publishTarget: '',
            publishWeekVersion: '',
            originPublish: false, // 是否在公布课表查看变动
            originPublishConflict: false, // 是否在公布课表检查
            showCrateTip: false,
            mainstartDate: '',
            payloadTime: '',

            exposeModal: false, // 导出课表弹层显隐
            importModal: false, // 导入课表弹层显隐
            scheduleGroupIdList: [], // 初始班级id
            scheduleObjectList: [],
            idNum: '', // 导出课表的数量
            textType: '', // 导出课表的文案

            targetLessonId: -1, //调整到的作息详情id(调整节次必传)
            selectLessons: 1,
            selectWeekday: 0, //批量调整所选weekDay
            clickBatchOperButtonKey: '', //批量 0: 批量锁定  1；批量调整节次 2:批量删除 3: 批量转待排 4：批量复制
            targetChecked: false,
            ifLockAll: false, //判断是否触发全部锁定
            unLock: false,
            weekDayRowList: [], //周一到周日的索引
            deleteLoading: false,
            loadingMsg: '',
            changeVisible: false,
            selectValue: '',
            sessionValueLeft: undefined,
            sessionValueRight: undefined,
            changeClassType: 1,
            showWillChangeClass: false,

            modalValue: 1,
            classValue: '',
            sequenceString1: '',
            sequenceString2: '',
            weekdayString1: '',
            weekdayString2: '',

            errorMessage: '',

            formatCourseBySubject: [],
            formatAllStageGrade: [],
            gradeTreeKeys: [],

            takePartClassVisible: false,
            importActivityVisible: false,
        };
        this.ref = null;
    }

    componentDidMount() {
        this.getSemester();
        this.getStageAndGrade();
        this.getCourse();
        this.getCourseBySubject();
        this.getTeacherList();
        this.getStudentList();
        this.getAddressList();
        this.getTimeGradeList(); // 新建课表年级筛选
        this.getOrgTeacherList();
        this.getSubjectList();
        this.getCurrentWeek(new Date().getTime());
        this.getCurrentLang();
    }

    // 获取当前语言
    getCurrentLang = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'global/setCurrentLang',
        });
    };

    //获取自定义班级
    getGroupList = () => {
        const { dispatch } = this.props;
        const { currentVersion } = this.state;
        const { isCustom, studentViewGrade } = this.childTable.state;
        const params = {
            versionId: currentVersion,
        };
        if (!isCustom) {
            params.gradeIds = studentViewGrade;
        }
        dispatch({
            type: 'timeTable/findGroup',
            payload: params,
        });
    };

    // 获取自定义年级
    getGradeList = () => {
        const { dispatch } = this.props;
        const { currentVersion } = this.state;
        dispatch({
            type: 'timeTable/findGrade',
            payload: {
                versionId: currentVersion,
            },
        });
    };
    // 获取自定义学生
    getCustomStudentList = () => {
        const { dispatch } = this.props;
        const { currentVersion } = this.state;
        const { isCustom, studentViewGrade, studentViewGroup } = this.childTable.state;
        const params = {
            versionId: currentVersion,
        };
        if (!isCustom) {
            params.gradeIds = studentViewGrade;
            params.groupIds =
                studentViewGroup == trans('course.plan.class', '全部班级') ? [] : studentViewGroup;
        }

        dispatch({
            type: 'timeTable/findStudentResult',
            payload: params,
        });
    };

    // 单击课程获取详情
    fetchCourseDetail = (
        id,
        type,
        util,
        studentGroupId,
        action,
        studentGroup,
        firstWillArrangeCourse
    ) => {
        const { dispatch } = this.props;
        // 点击的是眼保健操或午餐，或者 非圈起来的空格子时 return
        if (util && util.type === 0) {
            return;
        }

        // 操作转待排时，区域存储待排列表第一个课
        if (type == 2) {
            if (!firstWillArrangeCourse) {
                firstWillArrangeCourse = this.getFirstWillArrangeCourse()[0];
            }
            let courseDetail = {};
            if (firstWillArrangeCourse) {
                courseDetail = {
                    ...firstWillArrangeCourse.detail,
                    acId: firstWillArrangeCourse.detail.id,
                    assistantTeachers: firstWillArrangeCourse.assistantTeachers,
                    mainTeachers: firstWillArrangeCourse.mainTeachers,
                    studentGroups: firstWillArrangeCourse.studentGroups,
                    compareGroupIdList: firstWillArrangeCourse.detail.compareGroupIdList,
                };
            }
            dispatch({
                type: 'timeTable/setCourseDetail',
                payload: { ...courseDetail },
            }).then(() => {
                if (action == 'click') {
                    this.getCourseDetail(courseDetail, util, studentGroupId, studentGroup);
                }
            });
        } else if (type == 1) {
            dispatch({
                type: 'timeTable/lookCourseDetail',
                payload: {
                    id,
                    type: type,
                },
            }).then(() => {
                // action == 'click'为单击查看详情触发，非编辑后load
                if (action == 'click') {
                    const { courseDetail } = this.props;
                    this.getCourseDetail(courseDetail, util, studentGroupId, studentGroup);
                }
            });
        }
    };

    // 存储详情信息
    getCourseDetail = (courseDetail, util, studentGroupId, studentGroup) => {
        const { searchIndex } = this.childTable && this.childTable.state;
        if (studentGroup) {
            studentGroup.view =
                searchIndex === 0
                    ? 'group'
                    : searchIndex === 1
                    ? 'grade'
                    : searchIndex === 2
                    ? 'student'
                    : searchIndex === 3
                    ? 'teacher'
                    : searchIndex === 4
                    ? 'address'
                    : studentGroup.view;
        }
        this.setState({
            courseDetail,
            cardUtil: util,
            studentGroupId: studentGroupId ? studentGroupId : this.state.studentGroupId,
            studentGroup: studentGroup,
        });
    };

    // 改变待排课程的是否双击状态
    setIsDoubleClick = () => {
        this.setState({
            isDoubleClick: true,
        });
    };
    // 改变待排课程的是否双击状态
    setIsDoubleClickFalse = () => {
        this.setState({
            isDoubleClick: false,
        });
    };

    //获取待排课课程列表（左侧课程列表）
    fetchCourseList = (isNoFetch, type) => {
        const { dispatch } = this.props;
        if (isNoFetch) {
            dispatch({
                type: 'timeTable/setCourseList',
                payload: this.getSetCourseListPayload(type),
            });
        } else {
            const { currentVersion, gradeValue, willCourseId, willGroupId } = this.state;
            dispatch({
                type: 'timeTable/fetchCourseList',
                payload: {
                    versionId: currentVersion,
                    // courseId: willCourseId || null,
                    gradeIds: gradeValue,
                    groupIds: willGroupId ? [willGroupId] : null,
                },
            });
        }
    };

    //获取待排区域相关数据
    getshowAcCourseList = (isFirstScreenLoading, isNoFetch, type, isClickList) => {
        this.setState({
            detailId: '',
        });
        if (isFirstScreenLoading) {
            this.getWillCourseList(); //获取待排区域课程
            this.getWillGroupList(); //获取待排班级
        }
        this.fetchWillArrangeList(isNoFetch, type, isFirstScreenLoading, isClickList); // 获取中间部分
        this.fetchCourseList(isNoFetch, type); // 左侧
    };

    // 获取待排课程班级
    getWillGroupList = () => {
        const { dispatch } = this.props;
        const { currentVersion, willCourseId, gradeValue } = this.state;
        dispatch({
            type: 'timeTable/getWillGroupList',
            payload: {
                versionId: currentVersion,
                courseId: willCourseId,
                gradeIdListString: gradeValue.length > 0 ? gradeValue.join(',') : undefined,
            },
        });
    };

    //获取待排区域课程
    getWillCourseList = () => {
        const { dispatch } = this.props;
        const { currentVersion, gradeValue } = this.state;
        dispatch({
            type: 'timeTable/showAcCourseList',
            payload: {
                versionId: currentVersion,
                gradeIds: gradeValue,
            },
        });
    };

    // 清空detailId，用来请求待排第一个
    setDetailId = () => {
        this.setState({
            detailId: '',
        });
    };

    // 获取待排课程详情列表（中间部分）
    // isNoFetch 不请求接口 type 操作是增加还是减少
    fetchWillArrangeList = (isNoFetch, type, isFirstScreenLoading, isClickList) => {
        const { dispatch } = this.props;
        const { currentVersion, gradeValue, willCourseId, willGroupId } = this.state;
        this.setState({
            acLoading: true,
        });
        let payload = {};
        if (willGroupId) {
            payload = {
                versionId: currentVersion,
                courseId: willCourseId,
                groupId: willGroupId,
            };
        } else {
            payload = {
                versionId: currentVersion,
                courseId: willCourseId,
                gradeIds: gradeValue,
            };
        }
        let afterFetchArrangeDetailFunc = () => {
            const { detailId } = this.state;

            let courseList = this.getFirstWillArrangeCourse();

            // 判断课表是否有选中项，没有请求待排第一条
            let id = detailId ? detailId : (courseList[0] && courseList[0].detail.id) || '';
            let cardUtil = detailId
                ? detailId
                : (courseList[0] && courseList[0].detail) || this.state.cardUtil;
            let type = detailId ? 1 : 2;

            this.setState({
                courseFirstId: courseList[0] && courseList[0].detail.id,
                acLoading: false,
                cardUtil,
                firstWillCardUtil: courseList[0] && courseList[0].detail,
            });
            this.getArrangeListFirst(id, type, _, _, _, _, courseList[0]);
        };
        if (isNoFetch) {
            dispatch({
                type: 'timeTable/setArrangeDetail',
                payload: this.getSetArrangeDetailPayload(type),
            }).then(afterFetchArrangeDetailFunc);
        } else {
            dispatch({
                type: 'timeTable/fetchArrangeDetail',
                payload,
            }).then(afterFetchArrangeDetailFunc);
        }

        //刷新课节视图
        const { tableView } = this.props;
        if (tableView === 'weekLessonView' && !isFirstScreenLoading && !isClickList) {
            this.getLessonViewMsg();
        }
    };

    // 请求待排第一个
    getArrangeListFirst = (
        id,
        type,
        util,
        studentGroupId,
        action,
        studentGroup,
        firstWillArrangeCourse
    ) => {
        const { courseFirstId, firstWillCardUtil } = this.state;
        const { saveWillDetailId } = this.will;
        let newId = id ? id : courseFirstId;
        typeof saveWillDetailId === 'function' && saveWillDetailId.call(this, newId);
        this.fetchCourseDetail(
            newId,
            type,
            util,
            studentGroupId,
            action,
            studentGroup,
            firstWillArrangeCourse
        );
        // 请求待排第一个时将待排第一个detail赋值给cardUtil
        if (!id && type == 2) {
            this.transmitState(firstWillCardUtil);
        }
    };

    // 获取待排课程和班级选中id
    getCourseAndGroup = (courseId, groupId, isClickList) => {
        this.setState(
            {
                willCourseId: courseId,
                willGroupId: groupId,
                detailId: '',
            },
            () => {
                this.getWillGroupList(); //获取待排课程班级
                this.fetchWillArrangeList(undefined, undefined, undefined, isClickList); // 获取中间部分
                if (!isClickList) {
                    this.fetchCourseList(); // 左侧
                }
            }
        );
    };

    setCardUtil = () => {
        const cardUtil = this.childTable.state && this.childTable.state.tableCardUtil;
        return cardUtil;
    };

    getWillCardUtil = () => {
        const willCardDetail = this.will.state && this.will.state.willCardDetail;
        return willCardDetail;
    };

    setShowExchangeClassTable = () => {
        this.setState({
            showExchangeClassTable: true,
            courseValue: [],
            selectTeacher: [],
            selectStudent: [],
            activityName: '',
            selectAddress: [],
            showMoreCondition: false,
        });
    };
    setNotShowExchangeClassTabl = () => {
        this.setState({
            showExchangeClassTable: false,
        });
    };

    // 换课后回到原来界面
    showTable = async (action, lessonRelateInfo) => {
        const { searchIndex, searchlabel } = this.childTable.state;
        await this.setState(
            {
                showExchangeClassTable: false,
                isDoubleClick: false,
                childSearchIndex: searchIndex,
                childSearchLabel: searchlabel,
            },
            () => {
                this.handleSearchIndex(action); // 控制显示视角
                //如果action等于clickSelf, 表示双击进行调换课之后又再次点击自己，这时不进行表的刷新
                /* if (action !== 'clickSelf') {
                    this.dealCustomChange(action, lessonRelateInfo);
                } */
                this.dealCustomChange(action, lessonRelateInfo);
            }
        );
        if (action === 'moveChange' || action === 'clickChange' || action === 'clickSelf') {
            const {
                sourceGroupIdList = [],
                sourceLesson,
                sourceWeekDay,
                targetGroupIdList = [],
                targetLesson,
                targetWeekDay,
            } = lessonRelateInfo;

            const sourceEle = document.getElementById(
                `data-${
                    sourceGroupIdList[sourceGroupIdList.length - 1]
                }-${sourceLesson}-${sourceWeekDay}`
            );
            const targetEle = document.getElementById(
                `data-${
                    targetGroupIdList[targetGroupIdList.length - 1]
                }-${targetLesson}-${targetWeekDay}`
            );

            sourceEle &&
                sourceEle.scrollIntoView({
                    // behavior: 'smooth',
                });
            if (action !== 'clickSelf') {
                sourceEle && sourceEle.classList.add('flash');
                targetEle && targetEle.classList.add('flash');
            }
        }
    };
    setLock = (type) => {
        if (type === 'lockOn') {
            this.setState({
                lockGray: true,
            });
        } else if (type === 'lockOff') {
            this.setState({
                lockGray: false,
            });
        }
    };
    // 转待排后回到原来页面
    willShowTable = (action) => {
        this.setState(
            {
                showExchangeClassTable: false,
            },
            () => {
                this.handleSearchIndex(action);
                const { currentVersion } = this.state;
                const { dispatch } = this.props;
                dispatch({
                    type: 'timeTable/fetchCourseList',
                    payload: {
                        versionId: currentVersion,
                    },
                    onSuccess: () => {},
                });
            }
        );
    };

    //获取学期
    getSemester() {
        const { dispatch } = this.props;
        try {
            if (!isEmpty(courseIndex_semesterModels)) {
                dispatch({
                    type: 'time/getCourseIndexSemesterList',
                    payload: courseIndex_semesterModels,
                });
            } else {
                dispatch({
                    type: 'time/getSemesterList',
                    payload: {},
                });
            }
        } catch {
            dispatch({
                type: 'time/getSemesterList',
                payload: {},
            });
        }

        this.setState({
            currentDate: new Date().getTime(),
        });
    }

    getSemesterByTime() {
        const { dispatch } = this.props;
        let time = this.state.mainstartDate
            ? this.state.mainstartDate
            : this.getLocalTime(this.state.startTime, 4);
        dispatch({
            type: 'time/getSemesterListByTime',
            payload: {
                time,
            },
        }).then(() => {
            const { semesterListByTime } = this.props;
            this.setState({
                semesterValue: semesterListByTime.id,
                payloadTime: time,
            });
        });
    }

    //获取年级
    getTimeGradeList() {
        const { dispatch } = this.props;
        try {
            if (!isEmpty(courseIndex_teachingOrgOutputModelList)) {
                dispatch({
                    type: 'time/getCourseIndexGradeList',
                    payload: courseIndex_teachingOrgOutputModelList,
                });
            } else {
                dispatch({
                    type: 'time/getGradeList',
                    payload: {},
                });
            }
        } catch {
            dispatch({
                type: 'time/getGradeList',
                payload: {},
            });
        }
    }

    // 获取学段年级
    async getStageAndGrade() {
        const { dispatch } = this.props;
        try {
            if (!isEmpty(courseIndex_stageAndGradeOutputModelList)) {
                await dispatch({
                    type: 'time/getCourseIndexAllStageGrade',
                    payload: courseIndex_stageAndGradeOutputModelList,
                });
            } else {
                await dispatch({
                    type: 'time/getAllStageGrade',
                    payload: {},
                });
            }
        } catch {
            await dispatch({
                type: 'time/getAllStageGrade',
                payload: {},
            });
        }
        const { allStageGrade } = this.props;
        this.setState({
            formatAllStageGrade: this.formatStageAndGrade(allStageGrade),
            gradeTreeKeys: allStageGrade.filter((item) => item.id !== 1),
        });
    }

    //获取课程
    getCourse() {
        const { dispatch } = this.props;
        try {
            if (!isEmpty(courseIndex_courseList)) {
                dispatch({
                    type: 'course/getCourseIndexCourseList',
                    payload: courseIndex_courseList,
                });
            } else {
                dispatch({
                    type: 'course/getCourseList',
                    payload: {},
                });
            }
        } catch {
            dispatch({
                type: 'course/getCourseList',
                payload: {},
            });
        }
    }

    //科目-课程级联
    async getCourseBySubject() {
        const { dispatch } = this.props;
        try {
            if (!isEmpty(courseIndex_subjectModelList)) {
                await dispatch({
                    type: 'timeTable/fetchCourseIndexCourseBySubject',
                    payload: courseIndex_subjectModelList,
                });
            } else {
                await dispatch({
                    type: 'timeTable/fetchCourseBySubject',
                    payload: {},
                });
            }
        } catch {
            await dispatch({
                type: 'timeTable/fetchCourseBySubject',
                payload: {},
            });
        }
        const { courseBySubject } = this.props;
        this.setState({
            formatCourseBySubject: this.formatCourseData(courseBySubject),
        });
    }

    //获取教师
    getTeacherList() {
        const { dispatch } = this.props;
        try {
            if (!isEmpty(courseIndex_teacherOutputModelList)) {
                dispatch({
                    type: 'course/getCourseIndexTeacherList',
                    payload: courseIndex_teacherOutputModelList,
                });
            } else {
                dispatch({
                    type: 'course/getTeacherList',
                    payload: {},
                });
            }
        } catch {
            dispatch({
                type: 'course/getTeacherList',
                payload: {},
            });
        }
    }

    //获取学生列表
    getStudentList() {
        const { dispatch } = this.props;
        try {
            if (!isEmpty(courseIndex_studentInfoOutputModelList)) {
                dispatch({
                    type: 'timeTable/getCourseIndexStudentList',
                    payload: courseIndex_studentInfoOutputModelList,
                });
            } else {
                dispatch({
                    type: 'timeTable/getStudentList',
                    payload: {},
                });
            }
        } catch {
            dispatch({
                type: 'timeTable/getStudentList',
                payload: {},
            });
        }
    }

    //获取场地
    getAddressList() {
        const { dispatch } = this.props;
        dispatch({
            type: 'timeTable/getAreaList',
            payload: {},
        });
    }

    // 选择教师组件接口
    getOrgTeacherList = () => {
        const { dispatch } = this.props;
        try {
            if (!isEmpty(courseIndex_listOrgTeacherModels)) {
                dispatch({
                    type: 'global/getCourseIndexTeacherAndOrg',
                    payload: courseIndex_listOrgTeacherModels,
                });
            } else {
                dispatch({
                    type: 'global/fetchTeacherAndOrg',
                    payload: {},
                });
            }
        } catch {
            dispatch({
                type: 'global/fetchTeacherAndOrg',
                payload: {},
            });
        }
    };

    //获取学科列表
    getSubjectList = () => {
        const { dispatch } = this.props;
        try {
            if (!isEmpty(courseIndex_subjectList)) {
                dispatch({
                    type: 'course/getCourseIndexSubjectList',
                    payload: courseIndex_subjectList,
                });
            } else {
                dispatch({
                    type: 'course/getSubjectList',
                    payload: {},
                });
            }
        } catch {
            dispatch({
                type: 'course/getSubjectList',
                payload: {},
            });
        }
    };

    //获取周版本列表
    getVersionList = (type) => {
        const { currentVersion } = this.state;
        //清空调课换课
        this.cancelExchangeCourse();
        //取消锁定版本
        this.setState({
            showWillLock: false,
            showWillDelete: false, //清空删除
            saveActiveClassId: '', //保存调换课的id
            saveDeleteDate: '', //保存将要删除的日期
            confirmDeletePop: false, //确定删除的pop隐藏
            isCanDelete: false,
            deleteType: [1],
        });

        const { dispatch } = this.props;
        dispatch({
            type: 'timeTable/getVersionList',
            payload: {
                startTime: this.state.startTime,
                endTime: this.state.endTime,
                gradeIdList: this.state.gradeValue,
            },
        }).then(() => {
            const { versionList } = this.props;
            //判断之前所选择的版本是否在列表中
            if (!this.judgeCurrentVersion() || type == '调课换课') {
                this.setState(
                    {
                        currentVersion: versionList && versionList[0] && versionList[0].id,
                        currentVersionName: versionList && versionList[0] && versionList[0].name,
                        currentVersionRemark:
                            versionList && versionList[0] && versionList[0].remark,
                        lastPublishVer: versionList && versionList[0] && versionList[0].lastPublish,
                        published: versionList && versionList[0] && versionList[0].published,
                        versionInfo: versionList && versionList[0],
                        isNewest: versionList && versionList[0] && versionList[0].current,
                    },
                    () => {
                        if (type !== 'noRenderSchedule') {
                            this.setVersionCallback();
                            if (!this.state.currentVersion) {
                                this.setState({
                                    arrangeModal: false,
                                });
                            }
                        } else {
                            this.setState({
                                arrangeModal: false,
                            });
                        }
                    }
                );
            } else {
                let current = versionList.filter((item) => item.id == currentVersion); // 获取当前选择版本的name
                this.setState(
                    {
                        currentVersion: currentVersion,
                        currentVersionName: current[0].name,
                        currentVersionRemark: current[0].remark,
                        lastPublishVer: current[0].lastPublish,
                        published: current[0].published,
                        versionInfo: current[0],
                        isNewest: current[0].current,
                    },
                    () => {
                        if (type !== 'noRenderSchedule') {
                            this.setVersionCallback();
                            if (!this.state.currentVersion) {
                                this.setState({
                                    arrangeModal: false,
                                });
                            }
                        } else {
                            this.setState({
                                arrangeModal: false,
                            });
                        }
                    }
                );
            }
        });
    };

    setVersionName = (value) => {
        this.setState({
            currentVersionName: value,
        });
    };

    setVersionRemark = (value) => {
        this.setState({
            currentVersionRemark: value,
        });
    };

    //设置版本之后的回调
    setVersionCallback = async () => {
        const { searchIndex } = this.childTable.state;
        this.setState({
            isShowSetNewVersion: !this.judgeCurrent(this.state.currentVersion, 'current'), //是否设置成最新
            lastPublish: this.judgeCurrent(this.state.currentVersion, 'isPublish'), //当前版本是否已发布
            isHistoryPublish: this.judgeCurrent(this.state.currentVersion, 'isHistory'), //是否是历史版本
            isNewPublish: this.judgeCurrent(this.state.currentVersion, 'isNew'),
        });
        //查询课表内容
        if (searchIndex == 2) {
            this.childTable.confirmStudentView();
        } else if (searchIndex == 3) {
            // 教师视角查询接口
            this.childTable.confirmTeacherView();
        } else {
            this.fetchScheduleList();
        }
        // 自定义请求年级班级学生
        if (this.state.currentVersion) {
            this.getGroupList();
            this.getGradeList();
            this.getshowAcCourseList(true); // 待排区域相关接口
        }
        this.changeVersionCallBack(this.state.currentVersion);
    };

    //判断之前选中的版本是否在版本列表中
    judgeCurrentVersion = () => {
        const { versionList } = this.props;
        const { currentVersion } = this.state;
        let isRight;
        versionList &&
            versionList.length > 0 &&
            versionList.map((item) => {
                if (currentVersion == item.id) {
                    isRight = true;
                }
            });
        return isRight;
    };

    //选择学期
    changeSemester = (value) => {
        this.setState(
            {
                semesterValue: value,
                currentDate: this.getSemesterStartTime(value),
            },
            () => {
                //获取当前周
                this.getCurrentWeek(this.state.currentDate);
            }
        );
    };

    //选择校区
    changeArea = (value) => {};

    //选择年级
    changeGrade = (value) => {
        this.setState(
            {
                gradeValue: value,
            },
            () => {
                let grade = JSON.stringify(this.state.gradeValue);
                localStorage.setItem('gradeValue', grade);
                this.getVersionList();
                this.will.handleAll(); // 选择年级待排课程列表默认显示全部
            }
        );
    };

    //选择课程
    changeCourse = (value) => {
        this.setState(
            {
                courseValue: value,
            },
            () => {
                this.showTable();
            }
        );
    };

    //根据学期id定位开始时间
    getSemesterStartTime = (id) => {
        const { semesterList } = this.props;

        let date;
        semesterList &&
            semesterList.length > 0 &&
            semesterList.map((el, index) => {
                if (el.id == id) {
                    //当前学期的话，定位到本周，若不是，定位到开学第一天的一周
                    date = index == 0 ? new Date().getTime() : el.startTime;
                }
            });
        return date;
    };

    //处理课程数据
    formatCourseData = (courseList) => {
        const { currentLang } = this.props;
        if (!courseList || courseList.length < 0) return;
        let courseData = [];
        courseList.map((item, index) => {
            let obj = {};
            obj.title = currentLang != 'en' ? item.name : item.ename;
            obj.key = 'subject_' + item.id;
            obj.value = 'subject_' + item.id;
            obj.children = this.formatCourseChildren(item.courseList);
            courseData.push(obj);
        });
        return courseData;
    };

    //处理课程子节点
    formatCourseChildren = (arr) => {
        const { currentLang } = this.props;
        if (!arr || arr.length < 0) return [];
        let resultArr = [];
        arr.map((item) => {
            let obj = {
                title: currentLang != 'en' ? item.name : item.englishName,
                value: item.id,
                key: item.id,
            };
            resultArr.push(obj);
        });
        return resultArr;
    };

    //处理年级数据
    formatGrade = (gradeList) => {
        const { currentLang } = this.props;
        if (!gradeList || gradeList.length < 0) return;
        let gradeData = [];
        gradeList.map((item, index) => {
            let obj = {
                title: currentLang != 'en' ? item.orgName : item.orgEname,
                value: item.id,
                key: item.id,
            };
            gradeData.push(obj);
        });
        return gradeData;
    };

    // 处理学段年级数据
    formatStageAndGrade = (list) => {
        const { currentLang } = this.props;
        if (!list || list.length < 0) return;
        let stageAndeGrade = [];
        list.map((item, index) => {
            let obj = {
                title: currentLang != 'en' ? item.stageName : item.stageEname,
                value: item.id,
                key: item.id,
                children: [],
            };
            item.grades.map((el, i) => {
                let childObj = {
                    title: currentLang != 'en' ? el.gradeName : el.gradeEname,
                    value: el.id,
                    key: el.id,
                };
                obj.children.push(childObj);
            });
            stageAndeGrade.push(obj);
        });
        return stageAndeGrade;
    };

    //根据日历定位到当前周
    getCurrentWeek(nowTime) {
        let now = new Date(formatTimeSafari(nowTime)),
            nowStr = now.getTime(),
            day = now.getDay() != 0 ? now.getDay() : 7,
            oneDayLong = 24 * 60 * 60 * 1000;
        let MondayTime = nowStr - (day - 1) * oneDayLong,
            SundayTime = nowStr + (7 - day) * oneDayLong;
        let monday = new Date(formatTimeSafari(MondayTime)).getTime(),
            sunday = new Date(formatTimeSafari(SundayTime)).getTime();
        this.getAlldayTime(monday, sunday);
    }

    //获得当前的00:00:00和23:59:59时间
    getAlldayTime(start, end) {
        let currentDayStart = this.getLocalTime(new Date(formatTimeSafari(start)), 2);
        let currentDayEnd = this.getLocalTime(new Date(formatTimeSafari(end)), 2);
        let startTime = new Date(currentDayStart + ' ' + '00:00:00').getTime();
        let endTime = new Date(currentDayEnd + ' ' + '23:59:59').getTime();
        this.setState(
            {
                startTime: startTime,
                endTime: endTime,
            },
            () => {
                //查询周版本列表
                this.getVersionList();
                this.getSemesterByTime();
                this.getGroupByTree();
                this.getDepartmentList();
            }
        );
    }

    //时间格式化
    getLocalTime(time, type) {
        if (!time) return false;
        var time = new Date(formatTimeSafari(time)),
            y = time.getFullYear(),
            m = time.getMonth() + 1,
            day = time.getDate();
        var MM = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1;
        var DD = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();

        if (type == 1) {
            return y + '年' + m + '月' + day + '日';
        }
        if (type == 2) {
            return y + '/' + m + '/' + day;
        }
        if (type == 3) {
            return m + '月' + day + '日';
        }

        if (type == 4) {
            return y + '-' + MM + '-' + DD;
        }
    }

    //切换周
    checkWeek(type) {
        const { startTime, endTime, currentDate, canClick } = this.state;

        if (!canClick) return false;
        let newStartStr, newEndStr, newCurrent;
        let startTimeStr = new Date(formatTimeSafari(startTime)).getTime(),
            endTimeStr = new Date(formatTimeSafari(endTime)).getTime(),
            currentTime = new Date(formatTimeSafari(currentDate)).getTime();
        if (type == 'left') {
            newStartStr = startTimeStr - 7 * 24 * 60 * 60 * 1000;
            newEndStr = endTimeStr - 7 * 24 * 60 * 60 * 1000;
            newCurrent = currentTime - 7 * 24 * 60 * 60 * 1000;
        }
        if (type == 'right') {
            newStartStr = startTimeStr + 7 * 24 * 60 * 60 * 1000;
            newEndStr = endTimeStr + 7 * 24 * 60 * 60 * 1000;
            newCurrent = currentTime + 7 * 24 * 60 * 60 * 1000;
        }

        this.setState(
            {
                startTime: newStartStr,
                endTime: newEndStr,
                currentDate: newCurrent,
                canClick: false,
                publishModal: false,
                mainstartDate: '',
            },
            () => {
                this.getVersionList();
                this.handleSearchIndex();
                this.getSemesterByTime();
                this.getGroupByTree();
                this.getDepartmentList();
            }
        );
    }

    // 自定义视角切换周回到默认版本
    handleSearchIndex = (action) => {
        const { childSearchIndex, childSearchLabel } = this.state;
        let idx = 0;
        let label = '班级';
        // 自定义视角切换周回到默认版本
        if (childSearchIndex == 5 && !action) {
            idx = 0;
            label = '班级';
        } else {
            idx = childSearchIndex;
            label = childSearchLabel;
        }

        this.childTable.changeSearchIndex &&
            this.childTable.changeSearchIndex(idx, label, action && idx == 5 ? true : false);
    };

    closeChangeModal = () => {
        this.setState({
            changsScheduleModal: false,
        });
    };

    //弹窗消失
    hideModal = (type) => {
        switch (type) {
            case 'createSchedule':
                this.setState({
                    scheduleModal: false,
                });
                break;
            case 'saveVersion':
                this.setState({
                    versionModal: false,
                });
                break;
            case 'importPlan':
                this.setState({
                    importPlanModal: false,
                });
                this.will.changeTab(1);
                break;
            case 'changsSchedule':
                this.setState({
                    changsScheduleModal: false,
                });
                break;
            case 'versionComparison':
                this.setState({
                    versionComparisonModal: false,
                });
                break;
            case 'publishSchedule':
                this.setState({
                    publishModal: false,
                });
                break;
            case 'hideArrange':
                this.setState({
                    arrangeModal: false,
                });
                break;
            case 'rules':
                this.setState({
                    rulesModal: false,
                });
                break;
            case 'copyResult':
                this.setState({
                    copyResultModal: false,
                });
                break;
            case 'clickKey':
                this.setState({
                    clickKeyModal: false,
                });
                break;
            case 'freedomCourse':
                this.setState({
                    showFreedomCourse: false,
                });
                break;
            case 'exposeSchedule':
                this.setState({
                    exposeModal: false,
                });
                break;
            case 'importSchedule':
                this.setState({
                    importModal: false,
                });
                break;

            default:
        }
    };

    //新建课表--弹框显示
    showScheduleModal = () => {
        this.setState({
            scheduleModal: true,
        });
    };

    //保存版本-弹框显示
    saveVersion = () => {
        this.setState({
            versionModal: true,
            shwoMoreButton: false,
        });
    };

    //复制排课结果
    copyResult = () => {
        this.setState({
            copyResultModal: true,
            shwoMoreButton: false,
        });
    };

    exposeSchedule = () => {
        let setValue = (value, searchIndex) => {
            this.setState({
                scheduleObjectList: value.map((item) => {
                    return {
                        scheduleQueryType: searchIndex,
                        scheduleQueryId: item,
                    };
                }),
                idNum: value && value.length,
            });
        };
        const { tableView, mainScheduleData } = this.props;

        if (tableView === 'weekLessonView') {
            const { lessonViewCustomValue, searchParameters, customCourseSearchIndex } = this.props;
            console.log('lessonViewCustomValue :>> ', lessonViewCustomValue);
            console.log('searchParameters :>> ', searchParameters);
            console.log('customCourseSearchIndex :>> ', customCourseSearchIndex);
            console.log('mainScheduleData :>> ', mainScheduleData);
            if (customCourseSearchIndex == 0) {
                setValue(lessonViewCustomValue, 0);
            }
            if (customCourseSearchIndex == 2) {
                if (isEmpty(searchParameters.studentValue.studentViewStudentValue)) {
                    setValue(
                        mainScheduleData.scheduleData?.map((item) => item.studentGroup.id),
                        2
                    );
                } else {
                    setValue(searchParameters.studentValue.studentViewStudentValue, 2);
                }
            }
            if (customCourseSearchIndex == 3) {
                if (isEmpty(searchParameters.teacherValue)) {
                    setValue(
                        mainScheduleData.scheduleData?.map((item) => item.studentGroup.id),
                        3
                    );
                } else {
                    setValue(searchParameters.teacherValue, 3);
                }
            }
            if (customCourseSearchIndex == 4) {
                const { areaList } = this.props;
                if (isEmpty(searchParameters.addressValue)) {
                    setValue(
                        mainScheduleData.scheduleData?.map((item) => item.studentGroup.id),
                        4
                    );
                } else {
                    setValue(searchParameters.addressValue, 4);
                }
            }
        }
        this.setState({
            exposeModal: true,
            shwoMoreButton: false,
        });
    };

    importSchedule = () => {
        this.setState({
            importModal: true,
            shwoMoreButton: false,
        });
    };

    //导入基础课时计划-弹框显示
    importPlanModal = () => {
        if (this.state.lastPublish) {
            //版本已经发布，禁止导入课时计划
            return false;
        }
        this.setState({
            importPlanModal: true,
            shwoMoreButton: false,
        });
    };
    //更改作息表
    changsSchedule = () => {
        this.setState({
            changsScheduleModal: true,
            shwoMoreButton: false,
        });
    };
    //版本对比
    versionComparison = () => {
        this.setState({
            versionComparisonModal: true,
            shwoMoreButton: false,
        });
    };

    //公布课表
    publishScheduleModal = () => {
        if (this.state.lastPublish) {
            //版本已经发布，禁止公布课表
            return false;
        }
        this.setState({
            publishModal: true,
        });
    };

    //一键排课
    showClickKeyModal = () => {
        if (this.state.lastPublish) {
            //版本已经发布，禁止一键排课
            return false;
        }
        if (this.state.showExchangeClassTable) {
            message.info('调课换课进行中，不要一键排课哟~');
            return false;
        }
        this.setState({
            clickKeyModal: true,
        });
    };

    // 版本对比
    showContrastModal = () => {
        return this.setState({
            versionContrastVisible: true,
        });
    };

    // 公布课表查看版本变动
    publishShowContrastModal = async (publishItem) => {
        this.setState({
            versionContrastVisible: true,
            publishSourse: publishItem.sourceVersion,
            publishTarget: publishItem.weekVersionDTO,
            originPublish: true,
        });
    };

    hideContrastModal = () => {
        this.setState({
            versionContrastVisible: false,
            originPublish: false,
            publishTarget: '',
            publishSourse: '',
        });
        const sourceEle = document.getElementsByClassName('sourceEle');
        const targetEle = document.getElementsByClassName('targetEle');

        !isEmpty(sourceEle) &&
            Array.from(sourceEle).forEach((item) => {
                item.classList.remove('sourceEle');
            });

        !isEmpty(targetEle) &&
            Array.from(targetEle).forEach((item) => {
                item.classList.remove('targetEle');
            });
    };

    // 开启规则-弹框显示
    showRulesModal = () => {
        this.setState({
            rulesModal: true,
            activeTabAndTypeAndId: '',
        });
    };

    showRulesModalAndPosition = (mes) => {
        let activeInfo = '2' + '_' + mes.type + '_' + mes.weekRuleId;
        this.setState({
            rulesModal: true,
            activeTabAndTypeAndId: activeInfo,
        });
    };

    //待排课卡片-弹出
    showArrange = () => {
        this.setState({
            arrangeModal: true,
        });
    };

    // 存储单击课表id
    saveDetailId = (
        id,
        type,
        util,
        studentGroupId,
        action,
        studentGroup,
        firstWillArrangeCourse
    ) => {
        this.setState(
            {
                detailId: type === 1 ? id : '',
                willCardLight: type === 2 ? true : false, // 控制待排已排边框显示
            },
            () => {
                const { saveWillDetailId } = this.will;
                if (type === 1) {
                    typeof saveWillDetailId === 'function' && saveWillDetailId.call('');
                }
                if (this.state.willCardLight) {
                    this.getArrangeListFirst(
                        id,
                        2,
                        util,
                        studentGroupId,
                        action,
                        studentGroup,
                        firstWillArrangeCourse
                    ); // 请求待排第一个
                }
            }
        );
    };

    willCardLightState = () => {
        this.setState({
            willCardLight: true,
        });
    };

    //选择版本
    changeVersion = (value, option, type) => {
        const info = type == 'info' ? option : option.props; // 版本编辑中的查看会传入type为info
        const { searchIndex } = this.childTable.state;

        if (searchIndex == 5) {
            this.handleSearchIndex();
        }
        this.setState(
            {
                currentVersion: value,
                currentVersionName: info.name,
                currentVersionRemark: info.remark,
                lastPublishVer: info.lastPublish,
                published: info.published,
                versionInfo: info.versionInfo,
                isNewest: info.current,
                changeVersionLoading: true,
            },
            async () => {
                this.setState({
                    isShowSetNewVersion: !this.judgeCurrent(value, 'current'), //是否设置成最新
                    lastPublish: this.judgeCurrent(value, 'isPublish'), //当前版本是否已发布
                    isHistoryPublish: this.judgeCurrent(value, 'isHistory'), //是否是历史版本
                    isNewPublish: this.judgeCurrent(value, 'isNew'), //是否是最新版本
                });

                //查询课表
                if (searchIndex == 2) {
                    this.childTable.confirmStudentView();
                } else if (searchIndex == 3) {
                    // 教师视角查询接口
                    this.childTable.confirmTeacherView();
                } else {
                    this.fetchScheduleList();
                }
                //查询待排课
                this.fetchCourseList();
                //清空调课换课
                this.cancelExchangeCourse();
                // 查询待排课程
                this.getshowAcCourseList(true);
                // 自定义请求年级班级学生
                this.getGroupList();
                this.getGradeList();
                // this.getCustomStudentList();
                //取消锁定版本
                this.setState({
                    showWillLock: false, //取消锁定版本
                    showWillDelete: false, //清空批量删除
                    saveActiveClassId: '', //保存调换课的id
                    saveDeleteDate: '', //保存将要删除的日期
                    confirmDeletePop: false, //确定删除的pop隐藏
                    isCanDelete: false,
                    deleteType: [1],
                    changeVersionLoading: false,
                    studentGroupId: '',
                });

                this.changeVersionCallBack(value);
            }
        );
    };

    //判断是否是当前版本
    judgeCurrent = (id, type) => {
        const { versionList } = this.props;
        let isCurrent = false;
        let isPublish = false;
        let isHistory = false;
        let isNew = false;
        versionList &&
            versionList.length > 0 &&
            versionList.map((el) => {
                if (el.id == id) {
                    isCurrent = el.current; //--是否是当前版本
                    isPublish = el.lastPublish || el.published === 1;
                    isHistory = el.published; //--是否发布
                    isNew = el.lastPublish; //当前版本是否已发布
                }
            });
        if (type == 'current') {
            return isCurrent;
        } else if (type == 'isPublish') {
            return isPublish;
        } else if (type == 'isHistory') {
            return isHistory;
        } else if (type == 'isNew') {
            return isNew;
        }
    };

    //设为最新版本
    setNewVersion = () => {
        const { dispatch } = this.props;
        let self = this;
        confirm({
            title: '您确定将所选版本设置为当前课表吗',
            okText: '继续',
            cancelText: '放弃',
            onOk() {
                dispatch({
                    type: 'timeTable/setNewVersion',
                    payload: {
                        id: self.state.currentVersion,
                    },
                    onSuccess: () => {
                        self.getVersionList('noRenderSchedule');
                        self.setState({
                            isShowSetNewVersion: false,
                        });
                    },
                });
            },
        });
    };

    //查询课程表
    fetchScheduleList = () => {
        const { dispatch } = this.props;
        const {
            currentVersion,
            gradeValue,
            courseValue,
            selectTeacher,
            selectStudent,
            activityName,
            selectAddress,
            startTimeOfDay,
            endTimeOfDay,
        } = this.state;
        const {
            searchIndex,
            searchlabel,
            customGrade,
            customGroup,
            customTeacher,
            customAddress,
            customStudent,
        } = this.childTable.state;
        this.setState({
            showLoading: true,
            childSearchIndex: searchIndex,
            childSearchLabel: searchlabel,
        });
        if (searchIndex == 0 || searchIndex == 1) {
            //按场地查询
            this.fetchAddressResult();
            //按教师查询
            this.fetchTeacherResult();
        } else {
            this.setState({
                saveAddressResult: [],
                saveTeacherResult: [],
            });
        }
        if (searchIndex == 2) {
            this.setState({
                showLoading: false,
            });
            this.childTable.confirmStudentView();
            return;
        }

        if (searchIndex == 3) {
            this.setState({
                showLoading: false,
            });
            this.childTable.confirmTeacherView();
            return;
        }
        dispatch({
            type: 'timeTable/fetchScheduleList',
            payload: {
                id: currentVersion, //版本id
                gradeIdList: gradeValue, //年级id
                courseIds: courseValue, //课程id
                teacherIds: selectTeacher, //老师id
                studentIds: selectStudent, //学生id
                freeName: activityName, //活动主题
                playgroundIds: selectAddress, //场地id
                startTimeOfDay,
                endTimeOfDay,
                // 是新增属性
                searchIndex: searchIndex || 0, // 默认是班级
            },
            onSuccess: () => {
                this.setState(
                    {
                        canClick: true,
                        showLoading: false,
                    },
                    () => {
                        if (searchIndex == 1) {
                            this.setState({
                                isHigh: true,
                            });
                        } else {
                            this.setState({
                                isHigh: false,
                            });
                        }
                        let scheduleGroupIdList = [];
                        this.props.scheduleData &&
                            this.props.scheduleData.length > 0 &&
                            this.props.scheduleData.map((item, index) => {
                                scheduleGroupIdList.push(item.studentGroup.id);
                            });
                        this.setState(
                            {
                                scheduleGroupIdList,
                            },
                            () => {
                                if (searchIndex !== 5) this.setScheduleGroupIdList();
                            }
                        );
                    }
                );
            },
        });
    };

    updateScheduleList = () => {
        const { tableView } = this.props;
        this.fetchScheduleList();
        if (tableView === 'weekLessonView') {
            this.getLessonViewMsg();
        }
    };

    clearScheduleGroupIdList = () => {
        this.setState({
            scheduleObjectList: [],
        });
    };
    setScheduleGroupIdList = (type) => {
        const { searchIndex, scheduleStudentIdList, scheduleTeacherIdList } = this.childTable.state;
        const { customGrade, customGroup, customTeacher, customAddress, customStudent } =
            this.state;
        let customSearchIndex =
            this.childTable.childCustom && this.childTable.childCustom.state.customSelectValue;
        let index = '';
        if (customSearchIndex == 0) {
            index = 3;
        } else if (customSearchIndex == 1) {
            index = 4;
        } else if (customSearchIndex == 2) {
            index = 1;
        } else if (customSearchIndex == 3) {
            index = 0;
        } else if (customSearchIndex == 4) {
            index = 2;
        }
        let scheduleObjectList = [];

        let id =
            searchIndex == 2
                ? scheduleStudentIdList
                : searchIndex == 3
                ? scheduleTeacherIdList
                : searchIndex == 0 || searchIndex == 1 || searchIndex == 4
                ? this.state.scheduleGroupIdList
                : null;
        id &&
            id.length > 0 &&
            id.map((item, index) => {
                let scheduleObject = {};
                scheduleObject.scheduleQueryType = searchIndex !== 5 ? searchIndex : index;
                scheduleObject.scheduleQueryId = item;
                scheduleObjectList.push(scheduleObject);
            });
        this.setState({
            scheduleObjectList,
            idNum: id && id.length,
            textType:
                searchIndex == 0
                    ? '班级'
                    : searchIndex == 1
                    ? '年级'
                    : searchIndex == 2
                    ? '学生'
                    : searchIndex == 3
                    ? '教师'
                    : searchIndex == 4
                    ? '场地'
                    : searchIndex == 5
                    ? '自定义'
                    : '',
        });
    };

    //按照教师查询课表的结果
    fetchTeacherResult() {
        const { dispatch } = this.props;
        const { currentVersion, selectTeacher, gradeValue } = this.state;
        if (selectTeacher.length == 0) {
            //清空教师结果
            this.setState({
                saveTeacherResult: [],
            });
            return false;
        }
        this.setState({
            showLoading: true,
        });
        dispatch({
            type: 'timeTable/fetchTeacherResult',
            payload: {
                id: currentVersion, //版本id
                gradeIdList: gradeValue, //年级id
                teacherIds: selectTeacher, //教师id
            },
            onSuccess: () => {
                const { teacherResult } = this.props;
                this.setState({
                    showLoading: false,
                    saveTeacherResult: teacherResult,
                });
            },
        });
    }

    //按照场地查询课表的结果
    fetchAddressResult() {
        const { dispatch } = this.props;
        const { currentVersion, gradeValue, selectAddress } = this.state;
        if (selectAddress.length == 0) {
            //清空场地结果
            this.setState({
                saveAddressResult: [],
            });
            return false;
        }
        this.setState({
            showLoading: true,
        });
        dispatch({
            type: 'timeTable/fetchAddressResult',
            payload: {
                id: currentVersion, //版本id
                gradeIdList: gradeValue, //年级id
                playgroundIds: selectAddress, //场地id
            },
            onSuccess: () => {
                const { addressResult } = this.props;
                this.setState({
                    showLoading: false,
                    saveAddressResult: addressResult,
                });
            },
        });
    }

    //新建自由排课
    createFreedomCourse = () => {
        const { published, lastPublishVer } = this.state;
        if (published == 1 || lastPublishVer) {
            this.setState({
                showCrateTip: true,
            });
        }
        this.setState({
            showFreedomCourse: true,
        });
    };

    toggleImportActivityVisible = () => {
        const { importActivityVisible } = this.state;
        this.setState({
            importActivityVisible: !importActivityVisible,
        });
    };

    tipCloseHandle = () => {
        this.setState({
            showCrateTip: false,
        });
    };

    //选择时间
    changeDatePicker = (date, dateString) => {
        let str = dateString.replace(/-/g, '/');
        let dateChange = new Date(str).getTime();
        const { searchIndex } = this.childTable.state;
        if (searchIndex == 5) {
            this.handleSearchIndex();
        }
        this.setState(
            {
                currentDate: dateChange,
                publishModal: false,
                mainstartDate: dateString,
            },
            () => {
                this.getCurrentWeek(this.state.currentDate);
            }
        );
    };

    //查看更多的按钮
    handleMoreVisible = (visible) => {
        this.setState({
            shwoMoreButton: visible,
        });
    };

    //批量操作的按钮
    handleBatchVisible = (visible) => {
        this.setState({
            showBatchOper: visible,
        });
    };

    // 检查
    handleCheckVisible = () => {
        this.setState({
            showCheckPopover: true,
        });
    };

    publishShowConflict = (item) => {
        this.setState({
            showCheckPopover: true,
            originPublishConflict: true,
            publishWeekVersion: item.weekVersionDTO.id,
        });
    };

    closeCheckVisible = (e) => {
        e.stopPropagation();
        this.setState({
            showCheckPopover: false,
            originPublishConflict: false,
            publishWeekVersion: '',
        });
    };

    //调课换课的可换展示
    exchangeClass = (id, studentGroupId, index) => {
        const { dispatch } = this.props;
        const { currentVersion } = this.state;
        let _this = this;
        this.setState(
            {
                resultId: id, //存取当前换课的id
                studentGroupId,
                ifExchangeLoading: true,
                showLoading: true,
            },
            () => {
                dispatch({
                    type: 'timeTable/newExchangeClass',
                    payload: {
                        resultId: id, //结果id
                        studentGroupId, //班级id
                        versionId: currentVersion, //版本id
                        changeCourse: false,
                    },
                    onSuccess: () => {
                        _this.setState({
                            studentGroupId,
                            showExchangeClassTable: true,
                            notShowWillCard: false,
                            ifExchangeLoading: false,
                            canFetch: true,
                        });
                        this.renderExchangeCustom(index);
                        this.childTable.changeSearchIndex &&
                            this.childTable.changeSearchIndex(5, '自定义', true);
                    },
                    onError: (response) => {
                        this.setState({
                            canFetch: false,
                        });
                    },
                }).then(() => {
                    this.setState({
                        ifExchangeLoading: false,
                        showLoading: false,
                    });
                });
            }
        );
    };

    renderExchangeCustom = (index) => {
        const { dispatch, scheduleData } = this.props;
        const { childSearchIndex } = this.state;
        const newScheduleData = [];
        newScheduleData.push(scheduleData[index]);
        for (let i = 0; i < scheduleData.length; i++) {
            let canClose = scheduleData[i].studentGroup.canClose;
            if (canClose) {
                newScheduleData.push(scheduleData[i]);
            }
        }
        dispatch({
            type: 'timeTable/getExchangeGroupInfo',
            payload: {
                exchangeScheduleData: newScheduleData,
                searchIndex: childSearchIndex,
            },
        });
    };

    // 获取数组相同元素
    getArrEqual(arr1, arr2) {
        let newArr = [];
        for (let i = 0; i < arr2.length; i++) {
            for (let j = 0; j < arr1.length; j++) {
                if (arr1[j].studentGroup.id == arr2[i]) {
                    let obj = {};
                    obj.result = arr1[j];
                    obj.id = arr2[i];
                    newArr.push(obj);
                }
            }
        }
        return newArr;
    }

    // 待排课 可移动
    willMoveClass = (id) => {
        const { dispatch, scheduleData } = this.props;
        const { searchIndex } = this.childTable.state;
        this.setState({
            showLoading: true,
        });
        return dispatch({
            type: 'timeTable/newCheckScheduleList',
            payload: {
                id: id,
            },
            onSuccess: async () => {
                const { newCanCheckScheduleList } = this.props;
                let groupId = null;
                let status = false;
                let studentGroup = this.state.studentGroup;
                if (
                    newCanCheckScheduleList[0].correctGroupIdList instanceof Array &&
                    newCanCheckScheduleList[0].correctGradeIdList instanceof Array
                ) {
                    if (
                        searchIndex === 0 &&
                        newCanCheckScheduleList[0].correctGroupIdList.length > 0
                    ) {
                        // 班级视角
                        // 获取课表list与班级idlist相同部分
                        const equal = this.getArrEqual(
                            scheduleData,
                            newCanCheckScheduleList[0].correctGroupIdList
                        );
                        if (!equal.length) {
                            groupId = newCanCheckScheduleList[0].correctGroupIdList[0];
                            await this.getCustomResult(
                                newCanCheckScheduleList[0].correctGroupIdList[0],
                                'group',
                                '双击调换班级'
                            );
                        } else {
                            groupId = equal[0].id;
                            studentGroup = equal[0].result.studentGroup;
                            status = true;
                        }
                    } else if (
                        searchIndex == 1 &&
                        newCanCheckScheduleList[0].correctGradeIdList.length > 0
                    ) {
                        // 年级视角
                        // 获取课表list与年级idlist相同部分
                        const equal = this.getArrEqual(
                            scheduleData,
                            newCanCheckScheduleList[0].correctGradeIdList
                        );
                        if (!equal.length) {
                            // 若课表中不存在list中的id,请求年级第一个
                            groupId = newCanCheckScheduleList[0].correctGradeIdList[0];
                            await this.getCustomResult(
                                newCanCheckScheduleList[0].correctGradeIdList[0],
                                'grade',
                                '双击调换年级'
                            );
                        } else {
                            // 取相同年级id第一个
                            groupId = equal[0].id;
                            studentGroup = equal[0].result.studentGroup;
                            status = true;
                        }
                    } else {
                        // 自定义视角，判断课表中是否有相应班级id,没有判断是否有年级id
                        const groupIdList = this.getArrEqual(
                            scheduleData,
                            newCanCheckScheduleList[0].correctGroupIdList
                        );
                        if (groupIdList.length > 0) {
                            groupId = groupIdList[0].id;
                            studentGroup = groupIdList[0].result.studentGroup;
                            status = true;
                        }
                        if (!status) {
                            const gradeIdList = this.getArrEqual(
                                scheduleData,
                                newCanCheckScheduleList[0].correctGradeIdList
                            );
                            if (gradeIdList.length > 0) {
                                groupId = gradeIdList[0].id;
                                studentGroup = gradeIdList[0].result.studentGroup;
                            } else {
                                // 若课表中不存在list中的id,请求班级第一个
                                groupId = newCanCheckScheduleList[0].correctGroupIdList[0];
                                await this.getCustomResult(
                                    newCanCheckScheduleList[0].correctGroupIdList[0],
                                    'group',
                                    '双击调换班级'
                                );
                            }
                        }
                    }
                    this.setState({
                        studentGroupId: groupId,
                        notShowWillCard: true,
                        showExchangeClassTable: groupId ? true : false,
                        resultId: id, //存取当前换课的id
                        studentGroup: { ...studentGroup },
                        showLoading: false,
                    });
                }
                this.setState({
                    showLoading: false,
                });
            },
            onError: (errorMessage) => {
                message.error(errorMessage);
                this.setState({
                    notShowWillCard: false,
                    showLoading: false,
                });
            },
        });
    };

    getWillEchangeCustom = (data) => {
        const { dispatch, scheduleData } = this.props;
        const { childSearchIndex } = this.state;

        const newScheduleData = [];
        newScheduleData.push(data);
        for (let i = 0; i < scheduleData.length; i++) {
            let canClose = scheduleData[i].studentGroup.canClose;
            if (canClose) {
                newScheduleData.push(scheduleData[i]);
            }
        }

        dispatch({
            type: 'timeTable/getExchangeGroupInfo',
            payload: {
                exchangeScheduleData: newScheduleData,
                searchIndex: childSearchIndex,
            },
        });
    };

    setNotShowWillCard = () => {
        this.setState({
            notShowWillCard: false,
        });
    };

    setIfExchangeLoading = () => {
        this.setState({
            ifExchangeLoading: false,
        });
    };

    //切换到视图列表
    switchClubTable = () => {
        const { dispatch } = this.props;
        dispatch(
            routerRedux.push({
                pathname: '/time/club',
            })
        );
    };

    //批量锁定
    batchLock = (num) => {
        const { dispatch, scheduleData, lockCourseArr } = this.props;
        const { currentVersion, clickBatchOperButtonKey, type, weekDayRow } = this.state;
        //置空所有选择的课节
        this.choiceAllNull();

        //获取当前课表的作息列表
        dispatch({
            type: 'rules/scheduleDetail',
            payload: {
                scheduleId: this.getScheduleId(),
            },
        }).then(() => {
            this.setState({
                selectWeekday: 0,
            });
        });

        //检验当前版本是否已发布--已发布，则不允许批量锁定
        dispatch({
            type: 'timeTable/lastPublic',
            payload: {
                versionId: currentVersion,
            },
            onSuccess: () => {
                const { lastPublicContent } = this.props;
                if (lastPublicContent) {
                    message.info('当前版本已发布，不可进行锁定操作~');
                    return false;
                } else {
                    this.setState({
                        showWillLock: true,
                        showWillDelete: false,
                        isCanDelete: false,
                        deleteType: [1],
                        arrangeModal: false,
                        showWillChoice: false,
                        showWillWaitingListChoice: false,
                        clickBatchOperButtonKey: 0,
                        showWillCopy: false,
                        showWillStrike: false,
                    });
                }
            },
        });

        //获取课表已锁定课节
        dispatch({
            type: 'timeTable/getLockResultIdList',
            payload: {
                weekDayRow,
            },
        });
    };

    //全部锁定
    lockAll = () => {
        const { dispatch } = this.props;
        const { plainOptionsWeek, checkedList, weekDayRow, checkChoiceAll, ifLockAll } = this.state;
        dispatch({
            type: 'timeTable/lockAll',
            payload: {
                weekDayRow,
            },
        });
        const newState = JSON.parse(JSON.stringify(this.state));
        newState[`checkedList${this.state.weekDayRow}`] =
            plainOptionsWeek &&
            plainOptionsWeek.length > 0 &&
            plainOptionsWeek.map((item) => {
                return item.value;
            });

        [0, 1, 2, 3, 4, 5, 6].forEach((item) => {
            newState[`checkChoiceAll${item}`] = true;
        });

        this.setState({
            ...newState,
            ifLockAll: true,
            unLock: false,
            plainOptionsWeek,
            checkChoiceAll: true,
        });
    };

    //全部解锁
    unLockAll = () => {
        const { dispatch } = this.props;
        const { plainOptionsWeek, clickBatchOperButtonKey, checkedList, unLock, weekDayRow } =
            this.state;
        dispatch({
            type: 'timeTable/unLockAll',
            payload: {
                weekDayRow,
            },
        });
        this.setState(
            {
                ifLockAll: false,
                unLock: true,
                plainOptionsWeek,
            },
            () => {
                this.choiceAllNull();
            }
        );
    };

    //取消锁定
    cancelLock = () => {
        this.setState(
            {
                showWillLock: false,
            },
            () => {
                this.showTable('锁定');
                this.choiceAllNull(); //取消选择所有的课节
            }
        );
        //重新查询课表
    };

    //完成锁定
    finishLock = () => {
        const { dispatch, lockCourseArr, unlockResultIdList } = this.props;
        const {
            clickBatchOperButtonKey,
            type,
            plainOptionsWeek,
            checkedList,
            checkChoiceAll,
            loadingMsg,
        } = this.state;
        this.setState({
            loadingMsg: '批量锁定中...',
            deleteLoading: true,
        });
        dispatch({
            type: 'timeTable/confirmLock',
            payload: {
                lockResultIdList: lockCourseArr,
                unlockResultIdList: unlockResultIdList,
                type: clickBatchOperButtonKey,
            },
            onSuccess: () => {
                this.cancelLock();
                this.choiceAllNull(); //置空所有选择的课节
            },
        }).then(() => {
            this.setState({
                deleteLoading: false,
                loadingMsg: '',
            });
        });
    };

    //取消调整
    cancelConfirmAdjustment = () => {
        this.setState(
            {
                showWillChoice: false,
            },
            () => {
                this.showTable('锁定'); //重新查询课表
                this.choiceAllNull(); //取消选择所有的课节
            }
        );
    };

    //完成调整
    finishConfirmAdjustment = () => {
        const {
            dispatch,
            lockCourseArr,
            unlockResultIdList,
            scheduleData,
            choiceScheduleDetailId,
            scheduleDetail,
        } = this.props;
        const { currentVersion, targetLessonId, clickBatchOperButtonKey, type, selectWeekday } =
            this.state;

        this.setState({
            loadingMsg: '批量调整中...',
            deleteLoading: true,
        });
        if (lockCourseArr && lockCourseArr.length > 0) {
            let payload = {};
            if (
                (clickBatchOperButtonKey === 1 || clickBatchOperButtonKey === 4) &&
                targetLessonId === -1
            ) {
                payload = {
                    resultIdList: lockCourseArr,
                    weekDay: selectWeekday + 1,
                    versionId: currentVersion,
                    type: clickBatchOperButtonKey,
                };
            } else {
                payload = {
                    resultIdList: lockCourseArr,
                    baseScheduleDetailId: targetLessonId,
                    versionId: currentVersion,
                    type: clickBatchOperButtonKey,
                };
            }

            dispatch({
                type: 'timeTable/confirmUpdate',
                payload,
                onSuccess: () => {
                    this.cancelConfirmAdjustment();
                    this.choiceAllNull(); //置空所有选择的课节
                },
            }).then(() => {
                this.setState({
                    deleteLoading: false,
                    loadingMsg: '',
                    targetLessonId: -1,
                    selectWeekday: 0,
                });
            });
        } else {
            message.error('不能调整0课节');
        }
    };

    //批量调整节次
    batchAdjustmentSection = () => {
        //检验当前版本是否已发布--已发布，则不允许批量调整
        const { dispatch, scheduleData, lockCourseArr } = this.props;
        const { currentVersion, selectWeekday } = this.state;
        this.choiceAllNull(); //置空所有选择的课节
        dispatch({
            type: 'rules/scheduleDetail',
            payload: {
                scheduleId: this.getScheduleId(),
            },
        }).then(() => {
            this.setState({
                selectWeekday: 0,
                targetLessonId:
                    this.props.scheduleDetail &&
                    this.props.scheduleDetail.length > 0 &&
                    this.props.scheduleDetail[0][0].id,
            });
        });

        dispatch({
            type: 'timeTable/lastPublic',
            payload: {
                versionId: currentVersion,
            },
            onSuccess: () => {
                const { lastPublicContent, lockCourseArr } = this.props;
                if (lastPublicContent) {
                    message.info('当前版本已发布，不可进行调整操作~');
                    return false;
                } else {
                    this.setState(
                        {
                            showWillLock: false,
                            showWillDelete: false,
                            isCanDelete: false,
                            deleteType: [1],
                            arrangeModal: false,
                            showWillChoice: true,
                            clickBatchOperButtonKey: 1,
                            showWillWaitingListChoice: false,
                            showWillCopy: false,
                            showWillStrike: false,
                            selectWeekday: 0,
                            selectLessons: 1,
                            targetLessonId: -1,
                        },
                        () => {
                            if (!this.state.showWillChoice) {
                                //调用课表
                                this.fetchScheduleList();
                            }
                        }
                    );
                }
            },
        });
    };

    //批量换课
    batchChangeClass = () => {
        const { dispatch } = this.props;
        const { currentVersion } = this.state;
        dispatch({
            type: 'rules/scheduleDetail',
            payload: {
                scheduleId: this.getScheduleId(),
            },
        });
        dispatch({
            type: 'timeTable/getClickKeySchedule',
            payload: {
                versionId: currentVersion,
            },
        }).then(() => {
            const { clickKeuScheduleList } = this.props;
            this.setState({
                selectValue: clickKeuScheduleList[0]?.scheduleId,
                changeVisible: true,
                showWillChangeClass: true,
                showWillLock: false,
                showWillChoice: false,
                showWillWaitingListChoice: false,
                showWillStrike: false,
            });
        });
    };
    //批量转为待排
    batchTransferToWaitingList = () => {
        //检验当前版本是否已发布--已发布，则不允许批量转待排
        const { dispatch, scheduleData, lockCourseArr } = this.props;
        const { currentVersion, clickBatchOperButtonKey, type, studentGroupIdList } = this.state;
        // const { dispatch } = this.props;
        this.choiceAllNull(); //置空所有选择的课节
        dispatch({
            type: 'rules/scheduleDetail',
            payload: {
                scheduleId: this.getScheduleId(),
            },
        }).then(() => {
            this.setState({
                studentGroupIdList: [],
            });
        });
        dispatch({
            type: 'timeTable/lastPublic',
            payload: {
                versionId: currentVersion,
            },
            onSuccess: () => {
                const { lastPublicContent } = this.props;
                if (lastPublicContent) {
                    message.info('当前版本已发布，不可进行转待排操作~');
                    return false;
                } else {
                    this.setState(
                        {
                            showWillLock: false,
                            showWillDelete: false,
                            isCanDelete: false,
                            deleteType: [1],
                            arrangeModal: false,
                            showWillChoice: false,
                            clickBatchOperButtonKey: 3,
                            showWillWaitingListChoice: true,
                            showWillCopy: false,
                            showWillStrike: false,
                        },
                        () => {
                            if (!this.state.showWillWaitingListChoice) {
                                //调用课表
                                this.fetchScheduleList();
                            }
                        }
                    );
                }
            },
        });
    };

    //完成转待排
    finishTransferToWaitingList = () => {
        const {
            dispatch,
            lockCourseArr,
            unlockResultIdList,
            scheduleData,
            choiceScheduleDetailId,
        } = this.props;
        const { currentVersion, baseScheduleDetailId, clickBatchOperButtonKey, type } = this.state;

        this.setState({
            loadingMsg: '批量转待排中...',
            deleteLoading: true,
        });
        if (lockCourseArr && lockCourseArr.length > 0) {
            dispatch({
                type: 'timeTable/confirmUpdate',
                payload: {
                    resultIdList: lockCourseArr,
                    versionId: currentVersion,
                    type: clickBatchOperButtonKey,
                },
                onSuccess: () => {
                    this.cancelTransferToWaitingList();
                    this.fetchScheduleList(); //查询课程表
                    this.setDetailId();
                    this.fetchWillArrangeList(); // 获取中间部分
                    this.fetchCourseList(); // 左侧
                    this.getArrangeListFirst(); // 请求待排第一个
                    this.choiceAllNull(); //置空所有选择的课节
                },
            }).then(() => {
                this.setState({
                    studentGroupIdList: [],
                    deleteLoading: false,
                    loadingMsg: '',
                });
            });
        } else {
            message.error('不能转待排0课节');
        }
    };

    // 取消删除
    cancelStrike = () => {
        this.setState(
            {
                showWillStrike: false,
            },
            () => {
                this.showTable('锁定'); //重新查询课表
                this.choiceAllNull(); //取消选择所有的课节
            }
        );
    };

    //批量删除
    batchStrike = () => {
        //检验当前版本是否已发布--已发布，则不允许批量转待排
        const { dispatch, scheduleData, lockCourseArr } = this.props;
        const { currentVersion, clickBatchOperButtonKey, type, studentGroupIdList } = this.state;
        // const { dispatch } = this.props;
        this.choiceAllNull(); //置空所有选择的课节
        dispatch({
            type: 'rules/scheduleDetail',
            payload: {
                scheduleId: this.getScheduleId(),
            },
        }).then(() => {
            this.setState({
                studentGroupIdList: [],
            });
        });
        dispatch({
            type: 'timeTable/lastPublic',
            payload: {
                versionId: currentVersion,
            },
            onSuccess: () => {
                const { lastPublicContent } = this.props;
                if (lastPublicContent) {
                    message.info('当前版本已发布，不可进行删除操作~');
                    return false;
                } else {
                    this.setState(
                        {
                            showWillLock: false,
                            showWillDelete: false,
                            isCanDelete: false,
                            deleteType: [1],
                            arrangeModal: false,
                            showWillChoice: false,
                            clickBatchOperButtonKey: 2,
                            showWillWaitingListChoice: false,
                            showWillCopy: false,
                            showWillStrike: true,
                        },
                        () => {
                            if (!this.state.showWillStrike) {
                                //调用课表
                                this.fetchScheduleList();
                            }
                        }
                    );
                }
            },
        });
    };

    //完成删除
    finishStrike = () => {
        const {
            dispatch,
            lockCourseArr,
            unlockResultIdList,
            scheduleData,
            choiceScheduleDetailId,
        } = this.props;
        const { currentVersion, baseScheduleDetailId, clickBatchOperButtonKey, type } = this.state;

        this.setState({
            loadingMsg: '批量删除中...',
            deleteLoading: true,
        });
        if (lockCourseArr && lockCourseArr.length > 0) {
            dispatch({
                type: 'timeTable/confirmUpdate',
                payload: {
                    resultIdList: lockCourseArr,
                    // baseScheduleDetailId: baseScheduleDetailId,
                    versionId: currentVersion,
                    type: clickBatchOperButtonKey,
                },
                onSuccess: () => {
                    this.cancelStrike();
                    this.fetchScheduleList(); //查询课程表
                    this.setDetailId();
                    this.fetchWillArrangeList(); // 获取中间部分
                    this.fetchCourseList(); // 左侧
                    this.getArrangeListFirst(); // 请求待排第一个
                    this.choiceAllNull(); //置空所有选择的课节
                },
            }).then(() => {
                this.setState({
                    studentGroupIdList: [],
                    deleteLoading: false,
                    loadingMsg: '',
                });
            });
        } else {
            message.error('不能删除0课节');
        }
    };

    // 批量复制
    batchCopy = () => {
        //检验当前版本是否已发布--已发布，则不允许批量转待排
        const { dispatch, scheduleData, lockCourseArr } = this.props;
        const { currentVersion, clickBatchOperButtonKey, type, studentGroupIdList } = this.state;
        this.choiceAllNull(); //置空所有选择的课节
        dispatch({
            type: 'rules/scheduleDetail',
            payload: {
                scheduleId: scheduleData[0].resultList[0][0].baseScheduleId,
            },
        }).then(() => {
            this.setState({
                studentGroupIdList: [],
            });
        });
        dispatch({
            type: 'timeTable/lastPublic',
            payload: {
                versionId: currentVersion,
            },
            onSuccess: () => {
                const { lastPublicContent } = this.props;
                if (lastPublicContent) {
                    message.info('当前版本已发布，不可进行复制操作~');
                    return false;
                } else {
                    this.setState(
                        {
                            showWillLock: false,
                            showWillDelete: false,
                            isCanDelete: false,
                            deleteType: [1],
                            arrangeModal: false,
                            showWillChoice: false,
                            clickBatchOperButtonKey: 4,
                            showWillWaitingListChoice: false,
                            showWillCopy: true,
                            showWillStrike: false,
                            targetLessonId: -1,
                            selectWeekday: 0,
                        },
                        () => {
                            if (!this.state.showWillCopy) {
                                //调用课表
                                this.fetchScheduleList();
                            }
                        }
                    );
                }
            },
        });
    };

    // 取消复制
    cancelConfirmCopy = () => {
        this.setState(
            {
                showWillCopy: false,
            },
            () => {
                this.showTable('锁定'); //重新查询课表
                this.choiceAllNull(); //取消选择所有的课节
            }
        );
    };

    //完成复制
    finishConfirmCopy = () => {
        const {
            dispatch,
            lockCourseArr,
            unlockResultIdList,
            scheduleData,
            choiceScheduleDetailId,
        } = this.props;
        const { currentVersion, targetLessonId, clickBatchOperButtonKey, type, selectWeekday } =
            this.state;

        let payload = {};
        if (
            (clickBatchOperButtonKey === 1 || clickBatchOperButtonKey === 4) &&
            targetLessonId === -1
        ) {
            payload = {
                resultIdList: lockCourseArr,
                weekDay: selectWeekday + 1,
                versionId: currentVersion,
                type: clickBatchOperButtonKey,
            };
        } else {
            payload = {
                resultIdList: lockCourseArr,
                baseScheduleDetailId: targetLessonId,
                versionId: currentVersion,
                type: clickBatchOperButtonKey,
            };
        }
        if (lockCourseArr && lockCourseArr.length > 0) {
            dispatch({
                type: 'timeTable/confirmUpdate',
                payload,
                onSuccess: () => {
                    this.setState({
                        loadingMsg: '批量复制中...',
                        deleteLoading: true,
                    });
                    this.cancelConfirmCopy();
                    this.choiceAllNull(); //置空所有选择的课节
                },
            }).then(() => {
                this.fetchCourseList();
                this.setState({
                    studentGroupIdList: [],
                    deleteLoading: false,
                    loadingMsg: '',
                    targetLessonId: -1,
                    selectWeekday: 0,
                });
            });
        } else {
            message.error('不能复制0课节');
        }
    };

    //取消转待排
    cancelTransferToWaitingList = () => {
        this.setState(
            {
                showWillWaitingListChoice: false,
            },
            () => {
                this.showTable('锁定'); //重新查询课表
                this.choiceAllNull(); //取消选择所有的课节
            }
        );
    };

    // 待排
    onCheckAllChangeTransferToWaiting = (e) => {
        const { dispatch, scheduleData } = this.props;
        const { plainOptionsWeek } = this.state;

        const scheduleDataId = [];
        scheduleData.map((item) => {
            scheduleDataId.push(item.studentGroup.id);
        });

        const newState = JSON.parse(JSON.stringify(this.state));
        newState[`checkedList${this.state.weekDayRow}`] =
            plainOptionsWeek &&
            plainOptionsWeek.length > 0 &&
            plainOptionsWeek.map((item) => {
                return item.value;
            });
        newState[`checkChoiceAll${this.state.weekDayRow}`] = true;
        // newState[`checkChoiceAll`] = true;
        if (e.target.checked) {
            dispatch({
                type: 'timeTable/transferToWaitingAll',
                payload: {},
            });
            [0, 1, 2, 3, 4, 5, 6].forEach((item) => {
                newState[`checkChoiceAll${item}`] = true;
            });
            this.setState({
                ...newState,
                ifLockAll: true,
                unLock: false,
                plainOptionsWeek,
                checkChoiceAll: true,
            });
        } else {
            [0, 1, 2, 3, 4, 5, 6].forEach((item) => {
                newState[`checkChoiceAll${item}`] = false;
                newState[`checkedList${item}`] = [];
            });
            dispatch({
                type: 'timeTable/unTransferToWaitingAll',
                payload: {},
            });
            this.setState({
                ...newState,
                plainOptionsWeek,
                checkChoiceAll: false,
            });
        }

        this.setState({
            studentGroupIdList: e.target.checked ? scheduleDataId : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });
    };

    //删除
    onCheckAllChangeStrike = (e) => {
        const { dispatch, scheduleData } = this.props;
        const { plainOptionsWeek } = this.state;

        const scheduleDataId = [];
        scheduleData.map((item) => {
            scheduleDataId.push(item.studentGroup.id);
        });

        const newState = JSON.parse(JSON.stringify(this.state));
        newState[`checkedList${this.state.weekDayRow}`] =
            plainOptionsWeek &&
            plainOptionsWeek.length > 0 &&
            plainOptionsWeek.map((item) => {
                return item.value;
            });
        newState[`checkChoiceAll${this.state.weekDayRow}`] = true;
        if (e.target.checked) {
            dispatch({
                type: 'timeTable/transferToWaitingAll',
                payload: {},
            });
            [0, 1, 2, 3, 4, 5, 6].forEach((item) => {
                newState[`checkChoiceAll${item}`] = true;
            });
            this.setState({
                ...newState,
                ifLockAll: true,
                unLock: false,
                plainOptionsWeek,
                checkChoiceAll: true,
            });
        } else {
            [0, 1, 2, 3, 4, 5, 6].forEach((item) => {
                newState[`checkChoiceAll${item}`] = false;
                newState[`checkedList${item}`] = [];
            });
            dispatch({
                type: 'timeTable/unTransferToWaitingAll',
                payload: {},
            });
            this.setState({
                ...newState,
                plainOptionsWeek,
                checkChoiceAll: false,
            });
        }

        this.setState({
            studentGroupIdList: e.target.checked ? scheduleDataId : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });
    };

    //复制
    onCheckAllChangeCopy = (e) => {
        const { dispatch, scheduleData } = this.props;
        const { plainOptionsWeek } = this.state;

        const scheduleDataId = [];
        scheduleData.map((item) => {
            scheduleDataId.push(item.studentGroup.id);
        });

        const newState = JSON.parse(JSON.stringify(this.state));
        newState[`checkedList${this.state.weekDayRow}`] =
            plainOptionsWeek &&
            plainOptionsWeek.length > 0 &&
            plainOptionsWeek.map((item) => {
                return item.value;
            });
        newState[`checkChoiceAll${this.state.weekDayRow}`] = true;
        if (e.target.checked) {
            dispatch({
                type: 'timeTable/transferToWaitingAll',
                payload: {},
            });
            [0, 1, 2, 3, 4, 5, 6].forEach((item) => {
                newState[`checkChoiceAll${item}`] = true;
            });
            this.setState({
                ...newState,
                ifLockAll: true,
                unLock: false,
                plainOptionsWeek,
                checkChoiceAll: true,
            });
        } else {
            [0, 1, 2, 3, 4, 5, 6].forEach((item) => {
                newState[`checkChoiceAll${item}`] = false;
                newState[`checkedList${item}`] = [];
            });
            dispatch({
                type: 'timeTable/unTransferToWaitingAll',
                payload: {},
            });
            this.setState({
                ...newState,
                plainOptionsWeek,
                checkChoiceAll: false,
            });
        }

        this.setState({
            studentGroupIdList: e.target.checked ? scheduleDataId : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });
    };

    // 待排横向选择按钮
    onChangeWaitingListChoice = (e) => {
        const { studentGroupIdList } = this.state;
        const newList = JSON.parse(JSON.stringify(studentGroupIdList));
        const { dispatch, scheduleData } = this.props;
        if (e.target.checked) {
            dispatch({
                type: 'timeTable/WaitingListChoiceAllClassCourse',
                payload: {
                    id: e.target.id,
                },
            });
        } else {
            dispatch({
                type: 'timeTable/unWaitingListChoiceAllClassCourse',
                payload: {
                    id: e.target.id,
                },
            });
        }
        if (e.target.checked) {
            newList.push(e.target.id);
        } else {
            if (newList.indexOf(e.target.id) != -1) {
                let index = newList.indexOf(e.target.id);
                newList.splice(index, 1);
            }
        }

        this.setState({
            studentGroupIdList: newList,
            indeterminate: !!newList.length && newList.length < scheduleData.length,
            checkAll: newList.length === scheduleData.length,
        });
        //
    };

    //横向删除
    onChangeStrike = (e) => {
        const { studentGroupIdList } = this.state;
        const newList = JSON.parse(JSON.stringify(studentGroupIdList));
        const { dispatch, scheduleData } = this.props;
        if (e.target.checked) {
            dispatch({
                type: 'timeTable/WaitingListChoiceAllClassCourse',
                payload: {
                    id: e.target.id,
                },
            });
        } else {
            dispatch({
                type: 'timeTable/unWaitingListChoiceAllClassCourse',
                payload: {
                    id: e.target.id,
                },
            });
        }
        if (e.target.checked) {
            newList.push(e.target.id);
        } else {
            if (newList.indexOf(e.target.id) != -1) {
                let index = newList.indexOf(e.target.id);
                newList.splice(index, 1);
            }
        }

        this.setState({
            studentGroupIdList: newList,
            indeterminate: !!newList.length && newList.length < scheduleData.length,
            checkAll: newList.length === scheduleData.length,
        });
        //
    };

    //调整节次选择
    onCheckAllChangeAdjustment = (e) => {
        const { dispatch, scheduleData } = this.props;
        const { plainOptionsWeek } = this.state;

        const scheduleDataId = [];
        scheduleData.map((item) => {
            scheduleDataId.push(item.studentGroup.id);
        });

        const newState = JSON.parse(JSON.stringify(this.state));
        newState[`checkedList${this.state.weekDayRow}`] =
            plainOptionsWeek &&
            plainOptionsWeek.length > 0 &&
            plainOptionsWeek.map((item) => {
                return item.value;
            });
        newState[`checkChoiceAll${this.state.weekDayRow}`] = true;
        newState[`checkChoiceAll`] = true;

        if (e.target.checked) {
            dispatch({
                type: 'timeTable/AdjustmentAll',
                payload: {},
            });
            [0, 1, 2, 3, 4, 5, 6].forEach((item) => {
                newState[`checkChoiceAll${item}`] = true;
            });
            this.setState({
                ...newState,
                ifLockAll: true,
                unLock: false,
                plainOptionsWeek,
                checkChoiceAll: true,
            });
        } else {
            dispatch({
                type: 'timeTable/unAdjustmentAll',
                payload: {},
            });
            [0, 1, 2, 3, 4, 5, 6].forEach((item) => {
                newState[`checkChoiceAll${item}`] = false;
                newState[`checkedList${item}`] = [];
            });
            this.setState({
                ...newState,
                plainOptionsWeek,
                checkChoiceAll: false,
            });
        }

        this.setState({
            studentGroupIdList: e.target.checked ? scheduleDataId : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });
    };

    //单选所选weekday 的 节次
    onChoiceLessonChange = (checkedList) => {
        const { plainOptionsWeek, weekDayRow, clickBatchOperButtonKey } = this.state;
        const { dispatch } = this.props;

        //区分锁定和其他四种类型
        if (clickBatchOperButtonKey == 0) {
            //锁定

            dispatch({
                type: 'timeTable/lockOrUnlockChoiceAllCourse',
                payload: {
                    checkedList,
                    weekDayRow,
                },
            });
        } else {
            dispatch({
                type: 'timeTable/choiceAllClassCourse',
                payload: {
                    checkedList,
                    weekDayRow,
                },
            });
        }
        const newState = JSON.parse(JSON.stringify(this.state));
        newState[`checkedList${this.state.weekDayRow}`] = checkedList;
        newState[`checkChoiceAll${this.state.weekDayRow}`] =
            checkedList.length === plainOptionsWeek.length;
        this.setState({
            ...newState,
            indeterminate: !!checkedList.length && checkedList.length < plainOptionsWeek.length,
            ifLockAll: false,
            unLock: false,
        });
    };

    //全选所选weekday 的 节次列表
    onChoiceAllLessonChange = (e) => {
        const { plainOptionsWeek, weekDayRow, clickBatchOperButtonKey } = this.state;
        const { dispatch } = this.props;

        //批量锁定操作
        if (clickBatchOperButtonKey == 0) {
            if (e.target.checked) {
                dispatch({
                    type: 'timeTable/lockAllWeekDayCourse',
                    payload: {
                        weekDayRow,
                    },
                });
            } else {
                dispatch({
                    type: 'timeTable/unLockAllWeekDayCourse',
                    payload: {
                        weekDayRow,
                    },
                });
            }
        }
        //批量删除、批量调整节次、批量转待排
        else {
            if (e.target.checked) {
                dispatch({
                    type: 'timeTable/choiceAllWeekDayCourse',
                    payload: {
                        id: e.target.id,
                        weekDayRow,
                    },
                });
            } else {
                dispatch({
                    type: 'timeTable/unChoiceAllWeekDayCourse',
                    payload: {
                        id: e.target.id,
                        weekDayRow,
                    },
                });
            }
        }
        const newState = JSON.parse(JSON.stringify(this.state));
        newState[`checkedList${this.state.weekDayRow}`] = e.target.checked
            ? plainOptionsWeek.map((item) => item.value)
            : [];
        newState[`checkChoiceAll${this.state.weekDayRow}`] = e.target.checked;
        this.setState({
            ...newState,
            indeterminate: false,
            ifLockAll: false,
            unLock: false,
        });
    };

    //批量删除
    batchDelete = () => {
        //检测当前版本是否已发布--已发布，则不允许批量删除
        const { lastPublish, gradeValue, checkChoiceAll } = this.state;
        if (gradeValue && gradeValue.length > 0) {
            message.info('指定年级下的批量删除操作暂不支持哦~');
            return false;
        }
        if (lastPublish) {
            message.info('当前版本已发布，不可进行删除操作~');
            return false;
        } else {
            this.setState(
                {
                    showWillDelete: !this.state.showWillDelete,
                    showWillLock: false,
                    arrangeModal: false,
                },
                () => {
                    if (!this.state.showWillDelete) {
                        //调用课表
                        this.fetchCourseList();
                        this.setState({
                            deleteType: [1],
                        });
                    }
                }
            );
        }
    };

    //取消删除
    cancelDelete = () => {
        this.setState(
            {
                showWillDelete: false,
                saveActiveClassId: '', //保存调换课的id
                saveDeleteDate: '', //保存将要删除的日期
                confirmDeletePop: false, //确定删除的pop隐藏
                isCanDelete: false,
                deleteType: [1],
            },
            () => {
                this.showTable('锁定'); //重新查询课表
                this.choiceAllNull(); //取消选择所有的课节
            }
        );
    };

    //获取调课换课的详情
    getExchangeResult = (exchangeList) => {
        const { dispatch, canChangeCourse } = this.props;
        const { currentVersion, resultId, studentGroupId } = this.state;
        dispatch({
            type: 'timeTable/getExchangeResult',
            payload: {
                versionId: currentVersion,
                resultId: resultId,
                studentGroupId: studentGroupId,
                exchangeList: exchangeList,
                allList: canChangeCourse,
            },
        });
    };
    //校验是否可以调换
    validateCanChange = (exchangeList, checkRules) => {
        const { dispatch, canChangeCourse } = this.props;
        const { currentVersion, resultId } = this.state;
        //存取换课结果
        this.setState({
            exchangeList: exchangeList,
            conflict: '',
            conflictResult: '',
            fetErrorMessageModel: {},
            checkRules: checkRules,
        });
        dispatch({
            type: 'timeTable/validateCanChange',
            payload: {
                versionId: currentVersion,
                resultId: resultId,
                checkRule: checkRules || false,
                exchangeList: exchangeList,
                allList: canChangeCourse,
            },
            onSuccess: () => {
                const { checkChangeResult } = this.props;
                this.setState({
                    showExchangeResult: true,
                    conflict: checkChangeResult && checkChangeResult.conflict,
                    conflictResult: checkChangeResult && checkChangeResult.conflictContent,
                    fetErrorMessageModel:
                        checkChangeResult && checkChangeResult.fetErrorMessageModel,
                });
            },
        });
    };

    //清空调课换课的状态
    clearChangeCourse = () => {
        this.setState({
            exchangeList: [],
            conflict: '',
            conflictResult: '',
            fetErrorMessageModel: {},
            checkRules: false,
            resultId: '', //存取当前换课的id
            //studentGroupId: "",//存取当前换课的班级id
            showExchangeResult: false,
            saveActiveClassId: '',
        });
    };

    //取消调课换课
    cancelExchangeCourse = () => {
        this.clearChangeCourse();
        this.setState({
            showExchangeClassTable: false,
        });
    };

    //确认调课换课
    finishExchangeCourse = (isPublish, callback) => {
        const { dispatch, checkChangeResult } = this.props;
        const { currentVersion, studentGroupId } = this.state;
        dispatch({
            type: 'timeTable/finishExchangeCourse',
            payload: {
                versionId: currentVersion,
                publish: isPublish,
                resultExchangeList: checkChangeResult && checkChangeResult.exchangeModels, //校验换课的交换模型
            },
            onSuccess: () => {
                callback();
                this.clearChangeCourse();
                this.setState(
                    {
                        showExchangeClassTable: false,
                        saveActiveClassId: studentGroupId, //存取调换课的id，调换成功之高亮
                    },
                    () => {
                        //重新查询课表
                        this.fetchScheduleList();
                    }
                );
            },
        });
    };

    //选择搜索条件
    changeCondition = (value) => {
        this.setState(
            {
                filterOption: value,
                selectStudent: [],
                selectTeacher: [],
                activityName: '',
            },
            () => {
                if (value == 'student') {
                    this.setState({
                        showExchangeClassTable: false,
                    });
                }
            }
        );
    };

    //展示更多搜索条件
    showMore = () => {
        this.setState({
            showMoreCondition: !this.state.showMoreCondition,
        });
    };

    //按照教师搜索课表
    changeTeacher = (value) => {
        this.setState(
            {
                selectTeacher: value,
                selectStudent: [],
                activityName: '',
                selectAddress: [],
            },
            () => {
                //查询课表
                this.fetchScheduleList();
            }
        );
    };

    //按照学生进行筛选
    changeStudent = (value) => {
        this.setState(
            {
                selectStudent: value,
                selectTeacher: [],
                activityName: '',
                selectAddress: [],
            },
            () => {
                //查询课表
                this.fetchScheduleList();
            }
        );
    };

    //按照活动名称进行筛选
    searchActivity = (value) => {
        this.setState(
            {
                activityName: value,
                selectStudent: [],
                selectTeacher: [],
                selectAddress: [],
            },
            () => {
                //查询课表
                this.fetchScheduleList();
            }
        );
    };
    onRef = (self) => {
        this.ref = self;
    };
    //按照场地进行筛选
    changeAddress = (value) => {
        this.setState(
            {
                selectAddress: value,
                activityName: '',
                selectStudent: [],
                selectTeacher: [],
            },
            () => {
                //查询课表
                this.fetchScheduleList();
            }
        );
    };

    //批量删除--选择类型
    changeDeleteType = (value) => {
        this.setState(
            {
                deleteType: value,
            },
            () => {
                this.fetchDeleteNumber();
            }
        );
    };

    //点击删除按钮清空某天排课结果的数量
    statisticsDeleteResult = (currentDate) => {
        const { deleteType } = this.state;
        if (deleteType.length == 0 || !deleteType) {
            message.info('请先选择清空类型,再进行操作哦~');
        }
        //存储，切换类型要用
        this.setState(
            {
                saveDeleteDate: currentDate,
                isCanDelete: true,
            },
            () => {
                this.fetchDeleteNumber();
            }
        );
    };

    //统计删除的数量--调用接口
    fetchDeleteNumber = () => {
        const { dispatch } = this.props;
        const { currentVersion, deleteType, saveDeleteDate } = this.state;
        if (!saveDeleteDate) {
            //时间未选择，不请求接口
            return false;
        }
        let start =
            saveDeleteDate && new Date(formatTimeSafari(saveDeleteDate) + ' 00:00:00').getTime();
        let end =
            saveDeleteDate && new Date(formatTimeSafari(saveDeleteDate) + ' 23:59:59').getTime();
        dispatch({
            type: 'timeTable/scheduleResultNumber',
            payload: {
                versionId: currentVersion,
                startTime: start,
                endTime: end,
                deleteResultType: deleteType,
            },
            onSuccess: () => {},
        });
    };

    //二次删除确认弹窗
    handleVisibleChange = (visible) => {
        this.setState({
            confirmDeletePop: visible,
        });
    };

    //取消确认弹窗
    handleCancelPop = () => {
        this.setState({
            confirmDeletePop: false,
        });
    };

    transmitState = (cardUtil) => {
        this.setState({
            cardUtil,
        });
    };

    //确认删除
    confirmDelete = () => {
        const { dispatch, deleteScheduleResult } = this.props;
        const { deleteType, deleteLoading } = this.state;
        if (deleteType.length == 0 || !deleteType) {
            message.info('请选择清空类型哦~');
            return false;
        }
        if (
            !deleteScheduleResult ||
            (deleteScheduleResult.systemResultSum == 0 && deleteScheduleResult.freeResultSum == 0)
        ) {
            message.info('清空的课节数量为0，请选择删除的课节哦~');
            return false;
        }
        this.setState({
            deleteLoading: true,
        });
        dispatch({
            type: 'timeTable/confirmDelete',
            payload: {
                systemResultList: deleteScheduleResult && deleteScheduleResult.systemResultList, //系统结果集合
                freeResultList: deleteScheduleResult && deleteScheduleResult.freeResultList, //自由结果集合
                systemResultSum: deleteScheduleResult && deleteScheduleResult.systemResultSum, //系统结果数量
                freeResultSum: deleteScheduleResult && deleteScheduleResult.freeResultSum, //自由结果数量
            },
            onSuccess: () => {
                this.setState(
                    {
                        showWillDelete: false,
                        saveActiveClassId: '', //保存调换课的id
                        saveDeleteDate: '', //保存将要删除的日期
                        confirmDeletePop: false, //确定删除的pop隐藏
                        isCanDelete: false,
                        deleteType: [1],
                        deleteLoading: false,
                    },
                    () => {
                        //重新查询课表
                        this.fetchScheduleList();
                        this.fetchCourseList();
                    }
                );
            },
        });
    };

    // 判断自定义添加id是否已存在
    handleNotRepeat = (value) => {
        const { scheduleData } = this.props;
        let isRepeat = false;
        let length = scheduleData && scheduleData.length;
        for (let i = 0; i < length; i++) {
            if (value == scheduleData[i].studentGroup.id) {
                isRepeat = true;
                break;
            }
        }
        return isRepeat;
    };

    // 自定义添加行存储班级id
    saveCustomValue = (value, type) => {
        this.setState({
            [type]: value,
        });
    };

    handleChange = (value) => {
        const { selectWeekday } = this.state;
        this.setState({
            selectWeekday: value,
        });
    };

    baseScheduleDetailIdChange = (value, option) => {
        this.setState({
            targetLessonId: value,
            selectLessons: option.props.children[1],
        });
    };

    // 自定义调换课请求处理
    dealCustomChange = (action, lessonRelateInfo) => {
        const { dispatch, scheduleData } = this.props;
        for (let i = 0; i < scheduleData.length; i++) {
            if (lessonRelateInfo && lessonRelateInfo.flag) {
                this.getCustomResultForEfficient(
                    scheduleData[i].studentGroup.id,
                    scheduleData[i].studentGroup.view,
                    action,
                    true,
                    lessonRelateInfo,
                    scheduleData[i].studentGroup.canClose
                );
            } else {
                this.getCustomResult(
                    scheduleData[i].studentGroup.id,
                    scheduleData[i].studentGroup.view,
                    action,
                    true
                );
            }
        }
    };

    // 获取自定义视角查询年级/班级结果
    getCustomResult = (value, type, action, isCover) => {
        const { dispatch, scheduleData } = this.props;
        const { currentVersion, startTimeOfDay, endTimeOfDay, childSearchIndex, courseValue } =
            this.state;
        // 判断是否有重复添加
        if (this.handleNotRepeat(value) && !isCover) {
            if (action != '待排取消') {
                message.info('课表已存在该项');
            }
            return;
        }

        if (type == 'grade') {
            this.setState({
                customGrade: value,
            });
            return dispatch({
                type: 'timeTable/findGradeSchedule',
                payload: {
                    id: currentVersion,
                    startTimeOfDay,
                    endTimeOfDay,
                    actionType: 'custom',
                    courseIds: courseValue, //课程id
                    gradeIdList: [value],
                    actionWay: action, // 前端自定义属性，确认操作方式
                    searchIndex: childSearchIndex || 0,
                },
                onSuccess: () => {
                    let scheduleGroupIdList = [];
                    this.props.scheduleData &&
                        this.props.scheduleData.length > 0 &&
                        this.props.scheduleData.map((item, index) => {
                            scheduleGroupIdList.push(item.studentGroup.id);
                        });
                    this.setState({
                        scheduleGroupIdList,
                    });
                },
            });
        } else if (type == 'group') {
            this.setState({
                customGroup: value,
            });
            return dispatch({
                type: 'timeTable/fetchGroupList',
                payload: {
                    id: currentVersion,
                    startTimeOfDay,
                    endTimeOfDay,
                    groupIds: value instanceof Array ? value : [value],
                    courseIds: courseValue, //课程id
                    actionType: 'custom', // 前端自定义属性，确认触发请求的位置
                    actionWay: action, // 前端自定义属性，确认操作方式
                    searchIndex: childSearchIndex || 0,
                },
            });
        } else if (type == 'teacher') {
            this.setState({
                customTeacher: value,
            });
            return dispatch({
                type: 'timeTable/findTeacherSchedule',
                payload: {
                    id: currentVersion,
                    startTimeOfDay,
                    endTimeOfDay,
                    teacherIds: [value],
                    courseIds: courseValue, //课程id
                    actionType: 'custom', // 前端自定义属性，确认触发请求的位置
                    searchIndex: childSearchIndex || 0,
                },
            });
        } else if (type == 'address') {
            this.setState({
                customAddress: value,
            });
            return dispatch({
                type: 'timeTable/findFieldSchedule',
                payload: {
                    id: currentVersion,
                    startTimeOfDay,
                    endTimeOfDay,
                    playgroundIds: [value],
                    courseIds: courseValue, //课程id
                    actionType: 'custom', // 前端自定义属性，确认触发请求的位置
                    searchIndex: childSearchIndex || 0,
                },
            });
        } else if (type == 'student') {
            this.setState({
                customStudent: value,
            });
            return dispatch({
                type: 'timeTable/findStudentSchedule',
                payload: {
                    startTimeOfDay,
                    endTimeOfDay,
                    id: currentVersion,
                    actionType: 'custom',
                    studentIds: [value],
                    courseIds: courseValue, //课程id
                    searchIndex: childSearchIndex || 0,
                },
            });
        }
    };

    // 获取自定义视角查询年级/班级结果 （效率）
    getCustomResultForEfficient = (
        value,
        type,
        action,
        isCover,
        lessonRelateInfo,
        studentGroupCanclose
    ) => {
        const { dispatch, scheduleData } = this.props;
        const { currentVersion, startTimeOfDay, endTimeOfDay, childSearchIndex, courseValue } =
            this.state;

        const {
            targetGroupIdList = [],
            targetMainTeacherIdList = [],
            targetAssistantTeacherIdList = [],
            targetRoomId,
            sourceGroupIdList = [],
            sourceMainTeacherIdList = [],
            sourceAssistantTeacherIdList = [],
            layerClassIdList = [],
            sourceRoomId,
            gradeId,
            flag,
        } = lessonRelateInfo;
        // 判断是否有重复添加
        if (this.handleNotRepeat(value) && !isCover) {
            if (action != '待排取消') {
                message.info('课表已存在该项');
            }
            return;
        }

        if (type == 'grade') {
            this.setState({
                customGrade: value,
            });

            if (
                // gradeId === value
                true
            ) {
                return dispatch({
                    type: 'timeTable/findGradeSchedule',
                    payload: {
                        id: currentVersion,
                        startTimeOfDay,
                        endTimeOfDay,
                        actionType: 'custom',
                        courseIds: courseValue, //课程id
                        gradeIdList: [value],
                        actionWay: action, // 前端自定义属性，确认操作方式
                        searchIndex: childSearchIndex || 0,
                    },
                    onSuccess: () => {
                        let scheduleGroupIdList = [];
                        this.props.scheduleData &&
                            this.props.scheduleData.length > 0 &&
                            this.props.scheduleData.map((item, index) => {
                                scheduleGroupIdList.push(item.studentGroup.id);
                            });
                        this.setState({
                            scheduleGroupIdList,
                        });
                    },
                });
            }
        } else if (type == 'group') {
            this.setState({
                customGroup: value,
            });

            if (
                targetGroupIdList.includes(value) ||
                sourceGroupIdList.includes(value) ||
                layerClassIdList.includes(value)
            ) {
                return dispatch({
                    type: 'timeTable/fetchGroupList',
                    payload: {
                        id: currentVersion,
                        startTimeOfDay,
                        endTimeOfDay,
                        groupIds: value instanceof Array ? value : [value],
                        courseIds: courseValue, //课程id
                        actionType: 'custom', // 前端自定义属性，确认触发请求的位置
                        actionWay: action, // 前端自定义属性，确认操作方式
                        searchIndex: childSearchIndex || 0,
                        studentGroupCanclose,
                    },
                });
            }
        } else if (type == 'teacher') {
            this.setState({
                customTeacher: value,
            });
            if (
                targetMainTeacherIdList.includes(value) ||
                sourceMainTeacherIdList.includes(value) ||
                sourceAssistantTeacherIdList.includes(value) ||
                targetAssistantTeacherIdList.includes(value)
            ) {
                dispatch({
                    type: 'timeTable/findTeacherSchedule',
                    payload: {
                        id: currentVersion,
                        startTimeOfDay,
                        endTimeOfDay,
                        teacherIds: [value],
                        courseIds: courseValue, //课程id
                        actionType: 'custom', // 前端自定义属性，确认触发请求的位置
                        searchIndex: childSearchIndex || 0,
                    },
                });
            }
        } else if (type == 'address') {
            this.setState({
                customAddress: value,
            });

            if (
                // targetRoomId.includes(value) || sourceRoomId.includes(value)
                true
            ) {
                dispatch({
                    type: 'timeTable/findFieldSchedule',
                    payload: {
                        id: currentVersion,
                        startTimeOfDay,
                        endTimeOfDay,
                        playgroundIds: [value],
                        courseIds: courseValue, //课程id
                        actionType: 'custom', // 前端自定义属性，确认触发请求的位置
                        searchIndex: childSearchIndex || 0,
                    },
                });
            }
        } else if (type == 'student') {
            this.setState({
                customStudent: value,
            });
            dispatch({
                type: 'timeTable/findStudentSchedule',
                payload: {
                    startTimeOfDay,
                    endTimeOfDay,
                    id: currentVersion,
                    actionType: 'custom',
                    studentIds: [value],
                    courseIds: courseValue, //课程id
                    searchIndex: childSearchIndex || 0,
                },
            });
        }
    };

    getClickTableExchangeResult = (util, id, studentGroupId, index) => {
        const { dispatch } = this.props;
        const { currentVersion, childSearchIndex } = this.state;
        let customAction =
            childSearchIndex === 0 ? 'customGroup' : childSearchIndex === 1 ? 'customGrade' : '';
        if (!util.type == 1) return;
        this.setState({
            ifMoveLoading: true,
            ifExchangeLoading: true,
            showLoading: true,
            resultId: id, //存取当前换课的id
            [customAction]: studentGroupId,
        });

        //换课（边框颜色）
        let p1 = dispatch({
            type: 'exchangeCourse/fetchRemovableColor',
            payload: {
                id: id,
            },
        });

        //移动课程（绿色灰色块移动）
        let p2 = dispatch({
            type: 'exchangeCourse/fetchNewExchangeClass',
            payload: {
                resultId: id,
                studentGroupId, //班级id
                versionId: currentVersion, //版本id
                changeCourse: false,
            },
        });

        Promise.all([p1, p2]).then(() => {
            const { move, newCanChangeCourse, moveResponse, changeResponse } = this.props;

            if (moveResponse.code == 1416 || changeResponse.code == 1416) {
                message.info(moveResponse.message);
            }
            if (
                (move && move.length > 0) ||
                (newCanChangeCourse && newCanChangeCourse.length > 0)
            ) {
                this.setShowExchangeClassTable(); // 切到调换课状态
            }
            this.setState({
                ifMoveLoading: false,
                showLoading: false,
                notShowWillCard: false,
                ifExchangeLoading: false,
                studentGroupId,
            });
        });
    };

    // 根据资源视角切换，改变更多筛选中默认值
    getCourseView = () => {
        const { searchIndex } = this.childTable.state;
        let {
            filterOption,
            filterDisable,
            gradeValue,
            courseValue,
            selectTeacher,
            showMoreCondition,
        } = this.state;
        filterOption = searchIndex == 4 ? 'address' : 'teacher';

        // 自定义和学生视角筛选禁用，清空value值
        if (searchIndex == 2 || searchIndex == 5 || searchIndex == 3) {
            filterDisable = true;
            gradeValue = [];
            courseValue = [];
            selectTeacher = [];
            showMoreCondition = false;
        } else {
            gradeValue = localStorage.getItem('gradeValue')
                ? JSON.parse(localStorage.getItem('gradeValue'))
                : [];
            if (searchIndex == 4) {
                gradeValue = [];
                courseValue = [];
            }
            filterDisable = false;
        }
        this.setState({
            filterOption,
            filterDisable,
            gradeValue: [...gradeValue],
            courseValue,
            selectTeacher,
            showMoreCondition,
        });
    };

    // 年级、课程筛选清空按钮
    clearStageAndGrade = (type) => {
        this.setState(
            {
                [type]: [],
            },
            () => {
                if (type == 'gradeValue') {
                    localStorage.setItem('gradeValue', []);
                    this.getVersionList();
                } else {
                    this.showTable('清空筛选');
                }
            }
        );
    };

    handleVersionChange = (visible) => {
        this.setState({ changeVersionVisible: visible });
    };

    cancelChangeVersion = () => {
        this.setState({
            changeVersionVisible: false,
        });
    };

    changeVersionShowLoading = (status) => {
        this.setState({
            showLoading: status,
            acLoading: status,
        });
    };

    clearConditions = () => {
        const { tableView } = this.props;
        this.setState(
            {
                courseValue: [],
                selectTeacher: [],
                selectStudent: [],
                gradeValue: [],
                activityName: '',
                selectAddress: [],
            },
            () => {
                this.fetchScheduleList();
            }
        );
        if (tableView === 'weekLessonView') {
            const { dispatch } = this.props;
            dispatch({
                type: 'lessonView/clearSearchParameters',
            });
        }
    };

    // 学生视角将判断高中的样式改为false
    changeIsHigh = () => {
        this.setState({
            isHigh: false,
        });
    };

    // 全屏状态控制
    handleFullScreen = (status) => {
        this.setState({
            isFull: status,
        });
        document.documentElement.webkitRequestFullscreen(); //进入全屏
        document.webkitExitFullscreen(); //退出全屏
    };

    // 获取时间轴展示的list
    importTimeLineList = (list, start, end) => {
        this.setState(
            {
                tableTimeLine: list,
                startTimeOfDay: start,
                endTimeOfDay: end,
            },
            () => {
                let timeStr = JSON.stringify(list);
                localStorage.setItem('timeLine', timeStr);
                this.showTable('切换时间');
            }
        );
    };

    // 获取来源版课表
    fetchSourseSchedule = (versionInfo) => {
        this.setState(
            {
                currentVersion: versionInfo.versionSourceId,
            },
            () => {
                this.changeDatePicker('', versionInfo.versionSourceTime);
            }
        );
    };

    onArray = () => {
        this.setState({
            plainOptions: this.props.scheduleData,
        });
    };

    handlePublishChange = () => {
        this.setState({
            publishModal: false,
            originPublish: false,
            publishTarget: '',
            publishSourse: '',
        });
        this.childPublishModal.cleanNotice();
    };

    queryScheduleStatus = (getNoAddressResult) => {
        const { dispatch, getVersionList, hidePublishModal } = this.props;
        const { publishModal } = this.state;
        let idStr = '';
        getNoAddressResult.map((item) => {
            idStr += item.weekVersionDTO.id + ',';
        });
        this.fetchStatus = setInterval(() => {
            dispatch({
                type: 'timeTable/queryScheduleStatus',
                payload: {
                    versionIdString: idStr,
                },
            }).then(() => {
                const { scheduleStatusList } = this.props;
                if (scheduleStatusList && scheduleStatusList.length) {
                    scheduleStatusList &&
                        scheduleStatusList.length &&
                        scheduleStatusList.map((item) => {
                            getNoAddressResult.map((el) => {
                                if (item.id == el.weekVersionDTO.id) {
                                    el.weekVersionDTO.published = item.published;
                                }
                                return el;
                            });
                            return item;
                        });
                    if (publishModal) {
                        this.childPublishModal.updateResult(getNoAddressResult);
                    }
                    // 根据published判断是否都公布完成，完成停止轮询
                    let isClear = true;
                    getNoAddressResult.map((item) => {
                        const dtoPublished = item.weekVersionDTO.published;
                        if (dtoPublished === 3) {
                            isClear = false;
                        }
                    });
                    if (isClear) {
                        message.success('公布完成');
                        this.getVersionList();
                        clearInterval(this.fetchStatus);
                        this.handlePublishChange();
                    }
                }
            });
        }, 5000);
    };

    getGroupByTree = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'timeTable/getGradeByType',
            payload: {
                time: this.state.mainstartDate
                    ? this.state.mainstartDate
                    : this.getLocalTime(this.state.startTime, 4),
            },
        });
    };

    //获取相关人员和部门
    getDepartmentList() {
        const { dispatch } = this.props;
        dispatch({
            type: 'timeTable/getDepartmentList',
            payload: {
                time: this.state.mainstartDate
                    ? this.state.mainstartDate
                    : this.getLocalTime(this.state.startTime, 4),
            },
        });
    }

    handleVersionTabsChange = () => {
        const sourceEle = document.getElementsByClassName('sourceEle');
        const targetEle = document.getElementsByClassName('targetEle');

        !isEmpty(sourceEle) &&
            Array.from(sourceEle).forEach((item) => {
                item.classList.remove('sourceEle');
            });

        !isEmpty(targetEle) &&
            Array.from(targetEle).forEach((item) => {
                item.classList.remove('targetEle');
            });
    };

    //根据weekday展开节次列表
    getLessonListByWeekday = (key) => {
        const { scheduleDetail } = this.props;
        const { checkedList, checkChoiceAll, clickBatchOperButtonKey, ifLockAll, unLock } =
            this.state;
        const newState = JSON.parse(JSON.stringify(this.state));

        let selectKey =
            key === 6 &&
            scheduleDetail.length === 6 &&
            scheduleDetail[scheduleDetail.length - 1][0].weekDay === 7
                ? key - 1
                : key;

        //得到节次列表
        let plainOptionsWeek =
            scheduleDetail &&
            scheduleDetail.length > 0 &&
            scheduleDetail[selectKey] &&
            scheduleDetail[selectKey].map((item, index) => {
                return { label: `第 ${index + 1} 节`, value: index + 1, key: index };
            });

        newState[`checkedList${key}`] =
            plainOptionsWeek &&
            plainOptionsWeek.length > 0 &&
            plainOptionsWeek.map((item) => {
                return item.value;
            });

        // 触发全部锁定并且是在点击批量锁定的情况下
        if (ifLockAll == true && clickBatchOperButtonKey == 0) {
            newState[`checkChoiceAll${key}`] = this.state.checkChoiceAll;

            this.setState({
                ...newState,
                plainOptionsWeek,
                weekDayRow: key,
                unLock: false,
            });
        } else {
            if (this.state[`checkChoiceAll${key}`]) {
                this.setState({
                    ...newState,
                    plainOptionsWeek,
                    weekDayRow: key,
                });
            } else {
                this.setState({
                    plainOptionsWeek,
                    weekDayRow: key,
                });
            }
            if (unLock == true && clickBatchOperButtonKey == 0) {
                newState[`checkedList${key}`] = [];
                newState[`checkChoiceAll${key}`] = false;
                this.setState({
                    ...newState,
                    plainOptionsWeek,
                    weekDayRow: key,
                    ifLockAll: false,
                });
            } else {
                if (this.state[`checkChoiceAll${key}`]) {
                    this.setState({
                        ...newState,
                        plainOptionsWeek,
                        weekDayRow: key,
                    });
                } else {
                    this.setState({
                        plainOptionsWeek,
                        weekDayRow: key,
                    });
                }
            }
        }
    };

    //置空所有选择的课节
    choiceAllNull = () => {
        const { dispatch, bathCourseList, lockCourseArr } = this.props;
        const newState = JSON.parse(JSON.stringify(this.state));
        [0, 1, 2, 3, 4, 5, 6].forEach((item) => {
            newState[`checkChoiceAll${item}`] = false;
            newState[`checkedList${item}`] = [];
        });
        this.setState({
            ...newState,
        });
        dispatch(
            {
                type: 'timeTable/emptyChoiceCourseArr',
            },
            () => {}
        );
    };

    getScheduleId = () => {
        const { scheduleData } = this.props;
        let firstClassAndWeekday = scheduleData[0].resultList[0];
        return firstClassAndWeekday.find((item) => item.baseScheduleId)?.baseScheduleId;
    };

    //格式化年级
    formatClass(arr) {
        if (!arr || arr.length == 0) return;
        return arr.map((el, index) => {
            return (
                <em key={el.id} className={styles.clickKeyClass}>
                    {el.englishName} {index == arr.length - 1 ? '' : ','}
                </em>
            );
        });
    }

    changeClassValue = (value) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'rules/scheduleDetail',
            payload: {
                scheduleId: value,
            },
        });
        this.setState({
            selectValue: value,
        });
    };

    changeSessionLeft = (value) => {
        this.setState({
            sessionValueLeft: value,
        });
    };

    changeSessionRight = (value) => {
        this.setState({
            sessionValueRight: value,
        });
    };

    changeType = (value) => {
        this.setState({
            changeClassType: value,
            sessionValueLeft: undefined,
            sessionValueRight: undefined,
        });
    };

    batchChangeLesson = () => {
        const { dispatch, clickKeuScheduleList, scheduleDetail } = this.props;
        const {
            changeClassType,
            sessionValueLeft,
            sessionValueRight,
            selectValue,
            modalValue,
            currentVersion,
        } = this.state;
        this.setState({
            showWillChangeClass: false,
        });
        if (modalValue == 1) {
            if (sessionValueLeft == sessionValueRight) {
                message.warn('相同的课节不能进行调换！');
                return;
            }
            if (!sessionValueLeft || !sessionValueRight) {
                message.warn('请选择课节后再进行操作！');
                return;
            } else {
                let tempValue = '';
                clickKeuScheduleList &&
                    clickKeuScheduleList.length &&
                    clickKeuScheduleList.map((item, index) => {
                        if (item.scheduleId == selectValue) {
                            item.gradeList &&
                                item.gradeList.length &&
                                item.gradeList.map((el, ind) => {
                                    if (ind == 0) {
                                        tempValue += el.englishName;
                                    } else {
                                        tempValue += `,${el.englishName}`;
                                    }
                                    return tempValue;
                                });
                        }
                        return tempValue;
                    });

                if (changeClassType == 1) {
                    scheduleDetail &&
                        scheduleDetail.length &&
                        scheduleDetail.forEach((item, index) => {
                            item &&
                                item.length &&
                                item.forEach((el, ind) => {
                                    if (el.id == sessionValueLeft) {
                                        this.setState({
                                            sequenceString1: `周${intoChineseLang(el.weekDay)}第${
                                                el.sort
                                            }节`,
                                        });
                                    }
                                    if (el.id == sessionValueRight) {
                                        this.setState({
                                            sequenceString2: `周${intoChineseLang(el.weekDay)}第${
                                                el.sort
                                            }节`,
                                        });
                                    }
                                });
                        });
                } else if (changeClassType == 2) {
                    this.setState({
                        weekdayString1: `周${intoChineseLang(sessionValueLeft)}`,
                        weekdayString2: `周${intoChineseLang(sessionValueRight)}`,
                    });
                }

                this.setState({
                    modalValue: 2,
                    classValue: tempValue,
                });
            }
        } else if (modalValue == 2) {
            let payload1 = {
                type: 6,
                exchangeDetailIdA: sessionValueLeft,
                exchangeDetailIdB: sessionValueRight,
                versionId: currentVersion,
            };
            let payload2 = {
                type: 7,
                scheduleId: selectValue,
                targetWeekday: sessionValueLeft,
                weekday: sessionValueRight,
                versionId: currentVersion,
            };
            dispatch({
                type: 'timeTable/confirmUpdate',
                payload: changeClassType == 1 ? payload1 : changeClassType == 2 ? payload2 : {},
            }).then(() => {
                const { confirmStatus } = this.props;
                if (confirmStatus.status == false) {
                    this.setState({
                        modalValue: 3,
                        errorMessage: confirmStatus.message,
                    });
                } else {
                    this.fetchScheduleList();
                    this.setState({
                        changeVisible: false,
                        modalValue: 1,
                        sessionValueLeft: undefined,
                        sessionValueRight: undefined,
                        changeClassType: 1,
                    });
                }
            });
        } else if (modalValue == 3) {
            this.setState({
                modalValue: 1,
            });
        }
    };

    cancelChange = () => {
        const { modalValue } = this.state;
        if (modalValue == 2) {
            this.setState({
                modalValue: 1,
                sessionValueLeft: undefined,
                sessionValueRight: undefined,
                changeClassType: 1,
            });
        } else {
            this.setState({
                changeVisible: false,
                showWillChangeClass: false,
                sessionValueLeft: undefined,
                sessionValueRight: undefined,
                changeClassType: 1,
            });
        }
    };
    //获取待排区域第一节课
    getFirstWillArrangeCourse = () => {
        const { arrangeDetailList } = this.props;

        let courseList = [];
        if (arrangeDetailList && arrangeDetailList[0]) {
            if (arrangeDetailList[0].singleModels && arrangeDetailList[0].doubleModels) {
                courseList = arrangeDetailList[0].singleModels.concat(
                    arrangeDetailList[0].doubleModels
                );
            } else {
                courseList = arrangeDetailList[0].singleModels
                    ? arrangeDetailList[0].singleModels
                    : arrangeDetailList[0].doubleModels
                    ? arrangeDetailList[0].doubleModels
                    : [];
            }
        }
        return courseList;
    };

    //不请求接口手动存储list
    getSetArrangeDetailPayload = (type) => {
        const { arrangeDetailListTotal } = this.props;
        const {
            studentGroups,
            assistantTeachers,
            mainTeachers,
            acId,
            createTime,
            endTimeMillion,
            modifyTime,
            startTimeMillion,
            state,

            //新增
            compareGroupIdList,
            courseEnglishName,
            courseId,
            courseName,
            duration,
            frequency,
            groupId,
            isBuffer,
            isLock,
            roomEnglishName,
            roomId,
            roomName,
            singleTime,
            versionId,
            weekTeachingPlanningId,
        } = this.props.courseDetail;

        //targetIndex表示在weekCoursePlanningDetailView找到的courseDetail班级 index

        let targetIndex = arrangeDetailListTotal.weekCoursePlanningDetailView?.findIndex((item) =>
            isEqual(
                item.studentGroups.map((item) => item.id),
                studentGroups.map((item) => item.id)
            )
        );

        if (type === 'add') {
            if (targetIndex !== undefined && targetIndex !== -1) {
                return {
                    ...arrangeDetailListTotal,
                    weekCoursePlanningDetailView:
                        arrangeDetailListTotal.weekCoursePlanningDetailView.map((item) => {
                            if (
                                isEqual(
                                    item.studentGroups.map((item) => item.id),
                                    studentGroups.map((item) => item.id)
                                )
                            ) {
                                let singleOrDouble =
                                    duration === 1 ? 'singleModels' : 'doubleModels';
                                return {
                                    ...item,
                                    [singleOrDouble]: [
                                        {
                                            assistantTeachers,
                                            detail: {
                                                compareGroupIdList,
                                                courseEnglishName,
                                                courseId,
                                                courseName,
                                                duration,
                                                frequency,
                                                groupId,
                                                isBuffer,
                                                isLock,
                                                roomEnglishName,
                                                roomId,
                                                roomName,
                                                singleTime,
                                                versionId,
                                                weekTeachingPlanningId,
                                                id: acId,
                                                acTime: singleTime,
                                                createTime: createTime, // ?
                                                endTime: endTimeMillion,
                                                modifyTime: modifyTime, // ?
                                                startTime: startTimeMillion,
                                                state: state, // ?
                                            },
                                            mainTeachers,
                                            studentGroups: studentGroups.map((item) => {
                                                return {
                                                    englishName: item.englishName,
                                                    gradeId: item.grade,
                                                    id: item.id,
                                                    name: item.groupAbbreviation
                                                        ? item.groupAbbreviation
                                                        : item.name,
                                                };
                                            }),
                                        },
                                        ...item[singleOrDouble],
                                    ],
                                };
                            } else {
                                return item;
                            }
                        }),
                };
            } else {
                let addItem = [
                    {
                        assistantTeachers,
                        detail: {
                            compareGroupIdList,
                            courseEnglishName,
                            courseId,
                            courseName,
                            duration,
                            frequency,
                            groupId,
                            isBuffer,
                            isLock,
                            roomEnglishName,
                            roomId,
                            roomName,
                            singleTime,
                            versionId,
                            weekTeachingPlanningId,
                            id: acId,
                            acTime: singleTime,
                            createTime: createTime, // ?
                            endTime: endTimeMillion,
                            modifyTime: modifyTime, // ?
                            startTime: startTimeMillion,
                            state: state, // ?
                        },
                        mainTeachers,
                        studentGroups: studentGroups.map((item) => {
                            return {
                                englishName: item.englishName,
                                gradeId: item.grade,
                                id: item.id,
                                name: item.groupAbbreviation ? item.groupAbbreviation : item.name,
                            };
                        }),
                    },
                ];
                return {
                    ...arrangeDetailListTotal,
                    weekCoursePlanningDetailView: [
                        {
                            studentGroups,
                            doubleModels: duration === 1 ? [] : addItem,
                            singleModels: duration === 1 ? addItem : [],
                        },
                        ...(arrangeDetailListTotal.weekCoursePlanningDetailView
                            ? arrangeDetailListTotal.weekCoursePlanningDetailView
                            : []),
                    ],
                };
            }
        } else if (type === 'decrease') {
            // deleteFlag 表示当doubleModels长度 + singleModels长度 为1时，需要将weekCoursePlanningDetailView 中
            // 的item整个删掉
            let doubleModels =
                arrangeDetailListTotal.weekCoursePlanningDetailView[targetIndex].doubleModels;
            let singleModels =
                arrangeDetailListTotal.weekCoursePlanningDetailView[targetIndex].singleModels;
            let deleteFlag =
                (!isEmpty(doubleModels) ? doubleModels.length : 0) +
                (!isEmpty(singleModels) ? singleModels.length : 0);
            if (deleteFlag !== 1) {
                //是否是连堂课
                let lessonType = duration === 2 ? 'doubleModels' : 'singleModels';
                return {
                    ...arrangeDetailListTotal,
                    weekCoursePlanningDetailView:
                        arrangeDetailListTotal.weekCoursePlanningDetailView.map((item) => {
                            return {
                                ...item,
                                [lessonType]: !isEmpty(item[lessonType])
                                    ? item[lessonType].filter((item) => item.detail.id !== acId)
                                    : [],
                            };
                        }),
                };
            } else {
                return {
                    ...arrangeDetailListTotal,
                    weekCoursePlanningDetailView:
                        arrangeDetailListTotal.weekCoursePlanningDetailView.filter(
                            (_, index) => index !== targetIndex
                        ),
                };
            }
        }
    };

    //不请求接口手动存储course
    getSetCourseListPayload = (type) => {
        let sum = 0, //课程总数
            arrangeSum = 0, //课程在待排list数目
            alreadySum = 0, //课程在已排list数目
            alreadyIndex = null, //课程在已排list index
            arrangeIndex = null; //课程在待排list index

        const {
            courseDetail: { courseEnglishName: englishName, courseId: id, courseName: name },
            acCourseList: {
                allCourseAlreadyArrangeAcSum,
                allCourseNotArrangeAcSum,
                courseAlreadyArrangeModels,
                courseModels,
            },
        } = this.props;
        courseAlreadyArrangeModels.forEach((item, index) => {
            if (item.id === id) {
                alreadyIndex = index;
                alreadySum = item.planningDetailAlreadyArrangeSum;
                sum = item.planningDetailSum;
            }
        });
        courseModels.forEach((item, index) => {
            if (item.id === id) {
                arrangeIndex = index;
                arrangeSum = item.planningDetailArrangeSum;
                sum = item.planningDetailSum;
            }
        });

        if (type === 'add') {
            //已排科目课程如果只剩一个，把整个科目删掉
            //大于一个，科目的课程数目-1
            if (alreadySum === 1) {
                courseAlreadyArrangeModels.splice(alreadyIndex, 1);
            } else {
                courseAlreadyArrangeModels.splice(alreadyIndex, 1, {
                    englishName,
                    id,
                    name,
                    planningDetailAlreadyArrangeSum: alreadySum - 1,
                    planningDetailSum: sum,
                });
            }

            //如果待排列表有转待排的科目，课程数目+1， 否则新建一个科目放到首位
            if (arrangeIndex !== null) {
                courseModels.splice(arrangeIndex, 1, {
                    englishName,
                    id,
                    name,
                    planningDetailArrangeSum: arrangeSum + 1,
                    planningDetailSum: sum,
                });
            } else {
                courseModels.splice(_, _, {
                    englishName,
                    id,
                    name,
                    planningDetailArrangeSum: 1,
                    planningDetailSum: sum,
                });
            }
            return {
                allCourseAlreadyArrangeAcSum: allCourseAlreadyArrangeAcSum - 1,
                allCourseNotArrangeAcSum: allCourseNotArrangeAcSum + 1,
                courseAlreadyArrangeModels,
                courseModels,
            };
        } else if (type === 'decrease') {
            //待排科目课程如果只剩一个，把整个科目删掉
            //大于一个，科目的课程数目-1
            if (arrangeSum === 1) {
                courseModels.splice(arrangeIndex, 1);
            } else {
                courseModels.splice(arrangeIndex, 1, {
                    englishName,
                    id,
                    name,
                    planningDetailArrangeSum: arrangeSum - 1,
                    planningDetailSum: sum,
                });
            }

            //如果已待排课表有排课的科目，课程数目+1，否则新建一个科目放在首位
            if (alreadyIndex !== null) {
                courseAlreadyArrangeModels.splice(alreadyIndex, 1, {
                    englishName,
                    id,
                    name,
                    planningDetailAlreadyArrangeSum: alreadySum + 1,
                    planningDetailSum: sum,
                });
            } else {
                courseAlreadyArrangeModels.splice(_, _, {
                    englishName,
                    id,
                    name,
                    planningDetailAlreadyArrangeSum: 1,
                    planningDetailSum: sum,
                });
            }
            return {
                allCourseAlreadyArrangeAcSum: allCourseAlreadyArrangeAcSum + 1,
                allCourseNotArrangeAcSum: allCourseNotArrangeAcSum - 1,
                courseAlreadyArrangeModels,
                courseModels,
            };
        }
    };

    exportToSet = () => {
        window.open(`/api/course/manager/exportCourseExcel`);
        // this.childCourse.clearCourseId();
    };

    getStudentGroupList = () => {
        const { dispatch } = this.props;
        const { currentVersion } = this.state;
        return dispatch({
            type: 'rules/newClassGroupList',
            payload: {
                versionId: currentVersion,
            },
        });
    };

    getLessonViewMsg = async (isFirstScreenLoading) => {
        //isFirstScreenLoading 表示是不是首屏加载
        console.log('getLessonViewMsg');
        const {
            dispatch,
            newClassGroupList,
            lessonViewCustomValue,
            lessonViewCustomLabel,
            lessonViewScheduleData,
            customCourseSearchIndex,
        } = this.props;
        const { currentVersion } = this.state;

        //不是首屏加载，刷新参考课表
        if (!isFirstScreenLoading) {
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
                //在参考课表状态下
                formateArr.map((item) => {
                    //如果当前课表是班级课表，需要刷新该班级课表的待排列表
                    if (item.type === 'group') {
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
        }

        // 主课表当前视图为班级时
        if (customCourseSearchIndex == 0) {
            dispatch({
                type: 'lessonView/changeLessonViewCustomValue',
                payload: lessonViewCustomValue,
            });
            dispatch({
                type: 'lessonView/changeLessonViewCustomLabel',
                payload: lessonViewCustomLabel,
            });
            await dispatch({
                type: 'lessonView/changeLessonViewTableLoading',
                payload: true,
            });
            await dispatch({
                type: 'lessonView/getScheduleDataByStudentGroup',
                payload: {
                    id: currentVersion,
                    //不是首屏加载，取选择值lessonViewCustomValue，否则取第一个班
                    groupIds: lessonViewCustomValue,
                    isFirstScreenLoading,
                },
            });
            await Promise.all(
                lessonViewCustomValue.map((item) => {
                    dispatch({
                        type: 'lessonView/getClassScheduleACList',
                        payload: {
                            versionId: currentVersion,
                            adminGroupIdString: item,
                        },
                    });
                })
            );
            await dispatch({
                type: 'lessonView/changeLessonViewTableLoading',
                payload: false,
            });
        }
    };

    exitLessonViewExchangeCourse = (e) => {
        e.stopPropagation();
        const { dispatch } = this.props;
        dispatch({
            type: 'lessonView/clearConflictInformation',
            payload: {},
        });
        dispatch({
            type: 'exchangeCourse/clearMoveList',
        });
        dispatch({
            type: 'lessonView/changeLessonViewExchangeCourseStatus',
            payload: false,
        });
        dispatch({
            type: 'lessonView/changeLessonViewCustomExchangeCourseStatus',
            payload: false,
        });
        dispatch({
            type: 'lessonView/setCurrentStudentGroupSync',
            payload: '',
        });
    };

    setLessonViewClassScheduleShowType = (type) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'lessonView/setLessonViewClassScheduleShowType',
            payload: type,
        });
    };

    getVersionName = (versionItem) => {
        if (versionItem) {
            return `${versionItem.systemVersionNumber ? versionItem.systemVersionNumber : ''}${
                versionItem.createType === 0 ? '' : '系统调课'
            } ${versionItem.name}`;
        } else return '';
    };

    //改变版本后回掉
    changeVersionCallBack = async (versionId) => {
        console.log('versionId :>> ', versionId);
        const { dispatch, tableView } = this.props;

        //如果versionId不存在，代表他是空课表，置空数据
        if (!versionId) {
            dispatch({
                type: 'replace/setListVersionChangeCourseRequest',
                payload: [],
            });
            dispatch({
                type: 'timeTable/checkScheduleResult',
                payload: [],
            });
            return;
        }

        //变动中调代课申请列表待教务审批数目
        dispatch({
            type: 'replace/getListVersionChangeCourseRequest',
            payload: {
                versionId,
            },
        });

        //检查中冲突/空场地（默认只看必修课）
        dispatch({
            type: 'timeTable/scheduleCheck',
            payload: {
                versionId,
                requiredCourse: true,
            },
        });

        //课节视图相关
        if (tableView === 'weekLessonView') {
            dispatch({
                type: 'lessonView/setCustomCourseSearchIndex',
                payload: 0,
            });
            await this.getStudentGroupList();
            const { newClassGroupList } = this.props;
            if (!isEmpty(newClassGroupList)) {
                await this.updateLessonViewCustomValue();
                await this.getLessonViewMsg(true);
            } else {
                //新建课表应该清空所有数据，防止数据带过来
                dispatch({
                    type: 'lessonView/emptyLessonViewAboutData',
                });
            }
        }
    };

    updateLessonViewCustomValue = async () => {
        const { currentLang } = this.props;
        const { dispatch, newClassGroupList, lessonViewCustomValue, lessonViewCustomLabel } =
            this.props;
        let adminGroupId = newClassGroupList[0]?.studentGroupList[0].id;
        let adminGroupName =
            currentLang == 'en'
                ? newClassGroupList[0]?.studentGroupList[0].ename
                : newClassGroupList[0]?.studentGroupList[0].name;
        return Promise.all([
            dispatch({
                type: 'lessonView/changeLessonViewCustomValue',
                payload: [adminGroupId],
            }),
            dispatch({
                type: 'lessonView/changeLessonViewCustomLabel',
                payload: [adminGroupName],
            }),
        ]);
    };

    //周节视图获取自定义课表
    getCustomScheduleInLessonView = (type, id) => {
        //判断自定义课表是否重复
        let judgeLessonViewCustomScheduleRepeat = (type, id) => {
            const { lessonViewScheduleData } = this.props;
            let isRepeat = false;

            let length = lessonViewScheduleData && lessonViewScheduleData.length;
            for (let i = 0; i < length; i++) {
                if (
                    id == lessonViewScheduleData[i].studentGroup.id &&
                    type == lessonViewScheduleData[i].view
                ) {
                    isRepeat = true;
                    break;
                }
            }
            return isRepeat;
        };

        //获取自定义课表
        let getCustomSchedule = (type, id) => {
            const { dispatch } = this.props;
            const { currentVersion } = this.state;
            if (type === 'teacher') {
                dispatch({
                    type: 'lessonView/findCustomSchedule',
                    payload: {
                        id: currentVersion,
                        teacherIds: [id],
                        type: 'teacher',
                        idType: 'teacherIds',
                    },
                });
            }
            if (type === 'address') {
                dispatch({
                    type: 'lessonView/findCustomSchedule',
                    payload: {
                        id: currentVersion,
                        playgroundIds: [id],
                        type: 'address',
                        idType: 'playgroundIds',
                    },
                });
            }
            if (type === 'student') {
                dispatch({
                    type: 'lessonView/findCustomSchedule',
                    payload: {
                        id: currentVersion,
                        studentIds: [id],
                        type: 'student',
                        idType: 'studentIds',
                    },
                });
            }
            if (type === 'group') {
                dispatch({
                    type: 'lessonView/findCustomSchedule',
                    payload: {
                        id: currentVersion,
                        groupIds: id,
                        type: 'group',
                        idType: 'groupIds',
                    },
                }).then(() => {
                    dispatch({
                        type: 'lessonView/getClassScheduleACList',
                        payload: {
                            versionId: currentVersion,
                            adminGroupIdString: id,
                        },
                    });
                });
            }
        };

        //展开自定义框
        let handleAddSideBarClick = async () => {
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
            await dispatch({
                type: 'lessonView/setSideBarVisible',
                payload: 'reduceSideBar',
            });
            setCustomTableRowCountBySelectValue(mainScheduleData.scheduleData);
        };

        //先判断是否重复，不重复获取自定义课表并且展开自定义框
        if (judgeLessonViewCustomScheduleRepeat(type, id)) {
            if (type == 'teacher') {
                message.info('课表已存在该教师');
            } else if (type == 'address') {
                message.info('课表已存在该场地');
            } else if (type == 'student') {
                message.info('课表已存在该学生');
            } else if (type == 'group') {
                message.info('课表已存在该班级');
            }
            return;
        }
        getCustomSchedule(type, id);
        handleAddSideBarClick();
    };

    viewChange = async (e) => {
        const { dispatch } = this.props;
        const { currentVersion } = this.state;
        dispatch({
            type: 'timeTable/setTableView',
            payload: e.target.value,
        });

        if (e.target.value === 'weekLessonView') {
            await dispatch({
                type: 'rules/newClassGroupList',
                payload: {
                    versionId: currentVersion,
                },
            });
            await this.updateLessonViewCustomValue();
            await this.getLessonViewMsg(true);
        } else {
            setTimeout(() => {
                this.setScheduleGroupIdList();
            }, 1000);
        }
        localStorage.setItem('tableView', e.target.value);
    };

    changeTakePartClassVisible = (takePartClassVisible) => {
        const { lastPublish } = this.state;
        if (lastPublish) {
            message.info('当前课表已公布，不允许进行拆连堂操作');
            this.setState({
                shwoMoreButton: false,
            });
            return;
        }
        this.setState({
            takePartClassVisible,
            shwoMoreButton: false,
        });
    };

    showCopyModal = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'timeTable/setCopyModalVisible',
            payload: true,
        });
    };

    render() {
        console.log('TimeTable render');
        // 获取列表当前视角index
        const searchIndex =
            this.childTable && this.childTable.state && this.childTable.state.searchIndex;

        // 更多筛选：教师视角只允许教师，场地视角只允许场地，学生视角不允许筛选
        // 教师、学生、自定义视角显示教师搜索，学生、自定义视角会被禁用只是显示
        let teacherAllows = searchIndex == 3 || searchIndex === 2 || searchIndex === 5;
        // 班级、年级视角
        let activeAllows = searchIndex === 0 || searchIndex === 1;
        // 场地视角
        let addressAllows = searchIndex == 4;

        const {
            gradeList,
            teacherList,
            areaList,
            versionList,
            acCourseList,
            lockCourseArr,
            deleteScheduleResult,
            scheduleDataResponse,
            choiceScheduleDetailId,
            scheduleData,
            scheduleDetail,
            unlockResultIdList,
            clickKeuScheduleList,
            tableView,
            customCourseSearchIndex,
            lessonViewExchangeCourseStatus,
            lessonViewExchangeCustomCourseStatus,
            listVersionChangeCourseRequestCount,
            scheduleCheckList,
            currentLang,
            copyModalVisible,
        } = this.props;
        const {
            currentVersion,
            gradeValue,
            courseValue,
            startTime,
            endTime,
            currentDate,
            isShowSetNewVersion,
            shwoMoreButton,
            showBatchOper,
            showWillLock,
            showWillDelete, //批量删除
            showExchangeClassTable,
            lastPublish,
            isHistoryPublish,
            filterOption,
            showMoreCondition,
            selectTeacher,
            selectAddress,
            deleteType,
            confirmDeletePop,
            isCanDelete,
            filterDisable,
            lastPublishVer,
            published,
            isNewPublish,
            changeVersionVisible,
            isNewest,
            activityName,
            isFull,
            ifExchangeLoading,
            ifMoveLoading,
            rulesModal,
            versionContrastVisible,
            showCheckPopover,
            copyResultModal,
            versionInfo,
            publishWeekVersion,
            originPublishConflict,
            showCrateTip,
            exposeModal,
            importModal,
            versionModal,
            childSearchIndex,
            childSearchLabel,
            showWillChoice,
            showWillWaitingListChoice,
            showWillCopy,
            showWillStrike,
            plainOptions,
            selectWeekday,
            selectLessons,
            deleteLoading,
            loadingMsg,
            clickBatchOperButtonKey,
            weekDayRow,
            targetLessonId,
            publishModal,
            scheduleModal,
            importPlanModal,
            changsScheduleModal,
            takePartClassVisible,
            versionComparisonModal,
            clickKeyModal,
            showFreedomCourse,
            changeVisible,
            selectValue,
            sessionValueLeft,
            sessionValueRight,
            changeClassType,
            showWillChangeClass,
            modalValue,
            classValue,
            sequenceString1,
            sequenceString2,
            weekdayString1,
            weekdayString2,
            errorMessage,
            formatCourseBySubject,
            formatAllStageGrade,
            gradeTreeKeys,
            selectStudent,
            saveActiveClassId,
            saveAddressResult,
            saveTeacherResult,
            isHigh,
            willCardLight,
            showLoading,
            startTimeOfDay,
            endTimeOfDay,

            willCourseId,
            willGroupId,
            cardUtil,
            isDoubleClick,
            studentGroup,
            arrangeModal,
            notShowWillCard,
            acLoading,
            changeVersionLoading,
            lockGray,
            importActivityVisible,
        } = this.state;

        let loadingStatus = !ifExchangeLoading && !ifMoveLoading ? false : true;
        let moreDisabled =
            (searchIndex == 3 || searchIndex == 5 || searchIndex == 2 || showExchangeClassTable) &&
            styles.moreDisabled;
        let moreDisabledUpdate = searchIndex == 5 && styles.moreDisabled;

        const courseProps = {
            treeData: formatCourseBySubject,
            value: courseValue,
            placeholder:
                currentLang != 'en' ? trans('course.plan.allcourse', '全部课程') : 'All Courses',
            onChange: this.changeCourse,
            treeCheckable: true,
            treeNodeFilterProp: 'title',
            style: {
                width: 120,
                marginRight: 8,
                verticalAlign: 'middle',
            },
            dropdownStyle: {
                maxHeight: 400,
                overflow: 'auto',
            },
            disabled: showExchangeClassTable, // 自定义、学生视角禁用筛选
            showCheckedStrategy: TreeSelect.SHOW_CHILD,
            maxTagCount: 0,
        };
        const gradeProps = {
            treeData: formatAllStageGrade,
            value: gradeValue,
            placeholder: currentLang != 'en' ? '全部年级' : 'All Grades',
            onChange: this.changeGrade,
            treeCheckable: true,
            treeNodeFilterProp: 'title',
            style: {
                width: 120,
                marginRight: 8,
                verticalAlign: 'middle',
            },
            dropdownStyle: {
                maxHeight: 600,
                overflow: 'auto',
            },
            disabled:
                showExchangeClassTable ||
                searchIndex == 5 ||
                searchIndex == 2 ||
                searchIndex == 3 ||
                searchIndex == 4, // 自定义、学生视角禁用筛选
            showCheckedStrategy: TreeSelect.SHOW_CHILD,
            maxTagCount: 0,
            maxTagPlaceholder: <span>ppp</span>,
            treeDefaultExpandedKeys: gradeTreeKeys,
        };
        let weekStart = this.getLocalTime(startTime, 1),
            weekEnd = this.getLocalTime(endTime, 3);
        //
        //将最新周的时间传给新建课表
        let createScheduleStart = this.getLocalTime(startTime, 2),
            createScheduleEnd = this.getLocalTime(endTime, 2);

        //根据版本判断操作按钮
        const isShowCreate = versionList && versionList.length > 0 ? false : true;
        //待排课
        const allCourseNotArrange = (acCourseList && acCourseList.allCourseNotArrangeAcSum) || 0;
        //已排课
        const allCourseAlreadyArrangeAcSum =
            (acCourseList && acCourseList.allCourseAlreadyArrangeAcSum) || 0;
        //更多操作按钮
        let moreOperButton = (
            <div className={styles.moreOperButton}>
                {/* <p onClick={this.importPlanModal} style={{'color': lastPublish ? '#999' :'#666'}}>导入课时计划</p> */}
                <p onClick={this.saveVersion}>{trans('global.saveAs', '保存版本')}</p>
                <p onClick={this.copyResult}>{trans('global.copyTo', '复制排课结果')}</p>
                <p onClick={this.exposeSchedule}>{trans('global.export', '导出课表')}</p>
                <p onClick={this.importSchedule}>{trans('global.import', '导入排课结果')}</p>
                {lastPublish ? (
                    <p
                        style={{
                            color: '#999',
                            width: currentLang === 'en' ? 'auto' : '100px',
                        }}
                    >
                        {trans('global.changeTimeTable', '更改作息表')}
                    </p>
                ) : (
                    <p
                        onClick={this.changsSchedule}
                        style={{ width: currentLang === 'en' ? 'auto' : '100px' }}
                    >
                        {trans('global.changeTimeTable', '更改作息表')}
                    </p>
                )}
                <p onClick={() => this.changeTakePartClassVisible(true)}>一键拆连堂</p>
            </div>
        );
        //批量操作按钮
        let batchOperButton = (
            <div className={styles.batchOperButton}>
                <p
                    onClick={this.batchLock}
                    style={{ color: showWillLock ? '#3B6FF5' : 'rgba(0,0,0,0.65)' }}
                >
                    {trans('global.batchLock', '批量锁定')}
                </p>

                <p
                    onClick={this.batchAdjustmentSection}
                    style={{ color: showWillChoice ? '#3B6FF5' : 'rgba(0,0,0,0.65)' }}
                >
                    {trans('global.batchAdjustmentSection', '批量调整节次')}
                </p>
                <p
                    onClick={this.batchTransferToWaitingList}
                    style={{ color: showWillWaitingListChoice ? '#3B6FF5' : 'rgba(0,0,0,0.65)' }}
                >
                    {trans('global.batchTransferToWaitingList', '批量转为待排')}
                </p>
                <p
                    onClick={this.batchChangeClass}
                    style={{ color: showWillChangeClass ? '#3B6FF5' : 'rgba(0,0,0,0.65)' }}
                >
                    {trans('global.batchChangeClass', '批量换课')}
                </p>
                <p
                    onClick={this.batchStrike}
                    style={{ color: showWillStrike ? '#3B6FF5' : 'rgba(0,0,0,0.65)' }}
                >
                    {trans('global.batchDelete', '批量删除')}
                </p>
                <p
                    onClick={this.batchCopy}
                    style={{ color: showWillCopy ? '#3B6FF5' : 'rgba(0,0,0,0.65)' }}
                >
                    {trans('global.batchCopy', '批量复制到')}
                </p>

                <p
                    onClick={this.batchDelete}
                    style={{ color: showWillDelete ? '#3B6FF5' : 'rgba(0,0,0,0.65)' }}
                >
                    {trans('global.delByDay', '按天删除含活动')}
                </p>
            </div>
        );

        // 新增
        let newContent = (
            <div className={styles.newContent}>
                <span
                    className={styles.newItem}
                    onClick={this.importPlanModal}
                    style={{ color: lastPublish ? '#999' : '#666' }}
                >
                    {trans('global.importLessonPlan', '导入课时计划')}
                </span>
                <span className={styles.newItem} onClick={this.createFreedomCourse}>
                    {trans('global.newEvent', '新建活动')}
                </span>
                <span className={styles.newItem} onClick={this.toggleImportActivityVisible}>
                    {trans('global.batch import activity', '批量导入活动')}
                </span>
            </div>
        );

        let deleteContent =
            deleteType.indexOf(2) == -1 ? (
                // <Spin spinning={deleteLoading} tip="正在删除...">
                <div className={styles.deleteConfirmContent}>
                    <p>您确定删除这些排课结果吗？</p>
                    <p className={styles.buttonList}>
                        <a className={styles.cancelBtn} onClick={this.handleCancelPop}>
                            取消
                        </a>
                        <a className={styles.confirmBtn} onClick={this.confirmDelete}>
                            确定
                        </a>
                    </p>
                </div>
            ) : (
                // </Spin>
                <div className={styles.deleteConfirmContent}>
                    <p>
                        您确定删除这些排课结果吗？活动安排结果一旦被删除，所有版本内的活动安排结果都将被清除哦！
                    </p>
                    <p className={styles.buttonList}>
                        <a className={styles.cancelBtn} onClick={this.handleCancelPop}>
                            取消
                        </a>
                        <a className={styles.confirmBtn} onClick={this.confirmDelete}>
                            确定
                        </a>
                    </p>
                </div>
            );

        //是否有权限查看课表
        let havePower = scheduleDataResponse && scheduleDataResponse.unauthorized; //判断用户是否有权限
        // 判断更多内是否有查询条件
        let isHaveTips =
            (selectTeacher && selectTeacher.length > 0) ||
            activityName ||
            (selectAddress && selectAddress.length > 0)
                ? true
                : false;
        if (havePower === true) {
            //用户暂无权限
            return (
                <div className={styles.timeTablePage}>
                    <div className={styles.main}>
                        <PowerPage />
                    </div>
                </div>
            );
        }
        // 全屏
        let fullScreenStyle = isFull ? styles.fullScreenStyle : '';
        let toCourseDetailState = JSON.parse(JSON.stringify(this.state));
        toCourseDetailState.courseDetail = this.props.courseDetail;

        let disabledChange = published == 3 ? styles.disabled : '';

        return (
            <div className={styles.timeTablePage}>
                <div className={styles.main}>
                    <div className={styles.headContent} id="headContent">
                        <div className={styles.searchHeader}>
                            <Radio.Group value={tableView} onChange={this.viewChange}>
                                <Radio.Button value="timeLineView">
                                    {trans('global.timeLineView', '总表')}
                                </Radio.Button>
                                <Radio.Button value="weekLessonView">
                                    {trans('global.weekLessonView', '周节')}
                                </Radio.Button>
                            </Radio.Group>
                            {tableView === 'weekLessonView' && (
                                <LessonViewCustomCourse
                                    currentVersion={currentVersion}
                                    startTimeOfDay={startTimeOfDay}
                                    endTimeOfDay={endTimeOfDay}
                                    courseValue={courseValue}
                                />
                            )}
                            <div className={styles.rightPart}>
                                {tableView !== 'weekLessonView' && (
                                    <Fragment>
                                        <div className={styles.stageAndGrade}>
                                            {courseValue && courseValue.length > 0 && (
                                                <span className={styles.tagPlaceholder}>
                                                    {courseValue.length}个课程
                                                    <span
                                                        className={styles.close}
                                                        onClick={this.clearStageAndGrade.bind(
                                                            this,
                                                            'courseValue'
                                                        )}
                                                    >
                                                        <Icon
                                                            type="close-circle"
                                                            theme="filled"
                                                            style={{ color: '#bbb' }}
                                                        />
                                                    </span>
                                                </span>
                                            )}
                                            <TreeSelect {...courseProps} />
                                        </div>
                                        {tableView !== 'weekLessonView' && (
                                            <span
                                                className={
                                                    showMoreCondition
                                                        ? styles.activeMoreCondition
                                                        : styles.showMoreCondition +
                                                          '  ' +
                                                          moreDisabled
                                                }
                                                onClick={this.showMore}
                                            >
                                                {isHaveTips && (
                                                    <span className={styles.mark}></span>
                                                )}
                                                <i className={icon.iconfont}>&#xe76c;</i>
                                            </span>
                                        )}

                                        <span
                                            className={styles.clear + '  ' + moreDisabled}
                                            onClick={this.clearConditions}
                                        >
                                            <i className={icon.iconfont}>&#xe78a;</i>
                                        </span>
                                    </Fragment>
                                )}

                                <span
                                    className={styles.update + '  ' + moreDisabledUpdate}
                                    onClick={this.updateScheduleList}
                                >
                                    <i className={icon.iconfont}>&#xe732;</i>
                                </span>
                            </div>
                            <DisplayRuleList
                                importTimeLineList={this.importTimeLineList}
                                getLessonViewMsg={this.getLessonViewMsg}
                                currentVersion={currentVersion}
                                updateLessonViewCustomValue={this.updateLessonViewCustomValue}
                                showTable={this.showTable}
                            />

                            {this.props.getSearchDateHtml(
                                <div className={styles.headerWrapper}>
                                    {
                                        <div className={styles.stageAndGrade}>
                                            {gradeValue && gradeValue.length > 0 && (
                                                <span className={styles.tagPlaceholder}>
                                                    {gradeValue.length}个年级
                                                    <span
                                                        className={styles.close}
                                                        onClick={this.clearStageAndGrade.bind(
                                                            this,
                                                            'gradeValue'
                                                        )}
                                                    >
                                                        <Icon
                                                            type="close-circle"
                                                            theme="filled"
                                                            style={{ color: '#bbb' }}
                                                        />
                                                    </span>
                                                </span>
                                            )}
                                            <TreeSelect {...gradeProps} />
                                        </div>
                                    }
                                    <div className={styles.searchDate}>
                                        {/* 顶部各种选项 */}
                                        <div className={styles.searchDateMain}>
                                            <i
                                                className={icon.iconfont + ' ' + styles.arrow}
                                                onClick={this.checkWeek.bind(this, 'left')}
                                            >
                                                &#xe619;
                                            </i>
                                            <span>
                                                {weekStart} - {weekEnd}
                                            </span>
                                            <DatePicker
                                                onChange={this.changeDatePicker}
                                                style={{ width: 20, border: 'none' }}
                                                className={styles.dateStyle}
                                                placeholder=""
                                                allowClear={false}
                                            />
                                            <i
                                                className={icon.iconfont + ' ' + styles.arrow}
                                                onClick={this.checkWeek.bind(this, 'right')}
                                            >
                                                &#xe6d1;
                                            </i>
                                        </div>
                                        {/* 测试版本 */}
                                        {versionList && versionList.length > 0 && (
                                            <div className={styles.publishVersion}>
                                                <Popover
                                                    placement="bottom"
                                                    title={null}
                                                    content={
                                                        <VersionInfo
                                                            {...this.state}
                                                            {...this.props}
                                                            getVersionList={this.getVersionList}
                                                            fetchSourseSchedule={
                                                                this.fetchSourseSchedule
                                                            }
                                                            setVersionName={this.setVersionName}
                                                            setVersionRemark={this.setVersionRemark}
                                                        />
                                                    }
                                                    trigger="click"
                                                >
                                                    <span className={styles.versionIcon}>
                                                        <Icon type="exclamation-circle" />
                                                    </span>
                                                </Popover>
                                                <Select
                                                    value={currentVersion}
                                                    onChange={this.changeVersion}
                                                    className={styles.selectVersion}
                                                    optionLabelProp="title"
                                                    dropdownClassName="versionMenu"
                                                    disabled={
                                                        loadingStatus || showExchangeClassTable
                                                    }
                                                >
                                                    {versionList &&
                                                        versionList.length > 0 &&
                                                        versionList.map((item, index) => {
                                                            return (
                                                                <Option
                                                                    value={item.id}
                                                                    key={item.id}
                                                                    title={this.getVersionName(
                                                                        item
                                                                    )}
                                                                    remark={item.remark}
                                                                    lastPublish={item.lastPublish}
                                                                    published={item.published}
                                                                    versionInfo={item}
                                                                    current={item.current}
                                                                    name={item.name}
                                                                >
                                                                    <span
                                                                        className={
                                                                            item.published
                                                                                ? styles.publishedContent
                                                                                : styles.noPublished
                                                                        }
                                                                    >
                                                                        <span
                                                                            className={styles.name}
                                                                        >
                                                                            {this.getVersionName(
                                                                                item
                                                                            )}
                                                                        </span>
                                                                        <span
                                                                            className={
                                                                                styles.unPublished
                                                                            }
                                                                        >
                                                                            {item.lastPublish
                                                                                ? trans(
                                                                                      'global.latestPublished',
                                                                                      '最新公布'
                                                                                  )
                                                                                : item.published ===
                                                                                  0
                                                                                ? trans(
                                                                                      'global.notPublished',
                                                                                      '未公布'
                                                                                  )
                                                                                : item.published ===
                                                                                  1
                                                                                ? trans(
                                                                                      'global.published',
                                                                                      '已公布'
                                                                                  )
                                                                                : item.published ===
                                                                                  2
                                                                                ? trans(
                                                                                      'global.publishedFailed',
                                                                                      '公布失败'
                                                                                  )
                                                                                : item.published ===
                                                                                  3
                                                                                ? trans(
                                                                                      'global.publishing',
                                                                                      '公布中'
                                                                                  )
                                                                                : ''}
                                                                        </span>
                                                                    </span>
                                                                </Option>
                                                            );
                                                        })}
                                                </Select>
                                                {/* isShowSetNewVersion是否显示最新版本，isHistoryPublish是否是历史发布版本 */}
                                                {
                                                    <span
                                                        className={styles.mark}
                                                        style={{
                                                            color: lastPublishVer
                                                                ? '#1476FF '
                                                                : published == 1
                                                                ? '#73D13D'
                                                                : published == 2
                                                                ? '#cb4347'
                                                                : published == 3
                                                                ? '#4d7fff'
                                                                : '#bfbfbf',
                                                        }}
                                                    >
                                                        <span className={styles.icon}>
                                                            <i className={icon.iconfont}>
                                                                &#xe637;
                                                            </i>
                                                        </span>
                                                        <span>
                                                            {lastPublishVer
                                                                ? trans(
                                                                      'global.latestPublished',
                                                                      '最新公布'
                                                                  )
                                                                : published === 0
                                                                ? trans(
                                                                      'global.notPublished',
                                                                      '未公布'
                                                                  )
                                                                : published === 1
                                                                ? trans(
                                                                      'global.published',
                                                                      '已公布'
                                                                  )
                                                                : published === 2
                                                                ? trans(
                                                                      'global.publishedFailed',
                                                                      '公布失败'
                                                                  )
                                                                : published === 3
                                                                ? trans(
                                                                      'global.publishing',
                                                                      '公布中'
                                                                  )
                                                                : null}
                                                        </span>
                                                    </span>
                                                }

                                                {/* 
                                                    1. 未公布并且不是当前版本
                                                    2. 最新公布并且不是当前版本
                                                */}
                                                {((versionInfo?.published === 0 &&
                                                    !versionInfo?.current) ||
                                                    (versionInfo?.lastPublish &&
                                                        !versionInfo?.current)) && (
                                                    <span
                                                        className={styles.setNewVersion}
                                                        onClick={this.setNewVersion}
                                                    >
                                                        {trans(
                                                            'global.setToLatestPublished',
                                                            '设为最新版本'
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.actionButton}>
                                        {isShowCreate && (
                                            <span
                                                className={styles.btn}
                                                onClick={this.showScheduleModal}
                                            >
                                                {trans('global.newTimetable', '新建课表')}
                                            </span>
                                        )}
                                        {/* <span
                                            className={styles.btn}
                                            onClick={this.showScheduleModal}
                                        >
                                            {trans('global.newTimetable', '新建课表')}
                                        </span> */}
                                        {!isShowCreate && !lastPublish && (
                                            <span
                                                className={styles.btn + '  ' + disabledChange}
                                                onClick={this.showClickKeyModal}
                                            >
                                                {trans('global.startGeneration', '一键排课')}
                                            </span>
                                        )}
                                        {isShowCreate && (
                                            <span
                                                className={styles.btn}
                                                onClick={this.showCopyModal}
                                            >
                                                从历史学期复制
                                            </span>
                                        )}
                                        {/*  <span className={styles.btn} onClick={this.showCopyModal}>
                                            从历史学期复制
                                        </span> */}

                                        {!isShowCreate && !lastPublish && isNewest && (
                                            <div className={styles.publishSchedule}>
                                                <span
                                                    className={styles.btn}
                                                    onClick={this.publishScheduleModal}
                                                >
                                                    {trans('global.publish', '公布课表')}
                                                </span>
                                                {publishModal ? (
                                                    <PublishSchedule
                                                        start={startTime}
                                                        end={endTime}
                                                        publishModal={this.state.publishModal}
                                                        versionInfo={versionInfo}
                                                        hidePublishModal={this.handlePublishChange}
                                                        getVersionList={this.getVersionList}
                                                        handleSearchIndex={this.handleSearchIndex}
                                                        publishShowContrastModal={
                                                            this.publishShowContrastModal
                                                        }
                                                        publishShowConflict={
                                                            this.publishShowConflict
                                                        }
                                                        queryScheduleStatus={
                                                            this.queryScheduleStatus
                                                        }
                                                        exportRef={(self) => {
                                                            this.childPublishModal = self;
                                                        }}
                                                    />
                                                ) : null}
                                            </div>
                                        )}
                                        {isNewPublish && (
                                            <Popover
                                                placement="bottomRight"
                                                title={null}
                                                content={
                                                    <ChangeVersion
                                                        {...this.props}
                                                        {...this.state}
                                                        getVersionList={this.getVersionList}
                                                        cancelChangeVersion={
                                                            this.cancelChangeVersion
                                                        }
                                                        changeVersionShowLoading={
                                                            this.changeVersionShowLoading
                                                        }
                                                        currentVersionName={
                                                            this.state.currentVersionName
                                                        }
                                                        currentVersionRemark={
                                                            this.state.currentVersionRemark
                                                        }
                                                        changeVersionVisible={changeVersionVisible}
                                                    />
                                                }
                                                trigger="click"
                                                visible={changeVersionVisible}
                                                onVisibleChange={this.handleVersionChange}
                                            >
                                                <span
                                                    className={styles.btn + '  ' + disabledChange}
                                                >
                                                    {trans('global.adjust', '调整课表')}
                                                </span>
                                            </Popover>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {showMoreCondition && (
                            <div className={styles.moreCondition}>
                                <div className={styles.searchConditionList}>
                                    <Select
                                        defaultValue={'teacher'}
                                        style={{ width: 140 }}
                                        className={styles.conditionList}
                                        onChange={this.changeCondition}
                                        value={filterOption}
                                        disabled={filterDisable}
                                    >
                                        {(teacherAllows || activeAllows) && (
                                            <Option value="teacher">
                                                {trans('global.By Teacher', '按教师搜索')}
                                            </Option>
                                        )}
                                        {activeAllows && (
                                            <Option value="freeName">
                                                {trans(
                                                    'global.By Activity Title',
                                                    '按活动主题搜索'
                                                )}
                                            </Option>
                                        )}
                                        {(addressAllows || activeAllows) && (
                                            <Option value="address">
                                                {trans('global.By Space', '按场地搜索')}
                                            </Option>
                                        )}
                                    </Select>
                                    {filterOption == 'teacher' && (
                                        <Select
                                            mode="multiple"
                                            value={selectTeacher}
                                            style={{ width: 180 }}
                                            placeholder={trans(
                                                'global.searchTea',
                                                '搜一个老师试试看...'
                                            )}
                                            className={styles.searchTeacher}
                                            onChange={this.changeTeacher}
                                            optionFilterProp="children"
                                            disabled={filterDisable}
                                        >
                                            {teacherList &&
                                                teacherList.length > 0 &&
                                                teacherList.map((item) => {
                                                    return (
                                                        <Option
                                                            value={item.teacherId}
                                                            key={item.teacherId}
                                                        >
                                                            {item.name} {item.englishName}
                                                        </Option>
                                                    );
                                                })}
                                        </Select>
                                    )}
                                    {filterOption == 'freeName' && (
                                        <Search
                                            placeholder="输入活动名称试试看..."
                                            onSearch={this.searchActivity}
                                            style={{ width: 180 }}
                                            className={styles.searchInputStyle}
                                        />
                                    )}
                                    {filterOption == 'address' && (
                                        <Select
                                            mode="multiple"
                                            value={selectAddress}
                                            style={{ width: 180 }}
                                            placeholder="搜一个场地试试看..."
                                            className={styles.searchTeacher}
                                            onChange={this.changeAddress}
                                            optionFilterProp="children"
                                        >
                                            {areaList &&
                                                areaList.length > 0 &&
                                                areaList.map((item) => {
                                                    return (
                                                        <Option value={item.id} key={item.id}>
                                                            {item.name}
                                                        </Option>
                                                    );
                                                })}
                                        </Select>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={styles.mainContent + '  ' + fullScreenStyle}>
                        <div className={styles.scheduleContain}>
                            <div className={styles.scheduleBkg}>
                                {tableView === 'weekLessonView' && currentVersion ? (
                                    //课节视图
                                    <LessonView
                                        onRef={(self) => {
                                            this.childTable = self;
                                        }}
                                        currentVersion={currentVersion}
                                        startTimeOfDay={startTimeOfDay}
                                        endTimeOfDay={endTimeOfDay}
                                        courseValue={courseValue}
                                        judgeCurrent={this.judgeCurrent}
                                        getLessonViewMsg={this.getLessonViewMsg}
                                        getshowAcCourseList={this.getshowAcCourseList}
                                        transmitState={this.transmitState}
                                        saveCustomValue={this.saveCustomValue}
                                        getCustomResult={this.getCustomResult}
                                        getCustomStudentList={this.getCustomStudentList}
                                        lastPublish={lastPublish}
                                        showRulesModal={this.showRulesModalAndPosition}
                                        getCustomScheduleInLessonView={
                                            this.getCustomScheduleInLessonView
                                        }
                                    />
                                ) : showExchangeClassTable ? (
                                    // 展示调换课的课程表行的内容
                                    <ExchangeCourse
                                        currentDate={currentDate}
                                        fetchScheduleList={this.fetchScheduleList}
                                        fetchCourseList={this.fetchCourseList}
                                        exchangeClass={this.exchangeClass}
                                        self={this}
                                        onRef={this.onRef}
                                        setCardUtil={this.setCardUtil}
                                        getWillCardUtil={this.getWillCardUtil}
                                        validateCanChange={this.validateCanChange}
                                        getExchangeResult={this.getExchangeResult}
                                        {...this.props}
                                        {...this.state}
                                        {...this.childTable.state}
                                        showTable={this.showTable}
                                        judgeCurrent={this.judgeCurrent}
                                        fetchWillArrangeList={this.fetchWillArrangeList}
                                        fetchWillArrangeListFromWill={
                                            this.will.fetchWillArrangeList
                                        }
                                        willDoubleCard={this.props.willDoubleCard}
                                        getshowAcCourseList={this.getshowAcCourseList}
                                        getWillGroupList={this.getWillGroupList}
                                        nextClickClear={this.will.nextClickClear}
                                        fetchCourseDetail={this.fetchCourseDetail}
                                        getArrangeListFirst={this.getArrangeListFirst}
                                        saveDetailId={this.saveDetailId}
                                        willCardLightState={this.willCardLightState}
                                        willCardUtil={this.state.cardUtil}
                                        newCanCheckScheduleList={this.props.newCanCheckScheduleList}
                                        studentId={this.state.studentGroupId}
                                        setIsDoubleClickFalse={this.setIsDoubleClickFalse}
                                        setNotShowWillCard={this.setNotShowWillCard}
                                        newCanChangeCourse={this.props.newCanChangeCourse}
                                        showRulesModal={this.showRulesModalAndPosition}
                                        timeLine={this.state.tableTimeLine}
                                    />
                                ) : (
                                    // 不展示调换课的课程表行的内容
                                    <ScheduleTable
                                        deleteLoading={deleteLoading}
                                        loadingMsg={loadingMsg}
                                        getLessonListByWeekday={this.getLessonListByWeekday}
                                        studentGroupIdList={this.state.studentGroupIdList}
                                        onChangeWaitingListChoice={this.onChangeWaitingListChoice}
                                        onChangeStrike={this.onChangeStrike}
                                        setCardUtil={this.setCardUtil}
                                        showTable={this.showTable}
                                        currentDate={currentDate}
                                        fetchScheduleList={this.fetchScheduleList}
                                        fetchCourseList={this.fetchCourseList}
                                        self={this}
                                        onRef={(self) => {
                                            this.childTable = self;
                                        }}
                                        exchangeClass={this.exchangeClass}
                                        statisticsDeleteResult={this.statisticsDeleteResult}
                                        getCustomResult={this.getCustomResult} // 自定义查询结果
                                        getCourseView={this.getCourseView} // 切换视角改变更多筛选默认回显值
                                        setLock={this.setLock}
                                        showArrange={this.showArrange}
                                        fetchCourseDetail={this.fetchCourseDetail}
                                        saveDetailId={this.saveDetailId}
                                        changeIsHigh={this.changeIsHigh}
                                        willCardLightState={this.willCardLightState}
                                        setIfExchangeLoading={this.setIfExchangeLoading}
                                        getClickTableExchangeResult={
                                            this.getClickTableExchangeResult
                                        }
                                        getGradeList={this.getGradeList}
                                        getGroupList={this.getGroupList}
                                        getCustomStudentList={this.getCustomStudentList}
                                        getshowAcCourseList={this.getshowAcCourseList}
                                        setScheduleGroupIdList={this.setScheduleGroupIdList}
                                        clearScheduleGroupIdList={this.clearScheduleGroupIdList}
                                        saveCustomValue={this.saveCustomValue}
                                        //新增
                                        timeLine={this.state.tableTimeLine}
                                        showWillDelete={showWillDelete}
                                        showWillChoice={showWillChoice}
                                        showWillWaitingListChoice={showWillWaitingListChoice}
                                        showWillCopy={showWillCopy}
                                        showWillStrike={showWillStrike}
                                        showWillLock={showWillLock}
                                        currentVersion={currentVersion}
                                        lastPublish={lastPublish}
                                        selectStudent={selectStudent}
                                        saveActiveClassId={saveActiveClassId}
                                        saveAddressResult={saveAddressResult}
                                        saveTeacherResult={saveTeacherResult}
                                        isHigh={isHigh}
                                        willCardLight={willCardLight}
                                        showLoading={showLoading}
                                        startTimeOfDay={startTimeOfDay}
                                        endTimeOfDay={endTimeOfDay}
                                        fetchWillArrangeList={this.fetchWillArrangeList}
                                        //批量操作影响
                                        plainOptionsWeek={this.state.plainOptionsWeek}
                                        onChoiceAllLessonChange={this.onChoiceAllLessonChange}
                                        onChoiceLessonChange={this.onChoiceLessonChange}
                                        checkChoiceAll={
                                            this.state[`checkChoiceAll${this.state.weekDayRow}`]
                                        }
                                        checkedList={
                                            this.state[`checkedList${this.state.weekDayRow}`]
                                        }
                                        //后来加
                                        isFull={isFull}
                                        getGroupByTree={this.getGroupByTree}
                                        currentTime={this.state.mainstartDate}
                                        getCustomResultForEfficient={
                                            this.getCustomResultForEfficient
                                        }
                                    />
                                )}
                            </div>
                        </div>
                        <div className={styles.rightMenu}>
                            <div className={styles.operBtnList}>
                                {!isFull && (
                                    <span
                                        className={styles.fullScreen}
                                        onClick={this.handleFullScreen.bind(this, true)}
                                    >
                                        <i className={icon.iconfont + ' ' + styles.iconStyle}>
                                            &#xe7be;
                                        </i>
                                    </span>
                                )}
                                {isFull && (
                                    <span
                                        className={styles.exitFullScreen}
                                        onClick={this.handleFullScreen.bind(this, false)}
                                    >
                                        <i className={icon.iconfont + ' ' + styles.iconStyle}>
                                            &#xe7c3;
                                        </i>
                                    </span>
                                )}
                                {currentVersion ? (
                                    <span
                                        className={styles.whiteButton}
                                        onClick={this.showContrastModal}
                                    >
                                        <Badge count={listVersionChangeCourseRequestCount}>
                                            <i className={icon.iconfont + ' ' + styles.iconStyle}>
                                                &#xe77c;
                                            </i>
                                        </Badge>

                                        <span className={styles.text}>
                                            {trans('global.changes', '变动')}
                                        </span>
                                    </span>
                                ) : null}
                                <div
                                    className={styles.whiteButton}
                                    onClick={this.handleCheckVisible}
                                >
                                    <Badge count={scheduleCheckList.length}>
                                        <i className={icon.iconfont + ' ' + styles.iconStyle}>
                                            &#xe81c;
                                        </i>
                                    </Badge>

                                    <span className={styles.text}>
                                        {trans('global.check', '检查')}
                                    </span>
                                    {showCheckPopover ? (
                                        <CheckVersionConflict
                                            closeCheckVisible={this.closeCheckVisible}
                                            visible={showCheckPopover}
                                            currentVersion={
                                                originPublishConflict
                                                    ? publishWeekVersion
                                                    : currentVersion
                                            }
                                            searchIndex={
                                                this.childTable && this.childTable.state.searchIndex
                                            }
                                            showExchangeClassTable={showExchangeClassTable}
                                            scheduleData={this.props.scheduleData}
                                            getCustomScheduleInLessonView={
                                                this.getCustomScheduleInLessonView
                                            }
                                        />
                                    ) : null}
                                </div>
                                <span className={styles.whiteButton} onClick={this.showRulesModal}>
                                    <i className={icon.iconfont + ' ' + styles.iconStyle}>
                                        &#xe89a;
                                    </i>
                                    <span className={styles.text}>
                                        {trans('global.rules', '规则')}
                                    </span>
                                </span>
                                <Popover
                                    placement="left"
                                    content={batchOperButton}
                                    title={null}
                                    trigger="click"
                                    visible={showBatchOper}
                                    onVisibleChange={this.handleBatchVisible}
                                >
                                    <span className={styles.whiteButton}>
                                        <i className={icon.iconfont + ' ' + styles.iconStyle}>
                                            &#xe62d;
                                        </i>
                                        <span className={styles.text}>
                                            {trans('global.menuLock', '批量')}
                                        </span>
                                    </span>
                                </Popover>

                                {!showExchangeClassTable && !showWillLock && (
                                    <span className={styles.whiteButton}>
                                        <Popover placement="left" content={newContent} title={null}>
                                            <Icon type="plus" />
                                            <span className={styles.text}>
                                                {trans('global.add', '新增')}
                                            </span>
                                        </Popover>
                                    </span>
                                )}
                                <Popover
                                    placement="left"
                                    content={moreOperButton}
                                    title={null}
                                    trigger="click"
                                    visible={shwoMoreButton}
                                    onVisibleChange={this.handleMoreVisible}
                                >
                                    <span className={styles.whiteButton}>
                                        <i className={icon.iconfont + ' ' + styles.iconStyle}>
                                            &#xe6fd;
                                        </i>
                                        <span className={styles.text}>
                                            {trans('global.more', '更多')}
                                        </span>
                                    </span>
                                </Popover>
                            </div>
                        </div>
                    </div>
                    {!showWillLock && !showWillDelete && acCourseList && currentVersion && (
                        <div className={styles.waitingCard} onClick={this.showArrange}>
                            <div className={styles.waitHave}>
                                <span>
                                    {trans('global.toBeArranged', '待排课程')}（
                                    {allCourseNotArrange}）
                                </span>
                                <span className={styles.noActive}>
                                    {trans('global.arranged', '已排课程')}（
                                    {allCourseAlreadyArrangeAcSum}）
                                </span>
                            </div>
                            <div className={styles.courseDetail}>
                                <CourseDetail
                                    {...this.props}
                                    {...toCourseDetailState}
                                    getArrangeListFirst={this.getArrangeListFirst}
                                    fetchCourseDetail={this.fetchCourseDetail}
                                    fetchCourseList={this.fetchCourseList}
                                    showTable={this.showTable}
                                    courseFirstId={this.state.courseFirstId}
                                    handleArrangeCourse={this.will && this.will.handleArrangeCourse}
                                    getCourseAndGroup={this.getCourseAndGroup}
                                    saveCustomValue={this.saveCustomValue}
                                    searchIndex={searchIndex}
                                    getshowAcCourseList={this.getshowAcCourseList}
                                    fetchScheduleList={this.fetchScheduleList}
                                    saveDetailId={this.saveDetailId}
                                    willCardLightState={this.willCardLightState}
                                    showExchangeClassTable={showExchangeClassTable}
                                    getLessonViewMsg={this.getLessonViewMsg}
                                    changeCourse={this.will && this.will.changeCourse}
                                    getCustomScheduleInLessonView={
                                        this.getCustomScheduleInLessonView
                                    }
                                />
                            </div>
                            {(lessonViewExchangeCourseStatus ||
                                lessonViewExchangeCustomCourseStatus) && (
                                <div
                                    className={styles.exitLessonViewExchangeCourse}
                                    onClick={this.exitLessonViewExchangeCourse}
                                >
                                    退出调课
                                </div>
                            )}
                            <div>
                                <span className={styles.openCard} onClick={this.showArrange}>
                                    {trans('global.arrangedExpand', '展开')}
                                    <i className={icon.iconfont}>&#xe614;</i>
                                </span>
                            </div>
                        </div>
                    )}

                    {/* 批量锁定 */}
                    {showWillLock && (
                        <div className={styles.lockNumbers}>
                            <span className={styles.leftButton}>
                                <a onClick={this.lockAll}>{trans('global.lockAll', '全部锁定')}</a>
                                <a onClick={this.unLockAll}>
                                    {trans('global.unlockAll', '全部解锁')}
                                </a>
                            </span>
                            <span className={styles.rightButton}>
                                <a>
                                    {trans('global.locked', '已锁定')}：
                                    {(lockCourseArr && lockCourseArr.length) || 0}
                                    {trans('global.lockLessons', '个课节')}
                                </a>
                                <a className={styles.cancelBtn} onClick={this.cancelLock}>
                                    {trans('global.cancelTimeTable', '取消')}
                                </a>
                                <a className={styles.confirmBtn} onClick={this.finishLock}>
                                    {trans('global.lock', '完成')}
                                </a>
                            </span>
                        </div>
                    )}

                    {/* 批量调整节次 */}
                    {showWillChoice && (
                        <div className={styles.lockNumbers}>
                            <span className={styles.leftButton}>
                                <a>
                                    <Checkbox
                                        onChange={this.onCheckAllChangeAdjustment}
                                        checked={this.state.checkAll}
                                    >
                                        {trans('global.choiceAll', '全选')}
                                    </Checkbox>
                                </a>
                                <a>
                                    {trans('global.choiced', '已选择')}：
                                    {(lockCourseArr && lockCourseArr.length) || 0}
                                    {trans('global.lockLessons', '个课节')}
                                </a>
                            </span>
                            <span className={styles.rightButton}>
                                <span style={{ marginRight: '15px' }}>
                                    {trans('global.adjustTo', '调整到')}
                                </span>
                                <Select
                                    placeholder="请选择"
                                    style={{ width: '100px', marginRight: '15px' }}
                                    onChange={this.handleChange}
                                >
                                    {scheduleDetail &&
                                        scheduleDetail.length &&
                                        scheduleDetail.map((item, index) => {
                                            return (
                                                <Option value={index}>
                                                    {`周${intoChineseLang(item[0].weekDay)}`}
                                                </Option>
                                            );
                                        })}
                                </Select>
                                <Select
                                    placeholder="请选择"
                                    style={{ width: '100px' }}
                                    onChange={this.baseScheduleDetailIdChange}
                                >
                                    {(clickBatchOperButtonKey === 1 ||
                                        clickBatchOperButtonKey === 4) && (
                                        <Option value={-1}>节次不变</Option>
                                    )}
                                    {scheduleDetail &&
                                        scheduleDetail.length &&
                                        scheduleDetail[selectWeekday].map((item, index1) => {
                                            return (
                                                <Option value={item.id}>第 {index1 + 1} 节</Option>
                                            );
                                        })}
                                </Select>
                                <a
                                    className={styles.cancelBtn}
                                    onClick={this.cancelConfirmAdjustment}
                                >
                                    {trans('global.cancelTimeTable', '取消')}
                                </a>
                                <a className={styles.confirmBtn}>
                                    <Popconfirm
                                        placement="top"
                                        title={`确定将所选 ${
                                            (lockCourseArr && lockCourseArr.length) || 0
                                        } 个课节调整到周 ${selectWeekday + 1} 第 ${
                                            targetLessonId === -1
                                                ? this.state[`checkedList${weekDayRow}`]?.join('、')
                                                : selectLessons
                                        } 节吗？`}
                                        // title="转移"
                                        onConfirm={this.finishConfirmAdjustment}
                                        okText="确定"
                                        cancelText="取消"
                                    >
                                        {trans('global.confirmAdjustment', '确认调整')}
                                    </Popconfirm>
                                </a>
                            </span>
                        </div>
                    )}

                    {/* 批量转为待排 */}
                    {showWillWaitingListChoice && (
                        <div className={styles.lockNumbers}>
                            <span className={styles.leftButton}>
                                <a>
                                    <Checkbox
                                        // indeterminate={this.state.indeterminate}
                                        onChange={this.onCheckAllChangeTransferToWaiting}
                                        checked={this.state.checkAll}
                                    >
                                        {trans('global.choiceAll', '全选')}
                                    </Checkbox>
                                </a>
                                <a>
                                    {trans('global.choiced', '已选择')}：
                                    {(lockCourseArr && lockCourseArr.length) || 0}
                                    {trans('global.lockLessons', '个课节')}
                                </a>
                            </span>
                            <span className={styles.rightButton}>
                                <a
                                    className={styles.cancelBtn}
                                    onClick={this.cancelTransferToWaitingList}
                                >
                                    {trans('global.cancelTimeTable', '取消')}
                                </a>
                                <a className={styles.confirmBtn}>
                                    <Popconfirm
                                        placement="top"
                                        title={`确定将所选 ${
                                            (lockCourseArr && lockCourseArr.length) || 0
                                        } 个课节转为待排吗？`}
                                        onConfirm={this.finishTransferToWaitingList}
                                        okText="确定"
                                        cancelText="取消"
                                    >
                                        {trans('global.transferToWaitingList', '转为待排')}
                                    </Popconfirm>
                                </a>
                            </span>
                        </div>
                    )}

                    {/* 批量删除 */}
                    {showWillStrike && (
                        <div className={styles.lockNumbers}>
                            <span className={styles.leftButton}>
                                <a>
                                    <Checkbox
                                        // indeterminate={this.state.indeterminate}
                                        onChange={this.onCheckAllChangeStrike}
                                        checked={this.state.checkAll}
                                    >
                                        {trans('global.choiceAll', '全选')}
                                    </Checkbox>
                                </a>
                                <a>
                                    {trans('global.choiced', '已选择')}：
                                    {(lockCourseArr && lockCourseArr.length) || 0}
                                    {trans('global.lockLessons', '个课节')}
                                </a>
                            </span>
                            <span className={styles.rightButton}>
                                <a className={styles.cancelBtn} onClick={this.cancelStrike}>
                                    {trans('global.cancelTimeTable', '取消')}
                                </a>
                                <a className={styles.confirmBtn}>
                                    <Popconfirm
                                        placement="top"
                                        title={`确定将所选 ${
                                            (lockCourseArr && lockCourseArr.length) || 0
                                        } 个课节删除吗？删除后不可撤销`}
                                        onConfirm={this.finishStrike}
                                        okText="确定"
                                        cancelText="取消"
                                    >
                                        {trans('global.confirmStrike', '确认删除')}
                                    </Popconfirm>
                                </a>
                            </span>
                        </div>
                    )}

                    {/* 批量复制 */}
                    {showWillCopy && (
                        <div className={styles.lockNumbers}>
                            <span className={styles.leftButton}>
                                <a>
                                    <Checkbox
                                        onChange={this.onCheckAllChangeCopy}
                                        checked={this.state.checkAll}
                                    >
                                        {trans('global.choiceAll', '全选')}
                                    </Checkbox>
                                </a>
                                <a>
                                    {trans('global.choiced', '已选择')}：
                                    {(lockCourseArr && lockCourseArr.length) || 0}
                                    {trans('global.lockLessons', '个课节')}
                                </a>
                            </span>
                            <span className={styles.rightButton}>
                                <span style={{ marginRight: '15px' }}>
                                    {trans('global.copyTo', '复制到')}
                                </span>
                                <Select
                                    placeholder="请选择"
                                    style={{ width: '100px', marginRight: '15px' }}
                                    onChange={this.handleChange}
                                >
                                    {scheduleDetail &&
                                        scheduleDetail.length &&
                                        scheduleDetail.map((item, index) => {
                                            return (
                                                <Option value={index}>
                                                    {`周${intoChineseLang(item[0].weekDay)}`}
                                                </Option>
                                            );
                                        })}
                                </Select>
                                <Select
                                    placeholder="请选择"
                                    style={{ width: '100px' }}
                                    onChange={this.baseScheduleDetailIdChange}
                                >
                                    {(clickBatchOperButtonKey === 1 ||
                                        clickBatchOperButtonKey === 4) && (
                                        <Option value={-1}>节次不变</Option>
                                    )}
                                    {scheduleDetail &&
                                        scheduleDetail.length &&
                                        scheduleDetail[selectWeekday].map((item, index1) => {
                                            return (
                                                <Option value={item.id}>第 {index1 + 1} 节</Option>
                                            );
                                        })}
                                </Select>
                                <a className={styles.cancelBtn} onClick={this.cancelConfirmCopy}>
                                    {trans('global.cancelTimeTable', '取消')}
                                </a>
                                <a className={styles.confirmBtn}>
                                    <Popconfirm
                                        placement="top"
                                        title={`确定将所选 ${
                                            (lockCourseArr && lockCourseArr.length) || 0
                                        } 个课节复制到周 ${selectWeekday + 1} 第 ${
                                            targetLessonId === -1
                                                ? this.state[`checkedList${weekDayRow}`]?.join('、')
                                                : selectLessons
                                        } 节吗？`}
                                        onConfirm={this.finishConfirmCopy}
                                        okText="确定"
                                        cancelText="取消"
                                    >
                                        {trans('global.confirmCopy', '确认复制')}
                                    </Popconfirm>
                                </a>
                            </span>
                        </div>
                    )}

                    {showWillDelete && (
                        <div className={styles.deleteResult}>
                            <div className={styles.leftContent}>
                                <span>清空类型：</span>
                                <CheckboxGroup onChange={this.changeDeleteType} value={deleteType}>
                                    <Checkbox value={1}>系统排课结果</Checkbox>
                                    {!lastPublish && !isShowSetNewVersion && (
                                        <Checkbox value={2}>活动安排结果</Checkbox>
                                    )}
                                </CheckboxGroup>
                                {!lastPublish && !isShowSetNewVersion && (
                                    <Popover
                                        placement="top"
                                        content="若选择删除活动安排结果，所有版本内的活动安排结果都会被删除哦！"
                                    >
                                        <i className={icon.iconfont + ' ' + styles.yellowButton}>
                                            &#xe642;
                                        </i>
                                    </Popover>
                                )}
                            </div>
                            <span className={styles.rightContent}>
                                <a>
                                    已选择：
                                    {(deleteScheduleResult &&
                                        deleteScheduleResult.systemResultSum) ||
                                        0}
                                    个系统排课，
                                    {(deleteScheduleResult && deleteScheduleResult.freeResultSum) ||
                                        0}
                                    个活动安排
                                </a>
                                <a className={styles.cancelBtn} onClick={this.cancelDelete}>
                                    取消
                                </a>
                                {isCanDelete ? (
                                    <Popover
                                        placement="topRight"
                                        content={deleteContent}
                                        title={null}
                                        trigger="click"
                                        onVisibleChange={this.handleVisibleChange}
                                        visible={confirmDeletePop}
                                    >
                                        <a className={styles.confirmBtn}>确认删除</a>
                                    </Popover>
                                ) : (
                                    <a className={styles.notConfirmBtn}>确认删除</a>
                                )}
                            </span>
                        </div>
                    )}
                </div>
                {scheduleModal && (
                    <CreateSchedule
                        {...this.props}
                        {...this.state}
                        createScheduleStart={createScheduleStart}
                        createScheduleEnd={createScheduleEnd}
                        hideModal={this.hideModal}
                        getVersionList={this.getVersionList}
                    />
                )}
                {versionModal && (
                    <SaveVersionModal
                        {...this.props}
                        {...this.state}
                        hideModal={this.hideModal}
                        getVersionList={this.getVersionList}
                        currentVersionName={this.state.currentVersionName}
                        currentVersionRemark={this.state.currentVersionRemark}
                        setVersionName={this.setVersionName}
                        setVersionRemark={this.setVersionRemark}
                    />
                )}

                {copyResultModal ? (
                    <CopyResultModal
                        {...this.props}
                        {...this.state}
                        hideModal={this.hideModal}
                        getVersionList={this.getVersionList}
                        getshowAcCourseList={this.getshowAcCourseList}
                    />
                ) : null}
                {exposeModal ? (
                    <ExposeScheduleModal
                        exposeModal={this.state.exposeModal}
                        hideModal={this.hideModal}
                        versionId={
                            this.state.publishSourse && this.state.publishSourse.id
                                ? this.state.publishSourse.id
                                : currentVersion
                        }
                        gradeValue={this.state.gradeValue}
                        courseValue={this.state.courseValue}
                        searchIndex={searchIndex}
                        customSearchIndex={
                            this.childTable.childCustom &&
                            this.childTable.childCustom.state.customSelectValue
                        }
                        customGrade={this.state.customGrade}
                        customGroup={this.state.customGroup}
                        customTeacher={this.state.customTeacher}
                        customAddress={this.state.customAddress}
                        customStudent={this.state.customStudent}
                        scheduleObjectList={this.state.scheduleObjectList}
                        idNum={this.state.idNum}
                        textType={this.textType}
                        {...this.props}
                        {...this.state}
                    ></ExposeScheduleModal>
                ) : null}
                {importModal ? (
                    <ImportScheduleModal
                        importModal={this.state.importModal}
                        hideModal={this.hideModal}
                        dispatch={this.props.dispatch}
                        versionId={currentVersion}
                        fetchScheduleList={this.fetchScheduleList}
                        getshowAcCourseList={this.getshowAcCourseList}
                    ></ImportScheduleModal>
                ) : null}
                {importPlanModal && (
                    <ImportPlanModal
                        {...this.props}
                        {...this.state}
                        hideModal={this.hideModal}
                        getVersionList={this.getVersionList}
                        fetchScheduleList={this.fetchScheduleList}
                        fetchWillArrangeList={this.fetchWillArrangeList}
                        fetchCourseList={this.fetchCourseList}
                    />
                )}
                {changsScheduleModal && (
                    <ChangsScheduleModal
                        {...this.props}
                        {...this.state}
                        hideModal={this.hideModal}
                        closeChangeModal={this.closeChangeModal}
                        getVersionList={this.getVersionList}
                    />
                )}
                {takePartClassVisible && (
                    <TakePartClass
                        dispatch={this.props.dispatch}
                        currentVersion={currentVersion}
                        changeTakePartClassVisible={this.changeTakePartClassVisible}
                        takePartClassVisible={takePartClassVisible}
                        fetchScheduleList={this.fetchScheduleList}
                        getCourseAndGroup={this.getCourseAndGroup}
                    />
                )}
                {versionComparisonModal && (
                    <VersionComparisonModal
                        {...this.props}
                        {...this.state}
                        hideModal={this.hideModal}
                    />
                )}
                {rulesModal && (
                    <Rules
                        {...this.props}
                        {...this.state}
                        hideModal={this.hideModal}
                        activeTabAndTypeAndId={this.state.activeTabAndTypeAndId}
                        payloadTime={this.state.payloadTime && this.state.payloadTime}
                        getScheduleId={this.getScheduleId}
                        showTable={this.showTable}
                    />
                )}
                <WillArrangeCourse
                    hideModal={this.hideModal}
                    fetchScheduleList={this.fetchScheduleList}
                    fetchCourseList={this.fetchCourseList}
                    setLock={this.setLock}
                    getCourseDetail={this.getCourseDetail}
                    willMoveClass={this.willMoveClass}
                    onRef={(self) => {
                        this.will = self;
                    }}
                    getshowAcCourseList={this.getshowAcCourseList}
                    fetchWillArrangeList={this.fetchWillArrangeList}
                    getCourseAndGroup={this.getCourseAndGroup}
                    showTable={this.showTable}
                    fetchCourseDetail={this.fetchCourseDetail}
                    saveDetailId={this.saveDetailId}
                    setIsDoubleClick={this.setIsDoubleClick}
                    setIsDoubleClickFalse={this.setIsDoubleClickFalse}
                    setIfExchangeLoading={this.setIfExchangeLoading}
                    searchIndex={this.childTable && this.childTable.state.searchIndex}
                    doubleCardUtil={this.childTable && this.childTable.state.tableCardUtil}
                    isDoubleTable={this.childTable && this.childTable.state.isDouble}
                    setNotShowWillCard={this.setNotShowWillCard}
                    saveCustomValue={this.saveCustomValue}
                    willCardLightState={this.willCardLightState}
                    getArrangeListFirst={this.getArrangeListFirst}
                    setDetailId={this.setDetailId}
                    studentGroupId={this.state.studentGroupId}
                    changeVersionShowLoading={this.changeVersionShowLoading}
                    //父子组件新增
                    willCourseId={willCourseId}
                    willGroupId={willGroupId}
                    currentVersion={currentVersion}
                    gradeValue={gradeValue}
                    cardUtil={cardUtil}
                    ifMoveLoading={ifMoveLoading}
                    ifExchangeLoading={ifExchangeLoading}
                    willCardLight={willCardLight}
                    isDoubleClick={isDoubleClick}
                    studentGroup={studentGroup}
                    showLoading={showLoading}
                    lastPublish={lastPublish}
                    arrangeModal={arrangeModal}
                    showExchangeClassTable={showExchangeClassTable}
                    notShowWillCard={notShowWillCard}
                    acLoading={acLoading}
                    changeVersionLoading={changeVersionLoading}
                    lockGray={lockGray}
                    getLessonViewMsg={this.getLessonViewMsg}
                    getCustomScheduleInLessonView={this.getCustomScheduleInLessonView}
                />
                {clickKeyModal && (
                    <ClickKeyArrange
                        {...this.props}
                        {...this.state}
                        hideModal={this.hideModal}
                        fetchScheduleList={this.fetchScheduleList}
                        fetchCourseList={this.fetchCourseList}
                        getshowAcCourseList={this.getshowAcCourseList}
                    />
                )}

                {showFreedomCourse && (
                    <FreedomCourse
                        {...this.props}
                        {...this.state}
                        timeTableOrClub="timeTable"
                        hideModal={this.hideModal}
                        getGroupByTree={this.getGroupByTree}
                        fetchScheduleList={this.fetchScheduleList}
                        showTable={this.showTable}
                        gradeByTypeArr={this.props.gradeByTypeArr}
                        payloadTime={this.state.payloadTime && this.state.payloadTime}
                    />
                )}
                {
                    //变动选项卡
                    versionContrastVisible && (
                        <div>
                            <Tabs
                                defaultActiveKey={listVersionChangeCourseRequestCount ? '3' : '1'}
                                className={styles.changeModal}
                                centered
                                tabBarExtraContent={
                                    <div>
                                        <span
                                            className={styles.close}
                                            onClick={this.hideContrastModal}
                                        >
                                            <Icon type="close" style={{ fontSize: '20px' }} />
                                        </span>
                                    </div>
                                }
                                size="large"
                                onChange={this.handleVersionTabsChange}
                            >
                                <TabPane tab={trans('global.replaceApplication', '调代课')} key="3">
                                    <ReplaceApplication
                                        versionId={
                                            this.state.publishSourse && this.state.publishSourse.id
                                                ? this.state.publishSourse.id
                                                : currentVersion
                                        }
                                    />
                                </TabPane>
                                <TabPane
                                    tab={trans('global.operationRecords', '操作记录')}
                                    key="1"
                                    tabBarStyle={{ display: 'flex', justifyContent: 'center' }}
                                >
                                    <OperationRecord
                                        versionContrastVisible={versionContrastVisible}
                                        hideContrastModal={this.hideContrastModal}
                                        start={startTime}
                                        end={endTime}
                                        versionId={
                                            this.state.publishSourse && this.state.publishSourse.id
                                                ? this.state.publishSourse.id
                                                : currentVersion
                                        }
                                        publishSourse={this.state.publishSourse}
                                        publishTarget={this.state.publishTarget}
                                        versionInfo={
                                            this.state.publishTarget && this.state.publishTarget.id
                                                ? this.state.publishTarget
                                                : versionInfo
                                        }
                                        arrangeModal={this.state.arrangeModal}
                                        fetchScheduleList={this.fetchScheduleList}
                                        fetchWillArrangeList={this.fetchWillArrangeList}
                                        currentVersion={
                                            originPublishConflict
                                                ? publishWeekVersion
                                                : currentVersion
                                        }
                                        searchIndex={
                                            this.childTable && this.childTable.state.searchIndex
                                        }
                                        showExchangeClassTable={showExchangeClassTable}
                                        scheduleData={this.props.scheduleData}
                                        dispatch={this.props.dispatch}
                                        showTable={this.showTable}
                                        setDetailId={this.setDetailId}
                                        fetchCourseList={this.fetchCourseList}
                                        published={this.state.published}
                                        getCustomScheduleInLessonView={
                                            this.getCustomScheduleInLessonView
                                        }
                                    />
                                </TabPane>
                                <TabPane
                                    tab={trans('global.scheduleComparison', '课表对比')}
                                    key="2"
                                >
                                    <VersionContrast
                                        versionContrastVisible={versionContrastVisible}
                                        hideContrastModal={this.hideContrastModal}
                                        start={startTime}
                                        end={endTime}
                                        versionId={
                                            this.state.publishSourse && this.state.publishSourse.id
                                                ? this.state.publishSourse.id
                                                : currentVersion
                                        }
                                        publishSourse={this.state.publishSourse}
                                        publishTarget={this.state.publishTarget}
                                        versionInfo={
                                            this.state.publishTarget && this.state.publishTarget.id
                                                ? this.state.publishTarget
                                                : versionInfo
                                        }
                                        arrangeModal={this.state.arrangeModal}
                                    />
                                </TabPane>
                            </Tabs>
                            <div className={styles.rightArrow}></div>
                        </div>
                    )
                }
                {showCrateTip && (
                    <Modal
                        visible={showCrateTip}
                        footer={null}
                        closable={false}
                        mask={true}
                        className="tipStyle"
                        bodyStyle={{}}
                    >
                        <div className={styles.crateTip}>
                            <span className={styles.content}>
                                当前课表已公布，只允许创建无冲突的活动；若创建的活动和已排课表有冲突，必须在未公布的课表上操作，系统才会在创建活动时删除冲突课程
                            </span>
                            <span className={styles.hasKnow} onClick={this.tipCloseHandle}>
                                我知道了
                            </span>
                        </div>
                    </Modal>
                )}
                {changeVisible && (
                    <Modal
                        visible={changeVisible}
                        title="批量换课"
                        onCancel={this.cancelChange}
                        okText={
                            modalValue == 1
                                ? '换课'
                                : modalValue == 2
                                ? '确定'
                                : modalValue == 3
                                ? '我知道了'
                                : ''
                        }
                        footer={null}
                        className={styles.modalStyle}
                        destroyOnClose={true}
                    >
                        {modalValue == 1 ? (
                            <div className={styles.changeVisible}>
                                <p style={{ display: 'flex', justifyContent: 'space-around' }}>
                                    <Select
                                        defaultValue={1}
                                        className={styles.selectStyle}
                                        onChange={this.changeType}
                                        value={changeClassType}
                                    >
                                        <Option key={1} value={1}>
                                            按节次换课
                                        </Option>
                                        <Option key={2} value={2}>
                                            按天换课
                                        </Option>
                                    </Select>
                                    <Select
                                        className={styles.classStyle}
                                        value={selectValue}
                                        onChange={this.changeClassValue}
                                    >
                                        {clickKeuScheduleList &&
                                            clickKeuScheduleList.length > 0 &&
                                            clickKeuScheduleList.map((item, index) => {
                                                return (
                                                    <Option
                                                        className={styles.radioStyle}
                                                        value={item.scheduleId}
                                                        key={index}
                                                    >
                                                        <span className={styles.classGroup}>
                                                            {this.formatClass(item.gradeList)}
                                                        </span>
                                                    </Option>
                                                );
                                            })}
                                    </Select>
                                </p>
                                <p
                                    className={styles.courseStyle}
                                    style={{ display: 'flex', justifyContent: 'space-around' }}
                                >
                                    <Select
                                        placeholder="请选择"
                                        value={sessionValueLeft}
                                        onChange={this.changeSessionLeft}
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.props.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {changeClassType == 1
                                            ? scheduleDetail &&
                                              scheduleDetail.length &&
                                              scheduleDetail.map((item, index) => {
                                                  return (
                                                      item &&
                                                      item.length &&
                                                      item.map((el, ind) => {
                                                          return (
                                                              <Option key={el.id} value={el.id}>
                                                                  {`周${intoChineseLang(
                                                                      el.weekDay
                                                                  )}第${el.sort}节`}
                                                              </Option>
                                                          );
                                                      })
                                                  );
                                              })
                                            : scheduleDetail &&
                                              scheduleDetail.length &&
                                              scheduleDetail.map((item, index) => {
                                                  return (
                                                      <Option
                                                          key={index + 1}
                                                          value={index + 1}
                                                      >{`周${intoChineseLang(index + 1)}`}</Option>
                                                  );
                                              })}
                                    </Select>
                                    <div className={styles.doubleArrow}>
                                        <div className={styles.leftTriangle}> </div>
                                        <div className={styles.connectLines}> </div>
                                        <div className={styles.rightTriangle}> </div>
                                    </div>
                                    <Select
                                        placeholder="请选择"
                                        value={sessionValueRight}
                                        onChange={this.changeSessionRight}
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.props.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {changeClassType == 1
                                            ? scheduleDetail &&
                                              scheduleDetail.length &&
                                              scheduleDetail.map((item, index) => {
                                                  return (
                                                      item &&
                                                      item.length &&
                                                      item.map((el, ind) => {
                                                          return (
                                                              <Option key={el.id} value={el.id}>
                                                                  {`周${intoChineseLang(
                                                                      el.weekDay
                                                                  )}第${el.sort}节`}
                                                              </Option>
                                                          );
                                                      })
                                                  );
                                              })
                                            : scheduleDetail &&
                                              scheduleDetail.length &&
                                              scheduleDetail.map((item, index) => {
                                                  return (
                                                      <Option
                                                          key={index + 1}
                                                          value={index + 1}
                                                      >{`周${intoChineseLang(index + 1)}`}</Option>
                                                  );
                                              })}
                                    </Select>
                                </p>
                            </div>
                        ) : modalValue == 2 && changeClassType == 1 ? (
                            <p>{`确认将 ${classValue} ${sequenceString1} 和 ${sequenceString2} 进行换课吗？`}</p>
                        ) : modalValue == 2 && changeClassType == 2 ? (
                            <p>{`确认将 ${classValue} ${weekdayString1} 和 ${weekdayString2} 全部课节进行换课吗？`}</p>
                        ) : modalValue == 3 && changeClassType == 1 ? (
                            // '换课涉及的课节中包含连堂课，暂不支持连堂课进行整体换课'
                            <p style={{ textAlign: 'center' }}>{errorMessage}</p>
                        ) : modalValue == 3 && changeClassType == 2 ? (
                            <p style={{ textAlign: 'center' }}>{errorMessage}</p>
                        ) : (
                            // '换课涉及的两天的上课节次数量不一样，暂不支持进行换课'
                            ''
                        )}
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Button
                                onClick={this.cancelChange}
                                style={{
                                    paddingLeft: '23px',
                                    paddingRight: '23px',
                                    display: modalValue == 3 ? 'none' : 'inline-block',
                                }}
                            >
                                取消
                            </Button>
                            <Button
                                onClick={this.batchChangeLesson}
                                type="primary"
                                style={{
                                    paddingLeft: '23px',
                                    paddingRight: '23px',
                                    marginLeft: '20px',
                                }}
                            >
                                {modalValue == 1
                                    ? '换课'
                                    : modalValue == 2
                                    ? '确定'
                                    : modalValue == 3
                                    ? '我知道了'
                                    : ''}
                            </Button>
                        </div>
                    </Modal>
                )}
                {importActivityVisible && (
                    <ImportActivity
                        toggleImportActivityVisible={this.toggleImportActivityVisible}
                        showTable={this.showTable}
                    />
                )}
                {copyModalVisible && <CopySchedule getVersionList={this.getVersionList} />}
            </div>
        );
    }
}
