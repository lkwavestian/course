//课程管理
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon, Modal, Input, List, Spin, InputNumber, Checkbox, message } from 'antd';
import pathToRegexp from 'path-to-regexp';
import styles from './index.less';
import icon from '../../icon.less';
import { Drawer } from 'antd-mobile';
import { trans } from '../../utils/i18n';
import MobileDetail from '../../components/MobileDetail';

const week = {
    1: trans('mobile.Mon', '周一'),
    2: trans('mobile.Tue', '周二'),
    3: trans('mobile.Wed', '周三'),
    4: trans('mobile.Thu', '周四'),
    5: trans('mobile.Fri', '周五'),
    6: trans('mobile.Sat', '周六'),
    7: trans('mobile.Sun', '周日'),
};
var isPullDownRefresh = true;
var touch,
    moved,
    startY,
    diff,
    moveDiff = 60;
@connect((state) => ({
    optionalMargin: state.studentDetail.optionalMargin,
    showCoursePlanningDetail: state.course.showCoursePlanningDetail,
    currentUser: state.global.currentUser,
}))
export default class CoursetDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.url = this.props.history.location.pathname;
        this.pathMatch = pathToRegexp(
            '/courseDetail/:planId/:chooseCourseId/:needButton/:groupId?/:stuId?/:checkLesson?'
        ).exec(this.url);
        this.coursePlanningId = parseInt(this.pathMatch[1], 10) || null;
        this.chooseCoursePlanId = parseInt(this.pathMatch[2], 10) || null;
        this.state = {
            checkStuId:
                this.pathMatch[5] && this.pathMatch[5] !== 'null'
                    ? parseInt(this.pathMatch[5])
                    : null,
            isopen: this.pathMatch[4] && this.pathMatch[4] !== 'null' ? true : false,
            lessonId:
                this.pathMatch[4] && this.pathMatch[4] !== 'null'
                    ? parseInt(this.pathMatch[4])
                    : null,
            needButton: JSON.parse(this.pathMatch[3]) || false,
            groupId:
                this.pathMatch[4] && this.pathMatch[4] !== 'null'
                    ? parseInt(this.pathMatch[4])
                    : null,
            checkedLesson: {},
            isCheckId:
                this.pathMatch[4] && this.pathMatch[4] !== 'null'
                    ? parseInt(this.pathMatch[4])
                    : null,
            planMsgId: null,
            isspining: false,
            top: 0,
            agreeRefund: false,
            detailVisible: false,
            isShowPrice: true,
            isWeide: true,
        };
    }

    componentWillMount() {
        this.getDetail();
    }
    getDetail = () => {
        this.setState({
            isspining: true,
        });
        if (this.state.groupId) {
            this.props
                .dispatch({
                    type: 'course/showCoursePlanningDetailMobile',
                    payload: {
                        coursePlanningId: this.coursePlanningId,
                        chooseCoursePlanId: this.chooseCoursePlanId,
                        schoolId: schoolId || null,
                    },
                })
                .then(() => {
                    this.setState({
                        isspining: false,
                    });
                    if (
                        this.props.showCoursePlanningDetail &&
                        this.props.showCoursePlanningDetail.planningClassModels &&
                        this.props.showCoursePlanningDetail.planningClassModels.length
                    ) {
                        this.props.showCoursePlanningDetail.planningClassModels.map((item) => {
                            if (item.groupId === this.state.groupId) {
                                this.setState({
                                    checkedLesson: item,
                                });
                            }
                        });
                        if (!this.state.groupId) {
                            this.setState({
                                groupId:
                                    this.props.showCoursePlanningDetail.planningClassModels[0]
                                        .groupId,
                                lessonId:
                                    this.props.showCoursePlanningDetail.planningClassModels[0]
                                        .groupId,
                                checkedLesson:
                                    this.props.showCoursePlanningDetail.planningClassModels[0],
                            });
                        }
                    }
                    this.props.dispatch({
                        type: 'studentDetail/optionalMarginNew',
                        payload: {
                            cancelAndSignUpModelList: [
                                {
                                    planId: this.chooseCoursePlanId || null, // --选课计划 id
                                    classIds: [this.state.groupId], // --班级 id
                                    courseId: this.props.showCoursePlanningDetail.courseId || null, // --课程 id
                                },
                            ],
                        },
                    });
                });
        } else {
            this.props
                .dispatch({
                    type: 'course/showCoursePlanningDetailMobile',
                    payload: {
                        coursePlanningId: this.coursePlanningId,
                        chooseCoursePlanId: this.chooseCoursePlanId,
                        schoolId: schoolId || null,
                    },
                })
                .then(() => {
                    this.setState({
                        isspining: false,
                    });
                    if (
                        this.props.showCoursePlanningDetail &&
                        this.props.showCoursePlanningDetail.planningClassModels &&
                        this.props.showCoursePlanningDetail.planningClassModels.length
                    ) {
                        this.setState({
                            groupId:
                                this.props.showCoursePlanningDetail.planningClassModels[0].groupId,
                            lessonId:
                                this.props.showCoursePlanningDetail.planningClassModels[0].groupId,
                            checkedLesson:
                                this.props.showCoursePlanningDetail.planningClassModels[0],
                            isCheckId:
                                this.props.showCoursePlanningDetail.planningClassModels[0].groupId,
                        });
                    }
                });
        }
    };
    componentDidMount() {
        this.props.dispatch({
            type: 'global/getNewCurrentUser',
            onSuccess: (res) => {
                console.log(res, 'ss');
            },
        });
        // let vConsole = new VConsole();
        if (window.location.search.indexOf('planMsgId=') !== -1) {
            this.setState({
                planMsgId: window.location.search.split('planMsgId=')[1].split('&')[0],
            });
        }
        if (window.location.search.indexOf('scrollTop=') !== -1) {
            this.setState({
                top: window.location.search.split('scrollTop=')[1].split('&')[0],
            });
        }
        const moveEle = document.getElementById('mobileDetail');

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
                        that.getDetail();
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

    openChange = () => {
        this.setState(
            {
                isopen: !this.state.isopen,
            },
            () => {
                if (!this.state.isopen) {
                    this.setState({
                        agreeRefund: false,
                    });
                }
            }
        );
    };
    checkLesson = (id, groupId) => {
        this.props.dispatch({
            type: 'studentDetail/optionalMarginNew',
            payload: {
                cancelAndSignUpModelList: [
                    {
                        planId: this.chooseCoursePlanId || null, // --选课计划 id
                        classIds: [groupId], // --班级 id
                        courseId: this.props.showCoursePlanningDetail.courseId || null, // --课程 id
                    },
                ],
            },
        }),
            this.setState({
                lessonId: groupId,
                groupId: groupId,
            });
    };
    checkStu = (id) => {
        // this.props.changeStu(id)
        this.setState({
            checkStuId: id,
        });
    };
    submit = () => {
        if (!this.state.isopen) {
            if (!this.state.checkStuId && childrenList && childrenList.length) {
                this.setState({
                    checkStuId: childrenList[0].childId,
                });
            }
            if (this.state.groupId) {
                this.props.dispatch({
                    type: 'studentDetail/optionalMarginNew',
                    payload: {
                        cancelAndSignUpModelList: [
                            {
                                planId: this.chooseCoursePlanId || null, // --选课计划 id
                                classIds: [this.state.groupId], // --班级 id
                                courseId: this.props.showCoursePlanningDetail.courseId || null, // --课程 id
                            },
                        ],
                    },
                });
            }
            this.openChange();
        } else {
            const { currentUser, showCoursePlanningDetail } = this.props;
            const { agreeRefund } = this.state;
            if (showCoursePlanningDetail?.externalSchool) {
                if (!agreeRefund) {
                    message.warn('请勾选退款协议！');
                    return;
                }
            }

            let chooseCourseRelationId = null;
            let arrLesson = [];

            this.props.showCoursePlanningDetail &&
                this.props.showCoursePlanningDetail.planningClassModels &&
                this.props.showCoursePlanningDetail.planningClassModels.length &&
                this.props.showCoursePlanningDetail.planningClassModels.map((item) => {
                    if (item.groupId === this.state.groupId) {
                        chooseCourseRelationId = item.id;
                    }
                });
            if (!this.state.groupId) {
                message.warn('请选择一个班级');
                return;
            }
            if (currentUser && currentUser.baseExternalSchool && !this.state.checkStuId) {
                message.warn(trans('global.pleaseChooseChild', '请选择一个孩子'));
                return;
            }

            let payload = {
                planId: this.chooseCoursePlanId, // --选课计划 id
                classIds: [this.state.groupId], // --班级 id
                courseId: this.props.showCoursePlanningDetail.courseId, // --课程 id
                chooseCourseRelationId: chooseCourseRelationId, // --选课班课关系id
                batchType: 0,
                chooseStudentUserId:
                    currentUser && currentUser.baseExternalSchool ? this.state.checkStuId : null,
                weekDayLessonModel: arrLesson,
                credit:
                    this.props.showCoursePlanningDetail.courseOutList &&
                    this.props.showCoursePlanningDetail.courseOutList.length
                        ? this.props.showCoursePlanningDetail.courseOutList[0].credits
                        : 0,
                payTuitionPlanId: this.props.showCoursePlanningDetail.payPlanId || null,
                // chooseCourseRuleOpen: chooseCourseRuleOpen,
                // courseClassRule: courseClassRule,
                coursePlanId: this.coursePlanningId,
                confirmAgreement: true,
            };

            if (!showCoursePlanningDetail?.externalSchool) {
                delete payload.confirmAgreement;
            }

            this.props.dispatch({
                type: 'course/grabSignUp',
                payload,

                onSuccess: (res) => {
                    if (res.content && res.content.tuitionOrderNo) {
                        let iframeUrlMan =
                            window.location.origin.indexOf('yungu.org') > -1
                                ? `https://smart-scheduling.yungu.org/?/mobilePay/index/#/payDetail/index?tuitionOrderNo=${res.content.tuitionOrderNo}&tuitionPlan=${res.content.tuitionPlan}&tuitionType=${res.content.tuitionType}`
                                : `https://smart-scheduling.daily.yungu-inc.org/?/mobilePay/index/#/payDetail/index?tuitionOrderNo=${res.content.tuitionOrderNo}&tuitionPlan=${res.content.tuitionPlan}&tuitionType=${res.content.tuitionType}`;

                        window.location.href = iframeUrlMan;
                    } else {
                        // this.props.changeType(2);
                        this.detailInstructionVisibleChange();
                        this.openChange();
                    }
                },
                onFail: () => {
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
            });
        }
    };
    checkToMessage = () => {
        console.log(this.state.planMsgId, 'pp');
        let hash =
            window.location.hash &&
            window.location.hash.split('#/') &&
            window.location.hash.split('#/')[1];
        let currentUrl = this.state.planMsgId
            ? `${window.location.origin}${window.location.pathname}?planMsgId=${this.state.planMsgId}&fromDetail=${hash}&scrollTop=${this.state.top}#/course/student/PersonalMessage`
            : `${window.location.origin}${window.location.pathname}?fromDetail=${hash}?scrollTop=${this.state.top}#/course/student/PersonalMessage`;
        window.location.href = currentUrl;
    };
    changeDetaiLesson = (item) => {
        this.setState({
            groupId: item.groupId,
            lessonId: item.groupId,
            isCheckId: item.groupId,
            checkedLesson: item,
        });
    };
    formatTxt = (txt) => {
        if (txt && txt != 'undefined') {
            return txt;
        } else {
            return '';
        }
    };

    detailInstructionVisibleChange = () => {
        if (this.state.needButton) {
            if (this.state.planMsgId) {
                window.location.href = `${window.location.origin}${window.location.pathname}?planMsgId=${this.state.planMsgId}&scrollTop=${this.state.top}#/course/student/detailMobile`;
            } else {
                window.location.href = `${window.location.origin}${window.location.pathname}?scrollTop=${this.state.top}#/course/student/detailMobile`;
            }
        } else {
            window.location.href = `${window.location.origin}${window.location.pathname}#/course/student/myLesson`;
        }
    };
    componentWillUnmount() {
        this.props.dispatch({
            type: 'course/clearCourse',
        });
    }

    changeChecked = (e) => {
        this.setState({
            agreeRefund: e.target.checked,
        });
    };

    checkDetail = () => {
        this.setState({
            detailVisible: true,
        });
    };

    closeModal = () => {
        this.setState({
            detailVisible: false,
        });
    };

    render() {
        const { showCoursePlanningDetail } = this.props;

        return (
            <Spin spinning={this.state.isspining}>
                <div className={styles.mobileDetail}>
                    <MobileDetail
                        showCoursePlanningDetail={showCoursePlanningDetail}
                        {...this.state}
                        openChange={this.openChange}
                        checkLesson={this.checkLesson}
                        changeDetaiLesson={this.changeDetaiLesson}
                        detailInstructionVisibleChange={this.detailInstructionVisibleChange}
                        submit={this.submit}
                        checkDetail={this.checkDetail}
                        checkToMessage={this.checkToMessage}
                        checkStu={this.checkStu}
                        closeModal={this.closeModal}
                        changeChecked={this.changeChecked}
                    />
                </div>
            </Spin>
        );
    }
}
