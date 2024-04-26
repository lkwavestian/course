//课程设置
import React, { PureComponent, Fragment } from 'react';
import {
    Table,
    Icon,
    Menu,
    Dropdown,
    Button,
    Modal,
    message,
    Divider,
    Form,
    Upload,
    Spin,
} from 'antd';

import { connect } from 'dva';
import styles from './index.less';
import { routerRedux } from 'dva/router';
import { trans, locale } from '../../../utils/i18n';
import SearchHTML from './searchHTML';
import CourseTable from './courseTable';
import SubjectTable from './subjectTable';
import AreaContent from './areaContent';
import NewCourse from './newCourse';
import EvaluationStandard from './evaluationStandard';
import { debounce } from '../../../utils/utils';
import lodash from 'lodash';
import { Flex } from 'antd-mobile';

let hashName = ['course', 'subject', 'area', 'graduationCriteria'];
@connect((state) => ({
    semesterList: state.time.semesterList,
    gradeList: state.time.gradeList,
    subjectList: state.course.subjectList,
    schoolList: state.course.schoolList,
    getIsDisableNum: state.course.getIsDisableNum,
    allAddress: state.course.allAddress,
    allStage: state.time.allStage,
    listCourse: state.course.listCourse,
    batchUpdateCourse: state.course.batchUpdateCourse,
    courseImportMessage: state.course.courseImportMessage,
    listSchoolInfo: state.organize.listSchoolInfo,
}))
class CourseSetUp extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            tabTitleList: [
                trans('course.setup.index.course.list', '课程列表'),
                trans('course.setup.index.subject.list', '学科列表'),
                trans('course.setup.index.area.list', '领域列表'),
                trans('course.setup.index.setCourseCredit', '设置课程学分毕业标准'),
            ],
            tabIndex:
                props.match.params && props.match.params.tabType
                    ? hashName.findIndex((item) => item == props.match.params.tabType)
                    : 0,
            searchValue: '',
            disableFalseCount: 0,
            loadPopup: false, // 默认所有弹窗是隐藏的
            visibleNewCourse: false, // 新建课程弹窗默认是隐藏
            data: {},
            isCourseEdit: true, // 课程是新建还是编辑
            courseIndex: 0,
            disableStatus: false, // 默认是全部的
            visibleFromExcel: false, // 从Excel导入弹层显隐
            initialCourseVisible: false,
            fileList: [],
            initializeCourseFileList: [],
            batchUpdateVisible: false,
            isUploading: false,
            coursePlanFileList: [],
            importConfirmBtn: true,
            isChecking: false,
            checkErrorMessageList: [],
            failureNumber: '',
            checkModalVisibility: false,
            errorVisible: false,
            uploadNewCourse: false,
        };
        this.disableStatusIndex = 0;
    }

    componentDidMount() {
        this.initOriginalData();
        this.getCourseBySubject();
        this.initIsDisableNum();
    }

    //科目-课程级联
    getCourseBySubject() {
        const { dispatch } = this.props;
        dispatch({
            type: 'timeTable/fetchCourseBySubject',
            payload: {},
        });
    }

    initIsDisableNum() {
        const { dispatch } = this.props;
        const self = this;
        dispatch({
            type: 'course/getIsDisableNum',
            payload: {},
            onSuccess: (data) => {
                if (data) {
                    self.setState({
                        disableFalseCount: data.disableNumber,
                        disableTrueCount: data.enableNumber,
                    });
                }
            },
        });
    }

    initOriginalData() {
        const { dispatch } = this.props;
        let p1 = new Promise((resolve, reject) => {
            //获取校区
            dispatch({
                // type: 'course/schoolList',
                // payload: {},
                // 20231025替换
                type: 'organize/getlistSchool',
                payload: {},
                onSuccess: () => {
                    resolve(null);
                },
            });
        });
        let p2 = new Promise((resolve, reject) => {
            //获取年级
            dispatch({
                type: 'time/getGradeList',
                payload: {},
                onSuccess: () => {
                    resolve(null);
                },
            });
        });
        let p3 = new Promise((resolve, reject) => {
            //获取学期
            dispatch({
                type: 'time/getSemesterList',
                payload: {},
                onSuccess: () => {
                    resolve(null);
                },
            });
        });
        let p4 = new Promise((resolve, reject) => {
            //获取科目
            /* if (typeof courseIndex_subjectList !== 'undefined') {
                dispatch({
                    type: 'course/getCourseIndexSubjectList',
                    payload: courseIndex_subjectList,
                    onSuccess: () => {
                        resolve(null);
                    },
                });
            } else { */
            dispatch({
                type: 'course/getSubjectList',
                payload: {},
                onSuccess: () => {
                    resolve(null);
                },
            });
            // }
        });

        let p5 = new Promise((resolve, reject) => {
            dispatch({
                type: 'course/allAddress',
                payload: {},
                onSuccess: () => {
                    resolve(null);
                },
            });
        });

        let p6 = new Promise((resolve, reject) => {
            dispatch({
                type: 'time/allStage',
                payload: {},
                onSuccess: () => {
                    resolve(null);
                },
            });
        });

        // 全部加载完在去展示弹窗
        Promise.all([p1, p2, p3, p4, p5, p6]).then(() => {
            this.setState({
                loadPopup: true,
            });
        });
    }

    // 课程搜索回调函数
    searchCourse = () => {
        console.log('state', this.childSearch.state);
        this.childCourse.resetSearch(this.childSearch.state);
        if (this.state.isCourseEdit) {
            this.initIsDisableNum();
        }
    };

    /**
     * item 编辑时对象
     * bol true 为新建， false 为编辑
     */
    showNewCourse = (item, bol) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'course/getSubjectList',
            payload: {},
        }).then(() => {
            this.setState({
                visibleNewCourse: true,
                data: item,
                isCourseEdit: bol,
            });
        });
    };

    swithcActive = (index) => {
        let { disableStatus, courseIndex } = this.state;
        if (index == courseIndex) {
            if (this.disableStatusIndex == 0) {
                this.disableStatusIndex++;
            }
            this.setState(
                {
                    disableStatus: !disableStatus,
                },
                () => {
                    this.childCourse.resetSearch(this.searchNavCourse());
                }
            );
        } else {
            this.disableStatusIndex = 0;
            this.setState(
                {
                    courseIndex: index,
                    disableStatus: true,
                },
                () => {
                    this.childCourse.resetSearch(this.searchNavCourse());
                }
            );
        }
    };

    // tab 切换
    searchNavCourse = () => {
        let { disableStatus, courseIndex } = this.state;
        let data = this.childSearch.state || {};
        if (courseIndex == 0) {
            if (disableStatus) {
                data.disableStatus = 0;
            } else {
                delete data.disableStatus;
            }
        } else {
            if (disableStatus) {
                data.disableStatus = 1;
            } else {
                delete data.disableStatus;
            }
        }

        return data;
    };

    judgeMessage = () => {
        if (this.state.isChecking) {
            return true;
        }
        if (this.state.isUploading) {
            return false;
        }
    };

    // 课程列表内容
    courseListHTML() {
        let {
            disableTrueCount,
            disableFalseCount,
            disableStatus,
            courseIndex,
            visibleFromExcel,
            initialCourseVisible,
            fileList,
            initializeCourseFileList,
            uploadNewCourse,
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
        const initialUploadProps = {
            onRemove: (file) => {
                this.setState((state) => {
                    const index = state.initializeCourseFileList.indexOf(file);
                    const newFileList = state.initializeCourseFileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        initializeCourseFileList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {
                this.setState((state) => ({
                    initializeCourseFileList: [...state.initializeCourseFileList, file],
                }));
                return false;
            },
            initializeCourseFileList,
        };

        const menu = (
            <Menu>
                <Menu.Item onClick={this.showNewCourse.bind(this, {}, true)}>直接新建</Menu.Item>
                <Menu.Item
                    onClick={() => {
                        this.setState({
                            visibleFromExcel: true,
                        });
                    }}
                >
                    批量导入
                </Menu.Item>
            </Menu>
        );

        return (
            <div className={styles.courseContent}>
                <SearchHTML
                    {...this.props}
                    onRef={(ref) => {
                        // 获取子子组件实例上的所有方法和属性
                        this.childSearch = ref;
                    }}
                    {...this.childCourse}
                    callback={this.searchCourse}
                />
                <div className={styles.handle}>
                    <div>
                        {[disableTrueCount, disableFalseCount].map((el, i) => (
                            <span
                                key={i}
                                className={`${styles.action} ${
                                    disableStatus && courseIndex == i ? styles.active : ''
                                }`}
                                onClick={this.swithcActive.bind(this, i)}
                            >
                                {el}
                                <span>
                                    {i == 0
                                        ? trans('global.enable', '启用')
                                        : trans('global.disable', '禁用')}
                                </span>
                            </span>
                        ))}
                    </div>
                    <Modal
                        title={trans('global.importCourses', '从Excel批量导入课程')}
                        visible={visibleFromExcel}
                        onCancel={this.excelModalClose}
                        onOk={debounce(this.sureImport)}
                        className={styles.exportModal}
                        okText={trans('global.importScheduleConfirm', '确认导入')}
                    >
                        <Spin
                            spinning={uploadNewCourse}
                            tip={trans('global.file uploading', '文件正在上传中')}
                        >
                            <div>
                                {/* <span className={styles.explain}>{trans('', '操作说明')}</span>
                            <span>
                                {trans(
                                    '',
                                    '从Excel导入课程，需确保所导入课程基础信息、教师信息已存在。'
                                )}
                            </span> */}
                                <p>
                                    <span style={{ marginRight: '8px' }}>①</span>
                                    {trans(
                                        'global.downloadTemplateCourse',
                                        '下载导入模板，批量填写课程信息'
                                    )}
                                    <a
                                        href="/api/course/manager/courseTemplateDownload"
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
                            <div className={styles.upLoad}>
                                {/* <span className={styles.text}>{trans('', '上传文件')}</span> */}
                                <span className={styles.desc}>
                                    <span className={styles.fileBtn}>
                                        <Form
                                            id="uploadForm"
                                            layout="inline"
                                            method="post"
                                            className={styles.form}
                                            encType="multipart/form-data"
                                        >
                                            <Upload size="small" {...uploadProps} maxCount={1}>
                                                <Button>
                                                    {/* <Icon type="upload" /> */}
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
                        title={trans('', '从Excel批量导入课程')}
                        visible={initialCourseVisible}
                        onCancel={this.initializeCourseClose}
                        onOk={debounce(this.initializeCourseSureImport)}
                    >
                        <div>
                            <span className={styles.explain}>{trans('', '操作说明')}</span>
                            <span>
                                {trans(
                                    '',
                                    '从Excel导入课程，需确保所导入课程基础信息、教师信息已存在。'
                                )}
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
                                        <Upload size="small" {...initialUploadProps}>
                                            <Button>
                                                <Icon type="upload" />
                                            </Button>
                                        </Upload>
                                    </Form>
                                </span>
                            </span>
                            <span>
                                课程导入模板请{' '}
                                <a
                                    href="/api/course/manager/courseTemplateDownload"
                                    target="_blank"
                                >
                                    {trans('global.downloadImportTemplate', '下载导入模板')}
                                </a>
                            </span>
                        </div>
                    </Modal>
                    {/* <Button
                        className={styles.btn2}
                        onClick={() => {
                            this.setState({
                                initialCourseVisible: true,
                            });
                        }}
                        type="primary"
                        shape="round"
                    >
                        导入课程进阶关系
                    </Button> */}
                    {/* <Button
                        className={styles.btn2}
                        onClick={() => {
                            this.setState({
                                visibleFromExcel: true,
                            });
                        }}
                        type="primary"
                        shape="round"
                    >
                        {trans('course.setup.index.import.course', '导入课程')}
                    </Button>
                    <Button
                        type="primary"
                        onClick={this.showNewCourse.bind(this, {}, true)}
                        // className={styles.btn}
                        style={{ marginLeft: '10px' }}
                    >
                        +{trans('course.setup.index.new.course', '新建课程')}
                    </Button> */}

                    <Dropdown overlay={menu}>
                        <Button className={styles.btn2} type="primary">
                            新建课程
                        </Button>
                    </Dropdown>

                    <Button
                        type="primary"
                        onClick={() =>
                            this.setState({
                                batchUpdateVisible: true,
                            })
                        }
                        className={styles.btn4}
                        style={{ marginLeft: '10px' }}
                    >
                        {trans('courseSet.batchSet', '批量设置')}
                    </Button>
                </div>
                <CourseTable
                    showNewCourse={this.showNewCourse}
                    initIsDisableNum={this.initIsDisableNum}
                    parentThis={this}
                    onRef={(ref) => {
                        // 获取子子组件实例上的所有方法和属性
                        this.childCourse = ref;
                    }}
                />
            </div>
        );
    }

    hideModal = (type) => {
        switch (type) {
            case 'visibleNewCourse':
                this.setState({
                    visibleNewCourse: false,
                });
                break;
            default:
                break;
        }
    };

    // 关闭Excel导入弹层
    excelModalClose = () => {
        this.setState({
            visibleFromExcel: false,
            fileList: [],
        });
    };

    initializeCourseClose = () => {
        this.setState({
            initialCourseVisible: false,
            initializeCourseFileList: [],
        });
    };

    sureImport = (e) => {
        let { fileList } = this.state;
        let formData = new FormData();
        for (let item of fileList) {
            formData.append('courseFile', item);
        }
        if (!lodash.isEmpty(fileList)) {
            this.setState({
                uploadNewCourse: true,
            });
            this.props
                .dispatch({
                    type: 'course/courseImport',
                    payload: formData,
                    /* onSuccess: (res) => {
                    message.success('导入成功');
                    this.initOriginalData();
                    this.initIsDisableNum();
                    this.setState({
                        fileList: [],
                        visibleFromExcel: false,
                    });
                    this.childCourse.initList();
                    // this.props.form.resetFields();
                }, */
                })
                .then(() => {
                    let { courseImportMessage } = this.props;
                    this.setState({
                        uploadNewCourse: false,
                    });
                    if (!lodash.isEmpty(courseImportMessage)) {
                        this.setState({
                            fileList: [],
                            importErrorList: courseImportMessage.checkErrorMessageList,
                            errorVisible: true,
                        });
                    } else {
                        this.initOriginalData();
                        this.initIsDisableNum();
                        this.setState({
                            fileList: [],
                            visibleFromExcel: false,
                        });
                        this.childCourse.initList();
                    }
                });
        }
    };

    initializeCourseSureImport = () => {
        let { initializeCourseFileList } = this.state;
        let formData = new FormData();
        for (let item of initializeCourseFileList) {
            formData.append('file', item);
        }
        if (!lodash.isEmpty(initializeCourseFileList)) {
            this.props.dispatch({
                type: 'course/initializeCourseId',
                payload: formData,
                onSuccess: (res) => {
                    message.success('导入成功');
                    /* this.initOriginalData();
          this.initIsDisableNum();
          this.setState({
            initializeCourseFileList: [],
            visibleFromExcel: false,
          });
          this.childCourse.initList(); */
                    this.setState({
                        initializeCourseFileList: [],
                        initialCourseVisible: false,
                    });
                },
            });
        }
    };

    batchUpdateOk = () => {
        let { coursePlanFileList } = this.state;
        let formData = new FormData();
        for (let item of coursePlanFileList) {
            formData.append('file', item);
        }
        if (!lodash.isEmpty(coursePlanFileList)) {
            this.setState({
                isUploading: true,
                isChecking: true,
            });
            this.props
                .dispatch({
                    type: 'course/batchUpdateCourse',
                    payload: formData,
                    onSuccess: () => {
                        this.setState({
                            coursePlanFileList: [],
                            // importConfirmBtn: true,
                        });
                    },
                })
                /* .then(() => {
                    let importByTypeCalendar = this.props.importByTypeCalendar;
                    this.setState({
                        isUploading: false,
                    });
                    if (!importByTypeCalendar) {
                        message.success(trans('global.scheduleImportSuccess', '导入成功'));
                        this.setState({
                            coursePlanFileList: [],
                            batchUpdateVisible: false,
                        });
                    }
                }); */
                .then(() => {
                    let batchUpdateCourse = this.props.batchUpdateCourse;
                    this.setState({
                        isChecking: false,
                        isUploading: false,
                    });
                    if (batchUpdateCourse && batchUpdateCourse.checkErrorMessageList) {
                        this.setState({
                            coursePlanFileList: [],
                            checkModalVisibility: true,
                            successNumber: batchUpdateCourse.successNumber,
                            failureNumber: batchUpdateCourse.failureNumber,
                            checkErrorMessageList: batchUpdateCourse.checkErrorMessageList,
                        });
                    } else {
                        message.success('批量修改成功');
                        this.setState(
                            {
                                coursePlanFileList: [],
                                batchUpdateVisible: false,
                                importConfirmBtn: true,
                            },
                            () => {
                                this.childCourse.initList();
                            }
                        );
                    }
                });
        }
    };

    exportToSet = () => {
        const { coursesIdList } = this.childCourse.state;
        window.open(`/api/course/manager/exportCourseExcel?courseIds=${coursesIdList}`);
        // this.childCourse.clearCourseId();
    };

    reUpload = () => {
        let cancelBtn = document.getElementsByClassName('anticon-delete')[0];
        cancelBtn.click();
        this.setState({ checkModalVisibility: false, importConfirmBtn: true });
    };

    setTabIndex = (i) => {
        this.setState({
            tabIndex: i,
        });
        this.props.dispatch(routerRedux.push(`/course/index/1/${hashName[i]}`));
        if (window.self != window.parent) {
            window.parent.postMessage({ hashName: hashName[i] }, '*');
        }
        // localStorage.setItem('tabIndex', i);
    };

    render() {
        let {
            tabTitleList,
            tabIndex,
            visibleNewCourse,
            loadPopup,
            batchUpdateVisible,
            isUploading,
            isChecking,
            coursePlanFileList,
            importConfirmBtn,
            checkErrorMessageList,
            failureNumber,
            checkModalVisibility,
            importErrorList,
            errorVisible,
        } = this.state;

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
                        formData.append('id', 1);
                    }
                );

                return false;
            },
            coursePlanFileList,
        };
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
        let errorColumns = [
            {
                title: '原文件行号',
                dataIndex: 'lineNumber',
                width: 110,
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
        return (
            <div className={styles.CourseSetUp}>
                <div className={styles.CourseSetUpCon}>
                    <div className={styles.tab}>
                        {tabTitleList.map((el, i) => (
                            <span
                                onClick={() => this.setTabIndex(i)}
                                className={
                                    tabIndex == i
                                        ? `${styles.title} ${styles.active}`
                                        : `${styles.title}`
                                }
                                key={i}
                            >
                                {el}
                            </span>
                        ))}
                    </div>
                    {tabIndex == 3 ? (
                        <EvaluationStandard />
                    ) : tabIndex === 0 ? (
                        this.courseListHTML()
                    ) : tabIndex === 1 ? (
                        <SubjectTable />
                    ) : (
                        <AreaContent />
                    )}
                </div>
                {loadPopup && (
                    <Fragment>
                        {visibleNewCourse && (
                            <NewCourse
                                visibleNewCourse={visibleNewCourse}
                                hideModal={this.hideModal}
                                searchCourse={this.searchCourse}
                                {...this.props}
                                {...this.state}
                            />
                        )}
                    </Fragment>
                )}
                <Modal
                    visible={batchUpdateVisible}
                    title={trans('courseSet.batchEditCourses', '批量修改')}
                    okText={trans('global.importScheduleConfirm', '确认导入')}
                    onCancel={() =>
                        this.setState({ batchUpdateVisible: false, importConfirmBtn: true })
                    }
                    closable={false}
                    onOk={lodash.debounce(this.batchUpdateOk, 1000)}
                    okButtonProps={{
                        disabled: importConfirmBtn /* type: "primary" */,
                    }}
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
                            {/* <div
                                className={styles.importMsg}
                                style={{ width: '60%', margin: '0 auto 16px' }}
                            >
                                <span>①</span>&nbsp;
                                <span>导出需要修改的信息，批量修改</span>
                                <a
                                    style={{ color: 'blue', marginLeft: '10px' }}
                                    onClick={this.exportToSet}
                                >
                                    导出
                                </a>
                            </div> */}
                            <p>
                                <span style={{ marginRight: '8px' }}>①</span>
                                {trans('global.ExportTemplate', '导出需要修改的信息，批量修改')}
                                <a
                                    style={{ color: 'blue', marginLeft: '10px' }}
                                    onClick={this.exportToSet}
                                >
                                    {/* 下载导入模板 */}
                                    {trans('global.Export', '导出')}
                                </a>
                            </p>
                            <p>
                                <span style={{ marginRight: '8px' }}>②</span>
                                {trans('global.uploadEditForm', '上传修改好的信息表')}
                            </p>
                            <div
                                className={styles.upLoad}
                                // style={{ width: '60%', margin: 'auto' }}
                            >
                                {/* <span>②</span>&nbsp;
                                <span>上传修改好的信息表</span> */}
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
                                                <Button type="primary" disabled={!importConfirmBtn}>
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
                        <span className={styles.failureNumber}>{failureNumber} </span>&nbsp;
                        {trans('global.pleaseUploadAgain', '条错误，请调整后重新上传')}
                    </p>
                    <Table
                        dataSource={checkErrorMessageList}
                        columns={columns}
                        rowKey="lineNumber"
                        pagination={false}
                    />
                </Modal>
                <Modal
                    className={styles.errorStyle}
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
                    title="导入课程失败信息"
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
            </div>
        );
    }
}

export default CourseSetUp;
