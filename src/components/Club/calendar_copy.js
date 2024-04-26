//公共日程
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
    Button,
    Icon,
    List,
    Modal,
    Tabs,
    Select,
    DatePicker,
    Form,
    message,
    Upload,
    Table,
    Spin,
    Tooltip,
} from 'antd';
import { routerRedux } from 'dva/router';
import { trans, locale } from '../../utils/i18n';
import CalendarCalendarTable from '../../components/CalendarCalendarTable/index_other';
import styles from './CalShow.less';
import TableView from '../../components/TableView/index_other';
import Plus from '../../components/Plus/index';
import CalendarDetail from '../../components/CalendarDetail/index';
import CreateDuty from '../../components/CreateDuty/index';
import NewCalendar from './newCalendar';
import lodash from 'lodash';
import { showTimeByChina } from '../../utils/utils';
import moment from 'moment';

const { confirm } = Modal;
const { TabPane } = Tabs;
const { Option } = Select;

@Form.create()
@connect((state) => ({
    getCalendarInfoMessage: state.Index.getCalendarInfoMessage,
    getTimeInfoMessage: state.Index.getTimeInfoMessage,
    checkDetailInfoMessage: state.Index.checkDetailInfoMessage,
    checkDeleteInfoMessage: state.Index.checkDeleteInfoMessage,
    checkConfirmInfoMessage: state.Index.checkConfirmInfoMessage,
    checkListInfo: state.Index.checkListInfo,
    currentUser: state.user.currentUser,
    importCheck: state.Calendar.importCheck,
    importByTypeCalendar: state.Calendar.importByTypeCalendar,
    checkByTypeCalendar: state.Calendar.checkByTypeCalendar,
}))
export default class Index extends PureComponent {
    constructor(props) {
        super(props);
        let {
            match: { params },
            getCalendarInfoMessage,
        } = props;
        this.state = {
            params: {
                calendarId:
                    params.calId ||
                    (getCalendarInfoMessage && getCalendarInfoMessage.currentId) ||
                    '91',
                yearId: '',
                weekNumber: 1,
                userSchedule: 2,
                type: 0,
                //切换周2.0参数添加
                queryStartTime: 0,
                queryEndTime: 0,
            },
            tableType: 'calendar',
            visible: false,
            already: 0,
            schId: 0,
            calId: params.calId ? params.calId : '91',
            semester: 0,
            mark: 0,
            tabVal: 0,
            startTime: 0,
            endTime: 0,
            timeLong: 0,
            dateWeek: 0,
            weekDay: 0,
            changeDate: 0,
            cWeek: 0,
            tableSchId: 0,
            reTime: 0,

            plusOpen: '',

            detailType: '', //日程详情类型

            //2.0参数
            currentDate: new Date(),
            ifHavePower: false, //是否有权限编辑删除
            sendStartTime: '', //要发送的开始时间
            sendEndTime: '', //要发送的结束时间

            tableStartTime: '',
            tableEndTime: '',
            tableId: '',
            tableIfRepeat: false,
            createDutyVisible: false,
            uploadFileVisible: false, //上传文件弹窗
            importCalendarVisible: false,
            importCalendarId: 91,
            calendarFileList: [],
            checkModalVisibility: false,
            successModalVisibility: false,
            successNumber: '',
            failureNumber: '',
            checkErrorMessageList: [],
            importErrorMessageList: [],
            uploadComponent: '',
            ifDefaultDisplay: 1,
            calendarType: 1,
            importConfirmBtn: true,
            isChecking: false,
            createOrEdit: 'create',
            ifOnly: true,
            diffTime: null,
        };
    }

    componentWillMount() {
        console.log('公共日程');
        const { dispatch, match } = this.props;
        //获取当前周
        let now = new Date();
        this.setState({
            currentDate: now,
        });
        this.getCurrentWeek(now);

        this.getAllCalendarType().then(() => {
            const {
                getCalendarInfoMessage,
                match: { params },
            } = this.props;
            if (
                !lodash.isEmpty(getCalendarInfoMessage) &&
                !lodash.isEmpty(getCalendarInfoMessage.content)
            ) {
                const targetId = getCalendarInfoMessage.content.find(
                    (item) => item.ifDefaultDisplay
                ).id;
                const defaultCalendarType = getCalendarInfoMessage.content.find(
                    (item) => item.ifDefaultDisplay
                ).calendarType;
                let calId = params.calId ? params.calId : targetId;
                this.state.calId = calId;
                this.state.calendarType = defaultCalendarType;
                this.state.importCalendarId = calId;
            }
            dispatch({
                type: 'Index/timeInfo',
                payload: {
                    completeTime: 0,
                    week: (match.params && match.params.weekCurrent) || '',
                },
            }).then(() => {
                const {
                    getTimeInfoMessage,
                    getCalendarInfoMessage,
                    match: { params },
                } = this.props;
                let currentWeek =
                        getTimeInfoMessage && getTimeInfoMessage.week
                            ? getTimeInfoMessage.week.currentWeek
                            : 1,
                    //v2.0添加切换周参数
                    // startDate = (getTimeInfoMessage && getTimeInfoMessage.week) ? getTimeInfoMessage.week.startDate : 0,
                    // endDate = (getTimeInfoMessage && getTimeInfoMessage.week) ? getTimeInfoMessage.week.endDate : 0,
                    //end
                    //yearId = getTimeInfoMessage && getTimeInfoMessage.year && getTimeInfoMessage.year.current,
                    calendarId = params.calId
                        ? params.calId
                        : getCalendarInfoMessage && getCalendarInfoMessage.currentId;
                this.state.params.weekNumber = currentWeek;
                //this.state.params.yearId = yearId;
                this.state.params.calendarId = this.state.calId;
                this.fetchCalendarInfo();
                // this.state.cWeek = getTimeInfoMessage && getTimeInfoMessage.week && getTimeInfoMessage.week.currentWeek
            });
        });
    }

    //获取所有行事历类别
    getAllCalendarType() {
        const { dispatch } = this.props;
        return dispatch({
            type: 'Index/CalendarInfo',
            payload: this.state.params,
        });
    }

