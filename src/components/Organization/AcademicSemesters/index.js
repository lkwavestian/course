//机构管理--学年学期
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './index.less';
import SortableTree from 'components/SortableTree/index';
import SemesterGrid from './SemesterGrid/index';
import moment from 'moment';
import {
    Checkbox,
    Select,
    Input,
    Pagination,
    message,
    Dropdown,
    Menu,
    Modal,
    DatePicker,
} from 'antd';
import icon from '../../../icon.less';
import { trans, locale } from '../../../utils/i18n';
import { parse } from 'path-to-regexp';
import { formatTimeSafari } from '../../../utils/utils';

const { Option } = Select;
const dateFormat = 'YYYY - MM - DD';
@connect((state) => ({
    schoolYearListInfo: state.organize.schoolYearListInfo,
    listSchoolInfo: state.organize.listSchoolInfo,
    currentUser: state.global.currentUser,
}))
export default class AcademicSemesters extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showAcademic: false, // 新建学年弹层显隐
            showSure: false, // 再次确认弹框
            isShowCreatYear: false, // 是否显示新建学年按钮
            academicCname: `${new Date().getFullYear()}学年`, //新建学年中文名
            academicEname: `Year ${new Date().getFullYear()}`, // 新建学年英文名
            yearSatrtTime: '', //新建学年开始时间
            yearEndTime: moment(new Date().getFullYear() + 1 + '-' + 0 + 7 + '-' + 10, dateFormat), // 新建学年结束时间
            semesterCname: '第一学期', // 新建学年学期中文名
            semesterEname: 'Semester 1', // 新建学年学期英文名
            schoolId: '', //学校id
            companyId: '', //机构id
            linkSemesterStartTime: '', // 可修改新建学年的起始时间时，联动学期修改
            ceratStart: '',
            isSemesterEndTimeMax: false, //最新的学期时间是否等于学年结束时间 等于的时候
        };
    }

    componentDidMount() {
        this.getListSchoolInfo();
        this.getCurrentUserInfo();
    }

    // 格式化日期
    formatDate = (date, type) => {
        var date = new Date(formatTimeSafari(date));
        var YY = date.getFullYear() + '-';
        var nextYY = date.getFullYear() + 1 + '-';
        var MM =
            (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        var ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        if (type == 'noInfo') return YY + 0 + 7 + '-' + 11;
        // 默认为次年的7.10
        if (type == 'next710') return nextYY + 0 + 7 + '-' + 10;
        return YY + MM + DD;
    };

    // 时间+1天 参数为时间戳
    addADay = (timeStamp) => {
        let tiem = new Date(formatTimeSafari(timeStamp));
        let newTime = new Date((tiem / 1000 + 86400) * 1000);
        console.log(this.formatDate(newTime), '(tiem/1000+86400)*1000');
        let newTimeString = this.formatDate(newTime);
        return newTimeString;
    };

    getCurrentUserInfo = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'global/getCurrentUser',
        }).then(() => {
            const { currentUser } = this.props;
            this.setState(
                {
                    schoolId: currentUser.schoolId,
                    companyId: currentUser.companyId,
                },
                () => {
                    this.getSchoolYearList();
                }
            );
            localStorage.setItem('userIdentity', currentUser && currentUser.currentIdentity);
        });
    };

    getListSchoolInfo = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'organize/getlistSchool',
            payload: {
                companyId: 1, // 机构id
            },
        });
    };
    getSchoolYearList = () => {
        const { dispatch } = this.props;
        const { schoolId } = this.state;
        dispatch({
            type: 'organize/getSchoolYearList',
            payload: {
                companyId: 1, // 机构id
                schoolId: schoolId, // 学校id
            },
            onSuccess: () => {
                const { schoolYearListInfo } = this.props;
                let now = this.formatDate(new Date(), 'noInfo');
                let currentSchoolYear = '';
                schoolYearListInfo &&
                    schoolYearListInfo.length > 0 &&
                    schoolYearListInfo.map((item) => {
                        if (item.current) currentSchoolYear = item.endTime;
                    });
                let nextDay = this.addADay(currentSchoolYear);
                let ceratStart =
                    schoolYearListInfo && schoolYearListInfo.length == 0 ? now : nextDay;

                schoolYearListInfo &&
                    schoolYearListInfo.length > 0 &&
                    schoolYearListInfo.map((item, index) => {
                        item.semesterOutputModels &&
                            item.semesterOutputModels.length > 0 &&
                            item.semesterOutputModels.map((el, num) => {
                                let arr = [...item.semesterOutputModels];
                                let last = arr.pop();
                                console.log(last, '//last');
                                if (el.current && item.current) {
                                    console.log(last.endTime, item, 'item>>>>>>');
                                    if (last.endTime == item.endTime) {
                                        this.setState({
                                            isShowCreatYear: true,
                                            ceratStart,
                                            // isSemesterEndTimeMax,
                                        });
                                    } else if (last.endTime < item.endTime) {
                                        this.setState({
                                            isShowCreatYear: false,
                                        });
                                    }
                                }
                            });
                    });
            },
        });
    };
    setShowCreatYear = () => {
        this.setState({
            isShowCreatYear: false,
        });
    };
    createAcademic = () => {
        this.setState({
            showAcademic: true,
        });
    };
    // 取消新建学年
    handleCancel = () => {
        this.setState({
            showAcademic: false,
        });
    };
    confirmModal(ceratStart) {
        const { schoolYearListInfo } = this.props;
        const {
            academicCname,
            academicEname,
            yearEndTime,
            semesterCname,
            semesterEname,
            semesterEndTime,
            yearSatrtTime,
            linkSemesterStartTime,
        } = this.state;
        console.log(semesterEndTime, ceratStart, 'semesterEndTime&&&');
        // 当学年列表为空时，不允许yearSatrtTime 字段为空，和其他字段的非空校验
        console.log(
            schoolYearListInfo && schoolYearListInfo.length == 0 && !yearSatrtTime,
            academicCname == '',
            academicEname == '',
            yearEndTime == '',
            semesterCname == '',
            semesterEname == '',
            !semesterEndTime,
            '///////'
        );
        if (
            academicCname == '' ||
            academicEname == '' ||
            yearEndTime == '' ||
            semesterCname == '' ||
            semesterEname == '' ||
            !semesterEndTime
        ) {
            message.warning('请填写完整信息');
            console.log(
                schoolYearListInfo && schoolYearListInfo.length == 0 && !yearSatrtTime,
                academicCname == '',
                academicEname == '',
                yearEndTime == '',
                semesterCname == '',
                semesterEname == '',
                !semesterEndTime,
                '///////'
            );
            return;
        }
        console.log(Date.parse(semesterEndTime), Date.parse(ceratStart), 'Date.parse(ceratStart)');
        // if(Date.parse(semesterEndTime) <= Date.parse(ceratStart)){
        //     message.warning('学期结束时间不能小于学期开始时间');
        //     return;
        // }
        if (linkSemesterStartTime) {
            if (Date.parse(semesterEndTime) <= Date.parse(linkSemesterStartTime)) {
                message.warning('学期结束时间不能小于学期开始时间');
                return;
            }
        } else {
            if (Date.parse(semesterEndTime) <= Date.parse(ceratStart)) {
                message.warning('学期结束时间不能小于学期开始时间');
                return;
            }
        }
        Modal.confirm({
            title: <span className={styles.confirmText}>新建学年后将无法删除，确定继续吗？</span>,
            okText: '确认',
            cancelText: '取消',
            onOk: this.confrimCreatSchoolYear.bind(this, ceratStart),
        });
    }

    confrimCreatSchoolYear(ceratStart) {
        const { dispatch } = this.props;
        const {
            academicCname,
            academicEname,
            yearEndTime,
            semesterCname,
            semesterEname,
            semesterEndTime,
            schoolId,
            linkSemesterStartTime,
        } = this.state;
        console.log(yearEndTime, '||', this.formatDate(yearEndTime), ceratStart, 'ceratStart');
        let payloadSemester = [];
        let obj = {};
        obj.name = semesterCname;
        obj.enName = semesterEname;
        obj.startTime = linkSemesterStartTime ? linkSemesterStartTime : ceratStart;
        obj.endTime = semesterEndTime;
        payloadSemester.push(obj);
        console.log(payloadSemester, 'payloadSemester');
        dispatch({
            type: 'organize/createSchoolYear',
            payload: {
                name: academicCname,
                enName: academicEname,
                startTime: linkSemesterStartTime ? linkSemesterStartTime : ceratStart,
                endTime: this.formatDate(yearEndTime),
                schoolId,
                semesterInputModelList: payloadSemester,
            },
            onSuccess: () => {
                this.getSchoolYearList();
                this.handleCancel();
            },
        });
    }
    changeCname = (e) => {
        this.setState({
            academicCname: e.target.value,
        });
    };

    changeEname = (e) => {
        this.setState({
            academicEname: e.target.value,
        });
    };

    changeDateStart = (date, dateString) => {
        this.setState({
            yearSatrtTime: dateString,
            linkSemesterStartTime: dateString,
        });
    };

    changeDateEnd = (date, dateString) => {
        console.log(this.state.yearEndTime, dateString, 'dateString');
        this.setState({
            yearEndTime: moment(dateString, dateFormat),
        });
    };

    semesterChChange = (e) => {
        this.setState({
            semesterCname: e.target.value,
        });
    };

    semesterENChange = (e) => {
        this.setState({
            semesterEname: e.target.value,
        });
    };

    endSemester = (date, dateString) => {
        this.setState({
            semesterEndTime: dateString,
        });
    };

    changeSchoolHandle = (value) => {
        this.setState(
            {
                schoolId: value,
            },
            () => {
                this.getSchoolYearList();
            }
        );
    };
    render() {
        const { schoolYearListInfo, listSchoolInfo, currentUser } = this.props;
        const { showAcademic, isShowCreatYear, schoolId, linkSemesterStartTime } = this.state;
        let currentYear = new Date().getFullYear();
        let now = this.formatDate(new Date(), 'noInfo');
        let currentSchoolYear = '';
        let year =
            (schoolYearListInfo &&
                schoolYearListInfo.length > 0 &&
                schoolYearListInfo[0].schoolYearId + 1) ||
            currentYear;
        schoolYearListInfo &&
            schoolYearListInfo.length > 0 &&
            schoolYearListInfo.map((item) => {
                if (item.current) currentSchoolYear = item.endTime;
            });
        console.log(currentSchoolYear, 'currentSchoolYear ??? ');
        let nextDay = this.addADay(currentSchoolYear);
        // 没有上一学年时，默认显示当前年份的7.11号
        let ceratStart = schoolYearListInfo && schoolYearListInfo.length == 0 ? now : nextDay;
        // 没有上一学年时，可以修改日期
        let isEdit = schoolYearListInfo && schoolYearListInfo.length == 0 ? false : true;
        console.log(now, nextDay, '00000000???');
        return (
            <div className={styles.main}>
                <div className={styles.chooseSchool}>
                    <Select value={schoolId} onChange={this.changeSchoolHandle}>
                        {listSchoolInfo &&
                            listSchoolInfo.length > 0 &&
                            listSchoolInfo.map((item, index) => {
                                return (
                                    <Option value={item.schoolId} key={item.schoolId}>
                                        {locale() == 'en' ? item.enName : item.name}
                                    </Option>
                                );
                            })}
                    </Select>
                    {(isShowCreatYear || schoolYearListInfo.length == 0) && (
                        <span className={styles.createAcademic} onClick={this.createAcademic}>
                            <i>+</i>
                            {trans('course.plan.createAcademic', '新建学年')}
                        </span>
                    )}
                </div>
                <Modal
                    title={`新建${year}学年`}
                    visible={showAcademic}
                    onOk={this.sureCreat}
                    onCancel={this.handleCancel}
                    className={
                        window.top != window.self
                            ? `${styles.modal} ${styles.iframeModal}`
                            : styles.modal
                    }
                    width="950px"
                    footer={null}
                >
                    <div className={styles.modalContent}>
                        <div className={styles.academicName}>
                            <span className={styles.title}>
                                {trans('global.yearName', '学年中文名')}
                            </span>
                            <Input
                                // defaultValue = {`${currentYear+1}学年`}
                                value={this.state.academicCname}
                                onChange={this.changeCname}
                            ></Input>
                        </div>
                        <div className={styles.academicName}>
                            <span className={styles.title}>
                                {trans('global.yearEname', '学年英文名')}
                            </span>
                            <Input
                                // defaultValue = {`Year ${currentYear+1}`}
                                value={this.state.academicEname}
                                onChange={this.changeEname}
                            ></Input>
                        </div>
                        <div className={styles.timeRange}>
                            <span className={styles.title}>
                                {trans('global.Period', '时间周期')}
                            </span>
                            <div className={styles.pick}>
                                <DatePicker
                                    onChange={this.changeDateStart}
                                    defaultValue={moment(ceratStart, dateFormat)}
                                    disabled={isEdit}
                                ></DatePicker>
                                <span className={styles.to}>至</span>
                                <DatePicker
                                    value={this.state.yearEndTime}
                                    // defaultValue = {moment(this.formatDate(new Date(),'next710'),dateFormat)}
                                    onChange={this.changeDateEnd}
                                ></DatePicker>
                            </div>
                        </div>
                    </div>
                    <span className={styles.academicInfo}>
                        {trans('global.SemesterInformation', '学期信息')}
                    </span>
                    <i className={styles.line}></i>
                    <div className={styles.semesterStage}>
                        <Input
                            onChange={this.semesterChChange}
                            // defaultValue = {`第一学期`}
                            value={this.state.semesterCname}
                        ></Input>
                        <Input
                            onChange={this.semesterENChange}
                            // defaultValue = {`Semester 1`}
                            value={this.state.semesterEname}
                        ></Input>
                        <div className={styles.semesterTime}>
                            <DatePicker
                                value={moment(
                                    linkSemesterStartTime ? linkSemesterStartTime : ceratStart,
                                    dateFormat
                                )}
                                disabled={true}
                            ></DatePicker>
                            <span>至</span>
                            <DatePicker onChange={this.endSemester}></DatePicker>
                        </div>
                    </div>
                    <div className={styles.btns}>
                        <span className={styles.cancelBtn} onClick={this.handleCancel}>
                            取消
                        </span>
                        <span
                            className={styles.okBtn}
                            onClick={this.confirmModal.bind(this, ceratStart)}
                        >
                            确定
                        </span>
                    </div>
                </Modal>

                <SemesterGrid
                    schoolYearListInfo={this.props.schoolYearListInfo}
                    dispatch={this.props.dispatch}
                    companyId={this.state.companyId}
                    schoolId={this.state.schoolId}
                    getSchoolYearList={this.getSchoolYearList}
                    setShowCreatYear={this.setShowCreatYear}
                ></SemesterGrid>
            </div>
        );
    }
}
