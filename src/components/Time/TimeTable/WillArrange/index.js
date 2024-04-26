//待排课程
import React, { PureComponent, Component } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import icon from '../../../../icon.less';
import {
    Spin,
    Drawer,
    Select,
    Row,
    Col,
    Popover,
    TreeSelect,
    TimePicker,
    Modal,
    message,
    Popconfirm,
    Checkbox,
    Icon,
    Button,
    Tooltip,
} from 'antd';
import { getCourseColor } from '../../../../utils/utils';
import moment from 'moment';
import EditCourse from './editCourse';
import { intoChinese } from '../../../../utils/utils';
import CourseDetail from './courseDetail.js';
import { trans, locale } from '../../../../utils/i18n';
import ExportPlan from '../OperModal/exportPlan';
import { debounce, remove, isEqual } from 'lodash';

const { Option } = Select;
const format = 'HH:mm';
const confirm = Modal.confirm;

import { VerticalAlignBottomOutlined } from '@ant-design/icons';

const week = [
    { id: 1, name: '周一' },
    { id: 2, name: '周二' },
    { id: 3, name: '周三' },
    { id: 4, name: '周四' },
    { id: 5, name: '周五' },
    { id: 6, name: '周六' },
    { id: 7, name: '周日' },
];

let willArrangeDetailTimeOut = null;

