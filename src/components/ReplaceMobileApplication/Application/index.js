import React, { Fragment, PureComponent } from 'react';
import styles from './index.less';
import { withRouter } from 'dva/router';
import {
    Input,
    Button,
    Checkbox,
    Upload,
    Icon,
    Spin,
    Select,
    message,
    Tooltip,
    DatePicker,
    Radio,
    Switch,
} from 'antd';
import { Calendar, InputItem, List, Modal, TextareaItem } from 'antd-mobile';
import { add, isEmpty } from 'lodash';
import { getUrlSearch, intoChineseLang, weekDayAbbreviationEn } from '../../../utils/utils';
import moment from 'moment';
import { connect } from 'dva';
import BottomBtn from '../BottomBtn';
import zhCN from 'antd-mobile/lib/calendar/locale/zh_CN';
import { trans } from '../../../utils/i18n';
@connect((state) => ({
    rightContentType: state.replace.rightContentType,
    changeRequest: state.replace.changeRequest,
    status: state.replace.status,
    addLessonList: state.replace.addLessonList,
    importSupplementFileList: state.replace.importSupplementFileList,
    contentWrapperLoading: state.replace.contentWrapperLoading,
    copySendRuleList: state.replace.copySendRuleList,
    ccValue: state.replace.ccValue,
    requestRelatedList: state.replace.requestRelatedList,
    selectSupportVersion: state.replace.selectSupportVersion,
    approveCheck: state.replace.approveCheck,
    checkWorkFlowNodePermission: state.replace.checkWorkFlowNodePermission,
    selectScheduleCourseMessage: state.replace.selectScheduleCourseMessage,
    totalLessonList: state.replace.totalLessonList,
    rangePickerTimeList: state.replace.rangePickerTimeList,
    currentUser: state.replace.currentUser,
}))
class Application extends PureComponent {
    state = {
        calendarVisible: false,
        lessonListModalVisible: false,
        timeValue: new Date(),
        loadingStatus: false,
        storageSelectLessonList: [],
        showRelatedList: false,
        weekRadio: 1,
        temporaryTimeValue: new Date(),
    };

    componentDidMount() {
        console.log('replaceApplication Content componentDid');
        this.initData();
        this.getDetailData();
        this.getTitle();
    }

    getTitle = () => {
        const { status, changeRequest, currentLang } = this.props;
        console.log('status :>> ', status);
        if (status === 'application') {
            document.title = '申请调代课';
        } else {
            if (currentLang === 'cn') {
                document.title = `${changeRequest.teacherModel.name}的调代课申请`;
            } else {
                document.title = `${changeRequest.teacherModel.englishName}'s application`;
            }
        }
    };

    initData = () => {
        const { dispatch } = this.props;

        //查询年级
        dispatch({
            type: 'replace/findGrade',
        });
        //查询学科
        dispatch({
            type: 'replace/findSubject',
        });
        //查询教师
        dispatch({
            type: 'replace/getListAllOrgTeachers',
        });
        //提前清空校验结果
        dispatch({
            type: 'replace/setApproveResult',
            payload: [],
        });
        //取当前用户
        dispatch({
            type: 'replace/getCurrentUser',
        });
    };

    getDetailData = async () => {
        let requestId = getUrlSearch('requestId');
        let scheduleResultId = getUrlSearch('scheduleResultId');

        //如果路由上面有requestId，说明是从调代课列表进来的
        if (requestId) {
            this.getChangeRequestDetail('detail', requestId);
        }
        //如果路由上面有scheduleResultId，说明是从日程进来的
        if (scheduleResultId) {
            this.getSelectScheduleCourseMessage(scheduleResultId);
        }
    };

    //type: detail表示走接口设置changeRequest related通过关联申请表设置changeRequest
    getChangeRequestDetail = async (type, requestId, item) => {
        const { dispatch } = this.props;

        //loading：true
        await dispatch({
            type: 'replace/changeContentWrapperLoading',
            payload: true,
        });

        //鉴权
        await dispatch({
            type: 'replace/getCheckWorkFlowNodePermission',
            payload: {
                requestId,
            },
        });

        //根据鉴权结果设置status 0-无权限，1-业务审批，2-教务审批,
        const { checkWorkFlowNodePermission } = this.props;
        let status =
            checkWorkFlowNodePermission === 2
                ? 'schoolApproval'
                : checkWorkFlowNodePermission === 1
                ? 'businessApproval'
                : 'detail';
        await dispatch({
            type: 'replace/setStatus',
            payload: status,
        });

        //根据type设置changeRequest
        if (type === 'detail') {
            await dispatch({
                type: 'replace/changeRequestDetail',
                payload: {
                    requestId,
                },
            });
        }
        if (type === 'related') {
            await dispatch({
                type: 'replace/setRelatedRequestDetail',
                payload: item,
            });
        }

        //如果请求接口，存储选择列表
        const { addLessonList } = this.props;
        this.setState({
            storageSelectLessonList: [...addLessonList],
        });

        //如果没有changeVersion，请求版本列表，并且取selectSupportVersion的lastPublish项
        //安排方式为自行安排时，调课后版本为最新公布版本，只读
        //安排方式为教务支持时，选项默认为当前课表版本
        const { changeRequest, status: currentStatus, currentLang } = this.props;
        const isVersionStatus = currentStatus === 'schoolApproval';
        document.title =
            currentLang === 'cn'
                ? `${changeRequest.teacherModel?.name}的调代课申请`
                : `${changeRequest.teacherModel?.englishName}'s application`;
        if (isVersionStatus && !isEmpty(changeRequest.changeScheduleResultDTOList)) {
            dispatch({
                type: 'replace/getSelectSupportVersion',
                payload: {
                    versionId: changeRequest.changeScheduleResultDTOList[0].versionId,
                },
            }).then(() => {
                const { selectSupportVersion } = this.props;
                let targetVersion;
                if (changeRequest.arrangeType === 1) {
                    targetVersion = selectSupportVersion.find((item) => item.lastPublish);
                }
                if (changeRequest.arrangeType === 2) {
                    if (!changeRequest.changeVersion) {
                        targetVersion = {};
                    } else {
                        targetVersion = selectSupportVersion.find(
                            (item) => item.id === changeRequest.changeVersion.id
                        );
                    }
                }
                this.setChangeRequest('changeVersion', targetVersion);
            });
        }

        await dispatch({
            type: 'replace/changeContentWrapperLoading',
            payload: false,
        });
    };

