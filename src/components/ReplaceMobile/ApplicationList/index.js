import React, { Fragment, PureComponent } from 'react';
import styles from './index.less';
import { Input, Spin, Select } from 'antd';

import { connect } from 'dva';
import moment from 'moment';
import { intoChineseLang, weekDayAbbreviationEn } from '../../../utils/utils';
import { trans } from '../../../utils/i18n';
import { isEmpty } from 'lodash';

const { Search } = Input;
const { Option } = Select;

@connect((state) => ({
    applicationList: state.replace.applicationList,
    recordList: state.replace.recordList,
    contentWrapperLoading: state.replace.contentWrapperLoading,
}))
export default class ApplicationList extends PureComponent {
    state = {
        requestStatus: undefined,
        keyWords: undefined,
        source: undefined,
    };

    componentDidMount() {
        console.log('ReplaceMobile/index/componentDidMount');
        const { dispatch, cur } = this.props;

        //我提交的
        if (cur == 1) {
            dispatch({
                type: 'replace/getApplicationList',
                payload: {
                    queryType: 1,
                },
            });
            document.title = '我提交的';
        }
        //我代的课
        if (cur == 2) {
            dispatch({
                type: 'replace/getRecordList',
                payload: {
                    actingType: 1,
                },
            });
            document.title = '我代的课';
        }
        //待我审批
        if (cur == 3) {
            dispatch({
                type: 'replace/getApplicationList',
                payload: {
                    queryType: 2,
                },
            });
            document.title = '待我审批';
        }
        //我已审批
        if (cur == 4) {
            dispatch({
                type: 'replace/getApplicationList',
                payload: {
                    queryType: 3,
                },
            });
            document.title = '我已审批';
        }
        //全部申请
        if (cur == 5) {
            dispatch({
                type: 'replace/getApplicationList',
                payload: {
                    queryType: 0,
                },
            });
            document.title = '全部申请';
        }
    }

    getStatusSpan = (status) => {
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
        return mapObj[status];
    };

    judgeWeek = (courseTime, weekDayTime) => {
        const { currentLang } = this.props;
        let currentTimeWeek = moment().isoWeek();
        let courseTimeWeek = moment(courseTime).isoWeek();
        let diffWeek = courseTimeWeek - currentTimeWeek;
        if (diffWeek === 0) {
            if (currentLang === 'cn') {
                let weekDay = intoChineseLang(weekDayTime);
                return `本周${weekDay}`;
            } else {
                let weekDay = weekDayAbbreviationEn(weekDayTime);
                return `This ${weekDay}`;
            }
        }
        if (diffWeek === 1) {
            if (currentLang === 'cn') {
                let weekDay = intoChineseLang(weekDayTime);
                return `下周${weekDay}`;
            } else {
                let weekDay = weekDayAbbreviationEn(weekDayTime);
                return `Next ${weekDay}`;
            }
        }
        return moment(courseTime).format('YYYY-MM-DD');
    };

    applicationItemClick = (requestId) => {
        const { history } = this.props;
        history.push(`/replace/mobile/application/index?requestId=${requestId}`);
    };

    changeApplicationListPayload = (type, value) => {
        this.setState(
            {
                [type]: value,
            },
            () => {
                this.getApplicationList();
            }
        );
    };

    getApplicationList = async () => {
        const { dispatch } = this.props;
        const { requestStatus, keyWords, source } = this.state;
        await dispatch({
            type: 'replace/setContentWrapperLoading',
            payload: true,
        });
        await dispatch({
            type: 'replace/getApplicationList',
            payload: {
                requestStatus,
                keyWords,
                queryType: 0,
                source,
            },
        });
        await dispatch({
            type: 'replace/setContentWrapperLoading',
            payload: false,
        });
    };

