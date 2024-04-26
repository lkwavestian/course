import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';
import { mockForm } from '../../../../utils/utils';
import styles from './index.less';
import { trans } from '../../../../utils/i18n';

@connect((state) => ({
    recordList: state.replace.recordList,
    contentWrapperLoading: state.replace.contentWrapperLoading,
}))
export default class RecordTable extends PureComponent {
    state = {
        pageSize: 10,
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
        const { recordList, contentWrapperLoading, currentLang } = this.props;
        const { pageSize } = this.state;
        const columns = [
            {
                title: trans('global.replace.list.date', '日期'),
                dataIndex: 'resultDate',
                key: 'resultDate',
                align: 'center',
            },
            {
                title: trans('global.replace.pc.list.time', '时间'),
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
                title: trans('global.replace.pc.list.class', '班级'),
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
            <div className={styles.table}>
                <Table
                    columns={columns}
                    dataSource={recordList}
                    bordered
                    loading={contentWrapperLoading}
                    rowKey="id"
                    pagination={{
                        total: recordList.length,
                        pageSize,
                        showSizeChanger: true,
                        onShowSizeChange: this.onShowSizeChange,
                    }}
                />
            </div>
        );
    }
}
