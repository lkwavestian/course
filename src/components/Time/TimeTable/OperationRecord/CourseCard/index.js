import React, { Component } from 'react';
import styles from './index.less';
import lodash from 'lodash';
import { trans, locale } from '../../../../../utils/i18n';

export default class CourseCard extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    //如果存在其他高亮节点，使其还原
    resumeStyle = () => {
        const sourceEle = document.getElementsByClassName('sourceEle');
        const targetEle = document.getElementsByClassName('targetEle');

        !lodash.isEmpty(sourceEle) &&
            Array.from(sourceEle).forEach((item) => {
                item.classList.remove('sourceEle');
            });

        !lodash.isEmpty(targetEle) &&
            Array.from(targetEle).forEach((item) => {
                item.classList.remove('targetEle');
            });
    };

    //选取一条记录，利用id高亮其对应节点
    highLightLesson = (source, target, durationSource, direction, noShowSecond, durationTarget) => {
        //通过退出调换课按钮判断是否在调换课状态下

        if (!document.getElementById('exitExchange')) {
            //取目标id元素存储其样式
            this.resumeStyle();

            //正方向
            if (direction) {
                if (source) {
                    const {
                        groupModelList: sourceGroupList,
                        weekDay: sourceWeekDay,
                        lesson: sourceLesson,
                    } = source;

                    if (sourceGroupList) {
                        const sourceEle = document.getElementById(
                            `data-${sourceGroupList[0].id}-${sourceLesson}-${sourceWeekDay}`
                        );
                        sourceEle && sourceEle.classList.add('sourceEle');
                        sourceEle &&
                            sourceEle.scrollIntoView({
                                behavior: 'smooth',
                            });
                    }
                }

                if (durationSource) {
                    const {
                        groupModelList: sourceGroupList,
                        weekDay: sourceWeekDay,
                        lesson: sourceLesson,
                    } = durationSource;

                    if (sourceGroupList) {
                        const sourceEle = document.getElementById(
                            `data-${sourceGroupList[0].id}-${sourceLesson + 1}-${sourceWeekDay}`
                        );
                        sourceEle && sourceEle.classList.add('sourceEle');
                        sourceEle &&
                            sourceEle.scrollIntoView({
                                behavior: 'smooth',
                            });
                    }
                }

                if (target && noShowSecond) {
                    const {
                        groupModelList: targetGroupList,
                        weekDay: targetWeekDay,
                        lesson: targetLesson,
                    } = target;

                    if (targetGroupList) {
                        console.log('targetLesson :>> ', targetLesson);
                        const targetEle = document.getElementById(
                            `data-${targetGroupList[0].id}-${targetLesson}-${targetWeekDay}`
                        );
                        targetEle && targetEle.classList.add('targetEle');
                        targetEle &&
                            targetEle.scrollIntoView({
                                behavior: 'smooth',
                            });
                    }
                }

                if (target && !noShowSecond) {
                    const {
                        groupModelList: targetGroupList,
                        weekDay: targetWeekDay,
                        lesson: targetLesson,
                    } = target;

                    if (targetGroupList) {
                        const targetEle = document.getElementById(
                            `data-${targetGroupList[0].id}-${targetLesson + 1}-${targetWeekDay}`
                        );
                        targetEle && targetEle.classList.add('targetEle');
                        targetEle &&
                            targetEle.scrollIntoView({
                                behavior: 'smooth',
                            });
                    }
                }
            } else {
                if (source && noShowSecond) {
                    const {
                        groupModelList: sourceGroupList,
                        weekDay: sourceWeekDay,
                        lesson: sourceLesson,
                    } = source;

                    if (sourceGroupList) {
                        const sourceEle = document.getElementById(
                            `data-${sourceGroupList[0].id}-${sourceLesson}-${sourceWeekDay}`
                        );
                        sourceEle && sourceEle.classList.add('sourceEle');
                        sourceEle &&
                            sourceEle.scrollIntoView({
                                behavior: 'smooth',
                            });
                    }
                }

                if (target) {
                    const {
                        groupModelList: targetGroupList,
                        weekDay: targetWeekDay,
                        lesson: targetLesson,
                    } = target;

                    if (targetGroupList) {
                        const targetEle = document.getElementById(
                            `data-${targetGroupList[0].id}-${targetLesson}-${targetWeekDay}`
                        );

                        console.log('targetEle :>> ', targetEle);
                        targetEle && targetEle.classList.add('targetEle');
                        targetEle &&
                            targetEle.scrollIntoView({
                                behavior: 'smooth',
                            });
                    }
                }

                if (durationTarget) {
                    const {
                        groupModelList: targetGroupList,
                        weekDay: targetWeekDay,
                        lesson: targetLesson,
                    } = durationTarget;

                    if (targetGroupList) {
                        const targetEle = document.getElementById(
                            `data-${targetGroupList[0].id}-${targetLesson + 1}-${targetWeekDay}`
                        );

                        console.log('targetEle :>> ', targetEle);
                        targetEle && targetEle.classList.add('targetEle');
                        targetEle &&
                            targetEle.scrollIntoView({
                                behavior: 'smooth',
                            });
                    }
                }

                if (source && !noShowSecond) {
                    const {
                        groupModelList: sourceGroupList,
                        weekDay: sourceWeekDay,
                        lesson: sourceLesson,
                    } = source;

                    if (sourceGroupList) {
                        const durationSourceEle = document.getElementById(
                            `data-${sourceGroupList[0].id}-${sourceLesson + 1}-${sourceWeekDay}`
                        );
                        durationSourceEle && durationSourceEle.classList.add('sourceEle');
                        durationSourceEle &&
                            durationSourceEle.scrollIntoView({
                                behavior: 'smooth',
                            });
                    }
                }

                if (durationSource) {
                    const {
                        groupModelList: sourceGroupList,
                        weekDay: sourceWeekDay,
                        lesson: sourceLesson,
                    } = durationSource;

                    if (sourceGroupList) {
                        const sourceEle = document.getElementById(
                            `data-${sourceGroupList[0].id}-${sourceLesson + 1}-${sourceWeekDay}`
                        );
                        sourceEle && sourceEle.classList.add('sourceEle');
                        sourceEle &&
                            sourceEle.scrollIntoView({
                                behavior: 'smooth',
                            });
                    }
                }
            }
        }
    };

    handleClick = (e) => {
        e.stopPropagation();
        const { source, target, durationSource, direction, noShowSecond, durationTarget } =
            this.props;
        this.highLightLesson(
            source,
            target,
            durationSource,
            direction,
            noShowSecond,
            durationTarget
        );
    };

    render() {
        const {
            courseCardCode,
            //courseCardCode对应情况
            /* 

      1: 灰色背景 全信息
      2: 白色背景 待排、weekDay、lesson
      3: 白色背景 weekDay、lesson
      4: 白色背景 待排课
      5: 白色背景 待排 weekDay、lesson、lesson+1
    */
            lesson,
            course,
            group,
            durationGroup,
        } = this.props;
        let map = new Map(
            locale() !== 'en'
                ? [
                      [1, '一'],
                      [2, '二'],
                      [3, '三'],
                      [4, '四'],
                      [5, '五'],
                      [6, '六'],
                      [7, '七'],
                  ]
                : [
                      [1, '1'],
                      [2, '2'],
                      [3, '3'],
                      [4, '4'],
                      [5, '5'],
                      [6, '6'],
                      [7, '7'],
                  ]
        );

        let weekDay = map.get(this.props.weekDay);
        return (
            <div>
                {courseCardCode === '1' ? (
                    <div className={styles.courseCard} tabIndex="-1" onClick={this.handleClick}>
                        <div className={styles.courseCardInner}>
                            <div>
                                <span className={styles.cardWeekDay}>
                                    {trans('global.cardWeekDay', '周{$weekDay}  第{$lesson}节', {
                                        weekDay: weekDay,
                                        lesson: lesson,
                                    })}
                                </span>
                                {/* &nbsp; */}
                                {/* <span className={styles.cardLesson}>第{lesson}节</span> */}
                            </div>
                            <div>
                                {course === group ? (
                                    <span className={styles.cardCourse}>{course}</span>
                                ) : (
                                    <span>
                                        <span className={styles.cardCourse}>{course}</span>
                                        &nbsp;
                                        <span>
                                            <span className={styles.cardGroup}>{group}</span>
                                            {durationGroup ? (
                                                <span>
                                                    <br />
                                                    <span className={styles.cardGroup}>
                                                        {durationGroup}
                                                    </span>
                                                </span>
                                            ) : (
                                                ''
                                            )}
                                        </span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ) : courseCardCode === '3' ? (
                    <div className={styles.blankCourseCard} tabIndex="-1">
                        <div className={styles.courseCardInner}>
                            <div>
                                <span className={styles.cardWeekDay}>
                                    {trans('global.cardWeekDay', '周{$weekDay}  第{$lesson}节', {
                                        weekDay: weekDay,
                                        lesson: lesson,
                                    })}
                                </span>
                                {/* &nbsp;
                                <span className={styles.cardLesson}>第{lesson}节</span> */}
                            </div>
                        </div>
                    </div>
                ) : courseCardCode === '2' ? (
                    <div className={styles.blankCourseCard} tabIndex="-1">
                        <div className={styles.courseCardInner}>
                            <div>
                                <span className={styles.waitArrange}>
                                    {trans('global.waitArrange', '待排')}
                                </span>
                            </div>
                            <div>
                                {course === group ? (
                                    <span className={styles.cardCourse}>{course}</span>
                                ) : (
                                    <span>
                                        <span className={styles.cardCourse}>{course}</span>
                                        &nbsp;
                                        <span>
                                            <span className={styles.cardGroup}>{group}</span>
                                            {durationGroup ? (
                                                <span>
                                                    <br />
                                                    <span className={styles.cardGroup}>
                                                        {durationGroup}
                                                    </span>
                                                </span>
                                            ) : (
                                                ''
                                            )}
                                        </span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ) : courseCardCode === '4' ? (
                    <div
                        className={styles.courseCard}
                        style={{
                            backgroundColor: '#fff',
                            border: '1px solid rgba(1,17,61,0.10)',
                        }}
                    >
                        <div className={styles.courseCardInner}>
                            <div>
                                <span className={styles.waitArrange}>
                                    {trans('global.waitArrange', '待排')}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={styles.blankCourseCard} tabIndex="-1">
                        <div className={styles.courseCardInner}>
                            <div>
                                <span className={styles.cardWeekDay}>
                                    {trans(
                                        'global.cardWeekDayTwo',
                                        '周{$weekDay}  第{$lesson}节 第{$lessonTwo}节',
                                        {
                                            weekDay: weekDay,
                                            lesson: lesson,
                                            lessonTwo: lesson + 1,
                                        }
                                    )}
                                </span>
                                {/* &nbsp;
                                <span className={styles.cardLesson}>第{lesson}节</span> &nbsp; */}
                                {/* <span className={styles.cardLesson}>第{lesson + 1}节</span> */}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
