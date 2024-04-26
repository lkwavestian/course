//课表主体
//已发布的版本 不允许单个锁定和批量锁定
import React, { PureComponent, Component } from 'react';
import { connect } from 'dva';
import {
    Button,
    Row,
    Col,
    Icon,
    Modal,
    message,
    Spin,
    Radio,
    Popover,
    Checkbox,
    Dropdown,
    Menu,
    Select,
    TreeSelect,
} from 'antd';
import styles from './table.less';
import icon from '../../../icon.less';
import {
    fixedZero,
    getCourseColor,
    formatUsualTime,
    intoNumber,
    intoChinese,
    formatTimeSafari,
} from '../../../utils/utils';
import EditFreedomCourse from './FreedomCourse/edit';
import CustomCourse from './CustomCourse/index';
import PopoverContent from './CustomCourse/popoverContent';
import { trans, locale } from '../../../utils/i18n';
import { SearchTeacher } from '@yungu-fed/yungu-selector';
import { PlusOutlined } from '@ant-design/icons';
import emptySchedule from '../../../assets/empty.png';
import moment from 'moment';
import { isEqual } from 'lodash';

const { confirm } = Modal;
const { Option } = Select;

const week = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const weekCopy = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

const options = [
    { label: '教师', value: 'employee' },
    { label: '学生', value: 'student' },
    { label: '家长', value: 'parent' },
];

const CheckboxGroup = Checkbox.Group;

let lookDetailTimeOut = null;

