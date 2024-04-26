//学生管理--组织架构
/*
1、分类节点不显示设置组织角色，不显示表格
*/
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './index.less';
import {
    Input,
    message,
    Modal,
    Pagination,
    Dropdown,
    Menu,
    Select,
    Checkbox,
    Popover,
    Spin,
    Icon,
    DatePicker,
    Button,
    Form,
    Upload,
    Table,
} from 'antd';
import SortableTree from 'components/SortableTree/index';
import icon from '../../../icon.less';
import StudentTable from './table';
import CreateOrg from './OperModal/createOrg';
import AddStudent from './OperModal/addStudent';
import SetOrgRole from './OperModal/setOrgRole';
import TransferStaff from './OperModal/transferStudent';
import ResumptionRecord from './OperModal/resumptionRecord';
import LeftSchoolInfor from './OperModal/leftSchoolInfor';
import StudentInforRecord from './OperModal/studentInforRecord';
import GradeUp from './OperModal/gradeUp';
import ExportStudentSource from './OperModal/exportStudentSource';
import BatchEditInfo from './OperModal/batchEditInfo';
import SetTutor from './OperModal/setTutor';
import Parents from './OperModal/parents';
import PowerPage from '../../PowerPage/index';
import ConfirmEndClass from './OperModal/confirmEndClass';
import UpGradeSet from './OperModal/upGradeSet';
import ExportList from './OperModal/exportList';
import { trans, locale } from '../../../utils/i18n';
import moment from 'moment';
import lodash, { isEmpty } from 'lodash';
import { debounce } from '../../../utils/utils';

import step1 from '../../../assets/step1.png';
import step2 from '../../../assets/step2.png';
import done from '../../../assets/done.png';

const { Search } = Input;
const { confirm } = Modal;
const { Option } = Select;

