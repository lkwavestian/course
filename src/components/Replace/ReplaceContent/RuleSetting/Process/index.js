import React, { PureComponent } from 'react';
import styles from './index.less';
import replaceProcessUrl from '../../../../../assets/replaceProcess.png';
import { trans } from '../../../../../utils/i18n';

export default class Process extends PureComponent {
    render() {
        return (
            <div className={styles.processWrapper}>
                <div className={styles.process}>
                    <div className={styles.text}>
                        {trans('global.replace.pc.approvalProcess', '审批流程')}
                    </div>
                    <div>
                        <img src={replaceProcessUrl} className={styles.replaceProcessUrl} />
                    </div>
                </div>
            </div>
        );
    }
}
