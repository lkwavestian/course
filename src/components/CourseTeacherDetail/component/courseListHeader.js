import React from 'react';
import styles from './courseListHeader.less';
import {
    Icon,
    Dropdown,
    Modal,
    message,
    Checkbox,
    Input,
    Form,
    TreeSelect,
    InputNumber,
    Select,
    Tooltip,
    DatePicker,
} from 'antd';
import { Link } from 'dva/router';
import EditClassInfor from './editClassInfor';
import { getUrlSearch } from '../../../utils/utils';
import { trans, locale } from '../../../utils/i18n';
import { connect } from 'dva';
import icon from '../../../icon.less';
import EditCourseInfor from '../component/editCourseInfor';
import moment from 'moment';
import { isEqual, join } from 'lodash';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
@Form.create()
@connect((state) => ({
    cancelMsg: state.courseTeacherDetail.cancelMsg,
    teacherList: state.course.teacherList,
    teacherListFormated: state.course.teacherListFormated,
    chooseCourseDetails: state.choose.chooseCourseDetails,
    currentUser: state.global.currentUser,
}))
class CourseListHeader extends React.PureComponent {
    constructor(props) {
        super(props);
        const letter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];
        this.state = {
            visibleEditClassInfor: false, // 编辑课程对应班级信息
            data: props,
            classId: '',
            groupId: '',
            index: 0, // 默认点击第一个
            planId: getUrlSearch('planId'),
            sectionIds: getUrlSearch('sectionIds'),
            isCancel: false,
            courseGroupPlanId: '',
            showAddClass: false, // 增开新班级
            chClassName: `${this.props.courseName} ${letter[this.props.serial]}班`, // 班级中文名
            enClassName: `${this.props.courseEnglishName} ${letter[this.props.serial]}`, // 班级英文名
            mainTeacherList: [], //主教老师
            assistantTeacher: [], //协同老师
            visibleEditCourseInfor: false,
            minStudentCount: undefined,
            maxStudentCount: undefined,
            minAge: undefined,
            maxAge: undefined,
            siteValue: [],
            rainSite: '',
            classTime: [],
            mainTeachers: [],
            groupSuitGradeList: [],
            assistTeachers: [],
            minSignUpCount: undefined,
            maxSignUpCount: undefined,
            addressList: [],
            rainyDayLocation: '',
            newCourseName: '',
            newCourseEname: '',
            classTimeModels: [],
            suitGrade: [],
            startTime: undefined,
            endTime: undefined,
            groupValue: '', //班级所属分组
            groupGroupingNumJsonDTO: {},
        };
    }

    shouldComponentUpdate(nextProps, prevState) {
        let arr = [
            // 父组件取值
            'areaList',
            'checkedIds',
            'chooseCourseEname',
            'chooseCourseName',
            'chooseCoursePlanId',
            'courseEnglishName',
            'courseGroupPlanOutputModels',
            'courseId',
            'courseIdLists',
            'courseIndex',
            'courseName',
            'coursePlanId',
            'courseSuitGradeList',
            'courseVisible',
            'effecticveDisabled',
            'groupPermission',
            'groupingList',
            'isAdmin',
            'isAllowCancel',
            'isChecked',
            'layoutStyle',
            'materialFeeType',
            'nonAdminType',
            'planStatus',
            'prefaceCourseList',
            'semesterId',
            'serial',
            'subjectSort',
            'visibleEditCourseInfor',

            //model
            'teacherListFormated',
        ];
        let findItem = arr.find((item) => !isEqual(nextProps[item], this.props[item]));
        if (!findItem && isEqual(prevState, this.state)) {
            return false;
        } else {
            return true;
        }
    }

    onRef = (ref) => {
        this.ref = ref;
    };

    show = (item, index, event) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'course/getTeacherList',
            payload: {},
        });
        event.stopPropagation();
        this.setState({
            visibleEditClassInfor: true,
            classId: item.studentGroupModel.id,
            groupId: item.studentGroupModel.id,
            mainTeachers: item.mainTeachers,
            groupSuitGradeList: item.groupSuitGradeList,
            assistTeachers: item.assistTeachers,
            minSignUpCount: item.minSignUpCount,
            maxSignUpCount: item.maxSignUpCount,
            groupGroupingNumJsonDTO: item.groupGroupingNumJsonDTO,
            minAge: item.minAge,
            maxAge: item.maxAge,
            addressList: item.addressList,
            newCourseName: item.studentGroupModel.name,
            newCourseEname: item.studentGroupModel.ename,
            rainyDayLocation: item.rainyDayLocation,
            classTimeModels: item.classTimeModels,
            startTime: item.startTime,
            endTime: item.endTime,
            index,
        });
    };

    updateData = (item) => {
        let { index, data } = this.state;
        let elt = data.courseGroupPlanOutputModels[index].studentGroupModel;
        elt.name = item.name;
        elt.ename = item.ename;
        elt.minStudentCount = item.minStudentCount;
        elt.maxStudentCount = item.maxStudentCount;
        elt.minAge = item.minAge;
        elt.maxAge = item.maxAge;

        data.courseGroupPlanOutputModels[index].studentGroupModel = elt;
        data.courseGroupPlanOutputModels[index].maxSignUpCount = item.maxStudentCount;
        this.setState({
            data,
        });
    };

    changeGroup = (value) => {
        this.setState({
            groupValue: value,
        });
    };

    handleChange = (type, bol, value) => {
        if (bol) {
            this.setState({
                [type]: value.target.value,
            });
        } else {
            this.setState({
                [type]: value,
            });
        }
    };

    del(item, i, event) {
        event.stopPropagation();
        let { data, planId } = this.state;
        const { dispatch, coursePlanId, self } = this.props;
        let that = this;
        Modal.confirm({
            content: trans(
                'global.deleteConfirmTit',
                '您确认要将该班级从本次选课移除并且删除班级相关的全部信息吗？'
            ),
            className: styles.deleteConfirm,
            onOk() {
                dispatch({
                    type: 'courseBaseDetail/deleteCourseChoose',
                    payload: {
                        chooseCoursePlanId: Number(planId),
                        coursePlanningId: coursePlanId,
                        classIds: [item.studentGroupModel.id],
                        type: 1,
                    },
                }).then(() => {
                    if (data.courseGroupPlanOutputModels.length <= 1) {
                        // 删除只剩一个时，重新恢复请求
                        self.resetData();
                    } else {
                        data.courseGroupPlanOutputModels.splice(i, 1);
                        that.setState({
                            data,
                        });
                    }
                });
            },
        });
    }

    handleCancelOpen = (item, i) => {
        let { planId } = this.state;
        const { dispatch, coursePlanId } = this.props;
        let that = this;
        Modal.confirm({
            content: trans('tc.base.confirm.cancel.course', '您确定要取消开课吗？'),
            className: styles.deleteConfirm,
            onOk() {
                dispatch({
                    type: 'courseTeacherDetail/cancelPlan',
                    payload: {
                        chooseCoursePlanId: Number(planId),
                        coursePlanningId: coursePlanId,
                        classIds: [item.studentGroupModel.id],
                        courseGroupPlanIds: item.courseGroupPlanIds,
                    },
                }).then(() => {
                    const { cancelMsg } = that.props;
                    if (cancelMsg && cancelMsg.status) {
                        message.success(cancelMsg.message);
                        that.setState({
                            isCancel: true,
                            courseGroupPlanId: item.courseGroupPlanIds,
                        });
                    }
                });
            },
        });
    };

    onChildChange = (e) => {
        const { setChildChecked, addCheck, addCourseId, ridUnCourse, ridUnCheck } = this.props;
        const { data } = this.state;
        if (e.target.checked) {
            typeof addCheck == 'function' && addCheck.call(this, data.courseId);
            typeof addCourseId == 'function' && addCourseId.call(this, data.coursePlanId);
        } else {
            typeof ridUnCheck == 'function' && ridUnCheck.call(this, data.courseId);
            typeof ridUnCourse == 'function' && ridUnCourse.call(this, data.coursePlanId);
        }
    };

    stopWindowOpen = (e) => {
        e.stopPropagation();
    };

    addClassHandle = (event) => {
        event.stopPropagation();
        const { dispatch, chooseCourseDetails } = this.props;
        this.setState({
            showAddClass: true,
            startTime1: moment(chooseCourseDetails.startTime).format('YYYY-MM-DD'),
            endTime1: moment(chooseCourseDetails.endTime).format('YYYY-MM-DD'),
        });
        dispatch({
            type: 'course/getTeacherList',
            payload: {
                matchName: '',
            },
        });
    };

    editClassHandle = (event) => {
        event.stopPropagation();
        this.setState({
            visibleEditCourseInfor: true,
        });
    };

    addCancel = () => {
        const letter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];
        this.setState({
            showAddClass: false,
            chClassName: `${this.props.courseName} ${letter[this.props.serial]}班`,
            enClassName: `${this.props.courseEnglishName} ${letter[this.props.serial]}`,
            mainTeacherList: [], //主教老师
            assistantTeacher: [], //协同老师
            suitGrade: [],
        });
    };

    affirmAddClass = () => {
        const {
            chClassName,
            enClassName,
            mainTeacherList,
            assistantTeacher,
            planId,
            maxStudentCount,
            minStudentCount,
            minAge,
            maxAge,
            classTime,
            siteValue,
            rainSite,
            suitGrade,
            groupValue,
        } = this.state;
        const { coursePlanId, dispatch, groupingList, chooseCourseDetails } = this.props;

        if (!minStudentCount) {
            message.warn('请填写最小人数');
            return;
        }
        if (!maxStudentCount) {
            message.warn('请填写最大人数');
            return;
        }

        if (maxStudentCount < minStudentCount) {
            message.warn(trans('tc.base.maximum.of.minimum', '容量范围最大值应大于最小值'));
            return;
        }
        if (maxAge && minAge && maxAge < minAge) {
            message.warn(trans('tc.base.maximum.of.minimum', '容量范围最大值应大于最小值'));
            return;
        }
        if (chooseCourseDetails.classDate.length > 0 && classTime.length == 0) {
            message.warn('请至少设置一项上课时间');
            return;
        }
        if (suitGrade.length === 0) {
            message.warning('请选择适用年级');
            return;
        }
        if (mainTeacherList.length === 0) {
            message.warning('请选择主教教师');
            return;
        }

        let tempGroupObj = {};
        groupingList && groupingList.length > 0
            ? (tempGroupObj = groupingList.find((item) => item.groupingKey == groupValue))
            : {};

        dispatch({
            type: 'courseBaseDetail/addNewClass',
            payload: {
                chooseCoursePlanId: Number(planId),
                coursePlanningId: coursePlanId,
                className: chClassName,
                classEnglishName: enClassName,
                masterTeacherIds: mainTeacherList,
                assistTeacherIds: assistantTeacher,
                minStudentNum: minStudentCount,
                maxStudentNum: maxStudentCount,
                minAge: minAge,
                maxAge: maxAge,
                addressIdList: siteValue,
                rainyDayLocation: rainSite,
                classTimeInputModels: classTime,
                groupSuitGradeIdList: suitGrade,
                startTime: this.state.startTime1,
                endTime: this.state.endTime1,
                groupGroupingNumJsonDTO: tempGroupObj,
            },
            onSuccess: () => {
                this.setState({
                    className: '',
                    classEnglishName: '',
                    showAddClass: false,
                    mainTeacherList: [], //主教老师
                    assistantTeacher: [], //协同老师
                    minStudentCount: undefined,
                    maxStudentCount: undefined,
                    minAge: undefined,
                    maxAge: undefined,
                    classTime: [],
                    siteValue: [],
                    suitGrade: [],
                    rainSite: '',
                });
                setTimeout(this.props.getTableList(), 1000);
            },
        }).then(() => {
            /* this.setState({
                className: '',
                classEnglishName: '',
                showAddClass: false,
                mainTeacherList: [], //主教老师
                assistantTeacher: [], //协同老师
                minStudentCount: undefined,
                maxStudentCount: undefined,
                classTime: [],
                siteValue: [],
                suitGrade: [],
                rainSite: '',
            });
            setTimeout(this.props.getTableList(), 1000); */
        });
    };

    chNameChange = (e) => {
        this.setState({
            chClassName: e.target.value,
        });
    };

    enNameChange = (e) => {
        this.setState({
            enClassName: e.target.value,
        });
    };

    changeRainSite = (e) => {
        this.setState({
            rainSite: e.target.value,
        });
    };

    delData = (index) => {
        let classTime = JSON.parse(JSON.stringify(this.state.classTime));
        classTime.splice(index, 1);
        this.setState({
            classTime,
        });
    };

    addData = () => {
        const { chooseCourseDetails } = this.props;
        let newClassTime = JSON.parse(JSON.stringify(this.state.classTime));
        newClassTime.push({
            endTime: chooseCourseDetails.classTime[0].endTime,
            id: chooseCourseDetails.classTime[0].id,
            startTime: chooseCourseDetails.classTime[0].startTime,
            weekDay: chooseCourseDetails.classDate[0],
        });
        this.setState({
            classTime: newClassTime,
        });
    };

    //选择主教老师
    changeMainTeacher = (value) => {
        this.setState({
            mainTeacherList: value,
        });
    };

    //选择协同老师
    changeAssistantTeacher = (value) => {
        this.setState({
            assistantTeacher: value,
        });
    };

    //格式化教师列表
    formatTeacherList = (teacherList) => {
        if (!teacherList || teacherList.length < 0) return [];
        let teacherResult = [];
        teacherList.map((item, index) => {
            let obj = {
                title:
                    item.englishName && item.englishName != item.name
                        ? `${item.name}(${item.englishName})`
                        : `${item.name}`,
                key: index,
                value: item.teacherId,
            };
            teacherResult.push(obj);
        });
        return teacherResult;
    };

    hideModal = (type) => {
        switch (type) {
            case 'visibleEditCourseInfor':
                this.setState({
                    visibleEditCourseInfor: false,
                });
                break;
            default:
                break;
        }
    };

    hideClassInfor = () => {
        this.setState({
            visibleEditClassInfor: false,
        });
    };

    noToChinese = (num) => {
        if (!/^\d*(\.\d*)?$/.test(num)) {
            alert('Number is wrong!');
            return 'Number is wrong!';
        }
        // eslint-disable-next-line no-array-constructor
        var AA = new Array('零', '一', '二', '三', '四', '五', '六', '七', '八', '九');
        // eslint-disable-next-line no-array-constructor
        var BB = new Array('', '十', '百', '千', '万', '亿', '点', '');
        var a = ('' + num).replace(/(^0*)/g, '').split('.'),
            k = 0,
            re = '';
        for (var i = a[0].length - 1; i >= 0; i--) {
            // eslint-disable-next-line default-case
            switch (k) {
                case 0:
                    re = BB[7] + re;
                    break;
                case 4:
                    if (!new RegExp('0{4}\\d{' + (a[0].length - i - 1) + '}$').test(a[0]))
                        re = BB[4] + re;
                    break;
                case 8:
                    re = BB[5] + re;
                    BB[7] = BB[5];
                    k = 0;
                    break;
            }
            if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0) re = AA[0] + re;
            if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re;
            k++;
        }
        if (a.length > 1) {
            //加上小数部分(如果有小数部分)
            re += BB[6];
            for (var i = 0; i < a[1].length; i++) re += AA[a[1].charAt(i)];
        }
        return re;
    };

    changeWeekDay = (index, value) => {
        let classTime = JSON.parse(JSON.stringify(this.state.classTime));
        classTime[index].weekDay = value;
        this.setState({ classTime });
    };

    changeClassData = (index, value) => {
        const { chooseCourseDetails } = this.props;
        let obj = {};
        chooseCourseDetails?.classTime &&
            chooseCourseDetails.classTime.map((item, index) => {
                if (item.id == value) {
                    obj = item;
                }
            });
        let newClassTime = JSON.parse(JSON.stringify(this.state.classTime));
        newClassTime[index].id = obj.id;
        newClassTime[index].startTime = obj.startTime;
        newClassTime[index].endTime = obj.endTime;
        this.setState({
            classTime: newClassTime,
        });
    };

    avatrToDetail = (data, item) => {
        const { sectionIds } = this.state;
        const { isAdmin, chooseCourseDetails, nonAdminType } = this.props;

        const isBlank = window.self != window.top ? '_self' : '_blank';
        window.open(
            `#/course/base/detail?chooseCoursePlanId=${data.chooseCoursePlanId}&coursePlanningId=${data.coursePlanId}&classId=${item.studentGroupModel.id}&courseId=${data.courseId}&chooseCourseName=${data.chooseCourseName}&chooseCourseEname=${data.chooseCourseEname}&courseName=${data.courseName}&courseEname=${data.courseEnglishName}&sectionIds=${sectionIds}&isAdmin=${isAdmin}&nonAdminType=${nonAdminType}&courseIntroductionType=${chooseCourseDetails?.courseIntroductionType}&tabIndex=1`,
            isBlank
        );
    };

    toCourseDetail = (event) => {
        event.stopPropagation();
    };

    preventToDetail = (event) => {
        event.stopPropagation();
    };

    toggleSelStatus = (isOpen, isReport, courseId, event) => {
        event.stopPropagation();
        const { dispatch, coursePlanId, semesterId } = this.props;
        let { planId } = this.state;
        dispatch({
            type: 'courseBaseDetail/batchUpdateCourseSignUp',
            payload: {
                courseIdList: [courseId],
                chooseCoursePlanId: Number(planId),
                semesterId: semesterId,
                openSelection: isOpen == 1 ? 0 : isOpen == 0 ? 1 : undefined,
                courseRepeatApply: isReport,
            },
        }).then(() => {
            this.props.getTableList();
        });
    };

    getGroupName = (sourceGroupName) => {
        let courseInfo = this.state.data;
        const { courseName, courseEnName } = courseInfo;

        if (sourceGroupName.includes(courseName) && sourceGroupName !== courseName) {
            return sourceGroupName.split(courseName)[1].trimStart();
        }
        if (sourceGroupName.includes(courseEnName) && sourceGroupName !== courseEnName) {
            return sourceGroupName.split(courseEnName)[1].trimStart();
        }
        return sourceGroupName;
    };

    getCourseFeeDetailModelsContent = (courseFeeDetailModels) => {
        return (
            <span className={styles.courseFeeDetailModels}>
                {courseFeeDetailModels.map((item) => (
                    <span className={styles.studentGroup}>
                        <span>{this.getGroupName(item.groupName)}</span>
                        <span>{item.materialCost}</span>
                        <span>元/期</span>
                    </span>
                ))}
            </span>
        );
    };

    handlePicker = (date, dateString) => {
        this.setState({
            startTime1: dateString[0],
            endTime1: dateString[1],
        });
    };

    sortArr = (arr) => {
        let lang = locale();
        let tempArr = [];
        let kindergartenArr = [];
        arr.map((el, idx) => {
            if (el.name.includes('班')) {
                return kindergartenArr.push(lang == 'en' ? el.enName : el.name);
            } else {
                let tempNum = Number(el.enName.slice(1));
                return tempArr.push(tempNum);
            }
        });

        let result = [],
            i = 0;
        const list = tempArr.sort((a, b) => a - b);
        list.forEach((item, index) => {
            if (index === 0) {
                result[0] = [item];
            } else if (item - list[index - 1] === 1) {
                // 判断当前值 和 前一个值是否相差1
                result[i].push(item);
            } else {
                result[++i] = [item]; // 开辟新空间。
            }
        });

        let tempStr = [];
        result.map((el, idx) => {
            if (el.length == 1) {
                let tempObj = this.findGradeById(el, arr);
                return tempStr.push(lang == 'en' ? tempObj.enName : tempObj.name);
            } else {
                let startObj = this.findGradeById(el[0], arr);
                let endObj = this.findGradeById(el[el.length - 1], arr);
                let startStr = JSON.parse(JSON.stringify(startObj.name));
                startStr = startStr.substr(0, startStr.length - 2);
                let tempString =
                    lang == 'en'
                        ? `${startObj.enName}至${endObj.enName}`
                        : `${startStr}至${endObj.name}`;
                return tempStr.push(tempString);
            }
        });
        tempStr = [...kindergartenArr, ...tempStr];
        return tempStr.join('、');
    };

    findGradeById = (id, arr) => {
        let tempObj = {};
        arr.map((el, idx) => {
            if (el.enName == `G${id}`) {
                return (tempObj = el);
            }
        });
        return tempObj;
    };

    render() {
        let {
            areaList,
            isAdmin,
            effecticveDisabled,
            coursePlanId,
            isAllowCancel,
            courseIndex,
            checkedIds,
            form: { getFieldDecorator },
            teacherList,
            chooseCourseDetails,
            courseSuitGradeList,
            nonAdminType,
            planStatus,
            groupingList,
        } = this.props;

        console.log('isAdmin', isAdmin, nonAdminType, planStatus);
        let peroidList = [];
        let weekDayList = [];
        chooseCourseDetails?.classTime &&
            chooseCourseDetails.classTime.map((item, index) => {
                peroidList.push(item);
            });
        chooseCourseDetails?.classDate &&
            chooseCourseDetails.classDate.map((item, index) => {
                weekDayList.push(item);
            });
        let {
            visibleEditClassInfor,
            data,
            classId,
            groupId,
            sectionIds,
            planId,
            isCancel,
            courseGroupPlanId,
            showAddClass,
            chClassName,
            enClassName,
            visibleEditCourseInfor,
            minStudentCount,
            maxStudentCount,
            maxAge,
            minAge,
            siteValue,
            classTime,
            rainSite,
            mainTeachers,
            groupSuitGradeList,
            assistTeachers,
            minSignUpCount,
            maxSignUpCount,
            addressList,
            rainyDayLocation,
            classTimeModels,
            newCourseName,
            newCourseEname,
            suitGrade,
            groupGroupingNumJsonDTO,
        } = this.state;

        console.log(this.props.teacherListFormated, 'teacherListFormated');
        let courseId = data.courseId;
        let isChecked = checkedIds.indexOf(courseId) != -1 ? true : false;
        const treeProps = {
            treeCheckable: true,
            treeNodeFilterProp: 'title',
        };

        const mainTeacherListProps = {
            value: this.state.mainTeacherList,
            treeData: this.props.teacherListFormated,
            placeholder: trans('course.basedetail.add.searchTeacher', '搜索选择教师'),
            onChange: this.changeMainTeacher,
            dropdownStyle: {
                overflow: 'auto',
                maxHeight: '400px',
            },
            ...treeProps,
        };

        const assistTeacherListProps = {
            value: this.state.assistantTeacher,
            treeData: this.props.teacherListFormated,
            placeholder: trans('course.basedetail.add.searchTeacher', '搜索选择教师'),
            onChange: this.changeAssistantTeacher,
            dropdownStyle: {
                overflow: 'auto',
                maxHeight: '400px',
            },
            ...treeProps,
        };

        const isBlank = window.self != window.top ? '_self' : '_blank';
        let ifOutside =
            window.self != window.top
                ? `&ifOutside=${getUrlSearch('ifOutside') ? getUrlSearch('ifOutside') : 'false'}`
                : '';
        return (
            <div className={styles.CourseListHeader}>
                <div
                    className={styles.top}
                    onClick={() =>
                        window.open(
                            `#/course/base/detail?chooseCoursePlanId=${data.chooseCoursePlanId}&coursePlanningId=${data.coursePlanId}&courseId=${data.courseId}&chooseCourseName=${data.chooseCourseName}&chooseCourseEname=${data.chooseCourseEname}&courseName=${data.courseName}&courseEname=${data.courseEnglishName}&sectionIds=${sectionIds}&isAdmin=${isAdmin}&nonAdminType=${nonAdminType}&courseIntroductionType=${chooseCourseDetails?.courseIntroductionType}&tabIndex=0${ifOutside}`,
                            isBlank
                        )
                    }
                >
                    <div className={styles.title}>
                        <Checkbox
                            onChange={this.onChildChange}
                            onClick={this.stopWindowOpen}
                            checked={isChecked}
                        >
                            <span
                                // onClick={() =>
                                //     window.open(
                                //         `#/course/base/detail?chooseCoursePlanId=${data.chooseCoursePlanId}&coursePlanningId=${data.coursePlanId}&courseId=${data.courseId}&chooseCourseName=${data.chooseCourseName}&chooseCourseEname=${data.chooseCourseEname}&courseName=${data.courseName}&courseEname=${data.courseEnglishName}&sectionIds=${sectionIds}&isAdmin=${isAdmin}&courseIntroductionType=${chooseCourseDetails?.courseIntroductionType}&tabIndex=0${ifOutside}`,
                                //         isBlank
                                //     )
                                // }
                                // style={{ margin: '0 8px', fontSize: '14px' }}
                                onClick={this.stopWindowOpen}
                            >
                                {locale() == 'en' ? data.courseEnglishName : data.courseName}
                            </span>
                        </Checkbox>
                        &nbsp;
                        <span className={styles.isBan}>
                            {data.courseRepeatApply == false
                                ? trans('course.plan.repeat.signUp', '禁止重复报名')
                                : data.courseRepeatApply == true
                                ? trans('course.plan.repeat.allowed', '允许重复报名')
                                : ''}
                            &nbsp;
                            {data.courseVisible == 0
                                ? trans('course.plan.Open for registration', '开放报名')
                                : trans('course.plan.Registration not open', '不开放报名')}
                        </span>
                    </div>
                    <div className={styles.sub}>
                        <span>
                            {data.coursePlanType == 0
                                ? trans('course.plan.newClass', '新课')
                                : data.coursePlanType == 1
                                ? trans('course.plan.advanced', '进阶')
                                : data.coursePlanType == 2
                                ? trans('course.plan.schoolTeam', '校队')
                                : ''}
                        </span>
                        &nbsp;&nbsp;
                        {data && data.prefaceCourseList && data.prefaceCourseList.length != 0 && (
                            <span>
                                {trans('courseSet.prevCourse', '前序课程')}:
                                {data.prefaceCourseList?.map((item, index) => {
                                    return (
                                        <>
                                            {item.name}
                                            {data.prefaceCourseList.length - 1 === index
                                                ? null
                                                : '、'}
                                        </>
                                    );
                                })}
                            </span>
                        )}
                        {data.materialCost ||
                        (data.newMaterialCost && data.oldMaterialCost >= 0) ||
                        (data.courseFeeDetailModels && data.courseFeeDetailModels.length > 0) ? (
                            <span>
                                <span className={styles.b}>
                                    {trans('tc.base.material.cost', '材料费')}:
                                </span>
                                {data.materialCost
                                    ? trans('global.materialAmount', '{$num}元/期', {
                                          num: data.materialCost,
                                      })
                                    : data.newMaterialCost && data.oldMaterialCost >= 0
                                    ? [
                                          trans('global.materialAmount', '{$num}元/期,', {
                                              num: data.newMaterialCost,
                                          }),
                                          <span style={{ marginLeft: '15px' }}>
                                              {trans(
                                                  'global.materialAmountOld',
                                                  '老生{$num}元/期',
                                                  {
                                                      num: data.oldMaterialCost
                                                          ? data.oldMaterialCost
                                                          : '0',
                                                  }
                                              )}
                                          </span>,
                                      ]
                                    : data.courseFeeDetailModels &&
                                      data.courseFeeDetailModels.length > 0
                                    ? [
                                          '按班收费',
                                          <Tooltip
                                              title={this.getCourseFeeDetailModelsContent(
                                                  data.courseFeeDetailModels
                                              )}
                                              overlayClassName={styles.courseFeeDetailModels}
                                          >
                                              <Icon
                                                  type="question-circle"
                                                  theme="filled"
                                                  style={{ fontSize: '14px' }}
                                              />
                                          </Tooltip>,
                                      ]
                                    : ''}
                            </span>
                        ) : (
                            ''
                        )}
                    </div>
                    {isAdmin /* || (nonAdminType && planStatus == 1) */ ? ( //20240112拿掉非管理员权限
                        <div
                            className={styles.addClass}
                            onClick={this.addClassHandle.bind(this)}
                            style={{
                                width: locale() === 'en' ? '40%' : '28%',
                            }}
                        >
                            <span>{trans('student.addClassName', '新增班级')}</span>
                        </div>
                    ) : null}
                    {isAdmin ? (
                        <div
                            onClick={this.toggleSelStatus.bind(
                                this,
                                data.courseVisible,
                                data.courseRepeatApply,
                                data.courseId
                            )}
                            style={{
                                marginRight: '9px',
                                marginLeft: '5px',
                                width: locale() === 'en' ? '48%' : '28%',
                                color: '#0445FC',
                            }}
                        >
                            {data.courseVisible == 0
                                ? trans('course.plan.closeRegistration', '关闭报名')
                                : trans('course.plan.Open for registration', '开放报名')}
                        </div>
                    ) : null}

                    {isAdmin || (nonAdminType && planStatus == 1) ? (
                        <div
                            className={styles.editClass}
                            onClick={this.editClassHandle.bind(this)}
                            style={{
                                width: locale() === 'en' ? '55%' : '28%',
                                marginLeft: isAdmin ? 0 : '1%',
                            }}
                        >
                            <Icon type="edit" />
                            {trans('global.course information', '课程信息')}
                        </div>
                    ) : null}

                    {/* 20230215前权限控制 */}
                    {/* {data.groupPermission && (
                        <div className={styles.icon}>
                            {effecticveDisabled ? (
                                <Icon
                                    className={styles.i + ' ' + styles.disable}
                                    style={{ color: '#999' }}
                                    type="more"
                                />
                            ) : (
                                <Dropdown overlay={data.children}>
                                    <Icon className={styles.i} type="more" />
                                </Dropdown>
                            )}
                        </div>
                    )} */}

                    {/* 20230215后权限控制 */}
                    {isAdmin /* || (nonAdminType && planStatus == 1) */ ? ( //20240112拿掉非管理员权限
                        <div className={styles.icon} onClick={this.stopWindowOpen}>
                            <Dropdown overlay={data.children}>
                                <Icon className={styles.i} type="more" />
                            </Dropdown>
                        </div>
                    ) : null}
                </div>
                {data.courseGroupPlanOutputModels &&
                    data.courseGroupPlanOutputModels.length > 0 &&
                    data.courseGroupPlanOutputModels.map((item, index) => (
                        <div className={styles.ul} key={index}>
                            <div className={styles.title}>
                                {item.groupGroupingNumJsonDTO &&
                                item.groupGroupingNumJsonDTO.groupingName ? (
                                    <span
                                        style={{
                                            display: 'inline-block',
                                            width: '23%',
                                            lineHeight: '72px',
                                            textAlign: 'center',
                                        }}
                                    >
                                        {item.groupGroupingNumJsonDTO.groupingName}
                                    </span>
                                ) : null}
                                <span
                                    className={styles.name}
                                    style={{
                                        display: 'inline-block',
                                        alignSelf: 'center',
                                        width: '77%',
                                    }}
                                >
                                    <>
                                        <span>
                                            {locale() == 'en'
                                                ? item.studentGroupModel.ename
                                                : item.studentGroupModel.name}
                                        </span>
                                        <br />
                                        <span className={styles.suitgrade}>
                                            {this.sortArr(item.groupSuitGradeList)}
                                        </span>
                                    </>
                                </span>
                            </div>
                            <div className={styles.ename}>
                                {item.mainTeachers &&
                                    item.mainTeachers.length > 0 &&
                                    item.mainTeachers.map((el, i) => (
                                        <span key={i}>
                                            {' '}
                                            {el.name} {el.enName}{' '}
                                            {item.mainTeachers.length - 1 === i ? null : '、'}{' '}
                                        </span>
                                    ))}
                                &nbsp;
                                {item.assistTeachers &&
                                    item.assistTeachers.length > 0 &&
                                    item.assistTeachers.map((el, i) => (
                                        <span key={i}>
                                            {' '}
                                            {el.name} {el.enName}{' '}
                                            {item.assistTeachers.length - 1 === i ? null : '、'}{' '}
                                        </span>
                                    ))}
                            </div>
                            <div className={styles.select}>
                                <span className={styles.item} style={{ padding: '0 20px' }}>
                                    <span className={styles.num}>
                                        {item.minSignUpCount}-{item.maxSignUpCount}
                                    </span>
                                    {trans('tc.base.limit.report', '限报人数')}
                                </span>
                                <span className={styles.item} style={{ width: '22%' }}>
                                    <span
                                        className={styles.num}
                                        style={{
                                            color:
                                                item.actualSignUpCount <
                                                    item.studentGroupModel.minStudentCount ||
                                                item.actualSignUpCount >
                                                    item.studentGroupModel.maxStudentCount
                                                    ? 'red'
                                                    : 'black',
                                        }}
                                    >
                                        {item.actualSignUpCount}
                                    </span>
                                    {trans('course.basedetail.registered', '已报名')}
                                </span>
                                <span className={styles.item} style={{ width: '22%' }}>
                                    <span
                                        className={styles.num}
                                        style={{
                                            color:
                                                item.chooseCount <
                                                    item.studentGroupModel.minStudentCount ||
                                                item.chooseCount >
                                                    item.studentGroupModel.maxStudentCount
                                                    ? 'red'
                                                    : 'black',
                                        }}
                                    >
                                        {item.chooseCount}
                                    </span>
                                    {trans('course.basedetail.selected', '已选中')}
                                </span>
                            </div>
                            <div className={styles.time}>
                                <p>
                                    <span>{item.weekDayLesson}</span>
                                    <span style={{ margin: '0 7px' }}>{item.address}</span>
                                </p>
                                <p>
                                    <Icon type="hdd" className={styles.icon} />
                                    <span>
                                        {item.startTimeString} - {item.endTimeString}
                                    </span>
                                </p>
                            </div>
                            <div className={styles.site}>
                                {item.addressList ? (
                                    <span>
                                        {item.addressList.map((el, ind) => {
                                            return (
                                                <>
                                                    {locale() !== 'en' ? el.name : el.enName}
                                                    {item.addressList.length - 1 === ind
                                                        ? null
                                                        : '、'}
                                                </>
                                            );
                                        })}
                                    </span>
                                ) : (
                                    ''
                                )}
                                {item.rainyDayLocation ? (
                                    <span>({item.rainyDayLocation})</span>
                                ) : (
                                    ''
                                )}
                            </div>
                            {isAdmin || (nonAdminType && planStatus == 1) ? (
                                <div className={styles.detail}>
                                    <Icon
                                        className={styles.classDetail}
                                        type="user"
                                        onClick={() => this.avatrToDetail(data, item)}
                                    />
                                    {
                                        //20240112拿掉非管理员权限
                                        isAdmin && (
                                            <Icon
                                                className={styles.classDetail}
                                                type="edit"
                                                onClick={this.show.bind(this, item, index)}
                                            />
                                        )
                                    }

                                    {isAdmin && (
                                        <Icon
                                            className={styles.classDetail}
                                            onClick={this.del.bind(this, item, index)}
                                            type="delete"
                                        />
                                    )}
                                </div>
                            ) : null}
                        </div>
                    ))}
                <EditClassInfor
                    visibleEditClassInfor={visibleEditClassInfor}
                    self={this}
                    getTableList={this.props.getTableList}
                    courseSuitGradeList={this.props.courseSuitGradeList}
                    classId={classId}
                    groupId={groupId}
                    mainTeachers={mainTeachers}
                    groupSuitGradeList={groupSuitGradeList}
                    assistTeachers={assistTeachers}
                    minSignUpCount={minSignUpCount}
                    minAge={minAge}
                    maxAge={maxAge}
                    maxSignUpCount={maxSignUpCount}
                    groupGroupingNumJsonDTO={groupGroupingNumJsonDTO}
                    addressList={addressList}
                    rainyDayLocation={rainyDayLocation}
                    newCourseName={newCourseName}
                    newCourseEname={newCourseEname}
                    classTimeModels={classTimeModels}
                    callback={this.updateData}
                    areaList={areaList || []}
                    hideModal={this.hideClassInfor}
                    coursePlanId={coursePlanId}
                    chooseCoursePlanId={planId}
                    startTime={this.state.startTime}
                    endTime={this.state.endTime}
                    groupingList={this.props.groupingList}
                />

                <Modal
                    title={trans('course.basedetail.addNewClass', '增开新班级')}
                    visible={showAddClass}
                    onCancel={this.addCancel}
                    onOk={this.affirmAddClass}
                    destroyOnClose={true}
                    className={styles.addNewClass}
                    maskClosable={false}
                    style={{ top: window.self != window.top ? '60px' : '65px' }}
                >
                    <div className={styles.addModal}>
                        <div>
                            <span className={styles.classZnName}>
                                {trans('course.basedetail.add.ChineseName', '班级中文名')}
                                <i style={{ color: 'red' }}>*</i>
                            </span>{' '}
                            <Input
                                className={styles.chName}
                                onChange={this.chNameChange}
                                value={chClassName}
                                style={{ width: '300px' }}
                            ></Input>
                        </div>
                        <div>
                            <span
                                style={{
                                    display: 'inline-block',
                                    width: '140px',
                                    marginLeft: '-12px',
                                    textAlign: 'right',
                                }}
                            >
                                {trans('course.basedetail.add.EnglishName', '班级英文名')}
                                <i style={{ color: 'red' }}>*</i>
                            </span>{' '}
                            <Input
                                className={styles.enName}
                                onChange={this.enNameChange}
                                value={enClassName}
                                style={{ width: '300px', marginLeft: '18px' }}
                            ></Input>
                        </div>
                        <div className={styles.item} style={{ marginBottom: 0 }}>
                            <span
                                className={styles.title}
                                style={{
                                    display: 'inline-block',
                                    marginLeft: '28px',
                                    width: '100px',
                                    textAlign: 'right',
                                }}
                            >
                                {trans('course.plan.classNumber', '班级人数')}
                                <i style={{ color: 'red' }}>*</i>
                            </span>
                            <InputNumber
                                className={styles.num}
                                min={0}
                                placeholder={trans('global.placeholder', '请输入')}
                                value={minStudentCount}
                                step={1}
                                style={{ width: 70, marginLeft: '21px' }}
                                onChange={this.handleChange.bind(this, 'minStudentCount', false)}
                            />
                            <span className={styles.line}>-</span>
                            <InputNumber
                                className={styles.num}
                                min={0}
                                placeholder={trans('global.placeholder', '请输入')}
                                value={maxStudentCount}
                                step={1}
                                style={{ width: 70 }}
                                onChange={this.handleChange.bind(this, 'maxStudentCount', false)}
                            />
                            <span className={styles.text}>{trans('global.people', '人')}</span>
                        </div>
                        {chooseCourseDetails?.classDate &&
                        chooseCourseDetails.classDate.length > 0 ? (
                            <div
                                className={styles.item}
                                style={{ display: 'flex', marginBottom: 0 }}
                            >
                                <span
                                    className={styles.title}
                                    style={{
                                        display: 'inline-block',
                                        width: '66px',
                                        textAlign: 'right',
                                        marginLeft: '61px',
                                    }}
                                >
                                    {trans('course.plan.classTime', '上课时间')}
                                    {/* <i style={{ color: 'red' }}>*</i> */}
                                </span>
                                <div style={{ marginLeft: '4%' }}>
                                    {classTime &&
                                        classTime.map((item, index) => {
                                            return (
                                                <p
                                                    style={{
                                                        marginTop: '0',
                                                        marginBottom: '-10px',
                                                    }}
                                                    className={styles.classTime}
                                                >
                                                    <Select
                                                        style={{ width: '75px' }}
                                                        defaultValue={weekDayList && weekDayList[0]}
                                                        value={item.weekDay}
                                                        onChange={(value) =>
                                                            this.changeWeekDay(index, value)
                                                        }
                                                    >
                                                        {weekDayList &&
                                                            weekDayList.map((el, ind) => {
                                                                return (
                                                                    <Select.Option value={el}>
                                                                        {'周' +
                                                                            this.noToChinese(el)}
                                                                    </Select.Option>
                                                                );
                                                            })}
                                                    </Select>
                                                    <Select
                                                        style={{
                                                            width: '140px',
                                                            marginLeft: '20px',
                                                        }}
                                                        value={item.id}
                                                        onChange={(value) =>
                                                            this.changeClassData(index, value)
                                                        }
                                                    >
                                                        {peroidList &&
                                                            peroidList.map((el, ind) => {
                                                                return (
                                                                    <Select.Option value={el.id}>
                                                                        {el.startTime} -{' '}
                                                                        {el.endTime}
                                                                    </Select.Option>
                                                                );
                                                            })}
                                                    </Select>
                                                    <Icon
                                                        style={{ marginLeft: '10px' }}
                                                        type="delete"
                                                        onClick={() => this.delData(index)}
                                                    />
                                                </p>
                                            );
                                        })}
                                    <span style={{ color: 'blue' }} onClick={() => this.addData()}>
                                        <Icon type="plus-circle" />
                                        <span style={{ marginLeft: '8px' }}>
                                            {trans('course.plan.addPeriod', '添加时段')}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        ) : null}

                        {groupingList && groupingList.length > 0 ? (
                            <div
                                className={styles.item}
                                style={{ display: 'flex', height: '36px' }}
                            >
                                <span
                                    className={styles.title}
                                    style={{
                                        marginLeft: '15px',
                                        display: 'inline-block',
                                        textAlign: 'right',
                                        width: '115px',
                                        lineHeight: '36px',
                                    }}
                                >
                                    {trans('selCourse.packet', '所属分组')}
                                </span>
                                <Select
                                    placeholder="请选择"
                                    className={styles.selectGrade}
                                    value={this.state.groupValue}
                                    onChange={this.changeGroup}
                                    optionFilterProp="children"
                                    style={{ width: '300px' }}
                                >
                                    {groupingList.map((item, index) => (
                                        <Select.Option
                                            value={item.groupingKey}
                                            key={item.groupingKey}
                                        >
                                            {item.groupingName}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>
                        ) : null}

                        <div className={styles.item} style={{ display: 'flex', height: '36px' }}>
                            <span
                                className={styles.title}
                                style={{
                                    marginLeft: '15px',
                                    display: 'inline-block',
                                    textAlign: 'right',
                                    width: '115px',
                                    lineHeight: '36px',
                                }}
                            >
                                {trans('course.step1.selection.period', '开课周期')}
                                <i style={{ color: 'red' }}>*</i>
                            </span>
                            <RangePicker
                                value={[
                                    moment(this.state.startTime1, dateFormat),
                                    moment(this.state.endTime1, dateFormat),
                                ]}
                                className={`${styles.changePicker} ${styles.changePickerStep1}`}
                                onChange={this.handlePicker}
                                style={{ width: 300, marginLeft: 20 }}
                                format="YYYY-MM-DD"
                            />
                        </div>
                        <div className={styles.item} style={{ display: 'flex', height: '36px' }}>
                            <span
                                className={styles.title}
                                style={{
                                    marginLeft: '15px',
                                    display: 'inline-block',
                                    textAlign: 'right',
                                    width: '115px',
                                    lineHeight: '36px',
                                }}
                            >
                                {trans('student.applyGrade', '适用年级')}
                                <i style={{ color: 'red' }}>*</i>
                            </span>
                            <Select
                                placeholder={trans('student.pleaseApplyGrade', '请选择适用年级')}
                                className={styles.selectGrade}
                                onChange={this.handleChange.bind(this, 'suitGrade', false)}
                                value={suitGrade}
                                optionFilterProp="children"
                                style={{ width: '300px' }}
                                mode="multiple"
                            >
                                {courseSuitGradeList &&
                                    courseSuitGradeList.length > 0 &&
                                    courseSuitGradeList.map((item, index) => (
                                        <Select.Option value={item.id} key={item.id}>
                                            {' '}
                                            {locale() != 'en'
                                                ? item.name
                                                : item.ename || item.name}{' '}
                                        </Select.Option>
                                    ))}
                            </Select>
                        </div>
                        <div
                            className={styles.item}
                            style={{ marginBottom: '-3px', marginTop: '15px' }}
                        >
                            <span
                                className={styles.title}
                                style={{
                                    marginLeft: '26px',
                                    display: 'inline-block',
                                    width: '100px',
                                    textAlign: 'right',
                                }}
                            >
                                {trans('course.plan.suitableAge', '适用年龄')}
                            </span>
                            <InputNumber
                                className={styles.num}
                                min={0}
                                placeholder={trans('global.placeholder', '请输入')}
                                value={minAge}
                                step={1}
                                style={{ width: 70, marginLeft: '25px' }}
                                onChange={this.handleChange.bind(this, 'minAge', false)}
                            />
                            <span className={styles.line}>-</span>
                            <InputNumber
                                className={styles.num}
                                min={0}
                                placeholder={trans('global.placeholder', '请输入')}
                                value={maxAge}
                                step={1}
                                style={{ width: 70 }}
                                onChange={this.handleChange.bind(this, 'maxAge', false)}
                            />
                            <span className={styles.text}>{trans('global.age', '岁')}</span>
                        </div>
                        <Form>
                            <div className={styles.minTeacherForm}>
                                <span
                                    className={styles.label}
                                    style={{
                                        display: 'inline-block',
                                        width: '100px',
                                        textAlign: 'right',
                                        marginLeft: '32px',
                                    }}
                                >
                                    {trans('course.basedetail.add.minTeacher', '主教教师')}
                                    <i style={{ color: 'red' }}>*</i>
                                </span>
                                <Form.Item
                                    // label = '主教教师'
                                    className={styles.mainTeacher}
                                    style={{ marginLeft: '3px' }}
                                >
                                    {getFieldDecorator('mainTeachers', {
                                        rules: [{ required: true, message: ' ' }],
                                    })(<TreeSelect {...mainTeacherListProps}></TreeSelect>)}
                                </Form.Item>
                            </div>
                            <div className={styles.minTeacherForm}>
                                <span
                                    className={styles.assistLabel}
                                    style={{
                                        display: 'inline-block',
                                        width: '117px',
                                        textAlign: 'right',
                                        marginLeft: '7px',
                                    }}
                                >
                                    {trans('course.basedetail.add.assistTeacher', '协同教师')}
                                </span>
                                <Form.Item
                                    // label = '协同教师'
                                    className={styles.assistTeacher}
                                    style={{ marginLeft: '7px' }}
                                >
                                    {getFieldDecorator(
                                        'assistTeachers',
                                        {}
                                    )(<TreeSelect {...assistTeacherListProps}></TreeSelect>)}
                                </Form.Item>
                            </div>
                        </Form>
                        <div
                            className={`${styles.item} ${styles.searchAddress}`}
                            style={{ marginBottom: '1px' }}
                        >
                            <span
                                style={{
                                    marginLeft: locale() == 'en' ? '64px' : '84px',
                                    marginRight: '26px',
                                    position: 'relative',
                                    top: '0',
                                }}
                                className={`${styles.title} ${styles.address}`}
                            >
                                {trans('course.basedetail.add.place', '地点')}
                            </span>
                            <Select
                                placeholder={trans('tc.base.search.select.site', '搜索选择地点')}
                                mode="multiple"
                                className={styles.select}
                                onChange={this.handleChange.bind(this, 'siteValue', false)}
                                value={siteValue}
                                optionFilterProp="children"
                                // style={{ width: '69%' }}
                                style={{
                                    width: '300px',
                                    marginLeft: locale() == 'en' ? '4px' : '11px',
                                }}
                            >
                                {areaList &&
                                    areaList.length > 0 &&
                                    areaList.map((item, index) => (
                                        <Select.Option value={item.id} key={item.id}>
                                            {' '}
                                            {locale() != 'en'
                                                ? item.name
                                                : item.ename || item.name}{' '}
                                        </Select.Option>
                                    ))}
                            </Select>
                        </div>
                        <div
                            className={`${styles.item} ${styles.rainDaySite}`}
                            style={{ marginBottom: '-12px', marginTop: '-5px' }}
                        >
                            <span
                                style={{
                                    // marginLeft: '10px',
                                    display: 'inline-block',
                                    width: '127px',
                                    textAlign: 'right',
                                }}
                                className={styles.title}
                            >
                                {trans('course.plan.rainyLocation', '雨天地点')}
                            </span>
                            <Input
                                placeholder={trans('global.rainyLocation', '填写雨天地点')}
                                style={{
                                    width: '300px',
                                    borderRadius: '8px !important',
                                    marginLeft: locale() ? '20px' : '24px',
                                }}
                                onChange={this.changeRainSite}
                                value={rainSite}
                            ></Input>
                        </div>
                    </div>
                </Modal>

                {visibleEditCourseInfor && (
                    <EditCourseInfor
                        visibleEditCourseInfor={visibleEditCourseInfor}
                        self={this}
                        layoutStyle={this.props.layoutStyle}
                        getTableList={this.getTableList}
                        coursePlanId={coursePlanId}
                        hideModal={this.hideModal}
                        chooseCourseDetails={this.props.chooseCourseDetails}
                    />
                )}
            </div>
        );
    }
}

export default CourseListHeader;
