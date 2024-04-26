//调课换课结果
//版本发布，可以确认和通知，如果版本未发布，则不允许点击确认通知
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Checkbox, Icon, Modal } from 'antd';
import styles from './index.less';
import icon from '../../../icon.less';
import { intoChinese } from '../../../utils/utils';

@connect((state) => ({
    lastPublicContent: state.timeTable.lastPublicContent,
}))
export default class ExchangeResult extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            isNewVersion: false,
            showErrorMessage: false, //规则校验失败弹窗
            showDetails: false, //查看详细原因
        };
    }

    //是否检验规则
    ifValidateRules = (e) => {
        const { validateCanChange, exchangeList } = this.props;
        typeof validateCanChange == 'function' && validateCanChange(exchangeList, e.target.checked);
    };

    //格式化老师
    formatTeacher = (arr) => {
        let result = [];
        arr &&
            arr.length > 0 &&
            arr.map((item) => {
                result.push(item.name);
            });
        return result;
    };

    //取消调课换课
    cancelExchangeCourse = () => {
        const { cancelExchangeCourse } = this.props;
        typeof cancelExchangeCourse == 'function' && cancelExchangeCourse.call(this);
    };

    //点击确认调换
    clickFinish = () => {
        const { dispatch, currentVersion } = this.props;
        dispatch({
            type: 'timeTable/lastPublic',
            payload: {
                versionId: currentVersion,
            },
            onSuccess: () => {
                const { lastPublicContent } = this.props;
                this.setState({
                    showModal: true,
                    isNewVersion: lastPublicContent,
                });
            },
        });
    };

    //取消
    handleCancel = () => {
        this.setState({
            showModal: false,
            showErrorMessage: false,
            showDetails: false,
        });
    };

    //完成并通知
    confirmAndNotice = () => {
        const { finishExchangeCourse } = this.props;
        typeof finishExchangeCourse == 'function' && finishExchangeCourse(true, this.handleCancel);
    };

    //完成
    confirm = () => {
        const { finishExchangeCourse } = this.props;
        typeof finishExchangeCourse == 'function' && finishExchangeCourse(false, this.handleCancel);
    };

    //查看规则冲突详情
    showErrorDetail = () => {
        this.setState({
            showErrorMessage: true,
        });
    };

    //知道了
    haveKnow = () => {
        this.setState({
            showErrorMessage: false,
            showDetails: false,
        });
    };

    //查看详情
    lookDetail = () => {
        this.setState({
            showDetails: !this.state.showDetails,
        });
    };

    render() {
        const {
            changeCourseDetail,
            conflict,
            checkRules,
            conflictResult,
            fetErrorMessageModel,
            showExchangeResult,
        } = this.props;
        const { showModal, isNewVersion, showErrorMessage, showDetails } = this.state;
        let resultInfoList = changeCourseDetail && changeCourseDetail.resultInfoList;
        let exchangeList = changeCourseDetail && changeCourseDetail.exchangeList;
        let isClickConfirm = conflict === 0 || conflict === 2 ? true : false; //conflict: 0可以调换，1老师冲突，2规则冲突，""校验中
        return (
            <div className={styles.exchangeResult}>
                {showExchangeResult && (
                    <span className={styles.leftContent}>
                        <a className={styles.courseDetail}>
                            {resultInfoList &&
                                resultInfoList.length > 0 &&
                                resultInfoList.map((item, index) => {
                                    return (
                                        <em key={index}>
                                            {item.courseName && item.courseName + '-'}
                                            {this.formatTeacher(item.teacherList).join(',') &&
                                                this.formatTeacher(item.teacherList).join(',') +
                                                    '-'}
                                            {item.className} 周{intoChinese(item.weekDay)} 第
                                            {item.lesson}节 {item.startTime} - {item.endTime}
                                        </em>
                                    );
                                })}
                        </a>
                        <a className={styles.changeBtn}>
                            <i className={icon.iconfont}>&#xe66c;</i>
                        </a>
                        <a className={styles.courseDetail}>
                            {exchangeList &&
                                exchangeList.length > 0 &&
                                exchangeList.map((item, index) => {
                                    return (
                                        <em key={index}>
                                            {item.courseName && item.courseName + '-'}
                                            {this.formatTeacher(item.teacherList).join(',') &&
                                                this.formatTeacher(item.teacherList).join(',') +
                                                    '-'}
                                            {item.className} 周{intoChinese(item.weekDay)} 第
                                            {item.lesson}节 {item.startTime} - {item.endTime}
                                        </em>
                                    );
                                })}
                        </a>
                    </span>
                )}
                {showExchangeResult && (
                    <span className={styles.checkRules}>
                        <Checkbox checked={checkRules} onChange={this.ifValidateRules}>
                            <em className={styles.ruleContent}>检验规则</em>
                        </Checkbox>
                        {conflict === 0 && (
                            <em className={styles.changeSuccess}>
                                <i className={icon.iconfont}>&#xe6c7;</i> 可以调换
                            </em>
                        )}
                        {conflict === 1 && (
                            <em className={styles.changeConflict}>
                                <i className={icon.iconfont}>&#xe6ca;</i> {conflictResult}
                            </em>
                        )}
                        {conflict === 2 && (
                            <em className={styles.changeConflict} onClick={this.showErrorDetail}>
                                <i className={icon.iconfont}>&#xe629;</i> {conflictResult}
                            </em>
                        )}
                        {conflict === '' && (
                            <em className={styles.waitingTips}>
                                <Icon type="sync" spin /> 排课引擎正在检测冲突...
                            </em>
                        )}
                    </span>
                )}
                {showExchangeResult ? (
                    <span className={styles.rightButton}>
                        <a className={styles.cancelBtn} onClick={this.cancelExchangeCourse}>
                            取消
                        </a>
                        {isClickConfirm ? (
                            <a className={styles.confirmBtn} onClick={this.clickFinish}>
                                确认调换
                            </a>
                        ) : (
                            <a className={styles.grayBtn}>确认调换</a>
                        )}
                    </span>
                ) : (
                    <span className={styles.rightButton}>
                        <a className={styles.onlyCancelBtn} onClick={this.cancelExchangeCourse}>
                            取消
                        </a>
                    </span>
                )}

                <Modal
                    visible={showModal}
                    title="确认调课方案"
                    onCancel={this.handleCancel}
                    footer={null}
                    width={480}
                >
                    <div className={styles.confirmCase}>
                        <p className={styles.confirmTitle}>点击确认按钮完成调课</p>
                        <div className={styles.userDetail}>
                            {resultInfoList &&
                                resultInfoList.length > 0 &&
                                resultInfoList.map((item, index) => {
                                    return (
                                        <p key={index}>
                                            {item.courseName && item.courseName + '-'}
                                            {this.formatTeacher(item.teacherList).join(',') &&
                                                this.formatTeacher(item.teacherList).join(',') +
                                                    '-'}
                                            {item.className} 周{intoChinese(item.weekDay)} 第
                                            {item.lesson}节 {item.startTime} - {item.endTime}
                                        </p>
                                    );
                                })}
                            {exchangeList &&
                                exchangeList.length > 0 &&
                                exchangeList.map((item, index) => {
                                    return (
                                        <p key={index}>
                                            {item.courseName && item.courseName + '-'}
                                            {this.formatTeacher(item.teacherList).join(',') &&
                                                this.formatTeacher(item.teacherList).join(',') +
                                                    '-'}
                                            {item.className} 周{intoChinese(item.weekDay)} 第
                                            {item.lesson}节 {item.startTime} - {item.endTime}
                                        </p>
                                    );
                                })}
                        </div>
                        <div className={styles.operButtonList}>
                            {isNewVersion ? (
                                <span className={styles.modalBtn + ' ' + styles.grayBtn}>确认</span>
                            ) : (
                                <span
                                    className={styles.modalBtn + ' ' + styles.cancelBtn}
                                    onClick={this.confirm}
                                >
                                    确认
                                </span>
                            )}
                            {/* {
                            isNewVersion 
                            ? <span className={styles.modalBtn + ' '+ styles.submitBtn} onClick={this.confirmAndNotice}>完成并通知</span>
                            : <span className={styles.modalBtn + ' '+ styles.grayBtn}>完成并通知</span>
                        } */}
                        </div>
                    </div>
                </Modal>
                <Modal
                    visible={showErrorMessage}
                    title="规则校验失败"
                    width="520px"
                    footer={null}
                    onCancel={this.haveKnow}
                >
                    <div className={styles.errorPage}>
                        <p className={styles.errorTitle}>
                            <span>失败原因：</span>
                            <span>
                                {fetErrorMessageModel && fetErrorMessageModel.fetErrorMessageTitle}
                            </span>
                        </p>
                        <p className={styles.lookDetails} onClick={this.lookDetail}>
                            查看详细原因
                            {!showDetails ? (
                                <i className={icon.iconfont}>&#xe613;</i>
                            ) : (
                                <i className={icon.iconfont}>&#xe614;</i>
                            )}
                        </p>
                        {showDetails && (
                            <div className={styles.errorInfoDetail}>
                                {fetErrorMessageModel && fetErrorMessageModel.fetMessage}
                                {fetErrorMessageModel && fetErrorMessageModel.downLoadUrl && (
                                    <a
                                        className={styles.downloadUrl}
                                        href={
                                            fetErrorMessageModel && fetErrorMessageModel.downLoadUrl
                                        }
                                        target="_blank"
                                    >
                                        下载文件
                                    </a>
                                )}
                            </div>
                        )}
                        <div className={styles.errorLessons}>
                            <span>失败课节：</span>
                            <div className={styles.lessonList}>
                                {fetErrorMessageModel &&
                                fetErrorMessageModel.failAcMessages &&
                                fetErrorMessageModel.failAcMessages.length > 0 ? (
                                    fetErrorMessageModel.failAcMessages.map((item, index) => {
                                        return <p key={index}>{item}</p>;
                                    })
                                ) : (
                                    <p>暂无失败课节提示~</p>
                                )}
                            </div>
                        </div>
                        <div className={styles.operButtonStyle}>
                            <span onClick={this.haveKnow}>知道了</span>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}
