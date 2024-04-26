/* eslint-disable eqeqeq */
//课程卡片
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
    Row,
    Col,
    TreeSelect,
    Select,
    InputNumber,
    Icon,
    DatePicker,
    Modal,
    message,
    Switch,
    Tooltip,
    Popover,
    Input,
} from 'antd';
import styles from './card.less';
import icon from '../../../icon.less';
import { formatTime, formatTimeSafari } from '../../../utils/utils';
import moment from 'moment';
import { trans } from '../../../utils/i18n';
import HistoryImportModal from './historyModal';
import { ExclamationCircleTwoTone, PlusOutlined } from '@ant-design/icons';
import { SearchTeacher } from '@yungu-fed/yungu-selector';
import { isEmpty, uniqBy } from 'lodash';

import systemShare$ from 'dingtalk-jsapi/api/biz/util/systemShare';
import copy from 'copy-to-clipboard';
import course from '../../../../mock/course';
import { copyCard } from '../../../services/timeTable';
import { parse } from 'path-to-regexp';

const dateFormat = 'YYYY/MM/DD';

const { Option } = Select;
const { RangePicker } = DatePicker;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
@connect((state) => ({
    saveDefaultSuccess: state.course.saveDefaultSuccess,
    // teacherListnew: state.course.teacherList,
    newTeacherLists: state.course.newTeacherLists,
    getCoursePlanning: state.course.getCoursePlanning,
    planningGroupForAdd: state.course.planningGroupForAdd,
    // checkSemesterClassType : state.course.checkSemesterClassType,
    studentGroupList1: state.course.studentGroupList1,
    newGetCoursePlanning: state.course.newGetCoursePlanning,
    importHistorySemesterList: state.course.importHistorySemesterList,
    teacherByDeparment: state.course.teacherByDeparment,
    teacherByRole: state.course.teacherByRole,
    finalPlanList: state.course.finalPlanList,
}))
export default class CourseCard extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            courseController: {},
            showEdit: false, //是否作保存
            applyClassArr: [], //选择应用的教学班
            applyDetail: {}, //应用的详情
            applyFatherId: '', //应用的课程id
            modalVisible: false,
            applyModalVisible: false, //应用班级选择弹窗
            historyModal: false, //开课信息
            teacherValue: [], //老师ID
            switchOnchange: false, //收费开关
            totalLesson: '', //总课时
            weekLesson: '', //周课时
            maxStudent: '', //最多人
            minStudent: '', //最少人
            classFee: '', //课时费
            materialCost: '', //材料费
            updateCoursePlanning: '', //ID
            showTreeSelectMain: false,
            mainSelectValue: [],
            tsOpen: true,
            key: 1,
            planningGroupValue: '',
            hasChoose: false,
            coursePlanningState: [],
            seleectGroupList: [],
            fromHistoryModal: false, // 从上学期导入modal显隐
            hasSave: false,
            plainOption: '',
            hasChooseTeacher: false,
            hasCopy: false,
            copyCard: '',
            disChooseClassValue: '', //取消选择班级的id
            lastCourseId: '',
            selectCourseId: {}, // 保存选择的的上学期课程

            necessaryTeacherVisible: false,
            assistTeacherVisible: false,
            exchangeModalVisible: false,
            selectTeacherIndex: '',
            selectGroupOrder: '',
            classString: '', //更改过教师的班级字符串
        };
    }
    componentDidMount() {
        this.props.onRef(this);
        // this.getStudentGroupForCopy();
    }

    //    getStudentGroupForCopy() {
    //     const { dispatch } = this.props;
    //     const { gradeId } = this.state;
    //     dispatch({
    //         type: 'course/getStudentGroup1',
    //         payload: {
    //             gradeId: gradeId
    //         }
    //     })
    // }

    //存用户修改课程
    saveUserChange(detail, type) {
        const { dispatch } = this.props;
        if (type == 'changeClass') {
            //修改班级
            dispatch({
                type: 'course/saveChangeClass',
                payload: detail,
            });
        } else {
            //修改子行
            dispatch({
                type: 'course/saveChangeSubCourse',
                payload: detail,
            });
        }
    }

    //判断选中值是否有特殊字符-选课自动创建类型
    haveFlag = (arr) => {
        let result = false;
        if (!arr || arr.length == 0) return false;
        if (arr.length == 1 && arr[0].indexOf('&') != -1) {
            result = true;
        }
        return result;
    };

    haveFlagclass = (arr) => {
        let result = false;
        if (!arr || arr.length == 0) return false;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].indexOf('&') != -1) {
                result = false;
                break;
            }
            if (typeof arr[i] == 'string' && arr[i].indexOf('*') != -1) {
                result = true;
                break;
            }
        }
        return result;
    };

    deleteClass(order, courseDetial, id) {
        const { dispatch } = this.props;
        this.setState({
            showEdit: true,
        });
        let payloadObj = {};
        payloadObj.fatherId = courseDetial.id;
        payloadObj.groupOrder = order;
        payloadObj.studentGroupType = 1;
        payloadObj.studentGroups = this.getLeaveGroup(id, order);
        dispatch({
            type: 'course/deleteClassChange',
            payload: payloadObj,
        });
    }

    //选择班级
    changeClass(order, courseDetial, value, name, info) {
        this.setState({
            showEdit: true,
        });
        let deleteId = '';
        if (!info.checked) {
            deleteId = info.triggerNode.props.id;
        }
        let payloadObj;
        payloadObj = {
            fatherId: courseDetial.id,
            studentGroups: this.getSelectedDetail(value, 'class'),
            studentGroupType: 1, //will do
            groupOrder: order,
            deleteId,
        };
        this.saveUserChange(payloadObj, 'changeClass');
    }

    //选择主教
    changeMaster(num, order, courseDetail, value) {
        this.setState({
            showEdit: true,
            mainSelectValue: value,
        });
        //暂存修改
        let payloadObj = {
            fatherId: courseDetail.id,
            groupOrder: order,
            order: num,
            saveType: 'mainTeacher',
            mainTeacherInfoList: this.getSelectedDetail(value, 'teacher'),
        };
        this.saveUserChange(payloadObj, 'subCourse');
    }

    //选择协同老师
    changeHelpTeacher(num, order, courseDetail, value) {
        this.setState({
            showEdit: true,
        });
        //暂存修改
        let payloadObj = {
            fatherId: courseDetail.id,
            groupOrder: order,
            order: num,
            saveType: 'assistTeacher',
            assistTeacherInfoList: this.getSelectedDetail(value, 'teacher'),
        };
        this.saveUserChange(payloadObj, 'subCourse');
    }

    //选择时间
    changeTime(num, order, courseDetail, value, dateString) {
        this.setState({
            showEdit: true,
        });
        //暂存修改
        let payloadObj = {
            fatherId: courseDetail.id,
            groupOrder: order,
            order: num,
            saveType: 'effectiveTime',
            effectiveTime: this.formatterTime(dateString[0], 'start'),
            failureTime: this.formatterTime(dateString[1], 'end'),
        };
        this.saveUserChange(payloadObj, 'subCourse');
    }

    //选择周次
    changeWeek(num, order, courseDetail, value) {
        this.setState({
            showEdit: true,
        });
        //暂存修改
        let payloadObj = {
            fatherId: courseDetail.id,
            groupOrder: order,
            order: num,
            saveType: 'frequency',
            frequency: value,
        };
        this.saveUserChange(payloadObj, 'subCourse');
    }

    //选择周节课
    changeWeekLessons(num, order, courseDetail, value) {
        this.setState({
            showEdit: true,
        });
        //暂存修改
        let payloadObj = {
            fatherId: courseDetail.id,
            groupOrder: order,
            order: num,
            saveType: 'weekLessons',
            weekLessons: value,
        };
        this.saveUserChange(payloadObj, 'subCourse');
    }

    //选择单节次数
    changeOnceLessons(num, order, courseDetail, value) {
        this.setState({
            showEdit: true,
        });
        //暂存修改
        let payloadObj = {
            fatherId: courseDetail.id,
            groupOrder: order,
            order: num,
            saveType: 'onceLessons',
            onceLessons: value,
        };
        this.saveUserChange(payloadObj, 'onceLessons');
    }

    //选择单节时长
    changeUnitDuration(num, order, courseDetail, value) {
        this.setState({
            showEdit: true,
        });
        //暂存修改
        let payloadObj = {
            fatherId: courseDetail.id,
            groupOrder: order,
            order: num,
            saveType: 'unitDuration',
            unitDuration: value,
        };
        this.saveUserChange(payloadObj, 'subCourse');
    }
    getLeaveGroup = (id, order) => {
        let deleteItem = [];
        const { courseDetail, coursePlanList } = this.props;
        courseDetail &&
            courseDetail.groups &&
            courseDetail.groups.length > 0 &&
            courseDetail.groups.map((item, index) => {
                if (index == order) {
                    item.studentGroupList.map((el) => {
                        if (id !== el.id) {
                            deleteItem.push(el);
                        }
                    });
                }
            });
        return deleteItem;
    };

    //选中班级或教师的详细信息
    getSelectedDetail(selectValue, type) {
        const { newTeacherLists, planningGroupForAdd, studentGroupList, courseDetail } = this.props;
        let addStudentGroupList = this.formatStudentGroup(planningGroupForAdd);
        let detail = [];
        let roleTeacherDetail = [];
        if (type == 'class') {
            addStudentGroupList.map((item, index) => {
                item.children &&
                    item.children.length > 0 &&
                    item.children.map((itemch, index) => {
                        selectValue.map((el) => {
                            if (el == itemch.value || el == itemch.title) detail.push(itemch);
                        });
                    });
            });
        } else if (type == 'teacher') {
            newTeacherLists.map((item, index) => {
                let obj = {
                    id: item.teacherId,
                    name: item.name,
                    ename: item.englishName,
                };
                selectValue.map((el, order) => {
                    if (item.teacherId == el) {
                        detail.push(obj);
                    }
                });
            });
        }
        return detail;
    }

    //转时间戳
    formatterTime = (value, type) => {
        let timeValue = type == 'start' ? value + ' 00:00:00' : value + ' 23:59:59';
        let date = new Date(formatTimeSafari(timeValue));
        return date.getTime();
    };

    //添加表格行
    addRow(detail, fatherId, groupOrder) {
        this.setState({
            showEdit: true,
        });
        const { dispatch } = this.props;
        //自己添加的表格行无id
        let itemDetail = Object.assign({}, detail);
        itemDetail.id = '';
        dispatch({
            type: 'course/addRowCourse',
            payload: {
                faterId: fatherId,
                addRowDetail: itemDetail,
                groupOrder: groupOrder,
            },
        });
    }

    //删除表格行
    deleteRow(detail, fatherId, index, groupOrder) {
        const { dispatch, semesterValue, schoolId } = this.props;
        let self = this;
        if (detail.id == '') {
            //自己添加的计划删除
            dispatch({
                type: 'course/deleteRowCourse',
                payload: {
                    fatherId: fatherId,
                    deleteIndex: index,
                    groupOrder: groupOrder,
                },
            }).then(() => {
                const { courseDetail } = this.props;
                if (
                    !courseDetail.groups ||
                    (courseDetail.groups && courseDetail.groups.length == 0)
                ) {
                    this.setState({
                        showEdit: false,
                    });
                }
            });
        } else {
            if (this.state.showEdit) {
                message.info('未保存操作不允许删除原有的课时计划');
                return;
            }
            Modal.confirm({
                title: trans('course.plan.confirmText', '你确认要删除这条课时计划吗？'),
                content: '',
                okText: trans('course.plan.okText', '确认'),
                cancelText: trans('course.plan.cancelText', '取消'),
                onOk() {
                    //数据库的计划删除
                    dispatch({
                        type: 'course/fetchDeletePlan',
                        payload: {
                            planId: detail.id,
                            schoolYearId: semesterValue,
                        },
                        onSuccess: () => {
                            const { dispatch } = self.props;
                            dispatch({
                                type: 'course/deleteRowCourse',
                                payload: {
                                    fatherId: fatherId,
                                    deleteIndex: index,
                                    groupOrder: groupOrder,
                                },
                            });
                        },
                    });
                },
            });
        }
    }

    //格式化班级
    formatGroup = (item) => {
        let arr = item.studentGroupList;
        let studentGroupType = item.studentGroupType;
        if (!arr || arr.length == 0) return [];
        let groupArr = [];
        arr.map((item, index) => {
            let id = item.id || item.value;
            groupArr.push(item.name || item.title);
        });
        return groupArr;
    };
    formatGroupIdLeft = (item) => {
        let arr = item.studentGroupList;
        if (!arr || arr.length == 0) return [];
        let groupArr = [];
        arr.map((item, index) => {
            groupArr.push(item.id);
        });
        return groupArr;
    };

    // id
    formatGroupIds = (item) => {
        let arr = item.studentGroupList;
        let studentGroupType = item.studentGroupType;
        if (studentGroupType == 3 || studentGroupType == 4) {
            return [studentGroupType + '&'];
        }
        if (!arr || arr.length == 0) return [];
        let groupArr = [];
        arr.map((item, index) => {
            let id = item.id || item.value;
            // groupArr.push(id + "*" + item.type)
            groupArr.push(item.id);
        });
        return groupArr;
    };

    //格式化教师
    formatTeacher = (arr) => {
        if (!arr || arr.length == 0) return [];
        let teacherArr = [];
        arr.map((item, index) => {
            teacherArr.push(item.id);
        });
        return teacherArr;
    };

    //格式化时间
    formatDate = (time) => {
        if (!time) return;
        let date = new Date(formatTimeSafari(time));
        let y, m, day;
        y = date.getFullYear();
        m = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        return y + '/' + m + '/' + day;
    };
    // 点击加号选班
    selectAddGroup = (e) => {
        const { showEdit } = this.state;
        if (this.state.hasChoose || this.state.showEdit) return;
        // e.stopPropagation()
        this.getCoursePlanning(this.props.courseDetail);
        const { dispatch, semesterValue, schoolId, courseDetail } = this.props;
        dispatch({
            type: 'course/coursePlanningGroupInfo',
            payload: {
                coursePlanningId: courseDetail.coursePlanningId, // 开课计划id
                semesterId: semesterValue, //--学期id
                schoolId: schoolId, //--学校id
            },
            onSuccess: () => {
                this.setState({
                    hasChoose: true,
                });
            },
        });
    };
    //添加课时计划
    addGroup(courseDetail, groupValue, title, type) {
        if (!groupValue || !type) return;
        const {
            dispatch,
            semesterValueNew,
            getCoursePlanning,
            semesterStartTime,
            semesterEndTime,
            newGetCoursePlanning,
        } = this.props;
        const { coursePlanningState, hasSave } = this.state;
        let coursePlinning = getCoursePlanning;
        this.setState({
            showEdit: true,
        });
        //复制课时--取第一个课时
        let defaultCoursePlanningList =
            (courseDetail.groups &&
                courseDetail.groups[0] &&
                courseDetail.groups[0]['defaultCoursePlanningList']) ||
            [];
        let frequency =
            (defaultCoursePlanningList[0] && defaultCoursePlanningList[0]['frequency']) || 0;
        let newDefaultCoursePlanningList = [];
        coursePlinning &&
            coursePlinning.weeklyClassInfoList &&
            coursePlinning.weeklyClassInfoList.length > 0 &&
            coursePlinning.weeklyClassInfoList.map((item) => {
                let obj = {};
                obj.id = '';
                obj.courseId = courseDetail.id;
                obj.effectiveTime = semesterStartTime;
                obj.failureTime = semesterEndTime;
                obj.onceLessons = item.onceLessons;
                obj.planningGroupId = '';
                obj.unitDuration = item.unitDuration;
                obj.weekLessons = item.weekLessons;
                obj.frequency = frequency;
                (obj.assistTeacherInfoList = []),
                    (obj.mainTeacherInfoList = []),
                    newDefaultCoursePlanningList.push(obj);
            });
        let groupObj = {
            studentGroupType: type,
            studentGroupList: [
                {
                    name: title,
                    id: groupValue,
                },
            ],

            defaultCoursePlanningList: newDefaultCoursePlanningList,
        };
        dispatch({
            type: 'course/addCourseGroup',
            payload: {
                fatherId: courseDetail.id,
                groups: groupObj,
                hasSave,
            },
        });
    }

    //保存课程设置
    saveCourse = (e) => {
        const { courseDetail, finalPlanList } = this.props;

        //校验
        if (!this.vaidatorCourseDetail()) {
            message.info(trans('course.plan.improve.information', '请完善课程信息'));
            return false;
        }

        let tempObj = {};
        finalPlanList &&
            finalPlanList.length &&
            finalPlanList.map((item, index) => {
                if (item.id == courseDetail.id) {
                    return (tempObj = item.groups);
                }
            });

        let isChangeTeacher = false;

        let changedClass = [];

        tempObj &&
            tempObj.length &&
            tempObj.forEach((item, index) => {
                courseDetail.groups &&
                    courseDetail.groups.length &&
                    courseDetail.groups.forEach((el, idx) => {
                        if (item.defaultCoursePlanningList.id == el.defaultCoursePlanningList.id) {
                            let tempArr = [];
                            el.studentGroupList.map((item5, index5) => {
                                return tempArr.push(item5.name);
                            });
                            item.defaultCoursePlanningList.forEach((item1, index1) => {
                                el.defaultCoursePlanningList.forEach((item2, index2) => {
                                    if (item1.id == item2.id) {
                                        if (
                                            ((!item1.mainTeacherInfoList ||
                                                item1.mainTeacherInfoList?.length == 0) &&
                                                item2.mainTeacherInfoList) ||
                                            (item1.mainTeacherInfoList &&
                                                (!item1.mainTeacherInfoList ||
                                                    item1.mainTeacherInfoList?.length == 0))
                                        ) {
                                            if (item2.mainTeacherInfoList.length != 0) {
                                                changedClass.push(...tempArr);
                                                isChangeTeacher = true;
                                            }
                                        }

                                        //判断主教是否改变
                                        if (
                                            item1.mainTeacherInfoList?.length ==
                                            item2.mainTeacherInfoList?.length
                                        ) {
                                            let tempArr1 = [];
                                            let tempArr2 = [];
                                            item1.mainTeacherInfoList.map((item3, index) => {
                                                return tempArr1.push(item3.id);
                                            });
                                            item2.mainTeacherInfoList.map((item4, index) => {
                                                return tempArr2.push(item4.id);
                                            });
                                            if (
                                                JSON.stringify(tempArr1) != JSON.stringify(tempArr2)
                                            ) {
                                                changedClass.push(...tempArr);
                                                isChangeTeacher = true;
                                            }
                                        } else {
                                            changedClass.push(...tempArr);
                                            isChangeTeacher = true;
                                        }
                                    }
                                    if (item1.id == item2.id) {
                                        if (
                                            ((!item1.assistTeacherInfoList ||
                                                item1.assistTeacherInfoList?.length == 0) &&
                                                item2.assistTeacherInfoList) ||
                                            (item1.assistTeacherInfoList &&
                                                !item2.assistTeacherInfoList) ||
                                            item2.assistTeacherInfoList?.length == 0
                                        ) {
                                            changedClass.push(...tempArr);
                                            isChangeTeacher = true;
                                        }
                                        //判断助教是否改变
                                        if (
                                            item1.assistTeacherInfoList?.length ==
                                            item2.assistTeacherInfoList?.length
                                        ) {
                                            let tempArr1 = [];
                                            let tempArr2 = [];
                                            item1.assistTeacherInfoList &&
                                                item1.assistTeacherInfoList.length &&
                                                item1.assistTeacherInfoList.map((item3, index) => {
                                                    return tempArr1.push(item3.id);
                                                });
                                            item2.assistTeacherInfoList &&
                                                item2.assistTeacherInfoList.length &&
                                                item2.assistTeacherInfoList.map((item4, index) => {
                                                    return tempArr2.push(item4.id);
                                                });
                                            if (
                                                item1.assistTeacherInfoList &&
                                                item2.assistTeacherInfoList &&
                                                JSON.stringify(tempArr1) != JSON.stringify(tempArr2)
                                            ) {
                                                changedClass.push(...tempArr);
                                                isChangeTeacher = true;
                                            }
                                        } else {
                                            changedClass.push(...tempArr);
                                            isChangeTeacher = true;
                                        }
                                    }
                                });
                            });
                        }
                    });
            });

        changedClass = Array.from(new Set(changedClass));

        changedClass = changedClass.join('、');

        if (isChangeTeacher) {
            this.setState({
                sureToRevise: true,
                classString: changedClass,
            });
        } else {
            this.submitInfo();
        }
    };

    cancelRevise = () => {
        this.setState({
            sureToRevise: false,
        });
    };

    submitInfo = () => {
        const {
            dispatch,
            courseDetail,
            semesterValue,
            semesterStartTime,
            semesterEndTime,
            finalPlanList,
        } = this.props;

        courseDetail.semesterStartTime = semesterStartTime;
        courseDetail.semesterEndTime = semesterEndTime;
        courseDetail.schoolYearId = semesterValue;
        courseDetail.groups.map((item) => {
            if (
                (item.studentGroupType == 3 && item.studentGroupList[0].name == '系统创建选修班') ||
                (item.studentGroupType == 4 && item.studentGroupList[0].name == '系统创建分层班')
            ) {
                item.studentGroupList = [];
            }
            return item;
        });
        dispatch({
            type: 'course/saveDefaultPlan',
            payload: courseDetail,
        }).then(() => {
            const { saveDefaultSuccess } = this.props;
            if (saveDefaultSuccess.status) {
                this.setState({
                    showEdit: false,
                    planningGroupValue: '',
                    sureToRevise: false,
                });
                //根据课程id查询默认计划
                setTimeout(() => {
                    this.getPlanById(courseDetail.id, courseDetail.coursePlanningId);
                }, 2000);
            }
        });
    };

    //取消课设
    saveCourseOff = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'course/addCourseGroup',
            payload: {
                callOff: true,
            },
        });
        this.setState({
            showEdit: false,
            planningGroupValue: '',
        });
    };

    //校验
    vaidatorCourseDetail = () => {
        const { courseDetail, semesterId } = this.props;
        let result = true;
        let groups = courseDetail.groups;
        if (groups && groups.length != 0) {
            for (let i = 0; i < groups.length; i++) {
                let studentGroup = groups[i].studentGroupList;
                let studentGroupType = groups[i].studentGroupType;
                let defaultList = groups[i].defaultCoursePlanningList;
                if (!studentGroupType) {
                    result = false;
                    break;
                }
                if (studentGroupType != 3 && studentGroup.length == 0) {
                    //校验班级
                    result = false;
                    break;
                }
                for (let j = 0; j < defaultList.length; j++) {
                    //添加学期id
                    defaultList[j].semesterId = semesterId;
                    //校验主教老师
                    if (
                        !defaultList[j].mainTeacherInfoList ||
                        defaultList[j].mainTeacherInfoList.length == 0
                    ) {
                        result = false;
                        break;
                    }
                    //校验其他的必填项
                    if (
                        !defaultList[j].weekLessons ||
                        !defaultList[j].unitDuration ||
                        !defaultList[j].onceLessons
                    ) {
                        result = false;
                        break;
                    }
                }
            }
        }
        return result;
    };

    //设置不可选时间
    disabledDate = (current) => {
        const { semesterValueNew } = this.props;
        let semesterStartTime = semesterValueNew && semesterValueNew.split('-')[0],
            semesterEndTime = semesterValueNew && semesterValueNew.split('-')[1];
        let disableStart = formatTime(Number(semesterStartTime)),
            disableEnd = formatTime(Number(semesterEndTime));
        return current < moment(new Date(disableStart)) || current > moment(new Date(disableEnd));
    };

    //根据课程是否选修--获得班级 ---club的扩展--will do
    getStudentGroup = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'course/getOnlyClass',
            payload: {
                ifIsOptional: true, //是否选修
                gradeId: 1, //年级gradeId
            },
        });
    };

    judgetype = (el) => {
        let list = el.studentGroupList || [];
        let result = true;
        for (let i = 0; i < list.length; i++) {
            if (list[i] && list[i]['type'] == 2) {
                result = false;
                break;
            }
        }
        return result;
    };

    renderGroupName = (el) => {
        let list = el.studentGroupList || [];
        return (
            list.length > 0 &&
            list.map((item, index) => {
                return (
                    <em className={styles.groupName} key={index}>
                        {item.name}
                    </em>
                );
            })
        );
    };

    filterTreeNode = (inputValue, treeNode) => {
        if (
            (treeNode &&
                treeNode.props &&
                treeNode.props.title &&
                treeNode.props.title.indexOf(inputValue) > -1) ||
            (treeNode &&
                treeNode.props &&
                treeNode.props.ename &&
                treeNode.props.ename.indexOf(inputValue)) > -1
        ) {
            return true;
        } else {
            return false;
        }
    };

    // 删除选中项
    // item 点击删除的班级信息
    // el这一条的信息
    // list是{}
    // value是班级名数组
    // num是’‘
    // order是index
    // type 是group
    // id是所有班级id的数组
    handleDeleteSelect(item, el, list, value, num, order, courseDetail, type, id) {
        // e.stopPropagation();
        this.setState(
            {
                showEdit: true,
            },
            () => {
                const newState = { ...this.state };
                // 隐藏tree下拉菜单
                newState[`show${type}Tree_${order}_${list.id ? list.id : ''}_${num}`] = false;
                newState[`showGroupTree_${order}_`] = false;
                const treeselectValue = value;
                let index = value.indexOf(type == 'Group' ? item : item.id);
                treeselectValue.splice(index, 1);
                // 触发不同treechange事件，渲染数据
                if (type == 'Main') {
                    this.changeMaster(num, order, courseDetail, treeselectValue);
                } else if (type == 'Help') {
                    this.changeHelpTeacher(num, order, courseDetail, treeselectValue);
                } else if (type == 'Group') {
                    this.deleteClass(order, courseDetail, item.id);
                }
                this.setState({
                    ...newState,
                    showEdit: true,
                });
            }
        );
    }

    // 点击文本显示treeSelect
    handleShowTreeSelectMain = (el, order, list, type, num) => {
        const { dispatch, courseDetail, semesterValue, schoolId } = this.props;
        if (type == 'Group') {
            dispatch({
                type: 'course/coursePlanningGroupInfo',
                payload: {
                    coursePlanningId: courseDetail.coursePlanningId, // 开课计划id
                    semesterId: semesterValue, //--学期id
                    schoolId: schoolId, //--学校id
                },
            });
        }

        const newState = { ...this.state };
        if (type == 'Main' || type == 'Help') {
            newState[`show${type}Tree_${order}_${list.id ? list.id : ''}_${num}`] = true;
        } else {
            newState[`show${type}Tree_${order}_${list.id ? list.id : ''}`] = true;
        }
        this.setState({
            ...newState,
        });
    };

    // 控制treeSelect下拉显示
    hideTreeSelectMain = (num, order, list, type, visible, info) => {
        if (!visible) {
            if (type == 'Main' || type == 'Help') {
                this.setState({
                    [`show${type}Tree_${order}_${list.id ? list.id : ''}_${num}`]: visible,
                });
            } else {
                this.setState({
                    [`show${type}Tree_${order}_${list.id ? list.id : ''}`]: visible,
                });
            }
        } else {
            this.setState({
                [`show${type}Tree_${order}_${list.id ? list.id : ''}`]: visible,
            });
        }
        return true;
    };

    formatGroupId = (item) => {
        let id = item.id || item.value || 3;
        return id + '*' + item.type;
    };

    getRoleTeacher = () => {
        if (this.state.hasChooseTeacher) return;
        const { dispatch } = this.props;
        dispatch({
            type: 'course/getByConditionTeacher',
            payload: {},
            onSuccess: () => {
                const { teacherByDeparment, teacherByRole } = this.props;
                this.setState({
                    hasChooseTeacher: true,
                });
            },
        });
    };

    handleTree = (arr) => {
        if (arr.length < 0) return;
        for (var i = 0; i < arr.length; i++) {
            arr[i]['title'] = arr[i]['label'];
            arr[i]['value'] = arr[i]['orgTreeId']
                ? 'org-' + arr[i]['orgTreeId']
                : 'user-' + arr[i]['key'];
            arr[i]['key'] = arr[i]['orgTreeId']
                ? 'org-' + arr[i]['orgTreeId']
                : 'user-' + arr[i]['key'];
            if (arr[i].children) {
                this.handleTree(arr[i].children);
            } else {
                arr[i]['disabled'] = true;
            }
        }
        return arr;
    };

    formatRoleTeacher = (arr) => {
        let teacherRoleList = [];
        arr &&
            arr.length > 0 &&
            arr.map((item) => {
                let obj = {};
                obj.title = item.name;
                obj.key = item.code;
                obj.value = item.code;
                obj.type = item.type;
                obj.children = this.formaTeacherRoleLeader(item.leader);
                teacherRoleList.push(obj);
            });
        return teacherRoleList;
    };

    formaTeacherRoleLeader = (leader) => {
        if (!leader || leader.length < 0) return [];
        let leaderList = [];
        leader.map((item) => {
            let obj = {};
            obj.title = item.name;
            obj.key = item.id;
            obj.id = item.id;
            obj.type = item.type;
            obj.ename = item.ename;
            obj.value = item.id;
            leaderList.push(obj);
        });
        return leaderList;
    };

    changeRoleTeacher = (num, order, courseDetail, value) => {
        let newMainTeacherInfoList = this.state.mainSelectValue;
        // newMainTeacherInfoList.push(value)
    };

    renderTableRow(dataSource, courseDetail) {
        const {
            newTeacherList,
            studentGroupList,
            semesterValueNew,
            semesterStartTime,
            semesterEndTime,
            effictiveKey,
            planningGroupForAdd,
            studentGroupList1,
            teacherByDeparment,
            teacherByRole,
            getCoursePlanning,
            newTeacherLists,
        } = this.props;
        const {
            showEdit,
            tsOpen,
            necessaryTeacherVisible,
            assistTeacherVisible,
            selectTeacherIndex,
            selectGroupOrder,
        } = this.state;
        let courseActive = showEdit ? styles.courseClass + ' ' + styles.active : styles.courseClass;
        let treePropsStyle = {
            treeNodeFilterProp: 'title',
            dropdownStyle: {
                maxHeight: 260,
                overflow: 'auto',
            },
        };

        const treeProps = {
            treeNodeFilterProp: 'title',
            treeCheckable: true,
            treeNodeFilterProp: 'title',
        };
        const copyTreeProps = {
            treeDefaultExpandedKeys: ['1行政班'],
            treeNodeFilterProp: 'title',
            treeCheckable: true,
            treeNodeFilterProp: 'title',
        };
        const roleTeacherProps = {
            treeData: this.formatRoleTeacher(teacherByRole),
            treeNodeFilterProp: 'title',
            treeCheckable: true,
        };
        const deparmentTeacherProps = {
            treeData: this.handleTree(teacherByDeparment),
            // value: this.state.value,
            // onChange: this.onChange,
            treeCheckable: true,
            showCheckedStrategy: SHOW_PARENT,
            treeNodeFilterProp: 'title',
        };
        let changePicker = showEdit ? styles.changePickerAct : styles.changePicker;
        return dataSource.map((el, order) => {
            return (
                <div className={courseActive} key={order}>
                    <Tooltip
                        title={trans('course.plan.tooltipText', '应用到其他教学班')}
                        placement="leftTop"
                    >
                        <i
                            className={icon.iconfont + ' ' + styles.copyBtn}
                            onClick={this.applyOtherClass.bind(this, el, courseDetail.id)}
                        >
                            &#xe625;
                        </i>
                        <div className={styles.copySelect} onClick={this.selectAddGroup}>
                            <TreeSelect
                                treeData={this.formatStudentGroup(planningGroupForAdd, 3)}
                                onChange={this.changeApplyClass.bind(this, el, courseDetail.id)}
                                {...copyTreeProps}
                            ></TreeSelect>
                        </div>
                    </Tooltip>
                    <div className={styles.selectClass}>
                        <div>
                            {this.judgetype(el) ? (
                                <div className={styles.classContent}>
                                    {this.state[`showGroupTree_${order}_`] ? (
                                        <TreeSelect
                                            // 选课时自动创建置灰
                                            treeData={this.formatStudentGroup(
                                                planningGroupForAdd,
                                                3
                                            )}
                                            // defaultValue={this.formatGroupIdLeft(el)}
                                            value={this.formatGroupIdLeft(el)}
                                            onChange={this.changeClass.bind(
                                                this,
                                                order,
                                                courseDetail
                                            )}
                                            placeholder={trans('course.plan.orClass', '选择班级')}
                                            treeCheckable={true}
                                            style={{
                                                width: 160,
                                                maxHeight: '180px',
                                                overflow: 'auto',
                                            }}
                                            className={styles.classTreeSelectStyle}
                                            {...treePropsStyle}
                                            open={this.state[`showGroupTree_${order}_`]}
                                            onDropdownVisibleChange={this.hideTreeSelectMain.bind(
                                                this,
                                                el,
                                                order,
                                                {},
                                                'Group'
                                            )}
                                        ></TreeSelect>
                                    ) : (
                                        <span
                                            onClick={this.handleShowTreeSelectMain.bind(
                                                this,
                                                el,
                                                order,
                                                {},
                                                'Group'
                                            )}
                                            className={styles.groupText}
                                        >
                                            {el.studentGroupList &&
                                            el.studentGroupList.length > 0 ? (
                                                el.studentGroupList.map((item, index) => {
                                                    return (
                                                        <span
                                                            className={styles.selectGroup}
                                                            key={index}
                                                        >
                                                            <span className={styles.name}>
                                                                {item.title || item.name}
                                                            </span>
                                                            <span
                                                                className={styles.close}
                                                                onClick={this.handleDeleteSelect.bind(
                                                                    this,
                                                                    item,
                                                                    el,
                                                                    {},
                                                                    this.formatGroup(el),
                                                                    '',
                                                                    order,
                                                                    courseDetail,
                                                                    'Group',
                                                                    this.formatGroupIds(el)
                                                                )}
                                                            >
                                                                <Icon type="close" />
                                                            </span>
                                                        </span>
                                                    );
                                                })
                                            ) : (
                                                <span className={styles.groupPlaceholder}>
                                                    选择班级
                                                </span>
                                            )}
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <span>{this.renderGroupName(el)}</span>
                            )}
                        </div>
                    </div>
                    <div className={styles.setPlanTable}>
                        {el.defaultCoursePlanningList &&
                            el.defaultCoursePlanningList.length > 0 &&
                            el.defaultCoursePlanningList.map((list, num) => {
                                let paddingStyle =
                                    list.mainTeacherInfoList && list.mainTeacherInfoList.length > 0
                                        ? styles.paddingStyle
                                        : '';
                                let listHeight =
                                    (1 / el.defaultCoursePlanningList.length) * 100 + '%';
                                let keyNum =
                                    String(list.weekLessons) +
                                    String(list.onceLessons) +
                                    String(list.unitDuration);
                                return (
                                    <Row
                                        className={styles.rowStyle}
                                        style={{ height: listHeight }}
                                        key={num}
                                    >
                                        <Col span={4}>
                                            {this.state[
                                                `showMainTree_${order}_${list.id}_${num}`
                                            ] ? (
                                                <TreeSelect
                                                    treeData={newTeacherList}
                                                    value={this.formatTeacher(
                                                        list.mainTeacherInfoList
                                                    )}
                                                    placeholder={trans(
                                                        'course.plan.dtTeacher',
                                                        '选择主教老师'
                                                    )}
                                                    style={{ width: 120 }}
                                                    onChange={this.changeMaster.bind(
                                                        this,
                                                        num,
                                                        order,
                                                        courseDetail
                                                    )}
                                                    treeCheckable={true}
                                                    className={styles.treeSelectStyle}
                                                    {...treePropsStyle}
                                                    key={keyNum}
                                                    filterTreeNode={this.filterTreeNode}
                                                    // treeNodeFilterProp='searchName'
                                                    open={
                                                        this.state[
                                                            `showMainTree_${order}_${list.id}_${num}`
                                                        ]
                                                    }
                                                    onDropdownVisibleChange={this.hideTreeSelectMain.bind(
                                                        this,
                                                        num,
                                                        order,
                                                        list,
                                                        'Main'
                                                    )}
                                                />
                                            ) : (
                                                <span>
                                                    <PlusOutlined
                                                        onClick={() =>
                                                            this.clickPlus(
                                                                num,
                                                                order,
                                                                'necessaryTeacher'
                                                            )
                                                        }
                                                    />
                                                    <span
                                                        onClick={this.handleShowTreeSelectMain.bind(
                                                            this,
                                                            el,
                                                            order,
                                                            list,
                                                            'Main',
                                                            num
                                                        )}
                                                        className={
                                                            styles.teacherText + '  ' + paddingStyle
                                                        }
                                                    >
                                                        {list.mainTeacherInfoList &&
                                                        list.mainTeacherInfoList.length > 0 ? (
                                                            list.mainTeacherInfoList.map(
                                                                (item, index) => {
                                                                    return (
                                                                        <span
                                                                            className={
                                                                                styles.selectTeacher
                                                                            }
                                                                            key={index}
                                                                        >
                                                                            <span
                                                                                className={
                                                                                    styles.name
                                                                                }
                                                                            >
                                                                                {item.name}
                                                                            </span>
                                                                            <span
                                                                                className={
                                                                                    styles.close
                                                                                }
                                                                                onClick={this.handleDeleteSelect.bind(
                                                                                    this,
                                                                                    item,
                                                                                    el,
                                                                                    list,
                                                                                    this.formatTeacher(
                                                                                        list.mainTeacherInfoList
                                                                                    ),
                                                                                    num,
                                                                                    order,
                                                                                    courseDetail,
                                                                                    'Main'
                                                                                )}
                                                                            >
                                                                                <Icon type="close" />
                                                                            </span>
                                                                        </span>
                                                                    );
                                                                }
                                                            )
                                                        ) : (
                                                            <span
                                                                className={
                                                                    styles.teacherPlaceholder
                                                                }
                                                            >
                                                                {trans(
                                                                    'course.plan.dtTeacher',
                                                                    '选择主教老师'
                                                                )}
                                                            </span>
                                                        )}
                                                    </span>
                                                    {necessaryTeacherVisible &&
                                                        selectTeacherIndex === num &&
                                                        selectGroupOrder === order && (
                                                            <SearchTeacher
                                                                modalVisible={
                                                                    necessaryTeacherVisible
                                                                }
                                                                cancel={
                                                                    this
                                                                        .changeNecessaryTeacherVisible
                                                                }
                                                                language={'zh_CN'}
                                                                confirm={(ids) =>
                                                                    this.searchTeacherConfirm(
                                                                        num,
                                                                        order,
                                                                        courseDetail,
                                                                        ids,
                                                                        'necessaryTeacher'
                                                                    )
                                                                }
                                                                selectType="1" // 1:全体人员 2：人员和组织id {nodeList：组织id数组，idList： 人员id数组}
                                                                selectedList={this.selectTeacherValue(
                                                                    list.mainTeacherInfoList
                                                                )}
                                                            />
                                                        )}
                                                </span>
                                            )}
                                        </Col>
                                        <Col span={4}>
                                            {this.state[
                                                `showHelpTree_${order}_${list.id}_${num}`
                                            ] ? (
                                                <TreeSelect
                                                    treeData={newTeacherList}
                                                    value={this.formatTeacher(
                                                        list.assistTeacherInfoList
                                                    )}
                                                    placeholder={trans(
                                                        'course.plan.togetherTeacher',
                                                        '选择协同老师'
                                                    )}
                                                    style={{ width: 120 }}
                                                    // treeNodeFilterProp='searchName'
                                                    onChange={this.changeHelpTeacher.bind(
                                                        this,
                                                        num,
                                                        order,
                                                        courseDetail
                                                    )}
                                                    treeCheckable={true}
                                                    className={styles.treeSelectStyle}
                                                    {...treePropsStyle}
                                                    filterTreeNode={this.filterTreeNode}
                                                    open={
                                                        this.state[
                                                            `showHelpTree_${order}_${list.id}_${num}`
                                                        ]
                                                    }
                                                    onDropdownVisibleChange={this.hideTreeSelectMain.bind(
                                                        this,
                                                        num,
                                                        order,
                                                        list,
                                                        'Help'
                                                    )}
                                                />
                                            ) : (
                                                <span>
                                                    <PlusOutlined
                                                        onClick={() =>
                                                            this.clickPlus(
                                                                num,
                                                                order,
                                                                'assistantTeacher'
                                                            )
                                                        }
                                                    />
                                                    <span
                                                        onClick={this.handleShowTreeSelectMain.bind(
                                                            this,
                                                            el,
                                                            order,
                                                            list,
                                                            'Help',
                                                            num
                                                        )}
                                                        className={styles.teacherText}
                                                    >
                                                        {list.assistTeacherInfoList &&
                                                        list.assistTeacherInfoList.length > 0 ? (
                                                            list.assistTeacherInfoList.map(
                                                                (item, index) => {
                                                                    return (
                                                                        <span
                                                                            className={
                                                                                styles.selectTeacher
                                                                            }
                                                                            key={index}
                                                                        >
                                                                            <span
                                                                                className={
                                                                                    styles.name
                                                                                }
                                                                            >
                                                                                {item.name}
                                                                            </span>
                                                                            <span
                                                                                className={
                                                                                    styles.close
                                                                                }
                                                                                onClick={this.handleDeleteSelect.bind(
                                                                                    this,
                                                                                    item,
                                                                                    el,
                                                                                    list,
                                                                                    this.formatTeacher(
                                                                                        list.assistTeacherInfoList
                                                                                    ),
                                                                                    num,
                                                                                    order,
                                                                                    courseDetail,
                                                                                    'Help'
                                                                                )}
                                                                            >
                                                                                <Icon type="close" />
                                                                            </span>
                                                                        </span>
                                                                    );
                                                                }
                                                            )
                                                        ) : (
                                                            <span
                                                                className={
                                                                    styles.teacherPlaceholder
                                                                }
                                                            >
                                                                {trans(
                                                                    'course.plan.togetherTeacher',
                                                                    '选择协同老师'
                                                                )}
                                                            </span>
                                                        )}
                                                    </span>
                                                    {assistTeacherVisible &&
                                                        selectTeacherIndex === num &&
                                                        selectGroupOrder === order && (
                                                            <SearchTeacher
                                                                modalVisible={assistTeacherVisible}
                                                                cancel={
                                                                    this.changeAssistTeacherVisible
                                                                }
                                                                language={'zh_CN'}
                                                                confirm={(ids) =>
                                                                    this.searchTeacherConfirm(
                                                                        num,
                                                                        order,
                                                                        courseDetail,
                                                                        ids,
                                                                        'assistantTeacher'
                                                                    )
                                                                }
                                                                selectType="1" // 1:全体人员 2：人员和组织id {nodeList：组织id数组，idList： 人员id数组}
                                                                selectedList={this.selectTeacherValue(
                                                                    list.assistTeacherInfoList
                                                                )}
                                                            />
                                                        )}
                                                </span>
                                            )}
                                        </Col>
                                        <Col span={9}>
                                            <div className={styles.singleLine}>
                                                <Select
                                                    value={list.frequency}
                                                    className={styles.eachWeek}
                                                    onChange={this.changeWeek.bind(
                                                        this,
                                                        num,
                                                        order,
                                                        courseDetail
                                                    )}
                                                >
                                                    <Option value={0}>
                                                        {trans('global.weekly', '每周')}
                                                    </Option>
                                                    <Option value={1}>
                                                        {trans('global.weekly.one', '单周')}
                                                    </Option>
                                                    <Option value={2}>
                                                        {trans('global.weekly.two', '双周')}
                                                    </Option>
                                                </Select>
                                            </div>

                                            <div
                                                className={styles.singleLine}
                                                style={{ display: 'flex' }}
                                            >
                                                <InputNumber
                                                    min={1}
                                                    value={list.weekLessons}
                                                    step={1}
                                                    style={{ width: 50, marginTop: 9 }}
                                                    onChange={this.changeWeekLessons.bind(
                                                        this,
                                                        num,
                                                        order,
                                                        courseDetail
                                                    )}
                                                />
                                                <span className={styles.numberText}>
                                                    {trans('course.plan.next', '次')}
                                                </span>
                                            </div>

                                            <div
                                                className={styles.singleLine}
                                                style={{ display: 'flex' }}
                                            >
                                                {/* <span className={styles.numberTextleft} style={{width:'2em'}}>{trans("global.every", "每次")}</span> */}
                                                <Input
                                                    // value={'单堂'}
                                                    value={
                                                        list.onceLessons == '1'
                                                            ? trans('global.Single', '单堂')
                                                            : trans('global.Double', '连堂')
                                                    }
                                                    // value={list.onceLessons}
                                                    disabled={true}
                                                    style={{
                                                        width: '3.5em',
                                                        marginTop: 4,
                                                        marginLeft: 9,
                                                        paddingLeft: 7,
                                                        borderRadius: 4,
                                                    }}
                                                ></Input>
                                                {/* <InputNumber
                                            min={1}
                                            // value={list.onceLessons}
                                            value={'单堂'}
                                            step={1}
                                            disabled = {true}
                                            style={{ width: '3em',marginTop:9,padding:0 }}
                                            onChange={this.changeOnceLessons.bind(this, num, order, courseDetail)}
                                        /> */}
                                                {/* <span className={styles.numberText}>{trans("global.section", "节")}</span> */}
                                            </div>

                                            <div
                                                className={styles.singleLine}
                                                style={{ display: 'flex' }}
                                            >
                                                <span
                                                    className={styles.numberTextleft}
                                                    style={{ width: '2em' }}
                                                >
                                                    {trans('global.each.section', '每节')}
                                                </span>
                                                <InputNumber
                                                    min={1}
                                                    value={list.unitDuration}
                                                    step={5}
                                                    disabled={true}
                                                    style={{ width: 40, marginTop: 9 }}
                                                    onChange={this.changeUnitDuration.bind(
                                                        this,
                                                        num,
                                                        order,
                                                        courseDetail
                                                    )}
                                                />
                                                <span className={styles.numberText}>min</span>
                                            </div>
                                        </Col>
                                        <Col span={5}>
                                            <div className={styles.singleLine}>
                                                <RangePicker
                                                    format="YYYY/MM/DD"
                                                    placeholder={['', '']}
                                                    disabledDate={this.disabledDate}
                                                    className={changePicker}
                                                    onChange={this.changeTime.bind(
                                                        this,
                                                        num,
                                                        order,
                                                        courseDetail
                                                    )}
                                                    style={{
                                                        width: 200,
                                                        border: 'none',
                                                        position: 'absolute',
                                                    }}
                                                    allowClear={false}
                                                    // defaultValue={[moment(this.formatDate(list.effectiveTime), dateFormat), moment(this.formatDate(list.failureTime), dateFormat)]}
                                                />
                                                {semesterStartTime == list.effectiveTime &&
                                                semesterEndTime == list.failureTime ? (
                                                    <span>
                                                        {trans('global.semester', '本学期')}
                                                    </span>
                                                ) : (
                                                    <span>
                                                        {this.formatDate(list.effectiveTime)}
                                                        <em className={styles.dividerLine}>-</em>
                                                        <br />
                                                        {this.formatDate(list.failureTime)}
                                                    </span>
                                                )}
                                            </div>
                                        </Col>
                                        <Col span={2}>
                                            <div className={styles.singleLine}>
                                                <i
                                                    className={icon.iconfont + ' ' + styles.addRow}
                                                    onClick={this.addRow.bind(
                                                        this,
                                                        list,
                                                        courseDetail.id,
                                                        order
                                                    )}
                                                >
                                                    &#xe759;
                                                </i>
                                                <i
                                                    className={
                                                        icon.iconfont + ' ' + styles.deleteRow
                                                    }
                                                    onClick={this.deleteRow.bind(
                                                        this,
                                                        list,
                                                        courseDetail.id,
                                                        num,
                                                        order
                                                    )}
                                                >
                                                    &#xe739;
                                                </i>
                                            </div>
                                        </Col>
                                    </Row>
                                );
                            })}
                    </div>
                </div>
            );
        });
    }

    //应用到其他班
    applyOtherClass(detail, fatherId) {
        this.setState({
            applyModalVisible: true,
            applyDetail: detail,
            applyFatherId: fatherId,
        });
    }

    // 点击复制icon
    copySelectHandle(detail, fatherId) {
        this.props.getCopyCard(detail);
    }
    //编辑信息窗口
    applyOtherClassbj = (value) => {
        if (this.state.showEdit) {
            message.info('未保存操作不允许编辑');
            return;
        }
        this.setState(
            {
                historyModal: true,
            },
            () => {
                this.getTeacher();
                this.getCoursePlanning(value);
            }
        );
    };
    //编辑信息编辑
    getCoursePlanning = (value) => {
        const { dispatch, courseDetail } = this.props;
        dispatch({
            type: 'course/getCoursePlanning',
            payload: {
                id: value.coursePlanningId,
            },
        }).then(() => {
            const { getCoursePlanning } = this.props;
            let switchOnchange =
                getCoursePlanning.classFee || getCoursePlanning.materialCost ? true : false;

            this.setState({
                switchOnchange: switchOnchange,
                teacherValue: getCoursePlanning.teacherUserIds, //老师ID
                totalLesson: getCoursePlanning.totalLesson, //总课时
                weekLesson: getCoursePlanning.weekLesson, //周课时
                maxStudent: getCoursePlanning.maxStudent, //最多人
                minStudent: getCoursePlanning.minStudent, //最少人
                classFee: getCoursePlanning.classFee, //课时费
                materialCost: getCoursePlanning.materialCost, //材料费
                updateCoursePlanning: value.coursePlanningId,
            });
            // getCoursePlanning && getCoursePlanning.weeklyClassInfoList && getCoursePlanning.weeklyClassInfoList.length>0 &&
            // this.setState({
            //     switchOnchange: switchOnchange,
            //     teacherValue: getCoursePlanning.teacherUserIds,//老师ID
            //     totalLesson: getCoursePlanning.totalLesson,//总课时
            //     weekLesson: getCoursePlanning.weekLesson,//周课时
            //     maxStudent: getCoursePlanning.maxStudent,//最多人
            //     minStudent: getCoursePlanning.minStudent,//最少人
            //     classFee: getCoursePlanning.classFee,//课时费
            //     materialCost: getCoursePlanning.materialCost,//材料费
            //     updateCoursePlanning: value.coursePlanningId,
            // })

            getCoursePlanning.weeklyClassInfoList.length == 0 ? this.addHandle() : '';
            // this.addHandle()
        });
    };
    //取消应用
    hideModal = () => {
        this.setState({
            applyModalVisible: false,
            applyClassArr: [],
        });
    };

    //选择应用的班级
    changeApplyClass(detail, fatherId, value) {
        this.setState(
            {
                applyClassArr: value,
                applyModalVisible: true,
                applyDetail: detail,
                applyFatherId: fatherId,
            },
            () => {
                this.confirmApply();
            }
        );
    }

    //确认应用到其他班
    confirmApply = () => {
        const { dispatch } = this.props;
        const { applyDetail, applyFatherId, applyClassArr } = this.state;
        //确认前的校验
        if (applyClassArr.length == 0) {
            message.info(trans('course.plan.select.application.class', '请选择应用的教学班！'));
            return false;
        }
        //深拷贝
        let courseDetail = JSON.parse(JSON.stringify(applyDetail)),
            defaultCoursePlanningList = courseDetail.defaultCoursePlanningList;
        defaultCoursePlanningList.map((item, index) => {
            item.id = '';
        });
        let applyGroupDetail = [];
        applyClassArr.map((item, index) => {
            let groupObj = {
                studentGroupList: [this.getSelectClassDetail(item)],
                defaultCoursePlanningList: defaultCoursePlanningList,
                studentGroupType: 1, //will do
            };
            applyGroupDetail.push(groupObj);
        });
        dispatch({
            type: 'course/applyOtherClass',
            payload: {
                fatherId: applyFatherId,
                copyGroupDetail: applyGroupDetail,
            },
        }).then(() => {
            this.setState({
                applyModalVisible: false,
                showEdit: true,
                applyClassArr: [],
            });
        });
    };

    //获取选中班级的详细信息
    getSelectClassDetail = (selectedId) => {
        const { applyGroupList, planningGroupForAdd } = this.props;
        let applyList = this.formatStudentGroup(planningGroupForAdd);
        let stundentGroup = {};
        for (let i = 0; i < applyList.length; i++) {
            if (applyList[i] && applyList[i]['children']) {
                let children = applyList[i]['children'] || [];
                for (let j = 0; j < children.length; j++) {
                    if (children[j] && children[j]['id'] && children[j]['id'] == selectedId) {
                        stundentGroup = {
                            id: children[j].id,
                            name: children[j].title,
                            ename: children[j].ename,
                            studySection: children[j].studySection,
                            type: children[j].type,
                        };
                        break;
                    }
                }
            }
        }
        return stundentGroup;
    };

    //根据某课程查询信息
    getPlanById(id, coursePlanningId) {
        const {
            dispatch,
            semesterValueNew,
            studentGroupValue,
            gradeId,
            semesterId,
            semesterStartTime,
            semesterEndTime,
        } = this.props;
        dispatch({
            type: 'course/getPlanById',
            payload: {
                startTime: semesterStartTime,
                endTime: semesterEndTime,
                courseIds: [id],
                coursePlanningId: coursePlanningId,
                classIds: studentGroupValue, //班级
                teachingOrgId: gradeId, //年级
                semesterId: semesterId, //学期id
            },
            onSuccess: () => {
                const { coursePlanList } = this.props;
                this.setState({
                    showEdit: false,
                });
                this.props.getCoursePlanningGread();
            },
        });
    }
    //设置开课信息
    setUpCourse = (value) => {
        if (this.state.showEdit) return;
        this.setState(
            {
                historyModal: true,
                updateCoursePlanning: value.coursePlanningId,
            },
            () => {
                this.getTeacher();
                this.getCoursePlanning(value);
            }
        );
    };
    //设置开课信息 关
    hideHistoryModal = () => {
        this.setState({
            historyModal: false,
        });
    };

    //获取教师列表
    getTeacher() {
        const { dispatch, currentUser, schoolId } = this.props;
        dispatch({
            type: 'course/newGetTeacherList',
            payload: {
                eduGroupCompanyId: currentUser.eduGroupcompanyId,
                schoolId,
            },
        });
    }
    //处理教师数据
    formatTeacherData = (teacherList) => {
        if (!teacherList || teacherList.length < 0) return;
        let teacherData = [];
        teacherList.map((item, index) => {
            let obj = {};
            obj.title = item.name + '-' + item.englishName;
            obj.key = item.teacherId;
            obj.value = item.teacherId;
            obj.ename = item.englishName;
            obj.searchName = item.name + '_' + item.englishName;
            teacherData.push(obj);
        });
        return teacherData;
    };

    formatStudentGroup = (groupList, type, detail) => {
        if (!groupList || groupList.length < 0) return;
        let studentGroup = [];
        if (type == 'applyClassGroup') {
            groupList.map((item, index) => {
                let obj = {};
                obj.title = item.name;
                obj.key = item.id;
                obj.value = item.id;
                obj.disabled = true;
                obj.children = this.formatClassDataApply(item.studentGroupList, 'applyClass');
                studentGroup.push(obj);
            });
        } else {
            groupList.map((item, index) => {
                if (type == 3 && (item.type == 3 || item.type == 4)) return;
                let obj = {};
                obj.type = item.type;
                obj.title = item.name;
                obj.key = item.type + item.name;
                obj.value = item.type + item.name;
                obj.disabled = type == 3 && item.type == 3 && true;
                obj.children = this.formatClassData(item.studentGroupList, item.type, type);
                studentGroup.push(obj);
            });
        }
        return studentGroup;
    };
    //处理子级班
    formatClassDataApply = (classList, val) => {
        if (!classList || classList.length < 0) return [];
        let classGroup = [];
        classList.map((item, index) => {
            let obj = {};
            obj.title = item.name;
            obj.key = item.id;
            obj.id = item.id;
            obj.type = item.type;
            obj.ename = item.ename;
            obj.value = val == 'groupList' ? item.id + '*' + item.type : item.id;
            classGroup.push(obj);
        });
        return classGroup;
    };
    formatClassData = (studentGroupList, type, dataType) => {
        if (!studentGroupList || studentGroupList.length < 0) return;
        let classGroup = [];
        studentGroupList.map((item, index) => {
            let obj = {};
            obj.title = item.name;
            obj.key = item.id;
            obj.id = item.id;
            obj.type = item.type;
            obj.ename = item.ename;
            obj.value = item.id;
            obj.disabled = dataType === 3 ? '' : item.ifDisplay;
            classGroup.push(obj);
        });
        return classGroup;
    };

    //选择老师
    changTeacher = (value) => {
        this.setState({
            teacherValue: value,
        });
    };
    getGradeAllId = (list) => {
        const arr = [];
        list &&
            list.length > 0 &&
            list.map((item) => {
                item.studentGroupList &&
                    item.studentGroupList.length > 0 &&
                    item.studentGroupList.map((el) => {
                        arr.push(el.id);
                    });
            });
        return arr;
    };
    getGradeAllAdministrativeId = (list) => {
        const arr = [];
        list &&
            list.length > 0 &&
            list.map((item) => {
                if (item.type == 1) {
                    item.studentGroupList &&
                        item.studentGroupList.length > 0 &&
                        item.studentGroupList.map((el) => {
                            arr.push(el.id);
                        });
                }
            });
        return arr;
    };
    changeplanningGroup(detail, value, name, info) {
        this.setState({
            seleectGroupList: value,
        });
        if (info.triggerNode.props.checked) {
            if (info.triggerNode.props.children.length > 1) {
                info.triggerNode.props.children.map((data, index) => {
                    if (data.props.disabled) return;
                    let id = data.props.id;
                    this.props.dispatch({
                        type: 'course/deleteSelfPlanning',
                        payload: {
                            fatherId: detail.id,
                            courseId: id,
                        },
                    });
                });
            } else {
                let deleteType =
                    info.triggerNode.props.title == '系统创建选修班' ||
                    info.triggerNode.props.title == '系统创建分层班'
                        ? 'system'
                        : '';
                this.props.dispatch({
                    type: 'course/deleteSelfPlanning',
                    payload: {
                        fatherId: detail.id,
                        courseId: info.triggerNode.props.id,
                        deleteType,
                    },
                });
            }
        } else {
            let id =
                info.triggerNode.props.type == 3
                    ? '统创建选修班'
                    : info.triggerNode.props.type == 4
                    ? '系统创建分层班'
                    : info.triggerNode.props.id;
            info.triggerNode.props.children.length > 1
                ? info.triggerNode.props.children.map((data, index) => {
                      if (data.props.disabled) return;
                      let value = data.props.id;
                      let title = data.props.title;
                      let type = data.props.type;
                      this.addGroup(detail, value, title, type);
                  })
                : this.addGroup(
                      detail,
                      id,
                      info.triggerNode.props.title,
                      info.triggerNode.props.type
                  );
        }

        this.setState({
            planningGroupValue: value,
            hasChoose: false,
        });
    }
    //收费设置开关
    switchOnchange = (value) => {
        this.setState(
            {
                switchOnchange: value,
            },
            () => {
                this.setState({
                    classFee: '',
                    materialCost: '',
                });
            }
        );
    };
    //modal计划总课时
    totalLesson = (value) => {
        this.setState({
            totalLesson: value,
        });
    };
    //周课时
    weekLesson = (value) => {
        this.setState({
            weekLesson: value,
        });
    };
    saveWeekLesson(date, index, value) {
        let newWeekLessons = date.innerId == '' ? value : value ? value : date.weekLessons;
        this.setState({
            newWeekLessons,
        });
        let payloadObj = {
            editItem: 'weekLessons',
            newWeekLessons,
            rowIndex: index,
        };
        this.saveUserChangeInfo(payloadObj);
    }
    saveUnitDuration(date, index, value) {
        let newUnitDuration = Number(value);
        this.setState({
            newUnitDuration,
        });
        let payloadObj = {
            editItem: 'unitDuration',
            newUnitDuration,
            rowIndex: index,
        };
        this.saveUserChangeInfo(payloadObj);
    }
    saveOnceLessons(date, index, value) {
        let newOnceLessons = Number(value);
        this.setState({
            newOnceLessons,
        });
        let payloadObj = {
            editItem: 'onceLessons',
            newOnceLessons,
            rowIndex: index,
        };
        this.saveUserChangeInfo(payloadObj);
    }
    saveUserChangeInfo = (detail) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'course/saveUserChange',
            payload: detail,
        });
    };

    //最少人
    minStudent = (value) => {
        this.setState({
            minStudent: value,
        });
    };

    //最多人
    maxStudent = (value) => {
        this.setState({
            maxStudent: value,
        });
    };
    //课时费
    classFee = (value) => {
        this.setState({
            classFee: value,
        });
    };
    //材料费
    materialCost = (value) => {
        this.setState({
            materialCost: value,
        });
    };
    //设置开课信息保存
    confirmImport = () => {
        const { dispatch, courseDetail, semesterValue, schoolId, getCoursePlanning } = this.props;
        const {
            teacherValue,
            totalLesson,
            weekLesson,
            maxStudent,
            minStudent,
            classFee,
            materialCost,
            updateCoursePlanning,
        } = this.state;
        let arr = [];
        getCoursePlanning &&
            getCoursePlanning.weeklyClassInfoList &&
            getCoursePlanning.weeklyClassInfoList.length > 0 &&
            getCoursePlanning.weeklyClassInfoList.map((item) => {
                let str =
                    item.onceLessons.toString() +
                    item.unitDuration.toString() +
                    item.weekLessons.toString();
                arr.push(str);
            });
        var s = arr.join(',') + ',';
        for (var i = 0; i < arr.length; i++) {
            if (s.replace(arr[i] + ',', '').indexOf(arr[i] + ',') > -1) {
                message.warning('不允许设置两个相同的计划');
                return;
            }
        }
        if (parseInt(minStudent) > parseInt(maxStudent)) {
            message.info(trans('tc.base.minimum.lessthan.maximum', '最小人数不得大于最大人数'));
            return false;
        }
        dispatch({
            type: 'course/updatCoursePlanning',
            payload: {
                semesterId: semesterValue,
                schoolId,
                teacherUserIds: teacherValue,
                totalLesson: totalLesson == null ? '' : totalLesson,
                weekLesson: getCoursePlanning.weekLesson,
                maxStudent,
                minStudent,
                classFee: classFee,
                materialCost: materialCost,
                id: updateCoursePlanning,
                // schoolYearId: semesterValue
                weeklyClassInfoList: getCoursePlanning.weeklyClassInfoList,
            },
        }).then(() => {
            this.props.getCoursePlan();
            this.setState({
                historyModal: false,
                coursePlanningState: getCoursePlanning,
                hasSave: true,
            });
        });
    };
    //移除课程弹窗
    deleteke = () => {
        if (this.state.showEdit) {
            message.info('未保存操作不允许删除');
            return;
        }
        this.setState({
            modalVisible: true,
        });
    };
    deletekeTwocel = () => {
        this.setState({
            modalVisible: false,
        });
    };

    //移除课程
    deletekeTwoOk = (value) => {
        const { dispatch, getCoursePlan, semesterValue } = this.props;
        dispatch({
            type: 'course/deleteCoursePlanning',
            payload: {
                id: value.coursePlanningId,
                schoolYearId: semesterValue,
            },
        }).then(() => {
            getCoursePlan();
            this.props.getCoursePlanSubjectList();
            this.props.clearFilter();
            this.setState({
                modalVisible: false,
            });
        });
    };

    // 添加一行
    addHandle = () => {
        const { dispatch, getCoursePlanning } = this.props;
        let copyResult = {};
        // if(getCoursePlanning && getCoursePlanning.weeklyClassInfoList &&  getCoursePlanning.weeklyClassInfoList.length == 0 ) {
        copyResult.innerId = '';
        copyResult.onceLessons = 1;
        copyResult.unitDuration = 40;
        copyResult.weekLessons = 1;
        // }else{
        //     copyResult.innerId = '';
        //     copyResult.onceLessons = '';
        //     copyResult.unitDuration = '';
        //     copyResult.weekLessons = '';
        // }

        dispatch({
            type: 'course/addCoursePlanning',
            payload: {
                rowDetail: copyResult,
            },
        });
    };

    deleteHandle(date, index) {
        const { dispatch, getCoursePlanning } = this.props;
        if (
            getCoursePlanning &&
            getCoursePlanning.weeklyClassInfoList &&
            getCoursePlanning.weeklyClassInfoList.length === 1
        ) {
            message.warning('至少保留一条计划周课节');
            return;
        }
        dispatch({
            type: 'course/deleteCoursePlanningRow',
            payload: {
                rowIndex: index,
            },
        });
    }

    toSet = () => {
        window.open('#/student/index', '_blank');
        Modal.destroyAll();
    };

    changelastCourse = (value) => {
        this.setState({
            lastCourseId: value,
        });
    };

    selectLastTermCourse(id, value) {
        let selectCourseId = JSON.parse(JSON.stringify(this.state.selectCourseId));
        selectCourseId[`${id}`] = value;
        this.setState({
            selectCourseId,
        });
    }

    importFromHistory = () => {
        const { dispatch, semesterValue, schoolId, courseDetail } = this.props;
        const { lastCourseId } = this.state;
        dispatch({
            type: 'course/getImportHistorySemester',
            payload: {
                semesterId: semesterValue,
                schoolId,
                id: courseDetail.coursePlanningId,
                gradeIdList: courseDetail.gradeIdList,
            },
            onSuccess: () => {
                const { importHistorySemesterList } = this.props;
                if (!importHistorySemesterList.ifGroupSetup) {
                    return (
                        <div className={styles.classNotSet}>
                            {Modal.confirm({
                                title: <span className={styles.import}>导入上学期配置</span>,
                                content: (
                                    <span className={styles.text}>
                                        <i className={icon.iconfont} style={{ color: 'red' }}>
                                            &#xe762;
                                        </i>
                                        本学期的行政班还未设置，不能导入课程配置
                                    </span>
                                ),
                                okText: '前往设置',
                                cancelText: '取消',
                                onOk: this.toSet,
                                icon: null,
                            })}
                        </div>
                    );
                }
                if (importHistorySemesterList.ifStartingGrade) {
                    Modal.confirm({
                        title: <span className={styles.import}>导入上学期配置</span>,
                        content: (
                            <span className={styles.text}>
                                <i className={icon.iconfont} style={{ color: 'red' }}>
                                    &#xe762;
                                </i>
                                起始年级不存在上学期课程，无法导入
                            </span>
                        ),
                        okText: '好的',
                        // onOk : this.toSet,
                        icon: null,
                    });
                }
                if (
                    !importHistorySemesterList.ifStartingGrade &&
                    importHistorySemesterList.ifGroupSetup
                ) {
                    this.setState({
                        fromHistoryModal: true,
                    });
                }
                const plainOption = [];
                const plainOptionid = [];
                importHistorySemesterList &&
                    importHistorySemesterList.historyImportCourseOutputModelList &&
                    importHistorySemesterList.historyImportCourseOutputModelList.length > 0 &&
                    importHistorySemesterList.historyImportCourseOutputModelList.map(
                        (item, index) => {
                            plainOptionid.push(item.id);
                            plainOption.push({
                                value: item.coursePlanningId,
                                label: (
                                    <span>
                                        {item.lastSemesterCourseList.length == 1 ? (
                                            <span className={styles.lastSemester}>
                                                {item.lastSemesterCourseList[0].name}&nbsp;
                                                {item.lastSemesterCourseList[0].ename}
                                            </span>
                                        ) : item.lastSemesterCourseList.length > 1 ? (
                                            <Select
                                                className={styles.lastTermCourse}
                                                placeholder="请选择"
                                                onChange={this.selectLastTermCourse.bind(
                                                    this,
                                                    item.id
                                                )}
                                            >
                                                {item.lastSemesterCourseList.map((el, order) => {
                                                    return (
                                                        <Option value={el.id} key={el.id}>
                                                            {el.name}&nbsp;{el.ename}
                                                        </Option>
                                                    );
                                                })}
                                            </Select>
                                        ) : (
                                            ''
                                        )}
                                        <i className={icon.iconfont + ' ' + styles.toRigth}>
                                            &#xe7f5;
                                        </i>
                                        <span className={styles.nowSemester}>
                                            {item.name} &nbsp;{item.englishName}
                                        </span>
                                    </span>
                                ),
                            });
                        }
                    );
                this.setState({
                    plainOption,
                });
            },
        });
    };

    onCancelHistory = () => {
        this.setState({
            fromHistoryModal: false,
            lastCourseId: '',
        });
    };

    formatTeacherList = (teacherList) => {
        if (!teacherList || teacherList.length < 0) return [];
        let teacherResult = [];
        teacherList.map((item, index) => {
            /* let obj = {
                title: item.name + ' ' + item.englishName,
                key: index,
                value: item.teacherId,
            }; */
            let obj = {
                name: item.name,
                enName: item.englishName,
                orgFlag: false,
                id: item.teacherId,
            };
            teacherResult.push(obj);
        });
        return teacherResult;
    };

    changeNecessaryTeacherVisible = (visible) => {
        this.setState({
            necessaryTeacherVisible: visible ?? false,
        });
    };

    changeAssistTeacherVisible = (visible) => {
        this.setState({
            assistTeacherVisible: visible ?? false,
        });
    };

    //选人组件回显value
    selectTeacherValue = (teacherValue) => {
        if (!teacherValue || teacherValue.length == 0) return [];
        let teacherArr = [];
        teacherValue.map((el) => {
            teacherArr.push({
                id: el.id,
                name: el.name,
                englishName: el.ename,
            });
        });
        return teacherArr;
    };

    searchTeacherConfirm = (num, order, courseDetail, ids, selectRole) => {
        if (selectRole === 'necessaryTeacher') {
            this.changeMaster(num, order, courseDetail, ids);
            this.changeNecessaryTeacherVisible(false);
        } else if (selectRole === 'assistantTeacher') {
            this.changeHelpTeacher(num, order, courseDetail, ids);
            this.changeAssistTeacherVisible(false);
        }
    };

    clickPlus = (index, order, selectRole) => {
        if (selectRole === 'necessaryTeacher') {
            this.changeNecessaryTeacherVisible(true);
        } else if (selectRole === 'assistantTeacher') {
            this.changeAssistTeacherVisible(true);
        }
        this.setState({
            selectTeacherIndex: index,
            selectGroupOrder: order,
        });
    };

    render() {
        const {
            courseDetail,
            studentGroupList,
            newTeacherLists,
            getCoursePlanning,
            planningGroupForAdd,
            importHistorySemesterList,
        } = this.props;
        const {
            showEdit,
            modalVisible,
            historyModal,
            teacherValue,
            switchOnchange,
            applyModalVisible,
            model,
            planningGroupValue,
            isAddShow,
            fromHistoryModal,
            necessaryTeacherVisible,
            assistTeacherVisible,
            selectTeacherIndex,
            sureToRevise,
            classString,
        } = this.state;
        let addStyle = courseDetail.exist ? styles.addStyleBlock : styles.addStyleNone;
        const treeProps = {
            treeNodeFilterProp: 'title',
            treeCheckable: true,
            treeNodeFilterProp: 'title',
        };
        const teacherProps = {
            treeData: this.formatTeacherData(newTeacherLists),
            value: teacherValue,
            placeholder: trans('global.placeholder', '请输入'),
            onChange: this.changTeacher,
            style: {
                width: 300,
            },
            dropdownStyle: {
                maxHeight: 400,
                overflow: 'auto',
            },
            ...treeProps,
        };
        const greadProps = {
            treeDefaultExpandedKeys: ['1行政班'],
            treeData: this.formatStudentGroup(planningGroupForAdd),
            value: planningGroupValue,
            onChange: this.changeplanningGroup.bind(this, courseDetail),

            ...treeProps,
        };
        let globalCardUtil = showEdit
            ? styles.globalCardUtil + ' ' + styles.active
            : styles.globalCardUtil;
        let courseHeader = showEdit ? styles.cardHeader + ' ' + styles.active : styles.cardHeader;
        let treeSelectProps = {
            treeNodeFilterProp: 'title',
            dropdownStyle: {
                maxHeight: 400,
                overflow: 'auto',
            },
        };
        let isShowImport = false;
        if (
            courseDetail.groups &&
            courseDetail.groups.length == 0 &&
            !courseDetail.lessonSum &&
            !courseDetail.totalLesson &&
            !courseDetail.maxStudent &&
            !courseDetail.minStudent &&
            !courseDetail.materialCost &&
            !courseDetail.classFee &&
            !courseDetail.exist
        ) {
            isShowImport = true;
        }

        return (
            <div className={globalCardUtil}>
                <div className={courseHeader}>
                    <p className={styles.courseMsg}>
                        <span className={styles.subjectName}>{courseDetail.name}</span>
                        <span
                            style={{
                                overflowX: 'scroll',
                                whiteSpace: 'nowrap',
                                position: 'absolute',
                                zIndex: 999,
                            }}
                        >
                            {courseDetail.teacherInfoList &&
                                courseDetail.teacherInfoList.length > 0 &&
                                courseDetail.teacherInfoList.map((el, order) => {
                                    return (
                                        <span key={order} className={styles.headerTeacher}>
                                            {el.name}
                                        </span>
                                    );
                                })}
                        </span>
                    </p>
                    {courseDetail.maxStudent ||
                    courseDetail.classFee ||
                    courseDetail.totalLesson ||
                    courseDetail.weekLesson ||
                    courseDetail.materialCost ||
                    courseDetail.minStudent ? (
                        <p>
                            <span className={styles.allCourseNum}>
                                {courseDetail &&
                                    courseDetail.weeklyClassInfoList &&
                                    courseDetail.weeklyClassInfoList.length > 0 &&
                                    courseDetail.weeklyClassInfoList.map((info, index) => {
                                        return (
                                            <span>
                                                {info.weekLessons} {trans('global.times', '次')}{' '}
                                                {info.unitDuration} min x{info.onceLessons} &nbsp;
                                                &nbsp;
                                            </span>
                                        );
                                    })}
                            </span>
                        </p>
                    ) : (
                        ''
                    )}
                    {isShowImport ? (
                        <div style={{ textAlign: 'right' }}>
                            {courseDetail &&
                                courseDetail.gradeIdList &&
                                courseDetail.gradeIdList.length == 1 && (
                                    <span
                                        className={styles.fromHistory}
                                        onClick={this.importFromHistory}
                                    >
                                        从上学期导入
                                    </span>
                                )}
                            {courseDetail &&
                                courseDetail.gradeIdList &&
                                courseDetail.gradeIdList.length == 1 && (
                                    <span className={styles.or}>或</span>
                                )}

                            <span
                                className={styles.handle}
                                onClick={this.setUpCourse.bind(this, courseDetail)}
                            >
                                直接配置
                            </span>
                            <Popover
                                title={null}
                                placement="bottom"
                                content={
                                    <div className={styles.btnItem}>
                                        {/* <div onClick={() => this.applyOtherClassbj(courseDetail)}>{trans("tc.base.edit.open.course.information", "编辑开课信息")}</div> */}
                                        <div onClick={this.deleteke.bind(this, courseDetail)}>
                                            {trans('tc.base.remove.course', '移除课程')}
                                        </div>
                                    </div>
                                }
                            >
                                <Icon className={styles.popover_icon1} type="ellipsis" />
                            </Popover>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'right', marginTop: '7px' }}>
                            <div className={addStyle}>
                                <a className={styles.saveBtn}>
                                    <Icon type="plus" />
                                </a>
                                <div className={styles.addTree} onClick={this.selectAddGroup}>
                                    <TreeSelect {...greadProps}></TreeSelect>
                                </div>
                            </div>
                            <div
                                className={styles.edit}
                                onClick={() => this.applyOtherClassbj(courseDetail)}
                            >
                                <i className={icon.iconfont}>&#xe63b;</i>
                            </div>
                            <Popover
                                title={null}
                                placement="bottom"
                                content={
                                    <div className={styles.btnItem}>
                                        {/* <div onClick={() => this.applyOtherClassbj(courseDetail)}>{trans("tc.base.edit.open.course.information", "编辑开课信息")}</div> */}
                                        <div onClick={this.deleteke.bind(this, courseDetail)}>
                                            {trans('tc.base.remove.course', '移除课程')}
                                        </div>
                                    </div>
                                }
                            >
                                <Icon className={styles.popover_icon} type="ellipsis" />
                            </Popover>
                        </div>
                    )}
                </div>
                {courseDetail.groups && courseDetail.groups.length > 0 ? (
                    this.renderTableRow(courseDetail.groups, courseDetail)
                ) : isShowImport ? (
                    ''
                ) : (
                    <div className={styles.noGroup}>
                        <p>
                            {trans(
                                'course.plan.rule.one',
                                '暂未添加任何课时计划，点击右上角 + 试一试'
                            )}
                        </p>
                    </div>
                )}
                {modalVisible && (
                    <Modal
                        title=""
                        visible={modalVisible}
                        onCancel={this.deletekeTwocel}
                        onOk={this.deletekeTwoOk.bind(this, courseDetail)}
                        okText={trans('pay.confirm', '确认')}
                        width="400px"
                        cancelText={trans('global.cancel', '取消')}
                    >
                        <div className={styles.daeleModal}>
                            <p>
                                {trans('course.plan.remove.this.course', '您确定要移除该课程吗？')}
                            </p>
                            {trans(
                                'course.plan.continue.remove.clear',
                                '若继续移除，相关课时计划都将被清空。'
                            )}
                        </div>
                    </Modal>
                )}

                {showEdit && (
                    <div style={{ height: '56px', textAlign: 'right' }}>
                        <span style={{ marginRight: '20px' }}>
                            {/* 保存时会同步修改本周及以后的课表和日程中的教师 */}
                        </span>
                        <a
                            className={styles.saveBtn}
                            style={{ lineHeight: '56px' }}
                            onClick={this.saveCourseOff}
                        >
                            {trans('course.plan.cancelText', '取消')}
                        </a>
                        <a className={styles.saveBtnc} onClick={this.saveCourse}>
                            {trans('global.save', '保存')}
                        </a>
                    </div>
                )}

                {/* {
                applyModalVisible ?
                <Modal
                    title={trans("course.plan.apply.other.class", "应用到其他教学班")}
                    visible={applyModalVisible}
                    onCancel={this.hideModal}
                    onOk={this.confirmApply}
                    okText={trans("pay.confirm", "确认")}
                    cancelText={trans("course.plan.cancelText", "取消")}
                >
                    <div className={styles.applyModal}>
                        <p>{trans("course.plan.select.teach.apply.class", "请选择将要应用到的教学班")}</p>
                        <TreeSelect
                            treeData={this.props.applyGroupList}
                            onChange={this.changeApplyClass}
                            placeholder={trans("global.select", "请选择")}
                            value={this.state.applyClassArr}
                            treeCheckable={true}
                            style={{ width: 180 }}
                            {...treeSelectProps}
                        />
                    </div>

                </Modal>
                :null
            } */}

                {historyModal ? (
                    <Modal
                        title={trans('tc.base.setup.course.information', '设置开课信息')}
                        visible={historyModal}
                        onCancel={this.hideHistoryModal}
                        onOk={this.confirmImport}
                        okText={trans('global.save', '保存')}
                        cancelText={trans('course.plan.cancelText', '取消')}
                        width="600px"
                        // className={styles.setCourseStyle}
                    >
                        <div className={styles.importHistory}>
                            <div className={styles.weekPlan}>
                                <span>{trans('tc.base.plan.every.section', '计划周课节')}</span>
                                {getCoursePlanning &&
                                    getCoursePlanning.weeklyClassInfoList &&
                                    getCoursePlanning.weeklyClassInfoList.length > 0 &&
                                    getCoursePlanning.weeklyClassInfoList.map((item, index) => {
                                        let customKey = new Date().getTime();
                                        return (
                                            <div className={styles.addLines}>
                                                <span className={styles.everyJie}>
                                                    {trans('global.weekly', '每周')}
                                                </span>
                                                <InputNumber
                                                    className={styles.times}
                                                    min={1}
                                                    value={item.weekLessons}
                                                    step={1}
                                                    style={{ width: 50 }}
                                                    onChange={this.saveWeekLesson.bind(
                                                        this,
                                                        item,
                                                        index
                                                    )}
                                                />
                                                <span className={styles.numberText}>
                                                    {trans('global.times', '次')}
                                                </span>
                                                <span className={styles.everyTime}>
                                                    {trans('global.every', '每次')}
                                                </span>
                                                <div className={styles.time}>
                                                    {/* <Input value={item.onceLessons} onChange = {this.saveOnceLessons.bind(this,item,index)}></Input> */}
                                                    <InputNumber
                                                        className={styles.times}
                                                        min={1}
                                                        value={item.onceLessons}
                                                        step={1}
                                                        style={{ width: 50 }}
                                                        onChange={this.saveOnceLessons.bind(
                                                            this,
                                                            item,
                                                            index
                                                        )}
                                                    />
                                                </div>
                                                <span className={styles.jie}>
                                                    {trans('global.section', '节')}
                                                </span>
                                                <span className={styles.everyJie}>
                                                    {trans('global.each.section', '每节')}
                                                </span>
                                                <div className={styles.time}>
                                                    <InputNumber
                                                        className={styles.times}
                                                        min={1}
                                                        value={item.unitDuration}
                                                        step={5}
                                                        style={{ width: 70 }}
                                                        onChange={this.saveUnitDuration.bind(
                                                            this,
                                                            item,
                                                            index
                                                        )}
                                                    />
                                                    {/* <Input value={item.unitDuration} onChange = {this.saveUnitDuration.bind(this,item,index)}></Input> */}
                                                </div>
                                                <span className={styles.min}>min</span>

                                                <span
                                                    className={styles.delete}
                                                    onClick={this.deleteHandle.bind(
                                                        this,
                                                        item,
                                                        index
                                                    )}
                                                >
                                                    <i className={icon.iconfont}>&#xea6b;</i>
                                                </span>
                                            </div>
                                        );
                                    })}
                            </div>
                            <div className={styles.add} onClick={this.addHandle}>
                                + {trans('global.add', '添加')}
                            </div>

                            <div className={styles.singleLines}>
                                <span className={styles.modalnumberTextleft}>
                                    {trans('tc.base.plan.all.time', '计划总课时')}
                                </span>
                                <InputNumber
                                    className={styles.inputnum}
                                    min={0}
                                    placeholder={trans('global.placeholder', '请输入')}
                                    value={this.state.totalLesson}
                                    step={1}
                                    style={{ width: 89, borderRadius: 8 }}
                                    onChange={this.totalLesson}
                                />
                                <span className={styles.numberText}>
                                    {trans('global.section', '节')}
                                </span>
                            </div>

                            <div style={{ marginTop: '24px' }} className={styles.singleLines}>
                                <span
                                    style={{ marginLeft: '13px' }}
                                    className={styles.modalnumberTextleft}
                                >
                                    {trans('tc.base.plan.every.class', '计划每班')}
                                </span>
                                <InputNumber
                                    className={styles.inputnum}
                                    min={0}
                                    placeholder={trans('global.placeholder', '请输入')}
                                    value={this.state.minStudent}
                                    step={1}
                                    style={{ width: 89, borderRadius: 8 }}
                                    onChange={this.minStudent}
                                />
                                <span className={styles.numberText}>-</span>
                                <InputNumber
                                    className={styles.inputnum}
                                    min={0}
                                    placeholder={trans('global.placeholder', '请输入')}
                                    value={this.state.maxStudent}
                                    step={1}
                                    style={{ width: 89, borderRadius: 8 }}
                                    onChange={this.maxStudent}
                                />
                                <span className={styles.numberText}>
                                    {trans('global.people', '人')}
                                </span>
                            </div>
                            <div style={{ marginTop: '24px' }} className={styles.singleLines}>
                                <span
                                    style={{ margin: '0 17px 0 13px' }}
                                    className={styles.modalnumberTextleft}
                                >
                                    {trans('tc.base.cost.setup', '收费设置')}
                                </span>
                                <Switch
                                    checkedChildren="开"
                                    unCheckedChildren="关"
                                    checked={this.state.switchOnchange}
                                    onChange={this.switchOnchange}
                                />
                            </div>

                            <div style={{ marginTop: '24px' }}></div>
                            {switchOnchange && (
                                <div className={styles.singleLines}>
                                    <span
                                        style={{ marginLeft: '26px' }}
                                        className={styles.modalnumberTextleft}
                                    >
                                        {trans('tc.base.course.cost', '课时费')}
                                    </span>
                                    <InputNumber
                                        className={styles.inputnum}
                                        min={1}
                                        placeholder={trans('global.placeholder', '请输入')}
                                        value={this.state.classFee}
                                        step={1}
                                        style={{ width: 68 }}
                                        onChange={this.classFee}
                                    />
                                    <span className={styles.numberText}>
                                        {trans('tc.base.yuan.period', '元/期')}
                                    </span>
                                </div>
                            )}
                            {switchOnchange && (
                                <div className={styles.singleLines}>
                                    <span
                                        style={{ marginLeft: '26px' }}
                                        className={styles.modalnumberTextleft}
                                    >
                                        {trans('tc.base.material.cost', '材料费')}
                                    </span>
                                    <InputNumber
                                        className={styles.inputnum}
                                        min={1}
                                        placeholder={trans('global.placeholder', '请输入')}
                                        value={this.state.materialCost}
                                        step={1}
                                        style={{ width: 68 }}
                                        onChange={this.materialCost}
                                    />
                                    <span className={styles.numberText}>
                                        {trans('tc.base.yuan.period', '元/期')}
                                    </span>
                                </div>
                            )}
                            <div
                                style={{ marginTop: '24px', display: 'flex' }}
                                className={styles.singleLines}
                            >
                                <span
                                    style={{
                                        marginRight: '16px',
                                        marginLeft: '12px',
                                        alignSelf: 'center',
                                    }}
                                    className={styles.modalnumberTextleft}
                                >
                                    {trans('tc.base.charge.teacher', '负责教师')}
                                </span>
                                <TreeSelect {...teacherProps} />
                            </div>
                        </div>
                    </Modal>
                ) : null}
                <HistoryImportModal
                    getCoursePlan={this.props.getCoursePlan}
                    fromHistoryModal={this.state.fromHistoryModal}
                    onCancelHistory={this.onCancelHistory}
                    importHistorySemesterList={
                        this.props.importHistorySemesterList && this.props.importHistorySemesterList
                    }
                    plainOption={this.state.plainOption}
                    semesterValue={this.props.semesterValue}
                    schoolId={this.props.schoolId}
                    dispatch={this.props.dispatch}
                    importHistorySemesterList={this.props.importHistorySemesterList}
                    selectCourseId={this.state.selectCourseId}
                ></HistoryImportModal>
                <Modal
                    visible={sureToRevise}
                    title="修改确认"
                    className={styles.reviseStyle}
                    okText="确认修改"
                    onOk={this.submitInfo}
                    onCancel={this.cancelRevise}
                >
                    <p>
                        您修改了<span style={{ color: 'red' }}>{classString}</span>
                        的教师，保存后会同步生效到当天及以后的课表日程（
                        <span style={{ color: 'blue' }}>
                            联动修改范围：同课程同班级原教师相同的课表和日程
                        </span>
                        ）
                    </p>
                </Modal>
            </div>
        );
    }
}
