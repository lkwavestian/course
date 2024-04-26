import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon, Modal, Checkbox, Popover, Button, message } from 'antd';
import styles from './index.less';
import icon from '../../../icon.less';
import { intoChineseNumber, intoChinese } from '../../../utils/utils';
import { trans } from '../../../utils/i18n';

const { confirm } = Modal;
@connect((state) => ({
    selectedContent: state.studentDetail.selectedList,
    deleteResult: state.studentDetail.deleteResult,
    submitResult: state.studentDetail.submitResult,
    courseIntroduction: state.studentDetail.courseIntroduction,
    cancelAndSignUpResult: state.studentDetail.cancelAndSignUpResult,
}))
export default class CourseSelected extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            IconFont: null, // 无选择课程下显示的icon
            selectedList: [], // 已选课程列表
            currencyUsedCoin: 0, // 投入选课币总数
            selected: false,
            planMsg: JSON.parse(localStorage.getItem('planMsg')) || JSON.parse(window.planMsg), // 选课计划信息
            isConfirm: false,
            allCredits: 0, // 已选课程总学分
            submitType: 1, // 1正常提交方式，2不满足学分下限允许提交
            submitStatus: 0, // 提交状态
            isHaveSubmit: false, // 已选列表是否存在未提交状态
            noSubmitStatus: 0,
        };
    }

    componentDidMount() {
        const IconFonts = Icon.createFromIconfontCN({
            scriptUrl: '//at.alicdn.com/t/font_789461_1fg3v64pt92i.js',
        });
        this.setState({
            IconFont: IconFonts,
        });
    }

    componentWillReceiveProps(nextProps) {
        this.dealSelectedList(
            (nextProps.submitedCourseList && nextProps.submitedCourseList.list) || []
        );

        // let coinAll = 0;
        //  // 我要报名后数据传入渲染
        //  const { selectedContent } = nextProps;
        //  this.setState({
        //     selectedList:selectedContent && selectedContent.selectedList
        //  },()=>{
        //     this.state.selectedList && this.state.selectedList.map((el)=>{
        //         if (el.numberValue) {
        //             coinAll += el.numberValue;
        //         }
        //     })
        //     this.setState({
        //         currencyUsedCoin:coinAll
        //     })
        //  })
    }

    // 处理已选课程列表数据结构
    dealSelectedList = (list) => {
        const { courseDetail } = this.props;
        const { planMsg } = this.state;
        let arr = [];
        let credits = 0;
        let allCoin = 0;
        let status = 0;
        let isHave = false;
        list &&
            list.length > 0 &&
            list.map((item, index) => {
                item.list &&
                    item.list.length > 0 &&
                    item.list.map((el, idx) => {
                        arr.push({
                            courseName: item.name,
                            courseId: item.courseId,
                            courseCredit: item.credits,
                            courseCost: item.courseCost,
                            groupId: el.groupIds,
                            courseLessons: el.courseLessons,
                            startTime: el.startTimeString,
                            endTime: el.endTimeString,
                            type: el.type,
                            studentChooseCourseId: el.studentChooseCourseId,
                            type: el.type,
                            inputCurrency: item.inputCurrency,
                            chooseCourseRelationId: el.chooseCourseRelationId,
                            desc: el.desc,
                        });
                        credits += item.credits;
                        allCoin += item.inputCurrency ? item.inputCurrency : 0;
                        if (el.type === 3) {
                            status = el.type;
                        } else if (el.type === 2) {
                            isHave = true;
                            status = el.type;
                        }
                    });
            });
        if (
            courseDetail &&
            !courseDetail.effectiveType &&
            planMsg.type === 1 &&
            planMsg.type === 1
        ) {
            // 判断选课计划是否生效，未生效不显示已选中状态
            arr = arr.map((item, index) => {
                if (item.type === 1) {
                    item.type = null;
                }
                return item;
            });
        }

        this.setState({
            selectedList: [...arr],
            allCredits: credits,
            currencyUsedCoin: allCoin,
            submitStatus: status,
            isHaveSubmit: isHave,
        });
    };

    // 投入选课币数量增减
    numberChange = (type, action) => {
        let coinAll = 0;
        const selectedList = this.state.selectedList.map((el) => {
            // 遍历已选课程列表，将当前操作项id与遍历项id相等，进行inputCurrency的赋值
            if (action.id == el.id && action.groupId == el.groupId) {
                // 增加个数
                if (type == 'add') {
                    el.inputCurrency = el.inputCurrency ? el.inputCurrency + 1 : 1;
                    // 减少个数
                } else if (type == 'subtract') {
                    el.inputCurrency = el.inputCurrency === 0 ? 0 : el.inputCurrency - 1;
                }
            }
            if (el.inputCurrency) {
                coinAll += el.inputCurrency;
            }
            return el;
        });

        this.setState({
            selectedList,
            currencyUsedCoin: coinAll,
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
            this.setState({
                detailInstructionVisible: true,
            });
        });
    };

    // 取消报名
    cancelSign = (type, action) => {
        if (type === 1) {
            this.deleteSelected(action);
        } else if (type === 2) {
            this.deleteTakeLesson(action);
        }
    };

    // 取消报名
    deleteTakeLesson = (action) => {
        const { dispatch, courseDetail } = this.props;
        const { planMsg } = this.state;
        let arrLesson = [];
        const courseLessons = action.courseLessons;
        for (let i = 0; i < courseLessons.length; i++) {
            arrLesson.push({
                baseScheduleId: courseLessons[i].baseScheduleId, // --作息 id
                versionId: courseLessons[i].versionId, // --版本 id
                weekDay: courseLessons[i].weekDay, // --周几编号
                lesson: courseLessons[i].lesson, // --课程编号
            });
        }
        dispatch({
            type: 'studentDetail/getCancelAndSignUp',
            payload: {
                type: 0, // --操作类型(0 取消报名; 1 报名 ; 2 已选列表处删除(状态为 2 时studentChooseCourseId字段值必填))
                studentChooseCourseId: action.studentChooseCourseId, // --学生选课表主键 id
                planId: planMsg.id, // --选课计划 id
                courseId: action.courseId, // --课程 id
                classIds: action.groupId, // --班级 id
                chooseCourseRelationId: action.chooseCourseRelationId, // --选课班课关系id
                periodMaxQuantity: courseDetail.periodMaxQuantity, // --时段最大志愿数量
                weekDayLessonModel: arrLesson,
            },
        }).then(() => {
            const { cancelAndSignUpResult } = this.props;
            if (cancelAndSignUpResult) {
                if (cancelAndSignUpResult.status) {
                    message.success(cancelAndSignUpResult.message);
                    this.props.requestResult(true, 'select', action.studentChooseCourseId);
                } else {
                    message.info(cancelAndSignUpResult.message);
                }
            }
        });
    };

    // 删除
    deleteSelected = (action, idList) => {
        const { planMsg } = this.state;
        let params = [];
        let studentChooseCourseId = ''; // 将当前操作项的studentChooseCourseId传入父组件
        if (action instanceof Array) {
            params = action;
            studentChooseCourseId = idList;
        } else {
            params.push({
                groupId: action.groupId, // --班级 id
                courseId: action.courseId, // --课程 id
            });
            studentChooseCourseId = action.studentChooseCourseId;
        }
        this.props
            .dispatch({
                type: 'studentDetail/deleteSelectedCourses',
                payload: {
                    planId: planMsg.id, // --选课计划 id
                    courseList: params,
                },
            })
            .then(() => {
                const { deleteResult } = this.props;
                if (deleteResult && deleteResult.status) {
                    this.props.deleteResultFun(deleteResult.status, studentChooseCourseId);
                }
            });
    };

    // 清空全部
    clearAll = () => {
        const { selectedList } = this.state;
        const arrList = [];
        const idList = [];
        selectedList.map((item, index) => {
            if (item.type === 2) {
                // 未提交状态可删除
                arrList.push({
                    groupId: item.groupId, // --班级 id
                    courseId: item.courseId, // --课程 id
                });
                idList.push(item.studentChooseCourseId);
            }
        });
        this.deleteSelected(arrList, idList);
    };

    checkSelected = (e) => {
        let _this = this;
        this.setState(
            {
                selected: e.target.checked,
            },
            () => {
                _this.props.viewSelected(this.state.selected);
            }
        );
    };

    submitCourse = () => {
        const { currencyUsedCoin, allCredits } = this.state;
        const { submitedCourseList, courseDetail } = this.props;
        let submitType = 1;
        // 超出当前拥有选课币不允许提交
        if (
            parseInt(currencyUsedCoin) >
            parseInt(submitedCourseList && submitedCourseList.courseCurrency)
        ) {
            message.info(trans('planDetail.selectedCourse.beyond', '投入选课币数量超出'));
            return;
        }
        // 学分下限开启，若学分低于学分下限并且不允许提交则不允许提交
        if (courseDetail && courseDetail.isOpen === 0) {
            if (
                parseInt(allCredits) < parseInt(submitedCourseList.minimumCredit) &&
                courseDetail.creditLowerLimitSubmit === 0
            ) {
                message.info(trans('planDetail.selectedCourse.below', '低于学分下限，不允许提交'));
                return;
            } else if (
                parseInt(allCredits) < parseInt(submitedCourseList.minimumCredit) &&
                courseDetail.creditLowerLimitSubmit === 1
            ) {
                submitType = 2;
            } else {
                submitType = 1;
            }
        }
        this.setState({
            isConfirm: true,
            submitType,
        });
    };

    handleCancel = () => {
        this.setState({
            isConfirm: false,
        });
    };

    submitConfirm = () => {
        const { dispatch } = this.props;
        const { planMsg, selectedList } = this.state;
        let params = [];
        let credits = null;
        let courseCurrency = null;
        for (let i = 0; i < selectedList.length; i++) {
            if (selectedList[i].type === 2) {
                params.push({
                    courseCourseCurrency: selectedList[i].inputCurrency || 0, // -- 课程下投入的选课币数量
                    studentChooseCourseId: selectedList[i].studentChooseCourseId,
                });
                credits += selectedList[i].courseCredit;
                courseCurrency += selectedList[i].inputCurrency ? selectedList[i].inputCurrency : 0;
            }
        }
        dispatch({
            type: 'studentDetail/submitSelectedCourse',
            payload: {
                planId: planMsg.id, // --选课计划 id
                credit: credits, // -- 学分
                courseCurrency: courseCurrency, // 选课币数量
                batchId: planMsg.batchId, // --批次 id
                studentSideCourseList: params,
            },
        }).then(() => {
            const { submitResult } = this.props;
            if (submitResult && submitResult.status) {
                // 提交成功刷新列表
                this.props.deleteResultFun(true);
                this.setState({
                    isConfirm: false,
                });
            }
        });
    };

    showConfirm = (type, action) => {
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
                _this.cancelSign(type, action);
            },
            onCancel() {},
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

    render() {
        const {
            allCredits,
            detailInstructionVisible,
            IconFont,
            selectedList,
            currencyUsedCoin,
            planMsg,
            isConfirm,
            submitType,
            submitStatus,
            isHaveSubmit,
            selected,
        } = this.state;
        const {
            submitedCourseList,
            planStatus, // 0 未开始;1 进行中;3 已结束;4未发布
            courseIntroduction,
            courseDetail,
        } = this.props;
        return (
            <div className={styles.courseSelected}>
                <div className={styles.head}>
                    <span className={styles.leftHead}>
                        <span className={styles.title}>
                            {' '}
                            {trans('planDetail.selectedCourse.title', '已选课程')}
                        </span>
                        <span className={styles.amount}>
                            {trans('planDetail.optional.allNum', '共 {$num} 个课程', {
                                num:
                                    (submitedCourseList &&
                                        submitedCourseList.list &&
                                        submitedCourseList.list.length) ||
                                    '0',
                            })}
                        </span>
                    </span>
                    {planMsg.type === 1 &&
                        (planStatus === 1 ? (
                            isHaveSubmit ? (
                                <span className={styles.clearAll} onClick={this.clearAll}>
                                    {' '}
                                    {trans('planDetail.selectedCourse.delete', '清空全部')}
                                </span>
                            ) : (
                                courseDetail &&
                                courseDetail.effectiveType && (
                                    <Checkbox
                                        className={styles.optional}
                                        onChange={this.checkSelected}
                                    >
                                        {trans(
                                            'planDetail.selectedCourse.viewSelected',
                                            '只看选中的课'
                                        )}
                                    </Checkbox>
                                )
                            )
                        ) : planStatus === 3 && courseDetail && courseDetail.effectiveType ? (
                            <Checkbox className={styles.optional} onChange={this.checkSelected}>
                                {trans('planDetail.selectedCourse.viewSelected', '只看选中的课')}
                            </Checkbox>
                        ) : null)}
                </div>

                <div className={styles.creditsMarks}>
                    {courseDetail.isOpen === 0 && (
                        <span className={styles.credits}>
                            <i className={icon.iconfont + ' ' + styles.icon}>&#xe768;</i>
                            {trans('planDetail.selectedCourse.credit', '学分')}
                            {allCredits} / {submitedCourseList && submitedCourseList.minimumCredit}
                            <Popover
                                content={trans(
                                    'planDetail.selectedCourse.creditsMention',
                                    '已选学分 / 本次选课最低学分要求'
                                )}
                            >
                                &nbsp; <i className={icon.iconfont}>&#xe7e3;</i>
                            </Popover>
                        </span>
                    )}
                    {courseDetail && courseDetail.influenceChoose === 1 && (
                        <span className={styles.price}>
                            <Icon type="hdd" className={styles.icon} />{' '}
                            {trans('planDetail.selectedCourse.coin', '选课币')}{' '}
                            {submitedCourseList && submitedCourseList.courseCurrency}
                            <span className={styles.number}>
                                {(submitedCourseList &&
                                    submitedCourseList.investCourseCurrency &&
                                    ` - ${submitedCourseList.investCourseCurrency}`) ||
                                    (currencyUsedCoin ? ` - ${currencyUsedCoin}` : '')}
                            </span>
                        </span>
                    )}
                </div>
                <div className={styles.selected}>
                    {selectedList && selectedList.length > 0 ? (
                        selectedList.map((item, index) => {
                            return (
                                <div
                                    className={styles.selectedList}
                                    key={item.courseId + item.groupId + ' ' + index}
                                >
                                    <div className={styles.listItem}>
                                        <span className={styles.header}>
                                            <span className={styles.courseName}>
                                                {' '}
                                                {item.courseName}{' '}
                                            </span>
                                            {item.courseCredit > 0 && (
                                                <span className={styles.credits}>
                                                    <i
                                                        className={
                                                            icon.iconfont + ' ' + styles.icon
                                                        }
                                                    >
                                                        &#xe768;
                                                    </i>{' '}
                                                    {trans(
                                                        'planDetail.selectedCourse.credit',
                                                        '学分'
                                                    )}{' '}
                                                    {item.courseCredit}
                                                </span>
                                            )}
                                            <span
                                                className={styles.detail}
                                                onClick={this.showModal.bind(this, item)}
                                            >
                                                {trans(
                                                    'planDetail.optional.courseIntroduce',
                                                    '详细介绍'
                                                )}
                                            </span>

                                            {item.type == 1 || item.type == 6 ? ( // 已选中
                                                <span className={styles.published}>
                                                    <Icon type="check-circle" theme="filled" />{' '}
                                                    {trans(
                                                        'planDetail.optional.succeed.selected',
                                                        '选课成功'
                                                    )}
                                                </span>
                                            ) : item.type == 3 ? ( // 已提交
                                                <span className={styles.submited}>
                                                    {' '}
                                                    {trans(
                                                        'coursePlan.status.submited',
                                                        '已提交'
                                                    )}{' '}
                                                </span>
                                            ) : item.type == 0 ? ( // 未选中
                                                <span className={styles.submited}>
                                                    {' '}
                                                    {trans(
                                                        'planDetail.selectedCourse.notSelected',
                                                        '未选中'
                                                    )}{' '}
                                                </span>
                                            ) : (
                                                <span className={styles.submited}></span>
                                            )}
                                        </span>
                                        <span className={styles.lessonMsg}>
                                            <span className={styles.titleAndTime}>
                                                <span className={styles.title}>
                                                    {item.courseLessons &&
                                                        item.courseLessons.map(
                                                            (lessonItem, lessonIndex) => {
                                                                return (
                                                                    <span
                                                                        className={styles.title}
                                                                        key={lessonIndex}
                                                                    >
                                                                        {lessonIndex ===
                                                                        item.courseLessons.length -
                                                                            1
                                                                            ? trans(
                                                                                  'planDetail.optional.lessonTime',
                                                                                  '周{$day}{$lessonTime}',
                                                                                  {
                                                                                      day: intoChinese(
                                                                                          lessonItem.weekDay
                                                                                      ),
                                                                                      lessonTime:
                                                                                          lessonItem.lessonTime,
                                                                                  }
                                                                              )
                                                                            : trans(
                                                                                  'planDetail.optional.lessonTime',
                                                                                  '周{$day}{$lessonTime}',
                                                                                  {
                                                                                      day: intoChinese(
                                                                                          lessonItem.weekDay
                                                                                      ),
                                                                                      lessonTime:
                                                                                          lessonItem.lessonTime,
                                                                                  }
                                                                              ) + '，'}
                                                                    </span>
                                                                );
                                                            }
                                                        )}
                                                </span>
                                                <span className={styles.time}>
                                                    {item.desc ? (
                                                        item.desc
                                                    ) : (
                                                        <span>
                                                            {item.startTime}{' '}
                                                            {trans('list.to', '至')} {item.endTime}
                                                        </span>
                                                    )}
                                                </span>
                                            </span>
                                            {planMsg.type === 1 &&
                                                item.type == 2 &&
                                                planStatus !== 3 && ( // 未提交
                                                    <span
                                                        className={styles.action}
                                                        onClick={this.cancelSign.bind(
                                                            this,
                                                            planMsg.type,
                                                            item
                                                        )}
                                                    >
                                                        {trans(
                                                            'planDetail.optional.action.cancel',
                                                            '取消报名'
                                                        )}
                                                    </span>
                                                )}
                                            {
                                                // 先到先得、非老师后台添加、选课状态进行中、选课结果未生效
                                                courseDetail.type === 2 &&
                                                    item.type !== 6 &&
                                                    courseDetail.planStatus === 1 &&
                                                    courseDetail.effectiveType === false && ( // 抢课取消报名二次确认
                                                        <span
                                                            className={styles.action}
                                                            onClick={this.showConfirm.bind(
                                                                this,
                                                                courseDetail.type,
                                                                item
                                                            )}
                                                        >
                                                            {trans(
                                                                'planDetail.optional.action.cancel',
                                                                '取消报名'
                                                            )}
                                                        </span>
                                                    )
                                            }
                                        </span>
                                        <span className={styles.addPrice}>
                                            {courseDetail && courseDetail.influenceChoose === 1 && (
                                                <span className={styles.coin}>
                                                    <Icon type="hdd" className={styles.icon} />
                                                    <span className={styles.label}>
                                                        {' '}
                                                        {trans(
                                                            'planDetail.selectedCourse.InCoin',
                                                            '投入选课币'
                                                        )}
                                                    </span>
                                                    {item.type == 2 ? (
                                                        <span className={styles.inputNumber}>
                                                            <span
                                                                className={styles.subtract}
                                                                onClick={this.numberChange.bind(
                                                                    this,
                                                                    'subtract',
                                                                    item
                                                                )}
                                                            >
                                                                -
                                                            </span>
                                                            <span className={styles.number}>
                                                                {item.inputCurrency || 0}
                                                            </span>
                                                            <span
                                                                className={styles.add}
                                                                onClick={this.numberChange.bind(
                                                                    this,
                                                                    'add',
                                                                    item
                                                                )}
                                                            >
                                                                +
                                                            </span>
                                                        </span>
                                                    ) : (
                                                        <span
                                                            className={styles.courseCurrencyAmount}
                                                        >
                                                            {' '}
                                                            {item.inputCurrency || 0}{' '}
                                                        </span>
                                                    )}
                                                </span>
                                            )}
                                            {item.courseFees && (
                                                <span className={styles.price}>
                                                    {trans(
                                                        'planDetail.optional.allCost',
                                                        '￥{$cost}/期',
                                                        { cost: item.courseCost }
                                                    )}
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className={styles.noData}>
                            {IconFont && (
                                <IconFont
                                    type="icon-chengguoweikong"
                                    style={{ fontSize: '80px' }}
                                />
                            )}
                            <p className={styles.text}>
                                {' '}
                                {trans(
                                    'planDetail.selectedCourse.mention',
                                    '暂时没有已经选择的课程'
                                )}
                            </p>
                        </div>
                    )}
                </div>
                {selectedList &&
                selectedList.length > 0 &&
                planMsg.type === 1 &&
                planStatus === 1 &&
                isHaveSubmit ? ( // 志愿填报选课方式 && 进行中选课状态
                    <div className={styles.submit}>
                        <Button
                            type="primary"
                            disabled={submitStatus == 3 ? true : false}
                            onClick={this.submitCourse}
                        >
                            {' '}
                            {trans('planDetail.selectedCourse.confirmSubmit', '选好了，确认提交')}
                        </Button>
                    </div>
                ) : (
                    <span></span>
                )}
                {courseIntroduction && (
                    <Modal
                        visible={detailInstructionVisible}
                        footer={null}
                        destroyOnClose={true}
                        width="56%"
                        className={styles.detailInstructionModal}
                        onCancel={() => {
                            this.setState({ detailInstructionVisible: false });
                        }}
                        style={{ top: '60px' }}
                    >
                        <p className={styles.title}>
                            {trans('planDetail.course.title', '课程介绍')}
                        </p>
                        <div className={styles.detailInstruction}>
                            <span className={styles.item}>
                                <span className={styles.label}>
                                    {trans('planDetail.course.name', '课程名称')}：
                                </span>
                                {courseIntroduction.name}
                            </span>
                            <span className={styles.item}>
                                <span className={styles.label}>
                                    {trans('planDetail.course.classification', '课程分类')}：
                                </span>
                                {courseIntroduction.subjects.map((item, index) => {
                                    return courseIntroduction.subjects.length - 1 === index
                                        ? `${item.name}`
                                        : `${item.name}，`;
                                })}
                            </span>

                            <span className={styles.item}>
                                <span className={styles.label}>
                                    {trans('planDetail.course.class', '课时')}：
                                </span>
                                {trans(
                                    'planDetail.course.classDetail',
                                    '每周{$weekLesson}节，共{$totalLesson}节',
                                    {
                                        weekLesson: courseIntroduction.weekLesson,
                                        totalLesson: courseIntroduction.totalLesson,
                                    }
                                )}
                            </span>
                            <span className={styles.item}>
                                <span className={styles.label}>
                                    {trans('planDetail.course.classrooms', '班级容量')}：
                                </span>
                                {trans(
                                    'planDetail.course.classroomsDetail',
                                    '每班 {$minStudent} - {$maxStudent} 人',
                                    {
                                        minStudent: courseIntroduction.minStudent,
                                        maxStudent: courseIntroduction.maxStudent,
                                    }
                                )}
                            </span>
                            {this.judgeCredits() > 0 && (
                                <span className={styles.item}>
                                    <span className={styles.label}>
                                        {trans('planDetail.course.creditSet', '学分设置')}：
                                    </span>
                                    {courseIntroduction.subjects.map((item, index) => {
                                        return courseIntroduction.subjects.length - 1 === index
                                            ? `${item.name}${item.credits}学分`
                                            : `${item.name}${item.credits}学分，`;
                                    })}
                                </span>
                            )}
                            <span className={styles.itemPrice}>
                                <span className={styles.label}>
                                    {trans('planDetail.course.fee', '课程费用')}：
                                </span>
                                {/* {trans("planDetail.optional.cost",'课时费 {$classFee} 元/期，材料费 {$materialCost} 元/期',{classFee:courseIntroduction.classFee,materialCost:courseIntroduction.materialCost})} */}
                                {trans(
                                    'planDetail.optional.materialCost',
                                    '材料费 ￥{$cost} / 期',
                                    { cost: courseIntroduction.materialCost.toString() }
                                )}
                            </span>
                            <span className={styles.itemTeacher}>
                                <span className={styles.label}>
                                    {trans('planDetail.course.teachers', '授课教师')}：
                                </span>
                                {courseIntroduction.teachers &&
                                    courseIntroduction.teachers.length > 0 &&
                                    courseIntroduction.teachers.map((item, index) => {
                                        return courseIntroduction.teachers.length - 1 === index
                                            ? `${item.name} ${item.ename}`
                                            : `${item.name} ${item.ename}，`;
                                    })}
                            </span>
                            <span className={styles.itemBrief}>
                                <span className={styles.label}>
                                    {trans('planDetail.course.brief', '课程简介')}
                                </span>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: courseIntroduction.coursentroduce,
                                    }}
                                />
                            </span>
                        </div>
                    </Modal>
                )}
                <Modal
                    visible={isConfirm}
                    footer={null}
                    destroyOnClose={true}
                    className={styles.confirm}
                    onCancel={() => {
                        this.setState({ isConfirm: false });
                    }}
                    width="30%"
                    closable={false}
                >
                    {submitType === 1 ? (
                        <div>
                            <p className={styles.title}>
                                {' '}
                                {trans(
                                    'planDetail.selectedCourse.textConfirm',
                                    '您确认要提交选课结果吗？'
                                )}{' '}
                            </p>
                            <p className={styles.title}>
                                {trans(
                                    'planDetail.selectedCourse.textMention',
                                    '确认提交后，所有结果将不可再修改。'
                                )}
                            </p>
                        </div>
                    ) : (
                        <p className={styles.title}>
                            {trans(
                                'planDetail.selectedCourse.textMentionBelow',
                                '您选的课程学分未达最低学分要求，是否确认提交？再次确认后可正常提交结果'
                            )}
                        </p>
                    )}
                    <div className={styles.btns}>
                        <Button
                            type="default"
                            className={styles.default}
                            onClick={this.handleCancel}
                        >
                            {' '}
                            {trans('global.cancel', '取消')}
                        </Button>
                        <Button
                            type="primary"
                            className={styles.primary}
                            onClick={this.submitConfirm}
                        >
                            {trans('global.submit', '确认提交')}
                        </Button>
                    </div>
                </Modal>
            </div>
        );
    }
}
