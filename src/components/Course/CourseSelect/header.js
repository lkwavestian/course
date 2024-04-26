import React from 'react';
import styles from './header.less';
import { Icon, Popover } from 'antd';
import { Link } from 'dva/router';
import { trans, locale } from '../../../utils/i18n';
// 去除秒
function time(time) {
    if (time) {
        let arr = time.split(' ');
        if (arr.length >= 2) {
            return arr[0];
        }
        return time;
    }

    return '';
}

function HeaderItem(props) {
    const { conent, children, isAdmin } = props;
    function type(status) {
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
    }
    let sectionIds = [];
    conent &&
        conent.schoolSectionList &&
        conent.schoolSectionList.forEach((el) => {
            sectionIds.push(el.id);
        });
    return (
        <Link
            to={`/course/teacher/detail?planId=${conent.id}&planStatus=${
                conent.planStatus
            }&sectionIds=${sectionIds.join('_')}`}
            className={styles.Header}
            // target = '_blank'
        >
            <div className={styles.top}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
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
                    ? conent.semesterModel.officialSemesterName
                    : 'semesterModel 为null'}{' '}
                -{conent.schoolName}
            </div>
            <div className={styles.period}>
                <Icon type="team" className={styles.icon} />
                <span>
                    {conent &&
                        conent.schoolSectionList &&
                        conent.schoolSectionList.map((item, index) => {
                            return (
                                <span key={index}>
                                    {item.name}
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
                    {time(conent.startTime)} {trans('global.to', '至')} {time(conent.endTime)}
                    {/* <span className={styles.dian}></span> */}
                </span>
                <span className={styles.type} style={{ marginLeft: '15px' }}>
                    {type(conent.status)}
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
        </Link>
    );
}

export default HeaderItem;