    //获取所有日历数据
    fetchCalendarInfo = () => {
        const { dispatch } = this.props;
        return dispatch({
            type: 'Index/fetchList',
            payload: {
                queryStartTime: this.state.params.queryStartTime,
                queryEndTime: this.state.params.queryEndTime,
                calendarId: this.state.params.calendarId,
            },
        });
    };

    //日历分类选择
    tabChange(val) {
        const { getCalendarInfoMessage } = this.props;
        let tempCalendarType = undefined;
        getCalendarInfoMessage &&
            getCalendarInfoMessage.content &&
            getCalendarInfoMessage.content.forEach((item, index) => {
                if (item.id == val) {
                    tempCalendarType = item.calendarType;
                }
            });
        console.log('tempCalendarType', tempCalendarType);
        console.log('val :>> ', typeof val);
        this.state.params.calendarId = val;
        this.state.tabVal = val;
        this.state.calId = val;
        this.state.importCalendarId = val;
        if (val == 92) {
            console.log('val :>> ', val);
            this.state.calendarType = 2;
        } else {
            this.state.calendarType = 1;
        }
        this.fetchCalendarInfo();
        //如果calendarType == 2.切换为列表模式
        tempCalendarType == 2
            ? this.setState({ tableType: 'bars' })
            : this.setState({ tableType: 'calendar' });
        //如果当前tab为全民值日，则切换为列表模式
        // val == 92 ? this.setState({ tableType: 'bars' }) : this.setState({ tableType: 'calendar' });
        //改变修改日历的入口状态
        this.setState({
            mark: true,
        });
    }

    //时间格式化
    getLocalTime(time, type) {
        if (!time) return false;
        var time = new Date(time),
            y = time.getFullYear(),
            m = time.getMonth() + 1,
            day = time.getDate();
        if (type == 1) {
            return y + '.' + m + '.' + day;
        }
        if (type == 2) {
            return y + '/' + m + '/' + day;
        }
    }

    //获得当前的00:00:00和23：59：59时间
    getAlldayTime(start, end) {
        var currentDayStart = this.getLocalTime(new Date(start), 2);
        var currentDayEnd = this.getLocalTime(new Date(end), 2);
        var startTime = new Date(currentDayStart + ' ' + '00:00:00').getTime();
        var endTime = new Date(currentDayEnd + ' ' + '23:59:59').getTime();
        // var startTime = new Date(new Date(start).toLocaleDateString()).getTime();
        // var endTime = new Date(new Date(new Date(end).toLocaleDateString()).getTime()+24*60*60*1000-1).getTime();
        this.state.params.queryStartTime = startTime;
        this.state.params.queryEndTime = endTime;
    }

    //根据日历定位到当前周
    getCurrentWeek(nowTime) {
        var now = new Date(nowTime);
        var nowStr = now.getTime();
        var day = now.getDay() != 0 ? now.getDay() : 7;
        var oneDayLong = 24 * 60 * 60 * 1000;

        var MondayTime = nowStr - (day - 1) * oneDayLong;
        var SundayTime = nowStr + (7 - day) * oneDayLong;

        var monday = new Date(MondayTime).getTime();
        var sunday = new Date(SundayTime).getTime();
        this.getAlldayTime(monday, sunday);
        // this.state.params.queryStartTime = monday;
        // this.state.params.queryEndTime = sunday;
    }
    //切换周
    checkWeek(type) {
        const { dispatch } = this.props;
        let week = this.props.getTimeInfoMessage.week.currentWeek,
            currentWeek = this.props.getTimeInfoMessage.week.currentWeek,
            totalWeek = this.props.getTimeInfoMessage.week.totalWeek,
            startTime = this.state.params.queryStartTime || 0,
            endTime = this.state.params.queryEndTime || 0,
            newStartStr = 0,
            newEndStr = 0;

        if (type == 'left') {
            var startTimeStr = new Date(startTime).getTime(),
                endTimeStr = new Date(endTime).getTime();
            newStartStr = startTimeStr - 7 * 24 * 60 * 60 * 1000;
            newEndStr = endTimeStr - 7 * 24 * 60 * 60 * 1000;
            var currentTime = this.state.currentDate && this.state.currentDate.getTime();
            var newCurrent = currentTime - 7 * 24 * 60 * 60 * 1000;
            this.setState({
                currentDate: new Date(newCurrent),
            });
        }
        if (type == 'right') {
            var startTimeStr = new Date(startTime).getTime(),
                endTimeStr = new Date(endTime).getTime();
            (newStartStr = startTimeStr + 7 * 24 * 60 * 60 * 1000),
                (newEndStr = endTimeStr + 7 * 24 * 60 * 60 * 1000);
            var currentTime = this.state.currentDate && this.state.currentDate.getTime();
            var newCurrent = currentTime + 7 * 24 * 60 * 60 * 1000;
            this.setState({
                currentDate: new Date(newCurrent),
            });
        }
        this.state.params.queryStartTime = newStartStr;
        this.state.params.queryEndTime = newEndStr;
        this.state.params.weekNumber = week;
        this.fetchCalendarInfo();
    }

    //切换日历显示类型
    checkTable(type) {
        this.setState({
            tableType: type,
        });
    }

    //处理时间---v2.0
    handleTime(val) {
        let time = showTimeByChina(val, 'GMT');
        let hour = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
        let minute = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
        return hour + ':' + minute;
    }

    //确认日程
    confirmCal = (value) => {
        let _this = this;
        //你是否要确认日程，确认后将会给所有人发邮件！
        confirm({
            title: '',
            content: trans('global.confirmCal', '你是否要确认日程，确认后将会给所有人发邮件！'),
            onOk() {
                _this.props.dispatch({
                    type: 'Index/confirmInfo',
                    payload: {
                        calendarId: _this.state.params.calendarId,
                        confirmWeek: _this.state.params.weekNumber, //确认周
                        semesterId: _this.state.params.yearId, //学期Id
                    },
                });
            },
            onCancel() {},
        });
    };
    //新建日历
    newCalendar = () => {
        this.setState({
            createDutyVisible: true,
            createOrEdit: 'create',
        });
    };

