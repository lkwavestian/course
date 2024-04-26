import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import SearchReplace from './SearchReplace';
import SearchExchange from './SearchExchange';
import AddLesson from './AddLesson';
import Calendar from './Calendar';
import styles from './index.less';
import {
    Input,
    Radio,
    Button,
    Checkbox,
    Upload,
    Icon,
    Spin,
    Select,
    message,
    Tooltip,
    Modal,
} from 'antd';
import { isEmpty } from 'lodash';
import { getUrlSearch, intoChineseLang, weekDayAbbreviationEn } from '../../../utils/utils';
import moment from 'moment';
import { withRouter } from 'dva/router';
import { trans, locale } from '../../../utils/i18n';

const { TextArea } = Input;
const { Option } = Select;

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
}))
class Content extends PureComponent {
    state = {
        clickStudentGroupId: '',
        calendarModalVisible: false,
    };

    componentDidMount() {
        console.log('replaceApplication Content componentDid');
        this.initData();
        this.getDetailData();
    }

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
        //清空右侧内容
        dispatch({
            type: 'replace/setRightContentType',
            payload: '',
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

        //根据鉴权结果设置status
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

        //只有在业务审批的时候执行下面逻辑
        //如果没有changeVersion，请求版本列表，并且取selectSupportVersion的lastPublish项
        //安排方式为自行安排时，调课后版本为最新公布版本，只读
        //安排方式为教务支持时，选项默认为当前课表版本
        const { changeRequest, status: currentStatus } = this.props;
        const isVersionStatus = currentStatus === 'schoolApproval';
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
        const { dispatch } = this.props;
        dispatch({
            type: 'replace/setRightContentType',
            payload: 'searchReplace',
        });
    };
    searchExchange = async (source) => {
        const { dispatch } = this.props;
        if (source.studentGroups.length > 1) {
            message.info('合班课暂不支持自行换课，请选择需要教务支持');
            return;
        }
        dispatch({
            type: 'replace/setRightContentType',
            payload: 'searchExchange',
        });
        await dispatch({
            type: 'replace/changeSearchExchangeLoading',
            payload: true,
        });
        await dispatch({
            type: 'replace/findClassSchedule',
            payload: {
                id: source.versionId,
                groupIds: source.studentGroups.map((item) => item.id),
            },
        });
        await dispatch({
            type: 'replace/getNewListExchange',
            payload: {
                studentGroupId: source.studentGroups[0].id,
                versionId: source.versionId,
                resultId: source.id,
                changeCourse: true,
            },
        });
        await dispatch({
            type: 'replace/changeSearchExchangeLoading',
            payload: false,
        });
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
        this.setState({
            clickStudentGroupId: item.source.studentGroups[0].id,
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

    getStatusSpan = (status) => {
        let mapObj = {
            0: trans('global.replace.pending', '待审批'),
            1: trans('global.replace.completed', '动课完成'),
            2: trans('global.replace.rejected', '审批拒绝'),
            3: trans('global.replace.canceled', '已撤销'),
            4: trans('global.replace.processing', '教务处理'),
        };
        return mapObj[status];
    };

    requestRelatedChange = async (item) => {
        const { history } = this.props;
        history.push(`/replace/index/application?requestId=${item.id}`);
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

    getLineHeight = (index) => {
        let height = '0px';
        let ele = document.getElementById(`userItem${index}`);
        if (ele) {
            height = window.getComputedStyle(ele).height.split('p')[0] - 26 + 'px';
        } else {
            this.forceUpdate();
        }
        return height;
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

    changeCalendarModalVisible = () => {
        const { calendarModalVisible } = this.state;
        this.setState({
            calendarModalVisible: !calendarModalVisible,
        });
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
            copySendRuleList,
            currentLang,
        } = this.props;
        const { clickStudentGroupId, calendarModalVisible } = this.state;
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
        return (
            <Spin spinning={contentWrapperLoading} wrapperClassName={styles.contentWrapperLoading}>
                <div className={styles.contentWrapper}>
                    <div className={styles.leftContentWrapper}>
                        <div className={styles.mainContent}>
                            <div className={styles.backgroundNote}>
                                <div className={styles.title}>
                                    <span className={styles.text}>
                                        {trans('global.replace.backgroundDescription', '背景说明')}
                                    </span>
                                    {isApplicationStatus && <span className={styles.icon}>*</span>}
                                </div>
                                {isApplicationStatus ? (
                                    <TextArea
                                        style={{ width: 400, height: 40, borderRadius: 5 }}
                                        placeholder={trans('global.replace.pleaseInput', '请输入')}
                                        onChange={(e) =>
                                            this.setChangeRequest(
                                                'requestDescription',
                                                e.target.value
                                            )
                                        }
                                    />
                                ) : (
                                    <span className={styles.detailMsg}>
                                        {changeRequest.requestDescription}
                                    </span>
                                )}
                            </div>
                            <div className={styles.arrangement}>
                                <div className={styles.title}>
                                    <span className={styles.text}>
                                        {trans('global.replace.coordinateArrangement', '安排情况')}
                                    </span>
                                    {isApplicationStatus && <span className={styles.icon}>*</span>}
                                </div>
                                {status === 'application' ? (
                                    <Radio.Group
                                        onChange={(e) =>
                                            this.setChangeRequest('arrangeType', e.target.value)
                                        }
                                        value={changeRequest.arrangeType}
                                    >
                                        <Radio value={1}>
                                            {trans(
                                                'global.replace.haveArrangedWell',
                                                '已自行安排好'
                                            )}
                                        </Radio>
                                        <Radio value={2}>
                                            {trans('global.replace.needHelp', '需要教务支持')}
                                        </Radio>
                                    </Radio.Group>
                                ) : (
                                    <span className={styles.detailMsg}>
                                        {changeRequest.arrangeType === 1
                                            ? trans(
                                                  'global.replace.haveArrangedWell',
                                                  '已自行安排好'
                                              )
                                            : trans('global.replace.needHelp', '需要教务支持')}
                                    </span>
                                )}
                            </div>
                            <div className={styles.supplementLesson}>
                                {(changeRequest.requestSupplement ||
                                    !isEmpty(changeRequest.requestAttachmentList) ||
                                    isApplicationStatus) && (
                                    <div className={styles.title}>
                                        <span className={styles.text}>
                                            {trans(
                                                'global.replace.detailedRequirements',
                                                '调代课要求'
                                            )}
                                        </span>
                                        {isApplicationStatus && changeRequest.arrangeType === 2 && (
                                            <span className={styles.icon}>*</span>
                                        )}
                                    </div>
                                )}

                                {isApplicationStatus ? (
                                    <TextArea
                                        style={{ width: 400, height: 80, borderRadius: 8 }}
                                        placeholder={trans(
                                            'global.replace.detailedRequirements.placeHolder',
                                            '请详细填写您的要求，比如期望时间、相关老师等'
                                        )}
                                        onChange={(e) =>
                                            this.setChangeRequest(
                                                'requestSupplement',
                                                e.target.value
                                            )
                                        }
                                    />
                                ) : (
                                    changeRequest.requestSupplement && (
                                        <span className={styles.detailMsg}>
                                            {changeRequest.requestSupplement}
                                        </span>
                                    )
                                )}
                                {isApplicationStatus ? (
                                    <Upload {...UpdateProps} className={styles.uploadWrapper}>
                                        <span className={styles.uploadButton}>
                                            {trans('global.replace.selectFile', '上传文件')}
                                        </span>
                                    </Upload>
                                ) : (
                                    <div className={styles.requestAttachmentList}>
                                        {changeRequest.requestAttachmentList?.map((item) => (
                                            <a
                                                className={styles.requestAttachmentItem}
                                                href={item.downloadUrl}
                                            >
                                                {item.fileName}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className={styles.addLesson}>
                                <div className={styles.title}>
                                    <span className={styles.text}>
                                        {trans('global.replace.beRescheduled', '需调代课的课节')}
                                    </span>
                                    {isApplicationStatus && <span className={styles.icon}>*</span>}
                                </div>
                                {isApplicationStatus && (
                                    <div
                                        className={styles.addLessonButtonWrapper}
                                        style={{ width: currentLang === 'cn' ? 85 : 120 }}
                                    >
                                        <div className={styles.addLessonButton}>
                                            <span className={styles.icon}>+</span>
                                            <span onClick={this.addLesson}>
                                                {trans('global.replace.addLesson', '添加课节')}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                <div className={styles.addLessonList}>
                                    {addLessonList.map((item, index) => (
                                        <div>
                                            <div
                                                className={
                                                    styles.addLessonItem +
                                                    ' ' +
                                                    (item.isSelected && styles.selectedLessonItem) +
                                                    ' ' +
                                                    (this.judgeCourseConflict(item) &&
                                                        styles.conflictLessonItem)
                                                }
                                                onClick={() => this.clickLessonItem(item)}
                                            >
                                                {/* 左侧source部分 */}
                                                <div className={styles.leftPart}>
                                                    <div className={styles.time}>
                                                        <span>
                                                            {currentLang === 'cn'
                                                                ? `周${intoChineseLang(
                                                                      item.source.weekDay
                                                                  )}第${item.source.courseSort}节`
                                                                : `${weekDayAbbreviationEn(
                                                                      item.source.weekDay
                                                                  )} Period ${
                                                                      item.source.courseSort
                                                                  }`}
                                                        </span>
                                                        <span className={styles.lesson}>
                                                            (
                                                            {moment(
                                                                item.source.startTimeMillion
                                                            ).format('YYYY.MM.DD HH:mm')}
                                                            )
                                                        </span>
                                                    </div>
                                                    <div className={styles.class}>
                                                        <Tooltip
                                                            title={item.source.studentGroups
                                                                ?.map((item) =>
                                                                    currentLang === 'cn'
                                                                        ? item.name
                                                                        : item.englishName
                                                                )
                                                                .join('、')}
                                                        >
                                                            <div className={styles.studentGroups}>
                                                                {item.source.studentGroups
                                                                    ?.map((item) =>
                                                                        currentLang === 'cn'
                                                                            ? item.name
                                                                            : item.englishName
                                                                    )
                                                                    .join('、')}
                                                            </div>
                                                        </Tooltip>

                                                        <span>
                                                            {currentLang === 'cn'
                                                                ? item.source.courseName
                                                                : item.source.courseEnglishName}
                                                        </span>
                                                    </div>
                                                </div>
                                                {/* 右侧部分 */}
                                                {changeRequest.arrangeType !== 2 &&
                                                    (!isEmpty(item.selectTeacherItem) ? (
                                                        /* 右侧代课老师 */
                                                        <div className={styles.rightPartTeacher}>
                                                            <span
                                                                className={
                                                                    styles.rightPartTeacherTitle
                                                                }
                                                            >
                                                                {trans(
                                                                    'global.replace.list.theSubstitute',
                                                                    '代课教师'
                                                                )}
                                                            </span>
                                                            <div className={styles.bottomPart}>
                                                                <span
                                                                    className={
                                                                        styles.rightPartTeacherName
                                                                    }
                                                                >
                                                                    {currentLang === 'cn'
                                                                        ? item.selectTeacherItem
                                                                              .teacherName
                                                                        : item.selectTeacherItem
                                                                              .teacherEnName}
                                                                </span>
                                                                {isApplicationOrSchoolApprovalStatus && (
                                                                    <span
                                                                        className={
                                                                            styles.resetTeacher
                                                                        }
                                                                        onClick={(e) =>
                                                                            this.resetTeacherOrCourse(
                                                                                e,
                                                                                item
                                                                            )
                                                                        }
                                                                        style={{
                                                                            cursor: 'pointer',
                                                                        }}
                                                                    >
                                                                        {trans(
                                                                            'global.replace.reset',
                                                                            '重设'
                                                                        )}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ) : !isEmpty(item.target) ? (
                                                        /* 右侧交换课节 */
                                                        <Fragment>
                                                            <div className={styles.middlePart}>
                                                                <div className={styles.doubleArrow}>
                                                                    <div
                                                                        className={
                                                                            styles.leftTriangle
                                                                        }
                                                                    ></div>
                                                                    <div
                                                                        className={
                                                                            styles.connectLines
                                                                        }
                                                                    ></div>
                                                                    <div
                                                                        className={
                                                                            styles.rightTriangle
                                                                        }
                                                                    ></div>
                                                                </div>
                                                                {isApplicationOrSchoolApprovalStatus && (
                                                                    <span
                                                                        className={
                                                                            styles.resetCourse
                                                                        }
                                                                        onClick={(e) =>
                                                                            this.resetTeacherOrCourse(
                                                                                e,
                                                                                item
                                                                            )
                                                                        }
                                                                        style={{
                                                                            cursor: 'pointer',
                                                                        }}
                                                                    >
                                                                        {trans(
                                                                            'global.replace.reset',
                                                                            '重设'
                                                                        )}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <div className={styles.leftPart}>
                                                                <div className={styles.time}>
                                                                    <span>
                                                                        {currentLang === 'cn'
                                                                            ? `周${intoChineseLang(
                                                                                  item.target
                                                                                      .weekDay
                                                                              )}第${
                                                                                  item.target
                                                                                      .courseSort
                                                                              }节`
                                                                            : `${weekDayAbbreviationEn(
                                                                                  item.target
                                                                                      .weekDay
                                                                              )} Period ${
                                                                                  item.target
                                                                                      .courseSort
                                                                              }`}
                                                                    </span>
                                                                    <span className={styles.lesson}>
                                                                        (
                                                                        {moment(
                                                                            item.target
                                                                                .startTimeMillion
                                                                        ).format(
                                                                            'YYYY.MM.DD HH:mm'
                                                                        )}
                                                                        )
                                                                    </span>
                                                                </div>
                                                                <div className={styles.class}>
                                                                    <Tooltip
                                                                        title={item.target.studentGroups
                                                                            ?.map((item) =>
                                                                                currentLang === 'cn'
                                                                                    ? item.name
                                                                                    : item.englishName
                                                                            )
                                                                            .join('、')}
                                                                    >
                                                                        <div
                                                                            className={
                                                                                styles.studentGroups
                                                                            }
                                                                        >
                                                                            {item.target.studentGroups
                                                                                ?.map((item) =>
                                                                                    currentLang ===
                                                                                    'cn'
                                                                                        ? item.name
                                                                                        : item.englishName
                                                                                )
                                                                                .join('、')}
                                                                        </div>
                                                                    </Tooltip>
                                                                    <span>
                                                                        {currentLang === 'cn'
                                                                            ? item.target.courseName
                                                                            : item.target
                                                                                  .courseEnglishName}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </Fragment>
                                                    ) : (
                                                        /* 右侧操作部分 */
                                                        <div className={styles.rightPartEmpty}>
                                                            <span
                                                                onClick={this.searchReplace}
                                                                style={{ cursor: 'pointer' }}
                                                            >
                                                                {trans(
                                                                    'global.replace.search.substitute',
                                                                    '找人代课'
                                                                )}
                                                            </span>
                                                            <span
                                                                onClick={() =>
                                                                    this.searchExchange(item.source)
                                                                }
                                                                style={{ cursor: 'pointer' }}
                                                            >
                                                                {trans(
                                                                    'global.replace.search.switch',
                                                                    '找人换课'
                                                                )}
                                                            </span>
                                                        </div>
                                                    ))}
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
                                    ))}
                                </div>
                            </div>

                            {isApplicationStatus && !isEmpty(copySendRuleList) && (
                                <div className={styles.cc}>
                                    <div className={styles.title}>
                                        <span className={styles.text}>
                                            {trans('global.replace.copyTo', '抄送')}
                                        </span>
                                    </div>
                                    {this.getCopySendTeacherOrRule('detail')}
                                </div>
                            )}
                        </div>
                        {isVersionStatus && (
                            <div className={styles.scheduleVersion}>
                                <div className={styles.version}>
                                    <div className={styles.title}>
                                        {trans('global.replace.timetableVersions', '版本')}
                                    </div>
                                    <div className={styles.versionList}>
                                        <div className={styles.versionItem}>
                                            <div className={styles.versionTitle}>
                                                {trans('global.replace.before', '调整前')}
                                            </div>
                                            <div className={styles.versionName}>
                                                {status === 'schoolApproval'
                                                    ? this.getVersionName(
                                                          changeRequest.sourceVersion
                                                      )
                                                    : changeRequest.sourceVersion
                                                          ?.systemVersionNumber}
                                            </div>
                                        </div>
                                        <div className={styles.versionItem}>
                                            <div className={styles.versionTitle}>
                                                {trans('global.replace.after', '调整后')}
                                            </div>
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
                                                    style={{ minWidth: 300 }}
                                                    dropdownMatchSelectWidth={false}
                                                    dropdownStyle={{ minWidth: 300 }}
                                                >
                                                    {selectSupportVersion.map((item) => (
                                                        <Option key={item.id} value={item.id}>
                                                            {this.getVersionName(item)}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            ) : (
                                                <div className={styles.versionName}>
                                                    {
                                                        changeRequest.changeVersion
                                                            ?.systemVersionNumber
                                                    }
                                                </div>
                                            )}
                                        </div>
                                        {status === 'schoolApproval' ? (
                                            <TextArea
                                                style={{
                                                    width: 400,
                                                    height: 60,
                                                    borderRadius: 5,
                                                }}
                                                placeholder={trans(
                                                    'global.replace.enterDetailedPlan',
                                                    '请输入详细调课方案（申请人可见）'
                                                )}
                                                onChange={(e) =>
                                                    this.setChangeRequest(
                                                        'changeCourseDetail',
                                                        e.target.value
                                                    )
                                                }
                                                value={changeRequest.changeCourseDetail}
                                            />
                                        ) : status === 'detail' &&
                                          changeRequest.changeCourseDetail ? (
                                            <div className={styles.versionItem}>
                                                <div className={styles.versionTitle}>
                                                    详细调课方案
                                                </div>
                                                <div className={styles.versionName}>
                                                    {changeRequest.changeCourseDetail}
                                                </div>
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        {!isApplicationStatus && (
                            <div className={styles.progress}>
                                <div className={styles.title}>
                                    {trans('global.replace.approvalProgress', '审批进度')}
                                </div>
                                {!isEmpty(changeRequest.recordList) && (
                                    <Fragment>
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
                                                                src={
                                                                    item.approveUserList[0]?.avatar
                                                                }
                                                            ></img>
                                                        )}

                                                        <div className={styles.rightContent}>
                                                            {(item.type !== 5 ||
                                                                item.status == 3) && (
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
                                                                        <span
                                                                            className={
                                                                                styles.remark
                                                                            }
                                                                        >
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
                                    </Fragment>
                                )}
                            </div>
                        )}
                    </div>
                    {rightContentType === 'searchReplace' ? (
                        <SearchReplace
                            clickStudentGroupId={clickStudentGroupId}
                            changeCalendarModalVisible={this.changeCalendarModalVisible}
                            currentLang={currentLang}
                        />
                    ) : rightContentType === 'searchExchange' ? (
                        <SearchExchange
                            clickStudentGroupId={clickStudentGroupId}
                            changeCalendarModalVisible={this.changeCalendarModalVisible}
                            currentLang={currentLang}
                        />
                    ) : rightContentType === 'addLesson' ? (
                        <AddLesson currentLang={currentLang} />
                    ) : null}
                    {!isApplicationStatus && requestRelatedList.length > 0 && (
                        <div className={styles.requestRelatedList}>
                            <div className={styles.header}>
                                {currentLang === 'cn'
                                    ? `本次动课涉及到${requestRelatedList.length}个关联申请`
                                    : `There are ${requestRelatedList.length} related applications`}
                            </div>
                            <div className={styles.list}>
                                {requestRelatedList.map((item) => (
                                    <div
                                        className={styles.listItem}
                                        onClick={() => this.requestRelatedChange(item)}
                                        style={{
                                            color:
                                                changeRequest.id === item.id
                                                    ? 'rgba(4, 69, 252, 0.85)'
                                                    : 'rgba(1, 17, 61, 0.85)',
                                        }}
                                    >
                                        <span>{item.name}</span>
                                        <span>{this.getStatusSpan(item.status)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {calendarModalVisible && (
                        <Modal
                            visible={calendarModalVisible}
                            getContainer={false}
                            wrapClassName={styles.calendarWrapper}
                            centered={true}
                        >
                            <Calendar
                                changeCalendarModalVisible={this.changeCalendarModalVisible}
                                currentLang={currentLang}
                            />
                        </Modal>
                    )}
                </div>
            </Spin>
        );
    }
}
export default withRouter(Content);
