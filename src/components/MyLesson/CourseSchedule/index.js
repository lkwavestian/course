import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon, Modal, Checkbox, Table, Spin } from 'antd';
import styles from './index.less';
import icon from '../../../icon.less';
import { intoChineseLang, intoChinese, intoChineseNumber } from '../../../utils/utils';
import ComplateSchedule from './ComplateSchedule/index.js';
import { trans } from '../../../utils/i18n';

@connect()
export default class CourseSchedule extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isExpend: true,
            scheduleVisible: false,
            weekAndLesson: '',
            planMsg: JSON.parse(localStorage.getItem('planMsg')) || JSON.parse(window.planMsg), // 选课计划信息
            startTime: '',
            endTime: '',
        };
    }

    componentDidMount() {
        // this.getSchedule()
    }

    componentWillReceiveProps(nextProps) {
        // 开课周期时间段为空，weekAndLesson初始化值，防止再次筛选后课表保留上次选中
        if (!nextProps.courseStartTime && !nextProps.courseEndTime) {
            this.setState({
                weekAndLesson: '',
            });
        }
        this.setState({
            startTime: nextProps.courseStartTime,
            endTime: nextProps.courseEndTime,
        });
    }

    expendSchedule = () => {
        this.setState({
            isExpend: !this.state.isExpend,
        });
        console.log('this.state.isExpend :>> ', this.state.isExpend);
    };

    // 查看完整课表
    viewCompleteSchedule = () => {
        // this.getComplateSchedule()
        const { courseDetail } = this.props;
        let calendar =
            location.origin.indexOf('daily') != -1
                ? 'https://calendar.daily.yungu-inc.org/#/index'
                : 'https://calendar.yungu.org/#/index';
        if (courseDetail && courseDetail.effectiveType) {
            window.open(calendar);
            return;
        }
        this.setState({
            scheduleVisible: true,
        });
    };

    // 选择小课表格子
    handleScheduleChange = (td) => {
        let tdId = td.weekDay + '_' + td.lesson;
        const { weekAndLesson } = this.state;
        if (weekAndLesson && weekAndLesson == tdId) {
            this.setState({
                weekAndLesson: '',
            });
            this.props.exportWeekAndLesson('', '');
        } else {
            this.setState({
                weekAndLesson: td.weekDay + '_' + td.lesson,
            });
            this.props.exportWeekAndLesson(td.weekDay, td.lesson);
        }
    };

    getSelectedTime = () => {
        const { weekAndLesson } = this.state;
        let selectedTime = weekAndLesson.split('_');
        // selectedTime = '周' + intoChinese(selectedTime[0]) + '第' +  selectedTime[1] + '节';
        selectedTime = trans('planDetail.optional.lessonName', '周{$day}第{$lesson}节', {
            day: intoChinese(selectedTime[0]),
            lesson: selectedTime[1],
        });
        return selectedTime;
    };

    render() {
        const {
            planStatus,
            scheduleList,
            courseIdList,
            courseStartTime,
            courseEndTime,
            courseStartPeriodList,
            tdHeight,
            loading,
            courseDetail,
        } = this.props;
        const { isExpend, scheduleVisible, weekAndLesson } = this.state;
        let calendar =
            location.origin.indexOf('daily') != -1
                ? 'https://calendar.daily.yungu-inc.org/#/index'
                : 'https://calendar.yungu.org/#/index';
        return (
            <div className={styles.courseSchedule}>
                <div className={styles.head}>
                    <span className={styles.title}>
                        {' '}
                        {trans('planDetail.shedule.title', '课表时间筛选')}
                    </span>
                    <span className={styles.checkSchedule} onClick={this.viewCompleteSchedule}>
                        {' '}
                        {trans('planDetail.shedule.view', '查看完整课表')}{' '}
                    </span>
                    <span className={styles.expend} onClick={this.expendSchedule}>
                        {trans('planDetail.shedule.close', '收起')}{' '}
                        <i className={`${icon.iconfont} ${isExpend ? styles.iconD : styles.iconU}`}>
                            &#xe614;
                        </i>
                    </span>
                    {weekAndLesson && (
                        <span className={styles.scheduleMention}>
                            {' '}
                            {trans(
                                'planDetail.shedule.selectedMention',
                                '已选择：{$num}； 再次点击可取消选择',
                                { num: this.getSelectedTime(weekAndLesson) }
                            )}
                        </span>
                    )}
                </div>
                {isExpend ? (
                    <div className={styles.schedule}>
                        {courseDetail.effectiveType ? (
                            <div className={styles.produced}>
                                <span className={styles.text}>
                                    {trans(
                                        'planDetail.shedule.complete',
                                        '选课结果已产生，具体上课时间请前往 日程-我的课表 查看'
                                    )}
                                </span>
                                <a className={styles.toSchedule} href={calendar} target="_blank">
                                    {' '}
                                    {trans('planDetail.shedule.link', '前往日程查看')}{' '}
                                </a>
                            </div>
                        ) : (
                            <div className={styles.scheduleContent}>
                                {courseStartTime && courseEndTime ? (
                                    loading ? (
                                        <div className={styles.example}>
                                            <Spin />{' '}
                                        </div>
                                    ) : (
                                        scheduleList &&
                                        scheduleList.map((item, index) => {
                                            return (
                                                <div className={styles.week} key={index}>
                                                    <span className={styles.header}>
                                                        {' '}
                                                        {trans('planDetail.weekDay', '周{$day}', {
                                                            day: intoChineseLang(index + 1),
                                                        })}{' '}
                                                    </span>
                                                    {item.list.map((el, i) => {
                                                        const differClass =
                                                            el.type === 0
                                                                ? styles.optional
                                                                : el.type === 1
                                                                ? styles.partOptional
                                                                : el.type === 2
                                                                ? styles.forbidden
                                                                : '';
                                                        const tdId = el.weekDay + '_' + el.lesson;
                                                        const borderColor =
                                                            weekAndLesson == tdId
                                                                ? '#4d7fff'
                                                                : '#fff';
                                                        return (
                                                            <span
                                                                className={styles.tds}
                                                                key={el.weekDay + '_' + el.lesson}
                                                                style={{
                                                                    height: tdHeight,
                                                                    lineHeight: tdHeight,
                                                                }}
                                                            >
                                                                <span
                                                                    style={{ borderColor }}
                                                                    className={
                                                                        styles.td +
                                                                        ' ' +
                                                                        differClass
                                                                    }
                                                                    onClick={this.handleScheduleChange.bind(
                                                                        this,
                                                                        el
                                                                    )}
                                                                >
                                                                    {el.type === 2
                                                                        ? trans(
                                                                              'planDetail.shedule.full',
                                                                              '已选满'
                                                                          )
                                                                        : ''}
                                                                </span>
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            );
                                        })
                                    )
                                ) : (
                                    <div className={styles.noData}>
                                        {trans('planDetail.shedule.metion', '选择开课周期进行筛选')}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : null}
                <Modal
                    // visible={true}
                    visible={scheduleVisible}
                    footer={null}
                    destroyOnClose={true}
                    width="100%"
                    className={styles.scheduleModal}
                    onCancel={() => {
                        this.setState({ scheduleVisible: false });
                    }}
                    style={{ top: '0', paddingBottom: '0' }}
                >
                    <ComplateSchedule
                        courseIdList={courseIdList}
                        courseStartPeriodList={courseStartPeriodList}
                    />
                </Modal>
            </div>
        );
    }
}
