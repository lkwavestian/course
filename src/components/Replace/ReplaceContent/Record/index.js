import React, { PureComponent } from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { Radio, DatePicker, Select, Button, Table } from 'antd';
import moment from 'moment';
import { withRouter } from 'dva/router';
import { mockForm } from '../../../../utils/utils';
import { trans } from '../../../../utils/i18n';

const { RangePicker } = DatePicker;
const { Option } = Select;
@connect((state) => ({
    recordList: state.replace.recordList,
    gradeList: state.replace.gradeList,
    listAllOrgTeachers: state.replace.listAllOrgTeachers,
    recordListTableLoading: state.replace.recordListTableLoading,
    courseList: state.replace.courseList,
}))
class RecordList extends PureComponent {
    state = {
        getRecordListPayload: {
            startTime: '',
            endTime: '',
            actingType: 0,
        },
        pageSize: 10,
    };

    async componentDidMount() {
        const { dispatch } = this.props;
        const { getRecordListPayload } = this.state;
        await dispatch({
            type: 'replace/setRecordListTableLoading',
            payload: true,
        });
        await dispatch({
            type: 'replace/getRecordList',
            payload: {
                ...getRecordListPayload,
                startTime: getRecordListPayload.startTime,
                endTime: getRecordListPayload.endTime,
            },
        });
        await dispatch({
            type: 'replace/setRecordListTableLoading',
            payload: false,
        });
    }

    changeRecordList = async (type, value) => {
        const { dispatch } = this.props;
        const { getRecordListPayload } = this.state;
        if (type === 'time') {
            this.setState({
                getRecordListPayload: {
                    ...getRecordListPayload,
                    startTime: value.length === 0 ? '' : value[0].valueOf(),
                    endTime: value.length === 0 ? '' : value[1].valueOf() - 999,
                },
            });
            await dispatch({
                type: 'replace/setRecordListTableLoading',
                payload: true,
            });
            await dispatch({
                type: 'replace/getRecordList',
                payload: {
                    ...getRecordListPayload,
                    startTime: value.length === 0 ? '' : value[0].valueOf(),
                    endTime: value.length === 0 ? '' : value[1].valueOf() - 999,
                },
            });
            await dispatch({
                type: 'replace/setRecordListTableLoading',
                payload: false,
            });
        } else {
            this.setState({
                getRecordListPayload: {
                    ...getRecordListPayload,
                    [type]: value,
                },
            });
            await dispatch({
                type: 'replace/setRecordListTableLoading',
                payload: true,
            });
            await dispatch({
                type: 'replace/getRecordList',
                payload: {
                    ...getRecordListPayload,
                    [type]: value,
                },
            });
            await dispatch({
                type: 'replace/setRecordListTableLoading',
                payload: false,
            });
        }
    };

    lookDetail = (requestId) => {
        const { history } = this.props;
        window.open(`/#/replace/index/application?requestId=${requestId}`, '_blank');
    };

    exportActingRequestList = () => {
        const { dispatch } = this.props;
        const { getRecordListPayload } = this.state;
        let obj = {
            ...getRecordListPayload,
            startTime: getRecordListPayload.startTime,
            endTime: getRecordListPayload.endTime,
        };
        let json = JSON.stringify(obj);
        let lastJson = encodeURI(json);
        mockForm('/api/exportActingRequestList', { param: lastJson });
    };

