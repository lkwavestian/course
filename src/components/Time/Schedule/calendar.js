//日程表格
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Row, Col, Icon, Modal, message, Select } from 'antd';
import { routerRedux } from 'dva/router';
import { trans } from '../../../utils/i18n';
import { fixedZero, formatTimeSafari } from '../../../utils/utils';
import SimpleModal from '../../CommonModal/SimpleModal';
import styles from './calendar.less';
import icon from '../../../icon.less';

const { Option } = Select;
const spaceMaps = ['', '', '', '', '', '', ''];
let weekMap = [];

let timeLine = [];

// const timeLineNumber = [0,700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800,1900,2000,2100,2200];
const timeLineNumber = [
    700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200,
];
let language;

export default class CalendarTable extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            ifWeekend: true,
            visible: true,
            dataV: {},
            weekMapArr: [],
            showDeleteBtn: false,
            setDeleteController: {},
            deleteScheduleByDayModalVisible: false,
            copyScheduleByDayModalVisible: false,
            currentWeekday: '',
            sourceWeekDay: '',
            targetWeekDay: '',
            confirmLoading: false,
        };
    }

    renderCol(number, map, curentTime, style, type) {
        let cols = [],
            curD = (curentTime ? new Date(formatTimeSafari(curentTime)) : new Date()).getDay(),
            colSpan = number > 5 ? '3' : '4',
            colClass = arguments[3] || '';
        curD == 0 && (curD = 7);
        for (let i = 0; i < number; i++) {
            cols.push(
                <Col key={i} className={styles.spanBox} span={colSpan}>
                    <div
                        className={
                            colClass +
                            ' ' +
                            (curD == i + 1 && styles.currentCol) +
                            ' ' +
                            (i % 2 == 0 && styles.bgCol) +
                            ' ' +
                            (type === 'title' && styles.titleItem)
                        }
                    >
                        {map[i]}
                        {type === 'title' && (
                            <Fragment>
                                <Icon type="copy" onClick={() => this.clickToCopy(map[i], i + 1)} />
                                <Icon
                                    type="delete"
                                    onClick={() => this.clickToDelete(map[i], i + 1)}
                                />
                            </Fragment>
                        )}
                    </div>
                </Col>
            );
        }
        return cols;
    }

    //处理时间
    handleTime(val) {
        // let time = new Date(val);
        // let hour = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
        // let minute = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
        let hour = val && val.split(':')[0];
        let minute = val && val.split(':')[1];
        return hour + ':' + minute;
    }

    renderColEl(el, l) {
        const { setDeleteController } = this.state;
        let startTime = this.handleTime(el.startTime);
        let endTime = this.handleTime(el.endTime);
        return (
            <span className={styles.colMain}>
                {language ? el.name : el.eName} <br />
                {startTime} {startTime == endTime ? '' : '-'} {startTime == endTime ? '' : endTime}
                <br />
                <i
                    onClick={this.floatDelete.bind(this, el)}
                    className={icon.iconfont + ' ' + styles.deleteBtn}
                >
                    &#xe739;
                </i>
            </span>
        );
    }

    floatClick(v) {
        this.props.calendarClick && this.props.calendarClick.call(this, v);
    }
    //鼠标划入显示删除
    floatDelete(v, e) {
        e.stopPropagation();
        this.props.deleteCalendar && this.props.deleteCalendar.call(this, v);
        this.setState({
            showDeleteBtn: true,
        });
    }

    //设置删除按钮
    setDelete(v, index, isShow) {
        let obj = Object.assign({}, this.state.setDeleteController);
        obj[index] = isShow;
        this.setState({
            setDeleteController: obj,
        });
    }

    minuteDifference(startTime, endTime) {
        let s = startTime.split(':'),
            e = endTime.split(':');
        return (e[0] - s[0]) * 60 + parseInt(e[1] - s[1], 10);
    }

    /*---------处理表格数据---------*/
    //1-3.整理表格数据
    handleTableSource(arr) {
        if (arr && arr.length < 0) return;
        for (var i = 0; i < arr.length; i++) {
            arr[i] = this.sortCalshow(arr[i]);
        }
        return arr;
    }

    //1-2.对一天的数据进行处理
    sortCalshow(objArr) {
        if (objArr.length == 0) return [];
        var newObjArr = objArr.sort(this.sortByStart('startTime'));
        return newObjArr;
    }

    //1-1.根据开始时间排序
    sortByStart(attribute) {
        return function (a, b) {
            return a[attribute] - b[attribute];
        };
    }

    //1-4.处理数据，每个重复时间放到一个数组中
    //data: [[a,b,c],d,e,f]
    handleArr(arr) {
        var dataSource = [];
        var countI = [];
        for (var i = 0; i < arr.length; i++) {
            var cur = arr[i];
            var curi = arr[i + 1];
            if (countI.indexOf(i) >= 0) continue;
            var temparr = [cur];
            for (var j = 0; j < arr.length; j++) {
                if (j <= i) continue;
                var curj = arr[j];
                cur = temparr.sort(this.sortByStart('endTime'))[temparr.length - 1];
                if (cur.endTime > curj.startTime) {
                    countI.push(j);
                    temparr.push(curj);
                }
            }
            dataSource.push(temparr);
        }
        return dataSource;
    }
    //计算并渲染表格
    calculationList(weekSource, titleMap) {
        let renderData = [];

        let weekMapPre = weekSource;
        if (!weekMapPre) {
            //切换不同周，清空表格数据
            weekMapPre = [[], [], [], [], [], [], []];
        }

        //排序数据
        let weekMap = this.handleTableSource(weekMapPre);
        timeLineNumber.map((el) => {
            let lineEl = [];
            for (let i = 0; i <= 7; i++) {
                if (weekMap[i] && weekMap[i].length > 0) {
                    let a = [],
                        allDay = [],
                        w = '100%';

                    weekMap[i].map((e) => {
                        let starthour = this.handleTime(e.startTime);
                        let endhour = this.handleTime(e.endTime);
                        let startNumber = parseInt(starthour.replace(':', ''), 10),
                            endNumber = parseInt(endhour.replace(':', ''), 10);
                        startNumber = startNumber < 700 ? 700 : startNumber;
                        endNumber = endNumber > 1800 ? 1800 : endNumber;
                        if (e.allDay) {
                            allDay.push({
                                week: i,
                                cdate: titleMap && titleMap[i],
                                ...e,
                            });
                            return;
                        }

                        if (startNumber < parseInt(el, 10) + 60 && startNumber >= el) {
                            a.push({
                                week: i,
                                cdate: titleMap && titleMap[i],
                                ...e,
                            });
                        }
                    });

                    if (el == 0) {
                        if (allDay.length > 0) {
                            let elment = [];
                            allDay.map((v, l) => {
                                let backStyle;
                                //0:其他， 1:上课时间
                                if (v.type == '1') {
                                    backStyle = styles.courseEl;
                                } else {
                                    backStyle = styles.relaxsll;
                                }
                                elment.push(
                                    <span
                                        key={l}
                                        onClick={this.floatClick.bind(this, v)}
                                        onMouseOver={this.setDelete.bind(this, v, l, true)}
                                        onMouseOut={this.setDelete.bind(this, v, l, false)}
                                        style={{
                                            width: (1 / allDay.length) * 100 + '%',
                                            height: '100%',
                                            left: l * (1 / allDay.length) * 100 + '%',
                                        }}
                                        className={backStyle}
                                    >
                                        {this.renderColEl(v, l)}
                                    </span>
                                );
                            });
                            lineEl.push(<span className={styles.rendBox}>{elment}</span>);
                        } else {
                            lineEl.push('');
                        }
                        continue;
                    }

                    if (a.length > 0) {
                        let elment = [];
                        let newDay = this.handleArr(a);
                        newDay.map((item) => {
                            item.map((v, l) => {
                                let endhour = this.handleTime(v.endTime);
                                let endTime = parseInt(endhour.replace(':', ''), 10),
                                    newEnd;
                                newEnd = endhour;
                                endTime = endTime;
                                // newEnd = endTime > 1800 ? '19:00':endhour;
                                // endTime = endTime > 1800 ? 1900: endTime;
                                let starthour = this.handleTime(v.startTime);
                                let startTime = parseInt(starthour.replace(':', ''), 10),
                                    newStart;
                                newStart = startTime < 700 ? '7:00' : starthour;
                                startTime = startTime < 700 ? 700 : startTime;
                                let backStyle;
                                //1:上课时间 0：其他
                                if (v.type == '1') {
                                    backStyle = styles.courseEl;
                                } else {
                                    backStyle = styles.relaxsll;
                                }
                                elment.push(
                                    <span
                                        key={l}
                                        onClick={this.floatClick.bind(this, v)}
                                        onMouseOver={this.setDelete.bind(this, v, l, true)}
                                        onMouseOut={this.setDelete.bind(this, v, l, false)}
                                        style={{
                                            top: ((parseInt(startTime, 10) - el) * 10) / 6 + '%',
                                            width: (1 / item.length) * 100 + '%',
                                            height:
                                                (this.minuteDifference(newStart, newEnd) * 10) / 6 +
                                                '%',
                                            left: l * (1 / item.length) * 100 + '%',
                                        }}
                                        className={backStyle}
                                    >
                                        {this.renderColEl(v, l)}
                                    </span>
                                );
                            });
                        });

                        lineEl.push(<span className={styles.rendBox}>{elment}</span>);
                    } else {
                        lineEl.push('');
                    }
                } else {
                    lineEl.push('');
                }
            }
            renderData.push(lineEl);
        });
        return renderData;
    }

    calculationWeekDate(time) {
        let date = new Date(time || ''),
            day = date.getDay(),
            newWeekMap = [];

        day == 0 && (day = 7);
        weekMap.map((el, key) => {
            let elDate = new Date(time + 24 * 3600 * 1000 * (key + 1 - day));
            //只显示周几，不显示日期
            newWeekMap.push(el);
            // newWeekMap.push(el + ' ' + fixedZero(elDate.getMonth() + 1) + '-' + fixedZero(elDate.getDate()));
        });
        return newWeekMap;
    }

    calculationCurrentLineTop(time) {
        let d = time ? new Date(formatTimeSafari(time)) : new Date(),
            curHours = d.getHours(),
            minutes = d.getMinutes();
        if (curHours >= 19 || curHours < 7) {
            return -1;
        }
        return 62 + (curHours - 7) * 88 + (88 * minutes) / 60;
    }

    toggleScheduleByDayVisible = (type) => {
        const { copyScheduleByDayModalVisible, deleteScheduleByDayModalVisible } = this.state;
        if (type === 'copy') {
            this.setState({
                copyScheduleByDayModalVisible: !copyScheduleByDayModalVisible,
            });
        }
        if (type === 'delete') {
            this.setState({
                deleteScheduleByDayModalVisible: !deleteScheduleByDayModalVisible,
            });
        }
    };

    copyConfirm = () => {
        const { dispatch, dateValue, getCalendarSource } = this.props;
        const { sourceWeekDay, targetWeekDay } = this.state;
        this.setState(
            {
                confirmLoading: true,
            },
            () => {
                dispatch({
                    type: 'time/scheduleDetailWeedDayCopy',
                    payload: {
                        baseScheduleId: dateValue,
                        sourceWeekDay,
                        targetWeekDay,
                    },
                    onSuccess: () => {
                        message.success('复制成功');
                        typeof getCalendarSource === 'function' && getCalendarSource();
                        this.toggleScheduleByDayVisible('copy');
                    },
                    onError: (errorMessage) => {
                        message.error(errorMessage);
                    },
                }).then(() => {
                    this.setState({
                        confirmLoading: false,
                    });
                });
            }
        );
    };

    deleteConfirm = () => {
        const { dispatch, dateValue, getCalendarSource } = this.props;
        const { sourceWeekDay } = this.state;
        this.setState(
            {
                confirmLoading: true,
            },
            () => {
                dispatch({
                    type: 'time/scheduleDetailWeedDayDelete',
                    payload: {
                        baseScheduleId: dateValue,
                        deleteWeekDay: sourceWeekDay,
                    },
                    onSuccess: () => {
                        message.success('删除成功');
                        typeof getCalendarSource === 'function' && getCalendarSource();
                        this.toggleScheduleByDayVisible('delete');
                    },
                    onError: (errorMessage) => {
                        message.error(errorMessage);
                    },
                }).then(() => {
                    this.setState({
                        confirmLoading: false,
                    });
                });
            }
        );
    };

    clickToCopy = (currentWeekday, sourceWeekDay) => {
        this.setState(
            {
                currentWeekday,
                sourceWeekDay,
            },
            () => {
                this.toggleScheduleByDayVisible('copy');
            }
        );
    };

    clickToDelete = (currentWeekday, sourceWeekDay) => {
        this.setState(
            {
                currentWeekday,
                sourceWeekDay,
            },
            () => {
                this.toggleScheduleByDayVisible('delete');
            }
        );
    };

    selectTargetWeekDay = (value) => {
        this.setState({
            targetWeekDay: value,
        });
    };

    render() {
        const { info, dataSource, currentDate } = this.props;
        let {
            ifWeekend,
            copyScheduleByDayModalVisible,
            deleteScheduleByDayModalVisible,
            currentWeekday,
            confirmLoading,
        } = this.state;
        let currentDateStr = currentDate.getTime();
        let colSpan = ifWeekend ? '3' : '4',
            columns = ifWeekend ? 7 : 5,
            weekTitleMap = dataSource ? this.calculationWeekDate(currentDateStr) : weekMap,
            calendarMap = this.calculationList(dataSource, weekTitleMap),
            lineTop = this.calculationCurrentLineTop(currentDateStr),
            serverDate = currentDateStr ? new Date(formatTimeSafari(currentDateStr)) : new Date();
        weekMap = [
            trans('global.monday', '周一'),
            trans('global.tuesday', '周二'),
            trans('global.wednesday', '周三'),
            trans('global.thursday', '周四'),
            trans('global.friday', '周五'),
            trans('global.saturday', '周六'),
            trans('global.sunday', '周天'),
        ];

        timeLine = [
            // trans('global.allDay', '全天'),
            trans('global.am7', '上午7点'),
            trans('global.am8', '上午8点'),
            trans('global.am9', '上午9点'),
            trans('global.am10', '上午10点'),
            trans('global.am11', '上午11点'),
            trans('global.am12', '正午'),
            trans('global.pm1', '下午1点'),
            trans('global.pm2', '下午2点'),
            trans('global.pm3', '下午3点'),
            trans('global.pm4', '下午4点'),
            trans('global.pm5', '下午5点'),
            trans('global.pm6', '下午6点'),
            trans('global.pm7', '下午7点'),
            trans('global.pm8', '下午8点'),
            trans('global.pm9', '下午9点'),
            trans('global.pm10', '下午10点'),
        ];
        let timeList = [];
        let maxTime =null;
        let newTimeList = [];
        let maxTimeIndex = null;
        for (let i = 0; i < dataSource.length; i++) {
            timeList = dataSource[i]
            for (let j = 0; j < timeList.length; j++) {
                if (j === timeList.length - 1) {
                    let endTimeNum = +(timeList[j].endTime).replace(':', '');
                    newTimeList.push(endTimeNum)
                }
            }
        }
        if (newTimeList.length > 0) {
            maxTime = timeLineNumber.find(item => item > newTimeList.sort((a, b) => b - a)[0]);
            
        }
        if (maxTime) {
            maxTimeIndex = timeLineNumber.indexOf(maxTime);
        }
        if (maxTimeIndex ) {
            timeLine.splice(maxTimeIndex + 1);
        }
        language = window.globalLange != 'en' ? true : false;
        return (
            <div className={styles.borderBox}>
                {lineTop > -1 && (
                    <Row
                        className={styles.rowLine}
                        style={{ top: lineTop + 'px' }}
                        type="flex"
                        justify="space-between"
                    >
                        <Col className={styles.spanBox} span={'2'}>
                            <div className={styles.timeBox}>
                                {fixedZero(serverDate.getHours()) +
                                    ':' +
                                    fixedZero(serverDate.getMinutes())}
                            </div>
                        </Col>
                        {this.renderCol(columns, spaceMaps, currentDateStr)}
                    </Row>
                )}
                <Row className={styles.colTitle} type="flex" justify="space-between">
                    <Col className={styles.spanBox} span={'2'}>
                        <div className="gutter-box"></div>
                    </Col>
                    {this.renderCol(columns, weekTitleMap, currentDateStr, '', 'title')}
                </Row>
                {timeLine.map((el, i) => {
                    // return (<Row key={i} type="flex" justify="space-between" className={styles.tableBody + ' ' + (i == 0 && styles.allDayRow)}>
                    return (
                        <Row
                            key={i}
                            type="flex"
                            justify="space-between"
                            className={styles.tableBody}
                        >
                            <Col className={styles.spanBox} span={'2'}>
                                <div className={styles.timeBox}>
                                    <span className={styles.positionBox}>{el}</span>
                                </div>
                            </Col>
                            {this.renderCol(
                                columns,
                                calendarMap ? calendarMap[i] : spaceMaps,
                                currentDateStr,
                                styles.timeLineBox
                            )}
                        </Row>
                    );
                })}
                {copyScheduleByDayModalVisible && (
                    <SimpleModal
                        visible={copyScheduleByDayModalVisible}
                        title="按天复制作息"
                        onOk={this.copyConfirm}
                        onCancel={() => this.toggleScheduleByDayVisible('copy')}
                        confirmLoading={confirmLoading}
                        content={
                            <div className={styles.copyContent}>
                                <span>将</span>
                                <span className={styles.currentWeekday}>{currentWeekday}</span>
                                <span>的作息复制到</span>
                                <Select onChange={this.selectTargetWeekDay} style={{ width: 100 }}>
                                    <Option value={1}>周一</Option>
                                    <Option value={2}>周二</Option>
                                    <Option value={3}>周三</Option>
                                    <Option value={4}>周四</Option>
                                    <Option value={5}>周五</Option>
                                    <Option value={6}>周六</Option>
                                    <Option value={7}>周天</Option>
                                </Select>
                            </div>
                        }
                    />
                )}
                {deleteScheduleByDayModalVisible && (
                    <SimpleModal
                        visible={deleteScheduleByDayModalVisible}
                        title="按天删除作息"
                        onOk={this.deleteConfirm}
                        confirmLoading={confirmLoading}
                        onCancel={() => this.toggleScheduleByDayVisible('delete')}
                        content={
                            <div className={styles.copyContent}>
                                <span>确认将</span>
                                <span className={styles.currentWeekday}>{currentWeekday}</span>
                                <span>的作息全部删除？</span>
                            </div>
                        }
                    />
                )}
            </div>
        );
    }
}
