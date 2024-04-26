import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Radio, Button } from 'antd';
import { withRouter } from 'dva/router';

import styles from './index.less';
import ApplicationTable from '../ApplicationTable';
import RecordTable from '../RecordTable';
import { trans } from '../../../../utils/i18n';

@connect((state) => ({
    applicationList: state.replace.applicationList,
    contentWrapperLoading: state.replace.contentWrapperLoading,
    recordList: state.replace.recordList,
    personalChangeCourseCount: state.replace.personalChangeCourseCount,
}))
class MyReplace extends PureComponent {
    state = {
        tableType: 'applicationTable',
        radioGroupValue: 0,
    };

    componentDidMount() {
        this.getPersonalChangeCourseCount();
        this.getApplicationList(2);
    }

    radioGroupChange = (e) => {
        let value = e.target.value;
        localStorage.setItem('applicationQueryType', value);
        if (value === 0) {
            this.getApplicationList(2);
        }
        if (value === 1) {
            this.getApplicationList(3);
        }
        if (value === 2) {
            this.getApplicationList(1);
        }
        if (value === 3) {
            this.getRecordList(1);
            this.setState({
                tableType: 'recordTable',
            });
        } else {
            this.setState({
                tableType: 'applicationTable',
            });
        }
        this.setState({
            radioGroupValue: value,
        });
    };

    getApplicationList = async (queryType) => {
        const { dispatch } = this.props;

        await dispatch({
            type: 'replace/setContentWrapperLoading',
            payload: true,
        });
        await dispatch({
            type: 'replace/getApplicationList',
            payload: {
                queryType,
            },
        });
        await dispatch({
            type: 'replace/setContentWrapperLoading',
            payload: false,
        });
    };

    getRecordList = async (actingType) => {
        const { dispatch } = this.props;
        await dispatch({
            type: 'replace/setContentWrapperLoading',
            payload: true,
        });
        await dispatch({
            type: 'replace/getRecordList',
            payload: {
                actingType,
            },
        });
        await dispatch({
            type: 'replace/setContentWrapperLoading',
            payload: false,
        });
    };

    getPersonalChangeCourseCount = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'replace/getPersonalChangeCourseCount',
        });
    };

    render() {
        const {
            personalChangeCourseCount: { changeCourseCount, actingCount, helpActingCount },
            history,
            currentLang,
        } = this.props;
        const { tableType, radioGroupValue } = this.state;

        return (
            <div className={styles.myReplaceWrapper}>
                <div className={styles.header}>
                    <Radio.Group onChange={this.radioGroupChange} defaultValue={0}>
                        <Radio.Button value={0}>
                            {trans('global.replace.pc.my.pending', '待我审批')}
                        </Radio.Button>
                        <Radio.Button value={1}>
                            {trans('global.replace.pc.my.approved', '我已审批')}
                        </Radio.Button>
                        <Radio.Button value={2}>
                            {trans('global.replace.pc.my.submitted', '我提交的')}
                        </Radio.Button>
                        <Radio.Button value={3}>
                            {trans('global.replace.pc.my.substitutes', '我代的课')}
                        </Radio.Button>
                    </Radio.Group>
                    <div className={styles.subtotal}>
                        <span className={styles.leftPart}>
                            {trans('global.replace.home.subtotalForThisSemester', '本学期小计')}
                        </span>
                        <span className={styles.rightPart}>
                            <span className={styles.totalItem}>
                                <span> {trans('global.replace.home.adjustments', '申请调课')}</span>
                                <span className={styles.count}>{changeCourseCount}</span>
                            </span>
                            <span className={styles.totalItem}>
                                <span>
                                    {trans('global.replace.home.substitutesApplyed', '申请代课')}
                                </span>
                                <span className={styles.count}>{actingCount}</span>
                            </span>
                            <span className={styles.totalItem}>
                                <span>
                                    {trans('global.replace.home.substitutesHelped', '帮人代课')}
                                </span>
                                <span className={styles.count}>{helpActingCount}</span>
                            </span>
                        </span>
                    </div>
                    <div>
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
                {tableType === 'applicationTable' ? (
                    <ApplicationTable
                        radioGroupValue={radioGroupValue}
                        history={history}
                        currentLang={currentLang}
                    />
                ) : (
                    <RecordTable history={history} currentLang={currentLang} />
                )}
            </div>
        );
    }
}
export default withRouter(MyReplace);
