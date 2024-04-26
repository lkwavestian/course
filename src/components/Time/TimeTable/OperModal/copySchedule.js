//保存版本
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './copySchedule.less';
import { Modal, Select, Row, Col, DatePicker, Radio, Icon, Button, message } from 'antd';
import { trans, locale } from '../../../../utils/i18n';
import moment from 'moment';

const { Option } = Select;
@connect((state) => ({
    //从历史学期复制
    copyModalVisible: state.timeTable.copyModalVisible,
    planningSemesterInfo: state.course.planningSemesterInfo,
    currentUser: state.global.currentUser,
    copyScheduleVersionList: state.timeTable.copyScheduleVersionList,
    checkVersionGroupResult: state.timeTable.checkVersionGroupResult,
}))
export default class CopySchedule extends PureComponent {
    state = {
        sourceSemester: '',
        sourceDate: undefined,
        sourceVersionId: undefined,
        targetSemester: '',
        targetDate: undefined,
        copyStudent: '',
        createDefaultTeachingPlan: '',
        confirmLoading: false,
    };

    componentDidMount() {
        const { dispatch, currentUser } = this.props;
        dispatch({
            type: 'course/selectBySchoolIdAllSemester',
            payload: {
                schoolId: currentUser.schoolId,
            },
        });
    }

    setStateFn = (key, value) => {
        this.setState({
            [key]: value,
        });
    };

