import React, { PureComponent } from 'react';
import styles from './index.less';
import { connect } from 'dva';
import RuleSetting from './RuleSetting';
import Statistics from './Statistics';
import MyReplace from './MyReplace';
import { locale } from '../../../utils/i18n';
@connect((state) => ({
    selectKeys: state.replace.selectKeys,
}))
export default class ReplaceContent extends PureComponent {
    componentDidMount() {
        this.initialData();
    }
    initialData = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'replace/findGrade',
        });
        dispatch({
            type: 'replace/getListAllOrgTeachers',
        });
        dispatch({
            type: 'replace/findCourse',
        });
    };
    render() {
        const { selectKeys, currentLang } = this.props;
        return (
            <div className={styles.replaceContentWrapper}>
                {selectKeys === 0 ? (
                    <MyReplace currentLang={currentLang} />
                ) : selectKeys === 1 ? (
                    <Statistics currentLang={currentLang} />
                ) : (
                    <RuleSetting currentLang={currentLang} />
                )}
            </div>
        );
    }
}
