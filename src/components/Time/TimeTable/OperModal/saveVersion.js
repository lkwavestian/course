//保存版本
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './commonModal.less';
import { Modal, Select, Input, message, Button } from 'antd';
import { trans } from '../../../../utils/i18n';

const { Option } = Select;
const { TextArea } = Input;

export default class SaveVersion extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            canClick: true,
            versionName: this.props.currentVersionName,
            versionRemark: this.props.currentVersionRemark,
        };
    }

    componentDidMount() {
        console.log('this.props.currentVersionName :>> ', this.props.currentVersionName);
        console.log('this.props.currentVersionRemark :>> ', this.props.currentVersionRemark);
    }

    handleOk = (e) => {
        e.preventDefault();
        const {
            dispatch,
            currentVersion,
            getVersionList,
            currentVersionName,
            currentVersionRemark,
            hideModal,
        } = this.props;
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
                type: 'timeTable/saveVersion',
                payload: {
                    name: versionName,
                    id: currentVersion,
                    remark: versionRemark,
                },
                onSuccess: () => {
                    this.props.setVersionName(versionName);
                    this.props.setVersionRemark(versionRemark);

                    typeof hideModal === 'function' && hideModal('saveVersion');
                    // typeof getVersionList === 'function' && getVersionList.call(this);
                    this.getVersionList();
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
        typeof hideModal === 'function' && hideModal('saveVersion');
        this.props.setVersionName(this.props.versionInfo.name);
        this.props.setVersionRemark(this.props.versionInfo.remark);
    };

    editVersionName = (e) => {
        this.setState({
            versionName: e.target.value,
        });
    };
    editVersionRemark = (e) => {
        this.setState({
            versionRemark: e.target.value,
        });
    };

    getVersionList = () => {
        const { dispatch } = this.props;
        const { startTime, endTime, gradeValue } = this.props;
        dispatch({
            type: 'timeTable/getVersionList',
            payload: {
                startTime,
                endTime,
                gradeIdList: gradeValue,
            },
        });
    };

    render() {
        const { versionModal, currentVersionName, currentVersionRemark } = this.props;
        const { versionName, versionRemark } = this.state;
        return (
            <Modal
                visible={versionModal}
                title="保存版本"
                onCancel={this.handleCancel}
                footer={null}
                className={styles.saveVersion}
            >
                <div className={styles.saveResultType}>
                    <span>保存结果类型</span>
                    <Select defaultValue="system" disabled={true} style={{ width: '120px' }}>
                        <Option key="system" value="system">
                            系统排课
                        </Option>
                    </Select>
                </div>
                <div className={styles.saveVersionInput}>
                    <Input
                        placeholder="给当前的版本取个名字（100个字符以内）"
                        maxLength={100}
                        value={versionName}
                        onChange={this.editVersionName}
                    />
                </div>
                <div className={styles.saveVersionTextArea}>
                    <TextArea
                        placeholder="备注（选填）"
                        maxLength={100}
                        value={versionRemark}
                        onChange={this.editVersionRemark}
                        rows={5}
                    />
                </div>
                <div className={styles.operButtonListCenter}>
                    <Button
                        // className={styles.modalBtn + ' ' + styles.cancelBtn}
                        onClick={this.handleCancel}
                        style={{ marginRight: '10px' }}
                    >
                        取消
                    </Button>
                    <Button
                        // className={styles.modalBtn + ' ' + styles.submitBtn}
                        onClick={this.handleOk}
                        type="primary"
                    >
                        {trans('global.save', '保存')}
                    </Button>
                </div>
            </Modal>
        );
    }
}
