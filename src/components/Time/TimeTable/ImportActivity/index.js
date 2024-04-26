import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Spin, Modal, Form, Upload, Button, Table } from 'antd';
import { trans } from '../../../../utils/i18n';
import { isEmpty } from 'lodash';
import SimpleModal from '../../../CommonModal/SimpleModal';
import styles from './index.less';

@connect((state) => ({
    importFeeMessage: state.club.importFeeMessage,
}))
export default class importActivity extends PureComponent {
    state = {
        batchUpdateVisible: true,
        importConfirmBtn: true,
        isChecking: false,
        isUploading: false,
        fileList: [],
        coursePlanFileList: [],
        checkErrorMessageList: [],
        checkModalVisibility: false,
        failureNumber: '',
        //场地冲突
        roomConflictModalVisible: false,
        importConfirmLoading: false,
    };

    batchUpdateOk = () => {
        let { coursePlanFileList } = this.state;
        this.setState({
            roomConflictModalVisible: false,
            importConfirmLoading: true,
        });
        let formData = new FormData();
        for (let item of coursePlanFileList) {
            formData.append('file', item);
        }
        if (!isEmpty(coursePlanFileList)) {
            this.setState({
                isChecking: true,
            });
            this.props
                .dispatch({
                    type: 'club/activeImportCheck',
                    payload: formData,
                    onSuccess: () => {
                        this.setState({
                            coursePlanFileList: [],
                        });
                    },
                })
                .then(() => {
                    const { importFeeMessage } = this.props;
                    this.setState({
                        isChecking: false,
                    });
                    if (
                        !isEmpty(
                            importFeeMessage && importFeeMessage.activeImportCheckMessageDTOList
                        )
                    ) {
                        this.setState({
                            coursePlanFileList: [],
                            importConfirmLoading: false,
                            checkErrorMessageList: importFeeMessage.activeImportCheckMessageDTOList,
                            checkModalVisibility: true,
                        });
                    } else if (
                        !isEmpty(importFeeMessage && importFeeMessage.roomConflictErrorMessageList)
                    ) {
                        this.setState({
                            roomConflictModalVisible: true,
                            importConfirmLoading: false,
                            checkErrorMessageList: importFeeMessage.roomConflictErrorMessageList,
                        });
                    } else {
                        this.sureImport();
                    }
                });
        }
    };

    reUpload = () => {
        let cancelBtn = document.getElementsByClassName('anticon-delete')[0];
        cancelBtn.click();
        this.setState({ checkModalVisibility: false, importConfirmBtn: true });
    };

    judgeMessage = () => {
        if (this.state.isChecking) {
            return true;
        }
        if (this.state.isUploading) {
            return false;
        }
    };

    onCancel = () => {
        const { toggleImportActivityVisible } = this.props;
        typeof toggleImportActivityVisible === 'function' && toggleImportActivityVisible();
        this.setState({ batchUpdateVisible: true, importConfirmBtn: true });
    };

    toggleRoomConflictModalVisible = () => {
        const { roomConflictModalVisible } = this.state;
        this.setState({
            roomConflictModalVisible: !roomConflictModalVisible,
        });
    };

    sureImport = () => {
        const { dispatch, toggleImportActivityVisible, showTable, getClubDataSource } = this.props;
        const { coursePlanFileList } = this.state;
        let formData = new FormData();
        for (let item of coursePlanFileList) {
            formData.append('file', item);
        }
        this.setState({
            isUploading: true,
            importConfirmLoading: true,
            roomConflictModalVisible: false,
        });
        dispatch({
            type: 'club/activeImport',
            payload: formData,
        }).then(() => {
            this.setState({
                coursePlanFileList: [],
                importConfirmBtn: false,
                importConfirmLoading: false,
                batchUpdateVisible: false,
                isUploading: false,
            });
            typeof toggleImportActivityVisible === 'function' && toggleImportActivityVisible();
            typeof showTable === 'function' && showTable();
            typeof getClubDataSource === 'function' && getClubDataSource();
        });
    };

