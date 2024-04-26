import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Icon, Pagination, Skeleton } from 'antd';
import styles from './index.less';
import icon from '../../icon.less';
import { trans } from '../../utils/i18n';
import { Link } from 'dva/router';
import { preciseDate, formatDateIOS } from '../../utils/utils';

@connect((state) => ({
    studentCourseList: state.studentDetail.studentCourseList,
}))
export default class CourseStudentList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            pageSize: 9,
            total: 0,
            courseList: [],
            nitLoadData: false,
            IconFont: null, // 无选择课程下显示的icon
        };
    }

    componentWillMount() {
        const IconFonts = Icon.createFromIconfontCN({
            scriptUrl: '//at.alicdn.com/t/font_789461_1fg3v64pt92i.js',
        });
        this.setState({
            IconFont: IconFonts,
        });
        this.getList();
    }

    getList = () => {
        const { dispatch } = this.props;
        const { page, pageSize } = this.state;
        dispatch({
            type: 'studentDetail/getStudentListCourse',
            payload: {
                pageNum: page,
                pageSize,
            },
        }).then(() => {
            const { studentCourseList } = this.props;
            this.setState(
                {
                    page: studentCourseList.pageNum,
                    pageSize: studentCourseList.pageCount,
                    total: studentCourseList.total,
                    courseList: studentCourseList.choosePlanList,
                    initLoadData: true,
                },
                () => {
                    console.log(this.state.initLoadData, '....initLoadData');
                }
            );
        });
    };

    sizeChange = (pageNum, pageSize) => {
        this.setState(
            {
                page: 1,
                pageSize,
            },
            () => {
                this.getList();
            }
        );
    };

    pageChange = (page, pageSize) => {
        this.setState(
            {
                page,
                pageSize,
            },
            () => {
                this.getList();
            }
        );
    };

    toDetail = (item) => {
        console.log('item :>> ', item);
        console.log('studentCourseList :>> ', this.props.studentCourseList);
        let planMsg = JSON.stringify(item);
        localStorage.setItem('planMsg', planMsg);
        window.planMsg = planMsg;
    };

    render() {
        console.log(this.state.initLoadData, 'render......initLoadData');
        const { page, pageSize, total, courseList, initLoadData, IconFont } = this.state;
        if (!initLoadData) {
            return (
                <div className={styles.initLoadData}>
                    <Skeleton active />
                    <div style={{ margin: '24px 0' }}>
                        <Skeleton active />
                    </div>
                    <Skeleton active />
                </div>
            );
        }
        if (courseList && !courseList.length) {
            return (
                <div className={styles.courseStudentListNoData}>
                    {IconFont && (
                        <IconFont type="icon-chengguoweikong" style={{ fontSize: '80px' }} />
                    )}
                    <p className={styles.text}> {trans('list.nodata', '暂时没有开放的选课计划')}</p>
                </div>
            );
        }
        return (
            <div className={styles.courseStudentList}>
                <div className={styles.list}>
                    {courseList &&
                        courseList.length > 0 &&
                        courseList.map((item, index) => {
                            console.log(
                                preciseDate(item.startTime),
                                formatDateIOS(item.startTime),
                                '88888888'
                            );
                            let colors = item.type === 1 ? '#00a5b7' : '#e9b635';
                            let statusColor =
                                item.status === 1
                                    ? '#4d7fff'
                                    : item.status === 0
                                    ? '#e9b635'
                                    : '#666';
                            return (
                                <Link
                                    to={'/course/student/detail'}
                                    key={index}
                                    className={styles.linkCard}
                                >
                                    <div
                                        className={styles.card}
                                        onClick={this.toDetail.bind(this, item)}
                                    >
                                        <span className={styles.title}>
                                            <span className={styles.text}> {item.name} </span>
                                            {/* <span className={styles.status} style={{borderColor:colors, color:colors}} > {item.type === 1 ? trans("coursePlan.type.select",'志愿填报') : trans("coursePlan.type.take",'先到先得')} </span> */}
                                        </span>
                                        {item &&
                                        item.semesterModel &&
                                        item.semesterModel.officialSemesterName ? (
                                            <span className={styles.school}>
                                                {' '}
                                                {item.semesterModel.officialSemesterName} -{' '}
                                                {item.schoolName}{' '}
                                            </span>
                                        ) : (
                                            ''
                                        )}
                                        {/*  <span className={styles.school}>
                                            {' '}
                                            {item.semesterModel.officialSemesterName} -{' '}
                                            {item.schoolName}{' '}
                                        </span> */}
                                        <span className={styles.stage}>
                                            <Icon type="team" className={styles.icon} />
                                            <span className={styles.text}>
                                                {item.schoolSectionList &&
                                                    item.schoolSectionList.length > 0 &&
                                                    item.schoolSectionList.map((el, index) => {
                                                        return (
                                                            <span key={el.id}>
                                                                {' '}
                                                                {index ===
                                                                item.schoolSectionList.length - 1
                                                                    ? el.name
                                                                    : `${el.name},`}{' '}
                                                            </span>
                                                        );
                                                    })}
                                            </span>
                                        </span>
                                        <span className={styles.timeAndIcon}>
                                            <Icon className={styles.icon} type="profile" />
                                            &nbsp;
                                            <span className={styles.time}>
                                                {item.status === 0 ? (
                                                    <span className={styles.timeStage}>
                                                        {trans(
                                                            'select.startTime',
                                                            '{$startTime} 开始',
                                                            {
                                                                startTime: preciseDate(
                                                                    item.startTime
                                                                ),
                                                            }
                                                        )}
                                                    </span>
                                                ) : item.status === 1 ? (
                                                    <span className={styles.timeStage}>
                                                        {trans(
                                                            'select.endTime',
                                                            '{$endTime} 结束',
                                                            { endTime: preciseDate(item.endTime) }
                                                        )}
                                                    </span>
                                                ) : item.status === 3 ? (
                                                    <span></span>
                                                ) : (
                                                    <span>
                                                        {formatDateIOS(item.startTime)}{' '}
                                                        {`至 ${formatDateIOS(item.endTime)}`}
                                                    </span>
                                                )}

                                                {(item.status === 2 || item.status === 4) && (
                                                    <span className={styles.dian}> · </span>
                                                )}
                                                <span
                                                    className={styles.status}
                                                    style={{ color: statusColor }}
                                                >
                                                    {item.status === 2
                                                        ? trans(
                                                              'coursePlan.status.submited',
                                                              '已提交'
                                                          )
                                                        : item.status === 3
                                                        ? trans('coursePlan.status.ended', '已结束')
                                                        : item.status === 4
                                                        ? trans(
                                                              'coursePlan.status.notSubmited',
                                                              '未发布'
                                                          )
                                                        : null}
                                                </span>
                                            </span>
                                        </span>
                                        <span className={styles.selectData}>
                                            <span className={styles.select}>
                                                <span className={styles.num}>
                                                    {' '}
                                                    {item.numberOfOptionalCourses}{' '}
                                                </span>
                                                {trans('list.allowSelect', '可选课程')}
                                            </span>
                                            <span className={styles.selected}>
                                                <span className={styles.num}>
                                                    {' '}
                                                    {item.numberOfApplications}{' '}
                                                </span>
                                                {trans('list.selected', '已选报')}
                                            </span>
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                </div>
                <div className={styles.Pagination}>
                    <Pagination
                        showSizeChanger
                        onShowSizeChange={this.sizeChange}
                        onChange={this.pageChange}
                        current={page}
                        defaultPageSize={pageSize}
                        pageSizeOptions={['9', '12', '24', '36', '72']}
                        total={total}
                    />
                </div>
            </div>
        );
    }
}
