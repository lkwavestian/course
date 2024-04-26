import React, { PureComponent } from 'react';
import styles from './index.less';
import {
    Modal,
    Upload,
    Button,
    message,
    Form,
    Dropdown,
    Spin,
    Table,
    Pagination,
    Input,
    InputNumber,
    Select,
    Menu,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import lodash from 'lodash';
import { trans, locale } from '../../../utils/i18n';

@connect((state) => ({
    importAddress: state.organize.importAddress,
    importStudentScore: state.organize.importStudentScore,
    addressListModal: state.organize.addressListModal,
    batchUpdateMessage: state.organize.batchUpdateMessage,
}))
@Form.create()
export default class TemporaryAddress extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
            isUploading: false,
            importModalVisible: false,
            importScoreModalVisible: false,
            successModalVisibility: false,
            downloadUrlVisibility: false,
            successNumber: '',
            failureNumber: '',
            checkErrorMessageList: '',

            //场地列表
            loading: false,
            pageNum: 1, // 页码
            total: 0, // 总数
            pageSize: 50, // 每页展示条数

            addAddressVisibility: false,
            batchUpdateVisibility: false,
            errorVisible: false,
            importErrorList: [],
            edit: false,
            addressInfo: {},
        };
    }

    componentDidMount() {
        this.getAddressList();
    }

    getAddressList = () => {
        const { pageSize, pageNum } = this.state;
        const { dispatch } = this.props;
        this.setState({
            loading: true,
        });
        dispatch({
            type: 'organize/getAddressList',
            payload: {
                pageSize,
                pageNum,
            },
        }).then(() => {
            const { addressListModal } = this.props;
            this.setState({
                loading: false,
                total: addressListModal.total,
            });
        });
    };

    // 切换页面
    changePage = (pageNum, pageSize) => {
        this.setState(
            {
                pageNum,
            },
            () => {
                this.getAddressList();
            }
        );
    };

    onShowSizeChange = (_, pageSize) => {
        this.setState(
            {
                pageNum: 1,
                pageSize,
            },
            () => {
                this.getAddressList();
            }
        );
    };

    handleCancel = () => {
        this.setState({
            importModalVisible: false,
        });
    };

    handleScoreCancel = () => {
        this.setState({
            importScoreModalVisible: false,
        });
    };

    // 确定从Excel导入
    sureImport = (e) => {
        let { fileList } = this.state;
        let formData = new FormData();
        for (let item of fileList) {
            formData.append('file', item);
        }

        if (!lodash.isEmpty(fileList)) {
            console.log('this.props.dispatch :>> ', this.props.dispatch);
            const { dispatch } = this.props;
            this.setState({
                isUploading: true,
            });
            dispatch({
                type: 'organize/importAddress',
                payload: formData,
            }).then(() => {
                console.log('this.props :>> ', this.props);
                let importAddress = this.props.importAddress;
                this.setState({
                    fileList: [],
                    isUploading: false,
                });
                this.setState(
                    {
                        pageSize: 50,
                        pageNum: 1,
                    },
                    () => {
                        this.getAddressList();
                    }
                );
                if (importAddress && !lodash.isEmpty(importAddress.checkErrorMessageList)) {
                    this.setState({
                        fileList: [],
                        importModalVisible: true,
                        successModalVisibility: true,
                        successNumber: importAddress.successNumber,
                        failureNumber: importAddress.failureNumber,
                        checkErrorMessageList: importAddress.checkErrorMessageList,
                    });
                } else {
                    message.success(trans('global.scheduleImportSuccess', '导入成功'));
                    this.setState({
                        fileList: [],
                        importModalVisible: false,
                    });
                }
            });
        }
    };

    studentCoreSureImport = (e) => {
        let { fileList } = this.state;
        let formData = new FormData();
        for (let item of fileList) {
            formData.append('file', item);
        }

        if (!lodash.isEmpty(fileList)) {
            console.log('this.props.dispatch :>> ', this.props.dispatch);
            const { dispatch } = this.props;
            this.setState({
                isUploading: true,
            });
            dispatch({
                type: 'organize/importStudentScore',
                payload: formData,
            }).then(() => {
                message.success('导入成功');
                console.log('this.props :>> ', this.props);
                this.setState({
                    fileList: [],
                    isUploading: false,
                    downloadUrlVisibility: true,
                });
            });
        }
    };

    importAddress = () => {
        this.setState({
            importModalVisible: true,
        });
    };

    importStudentScore = () => {
        this.setState({
            importScoreModalVisible: true,
        });
    };

    addAddress = () => {
        this.setState({
            addAddressVisibility: true,
            edit: false,
        });
    };

    addAddressCancel = () => {
        this.setState({
            addAddressVisibility: false,
        });
    };

    batchUpdateFile = () => {
        this.setState({
            batchUpdateVisibility: true,
        });
    };

    batchUpdateCancel = () => {
        this.setState({
            batchUpdateVisibility: false,
        });
    };

    addAddressOk = () => {
        const {
            dispatch,
            form: { validateFields },
        } = this.props;
        const { edit, addressInfo } = this.state;
        validateFields((err, values) => {
            if (!err) {
                dispatch({
                    type: edit ? 'organize/updateAddress' : 'organize/addAddress',
                    payload: edit ? { ...values, id: addressInfo.id } : values,
                }).then(() => {
                    message.success(edit ? '修改场地成功' : '新增场地成功');
                    this.setState(
                        {
                            addAddressVisibility: false,
                            pageSize: 50,
                            pageNum: 1,
                        },
                        () => {
                            this.getAddressList();
                        }
                    );
                });
            }
        });
    };

    lotImportFee = () => {
        const { fileList } = this.state;
        if (fileList.length == 0) {
            message.warn('请先上传文件再导入！');
            return;
        }
        let formData = new FormData();
        for (let item of fileList) {
            formData.append('file', item);
        }

        if (!lodash.isEmpty(fileList)) {
            const { dispatch } = this.props;
            this.setState({
                isUploading: true,
            });

            dispatch({
                type: 'organize/batchUpdateField',
                payload: formData,
            }).then(() => {
                let batchUpdateMessage = this.props.batchUpdateMessage;
                this.setState({
                    isUploading: false,
                });
                if (!lodash.isEmpty(batchUpdateMessage)) {
                    this.setState({
                        fileList: [],
                        importErrorList: batchUpdateMessage.checkErrorMessageList,
                        errorVisible: true,
                    });
                } else {
                    this.setState(
                        {
                            fileList: [],
                            importFeeVisible: false,
                            batchUpdateVisibility: false,
                        },
                        () => this.getAddressList()
                    );
                }
            });
        }
    };

    exportFees = () => {
        const { chooseCoursePlanId } = this.props;
        const { grade, subject, KeyWords } = this.state;
        let obj = {};
        obj.chooseCoursePlanId = chooseCoursePlanId;
        obj.gradeIdList = grade;
        obj.subjectIdList = subject;
        obj.keyword = KeyWords;
        let json = JSON.stringify(obj);
        console.log('json', json);
        let lastJson = encodeURI(json);
        console.log('lastJson', lastJson);
        window.open(`/api/address/exportField`);
        // mockForm('/api/courseFee/exportExcel', { stringData: lastJson });
    };

    editAddress = (obj) => {
        this.setState({
            addAddressVisibility: true,
            edit: true,
            addressInfo: obj,
        });
        this.props.form.setFieldsValue({
            // obj,
            cName: obj.name,
            eName: obj.englishName,
            remark: obj.remark,
            capacity: obj.capacity,
            featuresCName: obj.featuresCName,
            featuresEName: obj.featuresEName,
            featuresType: obj.featuresType,
            buildingArea: obj.buildingArea,
            floor: obj.floor,
        });
    };

    syncDingRoomClick = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'organize/syncDingRoom',
            onSuccess: () => {
                message.success('同步成功');
            },
        });
    };

    render() {
        const {
            fileList,
            isUploading,
            importModalVisible,
            successModalVisibility,
            successNumber,
            failureNumber,
            checkErrorMessageList,
            importScoreModalVisible,
            downloadUrlVisibility,
            importErrorList,
            errorVisible,
            //场地列表
            loading,
            pageNum,
            pageSize,
            total,
            addAddressVisibility,
            batchUpdateVisibility,
            edit,
        } = this.state;

        const {
            addressListModal,
            form: { getFieldDecorator },
        } = this.props;

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

        const addressColumns = [
            {
                title: trans('global.spaceName', '场地中文名'),
                dataIndex: 'name',
                key: 'name',
                align: 'center',
            },
            {
                title: trans('global.spaceEName', '场地英文名'),
                dataIndex: 'englishName',
                key: 'englishName',
                align: 'center',
            },
            {
                title: trans('global.remark', '备注'),
                dataIndex: 'remark',
                key: 'remark',
                align: 'center',
            },
            {
                title: trans('global.capacity', '容量'),
                dataIndex: 'capacity',
                key: 'capacity',
                align: 'center',
            },
            {
                title: trans('global.edit', '编辑'),
                dataIndex: '',
                key: '',
                align: 'center',
                render: (text, record, index) => (
                    <a onClick={() => this.editAddress(record)}>编辑</a>
                ),
            },
        ];

        let errorColumns = [
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

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };

        const menu = (
            <Menu>
                <Menu.Item onClick={this.importAddress}>批量导入</Menu.Item>
                <Menu.Item onClick={this.addAddress}>直接新建</Menu.Item>
            </Menu>
        );

        return (
            <div className={styles.frameworkPage}>
                <div className={styles.btnList}>
                    {/* <div className={styles.cogradientOrg} onClick={this.importAddress}>
                        <span>{trans('global.importManageSpaces', '导入场地')}</span>
                    </div>
                    <div className={styles.cogradientOrg} onClick={this.addAddress}>
                        <span>{trans('global.addSpaces', '新增场地')}</span>
                    </div> */}

                    <Dropdown overlay={menu}>
                        <div className={styles.cogradientOrg}>
                            <span>{trans('global.addSpaces', '新建场地')}</span>
                        </div>
                    </Dropdown>

                    <div className={styles.cogradientOrg} onClick={this.batchUpdateFile}>
                        <span>{trans('global.batchEditOper', '批量修改')}</span>
                    </div>
                    <div className={styles.cogradientOrg} onClick={this.syncDingRoomClick}>
                        <span>场地钉钉同步</span>
                    </div>
                </div>
                <Table
                    loading={loading}
                    columns={addressColumns}
                    dataSource={addressListModal.addressList}
                    pagination={false}
                    bordered
                />
                <Pagination
                    total={total}
                    // showSizeChanger={false}
                    showSizeChanger
                    showQuickJumper
                    style={{ float: 'right', margin: '20px 0' }}
                    onChange={this.changePage}
                    onShowSizeChange={this.onShowSizeChange}
                    current={pageNum}
                    pageSize={pageSize}
                    pageSizeOptions={['10', '20', '30', '40', '50']}
                />
                {/* 导入场地 */}
                <Modal
                    title={trans('global.importSpaces', '导入场地')}
                    visible={importModalVisible}
                    onCancel={this.handleCancel}
                    // onOk={() => console.log("aa")}
                    onOk={this.sureImport}
                    className={styles.modalStyle}
                    okText={trans('global.importScheduleConfirm', '确认导入')}
                >
                    <div>
                        {/* <span className={styles.explain}>操作说明</span>
                        <div>
                        </div>
                        <a
                            href="/api/address/template/download"
                            target="_blank"
                            // style={{ marginLeft: "40px" }}
                        >
                            下载导入模板
                        </a> */}
                        <p>
                            <span style={{ marginRight: '8px' }}>①</span>
                            {trans(
                                'global.downloadTemplateSpaces',
                                '下载导入模板，批量填写场地信息'
                            )}
                            <a
                                href="/api/address/template/download"
                                target="_blank"
                                style={{ marginLeft: '20px' }}
                            >
                                {/* 下载导入模板 */}
                                {trans('global.downloadImportTemplate', '下载导入模板')}
                            </a>
                        </p>
                        <p>
                            <span style={{ marginRight: '8px' }}>②</span>
                            {trans('global.uploadForm', '上传填写好的信息表')}
                        </p>
                    </div>

                    <Spin
                        spinning={isUploading}
                        tip={trans('global.file uploading', '文件正在上传中')}
                    >
                        <div className={styles.upLoad}>
                            {/* <span className={styles.text}>上传文件</span> */}
                            <span className={styles.desc}>
                                <span className={styles.fileBtn}>
                                    <Form
                                        id="uploadForm"
                                        layout="inline"
                                        method="post"
                                        className={styles.form}
                                        encType="multipart/form-data"
                                    >
                                        <Upload {...uploadProps} maxCount={1}>
                                            <Button type="primary" className={styles.chooseBtn}>
                                                {trans('global.scheduleSelectFile', '选择文件')}
                                            </Button>
                                        </Upload>
                                    </Form>
                                </span>
                            </span>
                        </div>
                    </Spin>
                </Modal>
                <Modal
                    visible={errorVisible}
                    footer={[
                        <Button
                            type="primary"
                            className={styles.reUpload}
                            onClick={() => {
                                this.setState({
                                    fileList: [],
                                    errorVisible: false,
                                });
                            }}
                        >
                            {trans('global.uploadAgain', '重新上传')}
                        </Button>,
                    ]}
                    onCancel={() =>
                        this.setState({
                            errorVisible: false,
                            fileList: [],
                        })
                    }
                    title="导入场地失败信息"
                    width={720}
                >
                    <p style={{ textAlign: 'center' }}>
                        {trans('global.thereAre', '当前上传的文件中共有')} &nbsp;
                        <span style={{ color: 'red' }}>
                            {importErrorList && importErrorList.length > 0
                                ? importErrorList.length
                                : null}{' '}
                        </span>
                        &nbsp;
                        {trans('global.pleaseUploadAgain', '条错误，请调整后重新上传')}
                    </p>
                    <Table
                        columns={errorColumns}
                        dataSource={importErrorList}
                        rowKey="lineNumber"
                        pagination={false}
                    ></Table>
                </Modal>
                <Modal
                    className={styles.importFees}
                    title={trans('global.editSpaces', '批量修改场地')}
                    visible={batchUpdateVisibility}
                    onCancel={() =>
                        this.setState({
                            batchUpdateVisibility: false,
                        })
                    }
                    footer={
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Button
                                onClick={() =>
                                    this.setState({
                                        batchUpdateVisibility: false,
                                    })
                                }
                                style={{
                                    borderRadius: '5px',
                                    border: 'none',
                                    color: 'rgb(90,99,128)',
                                    backgroundColor: '#E8E9EE',
                                    height: '32px',
                                }}
                            >
                                {trans('global.cancel', '取消')}
                            </Button>
                            <Button
                                style={{
                                    backgroundColor: fileList.length == 0 ? '#ccc' : 'blue',
                                    borderRadius: '5px',
                                    border: 'none',
                                    color: 'white',
                                    height: '32px',
                                    width: 'auto',
                                }}
                                onClick={() => this.lotImportFee()}
                                type="primary"
                            >
                                {trans('global.confirmEdit', '确认修改')}
                            </Button>
                        </div>
                    }
                >
                    <Spin
                        spinning={isUploading}
                        tip={trans('global.file uploading', '文件正在上传中')}
                    >
                        <div className={styles.upLoad}>
                            <div
                            // className={styles.importMsg}
                            // style={{ width: '60%', margin: '0 auto 16px' }}
                            >
                                <p>
                                    <span style={{ marginRight: '8px' }}>①</span>
                                    {trans(
                                        'global.downloadTemplateSpaces',
                                        '下载导入模板，批量填写场地信息'
                                    )}
                                    <a
                                        href="/api/address/template/download"
                                        target="_blank"
                                        style={{ marginLeft: '20px' }}
                                        onClick={() => window.open(`/api/address/exportField`)}
                                    >
                                        {/* 下载导入模板 */}
                                        {trans('global.Export', '导出')}
                                    </a>
                                </p>
                                <p>
                                    <span style={{ marginRight: '8px' }}>②</span>
                                    {trans('global.uploadForm', '上传填写好的信息表')}
                                </p>
                            </div>
                            <div
                                className={styles.importMsg}
                                // style={{
                                //     width: '60%',
                                //     margin: 'auto',
                                //     height: '40px',
                                //     display: 'flex',
                                // }}
                            >
                                {/* <p
                                    style={{
                                        verticalAlign: 'top',
                                        marginBottom: 0,
                                    }}
                                >
                                    <span>②</span>&nbsp;
                                    <span>上传文件</span>
                                </p> */}

                                <span className={styles.desc}>
                                    <span className={styles.fileBtn}>
                                        <Form
                                            id="uploadForm"
                                            layout="inline"
                                            method="post"
                                            className={styles.form}
                                            encType="multipart/form-data"
                                            style={{ display: 'inline-block' }}
                                        >
                                            <Upload {...uploadProps} maxCount={1}>
                                                <Button
                                                    type="primary"
                                                    // style={{
                                                    //     height: '32px',
                                                    //     position: 'relative',
                                                    //     left: '40px',
                                                    //     bottom: '5px',
                                                    // }}
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

                {/* 导入学生成绩 */}
                <Modal
                    title="导入学生成绩"
                    visible={importScoreModalVisible}
                    onCancel={this.handleScoreCancel}
                    // onOk={() => console.log("aa")}
                    onOk={this.studentCoreSureImport}
                >
                    <div>
                        <span className={styles.explain}>操作说明</span>
                        <div>
                            {/* <p>1. 需确保所导入的课程、教师、地点信息已存在</p>
              <p>
                2.
                若同节次已有和相同课程相同班级的课表，则只进行教师、地点的更新
              </p>
              <p>
                3.
                导入时，系统不做冲突校验，导入完成后请自行借助课表检查工具进行冲突检查
              </p> */}
                        </div>
                        <a
                            href="/api/address/template/download"
                            target="_blank"
                            // style={{ marginLeft: "40px" }}
                        >
                            {trans('global.downloadImportTemplate', '下载导入模板')}
                        </a>
                    </div>

                    <Spin
                        spinning={isUploading}
                        tip={trans('global.file uploading', '文件正在上传中')}
                    >
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
                                        <Upload {...uploadProps} maxCount={1}>
                                            <Button type="primary">
                                                {trans('global.scheduleSelectFile', '选择文件')}
                                            </Button>
                                        </Upload>
                                    </Form>
                                </span>
                            </span>
                        </div>
                    </Spin>
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
                                    fileList: [],
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
                            : `处理完成，共成功处理 ${successNumber} 条，失败 ${failureNumber}
              条，失败原因如下:`}
                    </p>
                    <Table
                        dataSource={checkErrorMessageList}
                        columns={columns}
                        rowKey="lineNumber"
                        pagination={false}
                    />
                </Modal>

                <Modal
                    visible={downloadUrlVisibility}
                    footer={[]}
                    onCancel={() =>
                        this.setState({
                            downloadUrlVisibility: false,
                        })
                    }
                >
                    <a
                        href="/api/init/downloadDivideGroup"
                        target="_blank"
                        // style={{ marginLeft: "40px" }}
                    >
                        导出分层班
                    </a>
                </Modal>

                <Modal
                    visible={addAddressVisibility}
                    title={!edit ? trans('global.addSpaces', '新增场地') : '编辑场地'}
                    onCancel={this.addAddressCancel}
                    onOk={this.addAddressOk}
                    closable={false}
                    centered={true}
                    destroyOnClose={true}
                    className={`${styles.modalStyle} ${styles.addAddressStyle}`}
                    width="800px"
                >
                    <Form name="addAddress" {...formItemLayout}>
                        <Form.Item label={trans('global.spaceName', '场地名称')}>
                            {getFieldDecorator('cName', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入场地名称',
                                    },
                                ],
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label={trans('global.spacesEnglishName', '场地英文名称')}>
                            {getFieldDecorator('eName', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入场地英文名称',
                                    },
                                ],
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label={trans('global.remark', '备注')}>
                            {getFieldDecorator('remark')(<Input />)}
                        </Form.Item>
                        <Form.Item label={trans('global.Capacity', '人数容量')}>
                            {getFieldDecorator('capacity', {
                                rules: [
                                    {
                                        type: 'number',
                                        message: '人数容量必须为整数',
                                    },
                                ],
                            })(<InputNumber />)}
                        </Form.Item>
                        <Form.Item label={trans('global.functionName', '功能中文名')}>
                            {getFieldDecorator('featuresCName')(<Input />)}
                        </Form.Item>
                        <Form.Item label={trans('global.functionEnglishName', '功能英文名')}>
                            {getFieldDecorator('featuresEName')(<Input />)}
                        </Form.Item>

                        <Form.Item
                            label={trans('global.functionType', '功能类型')}
                            className={styles.formItem}
                        >
                            {getFieldDecorator('featuresType', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择功能类型',
                                    },
                                ],
                            })(
                                <Select defaultValue={1}>
                                    <Option value={1}>{trans('global.Classroom', '教室')}</Option>
                                    <Option value={2}>{trans('global.Dormitory', '宿舍')}</Option>
                                    <Option value={3}>{trans('global.Office', '办公室')}</Option>
                                    <Option value={4}>
                                        {trans('global.Meeting room', '会议室')}
                                    </Option>
                                    <Option value={5}>
                                        {trans('global.Health room', '医疗室')}
                                    </Option>
                                </Select>
                            )}
                        </Form.Item>

                        <Form.Item label={trans('global.Building area', '楼区')}>
                            {getFieldDecorator('buildingArea')(<Input />)}
                        </Form.Item>
                        <Form.Item label={trans('global.Floor', '楼层')}>
                            {getFieldDecorator('floor', {
                                rules: [
                                    {
                                        type: 'number',
                                        message: '请输入楼层,并且楼层必须为整数',
                                    },
                                ],
                            })(<InputNumber />)}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}
