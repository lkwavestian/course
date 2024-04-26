import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { isEmpty } from 'lodash';

import { Spin, Tooltip, Icon } from 'antd';
import moment from 'moment';
import { intoChinese } from '../../../../utils/utils';

@connect((state) => ({
    listVersionChangeCourseRequest: state.replace.listVersionChangeCourseRequest,
}))
export default class ReplaceApplication extends PureComponent {
    state = {
        loading: false,
    };

    componentDidMount() {}

    getStatusSpan = (status) => {
        if (status === 0) {
            return <span className={styles.orangeText}>待审批</span>;
        }
        if (status === 1) {
            return <span className={styles.greenText}>动课完成</span>;
        }
        if (status === 2) {
            return <span className={styles.redText}>审批拒绝</span>;
        }
        if (status === 3) {
            return <span className={styles.redText}>已撤销</span>;
        }
        if (status === 4) {
            return <span className={styles.redText}>待教务处理</span>;
        }
    };

    getLessonDetail = (changeScheduleResultDTOList) => {
        return (
            <span className={styles.lessonDetailList}>
                {changeScheduleResultDTOList?.map((item) => {
                    //0：教务支持课节 1：自行安排换老师  2：自行安排换课
                    let type = item.actingTeacherList ? 1 : item.targetResult ? 2 : 0;
                    if (type === 0) {
                        return (
                            <span className={styles.replaceLessonDetailItem}>
                                <span
                                    className={styles.leftLessonItem}
                                    onClick={() => this.highLightLesson(item.sourceResult)}
                                >
                                    <span>
                                        {item.sourceResult.studentGroups[0].name
                                            .replace('（', '(')
                                            .replace('）', ')')}
                                    </span>
                                    <span>
                                        周{intoChinese(item.sourceResult.weekDay)}第
                                        {item.sourceResult.lesson}节{item.sourceResult.startTime}
                                    </span>
                                    <span>{item.sourceResult.courseName}</span>
                                </span>
                            </span>
                        );
                    }
                    if (type === 1) {
                        return (
                            <span className={styles.replaceLessonDetailItem}>
                                <span
                                    className={styles.leftLessonItem}
                                    onClick={() => this.highLightLesson(item.sourceResult)}
                                >
                                    <span>
                                        {item.sourceResult.studentGroups[0].name
                                            .replace('（', '(')
                                            .replace('）', ')')}
                                    </span>
                                    <span>
                                        周{intoChinese(item.sourceResult.weekDay)}第
                                        {item.sourceResult.lesson}节{item.sourceResult.startTime}
                                    </span>
                                    <span>{item.sourceResult.courseName}</span>
                                </span>
                                <span className={styles.rightTeacherItem}>
                                    <span>{item.actingTeacherList[0].name}</span>
                                    <span>代课</span>
                                </span>
                            </span>
                        );
                    }
                    if (type === 2) {
                        return (
                            <span className={styles.exchangeLessonDetailItem}>
                                <span
                                    className={styles.leftLessonItem}
                                    onClick={() =>
                                        this.highLightLesson(item.sourceResult, item.targetResult)
                                    }
                                >
                                    <span>
                                        {item.sourceResult.studentGroups[0].name
                                            .replace('（', '(')
                                            .replace('）', ')')}
                                    </span>
                                    <span>
                                        周{intoChinese(item.sourceResult.weekDay)}第
                                        {item.sourceResult.lesson}节{item.sourceResult.startTime}
                                    </span>
                                    <span>{item.sourceResult.courseName}</span>
                                </span>

                                <span>换课</span>
                                <span
                                    className={styles.rightLessonItem}
                                    onClick={() =>
                                        this.highLightLesson(item.targetResult, item.sourceResult)
                                    }
                                >
                                    <span>
                                        周{intoChinese(item.targetResult.weekDay)}第
                                        {item.targetResult.lesson}节{item.targetResult.startTime}
                                    </span>
                                    <span>{item.targetResult.courseName}</span>
                                </span>
                            </span>
                        );
                    }
                })}
            </span>
        );
    };

    toApplicationPage = (requestId) => {
        window.open(`/#/replace/index/application?requestId=${requestId}`);
    };

