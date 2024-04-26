//新建作息活动
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
    Modal,
    Select,
    Input,
    Form,
    TimePicker,
    Checkbox,
    message,
    Radio,
    Switch,
    Button,
} from 'antd';
import moment from 'moment';
import styles from './createCourse.less';
import icon from '../../../icon.less';
import { trans, locale } from '../../../utils/i18n';
const { Option } = Select;
const format = 'HH:mm';
const CheckboxGroup = Checkbox.Group;
class CreateCourse extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            workType: '', //活动类型
            workname: '', // 活动名字
            englishName: '', // 英文名字
            weekTime: '', // 应用范围
            typeChangeNumber: 0, // 时段
            startChangeTime: '', // 编辑开始时间
            endChangeTime: '', // 编辑结束时间
            startCreateTime: undefined, // 新建作息开始时间
            endCreateTime: undefined, // 新建作息结束时间
            workText: '', // 活动名称
            whatDay: ['1', '2', '3', '4', '5'], // 日期
            checkValue: '', // 是否横跨该时段
            startNow: '', // 新建作息改变的开始时间(用来计算差值)
            endNow: '', //新建作息改变的结束时间(用来计算差值)
            editStartNow: '', // 编辑作息改变的开始时间(用来计算差值)
            editEndNow: '', // 编辑作息改变的结束时间(用来计算差值)
            timeValue: localStorage.getItem('timeValue') || '45', // 起止时间value值
            isDsiturb: false,
            classTime: undefined,
            notClassTime: undefined,
        };
    }
    // 开启新建作息活动
    componentWillReceiveProps(nextProps) {
        if (nextProps.courseVisible != this.props.courseVisible) {
            this.setState({
                visible: nextProps.courseVisible,
                typeChangeNumber: '',
                editStartNow: '',
                editEndNow: '',
                startCreateTime: '',
                endCreateTime: '',
                name: '',
                ename: '',
                whatDay: ['1', '2', '3', '4', '5'],
            });
            if (
                nextProps.courseVisible &&
                nextProps.createModalType == 'edit' &&
                nextProps.calendrDetail.startTime &&
                nextProps.calendrDetail.endTime
            ) {
                console.log('nextProps.calendrDetail', nextProps.calendrDetail);
                this.setState(
                    {
                        startCreateTime: nextProps.calendrDetail.startTime,
                        endCreateTime: nextProps.calendrDetail.endTime,
                        
                    },
                    () => {
                        this.handleTimeValue();
                    }
                );
            }
        }
    }

    componentDidMount() {
        const { calendrDetail, createModalType } = this.props;
        if (createModalType == 'edit') {
            console.log('calendrDetail', calendrDetail);
            this.props.form.setFieldsValue({
                week:
                    createModalType == 'edit'
                        ? calendrDetail &&
                          calendrDetail.weekDay &&
                          Object.prototype.toString.call(calendrDetail.weekDay) === '[object Array]'
                            ? calendrDetail.weekDay
                            : [`${calendrDetail.weekDay}`]
                        : ['1', '2', '3', '4', '5'],
            });
            this.setState(
                {
                    startCreateTime: calendrDetail.startTime,
                    endCreateTime: calendrDetail.endTime,
                    typeChangeNumber: calendrDetail.scheduleType,
                    whatDay:
                        Object.prototype.toString.call(calendrDetail.weekDay) === '[object Array]'
                            ? calendrDetail.weekDay
                            : [`${calendrDetail.weekDay}`],
                    isDsiturb: calendrDetail.ifBreak
                },
                () => {
                    this.handleTimeValue();
                }
            );
        }
    }

    // 活动名字
    workNameChange = (e) => {
        this.setState({
            workText: e.target.value,
        });
    };

    // 英文名字
    getenglishName = (e) => {
        this.setState({
            englishName: e.target.value,
        });
    };
    // 禁止结束小时
    donOpenEndEHoures = () => {
        let hours = [];
        for (var i = 23; i < 24; i++) {
            hours.push(i);
        }
        return hours;
    };

    // 禁止开始小时
    donOpenStartHoures = () => {
        let hours = [];
        for (let i = 0; i < 6; i++) {
            hours.push(i);
        }
        return hours;
    };

    // 禁止结束分钟
    donOpenMinuts = (selectedHour) => {
        var minutes = [];
        if (selectedHour === 22) {
            for (var i = 59; i > 0; i--) {
                minutes.push(i);
            }
        }
        return minutes;
    };

    // 关闭新建作息活动
    hideModal = () => {
        const { offhandleClick } = this.props;
        typeof offhandleClick == 'function' && offhandleClick();
        this.props.form.resetFields();
        this.setState({
            typeChangeNumber: '',
            editStartNow: '',
            editEndNow: '',
            whatDay: ['1', '2', '3', '4', '5'],
            startChangeTime: '',
            endChangeTime: '',
            checkValue: '',
            isDsiturb: false,
        });
    };

    // 删除当前作息
    deteleBtn = () => {
        const { dispatch, offhandleClick, nameid, getCalendarSource } = this.props;
        dispatch({
            type: 'time/deleteCalendar',
            payload: {
                baseScheduleDetailId: nameid,
            },
        }).then(() => {
            typeof getCalendarSource == 'function' && getCalendarSource();
            typeof offhandleClick == 'function' && offhandleClick();
            this.props.form.resetFields();
        });
    };

    deleteCalendar = () => {
        let self = this;
        Modal.confirm({
            title:
                locale() != 'en'
                    ? '您确定要删除该作息活动吗？'
                    : 'Are you sure to delete this period?',
            content: '',
            okText: trans('global.confirm', '确认删除'),
            cancelText: trans('global.cancel', '取消'),
            onOk() {
                self.deteleBtn();
            },
            onCancel() {
                console.log('cancel');
            },
        });
    };
    // 时段类型
    workTypeChange = (value) => {
        this.setState({
            typeChangeNumber: value.target.value,
        });
    };

    // 日期选择
    checkChange = (checkedValue) => {
        this.setState({
            whatDay: checkedValue,
        });
    };

    // 是否横跨该时段
    checkChangeValue = (e) => {
        this.setState({
            checkValue: e.target.value,
        });
    };

    // 完成
    handleSubmit = (e) => {
        const {
            dispatch,
            offhandleClick,
            calendrDetail,
            createModalType,
            dateValue,
            getCalendarSource,
            nameid,
            collection,
            haveVersionUse,
        } = this.props;
        const {
            typeChangeNumber,
            timeValue,
            startCreateTime,
            endCreateTime,
            whatDay,
            isDsiturb,
        } = this.state;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (typeChangeNumber === 0 && values.endtime < values.starttime) {
                    message.error('结束时间要大于开始时间');
                    return false;
                } else {
                    if (typeChangeNumber === 0 && startCreateTime == endCreateTime) {
                        message.info('上课时段起止时间不能相同');
                        return false;
                    }
                    if (createModalType == 'edit') {
                        dispatch({
                            type: 'time/modifScheduleWork',
                            payload: {
                                id: nameid,
                                name: values.workname,
                                ename: values.englishname,
                                scheduleType: JSON.stringify(typeChangeNumber)
                                    ? typeChangeNumber
                                    : calendrDetail.scheduleType,
                                // weekDayList: values.week.map(Number),
                                weekDayList: haveVersionUse ? values.week : whatDay,
                                startTime: startCreateTime
                                    ? startCreateTime
                                    : calendrDetail.startTime,
                                endTime: endCreateTime ? endCreateTime : calendrDetail.endTime,
                                ifBreak: isDsiturb,
                                timeAttribution:
                                    typeChangeNumber == 0
                                        ? values.timeAttribution1
                                        : values.timeAttribution2,
                            },
                        }).then(() => {
                            let { modifScheduleWork } = this.props;
                            if (modifScheduleWork.status) {
                                this.setState({
                                    startTime: null,
                                    endTime: null,
                                    name: '',
                                    ename: '',
                                    typeChangeNumber: '',
                                });
                                this.props.form.resetFields();
                                typeof offhandleClick == 'function' && offhandleClick();
                                typeof getCalendarSource == 'function' && getCalendarSource();
                                localStorage.setItem('timeValue', timeValue);
                            }
                        });
                    }

                    if (createModalType == 'create') {
                        dispatch({
                            type: 'time/addScheduleText',
                            payload: {
                                baseScheduleId: dateValue,
                                name: values.workname,
                                ename: values.englishname,
                                scheduleType: typeChangeNumber,
                                weekDayList: whatDay
                                    ? whatDay.map(Number)
                                    : ['1', '2', '3', '4', '5'],
                                startTime: startCreateTime ? startCreateTime : '08:00',
                                endTime: endCreateTime ? endCreateTime : '10:00',
                                ifBreak: isDsiturb, // 是否允许横跨时段  true为允许， false为不允许
                                timeAttribution:
                                    typeChangeNumber == 0
                                        ? values.timeAttribution1
                                        : values.timeAttribution2,
                            },
                        }).then(() => {
                            this.setState({
                                name: '',
                                ename: '',
                                type: '',
                                checkValue: '',
                                typeChangeNumber: '',
                            });
                            this.props.form.resetFields();
                            typeof offhandleClick == 'function' && offhandleClick();
                            typeof getCalendarSource == 'function' && getCalendarSource();
                            localStorage.setItem('timeValue', timeValue);
                        });
                    }
                }
            }
        });
    };

    handleTime = () => {
        const { timeValue, startCreateTime } = this.state;
        let createStart = startCreateTime.split(':').map(Number);
        let allSec = createStart[0] * 3600 + createStart[1] * 60 + parseFloat(timeValue || 0) * 60;
        let h = Math.floor(allSec / 3600);
        let m = Math.floor((allSec % 3600) / 60);
        let hours = h < 10 ? '0' + h : h;
        let min = m < 10 ? '0' + m : m;
        let newEndTime = hours + ':' + min;
        this.setState(
            {
                endCreateTime: newEndTime,
            },
            () => {
                this.props.form.setFieldsValue({
                    endtime: moment(this.state.endCreateTime, format),
                });
            }
        );
    };

    handleTimeValue = () => {
        const { endCreateTime, startCreateTime } = this.state;
        let createEnd = (endCreateTime && endCreateTime.split(':').map(Number)) || [];
        let createStart = (startCreateTime && startCreateTime.split(':').map(Number)) || [];
        let allMin = (createEnd[0] - createStart[0]) * 60 + (createEnd[1] - createStart[1]); // 计算共多少分钟
        this.setState(
            {
                timeValue: allMin || 0,
            },
            () => {
                localStorage.setItem('timeValue', this.state.timeValue);
            }
        );
    };

    // 判断起止时间大小
    judgeTime = (start, end) => {
        let endTimeArr = end.split(':');
        let startTimeArr = start.split(':');
        let endStr = endTimeArr[0] + endTimeArr[1];
        let startStr = startTimeArr[0] + startTimeArr[1];
        if (startStr > endStr) {
            return true;
        }
    };

    // 获取开始的时间
    starttimechange = (time, timestring) => {
        const { createModalType } = this.props;
        const { endCreateTime } = this.state;
        this.setState(
            {
                startCreateTime: timestring,
                startNow: time,
            },
            () => {
                if (timestring) {
                    this.handleTime();
                }
            }
        );
    };

    // 获取结束的时间
    endtimechange = (time, timestring) => {
        const { createModalType } = this.props;
        const { startCreateTime } = this.state;
        this.setState(
            {
                endCreateTime: timestring,
                endNow: time,
            },
            () => {
                if (this.state.startCreateTime) {
                    this.handleTimeValue();
                }
            }
        );
    };

    timeValueChange = (e) => {
        let value = e.target.value;
        this.setState(
            {
                timeValue: value,
            },
            () => {
                this.handleTime();
            }
        );
    };

    changeDisturb = (checked) => {
        this.setState({
            isDsiturb: checked,
        });
    };

    changeTimeAttr = (e) => {
        const { typeChangeNumber } = this.state;
        if (typeChangeNumber == 0) {
            this.setState({
                classTime: e.target.value,
            });
        } else if (typeChangeNumber == 1) {
            this.setState({
                notClassTime: e.target.value,
            });
        }
    };

    selectAllOrNot = () => {
        let tempWeekDay = JSON.parse(JSON.stringify(this.state.whatDay));
        let tempArr = [];
        if (tempWeekDay && tempWeekDay.length && tempWeekDay.length == 7) {
            tempArr = [];
        } else {
            tempArr = ['1', '2', '3', '4', '5', '6', '7'];
        }
        this.props.form.setFieldsValue({
            week: tempArr,
        });
        this.setState({
            whatDay: tempArr,
        });
    };

    render() {
        const {
            creatcoursething,
            createModalType,
            calendrDetail,
            collection,
            isCheckShow,
            form: { getFieldDecorator },
            courseVisible,
            haveVersionUse,
        } = this.props;
        const {
            visible,
            typeChangeNumber,
            endCreateTime,
            startCreateTime,
            startChangeTime,
            endChangeTime,
            timeValue,
            isDsiturb,
            classTime,
            notClassTime,
            whatDay,
        } = this.state;
        console.log('whatDay', whatDay);

        const optionsWithDisabled =
            locale() === 'en'
                ? [
                      { label: 'Mon', value: '1' },
                      { label: 'Tue', value: '2' },
                      { label: 'Wen', value: '3' },
                      { label: 'Thu', value: '4' },
                      { label: 'Fri', value: '5' },
                      { label: 'Sat', value: '6' },
                      { label: 'Sun', value: '7' },
                  ]
                : [
                      { label: '周一', value: '1' },
                      { label: '周二', value: '2' },
                      { label: '周三', value: '3' },
                      { label: '周四', value: '4' },
                      { label: '周五', value: '5' },
                      { label: '周六', value: '6' },
                      { label: '周天', value: '7' },
                  ];
        const optionValueType = [
            { value: '0', text: '作息' },
            { value: '1', text: '上课时段' },
            { value: '2', text: '公共活动' },
        ];

        // 编辑时钟计算
        var newData = this.props.calendrDetail || {};
        if (newData && newData.endTime && newData.startTime) {
            var oldTime = newData.endTime.split(':');
            var newTime = newData.startTime.split(':');
            var nowTime = (oldTime[0] - newTime[0]) * 60 + (oldTime[1] - newTime[1]);
        }
        if (startChangeTime && newData && newData.endTime) {
            var oneTime = newData.endTime.split(':');
            var twoTime = startChangeTime.split(':');
            var threeTime = (oneTime[0] - twoTime[0]) * 60 + (oneTime[1] - twoTime[1]);
        }
        if (newData && newData.startTime && endChangeTime) {
            var fourime = endChangeTime.split(':');
            var fiveTime = newData.startTime.split(':');
            var sixTime = (fourime[0] - fiveTime[0]) * 60 + (fourime[1] - fiveTime[1]);
        }
        if (startChangeTime && endChangeTime) {
            var sevenime = endChangeTime.split(':');
            var eightTime = startChangeTime.split(':');
            var nineTime = (sevenime[0] - eightTime[0]) * 60 + (sevenime[1] - eightTime[1]);
        }

        // 新建时钟计算
        if (startCreateTime && endCreateTime) {
            var createStart = endCreateTime.split(':');
            var createEnd = startCreateTime.split(':');
            var createNow = (createStart[0] - createEnd[0]) * 60 + (createStart[1] - createEnd[1]);
        }
        const endTime = '10:00';
        if (startCreateTime && endTime) {
            var createFirstStart = endTime.split(':');
            var createFirstEnd = startCreateTime.split(':');
            var createFirstNow =
                (createFirstStart[0] - createFirstEnd[0]) * 60 +
                (createFirstStart[1] - createFirstEnd[1]);
        }
        const firstTime = '8:00';
        if (firstTime && endCreateTime) {
            var createSecondStart = endCreateTime.split(':');
            var createSecondEnd = firstTime.split(':');
            var createSecond =
                (createSecondStart[0] - createSecondEnd[0]) * 60 +
                (createSecondStart[1] - createSecondEnd[1]);
        }
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 8,
                    offset: 16,
                },
            },
        };

        return (
            <Modal
                visible={courseVisible}
                title={
                    createModalType == 'create'
                        ? trans('global.createSchedule', 'Add')
                        : trans('global.editSchedule', 'Edit')
                }
                footer={null}
                keyboard={true}
                width={640}
                onCancel={this.hideModal}
                className={styles.createVisible}
                wrapClassName={styles.scheduleModal}
            >
                <Form layout="inline" onSubmit={this.handleSubmit}>
                    <Form.Item label={trans('global.typeTimeTable', '作息类型')}>
                        {getFieldDecorator('edittype', {
                            rules: [{ required: true, message: '请选择时段' }],
                            initialValue:
                                createModalType == 'create'
                                    ? typeChangeNumber
                                    : calendrDetail.scheduleType,
                        })(
                            <Radio.Group
                                onChange={this.workTypeChange}
                                // defaultValue={calendrDetail.type == 1 ? 0 : 1}
                                value={typeChangeNumber}
                                disabled={
                                    createModalType == 'edit' && haveVersionUse ? true : false
                                }
                            >
                                <Radio value={0}>{trans('global.classHours', '上课时段')}</Radio>
                                <Radio value={1}>
                                    {trans('global.nonClassHours', '非上课时段')}
                                </Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>
                    <div style={{ display: 'flex' }}>
                        <div style={{ flex: 1 }}>
                            <Form.Item label={trans('global.timeTimetable', '起止时间')}>
                                {getFieldDecorator('starttime', {
                                    rules: [{ required: true, message: '请选择开始时间' }],
                                    initialValue:
                                        createModalType == 'edit'
                                            ? moment(calendrDetail.startTime, format)
                                            : undefined,
                                })(
                                    <TimePicker
                                        disabled={
                                            createModalType == 'edit' && typeChangeNumber === 0
                                                ? haveVersionUse
                                                : false
                                        }
                                        format={format}
                                        minuteStep={5}
                                        onChange={this.starttimechange}
                                        disabledHours={this.donOpenStartHoures}
                                    />
                                )}
                            </Form.Item>
                        </div>
                        <div style={{ flex: 0.1, marginLeft: '10px', lineHeight: '50px' }}>-</div>
                        <div style={{ flex: 1 }}>
                            <Form.Item>
                                {getFieldDecorator('endtime', {
                                    rules: [{ required: true, message: '请选择结束时间' }],
                                    initialValue:
                                        createModalType == 'edit'
                                            ? moment(calendrDetail.endTime, format)
                                            : undefined,
                                })(
                                    <TimePicker
                                        disabled={
                                            createModalType == 'edit' && typeChangeNumber === 0
                                                ? haveVersionUse
                                                : false
                                        }
                                        format={format}
                                        minuteStep={5}
                                        onChange={this.endtimechange}
                                        disabledHours={this.donOpenEndEHoures}
                                        disabledMinutes={this.donOpenMinuts}
                                    />
                                )}
                            </Form.Item>
                        </div>
                        <div style={{ flex: 2, lineHeight: '50px' }}>
                            {trans('global.courseGong', '共')}{' '}
                            {
                                <Input
                                    value={timeValue}
                                    style={{ width: '60px' }}
                                    onChange={this.timeValueChange}
                                    disabled={
                                        createModalType == 'edit' && typeChangeNumber === 0
                                            ? haveVersionUse
                                            : false
                                    }
                                />
                            }{' '}
                            {trans('global.minutesTimetable', '分钟')}
                        </div>
                    </div>
                    {typeChangeNumber === 0 ? (
                        <Form.Item label={trans('global.period belong to', '时段归属')}>
                            {getFieldDecorator('timeAttribution1', {
                                rules: [{ required: true, message: '请选择时段' }],
                                initialValue:
                                    createModalType == 'edit'
                                        ? calendrDetail.timeAttribution
                                        : classTime,
                            })(
                                <Radio.Group value={classTime} onChange={this.changeTimeAttr}>
                                    <Radio value={1}>{trans('global.morning', '上午')}</Radio>
                                    <Radio value={2}>{trans('global.Afternoon', '下午')}</Radio>
                                    <Radio value={3}>{trans('global.Evening', '晚上')}</Radio>
                                </Radio.Group>
                            )}
                        </Form.Item>
                    ) : typeChangeNumber === 1 ? (
                        <Form.Item label={trans('global.period belong to', '时段归属')}>
                            {getFieldDecorator('timeAttribution2', {
                                rules: [{ required: true, message: '请选择时段' }],
                                initialValue:
                                    createModalType == 'edit'
                                        ? calendrDetail.timeAttribution
                                        : notClassTime,
                            })(
                                <Radio.Group
                                    value={notClassTime}
                                    onChange={this.changeTimeAttr}
                                    disabled={createModalType == 'edit' ? haveVersionUse : false}
                                >
                                    <Radio value={1}>{trans('global.morning', '上午')}</Radio>
                                    <Radio value={2}>{trans('global.Afternoon', '下午')}</Radio>
                                    <Radio value={3}>{trans('global.Evening', '晚上')}</Radio>
                                </Radio.Group>
                            )}
                        </Form.Item>
                    ) : null}

                    <div className={styles.nameWork}>
                        <div className={styles.nameDiv}>
                            <Form.Item label={trans('global.titleTileTable', '名称')}>
                                {getFieldDecorator('workname', {
                                    rules: [
                                        {
                                            required: typeChangeNumber === 1 ? true : false,
                                            message: '请输入活动名称',
                                        },
                                    ],
                                    initialValue:
                                        createModalType == 'edit' ? calendrDetail.name : '',
                                })(
                                    <Input
                                        style={{ width: 150 }}
                                        placeholder={trans('student.pleaseInput', '请输入')}
                                        onChange={this.workNameChange}
                                    />
                                )}
                            </Form.Item>
                        </div>
                        <div className={styles.nameDiv}>
                            <Form.Item label={trans('global.englishTitleTable', '英文名称')}>
                                {getFieldDecorator('englishname', {
                                    rules: [
                                        {
                                            required: typeChangeNumber === 1 ? true : false,
                                            message: '请输入英文名称',
                                        },
                                    ],
                                    initialValue:
                                        createModalType == 'edit' ? calendrDetail.eName : '',
                                })(
                                    <Input
                                        style={{ width: 150 }}
                                        placeholder={trans('student.pleaseInput', '请输入')}
                                        onChange={this.getenglishName}
                                    />
                                )}
                            </Form.Item>
                        </div>
                    </div>

                    <Form.Item label={trans('global.applyTo', '应用范围')}>
                        {getFieldDecorator('week', {
                            rules: [{ required: true, message: '请输入日期' }],
                            /* initialValue:
                                createModalType == 'edit'
                                    ? creatcoursething && creatcoursething.weekDay
                                        ? [`${creatcoursething.weekDay}`]
                                        : []
                                    : ['1', '2', '3', '4', '5'], */
                        })(
                            // createModalType == 'edit' ? (
                            //     <CheckboxGroup options={optionsWithDisabled} disabled />
                            // ) : (
                            <CheckboxGroup
                                options={optionsWithDisabled}
                                onChange={this.checkChange}
                                value={whatDay}
                                disabled={createModalType == 'edit' && haveVersionUse}
                            />
                            // )
                        )}
                        <span
                            style={{
                                color: '#4d7fff',
                                cursor: 'pointer',
                                display: haveVersionUse ? 'none' : 'inline',
                            }}
                            onClick={this.selectAllOrNot}
                            // disabled={createModalType == 'edit' && haveVersionUse}
                        >
                            {locale() != 'en' ? '全选' : 'Select All'}
                        </span>
                    </Form.Item>
                    {typeChangeNumber === 1 ? (
                        // <Form.Item>
                        //     <span className={styles.righticon}>
                        //         <em className={styles.noAllowTime}>
                        //             {trans(
                        //                 'global.allowContinueCourse',
                        //                 '是否允许连排课程横跨该时段'
                        //             )}
                        //             ：
                        //         </em>
                        //         <Radio.Group
                        //             onChange={this.checkChangeValue}
                        //             disabled={createModalType == 'edit' ? true : false}
                        //             value={createModalType == 'edit' ? isCheckShow : checkValue}
                        //         >
                        //             <Radio value={false}>{trans('student.yes', '是')}</Radio>
                        //             <Radio value={true}>{trans('student.no', 'No')}</Radio>
                        //         </Radio.Group>
                        //         {/* <Checkbox defaultChecked={isCheckShow} disabled>不允许连排课程横跨该时段</Checkbox> */}
                        //     </span>
                        // </Form.Item>
                        <Form.Item className={styles.specialStyle}>
                            <span className={styles.righticon}>
                                <em className={styles.noAllowTime}>
                                    {trans('global.set as break', '设为中断')} :{' '}
                                </em>
                                <Switch
                                    disabled={createModalType == 'edit' ? haveVersionUse : false}
                                    className={styles.switchStyle}
                                    checked={/* createModalType == 'edit' ? isCheckShow :  */isDsiturb}
                                    onChange={this.changeDisturb}
                                />
                                <span
                                    className={styles.textStyle}
                                    style={{
                                        textAlign: 'initial',
                                        display: 'inline-block',
                                        lineHeight: '30px',
                                    }}
                                >
                                    {locale() != 'en'
                                        ? '在进行系统排课时，如果不希望连堂课跨越此时段，可设置为中断，有多个连续的非上课时段时，设置其中一个为中断即可。'
                                        : 'If you do not want the consecutive classes cross this period, you can set it as break. If there are multiple consecutive non class periods, you only need to set one of them as break.'}
                                </span>
                            </span>
                        </Form.Item>
                    ) : null}
                    <Form.Item {...tailFormItemLayout}>
                        <div style={{ marginLeft: locale() === 'en' ? '-50px' : '' }}>
                            <Button
                                className={styles.modalBtn + ' ' + styles.cancelBtn}
                                onClick={this.hideModal}
                            >
                                {trans('global.cancelTimeTable', '取消')}
                            </Button>
                            <Button
                                className={styles.modalBtn + ' ' + styles.submitBtn}
                                onClick={this.handleSubmit}
                                type="primary"
                            >
                                {trans('global.completeTimeTable', '完成')}
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

function mapStateToProps(state) {
    return {
        deleteCalendar: state.time.deleteCalendar,
        addScheduleText: state.time.addScheduleText,
        modifScheduleWork: state.time.modifScheduleWork,
        calendrDetail: state.time.calendrDetail || {},
    };
}
export default connect(mapStateToProps)(Form.create()(CreateCourse));