    //新建邀约
    newInvitation = () => {
        this.setState({
            newCalendarVisible: true,
            createOrEdit: 'create',
        });
        /* this.props.dispatch(
      routerRedux.push("/createInvitation" + "/" + this.state.params.calendarId)
    );
    window.location.reload(); */
    };
    //点击删除显示modal
    showModal = () => {
        this.setState({
            daleteVisible: true,
        });
    };
    //不重复删除时候的确定，要发送请求
    handleOk = (e) => {
        this.setState({
            daleteVisible: false,
            visible: false,
        });
        const { dispatch, checkDetailInfoMessage } = this.props;
        this.props
            .dispatch({
                type: 'Index/deleteInfo',
                payload: {
                    id: this.state.schId,
                    calendarId: this.state.params.calendarId,
                    // repateStatus: 0,
                    // repTime: this.state.dateWeek,
                    startTime: this.state.sendStartTime,
                    endTime: this.state.sendEndTime,
                    scheduleType: 4,
                },
            })
            .then(() => {
                this.fetchCalendarInfo();
            });
        this.fetchCalendarInfo();
    };
    //重复仅删除本次
    handleOkOnly = (e) => {
        this.setState({
            daleteVisible: false,
            visible: false,
        });
        const { dispatch } = this.props;
        dispatch({
            type: 'Index/deleteInfo',
            payload: {
                id: this.state.schId,
                calendarId: this.state.params.calendarId,
                // repateStatus: 1,
                //repTime: this.state.dateWeek,
                startTime: this.state.sendStartTime,
                endTime: this.state.sendEndTime,
                scheduleType: 4,
                ifOnly: true,
            },
        }).then(() => {
            this.fetchCalendarInfo();
        });
        this.fetchCalendarInfo();
    };
    //重复删除以后全部
    handleOkAll = (e) => {
        this.setState({
            daleteVisible: false,
            visible: false,
        });
        const { dispatch } = this.props;
        dispatch({
            type: 'Index/deleteInfo',
            payload: {
                id: this.state.schId,
                calendarId: this.state.params.calendarId,
                //repateStatus: 2,
                // repTime: this.state.dateWeek,
                startTime: this.state.sendStartTime,
                endTime: this.state.sendEndTime,
                scheduleType: 4,
                ifOnly: false,
            },
        }).then(() => {
            this.fetchCalendarInfo();
        });
        this.fetchCalendarInfo();
    };
    //编辑确定跳转
    handleOutOk = () => {
        console.log('CalShow handleOutOk');
        let { checkDetailInfoMessage } = this.props;
        if (checkDetailInfoMessage && checkDetailInfoMessage.ifRepeat) {
            this.setState({
                editModal: true,
                visible: false,
            });
        } else {
            this.setState({
                visible: false,
                modifyRepeatVisible: false,
                newCalendarVisible: true,
                createOrEdit: 'edit',
            });
        }
    };

    //取消编辑的跳转
    editCancel(e) {
        this.setState({
            editModal: false,
        });
    }

    //确定编辑跳转--0:以后全部 1：仅一次
    confirmEdit(type) {
        this.setState({
            visible: false,
            editModal: false,
        });
        console.log('CalShow confirmEdit');
        this.setState({
            visible: false,
            modifyRepeatVisible: false,
            newCalendarVisible: true,
            createOrEdit: 'edit',
            ifOnly: type ? true : false,
            // ifOnly: false,
        });
    }

    handleCancel(e) {
        this.setState({
            daleteVisible: false,
            daleteTable: false,
        });
    }

    handleOutCancel = (e) => {
        this.setState({
            visible: false,
        });
    };

    //点击显示细节
    calendarClick(obj) {
        let dateW = obj && obj.cdate;
        let arr = dateW.split(' ');
        let weekDate = arr[1];
        let weekday = arr[0];
        let st = obj && this.handleTime(obj.startTime);
        let et = obj && this.handleTime(obj.endTime);
        this.setState({
            diffTime: moment(obj.endTime).diff(obj.startTime, 'minutes'),
        });

        //要发送的时间
        this.state.sendStartTime = obj.startTime;
        this.state.sendEndTime = obj.endTime;

        //日程的类型
        let type = obj && obj.scheduleType;
        let ifHavePower = obj && obj.ifHavePower;

        let stc = st.split(':'),
            etc = et.split(':'),
            m = etc[1] == stc[1] ? 0 : etc[1] - stc[1],
            h = etc[0] - stc[0];
        let long =
            (m >= 0 ? h : h - 1) +
            trans('global.hour', '小时') +
            (m >= 0 ? m : 60 + m) +
            trans('global.minute', '分钟');

        let timeS = st.split(':').join(''),
            timeE = et.split(':').join('');

        // let timeStart = st;
        // let timeEnd = et;
        let timeStart =
            timeS < 1200 ? trans('global.am', '上午') + st : trans('global.pm', '下午') + st;
        let timeEnd =
            timeE < 1200 ? trans('global.am', '上午') + et : trans('global.pm', '下午') + et;

        this.state.dateWeek = weekDate;
        this.state.weekDay = weekday;
        this.state.startTime = timeStart;
        this.state.endTime = timeEnd;
        this.state.timeLong = long;

        const { dispatch } = this.props;
        dispatch({
            type: 'Index/detailInfo',
            payload: {
                templateId: obj.templateId,
                scheduleType: obj.scheduleType,
                // "pageType": 11,
                // "scheduleId": obj.scheduleId,
                // "date": this.state.dateWeek,
                // "startTime": obj.startTime,
                // "endTime": obj.endTime
            },
        }).then(() => {
            this.setState({
                // visible: true,
                schId: obj.templateId,
                detailType: type, //类型
                ifHavePower: ifHavePower,
            });
        });
    }

    //编辑日历跳转
    editCalendar = () => {
        this.props.dispatch(routerRedux.push('/updata' + '/' + this.state.params.calendarId));
    };

    //选择日期的时间
    sendDate = (date, dateString) => {
        if (dateString != '') {
            let str = dateString.replace(/-/g, '/');
            let dateChange = new Date(str);
            this.setState({
                currentDate: dateChange,
            });
            //定位到当前周，发送日期
            this.getCurrentWeek(dateChange);
        }
        if (dateString == '') {
            this.getCurrentWeek(new Date());
        }
        this.fetchCalendarInfo();
    };