// @Form.create()
@connect((state) => ({
    courseDetail: state.timeTable.courseDetail,
    freeCourseDetail: state.timeTable.freeCourseDetail,
    lastPublicContent: state.timeTable.lastPublicContent,
    accountCourseNum: state.timeTable.accountCourseNum, //删除多次操作涉及到的课程数量
    getPublishResultList: state.course.publishResult,
    teacherList: state.course.teacherList,
    areaList: state.timeTable.areaList,
    gradeList: state.timeTable.customGradeList,
    groupList: state.timeTable.customGroupList,
    customStudentList: state.timeTable.customStudentList,
    fetchTeacherAndOrg: state.global.fetchTeacherAndOrg, //组织和人员列表，栾碧霞测试专用接口
    tableWidthRatio: state.timeTable.tableWidthRatio, //表格宽度比例指数
    tableHeightRatio: state.timeTable.tableHeightRatio, //表格宽度比例指数
    displayType: state.timeTable.displayType,
    //新增
    scheduleData: state.timeTable.scheduleData,
    gradeByTypeArr: state.timeTable.gradeByTypeArr, //学生组件优化
    //语言
    currentLang: state.global.currentLang,
}))
export default class ScheduleTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDetailModal: false,
            tableCardUtil: {},
            tableStudentGroupId: '', //学生组id
            saveWeekLockStatus: {}, //周几的小锁们
            isNewVersion: false,

            showEditCourse: false, //系统排课编辑弹窗
            editFreeType: null,
            resultType: undefined,
            showEditFreedomCourse: false, //自由排课的编辑弹窗
            saveWeekDeleteStatus: {}, //周几的小垃圾桶们
            ifpublish: undefined,
            personnel: undefined,
            publish: false,
            deleteThis: false,
            requiredField: true,
            searchIndex: 0, //视图类型： 0班级 1年级 2学生 3教师 4场地
            searchList:
                locale() === 'en'
                    ? ['Class', 'Grade', 'Student', 'Teacher', 'Address', 'Custom']
                    : ['班级', '年级', '学生', '教师', '场地', '自定义'],
            isDouble: false, // 是否双击
            dropDownVisible: false, // 资源筛选显隐
            isCustom: false, // 是否自定义视角
            searchlabel: '', // 资源筛选回显值
            studentViewGrade: undefined, // 学生视角年级value
            studentViewGroup: undefined, // 学生视角班级value
            studentViewStudent: undefined, // 学生视角学生value
            loading: false, // popover loading效果
            exchangeTableData: [],

            teacherViewOrg: undefined, // 教师视角部门value
            teacherViewTeachers: undefined, // 教师视角搜索个人value
            teacherViewOrgDisabled: false,
            teacherViewTeachersDisabled: false,
            copyDayVisible: false,
            copyWeekDay: '',
            copySourceDay: null,
            copyLoading: false,

            customVisible: false, // 自定义筛选框显示状态
            plusStyle: false, // 小加号的显隐
            groupId: '', // 点击行的班级id
            isShowDelete: false, // 是否回显删除图标
            time: '',
            scheduleTeacherIdList: [], // 教师课表的教授id
            scheduleStudentIdList: [], // 学生课表的学生ID
            noRuleId: '', // 点击的教师不规则排课的id
            noRuleVisible: false,
            // isShowCheckGroup:false,//是否回显多选列表
            // checkedList: defaultCheckedList,
            indeterminate: true,
            checkAll: false,
            // showWillChoice:false,//未选择
            plainOptions: [], //课节名称
            selectTeacherModalVisible: false,
            userIds: [],
            orgIds: [],
            selectTeacherValue: [],

            isUpdateArr: [],
        };

        this.tableDisableClick = false; // 防止双击多次点击
        this.tableLoading = false;
    }

    shouldComponentUpdate(nextProps, prevState) {
        if (this.judgePropsRender(nextProps) && isEqual(prevState, this.state)) {
            return false;
        } else {
            return true;
        }
    }

    judgePropsRender = (nextProps) => {
        let arr = [
            //父子组件
            'deleteLoading',
            'loadingMsg',
            'weekTitle',
            'studentGroupIdList',
            'currentDate',
            'showWillDelete',
            'showWillChoice',
            'showWillWaitingListChoice',
            'showWillCopy',
            'showWillStrike',
            'showWillLock',
            'currentVersion',
            'lastPublish',
            'selectStudent',
            'saveActiveClassId',
            'saveAddressResult',
            'saveTeacherResult',
            'isHigh',
            'willCardLight',
            'showLoading',
            'startTimeOfDay',
            'endTimeOfDay',

            //Modal传递
            'courseDetail',
            'freeCourseDetail',
            'lastPublicContent',
            'accountCourseNum',
            'getPublishResultList',

            //接口加载
            // 'teacherList',
            // 'areaList',
            // 'gradeList',
            // 'fetchTeacherAndOrg',
            'customGradeList',
            'customGroupList',
            'customStudentList',
            'tableWidthRatio',
            'tableHeightRatio',
            'displayType',
            'scheduleData',
            'gradeByTypeArr',
            //批量操作影响
            'plainOptionsWeek',
            'checkChoiceAll',
            'checkedList',

            //后来加
            'isFull',
        ];
        if (arr.find((item) => !isEqual(nextProps[item], this.props[item]))) {
            return false;
        } else {
            return true;
        }
    };

    calculationWeekDate(time) {
        let date = new Date(time || ''),
            day = date.getDay(),
            newWeekArr = [];
        day == 0 && (day = 7);
        week.map((item, index) => {
            let elDate = new Date(time + 24 * 3600 * 1000 * (index + 1 - day));
            newWeekArr.push(
                item + ' ' + fixedZero(elDate.getMonth() + 1) + '-' + fixedZero(elDate.getDate())
            );
        });
        return newWeekArr;
    }

    //计算日期
    calculationDate(time) {
        let date = new Date(time || ''),
            year = date.getFullYear(),
            day = date.getDay(),
            newWeekArr = [];
        day == 0 && (day = 7);
        week.map((item, index) => {
            let elDate = new Date(time + 24 * 3600 * 1000 * (index + 1 - day));
            newWeekArr.push(
                year + '/' + fixedZero(elDate.getMonth() + 1) + '/' + fixedZero(elDate.getDate())
            );
        });
        return newWeekArr;
    }

    swapWeekDayToEn = (item) => {
        if (item.includes('周一')) {
            return item.replace('周一', 'Mon');
        }
        if (item.includes('周二')) {
            return item.replace('周二', 'Tue');
        }
        if (item.includes('周三')) {
            return item.replace('周三', 'Wen');
        }
        if (item.includes('周四')) {
            return item.replace('周四', 'Thu');
        }
        if (item.includes('周五')) {
            return item.replace('周五', 'Fri');
        }
        if (item.includes('周六')) {
            return item.replace('周六', 'Sat');
        }
        if (item.includes('周日')) {
            return item.replace('周日', 'Sun');
        }
    };

    //渲染周几
    renderWeek = (weekTitle, weekDate) => {
        const {
            currentDate,
            showWillLock,
            showWillDelete,
            showWillChoice,
            showWillWaitingListChoice,
            showWillCopy,
            showWillStrike,
            currentLang,
        } = this.props;
        const { saveWeekDeleteStatus, plainOptions } = this.state;
        let currentDay = new Date(formatTimeSafari(currentDate)).getDay();
        const choice = (
            <div className={styles.CheckboxGroup}>
                <Checkbox
                    onChange={this.props.onChoiceAllLessonChange}
                    checked={this.props.checkChoiceAll}
                >
                    {trans('global.choiceAll', '全选')}
                </Checkbox>
                <CheckboxGroup
                    className={styles.Checkbox_Group}
                    options={this.props.plainOptionsWeek}
                    value={this.props.checkedList}
                    onChange={this.props.onChoiceLessonChange}
                />
            </div>
        );
        return weekTitle.map((item, index) => {
            let colClass =
                currentDay == index + 1
                    ? styles.weekLine + ' ' + styles.weekLineActive
                    : styles.weekLine;
            let deleteCol =
                showWillDelete && saveWeekDeleteStatus[index] == true
                    ? styles.activeDeleteCol
                    : styles.noDeleteCol;

            return (
                <Col className={colClass + ' ' + deleteCol} key={index}>
                    {showWillChoice && (
                        <Popover
                            content={choice}
                            placement="bottom"
                            trigger="click"
                            onClick={() => this.props.getLessonListByWeekday(index)}
                        >
                            <div className={styles.chooseAll}>
                                <Icon
                                    className={icon.iconfont + ' ' + styles.lockStyle}
                                    type="check-square"
                                />
                            </div>
                        </Popover>
                    )}
                    {showWillWaitingListChoice && (
                        <Popover
                            content={choice}
                            placement="bottom"
                            trigger="click"
                            onClick={() => this.props.getLessonListByWeekday(index)}
                        >
                            <div className={styles.chooseAll}>
                                <Icon
                                    className={icon.iconfont + ' ' + styles.lockStyle}
                                    type="check-square"
                                />
                            </div>
                        </Popover>
                    )}
                    {showWillStrike && (
                        <Popover
                            content={choice}
                            placement="bottom"
                            trigger="click"
                            onClick={() => this.props.getLessonListByWeekday(index)}
                        >
                            <div className={styles.chooseAll}>
                                <Icon
                                    className={icon.iconfont + ' ' + styles.lockStyle}
                                    type="check-square"
                                />
                            </div>
                        </Popover>
                    )}
                    {showWillCopy && (
                        <Popover
                            content={choice}
                            placement="bottom"
                            trigger="click"
                            onClick={() => this.props.getLessonListByWeekday(index)}
                        >
                            <div className={styles.chooseAll}>
                                <Icon
                                    className={icon.iconfont + ' ' + styles.lockStyle}
                                    type="copy"
                                />
                            </div>
                        </Popover>
                    )}

                    {showWillLock && (
                        <Popover
                            content={choice}
                            placement="bottom"
                            trigger="click"
                            onClick={() => this.props.getLessonListByWeekday(index)}
                        >
                            <div className={styles.chooseAll}>
                                <i className={icon.iconfont + ' ' + styles.lockStyle}>&#xe747;</i>
                            </div>
                        </Popover>
                    )}
                    {showWillDelete &&
                        (saveWeekDeleteStatus[index] ? (
                            <i
                                className={icon.iconfont + ' ' + styles.selectDelete}
                                onClick={this.unDeleteAllDay.bind(this, weekDate[index])}
                                key="unDeleteAllDay"
                            >
                                &#xe739;
                            </i>
                        ) : (
                            <i
                                className={icon.iconfont + ' ' + styles.cancelSelect}
                                onClick={this.deleteAllDay.bind(this, weekDate[index], index)}
                                key="deleteAllDay"
                            >
                                &#xe739;
                            </i>
                        ))}
                    {currentLang === 'en' ? this.swapWeekDayToEn(item) : item}
                    {/* {item} */}
                    <span className={styles.copyWeekCol} key="copyWeekCol">
                        <i className={icon.iconfont} onClick={this.copyWeekCol.bind(this, item)}>
                            &#xe625;
                        </i>
                    </span>
                </Col>
            );
        });
    };

    //渲染时间盒子
    renderTimeCol = (weekTitle) => {
        const { showWillDelete } = this.props;
        const { saveWeekDeleteStatus } = this.state;
        return weekTitle.map((item, index) => {
            let deleteCol =
                showWillDelete && saveWeekDeleteStatus[index] == true
                    ? styles.deleteWeekCol
                    : styles.noDeleteWeekCol;
            return (
                <Col className={styles.timeLine + ' ' + deleteCol} key={index}>
                    <div key="start">{this.renderTimeDiv('start')}</div>
                </Col>
            );
        });
    };

    //渲染盒子中的时间段
    renderTimeDiv = (type) => {
        const { timeLine } = this.props;
        return timeLine.map((el, order) => {
            if (type == 'start') {
                return <span key={order}>{el.start}</span>;
            }
        });
    };

    componentDidMount() {
        // this.getGradeList()
        let activeList = document.querySelector('#activeClassList');
        if (activeList) {
            activeList.scrollIntoView();
        }

        let { onRef } = this.props;
        typeof onRef === 'function' && onRef(this);
    }

    componentWillReceiveProps(nextProps) {
        if (
            this.props.showWillDelete != nextProps.showWillDelete &&
            nextProps.showWillDelete == false
        ) {
            this.setState({
                saveWeekDeleteStatus: {},
            });
        }
    }

    //处理班级优化数量
    handleTimeUsing = (arr, sum, type) => {
        if (!arr || arr.length <= 0) {
            return type == 'use' ? '实际参与排课：暂无统计~' : '作息表可用：暂无统计~';
        }
        let resultStr = type == 'use' ? '实际参与排课：' : '作息表可用：';
        let resultArr = [];
        arr.map((item) => {
            let str = item.timeCost + 'min：' + item.duration;
            resultArr.push(str);
        });
        return resultStr + resultArr.join('，') + ' 共计：' + sum;
    };

    //处理场地查询数据
    handleAddress = (address) => {
        if (!address || address.length == 0) return [];
        let resultArr = [];
        address.map((item) => {
            let obj = {
                studentGroup: {
                    id: item.playgroundId,
                    name: item.playgroundName,
                },
                resultList: this.handleAddressResultList(item.resultList),
            };
            resultArr.push(obj);
        });
        return resultArr;
    };

    //处理教师查询数据
    handleTeacher = (teacher) => {
        if (!teacher || teacher.length == 0) return [];
        let resultArr = [];
        teacher.map((item) => {
            let obj = {
                studentGroup: {
                    id: item.teacherId,
                    name: item.teacherName,
                },
                resultList: this.handleAddressResultList(item.resultList),
            };
            resultArr.push(obj);
        });
        return resultArr;
    };

    // 恢复请求数据
    recoverData = () => {
        let { fetchScheduleList, fetchCourseList, self } = this.props;
        typeof fetchScheduleList === 'function' && fetchScheduleList.call(self);
        typeof fetchCourseList === 'function' && fetchCourseList.call(self);
    };

    //处理 场地或教师 结果中的时间
    handleAddressResultList = (arr) => {
        if (!arr || arr.length < 0) return [];
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr[i].length; j++) {
                if (arr[i] && arr[i][j]) {
                    arr[i][j]['startTime'] = arr[i][j]['startTimeString'];
                    arr[i][j]['endTime'] = arr[i][j]['endTimeString'];
                    arr[i][j]['freeResultId'] = arr[i][j]['id'];
                }
            }
        }
        return arr;
    };

    showDelete = () => {
        this.setState({
            isShowDelete: true,
        });
    };

    // 删除自定义中某一条
    closeCustom = (item) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'timeTable/deleteCustom',
            payload: {
                deleteItem: item.studentGroup.id,
            },
        });
    };

    handleCustomVisibleChange = (visible) => {
        this.setState({ customVisible: visible });
    };

    plusHandle(groupId) {
        this.props.getCustomStudentList();
        this.setState({
            plusStyle: true,
            groupId,
        });
    }
    closePlus = () => {
        this.setState({
            plusStyle: false,
            groupId: '',
        });
    };

    //渲染课程表行
    renderClassRow = () => {
        //需要取数据
        const { isCustom, customVisible, plusStyle, groupId, isShowDelete, isUpdateArr } =
            this.state;
        const {
            scheduleData,
            showWillLock,
            selectStudent,
            saveActiveClassId,
            saveAddressResult,
            saveTeacherResult,
            isHigh,
            groupList,
            gradeList,
            teacherList,
            areaList,
            customStudentList,
            getCustomResult,
            currentVersion,
            showWillChoice,
            showWillWaitingListChoice,
            showWillStrike,
            showWillCopy,
            studentGroupIdList,
            tableHeightRatio,
            currentLang,
        } = this.props;
        let formatAddress =
            saveAddressResult.length > 0
                ? this.handleAddress(saveAddressResult)
                : this.handleTeacher(saveTeacherResult);
        const scheduleDataCopy = scheduleData ? JSON.parse(JSON.stringify(scheduleData)) : [];
        let concatResult = scheduleDataCopy.concat(formatAddress) || [];
        return concatResult && concatResult.length > 0 ? (
            concatResult.map((item, index) => {
                let classActive =
                    saveActiveClassId == item.studentGroup.id
                        ? styles.activeClassList
                        : styles.classList;
                // let styleActive =  { padding: "30px 3px" }
                let idName = saveActiveClassId == item.studentGroup.id ? 'activeClassList' : '';
                let custom = isCustom && item.studentGroup.isCustomBtn && styles.custom;

                const isView =
                    item.studentGroup.view == 'teacher' ||
                    item.studentGroup.view == 'address' ||
                    item.studentGroup.view == 'group';
                let highStyle =
                    (isHigh && !isView) || item.studentGroup.view == 'grade'
                        ? item.studentGroup.view == 'student' || isView
                            ? styles.defaultContent
                            : styles.itemContent
                        : styles.defaultContent;
                let plusClass = plusStyle && groupId == item.studentGroup.id ? styles.block : '';
                return (
                    <div
                        key={item.studentGroup.id ? item.studentGroup.id : index}
                        className={highStyle}
                        style={{
                            height:
                                (isHigh && !isView) || item.studentGroup.view == 'grade'
                                    ? item.studentGroup.view == 'student' || isView
                                        ? `${10 * tableHeightRatio}vh`
                                        : `${40 * tableHeightRatio}vh`
                                    : `${10 * tableHeightRatio}vh`,
                        }}
                    >
                        <div className={classActive + '  ' + custom} id={idName}>
                            {((isCustom && !item.studentGroup.isCustomBtn) ||
                                item.studentGroup.canClose) && (
                                <span
                                    className={styles.closeCustom}
                                    onClick={this.closeCustom.bind(this, item)}
                                >
                                    {<i className={icon.iconfont}>&#xe743;</i>}
                                </span>
                            )}
                            {isCustom && item.studentGroup.isCustomBtn ? (
                                <CustomCourse
                                    teacherList={teacherList}
                                    areaList={areaList}
                                    gradeList={gradeList}
                                    groupList={groupList}
                                    customStudentList={customStudentList}
                                    getCustomResult={getCustomResult}
                                    gradeByTypeArr={this.props.gradeByTypeArr}
                                    onRef={(ref) => {
                                        this.childCustom = ref;
                                    }}
                                />
                            ) : (
                                <span>
                                    {/* {item.studentGroup && item.studentGroup.name} */}
                                    {item.studentGroup && currentLang !== 'en'
                                        ? item.studentGroup.name
                                        : item.studentGroup.ename}
                                </span>
                            )}
                            {showWillLock && (
                                <a>
                                    {item.studentGroup.allLock === true ? (
                                        <i
                                            className={
                                                icon.iconfont + ' ' + styles.unLockClassStyle
                                            }
                                            onClick={this.unLockAllClass.bind(
                                                this,
                                                item.studentGroup.id
                                            )}
                                        >
                                            &#xe744;
                                        </i>
                                    ) : (
                                        <i
                                            className={icon.iconfont + ' ' + styles.lockClassStyle}
                                            onClick={this.lockAllClass.bind(
                                                this,
                                                item.studentGroup.id
                                            )}
                                        >
                                            &#xe747;
                                        </i>
                                    )}
                                </a>
                            )}
                            {showWillWaitingListChoice && (
                                <div className={styles.chooseAll}>
                                    {
                                        // <i className={icon.iconfont + " " + styles.unLockClassStyle} onClick={this.unLockAllClass.bind(this, item.studentGroup.id)}>&#xe744;</i>
                                        // item.studentGroup.allLock === false ? (
                                        <Checkbox
                                            className={styles.Checkbox_Group}
                                            checked={studentGroupIdList.includes(
                                                item.studentGroup.id
                                            )}
                                            onChange={this.props.onChangeWaitingListChoice}
                                            id={item.studentGroup.id}
                                        />
                                        // ) : null
                                        // <i className={icon.iconfont + " " + styles.lockClassStyle} onClick={this.lockAllClass.bind(this, item.studentGroup.id)}>&#xe747;</i>
                                        // <Checkbox className={styles.Checkbox_Group} onChange={this.props.onChange} id={item.studentGroup.id}/>
                                    }
                                </div>
                            )}
                            {showWillStrike && (
                                <div className={styles.chooseAll}>
                                    {
                                        // <i className={icon.iconfont + " " + styles.unLockClassStyle} onClick={this.unLockAllClass.bind(this, item.studentGroup.id)}>&#xe744;</i>
                                        <Checkbox
                                            className={styles.Checkbox_Group}
                                            checked={studentGroupIdList.includes(
                                                item.studentGroup.id
                                            )}
                                            onChange={this.props.onChangeStrike}
                                            id={item.studentGroup.id}
                                        />
                                        // <i className={icon.iconfont + " " + styles.lockClassStyle} onClick={this.lockAllClass.bind(this, item.studentGroup.id)}>&#xe747;</i>
                                        // <Checkbox className={styles.Checkbox_Group} onChange={this.props.onChange} id={item.studentGroup.id}/>
                                    }
                                </div>
                            )}
                            {!isCustom &&
                                !showWillLock &&
                                selectStudent &&
                                selectStudent.length == 0 &&
                                item.studentGroup.view === 'group' && (
                                    <span className={styles.lockIconList}>
                                        <i
                                            className={icon.iconfont + ' ' + styles.lock}
                                            onClick={() =>
                                                this.showLockOrUnLockConfirm(
                                                    'lock',
                                                    item.studentGroup
                                                )
                                            }
                                        >
                                            &#xe744;
                                        </i>
                                        <i
                                            className={icon.iconfont + ' ' + styles.unLock}
                                            onClick={() =>
                                                this.showLockOrUnLockConfirm(
                                                    'unLock',
                                                    item.studentGroup
                                                )
                                            }
                                        >
                                            &#xe747;
                                        </i>
                                    </span>
                                )}
                            {item.studentGroup.view !== 'group' && (
                                <span>
                                    {isUpdateArr[index] ? (
                                        <Icon type="loading" />
                                    ) : (
                                        <i
                                            className={icon.iconfont}
                                            onClick={() => this.handleStudentViewClick(item, index)}
                                        >
                                            &#xe732;
                                        </i>
                                    )}
                                </span>
                            )}
                        </div>
                        <Popover
                            placement="right"
                            title={null}
                            content={
                                <PopoverContent
                                    teacherList={teacherList}
                                    areaList={areaList}
                                    gradeList={gradeList}
                                    groupList={groupList}
                                    customStudentList={customStudentList}
                                    getCustomResult={getCustomResult}
                                    closePlus={this.closePlus}
                                    type="fromClass"
                                    rowValue={item}
                                    currentVersion={this.props.currentVersion}
                                    scheduleData={this.props.scheduleData}
                                    saveCustomValue={this.props.saveCustomValue}
                                    showDelete={this.showDelete}
                                    gradeByTypeArr={this.props.gradeByTypeArr}
                                ></PopoverContent>
                            }
                            trigger="click"
                            visible={item.studentGroup.id == groupId}
                            // onVisibleChange={this.plusHandle.bind(this,item.studentGroup.id)}
                        >
                            <i
                                className={icon.iconfont + ' ' + styles.plus + ' ' + plusClass}
                                key={item.studentGroup.id}
                                onClick={this.plusHandle.bind(this, item.studentGroup.id)}
                            >
                                &#xe758;
                            </i>
                        </Popover>
                        <div className={styles.scheduleList}>
                            <Row className={styles.scheduleDetail} key={item.studentGroup.id}>
                                {this.renderScheduleList(
                                    item.resultList,
                                    item.studentGroup,
                                    item.studentGroup.view,
                                    index
                                )}
                            </Row>
                        </div>
                    </div>
                );
            })
        ) : (
            <div className={styles.noScheduleData}>该年级下暂无班级展示</div>
        );
    };
    //渲染课程表行的内容
    renderScheduleList = (list, studentGroup, view, listIndex) => {
        const {
            showWillLock,
            showWillDelete,
            willCardLight,
            isHigh,
            timeLine,
            showWillChoice,
            showWillWaitingListChoice,
            showWillStrike,
            showWillCopy,
            tableWidthRatio,
            displayType,
        } = this.props;
        const { saveWeekDeleteStatus, tableCardUtil, isDouble, tableStudentGroupId } = this.state;
        // 非班级年级不允许操作
        const isEvent = view == 'teacher' || view == 'address' || view == 'student';

        return (
            list &&
            list.length > 0 &&
            list.map((item, index) => {
                //处理每周几的数据
                let itemArr = this.formatScheduleItem(item);
                let scheduleColDelete =
                    showWillDelete && saveWeekDeleteStatus[index] == true
                        ? styles.deleteScheduleCol
                        : styles.noDeleteScheduleCol;
                return (
                    <Col key={studentGroup.id + index} className={scheduleColDelete}>
                        <div className={styles.courseBox}>
                            {itemArr &&
                                itemArr.length > 0 &&
                                itemArr.map((el, order) => {
                                    return (
                                        el &&
                                        el.length > 0 &&
                                        el.map((util, num) => {
                                            if (util.freeResultId === 23835) {
                                                console.log('CP Physics II_paper test');
                                            }
                                            let backColor =
                                                tableCardUtil.resultId == util.resultId &&
                                                studentGroup.id == tableStudentGroupId &&
                                                isDouble
                                                    ? '#1476FF'
                                                    : !util.freeResultId && !util.resultId
                                                    ? getCourseColor('作息', 2)
                                                    : (util.type == 2 && !util.resultId) ||
                                                      util.freeType == 2
                                                    ? getCourseColor('活动', 2)
                                                    : getCourseColor(util.name, 2);
                                            // console.log('backColor', backColor);
                                            let fontColor =
                                                tableCardUtil.id == util.id && isDouble
                                                    ? '#999'
                                                    : !util.freeResultId && !util.resultId
                                                    ? getCourseColor('作息', 1)
                                                    : (util.type == 2 && !util.resultId) ||
                                                      util.freeType == 2
                                                    ? getCourseColor('活动', 1)
                                                    : getCourseColor(util.name, 1);
                                            let zIndexValue =
                                                !util.freeResultId && !util.resultId
                                                    ? 3
                                                    : (util.type == 2 && !util.resultId) ||
                                                      util.freeType == 2
                                                    ? 4
                                                    : 9; //课程表的层级关系
                                            let reg = new RegExp('^[a-zA-Z]');
                                            let borderColor =
                                                util.resultId &&
                                                tableCardUtil.resultId &&
                                                tableCardUtil.resultId == util.resultId &&
                                                studentGroup.id == tableStudentGroupId &&
                                                !willCardLight &&
                                                !isDouble
                                                    ? (util.type == 0
                                                          ? getCourseColor('作息', 1)
                                                          : (util.type == 2 && !util.resultId) ||
                                                            util.freeType == 2
                                                          ? getCourseColor('活动', 1)
                                                          : getCourseColor(util.name, 1)) ||
                                                      '#3798ff'
                                                    : '';

                                            let teacherBkg =
                                                util.scheduleFlag === false ? styles.notRule : ''; // 当前版本多个作息，课节地板不展示规则不显示；
                                            let addClassName =
                                                view == 'teacher' ||
                                                view == 'address' ||
                                                isHigh ||
                                                view == 'grade'
                                                    ? styles.scheduleCard
                                                    : styles.scheduleCardNoClass;
                                            let displayTypeItem = util.acId ? 4 : util.freeType;
                                            return (
                                                <Popover
                                                    onVisibleChange={this.topHandleVisibleChange.bind(
                                                        this,
                                                        util
                                                    )}
                                                    content={this.renderMessageHtml(util)}
                                                    visible={
                                                        util.scheduleFlag === false &&
                                                        this.state[`noRuleVisible${util.id}`]
                                                    }
                                                    placement="right"
                                                    trigger="click"
                                                    overlayStyle={{
                                                        width: '300px',
                                                    }}
                                                    overlayClassName="ruleMessage"
                                                    key={
                                                        util.freeResultId +
                                                        util.id +
                                                        util.lesson +
                                                        util.weekDay +
                                                        studentGroup.id +
                                                        num
                                                    }
                                                >
                                                    <div
                                                        id={`data-${studentGroup.id}-${el[0].lesson}-${el[0].weekDay}`}
                                                        data-acid={util.acId ? util.acId : ''}
                                                        data-studentgroupid={studentGroup.id}
                                                        className={addClassName + '  ' + teacherBkg}
                                                        onClick={this.lookDetail.bind(
                                                            this,
                                                            util,
                                                            studentGroup
                                                        )}
                                                        style={{
                                                            display:
                                                                displayType.includes(
                                                                    displayTypeItem
                                                                ) || !displayTypeItem
                                                                    ? 'block'
                                                                    : 'none',
                                                            width:
                                                                this.computedWidth(
                                                                    util.detail &&
                                                                        util.acDuration === 1
                                                                        ? util.detail.startTime
                                                                        : util.startTime,
                                                                    util.detail &&
                                                                        util.acDuration === 1
                                                                        ? util.detail.endTime
                                                                        : util.endTime
                                                                ) + '%',
                                                            height: (1 / el.length) * 100 + '%',
                                                            top:
                                                                el.length == 1
                                                                    ? 0
                                                                    : (1 / el.length) * num * 100 +
                                                                      '%',
                                                            left:
                                                                (this.computedLeft(
                                                                    util.startTime,
                                                                    util.endTime
                                                                ) /
                                                                    ((timeLine.length - 1) * 60)) *
                                                                    100 +
                                                                '%',
                                                            background: backColor,
                                                            color: fontColor,
                                                            opacity:
                                                                util.ifLock && util.ifChoice
                                                                    ? 1
                                                                    : // : showWillLock ||
                                                                    //   showWillChoice ||
                                                                    //   showWillWaitingListChoice ||
                                                                    //   (showWillStrike
                                                                    //      && !util.ifLock)
                                                                    (showWillCopy &&
                                                                          !util.ifChoice) ||
                                                                      (showWillChoice &&
                                                                          !util.ifChoice) ||
                                                                      (showWillWaitingListChoice &&
                                                                          !util.ifChoice) ||
                                                                      (showWillStrike &&
                                                                          !util.ifChoice) ||
                                                                      (showWillLock && !util.ifLock)
                                                                    ? //   )
                                                                      '0.5'
                                                                    : '1',
                                                            zIndex: zIndexValue,
                                                            borderColor,
                                                            pointerEvents: this.tableDisableClick
                                                                ? 'none'
                                                                : 'auto',
                                                        }}
                                                        onDoubleClick={this.arrangeCourse.bind(
                                                            this,
                                                            util,
                                                            studentGroup,
                                                            isEvent,
                                                            listIndex
                                                        )}
                                                    >
                                                        {util.ifLock && (
                                                            <em className={styles.isLocked}></em>
                                                        )}
                                                        <div className={styles.content}>
                                                            {this.judgeUtilNameContent(
                                                                view,
                                                                util,
                                                                isHigh
                                                            )}

                                                            {((view && view == 'teacher') ||
                                                                (view && view == 'address') ||
                                                                (view && view == 'grade') ||
                                                                (view && view == 'group') ||
                                                                isHigh) &&
                                                                util &&
                                                                util.studentGroups &&
                                                                util.studentGroups.map((group) => {
                                                                    return this.judgeStuGroupNameContent(
                                                                        view,
                                                                        util,
                                                                        group
                                                                    );
                                                                })}
                                                        </div>
                                                    </div>
                                                </Popover>
                                            );
                                        })
                                    );
                                })}
                        </div>
                    </Col>
                );
            })
        );
    };

    //将每周几的结果处理成数组
    formatScheduleItem = (arr) => {
        // console.log('arr', arr);
        if (!arr || arr.length == 0) return [];
        let scheduleArr = [];
        let itemArr = [];
        let temp = [arr[0]['startTime'], arr[0]['endTime']];
        for (let i in arr) {
            if (arr[i]['startTime'] == temp[0] && arr[i]['endTime'] == temp[1]) {
                itemArr.push(arr[i]);
            } else {
                temp = [arr[i]['startTime'], arr[i]['endTime']];
                scheduleArr.push(itemArr);
                itemArr = [arr[i]];
            }
        }
        scheduleArr.push(itemArr);
        return scheduleArr;
    };

    //计算时间差
    computeTimeDiff = (start, end) => {
        let s = (start && start.split(':')) || [],
            e = (end && end.split(':')) || [];

        //timeLine表示展示范围数组，默认08:00 - 18:00为11项
        //在右侧-视图可修改时间显示范围
        //timeDiff表示磕碜start与end之间时间差 按分钟算
        let timeDiff = (e[0] - s[0]) * 60 + parseInt(e[1] - s[1], 10);
        return timeDiff;
    };

    computedWidth = (startTime, endTime) => {
        const { timeLine } = this.props;
        let timeDiff = this.computeTimeDiff(startTime, endTime);
        let tableItemWidth = (timeDiff / ((timeLine.length - 1) * 60)) * 100;
        return tableItemWidth;
    };

    //计算left
    computedLeft = (start, end) => {
        const { timeLine } = this.props;
        let startNum = timeLine[0].start.split(':').map(Number)[0];
        let s = (start && start.split(':')) || [];
        return (s[0] - startNum) * 60 + parseInt(s[1] - 0, 10);
    };
    // 关闭教师不规则排课卡片
    closeNotRuleCard = () => {
        this.setState({
            noRuleId: '',
        });
    };

    topHandleVisibleChange = (util, visible) => {
        let newState = { ...this.state };
        newState[`noRuleVisible${util.id}`] = visible;
        this.setState({
            [`noRuleVisible${util.id}`]: visible,
            noRuleId: util.id,
        });
    };

    // 渲染教师不排课规则
    renderMessageHtml = (util) => {
        return (
            util.ruleMessageList &&
            util.ruleMessageList.length > 0 &&
            util.ruleMessageList.map((item, index) => {
                return (
                    <div className={styles.ruleMessageStyle} title={item}>
                        {item}
                    </div>
                );
            })
        );
    };

    //点击展示详情
    lookDetail = (util, studentGroup, visible) => {
        console.log('lookDetail');
        clearTimeout(lookDetailTimeOut);
        lookDetailTimeOut = setTimeout(() => {
            console.log('setTimeout lookDetail');
            if (util.scheduleFlag == false) {
                this.setState({
                    noRuleId: util.id,
                });
                return;
            }
            let newCardUtil = this.props.setCardUtil();
            // util 是先点的 newCardUtil是后点的
            const { dispatch, showWillLock, showWillDelete, willCardLight } = this.props;
            const { tableCardUtil } = this.state;
            if (showWillLock) {
                message.info('批量锁定操作中...');
                return false;
            }
            if (showWillDelete) {
                message.info('按天删除课节中，不允许手动删除单个课节');
                return false;
            }
            let utilId = util.resultId;
            let freeResultId = util.freeResultId;

            // 单击后判断是否是双击操作还是单机取消操作，前者不请求
            // 单击后再次点击取消选中
            if (!this.state.isDouble && !willCardLight && utilId == tableCardUtil.resultId) {
                /* setTimeout(() => {
                    this.props.willCardLightState();
                    this.props.saveDetailId('', 2); // 请求待排第一个
                }, 500);
                return; */
                console.log('再次点击取消选中');
                this.props.willCardLightState();
                this.props.saveDetailId('', 2); // 请求待排第一个
                return;
            }
            if (utilId) {
                // 详情自动弹出
                // this.props.showArrange();
                // 防止双击请求两次
                /*  setTimeout(() => {
                    if (!this.state.isDouble) {
                        // 存储单击id
                        this.props.saveDetailId(utilId, 1);
                        //平常的课程详情
                        this.props.fetchCourseDetail(
                            utilId,
                            1,
                            util,
                            studentGroup && studentGroup.id,
                            'click',
                            studentGroup
                        );
                    }
                }, 800); */
                console.log('单击');
                if (!this.state.isDouble) {
                    // 存储单击id
                    this.props.saveDetailId(utilId, 1);
                    //平常的课程详情
                    this.props.fetchCourseDetail(
                        utilId,
                        1,
                        util,
                        studentGroup && studentGroup.id,
                        'click',
                        studentGroup
                    );
                }
                this.setState({
                    isDouble: false,
                    tableCardUtil: util,
                    tableStudentGroupId: studentGroup && studentGroup.id,
                });
            } else if (freeResultId) {
                //自由排课的详情
                dispatch({
                    type: 'timeTable/lookFreeCourseDetail',
                    payload: {
                        id: freeResultId,
                    },
                    onSuccess: () => {
                        this.setState({
                            showDetailModal: true,
                            tableCardUtil: util,
                            tableStudentGroupId: studentGroup && studentGroup.id,
                        });
                    },
                });
            } else {
                Modal.info({
                    title: <p>{util.name || '上课时段'}</p>,
                    content: (
                        <p>
                            时段：{util.startTime}-{util.endTime}
                        </p>
                    ),
                    okText: '好的',
                    maskClosable: true,
                    onOk() {},
                    onCancel() {},
                });
            }
            this.props.setLock && this.props.setLock('lockOn');
        }, 200);
    };
    hideModal = () => {
        this.setState({
            showDetailModal: false,
        });
    };

    // 双击调换课
    arrangeCourse = (util, studentGroup, isEvent, index) => {
        console.log('双击操作');
        this.tableLoading = true;
        clearTimeout(lookDetailTimeOut);
        const { showLoading } = this.props;
        // 防止点击多次
        if (this.tableDisableClick) {
            this.tableLoading = false;
            return false;
        }
        this.tableDisableClick = true;
        // 活动 限制双击操作
        if (util.type === 2) {
            this.tableLoading = false;
            this.tableDisableClick = false;
            return;
        }
        // 已发布的版本不能进行调换课
        if (this.props.lastPublish) {
            message.warning('已发布版本 无法进行调换课');
            this.tableLoading = false;
            this.tableDisableClick = false;
            return;
        }
        if (util.ifLock) {
            message.warning('课程锁定 无法进行调换课');
            this.tableLoading = false;
            this.tableDisableClick = false;
            return;
        }
        // if(util.acDuration === 2) {
        //     message.warning('双堂课暂不支持换课' )
        //     this.tableLoading = false;
        //     this.tableDisableClick = false;
        //     return;
        // }
        if (isEvent) {
            this.tableLoading = false;
            this.tableDisableClick = false;
            return;
        }
        // 活动 无法进行双击操作
        this.props.showArrange();
        // this.props.setIfExchangeLoading() // 调换课的loading
        const { currentVersion } = this.props;
        let studentGroupId = studentGroup.id;
        let resultId = util.resultId;
        // 清空newCanCheckScheduleList
        this.props.dispatch({
            type: 'timeTable/clearNewCanCheckScheduleList',
            payload: {
                versionId: currentVersion,
                studentGroupId: studentGroupId,
                resultId: resultId,
            },
        });
        this.setState({
            isDouble: true,
            tableCardUtil: util,
            cardUtilGroup: studentGroup,
        });
        this.props.fetchCourseDetail(
            util.resultId,
            1,
            util,
            studentGroup && studentGroup.id,
            'click',
            studentGroup
        ); // 双击时不在请求待排第一个

        //请求api/scheduleResult/mobileListExchange、api/scheduleResult/newListExchange两个接口
        this.props.getClickTableExchangeResult(util, util.resultId, studentGroup.id, index); // 请求调换课结果&移动换课结果
        if (!showLoading) {
            this.tableDisableClick = false;
            this.tableLoading = false;
        }
    };

    //转为待排
    changeArrange = () => {
        const { tableCardUtil } = this.state;
        const { dispatch } = this.props;
        dispatch({
            type: 'timeTable/changeArrange',
            payload: {
                id: tableCardUtil.resultId,
            },
            onSuccess: () => {
                this.hideModal();
                this.recoverData();
                this.props.fetchWillArrangeList();
            },
        });
    };

    //编辑卡片
    editCard = () => {
        const { tableCardUtil } = this.state;
        if (tableCardUtil.resultId) {
            //系统排课编辑
            this.setState({
                resultType: 2,
                showEditCourse: true,
            });
        }
    };

    //取消--系统排课编辑
    hideSystemModal = (type) => {
        this.setState({
            resultType: undefined,
            showEditCourse: false,
        });
        if (type == 'submit') {
            this.setState({
                showDetailModal: false,
            });
        }
    };

    //格式化班级
    formatClass = (group) => {
        if (!group) return;
        let str = '';
        group && group.length > 0;
        group.map((el) => {
            str += el.name + ' ';
        });
        return str;
    };

    //格式化教师
    formatTeacher = (teacher) => {
        if (!teacher) return;
        return (
            teacher &&
            teacher.length > 0 &&
            teacher.map((el, index) => {
                return (
                    <em key={index}>
                        {el.name}
                        {index != teacher.length - 1 ? '、' : null}
                    </em>
                );
            })
        );
    };

    //格式化学生 && 学生组 && 部门
    formatStudent = (student) => {
        if (!student || student.length <= 0) return;
        return (
            student &&
            student.length > 0 &&
            student.map((el, index) => {
                return (
                    <em key={index}>
                        {el.name}
                        {index != student.length - 1 ? '、' : null}
                    </em>
                );
            })
        );
    };
    //是否公布
    onChangeGroup = (e) => {
        this.setState({
            requiredField: false,
            ifpublish: e.target.value,
        });
    };
    //选择人员
    checkboxGroup = (value) => {
        this.setState({
            personnel: value,
        });
    };
    //删除自由排课课程
    deleteFreeCard(ifSingleTime) {
        const { tableCardUtil } = this.state;
        const { dispatch, freeCourseDetail } = this.props;
        let self = this;
        dispatch({
            type: 'course/getPublishResult',
            payload: {
                resultType: 3,
                resultId: freeCourseDetail && freeCourseDetail.id,
            },
        }).then(() => {
            const { getPublishResultList } = this.props;
            if (getPublishResultList) {
                if (!ifSingleTime) {
                    //删除本次及以后调用接口
                    dispatch({
                        type: 'timeTable/confirmCourseNum',
                        payload: {
                            freeResultId: tableCardUtil.freeResultId,
                        },
                        onSuccess: () => {
                            this.setState({
                                publish: true,
                            });
                        },
                    });
                } else {
                    //删除本次
                    this.setState({
                        deleteThis: true,
                    });
                }
            } else {
                if (!ifSingleTime) {
                    //删除本次及以后调用接口
                    dispatch({
                        type: 'timeTable/confirmCourseNum',
                        payload: {
                            freeResultId: tableCardUtil.freeResultId,
                        },
                        onSuccess: () => {
                            const { accountCourseNum } = this.props;
                            Modal.confirm({
                                title: `此操作将删除本次及以后所有共有${
                                    accountCourseNum.amount || 0
                                }个课程安排，您确定要删除吗？ `,
                                okText: '确定',
                                cancelText: '放弃',
                                onOk() {
                                    self.confirmDeleteCoure(ifSingleTime);
                                },
                            });
                        },
                    });
                } else {
                    //删除本次
                    confirm({
                        title: '您确定要删除吗？',
                        okText: '确定',
                        cancelText: '放弃',
                        onOk() {
                            self.confirmDeleteCoure(ifSingleTime);
                        },
                    });
                }
            }
        });
    }
    cancelFrom = () => {
        this.setState({
            ifpublish: undefined,
            personnel: undefined,
            publish: false,
            deleteThis: false,
            requiredField: true,
        });
    };
    confirmDeleteCoure1 = () => {
        this.confirmDeleteCoure(false);
    };
    confirmDeleteCoure2 = () => {
        this.confirmDeleteCoure(true);
    };
    //确认删除自由排课
    confirmDeleteCoure = (ifSingleTime) => {
        const { tableCardUtil, ifpublish, personnel, requiredField, searchIndex } = this.state;
        const { dispatch, getPublishResultList, freeCourseDetail } = this.props;
        if (requiredField && !freeCourseDetail.freePublish && getPublishResultList) {
            message.info('请选择是否公布');
            return;
        }
        dispatch({
            type: 'timeTable/deleteFreeCourse',
            payload: {
                id: tableCardUtil.freeResultId,
                ifSingleTime: ifSingleTime, //删除本次-true,删除本次及以后-false
                publish: freeCourseDetail.freePublish ? freeCourseDetail.freePublish : ifpublish,
                noticeIdentities: personnel,
            },
            onSuccess: () => {
                this.hideModal();
                this.setState({
                    ifpublish: undefined,
                    personnel: undefined,
                    publish: false,
                    deleteThis: false,
                    requiredField: true,
                });
                if (searchIndex == 2) {
                    this.confirmStudentView();
                } else if (searchIndex == 3) {
                    this.confirmTeacherView();
                } else {
                    this.recoverData();
                }
            },
        }).then(() => {
            this.setState({
                ifpublish: undefined,
                personnel: undefined,
                requiredField: true,
            });
        });
    };

    //编辑自由排课课程
    editFreeCard = () => {
        const { tableCardUtil } = this.state;
        if (tableCardUtil.freeResultId) {
            if (tableCardUtil.freeType == '1') {
                message.info('ac自由排课暂且不能编辑哦~');
                return false;
            } else {
                //自由排课的类型 freeType 2:活动 3: club 4: 个人课程
                this.setState({
                    editFreeType: tableCardUtil.freeType,
                    showEditFreedomCourse: true,
                    resultType: 3,
                });
            }
        }
    };

    //AC自由排课转为待排
    changeFreeArrange = () => {
        const { tableCardUtil } = this.state;
        const { dispatch } = this.props;
        dispatch({
            type: 'timeTable/changeFreeArrange',
            payload: {
                freeAcId: tableCardUtil.freeResultId,
            },
            onSuccess: () => {
                this.hideModal();
                this.recoverData();
            },
        });
    };

    //取消编辑自由排课
    hideEditFreeModal = () => {
        this.setState({
            resultType: undefined,
            showEditFreedomCourse: false,
        });
        this.hideModal();
    };

    //调课换课
    exchangeClass(util, id, studentGroupId, index) {
        const { exchangeClass, selectStudent } = this.props;
        if (selectStudent && selectStudent.length > 0) {
            message.info('学生课程表暂不支持换课调换课功能哦~');
            return false;
        } else {
            util.type =
                1 &&
                util.resultId &&
                typeof exchangeClass === 'function' &&
                exchangeClass(id, studentGroupId, index); // 调取父组件函数请求调换课结果
        }
    }

    //判断当前版本是否发布
    judgePublicVersion = (callback) => {
        const { dispatch, currentVersion } = this.props;
        //判断当前版本是否发布
        dispatch({
            type: 'timeTable/lastPublic',
            payload: {
                versionId: currentVersion,
            },
            onSuccess: () => {
                const { lastPublicContent } = this.props;
                if (lastPublicContent) {
                    message.info('当前版本已发布，不可进行锁定操作~');
                    return false;
                } else {
                    callback();
                }
            },
        });
    };

    //锁定单节课
    lockUtilLesson(id) {
        const { dispatch } = this.props;
        this.judgePublicVersion(() => {
            dispatch({
                type: 'timeTable/lockUtilLesson',
                payload: {
                    resultId: id,
                },
                onSuccess: () => {
                    this.lookCourseDetail();
                    this.recoverData();
                },
            });
        });
    }

    //课程调用详情--供解锁课程用
    lookCourseDetail = () => {
        const { dispatch, courseDetail } = this.props;
        dispatch({
            type: 'timeTable/lookCourseDetail',
            payload: {
                id: courseDetail.id,
                type: 2,
            },
            onSuccess: () => {},
        });
    };

    //解锁单节课
    unLockUtilLesson(id) {
        const { dispatch } = this.props;
        this.judgePublicVersion(() => {
            dispatch({
                type: 'timeTable/unLockUtilLesson',
                payload: {
                    resultId: id,
                },
                onSuccess: () => {
                    this.lookCourseDetail();
                    this.recoverData();
                },
            });
        });
    }

    //锁定班级下的所有课程
    lockAllClass(id) {
        //更改props
        const { dispatch } = this.props;
        dispatch({
            type: 'timeTable/lockAllClassCourse',
            payload: {
                id: id,
            },
        });
    }

    //解锁班级下的所有课程
    unLockAllClass(id) {
        //更改props
        const { dispatch } = this.props;
        dispatch({
            type: 'timeTable/unLockAllClassCourse',
            payload: {
                id: id,
            },
        });
    }

    // //锁定周几下的所有课程
    // lockWeekCourse(weekDay) {
    //     //更改小锁的状态
    //     let saveWeekLockStatus = JSON.parse(JSON.stringify(this.state.saveWeekLockStatus));
    //     saveWeekLockStatus[weekDay] = true;
    //     this.setState({
    //         saveWeekLockStatus: saveWeekLockStatus
    //     })
    //     //更改props
    //     const { dispatch } = this.props;
    //     dispatch({
    //         type: 'timeTable/lockAllClassCourse',
    //         payload: {
    //             id: id
    //         }
    //     })
    // }

    //清空当天的所有课程
    deleteAllDay(weekDay, index) {
        let deleteStatus = {};
        deleteStatus[index] = true;
        this.setState(
            {
                saveWeekDeleteStatus: deleteStatus,
            },
            () => {
                const { statisticsDeleteResult } = this.props;
                typeof statisticsDeleteResult === 'function' &&
                    statisticsDeleteResult.call(this, weekDay);
            }
        );
    }

    //取消清空
    unDeleteAllDay(weekDay) {}

    // 切换类型
    switchType = (e) => {
        let i = JSON.parse(e.key);
        let { searchIndex } = this.state;
        if (searchIndex === i) {
            this.setState({
                searchlabel: e.item.props.label,
            });
            return;
        }
        console.log('i', i);

        //2学生 3教师
        if (i != 2 && i != 3) {
            console.log('i不等于2，3');
            this.setState(
                {
                    searchIndex: i,
                    dropDownVisible: false,
                    isCustom: i == 5 && true,
                    searchlabel: e.item.props.label,
                    teacherViewOrgDisabled: false,
                    teacherViewTeachersDisabled: false,
                    teacherViewOrg: undefined, // 教师视角部门value
                    teacherViewTeachers: undefined,
                    orgIds: [],
                    userIds: [],
                    studentViewStudent: undefined,
                },
                () => {
                    this.props.dispatch({
                        type: 'timeTable/deposit',
                        payload: [],
                    });
                    this.props.dispatch({
                        type: 'timeTable/studentIds',
                        payload: [],
                    });

                    this.props.getCourseView(); // 根据资源视角切换，改变更多筛选中默认值
                    // 切换视角时，重新加载
                    let { fetchScheduleList, self } = this.props;
                    setTimeout(() => {
                        typeof fetchScheduleList === 'function' && fetchScheduleList.call(self);
                    }, 300);
                    if (i == 5) {
                        this.props.clearScheduleGroupIdList();
                        this.props.getCustomStudentList();
                    }
                }
            );
        } else {
            console.log('i等于2，3');
            this.setState(
                {
                    searchIndex: i,
                    searchlabel: e.item.props.label,
                    teacherViewOrgDisabled: false,
                    teacherViewTeachersDisabled: false,
                    teacherViewOrg: undefined, // 教师视角部门value
                    teacherViewTeachers: undefined,
                    orgIds: [],
                    userIds: [],
                    studentViewStudent: undefined,
                    selectTeacherValue: [],
                },
                () => {
                    this.props.dispatch({
                        type: 'timeTable/deposit',
                        payload: [],
                    });
                    this.props.dispatch({
                        type: 'timeTable/studentIds',
                        payload: [],
                    });

                    if (i == 2) {
                        this.props.getGradeList();
                        this.props.getCustomStudentList();
                    }
                    this.props.getCourseView();
                }
            );
        }
        /* console.log('studentViewGroup', this.state.studentViewGroup);
        this.setState(
            {
                studentViewGroup: undefined,
                userIds: [],
            },
            () => {
                this.props.dispatch({
                    type: 'timeTable/studentIds',
                    payload: [],
                });
            }
        ); */
    };

    handleVisibleChange = (flag) => {
        this.setState({ dropDownVisible: flag });
    };

    // 学生视角选择班级change
    studentViewGroupChange = (value) => {
        let val = value.indexOf('全部班级') > -1 ? '全部班级' : value;
        this.setState(
            {
                studentViewGroup: val,
            },
            () => {
                this.props.getCustomStudentList();
            }
        );
    };

    // 学生视角选择学生change
    studentViewStudentChange = (value) => {
        this.setState({
            studentViewStudent: value,
        });
    };

    // 学生视角确认查询结果
    confirmStudentView = () => {
        const { studentViewStudent, studentViewGroup, studentViewGrade, searchIndex } = this.state;
        const { dispatch, currentVersion, startTimeOfDay, endTimeOfDay } = this.props;

        // 最小范围查到班级
        if (
            (!studentViewStudent || !studentViewStudent.length) &&
            (!studentViewGroup || !studentViewGroup.length)
        ) {
            message.info('请选择班级');
            return;
        }

        dispatch({
            type: 'timeTable/studentIds',
            payload: studentViewStudent,
        });

        this.setState(
            {
                loading: true,
            },
            () => {
                dispatch({
                    type: 'timeTable/fetchScheduleList',
                    payload: {
                        id: currentVersion,
                        gradeIds: studentViewGrade,
                        groupIds: studentViewGroup == '全部班级' ? [] : studentViewGroup,
                        studentIds: studentViewStudent,
                        startTimeOfDay,
                        endTimeOfDay,
                        searchIndex: searchIndex || 0, // 默认是班级
                    },
                }).then(() => {
                    let scheduleStudentIdList = [];
                    this.props.scheduleData &&
                        this.props.scheduleData.length > 0 &&
                        this.props.scheduleData.map((item, index) => {
                            scheduleStudentIdList.push(item.studentGroup.id);
                        });
                    this.props.changeIsHigh(); // 学生视角将判断高中的样式改为false
                    this.setState(
                        {
                            loading: false,
                            isCustom: false,
                            scheduleStudentIdList,
                        },
                        () => {
                            this.props.setScheduleGroupIdList();
                        }
                    );
                });
            }
        );
    };

    // 选择学生视角展示
    handleStudentInput = () => {
        const { groupList, customStudentList, gradeByTypeArr } = this.props;
        const { studentViewGroup } = this.state;
        const treeProps = {
            treeNodeFilterProp: 'title',
            treeCheckable: true,
            treeNodeFilterProp: 'title',
        };
        let renderTagPlaceholder = (omittedValues) => {
            let len = omittedValues && omittedValues.length;
            return <em className={styles.omittedStyle}>+ {len}</em>;
        };
        const studentGroupProps = {
            treeData: gradeByTypeArr,
            value: studentViewGroup,
            placeholder: trans('course.plan.class', '全部班级'),
            onChange: this.studentViewGroupChange,
            maxTagCount: 2,
            filterTreeNode: (inputValue, treeNode) => {
                if (
                    treeNode &&
                    treeNode.props &&
                    treeNode.props.title &&
                    treeNode.props.title.indexOf(inputValue) > -1
                ) {
                    return true;
                } else {
                    return false;
                }
                // return true;
            },
            maxTagPlaceholder: (omittedValues) => renderTagPlaceholder(omittedValues),
            ...treeProps,
        };
        return (
            <div className={styles.studentInput}>
                <TreeSelect
                    {...studentGroupProps}
                    style={{ width: '180px', marginBottom: '10px' }}
                />

                <Select
                    mode="multiple"
                    placeholder={trans('global.searchStudents', '搜索选择学生')}
                    onChange={this.studentViewStudentChange}
                    optionFilterProp="children"
                    style={{ width: 'auto', display: 'block' }}
                >
                    {customStudentList &&
                        customStudentList.length > 0 &&
                        customStudentList.map((item) => {
                            return (
                                <Option value={item.id} key={item.id} title={item.name}>
                                    {item.name}
                                </Option>
                            );
                        })}
                </Select>
                <span className={styles.confirm} onClick={this.confirmStudentView}>
                    {trans('global.searchConfirm', '确定')}
                </span>
            </div>
        );
    };

    // 选择教师视角展示
    handleTeacherInput = () => {
        const { selectTeacherValue, selectTeacherModalVisible } = this.state;
        return (
            <div className={styles.teacherInput}>
                <div className={styles.searchPart}>
                    <PlusOutlined
                        className={styles.addButton}
                        onClick={() => this.changeSelectTeacherModalVisible(true)}
                    />
                    <Select
                        showSearch
                        mode="multiple"
                        style={{ width: 150 }}
                        filterOption={true}
                        optionFilterProp="children"
                        onChange={this.selectOption}
                        value={selectTeacherValue}
                        className={styles.selectStyle}
                        placeholder="搜索部门或个人"
                    >
                        {this.renderOption()}
                    </Select>
                    {selectTeacherModalVisible && (
                        <SearchTeacher
                            modalVisible={selectTeacherModalVisible}
                            cancel={this.changeSelectTeacherModalVisible}
                            language={'zh_CN'}
                            confirm={this.selectTeacherConfirm}
                            selectedList={this.handleData(selectTeacherValue)} //选中人员，组件当中回显{[id: 1, name: '', englishName: '']},如果是组织id，id处理成"org-1"的形式
                            selectType="2" // 1:全体人员 2：人员和组织id {nodeList：组织id数组，idList： 人员id数组}
                        />
                    )}
                </div>
                <span className={styles.confirm} onClick={this.confirmTeacherView}>
                    {trans('global.searchConfirm', '确定')}
                </span>
            </div>
        );
    };

    // 教师视角选择部门
    teacherInputChange = (value) => {
        let resultArr = [];
        value &&
            value.length > 0 &&
            value.map((el) => {
                let result = Number(el.split('-')[1]);
                resultArr.push(result);
            });
        this.setState({
            teacherViewOrg: resultArr,
            teacherViewTeachersDisabled: value && value.length > 0 ? true : false,
        });
    };

    // 教师视角搜索个人
    changeTeacherPerson = (value) => {
        this.setState({
            teacherViewTeachers: value,
            teacherViewOrgDisabled: value && value.length > 0 ? true : false,
        });
    };

    // 教师视角确认查询课表
    confirmTeacherView = () => {
        const { dispatch, currentVersion, startTimeOfDay, endTimeOfDay } = this.props;
        const { teacherViewOrg, teacherViewTeachers, searchIndex, userIds, orgIds } = this.state;
        console.log('userIds', userIds);
        dispatch({
            type: 'timeTable/deposit',
            payload: userIds,
        });
        this.setState(
            {
                loading: true,
            },
            () => {
                dispatch({
                    type: 'timeTable/findTeacherSchedule',
                    payload: {
                        id: currentVersion,
                        /* orgTreeIdList: teacherViewOrg,
                        teacherIds: teacherViewTeachers, */
                        orgTreeIdList: orgIds,
                        teacherIds: userIds,
                        startTimeOfDay,
                        endTimeOfDay,
                        // 是新增属性
                        searchIndex: searchIndex || 0, // 默认是班级
                    },
                }).then(() => {
                    let scheduleTeacherIdList = [];
                    this.props.scheduleData &&
                        this.props.scheduleData.length > 0 &&
                        this.props.scheduleData.map((item, index) => {
                            if (item.resultList && item.resultList.length > 0) {
                                scheduleTeacherIdList.push(item.studentGroup.id);
                            }
                        });
                    this.props.changeIsHigh(); // 学生视角将判断高中的样式改为false
                    this.setState(
                        {
                            loading: false,
                            isCustom: false,
                            dropDownVisible: false,
                            scheduleTeacherIdList,
                        },
                        () => {
                            this.props.setScheduleGroupIdList();
                        }
                    );
                });
            }
        );
    };

    // 按天复制课表
    copyWeekCol = (week) => {
        let day = intoNumber(week.substring(1, 2));
        this.setState({
            copyDayVisible: true,
            copySourceDay: day,
        });
    };

    handleCopyCancel = () => {
        this.setState({
            copyDayVisible: false,
        });
    };

    copySelectChange = (value) => {
        this.setState({
            copyWeekDay: value,
        });
    };

    confirmCopyDayCourse = () => {
        if (!this.state.copyWeekDay) {
            message.info('请选择复制的时间');
            return;
        }
        if (this.state.copyLoading) {
            return;
        }
        const { dispatch, currentVersion, showTable, getshowAcCourseList } = this.props;
        this.setState(
            {
                copyLoading: true,
            },
            () => {
                dispatch({
                    type: 'timeTable/getCopyByDayScheduleResult',
                    payload: {
                        versionId: currentVersion, // --版本ID
                        sourceWeekDay: this.state.copySourceDay, // --要复制的周几日期 (比如 :周一对应的为 1)
                        targetWeekDay: this.state.copyWeekDay, // --复制到的周日期
                    },
                }).then(() => {
                    this.handleCopyCancel();
                    typeof showTable === 'function' && showTable('按天复制');
                    typeof getshowAcCourseList === 'function' && getshowAcCourseList.call(this);
                    this.setState({
                        copyLoading: false,
                        copyWeekDay: '',
                    });
                });
            }
        );
    };

    // 切换版本日期回到默认页面
    changeSearchIndex = (searchIndex, label, isCustom) => {
        this.setState(
            {
                searchIndex: searchIndex,
                isCustom: isCustom,
                searchlabel: label,
            },
            () => {
                if (this.state.searchIndex == 5) {
                    this.props.changeIsHigh();
                }
            }
        );
    };

    selectOption = (selectTeacherValue) => {
        console.log('selectTeacherValue :>> ', selectTeacherValue);
        this.setState(
            {
                selectTeacherValue,
            },
            () => {
                this.setState({
                    userIds: this.formatId(selectTeacherValue, 'user'),
                    orgIds: this.formatId(selectTeacherValue, 'org'),
                });
            }
        );
    };

    formatId = (list, type) => {
        let org = [],
            user = [];
        for (let i = 0; i < list.length; i++) {
            if (list[i] && typeof list[i] == 'string' && list[i].indexOf('org-') > -1) {
                let id = Number(list[i].split('org-')[1]);
                org.push(id);
            } else {
                user.push(list[i]);
            }
        }
        console.log('user', user);
        if (type == 'org') {
            return org;
        } else if (type == 'user') {
            return user;
        }
    };

    renderOption = () => {
        const { currentLang } = this.props;
        let treeData = this.formatTree();
        let people = currentLang == 'en' ? 'people' : '人';
        return (
            treeData?.length > 0 &&
            treeData.map((item) => (
                <Option value={item.id}>
                    {item.total > 0
                        ? `${currentLang == 'en' ? item.enName || item.name : item.name}(${
                              item.total
                          }${people})`
                        : `${item.name} ${item.enName || ''}`}
                </Option>
            ))
        );
    };

    //处理人员和组织数据-人员和组织的id有重复的，所以组织的id添加org-标识
    formatTree = () => {
        const { fetchTeacherAndOrg } = this.props;
        let tree = JSON.parse(JSON.stringify(fetchTeacherAndOrg || []));
        tree.map((item) => {
            item.id = item.orgFlag ? `org-${item.id}` : item.id;
        });
        return tree;
    };

    changeSelectTeacherModalVisible = (visible) => {
        this.setState({
            selectTeacherModalVisible: visible ?? false,
        });
    };

    selectTeacherConfirm = (ids) => {
        //获得组织和人员id {orgIds: [], userIds: [] }
        let idList = JSON.parse(JSON.stringify(ids));
        let orgIds = idList?.orgIds || [], //组织ids
            userIds = idList?.userIds || []; //人员ids
        for (let i = 0; i < orgIds.length; i++) {
            orgIds[i] = `org-${orgIds[i]}`;
        }
        this.setState(
            {
                selectTeacherValue: Array.from(new Set(orgIds.concat(userIds))),
            },
            () => {
                this.setState({
                    userIds: this.formatId(this.state.selectTeacherValue, 'user'),
                    orgIds: this.formatId(this.state.selectTeacherValue, 'org'),
                });
                this.changeSelectTeacherModalVisible(false);
            }
        );
    };

    //处理回显数据
    handleData = (data) => {
        let tree = this.formatTree();
        let result = [];
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < tree.length; j++) {
                if (tree[j]['id'] == data[i]) {
                    let info = {
                        id: data[i],
                        name: tree[j]['name'],
                        englishName: tree[j]['enName'],
                        total: tree[j]['total'] || 0,
                    };
                    result.push(info);
                }
            }
        }
        return result;
    };

    getTimeAndRepeatHtml = () => {
        let {
            freeCourseDetail: { startTime, endTime, ifRepeated },
        } = this.props;
        let dateStr = `${moment(startTime).format('M')}月${moment(startTime).format('D')}日`;
        let weekStr = weekCopy[moment(startTime).format('d')];
        let timeStr = `${moment(startTime).format('HH:mm')}-${moment(endTime).format('HH:mm')}`;
        return dateStr + ' ' + weekStr + ' ' + timeStr;
    };

    getAddressNameById = (areaIdList) => {
        const { areaList } = this.props;
        let res = '';
        areaIdList.forEach((areaId) => {
            let targetAreaObj = areaList.find((areaItem) => areaItem.id === areaId);
            if (targetAreaObj) {
                res = res + targetAreaObj.name + '、' + ' ';
            }
        });
        return res;
    };

    //如何显示课程名
    judgeUtilNameContent = (view, util, isHigh) => {
        const { tableWidthRatio, displayType, currentLang } = this.props;

        let formatUtilName = () => {
            //如果是在老师、场地、年级（宽度比例为1）时，在中文环境下特殊处理（只取第一个字）
            if (
                isHigh ||
                (view && view == 'teacher') ||
                (view && view == 'address') ||
                (view && view == 'grade' && tableWidthRatio === 1)
            ) {
                //如果是英文开头，取字符串全部，否则只取第一个字
                let reg = new RegExp('^[a-zA-Z]');
                let utilName = reg.test(util.name)
                    ? util.name && util.name.split(' ', 1).toString()
                    : util.name && util.name.charAt(0);
                return <span className={styles.utilName}>{utilName}</span>;
            } else {
                return <span className={styles.utilName}>{util.name}</span>;
            }
        };

        //当视图为班级，并且为分层班，并且勾选分层班显示班级班级简称，不显示课程名
        if (
            view &&
            view == 'group' &&
            util.studentGroups &&
            util.studentGroups[0].type === 5 &&
            displayType.includes(7)
        ) {
            return;
        }

        //当视图为教师，并且勾选教师课表只显示班级
        if (displayType.includes(3) && view && view == 'teacher' && util.acId) {
            return;
        }

        //英文环境下，直接返回英文
        if (currentLang === 'en') {
            return <span className={styles.utilName}>{util.eName}</span>;
        }

        //显示课程简称
        if (displayType.includes(6)) {
            if (util.courseShortName) {
                return <span className={styles.utilName}>{util.courseShortName}</span>;
            } else {
                return formatUtilName();
            }
        } else {
            return formatUtilName();
        }
    };

    //如何显示班级名
    judgeStuGroupNameContent = (view, util, group) => {
        const { tableWidthRatio, displayType } = this.props;

        //当视图为年级，并且年级课表只显示班级不显示课程时，直接返回
        if (view && view == 'grade' && displayType.includes(5) && util.acId) {
            return;
        }
        //当视图为班级，并且为分层班，并且勾选分层班显示班级简称
        if (view && view == 'group') {
            if (group.type === 5 && displayType.includes(7)) {
                return (
                    <span className={styles.stuGroupName} key={group.name}>
                        {group.groupAbbreviation ? group.groupAbbreviation : group.name}
                    </span>
                );
            } else {
                return;
            }
        }

        return (
            <span className={styles.stuGroupName} key={group.name}>
                {group.groupAbbreviation
                    ? group.groupAbbreviation
                    : tableWidthRatio !== 1
                    ? group.name
                    : this.getNewName(group, util)}
            </span>
        );
    };

    //简化班级名字
    getNewName = (group, util) => {
        // 从这里是把’班‘字删掉
        let nameArray = group.name
            .replace(util.name, '')
            .split('' || '-')
            .toString()
            .split('')
            .filter((item) => item != '年' && item != '级')
            .join('')
            .split(' ');

        let lastElement = nameArray
            .slice(-1)
            .toString()
            .split('')
            .filter((item) => item != '（' && item != '）')
            .slice(0, 2);

        return lastElement.toString().replace(/,/g, '');
    };

    handleStudentViewClick = async (item, index) => {
        console.log('item', item);
        console.log('index :>> ', index);
        const { getCustomResult } = this.props;
        const { isUpdateArr } = this.state;
        let isUpdateArrCopy = isUpdateArr;
        isUpdateArrCopy[index] = true;
        this.setState(
            {
                isUpdateArr: [...isUpdateArrCopy],
            },
            () => {
                this.forceUpdate();
                typeof getCustomResult === 'function' &&
                    getCustomResult(
                        item.studentGroup.id,
                        item.studentGroup.view,
                        '自定义刷新',
                        true
                    ).then(() => {
                        this.setState(
                            {
                                isUpdateArr: [],
                            },
                            () => {
                                this.forceUpdate();
                            }
                        );
                    });
            }
        );
    };

    showLockOrUnLockConfirm = (type, studentGroup) => {
        let self = this;
        confirm({
            title: `确定要${type === 'lock' ? '锁定' : '解锁'}该班全部课程吗`,
            onOk() {
                self.lockOrUnLockStudentGroup(type, studentGroup);
            },
        });
    };

    lockOrUnLockStudentGroup = async (type, studentGroup) => {
        const { dispatch, currentVersion, getCustomResultForEfficient } = this.props;
        console.log('studentGroup :>> ', studentGroup);
        this.setState({
            loading: true,
        });
        await dispatch({
            type: 'timeTable/confirmLock',
            payload: {
                groupIdList: [studentGroup.id],
                lockType: type === 'lock' ? 1 : 2,
                versionId: currentVersion,
            },
        });
        await getCustomResultForEfficient(
            studentGroup.id,
            studentGroup.view,
            '',
            true,
            {
                sourceGroupIdList: [studentGroup.id],
            },
            studentGroup.canClose
        );
        this.setState({
            loading: false,
        });
    };

    render() {
        console.log('Table render');
        const {
            currentDate,
            freeCourseDetail,
            showLoading,
            selectStudent,
            accountCourseNum,
            isFull,
            deleteLoading,
            loadingMsg,
            tableWidthRatio,
            currentVersion,
        } = this.props;
        const {
            showDetailModal,
            tableCardUtil,
            tableStudentGroupId,
            ifpublish,
            showSelectEditModal,
            editType,
            resultType,
            publish,
            deleteThis,
            ifvalue,
            searchIndex,
            searchList,
            dropDownVisible,
            searchlabel,
            loading,
            copyDayVisible,
            copySourceDay,
            // isShowCheckGroup,
            checkedList,
            indeterminate,
            checkAll,
            selectTeacherValue,
            customPopoverVisible,
        } = this.state;

        let weekTitle = this.calculationWeekDate(currentDate);
        let weekDate = this.calculationDate(currentDate);
        // 全屏样式
        let fullStyle = isFull ? styles.fullStyle : '';

        //在1950px基础上随tableWidth比例增大
        let minWidth = 1950 * tableWidthRatio + 'px';

        return !currentVersion ? (
            <div className={styles.emptySchedule}>
                <img src={emptySchedule} />
                <span className={styles.emptyScheduleText}>本周暂未创建课表</span>
            </div>
        ) : (
            <div className={styles.scheduleBox} style={{ minWidth }}>
                <div className={styles.scheduleTitle}>
                    {/* 表格左上角班级年级的选择, */}
                    <div className={styles.classBox}>
                        {selectStudent && selectStudent.length > 0 ? (
                            <span>{trans('global.student', '学生')}</span>
                        ) : (
                            <span>
                                {searchlabel ? searchlabel : trans('global.class', '班级')}
                                <Dropdown
                                    visible={dropDownVisible}
                                    trigger={['click']}
                                    // visible={true}
                                    onVisibleChange={this.handleVisibleChange}
                                    overlay={
                                        <Menu
                                            onClick={this.switchType}
                                            selectedKeys={[searchIndex]}
                                        >
                                            {searchList.map((el, i) => (
                                                <Menu.Item key={i} label={el}>
                                                    <span className={styles.menuItem}>
                                                        {el}

                                                        {/* 判断是否有箭头出现 */}
                                                        {((searchIndex == 2 && i == 2) ||
                                                            (searchIndex == 3 && i == 3)) && (
                                                            <span
                                                                className={styles.triangle}
                                                            ></span>
                                                        )}
                                                    </span>

                                                    {/* 当有箭头出现时，代表学生和老师，显示数据 */}
                                                    {searchIndex == 2 &&
                                                        i == 2 &&
                                                        this.handleStudentInput()}
                                                    {searchIndex == 3 &&
                                                        i == 3 &&
                                                        this.handleTeacherInput()}
                                                </Menu.Item>
                                            ))}
                                        </Menu>
                                    }
                                >
                                    <i className={icon.iconfont}>&#xe682;</i>
                                </Dropdown>
                            </span>
                        )}
                    </div>
                    {/* 渲染周几和时间盒子 */}
                    <div className={styles.weekBox}>
                        <Row className={styles.scheduleClass} type="flex">
                            {this.renderWeek(weekTitle, weekDate)}
                        </Row>
                        <Row className={styles.scheduleClass} type="flex">
                            {this.renderTimeCol(weekTitle)}
                        </Row>
                    </div>
                </div>
                <Spin
                    spinning={this.tableLoading || showLoading || loading || deleteLoading}
                    tip={loadingMsg || 'loading...'}
                >
                    <div
                        className={styles.scheduleMain + '  ' + fullStyle}
                        id="scheduleMain"
                        style={{ height: isFull ? '90vh' : '80vh' }}
                    >
                        {this.renderClassRow()}
                        <div className={styles.placeholder}></div>
                    </div>
                </Spin>
                {/* 点击课程 弹层为课程的详细信息 */}
                {showDetailModal && (
                    <Modal
                        title={null}
                        footer={null}
                        visible={showDetailModal}
                        onCancel={this.hideModal}
                    >
                        {tableCardUtil.freeResultId && (
                            <div className={styles.detailModal}>
                                <div
                                    className={styles.detailTitle}
                                    style={{
                                        background:
                                            tableCardUtil.freeType == 2 || tableCardUtil.type == 2
                                                ? getCourseColor('活动', 2)
                                                : tableCardUtil.name &&
                                                  getCourseColor(tableCardUtil.name, 2),
                                    }}
                                >
                                    <p className={styles.detailTitleLeft}>
                                        <span
                                            className={styles.detailTitleName}
                                            title={freeCourseDetail.name}
                                            style={{
                                                color:
                                                    tableCardUtil.freeType == 2 ||
                                                    tableCardUtil.type == 2
                                                        ? getCourseColor('活动', 1)
                                                        : tableCardUtil.name &&
                                                          getCourseColor(tableCardUtil.name, 1),
                                            }}
                                        >
                                            {freeCourseDetail.name}
                                        </span>
                                        {freeCourseDetail.type === 2 ? (
                                            <span>{this.getTimeAndRepeatHtml()}</span>
                                        ) : (
                                            <span>
                                                {formatUsualTime(freeCourseDetail.startTime)} -
                                                {formatUsualTime(freeCourseDetail.endTime)}
                                            </span>
                                        )}
                                        {freeCourseDetail.ifRepeated ? (
                                            <span>{freeCourseDetail.repeatString}</span>
                                        ) : (
                                            <span>不重复</span>
                                        )}
                                    </p>
                                </div>
                                <div className={styles.showTeacher}>
                                    <p>
                                        <i className={icon.iconfont}>&#xe79c;</i>
                                        <span>
                                            参与学生：
                                            {this.formatStudent(freeCourseDetail.students)}
                                            {this.formatStudent(freeCourseDetail.studentGroups)}
                                        </span>
                                    </p>
                                    {/* <p>
                                <i className={icon.iconfont}>&#xe771;</i>
                                <span>
                                    参与班级：{this.formatClass(freeCourseDetail.studentGroups)}
                                </span>
                            </p> */}
                                    <p>
                                        <i className={icon.iconfont}>&#xe695;</i>
                                        {freeCourseDetail.type == '2' ? (
                                            <span>
                                                必选教师：
                                                {this.formatTeacher(
                                                    freeCourseDetail.necessaryTeachers
                                                )}
                                                {this.formatStudent(
                                                    freeCourseDetail.necessaryDepartments
                                                )}
                                            </span>
                                        ) : (
                                            <span>
                                                主教老师：
                                                {this.formatTeacher(freeCourseDetail.mainTeachers)}
                                            </span>
                                        )}
                                    </p>
                                    <p>
                                        <i className={icon.iconfont}>&#xe695;</i>
                                        {freeCourseDetail.type == '2' ? (
                                            <span>
                                                可选老师：
                                                {this.formatTeacher(
                                                    freeCourseDetail.unnecessaryTeachers
                                                )}
                                                {this.formatStudent(
                                                    freeCourseDetail.unnecessaryDepartments
                                                )}
                                            </span>
                                        ) : (
                                            <span>
                                                协同老师：
                                                {this.formatTeacher(
                                                    freeCourseDetail.assistantTeachers
                                                )}
                                            </span>
                                        )}
                                    </p>
                                    <p>
                                        <i className={icon.iconfont}>&#xe78e;</i>
                                        <span>
                                            地点：
                                            {freeCourseDetail.playgroundName ||
                                                freeCourseDetail.outsidePlayground}
                                        </span>
                                    </p>
                                    {freeCourseDetail.allowSelfArrangement &&
                                        freeCourseDetail.selfArrangementAddressIdList && (
                                            <p className={styles.allowSelf}>
                                                <span>允许学生自主安排, </span>
                                                <span style={{ marginLeft: '10px' }}>
                                                    可选地点: &nbsp;
                                                    {this.getAddressNameById(
                                                        freeCourseDetail.selfArrangementAddressIdList
                                                    )}
                                                </span>
                                            </p>
                                        )}
                                    <p className={styles.createMsg}>
                                        {freeCourseDetail.createUserName}&nbsp;
                                        {freeCourseDetail.createUserEnglishName} 创建于&nbsp;
                                        {moment(freeCourseDetail.createTime).format(
                                            'YYYY.MM.DD HH:mm'
                                        )}
                                    </p>
                                </div>
                                <div className={styles.operButton}>
                                    <span onClick={this.deleteFreeCard.bind(this, true)}>
                                        <i className={icon.iconfont}>&#xe739;</i>删除本次
                                    </span>
                                    {freeCourseDetail.ifRepeated === true && (
                                        <span onClick={this.deleteFreeCard.bind(this, false)}>
                                            <i className={icon.iconfont}>&#xe739;</i>删除本次及以后
                                        </span>
                                    )}
                                    {tableCardUtil.freeType == 1 && (
                                        <span onClick={this.changeFreeArrange}>
                                            <i className={icon.iconfont}>&#xe778;</i>转为待排
                                        </span>
                                    )}
                                    <span onClick={this.editFreeCard}>
                                        <i className={icon.iconfont}>&#xe63b;</i>编辑
                                    </span>
                                </div>
                            </div>
                        )}
                    </Modal>
                )}
                {publish && (
                    <Modal
                        visible={publish}
                        title=""
                        onCancel={this.handleCancel}
                        footer={null}
                        closable={false}
                        width="400px"
                    >
                        <div className={styles.formStyle} key="freedomForm">
                            <h2 style={{ textAlign: 'center' }}>确认删除活动</h2>
                            <p
                                style={{
                                    fontSize: '10px',
                                    color: '#999999',
                                    textAlign: 'center',
                                    margin: '-10px 0px 12px 0px',
                                }}
                            >
                                {'本次操作将删除本次及以后共' +
                                    ((accountCourseNum && accountCourseNum.amount) || 0) +
                                    '个活动安排，若活动已公布，将同步删除日程'}
                            </p>
                            {!freeCourseDetail.freePublish && (
                                <div>
                                    <div>
                                        <span style={{ color: '#f5222d' }}>*</span>
                                        <span style={{ fontWeight: '600', marginBottom: '8px' }}>
                                            是否将此改动公布到日程:
                                        </span>
                                        <div style={{ height: '4px' }}></div>
                                        <Radio.Group
                                            onChange={this.onChangeGroup}
                                            value={ifpublish}
                                        >
                                            <Radio style={{ fontSize: '10px' }} value={true}>
                                                是
                                            </Radio>
                                            <span style={{ fontSize: '10px', color: '#999999' }}>
                                                (该日程将同步从日程中删除并立即生效日程)
                                            </span>
                                            <tr></tr>
                                            <Radio style={{ fontSize: '10px' }} value={false}>
                                                否
                                            </Radio>
                                            <span style={{ fontSize: '10px', color: '#999999' }}>
                                                (仅在课表中删除，可通过公共课表一并生效到日程)
                                            </span>
                                        </Radio.Group>
                                    </div>
                                    {ifpublish && (
                                        <div style={{ margin: '8px 4px', fontSize: '10px' }}>
                                            <span style={{ marginBottom: '6px' }}>
                                                选择通知人员范围:
                                            </span>
                                            <tr></tr>
                                            <Checkbox.Group
                                                onChange={this.checkboxGroup}
                                                options={options}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div style={{ marginTop: '16px', textAlign: 'center' }}>
                            <Button
                                style={{ marginRight: '8px' }}
                                shape="round"
                                onClick={this.cancelFrom}
                            >
                                放弃
                            </Button>
                            <Button type="primary" shape="round" onClick={this.confirmDeleteCoure1}>
                                {ifpublish ? '保存并公布' : '确认删除'}
                            </Button>
                        </div>
                    </Modal>
                )}

                {deleteThis && (
                    <Modal
                        visible={deleteThis}
                        title=""
                        onCancel={this.handleCancel}
                        footer={null}
                        closable={false}
                        width="400px"
                    >
                        <div className={styles.formStyle} key="freedomForm">
                            <h2 style={{ textAlign: 'center' }}>确认删除活动</h2>
                            <p
                                style={{
                                    fontSize: '10px',
                                    color: '#999999',
                                    textAlign: 'center',
                                    margin: '-10px 0px 12px 0px',
                                }}
                            >
                                本次操作仅删除当前活动安排，若活动已公布，将同步删除日程
                            </p>
                            {!freeCourseDetail.freePublish && (
                                <div>
                                    <div>
                                        <span style={{ color: '#f5222d' }}>*</span>
                                        <span style={{ fontWeight: '600', marginBottom: '8px' }}>
                                            是否将此改动公布到日程:
                                        </span>
                                        <div style={{ height: '4px' }}></div>
                                        <Radio.Group
                                            onChange={this.onChangeGroup}
                                            value={ifpublish}
                                        >
                                            <Radio style={{ fontSize: '10px' }} value={true}>
                                                是
                                            </Radio>
                                            <span style={{ fontSize: '10px', color: '#999999' }}>
                                                (该日程将同步从日程中删除并立即生效日程)
                                            </span>
                                            <tr></tr>
                                            <Radio style={{ fontSize: '10px' }} value={false}>
                                                否
                                            </Radio>
                                            <span style={{ fontSize: '10px', color: '#999999' }}>
                                                (仅在课表中删除，可通过公共课表一并生效到日程)
                                            </span>
                                        </Radio.Group>
                                    </div>
                                    {ifpublish && (
                                        <div style={{ margin: '8px 4px', fontSize: '10px' }}>
                                            <span style={{ marginBottom: '6px' }}>
                                                选择通知人员范围:
                                            </span>
                                            <tr></tr>
                                            <Checkbox.Group
                                                onChange={this.checkboxGroup}
                                                options={options}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div style={{ marginTop: '16px', textAlign: 'center' }}>
                            <Button
                                style={{ marginRight: '8px' }}
                                shape="round"
                                onClick={this.cancelFrom}
                            >
                                放弃
                            </Button>
                            <Button type="primary" shape="round" onClick={this.confirmDeleteCoure2}>
                                {ifpublish ? '保存并公布' : '确认删除'}
                            </Button>
                        </div>
                    </Modal>
                )}

                {this.state.showEditFreedomCourse && (
                    <EditFreedomCourse
                        resultType={this.state.resultType}
                        hideEditFreeModal={this.hideEditFreeModal}
                        gradeByTypeArr={this.props.gradeByTypeArr}
                        payloadTime={this.state.time}
                        currentVersion={currentVersion}
                        showTable={this.props.showTable}
                        getGroupByTree={this.props.getGroupByTree}
                        currentTime={this.props.currentTime}
                        showEditFreedomCourse={this.state.showEditFreedomCourse}
                        timeTableOrClub="timeTable"
                    />
                )}

                {copyDayVisible && (
                    <Modal
                        visible={copyDayVisible}
                        title=""
                        onCancel={this.handleCopyCancel}
                        footer={null}
                        closable={false}
                        width="400px"
                        className={styles.copyDayModal}
                        destroyOnClose={true}
                    >
                        <div className={styles.selectPart}>
                            <span className={styles.label}>
                                将 周{intoChinese(copySourceDay)} 的所有排课结果复制到
                            </span>
                            <Select
                                placeholder="请选择"
                                onChange={this.copySelectChange}
                                style={{ width: '120px' }}
                            >
                                <Option value={1} key={1}>
                                    周一
                                </Option>
                                <Option value={2} key={1}>
                                    周二
                                </Option>
                                <Option value={3} key={1}>
                                    周三
                                </Option>
                                <Option value={4} key={1}>
                                    周四
                                </Option>
                                <Option value={5} key={1}>
                                    周五
                                </Option>
                                <Option value={6} key={1}>
                                    周六
                                </Option>
                                <Option value={7} key={1}>
                                    周日
                                </Option>
                            </Select>
                        </div>
                        <div className={styles.describe}>
                            说明：如果需要复制到周六或周日，请先创建包含周六或周日上课时间定义的作息表，并在课表中更换作息表后再进行复制
                        </div>
                        <div className={styles.btnBox}>
                            <Button onClick={this.handleCopyCancel} className={styles.cancel}>
                                取消
                            </Button>
                            <Button
                                type="primary"
                                onClick={this.confirmCopyDayCourse}
                                loading={this.state.copyLoading}
                            >
                                确认复制
                            </Button>
                        </div>
                    </Modal>
                )}
            </div>
        );
    }
}
