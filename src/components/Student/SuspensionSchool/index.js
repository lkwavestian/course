import React, { PureComponent } from 'react';
import styles from './index.less';
import BaseLeftRight from '../Component/BaseLeftRight';

export default class SuspensionSchool extends PureComponent {
    render() {
        return (
            <div className={styles.SuspensionSchool}>
                <BaseLeftRight>
                    <div>休学</div>
                    <div>2222</div>
                </BaseLeftRight>
            </div>
        );
    }
}
