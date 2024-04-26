//保存版本
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Icon, Checkbox, Input, message, Tabs, Modal, Spin } from 'antd';
import { intoChinese } from '../../../../utils/utils';
import { isEmpty } from 'lodash';

import { trans, locale } from '../../../../utils/i18n';

@connect((state) => ({
    scheduleCheckList: state.timeTable.scheduleCheckList,
    studentsCheckList: state.timeTable.studentsCheckList,
    teacherCheckList: state.timeTable.teacherCheckList,
    tableView: state.timeTable.tableView,
    currentSideBar: state.lessonView.currentSideBar,
}))
export default class CheckVersionConflict extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            tabLoading: false,
            tabKey: 1,
            downloadVisible: false,
            isGenerate: false,
            requiredCourse: true,
        };
    }

    changeTab = (key) => {
        const { tabKey, requiredCourse } = this.state;
        const { dispatch, currentVersion } = this.props;
        this.setState(
            {
                tabLoading: true,
                // scheduleCheckList: [],
            },
            () => {
                console.log('tabKey', this.state.tabKey);
            }
        );
        dispatch({
            type:
                key == 1
                    ? 'timeTable/scheduleCheck'
                    : key == 2
                    ? 'timeTable/unListedStudents'
                    : 'timeTable/teacherCare',
            payload: {
                versionId: currentVersion,
                requiredCourse: key == 1 ? requiredCourse : undefined,
            },
        }).then(() => {
            this.setState({
                tabLoading: false,
                // scheduleCheckList: this.props.scheduleCheckList,
            });
        });
    };

    getStr = (list) => {
        if (!list || !list.length) return;
        let str = '-';
        list.map((item, index) => {
            str += `${locale() !== 'en' ? item.name : item.englishName}${
                index == list.length - 1 ? '' : ','
            }`;
        });
        return str;
    };

    // 判断是否已添加
    judgeRepeat = (id, name) => {
        const { scheduleData } = this.props;
        let isRepeat = false;
        for (let i = 0; i < (scheduleData && scheduleData.length); i++) {
            if (
                scheduleData[i].studentGroup.id == id &&
                scheduleData[i].studentGroup.name == name
            ) {
                isRepeat = true;
                break;
            }
        }
        console.log('scheduleData', scheduleData);
        return isRepeat;
    };

    getSchedule = (id, type, name, e) => {
        e.stopPropagation();
        const { tableView, getCustomScheduleInLessonView } = this.props;
        //周节视图
        if (tableView === 'weekLessonView') {
            getCustomScheduleInLessonView(type, id);
        } else {
            //时间轴视图
            // 判断课表中添加的老师是否与当前点击的相等，若相等，课表已存在不添加
            if (this.judgeRepeat(id, name)) {
                if (type == 'teacher') {
                    message.info('课表已存在该教师');
                } else if (type == 'address') {
                    message.info('课表已存在该场地');
                } else if (type == 'student') {
                    message.info('课表已存在该学生');
                }
                return;
            }
            const { dispatch, currentVersion, searchIndex, showExchangeClassTable } = this.props;
            let url = '';
            const params = {};
            params.id = currentVersion;
            params.actionType = searchIndex == 5 && !showExchangeClassTable ? 'custom' : 'detail';
            if (type == 'teacher') {
                url = 'timeTable/findTeacherSchedule';
                params.teacherIds = [id];
                delete params.playgroundIds;
                delete params.studentIds;
                delete params.groupIds;
            } else if (type == 'address') {
                url = 'timeTable/findFieldSchedule';
                params.playgroundIds = [id];
                delete params.teacherIds;
                delete params.studentIds;
                delete params.groupIds;
            } else if (type == 'student') {
                url = 'timeTable/findStudentSchedule';
                params.studentIds = [id];
                delete params.teacherIds;
                delete params.playgroundIds;
                delete params.groupIds;
            } else if (type == 'studentGroup') {
                url = 'timeTable/fetchGroupList';
                params.groupIds = [id];
                delete params.teacherIds;
                delete params.playgroundIds;
                delete params.studentIds;
            } else {
                url = '';
            }
            dispatch({
                type: url,
                payload: params,
            });
        }
    };

    onChange = (e) => {
        this.setState({
            isGenerate: e.target.checked,
        });
    };

    changeVersion = (e) => {
        const { dispatch, currentVersion } = this.props;
        this.setState({
            tabLoading: true,
        });
        this.setState(
            {
                requiredCourse: e.target.checked,
            },
            () => {
                dispatch({
                    type: 'timeTable/scheduleCheck',
                    payload: {
                        versionId: currentVersion,
                        requiredCourse: e.target.checked,
                    },
                }).then(() => {
                    this.setState({
                        tabLoading: false,
                    });
                });
            }
        );
    };

    render() {
        const { tabLoading, downloadVisible, isGenerate, requiredCourse } = this.state;
        const { visible, scheduleCheckList, studentsCheckList, teacherCheckList } = this.props;
        const visibleStyle = visible ? styles.showPopover : styles.hidePopover;
        const { TabPane } = Tabs;
        return (
            <div
                className={styles.checkVersionConflict + '  ' + visibleStyle}
                style={{ top: document.fullscreenElement ? '-50px' : '-150px' }}
            >
                <div className={styles.header}>
                    <span className={styles.close} onClick={this.props.closeCheckVisible}>
                        <Icon type="close" />
                    </span>
                    <span className={styles.title}>
                        {trans('global.Schedule Check', '课表检查')}
                    </span>
                </div>
                <div className={styles.conflictDetail}>
                    <Tabs defaultActiveKey="1" onChange={this.changeTab}>
                        {/* <Spin spinning={this.tabLoading} tip={'loading...'}> */}
                        <TabPane
                            tab={trans('global.Conflict / Empty Space', '冲突/空场地')}
                            key="1"
                        >
                            {
                                <>
                                    <div className={styles.totalMsgWrapper}>
                                        <span className={styles.total}>
                                            {trans('global.checkConflict', '共{$num}条冲突', {
                                                num:
                                                    scheduleCheckList && scheduleCheckList.length
                                                        ? scheduleCheckList.length
                                                        : '0',
                                            })}
                                        </span>
                                        <span>
                                            <Checkbox
                                                value={requiredCourse}
                                                defaultChecked={true}
                                                onChange={this.changeVersion}
                                            />
                                            {trans('global.compulsoryOnly', '只看必修课')}
                                        </span>
                                    </div>
                                    <Spin spinning={tabLoading} tip={'loading...'}>
                                        {tabLoading ? (
                                            <div style={{ height: '80vh' }}></div>
                                        ) : (
                                            <>
                                                <div>
                                                    {scheduleCheckList &&
                                                        scheduleCheckList.length > 0 &&
                                                        scheduleCheckList.map((item, index) => {
                                                            return (
                                                                <div
                                                                    className={
                                                                        styles.conflictContent
                                                                    }
                                                                    key={index}
                                                                >
                                                                    <span className={styles.title}>
                                                                        {/* 周{intoChinese(item.weekDay)}第
                                                                {item.courseSort}节 -
                                                                {item.courseName}
                                                                {this.getStr(item.studentGroupList)} */}
                                                                        {trans(
                                                                            'global.weekPeriod',
                                                                            '周{$num}第{$number}节',
                                                                            {
                                                                                num: intoChinese(
                                                                                    item.weekDay
                                                                                ),
                                                                                number: item.courseSort,
                                                                            }
                                                                        )}
                                                                        -{item.courseName}
                                                                        {this.getStr(
                                                                            item.studentGroupList
                                                                        )}
                                                                    </span>
                                                                    {item.conflictTeacherModelList &&
                                                                    item.conflictTeacherModelList
                                                                        .length > 0 ? (
                                                                        <span
                                                                            className={
                                                                                styles.conflictItem
                                                                            }
                                                                        >
                                                                            <span
                                                                                className={
                                                                                    styles.icon
                                                                                }
                                                                            >
                                                                                <Icon
                                                                                    type="warning"
                                                                                    theme="filled"
                                                                                />
                                                                                {trans(
                                                                                    'global.Teacher Conflict',
                                                                                    '教师冲突'
                                                                                )}
                                                                            </span>
                                                                            <span
                                                                                className={
                                                                                    styles.text
                                                                                }
                                                                            >
                                                                                {item.conflictTeacherModelList.map(
                                                                                    (el, index) => {
                                                                                        return (
                                                                                            <span
                                                                                                className={
                                                                                                    styles.item
                                                                                                }
                                                                                                key={
                                                                                                    index
                                                                                                }
                                                                                                onClick={this.getSchedule.bind(
                                                                                                    this,
                                                                                                    el.id,
                                                                                                    'teacher',
                                                                                                    el.name
                                                                                                )}
                                                                                            >
                                                                                                {
                                                                                                    el.name
                                                                                                }
                                                                                                {
                                                                                                    el.englishName
                                                                                                }
                                                                                            </span>
                                                                                        );
                                                                                    }
                                                                                )}
                                                                            </span>
                                                                        </span>
                                                                    ) : null}
                                                                    {item.conflictStudentModelList &&
                                                                    item.conflictStudentModelList
                                                                        .length > 0 ? (
                                                                        <span
                                                                            className={
                                                                                styles.conflictItem
                                                                            }
                                                                        >
                                                                            <span
                                                                                className={
                                                                                    styles.icon
                                                                                }
                                                                            >
                                                                                <Icon
                                                                                    type="warning"
                                                                                    theme="filled"
                                                                                />
                                                                                {trans(
                                                                                    'global.Student Conflict',
                                                                                    '学生冲突'
                                                                                )}
                                                                            </span>
                                                                            <span
                                                                                className={
                                                                                    styles.text
                                                                                }
                                                                            >
                                                                                {item.conflictStudentModelList.map(
                                                                                    (el, index) => {
                                                                                        return (
                                                                                            <span
                                                                                                className={
                                                                                                    styles.item
                                                                                                }
                                                                                                key={
                                                                                                    index
                                                                                                }
                                                                                                onClick={this.getSchedule.bind(
                                                                                                    this,
                                                                                                    el.id,
                                                                                                    'student',
                                                                                                    el.name
                                                                                                )}
                                                                                            >
                                                                                                {
                                                                                                    el.name
                                                                                                }
                                                                                                {
                                                                                                    el.englishName
                                                                                                }
                                                                                            </span>
                                                                                        );
                                                                                    }
                                                                                )}
                                                                            </span>
                                                                        </span>
                                                                    ) : null}
                                                                    {item.isAddressConflict ? (
                                                                        <span
                                                                            className={
                                                                                styles.conflictItem
                                                                            }
                                                                        >
                                                                            <span
                                                                                className={
                                                                                    styles.icon
                                                                                }
                                                                            >
                                                                                <Icon
                                                                                    type="warning"
                                                                                    theme="filled"
                                                                                />
                                                                                {trans(
                                                                                    'global.Space Conflict',
                                                                                    '场地冲突'
                                                                                )}
                                                                            </span>
                                                                            <span
                                                                                className={
                                                                                    styles.text
                                                                                }
                                                                            >
                                                                                <span
                                                                                    className={
                                                                                        styles.item
                                                                                    }
                                                                                    onClick={this.getSchedule.bind(
                                                                                        this,
                                                                                        item.roomId,
                                                                                        'address',
                                                                                        item.roomName
                                                                                    )}
                                                                                >
                                                                                    {item.roomName}
                                                                                </span>
                                                                            </span>
                                                                        </span>
                                                                    ) : null}
                                                                    {item.isAddressEmpty ? (
                                                                        <span
                                                                            className={
                                                                                styles.conflictItem +
                                                                                '  ' +
                                                                                styles.addressEmpty
                                                                            }
                                                                        >
                                                                            <span
                                                                                className={
                                                                                    styles.icon
                                                                                }
                                                                            >
                                                                                <Icon
                                                                                    type="warning"
                                                                                    theme="filled"
                                                                                />
                                                                                {trans(
                                                                                    'global.Empty Space',
                                                                                    '场地为空'
                                                                                )}
                                                                            </span>
                                                                            <span
                                                                                className={
                                                                                    styles.text
                                                                                }
                                                                            >
                                                                                {item.studentGroupList.map(
                                                                                    (el, index) => {
                                                                                        return (
                                                                                            <span
                                                                                                className={
                                                                                                    styles.item
                                                                                                }
                                                                                                key={
                                                                                                    index
                                                                                                }
                                                                                                onClick={this.getSchedule.bind(
                                                                                                    this,
                                                                                                    el.id,
                                                                                                    'group',
                                                                                                    el.name
                                                                                                )}
                                                                                            >
                                                                                                {
                                                                                                    el.name
                                                                                                }
                                                                                                {
                                                                                                    el.englishName
                                                                                                }
                                                                                            </span>
                                                                                        );
                                                                                    }
                                                                                )}
                                                                            </span>
                                                                        </span>
                                                                    ) : null}
                                                                </div>
                                                            );
                                                        })}
                                                </div>
                                            </>
                                        )}
                                    </Spin>
                                </>
                            }
                        </TabPane>
                        {/* </Spin> */}

                        <TabPane tab={trans('global.Unarranged Students', '未排学生')} key="2">
                            <Spin spinning={tabLoading} tip={'loading...'}>
                                {tabLoading ? (
                                    <div style={{ height: '80vh' }}></div>
                                ) : studentsCheckList && studentsCheckList.length > 0 ? (
                                    <div>
                                        <div className={styles.getGradeStudentNoClassExcelOut}>
                                            <a
                                                href={`api/weekVersion/getGradeStudentNoClassExcelOut?versionId=${this.props.currentVersion}`}
                                                target="_blank"
                                            >
                                                下载未排学生名单
                                            </a>
                                            {/*  <p
                                                onClick={() => {
                                                    this.setState({
                                                        downloadVisible: true,
                                                    });
                                                }}
                                            >
                                                下载未排学生名单
                                            </p> */}
                                            <Modal
                                                title="下载未排学生名单"
                                                visible={downloadVisible}
                                                onOk={this.handleOk}
                                                onCancel={this.handleCancel}
                                                okText="下载"
                                                className={styles.downloadStu}
                                            >
                                                <p>
                                                    <Checkbox
                                                        checked={isGenerate}
                                                        onChange={this.onChange}
                                                    >
                                                        生成未排学生预排课程分班编号
                                                    </Checkbox>
                                                </p>
                                                {isGenerate ? (
                                                    <div>
                                                        <p>
                                                            <span>学生分组</span>
                                                            <span>内容</span>
                                                        </p>
                                                        <p>
                                                            <span>每班人数上限</span>
                                                            <span>
                                                                <Input
                                                                    style={{ width: '55px' }}
                                                                    placeholder="请填数字"
                                                                ></Input>
                                                                女
                                                            </span>
                                                        </p>
                                                    </div>
                                                ) : (
                                                    ''
                                                )}
                                            </Modal>
                                        </div>

                                        <table className={styles.tab}>
                                            <tr className={styles.tr}>
                                                <td className={styles.td}>节次</td>
                                                {studentsCheckList &&
                                                    studentsCheckList.length > 0 &&
                                                    studentsCheckList[0].gradeNameStudent.map(
                                                        (item) => {
                                                            return (
                                                                <td className={styles.td}>
                                                                    {item.gradeEName}
                                                                </td>
                                                            );
                                                        }
                                                    )}
                                            </tr>
                                            {studentsCheckList &&
                                                studentsCheckList.length > 0 &&
                                                studentsCheckList.map((item, index) => {
                                                    return (
                                                        <>
                                                            <tbody>
                                                                <tr>
                                                                    <td className={styles.td}>
                                                                        {item.lessonName}
                                                                    </td>
                                                                    {item.gradeNameStudent.map(
                                                                        (item1) => {
                                                                            return (
                                                                                <td
                                                                                    className={
                                                                                        styles.td
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        item1.gradeStudentCount
                                                                                    }
                                                                                </td>
                                                                            );
                                                                        }
                                                                    )}
                                                                </tr>
                                                            </tbody>
                                                        </>
                                                    );
                                                })}
                                        </table>
                                    </div>
                                ) : (
                                    '暂无未排学生'
                                )}
                            </Spin>
                        </TabPane>
                        <TabPane tab={trans('global.Teacher Caring', '教师关怀')} key="3">
                            <Spin spinning={tabLoading} tip={'loading...'}>
                                {tabLoading ? (
                                    <div style={{ height: '80vh' }}></div>
                                ) : (
                                    <div>
                                        <p className={styles.textMessage}>
                                            <span>
                                                <Icon
                                                    className={styles.textMessageIcon}
                                                    type="info-circle"
                                                />
                                            </span>
                                            <p className={styles.textMessageSpan}>
                                                每个教师在第1、4、5、6节的上课次数统计如下，请根据实际情况判断是否调整
                                            </p>
                                        </p>
                                        <table className={styles.tab}>
                                            <tr className={styles.tr}>
                                                <td className={styles.td}>教师</td>
                                                {this.props.teacherCheckList &&
                                                    this.props.teacherCheckList.length > 0 &&
                                                    this.props.teacherCheckList[0].gradeNameStudent.map(
                                                        (item1) => {
                                                            return (
                                                                <td className={styles.td}>
                                                                    {item1.gradeName}
                                                                </td>
                                                            );
                                                        }
                                                    )}
                                            </tr>
                                            {teacherCheckList &&
                                                teacherCheckList.length > 0 &&
                                                teacherCheckList.map((item, index) => {
                                                    return (
                                                        <>
                                                            <tbody>
                                                                {/* <tr>
                                                    <td  className={styles.td}>节次</td>
                                                        {
                                                            item.gradeNameStudent.map((item1)=>{
                                                                return <td className={styles.td}>{item1.gradeEName}</td> 
                                                            })
                                                        }
                                                </tr> */}
                                                                <tr>
                                                                    <td className={styles.td}>
                                                                        {item.lessonName}
                                                                    </td>
                                                                    {item.gradeNameStudent.map(
                                                                        (item1) => {
                                                                            return (
                                                                                <td
                                                                                    className={
                                                                                        styles.td
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        item1.gradeStudentCount
                                                                                    }
                                                                                </td>
                                                                            );
                                                                        }
                                                                    )}
                                                                </tr>
                                                            </tbody>
                                                        </>
                                                    );
                                                })}
                                        </table>
                                    </div>
                                )}
                            </Spin>
                        </TabPane>
                    </Tabs>
                </div>

                <span
                    className={styles.arrow}
                    style={{ top: document.fullscreenElement ? '70px' : '170px' }}
                ></span>
            </div>
        );
    }
}
