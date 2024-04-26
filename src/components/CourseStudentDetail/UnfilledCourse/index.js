//续课
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon, Modal, Popconfirm, Popover, message, Checkbox } from 'antd';
import styles from './index.less';
import icon from '../../../icon.less';
import { color } from '../config.js';
import { intoChineseNumber, intoChinese } from '../../../utils/utils';
import { trans } from '../../../utils/i18n';
import moment from 'moment';
import BaseInfor from '../baseInfor';
const { confirm } = Modal;

@connect((state) => ({
    deleteItem: state.studentDetail.deleteItem.delete,
    checkedItem: state.studentDetail.checkedItem,
    cancelAndSignUpResult: state.studentDetail.cancelAndSignUpResult,
    courseIntroduction: state.studentDetail.courseIntroduction,
    optionalMargin: state.studentDetail.optionalMargin,
    grabMsg: state.studentDetail.grabMsg,
    showCoursePlanningDetail: state.course.showCoursePlanningDetail,
    chooseCourseDetails: state.choose.chooseCourseDetails,
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
            planMsg: JSON.parse(localStorage.getItem('planMsg')) || JSON.parse(window.planMsg), // 选课计划信息
            isLoading: false,
            creditAll: 0,
            courseId: '',
            groupId: '',
        };

        // 防止初始化时多次请求
        this.isLoad = false;
    }

    componentDidMount() {
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
            amount: optionalCourse.length,
        });
    };

    // 显示课程介绍
    showModal = (item) => {
        console.log('item', item);
        const { dispatch } = this.props;
        const { planMsg } = this.state;
        dispatch({
            type: 'course/showCoursePlanningDetail',
            payload: {
                coursePlanningId: item.coursePlanId,
                chooseCoursePlanId: planMsg.id,
            },
        });
        dispatch({
            type: 'choose/chooseCourseDetails',
            payload: {
                id: planMsg.id,
            },
        });
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
                console.log('hhhhh');
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
                    //我要续课
                    dispatch({
                        type: 'studentDetail/grabSignUp',
                        payload: {
                            planId: planMsg.id, // --选课计划 id
                            classIds: lesson.groupIds, // --班级 id
                            courseId: course.courseId, // --课程 id
                            chooseCourseRelationId: lesson.chooseCourseRelationId, // --选课班课关系id
                            weekDayLessonModel: arrLesson,
                            batchType: 1,
                            credit: course.credits,
                            chooseCourseRuleOpen: chooseCourseRuleOpen,
                            courseClassRule: courseClassRule,
                            coursePlanId: course.coursePlanId,
                            groupToGradeIdList: lesson.groupToGradeIdList,
                        },
                        onSuccess: () => {
                            const { grabMsg } = this.props;
                            console.log(grabMsg, '.....grabMsg');
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
                            console.log(optionalCourseList, 'hhbcc');
                            this.getOptionalMargin(optionalCourseList, index, i, lesson, course);
                        },
                    }).then(() => {
                        this.setState({
                            isLoading: false,
                        });
                    });
                } else {
                    //取消续课
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
                console.log('aaa');
                type = 1;
                selected = true;
            } else {
                type = null;
                selected = false;
            }
        } else {
            // 志愿填报。报名改为未提交状态
            if (isSign) {
                console.log('bbb');
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
        console.log('value :>> ', value);
        this.props.isUnfilledChange(value ? 1 : 0);
    };

    // 已选列表刷新
    updateCourseList = () => {
        this.props.courseListUpdate();
    };

    // 抢课状态进度条
    progressHtml = (el, selectedWidthBar) => {
        console.log('element :>> ', el);
        const { planStatus } = this.props;
        // 选课计划未开始只展示人数
        return (
            <span className={styles.progress}>
                <span className={styles.person}>
                    {Number(el.minLength) === Number(el.maxLength) ? (
                        <span>{Number(el.minLength)} 人 </span>
                    ) : (
                        <span>
                            {Number(el.minLength)} - {Number(el.maxLength)} 人
                        </span>
                    )}

                    {/*  <span>
                        {el.minLength || 0} - {el.maxLength || 0} 人
                    </span> */}
                    {planStatus !== 0 && <span> · </span>}
                    {planStatus !== 0 &&
                        (el.maxLength <= el.classNumber ? (
                            <span className={styles.full}>已满</span>
                        ) : (
                            planStatus !== 0 && <span>已报 {el.classNumber} </span>
                        ))}
                </span>
                {planStatus !== 0 && (
                    <span className={styles.progressBar}>
                        <span
                            className={styles.progressBarColor}
                            style={{ width: selectedWidthBar }}
                        ></span>
                    </span>
                )}
            </span>
        );
    };

    showConfirm = (course, lesson, isSign, index, i) => {
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
                {planStatus === 0 ? ( // 未开始
                    <span className={styles.disableAction}>
                        {trans('planDetail.optional.action.notStart', '未开始')}
                    </span>
                ) : planStatus === 1 ? ( // 进行中
                    planMsg.type === 2 && el.maxLength <= el.classNumber && !el.type ? (
                        <span className={styles.disableAction}>
                            {trans('planDetail.optional.action.disableSign', '不可报')}
                            <Popover content="该课程报名人数已满，请选择其他课程">
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
                                {trans('planDetail.optional.action.chosen', '已选择')}
                            </span>
                        ) : planMsg.type === 2 ? (
                            <span
                                className={styles.apply}
                                onClick={this.showConfirm.bind(this, item, el, false, index, i)}
                            >
                                {/* <i className={icon.iconfont}>&#xe6a8;</i> ·  */}
                                取消续课
                            </span>
                        ) : (
                            <span
                                className={styles.apply}
                                onClick={this.signUpRequest.bind(this, item, el, false, index, i)}
                            >
                                {/* <i className={icon.iconfont}>&#xe6a8;</i> ·  */}
                                取消续课
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
                            我要续课
                        </span>
                        // 当前课程状态为已提交 || 筛选状态操作 选中 ‘查看已选中课程’ || 'effectiveType': 选课计划状态 1是已生效 2是已关闭 0是未生效
                    )
                ) : el.selected ? ( // 非进行中状态下选中课程回显
                    <span className={styles.selectedAction}>
                        <i className={icon.iconfont}>&#xe6a8;</i> ·
                        {trans('planDetail.optional.action.chosen', '已选择')}
                    </span>
                ) : null}
            </span>
        );
    };

    // 详细课时费
    costDetailHtml = (materialCost, classFee) => {
        return (
            <span>
                {trans(
                    'planDetail.optional.cost',
                    '课时费 {$classFee} 元 / 期，材料费 {$materialCost} 元 / 期',
                    { classFee: classFee || '0', materialCost: materialCost || '0' }
                )}
            </span>
        );
    };

    hexToRgba = (bgColor, alpha) => {
        let color = bgColor.slice(1);
        let rgba = [
            parseInt('0x' + color.slice(0, 2)),
            parseInt('0x' + color.slice(2, 4)),
            parseInt('0x' + color.slice(4, 6)),
            alpha,
        ];
        return 'rgba(' + rgba.toString() + ')';
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

    splitClassName = (groupName, clasName) => {
        let resultStr = '';
        if (groupName == clasName) {
            return '';
        }
        let [a, b] = (clasName + groupName).replace(/(.+)(.+)\1/, '$2\n').split('\n');
        resultStr = a.trim();
        return resultStr;
    };

    getCourseFeeHtml = (courseItem) => {
        const {
            courseDetail: { classFeeShow, materialFeeShow },
            currentUser,
        } = this.props;

        let { planMsg } = this.state;

        let {
            materialFeeType,
            newMaterialCost,
            oldMaterialCost,
            materialCost,
            classFee,
            classFeeType,
            groupClassFeeList,
            groupMaterialFeeList,
        } = courseItem;
        let classFeeShowHtml,
            materialFeeHtml = '';
        let minClassFee = undefined;
        let maxClassFee = undefined;
        let minMetarialFee = undefined;
        let maxMetarialFee = undefined;

        let tempClassFeeArr = [];
        let tempMetarialFeeArr = [];

        let newClassFeeList = [];
        courseItem &&
            courseItem.list &&
            courseItem.list.length &&
            courseItem.list.map((item, index) => {
                groupClassFeeList &&
                    groupClassFeeList.length &&
                    groupClassFeeList.map((el, ind) => {
                        if (item.groupIds == el.groupId) {
                            newClassFeeList.push(el);
                        }
                    });
            });

        groupClassFeeList = newClassFeeList;

        groupClassFeeList.map((item, index) => {
            tempClassFeeArr.push(item.fee);
        });

        let newMaterialFeeList = [];
        courseItem &&
            courseItem.list &&
            courseItem.list.length &&
            courseItem.list.map((item, index) => {
                groupMaterialFeeList &&
                    groupMaterialFeeList.length &&
                    groupMaterialFeeList.map((el, ind) => {
                        if (item.groupIds == el.groupId) {
                            newMaterialFeeList.push(el);
                        }
                    });
            });

        groupMaterialFeeList = newMaterialFeeList;

        groupMaterialFeeList.map((item, index) => {
            tempMetarialFeeArr.push(item.fee);
        });

        minClassFee = Math.min(...tempClassFeeArr);
        maxClassFee = Math.max(...tempClassFeeArr);
        minMetarialFee = Math.min(...tempMetarialFeeArr);
        maxMetarialFee = Math.max(...tempMetarialFeeArr);

        let isSuitNum = 0;
        if (
            currentUser &&
            currentUser?.currentChildClassInfo &&
            currentUser?.currentChildClassInfo?.gradeNum
        ) {
            let tempNum = currentUser?.currentChildClassInfo?.gradeNum;
            if (tempNum == 1 || tempNum == 2 || tempNum == 3) {
                isSuitNum = 1;
            } else if (tempNum == 4 || tempNum == 5 || tempNum == 6) {
                isSuitNum = 2;
            }
        }

        console.log('isSuitNum', isSuitNum);

        if (planMsg.id == 125) {
            if (classFeeType != 0 && classFeeShow) {
                if (classFeeType == 1) {
                    classFeeShowHtml = (
                        <span>
                            <span className={styles.labelStyle}>基础费 </span>¥
                            {(isSuitNum == 1 && '1980') || (isSuitNum == 2 && '2480')}
                            &nbsp;<span className={styles.labelStyle}>加课包 </span>¥{`${classFee}`}
                        </span>
                    );
                } else if (classFeeType == 2) {
                    if (minClassFee == maxClassFee) {
                        classFeeShowHtml = (
                            <span>
                                <span className={styles.labelStyle}>基础费 </span>¥
                                {isSuitNum == 1 ? '1980' : isSuitNum == 2 ? '2480' : null}&nbsp;
                                <span className={styles.labelStyle}>加课包 </span>￥{minClassFee}
                            </span>
                        );
                    } else {
                        classFeeShowHtml = (
                            <span>
                                <span className={styles.labelStyle}>基础费 </span>¥
                                {isSuitNum == 1 ? '1980' : isSuitNum == 2 ? '2480' : null}
                                &nbsp;
                                <span className={styles.labelStyle}>加课包 </span>￥{minClassFee}起
                            </span>
                        );
                    }
                }
            } else {
                classFeeShowHtml = (
                    <span>
                        <span className={styles.labelStyle}>基础费 </span>¥
                        {isSuitNum == 1 ? '1980' : isSuitNum == 2 ? '2480' : null}
                    </span>
                );
            }
        } else {
            if (classFeeType != 0 && classFeeShow) {
                if (classFeeType == 1 && classFee) {
                    classFeeShowHtml = (
                        // <span>
                        //     {trans('planDetail.optional.classFee', ' ￥{$classFee}', {
                        //         classFee,
                        //     })}
                        // </span>
                        <span>
                            <span className={styles.labelStyle}>课时费 </span> ¥{classFee}
                            {/* {trans('planDetail.optional.classFee', ' ￥{$classFee}', {
                                classFee,
                            })} */}
                        </span>
                    );
                } else if (classFeeType == 2) {
                    if (minClassFee == maxClassFee) {
                        classFeeShowHtml = (
                            <span>
                                <span className={styles.labelStyle}>课时费 </span> ¥{minClassFee}
                            </span>
                        );

                        // <span>{`课时费 ￥${minClassFee}`}</span>
                    } else {
                        classFeeShowHtml = (
                            <span>
                                <span className={styles.labelStyle}>课时费 </span> ¥
                                {`${minClassFee} - ${maxClassFee}`}
                            </span>
                        );
                        // <span>{`课时费 ￥${minClassFee}-${maxClassFee}`}</span>
                    }
                }
            }
        }

        if (materialFeeType != 0 && materialFeeShow) {
            if (materialFeeType === 1) {
                materialFeeHtml = (
                    <span>
                        <span className={styles.labelStyle}>材料费 </span> ¥{materialCost}
                        {/* {trans('planDetail.optional.materialCost', '￥{$cost}', {
                            cost: String(materialCost),
                        })} */}
                    </span>
                );
            }
            if (materialFeeType === 2 && newMaterialCost && oldMaterialCost) {
                materialFeeHtml = (
                    <span className={styles.price}>
                        {/* {trans('planDetail.optional.materialCost', '￥{$cost} / 期', {
                            cost: newMaterialCost,
                        })} */}
                        <span className={styles.labelStyle}>材料费 </span>¥{newMaterialCost}
                        <span className={styles.labelStyle}> (老生</span>¥{oldMaterialCost}
                        <span className={styles.labelStyle}>)</span>
                        {/* {`材料费：¥ ${newMaterialCost}（老生 ¥ ${oldMaterialCost}）`} */}
                    </span>
                );
            }
            if (materialFeeType === 3) {
                if (minMetarialFee == maxMetarialFee) {
                    materialFeeHtml = (
                        <span className={styles.price}>
                            <span>
                                <span className={styles.labelStyle}>材料费 </span>¥{minMetarialFee}
                                {/* {`材料费￥${minMetarialFee}`} */}
                            </span>
                        </span>
                    );
                } else {
                    materialFeeHtml = (
                        <span className={styles.price}>
                            <span>
                                <span className={styles.labelStyle}>材料费 </span>¥{minMetarialFee}{' '}
                                - {maxMetarialFee}
                                {/* {`材料费￥${minMetarialFee}-${maxMetarialFee}`} */}
                            </span>
                        </span>
                    );
                }
            }
        }
        let isShowDetail = undefined;
        if (
            classFeeType == 2 ||
            (materialFeeType == 2 && newMaterialCost && oldMaterialCost) ||
            materialFeeType == 3
        ) {
            isShowDetail = (
                <Popover
                    content={
                        <span>
                            {classFeeType && classFeeType == 2 && classFeeShow ? (
                                <p>
                                    课时费：
                                    {groupClassFeeList &&
                                        groupClassFeeList.map((item, index) => {
                                            return (
                                                <span>
                                                    {item.groupName + item.fee}
                                                    {index == groupClassFeeList &&
                                                    groupClassFeeList.length - 1
                                                        ? ''
                                                        : ' '}
                                                </span>
                                            );
                                        })}
                                </p>
                            ) : null}

                            {materialFeeType == 2 &&
                                newMaterialCost &&
                                oldMaterialCost &&
                                materialFeeShow && (
                                    <p>
                                        材料费：新生{newMaterialCost} 老生{oldMaterialCost}
                                    </p>
                                )}

                            {materialFeeType == 3 && materialFeeShow && (
                                <p>
                                    材料费：
                                    {groupMaterialFeeList &&
                                        groupMaterialFeeList.map((item, index) => {
                                            return (
                                                <span>
                                                    {item.groupName + item.fee}
                                                    {index == groupMaterialFeeList &&
                                                    groupMaterialFeeList.length - 1
                                                        ? ''
                                                        : ' '}
                                                </span>
                                            );
                                        })}
                                </p>
                            )}
                        </span>
                    }
                >
                    {(classFeeShow && classFeeShowHtml != '') ||
                    (materialFeeShow && materialFeeHtml != '') ? (
                        <span className={styles.mention}>
                            <i className={icon.iconfont}> &#xe7e3;</i>
                        </span>
                    ) : null}
                </Popover>
            );
        }

        return (
            <span className={styles.price} style={{ position: 'absolute', right: 0 }}>
                {classFeeShowHtml} &nbsp;{materialFeeHtml} {/* &nbsp; {isShowDetail} */}
            </span>
        );
    };

    render() {
        const { detailInstructionVisible, optionalCourseList, amount, IconFont, planMsg } =
            this.state;
        const {
            courseIntroduction,
            courseDetail,
            isUpdate,
            planStatus,
            submitStatus,
            showCoursePlanningDetail,
            chooseCourseDetails,
        } = this.props;
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
                <div className={styles.head}>
                    <span className={styles.title}>
                        {/* {trans("planDetail.optional.title", "可选课程")} */}
                        续课报名
                    </span>
                    <span className={styles.amount}>
                        {trans('planDetail.optional.allNum', '共 {$num} 个课程', {
                            num: amount || '0',
                        })}
                    </span>
                    {/* <span className={styles.update} onClick={this.updateCourseList}>
            {isUpdate ? (
              <Icon type="loading" style={{ color: "#666" }} />
            ) : (
              <i className={icon.iconfont}>&#xe732;</i>
            )}
          </span> */}
                    {/* <span  className={styles.optional}>
                    <Checkbox onChange={this.onChangeViewChoose}>只看我可报的课程</Checkbox>
                    <Checkbox onChange={this.onChangeViewSelected}>只看我曾报过的课程</Checkbox>
                </span> */}
                    <div className={styles.timeMention} style={{ color: timeAndremain.color }}>
                        <span className={styles.icon} style={{ marginRight: 10 }}>
                            {' '}
                            <i className={icon.iconfont}>&#xe7d9;</i>{' '}
                        </span>
                        <span className={styles.selectTime}>
                            续课时间：{moment(planMsg.startTime).format('YYYY-MM-DD HH:mm')} ~{' '}
                            {moment(planMsg.endTime).format('YYYY-MM-DD HH:mm')}
                        </span>
                        <span className={styles.remain}>
                            {/* {
                planStatus === 0 ?`【${trans("planDetail.NotOpened",'{$time} 后开始' , {time:calculateDetailTime(planMsg.startTime)})}】`
                    : planStatus == 1 ? `【${trans("planDetail.being",'{$time} 后截止选课' , {time:calculateDetailTime(planMsg.endTime)})}】`
                        : planStatus == 3 ? `【${trans("planDetail.ended",'本次选课已结束')}】`
                            : null
            } */}
                        </span>
                    </div>
                </div>

                {/* 列表 */}
                <div className={styles.list}>
                    {optionalCourseList && optionalCourseList.length > 0 ? (
                        optionalCourseList.map((item, index) => {
                            return (
                                <div className={styles.listItem} key={index}>
                                    <span
                                        className={styles.header}
                                        style={{ position: 'relative' }}
                                    >
                                        {item.coursePlanType == 0 ||
                                        item.coursePlanType == 1 ||
                                        item.coursePlanType == 2 ? (
                                            <span className={styles.planTypeStyle}>
                                                {item.coursePlanType == 0
                                                    ? '新课'
                                                    : item.coursePlanType == 1
                                                    ? '进阶'
                                                    : item.coursePlanType == 2
                                                    ? '校队'
                                                    : null}
                                            </span>
                                        ) : null}
                                        <span className={styles.courseName}>
                                            {item && item.name}
                                        </span>
                                        {!item.list && (
                                            <span className={styles.noContinueClass}>暂无续课</span>
                                        )}
                                        {item.credits > 0 && courseDetail.isOpen === 0 && (
                                            <span className={styles.credits}>
                                                <i className={icon.iconfont + ' ' + styles.icon}>
                                                    &#xe768;
                                                </i>
                                                {trans('planDetail.selectedCourse.credit', '学分')}
                                                {item.credits}
                                            </span>
                                        )}
                                        {item.list && (
                                            <span
                                                className={styles.detail}
                                                onClick={this.showModal.bind(this, item)}
                                            >
                                                {trans(
                                                    'planDetail.optional.courseIntroduce',
                                                    '详细介绍'
                                                )}
                                            </span>
                                        )}

                                        {item.list && this.getCourseFeeHtml(item)}
                                    </span>
                                    {item.isBefore && (
                                        <span className={styles.mark}>我曾报过的课</span>
                                    )}
                                    {item.list &&
                                        item.list.map((el, i) => {
                                            // 不可报状态确定后三目中的item.isBefore改为不可报的状态
                                            // const disabled = {
                                            //     background:item.isBefore?'#fafafa':'#fff',
                                            //     color:item.isBefore?'#999':'#4d7fff',
                                            // }
                                            const checked = {
                                                background: el.selected
                                                    ? color.backgroundGreen
                                                    : '#fafafa',
                                                // borderColor: el.selected ? color.main : '#e6e6e6',
                                            };

                                            // let r1 = el.maxLength - el.classNumber,
                                            //     r2 = r1===0? 0 : r1 / el.maxLength;
                                            // let bar = r2 * 100 > 0 ? r2 * 100 : 0;
                                            let r1 = el.classNumber
                                                ? el.classNumber > el.maxLength
                                                    ? 1
                                                    : el.classNumber / el.maxLength
                                                : 0;
                                            let bar = r1 * 100;
                                            const selectedWidthBar = bar + 'px';
                                            return (
                                                <div key={i}>
                                                    {(el.type === 1 || el.type === 6) && (
                                                        <span className={styles.selectedMark}>
                                                            <Icon
                                                                type="check-circle"
                                                                theme="filled"
                                                            />
                                                            {trans(
                                                                'planDetail.optional.succeed.selected',
                                                                '选课成功'
                                                            )}
                                                        </span>
                                                    )}
                                                    <span
                                                        className={styles.lesson}
                                                        key={i}
                                                        style={checked}
                                                    >
                                                        <span className={styles.leftMsg}>
                                                            {el.planningClassTimeInputModelList &&
                                                                el.planningClassTimeInputModelList
                                                                    .length > 0 &&
                                                                el.planningClassTimeInputModelList.map(
                                                                    (lessonItem, lessonIndex) => {
                                                                        console.log(
                                                                            'lessonItem: ',
                                                                            lessonItem
                                                                        );
                                                                        return (
                                                                            <span
                                                                                className={
                                                                                    styles.title
                                                                                }
                                                                                key={lessonIndex}
                                                                            >
                                                                                {lessonIndex ==
                                                                                    0 && (
                                                                                    <span
                                                                                        style={{
                                                                                            marginRight:
                                                                                                '5px',
                                                                                        }}
                                                                                    >
                                                                                        {this.splitClassName(
                                                                                            item.name,
                                                                                            el.groupName
                                                                                        )}
                                                                                    </span>
                                                                                )}

                                                                                {this.props
                                                                                    .schoolList &&
                                                                                this.props
                                                                                    .schoolList
                                                                                    .length > 0
                                                                                    ? lessonIndex ===
                                                                                      el
                                                                                          .planningClassTimeInputModelList
                                                                                          .length -
                                                                                          1
                                                                                        ? trans(
                                                                                              'planDetail.optional.lessonTime',
                                                                                              '周{$day}{$lessonTime}节',
                                                                                              {
                                                                                                  day: intoChinese(
                                                                                                      lessonItem.weekday
                                                                                                  ),
                                                                                                  lessonTime: `${lessonItem.startTime} - ${lessonItem.endTime}`,
                                                                                              }
                                                                                          )
                                                                                        : trans(
                                                                                              'planDetail.optional.lessonTime',
                                                                                              '周{$day}{$lessonTime}节',
                                                                                              {
                                                                                                  day: intoChinese(
                                                                                                      lessonItem.weekday
                                                                                                  ),
                                                                                                  lessonTime: `${lessonItem.startTime} - ${lessonItem.endTime}`,
                                                                                              }
                                                                                          ) + `、`
                                                                                    : null}
                                                                                {el.groupGroupingNumJsonDTO &&
                                                                                el
                                                                                    .groupGroupingNumJsonDTO
                                                                                    .groupingName ? (
                                                                                    lessonIndex ===
                                                                                    el
                                                                                        .planningClassTimeInputModelList
                                                                                        .length -
                                                                                        1 ? (
                                                                                        <span
                                                                                            className={
                                                                                                styles.groupStyle
                                                                                            }
                                                                                            style={{
                                                                                                marginLeft:
                                                                                                    '5px',
                                                                                            }}
                                                                                        >
                                                                                            {
                                                                                                el
                                                                                                    .groupGroupingNumJsonDTO
                                                                                                    .groupingName
                                                                                            }
                                                                                        </span>
                                                                                    ) : null
                                                                                ) : null}
                                                                            </span>
                                                                        );
                                                                    }
                                                                )}

                                                            <span className={styles.time}>
                                                                {el.desc ? (
                                                                    el.desc
                                                                ) : (
                                                                    <span>
                                                                        {el.startTimeString}{' '}
                                                                        {trans('list.to', '至')}
                                                                        {el.endTimeString}
                                                                    </span>
                                                                )}
                                                            </span>
                                                        </span>
                                                        {
                                                            planMsg.type == 2 &&
                                                                this.progressHtml(
                                                                    el,
                                                                    selectedWidthBar
                                                                ) // 抢课状态进度条
                                                        }
                                                        {
                                                            this.actionHtml(
                                                                item,
                                                                index,
                                                                el,
                                                                i,
                                                                selectedWidthBar
                                                            ) // // 课节右侧操作
                                                        }
                                                    </span>
                                                </div>
                                            );
                                        })}
                                </div>
                            );
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
                                {trans('planDetail.optional.mention', '暂时没有符合条件的可选课程')}
                            </p>
                        </div>
                    )}
                </div>
                {/* 课程介绍弹窗 */}
                <Modal
                    visible={detailInstructionVisible}
                    footer={null}
                    destroyOnClose={true}
                    // width="56%"
                    width={1050}
                    className={styles.detailInstructionModal}
                    onCancel={() => {
                        this.setState({ detailInstructionVisible: false });
                    }}
                    style={{ top: '60px' }}
                >
                    <p className={styles.title}>{trans('planDetail.course.title', '课程介绍')}</p>
                    <div style={{ marginTop: '-30px' }}>
                        <BaseInfor
                            planMsg={planMsg}
                            {...showCoursePlanningDetail}
                            noToChinese={this.noToChinese}
                            hexToRgba={this.hexToRgba}
                            courseIntroductionType={chooseCourseDetails.courseIntroductionType}
                            classFeeShow={chooseCourseDetails.classFeeShow}
                            materialFeeShow={chooseCourseDetails.materialFeeShow}
                            classDate={chooseCourseDetails.classDate}
                        />
                    </div>

                    {/* {courseIntroduction && (
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
                            {!courseIntroduction.weekLesson &&
                            !courseIntroduction.totalLesson ? null : (
                                <span className={styles.item}>
                                    <span className={styles.label}>
                                        {trans('planDetail.course.class', '课时')}：
                                    </span>
                                    {courseIntroduction.weekLesson
                                        ? trans(
                                              'planDetail.course.classDetailWeek',
                                              '每周{$weekLesson}节',
                                              { weekLesson: courseIntroduction.weekLesson }
                                          )
                                        : null}
                                    {courseIntroduction.weekLesson && courseIntroduction.totalLesson
                                        ? '，'
                                        : ''}
                                    {courseIntroduction.totalLesson
                                        ? trans(
                                              'planDetail.course.classDetailTotal',
                                              '共{$totalLesson}节',
                                              { totalLesson: courseIntroduction.totalLesson }
                                          )
                                        : null}
                                </span>
                            )}
                            {!courseIntroduction.minStudent &&
                            !courseIntroduction.maxStudent ? null : (
                                <span className={styles.item}>
                                    <span className={styles.label}>
                                        {trans('planDetail.course.classrooms', '班级容量')}：
                                    </span>
                                    {trans(
                                        'planDetail.course.classroomsDetail',
                                        '每班 {$minStudent} - {$maxStudent} 人',
                                        {
                                            minStudent: courseIntroduction.minStudent || 0,
                                            maxStudent: courseIntroduction.maxStudent || 0,
                                        }
                                    )}
                                </span>
                            )}
                            <span className={styles.item}>
                                <span className={styles.label}>
                                    {trans('course.step2.applicable.grade', '适用年级')}：
                                </span>
                                {courseIntroduction.grades}
                            </span>
                            {this.judgeCredits() > 0 && (
                                <span className={styles.item}>
                                    <span className={styles.label}>
                                        {trans('planDetail.course.creditSet', '学分设置')}：
                                    </span>
                                    {courseIntroduction.subjects.map((item, index) => {
                                        return (
                                            <span key={index}>
                                                {courseIntroduction.subjects.length - 1 === index
                                                    ? `${item.name}${item.credits}学分`
                                                    : `${item.name}${item.credits}学分，`}
                                            </span>
                                        );
                                    })}
                                </span>
                            )}
                            
                            <span className={styles.itemTeacher}>
                                <span className={styles.label}>
                                    {trans('planDetail.course.teachers', '授课教师')}：
                                </span>
                                {courseIntroduction.teachers &&
                                    courseIntroduction.teachers.length > 0 &&
                                    courseIntroduction.teachers.map((item, index) => {
                                        return (
                                            <span key={index}>
                                                {courseIntroduction.teachers.length - 1 === index
                                                    ? `${item.name} ${item.ename}`
                                                    : `${item.name} ${item.ename}，`}
                                            </span>
                                        );
                                    })}
                            </span>
                            <span className={styles.itemBrief}>
                                <span className={styles.label}>
                                    {trans('planDetail.course.brief', '课程简介')}
                                </span>
                                {courseIntroduction.coursentroduce ? (
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: courseIntroduction.coursentroduce,
                                        }}
                                    />
                                ) : (
                                    <span>
                                        {trans('planDetail.course.noBrief', '暂无课程简介')}
                                    </span>
                                )}
                            </span>
                        </div>
                    )} */}
                </Modal>
            </div>
        );
    }
}
