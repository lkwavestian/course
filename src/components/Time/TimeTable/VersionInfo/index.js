//保存版本
import React, { PureComponent } from 'react';
import styles from './index.less';
import { Input, message } from 'antd';

const { TextArea } = Input;
export default class VersionInfo extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            versionName: '',
            remark: '',
            canClick: true,
            editStatus: false,
            versionInfo: null,
        };
    }

    componentDidMount() {
        this.setState({
            versionName: this.props.versionInfo && this.props.versionInfo.name,
            remark: this.props.versionInfo && this.props.versionInfo.remark,
            // versionInfo:
        });
    }

    /* componentDidUpdate(preProps) {
      if(this.props.currentVersionName !== preProps.currentVersionName ) {
        this.setState({
          versionName: preProps.currentVersionName
        })
      }
      if(this.props.currentVersionRemark !== preProps.currentVersionRemark ) {
        this.setState({
          remark: preProps.currentVersionRemark
        })
      }
    } */

    //替代方案？
    componentWillReceiveProps(nextProps) {
        this.setState({
            versionName: nextProps.currentVersionName,
            remark: nextProps.currentVersionRemark,
        });
    }

    changeEditStatus = () => {
        const { editStatus } = this.state;
        this.setState({
            editStatus: !editStatus,
        });
    };

    changeVersionName = (e) => {
        this.setState({
            versionName: e.target.value,
        });
    };

    changeRemark = (e) => {
        this.setState({
            remark: e.target.value,
        });
    };

    handleCancel = () => {
        const { hideModal } = this.props;
        typeof hideModal === 'function' && hideModal('editVersion');
        this.setState({
            versionName: this.props.versionInfo && this.props.versionInfo.name,
            remark: this.props.versionInfo && this.props.versionInfo.remark,
            // versionInfo:
        });
    };

    confirmVersionEdit = () => {
        const { versionName, remark } = this.state;
        const { currentVersion, dispatch, getVersionList, setVersionName, setVersionRemark } =
            this.props;
        // const remark = this.state.remark ? this.state.remark.replace(/\r\n/g,'<br>').replace(/\n/g,'<br>') : ''
        setVersionName(versionName);
        setVersionRemark(remark);
        console.log('remark :>> ', remark);
        if (!versionName) {
            message.info('请输入版本名字再保存');
            return false;
        } else if (!this.state.canClick) {
            message.info('正在保存，请勿重复点击~');
            return false;
        } else {
            this.setState({
                canClick: false,
            });
            dispatch({
                type: 'timeTable/updateVersion',
                payload: {
                    remark: remark,
                    name: versionName,
                    versionId: currentVersion,
                },
                onSuccess: () => {
                    this.setState({
                        editStatus: false,
                    });
                    typeof getVersionList === 'function' &&
                        getVersionList.call(this, 'noRenderSchedule'); //是否还需要调用这个函数
                },
            }).then(() => {
                this.setState({
                    canClick: true,
                });
            });
        }
    };

    getSourceVersion = () => {
        const { versionInfo } = this.props;
        this.props.fetchSourseSchedule(versionInfo);
    };

    render() {
        const { versionInfo } = this.props;
        const { remark, versionName, editStatus } = this.state;
        return versionInfo ? (
            <div className={styles.versionInfo}>
                <span className={styles.title}>版本信息：</span>
                <div className={styles.name}>
                    名称：
                    <div className={styles.edit}>
                        {editStatus ? (
                            <Input
                                onChange={this.changeVersionName}
                                value={versionName}
                                className={styles.nameInput}
                            />
                        ) : (
                            <span className={styles.text} title={versionName}>
                                {versionName}
                            </span>
                        )}
                    </div>
                </div>
                <span className={styles.item}>
                    创建于：<span> {versionInfo.createTime} </span>
                </span>
                <span className={styles.item}>
                    公布于：<span> {versionInfo.releaseStringTime} </span>
                    <span>
                        {versionInfo.frequency === 1
                            ? '单周'
                            : versionInfo.frequency === 2
                            ? '双周'
                            : ''}
                    </span>
                </span>
                <span className={styles.item}>
                    来源版本：
                    <span>
                        {versionInfo.versionSourceTime} {versionInfo.sourceSystemVersionNumber}{' '}
                        {versionInfo.versionSourceName}
                    </span>
                    {versionInfo.versionSourceId ? (
                        <a onClick={this.getSourceVersion} className={styles.view}>
                            查看
                        </a>
                    ) : null}
                </span>
                <div className={styles.name}>
                    备注：
                    <div className={styles.edit}>
                        {editStatus ? (
                            <TextArea
                                defaultValue={versionInfo.remark}
                                onChange={this.changeRemark}
                                value={remark}
                                bordered={true}
                                className={styles.remarkTextArea}
                                autoSize={true}
                            />
                        ) : (
                            <pre style={{ marginBottom: 0 }}>
                                <span className={styles.remarkText} title={remark}>
                                    {remark}
                                </span>
                            </pre>
                        )}
                    </div>
                </div>
                <div>
                    {/* <Button type='primary' size='small' className={styles.button} onClick={this.confirmVersionEdit}>保存</Button> */}
                    {
                        // editStatus ?{}
                        // <span className={styles.editName + '  ' + styles.editConfirm} onClick={this.handleEditName}>确认</span>
                        // :
                        // <span className={styles.editName} onClick={this.handleEditName}>修改名称</span>
                    }
                </div>
                <div className={styles.operation}>
                    {editStatus ? (
                        <div onClick={this.changeEditStatus}>
                            <a className={styles.cancel} onClick={this.handleCancel}>
                                取消
                            </a>
                            <a onClick={this.confirmVersionEdit}>确认</a>
                        </div>
                    ) : (
                        <div onClick={this.changeEditStatus} className={styles.modify}>
                            <a>修改</a>
                        </div>
                    )}
                </div>
            </div>
        ) : (
            <span></span>
        );
    }
}
