import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import styles from './index.less';
import { DatePicker, Table, Button, Icon } from 'antd';
import { getUrlSearch } from '../../utils/utils';
import moment from 'moment';
import { isEmpty } from 'lodash';

@connect((state) => ({
    semesterWeekDetailList: state.organize.semesterWeekDetailList,
    planningSemesterInfo: state.course.planningSemesterInfo,
    schoolYearListInfo: state.organize.schoolYearListInfo,
}))
class TeachingWeekManage extends PureComponent {
    state = {
        selectKey: 0,
        startTime: undefined,
        endTime: undefined,
        confirmLoading: false,
        currentSemester: {},
        currentSchoolYear: {},
    };

    componentDidMount() {
        this.initialData();
        // this.getSemesterInfo();
        this.getSchoolYearList();
    }

    initialData = () => {
        const { dispatch } = this.props;
        this.setState(
            {
                startTime: undefined,
                endTime: undefined,
                confirmLoading: true,
            },
            () => {
                const { selectKey } = this.state;
                let semesterId = Number(getUrlSearch('semesterId'));
                let schoolId = Number(getUrlSearch('schoolId'));
                dispatch({
                    type: 'organize/getSemesterWeekDetailList',
                    payload: {
                        schoolId,
                        semesterId,
                        stage: selectKey + 1,
                    },
                }).then(() => {
                    this.setState({
                        confirmLoading: false,
                    });
                });
            }
        );
    };

    /* getSemesterInfo = () => {
        const { dispatch } = this.props;
        let semesterId = Number(getUrlSearch('semesterId'));
        let schoolId = Number(getUrlSearch('schoolId'));
        dispatch({
            type: 'course/selectBySchoolIdAllSemester',
            payload: {
                schoolId,
            },
            onSuccess: () => {
                const { planningSemesterInfo } = this.props;
                let currentSemester = planningSemesterInfo.find((item) => item.id === semesterId);
                this.setState({
                    currentSemester,
                });
            },
        });
    }; */

    getSchoolYearList = () => {
        const { dispatch } = this.props;
        let schoolId = Number(getUrlSearch('schoolId'));
        dispatch({
            type: 'organize/getSchoolYearList',
            payload: {
                companyId: 1, // 机构id
                schoolId, // 学校id
            },
            onSuccess: () => {
                const { schoolYearListInfo } = this.props;
                let schoolYearId = Number(getUrlSearch('schoolYearId'));
                let semesterId = Number(getUrlSearch('semesterId'));
                let currentSchoolYear = schoolYearListInfo.find((item) => item.id === schoolYearId);
                let currentSemester = currentSchoolYear?.semesterOutputModels.find(
                    (item) => item.id === semesterId
                );
                this.setState({
                    currentSchoolYear,
                    currentSemester,
                });
            },
        });
    };

    changeSelectKey = (selectKey) => {
        this.setState(
            {
                selectKey,
            },
            () => {
                this.initialData();
            }
        );
    };

    saveSemesterWeekDetail = () => {
        const { dispatch } = this.props;
        const { selectKey, startTime, endTime } = this.state;
        let semesterId = Number(getUrlSearch('semesterId'));
        let schoolId = Number(getUrlSearch('schoolId'));
        let startTimeVal = moment(startTime).startOf('day').valueOf();
        let endTimeVal = moment(endTime).endOf('day').valueOf() - 999;
        this.setState(
            {
                confirmLoading: true,
            },
            () => {
                dispatch({
                    type: 'organize/saveSemesterWeekDetail',
                    payload: {
                        startTime: startTimeVal,
                        endTime: endTimeVal,
                        weekNumber: 1,
                        semesterId,
                        stage: selectKey + 1,
                        frequency: 1,
                    },
                }).then(() => {
                    dispatch({
                        type: 'organize/getSemesterWeekDetailList',
                        payload: {
                            schoolId,
                            semesterId,
                            stage: selectKey + 1,
                            paramStartTime: startTimeVal,
                            paramEndTime: endTimeVal,
                        },
                    }).then(() => {
                        this.setState({
                            confirmLoading: false,
                        });
                    });
                });
            }
        );
    };

