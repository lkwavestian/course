import React, { Component } from 'react';
import styles from './index.less';
import { message } from 'antd';
import { trans, locale } from '../../../../../utils/i18n';

export default class index extends Component {
    constructor(props) {
        super(props);
    }

    judgeRepeat = (id, name) => {
        const { scheduleData } = this.props;
        let isRepeat = false;
        for (let i = 0; i < (scheduleData && scheduleData.length); i++) {
            if (
                scheduleData[i].studentGroup.id == id &&
                scheduleData[i].studentGroup.name == name
            ) {
                isRepeat = true;
                break;
            }
        }

        return isRepeat;
    };

    getSchedule = (id, type, name, e) => {
        e.stopPropagation();
        const { tableView } = this.props;
        if (tableView === 'weekLessonView') {
            const { getCustomScheduleInLessonView } = this.props;
            getCustomScheduleInLessonView(type, id);
        } else {
            // 判断课表中添加的老师是否与当前点击的相等，若相等，课表已存在不添加
            if (this.judgeRepeat(id, name)) {
                if (type == 'teacher') {
                    message.info('课表已存在该教师');
                } else if (type == 'address') {
                    message.info('课表已存在该场地');
                }
                return;
            }
            const { dispatch, currentVersion, searchIndex, showExchangeClassTable } = this.props;
            let url = '';
            const params = {};
            params.id = currentVersion;
            params.actionType = searchIndex == 5 && !showExchangeClassTable ? 'custom' : 'detail';
            if (type == 'teacher') {
                url = 'timeTable/findTeacherSchedule';
                params.teacherIds = [id];
                delete params.playgroundIds;
            } else if (type == 'address') {
                url = 'timeTable/findFieldSchedule';
                params.playgroundIds = [id];
                delete params.teacherIds;
            } else {
                url = '';
            }
            dispatch({
                type: url,
                payload: params,
            });
        }
    };
    render() {
        const {
            sourceAddressList,
            sourceCourseList,
            sourceGroupList,
            targetAddressList,
            targetCourseList,
            targetGroupList,
            durationTargetAddressList,
            durationTargetCourseList,
            durationTargetGroupList,
        } = this.props;
        return (
            <div>
                {sourceAddressList && sourceAddressList[0] && sourceAddressList[0].ifChange ? (
                    sourceAddressList.length === 2 ? (
                        <p className={styles.conflict}>
                            {trans('global.The space of', '系统将')}
                            <span className={styles.course}>
                                {locale() !== 'en'
                                    ? sourceCourseList[0].name
                                    : sourceCourseList[0].englishName}
                            </span>
                            {sourceCourseList[0].name !== sourceGroupList[0].name ? (
                                <span className={styles.group}>
                                    {locale() !== 'en'
                                        ? sourceGroupList[0].name
                                        : sourceGroupList[0].ename}
                                </span>
                            ) : (
                                ''
                            )}
                            {trans('global.was changed by system', '的场地由')}
                            {sourceAddressList.find((item) => !item.addressType) ? (
                                <span
                                    className={styles.address}
                                    onClick={this.getSchedule.bind(
                                        this,
                                        sourceAddressList.find((item) => !item.addressType).id,
                                        'address',
                                        sourceAddressList.find((item) => !item.addressType).name
                                    )}
                                >
                                    {sourceAddressList.find((item) => !item.addressType).name}
                                </span>
                            ) : (
                                <span className={styles.noAddress}>
                                    {trans('global.noAddress', '无')}
                                </span>
                            )}
                            <span className={styles.conflictSingleArrow}>
                                <span className={styles.singleConnectLines}></span>
                                <span className={styles.singleChangeArrow}></span>
                            </span>
                            {sourceAddressList.find((item) => item.addressType) ? (
                                <span
                                    className={styles.address}
                                    onClick={this.getSchedule.bind(
                                        this,
                                        sourceAddressList.find((item) => item.addressType).id,
                                        'address',
                                        sourceAddressList.find((item) => item.addressType).name
                                    )}
                                >
                                    {sourceAddressList.find((item) => item.addressType).name}
                                </span>
                            ) : (
                                <span className={styles.noAddress}>
                                    {trans('global.noAddress', '无')}
                                </span>
                            )}
                        </p>
                    ) : (
                        <p className={styles.conflict}>
                            {trans('global.The space of', '系统将')}
                            <span className={styles.course}>
                                {locale() !== 'en'
                                    ? sourceCourseList[0].name
                                    : sourceCourseList[0].englishName}
                            </span>
                            {sourceCourseList[0].name !== sourceGroupList[0].name ? (
                                <span className={styles.group}>
                                    {locale() !== 'en'
                                        ? sourceGroupList[0].name
                                        : sourceGroupList[0].ename}
                                </span>
                            ) : (
                                ''
                            )}
                            {trans('global.was changed by system', '的场地由')}
                            {sourceAddressList.find((item) => !item.addressType) ? (
                                <span
                                    className={styles.address}
                                    onClick={this.getSchedule.bind(
                                        this,
                                        sourceAddressList.find((item) => !item.addressType).id,
                                        'address',
                                        sourceAddressList.find((item) => !item.addressType).name
                                    )}
                                >
                                    {sourceAddressList.find((item) => !item.addressType).name}
                                </span>
                            ) : (
                                <span className={styles.noAddress}>
                                    {trans('global.noAddress', '无')}
                                </span>
                            )}
                            <span className={styles.conflictSingleArrow}>
                                <span className={styles.singleConnectLines}></span>
                                <span className={styles.singleChangeArrow}></span>
                            </span>
                            {sourceAddressList.find((item) => item.addressType) ? (
                                <span
                                    className={styles.address}
                                    onClick={this.getSchedule.bind(
                                        this,
                                        sourceAddressList.find((item) => item.addressType).id,
                                        'address',
                                        sourceAddressList.find((item) => item.addressType).name
                                    )}
                                >
                                    {sourceAddressList.find((item) => item.addressType).name}
                                </span>
                            ) : (
                                <span className={styles.noAddress}>
                                    {trans('global.noAddress', '无')}
                                </span>
                            )}
                        </p>
                    )
                ) : null}

                {targetAddressList && targetAddressList[0] && targetAddressList[0].ifChange ? (
                    targetAddressList.length === 2 ? (
                        <p className={styles.conflict}>
                            {trans('global.The space of', '系统将')}
                            <span className={styles.course}>{targetCourseList[0].name}</span>
                            {targetCourseList[0].name !== targetGroupList[0].name ? (
                                <span className={styles.group}>{targetGroupList[0].name}</span>
                            ) : (
                                ''
                            )}
                            {trans('global.was changed by system', '的场地由')}
                            {targetAddressList.find((item) => !item.addressType) ? (
                                <span
                                    className={styles.address}
                                    onClick={this.getSchedule.bind(
                                        this,
                                        targetAddressList.find((item) => !item.addressType).id,
                                        'address',
                                        targetAddressList.find((item) => !item.addressType).name
                                    )}
                                >
                                    {targetAddressList.find((item) => !item.addressType).name}
                                </span>
                            ) : (
                                <span className={styles.noAddress}>
                                    {trans('global.noAddress', '无')}
                                </span>
                            )}
                            <span className={styles.conflictSingleArrow}>
                                <span className={styles.singleConnectLines}></span>
                                <span className={styles.singleChangeArrow}></span>
                            </span>
                            {targetAddressList.find((item) => item.addressType) ? (
                                <span
                                    className={styles.address}
                                    onClick={this.getSchedule.bind(
                                        this,
                                        targetAddressList.find((item) => item.addressType).id,
                                        'address',
                                        targetAddressList.find((item) => item.addressType).name
                                    )}
                                >
                                    {targetAddressList.find((item) => item.addressType).name}
                                </span>
                            ) : (
                                <span className={styles.noAddress}>
                                    {trans('global.noAddress', '无')}
                                </span>
                            )}
                        </p>
                    ) : (
                        <p className={styles.conflict}>
                            {trans('global.The space of', '系统将')}
                            <span className={styles.course}>{targetCourseList[0].name}</span>
                            {targetCourseList[0].name !== targetGroupList[0].name ? (
                                <span className={styles.group}>{targetGroupList[0].name}</span>
                            ) : (
                                ''
                            )}
                            {trans('global.was changed by system', '的场地由')}
                            {targetAddressList.find((item) => !item.addressType) ? (
                                <span
                                    className={styles.address}
                                    onClick={this.getSchedule.bind(
                                        this,
                                        targetAddressList.find((item) => !item.addressType).id,
                                        'address',
                                        targetAddressList.find((item) => !item.addressType).name
                                    )}
                                >
                                    {targetAddressList.find((item) => !item.addressType).name}
                                </span>
                            ) : (
                                <span className={styles.noAddress}>
                                    {trans('global.noAddress', '无')}
                                </span>
                            )}
                            <span className={styles.conflictSingleArrow}>
                                <span className={styles.singleConnectLines}></span>
                                <span className={styles.singleChangeArrow}></span>
                            </span>
                            {targetAddressList.find((item) => item.addressType) ? (
                                <span
                                    className={styles.address}
                                    onClick={this.getSchedule.bind(
                                        this,
                                        targetAddressList.find((item) => item.addressType).id,
                                        'address',
                                        targetAddressList.find((item) => item.addressType).name
                                    )}
                                >
                                    {targetAddressList.find((item) => item.addressType).name}
                                </span>
                            ) : (
                                <span className={styles.noAddress}>
                                    {trans('global.noAddress', '无')}
                                </span>
                            )}
                        </p>
                    )
                ) : null}

                {/* 处理连堂课情况 */}
                {durationTargetAddressList &&
                durationTargetAddressList[1] &&
                durationTargetAddressList[1].ifChange ? (
                    durationTargetAddressList.length === 2 ? (
                        <p className={styles.conflict}>
                            {trans('global.The space of', '系统将')}
                            <span className={styles.course}>
                                {durationTargetCourseList[0].name}
                            </span>
                            {durationTargetCourseList[0].name !==
                            durationTargetGroupList[0].name ? (
                                <span className={styles.group}>
                                    {durationTargetGroupList[0].name}
                                </span>
                            ) : (
                                ''
                            )}
                            {trans('global.was changed by system', '的场地由')}
                            {durationTargetAddressList.find((item) => !item.addressType) ? (
                                <span
                                    className={styles.address}
                                    onClick={this.getSchedule.bind(
                                        this,
                                        durationTargetAddressList.find((item) => !item.addressType)
                                            .id,
                                        'address',
                                        durationTargetAddressList.find((item) => !item.addressType)
                                            .name
                                    )}
                                >
                                    {
                                        durationTargetAddressList.find((item) => !item.addressType)
                                            .name
                                    }
                                </span>
                            ) : (
                                <span className={styles.noAddress}>
                                    {trans('global.noAddress', '无')}
                                </span>
                            )}
                            <span className={styles.conflictSingleArrow}>
                                <span className={styles.singleConnectLines}></span>
                                <span className={styles.singleChangeArrow}></span>
                            </span>
                            {durationTargetAddressList.find((item) => item.addressType) ? (
                                <span
                                    className={styles.address}
                                    onClick={this.getSchedule.bind(
                                        this,
                                        durationTargetAddressList.find((item) => item.addressType)
                                            .id,
                                        'address',
                                        durationTargetAddressList.find((item) => item.addressType)
                                            .name
                                    )}
                                >
                                    {
                                        durationTargetAddressList.find((item) => item.addressType)
                                            .name
                                    }
                                </span>
                            ) : (
                                <span className={styles.noAddress}>
                                    {trans('global.noAddress', '无')}
                                </span>
                            )}
                        </p>
                    ) : (
                        <p className={styles.conflict}>
                            {trans('global.The space of', '系统将')}
                            <span className={styles.course}>
                                {durationTargetCourseList[0].name}
                            </span>
                            {durationTargetCourseList[0].name !==
                            durationTargetGroupList[0].name ? (
                                <span className={styles.group}>
                                    {durationTargetGroupList[0].name}
                                </span>
                            ) : (
                                ''
                            )}
                            {trans('global.was changed by system', '的场地由')}
                            {durationTargetAddressList.find((item) => !item.addressType) ? (
                                <span
                                    className={styles.address}
                                    onClick={this.getSchedule.bind(
                                        this,
                                        durationTargetAddressList.find((item) => !item.addressType)
                                            .id,
                                        'address',
                                        durationTargetAddressList.find((item) => !item.addressType)
                                            .name
                                    )}
                                >
                                    {
                                        durationTargetAddressList.find((item) => !item.addressType)
                                            .name
                                    }
                                </span>
                            ) : (
                                <span className={styles.noAddress}>
                                    {trans('global.noAddress', '无')}
                                </span>
                            )}
                            <span className={styles.conflictSingleArrow}>
                                <span className={styles.singleConnectLines}></span>
                                <span className={styles.singleChangeArrow}></span>
                            </span>
                            {durationTargetAddressList.find((item) => item.addressType) ? (
                                <span
                                    className={styles.address}
                                    onClick={this.getSchedule.bind(
                                        this,
                                        durationTargetAddressList.find((item) => item.addressType)
                                            .id,
                                        'address',
                                        durationTargetAddressList.find((item) => item.addressType)
                                            .name
                                    )}
                                >
                                    {
                                        durationTargetAddressList.find((item) => item.addressType)
                                            .name
                                    }
                                </span>
                            ) : (
                                <span className={styles.noAddress}>
                                    {trans('global.noAddress', '无')}
                                </span>
                            )}
                        </p>
                    )
                ) : null}
            </div>
        );
    }
}
