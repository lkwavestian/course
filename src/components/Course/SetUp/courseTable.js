import React, { Fragment } from 'react';
import { Table, Icon, Pagination, Divider, Button, Popover, Modal, Upload, message } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { trans, locale } from '../../../utils/i18n';

const confirm = Modal.confirm;

@connect((state) => ({
    listCourse: state.course.listCourse,
    currentUser: state.global.currentUser,
}))
class CourseTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            host:
                location.origin.indexOf('daily') !== -1 ||
                location.origin.indexOf('localhost') !== -1
                    ? 'https://smart-scheduling.daily.yungu-inc.org'
                    : 'https://smart-scheduling.yungu-inc.org',
            loading: false, // 页面数据正在加载中
            currentPage: 1,
            pageSize: 50,
            orgCourseList: [],
            total: 0,
            data: {},
            visible: false,
            courseIntroduction: '', // 课程简介
            imageUrl: '', // 封面地址
            fileLoading: false,
            coursesId: '', // 课程ID
            coverId: '', // 封面ID
            index: 0, // 默认是点击第一个
            isCourseEdit: true, //默认是新建的
            coursesIdList: [], //课程id集合
        };
    }

    componentDidMount() {
        this.props.onRef(this);
        this.props.dispatch({
            type: 'global/getCurrentUser',
        })
        this.initList();
    }

    clearCourseId = () => {
        this.setState({
            coursesIdList: [],
        });
    };

    initList = (data = {}) => {
        const { dispatch, currentUser } = this.props;
        const { currentPage, pageSize } = this.state;
        this.setState({
            loading: true,
        });
        let parmas = {
            pageNum: currentPage,
            pageSize,
        };
        if (data.keywords) {
            parmas.keywords = data.keywords;
        }
        if (data.subjectId) {
            parmas.subjectId = data.subjectId;
        }
        if (typeof data.courseType == 'number') {
            parmas.courseType = data.courseType;
        }
        if (data.gradeId) {
            parmas.gradeId = [data.gradeId];
        }
        if (data.semesterId) {
            parmas.passage = data.semesterId;
        }
        if (data.schoolId || currentUser.schoolId) {
            parmas.schoolId = data.schoolId || currentUser.schoolId;
        }
        if (data.disableStatus !== undefined) {
            parmas.disableStatus = data.disableStatus;
        }
        dispatch({
            type: 'course/listCourse',
            payload: parmas,
            onSuccess: (data) => {
                if (data) {
                    let { orgCourseList, total } = data;
                    this.setState({
                        orgCourseList,
                        loading: false,
                        total,
                    });
                }
            },
            onError: () => {
                this.setState({
                    loading: false,
                });
            },
        });
    };

    resetSearch = (data = {}) => {
        this.setState(
            {
                orgCourseList: [],
                currentPage: 1,
                // pageSize: 50,
                total: 0,
                data,
            },
            () => {
                this.initList(data);
            }
        );
    };

    getColumns() {
        return [
            {
                title: trans('course.setup.course.name', '课程名称'),
                dataIndex: 'name',
                key: 'name',
                align: 'center',
                width: 150,
            },
            {
                title: trans('course.setup.course.ename', '课程英文名'),
                dataIndex: 'ename',
                key: 'ename',
                align: 'center',
                width: 150,
            },
            {
                title: trans('course.setup.course.status', '状态'),
                dataIndex: 'disableStatus',
                key: 'disableStatus',
                align: 'center',
                width: 50,
                render: (tag) => (
                    <span style={{ color: tag == 0 ? '#1890ff' : '#969fa9' }}>
                        {tag == 0
                            ? trans('global.enable', '启用')
                            : trans('global.disable', '禁用')}
                    </span>
                ),
            },
            {
                title: '课程简称',
                dataIndex: 'courseShortName',
                key: 'courseShortName',
                align: 'center',
                width: 50,
            },
            {
                title: trans('course.step1.nick.name', '课程别名'),
                dataIndex: 'alias',
                key: 'alias',
                align: 'center',
                width: 50,
            },
            {
                title: trans('course.setup.aliasNameEn', '课程英文别名'),
                dataIndex: 'courseShortEnName',
                key: 'courseShortEnName',
                align: 'center',
                width: 80,
            },
            {
                title: trans('course.setup.subject.score', '学科'),
                dataIndex: 'creditSubjectList',
                key: 'creditSubjectList',
                align: 'center',
                width: 140,
                render: (tag) => (
                    <span>
                        {tag &&
                            tag.map((el, i) =>
                                locale() === 'en'
                                    ? el.subjectEname
                                    : el.subjectName + (i == tag.length - 1 ? '' : ',')
                            )}
                    </span>
                ),
            },
            {
                title: trans('courseSet.courseType', '课程类别'),
                dataIndex: 'courseType',
                key: 'courseType',
                align: 'center',
                width: 80,
                render: (text, record, index) => {
                    return text == 0
                        ? trans('course.setup.compulsory', '必修')
                        : text == 1
                        ? locale() == 'en'
                            ? 'Extracurricular Electives'
                            : '课外选修'
                        : text == 2
                        ? locale() == 'en'
                            ? 'course.Electives'
                            : '课内选修'
                        : text == 3
                        ? locale() == 'en'
                            ? 'Vrtual Course'
                            : '虚拟课程'
                        : '';
                },
            },
            {
                title: trans('course.step2.applicable.grade', '适用年级'),
                dataIndex: 'gradeList',
                key: 'gradeList',
                align: 'center',
                width: 120,
                render: (tag) => (
                    <span>
                        {tag &&
                            tag.map(
                                (el, i) =>
                                    `${locale() === 'en' ? el.gradeEnName : el.gradeName}${
                                        i == tag.length - 1 ? '' : ','
                                    }`
                            )}
                    </span>
                ),
            },
            {
                title: trans('course.setup.dificulty', '难度'),
                dataIndex: 'difficulty',
                key: 'difficulty',
                align: 'center',
                width: 100,
            },
            {
                title: trans('course.setup.credit', '学分'),
                dataIndex: 'credit',
                key: 'credit',
                align: 'center',
                width: 40,
            },
            {
                title: trans('course.setup.course.code', '课程编码'),
                dataIndex: 'courseCode',
                key: 'courseCode',
                align: 'center',
                width: 95,
            },
            {
                title: trans('course.setup.newcourse.course.level', '课程级别'),
                dataIndex: 'levelList',
                key: 'levelList',
                align: 'center',
                width: 105,
                render: (tag) => {
                    return (
                        <span>
                            {tag && tag.map((el, i) => `${el}${i == tag.length - 1 ? '' : ','}`)}
                        </span>
                    );
                },
            },
            {
                title: trans('courseSet.prevCourse', '前序课程'),
                dataIndex: 'prefaceCourses',
                key: 'prefaceCourses',
                align: 'center',
                width: 180,
                render: (tag) => {
                    return (
                        <span>
                            {tag &&
                                tag.map((el, i) => `${el.name}${i == tag.length - 1 ? '' : ','}`)}
                        </span>
                    );
                },
            },

            {
                title: '章节目录',
                dataIndex: 'chapterEnable',
                key: 'chapterEnable',
                align: 'center',
                width: 70,
                render: (text, record, index) => {
                    return text == true ? '启用' : text == false ? '不启用' : null;
                },
            },
            {
                title: '章节目录教材版本',
                dataIndex: 'teachingMaterial',
                key: 'teachingMaterial',
                align: 'center',
                width: 150,
                render: (text, record, index) => {
                    return text == 'ZHE_JIAO'
                        ? '浙教版'
                        : text == 'REN_JIAO'
                        ? '人教版'
                        : text == 'WAI_YAN'
                        ? '外研版(一年级起点)'
                        : text == 'QING_DAO'
                        ? '青岛版(六三职)'
                        : text == 'XIANG_MEI'
                        ? '湘美版'
                        : text == 'ZI_YAN'
                        ? '自研版'
                        : text == 'BU_BIAN'
                        ? '部编版'
                        : text == 'REN_JIAO_XIN_KE_BIAO_B'
                        ? '人教新课标B版'
                        : text == 'XIANG_WEN_YI_BAN'
                        ? '湘文艺版'
                        : text == 'REN_MEI'
                        ? '人美版'
                        : text == 'HUA_DONG_SHI_DA'
                        ? '华东师大版'
                        : text == 'YUE_JIAO'
                        ? '粤教版'
                        : text == 'YUE_KE'
                        ? '粤科版'
                        : text == "WAI_YAN_CHU_ZHONG" 
                        ? '外研（初中）'
                        : text == "JI_NAN" 
                        ? '济南'
                        : text == "XIANG_JIAO" 
                        ? '湘教版'
                        : text == "ZHEJIANG_SHENDING" 
                        ? '浙江省审定版'
                        : text == "ZHE_JIAO_YUNGU" 
                        ? '浙教版(云谷)'
                        : text == "REN_JIAO_YUNGU" 
                        ? '人教版(云谷)'
                        : text == "HU_JIAO" 
                        ? '沪教版'
                        :  text == "BU_BIAN_FIVE_FOUR" 
                        ? '部编版(五四制)'
                        :  text == "ZHONG_TU" 
                        ? '中图版'
                        :  text == "NIU_JIN_SHANG_HAI" 
                        ? '牛津上海版'
                        :  text == "SHANG_HAI_WAI_JIAO" 
                        ? '上海外教班'
                        :  null;
                },
            },
            {
                title: '知识点',
                dataIndex: 'knowledgeEnable',
                key: 'knowledgeEnable',
                align: 'center',
                width: 60,
                render: (text, record, index) => {
                    return text == true ? '启用' : text == false ? '不启用' : null;
                },
            },
            {
                title: '知识点教材版本',
                dataIndex: 'knowledgeTeachingMaterial',
                key: 'knowledgeTeachingMaterial',
                align: 'center',
                width: 150,
                render: (text, record, index) => {
                    return text == 'ZHE_JIAO'
                        ? '浙教版'
                        : text == 'REN_JIAO'
                        ? '人教版'
                        : text == 'WAI_YAN'
                        ? '外研版(一年级起点)'
                        : text == 'QING_DAO'
                        ? '青岛版(六三职)'
                        : text == 'XIANG_MEI'
                        ? '湘美版'
                        : text == 'ZI_YAN'
                        ? '自研版'
                        : text == 'BU_BIAN'
                        ? '部编版'
                        : text == 'REN_JIAO_XIN_KE_BIAO_B'
                        ? '人教新课标B版'
                        : text == 'XIANG_WEN_YI_BAN'
                        ? '湘文艺版'
                        : text == 'REN_MEI'
                        ? '人美版'
                        : text == 'HUA_DONG_SHI_DA'
                        ? '华东师大版'
                        : text == 'YUE_JIAO'
                        ? '粤教版'
                        : text == 'YUE_KE'
                        ? '粤科版'
                        : text == "WAI_YAN_CHU_ZHONG" 
                        ? '外研（初中）'
                        : text == "JI_NAN" 
                        ? '济南'
                        : text == "XIANG_JIAO" 
                        ? '湘教版'
                        : text == "ZHEJIANG_SHENDING" 
                        ? '浙江省审定版'
                        : text == "ZHE_JIAO_YUNGU" 
                        ? '浙教版(云谷)'
                        : text == "REN_JIAO_YUNGU" 
                        ? '人教版(云谷)'
                        : text == "HU_JIAO" 
                        ? '沪教版'
                        :  text == "BU_BIAN_FIVE_FOUR" 
                        ? '部编版(五四制)'
                        :  text == "ZHONG_TU" 
                        ? '中图版'
                        :  text == "NIU_JIN_SHANG_HAI" 
                        ? '牛津上海版'
                        :  text == "SHANG_HAI_WAI_JIAO" 
                        ? '上海外教班'
                        : null;
                },
            },

            {
                title: trans('student.opeation', '操作'),
                dataIndex: 'operation',
                key: 'operation',
                align: 'center',
                fixed: 'right',
                width: 110,
                render: (tag, item) => (
                    <>
                        <a size="small" onClick={this.showNewCourse.bind(this, item)}>
                            {trans('global.edit', '编辑')}
                        </a>
                        <Divider type="vertical" />
                        <a size="small" onClick={this.del.bind(this, item)}>
                            {item.disableStatus == 0
                                ? trans('global.disable', '禁用')
                                : trans('global.enable', '启用')}
                        </a>
                    </>
                ),
            },
        ];
    }

    del = (item) => {
        let self = this;
        let { orgCourseList, data } = this.state;
        let { initIsDisableNum, parentThis } = self.props;
        confirm({
            title:
                item.disableStatus == 0
                    ? trans('course.setup.disable.this.course', '是否禁用该课程')
                    : trans('', '是否启用该课程'),
            content: null,
            onOk() {
                const { dispatch } = self.props;
                dispatch({
                    type: 'course/courseEnableAndDisable',
                    payload: {
                        coursesIds: [item.coursesId],
                        disableFlag: !(item.disableStatus == 0),
                    },
                    onSuccess: () => {
                        self.initList(data);
                        // if (item.disableStatus == 0) {
                        //     orgCourseList[item.index].disableStatus = 1;
                        // } else {
                        //     orgCourseList[item.index].disableStatus = 0
                        // }
                        // self.setState({
                        //     orgCourseList
                        // })

                        initIsDisableNum &&
                            typeof initIsDisableNum === 'function' &&
                            initIsDisableNum.call(parentThis);
                    },
                });
            },
            onCancel() {},
        });
    };

    showNewCourse = (item) => {
        const { showNewCourse } = this.props;
        typeof showNewCourse == 'function' && showNewCourse.call(this, item, false);
        this.setState({
            coursesId: item.coursesId,
            index: item.index,
        });
    };

    // 展示简介
    showJianjie = (bol = true) => {
        this.setState({
            visible: true,
            isCourseEdit: bol,
            courseIntroduction: '',
            coverId: '',
        });
        if (!bol) {
            let { index, orgCourseList } = this.state;
            let data = orgCourseList[index];
            this.setState({
                coursesId: data.coursesId,
                courseIntroduction: data.courseIntroduction,
                coverId: data.coverId,
            });
        }
    };

    //切换分页
    switchPage = (page, size) => {
        this.setState(
            {
                currentPage: page,
                pageSize: size,
            },
            () => {
                this.initList(this.state.data);
            }
        );
    };

    //切换每页条数
    switchPageSize = (page, size) => {
        this.setState(
            {
                currentPage: page,
                pageSize: size,
            },
            () => {
                this.initList(this.state.data);
            }
        );
    };

    handleCancel = () => {
        this.setState({
            visible: false,
            coursesId: '',
            imageUrl: '',
        });
    };

    handleOk = () => {
        const { dispatch } = this.props;
        const { coursesId, coverId, courseIntroduction, index, orgCourseList } = this.state;
        let data = orgCourseList[index];
        let schoolIds = [];
        if (data.schoolList) {
            for (let i = 0; i < data.schoolList.length; i++) {
                schoolIds.push(data.schoolList[i].id);
            }
        }
        let gradeIds = [];
        if (data.gradeList) {
            for (let i = 0; i < data.gradeList.length; i++) {
                gradeIds.push(data.gradeList[i].gradeId);
            }
        }
        dispatch({
            type: 'course/updateCourse',
            payload: {
                id: coursesId || data.coursesId,
                coverId,
                courseIntroduction,
                editFlag: 1,
                name: data.name, // 必传
                ename: data.ename, // 必传
                courseCode: data.courseCode, // 必传
                schoolId: schoolIds,
                gradeIdList: gradeIds,
            },
            onSuccess: () => {
                orgCourseList[index].courseIntroduction = courseIntroduction;
                orgCourseList[index].coverId = coverId;
                this.setState({
                    visible: false,
                    orgCourseList,
                });
            },
        });
    };

    titleHTML() {
        return (
            <div className={styles.courseNav}>
                <span onClick={this.handleCancel} className={styles.icon}>
                    <Icon type="close" />
                </span>
                <span>{trans('course.setup.edit.course', '编辑课程')}</span>
                <Button type="primary" onClick={this.handleOk} className={styles.btn}>
                    {trans('global.save', '保存')}
                </Button>
            </div>
        );
    }

    editJianJieHTML() {
        const { visible, courseIntroduction, imageUrl } = this.state;
        const modules = {
            toolbar: [
                [{ font: [] }],
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                [{ align: [] }, 'direction'],
                ['bold', 'italic', 'underline', 'strike'],
                [{ color: [] }, { background: [] }],
                [{ script: 'super' }, { script: 'sub' }],
                ['blockquote', 'code-block'],
                [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                ['link', 'clean'],
            ],
        };
        const uploadButton = (
            <div>
                <Icon type={this.state.fileLoading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <Modal
                title={this.titleHTML()}
                width="60vw"
                footer={null}
                maskClosable={false}
                closable={false}
                visible={visible}
            >
                <div className={styles.editorContainer}>
                    <ReactQuill
                        className={styles.editor}
                        theme={'snow'}
                        value={courseIntroduction || ''}
                        modules={modules}
                        onChange={(value) => {
                            this.setState({
                                courseIntroduction: value,
                            });
                        }}
                    />
                </div>
                <div>
                    <div
                        style={{
                            margin: '16px 0 12px 0',
                            color: '#464c56',
                            fontSize: '14px',
                        }}
                    >
                        {trans('course.setup.custom.cover', '自定义封面')}
                        <Icon
                            className={styles.removeImg}
                            type="close-circle"
                            onClick={this.onRemove}
                        />
                    </div>
                    <Upload
                        action="/api/teaching/excel/uploadFile"
                        accept="image/*, video/webp"
                        beforeUpload={this.beforeUpload}
                        onChange={this.handleChange}
                        multiple={true}
                        name="avatar"
                        listType="picture-card"
                        onPreview={() => {}}
                        className="avatar-uploader"
                        showUploadList={false}
                    >
                        {imageUrl ? (
                            <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                        ) : (
                            uploadButton
                        )}
                    </Upload>
                </div>
            </Modal>
        );
    }

    beforeUpload = (file) => {
        if (file.size / 1024 / 1024 <= 10) {
            return true;
        } else {
            message.info(
                trans(
                    'student.transferSchool.uploadMessge',
                    trans('course.setup.file.too.lare.compress', '上传文件过大, 请压缩后上传！')
                )
            );
            return false;
        }
    };

    onRemove = () => {
        this.setState({
            imageUrl: '',
            coverId: '',
        });
    };

    handleChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({ imageUrl: '', fileLoading: true });
            return;
        }
        if (info.file.status === 'done') {
            let imageUrl = `${this.state.host}/api/teaching/excel/preview_file?id=${info.file.response.content[0].fileId}`;
            this.setState({
                coverId: info.file.response.content[0].fileId,
                imageUrl,
                fileLoading: false,
            });
        }
    };

    render() {
        let { loading, currentPage, pageSize, orgCourseList, total } = this.state;
        const rowSelection = {
            columnWidth: 40,
            onChange: (selectedRowKeys, selectedRows) => {
                let coursesIdList = [];
                selectedRows &&
                    selectedRows.map((item, index) => {
                        coursesIdList.push(item.coursesId);
                    });
                this.setState({
                    coursesIdList,
                });
                // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: (record) => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name,
            }),
        };
        return (
            <div className={styles.CourseTable}>
                <Table
                    loading={{
                        indicator: <Icon type="loading" />,
                        spinning: loading,
                        tip: 'Try to loading...',
                    }}
                    rowSelection={rowSelection}
                    bordered={true}
                    dataSource={orgCourseList}
                    columns={this.getColumns()}
                    scroll={{ x: 1800, y: 600 }}
                    pagination={false}
                />
                <div className={styles.pagination}>
                    <Pagination
                        showSizeChanger
                        showQuickJumper
                        current={currentPage}
                        total={total || 0}
                        locale="zh-CN"
                        defaultPageSize={pageSize}
                        pageSizeOptions={['3', '20', '50', '100', '500', '1000']}
                        onChange={this.switchPage}
                        onShowSizeChange={this.switchPageSize}
                    />
                </div>
                {this.editJianJieHTML()}
            </div>
        );
    }
}

export default CourseTable;
