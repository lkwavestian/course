import React, { Fragment } from 'react';
import styles from './student.less';
import AutoHeight from './autoHeight';
import {
    Button,
    Icon,
    Input,
    Table,
    Pagination,
    Divider,
    Popover,
    message,
    Modal,
    Select,
    InputNumber,
    Menu,
    Dropdown,
    Radio,
} from 'antd';
// import AddStudent from '../../components/CourseTeacherDetail/component/addStudentOfClass';
import AddStudent from '../CommonModal/AddStudent';
import { connect } from 'dva';
import { getUrlSearch } from '../../utils/utils';
import MenuInner from '../CourseTeacherDetail/component/menuInner';
import ClassDetail from './classDetail';
import NavTitle from '../CourseTeacherDetail/component/navTitle';
import CancelSignUp from '../CommonModal/CancelSignUp';
import { trans, locale } from '../../utils/i18n';
import { stringify } from 'qs';
import { isEmpty } from 'lodash';

const { Option } = Select;

@connect((state) => ({
    classList: state.courseBaseDetail.classList,
    studentDetailContent: state.courseBaseDetail.studentDetailContent,
    groupDetailContent: state.courseBaseDetail.groupDetailContent,
    paymentNotice: state.courseBaseDetail.paymentNotice,
    chooseCourseDetails: state.choose.chooseCourseDetails,
    currentUser: state.global.currentUser,
    showCoursePlanningDetail: state.course.showCoursePlanningDetail,
}))
class Student extends React.PureComponent {
    state = {
        addStudentModalVisible: false, // 添加学生弹窗默认是隐藏
        classId: getUrlSearch('classId'), // 班级id存储
        studentFlag: getUrlSearch('classId') ? 0 : 1, // 是否查询全部学生
        keyWord: '', // 关键字查询
        total: 0,
        page: 1,
        pageSize: 50,
        studentList: [], // 列表
        classList: [], // 班级列表
        classDetail: {}, // 班级详情
        visibleClassDetail: getUrlSearch('classId') ? true : false, // 控制班级详情是否展示，选择全部班级不展示
        chooseCoursePlanId: getUrlSearch('chooseCoursePlanId'),
        coursePlanningId: getUrlSearch('coursePlanningId'),
        classIndex: -1, // 班级切换时的下角标
        stuIndex: 0, // 学生列表tab切换下角标
        // disableStatus: false, // 默认是全部的
        disableStatus: true,
        loading: false, // 每次加载请求
        classIdList: [], // 全部班级集合
        selectedRowKeys: [], // 批量被选中的学生集合
        visibleTransformStudent: false, // 转移学生弹窗
        transformClassId: undefined, // 转移班级ID
        index: -1, // 默认是点击第一个学生
        tipTitle: trans('global.firstTitle', '在左侧目录选择某一班级后方可操作'),
        effecticveDisabled: false,
        courseType: '', // 选课类型
        isMultiple: false, // 转移是否批量操作
        selectedRows: [], // 批量选择学生userId list
        isTransferLoad: false,
        classFeeForOrder: '',
        materialsFeeForOrder: '',
        paymentNoticeVisible: false, // 发起缴费visible
        paymentNoticeConfirmVisible: false,
        paymentNoticeConfirmFailVisible: false,
        currentRecord: null,
        cancelSignUpVisible: false,
    };

    componentDidMount() {
        this.getGroupList();
        this.getClassDetail();
        this.getStudentTable();
        this.getEffective();
    }

