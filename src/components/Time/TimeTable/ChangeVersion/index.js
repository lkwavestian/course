//保存版本
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Modal, Select, Input, message } from 'antd';
import { formatDateBasic } from '../../../../utils/utils';
import { trans } from '../../../../utils/i18n';

const { Option } = Select;
const { TextArea } = Input;

export default class ChangeVersion extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            versionName: this.props.currentVersionName,
            versionRemark: this.props.currentVersionRemark,
            canClick: true,
        };
    }

    componentDidMount() {
        this.setState({
            versionName: this.props.currentVersionName,
        });

        this.setState({
            versionRemark: this.props.currentVersionRemark,
        });
    }

    componentWillReceiveProps(nextProps) {
        if (
            nextProps.currentVersionName != this.state.currentVersionName &&
            nextProps.changeVersionVisible != this.props.changeVersionVisible
        ) {
            this.setState({
                versionName: nextProps.currentVersionName,
                versionRemark: nextProps.currentVersionRemark,
            });
        }
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
            this.setState(
                {
                    canClick: false,
                },
                () => {
                    this.props.changeVersionShowLoading(true);
                    dispatch({
                        type: 'time/copyLatestVersion',
                        payload: {
                            name: versionName,
                            id: currentVersion,
                            remark: versionRemark,
                        },
                        onSuccess: () => {
                            typeof getVersionList === 'function' &&
                                getVersionList.call(this, '调课换课');
                            this.props.cancelChangeVersion();
                        },
                    }).then(() => {
                        this.props.changeVersionShowLoading(false);
                        this.setState({
                            canClick: true,
                        });
                    });
                }
            );
        }
    };

    handleCancel = () => {
        this.setState(
            {
                versionName: this.props.currentVersionName,
                remark: this.props.currentVersionRemark,
            },
            () => {
                this.props.cancelChangeVersion();
            }
        );
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

    render() {
        const { versionName, versionRemark, canClick } = this.state;

        console.log('this.state.editVersionName :>> ', this.state.editVersionName);

        return (
            <div className={styles.changeVersion}>
                <div className={styles.saveVersionInput}>
                    <span className={styles.title}>请输入新建的调换课版本名称</span>
                    <Input
                        placeholder="请输入"
                        maxLength={300}
                        value={versionName}
                        onChange={this.editVersionName}
                        defaultValue={'1234'}
                    />
                    <TextArea
                        placeholder="备注（选填）"
                        value={versionRemark}
                        onChange={this.editVersionRemark}
                        rows={5}
                        className={styles.remark}
                    />
                </div>
                {canClick ? (
                    <div className={styles.operButtonList}>
                        <span
                            className={styles.modalBtn + ' ' + styles.cancelBtn}
                            onClick={this.handleCancel}
                        >
                            {trans('global.cancel', '取消')}
                        </span>
                        <span
                            className={styles.modalBtn + ' ' + styles.submitBtn}
                            onClick={this.handleOk}
                        >
                            {trans('global.confirm', '确定')}
                        </span>
                    </div>
                ) : (
                    <span className={styles.changeLoad}>版本生成中...</span>
                )}
            </div>
        );
    }
}
