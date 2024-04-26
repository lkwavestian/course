import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Modal, Icon, Timeline, Button, Spin, message } from 'antd';
import styles from './addCourse.less';
import Step1 from './step/step1';
import Step2 from './step/step2';
import Step3 from './step/step3';
import { trans } from '../../../utils/i18n';
import { uniqBy } from 'lodash';

@connect((state) => ({
    addedOrEditChoosePlan: state.course.addedOrEditChoosePlan,
    chooseCourseDetails: state.choose.chooseCourseDetails,
    listChooseCourse: state.time.listChooseCourse,
    currentUser: state.global.currentUser,
    planningSemesterInfo: state.course.planningSemesterInfo,
    allchoosePlanLists: state.course.allchoosePlanLists,
    getPayChargeItemList: state.course.getPayChargeItemList,
}))
class AddCourse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            planId: '', // 提交后产生的ID
            isEdit: false, // 默认是新建
            createStep: false, // 创建时候的上一步
            tabIndex: 0,
            timeLine: [
                trans('course.addcourse.basic.information', '基础信息'),
                trans('course.addcourse.course.scope', '课程范围'),
                trans('course.addcourse.selection.rules', '选课规则'),
            ],
            chooseNumber: 0,
            loadingDetails: false,
            chooseCourseDetails: {}, // 详情
            start: '',
            end: '',
            isTimePicker: false,
            exportStartTime: '', // 导入课程开课周期开始日期
            exportEndTime: '', // 导入课程开课周期结束日期
            schoolId: '', // 从登陆信息带的学校id
            semesterValue: '', // 学期id
        };
        this.stepChild1 = null;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.visible != this.props.visible) {
            if (nextProps.visible) {
                this.setState({
                    planId: nextProps.planId,
                    isEdit: nextProps.isEdit, // true是编辑
                });
                if (nextProps.isEdit) {
                    this.initDetails(nextProps.planId);
                    this.initNumber(nextProps.planId);
                }
            }
        }
    }

    componentDidMount() {
        this.getCurrentUserInfo();
        // this.allchoosePlanList();
        this.initNumber(this.state.planId);
        setTimeout(() => {
            this.initDOM();
        }, 100);
    }

    allchoosePlanList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'course/allChoosePlanList',
            payload: { pageNum: 1, pageSize: 1000 },
        });
    };

    getCurrentUserInfo = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'global/getCurrentUser',
        }).then(() => {
            const { currentUser } = this.props;
            localStorage.setItem('userIdentity', currentUser && currentUser.currentIdentity);
            this.setState(
                {
                    schoolId: currentUser.schoolId,
                },
                () => {
                    this.getSemesterInfo();
                }
            );
        });
    };

    getSemesterInfo = () => {
        const { dispatch } = this.props;
        const { schoolId } = this.state;
        dispatch({
            type: 'course/selectBySchoolIdAllSemester',
            payload: {
                schoolId,
            },
        });
    };

    initDOM() {
        let dom = document.getElementsByClassName('ant-modal-body');
        if (dom && dom[0]) {
            dom[0].style.padding = 0;
        }
    }

    initNumber(planId) {
        const { dispatch } = this.props;
        if (!planId) {
            return;
        }
        dispatch({
            type: 'time/listChooseCourse',
            payload: {
                chooseCoursePlanId: planId,
            },
        }).then(() => {
            let num = 0;
            let { listChooseCourse } = this.props;
            if (listChooseCourse && listChooseCourse.length > 0) {
                listChooseCourse.forEach((el) => {
                    if (el.chooseStudents == 1) {
                        num++;
                    }
                });
                this.setState(
                    {
                        chooseNumber: num,
                    },
                    () => {
                        this.forceUpdate();
                    }
                );
            }
        });
    }

    initDetails(id) {
        const { dispatch } = this.props;
        this.setState({
            loadingDetails: false,
        });
        dispatch({
            type: 'choose/chooseCourseDetails',
            payload: {
                id,
            },
            onSuccess: () => {
                let { chooseCourseDetails } = this.props;
                this.setState({
                    loadingDetails: true,
                    chooseCourseDetails,
                    semesterValue: chooseCourseDetails.semesterModel.id,
                });
            },
        });
    }
    onRef = (self) => {
        this.stepChild1 = self;
    };
    titleHTML() {
        const { isEdit } = this.state;
        return (
            <div className={styles.courseNav}>
                <span onClick={this.handleCancel} className={styles.icon}>
                    <Icon type="close" />
                </span>
                <span>
                    {isEdit
                        ? trans('course.addcourse.update.course.selection.plan', '修改选课计划')
                        : trans('course.addcourse.create.course.selection.plan', '创建选课计划')}
                </span>
                <div></div>
            </div>
        );
    }

    // 提交按钮类型
    submitBtnHTML() {
        let { tabIndex, planId } = this.state;
        if (tabIndex === 0) {
            return (
                <Button
                    type="primary"
                    style={{ width: '100px' }}
                    onClick={this.saveInformation.bind(this, 1)}
                >
                    {/* {trans('course.addcourse.save.and.continue', '保存并继续')} */}
                    {trans('global.save', '保存')}
                </Button>
            );
        }
    }

    handleCancel = () => {
        const { hideModal } = this.props;
        typeof hideModal == 'function' && hideModal.call(this, 'visible');
        this.setState({
            tabIndex: 0,
            isEdit: false,
            createStep: false,
            planId: '',
        });
    };

    // 保存导入课程开课周期传入的时间
    exportTime = (exportStartTime, exportEndTime) => {
        this.setState({
            exportStartTime,
            exportEndTime,
        });
    };

    // 跳过进入下一步
    skipInformation = () => {
        this.setState({
            tabIndex: 2,
        });
    };

    getDetail = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'course/getCourseDetail',
            payload: {},
        });
    };

    // 提交数据
    saveInformation = (index) => {
        let { dispatch, getPayChargeItemList } = this.props;
        let {
            tabIndex,
            planId,
            isEdit,
            createStep,
            exportStartTime,
            exportEndTime,
            semesterValue,
        } = this.state;
        let params = {};
        let sc = {};
        if (tabIndex === 0 || tabIndex == 1 || tabIndex == 2) {
            sc = this.stepChild1 && this.stepChild1.state;
            if (!sc.name) {
                message.warn(trans('course.addcourse.chinese.is.required', '中文名称必填'));
                return;
            }
            if (!sc.ename) {
                message.warn(trans('course.addcourse.english.is.required', '英文名称必填'));
                return;
            }
            if (!semesterValue) {
                message.warn('请选择所属学期');
                return;
            }
            if (sc.schoolIdList.length === 0) {
                message.warn(
                    trans('course.addcourse.select.at.least.one.campus', '至少选一个所属校区')
                );
                return;
            }
            if (sc.schoolSectionIds.length === 0) {
                message.warn(
                    trans('course.addcourse.select.at.least.one.applicable', '至少选一个适用学段')
                );
                return;
            }

            if (sc.classTime == 1) {
                if (sc.weekDay.length === 0) {
                    message.warn('至少选择一个上课时间');
                    return;
                }
                if (sc.timeData.length == 0) {
                    message.warn('至少选择一个上课时段');
                    return;
                }
            }
            if (sc.administratorIds.length === 0) {
                message.warn(
                    trans('course.addcourse.select.at.least.one.administrator', '至少选一个管理员')
                );
                return;
            }
            if (sc.feeAdminIds.length === 0) {
                message.warn('至少选择一个费用管理员');
                return;
            }

            if (sc.choosePayType == undefined) {
                message.warn('请完善收费设置中的收费方式');
                return;
            }

            if (
                sc.choosePayType != 0 &&
                (sc.payloadClassObj == undefined || sc.payloadMaterialObj == undefined)
            ) {
                message.warn('请完善收费设置中的两个收费项目');
                return;
            }

            let classFeeShow = false;
            let materialFeeShow = false;

            sc.showFee &&
                sc.showFee.map((item, index) => {
                    if (item == 1) {
                        classFeeShow = true;
                    } else if (item == 2) {
                        materialFeeShow = true;
                    }
                });

            let newStintSubjectNumModelList = [];
            sc?.stintSubjectNumModelList &&
                sc.stintSubjectNumModelList.map((item, index) => {
                    newStintSubjectNumModelList.push({
                        number: item.number,
                        subjectIdList: item.subjectIdList ? item.subjectIdList.sort() : [],
                    });
                });

            if (sc.specialChecked) {
                let checkIsNull = true;
                sc.subjectList &&
                    sc.subjectList.length &&
                    sc.subjectList.forEach((item, index) => {
                        if (index % 2 == 0) {
                            if (item.subjectIdList.length == 0 || !item.chargeItemId) {
                                message.warn(`请完善例外规则中第${(index + 2) / 2}条规则后保存！`);
                                checkIsNull = false;
                            }
                        }
                    });
                if (!checkIsNull) {
                    return false;
                }
            }

            let tempList = sc.specialChecked
                ? [sc.payloadClassObj, sc.payloadMaterialObj, ...sc.subjectList]
                : [sc.payloadClassObj, sc.payloadMaterialObj];

            console.log('tempList: ', tempList);

            let chargeItemList = [];

            let newGetPayChargeItemList = uniqBy(getPayChargeItemList, 'chargeItemId');
            console.log('newGetPayChargeItemList: ', newGetPayChargeItemList);

            tempList &&
                tempList.map((item) => {
                    newGetPayChargeItemList.map((el) => {
                        if ((item && item.chargeItemId) == (el && el.chargeItemId)) {
                            chargeItemList.push({
                                ...item,
                                ...el,
                            });
                        }
                    });
                });

            console.log('chargeItemList: ', chargeItemList);

            // getPayChargeItemList

            params = {
                editFlag: 0,
                name: sc.name, //中文名
                ename: sc.ename, //英文名
                semesterId: semesterValue, //所属学期
                schoolYearId: sc.schoolYearId, //学年id
                schoolIdList: sc.schoolIdList, //所属校区
                schoolSectionIds: sc.schoolSectionIds, //适用学段
                startTime: sc.startTime, //开课周期开始
                endTime: sc.endTime, //开课周期结束
                declareStartTime: sc.declare == true ? sc.courseStartTime : undefined, //课程申报开始时间
                declareEndTime: sc.declare == true ? sc.courseEndTime : undefined, //课程申报结束时间
                prefaceChooseCoursePlanIds: sc.continuated == true ? sc.declareSemester : undefined, //续课学期
                repeatableCourseFirst: sc.continuated == true ? sc.firstReport : false, //是否允许优先进阶
                courseIntroductionType: sc.infoStyle, //课程版式介绍
                classFeeShow: classFeeShow, //课时费用展示
                materialFeeShow: materialFeeShow, //材料费用展示
                classDate: sc.classTime == 1 ? sc.weekDay : undefined, //上课时间
                classTime: sc.classTime == 1 ? sc.timeData : undefined, //上课时段
                deletedTimeIds: sc.deletedTimeIds,
                type: sc.seleceRule, //选课规则
                // periodMaxQuantity: sc.seleceRule == 1 ? sc.reportedMax : undefined, //最大可报志愿数量
                // availableCourseNum: sc.availableCourseNum,
                administratorIds: sc.administratorIds, //选课计划管理员
                feeAdminUserIds: sc.feeAdminIds, //费用管理员
                // announcement: sc.announcement, //选课公告
                announcement: sc.content ? sc.content : sc.announcement, //选课公告
                // stintSubjectNumModelList: sc.stintSubjectNumModelList,
                stintSubjectNumModelList: sc.setType == 2 ? newStintSubjectNumModelList : null,
                // choosePayProjectSettingModelList: [sc.payloadClassObj, sc.payloadMaterialObj],
                choosePayProjectSettingModelList: chargeItemList,
                defaultPaySetting: sc.specialChecked,
                choosePayType: sc.choosePayType,
                mergeOrder: sc.mergeOrder,
                // limitCon: sc.limitCon,
                cancelSignUpTime:
                    sc.limitCon == 2 && sc.timeValue ? sc.timeValue.valueOf() : undefined,
                checkTimeConflict: sc.checkTimeConflict,
                groupGroupingNumJsonDTOList: sc.groupDTOList,
                deleteGroupGroupingNumJsonDTOList: sc.deleteGroupGroupingNumJsonDTOList || [],
                freePlateContent: sc.freeContent || '',
            };
            if (isEdit || createStep) {
                params.id = planId;
            }
        }

        if (index === 2) {
            dispatch({
                type: 'choose/coursePlanning',
                payload: params,
                onSuccess: () => {
                    this.setState({
                        tabIndex: index,
                    });

                    let { callback } = this.props;
                    callback && typeof callback === 'function' && callback();
                },
            });
        } else if (index == 1) {
            dispatch({
                type: 'course/addedOrEditChoosePlan',
                payload: params,
                onSuccess: (id) => {
                    // 只有创建且非编辑且第一步
                    if (!createStep && index === 1 && !isEdit) {
                        this.setState({
                            planId: id,
                            createStep: true,
                        });
                    }

                    if (isEdit) {
                        this.initDetails(planId);
                    }

                    // 延迟一下切换下一步
                    setTimeout(() => {
                        this.setState({
                            tabIndex: index,
                        });
                    });

                    // this.getDetail();

                    if (index === 3) {
                        this.handleCancel();
                    }
                    let { choosePlan, callback } = this.props;
                    choosePlan && typeof choosePlan === 'function' && choosePlan.call(this);

                    callback && typeof callback === 'function' && callback();
                    const { hideModal } = this.props;
                    typeof hideModal == 'function' && hideModal.call(this, 'visible');
                },
            });
        }
    };

    changeNubmer = (num) => {
        this.setState({
            chooseNumber: num,
        });
    };

    handlePickerState = (start, end) => {
        const { chooseCourseDetails } = this.props;
        chooseCourseDetails.startTime = start;
        chooseCourseDetails.endTime = end;
        this.setState({
            start,
            end,
            isTimePicker: true,
        });
    };

    changeSemester = (value) => {
        this.setState({
            semesterValue: value,
        });
    };

    threeStepsHTML() {
        let {
            tabIndex,
            planId,
            isEdit,
            loadingDetails,
            createStep,
            chooseCourseDetails,
            isTimePicker,
        } = this.state;
        if ((!loadingDetails && isEdit) || (!loadingDetails && createStep && tabIndex === 0)) {
            return (
                <div className={styles.loadingDetails}>
                    <Spin size="large" tip="loading..." />
                </div>
            );
        }
        return (
            <Step1
                onNewRef={this.onRef}
                handlePickerState={this.handlePickerState}
                {...this.props}
                chooseCourseDetails={chooseCourseDetails}
                isEdit={isEdit}
                planId={this.state.planId}
                createStep={createStep}
                isTimePicker={isTimePicker}
                planningSemesterInfo={this.props.planningSemesterInfo}
                semesterValue={this.state.semesterValue}
                changeSemester={this.changeSemester}
            />
        );
    }

    render() {
        let { tabIndex, timeLine, isEdit, chooseNumber, planId } = this.state;
        return (
            <div>
                <Modal
                    title={
                        <div className={styles.courseNav}>
                            <span onClick={this.handleCancel} className={styles.icon}>
                                <Icon type="close" />
                            </span>
                            <span>
                                {isEdit
                                    ? trans(
                                          'course.addcourse.update.course.selection.plan',
                                          '修改选课计划'
                                      )
                                    : trans(
                                          'course.addcourse.create.course.selection.plan',
                                          '创建选课计划'
                                      )}
                            </span>
                            <Button
                                type="primary"
                                // style={{ width: '100px' }}
                                style={{
                                    background: '#3B6FF5',
                                    color: '#fff',
                                    height: '36px',
                                    lineHeight: '36px',
                                    borderRadius: '8px',
                                }}
                                onClick={this.saveInformation.bind(this, 1)}
                            >
                                {trans('global.save', '保存')}
                            </Button>
                        </div>
                    }
                    width="100%"
                    style={{ top: 0 }}
                    footer={null}
                    maskClosable={false}
                    closable={false}
                    visible={this.props.visible}
                    className={styles.addOrUpdate}
                >
                    <div className={styles.AddCourse}>
                        <div className={styles.right}>
                            <div className={styles.content}>{this.threeStepsHTML()}</div>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default AddCourse;
