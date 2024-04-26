//club列表
import React, { PureComponent } from 'react';
import styles from './index.less';
import {
    Form,
    Select,
    Input,
    DatePicker,
    Table,
    Pagination,
    Button,
    Modal,
    Checkbox,
    Skeleton,
    Spin,
    Tree,
    Icon,
    TreeSelect,
} from 'antd';
import { connect } from 'dva';
import PersonModal from '../../../components/PersonModal/index';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import OrderDetail from '../../PayNotice/orderDetail.js';
import { trans, locale } from '../../../utils/i18n';
import icon from '../../../icon.less';

const dateFormat = 'YYYY-MM-DD';
const { Option } = Select;
const { Search } = Input;
const CheckboxGroup = Checkbox.Group;
const { TreeNode } = TreeSelect;

const dataList = [];

@connect((state) => ({
    // accountList: state.account.accountList, //
    campusAndStage: state.pay.campusAndStage, // 查询年级和学段
    batchOrderQueryList: state.order.batchOrderQueryList, // 获取列表及表头相关信息
    orderDetailContent: state.pay.orderDetailContent, // 订单详情
    accountList: state.account.accountList, // 账户信息
    busiAndChannelList: state.account.busiAndChannelList, //

    personalArrangements: state.order.personalArrangements,
    planningSemesterInfo: state.course.planningSemesterInfo,
    currentSemesterSubject: state.order.currentSemesterSubject,
    stageSubject: state.order.stageSubject,
    treeDataSource: state.teacher.treeDataSource,
    planningSchoolListInfo: state.course.planningSchoolListInfo,
    currentUser: state.global.currentUser,
    personalSubjectTemplate: state.order.personalSubjectTemplate,
}))
export default class PaymentDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            pageSize: 10,
            total: 0,
            tableList: [], // 列表
            sumAmount: '', // 收入
            campueValue: '', // 切换校区value
            sectionValue: [], // 学段value
            deadlineBegin: '', // 起始时间value
            deadlineEnd: '', // 截至时间value
            orderNoType: 1, // 关键字查询选择不同订单类型value
            keyValue: '', // 关键字查询value
            isViewDetail: false, // 详情操作显示状态
            orderDetailContent: '', // 请求详情数据
            accountList: '', // 商户下拉菜单数据
            channelId: [], // 支付方式id
            channelList: [], // 支付方式

            searchValueKey: '', //模糊搜索
            visible: false,
            semesterValue: '', // 学期id
            mubanLoading: true,
            contentLoading: false,
            showTemplateModal: false,
            courseSubjectType: 0,

            checkedList: [],
            indeterminate: true,
            checkAll: false,
            plainOptions: [],
            stage: '',
            checkIdList: [],
            checkNameList: [],

            dataSource: [],
            treeId: 1, //树节点id
            tagCode: '', //部门类型
            isLeaf: false, //是否是叶子节点
            isExternalTeachers: false, //是否是外聘教师
            searchValue: '',
            selectedKeys: ['1-AGENCY-false'],
            checkValue: true, //是否显示子部门员工
            current: 1, //当前页数
            expandKeysList: [],
            autoExpandParent: true,
            schoolId: '',
            treeValue: '',
            resultArr: [],
        };
    }

    componentDidMount() {
        this.getPlanningSchool();
    }

    //初始化获取组织结构树
    getTreeOrgFirst() {
        const { dispatch } = this.props;
        const { schoolId } = this.state;
        dispatch({
            type: 'teacher/getTreeData',
            payload: {
                nodeId: 1, //临时写死
                ifContainUser: true, //是否包含用户
                schoolId: schoolId,
            },
            onSuccess: () => {
                const { treeDataSource } = this.props;
                console.log('treeDataSource', treeDataSource);
                this.setState(
                    {
                        dataSource: treeDataSource,
                        treeValue:
                            treeDataSource &&
                            treeDataSource.length > 0 &&
                            Number(treeDataSource[0].id),
                    },
                    () => {
                        this.getTableList();
                    }
                );
            },
        });
    }

    // 获取列表
    getTableList = () => {
        const { dispatch } = this.props;
        const {
            keyValue,
            orderNoType,
            campueValue,
            sectionValue,
            deadlineBegin,
            deadlineEnd,
            page,
            pageSize,
            channelId,
            searchValueKey,
            semesterValue,
            treeValue,
            checkIdList,
        } = this.state;
        console.log(channelId, 'channelId >>>');
        console.log('treeValue', treeValue);
        dispatch({
            type: 'order/personalArrangements',
            payload: {
                semesterId: semesterValue,
                orgTreeId: treeValue, //暂定
                teacherKeyWords: searchValueKey,
                subjectIdList: checkIdList,
            },
        }).then(() => {
            const { personalArrangements } = this.props;
            this.setState({
                tableList: personalArrangements && personalArrangements,
            });
        });
    };

    //获取学期列表
    getSemesterInfo = () => {
        const { dispatch } = this.props;
        const { schoolId } = this.state;
        dispatch({
            type: 'course/selectBySchoolIdAllSemester',
            payload: {
                schoolId,
            },
            onSuccess: () => {
                const { planningSemesterInfo } = this.props;
                let now = Date.parse(new Date());
                planningSemesterInfo &&
                    planningSemesterInfo.length > 0 &&
                    planningSemesterInfo.map((item, index) => {
                        if (now >= item.startTime && now <= item.endTime) {
                            this.setState(
                                {
                                    semesterValue: item.id,
                                },
                                () => {}
                            );
                        } else {
                            if (index == 0) {
                                this.setState(
                                    {
                                        semesterValue: item.id,
                                    },
                                    () => {}
                                );
                            }
                        }
                    });
            },
        }).then(() => {
            this.props.getSemesterValue(this.state.semesterValue);
            this.getTreeOrgFirst();
        });
    };

    //根据条件获得模版中课程与所有课程
    getAllCourse = () => {
        const { templateId, subjectId, teachingOrgId, inputValue, stage, courseSubjectType } =
            this.state;
        const { dispatch } = this.props;
        console.log('courseSubjectType', courseSubjectType);
        dispatch({
            type: 'order/currentSemesterSubject',
            payload: {
                // stage,
                // courseSubjectType,
                // sheetType: this.props.sheetType,
            },
        }).then(() => {
            const { currentSemesterSubject, dispatch } = this.props;
            const { stage, courseSubjectType, semesterValue } = this.state;
            const plainOptions = [];
            currentSemesterSubject &&
                currentSemesterSubject.length > 0 &&
                currentSemesterSubject.map((item, index) => {
                    return plainOptions.push(item.name);
                });
            this.setState({
                mubanLoading: false,
                plainOptions,
            });
            dispatch({
                type: 'order/stageSubject',
                payload: {
                    semesterId: semesterValue, //学期ID
                    // stage,
                    // courseSubjectType,
                    sheetType: this.props.sheetType,
                },
            }).then(() => {
                const { stageSubject } = this.props;
                let checkNameList = [];
                console.log('stageSubject', stageSubject);
                stageSubject &&
                    stageSubject.subjectIdList &&
                    stageSubject.subjectIdList.length > 0 &&
                    stageSubject.subjectIdList.map((item, index) => {
                        currentSemesterSubject &&
                            currentSemesterSubject.length > 0 &&
                            currentSemesterSubject.map((el, order) => {
                                if (item == el.id) {
                                    checkNameList.push(el.name);
                                }
                            });
                    });
                console.log('checkNameList', checkNameList);

                let idList = [];
                stageSubject &&
                    stageSubject.subjectIdList &&
                    stageSubject.subjectIdList.length > 0 &&
                    stageSubject.subjectIdList.map((item, index) => {
                        return idList.push(item);
                    });

                this.setState(
                    {
                        checkedList: checkNameList,
                        // checkNameList,
                        // stage: stageSubject && stageSubject.stage,
                        checkIdList: idList,
                        // courseSubjectType: stageSubject && stageSubject.courseSubjectType,
                    },
                    () => {
                        console.log('checkedList', this.state.checkedList, this.state.checkIdList);
                    }
                );
            });
        });
    };

    getCannelValue = (value) => {
        this.setState(
            {
                channelId: value ? value : '',
            },
            () => {
                this.getTableList();
            }
        );
    };

    showModal = () => {
        this.setState({
            showTemplateModal: true,
        });
        // this.getAllCourse();
    };

    handleOk = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    //完成关闭弹窗
    closeModal = () => {
        const { onClose, dispatch, stageSubject } = this.props;
        const { checkIdList, stage, courseSubjectType } = this.state;
        dispatch({
            type:
                stageSubject && stageSubject.subjectIdList && stageSubject.subjectIdList.length > 0
                    ? 'order/updateStageSubject'
                    : 'order/createStageSubject',
            payload: {
                id:
                    stageSubject &&
                    stageSubject.subjectIdList &&
                    stageSubject.subjectIdList.length > 0
                        ? stageSubject && stageSubject.id
                        : null, //设置好学科后 查询回显的数据的主键
                subjectIdList: checkIdList,
                // stage,
                semesterId: this.props.semesterValue, //学期ID
                courseSubjectType,
                sheetType: Number(this.props.sheetType),
            },
        }).then(() => {
            const {} = this.props;
            this.setState({
                showTemplateModal: false,
            });
            this.getTableList();
            // typeof onClose == 'function' && onClose.call(this);
            // this.props.getCheckIdList(this.state.checkIdList, this.state.stage);
            // this.props.getStage(this.state.stage);
        });
    };

    closeTemplateModal = () => {
        this.setState({
            showTemplateModal: false,
        });
    };

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            showTemplateModal: false,
        });
    };

    // 导出
    exportBatch = () => {
        console.log('12');
        const {
            keyValue,
            orderNoType,
            channelId, //支付方式
            campueValue, //校区
            sectionValue, //学段
            deadlineBegin,
            deadlineEnd,
        } = this.state;
        window.open(
            `/api/batchOrder/exportBatchOrder?campusId=${campueValue}&sectionId=${sectionValue}&startDate=${deadlineBegin}&endDate=${deadlineEnd}&tuitionOrderNo=${
                orderNoType == 1 ? keyValue : ''
            }&channelTradeNo=${orderNoType == 2 ? keyValue : ''}&batchOrderNo=${
                orderNoType == 3 ? keyValue : ''
            }&payStatusList=${channelId}&payTypeList=${payAccountValue}`
        );
    };

    //搜索条件中输入内容
    changeSearch = (e) => {
        console.log('edsvcseee', e.target.value);
        this.setState({
            searchValueKey: e.target.value,
        });
    };

    //输入搜索条件搜索
    handleSearch = (value) => {
        console.log('value', value);
        this.setState(
            {
                searchValueKey: value,
                // current: 1,
            },
            () => {
                this.getTableList();
            }
        );
    };

    getPlanningSchool = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'course/getCouserPlanningSchoolList',
        }).then(() => {
            if (this.props.planningSchoolListInfo && this.props.planningSchoolListInfo.length > 0) {
                const { planningSchoolListInfo } = this.props;
                this.setState(
                    {
                        schoolId: planningSchoolListInfo[0].schoolId,
                    },
                    () => {
                        // this.getTreeOrgFirst();
                        this.getSemesterInfo();
                    }
                );
            }
        });
    };
    getCheckIdList = (keyList, value) => {
        console.log('keyuigjv', keyList, value);
        this.setState(
            {
                checkIdList: keyList,
                stageValue: value,
            },
            () => {
                // this.getSubjectChief();
                // this.child.getSubjectChiefList();
            }
        );
    };
    getDun = (key, index) => {
        if (key.length > 0 && key.length - 1 !== index) {
            return <span>、</span>;
        }
    };

    changeSemester = (value) => {
        this.setState(
            {
                semesterValue: value,
            },
            () => {
                this.getTableList();
            }
        );
    };

    changeCourseSubject = (key) => {
        console.log('key', key);
        this.setState(
            {
                courseSubjectType: key,
            },
            () => {
                this.getAllCourse();
            }
        );
    };

    leftHtml = () => {
        const { templateList, stage, courseSubjectType } = this.state;
        const { currentSemesterSubject, updateStageSubject } = this.props;
        return (
            <ul className={styles.templateContent_left}>
                <li
                    onClick={() => this.changeCourseSubject(0)}
                    className={courseSubjectType === 0 ? styles.active_li : ''}
                >
                    常规周课时统计管理
                </li>
                <li
                    onClick={() => this.changeCourseSubject(1)}
                    className={courseSubjectType === 1 ? styles.active_li : ''}
                >
                    CCA&选修课周课时统计学科
                </li>
            </ul>
        );
    };

    //课程展示
    renderCourse = () => {
        const { coursesList, checkedList, courseCount, plainOptions } = this.state;
        const { currentSemesterSubject } = this.props;
        console.log('currentSemesterSubject', currentSemesterSubject);

        return (
            <div className={styles.checkBox_wrap}>
                <div style={{ marginBottom: '10px' }}>
                    <Checkbox
                        indeterminate={this.state.indeterminate}
                        onChange={this.onCheckAllChange}
                        checked={this.state.checkAll}
                    >
                        全选
                    </Checkbox>
                    <span style={{ marginRight: '10px', display: 'inline-block' }}>
                        已选择{checkedList && checkedList.length}个学科
                    </span>
                </div>
                {currentSemesterSubject && currentSemesterSubject.length ? (
                    <CheckboxGroup
                        options={plainOptions}
                        value={this.state.checkedList}
                        onChange={this.onChangeSubject}
                        style={{ marginBottom: '10px' }}
                    />
                ) : (
                    <div className={styles.checkGroup}>
                        {trans('template.noData', '当前查询暂无数据')}
                    </div>
                )}
            </div>
        );
    };

    onCheckAllChange = (e) => {
        const { plainOptions } = this.state;
        console.log('e', e);
        this.setState(
            {
                checkedList: e.target.checked ? plainOptions : [],
                indeterminate: false,
                checkAll: e.target.checked,
            },
            () => {
                // this.props.getCheckIdList(this.state.checkIdList);
            }
        );
    };

    onChangeSubject = (checkedList) => {
        const { plainOptions, checkNameList } = this.state;
        const { currentSemesterSubject } = this.props;
        console.log('chistsdfvef', checkedList);
        checkedList.concat(this.state.checkedList);
        console.log('chistsdfvef', checkedList);
        let checkIdList = [];
        checkedList &&
            checkedList.length > 0 &&
            checkedList.map((el, order) => {
                currentSemesterSubject &&
                    currentSemesterSubject.length > 0 &&
                    currentSemesterSubject.map((item, index) => {
                        console.log('item', item);
                        if (el == item.name) {
                            checkIdList.push(item.id);
                        }
                    });
            });
        console.log('checkIdList', checkIdList);
        console.log('checkedList', checkedList);
        this.setState(
            {
                checkedList,
                indeterminate: !!checkedList.length && checkedList.length < plainOptions.length,
                checkAll: checkedList.length === plainOptions.length,
                checkIdList,
            },
            () => {
                // this.props.getCheckIdList(this.state.checkIdList);
            }
        );
    };

    //右侧内容
    rightHtml = () => {
        const { subjectList, inputValue, teachingOrgList } = this.state;
        return (
            <div className={styles.templateContent_right}>
                <div className={styles.right_con}>{this.renderCourse()}</div>
            </div>
        );
    };

    handleChange = (value) => {
        this.setState(
            {
                schoolId: value,
                semesterValue: '',
                searchValueKey: '',
            },
            () => {
                this.getSemesterInfo();
                // this.getTableList();
            }
        );
    };

    onTreeChange = (value) => {
        console.log('treeValue', value);
        this.setState(
            {
                treeValue: value,
            },
            () => {
                this.getTableList();
            }
        );
    };

    //格式化树节点
    formatTreeData(data) {
        if (!data || data.length == 0) return [];
        let resultArr = [];
        data &&
            data.length > 0 &&
            data.map((item) => {
                let obj = {
                    title: item.name,
                    key: item.id,
                    value: item.id,
                    children: this.formatTreeData(item.treeNodeList),
                };
                resultArr.push(obj);
            });
        return resultArr;
    }

    render() {
        const { campusAndStage, planningSemesterInfo, planningSchoolListInfo } = this.props;
        const {
            page,
            pageSize,
            total,
            tableList,
            sumAmount,
            isViewDetail,
            orderDetailContent,
            accountList,
            orderNoType,
            channelList,
            searchValueKey,
            semesterValue,
            mubanLoading,
            contentLoading,
            dataSource,
            expandKeysList,
            autoExpandParent,
            schoolId,
        } = this.state;

        const columns = [
            {
                title: <span className={styles.headTitle}>{trans('global.teacher', '教师')}</span>,
                dataIndex: 'student',
                key: 'student',
                align: 'center',
                render: (text, record) => {
                    return <span>{record.userName}</span>;
                },
            },
            {
                title: <span className={styles.headTitle}>教学线工作安排</span>,
                dataIndex: 'readStatus',
                key: 'readStatus',
                align: 'center',
                children: [
                    {
                        title: <span className={styles.subTitle}>学科</span>,
                        dataIndex: 'days',
                        align: 'center',
                        key: 'days',
                        render: (text, record) => {
                            return (
                                <span className={styles.dataTxt}>
                                    {record.subjectDTOList &&
                                        record.subjectDTOList.map((item, index) => {
                                            return (
                                                <>
                                                    {item.name}
                                                    {this.getDun(record.subjectDTOList, index)}
                                                </>
                                            );
                                        })}
                                </span>
                            );
                        },
                    },
                    {
                        title: <span className={styles.subTitle}>授课年级</span>,
                        dataIndex: 'hours',
                        align: 'center',
                        key: 'hours',
                        render: (text, record) => {
                            // let long = record.rangeReadTimeNum
                            //     ? (record.rangeReadTimeNum / 60).toFixed(1)
                            //     : '';
                            return (
                                <span className={styles.dataTxt}>
                                    {record.teachingOrgDTOList &&
                                        record.teachingOrgDTOList.map((item, index) => {
                                            return (
                                                <>
                                                    {item.name}
                                                    {this.getDun(record.teachingOrgDTOList, index)}
                                                </>
                                            );
                                        })}
                                </span>
                            );
                        },
                    },
                    {
                        title: <span className={styles.subTitle}>授课班级</span>,
                        dataIndex: 'books',
                        align: 'center',
                        key: 'books',
                        render: (text, record) => {
                            return (
                                <span className={styles.booksCount}>
                                    {record.studentGroupDTOList &&
                                        record.studentGroupDTOList.map((item, index) => {
                                            return (
                                                <>
                                                    {item.name}
                                                    {this.getDun(record.studentGroupDTOList, index)}
                                                </>
                                            );
                                        })}
                                </span>
                            );
                        },
                    },
                    {
                        title: <span className={styles.subTitle}>常规课周课时</span>,
                        dataIndex: 'books',
                        align: 'center',
                        key: 'books',
                        render: (text, record) => {
                            return (
                                <span className={styles.booksCount}>
                                    {record.primaryCourseHours}
                                </span>
                            );
                        },
                    },
                    {
                        title: <span className={styles.subTitle}>CCA&选修课周课时</span>,
                        dataIndex: 'books',
                        align: 'center',
                        key: 'books',
                        render: (text, record) => {
                            return (
                                <span className={styles.booksCount}>
                                    {record.electiveCourseHours}
                                </span>
                            );
                        },
                    },
                    {
                        title: <span className={styles.subTitle}>岗位角色</span>,
                        dataIndex: 'books',
                        align: 'center',
                        key: 'books',
                        render: (text, record) => {
                            console.log('record', record);
                            return (
                                <span className={styles.booksCount}>
                                    {record.teachingRoleList &&
                                        record.teachingRoleList.length > 0 &&
                                        record.teachingRoleList.map((item, index) => {
                                            // console.log('vdwjef', item);
                                            return (
                                                <>
                                                    {item.roleName}
                                                    {this.getDun(record.teachingRoleList, index)}
                                                </>
                                            );
                                        })}
                                </span>
                            );
                        },
                    },
                ],
            },
            {
                title: <span className={styles.headTitle}>导师线工作安排</span>,
                dataIndex: 'readTime',
                key: 'readTime',
                children: [
                    {
                        title: <span className={styles.subTitle}>所在年级</span>,
                        dataIndex: 'days',
                        align: 'center',
                        key: 'days',
                        render: (text, record) => {
                            return (
                                <span className={styles.dataTxt}>
                                    {
                                        record.adminTeachingOrgList && record.adminTeachingOrgList.length > 0
                                        ? record.adminTeachingOrgList.map((list, index) => <span>{index != record.adminTeachingOrgList.length - 1 ? `${list.name}，` : list.name}</span>)
                                        : null
                                    }
                                </span>
                            );
                        },
                    },
                    {
                        title: <span className={styles.subTitle}>所在班级</span>,
                        dataIndex: 'hours',
                        align: 'center',
                        key: 'hours',
                        render: (text, record) => {
                            // let long = record.rangeReadTimeNum
                            //     ? (record.rangeReadTimeNum / 60).toFixed(1)
                            //     : '';
                            return (
                                <span className={styles.dataTxt}>
                                     {
                                        record.adminStudentGroups && record.adminStudentGroups.length > 0
                                        ? record.adminStudentGroups.map((list, index) => <span>{index != record.adminTeachingOrgList.length - 1 ? `${list.name}，` : list.name}</span>)
                                        : null
                                    }
                                </span>
                            );
                        },
                    },
                    {
                        title: <span className={styles.subTitle}>岗位角色</span>,
                        dataIndex: 'books',
                        align: 'center',
                        key: 'books',
                        render: (text, record) => {
                            return (
                                <span className={styles.booksCount}>
                                    {record.adminRoleList &&
                                        record.adminRoleList.length > 0 &&
                                        record.adminRoleList.map((item, index) => {
                                            // console.log('itdfvdgem', item);
                                            return (
                                                <>
                                                    {item.roleName}
                                                    {this.getDun(record.adminRoleList, index)}
                                                </>
                                            );
                                        })}
                                </span>
                            );
                        },
                    },
                ],
            },
            {
                title: <span className={styles.headTitle}>其他管理发展工作</span>,
                dataIndex: 'readTime',
                key: 'readTime',
                children: [
                    {
                        title: <span className={styles.subTitle}>岗位角色</span>,
                        dataIndex: 'days',
                        // align: 'center',
                        key: 'days',
                        render: (text, record) => {
                            return (
                                <span className={styles.dataTxt}>
                                    {record.otherRoleList &&
                                        record.otherRoleList.length > 0 &&
                                        record.otherRoleList.map((item, index) => {
                                            return (
                                                <>
                                                    {item.roleName}
                                                    {this.getDun(record.otherRoleList, index)}
                                                </>
                                            );
                                        })}
                                </span>
                            );
                        },
                    },
                ],
            },
        ];

        // let loop = this.handleData(dataSource);

        const treeProps = {
            showSearch: true,
            treeData: this.formatTreeData(dataSource),
            placeholder: trans('teacher.selectBelongOrg', '请选择所属组织'),
            dropdownStyle: {
                maxHeight: 400,
                overflow: 'auto',
            },
            onChange: this.onTreeChange,
            treeNodeFilterProp: 'title',
            treeDefaultExpandAll: false,
            className: styles.selectPersonStyle,
            value: this.state.treeValue,
            // this.props.treeDataSource &&
            // this.props.treeDataSource.length > 0 &&
            // this.props.treeDataSource[0].id,
        };

        return (
            <div className={styles.paymentDetail}>
                <div className={styles.formParent}>
                    <Form className={styles.form} layout="inline">
                        <Form.Item>
                            <Select
                                value={schoolId}
                                className={styles.selectStyle}
                                onChange={this.handleChange}
                                style={{ width: '168px', height: '36px' }}
                            >
                                {planningSchoolListInfo &&
                                    planningSchoolListInfo.length > 0 &&
                                    planningSchoolListInfo.map((item, index) => {
                                        return (
                                            <Option value={item.schoolId} key={item.schoolId}>
                                                <span
                                                    title={
                                                        locale() != 'en'
                                                            ? item.name
                                                            : item.englishName
                                                    }
                                                >
                                                    {locale() != 'en'
                                                        ? item.name
                                                        : item.englishName}
                                                </span>
                                            </Option>
                                        );
                                    })}
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Select
                                size="large"
                                style={{ width: '168px', height: '36px' }}
                                value={semesterValue}
                                onChange={this.changeSemester}
                                placeholder="请选择学期"
                                className={styles.searchStyle}
                            >
                                {planningSemesterInfo &&
                                    planningSemesterInfo.length > 0 &&
                                    planningSemesterInfo.map((item, index) => {
                                        return (
                                            <Option value={item.id} key={item.id}>
                                                {locale() != 'en' ? (
                                                    <span>
                                                        {item.schoolYearName} {item.name}
                                                    </span>
                                                ) : (
                                                    <span>
                                                        {item.schoolYearEname} {item.ename}
                                                    </span>
                                                )}
                                            </Option>
                                        );
                                    })}
                            </Select>
                        </Form.Item>

                        <Form.Item>
                            {/* <TreeSelect
                                // showIcon
                                // switcherIcon={<Icon type="caret-down" />}
                                // onSelect={this.onSelect}
                                // onExpand={this.onExpand}
                                // defaultSelectedKeys={['1-AGENCY-false']}
                                // expandedKeys={expandKeysList}
                                // autoExpandParent={autoExpandParent}
                                // selectedKeys={this.state.selectedKeys}
                                // showSearch
                                // value={this.state.treeValue}
                                // placeholder="Please select"
                                onChange={this.onTreeChange}
                                // allowClear
                                // treeDefaultExpandAll
                            >
                                {loop}
                            </TreeSelect> */}
                            <TreeSelect
                                {...treeProps}
                                className={styles.searchStyle}
                                style={{ width: '168px', height: '36px' }}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Search
                                value={searchValueKey}
                                placeholder={trans('student.searchTeacher', '请输入教师关键字')}
                                onSearch={this.handleSearch}
                                onChange={this.changeSearch}
                                className={styles.searchStyle}
                                style={{ width: '168px', height: '36px' }}
                            />
                        </Form.Item>
                    </Form>
                    <div className={styles.titleRight}>
                        <span className={styles.reportSetting} onClick={this.showModal}>
                            <i className={icon.iconfont} style={{ marginRight: '5px' }}>
                                &#xe6b3;
                            </i>
                            报表设置
                        </span>
                    </div>
                </div>

                <div className={styles.tableAndPage}>
                    <Table
                        columns={columns}
                        dataSource={this.state.tableList}
                        pagination={false}
                        // scroll={{ x: 1300 }}
                    />
                </div>
                <Modal
                    visible={this.state.showTemplateModal}
                    // onOk={this.handleOk}
                    // onOk={this.closeModal}
                    width="100%"
                    className={styles.templateModalContent}
                    onCancel={this.handleCancel}
                    footer={null}
                    destroyOnClose
                    closable={false}
                >
                    <div style={{ height: '100vh', overflow: 'hidden' }}>
                        {/* <div className={styles.head}>
                            <i
                                className={`${icon.iconfont} ${styles.icon}`}
                                onClick={this.closeTemplateModal}
                            >
                                &#xe6e2;
                            </i>
                            <span className={styles.head_title}>
                                {trans('globalutil.setCourseTemplate', '设置课程模板')}
                            </span>
                            <div className={styles.head_btn} onClick={this.closeModal}>
                                {trans('template.finish', '完成')}
                            </div>
                        </div> */}
                        {/* {mubanLoading ? (
                            <div className={styles.templateContent}>
                                <Skeleton active />
                            </div>
                        ) : (
                            <div className={styles.templateContent}>
                                {this.leftHtml()}
                                {contentLoading ? (
                                    <div className={styles.templateContent_right_loading}>
                                        <Spin />
                                    </div>
                                ) : (
                                    this.rightHtml()
                                )}
                            </div>
                        )} */}
                         <PersonModal
                            onClose={this.closeTemplateModal}
                            modalTitle={this.state.modalTitle}
                            getCheckIdList={this.getCheckIdList.bind(this)}
                            semesterValue={this.state.semesterValue}
                            sheetType={this.props.sheetType}
                            schoolSectionKey={this.state.schoolSectionKey}
                            fromPerson={true}
                        />
                    </div>
                </Modal>
            </div>
        );
    }
}
