import React, { Fragment, PureComponent } from 'react';
import { withRouter } from 'dva/router';

import styles from './index.less';
import { Button, message, Input, Modal, Icon, Row, Col, Select } from 'antd';
import { connect } from 'dva';
import { isEmpty } from 'lodash';

import { getUrlSearch } from '../../../utils/utils';
import SimpleModal from '../../CommonModal/SimpleModal';
import { trans } from '../../../utils/i18n';

const { TextArea } = Input;
@connect((state) => ({
    changeRequest: state.replace.changeRequest,
    status: state.replace.status,
    importSupplementUrlList: state.replace.importSupplementUrlList,
    importSupplementFileList: state.replace.importSupplementFileList,
    addLessonList: state.replace.addLessonList,
    rangePickerTimeList: state.replace.rangePickerTimeList,
    copySendRuleList: state.replace.copySendRuleList,
    ccValue: state.replace.ccValue,
    contentWrapperLoading: state.replace.contentWrapperLoading,
    approveCheck: state.replace.approveCheck,
    submitResultId: state.replace.submitResultId,
    currentUser: state.replace.currentUser,
    selectSupportVersion: state.replace.selectSupportVersion,
    checkChangeCoursePermission: state.replace.checkChangeCoursePermission,
    noProcessingRequiredModalVisible: state.replace.noProcessingRequiredModalVisible,
}))
class Header extends PureComponent {
    state = {
        businessApprovalModalVisible: false,
        schoolApprovalModalVisible: false,
        revokeModalVisible: false,
        businessApprovalModalBtnType: 'cancel',
        businessApprovalRemark: '',
        schoolApproveRemark: '',
        revokeRemark: '',
        confirmModalVisible: false,
    };

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'replace/getCurrentUser',
        });
    }

    //调代课申请提交
    submitChangeRequest = async () => {
        let {
            dispatch,
            changeRequest,
            importSupplementFileList,
            addLessonList,
            rangePickerTimeList,
        } = this.props;

        //提交之前校验
        let { necessary, msg } = this.judgeNecessary();
        if (!necessary) {
            msg && message.error(msg);
            return;
        }
        await dispatch({
            type: 'replace/changeContentWrapperLoading',
            payload: true,
        });
        if (!isEmpty(importSupplementFileList)) {
            await Promise.all(
                importSupplementFileList.map((file) => {
                    const formData = new FormData();
                    formData.append('files', file);
                    return dispatch({
                        type: 'replace/importSupplement',
                        payload: formData,
                    });
                })
            );
        }
        const { importSupplementUrlList } = this.props;
        await dispatch({
            type: 'replace/submitChangeRequest',
            payload: {
                startTime: rangePickerTimeList[0],
                endTime: rangePickerTimeList[1],
                requestAttachmentList: importSupplementUrlList,
                changeScheduleResultDTOList: addLessonList.map((item) => {
                    let { versionId, id: sourceResultId } = item.source;
                    let resultObj;
                    if (changeRequest.arrangeType === 1) {
                        resultObj = {
                            versionId,
                            sourceResultId,
                            targetResultId: item.target?.id,
                            actingTeacherIdList: item.selectTeacherItem
                                ? [item.selectTeacherItem.teacherId]
                                : undefined,
                        };
                    }
                    if (changeRequest.arrangeType === 2) {
                        resultObj = {
                            versionId,
                            sourceResultId,
                        };
                    }

                    return JSON.parse(JSON.stringify(resultObj));
                }),
                ...this.getCopySendTeacherOrRule('value'),
                ...changeRequest,
            },
            onSuccess: async (setSubmitResultIdResponse) => {
                message.success('提交成功');
                await dispatch({
                    type: 'replace/setSubmitResultId',
                    payload: setSubmitResultIdResponse,
                });
                await this.getChangeRequestDetail();
                await dispatch({
                    type: 'replace/setStatus',
                    payload: 'detail',
                    // payload: 'businessApproval',
                    // payload: 'schoolApproval',
                });
                await dispatch({
                    type: 'replace/setRightContentType',
                    payload: '',
                });
                await dispatch({
                    type: 'replace/emptyImportSupplementUrlList',
                    payload: [],
                });
            },
        });

        await dispatch({
            type: 'replace/changeContentWrapperLoading',
            payload: false,
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

    getHeader = () => {
        const { status, contentWrapperLoading, changeRequest, checkChangeCoursePermission } =
            this.props;
        if (status === 'application') {
            return (
                <Fragment>
                    <span className={styles.titleWrapper}>
                        <Icon
                            type="close"
                            className={styles.icon}
                            onClick={this.toApplicationListPage}
                        />
                        <span className={styles.titleText}>
                            {trans('global.replace.submitApplication', '申请调代课')}
                        </span>
                    </span>
                    <Button
                        type="primary"
                        className={styles.confirmBtn}
                        onClick={this.submitChangeRequest}
                        loading={contentWrapperLoading}
                    >
                        {trans('global.replace.header.submit', '提交')}
                    </Button>
                </Fragment>
            );
        }
        if (status === 'detail') {
            return (
                <Fragment>
                    {this.getTitle()}
                    {this.judgeRevokeButtonVisible() ? (
                        <Button
                            type="primary"
                            className={styles.confirmBtn}
                            onClick={() => {
                                this.setState({
                                    revokeModalVisible: true,
                                });
                            }}
                            loading={contentWrapperLoading}
                        >
                            {trans('global.replace.header.withdraw', '撤销申请')}
                        </Button>
                    ) : checkChangeCoursePermission ? (
                        <Button
                            type="primary"
                            className={styles.confirmBtn}
                            onClick={this.toSchoolApproval}
                            loading={contentWrapperLoading}
                        >
                            {trans('global.replace.header.handleNow', '教务提前处理')}
                        </Button>
                    ) : (
                        <span className={styles.reviewedText}>
                            {this.getStatusSpan(changeRequest.status)}
                        </span>
                    )}
                </Fragment>
            );
        }
        if (status === 'businessApproval') {
            return (
                <Fragment>
                    {this.getTitle()}
                    <span className={styles.btnWrapper}>
                        <Button
                            className={styles.cancelBtn}
                            onClick={() => {
                                this.judgeModalVisible('businessApprovalModalVisible', true);
                                this.setState({
                                    businessApprovalModalBtnType: 'cancel',
                                });
                            }}
                        >
                            {trans('global.replace.pc.refuse', '拒 绝')}
                        </Button>
                        <Button
                            type="primary"
                            className={styles.confirmBtn}
                            onClick={() => {
                                this.judgeModalVisible('businessApprovalModalVisible', true);
                                this.setState({
                                    businessApprovalModalBtnType: 'confirm',
                                });
                            }}
                        >
                            {trans('global.replace.agree', '同意')}
                        </Button>
                    </span>
                </Fragment>
            );
        }
        if (status === 'schoolApproval') {
            return (
                <Fragment>
                    {this.getTitle()}
                    <span className={styles.btnWrapper}>
                        <Button
                            className={styles.cancelBtn}
                            onClick={() => {
                                this.judgeModalVisible('businessApprovalModalVisible', true);
                                this.setState({
                                    businessApprovalModalBtnType: 'cancel',
                                });
                            }}
                        >
                            {trans('global.replace.pc.refuse', '拒 绝')}
                        </Button>

                        {changeRequest.arrangeType === 1 && (
                            <div
                                className={styles.saveBtn}
                                onClick={this.toggleConfirmModalVisible}
                            >
                                {trans('global.replace.pc.completeClose', '我已调课完成')}
                            </div>
                        )}
                        {changeRequest.arrangeType === 2 && (
                            <div className={styles.saveBtn} onClick={this.updateChangeRequest}>
                                {trans('global.replace.pc.toBePublished', '保存待公布')}
                            </div>
                        )}

                        <Button
                            type="primary"
                            className={styles.confirmBtn}
                            onClick={() =>
                                this.checkOrApproveClick(
                                    'confirm',
                                    {
                                        visibleType: 'schoolApprovalModalVisible',
                                        visibleValue: true,
                                    },
                                    'check'
                                )
                            }
                        >
                            {changeRequest.arrangeType === 1
                                ? trans('global.replace.pc.confirmUpdating', '确认更新课表')
                                : trans('global.replace.pc.completeClose', '我已调课完成')}
                        </Button>
                    </span>
                </Fragment>
            );
        }
    };

    getTitle = () => {
        const { changeRequest, currentLang } = this.props;
        return (
            <span className={styles.titleWrapper}>
                <Icon type="left" className={styles.icon} onClick={this.toApplicationListPage} />
                <span className={styles.titleText}>
                    {currentLang === 'cn'
                        ? `${changeRequest.teacherModel?.name}的调代课申请`
                        : `${changeRequest.teacherModel?.englishName}'s application`}
                    {changeRequest.resource === 1
                        ? `（${trans('global.replace.fromLeaveRequest', '来自请假')}）`
                        : changeRequest.resource === 2
                        ? `（${trans('global.replace.fromBusinessTrip', '来自外出')}）`
                        : ''}
                </span>
            </span>
        );
    };

    getBusinessApprovalModal = () => {
        const { businessApprovalModalVisible, businessApprovalModalBtnType } = this.state;
        const { changeRequest } = this.props;
        return (
            <Modal
                visible={businessApprovalModalVisible}
                title={trans('global.replace.approvalModal.approveConfirmation', '审批确认')}
                wrapClassName={styles.businessApprovalModal + ' ' + styles.commonModal}
                footer={
                    <span className={styles.btnWrapper}>
                        <Button
                            className={styles.cancelBtn}
                            onClick={() =>
                                this.judgeModalVisible('businessApprovalModalVisible', false)
                            }
                        >
                            {trans('global.replace.approvalModal.cancel', '取 消')}
                        </Button>
                        <Button
                            type="primary"
                            className={styles.confirmBtn}
                            onClick={() =>
                                this.checkOrApproveClick(
                                    businessApprovalModalBtnType,
                                    {
                                        visibleType: 'businessApprovalModalVisible',
                                        visibleValue: false,
                                    },
                                    'check',
                                    this.getChangeRequestDetail
                                )
                            }
                        >
                            {businessApprovalModalBtnType === 'confirm'
                                ? trans('global.replace.approvalModal.confirmAgree', '确认同意')
                                : trans('global.replace.approvalModal.confirmRefuse', '确认拒绝')}
                        </Button>
                    </span>
                }
                onCancel={() => this.judgeModalVisible('businessApprovalModalVisible', false)}
            >
                <div className={styles.businessApprovalModalContent}>
                    <TextArea
                        className={styles.textArea}
                        placeholder={trans(
                            'global.replace.approvalModal.enterApprovalComments',
                            '请输入审批意见'
                        )}
                        onChange={(e) => this.changeCopySendRemark(e.target.value)}
                    />
                </div>
            </Modal>
        );
    };

    getSchoolApprovalModal = () => {
        const { approveCheck } = this.props;
        const { schoolApprovalModalVisible } = this.state;
        let mapObj = {
            0: {
                content: '最新课表未公布，请先公布课表再进行申请单处理，人工完成调课申请，公布课表',
                footer: (
                    <Button
                        type="primary"
                        className={styles.confirmBtn}
                        onClick={() => this.judgeModalVisible('schoolApprovalModalVisible', false)}
                    >
                        我知道了
                    </Button>
                ),
            },
            1: {
                content: '申请人自行安排的调代课方案在最新课表上有冲突，关闭弹框可查看冲突详情',
                footer: (
                    <Button
                        type="primary"
                        className={styles.confirmBtn}
                        onClick={() => this.judgeModalVisible('schoolApprovalModalVisible', false)}
                    >
                        查看冲突
                    </Button>
                ),
            },
            2: {
                content: (
                    <span>
                        系统在当前最新课表&nbsp;
                        <span className={styles.version}>
                            {approveCheck.weekVersionDTO &&
                                this.getVersionName(approveCheck.weekVersionDTO)}
                        </span>
                        &nbsp;完成申请人提交的调代课变更，并同步到日程。是否确认完成「处理完成」？
                    </span>
                ),
                footer: (
                    <span className={styles.btnWrapper}>
                        <Button
                            className={styles.cancelBtn}
                            onClick={() =>
                                this.judgeModalVisible('schoolApprovalModalVisible', false)
                            }
                        >
                            {trans('global.replace.approvalModal.cancel', '取 消')}
                        </Button>
                        <Button
                            type="primary"
                            className={styles.confirmBtn}
                            onClick={() =>
                                this.checkOrApproveClick(
                                    'confirm',
                                    {
                                        visibleType: 'schoolApprovalModalVisible',
                                        visibleValue: false,
                                    },
                                    'approve',
                                    this.getChangeRequestDetail
                                )
                            }
                        >
                            确认处理完成
                        </Button>
                    </span>
                ),
            },
            3: {
                content:
                    '调课后课表未公布，请先公布课表再进行申请单处理，或者先保存调课方案，再去处理公布课表，课表公布后本次申请单会自动完结',
                footer: (
                    <Button
                        type="primary"
                        className={styles.confirmBtn}
                        onClick={() => this.judgeModalVisible('schoolApprovalModalVisible', false)}
                    >
                        我知道了
                    </Button>
                ),
            },
            4: {
                content: (
                    <span>
                        请确认已在调课后版本&nbsp;
                        <span className={styles.version}>
                            {approveCheck.weekVersionDTO &&
                                this.getVersionName(approveCheck.weekVersionDTO)}
                        </span>
                        &nbsp;中完成了申请人提交的调代课需求
                    </span>
                ),
                footer: (
                    <span className={styles.btnWrapper}>
                        <Button
                            className={styles.cancelBtn}
                            onClick={() =>
                                this.judgeModalVisible('schoolApprovalModalVisible', false)
                            }
                        >
                            {trans('global.replace.approvalModal.cancel', '取 消')}
                        </Button>
                        <Button
                            type="primary"
                            className={styles.confirmBtn}
                            onClick={() =>
                                this.checkOrApproveClick(
                                    'confirm',
                                    {
                                        visibleType: 'schoolApprovalModalVisible',
                                        visibleValue: false,
                                    },
                                    'approve',
                                    this.getChangeRequestDetail
                                )
                            }
                        >
                            确认处理完成
                        </Button>
                    </span>
                ),
            },
        };
        console.log(
            'this.getSchoolApprovalModalMsgType() :>> ',
            this.getSchoolApprovalModalMsgType()
        );
        return (
            <Modal
                visible={schoolApprovalModalVisible}
                title="操作提示"
                wrapClassName={styles.schoolApprovalModal + ' ' + styles.commonModal}
                footer={mapObj[this.getSchoolApprovalModalMsgType()].footer}
                closable={false}
                width={450}
            >
                <div className={styles.schoolApprovalModalContent}>
                    {mapObj[this.getSchoolApprovalModalMsgType()].content}
                </div>
            </Modal>
        );
    };

    getRevokeModal = () => {
        const { revokeModalVisible } = this.state;
        return (
            <Modal
                visible={revokeModalVisible}
                title={trans('global.replace.revokeModal.title', '撤销确认')}
                wrapClassName={styles.businessApprovalModal + ' ' + styles.commonModal}
                footer={
                    <span className={styles.btnWrapper}>
                        <Button className={styles.cancelBtn} onClick={this.cancelRevokeModal}>
                            {trans('global.replace.approvalModal.cancel', '取 消')}
                        </Button>
                        <Button
                            type="primary"
                            className={styles.confirmBtn}
                            onClick={this.revokeApplication}
                        >
                            {trans('global.replace.revokeModal.confirm', '确认撤销')}
                        </Button>
                    </span>
                }
                onCancel={this.cancelRevokeModal}
            >
                <div className={styles.businessApprovalModalContent}>
                    <TextArea
                        className={styles.textArea}
                        onChange={(e) => this.changeRevokeRemark(e.target.value)}
                        placeholder={trans(
                            'global.replace.revokeModal.placeholder',
                            '请输入撤销原因'
                        )}
                    />
                </div>
            </Modal>
        );
    };

    getSchoolApprovalModalMsgType = () => {
        const { approveCheck, changeRequest } = this.props;

        //已自行安排好
        if (changeRequest.arrangeType === 1) {
            //二次确认
            if (approveCheck.success) {
                return 2;
            }
            //未发布
            if (!approveCheck.versionPublish) {
                return 0;
            }
            //有冲突
            if (approveCheck.courseConflict) {
                return 1;
            }
        }

        //需要教务支持
        if (changeRequest.arrangeType === 2) {
            //二次确认
            if (approveCheck.success) {
                return 4;
            }
            //未发布
            if (!approveCheck.versionPublish) {
                return 3;
            }
        }
    };

    judgeModalVisible = (visibleType, value) => {
        this.setState({
            [visibleType]: value,
        });
        this.resetData(visibleType);
    };

    //btnType 同意还是拒绝 confirm: 同意 cancel: 拒绝
    //visibleType: 弹窗visible类型，visibleValue: visible值(true或者false)
    //type check：业务审批、教务审批拒绝提交、教务审批同意前校验，approve：教务审批通过
    //callbackFn 回调函数
    checkOrApproveClick = async (btnType, { visibleType, visibleValue }, type, callbackFn) => {
        const { dispatch, status, changeRequest, approveCheck, addLessonList } = this.props;

        const { businessApprovalRemark, schoolApproveRemark } = this.state;
        if (!visibleValue) {
            this.judgeModalVisible(visibleType, visibleValue);
        }

        if (btnType !== 'cancel') {
            //提交之前校验
            let { necessary, msg } = this.judgeNecessary();
            if (!necessary) {
                msg && message.error(msg);
                return;
            }
        }

        await dispatch({
            type: 'replace/changeContentWrapperLoading',
            payload: true,
        });
        if (type === 'check') {
            changeRequest.recordList = changeRequest.recordList.map((item) => {
                if (status === 'businessApproval') {
                    if (item.workflowNode === 'BUSINESS_APPROVE') {
                        return {
                            ...item,
                            remark: businessApprovalRemark,
                        };
                    } else {
                        return item;
                    }
                }
                if (status === 'schoolApproval') {
                    if (item.workflowNode === 'EDUCATION_APPROVE') {
                        return {
                            ...item,
                            remark: schoolApproveRemark,
                        };
                    } else {
                        return item;
                    }
                } else {
                    return {
                        ...item,
                    };
                }
            });
            if (status === 'schoolApproval') {
                //addLessonList 转格式 => changeRequest
                changeRequest.changeScheduleResultDTOList = addLessonList.map((item) => {
                    let { versionId, id: sourceResultId } = item.source;
                    let returnItem;
                    if (changeRequest.arrangeType === 1) {
                        returnItem = {
                            actingTeacherList: item.selectTeacherItem
                                ? {
                                      teacherId: item.selectTeacherItem.teacherId,
                                      teacherName: item.selectTeacherItem.teacherName,
                                  }
                                : undefined,
                            actingTeacherIdList: item.selectTeacherItem
                                ? [item.selectTeacherItem.teacherId]
                                : undefined,
                            sourceResult: item.source,
                            targetResult: item.target ? item.target : undefined,
                            sourceResultId: sourceResultId,
                            versionId: versionId,
                        };
                    }
                    if (changeRequest.arrangeType === 2) {
                        returnItem = {
                            versionId,
                            sourceResult: item.source,
                            sourceResultId,
                        };
                    }

                    return JSON.parse(JSON.stringify(returnItem));
                });
            }
            await dispatch({
                type: 'replace/getApproveCheck',
                payload: {
                    ...changeRequest,
                    approveWorkFlowNode:
                        status === 'businessApproval' ? 'BUSINESS_APPROVE' : 'EDUCATION_APPROVE',
                    approveStatus: btnType === 'confirm' ? 1 : 2,
                },
                onSuccess: async () => {
                    typeof callbackFn === 'function' && (await callbackFn());
                    if (visibleValue) {
                        this.judgeModalVisible(visibleType, visibleValue);
                    }
                },
            });
        }
        if (type === 'approve') {
            await dispatch({
                type: 'replace/getApprove',
                payload: {
                    key: approveCheck.key,
                },
                onSuccess: async () => {
                    typeof callbackFn === 'function' && (await callbackFn());
                    if (visibleValue) {
                        this.judgeModalVisible(visibleType, visibleValue);
                    }
                },
            });
        }

        await dispatch({
            type: 'replace/changeContentWrapperLoading',
            payload: false,
        });
    };

    changeRevokeRemark = (value) => {
        this.setState({
            revokeRemark: value,
        });
    };

    changeCopySendRemark = (value) => {
        const { dispatch, status } = this.props;
        if (status === 'businessApproval') {
            this.setState({
                businessApprovalRemark: value,
            });
        }
        if (status === 'schoolApproval') {
            this.setState({
                schoolApproveRemark: value,
            });
        }
    };

    resetData = (visibleType) => {
        const { status } = this.props;
        if (visibleType === 'businessApprovalModalVisible') {
            this.changeCopySendRemark('');
        }
        this.setState({
            businessApprovalRemark: '',
            schoolApproveRemark: '',
        });
    };

    getChangeRequestDetail = () => {
        const { dispatch, submitResultId, history } = this.props;
        let requestId = getUrlSearch('requestId') ? getUrlSearch('requestId') : submitResultId;
        history.push(`/replace/index/application?requestId=${requestId}`);
        return dispatch({
            type: 'replace/changeRequestDetail',
            payload: {
                requestId,
            },
        }).then(() => {
            this.judgeVersionList();
            dispatch({
                type: 'replace/setStatus',
                payload: 'detail',
            });
        });
    };

    toApplicationListPage = () => {
        const { history } = this.props;
        history.push('/replace/index');
    };

    judgeNecessary = () => {
        const {
            changeRequest: { requestDescription, arrangeType, requestSupplement },
            addLessonList,
        } = this.props;
        if (arrangeType === 2 && !requestSupplement) {
            return {
                necessary: false,
                msg: trans('global.replace.check.noRequirements', '调代课补充说明未填写'),
            };
        }
        if (!requestDescription) {
            return {
                necessary: false,
                msg: trans('global.replace.check.noBackground', '背景说明未填写'),
            };
        }
        if (!arrangeType) {
            return {
                necessary: false,
                msg: trans('global.replace.check.noArrangement', '安排情况未选择'),
            };
        } else {
            if (isEmpty(addLessonList)) {
                return {
                    necessary: false,
                    msg: trans('global.replace.check.noLesson', '需调代课的课节未选择'),
                };
            } else {
                //选择安排情况，但有课节未选择调课方案
                if (
                    arrangeType === 1 &&
                    addLessonList.find((item) => !item.target && !item.selectTeacherItem)
                ) {
                    return {
                        necessary: false,
                        msg: trans(
                            'global.replace.check.noSelect',
                            '请设置调代课方案，或者选择需要教务支持'
                        ),
                    };
                }
            }
        }
        if (isEmpty(addLessonList)) {
            return {
                necessary: false,
                msg: trans('global.replace.check.noLesson', '需调代课的课节未选择'),
            };
        }
        return {
            necessary: true,
        };
    };

    updateChangeRequest = async () => {
        const { dispatch, changeRequest, addLessonList } = this.props;
        let requestId = getUrlSearch('requestId') ? getUrlSearch('requestId') : submitResultId;

        //提交之前校验
        let { necessary, msg } = this.judgeNecessary();
        if (!necessary) {
            msg && message.error(msg);
            return;
        }

        await dispatch({
            type: 'replace/changeContentWrapperLoading',
            payload: true,
        });

        //addLessonList 转格式 => changeRequest
        changeRequest.changeScheduleResultDTOList = addLessonList.map((item) => {
            let { versionId, id: sourceResultId } = item.source;
            let returnItem;
            if (changeRequest.arrangeType === 1) {
                returnItem = {
                    actingTeacherList: item.selectTeacherItem
                        ? {
                              teacherId: item.selectTeacherItem.teacherId,
                              teacherName: item.selectTeacherItem.teacherName,
                          }
                        : undefined,
                    actingTeacherIdList: item.selectTeacherItem
                        ? [item.selectTeacherItem.teacherId]
                        : undefined,
                    sourceResult: item.source,
                    targetResult: item.target ? item.target : undefined,
                    sourceResultId: sourceResultId,
                    versionId: versionId,
                };
            }
            if (changeRequest.arrangeType === 2) {
                returnItem = {
                    versionId,
                    sourceResult: item.source,
                    sourceResultId,
                };
            }

            return JSON.parse(JSON.stringify(returnItem));
        });
        await dispatch({
            type: 'replace/updateChangeRequest',
            payload: {
                ...changeRequest,
            },
            onSuccess: () => {
                message.success('保存成功');
            },
        });

        await dispatch({
            type: 'replace/changeRequestDetail',
            payload: {
                requestId,
            },
        });

        await dispatch({
            type: 'replace/changeContentWrapperLoading',
            payload: false,
        });
    };

    judgeRevokeButtonVisible = () => {
        const {
            changeRequest: { teacherModel, status },
            currentUser,
        } = this.props;

        //单子的状态是正在审批中（教务审批 + 业务审批），并且当前用户是申请人，显示撤销申请按钮
        return (
            (status === 0 || status === 4) && teacherModel && teacherModel.id === currentUser.userId
        );
    };

    revokeApplication = async () => {
        const {
            dispatch,
            changeRequest: { id },
        } = this.props;
        const { revokeRemark } = this.state;
        this.setState({
            revokeModalVisible: false,
        });
        await dispatch({
            type: 'replace/changeContentWrapperLoading',
            payload: true,
        });
        await dispatch({
            type: 'replace/revokeRequest',
            payload: {
                requestId: id,
                remark: revokeRemark,
            },
            onSuccess: () => {
                message.success('撤销成功');
                this.cancelRevokeModal();
            },
        });
        await dispatch({
            type: 'replace/changeRequestDetail',
            payload: {
                requestId: id,
            },
        }).then(() => {
            this.judgeVersionList();
        });
        await dispatch({
            type: 'replace/changeContentWrapperLoading',
            payload: false,
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

    judgeVersionList = () => {
        const { dispatch, changeRequest, status } = this.props;
        const isVersionStatus = status === 'schoolApproval' || Boolean(changeRequest.status) != 0;
        if (isVersionStatus && changeRequest.changeScheduleResultDTOList) {
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
                        targetVersion = selectSupportVersion.find((item) => item.current);
                    } else {
                        targetVersion = selectSupportVersion.find(
                            (item) => item.id === changeRequest.changeVersion.id
                        );
                    }
                }
                this.setChangeRequest('changeVersion', targetVersion);
            });
        }
    };

    getVersionName = (versionItem) => {
        if (versionItem) {
            return `${versionItem.systemVersionNumber ? versionItem.systemVersionNumber : ''}${
                versionItem.createType === 0 ? '' : '系统调课'
            } ${versionItem.name}`;
        } else return '';
    };

    cancelRevokeModal = () => {
        this.setState({
            revokeModalVisible: false,
            revokeRemark: '',
        });
    };

    toggleConfirmModalVisible = () => {
        const { confirmModalVisible } = this.state;
        this.setState({
            confirmModalVisible: !confirmModalVisible,
        });
    };

    getConfirmModal = () => {
        const { selectSupportVersion, changeRequest, contentWrapperLoading } = this.props;
        const { confirmModalVisible } = this.state;
        return (
            <SimpleModal
                visible={confirmModalVisible}
                title="处理确认"
                onOk={this.confirmModalOnOk}
                onCancel={this.toggleConfirmModalVisible}
                okText="我已确认调课完成"
                cancelText="取消"
                maskClosable={false}
                confirmLoading={contentWrapperLoading}
                content={
                    <div className={styles.confirmModalContent}>
                        <Row>
                            <Col span={6}>调整后课表版本</Col>
                            <Col span={18}>
                                <Select
                                    placeholder={trans(
                                        'global.replace.selectVersion',
                                        '请选择调整后课表版本'
                                    )}
                                    onChange={(value) =>
                                        this.setChangeRequest(
                                            'changeVersion',
                                            selectSupportVersion.find((item) => item.id === value)
                                        )
                                    }
                                    style={{ minWidth: 200, maxWidth: 350 }}
                                    dropdownMatchSelectWidth={false}
                                    dropdownStyle={{ maxWidth: 350 }}
                                >
                                    {selectSupportVersion.map((item) => (
                                        <Select.Option key={item.id} value={item.id}>
                                            {this.getVersionName(item)}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>详细调课方案</Col>
                            <Col span={18}>
                                <TextArea
                                    style={{
                                        width: 400,
                                        height: 100,
                                        borderRadius: 5,
                                    }}
                                    placeholder={trans(
                                        'global.replace.enterDetailedPlan',
                                        '请输入详细调课方案（申请人可见）'
                                    )}
                                    onChange={(e) =>
                                        this.setChangeRequest('changeCourseDetail', e.target.value)
                                    }
                                    value={changeRequest.changeCourseDetail}
                                />
                            </Col>
                        </Row>
                    </div>
                }
            />
        );
    };

    confirmModalOnOk = async () => {
        const { dispatch, submitResultId, changeRequest } = this.props;
        let requestId = getUrlSearch('requestId') ? getUrlSearch('requestId') : submitResultId;
        await dispatch({
            type: 'replace/changeContentWrapperLoading',
            payload: true,
        });
        await dispatch({
            type: 'replace/selfArrangeReady',
            payload: {
                requestId,
                versionId: changeRequest.changeVersion.id,
                changeCourseDetail: changeRequest.changeCourseDetail,
            },
        });
        await this.getChangeRequestDetail();
        await dispatch({
            type: 'replace/changeContentWrapperLoading',
            payload: false,
        });
        this.toggleConfirmModalVisible();
    };

    toSchoolApproval = async () => {
        const { dispatch, changeRequest } = this.props;
        await dispatch({
            type: 'replace/changeContentWrapperLoading',
            payload: true,
        });
        await dispatch({
            type: 'replace/setStatus',
            payload: 'schoolApproval',
        });

        await dispatch({
            type: 'replace/getSelectSupportVersion',
            payload: {
                versionId: changeRequest.changeScheduleResultDTOList[0].versionId,
            },
        }).then(() => {
            const { selectSupportVersion } = this.props;
            let targetVersion = {};

            //这里教务提前处理不一样
            targetVersion = selectSupportVersion.find((item) => item.lastPublish);
            this.setChangeRequest('changeVersion', targetVersion);
        });

        await dispatch({
            type: 'replace/changeContentWrapperLoading',
            payload: false,
        });
    };

    getNoProcessingRequiredModal = () => {
        const { noProcessingRequiredModalVisible } = this.props;
        return (
            <SimpleModal
                visible={noProcessingRequiredModalVisible}
                title="操作提示"
                onCancel={this.noProcessingRequiredConfirm}
                onOk={this.noProcessingRequiredConfirm}
                okText="查看详情"
                maskClosable={false}
                content={<span>当前调代课申请已业务审批拒绝，您无需处理</span>}
            />
        );
    };

    noProcessingRequiredConfirm = () => {
        const { dispatch } = this.props;
        this.getChangeRequestDetail();
        dispatch({
            type: 'replace/setNoProcessingRequiredModalVisible',
            payload: false,
        });
    };

    render() {
        const { noProcessingRequiredModalVisible } = this.props;
        const {
            businessApprovalModalVisible,
            schoolApprovalModalVisible,
            revokeModalVisible,
            confirmModalVisible,
        } = this.state;
        return (
            <div className={styles.headerWrapper}>
                {this.getHeader()}
                {businessApprovalModalVisible && this.getBusinessApprovalModal()}
                {schoolApprovalModalVisible && this.getSchoolApprovalModal()}
                {revokeModalVisible && this.getRevokeModal()}
                {confirmModalVisible && this.getConfirmModal()}
                {noProcessingRequiredModalVisible && this.getNoProcessingRequiredModal()}
            </div>
        );
    }
}
export default withRouter(Header);
