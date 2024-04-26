import React, { PureComponent } from 'react';
import styles from './index.less';
import { connect } from 'dva';
import ReplaceHeader from './ReplaceHeader';
import ReplaceContent from './ReplaceContent';
import { locale } from '../../utils/i18n';

@connect((state) => ({}))
export default class Replace extends PureComponent {
    state = {
        currentLang: 'cn',
    };
    componentDidMount() {
        this.setState({
            currentLang: locale() === 'en' ? 'en' : 'cn',
        });
        let titleEleList = document.getElementsByTagName('title');
        titleEleList[0].innerHTML = '调代课';
    }
    render() {
        const { currentLang } = this.state;
        return (
            <div className={styles.replaceWrapper}>
                <ReplaceHeader currentLang={currentLang} />
                <ReplaceContent currentLang={currentLang} />
            </div>
        );
    }
}
