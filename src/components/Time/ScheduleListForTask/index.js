//时间管理
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Select, Icon, TreeSelect, Table, Popover } from 'antd';
import { locale, trans } from '../../../utils/i18n';
import CreateSchedule from '../TimeTable/OperModal/createSchedule';
import CopySchedule from '../TimeTable/OperModal/copySchedule';
import moment from 'moment';
import { isEmpty } from 'lodash';

const { Option } = Select;
@connect((state) => ({
    planningSchoolListInfo: state.course.planningSchoolListInfo,
    planningSemesterInfo: state.course.planningSemesterInfo,
    currentUser: state.global.currentUser,
    allStageGrade: state.time.allStageGrade,
    //从历史学期复制
    copyModalVisible: state.timeTable.copyModalVisible,
    gradeList: state.time.gradeList,
    taskWeekVersionList: state.timeTable.taskWeekVersionList,
}))
export default class ScheduleListForTask extends PureComponent {
    state = {
        schoolId: undefined,
        semesterValue: undefined,
        gradeValue: [],
        formatAllStageGrade: [],
        scheduleModal: false,
        tableLoading: false,
    };
    componentDidMount() {
        this.getPlanningSchool();
        this.getAllStage();
        this.getTimeGradeList();
    }

    handleChange = (value, type) => {
        if (type === 'selectSchool') {
            this.setState({
                schoolId: value,
                semesterValue: undefined,
            });
        }
        if (type === 'selectSemester') {
            this.setState(
                {
                    semesterValue: value,
                    gradeValue: [],
                },
                () => {
                    this.getTaskWeekVersionList();
                }
            );
        }
        if (type === 'selectGrade') {
            this.setState(
                {
                    gradeValue: value,
                },
                () => {
                    this.getTaskWeekVersionList();
                }
            );
        }
    };

