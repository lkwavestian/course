import React, { PureComponent } from 'react';
import styles from './index.less';
import { withRouter } from 'dva/router';
import BasicHeader from '../../layouts/BasicLayout';
import { connect } from 'dva';
import HomePage from './HomePage';
import ApplicationList from './ApplicationList';
import RecordList from './RecordList';
import { trans, locale } from '../../utils/i18n';

@connect((state) => ({
    applicationList: state.replace.applicationList,
    recordList: state.replace.recordList,
}))
class ReplaceMobile extends PureComponent {
    state = {
        currentLang: 'cn',
    };

    componentDidMount() {
        this.setState({
            currentLang: locale() === 'en' ? 'en' : 'cn',
        });
    }

    toApplicationPage = async () => {
        const { dispatch, history } = this.props;
        await dispatch({
            type: 'replace/setChangeRequest',
            payload: {},
        });
        await dispatch({
            type: 'replace/setAddLessonList',
            payload: [],
        });
        await dispatch({
            type: 'replace/setStatus',
            payload: 'application',
        });
        await dispatch({
            type: 'replace/setImportSupplementFileList',
            payload: [],
        });
        await dispatch({
            type: 'replace/setCopySendRuleList',
            payload: [],
        });
        history.push(`/replace/mobile/application/index`);
    };

    render() {
        console.log('ReplaceMobile/index/render');

        const { cur, history } = this.props;
        const { currentLang } = this.state;
        /* 
                cur 0：调代课初始页面 1：我提交的 2：我代的课 3：待我审批 4：我已审批 5：全部申请
            */
        return (
            <div style={{ height: '92%' }}>
                <BasicHeader replace={'replaceMobile'} />
                <div className={styles.replaceMobileWrapper}>
                    {cur == '0' ? (
                        <HomePage cur={cur} history={history} currentLang={currentLang} />
                    ) : cur == 1 || cur == 3 || cur == 4 || cur == 5 ? (
                        <ApplicationList cur={cur} history={history} currentLang={currentLang} />
                    ) : cur == 2 ? (
                        <RecordList cur={cur} history={history} currentLang={currentLang} />
                    ) : null}
                    {(cur == '0' || cur == '1') && (
                        <div
                            className={styles.applicationBtnWrapper}
                            onClick={this.toApplicationPage}
                        >
                            <div className={styles.applicationBtn}>
                                {trans('global.replace.submitApplication', '申请调代课')}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
export default withRouter(ReplaceMobile);