    getSelectScheduleCourseMessage = async (scheduleResultId) => {
        const { dispatch } = this.props;

        await dispatch({
            type: 'replace/changeContentWrapperLoading',
            payload: true,
        });
        await dispatch({
            type: 'replace/getSelectScheduleCourseMessage',
            payload: {
                resultId: scheduleResultId,
            },
            onSuccess: (selectScheduleCourseMessage) => {
                console.log('selectScheduleCourseMessage :>> ', selectScheduleCourseMessage);
                dispatch({
                    type: 'replace/setAddLessonList',
                    payload: [
                        {
                            source: selectScheduleCourseMessage,
                        },
                    ],
                });
                let startTime = moment(selectScheduleCourseMessage.startTimeMillion)
                    .startOf('week')
                    .valueOf();
                let endTime =
                    moment(selectScheduleCourseMessage.startTimeMillion).endOf('week').valueOf() -
                    999;
                dispatch({
                    type: 'replace/getTotalLessonList',
                    payload: {
                        startTime,
                        endTime,
                    },
                });
                dispatch({
                    type: 'replace/setRangePickerTimeList',
                    payload: [startTime, endTime],
                });
            },
        });
        await dispatch({
            type: 'replace/changeContentWrapperLoading',
            payload: false,
        });
    };

    searchReplace = () => {
        const { dispatch, history } = this.props;
        history.push('/replace/mobile/application/index/1');
    };

    searchExchange = (source) => {
        const { dispatch, history } = this.props;
        if (source.studentGroups.length > 1) {
            message.info('合班课暂不支持自行换课，请选择需要教务支持');
            return;
        }
        history.push('/replace/mobile/application/index/2');
    };

