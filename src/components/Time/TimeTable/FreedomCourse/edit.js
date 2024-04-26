import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import {
    Modal,
    Checkbox,
    Form,
    Input,
    Select,
    Row,
    Col,
    DatePicker,
    TimePicker,
    Radio,
    InputNumber,
    TreeSelect,
    message,
    Icon,
    Switch,
    Button,
} from 'antd';
import moment from 'moment';
import icon from '../../../../icon.less';
import { formatTime, formatUsualTime, formatTimeSafari } from '../../../../utils/utils';
import SelectTeacherAndOrg from './common/selectTeacherAndOrg/index';
import { trans } from '../../../../utils/i18n';
import SimpleModal from '../../../CommonModal/SimpleModal';

const { Option } = Select;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const format = 'HH:mm';
const dateFormat = 'YYYY/MM/DD';

let ids = 1;

@Form.create()
@connect((state) => ({
    studentList: state.timeTable.studentList,
    areaList: state.timeTable.areaList,
    accountCourseNum: state.timeTable.accountCourseNum, //编辑操作涉及到的课程数量
    getPublishResultList: state.course.publishResult,
    editActiveConflictList:
        state.timeTable.editActiveConflictList &&
        state.timeTable.editActiveConflictList.freeScheduleConflictModels &&
        state.timeTable.editActiveConflictList.freeScheduleConflictModels,
    canBeCreated:
        state.timeTable.editActiveConflictList &&
        state.timeTable.editActiveConflictList.canBeCreated &&
        state.timeTable.editActiveConflictList.canBeCreated,
    fetchTeacherAndOrg: state.global.fetchTeacherAndOrg, //组织和人员列表，栾碧霞测试专用接口
    weekVersionCourseList: state.timeTable.weekVersionCourseList,
    courseList: state.course.courseList, // 个人课程 ---
    gradeByTypeArr: state.timeTable.gradeByTypeArr, //学生组件优化

    //新增
    freeCourseDetail: state.timeTable.freeCourseDetail,
    semesterList: state.time.semesterList,

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

            // 个人课程 ---
            ifSingleTime: true, // 只修改本次
            showRepeatList: false, //是否显示重复类型、频数和结束日期

            value: false,
            buttonTrue: true,
            // 冲突校验
            editConflictCheck: false, // 校验modal的显隐
            promisePlace: '', // 允许的地点
            promiseSelf: '',

            departmentList: [],

            createOrEdit: 'edit',
            currentWeek: '',
            currentDay: '',
            startDateTime: '',

            freePublish: false,

            //场地冲突
            roomConflictModalVisible: false,
            payloadObj: {},
            confirmBtnLoading: false,
            sureCreateLoading: false,
            sureCreateAndDeleteLoading: false,
        };
    }

    componentDidMount() {
        let nextProps = this.props;

        nextProps.showEditFreedomCourse && nextProps.getGroupByTree(nextProps.currentTime);

        nextProps.dispatch({
            type: 'global/fetchTeacherAndOrg',
            payload: {},
        });

        //是否显示公布
        this.getPublishResult(nextProps);

        let freeCourseDetail = nextProps.freeCourseDetail;
        //判断地点类型
        if (freeCourseDetail && freeCourseDetail.playgroundId) {
            this.setState({
                ifAtSchool: 'playground',
            });
        } else if (freeCourseDetail && freeCourseDetail.outsidePlayground) {
            this.setState({
                ifAtSchool: 'outside',
            });
        } else {
            this.setState({
                ifAtSchool: 'defaultAddress',
            });
        }
        this.getCurrentWeek(freeCourseDetail && freeCourseDetail.repeatEndTime);
        this.getCurrentDay(freeCourseDetail && freeCourseDetail.repeatEndTime);

        this.setState({
            repeat: freeCourseDetail && freeCourseDetail.ifRepeated ? 'repeat' : 'noRepeat',
            ifRepeat: freeCourseDetail && freeCourseDetail.ifRepeated,
            repeatType:
                freeCourseDetail && freeCourseDetail.repeatType ? freeCourseDetail.repeatType : 0,
            customizeType: freeCourseDetail && freeCourseDetail.customizeType,
            repeatCycle: freeCourseDetail && freeCourseDetail.repeatCycle,
            repeatIntervals: freeCourseDetail && freeCourseDetail.repeatIntervals,
            overDate: freeCourseDetail && freeCourseDetail.repeatEndTime,
            repeatEndTime:
                freeCourseDetail &&
                freeCourseDetail.repeatEndTime &&
                moment(freeCourseDetail.repeatEndTime),
            promiseSelf: freeCourseDetail && freeCourseDetail.allowSelfArrangement,
            freePublish: freeCourseDetail && freeCourseDetail.freePublish,
        });
    }

    //是否显示公布
    getPublishResult(props) {
        const { dispatch, freeCourseDetail } = this.props;
        dispatch({
            type: 'course/getPublishResult',
            payload: {
                resultType: 3,
                resultId: freeCourseDetail && freeCourseDetail.id,
            },
        });
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
        const { hideEditFreeModal, form } = this.props;
        typeof hideEditFreeModal == 'function' && hideEditFreeModal.call(this);
        form.resetFields();
        this.setState(
            {
                repeat: '',
                ifAtSchool: 'playground',
                timeList: [],
                timeType: 'shijian',
                repeatType: undefined,
                showRepeatList: false,
                value: false,
                buttonTrue: true,
            },
            () => {}
        );
    };

    editCancelCheck = () => {
        this.setState({
            editConflictCheck: false,
        });
    };

    // 处理活动冲突的resultId
    dealResultId = () => {
        let resultIdArr = [];
        this.props.editActiveConflictList &&
            this.props.editActiveConflictList.length > 0 &&
            this.props.editActiveConflictList.map((item) => {
                resultIdArr.push(item.resultId);
                return resultIdArr;
            });
        return resultIdArr;
    };

    editSureCreateActive = (isDelete) => {
        const { dispatch, timeTableOrClub } = this.props;
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
                flag: false,
                deleteConflictResult,
            },
            onSuccess: () => {
                message.success('自由排课编辑成功~');
                this.handleCancel();
                //调用课程表
                const { showTable, getClubDataSource } = this.props;
                typeof showTable == 'function' && showTable.call(this, '编辑自由排课');
                //请求table数据
                typeof getClubDataSource == 'function' && getClubDataSource.call(this);
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

    //编辑修改提交
    submitEdit = (payloadObj) => {
        const { dispatch } = this.props;
        this.setState({
            confirmBtnLoading: true,
            roomConflictModalVisible: false,
        });
        dispatch({
            type: 'timeTable/editFreeCourse',
            payload: payloadObj,
            onSuccess: () => {
                let editConflictList =
                    this.props.editActiveConflictList && this.props.editActiveConflictList;
                editConflictList &&
                    this.setState(
                        {
                            editConflictCheck: true,
                        },
                        () => {}
                    );
                !editConflictList && this.handleCancel();
                !editConflictList && message.success('自由排课编辑成功~');
                //调用课程表
                const { showTable, getClubDataSource } = this.props;
                !editConflictList &&
                    typeof showTable == 'function' &&
                    showTable.call(this, '编辑自由排课');
                //请求table数据
                !editConflictList &&
                    typeof getClubDataSource == 'function' &&
                    getClubDataSource.call(this);
            },
        }).then(() => {
            this.setState({
                buttonTrue: true,
                value: false,
                confirmBtnLoading: false,
            });
        });
    };
    //是否公布
    onChangeGroup = (e) => {
        this.setState({
            value: e.target.value,
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

    //活动--获取学生组的id
    getStudentGroupId = (arr) => {
        if (!arr || arr.length <= 0) return [];
        let resultId = [];
        arr.map((item) => {
            resultId.push(item.id);
        });
        return resultId;
    };
    getStudentGroupLabel = (arr) => {
        if (!arr || arr.length <= 0) return [];
        let resultId = [];
        arr.map((item) => {
            resultId.push(item.name);
        });
        return resultId;
    };

    //活动--获取部门的id
    getDepartmentIds = (arr) => {
        if (!arr || arr.length <= 0) return [];
        let resultId = [];
        arr.map((item) => {
            resultId.push(`org-${item.id}`);
        });
        return resultId;
    };

    //club--选择学生组
    changeClubStudentGroup = (value) => {
        this.setState({
            clubStudentGroupValue: value,
        });
    };

    //club-格式化教师列表
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

    //渲染活动的Item
    renderActivityItem = () => {
        const {
            form: { getFieldDecorator },
            gradeByTypeArr,
            studentList,
            freeCourseDetail,
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
                        initialValue:
                            freeCourseDetail &&
                            freeCourseDetail.type == '2' &&
                            freeCourseDetail.name,
                    })(<Input placeholder="请输入活动主题" />)}
                </Form.Item>
                <Form.Item label="英文主题">
                    {getFieldDecorator('englishTheme', {
                        rules: [{ required: true, message: '请输入英文主题' }],
                        initialValue:
                            freeCourseDetail &&
                            freeCourseDetail.type == '2' &&
                            freeCourseDetail.englishName,
                    })(<Input placeholder="请输入活动主题" />)}
                </Form.Item>
                <Form.Item label="关联课程">
                    {getFieldDecorator('courseId', {
                        initialValue:
                            freeCourseDetail &&
                            freeCourseDetail.type == '2' &&
                            freeCourseDetail.courseId,
                    })(
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
                    {getFieldDecorator('activeStudentGroup', {
                        initialValue:
                            freeCourseDetail &&
                            freeCourseDetail.type == '2' &&
                            this.getStudentGroupId(freeCourseDetail.studentGroups),
                    })(<TreeSelect {...studentGroupProps} />)}
                </Form.Item>
                <Form.Item {...tailFormItemLayout} style={{ marginBottom: 10 }}>
                    {getFieldDecorator('activeStudenList', {
                        initialValue:
                            freeCourseDetail &&
                            freeCourseDetail.type == '2' &&
                            this.getStudentGroupId(freeCourseDetail.students),
                    })(<TreeSelect {...studentProps} />)}
                </Form.Item>
                <Form.Item
                    label={[
                        // <span className={styles.redRemark}>*</span>,
                        <span>必选教师</span>,
                    ]}
                    style={{ marginBottom: 25 }}
                >
                    {getFieldDecorator('activeTeacherList', {
                        // rules: [{ required: true, message: '请输入club名称' }],
                        initialValue:
                            freeCourseDetail &&
                            freeCourseDetail.type == '2' &&
                            this.getStudentGroupId(freeCourseDetail.necessaryTeachers),
                    })(
                        <SelectTeacherAndOrg
                            placeholder="搜索或选择人员与部门"
                            treeData={this.props.fetchTeacherAndOrg}
                            userIds={this.getStudentGroupId(freeCourseDetail.necessaryTeachers)}
                            orgIds={this.getDepartmentIds(freeCourseDetail.necessaryDepartments)}
                            onRef={(ref) => {
                                this.necessary = ref;
                            }}
                        />
                    )}
                </Form.Item>
                <Form.Item label="可选教师" style={{ marginBottom: 22 }}>
                    {getFieldDecorator('activeOptionalTeacherList', {
                        initialValue:
                            freeCourseDetail &&
                            freeCourseDetail.type == '2' &&
                            this.getStudentGroupId(freeCourseDetail.unnecessaryTeachers),
                    })(
                        <SelectTeacherAndOrg
                            placeholder="搜索或选择人员与部门"
                            treeData={this.props.fetchTeacherAndOrg}
                            userIds={this.getStudentGroupId(freeCourseDetail.unnecessaryTeachers)}
                            orgIds={this.getDepartmentIds(freeCourseDetail.unnecessaryDepartments)}
                            onRef={(ref) => {
                                this.unnecessary = ref;
                            }}
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
        this.setState(
            {
                ifAtSchool: e.target.value,
            },
            () => {}
        );
    };

    //填写场外地点
    fillInOutside = (value) => {
        this.setState({
            outsideAddress: value,
        });
    };

    switchHandle = (checked) => {
        this.setState({
            promiseSelf: checked,
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

    // 个人课程 --- 编辑二次确认
    changeIfSingleTime = (e) => {
        let value = e.target.value;
        this.setState({
            ifSingleTime: value,
        });
        const { dispatch, freeCourseDetail } = this.props;
        let self = this;
        if (!value) {
            dispatch({
                type: 'timeTable/confirmCourseNum',
                payload: {
                    freeResultId: freeCourseDetail.id,
                },
                onSuccess: () => {
                    const { accountCourseNum } = this.props;
                    Modal.info({
                        title: `此操作将修改本次及以后所有共有${
                            accountCourseNum.amount || 0
                        }个课程安排`,
                        okText: '知道了',
                        onOk() {
                            //显示重复类型、频数、结束日期
                            self.setState({
                                showRepeatList: true,
                            });
                        },
                    });
                },
            });
        } else {
            this.setState({
                showRepeatList: false,
            });
        }
    };

    formatId(list, type) {
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
        if (type == 'org') {
            return org;
        } else if (type == 'user') {
            return user;
        }
    }

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
        if (value == 1 || value == 2 || value == 3 || value == 4) {
            this.setState({
                repeatIntervals: 1,
            });
        }

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
        if (!date) {
            return '';
        }
        let week = moment(date).format('dddd');
        this.setState({
            currentWeek: week.charAt(week.length - 1),
        });
    };

    getCurrentDay = (date) => {
        if (!date) {
            return '';
        }
        let day = moment(date).format('L');
        this.setState({
            currentDay: day.substr(day.length - 2),
        });
    };

    toggleRoomConflictModalVisible = () => {
        const { roomConflictModalVisible } = this.state;
        this.setState({
            roomConflictModalVisible: !roomConflictModalVisible,
            buttonTrue: true,
        });
    };

    onOk = (e) => {
        e.preventDefault();
        const { dispatch, form, freeCourseDetail, currentVersion } = this.props;
        const {
            buttonTrue,
            ifRepeat,
            repeatType,
            repeatIntervals,
            repeatCycle,
            repeatEndTime,
            customizeType,
        } = this.state;
        if (!buttonTrue) {
            return false;
        }
        this.setState(
            {
                buttonTrue: false,
            },
            () => {
                form.validateFieldsAndScroll(
                    {
                        scroll: { offsetBottom: 400 },
                    },
                    (err, values) => {
                        if (err) {
                            this.setState({
                                buttonTrue: true,
                            });
                        }
                        if (!err) {
                            let payloadObj = {};
                            //公共参数
                            let commonObj = {
                                schoolId: '',
                                remark: values.remark,
                            };
                            if (values.repeat == 'repeat') {
                                //重复
                                commonObj.ifRepeat = true;
                                commonObj.repeatType = values.repeatType;
                                commonObj.repeatIntervals = values.repeatIntervals;
                                if (typeof this.state.overDate === 'number') {
                                    commonObj.repeatEndTime = this.state.overDate;
                                } else {
                                    commonObj.repeatEndTime = new Date(
                                        formatTimeSafari(this.state.overDate + ' 23:59:59')
                                    ).getTime();
                                }
                                commonObj.ifSingleTime = values.ifSingleTime;
                            } else if (values.repeat == 'noRepeat') {
                                //不重复
                                commonObj.ifRepeat = false;
                                commonObj.ifSingleTime = true;
                            } else {
                                commonObj.ifRepeat = false;
                                commonObj.ifSingleTime = true;
                            }

                            if (values.addressType == 'playground') {
                                //校内地点
                                commonObj.playgroundId = values.editPlaygroundId;
                            } else if (values.addressType == 'outside') {
                                //校外地点
                                commonObj.outsidePlayground = values.outsidePlayground;
                            }
                            //时间校验，开始时间不能大于结束时间
                            if (!this.validateStartEnd(values)) {
                                message.info('开始时间不能大于等于结束时间');
                                this.setState({
                                    buttonTrue: true,
                                });
                                return false;
                            }

                            if (
                                (!values.activeStudenList || values.activeStudenList.length == 0) &&
                                (!values.activeStudentGroup ||
                                    values.activeStudentGroup.length == 0)
                            ) {
                                message.info('请选择要分配学生或学生组');
                                this.setState({
                                    buttonTrue: true,
                                });
                                return false;
                            }
                            let startAndEnd = this.formatTimeList(values);

                            let calendarObj = {};
                            calendarObj.ifRepeat = ifRepeat;
                            calendarObj.repeatType = repeatType;
                            calendarObj.repeatIntervals = repeatIntervals;
                            calendarObj.repeatCycle = repeatCycle;
                            calendarObj.repeatEndTime =
                                moment(repeatEndTime).endOf('day').valueOf() - 999;
                            calendarObj.customizeType = customizeType;

                            payloadObj = {
                                versionId: currentVersion,
                                id: freeCourseDetail.id,
                                groupId: freeCourseDetail.groupId,
                                repeatRule: freeCourseDetail.repeatRule,
                                name: values.theme,
                                englishName: values.englishTheme,
                                startTime: startAndEnd[0].startTime, //开始时间
                                endTime: startAndEnd[0].endTime, //结束时间
                                type: freeCourseDetail.type,
                                tagId: freeCourseDetail.tagId,
                                schoolId: '',
                                necessaryStudentList: values.activeStudenList,
                                necessaryStudentGroupList: values.activeStudentGroup,
                                necessaryTeacherList: this.necessary.state.userIds,
                                necessaryDepartmentList: this.formatId(
                                    this.necessary.state.orgIds,
                                    'org'
                                ),
                                //necessaryDepartmentList: this.formatOptionalOrg(values.activeTeacherGroup),
                                unnecessaryTeacherList: this.unnecessary.state.userIds,
                                unnecessaryDepartmentList: this.formatId(
                                    this.unnecessary.state.orgIds,
                                    'org'
                                ),
                                publish: values.publish,
                                noticeIdentities: values.noticeIdentities,
                                allowSelfArrangement: this.state.promiseSelf
                                    ? this.state.promiseSelf
                                    : freeCourseDetail.allowSelfArrangement,
                                selfArrangementAddressIdList: this.state.promisePlace
                                    ? this.state.promisePlace
                                    : freeCourseDetail.selfArrangementAddressIdList,
                                ...commonObj,
                                ...calendarObj,
                                ifSingleTime: this.state.ifSingleTime,
                                courseId: values.courseId,
                            };
                            this.setState({
                                confirmBtnLoading: true,
                            });
                            dispatch({
                                type: 'timeTable/getRoomConflict',
                                payload: payloadObj,
                            }).then(() => {
                                const { roomConflict } = this.props;
                                if (roomConflict.conflict) {
                                    this.toggleRoomConflictModalVisible();
                                    this.setState({
                                        payloadObj,
                                        confirmBtnLoading: false,
                                    });
                                } else {
                                    this.submitEdit(payloadObj);
                                }
                            });
                        }
                    }
                );
            }
        );
    };

    render() {
        const {
            showEditFreedomCourse,
            form: { getFieldDecorator },
            areaList,
            freeCourseDetail,
            getPublishResultList,
            editActiveConflictList,
            canBeCreated,
            roomConflict,
            timeTableOrClub,
        } = this.props;
        const {
            ifAtSchool, //校内地点 && 校外地点
            repeat, //是否重复
            ifSingleTime,
            value,
            buttonTrue,
            editConflictCheck,
            promiseSelf,
            ifRepeat,
            repeatType,
            repeatCycle,
            customizeType,
            repeatIntervals,
            repeatEndTime,
            currentWeek,
            currentDay,
            createOrEdit,
            freePublish,
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
        const options = [
            { label: '教师', value: 'employee' },
            { label: '学生', value: 'student' },
            { label: '家长', value: 'parent' },
        ];

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
        let num = editActiveConflictList && editActiveConflictList.length;

        return (
            <Modal
                title="编辑活动"
                visible={showEditFreedomCourse}
                onCancel={this.handleCancel}
                width="1000px"
                footer={null}
                key="editFreedom"
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
                                            onChange={this.renderClubItem}
                                        >
                                            <Option value="time">按时间选择</Option>
                                        </Select>
                                    )}
                                </Col>
                                <Col span={6}>
                                    <Form.Item style={{ marginBottom: 0 }}>
                                        {getFieldDecorator('clubDate0', {
                                            rules: [{ required: true, message: '请选择日期' }],
                                            initialValue: moment(
                                                formatTime(
                                                    freeCourseDetail && freeCourseDetail.startTime
                                                ),
                                                dateFormat
                                            ),
                                        })(
                                            <DatePicker
                                                allowClear={false}
                                                format={dateFormat}
                                                placeholder="请选择日期"
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
                                                    initialValue: moment(
                                                        formatUsualTime(
                                                            freeCourseDetail &&
                                                                freeCourseDetail.startTime
                                                        ),
                                                        format
                                                    ),
                                                })(
                                                    <TimePicker
                                                        format={format}
                                                        allowClear={false}
                                                        style={{ width: 100, marginRight: 5 }}
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
                                                        initialValue: moment(
                                                            formatUsualTime(
                                                                freeCourseDetail &&
                                                                    freeCourseDetail.endTime
                                                            ),
                                                            format
                                                        ),
                                                    })(
                                                        <TimePicker
                                                            format={format}
                                                            allowClear={false}
                                                            style={{ width: 100 }}
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
                    <Row gutter={4}>
                        <Col span={14} offset={2}>
                            <Form.Item label="地点类型" style={{ marginBottom: 0 }}>
                                {getFieldDecorator('addressType', {
                                    rules: [{ required: true, message: '请选择地点类型' }],
                                    initialValue: ifAtSchool,
                                })(
                                    <RadioGroup onChange={this.selectAddress}>
                                        <Radio value="defaultAddress">默认地点</Radio>
                                        <Radio value="playground">校内地点</Radio>
                                        <Radio value="outside">校外地点</Radio>
                                    </RadioGroup>
                                )}
                            </Form.Item>
                        </Col>
                        {ifAtSchool == 'playground' ? (
                            <Col span={6}>
                                <Form.Item style={{ marginBottom: 8 }}>
                                    {getFieldDecorator('editPlaygroundId', {
                                        rules: [
                                            {
                                                required: ifAtSchool == 'playground' ? true : false,
                                                message: '请选择校内地点',
                                            },
                                        ],
                                        initialValue:
                                            freeCourseDetail && freeCourseDetail.playgroundId,
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
                            </Col>
                        ) : null}
                        {ifAtSchool == 'outside' && (
                            <Col span={6}>
                                <Form.Item style={{ marginBottom: 8 }}>
                                    {getFieldDecorator('outsidePlayground', {
                                        rules: [{ required: true, message: '请填写校外地点' }],
                                        initialValue:
                                            freeCourseDetail && freeCourseDetail.outsidePlayground,
                                    })(
                                        <Input
                                            placeholder="请填写场外地点"
                                            onChange={this.fillInOutside}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                        )}
                    </Row>
                    <Form.Item
                        label={
                            <span>
                                <i style={{ color: 'red' }}>*</i> 是否允许学生自主安排
                            </span>
                        }
                        style={{ marginBottom: 13 }}
                    >
                        {getFieldDecorator('promiseSelf', {
                            initialValue: freeCourseDetail && freeCourseDetail.allowSelfArrangement,
                        })(
                            <div>
                                <Switch
                                    defaultChecked={promiseSelf}
                                    onChange={this.switchHandle}
                                    style={{ margin: '2px 0 4px 10px' }}
                                ></Switch>
                                <span style={{ color: '#999', marginLeft: '20px' }}>
                                    开关打开后，学生可自定义该时段的个人日程，可选场地仅限于许可内的地点
                                </span>
                            </div>
                        )}
                    </Form.Item>
                    {promiseSelf && freeCourseDetail.allowSelfArrangement && (
                        <Form.Item label="允许的地点" style={{ marginBottom: 13 }}>
                            {getFieldDecorator('promisePlace', {
                                rules: [{ required: true, message: '请选择允许的地点' }],
                                initialValue:
                                    freeCourseDetail &&
                                    freeCourseDetail.selfArrangementAddressIdList,
                            })(<TreeSelect {...placeProps}></TreeSelect>)}
                        </Form.Item>
                    )}
                    <Form.Item label="修改范围">
                        {getFieldDecorator('ifSingleTime', {
                            rules: [{ required: true, message: '请选择修改范围' }],
                            initialValue: ifSingleTime,
                            // setFieldsValue: ifSingleTime,
                        })(
                            <Radio.Group onChange={this.changeIfSingleTime}>
                                <Radio value={true}>修改本次</Radio>
                                <Radio value={false}>修改本次及以后所有</Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>
                    {!ifSingleTime && (
                        <Form.Item
                            label={trans('global.repeat', '重复：')}
                            required={true}
                            style={{ marginBottom: 13 }}
                        >
                            <Select
                                defaultValue={repeatType}
                                onSelect={this.repeatTypeChange}
                                style={{ width: 150 }}
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
                                        />
                                        <Select
                                            style={{ width: 120 }}
                                            defaultValue={customizeType}
                                            onChange={this.customizeTypeChange}
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
                                        // disabled={createOrEdit === 'edit' || !ifRepeat}
                                    />
                                </div>
                            )}
                        </Form.Item>
                    )}

                    <Form.Item label="是否公布">
                        {getFieldDecorator('publish', {
                            rules: [{ required: true, message: '请选择是否公布' }],
                            initialValue: freePublish ? true : undefined,
                        })(
                            <Radio.Group onChange={this.onChangeGroup} disabled={freePublish}>
                                <Radio value={true}>是</Radio>
                                <Radio value={false}>否</Radio>
                            </Radio.Group>
                        )}
                        <div style={{ width: '580px', lineHeight: '20px' }}>
                            <Icon type="info-circle" theme="twoTone" twoToneColor="#eeb020" />
                            选择“是”操作完成后将立即生效到日程，选择“否”操作完成仅在课表中可见，随后可通过课表公布一起生效到日程。
                        </div>
                    </Form.Item>
                    {getPublishResultList && value && (
                        <Form.Item label="通知人员">
                            {getFieldDecorator('noticeIdentities')(
                                <Checkbox.Group options={options} />
                            )}
                        </Form.Item>
                    )}
                    <Form.Item label="备注">
                        {getFieldDecorator('remark', {
                            initialValue: freeCourseDetail && freeCourseDetail.remark,
                        })(<TextArea rows={4} />)}
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
                        {buttonTrue ? (
                            <Button
                                key="confirm"
                                onClick={this.onOk}
                                type="primary"
                                style={{ borderRadius: 8 }}
                                loading={confirmBtnLoading}
                            >
                                {value ? '保存并公布' : trans('global.save', '保存')}
                            </Button>
                        ) : (
                            <Button
                                key="confirm"
                                type="primary"
                                style={{ borderRadius: 8 }}
                                loading={confirmBtnLoading}
                            >
                                {value ? '保存并公布' : trans('global.save', '保存')}
                            </Button>
                        )}
                    </Col>
                </Row>
                {editActiveConflictList && editActiveConflictList.length > 0 && (
                    <Modal
                        title={<span>操作提示</span>}
                        visible={editConflictCheck}
                        onCancel={this.editCancelCheck}
                        footer={[
                            <Button key="abandon" onClick={this.editCancelCheck}>
                                放弃
                            </Button>,
                            canBeCreated && timeTableOrClub === 'timeTable' ? (
                                <Button
                                    key="create"
                                    onClick={() => this.editSureCreateActive(true)}
                                    type="primary"
                                    loading={sureCreateAndDeleteLoading}
                                >
                                    确定修改并删除冲突课节
                                </Button>
                            ) : (
                                ''
                            ),
                            <Button
                                key="create"
                                onClick={() => this.editSureCreateActive(false)}
                                type="primary"
                                loading={sureCreateLoading}
                            >
                                确定修改
                            </Button>,
                        ]}
                        bodyStyle={{ marginTop: '10px' }}
                        wrapClassName={styles.createActivity}
                    >
                        {
                            <div>
                                <div className={styles.summarize}>
                                    您编辑的课节，和以下<span className={styles.num}>{num}</span>
                                    个课节冲突
                                </div>
                                {editActiveConflictList &&
                                    editActiveConflictList.map((item) => {
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
                                            当前课表已公布，您可以先编辑活动，再按需处理冲突课节。
                                        </span>
                                    )
                                ) : (
                                    <span className={styles.tip}>
                                        <i className={icon.iconfont}>&#xe788;</i>
                                        您可以先编辑活动，如需处理冲突课节，请返回课表视图操作。
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
                        onCancel={() => this.submitEdit(payloadObj)}
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
