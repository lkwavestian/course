//公布课表
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './publishSchedule.less';
import {
    Button,
    Modal,
    Select,
    DatePicker,
    Icon,
    Checkbox,
    Radio,
    Row,
    Col,
    Popover,
    Tooltip,
    message,
    Input,
} from 'antd';
import moment from 'moment';
import { formatTime, formatTimeSafari } from '../../../../utils/utils';
import icon from '../../../../icon.less';
import { isEmpty } from 'lodash';

const { Option } = Select;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

@connect((state) => ({
    getNoAddressResult: state.timeTable.getNoAddressResult,
    scheduleStatusList: state.timeTable.scheduleStatusList,
    publishChangeCourseRequestList: state.replace.publishChangeCourseRequestList,
}))
export default class PublishSchedule extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            publishStartTime: 0,
            publishEndTime: 0,
            currentDate: new Date().getTime(),
            checkedPerson: [],
            showAddressModal: false,
            noAddressState: {},
            isLoading: false,
            noticeTeacherType: 1,
            getNoAddressResult: [],
            textValueOfCh: '',
            textValueOfEn: '',
            confirmModalVisible: false,
        };
    }

    componentDidMount() {
        let { exportRef } = this.props;
        typeof exportRef === 'function' && exportRef(this);

        const { versionInfo } = this.props;
        this.getCurrentWeek(
            versionInfo && versionInfo.startTime,
            versionInfo && versionInfo.endTime
        );
    }

    getDefaultAboutSchedule = () => {
        const { versionInfo, dispatch } = this.props;
        const { publishStartTime, publishEndTime } = this.state;
        dispatch({
            type: 'timeTable/searchNoAddress',
            payload: {
                versionId: versionInfo && versionInfo.id,
                startTime: new Date(formatTimeSafari(publishStartTime)).getTime(),
                endTime:
                    publishEndTime.indexOf('23:59:59') > -1
                        ? new Date(formatTimeSafari(publishEndTime)).getTime()
                        : new Date(formatTimeSafari(publishEndTime + ' 23:59:59')).getTime(),
            },
        }).then(() => {
            this.setState({
                getNoAddressResult: this.props.getNoAddressResult || [],
            });
        });
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.publishModal != this.props.publishModal) {
            if (nextProps.publishModal) {
                this.getCurrentWeek(nextProps.versionInfo.startTime, nextProps.versionInfo.endTime);
            }
        }
    }

    //根据日历定位到当前周
    getCurrentWeek(start, end) {
        let nowStart = new Date(formatTimeSafari(start)),
            nowEnd = new Date(formatTimeSafari(end)),
            nowStartStr = nowStart.getTime(),
            nowEndStr = nowEnd.getTime(),
            dayStart = nowStart.getDay() != 0 ? nowStart.getDay() : 7,
            dayEnd = nowEnd.getDay() != 0 ? nowEnd.getDay() : 7,
            oneDayLong = 24 * 60 * 60 * 1000;
        let MondayTime = nowStartStr - (dayStart - 1) * oneDayLong,
            SundayTime = nowEndStr + (7 - dayEnd) * oneDayLong;
        let monday = new Date(formatTimeSafari(MondayTime)).getTime(),
            sunday = new Date(formatTimeSafari(SundayTime)).getTime();
        this.setState(
            {
                publishStartTime: this.getLocalTime(monday, 2),
                publishEndTime: this.getLocalTime(sunday, 2),
            },
            () => {
                this.getDefaultAboutSchedule();
            }
        );
    }

    handleCancel = (visible) => {
        const { hidePublishModal } = this.props;
        typeof hidePublishModal == 'function' && hidePublishModal();
        this.setState({
            semester: '',
            currentDate: new Date().getTime(),
            checkedPerson: [],
            noticeType: '',
            textValueOfCh: '',
            textValueOfEn: '',
        });
    };

    //切换日期
    handleChangeDate = (date, dateString) => {
        this.setState(
            {
                publishStartTime: dateString[0],
                publishEndTime: dateString[1],
            },
            () => {
                this.getCurrentWeek(dateString[0], dateString[1]);
                this.getDefaultAboutSchedule();
            }
        );
    };

    //时间格式化
    getLocalTime(time, type) {
        if (!time) return false;
        var time = new Date(formatTimeSafari(time)),
            y = time.getFullYear(),
            m = time.getMonth() + 1,
            day = time.getDate();
        if (type == 1) {
            return y + '年' + m + '月' + day + '日';
        }
        if (type == 2) {
            return y + '/' + m + '/' + day;
        }
        if (type == 3) {
            return m + '月' + day + '日';
        }
    }

    //选择通知对象
    changePerson = (val) => {
        if (val.indexOf('employee') > -1) {
            this.setState({
                checkedPerson: val,
            });
        } else {
            this.setState({
                checkedPerson: val,
                noticeTeacherType: null,
            });
        }
    };

    // 公布通知清空
    cleanNotice = () => {
        this.setState({
            textValueOfCh: '',
            textValueOfEn: '',
        });
    };

    //无场地安排的课节--确认发布
    confirmPublish = () => {
        const { dispatch, handleSearchIndex, getVersionList, queryScheduleStatus } = this.props;
        const {
            checkedPerson,
            noticeTeacherType,
            getNoAddressResult,
            textValueOfCh,
            textValueOfEn,
        } = this.state;
        console.log(textValueOfCh, textValueOfEn, 'textValueOfCh, textValueOfEn');
        clearInterval(this.fetchStatus);
        getNoAddressResult.map((item) => {
            item.weekVersionDTO.published = 3;
            return item;
        });
        this.setState(
            {
                isLoading: true,
                confirmModalVisible: false,
                getNoAddressResult,
            },
            () => {
                dispatch({
                    type: 'timeTable/publishSchedule',
                    payload: {
                        noticeIdentities: checkedPerson, //通知人群
                        noticeType: noticeTeacherType,
                        schedulePublishCheckModels: getNoAddressResult,
                        AdditionalMessage: textValueOfCh,
                        AdditionalEnMessage: textValueOfEn,
                    },
                    onSuccess: () => {
                        typeof getVersionList == 'function' && getVersionList.call(this);
                        typeof handleSearchIndex == 'function' && handleSearchIndex();
                        typeof queryScheduleStatus == 'function' &&
                            queryScheduleStatus(this.state.getNoAddressResult);
                    },
                });
            }
        );
    };

    onChangeGroup = (e) => {
        this.setState({
            noticeTeacherType: e.target.value,
        });
    };

    // 版本变动 item:查看变动的课表信息
    viewChange = (item) => {
        const { publishShowContrastModal } = this.props;
        typeof publishShowContrastModal == 'function' && publishShowContrastModal(item);
    };

    viewConflict = (item) => {
        const { publishShowConflict } = this.props;
        typeof publishShowConflict == 'function' && publishShowConflict(item);
    };

    updateResult = (list) => {
        this.setState({
            getNoAddressResult: [...list],
        });
    };

    lookPreview = () => {
        console.log('000000');
        this.setState({
            isLook: true,
        });
    };

    saveText(type, e) {
        console.log(type, 'type');
        const value = e.target.value;
        if (type == 'Chinese') {
            this.setState(
                {
                    textValueOfCh: value,
                },
                () => {
                    console.log(this.state.textValueOfCh, 'textValueOfCh');
                }
            );
        }
        if (type == 'English') {
            this.setState({
                textValueOfEn: value,
            });
        }
    }

    scheduleConfirmPublish = () => {
        const { dispatch, versionInfo } = this.props;
        const { publishStartTime, publishEndTime } = this.state;
        dispatch({
            type: 'replace/getPublishChangeCourseRequestList',
            payload: {
                startTime: moment(publishStartTime).valueOf(),
                endTime: moment(publishEndTime).endOf('day').valueOf() - 999,
                versionId: versionInfo && versionInfo.id,
            },
        }).then(() => {
            const { publishChangeCourseRequestList } = this.props;
            if (isEmpty(publishChangeCourseRequestList[0]?.changeCourseRequestDTOList)) {
                this.confirmPublish();
            } else {
                this.setState({
                    confirmModalVisible: true,
                });
            }
        });
    };

    render() {
        const { publishChangeCourseRequestList } = this.props;
        const {
            isLoading,
            publishStartTime,
            publishEndTime,
            checkedPerson,
            noticeTeacherType,
            getNoAddressResult,
            isLook,
            textValueOfCh,
            textValueOfEn,
            confirmModalVisible,
        } = this.state;
        let allowPublish = false;
        return (
            <div>
                <div className={styles.publishModal}>
                    <span className={styles.arrow}></span>
                    <div className={styles.publishText}>
                        <div className={styles.notice}>
                            <div className={styles.head}>
                                <span className={styles.number}>1</span>
                                <span className={styles.text}>选择通知人员</span>
                                <span className={styles.mention}>
                                    <Icon type="exclamation-circle" theme="filled" />
                                    <span>公布后，当前课表选择的通知对象将收到更新通知</span>
                                </span>
                            </div>
                            <div className={styles.checkbox}>
                                <Checkbox.Group
                                    style={{ width: '100%' }}
                                    onChange={this.changePerson}
                                    value={checkedPerson}
                                >
                                    <Row>
                                        <Col span={8}>
                                            <Checkbox value="employee">教师</Checkbox>
                                        </Col>
                                        <Col span={8}>
                                            <Checkbox value="student">学生</Checkbox>
                                        </Col>
                                        <Col span={8}>
                                            <Checkbox value="parent">家长</Checkbox>
                                        </Col>
                                    </Row>
                                </Checkbox.Group>
                            </div>
                            {checkedPerson.indexOf('employee') > -1 ? (
                                <div className={styles.radio}>
                                    <Radio.Group
                                        onChange={this.onChangeGroup}
                                        style={{ width: '100%' }}
                                        value={noticeTeacherType}
                                    >
                                        <Row>
                                            <Col span={12}>
                                                {/* <Radio value={1}>仅通知有变动的教师</Radio> */}
                                                <Radio value={1}>
                                                    变动通知（仅通知有变动的教师）
                                                </Radio>
                                            </Col>
                                            <Col span={12}>
                                                {/* <Radio value={2}>通知涉及到的所有教师</Radio> */}
                                                <Radio value={2}>
                                                    公布通知（通知课表所有教师）
                                                </Radio>
                                            </Col>
                                        </Row>
                                    </Radio.Group>
                                </div>
                            ) : null}
                            {checkedPerson.indexOf('employee') > -1 ? (
                                <div className={styles.area}>
                                    <Input.TextArea
                                        placeholder={
                                            noticeTeacherType === 1
                                                ? '变动通知内容中文（选填）'
                                                : '公布通知内容中文（选填）'
                                        }
                                        className={styles.textArea}
                                        onChange={this.saveText.bind(this, 'Chinese')}
                                        value={textValueOfCh}
                                    ></Input.TextArea>
                                    <Tooltip
                                        trigger="click"
                                        title={
                                            noticeTeacherType === 1 ? (
                                                <div>
                                                    <div style={{ marginBottom: '10px' }}>
                                                        <span style={{ fontWeight: '900' }}>
                                                            填写变动内容时：
                                                        </span>
                                                        {textValueOfCh
                                                            ? '${教师姓名' +
                                                              '}' +
                                                              '您好！' +
                                                              textValueOfCh +
                                                              '${该教师相关的变动列表' +
                                                              '}'
                                                            : '${教师姓名' +
                                                              '}' +
                                                              '您好！${' +
                                                              '变动通知内容中文' +
                                                              '}' +
                                                              '${该教师相关的变动列表' +
                                                              '}'}
                                                    </div>
                                                    <div>
                                                        <span style={{ fontWeight: '900' }}>
                                                            未填写变动内容时：
                                                        </span>
                                                        {'${教师姓名' +
                                                            '}' +
                                                            '您好！您${公布周期' +
                                                            '}的课表发生变动，请及时确认' +
                                                            '${该教师相关的变动列表' +
                                                            '}'}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div style={{ marginBottom: '10px' }}>
                                                        <span style={{ fontWeight: '900' }}>
                                                            填写公布内容时：
                                                        </span>
                                                        {textValueOfCh
                                                            ? '${教师姓名' +
                                                              '}您好！' +
                                                              textValueOfCh
                                                            : '${教师姓名' +
                                                              '}您好！${' +
                                                              '公布通知内容中文' +
                                                              '}'}
                                                    </div>
                                                    <div>
                                                        <span style={{ fontWeight: '900' }}>
                                                            未填写公布内容时：
                                                        </span>
                                                        {'${教师姓名' +
                                                            '}您好！您${公布周期' +
                                                            '}的课表已公布，请注意查收。'}
                                                    </div>
                                                </div>
                                            )
                                        }
                                    >
                                        <span>查看通知模板中文</span>
                                    </Tooltip>
                                    <Input.TextArea
                                        placeholder={
                                            noticeTeacherType === 1
                                                ? '变动通知内容英文（选填）'
                                                : '公布通知内容英文（选填）'
                                        }
                                        className={styles.textArea}
                                        onChange={this.saveText.bind(this, 'English')}
                                        value={textValueOfEn}
                                    ></Input.TextArea>
                                    <Tooltip
                                        trigger="click"
                                        title={
                                            noticeTeacherType === 1 ? (
                                                <div>
                                                    <div style={{ marginBottom: '10px' }}>
                                                        <span style={{ fontWeight: '900' }}>
                                                            填写变动内容时：
                                                        </span>
                                                        {textValueOfEn
                                                            ? ' Dear $' +
                                                              '{' +
                                                              '教师英文名' +
                                                              '}' +
                                                              '，' +
                                                              textValueOfEn +
                                                              '${' +
                                                              '该教师相关的变动列表英文版' +
                                                              '}'
                                                            : ' Dear $' +
                                                              '{' +
                                                              '教师英文名' +
                                                              '}' +
                                                              '，' +
                                                              '${' +
                                                              '变动内容英文' +
                                                              '}' +
                                                              '${' +
                                                              '该教师相关的变动列表英文版' +
                                                              '}'}
                                                    </div>
                                                    <div>
                                                        <span style={{ fontWeight: '900' }}>
                                                            未填写变动内容时：
                                                        </span>
                                                        {'Dear ${' +
                                                            '教师英文名' +
                                                            '}, ' +
                                                            'your timetable between ${' +
                                                            '公布周期}' +
                                                            'has been changed, please check it. '}
                                                        {'${' + '该教师相关的变动列表英文版' + '}'}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div style={{ marginBottom: '10px' }}>
                                                        <span style={{ fontWeight: '900' }}>
                                                            填写公布内容时：
                                                        </span>
                                                        {textValueOfEn
                                                            ? 'Dear ${' +
                                                              '教师英文名}' +
                                                              textValueOfEn
                                                            : 'Dear ${' +
                                                              '教师英文名}' +
                                                              '${' +
                                                              '公布通知内容英文' +
                                                              '}'}
                                                    </div>

                                                    <div>
                                                        <span style={{ fontWeight: '900' }}>
                                                            未填写公布内容时：
                                                        </span>
                                                        {'Dear ${教师英文名' +
                                                            '}, ' +
                                                            'your timetable between ${公布周期' +
                                                            '} has been published, please check it.'}
                                                    </div>
                                                </div>
                                            )
                                        }
                                    >
                                        <span>查看通知模版英文</span>
                                    </Tooltip>
                                </div>
                            ) : null}
                        </div>
                    </div>
                    <div className={styles.publishRanPicker}>
                        <div className={styles.head}>
                            <span className={styles.number}>2</span>
                            <span className={styles.text}>选择公布时间</span>
                        </div>
                        <RangePicker
                            style={{ width: 240 }}
                            allowClear={false}
                            onChange={this.handleChangeDate}
                            value={[
                                moment(publishStartTime, dateFormat),
                                moment(publishEndTime, dateFormat),
                            ]}
                            format={dateFormat}
                        />
                        {getNoAddressResult && getNoAddressResult.length > 0 ? (
                            <div className={styles.involvingList}>
                                <span className={styles.header}>
                                    <span className={styles.title}>涉及课表</span>
                                    <Popover
                                        content="课表中的单双周课节将按照学期设置中的实际周次进行匹配并公布到日程；
                                                如果调整了周次并且单双周发生了变化，需要重新公布课表日程才会切换。"
                                        // arrowPointAtCenter={true}
                                        overlayClassName={styles.headerPopover}
                                        placement="bottomRight"
                                    >
                                        <div className={styles.toolTipText}>
                                            <Icon type="exclamation-circle" theme="filled" />
                                            <span className={styles.text}> 单双周公布说明</span>
                                        </div>
                                    </Popover>
                                </span>
                                <div className={styles.list}>
                                    {getNoAddressResult &&
                                        getNoAddressResult.length > 0 &&
                                        getNoAddressResult.map((item, index) => {
                                            let version = item.weekVersionDTO || {};
                                            if (
                                                version.published === 1 ||
                                                version.published === 3 ||
                                                item.failMessage
                                            ) {
                                                allowPublish = true;
                                            }
                                            let colorStyle =
                                                version.published === 1
                                                    ? styles.success
                                                    : version.published === 2 || item.failMessage
                                                    ? styles.failed
                                                    : '';
                                            return (
                                                <div className={styles.listItem} key={version.id}>
                                                    <span className={styles.timeAndStatus}>
                                                        {version.frequency != 0 && (
                                                            <span
                                                                className={styles.frequencyIcon}
                                                                style={{
                                                                    backgroundColor:
                                                                        version.frequency === 1
                                                                            ? '#0BC548'
                                                                            : '#FC8312',
                                                                }}
                                                            >
                                                                {version.frequency === 1
                                                                    ? '单'
                                                                    : version.frequency === 2
                                                                    ? '双'
                                                                    : ''}
                                                            </span>
                                                        )}
                                                        <span className={styles.time}>
                                                            {' '}
                                                            {item.weekStartTime} 至{' '}
                                                            {item.weekEndTime}{' '}
                                                        </span>
                                                        {version ? (
                                                            <span
                                                                className={
                                                                    styles.status + ' ' + colorStyle
                                                                }
                                                            >
                                                                {version.published === 3 ? (
                                                                    <i className={icon.iconfont}>
                                                                        &#xe7ed;
                                                                    </i>
                                                                ) : (
                                                                    <i className={icon.iconfont}>
                                                                        &#xe637;
                                                                    </i>
                                                                )}
                                                                {version.published === 0 &&
                                                                !item.failMessage ? (
                                                                    ' 未公布'
                                                                ) : version.published === 1 ? (
                                                                    ' 已公布'
                                                                ) : version.published === 2 ? (
                                                                    '公布失败'
                                                                ) : item.failMessage ? (
                                                                    <Tooltip
                                                                        title={
                                                                            <div
                                                                                dangerouslySetInnerHTML={{
                                                                                    __html: item.failMessage,
                                                                                }}
                                                                            ></div>
                                                                        }
                                                                    >
                                                                        <span> 校验失败</span>
                                                                    </Tooltip>
                                                                ) : version.published === 3 ? (
                                                                    ' 公布中'
                                                                ) : null}
                                                            </span>
                                                        ) : null}
                                                    </span>
                                                    {item.weekVersionDTO ? (
                                                        <span className={styles.scheduleInfo}>
                                                            <span className={styles.leftInfo}>
                                                                <span
                                                                    className={styles.leftInfoItem}
                                                                >
                                                                    {' '}
                                                                    {version.name}{' '}
                                                                </span>
                                                                {item.targetVersionSourceName ? (
                                                                    <span
                                                                        className={
                                                                            styles.leftInfoItem +
                                                                            ' ' +
                                                                            styles.origin
                                                                        }
                                                                    >
                                                                        来源：
                                                                        {
                                                                            item.targetVersionSourceName
                                                                        }{' '}
                                                                    </span>
                                                                ) : null}
                                                            </span>
                                                            <span className={styles.rightAction}>
                                                                <span
                                                                    className={
                                                                        styles.rightActionItem
                                                                    }
                                                                    onClick={this.viewChange.bind(
                                                                        this,
                                                                        item
                                                                    )}
                                                                >
                                                                    查看变动
                                                                </span>
                                                                <span
                                                                    className={
                                                                        styles.rightActionItem
                                                                    }
                                                                    onClick={this.viewConflict.bind(
                                                                        this,
                                                                        item
                                                                    )}
                                                                >
                                                                    课表检查
                                                                </span>
                                                            </span>
                                                        </span>
                                                    ) : null}
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        ) : (
                            <div className={styles.involvingList}>暂无涉及课表</div>
                        )}
                    </div>
                    <div className={styles.operButtonList}>
                        {allowPublish && isLoading && (
                            <span className={styles.disabledText}>
                                <Icon type="exclamation-circle" theme="filled" />
                                <span>
                                    {' '}
                                    课表正在公布中，完成后将自动通知相应人员，您可随时关闭窗口{' '}
                                </span>
                            </span>
                        )}
                        <Button
                            className={styles.modalBtn + ' ' + styles.cancelBtn}
                            onClick={this.handleCancel}
                        >
                            关闭
                        </Button>
                        <Button
                            disabled={allowPublish}
                            className={styles.modalBtn + ' ' + styles.submitBtn}
                            type="primary"
                            // onClick={this.confirmPublish}
                            onClick={this.scheduleConfirmPublish}
                        >
                            确认公布
                        </Button>
                    </div>
                    {confirmModalVisible && (
                        <Modal
                            visible={confirmModalVisible}
                            okText="确认公布"
                            title="公布确认"
                            onOk={this.confirmPublish}
                            onCancel={() =>
                                this.setState({
                                    confirmModalVisible: false,
                                })
                            }
                            wrapClassName={styles.confirmModal}
                        >
                            <div className={styles.contentWrapper}>
                                <div className={styles.info}>
                                    以下需要教务支持的调代课申请关联到了本次公布的课表版本，请确认已经完成相关动课处理，课表公布后会自动更新申请单为完成状态。
                                </div>
                                <div className={styles.replaceApplicationList}>
                                    {publishChangeCourseRequestList.map((requestItem) => {
                                        return requestItem.changeCourseRequestDTOList.map(
                                            (item) => (
                                                <div className={styles.recordItem}>
                                                    <span className={styles.recordMsg}>
                                                        <span>{item.teacherModel.name}</span>
                                                        的调代课申请
                                                        <span>
                                                            {`（${moment(
                                                                requestItem.weekVersionDTO.startTime
                                                            ).format('MM.DD')}`}
                                                            -
                                                            {`${moment(
                                                                requestItem.weekVersionDTO.endTime
                                                            ).format('MM.DD')}）`}
                                                        </span>
                                                    </span>
                                                    <a
                                                        href={`/#/replace/index/application?requestId=${item.id}`}
                                                        target="_blank"
                                                        style={{ color: '#0445FC' }}
                                                    >
                                                        查看详情
                                                    </a>
                                                </div>
                                            )
                                        );
                                    })}
                                </div>
                            </div>
                        </Modal>
                    )}
                </div>
            </div>
        );
    }
}
