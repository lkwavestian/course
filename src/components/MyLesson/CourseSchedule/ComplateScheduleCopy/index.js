import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon, Modal, Checkbox, Table, Row, Col, Drawer } from 'antd';
import styles from './index.less';
import icon from '../../../../icon.less';
import { intoChinese, getCourseColor, fixedZero } from '../../../../utils/utils';
import { trans } from '../../../../utils/i18n';

var weekMap = [];
var timeLine = [];
// const weekList = [
//     trans('global.sunday', '周日'),
//     trans('global.monday', '周一'),
//     trans('global.tuesday', '周二'),
//     trans('global.wednesday', '周三'),
//     trans('global.thursday','周四'),
//     trans('global.friday', '周五'),
//     trans('global.saturday', '周六')
// ];
const weekList = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

const timeLineNumber = [
    0, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200,
];

var language;

@connect((state) => ({
    detailInfo: state.studentDetail.detailScheduleInfo,
}))
export default class MobileWeekTable extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            ifWeekend: true,
            dataV: false,
            weekMapArr: [],
            drawerVisible: false, //详情展示

            detailStartTime: 0,
            detailEndTime: 0,
            type: '', //日程类型
            isAllday: false, //是否是全天
            detailDate: '', //详情中的时间
            //展示详情
            showStudentIcon: true,
            showTeacherIcon: true,
            showRemarkIcon: true,
            showBxIcon: true,
            showBxrIcon: true,
            showKxIcon: true,
            showKxrIcon: true,
            showMainTeacher: true,
            showAssistant: true,
        };
    }

    componentDidMount() {
        this.getComplateSchedule();
    }

    // 查看完整课表
    getComplateSchedule = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'studentDetail/getComplateSchedule',
        }).then(() => {
            console.log(this.props.detailInfo, 'detailScheduleInfo=======');
        });
    };

    renderCol(number, map, currentTime) {
        let cols = [],
            curD = (currentTime ? new Date(currentTime) : new Date()).getDay(),
            colSpan = number > 5 ? '3' : '4',
            colClass = arguments[3] || '';
        curD == 0 && (curD = 7);

        for (let i = 0; i < number; i++) {
            cols.push(
                <Col key={i} className={styles.spanBox} span={colSpan}>
                    <div className={colClass + ' ' + (i % 2 == 0 && styles.bgCol)}>{map[i]}</div>
                </Col>
            );
        }
        return cols;
    }

    minuteDifference(startTime, endTime) {
        let s = startTime.split(':'),
            e = endTime.split(':');
        return (e[0] - s[0]) * 60 + parseInt(e[1] - s[1], 10);
    }

    //处理时间
    handleTime(val) {
        let time = new Date(val);
        let hour = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
        let minute = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
        return hour + ':' + minute;
    }

    renderColEl(el, timeLong, calendarLength) {
        let startTime = this.handleTime(el.startTime);
        let endTime = this.handleTime(el.endTime);
        let leftBarColor;
        switch (el.scheduleType) {
            case 1:
                //作息
                leftBarColor = '#ddd';
                break;
            case 2:
                //课程
                leftBarColor = getCourseColor(el.name, 1);
                break;
            case 3:
                //活动
                leftBarColor = '#6ea659';
                break;
            case 4:
                //行事历
                leftBarColor = '#6D14F7';
                break;
        }
        let showHour = timeLong < 30 || calendarLength > 1 ? false : true;
        return (
            <span className={styles.colMain}>
                <em className={styles.leftBarStyle} style={{ background: leftBarColor }}></em>
                <em className={styles.courseName}>{language ? el.name : el.eName}</em>
                {showHour && (
                    <em className={styles.timeStyle}>
                        {startTime} - {endTime}
                    </em>
                )}
            </span>
        );
    }

    //展示详情
    floatClick(v, e) {
        e.preventDefault(); //避免点击穿透
        const { dispatch } = this.props;
        let url = '';
        if (v.scheduleType == '4') {
            //公共日程详情
            url = 'MobileDay/checkPublicDetail';
        } else {
            //普通日程详情
            url = 'MobileDay/getCalendarDetail';
        }
        dispatch({
            type: url,
            payload: {
                templateId: v.templateId,
                scheduleType: v.scheduleType,
            },
        }).then(() => {
            this.setState({
                drawerVisible: true,
                detailStartTime: v.startTime,
                detailEndTime: v.endTime,
                type: v.scheduleType,
                isAllday: v.allDay,
                detailDate: v.cdate,
            });
        });
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
                                let backStyle, backColor;
                                //1，作息表 2 课程 3活动 4行事历
                                if (v.scheduleType == '1') {
                                    backStyle = styles.relaxsll;
                                    backColor = '#eee';
                                } else if (v.scheduleType == '2') {
                                    backStyle = styles.courseEl;
                                    backColor = getCourseColor(v.name, 2);
                                } else if (v.scheduleType == '3') {
                                    backStyle = styles.activeEl;
                                    backColor = '#f2f6f0';
                                } else if (v.scheduleType == '4') {
                                    backStyle = styles.floatEl;
                                    backColor = 'rgba(109,20,247,0.04)';
                                }
                                elment.push(
                                    <span
                                        key={l}
                                        onClick={this.floatClick.bind(this, v)}
                                        style={{
                                            width: (1 / allDay.length) * 100 + '%',
                                            height: '100%',
                                            left: l * (1 / allDay.length) * 100 + '%',
                                            background: backColor,
                                        }}
                                        className={backStyle}
                                    >
                                        {this.renderColEl(v, 60, allDay.length)}
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
                                let backStyle, backColor;
                                //1，作息表 2 课程 3活动 4行事历
                                if (v.scheduleType == '1') {
                                    backStyle = styles.relaxsll;
                                    backColor = '#eee';
                                } else if (v.scheduleType == '2') {
                                    backStyle = styles.courseEl;
                                    backColor = getCourseColor(v.name, 2);
                                } else if (v.scheduleType == '3') {
                                    backStyle = styles.activeEl;
                                    backColor = '#f2f6f0';
                                } else if (v.scheduleType == '4') {
                                    backStyle = styles.floatEl;
                                    backColor = 'rgba(109,20,247,0.04)';
                                }
                                elment.push(
                                    <span
                                        key={l}
                                        onClick={this.floatClick.bind(this, v)}
                                        style={{
                                            top: ((parseInt(startTime, 10) - el) * 10) / 6 + '%',
                                            width: (1 / item.length) * 100 + '%',
                                            height:
                                                (this.minuteDifference(newStart, newEnd) * 10) / 6 +
                                                '%',
                                            left: l * (1 / item.length) * 100 + '%',
                                            background: backColor,
                                        }}
                                        className={backStyle}
                                    >
                                        {this.renderColEl(
                                            v,
                                            this.minuteDifference(newStart, newEnd),
                                            item.length
                                        )}
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
            newWeekMap.push(
                el + ' ' + fixedZero(elDate.getMonth() + 1) + '-' + fixedZero(elDate.getDate())
            );
        });
        return newWeekMap;
    }

    calculationCurrentLineTop(time) {
        console.log(time, 'time');
        let d = time ? new Date(time) : new Date(),
            curHours = d.getHours(),
            minutes = d.getMinutes();
        if (curHours >= 22 || curHours < 7) {
            return -1;
        }
        return 20 + (curHours - 7) * 52 + (52 * minutes) / 60;
        // return 140 + (curHours - 7) * 121 + 121*minutes/60;
    }

    //关闭抽屉
    closeDrawer = () => {
        this.setState({
            drawerVisible: false,
        });
    };

    //处理时间
    formatTime(val, type) {
        if (!val) return;
        var formatTime;
        var y = new Date(val).getFullYear(),
            currentMonth = new Date(val).getMonth() + 1,
            m = currentMonth < 10 ? '0' + currentMonth : currentMonth,
            d =
                new Date(val).getDate() > 9
                    ? new Date(val).getDate()
                    : '0' + new Date(val).getDate(),
            week = weekList[new Date(val).getDay()],
            h =
                new Date(val).getHours() > 9
                    ? new Date(val).getHours()
                    : '0' + new Date(val).getHours(),
            minute =
                new Date(val).getMinutes() > 9
                    ? new Date(val).getMinutes()
                    : '0' + new Date(val).getMinutes();
        switch (type) {
            case 1:
                formatTime = m + '.' + d + '  ' + week;
                break;
            case 2:
                formatTime = h + ':' + minute;
                break;
            case 3:
                formatTime = m + '.' + d;
        }
        return formatTime;
    }

    //处理时长
    timeLong(start, end) {
        var startStr = new Date(start);
        var endStr = new Date(end);
        let long = parseInt((endStr - startStr) / 1000 / 60, 10);
        return long;
    }

    //操作展示详情
    operUpdown(type) {
        if (type == 'student') {
            this.setState({
                showStudentIcon: !this.state.showStudentIcon,
            });
        } else if (type == 'teacher') {
            this.setState({
                showTeacherIcon: !this.state.showTeacherIcon,
            });
        } else if (type == 'remark') {
            this.setState({
                showRemarkIcon: !this.state.showRemarkIcon,
            });
        } else if (type == 'bixuan') {
            this.setState({
                showBxIcon: !this.state.showBxIcon,
            });
        } else if (type == 'bixuanr') {
            this.setState({
                showBxrIcon: !this.state.showBxrIcon,
            });
        } else if (type == 'kexuan') {
            this.setState({
                showKxIcon: !this.state.showKxIcon,
            });
        } else if (type == 'kexuanr') {
            this.setState({
                showKxrIcon: !this.state.showKxrIcon,
            });
        } else if (type == 'main') {
            this.setState({
                showMainTeacher: !this.state.showMainTeacher,
            });
        } else if (type == 'assistant') {
            this.setState({
                showAssistant: !this.state.showAssistant,
            });
        }
    }

    render() {
        const { dataSource, currentDate, detailInfo, publicDetailInfo } = this.props;
        const {
            ifWeekend,
            drawerVisible,
            detailStartTime,
            detailEndTime,
            type,
            isAllday,
            detailDate,
        } = this.state;
        //判断是否显示周六日
        let isShowSunday = window.localStorage.getItem('showSunday')
            ? JSON.parse(window.localStorage.getItem('showSunday'))
            : true;

        let currentDateStr = currentDate;
        let colSpan = isShowSunday ? '3' : '4',
            columns = isShowSunday ? 7 : 5,
            weekMap = isShowSunday
                ? ['周一', '周二', '周三', '周四', '周五', '周六', '周天']
                : ['周一', '周二', '周三', '周四', '周五'],
            weekTitleMap = dataSource ? this.calculationWeekDate(currentDateStr) : weekMap,
            calendarMap = this.calculationList(dataSource, weekMap),
            lineTop = this.calculationCurrentLineTop(currentDateStr),
            serverDate = currentDateStr ? new Date(currentDateStr) : new Date(),
            spaceMaps = isShowSunday ? ['', '', '', '', '', '', ''] : ['', '', '', '', ''];

        timeLine = [
            trans('global.allDay', '全天'),
            '7:00',
            '8:00',
            '9:00',
            '10:00',
            '11:00',
            '12:00',
            '13:00',
            '14:00',
            '15:00',
            '16:00',
            '17:00',
            '18:00',
            '19:00',
            '20:00',
            '21:00',
            '22:00',
        ];
        language = window.globalLange != 'en' ? true : false;
        let maxHeight = window.innerHeight - 111 + 'px';

        //日程详情
        let currentDay = this.formatTime(currentDate, 1);
        let getDetail = type == '4' ? publicDetailInfo : detailInfo;
        let detail = getDetail ? getDetail : {};

        //开始时间和结束时间，时长
        let detailStart = detailStartTime ? this.formatTime(detailStartTime, 2) : 0;
        let detailEnd = detailEndTime ? this.formatTime(detailEndTime, 2) : 0;
        let timeLong = this.timeLong(detailStartTime, detailEndTime);

        //展开详情
        let showMoreList = this.state.showStudentIcon ? styles.showHideList : styles.showMoreList;
        let showTeacherMore = this.state.showTeacherIcon
            ? styles.showHideList
            : styles.showMoreList;
        let isShowRemark = this.state.showRemarkIcon
            ? styles.showHideListRemark
            : styles.showMoreListRemark;
        let showBxListMore = this.state.showBxIcon ? styles.showHideList : styles.showMoreList;
        let showKxList = this.state.showKxIcon ? styles.showHideList : styles.showMoreList;
        let showMainList = this.state.showMainTeacher ? styles.showHideList : styles.showMoreList;
        let showAssistantList = this.state.showAssistant
            ? styles.showHideList
            : styles.showMoreList;

        //操作不同日程的详情,1作息表，2课程 3活动 4行事历
        let backStyle;
        if (type == '2') {
            backStyle = styles.courseEl;
        } else if (type == '3') {
            backStyle = styles.activeEl;
        } else if (type == '4') {
            backStyle = styles.stylesll;
        } else if (type == '1') {
            backStyle = styles.relaxsll;
        }

        //判断显示学生和老师，还是显示必选和可选
        let canShow = type != '4' ? true : false;
        //必选收缩icon
        let isShowNeceIcon =
            detail &&
            detail.departmentNecessaryModel &&
            detail.departmentNecessaryModel.choosedDepartmentList &&
            detail.departmentNecessaryModel.choosedDepartmentList.length == 0 &&
            detail &&
            detail.userNecessaryModel &&
            detail.userNecessaryModel.choosedTeacherList &&
            detail.userNecessaryModel.choosedTeacherList.length == 0
                ? false
                : true;
        //可选收缩icon
        let isShowChooseIcon =
            detail &&
            detail.departmentNecessaryModel &&
            detail.departmentNecessaryModel.notChooseDepartmentList &&
            detail.departmentNecessaryModel.notChooseDepartmentList.length == 0 &&
            detail &&
            detail.userNecessaryModel &&
            detail.userNecessaryModel.notChooseTeacherList &&
            detail.userNecessaryModel.notChooseTeacherList.length == 0
                ? false
                : true;
        //学生收缩icon
        let isShowStuIcon =
            detail &&
            detail.studentGroups &&
            detail.studentGroups.length == 0 &&
            detail &&
            detail.students &&
            detail.students.length == 0
                ? false
                : true;
        //教师收缩icon
        let isShowTeaIcon =
            detail &&
            detail.departments &&
            detail.departments.length == 0 &&
            detail &&
            detail.teachers &&
            detail.teachers.length == 0
                ? false
                : true;
        //主教老师
        let isShowMain =
            detail && detail.mainTeachers && detail.mainTeachers.length == 0 ? false : true;
        //辅教老师
        let isShowAssistant =
            detail && detail.assistantTeachers && detail.assistantTeachers.length == 0
                ? false
                : true;

        //备注收缩icon
        let isShowRemarkIcon = detail && detail.remark && detail.remark.length > 0 ? true : false;
        console.log(calendarMap, '-----calendarMap----');
        return (
            <div className={styles.borderBox} style={{ height: maxHeight }} id="borderBox">
                {lineTop > -1 && (
                    <Row
                        className={styles.rowLine}
                        style={{ top: lineTop + 'px' }}
                        type="flex"
                        justify="space-between"
                    >
                        <Col className={styles.spanBox}>
                            <div className={styles.timeBox}>
                                {fixedZero(serverDate.getHours()) +
                                    ':' +
                                    fixedZero(serverDate.getMinutes())}
                            </div>
                        </Col>
                        <div className={styles.calendarContainer}>
                            {this.renderCol(columns, spaceMaps, currentDateStr)}
                        </div>
                        <div style={{ flex: 1 }}></div>
                    </Row>
                )}
                {timeLine.map((el, i) => {
                    return (
                        <Row
                            key={i}
                            type="flex"
                            justify="space-between"
                            className={styles.tableBody + ' ' + (i == 0 && styles.allDayRow)}
                        >
                            <Col className={styles.spanBox}>
                                <div className={styles.timeBox}>
                                    <span className={styles.positionBox}>{el}</span>
                                </div>
                            </Col>
                            <div className={styles.calendarContainer}>
                                {this.renderCol(
                                    columns,
                                    calendarMap ? calendarMap[i] : spaceMaps,
                                    currentDateStr,
                                    styles.timeLineBox
                                )}
                            </div>
                            <div style={{ flex: 1 }}></div>
                        </Row>
                    );
                })}
            </div>
        );
    }
}
