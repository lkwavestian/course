//课程管理
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Link } from 'dva/router';
import { Input, message, Drawer, Button, Modal, Tabs, Popconfirm, Select, Icon } from 'antd';
import { trans, locale } from '../../utils/i18n';
import { intoChinese, judgeTimeIsSame } from '../../utils/utils';
import { flatten, isEqual, isEmpty } from 'lodash';
import {
    SearchOutlined,
    FilterOutlined,
    PayCircleOutlined,
    UsergroupAddOutlined,
    ClockCircleOutlined,
    CheckCircleFilled,
    CaretUpFilled,
    CaretDownFilled,
    DeleteOutlined,
} from '@ant-design/icons';
import emptyImg from '../../assets/kong.png';
import moment from 'moment';
const { confirm } = Modal;
const { TabPane } = Tabs;

var isPullDownRefresh = true;
var touch,
    moved,
    startY,
    diff,
    removeDiff,
    moveDiff = 45;
@connect((state) => ({
    planMsg: state.studentDetail.planMsg,
    courseList: state.studentDetail.courseList,
    optionalMargin: state.studentDetail.optionalMargin,
    submitedCourseList: state.studentDetail.submitedCourseList,
    courseDetail: state.studentDetail.studentCourseDetailContent,
    cancelAndSignUpResult: state.studentDetail.cancelAndSignUpResult,
    grabMsg: state.studentDetail.grabMsg,
    schoolList: state.studentDetail.schoolList,
    subjectList: state.studentDetail.subjectList,
    groupingList: state.courseBaseDetail.groupingList,
    currentUser: state.global.currentUser,
    studentCourseList: state.studentDetail.studentCourseList,
}))
export default class CourseStudentDetailMobileYunGu extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            //课程列表相关接口
            keyword: '', //关键字查询value
            isSubjectSelectedId: '', // 学科选中状态
            isFilled: 0, // 是否查看未报满的课
            courseStartTime: '', //开课学期开始时间
            courseEndTime: '', //开课学期结束时间
            weekDay: '', // 小课表筛选周几
            lesson: '', // 小课表筛选第几节
            isSchoolTimeSelectedId: [], // 上课时间选中状态
            pageNum: 1, // --可选课表第几页
            pageSize: 10, // --可选列表每页size
            filterDrawerVisibility: false,
            courseType: '选课',

            //请求余量接口
            cancelAndSignUpModelList: [],
            isGroupSelectedId: [],

            //已选列表
            isCheck: false,
            selectDrawerVisibility: false,
            selectCourseOnlyKeyList: [],
            realStatus: '',

            showSearFlag: false,
            showNoticeFlag: false,
        };
        this.offsetTop = 0;
    }

    componentWillMount() {
        const { planMsg, dispatch } = this.props;
        const localPlanMsg = JSON.parse(localStorage.getItem('planMsgH5'));
        dispatch({
            type: 'studentDetail/getStudentCourseDetails',
            payload: {
                planId: planMsg.id, // --选课计划 id
                userId: localPlanMsg.userId,
            },
        });
    }

    componentDidMount() {
        this.getCourseList();
        this.getSelectedList();
        this.getSubjectList();
        this.getSchoolTime();
        this.getGroupList();
        this.getStudentListCourse();

        this.props.dispatch({
            type: 'global/getCurrentUser',
            payload: {},
        });
        const moveEle = document.getElementById('wrapper');
        this.$tab = document.getElementsByClassName('wrapper');
        if (this.$tab) {
            this.offsetTop = this.$tab.offsetTop;
            window.addEventListener('scroll', this.handleScroll);
        }

        this.init();
    }

    init = () => {
        const { planMsg, dispatch } = this.props;
        const localPlanMsg = JSON.parse(localStorage.getItem('planMsgH5'));
        window.addEventListener('resize', () => this.updateSize());
        const moveEle = document.getElementById('contentArea');
        let content = document.getElementById('wrapper');
        let scrollTop;
        moveEle.addEventListener(
            'touchstart',
            function (e) {
                scrollTop = content && content.scrollTop;
                if (moveEle.scrollTop > 0) {
                    //当页面已经有滚动或者不是置顶的时候，不需要进行下拉刷新，是页面正常的滑动
                    touch = false;
                    return;
                }
                touch = true; //触摸开始
                moved = false; //还没有进行下拉刷新的滑动
                startY = e.touches[0].clientY;
            },
            false
        );
        function css(ele, t) {
            ele.style.transition = 'all ' + t + 'ms';
            ele.style.webkitTransition = 'all ' + t + 'ms';
        }
        const that = this;
        moveEle.addEventListener(
            'touchmove',
            function (e) {
                scrollTop = content && content.scrollTop;
                if (!touch || !isPullDownRefresh) {
                    return;
                }
                var refreshEle = document.getElementById('loadingBox');
                var refreshTxtEle = document.getElementById('refreshTxtEle');
                var touchesDiff = e.touches[0].clientY - startY; //计算的移动位移
                removeDiff = touchesDiff;

                if (touchesDiff < 0) {
                    //说明页面是向上滑的，不做任何操作
                    moved = false;
                    return;
                }
                moved = true;
                diff = touchesDiff;
                var distance = 0;
                if (diff <= moveDiff) {
                    //moveDiff至少要等于loading的高度
                    //当滑动小于规定的临界值时
                    distance = diff;
                    refreshTxtEle.innerHTML = '';
                    // alert(11111)
                } else {
                    if (scrollTop == 0) {
                        refreshTxtEle.innerHTML = '刷新中...';
                    }

                    // alert(222)
                    //弹性
                    if (touchesDiff <= 2 * moveDiff) {
                        // alert(3333)
                        distance = moveDiff + 0.5 * (touchesDiff - moveDiff);
                    } else {
                        // alert(444)
                        distance =
                            moveDiff +
                            0.1 * (touchesDiff - moveDiff) +
                            0.05 * (touchesDiff - 2 * moveDiff);
                    }
                }
                if (distance > 0) {
                    //滑动的距离
                    css(refreshEle, 0);
                    refreshEle.style.height = distance + 'px';
                }
                // generatedCount = 0; //下拉刷新的时候清空上拉加载更多的次数统计
            },
            false
        );
        moveEle.addEventListener(
            'touchend',
            function (e) {
                scrollTop = content && content.scrollTop;
                var refreshEle = document.getElementById('loadingBox');
                var refreshTxtEle = document.getElementById('refreshTxtEle');
                if (!touch || !moved) {
                    refreshEle.style.height = '0px';
                    return;
                }
                css(refreshEle, 300);

                isPullDownRefresh = false;
                if (diff > moveDiff && scrollTop == 0) {
                    refreshTxtEle.innerHTML = '刷新中...';
                    refreshEle.style.height = moveDiff + 'px';

                    setTimeout(() => {
                        // fyappapi.toastInfo('下拉刷新');
                        //延迟模拟接口调用
                        css(refreshEle, 300);

                        dispatch({
                            type: 'studentDetail/getStudentCourseDetails',
                            payload: {
                                planId: planMsg.id, // --选课计划 id
                                userId: localPlanMsg.userId,
                            },
                        });
                        that.getStudentListCourse();
                        this.getOptionMargin();
                        refreshEle.style.height = '0px';
                        setTimeout(() => {
                            isPullDownRefresh = true; //控制在刷新期间，重复向下拉动，不做任何操作
                        }, 300);
                    }, 500);
                } else {
                    isPullDownRefresh = true;
                    refreshEle.style.height = '0px';
                }
            },
            false
        );
    };

    getStudentListCourse = () => {
        const { dispatch } = this.props;
        // let userId = localStorage.getItem('userId');
        const localPlanMsg = JSON.parse(localStorage.getItem('planMsgH5'));
        dispatch({
            type: 'studentDetail/getStudentListCourse',
            payload: {
                pageNum: 1,
                pageSize: 9,
                userId: localPlanMsg.userId,
            },
        }).then(() => {
            const { studentCourseList } = this.props;
            let planMsg = JSON.parse(localStorage.getItem('planMsgH5'));
            let tempStatus = '';
            let tempArr =
                studentCourseList &&
                studentCourseList.choosePlanList &&
                studentCourseList.choosePlanList.length > 0 &&
                studentCourseList.choosePlanList.filter((obj) => obj.id == planMsg.id);

            if (tempArr && tempArr.length > 0) {
                tempStatus = tempArr[0].status;
            }

            this.setState({
                realStatus: tempStatus,
            });
        });
    };

    updateSize() {
        // 窗口变化时重新获取高度
        let __windowClientHeight = document.body.clientHeight;
        this.setState({
            height: __windowClientHeight,
        });
    }

    getGroupList = () => {
        const { dispatch, planMsg } = this.props;
        dispatch({
            type: 'courseBaseDetail/selectGroupingByChoosePlan',
            payload: {
                choosePlanId: planMsg.id,
            },
        });
    };

    handleScroll = () => {
        // let sTop =
        //     document.documentElement.scrollTop || document.body.scrollTop;
        // 变量scrollTop是滚动条滚动时，距离顶部的距离
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        // 变量windowHeight是可视区的高度
        const windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
        // 变量scrollHeight是滚动条的总高度
        const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

        if (scrollTop + windowHeight + 1 >= scrollHeight) {
            this.setState(
                {
                    pageSize: this.state.pageSize + 5,
                },
                () => {
                    this.getCourseList();
                }
            );
        }
    };

    // 获取可选课程列表
    getCourseList = (action) => {
        const { dispatch, planMsg, groupingList } = this.props;
        let {
            pageNum,
            weekDay,
            lesson,
            isSubjectSelectedId,
            courseStartTime,
            courseEndTime,
            keyword,
            isFilled,
            pageSize,
            isSchoolTimeSelectedId,
            isGroupSelectedId,
        } = this.state;

        const localPlanMsg = JSON.parse(localStorage.getItem('planMsgH5'));

        let tempGroupObj =
            (groupingList &&
                groupingList.length > 0 &&
                groupingList.find((item) => item.groupingKey == isGroupSelectedId)) ||
            [];

        dispatch({
            type: 'studentDetail/getListCourse',
            payload: {
                keyword,
                choosePlanId: planMsg.id,
                subjectId: isSubjectSelectedId,
                weekDayIdList: isSchoolTimeSelectedId,
                isFilled,
                startTime: courseStartTime, // --周期开始时间
                endTime: courseEndTime, // --周期结束时间
                weekDay: weekDay, // --周几
                lesson: lesson, // --第几节
                pageNum: pageNum, // --第几页
                pageSize: pageSize, // --每页size
                userId: localPlanMsg.userId,
                groupGroupingNumJsonDTOList:
                    tempGroupObj && tempGroupObj.length == 0 ? [] : [tempGroupObj],
            },
        }).then(() => {
            // if (action == 'search') {
            const { courseList, planMsg } = this.props;
            const { cancelAndSignUpModelList } = this.state;
            let cancelAndSignUpModelListCopy = [...cancelAndSignUpModelList];
            courseList.continueCourseList?.map((courseItem) =>
                courseItem.list?.map((groupItem) =>
                    cancelAndSignUpModelListCopy.push({
                        planId: planMsg.id, // --选课计划 id
                        classIds: groupItem.groupIds, // --班级 id
                        courseId: courseItem.courseId, // --课程 id
                    })
                )
            );
            courseList.courseOutList &&
                courseList.courseOutList.length &&
                courseList.courseOutList.map((courseItem) =>
                    courseItem.list?.map((groupItem) =>
                        cancelAndSignUpModelListCopy.push({
                            planId: planMsg.id, // --选课计划 id
                            classIds: groupItem.groupIds, // --班级 id
                            courseId: courseItem.courseId, // --课程 id
                        })
                    )
                );
            this.setState(
                {
                    cancelAndSignUpModelList: cancelAndSignUpModelListCopy,
                },
                () => {
                    this.getOptionMargin();
                }
            );
            // }
        });
    };

    // 可选课程余量
    getOptionMargin = () => {
        const { dispatch } = this.props;
        const { cancelAndSignUpModelList } = this.state;
        dispatch({
            type: 'studentDetail/optionalMargin',
            payload: {
                cancelAndSignUpModelList,
            },
        });
    };

    // 获取已选课程列表
    getSelectedList = () => {
        const { dispatch, planMsg } = this.props;
        const localPlanMsg = JSON.parse(localStorage.getItem('planMsgH5'));
        let tempUserId = localPlanMsg.userId;
        const { isCheck, weekDay, lesson } = this.state;
        dispatch({
            type: 'studentDetail/submittedCourse',
            payload: {
                planId: planMsg.id, // --选课计划 id
                batchId: planMsg.batchId, // --批次 id
                flag: isCheck ? 0 : 1, // --是否查询选中的课(0 是;1 否)
                weekDay: weekDay, // --周几-x
                lesson: lesson, // --课程节次-Y
                userId: tempUserId,
            },
        }).then(() => {
            const { submitedCourseList } = this.props;
            let selectCourseOnlyKeyList = flatten(
                submitedCourseList &&
                    submitedCourseList.list &&
                    submitedCourseList.list.length > 0 &&
                    submitedCourseList.list.map((courseItem) =>
                        courseItem.list?.map((groupItem) => groupItem.onlyKey)
                    )
            );
            this.setState({
                selectCourseOnlyKeyList,
            });
        });
    };

    signUpClick = (courseItem, groupItem, isSign, batchType) => {
        const { planMsg, courseDetail, dispatch, cancelAndSignUpResult, grabMsg } = this.props;
        let arrLesson = [];
        const courseLessons = groupItem.courseLessons;
        const localPlanMsg = JSON.parse(localStorage.getItem('planMsgH5'));
        for (let i = 0; i < courseLessons.length; i++) {
            arrLesson.push({
                baseScheduleId: courseLessons[i].baseScheduleId, // --作息 id
                versionId: courseLessons[i].versionId, // --版本 id
                weekDay: courseLessons[i].weekDay, // --周几编号
                lesson: courseLessons[i].lesson, // --课程编号
            });
        }
        // 先到先得
        if (planMsg.type === 2 && isSign) {
            dispatch({
                type: 'studentDetail/grabSignUp',
                payload: {
                    planId: planMsg.id, // --选课计划 id
                    classIds: groupItem.groupIds, // --班级 id
                    courseId: courseItem.courseId, // --课程 id
                    chooseCourseRelationId: groupItem.chooseCourseRelationId, // --选课班课关系id
                    batchType,
                    weekDayLessonModel: arrLesson,
                    credit: courseItem.credits,
                    chooseCourseRuleOpen: courseDetail.chooseCourseRuleOpen,
                    courseClassRule: courseDetail.courseClassRule,
                    coursePlanId: courseItem.coursePlanId,
                    groupToGradeIdList: groupItem.groupIds,
                    userId: localPlanMsg.userId,
                },
                onSuccess: () => {
                    const { grabMsg } = this.props;
                    message.success(grabMsg.message);
                },
            }).then(() => {
                this.getOptionMargin();
                this.getSelectedList();
            });
        } else {
            // 志愿填报
            dispatch({
                type: 'studentDetail/getCancelAndSignUp',
                payload: {
                    type: isSign ? 1 : 0, // --操作类型(0 取消报名; 1 报名 ; 2 已选列表处删除(状态为 2 时studentChooseCourseId字段值必填))
                    studentChooseCourseId: this.getStudentChooseCourseId(groupItem.onlyKey), // --学生选课表主键 id
                    planId: planMsg.id, // --选课计划 id
                    courseId: courseItem.courseId, // --课程 id
                    classIds: groupItem.groupIds, // --班级 id
                    chooseCourseRelationId: groupItem.chooseCourseRelationId, // --选课班课关系id
                    periodMaxQuantity: courseDetail.periodMaxQuantity, // --时段最大志愿数量
                    weekDayLessonModel: arrLesson,
                    userId: localPlanMsg.userId,
                    batchType,
                },
                onSuccess: () => {
                    const { cancelAndSignUpResult } = this.props;
                    message.success(cancelAndSignUpResult.message);
                },
            }).then(() => {
                this.getOptionMargin();
                this.getSelectedList();
            });
        }
    };

    getStudentChooseCourseId = (targetOnlyKey) => {
        const { submitedCourseList } = this.props;
        let studentChooseCourseId = '';
        submitedCourseList.list?.map((courseItem) =>
            courseItem.list?.map((groupItem) => {
                if (groupItem.onlyKey === targetOnlyKey) {
                    studentChooseCourseId = groupItem.studentChooseCourseId;
                }
            })
        );
        return studentChooseCourseId;
    };

    getWeekStr = (groupItem, list) => {
        return groupItem.courseLessons && groupItem.courseLessons.length > 0 ? (
            <span>
                {groupItem.courseLessons
                    .map(
                        (item, index) =>
                            `${trans('planDetail.optional.lessonTimeWeekday', '周{$day}', {
                                day: intoChinese(item.weekDay),
                            })}`
                    )
                    .join('，')}
            </span>
        ) : null;
    };

    getCourseTime = (groupItem, list) => {
        const { schoolList } = this.props;
        let allSame = list && list.length > 0 && judgeTimeIsSame(list);
        if (allSame == true || (schoolList && schoolList.length == 0)) {
            let tempStr =
                groupItem.startTimeString.slice(5) + '~' + groupItem.endTimeString.slice(5) || '';
            return tempStr;
        } else {
            let repeatFlag = true;
            let lessonTimeFirst =
                groupItem.planningClassTimeInputModelList &&
                groupItem.planningClassTimeInputModelList.length > 0
                    ? `${groupItem.planningClassTimeInputModelList[0]?.startTime} - ${groupItem.planningClassTimeInputModelList[0]?.endTime}`
                    : '';
            let weekDayStr =
                groupItem.planningClassTimeInputModelList &&
                groupItem.planningClassTimeInputModelList.length > 0
                    ? groupItem.planningClassTimeInputModelList
                          .map((item) => {
                              if (lessonTimeFirst !== `${item.startTime} - ${item.endTime}`) {
                                  repeatFlag = false;
                              }
                              return trans('planDetail.optional.lessonTimeWeekday', '周{$day}', {
                                  day: intoChinese(item.weekday),
                              });
                          })
                          .join('、')
                    : '';
            if (repeatFlag) {
                return `${weekDayStr} ${lessonTimeFirst}`;
            } else {
                return (
                    <span>
                        {groupItem.planningClassTimeInputModelList &&
                        groupItem.planningClassTimeInputModelList.length > 0
                            ? groupItem.planningClassTimeInputModelList
                                  .map(
                                      (item, index) =>
                                          `${trans(
                                              'planDetail.optional.lessonTimeWeekday',
                                              '周{$day}',
                                              {
                                                  day: intoChinese(item.weekday),
                                              }
                                          )} ${item.startTime} - ${item.endTime}`
                                  )
                                  .join('，')
                            : ''}
                    </span>
                );
            }
        }
    };

    toggleSelectDrawerVisible = () => {
        const { selectDrawerVisibility } = this.state;
        this.setState({
            selectDrawerVisibility: !selectDrawerVisibility,
        });
    };

    toggleFilterDrawerVisible = () => {
        const { filterDrawerVisibility } = this.state;
        this.setState({
            filterDrawerVisibility: !filterDrawerVisibility,
        });
    };

    isStart = (type) => {
        const { courseDetail, planMsg } = this.props;
        let startFlag = true;

        let condition_1 = type == 'courseOutList';
        let condition_2 = type == 'continueCourseList';
        let condition_3 = courseDetail.planStatus == 0;
        let condition_4 = planMsg.batchType == 1;

        if (
            (condition_1 && condition_4) ||
            (condition_1 && condition_3) ||
            (condition_2 && condition_3)
        ) {
            startFlag = false;
        }
        return startFlag;
    };

    getSignUpBtnListHtml = (groupItem, marginItem, courseItem, courseType, batchType, type) => {
        const { selectCourseOnlyKeyList, realStatus } = this.state;
        const { courseDetail, planMsg } = this.props;

        const localPlanMsg = JSON.parse(localStorage.getItem('planMsgH5'));
        let tempStatus = localPlanMsg.status;

        let condition_1 = type == 'courseOutList';
        let condition_2 = type == 'continueCourseList';
        let condition_3 = courseDetail.planStatus == 0;
        let condition_4 = planMsg.batchType == 1;

        if (
            (condition_1 && condition_4) ||
            (condition_1 && condition_3) ||
            (condition_2 && condition_3)
        ) {
            //可选列表：planStatus == 0 || planMsg.batchType == 1
            //续课列表：planStatus == 0
            return (
                <div className={styles.fullStatus}>
                    <span
                        className={styles.fillSignUp}
                        onClick={(e) => {
                            e.preventDefault();
                        }}
                    >
                        未开始
                    </span>
                </div>
            );
        }

        if (
            marginItem.maxStudent <= marginItem.classNumber &&
            !selectCourseOnlyKeyList.includes(groupItem.onlyKey)
        ) {
            return (
                <div className={styles.fullStatus}>
                    <span
                        className={styles.fillSignUp}
                        onClick={(e) => {
                            e.preventDefault();
                        }}
                    >
                        已报满
                    </span>
                </div>
            );
        }
        if (selectCourseOnlyKeyList.includes(groupItem.onlyKey)) {
            return (
                <div className={styles.signUpSuccessWrapper}>
                    <span className={styles.signUpSuccess}>
                        <CheckCircleFilled />
                        <span>{courseType === '选课' ? '选课成功' : '续课成功'} </span>
                    </span>
                    {courseDetail.planStatus == 1 && groupItem.type != 6 ? (
                        <span
                            className={styles.signUpCancel}
                            onClick={(e) => {
                                this.showCancelConfirm(
                                    courseItem,
                                    groupItem,
                                    courseType === '选课' ? 0 : 1
                                );
                                e.preventDefault();
                            }}
                        >
                            取消报名
                        </span>
                    ) : null}
                </div>
            );
        } else {
            if (realStatus == 1 || realStatus == 2) {
                return (
                    <div className={styles.signUpStatus}>
                        <span
                            className={styles.wantSignUp}
                            onClick={(e) => {
                                this.signUpClick(
                                    courseItem,
                                    groupItem,
                                    true,
                                    type == 'courseOutList' ? 0 : 1
                                );
                                e.preventDefault();
                            }}
                        >
                            {type == 'courseOutList' ? '我要报名' : '我要续课'}
                        </span>
                    </div>
                );
            } else if (realStatus == 3) {
                return (
                    <div className={styles.fullStatus}>
                        <span
                            className={styles.fillSignUp}
                            onClick={(e) => {
                                e.preventDefault();
                            }}
                        >
                            已结束
                        </span>
                    </div>
                );
            }
        }
    };

    selectCoursePressEnter = (value) => {
        this.setState(
            {
                keyword: value,
            },
            () => {
                this.getCourseList('search');
            }
        );
    };

    changeKeyWord = (e) => {
        console.log(e.target.value, 'value');
        this.setState({
            keyword: e.target.value,
        });
    };

    // 学科分类列表
    getSubjectList = () => {
        const { dispatch, planMsg } = this.props;
        dispatch({
            type: 'studentDetail/getSubjectList',
            payload: {
                chooseCoursePlanId: planMsg.id,
            },
        });
    };

    // 上课时间
    getSchoolTime = () => {
        const { dispatch, planMsg } = this.props;
        dispatch({
            type: 'studentDetail/getSchoolTimeList',
            payload: {
                chooseCoursePlanId: planMsg.id,
            },
        });
    };

    changeWeekday = (value) => {
        this.setState(
            {
                isSchoolTimeSelectedId: value,
            },
            () => {
                this.getCourseList();
            }
        );
    };

    changeSubject = (value) => {
        this.setState(
            {
                isSubjectSelectedId: value,
            },
            () => {
                this.getCourseList();
            }
        );
    };

    changeGroup = (value) => {
        this.setState(
            {
                isGroupSelectedId: value,
            },
            () => {
                this.getCourseList();
            }
        );
    };

    selectTime = (item, e) => {
        if (e.target.className.includes('hasSelectedItem')) {
            this.setState({
                isSchoolTimeSelectedId: [],
            });
        } else {
            this.setState({
                isSchoolTimeSelectedId: item.idList,
            });
        }
    };

    selectSubject = (item, e) => {
        if (e.target.className.includes('hasSelectedItem')) {
            this.setState(
                {
                    isSubjectSelectedId: '',
                },
                () => {
                    this.getCourseList();
                }
            );
        } else {
            this.setState(
                {
                    isSubjectSelectedId: item.id,
                },
                () => {
                    this.getCourseList();
                }
            );
        }
    };

    selectGroup = (item, e) => {
        if (e.target.className.includes('hasSelectedItem')) {
            this.setState(
                {
                    isGroupSelectedId: [],
                },
                () => {
                    this.getCourseList();
                }
            );
        } else {
            this.setState(
                {
                    isGroupSelectedId: item.groupingKey,
                },
                () => {
                    this.getCourseList();
                }
            );
        }
    };

    handleReSet = () => {
        this.setState(
            {
                isSchoolTimeSelectedId: [],
                isSubjectSelectedId: '',
                isGroupSelectedId: [],
            },
            () => {
                this.getCourseList();
            }
        );
    };

    handleConfirm = (e) => {
        this.setState({
            filterDrawerVisibility: !this.state.filterDrawerVisibility,
        });
        this.getCourseList();
    };

    showCancelConfirm = (courseItem, groupItem, batchType) => {
        let _this = this;
        confirm({
            title: <span className={styles.title}>确定要取消报名吗?</span>,
            content: (
                <span className={styles.text}>
                    确认取消后，该报名可能会被其他同学抢报，请谨慎操作。
                </span>
            ),
            icon: '',
            okText: '确认取消',
            className: styles.confirmText,
            width: '340px',
            onOk() {
                _this.signUpClick(courseItem, groupItem, false, batchType);
            },
        });
    };

    getCourseListHtml = (courseType, batchType) => {
        const { courseList, optionalMargin, planMsg, courseDetail, currentUser } = this.props;

        let isSuitNum = 0;
        console.log(optionalMargin, 'optionalMargin');

        let tempNum = localStorage.getItem('gradeNum');
        if (tempNum == 1 || tempNum == 2 || tempNum == 3) {
            isSuitNum = 1;
        } else if (tempNum == 4 || tempNum == 5 || tempNum == 6) {
            isSuitNum = 2;
        }
        // if (
        //     currentUser &&
        //     currentUser?.currentChildClassInfo &&
        //     currentUser?.currentChildClassInfo?.gradeNum
        // ) {
        //     let tempNum = currentUser?.currentChildClassInfo?.gradeNum;
        //     if (tempNum == 1 || tempNum == 2 || tempNum == 3) {
        //         isSuitNum = 1;
        //     } else if (tempNum == 4 || tempNum == 5 || tempNum == 6) {
        //         isSuitNum = 2;
        //     }
        // }

        let courseListType = '';
        courseType === '选课'
            ? (courseListType = 'courseOutList')
            : (courseListType = 'continueCourseList');

        let domArr = [];

        let tempTimeStr = new Date();
        const localPlanMsg = JSON.parse(localStorage.getItem('planMsgH5'));

        tempTimeStr = tempTimeStr.toLocaleDateString();
        let flag = courseDetail.planStatus != 0 || courseDetail.chooseContinuedBatch;

        courseList[courseListType] &&
        courseList[courseListType].length &&
        courseList[courseListType].length > 0
            ? courseList[courseListType].map((courseItem) => {
                  if (courseItem.list && courseItem.list.length > 0) {
                      courseItem.list?.map((groupItem) => {
                          let marginItem = optionalMargin.find(
                              (item) => item.onlyKey === groupItem.onlyKey
                          )
                              ? optionalMargin.find((item) => item.onlyKey === groupItem.onlyKey)
                              : {
                                    classNumber: 0,
                                    maxStudent: 0,
                                    minStudent: 0,
                                };

                          console.log(marginItem, 'marginItem');
                          let tempClassStr = '';
                          courseItem.groupClassFeeList &&
                              courseItem.groupClassFeeList.map((el, ind) => {
                                  if (el.groupId == groupItem.groupIds) {
                                      return (tempClassStr = ` ${el.fee} ` || ` 0 `);
                                  }
                              });
                          let tempMatreialStr = '';
                          courseItem.groupMaterialFeeList &&
                              courseItem.groupMaterialFeeList.map((el, ind) => {
                                  if (el.groupId == groupItem.groupIds) {
                                      return (tempMatreialStr = ` ${el.fee} ` || ` 0 `);
                                  }
                              });
                          domArr.push(
                              <div className={styles.chooseCourseWrapper}>
                                  <Link
                                      to={`/course/student/MobileCourseDetail?coursePlanningId=${courseItem.coursePlanId}&chooseCoursePlanId=${planMsg.id}&groupIds=${groupItem.groupIds[0]}`}
                                  >
                                      <div className={styles.chooseCourse}>
                                          <div className={styles.courseName}>
                                              {groupItem.groupName}
                                          </div>
                                          <div className={styles.courseDetailStyle}>
                                              {/* <img
                                                  src={courseItem.courseCover}
                                                  className={styles.courseCoverStyle}
                                              /> */}
                                              <div className={styles.corseMessage}>
                                                  {courseItem.classFeeType == 1 ||
                                                  (courseItem.classFeeType == 2 &&
                                                      tempClassStr != '') ||
                                                  courseItem.materialFeeType == 1 ||
                                                  courseItem.materialFeeType == 2 ||
                                                  courseItem.materialFeeType == 3 ? (
                                                      <span className={styles.corseMessageItem}>
                                                          <PayCircleOutlined
                                                              style={{ marginTop: '3px' }}
                                                          />
                                                          <span className={styles.courseFee}>
                                                              {courseItem.classFeeType ? (
                                                                  planMsg.id == 125 ? (
                                                                      <span>
                                                                          <span
                                                                              className={
                                                                                  styles.labelStyle
                                                                              }
                                                                          >
                                                                              基础费
                                                                          </span>
                                                                          <span
                                                                              style={{
                                                                                  color: '#fd9004',
                                                                              }}
                                                                          >
                                                                              {(isSuitNum == 1 &&
                                                                                  '1980/期 ') ||
                                                                                  (isSuitNum == 2 &&
                                                                                      '2480/期 ')}{' '}
                                                                          </span>

                                                                          <span
                                                                              className={
                                                                                  styles.labelStyle
                                                                              }
                                                                          >
                                                                              加课包
                                                                          </span>
                                                                          <span
                                                                              style={{
                                                                                  color: '#fd9004',
                                                                              }}
                                                                          >
                                                                              {courseItem.classFee}
                                                                              {'/期 '}
                                                                          </span>
                                                                      </span>
                                                                  ) : (
                                                                      courseItem.classFee != 0 && (
                                                                          <span>
                                                                              课时费
                                                                              <span
                                                                                  style={{
                                                                                      color: '#fd9004',
                                                                                  }}
                                                                              >
                                                                                  {`${courseItem.classFee}/期 `}
                                                                              </span>
                                                                          </span>
                                                                      )
                                                                  )
                                                              ) : null}
                                                              {courseItem.classFeeType == 2 ? (
                                                                  planMsg.id == 125 ? (
                                                                      <span>
                                                                          <span
                                                                              className={
                                                                                  styles.labelStyle
                                                                              }
                                                                          >
                                                                              基础费
                                                                          </span>
                                                                          <span
                                                                              style={{
                                                                                  color: '#fd9004',
                                                                              }}
                                                                          >
                                                                              {isSuitNum == 1
                                                                                  ? '1980/期 '
                                                                                  : isSuitNum == 2
                                                                                  ? '2480/期 '
                                                                                  : null}
                                                                          </span>

                                                                          <span
                                                                              className={
                                                                                  styles.labelStyle
                                                                              }
                                                                          >
                                                                              加课包
                                                                          </span>
                                                                          <span
                                                                              style={{
                                                                                  color: '#fd9004',
                                                                              }}
                                                                          >
                                                                              {tempClassStr}
                                                                              {'/期 '}
                                                                          </span>
                                                                      </span>
                                                                  ) : (
                                                                      <span
                                                                          style={{
                                                                              color: '#fd9004',
                                                                          }}
                                                                      >
                                                                          课时费
                                                                          {`${tempClassStr}/期`}
                                                                      </span>
                                                                  )
                                                              ) : (
                                                                  ''
                                                              )}
                                                              {courseItem.classFeeType == 0 &&
                                                              planMsg.id == 125 ? (
                                                                  <>
                                                                      <span
                                                                          className={
                                                                              styles.labelStyle
                                                                          }
                                                                      >
                                                                          基础费
                                                                      </span>
                                                                      <span
                                                                          style={{
                                                                              color: '#fd9004',
                                                                          }}
                                                                      >
                                                                          {isSuitNum == 1
                                                                              ? '1980/期 '
                                                                              : isSuitNum == 2
                                                                              ? '2480/期 '
                                                                              : null}
                                                                      </span>
                                                                  </>
                                                              ) : (
                                                                  ''
                                                              )}

                                                              {courseItem.materialFeeType
                                                                  ? courseItem.materialFeeType ==
                                                                        1 && (
                                                                        <span>
                                                                            材料费
                                                                            <span
                                                                                style={{
                                                                                    color: '#fd9004',
                                                                                }}
                                                                            >{`${
                                                                                courseItem.materialCost ||
                                                                                0
                                                                            }/期`}</span>
                                                                        </span>
                                                                    )
                                                                  : ''}
                                                              {courseItem.materialFeeType
                                                                  ? courseItem.materialFeeType ==
                                                                        2 && (
                                                                        <span>
                                                                            材料费
                                                                            <span
                                                                                style={{
                                                                                    color: '#fd9004',
                                                                                }}
                                                                            >
                                                                                {`${courseItem.newMaterialCost}/期(老生${courseItem.oldMaterialCost})`}
                                                                            </span>
                                                                        </span>
                                                                    )
                                                                  : ''}
                                                              {courseItem.materialFeeType
                                                                  ? courseItem.materialFeeType ==
                                                                        3 && (
                                                                        <span>
                                                                            材料费
                                                                            {`${tempMatreialStr}/期`}
                                                                        </span>
                                                                    )
                                                                  : ''}
                                                          </span>
                                                      </span>
                                                  ) : null}

                                                  <span className={styles.corseMessageItem}>
                                                      <UsergroupAddOutlined
                                                          style={{ marginTop: '3px' }}
                                                      />
                                                      <span className={styles.courseMargin}>
                                                          {marginItem.minStudent ===
                                                          marginItem.maxStudent
                                                              ? `${marginItem.minStudent}人开班`
                                                              : `${marginItem.minStudent}-${marginItem.maxStudent}人开班`}
                                                          {flag
                                                              ? marginItem.maxStudent <=
                                                                marginItem.classNumber
                                                                  ? ` 已报满`
                                                                  : ` 已报${marginItem?.classNumber}人`
                                                              : null}
                                                      </span>
                                                  </span>
                                                  <span className={styles.corseMessageItem}>
                                                      <ClockCircleOutlined
                                                          style={{ marginTop: '3px' }}
                                                      />
                                                      {this.getCourseTime(
                                                          groupItem,
                                                          courseItem.list
                                                      )}
                                                  </span>
                                                  {marginItem?.classNumber > 0 &&
                                                  this.isStart(courseListType) ? (
                                                      <span
                                                          className={styles.corseMessageItem}
                                                          style={{
                                                              display: 'inline-block',
                                                              width: '200px',
                                                              height: '6px',
                                                              backgroundColor: '#eee',
                                                              borderRadius: '3px',
                                                              position: 'relative   ',
                                                          }}
                                                      >
                                                          <span
                                                              style={{
                                                                  display: 'inline-block',
                                                                  backgroundColor: '#5DAE07',
                                                                  width: this.calculateWidth(
                                                                      marginItem?.classNumber,
                                                                      marginItem?.maxStudent
                                                                  ),
                                                                  height: '6px',
                                                                  position: 'absolute',
                                                                  borderRadius: '3px',
                                                              }}
                                                          ></span>
                                                      </span>
                                                  ) : null}
                                              </div>
                                          </div>
                                      </div>
                                  </Link>
                                  <div className={styles.signUpList}>
                                      {this.getSignUpBtnListHtml(
                                          groupItem,
                                          marginItem,
                                          courseItem,
                                          courseType,
                                          batchType,
                                          courseListType
                                      )}
                                  </div>
                              </div>
                          );
                      });
                  } else {
                      domArr.push(
                          <div className={styles.chooseCourseWrapper}>
                              <div className={styles.chooseCourse}>
                                  <div className={styles.courseName}>{courseItem.name}</div>
                              </div>
                              <div className={styles.signUpList}>
                                  <div className={styles.fullStatus}>
                                      <span className={styles.fillSignUp}>暂无续课</span>
                                  </div>
                              </div>
                          </div>
                      );
                  }
              })
            : (domArr = (
                  <div style={{ background: 'white', height: '80vh' }}>
                      <img style={{ width: '50%', margin: '40% 25% 15px 25%' }} src={emptyImg} />
                      <p
                          style={{
                              textAlign: 'center',
                              fontSize: '14px',
                              color: '#bbb',
                              fontWeight: 'normal',
                          }}
                      >
                          {locale() == 'en' ? 'No Data' : '暂无课程'}
                      </p>
                  </div>
              ));
        return domArr;
    };

    courseListTypeChange = (courseType) => {
        this.setState({
            courseType,
        });
    };

    cancelAction = () => {};

    showSearch = () => {
        this.setState({
            showSearFlag: !this.state.showSearFlag,
            isSubjectSelectedId: '',
            isSchoolTimeSelectedId: [],
            isGroupSelectedId: [],
        });
    };

    showNotice = () => {
        this.setState({
            showNoticeFlag: true,
        });
    };

    cancelSearchByKeyword = () => {
        this.setState(
            {
                showSearFlag: false,
                keyword: '',
            },
            () => {
                this.getCourseList();
            }
        );
    };

    calculateWidth = (molecular, Denominator) => {
        if (!Denominator) {
            return '0%';
        } else {
            let tempRate = (molecular / Denominator) * 100;
            if (tempRate > 100) {
                return '100%';
            } else {
                return `${tempRate.toFixed(2)}%`;
            }
        }
    };

    statisticsTotal = (groupingKey) => {
        const { submitedCourseList } = this.props;
        let total = 0;
        submitedCourseList && submitedCourseList.list && submitedCourseList.list.length > 0
            ? submitedCourseList.list.map((item) => {
                  let targetGroupingKey =
                      item?.list[0].groupGroupingNumJsonDTO &&
                      item?.list[0].groupGroupingNumJsonDTO.groupingKey;
                  if (targetGroupingKey == groupingKey) {
                      total += 1;
                  }
              })
            : null;
        return total;
    };

    render() {
        const { courseDetail, submitedCourseList, schoolList, subjectList, planMsg, groupingList } =
            this.props;
        const {
            selectCourseOnlyKeyList,
            selectDrawerVisibility,
            filterDrawerVisibility,
            isSchoolTimeSelectedId,
            isSubjectSelectedId,
            courseType,
            isGroupSelectedId,
            showSearFlag,
            showNoticeFlag,
        } = this.state;

        console.log(
            'courseDetail',
            courseDetail.type,
            courseDetail.stintSubjectNumModelList,
            subjectList
        );

        return (
            <div>
                <div id="loadingBox" className={styles.loadingBox}>
                    <div className={styles.loaded}></div>
                    <div id="refreshTxtEle" className={styles.loadText}></div>
                </div>
                <di id="contentArea">
                    <div className={styles.wrapper} id="wrapper">
                        <div className={styles.courseListWrapper}>
                            {planMsg.batchType === 0 ? (
                                <div>
                                    <div
                                        className={styles.selectCourseWrapper}
                                        style={{ marginTop: '-4px' }}
                                    >
                                        <div
                                            className={styles.groupContent}
                                            style={{
                                                display: showSearFlag ? 'none' : 'flex',
                                                paddingTop: '11px',
                                            }}
                                        >
                                            {courseDetail.type == 2
                                                ? courseDetail.stintSubjectNumModelList &&
                                                  courseDetail.stintSubjectNumModelList.length > 0
                                                    ? /* subjectList && subjectList.length > 0
                                                        ? subjectList.map((item) => {
                                                              return (
                                                                  <span
                                                                      className={
                                                                          isEqual(
                                                                              item.id,
                                                                              isSubjectSelectedId
                                                                          )
                                                                              ? styles.hasSelectedItem
                                                                              : styles.selectItem
                                                                      }
                                                                      onClick={(e) =>
                                                                          this.selectSubject(
                                                                              item,
                                                                              e
                                                                          )
                                                                      }
                                                                  >
                                                                      {item.name}
                                                                  </span>
                                                              );
                                                          })
                                                        : */ groupingList.map((item) => (
                                                          <div
                                                              className={
                                                                  isEqual(
                                                                      item.groupingKey,
                                                                      isGroupSelectedId
                                                                  )
                                                                      ? styles.hasSelectedItem
                                                                      : styles.selectItem
                                                              }
                                                              style={{ position: 'relative' }}
                                                              onClick={(e) =>
                                                                  this.selectGroup(item, e)
                                                              }
                                                          >
                                                              {item.groupingName}
                                                              <span
                                                                  style={{
                                                                      display: this.statisticsTotal(
                                                                          item.groupingKey
                                                                      )
                                                                          ? 'inline-block'
                                                                          : 'none',
                                                                      position: 'absolute',
                                                                      backgroundColor: 'red',
                                                                      color: 'white',
                                                                      width: '16px',
                                                                      height: '17px',
                                                                      borderRadius: '10px',
                                                                      textAlign: 'center',
                                                                      lineHeight: '17px',
                                                                      right: '-2px',
                                                                      bottom: '18px',
                                                                  }}
                                                              >
                                                                  {this.statisticsTotal(
                                                                      item.groupingKey
                                                                  )}
                                                              </span>
                                                          </div>
                                                      ))
                                                    : groupingList.map((item) => (
                                                          <div
                                                              className={
                                                                  isEqual(
                                                                      item.groupingKey,
                                                                      isGroupSelectedId
                                                                  )
                                                                      ? styles.hasSelectedItem
                                                                      : styles.selectItem
                                                              }
                                                              onClick={(e) =>
                                                                  this.selectGroup(item, e)
                                                              }
                                                          >
                                                              {item.groupingName}
                                                              <span
                                                                  style={{
                                                                      display: this.statisticsTotal(
                                                                          item.groupingKey
                                                                      )
                                                                          ? 'inline-block'
                                                                          : 'none',
                                                                      position: 'absolute',
                                                                      backgroundColor: 'red',
                                                                      color: 'white',
                                                                      width: '16px',
                                                                      height: '17px',
                                                                      borderRadius: '10px',
                                                                      textAlign: 'center',
                                                                      lineHeight: '17px',
                                                                      right: '-2px',
                                                                      bottom: '18px',
                                                                  }}
                                                              >
                                                                  {this.statisticsTotal(
                                                                      item.groupingKey
                                                                  )}
                                                              </span>
                                                          </div>
                                                      ))
                                                : null}
                                        </div>
                                        <div
                                            style={{
                                                display: showSearFlag ? 'none' : 'flex',
                                                justifyContent: 'space-between',
                                                color: 'rgba(1,17,61,.85)',
                                            }}
                                            className={styles.filterStyle}
                                        >
                                            {schoolList && schoolList.length > 0 ? (
                                                <Select
                                                    style={{
                                                        width: '101px',
                                                    }}
                                                    placeholder="全部时间"
                                                    onChange={this.changeWeekday}
                                                    allowClear
                                                >
                                                    <Select.Option key={[]} value={[]}>
                                                        全部时间
                                                    </Select.Option>
                                                    {schoolList.map((item) => {
                                                        return (
                                                            <Select.Option
                                                                key={item.idList}
                                                                value={item.idList}
                                                            >
                                                                {item.name}
                                                            </Select.Option>
                                                        );
                                                    })}
                                                </Select>
                                            ) : null}

                                            <Select
                                                style={{
                                                    width: '101px',
                                                }}
                                                placeholder="全部学科"
                                                onChange={this.changeSubject}
                                                allowClear
                                            >
                                                <Select.Option key={''} value={''}>
                                                    全部学科
                                                </Select.Option>
                                                {subjectList.map((item) => (
                                                    <Select.Option key={item.id} value={item.id}>
                                                        {item.name}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                            <span
                                                style={{
                                                    display: 'inline-block',
                                                    lineHeight: '33px',
                                                }}
                                                onClick={this.showSearch}
                                            >
                                                <Icon
                                                    type="search"
                                                    style={{
                                                        fontSize: 14,
                                                        padding: '5px 2px 3px 8px',
                                                        border: 'none',
                                                        borderRadius: 7,
                                                        color: '#3D3D3D',
                                                    }}
                                                />
                                                <span
                                                    style={{
                                                        display: 'inline-block',
                                                        height: '27px',
                                                    }}
                                                >
                                                    搜索
                                                </span>
                                            </span>
                                            <span
                                                style={{
                                                    lineHeight: '32px',
                                                }}
                                                onClick={this.showNotice}
                                            >
                                                <Icon type="info-circle" />
                                                选课须知
                                            </span>
                                        </div>
                                        <div
                                            style={{
                                                display: showSearFlag ? 'flex' : 'none',
                                                justifyContent: 'space-around',
                                            }}
                                        >
                                            <Input.Search
                                                style={{ width: '80vw' }}
                                                prefix={
                                                    <SearchOutlined
                                                        style={{ color: 'rgb(191, 191, 191)' }}
                                                    />
                                                }
                                                placeholder="搜索课程"
                                                onSearch={(value) =>
                                                    this.selectCoursePressEnter(value)
                                                }
                                                onChange={this.changeKeyWord}
                                                allowClear={true}
                                                value={this.state.keyword}
                                            />
                                            <span
                                                onClick={this.cancelSearchByKeyword}
                                                style={{ alignSelf: 'center' }}
                                            >
                                                取消
                                            </span>
                                        </div>
                                    </div>
                                    {this.getCourseListHtml('选课', 0)}
                                </div>
                            ) : (
                                <Tabs
                                    onChange={this.courseListTypeChange}
                                    className={styles.tabsStyle}
                                >
                                    <TabPane tab="可续课程" key="续课">
                                        {this.getCourseListHtml('续课', 1)}
                                    </TabPane>
                                    <TabPane tab="全部课程" key="选课">
                                        <div className={styles.selectCourseWrapper}>
                                            <div
                                                className={styles.groupContent}
                                                style={{
                                                    display: showSearFlag ? 'none' : 'flex',
                                                    paddingTop: '11px',
                                                }}
                                            >
                                                {courseDetail.type == 2
                                                    ? courseDetail.stintSubjectNumModelList &&
                                                      courseDetail.stintSubjectNumModelList.length >
                                                          0
                                                        ? /* subjectList && subjectList.length > 0
                                                            ? subjectList.map((item) => {
                                                                  return (
                                                                      <span
                                                                          className={
                                                                              isEqual(
                                                                                  item.id,
                                                                                  isSubjectSelectedId
                                                                              )
                                                                                  ? styles.hasSelectedItem
                                                                                  : styles.selectItem
                                                                          }
                                                                          onClick={(e) =>
                                                                              this.selectSubject(
                                                                                  item,
                                                                                  e
                                                                              )
                                                                          }
                                                                      >
                                                                          {item.name}
                                                                      </span>
                                                                  );
                                                              })
                                                            : */ groupingList.map((item) => (
                                                              <div
                                                                  className={
                                                                      isEqual(
                                                                          item.groupingKey,
                                                                          isGroupSelectedId
                                                                      )
                                                                          ? styles.hasSelectedItem
                                                                          : styles.selectItem
                                                                  }
                                                                  style={{
                                                                      position: 'relative',
                                                                  }}
                                                                  onClick={(e) =>
                                                                      this.selectGroup(item, e)
                                                                  }
                                                              >
                                                                  {item.groupingName}
                                                                  <span
                                                                      style={{
                                                                          display:
                                                                              this.statisticsTotal(
                                                                                  item.groupingKey
                                                                              )
                                                                                  ? 'inline-block'
                                                                                  : 'none',
                                                                          position: 'absolute',
                                                                          backgroundColor: 'red',
                                                                          color: 'white',
                                                                          width: '16px',
                                                                          height: '17px',
                                                                          borderRadius: '10px',
                                                                          textAlign: 'center',
                                                                          lineHeight: '17px',
                                                                          right: '-2px',
                                                                          bottom: '18px',
                                                                      }}
                                                                  >
                                                                      {this.statisticsTotal(
                                                                          item.groupingKey
                                                                      )}
                                                                  </span>
                                                              </div>
                                                          ))
                                                        : groupingList.map((item) => (
                                                              <div
                                                                  className={
                                                                      isEqual(
                                                                          item.groupingKey,
                                                                          isGroupSelectedId
                                                                      )
                                                                          ? styles.hasSelectedItem
                                                                          : styles.selectItem
                                                                  }
                                                                  onClick={(e) =>
                                                                      this.selectGroup(item, e)
                                                                  }
                                                              >
                                                                  {item.groupingName}
                                                                  <span
                                                                      style={{
                                                                          display:
                                                                              this.statisticsTotal(
                                                                                  item.groupingKey
                                                                              )
                                                                                  ? 'inline-block'
                                                                                  : 'none',
                                                                          position: 'absolute',
                                                                          backgroundColor: 'red',
                                                                          color: 'white',
                                                                          width: '16px',
                                                                          height: '17px',
                                                                          borderRadius: '10px',
                                                                          textAlign: 'center',
                                                                          lineHeight: '17px',
                                                                          right: '-2px',
                                                                          bottom: '18px',
                                                                      }}
                                                                  >
                                                                      {this.statisticsTotal(
                                                                          item.groupingKey
                                                                      )}
                                                                  </span>
                                                              </div>
                                                          ))
                                                    : null}
                                            </div>
                                            <div
                                                style={{
                                                    display: showSearFlag ? 'none' : 'flex',
                                                    justifyContent: 'space-between',
                                                    color: 'rgba(1,17,61,.85)',
                                                }}
                                                className={styles.filterStyle}
                                            >
                                                {schoolList && schoolList.length > 0 ? (
                                                    <Select
                                                        style={{
                                                            width: '101px',
                                                        }}
                                                        placeholder="全部时间"
                                                        onChange={this.changeWeekday}
                                                        allowClear
                                                        // value={isSchoolTimeSelectedId}
                                                    >
                                                        <Select.Option key={[]} value={[]}>
                                                            全部时间
                                                        </Select.Option>
                                                        {schoolList.map((item) => {
                                                            return (
                                                                <Select.Option
                                                                    key={item.idList}
                                                                    value={item.idList}
                                                                >
                                                                    {item.name}
                                                                </Select.Option>
                                                            );
                                                        })}
                                                    </Select>
                                                ) : null}

                                                <Select
                                                    style={{
                                                        width: '101px',
                                                    }}
                                                    placeholder="全部学科"
                                                    onChange={this.changeSubject}
                                                    allowClear
                                                >
                                                    <Select.Option key={''} value={''}>
                                                        全部学科
                                                    </Select.Option>
                                                    {subjectList.map((item) => (
                                                        <Select.Option
                                                            key={item.id}
                                                            value={item.id}
                                                        >
                                                            {item.name}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                                <span
                                                    style={{
                                                        display: 'inline-block',
                                                        lineHeight: '33px',
                                                    }}
                                                    onClick={this.showSearch}
                                                >
                                                    <Icon
                                                        type="search"
                                                        style={{
                                                            fontSize: 14,
                                                            padding: '5px 2px 3px 8px',
                                                            border: 'none',
                                                            borderRadius: 7,
                                                            color: '#3D3D3D',
                                                        }}
                                                    />
                                                    <span
                                                        style={{
                                                            display: 'inline-block',
                                                            height: '27px',
                                                        }}
                                                    >
                                                        搜索
                                                    </span>
                                                </span>
                                                <span
                                                    style={{
                                                        lineHeight: '32px',
                                                    }}
                                                    onClick={this.showNotice}
                                                >
                                                    <Icon type="info-circle" />
                                                    选课须知
                                                </span>
                                            </div>
                                            <div
                                                style={{
                                                    display: showSearFlag ? 'flex' : 'none',
                                                    justifyContent: 'space-around',
                                                }}
                                            >
                                                <Input.Search
                                                    style={{ width: '80vw' }}
                                                    prefix={
                                                        <SearchOutlined
                                                            style={{ color: 'rgb(191, 191, 191)' }}
                                                        />
                                                    }
                                                    placeholder="搜索课程"
                                                    onSearch={(value) =>
                                                        this.selectCoursePressEnter(value)
                                                    }
                                                    onChange={this.changeKeyWord}
                                                    allowClear={true}
                                                    value={this.state.keyword}
                                                />
                                                <span
                                                    onClick={this.cancelSearchByKeyword}
                                                    style={{ alignSelf: 'center' }}
                                                >
                                                    取消
                                                </span>
                                            </div>

                                            {/* <div
                                                className={
                                                    isEmpty(isSchoolTimeSelectedId) &&
                                                    isEmpty(isSubjectSelectedId) &&
                                                    isEmpty(isGroupSelectedId)
                                                        ? styles.courseFilter
                                                        : styles.courseFilterActive
                                                }
                                                onClick={this.toggleFilterDrawerVisible}
                                            >
                                                <FilterOutlined style={{ fontSize: '16px' }} />
                                                <span style={{ marginLeft: '3px' }}>筛选</span>
                                            </div> */}
                                        </div>
                                        {this.getCourseListHtml('选课', 2)}
                                    </TabPane>
                                </Tabs>
                            )}
                            <div className={styles.placeHolder}></div>
                        </div>
                    </div>
                </di>
                <div className={styles.selectSuccessWrapper}>
                    <div className={styles.successMsgWrapper}>
                        <span>
                            <span>已选课程</span>
                            <span style={{ marginLeft: '14px' }}>
                                {selectCourseOnlyKeyList.length}门
                            </span>
                        </span>
                        <CaretUpFilled onClick={this.toggleSelectDrawerVisible} />
                    </div>
                </div>
                <div className={styles.selectDrawerWrapper}>
                    <Drawer
                        placement="bottom"
                        closable={false}
                        onClose={this.toggleSelectDrawerVisible}
                        visible={selectDrawerVisibility}
                        getContainer={false}
                    >
                        <div className={styles.selectDrawerContent}>
                            <div className={styles.successMsgWrapper}>
                                <span>
                                    <span>选课成功</span>
                                    <span style={{ marginLeft: '14px' }}>
                                        {selectCourseOnlyKeyList.length}门
                                    </span>
                                </span>
                                <CaretDownFilled onClick={this.toggleSelectDrawerVisible} />
                            </div>
                            <div className={styles.selectCourseListWrapper}>
                                {submitedCourseList.list?.map((courseItem) =>
                                    courseItem.list?.map((groupItem) => (
                                        <div className={styles.selectCourseWrapper}>
                                            <div className={styles.selectCourse}>
                                                <div className={styles.courseName}>
                                                    {groupItem.groupName}
                                                </div>
                                                <div className={styles.courseTime}>
                                                    {this.getWeekStr(groupItem, courseItem.list)}
                                                    {/* {this.getCourseTime(groupItem, courseItem.list)} */}
                                                </div>
                                            </div>
                                            {courseDetail.planStatus == 1 && groupItem.type != 6 ? (
                                                <Popconfirm
                                                    title="确定要取消报名吗?"
                                                    onConfirm={() =>
                                                        this.signUpClick(
                                                            courseItem,
                                                            groupItem,
                                                            false,
                                                            courseType == '选课' ? 0 : 1
                                                        )
                                                    }
                                                    onCancel={this.cancelAction}
                                                    okText="确认"
                                                    cancelText="取消"
                                                    placement="topRight"
                                                >
                                                    <span className={styles.deleteIcon}>取消</span>
                                                </Popconfirm>
                                            ) : null}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </Drawer>
                </div>
                <div className={styles.filterDrawerWrapper}>
                    <Drawer
                        placement="right"
                        closable={false}
                        onClose={this.toggleFilterDrawerVisible}
                        visible={filterDrawerVisibility}
                        getContainer={false}
                    >
                        {schoolList && schoolList.length > 0 ? (
                            <div className={styles.selectItemWrapper}>
                                <div className={styles.selectTitle}>时间</div>
                                <div className={styles.selectItemList}>
                                    {schoolList.map((item) => {
                                        return (
                                            <div
                                                className={
                                                    isEqual(item.idList, isSchoolTimeSelectedId)
                                                        ? styles.hasSelectedItem
                                                        : styles.selectItem
                                                }
                                                onClick={(e) => this.selectTime(item, e)}
                                            >
                                                {item.name}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : null}

                        <div className={styles.selectItemWrapper}>
                            <div className={styles.selectTitle}>类型</div>
                            <div className={styles.selectItemList}>
                                {subjectList.map((item) => (
                                    <div
                                        className={
                                            isEqual(item.id, isSubjectSelectedId)
                                                ? styles.hasSelectedItem
                                                : styles.selectItem
                                        }
                                        onClick={(e) => this.selectSubject(item, e)}
                                    >
                                        {item.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                        {groupingList && groupingList.length > 0 ? (
                            <>
                                <div className={styles.selectItemWrapper}>
                                    <div className={styles.selectTitle}>分组</div>
                                    <div className={styles.selectItemList}>
                                        {groupingList.map((item) => (
                                            <div
                                                className={
                                                    isEqual(item.groupingKey, isGroupSelectedId)
                                                        ? styles.hasSelectedItem
                                                        : styles.selectItem
                                                }
                                                onClick={(e) => this.selectGroup(item, e)}
                                            >
                                                {item.groupingName}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : null}

                        <div className={styles.btnList}>
                            <Button className={styles.reSetBtn} onClick={this.handleReSet}>
                                重置
                            </Button>
                            <Button
                                type="primary"
                                id="confirmBtn"
                                className={styles.confirmBtn}
                                onClick={this.handleConfirm}
                            >
                                确认
                            </Button>
                        </div>
                    </Drawer>
                </div>

                <Modal
                    visible={showNoticeFlag}
                    footer={null}
                    onCancel={() => {
                        this.setState({ showNoticeFlag: false });
                    }}
                    className={styles.showCourseNoticeModal}
                >
                    <p className={styles.title}>选课须知</p>
                    {courseDetail && courseDetail.announcement ? (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: (courseDetail && courseDetail.announcement) || '',
                            }}
                        />
                    ) : (
                        <span className={styles.inform}>
                            {trans('planDetail.read.message', '详细选课说明请查阅学校相关通知。')}
                        </span>
                    )}
                </Modal>
            </div>
        );
    }
}
