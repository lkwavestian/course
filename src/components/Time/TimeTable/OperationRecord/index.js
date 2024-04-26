//操作记录
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Spin } from 'antd';
import { isEmpty } from 'lodash';
import RecordCard from './RecordCard';
import BlankContent from './BlankContent';

@connect((state) => ({
    operationRecordList: state.timeTable.operationRecordList,
    tableView: state.timeTable.tableView,
}))
export default class OperationRecord extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            operationRecordList: '',
        };
    }

    componentDidMount() {
        this.getOperationRecordList(this.props.versionId);
    }

    getOperationRecordList = (versionId) => {
        this.setState({
            operationRecordList: '',
        });
        this.props
            .dispatch({
                type: 'timeTable/getOperationRecordList',
                payload: {
                    versionId: versionId,
                },
            })
            .then(() => {
                this.setState({
                    operationRecordList: this.props.operationRecordList,
                });
            });
    };

    resumeStyle = () => {
        const sourceEle = document.getElementsByClassName('sourceEle');
        const targetEle = document.getElementsByClassName('targetEle');

        !isEmpty(sourceEle) &&
            Array.from(sourceEle).forEach((item) => {
                item.classList.remove('sourceEle');
            });

        !isEmpty(targetEle) &&
            Array.from(targetEle).forEach((item) => {
                item.classList.remove('targetEle');
            });
    };

    render() {
        const { operationRecordList } = this.state;
        const { versionId } = this.props;
        return (
            <div className={styles.wrapper}>
                {!isEmpty(operationRecordList) ? (
                    operationRecordList.map((record) => {
                        return (
                            <div className={styles.recordWrapper} onClick={this.resumeStyle}>
                                <RecordCard
                                    showTable={this.props.showTable}
                                    record={record}
                                    dispatch={this.props.dispatch}
                                    getOperationRecordList={() =>
                                        this.getOperationRecordList(versionId)
                                    }
                                    fetchScheduleList={this.props.fetchScheduleList}
                                    currentVersion={this.props.currentVersion}
                                    searchIndex={this.props.searchIndex}
                                    showExchangeClassTable={this.props.showExchangeClassTable}
                                    scheduleData={this.props.scheduleData}
                                    setDetailId={this.props.setDetailId}
                                    fetchCourseList={this.props.fetchCourseList}
                                    published={this.props.published}
                                    getCustomScheduleInLessonView={
                                        this.props.getCustomScheduleInLessonView
                                    }
                                    fetchWillArrangeList={this.props.fetchWillArrangeList}
                                    tableView={this.props.tableView}
                                />
                                <div className={styles.divider}></div>
                            </div>
                        );
                    })
                ) : Array.isArray(operationRecordList) ? (
                    <BlankContent />
                ) : (
                    <Spin className={styles.loading} tip="loading..." />
                )}
            </div>
        );
    }
}
