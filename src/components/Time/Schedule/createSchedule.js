//新建作息表
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './createCourse.less';
import {
    Row,
    Col,
    Modal,
    Form,
    Select,
    DatePicker,
    TreeSelect,
    message,
    Button,
    Input,
    Spin,
} from 'antd';
import icon from '../../../icon.less';
import moment, { locale } from 'moment';
import { type } from 'os';
import { trans } from '../../../utils/i18n';
import { formatTimeSafari } from '../../../utils/utils';
const { Option } = Select;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
class createSchedule extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            semester: '',
            treeSelectValue: [],
            startChangeDate: '', // 更改的第一个日期
            endChangeDate: '', // 更改的第二个日期
            copyvalue: '',
            semesterReceive: '',
            scheduleName: '',
            loading: false,
            startTimestamp: undefined,
            endTimestamp: undefined,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.modalVisible != this.props.modalVisible) {
            this.setState({
                modalVisible: nextProps.modalVisible,
            });
        }
        if (nextProps.semesterValue != this.props.semesterValue) {
            this.setState({
                semester: nextProps.semesterValue,
            });
        }
    }
    // 关闭
    hideModal = () => {
        const { hideScheModal } = this.props;
        typeof hideScheModal == 'function' && hideScheModal();
        this.props.form.resetFields();
    };

    changeSemester = (value) => {
        const { semesterList } = this.props;
        let form = this.props.form;
        // form.setFieldsValue({
        //     startEndTime: [moment(1504195200000), moment(1517414400000)],
        // });
        semesterList &&
            semesterList.length &&
            semesterList.map((item, index) => {
                if (item.id == value) {
                    form.setFieldsValue({
                        startEndTime: [moment(item.startTime), moment(item.endTime)],
                    });
                    this.setState({
                        startChangeDate: item.startTime,
                        endChangeDate: item.endTime,
                    });
                }
            });

        this.setState({
            semester: value,
        });
    };

    changeScheduleName = (e) => {
        this.setState({
            scheduleName: e.target.value,
        });
    };

    handleTreeData = (tree) => {
        if (!tree || tree.length == 0) return;
        let treeData = [];
        tree.map((item, index) => {
            let obj = {};
            // obj.title = item.orgName + '-' + item.orgEname;
            obj.title =
                item.orgEname && item.orgEname != item.orgName
                    ? `${item.orgName}-${item.orgEname}`
                    : `${item.orgName}`;
            obj.key = item.id;
            obj.value = item.id;
            treeData.push(obj);
        });
        return treeData;
    };

    //删除作息表二次确认
    deleteCalendar = (el) => {
        let self = this;
        Modal.confirm({
            title:
                locale() != 'en'
                    ? '您确定要删除该作息表吗？'
                    : 'Are you sure to delete this period?',
            content: '',
            okText: '确认删除',
            cancelText: '取消',
            cancelButtonProps: {
                style: {
                    height: '36px',
                    borderRadius: '8px',
                    color: '#01113da6',
                    backgroundColor: '#01113d12',
                    border: '0',
                },
            },
            okButtonProps: {
                style: {
                    height: '36px',
                    borderRadius: '8px',
                    color: '#fff',
                    backgroundColor: '#3b6ff5',
                },
            },
            onOk() {
                self.deleteIcon(el);
            },
            onCancel() {
                console.log('deleteIcon');
            },
        });
    };

    // 删除作息表
    deleteIcon = (el) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'time/deleteBaseListText',
            payload: {
                baseScheduleId: this.props.dateValue,
            },
        }).then(() => {
            let { getSelectDate, hideScheModal, changeScheduleId } = this.props;
            //typeof getGrade == "function" && getGrade();
            typeof getSelectDate == 'function' && getSelectDate();
            typeof hideScheModal == 'function' && hideScheModal();
            // typeof changeScheduleId == 'function' && changeScheduleId();
        });
    };

    handleChangeTree = (value, e) => {
        this.setState({
            treeSelectValue: value,
        });
    };

    //判断类型
    judgeType = (value) => {
        let result;
        if (value instanceof Array) {
            result = value;
        } else {
            result = [value];
        }
        return result;
    };

    // 生成
    handleSubmit = (e) => {
        e.preventDefault();
        const { form } = this.props;
        const {
            startChangeDate,
            endChangeDate,
            treeSelectValue,
            semester,
            scheduleName,
            startTimestamp,
            endTimestamp,
        } = this.state;
        console.log('startChangeDate', startChangeDate);
        console.log('endChangeDate', endChangeDate);
        const { semesterList, modalType, dispatch, dateValue, fetchWorkingHours } = this.props;
        let newValue = null;
        for (let i = 0, m = semesterList.length; i < m; i++) {
            if (semesterList && semesterList[i].id === semester) {
                newValue = semesterList[i];
            }
        }
        form.validateFields((err, values) => {
            if (!err) {
                if (values.end <= values.start) {
                    message.error('请编辑开始和结束时间，并且结束时间不能小于开始时间');
                    return false;
                } else {
                    this.setState({
                        loading: true,
                    });
                    if (modalType == 'copy') {
                        dispatch({
                            type: 'time/copyScheduleList',
                            payload: {
                                id: dateValue,
                                gradeIdList:
                                    // treeSelectValue && treeSelectValue.length > 0
                                    //     ? treeSelectValue
                                    //     : this.judgeType(values.grade),
                                    this.judgeType(values.grade),
                                failureTime: endChangeDate
                                    ? endChangeDate
                                    : fetchWorkingHours.failureTime,
                                effectiveTime: startChangeDate
                                    ? startChangeDate
                                    : fetchWorkingHours.effectiveTime,
                                semesterId: semester,
                                name: values.scheduleName,
                            },
                            onSuccess: () => {
                                const { getSelectDate, hideScheModal, getLastSchedule } =
                                    this.props;
                                typeof getLastSchedule == 'function' && getLastSchedule();
                                typeof getSelectDate == 'function' && getSelectDate();
                                typeof hideScheModal == 'function' && hideScheModal();
                            },
                        }).then(() => {
                            this.setState({
                                loading: false,
                                startChangeDate: undefined,
                                endChangeDate: undefined,
                            });
                        });
                    }
                    if (modalType == 'edit') {
                        dispatch({
                            type: 'time/editScheduleList',
                            payload: {
                                id: dateValue,
                                failureTime: endChangeDate
                                    ? endChangeDate
                                    : fetchWorkingHours.failureTime,
                                effectiveTime: startChangeDate
                                    ? startChangeDate
                                    : fetchWorkingHours.effectiveTime,
                                gradeIdList:
                                    treeSelectValue && treeSelectValue.length > 0
                                        ? treeSelectValue
                                        : this.judgeType(values.grade),
                                name: values.scheduleName,
                            },
                            onSuccess: () => {
                                const { getSelectDate, hideScheModal } = this.props;
                                typeof getSelectDate == 'function' && getSelectDate();
                                typeof hideScheModal == 'function' && hideScheModal();
                            },
                        }).then(() => {
                            this.setState({
                                loading: false,
                                startChangeDate: '',
                                endChangeDate: '',
                            });
                        });
                    }
                    if (modalType == 'create') {
                        dispatch({
                            type: 'time/addScheduleList',
                            payload: {
                                semesterId: values.createDate,
                                gradeIdList:
                                    treeSelectValue && treeSelectValue.length > 0
                                        ? treeSelectValue
                                        : this.judgeType(values.grade),
                                failureTime: endChangeDate ? endChangeDate : newValue.endTime,
                                effectiveTime: startChangeDate
                                    ? startChangeDate
                                    : newValue.startTime,
                                name: scheduleName,
                            },
                            onSuccess: () => {
                                const { getSelectDate, hideScheModal } = this.props;
                                typeof getSelectDate == 'function' && getSelectDate();
                                typeof hideScheModal == 'function' && hideScheModal();
                            },
                        }).then(() => {
                            this.setState({
                                loading: false,
                                startChangeDate: undefined,
                                endChangeDate: undefined,
                            });
                        });
                    }
                }
            }
        });
    };

    // 获取选择时间
    timeChange = (time, timeString) => {
        const oldDate = new Date(formatTimeSafari(timeString[0]) + ' 00:00:00').getTime();
        const newDate = new Date(formatTimeSafari(timeString[1]) + ' 23:59:59').getTime();

        this.setState({
            startChangeDate: oldDate,
            endChangeDate: newDate,
            timechange: timeString,
        });
    };

    //获取学期的start && end
    getSemesterTime = (type) => {
        const { semesterList } = this.props;
        const { semester } = this.state;
        if (semesterList.length == 0 || !semester) return;
        let start, end;
        for (let i = 0; i < semesterList.length; i++) {
            if (semesterList[i].id == semester) {
                start = semesterList[i].startTime;
                end = semesterList[i].endTime;
                break;
            }
        }
        if (type == 'start') {
            return new Date(formatTimeSafari(start));
        } else {
            return new Date(formatTimeSafari(end));
        }
    };

    // 禁止日期
    disabledDate = (time) => {
        const { semesterList } = this.props;
        for (let i = 0; i < semesterList.length; i++) {
            if (this.state.semester == semesterList[i].id) {
                const oldTime = semesterList[i].startTime - 24 * 3600 * 1000;
                const newTime = semesterList[i].endTime;

                if (!time) {
                    return false;
                } else {
                    return (
                        time < moment(new Date(oldTime)).subtract('days') ||
                        time > moment(new Date(newTime)).add('days')
                    );
                }
            }
        }
    };

    render() {
        const {
            modalTitle,
            semesterList,
            gradeList,
            form: { getFieldDecorator },
            modalType,
            gradeValue,
            fetchWorkingHours,
            teachingOrgList,
        } = this.props;
        const { modalVisible, semester, scheduleName, loading } = this.state;
        // let noEdit = modalType == 'edit' || modalType == 'copy' ? true : false;
        let noEdit = modalType == 'edit' ? true : false;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 12,
                    offset: 0,
                },
                sm: {
                    span: 10,
                    offset: 12,
                },
            },
        };
        const tProps = {
            treeData: this.handleTreeData(gradeList),
            setFieldsValue: gradeList,
            initialValue: `${this.props.dateValue}`,
            treeCheckable: true,
            placeholder: locale() != 'en' ? '选择当前校区下的年级' : 'Please select',
            treeNodeFilterProp: 'title',
            onChange: this.handleChangeTree,
            // disabled: noEdit,
            dropdownStyle: {
                maxHeight: 400,
                overflow: 'auto',
            },
        };
        return (
            modalVisible && (
                <Modal
                    visible={modalVisible}
                    title={modalTitle}
                    footer={null}
                    onCancel={this.hideModal}
                    destroyOnClose={true}
                >
                    <Spin spinning={loading}>
                        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                            {modalType == 'copy' ? (
                                <Form.Item label={trans('global.copyTo', '复制到：')}>
                                    {getFieldDecorator('copyDate', {
                                        initialValue: semester,
                                        rules: [{ required: true, message: '请选择所属学期' }],
                                    })(
                                        <Select
                                            style={{ width: 230 }}
                                            onChange={this.changeSemester}
                                            className={styles.selectStyle}
                                            disabled={noEdit}
                                        >
                                            {semesterList &&
                                                semesterList.length > 0 &&
                                                semesterList.map((item, index) => {
                                                    return (
                                                        <Option value={item.id} key={item.id}>
                                                            {item.officialSemesterName}
                                                        </Option>
                                                    );
                                                })}
                                        </Select>
                                    )}
                                </Form.Item>
                            ) : (
                                <Form.Item label={trans('global.semesterTimeTable', '所属学期：')}>
                                    {getFieldDecorator('createDate', {
                                        initialValue: semester,
                                        rules: [{ required: true, message: '请选择所属学期' }],
                                    })(
                                        <Select
                                            style={{ width: 230 }}
                                            onChange={this.changeSemester}
                                            className={styles.selectStyle}
                                            disabled={noEdit}
                                        >
                                            {semesterList &&
                                                semesterList.length > 0 &&
                                                semesterList.map((item, index) => {
                                                    return (
                                                        <Option value={item.id} key={item.id}>
                                                            {item.officialSemesterName}
                                                        </Option>
                                                    );
                                                })}
                                        </Select>
                                    )}
                                </Form.Item>
                            )}
                            {modalType == 'copy' ? (
                                <Form.Item label={trans('global.dateTimeTable', '起止日期：')}>
                                    {getFieldDecorator('startEndTime', {
                                        rules: [{ required: true, message: '请选择起始日期' }],
                                        initialValue: [
                                            moment(
                                                new Date(
                                                    fetchWorkingHours.effectiveTime
                                                ).toLocaleString(),
                                                dateFormat
                                            ),
                                            moment(
                                                new Date(
                                                    fetchWorkingHours.failureTime
                                                ).toLocaleString(),
                                                dateFormat
                                            ),
                                        ],
                                    })(
                                        <RangePicker
                                            style={{ width: 230 }}
                                            allowClear={false}
                                            onChange={this.timeChange}
                                            format={dateFormat}
                                            disabledDate={this.disabledDate}
                                        />
                                    )}
                                </Form.Item>
                            ) : modalType == 'create' ? (
                                <Form.Item label={trans('global.dateTimeTable', '起止日期：')}>
                                    {getFieldDecorator('startEndTime', {
                                        rules: [{ required: true, message: '请选择起始日期' }],
                                        initialValue: [
                                            moment(this.getSemesterTime('start'), dateFormat),
                                            moment(this.getSemesterTime('end'), dateFormat),
                                        ],
                                    })(
                                        <RangePicker
                                            style={{ width: 230 }}
                                            allowClear={false}
                                            onChange={this.timeChange}
                                            format={dateFormat}
                                            disabledDate={this.disabledDate}
                                        />
                                    )}
                                </Form.Item>
                            ) : (
                                <Form.Item label={trans('global.dateTimeTable', '起止日期：')}>
                                    {getFieldDecorator('startEndTime', {
                                        rules: [{ required: true, message: '请选择起始日期' }],
                                        initialValue: [
                                            moment(
                                                new Date(
                                                    fetchWorkingHours.effectiveTime
                                                ).toLocaleString(),
                                                dateFormat
                                            ),
                                            moment(
                                                new Date(
                                                    fetchWorkingHours.failureTime
                                                ).toLocaleString(),
                                                dateFormat
                                            ),
                                        ],
                                    })(
                                        <RangePicker
                                            style={{ width: 230 }}
                                            allowClear={false}
                                            onChange={this.timeChange}
                                            format={dateFormat}
                                            disabledDate={this.disabledDate}
                                        />
                                    )}
                                </Form.Item>
                            )}
                            <Form.Item label={trans('global.gradesTimeTable', '适用年级：')}>
                                {/* <Row gutter={8}> */}
                                {/* <Col span={15}> */}
                                {/* <Form.Item> */}
                                {getFieldDecorator('grade', {
                                    rules: [{ required: true, message: '请选择适用年级' }],
                                    initialValue:
                                        modalType == 'edit'
                                            ? fetchWorkingHours.gradeIdList
                                            : modalType == 'copy'
                                            ? teachingOrgList.map((item) => item.id)
                                            : [],
                                })(<TreeSelect {...tProps} />)}
                                {/* </Form.Item> */}
                                {/* </Col> */}
                                {/* </Row> */}
                            </Form.Item>

                            <Form.Item label={trans('global.scheduleName', '作息名称')}>
                                {getFieldDecorator('scheduleName', {
                                    initialValue:
                                        modalType == 'edit'
                                            ? fetchWorkingHours.name
                                            : modalType == 'copy'
                                            ? fetchWorkingHours.name
                                                ? `${fetchWorkingHours.name}-复制`
                                                : ''
                                            : '',
                                    rules: [{ required: true, message: '请填写作息名称' }],
                                })(
                                    <Input
                                        placeholder={
                                            locale() != 'en' ? '请填写作息名称' : 'Please Input'
                                        }
                                        onChange={this.changeScheduleName}
                                    ></Input>
                                )}
                            </Form.Item>

                            {modalType && modalType == 'edit' ? (
                                <div
                                    style={{
                                        display: 'flex',
                                        paddingLeft: '33px',
                                        marginBottom: '24px',
                                    }}
                                >
                                    <span
                                        style={{ flex: 1, lineHeight: 1, cursor: 'pointer' }}
                                        onClick={this.deleteCalendar}
                                    >
                                        <span>
                                            <i className={icon.iconfont + ' ' + styles.deleteRow}>
                                                &#xe739;
                                            </i>
                                            {trans('global.deleteTimeTable', '删除')}
                                        </span>
                                    </span>
                                    <span style={{ flex: 1, marginLeft: '35px' }}>
                                        <Button
                                            className={styles.modalBtn + ' ' + styles.cancelBtn}
                                            onClick={this.hideModal}
                                        >
                                            {trans('global.cancelTimeTable', '取消：')}
                                        </Button>
                                        <Button
                                            className={styles.modalBtn + ' ' + styles.submitBtn}
                                            onClick={this.handleSubmit}
                                        >
                                            {trans('global.completeTimeTable', '完成：')}
                                        </Button>
                                    </span>
                                </div>
                            ) : (
                                <Form.Item {...tailFormItemLayout}>
                                    <Button
                                        className={styles.modalBtn + ' ' + styles.cancelBtn}
                                        onClick={this.hideModal}
                                    >
                                        {trans('global.cancelTimeTable', '取消：')}
                                    </Button>
                                    <Button
                                        className={styles.modalBtn + ' ' + styles.submitBtn}
                                        onClick={this.handleSubmit}
                                    >
                                        {trans('global.createTimeTable', '生成')}
                                    </Button>
                                </Form.Item>
                            )}
                        </Form>
                    </Spin>
                </Modal>
            )
        );
    }
}
function mapStateToProps(state) {
    return {
        copyScheduleList: state.time.copyScheduleList,
        editScheduleList: state.time.editScheduleList,
        addScheduleList: state.time.addScheduleList,
        editScheduleSuccess: state.time.editScheduleSuccess,
        deleteBaseListText: state.time.deleteBaseListText,
        fetchWorkingHours: state.time.fetchWorkingHours,
        semesterList: state.time.semesterList,
    };
}
export default connect(mapStateToProps)(Form.create()(createSchedule));
