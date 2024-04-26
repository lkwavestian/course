import React, { PureComponent } from 'react';
import styles from './index.less';

import { connect } from 'dva';
import { Table, Tooltip } from 'antd';
import moment from 'moment';
import { intoChineseLang, weekDayAbbreviationEn } from '../../../../utils/utils';
import { trans } from '../../../../utils/i18n';

@connect((state) => ({
    applicationList: state.replace.applicationList,
    contentWrapperLoading: state.replace.contentWrapperLoading,
}))
export default class ApplicationTable extends PureComponent {
    state = {
        pageSize: 10,
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

    getLessonDetail = (changeScheduleResultDTOList) => {
        const { currentLang } = this.props;
        return (
            <span className={styles.lessonDetailList}>
                {changeScheduleResultDTOList?.map((item) => {
                    let type = this.getExchangeOrReplaceType(item);
                    if (type === 0) {
                        return (
                            <span className={styles.exchangeLessonDetailItem}>
                                <span>
                                    {currentLang === 'cn'
                                        ? item.sourceResult.studentGroups[0].name
                                        : item.sourceResult.studentGroups[0].englishName
                                              .replace('（', '(')
                                              .replace('）', ')')}
                                </span>
                                <span>
                                    {currentLang === 'cn'
                                        ? `周${intoChineseLang(item.sourceResult.weekDay)}第${
                                              item.sourceResult.courseSort
                                          }节`
                                        : `${weekDayAbbreviationEn(
                                              item.sourceResult.weekDay
                                          )} Period ${item.sourceResult.courseSort}`}
                                </span>
                                {moment(item.sourceResult.startTimeMillion).format('MM.DD HH:mm')}
                                <span>
                                    {currentLang === 'cn'
                                        ? item.sourceResult.courseName
                                        : item.sourceResult.courseEnglishName}
                                </span>
                            </span>
                        );
                    }
                    if (type === 1) {
                        return (
                            <span className={styles.replaceLessonDetailItem}>
                                <span className={styles.replaceIcon}>
                                    {trans('global.replace.substitute', '代课')}
                                </span>
                                <span>
                                    {currentLang === 'cn'
                                        ? item.sourceResult.studentGroups[0].name
                                        : item.sourceResult.studentGroups[0].englishName
                                              .replace('（', '(')
                                              .replace('）', ')')}
                                </span>
                                <span>
                                    {currentLang === 'cn'
                                        ? `周${intoChineseLang(item.sourceResult.weekDay)}第${
                                              item.sourceResult.courseSort
                                          }节`
                                        : `${weekDayAbbreviationEn(
                                              item.sourceResult.weekDay
                                          )} Period ${item.sourceResult.courseSort}`}
                                </span>
                                <span>
                                    {moment(item.sourceResult.startTimeMillion).format(
                                        'MM.DD HH:mm'
                                    )}
                                </span>
                                <span>
                                    {currentLang === 'cn'
                                        ? item.sourceResult.courseName
                                        : item.sourceResult.courseEnglishName}
                                </span>
                                <span>
                                    {currentLang === 'cn'
                                        ? `代课人 ${item.actingTeacherList[0].name}`
                                        : `Substituted by ${item.actingTeacherList[0].englishName}`}
                                </span>
                            </span>
                        );
                    }
                    if (type === 2) {
                        return (
                            <span className={styles.exchangeLessonDetailItem}>
                                <span className={styles.exchangeIcon}>
                                    {trans('global.replace.switch', '调换')}
                                </span>
                                <span>
                                    {currentLang === 'cn'
                                        ? item.sourceResult.studentGroups[0].name
                                        : item.sourceResult.studentGroups[0].englishName
                                              .replace('（', '(')
                                              .replace('）', ')')}
                                </span>
                                <span>
                                    {currentLang === 'cn'
                                        ? `周${intoChineseLang(item.sourceResult.weekDay)}第${
                                              item.sourceResult.courseSort
                                          }节`
                                        : `${weekDayAbbreviationEn(
                                              item.sourceResult.weekDay
                                          )} Period ${item.sourceResult.courseSort}`}
                                </span>
                                {moment(item.sourceResult.startTimeMillion).format('MM.DD HH:mm')}
                                <span>
                                    {currentLang === 'cn'
                                        ? item.sourceResult.courseName
                                        : item.sourceResult.courseEnglishName}
                                </span>
                                <span>{trans('global.replace.list.switchedWith', '换课')}</span>
                                <span>
                                    {currentLang === 'cn'
                                        ? `周${intoChineseLang(item.targetResult.weekDay)}第${
                                              item.targetResult.courseSort
                                          }节`
                                        : `${weekDayAbbreviationEn(
                                              item.targetResult.weekDay
                                          )} Period ${item.targetResult.courseSort}`}
                                </span>
                                {moment(item.targetResult.startTimeMillion).format('MM.DD HH:mm')}
                                <span>
                                    {currentLang === 'cn'
                                        ? item.targetResult.courseName
                                        : item.targetResult.courseEnglishName}
                                </span>
                            </span>
                        );
                    }
                })}
            </span>
        );
    };

    getExchangeOrReplaceType = (item) => {
        //1：代课，2：换课，0：无
        if (item.actingTeacherList) {
            return 1;
        }
        if (item.targetResult) {
            return 2;
        }
        return 0;
    };

    onShowSizeChange = (current, pageSize) => {
        this.setState({
            pageSize,
        });
    };

    toApplicationPage = (requestId) => {
        const { history } = this.props;
        window.open(`/#/replace/index/application?requestId=${requestId}`, '_blank');
    };

    render() {
        const { applicationList, contentWrapperLoading, radioGroupValue, currentLang } = this.props;
        const { pageSize } = this.state;
        const columns = [
            {
                title: trans('global.replace.pc.applicant', '申请人'),
                dataIndex: 'teacherModel',
                key: 'teacherModel',
                render: (teacherModel) => (
                    <span className={styles.teacherModel}>
                        {currentLang === 'cn' ? teacherModel.name : teacherModel.englishName}
                    </span>
                ),
                align: 'center',
            },

            {
                title: trans('global.replace.pc.arrangement', '安排情况'),
                dataIndex: 'arrangeType',
                key: 'arrangeType',
                align: 'center',
                render: (text, record) => {
                    return (
                        <span className={styles.tableText}>
                            {text === 1
                                ? trans('global.replace.haveArrangedWell', '已自行安排好')
                                : trans('global.replace.needHelp', '需要教务支持')}
                        </span>
                    );
                },
            },
            {
                title: trans('global.replace.pc.backgroundDescription', '动课事由'),
                dataIndex: 'requestDescription',
                key: 'requestDescription',
                render: (text, record) => {
                    return (
                        <span className={styles.requestDescription}>
                            {text?.length > 20 ? (
                                <Tooltip title={text} className={styles.tableText}>
                                    <span>{`${text.slice(0, 20)}...`}</span>
                                </Tooltip>
                            ) : (
                                <span className={styles.tableText}>{text} </span>
                            )}
                        </span>
                    );
                },
                width: '16%',
            },
            {
                title: trans('global.replace.pc.status', '审批状态'),
                dataIndex: 'status',
                key: 'status',
                render: (status) => (
                    <span className={styles.tableText}>{this.getStatusSpan(status)}</span>
                ),
                align: 'center',
            },
            {
                title: trans('global.replace.pc.lessonDetails', '详细课节说明'),
                dataIndex: 'changeScheduleResultDTOList',
                key: 'changeScheduleResultDTOList',
                render: (changeScheduleResultDTOList) => (
                    <span>{this.getLessonDetail(changeScheduleResultDTOList)}</span>
                ),
                align: 'center',
                width: '42%',
            },
            {
                title: trans('global.replace.pc.submitTime', '申请时间'),
                dataIndex: 'createTime',
                key: 'createTime',
                render: (createTime) => <span className={styles.tableText}>{createTime}</span>,
                align: 'center',
            },
            {
                title: trans('global.replace.pc.operate', '操作'),
                key: 'action',
                render: (text, record) => (
                    <a className={styles.action} onClick={() => this.toApplicationPage(record.id)}>
                        {(record.status === 0 || record.status === 4) && radioGroupValue === 0
                            ? trans('global.replace.pc.approve', '审批')
                            : trans('global.replace.pc.viewDetails', '查看详情')}
                    </a>
                ),
                align: 'center',
            },
        ];
        return (
            <div className={styles.table}>
                <Table
                    columns={columns}
                    dataSource={applicationList}
                    bordered
                    loading={contentWrapperLoading}
                    rowKey="id"
                    pagination={{
                        total: applicationList.length,
                        pageSize,
                        showSizeChanger: true,
                        onShowSizeChange: this.onShowSizeChange,
                    }}
                />
            </div>
        );
    }
}
