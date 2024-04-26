import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
    Icon,
    Table,
    Divider,
    Input,
    Radio,
    Select,
    Button,
    Modal,
    DatePicker,
    Popover,
    Tooltip,
    message,
    Skeleton,
    Spin,
    Popconfirm,
    TreeSelect,
    Form,
    Upload,
    Menu,
    Dropdown,
} from 'antd';
import styles from './index.less';
import AutoHeight from '../component/autoHeight';
import StudentTableHeader from '../component/studentTableHeader';
import NavTitle from '../component/navTitle';
import MenuInner from '../component/menuInner';
// import powerUrl from '../../../assets/noData.png';
import empty from '../../../assets/empty.png';
// import AddStudent from '../component/addStudent';
import AddStudent from '../../../components/CommonModal/AddStudent';
import Timetable from '../component/timetable';
import Load from '../component/load';
import moment from 'moment';
import { isEmpty, debounce } from 'lodash';
import { formatTimeSafari, getUrlSearch } from '../../../utils/utils';
import { Link } from 'dva/router';
import { trans, locale } from '../../../utils/i18n';
import TextArea from 'antd/lib/input/TextArea';
import CancelSignUp from '../../CommonModal/CancelSignUp';

const { Option } = Select;
const { Item } = Menu;
const week = [
    {
        id: 1,
        name: '周一',
        ename: 'Mon',
    },
    {
        id: 2,
        name: '周二',
        ename: 'Tue',
    },
    {
        id: 3,
        name: '周三',
        ename: 'Wed',
    },
    {
        id: 4,
        name: '周四',
        ename: 'Thu',
    },
    {
        id: 5,
        name: '周五',
        ename: 'Fri',
    },
    {
        id: 6,
        name: '周六',
        ename: 'Sat',
    },
    {
        id: 7,
        name: '周日',
        ename: 'Sun',
    },
];

