import React, { PureComponent } from 'react';
import { Modal, Button } from 'antd';
import styles from './index.less';

export default class SimpleModal extends PureComponent {
    render() {
        const {
            content,
            visible,
            onCancel,
            onOk,
            title,
            okText,
            cancelText,
            confirmLoading,
            maskClosable,
        } = this.props;
        return (
            <Modal
                visible={visible}
                wrapClassName={styles.simpleModalWrapper}
                title={title}
                closable={false}
                destroyOnClose={true}
                onCancel={onCancel}
                onOk={onOk}
                okText={okText ? okText : '确定'}
                cancelText={cancelText ? cancelText : '取消'}
                confirmLoading={confirmLoading}
                maskClosable={maskClosable ? maskClosable : false}
            >
                {content}
            </Modal>
        );
    }
}
