import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Radio, DatePicker, Select, Input, Button, Table, Tooltip } from 'antd';
import ApplicationTable from '../ApplicationTable';
import RecordTable from '../RecordTable';
import { withRouter } from 'dva/router';
import { mockForm } from '../../../../utils/utils';
import { trans } from '../../../../utils/i18n';

const { Search } = Input;
const { Option } = Select;

@connect((state) => ({
    applicationList: state.replace.applicationList,
    contentWrapperLoading: state.replace.contentWrapperLoading,
    recordList: state.replace.recordList,
    gradeList: state.replace.gradeList,
    listAllOrgTeachers: state.replace.listAllOrgTeachers,
    courseList: state.replace.courseList,
}))
class Statistics extends PureComponent {
    state = {
        tableType: 'applicationTable',
        applicationListPayload: {
            queryType: 0,
        },
        recordListPayload: {
            actingType: 0,
        },
    };

    componentDidMount() {
        this.getApplicationList();
    }

    radioGroupChange = (e) => {
        let value = e.target.value;
        if (value === 0) {
            this.setState({
                tableType: 'applicationTable',
            });
            this.getApplicationList(0);
        }
        if (value === 1) {
            this.setState({
                tableType: 'recordTable',
            });
            this.getRecordList(0);
        }
    };

    getApplicationList = async () => {
        const { applicationListPayload } = this.state;
        const { dispatch } = this.props;

        await dispatch({
            type: 'replace/setContentWrapperLoading',
            payload: true,
        });
        await dispatch({
            type: 'replace/getApplicationList',
            payload: {
                ...applicationListPayload,
            },
        });
        await dispatch({
            type: 'replace/setContentWrapperLoading',
            payload: false,
        });
    };

    getRecordList = async () => {
        const { dispatch } = this.props;
        const { recordListPayload } = this.state;
        await dispatch({
            type: 'replace/setContentWrapperLoading',
            payload: true,
        });
        await dispatch({
            type: 'replace/getRecordList',
            payload: {
                ...recordListPayload,
            },
        });
        await dispatch({
            type: 'replace/setContentWrapperLoading',
            payload: false,
        });
    };

    changeApplicationListPayload = (type, value) => {
        const { applicationListPayload } = this.state;
        this.setState(
            {
                applicationListPayload: {
                    ...applicationListPayload,
                    [type]: value,
                },
            },
            () => {
                this.getApplicationList();
            }
        );
    };

    changeRecordListPayload = (type, value) => {
        const { recordListPayload } = this.state;
        this.setState(
            {
                recordListPayload: {
                    ...recordListPayload,
                    [type]: value,
                },
            },
            () => {
                this.getRecordList();
            }
        );
    };

    exportActingRequestList = () => {
        const { recordListPayload } = this.state;
        let json = JSON.stringify(recordListPayload);
        let lastJson = encodeURI(json);
        mockForm('/api/exportActingRequestList', { param: lastJson });
    };

