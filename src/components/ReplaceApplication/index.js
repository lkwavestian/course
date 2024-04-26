import React, { PureComponent } from 'react';
import styles from './index.less';
import Content from './Content';
import Header from './Header';
import { locale } from '../../utils/i18n';

export default class ReplaceApplication extends PureComponent {
    state = {
        currentLang: 'cn',
    };
    componentDidMount() {
        this.setState({
            currentLang: locale() === 'en' ? 'en' : 'cn',
        });
        let titleEleList = document.getElementsByTagName('title');
        titleEleList[0].innerHTML = '申请调代课';
    }
    render() {
        const { currentLang } = this.state;
        return (
            <div className={styles.replaceApplicationWrapper}>
                <Header currentLang={currentLang} />
                <Content currentLang={currentLang} />
            </div>
        );
    }
}