    //加载学年学期
    // loadinfo() {
    //   const { dispatch } = this.props;
    //   dispatch({
    //     type: 'Index/timeInfo',
    //     payload: {
    //         startTime: this.state.startTime,
    //         endTime: this.state.endTime,
    //         startDate: this.state.params.queryStartTime,
    //         endDate: this.state.params.queryEndTime
    //       // completeTime: this.state.changeDate
    //     }
    //   }).then(() => {
    //     const { getTimeInfoMessage } = this.props;
    //     this.state.params.yearId = getTimeInfoMessage && getTimeInfoMessage.year && getTimeInfoMessage.year.current;
    //     this.state.params.weekNumber = (getTimeInfoMessage && getTimeInfoMessage.week && getTimeInfoMessage.week.currentWeek) || 1;
    //     this.fetchCalendarInfo();
    //   });
    // }

    //表格不重复删除时候的确定，要发送请求
    Ok = (e) => {
        this.setState({
            daleteTable: false,
            visible: false,
        });
        this.props
            .dispatch({
                type: 'Index/deleteInfo',
                payload: {
                    id: this.state.tableId,
                    calendarId: this.state.params.calendarId,
                    startTime: this.state.tableStartTime,
                    endTime: this.state.tableEndTime,
                    scheduleType: 4,
                    // repateStatus: 0,
                    // repTime: this.state.reTime,
                    //yearId: this.state.params.yearId
                },
            })
            .then(() => {
                this.fetchCalendarInfo();
            });
        this.fetchCalendarInfo();
    };

    //表格仅删除本次
    OkOnly = (e) => {
        this.setState({
            daleteTable: false,
            visible: false,
        });
        this.props
            .dispatch({
                type: 'Index/deleteInfo',
                payload: {
                    id: this.state.tableId,
                    calendarId: this.state.params.calendarId,
                    startTime: this.state.tableStartTime,
                    endTime: this.state.tableEndTime,
                    scheduleType: 4,
                    ifOnly: true,
                    // repateStatus: 1,
                    // repTime: this.state.reTime
                },
            })
            .then(() => {
                this.fetchCalendarInfo();
            });
        this.fetchCalendarInfo();
    };

    //表格操作以后全部删除
    OkAll = (e) => {
        this.setState({
            daleteTable: false,
            visible: false,
        });
        this.props
            .dispatch({
                type: 'Index/deleteInfo',
                payload: {
                    id: this.state.tableId,
                    calendarId: this.state.params.calendarId,
                    startTime: this.state.tableStartTime,
                    endTime: this.state.tableEndTime,
                    scheduleType: 4,
                    ifOnly: false,
                    // repateStatus: 2,
                    // repTime: this.state.reTime,
                    // yearId: this.state.params.yearId
                },
            })
            .then(() => {
                this.fetchCalendarInfo();
            });
        this.fetchCalendarInfo();
    };

    //表格视图的编辑
    editClick = (record) => {
        if (record && record.ifRepeat) {
            this.setState({
                editModal: true,
                visible: false,
                schId: record.templateId,
            });
        } else {
            this.setState({
                visible: false,
                modifyRepeatVisible: false,
                newCalendarVisible: true,
                createOrEdit: 'edit',
                schId: record.templateId,
            });
        }
    };

    //表格视图的删除
    deleteClick(record) {
        this.setState({
            tableId: record.templateId,
            tableStartTime: record.startTime,
            tableEndTime: record.endTime,
            daleteTable: true,
            ifHavePower: record.ifHavePower,
            tableIfRepeat: record.ifRepeat,
        });
    }

    //关闭新建日历弹窗
    closeCreateDuty() {
        this.setState({
            createDutyVisible: false,
        });
    }

    closeDialog() {}

    //关闭上传文档弹窗
    cancelModal = () => {
        let getForm = document.getElementById('uploadForm');
        getForm.reset();
        this.setState({
            uploadFileVisible: false,
        });
    };

    mapAdminArr(adminArr, userId) {
        if (!adminArr || adminArr.length == 0) return false;
        let result = false;
        for (let i = 0; i < adminArr.length; i++) {
            if (adminArr[i].userId == userId) {
                result = true;
                break;
            }
        }
        return result;
    }

    findCalendar = (content, name) => content.find((item) => item.name === name);

    sureImport = (e) => {
        let { calendarFileList } = this.state;
        console.log('calendarFileList :>> ', calendarFileList);
        let formData = new FormData();
        for (let item of calendarFileList) {
            formData.append('file', item);
        }
        formData.append('calendarId', this.state.importCalendarId);
        formData.append('calendarType', this.state.calendarType);
        if (!lodash.isEmpty(calendarFileList)) {
            this.props
                .dispatch({
                    type: 'Calendar/importByTypeCalendar',
                    payload: formData,
                    onSuccess: () => {
                        this.setState({
                            calendarFileList: [],
                        });
                    },
                })
                .then(() => {
                    let importByTypeCalendar = this.props.importByTypeCalendar;
                    if (!lodash.isEmpty(importByTypeCalendar.checkErrorMessageList)) {
                        this.fetchCalendarInfo();
                        this.setState({
                            calendarFileList: [],
                            successModalVisibility: true,
                            successNumber: importByTypeCalendar.successNumber,
                            failureNumber: importByTypeCalendar.failureNumber,
                            checkErrorMessageList: importByTypeCalendar.checkErrorMessageList,
                        });
                    } else {
                        this.fetchCalendarInfo();
                        message.success(trans('global.scheduleImportSuccess', 'Import success'));
                        this.setState({
                            calendarFileList: [],
                            importCalendarVisible: false,
                        });
                    }
                });
        }
    };

    reUpload = () => {
        let cancelBtn = document.getElementsByClassName('anticon-delete')[0];
        cancelBtn && cancelBtn.click();
        this.setState({ checkModalVisibility: false });
    };

