import React from 'react';
import { Modal, Input, Icon } from 'antd';
import styles from './index.less';
import { trans } from '../../../utils/i18n';

class NewSubject extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: undefined,
            enName: undefined,
        };
    }

    handleCancel = () => {
        const { hideModal } = this.props;
        typeof hideModal == 'function' && hideModal.call(this, 'visibleNewSubject');
    };

    handleOk = () => {};

    titleHTML() {
        return (
            <div className={styles.courseNav}>
                <span onClick={this.handleCancel} className={styles.icon}>
                    <Icon type="close" />
                </span>
                <span>{trans('global.addSub', '新建学科')}</span>
                <div></div>
            </div>
        );
    }

    render() {
        return (
            <Modal
                title={this.titleHTML()}
                closable={false}
                maskClosable={false}
                visible={this.props.visibleNewSubject}
                onCancel={this.handleCancel}
                onOk={this.handleOk}
            >
                <div className={styles.NewCourse}>
                    <div className={styles.item}>
                        <div className={styles.title}>
                            {trans('charge.chineseName', '中文名称')}
                        </div>
                        <Input placeholder="请输入标题(比填)" />
                    </div>
                    <div className={styles.item}>
                        <div className={styles.title}>{trans('charge.enName', '英文名称')}</div>
                        <Input placeholder="Please enter the title in Englist(required)" />
                    </div>
                </div>
            </Modal>
        );
    }
}

export default NewSubject;