    onShowSizeChange = (current, pageSize) => {
        this.setState({
            pageSize,
        });
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

    render() {
        const { gradeList, listAllOrgTeachers, recordList, recordListTableLoading, courseList } =
            this.props;
        const { pageSize } = this.state;
        const columns = [
            {
                title: trans('global.replace.list.date', '日期'),
                dataIndex: 'resultDate',
                key: 'resultDate',
                align: 'center',
            },
            {
                title: trans('global.replace.pc.exchangeCourse.time', '时间'),
                dataIndex: 'resultTime',
                key: 'resultTime',
                align: 'center',
            },
            {
                title: trans('global.replace.list.course', '课程'),
                dataIndex: currentLang === 'cn' ? 'courseName' : 'courseEnName',
                key: currentLang === 'cn' ? 'courseName' : 'courseEnName',
                align: 'center',
            },
            {
                title: trans('global.replace.pc.exchangeCourse.class', '班级'),
                dataIndex: 'classModelList',
                key: 'classModelList',
                align: 'center',
                render: (classModelList, record) => (
                    <span className={styles.list}>
                        {classModelList.map((item) => (
                            <span>{currentLang === 'cn' ? item.name : item.englishName}</span>
                        ))}
                    </span>
                ),
            },
            {
                title: trans('global.replace.list.originalTeacher', '原授课教师'),
                dataIndex: 'oldTeacherList',
                key: 'oldTeacherList',
                align: 'center',
                render: (oldTeacherList, record) => (
                    <span className={styles.list}>
                        {oldTeacherList
                            .map((item) => (currentLang === 'cn' ? item.name : item.englishName))
                            .join('、')}
                    </span>
                ),
            },
            {
                title: trans('global.replace.list.theSubstitute', '代课教师'),
                dataIndex: 'actingTeacherList',
                key: 'actingTeacherList',
                align: 'center',
                render: (actingTeacherList, record) => (
                    <span className={styles.list}>
                        {actingTeacherList.map((item) => (
                            <span>{currentLang === 'cn' ? item.name : item.englishName}</span>
                        ))}
                    </span>
                ),
            },
            {
                title: trans('global.replace.pc.status', '审批状态'),
                dataIndex: 'status',
                key: 'status',
                render: (status) => <span>{this.getStatusSpan(status)}</span>,
                align: 'center',
            },
            {
                title: trans('global.replace.pc.operate', '操作'),
                key: 'action',
                render: (text, record) => (
                    <a className={styles.action} onClick={() => this.lookDetail(record.id)}>
                        {trans('global.replace.pc.viewDetails', '查看详情')}
                    </a>
                ),
                align: 'center',
            },
        ];
        return (
            <div className={styles.recordList}>
                <div className={styles.header}>
                    <div className={styles.filterList}>
                        <div className={styles.recordFilter}>
                            <Radio.Group
                                defaultValue={0}
                                buttonStyle="solid"
                                onChange={(e) =>
                                    this.changeRecordList('actingType', e.target.value)
                                }
                            >
                                <Radio.Button value={1}>我代的课</Radio.Button>
                                <Radio.Button value={0}>全部</Radio.Button>
                            </Radio.Group>
                        </div>
                        <div className={styles.dateFilter}>
                            <RangePicker onChange={(date) => this.changeRecordList('time', date)} />
                        </div>
                        <div className={styles.gradeFilter}>
                            <Select
                                style={{ width: 180 }}
                                mode="multiple"
                                showSearch
                                showArrow={true}
                                placeholder={trans('global.replace.list.allGrade', '全部年级')}
                                onChange={(value) => this.changeRecordList('gradeIdList', value)}
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
                                        {item.orgName}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        <div className={styles.statusFilter}>
                            <Select
                                style={{ width: 120 }}
                                placeholder={trans('global.replace.list.allStatus', '全部状态')}
                                onChange={(value) => this.changeRecordList('requestStatus', value)}
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
                        </div>
                        <div className={styles.courseFilter}>
                            <Select
                                style={{ width: 180 }}
                                mode="multiple"
                                showSearch
                                showArrow={true}
                                placeholder="全部课程"
                                onChange={(value) => this.changeRecordList('courseIdList', value)}
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
                        </div>
                        <div className={styles.sourceTeacherFilter}>
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
                                onChange={(value) => this.changeRecordList('teacherIdList', value)}
                                allowClear={true}
                            >
                                {listAllOrgTeachers.map((item) => (
                                    <Option value={item.teacherId} key={item.teacherId}>
                                        {currentLang === 'cn' ? item.name : item.englishName}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        <div className={styles.targetTeacherFilter}>
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
                                onChange={(value) =>
                                    this.changeRecordList('actingTeacherIdList', value)
                                }
                                allowClear={true}
                            >
                                {listAllOrgTeachers.map((item) => (
                                    <Option value={item.teacherId} key={item.teacherId}>
                                        {currentLang === 'cn' ? item.name : item.englishName}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                    </div>
                    <div className={styles.application}>
                        <Button
                            type="primary"
                            onClick={this.exportActingRequestList}
                            style={{ backgroundColor: '#0445fc' }}
                        >
                            {trans('global.export', '导出')}
                        </Button>
                    </div>
                </div>
                <div className={styles.table}>
                    <Table
                        columns={columns}
                        dataSource={recordList}
                        bordered
                        loading={recordListTableLoading}
                        rowKey="id"
                        pagination={{
                            total: recordList.length,
                            pageSize,
                            showSizeChanger: true,
                            onShowSizeChange: this.onShowSizeChange,
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default withRouter(RecordList);