    //重复删除以后全部
    deleteAll = (e) => {
        this.setState({
            daleteVisible: false,
            visible: false,
        });
        const { dispatch } = this.props;
        dispatch({
            type: 'CalShow/deleteInfo',
            payload: {
                id: this.state.schId,
                calendarId: this.state.params.calendarId,
                //repateStatus: 2,
                // repTime: this.state.dateWeek,
                startTime: this.state.sendStartTime,
                endTime: this.state.sendEndTime,
                scheduleType: 5,
                ifOnly: false,
            },
        }).then(() => {
            this.fetchCalendarInfo();
        });
        this.fetchCalendarInfo();
    };

    //重复仅删除本次
    deleteOnly = (e) => {
        this.setState({
            daleteVisible: false,
            visible: false,
        });
        const { dispatch } = this.props;
        dispatch({
            type: 'CalShow/deleteInfo',
            payload: {
                id: this.state.schId,
                calendarId: this.state.params.calendarId,
                // repateStatus: 1,
                //repTime: this.state.dateWeek,
                startTime: this.state.sendStartTime,
                endTime: this.state.sendEndTime,
                scheduleType: 5,
                ifOnly: true,
            },
        }).then(() => {
            this.fetchCalendarInfo();
        });
        this.fetchCalendarInfo();
    };

    //点击删除时候的确定，要发送请求
    handleDelete = (e) => {
        this.setState({
            daleteVisible: false,
            visible: false,
        });
        const { dispatch, checkDetailInfoMessage } = this.props;
        dispatch({
            type: 'CalShow/deleteInfo',
            payload: {
                id: this.state.schId,
                calendarId: this.state.params.calendarId,
                // repateStatus: 0,
                // repTime: this.state.dateWeek,
                startTime: this.state.sendStartTime,
                endTime: this.state.sendEndTime,
                scheduleType: 5,
            },
        }).then(() => {
            this.fetchCalendarInfo();
        });
        this.fetchCalendarInfo();
    };

    render() {
        const {
            getCalendarInfoMessage,
            getTimeInfoMessage,
            checkDetailInfoMessage,
            checkListInfo,
            checkConfirmInfoMessage,
            currentUser,
            match: { params },
        } = this.props;

        const {
            tableType,
            ifHavePower,
            tableIfRepeat,
            createDutyVisible,
            uploadFileVisible,
            schId,
            importCalendarVisible,
            importCalendarId,
            calendarType,
            ifDefaultDisplay,
            calendarFileList,
            checkErrorMessageList,
            checkModalVisibility,
            successModalVisibility,
            successNumber,
            failureNumber,
            importConfirmBtn,
            isChecking,
        } = this.state;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };

        const edit = this.state.mark ? 'inline-block' : 'none';
        //const Admin = checkListInfo && checkListInfo.ifAdmin;
        const ifRe = checkDetailInfoMessage && checkDetailInfoMessage.ifRepeat;

        //表格中删除是否重复
        const tableRe = tableIfRepeat;

        const cuId = params.calId
            ? params.calId
            : getCalendarInfoMessage && getCalendarInfoMessage.currentId;
        const cWeek = params.weekCurrent
            ? params.weekCurrent
            : getTimeInfoMessage && getTimeInfoMessage.week && getTimeInfoMessage.week.currentWeek;
        const currentYear =
            getTimeInfoMessage && getTimeInfoMessage.year && getTimeInfoMessage.year.current;
        const stime =
            checkDetailInfoMessage &&
            checkDetailInfoMessage.scheduleTemplateInfo &&
            checkDetailInfoMessage.scheduleTemplateInfo.sTime;
        const etime =
            checkDetailInfoMessage &&
            checkDetailInfoMessage.scheduleTemplateInfo &&
            checkDetailInfoMessage.scheduleTemplateInfo.eTime;

        //2.0切换周
        const mondayTime = this.state.params.queryStartTime
            ? this.getLocalTime(this.state.params.queryStartTime, 1)
            : '';
        const sundayTime = this.state.params.queryEndTime
            ? this.getLocalTime(this.state.params.queryEndTime, 1)
            : '';
        //是否显示新建日历按钮
        let canShowCreate =
            getCalendarInfoMessage &&
            getCalendarInfoMessage.content &&
            getCalendarInfoMessage.content.length <= 0
                ? true
                : false;

        //操作不同日程的详情,1作息表，2课程 3活动 4行事历
        let detailType = this.state.detailType;
        let backStyle;
        if (detailType == '2') {
            backStyle = styles.courseEl;
        } else if (detailType == '3') {
            backStyle = styles.activeEl;
        } else if (detailType == '4') {
            backStyle = styles.stylesll;
        } else if (detailType == '1') {
            backStyle = styles.relaxsll;
        }
        let language = locale() != 'en' ? true : false;

        //当前登录人id
        let userId = currentUser && currentUser.content && currentUser.content.userId;

        let currentUrl = window.location.href;
        currentUrl = currentUrl.replace(/(\?|&)ticket\=([0-9A-z]+?&|[0-9A-z]+)/gi, '');
        let host =
            currentUrl.indexOf('yungu.org') > -1
                ? 'https://calendar.yungu.org'
                : 'https://calendar.daily.yungu-inc.org';
        //下载模板地址
        let downloadUrl = host + '/api/excel/download/duty/template';

        //tab 换序需求
        if (
            !lodash.isEmpty(getCalendarInfoMessage) &&
            getCalendarInfoMessage.content.length === 8 &&
            currentUser.content &&
            currentUser.content.schoolId === 1
        ) {
            let content = getCalendarInfoMessage.content;
            const findCalendar = this.findCalendar;
            const calendarTypeArray = [
                findCalendar(content, '中小学行事历') ||
                    findCalendar(content, 'Weekly calendar elementary & middle school'),
                findCalendar(content, '高中行事历') ||
                    findCalendar(content, 'Weekly calendar high school'),
                findCalendar(content, '幼儿园行事历') ||
                    findCalendar(content, 'Weekly calendar kindergarten'),
                findCalendar(content, '全民值日') || findCalendar(content, 'YGers on duty'),
                // findCalendar(content, '菠萝计划') || findCalendar(content, 'Pineapple Plan'),
                findCalendar(content, '公开课') || findCalendar(content, 'Public class'),
                findCalendar(content, '运动时间管理') ||
                    findCalendar(content, 'Exercise Time management'),
                findCalendar(content, '初中公共时段安排') ||
                    findCalendar(content, 'MS Public responsibility'),
            ];
            getCalendarInfoMessage.content = lodash.isEmpty(getCalendarInfoMessage.content)
                ? []
                : calendarTypeArray;
        }