    getCurrentUserInfo = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'global/getCurrentUser',
        }).then(() => {
            const { currentUser } = this.props;
            localStorage.setItem('userIdentity', currentUser && currentUser.currentIdentity);
        });
    };

    getAllStage = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'time/getAllStageGrade',
            payload: {},
        }).then(() => {
            const { allStageGrade } = this.props;
            this.setState({
                formatAllStageGrade: this.formatGrade(allStageGrade),
            });
        });
    };

    getPlanningSchool = async () => {
        const { dispatch } = this.props;
        await dispatch({
            type: 'global/getCurrentUser',
        }).then(() => {
            const { currentUser } = this.props;
            localStorage.setItem('userIdentity', currentUser && currentUser.currentIdentity);
        });
        await dispatch({
            type: 'course/getCouserPlanningSchoolList',
        }).then(() => {
            const { currentUser } = this.props;
            this.setState(
                {
                    schoolId: currentUser.schoolId,
                },
                () => {
                    this.getSemesterInfo();
                }
            );
        });
    };

    getSemesterInfo = () => {
        const { dispatch } = this.props;
        const { schoolId } = this.state;
        dispatch({
            type: 'course/selectBySchoolIdAllSemester',
            payload: {
                schoolId,
            },
            onSuccess: () => {
                const { planningSemesterInfo } = this.props;

                //current：true时表示当前学期，如果没有返回第一个学期
                let currentSemester = planningSemesterInfo.find((item) => item.current);
                this.setState(
                    {
                        semesterValue: currentSemester
                            ? currentSemester.id
                            : planningSemesterInfo[0]?.id,
                    },
                    () => {
                        this.getTaskWeekVersionList();
                    }
                );
            },
        });
    };

    //获取年级
    getTimeGradeList() {
        const { dispatch } = this.props;
        try {
            if (!isEmpty(courseIndex_teachingOrgOutputModelList)) {
                dispatch({
                    type: 'time/getCourseIndexGradeList',
                    payload: courseIndex_teachingOrgOutputModelList,
                });
            } else {
                dispatch({
                    type: 'time/getGradeList',
                    payload: {},
                });
            }
        } catch {
            dispatch({
                type: 'time/getGradeList',
                payload: {},
            });
        }
    }

    //处理年级数据
    formatGrade = (gradeList) => {
        if (!gradeList || gradeList.length < 0) return;
        let gradeData = [];
        gradeList.map((item, index) => {
            let obj = {
                title: item.stageName || item.gradeName,
                value: item.id,
                key: item.id,
                children: this.formatGrade(item.grades),
            };
            gradeData.push(obj);
        });
        return gradeData;
    };

    //弹窗消失
    hideModal = (type) => {
        if (type === 'createSchedule') {
            this.setState({
                scheduleModal: false,
            });
        }
    };

    //弹窗出现
    showModal = (type) => {
        const { dispatch } = this.props;
        if (type === 'createSchedule') {
            this.setState({
                scheduleModal: true,
            });
        }
        if (type === 'copySchedule') {
            dispatch({
                type: 'timeTable/setCopyModalVisible',
                payload: true,
            });
        }
    };

    getVersionList = () => {};

    getTaskWeekVersionList = () => {
        const { dispatch } = this.props;
        const { schoolId, semesterValue, gradeValue } = this.state;
        this.setState(
            {
                tableLoading: true,
            },
            () => {
                dispatch({
                    type: 'timeTable/getTaskWeekVersionList',
                    payload: {
                        schoolId,
                        semesterId: semesterValue,
                        gradeIdList: gradeValue,
                    },
                }).then(() => {
                    this.setState({
                        tableLoading: false,
                    });
                });
            }
        );
    };

    getHistoryVersionList = (sameTimeVersionList) => {
        return (
            <div className={styles.historyVersionList}>
                {sameTimeVersionList?.map((item) => (
                    <div className={styles.versionItem} onClick={this.toSchedulePage}>
                        <span className={styles.leftPart}>
                            {item.systemVersionNumber} {item.name}
                        </span>
                        <span className={styles.rightPart}>
                            <span
                                className={styles.icon}
                                style={{
                                    backgroundColor:
                                        item.lastPublish || item.published
                                            ? '#3FC65E'
                                            : 'rgba(1, 17, 61, 0.45)',
                                }}
                            ></span>
                            <span
                                className={styles.text}
                                style={{
                                    color:
                                        item.lastPublish || item.published
                                            ? '#3FC65E'
                                            : 'rgba(1, 17, 61, 0.45)',
                                }}
                            >
                                {item.lastPublish
                                    ? '最新公布'
                                    : item.published
                                    ? '已公布'
                                    : '未公布'}
                            </span>
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    toSchedulePage = () => {
        //是否是iFrame嵌套
        let isIframe = window.top != window.self;
        if (isIframe) {
            window.open(document.referrer + '#/schedule/coursePlan');
        } else {
            window.open('/courseIndex#/course/index/0');
        }
    };

    render() {
        const {
            planningSchoolListInfo,
            planningSemesterInfo,
            copyModalVisible,
            gradeList,
            taskWeekVersionList,
        } = this.props;
        const {
            schoolId,
            semesterValue,
            gradeValue,
            formatAllStageGrade,
            scheduleModal,
            tableLoading,
        } = this.state;
        const columns = [
            {
                title: '学习周',
                dataIndex: 'weekAcrossTime',
                key: 'weekAcrossTime',
                align: 'center',
                width: '17%',
                render: (text, record) => {
                    let currentTime = moment().valueOf();
                    let isCurrentWeek =
                        currentTime > moment(record.startTime).valueOf() &&
                        currentTime < moment(record.endTime).valueOf();
                    if (isCurrentWeek) {
                        let targetEle = document.querySelector(`[data-row-key='${record.id}']`);
                        targetEle &&
                            targetEle.scrollIntoView({
                                behavior: 'smooth',
                            });
                    }
                    return (
                        <div className={styles.weekAcrossTime}>
                            {isCurrentWeek && <span className={styles.triangle}></span>}
                            {record.weekNumber && <span>{`第${record.weekNumber}周`}</span>}
                            <span>{text}</span>
                        </div>
                    );
                },
            },
            {
                title: '当前课表版本',
                dataIndex: 'systemVersionNumber',
                key: 'systemVersionNumber',
                align: 'center',
                render: (text, record) => (
                    <div className={styles.currentVersion}>
                        <div className={styles.leftPart} onClick={this.toSchedulePage}>
                            <span>
                                {record.systemVersionNumber} {record.name}
                            </span>
                            <div className={styles.isLastPublish}>
                                <span
                                    className={styles.icon}
                                    style={{
                                        backgroundColor: record.lastPublish
                                            ? '#3FC65E'
                                            : 'rgba(1, 17, 61, 0.45)',
                                    }}
                                ></span>
                                <span
                                    style={{
                                        color: record.lastPublish
                                            ? '#3FC65E'
                                            : 'rgba(1, 17, 61, 0.45)',
                                    }}
                                >
                                    {record.lastPublish ? '最新公布' : '未公布'}
                                </span>
                            </div>
                        </div>
                        <div className={styles.rightPart}>
                            <Popover
                                placement="bottomRight"
                                content={this.getHistoryVersionList(record.sameTimeVersionList)}
                                overlayClassName={styles.historyVersionListWrapper}
                            >
                                <div className={styles.historyVersion}>
                                    {!isEmpty(record.sameTimeVersionList) &&
                                    record.sameTimeVersionList.length > 1
                                        ? '历史版本'
                                        : ''}
                                </div>
                            </Popover>
                        </div>
                    </div>
                ),
            },
            {
                title: '当周课表状态',
                dataIndex: 'lastPublishSystemVersionNumber',
                key: 'lastPublishSystemVersionNumber',
                align: 'center',
                width: '10%',
                render: (text) => (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div
                            className={styles.currentWeekStatus}
                            style={{
                                backgroundColor: !text
                                    ? 'rgba(255, 146, 0, 0.1)'
                                    : 'rgba(63, 198, 94, 0.1)',
                                color: !text ? '#FF9200' : '#3FC65E',
                            }}
                        >
                            {!text ? '未公布' : '已公布'}
                        </div>
                    </div>
                ),
            },
            {
                title: '课表单双周',
                dataIndex: 'frequency',
                key: 'frequency',
                align: 'center',
                width: '11%',
                render: (text) => {
                    return <div>{text === 1 ? '单周' : text === 2 ? '双周' : '未区分'}</div>;
                },
            },
            {
                title: '最新公布时间',
                dataIndex: 'releaseStringTime',
                key: 'releaseStringTime',
                align: 'center',
                width: '17%',
            },
        ];
        const gradeProps = {
            treeData: formatAllStageGrade,
            value: gradeValue,
            placeholder: '全部年级',
            onChange: (value) => this.handleChange(value, 'selectGrade'),
            treeCheckable: true,
            treeNodeFilterProp: 'title',
            style: {
                width: 120,
                marginRight: 8,
                verticalAlign: 'middle',
            },
            dropdownStyle: {
                maxHeight: 400,
                overflow: 'auto',
            },
            maxTagCount: 0,
        };
        return (
            <div className={styles.scheduleListForTaskWrapper}>
                <div className={styles.header}>
                    <div className={styles.leftPart}>
                        <Select
                            value={schoolId}
                            className={styles.selectStyle}
                            onChange={(value) => this.handleChange(value, 'selectSchool')}
                            placeholder="请选择学校"
                        >
                            {planningSchoolListInfo &&
                                planningSchoolListInfo.length > 0 &&
                                planningSchoolListInfo.map((item, index) => {
                                    return (
                                        <Option value={item?.schoolId} key={item?.schoolId}>
                                            <span
                                                title={
                                                    locale() != 'en'
                                                        ? item?.name
                                                        : item?.englishName
                                                }
                                            >
                                                {locale() != 'en' ? item?.name : item?.englishName}
                                            </span>
                                        </Option>
                                    );
                                })}
                        </Select>
                        <Select
                            value={semesterValue}
                            className={styles.selectStyle}
                            onChange={(value) => this.handleChange(value, 'selectSemester')}
                            placeholder="请选择学期"
                        >
                            {planningSemesterInfo &&
                                planningSemesterInfo.length > 0 &&
                                planningSemesterInfo.map((item, index) => {
                                    return (
                                        <Option value={item.id} key={item.id}>
                                            {locale() != 'en' ? (
                                                <span>
                                                    {item.schoolYearName} {item.name}
                                                </span>
                                            ) : (
                                                <span>
                                                    {item.schoolYearEname} {item.ename}
                                                </span>
                                            )}
                                        </Option>
                                    );
                                })}
                        </Select>
                        <div style={{ display: 'inline-block', position: 'relative' }}>
                            {gradeValue && gradeValue.length > 0 && (
                                <span className={styles.tagPlaceholder}>
                                    {gradeValue.length}个年级
                                    <span
                                        className={styles.close}
                                        onClick={() => this.handleChange([], 'selectGrade')}
                                    >
                                        <Icon
                                            type="close-circle"
                                            theme="filled"
                                            style={{ color: '#bbb' }}
                                        />
                                    </span>
                                </span>
                            )}

                            <TreeSelect {...gradeProps} />
                        </div>
                    </div>
                    <div className={styles.rightPart}>
                        <span
                            className={styles.btn}
                            onClick={() => this.showModal('createSchedule')}
                        >
                            {trans('global.newTimetable', '新建课表')}
                        </span>
                        <span className={styles.btn} onClick={() => this.showModal('copySchedule')}>
                            从历史学期复制
                        </span>
                    </div>
                </div>
                <Table
                    rowKey="id"
                    dataSource={taskWeekVersionList}
                    columns={columns}
                    bordered
                    className={styles.tableWrapper}
                    pagination={false}
                    loading={tableLoading}
                    scroll={{ y: 'calc(100vh - 170px)' }}
                />
                {scheduleModal && (
                    <CreateSchedule
                        hideModal={this.hideModal}
                        scheduleModal={scheduleModal}
                        getVersionList={this.getTaskWeekVersionList}
                        semesterValue={semesterValue}
                        semesterList={planningSemesterInfo}
                        source="scheduleListForTask"
                        gradeList={gradeList}
                    />
                )}
                {copyModalVisible && <CopySchedule getVersionList={this.getTaskWeekVersionList} />}
            </div>
        );
    }
}
