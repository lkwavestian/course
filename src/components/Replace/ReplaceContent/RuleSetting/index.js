import React, { PureComponent } from 'react';
import styles from './index.less';
import Process from './Process';
import Rules from './Rules';
export default class RuleSetting extends PureComponent {
    render() {
        const { currentLang } = this.props;
        return (
            <div className={styles.ruleSettingWrapper}>
                <Process currentLang={currentLang} />
                <Rules currentLang={currentLang} />
            </div>
        );
    }
}