@connect((state) => ({
    chooseCoursePlanBatchList: state.choose.chooseCoursePlanBatchList,
    newOpenChooseCourse: state.choose.newOpenChooseCourse,
    listBatchStudentInfo: state.courseTeacherDetail.listBatchStudentInfo,
    currentUser: state.global.currentUser,
    importClassList: state.courseTeacherDetail.importClassList,
    previewEmail: state.courseTeacherDetail.previewEmail,
    classLists: state.courseTeacherDetail.classLists,
}))
class Student extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            host:
                location.origin.indexOf('daily') !== -1 ||
                location.origin.indexOf('localhost') !== -1
                    ? 'https://smart-scheduling.daily.yungu-inc.org'
                    : 'https://smart-scheduling.yungu-inc.org',
            gradeId: '',
            groupId: [],
            studentRange: 2, // 学生范围-1：我的学生；2：全部学生
            status: '', // 选课提交状态：0：未提交；1：已提交
            initData: false,
            batchIndex: -1,
            batchId: '',
            lotType: undefined, //批次类型
            adjustTimeBatchId: undefined, // 调整时间弹窗时的批次ID
            keyword: '', // 搜索关键字
            creditUpLimit: undefined,
            creditLowerLimit: undefined,
            isBatchEdit: false, // 默认编辑
            visibleSetupCourse: false, // 创建批次
            visibleSetupCourseList: [], // 设置选课时间弹窗默认隐藏列表
            visibleAddCourse: false, // 加课弹窗默认是隐藏
            addStudentModalVisible: false, // 添加学生弹窗默认是隐藏
            chooseCoursePlanBatchList: [],
            startTime: null,
            endTime: null,
            closingTime: null,
            planId: getUrlSearch('planId'),
            batchStudentOrg: [],
            studentIndex: -1, // 学生列表，默认不选中，是批量操作，如果是操作单个学生，必须是对应学生列表的下标
            columns: this.headerColumns().concat(this.footerColumns()), // 表格头部表头
            pageSize: 30,
            pageNum: 1,
            total: 0,
            tableWidthX: 300,
            firstLoad: true, // 首次加载
            visibleAdjustTime: false, // 批量调整时间
            loadTableData: false, // 每次请求时，加载动画
            visibleOpenCourse: false, // 开放选课弹窗默认隐藏的
            visibleOneClick: false, // 一键选报默认隐藏的
            visibleTimetable: false, // 课表详情默认隐藏的
            calculationResult: 0, // 一键选报计算结果
            studentInfor: {}, // 点击课表详情时，学生的具体信息
            selectedRowKeys: [], // 批量被选中的学生集合
            tipTitle: trans('global.tipTitle', '在左侧目录选择某一选课时间后方可操作'),
            isOpenCourse: false,
            coursePlanId: '',
            effecticveDisabled: false,
            courseNumberList: '', // 已选课程数量
            selectGroupId: [], //  选的班级id
            totalPeople: '',
            signUpCountThree: '',
            signUpCountTwo: '',
            signUpCountOne: '',
            signUpCountZero: '',
            signUpCountLowLimit: '',
            allStu: false,
            reportedThree: false,
            reportedTwo: false,
            reportedOne: false,
            reportedZero: false,
            lowerRegisterd: false,
            createType: 0, //新增选课时间
            exportVisible: false,
            exportType: 1,
            newOpenSelCourseVisible: false,
            closeSelCouVisible: false,
            isShowClose: false,
            classFileList: [],
            importClassModalVisible: false,
            isUploading: false,
            emailVisible: false,
            noticeWay: 3,
            textAreaValue: '',
            previewVisible: false,
            selectedRows: [],
            emailContent: undefined,
            chooseGroupIdList: [], //班级id集合
            cannelVisible: false,
        };
    }

    componentDidMount() {
        this.initData();
        this.initStudentDetail();
        this.props.onRef(this);
        this.getStudentsByClass();
    }

    // 获取学生列表详情
    initStudentDetail(bol = true) {
        const { dispatch, currentUser } = this.props;
        let {
            pageNum,
            pageSize,
            studentRange,
            creditUpLimit,
            creditLowerLimit,
            batchId,
            status,
            keyword,
            courseNumberList,
            selectGroupId,
            allStu,
            reportedThree,
            reportedTwo,
            reportedOne,
            reportedZero,
            lowerRegisterd,
            chooseGroupIdList,
        } = this.state;
        let isStudy = currentUser.schoolId == '1000001001';
        if (bol) {
            this.setState({
                loadTableData: true,
            });
        }
        dispatch({
            type: 'courseTeacherDetail/listBatchStudentInfo',
            payload: {
                chooseCoursePlanId: this.state.planId,
                batchId,
                pageNum,
                pageSize,
                groupIdList: selectGroupId,
                status,
                studentRange,
                creditUpLimit,
                creditLowerLimit,
                keyword,
                courseNumber: courseNumberList,
                allStu,
                reportedThree,
                reportedTwo,
                reportedOne,
                reportedZero,
                lowerRegisterd,
                chooseGroupIdList,
            },
            onSuccess: () => {
                let {
                    maxNumber,
                    total,
                    data,
                    totalPeople,
                    signUpCountThree,
                    signUpCountTwo,
                    signUpCountOne,
                    signUpCountZero,
                    signUpCountLowLimit,
                    batchType,
                } = this.props.listBatchStudentInfo;
                let midColumns = [];
                let self = this;
                let initX = 0;
                let columns = [];
                // 记录上一次总页数
                let oldTotal = this.state.total;

                // 每一行添加序号
                let batchStudentOrg =
                    data &&
                    data.map((item, index) => ({
                        index,
                        ...item,
                        key: index,
                    }));
                for (let i = 0; i < maxNumber; i++) {
                    midColumns.push({
                        title: i + 1,
                        dataIndex: 'middle' + i,
                        key: 'middle' + i,
                        className: styles.tbodyTr,
                        // width: 96,
                        width: 180,
                        render: function (tag, item) {
                            let elt = item.studentChooseCourseModelList;
                            let activeType = false;
                            // 判断相邻的下一个是否被选中
                            if (
                                elt[i] &&
                                elt[i].status === 1 &&
                                elt[i + 1] &&
                                elt[i + 1].status === 1
                            ) {
                                activeType = true;
                            }
                            return elt[i]
                                ? self.dynamicHTML(elt[i], activeType, item.index, i)
                                : null;
                        },
                    });
                    initX += 180;
                }

                // 预留空隙
                midColumns.push({
                    title: null,
                    dataIndex: 'middleLast',
                    key: 'middleLast',
                });

                columns = isStudy
                    ? this.headerColumns().concat(midColumns)
                    : this.headerColumns().concat(midColumns).concat(this.footerColumns());

                if (maxNumber > 6) {
                    columns[0].fixed = 'left';
                    columns[columns.length - 1].fixed = 'right';
                }

                this.setState({
                    total,
                    tableWidthX: initX + 300, // 300是首尾总宽度
                    batchStudentOrg,
                    firstLoad: false,
                    loadTableData: false,
                    columns,
                    totalPeople,
                    signUpCountThree,
                    signUpCountTwo,
                    signUpCountOne,
                    signUpCountZero,
                    signUpCountLowLimit,
                    // lotType: batchType,
                });

                if (total != oldTotal) {
                    this.initTableHeaderHeightAuto();
                }
            },
        });
    }

    getStudentsByClass = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'courseTeacherDetail/getStudentsByClass',
            payload: { chooseCoursePlanId: this.state.planId },
        });
    };

    // 重置
    resetData = () => {
        this.setState(
            {
                pageNum: 1,
                selectedRowKeys: [],
            },
            () => {
                this.initStudentDetail();
                this.initData();
            }
        );
    };

    headerColumns = () => {
        return [
            {
                title: trans('course.basedetail.student.list', '学生列表'),
                dataIndex: 'studentList',
                key: 'studentList',
                width: 130,
                align: 'center',
                className: styles.tr,
                render: (tag, item) => (
                    <StudentTableHeader
                        host={this.state.host}
                        {...item}
                        chooseCourseDetails={this.props.chooseCourseDetails}
                    />
                ),
            },
        ];
    };

    footerColumns = () => {
        let status = null;
        if (this.state) {
            let { batchIndex, chooseCoursePlanBatchList } = this.state;
            if (batchIndex === -1) {
                status = 2;
            } else {
                status = chooseCoursePlanBatchList[batchIndex].status;
            }
        }
        let { isAdmin } = this.props;
        return [
            {
                title: trans('student.opeation', '操作'),
                dataIndex: 'operation',
                key: 'operation',
                width: 203,
                align: 'center',
                render: (tag, item) => {
                    const { effecticveDisabled } = this.props;
                    return (
                        <div className={styles.operation}>
                            <Fragment>
                                {isAdmin && (
                                    <div className={styles.item}>
                                        {
                                            <a
                                                onClick={() => {
                                                    this.onShowModel('visibleAdjustTime');
                                                    this.setState({
                                                        studentIndex: item.index,
                                                    });
                                                }}
                                            >
                                                {trans('tc.base.adjustment.time', '调整批次')}
                                            </a>
                                        }
                                        {isEmpty(item.studentChooseCourseModelList) && (
                                            <Fragment>
                                                <Divider type="vertical" />
                                                {
                                                    <a
                                                        onClick={this.removeStudent.bind(
                                                            this,
                                                            1,
                                                            item
                                                        )}
                                                    >
                                                        {trans('course.basedetail.remove', '移除')}
                                                    </a>
                                                }
                                            </Fragment>
                                        )}
                                    </div>
                                )}
                            </Fragment>
                        </div>
                    );
                },
            },
        ];
    };

    dealDate = (arr) => {
        if (arr && arr.length == 0) {
            return false;
        }
        let tempStr = '';
        arr &&
            arr.length &&
            arr.map((el, ind) => {
                week.map((item, index) => {
                    if (el.weekday == item.id) {
                        tempStr += item.name;
                    }
                });
            });
        return tempStr;
    };

    delRecord = (elt) => {
        this.setState({
            delVisible: true,
            info: elt,
        });
    };

    cannelReport = (elt) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'courseBaseDetail/getCancelFee',
            payload: {
                studentChooseCourseId: elt.id,
            },
        }).then(() => {
            this.setState({
                cannelVisible: true,
                info: elt,
            });
        });
        // this.setState({
        //     cannelVisible: true,
        //     studentId: elt.userId,
        // });
    };

    // 中间动态数据部分
    dynamicHTML = (elt, activeType, pIndex, sIndex) => {
        const {
            isAdmin,
            selectionMessage,
            chooseCourseDetails: item,
            effecticveDisabled,
            chooseCoursePlanBatchList,
            chooseCourseDetails,
            nonAdminType,
        } = this.props;

        const limitMenu = (
            <Menu>
                {isAdmin && !effecticveDisabled && (
                    <Item onClick={() => this.delRecord(elt)}>删除报名记录</Item>
                )}

                <Item onClick={() => this.cannelReport(elt)}>取消报名</Item>
            </Menu>
        );

        const nolimitMenu = (
            <Menu>
                <Item onClick={() => this.delRecord(elt)}>删除报名记录</Item>
                <Item onClick={() => this.cannelReport(elt)}>取消报名</Item>
            </Menu>
        );

        // chooseCourseDetails.type === 1 志愿申报； chooseCourseDetails.type === 2 先到先得；
        // elt.type == 1 学生提交；elt.type == 2 教师添加
        // status	选中状态（0:未选中；1:已选中,2 未提交）
        let sectionIds = getUrlSearch('sectionIds');

        return (
            <div
                className={
                    elt.status === 1
                        ? `${styles.trItem} ${styles.active} ${
                              activeType ? `${styles.activeType}` : null
                          }`
                        : styles.trItem
                }
            >
                <div className={styles.item} title={elt.courseName}>
                    <Link
                        to={`/course/base/detail?chooseCoursePlanId=${
                            elt.chooseCoursePlanId
                        }&coursePlanningId=${elt.coursePlanningId}&classId=${
                            elt.classId
                        }&courseId=${elt.courseId}&chooseCourseName=${
                            selectionMessage && selectionMessage.name
                        }&courseName=${
                            elt.courseName
                        }&sectionIds=${sectionIds}&isAdmin=${isAdmin}&nonAdminType=${nonAdminType}`}
                    >
                        <Tooltip
                            title={
                                locale() !== 'en'
                                    ? elt.studentGroupOutputModel &&
                                      elt.studentGroupOutputModel.name
                                        ? elt.studentGroupOutputModel.name
                                        : elt.courseName
                                    : elt.studentGroupOutputModel &&
                                      elt.studentGroupOutputModel.ename
                                    ? elt.studentGroupOutputModel.ename
                                    : elt.courseEname
                            }
                        >
                            {locale() !== 'en'
                                ? elt.studentGroupOutputModel && elt.studentGroupOutputModel.name
                                    ? elt.studentGroupOutputModel.name
                                    : elt.courseName
                                : elt.studentGroupOutputModel && elt.studentGroupOutputModel.ename
                                ? elt.studentGroupOutputModel.ename
                                : elt.courseEname}
                        </Tooltip>
                    </Link>
                </div>
                {
                    // 志愿填报
                    chooseCourseDetails.type === 1 ? (
                        elt.type == 2 ? (
                            <Fragment>
                                <span className={styles.teacher}>
                                    {trans('course.basedetail.teacher.registration', '教师添加')}
                                </span>
                                <Dropdown
                                    overlay={
                                        limitMenu

                                        // isAdmin &&
                                        // !effecticveDisabled && (
                                        //     <Popconfirm
                                        //         title="确认删除该学生的报名记录吗"
                                        //         okText="是"
                                        //         cancelText="否"
                                        //         onConfirm={this.checkedStatus.bind(
                                        //             this,
                                        //             elt,
                                        //             pIndex,
                                        //             sIndex,
                                        //             1
                                        //         )}
                                        //     >
                                        //         <div
                                        //             className={`${styles.itemS} ${styles.itemCheck}`}
                                        //         >
                                        //             <Icon
                                        //                 type="check-circle"
                                        //                 className={styles.icon}
                                        //             />
                                        //             删除报名记录
                                        //         </div>
                                        //     </Popconfirm>
                                        // )
                                    }
                                >
                                    <a>
                                        调整 <Icon type="down" />
                                    </a>
                                </Dropdown>
                            </Fragment>
                        ) : (
                            <Fragment>
                                <div className={styles.itemMiddle}></div>
                                {isAdmin ? (
                                    <div
                                        className={
                                            elt.status === 1
                                                ? `${styles.itemS} ${styles.itemCheck}`
                                                : elt.status === 2
                                                ? styles.unSubmited
                                                : styles.itemCheck
                                        }
                                    >
                                        <Icon type="check-circle" className={styles.icon} />
                                        {elt.status === 1 ? (
                                            <Popconfirm
                                                title={trans(
                                                    'course.basedetail.affirm.cancelPick',
                                                    '确认将学生的已报课程取消选中吗？'
                                                )}
                                                okText="是"
                                                cancelText="否"
                                                onConfirm={this.checkedStatus.bind(
                                                    this,
                                                    elt,
                                                    pIndex,
                                                    sIndex,
                                                    2
                                                )}
                                            >
                                                <span>
                                                    {trans('course.basedetail.selected', '已选中')}
                                                </span>
                                            </Popconfirm>
                                        ) : elt.status === 2 ? (
                                            <span>{trans('tc.base.not.submitted', '未提交')}</span>
                                        ) : elt.status === 0 ? (
                                            <Popconfirm
                                                title={trans(
                                                    'course.basedetail.set.pick',
                                                    '确认将学生的已报课程设为选中吗？'
                                                )}
                                                okText="是"
                                                cancelText="否"
                                                onConfirm={this.checkedStatus.bind(
                                                    this,
                                                    elt,
                                                    pIndex,
                                                    sIndex,
                                                    2
                                                )}
                                            >
                                                <span>
                                                    {trans(
                                                        'course.basedetail.no.selected',
                                                        '未选中'
                                                    )}
                                                </span>
                                            </Popconfirm>
                                        ) : null}
                                    </div>
                                ) : null}
                                <Dropdown overlay={limitMenu}>
                                    <a>
                                        调整 <Icon type="down" />
                                    </a>
                                </Dropdown>
                            </Fragment>
                        )
                    ) : (
                        <Fragment>
                            <div className={styles.itemMiddle}>
                                <span>
                                    {elt.classTimeModels ? this.dealDate(elt.classTimeModels) : ''}
                                </span>
                                &nbsp;
                                <span style={{ color: 'red', fontSize: '10px' }}>
                                    {elt.noFullCourse
                                        ? trans('global.Group Failed', '组班失败')
                                        : null}
                                </span>
                            </div>
                            {isAdmin ? (
                                <div
                                    className={
                                        elt.status === 1
                                            ? `${styles.itemS} ${styles.itemCheck} ${styles.move}`
                                            : elt.status === 2
                                            ? styles.unSubmited
                                            : styles.itemCheck
                                    }
                                >
                                    <Dropdown overlay={nolimitMenu}>
                                        <a>
                                            调整 <Icon type="down" />
                                        </a>
                                    </Dropdown>
                                </div>
                            ) : null}
                        </Fragment>
                    )
                }
                {elt.status === 1 ? <span className={styles.triangle}></span> : null}
            </div>
        );
    };

    checkedStatus = (elt, pIndex, sIndex, type) => {
        const { dispatch, isAdmin } = this.props;
        if (!isAdmin) {
            message.warn(trans('global.no.permission', '暂无权限'));
            this.setState({
                delVisible: false,
            });
            return;
        }
        let { batchStudentOrg } = this.state;
        let _status = 0;
        if (type === 1) {
            _status = 2;
        } else {
            if (elt.status == 0 || elt.status == 3) {
                _status = 0;
            } else if (elt.status == 1) {
                _status = 1;
            }
        }
        dispatch({
            type: 'courseBaseDetail/studentCourseResultsManagement',
            payload: {
                id: elt.id,
                type: _status,
            },
            onSuccess: () => {
                this.initStudentDetail(false);
                this.setState({
                    delVisible: false,
                });
            },
        });
    };

    cannelCourse = () => {
        const { studentId } = this.state;
        const { dispatch } = this.props;
        dispatch({
            type: 'courseBaseDetail/getCancelFee',
            payload: {
                studentChooseCourseId: studentId,
            },
        }).then(() => {
            this.initStudentDetail(false);
            this.setState({
                cannelVisible: false,
            });
        });
    };

    // 批次
    initData() {
        const { dispatch } = this.props;
        let { visibleSetupCourseList } = this.state;
        dispatch({
            type: 'choose/chooseCoursePlanBatchList',
            payload: {
                id: this.state.planId,
            },
            onSuccess: (data) => {
                visibleSetupCourseList = [];
                data.forEach((el) => {
                    visibleSetupCourseList.push(false);
                });
                data = data.map((el, index) => ({ ...el, key: el.id, index }));
                this.setState({
                    chooseCoursePlanBatchList: data,
                    visibleSetupCourseList,
                });
            },
        });
    }

    initTableHeaderHeightAuto() {
        setTimeout(() => {
            let thead1 = document.getElementsByClassName('ant-table-thead');
            let tr = thead1 && thead1[0] && thead1[0].getElementsByTagName('tr');
            let tds = (tr && tr[0] && tr[0].getElementsByTagName('th')) || [];
            for (let i = 0; i < tds.length; i++) {
                tds[i].style.height = 'auto';
                tds[i].style.textAlign = 'center';
            }

            let thead2 = document.getElementsByClassName('ant-table-thead');
            let tds2 = (thead2 && thead2[1] && thead2[1].getElementsByTagName('tr')) || [];
            for (let i = 0; i < tds2.length; i++) {
                tds2[i].style.height = 'auto';
            }

            let thead3 = document.getElementsByClassName('ant-table-thead');
            let tds3 = (thead3 && thead3[2] && thead3[2].getElementsByTagName('tr')) || [];
            for (let i = 0; i < tds2.length; i++) {
                tds3[i].style.height = 'auto';
            }
        }, 100);
    }

    handleChange(type, val) {
        this.setState(
            {
                [type]: val,
                pageNum: 1,
            },
            () => {
                this.initStudentDetail();
            }
        );
    }

    hideModal = (type) => {
        switch (type) {
            case 'addStudentModalVisible':
                this.setState({
                    addStudentModalVisible: false,
                });
                break;
            case 'visibleOpenCourse':
                this.setState({
                    visibleOpenCourse: false,
                });
                break;
            case 'visibleTimetable':
                this.setState({
                    visibleTimetable: false,
                });
                break;
            default:
                break;
        }
    };

    // 批量操作
    switchStatus = (i) => {
        let { selectedRowKeys, batchIndex, tipTitle } = this.state;
        if (selectedRowKeys.length === 0) {
            message.warn(trans('global.checked.student', '请先勾选要批量操作的学生'));
            return;
        }
        if (i === 0) {
            if (batchIndex === -1) {
                message.warn(tipTitle);
                return;
            }
            this.onShowModel('visibleAdjustTime');
        } else if (i === 1) {
            this.removeStudent(2);
        } else if (i == 2) {
            this.setState({
                emailVisible: true,
            });
        }
    };

    sendMsgForOutSchool = () => {
        let { selectedRowKeys } = this.state;
        if (selectedRowKeys.length === 0) {
            message.warn(trans('global.checked.student', '请先勾选要批量操作的学生'));
            return;
        }
        this.setState({
            emailVisible: true,
        });
    };

    // 移除学生
    removeStudent = (type, item) => {
        let { dispatch } = this.props;
        let self = this;
        let { selectedRowKeys, planId, batchStudentOrg } = this.state;
        console.log('selectedRowKeys', selectedRowKeys);
        Modal.confirm({
            title: null,
            icon: null,
            className: styles.removeContainer,
            content: (
                <span className={styles.title}>
                    {trans(
                        'course.basedetail.remove.selected.student',
                        '确认将选中的学生从本次选课中移除吗？'
                    )}
                </span>
            ),
            onOk: () => {
                let params = [];
                // 单个移除学生
                if (type === 1) {
                    params.push({
                        chooseCoursePlanId: planId,
                        userIds: [item.userDTO.userId],
                    });
                } else {
                    // 批量移除学生
                    let list = [];
                    for (let i = 0; i < selectedRowKeys.length; i++) {
                        let elt = batchStudentOrg[selectedRowKeys[i]];
                        console.log('elt', elt);
                        if (elt.studentChooseCourseModelList.length === 0) {
                            list.push(elt.userDTO.userId);
                        }
                    }
                    console.log('list', list);
                    if (list.length === 0) {
                        message.warn(
                            trans('tc.base.forbidden.remove.students', '请先取消学生的选课再移除')
                        );
                        return;
                    }
                    params.push({
                        chooseCoursePlanId: planId,
                        userIds: list,
                    });
                }
                dispatch({
                    type: 'courseTeacherDetail/studentBatchRemoval',
                    payload: params,
                }).then(() => {
                    self.setState(
                        {
                            selectedRowKeys: [],
                            pageNum: 1,
                        },
                        () => {
                            self.initStudentDetail();
                        }
                    );
                });
            },

            okText: trans('course.basedetail.confirm.remove', '确认移除'),
            cancelText: trans('global.cancel', '取消'),
        });
    };

    fomatGrade = (gradeList) => {
        let grade = [];
        gradeList &&
            gradeList.length > 0 &&
            gradeList.map((item, index) => {
                let obj = {};
                obj.title = locale() != 'en' ? item.orgName : item.orgEname;
                obj.key = item.id;
                obj.value = item.id;
                obj.children = this.fomatClass(item.groupList);
                grade.push(obj);
            });
        return grade;
    };

    onChangeType = (e) => {
        this.setState({
            exportType: e.target.value,
        });
    };

    changeType = (e) => {
        this.setState({
            lotType: e.target.value,
        });
    };

    onChangeAdd = (e) => {
        this.setState({
            createType: e.target.value,
        });
    };

    fomatClass = (list) => {
        let group = [];
        if (list.length < 0) return;
        list &&
            list.length > 0 &&
            list.map((item, index) => {
                let obj = {};
                obj.title = locale() != 'en' ? item.name : item.enName;
                obj.key = item.groupId;
                obj.value = item.groupId;
                group.push(obj);
            });
        return group;
    };

    fomatNum = () => {
        let num = [];
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => {
            let obj = {};
            obj.title = item;
            obj.key = item;
            obj.value = item;
            num.push(obj);
        });
        return num;
    };

    changeNoticeWay = (e) => {
        this.setState({
            noticeWay: e.target.value,
        });
    };

    changeTextArea = (e) => {
        this.setState({
            textAreaValue: e.target.value,
        });
    };

    cancelSend = () => {
        this.setState({
            emailVisible: false,
            noticeWay: 3,
        });
    };

    sendNotice = () => {
        const { dispatch } = this.props;
        let self = this;
        let { selectedRowKeys, selectedRows, noticeWay, planId } = self.state;
        let tempStudentIdList = [];
        selectedRows &&
            selectedRows.length &&
            selectedRows.forEach((item, index) => {
                let tempUserId = item.userDTO?.userId;
                tempStudentIdList.push(tempUserId);
            });
        let value = document.getElementById('textAreaId').innerHTML;
        value = value.toString();
        let tempStr = '\n';
        value = value.replaceAll(tempStr, '<br/>');
        dispatch({
            type: 'courseTeacherDetail/sendNoticeForParents',
            payload: {
                chooseCoursePlanId: planId,
                studentUserIdList: tempStudentIdList, //选中学生id集合
                type: noticeWay, //
                content: value, //通知内容
            },
            onSuccess: () => {
                document.getElementById('textAreaId').innerHTML = '';
                self.setState(
                    {
                        emailVisible: false,
                        selectedRowKeys: [],
                        pageNum: 1,
                    },
                    () => {
                        self.initStudentDetail();
                    }
                );
            },
        });
        // self.setState(
        //     {
        //         selectedRowKeys: [],
        //         pageNum: 1,
        //     },
        //     () => {
        //         self.initStudentDetail();
        //     }
        // );
    };

    previewEmail = () => {
        const { dispatch } = this.props;
        /* const { selectedRows } = this.state;
        let eduGroupCompanyId = selectedRows[0].userDTO.eduGroupCompanyId;
        let schoolId = selectedRows[0].userDTO.schoolId; */
        dispatch({
            type: 'courseTeacherDetail/previewEmail',
            payload: {
                /* eduGroupCompanyId,
                schoolId, */
                chooseCoursePlanId: this.state.planId,
            },
        }).then(() => {
            const { previewEmail } = this.props;
            let value = document.getElementById('textAreaId').innerHTML;
            if (!previewEmail) {
                console.log('11', 11);
                this.setState({
                    emailContent: value,
                });
            } else {
                console.log('22', 22);
                const searchRegExp = '${content}';
                const replaceWith = value;
                let tempEmail = previewEmail.replace(searchRegExp, replaceWith);
                this.setState({
                    emailContent: tempEmail,
                });
            }
        });
        this.setState({
            previewVisible: true,
        });
    };

    changeClass = (value) => {
        this.setState(
            {
                chooseGroupIdList: value,
            },
            () => this.initStudentDetail()
        );
    };

    clearClassIds = () => {
        this.setState(
            {
                chooseGroupIdList: [],
            },
            () => this.initStudentDetail()
        );
    };

    searchHTML() {
        let {
            gradeId,
            studentRange,
            status,
            creditUpLimit,
            previewVisible,
            keyword,
            batchIndex,
            tipTitle,
            chooseCoursePlanBatchList,
            emailVisible,
            classFileList,
            importClassModalVisible,
            isUploading,
            errorListModalVisible,
            noticeWay,
            emailContent,
            chooseGroupIdList,
        } = this.state;
        let { gradeList, isAdmin, classLists, currentUser, importClassList } = this.props;
        let isStudy = currentUser.schoolId == '1000001001';
        let showStatus =
            chooseCoursePlanBatchList &&
            chooseCoursePlanBatchList.length > 0 &&
            chooseCoursePlanBatchList[0]?.status;

        let isTrue = undefined;
        if (showStatus == 1 || showStatus == 2 || showStatus == 3) {
            isTrue = true;
        } else if (showStatus == 4) {
            isTrue = false;
        }
        const teacherUploadProps = {
            onRemove: (file) => {
                this.setState((state) => {
                    const index = state.classFileList.indexOf(file);
                    const newFileList = state.classFileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        classFileList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {
                this.setState(
                    (state) => ({
                        isChecking: true,
                        classFileList: [...state.classFileList, file],
                    }),
                    () => {
                        let { classFileList } = this.state;
                        let formData = new FormData();
                        for (let item of classFileList) {
                            formData.append('file', item);
                        }
                    }
                );
                return false;
            },
            classFileList,
        };
        const treeProps = {
            style: {
                // width: 150,
                marginRight: 8,
                verticalAlign: 'top',
            },
            maxTagCount: 2,
            dropdownStyle: {
                maxHeight: 400,
                overflow: 'auto',
            },
            treeNodeFilterProp: 'title',
            treeCheckable: true,
            treeNodeFilterProp: 'title',
        };
        const gradeProps = {
            ...treeProps,
            treeData: this.fomatGrade(gradeList),
            placeholder: trans('course.plan.allGrade', '全部年级'),
            onChange: this.handleChange.bind(this, 'selectGroupId'),
        };

        const countProps = {
            ...treeProps,
            placeholder: trans('', '已选课程数量'),
            treeData: this.fomatNum(),
            onChange: this.handleChange.bind(this, 'courseNumberList'),
        };

        return (
            <div>
                <div className={styles.search}>
                    <div className={styles.searchL}>
                        {!isStudy && (
                            <Select
                                defaultValue={studentRange}
                                style={{ width: 110, marginRight: '5px', verticalAlign: 'middle' }}
                                className={styles.selectStyle}
                                onChange={this.handleChange.bind(this, 'studentRange')}
                            >
                                <Option value={2} key="all">
                                    {trans('global.all.students', '全部学生')}
                                </Option>
                                <Option value={1} key="me">
                                    {trans('global.me.students', '我的学生')}
                                </Option>
                            </Select>
                        )}
                        {!isStudy && (
                            <TreeSelect
                                {...gradeProps}
                                className={styles.treeSelectStyle}
                                style={{ verticalAlign: 'middle' }}
                            ></TreeSelect>
                        )}

                        <Select
                            defaultValue={status}
                            style={{ width: 110, marginRight: '8px', verticalAlign: 'middle' }}
                            className={styles.selectStyle}
                            onChange={this.handleChange.bind(this, 'status')}
                        >
                            <Option value="" key="all">
                                {trans('global.all.status', '全部状态')}
                            </Option>
                            <Option value={1} key="no">
                                {trans('tc.base.not.submitted', '未提交')}
                            </Option>
                            <Option value={2} key="yes">
                                {trans('course.header.submitted', '已提交')}
                            </Option>
                        </Select>

                        <div className={styles.stageAndGrade} style={{ verticalAlign: 'top' }}>
                            {chooseGroupIdList && chooseGroupIdList.length > 0 && (
                                <span className={styles.tagPlaceholder}>
                                    {chooseGroupIdList.length}个班级
                                    <span className={styles.close} onClick={this.clearClassIds}>
                                        <Icon
                                            type="close-circle"
                                            theme="filled"
                                            style={{ color: '#bbb' }}
                                        />
                                    </span>
                                </span>
                            )}
                            <Select
                                className={styles.selectStyles}
                                mode="multiple"
                                onChange={this.changeClass}
                                maxTagCount={0}
                                placeholder={trans('global.allClasses', '全部班级')}
                                value={chooseGroupIdList}
                                style={{ height: '36px' }}
                                showSearch="true"
                                optionFilterProp="children"
                                autoClearSearchValue={false}
                                dropdownMatchSelectWidth={false}
                                // dropdownClassName="drop"
                                dropdownStyle={{
                                    width: 'auto',
                                }}
                            >
                                {classLists &&
                                    classLists.length &&
                                    classLists.map((item, index) => {
                                        return (
                                            <Option value={item.id} key={item.id}>
                                                {locale() != 'en' ? item.name : item.enName}
                                            </Option>
                                        );
                                    })}
                            </Select>
                        </div>

                        <Input.Search
                            value={keyword}
                            className={styles.searchInput}
                            style={{ verticalAlign: 'middle' }}
                            onSearch={this.handleChange.bind(this, 'keyword')}
                            onChange={(e) => {
                                this.setState({
                                    keyword: e.target.value,
                                });
                            }}
                            placeholder={trans('global.inputKeyword', '关键字')}
                        />
                    </div>
                    <div className={styles.searchR}>
                        {
                            <Fragment>
                                {isStudy && (
                                    <span
                                        style={{ marginLeft: '8px' }}
                                        className={styles.b}
                                        // onClick={this.closeSelectCourse}
                                    >
                                        {isTrue == true
                                            ? '已开放'
                                            : isTrue == false
                                            ? '已关闭'
                                            : ''}
                                    </span>
                                )}

                                <Button
                                    type="primary"
                                    className={styles.export}
                                    style={{ width: 'auto' }}
                                    onClick={this.exportBatch}
                                >
                                    {trans('global.exportBatchImport', '导出选课结果')}
                                </Button>
                                <Modal
                                    title={trans('global.exportBatchImport', '导出选课结果')}
                                    className={styles.exportSelect}
                                    visible={this.state.exportVisible}
                                    onCancel={this.exportHandleCancel}
                                    footer={
                                        <div>
                                            <Button
                                                className={styles.cancel}
                                                onClick={() => this.exportHandleCancel()}
                                                style={{
                                                    color: 'rgba(1, 17, 61, 0.65)',
                                                    background: 'rgba(1, 17, 61, 0.07)',
                                                    border: 0,
                                                    height: '36px',
                                                    lineHeight: '36px',
                                                    borderRadius: '8px',
                                                }}
                                            >
                                                {trans('global.cancel', '取消')}
                                            </Button>
                                            <Button
                                                className={styles.sure}
                                                type="primary"
                                                onClick={() => this.exportHandleOk()}
                                                style={{
                                                    background: '#3B6FF5',
                                                    color: '#fff',
                                                    height: '36px',
                                                    lineHeight: '36px',
                                                    borderRadius: '8px',
                                                }}
                                            >
                                                {trans('course.plan.okText', '确认')}
                                            </Button>
                                        </div>
                                    }
                                >
                                    <Radio.Group
                                        onChange={this.onChangeType}
                                        value={this.state.exportType}
                                        className={styles.selectType}
                                    >
                                        <Radio value={1}>
                                            {trans(
                                                'global.alignTitle',
                                                '一个学生一行，选报班级按上课时间对齐'
                                            )}
                                        </Radio>
                                        <Radio value={2}>
                                            {trans(
                                                'global.Course selection detailsTit',
                                                '导出学生选课明细'
                                            )}
                                        </Radio>
                                    </Radio.Group>
                                </Modal>

                                <Modal
                                    visible={importClassModalVisible}
                                    title={trans(
                                        'global.Import students result',
                                        '导入学生选课结果'
                                    )}
                                    okText={trans('global.importScheduleConfirm', '确认导入')}
                                    className={styles.importCalendar}
                                    onCancel={() =>
                                        this.setState({ importClassModalVisible: false })
                                    }
                                    closable={false}
                                    onOk={debounce(this.sureImportClass, 1000)}
                                    destroyOnClose={true}
                                >
                                    <Spin
                                        spinning={isUploading}
                                        tip={trans('global.file uploading', '文件正在上传中')}
                                    >
                                        <div>
                                            <div className={styles.importMsg}>
                                                <span>①</span>&nbsp;
                                                <span>
                                                    {trans(
                                                        'global.downloadScheduleTemplate',
                                                        '下载导入模板，批量填写导入信息'
                                                    )}
                                                </span>
                                                <a
                                                    href={`/api/course/selection/importCourseGroupToStudentExcelDownload
                                                    `}
                                                    target="_blank"
                                                    style={{ marginLeft: 15 }}
                                                >
                                                    {trans(
                                                        'global.scheduleDownloadTemplate',
                                                        '下载模板'
                                                    )}
                                                </a>
                                            </div>
                                            <div className={styles.importMsg}>
                                                <span>②</span>&nbsp;
                                                <span>
                                                    {trans(
                                                        'global.uploadSchedule',
                                                        '上传填写好的导入信息表'
                                                    )}
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
                                                            <Upload
                                                                {...teacherUploadProps}
                                                                maxCount={1}
                                                            >
                                                                <Button type="primary">
                                                                    {trans(
                                                                        'global.scheduleSelectFile',
                                                                        '选择文件'
                                                                    )}
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
                                    visible={errorListModalVisible}
                                    onCancel={() =>
                                        this.setState({
                                            errorListModalVisible: false,
                                        })
                                    }
                                    footer={false}
                                >
                                    {importClassList.map((item) => (
                                        <p>{item}</p>
                                    ))}
                                </Modal>

                                {isStudy ? (
                                    <MenuInner
                                        className={styles.lotOperate}
                                        // style={{ padding: 'auto' }}
                                        title={trans(
                                            'course.basedetail.batch.operation',
                                            '批量操作'
                                        )}
                                        menuItem={[trans('course.basedetail.eamil', '发起通知')]}
                                        switchStatus={this.sendMsgForOutSchool}
                                        // effecticveDisabled={effecticveDisabled}
                                        effecticveDisabled={false}
                                    />
                                ) : (
                                    <MenuInner
                                        className={styles.lotOperate}
                                        // style={{ padding: 'auto' }}
                                        title={trans(
                                            'course.basedetail.batch.operation',
                                            '批量操作'
                                        )}
                                        menuItem={[
                                            trans('tc.base.adjustment.time', '调整批次'),
                                            trans('course.basedetail.remove', '移除'),
                                            trans('course.basedetail.eamil', '发起通知'),
                                        ]}
                                        switchStatus={this.switchStatus.bind(this)}
                                        // effecticveDisabled={effecticveDisabled}
                                        effecticveDisabled={false}
                                    />
                                )}

                                <Modal
                                    visible={emailVisible}
                                    title="发送通知"
                                    className={styles.emailNotice}
                                    onCancel={this.cancelSend}
                                    onOk={this.sendNotice}
                                    destroyOnClose={true}
                                >
                                    <div>
                                        <p className={styles.pStyle}>
                                            <span style={{ fontWeight: '700' }}>通知对象</span>
                                            <span className={styles.pointStyle}>*</span>
                                            <Radio defaultChecked={true}>家长</Radio>
                                        </p>
                                        <p className={styles.pStyle}>
                                            <span style={{ fontWeight: '700' }}>通知方式</span>
                                            <span className={styles.pointStyle}>*</span>
                                            <Radio.Group
                                                onChange={this.changeNoticeWay}
                                                value={noticeWay}
                                            >
                                                <Radio value={3}>邮件</Radio>
                                                <Radio value={4}>钉钉</Radio>
                                            </Radio.Group>
                                            {/* <Radio defaultChecked={true}>邮件</Radio> */}
                                        </p>
                                        {/* <p className={styles.pStyle}>
                                            <span style={{ fontWeight: '700' }}>通知语言</span>
                                            <span className={styles.pointStyle}>*</span>
                                            <Radio.Group
                                                onChange={this.changeNoticeLanguage}
                                                value={noticeLanguage}
                                            >
                                                <Radio value={1}>中文</Radio>
                                                <Radio value={2}>英文</Radio>
                                            </Radio.Group>
                                        </p> */}
                                        <p className={styles.pStyle + ' ' + styles.specialStyle}>
                                            <span
                                                style={{
                                                    fontWeight: '700',
                                                    position: 'relative',
                                                    bottom: '100px',
                                                }}
                                            >
                                                通知内容
                                            </span>
                                            <span
                                                className={styles.pointStyle}
                                                style={{ position: 'relative', bottom: '100px' }}
                                            >
                                                *
                                            </span>
                                            <div style={{ display: 'inline-block' }}>
                                                <p className={styles.previewStyle}>
                                                    <span onClick={this.previewEmail}>预览</span>
                                                </p>
                                                <TextArea
                                                    id="textAreaId"
                                                    placeholder="请填写内容"
                                                    style={{ marginTop: '7px', width: '260px' }}
                                                    rows={4}
                                                    // onChange={this.changeTextArea}
                                                    // value={textAreaValue}
                                                ></TextArea>
                                            </div>
                                        </p>
                                    </div>
                                </Modal>

                                <Modal
                                    visible={previewVisible}
                                    title="邮件预览"
                                    footer={null}
                                    onCancel={() => {
                                        this.setState({
                                            previewVisible: false,
                                        });
                                    }}
                                >
                                    {/* <RichEditor
                                        // style={{ width: '92%' }}
                                        height={300}
                                        placeholder="在这里请输入"
                                        // language="en"
                                        language={locale() == 'en' ? 'en' : 'zh_CN'}
                                        initContent={previewEmail}
                                        // handleEditorChange={this.handleEnEditorChange}
                                        statusbar={false}
                                        // disabled={true}
                                    /> */}
                                    <div
                                        style={{ whiteSpace: 'pre-wrap' }}
                                        dangerouslySetInnerHTML={{ __html: emailContent }}
                                    ></div>
                                </Modal>

                                {/* {!isStudy && (
                                    <Button
                                        onClick={this.onShowModel.bind(this, 'visibleOpenCourse')}
                                        // disabled={effecticveDisabled}
                                        className={styles.b}
                                    >
                                        {trans('tc.base.open.course.selection', '开放选课')}
                                    </Button>
                                )}

                                {isStudy && !isTrue && (
                                    <Button
                                        style={{ marginLeft: '8px' }}
                                        // className={styles.b}
                                        onClick={this.newOpenSelectCourse}
                                        type="primary"
                                    >
                                        {trans('tc.base.open.course.selection', '开放选课')}
                                    </Button>
                                )}

                                {isStudy && isTrue == true && (
                                    <Button
                                        style={{ marginLeft: '8px' }}
                                        className={styles.b}
                                        onClick={this.closeSelectCourse}
                                        type="primary"
                                    >
                                        {locale() == 'en' ? 'Close select course' : '结束选课'}
                                    </Button>
                                )}  */}

                                {/* {batchIndex === -1 ? ( */}
                                {chooseCoursePlanBatchList &&
                                chooseCoursePlanBatchList.length > 0 ? (
                                    <Button
                                        type="primary"
                                        className={styles.export}
                                        style={{ width: 'auto', marginRight: '10px' }}
                                        onClick={this.importSelectClass}
                                    >
                                        导入学生
                                    </Button>
                                ) : (
                                    <Popover
                                        title={null}
                                        placement="topLeft"
                                        content={trans(
                                            'global.tipTitle',
                                            '在左侧目录选择某一选课时间后方可操作'
                                        )}
                                    >
                                        <Button
                                            className={styles.export}
                                            style={{ width: 'auto', marginRight: '10px' }}
                                        >
                                            导入学生
                                        </Button>
                                    </Popover>
                                )}

                                {batchIndex === -1
                                    ? !isStudy && (
                                          <Popover
                                              title={null}
                                              placement="topLeft"
                                              content={tipTitle}
                                          >
                                              <Button>
                                                  {trans('tc.base.add.students', '添加学生')}
                                              </Button>
                                          </Popover>
                                      )
                                    : !isStudy && (
                                          <Button
                                              type="primary"
                                              // disabled={effecticveDisabled}
                                              onClick={this.toggleAddStudentModalVisible}
                                          >
                                              {trans('tc.base.add.students', '添加学生')}
                                          </Button>
                                      )}
                            </Fragment>
                        }
                    </div>
                </div>
                <div className={styles.statistics}>
                    <p className={styles.left}>
                        <span
                            onClick={() => this.stuNumChange('allStu')}
                            style={{ color: this.state.allStu == true ? 'blue' : 'black' }}
                        >
                            <b style={{ fontSize: 30, fontWeight: 'normal' }}>
                                {this.state.totalPeople}
                            </b>
                            {trans('global.all.students', '全部学生')}
                        </span>
                        <span
                            onClick={() => this.stuNumChange('reportedThree')}
                            style={{
                                color: this.state.reportedThree == true ? 'blue' : 'black',
                            }}
                        >
                            <b style={{ fontSize: 30, fontWeight: 'normal' }}>
                                {this.state.signUpCountThree}
                            </b>
                            {trans('global.three electives', '已报3个及以上')}
                        </span>
                        <span
                            onClick={() => this.stuNumChange('reportedTwo')}
                            style={{
                                color: this.state.reportedTwo == true ? 'blue' : 'black',
                            }}
                        >
                            <b style={{ fontSize: 30, fontWeight: 'normal' }}>
                                {this.state.signUpCountTwo}
                            </b>
                            {trans('global.two electives', '已报2个')}
                        </span>
                        <span
                            onClick={() => this.stuNumChange('reportedOne')}
                            style={{
                                color: this.state.reportedOne == true ? 'blue' : 'black',
                            }}
                        >
                            <b style={{ fontSize: 30, fontWeight: 'normal' }}>
                                {this.state.signUpCountOne}
                            </b>
                            {trans('global.one electives', '已报1个')}
                        </span>
                        <span
                            onClick={() => this.stuNumChange('reportedZero')}
                            style={{
                                color: this.state.reportedZero == true ? 'blue' : 'black',
                            }}
                        >
                            <b style={{ fontSize: 30, fontWeight: 'normal' }}>
                                {this.state.signUpCountZero}
                            </b>
                            {trans('global.zero electives', '已报0个')}
                        </span>
                    </p>
                    <p className={styles.right}>
                        <span
                            onClick={() => this.stuNumChange('lowerRegisterd')}
                            style={{
                                color: this.state.lowerRegisterd == true ? 'blue' : 'black',
                            }}
                        >
                            <span style={{ fontSize: 30, fontWeight: 'normal' }}>
                                {this.state.signUpCountLowLimit}
                            </span>
                            {trans('global.electives below', '人已报课程低于人数下限')}
                        </span>
                    </p>
                </div>
            </div>
        );
    }
    onChangeType = (e) => {
        this.setState({
            exportType: e.target.value,
        });
    };

    exportHandleOk = (e) => {
        const { batchStudentOrg } = this.state;
        const { selectedRowKeys, exportType } = this.state;
        this.setState({
            exportVisible: false,
        });
        // this.exportStudentChooseCourseExcel()
        let userIdList = [];
        for (let i = 0; i < selectedRowKeys.length; i++) {
            let elt = batchStudentOrg[selectedRowKeys[i]];
            // 学生Id集合
            elt && userIdList.push(elt.userDTO.userId);
        }

        const { planId } = this.state;

        window.open(
            `/api/choose/batchStudent/exportStudentChooseCourseExcel?userIds=${userIdList}&chooseCoursePlanId=${planId}&exportType=${exportType}`
        );
    };
    exportHandleCancel = (e) => {
        this.setState({
            exportVisible: false,
        });
    };

    // 导出学生选课信息
    exportBatch = () => {
        /* const { batchStudentOrg } = this.state;
        const { selectedRowKeys } = this.state;
        if (selectedRowKeys.length == 0) {
            message.info(trans('student.pleaseChooseExported', '请先选择要导出的学生~'));
            return false;
        } */
        this.setState({
            exportVisible: true,
        });
    };

    // 取消公共函数
    onCancel = (type) => {
        this.setState({
            [type]: false,
            adjustTimeBatchId: undefined, // 选课时间ID
        });
    };

    newOpenSelectCourse = () => {
        this.setState({
            newOpenSelCourseVisible: true,
        });
    };

    closeSelectCourse = () => {
        this.setState({
            closeSelCouVisible: true,
        });
    };

    // 展示弹窗公共函数
    onShowModel = (type, callback) => {
        if (type === 'addStudentModalVisible') {
            let { gradeList, classList } = this.props;
            if (!(gradeList && gradeList.length > 0 && classList && classList.length > 0)) {
                message.warn(
                    trans('tc.base.no.find.student.check', '未找到该学段下的学生，请检查学生信息')
                );
                return;
            }
        }
        this.setState({
            [type]: true,
        });
        typeof callback === 'function' && callback();
    };

    // 设置选课时间，
    setupSelectCourseTimeHTML(item, index) {
        let { isBatchEdit, startTime, endTime, closingTime, lotType } = this.state;
        const format = 'YYYY-MM-DD HH:mm';
        return (
            <div className={styles.setupSelectCourseTime}>
                <div className={styles.item}>
                    <span className={styles.title}>{trans('global.start.time', '开始时间')}</span>
                    <DatePicker
                        disabled={item && item.status == 3}
                        showTime={{ format: 'HH:mm' }}
                        placeholder={trans('course.step1.select.start.date', '请选择开始时间')}
                        value={(startTime && moment(startTime)) || null}
                        format={format}
                        onChange={this.changeTime.bind(this, 'startTime')}
                        onOk={this.changeTimeOk.bind(this, 'startTime')}
                    />
                </div>
                <div className={styles.item}>
                    <span className={styles.title}>{trans('global.end.time', '结束时间')}</span>
                    <DatePicker
                        disabled={item && item.status == 3}
                        showTime={{ format: 'HH:mm' }}
                        placeholder={trans('course.step1.select.end.date', '请选择结束时间')}
                        value={(endTime && moment(endTime)) || null}
                        format={format}
                        onChange={this.changeTime.bind(this, 'endTime')}
                        onOk={this.changeTimeOk.bind(this, 'endTime')}
                    />
                </div>
                <div className={styles.item}>
                    <span className={styles.title}>{trans('global.close.time', '关闭时间')}</span>
                    <DatePicker
                        disabled={item && item.status == 3}
                        showTime={{ format: 'HH:mm' }}
                        placeholder={trans('course.step1.select.close.date', '请选择关闭时间')}
                        value={(closingTime && moment(closingTime)) || null}
                        format={format}
                        onChange={this.changeTime.bind(this, 'closingTime')}
                        onOk={this.changeTimeOk.bind(this, 'closingTime')}
                    />
                </div>
                <div className={styles.item}>
                    <span className={styles.title}>{trans('global.lot.type', '批次类型')}</span>
                    <Radio.Group
                        onChange={this.changeType}
                        // defaultValue={item.type}
                        value={lotType}
                        className={styles.lotTypeRadio}
                    >
                        <Radio value={0} key={0}>
                            {trans('global.Selection', '选课')}
                        </Radio>
                        <Radio value={1} key={1}>
                            {trans('global.Continuation', '续课')}
                        </Radio>
                    </Radio.Group>
                </div>
                <div className={styles.operation}>
                    <div className={styles.del}>
                        {isBatchEdit && (
                            <span onClick={this.delBatch.bind(this, item, index)}>
                                <Icon type="delete" />
                                {trans('global.delete', '删除')}
                            </span>
                        )}
                    </div>
                    <div className={styles.btn}>
                        <Button
                            onClick={this.hideAllBatchTime}
                            // size="small"
                            style={{
                                color: 'rgba(1, 17, 61, 0.65)',
                                background: 'rgba(1, 17, 61, 0.07)',
                                border: 0,
                                height: '36px',
                                lineHeight: '36px',
                                borderRadius: '8px',
                            }}
                        >
                            {trans('global.cancel', '取消')}
                        </Button>
                        <Button
                            type="primary"
                            onClick={this.saveBatch.bind(this, item, index)}
                            // size="small"
                            style={{
                                background: '#3B6FF5',
                                color: '#fff',
                                height: '36px',
                                lineHeight: '36px',
                                borderRadius: '8px',
                            }}
                        >
                            {trans('global.save', '保存')}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
    // 添加选课时间，
    addSelectCourseTimeHTML(item, index) {
        let { isBatchEdit, startTime, endTime, closingTime } = this.state;
        const format = 'YYYY-MM-DD HH:mm';
        return (
            <div className={styles.setupSelectCourseTime}>
                <div className={styles.item}>
                    <span className={styles.title}>{trans('global.start.time', '开始时间')}</span>
                    <DatePicker
                        disabled={item && item.status == 3}
                        showTime={{ format: 'HH:mm' }}
                        placeholder={trans('course.step1.select.start.date', '请选择开始时间')}
                        value={(startTime && moment(startTime)) || null}
                        format={format}
                        onChange={this.changeTime.bind(this, 'startTime')}
                        onOk={this.changeTimeOk.bind(this, 'startTime')}
                    />
                </div>
                <div className={styles.item}>
                    <span className={styles.title}>{trans('global.end.time', '结束时间')}</span>
                    <DatePicker
                        disabled={item && item.status == 3}
                        showTime={{ format: 'HH:mm' }}
                        placeholder={trans('course.step1.select.end.date', '请选择结束时间')}
                        value={(endTime && moment(endTime)) || null}
                        format={format}
                        onChange={this.changeTime.bind(this, 'endTime')}
                        onOk={this.changeTimeOk.bind(this, 'endTime')}
                    />
                </div>
                <div className={styles.item}>
                    <span className={styles.title}>{trans('global.close.time', '关闭时间')}</span>
                    <DatePicker
                        disabled={item && item.status == 3}
                        showTime={{ format: 'HH:mm' }}
                        placeholder={trans('course.step1.select.close.date', '请选择关闭时间')}
                        value={(closingTime && moment(closingTime)) || null}
                        format={format}
                        onChange={this.changeTime.bind(this, 'closingTime')}
                        onOk={this.changeTimeOk.bind(this, 'closingTime')}
                    />
                </div>
                <div className={styles.item}>
                    <span className={styles.title}>{trans('global.lot.type', '批次类型')}</span>
                    <Radio.Group
                        onChange={this.onChangeAdd}
                        value={this.state.createType}
                        className={styles.lotTypeRadio}
                    >
                        <Radio value={0}>{trans('global.Selection', '选课')}</Radio>
                        <Radio value={1}>{trans('global.Continuation', '续课')}</Radio>
                    </Radio.Group>
                </div>
                <div className={styles.operation}>
                    <div className={styles.del}>
                        {isBatchEdit && (
                            <span onClick={this.delBatch.bind(this, item, index)}>
                                <Icon type="delete" />
                                {trans('global.delete', '删除')}
                            </span>
                        )}
                    </div>
                    <div className={styles.btn}>
                        <Button onClick={this.hideAllBatchTime} size="small">
                            {trans('global.cancel', '取消')}
                        </Button>
                        <Button
                            type="primary"
                            onClick={this.saveBatchAdd.bind(this, item, index)}
                            size="small"
                        >
                            {trans('global.save', '保存')}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    delBatch = (item, index) => {
        let { dispatch } = this.props;
        let { chooseCoursePlanBatchList, planId } = this.state;
        dispatch({
            type: 'choose/batchChooseCourseDelete',
            payload: {
                id: item.id,
                chooseCourseId: planId,
            },
            onSuccess: () => {
                chooseCoursePlanBatchList.splice(index, 1);
                this.setState(
                    {
                        chooseCoursePlanBatchList,
                    },
                    () => {
                        this.hideAllBatchTime();
                    }
                );
            },
        });
    };

    saveBatch = (item, index) => {
        let { dispatch } = this.props;
        let { planId, batchId, startTime, endTime, closingTime, isBatchEdit, lotType } = this.state;
        let { chooseCoursePlanBatchList } = this.state;
        let params = {
            chooseCourseId: planId,
            startTime,
            endTime,
            closingTime,
            type: lotType,
        };
        if (batchId) {
            params.id = batchId;
        }
        if (new Date(startTime).getTime() > new Date(endTime).getTime()) {
            message.warn(trans('tc.base.start.time.lessthan.end.time', '开始时间必须小于结束时间'));
            return;
        }
        if (new Date(endTime).getTime() > new Date(closingTime).getTime()) {
            message.warn(
                trans('tc.base.endTime.time.lessthan.closingTime.time', '关闭时间必须大于结束时间')
            );
            return;
        }
        if (!startTime || !endTime || !closingTime) {
            message.warn(trans('tc.base.mustTime', '请完善时间'));
            return;
        }
        dispatch({
            type: 'choose/addedOrEditChooseCoursePlanBatch',
            payload: params,
            onSuccess: () => {
                if (isBatchEdit) {
                    chooseCoursePlanBatchList[index].startTime = startTime;
                    chooseCoursePlanBatchList[index].endTime = endTime;
                    this.setState(
                        {
                            chooseCoursePlanBatchList,
                        },
                        () => {
                            this.initData();
                            this.forceUpdate();
                        }
                    );
                } else {
                    this.initData();
                }

                this.hideAllBatchTime(true);
            },
        });
    };

    saveBatchAdd = (item, index) => {
        let { dispatch } = this.props;
        let { planId, batchId, startTime, endTime, closingTime, isBatchEdit, lotType } = this.state;
        let { chooseCoursePlanBatchList } = this.state;
        let params = {
            chooseCourseId: planId,
            startTime,
            endTime,
            closingTime,
            type: lotType,
        };
        if (batchId) {
            params.id = batchId;
        }
        if (new Date(startTime).getTime() > new Date(endTime).getTime()) {
            message.warn(trans('tc.base.start.time.lessthan.end.time', '开始时间必须小于结束时间'));
            return;
        }
        if (new Date(endTime).getTime() > new Date(closingTime).getTime()) {
            message.warn(
                trans('tc.base.endTime.time.lessthan.closingTime.time', '关闭时间必须大于结束时间')
            );
            return;
        }
        if (!startTime || !endTime || !closingTime) {
            message.warn(trans('tc.base.mustTime', '请完善时间'));
            return;
        }
        dispatch({
            type: 'choose/addedOrEditChooseCoursePlanBatch',
            payload: params,
            onSuccess: () => {
                if (isBatchEdit) {
                    chooseCoursePlanBatchList[index].startTime = startTime;
                    chooseCoursePlanBatchList[index].endTime = endTime;
                    this.setState(
                        {
                            chooseCoursePlanBatchList,
                        },
                        () => {
                            this.initData();
                            this.forceUpdate();
                        }
                    );
                } else {
                    this.initData();
                }

                this.hideAllBatchTime(true);
            },
        });
    };

    saveBatchAdd = (item, index) => {
        let { dispatch } = this.props;
        let { planId, batchId, startTime, endTime, closingTime, isBatchEdit, createType } =
            this.state;
        let { chooseCoursePlanBatchList } = this.state;
        let params = {
            chooseCourseId: planId,
            startTime,
            endTime,
            closingTime,
            type: createType,
        };
        if (batchId) {
            params.id = batchId;
        }
        if (new Date(startTime).getTime() > new Date(endTime).getTime()) {
            message.warn(trans('tc.base.start.time.lessthan.end.time', '开始时间必须小于结束时间'));
            return;
        }
        if (new Date(endTime).getTime() > new Date(closingTime).getTime()) {
            message.warn(
                trans('tc.base.endTime.time.lessthan.closingTime.time', '关闭时间必须大于结束时间')
            );
            return;
        }
        if (!startTime || !endTime || !closingTime) {
            message.warn(trans('tc.base.mustTime', '请完善时间'));
            return;
        }
        dispatch({
            type: 'choose/addedOrEditChooseCoursePlanBatch',
            payload: params,
            onSuccess: () => {
                if (isBatchEdit) {
                    chooseCoursePlanBatchList[index].startTime = startTime;
                    chooseCoursePlanBatchList[index].endTime = endTime;
                    this.setState(
                        {
                            chooseCoursePlanBatchList,
                        },
                        () => {
                            this.initData();
                            this.forceUpdate();
                        }
                    );
                } else {
                    this.initData();
                }

                this.hideAllBatchTime(true);
            },
        });
    };

    changeTime = (type, value, dateString) => {
        this.setState({
            [type]: dateString,
        });
    };

    changeTimeOk = (type, value) => {
        let date = new Date(value);
        let y = date.getFullYear();
        let m = this.zero(date.getMonth() + 1);
        let d = this.zero(date.getDate());
        let h = this.zero(date.getHours());
        let min = this.zero(date.getMinutes());

        let time = `${y}-${m}-${d} ${h}:${min}`;
        this.setState({
            [type]: time,
        });
    };

    zero = (num) => {
        return num <= 9 ? `0${num}` : num;
    };

    hideAllBatchTime = (bol = false) => {
        let { visibleSetupCourseList } = this.state;
        visibleSetupCourseList.forEach((el, i) => {
            visibleSetupCourseList[i] = false;
        });

        let updateObj = {
            visibleSetupCourseList,
            isBatchEdit: false,
            visibleSetupCourse: false,
        };
        if (!bol) {
            updateObj.batchId = '';
        }

        this.setState(updateObj, () => {
            this.forceUpdate();
        });
        // 延迟注销时间，解决时间同步消失，moment的bug
        setTimeout(() => {
            this.setState({
                startTime: null,
                endTime: null,
                closingTime: null,
            });
        }, 50);
    };

    showBatchTime = (item, i) => {
        let { visibleSetupCourseList, visibleSetupCourse, isBatchEdit } = this.state;
        if (isBatchEdit || visibleSetupCourse) {
            message.warn(trans('tc.base.save.or.editing.time', '请选保存或取消正在编辑的选课时间'));
            return;
        }
        visibleSetupCourseList[i] = true;
        this.setState(
            {
                startTime: item.startTime,
                endTime: item.endTime,
                closingTime: item.closingTime ? item.closingTime : '',
                isBatchEdit: true,
                visibleSetupCourseList,
                lotType: item.type,
            },
            () => {
                this.forceUpdate();
            }
        );
    };

    isShowBatchTime = (i, id) => {
        let { isBatchEdit, visibleSetupCourse, batchIndex } = this.state;
        if (i === batchIndex) {
            return false;
        }

        if (isBatchEdit || visibleSetupCourse) {
            message.warn(trans('tc.base.save.or.editing.time', '请选保存或取消正在编辑的选课时间'));
            return;
        }
        this.setState(
            {
                batchIndex: i,
                batchId: id,
                selectedRowKeys: [],
                pageNum: 1,
            },
            () => {
                this.initStudentDetail();
            }
        );
    };

    // 全部选课
    noBatchTime = () => {
        if (this.state.batchId !== '') {
            this.setState(
                {
                    batchIndex: -1,
                    batchId: '',
                    selectedRowKeys: [],
                },
                () => {
                    this.initStudentDetail();
                }
            );
        }
    };

    leftHTML() {
        let { visibleSetupCourse, visibleSetupCourseList, chooseCoursePlanBatchList, batchIndex } =
            this.state;
        let { isAdmin, currentUser } = this.props;
        let isStudy = currentUser.schoolId == '1000001001';
        return (
            <div className={styles.left}>
                <div onClick={this.noBatchTime} className={`${styles.item} ${styles.title}`}>
                    {trans('tc.base.all.select.time', '全部选课批次')}
                </div>
                {chooseCoursePlanBatchList.length > 0 &&
                    chooseCoursePlanBatchList.map((el, i) => (
                        <Popover
                            title={null}
                            key={i}
                            visible={visibleSetupCourseList[i]}
                            placement="bottomLeft"
                            content={this.setupSelectCourseTimeHTML(el, i)}
                        >
                            <div className={styles.item}>
                                <div
                                    className={
                                        batchIndex === i
                                            ? `${styles.activeTime} ${styles.time}`
                                            : styles.time
                                    }
                                >
                                    {!isStudy && (
                                        <>
                                            <div>
                                                <span
                                                    onClick={this.isShowBatchTime.bind(
                                                        this,
                                                        i,
                                                        el.id
                                                    )}
                                                >
                                                    {el.startTime}
                                                </span>

                                                {batchIndex === i && isAdmin ? (
                                                    <Icon
                                                        onClick={this.showBatchTime.bind(
                                                            this,
                                                            el,
                                                            i
                                                        )}
                                                        type="form"
                                                    />
                                                ) : null}
                                            </div>
                                            <div
                                                onClick={this.isShowBatchTime.bind(this, i, el.id)}
                                            >
                                                {el.endTime}
                                            </div>
                                        </>
                                    )}

                                    <div style={{ color: '#999', textAlign: 'center' }}>
                                        <span>
                                            {el.num}&nbsp;{trans('global.people', '人')}
                                        </span>
                                    </div>
                                    <span className={el.status == 2 ? styles.going : null}></span>
                                </div>
                            </div>
                        </Popover>
                    ))}
                {!isStudy && (
                    // {/* {( */}
                    <Popover
                        title={null}
                        placement="bottomLeft"
                        visible={visibleSetupCourse}
                        content={this.addSelectCourseTimeHTML()}
                    >
                        <div
                            onClick={() => {
                                this.setState({
                                    batchIndex: -1,
                                    visibleSetupCourse: true,
                                    batchId: '',
                                });
                            }}
                            className={`${styles.item} ${styles.icon}`}
                        >
                            <Icon type="plus-circle" />
                            {trans('tc.base.select.batch', '选课批次')}
                        </div>
                    </Popover>
                )}
            </div>
        );
    }

    noDataHTML() {
        let {
            batchIndex,
            chooseCoursePlanBatchList,
            tipTitle,
            gradeId,
            keyword,
            status,
            creditUpLimit,
            creditLowerLimit,
            studentRange,
        } = this.state;
        let { currentUser } = this.props;
        let isStudy = currentUser.schoolId == '1000001001';
        let batchStatus = chooseCoursePlanBatchList.length === 0;
        let isSearch =
            gradeId || keyword || status || creditUpLimit || creditLowerLimit || studentRange != 2;
        return (
            <div className={styles.noData}>
                <div>
                    <img src={empty} />
                    <div className={styles.title}>
                        {batchStatus
                            ? trans(
                                  'tc.base.rule.no.student.1',
                                  '暂时没有批次，你可以在左侧创建批次之后再添加学生'
                              )
                            : !isSearch
                            ? trans(
                                  'tc.base.rule.no.student.2',
                                  '暂时没有任何参与学生，你可以点击下方按钮添加'
                              )
                            : trans('tc.base.noData', '暂无结果')}
                    </div>
                    {!batchStatus && !isSearch ? (
                        <div className={styles.btn}>
                            {batchIndex === -1
                                ? !isStudy && (
                                      <Popover title={null} placement="top" content={tipTitle}>
                                          <Button
                                              type="primary"
                                              disabled={true}
                                              style={{ width: 'auto' }}
                                          >
                                              <Icon type="plus" className={styles.icon} />
                                              <span>
                                                  {trans('tc.base.add.students', '添加学生')}
                                              </span>
                                          </Button>
                                      </Popover>
                                  )
                                : !isStudy && (
                                      <Button
                                          type="primary"
                                          onClick={this.toggleAddStudentModalVisible}
                                          style={{ width: 'auto', background: '#3B6FF5' }}
                                      >
                                          <Icon type="plus" className={styles.icon} />
                                          <span>{trans('tc.base.add.students', '添加学生')}</span>
                                      </Button>
                                  )}
                        </div>
                    ) : null}
                </div>
            </div>
        );
    }

    coursePagination = (page, pageSize) => {
        this.setState(
            {
                pageNum: page,
            },
            () => {
                this.initStudentDetail();
            }
        );
    };

    stuNumChange = (handle) => {
        if (handle == 'allStu') {
            this.state.allStu == true
                ? this.setState({ allStu: false }, () => {
                      this.initStudentDetail();
                  })
                : this.setState({ allStu: true, lowerRegisterd: false }, () => {
                      this.initStudentDetail();
                  });
        } else if (handle == 'reportedThree') {
            this.state.reportedThree == true
                ? this.setState({ reportedThree: false }, () => {
                      this.initStudentDetail();
                  })
                : this.setState({ reportedThree: true, lowerRegisterd: false }, () => {
                      this.initStudentDetail();
                  });
        } else if (handle == 'reportedTwo') {
            this.state.reportedTwo == true
                ? this.setState({ reportedTwo: false }, () => {
                      this.initStudentDetail();
                  })
                : this.setState({ reportedTwo: true, lowerRegisterd: false }, () => {
                      this.initStudentDetail();
                  });
        } else if (handle == 'reportedOne') {
            this.state.reportedOne == true
                ? this.setState({ reportedOne: false }, () => {
                      this.initStudentDetail();
                  })
                : this.setState({ reportedOne: true, lowerRegisterd: false }, () => {
                      this.initStudentDetail();
                  });
        } else if (handle == 'reportedZero') {
            this.state.reportedZero == true
                ? this.setState({ reportedZero: false }, () => {
                      this.initStudentDetail();
                  })
                : this.setState({ reportedZero: true, lowerRegisterd: false }, () => {
                      this.initStudentDetail();
                  });
        } else if (handle == 'lowerRegisterd') {
            this.state.lowerRegisterd == true
                ? this.setState({ lowerRegisterd: false }, () => {
                      this.initStudentDetail();
                  })
                : this.setState(
                      {
                          lowerRegisterd: true,
                          allStu: false,
                          reportedThree: false,
                          reportedTwo: false,
                          reportedOne: false,
                          reportedZero: false,
                      },
                      () => {
                          this.initStudentDetail();
                      }
                  );
        }
    };

    showSizeChange = (current, size) => {
        this.setState(
            {
                pageNum: 1,
                pageSize: size,
            },
            () => {
                this.initStudentDetail();
            }
        );
    };

    // 批量调整时间
    adjustTimeHTML() {
        let { visibleAdjustTime, chooseCoursePlanBatchList, adjustTimeBatchId } = this.state;
        return (
            <Modal
                title={
                    <NavTitle
                        title={trans('tc.base.adjustment.time', '调整批次')}
                        onCancel={this.onCancel.bind(this, 'visibleAdjustTime')}
                    />
                }
                className={styles.setTime}
                maskClosable={false}
                okText="确定"
                closable={false}
                visible={visibleAdjustTime}
                /* onCancel={this.onCancel.bind(this, 'visibleAdjustTime')}
                onOk={this.handleOkAdjustTime.bind(this)} */
                footer={
                    <div>
                        <Button
                            style={{
                                color: 'rgba(1, 17, 61, 0.65)',
                                background: 'rgba(1, 17, 61, 0.07)',
                                border: 0,
                                height: '36px',
                                lineHeight: '36px',
                                borderRadius: '8px',
                            }}
                            onClick={this.onCancel.bind(this, 'visibleAdjustTime')}
                        >
                            {trans('global.cancel', '取消')}
                        </Button>
                        <Button
                            style={{
                                background: '#3B6FF5',
                                color: '#fff',
                                height: '36px',
                                lineHeight: '36px',
                                borderRadius: '8px',
                            }}
                            type="primary"
                            onClick={this.handleOkAdjustTime.bind(this)}
                        >
                            {trans('course.plan.okText', '确认')}
                        </Button>
                    </div>
                }
            >
                <div className={styles.adjustTime}>
                    <span className={styles.item}>{trans('global.adjust.to', '调整到')}</span>
                    <Select
                        value={adjustTimeBatchId}
                        placeholder={trans('global.adjustTimeBatchTit', '请点击选择选课时刻')}
                        className={styles.selectStyle}
                        onChange={(value) => {
                            this.setState({
                                adjustTimeBatchId: value,
                            });
                        }}
                    >
                        {chooseCoursePlanBatchList.length > 0 &&
                            chooseCoursePlanBatchList.map((el, i) => (
                                <Option value={el.id} key={i}>
                                    <span className={styles.option}>
                                        {el.startTime}&nbsp;
                                        <span className={styles.time}>
                                            {trans('global.to', '到')}
                                        </span>
                                        &nbsp;
                                        {el.endTime}
                                    </span>
                                </Option>
                            ))}
                    </Select>
                </div>
            </Modal>
        );
    }

    newOpen = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'choose/newOpenChooseCourse',
            payload: {
                chooseCoursePlanId: this.state.planId,
            },
        }).then(() => {
            dispatch({
                type: 'choose/chooseCoursePlanBatchList',
                payload: {
                    id: this.state.planId,
                },
            });
            this.setState({
                isShowClose: true,
                newOpenSelCourseVisible: false,
            });
        });
    };

    closeSelection = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'choose/goodCloseChooseCourse',
            payload: {
                chooseCoursePlanId: this.state.planId,
            },
        }).then(() => {
            this.setState({
                closeSelCouVisible: false,
            });
        });
    };

    // 加课
    addCourseHTML() {
        let { visibleAddCourse } = this.state;
        return (
            <Modal
                title={
                    <NavTitle
                        title={trans('tc.base.add.course', '加课')}
                        onCancel={this.onCancel.bind(this, 'visibleAddCourse')}
                    />
                }
                className={styles.addCourse}
                maskClosable={false}
                okText={trans('tc.base.confirm.select', '确认选中')}
                closable={false}
                visible={visibleAddCourse}
                o /* nCancel={this.onCancel.bind(this, 'visibleAddCourse')}
                onOk={this.handleOkAddCourse} */
                footer={
                    <div>
                        <Button
                            onClick={this.onCancel.bind(this, 'visibleAddCourse')}
                            style={{
                                color: 'rgba(1, 17, 61, 0.65)',
                                background: 'rgba(1, 17, 61, 0.07)',
                                border: 0,
                                height: '36px',
                                lineHeight: '36px',
                                borderRadius: '8px',
                            }}
                        >
                            {trans('global.cancel', '取消')}
                        </Button>
                        <Button
                            // onClick={() => this.handleOkAddCourse()}
                            onClick={this.onCancel.bind(this, 'visibleAddCourse')}
                            /* style={{
                                background: '#3B6FF5',
                                color: '#fff',
                                height: '36px',
                                lineHeight: '36px',
                                borderRadius: '8px',
                            }} */
                            style={{
                                background: '#3B6FF5',
                                color: '#fff',
                                height: '36px',
                                lineHeight: '36px',
                                borderRadius: '8px',
                            }}
                            type="primary"
                        >
                            {trans('course.plan.okText', '确认')}
                        </Button>
                    </div>
                }
            >
                正在开发中。。。。。。
            </Modal>
        );
    }

    // 开放选课
    openCourseHTML() {
        let { visibleOpenCourse, chooseCoursePlanBatchList, isOpenCourse, coursePlanId } =
            this.state;
        let columns = [
            {
                title: trans('tc.base.select.batch', '选课批次'),
                dataIndex: 'time',
                key: 'time',
                align: 'center',
                render: (tag, item) => (
                    <div>
                        <div className={styles.item}>
                            {trans('global.start', '起')}:{item.startTime}
                        </div>
                        <div className={styles.item}>
                            {trans('global.end', '止')}:{item.endTime}
                        </div>
                    </div>
                ),
            },
            {
                title: trans('course.setup.course.status', '状态'),
                dataIndex: 'status',
                key: 'status',
                align: 'center',
                render: (tag) => (
                    <div className={styles.item}>
                        {tag === 1
                            ? trans('select.student.notOpen', '未开放')
                            : tag === 2
                            ? trans('global.Published', '已发布')
                            : trans('global.In force', '已生效')}
                    </div>
                ),
            },
            {
                title: trans('tc.base.join.student.number', '参与学生'),
                dataIndex: 'num',
                key: 'num',
                align: 'center',
            },
            {
                title: trans('student.opeation', '操作'),
                dataIndex: 'operation',
                key: 'operation',
                align: 'center',
                render: (tag, item, index) => (
                    // this.props.chooseCoursePlanBatchList &&
                    // this.props.chooseCoursePlanBatchList[index].status == 2 ? (
                    <div>
                        {item.status === 1 ? (
                            <div
                                onClick={this.handleOkOpenCourse.bind(this, item)}
                                className={
                                    isOpenCourse && coursePlanId == item.id
                                        ? styles.item
                                        : styles.active
                                }
                            >
                                {isOpenCourse && coursePlanId == item.id
                                    ? trans('global.open selection', '开放选课处理中')
                                    : trans('tc.base.open.course.selection', '开放选课')}
                            </div>
                        ) : item.status === 2 ? (
                            <div></div>
                        ) : (
                            <div className={styles.item}>
                                {trans('tc.base.open.course.selection', '开放选课')}
                            </div>
                        )}
                    </div>
                ),
                // )
                // : (
                //     ''
                // );
                // },
            },
        ];
        return (
            <Modal
                title={
                    <NavTitle
                        title={trans('tc.base.open.course.selection', '开放选课')}
                        onCancel={this.onCancel.bind(this, 'visibleOpenCourse')}
                    />
                }
                maskClosable={false}
                closable={false}
                footer={null}
                visible={visibleOpenCourse}
                width="50%"
                className={styles.openSelect}
            >
                <div className={styles.openCourse}>
                    <Table
                        columns={columns}
                        dataSource={chooseCoursePlanBatchList}
                        pagination={false}
                    />
                    <div className={styles.btn}>
                        <Button
                            onClick={this.onCancel.bind(this, 'visibleOpenCourse')}
                            type="primary"
                        >
                            {trans('global.finish', '完成')}
                        </Button>
                    </div>
                </div>
            </Modal>
        );
    }

    // 一键选报
    oneClickSelectHTML() {
        let { visibleOneClick, calculationResult } = this.state;
        return (
            <Modal
                title={null}
                maskClosable={false}
                closable={false}
                footer={null}
                visible={visibleOneClick}
            >
                <div className={styles.oneClickSelect}>
                    <div className={styles.load}>
                        <Load />
                    </div>
                    <div className={styles.item}>
                        系统正在计算中......已完成 {calculationResult}%
                    </div>
                </div>
            </Modal>
        );
    }

    // 点击一键选报时的回调函数
    oneClickSelectCallback = () => {};

    // 批量调整时间
    handleOkAdjustTime() {
        let { dispatch } = this.props;
        let self = this;
        let { selectedRowKeys, adjustTimeBatchId, studentIndex, batchStudentOrg } = self.state;
        if (!adjustTimeBatchId) {
            message.warn(trans('tc.base.adjust.batch', '请选择要调整的批次'));
            return;
        }

        let params = {
            newBatchId: adjustTimeBatchId,
        };

        // 单个调整学生
        if (studentIndex !== -1) {
            let elt = batchStudentOrg[studentIndex];
            params.userIdList = [elt.userDTO.userId];
            params.oldBatchId = elt.bacthId;
            if (adjustTimeBatchId == elt.bacthId) {
                message.warn(trans('tc.base.forbidden.save.operate', '禁止同批次操作'));
                return;
            }
        } else {
            // 批量调整学生
            let batchId = '';
            let list = [];
            for (let i = 0; i < selectedRowKeys.length; i++) {
                let elt = batchStudentOrg[selectedRowKeys[i]];

                if (i === 0) batchId = elt.bacthId;

                // 学生Id集合
                list.push(elt.userDTO.userId);
            }
            params.userIdList = list;
            params.oldBatchId = batchId;

            if (adjustTimeBatchId == batchId) {
                message.warn(trans('tc.base.forbidden.save.operate', '禁止同批次操作'));
                return;
            }
        }

        dispatch({
            type: 'courseTeacherDetail/batchTransferStudent',
            payload: params,
            onSuccess: () => {
                self.setState(
                    {
                        adjustTimeBatchId: undefined,
                        selectedRowKeys: [],
                        studentIndex: -1,
                        visibleAdjustTime: false,
                        // batchStudentOrg
                    },
                    () => {
                        self.initStudentDetail();
                    }
                );
            },
        });
    }

    // 开放选课权限
    handleOkOpenCourse = (item) => {
        if (new Date().getTime() >= new Date(item.endTime).getTime()) {
            message.warn(trans('tc.base.time.passed.no.open', '时间已过，不允许开放选课'));
            return;
        }

        let { dispatch, currentUser } = this.props;
        let { chooseCoursePlanBatchList } = this.state;
        let self = this;
        Modal.confirm({
            title: trans('tc.base.sure.open.course', '您确定要开放选课嘛？'),
            icon: null,
            className: styles.removeContainer,
            content: (
                <span>
                    {trans(
                        'tc.base.rule.no.student.3',
                        '开放后，当前选课计划对学生可见，选课时间到达后，系统将自动开启选课'
                    )}
                </span>
            ),
            onOk: () => {
                self.setState(
                    {
                        isOpenCourse: true,
                        coursePlanId: item.id,
                    },
                    () => {
                        dispatch({
                            type: 'courseTeacherDetail/openChooseCourse',
                            payload: {
                                batchId: item.id,
                                schoolId: currentUser.schoolId,
                            },
                            onSuccess: (bol) => {
                                if (bol) {
                                    chooseCoursePlanBatchList[item.index].status = 3;
                                    self.setState({
                                        chooseCoursePlanBatchList,
                                        visibleOpenCourse: false,
                                        isOpenCourse: false,
                                        coursePlanId: '',
                                    });
                                }
                            },
                        }).then(() => {
                            self.setState({
                                isOpenCourse: false,
                            });
                        });
                    }
                );
            },
            okText: trans('tc.base.confirm.open', '确认开放'),
            cancelText: trans('global.cancel', '取消'),
        });
    };

    // 学生列表综合区域
    comprehensiveHTML() {
        let {
            tableWidthX,
            columns,
            batchStudentOrg,
            total,
            pageSize,
            pageNum,
            firstLoad,
            loadTableData,
            selectedRowKeys,
        } = this.state;
        let rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys,
                    selectedRows,
                });
            },
        };
        return (
            <div>
                {firstLoad ? (
                    <Fragment>
                        <Skeleton active />
                        <Skeleton active />
                    </Fragment>
                ) : (
                    <Fragment>
                        {total === 0 ? (
                            this.noDataHTML()
                        ) : (
                            <Fragment>
                                <Table
                                    // title = {() => <Checkbox>全选</Checkbox>}
                                    loading={{
                                        indicator: <Icon type="loading" />,
                                        spinning: loadTableData,
                                        tip: 'Trying to load...',
                                    }}
                                    bordered
                                    columns={columns}
                                    scroll={{ x: tableWidthX }}
                                    rowSelection={rowSelection}
                                    dataSource={batchStudentOrg}
                                    pagination={{
                                        showSizeChanger: true,
                                        pageSizeOptions: ['10', '30', '50', '100', '1000'],
                                        pageSize: pageSize,
                                        current: pageNum,
                                        onChange: this.coursePagination.bind(this),
                                        onShowSizeChange: this.showSizeChange.bind(this),
                                        total: total,
                                    }}
                                />
                            </Fragment>
                        )}
                    </Fragment>
                )}
            </div>
        );
    }

    importSelectClass = () => {
        this.setState({
            isUploading: false,
            importClassModalVisible: true,
            classFileList: [],
        });
    };

    reUpload = () => {
        let cancelBtn = document.getElementsByClassName('anticon-delete')[0];
        cancelBtn.click();
        this.setState({ checkModalVisibility: false });
    };

    sureImportClass = (e) => {
        let { classFileList, planId, batchId } = this.state;
        let formData = new FormData();
        for (let item of classFileList) {
            formData.append('file', item);
            formData.append('chooseCoursePlanId', planId);
            formData.append('batchId', batchId);
        }
        if (!isEmpty(classFileList)) {
            this.setState({
                isUploading: true,
            });
            this.props
                .dispatch({
                    type: 'courseTeacherDetail/importClass',
                    payload: formData,
                })
                .then(() => {
                    let importClassList = this.props.importClassList;
                    this.setState({
                        isUploading: false,
                    });
                    if (!isEmpty(importClassList)) {
                        // message.success(trans('global.scheduleImportSuccess', '导入成功'));
                        this.setState({
                            errorListModalVisible: true,
                        });
                    } else {
                        /* this.setState({
                            errorListModalVisible: true,
                        }); */
                    }
                    this.setState(
                        {
                            classFileList: [],
                            importClassModalVisible: false,
                        },
                        () => {
                            this.initStudentDetail();
                        }
                    );
                });
        }
    };

    toggleCancelSignUpVisible = () => {
        const { cannelVisible } = this.state;
        this.setState({
            cannelVisible: !cannelVisible,
        });
    };

    toggleAddStudentModalVisible = () => {
        const { addStudentModalVisible } = this.state;
        this.setState({
            addStudentModalVisible: !addStudentModalVisible,
        });
    };

    addStudentConfirm = (studentIdList) => {
        let { dispatch } = this.props;
        const { planId, batchId } = this.state;
        if (studentIdList.length === 0) {
            message.warn(trans('tc.base.check.add.student', '请先勾选要添加的学生'));
            return;
        }
        return dispatch({
            type: 'courseTeacherDetail/addStudent',
            payload: {
                planId,
                batchId,
                userIdList: studentIdList,
            },
        }).then(() => {
            this.resetData();
        });
    };

    render() {
        let {
            addStudentModalVisible,
            visibleTimetable,
            studentInfor,
            batchId,
            newOpenSelCourseVisible,
            closeSelCouVisible,
            delVisible,
            cannelVisible,
            info,
        } = this.state;
        let { gradeList, classList, addStudentGradeList, chooseCourseDetails } = this.props;

        return (
            <div className={styles.Student}>
                <AutoHeight ref="AutoHeight">
                    {this.leftHTML()}
                    <div className={styles.right}>
                        {this.searchHTML()}
                        {this.comprehensiveHTML()}
                    </div>
                </AutoHeight>

                {/* 课表详情 */}
                <Timetable
                    visibleTimetable={visibleTimetable}
                    data={studentInfor} // 学生所有信息
                    hideModal={this.hideModal}
                />

                {/* 批量调整时间 */}
                {this.adjustTimeHTML()}

                {/* 批量加课 */}
                {this.addCourseHTML()}

                {/* 添加学生 */}
                {/*   {gradeList && gradeList.length > 0 && classList && classList.length > 0 && (
                    <AddStudent
                        visibleAddStudent={addStudentModalVisible}
                        gradeList={addStudentGradeList}
                        classList={classList}
                        batchId={batchId}
                        self={this}
                        resetData={this.resetData}
                        hideModal={this.hideModal}
                    />
                )} */}

                {/* 新的添加学生组件 */}
                {addStudentModalVisible && (
                    <AddStudent
                        semesterValue={chooseCourseDetails.semesterModel.id}
                        visible={addStudentModalVisible}
                        toggleVisible={this.toggleAddStudentModalVisible}
                        addStudentConfirm={this.addStudentConfirm}
                    />
                )}

                {/* 开放选课 */}
                {this.openCourseHTML()}

                {/* 一键选报 */}
                {this.oneClickSelectHTML()}

                {delVisible && (
                    <Modal
                        visible={delVisible}
                        title="确认删除该学生的报名记录吗"
                        onOk={this.checkedStatus.bind(this, info, 1, 1, 1)}
                        onCancel={() => {
                            this.setState({
                                delVisible: false,
                            });
                        }}
                    ></Modal>
                )}
                {/* {cannelVisible && (
                    <Modal
                        visible={cannelVisible}
                        title="确认取消该学生报名的课程吗"
                        onOk={this.cannelCourse}
                        onCancel={() => {
                            this.setState({
                                cannelVisible: false,
                            });
                        }}
                    ></Modal>
                )} */}

                {cannelVisible && (
                    <CancelSignUp
                        visible={cannelVisible}
                        toggleCancelSignUpVisible={this.toggleCancelSignUpVisible}
                        getStudentTable={() => this.initStudentDetail(true)}
                        record={info}
                        chooseCoursePlanId={this.state.planId}
                        flag={2}
                    />
                )}

                <Modal
                    visible={newOpenSelCourseVisible}
                    title="开放选课"
                    footer={
                        <div>
                            <Button
                                className={styles.cancel}
                                onClick={() =>
                                    this.setState({
                                        newOpenSelCourseVisible: false,
                                    })
                                }
                                style={{
                                    color: 'rgba(1, 17, 61, 0.65)',
                                    background: 'rgba(1, 17, 61, 0.07)',
                                    border: 0,
                                    height: '36px',
                                    lineHeight: '36px',
                                    borderRadius: '8px',
                                }}
                            >
                                {trans('global.cancel', '取消')}
                            </Button>
                            <Button
                                className={styles.sure}
                                type="primary"
                                onClick={this.newOpen}
                                style={{
                                    background: '#3B6FF5',
                                    color: '#fff',
                                    height: '36px',
                                    lineHeight: '36px',
                                    borderRadius: '8px',
                                    width: 'auto',
                                }}
                            >
                                确认开放选课
                            </Button>
                        </div>
                    }
                >
                    <p>开放选课后，当前选课计划中已上架的课程将会在学生端的选课列表中出现</p>
                </Modal>

                <Modal
                    visible={closeSelCouVisible}
                    title="结束选课"
                    footer={
                        <div>
                            <Button
                                className={styles.cancel}
                                onClick={() =>
                                    this.setState({
                                        closeSelCouVisible: false,
                                    })
                                }
                                style={{
                                    color: 'rgba(1, 17, 61, 0.65)',
                                    background: 'rgba(1, 17, 61, 0.07)',
                                    border: 0,
                                    height: '36px',
                                    lineHeight: '36px',
                                    borderRadius: '8px',
                                }}
                            >
                                {trans('global.cancel', '取消')}
                            </Button>
                            <Button
                                className={styles.sure}
                                type="primary"
                                onClick={this.closeSelection}
                                style={{
                                    background: '#3B6FF5',
                                    color: '#fff',
                                    height: '36px',
                                    lineHeight: '36px',
                                    borderRadius: '8px',
                                    width: 'auto',
                                }}
                            >
                                确认结束选课
                            </Button>
                        </div>
                    }
                >
                    <p>结束选课后，当前选课计划中的全部课程将不再显示在家长端的课程列表中</p>
                </Modal>
            </div>
        );
    }
}

module.exports = Student;
