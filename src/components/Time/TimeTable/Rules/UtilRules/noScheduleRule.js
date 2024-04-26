//不排课规则
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './rules.less';
import {
    Tabs,
    Select,
    TreeSelect,
    Radio,
    Row,
    Col,
    Input,
    message,
    Checkbox,
    Modal,
    DatePicker,
    Button,
} from 'antd';
import CommonList from './common/commonList';
import icon from '../../../../../icon.less';
import { intoChinese, subObj, getWeekDayLesson } from '../../../../../utils/utils';
import DepartmentSelect from '../../DepartmentSelect/index';
import { isEmpty, isNumber, remove } from 'lodash';
import moment from 'moment';
import { formatTime, trans, locale } from '../../../../../utils/i18n';
import SearchCourse from '../../SearchCourse';

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { SHOW_PARENT } = TreeSelect;
message.config({
    zIndex: 99999999,
});

@connect((state) => ({
    ruleListOfTypes: state.rules.ruleListOfTypes,
    allTeacherList: state.rules.allTeacherList, //版本内-教师列表
    courseAllList: state.rules.courseAllList, //版本内-课程
    classGroupList: state.rules.classGroupList, //版本内-学生组
    newClassGroupList: state.rules.newClassGroupList, //版本内-学生组
    gradeByTeacherList: state.rules.teacherRulesList, //根据选中教师查询年级
    scheduleDetail: state.rules.scheduleDetail, //获取教师的表格

    courseAcquisition: state.rules.courseAcquisition, //根据班级获取作息id
    accordingVersion: state.rules.accordingVersion, //根据学生组获取作息id
    editRuleInformation: state.rules.oneRuleInformation, //编辑列表详情
    departmentList: state.timeTable.departmentList,
    courseBySubject: state.timeTable.courseBySubject, //科目-课程联动
    roleTag: state.rules.roleTag, //科目-课程联动
    fetchTeacherAndOrg: state.global.fetchTeacherAndOrg, //组织和人员列表，栾碧霞测试专用接口
    versionList: state.rules.versionList,
    acRuleFilterParamInputModelList: state.rules.acRuleFilterParamInputModelList,
}))
export default class NoScheduleRules extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            activeKey: '',
            controllerFormList: {},
            selectTeacher: [],
            selectRole: [],
            selectGrade: undefined,
            selectCourse: undefined,
            selectStudentGroup: undefined,
            selectStatus: {}, //存取form中选中的状态
            showConditionList: false,
            weightPercent: '100',
            remark: '',
            allLessons: [], //所有课节
            checkedLessons: {}, //选中的课节
            formDataSource: [], //表格数据
            checkedLessonTitle: '', //选中课程标题
            courseScheduleId: '', //课程作息id
            studentGroupScheduleId: '', //学生组作息id
            newCheckedLessons: [],
            confirmEditBtn: false, //确认修改按钮的显隐
            editListId: '', //编辑列表的id
            ruleType: 1,
            searchTeacherValue: undefined, //搜索或选择教师
            searchCourseValue: undefined, //搜索或选择课程
            identity: 'teacher',

            tagList: [],
            copyStatus: false,
            selectedRuleIdList: [],
            ifSelectAll: false,
            copyScheduleVisible: false,
            targetVersionId: '',
            copyScheduleLoading: false,
            startTime: '',
            endTime: '',
            teacherMessageName: '',
            studentGroupMessageName: '',
            courseMessageName: '',
        };
    }

    componentDidMount() {
        this.setState(
            {
                activeKey: this.props.activeTabKey && this.props.activeTabKey.toString(),
            },
            () => {
                let controllerFormList = Object.assign({}, this.state.controllerFormList);
                controllerFormList[this.state.activeKey] = false;
                this.setState({
                    controllerFormList: controllerFormList,
                });
                this.getNoScheduleList(this.state.activeKey);
                this.getTeacherList();
                this.getCourse();
                this.newClassGroupList();
                this.getDepartmentList();
                this.getCourseBySubject();
                this.emptyAcRuleFilterParamInputModelList();
                if (this.props.isExchange) {
                    let newId = this.props.isExchange.split('_')[2];
                    this.editNoScheduleRules(newId);
                }
            }
        );
        //非指定元素，隐藏显示
        document.addEventListener('click', this.hideCondition);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.activeKey != this.props.activeKey) {
            if (nextProps.activeKey == nextProps.selfId) {
                this.setState(
                    {
                        activeKey: nextProps.activeTabKey && nextProps.activeTabKey.toString(),
                    },
                    () => {
                        let controllerFormList = Object.assign({}, this.state.controllerFormList);
                        controllerFormList[this.state.activeKey] = false;
                        this.setState({
                            controllerFormList: controllerFormList,
                        });
                        this.clearAll();
                        this.getNoScheduleList(this.state.activeKey);
                        this.getTeacherList();
                        this.getCourse();
                        this.newClassGroupList();
                    }
                );
                this.emptyAcRuleFilterParamInputModelList();
            }
        }
    }

    //科目-课程级联
    getRoleTag() {
        const { dispatch } = this.props;
        dispatch({
            type: 'rules/getRoleTag',
            payload: {},
        });
    }

    //科目-课程级联
    getCourseBySubject() {
        const { dispatch, currentVersion } = this.props;
        dispatch({
            type: 'timeTable/fetchCourseBySubject',
            payload: {
                versionId: currentVersion,
            },
        });
    }

    //处理课程数据
    formatCourseSelectData = (courseList) => {
        if (!courseList || courseList.length < 0) return;
        let courseData = [];
        courseList.map((item, index) => {
            let obj = {};
            obj.title = item.name;
            obj.key = 'subject_' + item.id;
            obj.value = 'subject_' + item.id;
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
                title: item.name,
                value: item.id,
                key: item.id,
            };
            resultArr.push(obj);
        });
        return resultArr;
    };

    //获取不排课规则列表
    getNoScheduleList(activeKey) {
        const { dispatch, currentVersion, selfId } = this.props;
        dispatch({
            type: 'rules/ruleListOfTypes',
            payload: {
                versionId: currentVersion,
                baseRuleId: selfId,
                ruleObjectRelationType: activeKey,
            },
        });
    }

    //切换tabs
    changeTabs = (activeKey) => {
        this.setState(
            {
                activeKey: activeKey,
                controllerFormList: {},
            },
            () => {
                const controllerFormList = Object.assign({}, this.state.controllerFormList);
                controllerFormList[activeKey] = false;
                this.setState({
                    controllerFormList: controllerFormList,
                });
                this.clearAll();
                //获取列表
                this.getNoScheduleList(activeKey);
            }
        );
    };

    //清空所有
    clearAll = () => {
        this.setState({
            selectTeacher: undefined,
            // tagList: undefined,
            selectCourse: undefined,
            selectStudentGroup: undefined,
            formDataSource: [], //清空表格数据
            weightPercent: '100',
            remark: '',
            selectGrade: undefined,
            allLessons: [], //清空所有课节
            checkedLessons: {}, //清空选中的课节
            selectStatus: {}, //存取form中选中的状态
            showConditionList: false,
            checkedLessonTitle: '',
            confirmEditBtn: false,
            searchTeacherValue: undefined,
            searchCourseValue: undefined,
        });
        this.emptyAcRuleFilterParamInputModelList();
    };

    //添加或取消规则
    addRules(id, type, e) {
        e.stopPropagation();
        this.getRoleTag();
        const controllerFormList = Object.assign({}, this.state.controllerFormList);
        controllerFormList[id] = type == 'add' ? true : false;
        this.setState({
            controllerFormList: controllerFormList,
            identity: 'teacher',
            tagList: [],
            selectTeacher: [],
        });
        if (type == 'add') {
            this.getTableSource();
        }
        if (type == 'cancel') {
            //清空
            this.clearAll();
        }
    }

    //获取版本内教师
    getTeacherList() {
        const { dispatch, currentVersion } = this.props;
        dispatch({
            type: 'rules/allTeacherList',
            payload: {
                versionId: currentVersion,
            },
        });
    }

    // 获取教师按部门list
    getDepartmentList() {
        const { dispatch } = this.props;
        dispatch({
            type: 'timeTable/getDepartmentList',
            payload: {
                time: this.props.payloadTime,
            },
        });
    }

    //获取版本内学生组
    newClassGroupList() {
        const { dispatch, currentVersion } = this.props;
        dispatch({
            type: 'rules/newClassGroupList',
            payload: {
                versionId: currentVersion,
            },
        });
    }

    //获取版本内课程
    getCourse() {
        const { dispatch, currentVersion } = this.props;
        dispatch({
            type: 'rules/courseAllList',
            payload: {
                versionId: currentVersion,
            },
        });
    }

    //根据教师值查询年级
    getGradeByTeacherValue() {
        const { dispatch, currentVersion } = this.props;
        const { selectTeacher, tagList } = this.state;
        return dispatch({
            type: 'rules/teacherRulesList', ///api/weekRule/scheduleForTeacherList
            payload: {
                versionId: currentVersion,
                teacherIdList: selectTeacher,
                tagList,
            },
        });
    }

    //根据作息id获取排课详情
    getTableSource() {
        const { dispatch, currentVersion } = this.props;

        dispatch({
            type: 'rules/scheduleRuleDetail',
            payload: {
                versionId: currentVersion,
            },
        }).then(() => {
            const { scheduleDetail } = this.props;
            this.setState({
                allLessons: this.formatLessons(scheduleDetail),
                formDataSource: this.addDayLessonId(scheduleDetail),
            });
        });
    }

    //处理表格中的数据--添加uuId作为回显的标识 uuId：day-lesson
    addDayLessonId(dataSource) {
        if (!dataSource || dataSource.length == 0) return [];
        dataSource.map((item) => {
            this.addUUId(item);
        });
        return dataSource;
    }

    addUUId(arr) {
        if (!arr || arr.length == 0) return [];
        arr.map((item) => {
            item.uuId = `${item.weekDay}-${item.sort}`;
        });
        return arr;
    }

    //根据课程查询作息id
    getScheduleByCourse(value) {
        this.setState({
            selectCourse: value,
        });
        /* const { dispatch, currentVersion } = this.props;
        return dispatch({
            type: 'rules/courseAcquisition',
            payload: {
                versionId: currentVersion,
                courseIdList: value
            },
            onSuccess: () => {
                const { courseAcquisition } = this.props;
                let scheduleId =
                    courseAcquisition && courseAcquisition[0] && courseAcquisition[0].scheduleId;
                this.setState(
                    {
                        courseScheduleId: scheduleId,
                        selectCourse: value
                    },
                    () => {
                        this.getTableSource(scheduleId, callback);
                    }
                );
            }
        }); */
    }

    //根据学生组查询作息id
    getScheduleByStudentGroup(selectStudentGroup, callback) {
        this.setState({
            selectStudentGroup: selectStudentGroup,
        });
        /* const { dispatch, currentVersion } = this.props;
        return dispatch({
            type: 'rules/accordingVersion',
            payload: {
                versionId: currentVersion,
                classIdList: selectStudentGroup
            },
            onSuccess: () => {
                const { accordingVersion } = this.props;
                let scheduleId =
                    accordingVersion && accordingVersion[0] && accordingVersion[0].scheduleId;
                this.setState(
                    {
                        
                        studentGroupScheduleId: scheduleId
                    },
                );
            }
        }); */
    }

    //格式化课程
    formatCourseData = () => {
        const { courseAllList } = this.props;
        if (!courseAllList || courseAllList.length <= 0) return;
        let courseData = [];
        courseAllList.map((item, index) => {
            let obj = {
                title: locale() !== 'en' ? item.name : item.englishName,
                key: item.id,
                value: item.id,
            };
            courseData.push(obj);
        });
        return courseData;
    };

    //格式化学生组
    formatStudentGroups = () => {
        const { newClassGroupList } = this.props;
        if (!newClassGroupList || newClassGroupList.length <= 0) return;
        let studentGroupData = [];
        newClassGroupList.map((item, index) => {
            let obj = {};
            obj.title = item.name;
            obj.key = item.type;
            obj.value = item.type;
            obj.children = this.formatGradeStu(item.gradeStudentGroupModels, item.name);
            studentGroupData.push(obj);
        });
        return studentGroupData;
    };

    //格式化分层班
    formatGradeStu = (classArr, name) => {
        if (!classArr || classArr.length <= 0) return [];
        let childrenArr = [];
        classArr.map((item, index) => {
            let obj = {};
            obj.title = locale() !== 'en' ? item.name : item.englishName;
            obj.key = item.gradeId + name;
            obj.value = item.gradeId + name;
            obj.children = this.formatChildren(item.studentGroupList);
            childrenArr.push(obj);
        });
        return childrenArr;
    };

    //格式化班级
    formatChildren = (classArr) => {
        if (!classArr || classArr.length <= 0) return [];
        let childrenArr = [];
        classArr.map((item, index) => {
            let obj = {};
            obj.title = locale() !== 'en' ? item.name : item.ename;
            obj.key = item.id;
            obj.value = item.id;
            childrenArr.push(obj);
        });
        return childrenArr;
    };

    //选择教师
    changeTeacher = (value) => {
        const { confirmEditBtn } = this.state;

        /* if (confirmEditBtn) {
            //编辑下禁止删除最后一个，为了留下对比scheduleId
            if (value.length == 0) return false;
        } */

        this.setState(
            {
                selectTeacher: value,
                // selectGrade: undefined
            }
            /* () => {
                if (value.length == 0) {
                    if (!confirmEditBtn) {
                        this.setState({
                            selectStatus: {},
                            checkedLessons: {},
                            checkedLessonTitle: '',
                            remark: '',
                            weightPercent: 100,
                            editListId: '',
                            // formDataSource: []
                        });
                        return false;
                    }
                }
                if (!confirmEditBtn) {
                    //新增状态下
                    this.setState(
                        {
                            selectStatus: {},
                            // checkedLessons: {},
                            checkedLessonTitle: '',
                            remark: '',
                            weightPercent: 100,
                            editListId: '',
                            // formDataSource: []
                        },
                        () => {
                            this.getTableSource(this.state.selectGrade);
                        }
                    );
                } else {
                    //编辑状态下保留table值，并计算title
                    this.computeTitleAndUnselect(this.state.checkedLessons);
                    return false;
                }
            } */
        );
    };

    //选择角色
    changeRole = (value) => {
        const { confirmEditBtn } = this.state;

        if (confirmEditBtn) {
            //编辑下禁止删除最后一个，为了留下对比scheduleId
            if (value.length == 0) return false;
        }

        this.setState(
            {
                tagList: value,
                selectGrade: undefined,
            }
            /* () => {
                if (value.length == 0) {
                    if (!confirmEditBtn) {
                        this.setState({
                            selectStatus: {},
                            checkedLessons: {},
                            checkedLessonTitle: '',
                            remark: '',
                            weightPercent: 100,
                            editListId: '',
                            formDataSource: []
                        });
                        return false;
                    }
                }
                this.getGradeByTeacherValue().then(() => {
                    const { gradeByTeacherList } = this.props;
                    this.setState(
                        {
                            selectGrade:
                                (gradeByTeacherList &&
                                    gradeByTeacherList[0] &&
                                    gradeByTeacherList[0].scheduleId) ||
                                undefined
                        },
                        () => {
                            if (!this.state.selectGrade) return false;
                            
                        }
                    );
                });
                if (!confirmEditBtn) {
                    //新增状态下
                    this.setState(
                        {
                            selectStatus: {},
                            checkedLessons: {},
                            checkedLessonTitle: '',
                            remark: '',
                            weightPercent: 100,
                            editListId: '',
                            formDataSource: []
                        },
                        () => {
                            this.getTableSource(this.state.selectGrade);
                        }
                    );
                } else {
                    //编辑状态下保留table值，并计算title
                    this.computeTitleAndUnselect(this.state.checkedLessons);
                    return false;
                }
            } */
        );
    };

    changeTeacherPerson = (value) => {
        let resultArr = [];
        value &&
            value.length > 0 &&
            value.map((el) => {
                let result = Number(el.split('-')[el.split('-').length - 1]);
                resultArr.push(result);
            });
        this.changeTeacher(resultArr);
    };

    changeRolePerson = (value) => {
        this.setState(
            {
                tagList: value,
            },
            () => {}
        );
        // debugger
        this.changeRole(value);
    };

    identityChange = (value) => {
        this.setState(
            {
                identity: value,
            },
            () => {}
        );
        // debugger
    };

    //选择年级
    changeGrade = (value) => {
        this.setState(
            {
                selectGrade: value,
            }
            /* () => {
                this.getTableSource(value);
            } */
        );
    };

    //选择课程
    changeCourse = (value) => {
        const { confirmEditBtn } = this.state;
        if (confirmEditBtn) {
            //编辑下禁止删除最后一个
            // if (value.length == 0) return false;

            //获取课程的作息id
            this.setState({
                selectCourse: value,
            });
            // this.getScheduleByCourse(value, () => {
            //保留table值，并计算title
            this.computeTitleAndUnselect(this.state.checkedLessons);
            return false;
            // });
        } else if (!confirmEditBtn) {
            //新增状态
            this.setState({
                selectCourse: value,
            });
            // this.getScheduleByCourse(value);
            /* this.setState(
                {
                    selectStatus: {},
                    checkedLessons: {},
                    checkedLessonTitle: '',
                    remark: '',
                    weightPercent: 100,
                    editListId: '',
                    formDataSource: []
                },
                () => {
                    if (value.length == 0) {
                        this.setState({
                            selectCourse: undefined
                        });
                        return false;
                    }
                    
                }
            ); */
        }
    };

    //选择学生组
    changeStudentGroup = (valueParams) => {
        let value = valueParams.filter((item) => isNumber(item));
        const { confirmEditBtn } = this.state;
        if (confirmEditBtn) {
            //编辑下禁止删除最后一个
            // if (value.length == 0) return false;

            //获取学生组的scheduleId
            this.getScheduleByStudentGroup(value, () => {
                //保留table值，并计算title
                this.computeTitleAndUnselect(this.state.checkedLessons);
                return false;
            });
        } else if (!confirmEditBtn) {
            //新增状态
            this.getScheduleByStudentGroup(value);
            /* this.setState(
                {
                    selectStatus: {},
                    checkedLessons: {},
                    checkedLessonTitle: '',
                    remark: '',
                    weightPercent: 100,
                    editListId: '',
                    formDataSource: []
                },
                () => {
                    if (value.length == 0) {
                        this.setState({
                            selectStudentGroup: undefined
                        });
                        return false;
                    }
                    
                }
            ); */
        }
    };

    //获取选中教师的名称
    getSelectTeacherName = (value) => {
        const { allTeacherList } = this.props;
        let teacherName = [];
        allTeacherList &&
            allTeacherList.length > 0 &&
            allTeacherList.map((el) => {
                value &&
                    value.length > 0 &&
                    value.map((val) => {
                        if (val == el.teacherId) {
                            teacherName.push(
                                el.englishName ? el.name + ' ' + el.englishName : el.name
                            );
                        }
                    });
            });
        this.setState(
            {
                teacherMessageName: teacherName.join(','),
            },
            () => {
                // console.log('teacherMessageName', this.state.teacherMessageName);
            }
        );
        return teacherName.join(',');
    };

    //获取选中学生组的名称
    getSelectGroupName = (value) => {
        const studentGroupData = this.formatStudentGroups();
        let studentGroupName = [];
        studentGroupData &&
            studentGroupData.length > 0 &&
            studentGroupData.map((el) => {
                el.children &&
                    el.children.length > 0 &&
                    el.children.map((item) => {
                        item.children.map((items) => {
                            // items.children.map((order)=>{
                            value &&
                                value.length > 0 &&
                                value.map((list) => {
                                    if (list == items.value) {
                                        studentGroupName.push(items.title);
                                    }
                                });
                            // })
                        });
                    });
            });
        this.setState(
            {
                studentGroupMessageName: studentGroupName.join(','),
            },
            () => {
                // console.log('studentGroupMessageName', this.state.studentGroupMessageName);
            }
        );
        return studentGroupName.join(',');
    };

    //获取选中课程的名称
    getSelectCourseName = (value) => {
        const courseData = this.formatCourseData();
        let courseName = [];
        courseData &&
            courseData.length > 0 &&
            courseData.map((el) => {
                value &&
                    value.length > 0 &&
                    value.map((item) => {
                        if (el.value == item) {
                            courseName.push(el.title);
                        }
                    });
            });
        this.setState(
            {
                courseMessageName: courseName.join(','),
            },
            () => {
                // console.log('courseMessageName', this.state.courseMessageName);
            }
        );
        return courseName.join(',');
    };

    renderAllCol = () => {
        let { formDataSource } = this.state;
        //设置表格选中状态
        let selectStatus = [Object.assign({}, this.state.selectStatus)];
        let arr = [];
        for (let i = 0; i < formDataSource.length; i++) {
            for (let j = 0; j < formDataSource[0].length; j++) {
                arr.push(formDataSource[i][j]);
            }
        }
        let num = formDataSource.length * formDataSource[0].length;
        let jsonSel = JSON.stringify(selectStatus);
        let newArr = jsonSel.split(',');
        if (newArr.length != num && newArr.length != num * 3) {
            selectStatus = [];
            for (let i = 0; i < formDataSource.length; i++) {
                for (let j = 0; j < formDataSource[0].length; j++) {
                    let uuId = `${i + 1}-${j + 1}`;
                    selectStatus[uuId] = true;
                }
            }
        } else {
            for (let i = 0; i < formDataSource.length; i++) {
                for (let j = 0; j < formDataSource[0].length; j++) {
                    let uuId = `${i + 1}-${j + 1}`;
                    selectStatus[uuId] = false;
                }
            }
        }
        this.setState({
            selectStatus: selectStatus,
        });
        //存取选中的单元格
        let selectCol = Object.assign({}, this.state.checkedLessons);
        let jsonCol = JSON.stringify(selectCol);
        let newSel = jsonCol.split(',');
        if (newSel.length == num || newSel.length == num * 2) {
            selectCol = [];
        } else {
            selectCol = [];
            for (let i = 0; i < formDataSource.length; i++) {
                for (let j = 0; j < formDataSource[0].length; j++) {
                    selectCol.push({
                        sort: formDataSource[i][j].sort,
                        weekDay: formDataSource[i][j].weekDay,
                    });
                }
            }
        }
        this.setState(
            {
                checkedLessons: selectCol,
            },
            () => {
                const { allLessons } = this.state;

                //选中坐标
                let newCheckedLessons = this.handleCheckedLesson(this.state.checkedLessons);
                //处理选中坐标的标题
                let checkedLessonTitle = this.createTitle(newCheckedLessons);
                this.setState({
                    checkedLessons: newCheckedLessons,
                    checkedLessonTitle: checkedLessonTitle,
                });
            }
        );
    };

    //点击选中一整列
    allCols = (weekDay) => {
        let { formDataSource } = this.state;
        //设置表格选中状态
        let selectStatus = Object.assign({}, this.state.selectStatus);
        let isAllTrue = true;
        for (let i = 0; i < formDataSource[0].length; i++) {
            if (
                selectStatus[weekDay + '-' + (i + 1)] == false ||
                selectStatus[weekDay + '-' + (i + 1)] == undefined
            ) {
                isAllTrue = true;
            } else {
                isAllTrue = false;
            }
        }
        for (let i = 0; i < formDataSource[0].length; i++) {
            if (isAllTrue) {
                selectStatus[weekDay + '-' + (i + 1)] = true;
            } else {
                selectStatus[weekDay + '-' + (i + 1)] = false;
            }
        }
        this.setState(
            {
                selectStatus: selectStatus,
            },
            () => {}
        );
        //存取选中的单元格
        let selectCol = Object.assign({}, this.state.checkedLessons);
        if (!isAllTrue) {
            for (let i in selectCol) {
                for (let j = 0; j < formDataSource[0].length; j++) {
                    if (
                        weekDay + '-' + (j + 1) ===
                        `${selectCol[i].weekDay}-${selectCol[i].sort}`
                    ) {
                        delete selectCol[i];
                        break;
                    }
                }
            }
        } else {
            for (let i in selectCol) {
                for (let j = 0; j < formDataSource[0].length; j++) {
                    if (
                        weekDay + '-' + (j + 1) ===
                        `${selectCol[i].weekDay}-${selectCol[i].sort}`
                    ) {
                        delete selectCol[i];
                        break;
                    }
                }
            }
            for (let i = 0; i < formDataSource[0].length; i++) {
                selectCol[weekDay + '-' + (i + 1)] = {
                    sort: formDataSource[0][i].sort,
                    weekDay: weekDay,
                };
            }
        }

        this.setState(
            {
                checkedLessons: selectCol,
            },
            () => {
                const { allLessons } = this.state;

                //选中坐标
                let newCheckedLessons = this.handleCheckedLesson(this.state.checkedLessons);
                //未选中坐标
                //处理选中坐标的标题
                let checkedLessonTitle = this.createTitle(newCheckedLessons);
                this.setState({
                    checkedLessons: newCheckedLessons,
                    checkedLessonTitle: checkedLessonTitle,
                });
            }
        );
    };

    //点击选中一整行
    allRows = (order) => {
        let { formDataSource } = this.state;
        order = order + 1;
        console.log('order', order);
        //设置表格选中状态
        let selectStatus = Object.assign({}, this.state.selectStatus);
        let isAllTrue = true;
        for (let i = 1; i <= formDataSource.length; i++) {
            if (
                selectStatus[i + '-' + order] == false ||
                selectStatus[i + '-' + order] == undefined
            ) {
                isAllTrue = true;
            } else {
                isAllTrue = false;
            }
        }
        for (let i = 1; i < formDataSource[0].length; i++) {
            if (isAllTrue) {
                selectStatus[i + '-' + order] = true;
            } else {
                selectStatus[i + '-' + order] = false;
            }
        }
        this.setState(
            {
                selectStatus: selectStatus,
            },
            () => {
                console.log('this.state.selectStatus', this.state.selectStatus);
            }
        );
        //存取选中的单元格
        let selectCol = Object.assign({}, this.state.checkedLessons);
        if (!isAllTrue) {
            for (let i in selectCol) {
                for (let j = 1; j <= formDataSource.length; j++) {
                    if (j + '-' + order === `${selectCol[i].weekDay}-${selectCol[i].sort}`) {
                        delete selectCol[i];
                        break;
                    }
                }
            }
        } else {
            for (let i in selectCol) {
                for (let j = 1; j <= formDataSource.length; j++) {
                    if (j + '-' + order === `${selectCol[i].weekDay}-${selectCol[i].sort}`) {
                        delete selectCol[i];
                        break;
                    }
                }
            }
            for (let i = 0; i < formDataSource.length; i++) {
                selectCol[i + '-' + order] = {
                    sort: order,
                    weekDay: formDataSource[i][0].weekDay,
                };
            }
        }

        this.setState(
            {
                checkedLessons: selectCol,
            },
            () => {
                const { allLessons } = this.state;

                //选中坐标
                let newCheckedLessons = this.handleCheckedLesson(this.state.checkedLessons);
                //未选中坐标
                //处理选中坐标的标题
                let checkedLessonTitle = this.createTitle(newCheckedLessons);
                this.setState({
                    checkedLessons: newCheckedLessons,
                    checkedLessonTitle: checkedLessonTitle,
                });
            }
        );
    };

    //点击不排课col
    clickCurrentCol(id, week, lesson, order, canClick) {
        //设置表格选中状态
        let selectStatus = Object.assign({}, this.state.selectStatus);
        if (selectStatus[id] == undefined || selectStatus[id] == false) {
            selectStatus[id] = true;
        } else if (selectStatus[id] == true) {
            selectStatus[id] = false;
        }
        this.setState({
            selectStatus: selectStatus,
        });
        //存取选中的单元格
        let selectCol = Object.assign({}, this.state.checkedLessons);
        if (selectStatus[id] == true) {
            selectCol[id] = { sort: lesson, weekDay: week };
        } else {
            for (let i in selectCol) {
                if (id === `${selectCol[i].weekDay}-${selectCol[i].sort}`) {
                    delete selectCol[i];
                    break;
                }
            }
        }
        this.setState(
            {
                checkedLessons: selectCol,
            },
            () => {
                //选中坐标
                let newCheckedLessons = this.handleCheckedLesson(this.state.checkedLessons);
                console.log('newCheckedLessons', newCheckedLessons);
                this.setState({
                    checkedLessons: newCheckedLessons,
                });
            }
        );
    }

    //处理选中的课程
    handleCheckedLesson = (arr) => {
        let checkedLesson = [];
        for (let i in arr) {
            checkedLesson.push(arr[i]);
        }
        return this.formatCheckedLesson(checkedLesson);
    };

    //格式化选中的表格值
    formatCheckedLesson = (arr) => {
        if (!arr || arr.length <= 0) return [];
        let resultArr = [];
        arr.map((el) => {
            let obj = {};
            /* obj.day = el.split("-")[0];
            obj.lesson = el.split("-")[1]; */
            obj.weekDay = el.weekDay;
            obj.sort = el.sort;
            // obj.lessonsIndex = Number(el.split("-")[2]) + 1;
            resultArr.push(obj);
        });
        return resultArr;
    };

    //处理选中的坐标，拼成title:班级/教师/学生组 + 周几第几节不排课
    createTitle = (arr) => {
        if (!arr || arr.length <= 0) return '';
        const { selectTeacher, activeKey, selectCourse, selectStudentGroup } = this.state;
        let teacherName = this.getSelectTeacherName(selectTeacher);
        let studentGroupName = this.getSelectGroupName(selectStudentGroup);
        let courseName = this.getSelectCourseName(selectCourse);
        let name =
            activeKey == '1' ? teacherName : activeKey == '2' ? studentGroupName : courseName;
        let resultArr = arr;
        let resultTitle = name + this.mapDayAndLesson(resultArr, name);
        return resultTitle;
    };

    //根据不同类型拼接
    mapDayAndLesson = (dayLesson) => {
        let title = '';
        dayLesson &&
            dayLesson.length > 0 &&
            dayLesson.map((el) => {
                title += ' 周' + intoChinese(el.weekDay) + ' 第' + el.sort + '节不排课 ';
            });
        return title;
    };

    //选择必须满足&&尽量满足的条件
    showSelectCondition = (e) => {
        e.nativeEvent.stopImmediatePropagation();
        this.setState({
            showConditionList: true,
        });
    };

    //隐藏必选满足&&尽量满足条件列表
    hideCondition = () => {
        this.setState({
            showConditionList: false,
        });
    };

    //选择权重
    selectWeightPercent = (value) => {
        this.setState({
            weightPercent: value,
        });
    };

    //用户填写备注
    fillInRemark = (e) => {
        if (e.target.value && e.target.value.length > 50) {
            message.info('备注不能太长哦~');
            return false;
        }
        this.setState({
            remark: e.target.value,
        });
    };

    onChangeRuleType = (e) => {
        this.setState({
            ruleType: e.target.value,
        });
    };

    //保存用户选中的规则
    saveFormInformation = (id) => {
        const { dispatch, currentVersion, selfId, acRuleFilterParamInputModelList } = this.props;
        const {
            activeKey,
            checkedLessons,
            remark,
            weightPercent,
            checkedLessonTitle,
            courseScheduleId,
            selectGrade,
            studentGroupScheduleId,
            selectTeacher,
            selectCourse,
            selectStudentGroup,
            selectStatus,
            tagList,
            ruleType,
            teacherMessageName,
        } = this.state;
        if (!this.validator()) {
            message.info('请完善规则再保存');
            return false;
        }
        let dispatchType = id ? 'rules/weeklyRuleChanges' : 'rules/newRuleManagement';
        // 根据id来判断是新增还是更新
        ///api/weekRule/update
        // /api/weekRule/save'
        let utilObj = {};
        if (activeKey == '1') {
            //教师
            // utilObj.scheduleId = selectGrade;
            utilObj.teacherIds = selectTeacher;
        } else if (activeKey == '2') {
            //学生组
            // utilObj.scheduleId = studentGroupScheduleId;
            utilObj.studentGroupIds = selectStudentGroup;
        } else if (activeKey == '3') {
            //课程
            // utilObj.scheduleId = courseScheduleId;
            utilObj.courseIds = selectCourse;
        } else if (activeKey == '4') {
            //课节
            utilObj.acRuleFilterParamInputModelList = acRuleFilterParamInputModelList;
            utilObj.title = acRuleFilterParamInputModelList[0].acShowList[0];
        }
        let editObj = {};
        if (id) {
            editObj.id = id;
        }
        let Title = this.createTitle(checkedLessons);
        this.setState({
            checkedLessonTitle: Title,
        });

        dispatch({
            type: dispatchType,
            payload: {
                ...editObj,
                baseRuleId: selfId,
                scheduleId: -1,
                title: Title,
                notAvailableCourseSortList: JSON.parse(JSON.stringify(this.state.checkedLessons)),
                ruleType: ruleType,
                // notAvailableCourseSortList: checkedLessons,
                versionId: currentVersion,
                remark: remark, //备注
                weightPercentage: Number(weightPercent),
                tagList,
                ...utilObj,
            },
            onSuccess: () => {
                const { getAddRules, getRuleCount } = this.props;
                this.clearAll();
                //不排课规则列表
                this.getNoScheduleList(this.state.activeKey);
                //已添加规则列表
                typeof getAddRules == 'function' && getAddRules.call(this);
                //规则统计
                typeof getRuleCount == 'function' && getRuleCount.call(this);

                const controllerFormList = Object.assign({}, this.state.controllerFormList);
                controllerFormList[this.state.activeKey] = false;
                this.setState({
                    controllerFormList,
                    ruleType: 1,
                });
                //清空子组件的checked归为初始状态
                if (activeKey == 4) {
                    dispatch({
                        type: 'rules/setAcRuleFilterParamInputModelList',
                        payload: [],
                    });
                }
                message.success('设置成功~');
            },
        });
    };

    //校验必填项
    validator = () => {
        let isFillInValue = true;
        const {
            activeKey,
            checkedLessonTitle,
            courseScheduleId,
            selectGrade,
            selectTeacher,
            selectCourse,
            selectStudentGroup,
            tagList,
        } = this.state;
        if (activeKey == '1') {
            if (
                (!selectTeacher && !tagList) ||
                (selectTeacher.length == 0 && tagList.length == 0)
            ) {
                isFillInValue = false;
            }
        } else if (activeKey == '2') {
            if (!selectStudentGroup || selectStudentGroup.length == 0) {
                isFillInValue = false;
            }
        } else if (activeKey == '3') {
            if (!selectCourse || selectCourse.length == 0) {
                isFillInValue = false;
            }
        }
        return isFillInValue;
    };

    //Form表单
    renderForm = (item) => {
        const { allTeacherList, gradeByTeacherList, courseBySubject } = this.props;
        const {
            selectGrade,
            selectTeacher,
            selectCourse,
            selectStudentGroup,
            showConditionList,
            weightPercent,
            formDataSource,
            remark,
            confirmEditBtn,
            editListId,
            identity,
        } = this.state;
        let content;

        if (item.id == 1) {
            content = (
                <DepartmentSelect
                    tagList={this.state.tagList}
                    roleTag={this.props.roleTag}
                    identity={identity}
                    treeData={this.props.departmentList}
                    referenceSource="rule"
                    inputWidth={300}
                    teacherIds={selectTeacher}
                    onTeacherChange={this.changeTeacherPerson}
                    onRoleChange={this.changeRolePerson}
                    identityChange={this.identityChange}
                    fetchTeacherAndOrg={this.props.fetchTeacherAndOrg}
                />
            );
        } else if (item.id == 2) {
            const studentGroupProps = {
                treeData: this.formatStudentGroups(),
                placeholder: trans('global.Search or select classes', '搜索或选择学生组'),
                value: selectStudentGroup,
                onChange: this.changeStudentGroup,
                multiple: true,
                allowClear: true,
                style: {
                    width: 406,
                },
                dropdownStyle: {
                    maxHeight: 300,
                    overflow: 'auto',
                },
                treeCheckable: true,
                treeDefaultExpandAll: true,
            };
            content = <TreeSelect {...studentGroupProps} />;
        } else if (item.id == 3) {
            const courseProps = {
                treeData: this.formatCourseSelectData(courseBySubject),
                value: selectCourse,
                placeholder: trans('global.Search or select courses', '搜索或选择课程'),
                onChange: this.changeCourse,
                treeCheckable: true,
                treeNodeFilterProp: 'title',
                style: {
                    width: 406,
                },
                dropdownStyle: {
                    maxHeight: 400,
                    overflow: 'auto',
                },
                showCheckedStrategy: TreeSelect.SHOW_CHILD,
            };
            content = <TreeSelect {...courseProps} />;
        } else if (item.id === 4) {
            content = (
                <SearchCourse
                    menuKey={this.props.activeKey}
                    {...this.props}
                    {...this.state}
                ></SearchCourse>
            );
        }

        return (
            <div className={styles.formContent}>
                {content}
                <div className={styles.byLessons}>
                    <Radio value={0} checked={true}>
                        {trans('global.Select by section', '按节次选')}
                    </Radio>
                    <span className={styles.hint}>提示：可以全选或者点击表头选择整行整列</span>
                </div>
                {this.createTable()}
                <div className={styles.remarkArea}>
                    <Input
                        placeholder={trans('global.no more than', '备注（选填，50字以内）')}
                        value={remark}
                        maxLength={50}
                        className={styles.remarkInput}
                        onChange={this.fillInRemark}
                    />
                    <div className={styles.conditionList}>
                        <div className={styles.showResult}>
                            {weightPercent == '100' ? (
                                <span
                                    className={styles.commonButton + ' ' + styles.necessaryBtn}
                                    onClick={this.showSelectCondition}
                                >
                                    {trans('global.Must Satisfy', '必须满足')}
                                </span>
                            ) : (
                                <span
                                    className={styles.commonButton + ' ' + styles.unNecessaryBtn}
                                    onClick={this.showSelectCondition}
                                >
                                    {trans('global.Try to Satisfy', '尽量满足')}
                                </span>
                            )}
                        </div>
                        {showConditionList && (
                            <div className={styles.showConditionList}>
                                <span
                                    className={styles.commonButton + ' ' + styles.necessaryBtn}
                                    onClick={this.selectWeightPercent.bind(this, '100')}
                                >
                                    {trans('global.Must Satisfy', '必须满足')}
                                </span>
                                <span
                                    className={styles.commonButton + ' ' + styles.unNecessaryBtn}
                                    onClick={this.selectWeightPercent.bind(this, '95')}
                                >
                                    {trans('global.Try to Satisfy', '尽量满足')}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                {item.id == 3 ? (
                    <div>
                        {trans('charge.type', '类型')}
                        <Radio.Group
                            style={{ marginLeft: 8 }}
                            onChange={this.onChangeRuleType}
                            value={this.state.ruleType}
                        >
                            <Radio value={1}>
                                {trans('global.Subject Teaching Research', '学科教研')}
                            </Radio>
                            <Radio value={0}>{trans('global.other', '其他')}</Radio>
                        </Radio.Group>
                    </div>
                ) : (
                    ''
                )}

                <div className={styles.operButton}>
                    {confirmEditBtn ? (
                        <span
                            className={styles.saveBtn}
                            onClick={this.saveFormInformation.bind(this, editListId)}
                        >
                            {trans('global.confirm', '确认')}
                        </span>
                    ) : (
                        <span
                            className={styles.saveBtn}
                            onClick={this.saveFormInformation.bind(this, '')}
                        >
                            {trans('global.save', '保存')}
                        </span>
                    )}
                    <span
                        className={styles.cancelBtn}
                        onClick={this.addRules.bind(this, item.id, 'cancel')}
                    >
                        {trans('global.cancel', '取消')}
                    </span>
                </div>
            </div>
        );
    };

    //动态生成表格
    createTable = () => {
        const { formDataSource } = this.state;
        return (
            <div className={styles.commonFormStyle}>
                {formDataSource && formDataSource.length > 0 && (
                    <Row className={styles.weekRowStyle}>
                        <Col span={3}>
                            <span onClick={this.renderAllCol} style={{ cursor: 'pointer' }}>
                                全选
                            </span>
                        </Col>
                        {this.renderCol('week', '')}
                    </Row>
                )}
                {formDataSource &&
                    formDataSource.length > 0 &&
                    formDataSource.map((item, index) => {
                        if (index == 0) {
                            return (
                                item &&
                                item.length > 0 &&
                                item.map((el, order) => {
                                    return (
                                        <Row key={order} className={styles.lessonRowStyle}>
                                            <Col onClick={() => this.allRows(order)} span={3}>
                                                {order + 1}
                                            </Col>
                                            {this.renderCol('lesson', order)}
                                        </Row>
                                    );
                                })
                            );
                        }
                    })}
            </div>
        );
    };

    //渲染列
    renderCol = (type, order) => {
        const { selectStatus, formDataSource } = this.state;
        return (
            formDataSource &&
            formDataSource.length > 0 &&
            formDataSource.map((item, index) => {
                if (type == 'week') {
                    return (
                        <Col span={parseInt(21 / formDataSource.length)} key={index}>
                            <span
                                onClick={() => this.allCols(item[0].weekDay)}
                                style={{ cursor: 'pointer' }}
                            >
                                {trans('global.formDataSourceDay', '周')}
                                {intoChinese(item[0].weekDay)}
                            </span>
                        </Col>
                    );
                } else {
                    let canClick =
                        !item[0].weekDay || !formDataSource[index][order].sort ? false : true;
                    return (
                        <Col
                            span={parseInt(21 / formDataSource.length)}
                            key={index}
                            onClick={this.clickCurrentCol.bind(
                                this,
                                formDataSource[index][order].uuId,
                                item[0].weekDay,
                                formDataSource[index][order].sort,
                                order,
                                canClick
                            )}
                            className={
                                !canClick
                                    ? styles.canNotClick
                                    : selectStatus[formDataSource[index][order].uuId] == true ||
                                      selectStatus[formDataSource[index][order].id] == true
                                    ? styles.blueCol
                                    : styles.whiteCol
                            }
                        >
                            <span>
                                {item[0].weekDay}-{formDataSource[index][order].sort}
                            </span>
                        </Col>
                    );
                }
            })
        );
    };

    //处理所有课节
    formatLessons = (arr) => {
        if (!arr || arr.length <= 0) return;
        let resultArr = [];
        arr.map((item, index) => {
            item &&
                item.length > 0 &&
                item.map((el) => {
                    let obj = {
                        weekDay: el.weekDay,
                        sort: el.sort,
                    };
                    resultArr.push(obj);
                });
        });
        return resultArr;
    };

    //处理数据库之前存储的数据 --将id换成uuId
    updateSaveParams = (selectStatus, checkedLessons) => {
        if (!checkedLessons || checkedLessons.length == 0) return;
        let arr = [];
        for (let i in checkedLessons) {
            for (let j in selectStatus) {
                if (i == j) {
                    let newKey = `${checkedLessons[i].weekDay}-${checkedLessons[i].sort}`;
                    arr[newKey] = true;
                }
            }
        }
        this.setState(
            {
                selectStatus: arr,
            },
            () => {
                console.log('this.state.selectStatus', this.state.selectStatus);
            }
        );
    };

    //编辑规则
    editNoScheduleRules = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'rules/oneRuleInformation',
            payload: {
                id: id,
            },
        }).then(() => {
            const { editRuleInformation } = this.props;
            const { activeKey, controllerFormList, identity } = this.state;
            let formIsOpen = JSON.parse(JSON.stringify(controllerFormList));
            formIsOpen[activeKey] = true;
            let editRuleList = editRuleInformation ? editRuleInformation : {};
            if (activeKey == 1) {
                //教师回显
                this.setState(
                    {
                        selectTeacher: editRuleList.teacherIds ? editRuleList.teacherIds : [],
                        tagList: editRuleList.tagList ? editRuleList.tagList : [],
                        identity: isEmpty(editRuleList.tagList) ? 'teacher' : 'role',
                    },
                    () => {
                        //获取表格
                        this.getTableSource();
                        this.setState(
                            {
                                selectStatus:
                                    /* editRuleList.notAvailableSort &&
                                    JSON.parse(editRuleList.notAvailableSort), */
                                    editRuleList.notAvailableCourseSortList,
                                checkedLessons:
                                    /* editRuleList.notAvailableSort &&
                                    JSON.parse(editRuleList.notAvailableSort), */
                                    editRuleList.notAvailableCourseSortList,
                            },
                            () => {
                                //处理更换作息表之前的旧数据
                                this.updateSaveParams(
                                    this.state.selectStatus,
                                    this.state.checkedLessons
                                );
                                // this.computeTitleAndUnselect(this.state.checkedLessons);
                            }
                        );
                    }
                );
            } else if (activeKey == 2) {
                this.setState({
                    selectStudentGroup: undefined,
                });
                //学生组回显
                formIsOpen[activeKey] = true;
                let studentGroup = editRuleList.studentGroupIds || [];
                //获取作息id
                this.getTableSource();
                // this.getScheduleByStudentGroup(studentGroup, () => {});
                this.setState(
                    {
                        selectStudentGroup: studentGroup,
                        selectStatus: editRuleList.notAvailableCourseSortList,
                        checkedLessons: editRuleList.notAvailableCourseSortList,
                    },
                    () => {
                        //处理更换作息表之前的旧数据
                        this.updateSaveParams(this.state.selectStatus, this.state.checkedLessons);
                        //计算坐标和标题
                        // this.computeTitleAndUnselect(this.state.checkedLessons);
                    }
                );
            } else if (activeKey == 3) {
                this.setState({
                    selectCourse: undefined,
                });
                //课程回显
                let courseValue = editRuleList.courseIds || [];
                //获取作息id
                this.getTableSource();
                // this.getScheduleByCourse(courseValue, () => {});
                this.setState(
                    {
                        selectCourse: courseValue,
                        selectStatus: editRuleList.notAvailableCourseSortList,
                        checkedLessons: editRuleList.notAvailableCourseSortList,
                    },
                    () => {
                        //处理更换作息表之前的旧数据
                        this.updateSaveParams(this.state.selectStatus, this.state.checkedLessons);
                        //计算标题和未选中坐标
                        // this.computeTitleAndUnselect(this.state.checkedLessons);
                    }
                );
            } else if (activeKey == 4) {
                this.getTableSource();
                this.setState(
                    {
                        selectStatus: editRuleList.notAvailableCourseSortList,
                        checkedLessons: editRuleList.notAvailableCourseSortList,
                    },
                    () => {
                        //处理更换作息表之前的旧数据
                        this.updateSaveParams(this.state.selectStatus, this.state.checkedLessons);
                        //计算坐标和标题
                        // this.computeTitleAndUnselect(this.state.checkedLessons);
                    }
                );
                dispatch({
                    type: 'rules/setAcRuleFilterParamInputModelList',
                    payload:
                        editRuleInformation && editRuleInformation.acRuleFilterParamInputModelList,
                });
            }
            this.setState({
                controllerFormList: formIsOpen,
                remark: editRuleList.remark,
                weightPercent: editRuleList.weightPercentage.toString(),
                confirmEditBtn: true,
                editListId: id, //列表中的id
                ruleType: editRuleList.ruleType, //不排课类型
            });
        });
    };

    //计算标题和未选中坐标
    computeTitleAndUnselect = (stateCheckLesson) => {
        //计算标题和未选中坐标
        const { allLessons } = this.state;
        //选中坐标
        let checkedLessons = this.handleCheckedLesson(stateCheckLesson);
        //未选中坐标
        //处理选中坐标的标题
        let checkedLessonTitle = this.createTitle(checkedLessons);
        this.setState({
            checkedLessonTitle: checkedLessonTitle,
        });
    };

    //根据搜索条件搜索列表
    searchList = (value) => {
        const { dispatch, currentVersion, selfId } = this.props;
        const { activeKey } = this.state;
        dispatch({
            type: 'rules/ruleListOfTypes',
            payload: {
                versionId: currentVersion,
                baseRuleId: selfId,
                ruleObjectRelationType: activeKey,
                objectIdList: value,
            },
        });
    };
    //排课v1.3  搜索选择教师
    searchTeacher = (value) => {
        this.setState(
            {
                searchTeacherValue: value,
            },
            () => {
                this.searchList(value);
            }
        );
    };

    //排课v1.3 搜索选择课程
    searchCourse = (value) => {
        this.setState(
            {
                searchCourseValue: value,
            },
            () => {
                this.searchList(value);
            }
        );
    };

    changeCopyStatus = () => {
        this.setState({
            copyStatus: !this.state.copyStatus,
            selectedRuleIdList: [],
        });
    };

    handleCommonListClick = (id) => {
        const { selectedRuleIdList } = this.state;
        if (selectedRuleIdList.includes(id)) {
            remove(selectedRuleIdList, (item) => item === id);
        } else {
            selectedRuleIdList.push(id);
        }
        this.setState({
            ifSelectAll: false,
            selectedRuleIdList,
        });
    };

    copyTo = () => {
        const { selectedRuleIdList } = this.state;
        this.setState({
            copyScheduleVisible: true,
        });
        this.copyScheduleRangeChange(moment());
    };

    clickAllRules = (e) => {
        const checked = e.target.checked;
        const { ruleListOfTypes } = this.props;
        if (checked) {
            this.setState({
                ifSelectAll: true,
                selectedRuleIdList: ruleListOfTypes.map((item) => item.id),
            });
        } else {
            this.setState({
                ifSelectAll: false,
                selectedRuleIdList: [],
            });
        }
    };

    //确认复制
    copyScheduleOk = () => {
        const { targetVersionId, selectedRuleIdList } = this.state;
        const { dispatch, currentVersion } = this.props;
        console.log('this.props :>> ', this.props);
        this.setState({
            copyScheduleLoading: true,
        });
        dispatch({
            type: 'rules/ruleCopy',
            payload: {
                targetVersionId,
                sourceVersionId: currentVersion,
                ruleIdList: selectedRuleIdList,
            },
        }).then(() => {
            this.setState({
                selectedRuleIdList: [],
                copyScheduleVisible: false,
                copyStatus: false,
                copyScheduleLoading: false,
            });
        });
    };

    //取消复制
    copyScheduleCancel = () => {
        this.setState({
            copyScheduleVisible: false,
        });
    };

    copyScheduleRangeChange = (date) => {
        const { dispatch } = this.props;
        let startTime = date.startOf('isoWeek').valueOf();
        let endTime = date.endOf('isoWeek').valueOf() - 999;

        this.setState({
            startTime,
            endTime,
        });

        dispatch({
            type: 'rules/getVersionList',
            payload: {
                startTime,
                endTime,
                gradeIdList: [],
            },
        });
    };

    getVersionName = (versionItem) => {
        if (versionItem) {
            return `${versionItem.systemVersionNumber ? versionItem.systemVersionNumber : ''}${
                versionItem.createType === 0 ? '' : '系统调课'
            } ${versionItem.name}`;
        } else return '';
    };

    emptyAcRuleFilterParamInputModelList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'rules/setAcRuleFilterParamInputModelList',
            payload: [],
        });
    };

    render() {
        const { tabs, ruleListOfTypes, allTeacherList, versionList } = this.props;
        const {
            activeKey,
            controllerFormList,
            searchTeacherValue,
            searchCourseValue,
            copyStatus,
            ifSelectAll,
            selectedRuleIdList,
            copyScheduleVisible,
            copyScheduleLoading,
            startTime,
            endTime,
        } = this.state;
        let courseGroup = this.formatCourseData();
        return (
            <div className={styles.noScheduleRules}>
                <div>
                    <Tabs tabPosition="top" activeKey={activeKey} onChange={this.changeTabs}>
                        {tabs &&
                            tabs.length > 0 &&
                            tabs.map((item, index) => {
                                return (
                                    <TabPane
                                        tab={`${item.name}（${item.amount}）`}
                                        key={`${item.id}`}
                                    >
                                        <div className={styles.ruleContainer}>
                                            {!controllerFormList[item.id] && (
                                                <div
                                                    className={styles.addPlus}
                                                    onClick={this.addRules.bind(
                                                        this,
                                                        item.id,
                                                        'add'
                                                    )}
                                                >
                                                    <i className={icon.iconfont}>&#xe75a;</i>
                                                </div>
                                            )}
                                            {controllerFormList[item.id] && (
                                                <div className={styles.rulesForm}>
                                                    {this.renderForm(item)}
                                                </div>
                                            )}
                                            <div className={styles.showAddedRules}>
                                                <div className={styles.searchCondition}>
                                                    <p className={styles.addRulesTitle}>
                                                        {trans('global.Rules Added', '已添加规则')}
                                                    </p>
                                                    {item.id == 1 && (
                                                        <Select
                                                            placeholder={trans(
                                                                'global.Search teachers',
                                                                '按教师名称筛选'
                                                            )}
                                                            style={{ maxWidth: 140 }}
                                                            value={searchTeacherValue}
                                                            onChange={this.searchTeacher}
                                                            optionFilterProp="children"
                                                            className={styles.searchTeacher}
                                                            showSearch
                                                            allowClear={true}
                                                        >
                                                            {allTeacherList &&
                                                                allTeacherList.length > 0 &&
                                                                allTeacherList.map(
                                                                    (item, index) => {
                                                                        let name = item.englishName
                                                                            ? item.name +
                                                                              '-' +
                                                                              item.englishName
                                                                            : item.name;
                                                                        return (
                                                                            <Option
                                                                                value={
                                                                                    item.teacherId
                                                                                }
                                                                                key={item.teacherId}
                                                                            >
                                                                                {name}
                                                                            </Option>
                                                                        );
                                                                    }
                                                                )}
                                                        </Select>
                                                    )}
                                                    {item.id == 3 && (
                                                        <Select
                                                            placeholder={trans(
                                                                'global.Search courses',
                                                                '按课程筛选'
                                                            )}
                                                            style={{ width: 140 }}
                                                            value={searchCourseValue}
                                                            onChange={this.searchCourse}
                                                            optionFilterProp="children"
                                                            showSearch
                                                            allowClear={true}
                                                            filterOption={(input, option) => {
                                                                return (
                                                                    option.props.children
                                                                        .toLowerCase()
                                                                        .indexOf(
                                                                            input.toLowerCase()
                                                                        ) >= 0
                                                                );
                                                            }}
                                                        >
                                                            {courseGroup &&
                                                                courseGroup.length > 0 &&
                                                                courseGroup.map((item, index) => {
                                                                    return (
                                                                        <Option
                                                                            value={item.value}
                                                                            key={item.value}
                                                                        >
                                                                            {item.title}
                                                                        </Option>
                                                                    );
                                                                })}
                                                        </Select>
                                                    )}
                                                </div>
                                                <div
                                                    className={styles.rulesList}
                                                    style={{
                                                        height:
                                                            controllerFormList[
                                                                this.state.activeKey
                                                            ] == true
                                                                ? '20vh'
                                                                : '67vh',
                                                        overflowY: 'scroll',
                                                    }}
                                                >
                                                    {ruleListOfTypes &&
                                                        ruleListOfTypes.length > 0 &&
                                                        ruleListOfTypes.map((item, index) => {
                                                            return (
                                                                <CommonList
                                                                    tagList={this.state.tagList}
                                                                    currentKey="noScheduleRules"
                                                                    getNoScheduleList={
                                                                        this.getNoScheduleList
                                                                    }
                                                                    key={item.id}
                                                                    selectedRuleId={item.id}
                                                                    dataSource={item}
                                                                    editNoScheduleRules={
                                                                        this.editNoScheduleRules
                                                                    }
                                                                    currentTabKey={activeKey}
                                                                    commonListClick={(id) =>
                                                                        this.handleCommonListClick(
                                                                            id
                                                                        )
                                                                    }
                                                                    selectedRuleIdList={
                                                                        selectedRuleIdList
                                                                    }
                                                                    copyStatus={copyStatus}
                                                                    ifSelectAll={ifSelectAll}
                                                                    clearAll={this.clearAll}
                                                                    {...this.props}
                                                                />
                                                            );
                                                        })}
                                                </div>
                                            </div>
                                            {item.id !== 4 && (
                                                <div className={styles.copyRules}>
                                                    {copyStatus ? (
                                                        <span>
                                                            <span>
                                                                <Checkbox
                                                                    onChange={this.clickAllRules}
                                                                >
                                                                    {trans(
                                                                        'global.choiceAll',
                                                                        '全选'
                                                                    )}
                                                                </Checkbox>
                                                            </span>
                                                            <span className={styles.copyCancel}>
                                                                <span
                                                                    onClick={this.changeCopyStatus}
                                                                >
                                                                    {trans('global.cancel', '取消')}
                                                                </span>
                                                                <span
                                                                    className={styles.copyTo}
                                                                    onClick={this.copyTo}
                                                                >
                                                                    {trans(
                                                                        'global.Copy To',
                                                                        '复制到'
                                                                    )}
                                                                </span>
                                                            </span>
                                                        </span>
                                                    ) : (
                                                        <span onClick={this.changeCopyStatus}>
                                                            {trans('global.Copy Rules', '复制规则')}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {copyScheduleVisible && (
                                                <Modal
                                                    visible={copyScheduleVisible}
                                                    title={trans(
                                                        'global.Select the target schedule',
                                                        '选择复制的课表'
                                                    )}
                                                    onOk={this.copyScheduleOk}
                                                    onCancel={this.copyScheduleCancel}
                                                    getContainer={false}
                                                    footer={[
                                                        <Button
                                                            key="back"
                                                            onClick={this.copyScheduleCancel}
                                                        >
                                                            {trans('global.cancel', '取消')}
                                                        </Button>,
                                                        <Button
                                                            key="submit"
                                                            type="primary"
                                                            loading={copyScheduleLoading}
                                                            onClick={this.copyScheduleOk}
                                                        >
                                                            {trans(
                                                                'global.confirmCopy',
                                                                '确认复制'
                                                            )}
                                                        </Button>,
                                                    ]}
                                                    width={420}
                                                >
                                                    <div className={styles.timePicker}>
                                                        <span className={styles.timeText}>
                                                            {moment(startTime).format(
                                                                'YYYY/MM/DD'
                                                            ) +
                                                                ' - ' +
                                                                moment(endTime).format(
                                                                    'YYYY/MM/DD'
                                                                )}
                                                        </span>
                                                        <DatePicker
                                                            onChange={this.copyScheduleRangeChange}
                                                            style={{ width: '240px' }}
                                                            className={styles.dateStyle}
                                                            allowClear={false}
                                                            defaultValue={moment()}
                                                        />
                                                    </div>
                                                    <Select
                                                        placeholder={trans(
                                                            'student.pleaseSelect',
                                                            '请选择'
                                                        )}
                                                        className={styles.versionListSelect}
                                                        onChange={(id) => {
                                                            this.setState({ targetVersionId: id });
                                                        }}
                                                        style={{ minWidth: 240 }}
                                                    >
                                                        {versionList &&
                                                            versionList.length > 0 &&
                                                            versionList.map((item, index) => {
                                                                return (
                                                                    <Option
                                                                        key={index}
                                                                        value={item.id}
                                                                        title={this.getVersionName(
                                                                            item
                                                                        )}
                                                                    >
                                                                        {this.getVersionName(item)}
                                                                    </Option>
                                                                );
                                                            })}
                                                    </Select>
                                                </Modal>
                                            )}
                                        </div>
                                    </TabPane>
                                );
                            })}
                    </Tabs>
                </div>
            </div>
        );
    }
}
