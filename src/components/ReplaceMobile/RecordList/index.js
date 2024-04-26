import React, { PureComponent } from 'react';
import styles from './index.less';

import { connect } from 'dva';
import moment from 'moment';
import { trans } from '../../../utils/i18n';

@connect((state) => ({
    recordList: state.replace.recordList,
}))
export default class RecordList extends PureComponent {
    state = {};

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'replace/getRecordList',
            payload: {
                actingType: 1,
            },
        });
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

    render() {
        const { cur, recordList } = this.props;
        return (
            <div className={styles.recordListWrapper}>
                {recordList.map((recordItem) => {
                    return (
                        <div className={styles.recordItem}>
                            <div className={styles.topPart}>
                                <div className={styles.leftPart}>
                                    <span>{recordItem.courseName}</span>
                                    {recordItem.classModelList.map((item) => (
                                        <span>{item.name}</span>
                                    ))}
                                </div>
                                <div className={styles.rightPart}>
                                    {recordItem.oldTeacherList.map((item) => (
                                        <span>{item.name}</span>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.bottomPart}>
                                <span>{recordItem.resultDate}</span>
                                <span>{recordItem.resultTime}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
}
