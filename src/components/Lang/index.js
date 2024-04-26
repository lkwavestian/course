//课程管理
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import icon from '../../icon.less';
import { locale } from '../../utils/i18n';

@connect((state) => ({}))
export default class Lang extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            langCode: locale(),
        };
    }

    changeLang = () => {
        let langCode = locale() === 'en' ? 'zh-cn' : 'en';
        this.setState(
            {
                langCode,
            },
            () => {
                const { dispatch } = this.props;
                dispatch({
                    type: 'global/checkLange',
                    payload: {
                        languageCode: langCode,
                    },
                });
            }
        );
    };

    render() {
        const { langCode } = this.state;
        return (
            <div className={styles.lang}>
                <span className={styles.iconBox} onClick={this.changeLang}>
                    {langCode == 'en' ? (
                        <i className={icon.iconfont}>&#xe64f;</i>
                    ) : (
                        <i className={icon.iconfont}>&#xe61a;</i>
                    )}
                </span>
            </div>
        );
    }
}