    render() {
        const { gradeList, listAllOrgTeachers, courseList, history, currentLang } = this.props;
        const { tableType, applicationListPayload, recordListPayload } = this.state;
        return (
            <div className={styles.statisticsWrapper}>
                <div className={styles.btnList}>
                    <Radio.Group onChange={this.radioGroupChange} defaultValue={0}>
                        <Radio.Button value={0}>
                            {trans('global.replace.pc.list.applications', '申请记录')}
                        </Radio.Button>
                        <Radio.Button value={1}>
                            {trans('global.replace.pc.list.substitutes', '代课记录')}
                        </Radio.Button>
                    </Radio.Group>
                    {tableType === 'applicationTable' ? (
                        <div className={styles.rightPart}>
                            <Select
                                style={{ width: 160 }}
                                mode="multiple"
                                showSearch
                                showArrow={true}
                                placeholder={trans('global.replace.list.allGrade', '全部年级')}
                                value={applicationListPayload.gradeIdList}
                                onChange={(value) =>
                                    this.changeApplicationListPayload('gradeIdList', value)
                                }
                                filterOption={(input, option) =>
                                    option.props.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                                maxTagCount={1}
                                allowClear={true}
                            >
                                {gradeList.map((item) => (
                                    <Option value={item.id} key={item.id}>
                                        {currentLang === 'cn' ? item.orgName : item.orgEname}
                                    </Option>
                                ))}
                            </Select>
                            <Select
                                style={{ width: 120 }}
                                placeholder={trans('global.replace.list.allStatus', '全部状态')}
                                value={applicationListPayload.requestStatus}
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
                                style={{ width: 120 }}
                                placeholder={trans('global.replace.list.form', '来源')}
                                value={applicationListPayload.resource}
                                onChange={(value) =>
                                    this.changeApplicationListPayload('resource', value)
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
                            <Select
                                style={{ width: 120 }}
                                placeholder={trans('global.replace.pc.arrangement', '安排情况')}
                                value={applicationListPayload.arrangeType}
                                onChange={(value) =>
                                    this.changeApplicationListPayload('arrangeType', value)
                                }
                                allowClear={true}
                            >
                                <Option value={1} key={1}>
                                    {trans('global.replace.haveArrangedWell', '已自行安排好')}
                                </Option>
                                <Option value={2} key={2}>
                                    {trans('global.replace.needHelp', '需要教务支持')}
                                </Option>
                            </Select>
                            <Select
                                showSearch
                                mode="multiple"
                                style={{ width: 180 }}
                                showArrow={true}
                                placeholder={trans(
                                    'global.replace.list.searchApplicant',
                                    '搜索选择教师'
                                )}
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.props.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                                value={applicationListPayload.teacherIdList}
                                onChange={(value) =>
                                    this.changeApplicationListPayload('teacherIdList', value)
                                }
                                allowClear={true}
                            >
                                {listAllOrgTeachers.map((item) => (
                                    <Option value={item.teacherId} key={item.teacherId}>
                                        {currentLang === 'cn' ? item.name : item.englishName}
                                    </Option>
                                ))}
                            </Select>
                            <Search
                                placeholder={trans(
                                    'global.replace.list.background',
                                    '搜索动课背景'
                                )}
                                onSearch={(value) =>
                                    this.changeApplicationListPayload('keyWords', value)
                                }
                                style={{ width: 150 }}
                            />
                        </div>
                    ) : (
                        <div className={styles.rightPart}>
                            <Select
                                style={{ width: 180 }}
                                mode="multiple"
                                showSearch
                                showArrow={true}
                                placeholder={trans('global.replace.list.allGrade', '全部年级')}
                                value={recordListPayload.gradeIdList}
                                onChange={(value) =>
                                    this.changeRecordListPayload('gradeIdList', value)
                                }
                                filterOption={(input, option) =>
                                    option.props.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                                maxTagCount={1}
                                allowClear={true}
                            >
                                {gradeList.map((item) => (
                                    <Option value={item.id} key={item.id}>
                                        {currentLang === 'cn' ? item.orgName : item.orgEname}
                                    </Option>
                                ))}
                            </Select>
                            <Select
                                style={{ width: 120 }}
                                placeholder={trans('global.replace.list.allStatus', '全部状态')}
                                value={recordListPayload.recordListPayload}
                                onChange={(value) => this.changeRecordListPayload('c', value)}
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
                                style={{ width: 180 }}
                                mode="multiple"
                                showSearch
                                showArrow={true}
                                placeholder={trans('global.replace.list.allCourses', '全部课程')}
                                value={recordListPayload.courseIdList}
                                onChange={(value) =>
                                    this.changeRecordListPayload('courseIdList', value)
                                }
                                filterOption={(input, option) =>
                                    option.props.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                                allowClear={true}
                            >
                                {courseList.map((item) => (
                                    <Option value={item.id} key={item.id}>
                                        {item.name}
                                    </Option>
                                ))}
                            </Select>
                            <Select
                                showSearch
                                mode="multiple"
                                style={{ width: 180 }}
                                showArrow={true}
                                placeholder={trans(
                                    'global.replace.list.originalTeacher',
                                    '原授课教师'
                                )}
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.props.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                                value={recordListPayload.teacherIdList}
                                onChange={(value) =>
                                    this.changeRecordListPayload('teacherIdList', value)
                                }
                                allowClear={true}
                            >
                                {listAllOrgTeachers.map((item) => (
                                    <Option value={item.teacherId} key={item.teacherId}>
                                        {currentLang === 'cn' ? item.name : item.englishName}
                                    </Option>
                                ))}
                            </Select>
                            <Select
                                showSearch
                                mode="multiple"
                                style={{ width: 180 }}
                                showArrow={true}
                                placeholder={trans('global.replace.list.theSubstitute', '代课教师')}
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.props.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                                value={recordListPayload.actingTeacherIdList}
                                onChange={(value) =>
                                    this.changeRecordListPayload('actingTeacherIdList', value)
                                }
                                allowClear={true}
                            >
                                {listAllOrgTeachers.map((item) => (
                                    <Option value={item.teacherId} key={item.teacherId}>
                                        {currentLang === 'cn' ? item.name : item.englishName}
                                    </Option>
                                ))}
                            </Select>
                            <Button
                                type="primary"
                                onClick={this.exportActingRequestList}
                                style={{ backgroundColor: '#0445fc' }}
                            >
                                {trans('global.Export', '导出')}
                            </Button>
                        </div>
                    )}
                </div>
                {tableType === 'applicationTable' ? (
                    <ApplicationTable history={history} currentLang={currentLang} />
                ) : (
                    <RecordTable history={history} currentLang={currentLang} />
                )}
            </div>
        );
    }
}
export default withRouter(Statistics);
