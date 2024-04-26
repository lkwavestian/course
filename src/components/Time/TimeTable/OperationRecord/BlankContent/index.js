import React, { Component } from 'react';
import styles from './index.less';
import noContent from '../../../../../assets/noContent.png';

export default class index extends Component {
    render() {
        return (
            <div className={styles.blankContent}>
                <div className={styles.img}>
                    <img src={noContent} alt="" />
                </div>
                <div className={styles.word}>暂无操作记录</div>
            </div>
        );
    }
}
