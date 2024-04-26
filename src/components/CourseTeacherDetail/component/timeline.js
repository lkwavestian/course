import React from 'react';
import styles from './timeline.less';

export default function Timeline(props) {
    return (
        <span className={styles.Timeline}>
            <span className={styles.time}>
                <span className={styles.start}>{props.currentStartTime}</span>
                <span className={styles.end}>{props.currentEndTime}</span>
            </span>
            <span className={styles.xian}>
                <span className={styles.a}></span>
                <span className={styles.b}></span>
                <span className={styles.c}>
                    <i></i>
                </span>
            </span>
        </span>
    );
}
