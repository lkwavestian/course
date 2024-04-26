import React, { Fragment, PureComponent } from 'react';
import { withRouter } from 'dva/router';

import styles from './index.less';
import { Button, message, Input, Select } from 'antd';
import { Modal, TextareaItem } from 'antd-mobile';
import { connect } from 'dva';
import { isEmpty } from 'lodash';

import { getUrlSearch } from '../../../utils/utils';
import { locale, trans } from '../../../utils/i18n';

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
        bottomBtnWrapperVisible: true,
        confirmModalVisible: false,
    };

    getBtnList = () => {
        const { status, contentWrapperLoading, changeRequest } = this.props;
        if (status !== 'detail') {
            this.setState({
                bottomBtnWrapperVisible: true,
            });
        }
        if (status === 'application') {
            return (
                <Fragment>
                    <div
                        className={styles.btn + ' ' + styles.cancelBtn}
                        onClick={this.cancelSubmit}
                    >
                        {trans('global.replace.cancel', '取消')}
                    </div>
                    <div
                        className={styles.btn + ' ' + styles.submitBtn}
                        onClick={this.confirmSubmit}
                    >
                        {trans('global.replace.confirmSubmit', '确认提交')}
                    </div>
                </Fragment>
            );
        }
        if (status === 'detail') {
            return (
                this.judgeRevokeButtonVisible() && (
                    <div
                        className={styles.btn + ' ' + styles.revokeBtn}
                        onClick={() => {
                            this.judgeModalVisible('revokeModalVisible', true);
                        }}
                        loading={contentWrapperLoading}
                    >
                        {trans('global.replace.header.withdraw', '撤销申请')}
                    </div>
                )
            );
        }
        if (status === 'businessApproval') {
            return (
                <Fragment>
                    <div
                        className={styles.btn + ' ' + styles.rejectBtn}
                        onClick={() => {
                            this.judgeModalVisible('businessApprovalModalVisible', true);
                            this.setState({
                                businessApprovalModalBtnType: 'cancel',
                            });
                        }}
                    >
                        拒&nbsp;绝
                    </div>
                    <div
                        className={styles.btn + ' ' + styles.submitBtn}
                        onClick={() => {
                            this.judgeModalVisible('businessApprovalModalVisible', true);
                            this.setState({
                                businessApprovalModalBtnType: 'confirm',
                            });
                        }}
                    >
                        通过
                    </div>
                </Fragment>
            );
        }
        if (status === 'schoolApproval') {
            return (
                <Fragment>
                    <div
                        className={styles.btn + ' ' + styles.rejectBtn}
                        onClick={() => {
                            this.judgeModalVisible('businessApprovalModalVisible', true);
                            this.setState({
                                businessApprovalModalBtnType: 'cancel',
                            });
                        }}
                    >
                        拒&nbsp;绝
                    </div>
                    {changeRequest.arrangeType === 2 && (
                        <div
                            className={styles.btn + ' ' + styles.rejectBtn}
                            onClick={this.updateChangeRequest}
                        >
                            保存待公布
                        </div>
                    )}
                    {changeRequest.arrangeType === 1 && (
                        <div
                            className={styles.btn + ' ' + styles.rejectBtn}
                            onClick={this.toggleConfirmModalVisible}
                        >
                            我已调课完成
                        </div>
                    )}

                    <div
                        className={styles.btn + ' ' + styles.submitBtn}
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
                        style={{ flexGrow: changeRequest.arrangeType === 2 ? 1 : 2 }}
                    >
                        {changeRequest.arrangeType === 1 ? '确认更新课表' : '我已调课完成'}
                    </div>
                </Fragment>
            );
        }
    };

    getSchoolApprovalModal = () => {
        const { approveCheck } = this.props;
        const { schoolApprovalModalVisible } = this.state;
        let mapObj = {
            0: (
                <div className={styles.content}>
                    <span>
                        最新课表未公布，请先公布课表再进行申请单处理，人工完成调课申请，公布课表,
                    </span>
                    <span className={styles.btnList}>
                        <Button
                            className={styles.btn + ' ' + styles.submitBtn}
                            onClick={() =>
                                this.judgeModalVisible('schoolApprovalModalVisible', false)
                            }
                        >
                            我知道了
                        </Button>
                    </span>
                </div>
            ),
            1: (
                <div className={styles.content}>
                    <span>
                        申请人自行安排的调代课方案在最新课表上有冲突，关闭弹框可查看冲突详情
                    </span>
                    <div className={styles.btnList}>
                        <Button
                            className={styles.btn + ' ' + styles.submitBtn}
                            onClick={() =>
                                this.judgeModalVisible('schoolApprovalModalVisible', false)
                            }
                        >
                            查看冲突
                        </Button>
                    </div>
                </div>
            ),
            2: (
                <div className={styles.content}>
                    <span>
                        系统在当前最新课表&nbsp;
                        <span className={styles.version}>
                            {approveCheck.weekVersionDTO &&
                                this.getVersionName(approveCheck.weekVersionDTO)}
                        </span>
                        &nbsp;完成申请人提交的调代课变更，并同步到日程。是否确认完成「处理完成」？
                    </span>
                    <span className={styles.btnList}>
                        <Button
                            className={styles.btn + ' ' + styles.cancelBtn}
                            onClick={() =>
                                this.judgeModalVisible('schoolApprovalModalVisible', false)
                            }
                        >
                            {trans('global.replace.cancel', '取消')}
                        </Button>
                        <Button
                            className={styles.btn + ' ' + styles.submitBtn}
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
                </div>
            ),
            3: (
                <div className={styles.content}>
                    <span>
                        调课后课表未公布，请先公布课表再进行申请单处理，或者先保存调课方案，再去处理公布课表，课表公布后本次申请单会自动完结
                    </span>
                    <div className={styles.btnList}>
                        <Button
                            className={styles.btn + ' ' + styles.submitBtn}
                            onClick={() =>
                                this.judgeModalVisible('schoolApprovalModalVisible', false)
                            }
                        >
                            我知道了
                        </Button>
                    </div>
                </div>
            ),
            4: (
                <div className={styles.content}>
                    <span>
                        请确认已在调课后版本&nbsp;
                        <span className={styles.version}>
                            {approveCheck.weekVersionDTO &&
                                this.getVersionName(approveCheck.weekVersionDTO)}
                        </span>
                        &nbsp;中完成了申请人提交的调代课需求
                    </span>
                    <div className={styles.btnList}>
                        <Button
                            className={styles.btn + ' ' + styles.cancelBtn}
                            onClick={() =>
                                this.judgeModalVisible('schoolApprovalModalVisible', false)
                            }
                        >
                            {trans('global.replace.cancel', '取消')}
                        </Button>
                        <Button
                            className={styles.btn + ' ' + styles.submitBtn}
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
                    </div>
                </div>
            ),
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
                transparent
            >
                <div className={styles.schoolApprovalModalContent}>
                    {mapObj[this.getSchoolApprovalModalMsgType()]}
                </div>
            </Modal>
        );
    };

    getCommonModal = () => {
        const { revokeModalVisible, businessApprovalModalVisible, businessApprovalModalBtnType } =
            this.state;
        let visible,
            onClose,
            textAreaOnChange,
            textAreaPlaceHolder,
            confirmClick,
            cancelText,
            confirmText;
        if (revokeModalVisible) {
            visible = revokeModalVisible;
            onClose = this.cancelRevokeModal;
            textAreaOnChange = (e) => this.changeRevokeRemark(e.target.value);
            textAreaPlaceHolder = '请输入撤销理由';
            confirmClick = this.revokeApplication;
            cancelText = <span>{trans('global.replace.cancel', '取消')}</span>;
            confirmText = '确认撤销';
        }
        if (businessApprovalModalVisible) {
            visible = businessApprovalModalVisible;
            onClose = () => this.judgeModalVisible('businessApprovalModalVisible', false);
            textAreaOnChange = (e) => this.changeCopySendRemark(e.target.value);
            textAreaPlaceHolder = '请输入审批理由';
            confirmClick = () =>
                this.checkOrApproveClick(
                    businessApprovalModalBtnType,
                    {
                        visibleType: 'businessApprovalModalVisible',
                        visibleValue: false,
                    },
                    'check',
                    this.getChangeRequestDetail
                );
            cancelText = <span>{trans('global.replace.cancel', '取消')}</span>;
            confirmText = businessApprovalModalBtnType === 'confirm' ? '确认同意' : '确认拒绝';
        }
        return this.getCommonModalHtml(
            visible,
            onClose,
            textAreaOnChange,
            textAreaPlaceHolder,
            confirmClick,
            cancelText,
            confirmText
        );
    };

    getCommonModalHtml = (
        visible,
        onClose,
        textAreaOnChange,
        textAreaPlaceHolder,
        confirmClick,
        cancelText,
        confirmText
    ) => {
        return (
            <Modal
                visible={visible}
                wrapClassName={styles.commonModal}
                onClose={onClose}
                popup
                animationType="slide-up"
                transparent
            >
                <div className={styles.modalContent}>
                    <TextArea
                        className={styles.textArea}
                        onChange={textAreaOnChange}
                        rows={4}
                        placeholder={textAreaPlaceHolder}
                    />
                    <div className={styles.btnList}>
                        <div className={styles.btn + ' ' + styles.rejectBtn} onClick={onClose}>
                            {cancelText}
                        </div>
                        <div className={styles.btn + ' ' + styles.submitBtn} onClick={confirmClick}>
                            {confirmText}
                        </div>
                    </div>
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
    //callbackFn 回掉函数
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
        history.push(`/replace/mobile/application/index?requestId=${requestId}`);
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
        //单子的状态是正在审批中（教务审批 + 业务审批），并且当前用户是申请人，显示撤销申请按钮
        const {
            changeRequest: { teacherModel, status },
            currentUser,
        } = this.props;
        if (
            (status === 0 || status === 4) &&
            teacherModel &&
            teacherModel.id === currentUser.userId
        ) {
            this.setState({
                bottomBtnWrapperVisible: true,
            });
            return true;
        } else {
            this.setState({
                bottomBtnWrapperVisible: false,
            });
            return false;
        }
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

    cancelSubmit = async () => {
        const { dispatch, history } = this.props;
        await dispatch({
            type: 'replace/setChangeRequest',
            payload: {},
        });
        history.push(`/replace/mobile/index`);
    };

    //调代课申请提交
    confirmSubmit = async () => {
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
                await dispatch({
                    type: 'replace/setSubmitResultId',
                    payload: setSubmitResultIdResponse,
                });
                await this.getChangeRequestDetail();
                message.success('提交成功');

                await dispatch({
                    type: 'replace/setStatus',
                    payload: 'detail',
                    // payload: 'businessApproval',
                    // payload: 'schoolApproval',
                });
                await dispatch({
                    type: 'replace/changeContentWrapperLoading',
                    payload: false,
                });
                await dispatch({
                    type: 'replace/emptyImportSupplementUrlList',
                    payload: [],
                });
            },
            onError: () => {
                dispatch({
                    type: 'replace/changeContentWrapperLoading',
                    payload: false,
                });
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

    toggleConfirmModalVisible = () => {
        const { confirmModalVisible } = this.state;
        this.setState({
            confirmModalVisible: !confirmModalVisible,
        });
    };

    getConfirmModal = () => {
        const { selectSupportVersion, changeRequest } = this.props;
        const { confirmModalVisible } = this.state;
        return (
            <Modal
                visible={confirmModalVisible}
                title="处理确认"
                onOk={this.confirmModalOnOk}
                onClose={this.toggleConfirmModalVisible}
                okText="我已确认调课完成"
                cancelText={trans('global.replace.cancel', '取消')}
                maskClosable={false}
                transparent
                wrapClassName={styles.confirmModalWrapper}
            >
                <div className={styles.confirmModalContent}>
                    <span>调整后课表版本：</span>
                    <Select
                        placeholder={trans('global.replace.selectVersion', '请选择调整后课表版本')}
                        onChange={(value) =>
                            this.setChangeRequest(
                                'changeVersion',
                                selectSupportVersion.find((item) => item.id === value)
                            )
                        }
                        style={{ minWidth: '70vw', maxWidth: '80vw' }}
                        dropdownMatchSelectWidth={false}
                        dropdownStyle={{ maxWidth: '80vh' }}
                    >
                        {selectSupportVersion.map((item) => (
                            <Option key={item.id} value={item.id}>
                                {this.getVersionName(item)}
                            </Option>
                        ))}
                    </Select>
                    <span>详细调课方案：</span>
                    <TextArea
                        style={{
                            width: '80vw',
                            height: '10vh',
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
                    <span className={styles.btnList}>
                        <Button
                            className={styles.btn + ' ' + styles.cancelBtn}
                            onClick={this.toggleConfirmModalVisible}
                        >
                            {trans('global.replace.cancel', '取消')}
                        </Button>
                        <Button
                            className={styles.btn + ' ' + styles.submitBtn}
                            onClick={this.confirmModalOnOk}
                        >
                            我已确认调课完成
                        </Button>
                    </span>
                </div>
            </Modal>
        );
    };

    confirmModalOnOk = async () => {
        const { dispatch, submitResultId, changeRequest } = this.props;
        let requestId = getUrlSearch('requestId') ? getUrlSearch('requestId') : submitResultId;
        this.toggleConfirmModalVisible();
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
    };

    render() {
        const {
            businessApprovalModalVisible,
            schoolApprovalModalVisible,
            revokeModalVisible,
            bottomBtnWrapperVisible,
            confirmModalVisible,
        } = this.state;
        return (
            <div
                className={styles.bottomBtnWrapper}
                style={{ display: bottomBtnWrapperVisible ? 'flex' : 'none' }}
            >
                {this.getBtnList()}
                {(revokeModalVisible || businessApprovalModalVisible) && this.getCommonModal()}
                {schoolApprovalModalVisible && this.getSchoolApprovalModal()}
                {confirmModalVisible && this.getConfirmModal()}
            </div>
        );
    }
}
export default withRouter(Header);
