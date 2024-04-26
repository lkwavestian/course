import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import icon from '../../../../icon.less';
import { Select, Popover, Icon, TreeSelect, message } from 'antd';
import { trans } from '../../../../utils/i18n';
const { Option } = Select;

@connect((state) => ({
    customStudentList: state.timeTable.customStudentList,
}))
export default class PopoverContentLessonView extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            customSelectValue: 0, // 自定义筛选场景value
            selectTeacher: undefined, // 自定义教师筛选value
            selectAddress: undefined, // 自定义场地筛选value
            gradeValue: undefined, // 自定义场景年级筛选value
            groupValue: undefined, // 自定义班级筛选value
            selectStudentValue: undefined, // 自定义学生筛选value
            customVisible: false, // 自定义筛选框显示状态
            currentVersionId: '',
            isFetch: false, // 教师请求状态控制
            isFetchAddress: false, // 场地
            isFetchGroup: false, // 班级
            addType: '',
        };
    }

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }
    }

    //按照教师搜索课表
    changeTeacher = (value, date) => {
        this.setState({
            selectTeacher: value,
            addType: date.props.type,
        });
    };

    //按照场地进行筛选
    changeAddress = (value, date) => {
        console.log('date changeAddress :>> ', date);
        this.setState({
            selectAddress: value,
            addType: date.props.type,
        });
    };

    //选择年级
    changeGrade = (value, date) => {
        console.log('date changeGrade :>> ', date);
        this.setState({
            gradeValue: value,
            addType: date.props.type,
        });
    };

    // 搜索班级
    changeGroup = (type, e) => {
        console.log('date changeStudent:>> ', type);
        this.setState({
            groupValue: e,
            addType: type,
        });
    };

    // 搜索学生
    changeStudent = (value, date) => {
        console.log('date changeStudent:>> ', date);
        this.setState({
            selectStudentValue: value,
            addType: date.props.type,
        });
    };

    // 获取自定义筛选select value
    getCustomSelectValue = (value) => {
        this.setState({
            customSelectValue: value,
            selectTeacher: undefined, // 自定义教师筛选value
            selectAddress: undefined, // 自定义场地筛选value
            gradeValue: undefined, // 自定义场景年级筛选value
            groupValue: undefined, // 自定义班级筛选value
            selectStudentValue: undefined, // 自定义学生筛选value
            teacherName: '',
        });
    };

    teacherHtml = () => {
        const { selectTeacher } = this.state;
        const { teacherList } = this.props;
        return (
            <Select
                value={selectTeacher}
                placeholder={trans('global.searchTeachers', '搜索教师个人')}
                className={styles.searchTeacher}
                onChange={this.changeTeacher}
                optionFilterProp="children"
                showArrow={false}
                showSearch={true}
            >
                {teacherList &&
                    teacherList.length > 0 &&
                    teacherList.map((item) => {
                        return (
                            <Option value={item.teacherId} key={item.teacherId} type="teacher">
                                {item.name} {item.englishName}
                            </Option>
                        );
                    })}
            </Select>
        );
    };

    addressHtml = () => {
        const { areaList } = this.props;
        const { selectAddress } = this.state;
        return (
            <Select
                value={selectAddress}
                placeholder={trans('global.searchAddress', '搜索场地')}
                className={styles.searchTeacher}
                onChange={this.changeAddress}
                optionFilterProp="children"
                showArrow={false}
                showSearch={true}
            >
                {areaList &&
                    areaList.length > 0 &&
                    areaList.map((item) => {
                        return (
                            <Option value={item.id} key={item.id} title={item.name} type="address">
                                {item.name}
                            </Option>
                        );
                    })}
            </Select>
        );
    };

    gradeHtml = () => {
        const { gradeList } = this.props;
        const { gradeValue } = this.state;
        return (
            <Select
                value={gradeValue}
                placeholder={trans('global.selectGrades', '搜索年级')}
                className={styles.searchTeacher}
                onChange={this.changeGrade}
                optionFilterProp="children"
                showArrow={false}
                showSearch={true}
            >
                {gradeList &&
                    gradeList.length > 0 &&
                    gradeList.map((item) => {
                        return (
                            <Option value={item.id} key={item.id} title={item.name} type="grade">
                                {item.name}
                            </Option>
                        );
                    })}
            </Select>
        );
    };

    groupHtml = () => {
        const { groupList, gradeByTypeArr } = this.props;
        const { groupValue } = this.state;
        const studentGroupProps = {
            treeData: gradeByTypeArr,
            placeholder: trans('course.plan.orClass', '选择班级'),
            onChange: this.changeGroup.bind(this, 'group'),
            dropdownStyle: {
                maxHeight: 400,
                overflow: 'auto',
            },
            treeNodeFilterProp: 'title',
            treeCheckable: true,
            treeDefaultExpandedKeys: ['1行政班'],
        };
        return <TreeSelect {...studentGroupProps} />;
    };

    studentHtml = () => {
        const { selectStudentValue } = this.state;
        const { customStudentList } = this.props;
        return (
            <Select
                value={selectStudentValue}
                placeholder={trans('global.searchStudents', '搜索选择学生')}
                className={styles.searchTeacher}
                onChange={this.changeStudent}
                optionFilterProp="children"
                showArrow={false}
                showSearch={true}
            >
                {customStudentList &&
                    customStudentList.length > 0 &&
                    customStudentList.map((item) => {
                        return (
                            <Option value={item.id} key={item.id} title={item.name} type="student">
                                {item.name}
                            </Option>
                        );
                    })}
            </Select>
        );
    };
    // 判断自定义添加id是否已存在
    handleNotRepeat = (value) => {
        const { scheduleData } = this.props;
        const { addType } = this.state;
        let isRepeat = false;
        let length = scheduleData && scheduleData.length;
        for (let i = 0; i < length; i++) {
            if (value == scheduleData[i].studentGroup.id && addType == scheduleData[i].view) {
                isRepeat = true;
                break;
            }
        }
        return isRepeat;
    };
    // 点击教师查看教师课程
    getTeachersCourse = (id) => {
        const { isFetch } = this.state;
        let _this = this;
        if (isFetch) return; //判断是否请求中
        // 判断课表中添加的老师是否与当前点击的相等，若相等，课表已存在不添加
        if (this.handleNotRepeat(id)) {
            message.info('课表已存在该老师');
            return;
        }
        const { dispatch, rowValue, currentVersion } = this.props;
        let studentGroupId = rowValue.studentGroup.id;
        this.setState(
            {
                isFetch: true,
            },
            () => {
                dispatch({
                    type: 'lessonView/findCustomSchedule',
                    payload: {
                        id: currentVersion,
                        teacherIds: [id],
                        type: 'teacher',
                        idType: 'teacherIds',
                    },
                }).then(() => {
                    // 点击详情添加一行，存储添加行的id,方便自定义视角调换课后重新请求数据
                    _this.props.saveCustomValue(id, 'customTeacher');
                    this.setState({
                        isFetch: false,
                    });
                });
            }
        );
    };

    // 点击场地查看场地对应课程
    getAddressCourse = (roomId, addType) => {
        const { isFetchAddress } = this.state;
        console.log(isFetchAddress, 'isFetchAddress');
        let _this = this;
        if (isFetchAddress) return; //判断是否请求中
        // 判断课表中添加的老师是否与当前点击的相等，若相等，课表已存在不添加
        if (this.handleNotRepeat(roomId, addType)) {
            message.info('课表已存在该场地');
            return;
        }
        const { dispatch, rowValue, currentVersion } = this.props;
        let studentGroupId = rowValue.studentGroup.id;
        this.setState(
            {
                isFetchAddress: true,
            },
            () => {
                dispatch({
                    type: 'lessonView/findCustomSchedule',
                    payload: {
                        id: currentVersion,
                        playgroundIds: [roomId],
                        type: 'address',
                        idType: 'playgroundIds',
                    },
                }).then(() => {
                    // 点击详情添加一行，存储添加行的id,方便自定义视角调换课后重新请求数据
                    _this.props.saveCustomValue(roomId, 'customAddress');
                    this.setState({
                        isFetchAddress: false,
                    });
                });
            }
        );
    };

    getGroupCourse = (id) => {
        const { isFetchGroup } = this.state;
        let _this = this;
        if (isFetchGroup) return; //判断是否请求中
        // 判断课表中添加的老师是否与当前点击的相等，若相等，课表已存在不添加
        if (this.handleNotRepeat(id)) {
            message.info('课表已存在该班级');
            return;
        }
        const { dispatch, rowValue, currentVersion } = this.props;
        let studentGroupId = rowValue.studentGroup.id;
        this.setState(
            {
                isFetchGroup: true,
            },
            () => {
                dispatch({
                    type: 'lessonView/findCustomSchedule',
                    payload: {
                        id: currentVersion,
                        groupIds: id,
                        type: 'group',
                        idType: 'groupIds',
                    },
                }).then(() => {
                    // 点击详情添加一行，存储添加行的id,方便自定义视角调换课后重新请求数据
                    _this.props.saveCustomValue(id, 'customGroup');
                    this.setState({
                        isFetchGroup: false,
                    });
                    id.forEach((idItem) => {
                        dispatch({
                            type: 'lessonView/getClassScheduleACList',
                            payload: {
                                versionId: currentVersion,
                                adminGroupIdString: idItem,
                            },
                        });
                    });
                });
            }
        );
    };

    getGradeCourse = (id) => {
        const { isFetchGroup } = this.state;
        let _this = this;
        if (isFetchGroup) return; //判断是否请求中
        // 判断课表中添加的老师是否与当前点击的相等，若相等，课表已存在不添加
        if (this.handleNotRepeat(id)) {
            message.info('课表已存在该年级');
            return;
        }
        const { dispatch, rowValue, currentVersion } = this.props;
        let studentGroupId = rowValue.studentGroup.id;
        this.setState(
            {
                isFetchGroup: true,
            },
            () => {
                dispatch({
                    type: 'lessonView/findCustomSchedule',
                    payload: {
                        id: currentVersion,
                        gradeIdList: [id],
                        type: 'grade',
                        idType: 'gradeIdList',
                    },
                }).then(() => {
                    // 点击详情添加一行，存储添加行的id,方便自定义视角调换课后重新请求数据
                    _this.props.saveCustomValue(id, 'customGrade');
                    this.setState({
                        isFetchGroup: false,
                    });
                });
            }
        );
    };

    getStudentCourse = (id) => {
        const { isFetchGroup } = this.state;
        let _this = this;
        if (isFetchGroup) return; //判断是否请求中
        // 判断课表中添加的老师是否与当前点击的相等，若相等，课表已存在不添加
        if (this.handleNotRepeat(id)) {
            message.info('课表已存在该学生');
            return;
        }
        const { dispatch, rowValue, currentVersion } = this.props;
        let studentGroupId = rowValue.studentGroup.id;
        this.setState(
            {
                isFetchGroup: true,
            },
            () => {
                dispatch({
                    type: 'lessonView/findCustomSchedule',
                    payload: {
                        id: currentVersion,
                        studentIds: [id],
                        type: 'student',
                        idType: 'studentIds',
                    },
                }).then(() => {
                    // 点击详情添加一行，存储添加行的id,方便自定义视角调换课后重新请求数据
                    _this.props.saveCustomValue(id, 'customStudent');
                    this.setState({
                        isFetchGroup: false,
                    });
                });
            }
        );
    };
    // 确认查询结果
    confirmCustom = () => {
        const {
            customSelectValue,
            selectTeacher,
            selectAddress,
            gradeValue,
            groupValue,
            selectStudentValue,
            addType,
        } = this.state;
        const { closePlus, type, showDelete } = this.props;
        typeof showDelete == 'function' && showDelete();
        typeof closePlus == 'function' && closePlus();
        if (customSelectValue === 0) {
            // 教师
            this.getTeachersCourse(selectTeacher);
        } else if (customSelectValue === 1) {
            // 场地
            this.getAddressCourse(selectAddress, addType);
        } else if (customSelectValue === 2) {
            // 年级 年级班级调用统一接口
            this.getGradeCourse(gradeValue);
        } else if (customSelectValue === 3) {
            // 班级
            this.getGroupCourse(groupValue);
        } else if (customSelectValue === 4) {
            this.getStudentCourse(selectStudentValue);
        }
        this.setState({
            customVisible: false,
            selectTeacher: undefined, // 自定义教师筛选value
            selectAddress: undefined, // 自定义场地筛选value
            gradeValue: undefined, // 自定义场景年级筛选value
            groupValue: undefined, // 自定义班级筛选value
            selectStudentValue: undefined, // 自定义学生筛选value
            customSelectValue: 0,
        });
    };

    // 关闭自定义筛选
    cancelCustom = () => {
        const { closePlus } = this.props;
        typeof closePlus == 'function' && closePlus();
        this.setState({
            customVisible: false,
            selectTeacher: undefined, // 自定义教师筛选value
            selectAddress: undefined, // 自定义场地筛选value
            gradeValue: undefined, // 自定义场景年级筛选value
            groupValue: undefined, // 自定义班级筛选value
            selectStudentValue: undefined, // 自定义学生筛选value
            customSelectValue: 0,
        });
    };
    render() {
        const { customSelectValue } = this.state;
        const { rowValue } = this.props;
        const popoverContent = (
            <div className={styles.searchContent}>
                <div className={styles.form}>
                    <Select
                        style={{ width: 70, border: 'none' }}
                        onChange={this.getCustomSelectValue}
                        defaultValue={0}
                        value={customSelectValue}
                    >
                        <Option value={0}>{trans('global.teacher', '教师')}</Option>
                        <Option value={3}>{trans('global.class', '班级')}</Option>
                        {/* <Option value={2}>{trans('global.grade', '年级')}</Option> */}
                        <Option value={1}>{trans('global.address', '场地')}</Option>
                        <Option value={4}>{trans('global.student', '学生')}</Option>
                    </Select>
                    <div className={styles.search}>
                        {customSelectValue === 0
                            ? this.teacherHtml()
                            : customSelectValue === 1
                            ? this.addressHtml()
                            : customSelectValue === 2
                            ? this.gradeHtml()
                            : customSelectValue === 3
                            ? this.groupHtml()
                            : customSelectValue === 4
                            ? this.studentHtml()
                            : null}
                    </div>
                </div>
                <span className={styles.confirm} onClick={this.confirmCustom}>
                    {trans('course.plan.okText', '确认')}
                </span>
                <span className={styles.cancel} onClick={this.cancelCustom}>
                    {trans('course.plan.cancelText', '取消')}
                </span>
            </div>
        );
        return popoverContent;
    }
}
