import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Form, Radio, Icon, Button, Modal, Spin, Upload, message } from 'antd';
import AllGrade from './allGrade/index';
import SetClass from './setClass/index';
import CanCheck from './canCheck/index';
import { trans } from '../../../../../utils/i18n';
import lodash from 'lodash';
import devision from '../../../../../models/devision';
@Form.create()
@connect((state) => ({
    importStudentColunteer: state.devision.importStudentColunteer,
    importStudentExcel: state.devision.importStudentExcel,
    importStudentScoreExcel: state.devision.importStudentScoreExcel,
    importStudentClassExcel: state.devision.importStudentClassExcel,
    importStudentScoreList: state.devision.importStudentScoreList,
    importStudentClassList: state.devision.importStudentClassList,
}))
export default class ExportData extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            radioValue: 'a',
            importModalVisible: false,
            isUploading: false,
            isModalLoading: false,
            fileList: [],
            sureImport: false,
            loading: false,
            fileScoreList: [],
            sureImportScore: false,
            importModalScoreVisible: false,
            columns: [],
            studentScoreTitle: [],
        };
        // this.ref = null;
    }

    componentDidMount() {
        console.log('this', this);
        // this.props.onRef(this);
        // this.getDetailById(this.props.id);
        // this.getImportStudentColunteer(this.props.id);
        // this.getImportStudentClass(this.props.id);
        // this.getImportStudentScore(this.props.id);
        console.log('this.props.id', this.props.id);
    }

    getImportStudentColunteer = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'devision/importStudentColunteer',
            payload: {
                dividePlanId: id,
            },
        }).then(() => {
            const { importStudentColunteer } = this.props;
            this.setState({
                gradeName: importStudentColunteer.title,
                stuList: importStudentColunteer.result,
            });
        });
    };

    getImportStudentClass = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'devision/importStudentClassList',
            payload: {
                divideGroupId: id,
            },
        }).then(() => {
            const { importStudentClassList } = this.props;
            this.setState({
                gradeName: importStudentClassList.title,
                stuClass: importStudentClassList.result,
                loading: false,
            });
        });
        this.setState({
            loading: true,
        });
    };

    getImportStudentScore = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'devision/importStudentScoreList',
            payload: {
                dividePlanId: this.props.id,
            },
        }).then(() => {
            const { importStudentScoreList } = this.props;
            this.setState({
                gradeName: importStudentScoreList.title,
                stuScore: importStudentScoreList.result,
                loading: false,
            });
        });
        this.setState({
            loading: true,
        });
    };

    changeRadio = (e) => {
        this.setState({
            radioValue: e.target.value,
        });
    };

    // 确定从Excel导入
    sureImportStudentColunteer = (e) => {
        const { fileList, radioValue } = this.state;
        console.log('fileList', fileList);
        let formData = new FormData();

        for (let item of fileList) {
            formData.append('file', item);
        }
        formData.append('dividePlanId', this.props.id);

        console.log('fileList', formData);

        if (!lodash.isEmpty(fileList) && radioValue == 'a') {
            // console.log("this.props.dispatch :>> ", this.props.dispatch);
            const { dispatch } = this.props;
            const { radioValue } = this.state;
            this.setState({
                isUploading: true,
            });
            dispatch({
                type: 'devision/importStudentExcel',
                payload: formData,
            }).then(() => {
                console.log('bbbbbbbbb');
                // console.log("this.props :>> ", this.props);
                let importStudentExcel = this.props.importStudentExcel;

                console.log('first', importStudentExcel);
                this.setState({
                    fileList: [],
                    isUploading: false,
                });
                // debugger;
                if (!lodash.isEmpty(importStudentExcel)) {
                    Modal.error({
                        content:
                            !lodash.isEmpty(importStudentExcel) && importStudentExcel.toString(),
                    });
                    this.setState({
                        fileList: [],
                        importModalVisible: false,
                        successModalVisibility: true,
                    });
                } else {
                    message.success(trans('global.scheduleImportSuccess', '导入成功'));
                    this.getImportStudentColunteer(this.props.id);
                    // this.ref.getImportStudentClass();
                    this.setState(
                        {
                            fileList: [],
                            importModalVisible: false,
                            sureImportStudentColunteer: true,
                        },
                        () => {
                            console.log(
                                'sureImportStudentColunteer',
                                this.state.sureImportStudentColunteer
                            );
                        }
                    );
                }
            });
        }
    };

    sureImportScore = (e) => {
        const { fileList, radioValue } = this.state;
        console.log('fileList', fileList);
        let formData = new FormData();

        for (let item of fileList) {
            formData.append('file', item);
        }
        formData.append('dividePlanId', this.props.id);

        console.log('fileList', formData);

        if (!lodash.isEmpty(fileList) && radioValue == 'b') {
            // console.log("this.props.dispatch :>> ", this.props.dispatch);
            const { dispatch } = this.props;
            const { radioValue } = this.state;
            this.setState({
                isUploading: true,
            });
            dispatch({
                type: 'devision/importStudentScoreExcel',
                payload: formData,
            }).then(() => {
                // console.log("this.props :>> ", this.props);
                let importStudentScoreExcel = this.props.importStudentScoreExcel;

                console.log('first', importStudentScoreExcel);
                this.setState({
                    fileList: [],
                    isUploading: false,
                });
                if (!lodash.isEmpty(importStudentScoreExcel)) {
                    Modal.error({
                        content:
                            !lodash.isEmpty(importStudentScoreExcel) &&
                            importStudentScoreExcel.toString(),
                    });
                    this.setState({
                        fileList: [],
                        importModalScoreVisible: false,
                        successModalVisibility: true,
                    });
                } else {
                    message.success(trans('global.scheduleImportSuccess', '导入成功'));
                    this.getImportStudentScore();
                    // // this.ref.getImportStudentClass();
                    this.setState(
                        {
                            fileList: [],
                            importModalScoreVisible: false,
                            sureImportScore: true,
                        },
                        () => {
                            console.log('sureImportScore', this.state.sureImportScore);
                        }
                    );
                }
            });
        }
    };

    importStudentExcel = () => {
        this.setState({
            importModalVisible: true,
        });
    };

    handleCancel = () => {
        this.setState({
            importModalVisible: false,
        });
    };

    importStudentScoreExcel = () => {
        this.setState({
            importModalScoreVisible: true,
        });
    };

    importStudentScoreExcel = () => {
        this.setState({
            importModalScoreVisible: true,
        });
    };

    handleScoreCancel = () => {
        this.setState({
            importModalScoreVisible: false,
        });
    };

    // onRef = (ref) => {
    //     this.ref = ref;
    // };

    render() {
        const {
            radioValue,
            importModalVisible,
            isUploading,
            fileList,
            stuClass,
            stuList,
            stuScore,
            loading,
            importStudentScoreExcel,
            importModalScoreVisible,
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
        return (
            <div>
                <div className={styles.header}>
                    <Radio.Group
                        value={radioValue}
                        buttonStyle="solid"
                        className={styles.tabs}
                        onChange={this.changeRadio}
                    >
                        <Radio.Button value="a">导入学生选课志愿</Radio.Button>
                        <Radio.Button value="b">导入学生成绩</Radio.Button>
                        {/* <Radio.Button value="c">设置班级</Radio.Button> */}
                    </Radio.Group>
                    <div>
                        {radioValue == 'a' ? (
                            <div>
                                {/* <span className={styles.combine}>
                                    <Icon type="bar-chart" />
                                    <span>查看学生组合分布</span>
                                </span> */}
                                <Button
                                    type="primary"
                                    className={styles.importStu}
                                    onClick={this.importStudentExcel}
                                >
                                    导入学生选课志愿
                                </Button>
                            </div>
                        ) : radioValue == 'b' ? (
                            <Button
                                type="primary"
                                className={styles.importGrade}
                                onClick={this.importStudentScoreExcel}
                            >
                                导入成绩
                            </Button>
                        ) : (
                            <Button
                                type="primary"
                                className={styles.importClass}
                                onClick={this.importStudentExcel}
                            >
                                导入班级
                            </Button>
                        )}
                    </div>
                </div>
                {
                    radioValue == 'a' ? (
                        <CanCheck
                            // onRef={this.onRef}
                            // loading={this.props.loading}
                            id={this.props.id}
                            // stuList={stuList}
                            getImportStudentColunteer={this.getImportStudentColunteer}
                        />
                    ) : radioValue == 'b' ? (
                        <AllGrade
                            // onRef={this.onRef}
                            loading={loading}
                            // stuScore={stuScore}
                            getImportStudentScore={this.getImportStudentScore}
                        />
                    ) : null
                    // : (
                    //     <SetClass
                    //         // onRef={this.onRef}
                    //         loading={loading}
                    //         stuClass={stuClass}
                    //         getImportStudentClass={this.getImportStudentClass}
                    //     />
                    // )
                }

                <Modal
                    title="导入学生选课志愿"
                    visible={importModalVisible}
                    onCancel={this.handleCancel}
                    onOk={this.sureImportStudentColunteer}
                >
                    <div>
                        <span className={styles.explain}>操作说明</span>
                        <div></div>
                        <a
                            href="/api/divide/studentChooseDownload"
                            target="_blank"
                            // style={{ marginLeft: "40px" }}
                        >
                            下载导入模板
                        </a>
                    </div>

                    <Spin spinning={isUploading} tip="文件正在上传中">
                        <div className={styles.upLoad}>
                            <span className={styles.text}>上传文件</span>
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
                <Modal
                    title="导入学生成绩"
                    visible={importModalScoreVisible}
                    onCancel={this.handleScoreCancel}
                    onOk={this.sureImportScore}
                >
                    <div>
                        <span className={styles.explain}>操作说明</span>
                        <div></div>
                        <a
                            href="/api/divide/student/divideStudentScoreImportExcelTemplateDownload"
                            target="_blank"
                            // style={{ marginLeft: "40px" }}
                        >
                            下载导入模板
                        </a>
                    </div>

                    <Spin spinning={isUploading} tip="文件正在上传中">
                        <div className={styles.upLoad}>
                            <span className={styles.text}>上传文件</span>
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
            </div>
        );
    }
}
