//club列表
import React, { PureComponent } from 'react';
import {
    Select,
    TreeSelect,
    Popover,
    Icon,
    Pagination,
    DatePicker,
    Input,
    Modal,
    Dropdown,
    Menu,
    InputNumber,
    message,
    Button,
    Form,
} from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import ClubTable from './table.js';
import FreedomCourse from '../Time/TimeTable/FreedomCourse/index';
import moment from 'moment';
import { formatTime, formatTimeSafari, mockForm } from '../../utils/utils';
import { trans } from '../../utils/i18n';
import lodash from 'lodash';
import ImportActivity from '../Time/TimeTable/ImportActivity';
import icon from '../../icon.less';
import styles from './index.less';

const dateFormat = 'YYYY/MM/DD';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Search } = Input;

@connect((state) => ({
    semesterList: state.time.semesterList,
    gradeList: state.time.gradeList,
    courseList: state.course.courseList,
    teacherList: state.course.teacherList,
    studentList: state.timeTable.studentList,
    clubDataSource: state.club.clubDataSource,
    courseBySubject: state.timeTable.courseBySubject,
    areaList: state.timeTable.areaList,
    fetchTeacherAndOrg: state.global.fetchTeacherAndOrg, //组织和人员列表，栾碧霞测试专用接口
    allStageGrade: state.time.allStageGrade,
    importFeeMessage: state.club.importFeeMessage,
    checkResult: state.club.checkResult,
}))
@Form.create()
export default class ClubManagement extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            semesterValue: '',
            gradeValue: [],
            courseValue: [],
            current: 1,
            pageSize: 20,

            showBatchOper: false, //批量操作按钮
            startTime: 0, //开始日期
            endTime: 0, //结束日期

            showFreedomCourse: false, //显示创建club
            clubKey: '3',

            filterOption: 'teacher', //搜索条件筛选
            showMoreCondition: false, //展示更多的筛选条件

            selectTeacher: [], //按照教师进行筛选
            selectStudent: [], //按照学生进行筛选
            activityName: '', //按照活动名称进行筛选
            selectAddress: [], //按照场地进行筛选
            currentTime: undefined, //开始时间戳

            generateVisible: false, //生成座位号弹窗
            downloadVisible: false, //下载座位号弹窗
            initialNumber: 1, //初始编号
            colNumber: 8, //初始列
            rowNumber: 6, //初始行
            batchDelVisible: false,
            batchPubVisible: false,

            errorDownVisible: false, //下载座位号前置校验
            isPublished: 0,
            importActivityVisible: false,
        };
        this.ref = undefined;
    }

    componentDidMount() {
        this.getSemester();
        this.getGradeList();
        this.getCourse();
        this.getCourseBySubject();
        this.getTeacherList();
        this.getStudentList();
        this.getAddressList();
        this.getAllStage();
    }

    getAllStage = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'time/getAllStageGrade',
            payload: {},
        });
    };

    getGroupByTree = (time) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'timeTable/getGradeByType',
            payload: {
                time: this.getLocalTime(time),
            },
        });
    };

    getLocalTime = (time) => {
        if (!time) return false;
        var time = new Date(formatTimeSafari(time)),
            y = time.getFullYear(),
            m = time.getMonth() + 1,
            day = time.getDate();
        var MM = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1;
        var DD = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();

        return y + '-' + MM + '-' + DD;
    };

    //获取所选学期的开始时间和结束时间
    getSemesterStartEndTime(id, type) {
        const { semesterList } = this.props;
        let semesterTime;
        let currentTimeStamp = moment(moment().startOf('day')).valueOf(); // 当天时间戳
        let afterOneMonthStamp = currentTimeStamp + 2592000000; //一个月后时间戳
        semesterList &&
            semesterList.map((item, index) => {
                if (
                    item.id == id &&
                    item.startTime <= currentTimeStamp &&
                    item.endTime >= currentTimeStamp
                ) {
                    if (afterOneMonthStamp < item.endTime) {
                        if (type == 'start') {
                            semesterTime = formatTime(currentTimeStamp);
                            this.setState({
                                currentTime: currentTimeStamp,
                            });
                            this.getGroupByTree(currentTimeStamp);
                        } else if (type == 'end') {
                            semesterTime = formatTime(afterOneMonthStamp);
                        }
                    } else if (afterOneMonthStamp >= item.endTime) {
                        if (type == 'start') {
                            semesterTime = formatTime(currentTimeStamp);
                            this.setState({
                                currentTime: currentTimeStamp,
                            });
                            this.getGroupByTree(currentTimeStamp);
                        } else if (type == 'end') {
                            semesterTime = formatTime(item.endTime);
                        }
                    }
                } else if (
                    (item.id == id && item.startTime >= currentTimeStamp) ||
                    (item.id == id && item.endTime <= currentTimeStamp)
                ) {
                    if (type == 'start') {
                        semesterTime = formatTime(item.startTime);
                        this.getGroupByTree(item.startTime);
                        this.setState({
                            currentTime: item.startTime,
                        });
                    } else if (type == 'end') {
                        semesterTime = formatTime(item.endTime);
                    }
                }
            });
        return semesterTime;
    }

    //获取学期
    getSemester() {
        const { dispatch } = this.props;
        dispatch({
            type: 'time/getSemesterList',
            payload: {},
        }).then(() => {
            const { semesterList } = this.props;
            this.setState(
                {
                    semesterValue: semesterList && semesterList.find((item) => item.current).id,
                },
                () => {
                    this.setState(
                        {
                            startTime: this.getSemesterStartEndTime(
                                this.state.semesterValue,
                                'start'
                            ),
                            endTime: this.getSemesterStartEndTime(this.state.semesterValue, 'end'),
                        },
                        () => {
                            //获取课程
                            this.getClubDataSource();
                        }
                    );
                }
            );
        });
    }

    //获取年级
    getGradeList() {
        const { dispatch } = this.props;
        dispatch({
            type: 'time/getGradeList',
            payload: {},
        });
    }

    //获取课程
    getCourse() {
        const { dispatch } = this.props;
        dispatch({
            type: 'course/getCourseList',
            payload: {},
        });
    }

    //科目--课程级联
    getCourseBySubject() {
        const { dispatch } = this.props;
        dispatch({
            type: 'timeTable/fetchCourseBySubject',
            payload: {},
        });
    }

    //获取教师
    getTeacherList() {
        const { dispatch } = this.props;
        dispatch({
            type: 'course/getTeacherList',
            payload: {},
        });
    }

    //获取学生列表
    getStudentList() {
        const { dispatch } = this.props;
        dispatch({
            type: 'timeTable/getStudentList',
            payload: {},
        });
    }

    //获取场地列表
    getAddressList() {
        const { dispatch } = this.props;
        dispatch({
            type: 'timeTable/getAreaList',
            payload: {},
        });
    }

    //选择学期
    changeSemester = (value) => {
        this.setState(
            {
                semesterValue: value,
                current: 1,
            },
            () => {
                this.setState(
                    {
                        startTime: this.getSemesterStartEndTime(this.state.semesterValue, 'start'),
                        endTime: this.getSemesterStartEndTime(this.state.semesterValue, 'end'),
                    },
                    () => {
                        //获取课程
                        this.getClubDataSource();
                    }
                );
            }
        );
    };

    changePub = (value) => {
        console.log('value', value);
        this.setState(
            {
                isPublished: value,
            },
            () => {
                this.getClubDataSource();
            }
        );
    };

    //选择校区
    changeArea = (value) => {
        console.log(value);
    };

    //选择年级
    changeGrade = (value) => {
        this.setState(
            {
                gradeValue: value,
                current: 1,
            },
            () => {
                this.getClubDataSource();
            }
        );
    };

    //选择课程
    changeCourse = (value) => {
        this.setState(
            {
                courseValue: value,
                current: 1,
            },
            () => {
                this.getClubDataSource();
            }
        );
    };

    //处理课程子节点
    formatCourseChildren = (arr) => {
        if (!arr || arr.length < 0) return [];
        let resultArr = [];
        arr.map((item) => {
            let obj = {
                title: item.name,
                value: item.id,
                key: item.id,
            };
            resultArr.push(obj);
        });
        return resultArr;
    };

    //处理年级数据
    formatGrade = (gradeList) => {
        if (!gradeList || gradeList.length < 0) return;
        let gradeData = [];
        gradeList.map((item, index) => {
            let obj = {
                title: item.stageName || item.gradeName,
                value: item.id,
                key: item.id,
                children: this.formatGrade(item.grades),
            };
            gradeData.push(obj);
        });
        return gradeData;
    };

    //格式化课程数据
    formatCourseData = (courseList) => {
        if (!courseList || courseList.length < 0) return;
        let courseData = [];
        courseList.map((item, index) => {
            let obj = {};
            obj.title = item.name;
            obj.key = 'subject-' + item.id;
            obj.value = 'subject-' + item.id;
            obj.children = this.formatCourseChildren(item.courseList);
            courseData.push(obj);
        });
        return courseData;
    };

    //切换视图
    switchClubTable = () => {
        const { dispatch } = this.props;
        // dispatch(
        //     routerRedux.push({
        //         pathname: '/courseIndex#/course/index/1',
        //     })
        // );
        window.open('/courseIndex#/course/index/1', '_self');
    };

    //批量操作按钮
    handleBatchVisible = (visible) => {
        this.setState({
            showBatchOper: visible,
        });
    };

    //获取club列表数据
    getClubDataSource = () => {
        const { dispatch } = this.props;
        const {
            current,
            pageSize,
            semesterValue,
            startTime,
            endTime,
            gradeValue,
            courseValue,
            selectStudent,
            selectTeacher,
            activityName,
            selectAddress,
            isPublished,
        } = this.state;
        let start = startTime ? new Date(formatTimeSafari(startTime) + ' 00:00:00').getTime() : 0,
            end = endTime ? new Date(formatTimeSafari(endTime) + ' 23:59:59').getTime() : 0;
        dispatch({
            type: 'club/getClubDataSource',
            payload: {
                pageNum: current,
                pageSize: pageSize,
                semesterId: semesterValue,
                startTime: start,
                endTime: end,
                gradeIds: gradeValue,
                courseIds: courseValue,
                studentIds: selectStudent, //按照学生进行搜索
                teacherIds: selectTeacher, //按照教师进行搜索
                freeName: activityName, //按活动主题进行搜索
                playgroundIds: selectAddress, //按照场地进行搜索
                activePublishShowType: isPublished,
            },
        });
    };

    //切换分页
    switchPage = (page, size) => {
        this.setState(
            {
                current: page,
                pageSize: size,
            },
            () => {
                this.getClubDataSource();
                this.resetSelected();
            }
        );
    };

    //切换每页条数
    switchPageSize = (page, size) => {
        this.setState(
            {
                current: page,
                pageSize: size,
            },
            () => {
                this.getClubDataSource();
                this.resetSelected();
            }
        );
    };

    //选择日期
    changeRangePicker = (date, dateStrings) => {
        this.setState(
            {
                startTime: dateStrings[0],
                endTime: dateStrings[1],
                current: 1,
            },
            () => {
                this.getClubDataSource();
            }
        );
    };

    //添加club
    addClub = () => {
        const { currentTime } = this.state;
        this.setState({
            showFreedomCourse: true,
        });
        this.props.dispatch({
            type: 'global/fetchTeacherAndOrg',
            payload: {},
        });
    };

    //删除活动
    batchDel = () => {
        if (this.ref.state.selectedRowKeys.length == 0) {
            message.warn('请至少选择一个活动以删除！');
            return;
        }

        this.setState({
            batchDelVisible: true,
        });
    };

    //批量删除活动
    batchDelActive = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'club/batchDeleteFreeScheduleResult',
            payload: {
                waitDeleteActiveIdList: this.ref.state.selectedRowKeys,
            },
        }).then(() => {
            this.resetSelected();
            this.getClubDataSource();
            this.setState({
                batchDelVisible: false,
            });
        });
    };

    //公布活动
    batchPuB = () => {
        if (this.ref.state.selectedRowKeys.length == 0) {
            message.warn('请至少选择一个活动以公布！');
            return;
        }
        this.setState({
            batchPubVisible: true,
        });
    };

    //批量公布活动
    batchPubActive = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'club/batchPublishActive',
            payload: {
                waitPublishActiveIdList: this.ref.state.selectedRowKeys,
            },
        }).then(() => {
            this.resetSelected();
            this.getClubDataSource();
            this.setState({
                batchPubVisible: false,
            });
        });
    };

    //隐藏club
    hideModal = (type) => {
        switch (type) {
            case 'freedomCourse':
                this.setState({
                    showFreedomCourse: false,
                });
                break;
        }
    };

    //选择搜索条件
    changeCondition = (value) => {
        this.setState({
            filterOption: value,
            selectStudent: [],
            selectTeacher: [],
            // activityName: '',
        });
    };

    //展示更多搜索条件
    showMore = () => {
        this.setState(
            {
                showMoreCondition: !this.state.showMoreCondition,
            },
            () => {
                if (!this.state.showMoreCondition) {
                    this.setState(
                        {
                            filterOption: 'teacher',
                            selectStudent: [],
                            selectTeacher: [],
                            // activityName: '',
                            selectAddress: [],
                        },
                        () => {
                            //查询club
                            this.getClubDataSource();
                        }
                    );
                }
            }
        );
    };

    //按照教师搜索club
    changeTeacher = (value) => {
        this.setState(
            {
                selectTeacher: value,
                selectStudent: [],
                // activityName: '',
                selectAddress: [],
                current: 1,
            },
            () => {
                this.getClubDataSource();
            }
        );
    };

    //按照学生进行筛选
    changeStudent = (value) => {
        this.setState(
            {
                selectStudent: value,
                selectTeacher: [],
                // activityName: '',
                selectAddress: [],
                current: 1,
            },
            () => {
                this.getClubDataSource();
            }
        );
    };

    //按照活动名称进行筛选
    searchActivity = (value) => {
        this.setState(
            {
                activityName: value,
                current: 1,
            },
            () => {
                this.getClubDataSource();
            }
        );
    };

    //按照场地进行筛选
    changeAddress = (value) => {
        this.setState(
            {
                selectAddress: value,
                // activityName: '',
                selectStudent: [],
                selectTeacher: [],
                current: 1,
            },
            () => {
                //查询club
                this.getClubDataSource();
            }
        );
    };

    // 年级、课程筛选清空按钮
    clearStageAndGrade = (type) => {
        this.setState(
            {
                [type]: [],
            },
            () => {
                this.getClubDataSource();
            }
        );
    };

    generateModal = () => {
        if (this.ref.state.selectedRowKeys.length == 0) {
            message.warn('请至少选择一个活动以生成！');
            return;
        }
        this.setState({
            generateVisible: true,
        });
    };

    downloadModal = () => {
        if (this.ref.state.selectedRowKeys.length == 0) {
            message.warn('请至少选择一个活动以下载！');
            return;
        }
        this.setState({
            downloadVisible: true,
        });
    };

    changeNumber = (value) => {
        this.setState({
            initialNumber: value,
        });
    };

    cancelGenerate = () => {
        this.setState({
            generateVisible: false,
            initialNumber: 1,
        });
    };

    generateSeat = () => {
        const { dispatch } = this.props;
        const { initialNumber } = this.state;

        dispatch({
            type: 'club/generateSeat',
            payload: {
                initialValue: initialNumber,
                activeIdList: this.ref.state.selectedRowKeys,
            },
            onSuccess: () => {
                this.getClubDataSource();
                this.resetSelected();
                this.setState({
                    generateVisible: false,
                    initialNumber: 1,
                });
            },
        });
    };

    setSeat = () => {
        const { dispatch } = this.props;
        const { colNumber, rowNumber } = this.state;
        let obj = {
            activeIdList: this.ref.state.selectedRowKeys,
            column: colNumber,
            line: rowNumber,
        };
        let json = JSON.stringify(obj);
        let lastJson = encodeURI(json);
        dispatch({
            type: 'club/activeStudentSeatNumberDownloadCheck',
            payload: {
                stringData: lastJson,
            },
        }).then(() => {
            const { checkResult } = this.props;
            if (
                checkResult.dissatisfiedSeatNumberActiveList.length ||
                checkResult.noSeatNumberActiveList.length
            ) {
                this.setState({
                    errorDownVisible: true,
                });
            } else {
                mockForm('/api/activeStudentSeatNumberDownload', { stringData: lastJson });
                this.getClubDataSource();
                this.resetSelected();
                this.setState({
                    colNumber: 8,
                    rowNumber: 6,
                    downloadVisible: false,
                });
            }
        });
    };

    cancelSet = () => {
        this.setState({
            downloadVisible: false,
            colNumber: 8,
            rowNumber: 6,
        });
    };

    changeCol = (value) => {
        this.setState({
            colNumber: value,
        });
    };

    changeRow = (value) => {
        this.setState({
            rowNumber: value,
        });
    };

    onRef = (ref) => {
        this.ref = ref;
    };

    resetSelected = () => {
        this.ref.reset();
    };

    toggleImportActivityVisible = () => {
        const { importActivityVisible } = this.state;
        this.setState({
            importActivityVisible: !importActivityVisible,
        });
    };

    render() {
        const {
            semesterList,
            gradeList,
            courseList,
            clubDataSource,
            teacherList,
            studentList,
            courseBySubject,
            areaList,
            allStageGrade,
            checkResult,
        } = this.props;
        const {
            semesterValue,
            gradeValue,
            courseValue,
            initialNumber,
            current,
            startTime,
            endTime,
            showMoreCondition,
            filterOption,
            selectTeacher,
            selectStudent,
            activityName,
            selectAddress,
            showFreedomCourse,
            currentTime,
            generateVisible,
            downloadVisible,
            rowNumber,
            colNumber,
            batchDelVisible,
            batchPubVisible,
            errorDownVisible,
            isPublished,
            importActivityVisible,
        } = this.state;
        const gradeProps = {
            treeData: this.formatGrade(allStageGrade),
            value: gradeValue,
            placeholder: '全部年级',
            onChange: this.changeGrade,
            treeCheckable: true,
            treeNodeFilterProp: 'title',
            style: {
                width: 120,
                marginRight: 8,
                verticalAlign: 'middle',
            },
            dropdownStyle: {
                maxHeight: 400,
                overflow: 'auto',
            },
            maxTagCount: 0,
        };
        const courseProps = {
            treeData: this.formatCourseData(courseBySubject),
            value: courseValue,
            placeholder: trans('course.plan.allcourse', '全部课程'),
            onChange: this.changeCourse,
            treeCheckable: true,
            treeNodeFilterProp: 'title',
            style: {
                width: 120,
                marginRight: 8,
                verticalAlign: 'middle',
            },
            dropdownStyle: {
                maxHeight: 400,
                overflow: 'auto',
            },
            maxTagCount: 0,
        };

        const menu = (
            <Menu>
                <Menu.Item onClick={this.generateModal}>生成座位号</Menu.Item>
                <Menu.Item onClick={this.downloadModal}>下载座位号</Menu.Item>
                <Menu.Item onClick={this.batchDel}>批量删除活动</Menu.Item>
                <Menu.Item onClick={this.batchPuB}>批量公布活动</Menu.Item>
            </Menu>
        );

        const createMenu = (
            <Menu>
                <Menu.Item onClick={this.addClub}>直接新建</Menu.Item>
                <Menu.Item onClick={this.toggleImportActivityVisible}>批量导入</Menu.Item>
            </Menu>
        );

        let tableSource = clubDataSource && clubDataSource.data;
        let totalPage = clubDataSource && clubDataSource.total;
        return (
            <div className={styles.clubTablePage}>
                <div className={styles.main}>
                    <div className={styles.searchHeader}>
                        <Select
                            value={semesterValue}
                            style={{ width: 200 }}
                            onChange={this.changeSemester}
                            className={styles.selectStyle}
                        >
                            {semesterList &&
                                semesterList.length > 0 &&
                                semesterList.map((item, index) => {
                                    return (
                                        <Option value={item.id} key={item.id}>
                                            {item.officialSemesterName}
                                        </Option>
                                    );
                                })}
                        </Select>

                        <div style={{ display: 'inline-block', position: 'relative' }}>
                            {gradeValue && gradeValue.length > 0 && (
                                <span className={styles.tagPlaceholder}>
                                    {gradeValue.length}个年级
                                    <span
                                        className={styles.close}
                                        onClick={this.clearStageAndGrade.bind(this, 'gradeValue')}
                                    >
                                        <Icon
                                            type="close-circle"
                                            theme="filled"
                                            style={{ color: '#bbb' }}
                                        />
                                    </span>
                                </span>
                            )}

                            <TreeSelect {...gradeProps} />
                        </div>

                        <div style={{ display: 'inline-block', position: 'relative' }}>
                            {courseValue && courseValue.length > 0 && (
                                <span className={styles.tagPlaceholder}>
                                    {courseValue.length}个课程
                                    <span
                                        className={styles.close}
                                        onClick={this.clearStageAndGrade.bind(this, 'courseValue')}
                                    >
                                        <Icon
                                            type="close-circle"
                                            theme="filled"
                                            style={{ color: '#bbb' }}
                                        />
                                    </span>
                                </span>
                            )}
                            <TreeSelect {...courseProps} />
                        </div>

                        <Select
                            value={isPublished}
                            style={{ width: 80 }}
                            onChange={this.changePub}
                            className={styles.selectStyle}
                        >
                            <Option key={0} value={0}>
                                全部
                            </Option>
                            <Option key={1} value={1}>
                                未公布
                            </Option>
                            <Option key={2} value={2}>
                                已公布
                            </Option>
                        </Select>

                        <span
                            className={
                                showMoreCondition
                                    ? styles.activeMoreCondition
                                    : styles.showMoreCondition
                            }
                            onClick={this.showMore}
                        >
                            更多 <i className={icon.iconfont}>&#xe613;</i>
                        </span>
                        <div className={styles.searchDate} style={{ verticalAlign: 'middle' }}>
                            <div className={styles.searchDateMain}>
                                <RangePicker
                                    onChange={this.changeRangePicker}
                                    format={dateFormat}
                                    style={{ width: 220 }}
                                    allowClear={false}
                                    value={[
                                        moment(startTime, dateFormat),
                                        moment(endTime, dateFormat),
                                    ]}
                                />
                            </div>
                        </div>
                        <Search
                            placeholder="输入活动名称试试看..."
                            onSearch={this.searchActivity}
                            style={{ width: 180, marginLeft: 10 }}
                            className={styles.searchInputStyle}
                        />
                    </div>
                    <div className={styles.operButton}>
                        <div className={styles.operBtnList}>
                            {/* <Popover
                                placement="bottom"
                                content={<span className={styles.tipsText}>管理视图</span>}
                                title={null}
                            >
                                <span className={styles.blueButton} onClick={this.switchClubTable}>
                                    <i className={icon.iconfont + ' ' + styles.iconStyle}>
                                        &#xe60b;
                                    </i>
                                </span>
                            </Popover> */}

                            <Dropdown overlay={menu}>
                                <Button
                                    /* className={styles.whiteButton} */ style={{
                                        marginRight: '10px',
                                        background: '#3b6ff5',
                                        color: '#fff',
                                        height: 36,
                                        lineHeight: '36px',
                                        borderRadius: '8px',
                                    }}
                                >
                                    批量操作
                                </Button>
                            </Dropdown>

                            <Dropdown overlay={createMenu}>
                                <Button
                                    type="primary"
                                    /* className={styles.blueButton} */ style={{
                                        background: '#3b6ff5',
                                        color: '#fff',
                                        height: 36,
                                        lineHeight: '36px',
                                        borderRadius: '8px',
                                    }}
                                >
                                    新建活动
                                </Button>
                            </Dropdown>
                            {/* <Popover
                                placement="bottom"
                                content={<span className={styles.tipsText}>新建活动</span>}
                                title={null}
                            >
                                <span className={styles.blueButton} onClick={this.addClub}>
                                    <i className={icon.iconfont + ' ' + styles.iconStyle}>
                                        &#xe75a;
                                    </i>
                                </span>
                            </Popover> */}
                        </div>
                    </div>
                    {showMoreCondition && (
                        <div className={styles.moreCondition}>
                            <div className={styles.searchConditionList}>
                                <Select
                                    defaultValue={'teacher'}
                                    style={{ width: 140 }}
                                    className={styles.conditionList}
                                    onChange={this.changeCondition}
                                >
                                    <Option value="teacher">按教师搜索</Option>
                                    <Option value="student">按学生搜索</Option>
                                    {/* <Option value="freeName">按活动主题搜索</Option> */}
                                    <Option value="address">按场地搜索</Option>
                                </Select>
                                {filterOption == 'teacher' && (
                                    <Select
                                        mode="multiple"
                                        value={selectTeacher}
                                        style={{ width: 180 }}
                                        placeholder="搜一个老师试试看..."
                                        className={styles.searchTeacher}
                                        onChange={this.changeTeacher}
                                        optionFilterProp="children"
                                    >
                                        {teacherList &&
                                            teacherList.length > 0 &&
                                            teacherList.map((item) => {
                                                return (
                                                    <Option
                                                        value={item.teacherId}
                                                        key={item.teacherId}
                                                    >
                                                        {item.name} {item.englishName}
                                                    </Option>
                                                );
                                            })}
                                    </Select>
                                )}
                                {filterOption == 'student' && (
                                    <Select
                                        mode="multiple"
                                        value={selectStudent}
                                        style={{ width: 180 }}
                                        placeholder="搜一个学生试试看..."
                                        className={styles.searchTeacher}
                                        onChange={this.changeStudent}
                                        optionFilterProp="children"
                                    >
                                        {studentList &&
                                            studentList.length > 0 &&
                                            studentList.map((item) => {
                                                return (
                                                    <Option key={item.id} value={item.id}>
                                                        {item.name} {item.englishName}
                                                    </Option>
                                                );
                                            })}
                                    </Select>
                                )}

                                {filterOption == 'address' && (
                                    <Select
                                        mode="multiple"
                                        value={selectAddress}
                                        style={{ width: 180 }}
                                        placeholder="搜一个场地试试看..."
                                        className={styles.searchTeacher}
                                        onChange={this.changeAddress}
                                        optionFilterProp="children"
                                    >
                                        {areaList &&
                                            areaList.length > 0 &&
                                            areaList.map((item) => {
                                                return (
                                                    <Option value={item.id} key={item.id}>
                                                        {item.name}
                                                    </Option>
                                                );
                                            })}
                                    </Select>
                                )}
                            </div>
                        </div>
                    )}
                    <div className={styles.scheduleContain}>
                        <ClubTable
                            clubDataSource={tableSource}
                            getClubDataSource={this.getClubDataSource}
                            getGroupByTree={this.getGroupByTree}
                            currentTime={currentTime}
                            onRef={this.onRef}
                        />
                    </div>
                    <div className={styles.paginationStyle}>
                        <div className={styles.pageContainer}>
                            <Pagination
                                showSizeChanger
                                showQuickJumper
                                current={current}
                                total={totalPage}
                                locale="zh-CN"
                                defaultPageSize={20}
                                pageSizeOptions={['10', '20', '40', '100']}
                                onChange={this.switchPage.bind(this)}
                                onShowSizeChange={this.switchPageSize.bind(this)}
                            />
                        </div>
                    </div>
                </div>

                {showFreedomCourse && (
                    <FreedomCourse
                        {...this.props}
                        {...this.state}
                        timeTableOrClub="club"
                        hideModal={this.hideModal}
                        fetchScheduleList={this.getClubDataSource}
                    />
                )}

                {generateVisible && (
                    <Modal
                        title="设置座位规则"
                        visible={generateVisible}
                        okText="生成座位号"
                        className={styles.generateStyle}
                        onOk={this.generateSeat}
                        onCancel={this.cancelGenerate}
                    >
                        <p>学生排序：同伴同学集中排，班内座位随机</p>
                        <p>
                            初始编号：
                            <InputNumber
                                className={styles.input}
                                value={initialNumber}
                                onChange={this.changeNumber}
                                min={1}
                            />
                        </p>
                    </Modal>
                )}

                {downloadVisible && (
                    <Modal
                        title="设置座位排布"
                        visible={downloadVisible}
                        okText="下载座位号"
                        className={styles.downloadStyle}
                        onOk={this.setSeat}
                        onCancel={this.cancelSet}
                    >
                        <p style={{ paddingLeft: 60 }}>
                            座位排布：
                            <InputNumber
                                className={styles.input}
                                value={colNumber}
                                onChange={this.changeCol}
                                min={1}
                            />{' '}
                            列{' '}
                            <InputNumber
                                className={styles.input}
                                value={rowNumber}
                                onChange={this.changeRow}
                                min={1}
                            />{' '}
                            行
                        </p>
                    </Modal>
                )}
                {errorDownVisible && (
                    <Modal
                        visible={errorDownVisible}
                        footer={[
                            <Button
                                type="primary"
                                className={styles.reUpload}
                                onClick={() => {
                                    this.setState({
                                        errorDownVisible: false,
                                    });
                                }}
                            >
                                重新设置
                            </Button>,
                        ]}
                        className={styles.errorStyle}
                        onCancel={() =>
                            this.setState({
                                errorDownVisible: false,
                            })
                        }
                        title="下载座位号失败"
                        width={720}
                    >
                        {checkResult.noSeatNumberActiveList &&
                            checkResult.noSeatNumberActiveList.length > 0 && (
                                <>
                                    <p style={{ textAlign: 'center', color: 'red' }}>
                                        以下活动未生成座位号
                                    </p>
                                    <div>
                                        {checkResult.noSeatNumberActiveList.map((item, index) => {
                                            return <p style={{ textAlign: 'center' }}>{item}</p>;
                                        })}
                                    </div>
                                </>
                            )}
                        {checkResult.dissatisfiedSeatNumberActiveList &&
                            checkResult.dissatisfiedSeatNumberActiveList.length > 0 && (
                                <>
                                    <p style={{ textAlign: 'center', color: 'red' }}>
                                        以下活动的学生人数大于设置的座位总数（行*列）
                                    </p>
                                    <div>
                                        {checkResult.dissatisfiedSeatNumberActiveList.map(
                                            (item, index) => {
                                                return (
                                                    <p style={{ textAlign: 'center' }}>{item}</p>
                                                );
                                            }
                                        )}
                                    </div>
                                </>
                            )}
                    </Modal>
                )}
                {batchDelVisible && (
                    <Modal
                        className={styles.batchStyle}
                        visible={batchDelVisible}
                        title="批量删除活动"
                        onOk={this.batchDelActive}
                        onCancel={() =>
                            this.setState({
                                batchDelVisible: false,
                            })
                        }
                    >
                        <span style={{ marginLeft: 58 }}>是否批量删除已勾选活动</span>
                    </Modal>
                )}
                {batchPubVisible && (
                    <Modal
                        className={styles.batchStyle}
                        visible={batchPubVisible}
                        title="批量公布活动"
                        onOk={this.batchPubActive}
                        onCancel={() =>
                            this.setState({
                                batchPubVisible: false,
                            })
                        }
                    >
                        <span style={{ marginLeft: 58 }}>是否批量公布已勾选活动</span>
                    </Modal>
                )}
                {importActivityVisible && (
                    <ImportActivity
                        toggleImportActivityVisible={this.toggleImportActivityVisible}
                        getClubDataSource={this.getClubDataSource}
                    />
                )}
            </div>
        );
    }
}
