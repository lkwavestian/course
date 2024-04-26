//调代课移动端首页
import React, { PureComponent } from 'react';
import styles from './index.less';

import { Icon } from 'antd';
import { connect } from 'dva';
import { trans } from '../../../utils/i18n';

@connect((state) => ({
    totalApplicationList: state.replace.totalApplicationList,
    applicationList: state.replace.applicationList,
    recordList: state.replace.recordList,
    numList: state.replace.numList,
    personalChangeCourseCount: state.replace.personalChangeCourseCount,
}))
export default class HomePage extends PureComponent {
    state = {};

    componentDidMount() {
        this.getPersonalChangeCourseCount();
        this.getApplicationList();
        document.title = '调代课';
    }

    getPersonalChangeCourseCount = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'replace/getPersonalChangeCourseCount',
        });
    };

    getApplicationList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'replace/geTotalApplicationList',
            payload: {
                queryType: 0,
            },
        });
        dispatch({
            type: 'replace/getApplicationList',
            payload: {
                queryType: 2,
            },
        });
    };

    getCurItem = (cur) => {
        let mapObj = {
            1: {
                title: trans('global.replace.home.submittedByMe', '我提交的'),
            },
            2: {
                title: trans('global.replace.home.submittedForOthers', '我代的课'),
            },
            3: {
                title: trans('global.replace.home.waitingApproval', '待我审批'),
                num: 22,
            },
            4: {
                title: trans('global.replace.home.approved', '我已审批'),
            },
            5: {
                title: trans('global.replace.home.allApplications', '全部申请'),
            },
        };
        const { totalApplicationList, applicationList } = this.props;
        let curObj = mapObj[cur];
        return (
            <div className={styles.curItem} onClick={() => this.curItemClick(cur)}>
                <div className={styles.leftPart}>
                    <span className={styles.curText}>{curObj.title}</span>
                    {cur === '3' && applicationList.length !== 0 && (
                        <span className={styles.num}>{applicationList.length}</span>
                    )}
                    {cur == '5' && (
                        <span className={styles.explainText}>
                            <span>{`${
                                totalApplicationList.filter(
                                    (item) => item.status === 0 || item.status === 4
                                ).length
                            } ${trans('global.replace.home.inProgress', '进行中')}`}</span>
                        </span>
                    )}
                </div>
                <Icon type="right" className={styles.curIcon} />
            </div>
        );
    };

    curItemClick = (cur) => {
        const { history } = this.props;
        history.push(`/replace/mobile/index/${cur}`);
    };

    render() {
        const {
            personalChangeCourseCount: { changeCourseCount, actingCount, helpActingCount },
        } = this.props;
        return (
            <div className={styles.mainListWrapper}>
                <div className={styles.subtotal + ' ' + styles.commonBgc}>
                    <div className={styles.text}>
                        {trans('global.replace.home.subtotalForThisSemester', '本学期小计')}
                    </div>
                    <div className={styles.list}>
                        <span className={styles.listItem}>
                            <span className={styles.number}>{changeCourseCount}</span>
                            <span className={styles.itemText}>
                                {trans('global.replace.home.adjustments', '申请调课')}
                            </span>
                        </span>
                        <span className={styles.listItem}>
                            <span className={styles.number}>{actingCount}</span>
                            <span className={styles.itemText}>
                                {trans('global.replace.home.substitutesApplyed', '申请代课')}
                            </span>
                        </span>
                        <span className={styles.listItem}>
                            <span className={styles.number}>{helpActingCount}</span>
                            <span className={styles.itemText}>
                                {trans('global.replace.home.substitutesHelped', '帮人代课')}
                            </span>
                        </span>
                    </div>
                </div>
                <div className={styles.curList + ' ' + styles.commonBgc}>
                    {this.getCurItem('1')}
                    {this.getCurItem('2')}
                </div>
                <div className={styles.curList + ' ' + styles.commonBgc}>
                    {this.getCurItem('3')}
                    {this.getCurItem('4')}
                    {this.getCurItem('5')}
                </div>
            </div>
        );
    }
}