    hideCopyModal = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'timeTable/setCopyModalVisible',
            payload: false,
        });
    };

    changeSemester = (type, semesterId) => {
        const { dispatch, planningSemesterInfo } = this.props;
        let semesterItem = planningSemesterInfo.find((item) => item.id === semesterId);
        if (type === 'source') {
            this.setStateFn('sourceSemester', semesterId ? semesterItem : undefined);
            this.changeDateChange(undefined);
        }
        if (type === 'target') {
            this.setStateFn('targetSemester', semesterId ? semesterItem : undefined);
            this.targetDateChange(undefined);
        }
    };

    changeDateChange = (date) => {
        const { dispatch } = this.props;
        if (!date) {
            dispatch({
                type: 'timeTable/setCheckVersionGroupResult',
                payload: false,
            });
            this.setState({
                sourceVersionId: undefined,
                sourceDate: undefined,
            });
            return;
        }
        this.setStateFn('sourceDate', date);
        dispatch({
            type: 'timeTable/getCopyScheduleVersionList',
            payload: {
                startTime: moment(date).startOf('week').valueOf(),
                endTime: moment(date).endOf('week').valueOf() - 999,
            },
        });
    };

    targetDateChange = (date) => {
        this.setStateFn('targetDate', date);
    };

    getDisabledDate = (type, date) => {
        const { sourceSemester, targetSemester } = this.state;
        if (type === 'source') {
            if (!sourceSemester) {
                return true;
            }
            return (
                date.valueOf() > moment(sourceSemester.semesterEndTime).valueOf() ||
                date.valueOf() < moment(sourceSemester.semesterStartTime).valueOf()
            );
        }
        if (type === 'target') {
            if (!targetSemester) {
                return true;
            }
            return (
                date.valueOf() > moment(targetSemester.semesterEndTime).valueOf() ||
                date.valueOf() < moment(targetSemester.semesterStartTime).valueOf()
            );
        }
    };

    getSettingItem = (leftText, rightContent) => {
        const { createDefaultTeachingPlan, copyStudent } = this.state;
        return (
            <div className={styles.settingItem}>
                <div className={styles.leftText}>{leftText}</div>
                <div className={styles.middleText}>
                    <span className={styles.line}></span>
                    <Icon type="caret-right" theme="filled" className={styles.icon} />
                </div>
                <div className={styles.rightText}>
                    <div>{rightContent}</div>
                    {leftText === '分层选修班' && (
                        <div className={styles.warning}>
                            <Icon type="warning" theme="filled" />
                            <span className={styles.warningText}>
                                如果不希望复制分层选修班，可准备一个不含分层选修班的来源课表
                            </span>
                        </div>
                    )}
                    {leftText === '分层选修班学生' && copyStudent === 1 && (
                        <div className={styles.warning}>
                            <Icon type="warning" theme="filled" />
                            <span className={styles.warningText}>
                                已经存在的班级，会跳过复制学生操作{' '}
                            </span>
                        </div>
                    )}
                    {leftText === '课时计划' && createDefaultTeachingPlan === 1 && (
                        <div className={styles.warning}>
                            <Icon type="warning" theme="filled" />
                            <span className={styles.warningText}>
                                请确保新学期没有来源课表所涉及的课程的课时计划，否则会生成重复课时计划{' '}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    selectVersionChange = (value) => {
        const { dispatch } = this.props;
        this.setStateFn('sourceVersionId', value);
        dispatch({
            type: 'timeTable/checkVersionGroup',
            payload: {
                versionId: value,
            },
        });
    };

    confirmCopy = () => {
        const { dispatch, getVersionList } = this.props;
        const {
            sourceVersionId,
            targetSemester,
            targetDate,
            copyStudent,
            createDefaultTeachingPlan,
        } = this.state;
        if (this.copyCheck()) {
            return;
        }
        this.setState({
            confirmLoading: true,
        });
        dispatch({
            type: 'timeTable/acrossSemesterCopyVersion',
            payload: {
                sourceVersionId,
                targetSemesterId: targetSemester?.id,
                startTime: moment(targetDate).startOf('week').valueOf(),
                copyStudent: copyStudent === 1,
                createDefaultTeachingPlan: createDefaultTeachingPlan === 1,
            },
        }).then(() => {
            this.setState({
                confirmLoading: false,
            });
            this.hideCopyModal();
            typeof getVersionList == 'function' && getVersionList.call(this);
        });
    };

    judgeConfirmBtnDisabled = () => {
        const { checkVersionGroupResult } = this.props;
        const {
            sourceVersionId,
            targetSemester,
            targetDate,
            copyStudent,
            createDefaultTeachingPlan,
        } = this.state;
        if (checkVersionGroupResult) {
            return (
                sourceVersionId &&
                targetSemester &&
                targetDate &&
                createDefaultTeachingPlan &&
                copyStudent
            );
        } else {
            return sourceVersionId && targetSemester && targetDate && createDefaultTeachingPlan;
        }
    };

    getTargetSemesterDisabled = (type, semesterItem) => {
        const { sourceSemester, targetSemester } = this.state;
        if (type === 'source') {
            if (!targetSemester) {
                return false;
            } else {
                return (
                    moment(semesterItem.semesterEndTime).valueOf() >=
                    moment(targetSemester.semesterEndTime).valueOf()
                );
            }
        }
        if (type === 'target') {
            if (!sourceSemester) {
                return false;
            } else {
                return (
                    moment(semesterItem.semesterEndTime).valueOf() <=
                    moment(sourceSemester.semesterEndTime).valueOf()
                );
            }
        }
    };

    copyCheck = () => {
        const { sourceSemester, targetSemester } = this.state;
        if (
            moment(sourceSemester.semesterStartTime).valueOf() >=
            moment(targetSemester.semesterStartTime).valueOf()
        ) {
            message.warning('复制后学期必须晚于复制前学期');
            return true;
        }
        return false;
    };

    getVersionName = (versionItem) => {
        if (versionItem) {
            return `${versionItem.systemVersionNumber ? versionItem.systemVersionNumber : ''}${
                versionItem.createType === 0 ? '' : '系统调课'
            } ${versionItem.name}`;
        } else return '';
    };

    render() {
        const {
            copyModalVisible,
            planningSemesterInfo,
            copyScheduleVersionList,
            checkVersionGroupResult,
        } = this.props;
        const { confirmLoading, sourceVersionId, sourceDate, targetDate } = this.state;
        return (
            <Modal
                visible={copyModalVisible}
                title="从历史学期复制课表"
                width={950}
                wrapClassName={styles.copyScheduleWrapper}
                footer={[
                    <Button onClick={this.hideCopyModal}>取消</Button>,
                    <Button
                        type="primary"
                        loading={confirmLoading}
                        onClick={this.confirmCopy}
                        style={{
                            opacity: this.judgeConfirmBtnDisabled() ? 1 : 0.45,
                            cursor: this.judgeConfirmBtnDisabled() ? 'pointer' : 'not-allowed',
                        }}
                    >
                        开始复制课表
                    </Button>,
                ]}
                onCancel={this.hideCopyModal}
            >
                <div className={styles.copyModalWrapper}>
                    <div className={styles.item}>
                        <div className={styles.leftPart}>选择来源课表：</div>
                        <div className={styles.semesterRightContent}>
                            <Select
                                onChange={(value) => this.changeSemester('source', value)}
                                placeholder="请选择学期"
                                style={{ minWidth: '165px' }}
                            >
                                {planningSemesterInfo.map((item, index) => {
                                    return (
                                        <Option
                                            value={item.id}
                                            key={item.id}
                                            disabled={this.getTargetSemesterDisabled(
                                                'source',
                                                item
                                            )}
                                        >
                                            {item.schoolYearName} {item.name}
                                        </Option>
                                    );
                                })}
                            </Select>
                            <DatePicker
                                style={{ width: '140px' }}
                                onChange={(date) => this.changeDateChange(date)}
                                disabledDate={(date) => this.getDisabledDate('source', date)}
                                value={sourceDate}
                            />
                            <Select
                                placeholder="请选择课表"
                                style={{ minWidth: '240px' }}
                                onChange={this.selectVersionChange}
                                value={sourceVersionId}
                            >
                                {copyScheduleVersionList.map((item, index) => {
                                    return (
                                        <Option value={item.id} key={item.id}>
                                            {this.getVersionName(item)}{' '}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.leftPart}>复制到的学习周：</div>
                        <div className={styles.semesterRightContent}>
                            <Select
                                onChange={(value) => this.changeSemester('target', value)}
                                placeholder="请选择学期"
                                style={{ minWidth: '165px' }}
                            >
                                {planningSemesterInfo.map((item, index) => {
                                    return (
                                        <Option
                                            value={item.id}
                                            key={item.id}
                                            disabled={this.getTargetSemesterDisabled(
                                                'target',
                                                item
                                            )}
                                        >
                                            {item.schoolYearName} {item.name}
                                        </Option>
                                    );
                                })}
                            </Select>
                            <DatePicker
                                style={{ width: '140px' }}
                                disabledDate={(date) => this.getDisabledDate('target', date)}
                                onChange={this.targetDateChange}
                                value={targetDate}
                            />
                        </div>
                    </div>
                    <div className={styles.item} style={{ alignItems: 'flex-start' }}>
                        <div className={styles.leftPart}>复制内容设置：</div>
                        <div className={styles.copyRightContent}>
                            <div className={styles.topText}>
                                <span className={styles.leftText}>原课表</span>
                                <span>新课表</span>
                            </div>
                            {this.getSettingItem('作息', <Radio checked={true}>复制</Radio>)}
                            {this.getSettingItem('课程', <Radio checked={true}>延用</Radio>)}
                            {this.getSettingItem('教师', <Radio checked={true}>延用</Radio>)}
                            {this.getSettingItem('行政班', <Radio checked={true}>延用</Radio>)}
                            {checkVersionGroupResult &&
                                this.getSettingItem(
                                    '分层选修班',
                                    <Radio checked={true}>
                                        复制（如果已经存在同名班级，则直接使用，不重复复制）
                                    </Radio>
                                )}
                            {checkVersionGroupResult &&
                                this.getSettingItem(
                                    '分层选修班学生',
                                    <Radio.Group
                                        onChange={(e) =>
                                            this.setStateFn('copyStudent', e.target.value)
                                        }
                                    >
                                        <Radio value={1}>从原班级复制</Radio>
                                        <Radio value={2}>维持空班不复制学生</Radio>
                                    </Radio.Group>
                                )}
                            {this.getSettingItem(
                                '课时计划',
                                <Radio.Group
                                    onChange={(e) =>
                                        this.setStateFn('createDefaultTeachingPlan', e.target.value)
                                    }
                                >
                                    <Radio value={1}>基于新课表生成新学期的课时计划</Radio>
                                    <Radio value={2}>暂不生成课时计划</Radio>
                                </Radio.Group>
                            )}
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}
