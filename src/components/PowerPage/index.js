import React from 'react';
import styles from './index.less';
import powerUrl from '../../assets/power.png';
import { trans } from '../../utils/i18n';

function PowerPage() {
    return (
        <p className={styles.haveNoPowerPage}>
            <img src={powerUrl} />
            <span>{trans('global.noPower', '您暂时没有权限查看哦~')}</span>
        </p>
    );
}

export default PowerPage;
