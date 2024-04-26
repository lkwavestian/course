//批量修改学生信息
import React, { useState } from 'react';
import { connect } from 'dva';
import styles from './commonModal.less';
import { Modal, message, Form, Button, Spin, Upload, Table } from 'antd';
import { trans } from '../../../../utils/i18n';
import { downloadFileByPost } from '../../../../utils/utils';

function BatchEditInfo(props) {
    const { importMessageList, batchEdit } = props;

    let [isDisabled, setIsDisabled] = useState(false);
    let [loading, setLoading] = useState(false);
    const [uploadFile, setUplodaFile] = useState(undefined);
    const [errorVisible, setErrorVisible] = useState(false);
    //取消
    const handleCancel = () => {
        const { hideModal } = props;
        let getForm = document.getElementById('uploadForm');
        getForm.reset();
        typeof hideModal == 'function' && hideModal.call(this, 'batchEditStudent');
    };

    //提交
    const confirm = () => {
        const { dispatch, rowIds, form, getStudentList } = props;
        form.validateFields((err, values) => {
            if (!err) {
                let data = new FormData();
                // let fileList = document.getElementById('uploadBtn');
                // let files = fileList && fileList.files[0];

                if (!uploadFile) {
                    message.warn('请先上传文件');
                    return false;
                }
                setIsDisabled((isDisabled = true));
                setLoading((loading = true));
                data.append('file', uploadFile);
                dispatch({
                    type: 'student/batchEditInfo',
                    payload: data,
                    onSuccess: (res) => {
                        handleCancel();
                        typeof getStudentList == 'function' && getStudentList();
                        setIsDisabled((isDisabled = false));
                        setLoading((loading = false));
                        Promise.resolve().then(() => {
                            setUplodaFile(undefined);
                        });
                    },
                    onError: () => {
                        handleCancel();
                        setErrorVisible(true);
                        setIsDisabled((isDisabled = false));
                        setLoading((loading = false));
                        Promise.resolve().then(() => {
                            setUplodaFile(undefined);
                        });
                    },
                });
            }
        });
    };

    const exportExcel = () => {
        setLoading(true);
        downloadFileByPost(
            '/api/teaching/excel/exportNeedUpdateStudent',
            {
                studentIdList: props.rowIds,
            },
            '学生信息'
        ).then(() => {
            console.log('resolve')
            setLoading(false);
        });
        // props.downloadData && props.downloadData();
    };

    const reUpload = () => {
        setErrorVisible(false);
        batchEdit();
    };

    const { batchEditInfoVisible, rowIds } = props;
    let downloadUrl =
        window.location.origin +
        '/api/teaching/excel/exportNeedUpdateStudent?userIdList=' +
        rowIds.join(',');

    const uploadProps = {
        onRemove: (file) => {
            setUplodaFile(undefined);
        },
        beforeUpload: (file) => {
            // this.setState((state) => ({
            //     fileList: [...state.fileList, file],
            // }));
            setUplodaFile(file);
            return false;
        },
        uploadFile,
    };

    const errorColumns = [
        {
            title: '行号',
            dataIndex: 'lineNumber',
            width: 100,
            key: 'lineNumber',
            align: 'center',
        },
        {
            title: '错误信息',
            dataIndex: 'errorMessage',
            key: 'errorMessage',
            align: 'center',
        },
    ];
    console.log(importMessageList, 'importMessageList');
    return (
        <>
            <Modal
                visible={batchEditInfoVisible}
                title={trans('global.batchEditOper', '批量修改')}
                footer={null}
                width="550px"
                onCancel={handleCancel}
                destroyOnClose={true}
            >
                <Spin spinning={loading}>
                    <div>
                        <p className={styles.exportStyle}>
                            <span>①导出学生信息表，批量修改 </span>
                            <Button
                                style={{
                                    border: '1px solid #1890ff',
                                    color: '#1890ff',
                                    marginLeft: 20,
                                }}
                                onClick={exportExcel}
                            >
                                导出
                            </Button>{' '}
                            {/* <a onClick={props.downloadData}>下载导出数据</a> */}
                        </p>
                        <p className={styles.exportStyle} style={{ display: 'flex' }}>
                            <span style={{ marginTop: 10 }}>②上传修改好的信息表 </span>
                            <Form
                                style={{ display: 'inline-block', marginLeft: 40 }}
                                id="uploadForm"
                                method="post"
                                encType="multipart/form-data"
                            >
                                <Form.Item>
                                    {/* <input
                                    type="file"
                                    name="file"
                                    id="uploadBtn"
                                    accept=".xls,.xlsx"
                                    className={styles.uploadBtn}
                                    style={{lineHeight: 27}}
                                /> */}
                                    <Upload size="small" {...uploadProps} maxCount={1}>
                                        <Button
                                            type="primary"
                                            style={{
                                                height: 32,
                                                marginLeft: 26,
                                                background: '#3b6ff5',
                                            }}
                                        >
                                            {trans('global.scheduleSelectFile', '选择文件')}
                                        </Button>
                                    </Upload>
                                </Form.Item>
                            </Form>
                        </p>

                        <div className={styles.operationList}>
                            <a>
                                <Button
                                    className={styles.modalBtn + ' ' + styles.submitBtn}
                                    onClick={confirm}
                                    disabled={isDisabled}
                                >
                                    {trans('global.confirm', '确定')}
                                </Button>
                            </a>
                        </div>
                    </div>
                </Spin>
            </Modal>
            <Modal
                visible={errorVisible}
                footer={[
                    <Button
                        type="primary"
                        className={styles.reUpload}
                        style={{ backgroundColor: '#3b6ff5' }}
                        onClick={reUpload}
                    >
                        {trans('global.uploadAgain', '重新上传')}
                    </Button>,
                ]}
                onCancel={reUpload}
                title="导入学生失败信息"
                width={720}
            >
                <p style={{ textAlign: 'center' }}>
                    {trans('global.thereAre', '当前上传的文件中共有')} &nbsp;
                    <span style={{ color: 'red' }}>
                        {importMessageList && importMessageList.failureNumber
                            ? importMessageList.failureNumber
                            : 0}{' '}
                    </span>
                    &nbsp;
                    {trans('global.pleaseUploadAgain', '条错误，请调整后重新上传')}
                </p>
                <Table
                    columns={errorColumns}
                    dataSource={
                        importMessageList &&
                        importMessageList.checkErrorMessageList &&
                        importMessageList.checkErrorMessageList.length > 0
                            ? importMessageList.checkErrorMessageList
                            : []
                    }
                    rowKey="lineNumber"
                    pagination={false}
                ></Table>
            </Modal>
        </>
    );
}

function mapStateProps(state) {
    return {
        importMessageList: state.student.importMessageList,
    };
}

export default connect(mapStateProps)(Form.create()(BatchEditInfo));
