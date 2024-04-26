//课程计划
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './index.less';
import {
    Select,
    Modal,
    TreeSelect,
    Pagination,
    Input,
    Checkbox,
    Spin,
    Form,
    Icon,
    Button,
    Upload,
    Table,
    message,
    Tabs,
    Tree,
    AutoComplete,
    Divider,
    Radio,
} from 'antd';
import CoursePlanItem from './list.js';
import PowerPage from '../../PowerPage/index';
import { trans, locale } from '../../../utils/i18n';
import { getUrlSearch } from '../../../utils/utils';
import noPlan from '../../../assets/noCoursePlan.jpg';
import icon from '../../../icon.less';
import lodash, { isEmpty, map } from 'lodash';
import { debounce } from '../../../utils/utils';
import AddStudentPlan from '../../../components/CourseTeacherDetail/component/addStudentOfClassForPlan';
import MenuInner from '../../CourseTeacherDetail/component/menuInner';
import NewVersion from './newVersion';
import AddStudent from '../../CommonModal/AddStudent';
import { cp } from 'fs';

const { Option } = Select;
const { Search } = Input;
const confirm = Modal.confirm;
const CheckboxGroup = Checkbox.Group;
const { TabPane } = Tabs; //切换
const { TreeNode } = Tree;
@Form.create()
@connect((state) => ({
    allGrade: state.time.allGrade,
    courseLists: state.time.getCourseLists,
    semesterList: state.time.selectAllSchoolYear,
    gradeList: state.time.gradeList,
    classId: getUrlSearch('classId'),
    newSubjectList: state.course.newSubjectList,
    schoolList: state.course.schoolList,
    courseList: state.course.courseList,
    coursePlanList: state.course.coursePlanList,
    newTeacherLists: state.course.newTeacherLists,
    studentGroupList1: state.course.studentGroupList1,
    onlyHaveClass: state.course.onlyHaveClass,
    powerStatus: state.global.powerStatus, //是否有权限
    courseBySubject: state.timeTable.courseBySubject, //科目-课程联动
    allStage: state.time.allStage,
    currentUser: state.global.currentUser,
    planSubjectList: state.timeTable.planSubjectList,
    coursePlanningGreadListInfo: state.course.coursePlanningGreadListInfo,
    planningSemesterInfo: state.course.planningSemesterInfo,
    planningSchoolListInfo: state.course.planningSchoolListInfo,
    importByTypeCalendar: state.course.importByTypeCalendar,
    checkByTypeCalendar: state.course.checkByTypeCalendar,
    importClass: state.course.importClass,
    checkClass: state.course.checkClass,
    importStudent: state.course.importStudent,
    checkStudent: state.course.checkStudent,
    getCourseLists: state.course.getCourseLists,
    gradeDetail: state.course.gradeDetail,
    allAddress: state.course.allAddress,
    linkClass: state.course.linkClass,
    allSuitGrades: state.course.allSuitGrades,
    updateInfo: state.course.updateInfo,
    createClassInfo: state.course.createClassInfo,
    delClassInfo: state.course.delClassInfo,
    addStudentLists: state.course.addStudentLists,
    importTeacher: state.course.importTeacher,
    checkTeacher: state.course.checkTeacher,
    stuLists: state.course.stuLists,
    coursePlanningGreadListInfoForSelect: state.course.coursePlanningGreadListInfoForSelect,
    getClasses: state.course.getClasses,
    ToDetailId: '',
    isAllGrade: false,
}))
export default class CoursePlan extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            semesterValue: '',
            semesterValueNew: '',
            semesterId: '',
            schoolId: '',
            gradeValue: '',
            gradeId: '',
            subjectValue: '',
            courseValue: [],
            historyModal: false,
            teacherValue: [],
            studentGroupValue: [],
            toAllClassValue: [],
            updateLinkClassValue: [],
            stage: '',
            historySemester: '',
            plainOption: [],
            plainOptionid: [],
            selectList: [],
            current: 1,
            pageSize: 10,
            checkedList: [],
            indeterminate: false,
            checkAll: false,
            isok: false,
            schoolSection: '',
            teachingOrgId: '',
            SearchOf: '',
            changeClasses: '',
            selectGradeValue: '',
            keydownStatus: false, // 是否支持回车事件
            planningScoolId: '',
            semesterStartTime: '',
            semesterEndTime: '',
            copyCard: '',
            importCoursePlanModelVisible: false, //导入课时计划model
            importConfirmBtn: true,
            isChecking: false,
            isUploading: false,
            coursePlanFileList: [],
            checkErrorMessageList: [],
            checkModalVisibility: false,
            successModalVisibility: false,
            successNumber: '',
            failureNumber: '',
            importClassModelVisible: false,
            importStudentModelVisible: false,
            importClassErrModal: false,
            importTeacherModelVisible: false,
            classFileList: [],
            studentFileList: [],
            teacherFileList: [],
            changeTabPage: 1,
            changeClassStudent: 1,
            visible: false,
            CreateClassVisible: false, //创建班级弹框显示与否
            deleteVisiblefalse: false, //删除班级弹框
            confirmDirty: false,
            autoCompleteResult: [],
            areaList: [],
            siteValue: [],
            gradeIdToDetail: null,
            groupName: '',
            gradeChineseName: null,
            gradeEnglishName: null,
            gradeAbbreviation: null,
            AddressList: null,
            suitGradeLists: null,
            suitGradeList: [],
            createSuitGradeList: [], //新建班级的适应年级列表
            suitAddressList: [],
            CreateSuitAddressList: [], //新建班级的适应场地列表
            associatedGroupList: [], //从显现出来的班级中挑选中的项
            associatedGroupLists: [], //年级改变，对用的关联班级也改变
            StuMessages: [],
            keyWords: '',
            stuStatus: false,
            total: 0,
            page: 1,
            stuListsArray: [], //table表学生列表数组
            stuNum: '', //学生总数
            readingNumber: null, //在读学生数量
            leaveNumber: null, //离班学生数量
            stuPageSize: 30,
            stuPage: 1,
            createClassName: '',
            createClassEname: '',
            classAbbreviation: '',
            createGradeList: [],
            createAssociatedGroup: [],
            suitSemesterId: null,
            transferStudentModalVisible: false,
            removeStudentModalVisible: false,
            LayeredClass: [],
            targetGroupId: '',
            studentIdList: '',
            studentTableLoading: false,
            addStudentModalVisible: false,
            classIdList: [],
            KeyWord: '',
            createAssociatedLists: [],
            exportGroupIdList: [],
            isClickConflict: false,
            groupList: [],
            allSuitGrades: [], //新增或修改的全部年级
            newassociatedGroupList: [], //修改班级最终的关联班级
            allGroup: [],
            originalClass: [],
            optionalClasses: [],
            selectVisble: false, //选择关联班级弹框显示与否
            confirmLoading: false,

            importType: 1,
            plateType: false, //新版or旧版
            gradeFilterValue: undefined,

            currentGroupId: '', //当前学生groupId， 转移和移除用
            singleTransfer: false, //单个还是批量转移 移除
        };
        this.child = null;
    }

    judgeMessage = () => {
        if (this.state.isChecking) {
            return true;
        }
        if (this.state.isUploading) {
            return false;
        }
    };

    //判断是否有权限访问
    ifHavePower() {
        const { dispatch } = this.props;
        return dispatch({
            type: 'global/havePower',
            payload: {},
        });
    }

    initClassPlan = (id, chooseCoursePlanId, coursePlanId) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'courseBaseDetail/getGroupSelectDetail',
            payload: {
                id,
                chooseCoursePlanId,
                coursePlanId,
            },
        }).then(() => {
            const { groupSelectDetail: elt } = this.props;
            let siteArr = [];

            elt.addressModels &&
                elt.addressModels.length > 0 &&
                elt.addressModels.map((el, i) => {
                    siteArr.push(el.id);
                });

            this.setState({
                siteValue: siteArr,
                name: elt.name,
                ename: elt.englishName,
                minStudentCount: elt.minStudentCount,
                maxStudentCount: elt.maxStudentCount,
            });
        });
    };

    componentWillMount() {
        this.ifHavePower();
        this.getStageGrade(); //获取全部学段下的全部年级
        this.getCurrentUserInfo();
    }

    componentDidMount() {
        this.getGrade();
        this.getCourse();
        this.getAddress();

        this.getStudentGroup(); // 原全部班级 复制用
        this.getOnlyClass();
        this.getAllStage();
        this.getPlanningSchool();
    }

    componentDidUpdate(props, state) {
        if (JSON.stringify(props.currentUser) != JSON.stringify(this.props.currentUser)) {
            console.log('componentDidUpdate User');
            console.log('props.currentUser :>> ', props.currentUser);
            console.log('this.props.currentUser :>> ', this.props.currentUser);
            if (props.currentUser) {
                this.getPlanningSchool();
            }
        }
    }

    getAddress = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'course/allAddress',
        });
    };

    getPlanningSchool = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'course/getCouserPlanningSchoolList',
            onSuccess: () => {
                const { currentUser } = this.props;
                this.setState(
                    {
                        schoolId: currentUser.schoolId,
                    },
                    () => {
                        if (this.state.schoolId || this.state.schoolId === 0) {
                            this.getSemesterInfo();
                            this.getTeacher();
                            this.getSubject();
                        }
                    }
                );
            },
        });
    };
    getSemesterInfo = () => {
        const { dispatch } = this.props;
        const { schoolId, plateType } = this.state;
        console.log('plateType: ', plateType);
        dispatch({
            type: 'course/selectBySchoolIdAllSemester',
            payload: {
                schoolId,
            },
            onSuccess: () => {
                const { planningSemesterInfo } = this.props;

                //current：true时表示当前学期，如果没有返回第一个学期
                let currentSemester = planningSemesterInfo.find((item) => item.current);
                if (currentSemester) {
                    this.setState(
                        {
                            semesterValue: currentSemester.id,
                            semesterStartTime: currentSemester.startTime,
                            semesterEndTime: currentSemester.endTime,
                        },
                        () => {
                            if (this.state.plateType) {
                                this.child.getXlsxTeacherPlan();
                            }
                        }
                    );
                } else {
                    this.setState(
                        {
                            semesterValue: planningSemesterInfo[0].id,
                            semesterStartTime: planningSemesterInfo[0].startTime,
                            semesterEndTime: planningSemesterInfo[0].endTime,
                        },
                        () => {
                            if (this.state.plateType) {
                                this.child.getXlsxTeacherPlan();
                            }
                        }
                    );
                }
                if (!this.state.plateType) {
                    this.getCoursePlan();
                }
            },
        });
    };

    //删除班级
    delClassInfo = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'course/deleteClass',
            payload: {
                groupId: this.state.gradeIdToDetail,
                groupName: this.state.classType,
                suitSemesterId: this.state.semesterValue,
            },
            onSuccess: () => {
                message.success('删除班级成功！');
            },
        }).then(() => {
            this.setState({
                groupName: '',
            });
            this.getCoursePlanningGread();
        });
    };

    //添加学生
    addStudentLists = () => {
        const { dispatch } = this.props;
        let gradeIdToDetail = this.state.gradeIdToDetail;
        gradeIdToDetail = parseInt(gradeIdToDetail);
        dispatch({
            type: 'course/addStudent',
            payload: {
                targetGroupId: gradeIdToDetail,
                studentIdList: null,
                semesterId: this.state.semesterValue,
            },
            onSuccess: () => {
                message.success('添加学生成功！');
            },
        }).then(() => {
            this.queryStudentLists();
        });
    };

    //新增班级
    createClassInfo = () => {
        // debugger
        const { dispatch } = this.props;
        let createGradeList = this.state.createGradeList;
        createGradeList = this.filterSuitGrade(createGradeList);
        let createAddress = this.state.createAddress;
        createAddress = this.filterSuitAddress(createAddress);
        let createAssociatedGroup = this.state.createAssociatedGroup;
        createAssociatedGroup = this.filterCreateLinkClass(createAssociatedGroup);
        dispatch({
            type: 'course/createClass',
            payload: {
                groupName: this.state.createClassName,
                groupEnglishName: this.state.createClassEname,
                groupAbbreviation: this.state.classAbbreviation,
                type: 5,
                suitGradeList: createGradeList,
                suitAddressList: createAddress,
                associatedGroupList: createAssociatedGroup,
                suitSemesterId: this.state.semesterValue,
            },
        }).then(() => {
            this.setState({
                createClassName: '',
                createClassEname: '',
                classAbbreviation: '',
                createGradeList: [],
                createAddress: [],
                createAssociatedLists: [],
                createAssociatedGroup: [],
            });
            this.getCoursePlanningGread();
        });
    };

    handleClose = (removedTag) => {
        const originalClass = this.state.originalClass.filter((tag) => tag !== removedTag);
        this.setState({ originalClass });
    };

    filterAllGroupIdList = (arr) => {
        let groupIdList = [];
        arr &&
            arr.length > 0 &&
            arr.map((item, index) => {
                if (item.studentGroupList) {
                    item.studentGroupList.map((el, idx) => {
                        groupIdList.push(el.id);
                    });
                }
            });
        return groupIdList;
    };

    //查询学生列表
    queryStudentLists = (bool) => {
        const { dispatch, coursePlanningGreadListInfo, gradeDetail } = this.props;
        const {studentGroupValue} = this.state;

        // Number(gradeDetail.groupId)
        console.log(gradeDetail, 'gradeDetail')

        console.log(this.state.gradeIdToDetail, 'gradeIdToDetail')
        let gradeIdToDetail = JSON.parse(JSON.stringify(this.state.gradeIdToDetail)) ;
        console.log(gradeIdToDetail, 'gradeIdToDetail')
        if (!Array.isArray(gradeIdToDetail)) {
            let tempGroupIdList = [];
            // if(bool){
                // tempGroupIdList = this.filterAllGroupIdList(coursePlanningGreadListInfo);
                // gradeIdToDetail = tempGroupIdList;
            // }else{
            //     tempGroupIdList = [gradeIdToDetail]
            //     gradeIdToDetail = tempGroupIdList
            // }
            
            if(typeof gradeIdToDetail == 'number'){
                console.log(567, '888', bool)
                if(typeof bool == 'boolean' ){
                    gradeIdToDetail = [Number(gradeDetail.groupId)]
                }else{
                    // gradeIdToDetail=[null]
                    tempGroupIdList = this.filterAllGroupIdList(coursePlanningGreadListInfo);
                    gradeIdToDetail = tempGroupIdList;
                }
                
            }else{
                console.log(789, '888')
                tempGroupIdList = this.filterAllGroupIdList(coursePlanningGreadListInfo);
                gradeIdToDetail = tempGroupIdList;
            }
            
        } else {
            if(gradeIdToDetail.length == 0){
                gradeIdToDetail = [null];
            }else{
                gradeIdToDetail = [...gradeIdToDetail];
            }
        }
        this.setState({
            studentTableLoading: true,
            stuListsArray: [],
        });
        dispatch({
            type: 'course/queryStuLists',
            payload: {
                groupIdList: gradeIdToDetail,
                semesterId: this.state.semesterValue,
                keyWords: this.state.keyWords,
                studentIsOut: this.state.stuStatus,
                pageSize: this.state.stuPageSize,
                pageNumber: this.state.stuPage,
            },
        }).then(() => {
            const { stuLists } = this.props;
            let list =
                stuLists.classStudentDTOList &&
                stuLists.classStudentDTOList.map((el, i) => ({
                    ...el,
                    key: el.studentId,
                    index: i,
                }));
            this.setState({
                stuListsArray: list,
                readingNumber: stuLists.readingNumber,
                leaveNumber: stuLists.leaveNumber,
                stuNum: stuLists.total,
                studentTableLoading: false,
            });
        });
    };
    //修改班级信息
    updateClassInfo = () => {
        const { dispatch } = this.props;
        let newSuitAddress = this.state.suitAddressList;
        newSuitAddress = this.filterSuitAddress(newSuitAddress);
        let newSuitGrade = this.state.suitGradeList;
        newSuitGrade = this.filterSuitGrade(newSuitGrade);
        dispatch({
            type: 'course/updateClassInfo',
            payload: {
                groupId: this.state.gradeIdToDetail,
                groupName: this.state.gradeChineseName,
                groupEnglishName: this.state.gradeEnglishName,
                groupAbbreviation: this.state.gradeAbbreviation,
                suitGradeList: newSuitGrade,
                suitAddressList: newSuitAddress,
                associatedGroupList: this.state.originalClass,
                type: this.state.classType,
                suitSemesterId: this.state.semesterValue,
            },
            onSuccess: () => {
                message.success('修改班级信息成功！');
            },
        });
    };
    //根据年级获取关联班级（联动）
    getLinkClass = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'course/getLinkClass',
            payload: {
                studentGroupId: this.state.gradeIdToDetail,
                semesterId: this.state.semesterValue,
                gradeIdList: this.state.suitGradeList,
            },
        }).then(() => {
            const { linkClass } = this.props;
            this.setState({
                associatedGroupLists: linkClass,
                optionalClasses: linkClass,
            });
        });
    };

    clearAll = () => {
        this.setState({
            originalClass: [],
        });
    };

    //根据班级id找对象
    findObjById = (id) => {
        let list = [];
        id &&
            id.length &&
            id.map((it) => {
                this.state.optionalClasses &&
                    this.state.optionalClasses.length > 0 &&
                    this.state.optionalClasses.map((item, index) => {
                        if (item.groupId == it) {
                            list.unshift(item);
                        }
                    });
            });
        return list;
    };

    //获取全部班级
    suitGrades = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'course/suitGrades',
            payload: {},
        }).then(() => {
            const { allSuitGrades } = this.props;
            this.setState({
                allSuitGrades,
            });
        });
    };

    //新增课程获取关联班级
    getCreateLinkClass = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'course/getLinkClass',
            payload: {
                studentGroupId: null,
                semesterId: this.state.semesterValue,
                gradeIdList: this.state.createGradeList,
            },
        }).then(() => {
            const { linkClass } = this.props;
            this.setState({
                createAssociatedLists: linkClass,
            });
        });
    };

    //根据班级id获取详情
    getGradeDetail = () => {
        const { dispatch } = this.props;
        return dispatch({
            type: 'course/getGradeDetail',
            payload: {
                studentGroupId: this.state.gradeIdToDetail,
                // studentGroupId: 2,
                semesterId: this.state.semesterValue,
            },
        }).then(() => {
            const { gradeDetail } = this.props;
            let newList = [];
            if (gradeDetail.associatedGroupList && gradeDetail.associatedGroupList.length) {
                gradeDetail.associatedGroupList.map((item) => {
                    newList.push(item.groupId);
                });
            }
            this.setState({
                groupName: gradeDetail.groupName,
                gradeChineseName: gradeDetail.groupName,
                gradeEnglishName: gradeDetail.groupEnglishName,
                gradeAbbreviation: gradeDetail.groupAbbreviation,
                suitAddressList: gradeDetail.suitAddressList.map((item) => item.id),
                suitGradeList: gradeDetail.suitGradeList.map((item) => item.id),
                gradeIdToDetail: Number(gradeDetail.groupId),
                associatedGroupList: [...gradeDetail.associatedGroupList],
                originalClass: [...gradeDetail.associatedGroupList],
                classType: gradeDetail.type,
            });
        });
    };

    getCurrentUserInfo = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'global/getCurrentUser',
        }).then(() => {
            const { currentUser } = this.props;
            localStorage.setItem('userIdentity', currentUser && currentUser.currentIdentity);
        });
    };
    schoolList() {
        const { dispatch } = this.props;
        dispatch({
            type: 'course/schoolList',
            payload: {},
            onSuccess: () => {},
        });
    }

    getAllStage() {
        const { dispatch } = this.props;
        dispatch({
            type: 'time/allStage',
            payload: {},
            onSuccess: () => {},
        });
    }

    //获取课
    getCourseList() {
        const { dispatch } = this.props;
        const { semesterValue, SearchOf, schoolId, schoolSection, teachingOrgId, subjectValue } =
            this.state;
        dispatch({
            type: 'time/getCourseLists',
            payload: {
                // schoolYearId: semesterValue,
                stage: this.state.schoolSection,
                gradeId: this.state.teachingOrgId,
                subjectId: this.state.subjectValue,
                name: SearchOf,
                schoolId, // 校区id 点击带人
                semesterId: semesterValue, // 学期id 点击带入
            },
        }).then(() => {
            const { courseLists } = this.props;
            const plainOption = [];
            const plainOptionid = [];
            courseLists.map((item, index) => {
                if (item.choose) {
                    plainOptionid.push(item.id);
                }
                plainOption.push({
                    value: item.id,
                    label: item.name,
                    disabled: item.choose,
                });
            });
            this.setState({
                plainOption,
                // checkedList:plainOptionid,
            });
        });
    }

    //获取科目
    getSubject() {
        const { dispatch } = this.props;
        const { schoolId } = this.state;
        dispatch({
            type: 'course/getNewSubjectList',
            payload: {
                schoolId: schoolId,
            },
        });
    }

    //获取课程
    getCourse() {
        const { dispatch } = this.props;
        const { subjectValue } = this.state;
        dispatch({
            type: 'course/getCourseList',
            payload: {
                subjectId: subjectValue,
            },
        });
    }

    //获取年级
    getGrade() {
        const { dispatch } = this.props;
        dispatch({
            type: 'time/getGradeList',
            payload: {},
            onSuccess: () => {
                const { gradeList } = this.props;
                let tempGradeId = undefined;
                tempGradeId = !isEmpty(gradeList) && gradeList[0].id;
                this.setState({
                    gradeFilterValue: tempGradeId,
                });
            },
        });
    }

    //获取班级---含有分类
    getStudentGroup() {
        const { dispatch } = this.props;
        const { gradeId } = this.state;
        dispatch({
            type: 'course/getStudentGroup1',
            payload: {
                gradeId: gradeId,
            },
        });
    }

    // 获取全部班级
    getCoursePlanningGread = () => {
        const { dispatch, currentUser, allGrade } = this.props;
        const { gradeId, schoolId, semesterValue, KeyWord } = this.state;
        let groupList = [];
        allGrade &&
            allGrade.length > 0 &&
            allGrade.map((item) => {
                groupList.push(item.id);
            });
        this.setState({
            suitGrade: groupList,
        });
        dispatch({
            type: 'course/getGradeByCoursePlanning',
            payload: {
                gradeIdList: gradeId ? [gradeId] : groupList, // 适用年级
                semesterId: semesterValue, // 学期id
                schoolId: schoolId, // 校区id
                orgId: currentUser.eduGroupcompanyId, // 机构id
                keyWord: KeyWord,
            },
            onSuccess: () => {
                this.setState({
                    keyWord: '',
                });
            },
        });
        this.getCoursePlanSubjectList();
    };

    //获取除行政班外所有班级
    getClassExceptAdmin = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'course/getAllClasses',
            payload: {
                studentGroupId: this.state.gradeIdToDetail,
                semesterId: this.state.semesterValue,
                gradeIdList: this.state.isAllGrade == true ? undefined : this.state.suitGradeList,
            },
        }).then(() => {
            const { getClasses } = this.props;
        });
    };

    // 获取全部班级对年纪
    getCoursePlanningGreadForSelect = () => {
        const { dispatch, currentUser, allGrade } = this.props;
        const { gradeId, schoolId, semesterValue } = this.state;
        let groupList = [];
        allGrade &&
            allGrade.length > 0 &&
            allGrade.map((item) => {
                groupList.push(item.id);
            });
        dispatch({
            type: 'course/getGradeByCoursePlanningForSelect',
            payload: {
                gradeIdList: gradeId ? [gradeId] : groupList, // 适用年级
                semesterId: semesterValue, // 学期id
                schoolId: schoolId, // 校区id
                orgId: currentUser.eduGroupcompanyId, // 机构id
                keyWord: '',
            },
            onSuccess: () => {
                this.setState({
                    keyWord: '',
                });
                this.getCoursePlanSubjectList();
            },
        });
    };

    //获取班级--只有班级,表格中使用
    getOnlyClass() {
        const { dispatch } = this.props;
        const { gradeId } = this.state;
        dispatch({
            type: 'course/getOnlyClass',
            payload: {
                gradeId: gradeId,
            },
        });
    }

    //获取教师列表
    getTeacher() {
        const { dispatch, currentUser } = this.props;
        const { schoolId } = this.state;
        dispatch({
            type: 'course/newGetTeacherList',
            payload: {
                eduGroupCompanyId: currentUser.eduGroupcompanyId,
                schoolId,
            },
        });
    }

    //获取学期id
    getSemesterId = (time) => {
        const { semesterList } = this.props;
        let semesterId;
        semesterList &&
            semesterList.length > 0 &&
            semesterList.map((item, index) => {
                if (item.id == time.id) {
                    semesterId = item.id;
                }
            });
        return semesterId;
    };

    //选择学期
    changeSemester = (value) => {
        const { semesterList } = this.props;
        let semesterValueNew;
        semesterList &&
            semesterList.length > 0 &&
            semesterList.map((item, index) => {
                if (item.id == value) {
                    semesterValueNew = item.startTime + '-' + item.endTime;
                }
            });

        this.setState(
            {
                semesterValue: value,
                semesterValueNew: semesterValueNew,
                semesterId: this.getSemesterId(value),
                courseValue: [],
                teacherValue: [],
                studentGroupValue: [],
                toAllClassValue: [],
                updateLinkClassValue: [],
            },
            () => {
                const { planningSemesterInfo } = this.props;
                planningSemesterInfo &&
                    planningSemesterInfo.length > 0 &&
                    planningSemesterInfo.map((item, index) => {
                        if (this.state.semesterValue == item.id) {
                            this.setState({
                                semesterEndTime: item.endTime,
                                semesterStartTime: item.startTime,
                            });
                        }
                    });
                if (!this.state.plateType) {
                    this.getCoursePlan();
                } else {
                    this.child.getXlsxTeacherPlan();
                }
            }
        );
    };

    changeFilterGrade = (value) => {
        this.setState(
            {
                gradeFilterValue: value,
            },
            () => {
                this.child.getXlsxTeacherPlan();
            }
        );
    };

    //选择年级
    changeGrade = (value) => {
        let selectValue = value.split('+'),
            gradeValue = selectValue[0],
            gradeId =
                selectValue[1] && selectValue[1] != 'undefined' ? Number(selectValue[1]) : null;
        this.setState(
            {
                gradeValue: gradeValue,
                gradeId: gradeId,
                selectGradeValue: value,
                courseValue: [],
                teacherValue: [],
                studentGroupValue: [],
                toAllClassValue: [],
                updateLinkClassValue: [],
            },
            () => {
                this.getOnlyClass();
                if (!this.state.plateType) {
                    this.getCoursePlan();
                }
            }
        );
    };

    //按课程选择学段
    stage = (value) => {
        this.setState(
            {
                stage: value, //当前选的学段
                selectGradeValue: '', //选中的年级值
                gradeValue: '',
                gradeId: '',
                courseValue: [],
                teacherValue: [],
                studentGroupValue: [],
                toAllClassValue: [],
                updateLinkClassValue: [],
            },
            () => {
                this.getStageGrade(value).then(() => {
                    const { allGrade } = this.props;
                    let groupList = [];
                    allGrade &&
                        allGrade.length > 0 &&
                        allGrade.map((item) => {
                            groupList.push(item.id);
                        });
                    this.getCoursePlan();
                });
            }
        );
    };
    //按班级选择学段
    stageToClass = (value) => {
        this.setState(
            {
                stage: value, //当前选的学段
                selectGradeValue: '', //选中的年级值
                gradeValue: '',
                gradeId: '', //年级id
                courseValue: [],
                teacherValue: [],
                studentGroupValue: [],
                toAllClassValue: [],
                updateLinkClassValue: [],
            },
            () => {
                this.getStageGrade(value).then(() => {
                    const { allGrade } = this.props;
                    let groupList = [];
                    allGrade &&
                        allGrade.length > 0 &&
                        allGrade.map((item) => {
                            groupList.push(item.id);
                        });
                });
            }
        );
    };

    //获取学段下的年级
    getStageGrade(semesterId = '') {
        const { dispatch } = this.props;
        return dispatch({
            type: 'time/getallGrade',
            payload: {
                stage: semesterId,
            },
        });
    }

    clearFilter = () => {
        this.setState({
            courseValue: [],
            teacherValue: [],
            studentGroupValue: [],
            toAllClassValue: [],
            updateLinkClassValue: [],
        });
    };
    // 通用change
    handleChange = (type, value, info) => {
        const { ToDetailId } = this.state;
        if (type === 'subjectValue') {
            this.setState(
                {
                    courseValue: [],
                    subjectValue: value,
                },
                () => {
                    this.getCourseList();
                }
            );
            return;
        }
        if (type == 'schoolId') {
            this.setState(
                {
                    schoolId: value,
                    courseValue: [],
                    teacherValue: [],
                    studentGroupValue: [],
                    toAllClassValue: [],
                    updateLinkClassValue: [],
                },
                () => {
                    this.getSemesterInfo();
                    this.getSubject();
                }
            );
            return;
        }

        if (type == 'studentGroupPropShow') {
            const { coursePlanningGreadListInfo } = this.props;
            console.log(value, 'value')
            let isEmptyFlag = true
            if (value.length !== 0) {
                this.setState({
                    ToDetailId: Number(value[0]),
                    groupName: '',
                });
                isEmptyFlag = false
            } else {
                return;
            }

            if (value.find((item) => Number.isNaN(Number(item)))) {
                console.log(1111,'ssss')
                const gradeValue = value[0].slice(1);
                const targetGradeObj = coursePlanningGreadListInfo.find(
                    (item) => item.name == gradeValue
                );
                const exportGroupIdList = targetGradeObj
                    ? targetGradeObj.studentGroupList.map((item) => item.id)
                    : [];
                if (info.selectedNodes.length > 0) {
                    this.setState(
                        {
                            exportGroupIdList,
                            gradeIdToDetail: exportGroupIdList,
                            isAllGrade: true,
                        },
                        () => {
                            this.queryStudentLists(isEmptyFlag);
                        }
                    );
                }
                return;
            } else if (!value.find((item) => Number.isNaN(Number(item)))) {
                console.log(2222,'ssss')
                this.setState(
                    {
                        gradeIdToDetail: value.length === 0 ? ToDetailId : Number(value[0]),
                        exportGroupIdList: [Number(value[0])],
                        stuStatus: false,
                        stuPage: 1,
                        // keyWords: "",
                        // stuPageSize: 30,
                        allGroup: [],
                        isAllGrade: false,
                    },
                    () => {
                        this.getGradeDetail().then(()=>{
                            this.queryStudentLists(isEmptyFlag)
                        });
                    }
                );
                return;
            }
        }
        //按班级页面搜索
        if (type == 'toAllClassValue') {
            this.setState(
                {
                    toAllClassValue: value,
                },
                () => {
                    this.getGradeDetail();
                }
            );
            return;
        }

        this.setState(
            {
                [type]: value,
            },
            () => {
                // this.getCoursePlan();
                if (!this.state.plateType) {
                    this.getCoursePlan();
                }
            }
        );
    };

    //获取所有年级的ids
    getAllGradeId = () => {
        let result = [];
        let gradeList = this.props.allGrade || [];
        gradeList.length > 0 &&
            gradeList.map((item) => {
                result.push(item.id);
            });
        return result;
    };

    transformStrToNumber = (list) => {
        let newList = [];
        list.forEach((item) => {
            newList.push(Number(item));
        });
        return newList;
    };

    //查询课时计划列表
    getCoursePlan = (type) => {
        // debugger
        const { dispatch } = this.props;
        const {
            gradeId,
            semesterValue,
            subjectValue,
            courseValue,
            studentGroupValue,
            stage,
            teacherValue,
            current,
            pageSize,
            semesterId,
            changeClasses,
            schoolId,
        } = this.state;

        this.setState({
            isok: false,
        });

        let _courseValue = this.transformStrToNumber(courseValue).filter(
            (el) => typeof el === 'number'
        );
        dispatch({
            type: 'course/getCoursePlan',
            payload: {
                schoolId: schoolId,
                pageNum: current,
                pageSize: pageSize,
                schoolYearId: semesterValue,
                subjectId: subjectValue, //科目id
                courseIds: _courseValue, //课程id
                //"teachingOrgId": gradeId,//年级id
                gradeIdList: gradeId ? [gradeId] : stage ? this.getAllGradeId() : [],
                classIds: studentGroupValue, //班级id
                stage: stage, //学段
                teacherIds: teacherValue, //老师id
                // "semesterId": semesterId,//学期id
                status: changeClasses === '' ? null : changeClasses, //开课筛选,
                orgCampusId: schoolId, // 校区id
                semesterId: semesterValue, //学期id
            },
        }).then(() => {
            this.setState({
                isok: true,
            });
        });
        this.getCoursePlanningGread();
    };

    //处理课程数据
    formatCourseData = (courseList) => {
        if (!courseList || courseList.length < 0) return;
        let courseData = [];
        courseList.map((item, index) => {
            let obj = {};
            obj.title = locale() !== 'en' ? item.name : item.englishName;
            obj.key = 'subject-' + item.id;
            obj.value = 'subject-' + item.id;
            obj.children = this.formatCourseChildren(item.courseList);
            courseData.push(obj);
        });

        return courseData;
    };

    //处理课程子节点
    formatCourseChildren = (arr) => {
        if (!arr || arr.length < 0) return [];
        let resultArr = [];
        arr.map((item) => {
            let obj = {
                title: locale() !== 'en' ? item.name : item.englishName,
                value: item.id,
                key: item.id,
            };
            resultArr.push(obj);
        });
        return resultArr;
    };

    //展示班级列表
    formatCourseList = (courseList) => {
        if (!courseList || courseList.length < 0) return;
        let courseData = [];
        let newArr = [];
        courseList.map((item, index) => {
            newArr = newArr.concat(item.courseList);
        });
        courseData = this.formatCourseChildren(newArr);
        return courseData;
    };

    //处理课程父节点（预览用）
    formatParentCourses = (courseList) => {
        if (!courseList || courseList.length < 0) return;
        let courseData = [];
        courseList.map((item, index) => {
            let obj = {};
            obj.title = item.name;
            obj.key = 'subject-' + item.id;
            obj.value = 'subject-' + item.id;
            // obj.children = this.formatCourseChildren(item.courseList)
            courseData.push(obj);
        });

        return courseData;
    };

    //处理教师数据
    formatTeacherData = (teacherList) => {
        if (!teacherList || teacherList.length < 0) return;
        let teacherData = [];
        teacherList.map((item, index) => {
            let obj = {};
            obj.title = item.name + ' ' + `${item.englishName ? item.englishName : ' '}`;
            obj.key = item.teacherId;
            obj.value = item.teacherId;
            obj.ename = item.englishName || ' ';
            teacherData.push(obj);
        });
        return teacherData;
    };

    //处理班级数据复用
    formatStudentGroupShow = (groupList, type) => {
        if (!groupList || groupList.length < 0) return;
        let studentGroup = [];
        if (type == 'search') {
            groupList.map((item, index) => {
                let obj = {};
                obj.title = item.name;
                // obj.title = locale() != 'en' ? item.name : item.ename;
                obj.key = item.type + item.name;
                obj.value = item.type + item.name;
                obj.children = this.formatClassDataShow(item.studentGroupList, 'search');
                studentGroup.push(obj);
            });
        } else if (type == 'list') {
            groupList.map((item, index) => {
                let obj = item;
                obj.title = item.name;
                obj.key = item.id;
                obj.value = item.id;
                studentGroup.push(obj);
            });
        } else if (type == 'groupList') {
            groupList.map((item, index) => {
                let obj = {};
                obj.title = item.name;
                obj.key = item.type + item.name;
                obj.value = item.type + '&';
                obj.disabled = item.type == 3 ? false : true;
                obj.children = this.formatClassData(item.studentGroupList, 'groupList');
                studentGroup.push(obj);
            });
        } else if (type == 'applyClassGroup') {
            groupList.map((item, index) => {
                let obj = {};
                obj.title = item.name;
                obj.key = item.type + item.name;
                obj.value = item.id;
                obj.disabled = true;
                obj.children = this.formatClassData(item.studentGroupList, 'applyClass');
                studentGroup.push(obj);
            });
        }
        return studentGroup;
    };

    //处理班级数据
    formatStudentGroup = (groupList, type) => {
        if (!groupList || groupList.length < 0) return;
        let studentGroup = [];
        if (type == 'search') {
            groupList.map((item, index) => {
                let obj = {};
                obj.title = item.name;
                obj.key = item.type + item.name;
                obj.value = item.type + item.name;
                obj.children = this.formatClassData(item.studentGroupList, 'search');
                studentGroup.push(obj);
            });
        } else if (type == 'list') {
            groupList.map((item, index) => {
                let obj = item;
                obj.title = item.name;
                obj.key = item.id;
                obj.value = item.id;
                studentGroup.push(obj);
            });
        } else if (type == 'groupList') {
            groupList.map((item, index) => {
                let obj = {};
                obj.title = item.name;
                obj.key = item.type + item.name;
                obj.value = item.type + '&';
                obj.disabled = item.type == 3 ? false : true;
                obj.children = this.formatClassData(item.studentGroupList, 'groupList');
                studentGroup.push(obj);
            });
        } else if (type == 'applyClassGroup') {
            groupList.map((item, index) => {
                let obj = {};
                obj.title = item.name;
                obj.key = item.type + item.name;
                obj.value = item.id;
                obj.disabled = true;
                obj.children = this.formatClassData(item.studentGroupList, 'applyClass');
                studentGroup.push(obj);
            });
        }
        return studentGroup;
    };
    //处理子级班
    formatClassData = (classList, val) => {
        const { copyCard } = this.state;
        let group = [];
        copyCard &&
            copyCard.studentGroupList &&
            copyCard.studentGroupList.map((item, index) => {
                group.push(item.id);
            });
        if (!classList || classList.length < 0) return [];
        let classGroup = [];
        let isDisabled = false;
        classList.map((item, index) => {
            group.map((el) => {
                if (el == item.id) isDisabled = true;
            });
            let obj = {};
            obj.title = locale() !== 'en' ? item.name : item.ename;
            obj.key = item.id;
            obj.id = item.id;
            obj.disabled = isDisabled;
            obj.type = item.type;
            obj.ename = item.ename;

            obj.value = val == 'groupList' ? item.id + '*' + item.type : item.id;
            classGroup.push(obj);
        });
        return classGroup;
    };
    formatClassDataShow = (classList, val) => {
        const { copyCard } = this.state;
        let group = [];
        copyCard &&
            copyCard.studentGroupList &&
            copyCard.studentGroupList.map((item, index) => {
                group.push(item.id);
            });
        if (!classList || classList.length < 0) return [];
        let classGroup = [];
        let isDisabled = false;
        classList.map((item, index) => {
            group.map((el) => {
                if (el == item.id) isDisabled = true;
            });
            let obj = {};
            obj.title =
                item.studentCount >= 0
                    ? locale() !== 'en'
                        ? item.name + '(' + item.studentCount + ')'
                        : item.ename + '(' + item.studentCount + ')'
                    : locale() !== 'en'
                    ? item.name
                    : item.ename;
            obj.key = item.id;
            obj.id = item.id;
            obj.disabled = isDisabled;
            obj.type = item.type;
            obj.ename = item.ename;

            obj.value = val == 'groupList' ? item.id + '*' + item.type : item.id;
            classGroup.push(obj);
        });
        return classGroup;
    };

    //导入历史计划
    importHistory = () => {
        this.getCourseList();
        this.setState({
            historyModal: true,
        });
    };

    //导入课时计划
    importCoursePlan = () => {
        this.setState({
            importCoursePlanModelVisible: true,
            importConfirmBtn: true,
            coursePlanFileList: [],
            isChecking: false,
            isUploading: false,
        });
    };

    //导出课时计划
    exportCoursePlan = () => {
        const {
            gradeId,
            semesterValue,
            subjectValue,
            courseValue,
            studentGroupValue,
            stage,
            teacherValue,
            current,
            pageSize,
            semesterId,
            changeClasses,
            schoolId,
        } = this.state;

        let _courseValue = this.transformStrToNumber(courseValue).filter(
            (el) => typeof el === 'number'
        );

        const data = {
            schoolId: schoolId,
            pageNum: current,
            pageSize: pageSize,
            schoolYearId: semesterValue,
            subjectId: subjectValue, //科目id
            courseIds: _courseValue, //课程id
            //"teachingOrgId": gradeId,//年级id
            gradeIdList: gradeId ? [gradeId] : stage ? this.getAllGradeId() : [],
            classIds: studentGroupValue, //班级id
            stage: stage, //学段
            teacherIds: teacherValue, //老师id
            // "semesterId": semesterId,//学期id
            status: changeClasses === '' ? null : changeClasses, //开课筛选,
            orgCampusId: schoolId, // 校区id
            semesterId: semesterValue, //学期id
        };
        let json = JSON.stringify(data);
        let lastJson = encodeURI(json);
        window.open(`/api/defaultCoursePlan/exportCoursePlanning?data=${lastJson}`);
    };

    exportStudent = () => {
        const { semesterValue, exportGroupIdList, studentGroupValue } = this.state;

        let obj = {};
        obj.semesterId = semesterValue;
        obj.groupIdList = exportGroupIdList;
        let json = JSON.stringify(obj);
        let lastJson = encodeURI(json);
        window.open(`api/stratify/student/outExcel?data=${lastJson}`);
        // mockForm('api/stratify/student/outExcel', { stringData: lastJson });
    };

    selectLinkClass = () => {
        this.setState({
            selectVisble: true,
        });
    };

    //导入分层班
    importClass = () => {
        this.setState({
            importClassModelVisible: true,
            importConfirmBtn: true,
            classFileList: [],
            isChecking: false,
            isUploading: false,
        });
    };

    //导入学生
    importStudent = () => {
        this.setState({
            importStudentModelVisible: true,
            importConfirmBtn: true,
            studentFileList: [],
            isChecking: false,
            isUploading: false,
        });
    };

    //导入教师
    importTeacher = () => {
        this.setState({
            importTeacherModelVisible: true,
            importConfirmBtn: true,
            teacherFileList: [],
            isChecking: false,
            isUploading: false,
        });
    };

    onClickConflict = () => {
        this.setState({
            isClickConflict: true,
        });
        const { dispatch } = this.props;
        dispatch({
            type: 'rules/createCompareGroup',
            payload: {
                semesterId: this.state.semesterValue, //学期id
            },
        }).then(() => {
            this.setState({
                isClickConflict: false,
            });
        });
    };

    //选择导入历史计划的学期
    changeSemesterToPlan = (value) => {
        this.setState({
            historySemester: value,
        });
    };

    hideHistoryModal = () => {
        this.setState({
            historyModal: false,
            checkedList: [],
            indeterminate: false,
            teachingOrgId: '',
            schoolSection: '',
            subjectValue: '',
            SearchOf: '',
            checkAll: false,
        });
    };

    //二次确认导入
    confirmImport = () => {
        let self = this;
        confirm({
            title: trans(
                'course.plan.rule.two',
                '您确定要导入历史计划吗？若继续导入，原课时计划将被替换'
            ),
            okText: trans('course.plan.confirm.important', '确认导入'),
            cancelText: trans('global.cancel', '取消'),
            onOk() {
                self.okImport();
            },
            onCancel() {},
        });
    };

    //确认导入
    okImport = () => {
        const { dispatch } = this.props;
        const { semesterValue, historySemester, semesterId } = this.state;
        let oldStartTime = historySemester.split('-')[0],
            oldEndTime = historySemester.split('-')[1];
        dispatch({
            type: 'course/importHistoryData',
            payload: {
                oldStartTime: oldStartTime,
                oldEndTime: oldEndTime,
                semesterValue,
                newSemesterId: semesterId,
            },
            onSuccess: () => {
                this.hideHistoryModal();
                window.location.reload();
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
                this.getCoursePlan();
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
                this.getCoursePlan();
            }
        );
    };

    onChange = (checkedList) => {
        const { plainOption } = this.state;
        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && checkedList.length < plainOption.length,
            checkAll: checkedList.length === plainOption.length,
        });
    };

    onCheckAllChange = (e) => {
        const { plainOption } = this.state;
        const valueAll = [];
        plainOption.map((item, index) => {
            if (!item.disabled) {
                valueAll.push(item.value);
            }
        });

        this.setState({
            checkedList: e.target.checked ? valueAll : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });
    };
    //导入
    subment = () => {
        const { dispatch, currentUser } = this.props;
        const { checkedList, semesterValue, schoolId } = this.state;
        dispatch({
            type: 'course/importHistory',
            payload: {
                courseIds: checkedList, //选中的课程id
                // schoolYearId: semesterValue,
                semesterId: semesterValue, // 学期id
                eduGroupcompanyId: currentUser.eduGroupcompanyId, // 机构id
                schoolId: schoolId, // 校区id
            },
            onSuccess: () => {
                this.hideHistoryModal();
                // this.getCoursePlan();
                if (!this.state.plateType) {
                    this.getCoursePlan();
                }

                // window.location.reload();
            },
        });
    };

    //弹窗选择学段
    changeDrawerxd = (value) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'time/getallGrade',
            payload: {
                stage: value,
            },
        });
        this.setState({ schoolSection: value }, () => {
            this.getCourseList();
        });
    };

    //弹窗选择年级
    changeDrawerGrade = (value) => {
        let selectValue = value.split('+'),
            gradeValue = selectValue && selectValue[0],
            gradeId =
                selectValue[1] && selectValue[1] != 'undefined' ? Number(selectValue[1]) : null;
        this.setState(
            {
                teachingOrgId: gradeId,
            },
            () => {
                this.getCourseList();
            }
        );
    };
    //全部课程
    getAllCourseList() {
        const { dispatch } = this.props;
        dispatch({
            type: 'course/getCourseList',
            payload: {},
        });
    }

    //科目-课程级联
    getCourseBySubject() {
        const { dispatch } = this.props;
        dispatch({
            type: 'timeTable/fetchCourseBySubject',
            payload: {},
        });
    }

    // 新科目-课程级联
    getCoursePlanSubjectList = () => {
        const { dispatch, allGrade } = this.props;
        const { semesterValue, schoolId, gradeId } = this.state;
        let groupList = [];
        allGrade &&
            allGrade.length > 0 &&
            allGrade.map((item) => {
                groupList.push(item.id);
            });
        dispatch({
            type: 'timeTable/coursePlanSubjectList',
            payload: {
                semesterId: semesterValue, //学期id
                schoolId: schoolId, // 校区id
                gradeIdList: gradeId ? gradeId : groupList,
            },
            onSuccess: () => {},
        });
    };

    renderTagPlaceholder = (omittedValues) => {
        let len = omittedValues && omittedValues.length;
        return <em className={styles.omittedStyle}>+ {len}</em>;
    };

    toNewCourse = () => {
        window.open('#/course/index/4');
    };

    titleHTML() {
        let { checkedList } = this.state;
        return (
            <div className={styles.modelTitle}>
                <span onClick={this.hideHistoryModal} className={styles.icon}>
                    <Icon type="close" />
                </span>
                <span>{trans('course.plan.curriculum', '课程范围')}</span>
                <Button disabled={checkedList.length === 0} onClick={this.subment} type="primary">
                    {trans('global.confirm', '确定')}
                </Button>
            </div>
        );
    }

    getCopyCard = (copy) => {
        this.setState({
            copyCard: copy,
        });
    };

    haveData() {
        let { newTeacherLists, studentGroupList1, dispatch, coursePlanList } = this.props;
        return (
            <div className={styles.courseCard}>
                {coursePlanList &&
                coursePlanList.data &&
                coursePlanList.data.length &&
                coursePlanList.data.length > 0 ? (
                    <CoursePlanItem
                        dispatch={dispatch}
                        self={this}
                        currentUser={this.props.currentUser}
                        getCoursePlan={this.getCoursePlan}
                        coursePlanList={coursePlanList.data}
                        // 子传父 newTeacherList  从models拿是newTeacherLists  ‘s’ 的区别
                        newTeacherList={this.formatTeacherData(newTeacherLists)}
                        studentGroupList={this.formatStudentGroup(studentGroupList1, 'groupList')}
                        applyGroupList={this.formatStudentGroup(
                            studentGroupList1,
                            'applyClassGroup'
                        )}
                        getCoursePlanSubjectList={this.getCoursePlanSubjectList}
                        getCoursePlanningGread={this.getCoursePlanningGread}
                        getCopyCard={this.getCopyCard}
                        clearFilter={this.clearFilter}
                        {...this.state}
                    />
                ) : (
                    <div className={styles.noSourceBox}>
                        <div className={styles.noPlan}>
                            <span className={styles.text}>
                                {trans('global.loadingImportTitle', '导入本学期要上的课程')}
                            </span>
                            <span className={styles.btn} onClick={this.importHistory}>
                                <i className={icon.iconfont}>&#xe8f7; &nbsp;</i>
                                {trans('global.Import Now', '立即导入')}
                            </span>
                            <img className={styles.picture} src={noPlan}></img>
                        </div>
                    </div>
                )}
            </div>
        );
    }
    sureImport = (e) => {
        let { coursePlanFileList } = this.state;
        let formData = new FormData();
        for (let item of coursePlanFileList) {
            formData.append('file', item);
            formData.append('semesterId', this.state.semesterValue);
        }
        if (!lodash.isEmpty(coursePlanFileList)) {
            this.setState({
                isUploading: true,
            });
            this.props
                .dispatch({
                    type: 'course/importByTypeCalendar',
                    payload: formData,
                    onSuccess: () => {
                        this.setState({
                            coursePlanFileList: [],
                        });
                    },
                })
                .then(() => {
                    let importByTypeCalendar = this.props.importByTypeCalendar;
                    this.setState({
                        isUploading: false,
                    });
                    if (!importByTypeCalendar) {
                        message.success(trans('global.scheduleImportSuccess', '导入成功'));
                        // this.getCoursePlan();
                        if (!this.state.plateType) {
                            this.getCoursePlan();
                        }
                        this.setState({
                            coursePlanFileList: [],
                            importCoursePlanModelVisible: false,
                        });
                    }
                });
        }
    };

    onChangeRadio = (e) => {
        this.setState({
            importType: e.target.value,
        });
    };

    reUpload = () => {
        let cancelBtn = document.getElementsByClassName('anticon-delete')[0];
        cancelBtn.click();
        this.setState({ checkModalVisibility: false });
    };

    sureImportClass = (e) => {
        let { classFileList } = this.state;
        let formData = new FormData();
        for (let item of classFileList) {
            formData.append('file', item);
            formData.append('studentGroupType', 5);
            formData.append('semesterId', this.state.semesterValue);
        }
        if (!lodash.isEmpty(classFileList)) {
            this.setState({
                isUploading: true,
            });
            this.props
                .dispatch({
                    type: 'course/importClass',
                    payload: formData,
                    onSuccess: () => {
                        this.setState({
                            classFileList: [],
                        });
                    },
                })
                .then(() => {
                    this.setState({
                        isUploading: false,
                    });
                    let importClass = this.props.importClass;
                    if (!lodash.isEmpty(importClass.checkErrorMessageList)) {
                        this.setState({
                            classFileList: [],
                            successModalVisibility: true,
                            successNumber: importClass.successNumber,
                            failureNumber: importClass.failureNumber,
                            checkErrorMessageList: importClass.checkErrorMessageList,
                        });
                    } else {
                        message.success(trans('global.scheduleImportSuccess', '导入成功'));
                        this.setState({
                            classFileList: [],
                            importClassModelVisible: false,
                        });
                    }
                });
        }
    };

    sureImportStudent = (e) => {
        let { studentFileList, semesterValue } = this.state;
        let formData = new FormData();
        for (let item of studentFileList) {
            formData.append('file', item);
            formData.append('semesterId', semesterValue);
            formData.append('importType', this.state.importType);
        }
        if (!lodash.isEmpty(studentFileList)) {
            this.setState({
                isUploading: true,
            });
            this.props
                .dispatch({
                    type: 'course/importStudent',
                    payload: formData,
                    onSuccess: () => {
                        this.setState({
                            studentFileList: [],
                        });
                    },
                })
                .then(() => {
                    let importStudent = this.props.importStudent;
                    this.setState({
                        isUploading: false,
                    });
                    if (!lodash.isEmpty(importStudent.checkErrorMessageList)) {
                        this.setState({
                            studentFileList: [],
                            successModalVisibility: true,
                            successNumber: importStudent.successNumber,
                            failureNumber: importStudent.failureNumber,
                            checkErrorMessageList: importStudent.checkErrorMessageList,
                            importType: 1,
                        });
                    } else {
                        message.success(trans('global.scheduleImportSuccess', '导入成功'));
                        this.setState({
                            studentFileList: [],
                            importStudentModelVisible: false,
                            importType: 1,
                        });
                    }
                });
        }
    };

    sureImportTeacher = (e) => {
        let { teacherFileList } = this.state;
        let formData = new FormData();
        for (let item of teacherFileList) {
            formData.append('file', item);
        }
        if (!lodash.isEmpty(teacherFileList)) {
            this.setState({
                isUploading: true,
            });
            this.props
                .dispatch({
                    type: 'course/importTeacher',
                    payload: formData,
                    onSuccess: () => {
                        this.setState({
                            teacherFileList: [],
                        });
                    },
                })
                .then(() => {
                    let importTeacher = this.props.importTeacher;
                    this.setState({
                        isUploading: false,
                    });
                    if (!importTeacher) {
                        message.success(trans('global.scheduleImportSuccess', '导入成功'));
                        this.setState({
                            teacherFileList: [],
                            importTeacherModelVisible: false,
                        });
                    }
                });
        }
    };

    //切换按班级按课程
    callback = (key) => {
        if (this.state.changeTabPage == 1) {
            this.setState({
                changeTabPage: 2,
            });
        } else {
            this.setState({
                changeTabPage: 1,
            });
        }
    };
    //切换课时或学生
    courseOrStudet = (key) => {
        if (this.state.changeClassStudent == 1) {
            this.setState({
                changeClassStudent: 2,
            });
        } else {
            this.setState({
                changeClassStudent: 1,
            });
        }
    };

    renderTreeNodes = (data) =>
        data.map((item) => {
            if (item.studentGroupList) {
                return (
                    <TreeNode title={item.name} key={item.type} dataRef={item}>
                        {this.renderTreeNodes(item.studentGroupList)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} {...item} />;
        });

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        this.setState({
            visible: false,
        });
        this.updateClassInfo();
    };

    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    };

    //以下三个是创建班级的弹窗操作
    showModal = () => {
        this.setState({
            CreateClassVisible: true,
        });
    };

    CreateHandleOk = () => {
        // debugger
        this.setState({
            CreateClassVisible: false,
        });
        this.createClassInfo();
    };

    CreateHandleCancel = () => {
        // debugger
        this.setState({
            CreateClassVisible: false,
            createClassName: '',
            createClassEname: '',
            classAbbreviation: '',
            createGradeList: [],
            createAddress: [],
            createAssociatedLists: [],
            createAssociatedGroup: [],
        });
    };

    //以下三个是删除班级的弹窗操作
    showModal = () => {
        this.setState({
            deleteVisible: true,
        });
    };

    deleteHandleOk = (e) => {
        this.setState(
            {
                deleteVisible: false,
                visible: false,
            },

            () => {
                // debugger
                this.delClassInfo();
            }
        );
    };

    deleteHandleCancel = (e) => {
        this.setState({
            deleteVisible: false,
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received value of form: ', values);
            }
        });
    };

    handleConfirmBlur = (e) => {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    };

    validateToNextPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };

    handleWebsiteChange = (value) => {
        let autoCompleteResult;
        if (!value) {
            autoCompleteResult = [];
        } else {
            autoCompleteResult = ['.com', '.org', '.net'].map((domain) => `${value}${domain}`);
        }
        this.setState({ autoCompleteResult });
    };

    // 关键字查询
    handlePreeEnter = (e) => {
        this.setState(
            {
                keyWords: e.target.value,
                stuPage: 1,
            },
            () => {
                this.queryStudentLists();
            }
        );
    };

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
    // 学生列表页面
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

    // 切换每页显示条数
    onShowSizeChangeStu = (current, size) => {
        this.setState(
            {
                stuPage: 1,
                stuPageSize: size,
            },
            () => {
                this.queryStudentLists();
            }
        );
    };

    showTotal = () => {
        return `学生总数 ${this.state.stuNum} `;
    };

    //页码改变触发的回调
    changePageNumber = (page, pageSize) => {
        this.setState(
            {
                stuPage: page,
            },
            () => this.queryStudentLists()
        );
    };

    //筛选选中的关联班级
    filterCreateLinkClass = (associatedGroupIdList) => {
        let newAssociateList = [];
        let createAssociatedLists = this.state.createAssociatedLists;
        if (associatedGroupIdList && associatedGroupIdList.length > 0) {
            associatedGroupIdList.forEach((item, index) => {
                createAssociatedLists.forEach((v, i) => {
                    if (v.groupId == item) {
                        newAssociateList.push(v);
                    }
                });
            });
        }
        return newAssociateList;
    };

    //筛选选中的关联班级
    filterLinkClass = (associatedGroupIdList) => {
        let newAssociateList = [];
        let associatedGroupLists = this.state.allGroup;
        if (associatedGroupIdList && associatedGroupIdList.length > 0) {
            associatedGroupIdList.forEach((item, index) => {
                associatedGroupLists.forEach((v, i) => {
                    if (v.groupId == item) {
                        newAssociateList.push(v);
                    }
                });
            });
        }
        return newAssociateList;
    };

    //筛选选中的适用场地
    filterSuitAddress = (associatedGroupIdList) => {
        let newAssociateList = [];
        if (associatedGroupIdList && associatedGroupIdList.length > 0) {
            associatedGroupIdList.forEach((item, index) => {
                this.props.allAddress.forEach((v, i) => {
                    if (v.id == item) {
                        newAssociateList.push(v);
                    }
                });
            });
        }
        return newAssociateList;
    };

    //筛选选中的适用年级
    filterSuitGrade = (associatedGroupIdList) => {
        let newAssociateList = [];
        if (associatedGroupIdList && associatedGroupIdList.length > 0) {
            associatedGroupIdList.forEach((item, index) => {
                this.props.allGrade.forEach((v, i) => {
                    if (v.id == item) {
                        newAssociateList.push(v);
                    }
                });
            });
        }
        return newAssociateList;
    };

    //确定转移
    handleTransferOk = () => {
        const { dispatch } = this.props;
        const {
            gradeIdToDetail,
            targetGroupId,
            studentIdList,
            semesterValue,
            currentGroupId,
            singleTransfer,
        } = this.state;
        this.setState({
            confirmLoading: true,
        });
        dispatch({
            type: 'course/transferStudent',
            payload: {
                studentGroupId: singleTransfer ? currentGroupId : gradeIdToDetail,
                semesterId: semesterValue,
                targetGroupId,
                studentIdList,
            },
        }).then(() => {
            setTimeout(() => {
                this.setState(
                    {
                        studentIdList: [],
                        transferStudentModalVisible: false,
                        confirmLoading: false,
                        currentGroupId: '',
                    },
                    () => {
                        this.queryStudentLists();
                    }
                );
            }, 600);
        });
    };

    handleTransferCancel = () => {
        this.setState({
            transferStudentModalVisible: false,
            currentGroupId: '',
        });
    };

    handleRemoveOk = () => {
        const { dispatch } = this.props;
        const { gradeIdToDetail, studentIdList, semesterValue, singleTransfer, currentGroupId } =
            this.state;
        dispatch({
            type: 'course/removeStudent',
            payload: {
                studentGroupId: singleTransfer ? currentGroupId : gradeIdToDetail,
                semesterId: semesterValue,
                studentIdList,
            },
        }).then(() => {
            this.setState({
                removeStudentModalVisible: false,
                studentIdList: [],
                currentGroupId: '',
            });
            this.queryStudentLists();
        });
    };

    handleRemoveCancel = () => {
        this.setState({
            removeStudentModalVisible: false,
            currentGroupId: '',
        });
    };

    AddStudent = () => {
        this.setState({
            addStudentModalVisible: true,
        });
    };

    handleAddStudentVisible = () => {
        this.setState({
            addStudentModalVisible: false,
        });
    };

    toggleAddStudentModalVisible = () => {
        const { addStudentModalVisible } = this.state;
        this.setState({
            addStudentModalVisible: !addStudentModalVisible,
        });
    };

    // 批量操作
    switchStatus = (i) => {
        let { studentIdList, gradeIdToDetail } = this.state;
        if (studentIdList.length === 0) {
            message.warn(trans('global.checked.student', '请先勾选要批量操作的学生'));
            return;
        }

        if (!gradeIdToDetail) {
            message.warn('请先选中一个班级');
            return;
        }

        if (i === 0) {
            this.setState({
                transferStudentModalVisible: true,
                singleTransfer: false,
            });
            this.getCoursePlanningGreadForSelect();
            this.getClassExceptAdmin();
        } else {
            this.setState({
                removeStudentModalVisible: true,
                singleTransfer: false,
            });
        }
    };

    changePlateType = (bol) => {
        this.setState(
            {
                plateType: bol,
                changeTabPage: 1,
            },
            () => {
                if (!this.state.plateType) {
                    this.getGrade();
                    this.getCourse();
                    this.getAddress();

                    this.getStudentGroup(); // 原全部班级 复制用
                    this.getOnlyClass();
                    this.getAllStage();
                }
                this.getPlanningSchool();
            }
        );
    };

    addStudentConfirm = (studentIdList) => {
        const { dispatch } = this.props;
        const { ToDetailId, semesterValue } = this.state;
        return dispatch({
            type: 'courseBaseDetail/addStudentClassNew',
            payload: {
                groupId: ToDetailId,
                userIdList: studentIdList,
                semesterId: semesterValue,
            },
        }).then(() => {
            this.queryStudentLists();
        });
    };

    render() {
        const {
            newSubjectList,
            coursePlanList,
            newTeacherLists,
            powerStatus,
            allGrade,
            allStage,
            planSubjectList,
            coursePlanningGreadListInfo,
            planningSemesterInfo,
            planningSchoolListInfo,
            allAddress,
            allSuitGrades,
            getClasses,
            gradeList,
        } = this.props;

        const {
            semesterValue,
            courseValue,
            historyModal,
            teacherValue,
            studentGroupValue,
            changeClasses,
            isok,
            plainOption,
            schoolId,
            importCoursePlanModelVisible,
            isChecking,
            isUploading,
            coursePlanFileList,
            checkErrorMessageList,
            checkModalVisibility,
            successModalVisibility,
            successNumber,
            failureNumber,
            importConfirmBtn,
            importClassModelVisible,
            importStudentModelVisible,
            classFileList,
            studentFileList,
            teacherFileList,
            importTeacherModelVisible,
            studentTableLoading,
            addStudentModalVisible,
            transferStudentModalVisible,
            plateType,
            classType,
            gradeFilterValue,
        } = this.state;

        //是否是行政班
        let isAdministrativeClass = classType === 1;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 15 },
            },
        };
        const operations = (
            <div>
                <span className={styles.className}>
                    {locale() !== 'en'
                        ? this.state.groupName
                        : this.props.gradeDetail.groupEnglishName}
                </span>
                {this.state.changeClassStudent == '2' ? null : this.state.groupName ? (
                    <span style={{ fontSize: '14px' }}>
                        <Icon
                            type="edit"
                            style={{ color: 'blue', marginLeft: 8, marginRight: 8 }}
                            onClick={() =>
                                this.setState(
                                    {
                                        visible: true,
                                    },
                                    () => {
                                        this.getLinkClass();
                                        this.suitGrades();
                                    }
                                )
                            }
                        />
                    </span>
                ) : null}
            </div>
        );
        const treeProps = {
            style: {
                // width: "100%",
                width: 120,
                marginRight: 8,
                verticalAlign: 'top',
            },
            dropdownStyle: {
                minHeight: 100,
                maxHeight: 500,
                overflow: 'auto',
            },
            treeNodeFilterProp: 'title',
            treeCheckable: true,
        };

        const allClassProps = {
            style: {
                width: '100%',
                // width: 120,
                marginRight: 8,
                verticalAlign: 'top',
            },
            dropdownStyle: {
                minHeight: 100,
                maxHeight: 500,
                overflow: 'auto',
            },
            treeNodeFilterProp: 'title',
            treeCheckable: true,
        };

        const courseProps = {
            treeData: this.formatCourseData(planSubjectList),
            value: courseValue,
            placeholder: trans('course.plan.allcourse', '全部课程'),
            maxTagCount: 5,
            maxTagPlaceholder: (omittedValues) => this.renderTagPlaceholder(omittedValues),
            onChange: this.handleChange.bind(this, 'courseValue'),
            ...allClassProps,
        };
        const courses = {
            treeData: this.formatCourseList(planSubjectList),
            value: courseValue,
            onSelect: this.handleChange.bind(this, 'courseValue'),
            ...treeProps,
        };
        const teacherProps = {
            treeData: this.formatTeacherData(newTeacherLists),
            value: teacherValue,
            placeholder: trans('course.plan.keywords', '输入教师关键词搜索'),
            onChange: this.handleChange.bind(this, 'teacherValue'),
            ...treeProps,
        };
        //按课程页面
        const studentGroupProps = {
            treeData: this.formatStudentGroup(coursePlanningGreadListInfo, 'search'),
            value: studentGroupValue,
            placeholder: trans('course.plan.class', '全部班级'),
            onChange: this.handleChange.bind(this, 'studentGroupValue'),
            maxTagCount: 2,
            maxTagPlaceholder: (omittedValues) => this.renderTagPlaceholder(omittedValues),
            ...treeProps,
        };
        const studentGroupPropShow = {
            treeData: this.formatStudentGroupShow(coursePlanningGreadListInfo, 'search'),
            value: studentGroupValue,
            onSelect: this.handleChange.bind(this, 'studentGroupPropShow'),
            // defaultExpandAll:
            ...treeProps,
        };
        let totalPage = coursePlanList && coursePlanList.total;
        //判断是否有访问课时计划的权限
        if (
            powerStatus.content &&
            powerStatus.content.indexOf('smart:scheduling:courseManagement') == -1
        ) {
            return (
                <div className={styles.courseplan}>
                    <PowerPage />
                </div>
            );
        }
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
                        isChecking: true,
                    }),
                    () => {
                        let { coursePlanFileList } = this.state;
                        let formData = new FormData();
                        for (let item of coursePlanFileList) {
                            formData.append('file', item);
                            formData.append('semesterId', this.state.semesterValue);
                        }
                        if (!lodash.isEmpty(coursePlanFileList)) {
                            this.props
                                .dispatch({
                                    type: 'course/checkByTypeCalendar',
                                    payload: formData,
                                })
                                .then(() => {
                                    let checkByTypeCalendar = this.props.checkByTypeCalendar;
                                    this.setState({
                                        isChecking: false,
                                    });
                                    if (
                                        !lodash.isEmpty(checkByTypeCalendar.checkErrorMessageList)
                                    ) {
                                        this.setState({
                                            coursePlanFileList: [],
                                            checkModalVisibility: true,
                                            successNumber: checkByTypeCalendar.successNumber,
                                            failureNumber: checkByTypeCalendar.failureNumber,
                                            checkErrorMessageList:
                                                checkByTypeCalendar.checkErrorMessageList,
                                        });
                                    } else {
                                        this.setState({
                                            importConfirmBtn: false,
                                        });
                                    }
                                });
                        }
                    }
                );

                return false;
            },
            coursePlanFileList,
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

        const adminStuColumns = [
            {
                title: trans('student.name', '姓名'),
                dataIndex: 'studentName',
                key: 'studentName',
                align: 'center',
                // width: 100,
            },
            {
                title: trans('student.englishName', '英文名'),
                dataIndex: 'studentEnName',
                key: 'studentEnName',
                align: 'center',
                // width: 100,
            },
            {
                title: trans('student.sex', '性别'),
                dataIndex: 'sex',
                key: 'sex',
                align: 'center',
                // width: 80,
                render: (text, record) => (
                    <span>
                        {record.sex == '男'
                            ? trans('student.man', '男')
                            : trans('student.woman', '女')}
                    </span>
                ),
            },
            {
                title: trans('student.studentNo', '学号'),
                key: 'studentNumber',
                dataIndex: 'studentNumber',
                // width: 120,
                align: 'center',
            },
            {
                title: trans('student.teacherNameShow', '导师'),
                key: 'tutorCnName',
                dataIndex: 'tutorCnName',
                // width: 120,
                align: 'center',
            },
            {
                title: trans('course.basedetail.base.administrative.class', '行政班'),
                key: 'adminGroupName',
                dataIndex: 'adminGroupName',
                // width: 100,
                textWrap: 'word-break',
                Width: '120px',
                align: 'center',
            },
            {
                title: trans('student.studentLittleNo', '小学号'),
                key: 'number',
                dataIndex: 'number',
                align: 'center',
            },
            {
                title: trans('course.basedetail.join.date', '加入日期'),
                key: 'joinTime',
                dataIndex: 'joinTime',
                align: 'center',
                // width: 140,
            },
            {
                title:
                    this.state.stuStatus == false
                        ? ''
                        : trans('course.basedetail.leave.date', '离开日期'),
                key: 'leaveTime',
                dataIndex: 'leaveTime',
                align: 'center',
                render: (text, record) => {
                    return <span>{record.studentIsOutStratifiedClass == false ? '' : text}</span>;
                },
            },
            {
                title: trans('course.setup.course.status', '状态'),
                key: 'status',
                dataIndex: 'status',
                align: 'center',
                // width: 80,
                render: (text, record) => {
                    return (
                        <span style={{ color: record.status == 1 ? '#4d7fff' : '#666' }}>
                            {record.studentIsOutStratifiedClass == false
                                ? trans('global.inClass', '在班')
                                : trans('global.out of work', '已离班')}
                        </span>
                    );
                },
            },
        ];

        const stuColumns = [
            {
                title: trans('student.name', '姓名'),
                dataIndex: 'studentName',
                key: 'studentName',
                align: 'center',
                width: 90,
                // fixed: "left",
            },
            {
                title: trans('student.englishName', '英文名'),
                dataIndex: 'studentEnName',
                key: 'studentEnName',
                align: 'center',
                width: 94,
                // fixed: "left",
            },
            {
                title: trans('student.sex', '性别'),
                dataIndex: 'sex',
                key: 'sex',
                align: 'center',
                width: 60,
                render: (text, record) => (
                    <span>
                        {record.sex == '男'
                            ? trans('student.man', '男')
                            : trans('student.woman', '女')}
                    </span>
                ),
            },
            {
                title: trans('student.studentNo', '学号'),
                key: 'studentNumber',
                dataIndex: 'studentNumber',
                width: 120,
                align: 'center',
            },
            {
                title: trans('student.teacherNameShow', '导师'),
                key: 'tutorCnName',
                dataIndex: 'tutorCnName',
                // width: 120,
                width: 100,
                align: 'center',
            },
            {
                title: trans('course.basedetail.base.administrative.class', '行政班'),
                key: 'adminGroupName',
                dataIndex: 'adminGroupName',
                width: 125,
                align: 'center',
            },
            {
                title: trans('student.studentLittleNo', '小学号'),
                key: 'number',
                dataIndex: 'number',
                align: 'center',
            },
            {
                title: trans('course.basedetail.base.LayeredShift.class', '分层走班'),
                key: 'currentGroupName',
                // dataIndex: locale() !== 'en' ? 'currentGroupName' : 'currentGroupEName',
                dataIndex: 'currentGroupName',
                width: 125,
                align: 'center',
            },
            {
                title: trans('course.basedetail.join.date', '加入日期'),
                key: 'joinTime',
                dataIndex: 'joinTime',
                align: 'center',
                width: 119,
            },

            {
                title: trans('course.setup.course.status', '状态'),
                key: 'status',
                dataIndex: 'status',
                align: 'center',
                width: 75,
                // width: 80,
                render: (text, record) => {
                    return (
                        <span style={{ color: record.status == 1 ? '#4d7fff' : '#666' }}>
                            {record.studentIsOutStratifiedClass == false
                                ? trans('global.inClass', '在班')
                                : trans('global.out of work', '已离班')}
                        </span>
                    );
                },
            },
            {
                title: trans('student.opeation', '操作'),
                key: 'action',
                width: 90,
                // fixed: "right",
                align: 'center',
                render: (text, record) =>
                    record.currentGroupId && (
                        <span className={styles.action}>
                            {
                                <Fragment>
                                    <a
                                        onClick={() => {
                                            this.setState({
                                                transferStudentModalVisible: true,
                                                singleTransfer: true,
                                                studentIdList: [record.studentId],
                                                currentGroupId: record.currentGroupId,
                                            });
                                            this.getClassExceptAdmin();
                                        }}
                                    >
                                        {trans('global.transfer', '转移')}
                                    </a>
                                    <Divider className={styles.dividerStyle} type="vertical" />

                                    {
                                        <Fragment>
                                            <a
                                                onClick={() => {
                                                    this.setState({
                                                        removeStudentModalVisible: true,
                                                        studentIdList: [record.studentId],
                                                        singleTransfer: true,
                                                        currentGroupId: record.currentGroupId,
                                                    });
                                                }}
                                            >
                                                {trans('course.basedetail.remove', '移除')}
                                            </a>
                                        </Fragment>
                                    }
                                </Fragment>
                            }
                        </span>
                    ),
            },
        ];

        const offDutyColumns = [
            {
                title: trans('student.name', '姓名'),
                dataIndex: 'studentName',
                key: 'studentName',
                align: 'center',
                width: 90,
                // fixed: "left",
            },
            {
                title: trans('student.englishName', '英文名'),
                dataIndex: 'studentEnName',
                key: 'studentEnName',
                align: 'center',
                width: 94,
                // fixed: "left",
            },
            {
                title: trans('student.sex', '性别'),
                dataIndex: 'sex',
                key: 'sex',
                align: 'center',
                width: 60,
                render: (text, record) => (
                    <span>
                        {record.sex == '男'
                            ? trans('student.man', '男')
                            : trans('student.woman', '女')}
                    </span>
                ),
            },
            {
                title: trans('student.studentNo', '学号'),
                key: 'studentNumber',
                dataIndex: 'studentNumber',
                width: 120,
                align: 'center',
            },
            {
                title: trans('student.teacherNameShow', '导师'),
                key: 'tutorCnName',
                dataIndex: 'tutorCnName',
                width: 100,
                align: 'center',
            },
            {
                title: trans('course.basedetail.base.administrative.class', '行政班'),
                key: 'adminGroupName',
                dataIndex: 'adminGroupName',
                width: 125,
                align: 'center',
            },
            {
                title: trans('student.studentLittleNo', '小学号'),
                key: 'number',
                dataIndex: 'number',
                align: 'center',
            },
            {
                title: trans('course.basedetail.join.date', '加入日期'),
                key: 'joinTime',
                dataIndex: 'joinTime',
                align: 'center',
                width: 125,
            },
            {
                title:
                    this.state.stuStatus == false
                        ? ''
                        : trans('course.basedetail.leave.date', '离开日期'),
                key: 'leaveTime',
                dataIndex: 'leaveTime',
                align: 'center',
                width: 119,
                render: (text, record) => {
                    return <span>{record.studentIsOutStratifiedClass == false ? '' : text}</span>;
                },
            },
            {
                title: trans('course.setup.course.status', '状态'),
                key: 'status',
                dataIndex: 'status',
                align: 'center',
                width: 75,
                render: (text, record) => {
                    return (
                        <span style={{ color: record.status == 1 ? '#4d7fff' : '#666' }}>
                            {record.studentIsOutStratifiedClass == false
                                ? trans('global.inClass', '在班')
                                : trans('global.out of work', '已离班')}
                        </span>
                    );
                },
            },
            {
                title: trans('student.opeation', '操作'),
                key: 'action',
                width: 90,
                // fixed: "right",
                align: 'center',
            },
        ];

        const rowSelection = {
            selectedRowKeys: this.state.studentIdList,
            // columnWidth: 30,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    studentIdList: selectedRowKeys,
                });
            },
            getCheckboxProps: (record) => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name,
            }),
        };

        const classUploadProps = {
            onRemove: (file) => {
                if (this.state.classFileList.length == 1) {
                    this.setState({ importConfirmBtn: true });
                }
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
                            formData.append('studentGroupType', 5);
                            formData.append('semesterId', this.state.semesterValue);
                        }
                        if (!lodash.isEmpty(classFileList)) {
                            this.props
                                .dispatch({
                                    type: 'course/checkClass',
                                    payload: formData,
                                })
                                .then(() => {
                                    let checkClass = this.props.checkClass;
                                    this.setState({
                                        isChecking: false,
                                    });
                                    if (!lodash.isEmpty(checkClass.checkErrorMessageList)) {
                                        this.setState({
                                            classFileList: [],
                                            checkModalVisibility: true,
                                            successNumber: checkClass.successNumber,
                                            failureNumber: checkClass.failureNumber,
                                            checkErrorMessageList: checkClass.checkErrorMessageList,
                                        });
                                    } else {
                                        this.setState({
                                            importConfirmBtn: false,
                                        });
                                    }
                                });
                        }
                    }
                );
                return false;
            },
            classFileList,
        };

        const studentUploadProps = {
            onRemove: (file) => {
                if (this.state.studentFileList.length == 1) {
                    this.setState({ importConfirmBtn: true });
                }
                this.setState((state) => {
                    const index = state.studentFileList.indexOf(file);
                    const newFileList = state.studentFileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        studentFileList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {
                this.setState(
                    (state) => ({
                        isChecking: true,
                        studentFileList: [...state.studentFileList, file],
                    }),
                    () => {
                        let { studentFileList, semesterValue } = this.state;
                        let formData = new FormData();
                        for (let item of studentFileList) {
                            formData.append('file', item);
                            formData.append('semesterId', semesterValue);
                        }
                        if (!lodash.isEmpty(studentFileList)) {
                            this.props
                                .dispatch({
                                    type: 'course/checkStudent',
                                    payload: formData,
                                })
                                .then(() => {
                                    let checkStudent = this.props.checkStudent;
                                    this.setState({
                                        isChecking: false,
                                    });
                                    if (!lodash.isEmpty(checkStudent.checkErrorMessageList)) {
                                        this.setState({
                                            studentFileList: [],
                                            checkModalVisibility: true,
                                            successNumber: checkStudent.successNumber,
                                            failureNumber: checkStudent.failureNumber,
                                            checkErrorMessageList:
                                                checkStudent.checkErrorMessageList,
                                        });
                                    } else {
                                        this.setState({
                                            importConfirmBtn: false,
                                        });
                                    }
                                });
                        }
                    }
                );
                return false;
            },
            studentFileList,
        };

        const teacherUploadProps = {
            onRemove: (file) => {
                if (this.state.teacherFileList.length == 1) {
                    this.setState({ importConfirmBtn: true });
                }
                this.setState((state) => {
                    const index = state.teacherFileList.indexOf(file);
                    const newFileList = state.teacherFileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        teacherFileList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {
                this.setState(
                    (state) => ({
                        isChecking: true,
                        teacherFileList: [...state.teacherFileList, file],
                    }),
                    () => {
                        let { teacherFileList, semesterValue } = this.state;
                        let formData = new FormData();
                        for (let item of teacherFileList) {
                            formData.append('file', item);
                        }
                        if (!lodash.isEmpty(teacherFileList)) {
                            this.props
                                .dispatch({
                                    type: 'course/checkTeacher',
                                    payload: formData,
                                })
                                .then(() => {
                                    let checkTeacher = this.props.checkTeacher;
                                    this.setState({
                                        isChecking: false,
                                    });
                                    if (!lodash.isEmpty(checkTeacher.checkErrorMessageList)) {
                                        this.setState({
                                            teacherFileList: [],
                                            checkModalVisibility: true,
                                            successNumber: checkTeacher.successNumber,
                                            failureNumber: checkTeacher.failureNumber,
                                            checkErrorMessageList:
                                                checkTeacher.checkErrorMessageList,
                                        });
                                    } else {
                                        this.setState({
                                            importConfirmBtn: false,
                                        });
                                    }
                                });
                        }
                    }
                );
                return false;
            },
            teacherFileList,
        };
        return (
            <div className={styles.courseplan}>
                <div className={styles.mainContent}>
                    <div className={styles.mainTop}>
                        <Select
                            value={schoolId}
                            className={styles.selectStyle}
                            onChange={this.handleChange.bind(this, 'schoolId')}
                        >
                            {planningSchoolListInfo &&
                                planningSchoolListInfo.length > 0 &&
                                planningSchoolListInfo.map((item, index) => {
                                    return (
                                        <Option value={item?.schoolId} key={item?.schoolId}>
                                            <span
                                                title={
                                                    locale() != 'en'
                                                        ? item?.name
                                                        : item?.englishName
                                                }
                                            >
                                                {locale() != 'en' ? item?.name : item?.englishName}
                                            </span>
                                        </Option>
                                    );
                                })}
                        </Select>
                        <Select
                            value={semesterValue}
                            onChange={this.changeSemester}
                            className={styles.selectStyle}
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
                        {this.state.plateType && (
                            <Select
                                value={gradeFilterValue}
                                onChange={this.changeFilterGrade}
                                className={styles.selectStyle}
                                placeholder="请选择年级"
                            >
                                {gradeList &&
                                    gradeList.length > 0 &&
                                    gradeList.map((item, index) => {
                                        return (
                                            <Option value={item.id} key={item.id}>
                                                {locale() != 'en' ? (
                                                    <span>{item.orgName}</span>
                                                ) : (
                                                    <span>{item.orgEname}</span>
                                                )}
                                            </Option>
                                        );
                                    })}
                            </Select>
                        )}

                        <div>
                            <span
                                className={styles.showStyle}
                                style={{ color: plateType ? '#0445FC' : '' }}
                                onClick={() => this.changePlateType(true)}
                            >
                                总表视图
                            </span>
                            <span
                                className={styles.showStyle}
                                style={{ color: !plateType ? '#0445FC' : '' }}
                                onClick={() => this.changePlateType(false)}
                            >
                                明细视图
                            </span>
                        </div>
                        <div className={styles.btnList}>
                            <div className={styles.operButton}>
                                <a onClick={this.importCoursePlan}>
                                    {' '}
                                    {trans('global.course.plan.import', '导入课时计划')}{' '}
                                </a>
                            </div>

                            <div className={styles.operButton}>
                                <a onClick={this.exportCoursePlan}>
                                    {' '}
                                    {trans('global.course.plan.export', '导出课时计划')}{' '}
                                </a>
                            </div>
                            <Spin
                                spinning={this.state.isClickConflict}
                                tip="一键冲突ing..."
                                wrapperClassName={styles.operButton}
                            >
                                <div className={styles.operButton}>
                                    <a onClick={lodash.debounce(this.onClickConflict, 800)}>
                                        {trans('global.course.plan.conflict', '一键冲突')}
                                    </a>
                                </div>
                            </Spin>
                        </div>
                    </div>
                    {plateType ? (
                        <NewVersion
                            schoolId={this.state.schoolId}
                            semesterValue={this.state.semesterValue}
                            gradeFilterValue={gradeFilterValue}
                            onRef={(ref) => (this.child = ref)}
                        />
                    ) : (
                        <div className={styles.mainBottom}>
                            <div className={styles.mainBLeft}>
                                <div className={styles.leftContent}>
                                    <Tabs defaultActiveKey="1" onChange={this.callback}>
                                        <TabPane tab="课程" key="1">
                                            <div>
                                                <div className={styles.lTop}>
                                                    <Select
                                                        defaultValue={''}
                                                        className={styles.selectStyle}
                                                        onChange={this.stage}
                                                    >
                                                        <Option value="" key="all">
                                                            {trans('course.plan.stage', '全部学段')}
                                                        </Option>
                                                        {allStage &&
                                                            allStage.length > 0 &&
                                                            allStage.map((item, index) => (
                                                                <Option
                                                                    value={item.stage}
                                                                    key={item.id}
                                                                >
                                                                    {locale() != 'en'
                                                                        ? item.orgName
                                                                        : item.orgEname}
                                                                </Option>
                                                            ))}
                                                    </Select>
                                                    <Select
                                                        defaultValue={''}
                                                        className={styles.selectStyle}
                                                        onChange={this.changeGrade}
                                                        value={this.state.selectGradeValue}
                                                    >
                                                        <Option value="" key="all">
                                                            {trans(
                                                                'course.plan.allGrade',
                                                                '全部年级'
                                                            )}
                                                        </Option>
                                                        {allGrade &&
                                                            allGrade.length > 0 &&
                                                            allGrade.map((item, index) => {
                                                                return (
                                                                    <Option
                                                                        value={
                                                                            item.grade +
                                                                            '+' +
                                                                            item.id
                                                                        }
                                                                        key={item.grade}
                                                                    >
                                                                        {locale() != 'en'
                                                                            ? item.orgName
                                                                            : item.orgEname}
                                                                    </Option>
                                                                );
                                                            })}
                                                    </Select>
                                                </div>
                                                <div className={styles.lBottom}>
                                                    <TreeSelect {...courseProps} />
                                                </div>
                                                <div className={styles.allCourses}>
                                                    <Tree {...courses}> </Tree>
                                                </div>
                                            </div>

                                            <div
                                                className={styles.operButton}
                                                style={{ position: 'reletive', left: '-100px' }}
                                            >
                                                <a
                                                    onClick={this.importHistory}
                                                    style={{ marginLeft: 25 }}
                                                >
                                                    <Icon
                                                        type="plus-circle"
                                                        style={{ color: 'blue', marginRight: 5 }}
                                                    />
                                                    {trans('course.plan.newClass', '新增课程')}
                                                </a>
                                            </div>
                                        </TabPane>
                                        <TabPane
                                            tab="班级"
                                            key="2"
                                            onClick={() => {
                                                this.setState({
                                                    changeTabPage: 1,
                                                });
                                            }}
                                        >
                                            <div className={styles.lTop}>
                                                <Select
                                                    defaultValue={''}
                                                    className={styles.selectStyle}
                                                    onChange={this.stage}
                                                >
                                                    <Option value="" key="all">
                                                        {trans('course.plan.stage', '全部学段')}
                                                    </Option>
                                                    {allStage &&
                                                        allStage.length > 0 &&
                                                        allStage.map((item, index) => (
                                                            <Option
                                                                value={item.stage}
                                                                key={item.id}
                                                            >
                                                                {locale() != 'en'
                                                                    ? item.orgName
                                                                    : item.orgEname}
                                                            </Option>
                                                        ))}
                                                </Select>
                                                <Select
                                                    defaultValue={''}
                                                    className={styles.selectStyle}
                                                    onChange={this.changeGrade}
                                                    value={this.state.selectGradeValue}
                                                >
                                                    <Option value="" key="all">
                                                        {trans('course.plan.allGrade', '全部年级')}
                                                    </Option>
                                                    {allGrade &&
                                                        allGrade.length > 0 &&
                                                        allGrade.map((item, index) => {
                                                            return (
                                                                <Option
                                                                    value={
                                                                        item.grade + '+' + item.id
                                                                    }
                                                                    key={item.grade}
                                                                >
                                                                    {locale() != 'en'
                                                                        ? item.orgName
                                                                        : item.orgEname}
                                                                </Option>
                                                            );
                                                        })}
                                                </Select>
                                            </div>
                                            <div className={styles.lBottom}>
                                                <Input
                                                    value={this.state.KeyWord}
                                                    onChange={(e) => {
                                                        this.setState({
                                                            KeyWord: e.target.value,
                                                        });
                                                    }}
                                                    placeholder={trans(
                                                        'tc.base.search.select.class',
                                                        '请输入班级关键字搜索'
                                                    )}
                                                    onPressEnter={this.getCoursePlanningGread}
                                                ></Input>
                                            </div>
                                            <div
                                                style={{
                                                    height: 394,
                                                    overflow: 'scroll',
                                                }}
                                            >
                                                {coursePlanningGreadListInfo &&
                                                    coursePlanningGreadListInfo.length > 0 && (
                                                        <Tree
                                                            {...studentGroupPropShow}
                                                            defaultExpandAll
                                                        ></Tree>
                                                    )}
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-around',
                                                    height: 32,
                                                    // lineHeight:32,
                                                }}
                                            >
                                                <div className={styles.operButton}>
                                                    <a
                                                        onClick={() => {
                                                            this.setState(
                                                                { CreateClassVisible: true },
                                                                () => this.suitGrades()
                                                            );
                                                        }}
                                                        style={{ padding: 0 }}
                                                    >
                                                        <Icon
                                                            type="plus-circle"
                                                            style={{
                                                                color: 'blue',
                                                                marginRight: 5,
                                                            }}
                                                        />
                                                        {trans('global.createClass', '新建班级')}
                                                    </a>
                                                    <Modal
                                                        title="新建班级"
                                                        visible={this.state.CreateClassVisible}
                                                        onOk={this.CreateHandleOk}
                                                        onCancel={this.CreateHandleCancel}
                                                    >
                                                        <Form
                                                            {...formItemLayout}
                                                            onSubmit={this.handleSubmit}
                                                        >
                                                            <Form.Item label="班级类型">
                                                                <Radio defaultChecked="true">
                                                                    分层走班
                                                                </Radio>
                                                            </Form.Item>
                                                            <Form.Item
                                                                label={trans(
                                                                    'charge.chineseName',
                                                                    '中文名称'
                                                                )}
                                                            >
                                                                <Input
                                                                    placeholder={trans(
                                                                        'tc.base.search.select.ChineseName',
                                                                        '请输入中文班级名'
                                                                    )}
                                                                    value={
                                                                        this.state.createClassName
                                                                    }
                                                                    onChange={(e) =>
                                                                        this.setState({
                                                                            createClassName:
                                                                                e.target.value,
                                                                        })
                                                                    }
                                                                />
                                                            </Form.Item>
                                                            <Form.Item
                                                                label={trans(
                                                                    'charge.enName',
                                                                    '英文名称'
                                                                )}
                                                            >
                                                                <Input
                                                                    placeholder={trans(
                                                                        'tc.base.search.select.EngnishName',
                                                                        '请输入英文班级名'
                                                                    )}
                                                                    value={
                                                                        this.state.createClassEname
                                                                    }
                                                                    onChange={(e) =>
                                                                        this.setState({
                                                                            createClassEname:
                                                                                e.target.value,
                                                                        })
                                                                    }
                                                                />
                                                            </Form.Item>
                                                            <Form.Item label="班级简称">
                                                                <Input
                                                                    placeholder={trans(
                                                                        'tc.base.search.select.ClassAbbreviation',
                                                                        '请输入班级简称'
                                                                    )}
                                                                    value={
                                                                        this.state.classAbbreviation
                                                                    }
                                                                    onChange={(e) =>
                                                                        this.setState({
                                                                            classAbbreviation:
                                                                                e.target.value,
                                                                        })
                                                                    }
                                                                />
                                                            </Form.Item>
                                                            <Form.Item label="适用年级">
                                                                <Select
                                                                    placeholder={trans(
                                                                        'tc.base.search.select.grade',
                                                                        '请选择适用年级'
                                                                    )}
                                                                    className={styles.selectStyle}
                                                                    onChange={(value) =>
                                                                        this.setState(
                                                                            {
                                                                                createGradeList:
                                                                                    value,
                                                                            },
                                                                            () => {
                                                                                this.getCreateLinkClass();
                                                                            }
                                                                        )
                                                                    }
                                                                    mode="multiple"
                                                                    optionLabelProp="label"
                                                                    value={
                                                                        this.state.createGradeList
                                                                    }
                                                                >
                                                                    {allSuitGrades &&
                                                                        allSuitGrades.length > 0 &&
                                                                        allSuitGrades.map(
                                                                            (item, index) => {
                                                                                return (
                                                                                    <Option
                                                                                        value={
                                                                                            item.id
                                                                                        }
                                                                                        key={
                                                                                            item.id
                                                                                        }
                                                                                        label={
                                                                                            locale() !=
                                                                                            'en'
                                                                                                ? item.orgName
                                                                                                : item.orgEname
                                                                                        }
                                                                                    >
                                                                                        {locale() !=
                                                                                        'en'
                                                                                            ? item.orgName
                                                                                            : item.orgEname}
                                                                                    </Option>
                                                                                );
                                                                            }
                                                                        )}
                                                                </Select>
                                                            </Form.Item>
                                                            <Form.Item label="适用场地">
                                                                <Select
                                                                    placeholder={trans(
                                                                        'tc.base.search.select.site',
                                                                        '搜索选择地点'
                                                                    )}
                                                                    optionFilterProp="label"
                                                                    mode="multiple"
                                                                    className={styles.select}
                                                                    onChange={(value) =>
                                                                        this.setState({
                                                                            createAddress: value,
                                                                        })
                                                                    }
                                                                    value={this.state.createAddress}
                                                                >
                                                                    {allAddress &&
                                                                        allAddress.length > 0 &&
                                                                        allAddress.map(
                                                                            (item, index) => (
                                                                                <Select.Option
                                                                                    value={item.id}
                                                                                    key={item.id}
                                                                                    label={
                                                                                        item.name
                                                                                    }
                                                                                >
                                                                                    {locale() !=
                                                                                    'en'
                                                                                        ? item.name
                                                                                        : item.ename ||
                                                                                          item.name}
                                                                                </Select.Option>
                                                                            )
                                                                        )}
                                                                </Select>
                                                            </Form.Item>
                                                        </Form>
                                                    </Modal>
                                                </div>
                                                <div className={styles.operButton}>
                                                    <a
                                                        onClick={this.importClass}
                                                        style={{ padding: 0 }}
                                                    >
                                                        <Icon
                                                            type="import"
                                                            style={{
                                                                color: 'blue',
                                                                marginLeft: -5,
                                                            }}
                                                        />{' '}
                                                        {/* 导入分层班{' '} */}
                                                        {trans('global.importClass', '导入分层班')}
                                                    </a>
                                                </div>
                                            </div>
                                        </TabPane>
                                    </Tabs>
                                </div>
                            </div>
                            {this.state.changeTabPage == 1 ? (
                                <div className={styles.main}>
                                    <div className={styles.searchHeader}>
                                        <span
                                            title={trans('course.plan.enter.search', '请回车查询')}
                                        >
                                            <TreeSelect {...studentGroupProps} />
                                        </span>
                                        <Select
                                            value={changeClasses}
                                            className={styles.selectStyle}
                                            onChange={this.handleChange.bind(this, 'changeClasses')}
                                            style={{ lineHeight: '30px' }}
                                        >
                                            <Option value="" key="0">
                                                {trans('course.plan.all', '全部状态')}
                                            </Option>
                                            <Option
                                                value={1}
                                                label={trans('course.plan.classesIng', '开课中')}
                                                key="1"
                                            >
                                                {trans('course.plan.classesIng', '开课中')}
                                            </Option>
                                            <Option
                                                value={0}
                                                label={trans('course.plan.noClasses', '取消开课')}
                                                key="2"
                                            >
                                                {trans('course.plan.noClasses', '取消开课')}
                                            </Option>
                                        </Select>
                                        <span
                                            title={trans('course.plan.enter.search', '请回车查询')}
                                            className={styles.teacherSearch}
                                        >
                                            <TreeSelect {...teacherProps} />
                                        </span>
                                    </div>
                                    <div className={styles.courseCard}>
                                        {!this.state.plateType ? (
                                            isok ? (
                                                this.haveData()
                                            ) : (
                                                <Spin tip="Try to loading...">
                                                    {' '}
                                                    {this.haveData()}{' '}
                                                </Spin>
                                            )
                                        ) : null}
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.main}>
                                    <Tabs
                                        defaultActiveKey="1"
                                        tabBarExtraContent={operations}
                                        onChange={this.courseOrStudet}
                                    >
                                        <TabPane
                                            tab={trans('global.classStudents', '班级学生')}
                                            key="1"
                                            onClick={() => {
                                                this.setState({
                                                    changeClassStudent: 1,
                                                });
                                            }}
                                        >
                                            <div>
                                                <Modal
                                                    title="修改班级基本信息"
                                                    visible={this.state.visible}
                                                    footer={null}
                                                    onOk={this.handleOk}
                                                    onCancel={this.handleCancel}
                                                >
                                                    <Form
                                                        {...formItemLayout}
                                                        onSubmit={this.handleSubmit}
                                                    >
                                                        <Form.Item
                                                            label={trans(
                                                                'charge.chineseName',
                                                                '中文名称'
                                                            )}
                                                        >
                                                            <Input
                                                                value={this.state.gradeChineseName}
                                                                onChange={(e) => {
                                                                    this.setState({
                                                                        gradeChineseName:
                                                                            e.target.value,
                                                                    });
                                                                }}
                                                                disabled={isAdministrativeClass}
                                                            />
                                                        </Form.Item>
                                                        <Form.Item
                                                            label={trans(
                                                                'charge.enName',
                                                                '英文名称'
                                                            )}
                                                        >
                                                            <Input
                                                                value={this.state.gradeEnglishName}
                                                                onChange={(e) => {
                                                                    this.setState({
                                                                        gradeEnglishName:
                                                                            e.target.value,
                                                                    });
                                                                }}
                                                                disabled={isAdministrativeClass}
                                                            />
                                                        </Form.Item>
                                                        <Form.Item label="班级简称">
                                                            <Input
                                                                value={this.state.gradeAbbreviation}
                                                                onChange={(e) => {
                                                                    this.setState({
                                                                        gradeAbbreviation:
                                                                            e.target.value,
                                                                    });
                                                                }}
                                                            />
                                                        </Form.Item>
                                                        <Form.Item label="适用年级">
                                                            <Select
                                                                className={styles.selectStyle}
                                                                onChange={(value) =>
                                                                    this.setState(
                                                                        {
                                                                            suitGradeList: value,
                                                                        },
                                                                        () => {
                                                                            this.getLinkClass();
                                                                        }
                                                                    )
                                                                }
                                                                mode="multiple"
                                                                optionLabelProp="label"
                                                                value={this.state.suitGradeList}
                                                                disabled={isAdministrativeClass}
                                                            >
                                                                {allSuitGrades &&
                                                                    allSuitGrades.length > 0 &&
                                                                    allSuitGrades.map(
                                                                        (item, index) => {
                                                                            return (
                                                                                <Option
                                                                                    value={item.id}
                                                                                    key={item.id}
                                                                                    label={
                                                                                        locale() !=
                                                                                        'en'
                                                                                            ? item.orgName
                                                                                            : item.orgEname
                                                                                    }
                                                                                >
                                                                                    {locale() !=
                                                                                    'en'
                                                                                        ? item.orgName
                                                                                        : item.orgEname}
                                                                                </Option>
                                                                            );
                                                                        }
                                                                    )}
                                                            </Select>
                                                        </Form.Item>

                                                        <div className={styles.operationBtnList}>
                                                            {!isAdministrativeClass && (
                                                                <a
                                                                    className={styles.deleteBtn}
                                                                    onClick={() => {
                                                                        this.setState({
                                                                            deleteVisible: true,
                                                                        });
                                                                    }}
                                                                >
                                                                    <i className={icon.iconfont}>
                                                                        &#xe739;
                                                                    </i>
                                                                    <span>删除班级</span>
                                                                </a>
                                                            )}
                                                            <a>
                                                                <span
                                                                    className={
                                                                        styles.modalBtn +
                                                                        ' ' +
                                                                        styles.cancelBtn
                                                                    }
                                                                    onClick={this.handleCancel}
                                                                >
                                                                    取消
                                                                </span>
                                                                <span
                                                                    className={
                                                                        styles.modalBtn +
                                                                        ' ' +
                                                                        styles.submitBtn
                                                                    }
                                                                    onClick={this.handleOk}
                                                                >
                                                                    确定
                                                                </span>
                                                            </a>
                                                        </div>
                                                    </Form>
                                                </Modal>

                                                <Modal
                                                    title="删除班级"
                                                    visible={this.state.deleteVisible}
                                                    onOk={this.deleteHandleOk}
                                                    onCancel={this.deleteHandleCancel}
                                                    footer={
                                                        this.state.stuListsArray &&
                                                        this.state.stuListsArray.length > 0 ? (
                                                            <Button
                                                                key="back"
                                                                onClick={this.deleteHandleCancel}
                                                            >
                                                                我知道了
                                                            </Button>
                                                        ) : (
                                                            <div>
                                                                <Button
                                                                    key="back"
                                                                    onClick={
                                                                        this.deleteHandleCancel
                                                                    }
                                                                    // type="primary"
                                                                >
                                                                    取消
                                                                </Button>

                                                                <Button
                                                                    key="submit"
                                                                    onClick={this.deleteHandleOk}
                                                                    type="primary"
                                                                >
                                                                    确认移除
                                                                </Button>
                                                            </div>
                                                        )
                                                    }
                                                >
                                                    {this.state.stuListsArray &&
                                                    this.state.stuListsArray.length > 0 ? (
                                                        <p>
                                                            该班级有关联课时计划或学生，不允许删除
                                                        </p>
                                                    ) : (
                                                        <p>删除班级后不可撤销，是否确认删除？</p>
                                                    )}
                                                </Modal>
                                            </div>

                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-around',
                                                }}
                                                className={styles.searchStu}
                                            >
                                                <div className={styles.IsOut}>
                                                    <span
                                                        style={{
                                                            height: 32,
                                                            color:
                                                                this.state.stuStatus == false
                                                                    ? 'blue'
                                                                    : 'black',
                                                            backgroundColor:
                                                                this.state.stuStatus == false
                                                                    ? 'rgba(4,69,252,0.10)'
                                                                    : '#FFF',
                                                        }}
                                                        onClick={() => {
                                                            this.setState(
                                                                { stuStatus: false },
                                                                () => {
                                                                    this.queryStudentLists();
                                                                }
                                                            );
                                                        }}
                                                    >
                                                        {this.state.readingNumber}&nbsp;{' '}
                                                        {trans('global.inClass', '在班')}
                                                    </span>
                                                    <span
                                                        style={{
                                                            height: 32,
                                                            color:
                                                                this.state.stuStatus == true
                                                                    ? 'blue'
                                                                    : 'black',
                                                        }}
                                                        onClick={() => {
                                                            this.setState(
                                                                { stuStatus: true },
                                                                () => {
                                                                    this.queryStudentLists();
                                                                }
                                                            );
                                                        }}
                                                    >
                                                        {this.state.leaveNumber}&nbsp;{' '}
                                                        {trans('global.out of work', '已离班')}
                                                    </span>
                                                </div>
                                                <span className={styles.input}>
                                                    <Input
                                                        style={{
                                                            width: 270,
                                                            height: 32,
                                                            borderRadius: '5px !important',
                                                        }}
                                                        suffix={<Icon type="search" />}
                                                        placeholder={trans(
                                                            'course.basedetail.enter.name.or.number',
                                                            '请输入姓名或学号回车搜索'
                                                        )}
                                                        value={this.state.keyWords}
                                                        onChange={(e) => {
                                                            this.setState({
                                                                keyWords: e.target.value,
                                                            });
                                                        }}
                                                        onPressEnter={this.handlePreeEnter}
                                                    />
                                                </span>
                                                <div>
                                                    {this.state.classType == '1' ? (
                                                        <span
                                                            style={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                width: 390,
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    display: 'inlineBlock',
                                                                    width: 308,
                                                                    lineHeight: '32px',
                                                                }}
                                                            >
                                                                <Icon type="exclamation-circle" />
                                                                {trans(
                                                                    'global.warnTitle',
                                                                    '行政班学生如需调整，请前往学生管理页面'
                                                                )}
                                                                <Link to={'/student/index'}>
                                                                    {trans('global.Go', '前往')}
                                                                </Link>
                                                            </span>

                                                            <Button
                                                                type="primary"
                                                                size="small"
                                                                style={{
                                                                    width: 71,
                                                                    height: 32,
                                                                    borderRadius: 5,
                                                                    background:
                                                                        'rgba(1,17,61,0.07)',
                                                                    color: 'rgb(120,126,148)',
                                                                    borderColor: '#FFF',
                                                                }}
                                                                onClick={this.exportStudent}
                                                            >
                                                                <Icon type="export" />
                                                                {trans('global.Export', '导出')}
                                                            </Button>
                                                        </span>
                                                    ) : (
                                                        <span className={styles.menu}>
                                                            <Button
                                                                type="primary"
                                                                size="small"
                                                                style={{
                                                                    height: 36,
                                                                    borderRadius: 5,
                                                                    // backgroundColor: '#0445FC',
                                                                    // color: '#FFF',
                                                                }}
                                                                onClick={this.importStudent}
                                                            >
                                                                {trans(
                                                                    'course.plan.toLead',
                                                                    '导入学生'
                                                                )}
                                                            </Button>
                                                            <Button
                                                                type="primary"
                                                                size="small"
                                                                style={{
                                                                    // width: 72,
                                                                    height: 36,
                                                                    borderRadius: 5,
                                                                    marginLeft: 8,
                                                                    // background:
                                                                    //     'rgba(1,17,61,0.07)',
                                                                    // color: 'rgb(120,126,148)',
                                                                }}
                                                                onClick={this.AddStudent}
                                                            >
                                                                {trans('course.plan.addStudent', '添加学生')}
                                                            </Button>
                                                            <MenuInner
                                                                title={trans(
                                                                    'course.basedetail.batch.operation',
                                                                    '批量操作'
                                                                )}
                                                                menuItem={[
                                                                    trans(
                                                                        'global.moretransfer',
                                                                        '批量转移'
                                                                    ),
                                                                    trans(
                                                                        'course.basedetail.moreremove',
                                                                        '批量移除'
                                                                    ),
                                                                ]}
                                                                switchStatus={this.switchStatus.bind(
                                                                    this
                                                                )}
                                                                effecticveDisabled={false}
                                                            />
                                                            <Button
                                                                // type="primary"
                                                                size="small"
                                                                style={{
                                                                    height: 36,
                                                                    borderRadius: 5,
                                                                    // background:
                                                                    //     'rgba(1,17,61,0.07)',
                                                                    // color: 'rgb(120,126,148)',
                                                                }}
                                                                onClick={this.exportStudent}
                                                            >
                                                                {trans('global.Export', '导出')}
                                                            </Button>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div clasName={styles.stuTable}>
                                                <Table
                                                    loading={studentTableLoading}
                                                    scroll={{
                                                        x: 650,
                                                    }}
                                                    rowSelection={rowSelection}
                                                    columns={
                                                        this.state.classType == '1'
                                                            ? adminStuColumns
                                                            : this.state.stuStatus
                                                            ? offDutyColumns
                                                            : stuColumns
                                                    }
                                                    dataSource={this.state.stuListsArray}
                                                    pagination={false}
                                                ></Table>
                                                <div className={styles.page}>
                                                    {this.state.stuListsArray &&
                                                        this.state.stuListsArray.length > 0 && (
                                                            <Pagination
                                                                showSizeChanger={true}
                                                                pageSizeOptions={[
                                                                    '10',
                                                                    '30',
                                                                    '50',
                                                                    '100',
                                                                    '500',
                                                                ]}
                                                                showTotal={this.showTotal}
                                                                defaultPageSize={
                                                                    this.state.stuPageSize
                                                                }
                                                                onShowSizeChange={
                                                                    this.onShowSizeChangeStu
                                                                }
                                                                defaultCurrent={this.state.stuPage}
                                                                total={
                                                                    this.state.stuStatus
                                                                        ? this.state.leaveNumber
                                                                        : this.state.readingNumber
                                                                }
                                                                onChange={this.changePageNumber}
                                                            ></Pagination>
                                                        )}
                                                </div>
                                            </div>
                                        </TabPane>
                                    </Tabs>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {this.state.changeTabPage == 1 && !plateType ? (
                    <div className={styles.paginationStyle}>
                        <div className={styles.pageContainer}>
                            <Pagination
                                showSizeChanger
                                showQuickJumper
                                current={this.state.current}
                                total={totalPage}
                                locale="zh-CN"
                                pageSizeOptions={['5', '10', '20', '40', '100']}
                                onChange={this.switchPage}
                                onShowSizeChange={this.switchPageSize}
                                defaultPageSize={this.state.pageSize}
                            />
                        </div>
                    </div>
                ) : null}

                {historyModal ? (
                    <Modal
                        title={this.titleHTML()}
                        width="90vw"
                        maskClosable={false}
                        footer={null}
                        closable={false}
                        visible={historyModal}
                    >
                        <div className={styles.importHistory}>
                            <div className={styles.newAdd}>
                                <span className={styles.contitle}>
                                    {trans('course.plan.school.title', '校区')}
                                </span>
                                <Select
                                    value={schoolId}
                                    className={styles.selectStyle}
                                    disabled={true}
                                >
                                    <Option value="" key="all">
                                        {trans('course.plan.school', '全部校区')}
                                    </Option>
                                    {planningSchoolListInfo &&
                                        planningSchoolListInfo.length > 0 &&
                                        planningSchoolListInfo.map((item, index) => (
                                            <Option value={item.schoolId} key={item.schoolId}>
                                                {locale() != 'en' ? item.name : item.englishName}
                                            </Option>
                                        ))}
                                </Select>
                                <span className={styles.contitle}>
                                    {trans('global.all.academic.term', '学期')}
                                </span>
                                <Select
                                    value={this.state.semesterValue}
                                    disabled={true}
                                    className={styles.selectStyle}
                                >
                                    {planningSemesterInfo &&
                                        planningSemesterInfo.length > 0 &&
                                        planningSemesterInfo.map((item, index) => {
                                            return (
                                                <Option value={item.id} key={item.id}>
                                                    {locale() != 'en' ? (
                                                        <span>
                                                            {item.schoolYearName} &nbsp; {item.name}
                                                        </span>
                                                    ) : (
                                                        <span>
                                                            {item.schoolYearEname} &nbsp;{' '}
                                                            {item.ename}
                                                        </span>
                                                    )}
                                                </Option>
                                            );
                                        })}
                                </Select>
                            </div>
                            <div>
                                <span className={styles.contitle}>
                                    {trans('course.plan.stagetext', '学段')}
                                </span>
                                <Select
                                    defaultValue={''}
                                    style={{
                                        width: 120,
                                    }}
                                    className={styles.selectStyle}
                                    onChange={this.changeDrawerxd}
                                >
                                    <Option value="" key="all">
                                        {trans('course.plan.stage', '全部学段')}
                                    </Option>
                                    {allStage &&
                                        allStage.length > 0 &&
                                        allStage.map((item, index) => (
                                            <Option value={item.stage} key={item.id}>
                                                {locale() != 'en' ? item.orgName : item.orgEname}
                                            </Option>
                                        ))}
                                </Select>
                                <span className={styles.contitle}>
                                    {trans('course.plan.grade', '年级')}
                                </span>
                                <Select
                                    defaultValue={''}
                                    style={{
                                        width: 120,
                                    }}
                                    className={styles.selectStyle}
                                    onChange={this.changeDrawerGrade}
                                >
                                    <Option value="" key="all">
                                        {trans('course.plan.allGrade', '全部年级')}
                                    </Option>
                                    {allGrade &&
                                        allGrade.length > 0 &&
                                        allGrade.map((item, index) => (
                                            <Option
                                                value={item.grade + '+' + item.id}
                                                key={item.grade}
                                            >
                                                {locale() != 'en' ? item.orgName : item.orgEname}
                                            </Option>
                                        ))}
                                </Select>
                                <span className={styles.contitle}>
                                    {trans('course.plan.subject', '科目')}
                                </span>
                                <Select
                                    defaultValue={''}
                                    style={{
                                        width: 120,
                                    }}
                                    className={styles.selectStyle}
                                    onChange={this.handleChange.bind(this, 'subjectValue')}
                                >
                                    <Option value="" key="all">
                                        {trans('course.plan.allsubject', '全部科目')}
                                    </Option>
                                    {newSubjectList &&
                                        newSubjectList.length > 0 &&
                                        newSubjectList.map((item, index) => {
                                            return (
                                                <Option value={item.id} key={item.id}>
                                                    {locale() != 'en' ? item.name : item.ename}
                                                </Option>
                                            );
                                        })}
                                </Select>
                                <Search
                                    className={styles.Search}
                                    placeholder={trans('course.plan.keyword', '输入关键词搜索')}
                                    onChange={(e) => {
                                        this.setState({
                                            SearchOf: e.target.value,
                                        });
                                    }}
                                    onSearch={(value) => {
                                        this.setState(
                                            {
                                                SearchOf: value,
                                            },
                                            () => {
                                                this.getCourseList();
                                            }
                                        );
                                    }}
                                    style={{
                                        width: 200,
                                        borderRadius: '24px',
                                    }}
                                />
                            </div>
                            <div className={styles.checkBoxs}>
                                <Checkbox
                                    indeterminate={this.state.indeterminate}
                                    onChange={this.onCheckAllChange}
                                    checked={this.state.checkAll}
                                >
                                    {/* {trans('course.plan.allCheck', '全选')} */}
                                    {trans('global.choiceAll', '全选')}
                                </Checkbox>
                                <span
                                    style={{
                                        color: '#999',
                                    }}
                                >
                                    {trans('course.plan.aonCheck', '已选择：')}
                                    {(this.state.checkedList && this.state.checkedList.length) || 0}
                                    {trans('course.plan.iCourse', '个课程')}
                                </span>
                                <span className={styles.functions}>
                                    <span className={styles.new} onClick={this.toNewCourse}>
                                        {trans('course.setup.index.new.course', '新建课程')}
                                    </span>
                                    <span onClick={this.getCourseList.bind(this)}>
                                        {trans('global.refresh', '刷新')}
                                    </span>
                                </span>
                                <div className={styles.boxItem}>
                                    <CheckboxGroup
                                        options={plainOption}
                                        value={this.state.checkedList}
                                        onChange={this.onChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </Modal>
                ) : null}
                {/* 批量导入课时计划 */}
                <Modal
                    visible={importCoursePlanModelVisible}
                    title={trans('global.importSchedule', '批量导入')}
                    okText={trans('global.importScheduleConfirm', '确认导入')}
                    className={styles.importCalendar}
                    onCancel={() => this.setState({ importCoursePlanModelVisible: false })}
                    closable={false}
                    onOk={lodash.debounce(this.sureImport, 1000)}
                    okButtonProps={{
                        disabled: importConfirmBtn /* type: "primary" */,
                    }}
                    destroyOnClose={true}
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
                            <div className={styles.importMsg}>
                                <span>①</span>&nbsp;
                                <span>
                                    {trans(
                                        'global.downloadScheduleTemplate',
                                        '下载导入模板，批量填写导入信息'
                                    )}
                                </span>
                                <a
                                    href={`/api/defaultCoursePlan/excelCoursePlanning/download`}
                                    target="_blank"
                                    style={{ marginLeft: 15 }}
                                >
                                    {trans('global.scheduleDownloadTemplate', '下载模板')}
                                </a>
                            </div>
                            <div className={styles.importMsg}>
                                <span>②</span>&nbsp;
                                <span>
                                    {trans('global.uploadSchedule', '上传填写好的导入信息表')}
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
                {/* 批量导入分层班 */}
                <Modal
                    visible={importClassModelVisible}
                    title={trans('global.importSchedule', '批量导入')}
                    okText={trans('global.importScheduleConfirm', '确认导入')}
                    className={styles.importCalendar}
                    onCancel={() => this.setState({ importClassModelVisible: false })}
                    closable={false}
                    onOk={lodash.debounce(this.sureImportClass, 1000)}
                    okButtonProps={{
                        disabled: importConfirmBtn /* type: "primary" */,
                    }}
                    destroyOnClose={true}
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
                            <div className={styles.importMsg}>
                                <span>①</span>&nbsp;
                                <span>
                                    {trans(
                                        'global.downloadScheduleTemplate',
                                        '下载导入模板，批量填写导入信息'
                                    )}
                                </span>
                                <a
                                    href={`/api/stratify/stratifiedClass/template/download`}
                                    target="_blank"
                                    style={{ marginLeft: 15 }}
                                >
                                    {trans('global.scheduleDownloadTemplate', '下载模板')}
                                </a>
                            </div>
                            <div className={styles.importMsg}>
                                <span>②</span>&nbsp;
                                <span>
                                    {trans('global.uploadSchedule', '上传填写好的导入信息表')}
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
                                            <Upload {...classUploadProps} maxCount={1}>
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
                {/* 批量导入学生 */}
                <Modal
                    visible={importStudentModelVisible}
                    title={trans('global.importScheduleStudents', '批量导入学生')}
                    okText={trans('global.importScheduleConfirm', '确认导入')}
                    className={styles.importCalendar}
                    onCancel={() =>
                        this.setState({ importStudentModelVisible: false, importType: 1 })
                    }
                    closable={false}
                    onOk={lodash.debounce(this.sureImportStudent, 1000)}
                    okButtonProps={{
                        disabled: importConfirmBtn /* type: "primary" */,
                    }}
                    destroyOnClose={true}
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
                            <div className={styles.importMsg}>
                                <span>①</span>&nbsp;
                                <span>
                                    {trans(
                                        'global.downloadScheduleTemplate',
                                        '下载导入模板，批量填写导入信息'
                                    )}
                                </span>
                                <a
                                    href={`/api/stratify/template/download`}
                                    target="_blank"
                                    style={{ marginLeft: 15 }}
                                >
                                    {trans('global.scheduleDownloadTemplate', '下载模板')}
                                </a>
                            </div>
                            <div className={styles.importMsg}>
                                <span>②</span>&nbsp;
                                <span>
                                    {trans('global.uploadSchedule', '上传填写好的导入信息表')}
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
                                            <Upload {...studentUploadProps} maxCount={1}>
                                                <Button type="primary" disabled={!importConfirmBtn}>
                                                    {trans('global.scheduleSelectFile', '选择文件')}
                                                </Button>
                                            </Upload>
                                        </Form>
                                    </span>
                                </span>
                            </div>
                            <div className={styles.importMsg}>
                                <span>③</span>&nbsp;
                                <span>{trans('global.processing method', '选择处理方式')}</span>
                                <span style={{ marginLeft: '20px' }}>
                                    <Radio.Group
                                        onChange={this.onChangeRadio}
                                        value={this.state.importType}
                                    >
                                        <Radio value={1}>
                                            {trans(
                                                'global.Additional class students',
                                                '追加班级学生'
                                            )}
                                        </Radio>
                                        <Radio value={2}>
                                            {trans('global.coverStudents', '覆盖班级学生')}
                                        </Radio>
                                    </Radio.Group>
                                </span>
                            </div>
                        </div>
                    </Spin>
                </Modal>
                {/* 批量导入教师 */}
                <Modal
                    visible={importTeacherModelVisible}
                    title={trans('global.importSchedule', '批量导入')}
                    okText={trans('global.importScheduleConfirm', '确认导入')}
                    className={styles.importCalendar}
                    onCancel={() => this.setState({ importTeacherModelVisible: false })}
                    closable={false}
                    onOk={lodash.debounce(this.sureImportTeacher, 1000)}
                    okButtonProps={{
                        disabled: importConfirmBtn /* type: "primary" */,
                    }}
                    destroyOnClose={true}
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
                            <div className={styles.importMsg}>
                                <span>①</span>&nbsp;
                                <span>
                                    {trans(
                                        'global.downloadScheduleTemplate',
                                        '下载导入模板，批量填写导入信息'
                                    )}
                                </span>
                                <a
                                    href={`/api/role/baseTag/download`}
                                    target="_blank"
                                    style={{ marginLeft: 15 }}
                                >
                                    {trans('global.scheduleDownloadTemplate', '下载模板')}
                                </a>
                            </div>
                            <div className={styles.importMsg}>
                                <span>②</span>&nbsp;
                                <span>
                                    {trans('global.uploadSchedule', '上传填写好的导入信息表')}
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
                                            <Upload {...teacherUploadProps} maxCount={1}>
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
                {/* 校验失败 */}
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
                                    classFileList: [],
                                    coursePlanFileList: [],
                                    importCoursePlanModelVisible: false,
                                    importClassModelVisible: false,
                                    importStudentModelVisible: false,
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

                {transferStudentModalVisible && (
                    <Modal
                        title={trans('student.transferTo', '转移到')}
                        visible={transferStudentModalVisible}
                        onOk={this.handleTransferOk}
                        onCancel={this.handleTransferCancel}
                        confirmLoading={this.state.confirmLoading}
                    >
                        <p>
                            {trans('global.selectStudents', '已选择 {$num} 个学生', {
                                num: this.state.studentIdList.length
                                    ? this.state.studentIdList.length
                                    : '0',
                            })}
                            {/* 已选择 {this.state.studentIdList.length} 个学生 */}
                        </p>
                        <Select
                            showSearch
                            placeholder={trans('global.selectTit', '搜索选择新班级')}
                            style={{ width: 300 }}
                            onChange={(value) =>
                                this.setState({
                                    targetGroupId: value,
                                })
                            }
                            onSearch={debounce((value) =>
                                this.setState({
                                    targetGroupId: value,
                                })
                            )}
                            filterOption={(input, option) => {
                                return option.props.children.includes(input);
                            }}
                        >
                            {getClasses.map((item) => {
                                return <Option value={item.groupId}>{item.name}</Option>;
                            })}
                        </Select>
                        <p style={{ marginTop: '1rem' }}>
                            {trans(
                                'global.transferTitle',
                                '转移后，学生会从原班级课程移除，加入到新班级的课程进行上课'
                            )}
                        </p>
                    </Modal>
                )}

                <Modal
                    title={trans('global.Remove Students', '移除学生')}
                    visible={this.state.removeStudentModalVisible}
                    onOk={this.handleRemoveOk}
                    onCancel={this.handleRemoveCancel}
                    okText={trans('course.basedetail.confirm.remove', '确认移除')}
                >
                    <p>
                        {trans('global.selectStudents', '已选择 {$num} 个学生', {
                            num: this.state.studentIdList.length
                                ? this.state.studentIdList.length
                                : '0',
                        })}
                    </p>
                    <p style={{ marginTop: '1rem' }}>
                        {trans(
                            'global.removeTit',
                            '确认移除学生吗, 移除后, 学生将从原班级课程移除'
                        )}
                    </p>
                </Modal>

                {/* 添加学生 */}
                {/* <AddStudentPlan
                    visibleAddStudent={addStudentModalVisible}
                    classIdList={getClasses.map((item) => item.groupId)}
                    dispatch={this.props.dispatch}
                    getStudentTable={this.queryStudentLists}
                    self={this}
                    isNew={true}
                    semesterValue={this.state.semesterValue}
                    toAllClassValue={this.state.ToDetailId}
                    hideModal={this.handleAddStudentVisible}
                /> */}
                {addStudentModalVisible && (
                    <AddStudent
                        semesterValue={semesterValue}
                        visible={addStudentModalVisible}
                        toggleVisible={this.toggleAddStudentModalVisible}
                        addStudentConfirm={this.addStudentConfirm}
                    />
                )}
            </div>
        );
    }
}