    render() {
        const { cur, applicationList, contentWrapperLoading, currentLang } = this.props;
        return (
            <Fragment>
                {cur == 5 && (
                    <Fragment>
                        <div className={styles.selectWrapper}>
                            <Select
                                placeholder={trans('global.replace.list.allStatus', '全部状态')}
                                onChange={(value) =>
                                    this.changeApplicationListPayload('requestStatus', value)
                                }
                                allowClear={true}
                            >
                                <Option value={0} key={0}>
                                    {trans('global.replace.pending', '待审批')}
                                </Option>
                                <Option value={4} key={4}>
                                    {trans('global.replace.processing', '待教务处理')}
                                </Option>
                                <Option value={2} key={2}>
                                    {trans('global.replace.rejected', '审批拒绝')}
                                </Option>
                                <Option value={3} key={3}>
                                    {trans('global.replace.canceled', '已撤销')}
                                </Option>
                                <Option value={1} key={1}>
                                    {trans('global.replace.completed', '动课完成')}
                                </Option>
                            </Select>
                            <Select
                                placeholder={trans('global.replace.list.form', '来源')}
                                onChange={(value) =>
                                    this.changeApplicationListPayload('source', value)
                                }
                                allowClear={true}
                                dropdownStyle={{ minWidth: 200 }}
                            >
                                <Option value={0} key={0}>
                                    {trans(
                                        'global.replace.mobileList.changeOrSubstituteOnly',
                                        '调代课自身'
                                    )}
                                </Option>
                                <Option value={1} key={1}>
                                    {trans('global.replace.fromLeaveRequest', '来自请假')}
                                </Option>
                                <Option value={2} key={2}>
                                    {trans('global.replace.fromBusinessTrip', '来自外出')}
                                </Option>
                            </Select>
                            <Search
                                placeholder={trans('global.replace.list.keyword', '关键字搜索')}
                                onSearch={(value) =>
                                    this.changeApplicationListPayload('keyWords', value)
                                }
                                allowClear
                            />
                        </div>
                    </Fragment>
                )}

                <Spin spinning={contentWrapperLoading}>
                    <div className={styles.applicationListWrapper}>
                        {applicationList.map((applicationItem) => {
                            let arrangeType = applicationItem.arrangeType;
                            let status = applicationItem.status;
                            let statusObj = this.getStatusSpan(applicationItem.status);
                            let sourceObj = !isEmpty(applicationItem.changeScheduleResultDTOList)
                                ? applicationItem.changeScheduleResultDTOList[0].sourceResult
                                : {};
                            return (
                                <div
                                    className={styles.applicationItem}
                                    onClick={() => this.applicationItemClick(applicationItem.id)}
                                >
                                    <div className={styles.topPart}>
                                        <img
                                            className={styles.avatar}
                                            src={applicationItem.teacherModel.avatar}
                                        ></img>
                                        <span className={styles.text}>
                                            {cur == 1
                                                ? applicationItem.requestDescription
                                                : currentLang === 'cn'
                                                ? `${applicationItem.teacherModel?.name}的调代课申请`
                                                : `${applicationItem.teacherModel?.englishName}'s application`}
                                        </span>
                                    </div>
                                    <div className={styles.bottomPart}>
                                        <div className={styles.leftPart}>
                                            <div
                                                className={styles.icon}
                                                style={{
                                                    backgroundColor:
                                                        status === 1 || status === 2 || status === 3
                                                            ? '#C5C5C5'
                                                            : arrangeType === 1
                                                            ? '#6193FF'
                                                            : '#FF4500',
                                                }}
                                            ></div>
                                            <div className={styles.text}>
                                                {arrangeType === 1
                                                    ? trans(
                                                          'global.replace.haveArrangedWell',
                                                          '已自行安排好'
                                                      )
                                                    : trans(
                                                          'global.replace.needHelp',
                                                          '需要教务支持'
                                                      )}
                                            </div>
                                        </div>
                                        <div className={styles.rightPart}>
                                            <span>
                                                {this.judgeWeek(
                                                    sourceObj.startTimeMillion,
                                                    sourceObj.weekDay
                                                )}
                                            </span>
                                            <span>{sourceObj.startTime}</span>
                                            <span>
                                                {trans('global.replace.list.starts', '上课')}
                                            </span>
                                        </div>
                                    </div>
                                    <div
                                        className={styles.statusSpan}
                                        style={{
                                            color: statusObj.color,
                                            backgroundColor: statusObj.bgc,
                                        }}
                                    >
                                        {statusObj.title}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Spin>
            </Fragment>
        );
    }
}
