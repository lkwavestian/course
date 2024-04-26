import React, { PureComponent } from 'react';
import styles from './index.less';
import { withRouter } from 'dva/router';

import { connect } from 'dva';
import { Radio, DatePicker, Select, Input, Button, Table, Tooltip } from 'antd';
import moment from 'moment';
import { isEmpty } from 'lodash';
import { intoChineseLang, weekDayAbbreviationEn } from '../../../../utils/utils';
import { trans } from '../../../../utils/i18n';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;
@connect((state) => ({
    applicationList: state.replace.applicationList,
    gradeList: state.replace.gradeList,
    listAllOrgTeachers: state.replace.listAllOrgTeachers,
    applicationListTableLoading: state.replace.applicationListTableLoading,
}))
class ApplicationList extends PureComponent {
    state = {
        getApplicationListPayload: {
            startTime: '',
            endTime: '',
            queryType: Number(localStorage.getItem('applicationQueryType'))
                ? Number(localStorage.getItem('applicationQueryType'))
                : 0,
        },
        pageSize: 10,
    };

    async componentDidMount() {
        const { dispatch } = this.props;
        const { getApplicationListPayload } = this.state;
        await dispatch({
            type: 'replace/setApplicationListTableLoading',
            payload: true,
        });
        await dispatch({
            type: 'replace/getApplicationList',
            payload: {
                ...getApplicationListPayload,
                startTime: getApplicationListPayload.startTime,
                endTime: getApplicationListPayload.endTime,
            },
        });
        await dispatch({
            type: 'replace/setApplicationListTableLoading',
            payload: false,
        });
    }