    addLesson = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'replace/setRightContentType',
            payload: 'addLesson',
        });
    };

    clickLessonItem = (item) => {
        console.log('clickLessonItem');
        const { dispatch, addLessonList, status } = this.props;
        if (status !== 'application' && status !== 'schoolApproval') {
            return;
        }
        dispatch({
            type: 'replace/setAddLessonList',
            payload: addLessonList.map((lessonItem) => {
                return {
                    ...lessonItem,
                    isSelected: lessonItem.source.id === item.source.id,
                };
            }),
        });
        dispatch({
            type: 'replace/setSelectedAddLessonItem',
            payload: item,
        });
    };

    setChangeRequest = (paramsType, value) => {
        const { dispatch, changeRequest } = this.props;
        dispatch({
            type: 'replace/setChangeRequest',
            payload: {
                ...changeRequest,
                [paramsType]: value,
            },
        });
    };

    resetTeacherOrCourse = (e, item) => {
        e.stopPropagation();
        const { dispatch, addLessonList } = this.props;
        dispatch({
            type: 'replace/setAddLessonList',
            payload: addLessonList.map((lessonItem) => {
                if (lessonItem.source.id === item.source.id) {
                    return {
                        source: lessonItem.source,
                        isSelected: true,
                    };
                } else {
                    return {
                        ...lessonItem,
                    };
                }
            }),
        });
    };

    removeLessonItem = (e, index) => {
        e.stopPropagation();
        const { dispatch, addLessonList } = this.props;
        let addLessonListCopy = [...addLessonList];
        addLessonListCopy.splice(index, 1);
        dispatch({
            type: 'replace/setAddLessonList',
            payload: addLessonListCopy,
        });
        dispatch({
            type: 'replace/selectCopySendRule',
            payload: {
                resultIdString: addLessonListCopy.map((item) => item.source.id).join(),
            },
        });
    };

    getCopySendTeacherOrRule = (type) => {
        const { copySendRuleList, ccValue, currentLang } = this.props;
        console.log('copySendRuleList :>> ', copySendRuleList);
        if (type === 'label') {
            let res = [];
            copySendRuleList.map((item) => {
                res.push(
                    ...item.approveRoleList.map((item) =>
                        currentLang === 'cn' ? item.roleTagName : item.roleTagEnName
                    )
                );
                res.push(
                    ...item.approveUserList.map((item) =>
                        currentLang === 'cn' ? item.name : item.englishName
                    )
                );
            });
            return res.join(' ');
        }

        if (type === 'value') {
            let requestCopySendRoleTagList = [];
            let requestCopySendUserIdList = [];
            copySendRuleList.map((item) => {
                requestCopySendRoleTagList.push(
                    ...item.approveRoleList.map((item) => item.roleTagCode)
                );
                requestCopySendUserIdList.push(...item.approveUserList.map((item) => item.id));
            });
            if (ccValue.length > 1) {
                requestCopySendRoleTagList.push('GRADE_PRINCIPAL');
            }
            return {
                requestCopySendUserIdList,
                requestCopySendRoleTagList,
            };
        }

        if (type === 'detail') {
            if (!isEmpty(copySendRuleList)) {
                let gradeRoleItem = copySendRuleList[0].approveRoleList?.find(
                    (item) => item.roleTagCode === 'GRADE_PRINCIPAL'
                );
                let ruleList = copySendRuleList.map((item) => {
                    return {
                        ...item,
                        approveRoleList: item.approveRoleList.filter(
                            (roleItem) => roleItem.roleTagCode !== 'GRADE_PRINCIPAL'
                        ),
                    };
                });
                let res = [];

                ruleList.map((item) => {
                    res.push(
                        ...item.approveUserList.map((item) =>
                            currentLang === 'cn' ? item.name : item.englishName
                        )
                    );
                    res.push(
                        ...item.approveRoleList.map((item) =>
                            currentLang === 'cn' ? item.roleTagName : item.roleTagEnName
                        )
                    );
                });
                return (
                    <div className={styles.editValue}>{`${res.join(' ')}${
                        gradeRoleItem ? ' 年级长' : ''
                    }`}</div>
                );
            } else {
                return <div className={styles.editValue} style={{ height: '40px' }}></div>;
            }
        }
    };

    getStatusSpan = (isCurrent, status) => {
        let mapObj = {
            0: {
                title: trans('global.replace.pending', '待审批'),
                bgc: 'rgba(254, 138, 38, 0.1)',
                color: 'rgba(254, 138, 38, 1)',
            },
            1: {
                title: trans('global.replace.completed', '动课完成'),
                bgc: 'rgba(28, 194, 94, 0.1)',
                color: 'rgba(28, 194, 94, 1)',
            },
            2: {
                title: trans('global.replace.rejected', '审批拒绝'),
                bgc: 'rgba(255, 69, 0, 0.1)',
                color: 'rgba(255, 69, 0, 1)',
            },
            3: {
                title: trans('global.replace.canceled', '已撤销'),
                bgc: 'rgba(1, 17, 61, 0.07)',
                color: 'rgba(1, 17, 61, 0.7)',
            },
            4: {
                title: trans('global.replace.processing', '教务处理'),
                bgc: 'rgba(254, 138, 38, 0.1)',
                color: 'rgba(254, 138, 38, 1)',
            },
        };
        if (isCurrent) {
            return {
                color: 'rgba(4, 69, 252, 0.85)',
                bgc: 'rgba(4, 69, 252, 0.07);',
                title: `（当前）${mapObj[status].title}`,
            };
        }
        return mapObj[status];
    };

    requestRelatedChange = async (item) => {
        const { history } = this.props;
        history.push(`/replace/mobile/application/index?requestId=${item.id}`);
        this.getChangeRequestDetail('related', item.id, item);
    };

    judgeCourseConflict = (course) => {
        const { approveCheck, status } = this.props;
        if (status !== 'schoolApproval') {
            return false;
        }
        if (isEmpty(approveCheck) || isEmpty(approveCheck.courseConflictMessageDTOList)) {
            return false;
        }

        let targetConflictItem = approveCheck.courseConflictMessageDTOList.find(
            (item) => item.sourceResultId == course.source.id
        );
        if (targetConflictItem) {
            return targetConflictItem.conflictMessage;
        } else {
            return false;
        }
    };

    getStatusString = (item, index) => {
        //type  节点类型(0-规则节点,1-提交申请,2-拒绝,3-撤销,4-保存,5-请假)
        //recordListItem.status 审批进度单元的状态(0-待审批,1-同意,2-拒绝,3-撤销,4-被教务审批提前执行而取消)
        if (item.type === 0) {
            if (item.workflowNode === 'COPY_SEND') {
                return <span> {trans('global.replace.copyTo', '抄送')}</span>;
            }
            if (item.workflowNode === 'BUSINESS_APPROVE') {
                if (item.status === 0) {
                    return (
                        <span>
                            {trans('global.replace.approvalProgress.approval', '业务审批')}{' '}
                            {trans('global.replace.approvalProgress.pending', '处理中')}
                        </span>
                    );
                }
                if (item.status === 1) {
                    return (
                        <span>
                            {trans('global.replace.approvalProgress.approval', '业务审批')}{' '}
                            {trans('global.replace.agree', '同意')}
                        </span>
                    );
                }
                if (item.status === 2) {
                    return (
                        <span>
                            {trans('global.replace.approvalProgress.approval', '业务审批')}{' '}
                            {trans('global.replace.approvalProgress.reject', '拒绝')}
                        </span>
                    );
                }
                if (item.status === 4) {
                    return (
                        <span>
                            {trans('global.replace.approvalProgress.approval', '业务审批')}{' '}
                            {trans('global.replace.approvalProgress.taskCanceled', '任务取消')}
                        </span>
                    );
                }
            }
            if (item.workflowNode === 'EDUCATION_APPROVE') {
                if (item.status === 0) {
                    return (
                        <span>
                            {trans('global.replace.affairsProcess', '教务处理')}{' '}
                            {trans('global.replace.Waiting', '等待处理')}
                        </span>
                    );
                }
                if (item.status === 1) {
                    return (
                        <span>
                            {trans('global.replace.affairsProcess', '教务处理')}{' '}
                            {trans('global.replace.coordinatCompleted', '动课完成')}
                        </span>
                    );
                }
                if (item.status === 2) {
                    return (
                        <span>
                            {trans('global.replace.affairsProcess', '教务处理')}{' '}
                            {trans('global.replace.approvalProgress.reject', '拒绝')}
                        </span>
                    );
                }
            }
        }
        if (item.type === 1) {
            return <span>{trans('global.replace.approvalProgress.submit', '提交申请')}</span>;
        }
        if (item.type === 3) {
            return <span>{trans('global.replace.approvalProgress.withdraw', '撤销')}</span>;
        }
        if (item.type === 4) {
            return (
                <span>
                    {trans('global.replace.affairsProcess', '教务处理')}{' '}
                    {trans('global.replace.approvalProgress.save', '保存')}
                </span>
            );
        }
        if (item.type === 5) {
            if (item.status === 0) {
                return (
                    <span>
                        {trans('global.replace.leaveApproval', '请假审批')}{' '}
                        {trans('global.replace.approvalProgress.pending', '处理中')}
                    </span>
                );
            }
            if (item.status === 1) {
                return (
                    <span>
                        {trans('global.replace.leaveApproval', '请假审批')}{' '}
                        {trans('global.replace.agree', '同意')}
                    </span>
                );
            }
            if (item.status === 2) {
                return (
                    <span>
                        {trans('global.replace.leaveApproval', '请假审批')}{' '}
                        {trans('global.replace.approvalProgress.reject', '拒绝')}
                    </span>
                );
            }
            if (item.status === 3) {
                return (
                    <span>
                        {trans('global.replace.approvalProgress.tripCanceled', '撤销请假/外出')}
                    </span>
                );
            }
            if (item.status === 4) {
                return <span>请假状态仍需同步</span>;
            }
        }
    };

    getRecordIconColor = (item) => {
        //nodeType 0 已完成 1 进行中 2等待处理
        //已完成或者进行中 绿色
        //等待处理 灰色
        if (item.nodeType === 0 || item.nodeType === 1) {
            return '#1CC25E';
        }
        if (item.nodeType === 2) {
            return 'rgba(1, 17, 61, 0.05)';
        }
    };

    getRecordTextColor = (item) => {
        //nodeType 0 已完成 1 进行中 2等待处理
        //type  节点类型(0-规则节点,1-提交申请,2-拒绝,3-撤销,4-保存,5-请假)
        //recordListItem.status 审批进度单元的状态(0-待审批,1-同意,2-拒绝,3-撤销,4-被教务审批提前执行而取消)

        //已经完成：拒绝、撤销红色，否则绿色
        //进行中：橙色
        //等待处理：灰色
        if (item.nodeType === 0) {
            if (item.type === 0) {
                if (item.workflowNode === 'BUSINESS_APPROVE') {
                    if (item.status === 2 || item.status === 4) {
                        return '#f04631';
                    }
                }
                if (item.workflowNode === 'EDUCATION_APPROVE') {
                    if (item.status === 2) {
                        return '#f04631';
                    }
                }
            }
            if (item.type === 3) {
                return '#f04631';
            }
            return '#1CC25E';
        }
        if (item.nodeType === 1) {
            return '#FE8A26';
        }
        if (item.nodeType === 2) {
            return 'rgba(1, 17, 61, 0.65)';
        }
        if (item.type === 5) {
            if (item.status === 0) {
                return '#FE8A26';
            }
            if (item.status === 1) {
                return '#1CC25E';
            }
            if (item.status === 2 || item.status === 3 || item.status === 4) {
                return '#f04631';
            }
        }
    };

    getRecordLineColor = (item) => {
        //nodeType 0 已完成 1 进行中 2等待处理
        //已完成：绿色
        //进行中或者等待中：灰色
        if (item.nodeType === 0) {
            return '#1CC25E';
        }
        if (item.nodeType === 1 || item.nodeType === 2) {
            return 'rgba(1, 17, 61, 0.2)';
        }
    };

    //未处理时不限时间
    judgeTimeVisible = (item) => {
        if (item.workflowNode === 'BUSINESS_APPROVE' || item.workflowNode === 'EDUCATION_APPROVE') {
            if (item.status === 0) {
                return false;
            }
        }
        return true;
    };

    getVersionName = (versionItem) => {
        if (versionItem) {
            return `${versionItem.systemVersionNumber ? versionItem.systemVersionNumber : ''}${
                versionItem.createType === 0 ? '' : '系统调课'
            } ${versionItem.name}`;
        } else return '';
    };

    setTemporaryTimeValue = (value) => {
        this.setState({
            temporaryTimeValue: value,
        });
    };

    toggleDatePickerModalVisible = () => {
        const { calendarVisible } = this.state;
        this.setState({
            calendarVisible: !calendarVisible,
            temporaryTimeValue: '',
        });
    };

    addLessonButtonClick = () => {
        // this.toggleDatePickerModalVisible();
        const { timeValue } = this.state;
        this.datePickerChange(timeValue);
    };

    getTotalLessonList = (startTime, endTime) => {
        const { dispatch } = this.props;
        this.setState(
            {
                loadingStatus: true,
            },
            () => {
                dispatch({
                    type: 'replace/getTotalLessonList',
                    payload: {
                        startTime,
                        endTime,
                    },
                }).then(() => {
                    this.setState({
                        loadingStatus: false,
                    });
                });
            }
        );
    };

    timeSelectConfirm = () => {
        const { temporaryTimeValue } = this.state;
        this.datePickerChange(temporaryTimeValue);
    };

    returnDatePickerModal = () => {
        const { addLessonList } = this.props;
        this.setState({
            calendarVisible: false,
            lessonListModalVisible: false,
            storageSelectLessonList: [...addLessonList],
        });
    };

    //判断当前时间是否超出课程时间
    /* judgeTimeExceed = (lesson) => {
        return moment().valueOf() > lesson.startTimeMillion;
    }; */

    changeSelectLesson = (item) => {
        const { dispatch, addLessonList } = this.props;
        let addLessonListCopy = [...addLessonList];
        let targetLessonIndex = addLessonListCopy.findIndex(
            (lessonItem) => lessonItem.source?.id === item.source?.id
        );
        if (targetLessonIndex === -1) {
            addLessonListCopy.push({
                source: item,
            });
        }
        dispatch({
            type: 'replace/setAddLessonList',
            payload: addLessonListCopy,
        });
        dispatch({
            type: 'replace/selectCopySendRule',
            payload: {
                resultIdString: addLessonListCopy.map((item) => item.source.id).join(),
            },
        });
    };

    confirmAddLesson = () => {
        const { dispatch } = this.props;
        const { storageSelectLessonList } = this.state;
        dispatch({
            type: 'replace/setAddLessonList',
            payload: storageSelectLessonList,
        });
        dispatch({
            type: 'replace/selectCopySendRule',
            payload: {
                resultIdString: storageSelectLessonList.map((item) => item.source.id).join(),
            },
        });
        this.setState({
            lessonListModalVisible: false,
        });
    };

    setStorageSelectLessonList = (item) => {
        // if (this.judgeTimeExceed(item)) {
        //     return;
        // }
        const { storageSelectLessonList } = this.state;
        let storageSelectLessonListCopy = [...storageSelectLessonList];
        let targetLessonIndex = storageSelectLessonListCopy.findIndex(
            (lessonItem) => lessonItem.source?.id === item.id
        );
        if (targetLessonIndex === -1) {
            storageSelectLessonListCopy.push({
                source: item,
            });
        } else {
            storageSelectLessonListCopy.splice(targetLessonIndex, 1);
        }
        this.setState({
            storageSelectLessonList: storageSelectLessonListCopy,
        });
    };

    //返回课程类型 1: 代课 2：换课 0: 空
    getLessonType = (lessonItem) => {
        if (!isEmpty(lessonItem.selectTeacherItem)) {
            return 1;
        }
        if (!isEmpty(lessonItem.target)) {
            return 2;
        }
        return 0;
    };

    getLineHeight = (index) => {
        let ele = document.getElementById(`userItem${index}`);
        if (ele) {
            return window.getComputedStyle(ele).height.split('p')[0] - 26 + 'px';
        }
    };

    toggleShowRelatedList = () => {
        const { showRelatedList } = this.state;
        this.setState({
            showRelatedList: !showRelatedList,
        });
    };

    scrollToRecordList = () => {
        let recordList = document.querySelector('#recordList');
        if (recordList) {
            recordList.scrollIntoView({ behavior: 'smooth' });
        }
    };

    weekRadioChange = (e) => {
        let value = e.target.value;
        if (value === 1) {
            this.datePickerChange(moment());
        }
        if (value === 2) {
            this.datePickerChange(moment().add(7, 'days'));
        }
    };

    datePickerChange = (timeValue) => {
        const { dispatch, addLessonList } = this.props;
        this.setState(
            {
                timeValue,
            },
            () => {
                const { timeValue } = this.state;
                let startTime = moment(timeValue).startOf('week').valueOf();
                let endTime = moment(timeValue).endOf('week').valueOf() - 999;
                if (startTime === moment().startOf('week').valueOf()) {
                    this.setState({
                        weekRadio: 1,
                    });
                } else if (startTime === moment().add(7, 'days').startOf('week').valueOf()) {
                    this.setState({
                        weekRadio: 2,
                    });
                } else {
                    this.setState({
                        weekRadio: undefined,
                    });
                }
                this.setState({
                    calendarVisible: false,
                    lessonListModalVisible: true,
                    storageSelectLessonList: [...addLessonList],
                });
                this.getTotalLessonList(startTime, endTime);
                dispatch({
                    type: 'replace/setRangePickerTimeList',
                    payload: [startTime, endTime],
                });
            }
        );
    };

    render() {
        const {
            dispatch,
            rightContentType,
            status,
            changeRequest,
            addLessonList,
            contentWrapperLoading,
            ccValue,
            requestRelatedList,
            selectSupportVersion,
            totalLessonList,
            cur,
            currentUser,
            copySendRuleList,
            currentLang,
        } = this.props;
        const {
            calendarVisible,
            lessonListModalVisible,
            loadingStatus,
            storageSelectLessonList,
            showRelatedList,
            weekRadio,
            timeValue,
        } = this.state;
        console.log('changeRequest :>> ', changeRequest);
        console.log('addLessonList :>> ', addLessonList);

        const isApplicationStatus = status === 'application';
        const isVersionStatus = status === 'schoolApproval' || Boolean(changeRequest.status) != 0;
        const isApplicationOrSchoolApprovalStatus =
            status === 'application' || status === 'schoolApproval';
        const UpdateProps = {
            onRemove: (file) => {
                const { dispatch, importSupplementFileList } = this.props;
                const index = importSupplementFileList.indexOf(file);
                const newFileList = importSupplementFileList.slice();
                newFileList.splice(index, 1);
                dispatch({
                    type: 'replace/setImportSupplementFileList',
                    payload: newFileList,
                });
            },
            beforeUpload: (file) => {
                const { dispatch, importSupplementFileList } = this.props;
                dispatch({
                    type: 'replace/setImportSupplementFileList',
                    payload: [...importSupplementFileList, file],
                });
                return false;
            },
            fileList: this.props.importSupplementFileList,
        };
        let selectLessonIdList = storageSelectLessonList.map((item) => item.source?.id);

        return (
            <Spin spinning={contentWrapperLoading}>
                <div className={styles.replaceMobileApplicationWrapper}>
                    <div className={isApplicationStatus ? '' : styles.contentWrapper}>
                        {!isApplicationStatus && (
                            <div className={styles.requestRelated}>
                                <div className={styles.header}>
                                    <div className={styles.top}>
                                        {currentLang === 'cn'
                                            ? `${changeRequest.teacherModel?.name}的调代课申请`
                                            : `${changeRequest.teacherModel?.englishName}'s application`}
                                    </div>
                                    {(requestRelatedList && requestRelatedList.length) > 0 ? (
                                        <span className={styles.bottom}>
                                            <span>
                                                {currentLang === 'cn'
                                                    ? `共${requestRelatedList.length}个关联申请`
                                                    : `There are ${requestRelatedList.length} related applications`}
                                            </span>
                                            <span>
                                                {showRelatedList ? (
                                                    <Icon
                                                        type="down"
                                                        onClick={this.toggleShowRelatedList}
                                                    />
                                                ) : (
                                                    <Icon
                                                        type="up"
                                                        onClick={this.toggleShowRelatedList}
                                                    />
                                                )}
                                            </span>
                                        </span>
                                    ) : (
                                        <span className={styles.bottom}>
                                            <span
                                                color={
                                                    this.getStatusSpan(false, changeRequest.status)
                                                        ?.color
                                                }
                                            >
                                                {
                                                    this.getStatusSpan(false, changeRequest.status)
                                                        ?.title
                                                }
                                                ...
                                            </span>
                                            <span
                                                style={{ cursor: 'pointer' }}
                                                onClick={this.scrollToRecordList}
                                            >
                                                {trans('global.replace.viewProgress', '查看进度')}
                                            </span>
                                        </span>
                                    )}
                                </div>

                                {showRelatedList && (
                                    <div className={styles.requestRelatedList}>
                                        {requestRelatedList.map((item) => {
                                            let isCurrent = item.id === changeRequest.id;
                                            console.log('isCurrent :>> ', isCurrent);
                                            return (
                                                <div
                                                    className={
                                                        styles.relatedItem +
                                                        ' ' +
                                                        (isCurrent
                                                            ? styles.isCurrent
                                                            : styles.notCurrent)
                                                    }
                                                    onClick={() => this.requestRelatedChange(item)}
                                                >
                                                    <span>{item.name}</span>
                                                    <span
                                                        style={{
                                                            color: this.getStatusSpan(
                                                                isCurrent,
                                                                item.status
                                                            ).color,
                                                        }}
                                                    >
                                                        {
                                                            this.getStatusSpan(
                                                                isCurrent,
                                                                item.status
                                                            ).title
                                                        }
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className={styles.itemWrapper}>
                            <div
                                className={
                                    isApplicationStatus ? styles.applicationLabel : styles.editLabel
                                }
                            >
                                {trans('global.replace.backgroundDescription', '背景说明')}
                            </div>
                            {isApplicationStatus ? (
                                <InputItem
                                    placeholder={trans('global.replace.pleaseInput', '请输入')}
                                    onChange={(value) =>
                                        this.setChangeRequest('requestDescription', value)
                                    }
                                    value={changeRequest.requestDescription}
                                />
                            ) : (
                                <div className={styles.editValue}>
                                    {changeRequest.requestDescription}
                                </div>
                            )}
                        </div>
                        <div className={styles.itemWrapper}>
                            <div
                                className={
                                    isApplicationStatus ? styles.applicationLabel : styles.editLabel
                                }
                            >
                                {trans('global.replace.coordinateArrangement', '安排情况')}
                            </div>
                            {isApplicationStatus ? (
                                <List className="my-list">
                                    <List.Item>
                                        <span>
                                            {trans(
                                                'global.replace.haveArrangedWell',
                                                '已自行安排好'
                                            )}
                                        </span>
                                        <Checkbox
                                            checked={changeRequest.arrangeType === 1}
                                            onChange={() => this.setChangeRequest('arrangeType', 1)}
                                        />
                                    </List.Item>
                                    <List.Item>
                                        <span>
                                            {trans('global.replace.needHelp', '需要教务支持')}
                                        </span>
                                        <Checkbox
                                            checked={changeRequest.arrangeType === 2}
                                            onChange={() => this.setChangeRequest('arrangeType', 2)}
                                        />
                                    </List.Item>
                                </List>
                            ) : (
                                <div className={styles.editValue}>
                                    {changeRequest.arrangeType === 1
                                        ? trans('global.replace.haveArrangedWell', '已自行安排好')
                                        : trans('global.replace.needHelp', '需要教务支持')}
                                </div>
                            )}
                        </div>
                        <div className={styles.itemWrapper}>
                            {(isApplicationStatus ||
                                changeRequest.requestSupplement ||
                                !isEmpty(changeRequest.requestAttachmentList)) && (
                                <div
                                    className={
                                        isApplicationStatus
                                            ? styles.applicationLabel
                                            : styles.editLabel
                                    }
                                >
                                    {trans('global.replace.detailedRequirements', '调代课要求')}
                                </div>
                            )}

                            {isApplicationStatus ? (
                                <List className="my-list">
                                    <List.Item>
                                        <InputItem
                                            placeholder={trans(
                                                'global.replace.detailedRequirements.placeHolder',
                                                '请详细填写您的要求，比如期望时间、相关老师等'
                                            )}
                                            onChange={(value) =>
                                                this.setChangeRequest('requestSupplement', value)
                                            }
                                            value={changeRequest.requestSupplement}
                                            style={{ width: '100%' }}
                                        />
                                    </List.Item>
                                    <List.Item>
                                        <Upload {...UpdateProps} className={styles.uploadWrapper}>
                                            <span className={styles.uploadButton}>
                                                <Icon type="paper-clip" />
                                                <span>
                                                    {trans('global.replace.selectFile', '上传文件')}
                                                </span>
                                            </span>
                                        </Upload>
                                    </List.Item>
                                </List>
                            ) : (
                                (changeRequest.requestSupplement ||
                                    !isEmpty(changeRequest.requestAttachmentList)) && (
                                    <div className={styles.editValue}>
                                        {changeRequest.requestSupplement}
                                        {changeRequest.requestAttachmentList?.map((item) => (
                                            <a
                                                className={styles.requestAttachmentItem}
                                                href={item.downloadUrl}
                                            >
                                                {item.fileName}
                                            </a>
                                        ))}
                                    </div>
                                )
                            )}
                        </div>
                        <div className={styles.itemWrapper}>
                            <div
                                className={
                                    isApplicationStatus ? styles.applicationLabel : styles.editLabel
                                }
                            >
                                {trans('global.replace.beRescheduled', '需调代课的课节')}
                            </div>
                            {addLessonList.length > 0 && (
                                <div className={styles.selectedLessonList}>
                                    {addLessonList.map((item, index) => {
                                        let lessonType = this.getLessonType(item);
                                        return (
                                            <div>
                                                <div
                                                    className={
                                                        styles.selectedLessonItem +
                                                        ' ' +
                                                        (this.judgeCourseConflict(item) &&
                                                            styles.conflictLessonItem)
                                                    }
                                                    onClick={() => this.clickLessonItem(item)}
                                                >
                                                    <div className={styles.content}>
                                                        <div className={styles.header}>
                                                            <div className={styles.leftPart}>
                                                                {item.source.studentGroups
                                                                    ?.map((item) =>
                                                                        currentLang === 'cn'
                                                                            ? item.name
                                                                            : item.englishName
                                                                    )
                                                                    .join('、')}
                                                            </div>
                                                            <div className={styles.rightPart}>
                                                                <span>
                                                                    {currentLang === 'cn'
                                                                        ? `周${intoChineseLang(
                                                                              item.source.weekDay
                                                                          )}第${
                                                                              item.source.lesson
                                                                          }节`
                                                                        : `${weekDayAbbreviationEn(
                                                                              item.source.weekDay
                                                                          )} Period ${
                                                                              item.source.lesson
                                                                          }`}
                                                                </span>
                                                                <span>
                                                                    {currentLang === 'cn'
                                                                        ? item.source.courseName
                                                                        : item.source
                                                                              .courseEnglishName}
                                                                </span>
                                                                <span className={styles.lesson}>
                                                                    {moment(
                                                                        item.source.startTimeMillion
                                                                    ).format('MM.DD HH:mm')}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {lessonType !== 0 && (
                                                            <div className={styles.middle}>
                                                                {lessonType === 1 ? (
                                                                    <div
                                                                        className={styles.leftPart}
                                                                    >
                                                                        <span
                                                                            className={
                                                                                styles.replaceIcon
                                                                            }
                                                                        >
                                                                            {trans(
                                                                                'global.replace.substitute',
                                                                                '代课'
                                                                            )}
                                                                        </span>
                                                                        <span
                                                                            className={
                                                                                styles.teacherItem
                                                                            }
                                                                        >
                                                                            <span>
                                                                                {currentLang ===
                                                                                'cn'
                                                                                    ? item
                                                                                          .selectTeacherItem
                                                                                          .teacherName
                                                                                    : item
                                                                                          .selectTeacherItem
                                                                                          .teacherEnName}
                                                                            </span>
                                                                            <span>
                                                                                {trans(
                                                                                    'global.replace.substituteFor',
                                                                                    'Substitute For'
                                                                                )}
                                                                            </span>
                                                                            <span>
                                                                                {status ===
                                                                                'application'
                                                                                    ? currentUser.name
                                                                                    : currentLang ===
                                                                                      'cn'
                                                                                    ? changeRequest
                                                                                          .teacherModel
                                                                                          ?.name
                                                                                    : changeRequest
                                                                                          .teacherModel
                                                                                          ?.englishName}
                                                                            </span>
                                                                        </span>
                                                                    </div>
                                                                ) : lessonType === 2 ? (
                                                                    <div
                                                                        className={styles.leftPart}
                                                                    >
                                                                        <span
                                                                            className={
                                                                                styles.exchangeIcon
                                                                            }
                                                                        >
                                                                            {trans(
                                                                                'global.replace.switch',
                                                                                '调换'
                                                                            )}
                                                                        </span>
                                                                        <div
                                                                            className={
                                                                                styles.exchangeSpan
                                                                            }
                                                                        >
                                                                            <span>
                                                                                {currentLang ===
                                                                                'cn'
                                                                                    ? `周${intoChineseLang(
                                                                                          item
                                                                                              .target
                                                                                              .weekDay
                                                                                      )}第${
                                                                                          item
                                                                                              .target
                                                                                              .lesson
                                                                                      }节`
                                                                                    : `${weekDayAbbreviationEn(
                                                                                          item
                                                                                              .target
                                                                                              .weekDay
                                                                                      )} Period ${
                                                                                          item
                                                                                              .target
                                                                                              .lesson
                                                                                      }`}
                                                                            </span>
                                                                            <span>
                                                                                {currentLang ===
                                                                                'cn'
                                                                                    ? item.target
                                                                                          .courseName
                                                                                    : item.target
                                                                                          .courseEnglishName}
                                                                            </span>
                                                                            <span
                                                                                className={
                                                                                    styles.lesson
                                                                                }
                                                                            >
                                                                                {moment(
                                                                                    item.target
                                                                                        .startTimeMillion
                                                                                ).format(
                                                                                    'MM.DD HH:mm'
                                                                                )}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                ) : null}
                                                                {isApplicationOrSchoolApprovalStatus && (
                                                                    <span
                                                                        className={styles.clickItem}
                                                                        onClick={(e) =>
                                                                            this.resetTeacherOrCourse(
                                                                                e,
                                                                                item
                                                                            )
                                                                        }
                                                                    >
                                                                        {trans(
                                                                            'global.replace.reset',
                                                                            '重设'
                                                                        )}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}

                                                        {isApplicationOrSchoolApprovalStatus &&
                                                            changeRequest.arrangeType === 1 && (
                                                                <div className={styles.footer}>
                                                                    {!lessonType && (
                                                                        <span
                                                                            className={
                                                                                styles.btnWrapper
                                                                            }
                                                                        >
                                                                            <span
                                                                                className={
                                                                                    styles.clickItem
                                                                                }
                                                                                onClick={
                                                                                    this
                                                                                        .searchReplace
                                                                                }
                                                                            >
                                                                                {trans(
                                                                                    'global.replace.search.substitute',
                                                                                    '找人代课'
                                                                                )}
                                                                            </span>
                                                                            <span
                                                                                className={
                                                                                    styles.clickItem
                                                                                }
                                                                                onClick={() =>
                                                                                    this.searchExchange(
                                                                                        item.source
                                                                                    )
                                                                                }
                                                                            >
                                                                                {trans(
                                                                                    'global.replace.search.switch',
                                                                                    '找人调换'
                                                                                )}
                                                                            </span>
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}
                                                    </div>
                                                    {isApplicationStatus && (
                                                        <Icon
                                                            type="close-circle"
                                                            theme="filled"
                                                            className={styles.closeCircle}
                                                            onClick={(e) =>
                                                                this.removeLessonItem(e, index)
                                                            }
                                                        />
                                                    )}
                                                </div>
                                                <span className={styles.conflictMsg}>
                                                    {this.judgeCourseConflict(item)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {isApplicationStatus && (
                                <div className={styles.addLessonButtonWrapper}>
                                    <div
                                        className={styles.addLessonButton}
                                        onClick={this.addLessonButtonClick}
                                    >
                                        <Icon type="plus-circle" />
                                        <span onClick={this.addLesson}>
                                            {trans('global.replace.addLesson', '添加课节')}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {isApplicationStatus && !isEmpty(copySendRuleList) && (
                            <div className={styles.itemWrapper}>
                                <div
                                    className={
                                        isApplicationStatus
                                            ? styles.applicationLabel
                                            : styles.editLabel
                                    }
                                >
                                    {trans('global.replace.copyTo', '抄送')}
                                </div>
                                {this.getCopySendTeacherOrRule('detail')}
                            </div>
                        )}

                        {isVersionStatus && (
                            <div className={styles.itemWrapper}>
                                {(status === 'schoolApproval' ||
                                    (status === 'detail' && changeRequest.changeCourseDetail)) && (
                                    <div className={styles.editLabel}>
                                        {trans('global.replace.arrangement', '调课安排')}
                                    </div>
                                )}

                                {status === 'schoolApproval' && (
                                    <TextareaItem
                                        style={{
                                            borderRadius: 10,
                                        }}
                                        placeholder={trans(
                                            'global.replace.enterDetailedPlan',
                                            '请输入详细调课方案（申请人可见）'
                                        )}
                                        onChange={(value) =>
                                            this.setChangeRequest('changeCourseDetail', value)
                                        }
                                        value={changeRequest.changeCourseDetail}
                                    />
                                )}
                                {status === 'detail' && changeRequest.changeCourseDetail && (
                                    <div className={styles.editValue}>
                                        {changeRequest.changeCourseDetail}
                                    </div>
                                )}
                            </div>
                        )}
                        {isVersionStatus && (
                            <div className={styles.itemWrapper}>
                                <div className={styles.editLabel}>
                                    {trans('global.replace.timetableVersions', '版本')}
                                </div>
                                <div className={styles.editValue}>
                                    <div className={styles.versionList}>
                                        <div className={styles.versionItem}>
                                            <div>{trans('global.replace.before', '调整前')}：</div>
                                            <div>
                                                {status === 'schoolApproval'
                                                    ? this.getVersionName(
                                                          changeRequest.sourceVersion
                                                      )
                                                    : changeRequest.sourceVersion
                                                          ?.systemVersionNumber}
                                            </div>
                                        </div>
                                        <div className={styles.versionItem}>
                                            <div>{trans('global.replace.after', '调整后')}：</div>
                                            {status === 'schoolApproval' ? (
                                                <Select
                                                    placeholder={trans(
                                                        'global.replace.selectVersion',
                                                        '请选择调整后课表版本'
                                                    )}
                                                    disabled={changeRequest.arrangeType === 1}
                                                    value={changeRequest.changeVersion?.id}
                                                    onChange={(value) =>
                                                        this.setChangeRequest(
                                                            'changeVersion',
                                                            selectSupportVersion.find(
                                                                (item) => item.id === value
                                                            )
                                                        )
                                                    }
                                                    style={{ minWidth: 200, maxWidth: 280 }}
                                                    dropdownMatchSelectWidth={false}
                                                    dropdownStyle={{ maxWidth: 280 }}
                                                >
                                                    {selectSupportVersion.map((item) => (
                                                        <Option key={item.id} value={item.id}>
                                                            {this.getVersionName(item)}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            ) : (
                                                <div>
                                                    {
                                                        changeRequest.changeVersion
                                                            ?.systemVersionNumber
                                                    }
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {!isApplicationStatus && !isEmpty(changeRequest.recordList) && (
                            <div className={styles.itemWrapper} id="recordList">
                                <div className={styles.editLabel}>
                                    {trans('global.replace.approvalProgress', '审批进度')}
                                </div>
                                <div className={styles.editValue}>
                                    <div className={styles.steps}>
                                        <div className={styles.lines}>
                                            <div className={styles.lineItem}>
                                                {changeRequest.recordList.map((item, index) => {
                                                    if (
                                                        index ===
                                                        changeRequest.recordList.length - 1
                                                    ) {
                                                        return (
                                                            <span
                                                                className={styles.icon}
                                                                style={{
                                                                    backgroundColor:
                                                                        this.getRecordIconColor(
                                                                            item
                                                                        ),
                                                                }}
                                                            ></span>
                                                        );
                                                    } else {
                                                        return (
                                                            <Fragment>
                                                                <span
                                                                    className={styles.icon}
                                                                    style={{
                                                                        backgroundColor:
                                                                            this.getRecordIconColor(
                                                                                item
                                                                            ),
                                                                    }}
                                                                ></span>
                                                                <div
                                                                    className={styles.line}
                                                                    style={{
                                                                        height: this.getLineHeight(
                                                                            index
                                                                        ),
                                                                        backgroundColor:
                                                                            this.getRecordLineColor(
                                                                                item
                                                                            ),
                                                                    }}
                                                                ></div>
                                                            </Fragment>
                                                        );
                                                    }
                                                })}
                                            </div>
                                        </div>
                                        <div className={styles.users}>
                                            {changeRequest.recordList.map((item, index) => (
                                                <div
                                                    className={styles.userItem}
                                                    id={`userItem${index}`}
                                                >
                                                    {item.type === 5 ? (
                                                        <span
                                                            className={styles.singleLeftContent}
                                                            style={{
                                                                backgroundColor: '#f5f6f7',
                                                            }}
                                                        ></span>
                                                    ) : item.approveUserList.length > 1 ? (
                                                        <div className={styles.leftContent}>
                                                            {item.approveUserList
                                                                .slice(0, 4)
                                                                .map((userItem) => (
                                                                    <img
                                                                        className={
                                                                            styles.leftContentItem
                                                                        }
                                                                        src={userItem.avatar}
                                                                    ></img>
                                                                ))}
                                                        </div>
                                                    ) : (
                                                        <img
                                                            className={styles.singleLeftContent}
                                                            src={item.approveUserList[0]?.avatar}
                                                        ></img>
                                                    )}

                                                    <div className={styles.rightContent}>
                                                        {(item.type !== 5 || item.status == 3) && (
                                                            <span className={styles.name}>
                                                                {item.approveUserList
                                                                    .map((userItem) =>
                                                                        currentLang === 'cn'
                                                                            ? userItem.name
                                                                            : userItem.englishName
                                                                    )
                                                                    .join('  ')}
                                                            </span>
                                                        )}
                                                        {item.remark &&
                                                            item.type !== 5 &&
                                                            (item.remark.length > 30 ? (
                                                                <Tooltip title={item.remark}>
                                                                    <span className={styles.remark}>
                                                                        {`${item.remark.slice(
                                                                            0,
                                                                            30
                                                                        )}...`}
                                                                    </span>
                                                                </Tooltip>
                                                            ) : (
                                                                <span className={styles.remark}>
                                                                    {item.remark}
                                                                </span>
                                                            ))}
                                                        <span
                                                            className={styles.statusString}
                                                            style={{
                                                                color: this.getRecordTextColor(
                                                                    item
                                                                ),
                                                            }}
                                                        >
                                                            {this.getStatusString(item, index)}
                                                        </span>
                                                        {this.judgeTimeVisible(item) && (
                                                            <span className={styles.time}>
                                                                {moment(item.modifyTime).format(
                                                                    'YYYY.MM.DD HH:mm'
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <BottomBtn currentLang={currentLang} />
                    <Calendar
                        locale={zhCN}
                        type="one"
                        visible={calendarVisible}
                        defaultValue={[new Date(timeValue)]}
                        minDate={new Date(+new Date(timeValue) - 5184000000)}
                        maxDate={new Date(+new Date(timeValue) + 31536000000)}
                        // prefixCls={styles.datePickerModal}
                        renderHeader={() => (
                            <div className={styles.calendarHeader}>
                                <span
                                    className={styles.left}
                                    onClick={this.toggleDatePickerModalVisible}
                                >
                                    取消
                                </span>
                                <span className={styles.middle}>选择时间范围</span>
                                <span className={styles.right} onClick={this.timeSelectConfirm}>
                                    确定
                                </span>
                            </div>
                        )}
                        onSelect={this.setTemporaryTimeValue}
                        currentLang={currentLang}
                    />
                    <Modal
                        title={
                            <Fragment>
                                {/* <span onClick={this.returnDatePickerModal}>返回</span>
                                <span>选择课节</span>
                                <span className={styles.right} onClick={this.confirmAddLesson}>
                                    确认
                                </span> */}
                                <Radio.Group
                                    onChange={this.weekRadioChange}
                                    value={weekRadio}
                                    // disabled={addLessonList.length}
                                >
                                    <Radio.Button value={1}>
                                        {trans('global.replace.thisWeek', '本周')}
                                    </Radio.Button>
                                    <Radio.Button value={2}>
                                        {trans('global.replace.nextWeek', '下周')}
                                    </Radio.Button>
                                </Radio.Group>
                                <div
                                    className={styles.timeRange}
                                    onClick={this.toggleDatePickerModalVisible}
                                >
                                    <span>
                                        {moment(timeValue).startOf('week').format('YYYY.MM.DD')}-
                                        {moment(timeValue).endOf('week').format('MM-DD')}
                                    </span>
                                    <Icon type="calendar" />
                                </div>
                            </Fragment>
                        }
                        // popup
                        visible={lessonListModalVisible}
                        // animationType="slide-up"
                        wrapClassName={styles.lessonListModal}
                    >
                        <Spin spinning={loadingStatus}>
                            <div className={styles.addLessonListWrapper}>
                                <div className={styles.addLessonList}>
                                    {totalLessonList.map((item) => (
                                        <div
                                            className={styles.addLessonItem}
                                            key={item.id}
                                            onClick={() => this.setStorageSelectLessonList(item)}
                                        >
                                            <div className={styles.lessonMsg}>
                                                <div className={styles.time}>
                                                    <span>
                                                        {currentLang === 'cn'
                                                            ? `周${intoChineseLang(
                                                                  item.weekDay
                                                              )}第${item.courseSort}节`
                                                            : `${weekDayAbbreviationEn(
                                                                  item.weekDay
                                                              )} Period ${item.courseSort}`}
                                                    </span>
                                                    <span className={styles.lesson}>
                                                        (
                                                        {moment(item.startTimeMillion).format(
                                                            'YYYY.MM.DD HH:mm'
                                                        )}
                                                        )
                                                    </span>
                                                </div>
                                                <div className={styles.class}>
                                                    <div className={styles.studentGroups}>
                                                        {item.studentGroups
                                                            .map((item) =>
                                                                currentLang === 'cn'
                                                                    ? item.name
                                                                    : item.englishName
                                                            )
                                                            .join('、')}
                                                    </div>
                                                    <span>
                                                        {currentLang === 'cn'
                                                            ? item.courseName
                                                            : item.courseEnglishName}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={styles.rightPart}>
                                                <Checkbox
                                                    onChange={() =>
                                                        this.setStorageSelectLessonList(item)
                                                    }
                                                    checked={selectLessonIdList.includes(item.id)}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.applicationBtnWrapper}>
                                    <div className={styles.applicationBtn}>
                                        <div
                                            className={styles.cancelBtn}
                                            onClick={this.returnDatePickerModal}
                                        >
                                            {trans('global.cancel', '取消')}
                                        </div>
                                        <div
                                            className={styles.submitBtn}
                                            onClick={this.confirmAddLesson}
                                        >
                                            {trans('global.confirm', '确定')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Spin>
                    </Modal>
                </div>
            </Spin>
        );
    }
}
export default withRouter(Application);
