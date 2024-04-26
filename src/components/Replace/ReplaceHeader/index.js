import React, { PureComponent } from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { trans } from '../../../utils/i18n';
@connect((state) => ({
    selectKeys: state.replace.selectKeys,
}))
export default class ReplaceHeader extends PureComponent {
    changeSelectKeys = (key) => {
        const { dispatch } = this.props;
        return dispatch({
            type: 'replace/changeSelectKeys',
            payload: key,
        });
    };

    render() {
        const { selectKeys } = this.props;
        return (
            <div className={styles.replaceHeader}>
                <div className={styles.tabsList}>
                    {[
                        trans('global.replace.pc.my', '我的'),
                        trans('global.replace.pc.searchAndStatistics', '查询统计'),
                        /* '数据统计', */ trans('global.replace.pc.setting', '规则设置'),
                        ,
                    ].map((item, index) => {
                        return selectKeys === index ? (
                            <div key={index}>
                                <span className={styles.text}>{item}</span>
                                <span
                                    className={styles.line}
                                    // style={{ width: index === 0 ? '32px' : '65px' }}
                                ></span>
                            </div>
                        ) : (
                            <span onClick={() => this.changeSelectKeys(index)} key={index}>
                                {item}
                            </span>
                        );
                    })}
                </div>
            </div>
        );
    }
}
