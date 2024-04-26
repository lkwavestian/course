import React, { PureComponent } from 'react';
import { Modal, Upload, Button, message, Form, Icon, Spin, Select, Table } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import styles from './importSchedule.less';
import { ImportExcelResult } from '../../../../services/timeTable';
import lodash from 'lodash';
import { connect } from 'dva';
import { trans } from '../../../../utils/i18n';

const { Option } = Select;

@connect((state) => ({
    courseScheduleImport: state.timeTable.courseScheduleImport,
}))
export default class ImportSchedule extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
            isUploading: false,
            importFileFormat: 'excel',
            errorListModalVisibility: false,

            checkErrorMessageList: [],
        };
    }

    handleCancel = () => {
        const { hideModal } = this.props;
        typeof hideModal == 'function' && hideModal('importSchedule');
    };

    // 确定从Excel导入
    sureImport = (e) => {
        let { fileList, importFileFormat } = this.state;
        let { versionId } = this.props;
        let formData = new FormData();
        for (let item of fileList) {
            formData.append('file', item);
            formData.append('versionId', versionId);
        }

        if (!lodash.isEmpty(fileList)) {
            console.log('this.props.dispatch :>> ', this.props.dispatch);
            const { dispatch } = this.props;
            this.setState({
                isUploading: true,
            });
            console.log('importFileFormat', importFileFormat);
            dispatch({
                type:
                    importFileFormat === 'fet'
                        ? 'timeTable/uploadFetResult'
                        : 'timeTable/courseScheduleImport',
                payload: formData,
                onSuccess: (res) => {},
            }).then(() => {
                if (importFileFormat === 'fet') {
                    message.success('导入成功');
                    this.setState({
                        fileList: [],
                        isUploading: false,
                    });
                    this.props.fetchScheduleList();
                    this.props.getshowAcCourseList();
                    this.handleCancel();
                } else {
                    const { courseScheduleImport } = this.props;
                    this.setState({
                        fileList: [],
                        isUploading: false,
                    });
                    if (
                        courseScheduleImport &&
                        !lodash.isEmpty(courseScheduleImport.checkErrorMessageList)
                    ) {
                        this.setState({
                            errorListModalVisibility: true,
                            checkErrorMessageList: courseScheduleImport.checkErrorMessageList,
                        });
                    } else {
                        this.props.fetchScheduleList();
                        this.props.getshowAcCourseList();
                        this.handleCancel();
                    }
                }
            });
        }
    };

    importFileFormatChange = (value) => {
        this.setState({
            importFileFormat: value,
        });
    };

    render() {
        const { importModal } = this.props;
        const {
            fileList,
            isUploading,
            errorListModalVisibility,
            checkErrorMessageList,
            importFileFormat,
        } = this.state;
        const uploadProps = {
            onRemove: (file) => {
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
                this.setState((state) => ({
                    fileList: [...state.fileList, file],
                }));
                return false;
            },
            fileList,
        };

        const errListColumns = [
            {
                title: '行号',
                dataIndex: 'lineNumber',
                key: 'lineNumber',
                width: 20,
                align: 'center',
            },
            {
                title: '错误信息',
                dataIndex: 'errorMessage',
                key: 'errorMessage',
                ellipsis: true,
                width: 250,
                align: 'center',
            },
        ];

        return (
            <div>
                {importModal && (
                    <Modal
                        title="导入排课结果"
                        visible={importModal}
                        onCancel={this.handleCancel}
                        // onOk={() => console.log("aa")}
                        onOk={this.sureImport}
                    >
                        <div>
                            <span className={styles.explain}>操作说明</span>
                            <div>
                                <p>1. 需确保所导入的课程、教师、地点信息已存在</p>
                                <p>
                                    2.
                                    导入时，系统不做冲突校验，导入完成后请自行借助课表检查工具进行冲突检查
                                </p>
                            </div>
                        </div>
                        <Spin
                            spinning={isUploading}
                            tip={trans('global.file uploading', '文件正在上传中')}
                        >
                            <div className={styles.upLoad}>
                                <span className={styles.text}>下载课表模版</span>
                                <span>
                                    <a
                                        href="/api/import/templateDownload?name=课班明细.xlsx"
                                        target="_blank"
                                        // style={{ marginLeft: "40px" }}
                                    >
                                        {trans('global.downloadClassDetail', '课班明细')}
                                    </a>
                                </span>
                                <span style={{ marginLeft: '10px' }}>
                                    <a
                                        href="/api/import/templateDownload?name=班级总表简版.xlsx"
                                        target="_blank"
                                        // style={{ marginLeft: "40px" }}
                                    >
                                        {trans('global.downloadClassSchedule', '班级总表简版')}
                                    </a>
                                </span>
                                <span style={{ marginLeft: '10px' }}>
                                    <a
                                        href="/api/import/templateDownload?name=班级总表完整版.xlsx"
                                        target="_blank"
                                        // style={{ marginLeft: "40px" }}
                                    >
                                        {trans(
                                            'global.downloadFullClassSchedule',
                                            '班级总表完整版'
                                        )}
                                    </a>
                                </span>
                            </div>
                            <div className={styles.upLoad}>
                                <span className={styles.text}>上传文件格式</span>
                                <span>
                                    <Select
                                        style={{ width: 100 }}
                                        onChange={this.importFileFormatChange}
                                        placeholder="请选择上传文件格式"
                                        value={importFileFormat}
                                        // defaultValue={'excel'}
                                    >
                                        <Option value="excel">Excel文件</Option>
                                        <Option value="fet">其他</Option>
                                    </Select>
                                </span>
                            </div>
                            <div className={styles.upLoad}>
                                <span className={styles.text}>
                                    {trans('student.uploadFile', '上传文件')}
                                </span>
                                <span className={styles.desc}>
                                    <span className={styles.fileBtn}>
                                        <Form
                                            id="uploadForm"
                                            layout="inline"
                                            method="post"
                                            className={styles.form}
                                            encType="multipart/form-data"
                                        >
                                            <Upload {...uploadProps}>
                                                <Button>
                                                    <Icon type="upload" />
                                                </Button>
                                            </Upload>
                                        </Form>
                                    </span>
                                </span>
                            </div>
                        </Spin>
                    </Modal>
                )}

                {/* 导入完成失败 */}
                {errorListModalVisibility && (
                    <Modal
                        className={styles.successModal}
                        visible={errorListModalVisibility}
                        title="导入失败"
                        closable={false}
                        width={1000}
                        footer={[
                            <Button
                                type="primary"
                                onClick={() => {
                                    this.setState({
                                        errorListModalVisibility: false,
                                        fileList: [],
                                    });
                                    this.props.fetchScheduleList();
                                    this.handleCancel();
                                }}
                            >
                                我知道了
                            </Button>,
                        ]}
                    >
                        <p>失败原因如下</p>
                        <Table
                            dataSource={checkErrorMessageList}
                            columns={errListColumns}
                            rowKey="lineNumber"
                            pagination={false}
                        />
                    </Modal>
                )}
            </div>
        );
    }
}