    changeApplicationList = async (type, value) => {
        const { dispatch } = this.props;
        const { getApplicationListPayload } = this.state;
        if (type === 'time') {
            this.setState({
                getApplicationListPayload: {
                    ...getApplicationListPayload,
                    startTime: value.length === 0 ? '' : value[0].valueOf(),
                    endTime: value.length === 0 ? '' : value[1].valueOf() - 999,
                },
            });
            await dispatch({
                type: 'replace/setApplicationListTableLoading',
                payload: true,
            });
            await dispatch({
                type: 'replace/getApplicationList',
                payload: {
                    ...getApplicationListPayload,
                    startTime: value.length === 0 ? '' : value[0].valueOf(),
                    endTime: value.length === 0 ? '' : value[1].valueOf() - 999,
                },
            });
            await dispatch({
                type: 'replace/setApplicationListTableLoading',
                payload: false,
            });
        } else {
            this.setState({
                getApplicationListPayload: {
                    ...getApplicationListPayload,
                    [type]: value,
                },
            });
            await dispatch({
                type: 'replace/setApplicationListTableLoading',
                payload: true,
            });
            await dispatch({
                type: 'replace/getApplicationList',
                payload: {
                    ...getApplicationListPayload,
                    [type]: value,
                },
            });
            await dispatch({
                type: 'replace/setApplicationListTableLoading',
                payload: false,
            });
        }
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

    toApplicationPage = (requestId) => {
        const { history } = this.props;
        window.open(`/#/replace/index/application?requestId=${requestId}`, '_blank');
    };

    queryTypeChange = (e) => {
        localStorage.setItem('applicationQueryType', e.target.value);
        this.changeApplicationList('queryType', e.target.value);
    };

    onShowSizeChange = (current, pageSize) => {
        this.setState({
            pageSize,
        });
    };

    render() {
        const {
            gradeList,
            listAllOrgTeachers,
            applicationList,
            applicationListTableLoading,
            currentLang,
        } = this.props;
        const { getApplicationListPayload, pageSize } = this.state;
        const columns = [
            {
                title: '申请人',
                dataIndex: 'teacherModel',
                key: 'teacherModel',
                render: (teacherModel) => (
                    <span className={styles.teacherModel}>
                        {currentLang === 'cn' ? teacherModel.name : teacherModel.englishName}
                    </span>
                ),
                align: 'center',
                // width: 133,
            },
            {
                title: trans('global.replace.pc.arrangement', '安排情况'),
                dataIndex: 'arrangeType',
                key: 'arrangeType',
                // width: 130,
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
                title: '动课事由',
                dataIndex: 'requestDescription',
                key: 'requestDescription',
                // width: 250,
                render: (text, record) => {
                    return (
                        <span className={styles.requestDescription}>
                            {text?.length > 20 ? (
                                <Tooltip title={text}>
                                    <span>{`${text.slice(0, 20)}...`}</span>
                                </Tooltip>
                            ) : (
                                <span>{text}</span>
                            )}
                        </span>
                    );
                },
            },
            {
                title: '审批状态',
                dataIndex: 'status',
                key: 'status',
                render: (status) => (
                    <span className={styles.tableText}>{this.getStatusSpan(status)}</span>
                ),
                align: 'center',
                // width: 130,
            },
            {
                title: '详细课节说明',
                dataIndex: 'changeScheduleResultDTOList',
                key: 'changeScheduleResultDTOList',
                render: (changeScheduleResultDTOList) => (
                    <span>{this.getLessonDetail(changeScheduleResultDTOList)}</span>
                ),
                align: 'center',
                width: '42%',
            },
            {
                title: '申请时间',
                dataIndex: 'createTime',
                key: 'createTime',
                render: (createTime) => <span className={styles.tableText}>{createTime}</span>,
                align: 'center',
                // width: 156,
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <a className={styles.action} onClick={() => this.toApplicationPage(record.id)}>
                        {(record.status === 0 || record.status === 4) &&
                        getApplicationListPayload.queryType === 2
                            ? '审批'
                            : '查看详情'}
                    </a>
                ),
                align: 'center',
                // width: 124,
            },
        ];
        return (
            <div className={styles.applicationList}>
                <div className={styles.header}>
                    <div className={styles.filterList}>
                        <div className={styles.applicationFilter}>
                            <Radio.Group
                                defaultValue={getApplicationListPayload.queryType}
                                buttonStyle="solid"
                                onChange={(e) => {
                                    this.queryTypeChange(e);
                                }}
                            >
                                <Radio.Button value={1}>我提交的</Radio.Button>
                                <Radio.Button value={2}>待我审批</Radio.Button>
                                <Radio.Button value={0}>全部</Radio.Button>
                            </Radio.Group>
                        </div>
                        <div className={styles.dateFilter}>
                            <RangePicker
                                onChange={(date) => this.changeApplicationList('time', date)}
                            />
                        </div>
                        <div className={styles.gradeFilter}>
                            <Select
                                style={{ width: 160 }}
                                mode="multiple"
                                showSearch
                                showArrow={true}
                                placeholder={trans('global.replace.list.allGrade', '全部年级')}
                                onChange={(value) =>
                                    this.changeApplicationList('gradeIdList', value)
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
                        </div>
                        <div className={styles.statusFilter}>
                            <Select
                                style={{ width: 120 }}
                                placeholder={trans('global.replace.list.allStatus', '全部状态')}
                                onChange={(value) =>
                                    this.changeApplicationList('requestStatus', value)
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
                        </div>
                        <div className={styles.typeFilter}>
                            <Select
                                style={{ width: 120 }}
                                placeholder={trans('global.replace.pc.arrangement', '安排情况')}
                                onChange={(value) =>
                                    this.changeApplicationList('arrangeType', value)
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
                        </div>
                        <div className={styles.teacherFilter}>
                            <Select
                                showSearch
                                mode="multiple"
                                style={{ width: 180 }}
                                showArrow={true}
                                placeholder="请选择申请人"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.props.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                                onChange={(value) =>
                                    this.changeApplicationList('teacherIdList', value)
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
                        <div className={styles.bgcFilter}>
                            <Search
                                placeholder={trans(
                                    'global.replace.list.background',
                                    '搜索动课背景'
                                )}
                                onSearch={(value) => this.changeApplicationList('keyWords', value)}
                                style={{ width: 150 }}
                            />
                        </div>
                    </div>
                    <div className={styles.application}>
                        <Button
                            type="primary"
                            href="/#/replace/index/application"
                            target="_blank"
                            style={{ backgroundColor: '#0445fc' }}
                        >
                            {trans('global.replace.submitApplication', '申请调代课')}
                        </Button>
                    </div>
                </div>
                <div className={styles.table}>
                    <Table
                        columns={columns}
                        dataSource={applicationList}
                        bordered
                        loading={applicationListTableLoading}
                        rowKey="id"
                        pagination={{
                            total: applicationList.length,
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
export default withRouter(ApplicationList);
