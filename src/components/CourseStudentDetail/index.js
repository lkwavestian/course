import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon, Modal, Input, List, Spin } from 'antd';
import styles from './index.less';
import icon from '../../icon.less';
import { trans } from '../../utils/i18n';
import OptionalCourse from './OptionalCourse/index';
import UnfilledCourse from './UnfilledCourse/index';
import CourseSelected from './CourseSelected/index';
import { color } from './config.js';
import { Link, routerRedux } from 'dva/router';
import InfiniteScroll from 'react-infinite-scroller';
import ParentLoginView from '../GlobalUtil/ParentLoginView';
import moment from 'moment';
import lodash from 'lodash';

const { Search } = Input;
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
    groupingList: state.courseBaseDetail.groupingList,
}))
export default class CourseDetail extends PureComponent {
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
            planMsg: JSON.parse(localStorage.getItem('planMsg')) || JSON.parse(window.planMsg), // 选课计划信息
            selectResult: false, // 可选课程点击报名后成功状态，成功请求可选课程
            isCheck: false, // 已选列表是否选中筛选状态
            isTimeSelected: false, // 开课周期选中状态
            isSubjectSelectedId: '', // 学科选中状态
            isGroupSelectedId: '', // 班级分组选中状态
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
        };
    }

    componentDidMount() {
        this.getCurrentUserInfo();
        this.getCourseDetail();
        this.getCourseList();
        this.getCourseStartPeriod();
        this.getSubjectList();
        this.getSelectedList();
        this.getSchoolTime();
        this.getGroupList();

        // 自适应高度
        this.updateSize();
        window.addEventListener('resize', () => this.updateSize());
    }

    getGroupList = () => {
        const { planMsg } = this.state;
        this.props.dispatch({
            type: 'courseBaseDetail/selectGroupingByChoosePlan',
            payload: {
                choosePlanId: planMsg.id,
            },
        });
    };

    getCurrentUserInfo = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'global/getCurrentUser',
        }).then(() => {
            const { currentUser } = this.props;
            localStorage.setItem('userIdentity', currentUser && currentUser.currentIdentity);
        });
    };

    componentWillUnmount() {
        window.removeEventListener('resize', () => this.updateSize());
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
            type: 'studentDetail/getSubjectList',
            payload: {
                chooseCoursePlanId: planMsg.id,
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
                chooseCoursePlanId: planMsg.id,
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
        const { dispatch, groupingList } = this.props;
        let {
            hasMore,
            pageNum,
            weekDay,
            lesson,
            isSubjectSelectedId,
            isGroupSelectedId,
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

        let tempGroupObj =
            (groupingList &&
                groupingList.length > 0 &&
                groupingList.find((item) => item.groupingKey == isGroupSelectedId)) ||
            [];
        //  无数据了
        if (!this.state.hasMore) {
            return;
        }
        dispatch({
            type: 'studentDetail/getListCourse',
            payload: {
                keyword,
                choosePlanId: planMsg.id,
                subjectId: isSubjectSelectedId,
                weekDayIdList: isSchoolTimeSelectedId,
                // coursePlanPeriods: coursePeriodParams,
                // isBefore,
                // isChoose,
                isFilled,
                startTime: courseStartTime, // --周期开始时间
                endTime: courseEndTime, // --周期结束时间
                weekDay, // --周几
                lesson, // --第几节
                pageNum, // --第几页
                pageSize, // --每页size
                groupGroupingNumJsonDTOList:
                    tempGroupObj && tempGroupObj.length == 0 ? [] : [tempGroupObj],
            },
        }).then(() => {
            const { courseList } = this.props;
            const { optionalCourseList, continueCourseList } = this.state;
            let newData = [];
            let continueNewData = [];
            let arrayPromise = [];
            if (
                JSON.stringify(optionalCourseList) !=
                JSON.stringify(courseList && courseList.courseOutList)
            ) {
                // debugger
                newData =
                    optionalCourseList.concat((courseList && courseList.courseOutList) || []) || [];
            } else {
                newData = (courseList && courseList.courseOutList) || [];
            }

            /* if (
        JSON.stringify(continueCourseList) !=
        JSON.stringify(courseList && courseList.continueCourseList)
      ) {
        continueNewData =
          continueCourseList.concat(
            (courseList && courseList.continueCourseList) || []
          ) || [];
      } else {
        continueNewData = (courseList && courseList.continueCourseList) || [];
      } */
            continueNewData = (courseList && courseList.continueCourseList) || [];

            // this.setState({
            //     hasMore: newData.length < (courseList && courseList.total),
            //     isListeners:newData.length < (courseList && courseList.total),
            // })
            if (planMsg.type === 2) {
                this.setState(
                    {
                        isListeners: false,
                        hasMore: false,
                    },
                    () => {
                        let cancelAndSignUpModelList = [];
                        newData.map((item) => {
                            item.list.map((el) => {
                                arrayPromise.push(
                                    new Promise((resolve, reject) => {
                                        cancelAndSignUpModelList.push({
                                            planId: planMsg.id, // --选课计划 id
                                            classIds: el.groupIds, // --班级 id
                                            courseId: item.courseId,
                                        });
                                    })
                                );
                                return el;
                            });
                            return item;
                        });
                        continueNewData.map((item) => {
                            item.list &&
                                item.list.map((el) => {
                                    arrayPromise.push(
                                        new Promise((resolve, reject) => {
                                            cancelAndSignUpModelList.push({
                                                planId: planMsg.id, // --选课计划 id
                                                classIds: el.groupIds, // --班级 id
                                                courseId: item.courseId,
                                            });
                                        })
                                    );
                                    return el;
                                });
                            return item;
                        });
                        dispatch({
                            type: 'studentDetail/optionalMargin',
                            payload: {
                                cancelAndSignUpModelList, // --课程 id
                            },
                            onSuccess: (data) => {
                                newData = newData.map((item) => {
                                    item.list.map((el) => {
                                        data.map((i) => {
                                            if (i.onlyKey === el.onlyKey) {
                                                el.classNumber = i.classNumber || 0;
                                                el.minLength = i.minStudent || 0;
                                                el.maxLength = i.maxStudent || 0;
                                            }
                                        });
                                        return el;
                                    });
                                    return item;
                                });
                                continueNewData = continueNewData.map((item) => {
                                    item.list &&
                                        item.list.map((el) => {
                                            data.map((i) => {
                                                if (i.onlyKey === el.onlyKey) {
                                                    el.classNumber = i.classNumber || 0;
                                                    el.minLength = i.minStudent || 0;
                                                    el.maxLength = i.maxStudent || 0;
                                                }
                                            });
                                            return el;
                                        });
                                    return item;
                                });
                                pageNum++;
                                this.setState({
                                    optionalCourseList: [...newData],
                                    continueCourseList: [...continueNewData],
                                    pageNum,
                                    hasMore: newData.length < (courseList && courseList.total),
                                    isListeners: newData.length < (courseList && courseList.total),
                                    isUpdate: false,
                                });
                            },
                        });
                    }
                );
            } else {
                this.setState({
                    optionalCourseList: [...newData],
                    continueCourseList: [...continueNewData],
                    pageNum,
                    hasMore: newData.length < (courseList && courseList.total),
                    isListeners: newData.length < (courseList && courseList.total),
                    isUpdate: false,
                });
            }
        });
    };

    // 获取已选课程列表
    getSelectedList = () => {
        const { dispatch } = this.props;
        const { planMsg, isCheck, weekDay, lesson } = this.state;
        dispatch({
            type: 'studentDetail/submittedCourse',
            payload: {
                planId: planMsg.id, // --选课计划 id
                batchId: planMsg.batchId, // --批次 id
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
                optionalCourseList: [],
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

    // 点击课程分类筛选单选
    screeningSubject = (action) => {
        const { isSubjectSelectedId } = this.state;
        if (isSubjectSelectedId == action.id) {
            this.setState(
                {
                    isSubjectSelectedId: '',
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
                    isSubjectSelectedId: action.id,
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

    selectGroup = (action) => {
        const { isGroupSelectedId } = this.state;
        if (isGroupSelectedId == action.groupingKey) {
            this.setState(
                {
                    isGroupSelectedId: '',
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
                    isGroupSelectedId: action.groupingKey,
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
                    // if (courseStartTime && courseEndTime) {
                    //     this.getSchedule()
                    // }
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
        this.getCourseDetail();
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

    scrollCourseHTML() {
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
            isGroupSelectedId,
        } = this.state;
        const { courseList, courseDetail, groupingList } = this.props;
        // 课程分类展开关闭样式
        const expend = {
            height: isExpend ? 'auto' : '40px',
            overflow: isExpend ? 'unset' : 'hidden',
        };

        // 选课计划状态值
        const planStatus = courseDetail.planStatus;

        // 筛选条件选中样式
        const checked = {
            color: color.main,
            background: color.backgroundBlue,
            borderColor: color.main,
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

        return (
            <div className={styles.scrollCourse} style={{ height: `${height}px`, width: '100%' }}>
                <InfiniteScroll
                    initialLoad={false}
                    pageStart={pageNum}
                    loadMore={this.getCourseList}
                    hasMore={isListeners && pageNum > 1}
                    useWindow={false}
                >
                    <div className={styles.detailContentLeft}>
                        {planMsg.batchType === 1 ? (
                            <div className={styles.cardList}>
                                <UnfilledCourse
                                    optionalCourse={continueCourseList}
                                    planMsg={planMsg}
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
                                    courseClassRule={courseDetail && courseDetail.courseClassRule}
                                    isCheck={isCheck}
                                    courseDetail={courseDetail}
                                    courseListUpdate={this.courseListUpdate}
                                    isUpdate={isUpdate}
                                    studentChooseCourseId={studentChooseCourseId}
                                    hasMore={this.state.hasMore}
                                    schoolList={this.props.schoolList}
                                />
                            </div>
                        ) : null}

                        <div className={styles.optionalWrapper}>
                            <div className={styles.queryCourse}>
                                <div className={styles.head}>
                                    <span className={styles.title}>
                                        {trans('course.plan.allcourse', '全部课程')}
                                    </span>
                                    <span className={styles.amount}>
                                        {trans('planDetail.optional.allNum', '共 {$num} 个课程', {
                                            num: (courseList && courseList.total) || '0',
                                        })}
                                    </span>
                                    <span className={styles.update} onClick={this.courseListUpdate}>
                                        {isUpdate ? (
                                            <span>
                                                <Icon type="loading" />
                                                <span className={styles.updateFont}>刷新</span>
                                            </span>
                                        ) : (
                                            <span>
                                                <i className={icon.iconfont}>&#xe732;</i>
                                                <span className={styles.updateFont}>刷新</span>
                                            </span>
                                        )}
                                    </span>
                                    <div
                                        className={styles.timeMention}
                                        style={{ color: timeAndremain.color }}
                                    >
                                        {planMsg.batchType === 1 ? (
                                            <span>报名时间： 未开始</span>
                                        ) : (
                                            <div>
                                                <span
                                                    className={styles.icon}
                                                    style={{ marginRight: 10 }}
                                                >
                                                    {' '}
                                                    <i className={icon.iconfont}>&#xe7d9;</i>{' '}
                                                </span>
                                                <span className={styles.selectTime}>
                                                    选课时间：
                                                    {moment(planMsg.startTime).format(
                                                        'YYYY-MM-DD HH:mm'
                                                    )}{' '}
                                                    ~{' '}
                                                    {moment(planMsg.endTime).format(
                                                        'YYYY-MM-DD HH:mm'
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <Search
                                    placeholder={trans(
                                        'planDetail.input.placeholder',
                                        '输入关键字搜索课程'
                                    )}
                                    onSearch={this.keySearchChange}
                                    className={styles.keySearch}
                                    onChange={this.handleKeyChange}
                                />
                                <span className={styles.formItem}>
                                    <span className={styles.label}>
                                        {trans('planDetail.period', '学习周期')}
                                    </span>
                                    <span className={styles.timeList}>
                                        {courseStartPeriodList.map((item, index) => {
                                            return (
                                                <span
                                                    className={styles.content}
                                                    onClick={this.screeningTime.bind(this, item)}
                                                    key={index}
                                                    style={
                                                        item.startTime == courseStartTime &&
                                                        item.endTime == courseEndTime
                                                            ? checked
                                                            : null
                                                    }
                                                >
                                                    {item.desc ? (
                                                        item.desc
                                                    ) : (
                                                        <span>
                                                            {item.startTimeString}{' '}
                                                            {trans('list.to', '至')}
                                                            {item.endTimeString}
                                                        </span>
                                                    )}
                                                </span>
                                            );
                                        })}
                                    </span>
                                </span>
                                {schoolList && schoolList.length > 0 && (
                                    <span className={styles.formItem}>
                                        <span className={styles.label}>
                                            {trans('planDetail.classTime', '上课时间')}
                                        </span>
                                        <span className={styles.classification}>
                                            {schoolList &&
                                                schoolList.length > 0 &&
                                                schoolList.map((item, index) => {
                                                    return (
                                                        <span
                                                            className={styles.content}
                                                            key={item.idList}
                                                            onClick={this.screeningSchoolTime.bind(
                                                                this,
                                                                item
                                                            )}
                                                            style={
                                                                item.idList.toString() ==
                                                                isSchoolTimeSelectedId.toString()
                                                                    ? checked
                                                                    : null
                                                            }
                                                        >
                                                            {item.name}
                                                        </span>
                                                    );
                                                })}
                                        </span>
                                    </span>
                                )}

                                <span className={styles.formItem}>
                                    <span className={styles.label}>
                                        {trans('planDetail.classification', '课程分类')}
                                    </span>
                                    <span className={styles.classification}>
                                        {subjectList &&
                                            subjectList.length > 0 &&
                                            subjectList.map((item, index) => {
                                                return (
                                                    <span
                                                        className={styles.content}
                                                        key={item.id}
                                                        onClick={this.screeningSubject.bind(
                                                            this,
                                                            item
                                                        )}
                                                        // style={item.checked ? checked : null}
                                                        style={
                                                            item.id == isSubjectSelectedId
                                                                ? checked
                                                                : null
                                                        }
                                                    >
                                                        {item.name}
                                                    </span>
                                                );
                                            })}
                                    </span>
                                    {/* <span className={styles.expend} onClick={this.expendClassification}><i className={icon.iconfont}>&#xe613;</i></span> */}
                                </span>
                                {groupingList && groupingList.length > 0 ? (
                                    <span className={styles.formItem}>
                                        <span className={styles.label}>
                                            {trans('selCourse.classGroups', '班级分组')}
                                        </span>
                                        <span className={styles.classification}>
                                            {groupingList &&
                                                groupingList.length > 0 &&
                                                groupingList.map((item, index) => {
                                                    return (
                                                        <span
                                                            className={styles.content}
                                                            key={item.groupingKey}
                                                            onClick={this.selectGroup.bind(
                                                                this,
                                                                item
                                                            )}
                                                            style={
                                                                item.groupingKey ==
                                                                isGroupSelectedId
                                                                    ? checked
                                                                    : null
                                                            }
                                                        >
                                                            {item.groupingName}
                                                        </span>
                                                    );
                                                })}
                                        </span>
                                    </span>
                                ) : null}
                            </div>
                            <div className={styles.cardList}>
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
                                    courseClassRule={courseDetail && courseDetail.courseClassRule}
                                    isCheck={isCheck}
                                    courseDetail={courseDetail}
                                    courseListUpdate={this.courseListUpdate}
                                    isUpdate={isUpdate}
                                    studentChooseCourseId={studentChooseCourseId}
                                    hasMore={this.state.hasMore}
                                    planMsg={planMsg}
                                    schoolList={this.props.schoolList}
                                />
                            </div>
                        </div>
                    </div>
                </InfiniteScroll>
                {hasMore ? (
                    <div className={styles.tryLoad}>
                        <Spin tip="Try to loading ..." />
                    </div>
                ) : (
                    <span className={styles.noMore}>{trans('list.noMore', '没有更多了')}</span>
                )}
            </div>
        );
    }

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
            instructionVisible,
        } = this.state;
        const { submitedCourseList, courseDetail, scheduleList, currentUser } = this.props;
        // 选课方式不同状态不同样式
        const applyCourse = {
            color: planMsg && planMsg.type === 1 ? color.green : color.yellow,
            borderColor: planMsg && planMsg.type === 1 ? color.green : color.yellow,
        };

        // 选课计划状态
        const planStatus = courseDetail.planStatus;

        return (
            <div className={styles.selectDetail}>
                <div className={styles.header}>
                    <div className={styles.leftHead}>
                        <Link className={styles.back} to="/course/student/list">
                            <Icon type="left" />
                        </Link>
                        <span className={styles.title}>{courseDetail && courseDetail.name}</span>
                        {/*<span className={styles.checkInstruction} onClick={this.checkInstruction}>
                            {' '}
                            {trans('planDetail.viewInstructions', '查看选课说明')}{' '}
                        </span>*/}
                        {/* <span className={styles.status} style={applyCourse}>
                        {
                            courseDetail.type == 1 ? trans("coursePlan.type.select",'志愿填报') : trans("coursePlan.type.take",'先到先得')
                        }
                    </span> */}
                        {/* <span className={styles.checkInstruction} onClick={this.checkInstruction}> {trans("planDetail.viewInstructions",'查看选课说明')} </span> */}
                    </div>
                    {currentUser && currentUser.currentIdentity == 'parent' ? (
                        <ParentLoginView
                            currentUser={currentUser}
                            color="#4d7fff"
                            nameColor="#666"
                            isFromDetail={true}
                        />
                    ) : null}
                </div>
                <div className={styles.placeholder}></div>
                <div className={styles.detailContent}>
                    {this.scrollCourseHTML()}
                    <div className={styles.detailContentRight}>
                        <CourseSelected
                            submitedCourseList={submitedCourseList}
                            planStatus={planStatus}
                            selectResult={selectResult}
                            deleteResultFun={this.deleteResult}
                            viewSelected={this.viewSelected}
                            courseDetail={courseDetail}
                            requestResult={this.requestResult}
                            schoolList={this.props.schoolList}
                        />
                    </div>
                </div>
                <Modal
                    className={styles.checkInstructionModal}
                    footer={null}
                    visible={instructionVisible}
                    width="56%"
                    onCancel={() => {
                        this.setState({ instructionVisible: false });
                    }}
                >
                    <p className={styles.title}> {trans('planDetail.instructions', '选课说明')} </p>
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
