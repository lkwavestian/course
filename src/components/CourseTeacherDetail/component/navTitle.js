import React from 'react';
import { Icon } from 'antd';
import styles from './navTitle.less';

function NavTitle(props) {
    return (
        <div className={styles.NavTitle}>
            <span onClick={props.onCancel} className={styles.icon}>
                <Icon type="close" />
            </span>
            <span>{props.title}</span>
            <div>{props.children || null}</div>
        </div>
    );
}

export default NavTitle;
