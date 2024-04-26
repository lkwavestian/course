//保存版本
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './editVersion.less';
import { Modal, Input, message } from 'antd';
import { cloneDeep } from 'lodash';
import { trans, locale } from '../../../../utils/i18n';

export default class EditVersion extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            versionName: '',
            versionRemark: '',
            canClick: true,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            versionName: nextProps.currentVersionName,
        });
    }

    handleOk = (e) => {
        e.preventDefault();
        const { dispatch, currentVersion, getVersionList } = this.props;
        const { versionName, versionRemark } = this.state;
        if (!versionName) {
            message.info('请输入版本名字再保存');
            return false;
        } else if (!this.state.canClick) {
            message.info('正在保存，不要重复点击~');
            return false;
        } else {
            this.setState({
                canClick: false,
            });
            dispatch({
                type: 'timeTable/updateVersion',
                payload: {
                    name: versionName,
                    remark: versionRemark,
                    versionId: currentVersion,
                },
                onSuccess: () => {
                    this.setState({
                        versionName: '',
                    });
                    typeof getVersionList == 'function' && getVersionList.call(this);
                    this.handleCancel();
                },
            }).then(() => {
                this.setState({
                    canClick: true,
                });
            });
        }
    };

    handleCancel = () => {
        const { hideModal } = this.props;
        typeof hideModal == 'function' && hideModal('editVersion');
        this.setState({
            versionName: '',
        });
    };

    editVersion = (e) => {
        this.setState({
            versionName: e.target.value,
        });
    };
    render() {
        const { editVersionVisible } = this.props;
        const { versionName } = this.state;

        return (
            <Modal
                visible={editVersionVisible}
                title="编辑版本"
                onCancel={this.handleCancel}
                footer={null}
                className={styles.editVersion}
            >
                <div className={styles.saveVersionInput}>
                    <Input
                        placeholder="给当前的版本取个名字（100个字符以内）"
                        maxLength={100}
                        value={versionName}
                        onChange={this.editVersion}
                    />
                </div>
                <div className={styles.operButtonList}>
                    <span
                        className={styles.modalBtn + ' ' + styles.cancelBtn}
                        onClick={this.handleCancel}
                    >
                        取消
                    </span>
                    <span
                        className={styles.modalBtn + ' ' + styles.submitBtn}
                        onClick={this.handleOk}
                    >
                        {trans('global.save', '保存')}
                    </span>
                </div>
            </Modal>
        );
    }
}
