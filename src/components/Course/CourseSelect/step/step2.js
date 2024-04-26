import React, { PureComponent } from 'react';
import styles from './step.less';
import moment from 'moment';
import { Select, Input, Checkbox, Row, Col, Spin, Icon, DatePicker, message } from 'antd';
import { connect } from 'dva';
import { trans, locale } from '../../../../utils/i18n';
import { formatTimeSafari } from '../../../../utils/utils';

const { RangePicker } = DatePicker;
const { Option } = Select;

@connect((state) => ({
    listChooseCourse: state.time.listChooseCourse,
}))
class Step2 extends PureComponent {
    constructor(props) {
        super(props);
        let { planningSemesterInfo } = props;
        let defaultStartTime = null;
        let defaultEndTime = null;
        if (planningSemesterInfo && planningSemesterInfo.length > 0) {
            planningSemesterInfo.forEach((el, i) => {
                console.log(el, 'elelelel');
                if (el.current) {
                    console.log(el, 'ellllll');
                    defaultStartTime = this.ymd(el.startTime);
                    defaultEndTime = this.ymd(el.endTime);
                    return;
                }
            });
        }
        console.log(defaultStartTime, 'planningSemesterInfo');
        console.log(this.props.selectionMessage, 'qqqq');
        this.state = {
            allChecked: false,
            checkedIdList: [], // 所有选中的集合
            oldCheckedIdList: [], // 已经被选过的ID集合，不能再选
            chooseCourseList: [], // 所有列表
            planId: this.props.planId || '',
            defaultStartTime: defaultStartTime, // 选课计划所选的开课周期
            defaultEndTime: defaultEndTime,
            startTime: defaultStartTime,
            endTime: defaultEndTime,
            startTimeFroImport: this.props.selectionMessage
                ? this.props.selectionMessage.startTimeString
                : '',
            endTimeFroImport: this.props.selectionMessage
                ? this.props.selectionMessage.endTimeString
                : '',
            subjectId: '',
            gradeId: '',
            keyWord: '',
            isload: false,
            notActiveArr: [],
            isChangeDate: false,
        };
    }

    // componentWillReceiveProps(nextProps) {
    //     let { createSchoolYearId, defaultStartTime, defaultEndTime } = this.initPropsData(nextProps);
    //     console.log( defaultStartTime, defaultEndTime,' defaultStartTime, defaultEndTime')
    //         this.setState({
    //             startTime: defaultStartTime,
    //             endTime: defaultEndTime,
    //         })

    // }

    // 初始化新建时的默认值
    initPropsData(props) {
        let { planningSemesterInfo } = props;
        let createSchoolYearId = '';
        let defaultStartTime = null;
        let defaultEndTime = null;
        if (planningSemesterInfo && planningSemesterInfo.length > 0) {
            planningSemesterInfo.forEach((el, i) => {
                if (el.current) {
                    createSchoolYearId = el.id;
                    defaultStartTime = this.ymd(el.startTime);
                    defaultEndTime = this.ymd(el.endTime);
                    return;
                }
            });
        }

        return {
            createSchoolYearId,
            defaultStartTime,
            defaultEndTime,
        };
    }

    componentDidMount() {
        this.getCourseList(this.state.planId);
        typeof this.props.onRef === 'function' && this.props.onRef(this);
        typeof this.props.onRefStep === 'function' && this.props.onRefStep(this);
    }

    ymd(time) {
        let t = new Date(formatTimeSafari(time));
        return `${t.getFullYear()}-${t.getMonth() + 1}-${t.getDate()}`;
    }

    //获取课
    getCourseList = (planId) => {
        if (
            this.state.startTime === undefined ||
            this.state.endTime === undefined ||
            this.state.startTime === '' ||
            this.state.endTime === ''
        ) {
            message.warning('请选择开课周期');
            return;
        }
        if (!planId) {
            return;
        }
        const { keyWord, startTime, endTime, subjectId, gradeId, checkedIdList } = this.state;
        const { start, end } = this.props;
        this.setState({
            isload: false,
            allChecked: false,
        });
        const { dispatch } = this.props;
        console.log('wwww');

        dispatch({
            type: 'time/listChooseCourse',
            payload: {
                chooseCoursePlanId: planId,
                startTime: startTime ? startTime : start,
                endTime: endTime ? endTime : end,
                teachingOrgId: gradeId,
                subjectId,
                keyWord,
            },
        }).then(() => {
            let { listChooseCourse } = this.props;
            if (listChooseCourse) {
                let _checkedIdList = [];
                let oldCheckedIdList = [];

                listChooseCourse.forEach((el) => {
                    if (el.chooseStudents == 1 || el.chooseStudents == 2) {
                        _checkedIdList.push(el.coursePlanningId);
                        oldCheckedIdList.push(el.coursePlanningId); // 全选/反选回显
                    }
                    // if (el.chooseStudents == 2) {
                    //     oldCheckedIdList.push(el.coursePlanningId);
                    // }
                });

                let newList = Array.from(new Set(checkedIdList.concat(_checkedIdList)));
                this.setState({
                    oldCheckedIdList,
                    checkedIdList: newList,
                    chooseCourseList: this.arrTrans(4, listChooseCourse) || [],
                });
                if (
                    listChooseCourse.length > 0 &&
                    (listChooseCourse.length === _checkedIdList.length ||
                        listChooseCourse.length === newList.length)
                ) {
                    this.setState({
                        allChecked: true,
                    });
                }
            }

            this.setState({
                isload: true,
            });
        });
    };

