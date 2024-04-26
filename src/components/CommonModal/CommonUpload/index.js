import React, { Fragment, PureComponent } from 'react';
import { stringify } from 'qs';
import styles from './index.less';
import { Modal, Upload, Button, message, Form, Spin, Table } from 'antd';
import { isEmpty, debounce } from 'lodash';
import { trans, locale } from '../../../utils/i18n';
import request from '../../../utils/request';

export default class commonUpload extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            importModalVisible: this.props.importModalVisible,
            importConfirmBtn: true,
            fileList: [],
            isChecking: false,
            isUploading: false,
            checkModalVisibility: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.importModalVisible != this.props.importModalVisible) {
            this.setState({
                importModalVisible: nextProps.importModalVisible,
            });
        }
    }

    handleCancel = () => {
        this.setState({
            importModalVisible: false,
        });
    };

    reUpload = () => {
        let cancelBtn = document.getElementsByClassName('anticon-delete')[0];
        cancelBtn?.click();
        this.setState({ checkModalVisibility: false });
    };

    import = (e) => {
        const { uploadUrl } = this.props;
        let { fileList } = this.state;
        let formData = new FormData();
        for (let item of fileList) {
            formData.append('file', item);
        }
        if (!isEmpty(fileList)) {
            this.setState(
                {
                    isUploading: true,
                },
                () => {
                    request(uploadUrl, {
                        method: 'POST',
                        body: formData,
                    }).then((res) => {
                        const { importSuccessCb } = this.props;
                        let importResult = res.content;
                        typeof importSuccessCb === 'function' && importSuccessCb();
                        this.setState({
                            isUploading: false,
                            importConfirmBtn: true,
                        });
                        if (!importResult) {
                            message.success(trans('global.scheduleImportSuccess', '导入成功'));
                            this.setState({
                                fileList: [],
                            });
                        } else {
                            this.setState({
                                fileList: [],
                                successModalVisibility: true,
                                checkErrorMessageList: importResult.checkErrorMessageList,
                                successNumber: importResult.successNumber,
                                failureNumber: importResult.failureNumber,
                            });
                        }
                    });
                }
            );
        }
    };

    render() {
        const { downLoadUrl, checkUrl } = this.props;
        const {
            fileList,
            isUploading,
            successModalVisibility,

            successNumber,
            failureNumber,
            checkErrorMessageList,
            importModalVisible,
            importConfirmBtn,
            isChecking,
            checkModalVisibility,
        } = this.state;

        console.log('importModalVisible', importModalVisible);

        const columns = [
            {
                title: trans('global.rowNumber', '行号'),
                dataIndex: 'lineNumber',
                key: 'lineNumber',
                width: 100,
            },
            {
                title: trans('global.scheduleImportError', '错误信息'),
                dataIndex: 'errorMessage',
                key: 'errorMessage',
                ellipsis: true,
                width: 250,
            },
        ];

        const teacherUploadProps = {
            onRemove: (file) => {
                if (this.state.fileList.length == 1) {
                    this.setState({ importConfirmBtn: true });
                }
                this.setState((state) => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {
                console.log('checkUrl :>> ', checkUrl);
                this.setState(
                    (state) => ({
                        isChecking: true,
                        fileList: [...state.fileList, file],
                    }),
                    () => {
                        if (checkUrl) {
                            let { fileList } = this.state;
                            let formData = new FormData();
                            for (let item of fileList) {
                                formData.append('file', item);
                            }
                            if (!isEmpty(fileList)) {
                                request(checkUrl, {
                                    method: 'POST',
                                    body: formData,
                                }).then((res) => {
                                    let checkResult = res.content;
                                    this.setState(
                                        {
                                            isChecking: false,
                                        },
                                        () => {
                                            if (!isEmpty(checkResult.checkErrorMessageList)) {
                                                this.setState({
                                                    fileList: [],
                                                    checkModalVisibility: true,
                                                    successNumber: checkResult.successNumber,
                                                    failureNumber: checkResult.failureNumber,
                                                    checkErrorMessageList:
                                                        checkResult.checkErrorMessageList,
                                                });
                                            } else {
                                                this.setState({
                                                    importConfirmBtn: false,
                                                });
                                            }
                                        }
                                    );
                                });
                            }
                        } else {
                            this.setState({
                                isChecking: false,
                                importConfirmBtn: false,
                            });
                        }
                    }
                );
                return false;
            },
            fileList,
        };

        return (
            <Fragment>
                {/* 批量导入教师 */}
                <Modal
                    visible={importModalVisible}
                    title={trans('global.importSchedule', '批量导入')}
                    okText={trans('global.importScheduleConfirm', '确认导入')}
                    className={styles.importModal}
                    onCancel={this.props.hideModal}
                    closable={false}
                    onOk={debounce(this.import, 1000)}
                    okButtonProps={{
                        disabled: importConfirmBtn /* type: "primary" */,
                    }}
                    destroyOnClose={true}
                >
                    <Spin
                        spinning={isChecking || isUploading}
                        tip={
                            isChecking
                                ? trans('global.uploadChecking', '上传文件正在校验中')
                                : trans('global.file uploading', '文件正在上传中')
                        }
                    >
                        <div>
                            <div className={styles.importMsg}>
                                <span>①</span>
                                &nbsp;
                                <span>
                                    {trans(
                                        'global.downloadScheduleTemplate',
                                        '下载导入模板，批量填写导入信息'
                                    )}
                                </span>
                                <a href={downLoadUrl} target="_blank" style={{ marginLeft: 15 }}>
                                    {trans('global.scheduleDownloadTemplate', '下载模板')}
                                </a>
                            </div>
                            <div className={styles.importMsg}>
                                <span>②</span>&nbsp;
                                <span>
                                    {trans('global.uploadSchedule', '上传填写好的导入信息表')}
                                </span>
                                <span className={styles.desc}>
                                    <span>
                                        <Form
                                            id="uploadForm"
                                            layout="inline"
                                            method="post"
                                            className={styles.form}
                                            encType="multipart/form-data"
                                        >
                                            <Upload {...teacherUploadProps} maxCount={1}>
                                                <Button
                                                    type="primary"
                                                    disabled={!importConfirmBtn}
                                                    style={{ borderRadius: '8px' }}
                                                >
                                                    {trans('global.scheduleSelectFile', '选择文件')}
                                                </Button>
                                            </Upload>
                                        </Form>
                                    </span>
                                </span>
                            </div>
                        </div>
                    </Spin>
                </Modal>

                {/* 校验失败 */}
                <Modal
                    className={styles.checkModal}
                    visible={checkModalVisibility}
                    title={trans('global.verificationFailed', '校验失败')}
                    closable={true}
                    onCancel={this.reUpload}
                    footer={[
                        <Button type="primary" className={styles.reUpload} onClick={this.reUpload}>
                            {trans('global.uploadAgain', '重新上传')}
                        </Button>,
                    ]}
                >
                    <p>
                        {trans('global.thereAre', '当前上传的文件中共有')} &nbsp;
                        <span>{failureNumber} </span>&nbsp;
                        {trans('global.pleaseUploadAgain', '条错误，请调整后重新上传')}
                    </p>
                    <Table
                        dataSource={checkErrorMessageList}
                        columns={columns}
                        rowKey="lineNumber"
                        pagination={false}
                    />
                </Modal>

                {/* 导入完成失败 */}
                <Modal
                    className={styles.successModal}
                    visible={successModalVisibility}
                    title={trans('global.importComplete', '导入完成')}
                    closable={false}
                    footer={[
                        <Button
                            type="primary"
                            className={styles.reUpload}
                            onClick={() =>
                                this.setState({
                                    successModalVisibility: false,
                                    classFileList: [],
                                    coursePlanFileList: [],
                                    importCoursePlanModelVisible: false,
                                    importClassModelVisible: false,
                                    importStudentModelVisible: false,
                                })
                            }
                        >
                            {trans('global.importGotIt', '我知道了')}
                        </Button>,
                    ]}
                >
                    <p>
                        {locale() === 'en'
                            ? `The processing is completed. ${successNumber} items processed successfully, ${failureNumber} items failed. The reasons for the failure are as follows`
                            : `处理完成，共成功处理 ${successNumber} 条，失败 ${failureNumber} 条，失败原因如下:`}
                    </p>
                    <Table
                        dataSource={checkErrorMessageList}
                        columns={columns}
                        rowKey="lineNumber"
                        pagination={false}
                    />
                </Modal>
            </Fragment>
        );
    }
}
