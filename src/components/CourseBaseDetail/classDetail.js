import React, { Fragment } from 'react';
import styles from './student.less';
import { trans, locale } from '../../utils/i18n';
import { formatTimeSafari } from '../../utils/utils';

function ClassDetail(props) {
    let groupType = [
        trans('course.basedetail.base.administrative.class', '行政班'),
        trans('course.basedetail.base.elective.class', '选修班'),
        trans('course.basedetail.base.teaching.class', '教学班'),
        trans('course.basedetail.base.college.class', '学院'),
        trans('course.basedetail.base.stratified.class', '分层班'),
        trans('course.basedetail.base.nature.class', '自然班（初中分班）'),
    ];
    function time(date) {
        let d = new Date(formatTimeSafari(date));
        let y = d.getFullYear();
        let m = d.getMonth() + 1;
        let r = d.getDate();
        m = m <= 9 ? `0${m}` : m;
        r = r <= 9 ? `0${r}` : r;
        return `${y}-${m}-${r}`;
    }

    return (
        <div className={styles.groupDetail}>
            <span className={styles.title}>
                {trans('course.basedetail.class.detail', '班级详情')}
            </span>
            <span className={styles.detailItem}>
                <span className={styles.label}>
                    {trans('course.basedetail.class.type', '班级类型')}
                </span>
                <span className={styles.text}> {groupType[props.type - 1]} </span>
            </span>
            <span className={styles.detailItem}>
                <span className={styles.label}>
                    {trans('course.basedetail.class.capacity', '班级容量')}
                </span>
                <span className={styles.text}>
                    {' '}
                    {props.minStudent || 0} - {props.maxStudent || 0} 人
                </span>
            </span>
            <span className={styles.detailItem}>
                <span className={styles.label}>
                    {trans('course.basedetail.master.teacher', '主教老师')}
                </span>
                <span className={styles.text}>
                    {props.teacherList &&
                        props.teacherList.map((el, i) => (
                            <Fragment key={i}>
                                {el.teacherType === 0
                                    ? locale() != 'en'
                                        ? el.name
                                        : el.ename
                                    : null}
                            </Fragment>
                        ))}
                </span>
            </span>
            <span className={styles.detailItem}>
                <span className={styles.label}>
                    {trans('course.basedetail.sub.teacher', '助教老师')}
                </span>
                <span className={styles.text}>
                    {props.teacherList &&
                        props.teacherList.map((el, i) => (
                            <Fragment key={i}>
                                {el.teacherType === 1
                                    ? locale() != 'en'
                                        ? el.name
                                        : el.ename
                                    : null}
                            </Fragment>
                        ))}
                </span>
            </span>
            <span className={styles.detailItem}>
                <span className={styles.label}>
                    {trans('course.basedetail.open.time', '开课时间')}
                </span>
                <span className={styles.text}>
                    {time(props.startTime)} 至 {time(props.endTime)}
                </span>
            </span>
            <span className={styles.detailItem}>
                <span className={styles.label}>
                    {trans('course.setup.applicable.site', '适用场地')}
                </span>
                <span className={styles.text}>
                    {props.siteList &&
                        props.siteList.map((el, i) => (
                            <Fragment key={i}>
                                {locale() != 'en' ? el.name : el.ename}{' '}
                                {props.siteList.length - 1 === i ? null : ','}
                            </Fragment>
                        ))}
                </span>
            </span>
            <span className={styles.detailItem}>
                <span className={styles.label}>
                    {trans('course.basedetail.class.status', '班级状态')}
                </span>
                <span className={styles.text}>
                    {props.classStart === 0
                        ? trans('course.header.to.begin', '待开始')
                        : props.classStart === 1
                        ? trans('course.header.have.in.hand', '进行中')
                        : trans('course.header.finished', '已结束')}
                </span>
            </span>
        </div>
    );
}

export default ClassDetail;
