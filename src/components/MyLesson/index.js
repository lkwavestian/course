import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon, Modal, Input, Spin } from 'antd';
import styles from './index.less';
import icon from '../../icon.less';
import { trans } from '../../utils/i18n';
import OptionalCourse from './OptionalCourse/index';
import { color } from './config.js';
import InfiniteScroll from 'react-infinite-scroller';
import Header from '../CourseStudentDetailMobile/header';
import Swiper from './swiper';
var isPullDownRefresh = true;
var touch,
    moved,
    startY,
    diff,
    moveDiff = 60;
const { Search } = Input;
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let moneyKeyboardWrapProps;
if (isIPhone) {
    moneyKeyboardWrapProps = {
        onTouchStart: (e) => e.preventDefault(),
    };
}
@connect((state) => ({
    courseList: state.studentDetail.courseList,
    courseStartPeriodList: state.studentDetail.courseStartPeriodList,
    subjectList: state.studentDetail.subjectList,
    submitedCourseList: state.studentDetail.submitedCourseList,
    courseDetail: state.studentDetail.studentCourseDetailContent,
    // scheduleList: state.studentDetail.scheduleList, // 小课表
    optionalMargin: state.studentDetail.optionalMargin,
    currentUser: state.global.currentUser,
    schoolList: state.studentDetail.schoolList,
    currentUser: state.global.currentUser,
}))
export default class CourseDetailMobile extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isExpend: false, // 课程分类展开状态
            // planStatus:2,           // 计划状态，后期以路由传参方式获取，0 未开始;1 进行中;2 已提交;3 已结束;4未发布
            planType: 1, // 1：志愿填报，2：先到先得
            keyword: '', // 关键字查询value
            courseStartTime: '', // 开课学期开始时间
            courseEndTime: '', // 开课学期结束时间
            courseStartPeriodList: [], // 开课周期列表
            subjectList: [], // 学科分类列表
            coursePeriodParams: [], // 开课周期传参数组
            subjectParams: [], // 学科分类传参数组
            isChoose: 0, // 是否查看可报的课
            isBefore: 0, // 是否查看曾经报过的课
            isFilled: 0, // 是否查看未报满的课
            planMsg: null, // 选课计划信息
            selectResult: false, // 可选课程点击报名后成功状态，成功请求可选课程
            isCheck: false, // 已选列表是否选中筛选状态
            isTimeSelected: false, // 开课周期选中状态
            isSubjectSelectedId: '', // 学科选中状态
            pageNum: 1, // --可选课表第几页
            pageSize: 5, // --可选列表每页size
            weekDay: '', // 小课表筛选周几
            lesson: '', // 小课表筛选第几节
            height: document.body.clientHeight - 60, // 限制可选课程列表部分的高度，做下拉加载使用
            optionalCourseList: [], // 可选课程列表
            continueCourseList: [], //续课课程列表
            submitStatus: null,
            loading: false,
            tdHeight: 0, // 小课表每个格子的高度
            hasMore: true, // 默认没有下一页 , 控制下拉加载loading展示
            isListeners: true, // 是否监听下拉下载的滚动条
            isUpdate: false, // 可选列表刷新按钮是否执行
            studentChooseCourseId: '', // 主键id
            studentContinueCourseId: '',
            schoolList: [], // 上课时间筛选
            isSchoolTimeSelectedId: '', // 上课时间选中状态
            instructionVisible: false, //查看选课说明提示
            open: false,
            isopen: false,
            type: 2,
            boardVisible: false,
            maxValue: null,
            minValue: null,
            planMsgId: null,
            detailInstructionVisible: false,
            coursePlanningId: null,
            chooseCoursePlanId: null,
            groupId: null,
            courseLoading: false,
            isspining: false,
            checkStuId: null,
            messageVisible: false,
        };
    }

    componentDidMount() {
        this.setState({
            courseLoading: this.state.type != 3 ? true : false,
        });
        this.getCurrentUserInfo();
        // this.getCurrentUserInfo();
        // this.getCourseDetail();

        // this.getCourseStartPeriod();
        // this.getSubjectList();
        // this.getSelectedList();
        // this.getSchoolTime();

        // 自适应高度
        this.updateSize();
        console.log(this.props.currentUser, 'ppap');
        window.addEventListener('resize', () => this.updateSize());
        let list = window.location.search.split('&');
        let type = 1;
        let isOpen = false;
        let planMsgId = null;
        let courseId = null;
        let groupId = null;
        let checkStuId = null;
        console.log(list, 'll');

        this.getCourseList();
        window.addEventListener('resize', () => this.updateSize());
        // this.getCourseList();
        const moveEle = document.getElementById('courseSelectDetail');

        moveEle.addEventListener(
            'touchstart',
            function (e) {
                console.log(111);
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
                console.log(touch, isPullDownRefresh);
                if (!touch || !isPullDownRefresh) {
                    return;
                }
                var refreshEle = document.getElementById('loadingBox');
                var refreshTxtEle = document.getElementById('refreshTxtEle');
                var touchesDiff = e.touches[0].clientY - startY; //计算的移动位移
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
                    refreshTxtEle.innerHTML = '下拉可刷新';
                } else {
                    refreshTxtEle.innerHTML = '释放可刷新';
                    //弹性
                    if (touchesDiff <= 2 * moveDiff) {
                        distance = moveDiff + 0.5 * (touchesDiff - moveDiff);
                    } else {
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
                var refreshEle = document.getElementById('loadingBox');
                var refreshTxtEle = document.getElementById('refreshTxtEle');
                if (!touch || !moved) {
                    refreshEle.style.height = '0px';
                    return;
                }
                css(refreshEle, 300);
                isPullDownRefresh = false;
                if (diff > moveDiff) {
                    refreshTxtEle.innerHTML = '刷新中';
                    refreshEle.style.height = moveDiff + 'px';

                    setTimeout(() => {
                        // fyappapi.toastInfo('下拉刷新');
                        //延迟模拟接口调用
                        css(refreshEle, 300);
                        that.getCourseList();
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
    }
    setSpin = (value) => {
        this.setState({
            isspining: value,
        });
    };
    changeType = (type) => {
        this.setState(
            {
                type,
                pageNum: 1,
                hasMore: true,
                optionalCourseList: [],
            },
            () => {
                this.getCourseList();
            }
        );
    };
    getCurrentUserInfo = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'global/getNewCurrentUser',
        }).then(() => {
            const { currentUser } = this.props;
            localStorage.setItem('userIdentity', currentUser && currentUser.currentIdentity);
        });
    };
    componentWillUnmount() {
        window.removeEventListener('resize', () => this.updateSize());
        this.props.dispatch({
            type: 'studentDetail/clearData',
            payload: {},
        });
    }

    updateSize() {
        // 窗口变化时重新获取高度
        let __windowClientHeight = document.body.clientHeight;
        this.setState({
            height: __windowClientHeight - 60,
        });
    }

    // 获取选课计划详情
    getCourseDetail = () => {
        const { dispatch } = this.props;
        const { planMsg } = this.state;
        dispatch({
            type: 'studentDetail/getStudentCourseDetails',
            payload: {
                planId: planMsg.id, // --选课计划 id
            },
        });
    };

    // 学科分类列表
    getSubjectList = () => {
        const { dispatch } = this.props;
        const { planMsg } = this.state;
        dispatch({
            type: 'studentDetail/getSubjectListNew',
            payload: {
                // chooseCoursePlanId: planMsg.id,
                schoolId: schoolId || null,
            },
        }).then(() => {
            this.setState({
                subjectList: this.props.subjectList,
            });
        });
    };

    // 上课时间
    getSchoolTime = () => {
        const { dispatch } = this.props;
        const { planMsg } = this.state;
        dispatch({
            type: 'studentDetail/getSchoolTimeList',
            payload: {
                // chooseCoursePlanId: planMsg.id,
            },
        }).then(() => {
            this.setState({
                schoolList: this.props.schoolList,
            });
        });
    };

    // 开课周期列表
    getCourseStartPeriod = () => {
        const { dispatch } = this.props;
        const { planMsg } = this.state;
        dispatch({
            type: 'studentDetail/getCourseStartPeriod',
            payload: {
                chooseCoursePlanId: planMsg.id,
            },
        }).then(() => {
            const { courseStartPeriodList } = this.props;
            let { courseStartTime, courseEndTime } = this.state;
            if (courseStartPeriodList && courseStartPeriodList.length === 1) {
                courseStartTime = courseStartPeriodList[0].startTime;
                courseEndTime = courseStartPeriodList[0].endTime;
            }
            this.setState(
                {
                    courseStartPeriodList: courseStartPeriodList,
                    courseStartTime,
                    courseEndTime,
                },
                () => {
                    // if (this.state.courseStartTime && this.state.courseEndTime) {
                    //     this.getSchedule()
                    // }
                }
            );
        });
    };

    // 获取可选课程列表
    getCourseList = (nextLoad = false) => {
        this.setState({
            courseLoading: true,
        });
        console.log('getCourseList', this.state.type);
        const { dispatch } = this.props;
        let {
            hasMore,
            pageNum,
            weekDay,
            lesson,
            isSubjectSelectedId,
            courseStartTime,
            courseEndTime,
            keyword,
            subjectParams,
            coursePeriodParams,
            isBefore,
            isChoose,
            isFilled,
            planMsg,
            pageSize,
            isListeners,
            isSchoolTimeSelectedId,
        } = this.state;
        //  无数据了
        // if (!this.state.hasMore) {
        //     return;
        // }
        let type =
            this.state.type === 1 ? 'studentDetail/getAllCourse' : 'studentDetail/getListCourseNew';
        let payload =
            this.state.type === 1
                ? {
                      keyWord: keyword,
                      // choosePlanId: planMsg.id,
                      subjectId: isSubjectSelectedId,
                      // weekDayIdList: isSchoolTimeSelectedId,
                      // coursePlanPeriods: coursePeriodParams,
                      // isBefore,
                      // isChoose,
                      // isFilled,
                      // isSubjectSelectedId: this.state.isSubjectSelectedId,
                      // maxValue: this.state.maxValue,
                      schoolId: schoolId || null,
                      // minValue: this.state.minValue, // --周期开始时间
                      // endTime: courseEndTime, // --周期结束时间
                      // weekDay: weekDay, // --周几
                      // lesson: lesson, // --第几节
                      // pageNum: pageNum, // --第几页
                      // pageSize: pageSize, // --每页size
                  }
                : {};
        dispatch({
            type: type,
            payload: payload,
            onFail: () => {
                // let currentUrl = window.location.href;
                // currentUrl = currentUrl.replace(/(\?|&)ticket\=([0-9A-z]+?&|[0-9A-z]+)/ig, '');
                let hash =
                    window.location.hash &&
                    window.location.hash.split('#/') &&
                    window.location.hash.split('#/')[1];
                let currentUrl = `${window.location.origin}/myCourse?path=${hash}`;
                let host =
                    currentUrl.indexOf('daily') > -1
                        ? 'https://login.daily.yungu-inc.org'
                        : 'https://login.yungu.org';
                let userIdentity = localStorage.getItem('userIdentity');
                window.location.href =
                    host + '/cas/login?service=' + encodeURIComponent(currentUrl);
            },
        }).then(() => {
            const { courseList } = this.props;
            const { optionalCourseList, continueCourseList } = this.state;

            let courseListNew = courseList;
            let newData = [];
            let continueNewData = [];
            let arrayPromise = [];
            newData = courseListNew || [];
            continueNewData = courseListNew || [];

            this.setState({
                optionalCourseList: [...newData],
                continueCourseList: [...courseListNew],
                pageNum,
                hasMore: newData.length < (courseList && courseList.total),
                isListeners: newData.length < (courseList && courseList.total),
                isUpdate: false,
                courseLoading: false,
            });
        });
    };

    // 获取已选课程列表
    getSelectedList = () => {
        const { dispatch } = this.props;
        const { planMsg, isCheck, weekDay, lesson } = this.state;
        dispatch({
            type: 'studentDetail/submittedCourse',
            payload: {
                // planId: planMsg.id, // --选课计划 id
                // batchId: planMsg.batchId, // --批次 id
                flag: isCheck ? 0 : 1, // --是否查询选中的课(0 是;1 否)
                weekDay: weekDay, // --周几-x
                lesson: lesson, // --课程节次-Y
            },
        }).then(() => {
            const { submitedCourseList } = this.props;
            let submitStatus = 0;
            submitedCourseList &&
                submitedCourseList.list.map((item) => {
                    item.list &&
                        item.list.length > 0 &&
                        item.list.map((el) => {
                            if (el.type === 3) {
                                submitStatus = el.type;
                            }
                        });
                });
            this.setState({
                submitStatus,
            });
        });
    };

    // 小课表数据获取
    getSchedule = () => {
        const { dispatch } = this.props;
        const { planMsg, courseStartTime, courseEndTime } = this.state;
        this.setState(
            {
                loading: true,
            },
            () => {
                dispatch({
                    type: 'studentDetail/getSchedule',
                    payload: {
                        startTime: courseStartTime,
                        endTime: courseEndTime,
                        choosePlanId: planMsg.id,
                    },
                }).then(() => {
                    const { scheduleList } = this.props;
                    let lessonLength = 0;
                    scheduleList &&
                        scheduleList.map((item, index) => {
                            item.list.map((el, idx) => {
                                if (item.list.length > lessonLength) {
                                    lessonLength = item.list.length;
                                }
                            });
                        });
                    this.setState({
                        loading: false,
                        tdHeight: 25 / lessonLength + 'vh', // 小课表总高度30vh,表头5vh,表格内容高度/最大length
                    });
                });
            }
        );
    };
    messageVisibleChange = () => {
        this.setState({
            messageVisible: !this.state.messageVisible,
        });
    };
    // 可选课程余量
    getOptionMargin = (item, el, index, idx) => {
        const { dispatch } = this.props;
        const { optionalCourseList, planMsg } = this.state;
        this.setState(
            {
                isListeners: false,
            },
            () => {
                dispatch({
                    type: 'studentDetail/optionalMargin',
                    payload: {
                        cancelAndSignUpModelList: [
                            {
                                planId: planMsg.id, // --选课计划 id
                                classIds: el.groupIds, // --班级 id
                                courseId: item.courseId, // --课程 id
                            },
                        ],
                    },
                }).then(() => {
                    const { optionalMargin, courseList } = this.props;
                    optionalCourseList[index].list[idx].classNumber =
                        optionalMargin && optionalMargin.length && optionalMargin[0].classNumber;
                    optionalCourseList[index].list[idx].minLength =
                        optionalMargin && optionalMargin.length && optionalMargin[0].minStudent;
                    optionalCourseList[index].list[idx].maxLength =
                        optionalMargin && optionalMargin.length && optionalMargin[0].maxStudent;
                    this.setState({
                        optionalCourseList: [...optionalCourseList],
                        isListeners:
                            this.state.optionalCourseList.length < (courseList && courseList.total),
                    });
                });
            }
        );
    };

    // 续课课程余量
    getContinueMargin = (item, el, index, idx) => {
        const { dispatch } = this.props;
        const { continueCourseList, planMsg } = this.state;
        this.setState(
            {
                isListeners: false,
            },
            () => {
                dispatch({
                    type: 'studentDetail/optionalMargin',
                    payload: {
                        cancelAndSignUpModelList: [
                            {
                                planId: planMsg.id, // --选课计划 id
                                classIds: el.groupIds, // --班级 id
                                courseId: item.courseId, // --课程 id
                            },
                        ],
                    },
                }).then(() => {
                    const { optionalMargin, courseList } = this.props;
                    continueCourseList[index].list[idx].classNumber =
                        optionalMargin && optionalMargin.length && optionalMargin[0].classNumber;
                    continueCourseList[index].list[idx].minLength =
                        optionalMargin && optionalMargin.length && optionalMargin[0].minStudent;
                    continueCourseList[index].list[idx].maxLength =
                        optionalMargin && optionalMargin.length && optionalMargin[0].maxStudent;
                    this.setState({
                        continueCourseList: [...continueCourseList],
                        isListeners:
                            this.state.continueCourseList.length < (courseList && courseList.total),
                    });
                });
            }
        );
    };

    // 关键字查询
    handleKeyChange = (e) => {
        let keyword = e.target.value;
        this.setState({
            keyword,
        });
    };

    // 按搜索或回车回调
    keySearchChange = (e) => {
        this.setState(
            {
                keyword: e,
                hasMore: true,
                pageNum: 1,
                // optionalCourseList: [],
            },
            () => {
                this.getCourseList();
            }
        );
    };

    // 课程分类展开关闭
    expendClassification = () => {
        this.setState({
            isExpend: !this.state.isExpend,
        });
    };

    // 点击学期时间段筛选（多选）
    screeningTimes = (action, index) => {
        let checkedList = [];
        const courseStartPeriodList = this.state.courseStartPeriodList.map((item, idx) => {
            // 若为当先操作项,isChecked取反控制样式
            if (action.startTime == item.startTime && action.endTime == item.endTime) {
                item.isChecked = !item.isChecked;
            }
            if (item.isChecked) {
                checkedList.push({
                    startTime: item.startTime,
                    endTime: item.endTime,
                });
            }
            return item;
        });
        this.setState({
            courseStartTime: action.startTime,
            courseEndTime: action.endTime,
            courseStartPeriodList,
            coursePeriodParams: checkedList,
        });
    };

    // 点击学期时间段筛选（单选）
    screeningTime = (action) => {
        const { courseStartTime, courseEndTime } = this.state;

        // 操作项与state存储的时间相等，说明需要取消选中，state值清空
        if (courseStartTime == action.startTime && courseEndTime == action.endTime) {
            this.setState(
                {
                    courseStartTime: '',
                    courseEndTime: '',
                    hasMore: true,
                    pageNum: 1,
                    weekDay: '',
                    lesson: '',
                    optionalCourseList: [],
                },
                () => {
                    this.getCourseList();
                }
            );
        } else {
            this.setState(
                {
                    courseStartTime: action.startTime,
                    courseEndTime: action.endTime,
                    hasMore: true,
                    pageNum: 1,
                    optionalCourseList: [],
                },
                () => {
                    this.getCourseList();
                    // this.getSchedule()
                }
            );
        }
    };

    // 点击课程分类筛选(多选)
    screeningSubjects = (action) => {
        let checkedList = [];
        const subjectList = this.state.subjectList.map((item, index) => {
            if (action.id == item.id) {
                item.checked = !item.checked;
            }
            if (item.checked) {
                checkedList.push(item.id);
            }
            return item;
        });
        this.setState({
            subjectList,
            subjectParams: checkedList,
        });
    };
    sure = () => {
        this.setState(
            {
                // optionalCourseList: [],
            },
            () => {
                this.openChange();
                this.getCourseList();
            }
        );
    };
    // 点击课程分类筛选单选
    screeningSubject = (action) => {
        const { isSubjectSelectedId } = this.state;
        if (isSubjectSelectedId == action.id) {
            this.setState(
                {
                    isSubjectSelectedId: '',
                    hasMore: true,
                    pageNum: 1,
                    // optionalCourseList: [],
                }
                // () => {
                //     this.getCourseList();
                // }
            );
        } else {
            this.setState({
                isSubjectSelectedId: action.id,
                hasMore: true,
                pageNum: 1,
            });
        }
    };

    // 点击上课时间筛选课程列表(单选)
    screeningSchoolTime = (action) => {
        const { isSchoolTimeSelectedId } = this.state;
        if (isSchoolTimeSelectedId.toString() == action.idList.toString()) {
            this.setState(
                {
                    isSchoolTimeSelectedId: '',
                    hasMore: true,
                    pageNum: 1,
                    optionalCourseList: [],
                },
                () => {
                    this.getCourseList();
                }
            );
        } else {
            this.setState(
                {
                    isSchoolTimeSelectedId: action.idList,
                    hasMore: true,
                    pageNum: 1,
                    optionalCourseList: [],
                },
                () => {
                    this.getCourseList();
                }
            );
        }
    };

    // 获取是否查看可报课程的参数
    isChooseChange = (isChoose) => {
        this.setState(
            {
                isChoose,
                hasMore: true,
                pageNum: 1,
                optionalCourseList: [],
            },
            () => {
                this.getCourseList();
            }
        );
    };

    // 获取是否查看曾报过的课的参数
    isBeforeChange = (isBefore) => {
        this.setState(
            {
                isBefore,
                hasMore: true,
                pageNum: 1,
                optionalCourseList: [],
            },
            () => {
                this.getCourseList();
            }
        );
    };

    // 获取是否查看未报满课的参数
    isUnfilledChange = (isFilled) => {
        this.setState(
            {
                isFilled,
                hasMore: true,
                pageNum: 1,
                optionalCourseList: [],
            },
            () => {
                this.getCourseList();
            }
        );
    };

    calculateTime = (time) => {
        time = time.replace(/-/g, '/');
        let calculate = new Date(time);
        let preTime = new Date();
        let differ = Math.abs(preTime.getTime() - calculate.getTime());
        let days = Math.floor(differ / (24 * 3600 * 1000));
        //计算出小时数
        let leave1 = differ % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
        let hours = Math.floor(leave1 / (3600 * 1000));
        //计算相差分钟数
        let leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
        let minutes = Math.floor(leave2 / (60 * 1000));
        let result = days + '天' + hours + '小时' + minutes + '分钟';
        return result;
    };

    // 可选列表-我要报名/取消报名操作后刷新列表
    requestResult = (result, type, studentChooseCourseId) => {
        const { optionalCourseList, continueCourseList } = this.state;
        if (result) {
            this.setState(
                {
                    studentChooseCourseId, // 存储已选列表传入的主键id,传到可选列表根据id改变对应课程的报名状态
                },
                () => {
                    // 暂时关掉小课表请求
                    // if (courseStartTime && courseEndTime) {
                    //     this.getSchedule()
                    // }

                    // 可选列表更新不刷新列表，待研究
                    if (type == 'option') {
                        this.getSelectedList();
                    }
                    if (type == 'select') {
                        optionalCourseList.map((item, index) => {
                            item.list.map((el, idx) => {
                                if (el.studentChooseCourseId == this.state.studentChooseCourseId) {
                                    this.getOptionMargin(item, el, index, idx);
                                }
                            });
                        });
                        continueCourseList.map((item, index) => {
                            item.list &&
                                item.list.map((el, idx) => {
                                    if (
                                        el.studentChooseCourseId == this.state.studentChooseCourseId
                                    ) {
                                        this.getContinueMargin(item, el, index, idx);
                                    }
                                });
                        });
                        this.getSelectedList();
                    }
                }
            );
        }
    };
    changeStu = (id) => {
        this.setState({
            checkStuId: id,
        });
    };
    // 已选列表-删除课程后刷新列表
    deleteResult = (result, studentChooseCourseId) => {
        const { courseStartTime, courseEndTime } = this.state;
        if (result) {
            this.setState(
                {
                    hasMore: false,
                    pageNum: 1,
                    studentChooseCourseId, // 存储已选列表传入的主键id,传到可选列表根据id改变对应课程的报名状态
                },
                () => {
                    this.getSelectedList();
                }
            );
        }
    };

    // 已选列表-点击查看已选中课程操作刷新列表
    viewSelected = (isCheck) => {
        this.setState(
            {
                isCheck,
                hasMore: false,
                pageNum: 1,
            },
            () => {
                this.getSelectedList();
            }
        );
    };

    courseListUpdate = () => {
        // this.getCourseDetail();
        this.setState(
            {
                hasMore: true,
                pageNum: 1,
                isListeners: false,
                isUpdate: true,
                optionalCourseList: [],
            },
            () => {
                this.getCourseList();
            }
        );
    };

    // 传入小课表筛选的周几和第几节
    exportWeekAndLesson = (week, lesson) => {
        this.setState(
            {
                weekDay: week,
                lesson: lesson,
                hasMore: true,
                pageNum: 1,
                optionalCourseList: [],
            },
            () => {
                this.getCourseList();
                this.getSelectedList();
            }
        );
    };

    // 查看选课说明弹窗显示
    checkInstruction = () => {
        this.setState({
            instructionVisible: true,
        });
    };
    openChange = () => {
        if (!this.state.open) {
            this.props
                .dispatch({
                    type: 'studentDetail/getSubjectListNew',
                    payload: {
                        // chooseCoursePlanId: planMsg.id,
                        schoolId: schoolId || null,
                    },
                })
                .then(() => {
                    this.setState({
                        subjectList: this.props.subjectList,
                        open: !this.state.open,
                    });
                });
        } else {
            this.setState({
                open: !this.state.open,
            });
        }
    };
    reset = () => {
        this.setState({
            isSubjectSelectedId: '',
        });
    };
    detailInstructionVisibleChange = () => {
        this.setState({
            detailInstructionVisible: !this.state.detailInstructionVisible,
        });
    };
    minChange = (value) => {
        this.setState({
            minValue: value,
        });
    };
    maxChange = (value) => {
        this.setState({
            maxValue: value,
        });
    };
    isOpenChange = () => {
        this.setState({
            isopen: !this.state.isopen,
        });
    };
    onClose = () => {
        this.setState({
            boardVisible: !this.state.boardVisible,
        });
    };
    scrollCourseHTML = () => {
        const {
            courseStartPeriodList,
            subjectList,
            courseStartTime,
            courseEndTime,
            isSubjectSelectedId,
            height,
            isExpend,
            hasMore,
            optionalCourseList,
            continueCourseList,
            pageNum,
            submitStatus,
            isCheck,
            isListeners,
            isUpdate,
            studentChooseCourseId,
            planMsg,
            schoolList,
            isSchoolTimeSelectedId,
        } = this.state;
        const { courseList, courseDetail, currentUser } = this.props;
        // 课程分类展开关闭样式
        const expend = {
            height: isExpend ? 'auto' : '40px',
            overflow: isExpend ? 'unset' : 'hidden',
        };

        // 选课计划状态值
        const planStatus = courseDetail.planStatus;

        // 筛选条件选中样式
        const checked = {
            color: '#A21F27',
            background: 'rgba(162,31,39,0.15)',

            // borderColor: color.main,
        };

        // 选课计划不同状态不同样式

        const timeAndremain = {
            borderColor:
                submitStatus != 3 &&
                (planStatus === 0
                    ? color.yellow
                    : planStatus === 1
                    ? color.yellow
                    : planStatus === 3
                    ? color.gray
                    : ''),
            color:
                submitStatus != 3 &&
                (planStatus === 0
                    ? color.yellow
                    : planStatus === 1
                    ? color.yellow
                    : planStatus === 3
                    ? color.gray
                    : ''),
            background:
                submitStatus != 3 &&
                (planStatus === 0
                    ? color.backgroundYellow
                    : planStatus === 1
                    ? color.backgroundBlue
                    : planStatus === 3
                    ? '#fafafa'
                    : ''),
        };
        let hasMsg = currentUser && currentUser.userId ? true : false;

        const sidebar = (
            <div className={styles.sideContent}>
                <div></div>
                <div className={styles.sideTitle}> {trans('mobile.classification', '分类')}</div>
                <span className={styles.classification}>
                    {subjectList &&
                        subjectList.length > 0 &&
                        subjectList.map((item, index) => {
                            return (
                                <span
                                    className={styles.content}
                                    key={item.id}
                                    onClick={this.screeningSubject.bind(this, item)}
                                    // style={item.checked ? checked : null}
                                    style={item.id == isSubjectSelectedId ? checked : null}
                                >
                                    {item.name}
                                </span>
                            );
                        })}
                </span>
                <div className={styles.sideBottom}>
                    <div className={styles.reset} onClick={this.reset}>
                        {trans('mobile.reset', '重置')}
                    </div>
                    <div className={styles.sure} onClick={this.sure}>
                        {trans('global.confirm', '确定')}
                    </div>
                </div>
            </div>
        );

        return (
            <div className={styles.scrollMobile} id="courseSelectDetail">
                <div id="loadingBox" className={styles.loadingBox}>
                    <div className={styles.loaded}></div>
                    <div id="refreshTxtEle" className={styles.loadText}>
                        释放更新数据
                    </div>
                </div>
                <div className={styles.headBox}>
                    {hasMsg && (
                        <div className={styles.tabArea}>
                            <Header cur={0} />
                        </div>
                    )}
                </div>
                <Spin spinning={this.state.courseLoading && this.state.type != 3}>
                    <InfiniteScroll
                        initialLoad={false}
                        pageStart={pageNum}
                        loadMore={this.getCourseList}
                        hasMore={isListeners && pageNum > 1}
                        useWindow={false}
                    >
                        <Spin spinning={this.state.isspining}>
                            <div
                                className={[
                                    styles.cardList,
                                    this.state.type !== 1
                                        ? styles.noSearchList
                                        : hasMsg
                                        ? styles.newSearchList
                                        : '',
                                ].join(' ')}
                            >
                                {this.state.type === 1 && courseList && courseList.length > 0 ? (
                                    <Swiper
                                        detailInstructionVisibleChange={
                                            this.detailInstructionVisibleChange
                                        }
                                    />
                                ) : null}

                                <OptionalCourse
                                    optionalCourse={optionalCourseList}
                                    total={courseList && courseList.total}
                                    isChooseChange={this.isChooseChange}
                                    isBeforeChange={this.isBeforeChange}
                                    isUnfilledChange={this.isUnfilledChange}
                                    requestResult={this.requestResult}
                                    planStatus={planStatus}
                                    submitStatus={submitStatus}
                                    periodMaxQuantity={
                                        courseDetail && courseDetail.periodMaxQuantity
                                    }
                                    chooseCourseRuleOpen={
                                        courseDetail && courseDetail.chooseCourseRuleOpen
                                    }
                                    groupId={this.state.groupId}
                                    onRef={this.onRef}
                                    courseClassRule={courseDetail && courseDetail.courseClassRule}
                                    isCheck={isCheck}
                                    courseDetail={courseDetail}
                                    courseListUpdate={this.courseListUpdate}
                                    isUpdate={isUpdate}
                                    studentChooseCourseId={studentChooseCourseId}
                                    hasMore={this.state.hasMore}
                                    planMsg={planMsg}
                                    isOpenChange={this.isOpenChange}
                                    isopen={this.state.isopen}
                                    type={this.state.type}
                                    changeType={this.changeType}
                                    detailInstructionVisible={this.state.detailInstructionVisible}
                                    detailInstructionVisibleChange={
                                        this.detailInstructionVisibleChange
                                    }
                                    coursePlanningId={this.state.coursePlanningId}
                                    chooseCoursePlanId={this.state.chooseCoursePlanId}
                                    setSpin={this.setSpin}
                                    isspining={this.state.isspining}
                                    checkStuId={this.state.checkStuId}
                                    changeStu={this.changeStu}
                                    getCourseList={this.getCourseList}
                                />
                            </div>
                        </Spin>
                    </InfiniteScroll>
                </Spin>
                {/* {hasMore ? (
                        <div className={styles.tryLoad}>
                            <Spin tip="Try to loading ..." />
                        </div>
                    ) : (
                        <span className={styles.noMore}>{trans('list.noMore', '没有更多了')}</span>
                    )} */}
                <a
                    href={`${window.location.origin}${window.location.pathname}#/course/student/detailMobile`}
                >
                    <span className={[icon.iconfont, styles.closeModal].join(' ')}>
                        <span>{trans('mobile.returnHome', '返回首页')}</span>
                    </span>
                </a>
            </div>
        );
    };

    getBannerList = () => {
        const { courseList } = this.props;
        let arr = [];
        if (courseList && courseList.length <= 5) {
            arr = courseList;
        } else {
            arr = courseList.slice(0, 5);
        }
        return arr;
    };

    click = () => {
        console.log(11);
    };
    render() {
        const {
            planMsg,
            selectResult,
            courseStartTime,
            courseEndTime,
            submitStatus,
            courseStartPeriodList,
            tdHeight,
            loading,
            isCheck,
            schoolList,
            instructionVisible,
        } = this.state;
        const { submitedCourseList, courseDetail, scheduleList, currentUser } = this.props;
        // 选课方式不同状态不同样式

        // 选课计划状态
        const planStatus = courseDetail.planStatus;
        return <div className={styles.selectDetail}>{this.scrollCourseHTML()}</div>;
    }
}
