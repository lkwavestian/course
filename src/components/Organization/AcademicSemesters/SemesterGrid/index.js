import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import styles from './index.less';
import moment from 'moment';
import {
    Row,
    Col,
    Checkbox,
    Select,
    Input,
    Pagination,
    message,
    Dropdown,
    Menu,
    Modal,
    DatePicker,
    Popover,
} from 'antd';
import icon from '../../../../icon.less';
import { trans, locale } from '../../../../utils/i18n';
import { formatTimeSafari } from '../../../../utils/utils';

@connect((state) => ({
    errotType: state.organize.errotType,
}))
class SemesterGrid extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isShowCreat: false, //新建学期弹窗显隐
            semesterCName: '', // 新建学期中文名
            semesterEName: '', //新建学期英文名
            semesterEndTime: '', // 新建学期的结束时间
            creatSemesterStartTime: '', // 新建学期的开始时间
            schoolYearDetail: '', // 学年的详情
            isShowEdit: false, // 编辑学年弹窗显隐
            editSchoolYearCname: '', // 编辑学年--学年中文名
            editSchoolYearEname: '', // 编辑学年信息--学年中文名
            editEndTime: '', // 编辑学年信息--学年结束时间
            editSemesterCname: {}, // 编辑学年--学期中文名
            editSemesterEname: {}, // 编辑学年--学期英文名
            editSemesterEndTime: {}, // 编辑学年--学期结束时间
            editSemesterStartTime: {}, // 编辑学年--学期开始时间
            editId: '', //储存修改的id
            semesterNum: '', // 新建学期的默认中文名的数字
        };
    }
    // 格式化日期
    formatDate = (date, type) => {
        var date = new Date(formatTimeSafari(date));
        var YY = date.getFullYear() + '-';
        var MM =
            (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        var ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        if (type == 'noInfo') return YY + 7 + '-' + 11;
        if (type == 'reduce') return YY + MM + (DD - 1);
        return YY + MM + DD;
    };

    // 新建学期弹窗显示
    showCreat(detail) {
        const { schoolYearListInfo } = this.props;
        let creatSemesterStartTime = '';
        let currentEnd = '';
        let semesterNum = '';
        schoolYearListInfo &&
            schoolYearListInfo.length > 0 &&
            schoolYearListInfo.map((item) => {
                semesterNum = item.semesterOutputModels.length + 1;
                item.semesterOutputModels &&
                    item.semesterOutputModels.length > 0 &&
                    item.semesterOutputModels.map((el) => {
                        if (el.current) {
                            currentEnd = el.endTime;
                        }
                        creatSemesterStartTime = this.addADay(currentEnd);
                    });
            });
        this.setState({
            isShowCreat: true,
            creatSemesterStartTime,
            schoolYearDetail: detail,
            semesterNum,
        });
    }

    // 时间+1天 参数为时间戳
    addADay = (timeStamp) => {
        let tiem = new Date(timeStamp);
        let newTime = new Date((tiem / 1000 + 86400) * 1000);
        return newTime;
    };

    // 新建学期弹窗显示
    cancelCreat = () => {
        this.setState({
            isShowCreat: false,
        });
    };

    // 新建学期二次确认
    confirmSemester = () => {
        const { semesterEndTime, schoolYearDetail, creatSemesterStartTime } = this.state;
        console.log(schoolYearDetail, '>>>>>>>>>');
        console.log(
            Date.parse(semesterEndTime),
            Date.parse(this.formatDate(creatSemesterStartTime)),
            'semesterEndTime????'
        );
        if (Date.parse(semesterEndTime) > schoolYearDetail.endTime) {
            message.warning('学期的结束时间不能大于学年的结束时间');
            return;
        }
        if (Date.parse(semesterEndTime) < Date.parse(this.formatDate(creatSemesterStartTime))) {
            message.warning('学期的结束时间不能小于学期的开始时间');
            return;
        }

        Modal.confirm({
            title: <span className={styles.confirmText}>新建学期后将无法删除，确定继续吗？</span>,
            okText: trans('pay.confirm', '确认'),
            cancelText: trans('global.cancel', '取消'),
            onOk: this.creatSemester,
        });
    };

    // 新建学期
    creatSemester = () => {
        const { dispatch, schoolId, companyId } = this.props;
        const {
            semesterCName,
            semesterEName,
            semesterEndTime,
            creatSemesterStartTime,
            schoolYearDetail,
            semesterNum,
        } = this.state;
        this.setState({
            isShowCreat: false,
        });
        dispatch({
            type: 'organize/createSemester',
            payload: {
                name: semesterCName ? semesterCName : `第${semesterNum}学期`,
                enName: semesterEName ? semesterEName : `Semester${semesterNum}`,
                startTime: creatSemesterStartTime,
                endTime: semesterEndTime,
                // companyId,
                schoolId,
                schoolYearId: schoolYearDetail.id,
            },
            onSuccess: () => {
                this.props.getSchoolYearList();
            },
        });
    };

    // 开启学年二次确认
    startYearHandle(id) {
        Modal.confirm({
            title: (
                <span className={styles.confirmText}>
                    {trans(
                        'global.confirmText',
                        '开启学年后，在读学生将会正式升入新年级，并且当前学期进行中的分层班及选修班会结班。一旦开启无法撤回，是否确认操作？'
                    )}
                </span>
            ),
            okText: trans('pay.confirm', '确认'),
            cancelText: trans('global.cancel', '取消'),
            onOk: this.creatSchoolYear.bind(this, id),
        });
    }

    // 开启学年
    creatSchoolYear(id) {
        const { dispatch, schoolId } = this.props;
        dispatch({
            type: 'organize/startSchoolYear',
            payload: {
                schoolYearId: id,
                schoolId,
            },
            onSuccess: () => {
                this.props.getSchoolYearList();
            },
        }).then(() => {
            this.props.errotType &&
                this.props.errotType.length &&
                Modal.warning({
                    title: (
                        <span className={styles.confirmText}>以下操作还未完成，无法开启新学年</span>
                    ),
                    okText: '好的',
                    content: (
                        <span className={styles.cantCreat}>
                            {this.props.errotType && this.props.errotType.length == 2 && (
                                <span>
                                    <span className={styles.condition}>
                                        1. 完成行政班升年级设置
                                    </span>{' '}
                                    <span className={styles.toSet} onClick={this.setUpGrade}>
                                        前往设置
                                    </span>
                                    <span className={styles.condition1}>2. 最高年级学生已毕业</span>{' '}
                                    <span className={styles.toSet} onClick={this.setUpGrade}>
                                        前往设置
                                    </span>
                                </span>
                            )}
                            {this.props.errotType &&
                                this.props.errotType.length == 1 &&
                                this.props.errotType.indexOf(1819) > -1 && (
                                    <span>
                                        <span className={styles.condition}>
                                            {' '}
                                            完成行政班升年级设置
                                        </span>{' '}
                                        <span className={styles.toSet} onClick={this.setUpGrade}>
                                            前往设置
                                        </span>
                                        <br></br>
                                    </span>
                                )}
                            {this.props.errotType &&
                                this.props.errotType.length == 1 &&
                                this.props.errotType.indexOf(1820) > -1 && (
                                    <span>
                                        <span className={styles.condition}>
                                            {' '}
                                            最高年级学生已毕业
                                        </span>{' '}
                                        <span className={styles.toSet} onClick={this.setUpGrade}>
                                            前往设置
                                        </span>
                                    </span>
                                )}
                        </span>
                    ),
                    // onOk : this.creatSchoolYear.bind(this,id)
                    onOk: this.props.getSchoolYearList(),
                });
        });
    }

    // 启动学期
    startSemesterHandle(id) {
        Modal.confirm({
            title: (
                <span className={styles.confirmText}>
                    {trans(
                        'global.startSemesterTitle',
                        '开启新学期后，系统会将当前学期进行中的分层班及选修班设置为结班。一旦开启无法撤回，是否确认操作？'
                    )}
                </span>
            ),
            okText: trans('pay.confirm', '确认'),
            cancelText: trans('global.cancel', '取消'),
            onOk: this.sureForSemester.bind(this, id),
        });
    }

    sureForSemester(id) {
        const { dispatch, schoolId } = this.props;
        dispatch({
            type: 'organize/startSemester',
            payload: {
                semesterId: id,
                schoolId,
            },
            onSuccess: () => {
                this.props.getSchoolYearList();
            },
        });
    }

    // 设置新建学期的中文名
    changeSemesterCName = (e) => {
        this.setState({
            semesterCName: e.target.value,
        });
    };

    // 设置新建学期的英文名
    changeSemesterEName = (e) => {
        this.setState({
            semesterEName: e.target.value,
        });
    };

    //
    changeEnd = (date, dateString) => {
        this.setState({
            semesterEndTime: dateString,
        });
    };

    editSchoolYear(detail) {
        this.setState(
            {
                isShowEdit: true,
                schoolYearDetail: detail,
                editSemesterCname: this.formatInitialValue(detail, 'cName'),
                editSemesterEname: this.formatInitialValue(detail, 'eName'),
                editSemesterStartTime: this.formatInitialValue(detail, 'startTime'),
                editSemesterEndTime: this.formatInitialValue(detail, 'endTime'),
            },
            () => {}
        );
    }

    formatInitialValue(detail, type) {
        let obj = {};
        detail.semesterOutputModels &&
            detail.semesterOutputModels.map((item, index) => {
                let name = '';
                if (type == 'cName') {
                    name = item.name;
                } else if (type == 'eName') {
                    name = item.ename;
                } else if (type == 'startTime') {
                    name = this.formatDate(item.startTime);
                } else if (type == 'endTime') {
                    name = this.formatDate(item.endTime);
                }

                obj[`${item.id}`] = name;
            });
        return obj;
    }
    cancelEdit = () => {
        this.setState({
            isShowEdit: false,
        });
    };
    // 编辑学年信息--学年中文名
    editAdemicCname = (e) => {
        this.setState({
            editSchoolYearCname: e.target.value,
        });
    };

    // 编辑学年信息--学年英文名
    editAdemicEname = (e) => {
        this.setState({
            editSchoolYearEname: e.target.value,
        });
    };

    // 编辑学年信息--学年结束时间
    changeEditDateEnd = (date, dateString) => {
        this.setState({
            editEndTime: dateString,
        });
    };

    // 编辑学年--学期中文名
    editSemesterCh(id, e) {
        let editSemesterCname = JSON.parse(JSON.stringify(this.state.editSemesterCname));
        editSemesterCname[`${id}`] = e.target.value;
        this.setState({
            editSemesterCname: editSemesterCname,
        });
    }

    // 编辑学年--学期英文名
    editSemesterEn(id, e) {
        let editSemesterEname = JSON.parse(JSON.stringify(this.state.editSemesterEname));
        editSemesterEname[`${id}`] = e.target.value;
        this.setState({
            editSemesterEname,
        });
    }

    // 编辑学年--学期结束时间
    endSemesterEdit(index, id, date, dateString) {
        const { schoolYearDetail } = this.state;
        let afterId = '';
        schoolYearDetail &&
            schoolYearDetail.semesterOutputModels.length > 0 &&
            schoolYearDetail.semesterOutputModels.map((item, num) => {
                if (num == index + 1) {
                    afterId = item.id;
                }
            });
        let editSemesterEndTime = JSON.parse(JSON.stringify(this.state.editSemesterEndTime));
        let editSemesterStartTime = JSON.parse(JSON.stringify(this.state.editSemesterStartTime));
        editSemesterStartTime[`${afterId}`] = this.addADay(Date.parse(dateString));
        editSemesterEndTime[`${id}`] = dateString;
        this.setState({
            editSemesterEndTime,
            editSemesterStartTime,
        });
    }

    // 处理时间
    dealDate = (time) => {
        let newTime = time.replace(/-/g, '/');
        return new Date(newTime).getTime();
    };

    // 编辑学年--学期开始时间
    startSemesterEdit(index, id, date, dateString) {
        console.log(this.formatDate(dateString, 'reduce'), 'dateString ^^^');
        const { schoolYearDetail } = this.state;
        console.log(id, index, schoolYearDetail, 'idddd ^^^');
        let beforeId = '';
        schoolYearDetail &&
            schoolYearDetail.semesterOutputModels.length > 0 &&
            schoolYearDetail.semesterOutputModels.map((item, num) => {
                if (num == index - 1) {
                    beforeId = item.id;
                }
            });
        console.log(beforeId, 'beforeId ^^^');
        let editSemesterStartTime = JSON.parse(JSON.stringify(this.state.editSemesterStartTime));
        let editSemesterEndTime = JSON.parse(JSON.stringify(this.state.editSemesterEndTime));
        editSemesterEndTime[`${beforeId}`] = this.formatDate(dateString, 'reduce');
        editSemesterStartTime[`${id}`] = dateString;
        this.setState(
            {
                editSemesterStartTime,
                editSemesterEndTime,
            },
            () => {
                console.log(this.state.editSemesterStartTime, 'editSemesterStartTime ^^^');
                console.log(this.state.editSemesterEndTime, 'editSemesterEndTime ^^^');
            }
        );
    }

    // 编辑学年--取消
    cancelBtn = () => {
        this.setState(
            {
                isShowEdit: false,
                editSchoolYearCname: '',
                editSchoolYearEname: '',
                editEndTime: '',
                editSemesterCname: {},
                editSemesterEname: {},
                editSemesterEndTime: {},
                editSemesterStartTime: {},
            },
            () => {
                this.props.getSchoolYearList();
            }
        );
    };

    dealSemester() {
        let result = [];
        const { editSemesterCname, editSemesterEname, editSemesterStartTime, editSemesterEndTime } =
            this.state;
        for (let i in editSemesterCname) {
            let obj = {
                id: i,
                name: editSemesterCname[i],
                enName: editSemesterEname[i],
                startTime: editSemesterStartTime[i],
                endTime: editSemesterEndTime[i],
            };
            result.push(obj);
        }
        return result;
    }

    // 编辑学年--确认
    editComfrim = () => {
        const { dispatch, schoolYearListInfo, schoolId, companyId } = this.props;
        const { schoolYearDetail, editSchoolYearCname, editSchoolYearEname, editEndTime } =
            this.state;
        let payloadSemester = this.dealSemester();
        dispatch({
            type: 'organize/editSchoolYear',
            payload: {
                name: editSchoolYearCname ? editSchoolYearCname : schoolYearDetail.name,
                enName: editSchoolYearEname ? editSchoolYearEname : schoolYearDetail.ename,
                startTime: this.formatDate(schoolYearDetail.startTime),
                endTime: editEndTime ? editEndTime : this.formatDate(schoolYearDetail.endTime),
                schoolId,
                id: schoolYearDetail.id,
                semesterInputModelList: payloadSemester,
            },
            onSuccess: () => {
                // this.props.setShowCreatYear()
                this.setState(
                    {
                        isShowEdit: false,
                    },
                    () => {
                        this.props.getSchoolYearList();
                    }
                );
            },
        });
    };

    setUpGrade = () => {
        // window.location.href = '#/student/index';
        window.open('#/student/index', '_blank');
        Modal.destroyAll();
    };

    //设置当前学期/学年
    setCurrentYearOrSemester = (type, id) => {
        this.props
            .dispatch({
                type: 'organize/setCurrentYearOrSemester',
                payload: {
                    type,
                    semesterIdOrYearId: id,
                },
            })
            .then(() => {
                this.props.getSchoolYearList();
            });
    };

    //设置学期/学年
    deleteYearOrSemester = (type, id) => {
        const { schoolId } = this.props;
        this.props
            .dispatch({
                type: 'organize/deleteYearOrSemester',
                payload: {
                    type,
                    semesterIdOrYearId: id,
                    schoolId,
                },
            })
            .then(() => {
                this.props.getSchoolYearList();
            });
    };

    toTeachingWeekManagingPage = (schoolYearId, semesterId) => {
        const { history, schoolId } = this.props;
        history.push(
            `/teachingWeekManage/index?schoolId=${schoolId}&schoolYearId=${schoolYearId}&semesterId=${semesterId}`
        );
    };

    render() {
        const {
            isShowCreat,
            creatSemesterStartTime,
            isShowEdit,
            schoolYearDetail,
            semesterNum,
            editSchoolYearCname,
            editSchoolYearEname,
            editEndTime,
            editSemesterCname,
            editSemesterEname,
            editSemesterEndTime,
            editSemesterStartTime,
        } = this.state;
        const { schoolYearListInfo, errotType } = this.props;
        const dateFormat = 'YYYY - MM - DD';
        let now = this.formatDate(new Date(), 'noInfo');
        let currentSchoolYear = '';
        let year =
            (schoolYearListInfo &&
                schoolYearListInfo.length > 0 &&
                schoolYearListInfo[0].schoolYearId + 1) ||
            '';
        schoolYearListInfo &&
            schoolYearListInfo.length > 0 &&
            schoolYearListInfo.map((item) => {
                if (item.current) currentSchoolYear = item.endTime;
            });
        let nextDay = this.addADay(currentSchoolYear);
        let ceratStart = schoolYearListInfo && schoolYearListInfo.length == 0 ? now : nextDay;
        let next = '';
        let mostNew = false;
        return (
            <div className={styles.content}>
                {schoolYearListInfo &&
                    schoolYearListInfo.length > 0 &&
                    schoolYearListInfo.map((item, index) => {
                        let arr =
                            item.semesterOutputModels && item.semesterOutputModels.length
                                ? [...item.semesterOutputModels]
                                : [];
                        let last = arr.pop();
                        return (
                            <div className={styles.grid}>
                                <div className={`${styles.schoolYear} ${styles.item}`}>
                                    <div className={styles.leftArea}>
                                        <span className={styles.title}>
                                            {item.name} &nbsp; {item.ename}
                                        </span>
                                        <span className={styles.timeRange}>
                                            <i className={icon.iconfont}>&#xe62a;</i> &nbsp;
                                            {this.formatDate(item.startTime)} ~{' '}
                                            {this.formatDate(item.endTime)}
                                        </span>
                                    </div>
                                    <div className={styles.rightArea}>
                                        {schoolYearListInfo && schoolYearListInfo[0].current ? (
                                            ''
                                        ) : index == 0 ? (
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <Popover
                                                    content={
                                                        <div className={styles.popoverContent}>
                                                            <div className={styles.term}>
                                                                启动新学年需要满足以下2个条件:
                                                            </div>
                                                            <div className={styles.first}>
                                                                1. 完成行政班升年级设置{' '}
                                                                <span
                                                                    className={styles.set}
                                                                    onClick={this.setUpGrade}
                                                                >
                                                                    前往设置
                                                                </span>
                                                            </div>
                                                            <div className={styles.second}>
                                                                2. 最高年级学生已毕业{' '}
                                                                <span
                                                                    className={styles.set1}
                                                                    onClick={this.setUpGrade}
                                                                >
                                                                    前往设置
                                                                </span>
                                                            </div>
                                                        </div>
                                                    }
                                                    placement="bottom"
                                                >
                                                    <span className={styles.info}>
                                                        <i className={icon.iconfont}>&#xe7f3;</i>
                                                    </span>
                                                </Popover>

                                                <span
                                                    className={styles.startYear}
                                                    onClick={this.startYearHandle.bind(
                                                        this,
                                                        item.id
                                                    )}
                                                    style={{
                                                        top:
                                                            window.self != window.top
                                                                ? '50px'
                                                                : '40px',
                                                    }}
                                                >
                                                    {trans('global.startYear', '启动学年')}
                                                </span>
                                            </div>
                                        ) : (
                                            ''
                                        )}

                                        {item.current ? (
                                            <span className={styles.currentYear}>
                                                {trans('global.currentYear', '当前学年')}
                                            </span>
                                        ) : (
                                            <div className={styles.deleteYearOrSemester}>
                                                <span
                                                    onClick={() =>
                                                        this.setCurrentYearOrSemester(1, item.id)
                                                    }
                                                >
                                                    {trans('global.setYear', '设为当前学年')}
                                                </span>
                                                <span
                                                    onClick={() =>
                                                        this.deleteYearOrSemester(
                                                            1,
                                                            item.schoolYearId
                                                        )
                                                    }
                                                >
                                                    {trans('global.delete', '删除')}
                                                </span>
                                            </div>
                                        )}
                                        {index == 0 ? (
                                            <span
                                                className={styles.edit}
                                                onClick={this.editSchoolYear.bind(this, item)}
                                                style={{
                                                    top:
                                                        window.self != window.top ? '50px' : '40px',
                                                }}
                                            >
                                                {trans('global.edit', '编辑')}
                                            </span>
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                </div>
                                <div className={styles.semester}>
                                    {item.semesterOutputModels &&
                                        item.semesterOutputModels.length > 0 &&
                                        item.semesterOutputModels.map((el, num) => {
                                            if (el.current) {
                                                next = num + 1;
                                            }
                                            if (el.current) {
                                                if (el.endTime == last.endTime) {
                                                    mostNew = true;
                                                }
                                            }
                                            let listHeight =
                                                (1 / item.semesterOutputModels.length) * 100 + '%';

                                            return (
                                                <Row
                                                    className={styles.rowStyle}
                                                    style={{ height: listHeight }}
                                                    key={num}
                                                >
                                                    <Col
                                                        span={20}
                                                        key={num}
                                                        className={styles.item}
                                                    >
                                                        <div className={styles.leftArea}>
                                                            <span className={styles.semesterName}>
                                                                {locale() !== 'en'
                                                                    ? el.name
                                                                    : el.ename}
                                                            </span>
                                                            <span className={styles.semesterTime}>
                                                                <i className={icon.iconfont}>
                                                                    &#xe62a;
                                                                </i>{' '}
                                                                &nbsp;
                                                                {this.formatDate(
                                                                    el.startTime
                                                                )} ~ {this.formatDate(el.endTime)}
                                                            </span>
                                                        </div>
                                                        <div className={styles.rightArea}>
                                                            {el.current ? (
                                                                <div
                                                                    style={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                    }}
                                                                >
                                                                    <span
                                                                        className={
                                                                            styles.currentSemester
                                                                        }
                                                                    >
                                                                        {trans(
                                                                            'global.currentSemester',
                                                                            '当前学期'
                                                                        )}
                                                                    </span>
                                                                    <div
                                                                        className={
                                                                            styles.deleteYearOrSemester
                                                                        }
                                                                    >
                                                                        <span
                                                                            onClick={() =>
                                                                                this.toTeachingWeekManagingPage(
                                                                                    item.id,
                                                                                    el.id
                                                                                )
                                                                            }
                                                                        >
                                                                            管理教学周
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div
                                                                    className={
                                                                        styles.deleteYearOrSemester
                                                                    }
                                                                >
                                                                    <span
                                                                        onClick={() =>
                                                                            this.toTeachingWeekManagingPage(
                                                                                item.id,
                                                                                el.id
                                                                            )
                                                                        }
                                                                    >
                                                                        管理教学周
                                                                    </span>
                                                                    <span
                                                                        onClick={() =>
                                                                            this.setCurrentYearOrSemester(
                                                                                2,
                                                                                el.id
                                                                            )
                                                                        }
                                                                    >
                                                                        {trans(
                                                                            'global.setSemester',
                                                                            '设为当前学期'
                                                                        )}
                                                                    </span>
                                                                    <span
                                                                        onClick={() =>
                                                                            this.deleteYearOrSemester(
                                                                                2,
                                                                                el.id
                                                                            )
                                                                        }
                                                                    >
                                                                        {trans(
                                                                            'global.delete',
                                                                            '删除'
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {num == next &&
                                                                next != '' &&
                                                                item.current && (
                                                                    <span
                                                                        className={
                                                                            styles.startSemester
                                                                        }
                                                                        onClick={this.startSemesterHandle.bind(
                                                                            this,
                                                                            el.id
                                                                        )}
                                                                    >
                                                                        {trans(
                                                                            'global.Start semester',
                                                                            '启动学期'
                                                                        )}
                                                                    </span>
                                                                )}
                                                            {el.current &&
                                                                mostNew &&
                                                                last.endTime < item.endTime && (
                                                                    <span
                                                                        className={
                                                                            styles.creatSemester
                                                                        }
                                                                        onClick={this.showCreat.bind(
                                                                            this,
                                                                            item
                                                                        )}
                                                                    >
                                                                        {trans(
                                                                            'global.createSemester',
                                                                            '+ 新建学期'
                                                                        )}
                                                                    </span>
                                                                )}
                                                        </div>
                                                    </Col>
                                                </Row>
                                            );
                                        })}
                                </div>
                                {
                                    <Modal
                                        title={
                                            <span>
                                                {trans('global.createSemester', '+ 新建学期')}
                                            </span>
                                        }
                                        visible={isShowCreat}
                                        onCancel={this.cancelCreat}
                                        className={styles.semesterModal}
                                        footer={null}
                                    >
                                        <div className={styles.modalContent}>
                                            <div className={styles.semesterCName}>
                                                <span className={styles.title}>学期中文名</span>
                                                <Input
                                                    defaultValue={`第${semesterNum}学期`}
                                                    onChange={this.changeSemesterCName}
                                                ></Input>
                                            </div>
                                            <div className={styles.semesterCName}>
                                                <span className={styles.title}>
                                                    {trans(
                                                        'global.SemesterEnglishName',
                                                        '学期英文名'
                                                    )}
                                                </span>
                                                <Input
                                                    defaultValue={`Semester${semesterNum}`}
                                                    onChange={this.changeSemesterEName}
                                                ></Input>
                                            </div>
                                            <div className={styles.timeRange}>
                                                <span className={styles.title}>
                                                    {trans('global.Period', '时间周期')}
                                                </span>
                                                <div className={styles.pick}>
                                                    <DatePicker
                                                        defaultValue={moment(
                                                            creatSemesterStartTime,
                                                            dateFormat
                                                        )}
                                                        disabled={true}
                                                    ></DatePicker>
                                                    <span className={styles.to}>
                                                        {trans('global.to', '至')}
                                                    </span>
                                                    <DatePicker
                                                        onChange={this.changeEnd}
                                                    ></DatePicker>
                                                </div>
                                            </div>
                                            <div className={styles.btns}>
                                                <span
                                                    className={styles.cancelBtn}
                                                    onClick={this.cancelCreat}
                                                >
                                                    {trans('global.cancel', '取消')}
                                                </span>
                                                <span
                                                    className={styles.okBtn}
                                                    onClick={this.confirmSemester}
                                                >
                                                    {trans('pay.confirm', '确认')}
                                                </span>
                                            </div>
                                        </div>
                                    </Modal>
                                }
                                {
                                    <Modal
                                        title={
                                            <span>
                                                {trans('global.edit', '编辑')}
                                                {schoolYearDetail.schoolYearId}
                                                {trans('global.all.academic.year', '学年')}
                                            </span>
                                        }
                                        visible={isShowEdit}
                                        onCancel={this.cancelBtn}
                                        className={
                                            window.top != window.self
                                                ? `${styles.editYearModal} ${styles.iframeModal}`
                                                : styles.editYearModal
                                        }
                                        footer={null}
                                        width="950px"
                                    >
                                        <div className={styles.modalContent}>
                                            <div className={styles.academicName}>
                                                <span className={styles.title}>
                                                    {trans('global.yearName', '学年中文名')}
                                                </span>
                                                <Input
                                                    onChange={this.editAdemicCname}
                                                    value={
                                                        editSchoolYearCname
                                                            ? editSchoolYearCname
                                                            : schoolYearDetail.name
                                                    }
                                                ></Input>
                                            </div>
                                            <div className={styles.academicName}>
                                                <span className={styles.title}>
                                                    {trans('global.yearEname', '学年英文名')}
                                                </span>
                                                <Input
                                                    onChange={this.editAdemicEname}
                                                    value={
                                                        editSchoolYearEname
                                                            ? editSchoolYearEname
                                                            : schoolYearDetail.ename
                                                    }
                                                ></Input>
                                            </div>
                                            <div className={styles.timeRange}>
                                                <span className={styles.title}>
                                                    {trans('global.Period', '时间周期')}
                                                </span>
                                                <div className={styles.pick}>
                                                    <DatePicker
                                                        defaultValue={moment(
                                                            this.formatDate(
                                                                schoolYearDetail.startTime
                                                            ),
                                                            dateFormat
                                                        )}
                                                        disabled={true}
                                                        allowClear={false}
                                                    ></DatePicker>
                                                    <span className={styles.to}>
                                                        {trans('global.to', '至')}
                                                    </span>
                                                    <DatePicker
                                                        onChange={this.changeEditDateEnd}
                                                        allowClear={false}
                                                        value={
                                                            editEndTime
                                                                ? moment(
                                                                      this.formatDate(editEndTime),
                                                                      dateFormat
                                                                  )
                                                                : moment(
                                                                      this.formatDate(
                                                                          schoolYearDetail.endTime
                                                                      ),
                                                                      dateFormat
                                                                  )
                                                        }
                                                    ></DatePicker>
                                                </div>
                                            </div>
                                        </div>
                                        <span className={styles.academicInfo}>
                                            {trans('global.SemesterInformation', '学期信息')}
                                        </span>
                                        <i className={styles.line}></i>
                                        {schoolYearDetail &&
                                            schoolYearDetail.semesterOutputModels &&
                                            schoolYearDetail.semesterOutputModels.length > 0 &&
                                            schoolYearDetail.semesterOutputModels.map(
                                                (obj, order) => {
                                                    return (
                                                        <div className={styles.semesterStage}>
                                                            <Input
                                                                onChange={this.editSemesterCh.bind(
                                                                    this,
                                                                    obj.id
                                                                )}
                                                                value={
                                                                    this.state.editSemesterCname[
                                                                        `${obj.id}`
                                                                    ]
                                                                }
                                                                key={obj.id}
                                                            ></Input>
                                                            <Input
                                                                onChange={this.editSemesterEn.bind(
                                                                    this,
                                                                    obj.id
                                                                )}
                                                                value={
                                                                    this.state.editSemesterEname[
                                                                        `${obj.id}`
                                                                    ]
                                                                }
                                                            ></Input>
                                                            <div className={styles.semesterTime}>
                                                                <DatePicker
                                                                    onChange={this.startSemesterEdit.bind(
                                                                        this,
                                                                        order,
                                                                        obj.id
                                                                    )}
                                                                    value={moment(
                                                                        this.formatDate(
                                                                            this.state
                                                                                .editSemesterStartTime[
                                                                                `${obj.id}`
                                                                            ]
                                                                        ),
                                                                        dateFormat
                                                                    )}
                                                                    disabled={
                                                                        order == 0 ? true : false
                                                                    }
                                                                    allowClear={false}
                                                                ></DatePicker>
                                                                <span>
                                                                    {trans('global.to', '至')}
                                                                </span>
                                                                <DatePicker
                                                                    allowClear={false}
                                                                    onChange={this.endSemesterEdit.bind(
                                                                        this,
                                                                        order,
                                                                        obj.id
                                                                    )}
                                                                    value={moment(
                                                                        this.formatDate(
                                                                            this.state
                                                                                .editSemesterEndTime[
                                                                                `${obj.id}`
                                                                            ]
                                                                        ),
                                                                        dateFormat
                                                                    )}
                                                                ></DatePicker>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        <div className={styles.btns}>
                                            <span
                                                className={styles.cancelBtn}
                                                onClick={this.cancelBtn}
                                            >
                                                {trans('global.cancel', '取消')}
                                            </span>
                                            <span
                                                className={styles.okBtn}
                                                onClick={this.editComfrim}
                                            >
                                                {trans('pay.confirm', '确认')}
                                            </span>
                                        </div>
                                    </Modal>
                                }
                            </div>
                        );
                    })}
            </div>
        );
    }
}
export default withRouter(SemesterGrid);