        const uploadProps = {
            onRemove: (file) => {
                if (this.state.calendarFileList.length == 1) {
                    this.setState({ importConfirmBtn: true });
                }
                this.setState((state) => {
                    const index = state.calendarFileList.indexOf(file);
                    const newFileList = state.calendarFileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        calendarFileList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {
                this.setState(
                    (state) => ({
                        calendarFileList: [...state.calendarFileList, file],
                        isChecking: true,
                    }),
                    () => {
                        let { calendarFileList } = this.state;
                        let formData = new FormData();
                        for (let item of calendarFileList) {
                            formData.append('file', item);
                        }
                        formData.append('calendarType', this.state.calendarType);
                        if (!lodash.isEmpty(calendarFileList)) {
                            this.props
                                .dispatch({
                                    type: 'Calendar/checkByTypeCalendar',
                                    payload: formData,
                                })
                                .then(() => {
                                    let checkByTypeCalendar = this.props.checkByTypeCalendar;
                                    this.setState({
                                        isChecking: false,
                                    });
                                    if (
                                        !lodash.isEmpty(checkByTypeCalendar.checkErrorMessageList)
                                    ) {
                                        this.setState({
                                            calendarFileList: [],
                                            checkModalVisibility: true,
                                            successNumber: checkByTypeCalendar.successNumber,
                                            failureNumber: checkByTypeCalendar.failureNumber,
                                            checkErrorMessageList:
                                                checkByTypeCalendar.checkErrorMessageList,
                                        });
                                    } else {
                                        this.setState({
                                            importConfirmBtn: false,
                                        });
                                    }
                                });
                        }
                    }
                );

                return false;
            },
            calendarFileList,
        };

        const columns = [
            {
                title: trans('global.rowNumber', '行号'),
                dataIndex: 'lineNumber',
                key: 'lineNumber',
                width: 100,
            },
            {
                title: trans('global.scheduleImportError', '错误信息'),
                dataIndex: 'errorMessage',
                key: 'errorMessage',
                ellipsis: true,
                width: 250,
            },
        ];
        return (
            <div
                className={styles.borderBox}
                style={{ margin: window.top == window.self ? '0px 2%' : '0px' }}
            >
                {getCalendarInfoMessage &&
                    getCalendarInfoMessage.content &&
                    getCalendarInfoMessage.content.length > 0 && (
                        <div>
                            <Tabs
                                activeKey={String(this.state.calId)}
                                onChange={this.tabChange.bind(this)}
                                centered
                            >
                                {getCalendarInfoMessage &&
                                    getCalendarInfoMessage.content.map((el) => (
                                        <TabPane
                                            tab={<span>{language ? el.name : el.ename}</span>}
                                            key={el.id}
                                        ></TabPane>
                                    ))}
                            </Tabs>
                            <div style={{ overflow: 'hidden', marginTop: -5 }}>
                                <div className={styles.rightButton}>
                                    <Button
                                        className={styles.weekChangeBtn}
                                        onClick={this.checkWeek.bind(this, 'left')}
                                    >
                                        <span>{trans('global.lastWeek', '上一周')}</span>
                                    </Button>
                                    <span className={styles.plr_10}>
                                        {mondayTime} - {sundayTime}
                                    </span>
                                    <DatePicker
                                        onChange={this.sendDate}
                                        style={{ width: 40, border: 'none' }}
                                        className={styles.dateStyle}
                                        allowClear={false}
                                        placeholder=""
                                    />
                                    <Button
                                        className={styles.weekChangeBtn}
                                        onClick={this.checkWeek.bind(this, 'right')}
                                    >
                                        <span>{trans('global.nextWeek', '下一周')}</span>
                                    </Button>
                                    <span className={styles.tabbleCheck}>
                                        <Icon
                                            className={tableType == 'calendar' && styles.cur}
                                            onClick={this.checkTable.bind(this, 'calendar')}
                                            type="calendar"
                                        />
                                        <span>|</span>
                                        <Icon
                                            className={tableType == 'bars' && styles.cur}
                                            onClick={this.checkTable.bind(this, 'bars')}
                                            type="bars"
                                        />
                                    </span>

                                    <Button
                                        className={styles.importBtn}
                                        type="primary"
                                        onClick={() => {
                                            this.setState({
                                                importCalendarVisible: true,
                                                importConfirmBtn: true,
                                                calendarFileList: [],
                                                isChecking: false,
                                            });
                                        }}
                                    >
                                        {trans('global.scheduleUploadButton', '导入')}
                                    </Button>
                                </div>
                            </div>
                            <div className={styles.fixButton}>
                                <Plus
                                    openType={this.state.plusOpen}
                                    closeDialog={this.closeDialog.bind(this)}
                                    isMobile={false}
                                    canShowCreate={true}
                                    // canShowCreate = {canShowCreate}
                                    newInvitation={this.newInvitation}
                                    newCalendar={this.newCalendar}
                                />
                            </div>
                            <div className={styles.bodyBox}>
                                {tableType == 'calendar' && (
                                    <CalendarCalendarTable
                                        calendarClick={this.calendarClick.bind(this)}
                                        dataSource={checkListInfo}
                                        info={checkDetailInfoMessage}
                                        currentDate={this.state.currentDate}
                                        tableKind="calShowTable"
                                        onRef={(ref) => {
                                            this.child = ref;
                                        }}
                                        detailType={this.state.detailType}
                                        visible={this.state.visible}
                                        dateWeek={this.state.dateWeek}
                                        weekday={this.state.weekDay}
                                        diffTime={this.state.diffTime}
                                        popStartTime={this.state.startTime}
                                        popEndTime={this.state.endTime}
                                        timeLong={this.state.timeLong}
                                        canEdit={ifHavePower}
                                        handleOutOk={this.handleOutOk}
                                        showModal={this.showModal}
                                        templateId={schId}
                                        courseDate={this.state.courseDate}
                                        dispatch={this.props.dispatch}
                                        deleteAll={this.deleteAll}
                                        deleteOnly={this.deleteOnly}
                                        handleDelete={this.handleDelete}
                                    />
                                )}
                                {tableType == 'bars' && (
                                    <TableView
                                        deleteClick={this.deleteClick.bind(this)}
                                        editClick={this.editClick.bind(this)}
                                        checkListInfo={checkListInfo}
                                        currentDate={this.state.currentDate}
                                        showOperList={true}
                                    />
                                )}
                            </div>
                            <span className={styles.spanSolid}></span>
                            <CalendarDetail
                                detailType={this.state.detailType}
                                visible={this.state.visible}
                                detailInfo={checkDetailInfoMessage && checkDetailInfoMessage}
                                dateWeek={this.state.dateWeek}
                                weekday={this.state.weekDay}
                                startTime={this.state.startTime}
                                endTime={this.state.endTime}
                                timeLong={this.state.timeLong}
                                canEdit={ifHavePower}
                                handleOutOk={this.handleOutOk}
                                showModal={this.showModal}
                                templateId={schId}
                            />

                            {ifRe ? (
                                <Modal
                                    visible={this.state.daleteVisible}
                                    onOk={this.handleOk}
                                    onCancel={this.handleCancel.bind(this)}
                                    style={{ top: 200 }}
                                    footer={[
                                        <Button
                                            key="1"
                                            className={styles.operButton}
                                            onClick={this.handleCancel.bind(this)}
                                        >
                                            {trans('index.cancel', '取消')}
                                        </Button>,
                                        <Button
                                            key="2"
                                            className={styles.operButton}
                                            onClick={this.handleOkAll}
                                        >
                                            {trans('index.allDelete', '以后的日程都删除')}
                                        </Button>,
                                        <Button
                                            key="3"
                                            className={styles.operButton}
                                            type="primary"
                                            onClick={this.handleOkOnly}
                                        >
                                            {trans('index.onlyDelete', '仅删除这一次日程')}
                                        </Button>,
                                    ]}
                                >
                                    <p className={styles.deleteSure}>
                                        {trans('index.sureDelete', '您确定要删除这次日程么？')}
                                    </p>
                                </Modal>
                            ) : (
                                <Modal
                                    visible={this.state.daleteVisible}
                                    onOk={this.handleOk}
                                    onCancel={this.handleCancel.bind(this)}
                                    style={{ top: 200 }}
                                    footer={[
                                        <Button
                                            key="1"
                                            className={styles.operButton}
                                            onClick={this.handleCancel.bind(this)}
                                        >
                                            {trans('index.cancel', '取消')}
                                        </Button>,
                                        <Button
                                            key="2"
                                            className={styles.operButton}
                                            type="primary"
                                            onClick={this.handleOk}
                                        >
                                            {trans('global.delete', '删除')}
                                        </Button>,
                                    ]}
                                >
                                    <p className={styles.deleteSure}>
                                        {trans('index.sureDelete', '您确定要删除这次日程么？')}
                                    </p>
                                </Modal>
                            )}
                            {tableRe ? (
                                <Modal
                                    visible={this.state.daleteTable}
                                    style={{ top: 200 }}
                                    onCancel={this.handleCancel.bind(this)}
                                    footer={[
                                        <Button
                                            key="1"
                                            className={styles.operButton}
                                            onClick={this.handleCancel.bind(this)}
                                        >
                                            {trans('index.cancel', '取消')}
                                        </Button>,
                                        <Button
                                            key="2"
                                            className={styles.operButton}
                                            onClick={this.OkAll}
                                        >
                                            {trans('index.allDelete"', '以后的日程都删除')}
                                        </Button>,
                                        <Button
                                            key="3"
                                            className={styles.operButton}
                                            type="primary"
                                            onClick={this.OkOnly}
                                        >
                                            {trans('index.onlyDelete', '仅删除这一次日程')}
                                        </Button>,
                                    ]}
                                >
                                    <p className={styles.deleteSure}>
                                        {trans('index.sureDelete', '您确定要删除这次日程么？')}
                                    </p>
                                </Modal>
                            ) : (
                                <Modal
                                    visible={this.state.daleteTable}
                                    style={{ top: 200 }}
                                    onCancel={this.handleCancel.bind(this)}
                                    footer={[
                                        <Button
                                            key="1"
                                            className={styles.operButton}
                                            onClick={this.handleCancel.bind(this)}
                                        >
                                            {trans('index.cancel', '取消')}
                                        </Button>,
                                        <Button
                                            key="2"
                                            className={styles.operButton}
                                            type="primary"
                                            onClick={this.Ok}
                                        >
                                            {trans('global.delete', '删除')}
                                        </Button>,
                                    ]}
                                >
                                    <p className={styles.deleteSure}>
                                        {trans('index.sureDelete', '您确定要删除这次日程么？')}
                                    </p>
                                </Modal>
                            )}
                            <Modal
                                visible={this.state.editModal}
                                style={{ top: 200 }}
                                onCancel={this.editCancel.bind(this)}
                                footer={[
                                    <Button
                                        key="3"
                                        className={styles.operButton}
                                        onClick={this.editCancel.bind(this)}
                                    >
                                        {trans('index.cancel', '取消')}
                                    </Button>,
                                    <Button
                                        key="1"
                                        className={styles.operButton}
                                        type="primary"
                                        onClick={this.confirmEdit.bind(this, 1)}
                                    >
                                        {trans('updatainvitation.modifyTwo', '仅修改本次日程')}
                                    </Button>,
                                    <Button
                                        key="2"
                                        className={styles.operButton}
                                        type="primary"
                                        onClick={this.confirmEdit.bind(this, 0)}
                                    >
                                        {trans(
                                            'updatainvitation.modifyOne',
                                            '以后的重复日程一同修改'
                                        )}
                                    </Button>,
                                ]}
                            >
                                <p className={styles.deleteSure}>
                                    {trans(
                                        'updatainvitation.modifyThree',
                                        '选择重复日程的修改方式'
                                    )}
                                </p>
                            </Modal>
                        </div>
                    )}
                {getCalendarInfoMessage &&
                    getCalendarInfoMessage.content &&
                    getCalendarInfoMessage.content.length <= 0 && (
                        <div className={styles.noDataBox}>
                            <span>{trans('global.noItinerary', '暂无行程')}</span>
                        </div>
                    )}

                <Modal
                    className={styles.successModal}
                    visible={successModalVisibility}
                    title={trans('global.importComplete', '导入完成')}
                    closable={false}
                    footer={[
                        <Button
                            type="primary"
                            className={styles.reUpload}
                            onClick={() =>
                                this.setState({
                                    successModalVisibility: false,
                                    calendarFileList: [],
                                    importCalendarVisible: false,
                                })
                            }
                        >
                            {trans('global.importGotIt', '我知道了')}
                        </Button>,
                    ]}
                >
                    <p>
                        {locale() === 'en'
                            ? `The processing is completed. ${successNumber} items processed successfully, ${failureNumber} items failed. The reasons for the failure are as follows`
                            : `处理完成，共成功处理 ${successNumber} 条，失败 ${failureNumber}
              条，失败原因如下:`}
                    </p>
                    <Table
                        dataSource={checkErrorMessageList}
                        columns={columns}
                        rowKey="lineNumber"
                        pagination={false}
                    />
                </Modal>

                <Modal
                    className={styles.checkModal}
                    visible={checkModalVisibility}
                    title={trans('global.verificationFailed', '校验失败')}
                    closable={true}
                    onCancel={this.reUpload}
                    footer={[
                        <Button type="primary" className={styles.reUpload} onClick={this.reUpload}>
                            {trans('global.uploadAgain', '重新上传')}
                        </Button>,
                    ]}
                >
                    <p>
                        {trans('global.thereAre', '当前上传的文件中共有')} &nbsp;
                        <span className={styles.failureNumber}>{failureNumber} </span>&nbsp;
                        {trans('global.pleaseUploadAgain', '条错误，请调整后重新上传')}
                    </p>
                    <Table
                        dataSource={checkErrorMessageList}
                        columns={columns}
                        rowKey="lineNumber"
                        pagination={false}
                    />
                </Modal>

                <Modal
                    visible={importCalendarVisible}
                    title={trans('global.importSchedule', '批量导入日程')}
                    okText={trans('global.importScheduleConfirm', '确认导入')}
                    className={styles.importCalendar}
                    onCancel={() => this.setState({ importCalendarVisible: false })}
                    closable={false}
                    onOk={this.sureImport}
                    okButtonProps={{
                        disabled: importConfirmBtn /* type: "primary" */,
                    }}
                    destroyOnClose={true}
                >
                    <Spin
                        spinning={isChecking}
                        tip={trans('global.uploadChecking', '上传文件正在校验中')}
                    >
                        <div>
                            <div className={styles.importMsg}>
                                <span>①</span>&nbsp;
                                <span>
                                    {trans('global.selectScheduleCategory', '选择导入的日程分类')}
                                </span>
                                <Select
                                    className={styles.importCalendarSelect}
                                    defaultValue={parseInt(this.state.calId, 10)}
                                    onChange={(_, opt) => {
                                        this.setState({
                                            importCalendarId: opt.props.value,
                                            calendarType: opt.props.calendarType,
                                        });
                                    }}
                                >
                                    {getCalendarInfoMessage &&
                                        getCalendarInfoMessage.content &&
                                        getCalendarInfoMessage.content.length > 0 &&
                                        getCalendarInfoMessage.content.map((item) => (
                                            <Option
                                                calendarType={item.calendarType}
                                                value={item.id}
                                                key={item.id}
                                                style={{ width: 'auto' }}
                                            >
                                                <Tooltip
                                                    title={
                                                        locale() === 'en' ? item.ename : item.name
                                                    }
                                                >
                                                    <span
                                                        className={styles.importCalendarOptionMsg}
                                                    >
                                                        {locale() === 'en' ? item.ename : item.name}
                                                    </span>
                                                </Tooltip>
                                            </Option>
                                        ))}
                                </Select>
                            </div>
                            <div className={styles.importMsg}>
                                <span>②</span>&nbsp;
                                <span>
                                    {trans(
                                        'global.downloadScheduleTemplate',
                                        '下载导入模板，批量填写导入信息'
                                    )}
                                </span>
                                <a
                                    href={`/api/excel/importDownloadTemplate?calendarType=${calendarType}`}
                                    target="_blank"
                                    style={{ marginLeft: 15 }}
                                >
                                    {trans('global.scheduleDownloadTemplate', '下载模板')}
                                </a>
                            </div>
                            <div className={styles.importMsg}>
                                <span>③</span>&nbsp;
                                <span>
                                    {trans('global.uploadSchedule', '上传填写好的导入信息表')}
                                </span>
                                <span className={styles.desc}>
                                    <span className={styles.fileBtn}>
                                        <Form
                                            id="uploadForm"
                                            layout="inline"
                                            method="post"
                                            className={styles.form}
                                            encType="multipart/form-data"
                                        >
                                            <Upload {...uploadProps} maxCount={1}>
                                                <Button type="primary" disabled={!importConfirmBtn}>
                                                    {trans('global.scheduleSelectFile', '选择文件')}
                                                </Button>
                                            </Upload>
                                        </Form>
                                    </span>
                                </span>
                            </div>
                        </div>
                    </Spin>
                </Modal>

                <CreateDuty
                    modalVisible={createDutyVisible}
                    closeCreateDuty={this.closeCreateDuty.bind(this)}
                    fetchCalendarInfo={this.fetchCalendarInfo.bind(this)}
                    getAllCalendarType={this.getAllCalendarType.bind(this)}
                />
                {this.state.newCalendarVisible && (
                    <NewCalendar
                        visible={this.state.newCalendarVisible}
                        onCancel={() =>
                            this.setState({
                                newCalendarVisible: false,
                            })
                        }
                        fetchCalendarInfo={this.fetchCalendarInfo}
                        calendarId={this.state.params.calendarId}
                        createOrEdit={this.state.createOrEdit}
                        templateId={schId}
                        ifOnly={this.state.ifOnly}
                        detailType={this.state.detailType}
                        closeDetail={this.child.closeDetail}
                        detailIfRepeat={checkDetailInfoMessage.ifRepeat}
                    />
                )}
            </div>
        );
    }
}
