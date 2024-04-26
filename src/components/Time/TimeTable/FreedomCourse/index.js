//新建自由排课
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import {
    Modal,
    Form,
    Input,
    Select,
    Row,
    Col,
    DatePicker,
    Checkbox,
    TimePicker,
    Radio,
    InputNumber,
    TreeSelect,
    message,
    Icon,
    Switch,
    Button,
} from 'antd';
import moment, { relativeTimeThreshold } from 'moment';
import icon from '../../../../icon.less';
import { formatTime, formatTimeSafari, formatUsualTime } from '../../../../utils/utils';
import SelectTeacherAndOrg from './common/selectTeacherAndOrg/index';
import { trans, locale } from '../../../../utils/i18n';
import { isEmpty } from 'lodash';
import SimpleModal from '../../../CommonModal/SimpleModal';

const { Option } = Select;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const format = 'HH:mm';
const dateFormat = 'YYYY/MM/DD';
const { RangePicker } = DatePicker;

const week = [
    { id: 1, name: '周一' },
    { id: 2, name: '周二' },
    { id: 3, name: '周三' },
    { id: 4, name: '周四' },
    { id: 5, name: '周五' },
    { id: 6, name: '周六' },
    { id: 7, name: '周七' },
];

let ids = 1;

@Form.create()
@connect((state) => ({
    studentList: state.timeTable.studentList,
    areaList: state.timeTable.areaList,
    gradeList: state.time.gradeList,
    clubCourseList: state.club.clubCourseList, // 个人课程 ---
    courseList: state.course.courseList, // 个人课程 ---
    gradeByTypeArr: state.timeTable.gradeByTypeArr, //学生组件优化
    activeConflictList:
        state.timeTable.activeConflictList &&
        state.timeTable.activeConflictList.freeScheduleConflictModels &&
        state.timeTable.activeConflictList.freeScheduleConflictModels,
    canBeCreated:
        state.timeTable.activeConflictList &&
        state.timeTable.activeConflictList.canBeCreated &&
        state.timeTable.activeConflictList.canBeCreated,
    searchPeopleData: state.timeTable.searchPeopleData,
    fetchTeacherAndOrg: state.global.fetchTeacherAndOrg, //组织和人员列表，栾碧霞测试专用接口
    roomConflict: state.timeTable.roomConflict,
}))
export default class FreedomCourse extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            courseValue: '',
            classify: '',
            timeType: 'shijian',

            //按时间选择
            date: '',
            startTime: '8:00',
            endTime: '17:00',
            startTimeValue: '8:00', // 存储开始时间第一行修改的时间
            endTimeValue: '17:00',
            //地点
            ifAtSchool: 'playground',
            outSideAddress: '',
            //重复相关
            repeat: '',
            overDate: null, //重复的结束日期

            ifRepeat: false, //是否重复
            repeatCycle: '', //重复日期(每周几,每月几号)
            repeatType: 0, //重复类型(1天重复，2周重复，3月重复,4每个工作日 , 5自定义)
            customizeType: 2, // 自定义对应的类型 (1天 ,2周 ,3月)
            repeatIntervals: 1, //重复间隔
            repeatEndTime: null,
            //活动参数
            studentGroupValue: [],
            necessaryUser: [], //必选人员
            necessaryOrg: [], //必选部门
            optionalUser: [], //可选人员
            optionalOrg: [], //可选部门
            studentListValue: [], //学生

            //club参数
            clubStartTime: '2019/08/01', //开始时间
            clubEndTime: '2019/08/20', //结束时间
            gradeValue: undefined, //club选择年级
            baseCourseIdList: [], //club课程
            timeList: [], //存取时间表的下标
            ifvalue: false, //s是否公布
            // 个人课程 --- 课程参数
            courseStudentGroup: [], // 学生组
            courseStudentList: [], // 学生
            // 冲突校验
            conflictCheck: false, // 校验modal的显隐
            promisePlace: '', // 允许的地点
            promiseSelf: false,

            departmentList: [],

            createOrEdit: 'create',
            currentWeek: '',
            currentDay: '',
            startDateTime: '',
            //场地冲突
            roomConflictModalVisible: false,
            payloadObj: {},
            confirmBtnLoading: false,
            sureCreateLoading: false,
            sureCreateAndDeleteLoading: false,
        };
    }

    //获取所选学期的开始时间和结束时间
    getSemesterStartEndTime(id, type) {
        const { semesterList } = this.props;
        let semesterTime;
        semesterList &&
            semesterList.map((item, index) => {
                if (item.id == id) {
                    if (type == 'start') {
                        semesterTime = formatTime(item.startTime);
                    } else if (type == 'end') {
                        semesterTime = formatTime(item.endTime);
                    }
                }
            });
        return semesterTime;
    }

    handleCancel = () => {
        const { hideModal, form } = this.props;
        typeof hideModal == 'function' && hideModal('freedomCourse');
        form.resetFields();
        this.setState({
            repeat: '',
            ifAtSchool: 'playground',
            timeType: 'shijian',
            baseCourseIdList: [],
            value: false,
        });
    };

    cancelCheck = () => {
        this.setState({
            conflictCheck: false,
        });
    };

    // 处理活动冲突的resultId
    dealResultId = () => {
        let resultIdArr = [];
        this.props.activeConflictList.map((item) => {
            resultIdArr.push(item.resultId);
            return resultIdArr;
        });
        return resultIdArr;
    };

    sureCreateActive = (isDelete) => {
        const { dispatch, hideModal, canBeCreated, timeTableOrClub } = this.props;
        let deleteConflictResult = isDelete && timeTableOrClub === 'timeTable';
        if (deleteConflictResult) {
            this.setState({
                sureCreateAndDeleteLoading: true,
            });
        } else {
            this.setState({
                sureCreateLoading: true,
            });
        }
        dispatch({
            type: 'timeTable/sureCreat',
            payload: {
                resultIdList: this.dealResultId(),
                flag: true,
                deleteConflictResult: deleteConflictResult && timeTableOrClub === 'timeTable',
            },
            onSuccess: () => {
                message.success('创建成功~');
                typeof hideModal == 'function' && hideModal('freedomCourse');
                //调用课程表
                const { showTable, fetchScheduleList } = this.props;
                if (timeTableOrClub === 'timeTable') {
                    typeof showTable == 'function' && showTable.call(this, '确认创建');
                } else {
                    typeof fetchScheduleList == 'function' &&
                        fetchScheduleList.call(this, '确认创建');
                }
            },
        }).then(() => {
            if (deleteConflictResult) {
                this.setState({
                    sureCreateAndDeleteLoading: false,
                });
            } else {
                this.setState({
                    sureCreateLoading: false,
                });
            }
        });
    };

    handleSubmit = (payloadObj) => {
        const { dispatch, form, hideModal, currentVersion, activeConflictList } = this.props;
        this.setState({
            confirmBtnLoading: true,
            roomConflictModalVisible: false,
        });
        dispatch({
            type: 'timeTable/createFreeCourse',
            payload: payloadObj,
            onSuccess: () => {
                let conflictList = this.props.activeConflictList;
                !conflictList && form.resetFields();
                !conflictList &&
                    this.setState({
                        repeat: '',
                        ifAtSchool: 'playground',
                        timeList: [],
                        timeType: 'shijian',
                    });
                conflictList &&
                    this.setState({
                        conflictCheck: true,
                    });
                !conflictList &&
                    typeof hideModal == 'function' &&
                    hideModal.call(this, 'freedomCourse');
                !conflictList && message.success('创建成功~');
                //调用课程表
                const { showTable, fetchScheduleList, timeTableOrClub } = this.props;
                if (timeTableOrClub === 'timeTable') {
                    !conflictList &&
                        typeof showTable == 'function' &&
                        showTable.call(this, '新建活动');
                } else {
                    !conflictList &&
                        typeof fetchScheduleList == 'function' &&
                        fetchScheduleList.call(this, '新建活动');
                }
            },
        }).then(() => {
            this.setState({
                confirmBtnLoading: false,
            });
        });
    };

    //club--处理时间
    formatTimeList = (values) => {
        const { timeList } = this.state;
        let clubDate0 = values.clubDate0.format('YYYY/MM/DD'), //日期
            clubStartTime0 = values.clubStartTime0.format('HH:mm'), //开始时间
            clubEndTime0 = values.clubEndTime0.format('HH:mm'), //结束时间
            startTime0 = new Date(formatTimeSafari(clubDate0 + ' ' + clubStartTime0)).getTime(),
            endTime0 = new Date(formatTimeSafari(clubDate0 + ' ' + clubEndTime0)).getTime();
        let baseTimeList = [{ startTime: startTime0, endTime: endTime0 }];
        timeList &&
            timeList.length > 0 &&
            timeList.map((item) => {
                let clubDate = values[`clubDate${item}`].format('YYYY/MM/DD'),
                    clubStartTime = values[`clubStartTime${item}`].format('HH:mm'),
                    clubEndTime = values[`clubEndTime${item}`].format('HH:mm'),
                    obj = {
                        startTime: new Date(
                            formatTimeSafari(clubDate + ' ' + clubStartTime)
                        ).getTime(),
                        endTime: new Date(formatTimeSafari(clubDate + ' ' + clubEndTime)).getTime(),
                    };
                baseTimeList.push(obj);
            });
        return baseTimeList;
    };

    //校验开始时间和结束时间
    validateStartEnd = (values) => {
        let getTimeList = this.formatTimeList(values);
        let isPass = true;
        for (let i = 0; i < getTimeList.length; i++) {
            if (getTimeList[i]['startTime'] >= getTimeList[i]['endTime']) {
                isPass = false;
                break;
            }
        }
        return isPass;
    };

    //搜索或选择课程
    searchCourse = (value) => {
        this.setState({
            courseValue: value,
        });
    };

    //选择分类
    changeClassify = (value) => {
        this.setState({
            classify: value,
        });
    };

    //选择时间类型
    changeTimeType = (value) => {
        this.setState({
            timeType: value,
        });
    };

    //选择学生组
    changeStudentGroup = (value) => {
        this.setState({
            studentGroupValue: value,
        });
    };

    //处理学生列表数据
    formatStudentList = (studentArr) => {
        if (!studentArr || studentArr.length < 0) return [];
        let studentList = [];
        studentArr.map((item, index) => {
            let obj = {
                title: item.gradeName + '- ' + item.name,
                key: item.id,
                value: item.id,
            };
            studentList.push(obj);
        });
        return studentList;
    };

    //活动--选择必选人员
    changeNecessaryUser = (value) => {
        this.setState({
            necessaryUser: value,
        });
    };

    //活动--选择必选部门
    changeNecessaryOrg = (value) => {
        this.setState({
            necessaryOrg: this.formatOptionalOrg(value),
        });
    };

    //活动--选择可选人员
    changeOptionalUser = (value) => {
        this.setState({
            optionalUser: value,
        });
    };

    //活动--选择可选部门
    changeOptionalOrg = (value) => {
        this.setState({
            optionalOrg: this.formatOptionalOrg(value),
        });
    };

    //活动--选择学生
    changeStudentList = (value) => {
        this.setState({
            studentListValue: value,
        });
    };

    //处理部门选中值
    formatOptionalOrg = (arr) => {
        let resultArr = [];
        arr &&
            arr.length > 0 &&
            arr.map((el) => {
                let result = Number(el.split('-')[1]);
                resultArr.push(result);
            });
        return resultArr;
    };

    //渲染活动Form.Item
    renderActivityItem = () => {
        const {
            form: { getFieldDecorator },
            gradeByTypeArr,
            studentList,
            searchPeopleData,
            courseList,
        } = this.props;

        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 4,
                },
            },
        };
        const treeProps = {
            treeNodeFilterProp: 'title',
            treeCheckable: true,
            treeNodeFilterProp: 'title',
        };
        const studentGroupProps = {
            treeData: gradeByTypeArr,
            placeholder: '选择学生组',
            onChange: this.changeStudentGroup,
            dropdownStyle: {
                maxHeight: 400,
                overflow: 'auto',
            },
            treeDefaultExpandedKeys: ['1行政班'],
            ...treeProps,
        };
        const studentProps = {
            treeData: this.formatStudentList(studentList),
            placeholder: '搜索或选择学生',
            onChange: this.changeStudentList,
            dropdownStyle: {
                maxHeight: 400,
                overflow: 'auto',
            },
            ...treeProps,
        };
        return (
            <div key="studentProps">
                <Form.Item label="主题">
                    {getFieldDecorator('theme', {
                        rules: [{ required: true, message: '请输入活动主题' }],
                    })(<Input placeholder="请输入活动主题" />)}
                </Form.Item>
                <Form.Item label="英文主题">
                    {getFieldDecorator('englishTheme', {
                        rules: [{ required: true, message: '请输入英文主题' }],
                    })(<Input placeholder="请输入活动主题" />)}
                </Form.Item>
                <Form.Item label="关联课程">
                    {getFieldDecorator('courseId')(
                        <Select
                            placeholder="请选择关联课程"
                            // style={{ width: 140 }}
                            optionFilterProp="children"
                            showSearch
                            allowClear={true}
                        >
                            {courseList &&
                                courseList.length > 0 &&
                                courseList.map((item, index) => {
                                    return (
                                        <Option value={item.id} key={item.id}>
                                            {item.name}
                                        </Option>
                                    );
                                })}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item
                    label={[<span className={styles.redRemark}>*</span>, <span>分配给</span>]}
                    style={{ marginBottom: 0, marginTop: 19 }}
                >
                    {getFieldDecorator('activeStudentGroup')(<TreeSelect {...studentGroupProps} />)}
                </Form.Item>
                <Form.Item {...tailFormItemLayout} style={{ marginBottom: 10 }}>
                    {getFieldDecorator('activeStudenList')(<TreeSelect {...studentProps} />)}
                </Form.Item>
                <Form.Item
                    label={[<span className={styles.redRemark}>*</span>, <span>必选教师</span>]}
                    style={{ marginBottom: 25 }}
                >
                    {getFieldDecorator('activeTeacherList')(
                        <SelectTeacherAndOrg
                            placeholder="搜索或选择人员与部门"
                            treeData={this.props.fetchTeacherAndOrg}
                            onRef={(ref) => {
                                this.necessary = ref;
                            }}
                            selectType="2"
                        />
                    )}
                </Form.Item>
                <Form.Item label="可选教师" style={{ marginBottom: 22 }}>
                    {getFieldDecorator('activeOptionalTeacherList')(
                        <SelectTeacherAndOrg
                            placeholder="搜索或选择人员与部门"
                            treeData={this.props.fetchTeacherAndOrg}
                            onRef={(ref) => {
                                this.unnecessary = ref;
                            }}
                            selectType="2"
                        />
                    )}
                </Form.Item>
            </div>
        );
    };

    // 个人课程 --- 格式化教师列表
    formatTeacherList = (arr) => {
        if (!arr || arr.length < 0) return [];
        let treeData = [];
        arr.map((item, index) => {
            let obj = {
                key: item.teacherId,
                value: item.teacherId,
                title: item.name,
            };
            treeData.push(obj);
        });
        return treeData;
    };
    // 个人课程 --- 选择学生组
    changeCourseGroup = (value) => {
        this.setState({
            courseStudentGroup: value,
        });
    };
    // 个人课程 --- 选择学生
    changeCourseList = (value) => {
        this.setState({
            courseStudentList: value,
        });
    };

    // 选择允许的地点
    promisePlaceHandle = (value) => {
        this.setState({
            promisePlace: value,
        });
    };

    //按时间选择--选择日期
    changeDate = (date, dateString) => {
        let dateStr = dateString.replace(/-/g, '/');
        this.setState({
            date: dateStr,
        });
    };

    //按时间选择--选择开始时间
    changeStartTime = (time, timeString) => {
        this.setState({
            startTime: timeString,
        });
    };

    //按时间选择--选择结束时间
    changeEndTime = (time, timeString) => {
        this.setState({
            endTime: timeString,
        });
    };

    //选择场地类型
    selectAddress = (e) => {
        this.setState({
            ifAtSchool: e.target.value,
        });
    };

    //填写场外地点
    fillInOutside = (value) => {
        this.setState({
            outsideAddress: value,
        });
    };

    //选择是否重复
    selectIfRepeat = (value) => {
        this.setState({
            repeat: value,
        });
    };

    //选择重复类型
    selectRepeatType = (e) => {
        this.setState({
            repeatType: e.target.value,
        });
    };

    //填写重复的时间
    fillInNumber = (value) => {
        this.setState({
            repeatIntervals: value,
        });
    };

    //重复类型的结束日期
    changeOverDate = (date, dateString) => {
        let dateStr = dateString.replace(/-/g, '/');
        this.setState({
            overDate: dateStr,
        });
    };

    //club--选择时间
    changeRangePicker = (value, dateString) => {
        let start = dateString && dateString[0],
            end = dateString && dateString[1];
        this.setState(
            {
                clubStartTime: start,
                clubEndTime: end,
            },
            () => {
                this.fetchClubCourse();
            }
        );
    };

    //club--选择年级
    changeClubClass = (value) => {
        this.setState(
            {
                gradeValue: value,
            },
            () => {
                this.props.form.setFieldsValue({ clubCourse: [] });
                this.fetchClubCourse();
            }
        );
    };

    //club课程列表查询接口
    fetchClubCourse = () => {
        const { dispatch } = this.props;
        const { clubStartTime, clubEndTime, gradeValue } = this.state;
        let start = new Date(formatTimeSafari(clubStartTime + ' 00:00:00')).getTime(),
            end = new Date(formatTimeSafari(clubEndTime + ' 23:59:59')).getTime();
        dispatch({
            type: 'club/fetchClubCourse',
            payload: {
                queryStartTime: start,
                queryEndTime: end,
                gradeIdList: gradeValue ? gradeValue.join(',') : [],
            },
        });
    };

    //club-选择开始时间类型
    changeClubTimeType = (value) => {};

    //club--搜索或选择课程
    changeClubCourse = (value) => {
        this.setState({
            baseCourseIdList: value,
        });
    };

    //删除时间表
    removeTimeList(id) {
        let timeList = JSON.parse(JSON.stringify(this.state.timeList));
        if (timeList.indexOf(id) != -1) {
            timeList.splice(timeList.indexOf(id), 1);
            this.setState({
                timeList: timeList,
            });
        }
    }

    // 格式化地点
    fromPlace = (areaList) => {
        if (!areaList || areaList.length < 0) return;
        let place = [];
        areaList.map((item, index) => {
            let obj = {};
            obj.title = item.name;
            obj.key = item.id;
            obj.value = item.id;
            place.push(obj);
        });
        return place;
    };

    onChangeGroup = (e) => {
        this.setState({
            ifvalue: e.target.value,
        });
    };
    // onChangeCheckbox(checkedValues) {
    // }

    getStartTime = (data, dataStr) => {
        this.setState({
            startTimeValue: dataStr,
        });
    };

    getEndTime = (data, dataStr) => {
        this.setState({
            endTimeValue: dataStr,
        });
    };

    switchHandle = (checked) => {
        this.setState({
            promiseSelf: checked,
        });
    };

    //重复结束日期变化
    repeatEndTimeChange = (repeatEndTime) => {
        this.setState({
            repeatEndTime,
        });
    };

    //填写重复间隔
    fillInNumber = (value) => {
        this.setState({
            repeatIntervals: value,
        });
    };

    //重复类型
    repeatTypeChange = (value) => {
        console.log('value :>> ', typeof value);
        /* this.setState({
      repeatType: value
    }); */
        this.setState({ ifRepeat: value !== 0 });
        this.setState({ repeatType: value });

        //每周
        if (value == 2) {
            this.setState({
                repeatCycle: this.state.currentWeek,
            });
        }

        //每月几日
        if (value === 3) {
            this.setState({
                repeatCycle: this.state.currentDay,
            });
        }

        //每个工作日
        if (value === 4) {
            this.setState({
                repeatCycle: '1,2,3,4,5',
            });
        }
    };

    //自定义选择时判断重复类型
    customizeTypeChange = (value) => {
        this.setState({
            customizeType: value,
        });
    };

    changeRepeatIntervals = (value) => {
        console.log('value :>> ', typeof value);
        this.setState({
            repeatIntervals: value,
        });
    };

    //设置重复日期
    repeatCycleChange = (values) => {
        this.setState({
            repeatCycle: values.toString(),
        });
        console.log('values :>> ', values);
    };

    changeStartDateTime = (date, dateString) => {
        this.setState({
            startDateTime: date,
        });
        this.getCurrentWeek(dateString);
        this.getCurrentDay(dateString);
    };

    getCurrentWeek = (date) => {
        let week = moment(date).format('dddd');
        this.setState({
            currentWeek: week.charAt(week.length - 1),
        });
    };

    getCurrentDay = (date) => {
        let day = moment(date).format('L');
        this.setState({
            currentDay: day.substr(day.length - 2),
        });
    };

    toggleRoomConflictModalVisible = () => {
        const { roomConflictModalVisible } = this.state;
        this.setState({
            roomConflictModalVisible: !roomConflictModalVisible,
        });
    };

    onOk = (e) => {
        e.preventDefault();
        const { dispatch, form, hideModal, currentVersion, activeConflictList } = this.props;
        form.validateFieldsAndScroll(
            {
                scroll: { offsetBottom: 400 },
            },
            (err, values) => {
                if (!err) {
                    //活动
                    const {
                        ifRepeat,
                        repeatType,
                        repeatIntervals,
                        repeatCycle,
                        repeatEndTime,
                        customizeType,
                    } = this.state;
                    let activityObj = {
                        schoolId: '',
                        remark: values.remark,
                    };

                    //学生组校验
                    if (
                        (!values.activeStudenList || values.activeStudenList.length == 0) &&
                        (!values.activeStudentGroup || values.activeStudentGroup.length == 0)
                    ) {
                        message.info('请选择要分配学生或学生组');
                        return false;
                    }

                    //必选教师校验
                    if (
                        isEmpty(this.necessary.state.userIds) &&
                        isEmpty(this.necessary.state.orgIds)
                    ) {
                        message.info('请选择必选教师或部门');
                        return false;
                    }

                    activityObj.ifRepeat = ifRepeat;
                    activityObj.repeatType = repeatType;
                    activityObj.repeatIntervals = repeatIntervals;
                    activityObj.repeatCycle = repeatCycle;
                    activityObj.repeatEndTime = moment(repeatEndTime).endOf('day').valueOf() - 999;
                    activityObj.customizeType = customizeType;
                    if (values.addressType == 'playground') {
                        //校内地点
                        activityObj.playgroundId = values.playgroundId;
                    } else if (values.addressType == 'outside') {
                        //校外地点
                        activityObj.outsidePlayground = values.outsidePlayground;
                    }
                    //时间校验，开始时间不能大于结束时间
                    if (!this.validateStartEnd(values)) {
                        message.info('开始时间不能大于等于结束时间');
                        return false;
                    }
                    let payloadObj = {
                        versionId: currentVersion,
                        type: 2,
                        tagId: -1, //活动标签，暂时没有
                        name: values.theme,
                        englishName: values.englishTheme,
                        necessaryStudentList: values.activeStudenList,
                        necessaryStudentGroupList: values.activeStudentGroup,
                        necessaryTeacherList: this.necessary.state.userIds,
                        necessaryDepartmentList: this.necessary.state.orgIds,
                        //necessaryDepartmentList: this.formatOptionalOrg(values.activeTeacherGroup),
                        unnecessaryTeacherList: this.unnecessary.state.userIds,
                        unnecessaryDepartmentList: this.unnecessary.state.orgIds,
                        //unnecessaryDepartmentList: this.formatOptionalOrg(values.activeOptionalTeacherGroup),
                        startAndEndTimeList: this.formatTimeList(values), //时间段
                        publish: values.publish,
                        noticeIdentities: values.noticeIdentities,
                        allowSelfArrangement: this.state.promiseSelf,
                        selfArrangementAddressIdList: this.state.promisePlace,
                        courseId: values.courseId,
                        ...activityObj,
                    };
                    this.setState({
                        confirmBtnLoading: true,
                    });
                    dispatch({
                        type: 'timeTable/getRoomConflict',
                        payload: {
                            ...payloadObj,
                            startTime: payloadObj.startAndEndTimeList[0]?.startTime,
                            endTime: payloadObj.startAndEndTimeList[0]?.endTime,
                        },
                    }).then(() => {
                        const { roomConflict } = this.props;
                        if (roomConflict.conflict) {
                            this.toggleRoomConflictModalVisible();
                            this.setState({
                                payloadObj,
                                confirmBtnLoading: false,
                            });
                        } else {
                            this.handleSubmit(payloadObj);
                        }
                    });
                }
            }
        );
    };

    render() {
        const {
            showFreedomCourse,
            form: { getFieldDecorator },
            areaList,
            activeConflictList,
            canBeCreated,
            roomConflict,
            timeTableOrClub,
        } = this.props;
        const {
            ifAtSchool, //校内地点&&校外地点
            timeList,
            ifvalue,
            startTimeValue,
            endTimeValue,
            conflictCheck,
            createOrEdit,
            ifRepeat,
            repeatType,
            repeatCycle,
            customizeType,
            repeatIntervals,
            repeatEndTime,
            currentWeek,
            currentDay,
            roomConflictModalVisible,
            payloadObj,
            confirmBtnLoading,
            sureCreateLoading,
            sureCreateAndDeleteLoading,
        } = this.state;
        const WeekOptions = [
            { label: '一', value: '1' },
            { label: '二', value: '2' },
            { label: '三', value: '3' },
            { label: '四', value: '4' },
            { label: '五', value: '5' },
            { label: '六', value: '6' },
            { label: '七', value: '0' },
        ];
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 4,
                },
            },
        };
        const placeProps = {
            treeData: this.fromPlace(areaList),
            placeholder: '选择允许的地点',
            onChange: this.promisePlaceHandle,
            style: {
                // width: 120,
                marginRight: 8,
                verticalAlign: 'top',
            },
            dropdownStyle: {
                maxHeight: 400,
                overflow: 'auto',
            },
            treeNodeFilterProp: 'title',
            treeCheckable: true,
            treeNodeFilterProp: 'title',
        };
        let repeatContent = repeatType == 1 ? '天' : repeatType == 2 ? '周' : '月';

        const options = [
            { label: '教师', value: 'employee' },
            { label: '学生', value: 'student' },
            { label: '家长', value: 'parent' },
        ];
        let num = activeConflictList && activeConflictList.length;
        return (
            <Modal
                title="新建活动"
                visible={showFreedomCourse}
                onCancel={this.handleCancel}
                width="1000px"
                footer={null}
                key="createFreedom"
                className={styles.createActivity}
            >
                <Form {...formItemLayout} className={styles.formStyle} key="freedomForm">
                    {this.renderActivityItem()}
                    {
                        <Form.Item label="开始时间" style={{ marginBottom: 0 }}>
                            <Row gutter={4}>
                                <Col span={6}>
                                    {getFieldDecorator('clubTimeType', {
                                        rules: [{ required: true, message: '请选择类型' }],
                                        initialValue: 'time',
                                    })(
                                        <Select
                                            style={{ width: 120 }}
                                            onChange={this.changeClubTimeType}
                                        >
                                            <Option value="time">按时间选择</Option>
                                        </Select>
                                    )}
                                </Col>
                                <Col span={6}>
                                    <Form.Item style={{ marginBottom: 0 }}>
                                        {getFieldDecorator('clubDate0', {
                                            rules: [{ required: true, message: '请选择日期' }],
                                        })(
                                            <DatePicker
                                                allowClear={false}
                                                placeholder="请选择日期"
                                                onChange={this.changeStartDateTime}
                                            />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item style={{ marginBottom: 0 }}>
                                        <Row gutter={4}>
                                            <Col span={10}>
                                                {getFieldDecorator('clubStartTime0', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '请选择开始时间',
                                                        },
                                                    ],
                                                    initialValue: moment('8:00', format),
                                                })(
                                                    <TimePicker
                                                        format={format}
                                                        allowClear={false}
                                                        style={{ width: 100, marginRight: 5 }}
                                                        onChange={this.getStartTime}
                                                        minuteStep={5}
                                                    />
                                                )}
                                            </Col>
                                            <Col span={10}>
                                                <Form.Item style={{ marginBottom: 13 }}>
                                                    {getFieldDecorator('clubEndTime0', {
                                                        rules: [
                                                            {
                                                                required: true,
                                                                message: '请选择结束时间',
                                                            },
                                                        ],
                                                        initialValue: moment('17:00', format),
                                                    })(
                                                        <TimePicker
                                                            format={format}
                                                            allowClear={false}
                                                            style={{ width: 100 }}
                                                            onChange={this.getEndTime}
                                                            minuteStep={5}
                                                        />
                                                    )}
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form.Item>
                    }
                    {timeList &&
                        timeList.length > 0 &&
                        timeList.map((item, index) => {
                            return (
                                <Form.Item {...tailFormItemLayout} key={index}>
                                    <Row gutter={4}>
                                        <Col span={6}>
                                            {getFieldDecorator(`clubTimeType${item}`, {
                                                rules: [{ required: true, message: '请选择类型' }],
                                                initialValue: 'time',
                                            })(
                                                <Select
                                                    style={{ width: 120 }}
                                                    onChange={this.changeClubTimeType}
                                                >
                                                    <Option value="time">按时间选择</Option>
                                                </Select>
                                            )}
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item>
                                                {getFieldDecorator(`clubDate${item}`, {
                                                    rules: [
                                                        { required: true, message: '请选择日期' },
                                                    ],
                                                })(
                                                    <DatePicker
                                                        allowClear={false}
                                                        placeholder="请选择日期"
                                                    />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item>
                                                <Row gutter={4}>
                                                    <Col span={10}>
                                                        {getFieldDecorator(`clubStartTime${item}`, {
                                                            rules: [
                                                                {
                                                                    required: true,
                                                                    message: '请选择开始时间',
                                                                },
                                                            ],
                                                            initialValue: moment(
                                                                startTimeValue,
                                                                format
                                                            ),
                                                        })(
                                                            <TimePicker
                                                                format={format}
                                                                allowClear={false}
                                                                style={{
                                                                    width: 100,
                                                                    marginRight: 5,
                                                                }}
                                                                minuteStep={5}
                                                            />
                                                        )}
                                                    </Col>
                                                    <Col span={10}>
                                                        <Form.Item>
                                                            {getFieldDecorator(
                                                                `clubEndTime${item}`,
                                                                {
                                                                    rules: [
                                                                        {
                                                                            required: true,
                                                                            message:
                                                                                '请选择结束时间',
                                                                        },
                                                                    ],
                                                                    initialValue: moment(
                                                                        endTimeValue,
                                                                        format
                                                                    ),
                                                                }
                                                            )(
                                                                <TimePicker
                                                                    format={format}
                                                                    allowClear={false}
                                                                    style={{ width: 100 }}
                                                                    minuteStep={5}
                                                                />
                                                            )}
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={4}>
                                                        <i
                                                            className={
                                                                icon.iconfont + ' ' + styles.addPlus
                                                            }
                                                            onClick={this.removeTimeList.bind(
                                                                this,
                                                                item
                                                            )}
                                                        >
                                                            &#xe6cd;
                                                        </i>
                                                    </Col>
                                                </Row>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form.Item>
                            );
                        })}

                    <Form.Item label="地点类型" style={{ marginBottom: 0 }}>
                        <Row gutter={4}>
                            <Col span={14}>
                                {getFieldDecorator('addressType', {
                                    rules: [{ required: true, message: '请选择地点类型' }],
                                    initialValue: 'playground',
                                })(
                                    <RadioGroup onChange={this.selectAddress}>
                                        <Radio value="defaultAddress">默认地点</Radio>
                                        <Radio value="playground">校内地点</Radio>
                                        <Radio value="outside">校外地点</Radio>
                                    </RadioGroup>
                                )}
                            </Col>
                            <Col span={10}>
                                {ifAtSchool == 'playground' && (
                                    <Form.Item style={{ marginBottom: 8 }}>
                                        {getFieldDecorator('playgroundId', {
                                            rules: [{ required: true, message: '请选择校内地点' }],
                                        })(
                                            <Select
                                                showSearch
                                                allowClear={true}
                                                optionFilterProp="children"
                                                style={{ width: 160 }}
                                                placeholder="请选择地点"
                                            >
                                                {areaList &&
                                                    areaList.length > 0 &&
                                                    areaList.map((item, index) => {
                                                        return (
                                                            <Option value={item.id} key={item.id}>
                                                                {item.name}
                                                            </Option>
                                                        );
                                                    })}
                                            </Select>
                                        )}
                                    </Form.Item>
                                )}
                                {ifAtSchool == 'outside' && (
                                    <Form.Item style={{ marginBottom: 8 }}>
                                        {getFieldDecorator('outsidePlayground', {
                                            rules: [{ required: true, message: '请填写校外地点' }],
                                        })(
                                            <Input
                                                placeholder="请填写场外地点"
                                                onChange={this.fillInOutside}
                                            />
                                        )}
                                    </Form.Item>
                                )}
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item
                        label={
                            <span>
                                <i style={{ color: 'red' }}>*</i> 是否允许学生自主安排
                            </span>
                        }
                        style={{ marginBottom: 13 }}
                    >
                        {getFieldDecorator(
                            'true',
                            {}
                        )(
                            <div>
                                <Switch
                                    defaultChecked={false}
                                    value={this.state.promiseSelf}
                                    onChange={this.switchHandle}
                                    style={{ margin: '2px 0 4px 10px' }}
                                ></Switch>
                                <span style={{ color: '#999', marginLeft: '20px' }}>
                                    开关打开后，学生可自定义该时段的个人日程，可选场地仅限于许可内的地点
                                </span>
                            </div>
                        )}
                    </Form.Item>
                    {this.state.promiseSelf && (
                        <Form.Item label="允许的地点" style={{ marginBottom: 13 }}>
                            {getFieldDecorator('promisePlace', {
                                rules: [{ required: true, message: '请选择允许的地点' }],
                            })(<TreeSelect {...placeProps}></TreeSelect>)}
                        </Form.Item>
                    )}
                    <Form.Item
                        label={trans('global.repeat', '重复：')}
                        required={true}
                        style={{ marginBottom: 13 }}
                    >
                        <Select
                            defaultValue={repeatType}
                            onSelect={this.repeatTypeChange}
                            style={{ width: 150 }}
                            disabled={createOrEdit === 'edit'}
                        >
                            <Option value={0}>不重复</Option>
                            <Option value={1}>每天</Option>
                            <Option value={2}>每周{currentWeek}</Option>
                            <Option value={3}>每月{currentDay}日</Option>
                            <Option value={4}>每个工作日</Option>
                            <Option value={5}>自定义</Option>
                        </Select>
                        {repeatType === 5 && (
                            <div>
                                <div>
                                    <span style={{ marginRight: 10 }}>每</span>
                                    <InputNumber
                                        min={1}
                                        defaultValue={repeatIntervals}
                                        className={styles.fillInNumber}
                                        style={{ marginRight: 10 }}
                                        onChange={this.changeRepeatIntervals}
                                        disabled={createOrEdit === 'edit'}
                                    />
                                    <Select
                                        style={{ width: 120 }}
                                        defaultValue={customizeType}
                                        onChange={this.customizeTypeChange}
                                        disabled={createOrEdit === 'edit'}
                                    >
                                        <Option value={1}>天</Option>
                                        <Option value={2}>周</Option>
                                        <Option value={3}>月</Option>
                                    </Select>
                                </div>
                                <div>
                                    {customizeType === 2 && (
                                        <Checkbox.Group
                                            defaultValue={repeatCycle}
                                            options={WeekOptions}
                                            onChange={this.repeatCycleChange}
                                            disabled={createOrEdit === 'edit'}
                                        ></Checkbox.Group>
                                    )}
                                </div>
                            </div>
                        )}
                        {repeatType !== 0 && (
                            <div>
                                <span style={{ marginRight: 10 }}>截止日期</span>
                                <DatePicker
                                    defaultValue={repeatEndTime}
                                    allowClear={false}
                                    placeholder={trans('global.data', '日期')}
                                    style={{ marginRight: 10 }}
                                    onChange={this.repeatEndTimeChange}
                                    disabled={createOrEdit === 'edit' || !ifRepeat}
                                />
                            </div>
                        )}
                    </Form.Item>

                    <Form.Item label="是否公布" style={{ marginBottom: 22 }}>
                        {getFieldDecorator('publish', {
                            rules: [{ required: true, message: '请选择是否公布' }],
                        })(
                            <Radio.Group onChange={this.onChangeGroup}>
                                <Radio value={true}>是</Radio>
                                <Radio value={false}>否</Radio>
                            </Radio.Group>
                        )}
                        <div style={{ width: '580px', lineHeight: '20px' }}>
                            <Icon type="info-circle" theme="twoTone" twoToneColor="#eeb020" />
                            选择“是”操作完成后将立即生效到日程，选择“否”操作完成仅在课表中可见，随后可通过课表公布一起生效到日程。
                        </div>
                    </Form.Item>
                    <Form.Item label="备注">
                        {getFieldDecorator('remark')(<TextArea rows={4} />)}
                    </Form.Item>
                </Form>
                <Row>
                    <Col offset={8} span={16}>
                        <Button
                            key="cancel"
                            onClick={this.handleCancel}
                            style={{ borderRadius: 8, marginRight: 10 }}
                        >
                            取消
                        </Button>
                        <Button
                            key="confirm"
                            onClick={this.onOk}
                            type="primary"
                            style={{ borderRadius: 8 }}
                            loading={confirmBtnLoading}
                        >
                            {ifvalue ? '保存并公布' : trans('global.save', '保存')}
                        </Button>
                    </Col>
                </Row>
                {activeConflictList && activeConflictList.length > 0 && (
                    <Modal
                        title={<span>操作提示</span>}
                        wrapClassName={styles.createActivity}
                        visible={conflictCheck}
                        onCancel={this.cancelCheck}
                        footer={[
                            <Button key="abandon" onClick={this.cancelCheck}>
                                放弃
                            </Button>,

                            canBeCreated && timeTableOrClub === 'timeTable' ? (
                                <Button
                                    key="create"
                                    onClick={() => this.sureCreateActive(true)}
                                    type="primary"
                                    loading={sureCreateAndDeleteLoading}
                                >
                                    确定新建并删除冲突课节
                                </Button>
                            ) : (
                                ''
                            ),

                            <Button
                                key="create"
                                onClick={() => this.sureCreateActive(false)}
                                type="primary"
                                loading={sureCreateLoading}
                            >
                                确定新建
                            </Button>,
                        ]}
                        bodyStyle={{ marginTop: '10px' }}
                    >
                        {
                            <div>
                                <div className={styles.summarize}>
                                    您新建的{timeTableOrClub === 'timeTable' ? '活动' : '课节'}
                                    ，和以下
                                    <span className={styles.num}>{num}</span>
                                    个课节冲突
                                </div>
                                {activeConflictList &&
                                    activeConflictList.map((item) => {
                                        return (
                                            <div>
                                                <div className={styles.content}>
                                                    <span className={styles.conflictClassMsg}>
                                                        {item.conflictClassMsg}
                                                    </span>
                                                    <span className={styles.conflictDetail}>
                                                        {item.conflictDetail}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                {timeTableOrClub === 'timeTable' ? (
                                    canBeCreated ? (
                                        ''
                                    ) : (
                                        <span className={styles.tip}>
                                            <i className={icon.iconfont}>&#xe788;</i>
                                            当前课表已公布，您可以先创建活动，再按需处理冲突课节。
                                        </span>
                                    )
                                ) : (
                                    <span className={styles.tip}>
                                        <i className={icon.iconfont}>&#xe788;</i>
                                        您可以先创建活动，如需处理冲突课节，请返回课表视图操作。
                                    </span>
                                )}
                            </div>
                        }
                    </Modal>
                )}
                {roomConflictModalVisible && (
                    <SimpleModal
                        visible={roomConflictModalVisible}
                        title="场地冲突确认"
                        onOk={this.toggleRoomConflictModalVisible}
                        onCancel={() => this.handleSubmit(payloadObj)}
                        okText="换个场地"
                        cancelText="忽略冲突"
                        maskClosable={false}
                        content={
                            <div className={styles.addressConflictContent}>
                                <span>系统检测到场地</span>
                                <span>{roomConflict.roomName}</span>
                                <span>被</span>
                                <span className={styles.text}>
                                    {[
                                        ...roomConflict.freeScheduleSmartScheduleModelList.map(
                                            (item) => {
                                                if (item.ifRepeated) {
                                                    return `${moment(item.startTime).format(
                                                        'YYYY.MM.DD'
                                                    )} ${item.name}`;
                                                } else {
                                                    return item.name;
                                                }
                                            }
                                        ),
                                        ...roomConflict.scheduleResultOutputModelList.map(
                                            (item) =>
                                                `${moment(item.startTimeMillion).format(
                                                    'YYYY.MM.DD'
                                                )} ${item.courseName}`
                                        ),
                                    ].join('、')}
                                </span>
                                <span>占用，请确认</span>
                            </div>
                        }
                    />
                )}
            </Modal>
        );
    }
}
