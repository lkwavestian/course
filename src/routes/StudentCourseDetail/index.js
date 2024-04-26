//学生管理
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { getUrlSearch } from '../../utils/utils';
import { trans, locale } from '../../utils/i18n';
import { Spin, message } from 'antd';
import MobileDetail from '../../components/MobileDetail';

@connect((state) => ({
    showCoursePlanningDetail: state.course.showCoursePlanningDetail,
    currentUser: state.global.currentUser,
    userSchoolId: state.global.userSchoolId,
    chooseCourseDetails: state.choose.chooseCourseDetails,
}))
export default class StudentCourseDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            checkedLesson: {},
            isCheckId: getUrlSearch('groupIds'),
            isspining: false,
            detailVisible: false,
            isWeide:false
        };
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'course/showCoursePlanningDetail',
            payload: {
                coursePlanningId: getUrlSearch('coursePlanningId'),
                chooseCoursePlanId: getUrlSearch('chooseCoursePlanId'),
            },
        }).then(() => {
            const { showCoursePlanningDetail } = this.props;
            document.getElementsByTagName('title')[0].innerText =
                showCoursePlanningDetail.courseName;
            
            let tempGroupId = getUrlSearch('groupIds');
            let tempCheckLesson = showCoursePlanningDetail &&
                    showCoursePlanningDetail.planningClassModels &&
                    showCoursePlanningDetail.planningClassModels.length > 0 &&
                    showCoursePlanningDetail.planningClassModels.find(item=>item.groupId == tempGroupId) || {};

            this.setState({
                checkedLesson: tempCheckLesson,
            });
        });
        dispatch({
            type: 'global/getCurrentUser',
            payload: {},
        });
        dispatch({
            type: 'choose/chooseCourseDetails',
            payload: {
                id: getUrlSearch('chooseCoursePlanId'),
            },
        });
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

    changeDetaiLesson = (item) => {
        this.setState({
            groupId: item.groupId,
            lessonId: item.groupId,
            isCheckId: item.groupId,
            checkedLesson: item,
        });
    };

    detailInstructionVisibleChange = () => {
        // window.location.href = `${window.location.origin}/#/course/student/MyDetailMobile/`;
        this.props.history.go(-1);
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

    checkStu = (id) => {
        this.setState({
            checkStuId: id,
        });
    };

    changeChecked = (e) => {
        this.setState({
            agreeRefund: e.target.checked,
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

            if (!agreeRefund) {
                message.warn('请勾选退款协议！');
                return;
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
                coursePlanId: this.coursePlanningId,
                confirmAgreement: true,
            };


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
                    window.location.href =
                        host + '/cas/login?service=' + encodeURIComponent(currentUrl);
                },
            });
        }
    };

    render() {
        const { showCoursePlanningDetail } = this.props;
        const { isspining } =
            this.state;

        return (
            <Spin spinning={isspining}>
                <div className={styles.mobileDetail} id="mobileDetail">
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
                        chooseCoursePlanId={getUrlSearch('chooseCoursePlanId')}
                    />
                </div>
            </Spin>
        );
    }
}
