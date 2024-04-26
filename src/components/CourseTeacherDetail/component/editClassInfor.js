import React from 'react';
import { connect } from 'dva';
import {
    InputNumber,
    Modal,
    Select,
    Input,
    message,
    Form,
    TreeSelect,
    DatePicker,
    Icon,
} from 'antd';
import styles from './editClassInfor.less';
import NavTitle from './navTitle';
import moment from 'moment';
import { trans, locale } from '../../../utils/i18n';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

@Form.create()
@connect((state) => ({
    groupSelectDetail: state.courseBaseDetail.groupSelectDetail,
    teacherList: state.course.teacherList,
    chooseCourseDetails: state.choose.chooseCourseDetails,
}))
class EditClassInfor extends React.Component {
    state = {
        name: '',
        ename: '',
        classTime: [],
        classId: '',
        groupId: '',
        chooseCoursePlanId: '',
        coursePlanId: '',
        mainTeachers: [],
        groupSuitGradeList: [],
        assistTeachers: [],
        minSignUpCount: undefined,
        maxSignUpCount: undefined,
        minAge: undefined,
        maxAge: undefined,
        addressList: [],
        rainyDayLocation: '',
        classTimeModels: [],
        groupValue: '',
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.visibleEditClassInfor != this.props.visibleEditClassInfor) {
            let newMainTeacher = [];
            nextProps.mainTeachers &&
                nextProps.mainTeachers.length > 0 &&
                nextProps.mainTeachers.map((item, index) => {
                    newMainTeacher.push(item.userId);
                });
            let newGroupSuitGradeList = [];
            nextProps.groupSuitGradeList &&
                nextProps.groupSuitGradeList.length > 0 &&
                nextProps.groupSuitGradeList.map((item, index) => {
                    newGroupSuitGradeList.push(item.id);
                });
            let newAssTeacher = [];
            nextProps.assistTeachers &&
                nextProps.assistTeachers.length > 0 &&
                nextProps.assistTeachers.map((item, index) => {
                    newAssTeacher.push(item.userId);
                });
            let newAddress = [];
            nextProps.addressList &&
                nextProps.addressList.length > 0 &&
                nextProps.addressList.map((item, index) => {
                    newAddress.push(item.id);
                });

            if (nextProps.visibleEditClassInfor) {
                this.initClassPlan(
                    nextProps.classId,
                    nextProps.groupId,
                    nextProps.chooseCoursePlanId,
                    nextProps.coursePlanId,
                    nextProps.mainTeachers,
                    nextProps.groupSuitGradeList,
                    nextProps.assistTeachers,
                    nextProps.addressList,
                    nextProps.minSignUpCount,
                    nextProps.maxSignUpCount,
                    nextProps.minAge,
                    nextProps.maxAge,
                    nextProps.rainyDayLocation,
                    nextProps.classTimeModels,
                    nextProps.newCourseName,
                    nextProps.newCourseEname
                );

                console.log(nextProps, nextProps.groupGroupingNumJsonDTO, 'dto');
                this.setState({
                    name: nextProps.newCourseName,
                    ename: nextProps.newCourseEname,
                    classId: nextProps.classId,
                    groupId: nextProps.groupId,
                    chooseCoursePlanId: nextProps.chooseCoursePlanId,
                    coursePlanId: nextProps.coursePlanId,
                    mainTeachers: newMainTeacher,
                    groupSuitGradeList: newGroupSuitGradeList,
                    assistTeachers: newAssTeacher,
                    addressList: newAddress,
                    minSignUpCount: nextProps.minSignUpCount,
                    maxSignUpCount: nextProps.maxSignUpCount,
                    groupValue:
                        (nextProps.groupGroupingNumJsonDTO &&
                            nextProps.groupGroupingNumJsonDTO.groupingKey) ||
                        undefined,
                    minAge: nextProps.minAge,
                    maxAge: nextProps.maxAge,
                    rainyDayLocation: nextProps.rainyDayLocation,
                    classTimeModels: nextProps.classTimeModels,
                    startTime: moment(nextProps.startTime).format('YYYY-MM-DD'),
                    endTime: moment(nextProps.endTime).format('YYYY-MM-DD'),
                });
            }
        }
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
        });
    };

    onCancel = () => {
        const { hideModal, self } = this.props;
        typeof hideModal == 'function' && hideModal.call(self, 'visibleEditClassInfor');
    };

    changeRainSite = (e) => {
        this.setState({
            rainyDayLocation: e.target.value,
        });
    };

    delData = (index) => {
        let classTimeModels = JSON.parse(JSON.stringify(this.state.classTimeModels));
        classTimeModels.splice(index, 1);
        this.setState({
            classTimeModels,
        });
    };

    addData = () => {
        const { chooseCourseDetails } = this.props;
        let newClassTime = JSON.parse(JSON.stringify(this.state.classTimeModels));
        newClassTime.push({
            endTime: chooseCourseDetails.classTime[0].endTime,
            id: chooseCourseDetails.classTime[0].id,
            startTime: chooseCourseDetails.classTime[0].startTime,
            weekday: chooseCourseDetails.classDate[0],
        });
        console.log(newClassTime,'newClassTime')
        this.setState({
            classTimeModels: newClassTime,
        });
    };

    editCourseOk = () => {
        const { dispatch, self, callback, groupingList, chooseCourseDetails } = this.props;
        const {
            classId,
            groupId,
            name,
            ename,
            maxSignUpCount,
            minSignUpCount,
            minAge,
            maxAge,
            addressList,
            chooseCoursePlanId,
            coursePlanId,
            rainyDayLocation,
            mainTeachers,
            groupSuitGradeList,
            assistTeachers,
            classTimeModels,
            startTime,
            endTime,
            groupValue,
        } = this.state;

        if (!minSignUpCount) {
            message.warn('请填写最小人数');
            return;
        }
        if (!maxSignUpCount) {
            message.warn('请填写最大人数');
            return;
        }
        if (maxSignUpCount < minSignUpCount) {
            message.warn(trans('tc.base.maximum.of.minimum', '容量范围最大值应大于最小值'));
            return;
        }
        if (chooseCourseDetails.classDate.length > 0 && classTimeModels.length == 0) {
            message.warn('请至少设置一项上课时间');
            return;
        }
        if (groupSuitGradeList.length === 0) {
            message.warning('请选择适用年级');
            return;
        }
        if (mainTeachers.length === 0) {
            message.warning('请选择主教教师');
            return;
        }
        if (maxAge && minAge && maxAge < minAge) {
            message.warn(trans('tc.base.maximum.of.minimum', '容量范围最大值应大于最小值'));
            return;
        }

        let tempGroupObj = {};
        groupingList && groupingList.length > 0
            ? (tempGroupObj = groupingList.find((item) => item.groupingKey == groupValue))
            : {};

        dispatch({
            type: 'courseBaseDetail/groupUpdate',
            payload: {
                id: classId,
                className: name,
                classEnglishName: ename,
                minStudentNum: minSignUpCount,
                maxStudentNum: maxSignUpCount,
                minAge,
                maxAge,
                rainyDayLocation: rainyDayLocation,
                addressIdList: addressList,
                chooseCoursePlanId,
                coursePlanningId: coursePlanId,
                classTimeInputModels:
                    chooseCourseDetails?.classDate && chooseCourseDetails.classDate.length > 0
                        ? classTimeModels
                        : [],
                masterTeacherIds: mainTeachers,
                groupSuitGradeIdList: groupSuitGradeList,
                assistTeacherIds: assistTeachers,
                groupId: groupId,
                startTime,
                endTime,
                groupGroupingNumJsonDTO: tempGroupObj,
            },
            onSuccess: () => {
                typeof callback === 'function' && callback.call(self, this.state);
                this.onCancel();
                this.props.getTableList();
            },
        }).then(() => {
            /* typeof callback === 'function' && callback.call(self, this.state);
            this.onCancel();
            this.props.getTableList(); */
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

    //格式化教师列表
    formatTeacherList = (teacherList) => {
        if (!teacherList || teacherList.length < 0) return [];
        let teacherResult = [];
        teacherList.map((item, index) => {
            let obj = {
                // title: item.englishName ? `${item.name}(${item.englishName})` : `${item.name}`,
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

    //选择主教老师
    changeMainTeacher = (value) => {
        this.setState({
            mainTeachers: value,
        });
    };

    //选择协同老师
    changeAssistantTeacher = (value) => {
        this.setState({
            assistTeachers: value,
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
        let classTimeModels = JSON.parse(JSON.stringify(this.state.classTimeModels));
        classTimeModels[index].weekday = value;
        this.setState({ classTimeModels });
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
        let newClassTime = this.state.classTimeModels;
        newClassTime[index].id = obj.id;
        newClassTime[index].startTime = obj.startTime;
        newClassTime[index].endTime = obj.endTime;
        this.setState({
            classTimeModels: newClassTime,
        });
    };

    handlePicker = (date, dateString) => {
        this.setState({
            startTime: dateString[0],
            endTime: dateString[1],
        });
    };

    changeGroup = (value) => {
        this.setState({
            groupValue: value,
        });
    };

    render() {
        const {
            visibleEditClassInfor,
            areaList,
            form: { getFieldDecorator },
            teacherList,
            chooseCourseDetails,
            courseSuitGradeList,
            groupingList,
        } = this.props;

        let syncSchedule = chooseCourseDetails?.syncSchedule;

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
        const {
            addressList,
            name,
            ename,
            minSignUpCount,
            maxSignUpCount,
            minAge,
            maxAge,
            rainyDayLocation,
            classTimeModels,
            classTime,
            mainTeachers,
            groupSuitGradeList,
            assistTeachers,
            startTime,
            endTime,
        } = this.state;
        const treeProps = {
            treeCheckable: true,
            treeNodeFilterProp: 'title',
        };
        const mainTeacherListProps = {
            treeData: this.formatTeacherList(teacherList),
            value: mainTeachers,
            placeholder: trans('course.basedetail.add.searchTeacher', '搜索选择教师'),
            onChange: this.changeMainTeacher,
            dropdownStyle: {
                overflow: 'auto',
                maxHeight: '400px',
            },
            ...treeProps,
        };

        const assistTeacherListProps = {
            value: assistTeachers,
            treeData: this.formatTeacherList(teacherList),
            placeholder: trans('course.basedetail.add.searchTeacher', '搜索选择教师'),
            onChange: this.changeAssistantTeacher,
            dropdownStyle: {
                overflow: 'auto',
                maxHeight: '400px',
            },
            ...treeProps,
        };
        return (
            <Modal
                title={
                    <NavTitle
                        title={trans('global.editCourseInformation', '编辑班级信息')}
                        onCancel={this.onCancel.bind(this)}
                    />
                }
                className={styles.setCourseInfo}
                visible={visibleEditClassInfor}
                onOk={this.editCourseOk}
                onCancel={this.onCancel}
                maskClosable={false}
                closable={false}
                okText={trans('global.save', '保存')}
                cancelText={trans('global.cancel', '取消')}
            >
                <div className={styles.editCourseInfor}>
                    <div className={styles.item}>
                        <span className={styles.title}>
                            {trans('course.basedetail.add.ChineseName', '班级中文名')}
                            <i style={{ color: 'red' }}>*</i>
                        </span>
                        <Input
                            value={name}
                            placeholder={trans('global.placeholder', '请输入')}
                            className={styles.num}
                            style={{ width: '400px' }}
                            onChange={this.handleChange.bind(this, 'name', true)}
                        />
                    </div>
                    <div className={styles.item}>
                        <span className={styles.title}>
                            {trans('course.basedetail.add.EnglishName', '班级英文名')}
                            <i style={{ color: 'red' }}>*</i>
                        </span>
                        <Input
                            placeholder={trans('global.placeholder', '请输入')}
                            value={ename}
                            className={styles.num}
                            style={{ width: '400px' }}
                            onChange={this.handleChange.bind(this, 'ename', true)}
                        />
                    </div>
                    <div className={styles.item}>
                        <span className={styles.title}>
                            {trans('course.plan.classNumber', '班级人数')}
                            <i style={{ color: 'red' }}>*</i>
                        </span>
                        <InputNumber
                            className={styles.num}
                            min={0}
                            placeholder={trans('global.placeholder', '请输入')}
                            value={minSignUpCount}
                            step={1}
                            style={{ width: 70 }}
                            onChange={this.handleChange.bind(this, 'minSignUpCount', false)}
                        />
                        <span className={styles.line}>-</span>
                        <InputNumber
                            className={styles.num}
                            min={0}
                            placeholder={trans('global.placeholder', '请输入')}
                            value={maxSignUpCount}
                            step={1}
                            style={{ width: 70 }}
                            onChange={this.handleChange.bind(this, 'maxSignUpCount', false)}
                        />
                        <span className={styles.text}>{trans('global.people', '人')}</span>
                    </div>

                    <div className={styles.item}>
                        <span className={styles.title}>
                            {trans('course.step1.selection.period', '开课周期')}
                            <i style={{ color: 'red' }}>*</i>
                        </span>
                        <RangePicker
                            value={[moment(startTime, dateFormat), moment(endTime, dateFormat)]}
                            className={`${styles.changePicker} ${styles.changePickerStep1}`}
                            onChange={this.handlePicker}
                            format="YYYY-MM-DD"
                            disabled={syncSchedule}
                        />
                    </div>

                    {chooseCourseDetails?.classDate && chooseCourseDetails.classDate.length > 0 ? (
                        <div
                            className={styles.item}
                            style={{ display: 'flex', minHeight: '36px', lineHeight: '36px' }}
                        >
                            <span className={styles.title}>
                                {trans('course.plan.classTime', '上课时间')}
                                <i style={{ color: 'red' }}>*</i>
                            </span>
                            <div>
                                {classTimeModels &&
                                    classTimeModels.map((item, index) => {
                                        return (
                                            <p style={{ marginBottom: '-0' }}>
                                                <Select
                                                    style={{}}
                                                    value={item.weekday}
                                                    onChange={(value) =>
                                                        this.changeWeekDay(index, value)
                                                    }
                                                    disabled={syncSchedule}
                                                >
                                                    {weekDayList &&
                                                        weekDayList.map((el, ind) => {
                                                            return (
                                                                <Select.Option value={el}>
                                                                    {'周' + this.noToChinese(el)}
                                                                </Select.Option>
                                                            );
                                                        })}
                                                </Select>
                                                <Select
                                                    style={{ width: '140px', marginLeft: '20px' }}
                                                    value={item.id}
                                                    onChange={(value) =>
                                                        this.changeClassData(index, value)
                                                    }
                                                    disabled={syncSchedule}
                                                >
                                                    {peroidList &&
                                                        peroidList.map((el, ind) => {
                                                            return (
                                                                <Select.Option value={el.id}>
                                                                    {el.startTime} - {el.endTime}
                                                                </Select.Option>
                                                            );
                                                        })}
                                                </Select>
                                                <Icon
                                                    style={{ marginLeft: '10px' }}
                                                    type="delete"
                                                    onClick={
                                                        syncSchedule
                                                            ? ''
                                                            : () => this.delData(index)
                                                    }
                                                />
                                            </p>
                                        );
                                    })}
                                <span
                                    style={{ color: 'blue', cursor: 'pointer' }}
                                    onClick={syncSchedule ? '' : () => this.addData(syncSchedule)}
                                >
                                    <Icon type="plus-circle" />
                                    <span style={{ marginLeft: '8px' }}>
                                        {trans('course.plan.addPeriod', '添加时段')}
                                    </span>
                                </span>
                            </div>
                        </div>
                    ) : null}

                    {groupingList && groupingList.length > 0 ? (
                        <div className={styles.item} style={{ display: 'flex' }}>
                            <span
                                className={styles.title}
                                style={{
                                    alignSelf: 'center',
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
                                style={{ width: '400px' }}
                            >
                                {groupingList.map((item, index) => (
                                    <Select.Option value={item.groupingKey} key={item.groupingKey}>
                                        {item.groupingName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </div>
                    ) : null}

                    <div className={styles.item} style={{ display: 'flex' }}>
                        <span
                            className={styles.title}
                            style={{
                                alignSelf: 'center',
                            }}
                        >
                            {trans('student.applyGrade', '适用年级')}
                            <i style={{ color: 'red' }}>*</i>
                        </span>
                        <Select
                            placeholder={trans('student.pleaseApplyGrade', '请选择适用年级')}
                            className={styles.selectGrade}
                            onChange={this.handleChange.bind(this, 'groupSuitGradeList', false)}
                            value={groupSuitGradeList}
                            optionFilterProp="children"
                            style={{ width: '400px' }}
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
                        style={{ marginBottom: '15px', marginTop: '14px' }}
                    >
                        <span className={styles.title}>
                            {trans('course.plan.suitableAge', '适用年龄')}
                        </span>
                        <InputNumber
                            className={styles.num}
                            min={0}
                            placeholder={trans('global.placeholder', '请输入')}
                            value={minAge}
                            step={1}
                            style={{ width: 70 }}
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
                                    width: '135px',
                                    textAlign: 'right',
                                    marginRight: '14px',
                                    position: 'relative',
                                    top: -'5px',
                                }}
                            >
                                {trans('course.basedetail.add.minTeacher', '主教教师')}
                                <i style={{ color: 'red' }}>*</i>
                            </span>
                            <Form.Item className={styles.mainTeacher}>
                                {getFieldDecorator('mainTeachers', {
                                    rules: [{ required: true, message: ' ' }],
                                    initialValue: mainTeachers || [],
                                })(<TreeSelect {...mainTeacherListProps}></TreeSelect>)}
                            </Form.Item>
                        </div>
                        <div className={styles.minTeacherForm}>
                            <span
                                className={styles.assistLabel}
                                style={{
                                    width: '135px',
                                    textAlign: 'right',
                                    marginRight: '15px',
                                    position: 'relative',
                                    top: '-5px',
                                }}
                            >
                                {trans('course.basedetail.teachingAssistant', '助教教师')}
                            </span>
                            <Form.Item
                                // label = '协同教师'
                                className={styles.assistTeacher}
                            >
                                {getFieldDecorator(
                                    'assistTeachers',

                                    { initialValue: assistTeachers || [] }
                                )(<TreeSelect {...assistTeacherListProps}></TreeSelect>)}
                            </Form.Item>
                        </div>
                    </Form>
                    <div className={styles.item}>
                        <span
                            style={{
                                marginRight: '15px',
                                position: 'relative',
                                top: '-12px',
                            }}
                            className={styles.title}
                        >
                            {trans('course.plan.place', '地点')}
                        </span>
                        <Select
                            placeholder={trans('tc.base.search.select.site', '搜索选择地点')}
                            mode="multiple"
                            className={styles.select}
                            onChange={this.handleChange.bind(this, 'addressList', false)}
                            value={addressList}
                            optionFilterProp="children"
                            style={{ width: '400px' }}
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
                    <div className={styles.item}>
                        <span
                            style={{
                                marginRight: '15px',
                                position: 'relative',
                            }}
                            className={styles.title}
                        >
                            {trans('course.plan.rainyLocation', '雨天地点')}
                        </span>
                        <Input
                            placeholder={trans('global.rainyLocation', '填写雨天地点')}
                            style={{ width: '400px' }}
                            onChange={this.changeRainSite}
                            value={rainyDayLocation}
                        ></Input>
                    </div>
                </div>
            </Modal>
        );
    }
}

module.exports = EditClassInfor;
