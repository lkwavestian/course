//更换作息表
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './commonModal.less';
import { Modal, Radio, Select, Table, message, Button, Icon, Spin } from 'antd';
import moment from 'moment';
const { Option } = Select;
let weekMap = [];
let timeLine = [];
const options = [
    { label: '周一', value: 1 },
    { label: '周二', value: 2 },
    { label: '周三', value: 3 },
    { label: '周四', value: 4 },
    { label: '周五', value: 5 },
    { label: '周六', value: 6 },
    { label: '周日', value: 7 },
];
var weekArray = ['', '一', '二', '三', '四', '五', '六', '天'];
@connect((state) => ({
    changeSchedulelist: state.time.changeSchedulelist,
    changeDifference: state.time.changeDifference,
    gradeList: state.time.gradeList,
    gradeListByVersion: state.timeTable.gradeListByVersion,
    changeResult: state.time.changeResult,
    versionScheduleChange: state.time.versionScheduleChange,
    customGradeList: state.timeTable.customGradeList,
    getScheduleList: state.time.getScheduleList,
    lessonViewCustomValue: state.lessonView.lessonViewCustomValue,
    lessonViewCustomLabel: state.lessonView.lessonViewCustomLabel,
}))
export default class ChangeSchedule extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            mappingSchedules: [],
            oldScheduleId: '',
            newScheduleId: undefined,
            changeOldScheduleName: undefined,
            changeNewScheduleName: undefined,
            value: 1,
            listAlert: false,
            reveal: true,
            oldWeekDay: undefined,
            newWeekDay: undefined,
            oldCalendarListOne: [],
            oldCalendarListTwo: [],
            oldCalendarListThree: [],
            oldCalendarListFour: [],
            oldCalendarListFive: [],
            oldCalendarListSix: [],
            oldCalendarListSeven: [],
            onGroup: [],
            buttonTrue: true,
            opens: false,
            twoOk: true,
            changeDifference1: {},
            tabIndex: 1,
            scheduleIdList: undefined,
            splitData: [],
            checkVisible: false,
            changeErrVisible: false,
            loading: false,
            changging: false,
        };
    }

    componentDidMount() {
        const { dispatch, currentVersion } = this.props;
        dispatch({
            type: 'timeTable/findGrade',
            payload: {
                versionId: currentVersion,
            },
        }).then(() => {
            const { customGradeList } = this.props;
            let tempArr = [];
            customGradeList &&
                customGradeList.length &&
                customGradeList.forEach((item, index) => {
                    tempArr.push(item.id);
                });
            dispatch({
                type: 'time/getScheduleList',
                payload: {
                    versionId: currentVersion,
                    gradeIdString: tempArr && tempArr.join(),
                },
            });
        });
        this.changeSchedulelist();
    }

    //获取表
    changeSchedulelist = () => {
        const { dispatch, currentVersion } = this.props;
        dispatch({
            type: 'time/changeSchedulelist',
            payload: { versionId: currentVersion },
            onSuccess: () => {
                const { changeSchedulelist } = this.props;
                let tempScheduleIdList = [];
                changeSchedulelist &&
                    changeSchedulelist.length &&
                    changeSchedulelist.forEach((item, index) => {
                        tempScheduleIdList.push({
                            oldScheduleId: item.currentModel.id,
                            newScheduleId: undefined,
                        });
                    });

                this.setState({
                    oldScheduleId:
                        changeSchedulelist.currentModel && changeSchedulelist.currentModel.id,
                    newScheduleId:
                        changeSchedulelist.mappingSchedules &&
                        changeSchedulelist.mappingSchedules[0] &&
                        changeSchedulelist.mappingSchedules[0].id,
                    value: 1,
                    tabIndex: 1,
                    scheduleIdList: tempScheduleIdList,
                    splitData: [
                        {
                            currentModel: {
                                id: undefined,
                                gradeIdList: [],
                            },
                            mappingSchedules: [],
                            newScheduleId: undefined,
                        },
                    ],
                });
            },
        });
    };
    changeOldScheduleId = (value, event) => {
        const { changeSchedulelist } = this.props;
        const changeOldScheduleName = event.props.children;
        const mappingSchedules = changeSchedulelist.find(
            (item) => item.currentModel.id === value
        ).mappingSchedules;
        this.setState({
            mappingSchedules: mappingSchedules,
            listAlert: mappingSchedules.length == 0 ? true : false,
            oldScheduleId: value,
            value: 1,
            changeOldScheduleName,
            changeNewScheduleName: undefined,
            newScheduleId: undefined,
            oldCalendarListOne: [],
            oldCalendarListTwo: [],
            oldCalendarListThree: [],
            oldCalendarListFour: [],
            oldCalendarListFive: [],
            oldCalendarListSix: [],
            oldCalendarListSeven: [],
            changeDifference1: {},
        });
    };

    changeNewScheduleId = (value, event) => {
        const { dispatch, currentVersion } = this.props;
        const { oldScheduleId } = this.state;
        const changeNewScheduleName = event.props.children;
        dispatch({
            type: 'time/changeDifference',
            payload: {
                versionId: currentVersion,
                oldScheduleId: oldScheduleId,
                newScheduleId: value,
            },
        }).then(() => {
            const { changeDifference } = this.props;
            const oldCalendarList = changeDifference && changeDifference.oldCalendarList;

            const oldCalendarList1 =
                oldCalendarList && oldCalendarList.find((item) => item.weekDay === 1)
                    ? oldCalendarList.find((item) => item.weekDay === 1).calendarDetailModels
                    : [];
            const oldCalendarList2 =
                oldCalendarList && oldCalendarList.find((item) => item.weekDay === 2)
                    ? oldCalendarList.find((item) => item.weekDay === 2).calendarDetailModels
                    : [];
            const oldCalendarList3 =
                oldCalendarList && oldCalendarList.find((item) => item.weekDay === 3)
                    ? oldCalendarList.find((item) => item.weekDay === 3).calendarDetailModels
                    : [];
            const oldCalendarList4 =
                oldCalendarList && oldCalendarList.find((item) => item.weekDay === 4)
                    ? oldCalendarList.find((item) => item.weekDay === 4).calendarDetailModels
                    : [];
            const oldCalendarList5 =
                oldCalendarList && oldCalendarList.find((item) => item.weekDay === 5)
                    ? oldCalendarList.find((item) => item.weekDay === 5).calendarDetailModels
                    : [];
            const oldCalendarList6 =
                oldCalendarList && oldCalendarList.find((item) => item.weekDay === 6)
                    ? oldCalendarList.find((item) => item.weekDay === 6).calendarDetailModels
                    : [];
            const oldCalendarList7 =
                oldCalendarList && oldCalendarList.find((item) => item.weekDay === 7)
                    ? oldCalendarList.find((item) => item.weekDay === 7).calendarDetailModels
                    : [];
            this.setState({
                oldCalendarListOne: oldCalendarList1,
                oldCalendarListTwo: oldCalendarList2,
                oldCalendarListThree: oldCalendarList3,
                oldCalendarListFour: oldCalendarList4,
                oldCalendarListFive: oldCalendarList5,
                oldCalendarListSix: oldCalendarList6,
                oldCalendarListSeven: oldCalendarList7,
                changeDifference1: changeDifference,
            });
        });
        this.setState({
            newScheduleId: value,
            changeNewScheduleName,
        });
    };
    handleCancel = () => {
        const { hideModal } = this.props;
        this.setState({
            value: 1,
            changeOldScheduleName: undefined,
            changeNewScheduleName: undefined,
            listAlert: false,
            reveal: true,
            oldWeekDay: undefined,
            newWeekDay: undefined,
            oldCalendarListOne: [],
            oldCalendarListTwo: [],
            oldCalendarListThree: [],
            oldCalendarListFour: [],
            oldCalendarListFive: [],
            oldCalendarListSix: [],
            oldCalendarListSeven: [],
            onGroup: [],
            opens: false,
            twoOk: true,
            changeDifference1: {},
        });
        typeof hideModal == 'function' && hideModal('changsSchedule');
    };
    onChange = (e) => {
        this.setState({
            value: e.target.value,
        });
    };

    saveGradeToChange = () => {
        const { currentVersion, dispatch } = this.props;
        let { tabIndex, scheduleIdList, splitData } = this.state;
        let payload = {};
        let checkIsTrue = true;
        if (tabIndex == 1) {
            scheduleIdList.forEach((item, index) => {
                if (!item.newScheduleId) {
                    checkIsTrue = false;
                }
            });

            payload = {
                versionId: currentVersion,
                changeType: 1,
                versionScheduleChangeDTOList: scheduleIdList,
            };
            // this.setState({
            //     loading: true,
            // });
        } else if (tabIndex == 2) {
            splitData.forEach((item) => {
                if (!item.newScheduleId) {
                    checkIsTrue = false;
                }
            });
            if (!checkIsTrue) {
                message.warn('请完善信息后提交！');
                return false;
            }
            this.scheduleChange();
            return false;
        }

        if (!checkIsTrue) {
            message.warn('请完善信息后提交！');
            return false;
        }

        dispatch({
            type: 'time/changeSchedule',
            payload,
        }).then(() => {
            const { changeResult } = this.props;
            this.setState({
                loading: false,
            });
            if (
                (changeResult.status && changeResult?.content && changeResult.content.length) ||
                !changeResult.status
            ) {
                this.setState({
                    checkVisible: true,
                });
            } else {
                this.scheduleChange();
            }
        });
    };

    handleOk = () => {
        const { dispatch, currentVersion, getVersionList } = this.props;
        const { oldScheduleId, newScheduleId, value } = this.state;
        this.setState({
            buttonTrue: false,
        });
        if (!oldScheduleId || !newScheduleId) {
            message.info('请先完善版本信息再更换');
            return false;
        }
        dispatch({
            type: 'time/changeSchedule',
            payload: {
                oldScheduleId,
                newScheduleId,
                versionId: value == 1 ? currentVersion : null,
            },
            onSuccess: () => {
                this.handleCancel();
                this.setState({
                    value: 1,
                    changeOldScheduleName: undefined,
                    changeNewScheduleName: undefined,
                });
                typeof getVersionList == 'function' &&
                    getVersionList.call(
                        this,
                        '',
                        this.props.lessonViewCustomValue,
                        this.props.lessonViewCustomLabel
                    );
            },
        }).then(() => {
            this.setState({
                buttonTrue: true,
            });
        });
    };

    renderCol1(number, map) {
        let cols = [];
        for (let i = 0; i < number; i++) {
            if (map && map.length > 0) {
                cols.push(<th key={i}>{map[i]}</th>);
            }
        }
        return cols;
    }

    convertDay = (day) => {
        return weekArray[day];
    };
    renderCol2 = () => {
        const { changeDifference1 } = this.state;
        const newCalendarList = changeDifference1 && changeDifference1.newCalendarList;
        const newCalendarList1 =
            newCalendarList && newCalendarList.find((item) => item.weekDay === 1)
                ? newCalendarList.find((item) => item.weekDay === 1).calendarDetailModels.length
                : 0;
        const newCalendarList2 =
            newCalendarList && newCalendarList.find((item) => item.weekDay === 2)
                ? newCalendarList.find((item) => item.weekDay === 2).calendarDetailModels.length
                : 0;
        const newCalendarList3 =
            newCalendarList && newCalendarList.find((item) => item.weekDay === 3)
                ? newCalendarList.find((item) => item.weekDay === 3).calendarDetailModels.length
                : 0;
        const newCalendarList4 =
            newCalendarList && newCalendarList.find((item) => item.weekDay === 4)
                ? newCalendarList.find((item) => item.weekDay === 4).calendarDetailModels.length
                : 0;
        const newCalendarList5 =
            newCalendarList && newCalendarList.find((item) => item.weekDay === 5)
                ? newCalendarList.find((item) => item.weekDay === 5).calendarDetailModels.length
                : 0;
        const newCalendarList6 =
            newCalendarList && newCalendarList.find((item) => item.weekDay === 6)
                ? newCalendarList.find((item) => item.weekDay === 6).calendarDetailModels.length
                : 0;
        const newCalendarList7 =
            newCalendarList && newCalendarList.find((item) => item.weekDay === 7)
                ? newCalendarList.find((item) => item.weekDay === 7).calendarDetailModels.length
                : 0;
        let cols = [];
        for (let i = 0; i < 10; i++) {
            const {
                oldCalendarListOne,
                oldCalendarListTwo,
                oldCalendarListThree,
                oldCalendarListFour,
                oldCalendarListFive,
                oldCalendarListSix,
                oldCalendarListSeven,
            } = this.state;
            const One =
                oldCalendarListOne &&
                oldCalendarListOne.find((item) => item.weekDay) &&
                oldCalendarListOne.find((item) => item.weekDay).weekDay;
            const Two =
                oldCalendarListTwo &&
                oldCalendarListTwo.find((item) => item.weekDay) &&
                oldCalendarListTwo.find((item) => item.weekDay).weekDay;
            const Three =
                oldCalendarListThree &&
                oldCalendarListThree.find((item) => item.weekDay) &&
                oldCalendarListThree.find((item) => item.weekDay).weekDay;
            const Four =
                oldCalendarListFour &&
                oldCalendarListFour.find((item) => item.weekDay) &&
                oldCalendarListFour.find((item) => item.weekDay).weekDay;
            const Five =
                oldCalendarListFive &&
                oldCalendarListFive.find((item) => item.weekDay) &&
                oldCalendarListFive.find((item) => item.weekDay).weekDay;
            const Six =
                oldCalendarListSix &&
                oldCalendarListSix.find((item) => item.weekDay) &&
                oldCalendarListSix.find((item) => item.weekDay).weekDay;
            const Seven =
                oldCalendarListSeven &&
                oldCalendarListSeven.find((item) => item.weekDay) &&
                oldCalendarListSeven.find((item) => item.weekDay).weekDay;
            const j = i + 1;
            cols.push(
                <tr key={i}>
                    <td style={{ background: i < newCalendarList1 ? '#fff' : '#f1f2f3' }}>
                        {i < oldCalendarListOne.length
                            ? '周' + this.convertDay(One) + '第' + j + '节'
                            : ''}
                    </td>
                    <td style={{ background: i < newCalendarList2 ? '#fff' : '#f1f2f3' }}>
                        {i < oldCalendarListTwo.length
                            ? '周' + this.convertDay(Two) + '第' + j + '节'
                            : ''}
                    </td>
                    <td style={{ background: i < newCalendarList3 ? '#fff' : '#f1f2f3' }}>
                        {i < oldCalendarListThree.length
                            ? '周' + this.convertDay(Three) + '第' + j + '节'
                            : ''}
                    </td>
                    <td style={{ background: i < newCalendarList4 ? '#fff' : '#f1f2f3' }}>
                        {i < oldCalendarListFour.length
                            ? '周' + this.convertDay(Four) + '第' + j + '节'
                            : ''}
                    </td>
                    <td style={{ background: i < newCalendarList5 ? '#fff' : '#f1f2f3' }}>
                        {i < oldCalendarListFive.length
                            ? '周' + this.convertDay(Five) + '第' + j + '节'
                            : ''}
                    </td>
                    <td style={{ background: i < newCalendarList6 ? '#fff' : '#f1f2f3' }}>
                        {i < oldCalendarListSix.length
                            ? '周' + this.convertDay(Six) + '第' + j + '节'
                            : ''}
                    </td>
                    <td style={{ background: i < newCalendarList7 ? '#fff' : '#f1f2f3' }}>
                        {i < oldCalendarListSeven.length
                            ? '周' + this.convertDay(Seven) + '第' + j + '节'
                            : ''}
                    </td>
                    {/* <td style={{background:i<newCalendarList7?'#fff':'#f1f2f3'}}>{i<oldCalendarListSeven.length-1?'周'+p+' 第'+j+'节':''}</td> */}
                </tr>
            );
        }
        return cols;
    };

    onReveal = () => {
        this.setState({
            reveal: true,
        });
    };
    upReveal = () => {
        this.setState({
            reveal: false,
        });
    };

    onGroup = (value) => {
        this.setState({
            onGroup: value,
        });
    };
    changeOldWeekDay = (value) => {
        this.setState({
            oldWeekDay: value,
        });
    };
    changeNewWeekDay = (value) => {
        this.setState({
            newWeekDay: value,
        });
    };

    onRemove = () => {
        const { onGroup } = this.state;
        let OldDay1;
        onGroup.map((item) => {
            switch (item) {
                case 1:
                    OldDay1 = 'oldCalendarListOne';
                    break;
                case 2:
                    OldDay1 = 'oldCalendarListTwo';
                    break;
                case 3:
                    OldDay1 = 'oldCalendarListThree';
                    break;
                case 4:
                    OldDay1 = 'oldCalendarListFour';
                    break;
                case 5:
                    OldDay1 = 'oldCalendarListFive';
                    break;
                case 6:
                    OldDay1 = 'oldCalendarListSix';
                    break;
                case 7:
                    OldDay1 = 'oldCalendarListSeven';
                    break;
            }
            this.setState({
                [OldDay1]: [],
            });
        });
    };

    onMovement = () => {
        const {
            oldWeekDay,
            newWeekDay,
            oldCalendarListOne,
            oldCalendarListTwo,
            oldCalendarListThree,
            oldCalendarListFour,
            oldCalendarListFive,
            oldCalendarListSix,
            oldCalendarListSeven,
        } = this.state;
        let OldDay;
        let newDay;
        let OldDay1;
        let newDay1;
        switch (oldWeekDay) {
            case 1:
                (OldDay = oldCalendarListOne), (OldDay1 = 'oldCalendarListOne');
                break;
            case 2:
                (OldDay = oldCalendarListTwo), (OldDay1 = 'oldCalendarListTwo');
                break;
            case 3:
                (OldDay = oldCalendarListThree), (OldDay1 = 'oldCalendarListThree');
                break;
            case 4:
                (OldDay = oldCalendarListFour), (OldDay1 = 'oldCalendarListFour');
                break;
            case 5:
                (OldDay = oldCalendarListFive), (OldDay1 = 'oldCalendarListFive');
                break;
            case 6:
                (OldDay = oldCalendarListSix), (OldDay1 = 'oldCalendarListSix');
                break;
            case 7:
                (OldDay = oldCalendarListSeven), (OldDay1 = 'oldCalendarListSeven');
                break;
        }
        switch (newWeekDay) {
            case 1:
                (newDay = 'oldCalendarListOne'), (newDay1 = oldCalendarListOne);
                break;
            case 2:
                (newDay = 'oldCalendarListTwo'), (newDay1 = oldCalendarListTwo);
                break;
            case 3:
                (newDay = 'oldCalendarListThree'), (newDay1 = oldCalendarListThree);
                break;
            case 4:
                (newDay = 'oldCalendarListFour'), (newDay1 = oldCalendarListFour);
                break;
            case 5:
                (newDay = 'oldCalendarListFive'), (newDay1 = oldCalendarListFive);
                break;
            case 6:
                (newDay = 'oldCalendarListSix'), (newDay1 = oldCalendarListSix);
                break;
            case 7:
                (newDay = 'oldCalendarListSeven'), (newDay1 = oldCalendarListSeven);
                break;
        }
        if (OldDay && OldDay.length !== 0) {
            if (newDay1 && newDay1.length !== 0) {
                message.info('当天有课无法移动');
            } else if (newDay) {
                this.setState({
                    [newDay]: OldDay,
                    [OldDay1]: [],
                });
            } else {
                message.info('请选择完整信息');
            }
        } else {
            message.info('当天无课无法移动');
        }
    };
    handleOk1 = () => {
        const { dispatch, currentVersion, getVersionList, changeDifference } = this.props;
        const newCalendarList = changeDifference && changeDifference.newCalendarList;
        const oldCalendarListr = changeDifference && changeDifference.oldCalendarList;
        const {
            oldScheduleId,
            newScheduleId,
            oldCalendarListOne,
            oldCalendarListTwo,
            oldCalendarListThree,
            oldCalendarListFour,
            oldCalendarListFive,
            oldCalendarListSix,
            oldCalendarListSeven,
            twoOk,
        } = this.state;
        let changeDayModels = [];
        let jishu = [];
        let open = false;
        this.setState({
            buttonTrue: false,
        });
        if (oldCalendarListOne) {
            const oop =
                oldCalendarListOne &&
                oldCalendarListOne.find((item) => item.weekDay) &&
                oldCalendarListOne.find((item) => item.weekDay).weekDay;
            const oldCalendarListe =
                oldCalendarListr && oldCalendarListr.find((item) => item.weekDay === oop)
                    ? oldCalendarListr.find((item) => item.weekDay === oop).calendarDetailModels
                    : [];
            const newCalendarListe =
                newCalendarList && newCalendarList.find((item) => item.weekDay === 1)
                    ? newCalendarList.find((item) => item.weekDay === 1).calendarDetailModels
                    : [];
            jishu.push(oop);
            // oldCalendarList1.pop();
            const changeDayModel = {
                oldCalendarDay: {
                    baseScheduleId: oldScheduleId,
                    weekDay: oop,
                    calendarDetailModels: oldCalendarListe,
                },
                newCalendarDay: {
                    baseScheduleId: newScheduleId,
                    weekDay: 1,
                    calendarDetailModels: newCalendarListe,
                },
            };
            if (oldCalendarListe.length !== 0) {
                if (newCalendarListe.length == 0) {
                    open = true;
                }
                changeDayModels.push(changeDayModel);
            }
        }
        if (oldCalendarListTwo) {
            const oop =
                oldCalendarListTwo &&
                oldCalendarListTwo.find((item) => item.weekDay) &&
                oldCalendarListTwo.find((item) => item.weekDay).weekDay;
            const oldCalendarListe =
                oldCalendarListr && oldCalendarListr.find((item) => item.weekDay === oop)
                    ? oldCalendarListr.find((item) => item.weekDay === oop).calendarDetailModels
                    : [];
            const newCalendarListe =
                newCalendarList && newCalendarList.find((item) => item.weekDay === 2)
                    ? newCalendarList.find((item) => item.weekDay === 2).calendarDetailModels
                    : [];
            // oldCalendarList1.pop();
            jishu.push(oop);
            const changeDayModel = {
                oldCalendarDay: {
                    baseScheduleId: oldScheduleId,
                    weekDay: oop,
                    calendarDetailModels: oldCalendarListe,
                },
                newCalendarDay: {
                    baseScheduleId: newScheduleId,
                    weekDay: 2,
                    calendarDetailModels: newCalendarListe,
                },
            };
            if (oldCalendarListe.length !== 0) {
                if (newCalendarListe.length == 0) {
                    open = true;
                }
                changeDayModels.push(changeDayModel);
            }
        }
        if (oldCalendarListThree) {
            const oop =
                oldCalendarListThree &&
                oldCalendarListThree.find((item) => item.weekDay) &&
                oldCalendarListThree.find((item) => item.weekDay).weekDay;
            const oldCalendarListe =
                oldCalendarListr && oldCalendarListr.find((item) => item.weekDay === oop)
                    ? oldCalendarListr.find((item) => item.weekDay === oop).calendarDetailModels
                    : [];
            const newCalendarListe =
                newCalendarList && newCalendarList.find((item) => item.weekDay === 3)
                    ? newCalendarList.find((item) => item.weekDay === 3).calendarDetailModels
                    : [];
            // oldCalendarListe.pop();
            jishu.push(oop);
            const changeDayModel = {
                oldCalendarDay: {
                    baseScheduleId: oldScheduleId,
                    weekDay: oop,
                    calendarDetailModels: oldCalendarListe,
                },
                newCalendarDay: {
                    baseScheduleId: newScheduleId,
                    weekDay: 3,
                    calendarDetailModels: newCalendarListe,
                },
            };
            if (oldCalendarListe.length !== 0) {
                if (newCalendarListe.length == 0) {
                    open = true;
                }
                changeDayModels.push(changeDayModel);
            }
        }
        if (oldCalendarListFour) {
            const oop =
                oldCalendarListFour &&
                oldCalendarListFour.find((item) => item.weekDay) &&
                oldCalendarListFour.find((item) => item.weekDay).weekDay;
            const oldCalendarListe =
                oldCalendarListr && oldCalendarListr.find((item) => item.weekDay === oop)
                    ? oldCalendarListr.find((item) => item.weekDay === oop).calendarDetailModels
                    : [];
            const newCalendarListe =
                newCalendarList && newCalendarList.find((item) => item.weekDay === 4)
                    ? newCalendarList.find((item) => item.weekDay === 4).calendarDetailModels
                    : [];
            // oldCalendarListe.pop();
            jishu.push(oop);
            const changeDayModel = {
                oldCalendarDay: {
                    baseScheduleId: oldScheduleId,
                    weekDay: oop,
                    calendarDetailModels: oldCalendarListe,
                },
                newCalendarDay: {
                    baseScheduleId: newScheduleId,
                    weekDay: 4,
                    calendarDetailModels: newCalendarListe,
                },
            };
            if (oldCalendarListe.length !== 0) {
                if (newCalendarListe.length == 0) {
                    open = true;
                }
                changeDayModels.push(changeDayModel);
            }
        }
        if (oldCalendarListFive) {
            const oop =
                oldCalendarListFive &&
                oldCalendarListFive.find((item) => item.weekDay) &&
                oldCalendarListFive.find((item) => item.weekDay).weekDay;
            const oldCalendarListe =
                oldCalendarListr && oldCalendarListr.find((item) => item.weekDay === oop)
                    ? oldCalendarListr.find((item) => item.weekDay === oop).calendarDetailModels
                    : [];
            const newCalendarListe =
                newCalendarList && newCalendarList.find((item) => item.weekDay === 5)
                    ? newCalendarList.find((item) => item.weekDay === 5).calendarDetailModels
                    : [];
            // oldCalendarListe.pop();
            jishu.push(oop);
            const changeDayModel = {
                oldCalendarDay: {
                    baseScheduleId: oldScheduleId,
                    weekDay: oop,
                    calendarDetailModels: oldCalendarListe,
                },
                newCalendarDay: {
                    baseScheduleId: newScheduleId,
                    weekDay: 5,
                    calendarDetailModels: newCalendarListe,
                },
            };
            if (oldCalendarListe.length !== 0) {
                if (newCalendarListe.length == 0) {
                    open = true;
                }
                changeDayModels.push(changeDayModel);
            }
        }
        if (oldCalendarListSix) {
            const oop =
                oldCalendarListSix &&
                oldCalendarListSix.find((item) => item.weekDay) &&
                oldCalendarListSix.find((item) => item.weekDay).weekDay;
            const oldCalendarListe =
                oldCalendarListr && oldCalendarListr.find((item) => item.weekDay === oop)
                    ? oldCalendarListr.find((item) => item.weekDay === oop).calendarDetailModels
                    : [];
            const newCalendarListe =
                newCalendarList && newCalendarList.find((item) => item.weekDay === 6)
                    ? newCalendarList.find((item) => item.weekDay === 6).calendarDetailModels
                    : [];
            // oldCalendarListe.pop();
            jishu.push(oop);
            const changeDayModel = {
                oldCalendarDay: {
                    baseScheduleId: oldScheduleId,
                    weekDay: oop,
                    calendarDetailModels: oldCalendarListe,
                },
                newCalendarDay: {
                    baseScheduleId: newScheduleId,
                    weekDay: 6,
                    calendarDetailModels: newCalendarListe,
                },
            };
            if (oldCalendarListe.length !== 0) {
                if (newCalendarListe.length == 0) {
                    open = true;
                }
                changeDayModels.push(changeDayModel);
            }
        }
        if (oldCalendarListSeven) {
            const oop =
                oldCalendarListSeven &&
                oldCalendarListSeven.find((item) => item.weekDay) &&
                oldCalendarListSeven.find((item) => item.weekDay).weekDay;
            const oldCalendarListe =
                oldCalendarListr && oldCalendarListr.find((item) => item.weekDay === oop)
                    ? oldCalendarListr.find((item) => item.weekDay === oop).calendarDetailModels
                    : [];
            const newCalendarListe =
                newCalendarList && newCalendarList.find((item) => item.weekDay === 7)
                    ? newCalendarList.find((item) => item.weekDay === 7).calendarDetailModels
                    : [];
            // oldCalendarListe.pop();
            jishu.push(oop);
            const changeDayModel = {
                oldCalendarDay: {
                    baseScheduleId: oldScheduleId,
                    weekDay: oop,
                    calendarDetailModels: oldCalendarListe,
                },
                newCalendarDay: {
                    baseScheduleId: newScheduleId,
                    weekDay: 7,
                    calendarDetailModels: newCalendarListe,
                },
            };
            if (oldCalendarListe.length !== 0) {
                if (newCalendarListe.length == 0) {
                    open = true;
                }
                changeDayModels.push(changeDayModel);
            }
        }
        if (!oldScheduleId || !newScheduleId) {
            message.info('请先完善版本信息再更换');
            return false;
        }
        //删除数据补回
        let shuji = [];
        changeDifference.oldCalendarList.find((item) => {
            shuji.push(item.weekDay);
        });
        var d = shuji.filter(function (v) {
            return jishu.indexOf(v) == -1;
        });
        d.map((value) => {
            const oldCalendarListe =
                oldCalendarListr && oldCalendarListr.find((item) => item.weekDay === value)
                    ? oldCalendarListr.find((item) => item.weekDay === value).calendarDetailModels
                    : [];
            const changeDayModel = {
                oldCalendarDay: {
                    baseScheduleId: oldScheduleId,
                    weekDay: value,
                    calendarDetailModels: oldCalendarListe,
                },
                newCalendarDay: {},
            };
            changeDayModels.push(changeDayModel);
        });
        console.log('changeDayModels', changeDayModels);
        if (twoOk) {
            this.setState({
                opens: true,
                buttonTrue: true,
            });
        } else {
            dispatch({
                type: 'time/changeDay',
                payload: {
                    oldScheduleId,
                    newScheduleId,
                    versionId: currentVersion,
                    changeDayModels: changeDayModels,
                },
                onSuccess: () => {
                    this.handleCancel();
                    this.setState({
                        value: 1,
                        changeOldScheduleName: undefined,
                        changeNewScheduleName: undefined,
                    });
                    typeof getVersionList == 'function' &&
                        getVersionList.call(
                            this,
                            '',
                            this.props.lessonViewCustomValue,
                            this.props.lessonViewCustomLabel
                        );
                },
            }).then(() => {
                this.setState({
                    buttonTrue: true,
                });
            });
        }
    };

    handleCancel1 = () => {
        this.setState({
            opens: false,
        });
    };

    handleO = () => {
        this.setState(
            {
                twoOk: false,
            },
            () => {
                this.handleOk1();
            }
        );
    };

    changeTab = (e) => {
        this.setState({
            tabIndex: e.target.value,
        });
    };

    //从作息名称中截取年级
    dealName = (string) => {
        let tempIndex = string && string.indexOf('20');
        let tempString = string.substring(0, tempIndex - 1);
        let returnString = '';
        if (tempString.includes(',')) {
            returnString = tempString.replaceAll(',', '');
            return returnString;
        } else {
            return tempString;
        }
    };

    changeScheduleList = (value, index) => {
        let tempScheduleList = JSON.parse(JSON.stringify(this.state.scheduleIdList));
        tempScheduleList[index] = {
            ...tempScheduleList[index],
            newScheduleId: value,
        };
        this.setState({
            scheduleIdList: tempScheduleList,
        });
    };

    addRow = () => {
        let tempSplitData = JSON.parse(JSON.stringify(this.state.splitData));
        // tempSplitData = [...tempSplitData, tempSplitData[tempSplitData.length - 1]];
        tempSplitData = [
            ...tempSplitData,
            {
                currentModel: {
                    id: undefined,
                    gradeIdList: [],
                },
                mappingSchedules: [],
                newScheduleId: undefined,
            },
        ];
        this.setState({
            splitData: tempSplitData,
        });
    };

    delRow = (index) => {
        let tempSplitData = JSON.parse(JSON.stringify(this.state.splitData));
        let tempLen = tempSplitData && tempSplitData.length;
        if (tempLen == 1) {
            message.warning('至少保留一项内容！');
            return false;
        }
        tempSplitData.splice(index, 1);
        this.setState({
            splitData: tempSplitData,
        });
    };

    closeCheck = () => {
        this.setState({ checkVisible: false });
    };

    closeErrModal = () => {
        this.setState({ changeErrVisible: false });
    };

    scheduleChange = () => {
        const { dispatch, currentVersion, getVersionList } = this.props;
        let { scheduleIdList, tabIndex, splitData } = this.state;
        let payload = {};
        if (tabIndex == 1) {
            payload = {
                versionId: currentVersion,
                changeType: 1,
                versionScheduleChangeDTOList: scheduleIdList,
            };
            this.setState({
                changging: true,
            });
        } else if (tabIndex == 2) {
            this.setState({
                loading: true,
            });
            let tempPayload = [];
            splitData.forEach((item) => {
                tempPayload.push({
                    oldScheduleId: item.currentModel.id,
                    newScheduleId: item.newScheduleId,
                    gradeIdList: item.currentModel.gradeIdList,
                });
            });
            payload = {
                versionId: currentVersion,
                changeType: 2,
                versionScheduleChangeDTOList: tempPayload,
            };
        }
        dispatch({
            type: 'time/versionScheduleChange',
            payload,
            onSuccess: () => {
                this.props.closeChangeModal();
                typeof getVersionList == 'function' &&
                    getVersionList.call(
                        this,
                        '',
                        this.props.lessonViewCustomValue,
                        this.props.lessonViewCustomLabel
                    );
                this.setState({
                    checkVisible: false,
                });
            },
        }).then(() => {
            let { versionScheduleChange } = this.props;
            this.setState({
                loading: false,
                changging: false,
            });
            if (!versionScheduleChange.status) {
                this.setState({
                    changeErrVisible: true,
                });
            }
        });
    };

    changeGradeList = (value, index) => {
        const { dispatch, currentVersion } = this.props;
        let tempSplitData = JSON.parse(JSON.stringify(this.state.splitData));
        tempSplitData[index].currentModel = {
            ...tempSplitData[index].currentModel,
            gradeIdList: value,
        };

        // dispatch({
        //     type: 'time/getScheduleList',
        //     payload: {
        //         versionId: currentVersion,
        //         gradeIdString: value && value.join(),
        //     },
        // }).then(() => {
        //     const { getScheduleList } = this.props;
        //     tempSplitData[index].mappingSchedules = getScheduleList;

        // });
        this.setState({
            splitData: tempSplitData,
        });
    };

    changeUpdateSchedule = (value, index) => {
        let tempSplitData = JSON.parse(JSON.stringify(this.state.splitData));
        tempSplitData[index] = {
            ...tempSplitData[index],
            newScheduleId: value,
        };
        this.setState({
            splitData: tempSplitData,
        });
    };

    dealGrade = (value) => {
        const { customGradeList } = this.props;
        if (!value) {
            return '';
        }
        let tempGradeStr = '';
        customGradeList.forEach((item, index) => {
            if (item.id == value[0]) {
                tempGradeStr = item.orgEname;
            }
        });
        return tempGradeStr;
    };

    render() {
        const {
            changsScheduleModal,
            changeSchedulelist,
            customGradeList,
            changeResult,
            currentVersion,
            versionScheduleChange,
            getScheduleList,
        } = this.props;
        const {
            newScheduleId,
            mappingSchedules,
            changeOldScheduleName,
            changeNewScheduleName,
            listAlert,
            reveal,
            checkVisible,
            splitData,
            tabIndex,
            changeErrVisible,
            loading,
            changging,
        } = this.state;

        timeLine = [
            '第一节',
            '第二节',
            '第三节',
            '第四节',
            '第五节',
            '第六节',
            '第七节',
            '第八节',
            '第九节',
            '第十节',
        ];
        weekMap = ['周一', '周二', '周三', '周四', '周五', '周六', '周天'];

        const columns = [
            {
                title: '年级',
                dataIndex: '',
                key: 'grade',
                width: '17%',
                align: 'center',
                render: (text, record, index) => {
                    // return <span>{this.dealName(record.currentModel.name)}</span>;
                    return <span>{record.currentModel.gradeName}</span>;
                },
            },
            {
                title: '原作息',
                dataIndex: 'oldSchedule',
                key: 'oldSchedule',
                width: '30%',
                align: 'center',
                render: (text, record, index) => {
                    return <span>{record.currentModel.name}</span>;
                },
            },
            {
                title: '调整后作息',
                dataIndex: 'newSchedule',
                key: 'newSchedule',
                width: '53%',
                align: 'center',
                render: (text, record, index) => {
                    return (
                        <Select
                            placeholder="请选择新作息"
                            style={{ width: 450 }}
                            onChange={(value) => this.changeScheduleList(value, index)}
                        >
                            {record?.mappingSchedules &&
                                record.mappingSchedules.length &&
                                record.mappingSchedules.map((item, index) => {
                                    return (
                                        <Option key={item.id} value={item.id}>
                                            {item.name}
                                        </Option>
                                    );
                                })}
                        </Select>
                    );
                },
            },
        ];

        const splitColumns = [
            {
                title: '年级',
                dataIndex: 'gradeIdList',
                key: 'gradeIdList',
                // width: '50%',
                align: 'center',
                render: (text, record, index) => {
                    return (
                        <Select
                            style={{ width: 270 }}
                            placeholder="请选择年级"
                            mode="multiple"
                            defaultValue={record.currentModel.gradeIdList}
                            onChange={(value) => this.changeGradeList(value, index)}
                        >
                            {customGradeList &&
                                customGradeList.length &&
                                customGradeList.map((item) => {
                                    return (
                                        <Option key={item.id} value={item.id}>
                                            {item.enName}
                                        </Option>
                                    );
                                })}
                        </Select>
                    );
                },
            },
            {
                title: '调整后作息',
                dataIndex: 'Adjustment',
                key: 'Adjustment',
                align: 'center',
                width: '50%',
                render: (text, record, index) => {
                    return (
                        <Select
                            style={{ width: 450 }}
                            placeholder="请选择新作息"
                            value={record.newScheduleId}
                            onChange={(value) => this.changeUpdateSchedule(value, index)}
                        >
                            {getScheduleList &&
                                getScheduleList.length &&
                                getScheduleList.map((item, index) => {
                                    return (
                                        <Option key={item.id} value={item.id}>
                                            {item.name}
                                        </Option>
                                    );
                                })}
                        </Select>
                    );
                },
            },
            {
                title: '',
                dataIndex: '',
                key: '',
                render: (text, record, index) => {
                    if (splitData && index == splitData.length - 1) {
                        return (
                            <span>
                                <a style={{ margin: '0 10px' }}>
                                    <Icon type="plus-circle" onClick={this.addRow} />
                                </a>
                                <a style={{ margin: '0 10px' }}>
                                    <Icon type="delete" onClick={() => this.delRow(index)} />
                                </a>
                            </span>
                        );
                    }
                },
            },
        ];
        // const currentModel =changeSchedulelist[0] && changeSchedulelist[0].currentModel;
        return (
            <Modal
                visible={changsScheduleModal}
                title="更换作息表"
                onCancel={this.handleCancel}
                footer={null}
                width="916px"
                className={styles.changeSchedule}
            >
                <Spin spinning={loading}>
                    <Radio.Group
                        onChange={this.changeTab}
                        value={tabIndex} /* value={this.state.value} */
                    >
                        <Radio value={1}>作息年级不变</Radio>
                        <Radio value={2}>作息年级需要拆分或合并</Radio>
                    </Radio.Group>
                    {tabIndex == 1 ? (
                        <Table
                            className={styles.tableStyle}
                            columns={columns}
                            dataSource={changeSchedulelist}
                            pagination={false}
                        />
                    ) : tabIndex == 2 ? (
                        <Table
                            className={styles.tableStyle}
                            columns={splitColumns}
                            dataSource={splitData}
                            pagination={false}
                        ></Table>
                    ) : (
                        ''
                    )}
                    <div>
                        <Button
                            style={{ margin: '10px 35px 0 70%' }}
                            onClick={this.props.closeChangeModal}
                        >
                            取消
                        </Button>
                        <Button type="primary" onClick={this.saveGradeToChange}>
                            确定
                        </Button>
                    </div>
                </Spin>
                <Modal
                    title=""
                    visible={this.state.opens}
                    onOk={this.handleO}
                    onCancel={this.handleCancel1}
                    closable={false}
                    width="300px"
                >
                    <div>
                        作息表更换后无法取消，且显示在灰色位置或者已被清空的课节将转为待排，确认更换吗？
                    </div>
                </Modal>
                {checkVisible && (
                    <Modal
                        footer={null}
                        closable={false}
                        visible={checkVisible}
                        className={styles.checkStyle}
                    >
                        <Spin spinning={changging}>
                            {changeResult.status && changeResult.content ? (
                                changeResult.content.map((item, index) => {
                                    return <div>{item}</div>;
                                })
                            ) : !changeResult.status ? (
                                <span>{changeResult.content}</span>
                            ) : null}

                            {changeResult.status ? (
                                <div className={styles.doubleStyle}>
                                    <Button
                                        onClick={this.closeCheck}
                                        style={{ marginRight: '10px' }}
                                    >
                                        取消
                                    </Button>
                                    <Button type="primary" onClick={this.scheduleChange}>
                                        确定
                                    </Button>
                                </div>
                            ) : (
                                <div className={styles.singleStyle}>
                                    <Button type="primary" onClick={this.closeCheck}>
                                        我知道了
                                    </Button>
                                </div>
                            )}
                        </Spin>
                    </Modal>
                )}
                {changeErrVisible && (
                    <Modal
                        footer={null}
                        closable={false}
                        visible={changeErrVisible}
                        className={styles.checkStyle}
                    >
                        <span>{versionScheduleChange.message}</span>
                        <div className={styles.singleStyle}>
                            <Button type="primary" onClick={this.closeErrModal}>
                                我知道了
                            </Button>
                        </div>
                    </Modal>
                )}
            </Modal>
        );
    }
}
