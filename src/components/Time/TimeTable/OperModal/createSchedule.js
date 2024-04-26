//新建课表
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './commonModal.less';
import { formatTime, formatTimeSafari, gradeValues } from '../../../../utils/utils';
import {
    Modal,
    Form,
    Select,
    Button,
    Col,
    TreeSelect,
    message,
    DatePicker,
    Radio,
    Input,
} from 'antd';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { locale, trans } from '../../../../utils/i18n';

const { Option } = Select;

@Form.create()
@connect((state) => ({
    scheduleNum: state.timeTable.scheduleNum,
    createMessage: state.timeTable.createMessage,
    gradeList: state.time.allGrade,
    allStage: state.time.allStage,
}))
export default class CreateSchedule extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            semester: '',
            gradeValue: [],
            stageValue: undefined,
            selectVal: [],
            showType: undefined,
            errorVisible: false,
            rangePickerTimeList: [],
            okLoading: false,
        };
    }

    componentDidMount() {
        this.setState({
            semester: this.props.semesterValue,
        });
        this.getStageList();
        this.initialData();
    }

    initialData = () => {
        const { source, createScheduleStart, createScheduleEnd } = this.props;
        if (source !== 'scheduleListForTask') {
            this.setState({
                rangePickerTimeList: [
                    moment(createScheduleStart).startOf('day').valueOf(),
                    moment(createScheduleEnd).endOf('day').valueOf() - 999,
                ],
            });
        }
    };

    getStageList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'time/allStage',
            payload: {},
        });
    };

    getGradeList = (stage) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'time/getallGrade',
            payload: {
                stage,
            },
        }).then(() => {
            const { gradeList } = this.props;
            this.handleChangeGrade(gradeList.map((item) => item.id));
        });
    };

    handleOk = (e) => {
        e.preventDefault();
        const { form, dispatch, getVersionList, scheduleNum } = this.props;
        const { selectVal, showType, rangePickerTimeList } = this.state;
        form.validateFields((err, values) => {
            if (!err) {
                // if (!scheduleNum || scheduleNum == 0) {
                //     message.error('请选择有作息表的年级');
                //     return false;
                // }
                // if (showType != 2) {
                //     message.error('请选择有作息表的年级！');
                //     return false;
                // }

                let tempScheduleIdList = [];
                scheduleNum?.baseScheduleList &&
                    scheduleNum.baseScheduleList.length &&
                    scheduleNum.baseScheduleList.forEach((item, index) => {
                        tempScheduleIdList.push(item.id);
                    });

                if (showType == 2 && selectVal.length == 0) {
                    message.error('请选择关联作息!');
                    return false;
                }
                this.setState(
                    {
                        okLoading: true,
                    },
                    () => {
                        dispatch({
                            type: 'timeTable/createSchedule',
                            payload: {
                                startTime: rangePickerTimeList[0],
                                endTime: rangePickerTimeList[1],
                                gradeIdList: this.state.gradeValue ? this.state.gradeValue : [],
                                semesterId: this.state.semester,
                                scheduleIdList:
                                    showType == 1
                                        ? tempScheduleIdList
                                        : showType == 2
                                        ? selectVal
                                        : undefined,
                                name: form.getFieldValue('name'),
                            },
                            onSuccess: () => {
                                form.resetFields();
                                this.handleCancel();
                                this.setState({
                                    selectVal: [],
                                    showType: undefined,
                                });
                                typeof getVersionList == 'function' && getVersionList.call(this);
                            },
                        }).then(() => {
                            const { createMessage } = this.props;
                            if (!createMessage.status) {
                                this.setState({
                                    errorVisible: true,
                                });
                            }
                            this.setState({
                                okLoading: false,
                            });
                        });
                    }
                );
            }
        });
    };

    handleCancel = () => {
        const { hideModal, form } = this.props;
        typeof hideModal == 'function' && hideModal('createSchedule');
        form.resetFields();
        this.setState({
            semester: '',
            gradeValue: undefined,
            showType: undefined,
        });
    };

    handleTreeData = (tree) => {
        if (!tree || tree.length == 0) return;
        let treeData = [];
        tree.map((item, index) => {
            let obj = {
                title: item.orgName + '-' + item.orgEname,
                key: item.id,
                value: item.id,
            };
            treeData.push(obj);
        });
        return treeData;
    };

    changeSemester = (value) => {
        this.setState({
            semester: value,
        });
    };

    //获取学期的开始时间和结束时间
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
            return formatTime(start);
        } else {
            return formatTime(end);
        }
    };

    //选择年级
    handleChangeGrade = (value) => {
        const { form } = this.props;
        form.setFieldsValue({
            gradeValue: value,
        });
        this.setState({
            gradeValue: value,
            selectVal: [],
        });
        if (!isEmpty(value)) {
            this.haveScheduleNum(value);
        }
    };

    //获取年级的几个作息
    haveScheduleNum = (value) => {
        const { dispatch } = this.props;
        const { rangePickerTimeList } = this.state;
        dispatch({
            type: 'timeTable/haveScheduleNum',
            payload: {
                gradeIdList: value,
                startTime: rangePickerTimeList[0],
                endTime: rangePickerTimeList[1],
            },
        }).then(() => {
            const { scheduleNum } = this.props;
            const tempShowType = scheduleNum.showType;
            this.setState({
                showType: tempShowType,
            });
        });
    };

    changeSelectVal = (value) => {
        this.setState({
            selectVal: value,
        });
    };

    //处理时间
    formatScheduleTime = (time) => {
        let date = new Date(time);
        let y, m, day;
        y = date.getFullYear();
        m = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        return y + '/' + m + '/' + day;
    };

    //拼接年级字符串
    renderGrade = (gradeObjList) => {
        let gradeString = '';
        gradeObjList &&
            gradeObjList.length &&
            gradeObjList.forEach((item, index) => {
                gradeString += item.orgEname;
            });
        return gradeString;
    };

    closeErrorModal = () => {
        // this.props.openCreate();
        this.setState({
            errorVisible: false,
        });
    };

    datePickerChange = (timeValue) => {
        const { dispatch } = this.props;
        let startWeekValue = moment(timeValue).startOf('week').valueOf();
        let endWeekValue = moment(timeValue).endOf('week').valueOf() - 999;
        this.setState({
            rangePickerTimeList: [startWeekValue, endWeekValue],
        });
    };

    getDisabledDate = (date) => {
        const { semesterValue, semesterList } = this.props;
        let targetSemesterItem = semesterList.find((item) => item.id === semesterValue);
        if (!targetSemesterItem) {
            // return true;
            return false;
        }
        return (
            date.valueOf() > moment(targetSemesterItem.semesterEndTime).valueOf() ||
            date.valueOf() < moment(targetSemesterItem.semesterStartTime).valueOf()
        );
    };

    handleChangeStage = (e) => {
        const { dispatch } = this.props;
        this.setState({
            stageValue: e.target.value,
        });
        this.getGradeList(e.target.value);
    };

    render() {
        const {
            form: { getFieldDecorator },
            gradeList,
            semesterList,
            scheduleModal,
            scheduleNum,
            createScheduleStart,
            createScheduleEnd,
            createMessage,
            source,
            allStage,
        } = this.props;
        const {
            semester,
            selectVal,
            showType,
            errorVisible,
            rangePickerTimeList,
            gradeValue,
            stageValue,
            okLoading,
        } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        return (
            <>
                <Modal
                    visible={scheduleModal}
                    title="新建课表"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    width="600px"
                    className={styles.createStyle}
                    // destroyOnClose={true}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="所属学期">
                            {getFieldDecorator('semester', {
                                rules: [{ required: true, message: '请选择学期' }],
                                initialValue: semester,
                            })(
                                <div className={styles.selectSemester}>
                                    <Select
                                        style={{ width: 200 }}
                                        onChange={this.changeSemester}
                                        value={semester}
                                        disabled={true}
                                    >
                                        {semesterList &&
                                            semesterList.length > 0 &&
                                            semesterList.map((item, index) => {
                                                return (
                                                    <Option key={item.id} value={item.id}>
                                                        {item.officialSemesterName}
                                                    </Option>
                                                );
                                            })}
                                    </Select>
                                    <div className={styles.timePicker}>
                                        <span
                                            className={styles.timeText}
                                            style={{
                                                color: 'rgba(0, 0, 0, 0.65)',
                                                backgroundColor: '#fff',
                                            }}
                                        >
                                            {!isEmpty(rangePickerTimeList) ? (
                                                `${moment(rangePickerTimeList[0]).format(
                                                    'YYYY-MM-DD'
                                                )} ~ ${moment(rangePickerTimeList[1]).format(
                                                    'YYYY-MM-DD'
                                                )}`
                                            ) : (
                                                <span className={styles.placeHolder}>
                                                    请选择日期
                                                </span>
                                            )}
                                        </span>
                                        <DatePicker
                                            onChange={this.datePickerChange}
                                            className={styles.datePicker}
                                            allowClear={false}
                                            getCalendarContainer={(triggerNode) =>
                                                triggerNode.parentElement
                                            }
                                            disabledDate={this.getDisabledDate}
                                        />
                                    </div>
                                </div>
                            )}
                        </Form.Item>

                        <Form.Item label="版本名称">
                            {getFieldDecorator('name')(<Input placeholder="请输入版本名称" />)}
                        </Form.Item>

                        {!isEmpty(rangePickerTimeList) && (
                            <Form.Item label="适用学段">
                                {getFieldDecorator('range', {
                                    rules: [{ required: true, message: '请选择学段' }],
                                })(
                                    <div className={styles.rangeWrapper}>
                                        <Radio.Group
                                            onChange={this.handleChangeStage}
                                            value={stageValue}
                                        >
                                            {allStage &&
                                                allStage.length > 0 &&
                                                allStage.map((item, index) => (
                                                    <Radio value={item.stage} key={item.id}>
                                                        {locale() != 'en'
                                                            ? item.orgName
                                                            : item.orgEname}
                                                    </Radio>
                                                ))}
                                        </Radio.Group>
                                    </div>
                                )}
                            </Form.Item>
                        )}

                        {stageValue && (
                            <Form.Item label="适用年级" style={{ alignItems: 'flex-start' }}>
                                {getFieldDecorator('gradeValue', {
                                    rules: [{ required: true, message: '请选择年级' }],
                                })(
                                    <Select
                                        onChange={this.handleChangeGrade}
                                        placeholder="请选择年级"
                                        mode="multiple"
                                    >
                                        {gradeList &&
                                            gradeList.length > 0 &&
                                            gradeList.map((item, index) => {
                                                return (
                                                    <Option value={item.id} key={item.grade}>
                                                        {locale() != 'en'
                                                            ? item.orgName
                                                            : item.orgEname}
                                                    </Option>
                                                );
                                            })}
                                    </Select>
                                )}
                            </Form.Item>
                        )}

                        {!isEmpty(gradeValue) && (
                            <Form.Item label="关联作息" style={{ alignItems: 'flex-start' }}>
                                {getFieldDecorator(
                                    'relativeSchedule',
                                    {}
                                )(
                                    showType == 0 ? (
                                        <span className={styles.spanStyle}>
                                            {scheduleNum?.showMessage}
                                        </span>
                                    ) : showType == 1 ? (
                                        <div className={styles.divStyle}>
                                            {scheduleNum?.baseScheduleList &&
                                                scheduleNum.baseScheduleList.length &&
                                                scheduleNum.baseScheduleList.map((item, index) => {
                                                    return (
                                                        <p
                                                            style={{
                                                                textAlign: 'initial',
                                                                marginBottom: 0,
                                                            }}
                                                        >
                                                            {item?.name
                                                                ? item.name
                                                                : this.formatScheduleTime(
                                                                      item.effectiveTime
                                                                  ) +
                                                                  '-' +
                                                                  this.formatScheduleTime(
                                                                      item.failureTime
                                                                  )}
                                                        </p>
                                                    );
                                                })}
                                        </div>
                                    ) : showType == 2 ? (
                                        <div>
                                            <Select
                                                mode="multiple"
                                                value={selectVal}
                                                placeholder="请选择关联作息"
                                                onChange={this.changeSelectVal}
                                            >
                                                {scheduleNum?.baseScheduleList &&
                                                    scheduleNum.baseScheduleList.length &&
                                                    scheduleNum.baseScheduleList.map(
                                                        (item, index) => {
                                                            return (
                                                                <Option
                                                                    key={item.id}
                                                                    value={item.id}
                                                                >
                                                                    {item?.name
                                                                        ? item.name
                                                                        : this.formatScheduleTime(
                                                                              item.effectiveTime
                                                                          ) +
                                                                          '-' +
                                                                          this.formatScheduleTime(
                                                                              item.failureTime
                                                                          )}
                                                                </Option>
                                                            );
                                                        }
                                                    )}
                                            </Select>
                                        </div>
                                    ) : (
                                        <></>
                                    )
                                )}
                            </Form.Item>
                        )}

                        <div className={styles.btnList} style={{ marginTop: 20, marginBottom: 20 }}>
                            <Button
                                className={styles.modalBtn + ' ' + styles.cancelBtn}
                                onClick={this.handleCancel}
                            >
                                取消
                            </Button>
                            <Button
                                className={styles.modalBtn + ' ' + styles.submitBtn}
                                onClick={this.handleOk}
                                type="primary"
                                loading={okLoading}
                            >
                                生成
                            </Button>
                        </div>
                        {/* {gradeValue && gradeValue.length > 0 && (
                        <p className={styles.selectedNum}>
                            <span>您选择的年级共涉及{scheduleNum}个作息表</span>
                        </p>
                    )} */}
                    </Form>
                </Modal>
                <Modal
                    visible={errorVisible}
                    className={styles.errorStyle}
                    footer={null}
                    onCancel={this.closeErrorModal}
                >
                    {createMessage.message}
                    <p style={{ margin: '10px 0 0 0' }}>
                        <Button type="primary" onClick={this.closeErrorModal}>
                            我知道了
                        </Button>
                    </p>
                </Modal>
            </>
        );
    }
}
