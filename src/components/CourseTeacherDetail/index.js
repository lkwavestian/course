//选课管理-老师端
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Dropdown, Modal, Menu, Icon, Button, Table, Skeleton, Spin, message, Radio } from 'antd';
import styles from './index.less';
import { trans, locale } from '../../utils/i18n';
import Timeline from './component/timeline';
import NavMainDetail from './component/navMainDetail';
import AddChargeModal from './component/addChargeModal';
import Student from './student';
import Detail from './detail';
import FeeManage from './feeManage';
import Course from './course';
import PayNoticeDetail from '../PayNotice/detail';
import { Link, routerRedux } from 'dva/router';
import { getUrlSearch } from '../../utils/utils';
import AddCourse from '../Course/CourseSelect/addCourse';
import NavTitle from './component/navTitle';
import { toUpper } from 'lodash';
const { confirm } = Modal;
@connect((state) => ({
    semesterList: state.time.selectAllSchoolYear,
    subjectList: state.course.subjectList,
    gradeList: state.time.gradeList,
    allStage: state.time.allStage,
    classList: state.time.classList,
    chooseCourseDetails: state.choose.chooseCourseDetails,
    selectionMessage: state.courseBaseDetail.selectionMessage,
    allGradeOfAS: state.courseTeacherDetail.allGradeOfAS,
    allGradeAndGroup: state.courseTeacherDetail.allGradeAndGroup,
    choosePlanList: state.course.choosePlanList,
    schoolList: state.course.schoolList,
    currentUser: state.global.currentUser,
    effectiveMsg: state.courseTeacherDetail.effectiveMsg,
    planningSchoolListInfo: state.course.planningSchoolListInfo, // 机构下的学校
    userSchoolId: state.global.userSchoolId, // 机构下的学校
    createPayTuitionPlanResult: state.course.createPayTuitionPlanResult,
    getPayChargeItemList: state.course.getPayChargeItemList,
    PayTuitionPlan: state.course.PayTuitionPlan,
    chooseCoursePlanBatchList: state.choose.chooseCoursePlanBatchList,
}))
class CourseDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            host:
                location.origin.indexOf('daily') !== -1 ||
                location.origin.indexOf('localhost') !== -1
                    ? 'https://smart-scheduling.daily.yungu-inc.org'
                    : 'https://smart-scheduling.yungu-inc.org',
            loadInitData: false, // 初始化数据
            tabIndex: 0,
            tabTitleList: [
                trans('course.basedetail', '基础信息'),
                trans('course.basedetail.students', '学生列表'),
                trans('course.setup.index.course.list', '课程列表'),
                trans('course.setup.index.fee.manage', '费用管理'),
                trans('course.basedetail.payment.details', '收费单'),
            ],
            planId: getUrlSearch('planId'),
            planStatus: getUrlSearch('planStatus'),
            visible: false, // 默认是隐藏
            isAdmin: false, // 是否是管理员
            effecticveDisabled: false, // 选课结果生效后控制其他操作
            isDisplay: false, //生成收费单modal控制
            payPlanId: '',
            nonAdminType: 0, // 非管理员
            newOpenSelCourseVisible: false,
            closeSelCouVisible: false,
            uploading: false,
            isGenetare: false,
        };
    }

    componentDidMount() {
        const {
            match: { params },
        } = this.props;
        const tabValue = JSON.parse(localStorage.getItem('tab') || '0');
        this.initData();
        this.setState({
            // tabIndex: tabValue,
            tabIndex: params && params.currentIndex ? params && params.currentIndex : 2,
            // tabIndex: 2,
        });
        this.judgePayTuitionPlanResult();
    }

    // 取消公共函数
    onCancel = (type) => {
        this.setState({
            [type]: false,
            adjustTimeBatchId: undefined, // 选课时间ID
        });
    };

    initData() {
        const { dispatch } = this.props;
        let { planId } = this.state;
        let p1 = new Promise((resolve, reject) => {
            dispatch({
                type: 'time/getGradeList',
                payload: {},
                onSuccess: () => {
                    resolve(null);
                },
            });
        });

        let p2 = new Promise((resolve, reject) => {
            dispatch({
                type: 'choose/chooseCourseDetails',
                payload: {
                    id: this.state.planId,
                },
                onSuccess: () => {
                    resolve(null);
                },
            }).then(() => {
                const { chooseCourseDetails } = this.props;
                let newSchoolSection = [];
                chooseCourseDetails.schoolSectionList &&
                    chooseCourseDetails.schoolSectionList.length > 0 &&
                    chooseCourseDetails.schoolSectionList.map((item, index) => {
                        newSchoolSection.push(item.stage);
                    });

                let newSchoolList = [];
                chooseCourseDetails?.schoolList.map((item, index) => {
                    newSchoolList.push(item.id);
                });
                // let newSchoolSection = JSON.stringify(elt.schoolSectionList);
                this.props.dispatch({
                    type: 'course/getPayChargeItemList',
                    payload: {
                        stageIdList: newSchoolSection,
                        schoolId: newSchoolList,
                        /* stageIdList: JSON.stringify(newSchoolSection),
                        schoolId: JSON.stringify(newSchoolList), */
                    },
                });
                this.setState({
                    effecticveDisabled: chooseCourseDetails && chooseCourseDetails.effectiveType,
                });
            });
        });

        let p3 = new Promise((resolve, reject) => {
            dispatch({
                type: 'courseBaseDetail/getSelectionMessage',
                payload: {
                    chooseCoursePlanId: this.state.planId,
                },
                onSuccess: () => {
                    resolve(null);
                },
            });
        });

        let p4 = new Promise((resolve, reject) => {
            //获取校区
            dispatch({
                type: 'course/getCouserPlanningSchoolList',
                payload: {},
                onSuccess: () => {
                    resolve(null);
                },
            });
        });

        // 所有班级
        let p5 = new Promise((resolve, reject) => {
            // dispatch({
            //     type: 'time/getClassList',
            //     payload: {
            //         sectionIds: getUrlSearch("sectionIds") && getUrlSearch("sectionIds").split("_") || []
            //     },
            //     onSuccess: () => {
            //         resolve(null);
            //     }
            // });
            resolve(null);
        });

        // 添加学生，添加班级专用获取年级接口
        let p6 = new Promise((resolve, reject) => {
            dispatch({
                type: 'courseTeacherDetail/allGradeOfAS',
                payload: {
                    planId,
                    sectionIds:
                        (getUrlSearch('sectionIds') && getUrlSearch('sectionIds').split('_')) || [],
                },
                onSuccess: () => {
                    let gradeList = [];
                    let { allGradeOfAS } = this.props;
                    for (let i = 0; i < allGradeOfAS.length; i++) {
                        gradeList.push(allGradeOfAS[i].id);
                    }

                    // 联动获取参数
                    dispatch({
                        type: 'time/getClassList',
                        payload: {
                            gradeId: gradeList,
                            sectionIds:
                                (getUrlSearch('sectionIds') &&
                                    getUrlSearch('sectionIds').split('_')) ||
                                [],
                            planId,
                        },
                        onSuccess: () => {
                            resolve(null);
                        },
                    });
                },
            });
        });

        let p7 = new Promise((resolve, reject) => {
            //获取学年
            dispatch({
                type: 'time/selectAllSchoolYear',
                payload: {},
                onSuccess: () => {
                    resolve(null);
                },
            });
        });

        let p8 = new Promise((resolve, reject) => {
            dispatch({
                type: 'time/allStage',
                payload: {},
                onSuccess: () => {
                    resolve(null);
                },
            });
        });

        // 个人信息
        let p9 = new Promise((resolve, reject) => {
            dispatch({
                type: 'global/getCurrentUser',
                onSuccess: () => {
                    const { currentUser } = this.props;
                    localStorage.setItem(
                        'userIdentity',
                        currentUser && currentUser.currentIdentity
                    );
                    resolve(null);
                },
            });
        });

        let p10 = new Promise((resolve, reject) => {
            //获取科目
            if (typeof courseIndex_subjectList !== 'undefined') {
                dispatch({
                    type: 'course/getCourseIndexSubjectList',
                    payload: courseIndex_subjectList,
                    onSuccess: () => {
                        resolve(null);
                    },
                });
            } else {
                dispatch({
                    type: 'course/getSubjectList',
                    payload: {},
                    onSuccess: () => {
                        resolve(null);
                    },
                });
            }
        });

        let p11 = new Promise((resolve, reject) => {
            dispatch({
                type: 'courseTeacherDetail/allGradeAndGroup',
                payload: {
                    planId,
                    sectionIds:
                        (getUrlSearch('sectionIds') && getUrlSearch('sectionIds').split('_')) || [],
                },
                onSuccess: () => {
                    resolve(null);
                },
            });
        });

        let p12 = new Promise((resolve, reject) => {
            const { planId } = this.state;
            dispatch({
                type: 'course/getLotSubjects',
                payload: { chooseCoursePlanId: planId },
                onSuccess: () => {
                    resolve(null);
                },
            });
        });

        // 全部加载完在去展示弹窗
        Promise.all([p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12]).then(() => {
            let { chooseCourseDetails, currentUser } = this.props;
            let { administratorList, ccaAdministrator } = chooseCourseDetails;
            let isAdmin = false;
            let nonAdminType = 0;
            if (administratorList && administratorList.length > 0) {
                administratorList.forEach((el) => {
                    if (el.id == currentUser.userId) {
                        isAdmin = true;
                        return;
                    }
                });
            }
            if (ccaAdministrator && ccaAdministrator.length > 0) {
                ccaAdministrator.forEach((el) => {
                    if (el.id == currentUser.userId) {
                        isAdmin = true;
                        return;
                    }
                });
            }
            if (currentUser.currentIdentity == 'employee') {
                nonAdminType = 1;
            } else if (currentUser.currentIdentity == 'externalUser') {
                nonAdminType = 2;
            }
            this.setState({
                isAdmin,
                nonAdminType,
                loadInitData: true,
            });
        });
    }

    judgePayTuitionPlanResult = () => {
        const { dispatch } = this.props;
        const { planId } = this.state;
        return dispatch({
            type: 'course/createPayTuitionPlanResult',
            payload: { chooseCoursePlanId: planId },
        });
    };

    //生成收费单
    chargeBtn = () => {
        this.setState({
            isDisplay: true,
        });
    };
    ifRefresh = (value) => {
        this.setState({
            isDisplay: value,
        });
    };

    // 选课计划生效二次确认
    effectiveConfirm = () => {
        let _this = this;
        confirm({
            title: (
                <span className={styles.effective}>
                    <span className={styles.title}>
                        {' '}
                        {trans('tc.base.effective', '您确定将本次选课结果全部生效吗？')}{' '}
                    </span>
                    <span className={styles.text}>
                        {' '}
                        {trans(
                            'tc.base.effective.text',
                            '若确认生效，所有数据将无法再被编辑。学生可以查看自己的日程及课程。'
                        )}{' '}
                    </span>
                </span>
            ),
            icon: '',
            className: styles.effectiveConfirm,
            onOk() {
                _this.handleEffective();
            },
            onCancel() {},
        });
    };

    handleEffective = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'courseTeacherDetail/getEffective',
            payload: {
                id: this.state.planId,
            },
        }).then(() => {
            const { effectiveMsg } = this.props;
            if (effectiveMsg && effectiveMsg.status) {
                message.success(effectiveMsg.message);
                this.setState({
                    effecticveDisabled: true,
                });
            }
        });
    };

    back = () => {
        if (window.top != window.self) {
            let origin = '';
            if (typeof isYungu != 'undefined' && isYungu == 'true') {
                origin =
                    window.location.origin.indexOf('yungu.org') > -1
                        ? 'https://task.yungu.org'
                        : 'https://task.daily.yungu-inc.org';
            } else {
                if (typeof homeHost != 'undefined' && typeof homeHost == 'string') {
                    if (homeHost) {
                        origin = 'https://' + homeHost;
                    } else {
                        origin =
                            window.location.origin.indexOf('yungu.org') > -1
                                ? 'https://task.yungu.org'
                                : 'https://task.daily.yungu-inc.org';
                    }
                } else {
                    origin =
                        window.location.origin.indexOf('yungu.org') > -1
                            ? 'https://task.yungu.org'
                            : 'https://task.daily.yungu-inc.org';
                }
            }

            console.log(origin, 'origin');
            if (window.top.top) {
                window.top.top.location.href =
                    getUrlSearch('ifOutside') && getUrlSearch('ifOutside') == 'true'
                        ? origin + '/#/schedule/courseSelect'
                        : origin + '/#/courseSelection';
            } else {
                window.open(`${origin}/#/schedule/courseSelect`, '_blank');
            }
        } else {
            this.props.dispatch(routerRedux.push('/course/index/7'));
        }
    };

    // 头部导航
    navHTML() {
        let { selectionMessage: elt } = this.props;
        let { isAdmin, effecticveDisabled } = this.state;
        return (
            <div style={{ position: 'relative' }}>
                <div
                    className={styles.nav}
                    style={{ position: 'absolute', left: '45px', top: '2px' }}
                >
                    <div className={styles.navTop}>
                        <div>
                            <span className={styles.icon} onClick={this.back}></span>
                            <span className={styles.title}>
                                {locale() == 'en' ? elt.englishName : elt.name}
                            </span>
                            <span className={styles.type}>
                                {this.statusHTML(Number(elt.status))}
                            </span>
                        </div>
                    </div>
                </div>
                <div>{this.tabContentHTML()}</div>
            </div>
        );
    }

    statusHTML(type) {
        switch (type) {
            case 0:
                return (
                    <span className={`${styles.bz} ${styles.type0}`}>
                        {trans('course.header.not.start', '未开始')}
                    </span>
                );
            case 1:
                return (
                    <span className={`${styles.bz} ${styles.type1}`}>
                        {trans('course.header.have.in.hand', '进行中')}
                    </span>
                );
            default:
                return null;
        }
    }

    popoverHTML() {
        return (
            <div className={styles.popover}>
                <div
                    onClick={() => {
                        this.setState({
                            visible: true,
                        });
                    }}
                    className={styles.item}
                >
                    {trans('tc.base.edit.course.plan', '编辑选课计划')}
                </div>
                <div
                    onClick={this.deleteCourse.bind(this, this.state.planId)}
                    className={styles.item}
                >
                    {trans('tc.base.delete.course.plan', '删除选课计划')}
                </div>
            </div>
        );
    }

    switchTab = (i, payPlanId, sourceAction) => {
        const { dispatch } = this.props;
        const { planId } = this.state;
        //直接tab切换而不是跳转
        if (i === 4 && typeof payPlanId == 'object') {
            //先校验看有没有返回值，没有则说明生成收费单失败或者第一次生成收费单
            dispatch({
                type: 'course/getCheckPayTuitionPlan',
                payload: {
                    chooseCoursePlanId: this.state.planId,
                },
                onSuccess: (res) => {
                    if (res.first) {
                    } else {
                        if (!res.payPlanList) {
                            message.warning('未生成收费单');
                        } else {
                            this.judgePayTuitionPlanResult().then(() => {
                                const { createPayTuitionPlanResult } = this.props;
                                if (
                                    !createPayTuitionPlanResult &&
                                    !Number(localStorage.getItem('createPayTuitionPlanResult'))
                                ) {
                                    message.warning('收费单正在生成中....');
                                    return;
                                } else {
                                    // this.switchTabAction(i, payPlanId);
                                }
                            });
                        }
                    }
                },
            });
        } else {
            this.switchTabAction(i, payPlanId);
        }
    };

    switchTabAction = (i, payPlanId) => {
        //如果是跳转到收费页，存储其payPlanId
        if (typeof payPlanId != 'object') {
            this.setState({
                payPlanId,
            });
        }

        localStorage.setItem('tab', i);
        const tabValue = JSON.parse(localStorage.getItem('tab'));

        this.setState({
            tabIndex: tabValue,
        });
        let planId = getUrlSearch('planId'),
            sectionIds = getUrlSearch('sectionIds');
        if (
            getUrlSearch('ifOutside') &&
            getUrlSearch('ifOutside') == 'true' &&
            window.top != window.self
        ) {
            this.props.dispatch(
                routerRedux.push(
                    `/course/teacher/detail/${i}?planId=${planId}&sectionIds=${sectionIds}&ifOutside=true`
                )
            );
        } else {
            this.props.dispatch(
                routerRedux.push(
                    `/course/teacher/detail/${i}?planId=${planId}&sectionIds=${sectionIds}&payPlanId=${payPlanId}`
                )
            );
        }
    };

    // 开放选课权限
    handleOkOpenCourse = (item) => {
        const { currentUser } = this.props;
        if (new Date().getTime() >= new Date(item.endTime).getTime()) {
            message.warn(trans('tc.base.time.passed.no.open', '时间已过，不允许开放选课'));
            return;
        }

        let { dispatch } = this.props;
        // let { chooseCoursePlanBatchList } = this.state;
        let self = this;
        Modal.confirm({
            title: trans('tc.base.sure.open.course', '您确定要开放选课嘛？'),
            icon: null,
            className: styles.removeContainer,
            content: (
                <span>
                    {trans(
                        'tc.base.rule.no.student.3',
                        '开放后，当前选课计划对学生可见，选课时间到达后，系统将自动开启选课'
                    )}
                </span>
            ),
            onOk: () => {
                self.setState(
                    {
                        isOpenCourse: true,
                        coursePlanId: item.id,
                    },
                    () => {
                        dispatch({
                            type: 'courseTeacherDetail/openChooseCourse',
                            payload: {
                                batchId: item.id,
                                schoolId: currentUser.schoolId,
                            },
                            onSuccess: (bol) => {
                                if (bol) {
                                    self.setState({
                                        visibleOpenCourse: false,
                                        isOpenCourse: false,
                                        coursePlanId: '',
                                    });
                                }
                            },
                        }).then(() => {
                            self.setState({
                                isOpenCourse: false,
                            });
                        });
                    }
                );
            },
            okText: trans('tc.base.confirm.open', '确认开放'),
            cancelText: trans('global.cancel', '取消'),
        });
    };

    // 开放选课
    openCourseHTML() {
        let { visibleOpenCourse, isOpenCourse, coursePlanId } = this.state;
        let { chooseCoursePlanBatchList } = this.props;
        let columns = [
            {
                title: trans('tc.base.select.batch', '选课批次'),
                dataIndex: 'time',
                key: 'time',
                align: 'center',
                render: (tag, item) => (
                    <div>
                        <div className={styles.item}>
                            {trans('global.start', '起')}:{item.startTime}
                        </div>
                        <div className={styles.item}>
                            {trans('global.end', '止')}:{item.endTime}
                        </div>
                    </div>
                ),
            },
            {
                title: trans('course.setup.course.status', '状态'),
                dataIndex: 'status',
                key: 'status',
                align: 'center',
                render: (tag) => (
                    <div className={styles.item}>
                        {tag === 1
                            ? trans('select.student.notOpen', '未开放')
                            : tag === 2
                            ? trans('global.Published', '已发布')
                            : trans('global.In force', '已生效')}
                    </div>
                ),
            },
            {
                title: trans('tc.base.join.student.number', '参与学生'),
                dataIndex: 'num',
                key: 'num',
                align: 'center',
            },
            {
                title: trans('student.opeation', '操作'),
                dataIndex: 'operation',
                key: 'operation',
                align: 'center',
                render: (tag, item, index) => (
                    <div>
                        {item.status === 1 ? (
                            <div
                                onClick={this.handleOkOpenCourse.bind(this, item)}
                                className={
                                    isOpenCourse && coursePlanId == item.id
                                        ? styles.item
                                        : styles.active
                                }
                            >
                                {isOpenCourse && coursePlanId == item.id
                                    ? trans('global.open selection', '开放选课处理中')
                                    : trans('tc.base.open.course.selection', '开放选课')}
                            </div>
                        ) : item.status === 2 ? (
                            <div></div>
                        ) : (
                            <div className={styles.item}>
                                {trans('tc.base.open.course.selection', '开放选课')}
                            </div>
                        )}
                    </div>
                ),
            },
        ];
        return (
            <Modal
                title={
                    <NavTitle
                        title={trans('tc.base.open.course.selection', '开放选课')}
                        onCancel={this.onCancel.bind(this, 'visibleOpenCourse')}
                    />
                }
                maskClosable={false}
                closable={false}
                footer={null}
                visible={visibleOpenCourse}
                width="50%"
                className={styles.openSelect}
            >
                <div className={styles.openCourse}>
                    <Table
                        columns={columns}
                        dataSource={chooseCoursePlanBatchList}
                        pagination={false}
                    />
                    <div className={styles.btn}>
                        <Button
                            onClick={this.onCancel.bind(this, 'visibleOpenCourse')}
                            type="primary"
                        >
                            {trans('global.finish', '完成')}
                        </Button>
                    </div>
                </div>
            </Modal>
        );
    }

    // 展示弹窗公共函数
    onShowModel = (type, callback) => {
        if (type === 'visibleAddStudent') {
            let { gradeList, classList } = this.props;
            if (!(gradeList && gradeList.length > 0 && classList && classList.length > 0)) {
                message.warn(
                    trans('tc.base.no.find.student.check', '未找到该学段下的学生，请检查学生信息')
                );
                return;
            }
        }
        this.setState({
            [type]: true,
        });
        typeof callback === 'function' && callback();
    };

    newOpenSelectCourse = () => {
        this.setState({
            newOpenSelCourseVisible: true,
        });
    };

    closeSelectCourse = () => {
        this.setState({
            closeSelCouVisible: true,
        });
    };

    effectiveResult = () => {
        const { chooseCourseDetails } = this.props;
        let syncSchedule = chooseCourseDetails.syncSchedule;
        let effectiveType = chooseCourseDetails.effectiveType;
        if (effectiveType == 1) {
            this.setState({
                effectResVisible: true,
            });
        } else if (effectiveType == 0) {
            this.setState({
                effectiveVisible: true,
            });
        }
    };

    tabContentHTML() {
        let { tabIndex, isAdmin, planStatus, effecticveDisabled, tabTitleList, nonAdminType } =
            this.state;

        // allGradeOfAS 是添加学生专用年级接口
        let {
            selectionMessage,
            chooseCourseDetails,
            classList,
            allGradeOfAS,
            allGradeAndGroup,
            currentUser,
            PayTuitionPlan,
            chooseCoursePlanBatchList,
        } = this.props;

        let isStudy = currentUser.schoolId == '1000001001';

        let showStatus =
            chooseCoursePlanBatchList &&
            chooseCoursePlanBatchList.length > 0 &&
            chooseCoursePlanBatchList[0]?.status;

        console.log(showStatus, 'showStatus');

        let isTrue = undefined;
        if (showStatus == 1 || showStatus == 2 || showStatus == 3) {
            isTrue = true;
        } else if (showStatus == 4) {
            isTrue = false;
        }

        console.log(isTrue, 'isTrue');

        let syncSchedule = chooseCourseDetails.syncSchedule;
        let effectiveType = chooseCourseDetails.effectiveType;

        let adminFlag = false;
        chooseCourseDetails.administratorList &&
            chooseCourseDetails.administratorList.map((item, index) => {
                if (item.id == currentUser.userId) {
                    adminFlag = true;
                }
            });

        let feeFlag = false;
        chooseCourseDetails.feeAdministratorList &&
            chooseCourseDetails.feeAdministratorList.map((item, index) => {
                if (item.id == currentUser.userId) {
                    feeFlag = true;
                }
            });

        let ccaFlag = false;
        chooseCourseDetails.ccaAdministrator &&
            chooseCourseDetails.ccaAdministrator.map((item, index) => {
                if (item.id == currentUser.userId) {
                    ccaFlag = true;
                }
            });

        const menu = (
            <Menu>
                {PayTuitionPlan?.payPlanList.map((item, index) => {
                    return (
                        <Menu.Item key={index}>
                            <a onClick={() => this.switchTabAction(4, item.id)}>{item.name}</a>
                        </Menu.Item>
                    );
                })}
            </Menu>
        );

        return (
            <div className={styles.tabContent}>
                <div
                    className={styles.tab}
                    style={{
                        width: '540px',
                        margin: '0 auto',
                        display: 'flex',
                        justifyContent: 'space-around',
                    }}
                >
                    {tabTitleList.map((el, i) => (
                        <span
                            onClick={
                                i == 0 && (adminFlag || ccaFlag)
                                    ? this.switchTab.bind(this, i)
                                    : '' || (i == 1 && (adminFlag || ccaFlag))
                                    ? this.switchTab.bind(this, i)
                                    : '' || i == 2
                                    ? this.switchTab.bind(this, i)
                                    : '' || (i == 3 && (feeFlag || ccaFlag))
                                    ? this.switchTab.bind(this, i)
                                    : '' || (i == 4 && (feeFlag || ccaFlag))
                                    ? this.switchTab.bind(this, i)
                                    : ''
                            }
                            className={
                                tabIndex == i
                                    ? `${styles.title} ${styles.active}`
                                    : `${styles.title}`
                            }
                            key={i}
                        >
                            {i == 0 && (adminFlag || ccaFlag) ? (
                                <span className={styles.el}>{el}</span>
                            ) : (
                                ''
                            )}
                            {i == 1 && (adminFlag || ccaFlag) ? (
                                <span className={styles.el}>{el}</span>
                            ) : (
                                ''
                            )}
                            {i == 2 ? <span className={styles.el}>{el}</span> : ''}
                            {i == 3 && (feeFlag || ccaFlag) ? (
                                <span className={styles.el}>{el}</span>
                            ) : (
                                ''
                            )}
                            {i == 4 && (feeFlag || ccaFlag) ? (
                                <Dropdown overlay={menu} trigger={['click']}>
                                    <span className={styles.el}>{el}</span>
                                </Dropdown>
                            ) : (
                                ''
                            )}
                        </span>
                    ))}
                    <div className={styles.opreate}>
                        {!isStudy && isAdmin && (
                            <Button
                                type="primary"
                                onClick={this.onShowModel.bind(this, 'visibleOpenCourse')}
                                className={styles.b}
                            >
                                {trans('tc.base.open.course.selection', '开放选课')}
                            </Button>
                        )}

                        {isStudy && !isTrue && isAdmin && (
                            <Button
                                style={{ marginLeft: '8px' }}
                                className={styles.b}
                                onClick={this.newOpenSelectCourse}
                                type="primary"
                            >
                                {trans('tc.base.open.course.selection', '开放选课')}
                            </Button>
                        )}

                        {isStudy && isTrue == true && isAdmin && (
                            <Button
                                style={{ marginLeft: '8px' }}
                                className={styles.b}
                                onClick={this.closeSelectCourse}
                                type="primary"
                            >
                                {locale() == 'en' ? 'Close select course' : '结束选课'}
                            </Button>
                        )}

                        {isAdmin && (
                            <Button
                                type={syncSchedule && effectiveType ? '' : 'primary'}
                                style={{ width: 'auto' }}
                                // onClick={this.effectiveConfirm}
                                onClick={this.effectiveResult}
                            >
                                {syncSchedule && effectiveType
                                    ? trans('global.Course selection results', '选课结果已生效')
                                    : '生效选课'}
                            </Button>
                        )}
                    </div>
                </div>

                <p className={styles.horizon}></p>
                <div className={styles.content}>
                    {tabIndex == 0 ? (
                        <Detail
                            onRef={(self) => {
                                this.studentChild = self;
                            }}
                            addStudentGradeList={allGradeOfAS}
                            isAdmin={isAdmin}
                            gradeList={allGradeAndGroup}
                            classList={classList}
                            chooseCoursePlanId={this.state.planId}
                            selectionMessage={selectionMessage}
                            chooseCourseDetails={chooseCourseDetails}
                            effecticveDisabled={effecticveDisabled}
                            choosePlanList={this.props.choosePlanList}
                            getPayChargeItemList={this.props.getPayChargeItemList}
                        ></Detail>
                    ) : tabIndex == 1 ? (
                        <Student
                            onRef={(self) => {
                                this.studentChild = self;
                            }}
                            addStudentGradeList={allGradeOfAS}
                            isAdmin={isAdmin}
                            planStatus={planStatus}
                            nonAdminType={nonAdminType}
                            gradeList={allGradeAndGroup}
                            classList={classList}
                            selectionMessage={selectionMessage}
                            chooseCourseDetails={chooseCourseDetails}
                            effecticveDisabled={effecticveDisabled}
                            choosePlanList={this.props.choosePlanList}
                        />
                    ) : tabIndex == 2 ? (
                        <Course
                            onRef={(self) => {
                                this.courseChild = self;
                            }}
                            isAdmin={isAdmin}
                            planStatus={planStatus}
                            nonAdminType={nonAdminType}
                            gradeList={allGradeOfAS}
                            selectionMessage={selectionMessage}
                            effecticveDisabled={effecticveDisabled}
                            chooseCourseDetails={chooseCourseDetails}
                            userSchoolId={this.props.userSchoolId}
                        />
                    ) : tabIndex == 3 ? (
                        <FeeManage
                            onRef={(self) => {
                                this.courseChild = self;
                            }}
                            isAdmin={isAdmin}
                            planStatus={planStatus}
                            nonAdminType={nonAdminType}
                            gradeList={allGradeOfAS}
                            selectionMessage={selectionMessage}
                            chooseCoursePlanId={this.state.planId}
                            effecticveDisabled={effecticveDisabled}
                            chooseCourseDetails={chooseCourseDetails}
                            switchTab={this.switchTab}
                        ></FeeManage>
                    ) : (
                        <PayNoticeDetail payPlanId={this.state.payPlanId} />
                    )}
                </div>
            </div>
        );
    }

    choosePlanList = (callback) => {
        const { dispatch } = this.props;
        let { pageNum, pageSize } = this.state;
        dispatch({
            type: 'course/choosePlanList',
            payload: {
                pageNum,
                pageSize,
            },
            onSuccess: () => {
                callback && callback();
            },
        });
    };

    //删除选课计划
    deleteCourse = (id) => {
        const { dispatch } = this.props;
        let self = this;
        Modal.confirm({
            title: trans('course.index.delete.course', '是否删除该选课计划'),
            content: null,
            onOk() {
                dispatch({
                    type: 'course/chooseCourseDelete',
                    payload: { id },
                    onSuccess: (data) => {
                        window.location.href = '#/course/index/2';
                    },
                });
            },
            onCancel() {},
        });
    };

    hideModal = (type) => {
        switch (type) {
            case 'visible':
                this.setState({
                    visible: false,
                });
                break;
            default:
                break;
        }
    };

    closeSelection = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'choose/goodCloseChooseCourse',
            payload: {
                chooseCoursePlanId: this.state.planId,
            },
        }).then(() => {
            this.setState({
                closeSelCouVisible: false,
            });
        });
    };

    closeEffect = () => {
        this.setState({ effectiveVisible: false });
    };

    handleToEffective = () => {
        const { dispatch } = this.props;
        const { effectiveValue } = this.state;
        if (effectiveValue == undefined) {
            message.warn('请选择日程考勤类型！');
            return;
        }
        console.log(effectiveValue, 'effectiveValue');
        this.setState({
            uploading: true,
        });
        if (effectiveValue == 1) {
            dispatch({
                type: 'courseTeacherDetail/getEffective',
                payload: {
                    id: this.state.planId,
                },
            }).then(() => {
                dispatch({
                    type: 'choose/chooseCourseDetails',
                    payload: {
                        id: this.state.planId,
                    },
                }).then(() => {
                    this.setState({
                        effectiveVisible: false,
                        uploading: false,
                        effectResVisible: true,
                    });
                });
            });
        } else if (effectiveValue == 0) {
            dispatch({
                type: 'courseTeacherDetail/getEffective',
                payload: {
                    id: this.state.planId,
                },
            }).then(() => {
                dispatch({
                    type: 'courseTeacherDetail/syncToScheduleTemplate',
                    payload: {
                        chooseCoursePlanId: this.state.planId,
                    },
                })
                    .then(() => {
                        const { syncToScheduleTemplate } = this.props;
                        if (syncToScheduleTemplate?.status) {
                            message.success('同步成功！');
                        }
                    })
                    .then(() => {
                        dispatch({
                            type: 'choose/chooseCourseDetails',
                            payload: {
                                id: this.state.planId,
                            },
                        }).then(() => {
                            this.setState({
                                effectiveVisible: false,
                                uploading: false,
                                effectResVisible: true,
                            });
                        });
                    });
            });
        }
    };

    onChangeAttendance = (e) => {
        this.setState({
            effectiveValue: e.target.value,
        });
    };

    render() {
        let { loadInitData, host, planId, visible, tabIndex, effectResVisible, isGenetare } =
            this.state;
        let { chooseCourseDetails, selectionMessage } = this.props;

        let syncSchedule = chooseCourseDetails.syncSchedule;
        let effectiveType = chooseCourseDetails.effectiveType;

        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
            color: 'black',
        };

        if (!loadInitData) {
            return (
                <div className={styles.loadInitData}>
                    <Skeleton active />
                    <div style={{ margin: '24px 0' }}>
                        <Skeleton active />
                    </div>
                    <Skeleton active />
                </div>
            );
        }
        return (
            <div className={styles.CourseDetail}>
                {this.navHTML()}

                <AddCourse
                    visible={visible}
                    isEdit={true}
                    planId={planId}
                    hideModal={this.hideModal}
                    choosePlan={this.choosePlanList}
                    callback={() => {
                        // 添加成功时，如果在课程页面，则重新请求数据
                        if (tabIndex === 1) {
                            this.courseChild.resetData.call(this.courseChild);
                        } else {
                            this.studentChild.initStudentDetail.call(this.studentChild);
                        }
                    }}
                    {...this.props}
                />

                <Modal
                    visible={this.state.closeSelCouVisible}
                    title="结束选课"
                    footer={
                        <div>
                            <Button
                                className={styles.cancel}
                                onClick={() =>
                                    this.setState({
                                        closeSelCouVisible: false,
                                    })
                                }
                                style={{
                                    color: 'rgba(1, 17, 61, 0.65)',
                                    background: 'rgba(1, 17, 61, 0.07)',
                                    border: 0,
                                    height: '36px',
                                    lineHeight: '36px',
                                    borderRadius: '8px',
                                }}
                            >
                                {trans('global.cancel', '取消')}
                            </Button>
                            <Button
                                className={styles.sure}
                                type="primary"
                                onClick={this.closeSelection}
                                style={{
                                    background: '#3B6FF5',
                                    color: '#fff',
                                    height: '36px',
                                    lineHeight: '36px',
                                    borderRadius: '8px',
                                    width: 'auto',
                                }}
                            >
                                确认结束选课
                            </Button>
                        </div>
                    }
                >
                    <p>结束选课后，当前选课计划中的全部课程将不再显示在家长端的课程列表中</p>
                </Modal>

                <Modal
                    visible={effectResVisible}
                    title="选课结果已生效"
                    width={570}
                    footer={[
                        <Button
                            onClick={() =>
                                this.setState({
                                    effectResVisible: false,
                                })
                            }
                            style={{ marginLeft: '400px' }}
                        >
                            关闭
                        </Button>,
                    ]}
                    onCancel={() =>
                        this.setState({
                            effectResVisible: false,
                        })
                    }
                    className={styles.effect}
                >
                    <Spin spinning={isGenetare}>
                        <div>
                            <p>
                                <Icon type="check-circle" style={{ color: '#79DE5D' }} />
                                <span className={styles.title}>选课名单已生成</span>
                            </p>
                            <p>
                                教师可为学生布置任务、填写课堂反馈等。若之后学生选课结果有变化，可在选课中进行调整，调整结果实时生效。
                            </p>
                        </div>
                        <div>
                            <p>
                                {syncSchedule ? (
                                    <Icon type="check-circle" style={{ color: '#79DE5D' }} />
                                ) : (
                                    <span
                                        style={{
                                            display: 'inline-block',
                                            border: '1px solid #ccc',
                                            width: '14px',
                                            height: '14px',
                                            borderRadius: '7px',
                                            verticalAlign: 'middle',
                                        }}
                                    ></span>
                                )}

                                <span className={styles.title}>
                                    {syncSchedule ? '教师及学生日程已生成' : '通过课表管理选课日程'}
                                </span>
                                <span
                                    style={{
                                        color: '#4870FD',
                                        margin: '0 20px',
                                        cursor: 'pointer',
                                    }}
                                    onClick={this.toCalender}
                                >
                                    查看日程
                                </span>
                            </p>
                            <p>
                                {syncSchedule
                                    ? '教师可查询个人上课日程，可使用课堂考勤功能；学生家长可查询学生上课日程。若之后上课时间和地点有变化，可直接调整日程。'
                                    : '您可以使用「同步课表」功能，将选修课同步至指定的课表，或直接在课表中导入选课课表，通过公布课表生成选课日程'}
                            </p>
                        </div>
                    </Spin>
                </Modal>

                <Modal
                    visible={this.state.effectiveVisible}
                    title={trans('global.Effective course selection results', '生效选课结果')}
                    footer={
                        <p style={{ display: 'flex', justifyContent: 'end' }}>
                            <Button onClick={this.closeEffect}>
                                {trans('global.cancel', '取消')}
                            </Button>
                            <Button type="primary" onClick={this.handleToEffective}>
                                {trans('global.confirmEffective', '确认生效选课结果')}
                            </Button>
                        </p>
                    }
                    onCancel={this.closeEffect}
                    width={570}
                    className={styles.effect}
                >
                    <Spin
                        spinning={this.state.uploading}
                        tip={trans('global.effectiveLoading', '生效中，请稍后...')}
                    >
                        <p className={styles.effectiveContent}>
                            <span className={styles.title}>
                                {trans('global.Course selection list', '选课名单')}
                                <i style={{ color: 'red' }}>*</i>
                            </span>
                            <div>
                                <Radio style={radioStyle} defaultChecked={true} disabled={true}>
                                    {trans('global.GenerateList', '生成学生选课名单')}
                                </Radio>
                                <span>
                                    {trans(
                                        'global.GenerateListAfter',
                                        '生成选课名单后，教师可为学生布置任务、填写课堂反馈等。若之后学生选课结果有变化，可在选课中进行调整，调整结果实时生效。'
                                    )}
                                </span>
                            </div>
                        </p>
                        <p className={styles.effectiveContent}>
                            <span className={styles.title}>
                                {/* {trans('global.Schedule attendance', '日程考勤')} */}
                                选课日程
                                <i style={{ color: 'red' }}>*</i>
                            </span>
                            <Radio.Group
                                onChange={this.onChangeAttendance}
                                value={this.state.effectiveValue}
                                style={{ marginLeft: '12px' }}
                            >
                                <Radio style={radioStyle} value={0}>
                                    直接生成选课日程
                                </Radio>
                                <span>
                                    生成日程后，教师可查询个人上课日程，可使用课堂考勤功能；学生家长可查询学生上课日程。日程生成后，若教师及地点有变化，可直接在选课中调整。
                                </span>
                                <Radio style={radioStyle} value={1}>
                                    通过课表管理选课日程
                                </Radio>
                                <span>
                                    您可以使用「同步课表」功能，将选修课同步至指定的课表，或直接在课表中导入选课课表，通过公布课表生成选课日程
                                </span>
                            </Radio.Group>
                        </p>
                    </Spin>
                </Modal>

                {/* 开放选课 */}
                {this.openCourseHTML()}
            </div>
        );
    }
}

export default CourseDetail;
