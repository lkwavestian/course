import React from 'react';
import { Modal, Input, Icon } from 'antd';
import styles from './index.less';

class NewAreas extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: undefined,
            enName: undefined,
        };
    }

    handleCancel = () => {
        const { hideModal } = this.props;
        typeof hideModal == 'function' && hideModal.call(this, 'visibleNewAreas');
    };

    handleOk = () => {};

    titleHTML() {
        return (
            <div className={styles.courseNav}>
                <span onClick={this.handleCancel} className={styles.icon}>
                    <Icon type="close" />
                </span>
                <span>新建领域</span>
                <div></div>
            </div>
        );
    }

    render() {
        return (
            <Modal
                title={this.titleHTML()}
                closable={false}
                visible={this.props.visibleNewAreas}
                onCancel={this.handleCancel}
                maskClosable={false}
                onOk={this.handleOk}
            >
                <div className={styles.NewAreas}>NewAreas</div>
            </Modal>
        );
    }
}

export default NewAreas;
