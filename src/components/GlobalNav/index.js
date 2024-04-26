//横向菜单
import React, { PureComponent } from 'react';
import styles from './index.less';
import { routerRedux } from 'dva/router';
import classNames from 'classnames';
import { connect } from 'dva';
import { locale } from '../../utils/i18n';

export default class GlobalNav extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onChange(key) {
        let { switchNavList } = this.props;
        typeof switchNavList == 'function' && switchNavList.call(this, key);
    }

    render() {
        let { navList, cur } = this.props;
        return locale() !== 'en' ? (
            <div className={styles.navContent}>
                {navList &&
                    navList.map((el, key) => (
                        <a
                            key={el.key}
                            className={el.key == cur ? styles.cur : ''}
                            onClick={this.onChange.bind(this, el.key)}
                        >
                            {el.name}
                        </a>
                    ))}
            </div>
        ) : (
            <div className={styles.navContent} style={{ marginLeft: '70px' }}>
                {navList &&
                    navList.map((el, key) => (
                        <a
                            key={el.key}
                            className={el.key == cur ? styles.cur : ''}
                            onClick={this.onChange.bind(this, el.key)}
                            style={{ margin: '0 10px' }}
                        >
                            {el.name}
                        </a>
                    ))}
            </div>
        );
    }
}
