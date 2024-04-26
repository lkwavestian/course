import React, { PureComponent } from 'react';
import styles from './header.less';
import { Icon, Popover } from 'antd';
import { Link, routerRedux } from 'dva/router';
import { trans, locale } from '../../../utils/i18n';
import { getUrlSearch } from '../../../utils/utils';

class Card extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // 去除秒
    time = (time) => {
        if (time) {
            let arr = time.split(' ');
            if (arr.length >= 2) {
                return arr[0];
            }
            return time;
        }

        return '';
    };

    toDetail = (conent, sectionIds) => {
        sectionIds = sectionIds && sectionIds.join('_');
        let planId = conent && conent.id;
        let planStatus = conent && conent.planStatus;
        if (window.top != window.self) {
            //task里面的iframe页面
            let origin = '';
            if (typeof homeHost != 'undefined' && typeof homeHost == 'string') {
                if (homeHost != '') {
                    origin = 'https://' + homeHost;
                } else {
                    origin =
                        window.location.origin.indexOf('yungu.org') > -1
                            ? 'https://task.yungu.org'
                            : 'https://task.daily.yungu-inc.org';
                }
            } else {
                origin =
                    window.location.origin.indexOf('yungu.org') > -1
                        ? 'https://task.yungu.org'
                        : 'https://task.daily.yungu-inc.org';
            }
            console.log(origin, 'origin');
            window.parent.location.href =
                getUrlSearch('ifOutside') && getUrlSearch('ifOutside') == 'true'
                    ? `${origin}/#/schedule/detail/${planId}/${planStatus}/${sectionIds}`
                    : `${origin}/#/newDetail/${planId}/${planStatus}/${sectionIds}`;
        } else {
            //course项目页面
            this.props.dispatch(
                routerRedux.push(
                    `/course/teacher/detail?planId=${planId}&planStatus=${planStatus}&sectionIds=${sectionIds}`
                )
            );
        }
    };

    type = (status) => {
        switch (status) {
            case 0:
                return trans('course.header.not.start', '未开始');
            case 1:
                return trans('course.header.have.in.hand', '进行中');
            case 2:
                return trans('course.header.submitted', '已提交');
            case 3:
                return trans('course.header.finished', '已结束');
            case 4:
                return trans('course.header.unpublished', '未发布');
            default:
                return null;
        }
    };

    render() {
        const { conent, children, isAdmin } = this.props;
        let sectionIds = [];
        conent &&
            conent.schoolSectionList &&
            conent.schoolSectionList.forEach((el) => {
                sectionIds.push(el.id);
            });
        return (
            <div
                className={styles.Header}
                onClick={() => this.toDetail(conent, sectionIds)}
                style={{ cursor: 'pointer' }}
            >
                <div className={styles.top}>
                    <div
                        style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}
                    >
                        {/* <Link to={`/course/teacher/detail?planId=${conent.id}&sectionIds=${sectionIds.join("_")}`}> */}
                        <span className={styles.title}>
                            {locale() == 'en' ? conent.ename : conent.name}
                        </span>
                        {conent.planStatus === 0 ? (
                            <span
                                className={styles.type}
                                style={{ color: '#17D9FF', backgroundColor: '#E5FBFE' }}
                            >
                                {trans('global.Not Start', '未开始')}
                            </span>
                        ) : conent.planStatus === 1 ? (
                            <span
                                className={styles.type}
                                style={{ color: '#00CB4A', backgroundColor: '#E3FFEE' }}
                            >
                                {trans('global.In Teacher Filling', '申报中')}
                            </span>
                        ) : conent.planStatus === 2 ? (
                            <span
                                className={styles.type}
                                style={{ color: '#E1870E', backgroundColor: '#FFE2C7' }}
                            >
                                {trans('global.Teacher Filling Finished', '申报结束')}
                            </span>
                        ) : conent.planStatus === 3 ? (
                            <span
                                className={styles.type}
                                style={{ color: '#00F13C', backgroundColor: '#E3FFEE' }}
                            >
                                {trans('global.In Student Selection', '选课中')}
                            </span>
                        ) : conent.planStatus === 4 ? (
                            <span
                                className={styles.type}
                                style={{ color: '#FF6C00', backgroundColor: '#FFF4E7' }}
                            >
                                {trans('global.Teacher Filling Finished', '选课结束')}
                            </span>
                        ) : conent.planStatus === 5 ? (
                            <span
                                className={styles.type}
                                style={{ color: '#808AA0', backgroundColor: '#EFF0F3' }}
                            >
                                {trans('global.Course started', '已开课')}
                            </span>
                        ) : conent.planStatus === 6 ? (
                            ''
                        ) : null}

                        {/* </Link> */}
                    </div>
                    {/* {isAdmin && (
                    <Popover placement="bottom" content={props.children}>
                        <Icon className={styles.icon} type="ellipsis" />
                    </Popover>
                )} */}
                </div>
                <div className={styles.desc}>
                    {conent.semesterModel
                        ? locale() !== 'en'
                            ? conent.semesterModel.officialSemesterName
                            : conent.semesterModel.officialEnName
                        : 'semesterModel 为null'}{' '}
                    - {locale() !== 'en' ? conent.schoolName : conent.schoolEnName}
                </div>
                <div className={styles.period}>
                    <Icon type="team" className={styles.icon} />
                    <span>
                        {conent &&
                            conent.schoolSectionList &&
                            conent.schoolSectionList.map((item, index) => {
                                return (
                                    <span key={index}>
                                        {locale() !== 'en' ? item.name : item.enName}
                                        {conent.schoolSectionList.length - 1 === index
                                            ? null
                                            : '、'}{' '}
                                    </span>
                                );
                            })}
                    </span>
                </div>
                <div className={styles.time}>
                    <Icon className={styles.icon} type="profile" />
                    {conent.planStatus == 0 || conent.planStatus == 1 || conent.planStatus == 2
                        ? trans('global.Teacher Filling Time', '申报时间')
                        : conent.planStatus == 3 || conent.planStatus == 4
                        ? trans('global.Student Selection Time', '选课时间')
                        : conent.planStatus == 5
                        ? trans('global.Course Duration', '开课时间')
                        : trans('global.Course Duration', '开课时间')}
                    &nbsp;
                    <span className={styles.se}>
                        {this.time(conent.startTime)} {trans('global.to', '至')}{' '}
                        {this.time(conent.endTime)}
                        {/* <span className={styles.dian}></span> */}
                    </span>
                    <span className={styles.type} style={{ marginLeft: '15px' }}>
                        {this.type(conent.status)}
                    </span>
                </div>
                <div className={styles.bottom}>
                    <div className={styles.item}>
                        <span className={styles.num}>{conent.numberOfCourses}</span>
                        {trans('course.header.course.selection', '参选课程')}
                    </div>
                    <div className={`${styles.item} ${styles.mid}`}>
                        <span className={styles.num}>{conent.numberOfStudents}</span>
                        {trans('course.header.student.participation', '参与学生')}
                    </div>
                    {/* <div className={styles.item}>
                    <span className={styles.num}>{conent.numberOfStudentsSubmitted}</span>
                    {trans('course.header.completed', '已完成')}
                </div> */}
                </div>
            </div>
        );
    }
}

export default Card;
