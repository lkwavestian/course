import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon, Modal, Popconfirm, Popover, message, Checkbox, Spin } from 'antd';
import styles from './index.less';
import { Drawer } from 'antd-mobile';
import { routerRedux } from 'dva/router';
import icon from '../../../icon.less';
import { color } from '../config.js';
import cardBg from '../../../assets/33.png';
import { intoChineseNumber, intoChinese } from '../../../utils/utils';
import { trans } from '../../../utils/i18n';
// import PersonalMessage from '../../../routes/PersonalMessage'
// import PersonalMobile from '../../../routes/PersonalMessage';
const { confirm } = Modal;
const week = {
    1: trans('mobile.Mon', '周一'),
    2: trans('mobile.Tue', '周二'),
    3: trans('mobile.Wed', '周三'),
    4: trans('mobile.Thu', '周四'),
    5: trans('mobile.Fri', '周五'),
    6: trans('mobile.Sat', '周六'),
    7: trans('mobile.Sun', '周日'),
};
@connect((state) => ({
    deleteItem: state.studentDetail.deleteItem.delete,
    checkedItem: state.studentDetail.checkedItem,
    cancelAndSignUpResult: state.studentDetail.cancelAndSignUpResult,
    courseIntroduction: state.studentDetail.courseIntroduction,
    optionalMargin: state.studentDetail.optionalMargin,
    grabMsg: state.studentDetail.grabMsg,
    showCoursePlanningDetail: state.course.showCoursePlanningDetail,
    currentUser: state.global.currentUser,
}))
export default class OptionalCourse extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            detailInstructionVisible: false, // 详细介绍状态
            optionalCourseList: [], // 课程列表list
            amount: '', // 课程数量
            selectedList: [], // 报名选中的课程
            IconFont: undefined, // 数据为空情况下显示
            planMsg: null, // 选课计划信息
            isLoading: false,
            creditAll: 0,
            courseId: '',
            groupId: '',
            isopen: false,
            type: 1,
            lessonId: null,
            checkStuId: null,
            item: null,
            coursePlanningId: null,
            chooseCoursePlanId: null,
            issping: false,
            myTuitionOrderNo: '',
            myTuitionPlan: '',
            isJump: false,
            orderStatus: '',
        };

        // 防止初始化时多次请求
        this.isLoad = false;
    }

    componentDidMount() {
        let planMsgId = null;
        let courseId = null;
        let groupId = null;
        const { dispatch } = this.props;
        // dispatch({
        //     type: 'global/getNewCurrentUser',
        //     onSuccess: (res) => {
        //         console.log(res, 'ss');
        //     },
        // }).then(() => {
        //     const { currentUser } = this.props;
        //     console.log(currentUser, 'cc');
        //     // if(currentUser && currentUser.currentIdentity && currentUser.currentIdentity == 'guest') {
        //     //         message.error('请先配置孩子信息');
        //     //         setTimeout(() => {
        //     //             window.location.href = `${window.location.origin}/myCourse#/course/student/PersonalMessage`
        //     //         })
        //     //     }
        // });
        if (window.location.search.indexOf('groupId=') !== -1) {
            groupId = window.location.search.split('groupId=')[1].split('&')[0];
        }
        if (window.location.search.indexOf('courseId=') !== -1) {
            courseId = window.location.search.split('courseId=')[1].split('&')[0];
            planMsgId = window.location.search.split('planMsgId=')[1].split('&')[0];
        }
        if (planMsgId && courseId) {
            this.props.dispatch({
                type: 'studentDetail/optionalMarginNew',
                payload: {
                    cancelAndSignUpModelList: [
                        {
                            planId: parseInt(planMsgId), // --选课计划 id
                            classIds: [parseInt(groupId)], // --班级 id
                            courseId: parseInt(courseId), // --课程 id
                        },
                    ],
                },
            });
            this.setState({
                coursePlanningId: parseInt(courseId),
                chooseCoursePlanId: parseInt(planMsgId),
                groupId: groupId ? parseInt(groupId) : '',
                lessonId: groupId ? parseInt(groupId) : '',
            });
        } else {
            this.setState({
                coursePlanningId: this.props.coursePlanningId,
                chooseCoursePlanId: this.props.coursePlanningId,
                groupId: this.props.groupId,
                lessonId: this.props.groupId,
            });
        }
        const IconFont = Icon.createFromIconfontCN({
            scriptUrl: '//at.alicdn.com/t/font_789461_1fg3v64pt92i.js',
        });
        this.setState({
            IconFont,
        });
    }

    componentWillReceiveProps(nextProps) {
        const { selectedList } = this.state;
        this.defaultChecked(nextProps, selectedList);
    }

    defaultChecked = (nextProps, selectedList) => {
        // console.log("nextProps :>> ", nextProps);
        const { planMsg } = this.state;
        let optionalCourse = nextProps.optionalCourse || [];
        let studentChooseCourseId = nextProps.studentChooseCourseId; // 父组件传入studentChooseCourseId
        optionalCourse.map((item, index) => {
            item &&
                item.list &&
                item.list.map((el, idx) => {
                    if (el.type === 2 || el.type === 5 || el.type === 1 || el.type === 6) {
                        // type=2未提交，但已报名

                        el.selected = true;
                    }

                    // 若studentChooseCourseId为数组，为清空全部，遍历相应更改状态
                    if (studentChooseCourseId instanceof Array) {
                        for (let i = 0; i < studentChooseCourseId.length; i++) {
                            if (studentChooseCourseId[i] == el.studentChooseCourseId) {
                                el.type = null;
                                el.selected = false;
                            }
                        }
                    } else {
                        // 单个删除更改报名状态
                        if (
                            studentChooseCourseId &&
                            el.studentChooseCourseId == studentChooseCourseId
                        ) {
                            el.type = null;
                            el.selected = false;
                        }
                    }

                    return el;
                });
            return item;
        });

        this.setState({
            optionalCourseList: optionalCourse,
            amount: nextProps.total,
        });
    };

    // 显示课程介绍
    showModal = (item) => {
        const { dispatch } = this.props;
        const { planMsg } = this.state;
        dispatch({
            type: 'studentDetail/getCourseMessage',
            payload: {
                chooseCoursePlanId: planMsg.id,
                courseId: item.courseId,
            },
        }).then(() => {
            const { courseIntroduction } = this.props;
            this.setState({
                detailInstructionVisible: true,
            });
        });
    };

    // 判断学分是否为0
    judgeCredits = () => {
        const { courseIntroduction } = this.props;
        let allCredits = 0;
        courseIntroduction &&
            courseIntroduction.subjects.map((item, index) => {
                allCredits += item.credits;
            });
        return allCredits;
    };

    // 我要报名
    signUp = (course, lesson, index, isChecked) => {
        const { dispatch } = this.props;
        const optionalCourseList = [...this.state.optionalCourseList];
        let selectedList = [...this.state.selectedList];

        // 根据索引找到当前操作的课程
        optionalCourseList[index].subList = optionalCourseList[index].subList.map((el, i) => {
            // 根据id找到当前操作的课节
            if (el.id == lesson.id && isChecked == true) {
                el.selected = true;
                selectedList.push({
                    courseName: course.name,
                    courseId: course.planId,
                    courseCredit: course.credit,
                    courseFees: course.class_fee,
                    groupId: lesson.id,
                    courseLesson: lesson.name,
                    createTime: lesson.startTime,
                    endTime: lesson.endTime,
                });
            } else if (el.id == lesson.id && isChecked == false) {
                el.selected = false;
                selectedList = selectedList.filter((selectItem) => {
                    return selectItem.id != lesson.id;
                });
            }
            return el;
        });

        this.exportList(optionalCourseList, selectedList);
    };

    // 报名/取消报名请求
    signUpRequest = (course, lesson, isSign, index, i) => {
        const { dispatch, periodMaxQuantity, chooseCourseRuleOpen, courseClassRule } = this.props;
        const { planMsg, optionalCourseList } = this.state;
        let arrLesson = [];
        const list = course.list || [];
        const courseLessons = lesson.courseLessons;
        // if (isSign) {
        //     for (let i = 0; i < list.length; i++) {
        //         // 当前课程中存在已报名状态并且当前操作班级与已报名班级id不等情况下，禁止再选择
        //         if ((list[i].type === 2 || list[i].type === 1) && list[i].groupIds !== lesson.groupIds) {
        //             message.info(trans("planDetail.optional.message",'已选择相同课程'))
        //             return
        //         }
        //     }
        // }

        for (let i = 0; i < courseLessons.length; i++) {
            arrLesson.push({
                baseScheduleId: courseLessons[i].baseScheduleId, // --作息 id
                versionId: courseLessons[i].versionId, // --版本 id
                weekDay: courseLessons[i].weekDay, // --周几编号
                lesson: courseLessons[i].lesson, // --课程编号
            });
        }
        this.setState(
            {
                isLoading: true,
                courseId: course.courseId,
                groupId: lesson.groupIds,
            },
            () => {
                // 先到先得
                if (planMsg.type === 2 && isSign) {
                    dispatch({
                        type: 'studentDetail/grabSignUp',
                        payload: {
                            planId: planMsg.id, // --选课计划 id
                            classIds: lesson.groupIds, // --班级 id
                            courseId: course.courseId, // --课程 id
                            chooseCourseRelationId: lesson.chooseCourseRelationId, // --选课班课关系id
                            batchType: 0,
                            weekDayLessonModel: arrLesson,
                            credit: course.credits,
                            chooseCourseRuleOpen: chooseCourseRuleOpen,
                            courseClassRule: courseClassRule,
                            coursePlanId: course.coursePlanId,
                        },
                        onSuccess: () => {
                            const { grabMsg } = this.props;
                            message.success(grabMsg.message);
                            // 父组件更新列表
                            this.props.requestResult(true, 'option');
                            // 组件内未刷新列表情况更改当前操作项报名状态
                            this.updateSignStatus(isSign, index, i, lesson, course, grabMsg);
                            this.setState({
                                isLoading: false,
                                courseId: '',
                                groupId: '',
                            });
                        },
                        onFail: () => {
                            this.getOptionalMargin(optionalCourseList, index, i, lesson, course);
                        },
                    }).then(() => {
                        this.setState({
                            isLoading: false,
                        });
                    });
                } else {
                    // 志愿填报
                    dispatch({
                        type: 'studentDetail/getCancelAndSignUp',
                        payload: {
                            type: isSign ? 1 : 0, // --操作类型(0 取消报名; 1 报名 ; 2 已选列表处删除(状态为 2 时studentChooseCourseId字段值必填))
                            studentChooseCourseId: lesson.studentChooseCourseId, // --学生选课表主键 id
                            planId: planMsg.id, // --选课计划 id
                            courseId: course.courseId, // --课程 id
                            classIds: lesson.groupIds, // --班级 id
                            chooseCourseRelationId: lesson.chooseCourseRelationId, // --选课班课关系id
                            periodMaxQuantity: periodMaxQuantity, // --时段最大志愿数量
                            weekDayLessonModel: arrLesson,
                        },
                        onSuccess: () => {
                            const { cancelAndSignUpResult } = this.props;
                            message.success(cancelAndSignUpResult.message);
                            this.props.requestResult(true, 'option');
                            this.updateSignStatus(
                                isSign,
                                index,
                                i,
                                lesson,
                                course,
                                cancelAndSignUpResult
                            );
                            this.setState({
                                isLoading: false,
                                courseId: '',
                                groupId: '',
                            });
                        },
                        onFail: () => {
                            this.getOptionalMargin(optionalCourseList, index, i, lesson, course);
                        },
                    }).then(() => {
                        this.setState({
                            isLoading: false,
                        });
                    });
                }
            }
        );
    };

    getOptionalMargin = (optionalCourseList, index, i, lesson, course) => {
        const { planMsg } = this.state;
        const { dispatch } = this.props;
        dispatch({
            type: 'studentDetail/optionalMargin',
            payload: {
                cancelAndSignUpModelList: [
                    {
                        planId: planMsg.id, // --选课计划 id
                        classIds: lesson.groupIds, // --班级 id
                        courseId: course.courseId, // --课程 id
                    },
                ],
            },
        }).then(() => {
            const { optionalMargin } = this.props;
            optionalCourseList[index].list[i].classNumber =
                (optionalMargin && optionalMargin.length && optionalMargin[0].classNumber) || 0;
            optionalCourseList[index].list[i].minLength =
                (optionalMargin && optionalMargin.length && optionalMargin[0].minStudent) || 0;
            optionalCourseList[index].list[i].maxLength =
                (optionalMargin && optionalMargin.length && optionalMargin[0].maxStudent) || 0;
            this.setState({
                optionalCourseList: [...optionalCourseList],
            });
        });
    };

    // 报名操作成功后更改报名状态
    updateSignStatus = (isSign, index, i, lesson, course, msg) => {
        const { optionalCourseList, planMsg } = this.state;
        let type = null;
        let selected = false;
        // 先到先得
        if (planMsg.type == 2) {
            // 报名改为已选中
            if (isSign) {
                type = 1;
                selected = true;
            } else {
                type = null;
                selected = false;
            }
        } else {
            // 志愿填报。报名改为未提交状态
            if (isSign) {
                type = 2;
                selected = true;
            } else {
                type = null;
                selected = false;
            }
        }
        optionalCourseList[index].list[i].type = type;
        optionalCourseList[index].list[i].selected = selected;
        optionalCourseList[index].list[i].studentChooseCourseId = msg && msg.content;
        if (planMsg.type == 2) {
            this.getOptionalMargin(optionalCourseList, index, i, lesson, course);
        } else {
            this.setState({
                optionalCourseList: [...optionalCourseList],
            });
        }
    };

    // 在可选课程中删除某一项
    cancelSignUp = (deleteItem) => {
        const optionalCourseList = [...this.state.optionalCourseList];
        let selectedList = [...this.state.selectedList];
        // 可选课程中清空全部操作，传入空数组，单个删除传入对象
        if (deleteItem instanceof Array) {
            optionalCourseList.map((item) => {
                item.subList.map((el) => {
                    el.selected = false;
                    return el;
                });
            });
            selectedList = [];
        } else {
            optionalCourseList.map((item) => {
                if (item.planId == deleteItem.courseId) {
                    // 根据课程Id找到课程
                    item.subList.map((el) => {
                        if (el.id == deleteItem.groupId) {
                            // 再根据课节Id找到相应课节
                            el.selected = false;
                            selectedList = selectedList.filter((selectItem) => {
                                return selectItem.id != deleteItem.id;
                            });
                        }
                        return el;
                    });
                }
            });
        }

        this.exportList(optionalCourseList, selectedList);
    };

    // 我要报名或取消报名操作后更新optionalCourseList，可选课程列表更新
    exportList = (optionalCourseList, selectedList) => {
        const { dispatch } = this.props;
        this.setState(
            {
                optionalCourseList: optionalCourseList,
                selectedList: selectedList,
            },
            () => {
                // 将selectedList更新后传入可选课程组件进行渲染
                dispatch({
                    type: 'studentDetail/getSelectedList',
                    payload: {
                        selectedList: this.state.selectedList,
                    },
                });
            }
        );
    };

    // 查看可报的课
    onChangeViewChoose = (e) => {
        let value = e.target.checked;
        this.props.isChooseChange(value ? 1 : 0);
    };

    // 查看曾报过的课
    onChangeViewSelected = (e) => {
        let value = e.target.checked;
        this.props.isBeforeChange(value ? 1 : 0);
    };

    // 看未报满的课
    onChangeUnfilled = (e) => {
        let value = e.target.checked;
        this.props.isUnfilledChange(value ? 1 : 0);
    };

    // 已选列表刷新
    updateCourseList = () => {
        this.props.courseListUpdate();
    };

    // 抢课状态进度条
    progressHtml = (el, selectedWidthBar) => {
        const { planStatus, courseDetail } = this.props;
        const { chooseContinuedBatch } = courseDetail;
        // 选课计划未开始只展示人数
        return (
            <span className={styles.progress}>
                <i className={icon.iconfont}>&#xe74e;</i>
                <span className={styles.person}>
                    <span>
                        {Number(el.minLength) === Number(el.maxLength) ? (
                            <span>
                                {Number(el.minLength)} {trans('mobile.person', '人')}{' '}
                            </span>
                        ) : (
                            <span>
                                {Number(el.minLength)} - {Number(el.maxLength)}{' '}
                                {trans('mobile.person', '人')}
                            </span>
                        )}

                        {/* {el.minLength || 0} - {el.maxLength || 0} 人 */}
                    </span>
                    {(planStatus !== 0 || chooseContinuedBatch) && <span> · </span>}
                    {(planStatus !== 0 || chooseContinuedBatch) &&
                        (el.maxLength <= el.classNumber ? (
                            <span className={styles.full}>
                                {trans('mobile.alreadyExpired', '已满')}
                            </span>
                        ) : (
                            (planStatus !== 0 || chooseContinuedBatch) && (
                                <span>
                                    {trans('mobile.reported', '已报')} {el.classNumber}{' '}
                                </span>
                            )
                        ))}
                </span>
                {/* {(planStatus !== 0 || chooseContinuedBatch) && (
                    <span className={styles.progressBar}>
                        <span
                            className={styles.progressBarColor}
                            style={{ width: selectedWidthBar }}
                        ></span>
                    </span>
                )} */}
            </span>
        );
    };

    showConfirm = (course, lesson, isSign, index, i) => {
        let _this = this;
        confirm({
            title: (
                <span className={styles.title}>{trans('mobile.tip1', '确定要取消报名吗?')}</span>
            ),
            content: (
                <span className={styles.text}>
                    {trans('mobile.tip2', '确认取消后，该报名可能会被其他同学抢报，请谨慎操作。')}
                </span>
            ),
            icon: '',
            okText: trans('mobile.tip3', '确认取消'),
            className: styles.confirmText,
            width: '340px',
            onOk() {
                _this.signUpRequest(course, lesson, isSign, index, i);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    // 课节右侧操作
    actionHtml = (item, index, el, i, selectedWidthBar) => {
        const {
            planStatus, // 0 未开始;1 进行中; 3 已结束;4未发布
            submitStatus, // 已选课程提交状态，3已提交
            isCheck,
            courseDetail,
        } = this.props;
        const { planMsg, isLoading, courseId, groupId } = this.state;
        let trigger = isLoading ? styles.trigger : '';
        if (isLoading && courseId == item.courseId && groupId == el.groupIds) {
            return (
                <span className={styles.rightAction}>
                    <Icon type="loading" />
                </span>
            );
        }
        return (
            <span className={styles.rightAction}>
                {planStatus === 0 || planMsg.batchType === 1 ? ( // 未开始
                    <span className={styles.disableAction}>
                        {trans('mobile.notStarted', '未开始')}
                    </span>
                ) : planStatus === 1 ? ( // 进行中
                    planMsg.type === 2 && el.maxLength <= el.classNumber && !el.type ? (
                        <span className={styles.disableAction}>
                            {trans('mobile.disableSign', '不可报')}
                            <Popover
                                content={trans('mobile.tip4', '该课程报名人数已满，请选择其他课程')}
                            >
                                &nbsp;
                                <i className={icon.iconfont + ' ' + styles.iconMark}>&#xe726;</i>
                            </Popover>
                        </span>
                    ) : el.selected ? ( // 进行中状态选中课程
                        (planMsg.type === 1 &&
                            (submitStatus === 3 || el.type === 1 || el.type === 5)) ||
                        el.type === 6 ? (
                            <span className={styles.selectedAction}>
                                <i className={icon.iconfont}>&#xe6a8;</i> ·
                                {trans('mobile.chosen', '已选择')}
                            </span>
                        ) : planMsg.type === 2 ? (
                            <span
                                className={styles.apply}
                                onClick={this.showConfirm.bind(this, item, el, false, index, i)}
                            >
                                {/* <i className={icon.iconfont}>&#xe6a8;</i> ·  */}
                                {trans('mobile.cancelRegistration', '取消报名')}
                            </span>
                        ) : (
                            <span
                                className={styles.apply}
                                onClick={this.signUpRequest.bind(this, item, el, false, index, i)}
                            >
                                {/* <i className={icon.iconfont}>&#xe6a8;</i> ·  */}
                                {trans('mobile.cancelRegistration', '取消报名')}
                            </span>
                        )
                    ) : // <span  className={styles.cancelApply} onClick={this.signUp.bind(this, item, el, index, true)}>我要报名</span>
                    submitStatus === 3 ||
                      isCheck ||
                      (courseDetail && courseDetail.effectiveType) ? null : (
                        <span
                            className={styles.cancelApply + ' ' + trigger}
                            onClick={this.signUpRequest.bind(this, item, el, true, index, i)}
                        >
                            {trans('mobile.sign', '我要报名')}
                        </span>
                    )
                ) : el.selected ? ( // 非进行中状态下选中课程回显
                    <span className={styles.selectedAction}>
                        <i className={icon.iconfont}>&#xe6a8;</i> ·
                        {trans('mobile.chosen', '已选择')}
                    </span>
                ) : null}
            </span>
        );
    };
    openChange = () => {
        this.props.isOpenChange();
    };
    // 详细课时费
    costDetailHtml = (materialCost, classFee) => {
        return (
            <span>
                {trans(
                    'mobile.cost',
                    '课时费 {$classFee} 元 / 期，材料费 {$materialCost} 元 / 期',
                    { classFee: classFee || '0', materialCost: materialCost || '0' }
                )}
            </span>
        );
    };
    submit = () => {
        if (!this.props.isopen) {
            if (!this.props.checkStuId && childrenList && childrenList.length) {
                this.props.changeStu(childrenList[0].childId);
            }
            this.openChange();
        } else {
            const { currentUser } = this.props;
            console.log(currentUser, 'aass');
            // debugger;
            // var ifChild = (childrenList && childrenList.length) ? true : false;
            // if(isParentVisitor || (!isParentVisitor && ifChild)) {
            //         window.location.href = `${window.location.origin}/myCourse#/course/student/PersonalMessage`
            // }
            let chooseCourseRelationId = null;
            let arrLesson = [];
            // this.props.showCoursePlanningDetail.courseOutList[0].list.map((item) => {
            //     if (this.state.groupId === item.groupIds[0]) {
            //         chooseCourseRelationId = item.chooseCourseRelationId;
            //         for (let i = 0; i < item.courseLessons.length; i++) {
            //             arrLesson.push({
            //                 baseScheduleId: item.courseLessons[i].baseScheduleId, // --作息 id
            //                 versionId: item.courseLessons[i].versionId, // --版本 id
            //                 weekDay: item.courseLessons[i].weekDay, // --周几编号
            //                 lesson: item.courseLessons[i].lesson, // --课程编号
            //             });
            //         }
            //     }
            // });
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
            if (currentUser && currentUser.baseExternalSchool && !this.props.checkStuId) {
                message.warn(trans('global.pleaseChooseChild', '请选择一个孩子'));
                return;
            }
            this.props.dispatch({
                type: 'course/grabSignUp',
                payload: {
                    planId: this.state.chooseCoursePlanId, // --选课计划 id
                    classIds: [this.state.groupId], // --班级 id
                    courseId: this.props.showCoursePlanningDetail.courseId, // --课程 id
                    chooseCourseRelationId: chooseCourseRelationId, // --选课班课关系id
                    batchType: 0,
                    chooseStudentUserId:
                        currentUser && currentUser.baseExternalSchool
                            ? this.props.checkStuId
                            : null,
                    weekDayLessonModel: arrLesson,
                    credit:
                        this.props.showCoursePlanningDetail.courseOutList &&
                        this.props.showCoursePlanningDetail.courseOutList.length
                            ? this.props.showCoursePlanningDetail.courseOutList[0].credits
                            : 0,
                    payTuitionPlanId: this.props.showCoursePlanningDetail.payPlanId || null,
                    // chooseCourseRuleOpen: chooseCourseRuleOpen,
                    // courseClassRule: courseClassRule,
                    coursePlanId: this.state.coursePlanningId,
                },
                onSuccess: (res) => {
                    console.log(res, 'res>>>>>>>');
                    if (res.content && res.content.tuitionOrderNo) {
                        let iframeUrlMan =
                            window.location.origin.indexOf('yungu.org') > -1
                                ? `https://smart-scheduling.yungu.org/?/mobilePay/index/#/payDetail/index?tuitionOrderNo=${res.content.tuitionOrderNo}&tuitionPlan=${res.content.tuitionPlan}&tuitionType=${res.content.tuitionType}`
                                : `https://smart-scheduling.daily.yungu-inc.org/?/mobilePay/index/#/payDetail/index?tuitionOrderNo=${res.content.tuitionOrderNo}&tuitionPlan=${res.content.tuitionPlan}&tuitionType=${res.content.tuitionType}`;
                        // console.log('跳转订单详情');
                        window.location.href = iframeUrlMan;
                        // this.props.dispatch(
                        //     routerRedux.push({
                        //         pathname: '/payDetail/index',
                        //         search: `tuitionPlan=${res.content.tuitionPlan}&tuitionOrderNo=${res.content.tuitionOrderNo}`,
                        //     })
                        // );
                    } else {
                        this.props.changeType(2);
                        this.props.detailInstructionVisibleChange();
                        this.openChange();
                    }
                },
                onFail: () => {
                    // let currentUrl = window.location.href;
                    // currentUrl = currentUrl.replace(/(\?|&)ticket\=([0-9A-z]+?&|[0-9A-z]+)/ig, '');
                    let hash =
                        window.location.hash &&
                        window.location.hash.split('#/') &&
                        window.location.hash.split('#/')[1];
                    let currentUrl = `${window.location.origin}/myCourse?path=${hash}&type=${this.props.type}&isOpen=true&planMsgId=${this.state.chooseCoursePlanId}&courseId=${this.state.coursePlanningId}&groupId=${this.state.lessonId}&checkStuId=${this.props.checkStuId}`;
                    let host =
                        currentUrl.indexOf('daily') > -1
                            ? 'https://login.daily.yungu-inc.org'
                            : 'https://login.yungu.org';
                    let userIdentity = localStorage.getItem('userIdentity');
                    // debugger;
                    window.location.href =
                        host + '/cas/login?service=' + encodeURIComponent(currentUrl);
                },
            });
        }
    };
    //我的课程跳转
    //废弃
    checkToMessage = () => {
        let currentUrl = `${window.location.origin}${window.location.pathname}?type=${this.props.type}&isOpen=true&planMsgId=${this.state.chooseCoursePlanId}&courseId=${this.state.coursePlanningId}&groupId=${this.state.lessonId}&checkStuId=${this.props.checkStuId}&fromDetail=true#/course/student/PersonalMessage`;
        window.location.href = currentUrl;
    };
    submitJump = () => {
        const { myTuitionOrderNo, myTuitionPlan } = this.state;
        let iframeUrlMan =
            window.location.origin.indexOf('yungu.org') > -1
                ? `https://smart-scheduling.yungu.org/?/mobilePay/index/#/payDetail/index?tuitionOrderNo=${myTuitionOrderNo}&tuitionPlan=${myTuitionPlan}`
                : `https://smart-scheduling.daily.yungu-inc.org/?/mobilePay/index/#/payDetail/index?tuitionOrderNo=${myTuitionOrderNo}&tuitionPlan=${myTuitionPlan}`;
        console.log('跳转订单详情');
        window.location.href = iframeUrlMan;
    };
    // 移动端查看详情
    checkDetai = (chooseCoursePlanId, coursePlanningId, item) => {
        // console.log(item, 'item<<<<>>>>');
        let dom = document.getElementById('courseSelectDetail');
        let height = 0;
        if (dom) {
            height = dom.scrollTop;
            localStorage.setItem('scrollTop', height);
        }
        if (this.props.planMsgId && !externalSchool) {
            window.location.href = `${window.location.origin}${window.location.pathname}?planMsgId=${this.props.planMsgId}&scrollTop=${height}#/courseDetail/${coursePlanningId}/${chooseCoursePlanId}/true`;
        } else {
            window.location.href = `${window.location.origin}${window.location.pathname}?scrollTop=${height}#/courseDetail/${coursePlanningId}/${chooseCoursePlanId}/true`;
        }
        // if (
        //     this.props.type == 2 &&
        //     item.orderStatus == 1 &&
        //     item.tuitionOrderNo &&
        //     item.tuitionPlan
        // ) {
        //     let iframeUrlMan =
        //         window.location.origin.indexOf('yungu.org') > -1
        //             ? `https://smart-scheduling.yungu.org/?/mobilePay/index/#/payDetail/index?tuitionOrderNo=${item.tuitionOrderNo}&tuitionPlan=${item.tuitionPlan}`
        //             : `https://smart-scheduling.daily.yungu-inc.org/?/mobilePay/index/#/payDetail/index?tuitionOrderNo=${item.tuitionOrderNo}&tuitionPlan=${item.tuitionPlan}`;
        //     window.location.href = iframeUrlMan;
        //     return;
        // }
        // if (item && item.tuitionOrderNo && item.tuitionPlan) {
        //     this.setState({
        //         myTuitionOrderNo: item.tuitionOrderNo,
        //         myTuitionPlan: item.tuitionPlan,
        //         orderStatus: item.orderStatus,
        //         isJump: true,
        //     });
        // } else {
        //     this.setState({
        //         isJump: false,
        //     });
        // }
        // if (this.props.isspining) {
        //     return;
        // }
        // this.props.setSpin(true);
        // // window.loca.href = `${window.location.pa}`
        // this.setState(
        //     {
        //         chooseCoursePlanId,
        //         coursePlanningId,
        //     },
        //     () => {
        //         this.props
        //             .dispatch({
        //                 type: 'course/showCoursePlanningDetailMobile',
        //                 payload: {
        //                     coursePlanningId: this.state.coursePlanningId,
        //                     chooseCoursePlanId: this.state.chooseCoursePlanId,
        //                     schoolId: schoolId || null,
        //                 },
        //             })
        //             .then(() => {
        //                 this.props.setSpin(false);
        //                 if (
        //                     this.props.showCoursePlanningDetail &&
        //                     this.props.showCoursePlanningDetail.courseName
        //                 ) {
        //                     this.props.detailInstructionVisibleChange();
        //                 }
        //             });
        //     }
        // );
    };
    checkLesson = (id, groupId) => {
        this.props.dispatch({
            type: 'studentDetail/optionalMarginNew',
            payload: {
                cancelAndSignUpModelList: [
                    {
                        planId: this.state.chooseCoursePlanId || null, // --选课计划 id
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
        this.props.changeStu(id);
        // this.setState({
        //     checkStuId: id,
        // });
    };

    formatTxt = (txt) => {
        if (txt && txt != 'undefined') {
            return txt;
        } else {
            return '';
        }
    };

    locale = () => {
        return (
            this.getCookieValue() ||
            this.normalizeLocale(window.globalLange) ||
            this.getBrowserLang() ||
            'en'
        );
        // return "en"
    };

    normalizeLocale = (locale) => {
        return locale && locale.replace(/_/g, '-');
    };

    getCookieValue = () => {
        var language;
        var cookieArr = document.cookie && document.cookie.split(';');
        for (let i = 0; i < cookieArr.length; i++) {
            if (cookieArr[i].indexOf('cookie-language') != -1) {
                language = cookieArr[i].split('=')[1];
                break;
            }
        }
        return language;
    };

    getBrowserLang = () => {
        return navigator && navigator.language;
    };

    render() {
        const { optionalCourseList, IconFont, lessonId } = this.state;
        const {
            courseIntroduction,
            courseDetail,
            isUpdate,
            planStatus,
            submitStatus,
            checkStuId,
            showCoursePlanningDetail,
        } = this.props;

        let lang = this.locale();

        const teacheringLanguage = [
            {
                id: 'CHINESE_LESSONS',
                name: '中文授课',
                eName: 'Chinese Lessons',
            },
            {
                id: 'FOREIGN_TEACHER_LESSONS',
                name: '外教授课',
                eName: 'Foreign Teacher Lessons',
            },
            {
                id: 'BILINGUAL_LESSONS',
                name: '双语授课',
                eName: 'Bilingual Lessons',
            },
        ];

        let requireToLang = '';
        teacheringLanguage.map((item, index) => {
            if (item.id == showCoursePlanningDetail?.teachingLanguage) {
                requireToLang = locale() == 'en' ? item.eName : item.name;
            }
        });

        const sidebar = (
            <div className={styles.submitBox}>
                <div className={styles.submitTop}>
                    <div className={styles.leftBox}>
                        <div
                            className={styles.submitbg}
                            style={{
                                backgroundImage: `url("${showCoursePlanningDetail.courseCover}")`,
                            }}
                        ></div>
                        <div className={styles.topMessage}>
                            <div className={styles.submitPrice}>
                                ￥{showCoursePlanningDetail.materialCost}
                            </div>
                            {this.props.optionalMargin &&
                            this.props.optionalMargin.length &&
                            showCoursePlanningDetail.chooseCoursePlanType === 2 ? (
                                <div className={styles.nowStu}>
                                    {trans('mobile.tip5', '剩余{$num}个名额', {
                                        num:
                                            this.props.optionalMargin[0].maxStudent -
                                            this.props.optionalMargin[0].classNumber,
                                    })}
                                </div>
                            ) : null}
                        </div>
                    </div>
                    <div>
                        <i className={icon.iconfont} onClick={this.openChange}>
                            &#xe6a9;
                        </i>
                    </div>
                </div>
                <div className={styles.sbumitItem}>
                    <div className={styles.itemTitle}>
                        {trans('mobile.classSelection', '班级选择')}
                    </div>
                    {showCoursePlanningDetail.planningClassModels &&
                    showCoursePlanningDetail.planningClassModels.length
                        ? showCoursePlanningDetail.planningClassModels.map((item) => (
                              <div
                                  className={[
                                      styles.sbumitLesson,
                                      lessonId && lessonId === item.groupId
                                          ? styles.checkedLesson
                                          : '',
                                  ].join(' ')}
                                  onClick={this.checkLesson.bind(this, item.id, item.groupId)}
                              >
                                  <span>{lang == 'en' ? item.enName : item.name}</span>
                                  {item.classTimeModels && item.classTimeModels.length
                                      ? item.classTimeModels.map((i) => (
                                            <span>
                                                ({week[i.weekday]} {i.startTime} {i.endTime})
                                            </span>
                                        ))
                                      : null}
                              </div>
                          ))
                        : null}
                </div>
                {this.props.currentUser && this.props.currentUser.baseExternalSchool ? (
                    <div className={styles.sbumitItem}>
                        <div className={styles.itemTitle}>
                            {trans('mobild.participants', '参与人')}
                        </div>
                        {childrenList && childrenList.length
                            ? childrenList.map((item) => (
                                  <span
                                      className={[
                                          styles.sbumitLesson,
                                          styles.submitStu,
                                          checkStuId && checkStuId === item.childId
                                              ? styles.checkedLesson
                                              : '',
                                      ].join(' ')}
                                      onClick={this.checkStu.bind(this, item.childId)}
                                  >
                                      {item.name}
                                  </span>
                              ))
                            : null}
                        <span
                            className={[styles.sbumitLesson, styles.submitStu].join(' ')}
                            onClick={this.checkToMessage}
                        >
                            <i className={icon.iconfont}>&#xe7d5;</i>
                        </span>
                    </div>
                ) : null}
                
            </div>
        );
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
            <div className={styles.optionalCourse}>
                {/* <div className={styles.head}>
          <span className={styles.title}>
            全部课程
          </span>
          <span className={styles.amount}>
            {trans("planDetail.optional.allNum", "共 {$num} 个课程", {
              num: amount || "0",
            })}
          </span>
          <span className={styles.update} onClick={this.updateCourseList}>
            {isUpdate ? (
              <Icon type="loading" style={{ color: "#666" }} />
            ) : (
              <i className={icon.iconfont}>&#xe732;</i>
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
                <span className={styles.icon} style={{ marginRight: 10 }}>
                  {" "}
                  <i className={icon.iconfont}>&#xe7d9;</i>{" "}
                </span>
                <span className={styles.selectTime}>
                  选课时间：{planMsg.startTime} ~ {planMsg.endTime}{" "}
                </span>
              </div>
            )}
          </div>
        </div> */}

                {/* 列表 */}
                {this.props.type === 3 ? (
                    <div className={styles.personalList}>
                        <div className={styles.personBox}>
                            <div>{trans('mobile.personalMessage', '个人信息')}</div>
                            <i className={icon.iconfont}>&#xe731;</i>
                        </div>
                    </div>
                ) : null}

                <div className={styles.list}>
                    {optionalCourseList && optionalCourseList.length > 0 ? (
                        optionalCourseList.map((item, index) => {
                            return this.props.type === 1 ? (
                                <div
                                    className={[
                                        styles.listItem,
                                        styles.noPadding,
                                        !this.props.hasMsg &&
                                        index + 1 === optionalCourseList.length
                                            ? styles.lastItem
                                            : '',
                                    ].join(' ')}
                                    key={index}
                                    onClick={this.checkDetai.bind(
                                        this,
                                        item.chooseCoursePlanId,
                                        item.coursePlanningId
                                    )}
                                >
                                    <div
                                        className={styles.bgBox}
                                        style={{ backgroundImage: `url("${item.courseCover}")` }}
                                    ></div>
                                    <div className={styles.typeBox}>
                                        <div className={styles.nopaddingName}>
                                            {lang == 'en' ? item.courseEName : item.courseName}
                                        </div>
                                        <div className={styles.nopaddingPrice}>
                                            ¥ {item.courseAmount}
                                        </div>
                                    </div>
                                    <div className={styles.lessonMessage}>
                                        {item.teachingLanguage ? (
                                            <div className={styles.lessonContent}>
                                                <i className={icon.iconfont}>&#xe86d;</i>
                                                <span>{item.teachingLanguage}</span>
                                            </div>
                                        ) : null}
                                        {/* <div className={styles.lessonContent}>
                                            <i className={icon.iconfont}>&#xe868;</i>
                                            <span>5天</span>
                                        </div> */}
                                        {item.age ? (
                                            <div className={styles.lessonContent}>
                                                <i className={icon.iconfont}>&#xe860;</i>
                                                <span>{item.age}</span>
                                            </div>
                                        ) : null}
                                        <div className={styles.lessonContent}>
                                            <i className={icon.iconfont}>&#xe866;</i>
                                            <span>{item.categoryName}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : this.props.type === 2 ? (
                                <div
                                    className={styles.listItem}
                                    key={index}
                                    onClick={this.checkDetai.bind(
                                        this,
                                        item.chooseCoursePlanId,
                                        item.coursePlanningId,
                                        item
                                    )}
                                >
                                    <span className={styles.header}>
                                        <div className={styles.myLessonTitle}>
                                            <span className={styles.courseName}>
                                                {lang == 'en'
                                                    ? item.enChooseCoursePlanName
                                                    : item.chooseCoursePlanName}
                                            </span>
                                            <span className={styles.lessonType}>
                                                {item.orderStatus == 1
                                                    ? trans('mobile.toBePaid', '待支付')
                                                    : item.orderStatus == 3
                                                    ? trans('mobile.paymentCompleted', '支付完成')
                                                    : item.orderStatus == 4
                                                    ? trans('mobile.close', '关闭')
                                                    : null}
                                            </span>
                                        </div>
                                        <div className={styles.myLessonContent}>
                                            <div
                                                style={{
                                                    backgroundImage: `url("${item.courseCover}")`,
                                                }}
                                                className={styles.imgBox}
                                            ></div>
                                            <div className={styles.rightBox}>
                                                <div className={styles.rightTitle}>
                                                    {lang == 'en'
                                                        ? item.courseEName
                                                        : item.courseName}
                                                </div>
                                                <div className={styles.rightMessage}>
                                                    {item.courseTime}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.stuNameBox}>
                                            <div className={styles.stuName}>
                                                <div>
                                                    <i className={icon.iconfont}>&#xe60f;</i>
                                                    {item.userName || ''}
                                                </div>
                                            </div>
                                            <div className={styles.realPay}>
                                                {trans('mobile.actualPayment', '实付款：')}￥
                                                {item.courseAmount}
                                            </div>
                                        </div>
                                        {/* {item.credits > 0 && courseDetail.isOpen === 0 && (
                                            <span className={styles.credits}>
                                                <i className={icon.iconfont + ' ' + styles.icon}>
                                                    &#xe768;
                                                </i>
                                                {trans('planDetail.selectedCourse.credit', '学分')}
                                                {item.credits}
                                            </span>
                                        )} */}
                                        {/* <span
                                            className={styles.detail}
                                            onClick={this.showModal.bind(this, item)}
                                        >
                                            {trans(
                                                'planDetail.optional.courseIntroduce',
                                                '详细介绍'
                                            )}
                                        </span> */}
                                    </span>
                                    {/* {item.isBefore && (
                                        <span className={styles.mark}>我曾报过的课</span>
                                    )} */}
                                    {/* <i className={icon.iconfont}>&#xe83f;</i> */}

                                    {/* <div className={styles.bottomButton}>{trans('global.baoming', '我要报名')}</div> */}
                                </div>
                            ) : null;
                        })
                    ) : (
                        //数据为空
                        <div className={styles.noData}>
                            {IconFont && (
                                <IconFont
                                    type="icon-chengguoweikong"
                                    style={{ fontSize: '80px' }}
                                />
                            )}
                            <p className={styles.text}>
                                {trans('mobile.mention', '暂时没有符合条件的可选课程')}
                            </p>
                        </div>
                    )}
                </div>
                {/* </Spin> */}
                {/* 课程介绍弹窗 */}
                <Modal
                    visible={this.props.detailInstructionVisible}
                    footer={null}
                    destroyOnClose={true}
                    width="100%"
                    getContainer={false}
                    closable={false}
                    className={styles.detailInstructionModal}
                    onCancel={() => {
                        this.props.detailInstructionVisibleChange();
                    }}
                    style={{ top: '60px' }}
                >
                    <div className={styles.detaiMobileContent}>
                        {showCoursePlanningDetail && showCoursePlanningDetail.courseName ? (
                            <div>
                                <div>
                                    <span
                                        className={[icon.iconfont, styles.closeModal].join(' ')}
                                        onClick={() => {
                                            this.props.detailInstructionVisibleChange();
                                        }}
                                    >
                                        {trans('mobile.return', '返回列表')}
                                    </span>
                                </div>
                                <div
                                    style={{
                                        backgroundImage: `url("${showCoursePlanningDetail.courseCover}")`,
                                    }}
                                    className={styles.detaiImg}
                                ></div>
                                {
                                    <div className={styles.detailList}>
                                        <div className={styles.detailBox}>
                                            <div className={styles.courseTitle}>
                                                {lang == 'en'
                                                    ? showCoursePlanningDetail.courseEnName
                                                    : showCoursePlanningDetail.courseName}
                                            </div>
                                            {/* <div className={styles.progress}>
                                        <div className={styles.step}>
                                            <div className={[styles.label].join(' ')}>L1</div>
                                            <div className={[styles.text].join(' ')}>萌芽</div>
                                        </div>
                                        <div className={styles.bar}></div>
                                        <div className={styles.step}>
                                            <div className={[styles.label, styles.checkLabel].join(' ')}>L2</div>
                                            <div className={[styles.text, styles.checkText].join(' ')}>生长</div>
                                        </div>
                                        <div className={styles.bar}></div>
                                        <div className={styles.step}>
                                            <div className={[styles.label].join(' ')}>L3</div>
                                            <div className={[styles.text].join(' ')}>精熟</div>
                                        </div>
                                        <div className={styles.bar}></div>
                                        <div className={styles.step}>
                                            <div className={[styles.label].join(' ')}>L4</div>
                                            <div className={[styles.text].join(' ')}>超越</div>
                                        </div>
                                    </div> */}
                                            <div className={styles.price}>
                                                ¥ {showCoursePlanningDetail.materialCost}
                                            </div>
                                        </div>
                                        {showCoursePlanningDetail.planningClassModels &&
                                        showCoursePlanningDetail.planningClassModels.length
                                            ? showCoursePlanningDetail.planningClassModels.map(
                                                  (item, index) => (
                                                      <div className={styles.detailBox}>
                                                          <div className={styles.classItem}>
                                                              <div className={styles.classLabel}>
                                                                  {trans(
                                                                      'mobile.faceAge',
                                                                      '面向年龄：'
                                                                  )}
                                                              </div>
                                                              <span>
                                                                  {showCoursePlanningDetail.age}
                                                              </span>
                                                          </div>
                                                          {showCoursePlanningDetail.teachingLanguage ? (
                                                              <div className={styles.classItem}>
                                                                  <div
                                                                      className={styles.classLabel}
                                                                  >
                                                                      {trans(
                                                                          'mobile.teachingLanguage',
                                                                          '授课语言'
                                                                      )}
                                                                      ：
                                                                  </div>
                                                                  <span>
                                                                      {
                                                                          showCoursePlanningDetail.teachingLanguage
                                                                      }
                                                                  </span>
                                                              </div>
                                                          ) : null}
                                                          <div className={styles.classItem}>
                                                              <div className={styles.classLabel}>
                                                                  {trans(
                                                                      'mobile.classtime',
                                                                      '上课时间：'
                                                                  )}
                                                              </div>
                                                              <div className={styles.classContent}>
                                                                  <div>
                                                                      <span>
                                                                          {lang == 'en'
                                                                              ? item.enName
                                                                              : item.name}
                                                                      </span>
                                                                      <span>
                                                                          (
                                                                          {item.classTimeModels &&
                                                                          item.classTimeModels
                                                                              .length
                                                                              ? item.classTimeModels.map(
                                                                                    (i) => (
                                                                                        <span>
                                                                                            {
                                                                                                week[
                                                                                                    i
                                                                                                        .weekday
                                                                                                ]
                                                                                            }{' '}
                                                                                            {
                                                                                                i.startTime
                                                                                            }{' '}
                                                                                            {
                                                                                                i.endTime
                                                                                            }
                                                                                            <span>
                                                                                                &nbsp;
                                                                                            </span>
                                                                                        </span>
                                                                                    )
                                                                                )
                                                                              : null}
                                                                          )
                                                                      </span>
                                                                  </div>
                                                              </div>
                                                          </div>
                                                          <div className={styles.classItem}>
                                                              <div className={styles.classLabel}>
                                                                  {trans(
                                                                      'mobile.teamNumber',
                                                                      '组班人数'
                                                                  )}
                                                              </div>

                                                              <div className={styles.classContent}>
                                                                  {item.minStudentNum}-
                                                                  {item.maxStudentNum}人
                                                              </div>
                                                          </div>
                                                          {showCoursePlanningDetail.languageRequirements ? (
                                                              <div className={styles.classItem}>
                                                                  <div
                                                                      className={styles.classLabel}
                                                                  >
                                                                      {trans(
                                                                          'mobile.languageRequirements',
                                                                          '英文要求'
                                                                      )}
                                                                      ：
                                                                  </div>

                                                                  <span>
                                                                      {/* {showCoursePlanningDetail.languageRequirements} */}
                                                                      {requireToLang}
                                                                  </span>
                                                              </div>
                                                          ) : null}
                                                          {/* <div className={styles.classItem}>
                                            <div className={styles.classLabel}>
                                                {trans('mobile.chargePrice', '收费价格：')}
                                            </div>
                                            {showCoursePlanningDetail.materialCost ? (
                                                <div className={styles.classContent}>
                                                    {showCoursePlanningDetail.materialCost}
                                                    {trans('mobile.yuan', '元/期')}
                                                </div>
                                            ) : (
                                                <div className={styles.classContent}>
                                                    {showCoursePlanningDetail.newMaterialCost}
                                                    {trans('mobile.yuan', '元/期')}
                                                    <span>
                                                        ({trans('mobile.oldStu', '老生')}
                                                        {showCoursePlanningDetail.oldMaterialCost}
                                                        {trans('mobile.yuan', '元/期')})
                                                    </span>
                                                </div>
                                            )}
                                        </div> */}
                                                      </div>
                                                  )
                                              )
                                            : null}
                                        {showCoursePlanningDetail &&
                                        (showCoursePlanningDetail.freePlateContent ||
                                            showCoursePlanningDetail.enFreePlateContent) ? (
                                            <div
                                                className={styles.detailBox}
                                                dangerouslySetInnerHTML={{
                                                    __html:
                                                        lang == 'en'
                                                            ? showCoursePlanningDetail.enFreePlateContent ||
                                                              ''
                                                            : showCoursePlanningDetail.freePlateContent ||
                                                              '',
                                                    // showCoursePlanningDetail.courseObjectives || ''
                                                }}
                                            ></div>
                                        ) : (
                                            <div className={styles.detailBox}>
                                                {showCoursePlanningDetail.pictureUrlModelList &&
                                                showCoursePlanningDetail.pictureUrlModelList
                                                    .length ? (
                                                    <img
                                                        src={
                                                            showCoursePlanningDetail
                                                                .pictureUrlModelList[0].url
                                                        }
                                                    />
                                                ) : null}
                                                <div className={styles.classTitle}>
                                                    {trans('mobile.courseObjectives', '课程目标')}
                                                </div>
                                                <div
                                                    className={styles.classDes}
                                                    dangerouslySetInnerHTML={{
                                                        __html:
                                                            lang == 'en'
                                                                ? showCoursePlanningDetail.enCourseObjectives ||
                                                                  ''
                                                                : showCoursePlanningDetail.courseObjectives ||
                                                                  '',
                                                        // showCoursePlanningDetail.courseObjectives || ''
                                                    }}
                                                ></div>
                                                {showCoursePlanningDetail.pictureUrlModelList &&
                                                showCoursePlanningDetail.pictureUrlModelList
                                                    .length > 1 ? (
                                                    <img
                                                        src={
                                                            showCoursePlanningDetail
                                                                .pictureUrlModelList[1].url
                                                        }
                                                    />
                                                ) : null}
                                                <div className={styles.classTitle}>
                                                    {trans('mobile.content', '课程内容')}
                                                </div>
                                                <div
                                                    className={styles.classDes}
                                                    dangerouslySetInnerHTML={{
                                                        __html:
                                                            lang == 'en'
                                                                ? showCoursePlanningDetail.enCourseContent ||
                                                                  ''
                                                                : showCoursePlanningDetail.courseContent ||
                                                                  '',
                                                    }}
                                                ></div>
                                                {showCoursePlanningDetail.pictureUrlModelList &&
                                                showCoursePlanningDetail.pictureUrlModelList
                                                    .length > 2
                                                    ? showCoursePlanningDetail.pictureUrlModelList.map(
                                                          (i, ind) =>
                                                              ind > 1 ? <img src={i.url} /> : null
                                                      )
                                                    : null}
                                                <div className={styles.classTitle}>
                                                    {trans('mobile.intro', '师资介绍')}
                                                </div>
                                                {lang == 'en' ? (
                                                    showCoursePlanningDetail.enTeacherIntroduction &&
                                                    showCoursePlanningDetail.enTeacherIntroduction !==
                                                        '' ? (
                                                        <div>
                                                            <div className={styles.classTeacher}>
                                                                <span
                                                                    className={
                                                                        styles.classTeacherLeft
                                                                    }
                                                                >
                                                                    {trans(
                                                                        'mobile.weideTeacher',
                                                                        '威德老师：'
                                                                    )}
                                                                </span>
                                                                <span
                                                                    className={
                                                                        styles.classTeacherRight
                                                                    }
                                                                >
                                                                    {this.formatTxt(
                                                                        showCoursePlanningDetail.enTeacherIntroduction.split(
                                                                            '$'
                                                                        )[0]
                                                                    )}
                                                                </span>
                                                            </div>
                                                            {showCoursePlanningDetail.enTeacherIntroduction.split(
                                                                '$'
                                                            ).length > 1 ? (
                                                                <div
                                                                    className={styles.classTeacher}
                                                                >
                                                                    <span
                                                                        className={
                                                                            styles.classTeacherLeft
                                                                        }
                                                                    >
                                                                        {trans(
                                                                            'mobile.externalTeacher',
                                                                            '外聘教师：'
                                                                        )}
                                                                    </span>
                                                                    <span
                                                                        className={
                                                                            styles.classTeacherRight
                                                                        }
                                                                    >
                                                                        {this.formatTxt(
                                                                            showCoursePlanningDetail.enTeacherIntroduction.split(
                                                                                '$'
                                                                            )[1]
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            ) : null}
                                                            {showCoursePlanningDetail.enTeacherIntroduction.split(
                                                                '$'
                                                            ).length > 2 &&
                                                            this.formatTxt(
                                                                showCoursePlanningDetail.enTeacherIntroduction.split(
                                                                    '$'
                                                                )[2]
                                                            ) ? (
                                                                <div
                                                                    className={styles.classDes}
                                                                    dangerouslySetInnerHTML={{
                                                                        __html:
                                                                            showCoursePlanningDetail.enTeacherIntroduction.split(
                                                                                '$'
                                                                            )[2] || '',
                                                                    }}
                                                                ></div>
                                                            ) : null}
                                                        </div>
                                                    ) : null
                                                ) : showCoursePlanningDetail.teacherIntroduction &&
                                                  showCoursePlanningDetail.teacherIntroduction !==
                                                      '' ? (
                                                    <div>
                                                        <div className={styles.classTeacher}>
                                                            <span
                                                                className={styles.classTeacherLeft}
                                                            >
                                                                {trans(
                                                                    'mobile.weideTeacher',
                                                                    '威德老师：'
                                                                )}
                                                            </span>
                                                            <span
                                                                className={styles.classTeacherRight}
                                                            >
                                                                {this.formatTxt(
                                                                    showCoursePlanningDetail.teacherIntroduction.split(
                                                                        '$'
                                                                    )[0]
                                                                )}
                                                            </span>
                                                        </div>
                                                        {showCoursePlanningDetail.teacherIntroduction.split(
                                                            '$'
                                                        ).length > 1 ? (
                                                            <div className={styles.classTeacher}>
                                                                <span
                                                                    className={
                                                                        styles.classTeacherLeft
                                                                    }
                                                                >
                                                                    {trans(
                                                                        'mobile.externalTeacher',
                                                                        '外聘教师：'
                                                                    )}
                                                                </span>
                                                                <span
                                                                    className={
                                                                        styles.classTeacherRight
                                                                    }
                                                                >
                                                                    {this.formatTxt(
                                                                        showCoursePlanningDetail.teacherIntroduction.split(
                                                                            '$'
                                                                        )[1]
                                                                    )}
                                                                </span>
                                                            </div>
                                                        ) : null}
                                                        {showCoursePlanningDetail.teacherIntroduction.split(
                                                            '$'
                                                        ).length > 2 &&
                                                        this.formatTxt(
                                                            showCoursePlanningDetail.teacherIntroduction.split(
                                                                '$'
                                                            )[2]
                                                        ) ? (
                                                            <div
                                                                className={styles.classDes}
                                                                dangerouslySetInnerHTML={{
                                                                    __html:
                                                                        showCoursePlanningDetail.teacherIntroduction.split(
                                                                            '$'
                                                                        )[2] || '',
                                                                }}
                                                            ></div>
                                                        ) : null}
                                                    </div>
                                                ) : null}
                                                <div className={styles.classTitle}>
                                                    {trans('mobile.preparation', '课前准备')}
                                                </div>
                                                <div
                                                    className={styles.classDes}
                                                    dangerouslySetInnerHTML={{
                                                        __html:
                                                            lang == 'en'
                                                                ? showCoursePlanningDetail.enCoursePreparation ||
                                                                  ''
                                                                : showCoursePlanningDetail.coursePreparation ||
                                                                  '',
                                                    }}
                                                ></div>
                                            </div>
                                        )}
                                    </div>
                                }
                            </div>
                        ) : null}
                        {this.props.type === 2 ? null : this.props.isopen ? (
                            <div className={styles.submitButton}>
                                <div onClick={this.submit} className={styles.submit}>
                                    {trans('mobile.sign', '我要报名')}
                                </div>
                            </div>
                        ) : (
                            <div className={styles.submitButton}>
                                <div onClick={this.submit} className={styles.submit}>
                                    {trans('mobile.sign', '我要报名')}
                                </div>
                            </div>
                        )}
                        {/* {this.props.type === 2 && this.state.orderStatus == 1 ? (
                            isJump ? (
                                <div className={styles.submitButton}>
                                    <div onClick={this.submitJump} className={styles.submit}>
                                        {trans('pay.title_detail', '缴费详情')}
                                    </div>
                                </div>
                            ) : null
                        ) : null}
                        {this.props.type === 2 && this.state.orderStatus == 1 ? (
                            !isJump ? (
                                <div className={styles.submitButton}>
                                    <div
                                        // onClick={this.submit}
                                        className={[styles.submit, styles.InvalidOrder].join(' ')}
                                    >
                                        {trans('mobile.InvalidOrder', '该订单无效')}
                                    </div>
                                </div>
                            ) : null
                        ) : null} */}
                        <Drawer
                            className="my-drawer"
                            style={this.props.isopen ? { display: 'block' } : { display: 'none' }}
                            enableDragHandle
                            overlayStyle={
                                this.props.isopen ? { display: 'block' } : { display: 'none' }
                            }
                            contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 60 }}
                            sidebar={sidebar}
                            open={this.props.isopen}
                            position={'bottom'}
                            onOpenChange={this.openChange}
                        ></Drawer>
                    </div>
                </Modal>
            </div>
        );
    }
}