    arrTrans(num, arr) {
        // 一维数组转换为二维数组
        const iconsArr = []; // 声明数组
        arr.forEach((item, index) => {
            const page = Math.floor(index / num); // 计算该元素为第几个素组内
            if (!iconsArr[page]) {
                // 判断是否存在
                iconsArr[page] = [];
            }
            iconsArr[page].push(item);
        });
        return iconsArr;
    }

    onChange = (checkedList) => {
        const { chooseCourseList } = this.state;
        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && checkedList.length < chooseCourseList.length,
            checkAll: checkedList.length === chooseCourseList.length,
        });
    };

    handlePicker = (date, dateString) => {
        this.setState(
            {
                startTime: dateString[0],
                endTime: dateString[1],
                isChangeDate: true,
            },
            () => {
                this.props.exportTime(this.state.startTime, this.state.endTime);
            }
        );
    };

    arrayDifference(parent = [], son = []) {
        return parent.concat(son).filter((v) => !parent.includes(v) || !son.includes(v));
    }

    handleChange = (type, value) => {
        if (type === 'checkedIdList') {
            let { listChooseCourse = [] } = this.props;
            // 控制全选按钮显示
            if (listChooseCourse.length === value.length) {
                this.setState({
                    allChecked: true,
                });
            } else {
                this.setState({
                    allChecked: false,
                });
            }
        }

        this.setState({
            [type]: value,
        });

        if (type === 'checkedIdList') {
            let { changeNubmer, self } = this.props;
            let { oldCheckedIdList } = this.state;
            let len = this.arrayDifference(value, oldCheckedIdList).length;
            changeNubmer && typeof changeNubmer === 'function' && changeNubmer.call(self, len);
        }
    };

    valCheckboxChange = (e) => {
        let value = [e.target.value];
        let { notActiveArr } = this.state;
        value.map((el) => {
            // 若为选中判断notActiveArr中是否存在，不存在push
            if (e.target.checked) {
                if (notActiveArr.indexOf(el) < 0) {
                    notActiveArr.push(el);
                }
            } else {
                // 反选，判断notActiveArr是否存在，存在删除
                if (notActiveArr.indexOf(el) > -1) {
                    let index = notActiveArr.indexOf(el);
                    notActiveArr.splice(index, 1);
                }
            }
        });
        this.setState({
            notActiveArr: [...notActiveArr],
        });
    };

    // 全选/反选
    checkedAll = (e) => {
        let { chooseCourseList, oldCheckedIdList } = this.state;
        if (e.target.checked) {
            let num = 0;
            if (chooseCourseList && chooseCourseList.length > 0) {
                let checkedIdList = [];
                let arr = [];
                chooseCourseList.forEach((el) => {
                    el.forEach((elt) => {
                        num++;
                        checkedIdList.push(elt.coursePlanningId);
                        if (elt.chooseStudents !== 1 && elt.chooseStudents !== 2) {
                            arr.push(elt.coursePlanningId);
                        }
                    });
                });
                num = num - oldCheckedIdList.length;
                this.setState({
                    checkedIdList,
                    notActiveArr: arr,
                });
                let { changeNubmer, self } = this.props;
                changeNubmer && typeof changeNubmer === 'function' && changeNubmer.call(self, num);
            }
        } else {
            this.setState({
                checkedIdList: oldCheckedIdList,
                notActiveArr: [],
            });
            let { changeNubmer, self } = this.props;
            changeNubmer && typeof changeNubmer === 'function' && changeNubmer.call(self, 0);
        }

        this.setState({
            allChecked: e.target.checked,
        });
    };

    render() {
        const { gradeList, subjectList, isEdit, openOrigin, isChangeStep1, visibleAddCourse } =
            this.props;
        const {
            subjectId,
            gradeId,
            chooseCourseList,
            checkedIdList,
            isload,
            planId,
            keyWord,
            allChecked,
            oldCheckedIdList,
            startTime,
            endTime,
            notActiveArr,
            defaultStartTime,
            defaultEndTime,
            isChangeDate,
            startTimeFroImport,
            endTimeFroImport,
        } = this.state;
        console.log(isChangeStep1, startTime, 'isChangeStep1>>>');
        const dateFormat = 'YYYY/MM/DD';
        // 开课周期回显处理：新增需要判断props中的start,课程列表中导入课程没有props
        const timeValueNew =
            this.props.start === undefined ||
            this.props.end === undefined ||
            startTime === undefined ||
            endTime === undefined ||
            startTime === '' ||
            endTime === ''
                ? null
                : [
                      moment(
                          visibleAddCourse
                              ? startTime
                                  ? startTime
                                  : startTimeFroImport
                              : isChangeStep1
                              ? this.props.start
                              : startTime,
                          dateFormat
                      ),
                      moment(
                          visibleAddCourse
                              ? endTime
                                  ? endTime
                                  : endTimeFroImport
                              : isChangeStep1
                              ? this.props.end
                              : endTime,
                          dateFormat
                      ),
                  ];

        const timeValueCourse = !startTime
            ? null
            : [
                  moment(this.props.start || startTime, dateFormat),
                  moment(this.props.end || endTime, dateFormat),
              ];
        return (
            <div className={styles.Step2}>
                <div className={styles.NewCreate}>
                    <div className={styles.item}>
                        <div className={styles.title}>
                            {trans('course.step2.opening.period', '开课周期')}
                        </div>
                        <RangePicker
                            // showTime={{ format: 'HH:mm' }}
                            // value = { openOrigin == 'new' ? timeValueNew : timeValueCourse }
                            value={timeValueNew}
                            // defaultValue = {[moment(defaultStartTime, dateFormat), moment(defaultEndTime, dateFormat)]}
                            // format="YYYY-MM-DD"
                            placeholder={[
                                trans('course.step1.select.start.date', '请选择开始日期'),
                                trans('course.step1.select.end.date', '请选择结束日期'),
                            ]}
                            className={styles.changePicker}
                            onChange={this.handlePicker}
                        />
                    </div>
                    <div className={styles.item}>
                        <div className={styles.title}>
                            {trans('course.step2.applicable.grade', '适用年级')}
                        </div>
                        <Select
                            value={gradeId}
                            style={{ width: 120 }}
                            className={styles.selectStyle}
                            onChange={this.handleChange.bind(this, 'gradeId')}
                        >
                            <Option value="" key="all">
                                {trans('course.step2.all.grade', '全部年级')}
                            </Option>
                            {gradeList &&
                                gradeList.length > 0 &&
                                gradeList.map((item, index) => (
                                    <Option value={item.id} key={index}>
                                        {locale() != 'en' ? item.orgName : item.orgEname}
                                    </Option>
                                ))}
                        </Select>
                        <span className={styles.midTitle}>
                            {trans('course.step2.subject', '科目')}
                        </span>
                        <Select
                            value={subjectId}
                            style={{ width: 120, marginRight: 32 }}
                            className={styles.selectStyle}
                            onChange={this.handleChange.bind(this, 'subjectId')}
                        >
                            <Option value="" key="all">
                                {trans('course.step2.all.subject', '全部科目')}
                            </Option>
                            {subjectList &&
                                subjectList.length > 0 &&
                                subjectList.map((item, index) => {
                                    return (
                                        <Option value={item.id} key={item.id}>
                                            {locale != 'en' ? item.name : item.ename}
                                        </Option>
                                    );
                                })}
                        </Select>
                        <Input
                            value={keyWord}
                            placeholder={trans('global.placeholder', '请输入')}
                            onChange={(e) => {
                                this.setState({
                                    keyWord: e.target.value,
                                });
                            }}
                            style={{ width: 210, height: 32, borderRadius: 20 }}
                        />
                        <Icon
                            type="search"
                            onClick={this.getCourseList.bind(this, planId)}
                            className={styles.icon}
                        />
                    </div>
                    <div className={styles.checkBoxs}>
                        <Checkbox checked={allChecked} onChange={this.checkedAll}>
                            {/* {trans('global.select.all', '全选')} */}
                            {trans('global.choiceAll', '全选')}
                        </Checkbox>
                        <span style={{ color: '#999' }}>
                            {trans('course.step2.selected.number', '已选择:{$num}个课程', {
                                num: notActiveArr.length || '0',
                            })}
                        </span>
                        <span className={styles.mention}>
                            <Icon type="info-circle" />{' '}
                            请先在课时计划模块完成开班设置后方可导入到选课计划中
                        </span>
                        <div></div>
                        {!isload && (
                            <div className={styles.load}>
                                <Spin tip="loading......" />
                            </div>
                        )}
                        {isload && chooseCourseList && chooseCourseList.length > 0 && (
                            <Checkbox.Group
                                value={checkedIdList}
                                onChange={this.handleChange.bind(this, 'checkedIdList')}
                                style={{ width: '100%' }}
                            >
                                {chooseCourseList.map((el, i) => (
                                    <Row key={i}>
                                        {el.map((val, y) => (
                                            <Col span={6} key={y}>
                                                <Checkbox
                                                    disabled={
                                                        val.chooseStudents === 2 ||
                                                        val.chooseStudents === 1
                                                            ? true
                                                            : false
                                                    }
                                                    checked={false}
                                                    value={val.coursePlanningId}
                                                    onChange={this.valCheckboxChange}
                                                >
                                                    {locale() != 'en' ? val.name : val.englishName}
                                                </Checkbox>
                                            </Col>
                                        ))}
                                    </Row>
                                ))}
                            </Checkbox.Group>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default Step2;