@connect((state) => ({
    arrangeDetailList:
        state.timeTable.arrangeDetailList &&
        state.timeTable.arrangeDetailList.weekCoursePlanningDetailView,
    bufferArrangeDetailList:
        state.timeTable.arrangeDetailList &&
        state.timeTable.arrangeDetailList.weekCoursePlanningDetailBufferView,

    scheduleList: state.timeTable.scheduleList,
    changeTimeStatus: state.timeTable.changeTimeStatus,
    showAcCourseList: state.timeTable.showAcCourseList,
    areaList: state.timeTable.areaList,
    statisticsCourse: state.timeTable.statisticsCourse, //待排课数量的优化
    scheduleCheckResult: state.timeTable.scheduleCheckResult, //人工预排-按节-规则校验
    courseDetail: state.timeTable.courseDetail,
    willGroupList: state.timeTable.willGroupList,

    //新增
    teacherList: state.course.teacherList,
    scheduleData: state.timeTable.scheduleData,
    acCourseList: state.timeTable.acCourseList,
    lastPublicContent: state.timeTable.lastPublicContent, //检验当期版本是否发布

    tableView: state.timeTable.tableView,
}))
export default class WillArrange extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showEdit: false,
            selectIndex: 'all', //选中index
            selectGroupId: this.props.willCourseId, //选中班戟的id
            selectCourseId: this.props.willGroupId, //选中课程的id
            selectCourseName: '',
            setType: {}, //设置开始时间类型
            setTimeValue: {},
            setTimePop: {}, //设置时间弹框
            setTeacherPop: {}, //设置教师弹窗
            showMainTeacher: {}, //弹框回显主教老师
            showHelperTeacher: {}, //弹窗回显辅教老师
            weekDay: {},
            courseNode: {},
            addressValue: {},

            newArrangeDetailList: [],
            fetCourseNum: [], //待排课数量的优化

            editCourseModal: false, //编辑课程弹框
            conflictModal: false, //冲突modal的弹出
            conflictCardId: '', //冲突卡片的id

            saveConflictResult: {}, //保存校验冲突规则结果
            showErrorMessage: false, //规则校验失败的原因
            showDetails: false, //查看失败的详细原因

            activeTab: '1',
            vasibal: false, // 课程信息卡片显示
            showEditCourse: false, //系统排课编辑弹窗
            willBorderId: '', // 待排课操作时高亮
            willBorderIdList: [],
            willDoubleCard: '', // 存双击的待排课
            nextClick: false, // 控制pointerEvents
            willCardDetail: '',
            isBuffer: false,
            arrangeDetailList: [],
            bufferArrangeDetailList: [],
            propsArrangeDetailList: [],
            propsBufferArrangeDetailList: [],

            batchOperate: false,
            batchSelect: 0,

            batchDeleteModalVisibility: false,
            batchSuspendModalVisibility: false,
            batchOperateLoading: false,
            batchSelectChecked: false,
        };
        this.willLoading = false;
        this.disableBuffer = false;
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
            'searchIndex',
            'doubleCardUtil',
            'isDoubleTable',
            'studentGroupId',
            'willCourseId',
            'willGroupId',
            'currentVersion',
            'gradeValue',
            'cardUtil',
            'ifMoveLoading',
            'ifExchangeLoading',
            'willCardLight',
            'isDoubleClick',
            'studentGroup',
            'showLoading',
            'lastPublish',
            'arrangeModal',
            'showExchangeClassTable',
            'notShowWillCard',
            'acLoading',
            'changeVersionLoading',
            'lockGray',

            //Modal传递
            'arrangeDetailList',
            'bufferArrangeDetailList',
            'scheduleList',
            'changeTimeStatus',
            'showAcCourseList',
            'areaList',
            'statisticsCourse',
            'scheduleCheckResult',
            'courseDetail',
            'willGroupList',

            'teacherList',
            'scheduleData',
            'acCourseList',
            'lastPublicContent',
        ];
        if (
            arr.find((item) => {
                if (!isEqual(nextProps[item], this.props[item])) {
                    return true;
                }
            })
        ) {
            return false;
        } else {
            return true;
        }
    };

    componentDidMount() {
        let { onRef } = this.props;
        typeof onRef === 'function' && onRef(this);
    }

    componentWillReceiveProps(nextProps) {
        let strProps = JSON.stringify(nextProps.arrangeDetailList);
        let str = JSON.stringify(this.state.propsArrangeDetailList);
        let bufferStrProps = JSON.stringify(nextProps.bufferArrangeDetailList);
        let bufferStr = JSON.stringify(this.state.propsBufferArrangeDetailList);

        if (strProps !== str || bufferStrProps !== bufferStr) {
            this.dealArrangeList(nextProps); // 处理待排列表
        }
    }

    dealArrangeList = (nextProps) => {
        const propsArrangeDetailList = nextProps.arrangeDetailList;
        const propsBufferArrangeDetailList = nextProps.bufferArrangeDetailList;
        let arrangeDetailList = [];
        let bufferArrangeDetailList = [];
        // 待排课
        propsArrangeDetailList &&
            propsArrangeDetailList.length > 0 &&
            propsArrangeDetailList.map((item, index) => {
                if (item.singleModels && item.doubleModels) {
                    arrangeDetailList = [
                        ...arrangeDetailList,
                        ...item.singleModels.concat(item.doubleModels),
                    ];
                } else {
                    arrangeDetailList = item.singleModels
                        ? [...arrangeDetailList, ...item.singleModels]
                        : item.doubleModels
                        ? [...arrangeDetailList, ...item.doubleModels]
                        : [];
                }
            });

        // 缓冲区
        propsBufferArrangeDetailList &&
            propsBufferArrangeDetailList.length > 0 &&
            propsBufferArrangeDetailList.map((item, index) => {
                if (item.singleModels && item.doubleModels) {
                    bufferArrangeDetailList = [
                        ...bufferArrangeDetailList,
                        ...item.singleModels.concat(item.doubleModels),
                    ];
                } else {
                    bufferArrangeDetailList = item.singleModels
                        ? [...bufferArrangeDetailList, ...item.singleModels]
                        : item.doubleModels
                        ? [...bufferArrangeDetailList, ...item.doubleModels]
                        : [...bufferArrangeDetailList];
                }
            });

        this.setState({
            arrangeDetailList: [...arrangeDetailList],
            bufferArrangeDetailList: [...bufferArrangeDetailList],
            propsArrangeDetailList,
            propsBufferArrangeDetailList,
        });
    };

    onClose = () => {
        const { hideModal, fetchCourseDetail } = this.props;
        typeof hideModal === 'function' && hideModal('hideArrange');
        // typeof fetchCourseDetail == "function" && fetchCourseDetail(id,type);
        this.setState({
            selectGroupId: undefined,
            selectCourseId: undefined,
            showEdit: false,
            newArrangeDetailList: [],
            fetCourseNum: [],
            activeTab: '1',
        });
    };

    //选择班级
    changeGroup = (value) => {
        const { selectCourseId } = this.state;
        this.setState(
            {
                selectGroupId: value,
                showEdit: true,
                newArrangeDetailList: [],
                fetCourseNum: [],
            },
            () => {
                this.fetchWillArrangeList(selectCourseId, undefined, undefined, true);
            }
        );
    };

    //搜索课程
    changeCourse = (value) => {
        this.setState({
            selectCourseId: value,
            showEdit: true,
            newArrangeDetailList: [],
            fetCourseNum: [],
            selectIndex: '',
        });
        const targetEle = document.getElementById(`data-${value}`);
        targetEle &&
            targetEle.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        const { fetchCourseList, getCourseAndGroup } = this.props;
        const { selectGroupId } = this.state;
        // 获取相应班级，课程列表，中间课程详情列表
        typeof getCourseAndGroup === 'function' && getCourseAndGroup(value, selectGroupId, true);
    };

    //获取待排课程列表（中间列表部分）
    //selectCourseId：选择课程id，name：选择课程名字，index：选择课程的名字，isClickList：是否是点击筛选
    fetchWillArrangeList = (selectCourseId, name, index, isClickList) => {
        const { selectGroupId } = this.state;
        this.setState({
            showEdit: true,
            selectIndex: index,
            selectCourseName: name,
            selectCourseId,
        });
        this.props.getCourseAndGroup(selectCourseId, selectGroupId, isClickList); // 请求待排课程列表（中间列表部分）
        if (index === 'number') {
            this.getStatisticCourse(selectCourseId, selectGroupId);
        }
    };

    //获取版本内的年级
    getGradeByVersion = () => {
        const { dispatch, currentVersion } = this.props;
        dispatch({
            type: 'timeTable/fetchGradeListBySubject',
            payload: {
                versionId: currentVersion,
            },
        });
    };

    //处理班级
    handleClass = (arr) => {
        if (!arr) return;
        return arr[arr.length - 1]?.name.replace('（', '(').replace('）', ')');
    };

    //处理待排课节数量
    handleStatisticCourse = (arr) => {
        if (!arr || arr.length <= 0) return '';
        let courseResult = [];
        arr.map((item) => {
            let str = item.singleTime + 'min ' + item.duration + '个';
            courseResult.push(str);
        });
        return courseResult.join('/');
    };

    //处理教师数据
    formatTeacherData = (teacherList) => {
        if (!teacherList || teacherList.length < 0) return;
        let teacherData = [];
        teacherList.map((item, index) => {
            let obj = {};
            obj.title = item.name;
            obj.key = item.teacherId;
            obj.value = item.teacherId;
            obj.ename = item.englishName;
            teacherData.push(obj);
        });
        return teacherData;
    };

    //选择教师
    changeTeacher = (id, value) => {
        let teacherValue = Object.assign({}, this.state.showMainTeacher);
        teacherValue[id] = value;
        this.setState({
            showMainTeacher: teacherValue,
        });
    };

    //选择协同老师
    changeHelper = (id, value) => {
        let helperTeacher = Object.assign({}, this.state.showHelperTeacher);
        helperTeacher[id] = value;
        this.setState({
            showHelperTeacher: helperTeacher,
        });
    };

    //选择主教和辅助老师
    setMainTeacher = (id) => {
        const { teacherList } = this.props;
        const { showMainTeacher, showHelperTeacher } = this.state;
        const treeProps = {
            style: { width: 248 },
            dropdownStyle: { maxHeight: 400, overflow: 'auto' },
            treeCheckable: true,
            treeNodeFilterProp: 'title',
        };
        return (
            <div className={styles.selectTeacher}>
                <p>主教老师</p>
                <TreeSelect
                    treeData={this.formatTeacherData(teacherList)}
                    value={showMainTeacher[id]}
                    placeholder="请选择主教老师"
                    onChange={this.changeTeacher.bind(this, id)}
                    {...treeProps}
                />
                <p>协同老师</p>
                <TreeSelect
                    treeData={this.formatTeacherData(teacherList)}
                    value={showHelperTeacher[id]}
                    placeholder="请选择协同老师"
                    onChange={this.changeHelper.bind(this, id)}
                    {...treeProps}
                />
                <p className={styles.operBtn}>
                    <span
                        className={styles.cancelBtn}
                        onClick={this.hidePopOver.bind(this, 'setTeacherPop', id)}
                    >
                        取消
                    </span>
                    <span className={styles.confirmBtn} onClick={this.saveTeacher.bind(this, id)}>
                        确定
                    </span>
                </p>
            </div>
        );
    };

    //确认修改教师
    saveTeacher = (id) => {
        const {
            showMainTeacher,
            showHelperTeacher,
            selectCourseId,
            selectIndex,
            selectCourseName,
        } = this.state;
        const { dispatch, currentVersion } = this.props;
        if (JSON.stringify(showMainTeacher[id]) == '[]') {
            message.info('请选择主教老师或协同老师');
            return false;
        }
        dispatch({
            type: 'timeTable/saveCardTeacher',
            payload: {
                id: id,
                versionId: currentVersion,
                primaryTeacherIds: showMainTeacher[id],
                auxiliaryTeacherIds: showHelperTeacher[id],
            },
            onSuccess: () => {
                this.hidePopOver('setTeacherPop', id);
                this.fetchWillArrangeList(selectCourseId, selectCourseName, selectIndex);
                this.setState({
                    showMainTeacher: {},
                    showHelperTeacher: {},
                });
            },
        });
    };

    //修改设置开始时间类型
    changeSetType(id, value) {
        let type = Object.assign({}, this.state.setType);
        type[id] = value;
        let addressValue = Object.assign({}, this.state.addressValue);
        addressValue[id] = undefined;
        this.setState({
            setType: type,
            addressValue: addressValue,
        });
    }
    //按时间选择时间
    changeSetTime(id, time, timeString) {
        let timeValue = Object.assign({}, this.state.setTimeValue);
        timeValue[id] = timeString;
        this.setState({
            setTimeValue: timeValue,
        });
    }

    //获取作息id
    getBaseScheduleId = (id, type) => {
        const { scheduleList } = this.props;
        let baseScheduleId;
        let lesson;
        if (!scheduleList || scheduleList.length <= 0) return;
        scheduleList.map((item) => {
            if (item.id == id) {
                baseScheduleId = item.baseScheduleId;
                lesson = item.lesson;
            }
        });
        if (type == 'baseScheduleId') {
            return baseScheduleId;
        }
        if (type == 'lesson') {
            return lesson;
        }
    };

    //是否检验规则
    ifValidateRules = (id, e) => {
        const { dispatch, currentVersion } = this.props;
        const { weekDay, courseNode, addressValue } = this.state;
        if (e.target.checked) {
            let saveConflict = Object.assign({}, this.state.saveConflictResult);
            saveConflict[id] = '';
            this.setState({
                saveConflictResult: saveConflict,
            });
            //获取作息id
            let baseScheduleId = this.getBaseScheduleId(courseNode[id], 'baseScheduleId');
            let lesson = this.getBaseScheduleId(courseNode[id], 'lesson');
            dispatch({
                type: 'timeTable/manualScheduleCheck',
                payload: {
                    versionId: currentVersion,
                    activityId: id,
                    scheduleId: baseScheduleId,
                    weekDay: weekDay[id], //周几
                    lesson: lesson, //要换的节次
                    roomId: addressValue[id], //场地id
                },
                onSuccess: () => {
                    const { scheduleCheckResult } = this.props;
                    let saveConflictResult = Object.assign({}, this.state.saveConflictResult);
                    saveConflictResult[id] = scheduleCheckResult;
                    this.setState({
                        saveConflictResult: saveConflictResult,
                    });
                },
            });
        }
    };

    //保存设置开始时间
    saveChangeTime = (id, type) => {
        const { weekDay, courseNode, setTimeValue, addressValue } = this.state;
        const { dispatch } = this.props;
        if (type == 'jieci') {
            //修改节次
            if (!weekDay[id] || !courseNode[id]) {
                message.info('请完善信息再提交');
                return false;
            }
            dispatch({
                type: 'timeTable/saveChangeTime',
                payload: {
                    acId: id,
                    weekDay: weekDay[id],
                    scheduleDetailId: courseNode[id] ? [courseNode[id]] : [],
                    roomId: addressValue[id],
                },
            }).then(() => {
                const { changeTimeStatus } = this.props;
                if (changeTimeStatus && changeTimeStatus.conflict) {
                    this.setState({
                        conflictModal: true,
                        conflictCardId: id,
                    });
                } else if (changeTimeStatus && !changeTimeStatus.conflict) {
                    this.continueArrange(id, '');
                    this.hidePopOver('setTimePop', id);
                }
            });
        } else if (type == 'time') {
            //新建人工自由排课
            if (!weekDay[id]) {
                message.info('请完善信息再提交');
                return false;
            }
            dispatch({
                type: 'timeTable/saveFreeScheduleTime',
                payload: {
                    acId: id,
                    weekDay: weekDay[id],
                    startHourAndMinute: setTimeValue[id] ? setTimeValue[id] : '8:00',
                    roomId: addressValue[id],
                },
                onSuccess: () => {
                    //调用课程表接口/卡片接口/课程列表
                    const { fetchScheduleList, fetchCourseList } = this.props;
                    const { selectCourseId, selectIndex, selectCourseName, selectGroupId } =
                        this.state;
                    this.fetchWillArrangeList(selectCourseId, selectCourseName, selectIndex);
                    this.hidePopOver('setTimePop', id);
                    let course = selectCourseId ? selectCourseId : '',
                        grade = selectGroupId ? selectGroupId : '';
                    typeof fetchCourseList === 'function' && fetchCourseList(course, grade);
                    typeof fetchScheduleList === 'function' && fetchScheduleList.call(this);
                },
            });
        }
    };

    //处理冲突课程名称
    getCourseName = (conflictCourse) => {
        if (!conflictCourse) return '';
        let courseName = '';
        conflictCourse &&
            conflictCourse.length > 0 &&
            conflictCourse.map((item, index) => {
                courseName += item.name + ' ';
            });
        return courseName;
    };

    //继续待排或者确认修改时间
    continueArrange = (id, resultId) => {
        const { dispatch } = this.props;
        const { weekDay, courseNode, addressValue } = this.state;
        dispatch({
            type: 'timeTable/continueArrange',
            payload: {
                acId: id,
                weekDay: weekDay[id],
                scheduleDetailId: courseNode[id] ? [courseNode[id]] : [],
                resultId: resultId ? resultId : [],
                roomId: addressValue[id],
            },
            onSuccess: () => {
                this.setState({
                    conflictModal: false,
                });
                //调用课程表接口/卡片接口/课程列表
                const { fetchScheduleList, fetchCourseList } = this.props;
                const { selectCourseId, selectIndex, selectCourseName, selectGroupId } = this.state;
                this.fetchWillArrangeList(selectCourseId, selectCourseName, selectIndex);
                this.hidePopOver('setTimePop', id);
                let course = selectCourseId ? selectCourseId : '',
                    grade = selectGroupId ? selectGroupId : '';
                typeof fetchCourseList === 'function' && fetchCourseList(course, grade);
                typeof fetchScheduleList === 'function' && fetchScheduleList.call(this);
            },
        });
    };

    //选择周几
    changeWeek(id, value) {
        let selectDay = Object.assign({}, this.state.weekDay);
        selectDay[id] = value;
        this.setState(
            {
                weekDay: selectDay,
            },
            () => {
                const { setType } = this.state;
                if (setType[id] == 'jieci') {
                    const { dispatch } = this.props;
                    dispatch({
                        type: 'timeTable/getScheduleDetailList',
                        payload: {
                            id: id,
                            weekDay: value,
                        },
                    });
                }
            }
        );
    }

    //选择节次
    changeCourseNode = (id, value) => {
        let course = Object.assign({}, this.state.courseNode);
        course[id] = value;
        this.setState({
            courseNode: course,
        });
    };

    //选择场地
    changeAddress = (id, value) => {
        let address = Object.assign({}, this.state.addressValue);
        address[id] = value;
        this.setState({
            addressValue: address,
        });
    };

    //隐藏popover
    hidePopOver = (type, id) => {
        switch (type) {
            case 'setTimePop':
                let setTimePopState = Object.assign({}, this.state.setTimePop);
                setTimePopState[id] = false;
                let selectWeek = Object.assign({}, this.state.weekDay);
                selectWeek[id] = undefined;
                let selectCourseId = Object.assign({}, this.state.courseNode);
                selectCourseId[id] = undefined;
                let selectType = Object.assign({}, this.state.setType);
                selectType[id] = undefined;
                let selectAddress = Object.assign({}, this.state.addressValue);
                selectAddress[id] = undefined;
                let saveConflict = Object.assign({}, this.state.saveConflictResult);
                saveConflict[id] = undefined;
                this.setState({
                    weekDay: selectWeek,
                    setType: selectType,
                    courseNode: selectCourseId,
                    setTimePop: setTimePopState,
                    addressValue: selectAddress,
                    saveConflictResult: saveConflict,
                });
                break;
            case 'setTeacherPop':
                let setTeacherPopState = Object.assign({}, this.state.setTeacherPop);
                setTeacherPopState[id] = false;
                this.setState({
                    setTeacherPop: setTeacherPopState,
                });
                break;
        }
    };

    //获取教师id
    getTeacherId = (arr) => {
        if (!arr) return [];
        let idArr = [];
        arr.map((item, index) => {
            idArr.push(item.id);
        });
        return idArr;
    };
    //复制卡片
    copyCard = (id) => {
        const { dispatch } = this.props;
        const { selectCourseId, selectIndex, selectCourseName } = this.state;
        dispatch({
            type: 'timeTable/copyCard',
            payload: {
                id: id,
            },
            onSuccess: () => {
                const { fetchCourseList } = this.props;
                const { selectCourseId, selectGroupId } = this.state;
                let course = selectCourseId ? selectCourseId : '',
                    grade = selectGroupId ? selectGroupId : '';
                this.fetchWillArrangeList(selectCourseId, selectCourseName, selectIndex);
                typeof fetchCourseList === 'function' && fetchCourseList(course, grade);
            },
        });
    };

    //删除卡片
    deleteCard = (id) => {
        const { dispatch } = this.props;
        const { selectCourseId, selectIndex, selectCourseName } = this.state;
        var self = this;
        confirm({
            title: '您确定要删除这节待排课吗？',
            content: '',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'timeTable/deleteCard',
                    payload: {
                        id: id,
                    },
                    onSuccess: () => {
                        const { fetchCourseList } = self.props;
                        const { selectCourseId, selectGroupId } = self.state;
                        let course = selectCourseId ? selectCourseId : '',
                            grade = selectGroupId ? selectGroupId : '';
                        self.fetchWillArrangeList(selectCourseId, selectCourseName, selectIndex);
                        typeof fetchCourseList === 'function' && fetchCourseList(course, grade);
                    },
                });
            },
        });
    };

    //编辑课程弹窗
    showEditCourse(e, id) {
        this.setState({
            editCourseModal: true,
            selectCourseId: id,
        });
    }

    //关闭编辑课程弹窗
    hideEditModal = (type) => {
        this.setState({
            editCourseModal: false,
        });
        if (type == 'deleAll') {
            this.setState({
                showEdit: false,
                selectIndex: 'all',
                selectCourseId: undefined,
            });
        }
    };

    //关闭冲突课程弹窗
    handleCancelConflict = () => {
        this.setState({
            conflictModal: false,
        });
    };

    //查询待排课程数量的优化
    getStatisticCourse(id, groupId) {
        const { dispatch, currentVersion, gradeValue } = this.props;
        dispatch({
            type: 'timeTable/statisticsCourse',
            payload: {
                versionId: currentVersion,
                courseId: id,
                groupId,
                gradeIds: gradeValue,
            },
            onSuccess: () => {
                const { statisticsCourse } = this.props;
                this.setState({
                    fetCourseNum: statisticsCourse,
                });
            },
        });
    }

    //查看规则冲突详情
    showErrorDetail(id) {
        let showErrorMessage = Object.assign({}, this.state.showErrorMessage);
        showErrorMessage[id] = true;
        this.setState({
            showErrorMessage: showErrorMessage,
        });
    }

    //知道了
    haveKnow(id) {
        let showErrorMessage = Object.assign({}, this.state.showErrorMessage);
        showErrorMessage[id] = false;
        let showDetails = Object.assign({}, this.state.showDetails);
        showDetails[id] = false;
        this.setState({
            showErrorMessage: showErrorMessage,
            showDetails: showDetails,
        });
    }

    //查看详情
    lookDetail(id) {
        let showDetails = Object.assign({}, this.state.showDetails);
        if (showDetails[id] === undefined) {
            showDetails[id] = true;
        } else {
            showDetails[id] = !this.state.showDetails[id];
        }
        this.setState({
            showDetails: showDetails,
        });
    }

    //切换菜单
    changeTab = (type) => {
        this.setState(
            {
                activeTab: type,
                selectGroupId: undefined,
                selectCourseId: undefined,
                showEdit: false,
                newArrangeDetailList: [],
                fetCourseNum: [],
            },
            () => {
                this.props.getCourseAndGroup(undefined, undefined);
            }
        );
    };

    getLayerClasslistByAcId = (item) => {
        if (item.acId) {
            let domList = Array.from(document.querySelectorAll(`[data-acid='${item.acId}']`));
            return domList.map((item) => Number(item.dataset.studentgroupid));
        } else {
            return [];
        }
    };

    getLayerClasslistByDetailId = (item) => {
        if (item.compareGroupIdList) {
            return item.compareGroupIdList;
        } else return [];
    };

    // 点击转待排
    handleArrangeCourse = (e) => {
        e.stopPropagation();
        const {
            dispatch,
            cardUtil,
            doubleCardUtil,
            ifExchangeLoading,
            ifMoveLoading,
            isDoubleTable,
        } = this.props;

        if (ifExchangeLoading || ifMoveLoading) {
            return;
        }
        if (isDoubleTable) {
            if (doubleCardUtil.ifLock) {
                message.warning('课程锁定 无法进行转待排');
                return;
            }
        }

        let source = { ...cardUtil };

        const lessonRelateInfo = {
            sourceGroupIdList:
                source.detail && source.detail.studentGroups
                    ? source.detail.studentGroups.map((item) => item.id)
                    : [],
            sourceMainTeacherIdList:
                source.detail && source.detail.mainTeachers
                    ? source.detail.mainTeachers.map((item) => item.id)
                    : [],
            sourceAssistantTeacherIdList:
                source.detail && source.detail.assistantTeachers
                    ? source.detail.assistantTeachers.map((item) => item.id)
                    : [],
            sourceRoomId: source.detail && source.detail.roomId ? [source.detail.roomId] : [],

            /*   sourceLesson: source.lesson,
            sourceWeekDay: source.weekDay, */

            layerClassIdList: [
                ...this.getLayerClasslistByAcId(source),
                ...this.getLayerClasslistByDetailId(source),
            ],

            flag: Boolean(true),
        };

        dispatch({
            type: 'timeTable/changeArrange',
            payload: {
                id: cardUtil.resultId,
            },
            onSuccess: () => {
                this.props.showTable('clickSelf', lessonRelateInfo); // 刷新课表
                this.props.getshowAcCourseList(false, true, 'add'); // 请求待排相关内容
                this.props.willCardLightState(); // 待排课程卡片选中状态边框
            },
        });
    };

    // 保存单击的detailId
    saveWillDetailId = (id) => {
        this.setState({
            willBorderId: id,
        });
    };

    // 待排 查看详情
    willArrangeDetail(el) {
        console.log('willArrangeDetail');
        clearTimeout(willArrangeDetailTimeOut);
        willArrangeDetailTimeOut = setTimeout(() => {
            const { batchOperate } = this.state;
            //判断是否是批量操作状态
            if (batchOperate && !el.detail.isBuffer) {
                let { willBorderIdList } = this.state;
                let targetCourseId = el.detail.id;
                if (willBorderIdList.includes(targetCourseId)) {
                    this.setState({
                        willBorderIdList: remove(
                            willBorderIdList,
                            (item) => item !== targetCourseId
                        ),
                    });
                } else {
                    this.setState({
                        willBorderIdList: [...willBorderIdList, targetCourseId],
                    });
                }
            } else {
                const { willCardLight, cardUtil, isDoubleClick } = this.props;
                const { willCardDetail } = this.state;
                this.props.setIsDoubleClickFalse();
                // 双击后再次点击取消排课
                if (isDoubleClick && willCardLight && el.detail.id == willCardDetail.id) {
                    this.props.setNotShowWillCard(); // 控制待排区双击中间转待排卡片显示状态
                    this.setState({
                        nextClick: false, // 控制pointerEvents
                    });
                    this.props.showTable('待排取消', {
                        flag: true,
                    });
                    return;
                }

                //去掉setTimeout
                if (!this.props.isDoubleClick) {
                    // 单击待排卡片清空课表单击id
                    this.props.saveDetailId(
                        el.detail.id,
                        2,
                        el.detail,
                        el.studentGroups.id,
                        'click',
                        this.props.studentGroup,
                        el
                    );
                }
                this.saveWillDetailId(el.detail.id); // 保存单击的detailId

                this.props.setLock('lockOff');
            }
        }, 200);
    }
    // 待排 双击调换课
    willArrangeExchange = async (el) => {
        clearTimeout(willArrangeDetailTimeOut);
        const { ifExchangeLoading, ifMoveLoading, showLoading, tableView } = this.props;
        const { batchOperate } = this.state;

        if (tableView === 'weekLessonView') {
            message.warning('请在每个班级课表的待排区双击排课哦～');
            return;
        }
        if (batchOperate) {
            message.info('批量操作状态下，请勿进行调换课操作');
            return;
        }

        if (this.willLoading) {
            return false;
        }
        this.willLoading = true;
        this.props.setIsDoubleClick();
        if (this.props.lastPublish) {
            this.willLoading = false;
            return;
        }
        this.props
            .dispatch({
                type: 'exchangeCourse/clearMoveList',
            })
            .then(() => {
                setTimeout(() => {
                    this.props.setIfExchangeLoading();
                }, 500);
            });
        this.setState({
            willBorderId: el.detail.id,
            nextClick: true,
            willCardDetail: el.detail,
        });
        this.props.willMoveClass(el.detail.id); // 请求待排可选结果中获取课表高亮的班级信息
        this.props.saveDetailId(
            el.detail.id,
            2,
            el.detail,
            this.props.studentGroupId,
            'click',
            this.props.studentGroup,
            el
        );
        if (!ifExchangeLoading && !ifMoveLoading && !showLoading) {
            this.willLoading = false;
        }
    };

    // 选择年级课程列表默认选中全部
    handleAll = () => {
        this.setState({
            selectIndex: 'all',
        });
    };

    // 清空课程和班级
    clearCourseAndGroup = () => {
        this.setState({
            selectGroupId: undefined,
            selectCourseId: undefined,
            selectIndex: 'all',
        });
    };
    // 将nextClick改为false来控制pointerEvents
    nextClickClear = () => {
        this.setState({
            nextClick: false,
        });
    };

    // 点击退出调课按钮的方法
    exitExchange = () => {
        const lessonRelateInfo = {
            sourceGroupIdList: [],
            sourceMainTeacherIdList: [],
            sourceRoomId: [],
            sourceAssistantTeacherIdList: [],

            targetGroupIdList: [],
            targetMainTeacherIdList: [],
            targetAssistantTeacherIdList: [],
            targetRoomId: [],
            gradeId: '',
            flag: Boolean(true),
        };
        this.props.saveDetailId('', 2); // 获取待排课的第一个的详情
        this.props.showTable('exitExchange', lessonRelateInfo);
        this.props.setNotShowWillCard();
    };

    // ac缓冲区移动
    handleAcBuffer = (id, type, el, e) => {
        if (e) {
            e.stopPropagation();
        }
        if (this.disableBuffer) {
            return;
        }
        this.disableBuffer = true;
        const { dispatch, saveDetailId, currentVersion } = this.props;
        let { bufferArrangeDetailList, arrangeDetailList } = this.state;
        const ids = [];
        if (id == 'all') {
            for (let j = 0; j < bufferArrangeDetailList.length; j++) {
                ids.push(bufferArrangeDetailList[j].detail.id);
            }
        } else {
            ids.push(id);
        }
        dispatch({
            type: 'exchangeCourse/updateACToBuffer',
            payload: {
                acIdList: ids,
                isBuffer: type,
                versionId: currentVersion,
            },
            onSuccess: () => {
                this.disableBuffer = false;
            },
        }).then(() => {
            this.disableBuffer = false;
            const { fetchWillArrangeList } = this.props;
            typeof fetchWillArrangeList === 'function' && fetchWillArrangeList();
        });
    };

    showExportPlanModal = (e, id) => {
        e.stopPropagation();
        this.setState({
            exportPlanVisible: true,
            selectCourseId: id,
        });
    };

    hideExportPlanModal = () => {
        this.setState({
            exportPlanVisible: false,
        });
    };

    //筛选课表中未锁定课节
    getUnlockResultIdList = (scheduleData) => {
        let resArr = [];
        scheduleData.forEach((item) => {
            item.resultList.forEach((item) => {
                item.forEach((item) => {
                    if (item.acDuration && !item.ifLock) {
                        resArr.push(item.resultId);
                    }
                });
            });
        });
        return resArr;
    };

    //一键转待排
    onKeyToArrange = () => {
        const {
            dispatch,
            currentVersion,
            fetchScheduleList,
            fetchWillArrangeList,
            fetchCourseList,
            scheduleData,
            getArrangeListFirst,
            setDetailId,
            changeVersionShowLoading,
        } = this.props;
        let resultIdList = this.getUnlockResultIdList(scheduleData);
        if (resultIdList.length === 0) {
            message.warning('课节全部锁定，请先解锁再转待排');
            return;
        }
        changeVersionShowLoading(true);
        dispatch({
            type: 'timeTable/batchArrange',
            payload: {
                versionId: currentVersion,
                resultIdList,
            },
            onSuccess: () => {
                setDetailId();
                fetchWillArrangeList();
                fetchScheduleList();
                fetchCourseList();
                getArrangeListFirst();
            },
        }).then(() => {
            changeVersionShowLoading(false);
        });
    };

    handleBatchOperate = () => {
        this.setState({ batchOperate: true });
    };

    batchOperateCancel = () => {
        this.setState({ batchOperate: false, willBorderIdList: [], batchSelectChecked: false });
    };

    handleBatchDeleteOrSuspend = (operateType) => {
        const { currentVersion, dispatch, fetchWillArrangeList, fetchCourseList } = this.props;
        const { willBorderIdList } = this.state;
        this.setState({
            batchOperateLoading: true,
        });
        dispatch({
            type:
                operateType === 'delete'
                    ? 'timeTable/batchDeletedAC'
                    : 'exchangeCourse/updateACToBuffer',
            payload:
                operateType === 'delete'
                    ? {
                          versionId: currentVersion,
                          acIdList: willBorderIdList,
                      }
                    : {
                          versionId: currentVersion,
                          acIdList: willBorderIdList,
                          isBuffer: true,
                      },
        }).then(() => {
            this.setState({
                willBorderIdList: [],
                batchDeleteModalVisibility: false,
                batchSuspendModalVisibility: false,
                batchOperateLoading: false,
                batchSelectChecked: false,
            });
            fetchWillArrangeList(); //待排中间部分
            fetchCourseList(); //待排左侧部分
        });
    };

    handleModalCancel = () => {
        this.setState({
            batchDeleteModalVisibility: false,
            batchSuspendModalVisibility: false,
            batchSelectChecked: false,
        });
    };

    handleBatchSelect = (e) => {
        const { arrangeDetailList } = this.state;
        let checked = e.target.checked;
        if (checked) {
            this.setState({
                willBorderIdList: arrangeDetailList.map((el) => el.detail.id),
                batchSelectChecked: checked,
            });
        } else {
            this.setState({
                willBorderIdList: [],
                batchSelectChecked: checked,
            });
        }
    };

    render() {
        console.log('WillArrange render');
        const {
            arrangeModal,
            courseList,
            acCourseList,

            changeTimeStatus, //冲突结果
            showAcCourseList,
            statisticsCourse, //待排课数量的优化
            showExchangeClassTable,
            willGroupList,
            notShowWillCard, // 双击待排区为 true，不隐藏筛选和卡片
            acLoading,
            changeVersionLoading,
            isDoubleClick, // 是否为双击待排区的卡片
            ifExchangeLoading,
            ifMoveLoading,
            showLoading,
            currentVersion,
        } = this.props;
        const {
            selectCourseName,
            showEdit,
            selectIndex,
            setTimePop,
            setTeacherPop,
            editCourseModal,
            selectGroupId,
            selectCourseId,
            newArrangeDetailList,
            fetCourseNum,
            conflictModal,
            conflictCardId,
            activeTab,
            arrangeDetailList,
            bufferArrangeDetailList,
            selectId,
            batchOperate,
            batchSelect,
            willBorderIdList,
            willBorderId,
            batchDeleteModalVisibility,
            batchSuspendModalVisibility,
            batchOperateLoading,
            batchSelectChecked,
        } = this.state;
        const allCourseNotArrange = (acCourseList && acCourseList.allCourseNotArrangeAcSum) || 0;
        const allCourseAlreadyArrangeAcSum =
            (acCourseList && acCourseList.allCourseAlreadyArrangeAcSum) || 0;
        let conflictResult = (changeTimeStatus && changeTimeStatus.conflictResult) || [];
        let conflictCourseIds = []; //冲突课程id
        let courseModels = (acCourseList && acCourseList.courseModels) || []; //待排课
        let courseAlreadyArrangeModels =
            (acCourseList && acCourseList.courseAlreadyArrangeModels) || []; //已排课
        let leftBarCourseList = activeTab == '1' ? courseModels : courseAlreadyArrangeModels;
        let loadingStatus = !ifExchangeLoading && !ifMoveLoading ? false : true;
        // let num = willBorderIdList.length ? willBorderIdList.length : '0';
        return (
            <div>
                <Drawer
                    visible={arrangeModal}
                    title={[
                        <div className={styles.waitHave} key="waitHave">
                            <span
                                className={
                                    activeTab == '1' ? styles.waitCourseText : styles.haveCourseText
                                }
                                style={{ marginRight: 20 }}
                                onClick={() => this.changeTab('1')}
                                key="toBeArranged"
                            >
                                {trans('global.toBeArranged', '待排课程')}（{allCourseNotArrange}）
                            </span>
                            <span
                                className={
                                    activeTab == '2' ? styles.waitCourseText : styles.haveCourseText
                                }
                                onClick={() => this.changeTab('2')}
                                key="arranged"
                            >
                                {trans('global.arranged', '已排课程')}（
                                {allCourseAlreadyArrangeAcSum}）
                            </span>

                            <span>
                                <Popconfirm
                                    title="是否确认将当前课表全部未锁定课节一键转为待排"
                                    onConfirm={debounce(this.onKeyToArrange, 800)}
                                    okText="是"
                                    cancelText="否"
                                    cancelButtonProps={{ size: 'small' }}
                                    okButtonProps={{ size: 'small' }}
                                    key="arrangePopconfirm"
                                >
                                    <VerticalAlignBottomOutlined
                                        title="一键转待排"
                                        className={styles.onKeyToArrange}
                                    />
                                </Popconfirm>
                            </span>
                        </div>,
                        <div className={styles.courseDetail} key="courseDetail">
                            {!batchOperate && (
                                <CourseDetail
                                    {...this.props}
                                    {...this.state}
                                    getArrangeListFirst={this.props.getArrangeListFirst}
                                    handleArrangeCourse={this.handleArrangeCourse}
                                    lastPublicContent={this.props.lastPublicContent}
                                    arrangeModal={this.props.arrangeModal}
                                    handleAcBuffer={this.handleAcBuffer}
                                    changeCourse={this.changeCourse}
                                    fetchCourseList={this.props.fetchCourseList}
                                    getLessonViewMsg={this.props.getLessonViewMsg}
                                />
                            )}
                        </div>,
                        <div key="arrangedFold">
                            {!batchOperate && (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {showExchangeClassTable && !batchOperate && (
                                        <span
                                            className={styles.exit}
                                            onClick={this.exitExchange}
                                            id="exitExchange"
                                        >
                                            退出调课
                                        </span>
                                    )}

                                    {!showExchangeClassTable && (
                                        <div
                                            className={styles.collapsedText}
                                            onClick={this.handleBatchOperate}
                                        >
                                            {trans('student.batchOperation', '批量操作')}
                                        </div>
                                    )}
                                    {
                                        // !showExchangeClassTable &&
                                        <span
                                            className={styles.collapsedText}
                                            onClick={this.onClose}
                                        >
                                            {trans('global.arrangedFold', '收起')}
                                            <i className={icon.iconfont}>&#xe613;</i>
                                        </span>
                                    }
                                </div>
                            )}
                        </div>,
                        <div
                            style={{ width: batchOperate ? 'calc(100% - 340px)' : '0' }}
                            key="batchSelectChecked"
                        >
                            {batchOperate && (
                                <div className={styles.batchOperate}>
                                    <div className={styles.batchOperateSelect}>
                                        <Checkbox
                                            onChange={this.handleBatchSelect}
                                            checked={batchSelectChecked}
                                        >
                                            {trans('global.choiceAll', '全选')}
                                        </Checkbox>
                                        <span className={styles.batchOperateSelectCourse}>
                                            {/* 已选择：{willBorderIdList.length}个课节 */}
                                            {trans('global.choiceChecked', '已选择：{$num}个课节', {
                                                num: willBorderIdList.length
                                                    ? willBorderIdList.length
                                                    : '0',
                                            })}
                                        </span>
                                    </div>
                                    <div className={styles.batchOperateCancel}>
                                        <span onClick={this.batchOperateCancel}>
                                            {trans('global.cancel', '取消')}
                                        </span>
                                        <span
                                            className={styles.batchOperateDelete}
                                            onClick={() => {
                                                if (willBorderIdList.length) {
                                                    this.setState({
                                                        batchDeleteModalVisibility: true,
                                                    });
                                                } else {
                                                    message.info('请先选择需要删除的待排课节');
                                                }
                                            }}
                                        >
                                            {trans('global.batchDelete', '批量删除')}
                                        </span>
                                        <Tooltip title="若部分课节临时取消上课，可设置为暂缓排课，之后可根据需要恢复排课">
                                            <span
                                                className={styles.batchOperateDelete}
                                                onClick={() => {
                                                    if (willBorderIdList.length) {
                                                        this.setState({
                                                            batchSuspendModalVisibility: true,
                                                        });
                                                    } else {
                                                        message.info(
                                                            '请先选择需要暂缓排课的待排课节'
                                                        );
                                                    }
                                                }}
                                            >
                                                {trans('global.Set to suspend', '批量暂缓排课')}
                                            </span>
                                        </Tooltip>
                                    </div>
                                </div>
                            )}
                        </div>,
                    ]}
                    placement="bottom"
                    onClose={this.onClose}
                    height="auto"
                    closable={false}
                    mask={false}
                    style={{ maxHeight: '335px', zIndex: '1030', display: 'flex' }}
                >
                    <Spin spinning={acLoading} tip="loading...">
                        <div className={styles.coursePage}>
                            {(!showExchangeClassTable || notShowWillCard) && (
                                <div className={styles.courseMenu}>
                                    <div className={styles.selectItem}>
                                        <Select
                                            placeholder={trans('global.searchCourses', '搜索课程')}
                                            style={{ width: locale() === 'en' ? 150 : 120 }}
                                            showSearch
                                            value={selectCourseId ? selectCourseId : undefined}
                                            allowClear={true}
                                            optionFilterProp="children"
                                            onChange={this.changeCourse}
                                            dropdownClassName="courseMenu"
                                        >
                                            {showAcCourseList &&
                                                showAcCourseList.length > 0 &&
                                                showAcCourseList.map((item, index) => {
                                                    return (
                                                        <Option
                                                            value={item.id}
                                                            key={index}
                                                            title={item.name}
                                                        >
                                                            {locale() !== 'en'
                                                                ? item.name
                                                                : item.englishName}
                                                        </Option>
                                                    );
                                                })}
                                        </Select>
                                        <Select
                                            onChange={this.changeGroup}
                                            style={{ width: 120, margin: '0 5px' }}
                                            placeholder={trans('global.allClasses', '全部班级')}
                                            allowClear={true}
                                            value={selectGroupId ? selectGroupId : undefined}
                                            dropdownClassName="courseMenu"
                                            optionFilterProp="children"
                                            showSearch
                                        >
                                            {willGroupList &&
                                                willGroupList.length > 0 &&
                                                willGroupList.map((item, index) => {
                                                    return (
                                                        <Option
                                                            value={item.id}
                                                            key={index}
                                                            title={item.name}
                                                        >
                                                            {locale() !== 'en'
                                                                ? item.name
                                                                : item.ename}
                                                        </Option>
                                                    );
                                                })}
                                        </Select>
                                    </div>
                                    <div className={styles.menuList}>
                                        {leftBarCourseList.length > 0 ? (
                                            <div>
                                                {activeTab == '1' && (
                                                    <div
                                                        className={styles.menuCard}
                                                        onClick={this.fetchWillArrangeList.bind(
                                                            this,
                                                            null,
                                                            null,
                                                            'all',
                                                            true
                                                        )}
                                                        key={'all'}
                                                        style={{
                                                            color: '#1476FF',
                                                            background: !selectCourseId
                                                                ? 'rgba(55, 152, 255, 0.1'
                                                                : '#fff',
                                                        }}
                                                    >
                                                        <span>
                                                            {trans('student.searchAll', '全部')}
                                                        </span>
                                                    </div>
                                                )}
                                                {leftBarCourseList.map((item, index) => {
                                                    return (
                                                        <div
                                                            id={`data-${item.id}`}
                                                            className={styles.menuCard}
                                                            onClick={this.fetchWillArrangeList.bind(
                                                                this,
                                                                item.id,
                                                                item.name,
                                                                index,
                                                                true
                                                            )}
                                                            key={item.id}
                                                            style={{
                                                                color: getCourseColor(item.name, 1),
                                                                background:
                                                                    showEdit &&
                                                                    item.id === selectCourseId
                                                                        ? getCourseColor(
                                                                              item.name,
                                                                              2
                                                                          )
                                                                        : '#fff',
                                                            }}
                                                        >
                                                            <span>
                                                                <em
                                                                    className={
                                                                        styles.arrangeCourseName
                                                                    }
                                                                    title={item.name}
                                                                >
                                                                    {locale() !== 'en'
                                                                        ? item.name
                                                                        : item.englishName}
                                                                </em>

                                                                {showEdit &&
                                                                    selectCourseId == item.id && (
                                                                        <i
                                                                            className={
                                                                                icon.iconfont +
                                                                                ' ' +
                                                                                styles.editBtn
                                                                            }
                                                                            ref={index}
                                                                            onClick={(e) =>
                                                                                this.showEditCourse(
                                                                                    e,
                                                                                    item.id
                                                                                )
                                                                            }
                                                                        >
                                                                            &#xe63b;
                                                                        </i>
                                                                    )}

                                                                {selectCourseId == item.id && (
                                                                    <i
                                                                        className={
                                                                            icon.iconfont +
                                                                            ' ' +
                                                                            styles.editBtn
                                                                        }
                                                                        onClick={(e) => {
                                                                            this.showExportPlanModal(
                                                                                e,
                                                                                item.id
                                                                            );
                                                                        }}
                                                                    >
                                                                        &#xe7d7;
                                                                    </i>
                                                                )}
                                                            </span>
                                                            <span>
                                                                {activeTab == '1'
                                                                    ? item.planningDetailArrangeSum
                                                                    : item.planningDetailAlreadyArrangeSum}
                                                                /{item.planningDetailSum}
                                                            </span>
                                                            {/* <span className={styles.courseLine} style={{ 'background': getCourseColor(item.name, 1)}}></span> */}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className={styles.noCourseArrange}>
                                                {trans('global.noCourses', '暂无课程')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {(!showExchangeClassTable || notShowWillCard) && (
                                <Spin
                                    spinning={changeVersionLoading || this.willLoading}
                                    tip="loading..."
                                    delay={500}
                                >
                                    <div className={styles.subjectList}>
                                        {typeof selectIndex === 'number' &&
                                            activeTab != '2' &&
                                            arrangeDetailList &&
                                            arrangeDetailList.length > 0 && (
                                                <p className={styles.subjectSum}>
                                                    {fetCourseNum &&
                                                        fetCourseNum.length > 0 &&
                                                        fetCourseNum.map((item, index) => {
                                                            return (
                                                                <span key={index}>
                                                                    {item.studentGroup &&
                                                                    item.studentGroup.name.includes(
                                                                        ' '
                                                                    )
                                                                        ? item.studentGroup.name
                                                                        : item.studentGroup.name.slice(
                                                                              -6
                                                                          )}
                                                                    ：
                                                                    {this.handleStatisticCourse(
                                                                        item.durationAndCountListMap
                                                                    )}
                                                                </span>
                                                            );
                                                        })}
                                                </p>
                                            )}

                                        <Row className={styles.rowStyle}>
                                            {arrangeDetailList &&
                                                activeTab != '2' &&
                                                arrangeDetailList.length > 0 &&
                                                arrangeDetailList.map((el, order) => {
                                                    //倍数是否显示
                                                    let isShowDouble =
                                                        el.detail && el.detail.duration != 1
                                                            ? true
                                                            : false;
                                                    return (
                                                        <Col
                                                            id={`data_${el.detail.id}`}
                                                            span={4}
                                                            className={styles.courseCard}
                                                            key={el.detail.id}
                                                            style={{
                                                                color:
                                                                    isDoubleClick &&
                                                                    el.detail.id === willBorderId
                                                                        ? '	#FFFFFF'
                                                                        : '#666',
                                                                background:
                                                                    isDoubleClick &&
                                                                    el.detail.id === willBorderId
                                                                        ? '#3798ff'
                                                                        : getCourseColor(
                                                                              el.detail.courseName,
                                                                              2
                                                                          ),
                                                                border:
                                                                    ((el.detail.id ===
                                                                        willBorderId &&
                                                                        !batchOperate) ||
                                                                        (batchOperate &&
                                                                            willBorderIdList.includes(
                                                                                el.detail.id
                                                                            ))) &&
                                                                    this.props.willCardLight &&
                                                                    !isDoubleClick
                                                                        ? `1px solid ${
                                                                              getCourseColor(
                                                                                  el.detail
                                                                                      .courseName,
                                                                                  1
                                                                              ) || '#3798ff'
                                                                          }`
                                                                        : 'none',
                                                                width: isShowDouble && '204px',
                                                                pointerEvents:
                                                                    (this.state.nextClick &&
                                                                        el.detail.id !==
                                                                            willBorderId &&
                                                                        isDoubleClick) ||
                                                                    this.willLoading
                                                                        ? 'none'
                                                                        : 'auto', // 双击待排课程后 不可点击其他待排课
                                                            }}
                                                            onDoubleClick={() =>
                                                                this.willArrangeExchange(el)
                                                            }
                                                            onClick={() =>
                                                                this.willArrangeDetail(el)
                                                            }
                                                        >
                                                            <p>
                                                                <a
                                                                    className={styles.classTitle}
                                                                    title={el.detail.courseName}
                                                                    style={{
                                                                        color:
                                                                            isDoubleClick &&
                                                                            el.detail.id ===
                                                                                willBorderId
                                                                                ? '	#FFFFFF'
                                                                                : '#666',
                                                                    }}
                                                                >
                                                                    {el.detail.courseName}
                                                                </a>
                                                                <span className={styles.spendTime}>
                                                                    {el.detail &&
                                                                        el.detail.singleTime}
                                                                    min
                                                                    {isShowDouble && (
                                                                        <em>
                                                                            *
                                                                            {el.detail &&
                                                                                el.detail.duration}
                                                                        </em>
                                                                    )}
                                                                </span>
                                                            </p>
                                                            <p>
                                                                <span
                                                                    className={styles.mainTeacher}
                                                                >
                                                                    {/* <em>{el.mainTeachers && el.mainTeachers[0].name}</em> */}
                                                                    <em
                                                                        title={this.handleClass(
                                                                            el.studentGroups
                                                                        )}
                                                                    >
                                                                        {this.handleClass(
                                                                            el.studentGroups
                                                                        ) || ''}
                                                                    </em>
                                                                    <em
                                                                        title={
                                                                            el.mainTeachers[0] &&
                                                                            el.mainTeachers[0].name
                                                                        }
                                                                        className={styles.teacher}
                                                                    >
                                                                        {locale() !== 'en'
                                                                            ? el.mainTeachers[0] &&
                                                                              el.mainTeachers[0]
                                                                                  .name
                                                                            : (el.mainTeachers[0] &&
                                                                                  el.mainTeachers[0]
                                                                                      .englishName) ||
                                                                              ''}
                                                                    </em>
                                                                </span>
                                                            </p>
                                                            {batchOperate &&
                                                                willBorderIdList.includes(
                                                                    el.detail.id
                                                                ) && (
                                                                    <Icon
                                                                        type="check-circle"
                                                                        className={
                                                                            styles.checkCircle
                                                                        }
                                                                    />
                                                                )}
                                                        </Col>
                                                    );
                                                })}
                                        </Row>
                                    </div>
                                </Spin>
                            )}
                            {showExchangeClassTable && !notShowWillCard && (
                                <Spin spinning={loadingStatus} tip="loading...">
                                    <div
                                        className={styles.arrangeBtn}
                                        onClick={this.handleArrangeCourse}
                                    >
                                        {trans('', '点击此处转待排')}
                                    </div>
                                </Spin>
                            )}
                            {/* 缓冲区 */}
                            {bufferArrangeDetailList && bufferArrangeDetailList.length > 0 && (
                                <div
                                    className={styles.bufferPart}
                                    style={{
                                        display:
                                            showExchangeClassTable && !notShowWillCard
                                                ? 'none'
                                                : 'unset',
                                    }}
                                >
                                    <div className={styles.infoAndAction}>
                                        <span className={styles.info}>
                                            {/* {bufferArrangeDetailList.length} 个课节 暂不参与系统排课 */}
                                            {trans(
                                                'global.bufferArrangeDetailList',
                                                '{$num}个课节 暂不参与系统排课',
                                                {
                                                    num: bufferArrangeDetailList.length
                                                        ? bufferArrangeDetailList.length
                                                        : '0',
                                                }
                                            )}
                                        </span>
                                        {!showExchangeClassTable && (
                                            <a
                                                className={styles.action}
                                                onClick={this.handleAcBuffer.bind(
                                                    this,
                                                    'all',
                                                    false,
                                                    ''
                                                )}
                                            >
                                                <Icon type="arrow-left" />
                                                {trans('global.resumeScheduling', '全部恢复排课')}
                                            </a>
                                        )}
                                    </div>
                                    <div className={styles.cardPart}>
                                        {bufferArrangeDetailList &&
                                            bufferArrangeDetailList.length > 0 &&
                                            bufferArrangeDetailList.map((el, i) => {
                                                let isShowDouble =
                                                    el.detail && el.detail.duration != 1
                                                        ? true
                                                        : false;
                                                return (
                                                    <div
                                                        className={styles.card}
                                                        key={el.detail.id}
                                                        onClick={() => this.willArrangeDetail(el)}
                                                        style={{
                                                            width: isShowDouble && '204px',
                                                            background: getCourseColor(
                                                                el.detail && el.detail.courseName,
                                                                2
                                                            ),
                                                            border:
                                                                el.detail.id === willBorderId &&
                                                                this.props.willCardLight &&
                                                                !isDoubleClick
                                                                    ? `1px solid ${
                                                                          getCourseColor(
                                                                              el.detail &&
                                                                                  el.detail
                                                                                      .courseName,
                                                                              1
                                                                          ) || '#3798ff'
                                                                      }`
                                                                    : 'none',
                                                        }}
                                                    >
                                                        <span className={styles.topInfo}>
                                                            <span
                                                                className={styles.course}
                                                                title={el.detail.courseName}
                                                            >
                                                                {el.detail.courseName}
                                                            </span>
                                                            <span className={styles.actionAndTime}>
                                                                {!showExchangeClassTable && (
                                                                    <span
                                                                        className={
                                                                            styles.actionSigle
                                                                        }
                                                                        title="恢复排课"
                                                                        onClick={this.handleAcBuffer.bind(
                                                                            this,
                                                                            el.detail.id,
                                                                            false,
                                                                            el
                                                                        )}
                                                                    >
                                                                        <Icon type="arrow-left" />
                                                                    </span>
                                                                )}
                                                                {el.detail && el.detail.singleTime}
                                                                min
                                                                {isShowDouble && (
                                                                    <em>
                                                                        *
                                                                        {el.detail &&
                                                                            el.detail.duration}
                                                                    </em>
                                                                )}
                                                            </span>
                                                        </span>
                                                        <span className={styles.bottomInfo}>
                                                            <span
                                                                className={styles.group}
                                                                title={this.handleClass(
                                                                    el.studentGroups
                                                                )}
                                                            >
                                                                {this.handleClass(
                                                                    el.studentGroups
                                                                ) || ''}
                                                            </span>
                                                            <span
                                                                className={styles.name}
                                                                title={
                                                                    el.mainTeachers[0] &&
                                                                    el.mainTeachers[0].name
                                                                }
                                                            >
                                                                {(el.mainTeachers[0] &&
                                                                    el.mainTeachers[0].name) ||
                                                                    ''}
                                                            </span>
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Spin>
                </Drawer>
                {editCourseModal && (
                    <EditCourse
                        {...this.props}
                        {...this.state}
                        gradeByTypeArr={this.props.gradeByTypeArr}
                        hideEditModal={this.hideEditModal}
                        fetchWillArrangeList={this.fetchWillArrangeList}
                        willArrangeDetail={this.willArrangeDetail}
                        showTable={this.props.showTable}
                    />
                )}
                <Modal
                    visible={conflictModal}
                    title="课程冲突"
                    footer={null}
                    onCancel={this.handleCancelConflict}
                >
                    <div className={styles.conflictModals}>
                        <p className={styles.conflictTitle}>
                            您选择的预排时段有课节冲突，若继续添加，{conflictResult.length}
                            个冲突课节将会转为待排哦！
                        </p>
                        <div className={styles.conflictContent}>
                            <p>
                                冲突时间： 周
                                {intoChinese(changeTimeStatus && changeTimeStatus.weekDay)}
                                {changeTimeStatus && changeTimeStatus.startTime}-
                                {changeTimeStatus && changeTimeStatus.endTime}
                            </p>
                            {conflictResult &&
                                conflictResult.length > 0 &&
                                conflictResult.map((item, index) => {
                                    conflictCourseIds.push(item.resultId);
                                    return (
                                        <div key={index}>
                                            <p>
                                                冲突课节{index + 1}
                                                {item.ifLock && (
                                                    <span style={{ color: '#f5222d' }}>
                                                        （已锁定）
                                                    </span>
                                                )}
                                                ：{item.courseName} -
                                                {this.getCourseName(item.studentGroupList)} -
                                                {this.getCourseName(item.teacherList)}
                                            </p>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                    <p className={styles.conflictButton}>
                        <span className={styles.cancelBtn} onClick={this.handleCancelConflict}>
                            放弃
                        </span>
                        {changeTimeStatus && changeTimeStatus.ifLock ? (
                            <span className={styles.grayButton}>继续添加</span>
                        ) : (
                            <span
                                className={styles.submitBtn}
                                onClick={this.continueArrange.bind(
                                    this,
                                    conflictCardId,
                                    conflictCourseIds
                                )}
                            >
                                继续添加
                            </span>
                        )}
                    </p>
                </Modal>
                {this.state.exportPlanVisible && (
                    <ExportPlan
                        exportPlanVisible={this.state.exportPlanVisible}
                        versionId={currentVersion}
                        showExportPlanModal={this.showExportPlanModal}
                        courseId={selectCourseId}
                        getshowAcCourseList={this.props.getshowAcCourseList}
                        hideExportPlanModal={this.hideExportPlanModal}
                        showTable={this.props.showTable}
                    />
                )}

                {batchDeleteModalVisibility && (
                    <Modal
                        visible={batchDeleteModalVisibility}
                        title="批量删除"
                        onOk={() => this.handleBatchDeleteOrSuspend('delete')}
                        onCancel={this.handleModalCancel}
                        footer={[
                            <Button key="back" onClick={this.handleModalCancel}>
                                取消
                            </Button>,
                            <Button
                                key="submit"
                                type="primary"
                                loading={batchOperateLoading}
                                onClick={() => this.handleBatchDeleteOrSuspend('delete')}
                            >
                                确认
                            </Button>,
                        ]}
                    >
                        确认将已选择的{willBorderIdList.length}个待排课节删除吗？删除后不可恢复
                    </Modal>
                )}

                {batchSuspendModalVisibility && (
                    <Modal
                        visible={batchSuspendModalVisibility}
                        title={trans('global.Set to suspend', '批量暂缓排课')}
                        onOk={() => this.handleBatchDeleteOrSuspend('suspend')}
                        onCancel={this.handleModalCancel}
                        footer={[
                            <Button key="back" onClick={this.handleModalCancel}>
                                取消
                            </Button>,
                            <Button
                                key="submit"
                                type="primary"
                                loading={batchOperateLoading}
                                onClick={() => this.handleBatchDeleteOrSuspend('suspend')}
                            >
                                确认
                            </Button>,
                        ]}
                    >
                        确认将已选择的{willBorderIdList.length}个待排课节批量设置为暂缓排课吗？
                    </Modal>
                )}
            </div>
        );
    }
}