    render() {
        const {
            batchUpdateVisible,
            importConfirmBtn,
            isChecking,
            isUploading,
            checkErrorMessageList,
            coursePlanFileList,
            checkModalVisibility,
            failureNumber,
            roomConflictModalVisible,
            importConfirmLoading,
        } = this.state;
        const columns = [
            {
                title: '原文件行号',
                dataIndex: 'lineNumber',
                key: 'lineNumber',
                width: 110,
                align: 'center',
            },
            {
                title: trans('global.scheduleImportError', '错误信息'),
                dataIndex: 'errorMessage',
                key: 'errorMessage',
                ellipsis: true,
                width: 250,
                align: 'center',
            },
        ];
        const uploadProps = {
            onRemove: (file) => {
                if (this.state.coursePlanFileList.length == 1) {
                    this.setState({ importConfirmBtn: true });
                }
                this.setState((state) => {
                    const index = state.coursePlanFileList.indexOf(file);
                    const newFileList = state.coursePlanFileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        coursePlanFileList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {
                this.setState(
                    (state) => ({
                        coursePlanFileList: [...state.coursePlanFileList, file],
                        importConfirmBtn: false,
                    }),
                    () => {
                        let { coursePlanFileList } = this.state;
                        let formData = new FormData();
                        for (let item of coursePlanFileList) {
                            formData.append('file', item);
                        }
                    }
                );

                return false;
            },
            coursePlanFileList,
        };
        return (
            <div>
                {batchUpdateVisible && (
                    <Modal
                        visible={batchUpdateVisible}
                        title="批量导入活动"
                        okText={trans('global.importScheduleConfirm', '确认导入')}
                        onCancel={this.onCancel}
                        closable={false}
                        onOk={this.batchUpdateOk}
                        okButtonProps={{
                            disabled: importConfirmBtn /* type: "primary" */,
                        }}
                        confirmLoading={importConfirmLoading}
                        destroyOnClose={true}
                        className={`${styles.batchSet} ${styles.exportModal}`}
                    >
                        <Spin
                            spinning={isChecking || isUploading}
                            tip={
                                this.judgeMessage()
                                    ? trans('global.uploadChecking', '上传文件正在校验中')
                                    : trans('global.file uploading', '文件正在上传中')
                            }
                        >
                            <div>
                                <p>
                                    <span style={{ marginRight: '8px' }}>①</span>
                                    <span>
                                        <span>下载导入模板，批量填写导入信息</span>
                                        <a
                                            href={`/api/activeExcelDownload`}
                                            target="_blank"
                                            style={{ marginLeft: 15 }}
                                        >
                                            下载模板
                                        </a>
                                    </span>
                                </p>
                                <p>
                                    <span style={{ marginRight: '8px' }}>②</span>
                                    上传填写好的导入信息表
                                </p>

                                <Form
                                    id="uploadForm"
                                    layout="inline"
                                    method="post"
                                    className={styles.form}
                                    encType="multipart/form-data"
                                >
                                    <Upload {...uploadProps} maxCount={1}>
                                        <Button type="primary" disabled={!importConfirmBtn}>
                                            {trans('global.scheduleSelectFile', '选择文件')}
                                        </Button>
                                    </Upload>
                                </Form>
                            </div>
                        </Spin>
                    </Modal>
                )}
                {checkModalVisibility && (
                    <Modal
                        className={styles.checkModal}
                        visible={checkModalVisibility}
                        title={trans('global.verificationFailed', '校验失败')}
                        closable={true}
                        onCancel={this.reUpload}
                        footer={[
                            <Button type="primary" onClick={this.reUpload}>
                                {trans('global.uploadAgain', '重新上传')}
                            </Button>,
                        ]}
                    >
                        <p>
                            {trans('global.thereAre', '当前上传的文件中共有')} &nbsp;
                            <span style={{ color: 'red' }}>
                                {checkErrorMessageList && checkErrorMessageList.length > 0
                                    ? checkErrorMessageList.length
                                    : null}
                            </span>
                            {trans('global.pleaseUploadAgain', '条错误，请调整后重新上传')}
                        </p>
                        <Table
                            dataSource={checkErrorMessageList}
                            columns={columns}
                            rowKey="lineNumber"
                            pagination={false}
                        />
                    </Modal>
                )}
                {roomConflictModalVisible && (
                    <SimpleModal
                        visible={roomConflictModalVisible}
                        title="场地冲突确认"
                        onOk={this.toggleRoomConflictModalVisible}
                        onCancel={this.sureImport}
                        okText="重新导入"
                        cancelText="忽略冲突"
                        maskClosable={false}
                        content={
                            <Table
                                dataSource={checkErrorMessageList}
                                columns={columns}
                                rowKey="lineNumber"
                                pagination={false}
                                align="center"
                            />
                        }
                    />
                )}
            </div>
        );
    }
}