    getSystemVersionNumber = (changeScheduleResultDTOList) => {
        let res = [];
        changeScheduleResultDTOList?.map((item) => {
            if (item.realWeekVersionDTO && item.realWeekVersionDTO.systemVersionNumber) {
                res.push(item.realWeekVersionDTO.systemVersionNumber.slice(-2));
            }
        });
        return res.join('、');
    };

    //选取一条记录，利用id高亮其对应节点
    highLightLesson = (target, source) => {
        //通过退出调换课按钮判断是否在调换课状态下
        if (!document.getElementById('exitExchange')) {
            //取目标id元素存储其样式
            this.resumeStyle();
            if (source) {
                const { studentGroups, weekDay, lesson } = source;
                const sourceEle = document.getElementById(
                    `data-${studentGroups[0].id}-${lesson}-${weekDay}`
                );
                sourceEle && sourceEle.classList.add('sourceEle');
                sourceEle &&
                    sourceEle.scrollIntoView({
                        behavior: 'smooth',
                    });
            }
            if (target) {
                const { studentGroups, weekDay, lesson } = target;
                const targetEle = document.getElementById(
                    `data-${studentGroups[0].id}-${lesson}-${weekDay}`
                );
                targetEle && targetEle.classList.add('targetEle');
                targetEle &&
                    targetEle.scrollIntoView({
                        behavior: 'smooth',
                    });
            }
        }
    };

    //如果存在其他高亮节点，使其还原
    resumeStyle = () => {
        const sourceEle = document.getElementsByClassName('sourceEle');
        const targetEle = document.getElementsByClassName('targetEle');

        !isEmpty(sourceEle) &&
            Array.from(sourceEle).forEach((item) => {
                item.classList.remove('sourceEle');
            });

        !isEmpty(targetEle) &&
            Array.from(targetEle).forEach((item) => {
                item.classList.remove('targetEle');
            });
    };

    updateList = () => {
        const { dispatch, versionId } = this.props;
        this.setState(
            {
                loading: true,
            },
            () => {
                dispatch({
                    type: 'replace/getListVersionChangeCourseRequest',
                    payload: {
                        versionId,
                    },
                }).then(() => {
                    this.setState({
                        loading: false,
                    });
                });
            }
        );
    };

    render() {
        const { listVersionChangeCourseRequest } = this.props;
        const { loading } = this.state;
        return (
            <Spin spinning={loading}>
                <div className={styles.header}>
                    <a href="/#/replace/index" target="_blank" style={{ marginLeft: 20 }}>
                        全部申请
                    </a>
                    <a onClick={this.updateList}>
                        <Icon type="reload" />
                        刷新
                    </a>
                </div>

                <div className={styles.wrapper}>
                    {listVersionChangeCourseRequest.map((item) => (
                        <div className={styles.applicationWrapper}>
                            <div className={styles.applicationItem}>
                                <div className={styles.header}>
                                    <div
                                        className={styles.leftPart}
                                        onClick={() => this.toApplicationPage(item.id)}
                                    >
                                        <span>
                                            {this.getSystemVersionNumber(
                                                item.changeScheduleResultDTOList
                                            )}
                                        </span>

                                        <span>{item.teacherModel.name}</span>
                                        {item.requestDescription &&
                                        item.requestDescription?.length > 20 ? (
                                            <Tooltip title={item.requestDescription}>
                                                <span className={styles.requestDescription}>
                                                    {`${item.requestDescription.slice(0, 20)}...`}
                                                </span>
                                            </Tooltip>
                                        ) : (
                                            <span className={styles.requestDescription}>
                                                {item.requestDescription}
                                            </span>
                                        )}
                                    </div>
                                    <div className={styles.rightPart}>
                                        {(item.status === 4 || item.status === 0) &&
                                            item.arrangeType === 2 && (
                                                <span className={styles.requireNeed}>
                                                    <span className={styles.icon}></span>
                                                    <span className={styles.requireText}>
                                                        需支持
                                                    </span>
                                                </span>
                                            )}

                                        {this.getStatusSpan(item.status)}
                                    </div>
                                </div>
                                {item.changeCourseDetail && (
                                    <div className={styles.changeCourseDetail}>
                                        {item.changeCourseDetail}
                                    </div>
                                )}
                                <div className={styles.lessonDetail}>
                                    {this.getLessonDetail(item.changeScheduleResultDTOList)}
                                </div>
                            </div>
                            <div className={styles.divider}></div>
                        </div>
                    ))}
                </div>
            </Spin>
        );
    }
}