    dateChange = (date, type) => {
        if (type === 'startTime') {
            this.setState({
                startTime: date,
            });
        }
        if (type === 'endTime') {
            this.setState({
                endTime: date,
            });
        }
    };

    getDisabledDate = (date) => {
        const { currentSemester } = this.state;
        return (
            date.valueOf() > moment(currentSemester.semesterEndTime).valueOf() ||
            date.valueOf() < moment(currentSemester.semesterStartTime).valueOf()
        );
    };

    judgeBtnType = () => {
        const { semesterWeekDetailList } = this.props;
        if (isEmpty(semesterWeekDetailList)) {
            return '设置教学周';
        } else {
            return '重新设置教学周';
        }
    };

    getBackUpText = () => {
        const { currentSemester, currentSchoolYear } = this.state;
        return `${currentSchoolYear.name}${currentSemester.name}教学周设置`;
    };

    backUpClick = () => {
        window.history.back();
    };

    render() {
        const { semesterWeekDetailList } = this.props;
        const { selectKey, startTime, endTime, confirmLoading } = this.state;
        const columns = [
            {
                title: '周次',
                dataIndex: 'weekNumber',
                key: 'weekNumber',
                align: 'center',
                width: 150,
            },
            {
                title: '单双周',
                dataIndex: 'frequency',
                key: 'frequency',
                align: 'center',
                width: 150,
                render: (text, record) => {
                    return (
                        <div>
                            {record.frequency === 1 ? '单周' : record.frequency === 2 ? '双周' : ''}
                        </div>
                    );
                },
            },
            {
                title: '月份',
                dataIndex: 'month',
                key: 'month',
                align: 'center',
                width: 150,
                render: (text, record) => {
                    return <div>{moment(record.startDate).format('M')}月</div>;
                },
            },
            {
                title: '开始时间',
                dataIndex: 'startDate',
                key: 'startDate',
                align: 'center',
                width: 250,
            },
            {
                title: '结束时间',
                dataIndex: 'endDate',
                key: 'endDate',
                align: 'center',
                width: 250,
            },
        ];
        return (
            <div className={styles.teachingWeekManageWrapper}>
                <div className={styles.header}>
                    <div className={styles.backUp} onClick={this.backUpClick}>
                        <Icon type="left" className={styles.icon} />
                        <span>{this.getBackUpText()}</span>
                    </div>

                    <div className={styles.tabsList}>
                        {['幼儿园', '小学', '初中', '高中'].map((item, index) => {
                            return selectKey === index ? (
                                <div key={index}>
                                    <span className={styles.text}>{item}</span>
                                    <span className={styles.line}></span>
                                </div>
                            ) : (
                                <span
                                    onClick={() => this.changeSelectKey(index)}
                                    key={index}
                                    className={styles.tabItem}
                                >
                                    {item}
                                </span>
                            );
                        })}
                    </div>
                </div>
                <div className={styles.content}>
                    <div className={styles.dateListWrapper}>
                        <div className={styles.dateSelect}>
                            <span>教学周开始时间</span>
                            <DatePicker
                                onChange={(date) => this.dateChange(date, 'startTime')}
                                value={startTime}
                                disabledDate={(date) => this.getDisabledDate(date)}
                            />
                        </div>
                        <div className={styles.dateSelect}>
                            <span>教学周结束时间</span>
                            <DatePicker
                                onChange={(date) => this.dateChange(date, 'endTime')}
                                value={endTime}
                                disabledDate={(date) => this.getDisabledDate(date)}
                            />
                        </div>
                        {startTime && endTime ? (
                            <div
                                className={styles.confirmBtn}
                                onClick={this.saveSemesterWeekDetail}
                            >
                                {this.judgeBtnType()}
                            </div>
                        ) : (
                            <div className={styles.disabledBtn}> {this.judgeBtnType()}</div>
                        )}
                    </div>
                    <Table
                        dataSource={semesterWeekDetailList}
                        columns={columns}
                        loading={confirmLoading}
                        style={{ width: '70%' }}
                        rowKey="id"
                        pagination={false}
                        scroll={{ y: 'calc(100vh - 240px)' }}
                    />
                </div>
            </div>
        );
    }
}
export default withRouter(TeachingWeekManage);