    // 获取选课结果生效
    getEffective = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'choose/chooseCourseDetails',
            payload: {
                id: this.state.chooseCoursePlanId,
            },
        }).then(() => {
            const { chooseCourseDetails } = this.props;
            this.setState({
                effecticveDisabled: chooseCourseDetails && chooseCourseDetails.effectiveType,
            });
        });
    };

    // 获取班级列表
    getGroupList = () => {
        const { dispatch } = this.props;
        const { chooseCoursePlanId, coursePlanningId, classId } = this.state;
        dispatch({
            type: 'courseBaseDetail/getCourseResultDetails',
            payload: {
                chooseCoursePlanId,
                coursePlanningId,
            },
        }).then(() => {
            let { classList } = this.props.classList;
            if (classList && classList.length > 0) {
                classList.forEach((el, i) => {
                    if (el.id == classId) {
                        this.setState({
                            classIdList: [el.id],
                            classIndex: i,
                        });
                    }
                });
                this.setState({
                    classList,
                });
            }
        });
    };

    // 获取学生列表
    getStudentTable = (bol = true) => {
        const { dispatch } = this.props;
        const {
            classId,
            keyWord,
            studentFlag,
            chooseCoursePlanId,
            coursePlanningId,
            pageSize,
            page,
            disableStatus,
            stuIndex,
        } = this.state;
        if (bol) {
            this.setState({
                loading: true,
            });
        }
        let params = {
            chooseCoursePlanId,
            coursePlanningId,
            classId,
            studentFlag,
            keyWord,
            pageSize,
            pageNum: page,
        };
        if (disableStatus) {
            if (stuIndex === 0) {
                params.status = 1;
            } else {
                params.status = 0;
            }
            if (stuIndex === 2) {
                params.status = 2;
            }
        }
        dispatch({
            type: 'courseBaseDetail/getClassStudentList',
            payload: params,
        }).then(() => {
            const { studentList, total, type } = this.props.studentDetailContent;
            let list = studentList && studentList.map((el, i) => ({ ...el, key: i, index: i }));
            this.setState({
                studentList: list,
                total,
                loading: false,
                courseType: type,
            });
        });
    };

    // 获取班级详情
    getClassDetail = () => {
        const { dispatch } = this.props;
        const { classId, chooseCoursePlanId, coursePlanningId } = this.state;
        if (!classId) {
            return;
        }
        dispatch({
            type: 'courseBaseDetail/getCourseClassDetails',
            payload: {
                chooseCoursePlanId,
                coursePlanningId,
                classId,
            },
        }).then(() => {
            const { groupDetailContent } = this.props;
            this.setState({
                classDetail: groupDetailContent,
            });
        });
    };

    hideModal = (type) => {
        switch (type) {
            case 'addStudentModalVisible':
                this.setState({
                    addStudentModalVisible: false,
                });
                break;
            default:
                break;
        }
    };

    // 切换班级
    handleClass = (classId, i) => {
        let { classList } = this.state;
        let classIdList = [];
        classList.forEach((el) => classIdList.push(el.id));

        this.setState(
            {
                studentFlag: i === -1 ? 1 : 0,
                classId,
                classIndex: i,
                page: 1,
                visibleClassDetail: i === -1 ? false : true,
                classIdList: i === -1 ? classIdList : [classId],
            },
            () => {
                this.getStudentTable();
                if (i !== -1) {
                    this.getClassDetail();
                }
            }
        );
    };

    // 班级筛选列表
    classListHTML = () => {
        const { classIndex, classList } = this.state;
        return (
            <div className={styles.classList}>
                <span
                    className={`${styles.item} ${classIndex === -1 ? `${styles.active}` : null}`}
                    onClick={this.handleClass.bind(this, null, -1)}
                >
                    {trans('course.plan.class', '全部班级')}
                </span>
                {classList.length > 0 &&
                    classList.map((item, i) => (
                        <span
                            className={`${styles.item} ${
                                classIndex === i ? `${styles.active}` : null
                            }`}
                            key={item.id}
                            onClick={this.handleClass.bind(this, item.id, i)}
                            title={locale() != 'en' ? item.name : item.englishName}
                        >
                            {locale() != 'en' ? item.name : item.englishName}
                        </span>
                    ))}
            </div>
        );
    };

    // 根据选中状态筛选
    switchActive = (i) => {
        let { stuIndex, disableStatus } = this.state;
        if (stuIndex === i) {
            this.setState(
                {
                    disableStatus: !disableStatus,
                },
                () => {
                    this.getStudentTable();
                }
            );
        } else {
            this.setState(
                {
                    stuIndex: i,
                    disableStatus: true,
                },
                () => {
                    this.getStudentTable();
                }
            );
        }
    };

    // 关键字查询
    handlePreeEnter = (e) => {
        this.setState(
            {
                keyWord: e.target.value,
                page: 1,
            },
            () => {
                this.getStudentTable();
            }
        );
    };

    // 批量操作
    switchStatus = (i) => {
        let { selectedRowKeys } = this.state;
        if (selectedRowKeys.length === 0) {
            message.warn(trans('global.checked.student', '请先勾选要批量操作的学生'));
            return;
        }

        if (i === 0) {
            this.removeStudent(2);
        } else if (i === 1) {
            this.transformMultipleStudent();
        } else {
            this.studentTypeChange();
        }
    };

    removeStudent = (type, item) => {
        let { dispatch } = this.props;
        let self = this;
        let { selectedRowKeys, chooseCoursePlanId, studentList, coursePlanningId } = this.state;
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
                // 单个移除学生
                let params = {
                    planId: chooseCoursePlanId,
                    coursePlanningId,
                };
                if (type === 1) {
                    params.userList = [
                        {
                            userId: studentList[item.index].userId,
                            classId: studentList[item.index].classId,
                        },
                    ];
                } else if (type === 2) {
                    // 批量移除学生
                    let list = [];
                    for (let i = 0; i < selectedRowKeys.length; i++) {
                        let elt = studentList[selectedRowKeys[i]];
                        if (elt.joinType == 2) {
                            list.push({
                                userId: elt.userId,
                                classId: elt.classId,
                            });
                        }
                    }
                    if (list.length === 0) {
                        message.warn(
                            trans(
                                'course.basedetail.selected.not.removed.student',
                                '选中的学生中全都是非教师添加，禁止移除'
                            )
                        );
                        return;
                    }

                    params.userList = list;
                }

                dispatch({
                    type: 'courseBaseDetail/classStudentsBatchRemoval',
                    payload: params,
                }).then(() => {
                    self.setState(
                        {
                            page: 1,
                            selectedRowKeys: [],
                        },
                        () => {
                            this.getStudentTable();
                        }
                    );
                });
            },
            okText: trans('course.basedetail.confirm.remove', '确认移除'),
            cancelText: trans('global.cancel', '取消'),
        });
    };

    // 转移学生
    transformStudent = (item) => {
        this.setState({
            visibleTransformStudent: true,
            index: item.index,
            isMultiple: false,
        });
    };

    // 批量转移
    transformMultipleStudent = () => {
        this.setState({
            visibleTransformStudent: true,
            isMultiple: true,
        });
    };

    // 取消公共函数
    onCancel = (type) => {
        this.setState({
            [type]: false,
        });
    };

    transformStudentHTML() {
        let { visibleTransformStudent, classList, transformClassId, isTransferLoad } = this.state;
        return (
            <Modal
                title={
                    <NavTitle
                        title={trans('course.basedetail.transfer.student', '转移学生')}
                        onCancel={this.onCancel.bind(this, 'visibleTransformStudent')}
                    />
                }
                maskClosable={false}
                okText={trans('global.confirm', '确定')}
                closable={false}
                visible={visibleTransformStudent}
                onCancel={this.onCancel.bind(this, 'visibleTransformStudent')}
                onOk={this.handleOkTransformStudent.bind(this)}
                okButtonProps={{ loading: isTransferLoad }}
            >
                <div className={styles.adjustTime}>
                    <span className={styles.item}>
                        {trans('course.basedetail.transfer.to', '转移到')}
                    </span>
                    <Select
                        value={transformClassId}
                        placeholder={trans(
                            'course.basedetail.select.transfer.student',
                            '请选择要转移的班级'
                        )}
                        className={styles.selectStyle}
                        onChange={(value) => {
                            this.setState({
                                transformClassId: value,
                            });
                        }}
                    >
                        {classList.length > 0 &&
                            classList.map((el, i) => (
                                <Option value={el.id} key={i}>
                                    <span className={styles.option}>
                                        {locale() != 'en' ? el.name : el.englishName}
                                    </span>
                                </Option>
                            ))}
                    </Select>
                </div>
            </Modal>
        );
    }

    handleOkTransformStudent = () => {
        let {
            chooseCoursePlanId,
            transformClassId,
            index,
            studentList,
            coursePlanningId,
            isMultiple,
            selectedRows,
        } = this.state;
        let { dispatch } = this.props;
        if (index && studentList[index] && studentList[index].classId == transformClassId) {
            message.warn(trans('course.basedetail.no.need.to.transfer', '同班级无需转移'));
            return;
        }

        // 集合所选学生userId和classId
        let arr = [];
        if (isMultiple) {
            // 批量
            for (let i = 0; i < selectedRows.length; i++) {
                arr.push({
                    userId: selectedRows[i].userId,
                    classId: selectedRows[i].classId,
                });
            }
        } else {
            arr.push({
                userId: studentList[index].userId,
                classId: studentList[index].classId,
            });
        }
        this.setState(
            {
                isTransferLoad: true,
            },
            () => {
                dispatch({
                    type: 'courseBaseDetail/studentsClassTransfer',
                    payload: {
                        planId: chooseCoursePlanId,
                        userList: arr,
                        newClassId: transformClassId,
                        coursePlanningId,
                    },
                }).then(() => {
                    this.setState(
                        {
                            page: 1,
                            visibleTransformStudent: false,
                            transformClassId: undefined,
                            isMultiple: false,
                            selectedRowKeys: [],
                            selectedRows: [],
                            isTransferLoad: false,
                        },
                        () => {
                            this.getStudentTable();
                            this.setState({
                                isTransferLoad: false,
                            });
                        }
                    );
                });
            }
        );
    };

    // 筛选及按钮操作
    tabAndSearchHTML() {
        const { selectedCount, applyCount, cancelCount } = this.props.studentDetailContent;
        const { stuIndex, disableStatus, keyWord, classIndex, tipTitle, effecticveDisabled } =
            this.state;
        let { isAdmin } = this.props;

        const { chooseCoursePlanId, classId, coursePlanningId } = this.state;
        let params = {
            chooseCoursePlanId,
            coursePlanningId,
            classId: classId ? classId : '',
            studentFlag: classId ? 0 : 1,
        };
        return (
            <div>
                <div className={styles.header}>
                    <span className={styles.title}>
                        {trans('course.basedetail.student.list', '学生列表')}
                    </span>
                    {[selectedCount, applyCount, cancelCount].map((el, i) => (
                        <span
                            key={i}
                            className={`${styles.item} ${
                                disableStatus && stuIndex === i ? styles.active : null
                            }`}
                            onClick={this.switchActive.bind(this, i)}
                        >
                            <span className={styles.number}> {el || 0} </span>
                            <span className={styles.text}>
                                {i === 0
                                    ? trans('course.basedetail.selected', '已选中')
                                    : i === 1
                                    ? trans('course.basedetail.registered', '已报名')
                                    : '已取消'}
                            </span>
                        </span>
                    ))}
                </div>
                <div className={styles.screenAndAction}>
                    <span className={styles.input}>
                        <Input
                            style={{ width: 210 }}
                            placeholder={trans(
                                'course.basedetail.enter.name.or.number',
                                '请输入姓名或学号回车搜索'
                            )}
                            value={keyWord}
                            onChange={(e) => {
                                this.setState({
                                    keyWord: e.target.value,
                                });
                            }}
                            onPressEnter={this.handlePreeEnter}
                        />
                    </span>
                    <span className={styles.operation}>
                        {isAdmin && stuIndex !== 2 && (
                            <Fragment>
                                <MenuInner
                                    title={trans('course.basedetail.batch.operation', '批量操作')}
                                    menuItem={[
                                        // trans('course.basedetail.remove', '移除'),
                                        '删除报名记录',
                                        // trans('global.transfer', '转移'),
                                        '转到其他班',
                                        '设置学员类型',
                                    ]}
                                    switchStatus={this.switchStatus.bind(this)}
                                    // effecticveDisabled={effecticveDisabled}
                                    effecticveDisabled={false}
                                />

                                {/* <Button>导出列表</Button> */}
                                {classIndex === -1 ? (
                                    <Popover title={null} placement="topLeft" content={tipTitle}>
                                        <Button disabled>
                                            {trans('course.basedetail.add.student', '添加学生')}
                                        </Button>
                                    </Popover>
                                ) : (
                                    <Button
                                        type="primary"
                                        // disabled={effecticveDisabled}
                                        onClick={this.toggleAddStudentModalVisible}
                                    >
                                        <Icon type="plus" />
                                        {trans('course.basedetail.add.student', '添加学生')}
                                    </Button>
                                )}
                            </Fragment>
                        )}
                        <Button
                            href={`/api/choose/choosePlan/chooseExportCourseStudent?${stringify(
                                params
                            )}`}
                            target="blank"
                        >
                            {trans('global.AddStudentExport', '导出')}
                        </Button>
                    </span>
                </div>
            </div>
        );
    }

    // 切换页面
    changePage = (page, pageSize) => {
        this.setState(
            {
                page,
            },
            () => {
                this.getStudentTable();
            }
        );
    };

    // 切换每页显示条数
    onShowSizeChange = (current, pageSize) => {
        this.setState(
            {
                page: 1,
                pageSize,
            },
            () => {
                this.getStudentTable();
            }
        );
    };

    selectStu = (item) => {
        let { studentList, chooseCoursePlanId, effecticveDisabled } = this.state;
        let self = this;
        let { dispatch } = this.props;
        Modal.confirm({
            title: trans('course.basedetail.operation.student.status', '操作学生状态'),
            className: styles.removeContainer,
            content: (
                <span className={styles.title}>
                    {item.status === 1
                        ? trans('course.basedetail.is.deselect', '是否取消选中')
                        : trans('course.basedetail.is.selected', '是否设为选中')}
                </span>
            ),
            onOk: () => {
                dispatch({
                    type: 'courseBaseDetail/uncheckAndCheck',
                    payload: {
                        chooseCoursePlanId,
                        userId: item.userId,
                        id: item.id,
                        classId: item.classId,
                        flag: item.status == 1 ? 0 : 1,
                    },
                }).then(() => {
                    self.getStudentTable(false);
                });
            },
            okText: trans('global.confirm', '确认'),
            cancelText: trans('global.cancel', '取消'),
        });
    };

    getColums() {
        let {
            isAdmin,
            currentUser,
            chooseCourseDetails: { choosePayType },
        } = this.props;
        const { effecticveDisabled, courseType, stuIndex } = this.state;
        let disabledAction = effecticveDisabled ? styles.disabled : '';
        if (stuIndex === 2) {
            return [
                {
                    title: trans('student.name', '姓名'),
                    dataIndex: 'name',
                    key: 'name',
                    align: 'center',
                },
                {
                    title: trans('student.englishName', '英文名'),
                    dataIndex: 'ename',
                    key: 'ename',
                    align: 'center',
                },
                {
                    title: trans('student.sex', '性别'),
                    dataIndex: 'gender',
                    key: 'gender',
                    align: 'center',
                    render: (text, record) => (
                        <span>
                            {record.sex === 0
                                ? trans('student.woman', '女')
                                : record.sex === 1
                                ? trans('student.man', '男')
                                : ''}
                        </span>
                    ),
                },
                {
                    title: trans('student.studentNo', '学号'),
                    key: 'studentID',
                    dataIndex: 'studentID',
                    align: 'center',
                },
                {
                    title: trans('course.basedetail.base.administrative.class', '行政班'),
                    key: 'className',
                    dataIndex: 'className',
                    align: 'center',
                },
                {
                    title: '取消报名时间',
                    key: 'cancelTime',
                    dataIndex: 'cancelTime',
                    align: 'center',
                },
            ];
        } else {
            return [
                {
                    title: trans('student.name', '姓名'),
                    dataIndex: 'name',
                    key: 'name',
                    align: 'center',
                    width: 70,
                },
                {
                    title: trans('student.englishName', '英文名'),
                    dataIndex: 'ename',
                    key: 'ename',
                    align: 'center',
                    width: locale() === 'en' ? 130 : 100,
                },
                {
                    title: trans('student.sex', '性别'),
                    dataIndex: 'gender',
                    key: 'gender',
                    align: 'center',
                    width: 70,
                    render: (text, record) => (
                        <span>
                            {record.sex === 0
                                ? trans('student.woman', '女')
                                : record.sex === 1
                                ? trans('student.man', '男')
                                : ''}
                        </span>
                    ),
                },
                {
                    title: trans('student.studentNo', '学号'),
                    key: 'studentID',
                    dataIndex: 'studentID',
                    width: 120,
                    align: 'center',
                },
                /* {
                    title: trans('student.teacherNameShow', '导师'),
                    key: 'tutorNames',
                    dataIndex: 'tutorNames',
                    width: 120,
                    align: 'center',
                }, */
                {
                    title: trans('course.basedetail.base.administrative.class', '行政班'),
                    key: 'className',
                    dataIndex: 'className',
                    width: locale() === 'en' ? 170 : 100,
                    align: 'center',
                },
                {
                    title: trans('course.setup.course.regStatus', '报名状态'),
                    key: 'status',
                    dataIndex: 'status',
                    align: 'center',
                    width: locale() === 'en' ? 120 : 100,
                    render: (text, record) => (
                        <span style={{ color: record.status == 1 ? '#4d7fff' : '#666' }}>
                            {record.status == 0
                                ? '未选中'
                                : record.status == 1
                                ? trans('course.basedetail.selected', '已选中')
                                : record.status == 2
                                ? '未提交'
                                : record.status == 3
                                ? '已提交'
                                : record.status == 4
                                ? '取消报名'
                                : ''}
                        </span>
                    ),
                },
                {
                    title: trans('course.setup.course.payStatus', '支付状态'),
                    key: 'payStatus',
                    dataIndex: 'payStatus',
                    align: 'center',
                    width: locale() === 'en' ? 140 : 100,
                    render: (text, record) => {
                        return (
                            <span>
                                {record.payStatus == 1 ? (
                                    trans('course.basedetail.unpaid', '待支付')
                                ) : record.payStatus == 2 ? (
                                    trans('course.basedetail.partly.paid', '部分支付')
                                ) : record.payStatus == 3 ? (
                                    trans('course.basedetail.paid', '支付完成')
                                ) : record.payStatus == 4 ? (
                                    trans('course.basedetail.order.closed', '关闭')
                                ) : record.payStatus == 5 ? (
                                    trans('course.basedetail.paid.offline', '线下支付')
                                ) : // ) : !record.payStatus && record.status === 1 ? (
                                !record.payStatus && choosePayType != 0 ? (
                                    <a onClick={() => this.noticeToPay(record)}>
                                        {trans('course.basedetail.notice', '发起缴费')}
                                    </a>
                                ) : (
                                    ''
                                )}
                            </span>
                        );
                    },
                },
                {
                    title: '学员类型',
                    key: 'studentType',
                    dataIndex: 'studentType',
                    align: 'center',
                    render: (value) => <span>{value === 0 ? '新生' : '老生'}</span>,
                    width: 100,
                },

                {
                    title: trans('course.basedetail.join.type', '加入方式'),
                    key: 'joinType',
                    dataIndex: 'joinType',
                    align: 'center',
                    width: locale() === 'en' ? 120 : 100,
                    render: (text, record) => (
                        <span>
                            {record.joinType == 1
                                ? trans('course.basedetail.self.registration', '自主报名')
                                : trans('course.basedetail.teacher.registration', '教师添加')}
                        </span>
                    ),
                },
                {
                    title: trans('course.basedetail.join.date', '加入日期'),
                    key: 'joinTime',
                    dataIndex: 'joinTime',
                    align: 'center',
                    width: locale() === 'en' ? 170 : 180,
                },

                {
                    title: isAdmin ? trans('student.opeation', '操作') : '',
                    key: 'action',
                    width: isAdmin ? (locale() === 'en' ? 170 : 120) : 5,
                    fixed: 'right',
                    align: 'center',
                    render: (text, record) => {
                        const menu = (
                            <Menu className={styles.action}>
                                {this.getActionItem(record, disabledAction)}
                            </Menu>
                        );
                        return (
                            <div>
                                <Dropdown overlay={menu} trigger={['click']}>
                                    <a
                                        className="ant-dropdown-link"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            this.setState({
                                                currentRecord: record,
                                            });
                                        }}
                                    >
                                        调整 <Icon type="down" />
                                    </a>
                                </Dropdown>
                            </div>
                        );
                    },
                },
            ];
        }
    }

    setFeeForOrder = (value, type) => {
        if (type === 'classFeeForOrder') {
            this.setState({
                classFeeForOrder: Number(value),
            });
        }
        if (type === 'materialsFeeForOrder') {
            this.setState({
                materialsFeeForOrder: Number(value),
            });
        }
    };

    noticeToPay = (record) => {
        const {
            showCoursePlanningDetail: { classFee, materialFeeType, materialCost, newMaterialCost },
        } = this.props;
        this.setState(
            {
                classFeeForOrder: classFee,
                materialsFeeForOrder:
                    materialFeeType === 0
                        ? ''
                        : materialFeeType === 1
                        ? materialCost
                        : newMaterialCost,
            },
            () => {
                this.setState({
                    currentRecord: record,
                    paymentNoticeVisible: true,
                });
            }
        );
    };

    handlePaymentNoticeConfirm = () => {
        let { coursePlanningId, chooseCoursePlanId, currentRecord } = this.state;
        let {
            dispatch,
            showCoursePlanningDetail,
            chooseCourseDetails: { choosePayType },
            studentDetailContent: { submitStatus },
        } = this.props;
        const { classFeeForOrder, materialsFeeForOrder } = this.state;
        let params = {
            planId: chooseCoursePlanId,
            classIds: [currentRecord.classId],
            courseId: showCoursePlanningDetail.courseId,
            chooseCourseRelationId: currentRecord.id,
            batchType: 0,
            chooseStudentUserId: currentRecord.userId,
            weekDayLessonModel: [],
            credit: 0,
            coursePlanId: coursePlanningId,
            classFeeForOrder,
            materialsFeeForOrder,
        };

        dispatch({
            type: 'courseBaseDetail/paymentNotice',
            payload: params,
            onSuccess: () => {
                message.success('缴费通知发送成功');
            },
        }).then(() => {
            if (choosePayType == 1 && submitStatus == 1) {
                this.getStudentTable();
                this.setState({
                    paymentNoticeConfirmVisible: false,
                    paymentNoticeVisible: false,
                });
            } else {
                const { paymentNotice } = this.props;
                dispatch({
                    type: 'courseBaseDetail/sendPayTuitionToPersonal',
                    payload: {
                        tuitionPlanId: paymentNotice.tuitionPlan,
                        tuitionNo: paymentNotice.tuitionOrderNo,
                    },
                }).then(() => {
                    this.getStudentTable();
                    this.setState({
                        paymentNoticeConfirmVisible: false,
                        paymentNoticeVisible: false,
                    });
                });
            }
        });
    };

    toggleCancelSignUpVisible = () => {
        const { cancelSignUpVisible } = this.state;
        this.setState({
            cancelSignUpVisible: !cancelSignUpVisible,
        });
    };

    cancelSignUp = (record) => {
        const { dispatch } = this.props;
        this.toggleCancelSignUpVisible();
        dispatch({
            payload: {
                studentChooseCourseId: record.id,
            },
            type: 'courseBaseDetail/getCancelFee',
        });
    };

    getActionItem = (record, disabledAction) => {
        // 选中状态（0:未选中；1:已选中,2未提交,3 已提交, 4 取消报名）
        // 选课计划状态（1:志愿申报；2:先到先得）
        const {
            chooseCourseDetails: { type },
        } = this.props;
        let status = record.status;

        let transferItem = (
            <Menu.Item onClick={this.transformStudent.bind(this, record)}>
                {/* {trans('global.transfer', '转移')} */}
                转到其他班
            </Menu.Item>
        );
        let selectItem = (
            <Menu.Item onClick={this.selectStu.bind(this, record)} className={disabledAction}>
                {status == 1
                    ? trans('course.basedetail.deselect', '取消选中')
                    : trans('course.basedetail.setup.selected', '设为选中')}
            </Menu.Item>
        );
        let removeItem = (
            <Menu.Item onClick={this.removeStudent.bind(this, 1, record)}>
                {/* {trans('course.basedetail.remove', '移除')} */}
                删除报名记录
            </Menu.Item>
        );
        let cancelItem = <Menu.Item onClick={() => this.cancelSignUp(record)}>取消报名</Menu.Item>;
        let studentTypeItem = (
            <Menu.Item onClick={() => this.studentTypeChange(record)}>设置学员类型</Menu.Item>
        );

        if (type === 1) {
            if (status === 0) {
                return [selectItem, removeItem, studentTypeItem];
            }
            if (status === 1) {
                return [selectItem, cancelItem, transferItem, removeItem, studentTypeItem];
            }
            if (status === 3) {
                return [selectItem, cancelItem, transferItem, removeItem, studentTypeItem];
            }
            if (status === 4) {
                return [studentTypeItem];
            }
        }
        if (type === 2) {
            if (status === 1) {
                return [cancelItem, transferItem, removeItem, studentTypeItem];
            }
            if (status === 4) {
                return [studentTypeItem];
            }
        }
    };

    studentTypeChange = (record) => {
        const { dispatch } = this.props;
        const { selectedRows } = this.state;
        let studentType = 0;
        let that = this;
        console.log('this', this);
        Modal.confirm({
            title: '设置学员类型',
            icon: '',
            className: 'studentTypeChange',
            content: (
                <Radio.Group
                    onChange={(e) => (studentType = e.target.value)}
                    defaultValue={0}
                    style={{ marginTop: '20px' }}
                >
                    <Radio value={0}>新生</Radio>
                    <Radio value={1}>老生</Radio>
                </Radio.Group>
            ),
            onOk() {
                dispatch({
                    type: 'courseBaseDetail/batchNewOrOldStudent',
                    payload: {
                        studentChooseCourseIdList: record
                            ? [record.id]
                            : selectedRows.map((item) => item.id),
                        studentType,
                    },
                    onSuccess: () => {
                        message.success('设置成功');
                    },
                }).then(() => {
                    console.log('that :>> ', that);
                    that.setState(
                        {
                            page: 1,
                            selectedRows: [],
                            selectedRowKeys: [],
                        },
                        () => {
                            that.getStudentTable();
                        }
                    );
                });
            },
            onCancel() {},
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
        const { chooseCoursePlanId, classIdList } = this.state;
        if (studentIdList.length === 0) {
            message.warn(trans('tc.base.check.add.student', '请先勾选要添加的学生'));
            return;
        }
        return dispatch({
            type: 'courseBaseDetail/addStudentClass',
            payload: {
                planId: chooseCoursePlanId,
                classId: classIdList[0],
                courseId: getUrlSearch('courseId'),
                coursePlanningId: getUrlSearch('coursePlanningId'),
                userIdList: studentIdList,
            },
        }).then(() => {
            this.getStudentTable();
        });
    };

    render() {
        let {
            addStudentModalVisible,
            total,
            page,
            pageSize,
            studentList,
            visibleClassDetail,
            classDetail,
            loading,
            classIdList,
            selectedRowKeys,
            paymentNoticeVisible,
            paymentNoticeConfirmVisible,
            paymentNoticeConfirmFailVisible,
            classFeeForOrder,
            materialsFeeForOrder,
            currentRecord,
            cancelSignUpVisible,
            chooseCoursePlanId,
        } = this.state;

        let {
            dispatch,
            showCoursePlanningDetail: { choosePayProjectSettingModelList },
            chooseCourseDetails: { choosePayType },
            studentDetailContent: { submitStatus },
        } = this.props;

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
            <div className={styles.Student}>
                <AutoHeight>
                    <div className={styles.left}>
                        {this.classListHTML()}
                        {visibleClassDetail ? <ClassDetail {...classDetail} /> : null}
                    </div>
                    <div className={styles.right}>
                        {this.tabAndSearchHTML()}
                        <div>
                            <Table
                                loading={{
                                    indicator: <Icon type="loading" />,
                                    spinning: loading,
                                    tip: 'Trying to load...',
                                }}
                                scroll={{ x: locale() === 'en' ? 1360 : 1190 }}
                                columns={this.getColums()}
                                dataSource={studentList}
                                pagination={false}
                                rowSelection={rowSelection}
                                className={styles.tableStyle}
                            />
                            <div className={styles.pagination}>
                                <span className={styles.total}>
                                    {trans('course.basedetail.total.students', '共 {$num} 个学生', {
                                        num: total,
                                    })}
                                </span>
                                <Pagination
                                    total={total}
                                    showSizeChanger
                                    showQuickJumper
                                    pageSizeOptions={['10', '50', '100', '500']}
                                    onChange={this.changePage}
                                    onShowSizeChange={this.onShowSizeChange}
                                    current={page}
                                    pageSize={pageSize}
                                />
                            </div>
                        </div>
                    </div>
                </AutoHeight>

                {/* 添加学生 */}
                {/* <AddStudent
                    addStudentModalVisible={addStudentModalVisible}
                    classIdList={classIdList}
                    dispatch={dispatch}
                    getStudentTable={this.getStudentTable}
                    self={this}
                    hideModal={this.hideModal}
                    source="student"
                /> */}

                {/* 新的添加学生组件 */}
                {addStudentModalVisible && (
                    <AddStudent
                        semesterValue={this.props.chooseCourseDetails.semesterModel.id}
                        visible={addStudentModalVisible}
                        toggleVisible={this.toggleAddStudentModalVisible}
                        addStudentConfirm={this.addStudentConfirm}
                        planId={chooseCoursePlanId}
                        sourceType={'courseBaseDetail'}
                        classIdList={classIdList}
                    />
                )}

                {/* 发起缴费通知 */}
                <Modal
                    visible={paymentNoticeVisible}
                    title="发起缴费通知"
                    onCancel={() => {
                        this.setState({
                            paymentNoticeVisible: false,
                        });
                    }}
                    onOk={() => {
                        if (!isEmpty(choosePayProjectSettingModelList)) {
                            this.setState({
                                paymentNoticeConfirmVisible: true,
                            });
                        } else {
                            this.setState({
                                paymentNoticeConfirmFailVisible: true,
                            });
                        }
                    }}
                    okText="发起缴费通知"
                    wrapClassName={styles.paymentNotice}
                    destroyOnClose={true}
                >
                    <p>请确认发起缴费的课程价格，若有调整可直接修改</p>
                    <p className={styles.fee}>
                        <span>课时费:</span>
                        <InputNumber
                            defaultValue={classFeeForOrder}
                            style={{ width: 100 }}
                            step={100}
                            onChange={(value) => this.setFeeForOrder(value, 'classFeeForOrder')}
                        />
                        元/期
                    </p>
                    <p className={styles.fee}>
                        <span>材料费:</span>
                        <InputNumber
                            defaultValue={materialsFeeForOrder}
                            style={{ width: 100 }}
                            step={100}
                            onChange={(value) => this.setFeeForOrder(value, 'materialsFeeForOrder')}
                        />
                        元/期
                    </p>
                </Modal>

                {/* 发起确认 */}
                <Modal
                    visible={paymentNoticeConfirmVisible}
                    title="发起确认"
                    onCancel={() => {
                        this.setState({
                            paymentNoticeConfirmVisible: false,
                        });
                    }}
                    onOk={this.handlePaymentNoticeConfirm}
                    wrapClassName={styles.paymentNoticeConfirm}
                    destroyOnClose={true}
                >
                    {choosePayType == 2 ? (
                        <p>{`系统将为${currentRecord?.name}生成收费订单并向家长发送缴费通知，是否继续？`}</p>
                    ) : choosePayType == 1 && submitStatus == 1 ? (
                        <p>{`本次选课为统一收费，且尚未发送缴费通知，系统将为${currentRecord?.name}生成待发送的收费订单，您可以稍后进入收费单统一发送缴费通知，是否继续？`}</p>
                    ) : choosePayType == 1 && submitStatus == 2 ? (
                        <p>{`本次选课的缴费通知已发送，系统将为${currentRecord?.name}独立生成收费订单并发送缴费通知，是否继续？`}</p>
                    ) : null}
                    {/* <p>
                        确认向学生{currentRecord?.name}
                        发起缴费通知吗？发起后家长将收到通知，并且可在我的选课列表进行支付
                    </p>
                    <p>
                        课时费关联收费项：
                        {choosePayProjectSettingModelList &&
                            choosePayProjectSettingModelList[0] &&
                            choosePayProjectSettingModelList[0].chargeItemName}
                    </p>
                    <p>
                        材料费关联收费项：
                        {choosePayProjectSettingModelList &&
                            choosePayProjectSettingModelList[1] &&
                            choosePayProjectSettingModelList[1].chargeItemName}
                    </p> */}
                </Modal>

                {/* 发起确认, 未找到关联收费项 */}
                <Modal
                    visible={paymentNoticeConfirmFailVisible}
                    title="发起确认"
                    onCancel={() => {
                        this.setState({
                            paymentNoticeConfirmFailVisible: false,
                        });
                    }}
                    onOk={() => {
                        this.setState({
                            paymentNoticeConfirmFailVisible: false,
                            paymentNoticeVisible: false,
                        });
                    }}
                    okText="前往设置"
                    wrapClassName={styles.paymentNoticeConfirmFail}
                    destroyOnClose={true}
                >
                    <p>未找到关联收费项，请先到选课计划基础信息页面进行设置</p>
                </Modal>

                {currentRecord && (
                    <CancelSignUp
                        visible={cancelSignUpVisible}
                        toggleCancelSignUpVisible={this.toggleCancelSignUpVisible}
                        getStudentTable={this.getStudentTable}
                        record={currentRecord}
                        chooseCoursePlanId={Number(chooseCoursePlanId)}
                        flag={1}
                    />
                )}

                {this.transformStudentHTML()}
            </div>
        );
    }
}

export default Student;