@connect((state) => ({
    treeDataSource: state.student.treeDataSource,
    orgInfoById: state.teacher.teacherOrgInfoById, //部门的详细信息
    studentTableList: state.student.studentTableList, //学生人员列表
    // powerStatus: state.global.powerStatus,//是否有权限
    checkUpgrade: state.student.checkUpgrade, // 是否可以升年级
    // employeeList: state.teacher.employeeList,
    isNewYearInit: state.student.isNewYearInit,
    upgradeConfigurationList: state.student.upgradeConfigurationList,
    listSchooliSelectInfo: state.student.listSchooliSelectInfo,
    listSchoolYearSelectInfo: state.student.listSchoolYearSelectInfo,
    currentUser: state.global.currentUser,
    areaList: state.timeTable.areaList,
    studentImportMessage: state.student.studentImportMessage,
    dormitoryList: state.student.dormitoryList,
    schoolBusList: state.student.schoolBusList,
    tutorList: state.student.tutorList,
    gradeGroupList: state.student.gradeGroupList,
}))
export default class ManagementPage extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            checkValue: true, //是否显示子部门学生
            isShowSwitch: false, //只看行政组织
            treeId: 1, //树节点id
            tagCode: '', //部门类型
            isLeaf: false, //是否是叶子节点
            searchValue: undefined, //模糊搜索
            current: 1, //当前页数
            pageSize: 50,
            rowKeys: [], //table选中的index
            rowIds: [], //table选中的id
            searchRole: 'student',
            addStudentVisible: false, //添加学生
            createOrgVisible: false, //新建组织&&编辑组织
            createOrgType: 'create', //新建组织的类型
            setOrgRoleVisible: false, //设置组织角色
            transferStudentVisible: false, //转移学生
            exportModalVisible: false, //批量导出学生档案
            batchEditInfoVisible: false, //批量修改学生档案
            setTutorVisible: false, //批量设置学生导师
            parentsVisible: false, //家长更新信息
            loading: false, //loading加载
            confirmEndClassVisible: false, //结班弹窗
            searchTeacherValue: undefined, // 搜索导师的接口
            searchSpeTeacherValue: undefined, // 搜索特长教练的接口
            employeeList: [], //导师搜索框返回数组
            sepEmployeeList: [], //特长教练搜索框返回数组
            employeeValue: '', //导师搜索框值
            speEmployeeValue: '', //导师搜索框值
            tutorValue: '', //特长教练
            resumptionRecordVisible: false, // 学生复学记录弹窗默认隐藏
            leftSchoolInforVisible: false, // 学生毕业弹窗默认隐藏
            inforUpdateRecordVisible: false, // 学生信息更新记录默认隐藏
            gradeUpVisible: false, // 升年级弹窗默认隐藏
            studentStatus: '', // 学籍状态
            transferDest: '', // 离校去向
            searchStartTime: null, // 搜索开始时间
            searchEndTime: null, // 搜索结束时间
            ifAll: 0, // 默认是取消选择所有
            pageOfRowIdsMap: {}, // 页码对应的ids map结构
            pageOfRowKeysMap: {}, // 页码对应的key map结构
            tableList: [], // 获取table的数据结构
            upGradeModal: false, // 升学年弹层
            selectSchoolId: '', // 学校id
            selectSchooYearlId: '', // 学年id
            currentSchoolYearTime: '', // 当前学年的时间
            selectSchoolYearTime: '', // 选择的学年的时间
            curSchooYearlId: '',
            futureSchoolYearId: '',
            visibleFromExcel: false, // 从Excel导入弹层显隐
            createStudentVisible: false, //直接新建学生弹窗
            fileList: [],
            sexSelectValue: '', //性别
            studentGroupId: '', //id为null时获取学生多传一个字段
            batchImportStudent: false,
            importConfirmBtn: true,
            errorVisible: false,
            studentType: undefined,
            dormId: undefined,
            schoolBus: undefined,
            speTutor: undefined,

            importErrorList: [],
            currentSchoolYear: true, // 是否为当前学年
            name: '', //姓名
            stuNo: '', //学号
            groupId: undefined, //班级
            motherName: '',
            motherMobile: '',
            fatherName: '',
            fatherMobile: '',
            classList: [],
            exportListVisible: false, //导出下载列表visible
            exportType: 1, //本页、 所有页
        };
        this.refCon = null;
    }

    componentDidMount() {
        const { statusType } = this.props;
        if (statusType == 1) {
            this.getlistSchooliSelectInfo();
            this.getDormitoryList();
            this.getSchoolBusList();
        } else {
            this.getTreeOrgFirst();
        }
        // this.props.dispatch({
        //     type: 'global/getCurrentUser',
        // })
        this.props.dispatch({
            type: 'student/listGradeGroup',
            payload: {},
            onSuccess: () => {
                const { gradeGroupList } = this.props;
                let classList = [];
                gradeGroupList && gradeGroupList.length > 0
                    ? gradeGroupList.map((item) => {
                        if (!isEmpty(item?.groupModels)) {
                            classList.push(...item.groupModels);
                        }
                    })
                    : null;
                this.setState({
                    classList,
                });
            },
        });
    }

    componentWillUnmount() {
        clearTimeout(this.clearTreeTimeout);
    }

    componentWillMount() {
        // this.ifHavePower()
        //获取最顶层节点的详情和学生列表
        // this.fetchTreeNodeDetail();
        this.initEmployeeList(1); // 导师
        this.initEmployeeList(2); //特长教练
        this.initSpeTutorList();
        this.getCurrent();
    }

    componentWillUnmount() {
        this.clearData();
    }

    changeExportType = (value) => {
        this.setState({
            exportType: value,
        });
    };

    getCurrent = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'global/getCurrentUser',
            payload: {},
        }).then(() => {
            const { currentUser } = this.props;
            localStorage.setItem('userIdentity', currentUser && currentUser.currentIdentity);
        });
    };
    // 获取学年列表
    getlistSchoolYearSelectInfo = () => {
        const { dispatch } = this.props;
        const { selectSchoolId } = this.state;
        dispatch({
            type: 'student/getListSchoolYear',
            payload: {
                schoolId: selectSchoolId,
            },
            onSuccess: () => {
                const { listSchoolYearSelectInfo } = this.props;
                let curSchooYearlId = '';
                let currentSchoolYearTime = '';
                let futureindex = '';
                let hasfuture = false;
                listSchoolYearSelectInfo &&
                    listSchoolYearSelectInfo.length > 0 &&
                    listSchoolYearSelectInfo.map((item, index) => {
                        if (item.current) {
                            futureindex = index - 1;
                            curSchooYearlId = item.id;
                            currentSchoolYearTime = item.endTime;
                        }
                    });
                if (
                    listSchoolYearSelectInfo &&
                    listSchoolYearSelectInfo.length &&
                    listSchoolYearSelectInfo[futureindex]
                ) {
                    hasfuture = true;
                }
                let noCurSchooYearlId =
                    (listSchoolYearSelectInfo &&
                        listSchoolYearSelectInfo.length > 0 &&
                        listSchoolYearSelectInfo[0]['id']) ||
                    null;
                this.setState(
                    {
                        curSchooYearlId,
                        futureSchoolYearId:
                            hasfuture &&
                            listSchoolYearSelectInfo &&
                            listSchoolYearSelectInfo.length &&
                            listSchoolYearSelectInfo[futureindex]['id'],
                        selectSchooYearlId: curSchooYearlId ? curSchooYearlId : noCurSchooYearlId,
                        currentSchoolYearTime,
                    },
                    () => {
                        // this.fetchTreeNodeDetail();
                        if (listSchoolYearSelectInfo && listSchoolYearSelectInfo.length < 0) {
                            return;
                        }
                        if (listSchoolYearSelectInfo && listSchoolYearSelectInfo.length == 1) {
                            this.getTreeOrgFirst();
                            return;
                        }
                        if (listSchoolYearSelectInfo && listSchoolYearSelectInfo.length >= 2) {
                            this.getNewYearInit();
                            this.getTreeOrgFirst();
                        }
                    }
                );
            },
        });
    };

    getlistSchooliSelectInfo = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'student/getListSchool',
            payload: {},
            onSuccess: () => {
                this.setState(
                    {
                        selectSchoolId: this.props.currentUser.schoolId,
                    },
                    () => {
                        this.getlistSchoolYearSelectInfo();
                    }
                );
            },
        });
    };

    getNewYearInit = () => {
        const { dispatch } = this.props;
        const { selectSchooYearlId, selectSchoolId } = this.state;
        dispatch({
            type: 'student/checkNewYearInit',
            payload: {
                schoolYearId: selectSchooYearlId,
                schoolId: selectSchoolId,
            },
            onSuccess: () => {
                const { isNewYearInit } = this.props;
            },
        });
    };

    initEmployeeList(type) {
        const { dispatch } = this.props;
        const { employeeValue, speEmployeeValue } = this.state;
        let payload = { keyword: employeeValue };
        let requestApi = 'teacher/getEmployee';

        if (type == 2) {
            requestApi = 'teacher/listSpecialtyTutor';
            payload = {
                keyword: speEmployeeValue,
            };
        }
        return dispatch({
            type: requestApi,
            payload,
            onSuccess: (res) => {
                if (type == 1) {
                    this.setState({
                        employeeList: res,
                    });
                } else {
                    this.setState({
                        sepEmployeeList: res,
                    });
                }
            },
        });
    }

    initSpeTutorList() {
        const { dispatch } = this.props;
        const { tutorValue } = this.state;
        return dispatch({
            type: 'teacher/getTutorList',
            payload: {
                keyword: tutorValue ? tutorValue : '',
            },
        });
    }

    // 判断是否可以升年级
    ifCheckUpgrade() {
        const { dispatch } = this.props;
        return dispatch({
            type: 'student/checkUpgrade',
            payload: {
                nodeId: this.state.treeId,
            },
            onSuccess: () => { },
        });
    }

    //判断是否有权限
    ifHavePower() {
        const { dispatch } = this.props;
        return dispatch({
            type: 'global/havePower',
            payload: {},
            onSuccess: () => { },
        });
    }

    //清空数据
    clearData = () => {
        const { dispatch } = this.props;
        this.setState({
            treeId: '',
            createOrgType: 'create', //新建组织的类型
        });
        dispatch({
            type: 'student/clearData',
            payload: {},
            onSuccess: () => { },
        });
        dispatch({
            type: 'teacher/clearData',
            payload: {},
            onSuccess: () => { },
        });
    };

    //格式化树结构
    formatTreeData = (data, type) => {
        if (!data || data.length == 0) return [];
        data.map((item, index) => {
            item.title = `${item.name}（${item.userCount || 0}）`;
            item.children = this.formatTreeData(item.treeNodeList, 'son');
            if (index == 0 && type == 'parent') {
                item.expanded = true;
            } else {
                item.expanded = false;
            }
        });
        return data;
    };

    //获取是否只看行政组织状态
    getIsShowSwitch = (value) => {
        this.setState(
            {
                isShowSwitch: value,
            },
            () => {
                this.getTreeOrgFirst();
            }
        );
    };

    //初始化获取组织树
    getTreeOrgFirst() {
        const { dispatch, statusType } = this.props;
        const { selectSchoolId, selectSchooYearlId } = this.state;
        dispatch({
            type: 'student/getTreeData',
            payload: {
                statusType,
                nodeId: 1, //临时写死
                ifContainUser: true, //是否包含用户
                ignoreVisible: statusType == 1 ? this.state.isShowSwitch : true, //只看行政组织
                schoolYearId: selectSchooYearlId,
                schoolId: selectSchoolId,
            },
            onSuccess: () => {
                const { treeDataSource } = this.props;
                this.setState(
                    {
                        dataSource: this.formatDataSource(treeDataSource),
                        treeId: this.formatDataSource(treeDataSource, 'getId'),
                        tagCode: this.formatDataSource(treeDataSource, 'tagCode'),
                        groupId: this.formatDataSource(treeDataSource, 'studentGroupId'),
                    },
                    () => {
                        this.fetchTreeNodeDetail();
                    }
                );
            },
        });
    }

    //获取组织结构树
    getTreeOrg() {
        const { dispatch, statusType } = this.props;
        const { selectSchooYearlId, selectSchoolId } = this.state;
        let self = this;
        this.clearTreeTimeout = setTimeout(function () {
            dispatch({
                type: 'student/getTreeData',
                payload: {
                    statusType,
                    nodeId: 1, //临时写死
                    ifContainUser: true, //是否包含用户
                    ignoreVisible: self.state.isShowSwitch, //只看行政组织
                    schoolYearId: selectSchooYearlId,
                    schoolId: selectSchoolId,
                },
                onSuccess: () => {
                    const { treeDataSource } = self.props;
                    self.setState({
                        dataSource: self.formatDataSource(treeDataSource),
                        treeId: self.formatDataSource(treeDataSource, 'getId'),
                        tagCode: self.formatDataSource(treeDataSource, 'tagCode'),
                    });
                },
            });
        }, 2000);
    }

    //获取点击的树节点
    getSearchNodeId = (selectedKeys) => {
        let keys = selectedKeys[0] ? selectedKeys[0].split('-') : '';
        this.refCon.clearCheckedAndUserIds &&
            this.refCon.clearCheckedAndUserIds();
        if (!keys) return false;
        this.setState(
            {
                treeId: keys && keys[0],
                tagCode: keys && keys[1],
                isLeaf: keys && JSON.parse(keys[2]),
                studentGroupId: keys && keys[3],
                groupId: keys && keys[3] && keys[3] != 'undefined' ? Number(keys[3]) : undefined,
            },
            () => {
                //根据节点查询信息
                this.setState({
                    loading: true,
                    checkValue: true,
                    current: 1,
                    rowIds: [],
                    // rowKeys: [],
                    pageOfRowIdsMap: {},
                    pageOfRowKeysMap: {},
                });
                if (this.state.treeId && this.state.treeId > 0) {
                    this.fetchTreeNodeDetail();
                } else {
                    this.getStudentList();
                }
            }
        );
    };
    //根据树节点查询详细信息
    fetchTreeNodeDetail = (type) => {
        const { dispatch } = this.props;
        return dispatch({
            type: 'teacher/getOrgInfoById',
            payload: {
                // type 在设置学生毕业时专用
                nodeId: type == 1 ? 1 : this.state.treeId,
                schoolYearId: this.state.selectSchooYearlId,
            },
            onSuccess: () => {
                this.getStudentList();
                this.ifCheckUpgrade();
            },
        });
    };

    changeSelectSchool = (value) => {
        this.setState(
            {
                selectSchoolId: value,
                nodeId: 1,
            },
            () => {
                this.getlistSchoolYearSelectInfo();
            }
        );
    };

    changeSelectSchoolYear = (value) => {
        const { listSchoolYearSelectInfo } = this.props;
        let tempCurrentSchoolYear = false;
        listSchoolYearSelectInfo &&
            listSchoolYearSelectInfo.length > 0 &&
            listSchoolYearSelectInfo.map((item) => {
                if (item.id == value) {
                    tempCurrentSchoolYear = item.current;
                }
            });
        this.setState(
            {
                selectSchooYearlId: value,
                nodeId: 1,
                currentSchoolYear: tempCurrentSchoolYear,
            },
            () => {
                this.getTreeOrgFirst();
                this.getNewYearInit();
                this.fetchTreeNodeDetail();
            }
        );
    };

    //输入搜索条件搜索
    handleSearch = (value) => {
        this.setState(
            {
                searchValue: value,
                current: 1,
            },
            () => {
                this.getStudentList();
            }
        );
    };

    //搜索条件中输入内容
    changeSearch = (e) => {
        this.refCon.clearCheckedAndUserIds &&
            this.refCon.clearCheckedAndUserIds();
        this.setState({
            searchValue: e.target.value,
        });
    };

    //输入导师条件搜索
    handleTeacherSearch = (value, type) => {
        this.refCon.clearCheckedAndUserIds &&
            this.refCon.clearCheckedAndUserIds();

        this.setState(
            {
                [type]: value,
                current: 1,
            },
            () => {
                this.getStudentList();
                if (type == 'searchTeacherValue') {
                    if (!value) {
                        // 点击select 叉号重新获取所以教师
                        this.setState(
                            {
                                searchTeacherValue: '',
                                employeeValue: '',
                            },
                            () => {
                                this.initEmployeeList(1);
                            }
                        );
                    }
                    this.setState({
                        employeeList: [],
                    });
                } else {
                    if (!value && value != 0) {
                        this.setState(
                            {
                                searchSpeTeacherValue: '',
                                speEmployeeValue: '',
                            },
                            () => {
                                this.initEmployeeList(2);
                            }
                        );
                    }
                    // this.setState({
                    //     sepEmployeeList: [],
                    // });
                }
            }
        );
    };
    teacherSearch = (value, searchType, type) => {
        this.setState(
            {
                [type]: value,
            },
            () => {
                this.initEmployeeList(searchType);
            }
        );
    };

    //选择学籍
    changeStudentsStatus = (value) => {
        this.refCon.clearCheckedAndUserIds &&
            this.refCon.clearCheckedAndUserIds();
        this.setState(
            {
                studentStatus: value,
                current: 1,
            },
            () => {
                this.getStudentList();
            }
        );
    };

    //性别筛选
    sexSelect = (value) => {
        this.refCon.clearCheckedAndUserIds &&
            this.refCon.clearCheckedAndUserIds();
        this.setState(
            {
                sexSelectValue: value,
                current: 1,
            },
            () => {
                this.getStudentList();
            }
        );
    };

    //输入离校去向条件搜索
    handleTransferSearch = (value) => {
        this.setState(
            {
                transferDest: value,
            },
            () => {
                this.getStudentList();
            }
        );
    };

    //搜索条件中输入内容
    changeTransferSearch = (e) => {
        this.refCon.clearCheckedAndUserIds &&
            this.refCon.clearCheckedAndUserIds();
        this.setState({
            transferDest: e.target.value,
        });
    };

    //获取学生列表
    getStudentList = () => {
        const { dispatch } = this.props;
        const {
            treeId,
            searchValue,
            pageSize,
            current,
            checkValue,
            searchRole,
            studentStatus,
            searchStartTime,
            searchEndTime,
            transferDest,
            ifAll,
            selectSchooYearlId,
            sexSelectValue,
            studentGroupId,
            dormId,
            schoolBus,
            speTutor,
            studentType,
        } = this.state;
        // if (!treeId) {
        //     message.info(trans('student.selectOrgTips', '请先选择一个组织再操作哦~'));
        //     return false;
        // }
        this.setState({
            loading: true,
            tableList: [],
        });
        let paramsObj = {};
        if (searchRole == 'student') {
            paramsObj.keyWord = searchValue || '';
        } else {
            paramsObj.parentMobile = searchValue || null;
        }
        if (treeId && treeId > 0) {
            paramsObj.nodeId = treeId;
        } else {
            paramsObj.studentGroupId = studentGroupId;
        }
        return dispatch({
            type: 'student/getStudentList',
            payload: {
                // nodeId: treeId,
                pageSize: pageSize,
                pageNum: current,
                ifShowSub: /* checkValue */ true, //是否显示子部门学生
                studentStatusList: this.getStudentStatus(Number(studentStatus)),
                status: studentStatus,
                startTime: (searchStartTime && `${searchStartTime} 00:00:00`) || '',
                endTime: (searchEndTime && `${searchEndTime} 23:59:59`) || '',
                transfer: transferDest,
                statusType: this.props.statusType,
                tutorUserId: this.state.searchTeacherValue,
                specialtyTutorUserId: this.state.searchSpeTeacherValue,
                schoolYearId: selectSchooYearlId,
                gender: sexSelectValue,
                dormId,
                schoolBus,
                speTutor,
                studentType,
                ...paramsObj,
            },
        }).then(() => {
            let { studentTableList } = this.props;
            let tableList = (studentTableList && studentTableList.orgUserList) || [];
            this.setState({
                tableList,
            });

            if (ifAll === 1) {
                let newRowIds = [];
                let newRowKeys = [];
                tableList.map((el) => {
                    newRowIds.push(el.userId);
                    newRowKeys.push(el.key);
                });
                this.setState({
                    loading: false,
                    // rowKeys: [...new Set([...this.state.rowKeys, ...newRowKeys])],
                    rowIds: [...new Set([...this.state.rowIds, ...newRowIds])],
                });
            } else {
                console.log(' 22');
                this.setState({
                    loading: false,
                });
            }
        });
    };

    getStudentStatus = (status) => {
        let { statusType } = this.props;
        if (statusType == 2) {
            // 休学
            return [3];
        }
        if (statusType == 3) {
            // 已经离校
            return [4];
        }
        switch (status) {
            case 1:
                return [1];
            case 2:
                return [2];
            default:
                return [1, 2];
        }
    };

    //切换分页
    switchPage = (page, size) => {
        // this.refCon.clearCheckedAndUserIds &&
        //     this.refCon.clearCheckedAndUserIds();

        this.setState(
            {
                current: page,
                pageSize: size,
            },
            () => {
                this.getStudentList().then(() => {
                    this.refCon.selectThisPageStudent &&
                        this.refCon.selectThisPageStudent()
                });

            }
        );
    };

    //切换每页条数
    switchPageSize = (page, size) => {
        // this.refCon.clearCheckedAndUserIds &&
        //     this.refCon.clearCheckedAndUserIds();

        this.setState(
            {
                current: page,
                pageSize: size,
            },
            () => {
                this.getStudentList().then(() => {
                    this.refCon.selectThisPageStudent &&
                        this.refCon.selectThisPageStudent()
                });
            }
        );
    };

    //添加学生
    addStudent = () => {
        if (!this.state.treeId) {
            message.info(trans('student.selectOrgTips', '请先选择一个组织再操作哦~'));
            return false;
        }
        this.setState({
            addStudentVisible: true,
        });
    };
    // 获取适用场地
    getAddressList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'timeTable/getAreaList',
        });
    };

    //新建组织
    createOrg(type) {
        if (!this.state.treeId) {
            message.info(trans('student.selectOrgTips', '请先选择一个组织再操作哦~'));
            return false;
        }
        this.getAddressList();
        this.setState({
            createOrgVisible: true,
            createOrgType: type,
        });
    }

    //统计table选中的项
    fetchRowKeys = (rowIds) => {
        let { pageOfRowIdsMap, pageOfRowKeysMap, current } = this.state;
        // pageOfRowKeysMap[String(current)] = keys;
        // pageOfRowIdsMap[String(current)] = rowIds;
        let newKeys = [];
        let newIds = [];

        // for (const key in pageOfRowKeysMap) {
        //     if (pageOfRowKeysMap.hasOwnProperty(key)) {
        //         newKeys = newKeys.concat(pageOfRowKeysMap[key]);
        //     }
        // }

        // for (const key in pageOfRowIdsMap) {
        //     if (pageOfRowIdsMap.hasOwnProperty(key)) {
        //         newIds = newIds.concat(pageOfRowIdsMap[key]);
        //     }
        // }

        this.setState({
            // rowKeys: newKeys,
            rowIds,
            pageOfRowKeysMap,
            pageOfRowIdsMap,
            ifAll: 0,
        });
    };

    // 选择本页结果
    selectPageData = () => {
        let { studentTableList } = this.props;
        let { pageOfRowIdsMap, pageOfRowKeysMap, current } = this.state;
        let tableList = (studentTableList && studentTableList.orgUserList) || [];
        let newRowIds = [];
        let newRowKeys = [];
        tableList.map((el) => {
            newRowIds.push(el.userId);
            newRowKeys.push(el.key);
        });
        pageOfRowKeysMap[String(current)] = newRowKeys;
        pageOfRowIdsMap[String(current)] = newRowIds;

        this.setState({
            ifAll: 2,
            pageOfRowKeysMap,
            pageOfRowIdsMap,
            // rowKeys: [...new Set([...this.state.rowKeys, ...newRowKeys])],
            rowIds: [...new Set([...this.state.rowIds, ...newRowIds])],
        });
    };

    // 取消选择全部结果
    selectCancelData = () => {
        this.setState({
            ifAll: 3,
            // rowKeys: [],
            rowIds: [],
            pageOfRowKeysMap: {},
            pageOfRowIdsMap: {},
        });
    };

    //批量移除
    deleteMore = () => {
        const { treeId, rowIds, checkValue, isLeaf, tagCode } = this.state;
        let self = this;
        if (!treeId) {
            message.info(trans('student.selectOrgTips', '请先选择一个组织再操作哦~'));
            return false;
        }
        // if (checkValue && isLeaf == false) {
        //     message.info(
        //         trans('student.noAllowedRemove', '显示子部门学生的条件下，不允许批量移除哦~')
        //     );
        //     return false;
        // }
        if (tagCode != 'COLLEGE') {
            message.info(
                trans(
                    'student.noAllowedRemove',
                    '只有组织架构树选择学院节点时才可以进行批量移除操作'
                )
            );
            return false;
        }
        if (rowIds.length == 0) {
            message.info(trans('student.pleaseChooseStudent', '请先选择要移除的学生~'));
            return false;
        }
        confirm({
            title: trans('student.confirmTransferNum', '您确认移除所选的{$num}个学生吗？', {
                num: rowIds.length,
            }),
            okText: trans('global.confirm', '确定'),
            cancelText: trans('global.cancel', '取消'),
            onOk() {
                const { dispatch } = self.props;
                dispatch({
                    type: 'teacher/deleteMore',
                    payload: {
                        nodeId: self.state.treeId,
                        userIdList: self.state.rowIds,
                    },
                    onSuccess: () => {
                        self.getStudentList();
                        self.getTreeOrg();
                        self.setState({
                            // rowKeys: [],
                            rowIds: [],
                        });
                    },
                });
            },
        });
    };

    //隐藏modal
    hideModal = (type) => {
        switch (type) {
            case 'addStudent':
                this.setState({
                    addStudentVisible: false,
                });
                break;
            case 'createOrg':
                this.setState({
                    createOrgVisible: false,
                });
                break;
            case 'setOrgRole':
                this.setState({
                    setOrgRoleVisible: false,
                });
                break;
            case 'transferStudent':
                this.setState({
                    transferStudentVisible: false,
                });
                break;
            case 'exportSource':
                this.setState({
                    exportModalVisible: false,
                });
                break;
            case 'batchEditStudent':
                this.setState({
                    batchEditInfoVisible: false,
                });
                break;
            case 'setTutor':
                this.setState({
                    setTutorVisible: false,
                });
                break;
            case 'parents':
                this.setState({
                    parentsVisible: false,
                });
                break;
            case 'endClass':
                this.setState({
                    confirmEndClassVisible: false,
                });
                break;
            case 'resumptionRecord':
                this.setState({
                    resumptionRecordVisible: false,
                });
                break;
            case 'leftSchoolInfor':
                this.setState({
                    leftSchoolInforVisible: false,
                });
                break;
            case 'inforUpdateRecord':
                this.setState({
                    inforUpdateRecordVisible: false,
                });
                break;
            case 'gradeUp':
                this.setState({
                    gradeUpVisible: false,
                });
                break;
        }
    };

    //选择搜索条件的角色
    changeRole = (value) => {
        this.refCon.clearCheckedAndUserIds &&
            this.refCon.clearCheckedAndUserIds();
        this.setState(
            {
                searchRole: value,
                searchValue: undefined,
            }
        );
    };

    //格式化部门中的角色
    formatRoleList = (detail) => {
        if (!detail || detail.length == 0) return '---';
        return detail.map((item) => {
            return (
                <em key={item.id}>
                    {locale() != 'en' ? item.name : item.ename ? item.ename : item.name}
                </em>
            );
        });
    };

    //是否勾选子部门学生
    changeCheckbox = (e) => {
        this.setState(
            {
                checkValue: e.target.checked,
                current: 1,
            },
            () => {
                this.getStudentList();
            }
        );
    };

    //设置组织角色
    setOrganizationRole = () => {
        if (!this.state.treeId) {
            message.info(trans('student.selectOrgTips', '请选择一个组织再操作哦~'));
            return false;
        }
        this.setState({
            setOrgRoleVisible: true,
        });
    };

    //转移学生--批量转移
    transferStudentModal = () => {
        const { treeId, checkValue, rowIds, isLeaf, tagCode } = this.state;
        if (!this.state.treeId) {
            message.info(trans('student.selectOrgTips', '请先选择一个组织再操作哦~'));
            return false;
        }
        // if (checkValue && isLeaf == false) {
        //     message.info(
        //         trans('student.noAllowedTransfer', '显示子部门学生的条件下，不允许批量转移哦')
        //     );
        //     return false;
        // }
        // if (tagCode != 'ADMINISTRATIVE_CLASS' && tagCode != 'COLLEGE') {
        //     message.info(
        //         trans(
        //             'student.noAllowedTransfer',
        //             '只有组织架构树选择行政班或学院节点时才可以进行批量转移操作'
        //         )
        //     );
        //     return false;
        // }
        if (rowIds.length == 0) {
            message.info(trans('student.pleaseChooseTransfered', '请先选择要转移的学生~'));
            return false;
        }
        this.setState({
            transferStudentVisible: true,
        });
    };

    //导出学生档案--批量导出
    exportSource = () => {
        const { rowIds } = this.state;
        if (rowIds.length == 0) {
            message.info(trans('student.pleaseChooseExported', '请先选择要导出的学生~'));
            return false;
        }
        this.setState({
            exportModalVisible: true,
        });
    };

    // 下载导出数据
    downloadData = () => {
        this.setState({
            exportListVisible: true,
        });
    };

    //批量修改学生信息
    batchEdit = () => {
        const { rowIds } = this.state;
        if (rowIds.length == 0) {
            message.info(trans('student.pleaseChooseBatched', '请先选择要批量修改的学生~'));
            return false;
        }
        this.setState({
            batchEditInfoVisible: true,
        });
    };

    //批量设置导师
    batchSetTutor = () => {
        const { rowIds } = this.state;
        if (rowIds.length == 0) {
            message.info(trans('student.pleaseSetLeader', '请先选择要批量设置导师的学生~'));
            return false;
        }
        this.setState({
            setTutorVisible: true,
        });
    };

    //邀请家长完善信息
    batchParents = () => {
        const { rowIds } = this.state;
        if (rowIds.length == 0) {
            message.info('请选择需要邀请的家长');
            return false;
        }
        this.setState({
            parentsVisible: true,
        });
    };

    //设置分类节点下的班级已结班
    setEndClass = () => {
        this.setState({
            confirmEndClassVisible: true,
        });
    };

    // 升年级
    gradeUp = () => {
        if (this.props.checkUpgrade) {
            this.setState({
                gradeUpVisible: true,
            });
        } else {
            message.info(trans('student.pleaseSetupHighestGrade', '请先设置最高年级学生毕业'));
        }
    };

    // 修改搜索时间
    changeSearchTime = (type, date, dateString) => {
        let { searchStartTime } = this.state;
        this.refCon.clearCheckedAndUserIds &&
            this.refCon.clearCheckedAndUserIds();
        if (type === 1) {
            this.setState(
                {
                    searchStartTime: dateString,
                },
                () => {
                    this.getStudentList();
                }
            );
        }
        if (type === 2) {
            this.setState(
                {
                    searchEndTime: dateString,
                },
                () => {
                    this.getStudentList();
                }
            );
        }
    };

    // 设置离校信息
    leftSchoolInfor = () => {
        this.setState({
            leftSchoolInforVisible: true,
        });
    };

    // 查看学生复学记录
    resumptionRecord = () => {
        this.setState({
            resumptionRecordVisible: true,
        });
    };

    inforUpdateRecord = () => {
        this.setState({
            inforUpdateRecordVisible: true,
        });
    };
    getSetuPGradeList = () => {
        const { dispatch } = this.props;
        const { selectSchoolId, selectSchooYearlId } = this.state;
        dispatch({
            type: 'student/upgradeConfiguration',
            payload: {
                schoolYearId: selectSchooYearlId,
                schoolId: selectSchoolId,
            },
        });
    };
    // 升学年
    upGrade = () => {
        this.getSetuPGradeList();
        this.setState({
            upGradeModal: true,
        });
    };

    // 关闭升学年
    closeUpGrade = () => {
        this.setState(
            {
                upGradeModal: false,
            },
            () => {
                this.getSetuPGradeList();
            }
        );
    };

    // 关闭Excel导入弹层
    excelModalClose = () => {
        this.setState({
            visibleFromExcel: false,
            fileList: [],
            importConfirmBtn: true,
        });
    };

    // 确定从Excel导入
    sureImport = (e) => {
        const { selectSchoolId } = this.state;
        let { fileList } = this.state;
        let formData = new FormData();
        for (let item of fileList) {
            formData.append('file', item);
            formData.append('schoolId', selectSchoolId);
        }
        if (!lodash.isEmpty(fileList)) {
            this.setState({
                batchImportStudent: true,
            });
            this.props
                .dispatch({
                    type: 'student/importUserList',
                    payload: formData,
                })
                .then(() => {
                    let { studentImportMessage } = this.props;
                    this.setState({
                        batchImportStudent: false,
                    });
                    if (!lodash.isEmpty(studentImportMessage)) {
                        this.setState({
                            fileList: [],
                            importErrorList: studentImportMessage.checkErrorMessageList,
                            // importErrorList: studentImportMessage,
                            errorVisible: true,
                        });
                    } else {
                        this.setState({
                            fileList: [],
                            visibleFromExcel: false,
                            importConfirmBtn: true,
                        });
                        this.getStudentList();
                    }
                });
        }
    };

    formatDataSource = (dataSource, type) => {
        let data = [];
        let id = 1;
        if (type && type === 'getId') {
            if (dataSource && dataSource.length > 0) {
                id = dataSource.length > 0 && dataSource[0].id;
                return id;
            } else {
                return undefined;
            }
        } else if (type && type === 'tagCode') {
            let tagCode = '';
            if (dataSource && dataSource.length > 0) {
                tagCode = dataSource.length > 0 && dataSource[0].tagCode;
            }
            return tagCode;
        } else if (type && type == 'studentGroupId') {
            let groupId = undefined;
            if (dataSource && dataSource.length > 0) {
                groupId = dataSource.length > 0 && dataSource[0].studentGroupId;
            }
            return groupId;
        } else {
            if (dataSource && dataSource.length > 0) {
                data = dataSource;
            }
            return data;
        }
    };

    changeType = (type, value) => {
        this.refCon.clearCheckedAndUserIds &&
            this.refCon.clearCheckedAndUserIds();
        this.setState(
            {
                [type]: value,
            },
            () => {
                this.getStudentList();
            }
        );
    };

    getDormitoryList = () => {
        this.props.dispatch({
            type: 'student/searchDormitoryByWord',
            payload: {},
        });
    };

    getSchoolBusList = () => {
        this.props.dispatch({
            type: 'student/getSchoolBusList',
            payload: {},
        });
    };

    searchTutorByKeyword = (value) => {
        this.setState(
            {
                tutorValue: value,
            },
            () => {
                this.initSpeTutorList();
            }
        );
    };

    changeBaseInfo = (type, e) => {
        this.setState({
            [type]: e.target.value,
        });
    };

    changeClassInfo = (value) => {
        this.setState({
            groupId: value,
        });
    };

    submitCreate = () => {
        const { name, stuNo, groupId, motherName, motherMobile, fatherName, fatherMobile } =
            this.state;
        const { dispatch } = this.props;
        if (!name || !stuNo || !groupId) {
            message.warn('姓名、学号、班级必填！');
            return false;
        }
        if ((fatherName && !fatherMobile) || (!fatherName && fatherMobile)) {
            message.warn('请完善父亲信息！');
            return false;
        }
        if ((!motherName && motherMobile) || (motherName && !motherMobile)) {
            message.warn('请完善母亲信息！');
            return false;
        }
        dispatch({
            type: 'student/createStudent',
            payload: { name, stuNo, groupId, motherName, motherMobile, fatherName, fatherMobile },
            onSuccess: () => {
                this.getStudentList();
                // this.getTreeOrgFirst();
                this.setState({
                    createStudentVisible: false,
                    // groupId: undefined,
                });
            },
        });
    };

    cancelCreate = () => {
        this.setState({
            createStudentVisible: false,
            groupId: undefined,
        });
    };

    closeDownload = () => {
        this.setState({
            exportListVisible: false,
        });
    };

    render() {
        const { orgInfoById, studentTableList, powerStatus, statusType, isNewYearInit } =
            this.props;
        const {
            current,
            searchRole,
            tagCode,
            checkValue,
            isLeaf,
            loading,
            searchValue,
            rowIds,
            studentStatus,
            searchStartTime,
            searchEndTime,
            transferDest,
            ifAll,
            tableList,
            upGradeModal,
            selectSchooYearlId,
            curSchooYearlId,
            futureSchoolYearId,
            visibleFromExcel,
            fileList,
            employeeList,
            sepEmployeeList,
            parentsVisible,
            batchImportStudent,
            importConfirmBtn,
            errorVisible,
            importErrorList,
            studentType,
            dormId,
            schoolBus,
            speTutor,
            currentSchoolYear,
            createStudentVisible,
            name,
            stuNo,
            groupId,
            motherName,
            motherMobile,
            fatherName,
            fatherMobile,
            classList,
            exportListVisible,
            exportType,
        } = this.state;

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
        let orgInfo = orgInfoById || {};

        console.log(orgInfo.orgTagCode, 'orgInfo.orgTagCode');

        // let tableList = studentTableList && studentTableList.orgUserList || [];
        let totalPage = studentTableList && studentTableList.total;
        //是否显示添加学生的入口--行政班、学院、分层班、club类型显示
        let isShowAddStudent =
            tagCode == 'ADMINISTRATIVE_CLASS' ||
                tagCode == 'COLLEGE' ||
                tagCode == 'LAYERED_CLASS' ||
                tagCode == 'CLUB_CLASS'
                ? true
                : false;
        //是否显示编辑组织的入口--行政班、学院、分层班、club、分类节点显示
        let isShowEditOrg =
            tagCode == 'ADMINISTRATIVE_CLASS' ||
                tagCode == 'COLLEGE' ||
                tagCode == 'LAYERED_CLASS' ||
                tagCode == 'CLUB_CLASS' ||
                tagCode == 'CLASSIFY_NODE' ||
                tagCode == 'GRADE'
                ? true
                : false;
        //判断是否有权限新建、编辑、删除组织、设置组织角色
        let havePowerCreate =
            powerStatus.content &&
                powerStatus.content.indexOf('smart:teaching:student:structure:edit') != -1
                ? true
                : false;
        //判断是否有权限添加学生、转移、移除、批量转移、批量移除
        let havePowerTransfer =
            powerStatus.content &&
                (powerStatus.content.indexOf('smart:teaching:student:relation:site') != -1 ||
                    powerStatus.content.indexOf('smart:teaching:studentInfo:all:operation:manager') !=
                    -1 ||
                    powerStatus.content.indexOf('smart:teaching:studentInfo:all:operation:tutor') != -1)
                ? true
                : false;
        //判断是否有权限查看学生信息详情
        let havePowerLookDetail =
            powerStatus.content &&
                (powerStatus.content.indexOf('smart:teaching:student:info:look') != -1 ||
                    powerStatus.content.indexOf('smart:teaching:studentInfo:all:operation:manager') !=
                    -1 ||
                    powerStatus.content.indexOf('smart:teaching:studentInfo:all:operation:tutor') != -1)
                ? true
                : false;
        //判断是否有权限编辑学生、新建、编辑、删除联系人、批量设置导师、批量修改学生
        let havePowerOperStudent =
            powerStatus.content &&
                (powerStatus.content.indexOf('smart:teaching:student:info:edit') != -1 ||
                    powerStatus.content.indexOf('smart:teaching:studentInfo:all:operation:manager') !=
                    -1 ||
                    powerStatus.content.indexOf('smart:teaching:studentInfo:all:operation:tutor') != -1)
                ? true
                : false;
        //判断是否有权限查看学生信息更新记录、邀请家长完善信息
        let havePowerLookOrInvite =
            powerStatus.content &&
                (powerStatus.content.indexOf('smart:teaching:student:info:edit') != -1 ||
                    powerStatus.content.indexOf('smart:teaching:studentInfo:all:operation:manager') !=
                    -1)
                ? true
                : false;
        //判断是否有权限批量导出学生
        let havePowerExportStudent =
            powerStatus.content &&
                (powerStatus.content.indexOf('smart:teaching:studentInfo:export') != -1 ||
                    powerStatus.content.indexOf('smart:teaching:studentInfo:all:operation:manager') !=
                    -1 ||
                    powerStatus.content.indexOf('smart:teaching:studentInfo:all:operation:tutor') != -1)
                ? true
                : false;
        //判断是否显示批量操作入口
        let isShowBatchOper = havePowerTransfer || havePowerOperStudent ? true : false;
        // 判断是否有转学，休学，复学设置等权限
        let havePowerManager =
            powerStatus.content &&
                (powerStatus.content.indexOf('smart:teaching:student:stutas:manage') != -1 ||
                    powerStatus.content.indexOf('smart:teaching:studentInfo:all:operation:manager') !=
                    -1 ||
                    powerStatus.content.indexOf('smart:teaching:studentInfo:all:operation:tutor') != -1)
                ? true
                : false;

        //判断是否展示导入入口
        let havePowerImport =
            powerStatus.content &&
                (powerStatus.content.indexOf('smart:teaching:studentInfo:all:operation:manager') !=
                    -1 ||
                    powerStatus.content.indexOf('smart:teaching:studentInfo:all:operation:tutor') != -1)
                ? true
                : false;
        let menu = (
            <Menu>
                {havePowerTransfer && (
                    <Menu.Item key="0">
                        <span className={styles.batchDeleteBtn} onClick={this.deleteMore}>
                            {trans('student.batchRemove', '批量移除')}
                        </span>
                    </Menu.Item>
                )}

                {havePowerTransfer && (
                    <Menu.Item key="1">
                        <span className={styles.batchDeleteBtn} onClick={this.transferStudentModal}>
                            {trans('student.transferMore', '批量转移到')}
                        </span>
                    </Menu.Item>
                )}
                {havePowerOperStudent && (
                    <Menu.Item key="3">
                        <span className={styles.batchDeleteBtn} onClick={this.batchEdit}>
                            {trans('student.editInfoMore', '批量修改信息')}
                        </span>
                    </Menu.Item>
                )}

                {havePowerOperStudent && (
                    <Menu.Item key="4">
                        <span className={styles.batchDeleteBtn} onClick={this.batchSetTutor}>
                            {trans('student.batchSetLeader', '批量设置导师')}
                        </span>
                    </Menu.Item>
                )}
            </Menu>
        );

        // 导出学生
        let exportMenu = (
            <Menu>
                <Menu.Item key="1">
                    <span className={styles.batchDeleteBtn} onClick={this.exportSource}>
                        {trans('student.exportMore', '批量导出')}
                    </span>
                </Menu.Item>
                <Menu.Item key="2">
                    <span className={styles.batchDeleteBtn} onClick={this.downloadData}>
                        下载导出数据
                    </span>
                </Menu.Item>
            </Menu>
        );

        // 邀请完善信息
        let inviteMenu = (
            <Menu>
                {havePowerLookOrInvite && (
                    <Menu.Item key="5">
                        <span className={styles.batchDeleteBtn} onClick={this.batchParents}>
                            {/* 邀请家长完善信息 */}
                            {trans('student.inviteParents', '邀请家长完善信息')}
                        </span>
                    </Menu.Item>
                )}
                {statusType == 1 && havePowerLookOrInvite && (
                    <Menu.Item key="2">
                        {havePowerExportStudent && (
                            <span
                                className={styles.updateRecord}
                                onClick={this.inforUpdateRecord.bind(this)}
                            >
                                {trans('student.update.record', '学生信息更新记录')}
                            </span>
                        )}
                    </Menu.Item>
                )}
            </Menu>
        );
        let batchMenu = (
            <Menu>
                <Menu.Item
                    key="0"
                    onClick={() =>
                        this.setState(
                            {
                                createStudentVisible: true,
                            },
                            () => {
                                console.log(this.state.groupId, 'groupId');
                            }
                        )
                    }
                >
                    直接新建
                </Menu.Item>
                <Menu.Item
                    key="1"
                    onClick={() => {
                        this.setState({
                            visibleFromExcel: true,
                        });
                    }}
                >
                    {trans('student.batchImport', '批量导入')}
                </Menu.Item>
            </Menu>
        );
        if (statusType == 2 || statusType == 3) {
            menu = (
                <Menu>
                    {/* <Menu.Item key="2">
                        {havePowerExportStudent && (
                            <span className={styles.batchDeleteBtn} onClick={this.exportSource}>
                                {trans('student.exportMore', '批量导出')}
                            </span>
                        )}
                    </Menu.Item> */}
                    <Menu.Item key="3">
                        {havePowerOperStudent && (
                            <span className={styles.batchDeleteBtn} onClick={this.batchEdit}>
                                {trans('student.editInfoMore', '批量修改信息')}
                            </span>
                        )}
                    </Menu.Item>
                </Menu>
            );
        }
        //判断是否有权限访问组织架构
        if (
            powerStatus.content &&
            powerStatus.content.indexOf('smart:teaching:student:structure:look') == -1 &&
            powerStatus.content &&
            powerStatus.content.indexOf('smart:teaching:studentInfo:all:operation:manager') == -1 &&
            powerStatus.content &&
            powerStatus.content.indexOf('smart:teaching:studentInfo:all:operation:tutor') == -1
        ) {
            return (
                <div className={styles.studentManagePage}>
                    <PowerPage />
                </div>
            );
        }

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
            <div
                className={
                    window.top != window.self
                        ? `${styles.studentManagePage} ${styles.fullPage}`
                        : styles.studentManagePage
                }
            >
                <div className={styles.leftBar}>
                    <SortableTree
                        {...this.state}
                        {...this.props}
                        isShowSwitch={true}
                        getSearchNodeId={this.getSearchNodeId}
                        getTreeOrg={this.getTreeOrgFirst.bind(this)}
                        getIsShowSwitch={this.getIsShowSwitch}
                        selectSchoolId={this.state.selectSchoolId}
                        changeSelectSchool={this.changeSelectSchool}
                        listSchooliSelectInfo={this.props.listSchooliSelectInfo}
                        listSchoolYearSelectInfo={this.props.listSchoolYearSelectInfo}
                        changeSelectSchoolYear={this.changeSelectSchoolYear}
                        selectSchooYearlId={this.state.selectSchooYearlId}
                        source="student"
                    />
                </div>
                <div className={styles.rightContainer}>
                    {this.state.treeId && this.state.treeId > 0 ? (
                        <div className={styles.infoCard}>
                            <div className={styles.infoDetail}>
                                <div className={styles.infoTitle}>
                                    <p>
                                        <span className={styles.orgName}>
                                            {locale() == 'en' ? orgInfo.ename : orgInfo.name}
                                            {/* {orgInfo.name || '--'} {orgInfo.ename} */}
                                        </span>
                                        <span>
                                            {locale() != 'en'
                                                ? orgInfo.orgTagName
                                                : orgInfo.orgTagCode}
                                        </span>
                                        {havePowerCreate &&
                                            isShowEditOrg &&
                                            (statusType == 1 || statusType == 3) &&
                                            (selectSchooYearlId == curSchooYearlId ||
                                                selectSchooYearlId == futureSchoolYearId) && (
                                                <a
                                                    className={styles.editOrgBtn}
                                                    onClick={this.createOrg.bind(this, 'edit')}
                                                >
                                                    {trans('global.edit', '编辑')}
                                                </a>
                                            )}
                                        {havePowerCreate &&
                                            tagCode == 'CLASSIFY_NODE' &&
                                            statusType == 1 && (
                                                <a
                                                    className={styles.editOrgBtn}
                                                    onClick={this.setEndClass}
                                                >
                                                    {trans(
                                                        'student.setEndClass',
                                                        '设置该节点下所有班级结班'
                                                    )}
                                                </a>
                                            )}
                                    </p>
                                </div>
                                <div className={styles.infoOther}>
                                    <p>
                                        {orgInfo.orgRoleList &&
                                            orgInfo.orgRoleList.length > 0 &&
                                            orgInfo.orgRoleList.map((item, index) => {
                                                return (
                                                    <span key={index}>
                                                        {item.leader == true && (
                                                            <i
                                                                className={
                                                                    icon.iconfont +
                                                                    ' ' +
                                                                    styles.isLeader
                                                                }
                                                            >
                                                                &#xe74d;
                                                            </i>
                                                        )}
                                                        {locale() != 'en' ? item.name : item.code}：
                                                        {this.formatRoleList(item.userList)}{' '}
                                                    </span>
                                                );
                                            })}
                                        {tagCode != 'CLASSIFY_NODE' &&
                                            havePowerCreate &&
                                            (statusType == 1 || statusType == 3) &&
                                            selectSchooYearlId == curSchooYearlId && (
                                                <a
                                                    className={styles.setOrgBtn}
                                                    onClick={this.setOrganizationRole}
                                                    style={{ paddingLeft: '5px' }}
                                                >
                                                    {trans('organization.setRole', '设置角色')}
                                                </a>
                                            )}
                                    </p>
                                </div>
                            </div>
                            <div className={styles.infoOperation}>
                                {orgInfo.orgTagCode == 'GRADE' &&
                                    !isNewYearInit &&
                                    havePowerManager &&
                                    ((statusType == 1 && orgInfo.highestGrade) ||
                                        statusType == 3) && (
                                        <span
                                            className={`${styles.createOrgBtn} ${styles.gradeUp}`}
                                            onClick={this.leftSchoolInfor.bind(this)}
                                        >
                                            {statusType == 1
                                                ? trans(
                                                    'student.leftSchoolInformation',
                                                    '设置学生毕业'
                                                )
                                                : trans(
                                                    'student.leftSchoolInformationTitle',
                                                    '设置离校信息'
                                                )}
                                        </span>
                                    )}

                                {havePowerCreate &&
                                    statusType == 1 &&
                                    (selectSchooYearlId == curSchooYearlId ||
                                        selectSchooYearlId == futureSchoolYearId) &&
                                    !isNewYearInit && (
                                        <span
                                            className={styles.createOrgBtn}
                                            onClick={this.createOrg.bind(this, 'create')}
                                            style={{
                                                display:
                                                    orgInfo.orgTagCode == 'COLLEGE'
                                                        ? 'none'
                                                        : 'inline-block',
                                            }}
                                        >
                                            {orgInfo.orgTagCode == 'GRADE'
                                                ? trans('global.createClass', '新建班级')
                                                : orgInfo.orgTagCode != 'COLLEGE'
                                                    ? trans('global.addGrade or Class', '新建年级/班级')
                                                    : ''}
                                        </span>
                                    )}
                            </div>
                        </div>
                    ) : null}

                    { }
                    {isNewYearInit && statusType == 1 ? (
                        <div className={styles.init}>
                            <div className={styles.content}>
                                <div className={styles.twoSteps}>
                                    <span className={styles.bigFont}>快速2步</span>
                                    <span className={styles.smallFont}>
                                        完成新学年年级&班级设置
                                    </span>
                                </div>
                                <div className={styles.action}>
                                    <div className={styles.step}>
                                        <img className={styles.step1} src={step1}></img>
                                        <span className={styles.one}>完成行政班升年级</span>{' '}
                                        <span className={styles.doNow} onClick={this.upGrade}>
                                            <i className={icon.iconfont}>&#xe8f7;&nbsp;</i>立即行动
                                        </span>
                                    </div>
                                    <div>
                                        <img className={styles.step2} src={step2}></img>
                                        <span className={styles.two}>创建起始年级&班级</span>
                                    </div>
                                </div>
                                <img className={styles.done} src={done}></img>
                            </div>
                        </div>
                    ) : (
                        tagCode != 'CLASSIFY_NODE' && (
                            <div className={styles.infoTable}>
                                <div className={styles.searchCondition}>
                                    <div className={styles.inputContainerStyle}>
                                        <Select
                                            onChange={this.changeRole}
                                            value={searchRole}
                                            className={styles.changeRoleStyle}
                                            style={{ width: 'auto' }}
                                        >
                                            <Option key={0} value="student">
                                                {trans('student.student', '学生')}
                                            </Option>
                                            <Option key={1} value="parent">
                                                {trans('student.parent', '家长')}
                                            </Option>
                                        </Select>
                                        <Search
                                            value={searchValue}
                                            placeholder={
                                                searchRole == 'student'
                                                    ? '姓名/英文名/学号/手机搜索'
                                                    : '手机'
                                            }
                                            onSearch={this.handleSearch}
                                            onChange={this.changeSearch}
                                            style={{ width: 100 }}
                                            className={styles.searchStyle}
                                        />
                                        <span className={styles.searchItem}>
                                            <span className={styles.title}>
                                                {trans('student.teacherName', '导师')}
                                            </span>
                                            <Select
                                                placeholder={'搜索导师'}
                                                className={styles.searchSelect}
                                                style={{ width: 100 }}
                                                onSearch={debounce((e) =>
                                                    this.teacherSearch(e, 1, 'employeeValue')
                                                )}
                                                onChange={(e) =>
                                                    this.handleTeacherSearch(
                                                        e,
                                                        'searchTeacherValue'
                                                    )
                                                }
                                                showSearch
                                                value={this.state.searchTeacherValue}
                                                optionFilterProp="children"
                                                filterOption={false}
                                                allowClear
                                                dropdownMatchSelectWidth={false}
                                                dropdownStyle={{ width: 'auto' }}
                                            >
                                                {/* <Option value={''}>
                                                    {trans('student.searchAll', '全部')}
                                                </Option> */}
                                                {employeeList &&
                                                    employeeList.length > 0 &&
                                                    employeeList.map((item) => {
                                                        return (
                                                            <Option value={item.id} key={item.id}>
                                                                {item.name} {item.ename}
                                                            </Option>
                                                        );
                                                    })}
                                            </Select>
                                        </span>

                                        <span className={styles.searchItem}>
                                            <span className={styles.title}>
                                                {trans('student.sex', '性别')}
                                            </span>
                                            <Select
                                                defaultValue=""
                                                style={{ width: '65px' }}
                                                className={styles.searchSelectStyle}
                                                onChange={this.sexSelect}
                                            >
                                                <Option value="" key="0">
                                                    {trans('student.searchAll', '全部')}
                                                </Option>
                                                <Option value="1" key="1">
                                                    {trans('global.man', '男')}
                                                </Option>
                                                <Option value="2" key="2">
                                                    {trans('global.woman', '女')}
                                                </Option>
                                            </Select>
                                        </span>

                                        {statusType == 3 && (
                                            <span className={styles.searchItem}>
                                                <span className={styles.title}>
                                                    {trans('student.studentStatus', '学籍状态')}
                                                </span>
                                                <Select
                                                    defaultValue={studentStatus}
                                                    style={{ width: 120 }}
                                                    className={styles.searchSelectStyle}
                                                    onChange={this.changeStudentsStatus}
                                                >
                                                    <Option value={''} key="0">
                                                        {trans('student.searchAll', '全部')}
                                                    </Option>
                                                    {[
                                                        <Option value={5} key="1">
                                                            {trans('student.graduation', '毕业')}
                                                        </Option>,
                                                        <Option value={6} key="2">
                                                            {trans('student.goHighSchool', '升学')}
                                                        </Option>,
                                                        <Option value={2} key="3">
                                                            {trans('student.transfer', '转学')}
                                                        </Option>,
                                                    ]}
                                                </Select>
                                            </span>
                                        )}

                                        {statusType == 3 && (
                                            <Fragment>
                                                <span
                                                    className={`${styles.searchItem} ${styles.searchItemOther}`}
                                                >
                                                    <span className={styles.title}>
                                                        {trans(
                                                            'student.departure-from-school',
                                                            '离校去向'
                                                        )}
                                                    </span>
                                                    <Search
                                                        value={transferDest}
                                                        placeholder={trans(
                                                            'student.searchStudentByTeacher',
                                                            '请输入关键字搜索'
                                                        )}
                                                        onSearch={this.handleTransferSearch}
                                                        onChange={this.changeTransferSearch}
                                                        style={{ width: 180 }}
                                                        className={styles.searchStyle}
                                                    />
                                                </span>
                                            </Fragment>
                                        )}

                                        {(statusType == 2 || statusType == 3) && (
                                            <Fragment>
                                                {statusType == 2 ? (
                                                    <br />
                                                ) : (
                                                    <span style={{ marginLeft: '36px' }}></span>
                                                )}
                                                <span
                                                    className={`${styles.searchItem} ${styles.searchItemOther}`}
                                                >
                                                    <span className={styles.title}>
                                                        {trans(
                                                            'student.start-end-time',
                                                            '起止时间'
                                                        )}
                                                    </span>
                                                    <DatePicker
                                                        value={
                                                            (searchStartTime &&
                                                                moment(searchStartTime)) ||
                                                            null
                                                        }
                                                        className={styles.time}
                                                        onChange={this.changeSearchTime.bind(
                                                            this,
                                                            1
                                                        )}
                                                    />
                                                    <span className={styles.line}>-</span>
                                                    <DatePicker
                                                        value={
                                                            (searchEndTime &&
                                                                moment(searchEndTime)) ||
                                                            null
                                                        }
                                                        className={styles.time}
                                                        onChange={this.changeSearchTime.bind(
                                                            this,
                                                            2
                                                        )}
                                                    />
                                                </span>
                                            </Fragment>
                                        )}

                                        <span className={styles.searchItem}>
                                            <span className={styles.title}>教工子女</span>
                                            <Select
                                                allowClear
                                                style={{ width: '100px' }}
                                                className={styles.searchSelectStyle}
                                                value={studentType}
                                                onChange={this.changeType.bind(this, 'studentType')}
                                                placeholder="请选择"
                                                dropdownMatchSelectWidth={false}
                                                dropdownStyle={{ width: 'auto' }}
                                            >
                                                <Option value="0" key="0">
                                                    {trans('student.searchAll', '全部')}
                                                </Option>
                                                <Option value="1" key="1">
                                                    全职教工子女
                                                </Option>
                                                <Option value="2" key="2">
                                                    外包顾问子女
                                                </Option>
                                            </Select>
                                        </span>
                                        <span className={styles.searchItem}>
                                            <span className={styles.title}>宿舍</span>
                                            <Select
                                                allowClear
                                                style={{ width: '88px' }}
                                                className={styles.searchSelectStyle}
                                                placeholder="宿舍名"
                                                value={dormId}
                                                showSearch
                                                onChange={this.changeType.bind(this, 'dormId')}
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    option.props.children
                                                        .toLowerCase()
                                                        .indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {this.props.dormitoryList.map((item) => {
                                                    return (
                                                        <Option key={item.id} value={item.id}>
                                                            {item.cName}
                                                        </Option>
                                                    );
                                                })}
                                            </Select>
                                        </span>
                                        <span className={styles.searchItem}>
                                            <span className={styles.title}>校车</span>
                                            <Select
                                                allowClear
                                                style={{ width: '100px', marginTop: '6px' }}
                                                className={styles.searchSelectStyle}
                                                placeholder="请选择"
                                                value={schoolBus}
                                                onChange={this.changeType.bind(this, 'schoolBus')}
                                                dropdownMatchSelectWidth={false}
                                                dropdownStyle={{ width: 'auto' }}
                                                showSearch
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    option.props.children
                                                        .toLowerCase()
                                                        .indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {this.props.schoolBusList.map((item) => {
                                                    return (
                                                        <Option key={item} value={item}>
                                                            {item}
                                                        </Option>
                                                    );
                                                })}
                                            </Select>
                                        </span>

                                        <span className={styles.searchItem}>
                                            <span className={styles.title}>特长教练</span>
                                            <Select
                                                placeholder={'搜索特长教练'}
                                                className={styles.searchSelect}
                                                style={{ width: 100 }}
                                                onSearch={debounce((e) =>
                                                    this.teacherSearch(e, 2, 'speEmployeeValue')
                                                )}
                                                onChange={(e) =>
                                                    this.handleTeacherSearch(
                                                        e,
                                                        'searchSpeTeacherValue'
                                                    )
                                                }
                                                showSearch
                                                value={this.state.searchSpeTeacherValue}
                                                optionFilterProp="children"
                                                filterOption={false}
                                                allowClear
                                                dropdownMatchSelectWidth={false}
                                                dropdownStyle={{ width: 'auto' }}
                                            >
                                                {sepEmployeeList &&
                                                    sepEmployeeList.length > 0 &&
                                                    sepEmployeeList.map((item) => {
                                                        return (
                                                            <Option value={item.id} key={item.id}>
                                                                {item.name} {item.ename}
                                                            </Option>
                                                        );
                                                    })}
                                            </Select>
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.searchNav}>
                                    <div className={styles.leftCondition}>
                                        <span className={styles.personNum}>
                                            {trans('student.student', '班级学生')}{' '}
                                            <em>
                                                {trans('student.totalNumber', '共 {$num} 人', {
                                                    num: totalPage || 0,
                                                })}
                                            </em>
                                        </span>
                                    </div>
                                    <div className={styles.rightCondition}>
                                        {statusType == 2 && havePowerManager && (
                                            <p
                                                className={styles.updateRecord}
                                                onClick={this.resumptionRecord.bind(this)}
                                            >
                                                <Icon type="setting" className={styles.icon} />
                                                {trans('student.goBack.record', '查看复学记录')}
                                            </p>
                                        )}
                                        {/* 20231023拿掉 */}
                                        {/* {isLeaf == false && (
                                            <p>
                                                <Checkbox
                                                    onChange={this.changeCheckbox}
                                                    checked={checkValue}
                                                >
                                                    <span className={styles.checkboxContent}>
                                                        {trans(
                                                            'student.showSubDepartment',
                                                            '显示子部门学生'
                                                        )}
                                                    </span>
                                                </Checkbox>
                                            </p>
                                        )} */}
                                    </div>
                                    <div className={styles.batchCondition}>
                                        <Modal
                                            title={trans('global.importStudents', '批量导入学生')}
                                            visible={visibleFromExcel}
                                            onCancel={this.excelModalClose}
                                            onOk={debounce(this.sureImport)}
                                            className={styles.exportModal}
                                            okText={trans(
                                                'global.importScheduleConfirm',
                                                '确认导入'
                                            )}
                                        >
                                            <Spin
                                                spinning={batchImportStudent}
                                                tip={trans(
                                                    'global.file uploading',
                                                    '文件正在上传中'
                                                )}
                                            >
                                                <div>
                                                    <span className={styles.explain}>
                                                    </span>
                                                    <p>
                                                        <span style={{ marginRight: '8px' }}>
                                                            ①
                                                        </span>
                                                        {trans(
                                                            'global.downloadTemplate',
                                                            '下载导入模板，批量填写学生家长信息'
                                                        )}
                                                        <a
                                                            href="/api/teaching/student/userTemplateDownload"
                                                            target="_blank"
                                                            style={{ marginLeft: '20px' }}
                                                        >
                                                            {trans(
                                                                'global.downloadImportTemplate',
                                                                '下载导入模板'
                                                            )}
                                                        </a>
                                                    </p>
                                                    <p>
                                                        <span style={{ marginRight: '8px' }}>
                                                            ②
                                                        </span>
                                                        {trans(
                                                            'global.uploadForm',
                                                            '上传填写好的信息表'
                                                        )}
                                                    </p>
                                                </div>
                                                <div className={styles.upLoad}>
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
                                                                    {...uploadProps}
                                                                    maxCount={1}
                                                                >
                                                                    <Button
                                                                        type="primary"
                                                                        disabled={!importConfirmBtn}
                                                                        style={{
                                                                            backgroundColor:
                                                                                '#3b6ff5',
                                                                        }}
                                                                    >
                                                                        {/* <Icon type="upload" /> */}
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
                                            </Spin>
                                        </Modal>
                                        <Modal
                                            visible={errorVisible}
                                            footer={[
                                                <Button
                                                    type="primary"
                                                    className={styles.reUpload}
                                                    style={{ backgroundColor: '#3b6ff5' }}
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
                                            title="导入学生失败信息"
                                            width={720}
                                        >
                                            <p style={{ textAlign: 'center' }}>
                                                {trans('global.thereAre', '当前上传的文件中共有')}{' '}
                                                &nbsp;
                                                <span style={{ color: 'red' }}>
                                                    {importErrorList && importErrorList.length > 0
                                                        ? importErrorList.length
                                                        : null}{' '}
                                                </span>
                                                &nbsp;
                                                {trans(
                                                    'global.pleaseUploadAgain',
                                                    '条错误，请调整后重新上传'
                                                )}
                                            </p>
                                            <Table
                                                columns={errorColumns}
                                                dataSource={importErrorList}
                                                rowKey="lineNumber"
                                                pagination={false}
                                            ></Table>
                                            {/* {importErrorList && importErrorList.length > 0
                                                ? importErrorList.map((item) => {
                                                      return (
                                                          <div style={{ textAlign: 'center' }}>
                                                              {item}
                                                          </div>
                                                      );
                                                  })
                                                : null} */}
                                        </Modal>
                                        <Modal
                                            width={420}
                                            className={styles.createStudentStyle}
                                            visible={createStudentVisible}
                                            title="新建学生"
                                            destroyOnClose={true}
                                            onOk={this.submitCreate}
                                            onCancel={this.cancelCreate}
                                        >
                                            <div className={styles.contentStyle}>
                                                <span className={styles.leftStyle}>
                                                    <span style={{ color: 'red' }}>*</span>姓名
                                                </span>
                                                <span className={styles.rightStyle}>
                                                    <Input
                                                        placeholder="请输入"
                                                        className={styles.inputBaseStyle}
                                                        onChange={(e) =>
                                                            this.changeBaseInfo('name', e)
                                                        }
                                                    />
                                                </span>
                                            </div>
                                            <div className={styles.contentStyle}>
                                                <span className={styles.leftStyle}>
                                                    <span style={{ color: 'red' }}>*</span>学号
                                                </span>
                                                <span className={styles.rightStyle}>
                                                    <Input
                                                        placeholder="请输入"
                                                        className={styles.inputBaseStyle}
                                                        onChange={(e) =>
                                                            this.changeBaseInfo('stuNo', e)
                                                        }
                                                    />
                                                </span>
                                            </div>
                                            <div className={styles.contentStyle}>
                                                <span className={styles.leftStyle}>
                                                    <span style={{ color: 'red' }}>*</span>班级
                                                </span>
                                                <span className={styles.rightStyle}>
                                                    <Select
                                                        style={{ width: 150 }}
                                                        placeholder="请搜索选择"
                                                        className={styles.inputStyle}
                                                        showSearch
                                                        optionFilterProp="children"
                                                        filterOption={(input, option) =>
                                                            option.props.children
                                                                .toLowerCase()
                                                                .indexOf(input.toLowerCase()) >= 0
                                                        }
                                                        onChange={this.changeClassInfo}
                                                        value={groupId}
                                                    >
                                                        {classList.map((el) => {
                                                            return (
                                                                <Select.Option
                                                                    key={el.id}
                                                                    value={el.id}
                                                                >
                                                                    {el.name}
                                                                </Select.Option>
                                                            );
                                                        })}
                                                    </Select>
                                                </span>
                                            </div>
                                            <div className={styles.contentStyle}>
                                                <span className={styles.leftStyle}>父亲</span>
                                                <span className={styles.rightStyle}>
                                                    <Input
                                                        placeholder="请输入姓名"
                                                        className={styles.inputStyle}
                                                        onChange={(e) =>
                                                            this.changeBaseInfo('fatherName', e)
                                                        }
                                                    />
                                                    <Input
                                                        style={{ marginLeft: 8, width: 130 }}
                                                        placeholder="请输入手机号"
                                                        className={styles.inputStyle}
                                                        onChange={(e) =>
                                                            this.changeBaseInfo('fatherMobile', e)
                                                        }
                                                    />
                                                </span>
                                            </div>
                                            <div className={styles.contentStyle}>
                                                <span className={styles.leftStyle}>母亲</span>
                                                <span className={styles.rightStyle}>
                                                    <Input
                                                        placeholder="请输入姓名"
                                                        className={styles.inputStyle}
                                                        onChange={(e) =>
                                                            this.changeBaseInfo('motherName', e)
                                                        }
                                                    />
                                                    <Input
                                                        style={{ marginLeft: 8, width: 130 }}
                                                        placeholder="请输入手机号"
                                                        className={styles.inputStyle}
                                                        onChange={(e) =>
                                                            this.changeBaseInfo('motherMobile', e)
                                                        }
                                                    />
                                                </span>
                                            </div>
                                        </Modal>
                                        <div className={styles.right}>
                                            {rowIds.length > 0 && (
                                                <Fragment>
                                                    {trans(
                                                        'student.select.number',
                                                        '已选择:{$num}名学生',
                                                        {
                                                            num: exportType == 1 ? rowIds.length : studentTableList && studentTableList.total,
                                                        }
                                                    )}
                                                </Fragment>
                                            )}
                                        </div>
                                        <div className={styles.left}>
                                            {havePowerImport && currentSchoolYear && (
                                                <Dropdown overlay={batchMenu} trigger={['click']}>
                                                    <a
                                                        style={{
                                                            padding: '0px 2px 0 10px',
                                                            color: 'white',
                                                            background: '#3b6ff5',
                                                        }}
                                                        className={styles.batchButton}
                                                    >
                                                        新建学生
                                                        <Icon type="down" />
                                                    </a>
                                                </Dropdown>
                                            )}

                                            {isShowBatchOper && currentSchoolYear && (
                                                <Dropdown overlay={menu} trigger={['click']}>
                                                    <a
                                                        className={styles.batchButton}
                                                        style={{ marginLeft: '10px' }}
                                                    >
                                                        <i className={icon.iconfont}>&#xe62d;</i>
                                                        {trans(
                                                            'student.batchOperation',
                                                            '批量操作'
                                                        )}
                                                    </a>
                                                </Dropdown>
                                            )}

                                            {havePowerExportStudent && (
                                                <Dropdown overlay={exportMenu} trigger={['click']}>
                                                    <a
                                                        className={styles.batchButton}
                                                        style={{ marginLeft: 10, padding: '0 0 0 10px' }}
                                                    >
                                                        导出学生
                                                        <Icon type="down" />
                                                    </a>
                                                </Dropdown>
                                            )}

                                            {(havePowerLookOrInvite ||
                                                (statusType == 1 && havePowerLookOrInvite)) && (
                                                    <Dropdown overlay={inviteMenu} trigger={['click']}>
                                                        <a
                                                            className={styles.batchButton}
                                                            style={{ marginLeft: 10, padding: '0 0 0 10px' }}
                                                        >
                                                            邀请完善信息
                                                            <Icon type="down" />
                                                        </a>
                                                    </Dropdown>
                                                )}

                                            {havePowerTransfer &&
                                                isShowAddStudent &&
                                                statusType == 1 &&
                                                selectSchooYearlId == curSchooYearlId &&
                                                orgInfo.orgTagCode != 'ADMINISTRATIVE_CLASS' &&
                                                orgInfo.orgTagName != '行政班' && (
                                                    <Button
                                                        className={styles.btn}
                                                        onClick={this.addStudent}
                                                        type="primary"
                                                    >
                                                        <i className={icon.iconfont}>&#xe75a;</i>
                                                        {trans('student.addStudent', '添加学生')}
                                                    </Button>
                                                )}
                                            <span
                                                className={styles.reloadBtn}
                                                onClick={this.getStudentList}
                                            >
                                                <i className={icon.iconfont}>&#xe732;</i>
                                                {trans('global.refresh', '刷新')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.personList}>
                                    <Spin tip="loading..." spinning={loading}>
                                        <StudentTable
                                            {...this.state}
                                            {...this.props}
                                            schoolId={this.props.currentUser.schoolId}


                                            tableSource={tableList}
                                            selectCancelData={this.selectCancelData}
                                            selectPageData={this.selectPageData}
                                            fetchRowKeys={this.fetchRowKeys}
                                            getStudentList={this.getStudentList}
                                            changeExportType={this.changeExportType}
                                            havePowerTransfer={havePowerTransfer}
                                            havePowerLookDetail={havePowerLookDetail}
                                            havePowerOperStudent={havePowerOperStudent}
                                            getTreeOrg={this.getTreeOrg.bind(this)}
                                            onRef={(ref) =>
                                                this.refCon = ref
                                            }
                                        />
                                    </Spin>
                                </div>
                                <div className={styles.paginationStyle}>
                                    <div className={styles.pageContainer}>
                                        <Pagination
                                            showSizeChanger
                                            showQuickJumper
                                            current={current}
                                            total={totalPage}
                                            locale="zh-CN"
                                            defaultPageSize={50}
                                            pageSizeOptions={[
                                                '20',
                                                '50',
                                                '100',
                                                '500',
                                                '1000'
                                            ]}
                                            onChange={this.switchPage}
                                            onShowSizeChange={this.switchPageSize}
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>
                <AddStudent
                    {...this.state}
                    hideModal={this.hideModal}
                    getStudentList={this.getStudentList}
                />
                <CreateOrg
                    {...this.state}
                    hideModal={this.hideModal}
                    getTreeOrg={this.getTreeOrg.bind(this)}
                    clearData={this.clearData}
                    fetchTreeNodeDetail={this.fetchTreeNodeDetail}
                    areaList={this.props.areaList}
                />
                <SetOrgRole
                    {...this.state}
                    hideModal={this.hideModal}
                    orgInfo={orgInfo}
                    fetchTreeNodeDetail={this.fetchTreeNodeDetail}
                />
                <TransferStaff
                    {...this.state}
                    hideModal={this.hideModal}
                    transferType="batch"
                    getTreeOrg={this.getTreeOrg.bind(this)}
                    getStudentList={this.getStudentList}
                />
                <ExportStudentSource
                    {...this.state}
                    statusType={this.props.statusType}
                    hideModal={this.hideModal}
                    getStudentStatus={this.getStudentStatus}
                    getStudentList={this.getStudentList}
                    downloadData={this.downloadData}
                    total={studentTableList && studentTableList.total ? studentTableList.total : 0}
                />
                <BatchEditInfo
                    {...this.state}
                    hideModal={this.hideModal}
                    batchEdit={this.batchEdit}
                    getStudentList={this.getStudentList}
                    downloadData={this.downloadData}
                />
                <SetTutor
                    {...this.state}
                    hideModal={this.hideModal}
                    getStudentList={this.getStudentList}
                />
                {parentsVisible && (
                    <Parents
                        {...this.state}
                        hideModal={this.hideModal}
                        getStudentList={this.getStudentList}
                    />
                )}

                <ConfirmEndClass
                    {...this.state}
                    hideModal={this.hideModal}
                    getTreeOrg={this.getTreeOrg.bind(this)}
                />
                <ResumptionRecord {...this.state} {...this.props} hideModal={this.hideModal} />
                <LeftSchoolInfor
                    {...this.state}
                    {...this.props}
                    getTreeOrg={this.getTreeOrg.bind(this)}
                    fetchTreeNodeDetail={this.fetchTreeNodeDetail}
                    hideModal={this.hideModal}
                />
                <StudentInforRecord {...this.state} {...this.props} hideModal={this.hideModal} />
                <GradeUp {...this.state} {...this.props} hideModal={this.hideModal} />
                {upGradeModal && (
                    <UpGradeSet
                        upGradeModal={this.state.upGradeModal}
                        closeUpGrade={this.closeUpGrade}
                        upgradeConfigurationList={this.props.upgradeConfigurationList}
                        dispatch={this.props.dispatch}
                        selectSchoolId={this.state.selectSchoolId}
                        selectSchooYearlId={this.state.selectSchooYearlId}
                        getTreeOrgFirst={this.getTreeOrgFirst.bind(this)}
                        getNewYearInit={this.getNewYearInit}
                        fetchTreeNodeDetail={this.fetchTreeNodeDetail}
                    ></UpGradeSet>
                )}

                {exportListVisible && (
                    <ExportList
                        exportListVisible={exportListVisible}
                        closeDownload={this.closeDownload}
                    />
                )}
            </div>
        );
    }
}
